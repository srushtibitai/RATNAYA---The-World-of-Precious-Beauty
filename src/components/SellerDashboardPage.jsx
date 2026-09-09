import React, { useState, useEffect } from 'react';
import { PRODUCTS, SELLERS, MOCK_ORDERS } from '../data/marketplaceData';
import { api } from '../services/api';
import ImageModal from './ImageModal';
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
  Sparkles,
  Edit,
  Edit3,
  X,
  ZoomIn,
  Trash2,
  Truck,
  RotateCcw,
  XCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export function SellerDashboardPage({ currentUser, sellerId }) {
  const sellerFromData = SELLERS.find((s) => s.id === sellerId || s.id === currentUser?.id);
  const seller = currentUser ? {
    id: currentUser.id || 'seller-custom',
    name: currentUser.name || currentUser.businessName || 'Verified Jeweller',
    owner: currentUser.owner || currentUser.name || 'Merchant Partner',
    gst: currentUser.gst || '22AAAAA0000A1Z5',
    rating: 5.0,
    reviewsCount: 0,
    commissionRate: currentUser.commissionRate || 10,
    logo: sellerFromData ? sellerFromData.logo : '/assets/jewellery/ring/1.jpg'
  } : (sellerFromData || SELLERS[0]);

  const [activeTab, setActiveTab] = useState('overview');
  const [sellerOrders, setSellerOrders] = useState(MOCK_ORDERS);
  const [sellerProductsList, setSellerProductsList] = useState(() =>
    PRODUCTS.filter((p) => p.sellerId === seller.id || p.sellerName === seller.name)
  );

  // Load Orders for Seller
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getOrders();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellerOrders(res.data);
        }
      } catch (err) {
        console.warn('Seller orders API load fallback:', err);
      }
    }
    loadOrders();
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        setSellerOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        setSellerOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleDeleteSellerOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order record ${orderId}?`)) return;
    try {
      await api.deleteOrder(orderId);
      setSellerOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error('Error deleting seller order:', err);
    }
  };

  // Image Lightbox Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: ''
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFileUpload = async (file, callback, categoryName = 'general') => {
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await api.uploadImage(file, categoryName);
      if (res && res.success && res.url) {
        callback(res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Image upload fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (p) => {
    const primaryImg = p.image || (p.images ? p.images[0] : '/assets/jewellery/necklace/1.jpg');
    const secondaryImg = (p.images && p.images[1]) || p.image2 || primaryImg;
    setEditingProduct({
      ...p,
      image: primaryImg,
      image2: secondaryImg
    });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const prodId = editingProduct.id || editingProduct._id;
    const primaryImg = editingProduct.image || '/assets/jewellery/necklace/1.jpg';
    const secondaryImg = editingProduct.image2 || primaryImg;

    const updatedData = {
      ...editingProduct,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : null,
      stock: Number(editingProduct.stock),
      image: primaryImg,
      images: [primaryImg, secondaryImg],
      approvalStatus: 'Pending Approval',
      status: 'Pending Approval',
      resubmittedAt: new Date()
    };

    setSellerProductsList((prev) =>
      prev.map((item) => ((item.id === prodId || item._id === prodId) ? updatedData : item))
    );

    try {
      await api.updateProduct(prodId, updatedData);
    } catch (err) {
      console.error('Error updating product:', err);
    }

    setEditingProduct(null);
    alert(`Product "${updatedData.name}" updated and resubmitted to Admin for approval!`);
  };

  // Load Seller's Products from Backend Database API on mount
  useEffect(() => {
    async function loadSellerProducts() {
      try {
        const res = await api.getProducts({ sellerId: seller.id });
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellerProductsList(res.data);
        }
      } catch (err) {
        console.warn('Backend seller products fetch warning:', err);
      }
    }
    loadSellerProducts();
  }, [seller.id]);

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
    image: '/assets/jewellery/necklace/1.jpg',
    image2: '/assets/jewellery/necklace/2.jpg'
  });

  const [productAddedSuccess, setProductAddedSuccess] = useState(false);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const primaryImg = newProduct.image || '/assets/jewellery/necklace/1.jpg';
    const secondaryImg = newProduct.image2 || primaryImg;

    const createdProduct = {
      id: `prod-req-${Date.now()}`,
      sku: newProduct.sku || `SKU-${Date.now().toString().slice(-6)}`,
      name: newProduct.name,
      category: newProduct.category || 'necklaces',
      categoryName: newProduct.categoryName || 'Necklaces',
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      metal: newProduct.metal || '22K Gold',
      purity: newProduct.purity || '22K BIS Hallmarked',
      description: newProduct.description,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerRating: seller.rating,
      rating: 5.0,
      reviewsCount: 0,
      approvalStatus: 'Pending Approval', // Admin approval required!
      status: 'Pending Approval',
      submittedDate: new Date().toISOString().split('T')[0],
      image: primaryImg,
      images: [primaryImg, secondaryImg]
    };

    // Update local seller dashboard list
    setSellerProductsList([createdProduct, ...sellerProductsList]);

    // Save to global pending products for Admin Dashboard
    try {
      const savedPending = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
      const updatedPending = [createdProduct, ...savedPending];
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(updatedPending));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    // Call REST API backend to insert product in MongoDB Database
    try {
      const apiRes = await api.createProduct(createdProduct);
      console.log('MongoDB Product Submission API Response:', apiRes);
    } catch (err) {
      console.error('Backend Product Creation Error:', err);
    }

    setProductAddedSuccess(true);
    setTimeout(() => {
      setProductAddedSuccess(false);
      setActiveTab('products');
    }, 2000);
  };

  const totalRevenue = sellerProductsList.reduce((acc, p) => acc + p.price * 3, 0);

  return (
    <div className="bg-[#FAF6F0] min-h-[90vh] pb-20">
      {/* Seller Header Bar */}
      <div className="bg-[#111111] text-white py-6 border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={seller.logo}
                alt={seller.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gold shrink-0"
              />
              <div>
                <span className="text-[0.68rem] text-gold tracking-widest uppercase font-semibold">
                  MERCHANT DASHBOARD
                </span>
                <h2 className="font-heading text-xl sm:text-2xl text-white">
                  {seller.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="badge-gold text-xs">GST: {seller.gst}</span>
              <span className="badge-approved text-xs flex items-center gap-1">
                <CheckCircle2 size={12} /> Account Approved
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
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

          {/* Main Dashboard Content */}
          <main className="min-w-0">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Total Revenue</div>
                    <div className="text-2xl font-semibold text-charcoal my-1">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium">+18.4% from last month</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Total Orders</div>
                    <div className="text-2xl font-semibold text-charcoal my-1">
                      24 Orders
                    </div>
                    <span className="text-xs text-gold-dark font-medium">3 Pending fulfillment</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Active Products</div>
                    <div className="text-2xl font-semibold text-charcoal my-1">
                      {sellerProductsList.length} Items
                    </div>
                    <span className="text-xs text-gray-500">1 Pending Review</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Store Rating</div>
                    <div className="text-2xl font-semibold text-amber-500 my-1 flex items-center gap-1">
                      <Star size={20} fill="currentColor" /> {seller.rating}
                    </div>
                    <span className="text-xs text-gray-500">Based on {seller.reviewsCount} reviews</span>
                  </div>
                </div>

                {/* Seller Products Table Preview */}
                <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm overflow-hidden">
                  <h3 className="font-heading text-xl mb-4">
                    Your Listed Jewellery Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-[#FAF6F0] text-gray-600">
                          <th className="p-3">Product</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Admin Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sellerProductsList.map((prod) => (
                          <tr key={prod.id || prod._id} className="hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-3">
                              <div
                                className="relative group cursor-pointer shrink-0"
                                title="Click to enlarge image (Esc to close)"
                                onClick={() =>
                                  setPreviewModal({
                                    isOpen: true,
                                    images: prod.images && prod.images.length > 0 ? prod.images : [prod.image || '/assets/jewellery/necklace/1.jpg'],
                                    initialIndex: 0,
                                    title: prod.name
                                  })
                                }
                              >
                                <img src={prod.images ? prod.images[0] : prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-sm border border-gray-100 group-hover:opacity-85 transition-opacity" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-sm">
                                  <ZoomIn size={13} className="text-white drop-shadow" />
                                </div>
                              </div>
                              <div>
                                <strong className="block text-charcoal">{prod.name}</strong>
                                <span className="text-xs text-gray-400">{prod.metal}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-xs">{prod.sku}</td>
                            <td className="p-3 font-semibold">₹{prod.price ? Number(prod.price).toLocaleString('en-IN') : '0'}</td>
                            <td className="p-3">{prod.stock}</td>
                            <td className="p-3">
                               <span className={`badge-status ${prod.approvalStatus === 'Approved' ? 'badge-approved' : prod.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'badge-pending'}`}>
                                 {prod.approvalStatus || 'Approved'}
                               </span>
                             </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleEditClick(prod)}
                                className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 text-charcoal flex items-center gap-1 ml-auto"
                              >
                                <Edit size={13} /> Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MY PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="font-heading text-xl">Managed Products</h3>
                  <button onClick={() => setActiveTab('add-product')} className="btn-gold py-2 px-4 text-xs">
                    <PlusCircle size={15} /> Add New Piece
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {sellerProductsList.map((p) => (
                    <div key={p.id || p._id} className="border border-gray-200 rounded-sm p-3 flex flex-col justify-between">
                      <div
                        className="relative group cursor-pointer overflow-hidden rounded-sm mb-3"
                        title="Click to view full image (Esc to close)"
                        onClick={() =>
                          setPreviewModal({
                            isOpen: true,
                            images: p.images && p.images.length > 0 ? p.images : [p.image || '/assets/jewellery/necklace/1.jpg'],
                            initialIndex: 0,
                            title: p.name
                          })
                        }
                      >
                        <img src={p.images ? p.images[0] : p.image} alt={p.name} className="w-full aspect-square object-cover rounded-sm group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium shadow-md">
                            <ZoomIn size={14} /> Full View
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`badge-status text-xs ${p.approvalStatus === 'Approved' ? 'badge-approved' : p.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'badge-pending'}`}>
                            {p.approvalStatus || 'Approved'}
                          </span>
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1 text-xs text-gray-500 hover:text-gold-dark flex items-center gap-1 font-medium"
                            title="Edit Product & Resubmit"
                          >
                            <Edit size={14} /> Edit & Resubmit
                          </button>
                        </div>
                        <h4 className="text-sm font-medium text-charcoal mt-2 mb-1 line-clamp-1">{p.name}</h4>
                        <div className="font-semibold text-sm">₹{p.price ? Number(p.price).toLocaleString('en-IN') : '0'}</div>

                        {/* Rejection Details Box */}
                        {p.approvalStatus === 'Rejected' && (
                          <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-900 space-y-1">
                            <div className="flex items-center justify-between font-bold text-[0.72rem]">
                              <span className="flex items-center gap-1 text-red-700">
                                <AlertCircle size={13} /> Rejected by Admin
                              </span>
                              <span className="text-[0.65rem] text-gray-500 font-mono">
                                {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                              </span>
                            </div>
                            <div className="text-[0.72rem] text-red-800 italic bg-white/80 p-1.5 rounded border border-red-100">
                              "{p.rejectionReason || 'Please verify product details and resubmit.'}"
                            </div>
                          </div>
                        )}

                        {/* Pending Re-approval Notice Box */}
                        {p.approvalStatus === 'Pending Approval' && p.rejectionReason && (
                          <div className="mt-2.5 p-2.5 bg-amber-50/90 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                            <div className="flex items-center justify-between font-bold text-[0.72rem]">
                              <span className="flex items-center gap-1 text-amber-800">
                                <Clock size={13} /> Resubmitted for Re-approval
                              </span>
                              <span className="text-[0.65rem] text-gray-500 font-mono">
                                Rejected: {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                              </span>
                            </div>
                            <div className="text-[0.72rem] text-amber-800 italic bg-white/80 p-1.5 rounded border border-amber-100">
                              Previous Note: "{p.rejectionReason}"
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADD PRODUCT FORM TAB */}
            {activeTab === 'add-product' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-2">
                  Submit New Jewellery Product for Admin Approval
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Provide complete metal purity, weight, and gemstone specifications. Products are reviewed by Ratnaya compliance before appearing publicly.
                </p>

                {productAddedSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-sm mb-6 flex items-center gap-2 text-sm">
                    <CheckCircle2 size={20} /> Product submitted! Pending Admin Review.
                  </div>
                )}

                <form onSubmit={handleAddProductSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Name *</label>
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
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Category</label>
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
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Price (₹ INR) *</label>
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
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Metal Type</label>
                      <input
                        type="text"
                        value={newProduct.metal}
                        onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Purity (BIS Hallmark)</label>
                      <input
                        type="text"
                        value={newProduct.purity}
                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Product Dual Image Upload Section */}
                    <div className="sm:col-span-2 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <label className="text-xs font-semibold uppercase text-gold-dark tracking-wider block">
                          Product Images (Front View & Secondary Hover View) *
                        </label>
                        <span className="text-[0.68rem] text-gray-400">Upload 2 images for smooth hover card effect</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image 1: Main Front Cover Photo */}
                        <div className="bg-gray-50/90 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-gold text-white text-[0.65rem] flex items-center justify-center font-bold">1</span>
                              Main Front Cover Photo *
                            </span>
                            <span className="text-[0.65rem] bg-gold/15 text-gold-dark font-medium px-2 py-0.5 rounded">Default View</span>
                          </div>

                          <div className="flex gap-3 items-start">
                            {/* Live Preview 1 */}
                            <div className="w-24 h-24 rounded-sm border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm">
                              {newProduct.image ? (
                                <img src={newProduct.image} alt="Front Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2 text-gray-400">
                                  <Upload className="mx-auto mb-1" size={18} />
                                  <span className="text-[0.6rem]">Front View</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                required
                                placeholder="Image 1 URL or File"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                className="input-field text-xs bg-white py-1.5"
                              />

                              <label className="btn-outline-gold py-1 px-2.5 text-[0.7rem] cursor-pointer inline-flex items-center gap-1 bg-white">
                                <Upload size={12} /> Upload File 1
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      handleImageFileUpload(file, (url) => setNewProduct((prev) => ({ ...prev, image: url })));
                                    }
                                  }}
                                />
                              </label>

                              {/* Presets for Image 1 */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {[
                                  { label: 'Necklace 1', url: '/assets/jewellery/necklace/1.jpg' },
                                  { label: 'Ring 1', url: '/assets/jewellery/ring/1.jpg' },
                                  { label: 'Earring 1', url: '/assets/jewellery/earring/1.jpg' }
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setNewProduct({ ...newProduct, image: p.url })}
                                    className="text-[0.62rem] px-1.5 py-0.5 border border-gray-300 rounded bg-white hover:border-gold"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image 2: Secondary Hover Photo */}
                        <div className="bg-gray-50/90 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-charcoal text-white text-[0.65rem] flex items-center justify-center font-bold">2</span>
                              Secondary Angle Photo (Hover View)
                            </span>
                            <span className="text-[0.65rem] bg-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded">Hover Effect</span>
                          </div>

                          <div className="flex gap-3 items-start">
                            {/* Live Preview 2 */}
                            <div className="w-24 h-24 rounded-sm border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm">
                              {newProduct.image2 ? (
                                <img src={newProduct.image2} alt="Hover Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2 text-gray-400">
                                  <Upload className="mx-auto mb-1" size={18} />
                                  <span className="text-[0.6rem]">Side / Model</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Image 2 URL or File"
                                value={newProduct.image2 || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, image2: e.target.value })}
                                className="input-field text-xs bg-white py-1.5"
                              />

                              <label className="btn-outline-gold py-1 px-2.5 text-[0.7rem] cursor-pointer inline-flex items-center gap-1 bg-white">
                                <Upload size={12} /> Upload File 2
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      handleImageFileUpload(file, (url) => setNewProduct((prev) => ({ ...prev, image2: url })));
                                    }
                                  }}
                                />
                              </label>

                              {/* Presets for Image 2 */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {[
                                  { label: 'Angle 2', url: '/assets/jewellery/necklace/2.jpg' },
                                  { label: 'Model View', url: '/assets/jewellery/ring/2.jpg' },
                                  { label: 'Close Up', url: '/assets/jewellery/earring/2.jpg' }
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setNewProduct({ ...newProduct, image2: p.url })}
                                    className="text-[0.62rem] px-1.5 py-0.5 border border-gray-300 rounded bg-white hover:border-gold"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Description</label>
                      <textarea
                        rows={4}
                        placeholder="Detail the craftsmanship, Meenakari work, gold purity, and design inspiration..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold py-3.5 text-xs font-semibold">
                    SUBMIT PRODUCT FOR ADMIN APPROVAL
                  </button>
                </form>
              </div>
            )}

            {/* EARNINGS & PAYOUTS TAB */}
            {activeTab === 'earnings' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-2">
                  Merchant Earnings & Admin Commission Breakdown
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Transparency report showing gross marketplace sales, platform commission deductions, and net payouts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Gross Sales Revenue</span>
                    <h4 className="font-heading text-2xl my-1 text-charcoal">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Admin Commission ({seller.commissionRate || 10}%)</span>
                    <h4 className="font-heading text-2xl my-1 text-gold-dark">
                      ₹{Math.round(totalRevenue * ((seller.commissionRate || 10) / 100)).toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Net Bank Payout</span>
                    <h4 className="font-heading text-2xl my-1 text-emerald-700">
                      ₹{Math.round(totalRevenue * (1 - (seller.commissionRate || 10) / 100)).toLocaleString('en-IN')}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* MERCHANT ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal mb-1">
                      Merchant Orders & Fulfillment
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Manage client orders, track insured shipments, update delivery statuses, and handle return requests.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{sellerOrders.length} Total Orders</span>
                </div>

                {sellerOrders.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <ShoppingBag className="mx-auto text-gold-dark mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Orders Found</h4>
                    <p className="text-xs text-gray-500">New orders placed for your jewellery pieces will appear here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {sellerOrders.map((ord) => (
                      <div key={ord.id} className="border border-gray-200 rounded-sm p-5 bg-[#FAF6F0] shadow-xs">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between pb-4 mb-4 border-b border-gray-200 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm font-heading tracking-wide text-charcoal">{ord.id}</strong>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">Placed on {ord.date}</span>
                            </div>
                            <span className="text-xs text-gray-600 block mt-0.5">
                              Buyer: <strong>{ord.buyerName || ord.customerName || 'Priya Malhotra'}</strong> ({ord.buyerEmail || 'priya.m@gmail.com'})
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {ord.status === 'Delivered' && (
                              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Delivered
                              </span>
                            )}
                            {ord.status === 'Shipped' && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <Truck size={12} /> In Transit
                              </span>
                            )}
                            {ord.status === 'Confirmed' && (
                              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <Clock size={12} /> Order Confirmed
                              </span>
                            )}
                            {ord.status === 'Return Requested' && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <RotateCcw size={12} /> Return Requested
                              </span>
                            )}
                            {ord.status === 'Refunded' && (
                              <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <DollarSign size={12} /> Refunded
                              </span>
                            )}
                            {ord.status === 'Cancelled' && (
                              <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <XCircle size={12} /> Cancelled
                              </span>
                            )}

                            <strong className="text-base text-charcoal font-heading">
                              ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                            </strong>
                          </div>
                        </div>

                        {/* Items Purchased */}
                        {ord.items && ord.items.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded border border-gray-100">
                                <div>
                                  <strong className="text-charcoal block">{item.name}</strong>
                                  <span className="text-gray-400">Qty: {item.qty || 1} • Price: ₹{(item.price || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <span className="font-semibold text-charcoal">₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Customer Delivery Address */}
                        {ord.address && (
                          <div className="mb-4 p-3 bg-white/80 rounded border border-gray-200 text-xs">
                            <span className="text-gray-500 font-semibold block uppercase tracking-wider mb-0.5 text-[0.68rem]">Shipping Address:</span>
                            <span className="text-gray-700">{ord.address}</span>
                          </div>
                        )}

                        {/* Return Request Details Callout */}
                        {ord.status === 'Return Requested' && ord.returnDetails && (
                          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900">
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span className="flex items-center gap-1 text-purple-800">
                                <RotateCcw size={14} /> Customer Return Request Received
                              </span>
                              <span className="text-[0.68rem] text-purple-700">Date: {ord.returnDetails.requestDate || ord.date}</span>
                            </div>
                            <p className="mb-1"><strong>Reason:</strong> {ord.returnDetails.reason}</p>
                            {ord.returnDetails.comments && (
                              <p className="italic text-[0.7rem] text-gray-600 mb-1">"{ord.returnDetails.comments}"</p>
                            )}
                            <p className="text-[0.68rem] text-purple-700"><strong>Refund Method Choice:</strong> {ord.returnDetails.refundMethod || 'Original Source'}</p>
                          </div>
                        )}

                        {/* Refund Completed Callout */}
                        {ord.status === 'Refunded' && ord.refundDetails && (
                          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                            <div className="font-bold flex items-center justify-between mb-1">
                              <span className="flex items-center gap-1 text-emerald-800">
                                <CheckCircle2 size={14} /> Refund Issued & Completed
                              </span>
                              <span className="font-mono text-[0.68rem]">Txn ID: {ord.refundDetails.refundTxnId}</span>
                            </div>
                            <p className="text-[0.68rem] text-emerald-700">
                              Amount ₹{(ord.refundDetails.refundAmount || ord.totalAmount).toLocaleString('en-IN')} credited back on {ord.refundDetails.refundDate}.
                            </p>
                          </div>
                        )}

                        {/* Cancelled Callout */}
                        {ord.status === 'Cancelled' && (
                          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 flex items-center justify-between">
                            <span className="flex items-center gap-1 font-medium">
                              <XCircle size={14} className="text-rose-600" /> Order Cancelled: {ord.cancellationReason || 'Cancelled'}
                            </span>
                            <span className="text-[0.68rem] text-gray-500">{ord.cancelledAt || ord.date}</span>
                          </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs">
                            <Truck size={16} className="text-gold-dark shrink-0" />
                            <span className="text-gray-500">Tracking:</span>
                            <strong className="font-mono text-charcoal">{ord.trackingNumber || ord.trackingCode || 'BLUEDART-EXP882'}</strong>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            {/* Update Status Dropdown */}
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-gray-500 font-medium hidden sm:inline">Status:</span>
                              <select
                                value={ord.status || 'Confirmed'}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="input-field text-xs py-1.5 px-2 font-semibold bg-white border border-gray-300"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped (In Transit)</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Return Requested">Return Requested</option>
                                <option value="Refunded">Refunded</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            {/* Delete Order Action */}
                            <button
                              onClick={() => handleDeleteSellerOrder(ord.id)}
                              className="py-1.5 px-2.5 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1 cursor-pointer font-medium"
                              title="Delete Order Record"
                            >
                              <Trash2 size={13} /> Delete Record
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STORE PROFILE TAB */}
            {activeTab === 'store-profile' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal mb-1">
                      Merchant Store Profile & Compliance
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Your verified jeweller credentials, GSTIN, and BIS Hallmarking license status.
                    </p>
                  </div>
                  <span className="badge-approved text-xs flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified Merchant Partner
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#FAF6F0] p-5 border border-gray-200 rounded-sm space-y-3">
                    <h4 className="font-heading text-lg text-charcoal border-b border-gray-200 pb-2">Business Information</h4>
                    <div className="text-xs space-y-2 text-gray-700">
                      <p><strong>Merchant Name:</strong> {seller.name}</p>
                      <p><strong>Owner / Goldsmith:</strong> {seller.owner}</p>
                      <p><strong>Base City:</strong> {seller.city || 'Jaipur, Rajasthan'}</p>
                      <p><strong>GST Number:</strong> <code className="bg-white px-1.5 py-0.5 rounded font-mono">{seller.gst}</code></p>
                    </div>
                  </div>

                  <div className="bg-[#FAF6F0] p-5 border border-gray-200 rounded-sm space-y-3">
                    <h4 className="font-heading text-lg text-charcoal border-b border-gray-200 pb-2">Quality & Governance</h4>
                    <div className="text-xs space-y-2 text-gray-700">
                      <p><strong>BIS Hallmark License:</strong> <span className="text-emerald-700 font-bold">Verified Active (HUID Compliant)</span></p>
                      <p><strong>Jeweller Rating:</strong> ⭐ {seller.rating} / 5.0</p>
                      <p><strong>Marketplace Commission Rate:</strong> {seller.commissionRate || 10}%</p>
                      <p><strong>Account Status:</strong> <span className="badge-approved text-[0.68rem]">Active Merchant</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-md max-w-2xl w-full border border-gold/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-heading text-xl text-charcoal">Edit Jewellery Product</h3>
                <p className="text-xs text-gray-500">Update item details, price, images, metal specs, and inventory stock.</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="flex flex-col gap-4">
              {/* Previous Rejection Banner */}
              {editingProduct.approvalStatus === 'Rejected' && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r text-xs text-red-900 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5 text-red-700">
                      <AlertCircle size={16} /> Requires Revision (Rejected)
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Rejected Date: {editingProduct.rejectedAt ? new Date(editingProduct.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    Admin Rejection Note:
                    <span className="font-normal italic bg-white p-2 rounded border border-red-200 block mt-1 text-red-800 shadow-inner">
                      "{editingProduct.rejectionReason || 'Please fix specs/images'}"
                    </span>
                  </div>
                  <div className="text-[0.72rem] text-emerald-800 font-semibold pt-1 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Saving your edits below will automatically send this item back to Admin for Approval!
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Category</label>
                  <select
                    value={editingProduct.category || 'necklaces'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, categoryName: e.target.options[e.target.selectedIndex].text })}
                    className="input-field capitalize"
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bangles">Bangles & Bracelets</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="mangalsutra">Mangalsutra</option>
                    <option value="pendants">Pendants</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Metal Purity</label>
                  <input
                    type="text"
                    value={editingProduct.metal || '22K Gold'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metal: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">BIS Hallmark / Purity Spec</label>
                  <input
                    type="text"
                    value={editingProduct.purity || '22K BIS Hallmarked'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, purity: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              {/* Primary Image Preview & Upload */}
              <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm">
                <label className="text-xs font-semibold uppercase text-charcoal mb-2 block flex items-center justify-between">
                  <span>Primary Product Image (Main View)</span>
                  {editingProduct.image && <span className="text-[0.65rem] text-emerald-700 font-medium">✓ Image Attached</span>}
                </label>

                <div className="flex gap-4 items-start">
                  {/* Live Thumbnail Preview */}
                  <div
                    className="w-24 h-24 rounded border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm group cursor-pointer"
                    title="Click to zoom primary image (Esc to close)"
                    onClick={() =>
                      editingProduct.image &&
                      setPreviewModal({
                        isOpen: true,
                        images: [editingProduct.image, editingProduct.image2].filter(Boolean),
                        initialIndex: 0,
                        title: editingProduct.name || 'Primary Product Image'
                      })
                    }
                  >
                    {editingProduct.image ? (
                      <>
                        <img src={editingProduct.image} alt="Primary Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2 text-gray-400">
                        <Upload className="mx-auto mb-1" size={18} />
                        <span className="text-[0.6rem]">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleImageFileUpload(file, (url) => setEditingProduct((prev) => ({ ...prev, image: url })));
                            }
                          }}
                        />
                      </label>
                      {editingProduct.image && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Image URL or Server Asset Path..."
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="input-field text-xs text-gray-600 truncate bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Image Preview & Upload */}
              <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm">
                <label className="text-xs font-semibold uppercase text-charcoal mb-2 block flex items-center justify-between">
                  <span>Secondary Angle Photo (Hover / Back View)</span>
                  {editingProduct.image2 && <span className="text-[0.65rem] text-emerald-700 font-medium">✓ Image Attached</span>}
                </label>

                <div className="flex gap-4 items-start">
                  {/* Live Thumbnail Preview */}
                  <div
                    className="w-24 h-24 rounded border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm group cursor-pointer"
                    title="Click to zoom secondary image (Esc to close)"
                    onClick={() =>
                      editingProduct.image2 &&
                      setPreviewModal({
                        isOpen: true,
                        images: [editingProduct.image, editingProduct.image2].filter(Boolean),
                        initialIndex: editingProduct.image ? 1 : 0,
                        title: editingProduct.name || 'Secondary Product Image'
                      })
                    }
                  >
                    {editingProduct.image2 ? (
                      <>
                        <img src={editingProduct.image2} alt="Secondary Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2 text-gray-400">
                        <Upload className="mx-auto mb-1" size={18} />
                        <span className="text-[0.6rem]">Side / Back</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleImageFileUpload(file, (url) => setEditingProduct((prev) => ({ ...prev, image2: url })));
                            }
                          }}
                        />
                      </label>
                      {editingProduct.image2 && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image2: '' })}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Secondary Image URL or Base64 string..."
                      value={editingProduct.image2 || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image2: e.target.value })}
                      className="input-field text-xs text-gray-600 truncate bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-gold flex-1 py-3 text-xs">
                  SAVE & UPDATE PRODUCT
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-outline py-3 px-5 text-xs">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      <ImageModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        images={previewModal.images}
        initialIndex={previewModal.initialIndex}
        title={previewModal.title}
      />
    </div>
  );
}
