import React, { useState } from 'react';
import { Gift, Heart, Sparkles, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import aboutLogo from '../assets/background.jpg';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does WhatsApp checkout work?',
      a: 'Once you add items to the cart and fill out your delivery details, clicking "Place Order via WhatsApp" saves your order in our system and opens a pre-composed message directly on WhatsApp. You send this message to us, and we will confirm the order, share payment details (like GPay/UPI), and package your items.'
    },
    {
      q: 'How can I customize my gift?',
      a: 'After redirecting to WhatsApp, you can chat directly with us! You can share photo attachments, names, or special cards that you want us to add to your fancy hamper.'
    },
    {
      q: 'What is your shipping time?',
      a: 'We usually package and ship orders within 24 to 48 hours of payment confirmation. Domestic delivery takes 3 to 5 business days depending on your location.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major UPI payments (Google Pay, PhonePe, Paytm), Bank Transfers, and online cards. Payment options are shared during our WhatsApp confirmation chat.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* 1. Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Our Story</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-800 leading-tight">
              Sweet Styles, <br />
              <span className="gold-text-gradient italic font-semibold">Endless Smiles</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              Rashi Dreamy Gifts started with a simple vision: to turn gifting into a beautiful, personalized experience. We believe a gift shouldn't just be an object; it should be a token of emotion, handcrafted and tailored to show how much you care.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              From hand-picked fancy items and customized ceramic mugs to themed hampers filled with sweet delights, our collections are carefully curated with a touch of elegance and pastel aesthetics that make every delivery feel like a dream.
            </p>
          </div>

          <div className="relative bg-gradient-to-tr from-dreamy-pink-50 to-dreamy-lavender-100 rounded-3xl p-8 sm:p-12 border border-dreamy-lavender-100 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-dreamy-lavender-100 shadow-sm mb-6 animate-float">
              <img 
                src={aboutLogo} 
                alt="Rashi Founder Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-xl mb-2">Curated for Your Joy</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-light">
              "We don't sell products. We deliver the sweet joy of opening a beautifully wrapped dream."
            </p>
            <div className="absolute bottom-6 right-6 font-serif italic text-dreamy-lavender-750 font-bold text-sm">
              - Rashi, Founder
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white border-y border-dreamy-lavender-100">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Our Philosophy</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mt-1">Our Core Mission</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-dreamy-pink-50 text-dreamy-pink-600 flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">Emotional Connection</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Creating customizable gifts that carry personal stories and strengthen relationships.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-dreamy-gold-100/50 text-dreamy-gold-700 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">Premium Elegance</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Ensuring each detail, from product quality to final ribbon packaging, is stunning.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-dreamy-lavender-50 text-dreamy-lavender-600 flex items-center justify-center mx-auto shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">Direct Accessibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Direct checkout communication via WhatsApp ensures your request is handled with detail.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-dreamy-lavender-600 font-bold">Got Questions?</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-800 mt-1">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-dreamy-lavender-100 rounded-2xl bg-white shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-slate-800 hover:text-dreamy-lavender-650 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {openFaq === index && (
                <div className="p-5 pt-0 border-t border-slate-50 text-xs sm:text-sm text-slate-500 leading-relaxed font-light animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Contact and Social Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-dreamy-pink-50/60 to-dreamy-lavender-50 border border-dreamy-lavender-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-2xs text-dreamy-lavender-600 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-800 text-base mb-1">WhatsApp Chat</h4>
                <p className="text-xs text-slate-500">+91 98765 43210</p>
                <p className="text-[10px] text-slate-400">Available 9:00 AM - 9:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-2xs text-dreamy-lavender-600 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-800 text-base mb-1">Email Support</h4>
                <p className="text-xs text-slate-500">support@rashidreamygifts.com</p>
                <p className="text-[10px] text-slate-400">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-2xs text-dreamy-lavender-600 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-800 text-base mb-1">Our Workshop</h4>
                <p className="text-xs text-slate-500">Main Bazar Road, City Center, India</p>
                <p className="text-[10px] text-slate-400">Visit by appointment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
