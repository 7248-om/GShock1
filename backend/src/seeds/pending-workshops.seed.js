const Workshop = require('../models/workshop.model');

const PENDING_WORKSHOPS = [
  {
    title: "Specialty Coffee Cupping Masterclass",
    description: "Learn how to identify and appreciate the subtle flavors in single-origin specialty coffees. We'll taste 5 different beans from around the world.",
    date: new Date('2026-01-10'),
    startTime: new Date('2026-01-10T18:00:00'),
    endTime: new Date('2026-01-10T20:00:00'),
    price: 1499,
    capacity: 12,
    category: 'Expert',
    image: 'https://picsum.photos/id/491/800/600',
    primaryImageUrl: 'https://picsum.photos/id/491/800/600',
    tutorName: 'Priya Sharma',
    tutorEmail: 'priya.sharma@coffee.com',
    status: 'Pending',
    isActive: true,
    tags: ['specialty', 'cupping', 'expert'],
  },
  {
    title: "Home Espresso Setup Guide",
    description: "Complete beginner's guide to choosing and setting up your first espresso machine at home. Includes maintenance tips and troubleshooting.",
    date: new Date('2026-01-12'),
    startTime: new Date('2026-01-12T14:00:00'),
    endTime: new Date('2026-01-12T16:00:00'),
    price: 899,
    capacity: 20,
    category: 'Foundations',
    image: 'https://picsum.photos/id/63/800/600',
    primaryImageUrl: 'https://picsum.photos/id/63/800/600',
    tutorName: 'Raj Patel',
    tutorEmail: 'raj.patel@home-barista.in',
    status: 'Pending',
    isActive: true,
    tags: ['espresso', 'home', 'beginners'],
  },
  {
    title: "Sustainable Coffee & Ethical Sourcing",
    description: "Understand the impact of your coffee choices. Learn about fair trade, direct trade, and how to support ethical coffee farming practices globally.",
    date: new Date('2026-01-15'),
    startTime: new Date('2026-01-15T19:00:00'),
    endTime: new Date('2026-01-15T21:00:00'),
    price: 0,
    capacity: 30,
    category: 'Breather',
    image: 'https://picsum.photos/id/766/800/600',
    primaryImageUrl: 'https://picsum.photos/id/766/800/600',
    tutorName: 'Maya Singh',
    tutorEmail: 'maya.singh@ethics.coffee',
    status: 'Pending',
    isActive: true,
    tags: ['ethics', 'sustainable', 'free'],
  },
  {
    title: "Turkish Coffee Ceremony Workshop",
    description: "Traditional Turkish coffee making with authentic rituals and cultural significance. Learn the art of making perfect Turkish coffee using cezve.",
    date: new Date('2026-01-18'),
    startTime: new Date('2026-01-18T17:00:00'),
    endTime: new Date('2026-01-18T18:30:00'),
    price: 649,
    capacity: 15,
    category: 'Foundations',
    image: 'https://picsum.photos/id/431/800/600',
    primaryImageUrl: 'https://picsum.photos/id/431/800/600',
    tutorName: 'Aisha Khalid',
    tutorEmail: 'aisha.khalid@turkcoffee.com',
    status: 'Pending',
    isActive: true,
    tags: ['turkish', 'ceremony', 'culture'],
  },
  {
    title: "Latte Art Competition Prep",
    description: "Advanced training for competitive latte art. Perfect your technique to compete in regional barista competitions. Includes feedback and scoring.",
    date: new Date('2026-01-22'),
    startTime: new Date('2026-01-22T16:00:00'),
    endTime: new Date('2026-01-22T18:00:00'),
    price: 1799,
    capacity: 8,
    category: 'Expert',
    image: 'https://picsum.photos/id/425/800/600',
    primaryImageUrl: 'https://picsum.photos/id/425/800/600',
    tutorName: 'David Chen',
    tutorEmail: 'david.chen@latte-pro.com',
    status: 'Pending',
    isActive: true,
    tags: ['competition', 'latte-art', 'expert'],
  },
  {
    title: "Coffee & Food Pairing: A Chef's Perspective",
    description: "Discover how coffee complements different cuisines. Learn plating, flavor combinations, and how restaurants pair coffee with desserts and meals.",
    date: new Date('2026-01-25'),
    startTime: new Date('2026-01-25T18:30:00'),
    endTime: new Date('2026-01-25T20:30:00'),
    price: 1299,
    capacity: 18,
    category: 'Foundations',
    image: 'https://picsum.photos/id/312/800/600',
    primaryImageUrl: 'https://picsum.photos/id/312/800/600',
    tutorName: 'Chef Vikram Desai',
    tutorEmail: 'vikram@foodcoffee.in',
    status: 'Pending',
    isActive: true,
    tags: ['food', 'pairing', 'culinary'],
  },
];

async function seedPendingWorkshops() {
  try {
    // Check for existing pending workshops to avoid duplicates
    const existingPending = await Workshop.countDocuments({ status: 'Pending' });
    if (existingPending > 0) {
      console.log(`Pending workshops already seeded. Found ${existingPending} pending workshops.`);
      return;
    }

    // Insert all pending workshops
    const result = await Workshop.insertMany(PENDING_WORKSHOPS);
    console.log(`Successfully seeded ${result.length} pending workshops to the database.`);
    return result;
  } catch (error) {
    console.error('Error seeding pending workshops:', error);
    throw error;
  }
}

module.exports = { seedPendingWorkshops, PENDING_WORKSHOPS };
