import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ProvjeraPozadine() {
  const [search]       = useSearchParams();
  const taskId         = search.get('taskId');
  const [vars, setVars]       = useState(null);
  const [instanceId, setInstanceId] = useState(null);
  const navigate       = useNavigate();

  useEffect(() => {
    if (!taskId) return;

    fetch(`/camunda/engine-rest/task/${taskId}/variables?deserializeValues=false`)
      .then(r => r.json())
      .then(setVars)
      .catch(console.error);

    fetch(`/camunda/engine-rest/task/${taskId}`)
      .then(r => r.json())
      .then(t => setInstanceId(t.processInstanceId))
      .catch(console.error);
  }, [taskId]);

  const handleAccept = async () => {
    if (!taskId || !instanceId) return;

    try {
      const completeRes = await fetch(
        `/camunda/engine-rest/task/${taskId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variables: {
              approved: { value: true, type: 'Boolean' }
            }
          })
        }
      );
      if (!completeRes.ok) {
        const txt = await completeRes.text();
        throw new Error(`Complete failed: ${txt}`);
      }

      const msgRes = await fetch(
        '/camunda/engine-rest/message',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messageName      : 'Message_30s822k',
            processInstanceId: instanceId,
            processVariables : {
              candidateGroups: {
                value: 'determinatorMentor',
                type: 'String'
              }
            }
          })
        }
      );
      if (!msgRes.ok) {
        const txt = await msgRes.text();
        throw new Error(`Message send failed: ${txt}`);
      }

      navigate('/pregledZadataka');
    } catch (err) {
      console.error(err);
      alert('Greška pri završetku i slanju poruke:\n' + err.message);
    }
  };

  if (!taskId) return <p>taskId nije u URL-u</p>;
  if (!vars)   return <p>Učitavanje…</p>;

  const show = (k) => vars[k]?.value ?? '—';

  const S = {
    wrap: { maxWidth:520, margin:'20px auto', padding:32,
            border:'1px solid #ddd', borderRadius:12, background:'#fafafa' },
    list:{ listStyle:'none', padding:0, marginBottom:24 },
    li  :{ marginBottom:8 },
    btn :{ padding:'10px 14px', border:'none', borderRadius:6,
           background:'#2ecc71', color:'#fff', fontWeight:600, cursor:'pointer' }
  };

  return (
    <div style={S.wrap}>
      <h2 style={{textAlign:'center',marginBottom:24}}>Provjera pozadine</h2>
      <ul style={S.list}>
        <li style={S.li}><strong>Name:</strong> {show('name')}</li>
        <li style={S.li}><strong>Surname:</strong> {show('surname')}</li>
        <li style={S.li}><strong>OIB:</strong> {show('oib')}</li>
        <li style={S.li}><strong>Experience:</strong> {show('experience')}</li>
        <li style={S.li}><strong>Document:</strong> {show('documentlink')}</li>
        <li style={S.li}><strong>DOB:</strong> {show('dob')}</li>
      </ul>

      {/* Complete the task first, then throw the message */}
      <button style={S.btn} onClick={handleAccept}>
        Prihvati
      </button>
    </div>
  );
}
