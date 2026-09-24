import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Megaphone, Tag, Clock, RefreshCw } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { api, getImageUrl } from '../services/api';

const DEFAULT_ADS = [
  {
    id: 'ad-1',
    eyebrow: 'ROYAL NECKLACE COLLECTION',
    title: 'Radiate Beauty With Necklaces',
    subtitle: '"A Symbol of Love, Beauty and Sophistication"',
    description: 'Adorn your neck with royal Kundan chokers, Basra pearl strands, and glowing Zambian emerald haar crafted for grand wedding celebrations.',
    image: '/assets/jewellery/necklace/1.jpg',
    badge: 'FEATURED COLLECTION',
    tag: 'Royal Heritage',
    ctaPrimary: 'SHOP NOW',
    ctaSecondary: 'KNOW MORE',
    discount: 'Up to 15% Off',
    sellerShopName: 'Ratnaya Official'
  },
  {
    id: 'ad-2',
    eyebrow: 'EXCLUSIVE BRIDAL PROMO',
    title: 'Grand Kundan & Uncut Polki Haar',
    subtitle: '"Exquisite Heritage Craftsmanship for Royalty"',
    description: 'Handcrafted 22K gold Jadau foil setting featuring glowing Zambian emerald droplets and heritage Polki neckpieces.',
    image: '/assets/jewellery/necklace/3.jpg',
    badge: 'FESTIVE OFFER',
    tag: 'Bridal Jewels',
    ctaPrimary: 'EXPLORE BRIDAL',
    ctaSecondary: 'VIEW CATALOG',
    discount: 'Special Festive Price',
    sellerShopName: 'Kundan Palace'
  },
  {
    id: 'ad-3',
    eyebrow: 'HIGH JEWELLERY HIGHLIGHT',
    title: 'Zambian Emerald & Diamond Chokers',
    subtitle: '"Elegance That Captivates Every Gaze"',
    description: 'Discover high-jewellery masterpieces designed for modern queens. Certified EF VVS diamonds with 100% buyback guarantee.',
    image: '/assets/jewellery/necklace/5.jpg',
    badge: 'NEW ARRIVAL AD',
    tag: 'Diamond Chokers',
    ctaPrimary: 'DISCOVER MORE',
    ctaSecondary: 'BOOK APPOINTMENT',
    discount: 'Limited Edition',
    sellerShopName: 'Emerald Heritage'
  }
];

export function RoyalNecklaceAdsSlider({ onNavigateShop, onNavigateAbout, customAds }) {
  const [ads, setAds] = useState(DEFAULT_ADS);
  const [batchInfo, setBatchInfo] = useState({
    totalActiveAds: 0,
    totalBatches: 1,
    currentBatchIndex: 0,
    nextRotationSeconds: 180
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch 3-ad batch from backend API (rotates every 3 minutes)
  const fetchActiveBatch = async () => {
    try {
      const res = await api.getActiveSellerAds('section');
      let adsList = [];
      if (Array.isArray(res)) {
        adsList = res;
      } else if (res && typeof res === 'object') {
        if (Array.isArray(res.activeBatchAds) && res.activeBatchAds.length > 0) {
          adsList = res.activeBatchAds;
        } else if (Array.isArray(res.allActiveAds) && res.allActiveAds.length > 0) {
          adsList = res.allActiveAds;
        } else if (Array.isArray(res.data)) {
          adsList = res.data;
        }
      }

      if (adsList.length > 0) {
        const formatted = adsList.map((ad, idx) => ({
          id: ad._id || ad.id || `seller-ad-${idx}`,
          eyebrow: ad.eyebrow || 'SPONSORED SELLER AD',
          title: ad.title,
          subtitle: ad.subtitle || 'Verified Merchant Offer',
          description: ad.description,
          image: getImageUrl(ad.image),
          badge: ad.badge || `${ad.durationDays || 7}-DAY SPONSOR`,
          tag: ad.tag || 'Verified Seller',
          ctaPrimary: ad.ctaPrimary || 'SHOP NOW',
          ctaSecondary: ad.ctaSecondary || 'KNOW MORE',
          discount: ad.durationDays ? `${ad.durationDays} Days Active Ad` : 'Featured',
          sellerShopName: ad.sellerShopName || ad.sellerName || 'Partner Merchant',
          targetCategory: ad.targetCategory || 'necklaces'
        }));
        
        // If batch has fewer than 3 ads, fill remaining slots with default ads
        let finalAds = [...formatted];
        if (finalAds.length < 3) {
          const fillCount = 3 - finalAds.length;
          finalAds = [...finalAds, ...DEFAULT_ADS.slice(0, fillCount)];
        }

        setAds(finalAds);
        setBatchInfo({
          totalActiveAds: res.totalActiveAds || formatted.length,
          totalBatches: res.totalBatches || 1,
          currentBatchIndex: res.currentBatchIndex || 0,
          nextRotationSeconds: res.nextRotationSeconds || 180
        });
      } else if (customAds && customAds.length > 0) {
        setAds(customAds);
      }
    } catch (err) {
      console.warn('Section Ads backend API sync warning:', err);
    }
  };

  useEffect(() => {
    fetchActiveBatch();
    // Poll backend every 30 seconds to stay synced with 3-minute batch rotations
    const pollInterval = setInterval(fetchActiveBatch, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  // Auto slide interval within current batch
  useEffect(() => {
    if (!isAutoplay || ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplay, ads.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  return (
    <section 
      className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-borderGold/20 overflow-hidden relative"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header & 3-Min Batch Rotation Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gold-light/20 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold-dark/10 text-gold-dark flex-shrink-0">
              <Megaphone size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
                  SPONSORED SECTION ADS
                </span>
                {batchInfo.totalBatches > 1 && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                    <RefreshCw size={10} className="animate-spin" />
                    Batch {batchInfo.currentBatchIndex + 1} of {batchInfo.totalBatches} (3-Min Auto Rotation)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Featuring verified seller promotion ads ({currentIndex + 1} of {ads.length} in current 3-ad batch)
              </p>
            </div>
          </div>

          {/* Controls & Slide Dots */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 mr-2">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-gold-dark'
                      : 'w-2 bg-gold-light/40 hover:bg-gold-light'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gold-light/40 flex items-center justify-center text-gray-700 bg-white hover:bg-gold-dark hover:text-white hover:border-gold-dark transition-all duration-300 shadow-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gold-light/40 flex items-center justify-center text-gray-700 bg-white hover:bg-gold-dark hover:text-white hover:border-gold-dark transition-all duration-300 shadow-sm"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Current Active Ad Banner */}
        <div className="relative min-h-[420px] transition-all duration-500 ease-in-out">
          {ads.map((ad, idx) => {
            if (idx !== currentIndex) return null;

            return (
              <div 
                key={ad.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center animate-fadeIn duration-500"
              >
                {/* Left Side Ad Image */}
                <ScrollReveal animation="fade-left">
                  <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-borderGold shadow-xl bg-white">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Badge Overlay */}
                    {ad.badge && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-black/80 backdrop-blur-md text-gold-light border border-gold-light/30 shadow-md">
                          <Sparkles size={12} className="text-gold" />
                          {ad.badge}
                        </span>
                      </div>
                    )}

                    {/* Merchant Tag */}
                    {ad.sellerShopName && (
                      <div className="absolute bottom-4 right-4 z-20">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-gold-dark text-white shadow-lg">
                          <Tag size={12} />
                          By {ad.sellerShopName}
                        </span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Right Side Details */}
                <ScrollReveal animation="fade-right">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="eyebrow">{ad.eyebrow}</span>
                      {ad.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold-light/20 text-gold-dark font-medium uppercase tracking-wider">
                          {ad.tag}
                        </span>
                      )}
                    </div>

                    <h2 className="section-title text-2xl sm:text-4xl text-gray-900 font-serif mb-2">
                      {ad.title}
                    </h2>

                    {ad.subtitle && (
                      <h4 className="text-lg sm:text-xl text-gold-dark font-heading mb-4 font-normal italic">
                        {ad.subtitle}
                      </h4>
                    )}

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                      {ad.description}
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                      <button
                        onClick={onNavigateAbout}
                        className="btn-outline px-6 py-3 hover:shadow-md transition-all"
                      >
                        {ad.ctaSecondary || 'KNOW MORE'}
                      </button>
                      
                      <button
                        onClick={() => {
                          if (onNavigateShop) onNavigateShop(ad.targetCategory);
                        }}
                        className="btn-gold px-6 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        {ad.ctaPrimary || 'SHOP NOW'} <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* 3-Ad Batch Preview Thumbnails */}
        <div className="mt-12 pt-6 border-t border-gold-light/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ads.map((ad, idx) => (
            <button
              key={ad.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-3 rounded-lg border text-left transition-all duration-300 flex items-center gap-3 ${
                idx === currentIndex
                  ? 'border-gold-dark bg-white shadow-md ring-1 ring-gold-dark/30'
                  : 'border-transparent bg-white/50 hover:bg-white hover:border-gold-light/50'
              }`}
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-12 h-12 rounded object-cover border border-gold-light/30 flex-shrink-0"
              />
              <div className="overflow-hidden">
                <span className="block text-[10px] text-gold-dark font-semibold uppercase tracking-wider truncate">
                  Ad #{idx + 1} • {ad.sellerShopName}
                </span>
                <span className="block text-xs font-medium text-gray-800 truncate">
                  {ad.title}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
