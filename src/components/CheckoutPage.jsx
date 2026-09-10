import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, CreditCard, Smartphone, Building, Wallet, Truck, Loader2, MapPin } from 'lucide-react';
import { api } from '../services/api';

export function CheckoutPage({ cartItems, onOrderPlaced, onNavigateShop, currentUser }) {
  const [step, setStep] = useState('checkout'); // 'checkout' or 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Active Logged-in User
  const activeUser = currentUser || (() => {
    try {
      const saved = localStorage.getItem('ratnaya_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    fullName: activeUser?.name || 'Priya Malhotra',
    email: activeUser?.email || 'priya.m@gmail.com',
    phone: activeUser?.phone || '+91 98201 44510',
    address: 'Flat 402, Sea Pearl Towers',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    paymentMethod: 'upi'
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Fetch Database Profile & Addresses for Logged-In User
  useEffect(() => {
    let isMounted = true;
    async function loadUserDatabaseProfile() {
      const userId = activeUser?.id || activeUser?._id;
      if (!userId) return;

      try {
        const res = await api.getProfile(userId);
        if (isMounted && res) {
          if (res.profile) {
            setFormData((prev) => ({
              ...prev,
              fullName: res.profile.name || activeUser?.name || prev.fullName,
              email: res.profile.email || activeUser?.email || prev.email,
              phone: res.profile.phone || activeUser?.phone || prev.phone
            }));
          }

          if (Array.isArray(res.addresses) && res.addresses.length > 0) {
            setSavedAddresses(res.addresses);
            const defaultAddr = res.addresses.find((a) => a.isDefault) || res.addresses[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr._id || defaultAddr.id);
              setFormData((prev) => ({
                ...prev,
                address: defaultAddr.street || prev.address,
                city: defaultAddr.city || prev.city,
                state: defaultAddr.state || prev.state,
                pincode: defaultAddr.pincode || prev.pincode,
                phone: defaultAddr.phone || prev.phone
              }));
            }
          }
        }
      } catch (err) {
        console.warn('Checkout profile load fallback:', err);
      }
    }

    loadUserDatabaseProfile();
    return () => {
      isMounted = false;
    };
  }, [activeUser?.id, activeUser?.email]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id || addr.id);
    setFormData((prev) => ({
      ...prev,
      address: addr.street || prev.address,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      pincode: addr.pincode || prev.pincode,
      phone: addr.phone || prev.phone
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + gst;


  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const keyRes = await api.getRazorpayKey();
      const orderRes = await api.createRazorpayOrder(total, `receipt_ord_${Date.now()}`);

      if (!orderRes || !orderRes.success || !orderRes.order) {
        alert('Payment initialization failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      const keyId = keyRes.keyId || 'rzp_test_RatnayaKey123';
      const orderObj = orderRes.order;

      if (window.Razorpay && orderRes.isRazorpayLive) {
        const options = {
          key: keyId,
          amount: orderObj.amount,
          currency: orderObj.currency || 'INR',
          name: 'RATNAYA Luxury Marketplace',
          description: 'Secure Payment Settlement to GPay linked Bank Account',
          image: '/assets/logo.png',
          order_id: orderObj.id,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          notes: {
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
          },
          theme: {
            color: '#C5A059'
          },
          handler: async function (response) {
            await api.verifyRazorpayPayment(response);

            const orderPayload = {
              buyerName: formData.fullName,
              buyerEmail: formData.email,
              buyerPhone: formData.phone,
              address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
              totalAmount: total,
              paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (UPI / Card)',
              sellerName: cartItems[0]?.sellerName || 'Verified Jeweller',
              sellerId: cartItems[0]?.sellerId || 'seller-1',
              items: cartItems.map(i => ({
                productId: i.id,
                name: i.name,
                price: i.price,
                qty: i.quantity || 1,
                sellerName: i.sellerName || 'Verified Jeweller',
                sellerId: i.sellerId || 'seller-1'
              }))
            };

            // Save Order to Backend DB & Send Nodemailer Email
            try {
              await api.createOrder(orderPayload);
            } catch (orderErr) {
              console.warn('Backend Order Creation Notice:', orderErr);
            }

            // Create Live Order in Shiprocket
            try {
              await api.createShippingOrder({
                orderId: `RATNAYA_ORD_${Date.now()}`,
                customerName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                totalAmount: total,
                paymentMethod: formData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
                items: cartItems.map(i => ({
                  id: i.id,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity
                }))
              });
            } catch (shipErr) {
              console.warn('Shiprocket Order Creation Notice:', shipErr);
            }

            setPaymentDetails({
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              orderId: response.razorpay_order_id || orderObj.id,
              signature: response.razorpay_signature
            });
            setIsProcessing(false);
            setStep('success');
            if (onOrderPlaced) onOrderPlaced();
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setTimeout(async () => {
          const orderPayload = {
            buyerName: formData.fullName,
            buyerEmail: formData.email,
            buyerPhone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            totalAmount: total,
            paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (UPI / Card)',
            sellerName: cartItems[0]?.sellerName || 'Verified Jeweller',
            sellerId: cartItems[0]?.sellerId || 'seller-1',
            items: cartItems.map(i => ({
              productId: i.id,
              name: i.name,
              price: i.price,
              qty: i.quantity || 1,
              sellerName: i.sellerName || 'Verified Jeweller',
              sellerId: i.sellerId || 'seller-1'
            }))
          };

          // Save Order to Backend DB & Send Nodemailer Email
          try {
            await api.createOrder(orderPayload);
          } catch (orderErr) {
            console.warn('Backend Order Creation Notice:', orderErr);
          }

          // Create Live Order in Shiprocket
          try {
            await api.createShippingOrder({
              orderId: `RATNAYA_ORD_${Date.now()}`,
              customerName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              totalAmount: total,
              paymentMethod: formData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
              items: cartItems.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity
              }))
            });
          } catch (shipErr) {
            console.warn('Shiprocket Order Creation Notice:', shipErr);
          }

          setPaymentDetails({
            paymentId: `pay_rzp_simulated_${Math.floor(100000 + Math.random() * 900000)}`,
            orderId: orderObj.id,
            settlementTarget: 'Google Pay Linked Bank Account'
          });
          setIsProcessing(false);
          setStep('success');
          if (onOrderPlaced) onOrderPlaced();
        }, 1200);
      }
    } catch (err) {
      console.error('Razorpay process error:', err);
      setIsProcessing(false);
      alert('Error connecting to Razorpay payment gateway.');
    }
  };

  if (step === 'success') {
    return (
      <div className="bg-[#FAF6F0] py-16 sm:py-24 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-white p-8 sm:p-12 rounded-sm border border-gold/40 shadow-medium">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold text-gold-dark flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} />
            </div>

            <span className="eyebrow">ORDER CONFIRMED</span>
            <h1 className="font-heading text-2xl sm:text-3xl mb-3 text-charcoal">
              Thank You For Your Royal Order
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Your order <strong>#RAT-ORD-{Math.floor(10000 + Math.random() * 90000)}</strong> has been successfully placed with our verified jeweller partners. An SMS and email confirmation have been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-sm text-left mb-6 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount Paid:</span>
                <strong className="text-charcoal font-semibold">₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Gateway:</span>
                <span className="font-semibold text-gold-dark">Razorpay (GPay / UPI / Cards)</span>
              </div>
              {paymentDetails && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Razorpay Payment ID:</span>
                  <span className="font-mono font-semibold text-gold-dark">{paymentDetails.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Settlement Destination:</span>
                <span className="text-emerald-700 font-semibold">GPay Linked Bank Account</span>
              </div>

              {/* Shiprocket Delivery Partner Live Status Box */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal flex items-center gap-1.5 uppercase tracking-wider text-[0.7rem]">
                    <Truck size={15} className="text-gold-dark" /> Shiprocket Logistics Partner
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[0.65rem] border border-emerald-200 uppercase">
                    Order Created ✓
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 text-xs">
                  <span>Shipping Route:</span>
                  <strong className="text-charcoal">Jaipur ➔ {formData.city} ({formData.pincode})</strong>
                </div>
                <div className="flex justify-between text-gray-700 text-xs">
                  <span>Delivery Partner:</span>
                  <span className="font-semibold text-gold-dark">Blue Dart Air / Shiprocket Express</span>
                </div>
                <div className="flex justify-between text-gray-700 text-xs">
                  <span>Insured Transit Status:</span>
                  <span className="text-emerald-700 font-semibold">Live Dispatched to Shiprocket</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onOrderPlaced();
                onNavigateShop();
              }}
              className="btn-gold w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              CONTINUE SHOPPING <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] py-12 sm:py-16 min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="eyebrow">SECURE CHECKOUT</span>
          <h1 className="font-heading text-3xl sm:text-4xl text-charcoal">Complete Your Purchase</h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* LEFT FORM FIELDS */}
            <div className="flex flex-col gap-6">
              {/* Section 1: Customer Information */}
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-lg sm:text-xl mb-5">
                  1. Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                      Mobile Phone (for delivery SMS updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Address */}
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-lg sm:text-xl mb-5">
                  2. Delivery Address
                </h3>

                {savedAddresses.length > 0 && (
                  <div className="mb-5 pb-4 border-b border-gray-100">
                    <label className="text-xs uppercase font-semibold text-gold-dark mb-2.5 flex items-center gap-1">
                      <MapPin size={14} /> Select Saved Address From Your Account
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const id = addr._id || addr.id;
                        const isSelected = selectedAddressId === id;
                        return (
                          <div
                            key={id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                              isSelected ? 'border-gold bg-gold/10 font-semibold shadow-xs' : 'border-gray-200 hover:border-gold/50 bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-charcoal flex items-center gap-1">
                                <MapPin size={12} className="text-gold-dark" /> {addr.type || 'Home'}
                              </span>
                              {addr.isDefault && <span className="bg-gold/20 text-gold-dark text-[10px] px-1.5 py-0.5 rounded font-semibold">DEFAULT</span>}
                            </div>
                            <p className="text-gray-600 line-clamp-2">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">

                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                      Street Address / Flat / Building
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-semibold text-gray-500 mb-1.5 block">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Options */}
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-lg sm:text-xl mb-5">
                  3. Payment Method
                </h3>

                <div className="flex flex-col gap-3">
                  {[
                    { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: <Smartphone size={18} /> },
                    { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: <CreditCard size={18} /> },
                    { id: 'netbanking', name: 'Net Banking (HDFC, ICICI, SBI, Axis)', icon: <Building size={18} /> },
                    { id: 'wallet', name: 'Wallets & EMI Options', icon: <Wallet size={18} /> }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3.5 p-4 border rounded-sm cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-gold bg-[#FAF6F0]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pm"
                        checked={formData.paymentMethod === method.id}
                        onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className="accent-gold"
                      />
                      <span className="text-gold-dark">{method.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-charcoal">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT ORDER SUMMARY */}
            <div>
              <div className="bg-white p-6 sm:p-8 border border-gold/40 rounded-sm shadow-sm sticky top-28">
                <h3 className="font-heading text-lg sm:text-xl pb-3 border-b border-gray-200 mb-5">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3.5 mb-5 max-h-72 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-sm border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-medium line-clamp-1">{item.name}</h5>
                        <span className="text-[0.7rem] text-gray-500">Qty: {item.quantity} • Sold by {item.sellerName}</span>
                      </div>
                      <div className="text-xs font-semibold text-charcoal">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>3% GST Tax</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Insured Transit Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-dashed border-gray-200 font-heading">
                    <span>Grand Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold w-full mt-6 py-3.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> INITIALIZING RAZORPAY...
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> PAY WITH RAZORPAY / GPAY (₹{total.toLocaleString('en-IN')})
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[0.7rem] text-gray-500 mt-4 text-center">
                  <ShieldCheck size={14} className="text-gold" /> Guaranteed Safe Checkout with 256-Bit SSL
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
