const express = require('express');
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route: POST /api/chat
// We make auth optional here. If the frontend sends a token, we log the user. 
// If not, we treat them as a guest.
// Note: You might need to adjust authMiddleware to not throw an error if token is missing,
// or creating a separate "optionalAuth" middleware. 
// For now, we will assume this is an authenticated route or public route based on your preference.
// To make it fully public but tracking users:
router.post('/', async (req, res, next) => {
    // Simple inline check to see if user is logged in, without blocking guests
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            await authMiddleware(req, res, next);
        } else {
            next();
        }
    } catch (e) {
        next(); // Proceed as guest if auth fails
    }
}, chatController.chatWithAI);

module.exports = router;