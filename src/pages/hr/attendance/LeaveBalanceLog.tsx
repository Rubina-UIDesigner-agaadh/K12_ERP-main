import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Users,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  BookOpen,
  Coffee,
  Heart,
  Briefcase,
  Baby,
  Sun,
  GraduationCap,
  CalendarCheck,
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Settings,
  Shield } from
'lucide-react';

interface LeaveTransaction {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  transactionDate: string;
  leaveType: 'sick' | 'casual' | 'paid' | 'earned' | 'maternity' | 'compensatory';
  transactionType: 'credit' | 'debit';
  quantity: number;
  reason: string;
  performedBy: string;
  performedByRole: string;
  balanceBefore: number;
  balanceAfter: number;
  remarks: string | null;
  referenceId: string | null;
  createdAt: string;
}

const leaveTypeOptions = [
{ value: 'all', label: 'All Leave Types' },
{ value: 'sick', label: 'Sick Leave' },
{ value: 'casual', label: 'Casual Leave' },
{ value: 'paid', label: 'Paid Leave' },
{ value: 'earned', label: 'Earned Leave' },
{ value: 'maternity', label: 'Maternity Leave' },
{ value: 'compensatory', label: 'Compensatory Off' }];


const transactionTypeOptions = [
{ value: 'all', label: 'All Types' },
{ value: 'credit', label: 'Credit' },
{ value: 'debit', label: 'Debit' }];


const employees = [
{ id: 'EMP001', name: 'Dr. Rajesh Kumar', avatar: 'RK', department: 'Mathematics' },
{ id: 'EMP002', name: 'Mrs. Priya Sharma', avatar: 'PS', department: 'Science' },
{ id: 'EMP003', name: 'Mr. Amit Patel', avatar: 'AP', department: 'Science' },
{ id: 'EMP004', name: 'Ms. Sneha Reddy', avatar: 'SR', department: 'English' },
{ id: 'EMP005', name: 'Dr. Vikram Singh', avatar: 'VS', department: 'Biology' },
{ id: 'EMP006', name: 'Mrs. Kavita Iyer', avatar: 'KI', department: 'Social Studies' },
{ id: 'EMP007', name: 'Mr. Sanjay Gupta', avatar: 'SG', department: 'Computer Science' },
{ id: 'EMP008', name: 'Ms. Meera Nair', avatar: 'MN', department: 'Mathematics' }];


const performedByUsers = [
{ name: 'System', role: 'Automated' },
{ name: 'HR Admin', role: 'HR Manager' },
{ name: 'Mrs. Anita Desai', role: 'HR Executive' },
{ name: 'Mr. Suresh Pillai', role: 'Admin Officer' },
{ name: 'Payroll System', role: 'Automated' }];


const reasons = {
  credit: [
  'Monthly leave accrual',
  'Annual leave credit',
  'Carry forward from previous year',
  'Policy adjustment',
  'Compensatory off earned',
  'Manual adjustment by HR',
  'Leave reversal',
  'System reconciliation',
  'Special allocation',
  'Probation completion bonus'],

  debit: [
  'Leave taken - Approved',
  'Leave application approved',
  'Half day leave',
  'Sick leave availed',
  'Emergency leave',
  'Annual lapse',
  'Leave encashment',
  'Policy deduction',
  'Adjustment correction',
  'Unauthorized absence']

};

const generateMockTransactions = (): LeaveTransaction[] => {
  const transactions: LeaveTransaction[] = [];
  const leaveTypes: LeaveTransaction['leaveType'][] = ['sick', 'casual', 'paid', 'earned', 'maternity', 'compensatory'];

  let idCounter = 1;

  // Generate transactions for last 90 days
  for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Generate 3-8 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 6) + 3;

    for (let i = 0; i < transactionsPerDay; i++) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      const leaveType = leaveTypes[Math.floor(Math.random() * (leaveTypes.length - 1))]; // Exclude maternity mostly
      const isCredit = Math.random() > 0.6; // 40% credits, 60% debits
      const transactionType: 'credit' | 'debit' = isCredit ? 'credit' : 'debit';
      const quantity = transactionType === 'credit' ?
      [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)] :
      [0.5, 1, 1, 1, 2, 2, 3][Math.floor(Math.random() * 7)];
      const performer = performedByUsers[Math.floor(Math.random() * performedByUsers.length)];
      const reasonList = reasons[transactionType];
      const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

      const balanceBefore = Math.floor(Math.random() * 15) + 5;
      const balanceAfter = transactionType === 'credit' ?
      balanceBefore + quantity :
      Math.max(0, balanceBefore - quantity);

      const transactionDate = new Date(date);
      transactionDate.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 60));

      transactions.push({
        id: `TXN${String(idCounter++).padStart(6, '0')}`,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        department: employee.department,
        transactionDate: transactionDate.toISOString(),
        leaveType,
        transactionType,
        quantity,
        reason,
        performedBy: performer.name,
        performedByRole: performer.role,
        balanceBefore,
        balanceAfter,
        remarks: Math.random() > 0.7 ? 'Additional notes added by HR' : null,
        referenceId: transactionType === 'debit' ? `LV${Date.now()}${Math.floor(Math.random() * 1000)}` : null,
        createdAt: transactionDate.toISOString()
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
};

const mockTransactions = generateMockTransactions();

type SortColumn = 'employeeName' | 'transactionDate' | 'leaveType' | 'transactionType' | 'quantity' | 'performedBy';
type SortDirection = 'asc' | 'desc';

const getLeaveTypeConfig = (leaveType: LeaveTransaction['leaveType']) => {
  switch (leaveType) {
    case 'sick':
      return {
        label: 'Sick Leave',
        shortLabel: 'SL',
        icon: <Heart className="w-4 h-4" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        color: 'text-red-600'
      };
    case 'casual':
      return {
        label: 'Casual Leave',
        shortLabel: 'CL',
        icon: <Coffee className="w-4 h-4" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        color: 'text-blue-600'
      };
    case 'paid':
      return {
        label: 'Paid Leave',
        shortLabel: 'PL',
        icon: <Briefcase className="w-4 h-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        color: 'text-green-600'
      };
    case 'earned':
      return {
        label: 'Earned Leave',
        shortLabel: 'EL',
        icon: <Sparkles className="w-4 h-4" />,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        color: 'text-amber-600'
      };
    case 'maternity':
      return {
        label: 'Maternity Leave',
        shortLabel: 'ML',
        icon: <Baby className="w-4 h-4" />,
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-700',
        color: 'text-pink-600'
      };
    case 'compensatory':
      return {
        label: 'Comp Off',
        shortLabel: 'CO',
        icon: <CalendarCheck className="w-4 h-4" />,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        color: 'text-purple-600'
      };
    default:
      return {
        label: 'Unknown',
        shortLabel: '??',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        color: 'text-gray-600'
      };
  }
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function LeaveBalanceLog() {
  // Get default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(today.toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('transactionDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedTransaction, setSelectedTransaction] = useState<LeaveTransaction | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((txn) => {
      // Date range filter
      const txnDate = new Date(txn.transactionDate).toISOString().split('T')[0];
      if (txnDate < dateFrom || txnDate > dateTo) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
        !txn.employeeName.toLowerCase().includes(query) &&
        !txn.employeeId.toLowerCase().includes(query) &&
        !txn.reason.toLowerCase().includes(query) &&
        !txn.performedBy.toLowerCase().includes(query))
        {
          return false;
        }
      }

      // Leave type filter
      if (leaveTypeFilter !== 'all' && txn.leaveType !== leaveTypeFilter) {
        return false;
      }

      // Transaction type filter
      if (transactionTypeFilter !== 'all' && txn.transactionType !== transactionTypeFilter) {
        return false;
      }

      // Employee filter
      if (selectedEmployee !== 'all' && txn.employeeId !== selectedEmployee) {
        return false;
      }

      return true;
    });
  }, [dateFrom, dateTo, searchQuery, leaveTypeFilter, transactionTypeFilter, selectedEmployee]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'employeeName':
          comparison = a.employeeName.localeCompare(b.employeeName);
          break;
        case 'transactionDate':
          comparison = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
          break;
        case 'leaveType':
          comparison = a.leaveType.localeCompare(b.leaveType);
          break;
        case 'transactionType':
          comparison = a.transactionType.localeCompare(b.transactionType);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'performedBy':
          comparison = a.performedBy.localeCompare(b.performedBy);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTransactions, sortColumn, sortDirection]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(startIndex, startIndex + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedTransactions.length / pageSize);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const resetFilters = () => {
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
    setSearchQuery('');
    setLeaveTypeFilter('all');
    setTransactionTypeFilter('all');
    setSelectedEmployee('all');
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const totalTransactions = filteredTransactions.length;
    const totalCredits = filteredTransactions.
    filter((t) => t.transactionType === 'credit').
    reduce((sum, t) => sum + t.quantity, 0);
    const totalDebits = filteredTransactions.
    filter((t) => t.transactionType === 'debit').
    reduce((sum, t) => sum + t.quantity, 0);
    const creditCount = filteredTransactions.filter((t) => t.transactionType === 'credit').length;
    const debitCount = filteredTransactions.filter((t) => t.transactionType === 'debit').length;
    const uniqueEmployees = new Set(filteredTransactions.map((t) => t.employeeId)).size;
    const uniquePerformers = new Set(filteredTransactions.map((t) => t.performedBy)).size;

    return { totalTransactions, totalCredits, totalDebits, creditCount, debitCount, uniqueEmployees, uniquePerformers };
  }, [filteredTransactions]);

  const SortIcon = ({ column }: {column: SortColumn;}) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ArrowUp className="w-4 h-4 text-blue-600" /> :

    <ArrowDown className="w-4 h-4 text-blue-600" />;

  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Leave</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Balance Log</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-teal-600" />
            Leave Balance Log
          </h1>
          <p className="text-sm text-gray-500">
            Complete history of all leave balance transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalTransactions}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">+{stats.totalCredits}</p>
              <p className="text-xs text-gray-500">Credits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">-{stats.totalDebits}</p>
              <p className="text-xs text-gray-500">Debits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.creditCount}</p>
              <p className="text-xs text-gray-500">Credit Txns</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <Minus className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.debitCount}</p>
              <p className="text-xs text-gray-500">Debit Txns</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.uniqueEmployees}</p>
              <p className="text-xs text-gray-500">Employees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.uniquePerformers}</p>
              <p className="text-xs text-gray-500">Performers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {(searchQuery || leaveTypeFilter !== 'all' || transactionTypeFilter !== 'all' ||
            selectedEmployee !== 'all') &&
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Active
              </span>
            }
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showFilters &&
        <div className="space-y-4">
            {/* Date Range Pickers */}
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h4 className="font-medium text-teal-900">Date Range</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                </div>
              </div>
              {/* Quick Date Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500">Quick:</span>
                {[
              { label: 'Today', days: 0 },
              { label: 'Last 7 days', days: 7 },
              { label: 'Last 30 days', days: 30 },
              { label: 'Last 90 days', days: 90 },
              { label: 'This Year', days: 365 }].
              map((preset) =>
              <button
                key={preset.label}
                onClick={() => {
                  const to = new Date();
                  const from = new Date(to.getTime() - preset.days * 24 * 60 * 60 * 1000);
                  setDateTo(to.toISOString().split('T')[0]);
                  setDateFrom(from.toISOString().split('T')[0]);
                  setCurrentPage(1);
                }}
                className="px-3 py-1 text-xs font-medium text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors">

                    {preset.label}
                  </button>
              )}
              </div>
            </div>

            {/* Search and Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search employee, reason, or performer..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                  {searchQuery &&
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                      <X className="w-4 h-4" />
                    </button>
                }
                </div>
              </div>

              {/* Leave Type */}
              <Select
              label="Leave Type"
              options={leaveTypeOptions}
              value={leaveTypeFilter}
              onChange={(e) => {
                setLeaveTypeFilter(e.target.value);
                setCurrentPage(1);
              }} />


              {/* Transaction Type */}
              <Select
              label="Transaction Type"
              options={transactionTypeOptions}
              value={transactionTypeFilter}
              onChange={(e) => {
                setTransactionTypeFilter(e.target.value);
                setCurrentPage(1);
              }} />


              {/* Employee */}
              <Select
              label="Employee"
              options={[
              { value: 'all', label: 'All Employees' },
              ...employees.map((e) => ({ value: e.id, label: e.name }))]
              }
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setCurrentPage(1);
              }} />

            </div>

            {/* Reset Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Transaction Log Table */}
      <Card title="Transaction History">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <span className="font-medium">Green rows</span> indicate credits (balance added), 
            <span className="font-medium"> Red rows</span> indicate debits (balance deducted). 
            Click any row to view full details.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeName')}>

                  <div className="flex items-center gap-2">
                    Employee Name
                    <SortIcon column="employeeName" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('transactionDate')}>

                  <div className="flex items-center gap-2">
                    Transaction Date
                    <SortIcon column="transactionDate" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('leaveType')}>

                  <div className="flex items-center gap-2">
                    Leave Type
                    <SortIcon column="leaveType" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('transactionType')}>

                  <div className="flex items-center justify-center gap-2">
                    Type
                    <SortIcon column="transactionType" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('quantity')}>

                  <div className="flex items-center justify-center gap-2">
                    Days
                    <SortIcon column="quantity" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Reason for Change
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('performedBy')}>

                  <div className="flex items-center gap-2">
                    Performed By
                    <SortIcon column="performedBy" />
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ?
              paginatedTransactions.map((txn) => {
                const leaveTypeConfig = getLeaveTypeConfig(txn.leaveType);
                const isCredit = txn.transactionType === 'credit';

                return (
                  <tr
                    key={txn.id}
                    className={`border-b border-gray-100 hover:opacity-90 transition-opacity cursor-pointer ${
                    isCredit ? 'bg-green-50/60' : 'bg-red-50/60'}`
                    }
                    onClick={() => setSelectedTransaction(txn)}>

                      {/* Employee Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-xs font-semibold">
                            {txn.employeeAvatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{txn.employeeName}</p>
                            <p className="text-xs text-gray-500">{txn.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Transaction Date */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(txn.transactionDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(txn.transactionDate)}
                          </p>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${leaveTypeConfig.bgColor} ${leaveTypeConfig.color}`}>
                            {leaveTypeConfig.icon}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{leaveTypeConfig.label}</p>
                            <p className="text-xs text-gray-500">{leaveTypeConfig.shortLabel}</p>
                          </div>
                        </div>
                      </td>

                      {/* Transaction Type */}
                      <td className="py-3 px-4 text-center">
                        <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        isCredit ?
                        'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`
                        }>

                          {isCredit ?
                        <ArrowUpRight className="w-3 h-3" /> :

                        <ArrowDownRight className="w-3 h-3" />
                        }
                          {isCredit ? 'Credit' : 'Debit'}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-4 text-center">
                        <span
                        className={`text-lg font-bold ${
                        isCredit ? 'text-green-600' : 'text-red-600'}`
                        }>

                          {isCredit ? '+' : '-'}{txn.quantity}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate" title={txn.reason}>
                          {txn.reason}
                        </p>
                      </td>

                      {/* Performed By */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                            {txn.performedByRole === 'Automated' ?
                          <Settings className="w-3.5 h-3.5 text-gray-500" /> :

                          <User className="w-3.5 h-3.5 text-gray-500" />
                          }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{txn.performedBy}</p>
                            <p className="text-xs text-gray-500">{txn.performedByRole}</p>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(txn);
                        }}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>);

              }) :

              <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <History className="w-12 h-12 mb-3" />
                      <p className="text-lg font-medium text-gray-500">No transactions found</p>
                      <p className="text-sm text-gray-400">Try adjusting your date range or filters</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedTransactions.length > 0 &&
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, sortedTransactions.length)} of{' '}
                {sortedTransactions.length} entries
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows:</span>
                <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm">

                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        }

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-sm text-gray-600">Credit (Balance Added)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-sm text-gray-600">Debit (Balance Deducted)</span>
          </div>
        </div>
      </Card>

      {/* Summary by Leave Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Summary by Leave Type">
          <div className="space-y-3">
            {(['sick', 'casual', 'paid', 'earned', 'compensatory'] as const).map((leaveType) => {
              const config = getLeaveTypeConfig(leaveType);
              const typeTransactions = filteredTransactions.filter((t) => t.leaveType === leaveType);
              const credits = typeTransactions.
              filter((t) => t.transactionType === 'credit').
              reduce((sum, t) => sum + t.quantity, 0);
              const debits = typeTransactions.
              filter((t) => t.transactionType === 'debit').
              reduce((sum, t) => sum + t.quantity, 0);
              const net = credits - debits;

              return (
                <div key={leaveType} className={`p-4 rounded-xl ${config.bgColor} border ${config.bgColor.replace('100', '200')}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg bg-white ${config.color}`}>
                        {config.icon}
                      </span>
                      <div>
                        <p className={`font-semibold ${config.textColor}`}>{config.label}</p>
                        <p className="text-xs text-gray-500">{typeTransactions.length} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-green-600">+{credits}</p>
                        <p className="text-xs text-gray-500">Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-600">-{debits}</p>
                        <p className="text-xs text-gray-500">Debits</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {net >= 0 ? '+' : ''}{net}
                        </p>
                        <p className="text-xs text-gray-500">Net</p>
                      </div>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </Card>

        <Card title="Top Performers">
          <div className="space-y-3">
            {(() => {
              const performerStats = filteredTransactions.reduce((acc, txn) => {
                if (!acc[txn.performedBy]) {
                  acc[txn.performedBy] = { name: txn.performedBy, role: txn.performedByRole, count: 0 };
                }
                acc[txn.performedBy].count++;
                return acc;
              }, {} as Record<string, {name: string;role: string;count: number;}>);

              return Object.values(performerStats).
              sort((a, b) => b.count - a.count).
              slice(0, 5).
              map((performer, index) =>
              <div
                key={performer.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-gray-200 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'}`
                  }>
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {performer.role === 'Automated' ?
                    <Settings className="w-4 h-4 text-gray-500" /> :

                    <User className="w-4 h-4 text-gray-500" />
                    }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                        <p className="text-xs text-gray-500">{performer.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{performer.count}</p>
                      <p className="text-xs text-gray-500">transactions</p>
                    </div>
                  </div>
              );
            })()}
          </div>
        </Card>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setSelectedTransaction(null)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div
            className={`px-6 py-5 ${
            selectedTransaction.transactionType === 'credit' ?
            'bg-gradient-to-r from-green-500 to-emerald-500' :
            'bg-gradient-to-r from-red-500 to-rose-500'}`
            }>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    {selectedTransaction.transactionType === 'credit' ?
                  <TrendingUp className="w-6 h-6 text-white" /> :

                  <TrendingDown className="w-6 h-6 text-white" />
                  }
                  </div>
                  <div className="text-white">
                    <h2 className="text-lg font-bold">
                      {selectedTransaction.transactionType === 'credit' ? 'Credit' : 'Debit'} Transaction
                    </h2>
                    <p className="text-white/80 text-sm">{selectedTransaction.id}</p>
                  </div>
                </div>
                <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Quantity Display */}
              <div className="text-center py-4">
                <span
                className={`text-5xl font-bold ${
                selectedTransaction.transactionType === 'credit' ?
                'text-green-600' :
                'text-red-600'}`
                }>

                  {selectedTransaction.transactionType === 'credit' ? '+' : '-'}
                  {selectedTransaction.quantity}
                </span>
                <p className="text-gray-500 mt-1">Days</p>
              </div>

              {/* Balance Change */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-400">{selectedTransaction.balanceBefore}</p>
                  <p className="text-xs text-gray-500">Before</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedTransaction.balanceAfter}</p>
                  <p className="text-xs text-gray-500">After</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Employee</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-xs font-semibold">
                      {selectedTransaction.employeeAvatar}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{selectedTransaction.employeeName}</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Leave Type</p>
                  <div className="flex items-center gap-2">
                    <span className={`${getLeaveTypeConfig(selectedTransaction.leaveType).bgColor} ${getLeaveTypeConfig(selectedTransaction.leaveType).color} p-1 rounded`}>
                      {getLeaveTypeConfig(selectedTransaction.leaveType).icon}
                    </span>
                    <p className="text-sm font-semibold text-gray-900">
                      {getLeaveTypeConfig(selectedTransaction.leaveType).label}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Transaction Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDateTime(selectedTransaction.transactionDate)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTransaction.department}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Reason for Change</p>
                <p className="text-sm text-blue-900">{selectedTransaction.reason}</p>
              </div>

              {/* Performed By */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Performed By</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {selectedTransaction.performedByRole === 'Automated' ?
                  <Settings className="w-5 h-5 text-gray-500" /> :

                  <User className="w-5 h-5 text-gray-500" />
                  }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedTransaction.performedBy}</p>
                    <p className="text-sm text-gray-500">{selectedTransaction.performedByRole}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(selectedTransaction.referenceId || selectedTransaction.remarks) &&
            <div className="space-y-3">
                  {selectedTransaction.referenceId &&
              <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Reference ID:</span>
                      <span className="font-mono text-gray-900">{selectedTransaction.referenceId}</span>
                    </div>
              }
                  {selectedTransaction.remarks &&
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-600 mb-1">Remarks</p>
                      <p className="text-sm text-amber-800">{selectedTransaction.remarks}</p>
                    </div>
              }
                </div>
            }

              {/* Timestamp */}
              <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
                Created: {formatDateTime(selectedTransaction.createdAt)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
              <Button variant="primary">
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}