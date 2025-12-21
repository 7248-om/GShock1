const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    query: {
      type: String,
      required: true,
    },

    intent: {
      type: String,
      // e.g. "menu_search", "art_recommendation", "workshop_query"
    },

    entities: {
      type: Object,
      // e.g. { category: "coffee", tags: ["strong", "hot"] }
    },

    response: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interaction', interactionSchema);

// Why?

// - Learn what users ask
// - Improve recommendations
// - Show judges “AI feedback loop”
//Makes chatbot feel intentional, not gimmicky