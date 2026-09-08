import React, { useState } from 'react';
import { HelpCircle, Sparkles, ChevronDown, ShieldCheck, Truck, Lock, Award, RotateCcw, ArrowRight } from 'lucide-react';

export function FaqPage({ onNavigateShop, onNavigateContact }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'How do I verify the 100% BIS Hallmark on gold jewellery bought from Ratnaya?',
      a: 'Every gold jewellery piece listed on Ratnaya carries mandatory Bureau of Indian Standards (BIS) 6-digit HUID (Hallmark Unique Identification) laser engraving. You can verify the authenticity, gold purity (22K 916 / 18K 750), and hallmarking center details instantly using the official BIS Care Mobile App by entering the engraved HUID code.'
    },
    {
      q: 'Are the solitaires and gemstone creations certified by GIA, IGI, or SGL?',
      a: 'Yes! All natural diamond solitaires, precious emeralds, Burmese rubies, and polki heirlooms come with physical authenticity certificates from accredited international laboratories including GIA (Gemological Institute of America), IGI (International Gemological Institute), or SGL (Solitaire Gemological Laboratories).'
    },
    {
      q: 'What happens if my shipment package is damaged or tampered with in transit?',
      a: 'All Ratnaya dispatches travel in double-walled, tamper-evident security bags secured with unique serialized seals. In the rare event that the outer seal appears broken or compromised, do not share the delivery OTP with the courier executive. Contact Ratnaya Urgent Support (+91 98200 00000) immediately for hassle-free replacement under our 100% Transit Insurance.'
    },
    {
      q: 'Can I request custom ring sizes, bangle sizes, or necklace chain lengths?',
      a: 'Absolutely! During checkout or by contacting patron support within 12 hours of placing an order, you can specify exact ring sizes (US 4 to 12 / Indian 6 to 30), bangle diameters (2.2, 2.4, 2.6, 2.8), or custom chain extensions. Our master artisans adjust sizing before final hallmarking.'
    },
    {
      q: 'How does the 14-Day Easy Return and Lifetime Buyback Guarantee work?',
      a: 'Ratnaya offers a 14-Day No-Questions-Asked Return Policy for standard items returned in unworn condition with original security tags and certificates intact. Furthermore, all gold and diamond jewellery purchases qualify for Lifetime Exchange & Buyback at prevailing gold market rates across our verified jeweller network.'
    },
    {
      q: 'Is paying high amounts online via UPI (Google Pay), Cards, or Net Banking safe?',
      a: 'Yes, 100% secure. Payments on Ratnaya are processed through RBI-regulated Razorpay payment gateways using 256-Bit SSL military-grade encryption and 3D Secure OTP verification. Funds are held in RBI-compliant escrow until your delivery is successfully verified.'
    },
    {
      q: 'How are real-time gold rates and making charges calculated?',
      a: 'Prices on Ratnaya transparently break down the Gold Weight, Gold Purity Rate (22K/18K prevailing market rate), Gemstone Weight, and Making Charges (artisan wirework/Kundan crafting fee) + 3% GST. Once your order is placed, your purchase price is locked and protected against any gold market spikes.'
    },
    {
      q: 'How can independent heritage jewellers and artisans list their collections on Ratnaya?',
      a: 'Verified jeweller merchants can register via our Seller Portal by submitting GSTIN, PAN, and BIS Hallmarking License credentials. Once audited by our Compliance Officers, merchants receive dedicated seller dashboards to list inventory and track automated bank payouts.'
    },
    {
      q: 'What payment modes are accepted on Ratnaya Checkout?',
      a: 'We accept Razorpay payments via Google Pay, PhonePe, Paytm, BHIM UPI, All Major Credit Cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ Indian Banks, and No-Cost EMI options.'
    },
    {
      q: 'Are custom engraved items eligible for returns?',
      a: 'Custom engraved or personalized name jewellery items are non-returnable unless defective. However, they remain 100% eligible for our Lifetime Exchange & Buyback program.'
    }
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <HelpCircle size={16} /> PATRON KNOWLEDGE BASE
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-charcoal">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-3 font-light">
            Everything you need to know about 6-digit BIS Hallmarking, insured transit shipping, GIA solitaire authenticity, and merchant payouts.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-6 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div key={idx} className="border-b border-gray-100 last:border-b-0 py-3 sm:py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer focus:outline-none"
                >
                  <h3 className="font-heading text-base sm:text-lg text-charcoal font-medium">
                    {faq.q}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`text-gold-dark shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3 pt-2 border-t border-gray-50 font-light">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Need Assistance Footer Card */}
        <div className="bg-[#111111] text-white p-8 sm:p-10 rounded-sm text-center border border-gold/30">
          <h3 className="font-heading text-2xl mb-2 text-white">Still Have Questions for Our Gemologists?</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6">
            Our royal patron concierge team is available 7 days a week to answer custom design requests or hallmarking verifications.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={onNavigateContact} className="btn-gold py-3 px-6 text-xs">
              CONTACT CONCIERGE <ArrowRight size={14} />
            </button>
            <button onClick={onNavigateShop} className="btn-outline py-3 px-6 text-xs text-white border-white">
              EXPLORE JEWELLERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
