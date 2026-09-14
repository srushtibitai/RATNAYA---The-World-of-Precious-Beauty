import React from 'react';
import { X, Printer, Download, ShieldCheck, FileText, CheckCircle2, Building, Mail, Phone, MapPin } from 'lucide-react';

export default function InvoiceModal({ order, isOpen, onClose, sellerDetails = null, globalGstRate = 3 }) {
  if (!isOpen || !order) return null;

  // Extract order details with fallbacks
  const orderId = order.id || order._id || 'ORD-UNKNOWN';
  const invoiceNo = `INV-${orderId.replace(/^ORD-?/i, '')}`;
  const orderDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'));

  const buyerName = order.buyerName || order.customerName || (order.address && order.address.fullName) || 'Valued Customer';
  const buyerEmail = order.buyerEmail || order.email || (order.address && order.address.email) || 'N/A';
  const buyerPhone = order.buyerPhone || order.phone || (order.address && order.address.phone) || 'N/A';

  // Format shipping/billing address
  let addressText = 'N/A';
  if (typeof order.address === 'string') {
    addressText = order.address;
  } else if (order.address && typeof order.address === 'object') {
    const a = order.address;
    addressText = [a.street, a.addressLine, a.city, a.state, a.pincode || a.zip]
      .filter(Boolean)
      .join(', ');
  }

  // Seller details
  const sellerName = sellerDetails?.name || order.sellerName || 'Ratnaya Certified Jeweller Partner';
  const sellerLogo = sellerDetails?.logo || order.sellerLogo || null;
  const sellerGst = sellerDetails?.gst || sellerDetails?.gstNo || order.sellerGst || '08AAACR1234A1Z2';
  const sellerPan = sellerDetails?.pan || order.sellerPan || 'AAACR1234A';
  const sellerCity = sellerDetails?.city || order.sellerCity || 'Jaipur, Rajasthan';
  const sellerPhone = sellerDetails?.phone || order.sellerPhone || '+91 98765 43210';
  const sellerEmail = sellerDetails?.email || order.sellerEmail || 'support@ratnaya.com';
  const bisLicense = sellerDetails?.bisLicense || 'BIS-HM-711399-2026';

  // Items processing
  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [
      {
        name: order.productName || order.itemTitle || 'Certified Fine Jewellery Item',
        quantity: order.quantity || 1,
        price: order.totalAmount || order.price || 0,
        purity: order.purity || '22K Hallmarked Gold',
        hsn: '7113'
      }
    ];

  const totalAmount = Number(order.totalAmount || order.total || 0);

  // Financial calculations (Assuming totalAmount is inclusive of GST)
  // Total = Taxable Value + GST
  // GST = Total - (Total / (1 + GST_Rate/100))
  const gstRatePercent = Number(globalGstRate) || 3;
  const taxableValue = Math.round(totalAmount / (1 + gstRatePercent / 100));
  const totalGstAmount = Math.max(0, totalAmount - taxableValue);
  const cgstAmount = (totalGstAmount / 2).toFixed(2);
  const sgstAmount = (totalGstAmount / 2).toFixed(2);

  const paymentMethod = order.paymentMethod || 'Razorpay / Prepaid UPI';
  const paymentStatus = order.paymentStatus || (order.status === 'Cancelled' ? 'Refunded' : 'PAID / SUCCESS');

  // Trigger Direct PDF File Download using html2pdf.js with onclone API
  const handleDownloadPDF = async () => {
    try {
      if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const element = document.getElementById('printable-invoice-content');
      if (!element) return;

      const opt = {
        margin: [4, 5, 4, 5],
        filename: `Invoice_${invoiceNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          onclone: (clonedDoc) => {
            const clonedEl = clonedDoc.getElementById('printable-invoice-content');
            if (clonedEl) {
              clonedEl.style.maxHeight = 'none';
              clonedEl.style.height = 'auto';
              clonedEl.style.overflow = 'visible';
              clonedEl.style.padding = '14px 18px';
              clonedEl.style.margin = '0';
              clonedEl.style.background = '#ffffff';

              // Force web-safe Arial font for all elements inside cloned doc to guarantee html2canvas text capture
              const allNodes = clonedEl.querySelectorAll('*');
              clonedEl.style.fontFamily = 'Arial, Helvetica, sans-serif';
              allNodes.forEach((node) => {
                node.style.fontFamily = 'Arial, Helvetica, sans-serif';
              });
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF download error:', err);
      window.print();
    }
  };

  // Trigger Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 3mm 5mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            height: auto !important;
            overflow: hidden !important;
          }
          body * {
            visibility: hidden !important;
          }
          .printable-invoice, .printable-invoice * {
            visibility: visible !important;
          }
          .printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            max-height: none !important;
            overflow: visible !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .printable-invoice-content {
            padding: 8px 12px !important;
            font-size: 10.5px !important;
            overflow: visible !important;
          }
          .printable-invoice-content .space-y-4 > * + * {
            margin-top: 6px !important;
          }
          .printable-invoice-content .pb-3 {
            padding-bottom: 4px !important;
          }
          .printable-invoice-content .p-3.5, .printable-invoice-content .p-3 {
            padding: 6px 10px !important;
          }
          .printable-invoice-content .py-2 {
            padding-top: 3px !important;
            padding-bottom: 3px !important;
          }
          .printable-invoice-content .pt-3 {
            padding-top: 6px !important;
          }
          .printable-invoice-content img {
            max-height: 40px !important;
            width: auto !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="printable-invoice bg-white w-full max-w-4xl rounded-sm shadow-2xl border border-gray-200 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Header - Hidden in Print */}
        <div className="no-print bg-[#111111] text-white px-5 py-3.5 flex items-center justify-between border-b border-gold/30 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-gold" size={20} />
            <h3 className="font-heading text-base font-semibold tracking-wide text-white">
              Official Tax Invoice / Bill of Supply
            </h3>
            <span className="bg-gold/20 text-gold-light text-xs px-2 py-0.5 rounded font-mono font-semibold ml-1.5">
              {invoiceNo}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              className="btn-gold py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Download PDF file directly to your computer"
            >
              <Download size={14} /> DOWNLOAD PDF FILE
            </button>
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded transition-colors"
              title="Print Invoice"
            >
              <Printer size={14} /> PRINT
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div
          id="printable-invoice-content"
          className="printable-invoice-content p-5 sm:p-7 overflow-y-auto space-y-4 bg-white text-[#111111] font-sans text-xs sm:text-sm"
        >
          {/* Header Brand Bar - Using Table layout for 100% html2canvas rendering accuracy */}
          <table style={{ width: '100%', borderBottom: '2px solid #B8860B', paddingBottom: '10px', marginBottom: '14px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'middle', padding: '0 0 8px 0' }}>
                  <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                          <img
                            src="/assets/logo.png"
                            alt="Ratnaya Logo"
                            style={{ width: '52px', height: '52px', objectFit: 'contain', display: 'block' }}
                          />
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#B8860B', lineHeight: '1.2' }}>
                              RATNAYA
                            </span>
                            <span style={{ fontSize: '9px', backgroundColor: '#FAF6F0', color: '#B8860B', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', border: '1px solid #D4AF37', textTransform: 'uppercase', lineHeight: '1.2', display: 'inline-block' }}>
                              LUXURY JEWELLERY MARKETPLACE
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#666666', margin: '3px 0 0 0' }}>
                            Authentic BIS Hallmarked Jewellery & Fine Gems Platform
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'right', padding: '0 0 8px 0', width: '190px' }}>
                  <div style={{ backgroundColor: '#FAF6F0', padding: '8px 14px', border: '1px solid #B8860B', borderRadius: '6px', textAlign: 'right', display: 'block', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.3', display: 'block' }}>
                      TAX INVOICE
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#B8860B', marginTop: '2px', lineHeight: '1.3', display: 'block' }}>
                      No: {invoiceNo}
                    </div>
                    <div style={{ fontSize: '12px', color: '#444444', marginTop: '2px', lineHeight: '1.3', display: 'block' }}>
                      Date: <strong style={{ color: '#111111', fontWeight: 'bold' }}>{orderDate}</strong>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Seller & Buyer Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF6F0] p-3.5 rounded-sm border border-gray-200">
            {/* Seller Info */}
            <div className="space-y-1 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
              <div className="text-[0.65rem] font-bold text-[#B8860B] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Building size={13} /> ISSUED BY (MERCHANT / SELLER)
              </div>
              <div className="flex items-center gap-2.5">
                {sellerLogo && (
                  <img
                    src={sellerLogo}
                    alt={sellerName}
                    className="w-8 h-8 rounded-full object-cover border border-[#B8860B] shrink-0 shadow-2xs"
                  />
                )}
                <div className="font-heading text-base font-bold text-[#111111]">{sellerName}</div>
              </div>
              <div className="text-[0.73rem] text-gray-600 space-y-0.5 font-sans">
                <p>Location: {sellerCity}</p>
                <p>GSTIN: <strong className="font-mono text-[#111111]">{sellerGst}</strong></p>
                <p>PAN: <strong className="font-mono text-[#111111]">{sellerPan}</strong></p>
                <p>BIS License: <strong className="font-mono text-[#111111]">{bisLicense}</strong></p>
                <p>Contact: {sellerPhone} | {sellerEmail}</p>
              </div>
            </div>

            {/* Buyer Info */}
            <div className="space-y-1 md:pl-1">
              <div className="text-[0.65rem] font-bold text-[#B8860B] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <MapPin size={13} /> BILLED TO & SHIPPING ADDRESS
              </div>
              <div className="font-heading text-base font-bold text-[#111111]">{buyerName}</div>
              <div className="text-[0.73rem] text-gray-600 space-y-0.5 font-sans">
                <p>Address: <strong className="text-[#111111] font-medium">{addressText}</strong></p>
                <p>Phone: <strong className="font-mono text-[#111111]">{buyerPhone}</strong></p>
                <p>Email: <strong className="text-[#111111]">{buyerEmail}</strong></p>
                <p>Order Reference: <strong className="font-mono text-[#B8860B]">{orderId}</strong></p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="font-heading text-sm font-semibold text-[#111111] mb-2 flex items-center justify-between">
              <span>Itemised Particulars</span>
              <span className="text-[0.7rem] font-sans font-normal text-gray-500">
                HSN 7113: Articles of Goldsmiths or Silversmiths Wares
              </span>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] text-white uppercase text-[0.68rem] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center">#</th>
                    <th className="py-2.5 px-3">Description of Goods</th>
                    <th className="py-2.5 px-3 text-center">HSN</th>
                    <th className="py-2.5 px-3 text-center">Purity/Metal</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Taxable Value (₹)</th>
                    <th className="py-2.5 px-3 text-right">GST ({gstRatePercent}%)</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item, idx) => {
                    const itemQty = Number(item.quantity || 1);
                    const itemTotal = Number(item.price || item.totalAmount || totalAmount);
                    const itemTaxable = Math.round(itemTotal / (1 + gstRatePercent / 100));
                    const itemGst = itemTotal - itemTaxable;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#111111]">
                          {item.name || item.title || 'Gold Jewellery Item'}
                          {item.sku && <span className="block text-[0.62rem] font-mono text-gray-400 font-normal">SKU: {item.sku}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-gray-600">
                          {item.hsn || '7113'}
                        </td>
                        <td className="py-2.5 px-3 text-center text-gray-700">
                          {item.purity || '22K Hallmarked'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#111111]">
                          {itemQty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          ₹{itemTaxable.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600">
                          ₹{itemGst.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#111111]">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Breakdown & Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Payment & Statutory Declarations */}
            <div className="bg-[#FAF6F0] p-3 rounded-sm border border-gray-200 text-xs space-y-1.5">
              <div className="font-bold text-[#111111] uppercase tracking-wider text-[0.68rem] border-b border-gray-200 pb-1 flex items-center justify-between">
                <span>Payment & Compliance Details</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 text-[0.65rem]">
                  <CheckCircle2 size={11} /> {paymentStatus}
                </span>
              </div>
              <div className="space-y-0.5 text-gray-600 pt-0.5 text-[0.72rem]">
                <p>Payment Mode: <strong className="text-[#111111] font-medium">{paymentMethod}</strong></p>
                {order.paymentId && <p>Transaction Txn ID: <strong className="font-mono text-[#111111]">{order.paymentId}</strong></p>}
                {order.trackingNumber && <p>Logistics Tracking No: <strong className="font-mono text-[#111111]">{order.trackingNumber}</strong></p>}
                <p>BIS Hallmark Guarantee: <strong className="text-emerald-800">100% Purity Hallmarked Verified</strong></p>
              </div>
            </div>

            {/* Total Calculations */}
            <div className="bg-white p-3 rounded-sm border-2 border-[#B8860B] space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 border-b border-gray-100 text-gray-600 text-[0.73rem]">
                <span>Subtotal (Taxable Value):</span>
                <span className="font-mono font-semibold text-[#111111]">₹{taxableValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-100 text-gray-600 text-[0.73rem]">
                <span>CGST ({(gstRatePercent / 2).toFixed(1)}%):</span>
                <span className="font-mono text-gray-700">₹{Number(cgstAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-100 text-gray-600 text-[0.73rem]">
                <span>SGST ({(gstRatePercent / 2).toFixed(1)}%):</span>
                <span className="font-mono text-gray-700">₹{Number(sgstAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-100 text-gray-600 text-[0.73rem]">
                <span>Insured Delivery & Shipping:</span>
                <span className="font-mono text-emerald-700 font-bold">FREE (Complimentary)</span>
              </div>
              <div className="flex justify-between py-1.5 border-t-2 border-[#111111] pt-1.5 text-xs font-bold text-[#111111]">
                <span className="font-heading">GRAND TOTAL (INCL. TAX):</span>
                <span className="font-mono text-sm text-[#B8860B]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Footer Signature */}
          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-gray-500">
            <div className="space-y-0.5 max-w-md">
              <div className="font-bold text-[#111111] uppercase text-[0.65rem]">Terms & Conditions:</div>
              <ol className="list-decimal list-inside space-y-0.5 text-[0.65rem] text-gray-600">
                <li>Goods once sold can be returned within 15 days as per Ratnaya Marketplace Guarantee Policy.</li>
                <li>All jewellery items carry 100% BIS Hallmarking certificate.</li>
                <li>This is a computer-generated invoice and requires no physical ink signature.</li>
              </ol>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="border-b border-gray-300 w-44 mb-1 pb-2">
                <div className="font-serif italic text-[#B8860B] text-sm font-bold tracking-wider">
                  Ratnaya Authorised
                </div>
              </div>
              <div className="text-[0.65rem] font-bold text-[#111111] uppercase">
                Authorized Signatory
              </div>
              <div className="text-[0.6rem] text-gray-500">Ratnaya Marketplace Pvt. Ltd.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
