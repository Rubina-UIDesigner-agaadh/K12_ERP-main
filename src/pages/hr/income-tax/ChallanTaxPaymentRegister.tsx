import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  X,
  Search,
  Edit2,
  Trash2,
  Printer,
  RefreshCw,
  Loader2,
  AlertCircle,
  Info,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Building,
  Users,
  History,
  Upload,
  ExternalLink,
  Filter,
  Save,
  Send,
  MoreVertical,
  Check,
  Link2,
  Unlink } from
'lucide-react';

// Types
interface Challan {
  id: string;
  challanNumber: string;
  bsrCode: string;
  bankName: string;
  bankBranch: string;
  paymentDate: string | null;
  periodFrom: string;
  periodTo: string;
  tdsAmount: number;
  interest: number;
  penalty: number;
  totalPaid: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  remarks: string;
  acknowledgementNumber: string | null;
  depositDate: string | null;
  minorHead: string;
  assessmentYear: string;
  linkedEmployees: LinkedEmployee[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  paymentMode: 'Online' | 'Offline' | null;
  receiptNumber: string | null;
  dueDate: string;
  attachments: Attachment[];
  history: ChallanHistory[];
}

interface LinkedEmployee {
  id: string;
  employeeId: string;
  name: string;
  pan: string;
  tdsAmount: number;
  month: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface ChallanHistory {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
}

interface FilterState {
  fiscalYear: string;
  quarter: string;
  month: string;
  status: string;
  search: string;
  bankName: string;
}

interface SortConfig {
  key: keyof Challan;
  direction: 'asc' | 'desc';
}

interface ValidationError {
  field: string;
  message: string;
}

interface Notification {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// Constants
const FISCAL_YEARS = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-23' }];


const QUARTERS = [
{ value: 'all', label: 'All Quarters' },
{ value: 'q4', label: 'Q4 (Jan-Mar 2025)' },
{ value: 'q3', label: 'Q3 (Oct-Dec 2024)' },
{ value: 'q2', label: 'Q2 (Jul-Sep 2024)' },
{ value: 'q1', label: 'Q1 (Apr-Jun 2024)' }];


const MONTHS = [
{ value: 'all', label: 'All Months' },
{ value: 'jan-2025', label: 'January 2025' },
{ value: 'dec-2024', label: 'December 2024' },
{ value: 'nov-2024', label: 'November 2024' },
{ value: 'oct-2024', label: 'October 2024' },
{ value: 'sep-2024', label: 'September 2024' },
{ value: 'aug-2024', label: 'August 2024' },
{ value: 'jul-2024', label: 'July 2024' },
{ value: 'jun-2024', label: 'June 2024' },
{ value: 'may-2024', label: 'May 2024' },
{ value: 'apr-2024', label: 'April 2024' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'pending', label: 'Pending' },
{ value: 'paid', label: 'Paid' },
{ value: 'overdue', label: 'Overdue' },
{ value: 'cancelled', label: 'Cancelled' }];


const BANK_OPTIONS = [
{ value: 'all', label: 'All Banks' },
{ value: 'hdfc', label: 'HDFC Bank' },
{ value: 'icici', label: 'ICICI Bank' },
{ value: 'sbi', label: 'State Bank of India' },
{ value: 'axis', label: 'Axis Bank' },
{ value: 'kotak', label: 'Kotak Mahindra Bank' }];


const MINOR_HEAD_OPTIONS = [
{ value: '200', label: '200 - TDS/TCS Payable by Taxpayer' },
{ value: '400', label: '400 - TDS/TCS Regular Assessment' }];


const PAYMENT_MODE_OPTIONS = [
{ value: 'online', label: 'Online' },
{ value: 'offline', label: 'Offline (Counter)' }];


// Sample Data
const initialChallans: Challan[] = [
{
  id: '1',
  challanNumber: 'CH/2024/001',
  bsrCode: '0123456',
  bankName: 'HDFC Bank',
  bankBranch: 'Mumbai Main Branch',
  paymentDate: '2025-01-07',
  periodFrom: 'dec-2024',
  periodTo: 'dec-2024',
  tdsAmount: 287500,
  interest: 0,
  penalty: 0,
  totalPaid: 287500,
  status: 'Paid',
  remarks: 'December 2024 TDS payment',
  acknowledgementNumber: 'ACK123456789',
  depositDate: '2025-01-07',
  minorHead: '200',
  assessmentYear: '2025-26',
  linkedEmployees: [
  { id: 'e1', employeeId: 'EMP001', name: 'Rajesh Kumar', pan: 'ABCPK1234A', tdsAmount: 9375, month: 'Dec 2024' },
  { id: 'e2', employeeId: 'EMP002', name: 'Priya Sharma', pan: 'DEFPS5678B', tdsAmount: 5208, month: 'Dec 2024' },
  { id: 'e3', employeeId: 'EMP003', name: 'Amit Patel', pan: 'GHIAP9012C', tdsAmount: 16250, month: 'Dec 2024' },
  { id: 'e4', employeeId: 'EMP004', name: 'Sneha Reddy', pan: 'JKLSR3456D', tdsAmount: 3500, month: 'Dec 2024' },
  { id: 'e5', employeeId: 'EMP005', name: 'Vikram Singh', pan: 'MNOPV7890E', tdsAmount: 8125, month: 'Dec 2024' }],

  createdAt: '2025-01-05T10:00:00',
  updatedAt: '2025-01-07T14:30:00',
  createdBy: 'HR Admin',
  paymentMode: 'Online',
  receiptNumber: 'RCP/2025/001',
  dueDate: '2025-01-07',
  attachments: [
  { id: 'a1', name: 'challan_receipt.pdf', type: 'application/pdf', size: 245000, uploadedAt: '2025-01-07T14:30:00', url: '#' }],

  history: [
  { id: 'h1', action: 'Challan Created', performedBy: 'HR Admin', timestamp: '2025-01-05T10:00:00', details: 'Initial challan generation' },
  { id: 'h2', action: 'Payment Made', performedBy: 'HR Admin', timestamp: '2025-01-07T14:30:00', details: 'Online payment via NSDL', previousStatus: 'Pending', newStatus: 'Paid' }]

},
{
  id: '2',
  challanNumber: 'CH/2024/002',
  bsrCode: '0123456',
  bankName: 'HDFC Bank',
  bankBranch: 'Mumbai Main Branch',
  paymentDate: '2024-12-07',
  periodFrom: 'nov-2024',
  periodTo: 'nov-2024',
  tdsAmount: 285000,
  interest: 0,
  penalty: 0,
  totalPaid: 285000,
  status: 'Paid',
  remarks: 'November 2024 TDS payment',
  acknowledgementNumber: 'ACK987654321',
  depositDate: '2024-12-07',
  minorHead: '200',
  assessmentYear: '2025-26',
  linkedEmployees: [
  { id: 'e6', employeeId: 'EMP001', name: 'Rajesh Kumar', pan: 'ABCPK1234A', tdsAmount: 9375, month: 'Nov 2024' },
  { id: 'e7', employeeId: 'EMP002', name: 'Priya Sharma', pan: 'DEFPS5678B', tdsAmount: 5208, month: 'Nov 2024' },
  { id: 'e8', employeeId: 'EMP003', name: 'Amit Patel', pan: 'GHIAP9012C', tdsAmount: 16250, month: 'Nov 2024' }],

  createdAt: '2024-12-05T10:00:00',
  updatedAt: '2024-12-07T15:00:00',
  createdBy: 'HR Admin',
  paymentMode: 'Online',
  receiptNumber: 'RCP/2024/012',
  dueDate: '2024-12-07',
  attachments: [],
  history: [
  { id: 'h3', action: 'Challan Created', performedBy: 'HR Admin', timestamp: '2024-12-05T10:00:00', details: 'Initial challan generation' },
  { id: 'h4', action: 'Payment Made', performedBy: 'HR Admin', timestamp: '2024-12-07T15:00:00', details: 'Online payment completed', previousStatus: 'Pending', newStatus: 'Paid' }]

},
{
  id: '3',
  challanNumber: 'CH/2025/003',
  bsrCode: '',
  bankName: '',
  bankBranch: '',
  paymentDate: null,
  periodFrom: 'jan-2025',
  periodTo: 'jan-2025',
  tdsAmount: 30833,
  interest: 0,
  penalty: 0,
  totalPaid: 0,
  status: 'Pending',
  remarks: 'January 2025 TDS - Awaiting payment',
  acknowledgementNumber: null,
  depositDate: null,
  minorHead: '200',
  assessmentYear: '2025-26',
  linkedEmployees: [
  { id: 'e9', employeeId: 'EMP001', name: 'Rajesh Kumar', pan: 'ABCPK1234A', tdsAmount: 9375, month: 'Jan 2025' },
  { id: 'e10', employeeId: 'EMP002', name: 'Priya Sharma', pan: 'DEFPS5678B', tdsAmount: 5208, month: 'Jan 2025' },
  { id: 'e11', employeeId: 'EMP003', name: 'Amit Patel', pan: 'GHIAP9012C', tdsAmount: 16250, month: 'Jan 2025' }],

  createdAt: '2025-01-25T10:00:00',
  updatedAt: '2025-01-25T10:00:00',
  createdBy: 'HR Admin',
  paymentMode: null,
  receiptNumber: null,
  dueDate: '2025-02-07',
  attachments: [],
  history: [
  { id: 'h5', action: 'Challan Created', performedBy: 'HR Admin', timestamp: '2025-01-25T10:00:00', details: 'Generated from TDS computation' }]

}];


const availableEmployees = [
{ id: 'emp1', employeeId: 'EMP001', name: 'Rajesh Kumar', pan: 'ABCPK1234A', pendingTds: 9375 },
{ id: 'emp2', employeeId: 'EMP002', name: 'Priya Sharma', pan: 'DEFPS5678B', pendingTds: 5208 },
{ id: 'emp3', employeeId: 'EMP003', name: 'Amit Patel', pan: 'GHIAP9012C', pendingTds: 16250 },
{ id: 'emp4', employeeId: 'EMP004', name: 'Sneha Reddy', pan: 'JKLSR3456D', pendingTds: 3500 },
{ id: 'emp5', employeeId: 'EMP005', name: 'Vikram Singh', pan: 'MNOPV7890E', pendingTds: 8625 },
{ id: 'emp6', employeeId: 'EMP006', name: 'Ananya Gupta', pan: 'QRSAG1234F', pendingTds: 6000 }];


// Utility Functions
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateChallanNumber = (year: string): string => {
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CH/${year}/${random}`;
};

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatCurrencyFull = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getMonthLabel = (value: string): string => {
  const month = MONTHS.find((m) => m.value === value);
  return month?.label || value;
};

const isPastDue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export function ChallanTaxPaymentRegister() {
  // Core State
  const [challans, setChallans] = useState<Challan[]>(initialChallans);
  const [filters, setFilters] = useState<FilterState>({
    fiscalYear: '2024-25',
    quarter: 'all',
    month: 'all',
    status: 'all',
    search: '',
    bankName: 'all'
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc'
  });

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLinkEmployeesModal, setShowLinkEmployeesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Selected State
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);
  const [selectedChallans, setSelectedChallans] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Challan>>({
    challanNumber: '',
    bsrCode: '',
    bankName: '',
    bankBranch: '',
    paymentDate: null,
    periodFrom: '',
    periodTo: '',
    tdsAmount: 0,
    interest: 0,
    penalty: 0,
    remarks: '',
    minorHead: '200',
    assessmentYear: '2025-26',
    linkedEmployees: []
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    bsrCode: '',
    bankName: '',
    bankBranch: '',
    paymentDate: '',
    acknowledgementNumber: '',
    receiptNumber: '',
    paymentMode: 'online',
    interest: 0,
    penalty: 0
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const [selectedEmployeesToLink, setSelectedEmployeesToLink] = useState<string[]>([]);

  // Notification State
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: ''
  });

  // Computed Values
  const filteredChallans = useMemo(() => {
    let result = [...challans];

    // Quarter filter
    if (filters.quarter !== 'all') {

      // Filter based on quarter logic
    }
    // Month filter
    if (filters.month !== 'all') {
      result = result.filter(
        (c) => c.periodFrom === filters.month || c.periodTo === filters.month
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((c) => c.status.toLowerCase() === filters.status);
    }

    // Bank filter
    if (filters.bankName !== 'all') {
      result = result.filter((c) =>
      c.bankName.toLowerCase().includes(filters.bankName)
      );
    }

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
        c.challanNumber.toLowerCase().includes(query) ||
        c.bsrCode.toLowerCase().includes(query) ||
        c.bankName.toLowerCase().includes(query) ||
        c.acknowledgementNumber?.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [challans, filters, sortConfig]);

  const statistics = useMemo(() => {
    const total = filteredChallans.length;
    const paid = filteredChallans.filter((c) => c.status === 'Paid');
    const pending = filteredChallans.filter((c) => c.status === 'Pending');
    const overdue = filteredChallans.filter((c) => c.status === 'Overdue');

    const totalPaidAmount = paid.reduce((sum, c) => sum + c.totalPaid, 0);
    const totalPendingAmount = pending.reduce((sum, c) => sum + c.tdsAmount, 0);
    const totalOverdueAmount = overdue.reduce((sum, c) => sum + c.tdsAmount, 0);

    return {
      total,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      totalPaidAmount,
      totalPendingAmount,
      totalOverdueAmount,
      totalAmount: totalPaidAmount + totalPendingAmount + totalOverdueAmount
    };
  }, [filteredChallans]);

  // Effects
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('challanRegister');
    if (savedData) {
      try {
        setChallans(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('challanRegister', JSON.stringify(challans));
  }, [challans]);

  // Check for overdue challans
  useEffect(() => {
    const checkOverdue = () => {
      setChallans((prev) =>
      prev.map((c) => {
        if (c.status === 'Pending' && isPastDue(c.dueDate)) {
          return { ...c, status: 'Overdue' };
        }
        return c;
      })
      );
    };
    checkOverdue();
  }, []);

  // Utility Functions
  const showNotification = (type: Notification['type'], message: string) => {
    setNotification({ show: true, type, message });
  };

  const addToHistory = (
  challan: Challan,
  action: string,
  details: string,
  previousStatus?: string,
  newStatus?: string)
  : ChallanHistory => {
    return {
      id: generateId(),
      action,
      performedBy: 'HR Admin',
      timestamp: new Date().toISOString(),
      details,
      previousStatus,
      newStatus
    };
  };

  // Filter Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      fiscalYear: '2024-25',
      quarter: 'all',
      month: 'all',
      status: 'all',
      search: '',
      bankName: 'all'
    });
    showNotification('info', 'Filters reset');
  };

  // Sort Handler
  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Selection Handlers
  const handleSelectChallan = (challanId: string) => {
    setSelectedChallans((prev) =>
    prev.includes(challanId) ?
    prev.filter((id) => id !== challanId) :
    [...prev, challanId]
    );
  };

  const handleSelectAll = () => {
    if (selectedChallans.length === filteredChallans.length) {
      setSelectedChallans([]);
    } else {
      setSelectedChallans(filteredChallans.map((c) => c.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedChallans([]);
  };

  // Form Handlers
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  };

  const handlePaymentFormChange = (field: string, value: any) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      challanNumber: generateChallanNumber('2025'),
      bsrCode: '',
      bankName: '',
      bankBranch: '',
      paymentDate: null,
      periodFrom: '',
      periodTo: '',
      tdsAmount: 0,
      interest: 0,
      penalty: 0,
      remarks: '',
      minorHead: '200',
      assessmentYear: '2025-26',
      linkedEmployees: []
    });
    setValidationErrors([]);
    setSelectedEmployeesToLink([]);
  };

  // Validation
  const validateChallanForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!formData.periodFrom) {
      errors.push({ field: 'periodFrom', message: 'Period From is required' });
    }

    if (!formData.periodTo) {
      errors.push({ field: 'periodTo', message: 'Period To is required' });
    }

    if (!formData.tdsAmount || formData.tdsAmount <= 0) {
      errors.push({ field: 'tdsAmount', message: 'TDS amount must be greater than 0' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validatePaymentForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!paymentData.bsrCode.trim()) {
      errors.push({ field: 'bsrCode', message: 'BSR Code is required' });
    }

    if (!paymentData.bankName.trim()) {
      errors.push({ field: 'bankName', message: 'Bank name is required' });
    }

    if (!paymentData.paymentDate) {
      errors.push({ field: 'paymentDate', message: 'Payment date is required' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // CRUD Operations
  const handleOpenAddModal = () => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      challanNumber: generateChallanNumber('2025')
    }));
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleSaveChallan = async () => {
    if (!validateChallanForm()) {
      showNotification('error', 'Please fix validation errors');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date().toISOString();
      const dueDate = new Date();
      dueDate.setDate(7);
      dueDate.setMonth(dueDate.getMonth() + 1);

      const newChallan: Challan = {
        id: generateId(),
        challanNumber: formData.challanNumber || generateChallanNumber('2025'),
        bsrCode: formData.bsrCode || '',
        bankName: formData.bankName || '',
        bankBranch: formData.bankBranch || '',
        paymentDate: formData.paymentDate || null,
        periodFrom: formData.periodFrom || '',
        periodTo: formData.periodTo || '',
        tdsAmount: formData.tdsAmount || 0,
        interest: formData.interest || 0,
        penalty: formData.penalty || 0,
        totalPaid: 0,
        status: 'Pending',
        remarks: formData.remarks || '',
        acknowledgementNumber: null,
        depositDate: null,
        minorHead: formData.minorHead || '200',
        assessmentYear: formData.assessmentYear || '2025-26',
        linkedEmployees: formData.linkedEmployees || [],
        createdAt: now,
        updatedAt: now,
        createdBy: 'HR Admin',
        paymentMode: null,
        receiptNumber: null,
        dueDate: dueDate.toISOString().split('T')[0],
        attachments: [],
        history: [
        {
          id: generateId(),
          action: 'Challan Created',
          performedBy: 'HR Admin',
          timestamp: now,
          details: 'New challan generated'
        }]

      };

      setChallans((prev) => [newChallan, ...prev]);
      handleCloseAddModal();
      showNotification('success', `Challan ${newChallan.challanNumber} created successfully`);
    } catch (error) {
      showNotification('error', 'Failed to create challan');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Challan
  const handleOpenEditModal = (challan: Challan) => {
    if (challan.status === 'Paid') {
      showNotification('warning', 'Cannot edit a paid challan');
      return;
    }
    setSelectedChallan(challan);
    setFormData({
      challanNumber: challan.challanNumber,
      bsrCode: challan.bsrCode,
      bankName: challan.bankName,
      bankBranch: challan.bankBranch,
      paymentDate: challan.paymentDate,
      periodFrom: challan.periodFrom,
      periodTo: challan.periodTo,
      tdsAmount: challan.tdsAmount,
      interest: challan.interest,
      penalty: challan.penalty,
      remarks: challan.remarks,
      minorHead: challan.minorHead,
      assessmentYear: challan.assessmentYear,
      linkedEmployees: challan.linkedEmployees
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedChallan(null);
    resetForm();
  };

  const handleUpdateChallan = async () => {
    if (!selectedChallan || !validateChallanForm()) {
      showNotification('error', 'Please fix validation errors');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date().toISOString();
      setChallans((prev) =>
      prev.map((c) => {
        if (c.id === selectedChallan.id) {
          const historyEntry = addToHistory(
            c,
            'Challan Updated',
            'Challan details modified'
          );
          return {
            ...c,
            ...formData,
            updatedAt: now,
            history: [historyEntry, ...c.history]
          };
        }
        return c;
      })
      );

      handleCloseEditModal();
      showNotification('success', 'Challan updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update challan');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Challan
  const handleOpenDeleteConfirm = (challan: Challan) => {
    if (challan.status === 'Paid') {
      showNotification('warning', 'Cannot delete a paid challan');
      return;
    }
    setSelectedChallan(challan);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setSelectedChallan(null);
  };

  const handleDeleteChallan = async () => {
    if (!selectedChallan) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setChallans((prev) => prev.filter((c) => c.id !== selectedChallan.id));
      handleCloseDeleteConfirm();
      showNotification('success', `Challan ${selectedChallan.challanNumber} deleted`);
    } catch (error) {
      showNotification('error', 'Failed to delete challan');
    } finally {
      setIsLoading(false);
    }
  };

  // View Details
  const handleViewDetails = (challan: Challan) => {
    setSelectedChallan(challan);
    setShowDetailDrawer(true);
  };

  const handleCloseDetailDrawer = () => {
    setShowDetailDrawer(false);
    setSelectedChallan(null);
  };

  // Payment Modal
  const handleOpenPaymentModal = (challan: Challan) => {
    if (challan.status === 'Paid') {
      showNotification('info', 'This challan is already paid');
      return;
    }
    setSelectedChallan(challan);
    setPaymentData({
      bsrCode: challan.bsrCode || '',
      bankName: challan.bankName || '',
      bankBranch: challan.bankBranch || '',
      paymentDate: new Date().toISOString().split('T')[0],
      acknowledgementNumber: '',
      receiptNumber: '',
      paymentMode: 'online',
      interest: challan.interest || 0,
      penalty: challan.penalty || 0
    });
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedChallan(null);
    setPaymentData({
      bsrCode: '',
      bankName: '',
      bankBranch: '',
      paymentDate: '',
      acknowledgementNumber: '',
      receiptNumber: '',
      paymentMode: 'online',
      interest: 0,
      penalty: 0
    });
    setValidationErrors([]);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedChallan || !validatePaymentForm()) {
      showNotification('error', 'Please fix validation errors');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      const totalPaid =
      selectedChallan.tdsAmount + paymentData.interest + paymentData.penalty;

      setChallans((prev) =>
      prev.map((c) => {
        if (c.id === selectedChallan.id) {
          const historyEntry = addToHistory(
            c,
            'Payment Recorded',
            `Payment of ${formatCurrencyFull(totalPaid)} via ${paymentData.paymentMode}`,
            c.status,
            'Paid'
          );
          return {
            ...c,
            bsrCode: paymentData.bsrCode,
            bankName: paymentData.bankName,
            bankBranch: paymentData.bankBranch,
            paymentDate: paymentData.paymentDate,
            acknowledgementNumber: paymentData.acknowledgementNumber || `ACK${Date.now()}`,
            receiptNumber: paymentData.receiptNumber || `RCP/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
            depositDate: paymentData.paymentDate,
            paymentMode: paymentData.paymentMode === 'online' ? 'Online' : 'Offline',
            interest: paymentData.interest,
            penalty: paymentData.penalty,
            totalPaid,
            status: 'Paid',
            updatedAt: now,
            history: [historyEntry, ...c.history]
          };
        }
        return c;
      })
      );

      handleClosePaymentModal();
      if (showDetailDrawer) {
        // Update selected challan for detail view
        setSelectedChallan((prev) =>
        prev ?
        {
          ...prev,
          status: 'Paid',
          totalPaid,
          paymentDate: paymentData.paymentDate
        } :
        null
        );
      }
      showNotification('success', `Payment of ${formatCurrencyFull(totalPaid)} recorded successfully`);
    } catch (error) {
      showNotification('error', 'Failed to record payment');
    } finally {
      setIsSaving(false);
    }
  };

  // Link Employees Modal
  const handleOpenLinkEmployeesModal = (challan: Challan) => {
    if (challan.status === 'Paid') {
      showNotification('warning', 'Cannot modify a paid challan');
      return;
    }
    setSelectedChallan(challan);
    setSelectedEmployeesToLink(challan.linkedEmployees.map((e) => e.id));
    setShowLinkEmployeesModal(true);
  };

  const handleCloseLinkEmployeesModal = () => {
    setShowLinkEmployeesModal(false);
    setSelectedChallan(null);
    setSelectedEmployeesToLink([]);
  };

  const handleToggleEmployeeLink = (employeeId: string) => {
    setSelectedEmployeesToLink((prev) =>
    prev.includes(employeeId) ?
    prev.filter((id) => id !== employeeId) :
    [...prev, employeeId]
    );
  };

  const handleSaveLinkedEmployees = async () => {
    if (!selectedChallan) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const linkedEmployees: LinkedEmployee[] = selectedEmployeesToLink.map((id) => {
        const existing = selectedChallan.linkedEmployees.find((e) => e.id === id);
        if (existing) return existing;

        const emp = availableEmployees.find((e) => e.id === id);
        if (emp) {
          return {
            id,
            employeeId: emp.employeeId,
            name: emp.name,
            pan: emp.pan,
            tdsAmount: emp.pendingTds,
            month: getMonthLabel(selectedChallan.periodFrom)
          };
        }
        return null;
      }).filter(Boolean) as LinkedEmployee[];

      const totalTds = linkedEmployees.reduce((sum, e) => sum + e.tdsAmount, 0);
      const now = new Date().toISOString();

      setChallans((prev) =>
      prev.map((c) => {
        if (c.id === selectedChallan.id) {
          const historyEntry = addToHistory(
            c,
            'Employees Linked',
            `${linkedEmployees.length} employees linked with total TDS ${formatCurrencyFull(totalTds)}`
          );
          return {
            ...c,
            linkedEmployees,
            tdsAmount: totalTds,
            updatedAt: now,
            history: [historyEntry, ...c.history]
          };
        }
        return c;
      })
      );

      handleCloseLinkEmployeesModal();
      showNotification('success', `${linkedEmployees.length} employees linked successfully`);
    } catch (error) {
      showNotification('error', 'Failed to link employees');
    } finally {
      setIsSaving(false);
    }
  };

  // History Modal
  const handleOpenHistoryModal = (challan: Challan) => {
    setSelectedChallan(challan);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedChallan(null);
  };

  // Cancel Challan
  const handleCancelChallan = async (challan: Challan) => {
    if (challan.status === 'Paid') {
      showNotification('warning', 'Cannot cancel a paid challan');
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel challan ${challan.challanNumber}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const now = new Date().toISOString();
      setChallans((prev) =>
      prev.map((c) => {
        if (c.id === challan.id) {
          const historyEntry = addToHistory(
            c,
            'Challan Cancelled',
            'Challan marked as cancelled',
            c.status,
            'Cancelled'
          );
          return {
            ...c,
            status: 'Cancelled',
            updatedAt: now,
            history: [historyEntry, ...c.history]
          };
        }
        return c;
      })
      );

      showNotification('info', `Challan ${challan.challanNumber} cancelled`);
    } catch (error) {
      showNotification('error', 'Failed to cancel challan');
    } finally {
      setIsLoading(false);
    }
  };

  // Export
  const handleOpenExportModal = () => {
    setShowExportModal(true);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportFormat('excel');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataToExport =
      selectedChallans.length > 0 ?
      filteredChallans.filter((c) => selectedChallans.includes(c.id)) :
      filteredChallans;

      if (exportFormat === 'csv' || exportFormat === 'excel') {
        const headers = [
        'Challan Number',
        'BSR Code',
        'Bank Name',
        'Payment Date',
        'Period',
        'TDS Amount',
        'Interest',
        'Total Paid',
        'Status',
        'Acknowledgement No'];


        const rows = dataToExport.map((c) => [
        c.challanNumber,
        c.bsrCode || '-',
        c.bankName || '-',
        formatDate(c.paymentDate),
        `${getMonthLabel(c.periodFrom)}`,
        c.tdsAmount,
        c.interest,
        c.totalPaid,
        c.status,
        c.acknowledgementNumber || '-']
        );

        const csvContent = [
        `Challan/Tax Payment Register - FY ${filters.fiscalYear}`,
        '',
        headers.join(','),
        ...rows.map((r) => r.join(',')),
        '',
        `Total Challans,${dataToExport.length}`,
        `Total Paid,${dataToExport.filter((c) => c.status === 'Paid').reduce((sum, c) => sum + c.totalPaid, 0)}`,
        `Generated on,${new Date().toLocaleString()}`].
        join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `challan_register_${filters.fiscalYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // PDF export (simplified)
        const content = dataToExport.
        map(
          (c) =>
          `${c.challanNumber} | ${c.bankName || '-'} | ${formatDate(c.paymentDate)} | ${formatCurrencyFull(c.totalPaid)} | ${c.status}`
        ).
        join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `challan_register_${filters.fiscalYear}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      handleCloseExportModal();
      showNotification('success', `Report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      showNotification('error', 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Download Receipt
  const handleDownloadReceipt = async (challan: Challan) => {
    if (challan.status !== 'Paid') {
      showNotification('warning', 'Receipt available only for paid challans');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const receipt = `
TAX PAYMENT RECEIPT
==================

Challan Number: ${challan.challanNumber}
Acknowledgement Number: ${challan.acknowledgementNumber || '-'}
Receipt Number: ${challan.receiptNumber || '-'}

Bank Details:
- Bank Name: ${challan.bankName}
- Branch: ${challan.bankBranch}
- BSR Code: ${challan.bsrCode}

Payment Details:
- Payment Date: ${formatDate(challan.paymentDate)}
- Payment Mode: ${challan.paymentMode}
- TDS Amount: ${formatCurrencyFull(challan.tdsAmount)}
- Interest: ${formatCurrencyFull(challan.interest)}
- Penalty: ${formatCurrencyFull(challan.penalty)}
- Total Paid: ${formatCurrencyFull(challan.totalPaid)}

Period Covered: ${getMonthLabel(challan.periodFrom)} to ${getMonthLabel(challan.periodTo)}
Assessment Year: ${challan.assessmentYear}
Minor Head: ${challan.minorHead}

Linked Employees: ${challan.linkedEmployees.length}
${challan.linkedEmployees.map((e) => `  - ${e.name} (${e.pan}): ${formatCurrencyFull(e.tdsAmount)}`).join('\n')}

Generated: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([receipt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${challan.challanNumber.replace(/\//g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('success', 'Receipt downloaded');
    } catch (error) {
      showNotification('error', 'Failed to download receipt');
    } finally {
      setIsLoading(false);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      showNotification('success', 'Data refreshed');
    } catch (error) {
      showNotification('error', 'Refresh failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Challan Number
  const handleCopyChallanNumber = async (challanNumber: string) => {
    try {
      await navigator.clipboard.writeText(challanNumber);
      showNotification('success', `Copied: ${challanNumber}`);
    } catch (error) {
      showNotification('error', 'Failed to copy');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :

    <ChevronDown className="w-3 h-3 text-blue-600" />;

  };

  // Check validation error
  const hasError = (field: string): boolean => {
    return validationErrors.some((e) => e.field === field);
  };

  const getError = (field: string): string | undefined => {
    return validationErrors.find((e) => e.field === field)?.message;
  };

  const hasActiveFilters =
  filters.quarter !== 'all' ||
  filters.month !== 'all' ||
  filters.status !== 'all' ||
  filters.bankName !== 'all' ||
  filters.search !== '';

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification.show &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        notification.type === 'success' ?
        'bg-green-50 border border-green-200' :
        notification.type === 'error' ?
        'bg-red-50 border border-red-200' :
        notification.type === 'warning' ?
        'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'}`
        }>

          {notification.type === 'success' ?
        <CheckCircle className="w-5 h-5 text-green-600" /> :
        notification.type === 'error' ?
        <AlertCircle className="w-5 h-5 text-red-600" /> :
        notification.type === 'warning' ?
        <AlertCircle className="w-5 h-5 text-yellow-600" /> :

        <Info className="w-5 h-5 text-blue-600" />
        }
          <span
          className={
          notification.type === 'success' ?
          'text-green-800' :
          notification.type === 'error' ?
          'text-red-800' :
          notification.type === 'warning' ?
          'text-yellow-800' :
          'text-blue-800'
          }>

            {notification.message}
          </span>
          <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700">

            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Challan / Tax Payment Register
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}>

            {isLoading ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <RefreshCw className="w-4 h-4 mr-2" />
            }
            Refresh
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleOpenExportModal}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleOpenAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Challan
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
            {hasActiveFilters &&
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline">

                Reset all
              </button>
            }
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 hover:text-blue-800">

            {showFilters ? 'Hide' : 'Show'} advanced
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            options={FISCAL_YEARS}
            value={filters.fiscalYear}
            onChange={(value) => handleFilterChange('fiscalYear', value)} />

          <Select
            options={QUARTERS}
            value={filters.quarter}
            onChange={(value) => handleFilterChange('quarter', value)} />

          <Select
            options={MONTHS}
            value={filters.month}
            onChange={(value) => handleFilterChange('month', value)} />

          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search challans..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10" />

          </div>
        </div>

        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <Select
            label="Bank"
            options={BANK_OPTIONS}
            value={filters.bankName}
            onChange={(value) => handleFilterChange('bankName', value)} />

          </div>
        }
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md"
          onClick={() => handleFilterChange('status', 'all')}>

          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
          <p className="text-sm text-gray-600">Total Challans Generated</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md"
          onClick={() => handleFilterChange('status', 'paid')}>

          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600">{statistics.paidCount}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(statistics.totalPaidAmount)}
          </p>
          <p className="text-sm text-gray-600">Total Amount Paid</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-md"
          onClick={() => handleFilterChange('status', 'pending')}>

          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600">{statistics.pendingCount}</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {formatCurrency(statistics.totalPendingAmount)}
          </p>
          <p className="text-sm text-gray-600">Pending Payments</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md"
          onClick={() => handleFilterChange('status', 'overdue')}>

          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600">{statistics.overdueCount}</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {formatCurrency(statistics.totalOverdueAmount)}
          </p>
          <p className="text-sm text-gray-600">Overdue Payments</p>
        </Card>
      </div>

      {/* Selection Actions */}
      {selectedChallans.length > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-800">
                {selectedChallans.length} challan(s) selected
              </span>
              <button
              onClick={handleClearSelection}
              className="text-sm text-blue-600 hover:text-blue-800 underline">

                Clear selection
              </button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenExportModal}>
                <Download className="w-4 h-4 mr-1" />
                Export Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Challan Register Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                    selectedChallans.length === filteredChallans.length &&
                    filteredChallans.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded" />

                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('challanNumber')}>

                  <div className="flex items-center gap-1">
                    Challan Number
                    {renderSortIndicator('challanNumber')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  BSR Code
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('bankName')}>

                  <div className="flex items-center gap-1">
                    Bank Name
                    {renderSortIndicator('bankName')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('paymentDate')}>

                  <div className="flex items-center gap-1">
                    Payment Date
                    {renderSortIndicator('paymentDate')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  Period Covered
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('tdsAmount')}>

                  <div className="flex items-center justify-end gap-1">
                    TDS Amount
                    {renderSortIndicator('tdsAmount')}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Interest
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('totalPaid')}>

                  <div className="flex items-center justify-end gap-1">
                    Total Paid
                    {renderSortIndicator('totalPaid')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center gap-1">
                    Status
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredChallans.length === 0 ?
              <tr>
                  <td colSpan={11} className="px-4 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No challans found</p>
                    {hasActiveFilters &&
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline">

                        Clear filters
                      </button>
                  }
                  </td>
                </tr> :

              filteredChallans.map((challan) =>
              <tr
                key={challan.id}
                className={`hover:bg-gray-50 ${
                selectedChallans.includes(challan.id) ? 'bg-blue-50' : ''}`
                }>

                    <td className="px-4 py-3 text-center">
                      <input
                    type="checkbox"
                    checked={selectedChallans.includes(challan.id)}
                    onChange={() => handleSelectChallan(challan.id)}
                    className="rounded" />

                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-gray-900">
                          {challan.challanNumber}
                        </span>
                        <button
                      onClick={() => handleCopyChallanNumber(challan.challanNumber)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy">

                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-700">
                        {challan.bsrCode || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {challan.bankName || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(challan.paymentDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {getMonthLabel(challan.periodFrom)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrencyFull(challan.tdsAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {challan.interest === 0 ?
                  '-' :
                  formatCurrencyFull(challan.interest)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {challan.totalPaid > 0 ?
                  formatCurrencyFull(challan.totalPaid) :
                  '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    challan.status === 'Paid' ?
                    'bg-green-100 text-green-700' :
                    challan.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    challan.status === 'Overdue' ?
                    'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                    }>

                        {challan.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                      onClick={() => handleViewDetails(challan)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                        {challan.status !== 'Paid' && challan.status !== 'Cancelled' &&
                    <>
                            <button
                        onClick={() => handleOpenEditModal(challan)}
                        className="p-1 rounded hover:bg-gray-200 text-gray-500"
                        title="Edit">

                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                        onClick={() => handleOpenPaymentModal(challan)}
                        className="p-1 rounded hover:bg-green-100 text-gray-500 hover:text-green-600"
                        title="Record Payment">

                              <DollarSign className="w-4 h-4" />
                            </button>
                          </>
                    }
                        {challan.status === 'Paid' &&
                    <button
                      onClick={() => handleDownloadReceipt(challan)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="Download Receipt">

                            <Download className="w-4 h-4" />
                          </button>
                    }
                        <button
                      onClick={() => handleOpenHistoryModal(challan)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="View History">

                          <History className="w-4 h-4" />
                        </button>
                        {challan.status !== 'Paid' && challan.status !== 'Cancelled' &&
                    <button
                      onClick={() => handleOpenDeleteConfirm(challan)}
                      className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
                      title="Delete">

                            <Trash2 className="w-4 h-4" />
                          </button>
                    }
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
            {filteredChallans.length > 0 &&
            <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={6} className="px-4 py-3 font-semibold">
                    Total ({filteredChallans.length} challans)
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {formatCurrencyFull(
                    filteredChallans.reduce((sum, c) => sum + c.tdsAmount, 0)
                  )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {formatCurrencyFull(
                    filteredChallans.reduce((sum, c) => sum + c.interest, 0)
                  )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">
                    {formatCurrencyFull(
                    filteredChallans.reduce((sum, c) => sum + c.totalPaid, 0)
                  )}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            }
          </table>
        </div>
      </Card>

      {/* Add Challan Modal */}
      {showAddModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Challan Details</h2>
                <button
                onClick={handleCloseAddModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Challan Number
                    </label>
                    <Input
                    value={formData.challanNumber}
                    onChange={(e) => handleFormChange('challanNumber', e.target.value)}
                    placeholder="Auto-generated" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment Year
                    </label>
                    <Select
                    options={[
                    { value: '2025-26', label: 'AY 2025-26' },
                    { value: '2024-25', label: 'AY 2024-25' }]
                    }
                    value={formData.assessmentYear}
                    onChange={(value) => handleFormChange('assessmentYear', value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period From *
                    </label>
                    <Select
                    options={MONTHS.filter((m) => m.value !== 'all')}
                    value={formData.periodFrom}
                    onChange={(value) => handleFormChange('periodFrom', value)} />

                    {hasError('periodFrom') &&
                  <p className="text-sm text-red-600 mt-1">{getError('periodFrom')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period To *
                    </label>
                    <Select
                    options={MONTHS.filter((m) => m.value !== 'all')}
                    value={formData.periodTo}
                    onChange={(value) => handleFormChange('periodTo', value)} />

                    {hasError('periodTo') &&
                  <p className="text-sm text-red-600 mt-1">{getError('periodTo')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minor Head
                    </label>
                    <Select
                    options={MINOR_HEAD_OPTIONS}
                    value={formData.minorHead}
                    onChange={(value) => handleFormChange('minorHead', value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TDS Amount *
                    </label>
                    <Input
                    type="number"
                    placeholder="Enter TDS amount"
                    value={formData.tdsAmount || ''}
                    onChange={(e) =>
                    handleFormChange('tdsAmount', parseInt(e.target.value) || 0)
                    } />

                    {hasError('tdsAmount') &&
                  <p className="text-sm text-red-600 mt-1">{getError('tdsAmount')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest (if any)
                    </label>
                    <Input
                    type="number"
                    placeholder="Enter interest"
                    value={formData.interest || ''}
                    onChange={(e) =>
                    handleFormChange('interest', parseInt(e.target.value) || 0)
                    } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penalty (if any)
                    </label>
                    <Input
                    type="number"
                    placeholder="Enter penalty"
                    value={formData.penalty || ''}
                    onChange={(e) =>
                    handleFormChange('penalty', parseInt(e.target.value) || 0)
                    } />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <Textarea
                  rows={3}
                  placeholder="Enter any remarks..."
                  value={formData.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)} />

                </div>

                {formData.tdsAmount && formData.tdsAmount > 0 &&
              <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Total Amount:</strong>{' '}
                      {formatCurrencyFull(
                    (formData.tdsAmount || 0) + (
                    formData.interest || 0) + (
                    formData.penalty || 0)
                  )}
                    </p>
                  </div>
              }

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleCloseAddModal}>
                    Cancel
                  </Button>
                  <Button
                  variant="primary"
                  onClick={handleSaveChallan}
                  disabled={isSaving}>

                    {isSaving ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <Save className="w-4 h-4 mr-2" />
                  }
                    Save Challan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Edit Challan Modal */}
      {showEditModal && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Challan</h2>
                <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-mono font-medium">{selectedChallan.challanNumber}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period From *
                    </label>
                    <Select
                    options={MONTHS.filter((m) => m.value !== 'all')}
                    value={formData.periodFrom}
                    onChange={(value) => handleFormChange('periodFrom', value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period To *
                    </label>
                    <Select
                    options={MONTHS.filter((m) => m.value !== 'all')}
                    value={formData.periodTo}
                    onChange={(value) => handleFormChange('periodTo', value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TDS Amount *
                    </label>
                    <Input
                    type="number"
                    value={formData.tdsAmount || ''}
                    onChange={(e) =>
                    handleFormChange('tdsAmount', parseInt(e.target.value) || 0)
                    } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest
                    </label>
                    <Input
                    type="number"
                    value={formData.interest || ''}
                    onChange={(e) =>
                    handleFormChange('interest', parseInt(e.target.value) || 0)
                    } />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <Textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)} />

                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleCloseEditModal}>
                    Cancel
                  </Button>
                  <Button
                  variant="primary"
                  onClick={handleUpdateChallan}
                  disabled={isSaving}>

                    {isSaving ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <Save className="w-4 h-4 mr-2" />
                  }
                    Update Challan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Payment Modal */}
      {showPaymentModal && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                <button
                onClick={handleClosePaymentModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Challan Number</p>
                      <p className="font-mono font-medium">{selectedChallan.challanNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">TDS Amount</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrencyFull(selectedChallan.tdsAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BSR Code *
                    </label>
                    <Input
                    placeholder="Enter BSR code"
                    value={paymentData.bsrCode}
                    onChange={(e) => handlePaymentFormChange('bsrCode', e.target.value)}
                    className={hasError('bsrCode') ? 'border-red-500' : ''} />

                    {hasError('bsrCode') &&
                  <p className="text-sm text-red-600 mt-1">{getError('bsrCode')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <Input
                    placeholder="Enter bank name"
                    value={paymentData.bankName}
                    onChange={(e) => handlePaymentFormChange('bankName', e.target.value)}
                    className={hasError('bankName') ? 'border-red-500' : ''} />

                    {hasError('bankName') &&
                  <p className="text-sm text-red-600 mt-1">{getError('bankName')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Branch
                    </label>
                    <Input
                    placeholder="Enter branch"
                    value={paymentData.bankBranch}
                    onChange={(e) => handlePaymentFormChange('bankBranch', e.target.value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Date *
                    </label>
                    <Input
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => handlePaymentFormChange('paymentDate', e.target.value)}
                    className={hasError('paymentDate') ? 'border-red-500' : ''} />

                    {hasError('paymentDate') &&
                  <p className="text-sm text-red-600 mt-1">{getError('paymentDate')}</p>
                  }
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Mode
                    </label>
                    <Select
                    options={PAYMENT_MODE_OPTIONS}
                    value={paymentData.paymentMode}
                    onChange={(value) => handlePaymentFormChange('paymentMode', value)} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Acknowledgement Number
                    </label>
                    <Input
                    placeholder="Auto-generated if empty"
                    value={paymentData.acknowledgementNumber}
                    onChange={(e) =>
                    handlePaymentFormChange('acknowledgementNumber', e.target.value)
                    } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest
                    </label>
                    <Input
                    type="number"
                    value={paymentData.interest || ''}
                    onChange={(e) =>
                    handlePaymentFormChange('interest', parseInt(e.target.value) || 0)
                    } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penalty
                    </label>
                    <Input
                    type="number"
                    value={paymentData.penalty || ''}
                    onChange={(e) =>
                    handlePaymentFormChange('penalty', parseInt(e.target.value) || 0)
                    } />

                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-800">Total Payment Amount</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrencyFull(
                      selectedChallan.tdsAmount +
                      paymentData.interest +
                      paymentData.penalty
                    )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleClosePaymentModal}>
                    Cancel
                  </Button>
                  <Button
                  variant="primary"
                  onClick={handleMarkAsPaid}
                  disabled={isSaving}>

                    {isSaving ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <CheckCircle className="w-4 h-4 mr-2" />
                  }
                    Mark as Paid
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Delete Challan</h3>
                  <p className="text-gray-600 mt-1">
                    Are you sure you want to delete challan{' '}
                    <strong>{selectedChallan.challanNumber}</strong>? This action cannot be
                    undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseDeleteConfirm}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleDeleteChallan}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700">

                  {isLoading ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Trash2 className="w-4 h-4 mr-2" />
                }
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Challan History</h2>
                <button
                onClick={handleCloseHistoryModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedChallan.challanNumber}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedChallan.history.length === 0 ?
            <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No history available</p>
                </div> :

            <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  {selectedChallan.history.map((entry) =>
              <div key={entry.id} className="relative pl-10 pb-6">
                      <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(entry.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        {entry.previousStatus && entry.newStatus &&
                  <p className="text-xs text-gray-500 mt-1">
                            Status: {entry.previousStatus} → {entry.newStatus}
                          </p>
                  }
                        <p className="text-xs text-gray-400 mt-1">By: {entry.performedBy}</p>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>

            <div className="p-4 border-t">
              <Button variant="outline" onClick={handleCloseHistoryModal} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Export Report</h2>
                <button
                onClick={handleCloseExportModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Exporting{' '}
                  {selectedChallans.length > 0 ?
                `${selectedChallans.length} selected` :
                filteredChallans.length}{' '}
                  challan(s)
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['csv', 'excel', 'pdf'] as const).map((format) =>
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  exportFormat === format ?
                  'bg-blue-600 text-white border-blue-600' :
                  'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`
                  }>

                      {format.toUpperCase()}
                    </button>
                )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseExportModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleExport} disabled={isExporting}>
                  {isExporting ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </> :

                <>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </>
                }
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Challan Detail Drawer */}
      {showDetailDrawer && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-900">Challan Details</h2>
              <button
              onClick={handleCloseDetailDrawer}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Challan Summary */}
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Challan Number</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium text-gray-900">
                        {selectedChallan.challanNumber}
                      </p>
                      <button
                      onClick={() => handleCopyChallanNumber(selectedChallan.challanNumber)}
                      className="text-gray-400 hover:text-gray-600">

                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">BSR Code</p>
                    <p className="font-mono font-medium text-gray-900">
                      {selectedChallan.bsrCode || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bank Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedChallan.bankName || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedChallan.paymentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Period Covered</p>
                    <p className="font-medium text-gray-900">
                      {getMonthLabel(selectedChallan.periodFrom)}
                      {selectedChallan.periodTo !== selectedChallan.periodFrom &&
                    ` - ${getMonthLabel(selectedChallan.periodTo)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <Badge
                    className={
                    selectedChallan.status === 'Paid' ?
                    'bg-green-100 text-green-700' :
                    selectedChallan.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    selectedChallan.status === 'Overdue' ?
                    'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                    }>

                      {selectedChallan.status}
                    </Badge>
                  </div>
                  {selectedChallan.acknowledgementNumber &&
                <div className="col-span-2">
                      <p className="text-gray-600">Acknowledgement Number</p>
                      <p className="font-mono font-medium text-gray-900">
                        {selectedChallan.acknowledgementNumber}
                      </p>
                    </div>
                }
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">TDS Amount:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrencyFull(selectedChallan.tdsAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrencyFull(selectedChallan.interest)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Penalty:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrencyFull(selectedChallan.penalty)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold text-gray-900">Total Paid:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {selectedChallan.status === 'Paid' ?
                    formatCurrencyFull(selectedChallan.totalPaid) :
                    '-'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Linked Employees */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Linked Employee TDS ({selectedChallan.linkedEmployees.length})
                  </h3>
                  {selectedChallan.status !== 'Paid' &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenLinkEmployeesModal(selectedChallan)}>

                      <Link2 className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                }
                </div>
                {selectedChallan.linkedEmployees.length === 0 ?
              <p className="text-sm text-gray-500 text-center py-4">
                    No employees linked
                  </p> :

              <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">
                            Employee
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">
                            PAN
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-bold text-gray-600">
                            TDS Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedChallan.linkedEmployees.map((emp) =>
                    <tr key={emp.id}>
                            <td className="px-3 py-2">
                              <p className="text-gray-900">{emp.name}</p>
                              <p className="text-xs text-gray-500">{emp.employeeId}</p>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-gray-700">
                              {emp.pan}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900">
                              {formatCurrencyFull(emp.tdsAmount)}
                            </td>
                          </tr>
                    )}
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="px-3 py-2 font-semibold">
                            Total
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-blue-600">
                            {formatCurrencyFull(
                          selectedChallan.linkedEmployees.reduce(
                            (sum, e) => sum + e.tdsAmount,
                            0
                          )
                        )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              }
              </Card>

              {/* Remarks */}
              {selectedChallan.remarks &&
            <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Remarks</h3>
                  <p className="text-sm text-gray-600">{selectedChallan.remarks}</p>
                </Card>
            }

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {selectedChallan.status === 'Paid' &&
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDownloadReceipt(selectedChallan)}>

                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
              }
                {selectedChallan.status !== 'Paid' &&
              selectedChallan.status !== 'Cancelled' &&
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  handleCloseDetailDrawer();
                  handleOpenPaymentModal(selectedChallan);
                }}>

                      <DollarSign className="w-4 h-4 mr-2" />
                      Record Payment
                    </Button>
              }
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenHistoryModal(selectedChallan)}>

                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
                {selectedChallan.status !== 'Paid' &&
              selectedChallan.status !== 'Cancelled' &&
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  handleCloseDetailDrawer();
                  handleCancelChallan(selectedChallan);
                }}>

                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Challan
                    </Button>
              }
              </div>
            </div>
          </div>
        </div>
      }

      {/* Link Employees Modal */}
      {showLinkEmployeesModal && selectedChallan &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Link Employees</h2>
                <button
                onClick={handleCloseLinkEmployeesModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {selectedChallan.challanNumber} • {getMonthLabel(selectedChallan.periodFrom)}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {availableEmployees.map((emp) =>
              <div
                key={emp.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedEmployeesToLink.includes(emp.id) ?
                'bg-blue-50 border-blue-300' :
                'hover:bg-gray-50'}`
                }
                onClick={() => handleToggleEmployeeLink(emp.id)}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                      type="checkbox"
                      checked={selectedEmployeesToLink.includes(emp.id)}
                      onChange={() => handleToggleEmployeeLink(emp.id)}
                      className="rounded" />

                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">
                            {emp.employeeId} • {emp.pan}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">
                        {formatCurrencyFull(emp.pendingTds)}
                      </p>
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {selectedEmployeesToLink.length} employee(s) selected
                </span>
                <span className="font-bold text-blue-600">
                  Total:{' '}
                  {formatCurrencyFull(
                  availableEmployees.
                  filter((e) => selectedEmployeesToLink.includes(e.id)).
                  reduce((sum, e) => sum + e.pendingTds, 0)
                )}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCloseLinkEmployeesModal} className="flex-1">
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSaveLinkedEmployees}
                disabled={isSaving}
                className="flex-1">

                  {isSaving ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Link2 className="w-4 h-4 mr-2" />
                }
                  Save Links
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }
    </div>);

}