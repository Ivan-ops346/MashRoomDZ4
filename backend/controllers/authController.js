const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const login = async (req, res) => {
    const { email, lozinka } = req.body;
  
    try {
        const rezultat = await pool.query(
            "SELECT id_korisnik, email, lozinka, ime, uloga FROM Korisnik WHERE email = $1",
            [email]
        );
    
        if (rezultat.rows.length === 0) {
            return res.status(401).json({ error: "Ne postoji korisnik s tim emailom" });
        }
    
        const korisnik = rezultat.rows[0];
    
        const isMatch = await bcrypt.compare(lozinka, korisnik.lozinka);
    
        if (!isMatch) {
            return res.status(401).json({ error: "Netočna lozinka" });
        }
    
        const token = jwt.sign(
            { id: korisnik.id_korisnik, ime: korisnik.ime },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "2h" }
        );

        return res.json({
            token,
            ime: korisnik.ime,
            uloga: korisnik.uloga
        });
        } catch (err) {
            console.error("Greška u loginu:", err.message);
            res.status(500).json({ error: "Greška na serveru" });
        }
    };

const register = async (req, res) => {
    const { email, ime, lozinka } = req.body;

    if (!email || !ime || !lozinka) {
        console.log("DEBUG: Missing required fields");
        return res.status(400).json({ error: "Sva polja su obavezna" });
    }

    try {
        console.log(`DEBUG: Checking if user with email ${email} exists`);
        const postoji = await pool.query(
            "SELECT id_korisnik FROM Korisnik WHERE email = $1",
            [email]
        );

        if (postoji.rows.length > 0) {
            console.log(`DEBUG: User with email ${email} already exists`);
            return res.status(409).json({ error: "Korisnik s tim emailom već postoji" });
        }

        const maxIdResult = await pool.query("SELECT MAX(id_korisnik) as max_id FROM Korisnik");
        const seqResult = await pool.query("SELECT last_value FROM korisnik_id_korisnik_seq");
        const maxId = maxIdResult.rows[0].max_id;
        const seqLastValue = seqResult.rows[0].last_value;
        console.log(`DEBUG: max(id_korisnik) = ${maxId}, sequence last_value = ${seqLastValue}`);

        if (seqLastValue < maxId) {
            console.warn(
                `WARNING: Sequence last_value (${seqLastValue}) is less than max id_korisnik (${maxId}). This may cause duplicate key errors.`
            );
        }

        const salt = await bcrypt.genSalt(12);
        const hashedLozinka = await bcrypt.hash(lozinka, salt);

        console.log("DEBUG: Inserting new user");
        const rezultat = await pool.query(
            `INSERT INTO Korisnik (email, lozinka, sol, ime, datum_registracije, uloga)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, 'osnovni')
                 RETURNING id_korisnik, ime`,
            [email, hashedLozinka, salt, ime]
        );

        const noviKorisnik = rezultat.rows[0];
        console.log(`DEBUG: New user inserted with id_korisnik=${noviKorisnik.id_korisnik}`);

        const camundaUserId = `korisnik${noviKorisnik.id_korisnik}`;

        try {
            console.log(`DEBUG: Creating user in Camunda with id=${camundaUserId}`);

            let response = await fetch("http://localhost:8084/engine-rest/user/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: {
                        id: camundaUserId,
                        firstName: ime,
                        lastName: "",
                        email,
                    },
                    credentials: {
                        password: lozinka,
                    }
                })
            });

            if (!response.ok) {
                let errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            console.log(`DEBUG: Adding user to Camunda group 'osnovni'`);

            response = await fetch(`http://localhost:8084/engine-rest/group/osnovni/members/${camundaUserId}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                let errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

        } catch (camundaErr) {
            console.error("❌ Camunda user creation failed:", camundaErr.message);

            console.log(`DEBUG: Rolling back user in DB with id_korisnik=${noviKorisnik.id_korisnik}`);
            await pool.query("DELETE FROM Korisnik WHERE id_korisnik = $1", [noviKorisnik.id_korisnik]);

            return res.status(500).json({
                error: "Greška pri sinkronizaciji s Camunda sustavom. Pokušajte ponovno."
            });
        }

        const token = jwt.sign(
            { id: noviKorisnik.id_korisnik, ime: noviKorisnik.ime },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "2h" }
        );

        return res.status(201).json({ token, ime: noviKorisnik.ime });

    } catch (err) {
        console.error("Greška pri registraciji:", err);
        return res.status(500).json({ error: "Greška na serveru" });
    }
};

module.exports = { login, register };
