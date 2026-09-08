import React from 'react';
import { Award, Store, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export function AboutPage({ onNavigateShop, onBecomeSeller }) {
  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Banner */}
      <div className="bg-[#111111] text-white py-16 sm:py-24 text-center border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <span className="eyebrow text-gold">OUR HERITAGE STORY</span>
          <h1 className="font-heading text-3xl sm:text-5xl text-white my-3">
            "The World of Precious Beauty"
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            Ratnaya is India’s premier multi-vendor luxury jewellery marketplace connecting discerning patrons with historic goldsmith ateliers, certified diamond creators, and independent artisans.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Section 1: Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-24">
          <div>
            <span className="eyebrow">THE RATNAYA PURPOSE</span>
            <h2 className="section-title text-2xl sm:text-4xl">Elevating Indian Goldsmithing Traditions</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 font-light">
              Founded with a passion for preserving ancient Jadau, Kundan, Meenakari, and filigree techniques, Ratnaya bridges the gap between legendary regional ateliers and modern luxury buyers nationwide.
            </p>
            <p className="text-sm sm:text-base text-charcoal leading-relaxed mb-6">
              Every creation displayed on our marketplace undergoes strict 6-digit HUID BIS hallmarking verification and certified gemstone authentication before reaching your doorstep in tamper-proof insured packaging.
            </p>
            <button onClick={onNavigateShop} className="btn-gold py-3 px-6 text-xs sm:text-sm">
              EXPLORE CATALOG <ArrowRight size={16} />
            </button>
          </div>

          <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-medium border border-gray-200">
            <img src="/assets/jewellery/necklace/videoframe_3765.png" alt="Ratnaya Craftsmanship" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Section 2: Values */}
        <div className="bg-white p-8 sm:p-12 rounded-sm border border-gray-200 text-center mb-16 sm:mb-24 shadow-sm">
          <h2 className="section-title text-2xl sm:text-4xl mb-8">The Core Pillars of Ratnaya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4">
              <Award size={36} className="mx-auto text-gold-dark mb-3" />
              <h4 className="text-base font-semibold mb-2">100% BIS Hallmarked</h4>
              <p className="text-xs text-gray-500">Guaranteed 22K (916) and 18K (750) purity with HUID tracking.</p>
            </div>
            <div className="p-4">
              <Store size={36} className="mx-auto text-gold-dark mb-3" />
              <h4 className="text-base font-semibold mb-2">Vetted Merchant Network</h4>
              <p className="text-xs text-gray-500">Empowering verified heritage goldsmiths from Jaipur, Mumbai, Kolkata & Hyderabad.</p>
            </div>
            <div className="p-4">
              <ShieldCheck size={36} className="mx-auto text-gold-dark mb-3" />
              <h4 className="text-base font-semibold mb-2">GIA & IGI Solitaires</h4>
              <p className="text-xs text-gray-500">Internationally certified natural diamonds and precious gemstones.</p>
            </div>
            <div className="p-4">
              <Heart size={36} className="mx-auto text-gold-dark mb-3" />
              <h4 className="text-base font-semibold mb-2">Transparent Marketplace</h4>
              <p className="text-xs text-gray-500">Direct merchant pricing, low making charges, and transparent buyback.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Merchant CTA */}
        <div className="bg-[#111111] text-white p-8 sm:p-14 rounded-sm text-center border border-gold/30">
          <h2 className="font-heading text-2xl sm:text-4xl mb-3 text-white">
            Are You a Heritage Jeweller or Diamond Atelier?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-6 font-light">
            Join the Ratnaya merchant family to list your hallmarked creations to luxury buyers across India.
          </p>
          <button onClick={onBecomeSeller} className="btn-gold py-3.5 px-8 text-xs font-semibold">BECOME A RATNAYA SELLER</button>
        </div>
      </div>
    </div>
  );
}
