const Workshop = require('../models/workshop.model');

async function getWorkshops(req, res) {
    try {
        const workshops = await Workshop.find();
        res.status(200).json(workshops);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getWorkshopById(req, res) {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function createWorkshop(req, res) {
    try {
        const workshop = await Workshop.create(req.body);
        res.status(201).json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function updateWorkshop(req, res) {
    try {
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function deleteWorkshop(req, res) {
    try {
        const workshop = await Workshop.findByIdAndDelete(req.params.id);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        res.status(200).json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    getWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
};
