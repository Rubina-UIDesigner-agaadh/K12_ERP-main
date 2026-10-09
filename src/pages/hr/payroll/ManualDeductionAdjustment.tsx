import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  PlusIcon,
  EditIcon,
  SearchIcon,
  XIcon,
  Trash2Icon,
  CheckIcon,
  XCircleIcon,
  DownloadIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  EyeIcon,
  MoreVerticalIcon,
  CopyIcon,
  PauseIcon,
  PlayIcon,
  CalendarIcon,
  DollarSignIcon,
  ClockIcon,
  HistoryIcon,
  FilterIcon,
  SaveIcon,
  BanIcon,
  RepeatIcon,
  FileTextIcon,
  AlertTriangleIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type DeductionStatus = 'Active' | 'Completed' | 'Paused' | 'Cancelled';

type DeductionCategory = 'loan' | 'advance' | 'fine' | 'insurance' | 'tax' | 'other';

type RecurrenceType = 'one_time' | 'monthly' | 'quarterly' | 'yearly';

type DeductionEntry = {
  id: number;
  empId: string;
  empName: string;
  department: string;
  deductionType: DeductionCategory;
  deductionTypeName: string;
  amount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  reason: string;
  appliedMonth: string;
  startDate: string;
  endDate: string | null;
  installments: number;
  currentInstallment: number;
  recurrence: RecurrenceType;
  status: DeductionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  history: DeductionHistory[];
};

type DeductionHistory = {
  id: string;
  action: string;
  amount: number;
  date: string;
  performedBy: string;
  notes: string;
};

type Employee = {
  id: string;
  name: string;
  department: string;
  employeeCode: string;
};

type Department = {
  id: string;
  name: string;
};

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type ModalMode = 'add' | 'edit' | 'view' | 'history';

type SortField = 'empName' | 'deductionType' | 'amount' | 'appliedMonth' | 'status';
type SortDirection = 'asc' | 'desc';

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const DEDUCTION_CATEGORIES: {value: DeductionCategory;label: string;}[] = [
{ value: 'loan', label: 'Loan Recovery' },
{ value: 'advance', label: 'Advance Salary Recovery' },
{ value: 'fine', label: 'Fine / Penalty' },
{ value: 'insurance', label: 'Insurance Premium' },
{ value: 'tax', label: 'Tax Deduction' },
{ value: 'other', label: 'Other Deduction' }];


const RECURRENCE_TYPES: {value: RecurrenceType;label: string;}[] = [
{ value: 'one_time', label: 'One Time' },
{ value: 'monthly', label: 'Monthly' },
{ value: 'quarterly', label: 'Quarterly' },
{ value: 'yearly', label: 'Yearly' }];


const MONTHS = [
{ value: '2025-05', label: 'May 2025' },
{ value: '2025-06', label: 'June 2025' },
{ value: '2025-07', label: 'July 2025' },
{ value: '2025-04', label: 'April 2025' },
{ value: '2025-03', label: 'March 2025' },
{ value: '2025-02', label: 'February 2025' },
{ value: '2025-01', label: 'January 2025' }];


const EMPLOYEES: Employee[] = [
{ id: 'EMP001', name: 'Rajesh Kumar', department: 'teaching', employeeCode: 'EMP001' },
{ id: 'EMP002', name: 'Priya Sharma', department: 'admin', employeeCode: 'EMP002' },
{ id: 'EMP003', name: 'Amit Patel', department: 'it', employeeCode: 'EMP003' },
{ id: 'EMP004', name: 'Sneha Reddy', department: 'teaching', employeeCode: 'EMP004' },
{ id: 'EMP005', name: 'Vikram Singh', department: 'admin', employeeCode: 'EMP005' },
{ id: 'EMP006', name: 'Meera Joshi', department: 'teaching', employeeCode: 'EMP006' },
{ id: 'EMP007', name: 'Arun Nair', department: 'it', employeeCode: 'EMP007' },
{ id: 'EMP008', name: 'Kavita Menon', department: 'teaching', employeeCode: 'EMP008' },
{ id: 'EMP009', name: 'Suresh Rao', department: 'admin', employeeCode: 'EMP009' },
{ id: 'EMP010', name: 'Deepa Iyer', department: 'it', employeeCode: 'EMP010' }];


const DEPARTMENTS: Department[] = [
{ id: 'teaching', name: 'Teaching' },
{ id: 'admin', name: 'Administration' },
{ id: 'it', name: 'IT Department' }];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* -------------------------------------------------------------------------- */
/* Initial Data                                                                */
/* -------------------------------------------------------------------------- */

const generateInitialData = (): DeductionEntry[] => [
{
  id: 1,
  empId: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'teaching',
  deductionType: 'loan',
  deductionTypeName: 'Loan Recovery',
  amount: 5000,
  totalAmount: 60000,
  paidAmount: 15000,
  remainingAmount: 45000,
  reason: 'Personal loan installment - Home renovation',
  appliedMonth: '2025-05',
  startDate: '2025-02-01',
  endDate: '2026-01-31',
  installments: 12,
  currentInstallment: 4,
  recurrence: 'monthly',
  status: 'Active',
  createdBy: 'Admin',
  createdAt: '2025-02-01T10:00:00',
  updatedAt: '2025-05-01T09:00:00',
  notes: 'Approved by HR Manager',
  history: [
  { id: 'H1', action: 'Created', amount: 5000, date: '2025-02-01', performedBy: 'Admin', notes: 'Initial setup' },
  { id: 'H2', action: 'Deducted', amount: 5000, date: '2025-02-28', performedBy: 'System', notes: 'February salary' },
  { id: 'H3', action: 'Deducted', amount: 5000, date: '2025-03-31', performedBy: 'System', notes: 'March salary' },
  { id: 'H4', action: 'Deducted', amount: 5000, date: '2025-04-30', performedBy: 'System', notes: 'April salary' }]

},
{
  id: 2,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  department: 'admin',
  deductionType: 'advance',
  deductionTypeName: 'Advance Salary Recovery',
  amount: 10000,
  totalAmount: 10000,
  paidAmount: 0,
  remainingAmount: 10000,
  reason: 'Advance taken in April for medical emergency',
  appliedMonth: '2025-05',
  startDate: '2025-05-01',
  endDate: '2025-05-31',
  installments: 1,
  currentInstallment: 1,
  recurrence: 'one_time',
  status: 'Active',
  createdBy: 'Admin',
  createdAt: '2025-04-25T14:30:00',
  updatedAt: '2025-04-25T14:30:00',
  notes: 'Emergency advance approved',
  history: [
  { id: 'H1', action: 'Created', amount: 10000, date: '2025-04-25', performedBy: 'Admin', notes: 'Emergency advance' }]

},
{
  id: 3,
  empId: 'EMP003',
  empName: 'Amit Patel',
  department: 'it',
  deductionType: 'fine',
  deductionTypeName: 'Fine / Penalty',
  amount: 1000,
  totalAmount: 1000,
  paidAmount: 1000,
  remainingAmount: 0,
  reason: 'Late attendance penalty - 5 late marks in April',
  appliedMonth: '2025-05',
  startDate: '2025-05-01',
  endDate: '2025-05-31',
  installments: 1,
  currentInstallment: 1,
  recurrence: 'one_time',
  status: 'Completed',
  createdBy: 'HR Manager',
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-15T10:00:00',
  notes: 'As per attendance policy',
  history: [
  { id: 'H1', action: 'Created', amount: 1000, date: '2025-05-01', performedBy: 'HR Manager', notes: 'Late penalty' },
  { id: 'H2', action: 'Deducted', amount: 1000, date: '2025-05-15', performedBy: 'System', notes: 'May salary' },
  { id: 'H3', action: 'Completed', amount: 0, date: '2025-05-15', performedBy: 'System', notes: 'Fully recovered' }]

},
{
  id: 4,
  empId: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'teaching',
  deductionType: 'other',
  deductionTypeName: 'Other Deduction',
  amount: 2500,
  totalAmount: 2500,
  paidAmount: 0,
  remainingAmount: 2500,
  reason: 'Uniform cost recovery - New uniform set',
  appliedMonth: '2025-05',
  startDate: '2025-05-01',
  endDate: '2025-05-31',
  installments: 1,
  currentInstallment: 1,
  recurrence: 'one_time',
  status: 'Active',
  createdBy: 'Admin',
  createdAt: '2025-05-02T11:00:00',
  updatedAt: '2025-05-02T11:00:00',
  notes: 'As per uniform policy',
  history: [
  { id: 'H1', action: 'Created', amount: 2500, date: '2025-05-02', performedBy: 'Admin', notes: 'Uniform cost' }]

},
{
  id: 5,
  empId: 'EMP005',
  empName: 'Vikram Singh',
  department: 'admin',
  deductionType: 'insurance',
  deductionTypeName: 'Insurance Premium',
  amount: 1500,
  totalAmount: 18000,
  paidAmount: 7500,
  remainingAmount: 10500,
  reason: 'Health insurance premium - Family floater plan',
  appliedMonth: '2025-05',
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  installments: 12,
  currentInstallment: 6,
  recurrence: 'monthly',
  status: 'Active',
  createdBy: 'HR Manager',
  createdAt: '2025-01-01T08:00:00',
  updatedAt: '2025-05-01T08:00:00',
  notes: 'Employee opted for family insurance',
  history: [
  { id: 'H1', action: 'Created', amount: 1500, date: '2025-01-01', performedBy: 'HR Manager', notes: 'Insurance enrollment' },
  { id: 'H2', action: 'Deducted', amount: 1500, date: '2025-01-31', performedBy: 'System', notes: 'January' },
  { id: 'H3', action: 'Deducted', amount: 1500, date: '2025-02-28', performedBy: 'System', notes: 'February' },
  { id: 'H4', action: 'Deducted', amount: 1500, date: '2025-03-31', performedBy: 'System', notes: 'March' },
  { id: 'H5', action: 'Deducted', amount: 1500, date: '2025-04-30', performedBy: 'System', notes: 'April' }]

},
{
  id: 6,
  empId: 'EMP006',
  empName: 'Meera Joshi',
  department: 'teaching',
  deductionType: 'loan',
  deductionTypeName: 'Loan Recovery',
  amount: 3000,
  totalAmount: 36000,
  paidAmount: 12000,
  remainingAmount: 24000,
  reason: 'Vehicle loan from company',
  appliedMonth: '2025-05',
  startDate: '2025-02-01',
  endDate: '2026-01-31',
  installments: 12,
  currentInstallment: 5,
  recurrence: 'monthly',
  status: 'Paused',
  createdBy: 'Admin',
  createdAt: '2025-02-01T10:00:00',
  updatedAt: '2025-05-10T14:00:00',
  notes: 'Paused due to medical leave',
  history: [
  { id: 'H1', action: 'Created', amount: 3000, date: '2025-02-01', performedBy: 'Admin', notes: 'Vehicle loan' },
  { id: 'H2', action: 'Deducted', amount: 3000, date: '2025-02-28', performedBy: 'System', notes: 'February' },
  { id: 'H3', action: 'Deducted', amount: 3000, date: '2025-03-31', performedBy: 'System', notes: 'March' },
  { id: 'H4', action: 'Deducted', amount: 3000, date: '2025-04-30', performedBy: 'System', notes: 'April' },
  { id: 'H5', action: 'Paused', amount: 0, date: '2025-05-10', performedBy: 'Admin', notes: 'Medical leave' }]

},
{
  id: 7,
  empId: 'EMP007',
  empName: 'Arun Nair',
  department: 'it',
  deductionType: 'advance',
  deductionTypeName: 'Advance Salary Recovery',
  amount: 15000,
  totalAmount: 30000,
  paidAmount: 15000,
  remainingAmount: 15000,
  reason: 'Festival advance',
  appliedMonth: '2025-05',
  startDate: '2025-04-01',
  endDate: '2025-05-31',
  installments: 2,
  currentInstallment: 2,
  recurrence: 'monthly',
  status: 'Active',
  createdBy: 'Admin',
  createdAt: '2025-03-25T10:00:00',
  updatedAt: '2025-04-30T10:00:00',
  notes: 'Diwali advance',
  history: [
  { id: 'H1', action: 'Created', amount: 15000, date: '2025-03-25', performedBy: 'Admin', notes: 'Festival advance' },
  { id: 'H2', action: 'Deducted', amount: 15000, date: '2025-04-30', performedBy: 'System', notes: 'April' }]

},
{
  id: 8,
  empId: 'EMP008',
  empName: 'Kavita Menon',
  department: 'teaching',
  deductionType: 'fine',
  deductionTypeName: 'Fine / Penalty',
  amount: 500,
  totalAmount: 500,
  paidAmount: 500,
  remainingAmount: 0,
  reason: 'Library book damage',
  appliedMonth: '2025-04',
  startDate: '2025-04-01',
  endDate: '2025-04-30',
  installments: 1,
  currentInstallment: 1,
  recurrence: 'one_time',
  status: 'Completed',
  createdBy: 'Librarian',
  createdAt: '2025-04-05T14:00:00',
  updatedAt: '2025-04-30T10:00:00',
  notes: 'Book replacement cost',
  history: [
  { id: 'H1', action: 'Created', amount: 500, date: '2025-04-05', performedBy: 'Librarian', notes: 'Book damage' },
  { id: 'H2', action: 'Deducted', amount: 500, date: '2025-04-30', performedBy: 'System', notes: 'April salary' },
  { id: 'H3', action: 'Completed', amount: 0, date: '2025-04-30', performedBy: 'System', notes: 'Fully recovered' }]

}];


/* -------------------------------------------------------------------------- */
/* Utility Functions                                                           */
/* -------------------------------------------------------------------------- */

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getMonthLabel = (monthValue: string): string => {
  const month = MONTHS.find((m) => m.value === monthValue);
  return month?.label || monthValue;
};

const getCategoryLabel = (category: DeductionCategory): string => {
  const cat = DEDUCTION_CATEGORIES.find((c) => c.value === category);
  return cat?.label || category;
};

/* -------------------------------------------------------------------------- */
/* Notification Component                                                      */
/* -------------------------------------------------------------------------- */

function NotificationToast({
  notifications,
  onDismiss



}: {notifications: Notification[];onDismiss: (id: string) => void;}) {
  if (notifications.length === 0) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2Icon className="h-4 w-4" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangleIcon className="h-4 w-4" />;
      case 'info':
        return <AlertCircleIcon className="h-4 w-4" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {notifications.map((notification) =>
      <div
        key={notification.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${getStyles(notification.type)}`}>

          {getIcon(notification.type)}
          <span className="text-sm">{notification.message}</span>
          <button onClick={() => onDismiss(notification.id)} className="ml-2 hover:opacity-70">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Confirmation Modal Component                                                */
/* -------------------------------------------------------------------------- */

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'









}: {isOpen: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string;confirmText?: string;cancelText?: string;variant?: 'danger' | 'warning' | 'info' | 'success';}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${variantStyles[variant]}`}>

            {confirmText}
          </button>
        </div>
      </div>
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Action Menu Component                                                       */
/* -------------------------------------------------------------------------- */

function ActionMenu({
  entry,
  onView,
  onEdit,
  onViewHistory,
  onPause,
  onResume,
  onCancel,
  onComplete,
  onDelete,
  onDuplicate











}: {entry: DeductionEntry;onView: () => void;onEdit: () => void;onViewHistory: () => void;onPause: () => void;onResume: () => void;onCancel: () => void;onComplete: () => void;onDelete: () => void;onDuplicate: () => void;}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">

        <MoreVerticalIcon className="w-4 h-4" />
      </button>

      {isOpen &&
      <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
            <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

              <EyeIcon className="w-4 h-4" />
              View Details
            </button>
            <button
            onClick={() => {
              onViewHistory();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

              <HistoryIcon className="w-4 h-4" />
              View History
            </button>

            {entry.status === 'Active' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

                  <EditIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
              onClick={() => {
                onPause();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2">

                  <PauseIcon className="w-4 h-4" />
                  Pause Deduction
                </button>
                {entry.remainingAmount > 0 && entry.recurrence === 'one_time' &&
            <button
              onClick={() => {
                onComplete();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">

                    <CheckIcon className="w-4 h-4" />
                    Mark as Completed
                  </button>
            }
              </>
          }

            {entry.status === 'Paused' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onResume();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">

                  <PlayIcon className="w-4 h-4" />
                  Resume Deduction
                </button>
              </>
          }

            {(entry.status === 'Active' || entry.status === 'Paused') &&
          <button
            onClick={() => {
              onCancel();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2">

                <BanIcon className="w-4 h-4" />
                Cancel Deduction
              </button>
          }

            <hr className="my-1" />
            <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

              <CopyIcon className="w-4 h-4" />
              Duplicate
            </button>
            <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">

              <Trash2Icon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      }
    </div>);

}

/* -------------------------------------------------------------------------- */
/* History Timeline Component                                                  */
/* -------------------------------------------------------------------------- */

function HistoryTimeline({ history }: {history: DeductionHistory[];}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <HistoryIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>No history available</p>
      </div>);

  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return <PlusIcon className="w-4 h-4" />;
      case 'deducted':
        return <DollarSignIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2Icon className="w-4 h-4" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4" />;
      case 'resumed':
        return <PlayIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      case 'updated':
        return <EditIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'bg-blue-100 text-blue-600';
      case 'deducted':
        return 'bg-green-100 text-green-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'paused':
        return 'bg-yellow-100 text-yellow-600';
      case 'resumed':
        return 'bg-blue-100 text-blue-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'updated':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      {history.map((item, index) =>
      <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(item.action)}`}>
              {getActionIcon(item.action)}
            </div>
            {index < history.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">{item.action}</p>
              <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
            </div>
            {item.amount > 0 && <p className="text-sm text-slate-600">Amount: {formatCurrency(item.amount)}</p>}
            <p className="text-sm text-slate-500">{item.notes}</p>
            <p className="text-xs text-slate-400 mt-1">By: {item.performedBy}</p>
          </div>
        </div>
      )}
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function ManualDeductionAdjustment() {
  // Data state
  const [deductionData, setDeductionData] = useState<DeductionEntry[]>(generateInitialData);
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingEntry, setEditingEntry] = useState<DeductionEntry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<DeductionEntry | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<{entry: DeductionEntry;action: string;} | null>(null);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState({
    month: '2025-05',
    department: '',
    status: '',
    deductionType: '',
    search: ''
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('appliedMonth');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    employee: '',
    deductionType: '' as DeductionCategory | '',
    amount: '',
    totalAmount: '',
    reason: '',
    appliedMonth: '2025-05',
    recurrence: 'one_time' as RecurrenceType,
    installments: '1',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Show notification helper
  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = generateId();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...deductionData];

    // Filter by month
    if (filters.month) {
      result = result.filter((entry) => entry.appliedMonth === filters.month);
    }

    // Filter by department
    if (filters.department) {
      result = result.filter((entry) => entry.department === filters.department);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter((entry) => entry.status === filters.status);
    }

    // Filter by deduction type
    if (filters.deductionType) {
      result = result.filter((entry) => entry.deductionType === filters.deductionType);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (entry) =>
        entry.empName.toLowerCase().includes(searchLower) ||
        entry.empId.toLowerCase().includes(searchLower) ||
        entry.reason.toLowerCase().includes(searchLower) ||
        entry.deductionTypeName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'empName':
          comparison = a.empName.localeCompare(b.empName);
          break;
        case 'deductionType':
          comparison = a.deductionTypeName.localeCompare(b.deductionTypeName);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'appliedMonth':
          comparison = a.appliedMonth.localeCompare(b.appliedMonth);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [deductionData, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const monthData = deductionData.filter((entry) => entry.appliedMonth === filters.month);
    return {
      totalEntries: monthData.length,
      activeCount: monthData.filter((e) => e.status === 'Active').length,
      pausedCount: monthData.filter((e) => e.status === 'Paused').length,
      completedCount: monthData.filter((e) => e.status === 'Completed').length,
      totalDeductions: monthData.filter((e) => e.status === 'Active').reduce((sum, e) => sum + e.amount, 0),
      totalRecovered: monthData.reduce((sum, e) => sum + e.paidAmount, 0)
    };
  }, [deductionData, filters.month]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.employee) {
      errors.employee = 'Please select an employee';
    }

    if (!formData.deductionType) {
      errors.deductionType = 'Please select a deduction type';
    }

    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
      }
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
    }

    if (!formData.appliedMonth) {
      errors.appliedMonth = 'Please select the effective month';
    }

    if (formData.recurrence !== 'one_time') {
      const installments = parseInt(formData.installments);
      if (!installments || installments < 1) {
        errors.installments = 'Installments must be at least 1';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      employee: '',
      deductionType: '',
      amount: '',
      totalAmount: '',
      reason: '',
      appliedMonth: '2025-05',
      recurrence: 'one_time',
      installments: '1',
      notes: ''
    });
    setFormErrors({});
    setEditingEntry(null);
  }, []);

  // Open modal for adding
  const openAddModal = useCallback(() => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  }, [resetForm]);

  // Open modal for editing
  const openEditModal = useCallback((entry: DeductionEntry) => {
    setEditingEntry(entry);
    setFormData({
      employee: entry.empId,
      deductionType: entry.deductionType,
      amount: entry.amount.toString(),
      totalAmount: entry.totalAmount.toString(),
      reason: entry.reason,
      appliedMonth: entry.appliedMonth,
      recurrence: entry.recurrence,
      installments: entry.installments.toString(),
      notes: entry.notes
    });
    setFormErrors({});
    setModalMode('edit');
    setShowModal(true);
  }, []);

  // Open modal for viewing
  const openViewModal = useCallback((entry: DeductionEntry) => {
    setEditingEntry(entry);
    setModalMode('view');
    setShowModal(true);
  }, []);

  // Open modal for history
  const openHistoryModal = useCallback((entry: DeductionEntry) => {
    setEditingEntry(entry);
    setModalMode('history');
    setShowModal(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  }, [resetForm]);

  // Submit form (add or edit)
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    const employee = EMPLOYEES.find((e) => e.id === formData.employee);
    if (!employee) {
      showNotification('Invalid employee selected', 'error');
      return;
    }

    const amount = parseFloat(formData.amount);
    const installments = parseInt(formData.installments) || 1;
    const totalAmount = formData.recurrence === 'one_time' ? amount : amount * installments;

    if (modalMode === 'add') {
      const newEntry: DeductionEntry = {
        id: Math.max(...deductionData.map((e) => e.id), 0) + 1,
        empId: employee.id,
        empName: employee.name,
        department: employee.department,
        deductionType: formData.deductionType as DeductionCategory,
        deductionTypeName: getCategoryLabel(formData.deductionType as DeductionCategory),
        amount,
        totalAmount,
        paidAmount: 0,
        remainingAmount: totalAmount,
        reason: formData.reason,
        appliedMonth: formData.appliedMonth,
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        installments,
        currentInstallment: 1,
        recurrence: formData.recurrence,
        status: 'Active',
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: formData.notes,
        history: [
        {
          id: generateId(),
          action: 'Created',
          amount,
          date: new Date().toISOString().split('T')[0],
          performedBy: 'Admin',
          notes: `Deduction created: ${formData.reason}`
        }]

      };

      setDeductionData((prev) => [newEntry, ...prev]);
      showNotification(`Deduction added for ${employee.name}`);
    } else if (modalMode === 'edit' && editingEntry) {
      setDeductionData((prev) =>
      prev.map((entry) =>
      entry.id === editingEntry.id ?
      {
        ...entry,
        empId: employee.id,
        empName: employee.name,
        department: employee.department,
        deductionType: formData.deductionType as DeductionCategory,
        deductionTypeName: getCategoryLabel(formData.deductionType as DeductionCategory),
        amount,
        totalAmount,
        remainingAmount: totalAmount - entry.paidAmount,
        reason: formData.reason,
        appliedMonth: formData.appliedMonth,
        installments,
        recurrence: formData.recurrence,
        notes: formData.notes,
        updatedAt: new Date().toISOString(),
        history: [
        ...entry.history,
        {
          id: generateId(),
          action: 'Updated',
          amount,
          date: new Date().toISOString().split('T')[0],
          performedBy: 'Admin',
          notes: 'Deduction details updated'
        }]

      } :
      entry
      )
      );
      showNotification(`Deduction updated for ${employee.name}`);
    }

    closeModal();
  }, [formData, modalMode, editingEntry, deductionData, validateForm, showNotification, closeModal]);

  // Change entry status
  const handleStatusChange = useCallback(
    (entry: DeductionEntry, action: string) => {
      let newStatus: DeductionStatus = entry.status;
      let historyAction = '';
      let historyNotes = '';

      switch (action) {
        case 'pause':
          newStatus = 'Paused';
          historyAction = 'Paused';
          historyNotes = 'Deduction paused by admin';
          break;
        case 'resume':
          newStatus = 'Active';
          historyAction = 'Resumed';
          historyNotes = 'Deduction resumed by admin';
          break;
        case 'cancel':
          newStatus = 'Cancelled';
          historyAction = 'Cancelled';
          historyNotes = 'Deduction cancelled by admin';
          break;
        case 'complete':
          newStatus = 'Completed';
          historyAction = 'Completed';
          historyNotes = 'Deduction marked as completed';
          break;
      }

      setDeductionData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
        ...e.history,
        {
          id: generateId(),
          action: historyAction,
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          performedBy: 'Admin',
          notes: historyNotes
        }]

      } :
      e
      )
      );
      showNotification(`Deduction ${action}d for ${entry.empName}`);
    },
    [showNotification]
  );

  // Delete entry
  const handleDelete = useCallback(
    (entry: DeductionEntry) => {
      setDeductionData((prev) => prev.filter((e) => e.id !== entry.id));
      setSelectedEntries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(entry.id);
        return newSet;
      });
      showNotification(`Deduction deleted for ${entry.empName}`);
      setShowDeleteModal(false);
      setEntryToDelete(null);
    },
    [showNotification]
  );

  // Duplicate entry
  const handleDuplicate = useCallback(
    (entry: DeductionEntry) => {
      const newEntry: DeductionEntry = {
        ...entry,
        id: Math.max(...deductionData.map((e) => e.id), 0) + 1,
        paidAmount: 0,
        remainingAmount: entry.totalAmount,
        currentInstallment: 1,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
        {
          id: generateId(),
          action: 'Created',
          amount: entry.amount,
          date: new Date().toISOString().split('T')[0],
          performedBy: 'Admin',
          notes: `Duplicated from deduction #${entry.id}`
        }]

      };
      setDeductionData((prev) => [newEntry, ...prev]);
      showNotification(`Deduction duplicated for ${entry.empName}`);
    },
    [deductionData, showNotification]
  );

  // Toggle entry selection
  const toggleEntrySelection = useCallback((id: number) => {
    setSelectedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Toggle all entries selection
  const toggleAllSelection = useCallback(() => {
    if (selectedEntries.size === paginatedData.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(paginatedData.map((e) => e.id)));
    }
  }, [paginatedData, selectedEntries.size]);

  // Bulk actions
  const handleBulkAction = useCallback(
    (action: string) => {
      const selectedData = deductionData.filter((e) => selectedEntries.has(e.id));

      switch (action) {
        case 'pause':
          setDeductionData((prev) =>
          prev.map((e) =>
          selectedEntries.has(e.id) && e.status === 'Active' ?
          {
            ...e,
            status: 'Paused' as DeductionStatus,
            updatedAt: new Date().toISOString(),
            history: [
            ...e.history,
            {
              id: generateId(),
              action: 'Paused',
              amount: 0,
              date: new Date().toISOString().split('T')[0],
              performedBy: 'Admin',
              notes: 'Bulk pause action'
            }]

          } :
          e
          )
          );
          showNotification(`${selectedData.filter((e) => e.status === 'Active').length} deductions paused`);
          break;

        case 'resume':
          setDeductionData((prev) =>
          prev.map((e) =>
          selectedEntries.has(e.id) && e.status === 'Paused' ?
          {
            ...e,
            status: 'Active' as DeductionStatus,
            updatedAt: new Date().toISOString(),
            history: [
            ...e.history,
            {
              id: generateId(),
              action: 'Resumed',
              amount: 0,
              date: new Date().toISOString().split('T')[0],
              performedBy: 'Admin',
              notes: 'Bulk resume action'
            }]

          } :
          e
          )
          );
          showNotification(`${selectedData.filter((e) => e.status === 'Paused').length} deductions resumed`);
          break;

        case 'delete':
          setDeductionData((prev) => prev.filter((e) => !selectedEntries.has(e.id)));
          showNotification(`${selectedEntries.size} deductions deleted`);
          break;

        case 'export':
          exportData(selectedData);
          break;
      }

      setSelectedEntries(new Set());
      setShowBulkActionModal(false);
    },
    [deductionData, selectedEntries, showNotification]
  );

  // Export data
  const exportData = useCallback(
    (data: DeductionEntry[] = filteredData) => {
      const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Deduction Type',
      'Amount',
      'Total Amount',
      'Paid Amount',
      'Remaining',
      'Status',
      'Reason',
      'Applied Month'];

      const rows = data.map((entry) => [
      entry.empId,
      entry.empName,
      DEPARTMENTS.find((d) => d.id === entry.department)?.name || entry.department,
      entry.deductionTypeName,
      entry.amount,
      entry.totalAmount,
      entry.paidAmount,
      entry.remainingAmount,
      entry.status,
      entry.reason,
      getMonthLabel(entry.appliedMonth)]
      );

      const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deductions_report_${filters.month}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Report exported successfully');
    },
    [filteredData, filters.month, showNotification]
  );

  // Sort handler
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      month: '2025-05',
      department: '',
      status: '',
      deductionType: '',
      search: ''
    });
    showNotification('Filters reset', 'info');
  }, [showNotification]);

  // Get status badge
  const getStatusBadge = (status: DeductionStatus) => {
    const variants: Record<DeductionStatus, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      Active: 'success',
      Paused: 'warning',
      Cancelled: 'destructive',
      Completed: 'secondary'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Sort indicator
  const SortIndicator = ({ field }: {field: SortField;}) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  // Calculate installment amount when total or installments change
  useEffect(() => {
    if (formData.recurrence !== 'one_time' && formData.totalAmount && formData.installments) {
      const total = parseFloat(formData.totalAmount);
      const inst = parseInt(formData.installments);
      if (total > 0 && inst > 0) {
        setFormData((prev) => ({ ...prev, amount: (total / inst).toFixed(2) }));
      }
    }
  }, [formData.totalAmount, formData.installments, formData.recurrence]);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Manual Deduction / Adjustment</h1>
              <p className="text-sm text-slate-500 mt-1">Manage loan recoveries, fines, and other salary deductions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={() => exportData()}>
                Export
              </Button>
              <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={openAddModal}>
                Add Deduction
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Entries</p>
              <p className="text-2xl font-semibold mt-1">{summaryStats.totalEntries}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 uppercase tracking-wide">Active</p>
              <p className="text-2xl font-semibold text-green-700 mt-1">{summaryStats.activeCount}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-yellow-600 uppercase tracking-wide">Paused</p>
              <p className="text-2xl font-semibold text-yellow-700 mt-1">{summaryStats.pausedCount}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-semibold mt-1">{summaryStats.completedCount}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-red-600 uppercase tracking-wide">Total Deductions</p>
              <p className="text-2xl font-semibold text-red-700 mt-1">{formatCurrency(summaryStats.totalDeductions)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Recovered</p>
              <p className="text-2xl font-semibold text-blue-700 mt-1">{formatCurrency(summaryStats.totalRecovered)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1 flex-wrap">
              <Select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                options={MONTHS}
                className="w-40" />

              <Select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }))]}
                className="w-48" />

              <Select
                value={filters.deductionType}
                onChange={(e) => setFilters({ ...filters, deductionType: e.target.value })}
                options={[{ value: '', label: 'All Types' }, ...DEDUCTION_CATEGORIES]}
                className="w-48" />

              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Paused', label: 'Paused' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' }]
                }
                className="w-36" />

              <Input
                placeholder="Search employee..."
                leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="md:w-64" />

            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RefreshCwIcon className="w-4 h-4" />}>
              Reset
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedEntries.size > 0 &&
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-indigo-700">
              <strong>{selectedEntries.size}</strong> deductions selected
            </span>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('pause');
                setShowBulkActionModal(true);
              }}>

                <PauseIcon className="w-4 h-4 mr-1" />
                Pause All
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('resume');
                setShowBulkActionModal(true);
              }}>

                <PlayIcon className="w-4 h-4 mr-1" />
                Resume All
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('export')}>

                <DownloadIcon className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('delete');
                setShowBulkActionModal(true);
              }}
              className="text-red-600 hover:text-red-700">

                <Trash2Icon className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEntries(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        }

        {/* Deduction Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedEntries.size === paginatedData.length && paginatedData.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded border-slate-300" />

                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('empName')}>

                    Employee
                    <SortIndicator field="empName" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('deductionType')}>

                    Deduction Type
                    <SortIndicator field="deductionType" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('amount')}>

                    Amount/Month
                    <SortIndicator field="amount" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                    Progress
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('status')}>

                    Status
                    <SortIndicator field="status" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedData.length === 0 ?
                <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <FileTextIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="font-medium">No deductions found</p>
                        <p className="text-sm">Try adjusting your filters or add a new deduction</p>
                      </div>
                    </td>
                  </tr> :

                paginatedData.map((row) =>
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${selectedEntries.has(row.id) ? 'bg-indigo-50' : ''}`}>

                      <td className="py-3 px-4">
                        <input
                      type="checkbox"
                      checked={selectedEntries.has(row.id)}
                      onChange={() => toggleEntrySelection(row.id)}
                      className="rounded border-slate-300" />

                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{row.empName}</p>
                          <p className="text-xs text-slate-500">{row.empId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-slate-600">{row.deductionTypeName}</p>
                          {row.recurrence !== 'one_time' &&
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                              <RepeatIcon className="w-3 h-3" />
                              {row.recurrence} ({row.currentInstallment}/{row.installments})
                            </p>
                      }
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">{formatCurrency(row.amount)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-xs">
                          <p className="text-slate-600">
                            {formatCurrency(row.paidAmount)} / {formatCurrency(row.totalAmount)}
                          </p>
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 ml-auto">
                            <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(row.paidAmount / row.totalAmount * 100, 100)}%` }} />

                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <p className="truncate" title={row.reason}>
                          {row.reason}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(row.status)}</td>
                      <td className="py-3 px-4 text-center">
                        <ActionMenu
                      entry={row}
                      onView={() => openViewModal(row)}
                      onEdit={() => openEditModal(row)}
                      onViewHistory={() => openHistoryModal(row)}
                      onPause={() => {
                        setStatusAction({ entry: row, action: 'pause' });
                        setShowStatusModal(true);
                      }}
                      onResume={() => {
                        setStatusAction({ entry: row, action: 'resume' });
                        setShowStatusModal(true);
                      }}
                      onCancel={() => {
                        setStatusAction({ entry: row, action: 'cancel' });
                        setShowStatusModal(true);
                      }}
                      onComplete={() => {
                        setStatusAction({ entry: row, action: 'complete' });
                        setShowStatusModal(true);
                      }}
                      onDelete={() => {
                        setEntryToDelete(row);
                        setShowDeleteModal(true);
                      }}
                      onDuplicate={() => handleDuplicate(row)} />

                      </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 &&
          <div className="px-4 py-3 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-slate-300 rounded px-2 py-1 text-sm">

                  {ITEMS_PER_PAGE_OPTIONS.map((option) =>
                <option key={option} value={option}>
                      {option}
                    </option>
                )}
                </select>
                <span>entries</span>
              </div>

              <div className="text-sm text-slate-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                {filteredData.length} entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}>

                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}>

                      {pageNum}
                    </Button>);

              })}
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}>

                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          }
        </div>

        {/* Add/Edit/View Modal */}
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={
          modalMode === 'add' ?
          'Add Manual Deduction' :
          modalMode === 'edit' ?
          'Edit Deduction' :
          modalMode === 'history' ?
          'Deduction History' :
          'Deduction Details'
          }
          size={modalMode === 'history' ? 'lg' : 'md'}>

          {modalMode === 'history' && editingEntry ?
          <div>
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{editingEntry.empName}</p>
                    <p className="text-sm text-slate-500">{editingEntry.deductionTypeName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{formatCurrency(editingEntry.amount)}/month</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(editingEntry.paidAmount)} of {formatCurrency(editingEntry.totalAmount)} recovered
                    </p>
                  </div>
                </div>
              </div>
              <HistoryTimeline history={editingEntry.history} />
            </div> :
          modalMode === 'view' && editingEntry ?
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Employee</p>
                  <p className="font-medium">{editingEntry.empName}</p>
                  <p className="text-xs text-slate-400">{editingEntry.empId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Deduction Type</p>
                  <p className="font-medium">{editingEntry.deductionTypeName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Monthly Amount</p>
                  <p className="font-medium text-red-600">{formatCurrency(editingEntry.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Amount</p>
                  <p className="font-medium">{formatCurrency(editingEntry.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Paid Amount</p>
                  <p className="font-medium text-green-600">{formatCurrency(editingEntry.paidAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Remaining</p>
                  <p className="font-medium">{formatCurrency(editingEntry.remainingAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Recurrence</p>
                  <p className="font-medium capitalize">{editingEntry.recurrence.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Installments</p>
                  <p className="font-medium">
                    {editingEntry.currentInstallment} of {editingEntry.installments}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
                  {getStatusBadge(editingEntry.status)}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Applied Month</p>
                  <p className="font-medium">{getMonthLabel(editingEntry.appliedMonth)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Reason</p>
                <p className="text-sm">{editingEntry.reason}</p>
              </div>
              {editingEntry.notes &&
            <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-slate-600">{editingEntry.notes}</p>
                </div>
            }
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-slate-500">Created By</p>
                  <p className="text-sm">{editingEntry.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created At</p>
                  <p className="text-sm">{formatDate(editingEntry.createdAt)}</p>
                </div>
              </div>
            </div> :

          <div className="space-y-4">
              <div>
                <Select
                label="Employee"
                placeholder="Select Employee"
                value={formData.employee}
                onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                options={EMPLOYEES.map((emp) => ({
                  value: emp.id,
                  label: `${emp.name} (${emp.employeeCode})`
                }))}
                disabled={modalMode === 'view'} />

                {formErrors.employee && <p className="text-xs text-red-500 mt-1">{formErrors.employee}</p>}
              </div>

              <div>
                <Select
                label="Deduction Category"
                placeholder="Select Category"
                value={formData.deductionType}
                onChange={(e) => setFormData({ ...formData, deductionType: e.target.value as DeductionCategory })}
                options={DEDUCTION_CATEGORIES}
                disabled={modalMode === 'view'} />

                {formErrors.deductionType && <p className="text-xs text-red-500 mt-1">{formErrors.deductionType}</p>}
              </div>

              <div>
                <Select
                label="Recurrence"
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as RecurrenceType })}
                options={RECURRENCE_TYPES}
                disabled={modalMode === 'view'} />

              </div>

              {formData.recurrence !== 'one_time' &&
            <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                  label="Total Amount"
                  type="number"
                  placeholder="Total amount"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  disabled={modalMode === 'view'} />

                  </div>
                  <div>
                    <Input
                  label="Installments"
                  type="number"
                  placeholder="Number of installments"
                  value={formData.installments}
                  onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                  min="1"
                  disabled={modalMode === 'view'} />

                    {formErrors.installments && <p className="text-xs text-red-500 mt-1">{formErrors.installments}</p>}
                  </div>
                </div>
            }

              <div>
                <Input
                label={formData.recurrence === 'one_time' ? 'Amount' : 'Amount per Installment'}
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={modalMode === 'view' || formData.recurrence !== 'one_time'} />

                {formErrors.amount && <p className="text-xs text-red-500 mt-1">{formErrors.amount}</p>}
              </div>

              <div>
                <Textarea
                label="Reason"
                placeholder="Enter reason for deduction"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                disabled={modalMode === 'view'} />

                {formErrors.reason && <p className="text-xs text-red-500 mt-1">{formErrors.reason}</p>}
              </div>

              <div>
                <Select
                label="Effective Month"
                value={formData.appliedMonth}
                onChange={(e) => setFormData({ ...formData, appliedMonth: e.target.value })}
                options={MONTHS}
                disabled={modalMode === 'view'} />

                {formErrors.appliedMonth && <p className="text-xs text-red-500 mt-1">{formErrors.appliedMonth}</p>}
              </div>

              <div>
                <Textarea
                label="Notes (Optional)"
                placeholder="Additional notes"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={modalMode === 'view'} />

              </div>

              {formData.amount && parseFloat(formData.amount) > 0 &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-xs text-red-600 uppercase tracking-wide mb-1">Deduction Summary</div>
                  <div className="text-2xl font-bold text-red-700">
                    {formatCurrency(parseFloat(formData.amount))}
                    {formData.recurrence !== 'one_time' && <span className="text-sm font-normal">/month</span>}
                  </div>
                  {formData.recurrence !== 'one_time' && formData.installments &&
              <p className="text-sm text-red-600 mt-1">
                      Total: {formatCurrency(parseFloat(formData.amount) * parseInt(formData.installments))} over{' '}
                      {formData.installments} installments
                    </p>
              }
                </div>
            }
            </div>
          }

          {modalMode !== 'history' && modalMode !== 'view' &&
          <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                <SaveIcon className="w-4 h-4 mr-1" />
                {modalMode === 'add' ? 'Save Deduction' : 'Update Deduction'}
              </Button>
            </div>
          }

          {modalMode === 'view' && editingEntry &&
          <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button variant="outline" onClick={() => openHistoryModal(editingEntry)}>
                <HistoryIcon className="w-4 h-4 mr-1" />
                View History
              </Button>
              {editingEntry.status === 'Active' &&
            <Button
              variant="primary"
              onClick={() => {
                closeModal();
                setTimeout(() => openEditModal(editingEntry), 100);
              }}>

                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
            }
            </div>
          }

          {modalMode === 'history' &&
          <div className="flex items-center justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            </div>
          }
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setEntryToDelete(null);
          }}
          onConfirm={() => {
            if (entryToDelete) {
              handleDelete(entryToDelete);
            }
          }}
          title="Delete Deduction"
          message={`Are you sure you want to delete the deduction for ${entryToDelete?.empName}? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger" />


        {/* Status Change Confirmation Modal */}
        <ConfirmationModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setStatusAction(null);
          }}
          onConfirm={() => {
            if (statusAction) {
              handleStatusChange(statusAction.entry, statusAction.action);
            }
            setShowStatusModal(false);
            setStatusAction(null);
          }}
          title={`${statusAction?.action.charAt(0).toUpperCase()}${statusAction?.action.slice(1)} Deduction`}
          message={`Are you sure you want to ${statusAction?.action} the deduction for ${statusAction?.entry.empName}?`}
          confirmText={statusAction?.action.charAt(0).toUpperCase() + (statusAction?.action.slice(1) || '')}
          variant={statusAction?.action === 'cancel' ? 'danger' : statusAction?.action === 'pause' ? 'warning' : 'success'} />


        {/* Bulk Action Confirmation Modal */}
        <ConfirmationModal
          isOpen={showBulkActionModal}
          onClose={() => {
            setShowBulkActionModal(false);
            setBulkActionType(null);
          }}
          onConfirm={() => {
            if (bulkActionType) {
              handleBulkAction(bulkActionType);
            }
          }}
          title={
          bulkActionType === 'pause' ?
          'Pause Selected Deductions' :
          bulkActionType === 'resume' ?
          'Resume Selected Deductions' :
          'Delete Selected Deductions'
          }
          message={`Are you sure you want to ${bulkActionType} ${selectedEntries.size} selected deductions?${bulkActionType === 'delete' ? ' This action cannot be undone.' : ''}`}
          confirmText={bulkActionType ? bulkActionType.charAt(0).toUpperCase() + bulkActionType.slice(1) + ' All' : 'Confirm'}
          variant={bulkActionType === 'delete' ? 'danger' : bulkActionType === 'pause' ? 'warning' : 'success'} />

      </div>

      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}