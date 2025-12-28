const express = require('express');
const multer = require('multer');
const mediaController = require('../controllers/media.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const upload = multer(); // memory storage

const router = express.Router();

// Admin-protected upload endpoint
router.post('/upload', authMiddleware, adminMiddleware, upload.single('file'), mediaController.uploadMedia);
router.get('/', authMiddleware, adminMiddleware, mediaController.listMedia);

module.exports = router;
