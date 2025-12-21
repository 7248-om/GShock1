const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },

    linkedType: {
      type: String,
      enum: ['menu', 'artwork', 'workshop', 'page'],
    },

    linkedId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
//This prevents media chaos later.