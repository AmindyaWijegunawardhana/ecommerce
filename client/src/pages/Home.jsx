import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Gift, Sparkles, Heart, Clock, ArrowRight, MessageSquare, Award, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SettingsContext } from '../context/SettingsContext';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/api/products?featured=true`),
          axios.get(`${API_URL}/api/categories`)
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 4));
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const { settings } = useContext(SettingsContext);

  const cleanPhone = settings?.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const waUrl = `https://wa.me/${cleanPhone || '94707066217'}?text=Hello%20Rashi%20Dreamy%20Gifts%2C%20I%20would%20like%20to%20inquire%20about%20your%20gifts%21`;

  const valueProps = [
    {
      icon: <Award className="w-6 h-6 text-dreamy-gold" />,
      title: 'Quality Products',
      desc: 'We curate premium items, exquisite hand-picked hampers, and pristine gifts ensuring perfection.'
    },
    {
      icon: <Heart className="w-6 h-6 text-dreamy-pink-500" />,
      title: 'Affordable Prices',
      desc: 'Thoughtfully priced gift combinations to celebrate milestones without stretching your budget.'
    },
    {
      icon: <Truck className="w-6 h-6 text-dreamy-lavender-500" />,
      title: 'Islandwide Delivery',
      desc: 'Reliable and fast shipping to deliver heartwarming surprises directly to any address.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Trusted Service',
      desc: 'Committed support and easy direct-to-chat coordinates keeping your orders safe.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-tr from-dreamy-pink-100/50 via-dreamy-pink-50/30 to-dreamy-lavender-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-dreamy-lavender-700 bg-dreamy-lavender-50 border border-dreamy-lavender-150 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Gift Shop & Fancy Items
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.15]">
              Dreamy Gifts for <br className="hidden sm:inline" />
              <span className="gold-text-gradient italic">Every Special Moment</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-light">
              Beautiful gifts crafted to create unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-dreamy-lavender-600 to-dreamy-lavender-700 shadow-md hover:shadow-lg hover:scale-102 transition-all cursor-pointer"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Abstract dreamy blobs in background */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-dreamy-pink-100 blur-3xl opacity-60 animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-dreamy-lavender-100 blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Curated Picks</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-1">Featured Products</h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="flex items-center gap-1 text-sm font-semibold text-dreamy-lavender-600 hover:text-dreamy-lavender-750 transition-colors"
          >
            See All Featured
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
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
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Gift className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-bounce" />
            <p className="text-sm text-slate-500">No featured products available yet.</p>
            <Link to="/shop" className="text-xs font-semibold text-dreamy-lavender-600 mt-1 inline-block">Browse Catalog</Link>
          </div>
        )}
      </section>

      {/* 3. Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/40 rounded-3xl border border-dreamy-lavender-100/50">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Collections</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-1">Browse Categories</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-dreamy-lavender-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group p-5 rounded-2xl bg-white border border-dreamy-lavender-100 hover:border-dreamy-pink-200 text-center shadow-xs hover:shadow-md hover:scale-102 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-dreamy-pink-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-dreamy-pink-100 transition-all">
                  <Sparkles className="w-5 h-5 text-dreamy-lavender-600" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-base mb-1">{category.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{category.description || 'Browse products'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm">No categories created yet.</div>
        )}
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Core Strengths</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-1">Why Choose Us?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-dreamy-lavender-100/60 shadow-xs hover:border-dreamy-pink-200 transition-all hover:-translate-y-1 hover:shadow-md duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                {prop.icon}
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-800 text-lg mb-2">{prop.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default Home;
