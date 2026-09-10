import React, { useState, useEffect } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import { api } from '../services/api';

const SWARNA_SLIDES = [
  {
    id: 1,
    eyebrow: 'TIMELESS SOPHISTICATION',
    watermark: 'INCOMPARABLE',
    title: 'Crafting Timeless Beauty With Distinctive Grace',
    description: 'Elementum eget ante nec, consectetur viverra leo. Aenean Vestibulum augue nibh, fringilla pretium elit, et eleifend orci cursus. Curabitur sit amet dignissim erat.',
    mainImage: '/assets/jewellery/hero/main1.jpg',
    ringAccent: '/assets/jewellery/hero/ringhero1.png',
    accentImage: '/assets/jewellery/hero/rightside1.jpg',
    targetCategory: 'necklaces',
    buttonText: 'Know More',
    thumbnails: [
      '/assets/jewellery/hero/sub1-1.jpg',
      '/assets/jewellery/hero/sub1-2.jpg',
      '/assets/jewellery/hero/sub1-3.jpg',
      '/assets/jewellery/hero/sub1-4.jpg'
    ]
  },
  {
    id: 2,
    eyebrow: 'ROYAL HERITAGE',
    watermark: 'AUTHENTIC',
    title: 'Bespoke Kundan & Emerald Heirlooms',
    description: 'Handcrafted 22K gold Jadau foil setting featuring glowing Zambian emerald droplets and un-cut Polki creations.',
    mainImage: '/assets/jewellery/hero/main2.jpg',
    ringAccent: '/assets/jewellery/hero/ringhero2.png',
    accentImage: '/assets/jewellery/bracelet/1.jpg',
    targetCategory: 'bangles',
    buttonText: 'Know More',
    thumbnails: [
      '/assets/jewellery/hero/sub2-1.jpg',
      '/assets/jewellery/hero/sub2-2.jpg',
      '/assets/jewellery/hero/sub2-3.jpg',
      '/assets/jewellery/hero/sub2-4.jpg'
    ]
  },
  {
    id: 3,
    eyebrow: 'SOLITAIRE DREAMS',
    watermark: 'SPLENDOR',
    title: 'EF VVS Certified Diamond Creations',
    description: 'Internationally authenticated GIA solitaires and platinum-set high jewellery tailored for royal moments.',
    mainImage: '/assets/jewellery/hero/main3.jpg',
    ringAccent: '/assets/jewellery/hero/ringhero3.png',
    accentImage: '/assets/jewellery/hero/rightside3.jpg',
    targetCategory: 'rings',
    buttonText: 'Know More',
    thumbnails: [
      '/assets/jewellery/hero/sub3-1.jpg',
      '/assets/jewellery/hero/sub3-2.jpg',
      '/assets/jewellery/hero/sub3-3.jpg',
      '/assets/jewellery/hero/sub3-4.jpg'
    ]
  }
];

export function HeroSlider({ onNavigateShop, onSelectCategory }) {
  const [slides, setSlides] = useState(SWARNA_SLIDES);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);

  // Fetch dynamic hero slides from MongoDB Database API
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicBanners() {
      try {
        const res = await api.getBanners();
        const dbBanners = (res && res.data && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);
        if (isMounted && dbBanners.length > 0) {
          const formatted = dbBanners.map((b, idx) => ({
            id: b.slideId || b._id || idx + 1,
            eyebrow: b.eyebrow || SWARNA_SLIDES[idx % 3].eyebrow,
            watermark: b.watermark || SWARNA_SLIDES[idx % 3].watermark,
            title: b.title,
            description: b.description,
            mainImage: b.mainImage,
            ringAccent: b.ringAccent || SWARNA_SLIDES[idx % 3].ringAccent,
            accentImage: b.accentImage || SWARNA_SLIDES[idx % 3].accentImage,
            targetCategory: b.targetCategory || SWARNA_SLIDES[idx % 3].targetCategory,
            buttonText: b.buttonText || 'Know More',
            thumbnails: b.thumbnails && b.thumbnails.length > 0 ? b.thumbnails : SWARNA_SLIDES[idx % 3].thumbnails
          }));
          setSlides(formatted);
        }
      } catch (err) {
        console.warn('Hero Banners MongoDB API fallback:', err);
      }
    }
    loadDynamicBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto Rotation
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlideIdx] || SWARNA_SLIDES[0];
  const thumbnails = slide.thumbnails || SWARNA_SLIDES[0].thumbnails;
  const activeMainImg = activeThumbIdx === 0 ? slide.mainImage : thumbnails[activeThumbIdx];

  const handleCtaClick = () => {
    const targetCat = slide.targetCategory || 'all';
    if (onSelectCategory && targetCat !== 'all') {
      onSelectCategory(targetCat.toLowerCase());
    } else if (onNavigateShop) {
      onNavigateShop();
    }
  };

  return (
    <section className="relative w-full bg-[#FAF6F0] lg:bg-gradient-to-r lg:from-[#EFE6DD] lg:from-[33%] lg:to-white lg:to-[33%] border-b border-gray-200 flex items-center min-h-[540px] lg:min-h-[600px] xl:min-h-[640px]">
      <div className="w-full flex flex-col lg:grid lg:grid-cols-[33%_67%] relative items-center min-h-[540px] lg:min-h-[600px] xl:min-h-[640px]">

        {/* LEFT PANEL (33% WIDTH ON DESKTOP, BEIGE BACKGROUND) */}
        <div className="w-full h-full px-4 sm:px-6 lg:pl-8 xl:pl-10 py-6 lg:py-8 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 relative z-10">

          {/* Vertical Rotated Watermark Text (Hidden on Mobile/Tablet) */}
          <div key={`watermark-${activeSlideIdx}`} className="hidden xl:block writing-mode-vertical rotate-180 font-heading text-4xl xl:text-5xl 2xl:text-6xl tracking-[0.22em] text-[#AC805D]/20 select-none whitespace-nowrap leading-none swarna-watermark">
            {slide.watermark}
          </div>

          {/* Thumbnails (Horizontal Scroll on Mobile/Tablet, Vertical Stack on Desktop) */}
          <div className="flex flex-row lg:flex-col gap-2.5 sm:gap-3 lg:gap-4 overflow-x-auto max-w-full pb-2 lg:pb-0 z-10 no-scrollbar my-auto">
            {thumbnails.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveThumbIdx(idx)}
                className={`w-14 h-14 sm:w-18 sm:h-18 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border transition-all duration-300 p-0 ${activeThumbIdx === idx
                  ? 'border-gold shadow-gold scale-105 ring-2 ring-gold/40'
                  : 'border-black/10 opacity-70 hover:opacity-100 hover:scale-100'
                  }`}
              >
                <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </button>
            ))}
          </div>
        </div>

        {/* ABSOLUTE MAIN ARCHED IMAGE FRAME (Desktop absolute straddling split, Mobile/Tablet relative center) */}
        <div className="order-first lg:order-none relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[17%] xl:left-[18.5%] w-[260px] sm:w-[340px] md:w-[400px] lg:w-[420px] xl:w-[520px] 2xl:w-[600px] h-[300px] sm:h-[380px] md:h-[420px] lg:h-[430px] xl:h-[490px] 2xl:h-[530px] rounded-[120px_0_0_0] sm:rounded-[180px_0_0_0] lg:rounded-[220px_0_0_0] overflow-hidden shadow-2xl z-20 bg-white mx-auto my-3 lg:my-0 border border-[#AC805D]/20 transition-all duration-500">
          <img
            key={activeMainImg}
            src={api.getImageUrl(activeMainImg)}
            alt={slide.title}
            className="w-full h-full object-cover object-center swarna-slide-image hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* RIGHT PANEL (67% WIDTH ON DESKTOP, WHITE BACKGROUND) */}
        <div className="w-full h-full px-6 sm:px-10 lg:pl-[260px] xl:pl-[340px] 2xl:pl-[400px] lg:pr-8 xl:pr-14 py-6 sm:py-8 lg:py-10 flex flex-col justify-center relative bg-white lg:bg-transparent min-h-[320px] lg:min-h-[480px]">

          {/* Eyebrow */}
          <span key={`eyebrow-${activeSlideIdx}`} className="font-sans text-xs sm:text-sm tracking-[0.28em] uppercase text-[#AC805D] font-semibold mb-2 sm:mb-3 swarna-slide-eyebrow">
            {slide.eyebrow}
          </span>

          {/* Main Heading */}
          <h1 key={`title-${activeSlideIdx}`} className="font-heading text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-charcoal leading-tight mb-3 font-normal max-w-xl swarna-slide-title">
            {slide.title}
          </h1>

          {/* Description */}
          <p key={`desc-${activeSlideIdx}`} className="font-sans text-xs sm:text-sm text-brownMuted leading-relaxed mb-6 max-w-md font-light swarna-slide-desc">
            {slide.description}
          </p>

          {/* Swarna Luxury Morphing Button (Navigates directly to Shop Page pre-filtered) */}
          <div key={`btn-${activeSlideIdx}`} className="mb-4 lg:mb-0 swarna-slide-btn">
            <button onClick={handleCtaClick} className="btn-swarna-hero">
              <span className="btn-text">{slide.buttonText || 'Know More'}</span>
              <span className="arrow-box">
                <span className="arrow-icon-default">➔</span>
                <span className="arrow-icon-hover">➔</span>
              </span>
            </button>
          </div>

          {/* Floating Solitaire Gold Ring Accent (Desktop 2xl only) */}
          <div key={`ring-${activeSlideIdx}`} className="hidden 2xl:block absolute bottom-8 left-[380px] w-36 h-28 rounded-xl overflow-hidden z-20 animate-float-slow">
            <img
              src={api.getImageUrl(slide.ringAccent)}
              alt="Solitaire Ring"
              className="w-full h-full object-scale-down transition-transform duration-700 hover:scale-110"
            />
          </div>

          {/* Floating Bottom Right Accent Arched Thumbnail (Desktop xl+ only) */}
          <div key={`accent-${activeSlideIdx}`} className="hidden xl:flex absolute bottom-8 right-8 2xl:right-12 items-end gap-4 swarna-slide-accent">
            <div className="w-36 h-44 xl:w-44 xl:h-56 rounded-t-[100px] overflow-hidden shadow-xl border border-[#AC805D]/20 group cursor-pointer">
              <img src={api.getImageUrl(slide.accentImage)} alt="Accent" className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Numbered Pagination Arrow Counter (1 ──➔ 2 ──➔ 3) */}
        <div className="w-full lg:w-auto lg:absolute bottom-4 sm:bottom-6 left-0 lg:left-8 xl:left-12 flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 z-30 py-3 lg:py-0 px-4 sm:px-6 lg:px-0">
          {slides.map((s, idx) => (
            <React.Fragment key={s.id || idx}>
              <button
                onClick={() => {
                  setActiveSlideIdx(idx);
                  setActiveThumbIdx(0);
                }}
                style={{
                  color: '#FFFFFF',
                  backgroundColor: activeSlideIdx === idx ? '#AC805D' : '#C4B29E'
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-heading text-xs font-bold flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${activeSlideIdx === idx
                  ? 'shadow-gold scale-105'
                  : 'hover:bg-[#AC805D]'
                  }`}
              >
                {s.id || idx + 1}
              </button>
              {idx < slides.length - 1 && (
                <span className="text-[#AC805D] text-xs flex items-center">
                  ──➔
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Custom Styles for Button & Rotated Text */}
      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .btn-swarna-hero {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          min-width: 190px;
          background-color: #000000;
          border: 1px solid #000000;
          border-radius: 0px;
          padding: 0 0 0 24px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .btn-swarna-hero .btn-text {
          font-family: 'Marcellus', serif;
          font-size: 0.9rem;
          color: #FFFFFF;
          letter-spacing: 0.04em;
          z-index: 2;
          transition: color 0.35s ease;
        }

        .btn-swarna-hero .arrow-box {
          position: relative;
          width: 26px;
          height: 26px;
          margin-right: 16px;
          border-radius: 50%;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
          overflow: hidden;
          z-index: 2;
        }

        .btn-swarna-hero .arrow-icon-default {
          color: #000000;
          font-size: 0.75rem;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
        }

        .btn-swarna-hero .arrow-icon-hover {
          position: absolute;
          color: #AC805D;
          font-size: 1rem;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .btn-swarna-hero:hover {
          background-color: #AC805D;
          border-color: #AC805D;
        }

        .btn-swarna-hero:hover .arrow-box {
          width: 46px;
          height: 100%;
          margin-right: 0;
          border-radius: 0px;
          clip-path: path('M 16 0 C 12 0 5 11.5 0 25 C 5 38.5 12 50 16 50 L 50 50 L 50 0 Z');
        }

        .btn-swarna-hero:hover .arrow-icon-default {
          opacity: 0;
          transform: translateX(10px);
        }

        .btn-swarna-hero:hover .arrow-icon-hover {
          opacity: 1;
          transform: translateX(2px);
        }
      `}</style>
    </section>
  );
}
