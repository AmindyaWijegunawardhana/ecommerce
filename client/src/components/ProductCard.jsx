import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOutOfStock = product.stock <= 0;
  
  // Format price
  const formattedPrice = `Rs. ${Number(product.price).toLocaleString('en-IN')}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmAddToCart = () => {
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, 'success');
    setShowConfirm(false);
  };

  // Resolve image source
  const imageSrc = resolveImageUrl(product.images?.[0]) || 'https://via.placeholder.com/400x400.png?text=Rashi+Dreamy+Gifts';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-dreamy-lavender-100 shadow-xs hover:shadow-md hover:border-dreamy-pink-200 transition-all duration-300 overflow-hidden">
      
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.featured && (
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-white bg-gradient-to-r from-dreamy-gold to-dreamy-gold-600 rounded-full shadow-xs">
            Featured
          </span>
        )}
        {isOutOfStock ? (
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-slate-500 bg-slate-100 border border-slate-200 rounded-full">
            Sold Out
          </span>
        ) : (
          product.stock <= 5 && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-rose-600 bg-rose-50 border border-rose-100 rounded-full">
              Only {product.stock} Left
            </span>
          )
        )}
      </div>

      {/* Product Image Wrapper */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View Overlay (desktop only) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            className="p-2.5 rounded-full bg-white text-slate-700 hover:text-dreamy-lavender-600 shadow-md hover:scale-110 transition-all"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
          {product.category?.name || 'Gift Item'}
        </span>
        
        <Link to={`/product/${product._id}`} className="hover:text-dreamy-lavender-600 transition-colors">
          <h3 className="font-serif font-bold text-slate-800 text-base sm:text-lg mb-1.5 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span className="font-sans font-bold text-slate-800 text-base sm:text-lg">
            {formattedPrice}
          </span>

          <div className="flex gap-2">
            <Link
              to={`/product/${product._id}`}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed'
                  : 'bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-lavender-600 hover:from-dreamy-lavender-600 hover:to-dreamy-lavender-700 text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>

      {/* Custom Add to Cart Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setShowConfirm(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-dreamy-lavender-100 animate-fade-in z-10 transform scale-100 transition-all">
            <div className="w-16 h-16 bg-dreamy-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-dreamy-pink-500 shadow-inner">
              <ShoppingCart className="w-8 h-8" />
            </div>

            <h3 className="font-serif font-bold text-slate-800 text-lg sm:text-xl mb-2">
              Add to Shopping Cart?
            </h3>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Do you want to add <strong>{product.name}</strong> to your cart?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                No, cancel
              </button>
              <button
                onClick={confirmAddToCart}
                className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-dreamy-pink-500 to-dreamy-lavender-600 hover:from-dreamy-pink-600 hover:to-dreamy-lavender-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-101 cursor-pointer"
              >
                Yes, add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCard;
