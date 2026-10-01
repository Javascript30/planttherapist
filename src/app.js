const express = require('express');
const { sql } = require('drizzle-orm');
const { join } = require('node:path');
// const validator = require('validator');
const { getDb } = require('./db/index.js');
const { subscribers } = require('./db/schema.js');

const app = express();
const publicDir = join(__dirname, '..', 'public');

app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

// app.get('/health', (req, res) => {
//   res.status(503).json({
//     status: 'error',
//     message:
//       'The garden gnomes have invaded our system and have broken everything!',
//   });
// });

app.get('/health', async (req, res) => {
  try {
    await getDb().execute(sql`select 1`);

    res.status(200).json({
      status: 'ok',
    });
  } catch (err) {
    console.error('Health check failed:', err);

    res.status(503).json({
      status: 'error',
      message: 'Database unavailable',
    });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const email =
      typeof req.body?.email === 'string' ? req.body.email.trim() : '';

    // if (!validator.isEmail(email)) {
    if(!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const db = getDb();

    await db
      .insert(subscribers)
      .values({ emailAddress: email })
      .onConflictDoNothing({ target: subscribers.emailAddress });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = app;
