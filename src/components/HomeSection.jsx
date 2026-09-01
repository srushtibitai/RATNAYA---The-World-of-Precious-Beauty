import React, { useState } from 'react';
import { HeroSlider } from './HeroSlider';
import { BrandStatementSection } from './BrandStatementSection';
import { JewelleryVideoAccordionSection } from './JewelleryVideoAccordionSection';
import { CountdownDeal } from './CountdownDeal';
import {
  CATEGORIES,
  PRODUCTS,
  TESTIMONIALS
} from '../data/marketplaceData';
import {
  ArrowRight,
  Heart,
  Eye,
  ShoppingBag,
  Star,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Lock,
  Store,
  CheckCircle2,
  Mail,
  Sparkles
} from 'lucide-react';

export function HomeSection({
  onSelectCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onNavigateShop,
  onNavigateAbout,
  onBecomeSeller,
  onSellerLogin
}) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const newArrivals = PRODUCTS.slice(0, 8); // 8 Swarna showcase products

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput('');
      }, 4000);
    }
  };

  return (
    <div className="ratnaya-homepage">
      {/* SECTION 1 — HERO SLIDER */}
      <HeroSlider onNavigateShop={onNavigateShop} />

      {/* SECTION 2 — SWARNA STATEMENT & BRAND VALUES */}
      <BrandStatementSection />

      {/* SECTION 3 — 4-COLUMN INTERACTIVE VIDEO ACCORDION */}
      <JewelleryVideoAccordionSection onSelectCategory={onSelectCategory} onNavigateShop={onNavigateShop} />

      {/* SECTION 2 — INTRO / BRAND STORY */}
      <section
        id="section-brand"
        style={{
          padding: '100px 0',
          backgroundColor: '#FAF6F0',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center'
            }}
            className="brand-intro-grid"
          >
            <div>
              <span className="eyebrow">TIMELESS SOPHISTICATION</span>
              <h2 className="section-title">"Jewellery Designed to Become Part of Your Story"</h2>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                  fontWeight: '300'
                }}
              >
                Ratnaya brings together centuries of royal Indian goldsmithing, certified diamond craftsmanship, and contemporary elegance under one canopy.
              </p>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-main)',
                  lineHeight: 1.8,
                  marginBottom: '32px'
                }}
              >
                Connecting discerning patrons directly with trusted independent jewellers from Jaipur, Mumbai, Hyderabad, and Kolkata, every piece is accompanied by 6-digit HUID BIS hallmarking and international certificates.
              </p>
              <button onClick={onNavigateAbout} className="btn-outline-gold" style={{ padding: '14px 36px' }}>
                KNOW MORE <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  aspectRatio: '4/3',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-medium)',
                  border: '1px solid var(--color-border-gold)'
                }}
              >
                <img
                  src="/assets/jewellery/necklace/videoframe_3765.png"
                  alt="Jewellery Designed to Become Part of Your Story"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  width: '100%',
                  height: '100%',
                  border: '1px solid var(--color-gold)',
                  zIndex: -1,
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURE / BENEFITS */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '24px',
              textAlign: 'center'
            }}
            className="why-ratnaya-grid"
          >
            <div style={{ padding: '24px 16px' }}>
              <Store size={36} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Trusted Sellers</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Vetted heritage goldsmiths and ateliers</p>
            </div>
            <div style={{ padding: '24px 16px' }}>
              <Award size={36} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Authentic Jewellery</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>100% BIS Hallmarked & Certified Solitaires</p>
            </div>
            <div style={{ padding: '24px 16px' }}>
              <Lock size={36} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Secure Payments</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Encrypted UPI, Cards & Net Banking</p>
            </div>
            <div style={{ padding: '24px 16px' }}>
              <Truck size={36} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Fast Shipping</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Insured tamper-proof express delivery</p>
            </div>
            <div style={{ padding: '24px 16px' }}>
              <RotateCcw size={36} color="var(--color-gold-dark)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Easy Returns</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>14-day hassle-free return guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — JEWELLERY CATEGORIES */}
      <section style={{ padding: '100px 0', backgroundColor: '#FAF6F0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">CURATED SELECTION</span>
            <h2 className="section-title">Jewellery Categories</h2>
            <p className="section-subtitle">
              Discover exquisitely designed creations suited for every occasion
            </p>
          </div>

          <div className="grid-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1.1',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)'
                }}
                className="category-card"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                  className="cat-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.1) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '28px',
                    color: '#FFFFFF'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#E5C888', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {cat.count}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: '4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#DDD', margin: '4px 0 10px' }}>{cat.description}</p>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#C5A059',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '600'
                    }}
                  >
                    Explore Collection →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — NEW ARRIVALS */}
      <section id="section-new-arrivals" style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">JUST ADDED</span>
            <h2 className="section-title">New Arrivals, Endless Choices</h2>
            <p className="section-subtitle">
              Discover the latest creations handcrafted by our verified jewellers
            </p>
          </div>

          <div className="grid-4">
            {newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — DEAL / PROMOTIONAL BANNER WITH COUNTDOWN */}
      <CountdownDeal onNavigateShop={onNavigateShop} />

      {/* SECTION 7 — NECKLACE FEATURE */}
      <section style={{ padding: '100px 0', backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="brand-intro-grid">
            <div style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border-gold)' }}>
              <img src="/assets/jewellery/necklace/1.jpg" alt="Radiate Beauty With Necklaces" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <span className="eyebrow">ROYAL NECKLACE COLLECTION</span>
              <h2 className="section-title">Radiate Beauty With Necklaces</h2>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-gold-dark)', fontWeight: '400', marginBottom: '16px', fontFamily: "'Marcellus', serif" }}>
                "A Symbol of Love, Beauty and Sophistication"
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                Adorn your neck with royal Kundan chokers, Basra pearl strands, and glowing Zambian emerald haar crafted for grand wedding celebrations.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={onNavigateAbout} className="btn-outline">KNOW MORE</button>
                <button onClick={onNavigateShop} className="btn-gold">SHOP NOW <ArrowRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — BRACELET FEATURE */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="brand-intro-grid">
            <div>
              <span className="eyebrow">WRISTWEAR ESSENTIALS</span>
              <h2 className="section-title">Unleash Your Style With Our Unique Bracelets</h2>
              <p style={{ fontSize: '0.96rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                From continuous 18K rose gold tennis diamond strands to handcrafted Bengali filigree gold bangles, elevate every gesture with luxury.
              </p>
              <button onClick={onNavigateShop} className="btn-gold" style={{ padding: '16px 36px' }}>
                SHOP NOW <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border-gold)' }}>
              <img src="/assets/jewellery/bracelet/1.jpg" alt="Unique Bracelets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — PRODUCT COLLECTION */}
      <section style={{ padding: '100px 0', backgroundColor: '#FAF6F0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">SIGNATURE SELECTION</span>
            <h2 className="section-title">Your Style, Our Collection</h2>
          </div>

          <div className="grid-4">
            {PRODUCTS.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(prod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — TESTIMONIALS */}
      <section style={{ padding: '100px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">HAPPY PATRONS</span>
            <h2 className="section-title">Joyful Moments, Told</h2>
          </div>

          <div className="grid-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#FAF6F0',
                  padding: '32px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', color: '#D4AF37', marginBottom: '16px' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#D4AF37" stroke="#D4AF37" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
                    "{t.comment}"
                  </p>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>{t.name}</h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — NEWSLETTER */}
      <section style={{ padding: '80px 0', backgroundColor: '#FAF6F0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <Mail size={32} color="var(--color-gold-dark)" style={{ marginBottom: '12px' }} />
          <span className="eyebrow">JOIN THE CIRCLE</span>
          <h2 className="section-title">Stay Informed, Always</h2>
          <p className="section-subtitle" style={{ marginBottom: '32px' }}>
            Discover new collections, exclusive pieces and special offers from Ratnaya.
          </p>

          {subscribed ? (
            <div style={{ backgroundColor: '#E6F4EA', color: '#137333', padding: '16px', borderRadius: '4px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Thank you for subscribing to Ratnaya updates!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="input-field"
                style={{ flex: 1, backgroundColor: '#FFFFFF' }}
              />
              <button type="submit" className="btn-gold" style={{ padding: '12px 28px' }}>
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .category-card:hover .cat-img { transform: scale(1.08); }
        @media (max-width: 992px) {
          .brand-intro-grid { grid-template-columns: 1fr !important; }
          .why-ratnaya-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function ProductCard({
  product,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.images ? product.images[0] : product.image}
          alt={product.name}
          className="product-image-primary"
        />
        {product.images && product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="product-image-secondary"
          />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          title="Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? '#D93838' : 'none'} color={isWishlisted ? '#D93838' : '#111'} />
        </button>

        <div className="product-actions-overlay">
          <button
            onClick={() => onQuickView(product)}
            className="btn-outline"
            style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '8px 12px', fontSize: '0.72rem' }}
          >
            <Eye size={14} /> Quick View
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="btn-gold"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.72rem' }}
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span className="seller-badge"><Store size={12} /> {product.sellerName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: '#D4AF37' }}>
              <Star size={12} fill="#D4AF37" /> {product.rating}
            </div>
          </div>
          <h3
            onClick={() => onSelectProduct(product)}
            style={{ fontSize: '0.98rem', fontWeight: '400', cursor: 'pointer', lineHeight: 1.3, marginBottom: '8px' }}
          >
            {product.name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-charcoal)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#999' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
