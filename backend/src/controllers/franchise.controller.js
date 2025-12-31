const FranchiseLead = require('../models/franchiseLead.model');

async function createFranchiseLead(req, res) {
  try {
    const { name, email, phone, city, budgetRange, message } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required',
      });
    }

    // Check for duplicate email
    const existingLead = await FranchiseLead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({
        message: 'A franchise lead with this email already exists',
      });
    }

    // Create new franchise lead
    const lead = await FranchiseLead.create({
      name,
      email,
      phone,
      city,
      budgetRange,
      message,
      userId: req.user?._id,
      userName: req.user?.name,
      userEmail: req.user?.email,
      status: 'New',
    });

    res.status(201).json({
      message: 'Franchise application submitted successfully',
      lead,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages,
      });
    }
    res.status(500).json({
      message: 'Failed to submit franchise application',
      error: error.message,
    });
  }
}

async function getFranchiseLeads(req, res) {
  try {
    const { status, city, sortBy = '-createdAt' } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, 'i'); // Case-insensitive city search

    const leads = await FranchiseLead.find(filter)
      .populate('userId', 'name email')
      .sort(sortBy);

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch franchise leads',
      error: error.message,
    });
  }
}

async function getFranchiseLeadById(req, res) {
  try {
    const lead = await FranchiseLead.findById(req.params.id).populate(
      'userId',
      'name email'
    );

    if (!lead) {
      return res.status(404).json({ message: 'Franchise lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch franchise lead',
      error: error.message,
    });
  }
}

async function updateFranchiseLeadStatus(req, res) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['New', 'Contacted', 'In Negotiation', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const lead = await FranchiseLead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Franchise lead not found' });
    }

    res.status(200).json({
      message: 'Franchise lead status updated',
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update franchise lead',
      error: error.message,
    });
  }
}

async function updateFranchiseLead(req, res) {
  try {
    const { name, email, phone, city, budgetRange, message, notes, status } =
      req.body;

    const lead = await FranchiseLead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, city, budgetRange, message, notes, status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Franchise lead not found' });
    }

    res.status(200).json({
      message: 'Franchise lead updated',
      lead,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages,
      });
    }
    res.status(500).json({
      message: 'Failed to update franchise lead',
      error: error.message,
    });
  }
}

async function deleteFranchiseLead(req, res) {
  try {
    const lead = await FranchiseLead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Franchise lead not found' });
    }

    res.status(200).json({
      message: 'Franchise lead deleted',
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete franchise lead',
      error: error.message,
    });
  }
}

module.exports = {
  createFranchiseLead,
  getFranchiseLeads,
  getFranchiseLeadById,
  updateFranchiseLeadStatus,
  updateFranchiseLead,
  deleteFranchiseLead,
};
