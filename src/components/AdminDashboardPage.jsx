import React, { useState } from 'react';
import {
  SELLERS,
  PRODUCTS,
  MOCK_ORDERS,
  MOCK_PENDING_SELLERS,
  MOCK_PENDING_PRODUCTS
} from '../data/marketplaceData';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Sliders,
  Award,
  ChevronRight
} from 'lucide-react';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Admin state management for approvals & commissions
  const [pendingSellers, setPendingSellers] = useState(MOCK_PENDING_SELLERS);
  const [approvedSellersCount, setApprovedSellersCount] = useState(SELLERS.length);
  const [pendingProducts, setPendingProducts] = useState(MOCK_PENDING_PRODUCTS);
  const [approvedProductsCount, setApprovedProductsCount] = useState(PRODUCTS.length);
  const [globalCommission, setGlobalCommission] = useState(10); // 10% default marketplace commission

  const handleApproveSeller = (id) => {
    setPendingSellers(pendingSellers.filter((s) => s.id !== id));
    setApprovedSellersCount((prev) => prev + 1);
  };

  const handleApproveProduct = (id) => {
    setPendingProducts(pendingProducts.filter((p) => p.id !== id));
    setApprovedProductsCount((prev) => prev + 1);
  };

  const totalMarketplaceRevenue = 1450000;
  const platformCommissionEarned = Math.round(totalMarketplaceRevenue * (globalCommission / 100));
  const sellerPayoutTotal = totalMarketplaceRevenue - platformCommissionEarned;

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '90vh', paddingBottom: '80px' }}>
      {/* Admin Header Bar */}
      <div
        style={{
          backgroundColor: '#111111',
          color: '#FFFFFF',
          padding: '24px 0',
          borderBottom: '1px solid var(--color-border-gold)'
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                  border: '1px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C5A059'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#C5A059', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  CENTRAL GOVERNANCE
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#FFF', fontFamily: "'Marcellus', serif", margin: 0 }}>
                  Ratnaya Admin Control Panel
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge-gold">Platform Commission: {globalCommission}%</span>
              <span className="badge-approved" style={{ fontSize: '0.75rem' }}>Super Admin System Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }} className="admin-dashboard-layout">
          {/* Admin Sidebar Navigation */}
          <aside>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              {[
                { id: 'overview', label: 'Platform Overview', icon: <TrendingUp size={18} /> },
                { id: 'seller-approvals', label: `Seller Approvals (${pendingSellers.length})`, icon: <Store size={18} /> },
                { id: 'product-approvals', label: `Product Approvals (${pendingProducts.length})`, icon: <Package size={18} /> },
                { id: 'commission', label: 'Commissions & Payouts', icon: <DollarSign size={18} /> },
                { id: 'orders', label: 'All Orders & Logistics', icon: <ShoppingBag size={18} /> },
                { id: 'sellers', label: `Verified Jewellers (${approvedSellersCount})`, icon: <Users size={18} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 18px',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Admin Main Body */}
          <main>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="metrics-grid">
                  <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Gross Marketplace Volume</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--color-charcoal)', margin: '4px 0', fontFamily: "'Marcellus', serif" }}>
                      ₹{totalMarketplaceRevenue.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#137333' }}>+24.2% Growth YTD</span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Ratnaya Platform Cut ({globalCommission}%)</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--color-gold-dark)', margin: '4px 0', fontFamily: "'Marcellus', serif" }}>
                      ₹{platformCommissionEarned.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#777' }}>Net Platform Revenue</span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Pending Approvals</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#B06000', margin: '4px 0', fontFamily: "'Marcellus', serif" }}>
                      {pendingSellers.length + pendingProducts.length} Items
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#B06000' }}>Requires Compliance Action</span>
                  </div>
                </div>

                {/* Seller Approvals Action Table Preview */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: "'Marcellus', serif", marginBottom: '16px' }}>
                    Pending Jeweller Approvals
                  </h3>
                  {pendingSellers.length === 0 ? (
                    <p style={{ fontSize: '0.9rem', color: '#777' }}>All seller applications verified and cleared!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {pendingSellers.map((s) => (
                        <div
                          key={s.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                            backgroundColor: '#FAF6F0',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '1.05rem', display: 'block' }}>{s.businessName}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                              Owner: {s.ownerName} • GST: {s.gst} • {s.city}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleApproveSeller(s.id)}
                              className="btn-gold"
                              style={{ padding: '8px 16px', fontSize: '0.74rem' }}
                            >
                              <CheckCircle2 size={14} /> APPROVE SELLER
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLER APPROVALS TAB */}
            {activeTab === 'seller-approvals' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                  Seller KYC & Business Applications
                </h3>
                {pendingSellers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
                    No pending seller applications at this time.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pendingSellers.map((s) => (
                      <div key={s.id} style={{ padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{s.businessName}</h4>
                          <span className="badge-status badge-pending">Pending Review</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
                          Owner: {s.ownerName} | Email: {s.email} | Phone: {s.phone} | GST: {s.gst}
                        </p>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', marginBottom: '16px' }}>
                          Uploaded Documents: {s.kycDocuments.join(', ')}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => handleApproveSeller(s.id)} className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.74rem' }}>
                            APPROVE SELLER
                          </button>
                          <button onClick={() => handleApproveSeller(s.id)} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.74rem' }}>
                            REJECT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCT APPROVALS TAB */}
            {activeTab === 'product-approvals' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                  Seller Product Submission Queue
                </h3>
                {pendingProducts.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
                    No products awaiting approval.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pendingProducts.map((p) => (
                      <div key={p.id} style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', alignItems: 'center' }}>
                        <img src={p.image} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '1rem', display: 'block' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            Submitted by <strong>{p.sellerName}</strong> • Price: ₹{p.price.toLocaleString('en-IN')} • Metal: {p.metal}
                          </span>
                        </div>
                        <button onClick={() => handleApproveProduct(p.id)} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.74rem' }}>
                          APPROVE & PUBLISH
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMMISSION & PAYOUTS TAB */}
            {activeTab === 'commission' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '16px' }}>
                  Marketplace Commission Configuration
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Set global commission rates or configure seller-specific commission percentages.
                </p>

                <div style={{ backgroundColor: '#FAF6F0', padding: '24px', borderRadius: '4px', marginBottom: '28px', maxWidth: '500px' }}>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '8px' }}>
                    Global Ratnaya Marketplace Commission (%)
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      value={globalCommission}
                      onChange={(e) => setGlobalCommission(Number(e.target.value))}
                      className="input-field"
                    />
                    <button className="btn-gold">SAVE COMMISSION</button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Commission Calculation Breakdown</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <span>Gross Sales:</span> <strong>₹{totalMarketplaceRevenue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <span>Ratnaya Commission Cut ({globalCommission}%):</span> <strong style={{ color: 'var(--color-gold-dark)' }}>₹{platformCommissionEarned.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', gridColumn: 'span 2' }}>
                    <span>Total Payout Payable to Verified Jewellers:</span> <strong>₹{sellerPayoutTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-dashboard-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
