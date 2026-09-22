import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DETAILED_FAQS } from '../data/faqData';

export function FaqPage({ onNavigateShop, onNavigateContact }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = DETAILED_FAQS.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
  });

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
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mt-3 font-light leading-relaxed">
            Comprehensive answers regarding 6-digit BIS Hallmarking, insured transit shipping, GIA solitaire certification, custom sizing, lifetime buybacks, and merchant onboarding.
          </p>

          {/* FAQ Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by topic (e.g. Hallmark, GIA, Shipping, Buyback, Payment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-xs sm:text-sm border border-gold/40 rounded-full shadow-sm focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-charcoal cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Topics Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['All Questions', 'BIS Hallmark', 'GIA Diamonds', 'Transit Insurance', 'Custom Sizing', 'Lifetime Buyback'].map((topic) => {
            const isAll = topic === 'All Questions';
            const keyword = isAll ? '' : topic.toLowerCase();
            const isActive = isAll ? !searchQuery : searchQuery.toLowerCase() === keyword;

            return (
              <button
                key={topic}
                onClick={() => setSearchQuery(isAll ? '' : topic)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold-dark text-white font-semibold shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ Items */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm p-12 text-center shadow-xs mb-12">
            <Search className="mx-auto text-gold-dark mb-3" size={36} />
            <h3 className="font-heading text-xl text-charcoal mb-1">No Matching FAQs Found</h3>
            <p className="text-xs text-gray-500 mb-4">No questions matched your search query "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-gold py-2.5 px-5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-8 mb-12">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong>{filteredFaqs.length}</strong> Detailed Guide Answers
              </span>
              <button
                onClick={() => {
                  if (openFaqIndex === 'ALL') {
                    setOpenFaqIndex(null);
                  } else {
                    setOpenFaqIndex('ALL');
                  }
                }}
                className="text-xs text-gold-dark hover:underline font-semibold cursor-pointer"
              >
                {openFaqIndex === 'ALL' ? 'Collapse All' : 'Expand All Answers'}
              </button>
            </div>

            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === 'ALL' || openFaqIndex === idx;

              return (
                <div key={faq.id || idx} className="border-b border-gray-100 last:border-b-0 py-4 sm:py-5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-start justify-between gap-4 bg-transparent border-none cursor-pointer focus:outline-none group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-gold/15 text-gold-dark font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <h3 className="font-heading text-base sm:text-lg text-charcoal font-medium group-hover:text-gold-dark transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gold-dark shrink-0 transition-transform duration-300 mt-1 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-2 mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light whitespace-pre-line space-y-2">
                        {faq.a}
                      </div>

                      <div className="mt-4 pt-3 flex items-center gap-4 text-[0.72rem] text-gray-400 border-t border-dashed border-gray-100">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 size={13} /> Verified Bureau Policy
                        </span>
                        <span>•</span>
                        <span>Ratnaya Luxury Governance Standard</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Need Assistance Footer Card */}
        <div className="bg-[#111111] text-white p-8 sm:p-10 rounded-sm text-center border border-gold/30">
          <h3 className="font-heading text-2xl mb-2 text-white">Still Have Questions for Our Gemologists?</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed font-light">
            Our royal patron concierge team is available 7 days a week to answer custom design requests, HUID hallmarking verifications, or certified diamond queries.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={onNavigateContact} className="btn-gold py-3 px-6 text-xs font-semibold cursor-pointer">
              CONTACT CONCIERGE <ArrowRight size={14} />
            </button>
            <button onClick={onNavigateShop} className="btn-outline py-3 px-6 text-xs text-white border-white cursor-pointer">
              EXPLORE JEWELLERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
