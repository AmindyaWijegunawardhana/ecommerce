import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Star, AlertCircle, Sparkles, Image as ImageIcon, Gift } from 'lucide-react';
import { ToastContext } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/api';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminProducts = () => {
  const { addToast } = useContext(ToastContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form / Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // Image Upload States
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/categories`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load products/categories catalog. Check server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory(categories[0]?._id || '');
    setStock('');
    setFeatured(false);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category?._id || '');
    setStock(product.stock.toString());
    setFeatured(product.featured);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(product.images || []);
    setIsModalOpen(true);
  };

  // Image Selection Handler (for previews)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImagePreview = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || !category) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock || '0');
    formData.append('featured', featured);

    // Append new files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (editingProduct) {
        // Append existing remaining images
        existingImages.forEach((img) => {
          formData.append('existingImages', img);
        });

        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Product updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Product created successfully', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save product catalog details', 'error');
    }
  };

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        addToast('Product deleted successfully', 'success');
        loadData();
      } catch (err) {
        console.error(err);
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
  };

  if (loading && products.length === 0) {
    return <div className="text-center text-slate-500 py-20">Loading product catalogs...</div>;
  }

  return (
    <div className="space-y-10">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage items, stock counts, prices and featured states</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-350 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Products list grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-slate-700 transition-colors relative"
            >
              {/* Product Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {prod.featured && (
                  <span className="px-2 py-0.5 text-[9px] font-bold text-slate-900 bg-amber-400 rounded-full flex items-center gap-0.5 shadow-sm uppercase tracking-wide">
                    <Star className="w-2.5 h-2.5 fill-slate-900" />
                    Featured
                  </span>
                )}
                {prod.stock <= 0 ? (
                  <span className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-800 rounded-full border border-slate-700 uppercase tracking-wide">
                    Sold Out
                  </span>
                ) : (
                  prod.stock <= 5 && (
                    <span className="px-2 py-0.5 text-[9px] font-bold text-rose-300 bg-rose-900/40 rounded-full border border-rose-900/50 uppercase tracking-wide">
                      Low Stock ({prod.stock})
                    </span>
                  )
                )}
              </div>

              {/* Thumbnail Container */}
              <div className="aspect-square bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {prod.images && prod.images.length > 0 ? (
                  <img src={resolveImageUrl(prod.images[0])} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-700" />
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow space-y-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{prod.category?.name}</span>
                  <h3 className="font-serif font-bold text-white text-lg mt-0.5 truncate">{prod.name}</h3>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-450">Price:</span>
                  <span className="font-bold text-white">{formatCurrency(prod.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-450">Stock Quantity:</span>
                  <span className="font-semibold text-slate-200">{prod.stock} items</span>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-800/60 mt-auto">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="flex-grow flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id, prod.name)}
                    className="flex items-center justify-center p-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white transition-all cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <Gift className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
          <h3 className="font-serif font-bold text-white text-lg">No products catalogued</h3>
          <p className="text-slate-500 text-xs mt-1">Get started by adding your first product gift item.</p>
        </div>
      )}

      {/* ================= EDIT/ADD MODAL DIALOG ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"></div>

          {/* Dialog Body */}
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif font-bold text-white text-xl">
                {editingProduct ? 'Edit Gift Product' : 'Add New Gift Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dreamy Lavender Hamper"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                />
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Stock Count *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 20"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category *</label>
                {categories.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex flex-col gap-1.5">
                    <p>No categories exist. You must create at least one category before you can add products.</p>
                    <Link
                      to="/admin/categories"
                      className="text-dreamy-lavender-400 hover:text-dreamy-lavender-300 font-bold flex items-center gap-1 mt-0.5"
                    >
                      Go to Categories Page &rarr;
                    </Link>
                  </div>
                ) : (
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide product details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500 resize-none"
                ></textarea>
              </div>

              {/* Featured check */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="featured-field"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-800 text-dreamy-lavender-600 focus:ring-dreamy-lavender-500 bg-slate-950"
                />
                <label htmlFor="featured-field" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  Mark as Featured Product
                </label>
              </div>

              {/* Image upload selector & Previews */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Images (Multiple allowed)</label>
                
                {/* File picker input */}
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 p-4 border border-dashed border-slate-850 hover:border-slate-700 bg-slate-950 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Select Image Files
                </label>

                {/* Previews Grid */}
                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {/* Existing Images */}
                    {existingImages.map((img, idx) => (
                      <div key={`existing-${idx}`} className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative group">
                        <img src={resolveImageUrl(img)} alt="Existing product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img)}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {/* New Selection Previews */}
                    {imagePreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-teal-800 relative group">
                        <img src={preview} alt="New selection preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImagePreview(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1 py-0.5 text-[8px] bg-teal-600 rounded text-white font-semibold">New</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-6 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-850 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editingProduct && categories.length === 0}
                  className="py-2.5 px-6 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
