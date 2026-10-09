import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import {
  FileText,
  BookOpen,
  Monitor,
  Calculator,
  Shield,
  Dumbbell,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  User,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Eye,
  AlertTriangle,
  Info,
  RefreshCw,
  X,
  Check,
  Send,
  History,
  UserX,
  Timer,
  DollarSign,
  Award,
  ClipboardCheck,
  ArrowRight,
  Lock, Unlock, Package, Mail, Printer, Pencil, Building2, Microscope, KeyRound, Briefcase, Landmark, Hash
} from 'lucide-react';

// ==================== TYPES ====================
interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: 'Permanent' | 'Contract' | 'Probation';
  status: 'Active' | 'On Notice' | 'Exited' | 'Terminated';
  avatar: string;
  salary: number;
  reportingManager: string;
}

interface ExitRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  resignationDate: string;
  noticePeriod: number;
  lastWorkingDay: string;
  reason: string;
  remarks: string;
  status: 'Pending Approval' | 'Approved' | 'In Progress' | 'Clearance Pending' | 'Completed' | 'Cancelled' | 'On Hold';
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
  clearanceProgress: number;
  isNoticePeriodComplete: boolean;
  daysRemaining: number;
}

interface ClearanceItem {
  id: string;
  department: string;
  icon: React.ReactNode;
  pendingItems: string;
  status: 'pending' | 'cleared' | 'na';
  clearedBy: string;
  clearedAt: string;
  remarks: string;
}

interface SettlementDetails {
  pendingSalary: number;
  leaveEncashment: number;
  leaveDays: number;
  bonus: number;
  deductions: number;
  gratuity: number;
  pf: number;
  totalSettlement: number;
}

interface ExitedEmployee {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  joiningDate: string;
  exitDate: string;
  reason: string;
  totalExperience: string;
  settlementAmount: number;
  documentsIssued: string[];
  exitedBy: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

type MainTab = 'resignation' | 'requests' | 'settlement' | 'assets' | 'process' | 'history';
type RequestFilter = 'all' | 'pending' | 'approved' | 'in_progress' | 'completed';

// ==================== MOCK DATA ====================
const employeesData: Employee[] = [
{
  id: '1',
  code: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  department: 'Mathematics',
  designation: 'HOD - Mathematics',
  joiningDate: '2018-06-15',
  employmentType: 'Permanent',
  status: 'Active',
  avatar: 'RK',
  salary: 85000,
  reportingManager: 'Dr. Sunita Sharma'
},
{
  id: '2',
  code: 'EMP002',
  name: 'Priya Sharma',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  department: 'English',
  designation: 'Senior Teacher',
  joiningDate: '2020-04-01',
  employmentType: 'Permanent',
  status: 'On Notice',
  avatar: 'PS',
  salary: 65000,
  reportingManager: 'Dr. Rajesh Kumar'
},
{
  id: '3',
  code: 'EMP003',
  name: 'Amit Patel',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  department: 'Science',
  designation: 'Science Teacher',
  joiningDate: '2021-07-15',
  employmentType: 'Probation',
  status: 'Active',
  avatar: 'AP',
  salary: 45000,
  reportingManager: 'Dr. Meena Gupta'
},
{
  id: '4',
  code: 'EMP004',
  name: 'Sunita Verma',
  email: 'sunita.verma@school.edu',
  phone: '+91 98765 43213',
  department: 'Administration',
  designation: 'Admin Assistant',
  joiningDate: '2019-01-10',
  employmentType: 'Permanent',
  status: 'On Notice',
  avatar: 'SV',
  salary: 35000,
  reportingManager: 'Mr. Vijay Singh'
},
{
  id: '5',
  code: 'EMP005',
  name: 'Rahul Mehta',
  email: 'rahul.mehta@school.edu',
  phone: '+91 98765 43214',
  department: 'Physical Education',
  designation: 'Sports Coach',
  joiningDate: '2022-08-01',
  employmentType: 'Contract',
  status: 'Active',
  avatar: 'RM',
  salary: 40000,
  reportingManager: 'Mr. Anil Kapoor'
}];


const exitRequestsData: ExitRequest[] = [
{
  id: '1',
  employeeId: '2',
  employeeName: 'Priya Sharma',
  employeeCode: 'EMP002',
  department: 'English',
  designation: 'Senior Teacher',
  resignationDate: '2025-01-01',
  noticePeriod: 30,
  lastWorkingDay: '2025-01-31',
  reason: 'better_opportunity',
  remarks: 'Joining another institution with better pay',
  status: 'In Progress',
  approvedBy: 'HR Admin',
  approvedAt: '2025-01-02',
  createdAt: '2025-01-01',
  clearanceProgress: 60,
  isNoticePeriodComplete: false,
  daysRemaining: 5
},
{
  id: '2',
  employeeId: '4',
  employeeName: 'Sunita Verma',
  employeeCode: 'EMP004',
  department: 'Administration',
  designation: 'Admin Assistant',
  resignationDate: '2024-12-15',
  noticePeriod: 30,
  lastWorkingDay: '2025-01-14',
  reason: 'relocation',
  remarks: 'Family relocating to another city',
  status: 'Clearance Pending',
  approvedBy: 'HR Admin',
  approvedAt: '2024-12-16',
  createdAt: '2024-12-15',
  clearanceProgress: 80,
  isNoticePeriodComplete: true,
  daysRemaining: 0
}];


const exitedEmployeesData: ExitedEmployee[] = [
{
  id: '1',
  employeeId: 'EX001',
  employeeName: 'Vikram Singh',
  employeeCode: 'EMP010',
  department: 'Science',
  designation: 'Lab Assistant',
  joiningDate: '2019-03-01',
  exitDate: '2024-12-31',
  reason: 'Better Opportunity',
  totalExperience: '5 Years 10 Months',
  settlementAmount: 125000,
  documentsIssued: ['Relieving Letter', 'Experience Certificate', 'No Dues Certificate'],
  exitedBy: 'HR Admin'
},
{
  id: '2',
  employeeId: 'EX002',
  employeeName: 'Neha Gupta',
  employeeCode: 'EMP015',
  department: 'Library',
  designation: 'Librarian',
  joiningDate: '2020-06-15',
  exitDate: '2024-11-30',
  reason: 'Higher Studies',
  totalExperience: '4 Years 5 Months',
  settlementAmount: 98000,
  documentsIssued: ['Relieving Letter', 'Experience Certificate'],
  exitedBy: 'HR Manager'
}];


const defaultClearanceItems: ClearanceItem[] = [
{ id: 'library', department: 'Library', icon: <BookOpen className="w-5 h-5" />, pendingItems: '', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' },
{ id: 'it', department: 'IT Department', icon: <Monitor className="w-5 h-5" />, pendingItems: 'Laptop, Access Card, VPN Token', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' },
{ id: 'accounts', department: 'Accounts & Finance', icon: <Calculator className="w-5 h-5" />, pendingItems: '', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' },
{ id: 'admin', department: 'Administration', icon: <Shield className="w-5 h-5" />, pendingItems: 'ID Card, Parking Pass', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' },
{ id: 'sports', department: 'Sports & Recreation', icon: <Dumbbell className="w-5 h-5" />, pendingItems: '', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' },
{ id: 'hr', department: 'Human Resources', icon: <User className="w-5 h-5" />, pendingItems: '', status: 'pending', clearedBy: '', clearedAt: '', remarks: '' }];


const reasonOptions = [
{ value: '', label: 'Select a reason' },
{ value: 'better_opportunity', label: 'Better Opportunity' },
{ value: 'health', label: 'Health Issues' },
{ value: 'relocation', label: 'Relocation' },
{ value: 'higher_studies', label: 'Higher Studies' },
{ value: 'family', label: 'Family Reasons' },
{ value: 'retirement', label: 'Retirement' },
{ value: 'termination', label: 'Termination' },
{ value: 'contract_end', label: 'Contract End' },
{ value: 'other', label: 'Other' }];


// ==================== HELPER FUNCTIONS ====================
const calculateDaysRemaining = (lastWorkingDay: string): number => {
  const today = new Date();
  const lwd = new Date(lastWorkingDay);
  const diff = Math.ceil((lwd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

const calculateTotalExperience = (joiningDate: string, exitDate: string): string => {
  const join = new Date(joiningDate);
  const exit = new Date(exitDate);
  const years = exit.getFullYear() - join.getFullYear();
  const months = exit.getMonth() - join.getMonth();
  const totalMonths = years * 12 + months;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return `${y} Year${y !== 1 ? 's' : ''} ${m} Month${m !== 1 ? 's' : ''}`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ==================== TOAST COMPONENT ====================
const ToastContainer: React.FC<{toasts: Toast[];onDismiss: (id: string) => void;}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getStyle = (type: Toast['type']) => {
    switch (type) {
      case 'success':return 'bg-green-50 border-green-200 text-green-800';
      case 'error':return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[320px] ${getStyle(toast.type)}`}>
          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

// ==================== STEP INDICATOR COMPONENT ====================
const StepIndicator: React.FC<{currentStep: number;steps: string[];}> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) =>
      <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
          index < currentStep ? 'bg-green-500 text-white' :
          index === currentStep ? 'bg-blue-500 text-white' :
          'bg-gray-200 text-gray-500'}`
          }>
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs mt-2 text-center max-w-[80px] ${
          index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`
          }>{step}</span>
          </div>
          {index < steps.length - 1 &&
        <div className={`flex-1 h-1 mx-2 ${
        index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`
        } />
        }
        </React.Fragment>
      )}
    </div>);

};

// ==================== MAIN COMPONENT ====================
// ==================== F&F SETTLEMENT + ASSET RECOVERY (SAMPLE CASE) ====================
type AssetStatus = 'Returned' | 'Pending' | 'Not Returned' | 'Damaged' | 'Waived';
type AssetCategory = 'IT' | 'School' | 'Library' | 'Access';
type AssetDepartment = 'IT' | 'Admin' | 'Library' | 'Lab';
type SectionIcon = React.ComponentType<{ className?: string }>;

interface AssetRecord {
  id: string;
  name: string;
  assetCode: string;
  department: AssetDepartment;
  category: AssetCategory;
  assignedDate: string;
  returnDate: string;
  status: AssetStatus;
  remarks: string;
  damageCharge: number | null;
  damageLabel: string;
}

interface FnfLine {
  key: string;
  component: string;
  basis: string;
  amount: number;
  remarks: string;
}

interface FnfRowView extends FnfLine {
  index: number;
  overridden: boolean;
}

const FNF_MONTHLY_SALARY = 60000;
const FNF_DAILY_RATE = 2000; // monthly salary / 30, as used in the F&F template

const FNF_EMPLOYEE_DETAILS: {icon: SectionIcon;label: string;value: string;}[] = [
{ icon: User, label: 'Employee Name', value: 'Sarah Johnson' },
{ icon: Building2, label: 'Department', value: 'Science Faculty' },
{ icon: Briefcase, label: 'Designation', value: 'Senior Lab Teacher' },
{ icon: Calendar, label: 'Last Working Day', value: '31-Oct-2026' },
{ icon: Landmark, label: 'Bank Name', value: 'State Bank of India' },
{ icon: Hash, label: 'Account Number', value: 'XXXX-XXXX-4782' },
{ icon: Hash, label: 'IFSC Code', value: 'SBIN0004782' }];

const FNF_EARNINGS_BASE: FnfLine[] = [
{ key: 'pending-salary', component: 'Pending Salary (Pro-rated)', basis: '21/31 days × ₹60,000', amount: Math.round(FNF_MONTHLY_SALARY * 21 / 31), remarks: 'Last month partial' },
{ key: 'leave-encashment', component: 'Leave Balance Encashment', basis: '12 days × ₹2,000/day', amount: 12 * FNF_DAILY_RATE, remarks: 'Unused CL + PL' },
{ key: 'reimbursements', component: 'Pending Reimbursements', basis: 'Approved claims', amount: 3500, remarks: 'Travel + Medical' },
{ key: 'bonus', component: 'Performance Bonus', basis: 'Policy-based', amount: 5000, remarks: 'Q2 Bonus' }];

// The asset damage row is filled from the Asset Recovery tab (see the component body).
const FNF_DEDUCTIONS_BASE: FnfLine[] = [
{ key: 'loan', component: 'Pending Loan Recovery', basis: 'Remaining EMIs', amount: 8000, remarks: '2 EMIs pending' },
{ key: 'asset-damage', component: 'Asset Damage Charges', basis: 'Synced from Asset Screen', amount: 0, remarks: '' },
{ key: 'notice-shortfall', component: 'Notice Period Shortfall', basis: '5 days × ₹2,000', amount: 5 * FNF_DAILY_RATE, remarks: 'Served 25/30 days' },
{ key: 'tds', component: 'TDS Deduction', basis: 'As per IT slab', amount: 4500, remarks: 'Form 16 applicable' }];

const FNF_APPROVALS = [
{ title: 'HR Approved', person: 'Priya Nair', date: '29-Oct-2026', done: true },
{ title: 'Finance Approved', person: 'Ravi Kumar', date: '30-Oct-2026', done: true },
{ title: 'Management Pending', person: 'Principal Sign-Off', date: '31-Oct-2026', done: false }];

const FNF_PAYMENT_MODES = [
{ value: 'bank', label: 'Bank Transfer' },
{ value: 'cheque', label: 'Cheque' },
{ value: 'cash', label: 'Cash' }];

const ASSET_STATUS_OPTIONS: {value: AssetStatus;label: string;}[] = [
{ value: 'Returned', label: 'Returned' },
{ value: 'Pending', label: 'Pending' },
{ value: 'Not Returned', label: 'Not Returned' },
{ value: 'Damaged', label: 'Damaged' },
{ value: 'Waived', label: 'Waived' }];

const FNF_ASSET_RECORDS: AssetRecord[] = [
{ id: 'ast-lt-209', name: 'Laptop — Dell XPS', assetCode: 'LT-209', department: 'IT', category: 'IT', assignedDate: '12-Jan-2022', returnDate: '30-Oct-2026', status: 'Returned', remarks: 'Good Condition', damageCharge: null, damageLabel: '—' },
{ id: 'ast-mb-047', name: 'Mobile Device', assetCode: 'MB-047', department: 'IT', category: 'IT', assignedDate: '01-Apr-2023', returnDate: '30-Oct-2026', status: 'Returned', remarks: 'Returned with charger', damageCharge: null, damageLabel: '—' },
{ id: 'ast-usb-014', name: 'USB Security Dongle', assetCode: 'USB-014', department: 'IT', category: 'IT', assignedDate: '15-Mar-2023', returnDate: '31-Oct-2026', status: 'Pending', remarks: 'To be returned on LWD', damageCharge: null, damageLabel: '—' },
{ id: 'ast-idc-247', name: 'Employee ID Card', assetCode: 'IDC-247', department: 'Admin', category: 'School', assignedDate: '12-Jan-2022', returnDate: '30-Oct-2026', status: 'Returned', remarks: 'Collected & Cancelled', damageCharge: null, damageLabel: '—' },
{ id: 'ast-acc-089', name: 'Access Badge', assetCode: 'ACC-089', department: 'Admin', category: 'Access', assignedDate: '12-Jan-2022', returnDate: '30-Oct-2026', status: 'Returned', remarks: 'Deactivated', damageCharge: null, damageLabel: '—' },
{ id: 'ast-key-12b', name: 'Classroom Key Set', assetCode: 'KEY-12B', department: 'Admin', category: 'Access', assignedDate: '12-Jan-2022', returnDate: '31-Oct-2026', status: 'Returned', remarks: 'All 3 keys returned', damageCharge: null, damageLabel: '—' },
{ id: 'ast-unf-047', name: 'School Uniform (x2)', assetCode: 'UNF-047', department: 'Admin', category: 'School', assignedDate: '12-Jan-2022', returnDate: '31-Oct-2026', status: 'Damaged', remarks: 'One set torn/stained', damageCharge: 2500, damageLabel: '₹ 2,500' },
{ id: 'ast-spk-019', name: 'Sports Kit', assetCode: 'SPK-019', department: 'Admin', category: 'School', assignedDate: '10-Jun-2023', returnDate: '31-Oct-2026', status: 'Not Returned', remarks: 'Employee claims lost', damageCharge: null, damageLabel: '₹ TBD' },
{ id: 'ast-bk-1092', name: 'Physics Reference Book', assetCode: 'BK-1092', department: 'Library', category: 'Library', assignedDate: '14-Feb-2022', returnDate: '28-Oct-2026', status: 'Not Returned', remarks: 'Follow-up needed', damageCharge: null, damageLabel: '—' },
{ id: 'ast-bk-2047', name: 'Lab Manual Vol. 3', assetCode: 'BK-2047', department: 'Library', category: 'Library', assignedDate: '14-Feb-2022', returnDate: '28-Oct-2026', status: 'Not Returned', remarks: 'Overdue by 3 days', damageCharge: null, damageLabel: '—' },
{ id: 'ast-bk-3011', name: 'Smart Board Manual', assetCode: 'BK-3011', department: 'Library', category: 'Library', assignedDate: '20-Mar-2023', returnDate: '28-Oct-2026', status: 'Pending', remarks: 'Expected today', damageCharge: null, damageLabel: '—' },
{ id: 'ast-lab-047', name: 'Microscope Set', assetCode: 'LAB-047', department: 'Lab', category: 'School', assignedDate: '12-Jan-2022', returnDate: '31-Oct-2026', status: 'Returned', remarks: 'Returned intact', damageCharge: null, damageLabel: '—' },
{ id: 'ast-lab-088', name: 'Chemistry Kits (x3)', assetCode: 'LAB-088', department: 'Lab', category: 'School', assignedDate: '01-Jun-2022', returnDate: '31-Oct-2026', status: 'Pending', remarks: 'Awaiting lab closure', damageCharge: null, damageLabel: '—' }];

const ASSET_CATEGORY_ROWS: {key: AssetCategory;label: string;icon: SectionIcon;}[] = [
{ key: 'IT', label: 'IT Assets', icon: Monitor },
{ key: 'School', label: 'School Assets', icon: Building2 },
{ key: 'Library', label: 'Library Assets', icon: BookOpen },
{ key: 'Access', label: 'Access & Keys', icon: KeyRound }];

const ASSET_DEPARTMENT_GROUPS: {key: AssetDepartment;label: string;icon: SectionIcon;}[] = [
{ key: 'IT', label: 'IT Department', icon: Monitor },
{ key: 'Admin', label: 'Admin Department', icon: Building2 },
{ key: 'Library', label: 'Library', icon: BookOpen },
{ key: 'Lab', label: 'Lab Coordinator', icon: Microscope }];

const formatFnfAmount = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;

export function EmployeeExitSeparation() {
  const navigate = useNavigate();
  // Tab State
  const [activeTab, setActiveTab] = useState<MainTab>('resignation');

  // Employee & Request State
  const [employees] = useState<Employee[]>(employeesData);
  const [exitRequests, setExitRequests] = useState<ExitRequest[]>(exitRequestsData);
  const [exitedEmployees, setExitedEmployees] = useState<ExitedEmployee[]>(exitedEmployeesData);

  // Search & Filter State
  const [historySearch, setHistorySearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestFilter>('all');

  // Selection State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ExitRequest | null>(null);

  // Modal State
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showConfirmExitModal, setShowConfirmExitModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Form State
  const [resignationForm, setResignationForm] = useState({
    resignationDate: '',
    noticePeriod: 30,
    lastWorkingDay: '',
    reason: '',
    remarks: ''
  });

  // Clearance State
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>(defaultClearanceItems);
  const [currentStep, setCurrentStep] = useState(0);

  // Settlement State
  const [settlementDetails, setSettlementDetails] = useState<SettlementDetails>({
    pendingSalary: 0,
    leaveEncashment: 0,
    leaveDays: 0,
    bonus: 0,
    deductions: 0,
    gratuity: 0,
    pf: 0,
    totalSettlement: 0
  });

  // Document State
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Notice period edit (after submission)
  const [noticeEditRequest, setNoticeEditRequest] = useState<ExitRequest | null>(null);
  const [noticeEditDays, setNoticeEditDays] = useState(30);

  // Tab 3: full & final settlement
  const [fnfOverrides, setFnfOverrides] = useState<Record<string, number>>({});
  const [fnfEditingKey, setFnfEditingKey] = useState<string | null>(null);
  const [fnfEditValue, setFnfEditValue] = useState('');
  const [fnfPaymentMode, setFnfPaymentMode] = useState('bank');
  const [fnfPaymentStatus, setFnfPaymentStatus] = useState<'Pending' | 'Paid'>('Pending');
  const [fnfLocked, setFnfLocked] = useState(false);

  // Tab 4: asset recovery
  const [assetRecords, setAssetRecords] = useState<AssetRecord[]>(FNF_ASSET_RECORDS);
  const [waiverRequested, setWaiverRequested] = useState(false);
  const [assetClearanceConfirmed, setAssetClearanceConfirmed] = useState(false);

  // Steps for exit process
  const exitSteps = ['Resignation', 'Approval', 'Notice Period', 'Clearance', 'Settlement', 'Exit'];

  // ==================== TOAST HELPERS ====================
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ==================== COMPUTED VALUES ====================

  const filteredRequests = useMemo(() => {
    return exitRequests.filter((req) => {
      const matchesDept = !departmentFilter || req.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' ||
      statusFilter === 'pending' && req.status === 'Pending Approval' ||
      statusFilter === 'approved' && req.status === 'Approved' ||
      statusFilter === 'in_progress' && (req.status === 'In Progress' || req.status === 'Clearance Pending') ||
      statusFilter === 'completed' && req.status === 'Completed';
      return matchesDept && matchesStatus;
    });
  }, [exitRequests, departmentFilter, statusFilter]);

  const filteredExitedEmployees = useMemo(() => {
    const term = historySearch.trim().toLowerCase();
    if (!term) return exitedEmployees;
    return exitedEmployees.filter((employee) =>
      [employee.employeeName, employee.employeeId, employee.employeeCode, employee.department, employee.designation]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [exitedEmployees, historySearch]);

  const requestStats = useMemo(() => ({
    total: exitRequests.length,
    pending: exitRequests.filter((r) => r.status === 'Pending Approval').length,
    inProgress: exitRequests.filter((r) => ['In Progress', 'Clearance Pending', 'Approved'].includes(r.status)).length,
    completed: exitRequests.filter((r) => r.status === 'Completed').length,
    noticePeriodComplete: exitRequests.filter((r) => r.isNoticePeriodComplete && r.status !== 'Completed').length
  }), [exitRequests]);

  const clearanceStats = useMemo(() => {
    const cleared = clearanceItems.filter((item) => item.status === 'cleared').length;
    const na = clearanceItems.filter((item) => item.status === 'na').length;
    const total = clearanceItems.length - na;
    return { cleared, total, percentage: total > 0 ? Math.round(cleared / total * 100) : 0 };
  }, [clearanceItems]);

  const allClearancesComplete = useMemo(() => {
    return clearanceItems.every((item) => item.status === 'cleared' || item.status === 'na');
  }, [clearanceItems]);

  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))];
    return depts.map((d) => ({ value: d, label: d }));
  }, [employees]);

  // ==================== HANDLERS ====================
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    // Pre-fill form
    setResignationForm({
      resignationDate: new Date().toISOString().split('T')[0],
      noticePeriod: employee.employmentType === 'Probation' ? 15 : 30,
      lastWorkingDay: '',
      reason: '',
      remarks: ''
    });
  };

  const calculateLastWorkingDay = (resignationDate: string, noticePeriod: number): string => {
    if (!resignationDate) return '';
    const date = new Date(resignationDate);
    date.setDate(date.getDate() + noticePeriod);
    return date.toISOString().split('T')[0];
  };

  const handleResignationDateChange = (value: string) => {
    setResignationForm((prev) => ({
      ...prev,
      resignationDate: value,
      lastWorkingDay: calculateLastWorkingDay(value, prev.noticePeriod)
    }));
  };

  const handleNoticePeriodChange = (value: number) => {
    setResignationForm((prev) => ({
      ...prev,
      noticePeriod: value,
      lastWorkingDay: calculateLastWorkingDay(prev.resignationDate, value)
    }));
  };

  const handleSubmitResignation = () => {
    if (!selectedEmployee) {
      addToast('error', 'Please select an employee');
      return;
    }
    if (!resignationForm.resignationDate || !resignationForm.reason) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newRequest: ExitRequest = {
        id: Date.now().toString(),
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        employeeCode: selectedEmployee.code,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation,
        resignationDate: resignationForm.resignationDate,
        noticePeriod: resignationForm.noticePeriod,
        lastWorkingDay: resignationForm.lastWorkingDay,
        reason: resignationForm.reason,
        remarks: resignationForm.remarks,
        status: 'Pending Approval',
        approvedBy: '',
        approvedAt: '',
        createdAt: new Date().toISOString(),
        clearanceProgress: 0,
        isNoticePeriodComplete: false,
        daysRemaining: calculateDaysRemaining(resignationForm.lastWorkingDay)
      };
      setExitRequests((prev) => [newRequest, ...prev]);
      setActiveTab('requests');
      setSelectedEmployee(null);
      setResignationForm({ resignationDate: '', noticePeriod: 30, lastWorkingDay: '', reason: '', remarks: '' });
      setIsSaving(false);
      addToast('success', 'Resignation request submitted successfully');
    }, 1500);
  };

  const handleApproveRequest = (requestId: string) => {
    setExitRequests((prev) =>
    prev.map((req) =>
    req.id === requestId ?
    { ...req, status: 'Approved', approvedBy: 'Current User', approvedAt: new Date().toISOString() } :
    req
    )
    );
    addToast('success', 'Request approved successfully');
  };

  const handleRejectRequest = (requestId: string) => {
    setExitRequests((prev) =>
    prev.map((req) =>
    req.id === requestId ?
    { ...req, status: 'Cancelled' } :
    req
    )
    );
    addToast('info', 'Request rejected');
  };

  const handleStartProcessing = (request: ExitRequest) => {
    setSelectedRequest(request);
    setClearanceItems(defaultClearanceItems.map((item) => ({ ...item, status: 'pending', clearedBy: '', clearedAt: '', remarks: '' })));
    // Calculate current step based on status
    let step = 0;
    if (request.status === 'Approved') step = 2;else
    if (request.status === 'In Progress') step = request.isNoticePeriodComplete ? 3 : 2;else
    if (request.status === 'Clearance Pending') step = 3;
    setCurrentStep(step);

    // Calculate settlement
    const emp = employees.find((e) => e.id === request.employeeId);
    if (emp) {
      const pendingSalary = Math.round(emp.salary * (request.daysRemaining / 30));
      const leaveDays = Math.floor(Math.random() * 15) + 5;
      const leaveEncashment = Math.round(emp.salary / 30 * leaveDays);
      const gratuity = emp.employmentType === 'Permanent' ? Math.round(emp.salary * 0.5) : 0;
      const pf = Math.round(emp.salary * 0.12 * 6);
      const deductions = Math.round(emp.salary * 0.1);
      setSettlementDetails({
        pendingSalary,
        leaveEncashment,
        leaveDays,
        bonus: 0,
        deductions,
        gratuity,
        pf,
        totalSettlement: pendingSalary + leaveEncashment + gratuity + pf - deductions
      });
    }

    setShowProcessModal(true);

    // Update request status
    if (request.status === 'Approved') {
      setExitRequests((prev) =>
      prev.map((req) =>
      req.id === request.id ?
      { ...req, status: 'In Progress' } :
      req
      )
      );
    }
  };

  const handleClearanceToggle = (id: string, newStatus: 'pending' | 'cleared' | 'na') => {
    setClearanceItems((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          clearedBy: newStatus === 'cleared' ? 'Current User' : '',
          clearedAt: newStatus === 'cleared' ? new Date().toLocaleString() : ''
        };
      }
      return item;
    })
    );
  };

  const handleClearanceRemarksChange = (id: string, remarks: string) => {
    setClearanceItems((prev) =>
    prev.map((item) => item.id === id ? { ...item, remarks } : item)
    );
  };

  const handlePendingItemsChange = (id: string, pendingItems: string) => {
    setClearanceItems((prev) =>
    prev.map((item) => item.id === id ? { ...item, pendingItems } : item)
    );
  };

  const handleProceedToSettlement = () => {
    if (!allClearancesComplete) {
      addToast('error', 'Please complete all clearances first');
      return;
    }
    setCurrentStep(4);
    // Update request status
    if (selectedRequest) {
      setExitRequests((prev) =>
      prev.map((req) =>
      req.id === selectedRequest.id ?
      { ...req, status: 'Clearance Pending', clearanceProgress: 100 } :
      req
      )
      );
    }
  };

  const handleGenerateDocuments = () => {
    setShowDocumentModal(true);
  };

  const handleDownloadDocuments = () => {
    if (selectedDocuments.length === 0) {
      addToast('error', 'Please select at least one document');
      return;
    }
    addToast('success', `Downloading ${selectedDocuments.length} document(s)`);
    setShowDocumentModal(false);
  };

  const handleConfirmExit = () => {
    setShowConfirmExitModal(true);
  };

  const handleFinalExit = () => {
    if (!selectedRequest) return;

    setIsSaving(true);
    setTimeout(() => {
      // Create exited employee record
      const emp = employees.find((e) => e.id === selectedRequest.employeeId);
      const newExited: ExitedEmployee = {
        id: Date.now().toString(),
        employeeId: selectedRequest.employeeId,
        employeeName: selectedRequest.employeeName,
        employeeCode: selectedRequest.employeeCode,
        department: selectedRequest.department,
        designation: selectedRequest.designation,
        joiningDate: emp?.joiningDate || '',
        exitDate: selectedRequest.lastWorkingDay,
        reason: reasonOptions.find((r) => r.value === selectedRequest.reason)?.label || selectedRequest.reason,
        totalExperience: calculateTotalExperience(emp?.joiningDate || '', selectedRequest.lastWorkingDay),
        settlementAmount: settlementDetails.totalSettlement,
        documentsIssued: selectedDocuments,
        exitedBy: 'Current User'
      };
      setExitedEmployees((prev) => [newExited, ...prev]);

      // Update request status
      setExitRequests((prev) =>
      prev.map((req) =>
      req.id === selectedRequest.id ?
      { ...req, status: 'Completed' } :
      req
      )
      );

      setShowConfirmExitModal(false);
      setShowProcessModal(false);
      setSelectedRequest(null);
      setCurrentStep(0);
      setSelectedDocuments([]);
      setIsSaving(false);
      addToast('success', 'Employee exit completed successfully');
    }, 2000);
  };

  const handleCheckNoticePeriod = () => {
    // Check and update notice period status for all requests
    setExitRequests((prev) =>
    prev.map((req) => {
      const daysRemaining = calculateDaysRemaining(req.lastWorkingDay);
      return {
        ...req,
        daysRemaining,
        isNoticePeriodComplete: daysRemaining === 0
      };
    })
    );
    addToast('info', 'Notice period status updated');
  };

  const handleOpenNoticePeriods = () => {
    setActiveTab('requests');
    handleCheckNoticePeriod();
    // This route is retained as the Employee Separation / Exit entry point;
    // both legacy navigation IDs now render this combined workspace.
    navigate('/hr/employee/employee-separation-exit');
  };

  // ---- Tab 1: resignation form. The employee is chosen inside the form (no search gate). ----
  const activeEmployeeOptions = employees.
  filter((emp) => emp.status === 'Active').
  map((emp) => ({ value: emp.id, label: `${emp.name} (${emp.code})` }));

  const handleResignationEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) {
      setSelectedEmployee(null);
      return;
    }
    handleEmployeeSelect(employee);
  };

  const handleResetResignation = () => {
    setSelectedEmployee(null);
    setResignationForm({ resignationDate: '', noticePeriod: 30, lastWorkingDay: '', reason: '', remarks: '' });
  };

  // ---- Notice period can be edited after a resignation is submitted ----
  const openNoticeEdit = (request: ExitRequest) => {
    setNoticeEditRequest(request);
    setNoticeEditDays(request.noticePeriod);
  };

  const closeNoticeEdit = () => setNoticeEditRequest(null);

  const handleSaveNoticePeriod = () => {
    if (!noticeEditRequest) return;
    if (!Number.isFinite(noticeEditDays) || noticeEditDays < 0) {
      addToast('error', 'Notice period must be 0 days or more');
      return;
    }
    const newLastWorkingDay = calculateLastWorkingDay(noticeEditRequest.resignationDate, noticeEditDays);
    setExitRequests((prev) =>
    prev.map((req) =>
    req.id === noticeEditRequest.id ?
    { ...req, noticePeriod: noticeEditDays, lastWorkingDay: newLastWorkingDay, daysRemaining: calculateDaysRemaining(newLastWorkingDay) } :
    req
    )
    );
    setNoticeEditRequest(null);
    addToast('success', `Notice period updated to ${noticeEditDays} days`);
  };

  // ---- Tab 4: asset recovery derived values ----
  const countAssets = (items: AssetRecord[]) => ({
    total: items.length,
    returned: items.filter((a) => a.status === 'Returned').length,
    pending: items.filter((a) => a.status === 'Pending').length,
    notReturned: items.filter((a) => a.status === 'Not Returned').length,
    damaged: items.filter((a) => a.status === 'Damaged').length
  });
  const assetTotals = countAssets(assetRecords);
  const assetClearanceUnlocked = assetRecords.every((a) => a.status === 'Returned' || a.status === 'Waived');
  const syncedDamageAsset = assetRecords.find((a) => a.damageCharge !== null && a.status !== 'Waived');
  const syncedDamageCharge = assetRecords.reduce((sum, a) => sum + (a.status !== 'Waived' && a.damageCharge !== null ? a.damageCharge : 0), 0);

  // ---- Tab 3: F&F settlement derived values (asset damage is synced from tab 4) ----
  const fnfEarningRows: FnfRowView[] = FNF_EARNINGS_BASE.map((row, i) => ({
    ...row,
    index: i + 1,
    amount: fnfOverrides[row.key] ?? row.amount,
    overridden: row.key in fnfOverrides
  }));
  const fnfDeductionRows: FnfRowView[] = FNF_DEDUCTIONS_BASE.map((row, i) => {
    const isAssetRow = row.key === 'asset-damage';
    return {
      ...row,
      index: i + 1,
      remarks: isAssetRow ? (syncedDamageAsset ? `${syncedDamageAsset.name} (${syncedDamageAsset.assetCode})` : 'No damage charge') : row.remarks,
      amount: fnfOverrides[row.key] ?? (isAssetRow ? syncedDamageCharge : row.amount),
      overridden: row.key in fnfOverrides
    };
  });
  const fnfTotalEarnings = fnfEarningRows.reduce((sum, row) => sum + row.amount, 0);
  const fnfTotalDeductions = fnfDeductionRows.reduce((sum, row) => sum + row.amount, 0);
  const fnfNetPayable = fnfTotalEarnings - fnfTotalDeductions;

  const startFnfOverride = (row: FnfRowView) => {
    if (fnfLocked) return;
    setFnfEditingKey(row.key);
    setFnfEditValue(String(row.amount));
  };

  const commitFnfOverride = (key: string) => {
    const value = Number(fnfEditValue);
    if (fnfEditValue.trim() === '' || !Number.isFinite(value) || value < 0) {
      addToast('error', 'Enter an amount of 0 or more');
      return;
    }
    setFnfOverrides((prev) => ({ ...prev, [key]: Math.round(value) }));
    setFnfEditingKey(null);
    addToast('success', 'Amount overridden');
  };

  const clearFnfOverride = (key: string) => {
    setFnfOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleMarkFnfPaid = () => {
    setFnfPaymentStatus('Paid');
    addToast('success', 'F&F settlement marked as paid');
  };

  const handleLockFnf = () => {
    setFnfEditingKey(null);
    setFnfLocked(true);
    addToast('info', 'F&F settlement locked and archived');
  };

  const handleEmailFnf = () => {
    addToast('info', 'F&F statement email queued (mock: connect the mail service to send)');
  };

  const handleGenerateFnfPdf = () => {
    const rowHtml = (row: FnfRowView) => `<tr><td>${row.index}</td><td>${row.component}</td><td>${row.basis}</td><td style="text-align:right">${formatFnfAmount(row.amount)}</td></tr>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Full and Final Settlement</title>
<style>body{font-family:Arial,sans-serif;padding:24px;color:#111}table{width:100%;border-collapse:collapse;margin:8px 0 16px}td,th{border-bottom:1px solid #ddd;padding:6px;text-align:left;font-size:13px}h1{font-size:20px}h2{font-size:15px;margin-top:20px}.net{font-size:18px;font-weight:bold}</style>
</head><body>
<h1>Full and Final (F&amp;F) Settlement</h1>
<p>${FNF_EMPLOYEE_DETAILS.slice(0, 3).map((d) => d.value).join(' | ')}</p>
<h2>Earnings</h2>
<table>${fnfEarningRows.map(rowHtml).join('')}<tr><th colspan="3">Total Earnings</th><th style="text-align:right">${formatFnfAmount(fnfTotalEarnings)}</th></tr></table>
<h2>Deductions</h2>
<table>${fnfDeductionRows.map(rowHtml).join('')}<tr><th colspan="3">Total Deductions</th><th style="text-align:right">${formatFnfAmount(fnfTotalDeductions)}</th></tr></table>
<p class="net">Net Payable: ${formatFnfAmount(fnfNetPayable)}</p>
</body></html>`;
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        addToast('error', 'Allow pop-ups to generate the F&F statement');
        return;
      }
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch {
      addToast('error', 'Could not open the F&F statement');
    }
  };

  const updateAssetStatus = (assetId: string, status: AssetStatus) => {
    setAssetRecords((prev) => prev.map((asset) => asset.id === assetId ? { ...asset, status } : asset));
  };

  const handleRequestWaiver = () => {
    setWaiverRequested(true);
    addToast('info', `Management waiver requested for ${assetTotals.notReturned + assetTotals.damaged} asset(s)`);
  };

  const handleConfirmAssetClearance = () => {
    if (!assetClearanceUnlocked) return;
    setAssetClearanceConfirmed(true);
    addToast('success', 'Final asset clearance confirmed');
  };

  const handleExportAssetReport = () => {
    const header = ['Department', 'Asset Name', 'Asset ID', 'Assigned Date', 'Return Date', 'Status', 'Remarks', 'Damage Charge'];
    const lines = assetRecords.map((asset) => [
    asset.department,
    asset.name,
    asset.assetCode,
    asset.assignedDate,
    asset.returnDate,
    asset.status,
    asset.remarks,
    asset.damageCharge !== null ? String(asset.damageCharge) : asset.damageLabel]);
    const csv = [header, ...lines].
    map((cells) => cells.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).
    join('\n');
    try {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asset-recovery-report.csv';
      link.click();
      URL.revokeObjectURL(url);
      addToast('success', 'Asset report exported');
    } catch {
      addToast('error', 'Could not export the asset report');
    }
  };

  const renderFnfOverrideCell = (row: FnfRowView) => {
    if (fnfEditingKey === row.key) {
      return (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            autoFocus
            value={fnfEditValue}
            onChange={(e) => setFnfEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitFnfOverride(row.key);
              if (e.key === 'Escape') setFnfEditingKey(null);
            }}
            className="w-28 px-2 py-1 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <button type="button" title="Save override" onClick={() => commitFnfOverride(row.key)} className="p-1 rounded hover:bg-green-50">
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button type="button" title="Cancel" onClick={() => setFnfEditingKey(null)} className="p-1 rounded hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>);

    }
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          title="Override amount"
          disabled={fnfLocked}
          onClick={() => startFnfOverride(row)}
          className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">

          <Pencil className="w-3.5 h-3.5 text-gray-600" />
        </button>
        {row.overridden &&
        <>
            <Badge variant="warning">Overridden</Badge>
            {!fnfLocked &&
          <button type="button" onClick={() => clearFnfOverride(row.key)} className="text-xs text-blue-600 hover:underline">Reset</button>
          }
          </>
        }
      </div>);

  };

  const renderFnfSection = (title: string, Icon: SectionIcon, rows: FnfRowView[], totalLabel: string, total: number, isEarnings: boolean) =>
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">{isEarnings ? 'Earnings Component' : 'Deduction Component'}</th>
              <th className="px-4 py-2 font-medium">Calculation Basis</th>
              <th className="px-4 py-2 font-medium text-right">Amount (₹)</th>
              <th className="px-4 py-2 font-medium">Override</th>
              <th className="px-4 py-2 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) =>
            <tr key={row.key} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 text-gray-500">{row.index}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isEarnings ? 'bg-green-500' : 'bg-red-500'}`} />
                    {row.component}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{row.basis}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatFnfAmount(row.amount)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{renderFnfOverrideCell(row)}</td>
                <td className="px-4 py-3 text-gray-600">{row.remarks}</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50 font-semibold text-gray-900">
            <tr>
              <td className="px-4 py-3" colSpan={3}>{totalLabel}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">{formatFnfAmount(total)}</td>
              <td className="px-4 py-3" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>;


  // Request table columns
  const requestColumns = [
  {
    key: 'employee',
    header: 'Employee',
    render: (row: ExitRequest) =>
    <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-semibold text-red-600">
            {row.employeeName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.employeeName}</p>
            <p className="text-xs text-gray-500">{row.employeeCode}</p>
          </div>
        </div>

  },
  {
    key: 'department',
    header: 'Dept / Designation',
    render: (row: ExitRequest) =>
    <div>
          <p className="font-medium text-gray-900">{row.department}</p>
          <p className="text-xs text-gray-500">{row.designation}</p>
        </div>

  },
  {
    key: 'dates',
    header: 'Resignation / LWD',
    render: (row: ExitRequest) =>
    <div>
          <p className="text-sm text-gray-900">{formatDate(row.resignationDate)}</p>
          <p className="text-xs text-gray-500">LWD: {formatDate(row.lastWorkingDay)}</p>
        </div>

  },
  {
    key: 'noticePeriod',
    header: 'Notice Period',
    render: (row: ExitRequest) =>
    <div>
          <p className="text-sm text-gray-900">{row.noticePeriod} days</p>
          {row.status !== 'Completed' &&
      <Badge
        variant={row.daysRemaining === 0 ? 'success' : row.daysRemaining <= 7 ? 'warning' : 'secondary'}
        className="text-xs mt-1">

              {row.daysRemaining === 0 ? 'Complete' : `${row.daysRemaining} days left`}
            </Badge>
      }
        </div>

  },
  {
    key: 'clearance',
    header: 'Clearance',
    render: (row: ExitRequest) =>
    <div className="w-24">
          <div className="flex justify-between text-xs mb-1">
            <span>{row.clearanceProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
          className={`h-2 rounded-full ${
          row.clearanceProgress === 100 ? 'bg-green-500' :
          row.clearanceProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`
          }
          style={{ width: `${row.clearanceProgress}%` }} />

          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ExitRequest) => {
      const statusConfig: Record<string, {variant: 'success' | 'warning' | 'danger' | 'primary' | 'secondary';icon: React.ReactNode;}> = {
        'Pending Approval': { variant: 'warning', icon: <Clock className="w-3 h-3" /> },
        'Approved': { variant: 'primary', icon: <Check className="w-3 h-3" /> },
        'In Progress': { variant: 'primary', icon: <RefreshCw className="w-3 h-3" /> },
        'Clearance Pending': { variant: 'warning', icon: <ClipboardCheck className="w-3 h-3" /> },
        'Completed': { variant: 'success', icon: <CheckCircle className="w-3 h-3" /> },
        'Cancelled': { variant: 'danger', icon: <XCircle className="w-3 h-3" /> },
        'On Hold': { variant: 'secondary', icon: <AlertCircle className="w-3 h-3" /> }
      };
      const config = statusConfig[row.status] || { variant: 'secondary', icon: null };
      return (
        <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
            {config.icon}
            {row.status}
          </Badge>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ExitRequest) =>
    <div className="flex gap-1">
          {row.status === 'Pending Approval' &&
      <>
              <Button variant="ghost" size="sm" onClick={() => handleApproveRequest(row.id)} title="Approve">
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRejectRequest(row.id)} title="Reject">
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </>
      }
          {['Approved', 'In Progress', 'Clearance Pending'].includes(row.status) &&
      <Button variant="outline" size="sm" onClick={() => handleStartProcessing(row)}>
              <ArrowRight className="w-4 h-4 mr-1" />
              Process
            </Button>
      }
          {!['Completed', 'Cancelled'].includes(row.status) &&
      <Button variant="outline" size="sm" onClick={() => openNoticeEdit(row)} title="Edit notice period">
              <Clock className="w-4 h-4 mr-1" />
              Notice
            </Button>
          }
          {row.status === 'Completed' &&
      <Button variant="ghost" size="sm" title="View Details">
              <Eye className="w-4 h-4" />
            </Button>
      }
        </div>

  }];


  // Exited employees table columns
  const exitedColumns = [
  {
    key: 'employee',
    header: 'Employee',
    render: (row: ExitedEmployee) =>
    <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-600">
            {row.employeeName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.employeeName}</p>
            <p className="text-xs text-gray-500">{row.employeeCode}</p>
          </div>
        </div>

  },
  {
    key: 'department',
    header: 'Department',
    render: (row: ExitedEmployee) =>
    <div>
          <p className="font-medium text-gray-900">{row.department}</p>
          <p className="text-xs text-gray-500">{row.designation}</p>
        </div>

  },
  {
    key: 'exitDate',
    header: 'Exit Date',
    render: (row: ExitedEmployee) => <span className="text-sm">{formatDate(row.exitDate)}</span>
  },
  {
    key: 'experience',
    header: 'Experience',
    render: (row: ExitedEmployee) => <span className="text-sm">{row.totalExperience}</span>
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: ExitedEmployee) => <Badge variant="secondary">{row.reason}</Badge>
  },
  {
    key: 'settlement',
    header: 'Settlement',
    render: (row: ExitedEmployee) => <span className="font-medium">₹{row.settlementAmount.toLocaleString()}</span>
  },
  {
    key: 'documents',
    header: 'Documents',
    render: (row: ExitedEmployee) =>
    <div className="flex gap-1">
          {row.documentsIssued.map((doc, i) =>
      <Badge key={i} variant="primary" className="text-xs">{doc.split(' ')[0]}</Badge>
      )}
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <Button variant="ghost" size="sm" title="Download Documents">
          <Download className="w-4 h-4" />
        </Button>

  }];


  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserX className="w-7 h-7 text-red-600" />
            Employee Exit & Separation
          </h1>
          <p className="text-sm text-gray-500">Track employees in notice or exit processing and review employees who have already left.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleOpenNoticePeriods} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Check Notice Periods
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('resignation')} leftIcon={<Plus className="w-4 h-4" />}>
            New Exit Request
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requestStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{requestStats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{requestStats.inProgress}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notice Complete</p>
              <p className="text-2xl font-bold text-gray-900">{requestStats.noticePeriodComplete}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Timer className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{requestStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="p-0 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white overflow-x-auto">
          <nav className="flex -mb-px min-w-max">
            {[
            { id: 'resignation' as MainTab, label: 'Resignation Form', icon: Send, count: undefined },
            { id: 'requests' as MainTab, label: 'Leaving / Exit Requests', icon: FileText, count: requestStats.total },
            { id: 'settlement' as MainTab, label: 'Full & Final Settlement', icon: Calculator, count: undefined },
            { id: 'assets' as MainTab, label: 'Asset Recovery', icon: Package, count: undefined },
            { id: 'history' as MainTab, label: 'Employees Already Left', icon: History, count: exitedEmployees.length }].
            map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive ?
                  'border-blue-500 text-blue-600 bg-blue-50/50' :
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }>

                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                  {tab.count !== undefined &&
                  <Badge variant={isActive ? 'primary' : 'secondary'}>{tab.count}</Badge>
                  }
                </button>);

            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Resignation Form Tab */}
          {activeTab === 'resignation' &&
          <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Resignation Form</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Select the employee and record the resignation. After submission, the notice period can be edited from the Leaving / Exit Requests tab.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedEmployee?.id ?? ''}
                  onChange={(val) => handleResignationEmployeeChange(val)}
                  options={[{ value: '', label: 'Select an active employee' }, ...activeEmployeeOptions]} />

              </div>

              {selectedEmployee &&
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
                    {selectedEmployee.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{selectedEmployee.name}</h4>
                    <p className="text-sm text-gray-600">{selectedEmployee.code} • {selectedEmployee.designation}</p>
                    <p className="text-sm text-gray-500">{selectedEmployee.department} • Joined: {formatDate(selectedEmployee.joiningDate)}</p>
                  </div>
                  <Badge variant="secondary">{selectedEmployee.employmentType}</Badge>
                </div>
              }

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Resignation Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={resignationForm.resignationDate}
                    onChange={(e) => handleResignationDateChange(e.target.value)} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Notice Period (Days)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={resignationForm.noticePeriod}
                    onChange={(e) => handleNoticePeriodChange(parseInt(e.target.value) || 0)} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Working Day (Auto-calculated)</label>
                  <Input
                    type="date"
                    value={resignationForm.lastWorkingDay}
                    onChange={(e) => setResignationForm((prev) => ({ ...prev, lastWorkingDay: e.target.value }))}
                    className="bg-gray-50" />

                </div>
                <Select
                  label="Reason for Leaving *"
                  value={resignationForm.reason}
                  onChange={(val) => setResignationForm((prev) => ({ ...prev, reason: val }))}
                  options={reasonOptions} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Remarks
                </label>
                <textarea
                  value={resignationForm.remarks}
                  onChange={(e) => setResignationForm((prev) => ({ ...prev, remarks: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes..." />

              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={handleResetResignation}>Clear Form</Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitResignation}
                  disabled={!selectedEmployee || !resignationForm.resignationDate || !resignationForm.reason || isSaving}
                  leftIcon={<Send className="w-4 h-4" />}>

                  {isSaving ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          }

          {/* Full & Final Settlement Tab */}
          {activeTab === 'settlement' &&
          <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Full & Final (F&F) Settlement</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Sample case for this template. The asset damage charge is synced from the Asset Recovery tab.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {fnfLocked &&
                  <Badge variant="secondary"><Lock className="w-3 h-3 inline mr-1" />Locked & Archived</Badge>
                  }
                  <Badge variant={fnfPaymentStatus === 'Paid' ? 'success' : 'warning'}>
                    {fnfPaymentStatus === 'Paid' ? 'Paid' : 'Payment Pending'}
                  </Badge>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold text-gray-800 text-sm">Auto-Pulled Employee Details</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                      <tr>
                        <th className="px-5 py-2 font-medium">Field</th>
                        <th className="px-5 py-2 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {FNF_EMPLOYEE_DETAILS.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <tr key={item.label}>
                            <td className="px-5 py-2.5 text-gray-600 whitespace-nowrap">
                              <span className="inline-flex items-center gap-2">
                                <ItemIcon className="w-4 h-4 text-gray-400" />
                                {item.label}
                              </span>
                            </td>
                            <td className="px-5 py-2.5 text-gray-900 font-medium">{item.value}</td>
                          </tr>);

                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {renderFnfSection('Earnings', Calculator, fnfEarningRows, 'Total Earnings', fnfTotalEarnings, true)}
              {renderFnfSection('Deductions', ClipboardCheck, fnfDeductionRows, 'Total Deductions', fnfTotalDeductions, false)}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Net Payable Amount
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-medium text-gray-900">{formatFnfAmount(fnfTotalEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deductions</span>
                      <span className="font-medium text-red-600">- {formatFnfAmount(fnfTotalDeductions)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3 mt-2">
                      <span className="font-semibold text-gray-900">Net Payable</span>
                      <span className="text-xl font-bold text-green-700">{formatFnfAmount(fnfNetPayable)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <Select
                      label="Payment Mode"
                      value={fnfPaymentMode}
                      onChange={(val) => {if (!fnfLocked) setFnfPaymentMode(val);}}
                      options={FNF_PAYMENT_MODES} />

                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">Payment Status</p>
                      <Badge variant={fnfPaymentStatus === 'Paid' ? 'success' : 'warning'}>
                        {fnfPaymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    Multi-Level Approval Timeline
                  </h4>
                  <ol className="space-y-5">
                    {FNF_APPROVALS.map((step) =>
                    <li key={step.title} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {step.done ?
                        <CheckCircle className="w-4 h-4 text-green-600" /> :
                        <Clock className="w-4 h-4 text-amber-600" />
                        }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{step.title}</p>
                          <p className="text-sm text-gray-600">{step.person}</p>
                          <p className="text-xs text-gray-500">{step.date}</p>
                        </div>
                      </li>
                    )}
                  </ol>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                <Button variant="outline" onClick={handleGenerateFnfPdf} leftIcon={<Printer className="w-4 h-4" />}>Generate F&F PDF</Button>
                <Button variant="outline" onClick={handleEmailFnf} leftIcon={<Mail className="w-4 h-4" />}>Email to Employee</Button>
                <Button
                  variant="primary"
                  onClick={handleMarkFnfPaid}
                  disabled={fnfPaymentStatus === 'Paid' || fnfLocked}
                  leftIcon={<CheckCircle className="w-4 h-4" />}>

                  Mark as Paid
                </Button>
                <Button variant="outline" onClick={handleLockFnf} disabled={fnfLocked} leftIcon={<Lock className="w-4 h-4" />}>Lock & Archive</Button>
              </div>
            </div>
          }

          {/* Asset Recovery Tab */}
          {activeTab === 'assets' &&
          <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {assetTotals.total} Assets Auto-Pulled from Asset Management Module
                </p>
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Notifications sent to: IT | Admin | Library | Security | Lab
                </p>
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {assetTotals.pending} Assets Pending Return | {assetTotals.damaged} Asset Damaged
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 text-sm">Asset Recovery Overview</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                      <tr>
                        <th className="px-5 py-2 font-medium">Category</th>
                        <th className="px-5 py-2 font-medium text-center">Total</th>
                        <th className="px-5 py-2 font-medium text-center">Returned</th>
                        <th className="px-5 py-2 font-medium text-center">Pending</th>
                        <th className="px-5 py-2 font-medium text-center">Not Returned</th>
                        <th className="px-5 py-2 font-medium text-center">Damaged</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ASSET_CATEGORY_ROWS.map((category) => {
                        const counts = countAssets(assetRecords.filter((a) => a.category === category.key));
                        const CategoryIcon = category.icon;
                        return (
                          <tr key={category.key}>
                            <td className="px-5 py-2.5 font-medium text-gray-900">
                              <span className="inline-flex items-center gap-2">
                                <CategoryIcon className="w-4 h-4 text-gray-400" />
                                {category.label}
                              </span>
                            </td>
                            <td className="px-5 py-2.5 text-center font-semibold">{counts.total}</td>
                            <td className="px-5 py-2.5 text-center text-green-700">{counts.returned}</td>
                            <td className="px-5 py-2.5 text-center text-amber-700">{counts.pending}</td>
                            <td className="px-5 py-2.5 text-center text-red-600">{counts.notReturned}</td>
                            <td className="px-5 py-2.5 text-center text-amber-700">{counts.damaged}</td>
                          </tr>);

                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold text-gray-900">
                      <tr>
                        <td className="px-5 py-2.5">TOTAL</td>
                        <td className="px-5 py-2.5 text-center">{assetTotals.total}</td>
                        <td className="px-5 py-2.5 text-center">{assetTotals.returned}</td>
                        <td className="px-5 py-2.5 text-center">{assetTotals.pending}</td>
                        <td className="px-5 py-2.5 text-center">{assetTotals.notReturned}</td>
                        <td className="px-5 py-2.5 text-center">{assetTotals.damaged}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Department-Wise Grouped Asset View</h4>
                {ASSET_DEPARTMENT_GROUPS.map((group) => {
                  const items = assetRecords.filter((a) => a.department === group.key);
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 font-semibold text-gray-800 text-sm">
                          <GroupIcon className="w-4 h-4 text-gray-500" />
                          {group.label}
                        </span>
                        <Badge variant="success">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Notification Sent
                        </Badge>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-white text-left text-gray-500">
                            <tr>
                              <th className="px-4 py-2 font-medium">Asset Name</th>
                              <th className="px-4 py-2 font-medium">Asset ID</th>
                              <th className="px-4 py-2 font-medium">Assigned Date</th>
                              <th className="px-4 py-2 font-medium">Return Date</th>
                              <th className="px-4 py-2 font-medium">Status</th>
                              <th className="px-4 py-2 font-medium">Remarks</th>
                              <th className="px-4 py-2 font-medium text-right">Damage Charge</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {items.map((asset) =>
                            <tr key={asset.id}>
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{asset.name}</td>
                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{asset.assetCode}</td>
                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{asset.assignedDate}</td>
                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{asset.returnDate}</td>
                                <td className="px-4 py-3 min-w-[12rem]">
                                  <Select
                                    value={asset.status}
                                    onChange={(val) => updateAssetStatus(asset.id, val as AssetStatus)}
                                    options={ASSET_STATUS_OPTIONS} />

                                </td>
                                <td className="px-4 py-3 text-gray-600">{asset.remarks}</td>
                                <td className="px-4 py-3 text-right whitespace-nowrap text-gray-900">
                                  {asset.damageCharge !== null ? formatFnfAmount(asset.damageCharge) : asset.damageLabel}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>);

                })}
              </div>

              {syncedDamageAsset &&
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Damage Charge Auto-Synced to F&F Settlement
                  </p>
                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Asset</dt>
                      <dd className="font-medium text-gray-900">{syncedDamageAsset.name} ({syncedDamageAsset.assetCode})</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Charge</dt>
                      <dd className="font-medium text-gray-900">{formatFnfAmount(syncedDamageAsset.damageCharge ?? 0)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Synced</dt>
                      <dd className="text-gray-900">30-Oct-2026 | 03:22 PM</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Visible</dt>
                      <dd className="text-gray-900">F&F Settlement Screen &gt; Deductions Table</dd>
                    </div>
                  </dl>
                </div>
              }

              <div className={`rounded-lg border p-5 ${assetClearanceUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {assetClearanceUnlocked ?
                      <Unlock className="w-4 h-4 text-green-600" /> :
                      <Lock className="w-4 h-4 text-gray-600" />
                      }
                      Final Asset Clearance — {assetClearanceUnlocked ? 'Unlocked' : 'Locked'}
                    </p>
                    {assetClearanceUnlocked ?
                    <p className="text-sm text-green-800 mt-1">All assets are returned or waived.</p> :
                    <>
                        <p className="text-sm text-amber-800 mt-1">
                          {assetTotals.notReturned} Assets Not Returned | {assetTotals.damaged} Damage Pending Management Waiver | {assetTotals.pending} Pending Return
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Button will UNLOCK when ALL assets are Returned or Waived.</p>
                      </>
                    }
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRequestWaiver}
                      disabled={waiverRequested || assetTotals.notReturned + assetTotals.damaged === 0}>

                      {waiverRequested ? 'Waiver Requested' : 'Request Management Waiver'}
                    </Button>
                    <Button variant="outline" onClick={handleExportAssetReport} leftIcon={<Download className="w-4 h-4" />}>Export Asset Report</Button>
                    <Button
                      variant="primary"
                      onClick={handleConfirmAssetClearance}
                      disabled={!assetClearanceUnlocked || assetClearanceConfirmed}>

                      {assetClearanceConfirmed ? 'Clearance Confirmed' : 'Confirm Final Asset Clearance'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Exit Requests Tab */}
          {activeTab === 'requests' &&
          <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                  <Select
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  options={[{ value: '', label: 'All Departments' }, ...departments]} />

                </div>
                <div className="flex gap-2">
                  {[
                { value: 'all' as RequestFilter, label: 'All' },
                { value: 'pending' as RequestFilter, label: 'Pending' },
                { value: 'in_progress' as RequestFilter, label: 'In Progress' },
                { value: 'completed' as RequestFilter, label: 'Completed' }].
                map((filter) =>
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value ?
                  'bg-blue-600 text-white' :
                  'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`
                  }>

                      {filter.label}
                    </button>
                )}
                </div>
              </div>

              {/* Notice Period Alert */}
              {requestStats.noticePeriodComplete > 0 &&
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      {requestStats.noticePeriodComplete} employee(s) have completed their notice period
                    </p>
                    <p className="text-xs text-orange-600">Please process their exit and clearance</p>
                  </div>
                </div>
            }

              {/* Requests Table */}
              {filteredRequests.length > 0 ?
            <Table columns={requestColumns} data={filteredRequests} /> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No exit requests</h3>
                  <p className="text-gray-500 mb-4">Create a new exit request to get started</p>
                  <Button variant="primary" onClick={() => setActiveTab('resignation')} leftIcon={<Plus className="w-4 h-4" />}>
                    New Exit Request
                  </Button>
                </div>
            }
            </div>
          }

          {/* Exit History Tab */}
          {activeTab === 'history' &&
          <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="relative w-full lg:max-w-xl">
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="exited-employee-search">Search Employees Already Left</label>
                  <Search className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <input
                    id="exited-employee-search"
                    type="search"
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                    placeholder="Search by name, employee ID, code, department or designation"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <p className="whitespace-nowrap text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredExitedEmployees.length}</span> of {exitedEmployees.length} exited employees
                  </p>
                  <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                    Export History
                  </Button>
                </div>
              </div>

              {filteredExitedEmployees.length > 0 ?
            <Table columns={exitedColumns} data={filteredExitedEmployees} /> :
            exitedEmployees.length > 0 ?
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">No employees match this search</h3>
                  <p className="text-sm text-gray-500">Try an employee name, ID, department, or designation.</p>
                </div> :
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No exit history</h3>
                  <p className="text-gray-500">Completed exits will appear here</p>
                </div>
            }
            </div>
          }

        </div>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Edit Notice Period Modal (available after a resignation is submitted) */}
      <Modal
        isOpen={noticeEditRequest !== null}
        onClose={closeNoticeEdit}
        title="Edit Notice Period"
        size="sm"
        footer={
        <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={closeNoticeEdit}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveNoticePeriod} leftIcon={<Check className="w-4 h-4" />}>Save Notice Period</Button>
          </div>
        }>

        {noticeEditRequest &&
        <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900">{noticeEditRequest.employeeName}</p>
              <p className="text-sm text-gray-500">{noticeEditRequest.employeeCode} • Resigned on {formatDate(noticeEditRequest.resignationDate)}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Notice Period (Days)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={noticeEditDays}
                  onChange={(e) => setNoticeEditDays(parseInt(e.target.value) || 0)} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Last Working Day</label>
                <Input
                  type="date"
                  readOnly
                  value={calculateLastWorkingDay(noticeEditRequest.resignationDate, noticeEditDays)}
                  className="bg-gray-50" />

              </div>
            </div>
            <p className="text-xs text-gray-500">
              Currently {noticeEditRequest.noticePeriod} days, last working day {formatDate(noticeEditRequest.lastWorkingDay)}.
            </p>
          </div>
        }
      </Modal>

      {/* Process Exit Modal */}
      <Modal
        isOpen={showProcessModal}
        onClose={() => {setShowProcessModal(false);setSelectedRequest(null);setCurrentStep(0);}}
        title="Process Employee Exit"
        size="xl">

        {selectedRequest &&
        <div className="space-y-6">
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} steps={exitSteps} />

            {/* Employee Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="font-medium">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Working Day</p>
                  <p className="font-medium">{formatDate(selectedRequest.lastWorkingDay)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Days Remaining</p>
                  <Badge variant={selectedRequest.daysRemaining === 0 ? 'success' : 'warning'}>
                    {selectedRequest.daysRemaining === 0 ? 'Notice Complete' : `${selectedRequest.daysRemaining} days`}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 2 &&
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Timer className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Notice Period in Progress</p>
                    <p className="text-sm text-yellow-600">
                      {selectedRequest.daysRemaining > 0 ?
                  `Employee has ${selectedRequest.daysRemaining} days remaining in notice period` :
                  'Notice period is complete. Proceed to clearance.'}
                    </p>
                  </div>
                </div>
                {selectedRequest.daysRemaining === 0 &&
            <Button variant="primary" className="mt-4" onClick={() => setCurrentStep(3)}>
                    Proceed to Clearance
                  </Button>
            }
              </div>
          }

            {currentStep === 3 &&
          <div className="space-y-4">
                {/* Clearance Progress */}
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span className="font-medium">Clearance Progress</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-300 rounded-full h-2">
                      <div
                    className={`h-2 rounded-full ${clearanceStats.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${clearanceStats.percentage}%` }} />

                    </div>
                    <span className="text-sm font-medium">{clearanceStats.cleared}/{clearanceStats.total}</span>
                  </div>
                </div>

                {/* Clearance Items */}
                <div className="space-y-3">
                  {clearanceItems.map((item) =>
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                item.status === 'cleared' ? 'bg-green-50 border-green-200' :
                item.status === 'na' ? 'bg-gray-50 border-gray-200' :
                'bg-white border-gray-200'}`
                }>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.status === 'cleared' ? 'bg-green-100 text-green-600' :
                    item.status === 'na' ? 'bg-gray-100 text-gray-400' :
                    'bg-gray-100 text-gray-600'}`
                    }>
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.department}</p>
                            {item.pendingItems && item.status === 'pending' &&
                      <p className="text-xs text-red-600">Pending: {item.pendingItems}</p>
                      }
                            {item.status === 'cleared' &&
                      <p className="text-xs text-green-600">Cleared by {item.clearedBy}</p>
                      }
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                      value={item.status}
                      onChange={(e) => handleClearanceToggle(item.id, e.target.value as 'pending' | 'cleared' | 'na')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                      item.status === 'cleared' ? 'bg-green-100 border-green-300 text-green-700' :
                      item.status === 'na' ? 'bg-gray-100 border-gray-300 text-gray-500' :
                      'bg-red-100 border-red-300 text-red-700'}`
                      }>

                            <option value="pending">Pending</option>
                            <option value="cleared">Cleared</option>
                            <option value="na">N/A</option>
                          </select>
                        </div>
                      </div>
                      {item.status === 'pending' &&
                <div className="mt-3 grid grid-cols-2 gap-3">
                          <Input
                    placeholder="Pending items..."
                    value={item.pendingItems}
                    onChange={(e) => handlePendingItemsChange(item.id, e.target.value)} />

                          <Input
                    placeholder="Remarks..."
                    value={item.remarks}
                    onChange={(e) => handleClearanceRemarksChange(item.id, e.target.value)} />

                        </div>
                }
                    </div>
              )}
                </div>

                {allClearancesComplete &&
            <Button variant="primary" onClick={handleProceedToSettlement} className="w-full">
                    Proceed to Settlement <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
            }
              </div>
          }

            {currentStep === 4 &&
          <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Final Settlement Details
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">Pending Salary</td>
                        <td className="px-4 py-3 text-right font-medium">₹{settlementDetails.pendingSalary.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">Leave Encashment ({settlementDetails.leaveDays} days)</td>
                        <td className="px-4 py-3 text-right font-medium">₹{settlementDetails.leaveEncashment.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">Gratuity</td>
                        <td className="px-4 py-3 text-right font-medium">₹{settlementDetails.gratuity.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">PF Withdrawal</td>
                        <td className="px-4 py-3 text-right font-medium">₹{settlementDetails.pf.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-red-600">Deductions</td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">-₹{settlementDetails.deductions.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="px-4 py-3 font-semibold text-green-800">Total Settlement</td>
                        <td className="px-4 py-3 text-right font-bold text-green-800 text-lg">
                          ₹{settlementDetails.totalSettlement.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleGenerateDocuments} leftIcon={<FileText className="w-4 h-4" />} className="flex-1">
                    Generate Documents
                  </Button>
                  <Button variant="primary" onClick={handleConfirmExit} leftIcon={<UserX className="w-4 h-4" />} className="flex-1">
                    Confirm Exit
                  </Button>
                </div>
              </div>
          }

            {currentStep < 2 &&
          <div className="text-center py-8">
                <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">This request is still in the approval/initial stage.</p>
              </div>
          }
          </div>
        }
      </Modal>

      {/* Document Generation Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title="Generate Exit Documents"
        size="md">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select documents to generate for the employee:</p>
          
          <div className="space-y-3">
            {[
            { id: 'relieving', label: 'Relieving Letter', icon: FileText },
            { id: 'experience', label: 'Experience Certificate', icon: Award },
            { id: 'nodues', label: 'No Dues Certificate', icon: ClipboardCheck },
            { id: 'salary', label: 'Salary Certificate', icon: DollarSign },
            { id: 'fnf', label: 'Full & Final Statement', icon: Calculator }].
            map((doc) => {
              const Icon = doc.icon;
              const isSelected = selectedDocuments.includes(doc.label);
              return (
                <label
                  key={doc.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`
                  }>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments((prev) => [...prev, doc.label]);
                      } else {
                        setSelectedDocuments((prev) => prev.filter((d) => d !== doc.label));
                      }
                    }}
                    className="w-5 h-5 text-blue-600 rounded" />

                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{doc.label}</span>
                </label>);

            })}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleDownloadDocuments} leftIcon={<Download className="w-4 h-4" />}>
              Download Selected
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Exit Modal */}
      <Modal
        isOpen={showConfirmExitModal}
        onClose={() => setShowConfirmExitModal(false)}
        title="Confirm Employee Exit"
        size="md">

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Final Confirmation Required</p>
                <p className="text-sm text-red-700 mt-1">
                  This action will mark the employee as exited and cannot be undone.
                  Please ensure all clearances and settlements are complete.
                </p>
              </div>
            </div>
          </div>

          {selectedRequest &&
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Employee:</span>
                <span className="font-medium">{selectedRequest.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exit Date:</span>
                <span className="font-medium">{formatDate(selectedRequest.lastWorkingDay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Settlement Amount:</span>
                <span className="font-medium text-green-600">₹{settlementDetails.totalSettlement.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Documents:</span>
                <span className="font-medium">{selectedDocuments.length} selected</span>
              </div>
            </div>
          }

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowConfirmExitModal(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={handleFinalExit}
              disabled={isSaving}
              leftIcon={<UserX className="w-4 h-4" />}>

              {isSaving ? 'Processing...' : 'Confirm Exit'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export { EmployeeExitSeparation as EmployeeSeparationExit };
export default EmployeeExitSeparation;