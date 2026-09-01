import React, { useState } from 'react';
import { Store, Upload, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export function SellerRegisterPage({ onLoginSuccess }) {
  const [step, setStep] = useState('form'); // 'form' or 'submitted'
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gst: '',
    pan: '',
    bankAccount: '',
    ifsc: '',
    category: 'Gold & Kundan Jewellery'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('submitted');
  };

  if (step === 'submitted') {
    return (
      <div style={{ backgroundColor: '#FAF6F0', padding: '100px 0', minHeight: '80vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '620px' }}>
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
                backgroundColor: '#FEF7E0',
                color: '#B06000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <Store size={36} />
            </div>

            <span className="eyebrow">APPLICATION UNDER REVIEW</span>
            <h1 style={{ fontSize: '2rem', fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>
              Welcome to the Ratnaya Merchant Circle
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.7 }}>
              Your application for <strong>{formData.businessName || 'Your Jewellery Business'}</strong> has been submitted. Our compliance team is verifying your GST <strong>({formData.gst || 'Submitted GST'})</strong> and BIS Hallmark documents.
            </p>

            <div style={{ backgroundColor: '#FAF6F0', padding: '16px', borderRadius: '4px', textAlign: 'left', marginBottom: '28px', fontSize: '0.84rem' }}>
              <div style={{ fontWeight: '600', marginBottom: '6px' }}>Status: Pending Admin Approval</div>
              <p style={{ color: '#666' }}>Approval decision will be notified via email within 24 business hours.</p>
            </div>

            <button onClick={onLoginSuccess} className="btn-gold" style={{ width: '100%', padding: '14px' }}>
              ACCESS DEMO SELLER DASHBOARD <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '60px 0 100px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Store size={14} /> RATNAYA SELLER NETWORK
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: "'Marcellus', serif" }}>
            Register Your Fine Jewellery Business
          </h1>
          <p style={{ fontSize: '0.96rem', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '10px auto 0' }}>
            Expand your clientele and sell 100% hallmarked gold, certified diamonds, and heritage pieces on India's premier multi-vendor jewellery platform.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '36px',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px'
            }}
          >
            {/* Business Information */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: "'Marcellus', serif", marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                1. Business & Owner Credentials
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    Registered Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Jaipur Jewels Pvt Ltd"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    Owner / Managing Director Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Rathore"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@jeweller.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    Mobile / Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98290 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Tax & Legal Documents */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: "'Marcellus', serif", marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                2. Legal & Tax Verification (GST / PAN / BIS)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    GST Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08AAAAA0000A1Z5"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
                    Primary Jewellery Craft Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Gold & Kundan Jewellery">Gold & Kundan Jewellery</option>
                    <option value="Certified Diamond Solitaires">Certified Diamond Solitaires</option>
                    <option value="Polki & Nizam Heirlooms">Polki & Nizam Heirlooms</option>
                    <option value="Handcrafted Filigree & Silver">Handcrafted Filigree & Silver</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KYC Upload Mock */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: "'Marcellus', serif", marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                3. KYC & BIS Hallmark License Upload
              </h3>
              <div
                style={{
                  border: '2px dashed var(--color-border)',
                  padding: '24px',
                  textAlign: 'center',
                  borderRadius: '4px',
                  backgroundColor: '#FAF6F0'
                }}
              >
                <Upload size={32} color="var(--color-gold-dark)" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: '500' }}>
                  Click or drag files to upload BIS Hallmark License & GST Certificate
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                  Supports PDF, JPG, PNG up to 10MB
                </div>
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ padding: '16px' }}>
              SUBMIT SELLER APPLICATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
