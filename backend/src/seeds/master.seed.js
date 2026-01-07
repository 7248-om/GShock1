const path = require('path');
// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Workshop = require('../models/workshop.model');
const Artwork = require('../models/artwork.model');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('❌ MONGODB_URI is missing in .env');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // --- 1. SEED PRODUCTS (Matches your Product Model) ---
    await Product.deleteMany({});
    await Product.insertMany([
      { 
        name: "Ethiopian Yirgacheffe", 
        category: "Coffee", 
        price: 350, 
        description: "Bright acidity with floral notes.",
        tastingNotes: "Jasmine, Lemon, Bergamot", 
        tags: ["fruity", "light roast", "black coffee"], 
        stockStatus: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400" 
      },
      { 
        name: "Sumatra Mandheling", 
        category: "Coffee", 
        price: 380, 
        description: "Full-bodied dark roast.",
        tastingNotes: "Dark Chocolate, Earthy, Spice", 
        tags: ["strong", "dark roast", "bold"], 
        stockStatus: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" 
      },
      { 
        name: "Avocado Toast", 
        category: "Savory Bites", 
        price: 450, 
        description: "Fresh avocado on sourdough.",
        tastingNotes: "Savory, Fresh, Crunchy", 
        tags: ["breakfast", "healthy", "vegan"], 
        stockStatus: "In Stock",
        imageUrl: "https://images.unsplash.com/photo-1588137372308-15f75323a51d?w=400" 
      }
    ]);
    console.log('☕ Products Seeded');

    // --- 2. SEED WORKSHOPS ---
    await Workshop.deleteMany({});
    await Workshop.insertMany([
      { 
        title: "Latte Art Basics", 
        date: new Date(Date.now() + 86400000 * 5), 
        price: 1200, 
        category: "Foundations", 
        description: "Learn to pour hearts and rosettas.", 
        status: "Approved", 
        isActive: true,
        primaryImageUrl: "https://images.unsplash.com/photo-1551096038-f94d93026330?w=400"
      }
    ]);
    console.log('🎓 Workshops Seeded');

    // --- 3. SEED ARTWORK ---
    await Artwork.deleteMany({});
    await Artwork.insertMany([
      { 
        title: "Midnight Reverie", 
        artistName: "Elena Rodriguez", 
        price: 25000, 
        medium: "Oil on Canvas", 
        tastingNotes: "Moody, Abstract", 
        tags: ["abstract", "blue"], 
        status: "Available",
        primaryImageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb39279c15?w=400"
      }
    ]);
    console.log('🎨 Artwork Seeded');

    console.log('✅ RE-SEEDING COMPLETE. RESTART SERVER.');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();