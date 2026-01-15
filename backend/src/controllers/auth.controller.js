const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // <--- NEW IMPORT
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

// --- EMAIL TRANSPORTER CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, // Add to .env
    pass: process.env.EMAIL_PASS  // Add to .env (App Password)
  }
});

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// --- 1. EXISTING LOGIN FUNCTION ---
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

// --- 2. SEND OTP (FORGOT PASSWORD) ---
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

    // Save to DB (Ensure your User Schema has these fields)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    // Send Email
    await transporter.sendMail({
      from: '"Rabuste Cafe" <no-reply@rabustecafe.com>',
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h3>Password Reset Request</h3>
        <p>Your OTP code is: <b style="font-size: 24px;">${otp}</b></p>
        <p>This code expires in 5 minutes.</p>
      `
    });

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

// --- 3. VERIFY OTP ---
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

// --- 4. RESET PASSWORD ---
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