import React from 'react';
import { Gift, Percent, Sparkles, Truck, CircleDollarSign } from 'lucide-react';

export function BrandStatementSection() {
  return (
    <section className="bg-[#FAF5EE] py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden border-b border-[#AC805D]/15">
      {/* Background Vector Leaf Watermarks */}
      <svg
        className="absolute -top-5 -left-5 w-48 sm:w-72 h-48 sm:h-72 opacity-10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#AC805D"
      >
        <path d="M10 90 C30 70 40 40 90 10 C70 30 40 40 10 90 Z" strokeWidth="1" />
        <path d="M30 70 C45 55 55 35 80 20" strokeWidth="0.8" />
        <path d="M20 80 C35 65 45 45 70 30" strokeWidth="0.8" />
      </svg>

      <svg
        className="absolute -bottom-8 right-5 w-56 sm:w-80 h-56 sm:h-80 opacity-8 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="#AC805D"
      >
        <path d="M90 90 C70 70 60 40 10 10 C30 30 60 40 90 90 Z" strokeWidth="1" />
        <path d="M70 70 C55 55 45 35 20 20" strokeWidth="0.8" />
      </svg>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Eyebrow Header */}
        <div className="text-center mb-6">
          <span className="font-sans text-xs sm:text-sm tracking-[0.22em] uppercase text-[#8C7665] font-normal">
            JEWELS AS UNIQUE AS YOU ARE
          </span>
        </div>

        {/* Main Editorial Statement Paragraph with Inline Jewellery Images */}
        <div className="font-heading text-lg sm:text-2xl lg:text-3xl leading-relaxed sm:leading-[2.1] text-[#26221F] text-center max-w-5xl mx-auto mb-12 sm:mb-16 font-normal tracking-wide uppercase">
          ELEGANCE IS TIMELESS, AND SO IS OUR JEWELRY{' '}
          <img
            src="/assets/jewellery/ring/1.jpg"
            alt="Diamond Ring"
            className="inline-block align-middle w-9 sm:w-12 h-8 sm:h-10 rounded-md mx-1 sm:mx-2 object-cover border border-[#AC805D]/25 shadow-sm"
          />{' '}
          DESIGNED WITH CARE. EACH PIECE{' '}
          <img
            src="/assets/jewellery/hero/ringhero1.png"
            alt="Ring Box"
            className="inline-block align-middle w-9 sm:w-11 h-8 sm:h-10 rounded-md mx-1 sm:mx-2 object-contain bg-white border border-[#AC805D]/25 shadow-sm"
          />{' '}
          REFLECTS YOUR UNIQUE STORY{' '}
          <img
            src="/assets/jewellery/ring/2.jpg"
            alt="Gold Rings"
            className="inline-block align-middle w-9 sm:w-12 h-8 sm:h-10 rounded-md mx-1 sm:mx-2 object-cover border border-[#AC805D]/25 shadow-sm"
          />{' '}
          MAKING EVERY MOMENT{' '}
          <img
            src="/assets/jewellery/bracelet/1.jpg"
            alt="Jewellery Piece"
            className="inline-block align-middle w-9 sm:w-12 h-8 sm:h-10 rounded-md mx-1 sm:mx-2 object-cover border border-[#AC805D]/25 shadow-sm"
          />{' '}
          UNFORGETTABLE AND EVERY LOOK.
        </div>

        {/* 5 Feature Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto mb-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <Gift size={30} strokeWidth={1.4} color="#AC805D" />
            <span className="font-sans text-xs sm:text-sm text-[#3A3027]">
              Reward Program
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Percent size={30} strokeWidth={1.4} color="#AC805D" />
            <span className="font-sans text-xs sm:text-sm text-[#3A3027]">
              Special Discounts
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Sparkles size={30} strokeWidth={1.4} color="#AC805D" />
            <span className="font-sans text-xs sm:text-sm text-[#3A3027]">
              Unique Designs
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Truck size={30} strokeWidth={1.4} color="#AC805D" />
            <span className="font-sans text-xs sm:text-sm text-[#3A3027]">
              Fast Shipping
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 col-span-2 sm:col-span-1">
            <CircleDollarSign size={30} strokeWidth={1.4} color="#AC805D" />
            <span className="font-sans text-xs sm:text-sm text-[#3A3027]">
              Great Prices
            </span>
          </div>
        </div>

        {/* Founder Signature */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-serif text-3xl sm:text-4xl text-[#5C4A3C] leading-none mb-1 italic">
            K. T. Cathrine
          </div>
          <span className="font-sans text-[0.75rem] tracking-[0.12em] text-[#7A6B5D] uppercase">
            K T Cathrine Thomas
          </span>
        </div>
      </div>
    </section>
  );
}
