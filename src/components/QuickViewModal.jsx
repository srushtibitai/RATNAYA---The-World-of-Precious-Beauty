import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Store, ShieldCheck, Check } from 'lucide-react';

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onViewFullDetail,
  onViewSellerStore
}) {
  if (!isOpen || !product) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#FAF6F0',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-medium)',
          border: '1px solid var(--color-border-gold)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxHeight: '90vh'
        }}
        className="quickview-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <X size={20} color="var(--color-charcoal)" />
        </button>

        {/* Left Image Section */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
            <img
              src={product.images ? product.images[selectedImgIndex] : product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.discountPercent > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--color-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '4px 10px',
                  letterSpacing: '0.08em'
                }}
              >
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImgIndex === idx ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                    opacity: selectedImgIndex === idx ? 1 : 0.6
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div style={{ padding: '32px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Category & Seller */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="eyebrow" style={{ marginBottom: 0 }}>{product.categoryName}</span>
              <button
                onClick={() => {
                  onClose();
                  onViewSellerStore(product.sellerId);
                }}
                style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}
              >
                <Store size={13} /> {product.sellerName} <ShieldCheck size={12} color="var(--color-gold)" />
              </button>
            </div>

            <h2 style={{ fontSize: '1.45rem', marginBottom: '12px' }}>{product.name}</h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-charcoal)', fontFamily: "'Marcellus', serif" }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.95rem' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Quick Specs */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                <div><strong>Metal:</strong> {product.metal}</div>
                <div><strong>Purity:</strong> {product.purity}</div>
                <div><strong>Weight:</strong> {product.weight}</div>
                <div><strong>Gemstone:</strong> {product.gemstone}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="btn-gold"
                style={{ flex: 1 }}
              >
                <ShoppingBag size={16} /> ADD TO CART
              </button>

              <button
                onClick={() => onAddToWishlist(product)}
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: isWishlisted ? '#FCE8E6' : '#FFFFFF',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWishlisted ? '#D93838' : 'var(--color-charcoal)'
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#D93838' : 'none'} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onViewFullDetail(product);
              }}
              style={{
                fontSize: '0.8rem',
                textAlign: 'center',
                color: 'var(--color-gold-dark)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '600',
                padding: '8px'
              }}
            >
              View Full Product Details & Authenticity →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .quickview-container {
            grid-template-columns: 1fr !important;
            max-height: 95vh !overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
