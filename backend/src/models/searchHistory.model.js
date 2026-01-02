const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    searchQuery: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },

    tags: [String],

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000, // Auto-delete after 30 days
    },
  },
  { timestamps: true }
);

searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ user: 1, productId: 1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
