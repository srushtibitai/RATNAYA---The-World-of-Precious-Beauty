import React, { useState } from 'react';
import { PRODUCTS } from '../data/marketplaceData';
import { ScrollReveal } from './ScrollReveal';
import { api } from '../services/api';
import {
  ArrowRight,
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Sparkles,
  Flame,
  Award,
  Check
} from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Top Sellers' },
  { id: 'necklaces', label: 'Royal Necklaces' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'rings', label: 'Solitaire Rings' },
  { id: 'bangles', label: 'Bangles & Bracelets' },
  { id: 'mangalsutra', label: 'Mangalsutra' }
];

export function TopSellingProductsSection({
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onNavigateShop
}) {
  const [activeTab, setActiveTab] = useState('all');

  // Filter top selling products based on active tab category
  const filteredProducts = React.useMemo(() => {
    // Sort or select top rated / top selling items
    let pool = PRODUCTS.filter((p) => p.rating >= 4.5 || p.price > 15000);
    if (pool.length < 8) pool = PRODUCTS;

    if (activeTab === 'all') {
      return pool.slice(0, 8);
    }

    const matched = pool.filter(
      (p) =>
        p.category === activeTab ||
        (activeTab === 'bangles' && (p.category === 'bracelets' || p.category === 'bangles'))
    );

    // If specific tab has fewer than 4 products, fallback to items matching category from main list
    if (matched.length < 4) {
      const extra = PRODUCTS.filter(
        (p) =>
          p.category === activeTab ||
          (activeTab === 'bangles' && (p.category === 'bracelets' || p.category === 'bangles'))
      );
      return extra.slice(0, 8);
    }

    return matched.slice(0, 8);
  }, [activeTab]);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-borderGold/20 overflow-hidden relative">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <ScrollReveal animation="fade-down">
            <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/20 text-gold-dark font-bold text-xs uppercase tracking-widest mb-3">
              {/* <Flame size={14} className="text-amber-600 fill-amber-500" />  */}
              MOST POPULAR CHOICES

            </span>
            <h2 className="section-title text-3xl sm:text-4xl text-gray-900 font-serif mb-3">
              Top Selling Royal Creations
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-light">
              Explore our most sought-after hallmarked jewellery pieces loved by patrons nationwide for weddings & celebrations.
            </p>
          </ScrollReveal>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${isActive
                  ? 'bg-gold-dark text-white shadow-md ring-2 ring-gold-dark/30 scale-105'
                  : 'bg-white text-gray-700 border border-gold-light/40 hover:bg-gold-light/20 hover:border-gold-dark/50'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {filteredProducts.map((prod, idx) => {
            const isWishlisted = wishlistIds.includes(prod.id || prod._id);
            const primaryImg = prod.images ? prod.images[0] : prod.image;
            const secondaryImg = prod.images && prod.images[1] ? prod.images[1] : primaryImg;

            return (
              <ScrollReveal key={prod.id || prod._id || idx} animation="fade-up" delay={idx * 0.05}>
                <div className="group bg-white rounded-lg overflow-hidden border border-borderGold/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative">

                  {/* Image & Badges Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#FAF8F5] cursor-pointer" onClick={() => onSelectProduct(prod)}>
                    <img
                      src={api.getImageUrl(primaryImg)}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {secondaryImg && secondaryImg !== primaryImg && (
                      <img
                        src={api.getImageUrl(secondaryImg)}
                        alt={`${prod.name} hover view`}
                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                      />
                    )}

                    {/* Top Bestseller Badge */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-950/90 backdrop-blur-md text-gold-light border border-gold/30 shadow-md">
                        <Award size={10} className="text-gold" /> #{idx + 1} BESTSELLER
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(prod);
                      }}
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md border-none cursor-pointer ${isWishlisted
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-gold-dark hover:text-white'
                        }`}
                      title="Add to Wishlist"
                    >
                      <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Quick View Button on Hover */}
                    <div className="absolute bottom-3 left-0 right-0 px-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(prod);
                        }}
                        className="w-full py-2 bg-black/80 hover:bg-gold-dark backdrop-blur-md text-white text-xs font-semibold rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg border-none cursor-pointer"
                      >
                        <Eye size={14} /> QUICK VIEW
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] text-gold-dark font-bold uppercase tracking-wider truncate">
                          {prod.categoryName || prod.category || 'Luxury Jewels'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                          <Star size={12} fill="currentColor" />
                          <span>{prod.rating || 5.0}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(prod)}
                        className="font-serif text-sm sm:text-base text-gray-900 font-medium line-clamp-1 mb-2 hover:text-gold-dark transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                      <div>
                        <span className="block text-base sm:text-lg font-bold text-gray-900">
                          ₹{Number(prod.price).toLocaleString('en-IN')}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{Number(prod.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-gold-dark text-gold-dark hover:text-white border border-gold-light/40 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>

                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <button
            onClick={() => {
              if (onNavigateShop) {
                onNavigateShop(activeTab !== 'all' ? activeTab : 'all');
              }
            }}
            className="btn-gold py-3.5 px-8 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            EXPLORE ALL TOP SELLING COLLECTIONS <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
