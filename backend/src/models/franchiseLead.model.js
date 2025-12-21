const mongoose = require('mongoose');

const franchiseLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    city: {
      type: String,
    },

    budgetRange: {
      type: String,
      // e.g. "10-20L", "20-30L"
    },

    status: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: 'new',
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FranchiseLead', franchiseLeadSchema);
