const express = require('express');
const router = express.Router();
const { registerApp, getApiKey, revokeApiKey, regenerateApiKey } = require('../controllers/auth');

router.post('/register', registerApp);
router.get('/api-key', getApiKey);
router.post('/revoke', revokeApiKey);
router.post('/regenerate', regenerateApiKey);

module.exports = router;
