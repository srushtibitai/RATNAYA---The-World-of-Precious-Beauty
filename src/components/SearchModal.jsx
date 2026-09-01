import React, { useState } from 'react';
import { Search, X, ArrowRight, Store } from 'lucide-react';
import { PRODUCTS } from '../data/marketplaceData';

export function SearchModal({ isOpen, onClose, onSelectProduct, onNavigateShop }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.sellerName.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.gemstone.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = ['Kundan Haar', 'Solitaire Ring', 'Emerald Choker', 'Basra Pearl', '22K Gold Bangle'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '750px',
          backgroundColor: '#FAF6F0',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-medium)',
          overflow: 'hidden',
          border: '1px solid var(--color-border-gold)'
        }}
      >
        {/* Search Header Input Bar */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Search size={22} color="var(--color-gold-dark)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by jewellery name, category, seller, material..."
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: "'Marcellus', serif",
              fontSize: '1.2rem',
              color: 'var(--color-charcoal)',
              backgroundColor: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ fontSize: '0.75rem', color: '#999', padding: '4px 8px' }}
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              color: 'var(--color-charcoal)',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {query.trim() === '' ? (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--color-gold-dark)',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}
              >
                Popular Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '20px',
                      fontSize: '0.84rem',
                      color: 'var(--color-text-main)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    🔍 {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--color-gold-dark)',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}
              >
                Search Results ({filteredProducts.length})
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                  <p style={{ fontFamily: "'Marcellus', serif", fontSize: '1.2rem', marginBottom: '8px' }}>
                    No luxury pieces found for "{query}"
                  </p>
                  <p style={{ fontSize: '0.88rem' }}>Try searching for Kundan, Solitaire, Emerald, or Bangle</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      className="hover:border-gold"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>
                          {prod.categoryName} • {prod.metal}
                        </div>
                        <h4 style={{ fontSize: '1.05rem', margin: '2px 0' }}>{prod.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Store size={12} /> {prod.sellerName}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: 'var(--color-charcoal)' }}>
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)' }}>
                          View Piece →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
