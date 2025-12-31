const express = require('express');
const workshopController = require('../controllers/workshop.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public: Get approved workshops only
router.get('/', workshopController.getWorkshops);

// Public: Get workshop by ID
router.get('/:id', workshopController.getWorkshopById);

// Logged-in user: Create workshop (goes to Pending)
router.post('/', authMiddleware, workshopController.createWorkshopByUser);

// Admin: Get all workshops (all statuses) for admin review
router.get('/admin/all', authMiddleware, adminMiddleware, workshopController.getAllWorkshopsForAdmin);

// Admin: Get pending workshops for approval
router.get('/admin/pending', authMiddleware, adminMiddleware, workshopController.getPendingWorkshops);

// Admin: Approve or reject workshop
router.put('/:id/status', authMiddleware, adminMiddleware, workshopController.updateWorkshopStatus);

// Admin: Update workshop (if needed)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), workshopController.updateWorkshopWithImage);

// Admin: Delete workshop
router.delete('/:id', authMiddleware, adminMiddleware, workshopController.deleteWorkshop);

module.exports = router;
