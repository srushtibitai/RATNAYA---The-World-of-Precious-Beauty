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
      <div className="bg-[#FAF6F0] py-16 sm:py-24 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-white p-8 sm:p-12 rounded-sm border border-gold/40 shadow-medium">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-5">
              <Store size={36} />
            </div>

            <span className="eyebrow">APPLICATION UNDER REVIEW</span>
            <h1 className="font-heading text-2xl sm:text-3xl mb-3 text-charcoal">
              Welcome to the Ratnaya Merchant Circle
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              Your application for <strong>{formData.businessName || 'Your Jewellery Business'}</strong> has been submitted. Our compliance team is verifying your GST <strong>({formData.gst || 'Submitted GST'})</strong> and BIS Hallmark documents.
            </p>

            <div className="bg-[#FAF6F0] p-4 rounded-sm text-left mb-6 text-xs sm:text-sm">
              <div className="font-semibold mb-1 text-charcoal">Status: Pending Admin Approval</div>
              <p className="text-gray-500">Approval decision will be notified via email within 24 business hours.</p>
            </div>

            <button onClick={onLoginSuccess} className="btn-gold w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2">
              ACCESS DEMO SELLER DASHBOARD <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] py-12 sm:py-16 min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8">
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Store size={14} /> RATNAYA SELLER NETWORK
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-charcoal">
            Register Your Fine Jewellery Business
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2 font-light">
            Expand your clientele and sell 100% hallmarked gold, certified diamonds, and heritage pieces on India's premier multi-vendor jewellery platform.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10 shadow-subtle flex flex-col gap-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-heading text-lg text-charcoal mb-1">1. Business Information</h3>
              <p className="text-xs text-gray-500">Enter registered trade name and store details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Jewellery Store / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heritage Kundan Jewellers"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Owner / Director Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Soni"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jeweller@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98290 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Primary City *</label>
                <input
                  type="text"
                  required
                  placeholder="Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">GST Registration Number *</label>
                <input
                  type="text"
                  required
                  placeholder="22AAAAA0000A1Z5"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            <button type="submit" className="btn-gold w-full py-3.5 text-xs font-semibold mt-4">
              SUBMIT SELLER APPLICATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
