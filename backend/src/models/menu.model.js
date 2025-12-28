const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      enum: ['Coffee', 'Savory Bites', 'Desserts', 'coffee', 'beverage', 'food', 'dessert'],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
      default: 'https://picsum.photos/seed/coffee/400/400',
    },

    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock'],
      default: 'In Stock',
    },

    roastLevel: {
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

module.exports = mongoose.model('Menu', menuSchema);
//tags help us for ai chatbot feature - must
// tags: [
//   "strong",
//   "high caffeine",
//   "robusta",
//   "bitter",
//   "hot"
// ]