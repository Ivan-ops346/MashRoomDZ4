import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartZadatak() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const checkAndStartProcess = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const tasksRes = await fetch(`${import.meta.env.VITE_API_URL}/zadaci`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tasksRes.ok) throw new Error("Failed to check tasks");

        const { tasks } = await tasksRes.json();

        const alreadyStarted = tasks.some(task =>
            task.processDefinitionId?.startsWith("PrijavaDodjeleUloge:")
        );

        if (!alreadyStarted) {
          const startRes = await fetch(`${import.meta.env.VITE_API_URL}/zadaci/start`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!startRes.ok) {
            const errData = await startRes.text();
            throw new Error(`Process start failed: ${errData}`);
          }

          console.log("PrijavaDodjeleUloge process started");
        } else {
          console.log("PrijavaDodjeleUloge process already running");
        }

        const finalTasksRes = await fetch(`${import.meta.env.VITE_API_URL}/zadaci`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { tasks: currentTasks } = await finalTasksRes.json();
        const relevantTask = currentTasks.find(task =>
            task.processDefinitionId?.startsWith("PrijavaDodjeleUloge:")
        );

        if (relevantTask?.name === "UnosOsnovnihPodataka") {
          navigate("/osnovni-podaci");
        } else if (relevantTask?.name === "ValidacijaMentora") {
          navigate("/validacija");
        }

      } catch (err) {
        console.error("Error in process logic:", err.message);
      }
    };

    checkAndStartProcess();
  }, [navigate]);

  return <p style={{ padding: 20 }}>Pokrećem Camunda proces…</p>;
}