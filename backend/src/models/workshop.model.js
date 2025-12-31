const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workshop title is required'],
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: [true, 'Workshop date is required'],
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

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    tutorName: {
      type: String,
    },

    tutorEmail: {
      type: String,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
