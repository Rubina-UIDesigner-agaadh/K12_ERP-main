// BillInvoiceManagement.tsx - Combined Bill / Invoice Management & Approval Page
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { printHtml, tableHtml, inr } from '../charge/ChargeReceipt';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  AlertCircle,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  DollarSign,
  Download,
  Eye,
  RotateCcw,
  Paperclip,
  CheckSquare,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export interface BillItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
  gstRate: number;
  gstAmount: number;
  rejectedNote?: string;
}

export type ThreeWayStatus = 'Matched' | 'Mismatch' | 'Direct' | 'Recurring';
export type BillStatus = 'Pending Verification' | 'Under Approval' | 'Approved' | 'Paid' | 'Hold';
export type BillType = 'PO-Based Bill' | 'Direct Bill' | 'Recurring Bill' | 'Advance Bill';

export interface VendorBillRecord {
  id: string;
  billNo: string;
  vendorInvoiceNo: string;
  invoiceDate: string;
  receivedOn: string;
  linkedPoNo?: string;
  linkedGrnNo?: string;
  linkedExpenseReq?: string;
  vendorName: string;
  vendorCode: string;
  gstin: string;
  outstanding: number;
  vendorRating: number;
  category: string;
  billType: BillType;
  items: BillItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  grandTotal: number;
  poAmount?: number;
  grnAmount?: number;
  threeWayStatus: ThreeWayStatus;
  threeWaySummary: string;
  paymentTerms: string;
  dueDate: string;
  daysRemaining: number;
  status: BillStatus;
  attachedInvoiceFile?: string;
  annualBudget: number;
  alreadySpent: number;
  approverRemarks?: string;
  approvedBy?: string;
}

const INITIAL_BILLS: VendorBillRecord[] = [
  {
    id: 'bill_001',
    billNo: 'BILL-2025-001',
    vendorInvoiceNo: 'INV-ABC-2025-1234',
    invoiceDate: '16-Oct-2025',
    receivedOn: '18-Oct-2025',
    linkedPoNo: 'PO-2025-001',
    linkedGrnNo: 'GRN-2025-001',
    linkedExpenseReq: 'EXP-REQ-002',
    vendorName: 'ABC Supplies Ltd',
    vendorCode: 'VND-0045',
    gstin: '27AABCU9603R1ZM',
    outstanding: 45000,
    vendorRating: 5,
    category: 'Lab Equipment',
    billType: 'PO-Based Bill',
    items: [
      {
        id: '1',
        description: 'Microscope (1 rejected in GRN — not charged in bill)',
        qty: 9,
        rate: 7500,
        amount: 67500,
        gstRate: 18,
        gstAmount: 12150
      },
      {
        id: '2',
        description: 'Lab Stand & Clamp Set',
        qty: 20,
        rate: 500,
        amount: 10000,
        gstRate: 12,
        gstAmount: 1200
      }
    ],
    subTotal: 77500,
    cgst: 6675,
    sgst: 6675,
    totalGst: 13350,
    grandTotal: 90850,
    poAmount: 99700,
    grnAmount: 90850,
    threeWayStatus: 'Matched',
    threeWaySummary: 'All items matched: Qty (9 & 20) and Rates match PO/GRN perfectly.',
    paymentTerms: 'Net-30 from invoice date',
    dueDate: '15-Nov-2025',
    daysRemaining: 28,
    status: 'Pending Verification',
    attachedInvoiceFile: 'INV_ABC_2025_1234.pdf',
    annualBudget: 200000,
    alreadySpent: 55000
  },
  {
    id: 'bill_002',
    billNo: 'BILL-2025-002',
    vendorInvoiceNo: 'INV-XYZ-2025-9921',
    invoiceDate: '06-Oct-2025',
    receivedOn: '08-Oct-2025',
    linkedPoNo: 'PO-2025-002',
    linkedGrnNo: 'GRN-2025-002',
    linkedExpenseReq: 'EXP-REQ-001',
    vendorName: 'XYZ Stationers',
    vendorCode: 'VND-0012',
    gstin: '27AADCC9604R1ZN',
    outstanding: 0,
    vendorRating: 5,
    category: 'Stationery',
    billType: 'PO-Based Bill',
    items: [
      {
        id: '1',
        description: 'A4 Paper Reams',
        qty: 50,
        rate: 250,
        amount: 12500,
        gstRate: 12,
        gstAmount: 1500
      },
      {
        id: '2',
        description: 'Whiteboard Marker',
        qty: 100,
        rate: 30,
        amount: 3000,
        gstRate: 18,
        gstAmount: 540
      }
    ],
    subTotal: 15500,
    cgst: 1020,
    sgst: 1020,
    totalGst: 2040,
    grandTotal: 17050,
    poAmount: 17050,
    grnAmount: 17050,
    threeWayStatus: 'Matched',
    threeWaySummary: '3-way match verified. Full quantity delivered in good order.',
    paymentTerms: 'On Delivery',
    dueDate: '05-Nov-2025',
    daysRemaining: 18,
    status: 'Paid',
    attachedInvoiceFile: 'INV_XYZ_2025_9921.pdf',
    annualBudget: 150000,
    alreadySpent: 42000,
    approvedBy: 'Finance Manager — Mrs. P. Gupta'
  },
  {
    id: 'bill_003',
    billNo: 'BILL-2025-003',
    vendorInvoiceNo: 'UTIL-PW-OCT-2025',
    invoiceDate: '10-Oct-2025',
    receivedOn: '12-Oct-2025',
    vendorName: 'PowerGrid Utility',
    vendorCode: 'VND-0209',
    gstin: '27AAACP9999P1ZZ',
    outstanding: 0,
    vendorRating: 4,
    category: 'Utility',
    billType: 'Direct Bill',
    items: [
      {
        id: '1',
        description: 'High-Tension Electricity Meter Consumption — Campus Block A & B',
        qty: 1,
        rate: 12500,
        amount: 12500,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subTotal: 12500,
    cgst: 0,
    sgst: 0,
    totalGst: 0,
    grandTotal: 12500,
    threeWayStatus: 'Direct',
    threeWaySummary: 'Direct recurring statutory tariff bill — 3-way match exempt.',
    paymentTerms: 'Immediate',
    dueDate: '10-Nov-2025',
    daysRemaining: 23,
    status: 'Under Approval',
    attachedInvoiceFile: 'Electricity_Oct_2025.pdf',
    annualBudget: 500000,
    alreadySpent: 280000
  },
  {
    id: 'bill_004',
    billNo: 'BILL-2025-004',
    vendorInvoiceNo: 'INV-SP-2025-4412',
    invoiceDate: '20-Oct-2025',
    receivedOn: '22-Oct-2025',
    linkedPoNo: 'PO-2025-003',
    linkedGrnNo: 'GRN-2025-003',
    linkedExpenseReq: 'EXP-REQ-003',
    vendorName: 'SportsPro Pvt Ltd',
    vendorCode: 'VND-0089',
    gstin: '27AABCF9606R1ZP',
    outstanding: 15000,
    vendorRating: 4,
    category: 'Sports Equipment',
    billType: 'PO-Based Bill',
    items: [
      {
        id: '1',
        description: 'Football (Match Grade)',
        qty: 15,
        rate: 1100, // Discrepancy: PO was 1000
        amount: 16500,
        gstRate: 12,
        gstAmount: 1980
      },
      {
        id: '2',
        description: 'Basketballs (Size 7)',
        qty: 10,
        rate: 1000,
        amount: 10000,
        gstRate: 12,
        gstAmount: 1200
      }
    ],
    subTotal: 26500,
    cgst: 1590,
    sgst: 1590,
    totalGst: 3180,
    grandTotal: 29680,
    poAmount: 28750,
    grnAmount: 28750,
    threeWayStatus: 'Mismatch',
    threeWaySummary: 'Rate Mismatch: Invoiced rate ₹1,100 vs agreed PO rate ₹1,000 for footballs.',
    paymentTerms: 'Net-30',
    dueDate: '20-Nov-2025',
    daysRemaining: 33,
    status: 'Hold',
    attachedInvoiceFile: 'SportsPro_Invoice_4412.pdf',
    annualBudget: 180000,
    alreadySpent: 85000,
    approverRemarks: 'Hold: Rate discrepancy identified. Credit note required from vendor.'
  },
  {
    id: 'bill_005',
    billNo: 'BILL-2025-005',
    vendorInvoiceNo: 'RENT-SOUTH-NOV-25',
    invoiceDate: '01-Oct-2025',
    receivedOn: '02-Oct-2025',
    vendorName: 'Rent — Building',
    vendorCode: 'VND-0010',
    gstin: '27AABCE1111E1ZZ',
    outstanding: 0,
    vendorRating: 5,
    category: 'Maintenance',
    billType: 'Recurring Bill',
    items: [
      {
        id: '1',
        description: 'Monthly Lease Rental for South Wing Sports Annex',
        qty: 1,
        rate: 25000,
        amount: 25000,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subTotal: 25000,
    cgst: 0,
    sgst: 0,
    totalGst: 0,
    grandTotal: 25000,
    threeWayStatus: 'Recurring',
    threeWaySummary: 'Recurring rental contractual agreement — Pre-approved budget.',
    paymentTerms: 'Advance / 1st of month',
    dueDate: '01-Nov-2025',
    daysRemaining: 14,
    status: 'Paid',
    annualBudget: 300000,
    alreadySpent: 175000,
    approvedBy: 'Principal — Mr. A. Sharma'
  },
  {
    id: 'bill_006',
    billNo: 'BILL-2025-006',
    vendorInvoiceNo: 'INV-FFC-2025-0912',
    invoiceDate: '26-Sep-2025',
    receivedOn: '27-Sep-2025',
    linkedPoNo: 'PO-2025-0224',
    linkedGrnNo: 'GRN-2025-0224',
    linkedExpenseReq: 'EXP-REQ-0110',
    vendorName: 'Fresh Foods Catering',
    vendorCode: 'VND-0021',
    gstin: '27AABCF9606R1ZP',
    outstanding: 68340,
    vendorRating: 4,
    category: 'Hostel Mess Supplies',
    billType: 'PO-Based Bill',
    items: [
      {
        id: '1',
        description: 'Groceries and consumables — hostel mess (September 2025)',
        qty: 1,
        rate: 60000,
        amount: 60000,
        gstRate: 5,
        gstAmount: 3000
      },
      {
        id: '2',
        description: 'LPG cylinders and kitchen consumables',
        qty: 6,
        rate: 890,
        amount: 5340,
        gstRate: 5,
        gstAmount: 267
      }
    ],
    subTotal: 65340,
    cgst: 1633.5,
    sgst: 1633.5,
    totalGst: 3267,
    grandTotal: 68340,
    poAmount: 68340,
    grnAmount: 68340,
    threeWayStatus: 'Matched',
    threeWaySummary: 'All items matched: quantity and rates agree with PO-2025-0224 and GRN-2025-0224.',
    paymentTerms: 'Net-15 from invoice date',
    dueDate: '11-Oct-2025',
    daysRemaining: 9,
    status: 'Approved',
    attachedInvoiceFile: 'INV_FFC_2025_0912.pdf',
    annualBudget: 900000,
    alreadySpent: 384000,
    approvedBy: 'Finance Head — Ms. R. Patel'
  },
  {
    id: 'bill_007',
    billNo: 'BILL-2025-007',
    vendorInvoiceNo: 'INV-SSS-2025-4471',
    invoiceDate: '22-Sep-2025',
    receivedOn: '23-Sep-2025',
    linkedPoNo: 'PO-2025-0180',
    linkedGrnNo: 'GRN-2025-0180',
    linkedExpenseReq: 'EXP-REQ-0088',
    vendorName: 'SecureShield Services',
    vendorCode: 'VND-0056',
    gstin: '27AABCS4421K1ZQ',
    outstanding: 53100,
    vendorRating: 4,
    category: 'Security Services',
    billType: 'PO-Based Bill',
    items: [
      {
        id: '1',
        description: 'Security guard deployment — campus (September 2025)',
        qty: 1,
        rate: 45000,
        amount: 45000,
        gstRate: 18,
        gstAmount: 8100
      }
    ],
    subTotal: 45000,
    cgst: 4050,
    sgst: 4050,
    totalGst: 8100,
    grandTotal: 53100,
    poAmount: 53100,
    grnAmount: 53100,
    threeWayStatus: 'Matched',
    threeWaySummary: 'Guard deployment roster verified against PO-2025-0180 and GRN-2025-0180.',
    paymentTerms: 'Net-30 from invoice date',
    dueDate: '22-Oct-2025',
    daysRemaining: 24,
    status: 'Approved',
    attachedInvoiceFile: 'INV_SSS_2025_4471.pdf',
    annualBudget: 700000,
    alreadySpent: 318000,
    approvedBy: 'Finance Head — Ms. R. Patel'
  },
  {
    id: 'bill_008',
    billNo: 'BILL-2025-008',
    vendorInvoiceNo: 'INV-GLS-2025-1029',
    invoiceDate: '24-Sep-2025',
    receivedOn: '25-Sep-2025',
    linkedExpenseReq: 'EXP-REQ-0091',
    vendorName: 'GreenLeaf Stationers',
    vendorCode: 'VND-0067',
    gstin: '27AABCG7788L1ZV',
    outstanding: 22000,
    vendorRating: 4,
    category: 'Exam Stationery',
    billType: 'Direct Bill',
    items: [
      {
        id: '1',
        description: 'Answer booklets, OMR sheets and exam stationery',
        qty: 1,
        rate: 22000,
        amount: 22000,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subTotal: 22000,
    cgst: 0,
    sgst: 0,
    totalGst: 0,
    grandTotal: 22000,
    threeWayStatus: 'Direct',
    threeWaySummary: 'Direct purchase below threshold — GRN not applicable.',
    paymentTerms: 'Net-15 from invoice date',
    dueDate: '09-Oct-2025',
    daysRemaining: 11,
    status: 'Approved',
    attachedInvoiceFile: 'INV_GLS_2025_1029.pdf',
    annualBudget: 250000,
    alreadySpent: 96500,
    approvedBy: 'Principal — Mr. A. Sharma'
  }
];

export function BillInvoiceManagement() {
  const [bills, setBills] = useState<VendorBillRecord[]>(INITIAL_BILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [threeWayFilter, setThreeWayFilter] = useState('All');
  const [billTypeFilter, setBillTypeFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [approvalModalBill, setApprovalModalBill] = useState<VendorBillRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // ---- vendor payments (merged Expense / Vendor Payment) ----
  const [payments, setPayments] = useState<VendorPaymentRecord[]>(INITIAL_PAYMENTS);
  const [payModalBill, setPayModalBill] = useState<VendorBillRecord | null>(null);
  const [bulkPayOpen, setBulkPayOpen] = useState(false);
  const [viewPayment, setViewPayment] = useState<VendorPaymentRecord | null>(null);
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations matching the specifications
  const kpiTotal = 280;
  const kpiPendingVerification = 35;
  const kpiUnderApproval = 20;
  const kpiApproved = 180;
  const kpiPaid = 165;
  const kpiOverdue = 15;

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (threeWayFilter !== 'All' && b.threeWayStatus !== threeWayFilter) return false;
      if (billTypeFilter !== 'All' && b.billType !== billTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m =
          b.billNo.toLowerCase().includes(q) ||
          b.vendorInvoiceNo.toLowerCase().includes(q) ||
          b.vendorName.toLowerCase().includes(q) ||
          (b.linkedPoNo && b.linkedPoNo.toLowerCase().includes(q)) ||
          b.category.toLowerCase().includes(q);
        if (!m) return false;
      }
      return true;
    });
  }, [bills, statusFilter, threeWayFilter, billTypeFilter, searchQuery]);

  // Actions
  /** “Update” — re-check the bill & push it forward for approval. */
  const handleUpdateBill = (b: VendorBillRecord) => {
    setBills((prev) =>
      prev.map((item) =>
        item.id === b.id ? { ...item, status: 'Under Approval' as BillStatus } : item
      )
    );
    showToast(`Bill ${b.billNo} updated — 3-Way match checked & moved for approval.`);
  };

  const handlePayNow = (b: VendorBillRecord) => {
    setPayModalBill(b);
  };

  const paymentsForBill = (billId: string) =>
    payments.filter((p) => p.billId === billId && p.status !== 'Bounced');
  /** Gross value of the bill already covered by payments (TDS does not delay bill settlement). */
  const paidAmountOf = (bill: VendorBillRecord) =>
    paymentsForBill(bill.id).reduce((s, p) => s + p.grossAmount, 0);

  const handleConfirmPayment = (payment: VendorPaymentRecord) => {
    setPayments((prev) => [payment, ...prev]);
    const bill = bills.find((b) => b.id === payment.billId);
    if (bill) {
      const paid = paidAmountOf(bill) + payment.netPaid;
      if (paid >= bill.grandTotal - 1) {
        setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, status: 'Paid' as BillStatus } : b)));
      }
    }
    showToast(
      `Payment ${payment.paymentNo} recorded for ${payment.vendorName} — net ₹${payment.netPaid.toLocaleString('en-IN')} via ${payment.mode}.`
    );
    setPayModalBill(null);
  };

  const handleBulkPayments = (list: VendorPaymentRecord[]) => {
    setPayments((prev) => [...list, ...prev]);
    setBills((prev) =>
      prev.map((b) => (list.some((p) => p.billId === b.id) ? { ...b, status: 'Paid' as BillStatus } : b))
    );
    showToast(`${list.length} vendor payment(s) recorded in a single run.`);
    setBulkPayOpen(false);
    setSelectedBillIds([]);
  };

  const payableBills = bills.filter((b) => b.status === 'Approved');
  const selectedPayable = bills.filter((b) => selectedBillIds.includes(b.id) && b.status === 'Approved');
  const paidToDate = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.netPaid, 0);
  const tdsToDate = payments.reduce((s, p) => s + p.tdsAmount, 0);
  const pendingPaymentValue = bills
    .filter((b) => b.status === 'Approved' || b.status === 'Under Approval')
    .reduce((s, b) => s + b.grandTotal, 0);
  const bouncedCount = payments.filter((p) => p.status === 'Bounced').length;


  return (
    <div className="space-y-6 py-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🔝 SECTION 1: TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-medium">Expenses</span>
            <span>&gt;</span>
            <span className="text-gray-800 font-semibold">Bill / Invoice Management, Approval &amp; Payment</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Bill / Invoice Management, Approval &amp; Payment <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"> FY: 2025-26 </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                Approve vendor bills and pay them on the same screen — 3-way matching, sanction and vendor payment in one workspace
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" /> ➕ Add Vendor Bill / Invoice
          </Button>
        </div>
      </div>

      {/* 📊 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Total Bills */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bills</span>
            <Receipt className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiTotal}</div>
          <div className="text-[11px] text-gray-500 mt-1">Recorded this fiscal year</div>
        </Card>

        {/* Pending Verification */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Verif.</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{kpiPendingVerification}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting 3-way check</div>
        </Card>

        {/* Under Approval */}
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Approval</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{kpiUnderApproval}</div>
          <div className="text-[11px] text-gray-500 mt-1">With Principal / Finance</div>
        </Card>

        {/* Approved Bills */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Bills</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{kpiApproved}</div>
          <div className="text-[11px] text-gray-500 mt-1">Ready for payment release</div>
        </Card>

        {/* Paid Bills */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Bills</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{kpiPaid}</div>
          <div className="text-[11px] text-gray-500 mt-1">Disbursed to vendor</div>
        </Card>

        {/* Overdue Bills */}
        <Card className="p-4 bg-gradient-to-br from-rose-50 to-white border-rose-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Bills</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{kpiOverdue}</div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-1">
            🔴 Action!
          </div>
        </Card>
      </div>

      {/* 💳 VENDOR PAYMENT SNAPSHOT (merged payment module) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Payments Recorded', value: String(payments.length), tone: 'text-indigo-700', icon: DollarSign },
          { label: 'Paid to Vendors (FY)', value: `₹${paidToDate.toLocaleString('en-IN')}`, tone: 'text-emerald-700', icon: CheckCircle2 },
          { label: 'TDS Deducted', value: `₹${tdsToDate.toLocaleString('en-IN')}`, tone: 'text-rose-700', icon: Layers },
          { label: 'Pending Payment Value', value: `₹${pendingPaymentValue.toLocaleString('en-IN')}`, tone: 'text-amber-700', icon: Clock },
          { label: 'Bounced / Initiated', value: String(bouncedCount), tone: 'text-gray-900', icon: AlertCircle }
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{kpi.label}</p>
                  <p className={`text-lg font-bold ${kpi.tone}`}>{kpi.value}</p>
                </div>
                <Icon className="w-5 h-5 text-gray-300" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* 🔍 FILTERS BAR */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bill no, vendor invoice no, vendor name, PO..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Under Approval">Under Approval</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={threeWayFilter}
              onChange={(e) => setThreeWayFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All 3-Way Checks</option>
              <option value="Matched">✅ Matched</option>
              <option value="Mismatch">⚠️ Mismatch</option>
              <option value="Direct">N/A (Direct)</option>
              <option value="Recurring">N/A (Recurring)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={billTypeFilter}
              onChange={(e) => setBillTypeFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Bill Types</option>
              <option value="PO-Based Bill">PO-Based Bill</option>
              <option value="Direct Bill">Direct Bill</option>
              <option value="Recurring Bill">Recurring Bill</option>
              <option value="Advance Bill">Advance Bill</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setThreeWayFilter('All');
                setBillTypeFilter('All');
              }}
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4 text-gray-500 hover:text-gray-800" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ⚡ BULK APPROVAL / PAYMENT TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-xs text-gray-600">
          <span className="font-semibold text-gray-900">{selectedBillIds.length}</span> bill(s) selected ·{' '}
          <span className="font-semibold text-gray-900">{payableBills.length}</span> approved bill(s) ready for
          payment
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={selectedPayable.length === 0}
            onClick={() => setBulkPayOpen(true)}
            className="text-indigo-700 border-indigo-200 hover:bg-indigo-50 disabled:opacity-40"
          >
            <DollarSign className="w-4 h-4 mr-1" /> Pay Selected ({selectedPayable.length})
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedBillIds([])}>
            Clear Selection
          </Button>
        </div>
      </div>

      {/* 📋 MAIN BILL TABLE */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" data-testid="bill-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={payableBills.length > 0 && selectedPayable.length === payableBills.length}
                    onChange={(e) =>
                      setSelectedBillIds(e.target.checked ? payableBills.map((b) => b.id) : [])
                    }
                    title="Select all approved bills"
                  />
                </th>
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">Bill No.</th>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">PO No.</th>
                <th className="p-3">Bill Amt</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">3-Way Match</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.map((b, index) => {
                const render3Way = (st: ThreeWayStatus) => {
                  switch (st) {
                    case 'Matched':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matched
                        </span>
                      );
                    case 'Mismatch':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Mismatch
                        </span>
                      );
                    case 'Direct':
                      return (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-gray-600 bg-gray-100">
                          N/A (Direct)
                        </span>
                      );
                    case 'Recurring':
                    default:
                      return (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-indigo-700 bg-indigo-50 border border-indigo-200">
                          N/A (Recurring)
                        </span>
                      );
                  }
                };

                const renderStatus = (s: BillStatus) => {
                  switch (s) {
                    case 'Approved':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Apprvd
                        </span>
                      );
                    case 'Paid':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          <DollarSign className="w-3 h-3 text-purple-600" /> Paid
                        </span>
                      );
                    case 'Under Approval':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Search className="w-3 h-3 text-blue-600" /> Review
                        </span>
                      );
                    case 'Hold':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-600" /> Hold
                        </span>
                      );
                    case 'Pending Verification':
                    default:
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Verif.
                        </span>
                      );
                  }
                };

                const paidSoFar = paidAmountOf(b);
                const canPay = b.status === 'Approved';

                return (
                  <tr key={b.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        disabled={!canPay}
                        checked={selectedBillIds.includes(b.id)}
                        onChange={() =>
                          setSelectedBillIds((prev) =>
                            prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id]
                          )
                        }
                        title={canPay ? 'Select for bulk payment' : 'Only approved bills can be paid'}
                      />
                    </td>
                    <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-3 font-mono font-medium text-emerald-800">
                      <div>{b.billNo}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{b.vendorInvoiceNo}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{b.vendorName}</div>
                      <div className="text-[11px] text-gray-500">{b.category}</div>
                    </td>
                    <td className="p-3 font-mono text-gray-700">{b.linkedPoNo || '—'}</td>
                    <td className="p-3 font-semibold text-gray-900">₹{b.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-gray-600">{b.dueDate}</td>
                    <td className="p-3">{render3Way(b.threeWayStatus)}</td>
                    <td className="p-3">
                      {paidSoFar <= 0 ? (
                        canPay ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Unpaid
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">—</span>
                        )
                      ) : paidSoFar >= b.grandTotal - 1 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Paid ₹{paidSoFar.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Partial ₹{paidSoFar.toLocaleString('en-IN')} / ₹{b.grandTotal.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{renderStatus(b.status)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setApprovalModalBill(b)}
                          className="h-7 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                          title="Check Bill Details"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Check Bill Details
                        </Button>

                        {(b.status === 'Pending Verification' || b.status === 'Hold') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateBill(b)}
                            className="h-7 px-2 text-[11px] text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                            title="Update this bill after re-checking"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" /> Update
                          </Button>
                        )}

                        {b.status === 'Approved' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(b)}
                            className="h-7 px-2 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                            title="Approve Payment for this bill"
                          >
                            <DollarSign className="w-3 h-3 mr-1" /> Approve Payment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ➕ ADD VENDOR BILL MODAL */}
      {showAddModal && (
        <AddVendorBillModal
          onClose={() => setShowAddModal(false)}
          onAddBill={(newBill) => {
            setBills((prev) => [newBill, ...prev]);
            showToast(`Vendor bill ${newBill.billNo} logged with 3-Way validation.`);
            setShowAddModal(false);
          }}
        />
      )}

      {/* 💳 VENDOR PAYMENT REGISTER (merged Expense / Vendor Payment page) */}
      <PaymentRegisterSection payments={payments} onView={(p) => setViewPayment(p)} />

      {/* 👁️ BILL APPROVAL DETAIL MODAL (PAGE 5 INCLUDED) */}
      {/* 💳 SINGLE BILL PAYMENT MODAL */}
      {payModalBill && (
        <PaymentModal
          bill={payModalBill}
          payments={payments}
          onClose={() => setPayModalBill(null)}
          onSave={handleConfirmPayment}
        />
      )}

      {/* 💳 BULK PAYMENT MODAL */}
      {bulkPayOpen && (
        <BulkPaymentModal
          bills={selectedPayable}
          payments={payments}
          onClose={() => setBulkPayOpen(false)}
          onSave={handleBulkPayments}
        />
      )}

      {/* 💳 PAYMENT DETAIL MODAL */}
      {viewPayment && <PaymentDetailModal payment={viewPayment} onClose={() => setViewPayment(null)} />}

      {approvalModalBill && (
        <BillApprovalDetailModal
          bill={approvalModalBill}
          onClose={() => setApprovalModalBill(null)}
          onApprove={(remarks, authorizer) => {
            const approved: VendorBillRecord = {
              ...approvalModalBill,
              status: 'Approved' as BillStatus,
              approverRemarks: remarks,
              approvedBy: authorizer
            };
            setBills((prev) => prev.map((it) => (it.id === approved.id ? approved : it)));
            showToast(
              `Bill ${approved.billNo} approved by ${authorizer} — proceeding to payment.`
            );
            setApprovalModalBill(null);
            // Approve Payment = sanction the bill and open the payment form straight away
            setPayModalBill(approved);
          }}
          onUpdate={(remarks, authorizer) => {
            setBills((prev) =>
              prev.map((it) =>
                it.id === approvalModalBill.id
                  ? { ...it, approverRemarks: remarks, approvedBy: authorizer }
                  : it
              )
            );
            showToast(`Bill ${approvalModalBill.billNo} updated successfully.`);
            setApprovalModalBill(null);
          }}
          onReject={(remarks) => {
            setBills((prev) =>
              prev.map((it) =>
                it.id === approvalModalBill.id
                  ? { ...it, status: 'Hold' as BillStatus, approverRemarks: remarks }
                  : it
              )
            );
            showToast(`Bill ${approvalModalBill.billNo} rejected/returned for clarification.`);
            setApprovalModalBill(null);
          }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// ADD VENDOR BILL FORM MODAL
// ----------------------------------------------------------------------------

function AddVendorBillModal({
  onClose,
  onAddBill
}: {
  onClose: () => void;
  onAddBill: (bill: VendorBillRecord) => void;
}) {
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState('INV-ABC-2025-1234');
  const [invoiceDate, setInvoiceDate] = useState('2025-10-16');
  const [linkedPoNo, setLinkedPoNo] = useState('PO-2025-001');
  const [linkedGrnNo, setLinkedGrnNo] = useState('GRN-2025-001');
  const [linkedExpenseReq, setLinkedExpenseReq] = useState('EXP-REQ-002');
  const [vendorName, setVendorName] = useState('ABC Supplies Ltd');
  const [vendorCode, setVendorCode] = useState('VND-0045');
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [paymentTerms, setPaymentTerms] = useState('Net-30 from invoice date');
  const [dueDate, setDueDate] = useState('2025-11-15');

  const [items, setItems] = useState<BillItem[]>([
    {
      id: '1',
      description: 'Microscope (1 rejected in GRN — not charged in bill)',
      qty: 9,
      rate: 7500,
      amount: 67500,
      gstRate: 18,
      gstAmount: 12150
    },
    {
      id: '2',
      description: 'Lab Stand & Clamp Set',
      qty: 20,
      rate: 500,
      amount: 10000,
      gstRate: 12,
      gstAmount: 1200
    }
  ]);

  const subTotal = items.reduce((acc, it) => acc + it.amount, 0);
  const totalGst = items.reduce((acc, it) => acc + it.gstAmount, 0);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const grandTotal = subTotal + totalGst;

  const handleSubmit = () => {
    const billNum = `BILL-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newBill: VendorBillRecord = {
      id: `bill_${Date.now()}`,
      billNo: billNum,
      vendorInvoiceNo,
      invoiceDate,
      receivedOn: '18-Oct-2025',
      linkedPoNo,
      linkedGrnNo,
      linkedExpenseReq,
      vendorName,
      vendorCode,
      gstin,
      outstanding: 45000,
      vendorRating: 5,
      category: 'Lab Equipment',
      billType: 'PO-Based Bill',
      items,
      subTotal,
      cgst,
      sgst,
      totalGst,
      grandTotal,
      poAmount: 99700,
      grnAmount: grandTotal,
      threeWayStatus: 'Matched',
      threeWaySummary: 'Quantity, Rate, and Net Invoiced Amount matched against GRN receipt.',
      paymentTerms,
      dueDate,
      daysRemaining: 28,
      status: 'Pending Verification',
      attachedInvoiceFile: 'INV_ABC_2025_1234.pdf',
      annualBudget: 200000,
      alreadySpent: 55000
    };
    onAddBill(newBill);
  };

  return (
    <Modal isOpen onClose={onClose} title="🧾 Add Vendor Bill / Invoice" size="lg">
      <div className="space-y-4 text-xs">
        {/* Bill Reference */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            BILL REFERENCE:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <span className="text-gray-400 block text-[10px]">ERP Bill No.:</span>
              <span className="font-mono font-semibold text-gray-800">Auto: BILL-2025-001 🔒</span>
            </div>
            <div>
              <label className="block text-gray-600 mb-0.5">Vendor Invoice No.</label>
              <input
                type="text"
                value={vendorInvoiceNo}
                onChange={(e) => setVendorInvoiceNo(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-0.5">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Bill Received On:</span>
              <span className="font-semibold text-gray-800">18-Oct-2025 🔒 Today</span>
            </div>
          </div>
        </div>

        {/* Linked References */}
        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
          <div className="font-semibold text-blue-900 uppercase tracking-wider text-[11px]">
            LINKED REFERENCES:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-600 mb-0.5">Linked PO</label>
              <select
                value={linkedPoNo}
                onChange={(e) => setLinkedPoNo(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="PO-2025-001">PO-2025-001 — ABC Supplies Ltd</option>
                <option value="PO-2025-002">PO-2025-002 — XYZ Stationers</option>
                <option value="PO-2025-003">PO-2025-003 — SportsPro Pvt Ltd</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-0.5">Linked GRN</label>
              <select
                value={linkedGrnNo}
                onChange={(e) => setLinkedGrnNo(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="GRN-2025-001">GRN-2025-001 — Received 15-Oct-2025</option>
                <option value="GRN-2025-002">GRN-2025-002 — Received 08-Oct-2025</option>
              </select>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Linked Expense Req:</span>
              <span className="font-mono font-semibold text-blue-800">EXP-REQ-002 🔒</span>
            </div>
          </div>
        </div>

        {/* Vendor Details */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            VENDOR DETAILS (Auto-filled from PO):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-gray-400 block text-[10px]">Vendor Name:</span>
              <span className="font-semibold text-gray-800">{vendorName} 🔒</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Vendor Code:</span>
              <span className="font-mono text-gray-800">{vendorCode} 🔒</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">GSTIN:</span>
              <span className="font-mono text-gray-800">{gstin} 🔒</span>
            </div>
          </div>
        </div>

        {/* Bill Amount Details Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-bold text-gray-700">BILL AMOUNT DETAILS:</div>
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Description</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Rate</th>
                <th className="p-2">Amount</th>
                <th className="p-2">GST %</th>
                <th className="p-2 text-right">GST Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-2 text-gray-400">{idx + 1}</td>
                  <td className="p-2 font-medium">{it.description}</td>
                  <td className="p-2">{it.qty}</td>
                  <td className="p-2">₹{it.rate.toLocaleString('en-IN')}</td>
                  <td className="p-2">₹{it.amount.toLocaleString('en-IN')}</td>
                  <td className="p-2">{it.gstRate}%</td>
                  <td className="p-2 text-right">₹{it.gstAmount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 text-xs">
            <div className="space-y-1">
              <div>Sub Total: <b>₹{subTotal.toLocaleString('en-IN')}</b></div>
              <div>CGST (9% / 6%): <b>₹{cgst.toLocaleString('en-IN')}</b></div>
              <div>SGST (9% / 6%): <b>₹{sgst.toLocaleString('en-IN')}</b></div>
            </div>
            <div className="text-right space-y-1">
              <div>Total GST: <b>₹{totalGst.toLocaleString('en-IN')}</b></div>
              <div className="text-sm font-bold text-emerald-800">
                GRAND TOTAL: ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* 3-WAY MATCH CHECK DISPLAY */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
          <div className="font-semibold text-emerald-950 uppercase tracking-wider text-[11px]">
            3-WAY MATCH CHECK:
          </div>
          <table className="w-full text-left text-xs bg-white border border-emerald-200 rounded">
            <thead className="bg-emerald-100/60 text-emerald-900 border-b border-emerald-200">
              <tr>
                <th className="p-1.5">Check</th>
                <th className="p-1.5">PO Amount</th>
                <th className="p-1.5">GRN Amount</th>
                <th className="p-1.5">Bill Amount</th>
                <th className="p-1.5 text-right">Match Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              <tr>
                <td className="p-1.5 font-medium">Quantity Check</td>
                <td className="p-1.5">10 units</td>
                <td className="p-1.5">9 units</td>
                <td className="p-1.5">9 units</td>
                <td className="p-1.5 text-right text-emerald-700 font-bold">✅ Match</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Rate Check</td>
                <td className="p-1.5">₹7,500/unit</td>
                <td className="p-1.5">₹7,500/unit</td>
                <td className="p-1.5">₹7,500/unit</td>
                <td className="p-1.5 text-right text-emerald-700 font-bold">✅ Match</td>
              </tr>
              <tr>
                <td className="p-1.5 font-medium">Amount Check</td>
                <td className="p-1.5">₹99,700</td>
                <td className="p-1.5">₹90,850</td>
                <td className="p-1.5">₹90,850</td>
                <td className="p-1.5 text-right text-emerald-700 font-bold">✅ Match</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3-Way Match Result: ALL MATCHED — Bill is valid for approval
          </div>
        </div>

        {/* Due Date & Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-600 mb-0.5 font-medium">Payment Terms</label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-0.5 font-medium">Due Date 🔒</label>
            <input
              type="text"
              readOnly
              value="15-Nov-2025 (Net-30 Auto-calculated)"
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-gray-50"
            />
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 text-gray-600">
          <Paperclip className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
          <span className="font-semibold text-gray-800">File uploaded: </span>
          <span className="font-mono text-emerald-700">INV_ABC_2025_1234.pdf (2.1 MB)</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            💾 Save & Submit for Verification
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ----------------------------------------------------------------------------
// BILL APPROVAL VIEW MODAL (PAGE 5 INCLUDED)
// ----------------------------------------------------------------------------

function BillApprovalDetailModal({
  bill,
  onClose,
  onApprove,
  onReject,
  onUpdate
}: {
  bill: VendorBillRecord;
  onClose: () => void;
  onApprove: (remarks: string, approver: string) => void;
  onReject: (remarks: string) => void;
  onUpdate: (remarks: string, approver: string) => void;
}) {
  const [remarks, setRemarks] = useState('');
  const [approver, setApprover] = useState('Principal — Mr. A. Sharma');
  /** “Check Bill Details” reveals the document trail / 3-way match / budget panels */
  const [showDetails, setShowDetails] = useState(false);

  const safeAlreadySpent = bill.alreadySpent || 0;
  const safeAnnualBudget = bill.annualBudget || 0;
  const safeGrandTotal = bill.grandTotal || 0;
  const totalAfterApproval = safeAlreadySpent + safeGrandTotal;
  const remainingBudget = safeAnnualBudget - totalAfterApproval;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`✅ Bill Approval Detail — ${bill.billNo}`}
      size="lg"
    >
      <div className="space-y-4 text-xs">
        {/* Banner */}
        <div className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg flex items-center justify-between">
          <div>
            <div className="font-bold text-sm">Vendor: {bill.vendorName}</div>
            <div className="text-[11px] text-emerald-100">
              Amount: ₹{bill.grandTotal.toLocaleString('en-IN')} | Due: {bill.dueDate} ({bill.daysRemaining} days remaining)
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-none">{bill.status}</Badge>
        </div>

        {/* PANEL 1: BILL SUMMARY */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="font-bold text-gray-800 text-[11px] border-b pb-1">
            PANEL 1: BILL SUMMARY
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700">
            <div>
              <span className="text-gray-400 block text-[10px]">ERP Bill No.:</span>
              <span className="font-mono font-semibold">{bill.billNo}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Vendor Invoice No.:</span>
              <span className="font-mono font-semibold">{bill.vendorInvoiceNo}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Invoice Date:</span>
              <span>{bill.invoiceDate}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Received On:</span>
              <span>{bill.receivedOn}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Payment Due Date:</span>
              <span className="font-semibold text-rose-700">{bill.dueDate}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Bill Amount:</span>
              <span className="font-bold text-emerald-700">
                ₹{bill.grandTotal.toLocaleString('en-IN')} (Incl. GST)
              </span>
            </div>
          </div>
        </div>

        {/* PANEL 2: VENDOR DETAILS */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="font-bold text-gray-800 text-[11px] border-b pb-1">
            PANEL 2: VENDOR DETAILS
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
            <div>
              <span className="text-gray-400 block text-[10px]">Vendor Name:</span>
              <span className="font-semibold">{bill.vendorName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Vendor Code:</span>
              <span className="font-mono">{bill.vendorCode}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">GSTIN:</span>
              <span className="font-mono">{bill.gstin}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Previous Outstanding:</span>
              <span className="font-semibold text-amber-700">₹{bill.outstanding.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4">
        {/* PANEL 3: DOCUMENT TRAIL */}
        <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/50 space-y-2">
          <div className="font-bold text-blue-900 text-[11px] border-b border-blue-200 pb-1">
            PANEL 3: DOCUMENT TRAIL (PO → GRN → BILL)
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs py-1">
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-medium">
              {bill.linkedExpenseReq || 'EXP-REQ-002'} (Approved Req.)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span className="px-2 py-1 bg-white border border-blue-300 rounded font-mono font-medium text-blue-700">
              {bill.linkedPoNo || 'PO-2025-001'} (Sent to Vendor)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded font-mono font-medium text-purple-700">
              {bill.linkedGrnNo || 'GRN-2025-001'} (Goods Received)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span className="px-2 py-1 bg-emerald-100 border border-emerald-300 rounded font-mono font-bold text-emerald-800">
              {bill.billNo} (This Bill)
            </span>
          </div>
        </div>

        {/* PANEL 4: 3-WAY MATCH VERIFICATION */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="font-bold text-gray-800 text-[11px] border-b pb-1 flex items-center justify-between">
            <span>PANEL 4: 3-WAY MATCH VERIFICATION (PO vs GRN vs BILL)</span>
            <span className={'text-[10px] font-mono font-bold px-2 py-0.5 rounded ' + (
              bill.threeWayStatus === 'Matched'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : bill.threeWayStatus === 'Mismatch'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-gray-100 text-gray-700'
            )}>
              {bill.threeWayStatus ? bill.threeWayStatus.toUpperCase() : 'N/A'}
            </span>
          </div>
          <table className="w-full text-left text-xs border border-gray-200 rounded">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="p-1.5">Item Description</th>
                <th className="p-1.5 text-right">Qty</th>
                <th className="p-1.5 text-right">Rate</th>
                <th className="p-1.5 text-right">GST</th>
                <th className="p-1.5 text-right">Total</th>
                <th className="p-1.5 text-center">3-Way Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(bill.items || []).map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-1.5 font-medium text-gray-800">
                    {item.description}
                  </td>
                  <td className="p-1.5 text-right font-mono">{item.qty}</td>
                  <td className="p-1.5 text-right font-mono">₹{(item.rate || 0).toLocaleString('en-IN')}</td>
                  <td className="p-1.5 text-right font-mono text-gray-600">₹{(item.gstAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="p-1.5 text-right font-mono font-bold text-gray-900">₹{((item.amount || 0) + (item.gstAmount || 0)).toLocaleString('en-IN')}</td>
                  <td className="p-1.5 text-center font-bold">
                    {bill.threeWayStatus === 'Matched' ? (
                      <span className="text-emerald-700">✅ Matched</span>
                    ) : bill.threeWayStatus === 'Mismatch' ? (
                      <span className="text-rose-700">⚠️ Discrepancy</span>
                    ) : (
                      <span className="text-gray-500">— N/A —</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-[11px] font-semibold pt-1 flex items-center justify-between">
            <span className={bill.threeWayStatus === 'Matched' ? 'text-emerald-800' : bill.threeWayStatus === 'Mismatch' ? 'text-rose-800' : 'text-gray-700'}>
              Overall Match: {bill.threeWaySummary || (bill.threeWayStatus === 'Matched' ? '✅ ALL ITEMS MATCHED — Bill is valid' : '⚠️ Rate / quantity variance identified')}
            </span>
            <span className="text-gray-500 font-mono text-[10px]">
              PO: {bill.linkedPoNo || 'N/A'} | GRN: {bill.linkedGrnNo || 'N/A'}
            </span>
          </div>
        </div>

        {/* PANEL 5: BUDGET CHECK */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-1.5">
          <div className="font-bold text-gray-800 text-[11px] border-b pb-1">
            PANEL 5: BUDGET CHECK
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700">
            <div>Expense Category: <b>{bill.category}</b></div>
            <div>Annual Budget: <b>₹{bill.annualBudget.toLocaleString('en-IN')}</b></div>
            <div>Already Spent: <b>₹{bill.alreadySpent.toLocaleString('en-IN')}</b></div>
            <div>This Bill Amount: <b>₹{bill.grandTotal.toLocaleString('en-IN')}</b></div>
            <div>Total After Approval: <b>₹{totalAfterApproval.toLocaleString('en-IN')}</b></div>
            <div>
              Remaining Budget: <b className="text-emerald-700">₹{remainingBudget.toLocaleString('en-IN')}</b>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Budget Status: ✅ Within Budget — Safe to Approve
          </div>
        </div>
          </div>
        )}

        {/* PANEL 6: APPROVER REMARKS */}
        <div className="border border-indigo-200 rounded-lg p-3 bg-indigo-50/40 space-y-2">
          <div className="font-bold text-indigo-900 text-[11px]">
            PANEL 6: APPROVER REMARKS (Mandatory)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-600 mb-0.5 font-medium">Approver Authority</label>
              <select
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="Department Head">Department Head (Up to ₹5,000)</option>
                <option value="Finance Manager — Mrs. P. Gupta">
                  Finance Manager (₹5,001 – ₹25,000)
                </option>
                <option value="Principal — Mr. A. Sharma">
                  Finance Manager + Principal (₹25,001 – ₹1,00,000)
                </option>
                <option value="Management / Trustee Board">
                  Management / Trustee (&gt; ₹1,00,000)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-0.5 font-medium">Approver Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. 3-Way match verified against lab receipt challan. Approved for payment."
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions — Check Bill Details · Update · Reject · Approve Payment */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails((v) => !v)}
            className="text-xs flex items-center gap-1 text-gray-700"
          >
            <Eye className="w-3.5 h-3.5" />
            {showDetails ? 'Hide Bill Details' : '🔍 Check Bill Details'}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(remarks || 'Bill details re-checked and updated by reviewer', approver)}
              className="text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(remarks || 'Rejected by authority')}
              className="text-rose-700 border-rose-300 hover:bg-rose-50 text-xs"
            >
              <X className="w-3 h-3 mr-1" /> Reject Bill
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(remarks || 'Approved after 3-way match', approver)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              <Check className="w-3.5 h-3.5 mr-1" /> ✅ Approve Payment
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BillInvoiceManagement;


// ============================================================================
// SECTION : VENDOR PAYMENTS (merged from Expense Payment / Vendor Payment)
// ============================================================================
export type PaymentStatus = 'Paid' | 'Initiated' | 'Bounced';

export interface VendorPaymentRecord {
  id: string;
  paymentNo: string;
  paymentDate: string;
  billId: string;
  billNo: string;
  vendorName: string;
  vendorCode: string;
  mode: 'NEFT' | 'RTGS' | 'Cheque' | 'UPI' | 'Cash' | 'IMPS' | 'DD (Demand Draft)';
  bankAccount: string;
  chequeNo?: string;
  txnRef: string;
  grossAmount: number;
  tdsSection: string;
  tdsAmount: number;
  netPaid: number;
  status: PaymentStatus;
  remarks: string;
  createdBy: string;
}

const PAYMENT_MODES: VendorPaymentRecord['mode'][] = ['NEFT', 'RTGS', 'Cheque', 'UPI', 'Cash', 'IMPS', 'DD (Demand Draft)'];
const BANK_ACCOUNTS = [
  'SBI — Current A/c XXXX4521',
  'HDFC — Operational A/c XXXX9912',
  'ICICI — Fee Collection A/c XXXX8841'
];
const TDS_SECTIONS: { section: string; label: string; rate: number }[] = [
  { section: '194C', label: '194C — Contractors (2%)', rate: 2 },
  { section: '194J', label: '194J — Professional / Technical (10%)', rate: 10 },
  { section: '194H', label: '194H — Commission (5%)', rate: 5 },
  { section: '194Q', label: '194Q — Purchase of goods (0.1%)', rate: 0.1 },
  { section: 'None', label: 'No TDS applicable', rate: 0 }
];

const INITIAL_PAYMENTS: VendorPaymentRecord[] = [
  {
    id: 'pay_001',
    paymentNo: 'PAY-2025-0031',
    paymentDate: '2025-09-18',
    billId: 'bill_002',
    billNo: 'BILL-2025-002',
    vendorName: 'ABC Supplies Ltd',
    vendorCode: 'VND-0045',
    mode: 'NEFT',
    bankAccount: 'SBI — Current A/c XXXX4521',
    txnRef: 'NEFT20250918UTIB0012',
    grossAmount: 17050,
    tdsSection: '194C',
    tdsAmount: 341,
    netPaid: 16709,
    status: 'Paid',
    remarks: 'Stationery supplies — September 2025',
    createdBy: 'Accounts Officer'
  },
  {
    id: 'pay_002',
    paymentNo: 'PAY-2025-0032',
    paymentDate: '2025-09-25',
    billId: 'bill_005',
    billNo: 'BILL-2025-005',
    vendorName: 'Global Tech Solutions',
    vendorCode: 'VND-0061',
    mode: 'RTGS',
    bankAccount: 'HDFC — Operational A/c XXXX9912',
    txnRef: 'RTGS20250925HDFC0099',
    grossAmount: 25000,
    tdsSection: '194J',
    tdsAmount: 2500,
    netPaid: 22500,
    status: 'Paid',
    remarks: 'Annual ERP licence renewal',
    createdBy: 'Finance Manager'
  },
  {
    id: 'pay_003',
    paymentNo: 'PAY-2025-0033',
    paymentDate: '2025-09-28',
    billId: 'bill_004',
    billNo: 'BILL-2025-004',
    vendorName: 'Office Mart India',
    vendorCode: 'VND-0078',
    mode: 'Cheque',
    bankAccount: 'SBI — Current A/c XXXX4521',
    chequeNo: 'CHQ-893045',
    txnRef: 'CHQ-893045',
    grossAmount: 12500,
    tdsSection: 'None',
    tdsAmount: 0,
    netPaid: 12500,
    status: 'Bounced',
    remarks: 'Cheque returned — bill on hold pending vendor clarification',
    createdBy: 'Accounts Officer'
  },
  {
    id: 'pay_004',
    paymentNo: 'PAY-2025-0034',
    paymentDate: '2025-09-30',
    billId: 'advance',
    billNo: '— (Vendor Advance)',
    vendorName: 'Office Mart India',
    vendorCode: 'VND-0078',
    mode: 'UPI',
    bankAccount: 'ICICI — Fee Collection A/c XXXX8841',
    txnRef: 'UPI20250930119022',
    grossAmount: 29680,
    tdsSection: '194C',
    tdsAmount: 594,
    netPaid: 29086,
    status: 'Initiated',
    remarks: 'Advance released against PO-2025-0091 — awaiting GRN',
    createdBy: 'Accounts Officer'
  }
];

const paymentToday = () => new Date().toISOString().slice(0, 10);
const nextPaymentNo = (payments: VendorPaymentRecord[]) =>
  `PAY-2025-${String(35 + payments.length).padStart(4, '0')}`;

function PaymentModal({
  bill,
  payments,
  onClose,
  onSave
}: {
  bill: VendorBillRecord;
  payments: VendorPaymentRecord[];
  onClose: () => void;
  onSave: (payment: VendorPaymentRecord) => void;
}) {
  const alreadyPaid = payments
    .filter((p) => p.billId === bill.id && p.status !== 'Bounced')
    .reduce((s, p) => s + p.grossAmount, 0);
  const outstanding = Math.max(0, bill.grandTotal - alreadyPaid);

  const [paymentDate, setPaymentDate] = useState(paymentToday());
  const [mode, setMode] = useState<VendorPaymentRecord['mode']>('NEFT');
  const [bankAccount, setBankAccount] = useState(BANK_ACCOUNTS[0]);
  const [txnRef, setTxnRef] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [tdsSection, setTdsSection] = useState('194C');
  const [tdsAmount, setTdsAmount] = useState(String(Math.round((outstanding * 2) / 100)));
  const [grossAmount, setGrossAmount] = useState(String(outstanding));
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const section = TDS_SECTIONS.find((s) => s.section === tdsSection) || TDS_SECTIONS[0];
  const netPaid = Math.max(0, Number(grossAmount || 0) - Number(tdsAmount || 0));

  const applySection = (value: string) => {
    setTdsSection(value);
    const rate = (TDS_SECTIONS.find((s) => s.section === value) || TDS_SECTIONS[0]).rate;
    setTdsAmount(String(Math.round((Number(grossAmount || 0) * rate) / 100)));
  };

  const submit = () => {
    if (!Number(grossAmount) || Number(grossAmount) <= 0) return setError('Enter the amount being paid.');
    if (Number(grossAmount) > outstanding + 1)
      return setError(`Amount exceeds the outstanding balance of ₹${outstanding.toLocaleString('en-IN')}.`);
    if (mode === 'Cheque' && !chequeNo.trim()) return setError('Cheque number is required for cheque payments.');
    if (mode !== 'Cash' && mode !== 'Cheque' && !txnRef.trim())
      return setError('Bank / UTR reference is required for electronic payments.');
    setError('');
    onSave({
      id: `pay_${Date.now()}`,
      paymentNo: nextPaymentNo(payments),
      paymentDate,
      billId: bill.id,
      billNo: bill.billNo,
      vendorName: bill.vendorName,
      vendorCode: bill.vendorCode,
      mode,
      bankAccount,
      chequeNo: mode === 'Cheque' ? chequeNo : undefined,
      txnRef: mode === 'Cheque' ? chequeNo : txnRef || 'CASH-COUNTER',
      grossAmount: Number(grossAmount),
      tdsSection,
      tdsAmount: Number(tdsAmount || 0),
      netPaid,
      status: 'Paid',
      remarks: remarks || `Payment against ${bill.billNo}`,
      createdBy: 'Accounts Officer'
    });
  };

  return (
    <Modal isOpen onClose={onClose} title={`💳 Pay Vendor — ${bill.billNo}`} size="lg">
      <div className="space-y-4 text-xs">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div>
            <span className="block text-[10px] text-gray-400">Vendor</span>
            <span className="font-semibold text-gray-800">{bill.vendorName}</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400">Bill Amount</span>
            <span className="font-semibold text-gray-800">₹{bill.grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400">Already Paid</span>
            <span className="font-semibold text-emerald-700">₹{alreadyPaid.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400">Outstanding</span>
            <span className="font-semibold text-rose-700">₹{outstanding.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Payment Date</label>
            <input
              type="date"
              aria-label="Payment date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Payment Mode</label>
            <Select
              options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
              value={mode}
              onChange={(v: any) =>
                setMode((typeof v === 'string' ? v : v?.target?.value ?? mode) as VendorPaymentRecord['mode'])
              }
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bank Account</label>
            <Select
              options={BANK_ACCOUNTS.map((b) => ({ value: b, label: b }))}
              value={bankAccount}
              onChange={(v: any) => setBankAccount(typeof v === 'string' ? v : v?.target?.value ?? bankAccount)}
            />
          </div>
          {mode === 'Cheque' ? (
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Cheque No. *</label>
              <input
                aria-label="Cheque number"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                placeholder="CHQ-893045"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Transaction / UTR Ref. {mode !== 'Cash' && '*'}
              </label>
              <input
                aria-label="Transaction reference"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="NEFT20250918UTIB0012"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">TDS Section</label>
            <Select
              options={TDS_SECTIONS.map((s) => ({ value: s.section, label: s.label }))}
              value={tdsSection}
              onChange={(v: any) => applySection(typeof v === 'string' ? v : v?.target?.value ?? tdsSection)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Amount Being Paid (₹) · TDS @ {section.rate}%
            </label>
            <input
              type="number"
              aria-label="Amount being paid"
              value={grossAmount}
              onChange={(e) => {
                setGrossAmount(e.target.value);
                setTdsAmount(String(Math.round((Number(e.target.value || 0) * section.rate) / 100)));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">TDS Amount (₹)</label>
            <input
              type="number"
              aria-label="TDS amount"
              value={tdsAmount}
              onChange={(e) => setTdsAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Remarks / Narration</label>
            <input
              aria-label="Payment remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Payment narration for ledger and audit trail"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 grid grid-cols-3 gap-3">
          <div>
            <span className="block text-[10px] text-indigo-500">Gross Payable</span>
            <span className="font-bold text-indigo-900">₹{Number(grossAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-[10px] text-indigo-500">Less: TDS ({tdsSection})</span>
            <span className="font-bold text-rose-700">- ₹{Number(tdsAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-[10px] text-indigo-500">Net Payable to Vendor</span>
            <span className="font-bold text-emerald-700" data-testid="payment-net">
              ₹{netPaid.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submit}>
            <Check className="w-3.5 h-3.5 mr-1" /> Record Payment &amp; Generate Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function BulkPaymentModal({
  bills,
  payments,
  onClose,
  onSave
}: {
  bills: VendorBillRecord[];
  payments: VendorPaymentRecord[];
  onClose: () => void;
  onSave: (list: VendorPaymentRecord[]) => void;
}) {
  const [paymentDate, setPaymentDate] = useState(paymentToday());
  const [mode, setMode] = useState<VendorPaymentRecord['mode']>('NEFT');
  const [bankAccount, setBankAccount] = useState(BANK_ACCOUNTS[0]);
  const [applyTds, setApplyTds] = useState(true);
  const [txnRef, setTxnRef] = useState('');

  const rows = bills.map((b) => {
    const tds = applyTds ? Math.round((b.grandTotal * 2) / 100) : 0;
    return { bill: b, tds, net: b.grandTotal - tds };
  });
  const totalGross = rows.reduce((s, r) => s + r.bill.grandTotal, 0);
  const totalTds = rows.reduce((s, r) => s + r.tds, 0);
  const totalNet = rows.reduce((s, r) => s + r.net, 0);

  const submit = () => {
    const base = payments.length;
    onSave(
      rows.map((r, i) => ({
        id: `pay_${Date.now()}_${i}`,
        paymentNo: `PAY-2025-${String(35 + base + i).padStart(4, '0')}`,
        paymentDate,
        billId: r.bill.id,
        billNo: r.bill.billNo,
        vendorName: r.bill.vendorName,
        vendorCode: r.bill.vendorCode,
        mode,
        bankAccount,
        chequeNo: undefined,
        txnRef: txnRef || `BULK-${mode}-${paymentDate}`,
        grossAmount: r.bill.grandTotal,
        tdsSection: applyTds ? '194C' : 'None',
        tdsAmount: r.tds,
        netPaid: r.net,
        status: 'Paid' as PaymentStatus,
        remarks: `Bulk payment run (${bills.length} bills)`,
        createdBy: 'Accounts Officer'
      }))
    );
  };

  return (
    <Modal isOpen onClose={onClose} title={`💳 Bulk Vendor Payment — ${bills.length} Bills`} size="lg">
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Common Payment Mode</label>
            <Select
              options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
              value={mode}
              onChange={(v: any) => setMode((typeof v === 'string' ? v : v?.target?.value ?? mode) as VendorPaymentRecord['mode'])}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bank Account</label>
            <Select
              options={BANK_ACCOUNTS.map((b) => ({ value: b, label: b }))}
              value={bankAccount}
              onChange={(v: any) => setBankAccount(typeof v === 'string' ? v : v?.target?.value ?? bankAccount)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">UTR / Reference</label>
            <input
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              placeholder="Bulk run reference"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input
            type="checkbox"
            aria-label="Apply TDS"
            checked={applyTds}
            onChange={(e) => setApplyTds(e.target.checked)} />
          Apply section 194C TDS @ 2% on all selected bills
        </label>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Bill No.</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Bill Amount</th>
                <th className="p-3">TDS</th>
                <th className="p-3">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.bill.id}>
                  <td className="p-3 font-mono text-indigo-700">{r.bill.billNo}</td>
                  <td className="p-3 text-gray-800">{r.bill.vendorName}</td>
                  <td className="p-3">₹{r.bill.grandTotal.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-rose-700">₹{r.tds.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-semibold text-emerald-700">₹{r.net.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-800">
              <tr>
                <td className="p-3" colSpan={2}>
                  Total ({bills.length} bills)
                </td>
                <td className="p-3">₹{totalGross.toLocaleString('en-IN')}</td>
                <td className="p-3 text-rose-700">₹{totalTds.toLocaleString('en-IN')}</td>
                <td className="p-3 text-emerald-700" data-testid="bulk-payment-total">
              ₹{totalNet.toLocaleString('en-IN')}
            </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submit}>
            <Check className="w-3.5 h-3.5 mr-1" /> Record {bills.length} Payments
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function PaymentRegisterSection({
  payments,
  onView
}: {
  payments: VendorPaymentRecord[];
  onView: (p: VendorPaymentRecord) => void;
}) {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = payments.filter((p) => {
    if (modeFilter !== 'all' && p.mode !== modeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.paymentNo.toLowerCase().includes(q) ||
        p.billNo.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.txnRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGross = filtered.reduce((s, p) => s + p.grossAmount, 0);
  const totalTds = filtered.reduce((s, p) => s + p.tdsAmount, 0);
  const totalNet = filtered.reduce((s, p) => s + p.netPaid, 0);

  const exportCsv = () => {
    const headers = [
      'Payment No',
      'Payment Date',
      'Bill No',
      'Vendor',
      'Mode',
      'Bank Account',
      'Cheque / UTR',
      'Gross Amount',
      'TDS Section',
      'TDS Amount',
      'Net Paid',
      'Status'
    ];
    const rows = filtered.map((p) => [
      p.paymentNo,
      p.paymentDate,
      p.billNo,
      p.vendorName,
      p.mode,
      p.bankAccount,
      p.txnRef,
      p.grossAmount,
      p.tdsSection,
      p.tdsAmount,
      p.netPaid,
      p.status
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c)}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vendor_Payment_Register.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const print = () => {
    printHtml(
      tableHtml(
        'Vendor Payment Register',
        ['Payment No', 'Date', 'Bill No', 'Vendor', 'Mode', 'TDS', 'Net Paid', 'Status'],
        filtered.map((p) => [
          p.paymentNo,
          p.paymentDate,
          p.billNo,
          p.vendorName,
          p.mode,
          inr(p.tdsAmount),
          inr(p.netPaid),
          p.status
        ])
      )
    );
  };

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Vendor Payment Register</h2>
            <p className="text-xs text-gray-500">
              {filtered.length} payment(s) · Paid ₹{totalNet.toLocaleString('en-IN')} · TDS ₹
              {totalTds.toLocaleString('en-IN')} on ₹{totalGross.toLocaleString('en-IN')} gross
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment, bill, vendor, UTR..."
              className="w-64 rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Select
            options={[{ value: 'all', label: 'All Modes' }, ...PAYMENT_MODES.map((m) => ({ value: m, label: m }))]}
            value={modeFilter}
            onChange={(v: any) => setModeFilter(typeof v === 'string' ? v : v?.target?.value ?? 'all')}
            className="text-xs w-36"
          />
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Initiated', label: 'Initiated' },
              { value: 'Bounced', label: 'Bounced' }
            ]}
            value={statusFilter}
            onChange={(v: any) => setStatusFilter(typeof v === 'string' ? v : v?.target?.value ?? 'all')}
            className="text-xs w-32"
          />
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={print}>
            <FileText className="w-4 h-4 mr-1" /> Print
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" data-testid="payment-register">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3">Payment No.</th>
              <th className="p-3">Date</th>
              <th className="p-3">Bill / Vendor</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Bank / Cheque / UTR</th>
              <th className="p-3">Gross</th>
              <th className="p-3">TDS</th>
              <th className="p-3">Net Paid</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-indigo-50/30">
                <td className="p-3 font-mono font-medium text-indigo-700">{p.paymentNo}</td>
                <td className="p-3 text-gray-600">{p.paymentDate}</td>
                <td className="p-3">
                  <div className="font-mono text-gray-800">{p.billNo}</div>
                  <div className="text-[11px] text-gray-500">{p.vendorName}</div>
                </td>
                <td className="p-3">
                  <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                    {p.mode}
                  </span>
                </td>
                <td className="p-3">
                  <div className="text-gray-700">{p.bankAccount}</div>
                  <div className="text-[11px] text-gray-500 font-mono">{p.txnRef}</div>
                </td>
                <td className="p-3 text-gray-800">₹{p.grossAmount.toLocaleString('en-IN')}</td>
                <td className="p-3 text-rose-700">
                  ₹{p.tdsAmount.toLocaleString('en-IN')}
                  <div className="text-[10px] text-gray-500">{p.tdsSection}</div>
                </td>
                <td className="p-3 font-semibold text-gray-900">₹{p.netPaid.toLocaleString('en-IN')}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      p.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : p.status === 'Initiated'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(p)}
                    className="h-7 px-2 text-xs text-indigo-600 hover:bg-indigo-50"
                    title="View payment details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  No payments recorded for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-gray-50 border-t border-gray-200 font-semibold text-gray-800">
              <tr>
                <td className="p-3" colSpan={5}>
                  Total ({filtered.length} payments)
                </td>
                <td className="p-3">₹{totalGross.toLocaleString('en-IN')}</td>
                <td className="p-3 text-rose-700">₹{totalTds.toLocaleString('en-IN')}</td>
                <td className="p-3 text-emerald-700">₹{totalNet.toLocaleString('en-IN')}</td>
                <td className="p-3" colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Card>
  );
}

function PaymentDetailModal({ payment, onClose }: { payment: VendorPaymentRecord; onClose: () => void }) {
  return (
    <Modal isOpen onClose={onClose} title={`Payment — ${payment.paymentNo}`} size="md">
      <div className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Payment No.', payment.paymentNo],
            ['Payment Date', payment.paymentDate],
            ['Bill No.', payment.billNo],
            ['Vendor', `${payment.vendorName} (${payment.vendorCode})`],
            ['Mode', payment.mode],
            ['Bank Account', payment.bankAccount],
            ['Cheque No.', payment.chequeNo || '—'],
            ['UTR / Reference', payment.txnRef],
            ['Gross Amount', `₹${payment.grossAmount.toLocaleString('en-IN')}`],
            ['TDS', `${payment.tdsSection} — ₹${payment.tdsAmount.toLocaleString('en-IN')}`],
            ['Net Paid', `₹${payment.netPaid.toLocaleString('en-IN')}`],
            ['Status', payment.status],
            ['Created By', payment.createdBy],
            ['Remarks', payment.remarks]
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400">{k}</span>
              <span className="font-medium text-gray-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
