const Contact = require('../models/Contact');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    const contact = await Contact.create({
      userId: req.user._id,
      name,
      phone,
      email,
      notes,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadCSV = async (req, res) => {
  // Logic for csv-parser would go here
  res.status(200).json({ message: 'CSV uploaded and contacts created successfully' });
};

module.exports = {
  getContacts,
  createContact,
  uploadCSV,
};
