const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  const { customerName, phoneNumber, address, items } = req.body;

  if (!customerName || !phoneNumber || !address || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing order details or empty cart items' });
  }

  try {
    // 1. Fetch current delivery charge from database
    const settings = await Settings.findOne() || { deliveryCharge: 50 };
    const deliveryCharge = settings.deliveryCharge;

    let itemTotal = 0;
    const verifiedItems = [];

    // 2. Validate items, recalculate totals securely, and verify stock availability
    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${dbProduct.name}. Available: ${dbProduct.stock}`
        });
      }

      // Add to running totals using DB price (prevents price manipulation)
      const lineCost = dbProduct.price * item.quantity;
      itemTotal += lineCost;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    const grandTotal = itemTotal + deliveryCharge;

    // 3. Create the order in database
    const order = new Order({
      customerName,
      phoneNumber,
      address,
      items: verifiedItems,
      itemTotal,
      deliveryCharge,
      grandTotal,
      status: 'Pending',
    });

    const savedOrder = await order.save();

    // 4. Deduct stock from products
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update value' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    const updatedOrder = await order.save();

    // If order was cancelled, replenish product stock
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    } 
    // If order is un-cancelled, deduct stock again
    else if (previousStatus === 'Cancelled' && status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics/metrics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });

    // Calculate total revenue from Delivered orders
    const salesData = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, totalSales: { $sum: '$grandTotal' } } }
    ]);
    
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderStats,
};
