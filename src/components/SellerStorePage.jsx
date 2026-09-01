import React, { useState } from 'react';
import { SELLERS, PRODUCTS } from '../data/marketplaceData';
import { ShieldCheck, Star, MapPin, Calendar, Heart, Eye, ShoppingBag, Store, Check } from 'lucide-react';

export function SellerStorePage({
  sellerId,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}) {
  const seller = SELLERS.find((s) => s.id === sellerId) || SELLERS[0];
  const sellerProducts = PRODUCTS.filter((p) => p.sellerId === seller.id);
  const [activeTab, setActiveTab] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);

  const displayedProducts = sellerProducts.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px', minHeight: '80vh' }}>
      {/* Seller Header Hero Banner */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          backgroundImage: `url(${seller.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17, 17, 17, 0.65)' }} />
      </div>

      <div className="container" style={{ marginTop: '-70px', position: 'relative', zIndex: 10 }}>
        {/* Seller Info Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border-gold)',
            borderRadius: '4px',
            padding: '32px',
            boxShadow: 'var(--shadow-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img
              src={seller.logo}
              alt={seller.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.8rem', fontFamily: "'Marcellus', serif" }}>{seller.name}</h1>
                {seller.verified && (
                  <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="var(--color-gold-dark)" /> Verified Jeweller
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {seller.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37', fontWeight: '600' }}>
                  <Star size={14} fill="#D4AF37" /> {seller.rating} ({seller.reviewsCount} reviews)
                </span>
                <span>{seller.productsCount} Total Pieces</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', marginTop: '10px', maxWidth: '600px' }}>
                {seller.about}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={isFollowing ? 'btn-outline' : 'btn-gold'}
            style={{ padding: '12px 28px' }}
          >
            {isFollowing ? <><Check size={16} /> Following Store</> : <><Store size={16} /> Follow Store</>}
          </button>
        </div>

        {/* Store Tabs */}
        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          {[
            { id: 'all', label: `All Pieces (${sellerProducts.length})` },
            { id: 'necklaces', label: 'Necklaces' },
            { id: 'rings', label: 'Rings' },
            { id: 'bangles', label: 'Bangles & Bracelets' },
            { id: 'reviews', label: `Store Reviews (${seller.reviewsCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                fontSize: '0.86rem',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: activeTab === tab.id ? '600' : '400',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: activeTab === tab.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Store Products Grid */}
        <div style={{ paddingTop: '32px' }}>
          {activeTab === 'reviews' ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                Verified Buyer Reviews for {seller.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Ananya S.', date: 'August 2026', comment: 'Authentic 22K Kundan work! Packaging was top-notch and delivery came within 3 days.' },
                  { name: 'Rajesh K.', date: 'July 2026', comment: 'Bought diamond solitaire engagement ring. GIA certificate matched perfectly.' }
                ].map((r, idx) => (
                  <div key={idx} style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', color: '#D4AF37', marginBottom: '4px' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#D4AF37" stroke="#D4AF37" />)}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>"{r.comment}"</p>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '6px' }}>{r.name} — {r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid-4">
              {displayedProducts.map((prod) => (
                <div key={prod.id} className="product-card">
                  <div className="product-image-wrap">
                    <img src={prod.images ? prod.images[0] : prod.image} alt={prod.name} className="product-image-primary" />
                    <button
                      onClick={() => onToggleWishlist(prod)}
                      className={`wishlist-btn ${wishlistIds.includes(prod.id) ? 'active' : ''}`}
                    >
                      <Heart size={18} fill={wishlistIds.includes(prod.id) ? '#D93838' : 'none'} color={wishlistIds.includes(prod.id) ? '#D93838' : '#111'} />
                    </button>
                    <div className="product-actions-overlay">
                      <button onClick={() => onQuickView(prod)} className="btn-outline" style={{ flex: 1, backgroundColor: '#FFF', padding: '8px', fontSize: '0.72rem' }}>
                        <Eye size={14} /> Quick View
                      </button>
                      <button onClick={() => onAddToCart(prod)} className="btn-gold" style={{ flex: 1, padding: '8px', fontSize: '0.72rem' }}>
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 onClick={() => onSelectProduct(prod)} style={{ fontSize: '0.96rem', fontWeight: '400', cursor: 'pointer', marginBottom: '6px' }}>
                      {prod.name}
                    </h3>
                    <div style={{ fontWeight: '600' }}>₹{prod.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
