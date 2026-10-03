import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  PlusIcon,
  EditIcon,
  EyeIcon,
  SearchIcon,
  Trash2Icon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  XIcon,
  DownloadIcon,
  PrinterIcon,
  RefreshCwIcon,
  FilterIcon,
  ClockIcon,
  CheckIcon,
  SendIcon,
  UndoIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  InfoIcon,
  CopyIcon,
  MoreVerticalIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
type ArrearStatus = 'Pending' | 'Approved' | 'Processing' | 'Rejected' | 'Paid' | 'Cancelled';
type PayrollType = 'supplementary' | 'arrear';

interface ArrearEntry {
  id: number;
  empId: string;
  empName: string;
  empDepartment: string;
  empDesignation: string;
  reason: string;
  reasonCode: string;
  fromMonth: string;
  toMonth: string;
  amount: number;
  components: SalaryComponent[];
  status: ArrearStatus;
  remarks: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  approvedBy: string | null;
  approvedAt: Date | null;
  payrollType: PayrollType;
  referenceNumber: string;
  paymentDate: Date | null;
  attachments: Attachment[];
  auditLog: AuditLogEntry[];
}

interface SalaryComponent {
  id: string;
  name: string;
  amount: number;
  type: 'earning' | 'deduction';
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  oldValue: any;
  newValue: any;
  remarks: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  basicSalary: number;
}

interface ReasonOption {
  value: string;
  label: string;
  code: string;
}

interface MonthOption {
  value: string;
  label: string;
}

interface ComponentOption {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface FormErrors {
  employee?: string;
  reason?: string;
  fromMonth?: string;
  toMonth?: string;
  components?: string;
  amount?: string;
  remarks?: string;
}

// ---------------------------------------------------------------------------
// Initial Data
// ---------------------------------------------------------------------------
const EMPLOYEES: Employee[] = [
{ id: 'EMP001', name: 'Rajesh Kumar', department: 'Engineering', designation: 'Senior Developer', basicSalary: 45000 },
{ id: 'EMP002', name: 'Priya Sharma', department: 'HR', designation: 'HR Manager', basicSalary: 55000 },
{ id: 'EMP003', name: 'Amit Patel', department: 'Finance', designation: 'Accountant', basicSalary: 38000 },
{ id: 'EMP004', name: 'Sneha Reddy', department: 'Marketing', designation: 'Marketing Lead', basicSalary: 48000 },
{ id: 'EMP005', name: 'Vikram Singh', department: 'Engineering', designation: 'Tech Lead', basicSalary: 65000 },
{ id: 'EMP006', name: 'Anita Desai', department: 'Operations', designation: 'Operations Manager', basicSalary: 52000 },
{ id: 'EMP007', name: 'Rahul Mehta', department: 'Sales', designation: 'Sales Executive', basicSalary: 35000 },
{ id: 'EMP008', name: 'Kavita Joshi', department: 'Engineering', designation: 'QA Engineer', basicSalary: 40000 }];


const REASON_OPTIONS: ReasonOption[] = [
{ value: 'salary_increment', label: 'Salary Increment Arrear', code: 'INC' },
{ value: 'missed_payment', label: 'Missed Salary Payment', code: 'MSP' },
{ value: 'promotion', label: 'Promotion Arrear', code: 'PRO' },
{ value: 'allowance_adjustment', label: 'Allowance Adjustment', code: 'ALW' },
{ value: 'bonus', label: 'Bonus Payment', code: 'BON' },
{ value: 'overtime', label: 'Overtime Payment', code: 'OVT' },
{ value: 'leave_encashment', label: 'Leave Encashment', code: 'LVE' },
{ value: 'correction', label: 'Salary Correction', code: 'COR' },
{ value: 'incentive', label: 'Performance Incentive', code: 'PER' },
{ value: 'other', label: 'Other', code: 'OTH' }];


const MONTH_OPTIONS: MonthOption[] = [
{ value: 'Jan 2025', label: 'January 2025' },
{ value: 'Feb 2025', label: 'February 2025' },
{ value: 'Mar 2025', label: 'March 2025' },
{ value: 'Apr 2025', label: 'April 2025' },
{ value: 'May 2025', label: 'May 2025' },
{ value: 'Jun 2025', label: 'June 2025' },
{ value: 'Jul 2025', label: 'July 2025' },
{ value: 'Aug 2025', label: 'August 2025' },
{ value: 'Sep 2025', label: 'September 2025' },
{ value: 'Oct 2025', label: 'October 2025' },
{ value: 'Nov 2025', label: 'November 2025' },
{ value: 'Dec 2025', label: 'December 2025' }];


const COMPONENT_OPTIONS: ComponentOption[] = [
{ id: 'basic', name: 'Basic Salary', type: 'earning' },
{ id: 'hra', name: 'HRA', type: 'earning' },
{ id: 'da', name: 'Dearness Allowance', type: 'earning' },
{ id: 'ta', name: 'Transport Allowance', type: 'earning' },
{ id: 'ma', name: 'Medical Allowance', type: 'earning' },
{ id: 'special', name: 'Special Allowance', type: 'earning' },
{ id: 'bonus', name: 'Bonus', type: 'earning' },
{ id: 'overtime', name: 'Overtime Pay', type: 'earning' },
{ id: 'incentive', name: 'Incentive', type: 'earning' },
{ id: 'pf', name: 'Provident Fund', type: 'deduction' },
{ id: 'esi', name: 'ESI', type: 'deduction' },
{ id: 'tax', name: 'Professional Tax', type: 'deduction' }];


const generateReferenceNumber = (): string => {
  const prefix = 'ARR';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

const INITIAL_ARREAR_DATA: ArrearEntry[] = [
{
  id: 1,
  empId: 'EMP001',
  empName: 'Rajesh Kumar',
  empDepartment: 'Engineering',
  empDesignation: 'Senior Developer',
  reason: 'Salary Increment Arrear',
  reasonCode: 'INC',
  fromMonth: 'Jan 2025',
  toMonth: 'Apr 2025',
  amount: 12000,
  components: [
  { id: 'basic', name: 'Basic Salary', amount: 8000, type: 'earning' },
  { id: 'hra', name: 'HRA', amount: 4000, type: 'earning' }],

  status: 'Approved',
  remarks: 'Annual increment arrear calculation for Q1',
  createdAt: new Date('2025-04-15'),
  createdBy: 'HR Admin',
  updatedAt: new Date('2025-04-18'),
  updatedBy: 'Finance Manager',
  approvedBy: 'CFO',
  approvedAt: new Date('2025-04-18'),
  payrollType: 'arrear',
  referenceNumber: 'ARR202504001',
  paymentDate: null,
  attachments: [],
  auditLog: [
  {
    id: '1',
    action: 'Created',
    performedBy: 'HR Admin',
    performedAt: new Date('2025-04-15'),
    oldValue: null,
    newValue: { status: 'Pending' },
    remarks: 'Entry created'
  },
  {
    id: '2',
    action: 'Approved',
    performedBy: 'CFO',
    performedAt: new Date('2025-04-18'),
    oldValue: { status: 'Pending' },
    newValue: { status: 'Approved' },
    remarks: 'Approved after verification'
  }]

},
{
  id: 2,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  empDepartment: 'HR',
  empDesignation: 'HR Manager',
  reason: 'Missed Salary Payment',
  reasonCode: 'MSP',
  fromMonth: 'Mar 2025',
  toMonth: 'Mar 2025',
  amount: 32000,
  components: [
  { id: 'basic', name: 'Basic Salary', amount: 20000, type: 'earning' },
  { id: 'hra', name: 'HRA', amount: 8000, type: 'earning' },
  { id: 'ta', name: 'Transport Allowance', amount: 4000, type: 'earning' }],

  status: 'Pending',
  remarks: 'March salary was missed due to system error',
  createdAt: new Date('2025-04-20'),
  createdBy: 'Payroll Admin',
  updatedAt: new Date('2025-04-20'),
  updatedBy: 'Payroll Admin',
  approvedBy: null,
  approvedAt: null,
  payrollType: 'supplementary',
  referenceNumber: 'ARR202504002',
  paymentDate: null,
  attachments: [],
  auditLog: [
  {
    id: '1',
    action: 'Created',
    performedBy: 'Payroll Admin',
    performedAt: new Date('2025-04-20'),
    oldValue: null,
    newValue: { status: 'Pending' },
    remarks: 'Entry created for missed payment'
  }]

},
{
  id: 3,
  empId: 'EMP003',
  empName: 'Amit Patel',
  empDepartment: 'Finance',
  empDesignation: 'Accountant',
  reason: 'Promotion Arrear',
  reasonCode: 'PRO',
  fromMonth: 'Feb 2025',
  toMonth: 'Apr 2025',
  amount: 18000,
  components: [
  { id: 'basic', name: 'Basic Salary', amount: 12000, type: 'earning' },
  { id: 'special', name: 'Special Allowance', amount: 6000, type: 'earning' }],

  status: 'Approved',
  remarks: 'Promotion effective from February but processed in April',
  createdAt: new Date('2025-04-10'),
  createdBy: 'HR Admin',
  updatedAt: new Date('2025-04-15'),
  updatedBy: 'Finance Manager',
  approvedBy: 'CFO',
  approvedAt: new Date('2025-04-15'),
  payrollType: 'arrear',
  referenceNumber: 'ARR202504003',
  paymentDate: new Date('2025-04-25'),
  attachments: [],
  auditLog: []
},
{
  id: 4,
  empId: 'EMP004',
  empName: 'Sneha Reddy',
  empDepartment: 'Marketing',
  empDesignation: 'Marketing Lead',
  reason: 'Allowance Adjustment',
  reasonCode: 'ALW',
  fromMonth: 'Jan 2025',
  toMonth: 'Mar 2025',
  amount: 9000,
  components: [
  { id: 'ta', name: 'Transport Allowance', amount: 4500, type: 'earning' },
  { id: 'ma', name: 'Medical Allowance', amount: 4500, type: 'earning' }],

  status: 'Processing',
  remarks: 'Allowance revision as per new policy',
  createdAt: new Date('2025-04-22'),
  createdBy: 'HR Admin',
  updatedAt: new Date('2025-04-23'),
  updatedBy: 'Payroll Admin',
  approvedBy: 'Finance Manager',
  approvedAt: new Date('2025-04-23'),
  payrollType: 'arrear',
  referenceNumber: 'ARR202504004',
  paymentDate: null,
  attachments: [],
  auditLog: []
},
{
  id: 5,
  empId: 'EMP005',
  empName: 'Vikram Singh',
  empDepartment: 'Engineering',
  empDesignation: 'Tech Lead',
  reason: 'Bonus Payment',
  reasonCode: 'BON',
  fromMonth: 'Apr 2025',
  toMonth: 'Apr 2025',
  amount: 25000,
  components: [
  { id: 'bonus', name: 'Bonus', amount: 25000, type: 'earning' }],

  status: 'Pending',
  remarks: 'Q1 performance bonus',
  createdAt: new Date('2025-04-25'),
  createdBy: 'HR Admin',
  updatedAt: new Date('2025-04-25'),
  updatedBy: 'HR Admin',
  approvedBy: null,
  approvedAt: null,
  payrollType: 'supplementary',
  referenceNumber: 'ARR202504005',
  paymentDate: null,
  attachments: [],
  auditLog: []
},
{
  id: 6,
  empId: 'EMP006',
  empName: 'Anita Desai',
  empDepartment: 'Operations',
  empDesignation: 'Operations Manager',
  reason: 'Overtime Payment',
  reasonCode: 'OVT',
  fromMonth: 'Mar 2025',
  toMonth: 'Apr 2025',
  amount: 15000,
  components: [
  { id: 'overtime', name: 'Overtime Pay', amount: 15000, type: 'earning' }],

  status: 'Rejected',
  remarks: 'Overtime hours not verified by supervisor',
  createdAt: new Date('2025-04-18'),
  createdBy: 'Payroll Admin',
  updatedAt: new Date('2025-04-20'),
  updatedBy: 'Finance Manager',
  approvedBy: null,
  approvedAt: null,
  payrollType: 'supplementary',
  referenceNumber: 'ARR202504006',
  paymentDate: null,
  attachments: [],
  auditLog: []
}];


// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------
const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatDate = (date: Date | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getMonthIndex = (monthStr: string): number => {
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthStr.split(' ')[0];
  return monthOrder.indexOf(month);
};

const isValidDateRange = (fromMonth: string, toMonth: string): boolean => {
  const fromIndex = getMonthIndex(fromMonth);
  const toIndex = getMonthIndex(toMonth);
  return fromIndex <= toIndex;
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
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] ${styles[notification.type]} animate-slide-in`}>

            {icons[notification.type]}
            <span className="flex-1 text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => onDismiss(notification.id)}
              className="p-1 hover:opacity-70 transition-opacity">

              <XIcon className="h-4 w-4" />
            </button>
          </div>);

      })}
    </div>);

}

// ---------------------------------------------------------------------------
// Confirmation Dialog Component
// ---------------------------------------------------------------------------
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-indigo-600 hover:bg-indigo-700'
  };

  const icons = {
    danger: <XCircleIcon className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />,
    info: <InfoIcon className="h-6 w-6 text-blue-600" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icons[variant]}
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <button
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${variantStyles[variant]}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}>

              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// View Entry Modal Component
// ---------------------------------------------------------------------------
interface ViewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ArrearEntry | null;
  onEdit: (entry: ArrearEntry) => void;
  onStatusChange: (id: number, status: ArrearStatus, remarks: string) => void;
  onDuplicate: (entry: ArrearEntry) => void;
}

function ViewEntryModal({
  isOpen,
  onClose,
  entry,
  onEdit,
  onStatusChange,
  onDuplicate
}: ViewEntryModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'components' | 'history'>('details');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ArrearStatus>('Pending');
  const [statusRemarks, setStatusRemarks] = useState('');

  if (!entry) return null;

  const getStatusBadge = (status: ArrearStatus) => {
    const variants: Record<ArrearStatus, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
      Approved: 'success',
      Pending: 'warning',
      Processing: 'info',
      Rejected: 'error',
      Paid: 'success',
      Cancelled: 'default'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const availableStatusTransitions: Record<ArrearStatus, ArrearStatus[]> = {
    Pending: ['Approved', 'Rejected', 'Cancelled'],
    Approved: ['Processing', 'Cancelled'],
    Processing: ['Paid', 'Cancelled'],
    Rejected: ['Pending'],
    Paid: [],
    Cancelled: ['Pending']
  };

  const handleStatusUpdate = () => {
    if (statusRemarks.trim()) {
      onStatusChange(entry.id, newStatus, statusRemarks);
      setShowStatusModal(false);
      setStatusRemarks('');
    }
  };

  const totalEarnings = entry.components.
  filter((c) => c.type === 'earning').
  reduce((sum, c) => sum + c.amount, 0);

  const totalDeductions = entry.components.
  filter((c) => c.type === 'deduction').
  reduce((sum, c) => sum + c.amount, 0);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="View Entry Details" size="lg">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-semibold text-slate-900">{entry.empName}</span>
                {getStatusBadge(entry.status)}
              </div>
              <p className="text-sm text-slate-500">
                {entry.empId} • {entry.empDepartment} • {entry.empDesignation}
              </p>
              <p className="text-xs text-slate-400 mt-1">Ref: {entry.referenceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(entry.amount)}</p>
              <p className="text-xs text-slate-500 capitalize">{entry.payrollType}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-6">
              {[
              { id: 'details', label: 'Details' },
              { id: 'components', label: 'Components' },
              { id: 'history', label: 'History' }].
              map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ?
                'border-indigo-600 text-indigo-600' :
                'border-transparent text-slate-500 hover:text-slate-700'}`
                }>

                  {tab.label}
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'details' &&
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Reason</label>
                    <p className="text-sm text-slate-900">{entry.reason}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Period</label>
                    <p className="text-sm text-slate-900">
                      {entry.fromMonth} - {entry.toMonth}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Created</label>
                    <p className="text-sm text-slate-900">
                      {formatDateTime(entry.createdAt)} by {entry.createdBy}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Remarks</label>
                    <p className="text-sm text-slate-900">{entry.remarks || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Approved By</label>
                    <p className="text-sm text-slate-900">
                      {entry.approvedBy ? `${entry.approvedBy} on ${formatDate(entry.approvedAt)}` : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Payment Date</label>
                    <p className="text-sm text-slate-900">{formatDate(entry.paymentDate)}</p>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'components' &&
            <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Earnings</h4>
                  <div className="space-y-2">
                    {entry.components.
                  filter((c) => c.type === 'earning').
                  map((component) =>
                  <div
                    key={component.id}
                    className="flex items-center justify-between p-2 bg-green-50 rounded">

                          <span className="text-sm text-slate-700">{component.name}</span>
                          <span className="text-sm font-medium text-green-700">
                            +{formatCurrency(component.amount)}
                          </span>
                        </div>
                  )}
                    <div className="flex items-center justify-between p-2 bg-green-100 rounded font-medium">
                      <span className="text-sm text-slate-900">Total Earnings</span>
                      <span className="text-sm text-green-800">{formatCurrency(totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {entry.components.filter((c) => c.type === 'deduction').length > 0 &&
              <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Deductions</h4>
                    <div className="space-y-2">
                      {entry.components.
                  filter((c) => c.type === 'deduction').
                  map((component) =>
                  <div
                    key={component.id}
                    className="flex items-center justify-between p-2 bg-red-50 rounded">

                            <span className="text-sm text-slate-700">{component.name}</span>
                            <span className="text-sm font-medium text-red-700">
                              -{formatCurrency(component.amount)}
                            </span>
                          </div>
                  )}
                      <div className="flex items-center justify-between p-2 bg-red-100 rounded font-medium">
                        <span className="text-sm text-slate-900">Total Deductions</span>
                        <span className="text-sm text-red-800">{formatCurrency(totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
              }

                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                  <span className="font-semibold text-slate-900">Net Amount</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(totalEarnings - totalDeductions)}
                  </span>
                </div>
              </div>
            }

            {activeTab === 'history' &&
            <div className="space-y-3">
                {entry.auditLog.length > 0 ?
              entry.auditLog.map((log) =>
              <div key={log.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{log.action}</span>
                          <span className="text-xs text-slate-500">{formatDateTime(log.performedAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500">by {log.performedBy}</p>
                        {log.remarks &&
                  <p className="text-sm text-slate-600 mt-1">{log.remarks}</p>
                  }
                      </div>
                    </div>
              ) :

              <div className="text-center py-8 text-slate-500">
                    <ClockIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No history available</p>
                  </div>
              }
              </div>
            }
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex gap-2">
              {availableStatusTransitions[entry.status].length > 0 &&
              <Button
                variant="outline"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                onClick={() => setShowStatusModal(true)}>

                  Change Status
                </Button>
              }
              <Button
                variant="outline"
                leftIcon={<CopyIcon className="w-4 h-4" />}
                onClick={() => {
                  onDuplicate(entry);
                  onClose();
                }}>

                Duplicate
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {entry.status === 'Pending' &&
              <Button
                variant="primary"
                leftIcon={<EditIcon className="w-4 h-4" />}
                onClick={() => {
                  onEdit(entry);
                  onClose();
                }}>

                  Edit
                </Button>
              }
            </div>
          </div>
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Change Status"
        size="sm">

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Status</label>
            <div>{getStatusBadge(entry.status)}</div>
          </div>

          <Select
            label="New Status"
            value={newStatus}
            onChange={(val) => setNewStatus(val as ArrearStatus)}
            options={availableStatusTransitions[entry.status].map((status) => ({
              value: status,
              label: status
            }))} />


          <Textarea
            label="Remarks"
            placeholder="Enter reason for status change..."
            value={statusRemarks}
            onChange={(e) => setStatusRemarks(e.target.value)}
            rows={3} />


          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStatusUpdate} disabled={!statusRemarks.trim()}>
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </>);

}

// ---------------------------------------------------------------------------
// Add/Edit Entry Modal Component
// ---------------------------------------------------------------------------
interface EntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<ArrearEntry>) => void;
  entry?: ArrearEntry | null;
  mode: 'add' | 'edit' | 'duplicate';
}

function EntryFormModal({ isOpen, onClose, onSave, entry, mode }: EntryFormModalProps) {
  const [formData, setFormData] = useState({
    empId: '',
    reason: '',
    fromMonth: '',
    toMonth: '',
    components: [] as {id: string;amount: number;}[],
    remarks: '',
    payrollType: 'arrear' as PayrollType
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [componentAmounts, setComponentAmounts] = useState<Record<string, number>>({});
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  useEffect(() => {
    if (entry && (mode === 'edit' || mode === 'duplicate')) {
      setFormData({
        empId: entry.empId,
        reason: entry.reasonCode,
        fromMonth: entry.fromMonth,
        toMonth: entry.toMonth,
        components: entry.components.map((c) => ({ id: c.id, amount: c.amount })),
        remarks: mode === 'duplicate' ? '' : entry.remarks,
        payrollType: entry.payrollType
      });
      setSelectedComponents(entry.components.map((c) => c.id));
      const amounts: Record<string, number> = {};
      entry.components.forEach((c) => {
        amounts[c.id] = c.amount;
      });
      setComponentAmounts(amounts);
    } else {
      resetForm();
    }
  }, [entry, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      empId: '',
      reason: '',
      fromMonth: '',
      toMonth: '',
      components: [],
      remarks: '',
      payrollType: 'arrear'
    });
    setErrors({});
    setComponentAmounts({});
    setSelectedComponents([]);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.empId) {
      newErrors.employee = 'Please select an employee';
    }
    if (!formData.reason) {
      newErrors.reason = 'Please select a reason';
    }
    if (!formData.fromMonth) {
      newErrors.fromMonth = 'Please select from month';
    }
    if (!formData.toMonth) {
      newErrors.toMonth = 'Please select to month';
    }
    if (formData.fromMonth && formData.toMonth && !isValidDateRange(formData.fromMonth, formData.toMonth)) {
      newErrors.toMonth = 'To month must be after or same as from month';
    }
    if (selectedComponents.length === 0) {
      newErrors.components = 'Please select at least one component';
    }

    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      newErrors.amount = 'Total amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalAmount = (): number => {
    return selectedComponents.reduce((sum, compId) => {
      const component = COMPONENT_OPTIONS.find((c) => c.id === compId);
      const amount = componentAmounts[compId] || 0;
      if (component?.type === 'deduction') {
        return sum - amount;
      }
      return sum + amount;
    }, 0);
  };

  const handleComponentToggle = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter((id) => id !== componentId));
      const newAmounts = { ...componentAmounts };
      delete newAmounts[componentId];
      setComponentAmounts(newAmounts);
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };

  const handleComponentAmountChange = (componentId: string, amount: number) => {
    setComponentAmounts({
      ...componentAmounts,
      [componentId]: amount
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const selectedEmployee = EMPLOYEES.find((e) => e.id === formData.empId);
    const selectedReason = REASON_OPTIONS.find((r) => r.value === formData.reason);

    const components: SalaryComponent[] = selectedComponents.map((compId) => {
      const comp = COMPONENT_OPTIONS.find((c) => c.id === compId)!;
      return {
        id: compId,
        name: comp.name,
        amount: componentAmounts[compId] || 0,
        type: comp.type
      };
    });

    const entryData: Partial<ArrearEntry> = {
      empId: formData.empId,
      empName: selectedEmployee?.name || '',
      empDepartment: selectedEmployee?.department || '',
      empDesignation: selectedEmployee?.designation || '',
      reason: selectedReason?.label || '',
      reasonCode: selectedReason?.code || '',
      fromMonth: formData.fromMonth,
      toMonth: formData.toMonth,
      amount: calculateTotalAmount(),
      components,
      remarks: formData.remarks,
      payrollType: formData.payrollType
    };

    if (mode === 'edit' && entry) {
      entryData.id = entry.id;
    }

    onSave(entryData);
    onClose();
    resetForm();
  };

  const modalTitle = {
    add: 'Add Arrear / Supplementary Entry',
    edit: 'Edit Entry',
    duplicate: 'Duplicate Entry'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle[mode]} size="lg">
      <div className="space-y-4">
        {/* Payroll Type */}
        <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payrollType"
              value="arrear"
              checked={formData.payrollType === 'arrear'}
              onChange={(e) => setFormData({ ...formData, payrollType: e.target.value as PayrollType })}
              className="w-4 h-4 text-indigo-600" />

            <span className="text-sm font-medium text-slate-700">Arrear</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payrollType"
              value="supplementary"
              checked={formData.payrollType === 'supplementary'}
              onChange={(e) => setFormData({ ...formData, payrollType: e.target.value as PayrollType })}
              className="w-4 h-4 text-indigo-600" />

            <span className="text-sm font-medium text-slate-700">Supplementary</span>
          </label>
        </div>

        {/* Employee Selection */}
        <div>
          <Select
            label="Employee"
            placeholder="Select Employee"
            value={formData.empId}
            onChange={(val) => setFormData({ ...formData, empId: val as string })}
            options={EMPLOYEES.map((emp) => ({
              value: emp.id,
              label: `${emp.name} (${emp.id}) - ${emp.department}`
            }))}
            error={errors.employee} />

        </div>

        {/* Reason Selection */}
        <div>
          <Select
            label="Reason"
            placeholder="Select Reason"
            value={formData.reason}
            onChange={(val) => setFormData({ ...formData, reason: val as string })}
            options={REASON_OPTIONS.map((reason) => ({
              value: reason.value,
              label: reason.label
            }))}
            error={errors.reason} />

        </div>

        {/* Period Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="From Month"
            placeholder="Select Month"
            value={formData.fromMonth}
            onChange={(val) => setFormData({ ...formData, fromMonth: val as string })}
            options={MONTH_OPTIONS.map((month) => ({
              value: month.value,
              label: month.label
            }))}
            error={errors.fromMonth} />

          <Select
            label="To Month"
            placeholder="Select Month"
            value={formData.toMonth}
            onChange={(val) => setFormData({ ...formData, toMonth: val as string })}
            options={MONTH_OPTIONS.map((month) => ({
              value: month.value,
              label: month.label
            }))}
            error={errors.toMonth} />

        </div>

        {/* Component Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Salary Components
            {errors.components &&
            <span className="text-red-500 text-xs ml-2">{errors.components}</span>
            }
          </label>
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {COMPONENT_OPTIONS.map((component) => {
              const isSelected = selectedComponents.includes(component.id);
              return (
                <div
                  key={component.id}
                  className={`p-3 ${isSelected ? 'bg-indigo-50' : 'bg-white'}`}>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleComponentToggle(component.id)}
                        className="w-4 h-4 text-indigo-600 rounded" />

                      <span className="text-sm text-slate-700">{component.name}</span>
                      <Badge variant={component.type === 'earning' ? 'success' : 'error'} className="text-xs">
                        {component.type}
                      </Badge>
                    </label>
                    {isSelected &&
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={componentAmounts[component.id] || ''}
                      onChange={(e) =>
                      handleComponentAmountChange(component.id, parseFloat(e.target.value) || 0)
                      }
                      className="w-32" />

                    }
                  </div>
                </div>);

            })}
          </div>
          {errors.amount &&
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          }
        </div>

        {/* Total Amount Display */}
        {selectedComponents.length > 0 &&
        <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Amount</span>
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(calculateTotalAmount())}
              </span>
            </div>
          </div>
        }

        {/* Remarks */}
        <Textarea
          label="Remarks"
          placeholder="Enter remarks (optional)"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          rows={3} />

      </div>

      <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === 'edit' ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Bulk Actions Component
// ---------------------------------------------------------------------------
interface BulkActionsProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

function BulkActions({
  selectedCount,
  onApprove,
  onReject,
  onDelete,
  onExport,
  onClearSelection
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-indigo-900">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-indigo-600 hover:text-indigo-800 underline">

          Clear selection
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<CheckIcon className="w-3 h-3" />}
          onClick={onApprove}>

          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<XIcon className="w-3 h-3" />}
          onClick={onReject}>

          Reject
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<DownloadIcon className="w-3 h-3" />}
          onClick={onExport}>

          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Trash2Icon className="w-3 h-3" />}
          onClick={onDelete}
          className="text-red-600 hover:bg-red-50">

          Delete
        </Button>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function SupplementaryArrearPayroll() {
  // State Management
  const [arrearData, setArrearData] = useState<ArrearEntry[]>(INITIAL_ARREAR_DATA);
  const [filters, setFilters] = useState({
    month: 'all',
    payrollType: 'all',
    status: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArrearEntry;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ArrearEntry | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'info' });

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Utility Functions
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

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let result = [...arrearData];

    // Apply filters
    if (filters.month !== 'all') {
      result = result.filter(
        (item) => item.fromMonth.includes(filters.month) || item.toMonth.includes(filters.month)
      );
    }

    if (filters.payrollType !== 'all') {
      result = result.filter((item) => item.payrollType === filters.payrollType);
    }

    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
        item.empName.toLowerCase().includes(searchLower) ||
        item.empId.toLowerCase().includes(searchLower) ||
        item.reason.toLowerCase().includes(searchLower) ||
        item.referenceNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ?
          aValue.localeCompare(bValue) :
          bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [arrearData, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handlers
  const handleSort = (key: keyof ArrearEntry) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddEntry = (entryData: Partial<ArrearEntry>) => {
    const newEntry: ArrearEntry = {
      id: Math.max(...arrearData.map((e) => e.id)) + 1,
      empId: entryData.empId || '',
      empName: entryData.empName || '',
      empDepartment: entryData.empDepartment || '',
      empDesignation: entryData.empDesignation || '',
      reason: entryData.reason || '',
      reasonCode: entryData.reasonCode || '',
      fromMonth: entryData.fromMonth || '',
      toMonth: entryData.toMonth || '',
      amount: entryData.amount || 0,
      components: entryData.components || [],
      status: 'Pending',
      remarks: entryData.remarks || '',
      createdAt: new Date(),
      createdBy: 'Current User',
      updatedAt: new Date(),
      updatedBy: 'Current User',
      approvedBy: null,
      approvedAt: null,
      payrollType: entryData.payrollType || 'arrear',
      referenceNumber: generateReferenceNumber(),
      paymentDate: null,
      attachments: [],
      auditLog: [
      {
        id: Date.now().toString(),
        action: 'Created',
        performedBy: 'Current User',
        performedAt: new Date(),
        oldValue: null,
        newValue: { status: 'Pending' },
        remarks: 'Entry created'
      }]

    };

    setArrearData((prev) => [newEntry, ...prev]);
    addNotification('success', `Entry created successfully for ${newEntry.empName}`);
  };

  const handleEditEntry = (entryData: Partial<ArrearEntry>) => {
    setArrearData((prev) =>
    prev.map((item) => {
      if (item.id === entryData.id) {
        const updatedEntry = {
          ...item,
          ...entryData,
          updatedAt: new Date(),
          updatedBy: 'Current User',
          auditLog: [
          ...item.auditLog,
          {
            id: Date.now().toString(),
            action: 'Updated',
            performedBy: 'Current User',
            performedAt: new Date(),
            oldValue: { amount: item.amount, reason: item.reason },
            newValue: { amount: entryData.amount, reason: entryData.reason },
            remarks: 'Entry updated'
          }]

        };
        return updatedEntry;
      }
      return item;
    })
    );
    addNotification('success', 'Entry updated successfully');
  };

  const handleDeleteEntry = (id: number) => {
    const entry = arrearData.find((e) => e.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Entry',
      message: `Are you sure you want to delete the entry for ${entry?.empName}? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => {
        setArrearData((prev) => prev.filter((item) => item.id !== id));
        addNotification('success', 'Entry deleted successfully');
      }
    });
  };

  const handleStatusChange = (id: number, newStatus: ArrearStatus, remarks: string) => {
    setArrearData((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          updatedAt: new Date(),
          updatedBy: 'Current User',
          approvedBy: ['Approved', 'Rejected'].includes(newStatus) ? 'Current User' : item.approvedBy,
          approvedAt: ['Approved', 'Rejected'].includes(newStatus) ? new Date() : item.approvedAt,
          paymentDate: newStatus === 'Paid' ? new Date() : item.paymentDate,
          auditLog: [
          ...item.auditLog,
          {
            id: Date.now().toString(),
            action: `Status changed to ${newStatus}`,
            performedBy: 'Current User',
            performedAt: new Date(),
            oldValue: { status: item.status },
            newValue: { status: newStatus },
            remarks
          }]

        };
      }
      return item;
    })
    );
    addNotification('success', `Status changed to ${newStatus}`);
  };

  const handleViewEntry = (entry: ArrearEntry) => {
    setSelectedEntry(entry);
    setShowViewModal(true);
  };

  const handleEditEntryClick = (entry: ArrearEntry) => {
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleDuplicateEntry = (entry: ArrearEntry) => {
    setSelectedEntry(entry);
    setShowDuplicateModal(true);
  };

  // Bulk Actions
  const handleBulkApprove = () => {
    const pendingSelected = selectedIds.filter((id) => {
      const entry = arrearData.find((e) => e.id === id);
      return entry?.status === 'Pending';
    });

    if (pendingSelected.length === 0) {
      addNotification('warning', 'No pending entries selected for approval');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Approve',
      message: `Are you sure you want to approve ${pendingSelected.length} entries?`,
      variant: 'info',
      onConfirm: () => {
        pendingSelected.forEach((id) => {
          handleStatusChange(id, 'Approved', 'Bulk approved');
        });
        setSelectedIds([]);
        addNotification('success', `${pendingSelected.length} entries approved`);
      }
    });
  };

  const handleBulkReject = () => {
    const pendingSelected = selectedIds.filter((id) => {
      const entry = arrearData.find((e) => e.id === id);
      return entry?.status === 'Pending';
    });

    if (pendingSelected.length === 0) {
      addNotification('warning', 'No pending entries selected for rejection');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Reject',
      message: `Are you sure you want to reject ${pendingSelected.length} entries?`,
      variant: 'warning',
      onConfirm: () => {
        pendingSelected.forEach((id) => {
          handleStatusChange(id, 'Rejected', 'Bulk rejected');
        });
        setSelectedIds([]);
        addNotification('success', `${pendingSelected.length} entries rejected`);
      }
    });
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Bulk Delete',
      message: `Are you sure you want to delete ${selectedIds.length} entries? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => {
        setArrearData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        addNotification('success', `${selectedIds.length} entries deleted`);
      }
    });
  };

  const handleExport = () => {
    const dataToExport = selectedIds.length > 0 ?
    arrearData.filter((item) => selectedIds.includes(item.id)) :
    filteredData;

    const csvContent = [
    ['Reference', 'Employee ID', 'Employee Name', 'Reason', 'From', 'To', 'Amount', 'Status', 'Created Date'].join(','),
    ...dataToExport.map((item) =>
    [
    item.referenceNumber,
    item.empId,
    item.empName,
    item.reason,
    item.fromMonth,
    item.toMonth,
    item.amount,
    item.status,
    formatDate(item.createdAt)].
    join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arrear-payroll-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('success', `Exported ${dataToExport.length} entries`);
  };

  const handlePrint = () => {
    window.print();
    addNotification('info', 'Print dialog opened');
  };

  const handleRefresh = () => {
    setFilters({
      month: 'all',
      payrollType: 'all',
      status: 'all',
      search: ''
    });
    setSortConfig(null);
    setSelectedIds([]);
    setCurrentPage(1);
    addNotification('info', 'Data refreshed');
  };

  const getStatusBadge = (status: ArrearStatus) => {
    const variants: Record<ArrearStatus, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
      Approved: 'success',
      Pending: 'warning',
      Processing: 'info',
      Rejected: 'error',
      Paid: 'success',
      Cancelled: 'default'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Summary Statistics
  const summaryStats = useMemo(() => {
    const total = filteredData.reduce((sum, item) => sum + item.amount, 0);
    const pending = filteredData.filter((item) => item.status === 'Pending').length;
    const approved = filteredData.filter((item) => item.status === 'Approved').length;
    const processing = filteredData.filter((item) => item.status === 'Processing').length;
    const rejected = filteredData.filter((item) => item.status === 'Rejected').length;

    return { total, pending, approved, processing, rejected, count: filteredData.length };
  }, [filteredData]);

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
          @media print {
            .no-print { display: none !important; }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Supplementary / Arrear Payroll
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage arrear and supplementary payroll entries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                onClick={handleRefresh}>

                Refresh
              </Button>
              <Button
                variant="outline"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={handleExport}>

                Export
              </Button>
              <Button
                variant="outline"
                leftIcon={<PrinterIcon className="w-4 h-4" />}
                onClick={handlePrint}>

                Print
              </Button>
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setShowAddModal(true)}>

                Add New Entry
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase">Total Entries</p>
              <p className="text-2xl font-bold text-slate-900">{summaryStats.count}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs font-medium text-yellow-600 uppercase">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{summaryStats.pending}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-600 uppercase">Approved</p>
              <p className="text-2xl font-bold text-green-700">{summaryStats.approved}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-600 uppercase">Processing</p>
              <p className="text-2xl font-bold text-blue-700">{summaryStats.processing}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs font-medium text-indigo-600 uppercase">Total Amount</p>
              <p className="text-2xl font-bold text-indigo-700">{formatCurrency(summaryStats.total)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <Select
              value={filters.month}
              onChange={(val) => setFilters({ ...filters, month: val as string })}
              options={[
              { value: 'all', label: 'All Months' },
              ...MONTH_OPTIONS.map((m) => ({ value: m.value, label: m.label }))]
              }
              className="w-40" />

            <Select
              value={filters.payrollType}
              onChange={(val) => setFilters({ ...filters, payrollType: val as string })}
              options={[
              { value: 'all', label: 'All Types' },
              { value: 'supplementary', label: 'Supplementary' },
              { value: 'arrear', label: 'Arrear' }]
              }
              className="w-48" />

            <Select
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val as string })}
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Processing', label: 'Processing' },
              { value: 'Rejected', label: 'Rejected' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Cancelled', label: 'Cancelled' }]
              }
              className="w-40" />

            <Input
              placeholder="Search employee, ID, reference..."
              leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="md:w-72" />

            <Select
              value={itemsPerPage.toString()}
              onChange={(val) => {
                setItemsPerPage(parseInt(val as string));
                setCurrentPage(1);
              }}
              options={[
              { value: '10', label: '10 per page' },
              { value: '25', label: '25 per page' },
              { value: '50', label: '50 per page' },
              { value: '100', label: '100 per page' }]
              }
              className="w-32" />

          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedIds.length}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          onDelete={handleBulkDelete}
          onExport={handleExport}
          onClearSelection={() => setSelectedIds([])} />


        {/* Main Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded" />

                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('empName')}>

                    <div className="flex items-center gap-1">
                      Employee Name
                      {sortConfig?.key === 'empName' && (
                      sortConfig.direction === 'asc' ? '↑' : '↓')
                      }
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('reason')}>

                    <div className="flex items-center gap-1">
                      Reason
                      {sortConfig?.key === 'reason' && (
                      sortConfig.direction === 'asc' ? '↑' : '↓')
                      }
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('amount')}>

                    <div className="flex items-center justify-end gap-1">
                      Amount
                      {sortConfig?.key === 'amount' && (
                      sortConfig.direction === 'asc' ? '↑' : '↓')
                      }
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('status')}>

                    <div className="flex items-center justify-center gap-1">
                      Status
                      {sortConfig?.key === 'status' && (
                      sortConfig.direction === 'asc' ? '↑' : '↓')
                      }
                    </div>
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
                  selectedIds.includes(row.id) ? 'bg-indigo-50' : ''}`
                  }>

                      <td className="py-3 px-4">
                        <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectItem(row.id)}
                      className="w-4 h-4 text-indigo-600 rounded" />

                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{row.empName}</p>
                          <p className="text-xs text-slate-500">{row.empId} • {row.empDepartment}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-slate-600">{row.reason}</p>
                          <p className="text-xs text-slate-400">{row.referenceNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={row.payrollType === 'arrear' ? 'info' : 'default'} className="capitalize">
                          {row.payrollType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {row.fromMonth === row.toMonth ?
                    row.fromMonth :
                    `${row.fromMonth} - ${row.toMonth}`}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="py-3 px-4 no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleViewEntry(row)}
                        title="View Details">

                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {row.status === 'Pending' &&
                      <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleEditEntryClick(row)}
                        title="Edit Entry">

                              <EditIcon className="w-4 h-4" />
                            </button>
                      }
                          <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleDuplicateEntry(row)}
                        title="Duplicate Entry">

                            <CopyIcon className="w-4 h-4" />
                          </button>
                          {row.status === 'Pending' &&
                      <>
                              <button
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          onClick={() => handleStatusChange(row.id, 'Approved', 'Quick approved')}
                          title="Quick Approve">

                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDeleteEntry(row.id)}
                          title="Delete Entry">

                                <Trash2Icon className="w-4 h-4" />
                              </button>
                            </>
                      }
                        </div>
                      </td>
                    </tr>
                ) :

                <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">No entries found</p>
                      <p className="text-sm">Try adjusting your filters or add a new entry</p>
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
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
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
                onClick={() => setCurrentPage((prev) => prev - 1)}>

                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}>

                  Next
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
        </div>
      </div>

      {/* Modals */}
      <EntryFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEntry}
        mode="add" />


      <EntryFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEntry(null);
        }}
        onSave={handleEditEntry}
        entry={selectedEntry}
        mode="edit" />


      <EntryFormModal
        isOpen={showDuplicateModal}
        onClose={() => {
          setShowDuplicateModal(false);
          setSelectedEntry(null);
        }}
        onSave={handleAddEntry}
        entry={selectedEntry}
        mode="duplicate" />


      <ViewEntryModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
        onEdit={(entry) => {
          setSelectedEntry(entry);
          setShowEditModal(true);
        }}
        onStatusChange={handleStatusChange}
        onDuplicate={handleDuplicateEntry} />


      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant} />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}