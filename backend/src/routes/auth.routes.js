const express = require('express');
const { 
  loginWithFirebase,
  forgotPasswordOtp, 
  verifyOtp, 
  resetPassword 
} = require('../controllers/auth.controller');

const router = express.Router();

// Existing Login
router.post('/login', loginWithFirebase);

// New Password Reset Routes
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;