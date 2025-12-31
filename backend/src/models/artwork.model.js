const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    year: {
      type: String,
      trim: true,
    },

    medium: {
      type: String,
      trim: true,
    },

    dimensions: {
      type: String,
      trim: true,
    },

    primaryImageUrl: {
      type: String,
      trim: true,
    },

    hoverImageUrl: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
    artistName: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['Available', 'Sold Out', 'Limited Edition'],
      default: 'Available',
    },

    themeColor: {
      type: String,
      default: '#000000',
    },
    tastingNotes: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', artworkSchema);
