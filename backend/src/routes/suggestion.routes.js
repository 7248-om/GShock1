const express = require('express');
const suggestionController = require('../controllers/suggestion.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Public/User routes - GET suggestions is public (works for both guests and authenticated users)
router.get('/', suggestionController.getSuggestions);
router.post('/track', authMiddleware, suggestionController.trackSearch);

// Admin routes
router.get('/admin/defaults', authMiddleware, adminMiddleware, suggestionController.getDefaultSuggestions);
router.patch('/admin/defaults', authMiddleware, adminMiddleware, suggestionController.updateDefaultSuggestions);

router.get('/admin/users', authMiddleware, adminMiddleware, suggestionController.getAllUserSuggestions);
router.patch('/admin/users/:userId', authMiddleware, adminMiddleware, suggestionController.setUserSuggestions);
router.delete('/admin/users/:userId', authMiddleware, adminMiddleware, suggestionController.removeUserSuggestions);

router.patch('/admin/settings', authMiddleware, adminMiddleware, suggestionController.updateSuggestionSettings);

module.exports = router;
