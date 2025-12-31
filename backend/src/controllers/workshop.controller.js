const Workshop = require('../models/workshop.model');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Public: Get only approved workshops
async function getWorkshops(req, res) {
    try {
        const workshops = await Workshop.find({ status: 'Approved' }).sort({ date: 1 });
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

// Logged-in user: Create workshop (goes to Pending status)
async function createWorkshopByUser(req, res) {
    try {
        const userId = req.user?.id || req.user?._id;
        const userEmail = req.user?.email;
        const userName = req.user?.name;

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const { title, description, date, startTime, endTime, price, capacity, category, image, imageUrl, primaryImageUrl } = req.body;

        // Validate required fields
        if (!title || !date) {
            return res.status(400).json({ message: 'Title and date are required' });
        }

        const workshopData = {
            title,
            description,
            date,
            startTime,
            endTime,
            price: price || 0,
            capacity: capacity || 0,
            category: category || 'Breather',
            imageUrl: image || imageUrl || primaryImageUrl,
            primaryImageUrl: image || imageUrl || primaryImageUrl,
            tutorId: userId,
            tutorName: userName,
            tutorEmail: userEmail,
            status: 'Pending',
        };

        const workshop = await Workshop.create(workshopData);
        res.status(201).json({ 
            message: 'Workshop submitted successfully. Admin will review and approve.',
            workshop 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Admin: Create workshop directly (for backward compatibility)
async function createWorkshop(req, res) {
    try {
        const workshop = await Workshop.create(req.body);
        res.status(201).json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function createWorkshopWithImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const buffer = req.file.buffer;

        // Upload image to ImageKit
        const uploadResult = await imagekit.upload({
            file: buffer,
            fileName: req.file.originalname,
            folder: '/gshock/workshops/',
        });

        // Create workshop with image URL
        const workshopData = {
            ...req.body,
            image: uploadResult.url,
            primaryImageUrl: uploadResult.url,
        };

        const workshop = await Workshop.create(workshopData);
        res.status(201).json(workshop);
    } catch (error) {
        console.error('Workshop creation with image failed:', error);
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

async function updateWorkshopWithImage(req, res) {
    try {
        if (!req.file) {
            // No file, just update text fields
            const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!workshop) {
                return res.status(404).json({ message: 'Workshop not found' });
            }
            return res.status(200).json(workshop);
        }

        const buffer = req.file.buffer;

        // Upload image to ImageKit
        const uploadResult = await imagekit.upload({
            file: buffer,
            fileName: req.file.originalname,
            folder: '/gshock/workshops/',
        });

        // Update workshop with new image URL
        const workshopData = {
            ...req.body,
            image: uploadResult.url,
            primaryImageUrl: uploadResult.url,
        };

        const workshop = await Workshop.findByIdAndUpdate(req.params.id, workshopData, { new: true });
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        console.error('Workshop update with image failed:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Admin: Approve or reject workshop
async function updateWorkshopStatus(req, res) {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected.' });
        }

        const workshop = await Workshop.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }

        res.status(200).json({ 
            message: `Workshop ${status.toLowerCase()} successfully`,
            workshop 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Admin: Get pending workshops for approval
async function getPendingWorkshops(req, res) {
    try {
        const workshops = await Workshop.find({ status: 'Pending' }).sort({ createdAt: -1 });
        res.status(200).json(workshops);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Admin: Get all workshops (all statuses)
async function getAllWorkshopsForAdmin(req, res) {
    try {
        const workshops = await Workshop.find().sort({ createdAt: -1 });
        res.status(200).json(workshops);
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
    getAllWorkshopsForAdmin,
    createWorkshopByUser,
    createWorkshop,
    createWorkshopWithImage,
    updateWorkshop,
    updateWorkshopWithImage,
    updateWorkshopStatus,
    getPendingWorkshops,
    deleteWorkshop,
};
