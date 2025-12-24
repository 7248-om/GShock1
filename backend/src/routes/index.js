const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const adminRoutes = require('./admin.routes');
const artworkRoutes = require('./artwork.routes');
const workshopRoutes = require('./workshop.routes');
const orderRoutes = require('./order.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/admin', adminRoutes);
router.use('/artworks', artworkRoutes);
router.use('/workshops', workshopRoutes);
router.use('/orders', orderRoutes);

module.exports = router;

