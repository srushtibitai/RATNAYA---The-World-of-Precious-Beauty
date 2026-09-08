import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye, ShoppingBag, Store, Star, Loader2 } from 'lucide-react';
import { PRODUCTS } from '../data/marketplaceData';
import { ScrollReveal } from './ScrollReveal';

export function NewArrivalsSliderSection({
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}) {
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [addingId, setAddingId] = useState(null);

  // Take 8 fresh luxury products
  const products = PRODUCTS.slice(0, 8);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // If user scrolls mouse wheel over slider, scroll slider horizontally left-right instead of page top-bottom
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY * 2.2,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('scroll', handleScroll);
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF6F0] border-b border-[#E8E0D7] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left Title & Right Arrow Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <ScrollReveal animation="fade-left">
            <div>
              <span className="eyebrow text-xs tracking-[0.25em] text-gold-dark font-semibold uppercase block mb-2">
                FRESH ARRIVALS, JUST FOR YOU
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl text-charcoal font-normal leading-tight">
                New Arrivals, Endless Choices
              </h2>
            </div>
          </ScrollReveal>

          {/* Navigation Slider Arrows */}
          <ScrollReveal animation="fade-right">
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={slideLeft}
                className="w-10 h-10 rounded-full border border-gray-300 bg-white text-charcoal hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                aria-label="Slide Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={slideRight}
                className="w-10 h-10 rounded-full border border-gray-300 bg-white text-charcoal hover:border-gold hover:text-gold flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                aria-label="Slide Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* 8 Product Horizontal Slider Container */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, idx) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const animDir = idx % 2 === 0 ? 'fade-left' : 'fade-right';

            return (
              <ScrollReveal key={product.id} animation={animDir} delay={idx * 60} className="shrink-0">
                <div
                  className="w-[260px] sm:w-[285px] product-card group rounded-sm bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-medium hover:border-gold/50"
                >
                {/* Product Cover Image Container */}
                <div className="product-image-wrap relative aspect-[1/1.15] overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.name}
                    className="product-image-primary w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {product.images && product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={product.name}
                      className="product-image-secondary absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  {/* Wishlist Heart Icon (Top-Right) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all z-10 shadow-sm border-none cursor-pointer hover:scale-105 ${
                      isWishlisted ? 'text-red-500 bg-white' : 'text-charcoal hover:text-red-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? '#D93838' : 'none'}
                      stroke={isWishlisted ? '#D93838' : 'currentColor'}
                      strokeWidth={isWishlisted ? 0 : 1.75}
                    />
                  </button>

                  {/* Bottom Floating Glassmorphism Action Pill on Hover */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                    <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-2xl pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                        title="Quick View"
                      >
                        <Eye size={14} /> <span>Quick View</span>
                      </button>
                      <span className="text-white/30 font-light select-none">|</span>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          setAddingId(product.id);
                          await new Promise((res) => setTimeout(res, 300));
                          onAddToCart(product);
                          setAddingId(null);
                        }}
                        disabled={addingId === product.id}
                        className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                        title="Add to Cart"
                      >
                        {addingId === product.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-gold" /> <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} /> <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Details Container (Seller Badge, Rating, Title, Price) */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="seller-badge text-gold-dark font-medium uppercase tracking-wider text-[0.68rem] flex items-center gap-1">
                        <Store size={11} /> {product.sellerName}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                        <Star size={12} fill="currentColor" /> {product.rating}
                      </div>
                    </div>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-normal text-charcoal hover:text-gold cursor-pointer line-clamp-2 leading-snug min-h-[2.5rem] flex items-start"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-semibold text-charcoal">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="line-through text-xs text-gray-400">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
          })}
        </div>

        {/* Bottom Horizontal Slider Progress Bar */}
        <div className="mt-8 w-full bg-gray-200 h-[2px] rounded-full overflow-hidden relative">
          <div
            className="bg-gold h-full transition-all duration-300 rounded-full"
            style={{
              width: '35%',
              transform: `translateX(${scrollProgress * 1.8}%)`
            }}
          />
        </div>
      </div>
    </section>
  );
}
