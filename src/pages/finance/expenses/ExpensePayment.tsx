import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Building2,
  CreditCard,
  Banknote,
  Globe,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Save,
  Search,
  Wallet,
  X,
  Info,
  Phone,
  Mail,
  MapPin,
  Hash,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Percent,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
  Download,
  Printer,
  Eye,
  Edit3,
  RefreshCw,
  Zap,
  Shield,
  Database,
  HelpCircle,
  Copy,
  ExternalLink,
  Smartphone,
  Building,
  Receipt,
  FileCheck,
  Calculator,
  TrendingDown,
  MoreVertical,
  Paperclip,
  Send,
  Lock,
  Unlock } from
'lucide-react';

// --- Types ---
interface Vendor {
  id: string;
  name: string;
  code: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  totalOutstanding: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

interface Voucher {
  id: string;
  date: string;
  dueDate: string;
  head: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  age: number;
  status: 'pending' | 'partial' | 'overdue';
  approvedBy: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  mode: string;
  reference: string;
  status: 'success' | 'pending' | 'failed';
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  dataSource: string[];
  whyItMatters: string[];
  actions: {label: string;action: () => void;}[];
}

// --- Info Modal Component ---
function InfoModal({ isOpen, onClose, title, description, dataSource, whyItMatters, actions }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">{description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 uppercase text-sm tracking-wide">Data Source</h3>
              </div>
              <ul className="space-y-2">
                {dataSource.map((item, index) =>
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 uppercase text-sm tracking-wide">Why It Matters</h3>
              </div>
              <ul className="space-y-2">
                {whyItMatters.map((item, index) =>
                <li key={index} className="flex items-start gap-2 text-sm text-purple-800">
                    <Zap className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>);

}

// --- Mock Data ---
const VENDORS: Vendor[] = [
{
  id: 'v1',
  name: 'Global Electricity Corp',
  code: 'VEND-9901',
  gstin: '27AABCG1234M1ZX',
  pan: 'AABCG1234M',
  address: '123 Power House Lane, Sector 5',
  city: 'Mumbai, Maharashtra',
  phone: '+91 98765 43210',
  email: 'accounts@globalelec.com',
  bankName: 'HDFC Bank',
  bankAccount: '50100123456789',
  ifsc: 'HDFC0001234',
  totalOutstanding: 24000,
  lastPaymentDate: '2024-02-28',
  lastPaymentAmount: 18500
},
{
  id: 'v2',
  name: 'Modern Stationery Hub',
  code: 'VEND-8802',
  gstin: '27AABCM5678N1ZY',
  pan: 'AABCM5678N',
  address: '45 Paper Mill Road',
  city: 'Pune, Maharashtra',
  phone: '+91 87654 32109',
  email: 'billing@modernstat.com',
  bankName: 'ICICI Bank',
  bankAccount: '601201234567',
  ifsc: 'ICIC0005678',
  totalOutstanding: 15600,
  lastPaymentDate: '2024-03-05',
  lastPaymentAmount: 8200
},
{
  id: 'v3',
  name: 'Apex Maintenance Services',
  code: 'VEND-7703',
  gstin: '27AABCA9012P1ZZ',
  pan: 'AABCA9012P',
  address: '78 Service Center Complex',
  city: 'Thane, Maharashtra',
  phone: '+91 76543 21098',
  email: 'finance@apexmaint.in',
  bankName: 'State Bank of India',
  bankAccount: '38765432109',
  ifsc: 'SBIN0009012',
  totalOutstanding: 42000,
  lastPaymentDate: '2024-02-15',
  lastPaymentAmount: 25000
}];


const UNPAID_VOUCHERS: Record<string, Voucher[]> = {
  v1: [
  {
    id: 'VCH-001',
    date: '2024-03-10',
    dueDate: '2024-03-25',
    head: 'Electricity Bill - February 2024',
    description: 'Monthly electricity charges for main campus',
    totalAmount: 12500,
    paidAmount: 0,
    balance: 12500,
    age: 15,
    status: 'pending',
    approvedBy: 'Finance Manager'
  },
  {
    id: 'VCH-005',
    date: '2024-03-15',
    dueDate: '2024-03-30',
    head: 'Internet & WiFi Services',
    description: 'Monthly internet connectivity charges',
    totalAmount: 3500,
    paidAmount: 0,
    balance: 3500,
    age: 10,
    status: 'pending',
    approvedBy: 'IT Head'
  },
  {
    id: 'VCH-012',
    date: '2024-03-18',
    dueDate: '2024-03-28',
    head: 'CCTV Maintenance - Quarterly',
    description: 'Q1 CCTV system maintenance and repairs',
    totalAmount: 8000,
    paidAmount: 4000,
    balance: 4000,
    age: 7,
    status: 'partial',
    approvedBy: 'Admin Head'
  }],

  v2: [
  {
    id: 'VCH-008',
    date: '2024-03-12',
    dueDate: '2024-03-20',
    head: 'Office Stationery Supply',
    description: 'Monthly stationery for admin department',
    totalAmount: 8500,
    paidAmount: 0,
    balance: 8500,
    age: 13,
    status: 'overdue',
    approvedBy: 'Admin Head'
  },
  {
    id: 'VCH-015',
    date: '2024-03-20',
    dueDate: '2024-04-05',
    head: 'Exam Paper Printing',
    description: 'Unit test papers for all classes',
    totalAmount: 7100,
    paidAmount: 0,
    balance: 7100,
    age: 5,
    status: 'pending',
    approvedBy: 'Exam Controller'
  }],

  v3: [
  {
    id: 'VCH-003',
    date: '2024-03-05',
    dueDate: '2024-03-15',
    head: 'Building Maintenance - March',
    description: 'Monthly maintenance contract',
    totalAmount: 25000,
    paidAmount: 0,
    balance: 25000,
    age: 20,
    status: 'overdue',
    approvedBy: 'Estate Manager'
  },
  {
    id: 'VCH-009',
    date: '2024-03-14',
    dueDate: '2024-03-29',
    head: 'Plumbing Repairs',
    description: 'Emergency plumbing work in Block B',
    totalAmount: 12000,
    paidAmount: 0,
    balance: 12000,
    age: 11,
    status: 'pending',
    approvedBy: 'Estate Manager'
  },
  {
    id: 'VCH-018',
    date: '2024-03-22',
    dueDate: '2024-04-06',
    head: 'AC Servicing',
    description: 'Quarterly AC maintenance for all blocks',
    totalAmount: 5000,
    paidAmount: 0,
    balance: 5000,
    age: 3,
    status: 'pending',
    approvedBy: 'Admin Head'
  }]

};

const PAYMENT_HISTORY: Record<string, PaymentHistory[]> = {
  v1: [
  { id: 'PAY-101', date: '2024-02-28', amount: 18500, mode: 'NEFT', reference: 'UTR123456789', status: 'success' },
  { id: 'PAY-089', date: '2024-01-30', amount: 15200, mode: 'Cheque', reference: 'CHQ-456789', status: 'success' },
  { id: 'PAY-075', date: '2024-01-05', amount: 12000, mode: 'NEFT', reference: 'UTR987654321', status: 'success' }],

  v2: [
  { id: 'PAY-098', date: '2024-03-05', amount: 8200, mode: 'UPI', reference: 'UPI-REF-123', status: 'success' },
  { id: 'PAY-082', date: '2024-02-10', amount: 5500, mode: 'Cash', reference: 'CASH-REC-45', status: 'success' }],

  v3: [
  { id: 'PAY-095', date: '2024-02-15', amount: 25000, mode: 'NEFT', reference: 'UTR456789012', status: 'success' },
  { id: 'PAY-078', date: '2024-01-20', amount: 18000, mode: 'Cheque', reference: 'CHQ-789012', status: 'success' }]

};

const BANK_ACCOUNTS = [
{
  id: 'ba1',
  name: 'HDFC Main Operating Account',
  accountNo: '50100123400129',
  bank: 'HDFC Bank',
  branch: 'MG Road, Mumbai',
  balance: 1250000,
  type: 'Current'
},
{
  id: 'ba2',
  name: 'SBI Fee Collection Account',
  accountNo: '38109876549982',
  bank: 'State Bank of India',
  branch: 'Andheri West, Mumbai',
  balance: 3450000,
  type: 'Current'
},
{
  id: 'ba3',
  name: 'ICICI Expense Account',
  accountNo: '602301234567',
  bank: 'ICICI Bank',
  branch: 'Bandra, Mumbai',
  balance: 850000,
  type: 'Current'
}];


const PAYMENT_MODES = [
{ id: 'cash', icon: Banknote, label: 'Cash', description: 'Physical cash payment' },
{ id: 'cheque', icon: FileText, label: 'Cheque', description: 'Bank cheque/DD' },
{ id: 'neft', icon: Globe, label: 'NEFT/RTGS', description: 'Bank transfer' },
{ id: 'upi', icon: Smartphone, label: 'UPI', description: 'UPI payment' },
{ id: 'dd', icon: Receipt, label: 'Demand Draft', description: 'Bank DD' }];


export function ExpensePayment() {
  // --- State ---
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState('neft');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [partialPayments, setPartialPayments] = useState<Record<string, number>>({});
  const [showVendorDetails, setShowVendorDetails] = useState(true);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showTdsSection, setShowTdsSection] = useState(false);
  const [tdsRate, setTdsRate] = useState(0);
  const [narration, setNarration] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [schedulePayment, setSchedulePayment] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Get selected vendor
  const selectedVendor = useMemo(() => {
    return VENDORS.find((v) => v.id === selectedVendorId);
  }, [selectedVendorId]);

  // Get unpaid vouchers for selected vendor
  const unpaidVouchers = useMemo(() => {
    return selectedVendorId ? UNPAID_VOUCHERS[selectedVendorId] || [] : [];
  }, [selectedVendorId]);

  // Get payment history for selected vendor
  const paymentHistory = useMemo(() => {
    return selectedVendorId ? PAYMENT_HISTORY[selectedVendorId] || [] : [];
  }, [selectedVendorId]);

  // Get selected bank account details
  const selectedBank = useMemo(() => {
    return BANK_ACCOUNTS.find((b) => b.id === selectedBankAccount);
  }, [selectedBankAccount]);

  // Calculate totals
  const calculations = useMemo(() => {
    let grossAmount = 0;
    let selectedCount = 0;

    unpaidVouchers.forEach((voucher) => {
      if (selectedVouchers.includes(voucher.id)) {
        selectedCount++;
        const partialAmount = partialPayments[voucher.id];
        if (partialAmount !== undefined && partialAmount > 0) {
          grossAmount += partialAmount;
        } else {
          grossAmount += voucher.balance;
        }
      }
    });

    const tdsAmount = grossAmount * (tdsRate / 100);
    const netPayable = grossAmount - tdsAmount;

    return {
      grossAmount,
      tdsAmount,
      netPayable,
      selectedCount
    };
  }, [selectedVouchers, partialPayments, unpaidVouchers, tdsRate]);

  // Handlers
  const handleVendorChange = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setSelectedVouchers([]);
    setPartialPayments({});
    setShowVendorDetails(true);
  };

  const toggleVoucher = (id: string) => {
    setSelectedVouchers((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVouchers(unpaidVouchers.map((v) => v.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handlePartialPayment = (voucherId: string, amount: number) => {
    const voucher = unpaidVouchers.find((v) => v.id === voucherId);
    if (voucher && amount >= 0 && amount <= voucher.balance) {
      setPartialPayments((prev) => ({
        ...prev,
        [voucherId]: amount
      }));
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleProcessPayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowConfirmation(true);
  };

  const validatePayment = (): boolean => {
    if (!selectedVendorId) {
      alert('Please select a vendor');
      return false;
    }
    if (selectedVouchers.length === 0) {
      alert('Please select at least one voucher to pay');
      return false;
    }
    if (!selectedBankAccount) {
      alert('Please select a bank account');
      return false;
    }
    if (paymentMode === 'cheque' && (!chequeNo || !chequeDate)) {
      alert('Please enter cheque details');
      return false;
    }
    if (paymentMode !== 'cash' && paymentMode !== 'cheque' && !transactionRef) {
      alert('Please enter transaction reference');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setSelectedVouchers([]);
    setPartialPayments({});
    setChequeNo('');
    setChequeDate('');
    setTransactionRef('');
    setNarration('');
    setTdsRate(0);
    setSchedulePayment(false);
    setScheduledDate('');
    setShowConfirmation(false);
  };

  const getStatusBadge = (status: Voucher['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'partial':
        return <Badge variant="info">Partial</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
    }
  };

  const getAgingColor = (age: number) => {
    if (age <= 7) return 'text-green-600';
    if (age <= 15) return 'text-yellow-600';
    if (age <= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  // Table columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      onChange={(e) => handleSelectAll(e.target.checked)}
      checked={selectedVouchers.length === unpaidVouchers.length && unpaidVouchers.length > 0} />,


    render: (row: Voucher) =>
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={selectedVouchers.includes(row.id)}
      onChange={() => toggleVoucher(row.id)} />


  },
  {
    key: 'voucher',
    header: 'Voucher',
    render: (row: Voucher) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-gray-900">{row.id}</span>
            {getStatusBadge(row.status)}
          </div>
          <div className="text-xs text-gray-500">
            {row.date} • Due: {row.dueDate}
          </div>
        </div>

  },
  {
    key: 'head',
    header: 'Expense Details',
    render: (row: Voucher) =>
    <div className="space-y-1">
          <span className="text-sm font-medium text-gray-900">{row.head}</span>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.description}</p>
          <p className="text-xs text-gray-400">Approved by: {row.approvedBy}</p>
        </div>

  },
  {
    key: 'amount',
    header: 'Bill Amount',
    render: (row: Voucher) =>
    <div className="text-right space-y-1">
          <span className="text-sm font-medium text-gray-900">₹{row.totalAmount.toLocaleString()}</span>
          {row.paidAmount > 0 &&
      <p className="text-xs text-green-600">Paid: ₹{row.paidAmount.toLocaleString()}</p>
      }
        </div>

  },
  {
    key: 'balance',
    header: 'Balance Due',
    render: (row: Voucher) =>
    <div className="text-right">
          <span className="text-sm font-bold text-red-600">₹{row.balance.toLocaleString()}</span>
          <p className={`text-xs font-medium ${getAgingColor(row.age)}`}>{row.age} days old</p>
        </div>

  },
  {
    key: 'paying',
    header: 'Paying Now',
    render: (row: Voucher) =>
    <div className="w-32">
          {selectedVouchers.includes(row.id) ?
      <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
          type="number"
          min="0"
          max={row.balance}
          className="w-full pl-7 pr-2 py-1.5 border border-blue-300 rounded-lg text-sm text-right font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
          value={partialPayments[row.id] ?? row.balance}
          onChange={(e) => handlePartialPayment(row.id, parseFloat(e.target.value) || 0)} />

            </div> :

      <span className="text-sm text-gray-400">—</span>
      }
        </div>

  }];


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Payment</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Settle outstanding bills and record payments to vendors
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="info" className="px-4 py-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Outward Remittance
              </Badge>
              <Button variant="outline">
                <History className="w-4 h-4 mr-2" />
                Payment History
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{VENDORS.length}</p>
                <p className="text-xs text-gray-500">Active Vendors</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {Object.values(UNPAID_VOUCHERS).flat().length}
                </p>
                <p className="text-xs text-gray-500">Pending Vouchers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {Object.values(UNPAID_VOUCHERS).flat().filter((v) => v.status === 'overdue').length}
                </p>
                <p className="text-xs text-gray-500">Overdue Bills</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{(VENDORS.reduce((sum, v) => sum + v.totalOutstanding, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-500">Total Outstanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Vendor Selection */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vendor Selection Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h2 className="font-semibold text-gray-900">Select Vendor</h2>
                  </div>
                  <button
                    onClick={() => setActiveInfoModal('vendor')}
                    className="p-1.5 hover:bg-gray-100 rounded-full">

                    <Info className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Select
                    className="pl-10"
                    options={VENDORS.map((v) => ({
                      value: v.id,
                      label: `${v.name} (${v.code})`
                    }))}
                    placeholder="Search vendor by name or code..."
                    value={selectedVendorId || ''}
                    onChange={(e: any) => handleVendorChange(e.target.value)} />

                </div>

                {/* Vendor Details */}
                {selectedVendor &&
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Vendor Header */}
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{selectedVendor.name}</h4>
                            <p className="text-xs text-indigo-600 font-medium">{selectedVendor.code}</p>
                          </div>
                        </div>
                        <button
                        onClick={() => setShowVendorDetails(!showVendorDetails)}
                        className="p-1 hover:bg-indigo-100 rounded">

                          {showVendorDetails ?
                        <ChevronUp className="w-4 h-4 text-gray-500" /> :

                        <ChevronDown className="w-4 h-4 text-gray-500" />
                        }
                        </button>
                      </div>

                      {showVendorDetails &&
                    <div className="mt-4 pt-4 border-t border-indigo-200 space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span>GSTIN:</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs">{selectedVendor.gstin}</span>
                              <button
                            onClick={() => handleCopy(selectedVendor.gstin, 'gstin')}
                            className="p-1 hover:bg-indigo-100 rounded">

                                {copiedText === 'gstin' ?
                            <CheckCircle className="w-3 h-3 text-green-600" /> :

                            <Copy className="w-3 h-3 text-gray-400" />
                            }
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <FileText className="w-3 h-3 text-gray-400" />
                              <span>PAN:</span>
                            </div>
                            <span className="font-mono text-xs">{selectedVendor.pan}</span>

                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>Location:</span>
                            </div>
                            <span className="text-xs">{selectedVendor.city}</span>

                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>Phone:</span>
                            </div>
                            <span className="text-xs">{selectedVendor.phone}</span>

                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>Email:</span>
                            </div>
                            <span className="text-xs truncate">{selectedVendor.email}</span>
                          </div>
                        </div>
                    }
                    </div>

                    {/* Beneficiary Bank Details */}
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Landmark className="w-4 h-4 text-green-600" />
                        <h5 className="text-sm font-semibold text-green-900">Beneficiary Bank Details</h5>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-medium">{selectedVendor.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">A/C No:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{selectedVendor.bankAccount}</span>
                            <button
                            onClick={() => handleCopy(selectedVendor.bankAccount, 'account')}
                            className="p-1 hover:bg-green-100 rounded">

                              {copiedText === 'account' ?
                            <CheckCircle className="w-3 h-3 text-green-600" /> :

                            <Copy className="w-3 h-3 text-gray-400" />
                            }
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">IFSC:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{selectedVendor.ifsc}</span>
                            <button
                            onClick={() => handleCopy(selectedVendor.ifsc, 'ifsc')}
                            className="p-1 hover:bg-green-100 rounded">

                              {copiedText === 'ifsc' ?
                            <CheckCircle className="w-3 h-3 text-green-600" /> :

                            <Copy className="w-3 h-3 text-gray-400" />
                            }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
                        <p className="text-lg font-bold text-red-700">
                          ₹{selectedVendor.totalOutstanding.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-600">Total Outstanding</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className="text-lg font-bold text-gray-700">
                          ₹{selectedVendor.lastPaymentAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Last Payment</p>
                      </div>
                    </div>

                    {/* Payment History Toggle */}
                    <button
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                      <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <History className="w-4 h-4" />
                        Recent Payments
                      </span>
                      {showPaymentHistory ?
                    <ChevronUp className="w-4 h-4 text-gray-500" /> :

                    <ChevronDown className="w-4 h-4 text-gray-500" />
                    }
                    </button>

                    {showPaymentHistory &&
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        {paymentHistory.map((payment) =>
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                            <div>
                              <p className="text-sm font-medium text-gray-900">{payment.id}</p>
                              <p className="text-xs text-gray-500">
                                {payment.date} • {payment.mode}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-600">
                                ₹{payment.amount.toLocaleString()}
                              </p>
                              <Badge
                          variant={payment.status === 'success' ? 'success' : 'warning'}
                          className="text-xs">

                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                    )}
                      </div>
                  }
                  </div>
                }

                {!selectedVendor &&
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Select a vendor to view details</p>
                    <p className="text-gray-400 text-xs mt-1">and load outstanding bills</p>
                  </div>
                }
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-slate-300">Payment Summary</h3>
                <Calculator className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Selected Vouchers</span>
                  <span className="font-semibold">{calculations.selectedCount}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Gross Amount</span>
                  <span className="font-semibold">₹{calculations.grossAmount.toLocaleString()}</span>
                </div>

                {calculations.tdsAmount > 0 &&
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">TDS Deduction ({tdsRate}%)</span>
                    <span className="font-semibold text-orange-400">
                      -₹{calculations.tdsAmount.toLocaleString()}
                    </span>
                  </div>
                }

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">Net Payable</span>
                    <span className="text-3xl font-bold text-indigo-400">
                      ₹{calculations.netPayable.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedBank &&
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Paying From</p>
                    <p className="text-sm font-medium">{selectedBank.name}</p>
                    <p className="text-xs text-slate-400">
                      Balance: ₹{selectedBank.balance.toLocaleString()}
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Right Column - Vouchers & Payment Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Unpaid Vouchers Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Outstanding Vouchers</h2>
                      <p className="text-xs text-gray-500">Select bills to settle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedVouchers.length > 0 &&
                    <Badge variant="success">
                        {selectedVouchers.length} selected
                      </Badge>
                    }
                    <button
                      onClick={() => setActiveInfoModal('vouchers')}
                      className="p-1.5 hover:bg-gray-100 rounded-full">

                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {selectedVendorId ?
              unpaidVouchers.length > 0 ?
              <div className="overflow-x-auto">
                    <Table columns={columns} data={unpaidVouchers} />
                  </div> :

              <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Settled!</h3>
                    <p className="text-gray-500 text-sm">
                      No outstanding bills for this vendor
                    </p>
                  </div> :


              <div className="p-12 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Vendor</h3>
                  <p className="text-gray-500 text-sm">
                    Choose a vendor from the left panel to load outstanding bills
                  </p>
                </div>
              }
            </div>

            {/* Payment Details Form */}
            <div
              className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
              calculations.selectedCount > 0 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`
              }>

              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Payment Details</h2>
                      <p className="text-xs text-gray-500">Enter transaction information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveInfoModal('payment')}
                    className="p-1.5 hover:bg-gray-100 rounded-full">

                    <Info className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Payment Mode Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Payment Mode</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PAYMENT_MODES.map((mode) =>
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMode(mode.id)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMode === mode.id ?
                      'border-indigo-600 bg-indigo-50 shadow-sm' :
                      'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`
                      }>

                        <mode.icon
                        className={`w-6 h-6 mb-2 ${
                        paymentMode === mode.id ? 'text-indigo-600' : 'text-gray-400'}`
                        } />

                        <span
                        className={`text-sm font-medium ${
                        paymentMode === mode.id ? 'text-indigo-700' : 'text-gray-600'}`
                        }>

                          {mode.label}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">{mode.description}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Bank Account Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Source Bank Account <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={BANK_ACCOUNTS.map((b) => ({
                          value: b.id,
                          label: `${b.name} (${b.accountNo.slice(-4)})`
                        }))}
                        placeholder="Select bank account..."
                        value={selectedBankAccount}
                        onChange={(e: any) => setSelectedBankAccount(e.target.value)} />

                      {selectedBank &&
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{selectedBank.bank}</span>
                            <span className="font-medium text-blue-700">
                              Bal: ₹{selectedBank.balance.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            A/C: {selectedBank.accountNo} • {selectedBank.branch}
                          </p>
                        </div>
                      }
                    </div>

                    {/* TDS Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">TDS Deduction</label>
                        <button
                          onClick={() => setShowTdsSection(!showTdsSection)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">

                          {showTdsSection ?
                          <>
                              <X className="w-3 h-3" /> Remove TDS
                            </> :

                          <>
                              <Plus className="w-3 h-3" /> Apply TDS
                            </>
                          }
                        </button>
                      </div>

                      {showTdsSection &&
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3 animate-in fade-in">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">TDS Rate (%)</label>
                              <Select
                              options={[
                              { value: '0', label: 'No TDS' },
                              { value: '1', label: '1% - Contractor' },
                              { value: '2', label: '2% - Contractor' },
                              { value: '5', label: '5% - Rent' },
                              { value: '10', label: '10% - Professional' }]
                              }
                              value={String(tdsRate)}
                              onChange={(e: any) => setTdsRate(parseFloat(e.target.value))} />

                            </div>
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">TDS Amount</label>
                              <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-orange-600">
                                ₹{calculations.tdsAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-yellow-700 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            TDS will be deducted from gross amount before payment
                          </p>
                        </div>
                      }
                    </div>

                    {/* Narration */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Payment Narration
                      </label>
                      <textarea
                        placeholder="Enter payment purpose or notes..."
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3} />

                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Payment Mode Specific Fields */}
                    {paymentMode === 'cheque' &&
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Cheque Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                            placeholder="6-digit number"
                            value={chequeNo}
                            onChange={(e) => setChequeNo(e.target.value)} />

                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Cheque Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                            type="date"
                            value={chequeDate}
                            onChange={(e) => setChequeDate(e.target.value)} />

                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700">
                            Ensure cheque details match the physical cheque leaf. Post-dated cheques
                            will be tracked separately.
                          </p>
                        </div>
                      </div>
                    }

                    {paymentMode === 'dd' &&
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              DD Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                            placeholder="DD number"
                            value={chequeNo}
                            onChange={(e) => setChequeNo(e.target.value)} />

                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              DD Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                            type="date"
                            value={chequeDate}
                            onChange={(e) => setChequeDate(e.target.value)} />

                          </div>
                        </div>
                      </div>
                    }

                    {(paymentMode === 'neft' || paymentMode === 'upi') &&
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Transaction Reference <span className="text-red-500">*</span>
                          </label>
                          <Input
                          placeholder={paymentMode === 'neft' ? 'UTR Number' : 'UPI Reference ID'}
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)} />

                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700">
                            Enter the exact reference number from your bank portal for reconciliation.
                          </p>
                        </div>
                      </div>
                    }

                    {paymentMode === 'cash' &&
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 animate-in fade-in">
                        <div className="flex items-start gap-3">
                          <Banknote className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-900">Cash Payment</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              Cash receipt will be generated after recording the payment. Ensure
                              vendor acknowledges receipt.
                            </p>
                          </div>
                        </div>
                      </div>
                    }

                    {/* Schedule Payment */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="schedule"
                          checked={schedulePayment}
                          onChange={(e) => setSchedulePayment(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        <label htmlFor="schedule" className="text-sm font-medium text-gray-700">
                          Schedule for later
                        </label>
                      </div>

                      {schedulePayment &&
                      <div className="animate-in fade-in">
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Scheduled Date
                          </label>
                          <Input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]} />

                        </div>
                      }
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <Button
                        variant="primary"
                        className="w-full py-4 text-base font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
                        onClick={handleProcessPayment}
                        disabled={isProcessing || calculations.selectedCount === 0}>

                        {isProcessing ?
                        <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Processing Payment...
                          </> :
                        schedulePayment ?
                        <>
                            <Clock className="w-5 h-5 mr-2" />
                            Schedule Payment of ₹{calculations.netPayable.toLocaleString()}
                          </> :

                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Record Payment of ₹{calculations.netPayable.toLocaleString()}
                          </>
                        }
                      </Button>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={resetForm}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Payment Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Before Payment</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Verify vendor bank details
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Check for applicable TDS
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Confirm bank account balance
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">During Payment</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Enter correct reference numbers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Double-check amount before submit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Add clear narration for records
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">After Payment</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Download payment voucher
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Verify in bank statement
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Attach proof if available
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showConfirmation &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Recorded!</h2>
            <p className="text-gray-600 mb-6">
              Payment of ₹{calculations.netPayable.toLocaleString()} has been successfully recorded
              for {selectedVendor?.name}.
            </p>
            <div className="p-4 bg-gray-50 rounded-xl mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono font-medium">PAY-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                <Printer className="w-4 h-4 mr-2" />
                Print Voucher
              </Button>
              <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setShowConfirmation(false);
                resetForm();
              }}>

                New Payment
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Info Modal */}
      <InfoModal
        isOpen={activeInfoModal === 'vendor'}
        onClose={() => setActiveInfoModal(null)}
        title="Vendor Selection"
        description="Select the vendor/payee to whom you want to make the payment. The system will automatically load all outstanding bills for the selected vendor."
        dataSource={[
        'Vendor Master Database',
        'Accounts Payable Ledger',
        'KYC Documents Repository']
        }
        whyItMatters={[
        'Accurate vendor selection ensures correct payment routing',
        'Bank details are auto-populated from verified records',
        'Payment history helps in decision making']
        }
        actions={[{ label: 'View Vendor Master', action: () => {} }]} />


      <InfoModal
        isOpen={activeInfoModal === 'vouchers'}
        onClose={() => setActiveInfoModal(null)}
        title="Outstanding Vouchers"
        description="List of all approved but unpaid expense vouchers for the selected vendor. You can select multiple vouchers for bulk payment or make partial payments."
        dataSource={[
        'Expense Voucher System',
        'Approval Workflow Records',
        'Payment History Tracking']
        }
        whyItMatters={[
        'Aging analysis helps prioritize overdue payments',
        'Partial payment support for large bills',
        'Full audit trail of all payments']
        }
        actions={[{ label: 'View Aging Report', action: () => {} }]} />


      <InfoModal
        isOpen={activeInfoModal === 'payment'}
        onClose={() => setActiveInfoModal(null)}
        title="Payment Details"
        description="Enter the payment transaction details. Choose the appropriate payment mode and provide reference numbers for bank reconciliation."
        dataSource={[
        'Bank Account Master',
        'Payment Gateway Integration',
        'TDS Rate Configuration']
        }
        whyItMatters={[
        'Correct reference numbers enable automatic reconciliation',
        'TDS deduction ensures tax compliance',
        'Payment narration helps in audits']
        }
        actions={[{ label: 'View Bank Accounts', action: () => {} }]} />

    </div>);

}

// Helper component for Plus icon (not in original imports)
function Plus({ className }: {className?: string;}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">

      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>);

}