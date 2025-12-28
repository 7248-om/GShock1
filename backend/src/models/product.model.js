const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'Coffee',
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],
        default: 'In Stock',
    },
    roastLevel: {
        type: String,
    },
    tastingNotes: {
        type: String,
    },
    tags: [String],
});

module.exports = mongoose.model('Product', productSchema);
