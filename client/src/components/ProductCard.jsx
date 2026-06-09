import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

  const isOutOfStock = product.stock <= 0;
  
  // Format price
  const formattedPrice = `Rs. ${Number(product.price).toLocaleString('en-IN')}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, 'success');
  };

  // Resolve image source
  const imageSrc = resolveImageUrl(product.images?.[0]) || 'https://via.placeholder.com/400x400.png?text=Rashi+Dreamy+Gifts';

  return (
    <div class="group relative flex flex-col bg-white rounded-2xl border border-dreamy-lavender-100 shadow-xs hover:shadow-md hover:border-dreamy-pink-200 transition-all duration-300 overflow-hidden">
      
      {/* Badges Container */}
      <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.featured && (
          <span class="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-white bg-gradient-to-r from-dreamy-gold to-dreamy-gold-600 rounded-full shadow-xs">
            Featured
          </span>
        )}
        {isOutOfStock ? (
          <span class="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-slate-500 bg-slate-100 border border-slate-200 rounded-full">
            Sold Out
          </span>
        ) : (
          product.stock <= 5 && (
            <span class="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-rose-600 bg-rose-50 border border-rose-100 rounded-full">
              Only {product.stock} Left
            </span>
          )
        )}
      </div>

      {/* Product Image Wrapper */}
      <div class="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View Overlay (desktop only) */}
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            class="p-2.5 rounded-full bg-white text-slate-700 hover:text-dreamy-lavender-600 shadow-md hover:scale-110 transition-all"
            title="View Details"
          >
            <Eye class="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div class="flex flex-col flex-grow p-4 sm:p-5">
        <span class="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
          {product.category?.name || 'Gift Item'}
        </span>
        
        <Link to={`/product/${product._id}`} class="hover:text-dreamy-lavender-600 transition-colors">
          <h3 class="font-serif font-bold text-slate-800 text-base sm:text-lg mb-1.5 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span class="font-sans font-bold text-slate-800 text-base sm:text-lg">
            {formattedPrice}
          </span>

          <div class="flex gap-2">
            <Link
              to={`/product/${product._id}`}
              class="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 transition-colors"
            >
              <Eye class="w-4 h-4" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              class={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed'
                  : 'bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-lavender-600 hover:from-dreamy-lavender-600 hover:to-dreamy-lavender-700 text-white'
              }`}
            >
              <ShoppingCart class="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
