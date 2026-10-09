import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  PieChartIcon,
  BarChartIcon,
  DownloadIcon,
  SearchIcon,
  XIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  EyeIcon,
  PrinterIcon,
  FileTextIcon,
  ArrowUpDownIcon,
  LayersIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  InfoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MoreVerticalIcon,
  CopyIcon,
  TableIcon,
  BarChart3Icon,
  ListIcon,
  GridIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  PercentIcon,
  DollarSignIcon,
  BuildingIcon,
  UserIcon,
  SettingsIcon,
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart } from
'recharts';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type ComponentType = 'earning' | 'deduction';

type SalaryComponent = {
  id: string;
  name: string;
  code: string;
  type: ComponentType;
  category: string;
  isTaxable: boolean;
  isStatutory: boolean;
  description: string;
};

type ComponentData = {
  id: string;
  componentId: string;
  componentName: string;
  componentCode: string;
  type: ComponentType;
  category: string;
  amount: number;
  employeeCount: number;
  avgAmount: number;
  minAmount: number;
  maxAmount: number;
  monthlyTrend: {month: string;amount: number;}[];
};

type EmployeeComponentData = {
  id: number;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  componentId: string;
  componentName: string;
  componentType: ComponentType;
  amount: number;
  percentage: number;
  grossSalary: number;
};

type DepartmentSummary = {
  department: string;
  departmentName: string;
  employeeCount: number;
  totalEarnings: number;
  totalDeductions: number;
  netPayable: number;
  components: {name: string;amount: number;type: ComponentType;}[];
};

type MonthlyTrendData = {
  month: string;
  monthLabel: string;
  earnings: number;
  deductions: number;
  netPayable: number;
};

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type ViewMode = 'chart' | 'table' | 'grid';
type ChartType = 'pie' | 'bar' | 'line' | 'area';
type SortField = 'empName' | 'componentName' | 'amount' | 'percentage' | 'department';
type SortDirection = 'asc' | 'desc';
type ModalType = 'none' | 'componentDetail' | 'employeeDetail' | 'departmentDetail' | 'trendAnalysis' | 'comparison' | 'export';

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const MONTHS = [
{ value: '2025-05', label: 'May 2025' },
{ value: '2025-04', label: 'April 2025' },
{ value: '2025-03', label: 'March 2025' },
{ value: '2025-02', label: 'February 2025' },
{ value: '2025-01', label: 'January 2025' },
{ value: '2024-12', label: 'December 2024' }];


const DEPARTMENTS = [
{ id: 'teaching', name: 'Teaching', employeeCount: 120 },
{ id: 'admin', name: 'Administration', employeeCount: 45 },
{ id: 'it', name: 'IT Department', employeeCount: 28 },
{ id: 'accounts', name: 'Accounts', employeeCount: 15 },
{ id: 'support', name: 'Support Staff', employeeCount: 40 }];


const SALARY_COMPONENTS: SalaryComponent[] = [
{ id: 'basic', name: 'Basic Salary', code: 'BASIC', type: 'earning', category: 'Fixed', isTaxable: true, isStatutory: false, description: 'Basic salary component' },
{ id: 'hra', name: 'House Rent Allowance', code: 'HRA', type: 'earning', category: 'Allowance', isTaxable: true, isStatutory: false, description: 'Housing allowance' },
{ id: 'da', name: 'Dearness Allowance', code: 'DA', type: 'earning', category: 'Allowance', isTaxable: true, isStatutory: false, description: 'Cost of living adjustment' },
{ id: 'ta', name: 'Transport Allowance', code: 'TA', type: 'earning', category: 'Allowance', isTaxable: true, isStatutory: false, description: 'Transportation allowance' },
{ id: 'ma', name: 'Medical Allowance', code: 'MA', type: 'earning', category: 'Allowance', isTaxable: false, isStatutory: false, description: 'Medical expenses allowance' },
{ id: 'sa', name: 'Special Allowance', code: 'SA', type: 'earning', category: 'Allowance', isTaxable: true, isStatutory: false, description: 'Special allowance' },
{ id: 'bonus', name: 'Performance Bonus', code: 'BONUS', type: 'earning', category: 'Variable', isTaxable: true, isStatutory: false, description: 'Performance-based bonus' },
{ id: 'ot', name: 'Overtime', code: 'OT', type: 'earning', category: 'Variable', isTaxable: true, isStatutory: false, description: 'Overtime earnings' },
{ id: 'pf', name: 'Provident Fund', code: 'PF', type: 'deduction', category: 'Statutory', isTaxable: false, isStatutory: true, description: 'Employee PF contribution' },
{ id: 'esi', name: 'ESI', code: 'ESI', type: 'deduction', category: 'Statutory', isTaxable: false, isStatutory: true, description: 'Employee State Insurance' },
{ id: 'pt', name: 'Professional Tax', code: 'PT', type: 'deduction', category: 'Statutory', isTaxable: false, isStatutory: true, description: 'Professional tax' },
{ id: 'tds', name: 'Tax Deducted at Source', code: 'TDS', type: 'deduction', category: 'Statutory', isTaxable: false, isStatutory: true, description: 'Income tax deduction' },
{ id: 'loan', name: 'Loan Recovery', code: 'LOAN', type: 'deduction', category: 'Recovery', isTaxable: false, isStatutory: false, description: 'Loan EMI deduction' },
{ id: 'advance', name: 'Advance Recovery', code: 'ADV', type: 'deduction', category: 'Recovery', isTaxable: false, isStatutory: false, description: 'Salary advance recovery' },
{ id: 'insurance', name: 'Insurance Premium', code: 'INS', type: 'deduction', category: 'Voluntary', isTaxable: false, isStatutory: false, description: 'Insurance premium' }];


const CHART_COLORS = {
  earnings: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  deductions: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  mixed: ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#ec4899', '#f472b6', '#f9a8d4']
};

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* -------------------------------------------------------------------------- */
/* Initial Data Generation                                                     */
/* -------------------------------------------------------------------------- */

const generateComponentData = (): ComponentData[] => {
  const data: ComponentData[] = [
  {
    id: '1',
    componentId: 'basic',
    componentName: 'Basic Salary',
    componentCode: 'BASIC',
    type: 'earning',
    category: 'Fixed',
    amount: 6200000,
    employeeCount: 248,
    avgAmount: 25000,
    minAmount: 15000,
    maxAmount: 65000,
    monthlyTrend: [
    { month: '2025-01', amount: 5800000 },
    { month: '2025-02', amount: 5900000 },
    { month: '2025-03', amount: 6000000 },
    { month: '2025-04', amount: 6100000 },
    { month: '2025-05', amount: 6200000 }]

  },
  {
    id: '2',
    componentId: 'hra',
    componentName: 'House Rent Allowance',
    componentCode: 'HRA',
    type: 'earning',
    category: 'Allowance',
    amount: 2480000,
    employeeCount: 248,
    avgAmount: 10000,
    minAmount: 6000,
    maxAmount: 26000,
    monthlyTrend: [
    { month: '2025-01', amount: 2320000 },
    { month: '2025-02', amount: 2360000 },
    { month: '2025-03', amount: 2400000 },
    { month: '2025-04', amount: 2440000 },
    { month: '2025-05', amount: 2480000 }]

  },
  {
    id: '3',
    componentId: 'da',
    componentName: 'Dearness Allowance',
    componentCode: 'DA',
    type: 'earning',
    category: 'Allowance',
    amount: 1860000,
    employeeCount: 248,
    avgAmount: 7500,
    minAmount: 4500,
    maxAmount: 19500,
    monthlyTrend: [
    { month: '2025-01', amount: 1740000 },
    { month: '2025-02', amount: 1770000 },
    { month: '2025-03', amount: 1800000 },
    { month: '2025-04', amount: 1830000 },
    { month: '2025-05', amount: 1860000 }]

  },
  {
    id: '4',
    componentId: 'ta',
    componentName: 'Transport Allowance',
    componentCode: 'TA',
    type: 'earning',
    category: 'Allowance',
    amount: 496000,
    employeeCount: 248,
    avgAmount: 2000,
    minAmount: 1000,
    maxAmount: 5000,
    monthlyTrend: [
    { month: '2025-01', amount: 476000 },
    { month: '2025-02', amount: 480000 },
    { month: '2025-03', amount: 484000 },
    { month: '2025-04', amount: 490000 },
    { month: '2025-05', amount: 496000 }]

  },
  {
    id: '5',
    componentId: 'ma',
    componentName: 'Medical Allowance',
    componentCode: 'MA',
    type: 'earning',
    category: 'Allowance',
    amount: 372000,
    employeeCount: 248,
    avgAmount: 1500,
    minAmount: 1000,
    maxAmount: 3000,
    monthlyTrend: [
    { month: '2025-01', amount: 360000 },
    { month: '2025-02', amount: 363000 },
    { month: '2025-03', amount: 366000 },
    { month: '2025-04', amount: 369000 },
    { month: '2025-05', amount: 372000 }]

  },
  {
    id: '6',
    componentId: 'sa',
    componentName: 'Special Allowance',
    componentCode: 'SA',
    type: 'earning',
    category: 'Allowance',
    amount: 744000,
    employeeCount: 180,
    avgAmount: 4133,
    minAmount: 2000,
    maxAmount: 10000,
    monthlyTrend: [
    { month: '2025-01', amount: 700000 },
    { month: '2025-02', amount: 712000 },
    { month: '2025-03', amount: 724000 },
    { month: '2025-04', amount: 735000 },
    { month: '2025-05', amount: 744000 }]

  },
  {
    id: '7',
    componentId: 'bonus',
    componentName: 'Performance Bonus',
    componentCode: 'BONUS',
    type: 'earning',
    category: 'Variable',
    amount: 520000,
    employeeCount: 65,
    avgAmount: 8000,
    minAmount: 3000,
    maxAmount: 25000,
    monthlyTrend: [
    { month: '2025-01', amount: 0 },
    { month: '2025-02', amount: 0 },
    { month: '2025-03', amount: 420000 },
    { month: '2025-04', amount: 0 },
    { month: '2025-05', amount: 520000 }]

  },
  {
    id: '8',
    componentId: 'ot',
    componentName: 'Overtime',
    componentCode: 'OT',
    type: 'earning',
    category: 'Variable',
    amount: 248000,
    employeeCount: 42,
    avgAmount: 5905,
    minAmount: 1000,
    maxAmount: 15000,
    monthlyTrend: [
    { month: '2025-01', amount: 180000 },
    { month: '2025-02', amount: 195000 },
    { month: '2025-03', amount: 210000 },
    { month: '2025-04', amount: 230000 },
    { month: '2025-05', amount: 248000 }]

  },
  {
    id: '9',
    componentId: 'pf',
    componentName: 'Provident Fund',
    componentCode: 'PF',
    type: 'deduction',
    category: 'Statutory',
    amount: 744000,
    employeeCount: 248,
    avgAmount: 3000,
    minAmount: 1800,
    maxAmount: 7800,
    monthlyTrend: [
    { month: '2025-01', amount: 696000 },
    { month: '2025-02', amount: 708000 },
    { month: '2025-03', amount: 720000 },
    { month: '2025-04', amount: 732000 },
    { month: '2025-05', amount: 744000 }]

  },
  {
    id: '10',
    componentId: 'esi',
    componentName: 'ESI',
    componentCode: 'ESI',
    type: 'deduction',
    category: 'Statutory',
    amount: 148800,
    employeeCount: 85,
    avgAmount: 1751,
    minAmount: 525,
    maxAmount: 3938,
    monthlyTrend: [
    { month: '2025-01', amount: 140000 },
    { month: '2025-02', amount: 142200 },
    { month: '2025-03', amount: 144400 },
    { month: '2025-04', amount: 146600 },
    { month: '2025-05', amount: 148800 }]

  },
  {
    id: '11',
    componentId: 'pt',
    componentName: 'Professional Tax',
    componentCode: 'PT',
    type: 'deduction',
    category: 'Statutory',
    amount: 49600,
    employeeCount: 248,
    avgAmount: 200,
    minAmount: 0,
    maxAmount: 200,
    monthlyTrend: [
    { month: '2025-01', amount: 48000 },
    { month: '2025-02', amount: 48400 },
    { month: '2025-03', amount: 48800 },
    { month: '2025-04', amount: 49200 },
    { month: '2025-05', amount: 49600 }]

  },
  {
    id: '12',
    componentId: 'tds',
    componentName: 'Tax Deducted at Source',
    componentCode: 'TDS',
    type: 'deduction',
    category: 'Statutory',
    amount: 496000,
    employeeCount: 120,
    avgAmount: 4133,
    minAmount: 0,
    maxAmount: 25000,
    monthlyTrend: [
    { month: '2025-01', amount: 460000 },
    { month: '2025-02', amount: 469000 },
    { month: '2025-03', amount: 478000 },
    { month: '2025-04', amount: 487000 },
    { month: '2025-05', amount: 496000 }]

  },
  {
    id: '13',
    componentId: 'loan',
    componentName: 'Loan Recovery',
    componentCode: 'LOAN',
    type: 'deduction',
    category: 'Recovery',
    amount: 186000,
    employeeCount: 35,
    avgAmount: 5314,
    minAmount: 2000,
    maxAmount: 15000,
    monthlyTrend: [
    { month: '2025-01', amount: 195000 },
    { month: '2025-02', amount: 192000 },
    { month: '2025-03', amount: 189000 },
    { month: '2025-04', amount: 186000 },
    { month: '2025-05', amount: 186000 }]

  },
  {
    id: '14',
    componentId: 'advance',
    componentName: 'Advance Recovery',
    componentCode: 'ADV',
    type: 'deduction',
    category: 'Recovery',
    amount: 75000,
    employeeCount: 12,
    avgAmount: 6250,
    minAmount: 3000,
    maxAmount: 15000,
    monthlyTrend: [
    { month: '2025-01', amount: 45000 },
    { month: '2025-02', amount: 52000 },
    { month: '2025-03', amount: 60000 },
    { month: '2025-04', amount: 68000 },
    { month: '2025-05', amount: 75000 }]

  },
  {
    id: '15',
    componentId: 'insurance',
    componentName: 'Insurance Premium',
    componentCode: 'INS',
    type: 'deduction',
    category: 'Voluntary',
    amount: 124000,
    employeeCount: 82,
    avgAmount: 1512,
    minAmount: 500,
    maxAmount: 3000,
    monthlyTrend: [
    { month: '2025-01', amount: 115000 },
    { month: '2025-02', amount: 117500 },
    { month: '2025-03', amount: 120000 },
    { month: '2025-04', amount: 122000 },
    { month: '2025-05', amount: 124000 }]

  }];


  return data;
};

const generateEmployeeComponentData = (): EmployeeComponentData[] => {
  const employees = [
  { empId: 'EMP001', empName: 'Rajesh Kumar', department: 'teaching', designation: 'Senior Teacher', grossSalary: 45000 },
  { empId: 'EMP002', empName: 'Priya Sharma', department: 'admin', designation: 'Office Manager', grossSalary: 35000 },
  { empId: 'EMP003', empName: 'Amit Patel', department: 'it', designation: 'IT Manager', grossSalary: 55000 },
  { empId: 'EMP004', empName: 'Sneha Reddy', department: 'teaching', designation: 'Teacher', grossSalary: 38000 },
  { empId: 'EMP005', empName: 'Vikram Singh', department: 'support', designation: 'Peon', grossSalary: 18000 },
  { empId: 'EMP006', empName: 'Meera Joshi', department: 'teaching', designation: 'HOD Science', grossSalary: 65000 },
  { empId: 'EMP007', empName: 'Arun Nair', department: 'it', designation: 'System Admin', grossSalary: 42000 },
  { empId: 'EMP008', empName: 'Kavita Menon', department: 'accounts', designation: 'Accountant', grossSalary: 40000 },
  { empId: 'EMP009', empName: 'Suresh Rao', department: 'admin', designation: 'Admin Assistant', grossSalary: 28000 },
  { empId: 'EMP010', empName: 'Deepa Iyer', department: 'teaching', designation: 'Teacher', grossSalary: 36000 }];


  const components = [
  { id: 'basic', name: 'Basic Salary', type: 'earning' as ComponentType, percentage: 50 },
  { id: 'hra', name: 'HRA', type: 'earning' as ComponentType, percentage: 20 },
  { id: 'da', name: 'DA', type: 'earning' as ComponentType, percentage: 15 },
  { id: 'ta', name: 'Transport Allowance', type: 'earning' as ComponentType, percentage: 5 },
  { id: 'ma', name: 'Medical Allowance', type: 'earning' as ComponentType, percentage: 4 },
  { id: 'sa', name: 'Special Allowance', type: 'earning' as ComponentType, percentage: 6 },
  { id: 'pf', name: 'Provident Fund', type: 'deduction' as ComponentType, percentage: 12 },
  { id: 'pt', name: 'Professional Tax', type: 'deduction' as ComponentType, percentage: 0.5 },
  { id: 'tds', name: 'TDS', type: 'deduction' as ComponentType, percentage: 5 }];


  const data: EmployeeComponentData[] = [];
  let idCounter = 1;

  employees.forEach((emp) => {
    components.forEach((comp) => {
      const amount = Math.round(emp.grossSalary * comp.percentage / 100);
      if (amount > 0) {
        data.push({
          id: idCounter++,
          empId: emp.empId,
          empName: emp.empName,
          department: emp.department,
          designation: emp.designation,
          componentId: comp.id,
          componentName: comp.name,
          componentType: comp.type,
          amount,
          percentage: comp.percentage,
          grossSalary: emp.grossSalary
        });
      }
    });
  });

  return data;
};

const generateDepartmentSummary = (): DepartmentSummary[] => {
  return DEPARTMENTS.map((dept) => ({
    department: dept.id,
    departmentName: dept.name,
    employeeCount: dept.employeeCount,
    totalEarnings: dept.employeeCount * 40000, // Approximate
    totalDeductions: dept.employeeCount * 8000,
    netPayable: dept.employeeCount * 32000,
    components: [
    { name: 'Basic Salary', amount: dept.employeeCount * 20000, type: 'earning' as ComponentType },
    { name: 'HRA', amount: dept.employeeCount * 8000, type: 'earning' as ComponentType },
    { name: 'DA', amount: dept.employeeCount * 6000, type: 'earning' as ComponentType },
    { name: 'Allowances', amount: dept.employeeCount * 6000, type: 'earning' as ComponentType },
    { name: 'PF', amount: dept.employeeCount * 2400, type: 'deduction' as ComponentType },
    { name: 'TDS', amount: dept.employeeCount * 3000, type: 'deduction' as ComponentType },
    { name: 'Others', amount: dept.employeeCount * 2600, type: 'deduction' as ComponentType }]

  }));
};

/* -------------------------------------------------------------------------- */
/* Utility Functions                                                           */
/* -------------------------------------------------------------------------- */

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatCurrency = (amount: number, compact = false): string => {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const getMonthLabel = (monthValue: string): string => {
  const month = MONTHS.find((m) => m.value === monthValue);
  return month?.label || monthValue;
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
        return <XIcon className="h-4 w-4" />;
      case 'warning':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'info':
        return <InfoIcon className="h-4 w-4" />;
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
/* Modal Component                                                             */
/* -------------------------------------------------------------------------- */

function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md'







}: {isOpen: boolean;onClose: () => void;title: string;subtitle?: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Component Card                                                              */
/* -------------------------------------------------------------------------- */

function ComponentCard({
  component,
  isSelected,
  onClick,
  totalAmount





}: {component: ComponentData;isSelected: boolean;onClick: () => void;totalAmount: number;}) {
  const percentage = (component.amount / totalAmount * 100).toFixed(1);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
      isSelected ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100'}`
      }>

      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${component.type === 'earning' ? 'bg-emerald-500' : 'bg-red-500'}`} />

        <div>
          <span className="text-sm font-medium text-slate-900">{component.componentName}</span>
          <div className="text-xs text-slate-500">{component.employeeCount} employees</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900">{formatCurrency(component.amount, true)}</div>
        <div className="text-xs text-slate-500">{percentage}%</div>
      </div>
    </button>);

}

/* -------------------------------------------------------------------------- */
/* Trend Chart Component                                                       */
/* -------------------------------------------------------------------------- */

function TrendChart({
  data,
  type = 'line'



}: {data: MonthlyTrendData[];type?: 'line' | 'bar' | 'area';}) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, true)} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="earnings" name="Earnings" fill="#10b981" />
          <Bar dataKey="deductions" name="Deductions" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>);

  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, true)} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Area type="monotone" dataKey="earnings" name="Earnings" stackId="1" fill="#10b981" stroke="#059669" />
          <Area type="monotone" dataKey="deductions" name="Deductions" stackId="2" fill="#ef4444" stroke="#dc2626" />
        </AreaChart>
      </ResponsiveContainer>);

  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, true)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="earnings" name="Earnings" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="deductions" name="Deductions" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="netPayable" name="Net Payable" stroke="#6366f1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>);

}

/* -------------------------------------------------------------------------- */
/* Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function EarningsDeductionSummary() {
  // Data state
  const [componentData, setComponentData] = useState<ComponentData[]>(generateComponentData);
  const [employeeComponentData, setEmployeeComponentData] = useState<EmployeeComponentData[]>(generateEmployeeComponentData);
  const [departmentSummary, setDepartmentSummary] = useState<DepartmentSummary[]>(generateDepartmentSummary);

  // Filter state
  const [filters, setFilters] = useState({
    month: '2025-05',
    department: '',
    componentType: 'all',
    category: '',
    search: ''
  });

  // UI state
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [modalType, setModalType] = useState<ModalType>('none');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['earnings', 'deductions']));

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Comparison state
  const [compareComponents, setCompareComponents] = useState<string[]>([]);

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

  // Filter component data
  const filteredComponentData = useMemo(() => {
    let result = [...componentData];

    if (filters.componentType !== 'all') {
      result = result.filter((c) => c.type === filters.componentType);
    }

    if (filters.category) {
      result = result.filter((c) => c.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
        c.componentName.toLowerCase().includes(searchLower) ||
        c.componentCode.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [componentData, filters]);

  // Summary calculations
  const summaryStats = useMemo(() => {
    const earnings = filteredComponentData.filter((c) => c.type === 'earning');
    const deductions = filteredComponentData.filter((c) => c.type === 'deduction');

    const totalEarnings = earnings.reduce((sum, c) => sum + c.amount, 0);
    const totalDeductions = deductions.reduce((sum, c) => sum + c.amount, 0);
    const netPayable = totalEarnings - totalDeductions;

    const employeeCount = 248; // Fixed for demo

    return {
      totalEarnings,
      totalDeductions,
      netPayable,
      employeeCount,
      avgEarningsPerEmployee: totalEarnings / employeeCount,
      avgDeductionsPerEmployee: totalDeductions / employeeCount,
      avgNetPerEmployee: netPayable / employeeCount,
      deductionRate: totalDeductions / totalEarnings * 100,
      earningsComponents: earnings.length,
      deductionsComponents: deductions.length
    };
  }, [filteredComponentData]);

  // Filter and sort employee data
  const filteredEmployeeData = useMemo(() => {
    let result = [...employeeComponentData];

    if (filters.department) {
      result = result.filter((e) => e.department === filters.department);
    }

    if (filters.componentType !== 'all') {
      result = result.filter((e) => e.componentType === filters.componentType);
    }

    if (selectedComponent) {
      result = result.filter((e) => e.componentId === selectedComponent.componentId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
        e.empName.toLowerCase().includes(searchLower) ||
        e.empId.toLowerCase().includes(searchLower) ||
        e.componentName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'empName':
          comparison = a.empName.localeCompare(b.empName);
          break;
        case 'componentName':
          comparison = a.componentName.localeCompare(b.componentName);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'percentage':
          comparison = a.percentage - b.percentage;
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [employeeComponentData, filters, selectedComponent, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployeeData.length / itemsPerPage);
  const paginatedEmployeeData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployeeData.slice(start, start + itemsPerPage);
  }, [filteredEmployeeData, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, selectedComponent, itemsPerPage]);

  // Pie chart data
  const pieChartData = useMemo(() => {
    const type = filters.componentType === 'deduction' ? 'deduction' : 'earning';
    const data = filteredComponentData.filter((c) => c.type === type);
    return data.map((c, idx) => ({
      name: c.componentName,
      value: c.amount,
      color: type === 'earning' ? CHART_COLORS.earnings[idx % CHART_COLORS.earnings.length] : CHART_COLORS.deductions[idx % CHART_COLORS.deductions.length]
    }));
  }, [filteredComponentData, filters.componentType]);

  // Monthly trend data
  const monthlyTrendData = useMemo((): MonthlyTrendData[] => {
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05'];
    return months.map((month) => {
      const earnings = componentData.
      filter((c) => c.type === 'earning').
      reduce((sum, c) => {
        const trend = c.monthlyTrend.find((t) => t.month === month);
        return sum + (trend?.amount || 0);
      }, 0);

      const deductions = componentData.
      filter((c) => c.type === 'deduction').
      reduce((sum, c) => {
        const trend = c.monthlyTrend.find((t) => t.month === month);
        return sum + (trend?.amount || 0);
      }, 0);

      return {
        month,
        monthLabel: getMonthLabel(month).split(' ')[0],
        earnings,
        deductions,
        netPayable: earnings - deductions
      };
    });
  }, [componentData]);

  // Bar chart data for comparison
  const barChartData = useMemo(() => {
    const earningsData = filteredComponentData.
    filter((c) => c.type === 'earning').
    map((c) => ({ name: c.componentCode, amount: c.amount, type: 'Earnings' }));

    const deductionsData = filteredComponentData.
    filter((c) => c.type === 'deduction').
    map((c) => ({ name: c.componentCode, amount: c.amount, type: 'Deductions' }));

    return [...earningsData, ...deductionsData];
  }, [filteredComponentData]);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    componentData.forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, [componentData]);

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  // Handle component selection
  const handleComponentSelect = useCallback((component: ComponentData) => {
    setSelectedComponent((prev) => prev?.id === component.id ? null : component);
  }, []);

  // Handle component comparison toggle
  const toggleCompareComponent = useCallback((componentId: string) => {
    setCompareComponents((prev) => {
      if (prev.includes(componentId)) {
        return prev.filter((id) => id !== componentId);
      }
      if (prev.length >= 4) {
        showNotification('Maximum 4 components can be compared', 'warning');
        return prev;
      }
      return [...prev, componentId];
    });
  }, [showNotification]);

  // Sort handler
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    },
    [sortField]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      month: '2025-05',
      department: '',
      componentType: 'all',
      category: '',
      search: ''
    });
    setSelectedComponent(null);
    showNotification('Filters reset', 'info');
  }, [showNotification]);

  // Export data
  const exportData = useCallback(
    (format: 'csv' | 'excel' | 'pdf') => {
      if (format === 'csv' || format === 'excel') {
        const headers = ['Component', 'Type', 'Category', 'Amount', 'Employee Count', 'Average', 'Min', 'Max'];
        const rows = filteredComponentData.map((c) => [
        c.componentName,
        c.type,
        c.category,
        c.amount,
        c.employeeCount,
        c.avgAmount,
        c.minAmount,
        c.maxAmount]
        );

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnings_deductions_${filters.month}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`Data exported as ${format.toUpperCase()}`);
      } else {
        showNotification('PDF export initiated', 'info');
      }
      setModalType('none');
    },
    [filteredComponentData, filters.month, showNotification]
  );

  // Print report
  const printReport = useCallback(() => {
    window.print();
    showNotification('Print dialog opened', 'info');
  }, [showNotification]);

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      showNotification(`${label} copied to clipboard`, 'info');
    },
    [showNotification]
  );

  // Get earnings and deductions separately
  const earningsComponents = filteredComponentData.filter((c) => c.type === 'earning');
  const deductionsComponents = filteredComponentData.filter((c) => c.type === 'deduction');

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
              <h1 className="text-2xl font-semibold text-slate-900">Earnings & Deduction Summary</h1>
              <p className="text-sm text-slate-500 mt-1">
                {getMonthLabel(filters.month)} • {summaryStats.employeeCount} Employees
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<PrinterIcon className="w-4 h-4" />} onClick={printReport}>
                Print
              </Button>
              <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={() => setModalType('export')}>
                Export
              </Button>
              <Button variant="outline" leftIcon={<BarChart3Icon className="w-4 h-4" />} onClick={() => setModalType('trendAnalysis')}>
                Trends
              </Button>
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
                value={filters.componentType}
                onChange={(e) => setFilters({ ...filters, componentType: e.target.value })}
                options={[
                { value: 'all', label: 'All Components' },
                { value: 'earning', label: 'Earnings Only' },
                { value: 'deduction', label: 'Deductions Only' }]
                }
                className="w-44" />

              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
                className="w-40" />

              <Input
                placeholder="Search components..."
                leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="md:w-52" />

            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RefreshCwIcon className="w-4 h-4" />}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-emerald-600 uppercase tracking-wide">Total Earnings</div>
              <TrendingUpIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(summaryStats.totalEarnings, true)}</div>
            <div className="text-xs text-emerald-600 mt-1">
              Avg per employee: {formatCurrency(Math.round(summaryStats.avgEarningsPerEmployee))}
            </div>
            <div className="text-xs text-emerald-500 mt-1">
              {summaryStats.earningsComponents} components
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-red-600 uppercase tracking-wide">Total Deductions</div>
              <TrendingDownIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-900">{formatCurrency(summaryStats.totalDeductions, true)}</div>
            <div className="text-xs text-red-600 mt-1">
              Avg per employee: {formatCurrency(Math.round(summaryStats.avgDeductionsPerEmployee))}
            </div>
            <div className="text-xs text-red-500 mt-1">
              {summaryStats.deductionsComponents} components
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-indigo-600 uppercase tracking-wide">Net Payable</div>
              <BarChartIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-900">{formatCurrency(summaryStats.netPayable, true)}</div>
            <div className="text-xs text-indigo-600 mt-1">
              Avg per employee: {formatCurrency(Math.round(summaryStats.avgNetPerEmployee))}
            </div>
            <div className="text-xs text-indigo-500 mt-1">{summaryStats.deductionRate.toFixed(1)}% deduction rate</div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-4 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

              <PieChartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

              <TableIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

              <GridIcon className="w-5 h-5" />
            </button>
          </div>

          {viewMode === 'chart' &&
          <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Chart Type:</span>
              <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="border border-slate-300 rounded px-2 py-1 text-sm">

                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          }

          {compareComponents.length > 0 &&
          <Button variant="outline" size="sm" onClick={() => setModalType('comparison')}>
              Compare ({compareComponents.length})
            </Button>
          }
        </div>

        {/* Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Component List */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Component Breakdown</h3>
              {selectedComponent &&
              <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(null)}>
                  Clear Selection
                </Button>
              }
            </div>

            <div className="space-y-4">
              {/* Earnings Section */}
              <div>
                <button
                  onClick={() => toggleSection('earnings')}
                  className="w-full flex items-center justify-between p-2 bg-emerald-50 rounded-lg mb-2">

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700">
                      Earnings ({earningsComponents.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(earningsComponents.reduce((sum, c) => sum + c.amount, 0), true)}
                    </span>
                    {expandedSections.has('earnings') ?
                    <ChevronUpIcon className="w-4 h-4 text-emerald-600" /> :

                    <ChevronDownIcon className="w-4 h-4 text-emerald-600" />
                    }
                  </div>
                </button>
                {expandedSections.has('earnings') &&
                <div className="space-y-2 pl-4">
                    {earningsComponents.map((component) =>
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isSelected={selectedComponent?.id === component.id}
                    onClick={() => handleComponentSelect(component)}
                    totalAmount={summaryStats.totalEarnings} />

                  )}
                  </div>
                }
              </div>

              {/* Deductions Section */}
              <div>
                <button
                  onClick={() => toggleSection('deductions')}
                  className="w-full flex items-center justify-between p-2 bg-red-50 rounded-lg mb-2">

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      Deductions ({deductionsComponents.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-700">
                      {formatCurrency(deductionsComponents.reduce((sum, c) => sum + c.amount, 0), true)}
                    </span>
                    {expandedSections.has('deductions') ?
                    <ChevronUpIcon className="w-4 h-4 text-red-600" /> :

                    <ChevronDownIcon className="w-4 h-4 text-red-600" />
                    }
                  </div>
                </button>
                {expandedSections.has('deductions') &&
                <div className="space-y-2 pl-4">
                    {deductionsComponents.map((component) =>
                  <ComponentCard
                    key={component.id}
                    component={component}
                    isSelected={selectedComponent?.id === component.id}
                    onClick={() => handleComponentSelect(component)}
                    totalAmount={summaryStats.totalDeductions} />

                  )}
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">
                {filters.componentType === 'deduction' ? 'Deductions' : 'Earnings'} Distribution
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalType('trendAnalysis')}
                leftIcon={<TrendingUpIcon className="w-4 h-4" />}>

                View Trends
              </Button>
            </div>
            <div className="h-[300px]">
              {chartType === 'pie' ?
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data, index) => {
                      const component = filteredComponentData.find((c) => c.componentName === data.name);
                      if (component) handleComponentSelect(component);
                    }}>

                      {pieChartData.map((entry, index) =>
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{ cursor: 'pointer' }} />

                    )}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer> :

              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value, true)} />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar
                    dataKey="amount"
                    fill="#6366f1"
                    onClick={(data) => {
                      const component = filteredComponentData.find((c) => c.componentCode === data.name);
                      if (component) handleComponentSelect(component);
                    }} />

                  </BarChart>
                </ResponsiveContainer>
              }
            </div>
          </div>
        </div>

        {/* Selected Component Details */}
        {selectedComponent &&
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6 no-print">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                className={`w-4 h-4 rounded-full ${selectedComponent.type === 'earning' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedComponent.componentName}</h3>
                  <p className="text-sm text-slate-500">
                    {selectedComponent.componentCode} • {selectedComponent.category}
                  </p>
                </div>
                <Badge variant={selectedComponent.type === 'earning' ? 'success' : 'destructive'}>
                  {selectedComponent.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setModalType('componentDetail')}>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(null)}>
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedComponent.amount, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Employee Count</p>
                <p className="text-xl font-bold text-slate-900">{selectedComponent.employeeCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Average</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedComponent.avgAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Minimum</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedComponent.minAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Maximum</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedComponent.maxAmount)}</p>
              </div>
            </div>
          </div>
        }

        {/* Employee Component Details Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Employee Component Details</h3>
              <p className="text-xs text-slate-500">
                {filteredEmployeeData.length} records
                {selectedComponent && ` • Filtered by ${selectedComponent.componentName}`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('empName')}>

                    Employee Name
                    <SortIndicator field="empName" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('department')}>

                    Department
                    <SortIndicator field="department" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('componentName')}>

                    Component Name
                    <SortIndicator field="componentName" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('amount')}>

                    Amount
                    <SortIndicator field="amount" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('percentage')}>

                    % of Salary
                    <SortIndicator field="percentage" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedEmployeeData.length === 0 ?
                <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <LayersIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="font-medium">No data found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr> :

                paginatedEmployeeData.map((row) =>
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{row.empName}</p>
                          <p className="text-xs text-slate-500">{row.empId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {DEPARTMENTS.find((d) => d.id === row.department)?.name || row.department}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{row.componentName}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">{row.percentage}%</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={row.componentType === 'earning' ? 'success' : 'destructive'}>
                          {row.componentType}
                        </Badge>
                      </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredEmployeeData.length > 0 &&
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredEmployeeData.length)} of {filteredEmployeeData.length} entries
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

        {/* Component Detail Modal */}
        <Modal
          isOpen={modalType === 'componentDetail'}
          onClose={() => setModalType('none')}
          title={selectedComponent?.componentName || 'Component Details'}
          subtitle={selectedComponent?.componentCode}
          size="lg">

          {selectedComponent &&
          <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedComponent.amount, true)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedComponent.employeeCount}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Average</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedComponent.avgAmount)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Category</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedComponent.category}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Monthly Trend</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedComponent.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={(value) => getMonthLabel(value).split(' ')[0]} />
                      <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={selectedComponent.type === 'earning' ? '#10b981' : '#ef4444'}
                      strokeWidth={2} />

                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Minimum Amount</p>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(selectedComponent.minAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Maximum Amount</p>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(selectedComponent.maxAmount)}</p>
                </div>
              </div>
            </div>
          }
        </Modal>

        {/* Trend Analysis Modal */}
        <Modal
          isOpen={modalType === 'trendAnalysis'}
          onClose={() => setModalType('none')}
          title="Trend Analysis"
          subtitle="5-month earnings and deductions trend"
          size="xl">

          <div className="space-y-6">
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-slate-500">Chart Type:</span>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded ${chartType === 'line' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

                <TrendingUpIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

                <BarChartIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-2 rounded ${chartType === 'area' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>

                <LayersIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[400px]">
              <TrendChart data={monthlyTrendData} type={chartType as 'line' | 'bar' | 'area'} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Avg Monthly Earnings</p>
                <p className="text-xl font-bold text-emerald-900">
                  {formatCurrency(monthlyTrendData.reduce((sum, m) => sum + m.earnings, 0) / monthlyTrendData.length, true)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-red-600 uppercase tracking-wide mb-1">Avg Monthly Deductions</p>
                <p className="text-xl font-bold text-red-900">
                  {formatCurrency(monthlyTrendData.reduce((sum, m) => sum + m.deductions, 0) / monthlyTrendData.length, true)}
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-xs text-indigo-600 uppercase tracking-wide mb-1">Avg Net Payable</p>
                <p className="text-xl font-bold text-indigo-900">
                  {formatCurrency(monthlyTrendData.reduce((sum, m) => sum + m.netPayable, 0) / monthlyTrendData.length, true)}
                </p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Export Modal */}
        <Modal
          isOpen={modalType === 'export'}
          onClose={() => setModalType('none')}
          title="Export Data"
          size="sm">

          <div className="space-y-3">
            <p className="text-sm text-slate-500">Choose export format:</p>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => exportData('csv')}
              leftIcon={<FileTextIcon className="w-4 h-4" />}>

              Export as CSV
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => exportData('excel')}
              leftIcon={<TableIcon className="w-4 h-4" />}>

              Export as Excel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => exportData('pdf')}
              leftIcon={<DownloadIcon className="w-4 h-4" />}>

              Export as PDF
            </Button>
          </div>
        </Modal>
      </div>

      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}