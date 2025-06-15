import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ProvjeraIskusni() {
  const [search]   = useSearchParams();
  const taskId     = search.get('taskId');
  const [vars, setVars] = useState(null);
  const navigate   = useNavigate();

  useEffect(() => {
    if (!taskId) return;
    fetch(`/camunda/engine-rest/task/${taskId}/variables?deserializeValues=false`)
      .then(r => r.json())
      .then(setVars)
      .catch(console.error);
  }, [taskId]);

  const completeWithResult = async (result) => {
    try {
      const res = await fetch(`/camunda/engine-rest/task/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variables: { rezultatProvjere: { value: result, type: 'String' } }
        })
      });
      if (!res.ok) throw new Error(await res.text());
      navigate('/pregledZadataka');
    } catch (e) {
      console.error(e);
      alert('Greška pri slanju rezultata');
    }
  };

  if (!taskId) return <p>taskId nije u URL-u</p>;
  if (!vars)   return <p>Učitavanje…</p>;

  const show = (k) => vars[k]?.value ?? '—';

  const styles = {
    wrap:   { maxWidth: 520, margin: '20px auto', padding: 32,
              border: '1px solid #ddd', borderRadius: 12, background: '#fafafa',
              boxShadow: '0 2px 4px rgba(0,0,0,.05)' },
    list:   { listStyle: 'none', padding: 0, marginBottom: 24 },
    li:     { marginBottom: 8 },
    btnRow: { display: 'flex', gap: 12 },
    btn:    { flex: 1, padding: '10px 14px', fontWeight: 600,
              border: 'none', borderRadius: 6, cursor: 'pointer' },
    yes:    { background: '#2ecc71', color: '#fff' },
    no:     { background: '#e74c3c', color: '#fff' },
    redo:   { background: '#f1c40f', color: '#000' }
  };

  return (
    <div style={styles.wrap}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        Provjera unosa iskusnog berača
      </h2>

      <ul style={styles.list}>
        <li style={styles.li}><strong>Name:</strong> {show('name')}</li>
        <li style={styles.li}><strong>Surname:</strong> {show('surname')}</li>
        <li style={styles.li}><strong>OIB:</strong> {show('oib')}</li>
        <li style={styles.li}><strong>Experience:</strong> {show('experience')}</li>
        <li style={styles.li}><strong>Place:</strong> {show('place')}</li>
        <li style={styles.li}><strong>Favorite mushroom:</strong> {show('favoriteMushroom')}</li>
        <li style={styles.li}><strong>DOB:</strong> {show('dob')}</li>
      </ul>

      <div style={styles.btnRow}>
        <button style={{ ...styles.btn, ...styles.yes  }}
                onClick={() => completeWithResult('yes')}>
          Prihvati
        </button>
        <button style={{ ...styles.btn, ...styles.no   }}
                onClick={() => completeWithResult('no')}>
          Odbij
        </button>
        <button style={{ ...styles.btn, ...styles.redo }}
                onClick={() => completeWithResult('redo')}>
          Vrati na doradu
        </button>
      </div>
    </div>
  );
}