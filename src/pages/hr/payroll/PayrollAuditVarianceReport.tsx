import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon,
  EyeIcon,
  DownloadIcon,
  PrinterIcon,
  RefreshCwIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  FileTextIcon,
  BarChart3Icon,
  ArrowUpDownIcon,
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  MinusIcon,
  PlusIcon,
  ClipboardListIcon,
  AlertTriangleIcon,
  CheckIcon,
  BookmarkIcon,
  HistoryIcon,
  Settings2Icon,
  CopyIcon,
  Share2Icon,
  TableIcon,
  ListIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SlidersIcon,
  FlagIcon,
  MessageSquareIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
type VarianceType = 'increase' | 'decrease' | 'no-change';
type VarianceStatus = 'normal' | 'above-threshold' | 'critical' | 'flagged';
type AuditStatus = 'pending' | 'reviewed' | 'approved' | 'escalated';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  monthAAmount: number;
  monthBAmount: number;
  difference: number;
  percentChange: number;
}

interface EmployeeVarianceData {
  id: number;
  empId: string;
  empCode: string;
  empName: string;
  department: string;
  designation: string;
  employeeType: string;
  monthA: string;
  monthB: string;
  components: SalaryComponent[];
  monthAGross: number;
  monthBGross: number;
  monthADeductions: number;
  monthBDeductions: number;
  monthANet: number;
  monthBNet: number;
  grossDifference: number;
  deductionDifference: number;
  netDifference: number;
  grossPercentChange: number;
  deductionPercentChange: number;
  netPercentChange: number;
  variance: VarianceType;
  status: VarianceStatus;
  auditStatus: AuditStatus;
  flagged: boolean;
  flagReason: string | null;
  notes: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  lastUpdated: Date;
}

interface VarianceSummary {
  totalEmployees: number;
  employeesWithChanges: number;
  employeesWithIncrease: number;
  employeesWithDecrease: number;
  employeesNoChange: number;
  aboveThreshold: number;
  critical: number;
  flagged: number;
  totalGrossDifferenceA: number;
  totalGrossDifferenceB: number;
  totalDeductionDifferenceA: number;
  totalDeductionDifferenceB: number;
  totalNetDifferenceA: number;
  totalNetDifferenceB: number;
  netImpact: number;
  avgPercentChange: number;
}

interface AuditLog {
  id: string;
  employeeId: number;
  action: string;
  performedBy: string;
  performedAt: Date;
  details: string;
  oldValue: any;
  newValue: any;
}

interface SavedReport {
  id: string;
  name: string;
  monthA: string;
  monthB: string;
  department: string;
  threshold: number;
  generatedAt: Date;
  generatedBy: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface FilterConfig {
  monthA: string;
  monthB: string;
  department: string;
  employeeType: string;
  varianceThreshold: number;
  varianceType: string;
  status: string;
  auditStatus: string;
  search: string;
  showOnlyFlagged: boolean;
  showOnlyAboveThreshold: boolean;
}

interface SortConfig {
  key: keyof EmployeeVarianceData;
  direction: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Constants & Initial Data
// ---------------------------------------------------------------------------
const MONTHS = [
{ value: 'January 2025', label: 'January 2025' },
{ value: 'February 2025', label: 'February 2025' },
{ value: 'March 2025', label: 'March 2025' },
{ value: 'April 2025', label: 'April 2025' },
{ value: 'May 2025', label: 'May 2025' },
{ value: 'June 2025', label: 'June 2025' },
{ value: 'July 2025', label: 'July 2025' }];


const DEPARTMENTS = [
{ value: 'teaching', label: 'Teaching' },
{ value: 'administration', label: 'Administration' },
{ value: 'it', label: 'IT Department' },
{ value: 'finance', label: 'Finance' },
{ value: 'hr', label: 'Human Resources' },
{ value: 'support', label: 'Support Staff' },
{ value: 'marketing', label: 'Marketing' }];


const EMPLOYEE_TYPES = [
{ value: 'permanent', label: 'Permanent' },
{ value: 'contract', label: 'Contract' },
{ value: 'temporary', label: 'Temporary' },
{ value: 'probation', label: 'Probation' }];


const VARIANCE_TYPES = [
{ value: 'all', label: 'All Changes' },
{ value: 'increase', label: 'Increases Only' },
{ value: 'decrease', label: 'Decreases Only' },
{ value: 'no-change', label: 'No Change' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'normal', label: 'Normal' },
{ value: 'above-threshold', label: 'Above Threshold' },
{ value: 'critical', label: 'Critical' },
{ value: 'flagged', label: 'Flagged' }];


const AUDIT_STATUS_OPTIONS = [
{ value: 'all', label: 'All Audit Status' },
{ value: 'pending', label: 'Pending Review' },
{ value: 'reviewed', label: 'Reviewed' },
{ value: 'approved', label: 'Approved' },
{ value: 'escalated', label: 'Escalated' }];


// Generate sample variance data
const generateSampleData = (monthA: string, monthB: string): EmployeeVarianceData[] => {
  const baseData = [
  {
    id: 1,
    empId: 'EMP001',
    empCode: 'EMP001',
    empName: 'Rajesh Kumar',
    department: 'Teaching',
    designation: 'Senior Teacher',
    employeeType: 'Permanent'
  },
  {
    id: 2,
    empId: 'EMP002',
    empCode: 'EMP002',
    empName: 'Priya Sharma',
    department: 'Administration',
    designation: 'Admin Manager',
    employeeType: 'Permanent'
  },
  {
    id: 3,
    empId: 'EMP003',
    empCode: 'EMP003',
    empName: 'Amit Patel',
    department: 'IT Department',
    designation: 'System Administrator',
    employeeType: 'Permanent'
  },
  {
    id: 4,
    empId: 'EMP004',
    empCode: 'EMP004',
    empName: 'Sneha Reddy',
    department: 'Finance',
    designation: 'Accountant',
    employeeType: 'Permanent'
  },
  {
    id: 5,
    empId: 'EMP005',
    empCode: 'EMP005',
    empName: 'Vikram Singh',
    department: 'Support Staff',
    designation: 'Facility Manager',
    employeeType: 'Permanent'
  },
  {
    id: 6,
    empId: 'EMP006',
    empCode: 'EMP006',
    empName: 'Kavita Joshi',
    department: 'Human Resources',
    designation: 'HR Executive',
    employeeType: 'Probation'
  },
  {
    id: 7,
    empId: 'EMP007',
    empCode: 'EMP007',
    empName: 'Rahul Mehta',
    department: 'Marketing',
    designation: 'Marketing Manager',
    employeeType: 'Permanent'
  },
  {
    id: 8,
    empId: 'EMP008',
    empCode: 'EMP008',
    empName: 'Anita Desai',
    department: 'Teaching',
    designation: 'Principal',
    employeeType: 'Permanent'
  },
  {
    id: 9,
    empId: 'EMP009',
    empCode: 'EMP009',
    empName: 'Suresh Kumar',
    department: 'IT Department',
    designation: 'Software Developer',
    employeeType: 'Contract'
  },
  {
    id: 10,
    empId: 'EMP010',
    empCode: 'EMP010',
    empName: 'Meera Patel',
    department: 'Administration',
    designation: 'Receptionist',
    employeeType: 'Temporary'
  }];


  return baseData.map((emp, index) => {
    // Generate random but consistent salary data
    const baseGrossA = 30000 + index * 5000 + Math.floor(Math.random() * 10000);
    const changePercent = [-15, -10, -5, 0, 0, 5, 10, 15, 20][Math.floor(Math.random() * 9)];
    const baseGrossB = Math.round(baseGrossA * (1 + changePercent / 100));

    const deductionRateA = 0.15 + Math.random() * 0.05;
    const deductionRateB = 0.15 + Math.random() * 0.05;

    const monthADeductions = Math.round(baseGrossA * deductionRateA);
    const monthBDeductions = Math.round(baseGrossB * deductionRateB);

    const monthANet = baseGrossA - monthADeductions;
    const monthBNet = baseGrossB - monthBDeductions;

    const netDifference = monthBNet - monthANet;
    const netPercentChange = monthANet > 0 ? netDifference / monthANet * 100 : 0;

    const components: SalaryComponent[] = [
    {
      id: 'basic',
      name: 'Basic Salary',
      type: 'earning',
      monthAAmount: Math.round(baseGrossA * 0.5),
      monthBAmount: Math.round(baseGrossB * 0.5),
      difference: Math.round(baseGrossB * 0.5) - Math.round(baseGrossA * 0.5),
      percentChange: changePercent
    },
    {
      id: 'hra',
      name: 'HRA',
      type: 'earning',
      monthAAmount: Math.round(baseGrossA * 0.2),
      monthBAmount: Math.round(baseGrossB * 0.2),
      difference: Math.round(baseGrossB * 0.2) - Math.round(baseGrossA * 0.2),
      percentChange: changePercent
    },
    {
      id: 'da',
      name: 'Dearness Allowance',
      type: 'earning',
      monthAAmount: Math.round(baseGrossA * 0.15),
      monthBAmount: Math.round(baseGrossB * 0.15),
      difference: Math.round(baseGrossB * 0.15) - Math.round(baseGrossA * 0.15),
      percentChange: changePercent
    },
    {
      id: 'ta',
      name: 'Transport Allowance',
      type: 'earning',
      monthAAmount: Math.round(baseGrossA * 0.1),
      monthBAmount: Math.round(baseGrossB * 0.1),
      difference: Math.round(baseGrossB * 0.1) - Math.round(baseGrossA * 0.1),
      percentChange: changePercent
    },
    {
      id: 'special',
      name: 'Special Allowance',
      type: 'earning',
      monthAAmount: Math.round(baseGrossA * 0.05),
      monthBAmount: Math.round(baseGrossB * 0.05),
      difference: Math.round(baseGrossB * 0.05) - Math.round(baseGrossA * 0.05),
      percentChange: changePercent
    },
    {
      id: 'pf',
      name: 'Provident Fund',
      type: 'deduction',
      monthAAmount: Math.round(monthADeductions * 0.5),
      monthBAmount: Math.round(monthBDeductions * 0.5),
      difference: Math.round(monthBDeductions * 0.5) - Math.round(monthADeductions * 0.5),
      percentChange: (Math.round(monthBDeductions * 0.5) - Math.round(monthADeductions * 0.5)) / Math.round(monthADeductions * 0.5) * 100
    },
    {
      id: 'esi',
      name: 'ESI',
      type: 'deduction',
      monthAAmount: Math.round(monthADeductions * 0.2),
      monthBAmount: Math.round(monthBDeductions * 0.2),
      difference: Math.round(monthBDeductions * 0.2) - Math.round(monthADeductions * 0.2),
      percentChange: (Math.round(monthBDeductions * 0.2) - Math.round(monthADeductions * 0.2)) / Math.round(monthADeductions * 0.2) * 100
    },
    {
      id: 'tds',
      name: 'TDS',
      type: 'deduction',
      monthAAmount: Math.round(monthADeductions * 0.25),
      monthBAmount: Math.round(monthBDeductions * 0.25),
      difference: Math.round(monthBDeductions * 0.25) - Math.round(monthADeductions * 0.25),
      percentChange: (Math.round(monthBDeductions * 0.25) - Math.round(monthADeductions * 0.25)) / Math.round(monthADeductions * 0.25) * 100
    },
    {
      id: 'pt',
      name: 'Professional Tax',
      type: 'deduction',
      monthAAmount: 200,
      monthBAmount: 200,
      difference: 0,
      percentChange: 0
    }];


    let variance: VarianceType = 'no-change';
    if (netDifference > 0) variance = 'increase';else
    if (netDifference < 0) variance = 'decrease';

    const absPercentChange = Math.abs(netPercentChange);
    let status: VarianceStatus = 'normal';
    if (absPercentChange > 15) status = 'critical';else
    if (absPercentChange > 5) status = 'above-threshold';

    return {
      ...emp,
      monthA,
      monthB,
      components,
      monthAGross: baseGrossA,
      monthBGross: baseGrossB,
      monthADeductions,
      monthBDeductions,
      monthANet,
      monthBNet,
      grossDifference: baseGrossB - baseGrossA,
      deductionDifference: monthBDeductions - monthADeductions,
      netDifference,
      grossPercentChange: changePercent,
      deductionPercentChange: monthADeductions > 0 ? (monthBDeductions - monthADeductions) / monthADeductions * 100 : 0,
      netPercentChange,
      variance,
      status,
      auditStatus: 'pending' as AuditStatus,
      flagged: absPercentChange > 15,
      flagReason: absPercentChange > 15 ? 'Auto-flagged: Variance exceeds 15%' : null,
      notes: '',
      reviewedBy: null,
      reviewedAt: null,
      lastUpdated: new Date()
    };
  });
};

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------
const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const formatted = `₹${absAmount.toLocaleString('en-IN')}`;
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted.substring(1)}`;
  return formatted;
};

const formatPercent = (value: number): string => {
  const formatted = `${Math.abs(value).toFixed(1)}%`;
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ---------------------------------------------------------------------------
// Notification Toast Component
// ---------------------------------------------------------------------------
interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const icons = {
          success: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
          error: <XCircleIcon className="h-5 w-5 text-red-600" />,
          warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />,
          info: <InfoIcon className="h-5 w-5 text-blue-600" />
        };

        const styles = {
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        };

        return (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] ${styles[notification.type]} animate-slide-in`}>

            {icons[notification.type]}
            <span className="flex-1 text-sm font-medium">{notification.message}</span>
            <button onClick={() => onDismiss(notification.id)} className="p-1 hover:opacity-70">
              <XIcon className="h-4 w-4" />
            </button>
          </div>);

      })}
    </div>);

}

// ---------------------------------------------------------------------------
// Variance Detail Modal Component
// ---------------------------------------------------------------------------
interface VarianceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeVarianceData | null;
  onAddNote: (empId: number, note: string) => void;
  onFlag: (empId: number, reason: string) => void;
  onUnflag: (empId: number) => void;
  onUpdateAuditStatus: (empId: number, status: AuditStatus, remarks: string) => void;
}

function VarianceDetailModal({
  isOpen,
  onClose,
  employee,
  onAddNote,
  onFlag,
  onUnflag,
  onUpdateAuditStatus
}: VarianceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'audit'>('overview');
  const [newNote, setNewNote] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [newAuditStatus, setNewAuditStatus] = useState<AuditStatus>('pending');
  const [statusRemarks, setStatusRemarks] = useState('');

  useEffect(() => {
    if (employee) {
      setNewNote(employee.notes);
      setNewAuditStatus(employee.auditStatus);
    }
  }, [employee]);

  if (!employee) return null;

  const handleSaveNote = () => {
    onAddNote(employee.id, newNote);
  };

  const handleFlag = () => {
    if (flagReason.trim()) {
      onFlag(employee.id, flagReason.trim());
      setFlagReason('');
      setShowFlagInput(false);
    }
  };

  const handleUpdateStatus = () => {
    if (statusRemarks.trim()) {
      onUpdateAuditStatus(employee.id, newAuditStatus, statusRemarks.trim());
      setStatusRemarks('');
      setShowStatusChange(false);
    }
  };

  const getStatusBadge = (status: VarianceStatus) => {
    const variants: Record<VarianceStatus, 'success' | 'warning' | 'error' | 'secondary'> = {
      normal: 'success',
      'above-threshold': 'warning',
      critical: 'error',
      flagged: 'error'
    };
    const labels: Record<VarianceStatus, string> = {
      normal: 'Normal',
      'above-threshold': 'Above Threshold',
      critical: 'Critical',
      flagged: 'Flagged'
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getAuditStatusBadge = (status: AuditStatus) => {
    const variants: Record<AuditStatus, 'info' | 'warning' | 'success' | 'error'> = {
      pending: 'warning',
      reviewed: 'info',
      approved: 'success',
      escalated: 'error'
    };
    return <Badge variant={variants[status]} className="capitalize">{status}</Badge>;
  };

  const earningComponents = employee.components.filter((c) => c.type === 'earning');
  const deductionComponents = employee.components.filter((c) => c.type === 'deduction');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Variance Detail Analysis" size="lg">
      <div className="space-y-6">
        {/* Employee Header */}
        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{employee.empName}</h3>
                {getStatusBadge(employee.status)}
                {employee.flagged &&
                <Badge variant="error" className="flex items-center gap-1">
                    <FlagIcon className="w-3 h-3" /> Flagged
                  </Badge>
                }
              </div>
              <p className="text-sm text-slate-500">
                {employee.empCode} • {employee.department} • {employee.designation}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Comparing: {employee.monthA} → {employee.monthB}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Net Change</p>
            <p className={`text-2xl font-bold ${
            employee.netDifference > 0 ? 'text-emerald-600' :
            employee.netDifference < 0 ? 'text-red-600' : 'text-slate-600'}`
            }>
              {formatCurrency(employee.netDifference)}
            </p>
            <p className={`text-sm ${
            employee.netPercentChange > 0 ? 'text-emerald-600' :
            employee.netPercentChange < 0 ? 'text-red-600' : 'text-slate-500'}`
            }>
              {formatPercent(employee.netPercentChange)}
            </p>
          </div>
        </div>

        {/* Audit Status */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Audit Status:</span>
            {getAuditStatusBadge(employee.auditStatus)}
            {employee.reviewedBy &&
            <span className="text-xs text-slate-400">
                by {employee.reviewedBy} on {formatDate(employee.reviewedAt!)}
              </span>
            }
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatusChange(!showStatusChange)}>

            Change Status
          </Button>
        </div>

        {showStatusChange &&
        <div className="p-4 border border-slate-200 rounded-lg space-y-3">
            <Select
            label="New Status"
            value={newAuditStatus}
            onChange={(val) => setNewAuditStatus(val as AuditStatus)}
            options={[
            { value: 'pending', label: 'Pending Review' },
            { value: 'reviewed', label: 'Reviewed' },
            { value: 'approved', label: 'Approved' },
            { value: 'escalated', label: 'Escalated' }]
            } />

            <Textarea
            label="Remarks"
            placeholder="Enter remarks for status change..."
            value={statusRemarks}
            onChange={(e) => setStatusRemarks(e.target.value)}
            rows={2} />

            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleUpdateStatus} disabled={!statusRemarks.trim()}>
                Update Status
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowStatusChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        }

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6">
            {[
            { id: 'overview', label: 'Overview', icon: BarChart3Icon },
            { id: 'components', label: 'Component Breakdown', icon: ListIcon },
            { id: 'audit', label: 'Notes & Flags', icon: ClipboardListIcon }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ?
              'border-indigo-600 text-indigo-600' :
              'border-transparent text-slate-500 hover:text-slate-700'}`
              }>

                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[250px]">
          {activeTab === 'overview' &&
          <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase mb-1">Gross Salary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthA}</span>
                    <span className="font-semibold">₹{employee.monthAGross.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthB}</span>
                    <span className="font-semibold">₹{employee.monthBGross.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Difference</span>
                    <span className={`font-semibold text-sm ${
                  employee.grossDifference > 0 ? 'text-emerald-600' :
                  employee.grossDifference < 0 ? 'text-red-600' : 'text-slate-600'}`
                  }>
                      {formatCurrency(employee.grossDifference)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase mb-1">Deductions</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthA}</span>
                    <span className="font-semibold text-red-600">₹{employee.monthADeductions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthB}</span>
                    <span className="font-semibold text-red-600">₹{employee.monthBDeductions.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Difference</span>
                    <span className={`font-semibold text-sm ${
                  employee.deductionDifference > 0 ? 'text-red-600' :
                  employee.deductionDifference < 0 ? 'text-emerald-600' : 'text-slate-600'}`
                  }>
                      {formatCurrency(employee.deductionDifference)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-600 uppercase mb-1">Net Salary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthA}</span>
                    <span className="font-semibold">₹{employee.monthANet.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{employee.monthB}</span>
                    <span className="font-semibold">₹{employee.monthBNet.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-indigo-200 flex items-center justify-between">
                    <span className="text-xs text-indigo-600">Net Change</span>
                    <span className={`font-bold text-sm ${
                  employee.netDifference > 0 ? 'text-emerald-600' :
                  employee.netDifference < 0 ? 'text-red-600' : 'text-slate-600'}`
                  }>
                      {formatCurrency(employee.netDifference)} ({formatPercent(employee.netPercentChange)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeTab === 'components' &&
          <div className="space-y-4">
              {/* Earnings */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                  Earnings
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-slate-600">Component</th>
                        <th className="text-right p-2 font-medium text-slate-600">{employee.monthA}</th>
                        <th className="text-right p-2 font-medium text-slate-600">{employee.monthB}</th>
                        <th className="text-right p-2 font-medium text-slate-600">Difference</th>
                        <th className="text-right p-2 font-medium text-slate-600">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {earningComponents.map((comp) =>
                    <tr key={comp.id} className="hover:bg-slate-50">
                          <td className="p-2 text-slate-700">{comp.name}</td>
                          <td className="p-2 text-right">₹{comp.monthAAmount.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{comp.monthBAmount.toLocaleString()}</td>
                          <td className={`p-2 text-right font-medium ${
                      comp.difference > 0 ? 'text-emerald-600' :
                      comp.difference < 0 ? 'text-red-600' : 'text-slate-500'}`
                      }>
                            {formatCurrency(comp.difference)}
                          </td>
                          <td className={`p-2 text-right ${
                      comp.percentChange > 0 ? 'text-emerald-600' :
                      comp.percentChange < 0 ? 'text-red-600' : 'text-slate-500'}`
                      }>
                            {formatPercent(comp.percentChange)}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <TrendingDownIcon className="w-4 h-4 text-red-600" />
                  Deductions
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-2 font-medium text-slate-600">Component</th>
                        <th className="text-right p-2 font-medium text-slate-600">{employee.monthA}</th>
                        <th className="text-right p-2 font-medium text-slate-600">{employee.monthB}</th>
                        <th className="text-right p-2 font-medium text-slate-600">Difference</th>
                        <th className="text-right p-2 font-medium text-slate-600">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deductionComponents.map((comp) =>
                    <tr key={comp.id} className="hover:bg-slate-50">
                          <td className="p-2 text-slate-700">{comp.name}</td>
                          <td className="p-2 text-right text-red-600">₹{comp.monthAAmount.toLocaleString()}</td>
                          <td className="p-2 text-right text-red-600">₹{comp.monthBAmount.toLocaleString()}</td>
                          <td className={`p-2 text-right font-medium ${
                      comp.difference > 0 ? 'text-red-600' :
                      comp.difference < 0 ? 'text-emerald-600' : 'text-slate-500'}`
                      }>
                            {formatCurrency(comp.difference)}
                          </td>
                          <td className={`p-2 text-right ${
                      comp.percentChange > 0 ? 'text-red-600' :
                      comp.percentChange < 0 ? 'text-emerald-600' : 'text-slate-500'}`
                      }>
                            {formatPercent(comp.percentChange)}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          {activeTab === 'audit' &&
          <div className="space-y-4">
              {/* Flag Section */}
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FlagIcon className="w-4 h-4" />
                    Flag Status
                  </h4>
                  {employee.flagged ?
                <Button variant="outline" size="sm" onClick={() => onUnflag(employee.id)}>
                      Remove Flag
                    </Button> :

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFlagInput(!showFlagInput)}>

                      <FlagIcon className="w-3 h-3 mr-1" />
                      Flag for Review
                    </Button>
                }
                </div>
                {employee.flagged &&
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <p className="font-medium">Flagged Reason:</p>
                    <p>{employee.flagReason}</p>
                  </div>
              }
                {showFlagInput && !employee.flagged &&
              <div className="space-y-2">
                    <Textarea
                  placeholder="Enter reason for flagging..."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  rows={2} />

                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={handleFlag} disabled={!flagReason.trim()}>
                        Flag Employee
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowFlagInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
              }
              </div>

              {/* Notes Section */}
              <div className="p-4 border border-slate-200 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                  <MessageSquareIcon className="w-4 h-4" />
                  Audit Notes
                </h4>
                <Textarea
                placeholder="Add notes about this variance..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4} />

                <div className="mt-2 flex justify-end">
                  <Button variant="primary" size="sm" onClick={handleSaveNote}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Email Report Modal
// ---------------------------------------------------------------------------
interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emails: string[], subject: string, message: string) => void;
  monthA: string;
  monthB: string;
}

function EmailReportModal({ isOpen, onClose, onSend, monthA, monthB }: EmailReportModalProps) {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState(`Payroll Variance Report: ${monthA} vs ${monthB}`);
  const [message, setMessage] = useState(
    `Please find attached the payroll variance report comparing ${monthA} and ${monthB}.\n\nThis report highlights all salary variances that require attention.\n\nRegards,\nPayroll Team`
  );

  const handleSend = () => {
    if (emails.trim()) {
      onSend(
        emails.split(',').map((e) => e.trim()),
        subject,
        message
      );
      setEmails('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Variance Report" size="md">
      <div className="space-y-4">
        <Textarea
          label="Recipients (comma-separated)"
          placeholder="email1@example.com, email2@example.com"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          rows={2} />

        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)} />

        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={!emails.trim()}>
            <MailIcon className="w-4 h-4 mr-1" /> Send Report
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function PayrollAuditVarianceReport() {
  // Filter State
  const [filters, setFilters] = useState<FilterConfig>({
    monthA: 'April 2025',
    monthB: 'May 2025',
    department: '',
    employeeType: '',
    varianceThreshold: 5,
    varianceType: 'all',
    status: 'all',
    auditStatus: 'all',
    search: '',
    showOnlyFlagged: false,
    showOnlyAboveThreshold: false
  });

  // Data State
  const [varianceData, setVarianceData] = useState<EmployeeVarianceData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // UI State
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeVarianceData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification Functions
  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Add Audit Log
  const addAuditLog = useCallback((employeeId: number, action: string, details: string, oldValue: any = null, newValue: any = null) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      employeeId,
      action,
      performedBy: 'Current User',
      performedAt: new Date(),
      details,
      oldValue,
      newValue
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, []);

  // Generate Report
  const handleGenerateReport = useCallback(() => {
    if (filters.monthA === filters.monthB) {
      addNotification('error', 'Please select different months for comparison');
      return;
    }

    setIsGenerating(true);
    setSelectedRows([]);

    // Simulate API call delay
    setTimeout(() => {
      const data = generateSampleData(filters.monthA, filters.monthB);
      setVarianceData(data);
      setReportGenerated(true);
      setIsGenerating(false);
      setCurrentPage(1);
      addNotification('success', `Variance report generated for ${data.length} employees`);
    }, 1500);
  }, [filters.monthA, filters.monthB, addNotification]);

  // Filter and Sort Data
  const filteredData = useMemo(() => {
    let result = [...varianceData];

    // Apply filters
    if (filters.department) {
      result = result.filter(
        (emp) => emp.department.toLowerCase() === filters.department.toLowerCase()
      );
    }

    if (filters.employeeType) {
      result = result.filter(
        (emp) => emp.employeeType.toLowerCase() === filters.employeeType.toLowerCase()
      );
    }

    if (filters.varianceType !== 'all') {
      result = result.filter((emp) => emp.variance === filters.varianceType);
    }

    if (filters.status !== 'all') {
      result = result.filter((emp) => emp.status === filters.status);
    }

    if (filters.auditStatus !== 'all') {
      result = result.filter((emp) => emp.auditStatus === filters.auditStatus);
    }

    if (filters.showOnlyFlagged) {
      result = result.filter((emp) => emp.flagged);
    }

    if (filters.showOnlyAboveThreshold) {
      result = result.filter(
        (emp) => Math.abs(emp.netPercentChange) > filters.varianceThreshold
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (emp) =>
        emp.empName.toLowerCase().includes(searchLower) ||
        emp.empCode.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ?
          aVal.localeCompare(bVal) :
          bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [varianceData, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Summary Statistics
  const summary: VarianceSummary = useMemo(() => {
    const data = filteredData;
    return {
      totalEmployees: data.length,
      employeesWithChanges: data.filter((e) => e.netDifference !== 0).length,
      employeesWithIncrease: data.filter((e) => e.variance === 'increase').length,
      employeesWithDecrease: data.filter((e) => e.variance === 'decrease').length,
      employeesNoChange: data.filter((e) => e.variance === 'no-change').length,
      aboveThreshold: data.filter((e) => Math.abs(e.netPercentChange) > filters.varianceThreshold).length,
      critical: data.filter((e) => e.status === 'critical').length,
      flagged: data.filter((e) => e.flagged).length,
      totalGrossDifferenceA: data.reduce((sum, e) => sum + e.monthAGross, 0),
      totalGrossDifferenceB: data.reduce((sum, e) => sum + e.monthBGross, 0),
      totalDeductionDifferenceA: data.reduce((sum, e) => sum + e.monthADeductions, 0),
      totalDeductionDifferenceB: data.reduce((sum, e) => sum + e.monthBDeductions, 0),
      totalNetDifferenceA: data.reduce((sum, e) => sum + e.monthANet, 0),
      totalNetDifferenceB: data.reduce((sum, e) => sum + e.monthBNet, 0),
      netImpact: data.reduce((sum, e) => sum + e.netDifference, 0),
      avgPercentChange: data.length > 0 ?
      data.reduce((sum, e) => sum + e.netPercentChange, 0) / data.length :
      0
    };
  }, [filteredData, filters.varianceThreshold]);

  // Handlers
  const handleSort = (key: keyof EmployeeVarianceData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleViewEmployee = (employee: EmployeeVarianceData) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleAddNote = useCallback((empId: number, note: string) => {
    setVarianceData((prev) =>
    prev.map((emp) =>
    emp.id === empId ? { ...emp, notes: note, lastUpdated: new Date() } : emp
    )
    );
    addAuditLog(empId, 'Note Added', 'Audit note updated');
    addNotification('success', 'Notes saved successfully');
  }, [addAuditLog, addNotification]);

  const handleFlagEmployee = useCallback((empId: number, reason: string) => {
    setVarianceData((prev) =>
    prev.map((emp) =>
    emp.id === empId ?
    { ...emp, flagged: true, flagReason: reason, status: 'flagged', lastUpdated: new Date() } :
    emp
    )
    );
    addAuditLog(empId, 'Flagged', `Flagged for review: ${reason}`);
    addNotification('warning', 'Employee flagged for review');
  }, [addAuditLog, addNotification]);

  const handleUnflagEmployee = useCallback((empId: number) => {
    const emp = varianceData.find((e) => e.id === empId);
    const newStatus: VarianceStatus = Math.abs(emp?.netPercentChange || 0) > 15 ?
    'critical' :
    Math.abs(emp?.netPercentChange || 0) > filters.varianceThreshold ?
    'above-threshold' :
    'normal';

    setVarianceData((prev) =>
    prev.map((e) =>
    e.id === empId ?
    { ...e, flagged: false, flagReason: null, status: newStatus, lastUpdated: new Date() } :
    e
    )
    );
    addAuditLog(empId, 'Unflagged', 'Flag removed');
    addNotification('success', 'Flag removed');
  }, [varianceData, filters.varianceThreshold, addAuditLog, addNotification]);

  const handleUpdateAuditStatus = useCallback((empId: number, status: AuditStatus, remarks: string) => {
    setVarianceData((prev) =>
    prev.map((emp) =>
    emp.id === empId ?
    {
      ...emp,
      auditStatus: status,
      reviewedBy: 'Current User',
      reviewedAt: new Date(),
      lastUpdated: new Date()
    } :
    emp
    )
    );
    addAuditLog(empId, 'Audit Status Changed', `Status changed to ${status}: ${remarks}`, null, { status });
    addNotification('success', `Audit status updated to ${status}`);
  }, [addAuditLog, addNotification]);

  const handleBulkApprove = useCallback(() => {
    if (selectedRows.length === 0) {
      addNotification('warning', 'No employees selected');
      return;
    }

    setVarianceData((prev) =>
    prev.map((emp) =>
    selectedRows.includes(emp.id) ?
    {
      ...emp,
      auditStatus: 'approved',
      reviewedBy: 'Current User',
      reviewedAt: new Date(),
      lastUpdated: new Date()
    } :
    emp
    )
    );
    selectedRows.forEach((id) => {
      addAuditLog(id, 'Bulk Approved', 'Approved via bulk action');
    });
    addNotification('success', `${selectedRows.length} employees approved`);
    setSelectedRows([]);
  }, [selectedRows, addAuditLog, addNotification]);

  const handleBulkFlag = useCallback(() => {
    if (selectedRows.length === 0) {
      addNotification('warning', 'No employees selected');
      return;
    }

    setVarianceData((prev) =>
    prev.map((emp) =>
    selectedRows.includes(emp.id) ?
    {
      ...emp,
      flagged: true,
      flagReason: 'Flagged via bulk action',
      status: 'flagged',
      lastUpdated: new Date()
    } :
    emp
    )
    );
    selectedRows.forEach((id) => {
      addAuditLog(id, 'Bulk Flagged', 'Flagged via bulk action');
    });
    addNotification('warning', `${selectedRows.length} employees flagged`);
    setSelectedRows([]);
  }, [selectedRows, addAuditLog, addNotification]);

  const handleExport = useCallback((format: 'csv' | 'pdf' | 'excel') => {
    const data = selectedRows.length > 0 ?
    filteredData.filter((e) => selectedRows.includes(e.id)) :
    filteredData;

    if (format === 'csv') {
      const headers = ['Emp Code', 'Employee Name', 'Department', `${filters.monthA} Net`, `${filters.monthB} Net`, 'Difference', '% Change', 'Status'];
      const rows = data.map((emp) => [
      emp.empCode,
      emp.empName,
      emp.department,
      emp.monthANet,
      emp.monthBNet,
      emp.netDifference,
      emp.netPercentChange.toFixed(2),
      emp.status]
      );

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `variance-report-${filters.monthA.replace(' ', '-')}-vs-${filters.monthB.replace(' ', '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    addNotification('success', `Report exported as ${format.toUpperCase()}`);
  }, [filteredData, selectedRows, filters, addNotification]);

  const handlePrint = useCallback(() => {
    window.print();
    addNotification('info', 'Print dialog opened');
  }, [addNotification]);

  const handleSendEmail = useCallback((emails: string[], subject: string, message: string) => {
    console.log('Sending email to:', emails);
    addNotification('success', `Report sent to ${emails.length} recipient(s)`);
  }, [addNotification]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      monthA: 'April 2025',
      monthB: 'May 2025',
      department: '',
      employeeType: '',
      varianceThreshold: 5,
      varianceType: 'all',
      status: 'all',
      auditStatus: 'all',
      search: '',
      showOnlyFlagged: false,
      showOnlyAboveThreshold: false
    });
    setCurrentPage(1);
    setSelectedRows([]);
    addNotification('info', 'Filters reset');
  }, [addNotification]);

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((row) => row.id));
    }
  };

  const getVarianceIndicator = (variance: VarianceType, percentChange: number) => {
    if (variance === 'increase') {
      return (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUpIcon className="w-4 h-4" />
          <span className="text-xs font-medium">{formatPercent(percentChange)}</span>
        </div>);

    } else if (variance === 'decrease') {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDownIcon className="w-4 h-4" />
          <span className="text-xs font-medium">{formatPercent(percentChange)}</span>
        </div>);

    }
    return <span className="text-xs text-slate-400 font-medium">No Change</span>;
  };

  const getStatusBadge = (status: VarianceStatus, percentChange: number, threshold: number) => {
    if (Math.abs(percentChange) > threshold) {
      if (Math.abs(percentChange) > 15) {
        return (
          <Badge variant="error" className="inline-flex items-center gap-1">
            <AlertCircleIcon className="w-3 h-3" />
            Critical
          </Badge>);

      }
      return (
        <Badge variant="warning" className="inline-flex items-center gap-1">
          <AlertCircleIcon className="w-3 h-3" />
          Above Threshold
        </Badge>);

    }
    return <span className="text-xs text-slate-400">Normal</span>;
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in { animation: slide-in 0.3s ease-out; }
          @media print { .no-print { display: none !important; } }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 no-print">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Payroll Audit & Variance Report</h1>
              <p className="text-sm text-slate-500 mt-1">
                Compare payroll data between months and identify significant variances
              </p>
            </div>
            {reportGenerated &&
            <div className="flex items-center gap-2">
                <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={() => handleExport('csv')}>

                  Export CSV
                </Button>
                <Button
                variant="outline"
                size="sm"
                leftIcon={<PrinterIcon className="w-4 h-4" />}
                onClick={handlePrint}>

                  Print
                </Button>
                <Button
                variant="outline"
                size="sm"
                leftIcon={<MailIcon className="w-4 h-4" />}
                onClick={() => setShowEmailModal(true)}>

                  Email
                </Button>
              </div>
            }
          </div>

          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Select
              label="Compare Month A"
              value={filters.monthA}
              onChange={(val) => setFilters({ ...filters, monthA: val as string })}
              options={MONTHS} />

            <Select
              label="Compare Month B"
              value={filters.monthB}
              onChange={(val) => setFilters({ ...filters, monthB: val as string })}
              options={MONTHS} />

            <Select
              label="Department"
              value={filters.department}
              onChange={(val) => setFilters({ ...filters, department: val as string })}
              placeholder="All Departments"
              options={DEPARTMENTS} />

            <Input
              label="Variance Threshold (%)"
              type="number"
              value={filters.varianceThreshold.toString()}
              onChange={(e) =>
              setFilters({ ...filters, varianceThreshold: parseFloat(e.target.value) || 0 })
              }
              placeholder="5" />

            <div className="flex items-end">
              <Button
                variant="primary"
                className="w-full"
                leftIcon={isGenerating ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <BarChart3Icon className="w-4 h-4" />}
                onClick={handleGenerateReport}
                disabled={isGenerating}>

                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          {reportGenerated &&
          <div className="mt-4">
              <button
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

                <SlidersIcon className="w-4 h-4" />
                {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                {showAdvancedFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>

              {showAdvancedFilters &&
            <div className="mt-3 p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Select
                  label="Employee Type"
                  value={filters.employeeType}
                  onChange={(val) => setFilters({ ...filters, employeeType: val as string })}
                  placeholder="All Types"
                  options={EMPLOYEE_TYPES} />

                    <Select
                  label="Variance Type"
                  value={filters.varianceType}
                  onChange={(val) => setFilters({ ...filters, varianceType: val as string })}
                  options={VARIANCE_TYPES} />

                    <Select
                  label="Status"
                  value={filters.status}
                  onChange={(val) => setFilters({ ...filters, status: val as string })}
                  options={STATUS_OPTIONS} />

                    <Select
                  label="Audit Status"
                  value={filters.auditStatus}
                  onChange={(val) => setFilters({ ...filters, auditStatus: val as string })}
                  options={AUDIT_STATUS_OPTIONS} />

                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-xs">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                    placeholder="Search employee..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-9" />

                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={filters.showOnlyFlagged}
                    onChange={(e) => setFilters({ ...filters, showOnlyFlagged: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded" />

                      <span className="text-sm text-slate-700">Show Only Flagged</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={filters.showOnlyAboveThreshold}
                    onChange={(e) => setFilters({ ...filters, showOnlyAboveThreshold: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded" />

                      <span className="text-sm text-slate-700">Show Only Above Threshold</span>
                    </label>
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
            }
            </div>
          }
        </div>

        {/* Summary Cards */}
        {reportGenerated &&
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 no-print">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Employees</div>
              <div className="text-2xl font-bold text-slate-900">{summary.totalEmployees}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Increases</div>
              <div className="text-2xl font-bold text-emerald-700">{summary.employeesWithIncrease}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs text-red-600 uppercase tracking-wide mb-1">Decreases</div>
              <div className="text-2xl font-bold text-red-700">{summary.employeesWithDecrease}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-xs text-amber-600 uppercase tracking-wide mb-1">Above Threshold</div>
              <div className="text-2xl font-bold text-amber-700">{summary.aboveThreshold}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs text-red-600 uppercase tracking-wide mb-1">Flagged</div>
              <div className="text-2xl font-bold text-red-700">{summary.flagged}</div>
            </div>
            <div className={`border rounded-lg p-4 ${summary.netImpact >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-xs uppercase tracking-wide mb-1 ${summary.netImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                Net Impact
              </div>
              <div className={`text-2xl font-bold ${summary.netImpact >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(summary.netImpact)}
              </div>
            </div>
          </div>
        }

        {/* Bulk Actions */}
        {selectedRows.length > 0 &&
        <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg mb-4 no-print">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                {selectedRows.length} selected
              </span>
            </div>
            <div className="h-5 w-px bg-indigo-200" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<CheckCircleIcon className="w-3 h-3" />} onClick={handleBulkApprove}>
                Approve
              </Button>
              <Button variant="outline" size="sm" leftIcon={<FlagIcon className="w-3 h-3" />} onClick={handleBulkFlag}>
                Flag
              </Button>
              <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="w-3 h-3" />} onClick={() => handleExport('csv')}>
                Export
              </Button>
            </div>
            <button
            onClick={() => setSelectedRows([])}
            className="ml-auto text-sm text-indigo-600 hover:text-indigo-800">

              Clear selection
            </button>
          </div>
        }

        {/* Variance Table */}
        {reportGenerated ?
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-10 no-print">
                      <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded" />

                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('empName')}>

                      <div className="flex items-center gap-1">
                        Employee Name
                        {sortConfig?.key === 'empName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('department')}>

                      <div className="flex items-center gap-1">
                        Department
                        {sortConfig?.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('monthANet')}>

                      <div className="flex items-center justify-end gap-1">
                        {filters.monthA} Net
                        {sortConfig?.key === 'monthANet' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('monthBNet')}>

                      <div className="flex items-center justify-end gap-1">
                        {filters.monthB} Net
                        {sortConfig?.key === 'monthBNet' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('netDifference')}>

                      <div className="flex items-center justify-end gap-1">
                        Difference
                        {sortConfig?.key === 'netDifference' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                      % Change
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center no-print">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {paginatedData.length > 0 ?
                paginatedData.map((row) =>
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${
                  selectedRows.includes(row.id) ? 'bg-indigo-50' : ''} ${
                  Math.abs(row.netPercentChange) > filters.varianceThreshold ? 'bg-amber-50/50' : ''} ${
                  row.flagged ? 'border-l-4 border-l-red-500' : ''}`
                  }>

                        <td className="py-3 px-4 no-print">
                          <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="w-4 h-4 text-indigo-600 rounded" />

                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium text-slate-900">{row.empName}</p>
                              <p className="text-xs text-slate-500">{row.empCode}</p>
                            </div>
                            {row.flagged && <FlagIcon className="w-4 h-4 text-red-500" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-slate-600">{row.department}</p>
                          <p className="text-xs text-slate-400">{row.designation}</p>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          ₹{row.monthANet.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          ₹{row.monthBNet.toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold ${
                  row.netDifference > 0 ? 'text-emerald-600' :
                  row.netDifference < 0 ? 'text-red-600' : 'text-slate-400'}`
                  }>
                          {formatCurrency(row.netDifference)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getVarianceIndicator(row.variance, row.netPercentChange)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(row.status, row.netPercentChange, filters.varianceThreshold)}
                        </td>
                        <td className="py-3 px-4 text-center no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleViewEmployee(row)}
                        title="View Details">

                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                        className={`p-1.5 rounded-lg transition-colors ${
                        row.flagged ?
                        'text-red-500 hover:text-red-700 hover:bg-red-50' :
                        'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`
                        }
                        onClick={() => row.flagged ? handleUnflagEmployee(row.id) : handleFlagEmployee(row.id, 'Manually flagged for review')}
                        title={row.flagged ? 'Remove Flag' : 'Flag for Review'}>

                              <FlagIcon className="w-4 h-4" />
                            </button>
                            <button
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => handleUpdateAuditStatus(row.id, 'approved', 'Quick approved')}
                        title="Quick Approve">

                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                ) :

                <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No data found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 &&
          <div className="flex items-center justify-between p-4 border-t border-slate-200 no-print">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}>

                    First
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}>

                    <ChevronLeftIcon className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}>

                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}>

                    Last
                  </Button>
                </div>
              </div>
          }
          </div> :

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center no-print">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3Icon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Generated</h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Select two different months to compare and click "Generate Report" to view the payroll variance analysis.
            </p>
          </div>
        }
      </div>

      {/* Modals */}
      <VarianceDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onAddNote={handleAddNote}
        onFlag={handleFlagEmployee}
        onUnflag={handleUnflagEmployee}
        onUpdateAuditStatus={handleUpdateAuditStatus} />


      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        monthA={filters.monthA}
        monthB={filters.monthB} />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}