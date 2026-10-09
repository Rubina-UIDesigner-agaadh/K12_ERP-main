// File: src/pages/finance/approvals/ExpenseApprovalWorkflow.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import {
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  MessageSquare,
  Search,
  FileText,
  AlertCircle,
  Eye,
  Check,
  X,
  Filter,
  ShieldCheck,
  Clock,
  User,
  Calendar,
  DollarSign,
  Tag,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Zap,
  CheckCircle2,
  XOctagon,
  Edit3,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  BarChart3,
  Activity,
  History,
  Send,
  Reply,
  Archive,
  Trash2,
  Star,
  Flag,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  CreditCard,
  Wallet,
  Hash,
  ExternalLink,
  FileWarning,
  Shield,
  Lock,
  Unlock,
  UserCheck,
  Users,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  FileClock,
  FileX,
  Sparkles } from
'lucide-react';

// --- Types ---
interface ExpenseItem {
  id: string;
  date: string;
  vendor: string;
  vendorContact?: string;
  vendorAddress?: string;
  amount: number;
  head: string;
  category: string;
  staff: string;
  staffDepartment: string;
  staffContact: string;
  description: string;
  paymentMode: string;
  billUrl: string;
  refNumber: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  hasReceipt: boolean;
  receiptQuality: 'good' | 'poor' | 'missing';
  budgetImpact: number;
  previousApprovals?: {
    approver: string;
    date: string;
    status: 'approved' | 'rejected';
    remarks?: string;
  }[];
  auditFlags: string[];
  complianceChecks: {
    name: string;
    status: 'passed' | 'failed' | 'warning';
    message: string;
  }[];
}

interface ApprovalStats {
  totalPending: number;
  totalAmount: number;
  highPriority: number;
  needsAttention: number;
  approvedToday: number;
  rejectedToday: number;
  avgApprovalTime: string;
}

interface RejectionForm {
  reason: string;
  category: string;
  requireResubmission: boolean;
  notifyStaff: boolean;
  additionalComments: string;
}

interface FilterOptions {
  priority: string;
  category: string;
  dateRange: string;
  amountRange: string;
  staff: string;
  searchQuery: string;
}

// --- Mock Data ---
const INITIAL_PENDING: ExpenseItem[] = [
{
  id: 'EXP-901',
  date: '2024-03-22',
  vendor: 'Generic Stationery Store',
  vendorContact: '+91 98765 43210',
  vendorAddress: '123 MG Road, Bangalore',
  amount: 4500,
  head: 'Office Supplies',
  category: 'Stationery',
  staff: 'Ms. Anjali Sharma',
  staffDepartment: 'Administration',
  staffContact: 'anjali@school.edu',
  description: 'Monthly office supplies - pens, notebooks, folders',
  paymentMode: 'Cash',
  billUrl: '#',
  refNumber: 'INV-2024-0322',
  submittedDate: '2024-03-22 10:30 AM',
  priority: 'medium',
  tags: ['Recurring', 'Monthly'],
  hasReceipt: true,
  receiptQuality: 'good',
  budgetImpact: 12.5,
  auditFlags: [],
  complianceChecks: [
  { name: 'Receipt Attached', status: 'passed', message: 'Valid receipt found' },
  { name: 'Amount Limit', status: 'passed', message: 'Within category limit' },
  { name: 'Budget Available', status: 'passed', message: 'Sufficient budget' }]

},
{
  id: 'EXP-905',
  date: '2024-03-21',
  vendor: 'Elite Uniforms Ltd',
  vendorContact: '+91 98765 11111',
  vendorAddress: '456 Brigade Road, Bangalore',
  amount: 12800,
  head: 'Uniform Inventory',
  category: 'Procurement',
  staff: 'Mr. David Wilson',
  staffDepartment: 'Stores',
  staffContact: 'david@school.edu',
  description: 'Student uniforms - 50 sets (Grades 6-8)',
  paymentMode: 'Bank Transfer',
  billUrl: '#',
  refNumber: 'GST-INV-8901',
  submittedDate: '2024-03-21 02:15 PM',
  priority: 'high',
  tags: ['Procurement', 'GST Bill'],
  hasReceipt: true,
  receiptQuality: 'good',
  budgetImpact: 35.2,
  previousApprovals: [
  { approver: 'Purchase Manager', date: '2024-03-21', status: 'approved', remarks: 'Verified quotation' }],

  auditFlags: [],
  complianceChecks: [
  { name: 'Receipt Attached', status: 'passed', message: 'GST invoice available' },
  { name: 'Amount Limit', status: 'warning', message: 'Exceeds standard limit - needs justification' },
  { name: 'Budget Available', status: 'passed', message: 'Budget allocation confirmed' },
  { name: 'Prior Approval', status: 'passed', message: 'Purchase Manager approved' }]

},
{
  id: 'EXP-909',
  date: '2024-03-20',
  vendor: 'Sports Junction',
  vendorContact: '+91 98765 22222',
  amount: 2200,
  head: 'Sports Equipment',
  category: 'Sports',
  staff: 'Coach Rohan Kumar',
  staffDepartment: 'Physical Education',
  staffContact: 'rohan@school.edu',
  description: 'Cricket equipment - 2 bats, 6 balls, practice stumps',
  paymentMode: 'UPI',
  billUrl: '#',
  refNumber: 'BILL-920',
  submittedDate: '2024-03-20 04:45 PM',
  priority: 'low',
  tags: ['Sports', 'Equipment'],
  hasReceipt: true,
  receiptQuality: 'poor',
  budgetImpact: 8.3,
  auditFlags: ['Receipt quality poor - image blurry'],
  complianceChecks: [
  { name: 'Receipt Attached', status: 'warning', message: 'Receipt image quality is poor' },
  { name: 'Amount Limit', status: 'passed', message: 'Within category limit' },
  { name: 'Budget Available', status: 'passed', message: 'Sufficient budget' }]

},
{
  id: 'EXP-912',
  date: '2024-03-19',
  vendor: 'City Electricity Board',
  vendorContact: '1912',
  amount: 25600,
  head: 'Electricity Bill',
  category: 'Utilities',
  staff: 'Ms. Priya Menon',
  staffDepartment: 'Accounts',
  staffContact: 'priya@school.edu',
  description: 'Monthly electricity bill for March 2024',
  paymentMode: 'Bank Transfer',
  billUrl: '#',
  refNumber: 'EB-MAR-2024',
  submittedDate: '2024-03-19 11:00 AM',
  priority: 'urgent',
  tags: ['Utility', 'Recurring', 'Due Soon'],
  hasReceipt: true,
  receiptQuality: 'good',
  budgetImpact: 42.1,
  auditFlags: ['Amount 15% higher than last month'],
  complianceChecks: [
  { name: 'Receipt Attached', status: 'passed', message: 'Official bill available' },
  { name: 'Amount Limit', status: 'warning', message: 'Higher than historical average' },
  { name: 'Budget Available', status: 'passed', message: 'Utility budget available' }]

},
{
  id: 'EXP-915',
  date: '2024-03-18',
  vendor: 'Tech Solutions Pvt Ltd',
  vendorContact: '+91 80 4567 8900',
  amount: 18500,
  head: 'IT Maintenance',
  category: 'Technology',
  staff: 'Mr. Rajesh Gupta',
  staffDepartment: 'IT Department',
  staffContact: 'rajesh@school.edu',
  description: 'Computer lab maintenance - software updates and repairs',
  paymentMode: 'Cheque',
  billUrl: '#',
  refNumber: 'SRV-2024-318',
  submittedDate: '2024-03-18 09:30 AM',
  priority: 'medium',
  tags: ['IT', 'Maintenance', 'AMC'],
  hasReceipt: true,
  receiptQuality: 'good',
  budgetImpact: 28.7,
  auditFlags: [],
  complianceChecks: [
  { name: 'Receipt Attached', status: 'passed', message: 'Service invoice with GST' },
  { name: 'Amount Limit', status: 'passed', message: 'Within IT budget allocation' },
  { name: 'Budget Available', status: 'passed', message: 'IT maintenance fund available' },
  { name: 'Vendor Verification', status: 'passed', message: 'Approved vendor' }]

}];


const REJECTION_CATEGORIES = [
{ value: 'receipt_issue', label: 'Receipt/Bill Issues' },
{ value: 'amount_mismatch', label: 'Amount Mismatch' },
{ value: 'unauthorized', label: 'Unauthorized Expense' },
{ value: 'insufficient_info', label: 'Insufficient Information' },
{ value: 'budget_exceeded', label: 'Budget Limit Exceeded' },
{ value: 'duplicate', label: 'Duplicate Entry' },
{ value: 'policy_violation', label: 'Policy Violation' },
{ value: 'other', label: 'Other Reason' }];


const PRIORITY_COLORS = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  high: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  urgent: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
};

export function ExpenseApprovalWorkflow(): JSX.Element {
  // --- State ---
  const [pendingItems, setPendingItems] = useState<ExpenseItem[]>(INITIAL_PENDING);
  const [rejectingItem, setRejectingItem] = useState<ExpenseItem | null>(null);
  const [rejectionForm, setRejectionForm] = useState<RejectionForm>({
    reason: '',
    category: '',
    requireResubmission: true,
    notifyStaff: true,
    additionalComments: ''
  });
  const [viewingItem, setViewingItem] = useState<ExpenseItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    priority: 'all',
    category: 'all',
    dateRange: 'all',
    amountRange: 'all',
    staff: 'all',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [approvalStats, setApprovalStats] = useState<ApprovalStats>({
    totalPending: INITIAL_PENDING.length,
    totalAmount: INITIAL_PENDING.reduce((sum, item) => sum + item.amount, 0),
    highPriority: INITIAL_PENDING.filter((i) => i.priority === 'urgent' || i.priority === 'high').length,
    needsAttention: INITIAL_PENDING.filter((i) => i.auditFlags.length > 0).length,
    approvedToday: 12,
    rejectedToday: 3,
    avgApprovalTime: '2.5 hours'
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);

  // --- Handlers ---
  const handleApprove = useCallback((id: string) => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
      setApprovalStats((prev) => ({
        ...prev,
        totalPending: prev.totalPending - 1,
        approvedToday: prev.approvedToday + 1
      }));
      setIsProcessing(false);
      // Show success notification
    }, 800);
  }, []);

  const handleRejectClick = useCallback((item: ExpenseItem) => {
    setRejectingItem(item);
    setRejectionForm({
      reason: '',
      category: '',
      requireResubmission: true,
      notifyStaff: true,
      additionalComments: ''
    });
  }, []);

  const confirmRejection = useCallback(() => {
    if (!rejectionForm.reason.trim() || !rejectionForm.category) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      if (rejectingItem) {
        setPendingItems((prev) => prev.filter((item) => item.id !== rejectingItem.id));
        setApprovalStats((prev) => ({
          ...prev,
          totalPending: prev.totalPending - 1,
          rejectedToday: prev.rejectedToday + 1
        }));
      }
      setRejectingItem(null);
      setIsProcessing(false);
      // Show rejection notification
    }, 800);
  }, [rejectingItem, rejectionForm]);

  const handleViewDetails = useCallback((item: ExpenseItem) => {
    setViewingItem(item);
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item.id)));
    }
  }, []);

  const handleBulkApprove = useCallback(() => {
    if (selectedItems.size === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setPendingItems((prev) => prev.filter((item) => !selectedItems.has(item.id)));
      setApprovalStats((prev) => ({
        ...prev,
        totalPending: prev.totalPending - selectedItems.size,
        approvedToday: prev.approvedToday + selectedItems.size
      }));
      setSelectedItems(new Set());
      setIsProcessing(false);
    }, 1000);
  }, [selectedItems]);

  const handleBulkReject = useCallback(() => {
    if (selectedItems.size === 0) return;
    // Open bulk rejection dialog
    setShowBulkActions(true);
  }, [selectedItems]);

  // --- Filtering & Sorting ---
  const filteredItems = useMemo(() => {
    let items = [...pendingItems];

    // Apply filters
    if (filters.priority !== 'all') {
      items = items.filter((item) => item.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      items = items.filter((item) => item.category === filters.category);
    }

    if (filters.staff !== 'all') {
      items = items.filter((item) => item.staff.toLowerCase().includes(filters.staff.toLowerCase()));
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      items = items.filter((item) =>
      item.vendor.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.staff.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    items.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return items;
  }, [pendingItems, filters, sortBy, sortOrder]);

  // --- Get Priority Icon ---
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'medium':
        return <Activity className="w-4 h-4" />;
      case 'low':
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // --- Get Compliance Badge ---
  const getComplianceBadge = (checks: ExpenseItem['complianceChecks']) => {
    const failedCount = checks.filter((c) => c.status === 'failed').length;
    const warningCount = checks.filter((c) => c.status === 'warning').length;

    if (failedCount > 0) {
      return <Badge variant="danger" className="text-[9px]">Failed ({failedCount})</Badge>;
    } else if (warningCount > 0) {
      return <Badge variant="warning" className="text-[9px]">Warnings ({warningCount})</Badge>;
    } else {
      return <Badge variant="success" className="text-[9px]">All Passed</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            Financial Approval Desk
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Reviewing <span className="font-bold text-blue-600">{filteredItems.length}</span> expense vouchers pending your authorization
            {selectedItems.size > 0 &&
            <span className="ml-2">
                • <span className="font-bold text-indigo-600">{selectedItems.size}</span> selected
              </span>
            }
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="warning" className="px-4 py-2 animate-pulse text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {approvalStats.totalPending} Pending
          </Badge>
          <div className="h-8 w-px bg-gray-200" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search vouchers, vendors..."
              className="pl-10 h-11 w-72 bg-white"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))} />

          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-indigo-50 border-indigo-200' : ''}>

            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">Total Pending</p>
              <p className="text-3xl font-black text-blue-900 mt-1">{approvalStats.totalPending}</p>
              <p className="text-xs text-blue-500 mt-1">₹{approvalStats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileClock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase">Needs Attention</p>
              <p className="text-3xl font-black text-orange-900 mt-1">{approvalStats.highPriority}</p>
              <p className="text-xs text-orange-500 mt-1">High priority items</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-bold uppercase">Approved Today</p>
              <p className="text-3xl font-black text-green-900 mt-1">{approvalStats.approvedToday}</p>
              <p className="text-xs text-green-500 mt-1">Processed successfully</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-bold uppercase">Avg. Time</p>
              <p className="text-3xl font-black text-purple-900 mt-1">{approvalStats.avgApprovalTime}</p>
              <p className="text-xs text-purple-500 mt-1">Per approval</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters &&
      <Card className="p-6 bg-white border-indigo-100 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Priority</label>
              <Select
              options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }]
              }
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))} />

            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Category</label>
              <Select
              options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Stationery', label: 'Stationery' },
              { value: 'Procurement', label: 'Procurement' },
              { value: 'Utilities', label: 'Utilities' },
              { value: 'Technology', label: 'Technology' },
              { value: 'Sports', label: 'Sports' }]
              }
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} />

            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Date Range</label>
              <Select
              options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' }]
              }
              value={filters.dateRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))} />

            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Amount Range</label>
              <Select
              options={[
              { value: 'all', label: 'All Amounts' },
              { value: '0-5000', label: '₹0 - ₹5,000' },
              { value: '5000-15000', label: '₹5,000 - ₹15,000' },
              { value: '15000+', label: '₹15,000+' }]
              }
              value={filters.amountRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, amountRange: e.target.value }))} />

            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({
              priority: 'all',
              category: 'all',
              dateRange: 'all',
              amountRange: 'all',
              staff: 'all',
              searchQuery: ''
            })}>

              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
            <Button variant="primary" size="sm">
              Apply Filters
            </Button>
          </div>
        </Card>
      }

      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 &&
      <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {selectedItems.size} item(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems(new Set())}>

                Clear Selection
              </Button>
              <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleBulkReject}>

                <XOctagon className="w-4 h-4 mr-1" />
                Reject Selected
              </Button>
              <Button
              variant="primary"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleBulkApprove}
              disabled={isProcessing}>

                {isProcessing ?
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> :

              <ThumbsUp className="w-4 h-4 mr-1" />
              }
                Approve Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Main Table */}
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Table Header with Sorting */}
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

            <span className="text-sm font-medium text-gray-600">
              {filteredItems.length} Records
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Sort by:</span>
            <div className="flex gap-2">
              {['date', 'amount', 'priority'].map((sort) =>
              <button
                key={sort}
                onClick={() => {
                  if (sortBy === sort) {
                    setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(sort as any);
                    setSortOrder('desc');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortBy === sort ?
                'bg-indigo-600 text-white' :
                'bg-white text-gray-600 hover:bg-gray-100'}`
                }>

                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  {sortBy === sort && (
                sortOrder === 'asc' ? ' ↑' : ' ↓')
                }
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-left">
                  Priority & Date
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-left">
                  Vendor & Staff
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-left">
                  Expense Details
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-center">
                  Compliance
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-center">
                  Receipt
                </th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems.length > 0 ?
              filteredItems.map((item) =>
              <tr
                key={item.id}
                className={`hover:bg-blue-50/30 transition-all group ${
                selectedItems.has(item.id) ? 'bg-indigo-50' : ''}`
                }>

                    {/* Selection Checkbox */}
                    <td className="p-4">
                      <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                    </td>

                    {/* Priority & Date */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${PRIORITY_COLORS[item.priority].bg} ${PRIORITY_COLORS[item.priority].text}`}>
                          {getPriorityIcon(item.priority)}
                          {item.priority}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-bold text-gray-900">
                            {new Date(item.date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono">{item.id}</p>
                      </div>
                    </td>

                    {/* Vendor & Staff */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {item.vendor}
                          </p>
                          {item.vendorContact &&
                      <p className="text-[10px] text-gray-500">{item.vendorContact}</p>
                      }
                        </div>
                        <div className="pt-1 border-t border-gray-100">
                          <p className="text-xs text-gray-600 flex items-center gap-1.5">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">{item.staff}</span>
                          </p>
                          <p className="text-[10px] text-gray-400">{item.staffDepartment}</p>
                        </div>
                      </div>
                    </td>

                    {/* Expense Details */}
                    <td className="p-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {item.head}
                        </Badge>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                          {item.tags.map((tag, index) =>
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-medium">

                              {tag}
                            </span>
                      )}
                        </div>
                        {item.auditFlags.length > 0 &&
                    <div className="flex items-center gap-1 text-amber-600">
                            <Flag className="w-3 h-3" />
                            <span className="text-[9px] font-medium">{item.auditFlags[0]}</span>
                          </div>
                    }
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right">
                      <div className="space-y-1">
                        <p className="text-xl font-black text-gray-900">
                          ₹{item.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500">{item.paymentMode}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-orange-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-[9px] font-bold">{item.budgetImpact}% of budget</span>
                        </div>
                      </div>
                    </td>

                    {/* Compliance */}
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        {getComplianceBadge(item.complianceChecks)}
                        <button
                      onClick={() => handleViewDetails(item)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">

                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </td>

                    {/* Receipt */}
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        {item.hasReceipt ?
                    <>
                            <div className={`p-2 rounded-lg ${
                      item.receiptQuality === 'good' ?
                      'bg-green-100 text-green-600' :
                      'bg-amber-100 text-amber-600'}`
                      }>
                              <Receipt className="w-5 h-5" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase ${
                      item.receiptQuality === 'good' ?
                      'text-green-600' :
                      'text-amber-600'}`
                      }>
                              {item.receiptQuality}
                            </span>
                          </> :

                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <FileWarning className="w-5 h-5" />
                          </div>
                    }
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-end items-center gap-2">
                        <button
                      onClick={() => handleViewDetails(item)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
                      title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleApprove(item.id)}
                      className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:scale-110 transition-all shadow-sm"
                      title="Approve"
                      disabled={isProcessing}>

                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                        <button
                      onClick={() => handleRejectClick(item)}
                      className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 transition-all shadow-sm"
                      title="Reject"
                      disabled={isProcessing}>

                          <X className="w-5 h-5 stroke-[3]" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ) :

              <tr>
                  <td colSpan={8} className="p-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-400 mb-2">All Clear!</h3>
                      <p className="text-gray-400">No pending approvals matching your filters.</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rejection Modal */}
      {rejectingItem &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl shadow-2xl border-none overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <XOctagon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Reject Expense Voucher</h2>
                  <p className="text-red-100 text-sm mt-1">ID: {rejectingItem.id}</p>
                </div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Expense Summary */}
              <div className="p-4 bg-gray-50 rounded-xl grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vendor</p>
                  <p className="text-sm font-bold text-gray-900">{rejectingItem.vendor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Staff Member</p>
                  <p className="text-sm font-bold text-gray-900">{rejectingItem.staff}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-lg font-black text-gray-900">₹{rejectingItem.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Rejection Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Rejection Category <span className="text-red-500">*</span>
                </label>
                <Select
                options={REJECTION_CATEGORIES}
                placeholder="Select reason category..."
                value={rejectionForm.category}
                onChange={(e) => setRejectionForm((prev) => ({ ...prev, category: e.target.value }))} />

              </div>

              {/* Rejection Reason */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Detailed Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                autoFocus
                value={rejectionForm.reason}
                onChange={(e) => setRejectionForm((prev) => ({ ...prev, reason: e.target.value }))}
                className="w-full min-h-[120px] p-4 text-sm border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g., The scanned bill image is too blurry to verify. Please provide a clear, high-quality scan or photo of the original receipt..." />

                <p className="text-[10px] text-gray-500 italic flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  This message will be sent to {rejectingItem.staff} for correction
                </p>
              </div>

              {/* Additional Options */}
              <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-bold text-amber-900 uppercase">Additional Options</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={rejectionForm.requireResubmission}
                  onChange={(e) => setRejectionForm((prev) => ({ ...prev, requireResubmission: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />

                  <span className="text-sm text-amber-900">Require resubmission after correction</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={rejectionForm.notifyStaff}
                  onChange={(e) => setRejectionForm((prev) => ({ ...prev, notifyStaff: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />

                  <span className="text-sm text-amber-900">Send email notification to staff member</span>
                </label>
              </div>

              {/* Additional Comments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">Internal Notes (Optional)</label>
                <textarea
                value={rejectionForm.additionalComments}
                onChange={(e) => setRejectionForm((prev) => ({ ...prev, additionalComments: e.target.value }))}
                className="w-full min-h-[80px] p-3 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-all placeholder:text-gray-300"
                placeholder="Internal comments for audit trail (not visible to staff)..." />

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 flex justify-between items-center gap-4 border-t">
              <p className="text-xs text-gray-500 italic">
                This action will move the voucher to "Rejected" status
              </p>
              <div className="flex gap-3">
                <Button
                variant="outline"
                onClick={() => setRejectingItem(null)}
                disabled={isProcessing}>

                  Cancel
                </Button>
                <Button
                disabled={!rejectionForm.reason.trim() || !rejectionForm.category || isProcessing}
                onClick={confirmRejection}
                className="bg-red-600 hover:bg-red-700 text-white px-8 font-bold">

                  {isProcessing ?
                <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </> :

                <>
                      <Send className="w-4 h-4 mr-2" />
                      Confirm Rejection
                    </>
                }
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Detail View Modal */}
      {viewingItem &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-4xl shadow-2xl border-none overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Expense Details</h2>
                    <p className="text-blue-100 text-sm mt-1">Voucher #{viewingItem.id}</p>
                  </div>
                </div>
                <button
                onClick={() => setViewingItem(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Vendor Information</h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <p className="font-bold text-gray-900">{viewingItem.vendor}</p>
                      {viewingItem.vendorContact &&
                    <p className="text-sm text-gray-600">{viewingItem.vendorContact}</p>
                    }
                      {viewingItem.vendorAddress &&
                    <p className="text-xs text-gray-500">{viewingItem.vendorAddress}</p>
                    }
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Submitted By</h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <p className="font-bold text-gray-900">{viewingItem.staff}</p>
                      <p className="text-sm text-gray-600">{viewingItem.staffDepartment}</p>
                      <p className="text-xs text-gray-500">{viewingItem.staffContact}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Expense Details</h3>
                    <div className="p-4 bg-indigo-50 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-2xl font-black text-indigo-900">₹{viewingItem.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <Badge variant="secondary">{viewingItem.head}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Mode:</span>
                        <span className="text-sm font-medium text-gray-900">{viewingItem.paymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reference:</span>
                        <span className="text-sm font-mono text-gray-900">{viewingItem.refNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Timeline</h3>
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Date:</span>
                        <span className="font-medium">{new Date(viewingItem.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{viewingItem.submittedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Description</h3>
                <p className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700">{viewingItem.description}</p>
              </div>

              {/* Compliance Checks */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Compliance Checks</h3>
                <div className="space-y-2">
                  {viewingItem.complianceChecks.map((check, index) =>
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                  check.status === 'passed' ?
                  'bg-green-50 border-green-200' :
                  check.status === 'failed' ?
                  'bg-red-50 border-red-200' :
                  'bg-amber-50 border-amber-200'}`
                  }>

                      <div className="flex items-center gap-3">
                        {check.status === 'passed' ?
                    <CheckCircle className="w-5 h-5 text-green-600" /> :
                    check.status === 'failed' ?
                    <XCircle className="w-5 h-5 text-red-600" /> :

                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    }
                        <div>
                          <p className="font-medium text-sm text-gray-900">{check.name}</p>
                          <p className="text-xs text-gray-600">{check.message}</p>
                        </div>
                      </div>
                      <Badge
                    variant={check.status === 'passed' ? 'success' : check.status === 'failed' ? 'danger' : 'warning'}
                    className="text-[9px]">

                        {check.status}
                      </Badge>
                    </div>
                )}
                </div>
              </div>

              {/* Previous Approvals */}
              {viewingItem.previousApprovals && viewingItem.previousApprovals.length > 0 &&
            <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Previous Approvals</h3>
                  <div className="space-y-2">
                    {viewingItem.previousApprovals.map((approval, index) =>
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{approval.approver}</p>
                            <p className="text-xs text-gray-600">{approval.date}</p>
                            {approval.remarks &&
                      <p className="text-xs text-gray-500 italic mt-1">"{approval.remarks}"</p>
                      }
                          </div>
                        </div>
                        <Badge variant="success" className="text-[9px]">Approved</Badge>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Audit Flags */}
              {viewingItem.auditFlags.length > 0 &&
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-900 mb-2">Audit Flags</h3>
                      <ul className="space-y-1">
                        {viewingItem.auditFlags.map((flag, index) =>
                    <li key={index} className="text-sm text-amber-700">• {flag}</li>
                    )}
                      </ul>
                    </div>
                  </div>
                </div>
            }
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewingItem(null)}>
                Close
              </Button>
              <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                setViewingItem(null);
                handleRejectClick(viewingItem);
              }}>

                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
              variant="primary"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                handleApprove(viewingItem.id);
                setViewingItem(null);
              }}>

                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Helper Context Info */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">Manager Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Approved expenses immediately update respective <strong>Budget Ledgers</strong> and <strong>Petty Cash Accounts</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Rejected vouchers return to staff's <strong>"Correction Required"</strong> queue with your feedback</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>All approval actions are <strong>logged and auditable</strong> with timestamp and user details</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Urgent priority items require <strong>same-day approval</strong> to avoid payment delays</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}