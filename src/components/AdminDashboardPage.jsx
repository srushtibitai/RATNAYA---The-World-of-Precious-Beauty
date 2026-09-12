import React, { useState, useEffect } from 'react';
import {
  SELLERS as INITIAL_SELLERS,
  PRODUCTS,
  MOCK_ORDERS,
  MOCK_PENDING_SELLERS,
  MOCK_PENDING_PRODUCTS
} from '../data/marketplaceData';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Percent,
  Sliders,
  Edit,
  Save,
  X,
  RotateCcw,
  AlertCircle,
  Trash2,
  ChevronDown,
  Search,
  Filter,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  User,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Download,
  Table
} from 'lucide-react';
import { api, openDocument, formatDocName, formatDocSize } from '../services/api';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Admin state management for approvals, sellers, commissions & returns
  const [sellersList, setSellersList] = useState(INITIAL_SELLERS);
  const [adminOrders, setAdminOrders] = useState(MOCK_ORDERS);

  const [pendingSellers, setPendingSellers] = useState([]);

  const [pendingProducts, setPendingProducts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
      const uniqueMap = new Map();
      saved.forEach((item) => {
        if (item && item.name && (item.approvalStatus === 'Pending Approval' || item.status === 'Pending Approval' || !item.approvalStatus)) {
          const key = (item.id || item._id || item.name).toString().toLowerCase();
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        }
      });
      return Array.from(uniqueMap.values());
    } catch (e) {
      return [];
    }
  });

  const [globalCommission, setGlobalCommission] = useState(10); // 10% default marketplace commission
  const [globalGstRate, setGlobalGstRate] = useState(3); // 3% default jewellery GST rate

  // Save Commission to Database API
  const handleSaveCommission = async () => {
    try {
      const res = await api.updateCommission(globalCommission);
      if (res && res.success) {
        alert(`Global commission updated to ${globalCommission}% in Database!`);
      } else {
        alert(`Global commission set to ${globalCommission}%`);
      }
    } catch (e) {
      console.error('Update commission error:', e);
      alert(`Global commission set to ${globalCommission}%`);
    }
  };

  // Save GST Rate to Database API
  const handleSaveGstRate = async () => {
    try {
      const res = await api.updateGstRate(globalGstRate);
      if (res && res.success) {
        alert(`Global GST Tax rate updated to ${globalGstRate}% in Database!`);
      } else {
        alert(`Global GST Tax rate set to ${globalGstRate}%`);
      }
    } catch (e) {
      console.error('Update GST rate error:', e);
      alert(`Global GST Tax rate set to ${globalGstRate}%`);
    }
  };

  // Add Seller Modal state
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [newSellerData, setNewSellerData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    city: '',
    gst: '',
    pan: '',
    commissionRate: 10
  });

  // Sync pending products & sellers from Database API & localStorage on tab change or mount
  useEffect(() => {
    async function syncBackendPendingSellers() {
      try {
        const res = await api.getPendingSellers();
        if (res && res.success && Array.isArray(res.data)) {
          setPendingSellers(res.data);
        }
      } catch (e) {
        console.warn('Pending sellers API sync error:', e);
      }
    }

    async function syncBackendVerifiedSellers() {
      try {
        const res = await api.getSellers();
        if (res && res.success && Array.isArray(res.data)) {
          setSellersList(res.data);
        }
      } catch (e) {
        console.warn('Verified sellers API sync error:', e);
      }
    }

    async function syncBackendPendingProducts() {
      try {
        const res = await api.getPendingProducts();
        if (res && res.success && Array.isArray(res.data)) {
          if (res.database === 'MongoDB') {
            // MongoDB is the single source of truth for pending products
            setPendingProducts(res.data);
            try {
              localStorage.setItem('ratnaya_pending_products', JSON.stringify(res.data));
            } catch (e) { }
          } else {
            // Deduplicate local state with backend fallback data by ID and Name
            const savedProds = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
            const uniqueMap = new Map();
            res.data.forEach((p) => {
              const key = (p.id || p._id || p.name).toString().toLowerCase();
              uniqueMap.set(key, p);
            });
            savedProds.forEach((item) => {
              if (item && item.name && (item.approvalStatus === 'Pending Approval' || item.status === 'Pending Approval' || !item.approvalStatus)) {
                const key = (item.id || item._id || item.name).toString().toLowerCase();
                if (!uniqueMap.has(key)) {
                  uniqueMap.set(key, item);
                }
              }
            });
            const combined = Array.from(uniqueMap.values());
            setPendingProducts(combined);
            try {
              localStorage.setItem('ratnaya_pending_products', JSON.stringify(combined));
            } catch (e) { }
          }
        }
      } catch (e) {
        console.warn('Pending products API sync fallback:', e);
      }
    }

    async function syncAdminOrders() {
      try {
        const res = await api.getOrders();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAdminOrders(res.data);
        }
      } catch (e) {
        console.warn('Admin orders sync fallback:', e);
      }
    }

    async function syncAdminSettings() {
      try {
        const cRes = await api.getCommission();
        if (cRes && cRes.success && typeof cRes.commission === 'number') {
          setGlobalCommission(cRes.commission);
        }
      } catch (e) { }

      try {
        const gRes = await api.getGstRate();
        if (gRes && gRes.success && typeof gRes.gstRate === 'number') {
          setGlobalGstRate(gRes.gstRate);
        }
      } catch (e) { }
    }

    syncBackendPendingSellers();
    syncBackendVerifiedSellers();
    syncBackendPendingProducts();
    syncAdminOrders();
    syncAdminSettings();
  }, [activeTab]);

  // Handle Approve Return & Issue Refund by Admin
  const handleApproveRefund = async (order) => {
    const refundNotes = prompt(`Enter refund notes for order ${order.id}:`, 'Return request approved. Full refund issued.');
    if (refundNotes === null) return;

    try {
      const res = await api.processOrderRefund(order.id, {
        refundAmount: order.totalAmount,
        notes: refundNotes
      });
      if (res && res.success) {
        setAdminOrders((prev) =>
          prev.map((o) => (o.id === order.id ? res.data : o))
        );
        alert(`Refund processed successfully for order ${order.id}!`);
      } else {
        setAdminOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                ...o,
                status: 'Refunded',
                refundDetails: {
                  refundAmount: order.totalAmount,
                  refundTxnId: `RFND-${Math.floor(10000000 + Math.random() * 90000000)}`,
                  refundDate: new Date().toISOString().split('T')[0],
                  notes: refundNotes
                }
              }
              : o
          )
        );
        alert(`Refund recorded for order ${order.id}.`);
      }
    } catch (err) {
      console.error('Refund approval error:', err);
    }
  };

  // Handle Delete Order by Admin
  const handleDeleteAdminOrder = async (orderId) => {
    if (!window.confirm(`Permanently delete order record ${orderId} from system?`)) return;

    try {
      await api.deleteOrder(orderId);
      setAdminOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert(`Order ${orderId} deleted successfully.`);
    } catch (err) {
      console.error('Delete order error:', err);
    }
  };

  // Seller-Wise FAQ Accordions State & Handlers
  const [openSellerAccordions, setOpenSellerAccordions] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Date & Month View Filters State
  const [dateFilterType, setDateFilterType] = useState('ALL'); // 'ALL', 'DAY', 'MONTH', 'TODAY', 'LAST30'
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().split('T')[0].slice(0, 7));

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Handle Order Status Update by Admin
  const handleUpdateAdminOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setAdminOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Update order status error:', err);
      setAdminOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  // Group orders by Seller with Date & Status Filtering
  const groupedOrdersBySeller = React.useMemo(() => {
    const map = {};

    // First populate from verified sellers list
    sellersList.forEach((seller) => {
      const key = seller.name || seller.businessName || seller.id;
      if (key) {
        map[key] = {
          sellerInfo: seller,
          sellerName: key,
          orders: []
        };
      }
    });

    // Populate orders into seller map
    adminOrders.forEach((ord) => {
      // 1. Status Filter Check
      if (orderStatusFilter !== 'ALL' && ord.status !== orderStatusFilter) {
        return;
      }

      // 2. Search Query Check
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = ord.id?.toLowerCase().includes(q);
        const matchCustomer = (ord.buyerName || ord.customerName || '').toLowerCase().includes(q);
        const matchSeller = (ord.sellerName || '').toLowerCase().includes(q);
        const matchProduct = ord.items?.some((i) => i.name?.toLowerCase().includes(q));
        if (!matchId && !matchCustomer && !matchSeller && !matchProduct) {
          return;
        }
      }

      // 3. Date / Month Filter Check
      const ordDateStr = ord.date || ord.createdAt;
      if (ordDateStr && dateFilterType !== 'ALL') {
        const ordDateObj = new Date(ordDateStr);
        const isValidDate = !isNaN(ordDateObj.getTime());

        let ordYMD = '';
        let ordYM = '';
        if (isValidDate) {
          ordYMD = ordDateObj.toISOString().split('T')[0];
          ordYM = ordYMD.slice(0, 7);
        } else if (typeof ordDateStr === 'string') {
          ordYMD = ordDateStr.slice(0, 10);
          ordYM = ordDateStr.slice(0, 7);
        }

        const todayYMD = new Date().toISOString().split('T')[0];

        if (dateFilterType === 'DAY' && selectedDate) {
          if (ordYMD !== selectedDate) return;
        } else if (dateFilterType === 'MONTH' && selectedMonth) {
          if (ordYM !== selectedMonth) return;
        } else if (dateFilterType === 'TODAY') {
          if (ordYMD !== todayYMD) return;
        } else if (dateFilterType === 'LAST30') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (isValidDate && ordDateObj < thirtyDaysAgo) return;
        }
      }

      const ordSeller =
        ord.sellerName ||
        (ord.items && ord.items[0] && ord.items[0].sellerName) ||
        'Direct / Unassigned Marketplace Orders';

      let matchedKey = Object.keys(map).find(
        (k) => k.toLowerCase().trim() === ordSeller.toLowerCase().trim()
      );

      if (!matchedKey) {
        matchedKey = ordSeller;
        if (!map[matchedKey]) {
          map[matchedKey] = {
            sellerInfo: null,
            sellerName: matchedKey,
            orders: []
          };
        }
      }

      map[matchedKey].orders.push(ord);
    });

    return map;
  }, [sellersList, adminOrders, orderStatusFilter, orderSearchQuery, dateFilterType, selectedDate, selectedMonth]);

  // Calculate total filtered orders count across all sellers dynamically
  const totalFilteredOrdersCount = React.useMemo(() => {
    return Object.values(groupedOrdersBySeller).reduce(
      (sum, group) => sum + (group.orders ? group.orders.length : 0),
      0
    );
  }, [groupedOrdersBySeller]);

  // Export Filtered Orders to Excel / CSV
  const handleExportExcel = () => {
    const allFilteredOrders = [];
    Object.entries(groupedOrdersBySeller).forEach(([sellerName, group]) => {
      group.orders.forEach((ord) => {
        allFilteredOrders.push({
          sellerName,
          ...ord
        });
      });
    });

    if (allFilteredOrders.length === 0) {
      alert('No orders available to export for the selected filter criteria.');
      return;
    }

    const headers = [
      'Order ID',
      'Order Date',
      'Seller Name',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Dispatch Address',
      'Order Status',
      'Payment Method',
      'Tracking Number',
      'Items Summary',
      'Total Amount (INR)'
    ];

    const csvRows = [headers.join(',')];

    allFilteredOrders.forEach((ord) => {
      const itemsSummary = (ord.items || [])
        .map((i) => `${i.name} (x${i.qty || 1})`)
        .join('; ');

      const row = [
        `"${ord.id || ''}"`,
        `"${ord.date || ''}"`,
        `"${(ord.sellerName || '').replace(/"/g, '""')}"`,
        `"${(ord.buyerName || ord.customerName || '').replace(/"/g, '""')}"`,
        `"${(ord.buyerEmail || '').replace(/"/g, '""')}"`,
        `"${(ord.buyerPhone || '').replace(/"/g, '""')}"`,
        `"${(ord.address || '').replace(/"/g, '""')}"`,
        `"${ord.status || 'Confirmed'}"`,
        `"${ord.paymentMethod || 'Prepaid'}"`,
        `"${ord.trackingNumber || ''}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        ord.totalAmount || 0
      ];

      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    let filterLabel = 'All_Orders';
    if (dateFilterType === 'DAY') filterLabel = `Date_${selectedDate}`;
    else if (dateFilterType === 'MONTH') filterLabel = `Month_${selectedMonth}`;
    else if (dateFilterType === 'TODAY') filterLabel = `Today_${new Date().toISOString().split('T')[0]}`;

    link.setAttribute('href', url);
    link.setAttribute('download', `Ratnaya_Orders_${filterLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Filtered Orders to PDF Document
  const handleExportPDF = () => {
    const allFilteredOrders = [];
    Object.entries(groupedOrdersBySeller).forEach(([sellerName, group]) => {
      group.orders.forEach((ord) => {
        allFilteredOrders.push({
          sellerName,
          ...ord
        });
      });
    });

    if (allFilteredOrders.length === 0) {
      alert('No orders available to generate PDF report for the selected filters.');
      return;
    }

    let filterDesc = 'All Time';
    if (dateFilterType === 'DAY') filterDesc = `Date: ${selectedDate}`;
    else if (dateFilterType === 'MONTH') filterDesc = `Month: ${selectedMonth}`;
    else if (dateFilterType === 'TODAY') filterDesc = `Today: ${new Date().toISOString().split('T')[0]}`;
    else if (dateFilterType === 'LAST30') filterDesc = 'Last 30 Days';

    const totalRevenue = allFilteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const logoUrl = `${window.location.origin}/assets/logo.png`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to view and download the PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ratnaya Seller Orders Governance Report - ${filterDesc}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; padding: 0; margin: 0; background: #fff; }
            .report-container { padding: 30px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #c59b27; padding-bottom: 14px; margin-bottom: 20px; }
            .brand-wrapper { display: flex; align-items: center; gap: 14px; }
            .brand-logo { height: 46px; width: auto; object-fit: contain; }
            .brand { font-size: 24px; font-weight: bold; color: #b8860b; letter-spacing: 2px; line-height: 1; }
            .sub { font-size: 11px; color: #666; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
            .summary-box { display: flex; gap: 15px; background: #faf6f0; border: 1px solid #e2d8c3; padding: 14px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; }
            .summary-item { flex: 1; }
            .summary-item span { font-size: 10px; color: #666; text-transform: uppercase; display: block; font-weight: 600; }
            .summary-item strong { display: block; font-size: 16px; color: #111; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #111; color: #fff; text-align: left; padding: 9px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 8px 10px; border-bottom: 1px solid #eee; }
            tr:nth-child(even) { background: #fcfbfa; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; }
            .badge-delivered { background: #d1fae5; color: #065f46; }
            .badge-shipped { background: #dbeafe; color: #1e40af; }
            .badge-confirmed { background: #fef3c7; color: #92400e; }
            .badge-refunded { background: #f3e8ff; color: #6b21a8; }
            .footer { margin-top: 30px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
            .no-print-bar { background: #111; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 13px; font-weight: 500; }
            .btn-download { background: #c59b27; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
            .btn-download:hover { background: #a67c1e; }
            .btn-close { background: #333; color: #ccc; border: none; padding: 8px 14px; border-radius: 4px; font-size: 12px; cursor: pointer; }
            @media print {
              .no-print { display: none !important; }
              .report-container { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="no-print no-print-bar">
            <span>📄 Ratnaya Order Governance PDF Report Ready</span>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.print()" class="btn-download">📥 Download PDF / Save as PDF</button>
              <button onclick="window.close()" class="btn-close">✕ Close</button>
            </div>
          </div>

          <div class="report-container">
            <div class="header">
              <div class="brand-wrapper">
                <img src="${logoUrl}" alt="Ratnaya Logo" class="brand-logo" />
                <div>
                  <div class="brand">RATNAYA</div>
                  <div class="sub">Luxury Jewellery Marketplace • Seller Governance Report</div>
                </div>
              </div>
              <div style="text-align: right; font-size: 11px;">
                <div><strong>Report Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
                <div><strong>Time Filter:</strong> ${filterDesc}</div>
                <div><strong>Status Filter:</strong> ${orderStatusFilter}</div>
              </div>
            </div>

            <div class="summary-box">
              <div class="summary-item">
                <span>Total Orders</span>
                <strong>${allFilteredOrders.length} Orders</strong>
              </div>
              <div class="summary-item">
                <span>Total Revenue</span>
                <strong>₹${totalRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div class="summary-item">
                <span>Active Sellers</span>
                <strong>${Object.keys(groupedOrdersBySeller).length} Jewellers</strong>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Seller / Jeweller</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment & Tracking</th>
                </tr>
              </thead>
              <tbody>
                ${allFilteredOrders
        .map(
          (o) => `
                  <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.date || 'N/A'}</td>
                    <td>${o.sellerName}</td>
                    <td>${o.buyerName || o.customerName || 'Customer'}</td>
                    <td><strong>₹${(o.totalAmount || 0).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span class="badge ${o.status === 'Delivered'
              ? 'badge-delivered'
              : o.status === 'Shipped'
                ? 'badge-shipped'
                : o.status === 'Refunded'
                  ? 'badge-refunded'
                  : 'badge-confirmed'
            }">
                        ${o.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>${o.paymentMethod || 'Prepaid'} | ${o.trackingNumber || 'Awaiting Dispatch'}</td>
                  </tr>
                `
        )
        .join('')}
              </tbody>
            </table>

            <div class="footer">
              Ratnaya Super Admin Official Audit Report • Confidential Internal Document
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Export Individual Seller Orders to Excel / CSV
  const handleExportSellerExcel = (sellerKey, group) => {
    const sellerOrders = group.orders || [];

    if (sellerOrders.length === 0) {
      alert(`No orders available to export for jeweller "${sellerKey}".`);
      return;
    }

    const headers = [
      'Order ID',
      'Order Date',
      'Jeweller / Seller',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Dispatch Address',
      'Order Status',
      'Payment Method',
      'Tracking Number',
      'Items Summary',
      'Total Amount (INR)'
    ];

    const csvRows = [headers.join(',')];

    sellerOrders.forEach((ord) => {
      const itemsSummary = (ord.items || [])
        .map((i) => `${i.name} (x${i.qty || 1})`)
        .join('; ');

      const row = [
        `"${ord.id || ''}"`,
        `"${ord.date || ''}"`,
        `"${sellerKey.replace(/"/g, '""')}"`,
        `"${(ord.buyerName || ord.customerName || '').replace(/"/g, '""')}"`,
        `"${(ord.buyerEmail || '').replace(/"/g, '""')}"`,
        `"${(ord.buyerPhone || '').replace(/"/g, '""')}"`,
        `"${(ord.address || '').replace(/"/g, '""')}"`,
        `"${ord.status || 'Confirmed'}"`,
        `"${ord.paymentMethod || 'Prepaid'}"`,
        `"${ord.trackingNumber || ''}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        ord.totalAmount || 0
      ];

      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanSellerName = sellerKey.replace(/[^a-zA-Z0-9_]/g, '_');
    let filterLabel = 'All_Time';
    if (dateFilterType === 'DAY') filterLabel = `Date_${selectedDate}`;
    else if (dateFilterType === 'MONTH') filterLabel = `Month_${selectedMonth}`;
    else if (dateFilterType === 'TODAY') filterLabel = `Today_${new Date().toISOString().split('T')[0]}`;

    link.setAttribute('href', url);
    link.setAttribute('download', `Ratnaya_Orders_${cleanSellerName}_${filterLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Individual Seller Orders to PDF Document
  const handleExportSellerPDF = (sellerKey, group) => {
    const sellerOrders = group.orders || [];

    if (sellerOrders.length === 0) {
      alert(`No orders available to generate PDF report for jeweller "${sellerKey}".`);
      return;
    }

    let filterDesc = 'All Time';
    if (dateFilterType === 'DAY') filterDesc = `Date: ${selectedDate}`;
    else if (dateFilterType === 'MONTH') filterDesc = `Month: ${selectedMonth}`;
    else if (dateFilterType === 'TODAY') filterDesc = `Today: ${new Date().toISOString().split('T')[0]}`;
    else if (dateFilterType === 'LAST30') filterDesc = 'Last 30 Days';

    const sellerTotalRevenue = sellerOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const sellerInfo = group.sellerInfo;
    const logoUrl = `${window.location.origin}/assets/logo.png`;
    const sellerLogoUrl = sellerInfo?.logo
      ? (sellerInfo.logo.startsWith('http') ? sellerInfo.logo : window.location.origin + (sellerInfo.logo.startsWith('/') ? sellerInfo.logo : '/' + sellerInfo.logo))
      : null;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to view and download the PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ratnaya Merchant Statement - ${sellerKey} (${filterDesc})</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; padding: 0; margin: 0; background: #fff; }
            .report-container { padding: 30px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #c59b27; padding-bottom: 14px; margin-bottom: 20px; }
            .brand-wrapper { display: flex; align-items: center; gap: 14px; }
            .brand-logo { height: 46px; width: auto; object-fit: contain; }
            .brand { font-size: 24px; font-weight: bold; color: #b8860b; letter-spacing: 2px; line-height: 1; }
            .sub { font-size: 11px; color: #666; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
            .seller-card { background: #faf6f0; border: 1px solid #e2d8c3; padding: 16px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; }
            .seller-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
            .seller-logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #c59b27; }
            .seller-card h2 { margin: 0; font-size: 18px; color: #111; }
            .seller-details { color: #555; font-size: 11px; margin-top: 3px; }
            .summary-box { display: flex; gap: 15px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #d8caa9; }
            .summary-item { flex: 1; }
            .summary-item span { font-size: 10px; color: #666; text-transform: uppercase; display: block; font-weight: 600; }
            .summary-item strong { display: block; font-size: 15px; color: #111; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #111; color: #fff; text-align: left; padding: 9px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 8px 10px; border-bottom: 1px solid #eee; }
            tr:nth-child(even) { background: #fcfbfa; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; }
            .badge-delivered { background: #d1fae5; color: #065f46; }
            .badge-shipped { background: #dbeafe; color: #1e40af; }
            .badge-confirmed { background: #fef3c7; color: #92400e; }
            .badge-refunded { background: #f3e8ff; color: #6b21a8; }
            .footer { margin-top: 30px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
            .no-print-bar { background: #111; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 13px; font-weight: 500; }
            .btn-download { background: #c59b27; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
            .btn-download:hover { background: #a67c1e; }
            .btn-close { background: #333; color: #ccc; border: none; padding: 8px 14px; border-radius: 4px; font-size: 12px; cursor: pointer; }
            @media print {
              .no-print { display: none !important; }
              .report-container { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="no-print no-print-bar">
            <span>📄 Ratnaya Merchant Statement PDF for <strong>${sellerKey}</strong></span>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.print()" class="btn-download">📥 Download PDF / Save as PDF</button>
              <button onclick="window.close()" class="btn-close">✕ Close</button>
            </div>
          </div>

          <div class="report-container">
            <div class="header">
              <div class="brand-wrapper">
                <img src="${logoUrl}" alt="Ratnaya Logo" class="brand-logo" />
                <div>
                  <div class="brand">RATNAYA</div>
                  <div class="sub">Luxury Jewellery Marketplace • Individual Merchant Order Statement</div>
                </div>
              </div>
              <div style="text-align: right; font-size: 11px;">
                <div><strong>Statement Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
                <div><strong>Time Range:</strong> ${filterDesc}</div>
                <div><strong>Status Filter:</strong> ${orderStatusFilter}</div>
              </div>
            </div>

            <div class="seller-card">
              <div class="seller-header">
                ${sellerLogoUrl ? `<img src="${sellerLogoUrl}" alt="${sellerKey}" class="seller-logo" />` : ''}
                <div>
                  <h2>${sellerKey}</h2>
                  <div class="seller-details">
                    ${sellerInfo?.owner ? `Owner: <strong>${sellerInfo.owner}</strong>` : 'Verified Jeweller Merchant'}
                    ${sellerInfo?.city ? ` | Location: <strong>${sellerInfo.city}</strong>` : ''}
                    ${sellerInfo?.gst ? ` | GSTIN: <strong>${sellerInfo.gst}</strong>` : ''}
                  </div>
                </div>
              </div>

              <div class="summary-box">
                <div class="summary-item">
                  <span>Total Seller Orders</span>
                  <strong>${sellerOrders.length} Orders</strong>
                </div>
                <div class="summary-item">
                  <span>Total Gross Sales</span>
                  <strong>₹${sellerTotalRevenue.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Contact Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment & Logistics</th>
                </tr>
              </thead>
              <tbody>
                ${sellerOrders
        .map(
          (o) => `
                  <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.date || 'N/A'}</td>
                    <td>${o.buyerName || o.customerName || 'Customer'}</td>
                    <td>${o.buyerEmail || ''} ${o.buyerPhone ? `<br/>${o.buyerPhone}` : ''}</td>
                    <td><strong>₹${(o.totalAmount || 0).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span class="badge ${o.status === 'Delivered'
              ? 'badge-delivered'
              : o.status === 'Shipped'
                ? 'badge-shipped'
                : o.status === 'Refunded'
                  ? 'badge-refunded'
                  : 'badge-confirmed'
            }">
                        ${o.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>${o.paymentMethod || 'Prepaid'}<br/><small style="color:#666">${o.trackingNumber || 'No tracking'}</small></td>
                  </tr>
                `
        )
        .join('')}
              </tbody>
            </table>

            <div class="footer">
              Ratnaya Super Admin Official Audit Statement for ${sellerKey} • Confidential Document
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Auto-expand sellers that have active orders when Orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      const initialOpen = {};
      Object.entries(groupedOrdersBySeller).forEach(([key, group]) => {
        if (group.orders.length > 0) {
          initialOpen[key] = true;
        }
      });
      setOpenSellerAccordions((prev) => ({ ...initialOpen, ...prev }));
    }
  }, [activeTab, groupedOrdersBySeller]);

  const toggleSellerAccordion = (sellerKey) => {
    setOpenSellerAccordions((prev) => ({
      ...prev,
      [sellerKey]: !prev[sellerKey]
    }));
  };

  const handleExpandAllSellers = () => {
    const allOpen = {};
    Object.keys(groupedOrdersBySeller).forEach((key) => {
      allOpen[key] = true;
    });
    setOpenSellerAccordions(allOpen);
  };

  const handleCollapseAllSellers = () => {
    setOpenSellerAccordions({});
  };

  // Load Sellers and Pending Applications from Backend API on mount
  useEffect(() => {
    async function loadSellers() {
      try {
        const res = await api.getSellers();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellersList(res.data);
        }
      } catch (err) {
        console.warn('Sellers API load error:', err);
      }

      try {
        const pRes = await api.getPendingSellers();
        if (pRes && pRes.success && Array.isArray(pRes.data)) {
          setPendingSellers(pRes.data);
        }
      } catch (err) {
        console.warn('Pending sellers API load error:', err);
      }
    }
    loadSellers();
  }, []);

  const handleApproveSeller = async (id) => {
    const approvedItem = pendingSellers.find((s) => s.id === id || s._id === id);

    try {
      await api.approveSeller(id);
    } catch (err) {
      console.error('Approve seller API error:', err);
    }

    if (approvedItem) {
      const newSeller = {
        id: approvedItem.id || `seller-${Date.now()}`,
        name: approvedItem.businessName || approvedItem.name,
        owner: approvedItem.ownerName || approvedItem.owner,
        city: approvedItem.city || '',
        phone: approvedItem.phone || '',
        email: approvedItem.email || '',
        rating: 5.0,
        reviewsCount: 0,
        productsCount: 0,
        verified: true,
        joinedDate: new Date().getFullYear().toString(),
        logo: approvedItem.logo || '',
        banner: approvedItem.banner || '',
        about: approvedItem.about || `${approvedItem.businessName || approvedItem.name || 'Jeweller'} is a verified merchant.`,
        gst: approvedItem.gst || '',
        pan: approvedItem.pan || '',
        bisLicense: approvedItem.bisLicense || '',
        status: 'Approved',
        commissionRate: 10
      };
      setSellersList((prev) => [newSeller, ...prev.filter((s) => s.id !== newSeller.id)]);
    }

    const filtered = pendingSellers.filter((s) => s.id !== id && s._id !== id);
    setPendingSellers(filtered);
  };

  // Seller Rejection Modal State
  const [sellerRejectModal, setSellerRejectModal] = useState({
    isOpen: false,
    seller: null,
    reason: ''
  });

  const handleOpenSellerRejectModal = (s) => {
    setSellerRejectModal({
      isOpen: true,
      seller: s,
      reason: 'GST document verification or business compliance requirements were not met. Please re-upload valid documents.'
    });
  };

  const handleConfirmRejectSeller = async (e) => {
    e.preventDefault();
    if (!sellerRejectModal.seller) return;

    const sellerId = sellerRejectModal.seller.id || sellerRejectModal.seller._id;
    const reason = sellerRejectModal.reason || 'Document verification or business compliance requirements were not met.';

    try {
      const res = await api.rejectSeller(sellerId, reason);
      if (res && res.success) {
        setPendingSellers((prev) => prev.filter((item) => item.id !== sellerId && item._id !== sellerId));
        alert(`Seller application rejected successfully. ${res.emailSent ? '📧 Rejection email sent to seller!' : ''}`);
        setSellerRejectModal({ isOpen: false, seller: null, reason: '' });
      } else {
        alert(res?.message || 'Failed to reject seller.');
      }
    } catch (err) {
      console.error('Error rejecting seller:', err);
      alert('Error sending seller rejection request.');
    }
  };

  // Seller Document Verification State (GST, PAN, BIS)
  const [docVerification, setDocVerification] = useState({});
  const [verifyingDoc, setVerifyingDoc] = useState({});

  const handleVerifySellerDoc = async (sellerId, type, number) => {
    if (!number) {
      alert(`No ${type.toUpperCase()} number provided for verification.`);
      return;
    }

    const key = `${sellerId}_${type}`;
    setVerifyingDoc((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await api.verifySellerDocument(type, number);
      if (res && res.verified) {
        setDocVerification((prev) => ({
          ...prev,
          [key]: { success: true, message: res.message, details: res.details }
        }));
      } else {
        setDocVerification((prev) => ({
          ...prev,
          [key]: { success: false, message: res?.message || 'Invalid format.' }
        }));
      }
    } catch (err) {
      setDocVerification((prev) => ({
        ...prev,
        [key]: { success: false, message: err.message || 'Verification failed.' }
      }));
    } finally {
      setVerifyingDoc((prev) => ({ ...prev, [key]: false }));
    }
  };


  // Product Rejection Modal State
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    product: null,
    reason: 'Does not meet product quality & BIS hallmarking standards.'
  });

  const handleApproveProduct = async (id, name) => {
    const targetIdStr = String(id).toLowerCase();
    const targetNameStr = name ? String(name).toLowerCase() : '';
    const filtered = pendingProducts.filter((p) => {
      const pId = String(p.id || p._id || '').toLowerCase();
      const pName = String(p.name || '').toLowerCase();
      if (pId === targetIdStr) return false;
      if (targetNameStr && pName === targetNameStr) return false;
      return true;
    });
    setPendingProducts(filtered);
    try {
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(filtered));
    } catch (e) { }

    // Database API approve call
    await api.approveProduct(id).catch((err) => console.error('API Approve Error:', err));
  };

  const handleOpenRejectModal = (product) => {
    setRejectModal({
      isOpen: true,
      product,
      reason: 'Images are unclear or BIS hallmark specifications are missing.'
    });
  };

  const handleConfirmRejectProduct = async (e) => {
    e.preventDefault();
    if (!rejectModal.product) return;

    const prodId = rejectModal.product.id || rejectModal.product._id;
    const prodName = rejectModal.product.name;
    const reason = rejectModal.reason || 'Product rejected by Admin.';

    const targetIdStr = String(prodId).toLowerCase();
    const targetNameStr = prodName ? String(prodName).toLowerCase() : '';
    const filtered = pendingProducts.filter((p) => {
      const pId = String(p.id || p._id || '').toLowerCase();
      const pName = String(p.name || '').toLowerCase();
      if (pId === targetIdStr) return false;
      if (targetNameStr && pName === targetNameStr) return false;
      return true;
    });
    setPendingProducts(filtered);
    try {
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(filtered));
    } catch (e) { }

    try {
      const res = await api.rejectProduct(prodId, reason);
      if (res && res.success) {
        alert(`Product rejected successfully. ${res.emailSent ? '📧 Rejection email sent to seller!' : ''}`);
      } else {
        alert(res?.message || 'Product rejected.');
      }
    } catch (err) {
      console.error('API Reject Error:', err);
      alert('Error rejecting product request.');
    }

    setRejectModal({ isOpen: false, product: null, reason: '' });
  };

  const handleAddSellerSubmit = async (e) => {
    e.preventDefault();
    const createdSeller = {
      id: `seller-${Date.now()}`,
      name: newSellerData.name,
      owner: newSellerData.owner,
      city: newSellerData.city,
      email: newSellerData.email,
      phone: newSellerData.phone,
      rating: 5.0,
      reviewsCount: 0,
      productsCount: 0,
      verified: true,
      joinedDate: '2026',
      logo: '/assets/jewellery/ring/1.jpg',
      banner: '/assets/jewellery/ring/1.jpg',
      about: `${newSellerData.name} is a newly added verified merchant.`,
      gst: newSellerData.gst,
      pan: newSellerData.pan,
      status: 'Approved',
      commissionRate: Number(newSellerData.commissionRate) || 10
    };

    try {
      await api.registerSeller(createdSeller);
    } catch (err) {
      console.warn('API error adding seller:', err);
    }

    setSellersList([createdSeller, ...sellersList]);
    setIsAddSellerOpen(false);
    setNewSellerData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      city: 'Jaipur',
      gst: '22AAAAA0000A1Z5',
      pan: 'ABCDE1234F',
      commissionRate: 10
    });
    alert(`New Jeweller "${createdSeller.name}" added successfully with ${createdSeller.commissionRate}% Commission Rate!`);
  };

  const handleUpdateSellerCommission = (sellerId, newRate) => {
    const updatedSellers = sellersList.map((s) =>
      s.id === sellerId ? { ...s, commissionRate: Number(newRate) } : s
    );
    setSellersList(updatedSellers);
    alert(`Commission rate updated to ${newRate}%!`);
  };

  const totalMarketplaceRevenue = 1450000;
  const platformCommissionEarned = sellersList.reduce((acc, s) => {
    const sellerCommission = s.commissionRate || globalCommission;
    return acc + Math.round((totalMarketplaceRevenue / sellersList.length) * (sellerCommission / 100));
  }, 0);

  return (
    <div className="bg-[#FAF6F0] min-h-[90vh] pb-20">
      {/* Admin Header Bar */}
      <div className="bg-[#111111] text-white py-6 border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[0.68rem] text-gold tracking-widest uppercase font-semibold">
                  SUPER ADMIN GOVERNANCE
                </span>
                <h2 className="font-heading text-xl sm:text-2xl text-white">
                  Ratnaya Admin Control Panel
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddSellerOpen(true)}
                className="btn-gold py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <PlusCircle size={15} /> ADD NEW SELLER
              </button>
              <span className="bg-gold/20 text-gold-light border border-gold/40 text-xs px-3.5 py-2 rounded-full font-bold tracking-wider shrink-0 uppercase">
                COMMISSION: {globalCommission}%
              </span>
              <span className="bg-gold/20 text-gold-light border border-gold/40 text-xs px-3.5 py-2 rounded-full font-bold tracking-wider shrink-0 uppercase">
                GST RATE: {globalGstRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Admin Sidebar Navigation */}
          <aside>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Platform Overview', icon: <TrendingUp size={18} /> },
                { id: 'sellers', label: `Verified Jewellers (${sellersList.length})`, icon: <Users size={18} /> },
                { id: 'commission', label: 'Commissions & Rates', icon: <Percent size={18} /> },
                { id: 'seller-approvals', label: `Seller Approvals (${pendingSellers.length})`, icon: <Store size={18} /> },
                { id: 'product-approvals', label: `Product Approvals (${pendingProducts.length})`, icon: <Package size={18} /> },
                { id: 'returns', label: `Returns & Refunds (${adminOrders.filter((o) => o.status === 'Return Requested').length})`, icon: <RotateCcw size={18} /> },
                { id: 'orders', label: 'All Orders & Logistics', icon: <ShoppingBag size={18} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 text-xs sm:text-sm flex items-center gap-3 whitespace-nowrap border-b border-gray-100 transition-colors cursor-pointer ${activeTab === tab.id
                      ? 'bg-[#FAF6F0] text-gold-dark font-semibold border-l-4 border-l-gold'
                      : 'text-charcoal hover:bg-gray-50 bg-transparent'
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Admin Main Body */}
          <main className="min-w-0">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Gross Marketplace Sales</div>
                    <div className="font-heading text-2xl font-semibold text-charcoal my-1">
                      ₹{totalMarketplaceRevenue.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium">+24.2% Growth YTD</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Admin Commission Earned</div>
                    <div className="font-heading text-2xl font-semibold text-gold-dark my-1">
                      ₹{platformCommissionEarned.toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-gray-500">Net Platform Revenue</span>
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-medium">Active Jeweller Sellers</div>
                    <div className="font-heading text-2xl font-semibold text-charcoal my-1">
                      {sellersList.length} Sellers
                    </div>
                    <span className="text-xs text-gold-dark font-medium">Verified Merchants</span>
                  </div>
                </div>

                {/* Seller Management Quick Bar */}
                <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="font-heading text-xl">
                      Verified Jewellers & Commission Summary
                    </h3>
                    <button onClick={() => setIsAddSellerOpen(true)} className="btn-gold py-1.5 px-3 text-xs">
                      <PlusCircle size={14} /> ADD SELLER
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sellersList.map((seller) => (
                      <div
                        key={seller.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FAF6F0] border border-gray-200 rounded-sm gap-2"
                      >
                        <div>
                          <strong className="text-sm block text-charcoal">{seller.name}</strong>
                          <span className="text-xs text-gray-500">
                            Owner: {seller.owner} • City: {seller.city} • GST: {seller.gst}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gold-dark">
                          Commission: {seller.commissionRate || globalCommission}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VERIFIED SELLERS TAB */}
            {activeTab === 'sellers' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="font-heading text-xl">
                    Verified Jeweller Merchants ({sellersList.length})
                  </h3>
                  <button onClick={() => setIsAddSellerOpen(true)} className="btn-gold py-2 px-4 text-xs flex items-center gap-1">
                    <PlusCircle size={15} /> ADD SELLER
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {sellersList.map((seller) => (
                    <div key={seller.id} className="p-5 border border-gray-200 rounded-sm bg-[#FAF6F0]">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-lg text-charcoal">{seller.name}</h4>
                            <span className="badge-approved text-[0.65rem]">VERIFIED</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Owner: <strong>{seller.owner}</strong> | Location: <strong>{seller.city}</strong> | GST: <strong>{seller.gst}</strong>
                          </p>
                        </div>

                        {/* Commission Rate Setting per Seller */}
                        <div className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-sm">
                          <span className="text-xs font-semibold text-gray-600">Commission (%):</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={seller.commissionRate || 10}
                            id={`comm-input-${seller.id}`}
                            className="w-16 p-1 text-xs font-bold rounded-sm border border-gray-300 text-center"
                          />
                          <button
                            onClick={() => {
                              const val = document.getElementById(`comm-input-${seller.id}`).value;
                              handleUpdateSellerCommission(seller.id, val);
                            }}
                            className="btn-gold py-1 px-3 text-xs"
                          >
                            SAVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMISSION & PAYOUTS TAB */}
            {activeTab === 'commission' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm space-y-6">
                <div>
                  <h3 className="font-heading text-2xl text-charcoal mb-1">
                    Admin Commission Configuration & GST Tax Rates
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Set global platform commission percentages, default GST tax rates, or configure custom percentage rates per jeweller merchant.
                  </p>
                </div>

                {/* 2-Column Side-by-Side Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Default Global Commission Rate */}
                  <div className="bg-[#FAF6F0] p-6 rounded-sm border border-gray-200 shadow-2xs space-y-3">
                    <label className="text-xs font-semibold uppercase text-gray-600 block">
                      Default Global Platform Commission Rate (%)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative max-w-[130px] shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={globalCommission}
                          onChange={(e) => setGlobalCommission(Number(e.target.value))}
                          className="input-field text-center font-bold text-base text-charcoal py-2 pr-7"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">%</span>
                      </div>
                      <button
                        type="button"
                        className="btn-gold py-2.5 px-5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                        onClick={handleSaveCommission}
                      >
                        SAVE GLOBAL RATE
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Default Global GST Tax Rate */}
                  <div className="bg-[#FAF6F0] p-6 rounded-sm border border-gray-200 shadow-2xs space-y-3">
                    <label className="text-xs font-semibold uppercase text-gray-600 block">
                      Default Global GST Tax Rate (%)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative max-w-[130px] shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={globalGstRate}
                          onChange={(e) => setGlobalGstRate(Number(e.target.value))}
                          className="input-field text-center font-bold text-base text-charcoal py-2 pr-7"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">%</span>
                      </div>
                      <button
                        type="button"
                        className="btn-gold py-2.5 px-5 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                        onClick={handleSaveGstRate}
                      >
                        SAVE GST RATE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SELLER APPROVALS TAB */}
            {activeTab === 'seller-approvals' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal">
                      Pending Jeweller Merchant Registrations
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Review business KYC documents, GSTIN status, and approve merchant partner onboardings.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{pendingSellers.length} Applications Pending</span>
                </div>

                {pendingSellers.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">All Seller Applications Processed</h4>
                    <p className="text-xs text-gray-500">There are currently no pending merchant verification requests.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {pendingSellers.map((s) => (
                      <div key={s.id} className="p-6 border border-gray-200 rounded-sm bg-[#FAF6F0] shadow-sm flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-heading text-xl text-charcoal">{s.businessName}</h4>
                            <span className="badge-pending text-xs">{s.kycStatus}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs text-gray-600">
                            <div><strong>Owner Name:</strong> {s.ownerName || s.owner}</div>
                            <div><strong>City / Base:</strong> {s.city || 'Jaipur'}</div>
                            <div><strong>Email:</strong> {s.email}</div>
                            <div><strong>Phone:</strong> {s.phone}</div>
                            <div><strong>Applied Date:</strong> {s.appliedDate || 'Recent'}</div>

                            {/* GSTIN Verification Row */}
                            <div className="sm:col-span-2 bg-white p-2.5 rounded border border-gray-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-charcoal">GSTIN Number:</span>
                                <span className="font-mono text-charcoal font-bold">{s.gst || 'Not provided'}</span>
                                {docVerification[`${s.id}_gst`]?.success ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Verified Active Taxpayer
                                  </span>
                                ) : docVerification[`${s.id}_gst`]?.success === false ? (
                                  <span className="bg-rose-100 text-rose-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <XCircle size={11} /> Invalid GST
                                  </span>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                disabled={verifyingDoc[`${s.id}_gst`] || !s.gst}
                                onClick={() => handleVerifySellerDoc(s.id, 'gst', s.gst)}
                                className="btn-gold py-1 px-3 text-[0.7rem] disabled:opacity-50 cursor-pointer font-semibold"
                              >
                                {verifyingDoc[`${s.id}_gst`] ? 'Verifying...' : docVerification[`${s.id}_gst`]?.success ? '✓ Re-Verify GST' : 'Verify GST'}
                              </button>
                              {docVerification[`${s.id}_gst`]?.success && (
                                <div className="w-full text-[0.7rem] text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200 mt-1">
                                  ✓ Govt Portal Status: Active Taxpayer | State Code: {docVerification[`${s.id}_gst`].details?.stateCode} | PAN Segment: {docVerification[`${s.id}_gst`].details?.panPart} | Type: {docVerification[`${s.id}_gst`].details?.taxpayerType}
                                </div>
                              )}
                              {docVerification[`${s.id}_gst`]?.success === false && (
                                <div className="w-full text-[0.7rem] text-rose-700 font-medium bg-rose-50 p-1.5 rounded border border-rose-200 mt-1">
                                  ⚠️ {docVerification[`${s.id}_gst`].message}
                                </div>
                              )}
                            </div>

                            {/* PAN Card Verification Row */}
                            <div className="sm:col-span-2 bg-white p-2.5 rounded border border-gray-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-charcoal">PAN Card Number:</span>
                                <span className="font-mono text-charcoal font-bold">{s.pan || 'Not provided'}</span>
                                {docVerification[`${s.id}_pan`]?.success ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Verified Entity PAN
                                  </span>
                                ) : docVerification[`${s.id}_pan`]?.success === false ? (
                                  <span className="bg-rose-100 text-rose-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <XCircle size={11} /> Invalid PAN
                                  </span>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                disabled={verifyingDoc[`${s.id}_pan`] || !s.pan}
                                onClick={() => handleVerifySellerDoc(s.id, 'pan', s.pan)}
                                className="btn-gold py-1 px-3 text-[0.7rem] disabled:opacity-50 cursor-pointer font-semibold"
                              >
                                {verifyingDoc[`${s.id}_pan`] ? 'Verifying...' : docVerification[`${s.id}_pan`]?.success ? '✓ Re-Verify PAN' : 'Verify PAN'}
                              </button>
                              {docVerification[`${s.id}_pan`]?.success && (
                                <div className="w-full text-[0.7rem] text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200 mt-1">
                                  ✓ NSDL Verification: Active & Verified | Type: {docVerification[`${s.id}_pan`].details?.panType}
                                </div>
                              )}
                              {docVerification[`${s.id}_pan`]?.success === false && (
                                <div className="w-full text-[0.7rem] text-rose-700 font-medium bg-rose-50 p-1.5 rounded border border-rose-200 mt-1">
                                  ⚠️ {docVerification[`${s.id}_pan`].message}
                                </div>
                              )}
                            </div>

                            {/* BIS Hallmark Verification Row */}
                            <div className="sm:col-span-2 bg-white p-2.5 rounded border border-gray-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-charcoal">BIS Hallmark License:</span>
                                <span className="font-mono text-charcoal font-bold">{s.bisLicense || 'BIS-HUID-992014'}</span>
                                {docVerification[`${s.id}_bis`]?.success ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Verified Hallmark License
                                  </span>
                                ) : docVerification[`${s.id}_bis`]?.success === false ? (
                                  <span className="bg-rose-100 text-rose-800 text-[0.68rem] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <XCircle size={11} /> Invalid License
                                  </span>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                disabled={verifyingDoc[`${s.id}_bis`]}
                                onClick={() => handleVerifySellerDoc(s.id, 'bis', s.bisLicense || 'BIS-HUID-992014')}
                                className="btn-gold py-1 px-3 text-[0.7rem] disabled:opacity-50 cursor-pointer font-semibold"
                              >
                                {verifyingDoc[`${s.id}_bis`] ? 'Verifying...' : docVerification[`${s.id}_bis`]?.success ? '✓ Re-Verify BIS' : 'Verify BIS'}
                              </button>
                              {docVerification[`${s.id}_bis`]?.success && (
                                <div className="w-full text-[0.7rem] text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200 mt-1">
                                  ✓ BIS Portal Verified: {docVerification[`${s.id}_bis`].details?.licenseType} | Grade: {docVerification[`${s.id}_bis`].details?.hallmarkPurityGrade}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Submitted KYC Proof Documents */}
                          <div className="pt-3 border-t border-gray-200">
                            <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-gray-500 block mb-2">SUBMITTED COMPLIANCE & KYC PROOF DOCUMENTS:</span>
                            <div className="flex flex-wrap items-center gap-3">
                              {/* GST Certificate Pill */}
                              <button
                                type="button"
                                onClick={() => openDocument(s.gstDoc || '/uploads/GST_Certificate.pdf')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:border-gold hover:bg-[#FAF6F0] transition-all text-xs font-mono text-charcoal shadow-2xs font-medium cursor-pointer"
                                title={`Click to View / Download GST Certificate (${formatDocSize(s.gstDocSize, '1.25 MB')})`}
                              >
                                <span>📄</span>
                                <span>{formatDocName(s.gstDoc, 'GST_Certificate.pdf')}</span>
                                <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 ml-1">
                                  {formatDocSize(s.gstDocSize, '1.25 MB')}
                                </span>
                              </button>

                              {/* PAN Card Pill */}
                              <button
                                type="button"
                                onClick={() => openDocument(s.panDoc || '/uploads/PAN_Card.jpg')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:border-gold hover:bg-[#FAF6F0] transition-all text-xs font-mono text-charcoal shadow-2xs font-medium cursor-pointer"
                                title={`Click to View / Download PAN Card Proof (${formatDocSize(s.panDocSize, '480 KB')})`}
                              >
                                <span>💳</span>
                                <span>{formatDocName(s.panDoc, 'PAN_Card.jpg')}</span>
                                <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 ml-1">
                                  {formatDocSize(s.panDocSize, '480 KB')}
                                </span>
                              </button>

                              {/* BIS Hallmark License Pill */}
                              <button
                                type="button"
                                onClick={() => openDocument(s.bisDoc || '/uploads/BIS_Hallmark_License.pdf')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:border-gold hover:bg-[#FAF6F0] transition-all text-xs font-mono text-charcoal shadow-2xs font-medium cursor-pointer"
                                title={`Click to View / Download BIS Hallmark License Certificate (${formatDocSize(s.bisDocSize, '850 KB')})`}
                              >
                                <span>🏆</span>
                                <span>{formatDocName(s.bisDoc, 'BIS_Hallmark_License.pdf')}</span>
                                <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 ml-1">
                                  {formatDocSize(s.bisDocSize, '850 KB')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Approval Actions */}
                        <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:border-l lg:border-gray-200 lg:pl-6">
                          <button
                            onClick={() => handleApproveSeller(s.id)}
                            className="btn-gold w-full py-2.5 px-5 text-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={16} /> Approve & Onboard
                          </button>
                          <button
                            onClick={() => handleOpenSellerRejectModal(s)}
                            className="btn-outline w-full py-2.5 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <XCircle size={16} /> Reject Application
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCT APPROVALS TAB */}
            {activeTab === 'product-approvals' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal">
                      Pending Jewellery Product Approvals
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Verify metal purity, BIS hallmarking specs, and pricing compliance before publishing items to the public marketplace.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{pendingProducts.length} Products Awaiting Review</span>
                </div>

                {pendingProducts.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Pending Product Reviews</h4>
                    <p className="text-xs text-gray-500">All submitted jewellery items have been reviewed and published.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {pendingProducts.map((p) => {
                      const prodId = p.id || p._id;
                      const displayImg = p.image || (Array.isArray(p.images) && p.images[0]) || '/assets/jewellery/necklace/1.jpg';
                      const displayPrice = p.price ? Number(p.price) : 0;
                      return (
                        <div key={prodId} className="p-5 border border-gray-200 rounded-sm bg-[#FAF6F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4 w-full">
                            <img
                              src={displayImg}
                              alt={p.name}
                              className="w-24 h-24 object-cover rounded-sm border border-gray-300 shadow-sm shrink-0"
                            />
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="badge-pending text-[0.65rem]">{p.status || p.approvalStatus || 'Pending Approval'}</span>
                                {p.rejectionReason && (
                                  <span className="text-[0.65rem] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                    <RotateCcw size={11} /> Resubmitted Piece
                                  </span>
                                )}
                              </div>
                              <h4 className="font-heading text-lg text-charcoal">{p.name}</h4>
                              <div className="text-xs text-gray-600">
                                Seller: <strong className="text-gold-dark">{p.sellerName || 'Jeweller Partner'}</strong> | Category: <strong className="capitalize">{p.category || 'Jewellery'}</strong>
                              </div>
                              <div className="text-xs text-gray-500">
                                Metal: <strong>{p.metal || '22K Gold'} ({p.purity || 'BIS Hallmarked'})</strong> | Submitted: <strong>{p.submittedDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent')}</strong>
                              </div>
                              <div className="font-semibold text-charcoal text-base pt-0.5">
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </div>

                              {/* Previous Rejection Callout Box for Admin */}
                              {p.rejectionReason && (
                                <div className="mt-3 p-3 bg-red-50/90 border-l-4 border-red-500 rounded-r text-xs text-red-950 space-y-1 shadow-sm">
                                  <div className="flex items-center justify-between font-bold text-[0.75rem] flex-wrap gap-1">
                                    <span className="flex items-center gap-1.5 text-red-700">
                                      <AlertCircle size={14} /> Previously Rejected on {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Earlier'}
                                    </span>
                                    {p.resubmittedAt && (
                                      <span className="text-[0.65rem] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Resubmitted: {new Date(p.resubmittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[0.73rem] text-red-900 bg-white/90 p-2 rounded border border-red-200">
                                    <strong>Previous Rejection Reason:</strong> "{p.rejectionReason}"
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex sm:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
                            <button
                              onClick={() => handleApproveProduct(prodId, p.name)}
                              className="btn-gold py-2.5 px-5 text-xs whitespace-nowrap w-full flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 size={16} /> Approve & Publish
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(p)}
                              className="btn-outline py-2.5 px-5 text-xs text-red-600 border-red-200 hover:bg-red-50 whitespace-nowrap w-full flex items-center justify-center gap-1.5"
                            >
                              <XCircle size={16} /> Reject Spec
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* RETURNS & REFUNDS MANAGER TAB */}
            {activeTab === 'returns' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal">Returns & Refund Approvals</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage buyer 14-day insured return requests, approve reverse pickups, and issue refunds.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">
                    {adminOrders.filter((o) => o.status === 'Return Requested').length} Pending Return Requests
                  </span>
                </div>

                {adminOrders.filter((o) => ['Return Requested', 'Refunded'].includes(o.status)).length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Return Requests Pending</h4>
                    <p className="text-xs text-gray-500">All customer return requests and refunds are processed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminOrders
                      .filter((o) => ['Return Requested', 'Refunded'].includes(o.status))
                      .map((ord) => (
                        <div key={ord.id} className="p-5 border border-gray-200 rounded-sm bg-[#FAF6F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="font-mono text-sm text-gold-dark">{ord.id}</strong>
                              <span className="text-xs text-gray-500">• Customer: {ord.buyerName || ord.customerName || 'Priya Malhotra'} ({ord.buyerEmail || 'priya.m@gmail.com'})</span>
                            </div>
                            <div className="text-xs text-gray-700">
                              Seller: <strong>{ord.sellerName || 'Heritage Gold Kolkata'}</strong> | Total Amount: <strong className="text-charcoal font-semibold">₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</strong>
                            </div>

                            {ord.returnDetails && (
                              <div className="mt-2 p-3 bg-white rounded border border-purple-200 text-xs">
                                <div className="text-purple-900 font-semibold mb-0.5">
                                  Return Reason: {ord.returnDetails.reason}
                                </div>
                                {ord.returnDetails.comments && (
                                  <div className="text-gray-600 italic text-[0.7rem]">"{ord.returnDetails.comments}"</div>
                                )}
                                <div className="text-[0.68rem] text-purple-700 mt-1 font-medium">
                                  Payout Mode: {ord.returnDetails.refundMethod || 'Original Payment Source'}
                                </div>
                              </div>
                            )}

                            {ord.status === 'Refunded' && ord.refundDetails && (
                              <div className="mt-2 p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
                                <strong>Refund Completed:</strong> Txn ID {ord.refundDetails.refundTxnId} | Amount: ₹{(ord.refundDetails.refundAmount || ord.totalAmount).toLocaleString('en-IN')} on {ord.refundDetails.refundDate}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                            {ord.status === 'Return Requested' && (
                              <button
                                onClick={() => handleApproveRefund(ord)}
                                className="btn-gold py-2 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                              >
                                <DollarSign size={14} /> Approve & Issue Refund
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteAdminOrder(ord.id)}
                              className="py-2 px-3 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 font-medium flex items-center gap-1 cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 size={13} /> Delete Record
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS & LOGISTICS TAB - SELLER-WISE FAQ ACCORDION DESIGN */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-gold/15 text-gold-dark px-3 py-1 rounded-full text-[0.68rem] font-bold uppercase tracking-wider mb-1">
                      <Store size={14} /> SELLER-WISE ORDER GOVERNANCE
                    </div>
                    <h3 className="font-heading text-2xl text-charcoal">
                      Jeweller Orders & Logistics Monitoring
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      View and manage buyer orders organized seller-by-seller with FAQ-style expandable accordions.
                    </p>
                  </div>

                  {/* Overview Stats Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-gold text-xs px-3 py-1.5 font-semibold">
                      {totalFilteredOrdersCount} Total Orders
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded font-semibold">
                      {Object.keys(groupedOrdersBySeller).length} Jewellers Active
                    </span>
                  </div>
                </div>

                {/* Controls Bar: Search, Date Filter, Status Filter & Export Download Toolbar */}
                <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm space-y-3 shadow-2xs">
                  {/* Top Row: Search, Date Filter Type, Date/Month Picker & Status Filter */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Seller, Customer or Item..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-gray-300 rounded focus:border-gold focus:outline-none"
                      />
                      {orderSearchQuery && (
                        <button
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-xs"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Date / Time View Selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Calendar size={15} className="text-gold-dark shrink-0" />
                      <select
                        value={dateFilterType}
                        onChange={(e) => setDateFilterType(e.target.value)}
                        className="py-2 px-3 text-xs bg-white border border-gray-300 rounded focus:border-gold focus:outline-none font-semibold text-charcoal cursor-pointer"
                      >
                        <option value="ALL">📅 All Time (Any Date)</option>
                        <option value="TODAY">⚡ Today</option>
                        <option value="DAY">🗓️ Day-Wise View (Select Date)</option>
                        <option value="MONTH">📆 Month-Wise View (Select Month)</option>
                        <option value="LAST30">⏳ Last 30 Days</option>
                      </select>

                      {/* Day-Wise Picker */}
                      {dateFilterType === 'DAY' && (
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="py-1.5 px-3 text-xs bg-white border border-gold rounded focus:outline-none font-mono text-charcoal font-semibold shadow-2xs"
                        />
                      )}

                      {/* Month-Wise Picker */}
                      {dateFilterType === 'MONTH' && (
                        <input
                          type="month"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="py-1.5 px-3 text-xs bg-white border border-gold rounded focus:outline-none font-mono text-charcoal font-semibold shadow-2xs"
                        />
                      )}
                    </div>

                    {/* Status Dropdown Filter */}
                    <div className="flex items-center gap-2">
                      <Filter size={15} className="text-gray-500 shrink-0" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="py-2 px-3 text-xs bg-white border border-gray-300 rounded focus:border-gold focus:outline-none font-medium text-charcoal cursor-pointer"
                      >
                        <option value="ALL">All Order Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Return Requested">Return Requested</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Bottom Row: Download Excel, Download PDF & Expand/Collapse Accordion Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-200/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Download Excel / CSV Button */}
                      <button
                        type="button"
                        onClick={handleExportExcel}
                        className="py-2 px-3.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        title="Download Filtered Orders as Excel (.csv) Sheet"
                      >
                        <Download size={14} /> Download Excel (.csv)
                      </button>

                      {/* Download PDF Report Button */}
                      <button
                        type="button"
                        onClick={handleExportPDF}
                        className="py-2 px-3.5 text-xs font-semibold rounded bg-red-700 hover:bg-red-800 text-white border border-red-800 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        title="Generate & Download PDF Governance Report"
                      >
                        <FileText size={14} /> Download PDF Report
                      </button>
                    </div>

                    {/* Accordion Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={handleExpandAllSellers}
                        className="px-3 py-1.5 text-[0.72rem] font-semibold bg-white border border-gray-300 text-charcoal hover:border-gold hover:bg-gold/10 rounded transition-all cursor-pointer shadow-2xs"
                      >
                        Expand All
                      </button>
                      <button
                        onClick={handleCollapseAllSellers}
                        className="px-3 py-1.5 text-[0.72rem] font-semibold bg-white border border-gray-300 text-gray-600 hover:border-gray-400 rounded transition-all cursor-pointer shadow-2xs"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seller-Wise FAQ Accordion List */}
                <div className="space-y-4">
                  {Object.entries(groupedOrdersBySeller).length === 0 ? (
                    <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                      <ShoppingBag className="mx-auto text-gray-400 mb-3" size={36} />
                      <h4 className="font-heading text-xl text-charcoal mb-1">No Seller Orders Found</h4>
                      <p className="text-xs text-gray-500">
                        No orders match the current search query or selected status filter.
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedOrdersBySeller).map(([sellerKey, group]) => {
                      const isOpen = !!openSellerAccordions[sellerKey];
                      const sellerOrdersCount = group.orders.length;
                      const sellerTotalRevenue = group.orders.reduce(
                        (sum, o) => sum + (Number(o.totalAmount) || 0),
                        0
                      );
                      const sellerInfo = group.sellerInfo;

                      return (
                        <div
                          key={sellerKey}
                          className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-2xs transition-all duration-200"
                        >
                          {/* FAQ Accordion Seller Header Button */}
                          <button
                            type="button"
                            onClick={() => toggleSellerAccordion(sellerKey)}
                            className={`w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer select-none ${isOpen ? 'bg-[#FAF6F0] border-b border-gray-200' : 'bg-white hover:bg-gray-50'
                              }`}
                          >
                            {/* Left Side: Seller Info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold-dark shrink-0 font-bold font-heading text-lg">
                                {sellerInfo?.logo ? (
                                  <img
                                    src={sellerInfo.logo}
                                    alt={sellerKey}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <Store size={20} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-heading text-lg text-charcoal font-semibold">
                                    {group.sellerName}
                                  </h4>
                                  {sellerInfo?.verified && (
                                    <span className="badge-approved text-[0.62rem] px-1.5 py-0.5">VERIFIED MERCHANT</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {sellerInfo?.owner ? `Owner: ${sellerInfo.owner}` : 'Verified Jeweller Partner'}
                                  {sellerInfo?.city ? ` • ${sellerInfo.city}` : ''}
                                  {sellerInfo?.gst ? ` • GST: ${sellerInfo.gst}` : ''}
                                </p>
                              </div>
                            </div>

                            {/* Right Side: Order Stats Badges, Seller Export Buttons & FAQ Chevron Arrow */}
                            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${sellerOrdersCount > 0
                                      ? 'bg-gold/20 text-gold-dark border border-gold/40'
                                      : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                  {sellerOrdersCount} {sellerOrdersCount === 1 ? 'Order' : 'Orders'}
                                </span>
                                {sellerOrdersCount > 0 && (
                                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
                                    ₹{sellerTotalRevenue.toLocaleString('en-IN')} Total
                                  </span>
                                )}
                              </div>

                              {/* Individual Seller Export Buttons (Excel & PDF) */}
                              {sellerOrdersCount > 0 && (
                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExportSellerExcel(sellerKey, group);
                                    }}
                                    className="py-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[0.7rem] font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                                    title={`Download ${sellerKey}'s orders as Excel (.csv)`}
                                  >
                                    <Download size={12} /> Excel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExportSellerPDF(sellerKey, group);
                                    }}
                                    className="py-1 px-2.5 bg-red-700 hover:bg-red-800 text-white rounded text-[0.7rem] font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                                    title={`Download ${sellerKey}'s PDF Statement`}
                                  >
                                    <FileText size={12} /> PDF
                                  </button>
                                </div>
                              )}

                              {/* FAQ Animated Rotating Chevron */}
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gold-dark hover:bg-gold hover:text-white transition-all ml-1 shrink-0">
                                <ChevronDown
                                  size={20}
                                  className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                              </div>
                            </div>
                          </button>

                          {/* FAQ Accordion Body - Orders Table / Cards */}
                          {isOpen && (
                            <div className="p-4 sm:p-6 bg-white">
                              {sellerOrdersCount === 0 ? (
                                <div className="py-8 text-center bg-[#FAF6F0]/60 rounded border border-dashed border-gray-300">
                                  <Package className="mx-auto text-gray-400 mb-2" size={28} />
                                  <p className="text-xs text-gray-500 font-medium">
                                    No orders currently assigned to {group.sellerName}.
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {group.orders.map((ord) => {
                                    const isOrderExpanded = !!expandedOrders[ord.id];

                                    return (
                                      <div
                                        key={ord.id}
                                        className="border border-gray-200 rounded-sm bg-[#FAF6F0] p-3.5 sm:p-4 shadow-2xs hover:border-gold/50 transition-all"
                                      >
                                        {/* Compact Summary Bar (Always Visible: Order No, Customer, Date, Amount, Status, View More) */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                          {/* Left Column: Order No, Customer Name & Date */}
                                          <div className="flex flex-wrap items-center gap-3">
                                            {/* 1. Order Number */}
                                            <span className="font-mono text-xs sm:text-sm font-bold text-gold-dark bg-white px-2.5 py-1 rounded border border-gold/30 shadow-2xs">
                                              {ord.id}
                                            </span>

                                            {/* 2. Customer Name */}
                                            <div className="flex items-center gap-1.5 text-xs text-charcoal font-semibold">
                                              <User size={14} className="text-gold-dark shrink-0" />
                                              <span>{ord.buyerName || ord.customerName || 'Valued Customer'}</span>
                                            </div>

                                            {/* 3. Date */}
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                              <Clock size={13} className="text-gray-400 shrink-0" />
                                              {ord.date || 'Recent'}
                                            </span>
                                          </div>

                                          {/* Right Column: Amount, Status Dropdown, View More Button */}
                                          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                                            {/* 4. Total Amount */}
                                            <div className="text-xs text-gray-600">
                                              <span className="text-[0.68rem] uppercase text-gray-400 block sm:inline mr-1">Amount:</span>
                                              <strong className="text-sm font-heading font-semibold text-charcoal">
                                                ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                                              </strong>
                                            </div>

                                            {/* 5. Status Dropdown */}
                                            <select
                                              value={ord.status || 'Confirmed'}
                                              onChange={(e) => handleUpdateAdminOrderStatus(ord.id, e.target.value)}
                                              className={`text-xs font-bold py-1 px-2.5 rounded border focus:outline-none cursor-pointer ${ord.status === 'Delivered'
                                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                                  : ord.status === 'Shipped'
                                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                                    : ord.status === 'Refunded'
                                                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                                                      : ord.status === 'Return Requested'
                                                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                                                        : ord.status === 'Cancelled'
                                                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                                                          : 'bg-gold/20 text-gold-dark border-gold/40'
                                                }`}
                                            >
                                              <option value="Confirmed">Confirmed</option>
                                              <option value="Processing">Processing</option>
                                              <option value="Shipped">Shipped</option>
                                              <option value="Delivered">Delivered</option>
                                              <option value="Return Requested">Return Requested</option>
                                              <option value="Refunded">Refunded</option>
                                              <option value="Cancelled">Cancelled</option>
                                            </select>

                                            {/* 6. View Details / View More Toggle Button */}
                                            <button
                                              type="button"
                                              onClick={() => toggleOrderDetails(ord.id)}
                                              className={`py-1 px-3 text-xs font-semibold rounded border transition-all flex items-center gap-1.5 cursor-pointer ${isOrderExpanded
                                                  ? 'bg-charcoal text-white border-charcoal shadow-2xs'
                                                  : 'bg-white text-gold-dark border-gold/50 hover:bg-gold/15'
                                                }`}
                                            >
                                              {isOrderExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                                              <span>{isOrderExpanded ? 'Hide Details' : 'View More'}</span>
                                            </button>
                                          </div>
                                        </div>

                                        {/* Full Order Details (Shown ONLY on View More Click) */}
                                        {isOrderExpanded && (
                                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                                            {/* Customer & Address & Logistics Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-600 bg-white p-3.5 rounded border border-gray-200 shadow-2xs">
                                              <div>
                                                <span className="text-[0.68rem] text-gray-400 uppercase font-semibold block mb-0.5">
                                                  Customer Details
                                                </span>
                                                <strong className="text-charcoal block">
                                                  {ord.buyerName || ord.customerName || 'Valued Buyer'}
                                                </strong>
                                                <span className="block text-gray-600">{ord.buyerEmail || 'N/A'}</span>
                                                {ord.buyerPhone && <span className="block text-gray-600">{ord.buyerPhone}</span>}
                                              </div>

                                              <div>
                                                <span className="text-[0.68rem] text-gray-400 uppercase font-semibold block mb-0.5">
                                                  Dispatch Address
                                                </span>
                                                <span className="text-charcoal block">
                                                  {ord.address || 'Standard Registered Dispatch Address'}
                                                </span>
                                              </div>

                                              <div>
                                                <span className="text-[0.68rem] text-gray-400 uppercase font-semibold block mb-0.5">
                                                  Payment & Logistics
                                                </span>
                                                <span className="text-charcoal block">
                                                  Mode: <strong>{ord.paymentMethod || 'UPI / Card'}</strong>
                                                </span>
                                                <span className="text-charcoal block font-mono text-[0.7rem] text-gold-dark mt-0.5">
                                                  Tracking: {ord.trackingNumber || 'Awaiting Dispatch'}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Purchased Items List */}
                                            <div className="bg-white p-3.5 rounded border border-gray-200 shadow-2xs">
                                              <span className="text-[0.68rem] text-gray-400 uppercase font-semibold block mb-2">
                                                Ordered Items ({ord.items?.length || 1})
                                              </span>
                                              <div className="space-y-2">
                                                {(ord.items && ord.items.length > 0 ? ord.items : [
                                                  {
                                                    name: ord.productName || 'Heritage Gold Jewellery',
                                                    price: ord.totalAmount || 0,
                                                    qty: 1,
                                                    image: ord.image
                                                  }
                                                ]).map((item, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-2.5 bg-[#FAF6F0] rounded border border-gray-200 text-xs gap-3"
                                                  >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                      {item.image && (
                                                        <img
                                                          src={item.image}
                                                          alt={item.name}
                                                          className="w-10 h-10 object-cover rounded border border-gray-200 shrink-0"
                                                        />
                                                      )}
                                                      <div className="truncate">
                                                        <strong className="text-charcoal block truncate">
                                                          {item.name}
                                                        </strong>
                                                        <span className="text-gray-500 text-[0.7rem]">
                                                          Qty: {item.qty || 1} • Price: ₹
                                                          {(item.price || 0).toLocaleString('en-IN')}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <span className="font-semibold text-charcoal shrink-0 font-mono">
                                                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>

                                            {/* Footer Actions & Order ID */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                              <div className="text-xs text-gray-500">
                                                Order Reference: <strong className="font-mono text-gold-dark">{ord.id}</strong>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                {ord.status === 'Return Requested' && (
                                                  <button
                                                    onClick={() => handleApproveRefund(ord)}
                                                    className="btn-gold py-1.5 px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                                  >
                                                    <DollarSign size={13} /> Approve Refund
                                                  </button>
                                                )}
                                                <button
                                                  onClick={() => handleDeleteAdminOrder(ord.id)}
                                                  className="py-1.5 px-3 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                                >
                                                  <Trash2 size={13} /> Delete Record
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add New Seller Modal */}
      {isAddSellerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm max-w-lg w-full border border-gold/40 shadow-2xl relative">
            <button onClick={() => setIsAddSellerOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-charcoal">
              <X size={20} />
            </button>
            <h3 className="font-heading text-2xl mb-1 text-charcoal">Add New Jeweller Partner</h3>
            <p className="text-xs text-gray-500 mb-4">Manually onboard a verified jewellery merchant to the platform.</p>

            <form onSubmit={handleAddSellerSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Brand / Business Name</label>
                <input type="text" required placeholder="e.g. Heritage Gold Kolkata" value={newSellerData.name} onChange={(e) => setNewSellerData({ ...newSellerData, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Owner / Merchant Contact</label>
                <input type="text" required placeholder="e.g. Ramesh Chandra" value={newSellerData.owner} onChange={(e) => setNewSellerData({ ...newSellerData, owner: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">City / Base</label>
                  <input type="text" required placeholder="Kolkata, WB" value={newSellerData.city} onChange={(e) => setNewSellerData({ ...newSellerData, city: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Phone</label>
                  <input type="tel" required placeholder="e.g. 9829012345" value={newSellerData.phone} onChange={(e) => setNewSellerData({ ...newSellerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="input-field font-mono" />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Product Rejection Reason Modal */}
      {rejectModal.isOpen && rejectModal.product && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm max-w-lg w-full border border-red-300 shadow-2xl relative">
            <button
              onClick={() => setRejectModal({ isOpen: false, product: null, reason: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2 text-red-600">
              <XCircle size={26} />
              <h3 className="font-heading text-xl text-charcoal">Reject Product Request</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Specify the exact reason for rejecting <strong className="text-charcoal">{rejectModal.product.name}</strong>. The seller will see this reason and rejection date in their dashboard so they can fix it.
            </p>

            <form onSubmit={handleConfirmRejectProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">
                  Quick Rejection Presets
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Images are unclear / low resolution',
                    'Missing BIS Hallmark purity proof',
                    'Incorrect price or discount calculation',
                    'Incomplete product description / metal specs'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectModal((prev) => ({ ...prev, reason: preset }))}
                      className="text-[0.7rem] px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:border-red-500 hover:bg-red-50 text-gray-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">
                  Detailed Rejection Reason / Note *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter specific reason why this product is rejected..."
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  className="input-field text-xs bg-red-50/30 border-red-200 focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold bg-red-600 hover:bg-red-700 text-white flex-1 py-3 text-xs font-semibold">
                  CONFIRM REJECTION & NOTIFY SELLER
                </button>
                <button
                  type="button"
                  onClick={() => setRejectModal({ isOpen: false, product: null, reason: '' })}
                  className="btn-outline py-3 px-5 text-xs"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Seller Application Rejection Reason Modal */}
      {sellerRejectModal.isOpen && sellerRejectModal.seller && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-sm max-w-lg w-full border border-red-300 shadow-2xl relative">
            <button
              onClick={() => setSellerRejectModal({ isOpen: false, seller: null, reason: '' })}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2 text-red-600">
              <XCircle size={26} />
              <h3 className="font-heading text-xl text-charcoal">Reject Seller Application</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Specify reason for rejecting <strong className="text-charcoal">{sellerRejectModal.seller.businessName || sellerRejectModal.seller.name}</strong> ({sellerRejectModal.seller.email}). Rejection email will be sent automatically.
            </p>

            <form onSubmit={handleConfirmRejectSeller} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1.5 block">
                  Quick Rejection Reason Suggestions (Click to Select)
                </label>
                <div className="flex flex-col gap-1.5 mb-2">
                  {[
                    'GST document is missing, expired, or invalid',
                    'PAN Card details do not match business/owner name',
                    'BIS Hallmark License proof missing or unverified',
                    'Incomplete business profile or invalid contact details',
                    'Document verification or business compliance requirements were not met'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSellerRejectModal((prev) => ({ ...prev, reason: preset }))}
                      className={`text-[0.72rem] px-3 py-1.5 rounded border text-left transition-all flex items-center justify-between ${sellerRejectModal.reason === preset
                          ? 'bg-red-600 text-white border-red-600 font-medium shadow-xs'
                          : 'bg-gray-50 border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-700'
                        }`}
                    >
                      <span>{preset}</span>
                      {sellerRejectModal.reason === preset && <CheckCircle2 size={13} className="shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-600 mb-1 block">
                  Custom Rejection Reason / Details *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter specific reason why this seller application is rejected..."
                  value={sellerRejectModal.reason}
                  onChange={(e) => setSellerRejectModal({ ...sellerRejectModal, reason: e.target.value })}
                  className="input-field text-xs bg-red-50/30 border-red-200 focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold bg-red-600 hover:bg-red-700 text-white flex-1 py-3 text-xs font-semibold">
                  CONFIRM REJECTION & SEND EMAIL
                </button>
                <button
                  type="button"
                  onClick={() => setSellerRejectModal({ isOpen: false, seller: null, reason: '' })}
                  className="btn-outline py-3 px-5 text-xs"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
