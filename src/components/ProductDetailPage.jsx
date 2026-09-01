import React, { useState } from 'react';
import { SELLERS, PRODUCTS } from '../data/marketplaceData';
import {
  Star,
  Heart,
  ShoppingBag,
  Store,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Share2
} from 'lucide-react';

export function ProductDetailPage({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onCheckoutDirect,
  onViewSellerStore,
  onSelectProduct
}) {
  if (!product) return null;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);

  const images = product.images || [product.image];
  const seller = SELLERS.find((s) => s.id === product.sellerId) || {
    name: product.sellerName,
    city: 'Jaipur, Rajasthan',
    rating: product.sellerRating || 4.9,
    verified: true
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px' }}>
      {/* Toast Notification */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: '4px',
            boxShadow: 'var(--shadow-medium)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--color-gold)'
          }}
        >
          <CheckCircle2 color="var(--color-gold)" size={20} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem' }}>Added to Shopping Bag</strong>
            <span style={{ fontSize: '0.78rem', color: '#CCC' }}>{product.name} ({quantity} qty)</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '14px 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <span>Home</span> <ChevronRight size={12} />
            <span>Shop</span> <ChevronRight size={12} />
            <span>{product.categoryName}</span> <ChevronRight size={12} />
            <span style={{ color: 'var(--color-charcoal)', fontWeight: '500' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '50px',
            backgroundColor: '#FFFFFF',
            padding: '36px',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            boxShadow: 'var(--shadow-subtle)'
          }}
          className="pdp-main-grid"
        >
          {/* LEFT: GALLERY */}
          <div>
            <div
              style={{
                aspectRatio: '1/1',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#FAF8F5',
                position: 'relative',
                marginBottom: '16px',
                border: '1px solid var(--color-border)'
              }}
            >
              <img
                src={images[selectedImageIdx]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.discountPercent > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'var(--color-gold)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '4px 12px',
                    letterSpacing: '0.1em'
                  }}
                >
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImageIdx === idx ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                      opacity: selectedImageIdx === idx ? 1 : 0.6
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div>
            {/* Seller Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span className="eyebrow" style={{ marginBottom: 0 }}>
                SKU: {product.sku}
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#137333',
                  backgroundColor: '#E6F4EA',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              >
                In Stock ({product.stock} pieces remaining)
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', marginBottom: '12px', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Pricing */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '24px'
              }}
            >
              <span
                style={{
                  fontSize: '2.2rem',
                  fontWeight: '600',
                  color: 'var(--color-charcoal)',
                  fontFamily: "'Marcellus', serif"
                }}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>
                (Inclusive of 3% GST & Insured Shipping)
              </span>
            </div>

            {/* Seller Information Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--color-border-gold)',
                padding: '16px 20px',
                borderRadius: '4px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Store size={22} color="var(--color-gold-dark)" />
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-brown-muted)', letterSpacing: '0.08em' }}>
                    Authentic Merchant
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: '600', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {product.sellerName} <ShieldCheck size={14} color="var(--color-gold)" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => onViewSellerStore(product.sellerId)}
                className="btn-outline-gold"
                style={{ padding: '6px 14px', fontSize: '0.72rem' }}
              >
                View Store
              </button>
            </div>

            {/* Product Specifications Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                backgroundColor: '#FFFFFF',
                padding: '16px',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                marginBottom: '28px',
                fontSize: '0.84rem'
              }}
            >
              <div><strong>Metal Type:</strong> {product.metal}</div>
              <div><strong>Purity:</strong> {product.purity}</div>
              <div><strong>Gross Weight:</strong> {product.weight}</div>
              <div><strong>Gemstone:</strong> {product.gemstone}</div>
              <div><strong>Size/Fit:</strong> {product.size}</div>
              <div><strong>Color:</strong> {product.color}</div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500' }}>
                Quantity:
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: '2px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 14px', color: 'var(--color-charcoal)' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 16px', fontSize: '0.95rem', fontWeight: '600' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '8px 14px', color: 'var(--color-charcoal)' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
              <button
                onClick={handleAddToCart}
                className="btn-gold"
                style={{ flex: 1, padding: '16px' }}
              >
                <ShoppingBag size={18} /> ADD TO CART
              </button>

              <button
                onClick={() => {
                  onAddToCart({ ...product, quantity });
                  onCheckoutDirect();
                }}
                className="btn-dark"
                style={{ flex: 1, padding: '16px' }}
              >
                BUY NOW
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  width: '52px',
                  height: '52px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: isWishlisted ? '#FCE8E6' : '#FFFFFF',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isWishlisted ? '#D93838' : 'var(--color-charcoal)'
                }}
                title="Wishlist"
              >
                <Heart size={22} fill={isWishlisted ? '#D93838' : 'none'} color={isWishlisted ? '#D93838' : '#111'} />
              </button>
            </div>

            {/* Authenticity Info Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                textAlign: 'center'
              }}
            >
              <div style={{ padding: '8px' }}>
                <Award size={20} color="var(--color-gold-dark)" style={{ marginBottom: '4px' }} />
                <div>BIS 22K/18K Hallmark</div>
              </div>
              <div style={{ padding: '8px' }}>
                <Truck size={20} color="var(--color-gold-dark)" style={{ marginBottom: '4px' }} />
                <div>Insured Free Shipping</div>
              </div>
              <div style={{ padding: '8px' }}>
                <RotateCcw size={20} color="var(--color-gold-dark)" style={{ marginBottom: '4px' }} />
                <div>14-Day Return Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABBED DETAILS & SPECS */}
        <div
          style={{
            marginTop: '50px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          {/* Tab Headers */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAF6F0' }}>
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications & Purity' },
              { id: 'seller', label: 'Seller & Creator Info' },
              { id: 'shipping', label: 'Shipping & Authenticity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 28px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: activeTab === tab.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                  backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div style={{ padding: '36px' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Craftsmanship & Story</h3>
                <p style={{ fontSize: '0.98rem', color: 'var(--color-text-main)', lineHeight: 1.8, maxWidth: '800px' }}>
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div style={{ maxWidth: '650px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Technical Metal & Gemstone Specs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {product.specifications?.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: i % 2 === 0 ? '#FAF6F0' : '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ fontWeight: '500', color: 'var(--color-charcoal)' }}>{spec.label}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{seller.name}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '2px 0' }}>
                      {seller.city} • Verified Jewellery Artisan
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#D4AF37' }}>
                      <Star size={14} fill="#D4AF37" /> {seller.rating} rating
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                  {seller.about || 'Specialized in hand-crafted gold, diamond, and Kundan creations with certified authenticity.'}
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ maxWidth: '750px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Guaranteed Authenticity & Insured Transit</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                  <li>All gold jewellery items are BIS 916 (22K) or 750 (18K) hallmarked with unique HUID codes.</li>
                  <li>Solitaire diamonds and precious gemstones come accompanied by GIA, IGI, or SGL certificates.</li>
                  <li>Shipments are fully insured against transit damage or loss, packaged in tamper-proof video-recorded security bags.</li>
                  <li>Free 14-day return window with full refund or store exchange.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '70px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '28px', fontFamily: "'Marcellus', serif" }}>
              You May Also Admire
            </h2>
            <div className="grid-4">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="product-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-wrap">
                    <img src={p.images ? p.images[0] : p.image} alt={p.name} className="product-image-primary" />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                      {p.sellerName}
                    </div>
                    <h4 style={{ fontSize: '0.96rem', margin: '4px 0 8px' }}>{p.name}</h4>
                    <div style={{ fontWeight: '600' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .pdp-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
