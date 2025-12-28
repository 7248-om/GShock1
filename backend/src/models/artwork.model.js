const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    year: {
      type: String,
    },

    medium: {
      type: String,
    },

    dimensions: {
      type: String,
    },

    primaryImageUrl: {
      type: String,
    },

    hoverImageUrl: {
      type: String,
    },

    price: {
      type: Number,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
    artistName: {
      type: String,
    },

    status: {
      type: String,
      enum: ['Available', 'Sold Out', 'Limited Edition'],
      default: 'Available',
    },

    themeColor: {
      type: String,
    },
    tastingNotes: {
      type: String,
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
