const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const { initDB } = require('./db');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// Basic global rate limiter
const globalLimiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

// basic healthcheck
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// init DB (create tables if not exists)
initDB().catch(err => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

module.exports = app;

