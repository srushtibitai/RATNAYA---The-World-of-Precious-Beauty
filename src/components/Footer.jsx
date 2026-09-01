import React from 'react';
import { Logo } from './Logo';
import {
  Instagram,
  Facebook,
  Youtube,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Lock
} from 'lucide-react';

export function Footer({ setActiveTab, setActiveRole, onSelectCategory }) {
  return (
    <footer
      id="section-footer"
      style={{
        backgroundColor: '#111111',
        color: '#D9D4CE',
        paddingTop: '80px',
        paddingBottom: '40px',
        borderTop: '1px solid rgba(197, 160, 89, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Trust Value Badges Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            paddingBottom: '60px',
            marginBottom: '60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059'
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: '500' }}>
                100% BIS Hallmarked
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#999' }}>Guaranteed 22K & 18K Purity</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: '500' }}>
                Certified Gemstones
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#999' }}>GIA, IGI & SGL Authenticated</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059'
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: '500' }}>
                Insured Express Delivery
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#999' }}>Tamper-proof transit insurance</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059'
              }}
            >
              <RotateCcw size={22} />
            </div>
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: '500' }}>
                Easy Returns
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#999' }}>14-day return & buyback guarantee</p>
            </div>
          </div>
        </div>

        {/* Footer Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}
        >
          {/* Col 1: Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <Logo variant="light" showTagline size="large" />
            <p
              style={{
                fontSize: '0.85rem',
                color: '#AAA',
                marginTop: '20px',
                maxWidth: '340px',
                lineHeight: 1.8
              }}
            >
              Ratnaya is India’s premier multi-vendor luxury jewellery marketplace. Bringing together legendary heritage goldsmiths, certified diamond ateliers, and independent artisans under one royal canopy.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <a
                href="#instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059'
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="#facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059'
                }}
              >
                <Facebook size={18} />
              </a>
              <a
                href="#youtube"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059'
                }}
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Shop
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <li>
                <button onClick={() => { setActiveTab('shop'); onSelectCategory && onSelectCategory('rings'); }} style={{ color: '#AAA' }}>Rings</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); onSelectCategory && onSelectCategory('necklaces'); }} style={{ color: '#AAA' }}>Necklaces</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); onSelectCategory && onSelectCategory('earrings'); }} style={{ color: '#AAA' }}>Earrings</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); onSelectCategory && onSelectCategory('bracelets'); }} style={{ color: '#AAA' }}>Bracelets</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); onSelectCategory && onSelectCategory('bangles'); }} style={{ color: '#AAA' }}>Bangles</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); }} style={{ color: '#AAA' }}>New Arrivals</button>
              </li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER CARE */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <li><a href="#contact" onClick={() => setActiveTab('contact')} style={{ color: '#AAA' }}>Contact Us</a></li>
              <li><a href="#shipping" style={{ color: '#AAA' }}>Shipping Policy</a></li>
              <li><a href="#returns" style={{ color: '#AAA' }}>Returns & Refunds</a></li>
              <li><a href="#faqs" style={{ color: '#AAA' }}>Frequently Asked Questions</a></li>
              <li><button onClick={() => { setActiveRole('BUYER'); setActiveTab('account'); }} style={{ color: '#AAA' }}>Order Tracking</button></li>
            </ul>
          </div>

          {/* Col 4: SELL WITH RATNAYA */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Sell With Ratnaya
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <li>
                <button
                  onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-register'); }}
                  style={{ color: '#C5A059', fontWeight: '500' }}
                >
                  Become a Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-dashboard'); }}
                  style={{ color: '#AAA' }}
                >
                  Seller Login
                </button>
              </li>
              <li><a href="#seller-guide" style={{ color: '#AAA' }}>Seller Guide & Commission</a></li>
              <li>
                <button
                  onClick={() => { setActiveRole('ADMIN'); setActiveTab('admin-dashboard'); }}
                  style={{ color: '#888', fontSize: '0.78rem' }}
                >
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: COMPANY */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <li><a href="#about" onClick={() => setActiveTab('about')} style={{ color: '#AAA' }}>About Ratnaya</a></li>
              <li><a href="#story" style={{ color: '#AAA' }}>Our Heritage Story</a></li>
              <li><a href="#privacy" style={{ color: '#AAA' }}>Privacy Policy</a></li>
              <li><a href="#terms" style={{ color: '#AAA' }}>Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#777'
          }}
        >
          <div>
            © {new Date().getFullYear()} RATNAYA — The World of Precious Beauty. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Secure 256-Bit SSL Encrypted Checkout</span>
            <span>Made with Excellence in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
