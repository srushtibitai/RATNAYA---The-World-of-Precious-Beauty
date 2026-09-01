import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', paddingBottom: '100px' }}>
      {/* Banner */}
      <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border-gold)' }}>
        <div className="container">
          <div style={{ fontSize: '0.78rem', color: '#C5A059', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Home / Contact Us
          </div>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', fontFamily: "'Marcellus', serif" }}>
            We Are At Your Service
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#AAA', maxWidth: '540px', margin: '12px auto 0' }}>
            Our royal concierge team and gemologists are available to assist with bespoke orders and inquiries.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }} className="contact-grid">
          {/* Contact Form */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>Send Us a Message</h3>

            {submitted ? (
              <div style={{ backgroundColor: '#E6F4EA', color: '#137333', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                <CheckCircle2 size={32} style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1.1rem', margin: '4px 0' }}>Thank You for Reaching Out</h4>
                <p style={{ fontSize: '0.86rem' }}>Our Ratnaya concierge will contact you within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>Your Inquiry / Message *</label>
                  <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" />
                </div>
                <button type="submit" className="btn-gold" style={{ padding: '14px' }}>
                  <Send size={16} /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* Contact Cards & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#777' }}>Direct Concierge Hotline</h5>
                <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-charcoal)' }}>+91 1800 266 8899</div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Toll Free Across India (10 AM - 8 PM IST)</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#777' }}>Support & Merchant Desk</h5>
                <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-charcoal)' }}>concierge@ratnaya.com</div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Average response time: 2 hours</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#777' }}>Corporate Headquarters</h5>
                <div style={{ fontSize: '0.96rem', fontWeight: '500', color: 'var(--color-charcoal)' }}>Ratnaya Jewels Tower, Johari Bazaar</div>
                <span style={{ fontSize: '0.78rem', color: '#888' }}>Jaipur, Rajasthan 302003, India</span>
              </div>
            </div>

            {/* Map Frame */}
            <div style={{ aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <iframe
                title="Ratnaya Location Map"
                src="https://maps.google.com/maps?q=Johari%20Bazaar%20Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
