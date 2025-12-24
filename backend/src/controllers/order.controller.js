const Order = require('../models/order.model');

async function getOrders(req, res) {
    try {
        const orders = await Order.find().populate('user').populate('items.itemId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('items.itemId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function createOrder(req, res) {
    try {
        const order = await Order.create(req.body);
        const populatedOrder = await order.populate('user').populate('items.itemId');
        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function updateOrder(req, res) {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user').populate('items.itemId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user').populate('items.itemId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function deleteOrder(req, res) {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
};
