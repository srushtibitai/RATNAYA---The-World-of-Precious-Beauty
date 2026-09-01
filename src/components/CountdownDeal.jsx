import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

export function CountdownDeal({ onNavigateShop }) {
  // 4 days countdown target
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        padding: '100px 0',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=2000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }}
          className="deal-grid"
        >
          <div>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#C5A059',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <Clock size={16} /> EXCLUSIVE FESTIVE OFFER
            </span>

            <h2
              style={{
                fontSize: '3rem',
                color: '#FFFFFF',
                fontFamily: "'Marcellus', serif",
                lineHeight: 1.2,
                marginBottom: '20px'
              }}
            >
              Hurry, Deals End Soon
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#DDD', lineHeight: 1.7, marginBottom: '36px', fontWeight: '300' }}>
              Enjoy complimentary certified diamond upgrade and zero making charges on select 22K Kundan bridal sets.
            </p>

            {/* Countdown Box Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                maxWidth: '440px',
                marginBottom: '40px'
              }}
            >
              {[
                { label: 'DAYS', val: String(timeLeft.days).padStart(2, '0') },
                { label: 'HOURS', val: String(timeLeft.hours).padStart(2, '0') },
                { label: 'MINUTES', val: String(timeLeft.minutes).padStart(2, '0') },
                { label: 'SECONDS', val: String(timeLeft.seconds).padStart(2, '0') }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    padding: '16px 8px',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', fontFamily: "'Marcellus', serif", color: '#E5C888', fontWeight: '400', lineHeight: 1 }}>
                    {item.val}
                  </div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: '#AAA', marginTop: '6px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onNavigateShop} className="btn-gold" style={{ padding: '16px 40px' }}>
              SHOP NOW <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
              <img
                src="/assets/jewellery/necklace/8.jpg"
                alt="Limited Festive Deal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .deal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
