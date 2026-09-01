import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 210,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FAF6F0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-drawer)',
          animation: 'slideLeft 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={20} color="#D93838" fill="#D93838" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Wishlist</h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--color-gold-dark)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: '600'
              }}
            >
              {wishlistItems.length}
            </span>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: 'var(--color-charcoal)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {wishlistItems.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-text-muted)'
              }}
            >
              <Heart size={48} strokeWidth={1} color="var(--color-gold)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your Wishlist is Empty</h4>
              <p style={{ fontSize: '0.86rem', maxWidth: '280px', marginBottom: '24px' }}>
                Save your favorite luxury pieces by tapping the heart icon while browsing.
              </p>
              <button onClick={onClose} className="btn-gold">
                EXPLORE COLLECTIONS
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px'
                  }}
                >
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-brown-muted)' }}>
                        {item.sellerName}
                      </div>
                      <h4 style={{ fontSize: '0.92rem', margin: '2px 0 4px', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-charcoal)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveWishlist(item.id);
                        }}
                        className="btn-outline-gold"
                        style={{ padding: '6px 12px', fontSize: '0.72rem', flex: 1 }}
                      >
                        <ShoppingBag size={13} /> Add To Bag
                      </button>

                      <button
                        onClick={() => onRemoveWishlist(item.id)}
                        style={{ color: '#999', padding: '6px' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
