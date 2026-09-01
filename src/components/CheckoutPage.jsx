import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, CreditCard, Smartphone, Building, Wallet, Truck } from 'lucide-react';

export function CheckoutPage({ cartItems, onOrderPlaced, onNavigateShop }) {
  const [step, setStep] = useState('checkout'); // 'checkout' or 'success'
  const [formData, setFormData] = useState({
    fullName: 'Priya Malhotra',
    email: 'priya.m@gmail.com',
    phone: '+91 98201 44510',
    address: 'Flat 402, Sea Pearl Towers',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    paymentMethod: 'upi'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + gst;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div style={{ backgroundColor: '#FAF6F0', padding: '100px 0', minHeight: '80vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '48px 36px',
              borderRadius: '4px',
              border: '1px solid var(--color-border-gold)',
              boxShadow: 'var(--shadow-medium)'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <span className="eyebrow">ORDER CONFIRMED</span>
            <h1 style={{ fontSize: '2rem', fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>
              Thank You For Your Royal Order
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.7 }}>
              Your order <strong>#RAT-ORD-{Math.floor(10000 + Math.random() * 90000)}</strong> has been successfully placed with our verified jeweller partners. An SMS and email confirmation have been sent to <strong>{formData.email}</strong>.
            </p>

            <div
              style={{
                backgroundColor: '#FAF6F0',
                padding: '20px',
                borderRadius: '4px',
                textAlign: 'left',
                marginBottom: '28px',
                fontSize: '0.86rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#777' }}>Total Amount Paid:</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)' }}>₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#777' }}>Payment Method:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: '500' }}>{formData.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#777' }}>Delivery Address:</span>
                <span style={{ fontWeight: '500' }}>{formData.city}, {formData.state}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onOrderPlaced();
                onNavigateShop();
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '16px' }}
            >
              CONTINUE SHOPPING <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '60px 0 100px', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">SECURE CHECKOUT</span>
          <h1 style={{ fontSize: '2.4rem', fontFamily: "'Marcellus', serif" }}>Complete Your Purchase</h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '40px'
            }}
            className="checkout-grid"
          >
            {/* LEFT FORM FIELDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Section 1: Customer Information */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: "'Marcellus', serif" }}>
                  1. Customer Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
                    <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: "'Marcellus', serif" }}>
                  2. Delivery Address
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
                      <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
                      <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
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
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: "'Marcellus', serif" }}>
                  3. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: <Smartphone size={18} /> },
                    { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: <CreditCard size={18} /> },
                    { id: 'netbanking', name: 'Net Banking (HDFC, ICICI, SBI, Axis)', icon: <Building size={18} /> },
                    { id: 'wallet', name: 'Wallets & EMI Options', icon: <Wallet size={18} /> }
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px',
                        border: formData.paymentMethod === method.id ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                        backgroundColor: formData.paymentMethod === method.id ? 'var(--bg-primary)' : '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="pm"
                        checked={formData.paymentMethod === method.id}
                        onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                      />
                      <span style={{ color: 'var(--color-gold-dark)' }}>{method.icon}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT ORDER SUMMARY */}
            <div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '28px',
                  border: '1px solid var(--color-border-gold)',
                  borderRadius: '4px',
                  position: 'sticky',
                  top: '100px'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: "'Marcellus', serif", borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: 1.2 }}>{item.name}</h5>
                        <span style={{ fontSize: '0.74rem', color: '#777' }}>Qty: {item.quantity} • Sold by {item.sellerName}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                    <span>Items Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                    <span>3% GST Tax</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#137333' }}>
                    <span>Insured Transit Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--color-charcoal)',
                      paddingTop: '12px',
                      borderTop: '1px dashed var(--color-border)',
                      fontFamily: "'Marcellus', serif"
                    }}
                  >
                    <span>Grand Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '24px', padding: '16px' }}
                >
                  <Lock size={16} /> PLACE ORDER (₹{total.toLocaleString('en-IN')})
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: '#777', marginTop: '16px', textAlign: 'center' }}>
                  <ShieldCheck size={14} color="var(--color-gold)" /> Guaranteed Safe Checkout with 256-Bit SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
