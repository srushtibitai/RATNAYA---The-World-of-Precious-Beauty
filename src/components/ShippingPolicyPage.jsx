import React from 'react';
import { Truck, ShieldCheck, Clock, CheckCircle2, ArrowRight, Lock, MapPin, PackageCheck, AlertTriangle } from 'lucide-react';

export function ShippingPolicyPage({ onNavigateShop, onNavigateContact }) {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <Truck size={16} /> RATNAYA INSURED TRANSIT GUARANTEE
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-charcoal mb-4">
            Insured Express Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
            Discover our comprehensive logistics protocols, 100% full-value transit insurance coverage, tamper-proof serialized packaging standards, and delivery OTP verification guidelines.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-12 rounded-sm border border-gold/40 shadow-medium text-xs sm:text-sm text-gray-700 leading-relaxed space-y-8">
          {/* Section 1 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <ShieldCheck className="text-gold-dark shrink-0" size={22} /> 1. 100% Full-Value In-Transit Insurance Protection
            </h2>
            <p>
              At Ratnaya Marketplace, we recognize that luxury gold, diamond, and precious gemstone creations carry significant monetary and emotional value. Every single order dispatched from our registered merchant ateliers is fully covered under an all-risk Transit Insurance Policy underwritten by leading national insurance corporations.
            </p>
            <p className="mt-3">
              This policy provides 100% financial protection against loss, theft, robbery, pilferage, or accidental transit damage from the instant the package departs our secure vault until it is safely received and confirmed by you via Delivery OTP verification.
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <Lock className="text-gold-dark shrink-0" size={22} /> 2. Non-Descript Packaging & Serialized Security Seals
            </h2>
            <p>
              To maintain absolute confidentiality and safeguard high-value goods against transit targeting:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong>Zero External Branding:</strong> The outer shipping pouch contains NO mention of words like "Gold", "Diamonds", "Jewellery", or "Ratnaya". Packages are labeled under our discreet logistics dispatch identifier.
              </li>
              <li>
                <strong>Serialized Tamper-Evident Seals:</strong> Every package is sealed in a heavy-duty, tamper-evident security bag featuring a unique barcoded serial number. If opened or tampered with, the seal permanently displays the word "VOID".
              </li>
              <li>
                <strong>High-Security Inner Presentation Box:</strong> Inside the discreet outer bag, your jewellery rests securely in a hard-shell wooden velvet presentation box accompanied by physical BIS Hallmark HUID documents and GIA/IGI certificates.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <Clock className="text-gold-dark shrink-0" size={22} /> 3. Express Transit Timelines Across India
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
              <div className="bg-[#FAF6F0] p-4 rounded-sm border border-gray-200">
                <strong className="block text-charcoal text-base font-heading">Metro Cities</strong>
                <span className="text-xs text-gray-500">2 – 4 Business Days</span>
              </div>
              <div className="bg-[#FAF6F0] p-4 rounded-sm border border-gray-200">
                <strong className="block text-charcoal text-base font-heading">Tier-2 Cities</strong>
                <span className="text-xs text-gray-500">3 – 5 Business Days</span>
              </div>
              <div className="bg-[#FAF6F0] p-4 rounded-sm border border-gray-200">
                <strong className="block text-charcoal text-base font-heading">Bespoke / Custom Sizes</strong>
                <span className="text-xs text-gray-500">5 – 7 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
