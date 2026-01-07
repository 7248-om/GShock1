const Product = require('../models/product.model'); // Switching to the real Product model
const Workshop = require('../models/workshop.model');
const Artwork = require('../models/artwork.model');

async function getSystemContext() {
  try {
    // 1. Fetch Real Products from your Backend
    // We only select items that are 'In Stock'
    const products = await Product.find({ stockStatus: 'In Stock' })
      .select('name category price tastingNotes tags description imageUrl')
      .lean();

    // 2. Fetch Approved Workshops
    const workshops = await Workshop.find({ status: 'Approved', isActive: true })
      .select('title date category price description primaryImageUrl')
      .lean();

    // 3. Fetch Available Artworks
    const artworks = await Artwork.find({ status: 'Available' })
      .select('title artistName price tastingNotes tags primaryImageUrl')
      .lean();

    console.log(`🤖 Live Context Loaded: ${products.length} Products, ${workshops.length} Workshops, ${artworks.length} Artworks`);

    let context = "Here is the LIVE inventory from the database. Use ONLY this data.\n\n";

    // --- Format Products (Coffee/Food) ---
    if (products.length > 0) {
      context += "=== ☕ CURRENT MENU (From Inventory) ===\n";
      products.forEach(p => {
        // AI Note: We explicitly attach the Image URL so the bot can display it
        // Using 'description' or 'tastingNotes' based on what's available
        const info = p.tastingNotes || p.description;
        context += `- ${p.name} (${p.category}) | ₹${p.price} | Info: ${info} | Image: ${p.imageUrl || ''}\n`;
      });
    } else {
      context += "=== MENU ===\n(No products currently in stock)\n";
    }

    // --- Format Workshops ---
    if (workshops.length > 0) {
      context += "\n=== 🎓 WORKSHOPS ===\n";
      workshops.forEach(w => {
        context += `- ${w.title} | Date: ${new Date(w.date).toDateString()} | ₹${w.price} | Image: ${w.primaryImageUrl || ''}\n`;
      });
    }

    // --- Format Art ---
    if (artworks.length > 0) {
      context += "\n=== 🎨 ART GALLERY ===\n";
      artworks.forEach(a => {
        context += `- "${a.title}" by ${a.artistName} | ₹${a.price} | Style: ${a.tastingNotes} | Image: ${a.primaryImageUrl || ''}\n`;
      });
    }

    return context;
  } catch (error) {
    console.error("❌ Context Error:", error);
    return "Error loading inventory.";
  }
}

module.exports = { getSystemContext };