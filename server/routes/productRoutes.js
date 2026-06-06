const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only endpoints, supporting multiple image file uploads (max 8 images)
router.post('/', protectAdmin, upload.array('images', 8), createProduct);
router.put('/:id', protectAdmin, upload.array('images', 8), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
