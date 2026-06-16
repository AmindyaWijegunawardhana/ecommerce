import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Eye, User, Phone, MapPin, Send, X, CreditCard, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { SettingsContext } from '../context/SettingsContext';
import { resolveImageUrl } from '../utils/api';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const { settings } = useContext(SettingsContext);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);
  const [directQty, setDirectQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDirectBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDirectQty(1);
    setCustomerName('');
    setPhoneNumber('');
    setAddress('');
    setShowDirectCheckout(true);
  };

  const handleDirectCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      addToast('Please fill in all customer details', 'error');
      return;
    }

    setIsSubmitting(true);

    const itemTotal = product.price * directQty;
    const deliveryCharge = settings?.deliveryCharge || 50;
    const grandTotal = itemTotal + deliveryCharge;

    try {
      // 1. Create single item order in DB
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: directQty
          }
        ],
        itemTotal,
        deliveryCharge,
        grandTotal
      };

      await axios.post(`${API_URL}/api/orders`, orderPayload);
      addToast('Order saved! Redirecting to WhatsApp...', 'success');

      // 2. Generate WhatsApp message matching the template
      let message = `Hello Rashi Dreamy Gifts,\n\n`;
      message += `I would like to place an order.\n\n`;
      message += `Customer Name:\n${customerName.trim()}\n\n`;
      message += `Phone:\n${phoneNumber.trim()}\n\n`;
      message += `Address:\n${address.trim()}\n\n`;
      message += `Items:\n\n`;
      message += `1. ${product.name} x ${directQty}\n\n`;
      message += `Items Total:\nRs. ${itemTotal.toLocaleString('en-IN')}\n\n`;
      message += `Delivery Fee:\nRs. ${deliveryCharge.toLocaleString('en-IN')}\n\n`;
      message += `Grand Total:\nRs. ${grandTotal.toLocaleString('en-IN')}\n\n`;
      message += `Thank you.`;

      const cleanPhone = settings?.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '94707066217';
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

      setIsSubmitting(false);
      setShowDirectCheckout(false);

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Direct buy error:', err);
      addToast(err.response?.data?.message || 'Failed to submit order. Please check stock.', 'error');
      setIsSubmitting(false);
    }
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

          <div className="flex gap-1.5 sm:gap-2">
            <Link
              to={`/product/${product._id}`}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed'
                  : 'bg-slate-50 hover:bg-dreamy-lavender-50 text-slate-700 hover:text-dreamy-lavender-650 border border-slate-200'
              }`}
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={handleDirectBuy}
              disabled={isOutOfStock}
              className={`flex items-center justify-center py-1.5 px-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed'
                  : 'bg-gradient-to-r from-dreamy-pink-500 to-dreamy-lavender-600 hover:from-dreamy-pink-600 hover:to-dreamy-lavender-750 text-white'
              }`}
            >
              <span>Order</span>
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
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-dreamy-lavender-100 mx-auto mb-4 shadow-sm">
              <img 
                src={imageSrc} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
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

      {/* Custom Direct Purchase Checkout Modal */}
      {showDirectCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setShowDirectCheckout(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-dreamy-lavender-100 animate-fade-in z-10 transform scale-100 transition-all flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-dreamy-lavender-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-dreamy-pink-500" />
                <h3 className="font-serif font-bold text-slate-800 text-lg sm:text-xl">
                  Direct Checkout
                </h3>
              </div>
              <button 
                onClick={() => setShowDirectCheckout(false)}
                className="p-1 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Row */}
            <div className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-dreamy-lavender-100 shadow-2xs flex-shrink-0">
                <img 
                  src={imageSrc} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-serif font-bold text-slate-800 text-sm sm:text-base truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Rs. {product.price.toLocaleString('en-IN')} each
                </p>
              </div>

              {/* Qty Selector */}
              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setDirectQty(prev => Math.max(1, prev - 1))}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-700">{directQty}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (directQty < product.stock) {
                      setDirectQty(prev => prev + 1);
                    } else {
                      addToast(`Only ${product.stock} items left in stock.`, 'info');
                    }
                  }}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs text-slate-600 p-4 bg-dreamy-pink-50/20 border border-dreamy-pink-100/20 rounded-2xl">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">Rs. {(product.price * directQty).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Flat Delivery Fee:</span>
                <span className="font-semibold text-slate-800">Rs. {(settings?.deliveryCharge || 50).toLocaleString('en-IN')}</span>
              </div>
              <hr className="border-slate-100 my-1" />
              <div className="flex justify-between font-bold text-sm text-slate-800">
                <span>Grand Total:</span>
                <span className="text-dreamy-lavender-700">Rs. {(product.price * directQty + (settings?.deliveryCharge || 50)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleDirectCheckoutSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter recipient full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
                />
              </div>

              {/* Phone Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter contact number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
                />
              </div>

              {/* Address Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Shipping Address *
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="Enter complete delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50 resize-none"
                ></textarea>
              </div>

              {/* Submit buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowDirectCheckout(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-dreamy-pink-500 to-dreamy-lavender-650 hover:from-dreamy-pink-600 hover:to-dreamy-lavender-750 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-101 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Ordering...' : 'Order via WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
