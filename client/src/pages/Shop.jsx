import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, X, ArrowUpDown, HelpCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for filter values
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local state mirrored from SearchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [featured, setFeatured] = useState(searchParams.get('featured') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  
  // Mobile filter drawer visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (category) queryParams.set('category', category);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (featured) queryParams.set('featured', featured);

        const res = await axios.get(`${API_URL}/api/products?${queryParams.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Synchronize internal state with changes to SearchParams
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setFeatured(searchParams.get('featured') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
  }, [searchParams]);

  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (featured) params.featured = featured;
    if (sortBy) params.sortBy = sortBy;
    
    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setFeatured('');
    setSortBy('newest');
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortBy === 'price-asc') {
      return sorted.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name-asc') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'name-desc') {
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-dreamy-lavender-100">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Dreamy Collection</span>
          <h1 className="text-3xl font-serif font-bold text-slate-800">Browse Shop</h1>
        </div>
        
        {/* Toggle Button for mobile filters */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8 items-start">
        
        {/* ================= DESKTOP FILTERS PANEL ================= */}
        <aside className="hidden md:block w-64 p-6 rounded-2xl bg-white border border-dreamy-lavender-100 shadow-xs flex-shrink-0 sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h3 className="font-serif font-bold text-slate-800 text-lg">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-dreamy-lavender-600 hover:text-dreamy-lavender-800 transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setCategory('')}
                  className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors ${
                    category === ''
                      ? 'bg-dreamy-lavender-50 text-dreamy-lavender-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setCategory(cat.name)}
                    className={`text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors truncate ${
                      category === cat.name
                        ? 'bg-dreamy-lavender-50 text-dreamy-lavender-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="featured-desktop"
                checked={featured === 'true'}
                onChange={(e) => setFeatured(e.target.checked ? 'true' : '')}
                className="rounded border-slate-300 text-dreamy-lavender-600 focus:ring-dreamy-lavender-400"
              />
              <label htmlFor="featured-desktop" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                Featured Items Only
              </label>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-dreamy-lavender-600 to-dreamy-lavender-750 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* ================= PRODUCTS GRID ================= */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-4 animate-pulse">
                  <div className="aspect-square bg-slate-100 rounded-xl"></div>
                  <div className="h-4 bg-slate-100 rounded-sm w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-sm w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-slate-100 rounded-sm w-1/4"></div>
                    <div className="h-8 bg-slate-100 rounded-md w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedProducts().map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white/40">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
              <h3 className="font-serif font-bold text-slate-800 text-xl mb-2">No products found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any items matching your selected filter parameters. Try expanding your search queries or resetting filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 py-2 px-6 rounded-xl border border-dreamy-lavender-200 text-dreamy-lavender-700 font-semibold text-xs hover:bg-dreamy-lavender-50 transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ================= MOBILE FILTERS DRAWER ================= */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Overlay */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
          ></div>

          {/* Drawer content */}
          <div className="relative w-80 max-w-full bg-white h-full flex flex-col p-6 shadow-2xl z-10 animate-fade-in border-l border-dreamy-lavender-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-serif font-bold text-slate-800 text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-6 pr-1">
              {/* Search */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                      category === '' ? 'bg-dreamy-lavender-50 text-dreamy-lavender-800 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setCategory(cat.name)}
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors truncate ${
                        category === cat.name ? 'bg-dreamy-lavender-50 text-dreamy-lavender-800 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-2 text-sm rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-2 text-sm rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="featured-mobile"
                  checked={featured === 'true'}
                  onChange={(e) => setFeatured(e.target.checked ? 'true' : '')}
                  className="rounded border-slate-300 text-dreamy-lavender-600 focus:ring-dreamy-lavender-400"
                />
                <label htmlFor="featured-mobile" className="text-sm font-medium text-slate-600 select-none">
                  Featured Items Only
                </label>
              </div>

              {/* Sort Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto flex gap-3">
              <button
                onClick={clearFilters}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-dreamy-lavender-600 to-dreamy-lavender-700 text-white font-semibold text-xs transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
