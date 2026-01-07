const Menu = require('../models/menu.model');
const Workshop = require('../models/workshop.model');
const Artwork = require('../models/artwork.model');

async function getSystemContext() {
  try {
    // 1. Fetch Data
    const menu = await Menu.find({ isAvailable: true }).lean();
    const workshops = await Workshop.find({ status: 'Approved', isActive: true }).lean();
    const artworks = await Artwork.find({ status: 'Available' }).lean();

    console.log(`🤖 Bot Context Loaded: ${menu.length} Items, ${workshops.length} Workshops, ${artworks.length} Artworks`);

    // 2. Format Context
    let context = "Here is the current live inventory of the space:\n\n";

    if (menu.length > 0) {
      context += "--- MENU (Food & Coffee) ---\n";
      menu.forEach(m => {
        context += `- ${m.name} (${m.category}): ₹${m.price}. Notes: ${m.tastingNotes || ''}. Tags: ${m.tags?.join(', ') || ''}.\n`;
      });
    } else {
      context += "--- MENU ---\n(The menu is currently being updated. Advise the user to check the counter.)\n";
    }

    if (workshops.length > 0) {
      context += "\n--- UPCOMING WORKSHOPS ---\n";
      workshops.forEach(w => {
        context += `- ${w.title} on ${new Date(w.date).toDateString()}: ₹${w.price}. Level: ${w.category}.\n`;
      });
    }

    if (artworks.length > 0) {
      context += "\n--- ARTWORKS ON DISPLAY ---\n";
      artworks.forEach(a => {
        context += `- "${a.title}" by ${a.artistName}: ₹${a.price}. Style: ${a.tastingNotes || a.medium}.\n`;
      });
    }

    return context;
  } catch (error) {
    console.error("Error building context:", error);
    return "Error loading inventory. Please ask the user to speak to a human staff member.";
  }
}

module.exports = { getSystemContext };