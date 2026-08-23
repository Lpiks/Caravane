const BuildInquiry = require('../models/BuildInquiry');

// POST /api/inquiries
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, email, chassis, message, placedModules, source } = req.body;

    // Validate required fields
    if (!name || !phone || !message || !source) {
      return res.status(400).json({ message: 'Missing required fields (name, phone, message, source).' });
    }

    const newInquiry = new BuildInquiry({
      name,
      phone,
      email,
      chassis,
      message,
      placedModules,
      source
    });

    const savedInquiry = await newInquiry.save();

    res.status(201).json({
      message: 'Inquiry submitted successfully. Our team will contact you soon.',
      inquiryId: savedInquiry._id
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Server error saving inquiry.', error: error.message });
  }
};

// GET /api/inquiries (Protected Admin Route)
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await BuildInquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Server error fetching inquiries.' });
  }
};

// DELETE /api/inquiries/:id (Protected Admin Route)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await BuildInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    await inquiry.deleteOne();
    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Server error deleting inquiry.' });
  }
};
