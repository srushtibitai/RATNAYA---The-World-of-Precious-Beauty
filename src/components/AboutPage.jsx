import React from 'react';
import { Award, Store, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export function AboutPage({ onNavigateShop, onBecomeSeller }) {
  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px' }}>
      {/* Banner */}
      <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '80px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border-gold)' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <span className="eyebrow" style={{ color: '#C5A059' }}>OUR HERITAGE STORY</span>
          <h1 style={{ fontSize: '3.2rem', color: '#FFFFFF', fontFamily: "'Marcellus', serif", margin: '12px 0 16px' }}>
            "The World of Precious Beauty"
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#AAA', lineHeight: 1.8 }}>
            Ratnaya is India’s premier multi-vendor luxury jewellery marketplace connecting discerning patrons with historic goldsmith ateliers, certified diamond creators, and independent artisans.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '80px' }}>
        {/* Section 1: Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '100px' }} className="about-grid">
          <div>
            <span className="eyebrow">THE RATNAYA PURPOSE</span>
            <h2 className="section-title">Elevating Indian Goldsmithing Traditions</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '20px' }}>
              Founded with a passion for preserving ancient Jadau, Kundan, Meenakari, and filigree techniques, Ratnaya bridges the gap between legendary regional ateliers and modern luxury buyers nationwide.
            </p>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.8, marginBottom: '28px' }}>
              Every creation displayed on our marketplace undergoes strict 6-digit HUID BIS hallmarking verification and certified gemstone authentication before reaching your doorstep in tamper-proof insured packaging.
            </p>
            <button onClick={onNavigateShop} className="btn-gold">EXPLORE CATALOG <ArrowRight size={16} /></button>
          </div>

          <div style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', boxShadow: 'var(--shadow-medium)' }}>
            <img src="/assets/jewellery/necklace/videoframe_3765.png" alt="Ratnaya Craftsmanship" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Section 2: Values */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '60px 40px', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="section-title" style={{ marginBottom: '40px' }}>The Core Pillars of Ratnaya</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="why-ratnaya-grid">
            <div style={{ padding: '20px' }}>
              <Award size={36} color="var(--color-gold-dark)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>100% BIS Hallmarked</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Guaranteed 22K (916) and 18K (750) purity with HUID tracking.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <Store size={36} color="var(--color-gold-dark)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Vetted Merchant Network</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Empowering verified heritage goldsmiths from Jaipur, Mumbai, Kolkata & Hyderabad.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <ShieldCheck size={36} color="var(--color-gold-dark)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>GIA & IGI Solitaires</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Internationally certified natural diamonds and precious gemstones.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <Heart size={36} color="var(--color-gold-dark)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Transparent Marketplace</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Direct merchant pricing, low making charges, and transparent buyback.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Merchant CTA */}
        <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '60px 40px', borderRadius: '4px', textAlign: 'center', border: '1px solid var(--color-border-gold)' }}>
          <h2 style={{ fontSize: '2.2rem', fontFamily: "'Marcellus', serif", marginBottom: '16px', color: '#FFF' }}>
            Are You a Heritage Jeweller or Diamond Atelier?
          </h2>
          <p style={{ fontSize: '1rem', color: '#CCC', maxWidth: '600px', margin: '0 auto 28px' }}>
            Join the Ratnaya merchant family to list your hallmarked creations to luxury buyers across India.
          </p>
          <button onClick={onBecomeSeller} className="btn-gold" style={{ padding: '16px 36px' }}>BECOME A RATNAYA SELLER</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
