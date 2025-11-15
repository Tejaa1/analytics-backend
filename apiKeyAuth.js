const db = require('../db');

module.exports = async function apiKeyAuth(req, res, next) {
  try {
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ error: 'API key required' });
    const q = await db.query('SELECT * FROM api_keys WHERE api_key = $1', [key]);
    if (q.rows.length === 0) return res.status(401).json({ error: 'Invalid API key' });
    const ak = q.rows[0];
    if (ak.revoked) return res.status(403).json({ error: 'API key revoked' });
    if (ak.expires_at && new Date(ak.expires_at) < new Date()) return res.status(403).json({ error: 'API key expired' });
    req.appId = ak.app_id;
    req.apiKeyRow = ak;
    next();
  } catch (err) {
    next(err);
  }
};

