import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, AlertCircle, Tags } from 'lucide-react';
import { ToastContext } from '../context/ToastContext';

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
      const res = await axios.get('/api/categories');
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
        await axios.put(`/api/categories/${editingCategory._id}`, payload);
        addToast('Category updated successfully', 'success');
      } else {
        await axios.post('/api/categories', payload);
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
        await axios.delete(`/api/categories/${id}`);
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
    return <div class="text-center text-slate-500 py-20">Loading categories...</div>;
  }

  return (
    <div class="space-y-10">
      
      {/* Title Header */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-serif font-bold text-white tracking-wide">Product Categories</h1>
          <p class="text-xs text-slate-500 mt-1">Add or edit tags to organize your shop items</p>
        </div>
        <button
          onClick={openAddModal}
          class="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div class="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-350 text-sm">
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Categories table layout */}
      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {categories.length > 0 ? (
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th class="p-5">Category Name</th>
                <th class="p-5">Description</th>
                <th class="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-sm text-slate-300">
              {categories.map((cat) => (
                <tr key={cat._id} class="hover:bg-slate-800/35 transition-colors">
                  <td class="p-5 font-semibold text-white flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-dreamy-pink-500/10 text-dreamy-pink-400 flex items-center justify-center">
                      <Tags class="w-4 h-4" />
                    </div>
                    {cat.name}
                  </td>
                  <td class="p-5 text-slate-400 max-w-sm truncate">
                    {cat.description || <span class="italic text-slate-600">No description</span>}
                  </td>
                  <td class="p-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      class="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      class="inline-flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div class="text-center py-20">
            <Tags class="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
            <h3 class="font-serif font-bold text-white text-lg">No Categories Found</h3>
            <p class="text-slate-500 text-xs mt-1 font-light">Create categories to structure your items.</p>
          </div>
        )}
      </div>

      {/* ================= EDIT/ADD CATEGORY MODAL ================= */}
      {isModalOpen && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"></div>

          {/* Modal Container */}
          <div class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 class="font-serif font-bold text-white text-xl">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} class="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} class="space-y-4">
              
              {/* Category Name */}
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Mugs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                />
              </div>

              {/* Description */}
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe this product category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500 resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div class="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  class="py-2 px-5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-850 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="py-2 px-5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-700 text-white font-semibold text-xs transition-colors"
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
