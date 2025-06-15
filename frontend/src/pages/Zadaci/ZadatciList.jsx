import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ZadatciList() {
  const [zadaci, setZadaci] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetch('/api/zadaci', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setZadaci(data.tasks || []))
      .catch(console.error);
  }, []);

  if (!zadaci.length) return <p>Nema zadataka.</p>;

  return (
    <ul>
      {zadaci.map(z => (
        <li key={z.id}>
          {z.name} 
          <button onClick={() => nav(`/zadatak/${z.id}`)}>Otvori</button>
        </li>
      ))}
    </ul>
  );
}
