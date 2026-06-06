const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// Helper to extract Cloudinary public ID from URL
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
      const remainingParts = parts.slice(uploadIndex + 1);
      // Remove the version tag (e.g. v16239487) if it exists
      if (remainingParts[0].startsWith('v') && /^\d+$/.test(remainingParts[0].substring(1))) {
        remainingParts.shift();
      }
      const fileWithExt = remainingParts.join('/');
      const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));
      return publicId;
    }
  } catch (err) {
    console.error('Failed to parse Cloudinary public ID:', err);
  }
  return null;
};

// Helper to delete product images from Cloudinary or local storage
const deleteProductImages = async (images) => {
  if (!images || !Array.isArray(images)) return;

  for (const imageUrl of images) {
    if (isCloudinaryConfigured && imageUrl.includes('res.cloudinary.com')) {
      const publicId = getCloudinaryPublicId(imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (err) {
          console.error(`Error deleting image ${publicId} from Cloudinary:`, err.message);
        }
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Local file deletion
      const filename = imageUrl.replace('/uploads/', '');
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted local image: ${filename}`);
        } catch (err) {
          console.error(`Error deleting local file ${filePath}:`, err.message);
        }
      }
    }
  }
};

// @desc    Get all products with filters, search, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, featured } = req.query;

    const query = {};

    // 1. Search Query
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 2. Category Query (accepts category Name or ID)
    if (category) {
      // Check if category is a valid ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(category);
      if (isValidObjectId) {
        query.category = category;
      } else {
        // Find category by name
        const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (cat) {
          query.category = cat._id;
        } else {
          // If category not found, return empty array
          return res.json([]);
        }
      }
    }

    // 3. Price Query
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Featured Query
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, featured } = req.body;

  // Images can be uploaded files or manual URLs
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    imageUrls = req.files.map((file) => {
      // If cloudinary is configured, file.path is the secure URL.
      // Otherwise, it's a local upload path, which we serve under /uploads/
      return isCloudinaryConfigured ? file.path : `/uploads/${file.filename}`;
    });
  }

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: 'Name, description, price, and category are required' });
  }

  try {
    // Check if category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid Category ID' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      images: imageUrls,
      category,
      stock: Number(stock) || 0,
      featured: featured === 'true' || featured === true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    // Cleanup uploaded files if save fails
    await deleteProductImages(imageUrls);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, featured, existingImages } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify category if updated
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Invalid Category ID' });
      }
      product.category = category;
    }

    // Identify images that were deleted from client (if existingImages list is sent)
    let finalImages = product.images;
    if (existingImages !== undefined) {
      // existingImages could be a string if only one image is remaining, or an array, or empty
      const parsedExisting = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];
      
      // Find deleted images to remove from Cloudinary/local folders
      const deletedImages = product.images.filter((img) => !parsedExisting.includes(img));
      await deleteProductImages(deletedImages);
      finalImages = parsedExisting;
    }

    // Append new uploaded files
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => {
        return isCloudinaryConfigured ? file.path : `/uploads/${file.filename}`;
      });
      finalImages = [...finalImages, ...newImageUrls];
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
    product.images = finalImages;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete associated images first
      await deleteProductImages(product.images);
      
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
