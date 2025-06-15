const startProcess = async () => {
    try {
        const response = await fetch('http://localhost:8080/engine-rest/process-definition/key/my-process/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                variables: {
                    someVar: { value: 'example', type: 'String' }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error starting process:', error);
    }
};
