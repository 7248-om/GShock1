const express = require('express');
const artworkController = require('../controllers/artwork.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/', artworkController.getArtworks);
router.get('/:id', artworkController.getArtworkById);
router.post('/', authMiddleware, adminMiddleware, artworkController.createArtwork);
router.put('/:id', authMiddleware, adminMiddleware, artworkController.updateArtwork);
router.delete('/:id', authMiddleware, adminMiddleware, artworkController.deleteArtwork);

module.exports = router;
