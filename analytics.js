const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middlewares/apiKeyAuth');
const rateLimit = require('express-rate-limit');
const analyticsController = require('../controllers/analytics');

// limit per API key for collect endpoint
const collectLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, keyGenerator: (req) => req.header('x-api-key') || req.ip });

router.post('/collect', collectLimiter, apiKeyAuth, analyticsController.collect);
router.get('/event-summary', apiKeyAuth, analyticsController.eventSummary);
router.get('/user-stats', apiKeyAuth, analyticsController.userStats);

module.exports = router;

