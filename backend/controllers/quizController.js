const pool = require('../db');

const getPitanja = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Pitanje');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška pri dohvaćanju pitanja');
    }
};

const submitKviz = async (req, res) => {
    const korisnickiOdgovori = req.body.odgovori;
    try {
        const pitanja = await pool.query('SELECT id_pitanje, tocan_odgovor FROM Pitanje');
        const mapaTocnih = Object.fromEntries(pitanja.rows.map(p => [p.id_pitanje, p.tocan_odgovor]));

        let tocni = 0;
        korisnickiOdgovori.forEach(odg => {
            if (mapaTocnih[odg.id_pitanje] === odg.odgovor) tocni++;
        });

        const postotak = Math.round((tocni / pitanja.rowCount) * 100);
        res.json({ rezultat: postotak });
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška pri slanju kviza');
    }
};

module.exports = { getPitanja, submitKviz };
