import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Mail, Phone, MapPin, Instagram, Facebook, Heart } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useContext(SettingsContext);

  return (
    <footer className="bg-white border-t border-dreamy-lavender-100 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-dreamy-lavender-600" />
              <span className="font-serif text-xl font-bold tracking-tight text-slate-800">
                {settings?.storeName || 'Rashi Dreamy Gifts'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Curating beautiful moments, premium hand-picked gifts, and elegant fancy items that make every celebration feel like a dream.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-dreamy-pink-200 text-slate-400 hover:text-dreamy-pink-500 hover:border-dreamy-pink-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-dreamy-pink-200 text-slate-400 hover:text-dreamy-lavender-650 hover:border-dreamy-lavender-300 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-slate-800 mb-4 tracking-wide text-base">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/" className="hover:text-dreamy-lavender-600 transition-colors">Home</Link>
              <Link to="/shop" className="hover:text-dreamy-lavender-600 transition-colors">Browse Shop</Link>
              <Link to="/cart" className="hover:text-dreamy-lavender-600 transition-colors">Shopping Cart</Link>
              <Link to="/about" className="hover:text-dreamy-lavender-600 transition-colors">About Our Story</Link>
            </div>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-slate-800 mb-4 tracking-wide text-base">Shop Collection</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-500">
              <Link to="/shop?category=Handmade" className="hover:text-dreamy-lavender-600 transition-colors">Handmade Items</Link>
              <Link to="/shop?category=Decorations" className="hover:text-dreamy-lavender-600 transition-colors">Dreamy Decor</Link>
              <Link to="/shop?category=Mugs" className="hover:text-dreamy-lavender-600 transition-colors">Custom Mugs</Link>
              <Link to="/shop?category=Combos" className="hover:text-dreamy-lavender-600 transition-colors">Gift Combos</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-semibold text-slate-800 mb-2 tracking-wide text-base">Get in Touch</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-dreamy-lavender-500 mt-0.5 flex-shrink-0" />
                <span>{settings?.storeName || 'Rashi Dreamy Gifts'}, Main Bazar Road, City Center, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-dreamy-lavender-500 flex-shrink-0" />
                <span>{settings?.whatsappNumber || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-dreamy-lavender-500 flex-shrink-0" />
                <span>info@rashidreamygifts.com</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-dreamy-lavender-100 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Rashi Dreamy Gifts. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-dreamy-pink-500 fill-dreamy-pink-500" /> for your loved ones.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
