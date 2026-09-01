import React, { useState } from 'react';

const VIDEO_CATEGORIES = [
  {
    id: 'earrings',
    title: 'Earrings',
    itemCount: '80+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Elegant entryway organization ideas that are perfect when you want something stylish modern and easy to copy for anyone who lov.mp4',
    description: 'Handcrafted Kundan droplets and diamond chandelier earrings tailored for royal moments.'
  },
  {
    id: 'rings',
    title: 'Rings',
    itemCount: '120+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Money Saving Tips Inspiration for Everyday 18207-pin-id-982136631248328968.mp4',
    description: 'Bespoke 22K gold Jadau foil setting and GIA certified solitaire creations reflecting your unique story.'
  },
  {
    id: 'bracelets',
    title: 'Bracelets',
    itemCount: '60+ items',
    video: '/assets/jewellery/video/From Klickpin.com- Smart garage upgrades for boards that feel current and useful for cozy moods to try this week-pin-id-1082130616745941230.mp4',
    description: 'Torquent Natoque Per Cursus Dui Condimentum Nec Vestibulum Tortor. Pulvinar Euismod Ad Diam Molestie Consectetur Parturient Omare. Id Nibh Sit Euismod Volutpat Ligula Tristique.'
  },
  {
    id: 'pendants',
    title: 'Pendants',
    itemCount: '90+ items',

    video: '/assets/jewellery/video/From Klickpin.com- Polished Bridal Shower Ideas Worth Trying 5047-pin-id-858146904041441263.mp4',

    description: 'Exquisite diamond & emerald pendants designed to illuminate every celebration with distinctive grace.'
  }
];

export function JewelleryVideoAccordionSection({ onSelectCategory, onNavigateShop }) {
  // Active column index (default to 2: Bracelets, matching reference screenshot)
  const [activeIdx, setActiveIdx] = useState(2);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        backgroundColor: '#111111',
        overflow: 'hidden'
      }}
      className="swarna-video-accordion-section"
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%'
        }}
        className="accordion-container"
      >
        {VIDEO_CATEGORIES.map((cat, idx) => {
          const isActive = activeIdx === idx;

          return (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => onSelectCategory ? onSelectCategory(cat.id) : (onNavigateShop && onNavigateShop())}
              style={{
                flex: isActive ? '2.2' : '1',
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'flex 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                borderRight: idx < VIDEO_CATEGORIES.length - 1 ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'
              }}
              className={`accordion-column ${isActive ? 'active' : ''}`}
            >
              {/* Background Video */}
              <video
                src={cat.video}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: isActive ? 'brightness(0.75) contrast(1.05)' : 'brightness(0.45) grayscale(0.2)',
                  transition: 'filter 0.6s ease, transform 0.6s ease',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)'
                }}
              />

              {/* Dark Overlay Gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive
                    ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 100%)'
                    : 'rgba(0, 0, 0, 0.45)',
                  transition: 'background 0.6s ease'
                }}
              />

              {/* Column Content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: isActive ? 'center' : 'flex-end',
                  padding: isActive ? '40px 30px' : '0 0 60px 0',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {isActive ? (
                  /* Active Column Layout: Oval Title Badge + Description + Subtext */
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      maxWidth: '380px',
                      animation: 'fadeInUp 0.5s ease'
                    }}
                  >
                    {/* Oval Badge with Title */}
                    <div
                      style={{
                        padding: '12px 36px',
                        borderRadius: '50px',
                        border: '1px solid rgba(255, 255, 255, 0.75)',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        backdropFilter: 'blur(4px)',
                        marginBottom: '28px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Marcellus', serif",
                          fontSize: '2rem',
                          color: '#FFFFFF',
                          margin: 0,
                          fontWeight: '400',
                          letterSpacing: '0.04em'
                        }}
                      >
                        * {cat.title} *
                      </h3>
                    </div>

                    {/* Editorial Description Text */}
                    <p
                      style={{
                        fontFamily: "'Marcellus', serif",
                        fontSize: '0.88rem',
                        lineHeight: 1.7,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '24px',
                        fontWeight: '300',
                        textAlign: 'center'
                      }}
                    >
                      {cat.description}
                    </p>

                    {/* Sub-caption */}
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.82rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        letterSpacing: '0.08em'
                      }}
                    >
                      ( Explore {cat.itemCount} )
                    </span>
                  </div>
                ) : (
                  /* Resting Column Layout: Clean Vertical/Bottom Category Title */
                  <h3
                    style={{
                      fontFamily: "'Marcellus', serif",
                      fontSize: '2.2rem',
                      color: '#FFFFFF',
                      margin: 0,
                      fontWeight: '400',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {cat.title}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 992px) {
          .swarna-video-accordion-section { height: auto !important; }
          .accordion-container { flex-direction: column !important; }
          .accordion-column { height: 320px !important; flex: 1 !important; }
        }
      `}</style>
    </section>
  );
}
