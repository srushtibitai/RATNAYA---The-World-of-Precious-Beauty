import React from 'react';
import { FileText, ShieldCheck, Award, Lock, ArrowRight, CheckCircle2, Scale, RefreshCw } from 'lucide-react';

export function TermsPage({ onNavigateShop, onNavigateContact }) {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <FileText size={16} /> RATNAYA LUXURY COMMERCE CODE
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-charcoal mb-4">
            Terms & Conditions of Luxury Commerce
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
            Governing rules, 100% BIS Hallmarking mandates, diamond certification standards, spot gold rate locking, and merchant compliance code.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-12 rounded-sm border border-gold/40 shadow-medium text-xs sm:text-sm text-gray-700 leading-relaxed space-y-8">
          {/* Section 1 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <Award className="text-gold-dark shrink-0" size={22} /> 1. Mandatory BIS Hallmarking & Pure Metal Guarantees
            </h2>
            <p>
              Every gold jewellery article offered on Ratnaya Marketplace must strictly comply with the Bureau of Indian Standards (BIS) Hallmarking Order. All gold jewellery items are guaranteed 100% BIS 916 (22 Karat) or BIS 750 (18 Karat) pure gold.
            </p>
            <p className="mt-3">
              Each creation carries mandatory laser-engraved BIS Hallmarking marks comprising:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>BIS Logo:</strong> Official triangular Bureau of Indian Standards stamp.</li>
              <li><strong>Purity Mark:</strong> Karatage & fineness (e.g., 22K916 for 22 Karat gold).</li>
              <li><strong>6-Digit Alphanumeric HUID:</strong> Unique Hallmark Identification Code enabling instant verification via the BIS Care Mobile App.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <Scale className="text-gold-dark shrink-0" size={22} /> 2. Spot Gold Rate Locking Policy
            </h2>
            <p>
              Prices on Ratnaya calculate live market rates for gold weight, certified gemstone caratage, and craftsmanship making charges. Once an order is successfully completed with payment, your purchase price is locked permanently and protected against any gold price escalations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
