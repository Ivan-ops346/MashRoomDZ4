import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function IspitGljive() {
  const [search] = useSearchParams();
  const taskId = search.get('taskId');
  const [instanceId, setInstanceId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId) return;
    fetch(`/camunda/engine-rest/task/${taskId}`)
      .then(r => r.json())
      .then(t => setInstanceId(t.processInstanceId))
      .catch(console.error);
  }, [taskId]);

  const questions = [
    { id: 1, text: 'Koja gljiva je jestiva?', options: { A:'Rizika', B:'Jagodnjak', C:'Ljuljka', D:'Stršljenka' }, correct: 'B' },
    { id: 2, text: 'Latinski naziv vrganja?', options: { A:'Amanita muscaria', B:'Boletus edulis', C:'Cantharellus cibarius', D:'Agaricus bisporus' }, correct: 'B' },
    { id: 3, text: 'Sezona mliječnica je?', options: { A:'Proljeće', B:'Zima', C:'Ljeto', D:'Jesen' }, correct: 'D' },
    { id: 4, text: 'Gljiva Amanita phalloides poznata je kao?', options: { A:'Panterska mušnica', B:'Otrovan bijeli', C:'Zelena mušnica', D:'Crvena mušnica' }, correct:'C' },
    { id: 5, text: 'Toksični spoj u nekim gljivama:', options:{ A:'Psilocin', B:'Amatin', C:'Klorofil', D:'Hematitin' }, correct:'B' },
    { id: 6, text: 'Gljive se razmnožavaju…?', options:{ A:'Sjemenkama', B:'Skratokožnim', C:'Parazitima', D:'Stanicama' }, correct:'B' },
    { id: 7, text: 'Boja spora bukovače je…?', options:{ A:'Bijela', B:'Žuta', C:'Ružičasta', D:'Smeđa' }, correct:'B' },
    { id: 8, text: 'Gljive su bliže…?', options:{ A:'Biljkama', B:'Živinjama', C:'Bakterijama', D:'Virusima' }, correct:'B' },
    { id: 9, text: 'Osnovna stanica gljive je…?', options:{ A:'Sporozoit', B:'Hifa', C:'Miselij', D:'Plazmodezma' }, correct:'B' },
    { id:10, text: 'Pravilna term te obrada gljiva prije konzumacije?', options:{ A:'Sirovo pranje', B:'Blanširanje i kuhanje', C:'Sušenje bez pranja', D:'Staviti u mikrovalku' }, correct:'B' }
  ].map(q => ({
    id: q.id,
    text: q.text,
    options: q.options,
    correct: q.correct
  }));


  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.some(q => !answers[q.id])) {
      setError('Molimo odgovorite na sva pitanja.');
      return;
    }

    const correctCount = questions.reduce((cnt, q) =>
      cnt + (answers[q.id] === q.correct ? 1 : 0)
    , 0);
    const pct = (correctCount / questions.length) * 100;
    let rezultatIspita = 'pad';
    if (pct >= 80) rezultatIspita = 'izvanredanProlaz';
    else if (pct >= 50) rezultatIspita = 'prolaz';

    try {

      await fetch(`/camunda/engine-rest/task/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variables: {
            rezultatIspita: { value: rezultatIspita, type: 'String' }
          }
        })
      });


      const sigRes = await fetch(`/camunda/engine-rest/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'SignalIspitZavrsen',
          processInstanceId: instanceId,
          processVariables: {
            rezultatIspita: { value: rezultatIspita, type: 'String' }
          }
        })
      });
      if (!sigRes.ok) throw new Error(await sigRes.text());

      navigate('/pregledZadataka');
    } catch (err) {
      console.error(err);
      alert('Greška pri slanju rezultata ispita: ' + err.message);
    }
  };

  if (!taskId) return <p>taskId nije u URL-u</p>;
  if (!instanceId) return <p>Učitavanje zadatka…</p>;

  const S = {
    form:      { maxWidth:600, margin:'20px auto', padding:24, border:'1px solid #ddd', borderRadius:8 },
    question:  { marginBottom:20 },
    optLabel:  { display:'block', margin:'4px 0' },
    error:     { color:'red', marginBottom:12 },
    button:    { padding:'10px 16px', background:'#3498db', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' }
  };

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      <h2>Znanje o gljivama</h2>
      {error && <div style={S.error}>{error}</div>}

      {questions.map(q => (
        <div key={q.id} style={S.question}>
          <p><strong>{q.id}. {q.text}</strong></p>
          {Object.entries(q.options).map(([optKey, optText]) => (
            <label key={optKey} style={S.optLabel}>
              <input
                type="radio"
                name={`q${q.id}`}
                value={optKey}
                checked={answers[q.id] === optKey}
                onChange={() => handleChange(q.id, optKey)}
              /> {optKey}. {optText}
            </label>
          ))}
        </div>
      ))}

      <button type="submit" style={S.button}>
        Predaj ispit
      </button>
    </form>
  );
}
