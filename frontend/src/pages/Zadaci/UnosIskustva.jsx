import { useEffect, useState} from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import '../Login.css';
import { Field, Form, Formik } from "formik";

export default function UnosIskustva() {
    const [paligasi, setPaligasi] = useState([false]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("taskId");

    console.log(taskId)

    const validate = (values) => {
        const errors = {};
        const required = [
        'name','surname','oib','experience',
        'place','favoriteMushroom','dob'
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
                place:           { value: values.place,           type: 'String' },
                favoriteMushroom:{ value: values.favoriteMushroom,type: 'String' },
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
        <h1>Unos iskustva</h1>

        <Formik
          initialValues={{
            name:'', surname:'', oib:'', experience:'',
            place:'', favoriteMushroom:'', dob:''
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
                { key:'place',           label:'Place of Mushroom Picking' },
                { key:'favoriteMushroom',label:'Favorite Mushroom' },
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