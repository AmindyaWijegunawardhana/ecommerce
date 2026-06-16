import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, Shield, Check, Info, ArrowLeft, Plus, Minus, User, Phone, MapPin, Send, X, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { SettingsContext } from '../context/SettingsContext';
import { resolveImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const { settings } = useContext(SettingsContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        const fetchedProduct = res.data;
        setProduct(fetchedProduct);
        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
        setError(null);

        // Fetch related products
        if (fetchedProduct.category) {
          try {
            const relatedRes = await axios.get(`${API_URL}/api/products?category=${fetchedProduct.category._id}`);
            const filtered = relatedRes.data.filter(p => p._id !== fetchedProduct._id);
            setRelatedProducts(filtered.slice(0, 4));
          } catch (relatedErr) {
            console.error('Error fetching related products:', relatedErr.message);
          }
        }
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
    setShowConfirm(true);
  };

  const confirmAddToCart = () => {
    addToCart(product, quantity);
    addToast(`${quantity} x ${product.name} added to cart!`, 'success');
    setShowConfirm(false);
  };

  const handleDirectBuy = () => {
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

    const itemTotal = product.price * quantity;
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
            quantity: quantity
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
      message += `1. ${product.name} x ${quantity}\n\n`;
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dreamy-lavender-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <Info className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-slate-800">Error Loading Product</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{error || 'Product not found'}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-dreamy-lavender-600 text-white rounded-xl text-sm font-semibold hover:bg-dreamy-lavender-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      
      {/* Back Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-dreamy-lavender-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* ================= IMAGE GALLERY ================= */}
        <div className="space-y-4">
          {/* Main Large Image Container */}
          <div className="aspect-square bg-slate-50 border border-dreamy-lavender-100 rounded-2xl overflow-hidden shadow-xs relative">
            <img
              src={resolveImageUrl(selectedImage) || 'https://via.placeholder.com/600x600.png?text=Rashi+Dreamy+Gifts'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-dreamy-gold to-dreamy-gold-600 rounded-full shadow-xs uppercase tracking-wide">
                Featured Pick
              </span>
            )}
          </div>

          {/* Thumbnails Gallery Slider */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all ${
                    selectedImage === img
                      ? 'border-dreamy-lavender-500 ring-2 ring-dreamy-lavender-100'
                      : 'border-dreamy-lavender-100 hover:border-dreamy-pink-200'
                  }`}
                >
                  <img src={resolveImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCT DETAILS CONTENT ================= */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            {/* Category tag */}
            <span className="text-xs font-bold tracking-widest text-dreamy-lavender-600 uppercase">
              {product.category?.name || 'Gift Item'}
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-800 mt-1 mb-3">
              {product.name}
            </h1>
            
            {/* Rating badge / Stock label */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-2xl text-slate-800">{formattedPrice}</span>
              <span className="h-4 w-px bg-slate-200"></span>
              
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                  Low Stock: Only {product.stock} left
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-dreamy-lavender-50 text-dreamy-lavender-650 border border-dreamy-lavender-100">
                  In Stock ({product.stock})
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About this item</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <hr className="border-dreamy-lavender-100" />

          {/* Actions & Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-500">Quantity</span>
                
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-700">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border border-dreamy-lavender-300 hover:bg-dreamy-lavender-50/50 text-dreamy-lavender-750 rounded-xl font-semibold text-sm transition-all hover:scale-101 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleDirectBuy}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-dreamy-pink-500 to-dreamy-lavender-600 hover:from-dreamy-pink-600 hover:to-dreamy-lavender-750 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-101 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Core Values Badge panel */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dreamy-pink-50/40 border border-dreamy-pink-100/40">
              <Shield className="w-5 h-5 text-dreamy-lavender-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Secure Order</h4>
                <p className="text-[10px] text-slate-400">Processed in DB & WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dreamy-lavender-50/40 border border-dreamy-lavender-100/40">
              <Check className="w-5 h-5 text-dreamy-lavender-650 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Assured Quality</h4>
                <p className="text-[10px] text-slate-400">Hand-inspected gifts</p>
              </div>
            </div>
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
                src={resolveImageUrl(selectedImage || product.images?.[0]) || 'https://via.placeholder.com/400x400.png?text=Rashi+Dreamy+Gifts'} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            <h3 className="font-serif font-bold text-slate-800 text-lg sm:text-xl mb-2">
              Add to Shopping Cart?
            </h3>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Do you want to add <strong>{quantity} x {product.name}</strong> to your cart?
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
                  src={resolveImageUrl(selectedImage || product.images?.[0]) || 'https://via.placeholder.com/400x400.png?text=Rashi+Dreamy+Gifts'} 
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

              {/* Qty Display */}
              <div className="text-xs text-slate-500 font-bold bg-white px-2.5 py-1 border border-slate-200 rounded-lg">
                Qty: {quantity}
              </div>
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs text-slate-600 p-4 bg-dreamy-pink-50/20 border border-dreamy-pink-100/20 rounded-2xl">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">Rs. {(product.price * quantity).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Flat Delivery Fee:</span>
                <span className="font-semibold text-slate-800">Rs. {(settings?.deliveryCharge || 50).toLocaleString('en-IN')}</span>
              </div>
              <hr className="border-slate-100 my-1" />
              <div className="flex justify-between font-bold text-sm text-slate-800">
                <span>Grand Total:</span>
                <span className="text-dreamy-lavender-700">Rs. {(product.price * quantity + (settings?.deliveryCharge || 50)).toLocaleString('en-IN')}</span>
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
      )}{/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 border-t border-dreamy-lavender-100 pt-12 sm:pt-16">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-800 mb-8 tracking-tight">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
