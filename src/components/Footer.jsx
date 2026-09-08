import React from 'react';
import { Logo } from './Logo';
import {
  Instagram,
  Facebook,
  Youtube,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Lock
} from 'lucide-react';

export function Footer({ setActiveTab, setActiveRole, onSelectCategory }) {
  return (
    <footer
      id="section-footer"
      className="bg-[#111111] text-[#D9D4CE] pt-16 pb-10 border-t border-gold/25 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Value Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h5 className="text-white text-sm font-medium">100% BIS Hallmarked</h5>
              <p className="text-xs text-gray-400">Guaranteed 22K & 18K Purity</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 className="text-white text-sm font-medium">Certified Gemstones</h5>
              <p className="text-xs text-gray-400">GIA, IGI & SGL Authenticated</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h5 className="text-white text-sm font-medium">Insured Express Delivery</h5>
              <p className="text-xs text-gray-400">Tamper-proof transit insurance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              <RotateCcw size={22} />
            </div>
            <div>
              <h5 className="text-white text-sm font-medium">Easy Returns</h5>
              <p className="text-xs text-gray-400">14-day return & buyback guarantee</p>
            </div>
          </div>
        </div>

        {/* Footer Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Col 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <Logo variant="light" showTagline size="large" />
            <p className="text-xs sm:text-sm text-gray-400 mt-4 max-w-sm leading-relaxed">
              Ratnaya is India’s premier multi-vendor luxury jewellery marketplace. Bringing together legendary heritage goldsmiths, certified diamond ateliers, and independent artisans under one royal canopy.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#instagram"
                className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#facebook"
                className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#youtube"
                className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4 font-sans">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('rings'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Rings</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('necklaces'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Necklaces</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('earrings'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Earrings</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('bracelets'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Bracelets</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('bangles'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Bangles</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory && onSelectCategory('all'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">New Arrivals</button>
              </li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER CARE */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4 font-sans">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
              <li><button onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Contact Us</button></li>
              <li><button onClick={() => { setActiveTab('shipping-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Shipping Policy</button></li>
              <li><button onClick={() => { setActiveTab('shipping-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Returns & Refunds</button></li>
              <li><button onClick={() => { setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">FAQ</button></li>
              <li><button onClick={() => { setActiveRole('BUYER'); setActiveTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Order Tracking</button></li>
            </ul>
          </div>

          {/* Col 4: SELL WITH RATNAYA */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4 font-sans">
              Sell With Us
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gold font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Become a Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Seller Login
                </button>
              </li>
              <li><button onClick={() => { setActiveTab('terms-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Seller Guide</button></li>
              <li>
                <button
                  onClick={() => { setActiveRole('ADMIN'); setActiveTab('admin-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: COMPANY */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4 font-sans">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
              <li><button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">About Ratnaya</button></li>
              <li><button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Our Heritage</button></li>
              <li><button onClick={() => { setActiveTab('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Privacy Policy</button></li>
              <li><button onClick={() => { setActiveTab('terms-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} RATNAYA — The World of Precious Beauty. All Rights Reserved.
          </div>
          <div className="flex flex-wrap gap-4 text-gray-500">
            <span>Secure 256-Bit SSL Checkout</span>
            <span>Made with Excellence in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
