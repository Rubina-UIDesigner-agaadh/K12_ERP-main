// VendorPayment.tsx - PAGE 6: VENDOR PAYMENT PAGE
// Process actual payments to vendors after bill approval
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Wallet,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Download,
  Eye,
  FileText,
  Printer,
  X,
  Check,
  Paperclip,
  Landmark,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';

export type PaymentMode = 'Cash' | 'Cheque' | 'NEFT' | 'RTGS' | 'UPI' | 'IMPS' | 'DD';
export type PaymentStatus = 'Completed' | 'Pending' | 'Draft' | 'Failed';

export interface VendorBillOption {
  billNo: string;
  invoiceNo: string;
  billAmt: number;
  dueDate: string;
  daysToDue: number;
}

export interface VendorProfile {
  vendorName: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  bills: VendorBillOption[];
}

export interface PaymentRecord {
  id: string;
  paymentNo: string;
  vendorName: string;
  billsCovered: string[];
  amountPaid: number;
  grossAmount: number;
  tdsAmount: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  status: PaymentStatus;
  bankAccount: string;
  chequeNo?: string;
  chequeDate?: string;
  transferRefNo?: string;
  narration?: string;
  paymentProofFile?: string;
}

const AVAILABLE_VENDORS: Record<string, VendorProfile> = {
  'ABC Supplies Ltd': {
    vendorName: 'ABC Supplies Ltd',
    bankName: 'SBI — Corporate Branch',
    accountNo: '38491029481',
    ifscCode: 'SBIN0001234',
    bills: [
      {
        billNo: 'BILL-2025-001',
        invoiceNo: 'INV-1234',
        billAmt: 90850,
        dueDate: '15-Nov-2025',
        daysToDue: 14
      },
      {
        billNo: 'BILL-2025-006',
        invoiceNo: 'INV-1235',
        billAmt: 45000,
        dueDate: '10-Nov-2025',
        daysToDue: 9
      },
      {
        billNo: 'BILL-2025-008',
        invoiceNo: 'INV-1236',
        billAmt: 25000,
        dueDate: '30-Nov-2025',
        daysToDue: 29
      }
    ]
  },
  'XYZ Stationers': {
    vendorName: 'XYZ Stationers',
    bankName: 'HDFC Bank — Main Branch',
    accountNo: '50200039281920',
    ifscCode: 'HDFC0000240',
    bills: [
      {
        billNo: 'BILL-2025-002',
        invoiceNo: 'INV-XYZ-2025-9921',
        billAmt: 17050,
        dueDate: '05-Nov-2025',
        daysToDue: 4
      }
    ]
  },
  'PowerGrid Utility': {
    vendorName: 'PowerGrid Utility',
    bankName: 'Bank of Baroda — Utility Cell',
    accountNo: '00120200004921',
    ifscCode: 'BARB0AHMEDA',
    bills: [
      {
        billNo: 'BILL-2025-003',
        invoiceNo: 'UTIL-PW-OCT-2025',
        billAmt: 12500,
        dueDate: '10-Nov-2025',
        daysToDue: 9
      }
    ]
  },
  'Building Owner': {
    vendorName: 'Building Owner',
    bankName: 'ICICI Bank — City Branch',
    accountNo: '004901594839',
    ifscCode: 'ICIC0000049',
    bills: [
      {
        billNo: 'BILL-2025-005',
        invoiceNo: 'RENT-SOUTH-NOV-25',
        billAmt: 25000,
        dueDate: '01-Nov-2025',
        daysToDue: 0
      }
    ]
  }
};

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_001',
    paymentNo: 'PAY-2025-001',
    vendorName: 'ABC Supplies Ltd',
    billsCovered: ['BILL-001', 'BILL-006'],
    grossAmount: 135850,
    tdsAmount: 2717,
    amountPaid: 133133,
    paymentMode: 'NEFT',
    paymentDate: '01-Nov-2025',
    status: 'Completed',
    bankAccount: 'SBI — Current A/c XXXX4521',
    transferRefNo: 'NEFT-N3052491028',
    narration: 'Payment for Lab Equipment — BILL-2025-001 & 006',
    paymentProofFile: 'NEFT_Receipt_PAY-2025-001.pdf'
  },
  {
    id: 'pay_002',
    paymentNo: 'PAY-2025-002',
    vendorName: 'XYZ Stationers',
    billsCovered: ['BILL-002'],
    grossAmount: 17050,
    tdsAmount: 0,
    amountPaid: 17050,
    paymentMode: 'Cheque',
    paymentDate: '05-Nov-2025',
    status: 'Pending',
    bankAccount: 'SBI — Current A/c XXXX4521',
    chequeNo: 'CHQ-893021',
    chequeDate: '05-Nov-2025',
    narration: 'Payment for stationery supply — A4 Paper & Whiteboard Markers',
    paymentProofFile: 'Cheque_Copy_893021.pdf'
  },
  {
    id: 'pay_003',
    paymentNo: 'PAY-2025-003',
    vendorName: 'PowerGrid Utility',
    billsCovered: ['BILL-003'],
    grossAmount: 12500,
    tdsAmount: 0,
    amountPaid: 12500,
    paymentMode: 'NEFT',
    paymentDate: '10-Nov-2025',
    status: 'Completed',
    bankAccount: 'SBI — Current A/c XXXX4521',
    transferRefNo: 'NEFT-N3091823901',
    narration: 'Monthly power grid electricity tariff'
  },
  {
    id: 'pay_004',
    paymentNo: 'PAY-2025-004',
    vendorName: 'Building Owner',
    billsCovered: ['BILL-005'],
    grossAmount: 25000,
    tdsAmount: 0,
    amountPaid: 25000,
    paymentMode: 'RTGS',
    paymentDate: '01-Nov-2025',
    status: 'Completed',
    bankAccount: 'HDFC — Operational A/c XXXX9912',
    transferRefNo: 'RTGS-R3018293019',
    narration: 'Monthly lease rental for South Wing Sports Annex'
  }
];

export function VendorPayment() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<PaymentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (modeFilter !== 'All' && p.paymentMode !== modeFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.paymentNo.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.billsCovered.some((b) => b.toLowerCase().includes(q)) ||
          p.paymentMode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [payments, modeFilter, statusFilter, searchQuery]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🔝 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Expenses</span>
            <span>&gt;</span>
            <span className="text-gray-800 font-semibold">Vendor Payment</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Vendor Payment
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FY: 2025-26
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                🎯 Purpose: Process actual payments to vendors after bill approval
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setShowProcessModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> 💰 Process Vendor Payment
          </Button>
        </div>
      </div>

      {/* 📊 SUMMARY KPI CARDS (Matching Specification Exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Total Payable (Approved) */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">💰 Total Payable</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">₹3,85,000</div>
          <div className="text-[11px] text-gray-500 mt-1">(Approved Bills)</div>
        </Card>

        {/* Pending Payments */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">⏳ Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">₹2,15,000</div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting Release</div>
        </Card>

        {/* Overdue Payments */}
        <Card className="p-4 bg-gradient-to-br from-rose-50 to-white border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">⚠️ Overdue</span>
          </div>
          <div className="text-2xl font-bold text-rose-700">₹ 45,000</div>
          <div className="text-[11px] text-rose-600 mt-1">🔴 Urgent! Past due date</div>
        </Card>

        {/* Paid This Month */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">✅ Paid This Month</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">₹1,20,000</div>
          <div className="text-[11px] text-gray-500 mt-1">Current month disbursements</div>
        </Card>

        {/* Total Paid YTD */}
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">💰 Paid YTD</span>
          </div>
          <div className="text-2xl font-bold text-indigo-700">₹8,50,000</div>
          <div className="text-[11px] text-gray-500 mt-1">Year to date</div>
        </Card>

        {/* Total Outstanding */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">💰 Outstanding</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">₹2,15,000</div>
          <div className="text-[11px] text-gray-500 mt-1">Total vendor balance</div>
        </Card>
      </div>

      {/* 🔍 FILTER & SEARCH TOOLBAR */}
      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Payment No, Vendor Name, or Bill No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Payment Modes</option>
              <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
              <option value="Cheque">Cheque</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">✅ Completed</option>
              <option value="Pending">⏳ Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 📋 PAYMENT TABLE */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">Payment No.</th>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Bills Covered</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p, idx) => (
                <tr key={p.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="p-3 text-center font-mono text-gray-500">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-indigo-700">{p.paymentNo}</td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{p.vendorName}</div>
                    <div className="text-[10px] text-gray-500">{p.bankAccount}</div>
                  </td>
                  <td className="p-3 font-mono text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {p.billsCovered.map((b) => (
                        <span key={b} className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] text-gray-800">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    ₹{p.amountPaid.toLocaleString('en-IN')}
                    {p.tdsAmount > 0 && (
                      <div className="text-[10px] text-gray-400 font-normal">
                        TDS: ₹{p.tdsAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                      🏦 {p.paymentMode}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-gray-600">{p.paymentDate}</td>
                  <td className="p-3 text-center">
                    {p.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ✅ Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> ⏳ Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewingPayment(p)}
                      className="h-7 px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                      title="View Payment Voucher"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> 👁️ View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 💰 PROCESS VENDOR PAYMENT MODAL */}
      {showProcessModal && (
        <ProcessVendorPaymentModal
          onClose={() => setShowProcessModal(false)}
          onConfirm={(newPayment) => {
            setPayments((prev) => [newPayment, ...prev]);
            setShowProcessModal(false);
            showToast(`Payment ${newPayment.paymentNo} processed successfully for ${newPayment.vendorName}!`);
          }}
        />
      )}

      {/* 👁️ VIEW PAYMENT VOUCHER MODAL */}
      {viewingPayment && (
        <ViewPaymentVoucherModal
          payment={viewingPayment}
          onClose={() => setViewingPayment(null)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PROCESS VENDOR PAYMENT FORM MODAL
// ----------------------------------------------------------------------------
function ProcessVendorPaymentModal({
  onClose,
  onConfirm
}: {
  onClose: () => void;
  onConfirm: (payment: PaymentRecord) => void;
}) {
  const [selectedVendor, setSelectedVendor] = useState<string>('ABC Supplies Ltd');
  const [paymentDate, setPaymentDate] = useState<string>('2025-11-01');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('NEFT');
  const [bankAccount, setBankAccount] = useState<string>('SBI — Current A/c XXXX4521');

  // Cheque Fields
  const [chequeNo, setChequeNo] = useState<string>('CHQ-984021');
  const [chequeDate, setChequeDate] = useState<string>('2025-11-01');

  // NEFT / RTGS Fields
  const [transferRefNo, setTransferRefNo] = useState<string>('NEFT-N3082910481');

  // Selected Bill IDs
  const [selectedBills, setSelectedBills] = useState<Record<string, boolean>>({
    'BILL-2025-001': true,
    'BILL-2025-006': true,
    'BILL-2025-008': false
  });

  // TDS Deduction
  const [applyTds, setApplyTds] = useState<boolean>(true);
  const [tdsPct, setTdsPct] = useState<number>(2);

  // Narration & Reference
  const [paymentRef, setPaymentRef] = useState<string>('REF-EXP-NOV-25');
  const [narration, setNarration] = useState<string>(
    'Payment for Lab Equipment — BILL-2025-001 & 006'
  );

  const vendorData = AVAILABLE_VENDORS[selectedVendor] || AVAILABLE_VENDORS['ABC Supplies Ltd'];

  // Calculations
  const selectedTotal = useMemo(() => {
    return vendorData.bills
      .filter((b) => selectedBills[b.billNo])
      .reduce((sum, b) => sum + b.billAmt, 0);
  }, [vendorData, selectedBills]);

  const tdsAmount = useMemo(() => {
    if (!applyTds) return 0;
    return Math.round((selectedTotal * tdsPct) / 100);
  }, [applyTds, selectedTotal, tdsPct]);

  const amountAfterTds = selectedTotal - tdsAmount;

  const handleSubmit = () => {
    const chosenBills = vendorData.bills
      .filter((b) => selectedBills[b.billNo])
      .map((b) => b.billNo);

    if (chosenBills.length === 0) {
      alert('Please select at least one bill to pay.');
      return;
    }

    const paymentNo = `PAY-2025-${String(Math.floor(100 + Math.random() * 899))}`;
    const newRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      paymentNo,
      vendorName: selectedVendor,
      billsCovered: chosenBills,
      grossAmount: selectedTotal,
      tdsAmount,
      amountPaid: amountAfterTds,
      paymentMode,
      paymentDate: '01-Nov-2025',
      status: 'Completed',
      bankAccount,
      chequeNo: paymentMode === 'Cheque' ? chequeNo : undefined,
      chequeDate: paymentMode === 'Cheque' ? chequeDate : undefined,
      transferRefNo: ['NEFT', 'RTGS', 'IMPS'].includes(paymentMode) ? transferRefNo : undefined,
      narration,
      paymentProofFile: 'Bank_Transfer_Confirmation.pdf'
    };

    onConfirm(newRecord);
  };

  return (
    <Modal isOpen onClose={onClose} title="💰 Process Vendor Payment" size="lg">
      <div className="space-y-4 text-xs">
        {/* Top Reference Bar */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-gray-500 block text-[10px]">Payment No.:</span>
            <span className="font-mono font-bold text-indigo-700">Auto: PAY-2025-001 🔒 Auto-generated</span>
          </div>
          <div>
            <label className="text-gray-600 block text-[10px] mb-0.5">Payment Date:</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="p-1 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
        </div>

        {/* SELECT BILLS TO PAY */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
              SELECT BILLS TO PAY:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">Vendor:</span>
              <select
                value={selectedVendor}
                onChange={(e) => {
                  setSelectedVendor(e.target.value);
                  setSelectedBills({});
                }}
                className="p-1 border border-gray-300 rounded text-xs bg-white font-medium"
              >
                {Object.keys(AVAILABLE_VENDORS).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2 w-10 text-center">Select</th>
                  <th className="p-2">Bill No.</th>
                  <th className="p-2">Invoice No.</th>
                  <th className="p-2 text-right">Bill Amt</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2 text-right">Days to Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendorData.bills.map((b) => (
                  <tr key={b.billNo} className="hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!selectedBills[b.billNo]}
                        onChange={(e) =>
                          setSelectedBills({
                            ...selectedBills,
                            [b.billNo]: e.target.checked
                          })
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                    </td>
                    <td className="p-2 font-mono font-medium text-gray-900">{b.billNo}</td>
                    <td className="p-2 font-mono text-gray-600">{b.invoiceNo}</td>
                    <td className="p-2 text-right font-mono font-bold text-gray-900">
                      ₹{b.billAmt.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-gray-600 font-mono">{b.dueDate}</td>
                    <td className="p-2 text-right font-mono text-gray-600">{b.daysToDue} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Gross Total Selected:</span>
            <span className="text-sm font-bold text-gray-900 font-mono">
              ₹ {selectedTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-b pb-1">
            PAYMENT DETAILS:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-0.5 font-medium">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="UPI">UPI</option>
                <option value="IMPS">IMPS</option>
                <option value="DD">DD</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-0.5 font-medium">Bank Account (School)</label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="SBI — Current A/c XXXX4521">SBI — Current A/c XXXX4521</option>
                <option value="HDFC — Operational A/c XXXX9912">HDFC — Operational A/c XXXX9912</option>
                <option value="ICICI — Fee Collection A/c XXXX8841">ICICI — Fee Collection A/c XXXX8841</option>
              </select>
            </div>
          </div>

          {/* Conditional Sub-panels */}
          {paymentMode === 'Cheque' && (
            <div className="p-2.5 bg-amber-50/50 rounded border border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-600 text-[10px]">Cheque No.:</label>
                <input
                  type="text"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  placeholder="CHQ-XXXXXX"
                  className="w-full p-1 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-[10px]">Cheque Date:</label>
                <input
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-[10px]">Cheque in favour of:</label>
                <span className="font-semibold text-gray-800 block pt-1">
                  [ {selectedVendor} ] 🔒 Auto-filled
                </span>
              </div>
            </div>
          )}

          {['NEFT', 'RTGS', 'IMPS'].includes(paymentMode) && (
            <div className="p-2.5 bg-blue-50/50 rounded border border-blue-200 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <span className="text-gray-500 block text-[10px]">Beneficiary Bank:</span>
                <span className="font-medium text-gray-800">{vendorData.bankName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Account No.:</span>
                <span className="font-mono text-gray-800">{vendorData.accountNo}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">IFSC Code:</span>
                <span className="font-mono text-gray-800">{vendorData.ifscCode}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Transfer Ref. No.:</span>
                <span className="font-mono text-indigo-700 font-semibold">{transferRefNo}</span>
              </div>
            </div>
          )}
        </div>

        {/* TDS DEDUCTION (If Applicable) */}
        <div className="border border-purple-200 rounded-lg p-3 bg-purple-50/25 space-y-2">
          <div className="flex items-center justify-between border-b border-purple-200 pb-1">
            <span className="font-bold text-purple-900 text-[11px] uppercase tracking-wider">
              TDS DEDUCTION (If Applicable):
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-xs">Apply TDS?</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="applyTds"
                  checked={applyTds}
                  onChange={() => setApplyTds(true)}
                  className="text-purple-600"
                />
                <span className="font-semibold text-purple-900">🔵 Yes</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="applyTds"
                  checked={!applyTds}
                  onChange={() => setApplyTds(false)}
                  className="text-purple-600"
                />
                <span className="text-gray-600">⚪ No</span>
              </label>
            </div>
          </div>

          {applyTds && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-gray-500 block text-[10px]">TDS Rate %:</span>
                <span className="font-semibold text-gray-800">
                  {tdsPct}% (Section 194C — for contractors)
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">TDS Amount:</span>
                <span className="font-mono font-bold text-rose-700">
                  ₹ {tdsAmount.toLocaleString('en-IN')} 🔒 Auto-calculated
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Amount After TDS:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  ₹ {amountAfterTds.toLocaleString('en-IN')} 🔒 Auto-calculated
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reference & Narration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-600 mb-0.5">Payment Reference:</label>
            <input
              type="text"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="e.g. Bank Challan / Cheque Receipt"
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-0.5">Narration:</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            />
          </div>
        </div>

        {/* JOURNAL ENTRY PREVIEW */}
        <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50/30 space-y-2">
          <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider">
            JOURNAL ENTRY PREVIEW (Auto-generated after payment):
          </div>
          <table className="w-full text-left text-xs border border-emerald-200 rounded bg-white">
            <thead className="bg-emerald-100/60 text-emerald-950 font-bold border-b border-emerald-200">
              <tr>
                <th className="p-2">Account</th>
                <th className="p-2 text-right">Debit</th>
                <th className="p-2 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-2 font-medium text-gray-900">Accounts Payable — {selectedVendor}</td>
                <td className="p-2 text-right font-mono font-bold text-gray-900">
                  ₹{selectedTotal.toLocaleString('en-IN')}
                </td>
                <td className="p-2 text-right font-mono text-gray-400">—</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-gray-900">Bank Account — SBI</td>
                <td className="p-2 text-right font-mono text-gray-400">—</td>
                <td className="p-2 text-right font-mono font-bold text-emerald-700">
                  ₹{amountAfterTds.toLocaleString('en-IN')}
                </td>
              </tr>
              {tdsAmount > 0 && (
                <tr>
                  <td className="p-2 font-medium text-gray-900">TDS Payable A/c</td>
                  <td className="p-2 text-right font-mono text-gray-400">—</td>
                  <td className="p-2 text-right font-mono font-bold text-purple-700">
                    ₹{tdsAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            ⚠️ Journal entry will auto-post to General Ledger after payment confirmation
          </div>
        </div>

        {/* Upload Proof */}
        <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <span>Upload Payment Proof: [ Bank Receipt / NEFT Confirmation ]</span>
          </div>
          <span className="text-gray-400 font-mono text-[11px]">Bank_Confirmation.pdf</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            ❌ Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert('Draft saved successfully.');
              onClose();
            }}
            className="text-xs text-gray-700"
          >
            💾 Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
          >
            <Check className="w-4 h-4 mr-1" /> ✅ Confirm &amp; Process Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ----------------------------------------------------------------------------
// VIEW PAYMENT VOUCHER MODAL
// ----------------------------------------------------------------------------
function ViewPaymentVoucherModal({
  payment,
  onClose
}: {
  payment: PaymentRecord;
  onClose: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} title={`🧾 Vendor Payment Voucher — ${payment.paymentNo}`} size="lg">
      <div className="space-y-4 text-xs text-gray-800">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 to-gray-900 text-white rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] text-indigo-200 uppercase font-semibold">VOUCHER NUMBER</div>
            <h3 className="text-lg font-bold">{payment.paymentNo}</h3>
            <div className="text-xs text-indigo-100 mt-0.5">
              Vendor: <b>{payment.vendorName}</b> | Date: {payment.paymentDate}
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white font-bold border-none text-xs">
            {payment.status}
          </Badge>
        </div>

        {/* Voucher Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-gray-400 block text-[10px]">Payment Mode:</span>
            <span className="font-semibold text-gray-800">🏦 {payment.paymentMode}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">School Bank Account:</span>
            <span className="font-semibold text-gray-800">{payment.bankAccount}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Gross Amount:</span>
            <span className="font-mono font-bold text-gray-900">₹{payment.grossAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">TDS Deducted:</span>
            <span className="font-mono font-semibold text-rose-700">₹{payment.tdsAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Net Amount Disbursed:</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              ₹{payment.amountPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Reference / UTR:</span>
            <span className="font-mono text-indigo-700 font-semibold">
              {payment.transferRefNo || payment.chequeNo || 'N/A'}
            </span>
          </div>
        </div>

        {/* Bills Settled */}
        <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1.5">
          <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">
            BILLS COVERED IN THIS SETTLEMENT:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {payment.billsCovered.map((b) => (
              <span key={b} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded font-mono font-semibold text-xs">
                {b}
              </span>
            ))}
          </div>
          {payment.narration && (
            <p className="text-xs text-gray-500 italic pt-2 border-t mt-2">
              Narration: {payment.narration}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Downloading voucher ${payment.paymentNo}.pdf`)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default VendorPayment;
