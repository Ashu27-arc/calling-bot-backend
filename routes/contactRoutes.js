const express = require('express');
const router = express.Router();
const { getContacts, createContact, uploadCSV } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getContacts).post(protect, createContact);
router.post('/upload', protect, uploadCSV);

module.exports = router;
