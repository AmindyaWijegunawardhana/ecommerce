import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Gift, User } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useContext(CartContext);
  const { admin } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Cart', path: '/cart' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav class="sticky top-0 z-40 w-full border-b border-dreamy-lavender-100 bg-white/80 backdrop-blur-md transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" class="flex items-center gap-2 group">
            <div class="p-2 rounded-full bg-gradient-to-tr from-dreamy-pink-100 to-dreamy-lavender-200 group-hover:scale-110 transition-transform">
              <Gift class="w-6 h-6 text-dreamy-lavender-700" />
            </div>
            <span class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
              Rashi <span class="text-dreamy-lavender-600 font-semibold italic">Dreamy</span> Gifts
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div class="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                class={`text-sm font-medium tracking-wide transition-colors duration-200 py-1 border-b-2 ${
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
          <div class="hidden md:flex items-center gap-5">
            {admin && (
              <Link
                to="/admin/dashboard"
                class="text-xs font-semibold text-dreamy-lavender-700 bg-dreamy-lavender-50 border border-dreamy-lavender-200 px-3 py-1.5 rounded-full hover:bg-dreamy-lavender-100 transition-colors flex items-center gap-1"
              >
                <User class="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
            
            <Link
              to="/cart"
              class="relative p-2.5 text-slate-700 hover:text-dreamy-lavender-600 hover:bg-dreamy-pink-50 rounded-full transition-all"
            >
              <ShoppingCart class="w-6 h-6" />
              {getCartCount() > 0 && (
                <span class="absolute top-1 right-1 flex h-5 w-5 items-center justify-content justify-center rounded-full bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div class="flex items-center gap-3 md:hidden">
            <Link
              to="/cart"
              class="relative p-2 text-slate-700 hover:text-dreamy-lavender-600 rounded-full transition-all"
            >
              <ShoppingCart class="w-6 h-6" />
              {getCartCount() > 0 && (
                <span class="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-dreamy-lavender-500 to-dreamy-pink-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              class="p-2 text-slate-600 hover:text-dreamy-lavender-600 rounded-full focus:outline-none"
            >
              {isOpen ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        class={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl border-l border-dreamy-lavender-100 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div class="flex items-center justify-between p-5 border-b border-dreamy-lavender-100">
          <span class="font-serif text-lg font-bold text-slate-800">Menu</span>
          <button onClick={() => setIsOpen(false)} class="p-1.5 text-slate-500 hover:text-slate-800 rounded-full bg-slate-50">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex flex-col p-6 gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              class={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'text-dreamy-lavender-700 bg-dreamy-lavender-50 font-semibold'
                  : 'text-slate-600 hover:text-dreamy-lavender-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <hr class="border-dreamy-lavender-100 my-2" />

          {admin ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-dreamy-lavender-600 shadow-md hover:bg-dreamy-lavender-700 transition-colors"
            >
              <User class="w-4 h-4" />
              Go to Admin Panel
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <User class="w-4 h-4" />
              Admin Login
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          class="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
