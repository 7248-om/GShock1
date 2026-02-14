const express = require('express');
const { brewAIRecommendation } = require('../controllers/brewAI.controller');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const adminRoutes = require('./admin.routes');
const artworkRoutes = require('./artwork.routes');
const workshopRoutes = require('./workshop.routes');
const mediaRoutes = require('./media.routes');
const orderRoutes = require('./order.routes');
const franchiseRoutes = require('./franchise.routes');
const paymentRoutes = require('./payment.routes');
const reelRoutes = require('./reel.routes');
const suggestionRoutes = require('./suggestion.routes');
const artistRoutes = require('./artist.routes');
const chatRoutes = require('./chat.routes');
const menuRoutes = require('./menu.routes'); // <--- ADD THIS IMPORT
const marketingRoutes = require('./marketing.routes');
const synesthesiaRoutes = require('./synesthesia.routes');
const googleReviewRoutes = require('./googleReviews.routes');
const router = express.Router();

// Root API endpoint
router.get('/', (req, res) => {
  res.json({ 
    message: 'GShock API Server', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/admin', adminRoutes);
router.use('/artworks', artworkRoutes);
router.use('/workshops', workshopRoutes);
router.use('/media', mediaRoutes);
router.use('/orders', orderRoutes);
router.use('/franchises', franchiseRoutes);
router.use('/payments', paymentRoutes);
router.use('/reels', reelRoutes);
router.use('/suggestions', suggestionRoutes);
router.use('/artists', artistRoutes);
router.use('/chat', chatRoutes);
router.use('/menu', menuRoutes); // <--- ADD THIS LINE
router.use('/marketing', marketingRoutes);
router.use('/synesthesia', synesthesiaRoutes);
router.use('/google-reviews', googleReviewRoutes);
router.post('/brew-ai', brewAIRecommendation);
module.exports = router;