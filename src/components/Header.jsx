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
  setActiveRole,
  onOpenAuthModal,
  currentUser,
  onLogout
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

  // Lock Body Scroll when Mobile Menu Drawer is Open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

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
      {/* STICKY LUXURY HEADER WITH 33% / 67% DUAL SPLIT ALIGNED WITH HERO SECTION */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md border-b border-gold/15'
            : 'bg-[#FAF6F0] lg:bg-gradient-to-r lg:from-[#EFE6DD] lg:via-[#EFE6DD] lg:via-[33%] lg:to-white lg:to-[33%]'
        }`}
      >
        <div className={`w-full flex lg:grid lg:grid-cols-[33%_67%] items-center justify-between transition-all duration-300 ${
          isScrolled ? 'min-h-[54px] sm:min-h-[62px]' : 'min-h-[60px] sm:min-h-[70px]'
        }`}>
          {/* Left Panel (Beige) - Hamburger & Logo aligned */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2.5 sm:pl-5 lg:pl-6 pr-2 py-1.5 shrink-0">
            <button
              className="lg:hidden text-charcoal p-1 hover:text-gold transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Logo
              onClick={() => handleNavClick('home')}
              showTagline={!isScrolled}
              size={isScrolled ? 'small' : 'medium'}
            />
          </div>

          {/* Right Panel (White on Desktop 67% split) - Nav & Actions */}
          <div className="flex items-center justify-between flex-1 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 min-w-0">
            {/* Center Desktop Navigation - Distributed Responsive Spacing */}
            <nav className="hidden lg:flex items-center justify-center gap-4 lg:gap-6 xl:gap-9 2xl:gap-12 flex-1 px-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`font-sans text-[0.78rem] xl:text-[0.84rem] uppercase tracking-[0.1em] xl:tracking-[0.14em] whitespace-nowrap relative py-1 bg-transparent border-none cursor-pointer transition-colors duration-200 ${
                    activeTab === link.id
                      ? 'font-semibold text-gold-dark'
                      : 'font-normal text-charcoal hover:text-gold'
                  }`}
                >
                  {link.label}
                  {activeTab === link.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gold rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
              <button
                onClick={onOpenSearch}
                title="Search"
                className="text-charcoal hover:text-gold p-1 transition-colors bg-transparent border-none cursor-pointer"
              >
                <Search size={18} strokeWidth={1.75} />
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuthModal();
                  } else {
                    onOpenWishlist();
                  }
                }}
                title="Wishlist"
                className="text-charcoal hover:text-gold p-1 relative transition-colors bg-transparent border-none cursor-pointer"
              >
                <Heart size={18} strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[0.56rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuthModal();
                  } else {
                    onOpenCart();
                  }
                }}
                title="Cart"
                className="text-charcoal hover:text-gold p-1 relative transition-colors bg-transparent border-none cursor-pointer"
              >
                <ShoppingBag size={18} strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charcoal text-white text-[0.56rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* SINGLE RESPONSIVE AUTH / USER PROFILE BUTTON */}
              {!currentUser ? (
                /* WHEN LOGGED OUT: Sleek 28px Circle on Mobile, Pill on Desktop */
                <button
                  onClick={onOpenAuthModal}
                  className="bg-gold hover:bg-charcoal text-white text-[0.68rem] font-semibold h-7 sm:h-auto sm:py-1 px-0 sm:px-3 w-7 sm:w-auto rounded-full flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer shadow-sm transition-all border border-gold"
                  title="Sign In"
                >
                  <User size={13} className="shrink-0" />
                  <span className="hidden sm:inline">SIGN IN</span>
                </button>
              ) : (
                /* WHEN LOGGED IN: Sleek 28px Circle on Mobile, Pill on Desktop */
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/40 text-xs font-semibold py-1 px-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 shadow-2xs shrink-0"
                    title={currentUser.name}
                  >
                    <User size={13} className="shrink-0" />
                    <span className="max-w-[120px] truncate whitespace-nowrap hidden sm:inline">
                      {currentUser.name}
                    </span>
                    <span className="bg-[#9A7B3E] text-white text-[0.58rem] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider hidden sm:inline ml-0.5 shrink-0">
                      {currentUser.role}
                    </span>
                    <ChevronDown size={11} className="hidden sm:inline shrink-0" />
                  </button>

                  {showRoleDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gold/30 shadow-medium rounded-md py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <strong className="text-sm text-charcoal block truncate">
                          {currentUser.name}
                        </strong>
                        <span className="text-xs text-gray-500 block truncate">{currentUser.email}</span>
                        <div className="mt-1">
                          <span className="badge-gold text-[0.65rem]">
                            ROLE: {currentUser.role}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 py-1 text-[0.65rem] uppercase text-gray-400 tracking-wider">
                        Navigation Portals
                      </div>

                      {currentUser.role === 'BUYER' && (
                        <button
                          onClick={() => { setActiveRole('BUYER'); setActiveTab('account'); setShowRoleDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-beige-light flex items-center gap-2 bg-transparent border-none cursor-pointer"
                        >
                          <User size={16} /> My Account & Orders
                        </button>
                      )}

                      {currentUser.role === 'SELLER' && (
                        <button
                          onClick={() => { setActiveRole('SELLER'); setActiveTab('seller-dashboard'); setShowRoleDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-beige-light flex items-center gap-2 bg-transparent border-none cursor-pointer"
                        >
                          <Store size={16} /> Merchant Portal
                        </button>
                      )}

                      {currentUser.role === 'ADMIN' && (
                        <button
                          onClick={() => { setActiveRole('ADMIN'); setActiveTab('admin-dashboard'); setShowRoleDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-beige-light flex items-center gap-2 bg-transparent border-none cursor-pointer"
                        >
                          <ShieldCheck size={16} /> Admin Control Panel
                        </button>
                      )}

                      <button
                        onClick={() => { onLogout(); setShowRoleDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1 bg-transparent cursor-pointer"
                      >
                        Logout Session
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay — Full 100vh Solid Opaque Beige Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[999] flex flex-col justify-between bg-[#FAF6F0] w-full h-full min-h-screen">
            {/* Top Bar with Logo & Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-[#E8E0D7] bg-[#FAF6F0] shrink-0">
              <Logo size="small" onClick={() => handleNavClick('home')} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-charcoal hover:text-gold transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Links List */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3 bg-[#FAF6F0]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left font-heading text-xl py-3 px-3 border-b border-black/5 bg-transparent cursor-pointer transition-colors ${
                    activeTab === link.id ? 'text-gold-dark font-semibold bg-gold/10 rounded-sm' : 'text-charcoal hover:text-gold'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-[#E8E0D7] flex flex-col gap-3 bg-[#FAF6F0] shrink-0">
              <button
                onClick={() => {
                  setActiveRole('SELLER');
                  setActiveTab('seller-register');
                  setIsMobileMenuOpen(false);
                }}
                className="btn-gold w-full text-xs py-3.5"
              >
                <Store size={15} /> Become a Merchant
              </button>
              {!currentUser && (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-outline w-full text-xs py-3.5"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
