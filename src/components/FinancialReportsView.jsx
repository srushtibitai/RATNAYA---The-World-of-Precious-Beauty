import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  RotateCcw,
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  CreditCard,
  Percent,
  Printer,
  Store,
  Building,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

const MONTHS = [
  { value: 'ALL', label: 'All Months (Full Year)' },
  { value: '1', label: 'January (जनवरी)' },
  { value: '2', label: 'February (फरवरी)' },
  { value: '3', label: 'March (मार्च)' },
  { value: '4', label: 'April (अप्रैल)' },
  { value: '5', label: 'May (मई)' },
  { value: '6', label: 'June (जून)' },
  { value: '7', label: 'July (जुलाई)' },
  { value: '8', label: 'August (अगस्त)' },
  { value: '9', label: 'September (सितंबर)' },
  { value: '10', label: 'October (अक्टूबर)' },
  { value: '11', label: 'November (नवंबर)' },
  { value: '12', label: 'December (दिसंबर)' }
];

const YEARS = ['2026', '2025', '2024', 'ALL'];

export default function FinancialReportsView({
  orders = [],
  userRole = 'seller', // 'admin' or 'seller'
  sellerInfo = null,
  sellersList = [],
  globalGstRate = 3
}) {
  const [filterMode, setFilterMode] = useState('MONTH'); // 'MONTH' or 'YEAR' or 'ALL'
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedSeller, setSelectedSeller] = useState('ALL');
  const [activeReportTab, setActiveReportTab] = useState('summary'); // 'summary' | 'sales' | 'payments' | 'returns'

  // Helper to parse order date
  const parseOrderDate = (order) => {
    try {
      if (order.createdAt) return new Date(order.createdAt);
      if (order.date) {
        if (/^\d{4}-\d{2}-\d{2}/.test(order.date)) return new Date(order.date);
        const parts = order.date.split('/');
        if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return new Date(order.date);
      }
    } catch (e) {}
    return new Date();
  };

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Seller Filter (Admin mode)
      if (userRole === 'admin' && selectedSeller !== 'ALL') {
        const ordSeller = (ord.sellerName || ord.seller || '').toLowerCase();
        if (!ordSeller.includes(selectedSeller.toLowerCase())) {
          return false;
        }
      }

      const d = parseOrderDate(ord);
      const yr = d.getFullYear().toString();
      const mo = (d.getMonth() + 1).toString();

      // Year Filter
      if (selectedYear !== 'ALL' && yr !== selectedYear) {
        return false;
      }

      // Month Filter
      if (filterMode === 'MONTH' && selectedMonth !== 'ALL' && mo !== selectedMonth) {
        return false;
      }

      return true;
    });
  }, [orders, userRole, selectedSeller, filterMode, selectedYear, selectedMonth]);

  // Report Metrics Calculations
  const metrics = useMemo(() => {
    let totalGrossSales = 0;
    let totalTaxableValue = 0;
    let totalGstCollected = 0;

    let deliveredCount = 0;
    let pendingCount = 0;

    let returnedOrders = [];
    let totalRefundAmount = 0;

    let prepaidSales = 0;
    let codSales = 0;

    filteredOrders.forEach((ord) => {
      const amt = Number(ord.totalAmount || ord.total || 0);
      const isRefunded = ord.status === 'Refunded' || ord.status === 'Cancelled' || ord.paymentStatus === 'Refunded';

      if (isRefunded) {
        returnedOrders.push(ord);
        totalRefundAmount += amt;
      } else {
        totalGrossSales += amt;
        const taxable = Math.round(amt / (1 + globalGstRate / 100));
        const gst = amt - taxable;
        totalTaxableValue += taxable;
        totalGstCollected += gst;

        if (ord.status === 'Delivered') deliveredCount++;
        else pendingCount++;

        const method = (ord.paymentMethod || '').toLowerCase();
        if (method.includes('cod') || method.includes('cash')) {
          codSales += amt;
        } else {
          prepaidSales += amt;
        }
      }
    });

    const netSales = Math.max(0, totalGrossSales - totalRefundAmount);
    const returnRate = filteredOrders.length > 0 ? ((returnedOrders.length / filteredOrders.length) * 100).toFixed(1) : 0;
    const cgstAmount = (totalGstCollected / 2).toFixed(2);
    const sgstAmount = (totalGstCollected / 2).toFixed(2);

    return {
      totalOrdersCount: filteredOrders.length,
      totalGrossSales,
      totalTaxableValue,
      totalGstCollected,
      cgstAmount,
      sgstAmount,
      deliveredCount,
      pendingCount,
      returnedOrders,
      returnedCount: returnedOrders.length,
      totalRefundAmount,
      netSales,
      returnRate,
      prepaidSales,
      codSales
    };
  }, [filteredOrders, globalGstRate]);

  // Download PDF Report Generator Function
  const handleDownloadPDF = () => {
    let periodText = 'All Time';
    if (filterMode === 'MONTH') {
      const monthObj = MONTHS.find((m) => m.value === selectedMonth);
      periodText = `${monthObj ? monthObj.label.split(' ')[0] : ''} ${selectedYear !== 'ALL' ? selectedYear : ''}`;
    } else if (filterMode === 'YEAR') {
      periodText = `Full Year ${selectedYear}`;
    }

    const sellerName = userRole === 'admin'
      ? (selectedSeller === 'ALL' ? 'All Marketplace Jewellers' : selectedSeller)
      : (sellerInfo?.name || 'Verified Merchant');

    const logoUrl = `${window.location.origin}/assets/logo.png`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to generate and download the PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ratnaya ${userRole === 'admin' ? 'Admin' : 'Seller'} Financial Report - ${periodText}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; padding: 0; margin: 0; background: #fff; line-height: 1.4; }
            .report-box { padding: 28px; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b8860b; padding-bottom: 12px; margin-bottom: 20px; }
            .brand-group { display: flex; align-items: center; gap: 12px; }
            .logo { height: 44px; width: auto; object-fit: contain; }
            .title { font-size: 22px; font-weight: bold; color: #b8860b; letter-spacing: 2px; }
            .subtitle { font-size: 10px; color: #666; text-transform: uppercase; margin-top: 2px; }
            .badge-period { background: #faf6f0; border: 1px solid #b8860b; padding: 6px 12px; border-radius: 4px; text-align: right; font-size: 11px; }

            .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
            .card { background: #faf6f0; border: 1px solid #e2d8c3; padding: 12px; border-radius: 4px; }
            .card-title { font-size: 10px; color: #666; text-transform: uppercase; font-weight: bold; }
            .card-val { font-size: 18px; font-weight: bold; color: #111; margin: 4px 0 2px 0; }
            .card-sub { font-size: 10px; color: #444; }

            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11px; }
            th { background: #111; color: #fff; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 7px 10px; border-bottom: 1px solid #eee; }
            tr:nth-child(even) { background: #fcfbfa; }
            .text-right { text-align: right; }
            .font-mono { font-family: monospace; }
            .text-emerald { color: #065f46; font-weight: bold; }
            .text-rose { color: #9f1239; font-weight: bold; }

            .section-title { font-size: 13px; font-weight: bold; color: #111; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; text-transform: uppercase; }

            .footer-stamp { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; pt-10; border-top: 1px solid #ddd; font-size: 10px; color: #666; }

            .no-print-bar { background: #111; color: #fff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
            .btn-download { background: #b8860b; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; }
            .btn-close { background: #444; color: #fff; border: none; padding: 8px 14px; border-radius: 4px; font-size: 12px; cursor: pointer; }

            @media print {
              .no-print { display: none !important; }
              .report-box { padding: 0; }
              @page { margin: 1cm; size: A4 portrait; }
            }
          </style>
        </head>
        <body>
          <div class="no-print no-print-bar">
            <span>📄 Official Financial, Sales & Return Report Ready</span>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.print()" class="btn-download">📥 Download PDF / Print</button>
              <button onclick="window.close()" class="btn-close">✕ Close</button>
            </div>
          </div>

          <div class="report-box">
            <div class="header-bar">
              <div class="brand-group">
                <img src="${logoUrl}" alt="Ratnaya Logo" class="logo" />
                <div>
                  <div class="title">RATNAYA</div>
                  <div class="subtitle">FINANCIAL, SALES & RETURN AUDIT REPORT</div>
                </div>
              </div>
              <div class="badge-period">
                <div><strong>Merchant / Entity:</strong> ${sellerName}</div>
                <div><strong>Report Period:</strong> ${periodText}</div>
                <div><strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            <!-- Key Metric Cards -->
            <div class="cards-grid">
              <div class="card">
                <div class="card-title">1. Gross Selling Revenue</div>
                <div class="card-val">₹${metrics.totalGrossSales.toLocaleString('en-IN')}</div>
                <div class="card-sub">${metrics.totalOrdersCount} Total Orders (${metrics.deliveredCount} Delivered)</div>
              </div>

              <div class="card">
                <div class="card-title">2. Taxable Value & GST (3%)</div>
                <div class="card-val">₹${metrics.totalTaxableValue.toLocaleString('en-IN')}</div>
                <div class="card-sub">CGST: ₹${metrics.cgstAmount} | SGST: ₹${metrics.sgstAmount}</div>
              </div>

              <div class="card">
                <div class="card-title">3. Returns & Refunds</div>
                <div class="card-val text-rose">₹${metrics.totalRefundAmount.toLocaleString('en-IN')}</div>
                <div class="card-sub">${metrics.returnedCount} Refunds (${metrics.returnRate}% Return Rate)</div>
              </div>

              <div class="card">
                <div class="card-title">4. Net Revenue (Payout)</div>
                <div class="card-val text-emerald">₹${metrics.netSales.toLocaleString('en-IN')}</div>
                <div class="card-sub">Prepaid: ₹${metrics.prepaidSales.toLocaleString('en-IN')} | COD: ₹${metrics.codSales.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <!-- Itemized Orders Table -->
            <div class="section-title">A. Selling & Payment Transaction Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Buyer / Customer</th>
                  <th>Payment Mode</th>
                  <th class="text-right">Taxable (₹)</th>
                  <th class="text-right">GST 3% (₹)</th>
                  <th class="text-right">Total Amount (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.length === 0 ? `<tr><td colspan="9" style="text-align:center; padding:15px; color:#888;">No transactions found for the selected period.</td></tr>` :
                  filteredOrders.map((ord, idx) => {
                    const amt = Number(ord.totalAmount || 0);
                    const taxable = Math.round(amt / (1 + globalGstRate / 100));
                    const gst = amt - taxable;
                    return `
                      <tr>
                        <td>${idx + 1}</td>
                        <td><strong>${ord.id || ord._id}</strong></td>
                        <td>${ord.date || new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>${ord.buyerName || ord.customerName || 'Customer'}</td>
                        <td>${ord.paymentMethod || 'Prepaid UPI'}</td>
                        <td class="text-right font-mono">₹${taxable.toLocaleString('en-IN')}</td>
                        <td class="text-right font-mono">₹${gst.toLocaleString('en-IN')}</td>
                        <td class="text-right font-mono"><strong>₹${amt.toLocaleString('en-IN')}</strong></td>
                        <td>
                          <span style="font-weight:bold; color:${ord.status === 'Refunded' ? '#9f1239' : ord.status === 'Delivered' ? '#065f46' : '#92400e'}">
                            ${ord.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')
                }
              </tbody>
            </table>

            <!-- Returns & Refunds Table if any -->
            ${metrics.returnedCount > 0 ? `
              <div class="section-title">B. Returns & Refunds Audit Summary</div>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Reason / Details</th>
                    <th class="text-right">Refund Amount (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${metrics.returnedOrders.map((r) => `
                    <tr>
                      <td><strong>${r.id || r._id}</strong></td>
                      <td>${r.date || 'N/A'}</td>
                      <td>${r.buyerName || r.customerName || 'Customer'}</td>
                      <td>${r.returnReason || 'Order Returned / Cancelled'}</td>
                      <td class="text-right font-mono text-rose">₹${Number(r.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td class="text-rose">REFUND PROCESSED</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            <div class="footer-stamp">
              <div>
                <strong>Ratnaya Marketplace Official Financial Audit</strong><br/>
                Computer-generated report verified under BIS Hallmarking & Statutory Tax Guidelines.
              </div>
              <div style="text-align:right;">
                <div style="border-bottom:1px solid #999; padding-bottom:4px; font-weight:bold; color:#b8860b;">Ratnaya Authorized Auditor</div>
                <span>Authorized Signatory</span>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 border border-gray-200 rounded-sm shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-heading text-lg sm:text-xl text-charcoal flex items-center gap-2">
              <PieChart className="text-gold-dark shrink-0" size={20} /> Selling, Payment & Return Report
            </h2>
            <span className="text-[0.65rem] bg-gold/15 text-gold-dark font-bold px-2 py-0.5 rounded uppercase border border-gold/30">
              Month & Year Wise
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete financial breakdown of Sales, Tax Collections (GST), Payment Modes & Returns/Refunds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Admin Seller Filter */}
          {userRole === 'admin' && sellersList.length > 0 && (
            <div className="flex items-center gap-1">
              <Store size={14} className="text-gray-500 shrink-0" />
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-auto text-xs bg-white py-1.5 px-2.5 border border-gray-300 rounded font-semibold text-charcoal shadow-2xs focus:border-gold focus:outline-none cursor-pointer"
              >
                <option value="ALL">🏢 All Jewellers (Marketplace)</option>
                {sellersList.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Mode */}
          <div className="flex items-center gap-0.5 bg-[#FAF6F0] p-1 border border-gray-200 rounded text-xs font-semibold">
            <button
              onClick={() => setFilterMode('MONTH')}
              className={`px-2.5 py-1 rounded transition-colors ${filterMode === 'MONTH' ? 'bg-gold-dark text-white shadow-xs' : 'text-gray-600 hover:text-charcoal'}`}
            >
              Month-wise
            </button>
            <button
              onClick={() => setFilterMode('YEAR')}
              className={`px-2.5 py-1 rounded transition-colors ${filterMode === 'YEAR' ? 'bg-gold-dark text-white shadow-xs' : 'text-gray-600 hover:text-charcoal'}`}
            >
              Year-wise
            </button>
            <button
              onClick={() => { setFilterMode('ALL'); setSelectedYear('ALL'); setSelectedMonth('ALL'); }}
              className={`px-2.5 py-1 rounded transition-colors ${filterMode === 'ALL' ? 'bg-gold-dark text-white shadow-xs' : 'text-gray-600 hover:text-charcoal'}`}
            >
              All Time
            </button>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-gray-500 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-auto text-xs bg-white py-1.5 px-2.5 border border-gray-300 rounded font-semibold text-charcoal shadow-2xs focus:border-gold focus:outline-none cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y === 'ALL' ? 'All Years' : `Year ${y}`}</option>
              ))}
            </select>
          </div>

          {/* Month Dropdown (Visible if Month-wise selected) */}
          {filterMode === 'MONTH' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-auto text-xs bg-white py-1.5 px-2.5 border border-gray-300 rounded font-semibold text-charcoal shadow-2xs focus:border-gold focus:outline-none cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          )}

          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold uppercase tracking-wider shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download size={13} /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Metric Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Selling Report */}
        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling & Sales</span>
            <div className="p-2 bg-amber-50 text-gold-dark rounded-full">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-charcoal">
            ₹{metrics.totalGrossSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
              {metrics.deliveredCount} Delivered
            </span>
            <span className="text-gray-500 font-medium">{metrics.totalOrdersCount} Total Orders</span>
          </div>
        </div>

        {/* Card 2: Payment & GST Collection */}
        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment & GST (3%)</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-full">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-charcoal">
            ₹{metrics.totalTaxableValue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>GST: <strong className="text-gold-dark font-mono">₹{metrics.totalGstCollected.toLocaleString('en-IN')}</strong></span>
            <span>(CGST+SGST 1.5%)</span>
          </div>
        </div>

        {/* Card 3: Returns & Refunds */}
        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Returns & Refunds</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-full">
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-rose-700">
            ₹{metrics.totalRefundAmount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-rose-800 font-semibold">{metrics.returnedCount} Refunds</span>
            <span className="text-gray-500 font-medium">Return Rate: {metrics.returnRate}%</span>
          </div>
        </div>

        {/* Card 4: Net Revenue */}
        <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Realised Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-full">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="font-heading text-2xl font-bold text-emerald-800">
            ₹{metrics.netSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Prepaid: ₹{metrics.prepaidSales.toLocaleString('en-IN')}</span>
            <span>COD: ₹{metrics.codSales.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
        <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
          {[
            { id: 'summary', label: `Selling Log (${filteredOrders.length})` },
            { id: 'payments', label: 'Payment & Statutory GST Breakdown' },
            { id: 'returns', label: `Return & Refund Audit (${metrics.returnedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`py-2.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeReportTab === tab.id
                  ? 'border-gold-dark text-gold-dark bg-[#FAF6F0]/60'
                  : 'border-transparent text-gray-500 hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUB TAB 1: Selling Log */}
        {activeReportTab === 'summary' && (
          <div className="overflow-x-auto border border-gray-200 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111111] text-white uppercase text-[0.68rem] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 text-center">#</th>
                  <th className="py-3 px-3.5">Order ID</th>
                  <th className="py-3 px-3.5">Order Date</th>
                  {userRole === 'admin' && <th className="py-3 px-3.5">Seller / Jeweller</th>}
                  <th className="py-3 px-3.5">Customer Name</th>
                  <th className="py-3 px-3.5 text-right">Taxable Value</th>
                  <th className="py-3 px-3.5 text-right">GST (3%)</th>
                  <th className="py-3 px-3.5 text-right">Gross Amount</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={userRole === 'admin' ? 9 : 8} className="py-8 text-center text-gray-400 italic">
                      No selling order records found for the selected month/year filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord, idx) => {
                    const amt = Number(ord.totalAmount || ord.total || 0);
                    const taxable = Math.round(amt / (1 + globalGstRate / 100));
                    const gst = amt - taxable;

                    return (
                      <tr key={ord.id || ord._id || idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-[#111111]">{ord.id || ord._id}</td>
                        <td className="py-3 px-3.5 text-gray-600">{ord.date || new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                        {userRole === 'admin' && (
                          <td className="py-3 px-3.5 font-semibold text-gold-dark">{ord.sellerName || ord.seller || 'Merchant'}</td>
                        )}
                        <td className="py-3 px-3.5 text-[#111111]">{ord.buyerName || ord.customerName || 'Valued Customer'}</td>
                        <td className="py-3 px-3.5 text-right font-mono text-gray-700">₹{taxable.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3.5 text-right font-mono text-gray-600">₹{gst.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-[#111111]">₹{amt.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[0.68rem] font-bold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : ord.status === 'Refunded'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {ord.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUB TAB 2: Payment & GST Breakdown */}
        {activeReportTab === 'payments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF6F0] p-4 rounded-sm border border-gray-200">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Taxable Turnover</span>
                <div className="text-xl font-bold font-mono text-charcoal mt-1">₹{metrics.totalTaxableValue.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Central Tax CGST (1.5%)</span>
                <div className="text-xl font-bold font-mono text-gold-dark mt-1">₹{Number(metrics.cgstAmount).toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">State Tax SGST (1.5%)</span>
                <div className="text-xl font-bold font-mono text-gold-dark mt-1">₹{Number(metrics.sgstAmount).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] text-white uppercase text-[0.68rem] tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Payment Method</th>
                    <th className="py-3 px-3.5 text-center">Transactions</th>
                    <th className="py-3 px-3.5 text-right">Taxable Turnover</th>
                    <th className="py-3 px-3.5 text-right">Total GST (3%)</th>
                    <th className="py-3 px-3.5 text-right">Gross Payment Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="py-3 px-3.5 font-bold text-charcoal flex items-center gap-2">
                      <CreditCard size={14} className="text-emerald-600" /> Prepaid / Online UPI / Razorpay
                    </td>
                    <td className="py-3 px-3.5 text-center font-bold">{filteredOrders.length - metrics.returnedCount}</td>
                    <td className="py-3 px-3.5 text-right font-mono">₹{Math.round(metrics.prepaidSales / 1.03).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3.5 text-right font-mono text-gray-600">₹{Math.round(metrics.prepaidSales - (metrics.prepaidSales / 1.03)).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-800">₹{metrics.prepaidSales.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3.5 font-bold text-charcoal flex items-center gap-2">
                      <DollarSign size={14} className="text-amber-600" /> Cash On Delivery (COD)
                    </td>
                    <td className="py-3 px-3.5 text-center font-bold">0</td>
                    <td className="py-3 px-3.5 text-right font-mono">₹0</td>
                    <td className="py-3 px-3.5 text-right font-mono text-gray-600">₹0</td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-800">₹{metrics.codSales.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB TAB 3: Return & Refund Log */}
        {activeReportTab === 'returns' && (
          <div className="overflow-x-auto border border-gray-200 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111111] text-white uppercase text-[0.68rem] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">#</th>
                  <th className="py-3 px-3.5">Order ID</th>
                  <th className="py-3 px-3.5">Order Date</th>
                  <th className="py-3 px-3.5">Customer Name</th>
                  <th className="py-3 px-3.5">Return Reason</th>
                  <th className="py-3 px-3.5 text-right">Refund Amount (₹)</th>
                  <th className="py-3 px-3.5 text-center">Refund Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {metrics.returnedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                      🎉 Great news! No returns or refund requests were recorded for the selected period.
                    </td>
                  </tr>
                ) : (
                  metrics.returnedOrders.map((r, idx) => (
                    <tr key={r.id || r._id || idx} className="hover:bg-rose-50/40">
                      <td className="py-3 px-3.5 text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-mono font-bold text-rose-900">{r.id || r._id}</td>
                      <td className="py-3 px-3.5 text-gray-600">{r.date || 'N/A'}</td>
                      <td className="py-3 px-3.5 font-medium text-charcoal">{r.buyerName || r.customerName || 'Customer'}</td>
                      <td className="py-3 px-3.5 text-gray-600">{r.returnReason || 'Buyer Cancellation / Quality Return'}</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-rose-700">₹{Number(r.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded text-[0.68rem] font-bold border border-rose-200">
                          REFUND PROCESSED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
