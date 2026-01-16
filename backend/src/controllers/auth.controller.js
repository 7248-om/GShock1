const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // <--- CHANGED: Use Axios instead of Nodemailer
const User = require('../models/user.model');

// --- FIREBASE INITIALIZATION (Unchanged) ---
if (!admin.apps.length) {
  let serviceAccountConfig = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccountConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log("✅ Loaded Firebase config from Environment Variable");
    } catch (err) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", err.message);
    }
  } else {
    try {
      serviceAccountConfig = require('../config/firebaseAdminKey.json');
      console.log("✅ Loaded Firebase config from local file");
    } catch (err) {
      console.warn("⚠️ Local firebaseAdminKey.json not found. Firebase features will fail.");
    }
  }

  if (serviceAccountConfig) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig),
    });
  } else {
    console.error("❌ Firebase Admin NOT initialized: No credentials found.");
  }
}

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- 1. EXISTING LOGIN FUNCTION (Unchanged) ---
async function loginWithFirebase(req, res) {
  const { idToken } = req.body || {};

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'idToken is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email not available from Firebase token' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log('👤 Creating new user:', email);
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        firebaseUid: uid,
      });
    } else {
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Firebase login failed:', error.message);
    let statusCode = 401;
    let message = 'Invalid Firebase token';
    
    if (error.code === 'auth/id-token-expired') message = 'Firebase token has expired.';
    else if (error.code === 'auth/invalid-id-token') message = 'Invalid Firebase token format.';
    
    return res.status(statusCode).json({ success: false, message, error: error.message });
  }
}

// --- 2. SEND OTP (UPDATED FOR EMAILJS) ---
async function forgotPasswordOtp(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    // Generate OTP and Expiry (5 minutes)
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    // Save to DB
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    // --- EMAILJS CONFIGURATION ---
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Access Token

    const emailData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email: email,      // Match this variable in your EmailJS Template
        to_name: user.name || "User",
        otp: otp              // Match this variable in your EmailJS Template
      }
    };

    // Send via EmailJS REST API
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);

    res.json({ success: true, message: "OTP sent successfully via EmailJS" });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

// --- 3. VERIFY OTP (Unchanged) ---
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() } // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
}

// --- 4. RESET PASSWORD (Unchanged) ---
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP one last time
    const user = await User.findOne({ 
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid request or OTP expired" });
    }

    // Determine Firebase UID
    let uid = user.firebaseUid;
    if (!uid) {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(email);
        uid = firebaseUser.uid;
      } catch (err) {
        return res.status(500).json({ success: false, message: "Could not find linked Firebase account." });
      }
    }

    // Update Password in Firebase
    await admin.auth().updateUser(uid, {
      password: newPassword
    });

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
}

module.exports = {
  loginWithFirebase,
  forgotPasswordOtp,
  verifyOtp,
  resetPassword
};