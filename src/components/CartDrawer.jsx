import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03); // 3% GST on jewellery
  const total = subtotal + gst;

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
          maxWidth: '460px',
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
            <ShoppingBag size={20} color="var(--color-gold-dark)" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Shopping Bag</h3>
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
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', color: 'var(--color-charcoal)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Content List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
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
              <ShoppingBag size={48} strokeWidth={1} color="var(--color-gold)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your Shopping Bag is Empty</h4>
              <p style={{ fontSize: '0.86rem', maxWidth: '280px', marginBottom: '24px' }}>
                Explore our handpicked collection of royal gold, diamond, and Kundan creations.
              </p>
              <button onClick={onClose} className="btn-gold">
                EXPLORE JEWELLERY
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
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
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-brown-muted)', textTransform: 'uppercase' }}>
                        Sold by {item.sellerName}
                      </div>
                      <h4 style={{ fontSize: '0.94rem', margin: '2px 0 4px', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-charcoal)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      {/* Qty Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: '2px'
                        }}
                      >
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          style={{ padding: '4px 8px', color: 'var(--color-charcoal)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          style={{ padding: '4px 8px', color: 'var(--color-charcoal)' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ color: '#C5221F', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              <span>3% Jewellery GST Tax</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#137333' }}>
              <span>Insured Shipping</span>
              <span>FREE</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: '600',
                color: 'var(--color-charcoal)',
                paddingTop: '10px',
                borderTop: '1px dashed var(--color-border)',
                fontFamily: "'Marcellus', serif"
              }}
            >
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="btn-gold"
              style={{ width: '100%', marginTop: '8px', padding: '16px' }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={16} />
            </button>

            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={14} color="var(--color-gold)" /> 100% Insured Delivery & BIS Hallmarked Authentic Guarantee
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
