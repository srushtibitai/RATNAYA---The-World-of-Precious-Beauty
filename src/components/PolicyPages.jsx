import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Lock,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Award,
  Clock,
  RotateCcw,
  BadgeCheck
} from 'lucide-react';

export function PolicyPages({ initialTab = 'shipping', onNavigateShop, onNavigateContact }) {
  const [activePolicy, setActivePolicy] = useState(initialTab);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
    },    {
      q: 'How can independent heritage jewellers and artisans list their collections on Ratnaya?',
      a: 'Verified jeweller merchants can register via our Seller Portal by submitting GSTIN, PAN, and BIS Hallmarking License credentials. Once audited by our Compliance Officers, merchants receive dedicated seller dashboards to list inventory and track automated bank payouts.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '90vh', padding: '60px 0 100px' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">RATNAYA LUXURY GOVERNANCE</span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>
            Legal Framework, Shipping & FAQs
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.94rem', lineHeight: 1.7 }}>
            Read detailed operational standards, 100% transit insurance terms, BIS hallmarking guidelines, and frequently asked customer care queries.
          </p>
        </div>

        {/* Policy Tab Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { id: 'shipping', label: 'Shipping & Delivery Policy', icon: <Truck size={18} /> },
            { id: 'return-policy', label: '14-Day Return & Refund Policy', icon: <RotateCcw size={18} /> },
            { id: 'terms', label: 'Terms & Conditions', icon: <FileText size={18} /> },
            { id: 'privacy', label: 'Privacy & Data Protection', icon: <Lock size={18} /> },
            { id: 'faqs', label: 'Frequently Asked Questions (FAQ)', icon: <HelpCircle size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePolicy(tab.id);
                setOpenFaqIndex(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '4px',
                border: activePolicy === tab.id ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                backgroundColor: activePolicy === tab.id ? '#FFFFFF' : '#FAF6F0',
                color: activePolicy === tab.id ? 'var(--color-gold-dark)' : 'var(--color-charcoal)',
                fontWeight: activePolicy === tab.id ? '600' : '500',
                boxShadow: activePolicy === tab.id ? 'var(--shadow-small)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.86rem'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Container Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '48px',
            borderRadius: '6px',
            border: '1px solid var(--color-border-gold)',
            boxShadow: 'var(--shadow-medium)',
            maxWidth: '960px',
            margin: '0 auto',
            lineHeight: 1.8
          }}
        >
          {/* 1. DETAILED SHIPPING & DELIVERY POLICY */}
          {(activePolicy === 'shipping' || activePolicy === 'shipping-policy') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-gold-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <Truck size={32} />
                <div>
                  <h2 style={{ fontSize: '1.7rem', fontFamily: "'Marcellus', serif", margin: 0 }}>
                    Insured Express Transit & Delivery Policy
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Effective Date: September 2026 • Policy Version 4.2
                  </span>
                </div>
              </div>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  1. Comprehensive 100% In-Transit Insurance Coverage
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Ratnaya Marketplace guarantees complete peace of mind for every high-value purchase. All dispatches are covered by a comprehensive transit insurance policy underwritten by leading national insurers. This insurance protects your parcel against all risks of loss, theft, robbery, or damage from the moment it leaves our verified jeweller's vault until the package is handed over to you against OTP verification.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  2. Packaging Standards & Serialized Security Seals
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  To maintain absolute confidentiality and prevent theft during transit:
                </p>
                <ul style={{ color: '#555', fontSize: '0.92rem', paddingLeft: '20px', marginTop: '8px' }}>
                  <li>All jewellery items are packed in velvet-lined luxury wooden caskets enclosed within a heavy-duty, tamper-evident outer security pouch.</li>
                  <li>Outer packaging contains NO mention of "Gold", "Diamonds", "Jewellery", or "Ratnaya" to prevent transit targeting.</li>
                  <li>Each pouch is sealed with a non-reusable serialized barcode security strip that distorts visibly if opened or heated.</li>
                </ul>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  3. Order Processing & Dispatch Timelines
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#FAF6F0', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                      Ready In-Stock Creations
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                      Dispatched within 24 to 48 hours following final quality audit and HUID verification. Delivery in 2–4 business days across metro cities.
                    </p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#FAF6F0', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-gold-dark)', display: 'block', marginBottom: '4px' }}>
                      Made-to-Order & Custom Sized
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                      Requires 5 to 7 working days for master artisan crafting, stone setting, and government hallmarking prior to insured courier pickup.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  4. Delivery OTP Protocol & Identity Verification
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Deliveries are strictly made to the recipient specified in the order invoice. Upon delivery, the courier representative will request a 4-digit One-Time Password (OTP) sent to your registered mobile number. Please inspect the outer tamper-evident bag for any tears or seal damage BEFORE sharing the OTP.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  5. Non-Delivery & Failed Delivery Attempts
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Our courier partners will make up to three (3) delivery attempts. If you are unavailable, the parcel is returned to our secure vault location. Re-dispatch requests can be initiated through Patron Care without additional charge.
                </p>
              </section>
            </div>
          )}

          {/* 2. DETAILED TERMS & CONDITIONS */}
          {(activePolicy === 'terms' || activePolicy === 'terms-conditions') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-gold-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <FileText size={32} />
                <div>
                  <h2 style={{ fontSize: '1.7rem', fontFamily: "'Marcellus', serif", margin: 0 }}>
                    Terms & Conditions of Luxury Commerce
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Governance & Legal Code for Patrons & Merchants
                  </span>
                </div>
              </div>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  1. BIS Hallmarking & Pure Metal Guarantees
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Every gold product offered on Ratnaya must strictly conform to BIS (Bureau of Indian Standards) 916 (22K) or 750 (18K) standards. All items feature mandatory 6-character alphanumeric HUID laser markings. Ratnaya reserves the right to unlist any merchant immediately if a purity deviation exceeds 0.01%.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  2. Pricing, Gold Rate Fixation & Billing
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  All prices listed include 3% Goods and Services Tax (GST) as mandated by Government of India regulations. When an order is placed, the metal price component is locked for the order transaction. Fluctuations in spot gold or silver market rates following order confirmation will not alter the final invoice amount payable.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  3. Merchant Governance & Quality Compliance
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Ratnaya operates as an audited multi-vendor marketplace. Jeweller merchants undergo mandatory physical atelier audits, GSTIN verification, and BIS license validation. Merchant seller scores are updated monthly based on order fulfillment accuracy, product reviews, and compliance speed.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  4. Intellectual Property & Artisan Designs
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  All high-resolution photography, 3D renders, video accordions, brand logos, and custom Kundan/Polki filigree design representations published on Ratnaya are protected under Indian Copyright and Trademark Acts. Unauthorized reproduction is strictly prohibited.
                </p>
              </section>
            </div>
          )}

          {/* RETURN & REFUND POLICY SECTION */}
          {(activePolicy === 'return-policy' || activePolicy === 'returns') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-gold-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <RotateCcw size={32} />
                <div>
                  <h2 style={{ fontSize: '1.7rem', fontFamily: "'Marcellus', serif", margin: 0 }}>
                    14-Day Insured Return & Refund Policy
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    100% Money-Back Guarantee & Insured Reverse Pickup
                  </span>
                </div>
              </div>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  1. Return Eligibility & 14-Day Guarantee Window
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  At Ratnaya, we stand behind the craftsmanship and purity of every hallmarked creation. If you are not completely enchanted with your purchase, you may initiate a return within <strong>14 calendar days</strong> of parcel delivery for a full 100% refund.
                </p>
                <ul style={{ color: '#555', fontSize: '0.92rem', paddingLeft: '20px', marginTop: '8px', lineHeight: 1.7 }}>
                  <li>The tamper-proof security tag attached to the jewellery piece must remain intact and undamaged.</li>
                  <li>Original BIS Hallmarking certificates, diamond lab certificates (GIA/IGI/SGL), and luxury packaging boxes must be included.</li>
                  <li>Custom engraved, resized, or bespoke commissioned heirlooms are non-refundable but eligible for exchange.</li>
                </ul>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  2. Step-by-Step Return Process
                </h3>
                <ol style={{ color: '#555', fontSize: '0.92rem', paddingLeft: '20px', lineHeight: 1.7 }}>
                  <li>Navigate to your <strong>Buyer Account &gt; My Orders</strong> tab.</li>
                  <li>Select the delivered order and click <strong>Request 14-Day Return</strong>.</li>
                  <li>Choose your reason for return and select your preferred payout option (Original Payment Mode, UPI ID, or Direct Bank Transfer).</li>
                  <li>Our insured logistics partner (BlueDart / Sequel Logistics) will collect the parcel from your address in a tamper-evident bag.</li>
                  <li>Once inspected by our Quality Control Atelier, your refund will be released within <strong>24 business hours</strong>.</li>
                </ol>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  3. Order Cancellation & Instant Refund Policy
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  You may cancel any order free of charge at any time prior to shipment dispatch directly from your <strong>My Orders</strong> page. For cancelled orders, 100% of the paid amount is refunded immediately to your original payment account.
                </p>
              </section>
            </div>
          )}

          {/* 3. DETAILED PRIVACY POLICY */}
          {(activePolicy === 'privacy' || activePolicy === 'privacy-policy') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-gold-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <Lock size={32} />
                <div>
                  <h2 style={{ fontSize: '1.7rem', fontFamily: "'Marcellus', serif", margin: 0 }}>
                    Privacy, Data Security & Cookie Policy
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    ISO 27001 & IT Act 2000 Compliant Data Standards
                  </span>
                </div>
              </div>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  1. Information We Collect & Purpose
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  To process high-value luxury orders and comply with Government Anti-Money Laundering (AML) & KYC directives, we collect:
                </p>
                <ul style={{ color: '#555', fontSize: '0.92rem', paddingLeft: '20px', marginTop: '8px' }}>
                  <li>Contact Information: Name, Email Address, Mobile Number, Shipping Address.</li>
                  <li>KYC Verification Data: PAN Card details for transactions exceeding ₹2,000,000 as required by Income Tax regulations.</li>
                  <li>Technical Log Data: Encrypted IP address, device identifier, and session tokens for fraud prevention.</li>
                </ul>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  2. Payment Security & Zero Card Storage
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  Ratnaya does NOT store, log, or transmit credit card numbers, CVVs, or Netbanking credentials on our servers. All payments are processed directly through PCI-DSS Level 1 certified payment gateways (Razorpay) utilizing 256-Bit SSL encryption protocols.
                </p>
              </section>

              <section>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', marginBottom: '10px', fontFamily: "'Marcellus', serif" }}>
                  3. Cookie Policy & User Preference Controls
                </h3>
                <p style={{ color: '#555', fontSize: '0.92rem' }}>
                  We use essential session cookies to preserve cart items, wishlist selections, and authenticated login states. Analytical cookies help us optimize catalog browsing performance. You can clear or disable cookies anytime in your browser settings.
                </p>
              </section>
            </div>
          )}

          {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) HUB */}
          {(activePolicy === 'faqs' || activePolicy === 'faq') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--color-gold-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <HelpCircle size={32} />
                <div>
                  <h2 style={{ fontSize: '1.7rem', fontFamily: "'Marcellus', serif", margin: 0 }}>
                    Frequently Asked Questions (FAQ)
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Quick Answers to Purity, Shipping, Payments & Buyback
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: openFaqIndex === index ? '#FAF6F0' : '#FFFFFF',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '18px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: 'var(--color-charcoal)',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sparkles size={16} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        color="var(--color-gold-dark)"
                        style={{
                          transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0
                        }}
                      />
                    </button>

                    {openFaqIndex === index && (
                      <div
                        style={{
                          padding: '0 24px 20px 52px',
                          fontSize: '0.9rem',
                          color: '#555',
                          lineHeight: 1.7,
                          borderTop: '1px solid rgba(197, 160, 89, 0.15)',
                          paddingTop: '16px'
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <button onClick={onNavigateShop} className="btn-gold" style={{ padding: '14px 28px' }}>
              EXPLORE JEWELLERY CATALOG <ArrowRight size={16} />
            </button>
            <button onClick={onNavigateContact} className="btn-outline-gold" style={{ padding: '14px 28px' }}>
              CONTACT PATRON SUPPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
