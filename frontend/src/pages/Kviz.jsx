import { useEffect, useState } from "react";

export default function Kviz() {
  const [pitanja, setPitanja] = useState([]);
  const [trenutno, setTrenutno] = useState(0);
  const [odgovori, setOdgovori] = useState({});
  const [rezultat, setRezultat] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/kviz/pitanja`)
      .then(res => res.json())
      .then(data => setPitanja(data));
  }, []);

  const handleOdabir = (odgovor) => {
    setOdgovori(prev => ({
      ...prev,
      [pitanja[trenutno].id_pitanje]: odgovor
    }));
    setTrenutno(prev => prev + 1);
  };

  const handleSubmit = () => {
    const payload = Object.entries(odgovori).map(([id_pitanje, odgovor]) => ({
      id_pitanje: Number(id_pitanje),
      odgovor,
    }));

    fetch(`${import.meta.env.VITE_API_URL}/kviz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ odgovori: payload }),
    })
      .then(res => res.json())
      .then(data => setRezultat(data.rezultat));
  };

  if (rezultat !== null) return <h2>Rezultat: {rezultat}%</h2>;
  if (pitanja.length === 0) return <p>Učitavanje pitanja...</p>;
  if (trenutno >= pitanja.length) return <button onClick={handleSubmit}>Pošalji</button>;

  const pitanje = pitanja[trenutno];

  return (
    <div>
      <h2>{pitanje.tekst_pitanja}</h2>
      <ul>
        {['a', 'b', 'c', 'd'].map((key) => (
          <li key={key}>
            <button onClick={() => handleOdabir(key.toUpperCase())}>
              {pitanje[`odgovor_${key}`]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}