import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS } from '../data/marketplaceData';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Save,
  Lock,
  Mail,
  Phone,
  Calendar,
  X,
  Loader2,
  Trash2,
  RotateCcw,
  XCircle,
  AlertCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export function BuyerAccountPage({ user, wishlistItems = [], onAddToCart, onNavigateShop }) {
  const [activeTab, setActiveTab] = useState('profile');
  const userId = user?.id || user?._id || 'buyer-demo-101';

  // Dynamic MongoDB States
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: '1995-01-01',
    anniversary: '2020-01-01'
  });
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Modals for Adding Address & Payment Method
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // Add Address Form State
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: user?.name || 'Priya Malhotra',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '+91 98201 44510',
    isDefault: false
  });

  // Add Payment Form State
  const [newPayment, setNewPayment] = useState({
    type: 'Visa Credit Card',
    bank: '',
    number: '',
    expiry: '',
    isDefault: false
  });

  // Orders State & Toast
  const [ordersList, setOrdersList] = useState(MOCK_ORDERS);
  const [ordersFilter, setOrdersFilter] = useState('All');
  const [orderToast, setOrderToast] = useState('');

  // Return Request Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('Defective or Damaged Item');
  const [returnComments, setReturnComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('Original Payment Source');
  const [upiId, setUpiId] = useState('');
  const [bankAccountDetails, setBankAccountDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolder: ''
  });

  // Cancel Order Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  // Fetch Profile, Addresses, Payments & Orders from API
  useEffect(() => {
    let isMounted = true;
    async function loadProfileData() {
      try {
        setLoading(true);
        const res = await api.getProfile(userId);
        if (isMounted && res) {
          if (res.profile) {
            setProfileData({
              name: res.profile.name || user?.name || 'Priya Malhotra',
              email: res.profile.email || user?.email || 'priya.m@gmail.com',
              phone: res.profile.phone || user?.phone || '+91 98201 44510',
              dob: res.profile.dob || '1992-08-15',
              anniversary: res.profile.anniversary || '2018-12-04'
            });
          }
          if (Array.isArray(res.addresses)) {
            setAddresses(res.addresses);
          }
          if (Array.isArray(res.paymentMethods)) {
            setPaymentMethods(res.paymentMethods);
          }
        }
      } catch (err) {
        console.warn('Profile MongoDB load fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadOrdersData() {
      try {
        const res = await api.getOrders();
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setOrdersList(res.data);
        }
      } catch (err) {
        console.warn('Orders load fallback:', err);
      }
    }

    loadProfileData();
    loadOrdersData();
    return () => {
      isMounted = false;
    };
  }, [userId, user]);

  // Open Return Modal for specific Order
  const handleOpenReturnModal = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('Defective or Damaged Item');
    setReturnComments('');
    setRefundMethod('Original Payment Source');
    setUpiId('');
    setBankAccountDetails({ accountNumber: '', ifscCode: '', bankName: '', accountHolder: profileData.name });
    setIsReturnModalOpen(true);
  };

  // Submit Return Request
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    const returnPayload = {
      reason: returnReason,
      comments: returnComments,
      refundMethod,
      upiId: refundMethod === 'UPI' ? upiId : null,
      bankDetails: refundMethod === 'Direct Bank Transfer' ? bankAccountDetails : null
    };

    try {
      const res = await api.requestOrderReturn(selectedOrderForReturn.id, returnPayload);
      if (res && res.success) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === selectedOrderForReturn.id ? res.data : o))
        );
        setOrderToast(`Return request for ${selectedOrderForReturn.id} submitted successfully!`);
      } else {
        // Fallback update local state
        setOrdersList((prev) =>
          prev.map((o) =>
            o.id === selectedOrderForReturn.id
              ? {
                  ...o,
                  status: 'Return Requested',
                  returnDetails: {
                    requestDate: new Date().toISOString().split('T')[0],
                    reason: returnReason,
                    comments: returnComments,
                    refundMethod,
                    status: 'Pending Approval'
                  }
                }
              : o
          )
        );
        setOrderToast(`Return request submitted successfully for ${selectedOrderForReturn.id}`);
      }
    } catch (err) {
      console.error('Error requesting return:', err);
    } finally {
      setIsReturnModalOpen(false);
      setTimeout(() => setOrderToast(''), 4000);
    }
  };

  // Open Cancel Modal
  const handleOpenCancelModal = (order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('Changed my mind / Placed by mistake');
    setIsCancelModalOpen(true);
  };

  // Submit Cancel Order
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderForCancel) return;

    try {
      const res = await api.cancelOrder(selectedOrderForCancel.id, cancelReason);
      if (res && res.success) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === selectedOrderForCancel.id ? res.data : o))
        );
      } else {
        setOrdersList((prev) =>
          prev.map((o) =>
            o.id === selectedOrderForCancel.id
              ? { ...o, status: 'Cancelled', cancellationReason: cancelReason }
              : o
          )
        );
      }
      setOrderToast(`Order ${selectedOrderForCancel.id} has been cancelled.`);
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setIsCancelModalOpen(false);
      setTimeout(() => setOrderToast(''), 4000);
    }
  };

  // Delete Order Record
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to remove order record ${orderId} from history?`)) return;

    try {
      await api.deleteOrder(orderId);
      setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
      setOrderToast(`Order record ${orderId} deleted successfully.`);
      setTimeout(() => setOrderToast(''), 3000);
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // Handle Profile Update in MongoDB
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(userId, profileData);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    } catch (err) {
      console.error('Failed to update profile in MongoDB:', err);
    }
  };

  // Handle Add Address to MongoDB
  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const added = await api.addAddress(userId, newAddress);
      if (added) {
        setAddresses((prev) => [added, ...prev]);
        setIsAddAddressOpen(false);
        setNewAddress({
          type: 'Home',
          name: profileData.name,
          street: '',
          city: '',
          state: '',
          pincode: '',
          phone: profileData.phone,
          isDefault: false
        });
      }
    } catch (err) {
      console.error('Failed to add address to MongoDB:', err);
    }
  };

  // Handle Delete Address from MongoDB
  const handleDeleteAddress = async (addrId) => {
    try {
      await api.deleteAddress(userId, addrId);
      setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== addrId));
    } catch (err) {
      console.error('Failed to delete address from MongoDB:', err);
    }
  };

  // Handle Add Payment Method to MongoDB
  const handleAddPaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const added = await api.addPaymentMethod(userId, newPayment);
      if (added) {
        setPaymentMethods((prev) => [added, ...prev]);
        setIsAddPaymentOpen(false);
        setNewPayment({
          type: 'Visa Credit Card',
          bank: '',
          number: '',
          expiry: '',
          isDefault: false
        });
      }
    } catch (err) {
      console.error('Failed to add payment method to MongoDB:', err);
    }
  };

  // Handle Delete Payment Method from MongoDB
  const handleDeletePayment = async (payId) => {
    try {
      await api.deletePaymentMethod(userId, payId);
      setPaymentMethods((prev) => prev.filter((p) => (p._id || p.id) !== payId));
    } catch (err) {
      console.error('Failed to delete payment method from MongoDB:', err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'PM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#FAF6F0] py-8 sm:py-12 lg:py-16 min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F5E7D6] text-gold-dark flex items-center justify-center font-heading text-2xl font-bold border border-gold/40 shrink-0 shadow-inner">
              {getInitials(profileData.name)}
            </div>
            <div>
              <span className="eyebrow mb-1 block text-gold-dark font-semibold">PATRON ACCOUNT</span>
              <h1 className="font-heading text-2xl sm:text-3xl text-charcoal">{profileData.name}</h1>
              <span className="text-xs sm:text-sm text-gray-500">{profileData.email} • {profileData.phone}</span>
            </div>
          </div>

          <span className="badge-gold text-xs flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-full">
            <ShieldCheck size={16} className="text-gold-dark" /> Ratnaya VIP Gold Connoisseur
          </span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-full">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
              {[
                { id: 'profile', label: 'Personal Profile', icon: <User size={18} /> },
                { id: 'orders', label: 'My Orders & Tracking', icon: <Package size={18} /> },
                { id: 'wishlist', label: `Saved Wishlist (${wishlistItems.length})`, icon: <Heart size={18} /> },
                { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: <MapPin size={18} /> },
                { id: 'payments', label: `Saved Payment Methods (${paymentMethods.length})`, icon: <CreditCard size={18} /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-4 text-xs sm:text-sm flex items-center gap-3 whitespace-nowrap border-b border-gray-100 transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-[#FAF6F0] text-gold-dark font-semibold border-l-4 border-l-gold'
                      : 'text-charcoal hover:bg-gray-50 bg-transparent'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Main Body Content */}
          <main className="min-w-0">
            {/* Toast Notification */}
            {isSavedToast && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Your profile details have been updated in MongoDB database!</span>
              </div>
            )}

            {/* TAB 1: PERSONAL PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl text-charcoal">Personal Profile & Security</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Manage your contact details, milestone dates, and account security in MongoDB.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={14} className="text-gold-dark" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field w-full text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Mail size={14} className="text-gold-dark" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field w-full text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Phone size={14} className="text-gold-dark" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="input-field w-full text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar size={14} className="text-gold-dark" /> Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.dob}
                        onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                        className="input-field w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar size={14} className="text-gold-dark" /> Special Milestone / Anniversary
                      </label>
                      <input
                        type="date"
                        value={profileData.anniversary}
                        onChange={(e) => setProfileData({ ...profileData, anniversary: e.target.value })}
                        className="input-field w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-heading text-lg text-charcoal mb-4 flex items-center gap-2">
                      <Lock size={18} className="text-gold-dark" /> Password & Authentication
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">New Password (leave blank to keep current)</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="btn-gold py-3 px-8 text-xs font-semibold flex items-center gap-2">
                      <Save size={16} /> SAVE CHANGES
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: MY ORDERS & RETURNS */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl mb-1 text-charcoal">
                      My Orders & Returns
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Track insured transit, initiate 14-day returns, view refund status, or cancel orders.
                    </p>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 border border-gray-200 rounded-sm text-xs">
                    {['All', 'Active', 'Returned / Refunded', 'Cancelled'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setOrdersFilter(f)}
                        className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
                          ordersFilter === f ? 'bg-gold text-white shadow-xs' : 'text-gray-600 hover:text-charcoal'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Toast */}
                {orderToast && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs animate-fadeIn">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>{orderToast}</span>
                  </div>
                )}

                {/* Orders List */}
                <div className="flex flex-col gap-6">
                  {ordersList
                    .filter((order) => {
                      if (ordersFilter === 'Active') return ['Confirmed', 'Shipped', 'Processing'].includes(order.status);
                      if (ordersFilter === 'Returned / Refunded') return ['Return Requested', 'Refunded'].includes(order.status);
                      if (ordersFilter === 'Cancelled') return order.status === 'Cancelled';
                      return true;
                    })
                    .map((order) => {
                      const isReturnable = ['Delivered', 'Shipped', 'Confirmed'].includes(order.status) && !['Return Requested', 'Refunded', 'Cancelled'].includes(order.status);
                      const isCancellable = !['Cancelled', 'Refunded'].includes(order.status);
                      const isDeletable = ['Cancelled', 'Refunded', 'Delivered'].includes(order.status);

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-sm p-5 bg-[#FAF6F0] shadow-xs relative"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row justify-between pb-4 mb-4 border-b border-gray-200 gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-sm font-heading tracking-wide text-charcoal">{order.id}</strong>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">Placed on {order.date}</span>
                              </div>
                              <span className="text-xs text-gray-600 block mt-0.5">
                                Merchant: <strong>{order.sellerName || 'Ratnaya Atelier Merchant'}</strong>
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {order.status === 'Delivered' && (
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Delivered
                                </span>
                              )}
                              {order.status === 'Shipped' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <Truck size={12} /> In Transit
                                </span>
                              )}
                              {order.status === 'Confirmed' && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <Clock size={12} /> Order Confirmed
                                </span>
                              )}
                              {order.status === 'Return Requested' && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <RotateCcw size={12} /> Return Requested
                                </span>
                              )}
                              {order.status === 'Refunded' && (
                                <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-xs">
                                  <DollarSign size={12} /> Refunded
                                </span>
                              )}
                              {order.status === 'Cancelled' && (
                                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <XCircle size={12} /> Cancelled
                                </span>
                              )}

                              <strong className="text-base text-charcoal font-heading">
                                ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>

                          {/* Items List */}
                          {order.items && order.items.length > 0 && (
                            <div className="mb-4 space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded border border-gray-100">
                                  <div>
                                    <span className="font-medium text-charcoal block">{item.name}</span>
                                    <span className="text-gray-400">Qty: {item.qty || 1} • Sold by {item.sellerName || order.sellerName}</span>
                                  </div>
                                  <span className="font-semibold text-charcoal">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Refund Information Banner */}
                          {order.status === 'Refunded' && (
                            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-900">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-emerald-800">
                                  <CheckCircle2 size={16} /> Refund Completed
                                </span>
                                <span className="font-mono text-emerald-700 font-bold">
                                  Txn ID: {order.refundDetails?.refundTxnId || 'RFND-89210492'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/80 p-2.5 rounded border border-emerald-100">
                                <div>
                                  <span className="text-gray-500 block text-[0.68rem]">Refund Amount:</span>
                                  <strong className="text-emerald-700 font-bold text-sm">₹{(order.refundDetails?.refundAmount || order.totalAmount).toLocaleString('en-IN')}</strong>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[0.68rem]">Refund Date:</span>
                                  <strong className="text-gray-700">{order.refundDetails?.refundDate || order.date}</strong>
                                </div>
                                <div>
                                  <span className="text-gray-500 block text-[0.68rem]">Payout Destination:</span>
                                  <strong className="text-gray-700">{order.returnDetails?.refundMethod || order.paymentMethod || 'Original Payment Account'}</strong>
                                </div>
                              </div>
                              <p className="mt-2 text-[0.68rem] text-emerald-700">
                                {order.refundDetails?.notes || 'The full amount has been credited back to your bank/account.'}
                              </p>
                            </div>
                          )}

                          {/* Return Requested Banner */}
                          {order.status === 'Return Requested' && (
                            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-sm text-xs text-purple-900">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-purple-800">
                                  <RotateCcw size={15} /> Return Under Review
                                </span>
                                <span className="text-purple-700 font-semibold">Requested: {order.returnDetails?.requestDate || order.date}</span>
                              </div>
                              <p className="text-xs text-purple-800 mb-1">
                                <strong>Reason:</strong> {order.returnDetails?.reason || 'Return Requested'}
                              </p>
                              {order.returnDetails?.comments && (
                                <p className="text-[0.7rem] text-gray-600 italic mb-2">"{order.returnDetails.comments}"</p>
                              )}
                              <div className="text-[0.68rem] text-purple-700 bg-white/70 p-2 rounded border border-purple-100">
                                Insured doorstep reverse pickup will be scheduled upon quality approval. Refund will be credited directly to your <strong>{order.returnDetails?.refundMethod || 'Nominated Account'}</strong>.
                              </div>
                            </div>
                          )}

                          {/* Cancelled Banner */}
                          {order.status === 'Cancelled' && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-900 flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-medium">
                                <XCircle size={15} className="text-rose-600" /> Order cancelled. Reason: {order.cancellationReason || 'Cancelled by buyer'}
                              </span>
                              <span className="text-[0.68rem] text-gray-500">{order.cancelledAt || order.date}</span>
                            </div>
                          )}

                          {/* Transit & Action Buttons */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-gray-200/60">
                            <div className="flex items-center gap-3">
                              <Truck size={18} className="text-gold-dark shrink-0" />
                              <div className="text-xs">
                                <span className="text-gray-500 block">Insured Courier Tracking:</span>
                                <strong className="font-mono text-charcoal">{order.trackingNumber || order.trackingCode || 'BLUEDART-EXP8812'}</strong>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                              {/* Return Button */}
                              {isReturnable && (
                                <button
                                  onClick={() => handleOpenReturnModal(order)}
                                  className="btn-outline-gold py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                                >
                                  <RotateCcw size={13} /> Request 14-Day Return
                                </button>
                              )}

                              {/* Cancel Button */}
                              {isCancellable && (
                                <button
                                  onClick={() => handleOpenCancelModal(order)}
                                  className="py-1.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-300 rounded hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle size={13} /> Cancel Order
                                </button>
                              )}

                              {/* Delete Record Button */}
                              {isDeletable && (
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="py-1.5 px-2.5 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1 cursor-pointer font-medium"
                                  title="Delete order record from history"
                                >
                                  <Trash2 size={13} /> Delete Record
                                </button>
                              )}

                              {/* Reorder Button */}
                              <button onClick={onNavigateShop} className="btn-outline-gold py-1.5 px-3 text-xs">
                                Reorder Items
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {ordersList.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-[#FAF6F0] rounded border border-dashed border-gray-300">
                      <Package size={32} className="mx-auto mb-2 text-gold-dark" />
                      <p className="text-sm font-medium mb-3">No order records found in your account.</p>
                      <button onClick={onNavigateShop} className="btn-gold py-2 px-5 text-xs">
                        EXPLORE JEWELLERY CATALOGUE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-xl sm:text-2xl mb-6">
                  Your Saved Luxury Wishlist ({wishlistItems.length})
                </h3>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm mb-4">Your saved wishlist is currently empty.</p>
                    <button onClick={onNavigateShop} className="btn-gold py-2.5 px-5 text-xs">
                      EXPLORE CATALOGUE
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-sm p-3 flex flex-col justify-between">
                        <img src={item.images ? item.images[0] : item.image} alt={item.name} className="w-full aspect-square object-cover rounded-sm mb-3" />
                        <div>
                          <span className="text-[0.68rem] text-gold-dark uppercase font-medium">{item.sellerName}</span>
                          <h4 className="text-xs sm:text-sm font-normal text-charcoal line-clamp-1 mb-1">{item.name}</h4>
                          <div className="font-semibold text-sm mb-3">₹{item.price.toLocaleString('en-IN')}</div>
                          <button onClick={() => onAddToCart(item)} className="btn-gold w-full py-2 text-xs">
                            Move to Bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED ADDRESSES (DYNAMIC MONGODB) */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl text-charcoal">Saved Insured Shipping Addresses</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Manage addresses stored directly in your MongoDB account database.</p>
                  </div>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="btn-outline-gold py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> + ADD ADDRESS
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-[#FAF6F0] rounded-sm border border-dashed border-gray-300">
                    <MapPin size={32} className="mx-auto mb-2 text-gold-dark" />
                    <p className="text-sm font-medium mb-3">No saved addresses found in MongoDB database.</p>
                    <button onClick={() => setIsAddAddressOpen(true)} className="btn-gold py-2 px-4 text-xs">
                      + ADD NEW ADDRESS
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr._id || addr.id} className="border border-gold/30 bg-[#FAF6F0] p-5 rounded-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">{addr.type}</span>
                            {addr.isDefault && (
                              <span className="bg-gold text-white text-[0.65rem] px-2 py-0.5 rounded font-semibold uppercase">DEFAULT</span>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-charcoal mb-1">{addr.name}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">
                            {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                          <span className="text-xs text-gray-500 block">Contact: {addr.phone}</span>
                        </div>

                        <div className="flex gap-3 mt-4 pt-3 border-t border-gold/20 items-center justify-between">
                          <span className="text-[0.68rem] text-emerald-700 font-medium">Synced with MongoDB</span>
                          <button
                            onClick={() => handleDeleteAddress(addr._id || addr.id)}
                            className="text-xs text-red-600 font-semibold hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SAVED PAYMENT METHODS (DYNAMIC MONGODB) */}
            {activeTab === 'payments' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl text-charcoal">Saved Payment Methods</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Manage 256-bit encrypted payment cards and UPI handles stored in MongoDB.</p>
                  </div>
                  <button
                    onClick={() => setIsAddPaymentOpen(true)}
                    className="btn-outline-gold py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> + ADD PAYMENT METHOD
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-[#FAF6F0] rounded-sm border border-dashed border-gray-300">
                    <CreditCard size={32} className="mx-auto mb-2 text-gold-dark" />
                    <p className="text-sm font-medium mb-3">No saved payment methods found in MongoDB database.</p>
                    <button onClick={() => setIsAddPaymentOpen(true)} className="btn-gold py-2 px-4 text-xs">
                      + ADD PAYMENT METHOD
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {paymentMethods.map((pm) => (
                      <div key={pm._id || pm.id} className="border border-gray-200 bg-[#FAF6F0] p-5 rounded-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">{pm.type}</span>
                            {pm.isDefault && (
                              <span className="bg-gold text-white text-[0.65rem] px-2 py-0.5 rounded font-semibold uppercase">DEFAULT</span>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-charcoal mb-1">{pm.bank}</h4>
                          <p className="font-mono text-xs sm:text-sm text-charcoal tracking-widest my-2">
                            {pm.number}
                          </p>
                          {pm.expiry && pm.expiry !== 'N/A' && (
                            <span className="text-xs text-gray-500 block">Expires: {pm.expiry}</span>
                          )}
                        </div>

                        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200 items-center justify-between">
                          <span className="text-[0.68rem] text-emerald-700 font-medium">Synced with MongoDB</span>
                          <button
                            onClick={() => handleDeletePayment(pm._id || pm.id)}
                            className="text-xs text-red-600 font-semibold hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove Method
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="font-heading text-xl sm:text-2xl text-charcoal">Notification Preferences</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Choose how Ratnaya communicates order status and new collection drops.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'orderUpdates', title: 'Order & Shipment Tracking Alerts', desc: 'Receive real-time SMS & email notifications for insured transit updates.' },
                    { key: 'priceAlerts', title: 'Gold Rate & Price Drop Alerts', desc: 'Get notified when gold rates drop or items on your wishlist go on sale.' },
                    { key: 'vipInvitations', title: 'VIP High Jewellery Concierge Invitations', desc: 'Exclusive early access to limited edition Polki & Solitaire drops.' },
                    { key: 'whatsappAlerts', title: 'WhatsApp Direct Concierge Updates', desc: 'Chat directly with seller artisans for custom sizing and video inspection.' }
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-4 border border-gray-100 bg-[#FAF6F0] rounded-sm">
                      <div>
                        <h4 className="text-sm font-semibold text-charcoal">{notif.title}</h4>
                        <p className="text-xs text-gray-500">{notif.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-gold cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL 1: ADD NEW ADDRESS TO MONGODB */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl border border-gold/40 overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-gold-dark" />
                <h3 className="font-heading text-lg text-charcoal">Add Shipping Address to MongoDB</h3>
              </div>
              <button onClick={() => setIsAddAddressOpen(false)} className="text-gray-400 hover:text-charcoal bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Address Label / Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="input-field w-full text-sm"
                >
                  <option value="Home">Home</option>
                  <option value="Work / Office">Work / Office</option>
                  <option value="Vacation Villa">Vacation Villa</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Malhotra"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Street / House / Building Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 702, Sea Pearl Towers, Carter Road, Bandra West"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 400050"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98201 44510"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chkDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="chkDefault" className="text-xs text-charcoal font-medium">Set as Default Delivery Address</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddAddressOpen(false)} className="btn-outline py-2.5 px-4 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold">
                  SAVE ADDRESS TO MONGODB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PAYMENT METHOD TO MONGODB */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl border border-gold/40 overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-gold-dark" />
                <h3 className="font-heading text-lg text-charcoal">Add Payment Method to MongoDB</h3>
              </div>
              <button onClick={() => setIsAddPaymentOpen(false)} className="text-gray-400 hover:text-charcoal bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Payment Method Type</label>
                <select
                  value={newPayment.type}
                  onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                  className="input-field w-full text-sm"
                >
                  <option value="Visa Credit Card">Visa Credit Card</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="UPI ID">UPI ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Bank Name / Provider</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank Imperial Access"
                  value={newPayment.bank}
                  onChange={(e) => setNewPayment({ ...newPayment, bank: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Card Number / UPI Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. •••• •••• •••• 4291 or priyamalhotra@okicici"
                  value={newPayment.number}
                  onChange={(e) => setNewPayment({ ...newPayment, number: e.target.value })}
                  className="input-field w-full text-sm font-mono"
                />
              </div>

              {newPayment.type !== 'UPI ID' && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="e.g. 09/28"
                    value={newPayment.expiry}
                    onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chkPayDefault"
                  checked={newPayment.isDefault}
                  onChange={(e) => setNewPayment({ ...newPayment, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="chkPayDefault" className="text-xs text-charcoal font-medium">Set as Default Payment Method</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddPaymentOpen(false)} className="btn-outline py-2.5 px-4 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold">
                  SAVE PAYMENT TO MONGODB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RETURN REQUEST MODAL */}
      {isReturnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-2xl border border-gold/40 overflow-hidden animate-fadeIn my-8">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <RotateCcw size={20} className="text-gold-dark" />
                <div>
                  <h3 className="font-heading text-lg text-charcoal">Request 14-Day Insured Return</h3>
                  <span className="text-xs text-gray-500">Order ID: {selectedOrderForReturn.id}</span>
                </div>
              </div>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-charcoal bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Order Item Summary */}
              <div className="bg-[#FAF6F0] p-3 rounded border border-gray-200 text-xs flex justify-between items-center">
                <div>
                  <strong className="text-charcoal block">{selectedOrderForReturn.items?.[0]?.name || 'Jewellery Item'}</strong>
                  <span className="text-gray-500">Sold by {selectedOrderForReturn.sellerName}</span>
                </div>
                <strong className="text-gold-dark text-sm">₹{(selectedOrderForReturn.totalAmount || 0).toLocaleString('en-IN')}</strong>
              </div>

              {/* Select Reason */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Reason for Return *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="input-field w-full text-sm"
                  required
                >
                  <option value="Defective or Damaged Item">Defective or Damaged Item</option>
                  <option value="Wrong Size / Fit Issue">Wrong Size / Fit Issue</option>
                  <option value="Metal Purity / Gemstone Mismatch">Metal Purity / Gemstone Mismatch</option>
                  <option value="Item Not as Described">Item Not as Described</option>
                  <option value="Changed Mind / Expectation Mismatch">Changed Mind / Expectation Mismatch</option>
                </select>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Details & Remarks *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe reason for return, condition of item & packaging..."
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>

              {/* Refund Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Select Refund Payout Method *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  {[
                    { id: 'Original Payment Source', label: 'Original Source' },
                    { id: 'UPI', label: 'UPI Handle' },
                    { id: 'Direct Bank Transfer', label: 'Bank Account' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRefundMethod(m.id)}
                      className={`p-2.5 text-xs rounded border text-center font-medium cursor-pointer transition-colors ${
                        refundMethod === m.id
                          ? 'border-gold bg-[#F5E7D6] text-gold-dark font-bold'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID Input */}
              {refundMethod === 'UPI' && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                  <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Your UPI ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. name@okicici or mobile@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input-field w-full text-sm font-mono"
                  />
                </div>
              )}

              {/* Direct Bank Details Inputs */}
              {refundMethod === 'Direct Bank Transfer' && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name as in bank passbook"
                      value={bankAccountDetails.accountHolder}
                      onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, accountHolder: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Bank Account Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="Account Number"
                        value={bankAccountDetails.accountNumber}
                        onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, accountNumber: e.target.value })}
                        className="input-field w-full text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase mb-1">IFSC Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HDFC0001234"
                        value={bankAccountDetails.ifscCode}
                        onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, ifscCode: e.target.value.toUpperCase() })}
                        className="input-field w-full text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Return Policy Notice */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[0.7rem] text-amber-900 leading-relaxed">
                <strong className="block mb-0.5 text-amber-950 font-bold">14-Day Insured Return Conditions:</strong>
                Item must be returned with unbroken tamper security tag, original BIS hallmark certificate, and original box packaging. Pickup is insured.
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsReturnModalOpen(false)} className="btn-outline py-2.5 px-4 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold flex items-center gap-1.5">
                  <RotateCcw size={14} /> SUBMIT RETURN REQUEST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CANCEL ORDER MODAL */}
      {isCancelModalOpen && selectedOrderForCancel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl border border-rose-300 overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50">
              <div className="flex items-center gap-2">
                <XCircle size={20} className="text-rose-600" />
                <h3 className="font-heading text-lg text-rose-900">Cancel Order {selectedOrderForCancel.id}</h3>
              </div>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-gray-400 hover:text-charcoal bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="p-6 space-y-4">
              <p className="text-xs text-gray-600">
                Are you sure you want to cancel order <strong>{selectedOrderForCancel.id}</strong>? If already paid, refund will be initiated to your original payment mode within 24 hours.
              </p>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input-field w-full text-sm"
                >
                  <option value="Changed my mind / Placed by mistake">Changed my mind / Placed by mistake</option>
                  <option value="Ordered alternative item">Ordered alternative item</option>
                  <option value="Delivery time too long">Delivery time too long</option>
                  <option value="Found better deal elsewhere">Found better deal elsewhere</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsCancelModalOpen(false)} className="btn-outline py-2 px-4 text-xs">
                  Keep Order
                </button>
                <button type="submit" className="py-2 px-5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer">
                  CONFIRM CANCELLATION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
