const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/auth');

router.post('/', createOrder);
router.get('/', protectAdmin, getOrders);
router.get('/stats', protectAdmin, getOrderStats);
router.put('/:id/status', protectAdmin, updateOrderStatus);

module.exports = router;
