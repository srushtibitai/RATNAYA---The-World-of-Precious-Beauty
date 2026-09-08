import React from 'react';
import { Lock, ShieldCheck, FileText, ArrowRight, Eye, Server, Smartphone, Cookie } from 'lucide-react';

export function PrivacyPolicyPage({ onNavigateShop, onNavigateContact }) {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <Lock size={16} /> ISO 27001 & DATA PROTECTION GOVERNANCE
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-charcoal mb-4">
            Privacy, Data Security & Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
            How we protect your personal information, enforce zero card storage, implement 256-bit SSL encryption, and adhere to IT Act 2000 data privacy laws.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-12 rounded-sm border border-gold/40 shadow-medium text-xs sm:text-sm text-gray-700 leading-relaxed space-y-8">
          {/* Section 1 */}
          <div className="border-b border-dashed border-gray-200 pb-6">
            <h2 className="font-heading text-lg sm:text-2xl text-charcoal mb-3 flex items-center gap-2">
              <Eye className="text-gold-dark shrink-0" size={22} /> 1. Information We Collect & Legal Compliance Purpose
            </h2>
            <p>
              Ratnaya Marketplace collects minimal necessary personal information required to execute secure luxury jewellery transactions, fulfill insured logistics delivery, and comply with Income Tax and Anti-Money Laundering (AML) directives in India:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong>Patron Account Details:</strong> Full Name, Mobile Phone Number, Email Address, Billing Address, and Insured Shipping Address.
              </li>
              <li>
                <strong>Government Anti-Money Laundering (AML) Compliance:</strong> PAN Card details for order values exceeding ₹200,000 as legally mandated by the Income Tax Department of India.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
