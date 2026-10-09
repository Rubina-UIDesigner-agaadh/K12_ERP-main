import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  LockIcon,
  UnlockIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  DownloadIcon,
  PrinterIcon,
  RefreshCwIcon,
  MailIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  SendIcon,
  HistoryIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  CopyIcon,
  Trash2Icon,
  MoreVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Building2Icon,
  BriefcaseIcon,
  RotateCcwIcon,
  ShareIcon,
  Settings2Icon } from
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
type PayslipStatus = 'Draft' | 'Locked' | 'Released' | 'Revoked';
type PayrollStatus = 'Pending' | 'Processed' | 'Approved' | 'Finalized';
type PayrollType = 'regular' | 'supplementary' | 'arrear';

interface EarningComponent {
  id: string;
  name: string;
  amount: number;
}

interface DeductionComponent {
  id: string;
  name: string;
  amount: number;
}

interface PayslipData {
  id: number;
  empId: string;
  empName: string;
  empCode: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  bankAccount: string;
  bankName: string;
  panNumber: string;
  joiningDate: string;
  month: string;
  payrollType: PayrollType;
  earnings: EarningComponent[];
  deductions: DeductionComponent[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  payrollStatus: PayrollStatus;
  payslipStatus: PayslipStatus;
  locked: boolean;
  lockedAt: Date | null;
  lockedBy: string | null;
  released: boolean;
  releasedAt: Date | null;
  releasedBy: string | null;
  emailSent: boolean;
  emailSentAt: Date | null;
  downloadCount: number;
  lastDownloadAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  remarks: string;
  auditLog: AuditLogEntry[];
}

interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  oldValue: any;
  newValue: any;
  remarks: string;
  ipAddress: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface FilterState {
  month: string;
  payrollType: string;
  department: string;
  payslipStatus: string;
  search: string;
}

interface SortConfig {
  key: keyof PayslipData;
  direction: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Initial Data
// ---------------------------------------------------------------------------
const DEPARTMENTS = [
{ value: 'teaching', label: 'Teaching' },
{ value: 'administration', label: 'Administration' },
{ value: 'it', label: 'IT Department' },
{ value: 'finance', label: 'Finance' },
{ value: 'support', label: 'Support Staff' },
{ value: 'hr', label: 'Human Resources' },
{ value: 'marketing', label: 'Marketing' }];


const MONTHS = [
{ value: 'Jan 2025', label: 'January 2025' },
{ value: 'Feb 2025', label: 'February 2025' },
{ value: 'Mar 2025', label: 'March 2025' },
{ value: 'Apr 2025', label: 'April 2025' },
{ value: 'May 2025', label: 'May 2025' },
{ value: 'Jun 2025', label: 'June 2025' }];


const INITIAL_PAYSLIP_DATA: PayslipData[] = [
{
  id: 1,
  empId: 'EMP001',
  empName: 'Rajesh Kumar',
  empCode: 'EMP001',
  department: 'Teaching',
  designation: 'Senior Teacher',
  email: 'rajesh.kumar@school.edu',
  phone: '+91-9876543210',
  bankAccount: 'XXXX-XXXX-1234',
  bankName: 'State Bank of India',
  panNumber: 'ABCDE1234F',
  joiningDate: '2020-04-01',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 25000 },
  { id: 'hra', name: 'HRA', amount: 10000 },
  { id: 'da', name: 'Dearness Allowance', amount: 5000 },
  { id: 'ta', name: 'Transport Allowance', amount: 3000 },
  { id: 'special', name: 'Special Allowance', amount: 2000 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 3000 },
  { id: 'esi', name: 'ESI', amount: 800 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 2100 }],

  grossSalary: 45000,
  totalDeductions: 6100,
  netSalary: 38900,
  payrollStatus: 'Processed',
  payslipStatus: 'Released',
  locked: true,
  lockedAt: new Date('2025-05-25'),
  lockedBy: 'Finance Manager',
  released: true,
  releasedAt: new Date('2025-05-28'),
  releasedBy: 'HR Admin',
  emailSent: true,
  emailSentAt: new Date('2025-05-28'),
  downloadCount: 2,
  lastDownloadAt: new Date('2025-05-29'),
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-28'),
  remarks: '',
  auditLog: [
  {
    id: '1',
    action: 'Created',
    performedBy: 'Payroll System',
    performedAt: new Date('2025-05-20'),
    oldValue: null,
    newValue: { status: 'Draft' },
    remarks: 'Payslip generated',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    action: 'Locked',
    performedBy: 'Finance Manager',
    performedAt: new Date('2025-05-25'),
    oldValue: { locked: false },
    newValue: { locked: true },
    remarks: 'Payslip locked after verification',
    ipAddress: '192.168.1.105'
  },
  {
    id: '3',
    action: 'Released',
    performedBy: 'HR Admin',
    performedAt: new Date('2025-05-28'),
    oldValue: { released: false },
    newValue: { released: true },
    remarks: 'Payslip released to employee',
    ipAddress: '192.168.1.110'
  }]

},
{
  id: 2,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  empCode: 'EMP002',
  department: 'Administration',
  designation: 'Admin Manager',
  email: 'priya.sharma@school.edu',
  phone: '+91-9876543211',
  bankAccount: 'XXXX-XXXX-2345',
  bankName: 'HDFC Bank',
  panNumber: 'BCDEF2345G',
  joiningDate: '2019-06-15',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 22000 },
  { id: 'hra', name: 'HRA', amount: 8800 },
  { id: 'da', name: 'Dearness Allowance', amount: 4400 },
  { id: 'ta', name: 'Transport Allowance', amount: 2500 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 2640 },
  { id: 'esi', name: 'ESI', amount: 660 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 1880 }],

  grossSalary: 37700,
  totalDeductions: 5380,
  netSalary: 32320,
  payrollStatus: 'Processed',
  payslipStatus: 'Locked',
  locked: true,
  lockedAt: new Date('2025-05-26'),
  lockedBy: 'Finance Manager',
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-26'),
  remarks: '',
  auditLog: []
},
{
  id: 3,
  empId: 'EMP003',
  empName: 'Amit Patel',
  empCode: 'EMP003',
  department: 'IT Department',
  designation: 'System Administrator',
  email: 'amit.patel@school.edu',
  phone: '+91-9876543212',
  bankAccount: 'XXXX-XXXX-3456',
  bankName: 'ICICI Bank',
  panNumber: 'CDEFG3456H',
  joiningDate: '2021-01-10',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 30000 },
  { id: 'hra', name: 'HRA', amount: 12000 },
  { id: 'da', name: 'Dearness Allowance', amount: 6000 },
  { id: 'ta', name: 'Transport Allowance', amount: 3500 },
  { id: 'special', name: 'Special Allowance', amount: 4000 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 3600 },
  { id: 'esi', name: 'ESI', amount: 900 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 3020 }],

  grossSalary: 55500,
  totalDeductions: 7720,
  netSalary: 47780,
  payrollStatus: 'Processed',
  payslipStatus: 'Draft',
  locked: false,
  lockedAt: null,
  lockedBy: null,
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-20'),
  remarks: '',
  auditLog: []
},
{
  id: 4,
  empId: 'EMP004',
  empName: 'Sneha Reddy',
  empCode: 'EMP004',
  department: 'Finance',
  designation: 'Accountant',
  email: 'sneha.reddy@school.edu',
  phone: '+91-9876543213',
  bankAccount: 'XXXX-XXXX-4567',
  bankName: 'Axis Bank',
  panNumber: 'DEFGH4567I',
  joiningDate: '2018-09-20',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 24000 },
  { id: 'hra', name: 'HRA', amount: 9600 },
  { id: 'da', name: 'Dearness Allowance', amount: 4800 },
  { id: 'ta', name: 'Transport Allowance', amount: 2800 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 2880 },
  { id: 'esi', name: 'ESI', amount: 720 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 2420 }],

  grossSalary: 41200,
  totalDeductions: 6220,
  netSalary: 34980,
  payrollStatus: 'Processed',
  payslipStatus: 'Locked',
  locked: true,
  lockedAt: new Date('2025-05-26'),
  lockedBy: 'Finance Manager',
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-26'),
  remarks: '',
  auditLog: []
},
{
  id: 5,
  empId: 'EMP005',
  empName: 'Vikram Singh',
  empCode: 'EMP005',
  department: 'Support Staff',
  designation: 'Facility Manager',
  email: 'vikram.singh@school.edu',
  phone: '+91-9876543214',
  bankAccount: 'XXXX-XXXX-5678',
  bankName: 'Punjab National Bank',
  panNumber: 'EFGHI5678J',
  joiningDate: '2017-03-15',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 18000 },
  { id: 'hra', name: 'HRA', amount: 7200 },
  { id: 'da', name: 'Dearness Allowance', amount: 3600 },
  { id: 'ta', name: 'Transport Allowance', amount: 2000 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 2160 },
  { id: 'esi', name: 'ESI', amount: 540 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 1060 }],

  grossSalary: 30800,
  totalDeductions: 3960,
  netSalary: 26840,
  payrollStatus: 'Processed',
  payslipStatus: 'Released',
  locked: true,
  lockedAt: new Date('2025-05-25'),
  lockedBy: 'Finance Manager',
  released: true,
  releasedAt: new Date('2025-05-28'),
  releasedBy: 'HR Admin',
  emailSent: true,
  emailSentAt: new Date('2025-05-28'),
  downloadCount: 1,
  lastDownloadAt: new Date('2025-05-29'),
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-28'),
  remarks: '',
  auditLog: []
},
{
  id: 6,
  empId: 'EMP006',
  empName: 'Kavita Joshi',
  empCode: 'EMP006',
  department: 'Human Resources',
  designation: 'HR Executive',
  email: 'kavita.joshi@school.edu',
  phone: '+91-9876543215',
  bankAccount: 'XXXX-XXXX-6789',
  bankName: 'Bank of Baroda',
  panNumber: 'FGHIJ6789K',
  joiningDate: '2022-07-01',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 20000 },
  { id: 'hra', name: 'HRA', amount: 8000 },
  { id: 'da', name: 'Dearness Allowance', amount: 4000 },
  { id: 'ta', name: 'Transport Allowance', amount: 2500 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 2400 },
  { id: 'esi', name: 'ESI', amount: 600 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 1300 }],

  grossSalary: 34500,
  totalDeductions: 4500,
  netSalary: 30000,
  payrollStatus: 'Processed',
  payslipStatus: 'Draft',
  locked: false,
  lockedAt: null,
  lockedBy: null,
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-20'),
  remarks: '',
  auditLog: []
},
{
  id: 7,
  empId: 'EMP007',
  empName: 'Rahul Mehta',
  empCode: 'EMP007',
  department: 'Marketing',
  designation: 'Marketing Manager',
  email: 'rahul.mehta@school.edu',
  phone: '+91-9876543216',
  bankAccount: 'XXXX-XXXX-7890',
  bankName: 'Kotak Mahindra Bank',
  panNumber: 'GHIJK7890L',
  joiningDate: '2021-11-15',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 28000 },
  { id: 'hra', name: 'HRA', amount: 11200 },
  { id: 'da', name: 'Dearness Allowance', amount: 5600 },
  { id: 'ta', name: 'Transport Allowance', amount: 3200 },
  { id: 'incentive', name: 'Performance Incentive', amount: 5000 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 3360 },
  { id: 'esi', name: 'ESI', amount: 840 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 2800 }],

  grossSalary: 53000,
  totalDeductions: 7200,
  netSalary: 45800,
  payrollStatus: 'Processed',
  payslipStatus: 'Draft',
  locked: false,
  lockedAt: null,
  lockedBy: null,
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-20'),
  remarks: '',
  auditLog: []
},
{
  id: 8,
  empId: 'EMP008',
  empName: 'Anita Desai',
  empCode: 'EMP008',
  department: 'Teaching',
  designation: 'Principal',
  email: 'anita.desai@school.edu',
  phone: '+91-9876543217',
  bankAccount: 'XXXX-XXXX-8901',
  bankName: 'Canara Bank',
  panNumber: 'HIJKL8901M',
  joiningDate: '2015-04-01',
  month: 'May 2025',
  payrollType: 'regular',
  earnings: [
  { id: 'basic', name: 'Basic Salary', amount: 45000 },
  { id: 'hra', name: 'HRA', amount: 18000 },
  { id: 'da', name: 'Dearness Allowance', amount: 9000 },
  { id: 'ta', name: 'Transport Allowance', amount: 5000 },
  { id: 'special', name: 'Special Allowance', amount: 8000 }],

  deductions: [
  { id: 'pf', name: 'Provident Fund', amount: 5400 },
  { id: 'pt', name: 'Professional Tax', amount: 200 },
  { id: 'tds', name: 'TDS', amount: 8400 }],

  grossSalary: 85000,
  totalDeductions: 14000,
  netSalary: 71000,
  payrollStatus: 'Processed',
  payslipStatus: 'Locked',
  locked: true,
  lockedAt: new Date('2025-05-26'),
  lockedBy: 'Finance Manager',
  released: false,
  releasedAt: null,
  releasedBy: null,
  emailSent: false,
  emailSentAt: null,
  downloadCount: 0,
  lastDownloadAt: null,
  createdAt: new Date('2025-05-20'),
  updatedAt: new Date('2025-05-26'),
  remarks: '',
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

const generatePayslipPDF = (payslip: PayslipData): void => {
  // Simulate PDF generation
  const content = `
    PAYSLIP - ${payslip.month}
    ================================
    Employee: ${payslip.empName}
    Employee ID: ${payslip.empCode}
    Department: ${payslip.department}
    Designation: ${payslip.designation}
    
    EARNINGS
    --------
    ${payslip.earnings.map((e) => `${e.name}: ${formatCurrency(e.amount)}`).join('\n    ')}
    
    DEDUCTIONS
    ----------
    ${payslip.deductions.map((d) => `${d.name}: ${formatCurrency(d.amount)}`).join('\n    ')}
    
    SUMMARY
    -------
    Gross Salary: ${formatCurrency(payslip.grossSalary)}
    Total Deductions: ${formatCurrency(payslip.totalDeductions)}
    Net Salary: ${formatCurrency(payslip.netSalary)}
  `;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payslip-${payslip.empCode}-${payslip.month.replace(' ', '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
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
  variant?: 'danger' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  icon
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-indigo-600 hover:bg-indigo-700',
    success: 'bg-emerald-600 hover:bg-emerald-700'
  };

  const defaultIcons = {
    danger: <XCircleIcon className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangleIcon className="h-6 w-6 text-amber-600" />,
    info: <InfoIcon className="h-6 w-6 text-blue-600" />,
    success: <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icon || defaultIcons[variant]}
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
// View Payslip Modal Component
// ---------------------------------------------------------------------------
interface ViewPayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
  onDownload: (payslip: PayslipData) => void;
  onEmail: (payslip: PayslipData) => void;
  onPrint: (payslip: PayslipData) => void;
}

function ViewPayslipModal({
  isOpen,
  onClose,
  payslip,
  onDownload,
  onEmail,
  onPrint
}: ViewPayslipModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'breakdown' | 'history'>('details');

  if (!payslip) return null;

  const getStatusBadge = (status: PayslipStatus) => {
    const variants: Record<PayslipStatus, 'success' | 'warning' | 'secondary' | 'error'> = {
      Released: 'success',
      Locked: 'warning',
      Draft: 'secondary',
      Revoked: 'error'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payslip Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{payslip.empName}</h3>
                {getStatusBadge(payslip.payslipStatus)}
              </div>
              <p className="text-sm text-slate-500">
                {payslip.empCode} • {payslip.department} • {payslip.designation}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Payslip for {payslip.month}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Net Pay</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(payslip.netSalary)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6">
            {[
            { id: 'details', label: 'Employee Details', icon: UserIcon },
            { id: 'breakdown', label: 'Salary Breakdown', icon: DollarSignIcon },
            { id: 'history', label: 'History', icon: HistoryIcon }].
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
        <div className="min-h-[300px]">
          {activeTab === 'details' &&
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                  <p className="text-sm text-slate-900">{payslip.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Phone</label>
                  <p className="text-sm text-slate-900">{payslip.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">PAN Number</label>
                  <p className="text-sm text-slate-900">{payslip.panNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Joining Date</label>
                  <p className="text-sm text-slate-900">{payslip.joiningDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Bank Account</label>
                  <p className="text-sm text-slate-900">{payslip.bankAccount}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Bank Name</label>
                  <p className="text-sm text-slate-900">{payslip.bankName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Payroll Type</label>
                  <p className="text-sm text-slate-900 capitalize">{payslip.payrollType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Download Count</label>
                  <p className="text-sm text-slate-900">{payslip.downloadCount} times</p>
                </div>
              </div>
            </div>
          }

          {activeTab === 'breakdown' &&
          <div className="space-y-6">
              {/* Earnings */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Earnings
                </h4>
                <div className="space-y-2">
                  {payslip.earnings.map((earning) =>
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg">

                      <span className="text-sm text-slate-700">{earning.name}</span>
                      <span className="text-sm font-medium text-green-700">
                        +{formatCurrency(earning.amount)}
                      </span>
                    </div>
                )}
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg font-semibold">
                    <span className="text-sm text-slate-900">Gross Salary</span>
                    <span className="text-sm text-green-800">{formatCurrency(payslip.grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <XCircleIcon className="w-4 h-4 text-red-600" />
                  Deductions
                </h4>
                <div className="space-y-2">
                  {payslip.deductions.map((deduction) =>
                <div
                  key={deduction.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg">

                      <span className="text-sm text-slate-700">{deduction.name}</span>
                      <span className="text-sm font-medium text-red-700">
                        -{formatCurrency(deduction.amount)}
                      </span>
                    </div>
                )}
                  <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg font-semibold">
                    <span className="text-sm text-slate-900">Total Deductions</span>
                    <span className="text-sm text-red-800">{formatCurrency(payslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="flex items-center justify-between p-4 bg-indigo-100 rounded-lg">
                <span className="text-base font-bold text-slate-900">Net Salary</span>
                <span className="text-xl font-bold text-indigo-700">{formatCurrency(payslip.netSalary)}</span>
              </div>
            </div>
          }

          {activeTab === 'history' &&
          <div className="space-y-4">
              {/* Status Timeline */}
              <div className="space-y-3">
                {payslip.createdAt &&
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileTextIcon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Payslip Created</p>
                      <p className="text-xs text-slate-500">{formatDateTime(payslip.createdAt)}</p>
                    </div>
                  </div>
              }
                {payslip.lockedAt &&
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <LockIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Payslip Locked</p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(payslip.lockedAt)} by {payslip.lockedBy}
                      </p>
                    </div>
                  </div>
              }
                {payslip.releasedAt &&
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <UnlockIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Payslip Released</p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(payslip.releasedAt)} by {payslip.releasedBy}
                      </p>
                    </div>
                  </div>
              }
                {payslip.emailSentAt &&
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <MailIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Email Sent</p>
                      <p className="text-xs text-slate-500">{formatDateTime(payslip.emailSentAt)}</p>
                    </div>
                  </div>
              }
                {payslip.lastDownloadAt &&
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <DownloadIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Last Downloaded</p>
                      <p className="text-xs text-slate-500">{formatDateTime(payslip.lastDownloadAt)}</p>
                    </div>
                  </div>
              }
              </div>

              {/* Audit Log */}
              {payslip.auditLog.length > 0 &&
            <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Audit Log</h4>
                  <div className="space-y-2">
                    {payslip.auditLog.map((log) =>
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{log.action}</span>
                          <span className="text-xs text-slate-400">{formatDateTime(log.performedAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          by {log.performedBy} • IP: {log.ipAddress}
                        </p>
                        {log.remarks &&
                  <p className="text-xs text-slate-600 mt-1">{log.remarks}</p>
                  }
                      </div>
                )}
                  </div>
                </div>
            }
            </div>
          }
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => onDownload(payslip)}>

              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PrinterIcon className="w-4 h-4" />}
              onClick={() => onPrint(payslip)}>

              Print
            </Button>
            {payslip.released &&
            <Button
              variant="outline"
              size="sm"
              leftIcon={<MailIcon className="w-4 h-4" />}
              onClick={() => onEmail(payslip)}>

                Email
              </Button>
            }
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Remarks Modal Component
// ---------------------------------------------------------------------------
interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (remarks: string) => void;
  title: string;
  actionLabel: string;
}

function RemarksModal({ isOpen, onClose, onSubmit, title, actionLabel }: RemarksModalProps) {
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    onSubmit(remarks);
    setRemarks('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <Textarea
          label="Remarks (Optional)"
          placeholder="Enter any remarks or notes..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Email Modal Component
// ---------------------------------------------------------------------------
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emails: string[], subject: string, message: string) => void;
  selectedPayslips: PayslipData[];
}

function EmailModal({ isOpen, onClose, onSend, selectedPayslips }: EmailModalProps) {
  const [subject, setSubject] = useState(`Payslip for ${selectedPayslips[0]?.month || 'Current Month'}`);
  const [message, setMessage] = useState(
    'Dear Employee,\n\nPlease find attached your payslip for the current month.\n\nRegards,\nHR Department'
  );
  const [customEmails, setCustomEmails] = useState('');

  const handleSend = () => {
    const emails = selectedPayslips.map((p) => p.email);
    if (customEmails.trim()) {
      emails.push(...customEmails.split(',').map((e) => e.trim()));
    }
    onSend(emails, subject, message);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Payslip via Email" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
          <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg max-h-24 overflow-auto">
            {selectedPayslips.map((payslip) =>
            <span
              key={payslip.id}
              className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs">

                {payslip.empName} ({payslip.email})
              </span>
            )}
          </div>
        </div>

        <Input
          label="Additional Emails (comma-separated)"
          placeholder="email1@example.com, email2@example.com"
          value={customEmails}
          onChange={(e) => setCustomEmails(e.target.value)} />


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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" leftIcon={<SendIcon className="w-4 h-4" />} onClick={handleSend}>
            Send Email ({selectedPayslips.length})
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function PayslipLockRelease() {
  // State Management
  const [payslipData, setPayslipData] = useState<PayslipData[]>(INITIAL_PAYSLIP_DATA);
  const [filters, setFilters] = useState<FilterState>({
    month: 'May 2025',
    payrollType: 'all',
    department: 'all',
    payslipStatus: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'lock' | 'unlock' | 'release' | 'revoke' | 'delete';
    ids: number[];
    title: string;
    message: string;
  } | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksAction, setRemarksAction] = useState<{
    type: 'lock' | 'unlock' | 'release' | 'revoke';
    ids: number[];
  } | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const addAuditLog = useCallback(
    (payslipId: number, action: string, remarks: string = '') => {
      setPayslipData((prev) =>
      prev.map((p) => {
        if (p.id === payslipId) {
          return {
            ...p,
            auditLog: [
            ...p.auditLog,
            {
              id: Date.now().toString(),
              action,
              performedBy: 'Current User',
              performedAt: new Date(),
              oldValue: null,
              newValue: null,
              remarks,
              ipAddress: '192.168.1.100'
            }]

          };
        }
        return p;
      })
      );
    },
    []
  );

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let result = [...payslipData];

    // Apply filters
    if (filters.month !== 'all') {
      result = result.filter((p) => p.month === filters.month);
    }

    if (filters.payrollType !== 'all') {
      result = result.filter((p) => p.payrollType === filters.payrollType);
    }

    if (filters.department !== 'all') {
      result = result.filter(
        (p) => p.department.toLowerCase() === filters.department.toLowerCase()
      );
    }

    if (filters.payslipStatus !== 'all') {
      result = result.filter((p) => p.payslipStatus === filters.payslipStatus);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
        p.empName.toLowerCase().includes(searchLower) ||
        p.empCode.toLowerCase().includes(searchLower) ||
        p.department.toLowerCase().includes(searchLower) ||
        p.designation.toLowerCase().includes(searchLower)
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
  }, [payslipData, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Summary Statistics
  const summaryStats = useMemo(() => {
    const filtered = filteredData;
    return {
      total: filtered.length,
      draft: filtered.filter((p) => p.payslipStatus === 'Draft').length,
      locked: filtered.filter((p) => p.payslipStatus === 'Locked').length,
      released: filtered.filter((p) => p.payslipStatus === 'Released').length,
      totalAmount: filtered.reduce((sum, p) => sum + p.netSalary, 0)
    };
  }, [filteredData]);

  // Handlers
  const handleSort = (key: keyof PayslipData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

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

  // Lock/Unlock Functions
  const handleLockPayslip = useCallback((ids: number[], remarks: string = '') => {
    setPayslipData((prev) =>
    prev.map((p) => {
      if (ids.includes(p.id) && !p.locked) {
        addAuditLog(p.id, 'Locked', remarks);
        return {
          ...p,
          locked: true,
          lockedAt: new Date(),
          lockedBy: 'Current User',
          payslipStatus: 'Locked' as PayslipStatus,
          updatedAt: new Date()
        };
      }
      return p;
    })
    );
    addNotification('success', `${ids.length} payslip(s) locked successfully`);
    setSelectedRows([]);
  }, [addNotification, addAuditLog]);

  const handleUnlockPayslip = useCallback((ids: number[], remarks: string = '') => {
    setPayslipData((prev) =>
    prev.map((p) => {
      if (ids.includes(p.id) && p.locked && !p.released) {
        addAuditLog(p.id, 'Unlocked', remarks);
        return {
          ...p,
          locked: false,
          lockedAt: null,
          lockedBy: null,
          payslipStatus: 'Draft' as PayslipStatus,
          updatedAt: new Date()
        };
      }
      return p;
    })
    );
    addNotification('success', `${ids.length} payslip(s) unlocked successfully`);
    setSelectedRows([]);
  }, [addNotification, addAuditLog]);

  // Release/Revoke Functions
  const handleReleasePayslip = useCallback((ids: number[], remarks: string = '') => {
    const validIds = ids.filter((id) => {
      const payslip = payslipData.find((p) => p.id === id);
      return payslip?.locked && !payslip?.released;
    });

    if (validIds.length === 0) {
      addNotification('warning', 'Selected payslips must be locked before release');
      return;
    }

    setPayslipData((prev) =>
    prev.map((p) => {
      if (validIds.includes(p.id)) {
        addAuditLog(p.id, 'Released', remarks);
        return {
          ...p,
          released: true,
          releasedAt: new Date(),
          releasedBy: 'Current User',
          payslipStatus: 'Released' as PayslipStatus,
          updatedAt: new Date()
        };
      }
      return p;
    })
    );
    addNotification('success', `${validIds.length} payslip(s) released successfully`);
    setSelectedRows([]);
  }, [payslipData, addNotification, addAuditLog]);

  const handleRevokePayslip = useCallback((ids: number[], remarks: string = '') => {
    setPayslipData((prev) =>
    prev.map((p) => {
      if (ids.includes(p.id) && p.released) {
        addAuditLog(p.id, 'Revoked', remarks);
        return {
          ...p,
          released: false,
          releasedAt: null,
          releasedBy: null,
          payslipStatus: 'Locked' as PayslipStatus,
          updatedAt: new Date()
        };
      }
      return p;
    })
    );
    addNotification('warning', `${ids.length} payslip(s) revoked`);
    setSelectedRows([]);
  }, [addNotification, addAuditLog]);

  // Toggle Lock for Individual Row
  const handleToggleLock = (payslip: PayslipData) => {
    if (payslip.released) {
      addNotification('warning', 'Cannot unlock a released payslip. Revoke it first.');
      return;
    }

    if (payslip.locked) {
      setRemarksAction({ type: 'unlock', ids: [payslip.id] });
    } else {
      setRemarksAction({ type: 'lock', ids: [payslip.id] });
    }
    setShowRemarksModal(true);
  };

  // Toggle Release for Individual Row
  const handleToggleRelease = (payslip: PayslipData) => {
    if (!payslip.locked) {
      addNotification('warning', 'Payslip must be locked before release');
      return;
    }

    if (payslip.released) {
      setRemarksAction({ type: 'revoke', ids: [payslip.id] });
    } else {
      setRemarksAction({ type: 'release', ids: [payslip.id] });
    }
    setShowRemarksModal(true);
  };

  // Remarks Modal Submit
  const handleRemarksSubmit = (remarks: string) => {
    if (!remarksAction) return;

    switch (remarksAction.type) {
      case 'lock':
        handleLockPayslip(remarksAction.ids, remarks);
        break;
      case 'unlock':
        handleUnlockPayslip(remarksAction.ids, remarks);
        break;
      case 'release':
        handleReleasePayslip(remarksAction.ids, remarks);
        break;
      case 'revoke':
        handleRevokePayslip(remarksAction.ids, remarks);
        break;
    }
    setRemarksAction(null);
  };

  // Bulk Actions
  const handleBulkLock = () => {
    const unlocked = selectedRows.filter((id) => {
      const p = payslipData.find((x) => x.id === id);
      return p && !p.locked;
    });

    if (unlocked.length === 0) {
      addNotification('warning', 'No unlocked payslips selected');
      return;
    }

    setRemarksAction({ type: 'lock', ids: unlocked });
    setShowRemarksModal(true);
  };

  const handleBulkUnlock = () => {
    const locked = selectedRows.filter((id) => {
      const p = payslipData.find((x) => x.id === id);
      return p && p.locked && !p.released;
    });

    if (locked.length === 0) {
      addNotification('warning', 'No locked (unreleased) payslips selected');
      return;
    }

    setRemarksAction({ type: 'unlock', ids: locked });
    setShowRemarksModal(true);
  };

  const handleBulkRelease = () => {
    const lockedNotReleased = selectedRows.filter((id) => {
      const p = payslipData.find((x) => x.id === id);
      return p && p.locked && !p.released;
    });

    if (lockedNotReleased.length === 0) {
      addNotification('warning', 'No locked payslips available for release');
      return;
    }

    setRemarksAction({ type: 'release', ids: lockedNotReleased });
    setShowRemarksModal(true);
  };

  const handleBulkRevoke = () => {
    const released = selectedRows.filter((id) => {
      const p = payslipData.find((x) => x.id === id);
      return p && p.released;
    });

    if (released.length === 0) {
      addNotification('warning', 'No released payslips selected');
      return;
    }

    setRemarksAction({ type: 'revoke', ids: released });
    setShowRemarksModal(true);
  };

  // View Payslip
  const handleViewPayslip = (payslip: PayslipData) => {
    setSelectedPayslip(payslip);
    setShowViewModal(true);
  };

  // Download Payslip
  const handleDownloadPayslip = useCallback((payslip: PayslipData) => {
    generatePayslipPDF(payslip);
    setPayslipData((prev) =>
    prev.map((p) =>
    p.id === payslip.id ?
    {
      ...p,
      downloadCount: p.downloadCount + 1,
      lastDownloadAt: new Date()
    } :
    p
    )
    );
    addAuditLog(payslip.id, 'Downloaded', '');
    addNotification('success', `Payslip downloaded for ${payslip.empName}`);
  }, [addNotification, addAuditLog]);

  // Print Payslip
  const handlePrintPayslip = useCallback((payslip: PayslipData) => {
    window.print();
    addNotification('info', 'Print dialog opened');
  }, [addNotification]);

  // Email Payslip
  const handleEmailPayslip = useCallback((payslip: PayslipData) => {
    setSelectedPayslip(payslip);
    setShowViewModal(false);
    setShowEmailModal(true);
  }, []);

  // Send Emails
  const handleSendEmails = useCallback((emails: string[], subject: string, message: string) => {
    const payslipsToEmail = selectedRows.length > 0 ?
    payslipData.filter((p) => selectedRows.includes(p.id) && p.released) :
    selectedPayslip ?
    [selectedPayslip] :
    [];

    payslipsToEmail.forEach((p) => {
      setPayslipData((prev) =>
      prev.map((x) =>
      x.id === p.id ?
      {
        ...x,
        emailSent: true,
        emailSentAt: new Date()
      } :
      x
      )
      );
      addAuditLog(p.id, 'Email Sent', `Sent to ${p.email}`);
    });

    addNotification('success', `Email sent to ${payslipsToEmail.length} employee(s)`);
    setSelectedRows([]);
  }, [selectedRows, payslipData, selectedPayslip, addNotification, addAuditLog]);

  // Bulk Email
  const handleBulkEmail = () => {
    const releasedSelected = payslipData.filter(
      (p) => selectedRows.includes(p.id) && p.released
    );

    if (releasedSelected.length === 0) {
      addNotification('warning', 'No released payslips selected for email');
      return;
    }

    setShowEmailModal(true);
  };

  // Export
  const handleExport = () => {
    const dataToExport = selectedRows.length > 0 ?
    payslipData.filter((p) => selectedRows.includes(p.id)) :
    filteredData;

    const csvContent = [
    ['Emp Code', 'Employee Name', 'Department', 'Designation', 'Gross Salary', 'Deductions', 'Net Salary', 'Status', 'Locked', 'Released'].join(','),
    ...dataToExport.map((p) =>
    [
    p.empCode,
    p.empName,
    p.department,
    p.designation,
    p.grossSalary,
    p.totalDeductions,
    p.netSalary,
    p.payslipStatus,
    p.locked ? 'Yes' : 'No',
    p.released ? 'Yes' : 'No'].
    join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslips-${filters.month.replace(' ', '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('success', `Exported ${dataToExport.length} payslip records`);
  };

  // Refresh
  const handleRefresh = () => {
    setFilters({
      month: 'May 2025',
      payrollType: 'all',
      department: 'all',
      payslipStatus: 'all',
      search: ''
    });
    setSortConfig(null);
    setSelectedRows([]);
    setCurrentPage(1);
    addNotification('info', 'Data refreshed');
  };

  // Badge Renderers
  const getPayslipStatusBadge = (status: PayslipStatus) => {
    const variants: Record<PayslipStatus, 'success' | 'warning' | 'secondary' | 'error'> = {
      Released: 'success',
      Locked: 'warning',
      Draft: 'secondary',
      Revoked: 'error'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPayrollStatusBadge = (status: PayrollStatus) => {
    const variants: Record<PayrollStatus, 'info' | 'success' | 'warning' | 'secondary'> = {
      Finalized: 'success',
      Approved: 'success',
      Processed: 'info',
      Pending: 'warning'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Selected payslips for email modal
  const selectedPayslipsForEmail = useMemo(() => {
    if (selectedPayslip) return [selectedPayslip];
    return payslipData.filter((p) => selectedRows.includes(p.id) && p.released);
  }, [selectedPayslip, payslipData, selectedRows]);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Payslip Lock & Release</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage payslip locking and release for employee access
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                onClick={handleRefresh}>

                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={handleExport}>

                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <Select
              value={filters.month}
              onChange={(val) => setFilters({ ...filters, month: val as string })}
              options={[
              { value: 'all', label: 'All Months' },
              ...MONTHS]
              }
              className="w-40" />

            <Select
              value={filters.payrollType}
              onChange={(val) => setFilters({ ...filters, payrollType: val as string })}
              options={[
              { value: 'all', label: 'All Types' },
              { value: 'regular', label: 'Regular' },
              { value: 'supplementary', label: 'Supplementary' },
              { value: 'arrear', label: 'Arrear' }]
              }
              className="w-44" />

            <Select
              value={filters.department}
              onChange={(val) => setFilters({ ...filters, department: val as string })}
              options={[
              { value: 'all', label: 'All Departments' },
              ...DEPARTMENTS]
              }
              className="w-48" />

            <Select
              value={filters.payslipStatus}
              onChange={(val) => setFilters({ ...filters, payslipStatus: val as string })}
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Locked', label: 'Locked' },
              { value: 'Released', label: 'Released' }]
              }
              className="w-36" />

            <Input
              placeholder="Search employee..."
              leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="md:w-56" />

          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 no-print">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Employees</div>
            <div className="text-2xl font-bold text-slate-900">{summaryStats.total}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Draft</div>
            <div className="text-2xl font-bold text-slate-600">{summaryStats.draft}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-xs text-amber-600 uppercase tracking-wide mb-1">Locked</div>
            <div className="text-2xl font-bold text-amber-900">{summaryStats.locked}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Released</div>
            <div className="text-2xl font-bold text-emerald-900">{summaryStats.released}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-xs text-indigo-600 uppercase tracking-wide mb-1">Total Amount</div>
            <div className="text-xl font-bold text-indigo-900">{formatCurrency(summaryStats.totalAmount)}</div>
          </div>
        </div>

        {/* Quick Actions */}
        {selectedRows.length > 0 &&
        <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg mb-4 no-print">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                {selectedRows.length} selected
              </span>
            </div>
            <div className="h-5 w-px bg-indigo-200" />
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" leftIcon={<LockIcon className="w-3 h-3" />} onClick={handleBulkLock}>
                Lock
              </Button>
              <Button variant="outline" size="sm" leftIcon={<UnlockIcon className="w-3 h-3" />} onClick={handleBulkUnlock}>
                Unlock
              </Button>
              <Button variant="outline" size="sm" leftIcon={<CheckCircleIcon className="w-3 h-3" />} onClick={handleBulkRelease}>
                Release
              </Button>
              <Button variant="outline" size="sm" leftIcon={<RotateCcwIcon className="w-3 h-3" />} onClick={handleBulkRevoke}>
                Revoke
              </Button>
              <Button variant="outline" size="sm" leftIcon={<MailIcon className="w-3 h-3" />} onClick={handleBulkEmail}>
                Email
              </Button>
              <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="w-3 h-3" />} onClick={handleExport}>
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

        {/* Main Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 no-print">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300" />

                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('empName')}>

                    <div className="flex items-center gap-1">
                      Employee
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
                    onClick={() => handleSort('netSalary')}>

                    <div className="flex items-center justify-end gap-1">
                      Net Salary
                      {sortConfig?.key === 'netSalary' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Payroll Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Payslip Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center no-print">
                    Lock
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center no-print">
                    Release
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
                  selectedRows.includes(row.id) ? 'bg-indigo-50' : ''}`
                  }>

                      <td className="py-3 px-4 no-print">
                        <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300" />

                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{row.empName}</div>
                        <div className="text-xs text-slate-500">{row.empCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-600">{row.department}</div>
                        <div className="text-xs text-slate-400">{row.designation}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {formatCurrency(row.netSalary)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getPayrollStatusBadge(row.payrollStatus)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getPayslipStatusBadge(row.payslipStatus)}
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={row.locked}
                        onChange={() => handleToggleLock(row)}
                        className="sr-only peer"
                        disabled={row.released} />

                          <div
                        className={`w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 ${
                        row.released ? 'opacity-50 cursor-not-allowed' : ''}`
                        } />

                        </label>
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={row.released}
                        onChange={() => handleToggleRelease(row)}
                        className="sr-only peer"
                        disabled={!row.locked} />

                          <div
                        className={`w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 ${
                        !row.locked ? 'opacity-50 cursor-not-allowed' : ''}`
                        } />

                        </label>
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleViewPayslip(row)}
                        title="View Payslip">

                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleDownloadPayslip(row)}
                        title="Download Payslip">

                            <DownloadIcon className="w-4 h-4" />
                          </button>
                          {row.released &&
                      <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => handleEmailPayslip(row)}
                        title="Email Payslip">

                              <MailIcon className="w-4 h-4" />
                            </button>
                      }
                        </div>
                      </td>
                    </tr>
                ) :

                <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">No payslips found</p>
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
        </div>
      </div>

      {/* Modals */}
      <ViewPayslipModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedPayslip(null);
        }}
        payslip={selectedPayslip}
        onDownload={handleDownloadPayslip}
        onEmail={handleEmailPayslip}
        onPrint={handlePrintPayslip} />


      <RemarksModal
        isOpen={showRemarksModal}
        onClose={() => {
          setShowRemarksModal(false);
          setRemarksAction(null);
        }}
        onSubmit={handleRemarksSubmit}
        title={
        remarksAction?.type === 'lock' ?
        'Lock Payslip(s)' :
        remarksAction?.type === 'unlock' ?
        'Unlock Payslip(s)' :
        remarksAction?.type === 'release' ?
        'Release Payslip(s)' :
        'Revoke Payslip(s)'
        }
        actionLabel={
        remarksAction?.type === 'lock' ?
        `Lock ${remarksAction.ids.length} Payslip(s)` :
        remarksAction?.type === 'unlock' ?
        `Unlock ${remarksAction?.ids.length} Payslip(s)` :
        remarksAction?.type === 'release' ?
        `Release ${remarksAction?.ids.length} Payslip(s)` :
        `Revoke ${remarksAction?.ids.length} Payslip(s)`
        } />


      <EmailModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedPayslip(null);
        }}
        onSend={handleSendEmails}
        selectedPayslips={selectedPayslipsForEmail} />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}