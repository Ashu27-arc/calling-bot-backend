const express = require('express');
const router = express.Router();
const { getCallLogs } = require('../controllers/callController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCallLogs);

module.exports = router;
