import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  DownloadIcon,
  PrinterIcon,
  FileTextIcon,
  BuildingIcon,
  CheckCircleIcon,
  SearchIcon,
  XIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EyeIcon,
  MoreVerticalIcon,
  SendIcon,
  ClockIcon,
  DollarSignIcon,
  CopyIcon,
  UploadIcon,
  FilterIcon,
  ArrowUpDownIcon,
  BanknoteIcon,
  CreditCardIcon,
  WalletIcon,
  FileSpreadsheetIcon,
  MailIcon,
  AlertTriangleIcon,
  RotateCcwIcon,
  CheckIcon,
  Loader2Icon,
  CalendarIcon,
  UserIcon,
  HashIcon,
  BadgeCheckIcon,
  ExternalLinkIcon,
  HistoryIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Processing' | 'Cancelled' | 'On Hold';

type PaymentMode = 'bank-transfer' | 'cash' | 'cheque' | 'upi';

type DisbursementEntry = {
  id: number;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  bankName: string;
  accountNumber: string;
  accountNumberFull: string;
  ifsc: string;
  branchName: string;
  accountType: string;
  netSalary: number;
  grossSalary: number;
  totalDeductions: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  utrNumber: string;
  transactionDate: string | null;
  payrollMonth: string;
  remarks: string;
  retryCount: number;
  lastRetryAt: string | null;
  createdAt: string;
  updatedAt: string;
  paymentHistory: PaymentHistoryEntry[];
};

type PaymentHistoryEntry = {
  id: string;
  action: string;
  status: PaymentStatus;
  amount: number;
  utrNumber: string | null;
  timestamp: string;
  performedBy: string;
  remarks: string;
};

type BankSummary = {
  bankName: string;
  bankCode: string;
  employeeCount: number;
  totalAmount: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
};

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type ModalType = 'none' | 'view' | 'history' | 'process' | 'retry' | 'bulkProcess' | 'preview' | 'uploadUTR' | 'cancelPayment';

type SortField = 'empName' | 'bankName' | 'netSalary' | 'paymentStatus';
type SortDirection = 'asc' | 'desc';

type ExportFormat = 'csv' | 'excel' | 'pdf' | 'bank-file';

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const MONTHS = [
{ value: '2025-05', label: 'May 2025' },
{ value: '2025-04', label: 'April 2025' },
{ value: '2025-03', label: 'March 2025' },
{ value: '2025-02', label: 'February 2025' },
{ value: '2025-01', label: 'January 2025' }];


const BANKS = [
{ value: 'hdfc', label: 'HDFC Bank', code: 'HDFC' },
{ value: 'sbi', label: 'State Bank of India', code: 'SBI' },
{ value: 'icici', label: 'ICICI Bank', code: 'ICICI' },
{ value: 'axis', label: 'Axis Bank', code: 'AXIS' },
{ value: 'kotak', label: 'Kotak Mahindra Bank', code: 'KOTAK' },
{ value: 'pnb', label: 'Punjab National Bank', code: 'PNB' },
{ value: 'bob', label: 'Bank of Baroda', code: 'BOB' },
{ value: 'cash', label: 'Cash Payment', code: 'CASH' }];


const PAYMENT_MODES = [
{ value: 'bank-transfer', label: 'Bank Transfer', icon: BanknoteIcon },
{ value: 'cash', label: 'Cash', icon: WalletIcon },
{ value: 'cheque', label: 'Cheque', icon: CreditCardIcon },
{ value: 'upi', label: 'UPI', icon: DollarSignIcon }];


const DEPARTMENTS = [
{ id: 'teaching', name: 'Teaching' },
{ id: 'admin', name: 'Administration' },
{ id: 'it', name: 'IT Department' },
{ id: 'accounts', name: 'Accounts' },
{ id: 'support', name: 'Support Staff' }];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* -------------------------------------------------------------------------- */
/* Initial Data                                                                */
/* -------------------------------------------------------------------------- */

const generateInitialData = (): DisbursementEntry[] => [
{
  id: 1,
  empId: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'teaching',
  designation: 'Senior Teacher',
  bankName: 'HDFC Bank',
  accountNumber: '****5678',
  accountNumberFull: '50100123455678',
  ifsc: 'HDFC0001234',
  branchName: 'MG Road Branch',
  accountType: 'Savings',
  netSalary: 33900,
  grossSalary: 45000,
  totalDeductions: 11100,
  paymentStatus: 'Success',
  paymentMode: 'bank-transfer',
  utrNumber: 'UTR202505001234',
  transactionDate: '2025-05-01T10:30:00',
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T10:30:00',
  paymentHistory: [
  { id: 'H1', action: 'Initiated', status: 'Processing', amount: 33900, utrNumber: null, timestamp: '2025-05-01T09:00:00', performedBy: 'System', remarks: 'Payment initiated' },
  { id: 'H2', action: 'Completed', status: 'Success', amount: 33900, utrNumber: 'UTR202505001234', timestamp: '2025-05-01T10:30:00', performedBy: 'Bank', remarks: 'Payment successful' }]

},
{
  id: 2,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  department: 'admin',
  designation: 'Office Manager',
  bankName: 'SBI',
  accountNumber: '****9012',
  accountNumberFull: '38920123459012',
  ifsc: 'SBIN0005678',
  branchName: 'Main Branch',
  accountType: 'Savings',
  netSalary: 27320,
  grossSalary: 35000,
  totalDeductions: 7680,
  paymentStatus: 'Pending',
  paymentMode: 'bank-transfer',
  utrNumber: '-',
  transactionDate: null,
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T09:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Created', status: 'Pending', amount: 27320, utrNumber: null, timestamp: '2025-05-01T09:00:00', performedBy: 'System', remarks: 'Payment entry created' }]

},
{
  id: 3,
  empId: 'EMP003',
  empName: 'Amit Patel',
  department: 'it',
  designation: 'IT Manager',
  bankName: 'ICICI Bank',
  accountNumber: '****3456',
  accountNumberFull: '628012343456',
  ifsc: 'ICIC0002345',
  branchName: 'Tech Park Branch',
  accountType: 'Savings',
  netSalary: 40780,
  grossSalary: 55000,
  totalDeductions: 14220,
  paymentStatus: 'Success',
  paymentMode: 'bank-transfer',
  utrNumber: 'UTR202505001236',
  transactionDate: '2025-05-01T11:00:00',
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T11:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Initiated', status: 'Processing', amount: 40780, utrNumber: null, timestamp: '2025-05-01T09:15:00', performedBy: 'System', remarks: 'Payment initiated' },
  { id: 'H2', action: 'Completed', status: 'Success', amount: 40780, utrNumber: 'UTR202505001236', timestamp: '2025-05-01T11:00:00', performedBy: 'Bank', remarks: 'Payment successful' }]

},
{
  id: 4,
  empId: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'teaching',
  designation: 'Teacher',
  bankName: 'Axis Bank',
  accountNumber: '****7890',
  accountNumberFull: '917020123457890',
  ifsc: 'UTIB0003456',
  branchName: 'City Branch',
  accountType: 'Savings',
  netSalary: 29980,
  grossSalary: 38000,
  totalDeductions: 8020,
  paymentStatus: 'Failed',
  paymentMode: 'bank-transfer',
  utrNumber: '-',
  transactionDate: null,
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 1,
  lastRetryAt: '2025-05-01T14:00:00',
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T14:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Initiated', status: 'Processing', amount: 29980, utrNumber: null, timestamp: '2025-05-01T10:00:00', performedBy: 'System', remarks: 'Payment initiated' },
  { id: 'H2', action: 'Failed', status: 'Failed', amount: 29980, utrNumber: null, timestamp: '2025-05-01T12:00:00', performedBy: 'Bank', remarks: 'Invalid account number' },
  { id: 'H3', action: 'Retry', status: 'Processing', amount: 29980, utrNumber: null, timestamp: '2025-05-01T14:00:00', performedBy: 'Admin', remarks: 'Retry initiated' },
  { id: 'H4', action: 'Failed', status: 'Failed', amount: 29980, utrNumber: null, timestamp: '2025-05-01T14:30:00', performedBy: 'Bank', remarks: 'Account validation failed' }]

},
{
  id: 5,
  empId: 'EMP005',
  empName: 'Vikram Singh',
  department: 'support',
  designation: 'Peon',
  bankName: 'Cash',
  accountNumber: '-',
  accountNumberFull: '-',
  ifsc: '-',
  branchName: '-',
  accountType: '-',
  netSalary: 20840,
  grossSalary: 25000,
  totalDeductions: 4160,
  paymentStatus: 'Success',
  paymentMode: 'cash',
  utrNumber: 'CASH-202505-001',
  transactionDate: '2025-05-02T15:00:00',
  payrollMonth: '2025-05',
  remarks: 'Cash payment',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-02T15:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Created', status: 'Pending', amount: 20840, utrNumber: null, timestamp: '2025-05-01T09:00:00', performedBy: 'System', remarks: 'Cash payment entry created' },
  { id: 'H2', action: 'Completed', status: 'Success', amount: 20840, utrNumber: 'CASH-202505-001', timestamp: '2025-05-02T15:00:00', performedBy: 'Accountant', remarks: 'Cash paid and acknowledged' }]

},
{
  id: 6,
  empId: 'EMP006',
  empName: 'Meera Joshi',
  department: 'teaching',
  designation: 'HOD Science',
  bankName: 'HDFC Bank',
  accountNumber: '****2345',
  accountNumberFull: '50100678902345',
  ifsc: 'HDFC0001234',
  branchName: 'MG Road Branch',
  accountType: 'Savings',
  netSalary: 48500,
  grossSalary: 65000,
  totalDeductions: 16500,
  paymentStatus: 'Processing',
  paymentMode: 'bank-transfer',
  utrNumber: '-',
  transactionDate: null,
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T16:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Initiated', status: 'Processing', amount: 48500, utrNumber: null, timestamp: '2025-05-01T16:00:00', performedBy: 'System', remarks: 'Payment initiated' }]

},
{
  id: 7,
  empId: 'EMP007',
  empName: 'Arun Nair',
  department: 'it',
  designation: 'System Admin',
  bankName: 'SBI',
  accountNumber: '****6789',
  accountNumberFull: '38920567896789',
  ifsc: 'SBIN0005678',
  branchName: 'Main Branch',
  accountType: 'Savings',
  netSalary: 35200,
  grossSalary: 45000,
  totalDeductions: 9800,
  paymentStatus: 'Pending',
  paymentMode: 'bank-transfer',
  utrNumber: '-',
  transactionDate: null,
  payrollMonth: '2025-05',
  remarks: 'Salary for May 2025',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-01T09:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Created', status: 'Pending', amount: 35200, utrNumber: null, timestamp: '2025-05-01T09:00:00', performedBy: 'System', remarks: 'Payment entry created' }]

},
{
  id: 8,
  empId: 'EMP008',
  empName: 'Kavita Menon',
  department: 'accounts',
  designation: 'Accountant',
  bankName: 'Kotak Mahindra Bank',
  accountNumber: '****1234',
  accountNumberFull: '1234567891234',
  ifsc: 'KKBK0001234',
  branchName: 'Commercial Branch',
  accountType: 'Savings',
  netSalary: 31500,
  grossSalary: 40000,
  totalDeductions: 8500,
  paymentStatus: 'On Hold',
  paymentMode: 'bank-transfer',
  utrNumber: '-',
  transactionDate: null,
  payrollMonth: '2025-05',
  remarks: 'On hold - pending document verification',
  retryCount: 0,
  lastRetryAt: null,
  createdAt: '2025-05-01T09:00:00',
  updatedAt: '2025-05-03T10:00:00',
  paymentHistory: [
  { id: 'H1', action: 'Created', status: 'Pending', amount: 31500, utrNumber: null, timestamp: '2025-05-01T09:00:00', performedBy: 'System', remarks: 'Payment entry created' },
  { id: 'H2', action: 'On Hold', status: 'On Hold', amount: 31500, utrNumber: null, timestamp: '2025-05-03T10:00:00', performedBy: 'HR Manager', remarks: 'Pending document verification' }]

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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getMonthLabel = (monthValue: string): string => {
  const month = MONTHS.find((m) => m.value === monthValue);
  return month?.label || monthValue;
};

const generateUTR = (): string => {
  const date = new Date();
  const random = Math.random().toString(36).substr(2, 8).toUpperCase();
  return `UTR${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${random}`;
};

const generateCashReceiptNumber = (): string => {
  const date = new Date();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CASH-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${random}`;
};

const generateChequeNumber = (): string => {
  return `CHQ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
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
  variant = 'info',
  isLoading = false










}: {isOpen: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string | React.ReactNode;confirmText?: string;cancelText?: string;variant?: 'danger' | 'warning' | 'info' | 'success';isLoading?: boolean;}) {
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
        <div className="text-sm text-slate-600 mb-6">{message}</div>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 ${variantStyles[variant]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>

            {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
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
  onViewHistory,
  onProcess,
  onRetry,
  onUploadUTR,
  onCancel,
  onPutOnHold,
  onRelease,
  onSendEmail,
  onPrintSlip












}: {entry: DisbursementEntry;onView: () => void;onViewHistory: () => void;onProcess: () => void;onRetry: () => void;onUploadUTR: () => void;onCancel: () => void;onPutOnHold: () => void;onRelease: () => void;onSendEmail: () => void;onPrintSlip: () => void;}) {
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
              Payment History
            </button>

            {entry.paymentStatus === 'Pending' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onProcess();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">

                  <SendIcon className="w-4 h-4" />
                  Process Payment
                </button>
                <button
              onClick={() => {
                onPutOnHold();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2">

                  <ClockIcon className="w-4 h-4" />
                  Put On Hold
                </button>
              </>
          }

            {entry.paymentStatus === 'Failed' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onRetry();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2">

                  <RotateCcwIcon className="w-4 h-4" />
                  Retry Payment
                </button>
                <button
              onClick={() => {
                onUploadUTR();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

                  <UploadIcon className="w-4 h-4" />
                  Upload UTR Manually
                </button>
              </>
          }

            {entry.paymentStatus === 'On Hold' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onRelease();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">

                  <CheckIcon className="w-4 h-4" />
                  Release Hold
                </button>
              </>
          }

            {entry.paymentStatus === 'Success' &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onSendEmail();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

                  <MailIcon className="w-4 h-4" />
                  Send Pay Slip
                </button>
                <button
              onClick={() => {
                onPrintSlip();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

                  <PrinterIcon className="w-4 h-4" />
                  Print Pay Slip
                </button>
              </>
          }

            {(entry.paymentStatus === 'Pending' || entry.paymentStatus === 'On Hold') &&
          <>
                <hr className="my-1" />
                <button
              onClick={() => {
                onCancel();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">

                  <XCircleIcon className="w-4 h-4" />
                  Cancel Payment
                </button>
              </>
          }
          </div>
        </>
      }
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Payment History Timeline Component                                          */
/* -------------------------------------------------------------------------- */

function PaymentHistoryTimeline({ history }: {history: PaymentHistoryEntry[];}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <HistoryIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>No payment history available</p>
      </div>);

  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-600';
      case 'Processing':
        return 'bg-blue-100 text-blue-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'Failed':
        return 'bg-red-100 text-red-600';
      case 'On Hold':
        return 'bg-orange-100 text-orange-600';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'initiated':
        return <SendIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2Icon className="w-4 h-4" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4" />;
      case 'retry':
        return <RotateCcwIcon className="w-4 h-4" />;
      case 'on hold':
        return <ClockIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XIcon className="w-4 h-4" />;
      default:
        return <AlertCircleIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {history.map((item, index) =>
      <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
              {getActionIcon(item.action)}
            </div>
            {index < history.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-1" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">{item.action}</p>
              <p className="text-xs text-slate-500">{formatDateTime(item.timestamp)}</p>
            </div>
            {item.amount > 0 && <p className="text-sm text-slate-600">Amount: {formatCurrency(item.amount)}</p>}
            {item.utrNumber && <p className="text-sm text-slate-600">UTR: {item.utrNumber}</p>}
            <p className="text-sm text-slate-500">{item.remarks}</p>
            <p className="text-xs text-slate-400 mt-1">By: {item.performedBy}</p>
          </div>
        </div>
      )}
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function SalaryDisbursementBankAdvice() {
  // Data state
  const [disbursementData, setDisbursementData] = useState<DisbursementEntry[]>(generateInitialData);
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());

  // UI state
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedEntry, setSelectedEntry] = useState<DisbursementEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState({
    month: '2025-05',
    bank: '',
    paymentMode: '',
    status: '',
    department: '',
    search: ''
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('empName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UTR upload form
  const [utrForm, setUtrForm] = useState({
    utrNumber: '',
    transactionDate: '',
    remarks: ''
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

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
    let result = [...disbursementData];

    // Filter by month
    if (filters.month) {
      result = result.filter((entry) => entry.payrollMonth === filters.month);
    }

    // Filter by bank
    if (filters.bank) {
      result = result.filter((entry) => entry.bankName.toLowerCase().includes(filters.bank.toLowerCase()));
    }

    // Filter by payment mode
    if (filters.paymentMode) {
      result = result.filter((entry) => entry.paymentMode === filters.paymentMode);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter((entry) => entry.paymentStatus === filters.status);
    }

    // Filter by department
    if (filters.department) {
      result = result.filter((entry) => entry.department === filters.department);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (entry) =>
        entry.empName.toLowerCase().includes(searchLower) ||
        entry.empId.toLowerCase().includes(searchLower) ||
        entry.accountNumber.includes(searchLower) ||
        entry.utrNumber.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'empName':
          comparison = a.empName.localeCompare(b.empName);
          break;
        case 'bankName':
          comparison = a.bankName.localeCompare(b.bankName);
          break;
        case 'netSalary':
          comparison = a.netSalary - b.netSalary;
          break;
        case 'paymentStatus':
          comparison = a.paymentStatus.localeCompare(b.paymentStatus);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [disbursementData, filters, sortField, sortDirection]);

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
    const monthData = disbursementData.filter((entry) => entry.payrollMonth === filters.month);
    return {
      totalEmployees: monthData.length,
      totalPayable: monthData.reduce((sum, e) => sum + e.netSalary, 0),
      totalTransferred: monthData.filter((e) => e.paymentStatus === 'Success').reduce((sum, e) => sum + e.netSalary, 0),
      pendingAmount: monthData.filter((e) => e.paymentStatus === 'Pending' || e.paymentStatus === 'On Hold').reduce((sum, e) => sum + e.netSalary, 0),
      failedAmount: monthData.filter((e) => e.paymentStatus === 'Failed').reduce((sum, e) => sum + e.netSalary, 0),
      successCount: monthData.filter((e) => e.paymentStatus === 'Success').length,
      pendingCount: monthData.filter((e) => e.paymentStatus === 'Pending').length,
      processingCount: monthData.filter((e) => e.paymentStatus === 'Processing').length,
      failedCount: monthData.filter((e) => e.paymentStatus === 'Failed').length,
      onHoldCount: monthData.filter((e) => e.paymentStatus === 'On Hold').length
    };
  }, [disbursementData, filters.month]);

  // Bank-wise summary
  const bankSummary = useMemo(() => {
    const monthData = disbursementData.filter((entry) => entry.payrollMonth === filters.month);
    const bankMap = new Map<string, BankSummary>();

    monthData.forEach((entry) => {
      const existing = bankMap.get(entry.bankName) || {
        bankName: entry.bankName,
        bankCode: entry.bankName.split(' ')[0].toUpperCase(),
        employeeCount: 0,
        totalAmount: 0,
        successCount: 0,
        pendingCount: 0,
        failedCount: 0
      };

      existing.employeeCount++;
      existing.totalAmount += entry.netSalary;
      if (entry.paymentStatus === 'Success') existing.successCount++;
      if (entry.paymentStatus === 'Pending' || entry.paymentStatus === 'Processing') existing.pendingCount++;
      if (entry.paymentStatus === 'Failed') existing.failedCount++;

      bankMap.set(entry.bankName, existing);
    });

    return Array.from(bankMap.values());
  }, [disbursementData, filters.month]);

  // Process single payment
  const processPayment = useCallback(
    (entry: DisbursementEntry) => {
      setIsProcessing(true);

      // Simulate payment processing
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        const utr = success ? generateUTR() : '-';
        const newStatus: PaymentStatus = success ? 'Success' : 'Failed';

        setDisbursementData((prev) =>
        prev.map((e) =>
        e.id === entry.id ?
        {
          ...e,
          paymentStatus: newStatus,
          utrNumber: utr,
          transactionDate: success ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
          paymentHistory: [
          ...e.paymentHistory,
          {
            id: generateId(),
            action: success ? 'Completed' : 'Failed',
            status: newStatus,
            amount: e.netSalary,
            utrNumber: utr,
            timestamp: new Date().toISOString(),
            performedBy: 'System',
            remarks: success ? 'Payment processed successfully' : 'Payment failed - Bank rejected'
          }]

        } :
        e
        )
        );

        setIsProcessing(false);
        setModalType('none');
        showNotification(
          success ?
          `Payment of ${formatCurrency(entry.netSalary)} to ${entry.empName} processed successfully` :
          `Payment to ${entry.empName} failed. Please retry.`,
          success ? 'success' : 'error'
        );
      }, 2000);
    },
    [showNotification]
  );

  // Retry failed payment
  const retryPayment = useCallback(
    (entry: DisbursementEntry) => {
      setDisbursementData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        paymentStatus: 'Processing' as PaymentStatus,
        retryCount: e.retryCount + 1,
        lastRetryAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentHistory: [
        ...e.paymentHistory,
        {
          id: generateId(),
          action: 'Retry',
          status: 'Processing',
          amount: e.netSalary,
          utrNumber: null,
          timestamp: new Date().toISOString(),
          performedBy: 'Admin',
          remarks: `Retry attempt #${e.retryCount + 1}`
        }]

      } :
      e
      )
      );

      // Simulate retry processing
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success on retry
        const utr = success ? generateUTR() : '-';
        const newStatus: PaymentStatus = success ? 'Success' : 'Failed';

        setDisbursementData((prev) =>
        prev.map((e) =>
        e.id === entry.id ?
        {
          ...e,
          paymentStatus: newStatus,
          utrNumber: utr,
          transactionDate: success ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
          paymentHistory: [
          ...e.paymentHistory,
          {
            id: generateId(),
            action: success ? 'Completed' : 'Failed',
            status: newStatus,
            amount: e.netSalary,
            utrNumber: utr,
            timestamp: new Date().toISOString(),
            performedBy: 'System',
            remarks: success ? 'Retry successful' : 'Retry failed'
          }]

        } :
        e
        )
        );

        showNotification(
          success ?
          `Retry successful for ${entry.empName}` :
          `Retry failed for ${entry.empName}. Please check account details.`,
          success ? 'success' : 'error'
        );
      }, 1500);

      setModalType('none');
      showNotification(`Retry initiated for ${entry.empName}`, 'info');
    },
    [showNotification]
  );

  // Upload UTR manually
  const uploadUTR = useCallback(
    (entry: DisbursementEntry) => {
      if (!utrForm.utrNumber.trim()) {
        showNotification('Please enter UTR number', 'error');
        return;
      }

      setDisbursementData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        paymentStatus: 'Success' as PaymentStatus,
        utrNumber: utrForm.utrNumber,
        transactionDate: utrForm.transactionDate || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentHistory: [
        ...e.paymentHistory,
        {
          id: generateId(),
          action: 'Manual UTR Upload',
          status: 'Success',
          amount: e.netSalary,
          utrNumber: utrForm.utrNumber,
          timestamp: new Date().toISOString(),
          performedBy: 'Admin',
          remarks: utrForm.remarks || 'UTR uploaded manually'
        }]

      } :
      e
      )
      );

      setModalType('none');
      setUtrForm({ utrNumber: '', transactionDate: '', remarks: '' });
      showNotification(`UTR uploaded successfully for ${entry.empName}`);
    },
    [utrForm, showNotification]
  );

  // Put payment on hold
  const putOnHold = useCallback(
    (entry: DisbursementEntry) => {
      setDisbursementData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        paymentStatus: 'On Hold' as PaymentStatus,
        updatedAt: new Date().toISOString(),
        paymentHistory: [
        ...e.paymentHistory,
        {
          id: generateId(),
          action: 'On Hold',
          status: 'On Hold',
          amount: e.netSalary,
          utrNumber: null,
          timestamp: new Date().toISOString(),
          performedBy: 'Admin',
          remarks: 'Payment put on hold'
        }]

      } :
      e
      )
      );
      showNotification(`Payment for ${entry.empName} put on hold`, 'warning');
    },
    [showNotification]
  );

  // Release hold
  const releaseHold = useCallback(
    (entry: DisbursementEntry) => {
      setDisbursementData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        paymentStatus: 'Pending' as PaymentStatus,
        updatedAt: new Date().toISOString(),
        paymentHistory: [
        ...e.paymentHistory,
        {
          id: generateId(),
          action: 'Released',
          status: 'Pending',
          amount: e.netSalary,
          utrNumber: null,
          timestamp: new Date().toISOString(),
          performedBy: 'Admin',
          remarks: 'Hold released, ready for processing'
        }]

      } :
      e
      )
      );
      showNotification(`Hold released for ${entry.empName}`);
    },
    [showNotification]
  );

  // Cancel payment
  const cancelPayment = useCallback(
    (entry: DisbursementEntry) => {
      setDisbursementData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        paymentStatus: 'Cancelled' as PaymentStatus,
        updatedAt: new Date().toISOString(),
        paymentHistory: [
        ...e.paymentHistory,
        {
          id: generateId(),
          action: 'Cancelled',
          status: 'Cancelled',
          amount: e.netSalary,
          utrNumber: null,
          timestamp: new Date().toISOString(),
          performedBy: 'Admin',
          remarks: 'Payment cancelled'
        }]

      } :
      e
      )
      );
      setModalType('none');
      showNotification(`Payment for ${entry.empName} cancelled`, 'warning');
    },
    [showNotification]
  );

  // Send pay slip email
  const sendPaySlipEmail = useCallback(
    (entry: DisbursementEntry) => {
      showNotification(`Pay slip sent to ${entry.empName}'s email`);
    },
    [showNotification]
  );

  // Print pay slip
  const printPaySlip = useCallback(
    (entry: DisbursementEntry) => {
      showNotification(`Printing pay slip for ${entry.empName}`, 'info');
      // In real implementation, this would trigger print dialog
    },
    [showNotification]
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

  // Bulk process payments
  const bulkProcessPayments = useCallback(() => {
    const pendingEntries = disbursementData.filter(
      (e) => selectedEntries.has(e.id) && e.paymentStatus === 'Pending'
    );

    if (pendingEntries.length === 0) {
      showNotification('No pending payments selected', 'warning');
      return;
    }

    setDisbursementData((prev) =>
    prev.map((e) => {
      if (selectedEntries.has(e.id) && e.paymentStatus === 'Pending') {
        return {
          ...e,
          paymentStatus: 'Processing' as PaymentStatus,
          updatedAt: new Date().toISOString(),
          paymentHistory: [
          ...e.paymentHistory,
          {
            id: generateId(),
            action: 'Initiated',
            status: 'Processing',
            amount: e.netSalary,
            utrNumber: null,
            timestamp: new Date().toISOString(),
            performedBy: 'Admin',
            remarks: 'Bulk payment initiated'
          }]

        };
      }
      return e;
    })
    );

    // Simulate processing
    setTimeout(() => {
      setDisbursementData((prev) =>
      prev.map((e) => {
        if (selectedEntries.has(e.id) && e.paymentStatus === 'Processing') {
          const success = Math.random() > 0.15; // 85% success rate
          const utr = success ? generateUTR() : '-';
          return {
            ...e,
            paymentStatus: (success ? 'Success' : 'Failed') as PaymentStatus,
            utrNumber: utr,
            transactionDate: success ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
            paymentHistory: [
            ...e.paymentHistory,
            {
              id: generateId(),
              action: success ? 'Completed' : 'Failed',
              status: (success ? 'Success' : 'Failed') as PaymentStatus,
              amount: e.netSalary,
              utrNumber: utr,
              timestamp: new Date().toISOString(),
              performedBy: 'System',
              remarks: success ? 'Bulk payment successful' : 'Bulk payment failed'
            }]

          };
        }
        return e;
      })
      );

      showNotification(`Bulk payment processing completed`);
    }, 3000);

    setSelectedEntries(new Set());
    setShowBulkConfirm(false);
    showNotification(`Processing ${pendingEntries.length} payments...`, 'info');
  }, [disbursementData, selectedEntries, showNotification]);

  // Export data
  const exportData = useCallback(
    (format: ExportFormat) => {
      const dataToExport = selectedEntries.size > 0 ?
      filteredData.filter((e) => selectedEntries.has(e.id)) :
      filteredData;

      if (format === 'csv' || format === 'excel') {
        const headers = [
        'Employee ID',
        'Employee Name',
        'Department',
        'Bank Name',
        'Account Number',
        'IFSC',
        'Net Salary',
        'Status',
        'UTR Number',
        'Transaction Date'];

        const rows = dataToExport.map((entry) => [
        entry.empId,
        entry.empName,
        entry.department,
        entry.bankName,
        entry.accountNumberFull,
        entry.ifsc,
        entry.netSalary,
        entry.paymentStatus,
        entry.utrNumber,
        formatDate(entry.transactionDate)]
        );

        const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `salary_disbursement_${filters.month}.${format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`Data exported as ${format.toUpperCase()}`);
      } else if (format === 'bank-file') {
        // Generate bank-specific file format
        const bankData = dataToExport.
        filter((e) => e.paymentMode === 'bank-transfer' && e.paymentStatus === 'Pending').
        map((e) => `${e.accountNumberFull},${e.ifsc},${e.netSalary},${e.empName}`);

        const blob = new Blob([bankData.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bank_transfer_file_${filters.month}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Bank file generated successfully');
      } else if (format === 'pdf') {
        showNotification('PDF export initiated', 'info');
        // In real implementation, this would generate PDF
      }
    },
    [filteredData, selectedEntries, filters.month, showNotification]
  );

  // Print bank advice
  const printBankAdvice = useCallback(() => {
    window.print();
    showNotification('Print dialog opened', 'info');
  }, [showNotification]);

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
      bank: '',
      paymentMode: '',
      status: '',
      department: '',
      search: ''
    });
    showNotification('Filters reset', 'info');
  }, [showNotification]);

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      showNotification(`${label} copied to clipboard`, 'info');
    },
    [showNotification]
  );

  // Get status badge
  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
      Success: 'success',
      Pending: 'warning',
      Processing: 'default',
      Failed: 'destructive',
      Cancelled: 'secondary',
      'On Hold': 'warning'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Sort indicator
  const SortIndicator = ({ field }: {field: SortField;}) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
          @media print {
            .no-print { display: none !important; }
          }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Salary Disbursement & Bank Advice</h1>
              <p className="text-sm text-slate-500 mt-1">Process salary payments and generate bank transfer files</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={() => exportData('csv')}>
                Export
              </Button>
              <Button
                variant="primary"
                leftIcon={<FileTextIcon className="w-4 h-4" />}
                onClick={() => setModalType('preview')}>

                Generate Advice
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
            <div className="flex flex-col md:flex-row gap-3 flex-1 flex-wrap">
              <Select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                options={MONTHS}
                className="w-40" />

              <Select
                value={filters.bank}
                onChange={(e) => setFilters({ ...filters, bank: e.target.value })}
                options={[{ value: '', label: 'All Banks' }, ...BANKS.map((b) => ({ value: b.label, label: b.label }))]}
                className="w-48" />

              <Select
                value={filters.paymentMode}
                onChange={(e) => setFilters({ ...filters, paymentMode: e.target.value })}
                options={[{ value: '', label: 'All Modes' }, ...PAYMENT_MODES.map((p) => ({ value: p.value, label: p.label }))]}
                className="w-40" />

              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                { value: '', label: 'All Status' },
                { value: 'Success', label: 'Success' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Failed', label: 'Failed' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Cancelled', label: 'Cancelled' }]
                }
                className="w-36" />

              <Input
                placeholder="Search..."
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 no-print">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Employees</div>
            <div className="text-2xl font-bold text-slate-900">{summaryStats.totalEmployees}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-xs text-indigo-600 uppercase tracking-wide mb-1">Total Payable</div>
            <div className="text-2xl font-bold text-indigo-900">{formatCurrency(summaryStats.totalPayable)}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Transferred</div>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(summaryStats.totalTransferred)}</div>
            <div className="text-xs text-emerald-600">{summaryStats.successCount} employees</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-xs text-yellow-600 uppercase tracking-wide mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(summaryStats.pendingAmount)}</div>
            <div className="text-xs text-yellow-600">{summaryStats.pendingCount + summaryStats.onHoldCount} employees</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Processing</div>
            <div className="text-2xl font-bold text-blue-900">{summaryStats.processingCount}</div>
            <div className="text-xs text-blue-600">In progress</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-xs text-red-600 uppercase tracking-wide mb-1">Failed</div>
            <div className="text-2xl font-bold text-red-900">{formatCurrency(summaryStats.failedAmount)}</div>
            <div className="text-xs text-red-600">{summaryStats.failedCount} employees</div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedEntries.size > 0 &&
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 flex items-center justify-between no-print">
            <span className="text-sm text-indigo-700">
              <strong>{selectedEntries.size}</strong> entries selected
            </span>
            <div className="flex items-center gap-2">
              <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setBulkAction('process');
                setShowBulkConfirm(true);
              }}>

                <SendIcon className="w-4 h-4 mr-1" />
                Process Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                <DownloadIcon className="w-4 h-4 mr-1" />
                Export Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('bank-file')}>
                <FileSpreadsheetIcon className="w-4 h-4 mr-1" />
                Bank File
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEntries(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        }

        {/* Disbursement Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden no-print">
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
                    onClick={() => handleSort('bankName')}>

                    Bank Details
                    <SortIndicator field="bankName" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Account / IFSC</th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('netSalary')}>

                    Net Salary
                    <SortIndicator field="netSalary" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('paymentStatus')}>

                    Status
                    <SortIndicator field="paymentStatus" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">UTR Number</th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedData.length === 0 ?
                <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <BanknoteIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="font-medium">No disbursement entries found</p>
                        <p className="text-sm">Try adjusting your filters</p>
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
                          <p className="text-xs text-slate-500">{row.empId} • {row.designation}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <BuildingIcon className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-600">{row.bankName}</p>
                            <p className="text-xs text-slate-400">{row.paymentMode === 'bank-transfer' ? 'Bank Transfer' : row.paymentMode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {row.accountNumber !== '-' ?
                    <div>
                            <p className="text-slate-600 font-mono text-xs">{row.accountNumber}</p>
                            <p className="text-slate-400 font-mono text-xs">{row.ifsc}</p>
                          </div> :

                    <span className="text-slate-400">-</span>
                    }
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {formatCurrency(row.netSalary)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.paymentStatus === 'Processing' ?
                    <div className="flex items-center justify-center gap-1">
                            <Loader2Icon className="w-4 h-4 animate-spin text-blue-500" />
                            <span className="text-xs text-blue-600">Processing</span>
                          </div> :

                    getStatusBadge(row.paymentStatus)
                    }
                      </td>
                      <td className="py-3 px-4">
                        {row.utrNumber !== '-' ?
                    <div className="flex items-center gap-1">
                            <span className="text-slate-600 font-mono text-xs">{row.utrNumber}</span>
                            <button
                        onClick={() => copyToClipboard(row.utrNumber, 'UTR Number')}
                        className="p-1 hover:bg-slate-100 rounded">

                              <CopyIcon className="w-3 h-3 text-slate-400" />
                            </button>
                          </div> :

                    <span className="text-slate-400">-</span>
                    }
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ActionMenu
                      entry={row}
                      onView={() => {
                        setSelectedEntry(row);
                        setModalType('view');
                      }}
                      onViewHistory={() => {
                        setSelectedEntry(row);
                        setModalType('history');
                      }}
                      onProcess={() => {
                        setSelectedEntry(row);
                        setModalType('process');
                      }}
                      onRetry={() => {
                        setSelectedEntry(row);
                        setModalType('retry');
                      }}
                      onUploadUTR={() => {
                        setSelectedEntry(row);
                        setUtrForm({ utrNumber: '', transactionDate: '', remarks: '' });
                        setModalType('uploadUTR');
                      }}
                      onCancel={() => {
                        setSelectedEntry(row);
                        setModalType('cancelPayment');
                      }}
                      onPutOnHold={() => putOnHold(row)}
                      onRelease={() => releaseHold(row)}
                      onSendEmail={() => sendPaySlipEmail(row)}
                      onPrintSlip={() => printPaySlip(row)} />

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

        {/* Bank Advice Preview Modal */}
        {modalType === 'preview' &&
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" ref={printRef}>
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BuildingIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Salary Bank Advice</h2>
                    <p className="text-slate-600">Springfield International School</p>
                    <p className="text-sm text-slate-500">{getMonthLabel(filters.month)}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Organization Bank</div>
                      <div className="font-semibold text-slate-900">HDFC Bank - Current A/C</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Transfer Date</div>
                      <div className="font-semibold text-slate-900">
                        {new Date().toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</div>
                      <div className="font-semibold text-slate-900">{formatCurrency(summaryStats.totalPayable)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Employees</div>
                      <div className="font-semibold text-slate-900">{summaryStats.totalEmployees}</div>
                    </div>
                  </div>

                  {/* Bank-wise Summary */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Bank-wise Summary</h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 text-left text-xs font-medium text-slate-500">Bank Name</th>
                            <th className="py-2 px-3 text-center text-xs font-medium text-slate-500">Employees</th>
                            <th className="py-2 px-3 text-right text-xs font-medium text-slate-500">Total Amount</th>
                            <th className="py-2 px-3 text-center text-xs font-medium text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bankSummary.map((bank) =>
                        <tr key={bank.bankName}>
                              <td className="py-2 px-3 font-medium text-slate-900">{bank.bankName}</td>
                              <td className="py-2 px-3 text-center text-slate-600">{bank.employeeCount}</td>
                              <td className="py-2 px-3 text-right font-semibold text-slate-900">
                                {formatCurrency(bank.totalAmount)}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className="text-xs">
                                  <span className="text-green-600">{bank.successCount}✓</span>
                                  {bank.pendingCount > 0 && <span className="text-yellow-600 ml-2">{bank.pendingCount}⏳</span>}
                                  {bank.failedCount > 0 && <span className="text-red-600 ml-2">{bank.failedCount}✗</span>}
                                </span>
                              </td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200">
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Total</td>
                            <td className="py-2 px-3 text-center font-semibold text-slate-900">{summaryStats.totalEmployees}</td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900">
                              {formatCurrency(summaryStats.totalPayable)}
                            </td>
                            <td className="py-2 px-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Employee List */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Employee Transfer Details</h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 text-left text-xs font-medium text-slate-500">S.No</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-slate-500">Employee</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-slate-500">Bank</th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-slate-500">Account</th>
                            <th className="py-2 px-3 text-right text-xs font-medium text-slate-500">Amount</th>
                            <th className="py-2 px-3 text-center text-xs font-medium text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredData.slice(0, 10).map((emp, idx) =>
                        <tr key={emp.id}>
                              <td className="py-2 px-3 text-slate-600">{idx + 1}</td>
                              <td className="py-2 px-3">
                                <p className="font-medium text-slate-900">{emp.empName}</p>
                                <p className="text-xs text-slate-500">{emp.empId}</p>
                              </td>
                              <td className="py-2 px-3 text-slate-600">{emp.bankName}</td>
                              <td className="py-2 px-3 text-slate-600 font-mono text-xs">{emp.accountNumber}</td>
                              <td className="py-2 px-3 text-right font-semibold text-slate-900">
                                {formatCurrency(emp.netSalary)}
                              </td>
                              <td className="py-2 px-3 text-center">{getStatusBadge(emp.paymentStatus)}</td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                      {filteredData.length > 10 &&
                    <div className="px-3 py-2 bg-slate-50 text-center text-sm text-slate-500">
                          ... and {filteredData.length - 10} more employees
                        </div>
                    }
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-200">
                    <div className="text-center">
                      <div className="h-16"></div>
                      <div className="border-t border-slate-300 pt-2">
                        <p className="text-sm font-medium text-slate-700">Prepared By</p>
                        <p className="text-xs text-slate-500">Accounts Department</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-16"></div>
                      <div className="border-t border-slate-300 pt-2">
                        <p className="text-sm font-medium text-slate-700">Verified By</p>
                        <p className="text-xs text-slate-500">Finance Manager</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-16"></div>
                      <div className="border-t border-slate-300 pt-2">
                        <p className="text-sm font-medium text-slate-700">Approved By</p>
                        <p className="text-xs text-slate-500">Director</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-6 border-t border-slate-200 mt-8 no-print">
                    <Button variant="outline" onClick={() => setModalType('none')}>
                      Close Preview
                    </Button>
                    <Button variant="outline" leftIcon={<FileSpreadsheetIcon className="w-4 h-4" />} onClick={() => exportData('bank-file')}>
                      Bank File
                    </Button>
                    <Button variant="outline" leftIcon={<PrinterIcon className="w-4 h-4" />} onClick={printBankAdvice}>
                      Print
                    </Button>
                    <Button variant="primary" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={() => exportData('pdf')}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {/* View Details Modal */}
        {modalType === 'view' && selectedEntry &&
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Payment Details</h3>
                    <button onClick={() => setModalType('none')} className="p-1 hover:bg-slate-100 rounded">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Employee Info */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{selectedEntry.empName}</p>
                        <p className="text-sm text-slate-500">{selectedEntry.empId} • {selectedEntry.designation}</p>
                        <p className="text-xs text-slate-400">{selectedEntry.department}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedEntry.netSalary)}</p>
                        {getStatusBadge(selectedEntry.paymentStatus)}
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Bank Name</p>
                        <p className="font-medium text-slate-900">{selectedEntry.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Branch</p>
                        <p className="font-medium text-slate-900">{selectedEntry.branchName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Account Number</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 font-mono">{selectedEntry.accountNumberFull}</p>
                          <button
                          onClick={() => copyToClipboard(selectedEntry.accountNumberFull, 'Account Number')}
                          className="p-1 hover:bg-slate-100 rounded">

                            <CopyIcon className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">IFSC Code</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 font-mono">{selectedEntry.ifsc}</p>
                          <button
                          onClick={() => copyToClipboard(selectedEntry.ifsc, 'IFSC Code')}
                          className="p-1 hover:bg-slate-100 rounded">

                            <CopyIcon className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Account Type</p>
                        <p className="font-medium text-slate-900">{selectedEntry.accountType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Payment Mode</p>
                        <p className="font-medium text-slate-900 capitalize">{selectedEntry.paymentMode.replace('-', ' ')}</p>
                      </div>
                    </div>

                    {/* Salary Breakdown */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Salary Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Gross Salary</span>
                          <span className="font-medium">{formatCurrency(selectedEntry.grossSalary)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Total Deductions</span>
                          <span className="font-medium text-red-600">-{formatCurrency(selectedEntry.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span className="font-semibold text-slate-900">Net Salary</span>
                          <span className="font-bold text-green-600">{formatCurrency(selectedEntry.netSalary)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    {selectedEntry.paymentStatus === 'Success' &&
                  <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Transaction Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">UTR Number</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900 font-mono">{selectedEntry.utrNumber}</p>
                              <button
                            onClick={() => copyToClipboard(selectedEntry.utrNumber, 'UTR Number')}
                            className="p-1 hover:bg-slate-100 rounded">

                                <CopyIcon className="w-3 h-3 text-slate-400" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Transaction Date</p>
                            <p className="font-medium text-slate-900">{formatDateTime(selectedEntry.transactionDate)}</p>
                          </div>
                        </div>
                      </div>
                  }

                    {/* Retry Info */}
                    {selectedEntry.retryCount > 0 &&
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-700">
                          <AlertTriangleIcon className="w-4 h-4 inline mr-1" />
                          This payment has been retried {selectedEntry.retryCount} time(s).
                          Last retry: {formatDateTime(selectedEntry.lastRetryAt)}
                        </p>
                      </div>
                  }
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => setModalType('none')}>
                      Close
                    </Button>
                    <Button
                    variant="outline"
                    onClick={() => {
                      setModalType('history');
                    }}>

                      <HistoryIcon className="w-4 h-4 mr-1" />
                      View History
                    </Button>
                    {selectedEntry.paymentStatus === 'Success' &&
                  <Button variant="primary" onClick={() => sendPaySlipEmail(selectedEntry)}>
                        <MailIcon className="w-4 h-4 mr-1" />
                        Send Pay Slip
                      </Button>
                  }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Payment History Modal */}
        {modalType === 'history' && selectedEntry &&
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
                      <p className="text-sm text-slate-500">{selectedEntry.empName} - {getMonthLabel(selectedEntry.payrollMonth)}</p>
                    </div>
                    <button onClick={() => setModalType('none')} className="p-1 hover:bg-slate-100 rounded">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <PaymentHistoryTimeline history={selectedEntry.paymentHistory} />

                  <div className="flex justify-end mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => setModalType('none')}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Upload UTR Modal */}
        {modalType === 'uploadUTR' && selectedEntry &&
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Upload UTR Manually</h3>
                    <button onClick={() => setModalType('none')} className="p-1 hover:bg-slate-100 rounded">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900">{selectedEntry.empName}</p>
                    <p className="text-sm text-slate-500">{formatCurrency(selectedEntry.netSalary)}</p>
                  </div>

                  <div className="space-y-4">
                    <Input
                    label="UTR Number *"
                    placeholder="Enter UTR number"
                    value={utrForm.utrNumber}
                    onChange={(e) => setUtrForm({ ...utrForm, utrNumber: e.target.value })} />

                    <Input
                    label="Transaction Date"
                    type="date"
                    value={utrForm.transactionDate}
                    onChange={(e) => setUtrForm({ ...utrForm, transactionDate: e.target.value })} />

                    <Textarea
                    label="Remarks"
                    placeholder="Enter remarks (optional)"
                    rows={2}
                    value={utrForm.remarks}
                    onChange={(e) => setUtrForm({ ...utrForm, remarks: e.target.value })} />

                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => setModalType('none')}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => uploadUTR(selectedEntry)}>
                      <UploadIcon className="w-4 h-4 mr-1" />
                      Upload UTR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Process Payment Confirmation */}
        <ConfirmationModal
          isOpen={modalType === 'process'}
          onClose={() => setModalType('none')}
          onConfirm={() => selectedEntry && processPayment(selectedEntry)}
          title="Process Payment"
          message={
          selectedEntry &&
          <div>
                <p>
                  Are you sure you want to process payment of{' '}
                  <strong>{formatCurrency(selectedEntry.netSalary)}</strong> to{' '}
                  <strong>{selectedEntry.empName}</strong>?
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs">
                  <p><strong>Bank:</strong> {selectedEntry.bankName}</p>
                  <p><strong>Account:</strong> {selectedEntry.accountNumber}</p>
                  <p><strong>IFSC:</strong> {selectedEntry.ifsc}</p>
                </div>
              </div>

          }
          confirmText="Process Payment"
          variant="success"
          isLoading={isProcessing} />


        {/* Retry Payment Confirmation */}
        <ConfirmationModal
          isOpen={modalType === 'retry'}
          onClose={() => setModalType('none')}
          onConfirm={() => selectedEntry && retryPayment(selectedEntry)}
          title="Retry Payment"
          message={
          selectedEntry &&
          <div>
                <p>
                  Retry payment of <strong>{formatCurrency(selectedEntry.netSalary)}</strong> to{' '}
                  <strong>{selectedEntry.empName}</strong>?
                </p>
                {selectedEntry.retryCount > 0 &&
            <p className="mt-2 text-yellow-600 text-sm">
                    <AlertTriangleIcon className="w-4 h-4 inline mr-1" />
                    This payment has already been retried {selectedEntry.retryCount} time(s).
                  </p>
            }
              </div>

          }
          confirmText="Retry Payment"
          variant="info" />


        {/* Cancel Payment Confirmation */}
        <ConfirmationModal
          isOpen={modalType === 'cancelPayment'}
          onClose={() => setModalType('none')}
          onConfirm={() => selectedEntry && cancelPayment(selectedEntry)}
          title="Cancel Payment"
          message={
          selectedEntry &&
          <p>
                Are you sure you want to cancel the payment of{' '}
                <strong>{formatCurrency(selectedEntry.netSalary)}</strong> for{' '}
                <strong>{selectedEntry.empName}</strong>? This action cannot be undone.
              </p>

          }
          confirmText="Cancel Payment"
          variant="danger" />


        {/* Bulk Process Confirmation */}
        <ConfirmationModal
          isOpen={showBulkConfirm}
          onClose={() => setShowBulkConfirm(false)}
          onConfirm={bulkProcessPayments}
          title="Process Selected Payments"
          message={
          <div>
              <p>
                You are about to process <strong>{selectedEntries.size}</strong> payments.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Only pending payments will be processed. Payments that are already successful, failed, or on hold will be skipped.
              </p>
            </div>
          }
          confirmText="Process All"
          variant="success" />

      </div>

      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}