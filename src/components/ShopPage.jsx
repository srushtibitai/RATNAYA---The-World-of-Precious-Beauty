import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, SELLERS } from '../data/marketplaceData';
import { Filter, SlidersHorizontal, Star, Heart, Eye, ShoppingBag, Store, X } from 'lucide-react';

export function ShopPage({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  productsList = PRODUCTS
}) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(selectedCategory || 'all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) return false;
      if (selectedSeller !== 'all' && p.sellerId !== selectedSeller) return false;
      if (selectedMetal !== 'all' && !p.metal.toLowerCase().includes(selectedMetal.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.isNew ? 1 : -1;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [activeCategoryFilter, selectedSeller, selectedMetal, maxPrice, sortBy, productsList]);

  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px', minHeight: '80vh' }}>
      {/* Shop Banner Header */}
      <div
        style={{
          backgroundColor: '#111111',
          color: '#FFFFFF',
          padding: '60px 0',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border-gold)'
        }}
      >
        <div className="container">
          <div style={{ fontSize: '0.78rem', color: '#C5A059', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Home / Shop Jewellery
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', fontFamily: "'Marcellus', serif" }}>
            The Luxury Jewellery Catalog
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#AAA', maxWidth: '540px', margin: '12px auto 0' }}>
            Explore 100% hallmarked gold, certified solitaires, and authentic Nizam Polki creations.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn-outline-gold mobile-filter-btn"
            style={{ display: 'none', gap: '8px' }}
          >
            <Filter size={16} /> Filters & Sorting
          </button>

          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> luxury creations
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                borderRadius: '2px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.85rem',
                color: 'var(--color-charcoal)'
              }}
            >
              <option value="featured">Featured Collection</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px' }} className="shop-layout-grid">
          {/* Left Desktop Sidebar Filter */}
          <aside className="shop-sidebar">
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontFamily: "'Marcellus', serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={18} color="var(--color-gold-dark)" /> Refine Search
                </h3>
                {(activeCategoryFilter !== 'all' || selectedSeller !== 'all' || selectedMetal !== 'all') && (
                  <button
                    onClick={() => {
                      setActiveCategoryFilter('all');
                      setSelectedSeller('all');
                      setSelectedMetal('all');
                      setMaxPrice(400000);
                    }}
                    style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 style={{ fontSize: '0.84rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--color-charcoal)' }}>
                  Jewellery Category
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="cat"
                      checked={activeCategoryFilter === 'all'}
                      onChange={() => setActiveCategoryFilter('all')}
                    />
                    All Categories
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="radio"
                        name="cat"
                        checked={activeCategoryFilter === cat.id}
                        onChange={() => setActiveCategoryFilter(cat.id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 style={{ fontSize: '0.84rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--color-charcoal)' }}>
                  Max Price: ₹{maxPrice.toLocaleString('en-IN')}
                </h4>
                <input
                  type="range"
                  min="50000"
                  max="400000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-gold)' }}
                />
              </div>

              {/* Metal Filter */}
              <div>
                <h4 style={{ fontSize: '0.84rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--color-charcoal)' }}>
                  Metal Type
                </h4>
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Metals</option>
                  <option value="22K Gold">22K Yellow Gold</option>
                  <option value="18K White Gold">18K White Gold</option>
                  <option value="18K Rose Gold">18K Rose Gold</option>
                </select>
              </div>

              {/* Seller Filter */}
              <div>
                <h4 style={{ fontSize: '0.84rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: 'var(--color-charcoal)' }}>
                  Filter by Jeweller / Seller
                </h4>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Verified Jewellers</option>
                  {SELLERS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Right Product Grid (4 items desktop) */}
          <main>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '60px',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px'
                }}
              >
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>
                  No Products Match Your Filter Criteria
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Try resetting your price slider or choosing a different jewellery category.
                </p>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setSelectedSeller('all');
                    setSelectedMetal('all');
                    setMaxPrice(400000);
                  }}
                  className="btn-gold"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {filteredProducts.map((prod) => (
                  <ShopProductCard
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
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .shop-layout-grid { grid-template-columns: 1fr !important; }
          .shop-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

function ShopProductCard({
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
