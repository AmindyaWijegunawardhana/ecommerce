import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products when query params change (supports incoming links from Home/Footer)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');

        if (search) queryParams.set('search', search);
        if (category) queryParams.set('category', category);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-dreamy-lavender-100">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Dreamy Collection</span>
          <h1 className="text-3xl font-serif font-bold text-slate-800">
            {searchParams.get('category') ? `${searchParams.get('category')} Collection` : 'Browse Shop'}
          </h1>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white/40">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif font-bold text-slate-800 text-xl mb-2">No products found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any items in this collection right now. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
