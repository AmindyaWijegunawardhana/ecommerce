import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, Shield, Check, Info, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err.message);
        setError('Failed to load product details. It might have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      addToast(`Only ${product.stock} items left in stock.`, 'info');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    addToast(`${quantity} x ${product.name} added to cart!`, 'success');
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-4 border-dreamy-lavender-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-slate-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div class="max-w-md mx-auto space-y-4">
          <Info class="w-12 h-12 text-rose-500 mx-auto" />
          <h2 class="font-serif text-2xl font-bold text-slate-800">Error Loading Product</h2>
          <p class="text-slate-500 text-sm leading-relaxed">{error || 'Product not found'}</p>
          <Link
            to="/shop"
            class="inline-flex items-center gap-2 py-2.5 px-6 bg-dreamy-lavender-600 text-white rounded-xl text-sm font-semibold hover:bg-dreamy-lavender-700 transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  
  // Format price
  const formattedPrice = `Rs. ${Number(product.price).toLocaleString('en-IN')}`;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      
      {/* Back Button */}
      <Link
        to="/shop"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-dreamy-lavender-600 mb-8 transition-colors group"
      >
        <ArrowLeft class="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Products
      </Link>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* ================= IMAGE GALLERY ================= */}
        <div class="space-y-4">
          {/* Main Large Image Container */}
          <div class="aspect-square bg-slate-50 border border-dreamy-lavender-100 rounded-2xl overflow-hidden shadow-xs relative">
            <img
              src={selectedImage || 'https://via.placeholder.com/600x600.png?text=Rashi+Dreamy+Gifts'}
              alt={product.name}
              class="w-full h-full object-cover"
            />
            {product.featured && (
              <span class="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-dreamy-gold to-dreamy-gold-600 rounded-full shadow-xs uppercase tracking-wide">
                Featured Pick
              </span>
            )}
          </div>

          {/* Thumbnails Gallery Slider */}
          {product.images && product.images.length > 1 && (
            <div class="flex gap-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  class={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all ${
                    selectedImage === img
                      ? 'border-dreamy-lavender-500 ring-2 ring-dreamy-lavender-100'
                      : 'border-dreamy-lavender-100 hover:border-dreamy-pink-200'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} class="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCT DETAILS CONTENT ================= */}
        <div class="space-y-6 sm:space-y-8">
          <div>
            {/* Category tag */}
            <span class="text-xs font-bold tracking-widest text-dreamy-lavender-600 uppercase">
              {product.category?.name || 'Gift Item'}
            </span>
            
            <h1 class="text-3xl sm:text-4xl font-bold font-serif text-slate-800 mt-1 mb-3">
              {product.name}
            </h1>
            
            {/* Rating badge / Stock label */}
            <div class="flex items-center gap-4">
              <span class="font-bold text-2xl text-slate-800">{formattedPrice}</span>
              <span class="h-4 w-px bg-slate-200"></span>
              
              {isOutOfStock ? (
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                  Low Stock: Only {product.stock} left
                </span>
              ) : (
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  In Stock ({product.stock})
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">About this item</h3>
            <p class="text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <hr class="border-dreamy-lavender-100" />

          {/* Actions & Quantity Selector */}
          {!isOutOfStock && (
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <span class="text-sm font-semibold text-slate-500">Quantity</span>
                
                <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    class="p-2.5 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="w-10 text-center text-sm font-bold text-slate-700">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    class="p-2.5 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  class="flex-grow flex items-center justify-center gap-2 py-3.5 px-8 bg-gradient-to-r from-dreamy-lavender-600 to-dreamy-lavender-750 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-101 cursor-pointer"
                >
                  <ShoppingCart class="w-5 h-5" />
                  Add to Shopping Cart
                </button>
              </div>
            </div>
          )}

          {/* Core Values Badge panel */}
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <div class="flex items-center gap-3 p-3 rounded-xl bg-dreamy-pink-50/40 border border-dreamy-pink-100/40">
              <Shield class="w-5 h-5 text-dreamy-lavender-600 flex-shrink-0" />
              <div>
                <h4 class="text-xs font-bold text-slate-800">Secure Order</h4>
                <p class="text-[10px] text-slate-400">Processed in DB & WhatsApp</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-xl bg-dreamy-lavender-50/40 border border-dreamy-lavender-100/40">
              <Check class="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 class="text-xs font-bold text-slate-800">Assured Quality</h4>
                <p class="text-[10px] text-slate-400">Hand-inspected gifts</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
