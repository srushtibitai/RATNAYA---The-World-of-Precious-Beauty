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
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Banner */}
      <div className="bg-[#111111] text-white py-12 sm:py-16 text-center border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-xs text-gold tracking-widest uppercase mb-2">
            Home / Contact Us
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-white">
            We Are At Your Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 font-light">
            Our royal concierge team and gemologists are available to assist with bespoke orders and inquiries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-10 rounded-sm border border-gray-200 shadow-sm">
            <h3 className="font-heading text-xl sm:text-2xl mb-6">Send Us a Message</h3>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-sm text-center border border-emerald-200">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-700" />
                <h4 className="font-heading text-lg my-1">Thank You for Reaching Out</h4>
                <p className="text-xs sm:text-sm">Our Ratnaya concierge will contact you within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Your Inquiry / Message *</label>
                  <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" />
                </div>
                <button type="submit" className="btn-gold py-3.5 text-xs font-semibold flex items-center justify-center gap-2">
                  <Send size={16} /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* Contact Cards & Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 border border-gray-200 rounded-sm flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F5E7D6] text-gold-dark flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h5 className="text-xs uppercase text-gray-500 font-medium">Direct Concierge Hotline</h5>
                <div className="text-base sm:text-lg font-semibold text-charcoal">+91 1800 266 8899</div>
                <span className="text-xs text-gray-400">Toll Free Across India (10 AM - 8 PM IST)</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-sm flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F5E7D6] text-gold-dark flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h5 className="text-xs uppercase text-gray-500 font-medium">Support & Merchant Desk</h5>
                <div className="text-base sm:text-lg font-semibold text-charcoal">concierge@ratnaya.com</div>
                <span className="text-xs text-gray-400">Average response time: 2 hours</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-sm flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F5E7D6] text-gold-dark flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h5 className="text-xs uppercase text-gray-500 font-medium">Corporate Headquarters</h5>
                <div className="text-sm sm:text-base font-semibold text-charcoal">Ratnaya Jewels Tower, Johari Bazaar</div>
                <span className="text-xs text-gray-400">Jaipur, Rajasthan 302003, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
