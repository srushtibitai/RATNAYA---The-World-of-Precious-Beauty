import React, { useState } from 'react';
import { MOCK_ORDERS } from '../data/marketplaceData';
import { User, Package, Heart, MapPin, CreditCard, Bell, LogOut, Truck, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

export function BuyerAccountPage({ wishlistItems, onAddToCart, onNavigateShop }) {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '60px 0 100px', minHeight: '80vh' }}>
      <div className="container">
        {/* Account Header */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '28px 36px',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--color-gold-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: '600',
                border: '1px solid var(--color-border-gold)'
              }}
            >
              PM
            </div>
            <div>
              <span className="eyebrow" style={{ marginBottom: '2px' }}>PATRON ACCOUNT</span>
              <h1 style={{ fontSize: '1.6rem', margin: 0, fontFamily: "'Marcellus', serif" }}>Priya Malhotra</h1>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>priya.m@gmail.com • +91 98201 44510</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--color-gold-dark)" /> Ratnaya VIP Gold Connoisseur
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="account-grid">
          {/* Left Navigation Sidebar */}
          <aside>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              {[
                { id: 'orders', label: 'My Orders & Tracking', icon: <Package size={18} /> },
                { id: 'wishlist', label: `Saved Wishlist (${wishlistItems.length})`, icon: <Heart size={18} /> },
                { id: 'profile', label: 'Personal Profile', icon: <User size={18} /> },
                { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
                { id: 'payments', label: 'Saved Payment Methods', icon: <CreditCard size={18} /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 20px',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: activeTab === item.id ? 'var(--bg-primary)' : 'transparent',
                    color: activeTab === item.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                    fontWeight: activeTab === item.id ? '600' : '400',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Main Panel */}
          <main>
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif" }}>My Orders</h3>

                {MOCK_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      padding: '24px'
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--color-border)',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#777', letterSpacing: '0.08em' }}>
                          ORDER ID: {ord.id}
                        </span>
                        <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                          Placed on {ord.date}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          className={`badge-status ${
                            ord.status === 'Delivered'
                              ? 'badge-approved'
                              : ord.status === 'Shipped'
                              ? 'badge-pending'
                              : 'badge-gold'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {ord.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <div>
                            <strong style={{ display: 'block' }}>{it.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#777' }}>Merchant: {it.sellerName}</span>
                          </div>
                          <span>₹{it.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Bar */}
                    <div
                      style={{
                        backgroundColor: '#FAF6F0',
                        padding: '12px 16px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={16} color="var(--color-gold-dark)" /> Tracking No: <strong>{ord.trackingNumber}</strong>
                      </span>
                      <span>Delivery Address: {ord.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                  Saved Wishlist Pieces
                </h3>
                {wishlistItems.length === 0 ? (
                  <div style={{ backgroundColor: '#FFFFFF', padding: '40px', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.95rem', color: '#777', marginBottom: '16px' }}>No items in wishlist yet.</p>
                    <button onClick={onNavigateShop} className="btn-gold">Explore Collections</button>
                  </div>
                ) : (
                  <div className="grid-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} style={{ backgroundColor: '#FFFFFF', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <img src={item.image || item.images?.[0]} alt={item.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '2px' }} />
                        <h4 style={{ fontSize: '0.92rem', margin: '8px 0 4px' }}>{item.name}</h4>
                        <div style={{ fontWeight: '600', marginBottom: '12px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                        <button onClick={() => onAddToCart(item)} className="btn-gold" style={{ width: '100%', padding: '8px', fontSize: '0.72rem' }}>
                          Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>Personal Profile Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#777' }}>Full Name</label>
                    <input type="text" defaultValue="Priya Malhotra" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#777' }}>Email Address</label>
                    <input type="email" defaultValue="priya.m@gmail.com" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#777' }}>Phone Number</label>
                    <input type="tel" defaultValue="+91 98201 44510" className="input-field" />
                  </div>
                </div>
                <button className="btn-gold" style={{ marginTop: '24px' }}>SAVE PROFILE UPDATES</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
