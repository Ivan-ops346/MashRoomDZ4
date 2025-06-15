import { useEffect, useState} from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import '../Login.css';
import { Field, Form, Formik } from "formik";

export default function UploadDokumenta() {
    const [paligasi, setPaligasi] = useState([false]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("taskId");

    console.log(taskId)

    const validate = (values) => {
        const errors = {};
        const required = [
        'name','surname','oib','experience',
        'documentlink','dob'
        ];
        required.forEach(key => {
        if (!values[key]) errors[key] = 'Obavezno polje';
        });
        return errors;
    };

    const handleComplete = async (values) => {
        try {
        const res = await fetch(
            `/camunda/engine-rest/task/${taskId}/complete`,
            {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({
                variables: {
                name:            { value: values.name,            type: 'String' },
                surname:         { value: values.surname,         type: 'String' },
                oib:             { value: values.oib,             type: 'String' },
                experience:      { value: values.experience,      type: 'String' },
                documentlink:           { value: values.documentlink,           type: 'String' },
                dob:             { value: values.dob,             type: 'String' }
                }
            })
            }
        );
        if (!res.ok) throw new Error(await res.text());
        alert('Podaci poslani, task završen');
        navigate('/pregledZadataka');
        } catch (err) {
        console.error(err);
        alert('Greska pri handleComplete zadatka');
        }
    };
    
    if (!taskId) return <p>taskId nije u URL-u</p>;

  return (
    <div className="App">
      <div className="login-container">
        <h1>Unos dokumenta</h1>

        <Formik
          initialValues={{
            name:'', surname:'', oib:'', experience:'',
            documentlink:'', dob:''
          }}
          validate={validate}
          onSubmit={handleComplete}
        >
          {() => (
            <Form>
              {[
                { key:'name',            label:'Name' },
                { key:'surname',         label:'Surname' },
                { key:'oib',             label:'OIB' },
                { key:'experience',      label:'Mushroom Picking Experience' },
                { key:'documentlink',           label:'Link to proof document' },
                { key:'dob',             label:'Date of Birth', type:'date' }
              ].map(({ key, label, type }) => (
                <div key={key} style={{ marginBottom:10 }}>
                  <label style={{ display:'block' }}>{label}</label>
                  <Field name={key} type={type || 'text'} />
            
                </div>
              ))}

              <button type="submit" style={{ marginTop:12 }}>Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}