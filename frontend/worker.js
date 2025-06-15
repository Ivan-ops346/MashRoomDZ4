import pkg from 'pg';
import { Client, logger } from 'camunda-external-task-client-js';

const CAMUNDA_BASE = 'http://localhost:8084/engine-rest';
const AUTH         = 'Basic ' + Buffer.from('demo:demo').toString('base64');
const { Pool }     = pkg;

const PG = new Pool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     process.env.DB_PORT     ?? 5432,
  user:     process.env.DB_USER     ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'Zw5yY9Lc',
  database: process.env.DB_NAME     ?? 'Mushroom'
});

async function ensureGroup(id, name) {
  const listRes = await fetch(`${CAMUNDA_BASE}/group?id=${id}`, {
    headers: { Authorization: AUTH }
  });
  const groups = await listRes.json();
  if (groups.length) return console.log(`Group "${id}" already exists`);

  const createRes = await fetch(`${CAMUNDA_BASE}/group`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization: AUTH },
    body: JSON.stringify({ id, name, type: 'WORKFLOW' })
  });
  if (createRes.ok) {
    console.log(`Group "${id}" successfully created`);
  } else {
    console.error(`Failed to create group "${id}" – HTTP ${createRes.status}`);
  }
}

async function addUserToGroup(camId, groupId) {
  const res = await fetch(`${CAMUNDA_BASE}/group/${groupId}/members/${camId}`, {
    method: 'PUT',
    headers: { Authorization: AUTH }
  });
  console.log(
    res.ok
      ? `Added ${camId} to group ${groupId}`
      : `Could not add ${camId} to ${groupId} – HTTP ${res.status}`
  );
}

;(async () => {
  await ensureGroup('iskusni', 'Iskusni korisnici');

  const client = new Client({
    baseUrl: CAMUNDA_BASE,
    asyncResponseTimeout: 10000,
    workerId: 'worker-iskusni',
    use: logger
  });

  console.log('Worker “dodavanje-iskusni” aktivan…');

  client.subscribe('dodavanje-iskusni', async ({ task, taskService }) => {
    try {
      const camundaUserId = task.variables.get('pokretac');
      const dbId = Number(camundaUserId.replace(/^korisnik/, ''));

      await PG.query(`
        UPDATE Korisnik
        SET    uloga = 'iskusni'
        WHERE  id_korisnik = $1;

        INSERT INTO IskusniKorisnik (id_korisnik, determinator)
        VALUES ($1, FALSE)
        ON CONFLICT (id_korisnik) DO NOTHING;
      `, [dbId]);

      await addUserToGroup(camundaUserId, 'iskusni');

      await taskService.complete(task, new Map([['dodavanjeStatus','ok']]));
      console.log(`Korisnik ${dbId} promoviran u iskusnog`);
    } catch (err) {
      console.error('Worker error:', err.message);
      await taskService.handleFailure(task, {
        errorMessage: err.message,
        retries: 0,
        retryTimeout: 0
      });
    }
  });

  client.subscribe('dodjela-pripravnik', async ({ task, taskService }) => {
    try {
      const camundaUserId = task.variables.get('pokretac');
      const dbId = Number(camundaUserId.replace(/^korisnik/, ''));

      await PG.query(
        `UPDATE Korisnik
         SET uloga = 'determinator-pripravnik'
         WHERE id_korisnik = $1`,
        [dbId]
      );
      console.log(`User ${dbId} uloga postavljena: determinator-pripravnik`);

      await taskService.complete(task);
      console.log(`ServiceTask dodjela-pripravnik za korisnika ${dbId} complete`);
    } catch (err) {
      console.error('Error in dodjela-pripravnik:', err.message);
      await taskService.handleFailure(task, {
        errorMessage: err.message,
        retries: 0,
        retryTimeout: 0
      });
    }
  });

  client.subscribe('dodjela-uloge', async ({ task, taskService }) => {
    try {
      const camundaUserId = task.variables.get('pokretac');
      const requestedRole = task.variables.get('requestedRole');
      const dbId = Number(camundaUserId.replace(/^korisnik/, ''));

      await PG.query(
        `UPDATE Korisnik
         SET uloga = $1
         WHERE id_korisnik = $2`,
        [requestedRole, dbId]
      );
      console.log(`User ${dbId} uloga postavljena: ${requestedRole}`);

      await taskService.complete(task);
      console.log(`ServiceTask dodjela-uloge za korisnika ${dbId} complete`);
    } catch (err) {
      console.error('Error in dodjela-uloge:', err.message);
      await taskService.handleFailure(task, {
        errorMessage: err.message,
        retries: 0,
        retryTimeout: 0
      });
    }
  });

})();