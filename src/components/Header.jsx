import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Store,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  activeRole,
  setActiveRole
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    if (id === 'collections') {
      const el = document.getElementById('section-new-arrivals');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* STICKY LUXURY HEADER WITH 33% / 67% DUAL SPLIT BACKGROUND */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: isScrolled
            ? 'rgba(253, 251, 247, 0.98)'
            : 'linear-gradient(to right, #EFE6DD 0%, #EFE6DD 33%, #FFFFFF 33%, #FFFFFF 100%)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
          // borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '33% 67%',
            minHeight: isScrolled ? '70px' : '82px',
            alignItems: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Left Panel (Beige) - Logo */}
          <div
            style={{
              paddingLeft: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ display: 'none', color: 'var(--color-charcoal)', padding: '4px' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Logo
              onClick={() => handleNavClick('home')}
              showTagline={!isScrolled}
              size={isScrolled ? 'small' : 'medium'}
            />
          </div>

          {/* Right Panel (White) - Nav & Actions */}
          <div
            style={{
              paddingLeft: '48px',
              paddingRight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Center Navigation */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '28px' }}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: activeTab === link.id ? '600' : '400',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeTab === link.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                    position: 'relative',
                    padding: '6px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {link.label}
                  {activeTab === link.id && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '18px',
                        height: '2px',
                        backgroundColor: 'var(--color-gold)'
                      }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button onClick={onOpenSearch} title="Search" style={{ color: 'var(--color-charcoal)', padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Search size={20} strokeWidth={1.75} />
              </button>

              <button onClick={onOpenWishlist} title="Wishlist" style={{ color: 'var(--color-charcoal)', padding: '6px', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Heart size={20} strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'var(--color-gold)', color: '#FFF', fontSize: '0.62rem', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button onClick={onOpenCart} title="Cart" style={{ color: 'var(--color-charcoal)', padding: '6px', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ShoppingBag size={20} strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'var(--color-charcoal)', color: '#FFF', fontSize: '0.62rem', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Role Switcher Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(172, 128, 93, 0.08)', border: '1px solid var(--color-border-gold)', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-gold-dark)', cursor: 'pointer' }}
                >
                  <User size={15} /> <span>{activeRole}</span> <ChevronDown size={14} />
                </button>

                {showRoleDropdown && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px', backgroundColor: '#FFF', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-medium)', borderRadius: '4px', padding: '8px 0', zIndex: 150 }}>
                    <div style={{ padding: '6px 16px', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                      Switch View
                    </div>
                    <button onClick={() => { setActiveRole('BUYER'); setActiveTab('account'); setShowRoleDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <User size={16} /> Buyer Account
                    </button>
                    <button onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-dashboard'); setShowRoleDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Store size={16} /> Seller Portal
                    </button>
                    <button onClick={() => { setActiveRole('ADMIN'); setActiveTab('admin-dashboard'); setShowRoleDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <ShieldCheck size={16} /> Admin Panel
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-register'); }}
                className="btn-outline-gold become-seller-desktop"
                style={{ padding: '8px 16px', fontSize: '0.72rem' }}
              >
                <Store size={14} /> Become a Seller
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', top: '100%', left: 0, right: 0, backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-medium)', zIndex: 90 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{ textAlign: 'left', fontFamily: "'Marcellus', serif", fontSize: '1.2rem', color: activeTab === link.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {link.label}
                </button>
              ))}
              <button onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-register'); setIsMobileMenuOpen(false); }} className="btn-gold" style={{ width: '100%', marginTop: '8px' }}>
                Become a Seller
              </button>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .become-seller-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
