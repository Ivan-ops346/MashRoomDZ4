const getZadaci = async (req, res) => {
    try {
        console.log("#####")
        console.log("#####" + req.korisnik)
        const userId = req.korisnik.id;
        const camundaUserId = `korisnik${userId}`;

        const response = await fetch(`http://localhost:8084/engine-rest/task?assignee=${camundaUserId}`);
        if (!response.ok) {
            throw new Error(`Camunda error: ${response.statusText}`);
        }

        const tasks = await response.json();

        console.log(tasks);

        return res.json({ tasks });
    } catch (err) {
        console.error("Failed to fetch Camunda tasks:", err);

        res.status(500).json({ error: "Could not fetch tasks from Camunda" });
    }
};

const startZadatak = async (req, res) => {
    try {
        
        const userId = req.korisnik.id;
        const camundaUserId = `korisnik${userId}`;

        const startRes = await fetch(
            `http://localhost:8084/engine-rest/process-definition/key/PrijavaDodjeleUloge/start`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variables: {
                        pokretac: { value: camundaUserId, type: 'String' }
                    }
                })
            }
        );

        console.log(startRes);

        if (!startRes.ok) throw new Error(startRes.statusText);
        const { id: processInstanceId } = await startRes.json();

        const tasksRes = await fetch(
            `http://localhost:8084/engine-rest/task?processInstanceId=${processInstanceId}`
        );
        if (!tasksRes.ok) throw new Error(tasksRes.statusText);
        const tasks = await tasksRes.json();
        if (!tasks.length) return res.status(404).json({ error: 'No tasks found' });

        return res.json({
            task: tasks[0],
            initiatedBy: camundaUserId
        });

    } catch (err) {
        console.error("StartZadatak error:", err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = { getZadaci, startZadatak };


