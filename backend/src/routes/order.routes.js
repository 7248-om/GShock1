const express = require('express');
const workshopController = require('../controllers/workshop.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/', workshopController.getWorkshops);
router.get('/:id', workshopController.getWorkshopById);
router.post('/', authMiddleware, adminMiddleware, workshopController.createWorkshop);
router.put('/:id', authMiddleware, adminMiddleware, workshopController.updateWorkshop);
router.delete('/:id', authMiddleware, adminMiddleware, workshopController.deleteWorkshop);

module.exports = router;
