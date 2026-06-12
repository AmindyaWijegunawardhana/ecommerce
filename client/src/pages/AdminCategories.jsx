import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, AlertCircle, Tags } from 'lucide-react';
import { ToastContext } from '../context/ToastContext';
// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AdminCategories = () => {
  const { addToast } = useContext(ToastContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null means adding new

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories list. Check database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        description: description.trim()
      };

      if (editingCategory) {
        await axios.put(`${API_URL}/api/categories/${editingCategory._id}`, payload);
        addToast('Category updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/api/categories`, payload);
        addToast('Category created successfully', 'success');
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        addToast('Category deleted successfully', 'success');
        loadCategories();
      } catch (err) {
        console.error(err);
        const errorMsg = err.response?.data?.message || 'Failed to delete category';
        addToast(errorMsg, 'error');
      }
    }
  };

  if (loading && categories.length === 0) {
    return <div className="text-center text-slate-500 py-20">Loading categories...</div>;
  }

  return (
    <div className="space-y-10">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Product Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Add or edit tags to organize your shop items</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-350 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Categories table layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {categories.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="p-5">Category Name</th>
                <th className="p-5">Description</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-800/35 transition-colors">
                  <td className="p-5 font-semibold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-dreamy-pink-500/10 text-dreamy-pink-400 flex items-center justify-center">
                      <Tags className="w-4 h-4" />
                    </div>
                    {cat.name}
                  </td>
                  <td className="p-5 text-slate-400 max-w-sm truncate">
                    {cat.description || <span className="italic text-slate-600">No description</span>}
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-20">
            <Tags className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif font-bold text-white text-lg">No Categories Found</h3>
            <p className="text-slate-500 text-xs mt-1 font-light">Create categories to structure your items.</p>
          </div>
        )}
      </div>

      {/* ================= EDIT/ADD CATEGORY MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif font-bold text-white text-xl">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Mugs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe this product category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500 resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-850 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 text-white font-semibold text-xs transition-colors"
                >
                  Save Category
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
