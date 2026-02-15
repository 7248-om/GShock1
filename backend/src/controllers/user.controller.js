const User = require('../models/user.model');
const Order = require('../models/order.model');
const Workshop = require('../models/workshop.model');

async function getMe(req, res) {
    // req.user is populated by the authMiddleware
    res.status(200).json(req.user);
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('-__v');
        
        // Enhance each user with order and workshop counts
        const usersWithEngagement = await Promise.all(
            users.map(async (user) => {
                const orderCount = await Order.countDocuments({ user: user._id });
                const workshopCount = await Workshop.countDocuments({ tutorId: user._id });
                
                return {
                    ...user.toObject(),
                    orderHistory: [], // Empty array for compatibility
                    workshopHistory: [], // Empty array for compatibility
                    orderCount,
                    workshopCount
                };
            })
        );
        
        res.status(200).json(usersWithEngagement);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
}

async function updateUserRole(req, res) {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin".' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role', error: error.message });
    }
}

module.exports = {
    getMe,
    getAllUsers,
    updateUserRole,
};
