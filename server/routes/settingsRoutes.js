const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protectAdmin, updateSettings);

module.exports = router;
