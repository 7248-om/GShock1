const express = require('express');
const marketingController = require('../controllers/marketing.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Get all email recipients
router.get('/recipients', marketingController.getEmailRecipients);

// Send broadcast email to all users
router.post('/broadcast', marketingController.sendBroadcast);

// Save email template
router.post('/template', marketingController.saveEmailTemplate);

module.exports = router;
