import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Field, Form, Formik } from "formik";

const taskRoutes = {
    UnosOsnovnihPodataka: {
        label: "Unos osnovnih podataka",
        route: "/osnovni-podaci"
    },
    ValidacijaMentora: {
        label: "Validacija mentora",
        route: "/validacija"
    },
};

export default function PregledZadataka() {
    const [paligasi, setPaligasi] = useState([false]);
    const [zadaci, setZadaci] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                console.warn("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/zadaci", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch tasks");

                const data = await response.json();
                console.log("Fetched tasks:", data.tasks);
                setZadaci(data.tasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };

        fetchTasks();
    }, [navigate]);

    return (
        <div className="App">
            <div className="login-container">
                <h1>Trenutni zadatak</h1>

                {zadaci.length > 0 && (
                    <div className="task-cards">
                        {zadaci.map((task) => {
                            const taskInfo = task.taskDefinitionKey;

                            return (
                                <div key={task.id} className="task-card">
                                    <h3>{taskInfo?.label || task.name}</h3>
                                    <p>Task key: {task.taskDefinitionKey}</p>
                                    {taskInfo ? (
                                        <button onClick={() => navigate("/zadaci/" + taskInfo + "?taskId=" + task.id)}>
                                            Nastavi
                                        </button>
                                    ) : (
                                        <p>Nema mape za ovu fazu</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
