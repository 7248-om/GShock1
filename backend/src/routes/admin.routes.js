const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/report', authMiddleware, adminMiddleware, adminController.generateReport);
module.exports = router;
