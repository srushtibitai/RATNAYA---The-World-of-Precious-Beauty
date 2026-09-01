import React, { useState } from 'react';
import { PRODUCTS, SELLERS, MOCK_ORDERS } from '../data/marketplaceData';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Store,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function SellerDashboardPage({ sellerId = 'seller-1' }) {
  const seller = SELLERS.find((s) => s.id === sellerId) || SELLERS[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerProductsList, setSellerProductsList] = useState(
    PRODUCTS.filter((p) => p.sellerId === seller.id)
  );

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'necklaces',
    categoryName: 'Necklaces',
    price: '',
    originalPrice: '',
    stock: 5,
    sku: `KJJ-NEW-${Math.floor(100 + Math.random() * 900)}`,
    metal: '22K Gold',
    purity: '22K BIS Hallmarked',
    weight: '35 grams',
    gemstone: 'Zambian Emerald',
    material: 'Yellow Gold & Gemstone',
    color: 'Gold & Green',
    size: '18 Inch',
    description: '',
    image: '/assets/jewellery/necklace/1.jpg'
  });

  const [productAddedSuccess, setProductAddedSuccess] = useState(false);

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const createdProduct = {
      id: `prod-${Date.now()}`,
      ...newProduct,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerRating: seller.rating,
      rating: 5.0,
      reviewsCount: 0,
      approvalStatus: 'Pending Approval', // Admin approval required!
      images: [newProduct.image]
    };

    setSellerProductsList([createdProduct, ...sellerProductsList]);
    setProductAddedSuccess(true);
    setTimeout(() => {
      setProductAddedSuccess(false);
      setActiveTab('products');
    }, 2000);
  };

  const totalRevenue = sellerProductsList.reduce((acc, p) => acc + p.price * 3, 0);

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '90vh', paddingBottom: '80px' }}>
      {/* Seller Header Bar */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={seller.logo}
                alt={seller.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C5A059' }}
              />
              <div>
                <span style={{ fontSize: '0.7rem', color: '#C5A059', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  MERCHANT DASHBOARD
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#FFF', fontFamily: "'Marcellus', serif", margin: 0 }}>
                  {seller.name}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge-gold">GST: {seller.gst}</span>
              <span className="badge-approved" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Account Approved
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }} className="seller-dashboard-layout">
          {/* Sidebar */}
          <aside>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              {[
                { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
                { id: 'products', label: `My Products (${sellerProductsList.length})`, icon: <Package size={18} /> },
                { id: 'add-product', label: 'Add New Product', icon: <PlusCircle size={18} /> },
                { id: 'orders', label: 'Merchant Orders', icon: <ShoppingBag size={18} /> },
                { id: 'earnings', label: 'Earnings & Payouts', icon: <DollarSign size={18} /> },
                { id: 'store-profile', label: 'Store Profile', icon: <Store size={18} /> }
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

          {/* Main Dashboard Content */}
          <main>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="metrics-grid">
                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Total Revenue</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-charcoal)', margin: '4px 0' }}>
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#137333' }}>+18.4% from last month</span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Total Orders</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-charcoal)', margin: '4px 0' }}>
                      24 Orders
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)' }}>3 Pending fulfillment</span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Active Products</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-charcoal)', margin: '4px 0' }}>
                      {sellerProductsList.length} Items
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#777' }}>1 Pending Admin Review</span>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Store Rating</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#D4AF37', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={20} fill="#D4AF37" /> {seller.rating}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#777' }}>Based on {seller.reviewsCount} reviews</span>
                  </div>
                </div>

                {/* Seller Products Table Preview */}
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontFamily: "'Marcellus', serif", marginBottom: '16px' }}>
                    Your Listed Jewellery Products
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: '#FAF6F0' }}>
                        <th style={{ padding: '12px' }}>Product</th>
                        <th style={{ padding: '12px' }}>SKU</th>
                        <th style={{ padding: '12px' }}>Price</th>
                        <th style={{ padding: '12px' }}>Stock</th>
                        <th style={{ padding: '12px' }}>Admin Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProductsList.map((prod) => (
                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={prod.images ? prod.images[0] : prod.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                            <div>
                              <strong style={{ display: 'block' }}>{prod.name}</strong>
                              <span style={{ fontSize: '0.74rem', color: '#888' }}>{prod.metal}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{prod.sku}</td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>₹{prod.price.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '12px' }}>{prod.stock}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge-status ${prod.approvalStatus === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                              {prod.approvalStatus || 'Approved'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MY PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: "'Marcellus', serif" }}>Managed Products</h3>
                  <button onClick={() => setActiveTab('add-product')} className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>
                    <PlusCircle size={15} /> Add New Piece
                  </button>
                </div>
                <div className="grid-3">
                  {sellerProductsList.map((p) => (
                    <div key={p.id} style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', padding: '12px' }}>
                      <img src={p.images ? p.images[0] : p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                      <div style={{ marginTop: '10px' }}>
                        <span className={`badge-status ${p.approvalStatus === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                          {p.approvalStatus || 'Approved'}
                        </span>
                        <h4 style={{ fontSize: '0.94rem', margin: '6px 0 4px' }}>{p.name}</h4>
                        <div style={{ fontWeight: '600' }}>₹{p.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADD PRODUCT FORM TAB */}
            {activeTab === 'add-product' && (
              <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '8px' }}>
                  Submit New Jewellery Product for Admin Approval
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Provide complete metal purity, weight, and gemstone specifications. Products are reviewed by Ratnaya compliance before appearing publicly.
                </p>

                {productAddedSuccess && (
                  <div style={{ backgroundColor: '#E6F4EA', color: '#137333', padding: '16px', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={20} /> Product submitted! Pending Admin Review.
                  </div>
                )}

                <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Kundan & Emerald Choker Set"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="necklaces">Necklaces</option>
                        <option value="rings">Rings</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="bangles">Bangles</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        placeholder="185000"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Metal Type</label>
                      <input
                        type="text"
                        value={newProduct.metal}
                        onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Purity (BIS Hallmark)</label>
                      <input
                        type="text"
                        value={newProduct.purity}
                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Gross Weight (grams)</label>
                      <input
                        type="text"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Gemstone / Polki Info</label>
                      <input
                        type="text"
                        value={newProduct.gemstone}
                        onChange={(e) => setNewProduct({ ...newProduct, gemstone: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Product Description</label>
                      <textarea
                        rows={4}
                        placeholder="Detail the craftsmanship, Meenakari work, gold purity, and design inspiration..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold" style={{ padding: '14px' }}>
                    SUBMIT PRODUCT FOR ADMIN APPROVAL
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .seller-dashboard-layout { grid-template-columns: 1fr !important; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
