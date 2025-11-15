const db = require('../db');
const crypto = require('crypto');
const API_KEY_LEN = parseInt(process.env.API_KEY_LENGTH || '40', 10);

function generateKey(len = API_KEY_LEN) {
  return crypto.randomBytes(len).toString('hex').slice(0, len);
}

exports.registerApp = async (req, res, next) => {
  try {
    const { name, ownerEmail } = req.body;
    if (!name || !ownerEmail) return res.status(400).json({ error: 'name and ownerEmail required' });

    const appRes = await db.query(
      'INSERT INTO apps (name, owner_email) VALUES ($1, $2) RETURNING id, name, owner_email, created_at',
      [name, ownerEmail]
    );
    const app = appRes.rows[0];
    const apiKey = generateKey();
    await db.query(
      'INSERT INTO api_keys (app_id, api_key) VALUES ($1, $2)',
      [app.id, apiKey]
    );
    return res.status(201).json({ app, apiKey });
  } catch (err) {
    next(err);
  }
};

exports.getApiKey = async (req, res, next) => {
  try {
    const { appId } = req.query;
    if (!appId) return res.status(400).json({ error: 'appId required' });
    const q = await db.query('SELECT api_key, revoked, expires_at, created_at FROM api_keys WHERE app_id = $1 ORDER BY created_at DESC LIMIT 1', [appId]);
    if (q.rows.length === 0) return res.status(404).json({ error: 'api key not found' });
    return res.json(q.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.revokeApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'apiKey required' });
    await db.query('UPDATE api_keys SET revoked = true WHERE api_key = $1', [apiKey]);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.regenerateApiKey = async (req, res, next) => {
  try {
    const { appId } = req.body;
    if (!appId) return res.status(400).json({ error: 'appId required' });
    // revoke existing keys
    await db.query('UPDATE api_keys SET revoked = true WHERE app_id = $1', [appId]);
    const newKey = generateKey();
    await db.query('INSERT INTO api_keys (app_id, api_key) VALUES ($1,$2)', [appId, newKey]);
    return res.json({ apiKey: newKey });
  } catch (err) {
    next(err);
  }
};

