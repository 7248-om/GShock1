const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    capacity: {
      type: Number,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
