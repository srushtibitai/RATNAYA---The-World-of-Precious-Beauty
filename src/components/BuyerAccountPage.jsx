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
  Trash2
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

  // Fetch Profile, Addresses & Payments from MongoDB API
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
    loadProfileData();
    return () => {
      isMounted = false;
    };
  }, [userId, user]);

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

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-xl sm:text-2xl mb-2">
                  My Orders & Shipment Tracking
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Track insured courier shipments, view BIS hallmarking certificates, and manage returns.
                </p>

                <div className="flex flex-col gap-6">
                  {MOCK_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-sm p-5 bg-[#FAF6F0]"
                    >
                      <div className="flex flex-col sm:flex-row justify-between pb-4 mb-4 border-b border-gray-200 gap-2">
                        <div>
                          <strong className="text-sm block text-charcoal">{order.id}</strong>
                          <span className="text-xs text-gray-500">
                            Placed on {order.date} • Sold by <strong>{order.sellerName}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="badge-approved text-xs flex items-center gap-1">
                            <CheckCircle2 size={12} /> {order.status}
                          </span>
                          <strong className="text-base text-charcoal">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Truck size={18} className="text-gold-dark shrink-0" />
                          <div className="text-xs">
                            <span className="text-gray-500 block">Insured Transit Tracking:</span>
                            <strong className="font-mono text-charcoal">{order.trackingCode} ({order.courier})</strong>
                          </div>
                        </div>
                        <button onClick={onNavigateShop} className="btn-outline-gold py-1.5 px-3 text-xs">
                          Reorder Items
                        </button>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
}
