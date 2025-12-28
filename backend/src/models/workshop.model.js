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

    startTime: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    price: {
      type: Number,
      default: 0,
    },

    capacity: {
      type: Number,
    },

    imageUrl: {
      type: String,
    },

    primaryImageUrl: {
      type: String,
    },

    category: {
      type: String,
      enum: ['Foundations', 'Expert', 'Breather'],
      default: 'Breather',
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
