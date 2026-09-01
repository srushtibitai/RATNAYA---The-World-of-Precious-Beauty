import React from 'react';
import { Gift, Percent, Sparkles, Truck, CircleDollarSign } from 'lucide-react';

export function BrandStatementSection() {
  return (
    <section
      style={{
        backgroundColor: '#FAF5EE',
        padding: '90px 24px 70px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(172, 128, 93, 0.15)'
      }}
      className="swarna-statement-section"
    >
      {/* Background Vector Leaf Watermarks */}
      <svg
        style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '280px',
          height: '280px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="#AC805D"
      >
        <path d="M10 90 C30 70 40 40 90 10 C70 30 40 40 10 90 Z" strokeWidth="1" />
        <path d="M30 70 C45 55 55 35 80 20" strokeWidth="0.8" />
        <path d="M20 80 C35 65 45 45 70 30" strokeWidth="0.8" />
      </svg>

      <svg
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '20px',
          width: '320px',
          height: '320px',
          opacity: 0.08,
          pointerEvents: 'none'
        }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="#AC805D"
      >
        <path d="M90 90 C70 70 60 40 10 10 C30 30 60 40 90 90 Z" strokeWidth="1" />
        <path d="M70 70 C55 55 45 35 20 20" strokeWidth="0.8" />
      </svg>

      <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        {/* Eyebrow Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.8rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8C7665',
              fontWeight: '400'
            }}
          >
            JEWELS AS UNIQUE AS YOU ARE
          </span>
        </div>

        {/* Main Editorial Statement Paragraph with Inline Jewellery Images */}
        <div
          style={{
            fontFamily: "'Marcellus', serif",
            fontSize: '2rem',
            lineHeight: '2.1',
            color: '#26221F',
            textAlign: 'center',
            maxWidth: '1120px',
            margin: '0 auto 64px auto',
            fontWeight: '400',
            letterSpacing: '0.03em',
            textTransform: 'uppercase'
          }}
          className="swarna-statement-text"
        >
          ELEGANCE IS TIMELESS, AND SO IS OUR JEWELRY{' '}
          <img
            src="/assets/jewellery/ring/1.jpg"
            alt="Diamond Ring"
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: '48px',
              height: '42px',
              borderRadius: '8px',
              margin: '0 8px',
              objectFit: 'cover',
              border: '1px solid rgba(172, 128, 93, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          />{' '}
          DESIGNED WITH CARE. EACH PIECE{' '}
          <img
            src="/assets/jewellery/hero/ringhero1.png"
            alt="Ring Box"
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: '46px',
              height: '42px',
              borderRadius: '8px',
              margin: '0 8px',
              objectFit: 'contain',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(172, 128, 93, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          />{' '}
          REFLECTS YOUR UNIQUE STORY{' '}
          <img
            src="/assets/jewellery/ring/2.jpg"
            alt="Gold Rings"
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: '48px',
              height: '42px',
              borderRadius: '8px',
              margin: '0 8px',
              objectFit: 'cover',
              border: '1px solid rgba(172, 128, 93, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          />{' '}
          MAKING EVERY MOMENT{' '}
          <img
            src="/assets/jewellery/bracelet/1.jpg"
            alt="Jewellery Piece"
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: '48px',
              height: '42px',
              borderRadius: '8px',
              margin: '0 8px',
              objectFit: 'cover',
              border: '1px solid rgba(172, 128, 93, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          />{' '}
          UNFORGETTABLE AND EVERY LOOK.
        </div>

        {/* 5 Feature Highlights Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto 60px auto',
            textAlign: 'center'
          }}
          className="swarna-features-grid"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Gift size={32} strokeWidth={1.4} color="#AC805D" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', color: '#3A3027' }}>
              Reward Program
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Percent size={32} strokeWidth={1.4} color="#AC805D" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', color: '#3A3027' }}>
              Special Discounts
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={32} strokeWidth={1.4} color="#AC805D" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', color: '#3A3027' }}>
              Unique Designs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Truck size={32} strokeWidth={1.4} color="#AC805D" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', color: '#3A3027' }}>
              Fast Shipping
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CircleDollarSign size={32} strokeWidth={1.4} color="#AC805D" />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', color: '#3A3027' }}>
              Great Prices
            </span>
          </div>
        </div>

        {/* Founder Signature & Arched Model Image */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Cursive Signature */}
          <div
            style={{
              fontFamily: "'Caveat', 'Playfair Display', cursive",
              fontSize: '2.6rem',
              color: '#5C4A3C',
              lineHeight: 1,
              marginBottom: '6px'
            }}
          >
            K. T. Cathrine
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              color: '#7A6B5D',
              textTransform: 'uppercase'
            }}
          >
            K T Cathrine Thomas
          </span>

          {/* Arched Accent Model Image at Bottom Right */}
          {/* <div
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '-20px',
              width: '135px',
              height: '165px',
              borderRadius: '70px 70px 0 0',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(172, 128, 93, 0.25)'
            }}
            className="swarna-founder-arch"
          >
            <img
              src="/assets/jewellery/hero/rightside1.jpg"
              alt="Model wearing jewellery"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div> */}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        @media (max-width: 992px) {
          .swarna-statement-text { font-size: 1.4rem !important; lineHeight: 1.8 !important; }
          .swarna-features-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .swarna-founder-arch { position: relative !important; right: auto !important; bottom: auto !important; margin-top: 24px !important; }
        }
        @media (max-width: 600px) {
          .swarna-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
