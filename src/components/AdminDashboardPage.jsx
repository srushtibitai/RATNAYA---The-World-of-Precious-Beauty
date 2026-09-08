import React, { useState, useEffect } from 'react';
import {
  SELLERS as INITIAL_SELLERS,
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
  PlusCircle,
  Percent,
  Sliders,
  Edit,
  Save,
  X,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Admin state management for approvals, sellers & commissions
  const [sellersList, setSellersList] = useState(INITIAL_SELLERS);
  
  const [pendingSellers, setPendingSellers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ratnaya_pending_sellers') || '[]');
      const combined = [...saved];
      MOCK_PENDING_SELLERS.forEach((item) => {
        if (!combined.some((s) => s.id === item.id)) {
          combined.push(item);
        }
      });
      return combined;
    } catch (e) {
      return MOCK_PENDING_SELLERS;
    }
  });

  const [pendingProducts, setPendingProducts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
      const combined = [...saved];
      MOCK_PENDING_PRODUCTS.forEach((item) => {
        if (!combined.some((p) => p.id === item.id)) {
          combined.push(item);
        }
      });
      return combined;
    } catch (e) {
      return MOCK_PENDING_PRODUCTS;
    }
  });

  const [globalCommission, setGlobalCommission] = useState(10); // 10% default marketplace commission

  // Add Seller Modal state
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [newSellerData, setNewSellerData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    city: 'Jaipur',
    gst: '22AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    commissionRate: 10
  });

  // Sync pending products & sellers from Database API & localStorage on tab change or mount
  useEffect(() => {
    async function syncBackendPendingProducts() {
      try {
        const res = await api.getPendingProducts();
        if (res && res.success && Array.isArray(res.data)) {
          // Merge Database pending products with localStorage
          const savedProds = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
          const combined = [...res.data];
          savedProds.forEach((item) => {
            if (!combined.some((p) => p.id === item.id)) {
              combined.push(item);
            }
          });
          setPendingProducts(combined);
        }
      } catch (e) {
        console.warn('Pending products API sync fallback:', e);
      }
    }

    syncBackendPendingProducts();

    try {
      const savedSellers = JSON.parse(localStorage.getItem('ratnaya_pending_sellers') || '[]');
      if (savedSellers.length > 0) {
        setPendingSellers((prev) => {
          const updated = [...savedSellers];
          prev.forEach((item) => {
            if (!updated.some((s) => s.id === item.id)) {
              updated.push(item);
            }
          });
          return updated;
        });
      }
    } catch (e) {}
  }, [activeTab]);

  // Load Sellers from Backend API on mount
  useEffect(() => {
    async function loadSellers() {
      const res = await api.getSellers();
      if (res.success && res.data && res.data.length > 0) {
        setSellersList(res.data);
      }
    }
    loadSellers();
  }, []);

  const handleApproveSeller = (id) => {
    const approvedItem = pendingSellers.find((s) => s.id === id);
    if (approvedItem) {
      const newSeller = {
        id: `seller-${Date.now()}`,
        name: approvedItem.businessName,
        owner: approvedItem.ownerName,
        city: approvedItem.city,
        rating: 4.9,
        reviewsCount: 0,
        productsCount: 0,
        verified: true,
        joinedDate: '2026',
        logo: '/assets/jewellery/ring/1.jpg',
        banner: '/assets/jewellery/ring/1.jpg',
        about: `${approvedItem.businessName} is a verified merchant.`,
        gst: approvedItem.gst,
        pan: 'ABCDE1234F',
        status: 'Approved',
        commissionRate: 10
      };
      setSellersList([newSeller, ...sellersList]);
    }
    const filtered = pendingSellers.filter((s) => s.id !== id);
    setPendingSellers(filtered);
    try {
      localStorage.setItem('ratnaya_pending_sellers', JSON.stringify(filtered));
    } catch (e) {}
  };

  // Product Rejection Modal State
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    product: null,
    reason: 'Does not meet product quality & BIS hallmarking standards.'
  });

  const handleApproveProduct = async (id) => {
    const filtered = pendingProducts.filter((p) => p.id !== id && p._id !== id);
    setPendingProducts(filtered);
    try {
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(filtered));
    } catch (e) {}

    // Database API approve call
    await api.approveProduct(id).catch((err) => console.error('API Approve Error:', err));
  };

  const handleOpenRejectModal = (product) => {
    setRejectModal({
      isOpen: true,
      product,
      reason: 'Images are unclear or BIS hallmark specifications are missing.'
    });
  };

  const handleConfirmRejectProduct = async (e) => {
    e.preventDefault();
    if (!rejectModal.product) return;

    const prodId = rejectModal.product.id || rejectModal.product._id;
    const reason = rejectModal.reason || 'Product rejected by Admin.';

    const filtered = pendingProducts.filter((p) => p.id !== prodId && p._id !== prodId);
    setPendingProducts(filtered);
    try {
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(filtered));
    } catch (err) {}

    // Call API reject product with reason & timestamp
    await api.rejectProduct(prodId, reason).catch((err) => console.error('API Reject Error:', err));

    setRejectModal({ isOpen: false, product: null, reason: '' });
  };

  const handleAddSellerSubmit = async (e) => {
    e.preventDefault();
    const createdSeller = {
      id: `seller-${Date.now()}`,
      name: newSellerData.name,
      owner: newSellerData.owner,
      city: newSellerData.city,
      email: newSellerData.email,
      phone: newSellerData.phone,
      rating: 5.0,
      reviewsCount: 0,
      productsCount: 0,
      verified: true,
      joinedDate: '2026',
      logo: '/assets/jewellery/ring/1.jpg',
      banner: '/assets/jewellery/ring/1.jpg',
      about: `${newSellerData.name} is a newly added verified merchant.`,
      gst: newSellerData.gst,
      pan: newSellerData.pan,
      status: 'Approved',
      commissionRate: Number(newSellerData.commissionRate) || 10
    };

    try {
      await api.registerSeller(createdSeller);
    } catch (err) {
      console.warn('API error adding seller:', err);
    }

    setSellersList([createdSeller, ...sellersList]);
    setIsAddSellerOpen(false);
    setNewSellerData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      city: 'Jaipur',
      gst: '22AAAAA0000A1Z5',
      pan: 'ABCDE1234F',
      commissionRate: 10
    });
    alert(`New Jeweller "${createdSeller.name}" added successfully with ${createdSeller.commissionRate}% Commission Rate!`);
  };

  const handleUpdateSellerCommission = (sellerId, newRate) => {
    const updatedSellers = sellersList.map((s) =>
      s.id === sellerId ? { ...s, commissionRate: Number(newRate) } : s
    );
    setSellersList(updatedSellers);
    alert(`Commission rate updated to ${newRate}%!`);
  };

  const totalMarketplaceRevenue = 1450000;
  const platformCommissionEarned = sellersList.reduce((acc, s) => {
    const sellerCommission = s.commissionRate || globalCommission;
    return acc + Math.round((totalMarketplaceRevenue / sellersList.length) * (sellerCommission / 100));
  }, 0);

  return (
    <div className="bg-[#FAF6F0] min-h-[90vh] pb-20">
      {/* Admin Header Bar */}
      <div className="bg-[#111111] text-white py-6 border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[0.68rem] text-gold tracking-widest uppercase font-semibold">
                  SUPER ADMIN GOVERNANCE
                </span>
                <h2 className="font-heading text-xl sm:text-2xl text-white">
                  Ratnaya Admin Control Panel
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddSellerOpen(true)}
                className="btn-gold py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <PlusCircle size={15} /> ADD NEW SELLER
              </button>
              <span className="badge-gold text-xs">Default Commission: {globalCommission}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Admin Sidebar Navigation */}
          <aside>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Platform Overview', icon: <TrendingUp size={18} /> },
                { id: 'sellers', label: `Verified Jewellers (${sellersList.length})`, icon: <Users size={18} /> },
                { id: 'commission', label: 'Commissions & Rates', icon: <Percent size={18} /> },
                { id: 'seller-approvals', label: `Seller Approvals (${pendingSellers.length})`, icon: <Store size={18} /> },
                { id: 'product-approvals', label: `Product Approvals (${pendingProducts.length})`, icon: <Package size={18} /> },
                { id: 'orders', label: 'All Orders & Logistics', icon: <ShoppingBag size={18} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 text-xs sm:text-sm flex items-center gap-3 whitespace-nowrap border-b border-gray-100 transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#FAF6F0] text-gold-dark font-semibold border-l-4 border-l-gold'
                      : 'text-charcoal hover:bg-gray-50 bg-transparent'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Admin Main Body */}
          <main className="min-w-0">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Gross Marketplace Sales</div>
                    <div className="font-heading text-2xl font-semibold text-charcoal my-1">
                      ₹{totalMarketplaceRevenue.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium">+24.2% Growth YTD</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Admin Commission Earned</div>
                    <div className="font-heading text-2xl font-semibold text-gold-dark my-1">
                      ₹{platformCommissionEarned.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-gray-500">Net Platform Revenue</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Active Jeweller Sellers</div>
                    <div className="font-heading text-2xl font-semibold text-charcoal my-1">
                      {sellersList.length} Sellers
                    </div>
                    <span className="text-xs text-gold-dark font-medium">Verified Merchants</span>
                  </div>
                </div>

                {/* Seller Management Quick Bar */}
                <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="font-heading text-xl">
                      Verified Jewellers & Commission Summary
                    </h3>
                    <button onClick={() => setIsAddSellerOpen(true)} className="btn-gold py-1.5 px-3 text-xs">
                      <PlusCircle size={14} /> ADD SELLER
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sellersList.map((seller) => (
                      <div
                        key={seller.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FAF6F0] border border-gray-200 rounded-sm gap-2"
                      >
                        <div>
                          <strong className="text-sm block text-charcoal">{seller.name}</strong>
                          <span className="text-xs text-gray-500">
                            Owner: {seller.owner} • City: {seller.city} • GST: {seller.gst}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gold-dark">
                          Commission: {seller.commissionRate || globalCommission}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VERIFIED SELLERS TAB */}
            {activeTab === 'sellers' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="font-heading text-xl">
                    Verified Jeweller Merchants ({sellersList.length})
                  </h3>
                  <button onClick={() => setIsAddSellerOpen(true)} className="btn-gold py-2 px-4 text-xs flex items-center gap-1">
                    <PlusCircle size={15} /> ADD SELLER
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {sellersList.map((seller) => (
                    <div key={seller.id} className="p-5 border border-gray-200 rounded-sm bg-[#FAF6F0]">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-lg text-charcoal">{seller.name}</h4>
                            <span className="badge-approved text-[0.65rem]">VERIFIED</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Owner: <strong>{seller.owner}</strong> | Location: <strong>{seller.city}</strong> | GST: <strong>{seller.gst}</strong>
                          </p>
                        </div>

                        {/* Commission Rate Setting per Seller */}
                        <div className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-sm">
                          <span className="text-xs font-semibold text-gray-600">Commission (%):</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={seller.commissionRate || 10}
                            id={`comm-input-${seller.id}`}
                            className="w-16 p-1 text-xs font-bold rounded-sm border border-gray-300 text-center"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById(`comm-input-${seller.id}`).value;
                              handleUpdateSellerCommission(seller.id, val);
                            }}
                            className="btn-gold py-1 px-3 text-xs"
                          >
                            SAVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMISSION & PAYOUTS TAB */}
            {activeTab === 'commission' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-2">
                  Admin Commission Configuration & Jeweller Payouts
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Set global commission rates or configure custom percentage rates per jeweller merchant.
                </p>

                <div className="bg-[#FAF6F0] p-6 rounded-sm mb-6 max-w-md border border-gray-200">
                  <label className="text-xs font-semibold uppercase text-gray-500 block mb-2">
                    Default Global Platform Commission Rate (%)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={globalCommission}
                      onChange={(e) => setGlobalCommission(Number(e.target.value))}
                      className="input-field"
                    />
                    <button className="btn-gold py-2.5 px-4 text-xs whitespace-nowrap" onClick={() => alert(`Global commission set to ${globalCommission}%`)}>
                      SAVE GLOBAL RATE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SELLER APPROVALS TAB */}
            {activeTab === 'seller-approvals' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal">
                      Pending Jeweller Merchant Registrations
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Review business KYC documents, GSTIN status, and approve merchant partner onboardings.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{pendingSellers.length} Applications Pending</span>
                </div>

                {pendingSellers.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">All Seller Applications Processed</h4>
                    <p className="text-xs text-gray-500">There are currently no pending merchant verification requests.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {pendingSellers.map((s) => (
                      <div key={s.id} className="p-6 border border-gray-200 rounded-sm bg-[#FAF6F0] shadow-sm flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-heading text-xl text-charcoal">{s.businessName}</h4>
                            <span className="badge-pending text-xs">{s.kycStatus}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600">
                            <div><strong>Owner Name:</strong> {s.ownerName}</div>
                            <div><strong>City / State:</strong> {s.city}</div>
                            <div><strong>Email:</strong> {s.email}</div>
                            <div><strong>Phone:</strong> {s.phone}</div>
                            <div><strong>GST Number:</strong> <span className="font-mono text-charcoal font-semibold">{s.gst}</span></div>
                            <div><strong>PAN Number:</strong> <span className="font-mono text-charcoal font-semibold">{s.pan}</span></div>
                            <div><strong>Category:</strong> {s.category}</div>
                            <div><strong>Applied Date:</strong> {s.appliedDate}</div>
                          </div>

                          {s.kycDocuments && (
                            <div className="pt-2 border-t border-gray-200">
                              <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-gray-500 block mb-1.5">Submitted KYC Documents:</span>
                              <div className="flex flex-wrap gap-2">
                                {s.kycDocuments.map((doc, i) => (
                                  <span key={i} className="text-xs bg-white border border-gray-300 px-2.5 py-1 rounded text-charcoal font-mono flex items-center gap-1">
                                    📄 {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Approval Actions */}
                        <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:border-l lg:border-gray-200 lg:pl-6">
                          <button
                            onClick={() => handleApproveSeller(s.id)}
                            className="btn-gold w-full py-2.5 px-5 text-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={16} /> Approve & Onboard
                          </button>
                          <button
                            onClick={() => setPendingSellers(pendingSellers.filter((p) => p.id !== s.id))}
                            className="btn-outline w-full py-2.5 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"
                          >
                            <XCircle size={16} /> Reject Application
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
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal">
                      Pending Jewellery Product Approvals
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Verify metal purity, BIS hallmarking specs, and pricing compliance before publishing items to the public marketplace.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{pendingProducts.length} Products Awaiting Review</span>
                </div>

                {pendingProducts.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Pending Product Reviews</h4>
                    <p className="text-xs text-gray-500">All submitted jewellery items have been reviewed and published.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {pendingProducts.map((p) => {
                      const prodId = p.id || p._id;
                      const displayImg = p.image || (Array.isArray(p.images) && p.images[0]) || '/assets/jewellery/necklace/1.jpg';
                      const displayPrice = p.price ? Number(p.price) : 0;
                      return (
                        <div key={prodId} className="p-5 border border-gray-200 rounded-sm bg-[#FAF6F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4 w-full">
                            <img
                              src={displayImg}
                              alt={p.name}
                              className="w-24 h-24 object-cover rounded-sm border border-gray-300 shadow-sm shrink-0"
                            />
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="badge-pending text-[0.65rem]">{p.status || p.approvalStatus || 'Pending Approval'}</span>
                                {p.rejectionReason && (
                                  <span className="text-[0.65rem] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                    <RotateCcw size={11} /> Resubmitted Piece
                                  </span>
                                )}
                              </div>
                              <h4 className="font-heading text-lg text-charcoal">{p.name}</h4>
                              <div className="text-xs text-gray-600">
                                Seller: <strong className="text-gold-dark">{p.sellerName || 'Jeweller Partner'}</strong> | Category: <strong className="capitalize">{p.category || 'Jewellery'}</strong>
                              </div>
                              <div className="text-xs text-gray-500">
                                Metal: <strong>{p.metal || '22K Gold'} ({p.purity || 'BIS Hallmarked'})</strong> | Submitted: <strong>{p.submittedDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent')}</strong>
                              </div>
                              <div className="font-semibold text-charcoal text-base pt-0.5">
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </div>

                              {/* Previous Rejection Callout Box for Admin */}
                              {p.rejectionReason && (
                                <div className="mt-3 p-3 bg-red-50/90 border-l-4 border-red-500 rounded-r text-xs text-red-950 space-y-1 shadow-sm">
                                  <div className="flex items-center justify-between font-bold text-[0.75rem] flex-wrap gap-1">
                                    <span className="flex items-center gap-1.5 text-red-700">
                                      <AlertCircle size={14} /> Previously Rejected on {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Earlier'}
                                    </span>
                                    {p.resubmittedAt && (
                                      <span className="text-[0.65rem] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Resubmitted: {new Date(p.resubmittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[0.73rem] text-red-900 bg-white/90 p-2 rounded border border-red-200">
                                    <strong>Previous Rejection Reason:</strong> "{p.rejectionReason}"
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
                            <button
                              onClick={() => handleApproveProduct(prodId)}
                              className="btn-gold py-2.5 px-5 text-xs whitespace-nowrap w-full flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 size={16} /> Approve & Publish
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(p)}
                              className="btn-outline py-2.5 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50 whitespace-nowrap w-full flex items-center justify-center gap-1.5"
                            >
                              <XCircle size={16} /> Reject Spec
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS & LOGISTICS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-4">
                  Marketplace Orders & Logistics Monitoring
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-[#FAF6F0] text-gray-600">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Seller</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Logistics Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_ORDERS.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-semibold text-gold-dark">{ord.id}</td>
                          <td className="p-3">{ord.customerName}</td>
                          <td className="p-3">{ord.sellerName}</td>
                          <td className="p-3 font-semibold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3"><span className="badge-approved text-[0.65rem]">{ord.paymentStatus}</span></td>
                          <td className="p-3">
                            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                              {ord.shippingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add New Seller Modal */}
      {isAddSellerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm max-w-lg w-full border border-gold/40 shadow-2xl relative">
            <button onClick={() => setIsAddSellerOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal">
              <X size={20} />
            </button>
            <h3 className="font-heading text-2xl mb-1 text-charcoal">Add New Jeweller Partner</h3>
            <p className="text-xs text-gray-500 mb-4">Manually onboard a verified jewellery merchant to the platform.</p>

            <form onSubmit={handleAddSellerSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Brand / Business Name</label>
                <input type="text" required placeholder="e.g. Heritage Gold Kolkata" value={newSellerData.name} onChange={(e) => setNewSellerData({ ...newSellerData, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Owner / Merchant Contact</label>
                <input type="text" required placeholder="e.g. Ramesh Chandra" value={newSellerData.owner} onChange={(e) => setNewSellerData({ ...newSellerData, owner: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">City / Base</label>
                  <input type="text" required placeholder="Kolkata, WB" value={newSellerData.city} onChange={(e) => setNewSellerData({ ...newSellerData, city: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Phone</label>
                  <input type="tel" required placeholder="+91 98290 12345" value={newSellerData.phone} onChange={(e) => setNewSellerData({ ...newSellerData, phone: e.target.value })} className="input-field" />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Product Rejection Reason Modal */}
      {rejectModal.isOpen && rejectModal.product && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm max-w-lg w-full border border-red-300 shadow-2xl relative">
            <button
              onClick={() => setRejectModal({ isOpen: false, product: null, reason: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2 text-red-600">
              <XCircle size={26} />
              <h3 className="font-heading text-xl text-charcoal">Reject Product Request</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Specify the exact reason for rejecting <strong className="text-charcoal">{rejectModal.product.name}</strong>. The seller will see this reason and rejection date in their dashboard so they can fix it.
            </p>

            <form onSubmit={handleConfirmRejectProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">
                  Quick Rejection Presets
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Images are unclear / low resolution',
                    'Missing BIS Hallmark purity proof',
                    'Incorrect price or discount calculation',
                    'Incomplete product description / metal specs'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectModal((prev) => ({ ...prev, reason: preset }))}
                      className="text-[0.7rem] px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:border-red-500 hover:bg-red-50 text-gray-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">
                  Detailed Rejection Reason / Note *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter specific reason why this product is rejected..."
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  className="input-field text-xs bg-red-50/30 border-red-200 focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold bg-red-600 hover:bg-red-700 text-white flex-1 py-3 text-xs font-semibold">
                  CONFIRM REJECTION & NOTIFY SELLER
                </button>
                <button
                  type="button"
                  onClick={() => setRejectModal({ isOpen: false, product: null, reason: '' })}
                  className="btn-outline py-3 px-5 text-xs"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
