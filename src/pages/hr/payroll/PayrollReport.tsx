import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  RefreshCwIcon,
  PrinterIcon,
  MailIcon,
  SaveIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
  EyeIcon,
  Trash2Icon,
  CopyIcon,
  ShareIcon,
  BarChart3Icon,
  PieChartIcon,
  TrendingUpIcon,
  UsersIcon,
  BuildingIcon,
  DollarSignIcon,
  FileSpreadsheetIcon,
  BookmarkIcon,
  HistoryIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  TableIcon,
  LayoutGridIcon,
  Settings2Icon,
  SendIcon,
  PlusIcon,
  StarIcon,
  FolderIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
type ReportType =
'monthly-summary' |
'detailed-register' |
'department-wise' |
'component-wise' |
'deduction-summary' |
'bank-transfer' |
'tax-report' |
'comparative' |
'pf-report' |
'esi-report' |
'attendance-payroll' |
'variance-report';

type ExportFormat = 'pdf' | 'excel' | 'csv';
type ReportStatus = 'generated' | 'scheduled' | 'processing' | 'failed';

interface ReportConfig {
  reportType: ReportType;
  financialYear: string;
  fromMonth: string;
  toMonth: string;
  department: string;
  employeeType: string;
  includeDeductions: boolean;
  includeContributions: boolean;
  includeInactive: boolean;
  groupBy: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface EmployeePayrollData {
  id: string;
  empCode: string;
  empName: string;
  department: string;
  designation: string;
  employeeType: string;
  bankAccount: string;
  bankName: string;
  ifscCode: string;
  panNumber: string;
  pfNumber: string;
  esiNumber: string;
  basicSalary: number;
  hra: number;
  da: number;
  ta: number;
  specialAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  tds: number;
  professionalTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  employerPf: number;
  employerEsi: number;
  workingDays: number;
  presentDays: number;
  lopDays: number;
  overtimeHours: number;
  overtimePay: number;
}

interface DepartmentSummary {
  department: string;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  avgSalary: number;
  totalPf: number;
  totalEsi: number;
  totalTds: number;
}

interface ComponentSummary {
  component: string;
  type: 'earning' | 'deduction';
  totalAmount: number;
  employeeCount: number;
  avgAmount: number;
  percentageOfTotal: number;
}

interface MonthlyTrend {
  month: string;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  newJoiners: number;
  exits: number;
}

interface GeneratedReport {
  id: string;
  config: ReportConfig;
  generatedAt: Date;
  generatedBy: string;
  status: ReportStatus;
  data: any;
  summary: ReportSummary;
  fileName: string;
}

interface ReportSummary {
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  totalEmployerContributions: number;
  avgSalary: number;
  highestSalary: number;
  lowestSalary: number;
  departmentCount: number;
}

interface SavedTemplate {
  id: string;
  name: string;
  config: ReportConfig;
  createdAt: Date;
  createdBy: string;
  isDefault: boolean;
}

interface ScheduledReport {
  id: string;
  name: string;
  config: ReportConfig;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: Date;
  recipients: string[];
  format: ExportFormat;
  isActive: boolean;
  createdAt: Date;
}

interface ReportHistory {
  id: string;
  reportType: ReportType;
  config: ReportConfig;
  generatedAt: Date;
  generatedBy: string;
  status: ReportStatus;
  downloadCount: number;
  fileName: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Constants & Initial Data
// ---------------------------------------------------------------------------
const REPORT_TYPES: {value: ReportType;label: string;description: string;}[] = [
{ value: 'monthly-summary', label: 'Monthly Payroll Summary', description: 'Overview of monthly payroll with totals' },
{ value: 'detailed-register', label: 'Detailed Salary Register', description: 'Complete employee-wise salary details' },
{ value: 'department-wise', label: 'Department-wise Analysis', description: 'Payroll breakdown by department' },
{ value: 'component-wise', label: 'Component-wise Breakdown', description: 'Analysis of each salary component' },
{ value: 'deduction-summary', label: 'Deduction Summary', description: 'Summary of all deductions' },
{ value: 'bank-transfer', label: 'Bank Transfer Report', description: 'Bank-wise salary transfer details' },
{ value: 'tax-report', label: 'Tax Deduction Report', description: 'TDS and professional tax report' },
{ value: 'comparative', label: 'Comparative Analysis', description: 'Month-over-month comparison' },
{ value: 'pf-report', label: 'PF Contribution Report', description: 'Provident Fund details' },
{ value: 'esi-report', label: 'ESI Contribution Report', description: 'ESI contribution details' },
{ value: 'attendance-payroll', label: 'Attendance-Payroll Report', description: 'Attendance impact on payroll' },
{ value: 'variance-report', label: 'Variance Report', description: 'Salary variance analysis' }];


const FINANCIAL_YEARS = [
{ value: '2025-26', label: '2025-26' },
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


const MONTHS = [
{ value: 'April 2025', label: 'April 2025' },
{ value: 'May 2025', label: 'May 2025' },
{ value: 'June 2025', label: 'June 2025' },
{ value: 'July 2025', label: 'July 2025' },
{ value: 'August 2025', label: 'August 2025' },
{ value: 'September 2025', label: 'September 2025' },
{ value: 'October 2025', label: 'October 2025' },
{ value: 'November 2025', label: 'November 2025' },
{ value: 'December 2025', label: 'December 2025' },
{ value: 'January 2026', label: 'January 2026' },
{ value: 'February 2026', label: 'February 2026' },
{ value: 'March 2026', label: 'March 2026' }];


const DEPARTMENTS = [
{ value: 'teaching', label: 'Teaching' },
{ value: 'administration', label: 'Administration' },
{ value: 'it', label: 'IT Department' },
{ value: 'finance', label: 'Finance' },
{ value: 'hr', label: 'Human Resources' },
{ value: 'support', label: 'Support Staff' },
{ value: 'marketing', label: 'Marketing' },
{ value: 'operations', label: 'Operations' }];


const EMPLOYEE_TYPES = [
{ value: 'permanent', label: 'Permanent' },
{ value: 'contract', label: 'Contract' },
{ value: 'temporary', label: 'Temporary' },
{ value: 'probation', label: 'Probation' },
{ value: 'intern', label: 'Intern' }];


const GROUP_BY_OPTIONS = [
{ value: 'none', label: 'No Grouping' },
{ value: 'department', label: 'Department' },
{ value: 'designation', label: 'Designation' },
{ value: 'employeeType', label: 'Employee Type' },
{ value: 'bank', label: 'Bank' }];


const SORT_BY_OPTIONS = [
{ value: 'empName', label: 'Employee Name' },
{ value: 'empCode', label: 'Employee Code' },
{ value: 'department', label: 'Department' },
{ value: 'netSalary', label: 'Net Salary' },
{ value: 'grossSalary', label: 'Gross Salary' }];


// Sample Employee Payroll Data
const SAMPLE_PAYROLL_DATA: EmployeePayrollData[] = [
{
  id: '1',
  empCode: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'Teaching',
  designation: 'Senior Teacher',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-1234',
  bankName: 'State Bank of India',
  ifscCode: 'SBIN0001234',
  panNumber: 'ABCDE1234F',
  pfNumber: 'PF/DEL/12345',
  esiNumber: 'ESI/DEL/12345',
  basicSalary: 25000,
  hra: 10000,
  da: 5000,
  ta: 3000,
  specialAllowance: 2000,
  otherAllowances: 0,
  grossSalary: 45000,
  pfDeduction: 3000,
  esiDeduction: 800,
  tds: 2100,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 6100,
  netSalary: 38900,
  employerPf: 3250,
  employerEsi: 975,
  workingDays: 26,
  presentDays: 24,
  lopDays: 2,
  overtimeHours: 0,
  overtimePay: 0
},
{
  id: '2',
  empCode: 'EMP002',
  empName: 'Priya Sharma',
  department: 'Administration',
  designation: 'Admin Manager',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-2345',
  bankName: 'HDFC Bank',
  ifscCode: 'HDFC0001234',
  panNumber: 'BCDEF2345G',
  pfNumber: 'PF/DEL/12346',
  esiNumber: 'ESI/DEL/12346',
  basicSalary: 22000,
  hra: 8800,
  da: 4400,
  ta: 2500,
  specialAllowance: 0,
  otherAllowances: 0,
  grossSalary: 37700,
  pfDeduction: 2640,
  esiDeduction: 660,
  tds: 1880,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 5380,
  netSalary: 32320,
  employerPf: 2860,
  employerEsi: 807,
  workingDays: 26,
  presentDays: 26,
  lopDays: 0,
  overtimeHours: 4,
  overtimePay: 800
},
{
  id: '3',
  empCode: 'EMP003',
  empName: 'Amit Patel',
  department: 'IT Department',
  designation: 'System Administrator',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-3456',
  bankName: 'ICICI Bank',
  ifscCode: 'ICIC0001234',
  panNumber: 'CDEFG3456H',
  pfNumber: 'PF/DEL/12347',
  esiNumber: 'ESI/DEL/12347',
  basicSalary: 30000,
  hra: 12000,
  da: 6000,
  ta: 3500,
  specialAllowance: 4000,
  otherAllowances: 0,
  grossSalary: 55500,
  pfDeduction: 3600,
  esiDeduction: 900,
  tds: 3020,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 7720,
  netSalary: 47780,
  employerPf: 3900,
  employerEsi: 1188,
  workingDays: 26,
  presentDays: 25,
  lopDays: 1,
  overtimeHours: 8,
  overtimePay: 2000
},
{
  id: '4',
  empCode: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'Finance',
  designation: 'Accountant',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-4567',
  bankName: 'Axis Bank',
  ifscCode: 'UTIB0001234',
  panNumber: 'DEFGH4567I',
  pfNumber: 'PF/DEL/12348',
  esiNumber: 'ESI/DEL/12348',
  basicSalary: 24000,
  hra: 9600,
  da: 4800,
  ta: 2800,
  specialAllowance: 0,
  otherAllowances: 0,
  grossSalary: 41200,
  pfDeduction: 2880,
  esiDeduction: 720,
  tds: 2420,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 6220,
  netSalary: 34980,
  employerPf: 3120,
  employerEsi: 882,
  workingDays: 26,
  presentDays: 26,
  lopDays: 0,
  overtimeHours: 0,
  overtimePay: 0
},
{
  id: '5',
  empCode: 'EMP005',
  empName: 'Vikram Singh',
  department: 'Support Staff',
  designation: 'Facility Manager',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-5678',
  bankName: 'Punjab National Bank',
  ifscCode: 'PUNB0001234',
  panNumber: 'EFGHI5678J',
  pfNumber: 'PF/DEL/12349',
  esiNumber: 'ESI/DEL/12349',
  basicSalary: 18000,
  hra: 7200,
  da: 3600,
  ta: 2000,
  specialAllowance: 0,
  otherAllowances: 0,
  grossSalary: 30800,
  pfDeduction: 2160,
  esiDeduction: 540,
  tds: 1060,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 3960,
  netSalary: 26840,
  employerPf: 2340,
  employerEsi: 659,
  workingDays: 26,
  presentDays: 24,
  lopDays: 2,
  overtimeHours: 12,
  overtimePay: 1800
},
{
  id: '6',
  empCode: 'EMP006',
  empName: 'Kavita Joshi',
  department: 'Human Resources',
  designation: 'HR Executive',
  employeeType: 'Probation',
  bankAccount: 'XXXX-XXXX-6789',
  bankName: 'Bank of Baroda',
  ifscCode: 'BARB0001234',
  panNumber: 'FGHIJ6789K',
  pfNumber: 'PF/DEL/12350',
  esiNumber: 'ESI/DEL/12350',
  basicSalary: 20000,
  hra: 8000,
  da: 4000,
  ta: 2500,
  specialAllowance: 0,
  otherAllowances: 0,
  grossSalary: 34500,
  pfDeduction: 2400,
  esiDeduction: 600,
  tds: 1300,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 4500,
  netSalary: 30000,
  employerPf: 2600,
  employerEsi: 738,
  workingDays: 26,
  presentDays: 25,
  lopDays: 1,
  overtimeHours: 0,
  overtimePay: 0
},
{
  id: '7',
  empCode: 'EMP007',
  empName: 'Rahul Mehta',
  department: 'Marketing',
  designation: 'Marketing Manager',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-7890',
  bankName: 'Kotak Mahindra Bank',
  ifscCode: 'KKBK0001234',
  panNumber: 'GHIJK7890L',
  pfNumber: 'PF/DEL/12351',
  esiNumber: 'ESI/DEL/12351',
  basicSalary: 28000,
  hra: 11200,
  da: 5600,
  ta: 3200,
  specialAllowance: 5000,
  otherAllowances: 0,
  grossSalary: 53000,
  pfDeduction: 3360,
  esiDeduction: 840,
  tds: 2800,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 7200,
  netSalary: 45800,
  employerPf: 3640,
  employerEsi: 1134,
  workingDays: 26,
  presentDays: 26,
  lopDays: 0,
  overtimeHours: 6,
  overtimePay: 1500
},
{
  id: '8',
  empCode: 'EMP008',
  empName: 'Anita Desai',
  department: 'Teaching',
  designation: 'Principal',
  employeeType: 'Permanent',
  bankAccount: 'XXXX-XXXX-8901',
  bankName: 'Canara Bank',
  ifscCode: 'CNRB0001234',
  panNumber: 'HIJKL8901M',
  pfNumber: 'PF/DEL/12352',
  esiNumber: '',
  basicSalary: 45000,
  hra: 18000,
  da: 9000,
  ta: 5000,
  specialAllowance: 8000,
  otherAllowances: 0,
  grossSalary: 85000,
  pfDeduction: 5400,
  esiDeduction: 0,
  tds: 8400,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 14000,
  netSalary: 71000,
  employerPf: 5850,
  employerEsi: 0,
  workingDays: 26,
  presentDays: 26,
  lopDays: 0,
  overtimeHours: 0,
  overtimePay: 0
},
{
  id: '9',
  empCode: 'EMP009',
  empName: 'Suresh Kumar',
  department: 'IT Department',
  designation: 'Software Developer',
  employeeType: 'Contract',
  bankAccount: 'XXXX-XXXX-9012',
  bankName: 'State Bank of India',
  ifscCode: 'SBIN0002345',
  panNumber: 'IJKLM9012N',
  pfNumber: '',
  esiNumber: 'ESI/DEL/12353',
  basicSalary: 35000,
  hra: 14000,
  da: 7000,
  ta: 4000,
  specialAllowance: 5000,
  otherAllowances: 0,
  grossSalary: 65000,
  pfDeduction: 0,
  esiDeduction: 1100,
  tds: 4500,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 5800,
  netSalary: 59200,
  employerPf: 0,
  employerEsi: 1391,
  workingDays: 26,
  presentDays: 24,
  lopDays: 2,
  overtimeHours: 10,
  overtimePay: 3500
},
{
  id: '10',
  empCode: 'EMP010',
  empName: 'Meera Patel',
  department: 'Administration',
  designation: 'Receptionist',
  employeeType: 'Temporary',
  bankAccount: 'XXXX-XXXX-0123',
  bankName: 'HDFC Bank',
  ifscCode: 'HDFC0002345',
  panNumber: 'JKLMN0123O',
  pfNumber: '',
  esiNumber: 'ESI/DEL/12354',
  basicSalary: 15000,
  hra: 6000,
  da: 3000,
  ta: 2000,
  specialAllowance: 0,
  otherAllowances: 0,
  grossSalary: 26000,
  pfDeduction: 0,
  esiDeduction: 450,
  tds: 0,
  professionalTax: 200,
  otherDeductions: 0,
  totalDeductions: 650,
  netSalary: 25350,
  employerPf: 0,
  employerEsi: 556,
  workingDays: 26,
  presentDays: 23,
  lopDays: 3,
  overtimeHours: 0,
  overtimePay: 0
}];


// Sample Saved Templates
const INITIAL_TEMPLATES: SavedTemplate[] = [
{
  id: '1',
  name: 'Monthly Summary - All Departments',
  config: {
    reportType: 'monthly-summary',
    financialYear: '2024-25',
    fromMonth: 'April 2025',
    toMonth: 'April 2025',
    department: '',
    employeeType: '',
    includeDeductions: true,
    includeContributions: true,
    includeInactive: false,
    groupBy: 'department',
    sortBy: 'empName',
    sortOrder: 'asc'
  },
  createdAt: new Date('2025-01-15'),
  createdBy: 'Admin',
  isDefault: true
},
{
  id: '2',
  name: 'Bank Transfer - Teaching',
  config: {
    reportType: 'bank-transfer',
    financialYear: '2024-25',
    fromMonth: 'May 2025',
    toMonth: 'May 2025',
    department: 'teaching',
    employeeType: '',
    includeDeductions: false,
    includeContributions: false,
    includeInactive: false,
    groupBy: 'bank',
    sortBy: 'empName',
    sortOrder: 'asc'
  },
  createdAt: new Date('2025-02-10'),
  createdBy: 'Finance Manager',
  isDefault: false
}];


// Sample Report History
const INITIAL_REPORT_HISTORY: ReportHistory[] = [
{
  id: '1',
  reportType: 'monthly-summary',
  config: {
    reportType: 'monthly-summary',
    financialYear: '2024-25',
    fromMonth: 'April 2025',
    toMonth: 'April 2025',
    department: '',
    employeeType: '',
    includeDeductions: true,
    includeContributions: true,
    includeInactive: false,
    groupBy: 'none',
    sortBy: 'empName',
    sortOrder: 'asc'
  },
  generatedAt: new Date('2025-05-01'),
  generatedBy: 'Admin',
  status: 'generated',
  downloadCount: 3,
  fileName: 'monthly-summary-apr-2025.pdf'
},
{
  id: '2',
  reportType: 'bank-transfer',
  config: {
    reportType: 'bank-transfer',
    financialYear: '2024-25',
    fromMonth: 'April 2025',
    toMonth: 'April 2025',
    department: '',
    employeeType: '',
    includeDeductions: false,
    includeContributions: false,
    includeInactive: false,
    groupBy: 'bank',
    sortBy: 'empName',
    sortOrder: 'asc'
  },
  generatedAt: new Date('2025-05-02'),
  generatedBy: 'Finance Manager',
  status: 'generated',
  downloadCount: 5,
  fileName: 'bank-transfer-apr-2025.xlsx'
}];


// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------
const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
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

const getReportTypeLabel = (type: ReportType): string => {
  return REPORT_TYPES.find((rt) => rt.value === type)?.label || type;
};

const generateReportFileName = (type: ReportType, month: string, format: ExportFormat): string => {
  const sanitizedMonth = month.toLowerCase().replace(' ', '-');
  return `${type}-${sanitizedMonth}.${format}`;
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
// Save Template Modal
// ---------------------------------------------------------------------------
interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, isDefault: boolean) => void;
  config: ReportConfig;
}

function SaveTemplateModal({ isOpen, onClose, onSave, config }: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), isDefault);
      setName('');
      setIsDefault(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Report Template" size="sm">
      <div className="space-y-4">
        <Input
          label="Template Name"
          placeholder="Enter template name"
          value={name}
          onChange={(e) => setName(e.target.value)} />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded" />

          <span className="text-sm text-slate-700">Set as default template</span>
        </label>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 font-medium mb-2">Configuration Summary</p>
          <div className="text-xs text-slate-600 space-y-1">
            <p>Report: {getReportTypeLabel(config.reportType)}</p>
            <p>Period: {config.fromMonth} - {config.toMonth}</p>
            <p>Department: {config.department || 'All'}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
            <SaveIcon className="w-4 h-4 mr-1" /> Save Template
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Schedule Report Modal
// ---------------------------------------------------------------------------
interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (schedule: Omit<ScheduledReport, 'id' | 'createdAt'>) => void;
  config: ReportConfig;
}

function ScheduleReportModal({ isOpen, onClose, onSchedule, config }: ScheduleReportModalProps) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [recipients, setRecipients] = useState('');
  const [format, setFormat] = useState<ExportFormat>('pdf');

  const handleSchedule = () => {
    if (name.trim() && recipients.trim()) {
      const nextRun = new Date();
      if (frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (frequency === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
      } else {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }

      onSchedule({
        name: name.trim(),
        config,
        frequency,
        nextRun,
        recipients: recipients.split(',').map((r) => r.trim()),
        format,
        isActive: true
      });
      setName('');
      setRecipients('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Report" size="md">
      <div className="space-y-4">
        <Input
          label="Schedule Name"
          placeholder="Enter schedule name"
          value={name}
          onChange={(e) => setName(e.target.value)} />

        <Select
          label="Frequency"
          value={frequency}
          onChange={(val) => setFrequency(val as typeof frequency)}
          options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }]
          } />

        <Select
          label="Export Format"
          value={format}
          onChange={(val) => setFormat(val as ExportFormat)}
          options={[
          { value: 'pdf', label: 'PDF' },
          { value: 'excel', label: 'Excel' },
          { value: 'csv', label: 'CSV' }]
          } />

        <Textarea
          label="Recipients (comma-separated emails)"
          placeholder="email1@example.com, email2@example.com"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          rows={2} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSchedule} disabled={!name.trim() || !recipients.trim()}>
            <ClockIcon className="w-4 h-4 mr-1" /> Schedule Report
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
  reportType: ReportType;
}

function EmailReportModal({ isOpen, onClose, onSend, reportType }: EmailReportModalProps) {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState(`Payroll Report: ${getReportTypeLabel(reportType)}`);
  const [message, setMessage] = useState(
    'Please find attached the requested payroll report.\n\nRegards,\nPayroll Team'
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
    <Modal isOpen={isOpen} onClose={onClose} title="Email Report" size="md">
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
          rows={4} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={!emails.trim()}>
            <SendIcon className="w-4 h-4 mr-1" /> Send Email
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Report History Modal
// ---------------------------------------------------------------------------
interface ReportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReportHistory[];
  onDownload: (report: ReportHistory, format: ExportFormat) => void;
  onDelete: (reportId: string) => void;
  onRegenerate: (config: ReportConfig) => void;
}

function ReportHistoryModal({
  isOpen,
  onClose,
  history,
  onDownload,
  onDelete,
  onRegenerate
}: ReportHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report History" size="lg">
      <div className="space-y-4">
        {history.length > 0 ?
        <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-600">Report</th>
                  <th className="text-left p-3 font-medium text-slate-600">Generated</th>
                  <th className="text-left p-3 font-medium text-slate-600">By</th>
                  <th className="text-center p-3 font-medium text-slate-600">Downloads</th>
                  <th className="text-center p-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((report) =>
              <tr key={report.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-medium text-slate-900">
                        {getReportTypeLabel(report.reportType)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {report.config.fromMonth} - {report.config.toMonth}
                      </p>
                    </td>
                    <td className="p-3 text-slate-600">
                      {formatDateTime(report.generatedAt)}
                    </td>
                    <td className="p-3 text-slate-600">{report.generatedBy}</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary">{report.downloadCount}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      onClick={() => onDownload(report, 'pdf')}
                      title="Download PDF">

                          <DownloadIcon className="w-4 h-4" />
                        </button>
                        <button
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      onClick={() => onRegenerate(report.config)}
                      title="Regenerate">

                          <RefreshCwIcon className="w-4 h-4" />
                        </button>
                        <button
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      onClick={() => onDelete(report.id)}
                      title="Delete">

                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div> :

        <div className="text-center py-8 text-slate-500">
            <HistoryIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No report history available</p>
          </div>
        }
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Saved Templates Modal
// ---------------------------------------------------------------------------
interface SavedTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: SavedTemplate[];
  onApply: (config: ReportConfig) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

function SavedTemplatesModal({
  isOpen,
  onClose,
  templates,
  onApply,
  onDelete,
  onSetDefault
}: SavedTemplatesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saved Templates" size="md">
      <div className="space-y-4">
        {templates.length > 0 ?
        <div className="space-y-2 max-h-80 overflow-auto">
            {templates.map((template) =>
          <div
            key={template.id}
            className={`p-4 border rounded-lg ${
            template.isDefault ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200'}`
            }>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{template.name}</p>
                      {template.isDefault &&
                  <Badge variant="info" className="text-xs">Default</Badge>
                  }
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {getReportTypeLabel(template.config.reportType)} • {template.config.fromMonth}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Created by {template.createdBy} on {formatDate(template.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                  className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                  onClick={() => onSetDefault(template.id)}
                  title="Set as Default">

                      <StarIcon className={`w-4 h-4 ${template.isDefault ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </button>
                    <button
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  onClick={() => onDelete(template.id)}
                  title="Delete">

                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                onApply(template.config);
                onClose();
              }}>

                  Apply Template
                </Button>
              </div>
          )}
          </div> :

        <div className="text-center py-8 text-slate-500">
            <BookmarkIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No saved templates</p>
          </div>
        }
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Report Preview Components
// ---------------------------------------------------------------------------
interface ReportPreviewProps {
  report: GeneratedReport | null;
  viewMode: 'table' | 'summary';
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  onEmail: () => void;
}

function ReportPreview({
  report,
  viewMode,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onPrint,
  onEmail
}: ReportPreviewProps) {
  if (!report) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Generated</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Configure your report parameters above and click "Generate Report" to view the results.
            You can export the report in PDF, Excel, or CSV format.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />} disabled>
              Export PDF
            </Button>
            <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />} disabled>
              Export Excel
            </Button>
          </div>
        </div>
      </div>);

  }

  const data = report.data as EmployeePayrollData[];
  const summary = report.summary;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Report Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {getReportTypeLabel(report.config.reportType)}
            </h3>
            <p className="text-sm text-slate-500">
              {report.config.fromMonth} - {report.config.toMonth} • Generated: {formatDateTime(report.generatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={onExportPDF}>
              PDF
            </Button>
            <Button variant="outline" size="sm" leftIcon={<FileSpreadsheetIcon className="w-4 h-4" />} onClick={onExportExcel}>
              Excel
            </Button>
            <Button variant="outline" size="sm" leftIcon={<TableIcon className="w-4 h-4" />} onClick={onExportCSV}>
              CSV
            </Button>
            <Button variant="outline" size="sm" leftIcon={<PrinterIcon className="w-4 h-4" />} onClick={onPrint}>
              Print
            </Button>
            <Button variant="outline" size="sm" leftIcon={<MailIcon className="w-4 h-4" />} onClick={onEmail}>
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Employees</p>
            <p className="text-xl font-bold text-slate-900">{summary.totalEmployees}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Gross Salary</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(summary.totalGrossSalary)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Deductions</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Net Salary</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalNetSalary)}</p>
          </div>
        </div>
      </div>

      {/* Report Data */}
      {viewMode === 'table' ?
      <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0">
              <tr>
                <th className="text-left p-3 font-medium text-slate-600">Emp Code</th>
                <th className="text-left p-3 font-medium text-slate-600">Employee Name</th>
                <th className="text-left p-3 font-medium text-slate-600">Department</th>
                <th className="text-right p-3 font-medium text-slate-600">Basic</th>
                <th className="text-right p-3 font-medium text-slate-600">HRA</th>
                <th className="text-right p-3 font-medium text-slate-600">DA</th>
                <th className="text-right p-3 font-medium text-slate-600">Gross</th>
                {report.config.includeDeductions &&
              <>
                    <th className="text-right p-3 font-medium text-slate-600">PF</th>
                    <th className="text-right p-3 font-medium text-slate-600">ESI</th>
                    <th className="text-right p-3 font-medium text-slate-600">TDS</th>
                    <th className="text-right p-3 font-medium text-slate-600">Total Ded.</th>
                  </>
              }
                <th className="text-right p-3 font-medium text-slate-600">Net Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((emp) =>
            <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-600">{emp.empCode}</td>
                  <td className="p-3 font-medium text-slate-900">{emp.empName}</td>
                  <td className="p-3 text-slate-600">{emp.department}</td>
                  <td className="p-3 text-right text-slate-600">{formatCurrency(emp.basicSalary)}</td>
                  <td className="p-3 text-right text-slate-600">{formatCurrency(emp.hra)}</td>
                  <td className="p-3 text-right text-slate-600">{formatCurrency(emp.da)}</td>
                  <td className="p-3 text-right font-medium text-slate-900">{formatCurrency(emp.grossSalary)}</td>
                  {report.config.includeDeductions &&
              <>
                      <td className="p-3 text-right text-red-600">{formatCurrency(emp.pfDeduction)}</td>
                      <td className="p-3 text-right text-red-600">{formatCurrency(emp.esiDeduction)}</td>
                      <td className="p-3 text-right text-red-600">{formatCurrency(emp.tds)}</td>
                      <td className="p-3 text-right font-medium text-red-600">{formatCurrency(emp.totalDeductions)}</td>
                    </>
              }
                  <td className="p-3 text-right font-bold text-green-700">{formatCurrency(emp.netSalary)}</td>
                </tr>
            )}
            </tbody>
            <tfoot className="bg-slate-100 font-semibold">
              <tr>
                <td className="p-3" colSpan={3}>Total</td>
                <td className="p-3 text-right">{formatCurrency(data.reduce((s, e) => s + e.basicSalary, 0))}</td>
                <td className="p-3 text-right">{formatCurrency(data.reduce((s, e) => s + e.hra, 0))}</td>
                <td className="p-3 text-right">{formatCurrency(data.reduce((s, e) => s + e.da, 0))}</td>
                <td className="p-3 text-right">{formatCurrency(summary.totalGrossSalary)}</td>
                {report.config.includeDeductions &&
              <>
                    <td className="p-3 text-right text-red-600">{formatCurrency(data.reduce((s, e) => s + e.pfDeduction, 0))}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(data.reduce((s, e) => s + e.esiDeduction, 0))}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(data.reduce((s, e) => s + e.tds, 0))}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(summary.totalDeductions)}</td>
                  </>
              }
                <td className="p-3 text-right text-green-700">{formatCurrency(summary.totalNetSalary)}</td>
              </tr>
            </tfoot>
          </table>
        </div> :

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Department-wise Summary</h4>
            {(() => {
            const deptSummary = data.reduce((acc, emp) => {
              if (!acc[emp.department]) {
                acc[emp.department] = { count: 0, gross: 0, net: 0 };
              }
              acc[emp.department].count++;
              acc[emp.department].gross += emp.grossSalary;
              acc[emp.department].net += emp.netSalary;
              return acc;
            }, {} as Record<string, {count: number;gross: number;net: number;}>);

            return Object.entries(deptSummary).map(([dept, values]) =>
            <div key={dept} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{dept}</span>
                    <Badge variant="secondary">{values.count} employees</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Gross: {formatCurrency(values.gross)}</p>
                    </div>
                    <div>
                      <p className="text-green-600">Net: {formatCurrency(values.net)}</p>
                    </div>
                  </div>
                </div>
            );
          })()}
          </div>

          {/* Additional Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Additional Statistics</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-600">Average Salary</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.avgSalary)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-600">Highest Salary</span>
                <span className="font-semibold text-green-600">{formatCurrency(summary.highestSalary)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-600">Lowest Salary</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.lowestSalary)}</span>
              </div>
              {report.config.includeContributions &&
            <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-blue-700">Employer Contributions</span>
                  <span className="font-semibold text-blue-800">{formatCurrency(summary.totalEmployerContributions)}</span>
                </div>
            }
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-600">Department Count</span>
                <span className="font-semibold text-slate-900">{summary.departmentCount}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function PayrollReport() {
  // Report Configuration State
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: 'monthly-summary',
    financialYear: '2024-25',
    fromMonth: 'April 2025',
    toMonth: 'May 2025',
    department: '',
    employeeType: '',
    includeDeductions: true,
    includeContributions: true,
    includeInactive: false,
    groupBy: 'none',
    sortBy: 'empName',
    sortOrder: 'asc'
  });

  // Generated Report State
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'summary'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Templates and History
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(INITIAL_TEMPLATES);
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>(INITIAL_REPORT_HISTORY);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);

  // Modal States
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

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

  // Generate Report
  const handleGenerateReport = useCallback(() => {
    setIsGenerating(true);

    // Simulate report generation delay
    setTimeout(() => {
      // Filter data based on configuration
      let filteredData = [...SAMPLE_PAYROLL_DATA];

      if (reportConfig.department) {
        filteredData = filteredData.filter(
          (emp) => emp.department.toLowerCase() === reportConfig.department.toLowerCase()
        );
      }

      if (reportConfig.employeeType) {
        filteredData = filteredData.filter(
          (emp) => emp.employeeType.toLowerCase() === reportConfig.employeeType.toLowerCase()
        );
      }

      // Sort data
      filteredData.sort((a, b) => {
        const aVal = a[reportConfig.sortBy as keyof EmployeePayrollData];
        const bVal = b[reportConfig.sortBy as keyof EmployeePayrollData];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return reportConfig.sortOrder === 'asc' ?
          aVal.localeCompare(bVal) :
          bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return reportConfig.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });

      // Calculate summary
      const summary: ReportSummary = {
        totalEmployees: filteredData.length,
        totalGrossSalary: filteredData.reduce((sum, emp) => sum + emp.grossSalary, 0),
        totalDeductions: filteredData.reduce((sum, emp) => sum + emp.totalDeductions, 0),
        totalNetSalary: filteredData.reduce((sum, emp) => sum + emp.netSalary, 0),
        totalEmployerContributions: filteredData.reduce(
          (sum, emp) => sum + emp.employerPf + emp.employerEsi,
          0
        ),
        avgSalary: filteredData.length > 0 ?
        Math.round(filteredData.reduce((sum, emp) => sum + emp.netSalary, 0) / filteredData.length) :
        0,
        highestSalary: filteredData.length > 0 ?
        Math.max(...filteredData.map((emp) => emp.netSalary)) :
        0,
        lowestSalary: filteredData.length > 0 ?
        Math.min(...filteredData.map((emp) => emp.netSalary)) :
        0,
        departmentCount: new Set(filteredData.map((emp) => emp.department)).size
      };

      const report: GeneratedReport = {
        id: Date.now().toString(),
        config: { ...reportConfig },
        generatedAt: new Date(),
        generatedBy: 'Current User',
        status: 'generated',
        data: filteredData,
        summary,
        fileName: generateReportFileName(reportConfig.reportType, reportConfig.fromMonth, 'pdf')
      };

      setGeneratedReport(report);
      setIsGenerating(false);

      // Add to history
      const historyEntry: ReportHistory = {
        id: Date.now().toString(),
        reportType: reportConfig.reportType,
        config: { ...reportConfig },
        generatedAt: new Date(),
        generatedBy: 'Current User',
        status: 'generated',
        downloadCount: 0,
        fileName: report.fileName
      };
      setReportHistory((prev) => [historyEntry, ...prev]);

      addNotification('success', `Report generated successfully with ${filteredData.length} records`);
    }, 1500);
  }, [reportConfig, addNotification]);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setReportConfig({
      reportType: 'monthly-summary',
      financialYear: '2024-25',
      fromMonth: 'April 2025',
      toMonth: 'May 2025',
      department: '',
      employeeType: '',
      includeDeductions: true,
      includeContributions: true,
      includeInactive: false,
      groupBy: 'none',
      sortBy: 'empName',
      sortOrder: 'asc'
    });
    setGeneratedReport(null);
    addNotification('info', 'Filters reset to default');
  }, [addNotification]);

  // Export Functions
  const handleExportPDF = useCallback(() => {
    if (!generatedReport) return;

    // Simulate PDF export
    const content = `
PAYROLL REPORT
==============
Report Type: ${getReportTypeLabel(generatedReport.config.reportType)}
Period: ${generatedReport.config.fromMonth} - ${generatedReport.config.toMonth}
Generated: ${formatDateTime(generatedReport.generatedAt)}

SUMMARY
-------
Total Employees: ${generatedReport.summary.totalEmployees}
Gross Salary: ${formatCurrency(generatedReport.summary.totalGrossSalary)}
Total Deductions: ${formatCurrency(generatedReport.summary.totalDeductions)}
Net Salary: ${formatCurrency(generatedReport.summary.totalNetSalary)}

DETAILS
-------
${(generatedReport.data as EmployeePayrollData[]).
    map(
      (emp) =>
      `${emp.empCode} | ${emp.empName} | ${emp.department} | ${formatCurrency(emp.netSalary)}`
    ).
    join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedReport.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update download count in history
    setReportHistory((prev) =>
    prev.map((h) =>
    h.id === generatedReport.id ? { ...h, downloadCount: h.downloadCount + 1 } : h
    )
    );

    addNotification('success', 'PDF exported successfully');
  }, [generatedReport, addNotification]);

  const handleExportExcel = useCallback(() => {
    if (!generatedReport) return;

    const data = generatedReport.data as EmployeePayrollData[];

    // Create CSV content (simulating Excel)
    const headers = [
    'Emp Code',
    'Employee Name',
    'Department',
    'Designation',
    'Basic',
    'HRA',
    'DA',
    'TA',
    'Gross Salary',
    'PF',
    'ESI',
    'TDS',
    'PT',
    'Total Deductions',
    'Net Salary'];


    const rows = data.map((emp) => [
    emp.empCode,
    emp.empName,
    emp.department,
    emp.designation,
    emp.basicSalary,
    emp.hra,
    emp.da,
    emp.ta,
    emp.grossSalary,
    emp.pfDeduction,
    emp.esiDeduction,
    emp.tds,
    emp.professionalTax,
    emp.totalDeductions,
    emp.netSalary]
    );

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedReport.fileName.replace('.pdf', '.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('success', 'Excel file exported successfully');
  }, [generatedReport, addNotification]);

  const handleExportCSV = useCallback(() => {
    if (!generatedReport) return;

    const data = generatedReport.data as EmployeePayrollData[];

    const headers = ['Emp Code', 'Employee Name', 'Department', 'Net Salary'];
    const rows = data.map((emp) => [emp.empCode, emp.empName, emp.department, emp.netSalary]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedReport.fileName.replace('.pdf', '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('success', 'CSV file exported successfully');
  }, [generatedReport, addNotification]);

  const handlePrint = useCallback(() => {
    window.print();
    addNotification('info', 'Print dialog opened');
  }, [addNotification]);

  // Template Functions
  const handleSaveTemplate = useCallback(
    (name: string, isDefault: boolean) => {
      const newTemplate: SavedTemplate = {
        id: Date.now().toString(),
        name,
        config: { ...reportConfig },
        createdAt: new Date(),
        createdBy: 'Current User',
        isDefault
      };

      setSavedTemplates((prev) => {
        let updated = [...prev, newTemplate];
        if (isDefault) {
          updated = updated.map((t) => ({ ...t, isDefault: t.id === newTemplate.id }));
        }
        return updated;
      });

      addNotification('success', `Template "${name}" saved successfully`);
    },
    [reportConfig, addNotification]
  );

  const handleApplyTemplate = useCallback(
    (config: ReportConfig) => {
      setReportConfig(config);
      setGeneratedReport(null);
      addNotification('info', 'Template applied');
    },
    [addNotification]
  );

  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      setSavedTemplates((prev) => prev.filter((t) => t.id !== templateId));
      addNotification('success', 'Template deleted');
    },
    [addNotification]
  );

  const handleSetDefaultTemplate = useCallback(
    (templateId: string) => {
      setSavedTemplates((prev) =>
      prev.map((t) => ({ ...t, isDefault: t.id === templateId }))
      );
      addNotification('success', 'Default template updated');
    },
    [addNotification]
  );

  // Schedule Functions
  const handleScheduleReport = useCallback(
    (schedule: Omit<ScheduledReport, 'id' | 'createdAt'>) => {
      const newSchedule: ScheduledReport = {
        ...schedule,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setScheduledReports((prev) => [...prev, newSchedule]);
      addNotification('success', `Report scheduled: ${schedule.name}`);
    },
    [addNotification]
  );

  // Email Function
  const handleSendEmail = useCallback(
    (emails: string[], subject: string, message: string) => {
      // Simulate email sending
      console.log('Sending email to:', emails, 'Subject:', subject);
      addNotification('success', `Report emailed to ${emails.length} recipient(s)`);
    },
    [addNotification]
  );

  // History Functions
  const handleDownloadFromHistory = useCallback(
    (report: ReportHistory, format: ExportFormat) => {
      setReportHistory((prev) =>
      prev.map((h) => h.id === report.id ? { ...h, downloadCount: h.downloadCount + 1 } : h)
      );
      addNotification('success', `Downloading ${report.fileName}`);
    },
    [addNotification]
  );

  const handleDeleteFromHistory = useCallback(
    (reportId: string) => {
      setReportHistory((prev) => prev.filter((h) => h.id !== reportId));
      addNotification('success', 'Report removed from history');
    },
    [addNotification]
  );

  const handleRegenerateFromHistory = useCallback(
    (config: ReportConfig) => {
      setReportConfig(config);
      setShowHistoryModal(false);
      // Auto-generate after applying config
      setTimeout(() => handleGenerateReport(), 100);
    },
    [handleGenerateReport]
  );

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">Payroll Reports</h1>
              <p className="text-sm text-slate-600">
                Generate comprehensive payroll reports with custom filters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<BookmarkIcon className="w-4 h-4" />}
                onClick={() => setShowTemplatesModal(true)}>

                Templates
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<HistoryIcon className="w-4 h-4" />}
                onClick={() => setShowHistoryModal(true)}>

                History ({reportHistory.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Report Filter Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 no-print">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Report Configuration</h3>
            </div>
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

              {showAdvancedFilters ?
              <>
                  <ChevronUpIcon className="w-4 h-4" /> Hide Advanced
                </> :

              <>
                  <ChevronDownIcon className="w-4 h-4" /> Show Advanced
                </>
              }
            </button>
          </div>

          <div className="space-y-4">
            {/* Report Type */}
            <Select
              label="Report Type"
              value={reportConfig.reportType}
              onChange={(val) =>
              setReportConfig({ ...reportConfig, reportType: val as ReportType })
              }
              options={REPORT_TYPES.map((rt) => ({ value: rt.value, label: rt.label }))} />


            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Financial Year"
                value={reportConfig.financialYear}
                onChange={(val) => setReportConfig({ ...reportConfig, financialYear: val as string })}
                options={FINANCIAL_YEARS} />

              <Select
                label="From Month"
                value={reportConfig.fromMonth}
                onChange={(val) => setReportConfig({ ...reportConfig, fromMonth: val as string })}
                options={MONTHS} />

              <Select
                label="To Month"
                value={reportConfig.toMonth}
                onChange={(val) => setReportConfig({ ...reportConfig, toMonth: val as string })}
                options={MONTHS} />

            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Department"
                value={reportConfig.department}
                onChange={(val) => setReportConfig({ ...reportConfig, department: val as string })}
                placeholder="All Departments"
                options={DEPARTMENTS} />

              <Select
                label="Employee Type"
                value={reportConfig.employeeType}
                onChange={(val) => setReportConfig({ ...reportConfig, employeeType: val as string })}
                placeholder="All Types"
                options={EMPLOYEE_TYPES} />

            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters &&
            <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                  label="Group By"
                  value={reportConfig.groupBy}
                  onChange={(val) => setReportConfig({ ...reportConfig, groupBy: val as string })}
                  options={GROUP_BY_OPTIONS} />

                  <Select
                  label="Sort By"
                  value={reportConfig.sortBy}
                  onChange={(val) => setReportConfig({ ...reportConfig, sortBy: val as string })}
                  options={SORT_BY_OPTIONS} />

                  <Select
                  label="Sort Order"
                  value={reportConfig.sortOrder}
                  onChange={(val) =>
                  setReportConfig({ ...reportConfig, sortOrder: val as 'asc' | 'desc' })
                  }
                  options={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' }]
                  } />

                </div>
              </div>
            }

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDeductions}
                  onChange={(e) =>
                  setReportConfig({ ...reportConfig, includeDeductions: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300" />

                <span className="text-sm text-slate-700">Include Deductions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportConfig.includeContributions}
                  onChange={(e) =>
                  setReportConfig({ ...reportConfig, includeContributions: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300" />

                <span className="text-sm text-slate-700">Include Employer Contributions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportConfig.includeInactive}
                  onChange={(e) =>
                  setReportConfig({ ...reportConfig, includeInactive: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300" />

                <span className="text-sm text-slate-700">Include Inactive Employees</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="primary"
                leftIcon={
                isGenerating ?
                <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                <FileTextIcon className="w-4 h-4" />

                }
                onClick={handleGenerateReport}
                disabled={isGenerating}>

                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                leftIcon={<SaveIcon className="w-4 h-4" />}
                onClick={() => setShowSaveTemplateModal(true)}>

                Save Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ClockIcon className="w-4 h-4" />}
                onClick={() => setShowScheduleModal(true)}>

                Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        {generatedReport &&
        <div className="flex items-center justify-between mb-4 no-print">
            <p className="text-sm text-slate-500">
              Showing {(generatedReport.data as EmployeePayrollData[]).length} records
            </p>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'table' ?
              'bg-white shadow text-slate-900' :
              'text-slate-500 hover:text-slate-700'}`
              }
              onClick={() => setViewMode('table')}>

                <TableIcon className="w-4 h-4 inline mr-1" />
                Table
              </button>
              <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'summary' ?
              'bg-white shadow text-slate-900' :
              'text-slate-500 hover:text-slate-700'}`
              }
              onClick={() => setViewMode('summary')}>

                <BarChart3Icon className="w-4 h-4 inline mr-1" />
                Summary
              </button>
            </div>
          </div>
        }

        {/* Report Preview */}
        <ReportPreview
          report={generatedReport}
          viewMode={viewMode}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onExportCSV={handleExportCSV}
          onPrint={handlePrint}
          onEmail={() => setShowEmailModal(true)} />

      </div>

      {/* Modals */}
      <SaveTemplateModal
        isOpen={showSaveTemplateModal}
        onClose={() => setShowSaveTemplateModal(false)}
        onSave={handleSaveTemplate}
        config={reportConfig} />


      <ScheduleReportModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleReport}
        config={reportConfig} />


      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        reportType={reportConfig.reportType} />


      <ReportHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={reportHistory}
        onDownload={handleDownloadFromHistory}
        onDelete={handleDeleteFromHistory}
        onRegenerate={handleRegenerateFromHistory} />


      <SavedTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        templates={savedTemplates}
        onApply={handleApplyTemplate}
        onDelete={handleDeleteTemplate}
        onSetDefault={handleSetDefaultTemplate} />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}