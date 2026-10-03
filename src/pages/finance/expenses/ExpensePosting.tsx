// src/features/expenses/components/ExpensePosting.tsx

import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  BookLock,
  CalendarRange,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Lock,
  Landmark,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Calendar,
  Hash,
  CheckSquare,
  XCircle,
  Search,
  AlertCircle,
  Printer,
  FileSpreadsheet } from
'lucide-react';

// --- Enhanced Types ---
interface ExpenseRecord {
  id: string;
  voucherNo: string;
  date: string;
  payee: string;
  expenseHead: string;
  amount: number;
  status: 'Approved' | 'Posted';
  approvedBy?: string;
  approvedDate?: string;
  department?: string;
  paymentMode?: string;
  description?: string;
  glCode?: string;
}

interface PostingLog {
  id: string;
  timestamp: string;
  recordsPosted: number;
  totalAmount: number;
  postedBy: string;
}

interface FilterOptions {
  searchTerm: string;
  department: string;
  expenseHead: string;
  minAmount: string;
  maxAmount: string;
}

// --- Mock Data with Enhanced Details ---
const PENDING_EXPENSES: ExpenseRecord[] = [
{
  id: '1',
  voucherNo: 'EXP-24-005',
  date: '2024-04-05',
  payee: 'City Power Corporation Ltd.',
  expenseHead: 'Electricity Charges',
  amount: 45000,
  status: 'Approved',
  approvedBy: 'John Doe',
  approvedDate: '2024-04-06',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Monthly electricity bill for office premises',
  glCode: 'EXP-5001'
},
{
  id: '2',
  voucherNo: 'EXP-24-006',
  date: '2024-04-08',
  payee: 'ABC Stationers & Office Supplies',
  expenseHead: 'Office Stationery',
  amount: 12500,
  status: 'Approved',
  approvedBy: 'Jane Smith',
  approvedDate: '2024-04-09',
  department: 'HR',
  paymentMode: 'Cash',
  description: 'Office supplies for Q2 2024',
  glCode: 'EXP-5002'
},
{
  id: '3',
  voucherNo: 'EXP-24-008',
  date: '2024-04-12',
  payee: 'Fresh Foods Catering Services',
  expenseHead: 'Canteen Supplies',
  amount: 8500,
  status: 'Approved',
  approvedBy: 'John Doe',
  approvedDate: '2024-04-13',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Weekly canteen supplies and refreshments',
  glCode: 'EXP-5003'
},
{
  id: '4',
  voucherNo: 'EXP-24-010',
  date: '2024-04-15',
  payee: 'Global Tech Solutions Pvt. Ltd.',
  expenseHead: 'IT Maintenance',
  amount: 25000,
  status: 'Approved',
  approvedBy: 'Sarah Wilson',
  approvedDate: '2024-04-16',
  department: 'IT',
  paymentMode: 'Bank Transfer',
  description: 'Server maintenance and software updates',
  glCode: 'EXP-5004'
},
{
  id: '5',
  voucherNo: 'EXP-24-012',
  date: '2024-04-18',
  payee: 'Employee Reimbursement - Rajesh Kumar',
  expenseHead: 'Travel Allowance',
  amount: 3200,
  status: 'Approved',
  approvedBy: 'Jane Smith',
  approvedDate: '2024-04-19',
  department: 'Sales',
  paymentMode: 'Cash',
  description: 'Client meeting travel expenses',
  glCode: 'EXP-5005'
},
{
  id: '6',
  voucherNo: 'EXP-24-014',
  date: '2024-04-20',
  payee: 'Municipal Water Services',
  expenseHead: 'Water & Sewerage',
  amount: 6800,
  status: 'Approved',
  approvedBy: 'John Doe',
  approvedDate: '2024-04-21',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Monthly water charges',
  glCode: 'EXP-5006'
},
{
  id: '7',
  voucherNo: 'EXP-24-016',
  date: '2024-04-22',
  payee: 'Security Guard Services Ltd.',
  expenseHead: 'Security Services',
  amount: 18500,
  status: 'Approved',
  approvedBy: 'Sarah Wilson',
  approvedDate: '2024-04-23',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Monthly security services contract',
  glCode: 'EXP-5007'
},
{
  id: '8',
  voucherNo: 'EXP-24-018',
  date: '2024-04-25',
  payee: 'Professional Cleaners Co.',
  expenseHead: 'Cleaning & Sanitation',
  amount: 9200,
  status: 'Approved',
  approvedBy: 'John Doe',
  approvedDate: '2024-04-26',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Weekly office cleaning services',
  glCode: 'EXP-5008'
}];


const POSTED_EXPENSES: ExpenseRecord[] = [
{
  id: '101',
  voucherNo: 'EXP-24-001',
  date: '2024-04-01',
  payee: 'Office Rent Corp',
  expenseHead: 'Rent Expense',
  amount: 75000,
  status: 'Posted',
  approvedBy: 'Sarah Wilson',
  approvedDate: '2024-04-02',
  department: 'Administration',
  paymentMode: 'Bank Transfer',
  description: 'Monthly office rent',
  glCode: 'EXP-5009'
},
{
  id: '102',
  voucherNo: 'EXP-24-003',
  date: '2024-04-03',
  payee: 'Telecom Services',
  expenseHead: 'Telephone & Internet',
  amount: 15000,
  status: 'Posted',
  approvedBy: 'John Doe',
  approvedDate: '2024-04-04',
  department: 'IT',
  paymentMode: 'Bank Transfer',
  description: 'Monthly internet and phone services',
  glCode: 'EXP-5010'
}];


const POSTING_HISTORY: PostingLog[] = [
{ id: '1', timestamp: '2024-03-31 15:30:00', recordsPosted: 12, totalAmount: 245000, postedBy: 'Admin User' },
{ id: '2', timestamp: '2024-03-15 14:20:00', recordsPosted: 8, totalAmount: 156000, postedBy: 'Admin User' },
{ id: '3', timestamp: '2024-02-29 16:45:00', recordsPosted: 15, totalAmount: 320000, postedBy: 'Finance Manager' }];


export function ExpensePosting() {
  // --- State Management ---
  const [fromDate, setFromDate] = useState('2024-04-01');
  const [toDate, setToDate] = useState('2024-04-30');
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([...PENDING_EXPENSES, ...POSTED_EXPENSES]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [isPosting, setIsPosting] = useState(false);
  const [postingComplete, setPostingComplete] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showPostedRecords, setShowPostedRecords] = useState(false);
  const [showPostingHistory, setShowPostingHistory] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    department: '',
    expenseHead: '',
    minAmount: '',
    maxAmount: ''
  });

  // --- Derived Data with Enhanced Filtering ---
  const unpostedRecords = useMemo(() => {
    let filtered = expenses.filter((exp) =>
    exp.status === 'Approved' &&
    exp.date >= fromDate &&
    exp.date <= toDate
    );

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((exp) =>
      exp.voucherNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      exp.payee.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      exp.expenseHead.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter((exp) => exp.department === filters.department);
    }

    // Apply expense head filter
    if (filters.expenseHead) {
      filtered = filtered.filter((exp) => exp.expenseHead === filters.expenseHead);
    }

    // Apply amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter((exp) => exp.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter((exp) => exp.amount <= parseFloat(filters.maxAmount));
    }

    return filtered;
  }, [expenses, fromDate, toDate, filters]);

  const postedRecords = useMemo(() => {
    return expenses.filter((exp) =>
    exp.status === 'Posted' &&
    exp.date >= fromDate &&
    exp.date <= toDate
    );
  }, [expenses, fromDate, toDate]);

  const recordsToPost = useMemo(() => {
    if (selectedRecords.size === 0) return unpostedRecords;
    return unpostedRecords.filter((rec) => selectedRecords.has(rec.id));
  }, [unpostedRecords, selectedRecords]);

  const totalValue = recordsToPost.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnposted = unpostedRecords.reduce((acc, curr) => acc + curr.amount, 0);

  // Get unique departments and expense heads for filters
  const uniqueDepartments = useMemo(() =>
  Array.from(new Set(expenses.map((e) => e.department).filter(Boolean))),
  [expenses]
  );

  const uniqueExpenseHeads = useMemo(() =>
  Array.from(new Set(expenses.map((e) => e.expenseHead))),
  [expenses]
  );

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedRecords.size === unpostedRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(unpostedRecords.map((r) => r.id)));
    }
  };

  const handleSelectRecord = (id: string) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePost = () => {
    if (recordsToPost.length === 0) return;

    const confirmPost = window.confirm(
      `⚠️ POSTING CONFIRMATION\n\n` +
      `You are about to POST ${recordsToPost.length} expense record(s)\n` +
      `Total Amount: ₹${totalValue.toLocaleString()}\n\n` +
      `This will:\n` +
      `• Update General Ledger entries\n` +
      `• Lock these records from editing\n` +
      `• Update financial statements\n\n` +
      `This action CANNOT be undone.\n\n` +
      `Do you want to proceed?`
    );

    if (confirmPost) {
      setIsPosting(true);

      // Simulate API call with processing delay
      setTimeout(() => {
        setExpenses((prev) => prev.map((exp) =>
        recordsToPost.find((u) => u.id === exp.id) ?
        { ...exp, status: 'Posted' } :
        exp
        ));
        setSelectedRecords(new Set());
        setIsPosting(false);
        setPostingComplete(true);

        // Reset success message after 4 seconds
        setTimeout(() => setPostingComplete(false), 4000);
      }, 2000);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      department: '',
      expenseHead: '',
      minAmount: '',
      maxAmount: ''
    });
    setSelectedRecords(new Set());
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleExportToExcel = () => {
    alert('Exporting records to Excel... (Feature in development)');
  };

  const handlePrintReport = () => {
    window.print();
  };

  // --- Enhanced Table Columns ---
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      checked={selectedRecords.size === unpostedRecords.length && unpostedRecords.length > 0}
      onChange={handleSelectAll}
      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />,


    render: (row: ExpenseRecord) =>
    <input
      type="checkbox"
      checked={selectedRecords.has(row.id)}
      onChange={() => handleSelectRecord(row.id)}
      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />


  },
  {
    key: 'expand',
    header: '',
    render: (row: ExpenseRecord) =>
    <button
      onClick={() => toggleRowExpansion(row.id)}
      className="p-1 hover:bg-gray-100 rounded transition-colors">

          {expandedRow === row.id ?
      <ChevronUp className="w-4 h-4 text-gray-500" /> :

      <ChevronDown className="w-4 h-4 text-gray-500" />
      }
        </button>

  },
  {
    key: 'voucher',
    header: 'Voucher Details',
    render: (row: ExpenseRecord) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-gray-400" />
            <span className="font-bold text-gray-900 font-mono text-sm">{row.voucherNo}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

  },
  {
    key: 'payee',
    header: 'Payee / Vendor',
    render: (row: ExpenseRecord) =>
    <div className="max-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate" title={row.payee}>
              {row.payee}
            </span>
          </div>
          {row.department &&
      <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">
              {row.department}
            </Badge>
      }
        </div>

  },
  {
    key: 'head',
    header: 'Expense Head',
    render: (row: ExpenseRecord) =>
    <div className="space-y-1">
          <Badge variant="secondary" className="text-xs font-semibold bg-purple-50 text-purple-700">
            {row.expenseHead}
          </Badge>
          {row.glCode &&
      <div className="text-[10px] text-gray-500 font-mono">
              GL: {row.glCode}
            </div>
      }
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: ExpenseRecord) =>
    <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-bold text-gray-900 text-base">
              ₹{row.amount.toLocaleString('en-IN')}
            </span>
          </div>
          {row.paymentMode &&
      <div className="text-[10px] text-gray-500 mt-1">
              via {row.paymentMode}
            </div>
      }
        </div>

  },
  {
    key: 'approval',
    header: 'Approval Info',
    render: (row: ExpenseRecord) =>
    <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span>{row.approvedBy}</span>
          </div>
          {row.approvedDate &&
      <div className="text-[10px] text-gray-500">
              {new Date(row.approvedDate).toLocaleDateString('en-IN')}
            </div>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ExpenseRecord) =>
    <Badge
      variant={row.status === 'Posted' ? 'success' : 'warning'}
      className="font-semibold">

          {row.status === 'Posted' ?
      <Lock className="w-3 h-3 mr-1" /> :

      <Clock className="w-3 h-3 mr-1" />
      }
          {row.status}
        </Badge>

  }];


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <BookLock className="w-8 h-8 text-indigo-600" />
            </div>
            Expense Posting & GL Integration
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Finalize approved expenses and automatically update General Ledger (GL) accounts & financial statements
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPostingHistory(!showPostingHistory)}>

            <Clock className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintReport}>

            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToExcel}>

            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Posting History Modal */}
      {showPostingHistory &&
      <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Posting History
            </h3>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPostingHistory(false)}>

              <XCircle className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {POSTING_HISTORY.map((log) =>
          <div key={log.id} className="bg-white rounded-lg p-3 border border-blue-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {log.recordsPosted} records posted
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    By {log.postedBy} on {log.timestamp}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₹{log.totalAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
                Pending Posting
              </p>
              <p className="text-3xl font-black text-gray-900">{unpostedRecords.length}</p>
              <p className="text-xs text-amber-600 mt-1">
                ₹{totalUnposted.toLocaleString('en-IN')}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-amber-300" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
                Already Posted
              </p>
              <p className="text-3xl font-black text-gray-900">{postedRecords.length}</p>
              <p className="text-xs text-green-600 mt-1">
                ₹{postedRecords.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-300" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                Selected for Posting
              </p>
              <p className="text-3xl font-black text-gray-900">{recordsToPost.length}</p>
              <p className="text-xs text-blue-600 mt-1">
                ₹{totalValue.toLocaleString('en-IN')}
              </p>
            </div>
            <CheckSquare className="w-12 h-12 text-blue-300" />
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">
                Date Range
              </p>
              <p className="text-sm font-bold text-gray-900">{fromDate}</p>
              <p className="text-sm font-bold text-gray-900">to {toDate}</p>
            </div>
            <CalendarRange className="w-12 h-12 text-purple-300" />
          </div>
        </Card>
      </div>

      {/* Enhanced Date Filter & Search */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white" />

            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                To Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white" />

            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm">

                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) =>
                <option key={dept} value={dept}>{dept}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Expense Head
              </label>
              <select
                value={filters.expenseHead}
                onChange={(e) => setFilters({ ...filters, expenseHead: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm">

                <option value="">All Categories</option>
                {uniqueExpenseHeads.map((head) =>
                <option key={head} value={head}>{head}</option>
                )}
              </select>
            </div>
          </div>

          {/* Search and Amount Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search voucher, payee, or category..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10 bg-white" />

              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Min Amount
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                className="bg-white" />

            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Max Amount
              </label>
              <Input
                type="number"
                placeholder="999999"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                className="bg-white" />

            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              {Object.values(filters).some((v) => v !== '') &&
              <span className="flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  Active filters applied
                </span>
              }
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}>

                <RefreshCw className="w-3 h-3 mr-2" />
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPostedRecords(!showPostedRecords)}>

                <Eye className="w-3 h-3 mr-2" />
                {showPostedRecords ? 'Hide' : 'Show'} Posted Records
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      {unpostedRecords.length > 0 ?
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
          {/* Left Sidebar: GL Summary & Information */}
          <div className="lg:col-span-1 space-y-4">
            {/* Posting Summary */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 relative overflow-hidden shadow-lg">
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 text-amber-800 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-wide">Ready to Post</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-amber-700 uppercase font-bold mb-1">Total Records</p>
                    <p className="text-4xl font-black text-gray-900">{recordsToPost.length}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      of {unpostedRecords.length} pending
                    </p>
                  </div>
                  
                  <div className="border-t border-amber-200 pt-4">
                    <p className="text-xs text-amber-700 uppercase font-bold mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-gray-900">
                      ₹{totalValue.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {selectedRecords.size > 0 &&
                <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4" />
                        <span className="font-semibold">
                          {selectedRecords.size} record(s) selected
                        </span>
                      </div>
                    </div>
                }
                </div>
              </div>
              
              {/* Decorative Background */}
              <BookLock className="absolute -right-6 -bottom-6 w-40 h-40 text-amber-100 opacity-30 rotate-12" />
            </Card>

            {/* GL Impact Information */}
            <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                  GL Impact
                </h4>
              </div>
              <div className="space-y-3 text-xs text-gray-700">
                <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Debit Entry</p>
                      <p className="text-xs leading-relaxed">
                        Respective Expense Head Ledger accounts will be debited
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0 rotate-180" />
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Credit Entry</p>
                      <p className="text-xs leading-relaxed">
                        Accounts Payable or Bank accounts will be credited
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Warning Notice */}
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-bold text-red-900 uppercase">
                    Important Notice
                  </p>
                  <ul className="text-xs text-red-800 space-y-1 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Posted entries cannot be edited or deleted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>GL balances will be updated immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Reversal requires separate journal entry</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4 bg-gray-50 border-gray-200">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                Quick Statistics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Amount:</span>
                  <span className="font-bold text-gray-900">
                    ₹{recordsToPost.length > 0 ? Math.round(totalValue / recordsToPost.length).toLocaleString('en-IN') : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Highest:</span>
                  <span className="font-bold text-gray-900">
                    ₹{recordsToPost.length > 0 ? Math.max(...recordsToPost.map((r) => r.amount)).toLocaleString('en-IN') : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lowest:</span>
                  <span className="font-bold text-gray-900">
                    ₹{recordsToPost.length > 0 ? Math.min(...recordsToPost.map((r) => r.amount)).toLocaleString('en-IN') : 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Enhanced Data Table */}
          <div className="lg:col-span-3">
            <Card className="p-0 border-2 border-gray-200 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="p-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Unposted Approved Vouchers
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Review and select records to post to General Ledger
                    </p>
                  </div>
                  <Badge
                  variant="warning"
                  className="text-xs font-bold px-3 py-1">

                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Action Required
                  </Badge>
                </div>

                {selectedRecords.size > 0 &&
              <div className="mt-3 flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-900">
                      {selectedRecords.size} record(s) selected for posting
                    </span>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecords(new Set())}
                  className="ml-auto text-indigo-600 hover:text-indigo-700">

                      Clear Selection
                    </Button>
                  </div>
              }
              </div>

              {/* Table Body */}
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0 z-10 border-b-2 border-gray-200">
                    <tr>
                      {columns.map((col, index) =>
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">

                          {typeof col.header === 'function' ? col.header() : col.header}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {unpostedRecords.map((row, index) =>
                  <React.Fragment key={row.id}>
                        <tr
                      className={`
                            transition-all hover:bg-indigo-50
                            ${selectedRecords.has(row.id) ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}
                            ${index % 2 === 0 ? 'bg-gray-50/50' : ''}
                          `}>

                          {columns.map((col, colIndex) =>
                      <td key={colIndex} className="px-4 py-4">
                              {col.render(row)}
                            </td>
                      )}
                        </tr>

                        {/* Expanded Row Details */}
                        {expandedRow === row.id &&
                    <tr className="bg-blue-50 border-l-4 border-l-blue-500">
                            <td colSpan={columns.length} className="px-6 py-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                  <Info className="w-4 h-4 text-blue-600" />
                                  <h4 className="text-sm font-bold text-blue-900">
                                    Transaction Details
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                                      Full Description
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {row.description || 'No description provided'}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                                      Payment Method
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {row.paymentMode || 'Not specified'}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                                      GL Account Code
                                    </p>
                                    <p className="text-sm font-mono text-gray-900">
                                      {row.glCode || 'Auto-assigned'}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                                      Department
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {row.department || 'General'}
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-bold text-green-900 mb-1">
                                        Approval Information
                                      </p>
                                      <p className="text-xs text-green-700">
                                        Approved by {row.approvedBy} on {row.approvedDate}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                    }
                      </React.Fragment>
                  )}
                  </tbody>
                </table>

                {unpostedRecords.length === 0 &&
              <div className="text-center py-12">
                    <Filter className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">
                      No records match your filters
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search criteria
                    </p>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-4">

                      Clear All Filters
                    </Button>
                  </div>
              }
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center lg:text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Total Amount for Posting
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-black text-green-400">
                        ₹{totalValue.toLocaleString('en-IN')}
                      </p>
                      <span className="text-sm text-gray-400">
                        ({recordsToPost.length} record{recordsToPost.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      This will create {recordsToPost.length * 2} GL entries (debit + credit)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
                    onClick={() => {
                      setFromDate('2024-04-01');
                      setToDate('2024-04-30');
                      setSelectedRecords(new Set());
                      handleClearFilters();
                    }}>

                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>

                    <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePost}
                    disabled={isPosting || recordsToPost.length === 0}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-10 py-6 text-base font-bold shadow-2xl shadow-indigo-950 disabled:opacity-50 disabled:cursor-not-allowed">

                      {isPosting ?
                    <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Posting to GL...
                        </> :

                    <>
                          <Lock className="w-5 h-5 mr-2" />
                          Post {recordsToPost.length} to Accounts
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    }
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posted Records Section */}
            {showPostedRecords && postedRecords.length > 0 &&
          <Card className="mt-6 p-6 bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Posted Records (Read-Only)
                  </h3>
                  <Badge variant="success" className="font-semibold">
                    {postedRecords.length} Records
                  </Badge>
                </div>
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-900">Voucher</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-900">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-900">Payee</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-900">Category</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-green-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100">
                      {postedRecords.map((record) =>
                  <tr key={record.id} className="hover:bg-green-50">
                          <td className="px-4 py-2 font-mono text-xs">{record.voucherNo}</td>
                          <td className="px-4 py-2 text-xs">{record.date}</td>
                          <td className="px-4 py-2 text-xs">{record.payee}</td>
                          <td className="px-4 py-2">
                            <Badge variant="secondary" className="text-xs">{record.expenseHead}</Badge>
                          </td>
                          <td className="px-4 py-2 text-right font-bold">₹{record.amount.toLocaleString('en-IN')}</td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
              </Card>
          }
          </div>
        </div> :

      // Enhanced Empty State
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-dashed border-gray-200">
          {postingComplete ?
        <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50" />
                <CheckCircle2 className="w-24 h-24 text-green-500 relative mx-auto animate-bounce" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">
                Posting Complete!
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                All selected records have been successfully posted to the General Ledger
              </p>
              <div className="bg-white rounded-xl p-6 border-2 border-green-200 inline-block">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold">Records Posted</p>
                    <p className="text-2xl font-black text-green-600">{recordsToPost.length}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                    <p className="text-2xl font-black text-green-600">₹{totalValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-center">
                <Button
              variant="outline"
              onClick={() => {
                setPostingComplete(false);
                setFromDate('2024-04-01');
                setToDate('2024-04-30');
              }}>

                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check for More Records
                </Button>
                <Button
              variant="primary"
              onClick={handlePrintReport}
              className="bg-green-600 hover:bg-green-700">

                  <Printer className="w-4 h-4 mr-2" />
                  Print Confirmation
                </Button>
              </div>
            </div> :

        <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gray-200 rounded-full blur-3xl opacity-30" />
                <CalendarRange className="w-24 h-24 text-gray-300 relative mx-auto" />
              </div>
              <h3 className="text-2xl font-black text-gray-400 mb-2">
                No Pending Records
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                There are no approved expenses pending posting for the selected date range.
                Try adjusting your filters or date range.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
              variant="outline"
              onClick={handleClearFilters}>

                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                <Button
              variant="outline"
              onClick={() => setShowPostedRecords(!showPostedRecords)}>

                  <Eye className="w-4 h-4 mr-2" />
                  View Posted Records
                </Button>
              </div>
            </div>
        }
        </div>
      }
    </div>);

}