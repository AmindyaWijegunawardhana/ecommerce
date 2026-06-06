import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ShoppingBag, Send, Phone, MapPin, User, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { SettingsContext } from '../context/SettingsContext';
import { ToastContext } from '../context/ToastContext';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  } = useContext(CartContext);

  const { settings, loading: settingsLoading } = useContext(SettingsContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Price formatting helper
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
  };

  const itemTotal = getCartTotal();
  const deliveryCharge = settings?.deliveryCharge || 50;
  const grandTotal = itemTotal + deliveryCharge;

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      addToast('Please fill in all customer details', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare payload for the database
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        itemTotal,
        deliveryCharge,
        grandTotal
      };

      // 2. Save order to MongoDB database
      const response = await axios.post('/api/orders', orderPayload);
      const savedOrder = response.data;
      
      addToast('Order saved! Redirecting to WhatsApp...', 'success');

      // 3. Construct the WhatsApp message body
      let message = `*✨ NEW ORDER - RASHI DREAMY GIFTS ✨*\n\n`;
      message += `*👤 Customer Details:*\n`;
      message += `Name: ${customerName.trim()}\n`;
      message += `Phone: ${phoneNumber.trim()}\n`;
      message += `Address: ${address.trim()}\n\n`;

      message += `*🎁 Ordered Items:*\n`;
      cartItems.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(itemSubtotal)}\n`;
      });
      message += `\n`;

      message += `*💳 Order Summary:*\n`;
      message += `Items Subtotal: ${formatCurrency(itemTotal)}\n`;
      message += `Delivery Fee: ${formatCurrency(deliveryCharge)}\n`;
      message += `*Grand Total: ${formatCurrency(grandTotal)}*\n\n`;
      
      message += `Thank you for shopping with Rashi Dreamy Gifts! 💕`;

      // 4. Clean target phone number
      const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

      // 5. Generate API WhatsApp redirect URL
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

      // 6. Clear shopping cart and redirect
      clearCart();
      setIsSubmitting(false);
      
      // Open WhatsApp in a new tab / redirect window
      window.open(whatsappUrl, '_blank');
      
      // Navigate to homepage
      navigate('/');
    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.response?.data?.message || 'Failed to submit order. Please check item stock.', 'error');
      setIsSubmitting(false);
    }
  };

  // If the cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div class="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div class="w-20 h-20 bg-dreamy-pink-50 rounded-full flex items-center justify-center mx-auto text-dreamy-lavender-500 shadow-inner">
          <ShoppingBag class="w-10 h-10 animate-bounce" />
        </div>
        <div class="space-y-2">
          <h2 class="font-serif text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
          <p class="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our fancy catalog to find the perfect gifts.
          </p>
        </div>
        <Link
          to="/shop"
          class="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-dreamy-lavender-600 to-dreamy-lavender-750 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Browse Shop Now
          <ArrowRight class="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <h1 class="text-3xl font-serif font-bold text-slate-800 mb-8 sm:mb-12 border-b border-dreamy-lavender-100 pb-4">
        Your Cart
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* ================= ITEMS LIST COLUMN ================= */}
        <div class="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-dreamy-lavender-100 shadow-xs hover:border-dreamy-pink-100 transition-colors"
            >
              {/* Product Thumbnail */}
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/150x150.png?text=Gift'}
                  alt={item.name}
                  class="w-full h-full object-cover"
                />
              </div>

              {/* Title, Category & Price */}
              <div class="flex-grow text-center sm:text-left space-y-1">
                <Link to={`/product/${item.product}`} class="hover:text-dreamy-lavender-650 transition-colors">
                  <h3 class="font-serif font-bold text-slate-800 text-base leading-snug">{item.name}</h3>
                </Link>
                <p class="text-xs text-slate-500 font-semibold">{formatCurrency(item.price)} each</p>
              </div>

              {/* Quantity Selector & Item Total */}
              <div class="flex items-center gap-6 sm:gap-8 justify-between w-full sm:w-auto">
                {/* Quantity Control */}
                <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    class="p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    class="p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div class="text-right flex flex-col items-end">
                  <span class="font-bold text-sm text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      removeFromCart(item.product);
                      addToast(`${item.name} removed from cart.`, 'info');
                    }}
                    class="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-0.5 mt-1 transition-colors"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY & CHECKOUT FORM ================= */}
        <div class="space-y-6">
          
          {/* Order Summary Panel */}
          <div class="p-6 rounded-2xl bg-white border border-dreamy-lavender-100 shadow-xs space-y-4">
            <h3 class="font-serif font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Order Summary</h3>
            
            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>{formatCurrency(itemTotal)}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Charge</span>
                <span>{formatCurrency(deliveryCharge)}</span>
              </div>
              <hr class="border-slate-100 my-2" />
              <div class="flex justify-between font-bold text-slate-800 text-base">
                <span>Grand Total</span>
                <span class="text-dreamy-lavender-700">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer Form Panel */}
          <form
            onSubmit={handleCheckout}
            class="p-6 rounded-2xl bg-white border border-dreamy-lavender-100 shadow-xs space-y-5"
          >
            <h3 class="font-serif font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Delivery Details</h3>

            {/* Name Input */}
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <User class="w-3.5 h-3.5 text-slate-400" />
                Customer Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                class="p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
              />
            </div>

            {/* Phone Input */}
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Phone class="w-3.5 h-3.5 text-slate-400" />
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="Enter contact phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                class="p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50"
              />
            </div>

            {/* Address Input */}
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-slate-400" />
                Delivery Address
              </label>
              <textarea
                required
                rows="3"
                placeholder="Enter complete shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                class="p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-400 focus:border-dreamy-lavender-400 bg-slate-50/50 resize-none"
              ></textarea>
            </div>

            {/* Checkout Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 hover:scale-101 hover:shadow-lg transition-all disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send class="w-4 h-4" />
              {isSubmitting ? 'Processing Order...' : 'Place Order via WhatsApp'}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Cart;
