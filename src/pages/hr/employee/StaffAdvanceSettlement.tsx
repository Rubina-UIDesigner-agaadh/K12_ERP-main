import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Receipt,
  Wallet,
  UserCheck,
  Plus,
  Trash2,
  Save,
  Calculator,
  AlertCircle,
  ArrowDownCircle,
  FileText,
  CheckCircle2,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  History,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Building2,
  Phone,
  Mail,
  Hash,
  Camera,
  Upload,
  Eye,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  Database,
  HelpCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Banknote,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileCheck,
  Paperclip,
  Image,
  Send,
  RotateCcw,
  Tag,
  MessageSquare,
  Briefcase,
  MapPin,
  DollarSign,
  PieChart,
  BarChart3,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';

// --- Types ---
interface Employee {
  id: string;
  name: string;
  employeeCode: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  pendingAdvance: number;
  advanceDate: string;
  advancePurpose: string;
  originalAdvance: number;
  settledAmount: number;
  settlementCount: number;
  lastSettlement: string;
  status: 'pending' | 'partial' | 'overdue';
  dueDate: string;
}

interface BillEntry {
  id: number;
  date: string;
  billNo: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  hasReceipt: boolean;
  receiptFile?: File;
  receiptPreview?: string;
}

interface SettlementHistory {
  id: string;
  date: string;
  time: string;
  employee: string;
  type: 'bills' | 'cash' | 'mixed';
  billsAmount: number;
  cashReturned: number;
  status: 'completed' | 'partial' | 'pending_approval';
  processedBy: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  dataSource: string[];
  whyItMatters: string[];
}

// --- Info Modal Component ---
function InfoModal({ isOpen, onClose, title, description, dataSource, whyItMatters }: InfoModalProps) {
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
const EMPLOYEES: Employee[] = [
{
  id: 'EMP001',
  name: 'Coach Rohan Kumar',
  employeeCode: 'EMP-1045',
  department: 'Sports & Activities',
  designation: 'Sports Coach',
  phone: '+91 98765 43210',
  email: 'rohan.kumar@school.edu',
  pendingAdvance: 5000,
  advanceDate: '2024-03-15',
  advancePurpose: 'Sports equipment purchase for inter-school tournament',
  originalAdvance: 5000,
  settledAmount: 0,
  settlementCount: 0,
  lastSettlement: '-',
  status: 'pending',
  dueDate: '2024-03-22'
},
{
  id: 'EMP002',
  name: 'Mr. David Wilson',
  employeeCode: 'EMP-1123',
  department: 'Science Lab',
  designation: 'Lab Technician',
  phone: '+91 87654 32109',
  email: 'david.wilson@school.edu',
  pendingAdvance: 1200,
  advanceDate: '2024-03-18',
  advancePurpose: 'Lab chemicals and supplies for practical exams',
  originalAdvance: 3000,
  settledAmount: 1800,
  settlementCount: 1,
  lastSettlement: '2024-03-20',
  status: 'partial',
  dueDate: '2024-03-25'
},
{
  id: 'EMP003',
  name: 'Ms. Anjali Sharma',
  employeeCode: 'EMP-0892',
  department: 'Administration',
  designation: 'Admin Officer',
  phone: '+91 76543 21098',
  email: 'anjali.sharma@school.edu',
  pendingAdvance: 2500,
  advanceDate: '2024-03-10',
  advancePurpose: 'Office supplies and stationery',
  originalAdvance: 2500,
  settledAmount: 0,
  settlementCount: 0,
  lastSettlement: '-',
  status: 'overdue',
  dueDate: '2024-03-17'
},
{
  id: 'EMP004',
  name: 'Ms. Priya Menon',
  employeeCode: 'EMP-0756',
  department: 'Library',
  designation: 'Librarian',
  phone: '+91 65432 10987',
  email: 'priya.menon@school.edu',
  pendingAdvance: 800,
  advanceDate: '2024-03-20',
  advancePurpose: 'Book binding and repair materials',
  originalAdvance: 800,
  settledAmount: 0,
  settlementCount: 0,
  lastSettlement: '-',
  status: 'pending',
  dueDate: '2024-03-27'
}];


const EXPENSE_CATEGORIES = [
{ value: 'supplies', label: 'Supplies & Materials' },
{ value: 'transport', label: 'Transport & Conveyance' },
{ value: 'refreshments', label: 'Refreshments' },
{ value: 'maintenance', label: 'Maintenance & Repairs' },
{ value: 'printing', label: 'Printing & Stationery' },
{ value: 'equipment', label: 'Equipment Purchase' },
{ value: 'services', label: 'Services' },
{ value: 'other', label: 'Other Expenses' }];


const SETTLEMENT_HISTORY: SettlementHistory[] = [
{
  id: 'SET-001',
  date: '2024-03-20',
  time: '11:30 AM',
  employee: 'Mr. David Wilson',
  type: 'bills',
  billsAmount: 1800,
  cashReturned: 0,
  status: 'completed',
  processedBy: 'Ms. Sunita Verma'
},
{
  id: 'SET-002',
  date: '2024-03-18',
  time: '03:15 PM',
  employee: 'Coach Vikram Singh',
  type: 'mixed',
  billsAmount: 4200,
  cashReturned: 800,
  status: 'completed',
  processedBy: 'Ms. Sunita Verma'
},
{
  id: 'SET-003',
  date: '2024-03-15',
  time: '10:00 AM',
  employee: 'Ms. Neha Gupta',
  type: 'cash',
  billsAmount: 0,
  cashReturned: 1500,
  status: 'completed',
  processedBy: 'Mr. Rajesh Kumar'
}];


const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export function StaffAdvanceSettlement() {
  // --- State ---
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [activeTab, setActiveTab] = useState<'bills' | 'cash'>('bills');
  const [cashReturned, setCashReturned] = useState(0);
  const [bills, setBills] = useState<BillEntry[]>([
  { id: Date.now(), date: '', billNo: '', description: '', vendor: '', category: '', amount: 0, hasReceipt: false }]
  );
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(true);
  const [showDenominations, setShowDenominations] = useState(false);
  const [denominations, setDenominations] = useState<{denomination: number;count: number;}[]>(
    DENOMINATIONS.map((d) => ({ denomination: d, count: 0 }))
  );
  const [settlementRemarks, setSettlementRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'settlement' | 'history'>('settlement');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [requiresApproval, setRequiresApproval] = useState(false);

  // Find selected employee details
  const selectedEmployee = useMemo(() => {
    return EMPLOYEES.find((e) => e.id === selectedEmpId);
  }, [selectedEmpId]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPendingAdvances = EMPLOYEES.reduce((sum, e) => sum + e.pendingAdvance, 0);
    const employeesWithAdvance = EMPLOYEES.filter((e) => e.pendingAdvance > 0).length;
    const overdueAdvances = EMPLOYEES.filter((e) => e.status === 'overdue').length;
    const settlementsToday = SETTLEMENT_HISTORY.filter(
      (s) => s.date === new Date().toISOString().split('T')[0]
    ).length;

    return {
      totalPendingAdvances,
      employeesWithAdvance,
      overdueAdvances,
      settlementsToday
    };
  }, []);

  // Calculations
  const totalBillsAmount = useMemo(() => bills.reduce((sum, b) => sum + (b.amount || 0), 0), [bills]);
  const denominationTotal = useMemo(
    () => denominations.reduce((sum, d) => sum + d.denomination * d.count, 0),
    [denominations]
  );
  const effectiveCashReturned = showDenominations ? denominationTotal : cashReturned;
  const pendingAdvance = selectedEmployee?.pendingAdvance || 0;
  const netBalance = pendingAdvance - totalBillsAmount - effectiveCashReturned;
  const totalSettlement = totalBillsAmount + effectiveCashReturned;

  // Bills with receipts count
  const billsWithReceipts = useMemo(() => bills.filter((b) => b.hasReceipt).length, [bills]);
  const validBills = useMemo(() => bills.filter((b) => b.amount > 0 && b.description).length, [bills]);

  // Handlers
  const handleEmployeeChange = (empId: string) => {
    setSelectedEmpId(empId);
    setShowEmployeeDetails(true);
    // Reset form
    setBills([
    { id: Date.now(), date: '', billNo: '', description: '', vendor: '', category: '', amount: 0, hasReceipt: false }]
    );
    setCashReturned(0);
    setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, count: 0 })));
    setSettlementRemarks('');
  };

  const addBillRow = () => {
    setBills([
    ...bills,
    { id: Date.now(), date: '', billNo: '', description: '', vendor: '', category: '', amount: 0, hasReceipt: false }]
    );
  };

  const removeBillRow = (id: number) => {
    if (bills.length > 1) {
      setBills(bills.filter((b) => b.id !== id));
    } else {
      // Reset last row instead of removing
      setBills([
      { id: Date.now(), date: '', billNo: '', description: '', vendor: '', category: '', amount: 0, hasReceipt: false }]
      );
    }
  };

  const duplicateBillRow = (bill: BillEntry) => {
    const newBill: BillEntry = {
      ...bill,
      id: Date.now(),
      billNo: '',
      amount: 0
    };
    const index = bills.findIndex((b) => b.id === bill.id);
    const newBills = [...bills];
    newBills.splice(index + 1, 0, newBill);
    setBills(newBills);
  };

  const updateBill = (id: number, field: keyof BillEntry, value: any) => {
    setBills(bills.map((b) => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleReceiptUpload = (billId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBills(
          bills.map((b) =>
          b.id === billId ?
          { ...b, hasReceipt: true, receiptFile: file, receiptPreview: reader.result as string } :
          b
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = (billId: number) => {
    setBills(
      bills.map((b) =>
      b.id === billId ? { ...b, hasReceipt: false, receiptFile: undefined, receiptPreview: undefined } : b
      )
    );
  };

  const updateDenomination = (denomination: number, count: number) => {
    if (count < 0) return;
    setDenominations((prev) =>
    prev.map((d) => d.denomination === denomination ? { ...d, count } : d)
    );
  };

  const autoCalculateDenominations = () => {
    if (!cashReturned || cashReturned <= 0) return;

    let remaining = cashReturned;
    const newDenominations: {denomination: number;count: number;}[] = [];

    for (const denom of DENOMINATIONS) {
      const count = Math.floor(remaining / denom);
      newDenominations.push({ denomination: denom, count });
      remaining = remaining % denom;
    }

    setDenominations(newDenominations);
    setShowDenominations(true);
  };

  const clearDenominations = () => {
    setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, count: 0 })));
  };

  const validateSettlement = (): boolean => {
    if (!selectedEmpId) {
      alert('Please select an employee');
      return false;
    }
    if (totalBillsAmount === 0 && effectiveCashReturned === 0) {
      alert('Please enter bills or cash to settle');
      return false;
    }
    if (showDenominations && denominationTotal !== cashReturned && cashReturned > 0) {
      alert('Denomination total does not match the cash amount');
      return false;
    }
    return true;
  };

  const handleSettle = async () => {
    if (!validateSettlement()) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowConfirmation(true);
  };

  const resetForm = () => {
    setSelectedEmpId('');
    setBills([
    { id: Date.now(), date: '', billNo: '', description: '', vendor: '', category: '', amount: 0, hasReceipt: false }]
    );
    setCashReturned(0);
    setDenominations(DENOMINATIONS.map((d) => ({ denomination: d, count: 0 })));
    setSettlementRemarks('');
    setShowConfirmation(false);
    setShowDenominations(false);
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'partial':
        return <Badge variant="info">Partial</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
    }
  };

  const getSettlementStatusBadge = (status: SettlementHistory['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'partial':
        return <Badge variant="info">Partial</Badge>;
      case 'pending_approval':
        return <Badge variant="warning">Pending Approval</Badge>;
    }
  };

  const generateSettlementId = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `SET-${month}${day}-XXX`;
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <UserCheck className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Advance Settlement</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Clear pending advances by submitting expense bills or returning unused cash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('settlement')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'settlement' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
                  }>

                  <ClipboardCheck className="w-4 h-4 mr-2 inline" />
                  New Settlement
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`
                  }>

                  <History className="w-4 h-4 mr-2 inline" />
                  History
                </button>
              </div>

              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  ₹{stats.totalPendingAdvances.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.employeesWithAdvance}</p>
                <p className="text-xs text-gray-500">Staff with Advances</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{stats.overdueAdvances}</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.settlementsToday}</p>
                <p className="text-xs text-gray-500">Settled Today</p>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'settlement' ? (
        /* Settlement Form View */
        <>
            {/* Employee Selection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h2 className="font-semibold text-gray-900">Select Employee</h2>
                  </div>
                  <button
                  onClick={() => setActiveInfoModal('employee')}
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
                  options={EMPLOYEES.filter((e) => e.pendingAdvance > 0).map((e) => ({
                    value: e.id,
                    label: `${e.name} (${e.department}) - ₹${e.pendingAdvance.toLocaleString()} pending`
                  }))}
                  placeholder="Search employee by name or department..."
                  value={selectedEmpId}
                  onChange={(e: any) => handleEmployeeChange(e.target.value)} />

                </div>

                {/* Employee Details Card */}
                {selectedEmployee &&
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div
                  className={`p-4 rounded-xl border ${
                  selectedEmployee.status === 'overdue' ?
                  'bg-red-50 border-red-200' :
                  selectedEmployee.status === 'partial' ?
                  'bg-blue-50 border-blue-200' :
                  'bg-orange-50 border-orange-100'}`
                  }>

                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-orange-600 font-bold text-xl shadow-sm">
                            {selectedEmployee.name.
                        split(' ').
                        map((n) => n[0]).
                        join('').
                        slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">{selectedEmployee.name}</h4>
                              {getStatusBadge(selectedEmployee.status)}
                            </div>
                            <p className="text-sm text-gray-600">{selectedEmployee.designation}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedEmployee.department} • {selectedEmployee.employeeCode}
                            </p>
                          </div>
                        </div>
                        <button
                      onClick={() => setShowEmployeeDetails(!showEmployeeDetails)}
                      className="p-1 hover:bg-white/50 rounded">

                          {showEmployeeDetails ?
                      <ChevronUp className="w-4 h-4 text-gray-500" /> :

                      <ChevronDown className="w-4 h-4 text-gray-500" />
                      }
                        </button>
                      </div>

                      {showEmployeeDetails &&
                  <div className="mt-4 pt-4 border-t border-orange-200 space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{selectedEmployee.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="truncate">{selectedEmployee.email}</span>
                            </div>
                          </div>

                          {/* Advance Details */}
                          <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Advance Details
                            </h5>
                            <p className="text-sm text-gray-700">{selectedEmployee.advancePurpose}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Issued: {selectedEmployee.advanceDate}</span>
                              <span>Due: {selectedEmployee.dueDate}</span>
                              {selectedEmployee.status === 'overdue' &&
                        <span className="text-red-600 font-medium">
                                  {getDaysOverdue(selectedEmployee.dueDate)} days overdue
                                </span>
                        }
                            </div>
                          </div>
                        </div>
                  }
                    </div>

                    {/* Advance Summary Cards */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{selectedEmployee.originalAdvance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Original Advance</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-xl font-bold text-green-600">
                          ₹{selectedEmployee.settledAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Already Settled</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-xl font-bold text-orange-600">
                          ₹{selectedEmployee.pendingAdvance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pending Balance</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-xl font-bold text-blue-600">{selectedEmployee.settlementCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Settlements Done</p>
                      </div>
                    </div>
                  </div>
              }

                {!selectedEmpId &&
              <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Select an employee to start settlement</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {EMPLOYEES.filter((e) => e.pendingAdvance > 0).length} employees with pending advances
                    </p>
                  </div>
              }
              </div>
            </div>

            {/* Settlement Form - Only show if employee selected */}
            {selectedEmpId &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Workspace */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                          <h2 className="font-semibold text-gray-900">Settlement Method</h2>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {generateSettlementId()}
                        </Badge>
                      </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-6 pt-4">
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                      onClick={() => setActiveTab('bills')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === 'bills' ?
                      'bg-white text-orange-600 shadow-sm' :
                      'text-gray-500 hover:text-gray-700'}`
                      }>

                          <Receipt className="w-4 h-4" />
                          Submit Bills
                          {totalBillsAmount > 0 &&
                      <Badge variant="success" className="ml-2 text-xs">
                              ₹{totalBillsAmount.toLocaleString()}
                            </Badge>
                      }
                        </button>
                        <button
                      onClick={() => setActiveTab('cash')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === 'cash' ?
                      'bg-white text-orange-600 shadow-sm' :
                      'text-gray-500 hover:text-gray-700'}`
                      }>

                          <Wallet className="w-4 h-4" />
                          Return Cash
                          {effectiveCashReturned > 0 &&
                      <Badge variant="info" className="ml-2 text-xs">
                              ₹{effectiveCashReturned.toLocaleString()}
                            </Badge>
                      }
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {activeTab === 'bills' ?
                  <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-700">Expense Vouchers</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {validBills} of {bills.length} entries completed •{' '}
                                {billsWithReceipts} with receipts
                              </p>
                            </div>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={addBillRow}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50">

                              <Plus className="w-4 h-4 mr-1" />
                              Add Row
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {bills.map((bill, index) =>
                      <div
                        key={bill.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">

                                {/* Row Header */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-500">
                                    Bill #{index + 1}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                              onClick={() => duplicateBillRow(bill)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Duplicate row">

                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                              onClick={() => removeBillRow(bill.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove row">

                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-12 gap-3">
                                  <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                      Date
                                    </label>
                                    <Input
                              type="date"
                              value={bill.date}
                              onChange={(e) => updateBill(bill.id, 'date', e.target.value)} />

                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                      Bill No.
                                    </label>
                                    <Input
                              placeholder="INV-XXX"
                              value={bill.billNo}
                              onChange={(e) => updateBill(bill.id, 'billNo', e.target.value)} />

                                  </div>
                                  <div className="col-span-3">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                      Vendor
                                    </label>
                                    <Input
                              placeholder="Shop/Vendor name"
                              value={bill.vendor}
                              onChange={(e) => updateBill(bill.id, 'vendor', e.target.value)} />

                                  </div>
                                  <div className="col-span-3">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                      Category
                                    </label>
                                    <Select
                              options={EXPENSE_CATEGORIES}
                              placeholder="Select..."
                              value={bill.category}
                              onChange={(e: any) => updateBill(bill.id, 'category', e.target.value)} />

                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                      Amount
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        ₹
                                      </span>
                                      <Input
                                type="number"
                                className="pl-7 font-semibold"
                                placeholder="0.00"
                                value={bill.amount || ''}
                                onChange={(e) =>
                                updateBill(bill.id, 'amount', parseFloat(e.target.value) || 0)
                                } />

                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                                    Description
                                  </label>
                                  <Input
                            placeholder="What was this expense for?"
                            value={bill.description}
                            onChange={(e) => updateBill(bill.id, 'description', e.target.value)} />

                                </div>

                                {/* Receipt Upload */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                  {bill.hasReceipt ?
                          <div className="flex items-center gap-3">
                                      {bill.receiptPreview &&
                            <img
                              src={bill.receiptPreview}
                              alt="Receipt"
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200" />

                            }
                                      <div>
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                          <CheckCircle className="w-4 h-4" />
                                          <span>Receipt attached</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                          {bill.receiptFile?.name}
                                        </p>
                                      </div>
                                      <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-gray-100 rounded">
                                          <Eye className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                onClick={() => removeReceipt(bill.id)}
                                className="p-1.5 hover:bg-red-100 rounded text-red-500">

                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div> :

                          <div className="flex items-center gap-3">
                                      <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Camera className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Attach Receipt</span>
                                        <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleReceiptUpload(bill.id, e)} />

                                      </label>
                                      {bill.amount > 200 &&
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" />
                                          Receipt recommended
                                        </span>
                            }
                                    </div>
                          }

                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{(bill.amount || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                      )}
                          </div>

                          {/* Bills Total */}
                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <span className="font-semibold text-green-800">Total Bills Amount</span>
                            <span className="text-2xl font-bold text-green-700">
                              ₹{totalBillsAmount.toLocaleString()}
                            </span>
                          </div>
                        </div> :

                  <div className="space-y-6">
                          <div className="max-w-md mx-auto py-8 text-center space-y-6">
                            <div className="inline-flex p-4 bg-orange-50 rounded-full text-orange-600">
                              <ArrowDownCircle className="w-16 h-16" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">Return Unused Cash</h3>
                              <p className="text-sm text-gray-500 mt-2">
                                Enter the amount of physical cash being returned to the safe
                              </p>
                            </div>
                            <div className="relative max-w-[250px] mx-auto">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-2xl">
                                ₹
                              </span>
                              <input
                          type="number"
                          className="w-full pl-12 pr-4 py-4 text-3xl font-black text-center border-2 border-orange-200 rounded-2xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          placeholder="0.00"
                          value={cashReturned || ''}
                          onChange={(e) => setCashReturned(parseFloat(e.target.value) || 0)} />

                            </div>
                          </div>

                          {/* Denomination Breakdown */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">
                                Denomination Breakdown
                              </label>
                              <div className="flex gap-2">
                                <Button
                            variant="ghost"
                            size="sm"
                            onClick={autoCalculateDenominations}
                            disabled={!cashReturned}>

                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto Fill
                                </Button>
                                <button
                            onClick={() => setShowDenominations(!showDenominations)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">

                                  {showDenominations ? 'Hide' : 'Show'} Details
                                  {showDenominations ?
                            <ChevronUp className="w-3 h-3" /> :

                            <ChevronDown className="w-3 h-3" />
                            }
                                </button>
                              </div>
                            </div>

                            {showDenominations &&
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in">
                                <div className="grid grid-cols-5 gap-3">
                                  {denominations.map((d) =>
                          <div key={d.denomination} className="text-center">
                                      <div className="p-2 bg-white rounded-lg border border-gray-200 mb-2">
                                        <span className="text-xs font-bold text-gray-700">
                                          ₹{d.denomination}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                onClick={() =>
                                updateDenomination(d.denomination, d.count - 1)
                                }
                                className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center">

                                          <span className="text-gray-600">-</span>
                                        </button>
                                        <input
                                type="number"
                                min="0"
                                value={d.count}
                                onChange={(e) =>
                                updateDenomination(
                                  d.denomination,
                                  parseInt(e.target.value) || 0
                                )
                                }
                                className="w-10 h-6 text-center text-xs border border-gray-200 rounded" />

                                        <button
                                onClick={() =>
                                updateDenomination(d.denomination, d.count + 1)
                                }
                                className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center">

                                          <span className="text-gray-600">+</span>
                                        </button>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        = ₹{(d.denomination * d.count).toLocaleString()}
                                      </p>
                                    </div>
                          )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    Denomination Total
                                  </span>
                                  <span
                            className={`text-lg font-bold ${
                            denominationTotal === cashReturned || !cashReturned ?
                            'text-green-600' :
                            'text-red-600'}`
                            }>

                                    ₹{denominationTotal.toLocaleString()}
                                    {denominationTotal !== cashReturned && cashReturned > 0 &&
                            <span className="text-xs text-red-500 ml-2">
                                        (Mismatch:{' '}
                                        {denominationTotal > cashReturned ? '+' : ''}
                                        {(denominationTotal - cashReturned).toLocaleString()})
                                      </span>
                            }
                                  </span>
                                </div>
                              </div>
                      }
                          </div>

                          {/* Cash Total */}
                          {effectiveCashReturned > 0 &&
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                              <span className="font-semibold text-blue-800">Cash Being Returned</span>
                              <span className="text-2xl font-bold text-blue-700">
                                ₹{effectiveCashReturned.toLocaleString()}
                              </span>
                            </div>
                    }
                        </div>
                  }

                      {/* Settlement Remarks */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Settlement Remarks (Optional)
                        </label>
                        <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={2}
                      placeholder="Add any notes about this settlement..."
                      value={settlementRemarks}
                      onChange={(e) => setSettlementRemarks(e.target.value)} />

                      </div>
                    </div>
                  </div>
                </div>

                {/* Settlement Summary Sidebar */}
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                      <Calculator className="w-32 h-32" />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                      Settlement Summary
                    </h3>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Advance Issued</span>
                        <span className="font-bold">₹{pendingAdvance.toLocaleString()}</span>
                      </div>

                      {totalBillsAmount > 0 &&
                  <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Bills Submitted</span>
                          <span className="font-bold text-green-400">
                            - ₹{totalBillsAmount.toLocaleString()}
                          </span>
                        </div>
                  }

                      {effectiveCashReturned > 0 &&
                  <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cash Returned</span>
                          <span className="font-bold text-blue-400">
                            - ₹{effectiveCashReturned.toLocaleString()}
                          </span>
                        </div>
                  }

                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs font-semibold text-orange-400 uppercase">
                              {netBalance === 0 ?
                          'Fully Settled' :
                          netBalance > 0 ?
                          'Remaining Balance' :
                          'Amount to Pay Employee'}
                            </p>
                            <h2
                          className={`text-3xl font-black ${
                          netBalance === 0 ?
                          'text-green-400' :
                          netBalance < 0 ?
                          'text-red-400' :
                          'text-white'}`
                          }>

                              ₹{Math.abs(netBalance).toLocaleString()}
                            </h2>
                          </div>
                          {netBalance === 0 &&
                      <Badge variant="success" className="mb-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready to Close
                            </Badge>
                      }
                        </div>
                      </div>

                      {/* Settlement Breakdown */}
                      {totalSettlement > 0 &&
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Total Settlement</span>
                            <span className="font-bold text-orange-400">
                              ₹{totalSettlement.toLocaleString()}
                            </span>
                          </div>
                        </div>
                  }
                    </div>
                  </div>

                  {/* Validation Messages */}
                  <div className="space-y-3">
                    {netBalance > 0 && totalSettlement > 0 &&
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 leading-relaxed">
                          <strong>Partial Settlement:</strong> ₹{netBalance.toLocaleString()} will
                          remain as pending advance for {selectedEmployee?.name}.
                        </p>
                      </div>
                }

                    {netBalance < 0 &&
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 leading-relaxed">
                          <strong>Reimbursement Required:</strong> Bills exceed advance by ₹
                          {Math.abs(netBalance).toLocaleString()}. Employee needs to be paid this
                          amount from petty cash.
                        </p>
                      </div>
                }

                    {netBalance === 0 && totalSettlement > 0 &&
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700 leading-relaxed">
                          <strong>Perfect Match:</strong> Advance will be fully settled. No pending
                          balance.
                        </p>
                      </div>
                }
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                  variant="primary"
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-base font-bold shadow-lg shadow-orange-100"
                  onClick={handleSettle}
                  disabled={isProcessing || totalSettlement === 0}>

                      {isProcessing ?
                  <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </> :

                  <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          {netBalance === 0 ? 'Settle & Close' : 'Record Settlement'}
                        </>
                  }
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full" onClick={resetForm}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                    </div>
                  </div>

                  {/* Settlement Guidelines */}
                  <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Settlement Guidelines</h4>
                        <ul className="space-y-1.5 text-sm text-amber-700">
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                            <span>All bills must have proper documentation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                            <span>Receipt required for expenses above ₹200</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                            <span>Cash must be counted and verified</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                            <span>Employee signature required on voucher</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
          </>) : (

        /* History View */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Settlement History</h2>
              <div className="flex items-center gap-3">
                <Select
                className="w-40"
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Completed' },
                { value: 'partial', label: 'Partial' },
                { value: 'pending_approval', label: 'Pending Approval' }]
                }
                value={historyFilter}
                onChange={(e: any) => setHistoryFilter(e.target.value)} />

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Settlement ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date/Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Bills
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Cash
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Processed By
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SETTLEMENT_HISTORY.map((settlement) =>
                <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {settlement.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <span className="text-sm text-gray-900">{settlement.date}</span>
                          <p className="text-xs text-gray-500">{settlement.time}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{settlement.employee}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                      variant={
                      settlement.type === 'bills' ?
                      'success' :
                      settlement.type === 'cash' ?
                      'info' :
                      'warning'
                      }
                      className="capitalize">

                          {settlement.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {settlement.billsAmount > 0 ?
                    <span className="text-sm font-medium text-green-600">
                            ₹{settlement.billsAmount.toLocaleString()}
                          </span> :

                    <span className="text-gray-400">-</span>
                    }
                      </td>
                      <td className="px-4 py-4 text-right">
                        {settlement.cashReturned > 0 ?
                    <span className="text-sm font-medium text-blue-600">
                            ₹{settlement.cashReturned.toLocaleString()}
                          </span> :

                    <span className="text-gray-400">-</span>
                    }
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getSettlementStatusBadge(settlement.status)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{settlement.processedBy}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {SETTLEMENT_HISTORY.length} settlements
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>)
        }

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Settlement Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Bill Submission</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Enter all expense details with dates
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Attach receipts for amounts {'>'}₹200
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Include vendor/shop names
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cash Return</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Count cash in presence of employee
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Verify denomination breakdown
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Deposit to designated safe
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Finalization</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Get employee signature on voucher
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Print settlement receipt
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      File documents for audit
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settlement Recorded!</h2>
            <p className="text-gray-600 mb-6">
              {netBalance === 0 ?
            `Advance for ${selectedEmployee?.name} has been fully settled.` :
            `₹${totalSettlement.toLocaleString()} has been settled for ${selectedEmployee?.name}. ₹${Math.abs(netBalance).toLocaleString()} ${netBalance > 0 ? 'remains pending' : 'to be reimbursed'}.`}
            </p>
            <div className="p-4 bg-gray-50 rounded-xl mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Settlement ID</span>
                <span className="font-mono font-medium">{generateSettlementId()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Bills Amount</span>
                <span className="font-medium">₹{totalBillsAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Cash Returned</span>
                <span className="font-medium">₹{effectiveCashReturned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-500">Status</span>
                <Badge variant={netBalance === 0 ? 'success' : 'info'}>
                  {netBalance === 0 ? 'Fully Settled' : 'Partial Settlement'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print Voucher
              </Button>
              <Button
              variant="primary"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={resetForm}>

                New Settlement
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Info Modals */}
      <InfoModal
        isOpen={activeInfoModal === 'employee'}
        onClose={() => setActiveInfoModal(null)}
        title="Employee Selection"
        description="Select the staff member whose advance needs to be settled. Only employees with pending advances are shown."
        dataSource={[
        'Staff Advance Register',
        'Petty Cash Issue Records',
        'HR Employee Database']
        }
        whyItMatters={[
        'Ensures correct advance allocation',
        'Tracks individual settlement history',
        'Maintains accountability per employee']
        } />

    </div>);

}