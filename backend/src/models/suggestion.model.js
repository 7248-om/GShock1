const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    // Default suggestions (for all users)
    defaultSuggestions: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        displayOrder: Number,
      },
    ],

    // User-specific suggestions (manual assignment by admin)
    userSuggestions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        productIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
        ],
        type: {
          type: String,
          enum: ['manual', 'auto'],
          default: 'manual',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Settings
    enableAutoSuggestions: {
      type: Boolean,
      default: true,
    },

    autoSuggestionType: {
      type: String,
      enum: ['orderHistory', 'searchHistory', 'related', 'hybrid'],
      default: 'hybrid',
    },

    minDefaultSuggestions: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Suggestion', suggestionSchema);
