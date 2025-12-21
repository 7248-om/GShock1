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
      enum: ['coffee', 'beverage', 'food', 'dessert'],
      required: true,
    },

    price: {
      type: Number,
      required: true,
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