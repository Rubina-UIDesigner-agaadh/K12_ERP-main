import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Calculator,
  Lock,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  Edit2,
  History,
  Printer,
  Copy,
  Unlock,
  Send,
  FileText,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Info,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  MoreVertical,
  Check,
  XCircle,
  Save,
  RotateCcw } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  pan: string;
  regime: 'New' | 'Old';
  grossMonthly: number;
  taxableMonthly: number;
  calculatedTds: number;
  adjustedTds: number;
  finalTds: number;
  ytdTds: number;
  ytdTaxable: number;
  status: 'Pending' | 'Ready' | 'Computed' | 'Locked' | 'Transferred';
  lockedAt: string | null;
  lockedBy: string | null;
  transferredAt: string | null;
  remarks: string;
  tdsHistory: TdsHistoryEntry[];
}

interface TdsHistoryEntry {
  id: string;
  month: string;
  year: string;
  grossAmount: number;
  taxableAmount: number;
  tdsAmount: number;
  adjustedAmount: number;
  status: string;
  processedAt: string;
  processedBy: string;
  remarks: string;
}

interface TransferRecord {
  id: string;
  month: string;
  year: string;
  totalTds: number;
  employeeCount: number;
  challanNumber: string;
  transferDate: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
  completedAt: string | null;
  createdBy: string;
}

interface MonthOption {
  value: string;
  label: string;
  month: number;
  year: number;
}

interface SortConfig {
  key: keyof Employee | 'finalTds';
  direction: 'asc' | 'desc';
}

interface Notification {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Constants
const MONTHS: MonthOption[] = [
{ value: 'jan-2025', label: 'January 2025', month: 1, year: 2025 },
{ value: 'dec-2024', label: 'December 2024', month: 12, year: 2024 },
{ value: 'nov-2024', label: 'November 2024', month: 11, year: 2024 },
{ value: 'oct-2024', label: 'October 2024', month: 10, year: 2024 },
{ value: 'sep-2024', label: 'September 2024', month: 9, year: 2024 },
{ value: 'aug-2024', label: 'August 2024', month: 8, year: 2024 }];


const DEPARTMENTS = [
{ value: 'all', label: 'All Departments' },
{ value: 'it', label: 'IT' },
{ value: 'hr', label: 'HR' },
{ value: 'finance', label: 'Finance' },
{ value: 'sales', label: 'Sales' },
{ value: 'marketing', label: 'Marketing' },
{ value: 'operations', label: 'Operations' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'pending', label: 'Pending' },
{ value: 'ready', label: 'Ready' },
{ value: 'computed', label: 'Computed' },
{ value: 'locked', label: 'Locked' },
{ value: 'transferred', label: 'Transferred' }];


// Sample Employee Data
const initialEmployees: Employee[] = [
{
  id: '1',
  employeeId: 'EMP001',
  name: 'Rajesh Kumar',
  department: 'IT',
  designation: 'Senior Developer',
  email: 'rajesh.kumar@company.com',
  pan: 'ABCPK1234A',
  regime: 'New',
  grossMonthly: 100000,
  taxableMonthly: 83333,
  calculatedTds: 9375,
  adjustedTds: 0,
  finalTds: 9375,
  ytdTds: 84375,
  ytdTaxable: 750000,
  status: 'Ready',
  lockedAt: null,
  lockedBy: null,
  transferredAt: null,
  remarks: '',
  tdsHistory: [
  {
    id: 'h1',
    month: 'December',
    year: '2024',
    grossAmount: 100000,
    taxableAmount: 83333,
    tdsAmount: 9375,
    adjustedAmount: 0,
    status: 'Transferred',
    processedAt: '2024-12-25T10:00:00',
    processedBy: 'HR Admin',
    remarks: 'Regular monthly TDS'
  }]

},
{
  id: '2',
  employeeId: 'EMP002',
  name: 'Priya Sharma',
  department: 'HR',
  designation: 'HR Manager',
  email: 'priya.sharma@company.com',
  pan: 'DEFPS5678B',
  regime: 'Old',
  grossMonthly: 79167,
  taxableMonthly: 62500,
  calculatedTds: 5208,
  adjustedTds: 0,
  finalTds: 5208,
  ytdTds: 46872,
  ytdTaxable: 562500,
  status: 'Ready',
  lockedAt: null,
  lockedBy: null,
  transferredAt: null,
  remarks: '',
  tdsHistory: []
},
{
  id: '3',
  employeeId: 'EMP003',
  name: 'Amit Patel',
  department: 'Finance',
  designation: 'Financial Analyst',
  email: 'amit.patel@company.com',
  pan: 'GHIAP9012C',
  regime: 'New',
  grossMonthly: 125000,
  taxableMonthly: 111667,
  calculatedTds: 16250,
  adjustedTds: 0,
  finalTds: 16250,
  ytdTds: 146250,
  ytdTaxable: 1005003,
  status: 'Ready',
  lockedAt: null,
  lockedBy: null,
  transferredAt: null,
  remarks: '',
  tdsHistory: []
},
{
  id: '4',
  employeeId: 'EMP004',
  name: 'Sneha Reddy',
  department: 'Sales',
  designation: 'Sales Executive',
  email: 'sneha.reddy@company.com',
  pan: 'JKLSR3456D',
  regime: 'New',
  grossMonthly: 65000,
  taxableMonthly: 52000,
  calculatedTds: 3500,
  adjustedTds: 0,
  finalTds: 3500,
  ytdTds: 31500,
  ytdTaxable: 468000,
  status: 'Pending',
  lockedAt: null,
  lockedBy: null,
  transferredAt: null,
  remarks: 'Declaration pending',
  tdsHistory: []
},
{
  id: '5',
  employeeId: 'EMP005',
  name: 'Vikram Singh',
  department: 'Marketing',
  designation: 'Marketing Lead',
  email: 'vikram.singh@company.com',
  pan: 'MNOPV7890E',
  regime: 'Old',
  grossMonthly: 95000,
  taxableMonthly: 78000,
  calculatedTds: 8125,
  adjustedTds: 500,
  finalTds: 8625,
  ytdTds: 73125,
  ytdTaxable: 702000,
  status: 'Computed',
  lockedAt: null,
  lockedBy: null,
  transferredAt: null,
  remarks: 'Adjustment for previous month shortfall',
  tdsHistory: []
},
{
  id: '6',
  employeeId: 'EMP006',
  name: 'Ananya Gupta',
  department: 'Operations',
  designation: 'Operations Manager',
  email: 'ananya.gupta@company.com',
  pan: 'QRSAG1234F',
  regime: 'New',
  grossMonthly: 85000,
  taxableMonthly: 70000,
  calculatedTds: 6250,
  adjustedTds: -250,
  finalTds: 6000,
  ytdTds: 56250,
  ytdTaxable: 630000,
  status: 'Locked',
  lockedAt: '2025-01-20T14:30:00',
  lockedBy: 'HR Admin',
  transferredAt: null,
  remarks: 'Adjustment for excess deduction',
  tdsHistory: []
}];


// Utility Functions
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatCurrency = (amount: number): string => {
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

// TDS Calculation Function
const calculateTds = (taxableIncome: number, regime: 'New' | 'Old'): number => {
  // Simplified TDS calculation - in production, use actual tax slabs
  let annualTaxable = taxableIncome * 12;
  let annualTax = 0;

  if (regime === 'New') {
    if (annualTaxable <= 300000) {
      annualTax = 0;
    } else if (annualTaxable <= 600000) {
      annualTax = (annualTaxable - 300000) * 0.05;
    } else if (annualTaxable <= 900000) {
      annualTax = 15000 + (annualTaxable - 600000) * 0.10;
    } else if (annualTaxable <= 1200000) {
      annualTax = 45000 + (annualTaxable - 900000) * 0.15;
    } else if (annualTaxable <= 1500000) {
      annualTax = 90000 + (annualTaxable - 1200000) * 0.20;
    } else {
      annualTax = 150000 + (annualTaxable - 1500000) * 0.30;
    }
  } else {
    if (annualTaxable <= 250000) {
      annualTax = 0;
    } else if (annualTaxable <= 500000) {
      annualTax = (annualTaxable - 250000) * 0.05;
    } else if (annualTaxable <= 1000000) {
      annualTax = 12500 + (annualTaxable - 500000) * 0.20;
    } else {
      annualTax = 112500 + (annualTaxable - 1000000) * 0.30;
    }
  }

  // Add 4% cess
  annualTax = annualTax * 1.04;

  // Monthly TDS
  return Math.round(annualTax / 12);
};

export function MonthlyTdsComputationTransfer() {
  // Core State
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedMonth, setSelectedMonth] = useState('jan-2025');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });

  // Transfer Form State
  const [challanNumber, setChallanNumber] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [transferRemarks, setTransferRemarks] = useState('');

  // Transfer Records
  const [transferRecords, setTransferRecords] = useState<TransferRecord[]>([]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Modal State
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showTdsHistory, setShowTdsHistory] = useState(false);
  const [showConfirmProcess, setShowConfirmProcess] = useState(false);
  const [showConfirmLock, setShowConfirmLock] = useState(false);
  const [showConfirmTransfer, setShowConfirmTransfer] = useState(false);
  const [showTransferHistory, setShowTransferHistory] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showBulkAdjustment, setShowBulkAdjustment] = useState(false);
  const [showRecalculateConfirm, setShowRecalculateConfirm] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);

  // Selected Employee State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentRemarks, setAdjustmentRemarks] = useState('');
  const [bulkAdjustmentAmount, setBulkAdjustmentAmount] = useState<number>(0);
  const [bulkAdjustmentType, setBulkAdjustmentType] = useState<'add' | 'subtract'>('add');

  // Validation State
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Notification State
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: ''
  });

  // Computed Values
  const currentMonthData = useMemo(() => {
    return MONTHS.find((m) => m.value === selectedMonth);
  }, [selectedMonth]);

  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Department filter
    if (selectedDepartment !== 'all') {
      result = result.filter(
        (e) => e.department.toLowerCase() === selectedDepartment
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(
        (e) => e.status.toLowerCase() === selectedStatus
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
        e.name.toLowerCase().includes(query) ||
        e.employeeId.toLowerCase().includes(query) ||
        e.pan.toLowerCase().includes(query)
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
  }, [employees, selectedDepartment, selectedStatus, searchQuery, sortConfig]);

  const statistics = useMemo(() => {
    const total = filteredEmployees.length;
    const pending = filteredEmployees.filter((e) => e.status === 'Pending').length;
    const ready = filteredEmployees.filter((e) => e.status === 'Ready').length;
    const computed = filteredEmployees.filter((e) => e.status === 'Computed').length;
    const locked = filteredEmployees.filter((e) => e.status === 'Locked').length;
    const transferred = filteredEmployees.filter((e) => e.status === 'Transferred').length;

    const totalTds = filteredEmployees.reduce((sum, e) => sum + e.finalTds, 0);
    const totalGross = filteredEmployees.reduce((sum, e) => sum + e.grossMonthly, 0);
    const totalTaxable = filteredEmployees.reduce((sum, e) => sum + e.taxableMonthly, 0);
    const totalAdjustments = filteredEmployees.reduce((sum, e) => sum + e.adjustedTds, 0);

    const readyToLock = filteredEmployees.filter(
      (e) => e.status === 'Ready' || e.status === 'Computed'
    ).length;
    const readyToTransfer = filteredEmployees.filter(
      (e) => e.status === 'Locked'
    ).length;

    return {
      total,
      pending,
      ready,
      computed,
      locked,
      transferred,
      totalTds,
      totalGross,
      totalTaxable,
      totalAdjustments,
      readyToLock,
      readyToTransfer
    };
  }, [filteredEmployees]);

  const selectedEmployeesData = useMemo(() => {
    return employees.filter((e) => selectedRows.includes(e.id));
  }, [employees, selectedRows]);

  const selectedTotalTds = useMemo(() => {
    return selectedEmployeesData.reduce((sum, e) => sum + e.finalTds, 0);
  }, [selectedEmployeesData]);

  const canProcessSelected = useMemo(() => {
    return selectedEmployeesData.every(
      (e) => e.status === 'Pending' || e.status === 'Ready'
    );
  }, [selectedEmployeesData]);

  const canLockSelected = useMemo(() => {
    return selectedEmployeesData.every(
      (e) => e.status === 'Ready' || e.status === 'Computed'
    );
  }, [selectedEmployeesData]);

  const canUnlockSelected = useMemo(() => {
    return selectedEmployeesData.every((e) => e.status === 'Locked');
  }, [selectedEmployeesData]);

  // Effects
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`tds_data_${selectedMonth}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEmployees(parsed.employees || initialEmployees);
        setTransferRecords(parsed.transferRecords || []);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, [selectedMonth]);

  // Save data to localStorage
  useEffect(() => {
    const data = { employees, transferRecords };
    localStorage.setItem(`tds_data_${selectedMonth}`, JSON.stringify(data));
  }, [employees, transferRecords, selectedMonth]);

  // Utility Functions
  const showNotification = (type: Notification['type'], message: string) => {
    setNotification({ show: true, type, message });
  };

  // Row Selection Functions
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredEmployees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredEmployees.map((e) => e.id));
    }
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  // Sort Handler
  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter Handlers
  const handleMonthChange = (month: string) => {
    if (selectedRows.length > 0) {
      if (!window.confirm('Changing month will clear your selection. Continue?')) {
        return;
      }
    }
    setSelectedMonth(month);
    setSelectedRows([]);
    showNotification('info', `Switched to ${MONTHS.find((m) => m.value === month)?.label}`);
  };

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
    setSelectedRows([]);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setSelectedRows([]);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setSelectedRows([]);
    showNotification('info', 'Filters reset');
  };

  // Adjustment Handlers
  const handleOpenAdjustment = (employee: Employee) => {
    if (employee.status === 'Locked' || employee.status === 'Transferred') {
      showNotification('warning', 'Cannot adjust locked or transferred TDS');
      return;
    }
    setSelectedEmployee(employee);
    setAdjustmentAmount(employee.adjustedTds);
    setAdjustmentRemarks(employee.remarks);
    setShowAdjustmentModal(true);
  };

  const handleCloseAdjustment = () => {
    setShowAdjustmentModal(false);
    setSelectedEmployee(null);
    setAdjustmentAmount(0);
    setAdjustmentRemarks('');
  };

  const handleSaveAdjustment = async () => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === selectedEmployee.id) {
          const newFinalTds = e.calculatedTds + adjustmentAmount;
          return {
            ...e,
            adjustedTds: adjustmentAmount,
            finalTds: Math.max(0, newFinalTds),
            remarks: adjustmentRemarks,
            status: e.status === 'Ready' ? 'Computed' : e.status
          };
        }
        return e;
      })
      );

      handleCloseAdjustment();
      showNotification('success', `Adjustment saved for ${selectedEmployee.name}`);
    } catch (error) {
      showNotification('error', 'Failed to save adjustment');
    } finally {
      setIsLoading(false);
    }
  };

  // Inline Adjustment Handler
  const handleInlineAdjustment = (employeeId: string, value: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    if (employee.status === 'Locked' || employee.status === 'Transferred') {
      showNotification('warning', 'Cannot adjust locked or transferred TDS');
      return;
    }

    setEmployees((prev) =>
    prev.map((e) => {
      if (e.id === employeeId) {
        const newFinalTds = e.calculatedTds + value;
        return {
          ...e,
          adjustedTds: value,
          finalTds: Math.max(0, newFinalTds),
          status: e.status === 'Ready' ? 'Computed' : e.status
        };
      }
      return e;
    })
    );
  };

  // Bulk Adjustment Handler
  const handleOpenBulkAdjustment = () => {
    if (selectedRows.length === 0) {
      showNotification('warning', 'Please select employees first');
      return;
    }

    const canAdjust = selectedEmployeesData.every(
      (e) => e.status !== 'Locked' && e.status !== 'Transferred'
    );

    if (!canAdjust) {
      showNotification('warning', 'Cannot adjust locked or transferred employees');
      return;
    }

    setBulkAdjustmentAmount(0);
    setBulkAdjustmentType('add');
    setShowBulkAdjustment(true);
  };

  const handleCloseBulkAdjustment = () => {
    setShowBulkAdjustment(false);
    setBulkAdjustmentAmount(0);
  };

  const handleApplyBulkAdjustment = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (selectedRows.includes(e.id) && e.status !== 'Locked' && e.status !== 'Transferred') {
          const adjustment =
          bulkAdjustmentType === 'add' ? bulkAdjustmentAmount : -bulkAdjustmentAmount;
          const newAdjusted = e.adjustedTds + adjustment;
          const newFinalTds = e.calculatedTds + newAdjusted;
          return {
            ...e,
            adjustedTds: newAdjusted,
            finalTds: Math.max(0, newFinalTds),
            status: e.status === 'Ready' ? 'Computed' : e.status
          };
        }
        return e;
      })
      );

      handleCloseBulkAdjustment();
      showNotification('success', `Bulk adjustment applied to ${selectedRows.length} employees`);
    } catch (error) {
      showNotification('error', 'Failed to apply bulk adjustment');
    } finally {
      setIsLoading(false);
    }
  };

  // Process TDS Handler
  const handleProcessTds = async () => {
    if (!showConfirmProcess) {
      setShowConfirmProcess(true);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Process all pending and ready employees
      setEmployees((prev) =>
      prev.map((e) => {
        if (e.status === 'Pending' || e.status === 'Ready') {
          const newCalculatedTds = calculateTds(e.taxableMonthly, e.regime);
          const newFinalTds = newCalculatedTds + e.adjustedTds;
          return {
            ...e,
            calculatedTds: newCalculatedTds,
            finalTds: Math.max(0, newFinalTds),
            status: 'Computed'
          };
        }
        return e;
      })
      );

      setShowConfirmProcess(false);
      showNotification('success', 'TDS processed for all eligible employees');
    } catch (error) {
      showNotification('error', 'Failed to process TDS');
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Selected TDS Handler
  const handleProcessSelected = async () => {
    if (selectedRows.length === 0) {
      showNotification('warning', 'Please select employees first');
      return;
    }

    if (!canProcessSelected) {
      showNotification('warning', 'Some selected employees cannot be processed');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmployees((prev) =>
      prev.map((e) => {
        if (
        selectedRows.includes(e.id) && (
        e.status === 'Pending' || e.status === 'Ready'))
        {
          const newCalculatedTds = calculateTds(e.taxableMonthly, e.regime);
          const newFinalTds = newCalculatedTds + e.adjustedTds;
          return {
            ...e,
            calculatedTds: newCalculatedTds,
            finalTds: Math.max(0, newFinalTds),
            status: 'Computed'
          };
        }
        return e;
      })
      );

      setSelectedRows([]);
      showNotification('success', `TDS computed for ${selectedRows.length} employees`);
    } catch (error) {
      showNotification('error', 'Failed to compute TDS');
    } finally {
      setIsProcessing(false);
    }
  };

  // Recalculate TDS Handler
  const handleRecalculateTds = async () => {
    if (!showRecalculateConfirm) {
      setShowRecalculateConfirm(true);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.status !== 'Locked' && e.status !== 'Transferred') {
          const newCalculatedTds = calculateTds(e.taxableMonthly, e.regime);
          const newFinalTds = newCalculatedTds + e.adjustedTds;
          return {
            ...e,
            calculatedTds: newCalculatedTds,
            finalTds: Math.max(0, newFinalTds),
            status: 'Computed'
          };
        }
        return e;
      })
      );

      setShowRecalculateConfirm(false);
      showNotification('success', 'TDS recalculated for all unlocked employees');
    } catch (error) {
      showNotification('error', 'Failed to recalculate TDS');
    } finally {
      setIsProcessing(false);
    }
  };

  // Lock TDS Handler
  const handleLockTds = async () => {
    if (!showConfirmLock) {
      setShowConfirmLock(true);
      return;
    }

    setIsLocking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date().toISOString();
      setEmployees((prev) =>
      prev.map((e) => {
        if (e.status === 'Ready' || e.status === 'Computed') {
          return {
            ...e,
            status: 'Locked',
            lockedAt: now,
            lockedBy: 'HR Admin'
          };
        }
        return e;
      })
      );

      setShowConfirmLock(false);
      showNotification('success', 'TDS locked for all computed employees');
    } catch (error) {
      showNotification('error', 'Failed to lock TDS');
    } finally {
      setIsLocking(false);
    }
  };

  // Lock Selected TDS Handler
  const handleLockSelected = async () => {
    if (selectedRows.length === 0) {
      showNotification('warning', 'Please select employees first');
      return;
    }

    if (!canLockSelected) {
      showNotification('warning', 'Some selected employees cannot be locked');
      return;
    }

    setIsLocking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date().toISOString();
      setEmployees((prev) =>
      prev.map((e) => {
        if (
        selectedRows.includes(e.id) && (
        e.status === 'Ready' || e.status === 'Computed'))
        {
          return {
            ...e,
            status: 'Locked',
            lockedAt: now,
            lockedBy: 'HR Admin'
          };
        }
        return e;
      })
      );

      setSelectedRows([]);
      showNotification('success', `TDS locked for ${selectedRows.length} employees`);
    } catch (error) {
      showNotification('error', 'Failed to lock TDS');
    } finally {
      setIsLocking(false);
    }
  };

  // Unlock TDS Handler
  const handleUnlockTds = async () => {
    if (!showUnlockConfirm) {
      setShowUnlockConfirm(true);
      return;
    }

    if (!canUnlockSelected || selectedRows.length === 0) {
      showNotification('warning', 'Please select locked employees to unlock');
      return;
    }

    setIsLocking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (selectedRows.includes(e.id) && e.status === 'Locked') {
          return {
            ...e,
            status: 'Computed',
            lockedAt: null,
            lockedBy: null
          };
        }
        return e;
      })
      );

      setShowUnlockConfirm(false);
      setSelectedRows([]);
      showNotification('success', `TDS unlocked for ${selectedRows.length} employees`);
    } catch (error) {
      showNotification('error', 'Failed to unlock TDS');
    } finally {
      setIsLocking(false);
    }
  };

  // Transfer TDS Handler
  const handleTransferTds = async () => {
    // Validation
    const errors: ValidationError[] = [];

    if (!challanNumber.trim()) {
      errors.push({ field: 'challanNumber', message: 'Challan number is required' });
    }

    if (!transferDate) {
      errors.push({ field: 'transferDate', message: 'Transfer date is required' });
    }

    if (statistics.readyToTransfer === 0) {
      errors.push({ field: 'employees', message: 'No locked employees available for transfer' });
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      showNotification('error', 'Please fix validation errors');
      return;
    }

    if (!showConfirmTransfer) {
      setShowConfirmTransfer(true);
      return;
    }

    setIsTransferring(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date().toISOString();
      const lockedEmployees = employees.filter((e) => e.status === 'Locked');
      const totalTds = lockedEmployees.reduce((sum, e) => sum + e.finalTds, 0);

      // Create transfer record
      const newTransferRecord: TransferRecord = {
        id: generateId(),
        month: currentMonthData?.label.split(' ')[0] || '',
        year: currentMonthData?.year.toString() || '',
        totalTds,
        employeeCount: lockedEmployees.length,
        challanNumber: challanNumber.trim(),
        transferDate,
        status: 'Completed',
        createdAt: now,
        completedAt: now,
        createdBy: 'HR Admin'
      };

      setTransferRecords((prev) => [newTransferRecord, ...prev]);

      // Update employees
      setEmployees((prev) =>
      prev.map((e) => {
        if (e.status === 'Locked') {
          const historyEntry: TdsHistoryEntry = {
            id: generateId(),
            month: currentMonthData?.label.split(' ')[0] || '',
            year: currentMonthData?.year.toString() || '',
            grossAmount: e.grossMonthly,
            taxableAmount: e.taxableMonthly,
            tdsAmount: e.calculatedTds,
            adjustedAmount: e.adjustedTds,
            status: 'Transferred',
            processedAt: now,
            processedBy: 'HR Admin',
            remarks: transferRemarks || 'Monthly TDS transfer'
          };
          return {
            ...e,
            status: 'Transferred',
            transferredAt: now,
            tdsHistory: [historyEntry, ...e.tdsHistory]
          };
        }
        return e;
      })
      );

      // Reset form
      setChallanNumber('');
      setTransferDate('');
      setTransferRemarks('');
      setValidationErrors([]);
      setShowConfirmTransfer(false);

      showNotification(
        'success',
        `TDS of ${formatCurrency(totalTds)} transferred for ${lockedEmployees.length} employees`
      );
    } catch (error) {
      showNotification('error', 'Failed to transfer TDS');
    } finally {
      setIsTransferring(false);
    }
  };

  // View Employee Details Handler
  const handleViewEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployee(null);
  };

  // View TDS History Handler
  const handleViewTdsHistory = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowTdsHistory(true);
  };

  const handleCloseTdsHistory = () => {
    setShowTdsHistory(false);
    setSelectedEmployee(null);
  };

  // Export Handler
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const headers = [
      'Employee ID',
      'Name',
      'Department',
      'PAN',
      'Regime',
      'Gross Monthly',
      'Taxable Monthly',
      'Calculated TDS',
      'Adjustment',
      'Final TDS',
      'Status'];


      const rows = filteredEmployees.map((e) => [
      e.employeeId,
      e.name,
      e.department,
      e.pan,
      e.regime,
      e.grossMonthly,
      e.taxableMonthly,
      e.calculatedTds,
      e.adjustedTds,
      e.finalTds,
      e.status]
      );

      const csvContent = [
      `TDS Computation Report - ${currentMonthData?.label}`,
      '',
      headers.join(','),
      ...rows.map((r) => r.join(',')),
      '',
      `Total Employees,${filteredEmployees.length}`,
      `Total TDS,${statistics.totalTds}`,
      `Generated on,${new Date().toLocaleString()}`].
      join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tds_computation_${selectedMonth}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('success', 'TDS report exported successfully');
    } catch (error) {
      showNotification('error', 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary Handler
  const handleCopySummary = async () => {
    const summary = `
TDS Computation Summary - ${currentMonthData?.label}

Total Employees: ${statistics.total}
Pending: ${statistics.pending}
Ready: ${statistics.ready}
Computed: ${statistics.computed}
Locked: ${statistics.locked}
Transferred: ${statistics.transferred}

Financial Summary:
Total Gross: ${formatCurrency(statistics.totalGross)}
Total Taxable: ${formatCurrency(statistics.totalTaxable)}
Total TDS: ${formatCurrency(statistics.totalTds)}
Total Adjustments: ${formatCurrency(statistics.totalAdjustments)}

Generated: ${new Date().toLocaleString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      showNotification('success', 'Summary copied to clipboard');
    } catch (error) {
      showNotification('error', 'Failed to copy');
    }
  };

  // Refresh Data Handler
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production, fetch fresh data from API
      showNotification('success', 'Data refreshed');
    } catch (error) {
      showNotification('error', 'Refresh failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Adjustments Handler
  const handleResetAdjustments = async () => {
    if (!window.confirm('Reset all adjustments to zero? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.status !== 'Locked' && e.status !== 'Transferred') {
          return {
            ...e,
            adjustedTds: 0,
            finalTds: e.calculatedTds,
            remarks: ''
          };
        }
        return e;
      })
      );

      showNotification('success', 'All adjustments reset');
    } catch (error) {
      showNotification('error', 'Failed to reset adjustments');
    } finally {
      setIsLoading(false);
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

  // Check if has validation error
  const hasError = (field: string): boolean => {
    return validationErrors.some((e) => e.field === field);
  };

  // Get error message
  const getError = (field: string): string | undefined => {
    return validationErrors.find((e) => e.field === field)?.message;
  };

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
            Monthly TDS Computation & Transfer to Payroll
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; TDS Computation
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
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}>

            {isExporting ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Download className="w-4 h-4 mr-2" />
            }
            Export
          </Button>
          <Button variant="outline" onClick={handleCopySummary}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Summary
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(statistics.totalTds)}
              </p>
              <p className="text-sm text-gray-500">Total TDS</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {statistics.total}
              </p>
              <p className="text-sm text-gray-500">Total Employees</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {statistics.locked}
              </p>
              <p className="text-sm text-gray-500">Locked</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(statistics.totalAdjustments)}
              </p>
              <p className="text-sm text-gray-500">Adjustments</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 hover:text-blue-800">

            {showFilters ? 'Hide' : 'Show'} advanced
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            options={MONTHS}
            value={selectedMonth}
            onChange={handleMonthChange} />

          <Select
            options={DEPARTMENTS}
            value={selectedDepartment}
            onChange={handleDepartmentChange} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10" />

          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleProcessTds}
            disabled={isProcessing}>

            {isProcessing ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Calculator className="w-4 h-4 mr-2" />
            }
            Process TDS
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLockTds}
            disabled={isLocking || statistics.readyToLock === 0}>

            {isLocking ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Lock className="w-4 h-4 mr-2" />
            }
            Lock TDS ({statistics.readyToLock})
          </Button>
        </div>

        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={selectedStatus}
            onChange={handleStatusChange} />

            <div className="flex items-end">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={handleResetAdjustments}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Adjustments
              </Button>
            </div>
            <div className="flex items-end">
              <Button
              variant="outline"
              onClick={() => setShowRecalculateConfirm(true)}>

                <Calculator className="w-4 h-4 mr-2" />
                Recalculate All
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Confirmation Modals */}
      {showConfirmProcess &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-blue-800">Confirm TDS Processing</p>
              <p className="text-sm text-blue-700 mt-1">
                This will calculate TDS for {statistics.pending + statistics.ready} employees
                with Pending or Ready status.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="primary"
                onClick={handleProcessTds}
                disabled={isProcessing}>

                  {isProcessing ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <CheckCircle className="w-4 h-4 mr-2" />
                }
                  Confirm Process
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmProcess(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {showConfirmLock &&
      <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-purple-800">Confirm TDS Lock</p>
              <p className="text-sm text-purple-700 mt-1">
                This will lock TDS for {statistics.readyToLock} employees. Locked TDS
                cannot be modified without unlocking.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="primary"
                onClick={handleLockTds}
                disabled={isLocking}>

                  {isLocking ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Lock className="w-4 h-4 mr-2" />
                }
                  Confirm Lock
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmLock(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {showRecalculateConfirm &&
      <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Calculator className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Confirm Recalculation</p>
              <p className="text-sm text-amber-700 mt-1">
                This will recalculate TDS for all unlocked employees based on current
                taxable income. Adjustments will be preserved.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="primary"
                onClick={handleRecalculateTds}
                disabled={isProcessing}>

                  {isProcessing ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Calculator className="w-4 h-4 mr-2" />
                }
                  Recalculate
                </Button>
                <Button variant="outline" onClick={() => setShowRecalculateConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* TDS Processing Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={toggleAll}
                    className="rounded" />

                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-1">
                    Employee
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('grossMonthly')}>

                  <div className="flex items-center justify-end gap-1">
                    Gross (Month)
                    {renderSortIndicator('grossMonthly')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('taxableMonthly')}>

                  <div className="flex items-center justify-end gap-1">
                    Taxable (Month)
                    {renderSortIndicator('taxableMonthly')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('calculatedTds')}>

                  <div className="flex items-center justify-end gap-1">
                    TDS (Calculated)
                    {renderSortIndicator('calculatedTds')}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Adjusted TDS
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('finalTds')}>

                  <div className="flex items-center justify-end gap-1">
                    Final TDS
                    {renderSortIndicator('finalTds')}
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
              {filteredEmployees.length === 0 ?
              <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No employees found</p>
                    {(searchQuery || selectedDepartment !== 'all' || selectedStatus !== 'all') &&
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline">

                        Clear filters
                      </button>
                  }
                  </td>
                </tr> :

              filteredEmployees.map((emp) =>
              <tr
                key={emp.id}
                className={`hover:bg-gray-50 ${
                selectedRows.includes(emp.id) ? 'bg-blue-50' : ''}`
                }>

                    <td className="px-4 py-3 text-center">
                      <input
                    type="checkbox"
                    checked={selectedRows.includes(emp.id)}
                    onChange={() => toggleRow(emp.id)}
                    className="rounded" />

                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">
                          {emp.employeeId} • {emp.department}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(emp.grossMonthly)}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">
                      {formatCurrency(emp.taxableMonthly)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      {formatCurrency(emp.calculatedTds)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Input
                    type="number"
                    value={emp.adjustedTds}
                    onChange={(e) =>
                    handleInlineAdjustment(emp.id, parseInt(e.target.value) || 0)
                    }
                    className="w-24 text-right"
                    disabled={emp.status === 'Locked' || emp.status === 'Transferred'} />

                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">
                      {formatCurrency(emp.finalTds)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    emp.status === 'Pending' ?
                    'bg-gray-100 text-gray-700' :
                    emp.status === 'Ready' ?
                    'bg-blue-100 text-blue-700' :
                    emp.status === 'Computed' ?
                    'bg-yellow-100 text-yellow-700' :
                    emp.status === 'Locked' ?
                    'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                    }>

                        {emp.status === 'Locked' && <Lock className="w-3 h-3 mr-1" />}
                        {emp.status === 'Transferred' && <Check className="w-3 h-3 mr-1" />}
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                      onClick={() => handleViewEmployeeDetails(emp)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleOpenAdjustment(emp)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="Adjust TDS"
                      disabled={emp.status === 'Locked' || emp.status === 'Transferred'}>

                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleViewTdsHistory(emp)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500"
                      title="View History">

                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={2} className="px-4 py-3 font-semibold">
                  Total ({filteredEmployees.length} employees)
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatCurrency(statistics.totalGross)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-blue-600">
                  {formatCurrency(statistics.totalTaxable)}
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatCurrency(
                    filteredEmployees.reduce((sum, e) => sum + e.calculatedTds, 0)
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatCurrency(statistics.totalAdjustments)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-green-600">
                  {formatCurrency(statistics.totalTds)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Bar */}
        {selectedRows.length > 0 &&
        <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {selectedRows.length} employee(s) selected
                </span>
                <span className="text-sm font-medium text-blue-600">
                  Total TDS: {formatCurrency(selectedTotalTds)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearSelection}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleOpenBulkAdjustment}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Bulk Adjust
                </Button>
                {canProcessSelected &&
              <Button
                variant="primary"
                onClick={handleProcessSelected}
                disabled={isProcessing}>

                    {isProcessing ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Calculator className="w-4 h-4 mr-2" />
                }
                    Compute Selected
                  </Button>
              }
                {canLockSelected &&
              <Button
                variant="primary"
                onClick={handleLockSelected}
                disabled={isLocking}>

                    {isLocking ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Lock className="w-4 h-4 mr-2" />
                }
                    Lock Selected
                  </Button>
              }
                {canUnlockSelected &&
              <Button
                variant="outline"
                onClick={() => setShowUnlockConfirm(true)}
                disabled={isLocking}>

                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Selected
                  </Button>
              }
              </div>
            </div>
          </div>
        }
      </Card>

      {/* TDS Transfer Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">TDS Transfer to Payroll</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTransferHistory(true)}>

            <History className="w-4 h-4 mr-1" />
            Transfer History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total TDS for Month
            </label>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(
                employees.filter((e) => e.status === 'Locked').reduce((sum, e) => sum + e.finalTds, 0)
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {statistics.locked} employee(s) locked for {currentMonthData?.label}
            </p>
            {statistics.locked === 0 &&
            <p className="text-sm text-amber-600 mt-2">
                No locked TDS available for transfer. Lock employees first.
              </p>
            }
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challan Reference Number *
              </label>
              <Input
                placeholder="Enter challan number"
                value={challanNumber}
                onChange={(e) => {
                  setChallanNumber(e.target.value);
                  setValidationErrors((prev) => prev.filter((err) => err.field !== 'challanNumber'));
                }}
                className={hasError('challanNumber') ? 'border-red-500' : ''} />

              {hasError('challanNumber') &&
              <p className="text-sm text-red-600 mt-1">{getError('challanNumber')}</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Date *
              </label>
              <Input
                type="date"
                value={transferDate}
                onChange={(e) => {
                  setTransferDate(e.target.value);
                  setValidationErrors((prev) => prev.filter((err) => err.field !== 'transferDate'));
                }}
                className={hasError('transferDate') ? 'border-red-500' : ''} />

              {hasError('transferDate') &&
              <p className="text-sm text-red-600 mt-1">{getError('transferDate')}</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <Input
                placeholder="Enter remarks"
                value={transferRemarks}
                onChange={(e) => setTransferRemarks(e.target.value)} />

            </div>
          </div>
        </div>

        {showConfirmTransfer &&
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Send className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-800">Confirm Transfer</p>
                <p className="text-sm text-green-700 mt-1">
                  You are about to transfer{' '}
                  {formatCurrency(
                  employees.filter((e) => e.status === 'Locked').reduce((sum, e) => sum + e.finalTds, 0)
                )}{' '}
                  for {statistics.locked} employees to payroll.
                </p>
                <div className="mt-2 text-sm text-green-600">
                  <p>Challan: {challanNumber}</p>
                  <p>Date: {formatDate(transferDate)}</p>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="mt-6 flex justify-end gap-3">
          {showConfirmTransfer &&
          <Button variant="outline" onClick={() => setShowConfirmTransfer(false)}>
              Cancel
            </Button>
          }
          <Button
            variant="primary"
            onClick={handleTransferTds}
            disabled={isTransferring || statistics.locked === 0}>

            {isTransferring ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transferring...
              </> :
            showConfirmTransfer ?
            <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Transfer
              </> :

            <>
                <Send className="w-4 h-4 mr-2" />
                Mark as Paid & Transfer
              </>
            }
          </Button>
        </div>
      </Card>

      {/* Info Alert */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">TDS Processing Workflow</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>1. <strong>Process TDS:</strong> Calculate TDS for Pending/Ready employees</li>
              <li>2. <strong>Review & Adjust:</strong> Make adjustments if needed (carry forward, corrections)</li>
              <li>3. <strong>Lock TDS:</strong> Lock computed TDS to prevent further changes</li>
              <li>4. <strong>Transfer:</strong> Enter challan details and transfer to payroll</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.employeeId} • {selectedEmployee.department}
                  </p>
                </div>
                <button
                onClick={handleCloseEmployeeDetails}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">PAN</p>
                  <p className="font-medium">{selectedEmployee.pan}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Tax Regime</p>
                  <p className="font-medium">{selectedEmployee.regime}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge
                  className={
                  selectedEmployee.status === 'Locked' ?
                  'bg-purple-100 text-purple-700' :
                  selectedEmployee.status === 'Transferred' ?
                  'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                  }>

                    {selectedEmployee.status}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Designation</p>
                  <p className="font-medium">{selectedEmployee.designation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Current Month TDS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Gross Salary</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(selectedEmployee.grossMonthly)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Taxable Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedEmployee.taxableMonthly)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Calculated TDS</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(selectedEmployee.calculatedTds)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Adjustment</p>
                    <p
                    className={`text-xl font-bold ${
                    selectedEmployee.adjustedTds > 0 ?
                    'text-amber-600' :
                    selectedEmployee.adjustedTds < 0 ?
                    'text-red-600' :
                    ''}`
                    }>

                      {selectedEmployee.adjustedTds > 0 ? '+' : ''}
                      {formatCurrency(selectedEmployee.adjustedTds)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-800">Final TDS</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrency(selectedEmployee.finalTds)}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mt-6">Year to Date</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">YTD Taxable</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(selectedEmployee.ytdTaxable)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">YTD TDS Deducted</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedEmployee.ytdTds)}
                    </p>
                  </div>
                </div>

                {selectedEmployee.remarks &&
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Remarks:</strong> {selectedEmployee.remarks}
                    </p>
                  </div>
              }

                {selectedEmployee.lockedAt &&
              <div className="text-sm text-gray-500">
                    Locked on {formatDateTime(selectedEmployee.lockedAt)} by{' '}
                    {selectedEmployee.lockedBy}
                  </div>
              }
              </div>

              <div className="mt-6 pt-4 border-t flex gap-2 justify-end">
                <Button
                variant="outline"
                onClick={() => {
                  handleCloseEmployeeDetails();
                  handleViewTdsHistory(selectedEmployee);
                }}>

                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button variant="outline" onClick={handleCloseEmployeeDetails}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* TDS History Modal */}
      {showTdsHistory && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">TDS History</h2>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.name} ({selectedEmployee.employeeId})
                  </p>
                </div>
                <button
                onClick={handleCloseTdsHistory}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedEmployee.tdsHistory.length === 0 ?
            <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No TDS history available</p>
                </div> :

            <div className="space-y-4">
                  {selectedEmployee.tdsHistory.map((entry) =>
              <div key={entry.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {entry.month} {entry.year}
                          </p>
                          <p className="text-xs text-gray-500">
                            Processed: {formatDateTime(entry.processedAt)}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">{entry.status}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Gross</p>
                          <p className="font-medium">{formatCurrency(entry.grossAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Taxable</p>
                          <p className="font-medium">{formatCurrency(entry.taxableAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">TDS</p>
                          <p className="font-medium">{formatCurrency(entry.tdsAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Adjustment</p>
                          <p className="font-medium">{formatCurrency(entry.adjustedAmount)}</p>
                        </div>
                      </div>
                      {entry.remarks &&
                <p className="text-sm text-gray-600 mt-2">
                          <strong>Remarks:</strong> {entry.remarks}
                        </p>
                }
                    </div>
              )}
                </div>
            }

              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseTdsHistory} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">TDS Adjustment</h2>
                <button
                onClick={handleCloseAdjustment}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedEmployee.name}</p>
                <p className="text-sm text-gray-500">{selectedEmployee.employeeId}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Calculated TDS</p>
                    <p className="font-bold">{formatCurrency(selectedEmployee.calculatedTds)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Final TDS</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(selectedEmployee.finalTds)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                    onClick={() => setAdjustmentAmount((prev) => prev - 100)}
                    className="p-2 border rounded hover:bg-gray-50">

                      <Minus className="w-4 h-4" />
                    </button>
                    <Input
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                    className="text-center" />

                    <button
                    onClick={() => setAdjustmentAmount((prev) => prev + 100)}
                    className="p-2 border rounded hover:bg-gray-50">

                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Positive = Add, Negative = Subtract
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Final TDS
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                    Math.max(0, selectedEmployee.calculatedTds + adjustmentAmount)
                  )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <Input
                  placeholder="Reason for adjustment..."
                  value={adjustmentRemarks}
                  onChange={(e) => setAdjustmentRemarks(e.target.value)} />

                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseAdjustment}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSaveAdjustment}
                disabled={isLoading}>

                  {isLoading ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Save className="w-4 h-4 mr-2" />
                }
                  Save Adjustment
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Bulk Adjustment Modal */}
      {showBulkAdjustment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Bulk TDS Adjustment</h2>
                <button
                onClick={handleCloseBulkAdjustment}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Apply adjustment to {selectedRows.length} selected employee(s)
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Type
                  </label>
                  <div className="flex gap-2">
                    <button
                    onClick={() => setBulkAdjustmentType('add')}
                    className={`flex-1 py-2 px-4 rounded-lg border font-medium ${
                    bulkAdjustmentType === 'add' ?
                    'bg-green-50 border-green-500 text-green-700' :
                    'border-gray-300'}`
                    }>

                      <Plus className="w-4 h-4 inline mr-1" />
                      Add
                    </button>
                    <button
                    onClick={() => setBulkAdjustmentType('subtract')}
                    className={`flex-1 py-2 px-4 rounded-lg border font-medium ${
                    bulkAdjustmentType === 'subtract' ?
                    'bg-red-50 border-red-500 text-red-700' :
                    'border-gray-300'}`
                    }>

                      <Minus className="w-4 h-4 inline mr-1" />
                      Subtract
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <Input
                  type="number"
                  value={bulkAdjustmentAmount}
                  onChange={(e) => setBulkAdjustmentAmount(parseInt(e.target.value) || 0)}
                  placeholder="Enter amount"
                  min={0} />

                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseBulkAdjustment}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleApplyBulkAdjustment}
                disabled={isLoading || bulkAdjustmentAmount === 0}>

                  {isLoading ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <CheckCircle className="w-4 h-4 mr-2" />
                }
                  Apply to {selectedRows.length} Employees
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Transfer History Modal */}
      {showTransferHistory &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transfer History</h2>
                <button
                onClick={() => setShowTransferHistory(false)}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {transferRecords.length === 0 ?
            <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No transfer records found</p>
                </div> :

            <div className="space-y-4">
                  {transferRecords.map((record) =>
              <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.month} {record.year}
                          </p>
                          <p className="text-xs text-gray-500">
                            Challan: {record.challanNumber}
                          </p>
                        </div>
                        <Badge
                    className={
                    record.status === 'Completed' ?
                    'bg-green-100 text-green-700' :
                    record.status === 'Processing' ?
                    'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                    }>

                          {record.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total TDS</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(record.totalTds)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Employees</p>
                          <p className="font-bold">{record.employeeCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Transfer Date</p>
                          <p className="font-medium">{formatDate(record.transferDate)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Created by {record.createdBy} on {formatDateTime(record.createdAt)}
                      </p>
                    </div>
              )}
                </div>
            }

              <div className="mt-6 pt-4 border-t">
                <Button
                variant="outline"
                onClick={() => setShowTransferHistory(false)}
                className="w-full">

                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Unlock Confirmation Modal */}
      {showUnlockConfirm &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Unlock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Unlock TDS</h3>
                  <p className="text-gray-600 mt-1">
                    Are you sure you want to unlock TDS for {selectedRows.length} employee(s)?
                    This will allow modifications to their TDS calculations.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowUnlockConfirm(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleUnlockTds}
                disabled={isLocking}>

                  {isLocking ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Unlock className="w-4 h-4 mr-2" />
                }
                  Unlock
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}