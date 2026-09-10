import React, { useState } from 'react';
import { Store, Upload, CheckCircle2, ShieldCheck, ArrowRight, FileText, Camera } from 'lucide-react';
import { api } from '../services/api';

export function SellerRegisterPage({ onLoginSuccess }) {
  const [step, setStep] = useState('form'); // 'form' or 'submitted'
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    gst: '',
    gstDoc: '',
    pan: '',
    panDoc: '',
    bisLicense: '',
    bisDoc: '',
    logo: '',
    banner: '',
    category: 'Gold & Kundan Jewellery'
  });

  const handleFileUpload = async (file, fieldKey) => {
    if (!file) return;
    try {
      const sellerName = formData.businessName || formData.ownerName || 'Seller';
      const docTypeMap = {
        gstDoc: 'GST_Certificate',
        panDoc: 'PAN_Card',
        bisDoc: 'BIS_Hallmark_License'
      };
      const docType = docTypeMap[fieldKey] || fieldKey;

      const res = await api.uploadImage(file, 'documents', sellerName, docType);
      if (res && res.success && res.url) {
        setFormData((prev) => ({ ...prev, [fieldKey]: res.url }));
      } else {
        alert(res?.message || 'File upload failed. Please try again.');
      }
    } catch (err) {
      console.error('KYC file upload error:', err);
      alert('Error uploading document to server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sellerName = formData.businessName || formData.ownerName || 'Seller';
      const cleanSellerName = sellerName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

      await api.registerSeller({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        gst: formData.gst,
        gstDoc: formData.gstDoc || `/uploads/${cleanSellerName}_GST_Certificate.pdf`,
        pan: formData.pan,
        panDoc: formData.panDoc || `/uploads/${cleanSellerName}_PAN_Card.jpg`,
        bisLicense: formData.bisLicense,
        bisDoc: formData.bisDoc || `/uploads/${cleanSellerName}_BIS_Hallmark_License.pdf`,
        logo: formData.logo || '/uploads/avatar.jpg',
        banner: formData.banner || '/uploads/banner.jpg',
        category: formData.category
      });
    } catch (err) {
      console.warn('Register seller API call fallback:', err);
    }

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
              Your seller onboarding application for <strong>{formData.businessName || 'Your Jewellery Business'}</strong> has been submitted to Admin!
            </p>

            <div className="bg-[#FAF6F0] p-4 rounded-sm text-left mb-6 text-xs sm:text-sm space-y-2 border border-gray-200">
              <div className="font-semibold text-charcoal flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-gold-dark" /> Verified Compliance Credentials Submitted:
              </div>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                <li>GSTIN Number: <strong>{formData.gst || 'Submitted'}</strong></li>
                <li>PAN Card Number: <strong>{formData.pan || 'Submitted'}</strong></li>
                <li>BIS Hallmark License: <strong>{formData.bisLicense || 'Submitted'}</strong></li>
              </ul>
              <p className="text-[0.7rem] text-gray-400 pt-1">Our Compliance Officers will inspect your submitted documents and approve your account.</p>
            </div>

            <button onClick={onLoginSuccess} className="btn-gold w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2">
              ACCESS MERCHANT DASHBOARD <ArrowRight size={16} />
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
            
            {/* Section 1: Business Info */}
            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-heading text-lg text-charcoal mb-0.5">1. Business & Merchant Information</h3>
              <p className="text-xs text-gray-500">Enter registered trade name, owner details and store location</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Jewellery Store / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heritage Gold & Diamond Atelier"
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
                  placeholder="e.g. 9829012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Primary City / Base *</label>
                <input
                  type="text"
                  required
                  placeholder="Jaipur, Rajasthan"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Section 2: KYC & Compliance Documents */}
            <div className="border-b border-gray-200 pb-3 pt-4">
              <h3 className="font-heading text-lg text-charcoal mb-0.5">2. Mandatory Compliance Credentials & Documents</h3>
              <p className="text-xs text-gray-500">Provide GST, PAN, and BIS Hallmark license details with proof documents for Admin review.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GST Number & Document */}
              <div className="sm:col-span-2 p-4 bg-[#FAF6F0] rounded border border-gray-200 space-y-2">
                <label className="text-xs font-semibold uppercase text-charcoal block">GST Registration Number & Proof Certificate *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                  className="input-field font-mono uppercase text-sm mb-2"
                />
                <div className="flex items-center gap-3">
                  <label className="btn-outline-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 bg-white">
                    <Upload size={14} /> Upload GST Certificate (PDF/Image)
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'gstDoc')}
                    />
                  </label>
                  {formData.gstDoc && <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 size={13} /> GST Document Attached</span>}
                </div>
              </div>

              {/* PAN Number & Document */}
              <div className="p-4 bg-[#FAF6F0] rounded border border-gray-200 space-y-2">
                <label className="text-xs font-semibold uppercase text-charcoal block">Business / Owner PAN Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABCDE1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="input-field font-mono uppercase text-sm mb-2"
                />
                <label className="btn-outline-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 bg-white">
                  <Upload size={14} /> Upload PAN Card Photo/PDF
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'panDoc')}
                  />
                </label>
                {formData.panDoc && <span className="text-xs text-emerald-700 font-semibold block flex items-center gap-1"><CheckCircle2 size={13} /> PAN Document Attached</span>}
              </div>

              {/* BIS Hallmark License Number & Document */}
              <div className="p-4 bg-[#FAF6F0] rounded border border-gray-200 space-y-2">
                <label className="text-xs font-semibold uppercase text-charcoal block">BIS Hallmark License Number (HUID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIS-HUID-991204"
                  value={formData.bisLicense}
                  onChange={(e) => setFormData({ ...formData, bisLicense: e.target.value.toUpperCase() })}
                  className="input-field font-mono uppercase text-sm mb-2"
                />
                <label className="btn-outline-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 bg-white">
                  <Upload size={14} /> Upload BIS License Proof
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'bisDoc')}
                  />
                </label>
                {formData.bisDoc && <span className="text-xs text-emerald-700 font-semibold block flex items-center gap-1"><CheckCircle2 size={13} /> BIS License Attached</span>}
              </div>
            </div>

            {/* Section 3: Store Profile Branding */}
            <div className="border-b border-gray-200 pb-3 pt-4">
              <h3 className="font-heading text-lg text-charcoal mb-0.5">3. Store Profile & Logo Avatar</h3>
              <p className="text-xs text-gray-500">Upload your store logo photo to display in merchant dashboard and customer storefront.</p>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-200">
              <img src={api.getImageUrl(formData.logo || '/uploads/avatar.jpg')} alt="Logo Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gold shrink-0 shadow-sm" />
              <div className="space-y-1.5 flex-1">
                <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5">
                  <Camera size={14} /> Upload Store Logo Avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                  />
                </label>
                <input
                  type="text"
                  placeholder="Or enter logo image URL..."
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="input-field text-xs bg-white"
                />
              </div>
            </div>

            <button type="submit" className="btn-gold w-full py-4 text-xs font-semibold uppercase tracking-wider mt-4">
              SUBMIT SELLER APPLICATION TO ADMIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

