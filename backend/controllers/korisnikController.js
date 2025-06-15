const pool = require('../db');

const postaniIskusni = async (req, res) => {
  const korisnikId = req.body.id_korisnik;

  try {
    await pool.query(
      'UPDATE korisnik SET uloga = $1 WHERE id_korisnik = $2',
      ['iskusni', korisnikId]
    );
    await pool.query(
      'INSERT INTO iskusnikorisnik (id_korisnik, determinator) VALUES ($1, FALSE)',
      [korisnikId]
    );

    res.status(200).json({ message: 'Korisnik je sada iskusni.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri promjeni u iskusnog korisnika.' });
  }
};

const postaniDeterminator = async (req, res) => {
  const korisnikId = req.body.id_korisnik;
  try {
    const result = await pool.query(
      'UPDATE iskusnikorisnik SET determinator = TRUE WHERE id_korisnik = $1',
      [korisnikId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Iskusni korisnik nije pronađen.' });
    }

    res.status(200).json({ message: 'Korisnik je sada determinator.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri postavljanju determinatora.' });
  }
};

module.exports = { postaniIskusni, postaniDeterminator };
