import React, { useState } from 'react';

const VIDEO_CATEGORIES = [
  {
    id: 'earrings',
    title: 'Earrings',
    itemCount: '80+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Money Saving Tips Inspiration for Everyday 18207-pin-id-982136631248328968.mp4',
    poster: '/assets/jewellery/earring/1.jpg',
    description: 'Handcrafted Kundan droplets and diamond chandelier earrings tailored for royal moments.'
  },
  {
    id: 'rings',
    title: 'Rings',
    itemCount: '120+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Elegant entryway organization ideas that are perfect when you want something stylish modern and easy to copy for anyone who lov.mp4',
    poster: '/assets/jewellery/ring/1.jpg',
    description: 'Bespoke 22K gold Jadau foil setting and GIA certified solitaire creations reflecting your unique story.'
  },
  {
    id: 'bracelets',
    title: 'Bracelets',
    itemCount: '60+ items',
    video: '/assets/jewellery/video/From Klickpin.com- From beginner to obsessed Build these beautiful goal setting ideas that help you get the look without the stress with smart ste.mp4',
    poster: '/assets/jewellery/bracelet/1.jpg',
    description: 'Continuous 18K rose gold tennis diamond strands and filigree bangles crafted for luxury.'
  },
  {
    id: 'pendants',
    title: 'Pendants',
    itemCount: '90+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Polished Bridal Shower Ideas Worth Trying 5047-pin-id-858146904041441263.mp4',
    poster: '/assets/jewellery/pendant/1.jpg',
    description: 'Exquisite diamond & emerald pendants designed to illuminate every celebration with distinctive grace.'
  }
];

export function JewelleryVideoAccordionSection({ onSelectCategory, onNavigateShop }) {
  // Active column index (default to 1: Rings)
  const [activeIdx, setActiveIdx] = useState(1);

  return (
    <section className="relative w-full h-auto md:h-[620px] bg-[#111111] overflow-hidden block">
      <div className="flex flex-col md:flex-row w-full h-full min-h-[880px] md:min-h-0">
        {VIDEO_CATEGORIES.map((cat, idx) => {
          const isActive = activeIdx === idx;

          return (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => onSelectCategory ? onSelectCategory(cat.id) : (onNavigateShop && onNavigateShop())}
              className={`relative min-h-[220px] sm:min-h-[280px] md:min-h-0 h-[220px] sm:h-[280px] md:h-full overflow-hidden cursor-pointer transition-all duration-500 border-b md:border-b-0 md:border-r border-white/20 ${
                isActive ? 'md:flex-[2.2] flex-1' : 'md:flex-1 flex-1'
              }`}
            >
              {/* Background Poster Image Fallback */}
              <img
                src={cat.poster}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center -z-10 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Background Video */}
              <video
                src={cat.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-600 ${
                  isActive ? 'brightness-75 contrast-105 scale-105' : 'brightness-50 grayscale-20 scale-100'
                }`}
              />

              {/* Dark Overlay Gradient */}
              <div
                className={`absolute inset-0 transition-colors duration-600 ${
                  isActive
                    ? 'bg-gradient-to-t from-black/85 via-black/45 to-black/35'
                    : 'bg-black/60'
                }`}
              />

              {/* Column Content - ALL TEXT GUARANTEED PURE BRIGHT WHITE */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10">
                {isActive ? (
                  <div className="flex flex-col items-center max-w-sm animate-fadeInUp">
                    {/* Oval Badge with Title */}
                    <div className="py-2 sm:py-2.5 px-6 sm:px-8 rounded-full border border-white/90 bg-black/50 backdrop-blur-md mb-3 sm:mb-4 shadow-xl">
                      <h3
                        className="font-heading text-lg sm:text-2xl font-normal tracking-wide"
                        style={{ color: '#FFFFFF' }}
                      >
                        {cat.title}
                      </h3>
                    </div>

                    {/* Editorial Description Text */}
                    <p
                      className="font-sans text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 font-light line-clamp-3 sm:line-clamp-none px-2"
                      style={{ color: '#FFFFFF' }}
                    >
                      {cat.description}
                    </p>

                    {/* Sub-caption */}
                    <span
                      className="font-sans text-[0.7rem] sm:text-xs tracking-wider font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {cat.itemCount} — Explore Category →
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <h3
                      className="font-heading text-lg sm:text-xl font-normal tracking-widest uppercase mb-1"
                      style={{ color: '#FFFFFF' }}
                    >
                      {cat.title}
                    </h3>
                    <span
                      className="font-sans text-[0.65rem] sm:text-xs tracking-wider uppercase"
                      style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                      {cat.itemCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
