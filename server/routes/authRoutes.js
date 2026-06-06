const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminPassword } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.put('/password', protectAdmin, updateAdminPassword);

module.exports = router;
