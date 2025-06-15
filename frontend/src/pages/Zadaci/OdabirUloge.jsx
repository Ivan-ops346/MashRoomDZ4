import { useEffect, useState} from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import '../Login.css';
import { Field, Form, Formik } from "formik";

export default function OdabirUloge() {
    const [paligasi, setPaligasi] = useState([false]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("taskId");

    console.log(taskId)

    const handleComplete = async ({ role }) => {
        try {

        const res = await fetch(
        `/camunda/engine-rest/task/${taskId}/complete`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            variables: {
                requestedRole: { value: role, type: 'String' }
            }
            })
        }
        );

        if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Camunda error ${res.status}: ${txt}`);
        }

        alert('Uloga poslana, task završen!')
        nav('/PregledZadataka')
        } catch (e) {
        console.error(e)
        alert('Greška pri slanju uloge')
        }
    }

    return (
        <div className="App">
            <div className="login-container">
                <h1>Biraj Rolu</h1>
                <Formik
                    initialValues={{
                        role: "determinator",
                    }}
                    onSubmit={handleComplete}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form>
                            
                                <select
                                    name="role"
                                    value={values.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="iskusni">iskusni</option>
                                    <option value="determinator">determinator</option>
                                    <option value="determinatorMentor">determinatorMentor</option>
                                </select>
                            <button type="submit">Submit</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
