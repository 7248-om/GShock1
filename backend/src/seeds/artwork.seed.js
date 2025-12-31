const mongoose = require('mongoose');
const Artwork = require('../models/artwork.model');
require('dotenv').config();

const seedArtworks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing artworks
    await Artwork.deleteMany({});
    console.log('Cleared existing artworks');

    // Sample artwork data
    const artworks = [
      {
        title: 'Midnight Reverie',
        description: 'A contemporary abstract piece exploring the depths of consciousness through layered textures and muted tones.',
        year: '2023',
        medium: 'Acrylic on Canvas',
        dimensions: '48" x 36"',
        price: 2500,
        artistName: 'Elena Rodriguez',
        status: 'Available',
        primaryImageUrl: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1577720643272-265e434e3e7e?w=400&h=500&fit=crop',
        themeColor: '#2a1f3d',
        tastingNotes: 'Introspective | Moody | Abstract',
        tags: ['contemporary', 'abstract', 'acrylic'],
        isAvailable: true,
      },
      {
        title: 'Urban Pulse',
        description: 'Mixed media exploration of metropolitan energy and the rhythm of city life captured through kinetic compositions.',
        year: '2024',
        medium: 'Mixed Media',
        dimensions: '60" x 40"',
        price: 3200,
        artistName: 'Marcus Chen',
        status: 'Available',
        primaryImageUrl: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1578926314433-b75ee18ab748?w=400&h=500&fit=crop',
        themeColor: '#d4562a',
        tastingNotes: 'Dynamic | Urban | Energetic',
        tags: ['mixed-media', 'contemporary', 'urban'],
        isAvailable: true,
      },
      {
        title: 'Ethereal Landscapes',
        description: 'Minimalist oil painting series capturing the essence of nature through reduced forms and harmonious color palettes.',
        year: '2023',
        medium: 'Oil on Canvas',
        dimensions: '36" x 48"',
        price: 1800,
        artistName: 'Sophie Laurent',
        status: 'Limited Edition',
        primaryImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400&h=500&fit=crop',
        themeColor: '#7fa384',
        tastingNotes: 'Serene | Minimalist | Natural',
        tags: ['oil', 'landscape', 'minimalist'],
        isAvailable: true,
      },
      {
        title: 'Digital Dreams',
        description: 'An exploration of the intersection between analog and digital mediums, creating a unique visual dialogue.',
        year: '2024',
        medium: 'Digital Print with Collage',
        dimensions: '42" x 56"',
        price: 1500,
        artistName: 'Alex Rivera',
        status: 'Available',
        primaryImageUrl: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1578926314433-b75ee18ab748?w=400&h=500&fit=crop',
        themeColor: '#1a3a52',
        tastingNotes: 'Contemporary | Digital | Hybrid',
        tags: ['digital', 'contemporary', 'collage'],
        isAvailable: true,
      },
      {
        title: 'Chromatic Harmony',
        description: 'A vibrant study in color theory and spatial relationships using watercolor techniques.',
        year: '2023',
        medium: 'Watercolor on Paper',
        dimensions: '30" x 40"',
        price: 1200,
        artistName: 'Nina Patel',
        status: 'Sold Out',
        primaryImageUrl: 'https://images.unsplash.com/photo-1577720643272-265e434e3e7e?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=400&h=500&fit=crop',
        themeColor: '#f5a623',
        tastingNotes: 'Vibrant | Harmonious | Playful',
        tags: ['watercolor', 'colorful', 'contemporary'],
        isAvailable: false,
      },
      {
        title: 'Geometric Rebellion',
        description: 'Bold geometric forms challenging traditional perspective and spatial conventions.',
        year: '2024',
        medium: 'Acrylic and Ink on Canvas',
        dimensions: '48" x 48"',
        price: 2800,
        artistName: 'James Wilson',
        status: 'Available',
        primaryImageUrl: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400&h=500&fit=crop',
        hoverImageUrl: 'https://images.unsplash.com/photo-1577720643272-265e434e3e7e?w=400&h=500&fit=crop',
        themeColor: '#2c3e50',
        tastingNotes: 'Bold | Geometric | Rebellious',
        tags: ['geometric', 'abstract', 'contemporary'],
        isAvailable: true,
      },
    ];

    // Insert artworks
    const insertedArtworks = await Artwork.insertMany(artworks);
    console.log(`Successfully seeded ${insertedArtworks.length} artworks`);

    // Display created artworks
    console.log('\nCreated Artworks:');
    insertedArtworks.forEach(art => {
      console.log(`- ${art.title} by ${art.artistName} (${art.status}) - $${art.price}`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedArtworks();
