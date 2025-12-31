const mongoose = require('mongoose');

const franchiseLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/.+@.+\..+/, 'Please provide a valid email'],
    },

    phone: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    budgetRange: {
      type: String,
      // e.g. "₹20–30 Lakhs", "₹30–50 Lakhs", "₹50+ Lakhs"
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Negotiation', 'Rejected'],
      default: 'New',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    userName: {
      type: String,
    },

    userEmail: {
      type: String,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
franchiseLeadSchema.index({ email: 1 });
franchiseLeadSchema.index({ status: 1 });
franchiseLeadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FranchiseLead', franchiseLeadSchema);
