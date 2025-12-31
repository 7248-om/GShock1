const Artwork = require('../models/artwork.model');

async function getArtworks(req, res) {
    try {
        const artworks = await Artwork.find().populate('artist').sort({ createdAt: -1 });
        res.status(200).json(artworks);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getArtworkById(req, res) {
    try {
        const artwork = await Artwork.findById(req.params.id).populate('artist');
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.status(200).json(artwork);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function createArtwork(req, res) {
    try {
        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const artwork = await Artwork.create(req.body);
        const populatedArtwork = await artwork.populate('artist');
        res.status(201).json(populatedArtwork);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation error', errors: messages });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function updateArtwork(req, res) {
    try {
        const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('artist');
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.status(200).json(artwork);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation error', errors: messages });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function deleteArtwork(req, res) {
    try {
        const artwork = await Artwork.findByIdAndDelete(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.status(200).json({ message: 'Artwork deleted successfully', artwork });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    getArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork,
};
