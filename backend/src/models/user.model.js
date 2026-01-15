const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // --- ADDED FIELDS (Safe to add) ---
    firebaseUid: { type: String },          // Links Mongo user to Firebase
    resetPasswordOtp: { type: String },     // Stores the 6-digit code
    resetPasswordExpires: { type: Date },   // Stores when the code expires
    // ----------------------------------
}, { timestamps: true }); // (Optional) Adds createdAt / updatedAt automatically

module.exports = mongoose.model('User', userSchema);