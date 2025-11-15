# Analytics Backend Starter

A minimal, copy-paste starter for the assessment. Use this to learn and adapt — understand every line before submitting.

## Quick start
1. Copy files into a folder.
2. Create `.env` from `.env.example` and set `DATABASE_URL`.
3. Run `npm install`.
4. Run DB migration: `npm run migrate`.
5. Start server: `npm run dev` (requires nodemon) or `npm start`.

## Endpoints
- POST /api/auth/register -> { name, ownerEmail }
- GET /api/auth/api-key?appId=... -> get current api key
- POST /api/auth/revoke -> { apiKey }
- POST /api/auth/regenerate -> { appId }
- POST /api/analytics/collect -> x-api-key header, body: event, timestamp, etc.
- GET /api/analytics/event-summary?event=...&startDate=...&endDate=...&app_id=...
- GET /api/analytics/user-stats?userId=...

## Notes
- This is a starter. For production, add Redis caching, partition events, encryption for keys, monitoring, and more.


// FILE: tests/analytics.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

let apiKey;
let appId;

beforeAll(async () => {
  // ensure migrations ran
  await db.query('SELECT 1');
});

afterAll(async () => {
  // close DB pool
  const pool = require('pg').Pool;
});

test('register app and collect an event', async () => {
  const r = await request(app).post('/api/auth/register').send({ name: 'test', ownerEmail: 'a@b.com' }).expect(201);
  apiKey = r.body.apiKey;
  appId = r.body.app.id;

  await request(app)
    .post('/api/analytics/collect')
    .set('x-api-key', apiKey)
    .send({ event: 'login_click', timestamp: new Date().toISOString(), device: 'mobile' })
    .expect(201);

  const summary = await request(app)
    .get('/api/analytics/event-summary')
    .set('x-api-key', apiKey)
    .query({ event: 'login_click' })
    .expect(200);
  expect(summary.body.count).toBeGreaterThanOrEqual(1);
});


/* End of files */
