const express = require('express');
const franchiseController = require('../controllers/franchise.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Public: Create franchise lead (can be from logged-in or guest user)
router.post('/', franchiseController.createFranchiseLead);

// Admin: Get all franchise leads
router.get('/', authMiddleware, adminMiddleware, franchiseController.getFranchiseLeads);

// Admin: Get specific franchise lead
router.get('/:id', authMiddleware, adminMiddleware, franchiseController.getFranchiseLeadById);

// Admin: Update franchise lead status
router.put('/:id/status', authMiddleware, adminMiddleware, franchiseController.updateFranchiseLeadStatus);

// Admin: Update franchise lead
router.put('/:id', authMiddleware, adminMiddleware, franchiseController.updateFranchiseLead);

// Admin: Delete franchise lead
router.delete('/:id', authMiddleware, adminMiddleware, franchiseController.deleteFranchiseLead);

module.exports = router;
