import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Mail, Phone, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-white border-t border-dreamy-lavender-100 text-slate-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-8">
          
          {/* Brand Info */}
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <Gift class="w-6 h-6 text-dreamy-lavender-600" />
              <span class="font-serif text-xl font-bold tracking-tight text-slate-800">
                Rashi <span class="text-dreamy-lavender-600 italic font-semibold">Dreamy</span> Gifts
              </span>
            </div>
            <p class="text-sm leading-relaxed text-slate-500">
              Curating beautiful moments, premium hand-picked gifts, and elegant fancy items that make every celebration feel like a dream.
            </p>
            <div class="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                class="p-2 rounded-full border border-dreamy-pink-200 text-slate-400 hover:text-dreamy-pink-500 hover:border-dreamy-pink-400 transition-colors"
              >
                <Instagram class="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                class="p-2 rounded-full border border-dreamy-pink-200 text-slate-400 hover:text-dreamy-lavender-600 hover:border-dreamy-lavender-300 transition-colors"
              >
                <Facebook class="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 class="font-serif font-semibold text-slate-800 mb-4 tracking-wide text-base">Quick Links</h4>
            <div class="flex flex-col gap-3 text-sm">
              <Link to="/" class="hover:text-dreamy-lavender-600 transition-colors">Home</Link>
              <Link to="/shop" class="hover:text-dreamy-lavender-600 transition-colors">Browse Shop</Link>
              <Link to="/cart" class="hover:text-dreamy-lavender-600 transition-colors">Shopping Cart</Link>
              <Link to="/about" class="hover:text-dreamy-lavender-600 transition-colors">About Our Story</Link>
            </div>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 class="font-serif font-semibold text-slate-800 mb-4 tracking-wide text-base">Shop Collection</h4>
            <div class="flex flex-col gap-3 text-sm text-slate-500">
              <Link to="/shop?category=Handmade" class="hover:text-dreamy-lavender-600 transition-colors">Handmade Items</Link>
              <Link to="/shop?category=Decorations" class="hover:text-dreamy-lavender-600 transition-colors">Dreamy Decor</Link>
              <Link to="/shop?category=Mugs" class="hover:text-dreamy-lavender-600 transition-colors">Custom Mugs</Link>
              <Link to="/shop?category=Combos" class="hover:text-dreamy-lavender-600 transition-colors">Gift Combos</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div class="flex flex-col gap-4">
            <h4 class="font-serif font-semibold text-slate-800 mb-2 tracking-wide text-base">Get in Touch</h4>
            <div class="flex flex-col gap-3 text-sm">
              <div class="flex items-start gap-2.5">
                <MapPin class="w-4.5 h-4.5 text-dreamy-lavender-500 mt-0.5 flex-shrink-0" />
                <span>Rashi Dreamy Gifts, Main Bazar Road, City Center, India</span>
              </div>
              <div class="flex items-center gap-2.5">
                <Phone class="w-4.5 h-4.5 text-dreamy-lavender-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div class="flex items-center gap-2.5">
                <Mail class="w-4.5 h-4.5 text-dreamy-lavender-500 flex-shrink-0" />
                <span>info@rashidreamygifts.com</span>
              </div>
            </div>
          </div>

        </div>

        <hr class="border-dreamy-lavender-100 my-8" />

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Rashi Dreamy Gifts. All rights reserved.</p>
          <p class="flex items-center gap-1">
            Made with <Heart class="w-3 h-3 text-dreamy-pink-500 fill-dreamy-pink-500" /> for your loved ones.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
