import React, { useState, useEffect } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';

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
    ringAccent: '/assets/jewellery/ring/herosection2.png',
    accentImage: '/assets/jewellery/bracelet/1.jpg',
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
    ringAccent: '/assets/jewellery/ring/herosection3.png',
    accentImage: '/assets/jewellery/hero/rightside3.jpg',
    thumbnails: [
      '/assets/jewellery/hero/sub3-1.jpg',
      '/assets/jewellery/hero/sub3-2.jpg',
      '/assets/jewellery/hero/sub3-3.jpg',
      '/assets/jewellery/hero/sub3-4.jpg'
    ]
  }
];

export function HeroSlider({ onNavigateShop }) {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % SWARNA_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SWARNA_SLIDES[activeSlideIdx];
  const activeMainImg = activeThumbIdx === 0 ? slide.mainImage : slide.thumbnails[activeThumbIdx];

  return (
    <section
      style={{
        background: 'linear-gradient(to right, #EFE6DD 0%, #EFE6DD 33%, #FFFFFF 33%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center'
      }}
      className="swarna-hero-section"
    >
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '33% 67%',
          minHeight: '85vh',
          position: 'relative'
        }}
        className="swarna-hero-grid"
      >
        {/* LEFT PANEL (33% WIDTH, BEIGE BACKGROUND) */}
        <div
          style={{
            padding: '40px 0 40px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            zIndex: 5
          }}
        >
          {/* Vertical Rotated Watermark Text */}
          <div
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: "'Marcellus', serif",
              fontSize: '4.4rem',
              letterSpacing: '0.22em',
              color: 'rgba(172, 128, 93, 0.22)',
              userSelect: 'none',
              fontWeight: '400',
              lineHeight: 1,
              whiteSpace: 'nowrap'
            }}
          >
            {slide.watermark}
          </div>

          {/* Vertical 4 Model Thumbnail Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 5 }}>
            {slide.thumbnails.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveThumbIdx(idx)}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  opacity: 1,
                  transform: 'scale(1)',
                  marginTop: '50px',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (67% WIDTH, WHITE BACKGROUND WITH PALM SHADOW) */}
        <div
          style={{
            padding: '60px 48px 60px 480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            backgroundImage: `radial-gradient(circle at 85% 15%, rgba(230, 215, 195, 0.3) 0%, transparent 65%)`
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.82rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#AC805D',
              fontWeight: '600',
              marginBottom: '16px'
            }}
          >
            {slide.eyebrow}
          </span>

          {/* Main Heading */}
          <h1
            style={{
              fontFamily: "'Marcellus', serif",
              fontSize: '2.9rem',
              color: '#1A1A1A',
              lineHeight: 1.2,
              marginBottom: '20px',
              fontWeight: '400',
              maxWidth: '560px'
            }}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.96rem',
              color: '#6E5D4F',
              lineHeight: 1.75,
              marginBottom: '36px',
              maxWidth: '460px',
              fontWeight: '300'
            }}
          >
            {slide.description}
          </p>

          {/* Swarna Luxury Morphing Button (Circle resting -> Chevron hover) */}
          <div>
            <button onClick={onNavigateShop} className="btn-swarna-hero">
              <span className="btn-text">Know More</span>
              <span className="arrow-box">
                <span className="arrow-icon-default">➔</span>
                <span className="arrow-icon-hover">➔</span>
              </span>
            </button>
          </div>

          {/* Floating Solitaire Gold Ring at Bottom Center */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '500px',
              width: '160px',
              height: '130px',
              borderRadius: '16px',
              overflow: 'hidden',
              // boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              // border: '1px solid rgba(172, 128, 93, 0.2)',
              // backgroundColor: '#FFFFFF',
              zIndex: 12
            }}
            className="hero-ring-accent"
          >
            <img
              src={slide.ringAccent}
              alt="Solitaire Ring"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'scale-down'
              }}
            />
          </div>

          {/* Floating Bottom Right Accent Arched Thumbnail */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '130px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '20px'
            }}
            className="swarna-hero-accents"
          >
            {/* Arched Top Accent Thumbnail */}
            <div
              style={{
                width: '220px',
                height: '260px',
                borderRadius: '120px 120px 0 0',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(172, 128, 93, 0.2)'
              }}
            >
              <img src={slide.accentImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* ABSOLUTE CENTER ARCHED MAIN IMAGE FRAME STRADDLING THE 33% SPLIT BOUNDARY */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '18.5%',
            transform: 'translateY(-50%)',
            width: '700px',
            height: '580px',
            borderRadius: '280px 0 0 0',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
            zIndex: 10,
            backgroundColor: '#FFFFFF'
          }}
          className="swarna-main-arch-frame"
        >
          <img
            src={activeMainImg}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </div>

        {/* Numbered Pagination Arrow Counter (1 ──➔ 2 ──➔ 3) */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '35%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 20
          }}
        >
          {SWARNA_SLIDES.map((s, idx) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => {
                  setActiveSlideIdx(idx);
                  setActiveThumbIdx(0);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: activeSlideIdx === idx ? '#AC805D' : '#E5DDD3',
                  color: activeSlideIdx === idx ? '#FFFFFF' : '#6E5D4F',
                  fontFamily: "'Marcellus', serif",
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  fontWeight: activeSlideIdx === idx ? '600' : '400',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {s.id}
              </button>
              {idx < SWARNA_SLIDES.length - 1 && (
                <span style={{ color: '#AC805D', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  ──➔
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Swarna Hero responsive styles */}
      <style>{`
        .btn-swarna-hero {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          min-width: 210px;
          background-color: #000000;
          border: 1px solid #000000;
          border-radius: 0px;
          padding: 0 0 0 28px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .btn-swarna-hero .btn-text {
          font-family: 'Marcellus', serif;
          font-size: 0.95rem;
          color: #FFFFFF;
          letter-spacing: 0.04em;
          z-index: 2;
          transition: color 0.35s ease;
        }

        /* Resting State: Small White Circle Badge */
        .btn-swarna-hero .arrow-box {
          position: relative;
          width: 28px;
          height: 28px;
          margin-right: 20px;
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
          font-size: 0.8rem;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
        }

        .btn-swarna-hero .arrow-icon-hover {
          position: absolute;
          color: #AC805D;
          font-size: 1.1rem;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        /* HOVER INTERACTION: Morphs circle into pointed chevron box */
        .btn-swarna-hero:hover {
          background-color: #AC805D;
          border-color: #AC805D;
        }

        .btn-swarna-hero:hover .arrow-box {
          width: 50px;
          height: 100%;
          margin-right: 0;
          border-radius: 0px;
        clip-path: path( 'M 16 0 C 12 0 5 11.5 0 25 C 5 38.5 12 50 16 50 L 50 50 L 50 0 Z');
          
        }

        .btn-swarna-hero:hover .arrow-icon-default {
          opacity: 0;
          transform: translateX(10px);
        }

        .btn-swarna-hero:hover .arrow-icon-hover {
          opacity: 1;
          transform: translateX(2px);
        }

        @media (max-width: 1200px) {
          .swarna-main-arch-frame { width: 440px !important; height: 440px !important; left: 18% !important; }
        }
        @media (max-width: 1024px) {
          .swarna-hero-grid { grid-template-columns: 1fr !important; }
          .swarna-main-arch-frame { position: relative !important; top: auto !important; left: auto !important; transform: none !important; margin: 20px auto !important; }
          .swarna-hero-accents, .hero-ring-accent { display: none !important; }
        }
      `}</style>
    </section>
  );
}
