import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Gift } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { SettingsContext } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useContext(CartContext);
  const { settings } = useContext(SettingsContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Cart', path: '/cart' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-dreamy-lavender-100 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full bg-gradient-to-tr from-dreamy-pink-100 to-dreamy-lavender-200 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6 text-dreamy-lavender-700" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
              {settings?.storeName || 'Rashi Dreamy Gifts'}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 py-1 border-b-2 ${
                  isActive(link.path)
                    ? 'text-dreamy-lavender-700 border-dreamy-gold'
                    : 'text-slate-600 border-transparent hover:text-dreamy-lavender-600 hover:border-dreamy-pink-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-700 hover:text-dreamy-lavender-600 hover:bg-dreamy-pink-50 rounded-full transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-content justify-center rounded-full bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-dreamy-lavender-600 rounded-full transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-pink-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-dreamy-lavender-600 rounded-full focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 h-screen bg-white shadow-2xl border-l border-dreamy-lavender-100 transform transition-transform duration-300 md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-dreamy-lavender-100 flex-shrink-0">
          <span className="font-serif text-lg font-bold text-slate-800">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-full bg-slate-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-5 items-stretch text-left flex-grow overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'text-dreamy-lavender-700 bg-dreamy-lavender-50 font-semibold'
                  : 'text-slate-600 hover:text-dreamy-lavender-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
