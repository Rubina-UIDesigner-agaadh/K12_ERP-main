import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Search,
  Users,
  UserCheck,
  Send,
  Save,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Briefcase,
  Building,
  X,
  Info,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Mail,
  History,
  FileText,
  Settings,
  MoreVertical,
  Copy,
  UserPlus,
  UserMinus,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  Square,
  Loader,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  ChevronLeft,
  Undo,
  RotateCcw,
  Bell,
  BellOff,
  FolderOpen,
  Archive,
  Star,
  StarOff,
  ExternalLink,
  MessageSquare,
  ClipboardList,
  Target,
  Award,
  TrendingUp } from
'lucide-react';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
type EmployeeStatus = 'Unassigned' | 'Assigned' | 'In Progress' | 'Completed' | 'Overdue';
type AssignmentStatus = 'Draft' | 'Active' | 'Completed' | 'Cancelled';
type AppraisalStage = 'Not Started' | 'Self Appraisal' | 'Manager Review' | 'HR Review' | 'Completed';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  reportingManager: string;
  employeeType: string;
  status: EmployeeStatus;
  currentCycle: string | null;
  currentTemplate: string | null;
  currentReviewer: string | null;
  selfDeadline: string | null;
  managerDeadline: string | null;
  appraisalStage: AppraisalStage;
  lastAppraisalDate: string | null;
  performanceScore: number | null;
  notes: string;
}

interface AppraisalCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AssignmentStatus;
  description: string;
}

interface AppraisalTemplate {
  id: string;
  name: string;
  description: string;
  applicableTo: string[];
  sections: string[];
  totalQuestions: number;
}

interface Reviewer {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  canReview: string[];
}

interface Assignment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  cycleId: string;
  cycleName: string;
  templateId: string;
  templateName: string;
  reviewerId: string;
  reviewerName: string;
  selfDeadline: string;
  managerDeadline: string;
  status: AssignmentStatus;
  stage: AppraisalStage;
  assignedAt: Date;
  assignedBy: string;
  completedAt: Date | null;
  notificationSent: boolean;
  reminderCount: number;
}

interface DraftAssignment {
  id: string;
  name: string;
  employeeIds: string[];
  cycleId: string;
  templateId: string;
  reviewerId: string;
  selfDeadline: string;
  managerDeadline: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  details: string;
  affectedEmployees: string[];
}

interface FilterConfig {
  search: string;
  department: string;
  status: string;
  employeeType: string;
  hasAssignment: string;
}

interface SortConfig {
  key: keyof Employee;
  direction: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Constants & Initial Data
// ---------------------------------------------------------------------------
const DEPARTMENTS = [
'Science',
'Mathematics',
'English',
'Administration',
'Support Staff',
'IT',
'Finance',
'Human Resources'];


const EMPLOYEE_TYPES = [
'Permanent',
'Contract',
'Probation',
'Part-time'];


const APPRAISAL_CYCLES: AppraisalCycle[] = [
{
  id: 'annual-2024',
  name: 'Annual Review 2024-25',
  startDate: '2024-04-01',
  endDate: '2025-03-31',
  status: 'Active',
  description: 'Annual performance review for FY 2024-25'
},
{
  id: 'midterm-2024',
  name: 'Mid-Term Review Oct 2024',
  startDate: '2024-10-01',
  endDate: '2024-10-31',
  status: 'Active',
  description: 'Mid-term performance check-in'
},
{
  id: 'probation-q4',
  name: 'Probation Review Q4 2024',
  startDate: '2024-10-01',
  endDate: '2024-12-31',
  status: 'Active',
  description: 'Probation period review for Q4 joiners'
},
{
  id: 'annual-2023',
  name: 'Annual Review 2023-24',
  startDate: '2023-04-01',
  endDate: '2024-03-31',
  status: 'Completed',
  description: 'Annual performance review for FY 2023-24'
}];


const APPRAISAL_TEMPLATES: AppraisalTemplate[] = [
{
  id: 'teaching',
  name: 'Teaching Staff Template',
  description: 'Comprehensive template for teaching staff evaluation',
  applicableTo: ['Science', 'Mathematics', 'English'],
  sections: ['Teaching Quality', 'Student Engagement', 'Professional Development', 'Goals'],
  totalQuestions: 25
},
{
  id: 'admin',
  name: 'Administrative Staff Template',
  description: 'Template for administrative staff performance review',
  applicableTo: ['Administration', 'Finance', 'Human Resources'],
  sections: ['Work Quality', 'Communication', 'Teamwork', 'Goals'],
  totalQuestions: 20
},
{
  id: 'support',
  name: 'Support Staff Template',
  description: 'Template for support staff evaluation',
  applicableTo: ['Support Staff', 'IT'],
  sections: ['Service Quality', 'Reliability', 'Technical Skills', 'Goals'],
  totalQuestions: 18
}];


const REVIEWERS: Reviewer[] = [
{
  id: 'principal',
  name: 'Dr. Anand Mehta',
  designation: 'Principal',
  department: 'Administration',
  email: 'principal@school.edu',
  canReview: ['Science', 'Mathematics', 'English']
},
{
  id: 'vp',
  name: 'Mrs. Sunita Rao',
  designation: 'Vice Principal',
  department: 'Administration',
  email: 'vp@school.edu',
  canReview: ['Science', 'Mathematics', 'English', 'Support Staff']
},
{
  id: 'hr',
  name: 'Mr. Rajesh Kumar',
  designation: 'HR Head',
  department: 'Human Resources',
  email: 'hr@school.edu',
  canReview: ['Administration', 'Support Staff', 'IT', 'Finance', 'Human Resources']
},
{
  id: 'finance-head',
  name: 'Mrs. Priya Sharma',
  designation: 'Finance Head',
  department: 'Finance',
  email: 'finance@school.edu',
  canReview: ['Finance']
},
{
  id: 'it-head',
  name: 'Mr. Vikram Singh',
  designation: 'IT Head',
  department: 'IT',
  email: 'it@school.edu',
  canReview: ['IT', 'Support Staff']
}];


const INITIAL_EMPLOYEES: Employee[] = [
{
  id: 'EMP001',
  name: 'Dr. Robert Smith',
  email: 'robert.smith@school.edu',
  phone: '+91-9876543201',
  designation: 'Senior Teacher',
  department: 'Mathematics',
  joiningDate: '2018-06-15',
  reportingManager: 'Dr. Anand Mehta',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-15',
  performanceScore: 4.2,
  notes: ''
},
{
  id: 'EMP002',
  name: 'Mrs. Sarah Johnson',
  email: 'sarah.johnson@school.edu',
  phone: '+91-9876543202',
  designation: 'HOD',
  department: 'Science',
  joiningDate: '2015-04-01',
  reportingManager: 'Dr. Anand Mehta',
  employeeType: 'Permanent',
  status: 'Assigned',
  currentCycle: 'annual-2024',
  currentTemplate: 'teaching',
  currentReviewer: 'principal',
  selfDeadline: '2024-11-15',
  managerDeadline: '2024-11-30',
  appraisalStage: 'Self Appraisal',
  lastAppraisalDate: '2024-03-20',
  performanceScore: 4.5,
  notes: ''
},
{
  id: 'EMP003',
  name: 'Mr. Michael Chen',
  email: 'michael.chen@school.edu',
  phone: '+91-9876543203',
  designation: 'Teacher',
  department: 'Science',
  joiningDate: '2020-07-01',
  reportingManager: 'Mrs. Sarah Johnson',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-18',
  performanceScore: 3.8,
  notes: ''
},
{
  id: 'EMP004',
  name: 'Ms. Emily Davis',
  email: 'emily.davis@school.edu',
  phone: '+91-9876543204',
  designation: 'Senior Teacher',
  department: 'English',
  joiningDate: '2017-08-15',
  reportingManager: 'Mrs. Sunita Rao',
  employeeType: 'Permanent',
  status: 'In Progress',
  currentCycle: 'annual-2024',
  currentTemplate: 'teaching',
  currentReviewer: 'vp',
  selfDeadline: '2024-11-10',
  managerDeadline: '2024-11-25',
  appraisalStage: 'Manager Review',
  lastAppraisalDate: '2024-03-22',
  performanceScore: 4.0,
  notes: ''
},
{
  id: 'EMP005',
  name: 'Mr. David Wilson',
  email: 'david.wilson@school.edu',
  phone: '+91-9876543205',
  designation: 'Teacher',
  department: 'English',
  joiningDate: '2021-01-10',
  reportingManager: 'Ms. Emily Davis',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-25',
  performanceScore: 3.5,
  notes: ''
},
{
  id: 'EMP006',
  name: 'Mrs. Lisa Taylor',
  email: 'lisa.taylor@school.edu',
  phone: '+91-9876543206',
  designation: 'HOD',
  department: 'Mathematics',
  joiningDate: '2014-06-01',
  reportingManager: 'Dr. Anand Mehta',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-12',
  performanceScore: 4.3,
  notes: ''
},
{
  id: 'EMP007',
  name: 'Mr. James Anderson',
  email: 'james.anderson@school.edu',
  phone: '+91-9876543207',
  designation: 'Teacher',
  department: 'Science',
  joiningDate: '2022-08-01',
  reportingManager: 'Mrs. Sarah Johnson',
  employeeType: 'Probation',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: null,
  performanceScore: null,
  notes: 'On probation until December 2024'
},
{
  id: 'EMP008',
  name: 'Ms. Jennifer Brown',
  email: 'jennifer.brown@school.edu',
  phone: '+91-9876543208',
  designation: 'Lab Assistant',
  department: 'Science',
  joiningDate: '2019-04-15',
  reportingManager: 'Mrs. Sarah Johnson',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-28',
  performanceScore: 3.9,
  notes: ''
},
{
  id: 'EMP009',
  name: 'Mr. Richard Lee',
  email: 'richard.lee@school.edu',
  phone: '+91-9876543209',
  designation: 'Office Manager',
  department: 'Administration',
  joiningDate: '2016-02-01',
  reportingManager: 'Mr. Rajesh Kumar',
  employeeType: 'Permanent',
  status: 'Assigned',
  currentCycle: 'annual-2024',
  currentTemplate: 'admin',
  currentReviewer: 'hr',
  selfDeadline: '2024-11-20',
  managerDeadline: '2024-12-05',
  appraisalStage: 'Self Appraisal',
  lastAppraisalDate: '2024-03-30',
  performanceScore: 4.1,
  notes: ''
},
{
  id: 'EMP010',
  name: 'Mrs. Patricia Martinez',
  email: 'patricia.martinez@school.edu',
  phone: '+91-9876543210',
  designation: 'Accountant',
  department: 'Finance',
  joiningDate: '2018-09-01',
  reportingManager: 'Mrs. Priya Sharma',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-14',
  performanceScore: 4.0,
  notes: ''
},
{
  id: 'EMP011',
  name: 'Mr. Thomas White',
  email: 'thomas.white@school.edu',
  phone: '+91-9876543211',
  designation: 'Clerk',
  department: 'Administration',
  joiningDate: '2020-03-15',
  reportingManager: 'Mr. Richard Lee',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-26',
  performanceScore: 3.6,
  notes: ''
},
{
  id: 'EMP012',
  name: 'Ms. Nancy Harris',
  email: 'nancy.harris@school.edu',
  phone: '+91-9876543212',
  designation: 'Librarian',
  department: 'Support Staff',
  joiningDate: '2017-07-01',
  reportingManager: 'Mrs. Sunita Rao',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-19',
  performanceScore: 4.2,
  notes: ''
},
{
  id: 'EMP013',
  name: 'Mr. Kevin Clark',
  email: 'kevin.clark@school.edu',
  phone: '+91-9876543213',
  designation: 'IT Support',
  department: 'IT',
  joiningDate: '2021-06-01',
  reportingManager: 'Mr. Vikram Singh',
  employeeType: 'Contract',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-21',
  performanceScore: 3.7,
  notes: 'Contract renewal pending'
},
{
  id: 'EMP014',
  name: 'Mrs. Karen Lewis',
  email: 'karen.lewis@school.edu',
  phone: '+91-9876543214',
  designation: 'Counselor',
  department: 'Support Staff',
  joiningDate: '2019-08-15',
  reportingManager: 'Mrs. Sunita Rao',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-24',
  performanceScore: 4.4,
  notes: ''
},
{
  id: 'EMP015',
  name: 'Mr. Steven Walker',
  email: 'steven.walker@school.edu',
  phone: '+91-9876543215',
  designation: 'Sports Coach',
  department: 'Support Staff',
  joiningDate: '2018-01-10',
  reportingManager: 'Mrs. Sunita Rao',
  employeeType: 'Permanent',
  status: 'Unassigned',
  currentCycle: null,
  currentTemplate: null,
  currentReviewer: null,
  selfDeadline: null,
  managerDeadline: null,
  appraisalStage: 'Not Started',
  lastAppraisalDate: '2024-03-27',
  performanceScore: 4.0,
  notes: ''
}];


// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------
const formatDate = (date: Date | string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date | string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInitials = (name: string): string => {
  return name.
  split(' ').
  map((n) => n[0]).
  join('').
  slice(0, 2).
  toUpperCase();
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
          success: <CheckCircle className="h-5 w-5 text-green-600" />,
          error: <XCircle className="h-5 w-5 text-red-600" />,
          warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          info: <Info className="h-5 w-5 text-blue-600" />
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
              <X className="h-4 w-4" />
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
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  const icons = {
    danger: <XCircle className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icons[variant]}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
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
// Employee Detail Modal Component
// ---------------------------------------------------------------------------
interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onUpdateNotes: (empId: string, notes: string) => void;
}

function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  onUpdateNotes
}: EmployeeDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'notes'>('details');

  useEffect(() => {
    if (employee) {
      setNotes(employee.notes);
    }
  }, [employee]);

  if (!employee) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(employee.id, notes);
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    const variants: Record<EmployeeStatus, 'info' | 'warning' | 'success' | 'error' | 'secondary'> = {
      Assigned: 'info',
      'In Progress': 'warning',
      Completed: 'success',
      Overdue: 'error',
      Unassigned: 'secondary'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getStageBadge = (stage: AppraisalStage) => {
    const variants: Record<AppraisalStage, 'secondary' | 'info' | 'warning' | 'success'> = {
      'Not Started': 'secondary',
      'Self Appraisal': 'info',
      'Manager Review': 'warning',
      'HR Review': 'warning',
      'Completed': 'success'
    };
    return <Badge variant={variants[stage]}>{stage}</Badge>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
            {getInitials(employee.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
              {getStatusBadge(employee.status)}
            </div>
            <p className="text-sm text-gray-500">{employee.id} • {employee.designation}</p>
            <p className="text-sm text-gray-500">{employee.department}</p>
          </div>
          {employee.performanceScore &&
          <div className="text-right">
              <p className="text-sm text-gray-500">Last Score</p>
              <p className="text-2xl font-bold text-blue-600">{employee.performanceScore}</p>
            </div>
          }
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6">
            {[
            { id: 'details', label: 'Details', icon: Users },
            { id: 'history', label: 'Appraisal History', icon: History },
            { id: 'notes', label: 'Notes', icon: MessageSquare }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ?
              'border-blue-600 text-blue-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'details' &&
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                <p className="text-sm text-gray-900">{employee.email}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                <p className="text-sm text-gray-900">{employee.phone}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Joining Date</label>
                <p className="text-sm text-gray-900">{formatDate(employee.joiningDate)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Employee Type</label>
                <p className="text-sm text-gray-900">{employee.employeeType}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Reporting Manager</label>
                <p className="text-sm text-gray-900">{employee.reportingManager}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Last Appraisal</label>
                <p className="text-sm text-gray-900">{formatDate(employee.lastAppraisalDate)}</p>
              </div>
              {employee.currentCycle &&
            <>
                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Assignment</h4>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Appraisal Stage</label>
                    <div className="mt-1">{getStageBadge(employee.appraisalStage)}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Self Deadline</label>
                    <p className="text-sm text-gray-900">{formatDate(employee.selfDeadline)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Manager Deadline</label>
                    <p className="text-sm text-gray-900">{formatDate(employee.managerDeadline)}</p>
                  </div>
                </>
            }
            </div>
          }

          {activeTab === 'history' &&
          <div className="space-y-3">
              {employee.lastAppraisalDate ?
            <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Annual Review 2023-24</span>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Completed on {formatDate(employee.lastAppraisalDate)}
                  </p>
                  {employee.performanceScore &&
              <div className="mt-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Score: {employee.performanceScore}/5
                      </span>
                    </div>
              }
                </div> :

            <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No appraisal history available</p>
                </div>
            }
            </div>
          }

          {activeTab === 'notes' &&
          <div className="space-y-4">
              <Textarea
              label="Notes"
              placeholder="Add notes about this employee..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6} />

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSaveNotes}>
                  <Save className="w-4 h-4 mr-1" /> Save Notes
                </Button>
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Draft Management Modal Component
// ---------------------------------------------------------------------------
interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftAssignment[];
  onLoadDraft: (draft: DraftAssignment) => void;
  onDeleteDraft: (draftId: string) => void;
}

function DraftModal({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft
}: DraftModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saved Drafts" size="md">
      <div className="space-y-4">
        {drafts.length > 0 ?
        <div className="space-y-2 max-h-80 overflow-auto">
            {drafts.map((draft) =>
          <div key={draft.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{draft.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {draft.employeeIds.length} employees selected
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Saved: {formatDateTime(draft.updatedAt)}
                    </p>
                    {draft.notes &&
                <p className="text-sm text-gray-600 mt-2 italic">"{draft.notes}"</p>
                }
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onLoadDraft(draft);
                    onClose();
                  }}>

                      Load
                    </Button>
                    <button
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  onClick={() => onDeleteDraft(draft.id)}>

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          )}
          </div> :

        <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No saved drafts</p>
          </div>
        }
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Save Draft Modal Component
// ---------------------------------------------------------------------------
interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, notes: string) => void;
  employeeCount: number;
}

function SaveDraftModal({
  isOpen,
  onClose,
  onSave,
  employeeCount
}: SaveDraftModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), notes.trim());
      setName('');
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Draft" size="sm">
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Saving draft with <strong>{employeeCount}</strong> employees selected
          </p>
        </div>
        <Input
          label="Draft Name"
          placeholder="Enter draft name..."
          value={name}
          onChange={(e) => setName(e.target.value)} />

        <Textarea
          label="Notes (Optional)"
          placeholder="Add notes about this draft..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3} />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Assignment History Modal Component
// ---------------------------------------------------------------------------
interface AssignmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onRevoke: (assignmentId: string) => void;
  onSendReminder: (assignmentId: string) => void;
}

function AssignmentHistoryModal({
  isOpen,
  onClose,
  assignments,
  onRevoke,
  onSendReminder
}: AssignmentHistoryModalProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredAssignments = useMemo(() => {
    if (filter === 'all') return assignments;
    if (filter === 'active') return assignments.filter((a) => a.status === 'Active');
    return assignments.filter((a) => a.status === 'Completed');
  }, [assignments, filter]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assignment History" size="lg">
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) =>
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            filter === f ?
            'bg-blue-100 text-blue-700' :
            'text-gray-500 hover:bg-gray-100'}`
            }>

              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          )}
        </div>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ?
        <div className="max-h-96 overflow-auto space-y-2">
            {filteredAssignments.map((assignment) =>
          <div key={assignment.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{assignment.employeeName}</span>
                      <Badge variant={assignment.status === 'Active' ? 'info' : 'success'}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{assignment.department}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>Cycle: {assignment.cycleName}</div>
                      <div>Template: {assignment.templateName}</div>
                      <div>Reviewer: {assignment.reviewerName}</div>
                      <div>Stage: {assignment.stage}</div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Assigned: {formatDateTime(assignment.assignedAt)} by {assignment.assignedBy}
                    </p>
                  </div>
                  {assignment.status === 'Active' &&
              <div className="flex items-center gap-1">
                      <button
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  onClick={() => onSendReminder(assignment.id)}
                  title="Send Reminder">

                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  onClick={() => onRevoke(assignment.id)}
                  title="Revoke Assignment">

                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
              }
                </div>
              </div>
          )}
          </div> :

        <div className="text-center py-8 text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No assignments found</p>
          </div>
        }

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Bulk Edit Modal Component
// ---------------------------------------------------------------------------
interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onApply: (changes: {
    reviewer?: string;
    selfDeadline?: string;
    managerDeadline?: string;
  }) => void;
  reviewers: Reviewer[];
}

function BulkEditModal({
  isOpen,
  onClose,
  selectedCount,
  onApply,
  reviewers
}: BulkEditModalProps) {
  const [reviewer, setReviewer] = useState('');
  const [selfDeadline, setSelfDeadline] = useState('');
  const [managerDeadline, setManagerDeadline] = useState('');

  const handleApply = () => {
    const changes: any = {};
    if (reviewer) changes.reviewer = reviewer;
    if (selfDeadline) changes.selfDeadline = selfDeadline;
    if (managerDeadline) changes.managerDeadline = managerDeadline;

    if (Object.keys(changes).length > 0) {
      onApply(changes);
      setReviewer('');
      setSelfDeadline('');
      setManagerDeadline('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Edit Assignments" size="md">
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Editing assignments for <strong>{selectedCount}</strong> employees.
            Only filled fields will be updated.
          </p>
        </div>

        <Select
          label="Update Reviewer"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          options={[
          { value: '', label: 'No Change' },
          ...reviewers.map((r) => ({ value: r.id, label: `${r.name} (${r.designation})` }))]
          } />


        <Input
          label="Update Self-Appraisal Deadline"
          type="date"
          value={selfDeadline}
          onChange={(e) => setSelfDeadline(e.target.value)} />


        <Input
          label="Update Manager Review Deadline"
          type="date"
          value={managerDeadline}
          onChange={(e) => setManagerDeadline(e.target.value)} />


        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!reviewer && !selfDeadline && !managerDeadline}>

            Apply Changes
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function AppraisalCycleAssignment() {
  // Data State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drafts, setDrafts] = useState<DraftAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Selection State
  const [selected, setSelected] = useState<string[]>([]);

  // Filter State
  const [filters, setFilters] = useState<FilterConfig>({
    search: '',
    department: '',
    status: '',
    employeeType: '',
    hasAssignment: ''
  });

  // Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // UI State
  const [collapsedDepts, setCollapsedDepts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Configuration State
  const [cycle, setCycle] = useState('');
  const [template, setTemplate] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [selfDeadline, setSelfDeadline] = useState('');
  const [managerDeadline, setManagerDeadline] = useState('');
  const [sendNotification, setSendNotification] = useState(true);

  // Modal State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'info' });

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification Functions
  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = generateId();
    setNotifications((prev) => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Audit Log Function
  const addAuditLog = useCallback((action: string, details: string, affectedEmployees: string[]) => {
    const log: AuditLog = {
      id: generateId(),
      action,
      performedBy: 'Current User',
      performedAt: new Date(),
      details,
      affectedEmployees
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, []);

  // Filter and Group Employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
        e.name.toLowerCase().includes(searchLower) ||
        e.id.toLowerCase().includes(searchLower) ||
        e.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department) {
      result = result.filter((e) => e.department === filters.department);
    }

    if (filters.status) {
      result = result.filter((e) => e.status === filters.status);
    }

    if (filters.employeeType) {
      result = result.filter((e) => e.employeeType === filters.employeeType);
    }

    if (filters.hasAssignment === 'yes') {
      result = result.filter((e) => e.currentCycle !== null);
    } else if (filters.hasAssignment === 'no') {
      result = result.filter((e) => e.currentCycle === null);
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ?
          aVal.localeCompare(bVal) :
          bVal.localeCompare(aVal);
        }

        return 0;
      });
    }

    return result;
  }, [employees, filters, sortConfig]);

  const groupedEmployees = useMemo(() => {
    return DEPARTMENTS.reduce((acc, dept) => {
      const emps = filteredEmployees.filter((e) => e.department === dept);
      if (emps.length > 0) acc[dept] = emps;
      return acc;
    }, {} as Record<string, Employee[]>);
  }, [filteredEmployees]);

  // Get applicable reviewers based on selected template
  const applicableReviewers = useMemo(() => {
    if (!selected.length) return REVIEWERS;

    const selectedDepts = new Set(
      selected.map((id) => employees.find((e) => e.id === id)?.department).filter(Boolean)
    );

    return REVIEWERS.filter((r) =>
    [...selectedDepts].some((dept) => r.canReview.includes(dept as string))
    );
  }, [selected, employees]);

  // Get applicable templates
  const applicableTemplates = useMemo(() => {
    if (!selected.length) return APPRAISAL_TEMPLATES;

    const selectedDepts = new Set(
      selected.map((id) => employees.find((e) => e.id === id)?.department).filter(Boolean)
    );

    return APPRAISAL_TEMPLATES.filter((t) =>
    [...selectedDepts].some((dept) => t.applicableTo.includes(dept as string))
    );
  }, [selected, employees]);

  // Selection Handlers
  const toggleDept = (dept: string) => {
    setCollapsedDepts((prev) =>
    prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(filteredEmployees.map((e) => e.id));
  };

  const clearAll = () => {
    setSelected([]);
  };

  const selectDept = (dept: string) => {
    const ids = (groupedEmployees[dept] || []).map((e) => e.id);
    setSelected((prev) => [...new Set([...prev, ...ids])]);
  };

  const deselectDept = (dept: string) => {
    const ids = new Set((groupedEmployees[dept] || []).map((e) => e.id));
    setSelected((prev) => prev.filter((id) => !ids.has(id)));
  };

  const selectUnassigned = () => {
    const unassigned = filteredEmployees.filter((e) => e.status === 'Unassigned').map((e) => e.id);
    setSelected(unassigned);
    addNotification('info', `Selected ${unassigned.length} unassigned employees`);
  };

  // Assignment Handler
  const handleAssign = useCallback(() => {
    if (!cycle || !template || !reviewer || !selfDeadline || !managerDeadline) {
      addNotification('error', 'Please fill all required fields');
      return;
    }

    if (new Date(selfDeadline) > new Date(managerDeadline)) {
      addNotification('error', 'Self-appraisal deadline must be before manager review deadline');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const cycleData = APPRAISAL_CYCLES.find((c) => c.id === cycle);
      const templateData = APPRAISAL_TEMPLATES.find((t) => t.id === template);
      const reviewerData = REVIEWERS.find((r) => r.id === reviewer);

      // Create assignments
      const newAssignments: Assignment[] = selected.map((empId) => {
        const emp = employees.find((e) => e.id === empId)!;
        return {
          id: generateId(),
          employeeId: empId,
          employeeName: emp.name,
          department: emp.department,
          cycleId: cycle,
          cycleName: cycleData?.name || '',
          templateId: template,
          templateName: templateData?.name || '',
          reviewerId: reviewer,
          reviewerName: reviewerData?.name || '',
          selfDeadline,
          managerDeadline,
          status: 'Active',
          stage: 'Self Appraisal',
          assignedAt: new Date(),
          assignedBy: 'Current User',
          completedAt: null,
          notificationSent: sendNotification,
          reminderCount: 0
        };
      });

      setAssignments((prev) => [...prev, ...newAssignments]);

      // Update employees
      setEmployees((prev) =>
      prev.map((emp) => {
        if (selected.includes(emp.id)) {
          return {
            ...emp,
            status: 'Assigned' as EmployeeStatus,
            currentCycle: cycle,
            currentTemplate: template,
            currentReviewer: reviewer,
            selfDeadline,
            managerDeadline,
            appraisalStage: 'Self Appraisal' as AppraisalStage
          };
        }
        return emp;
      })
      );

      // Add audit log
      addAuditLog(
        'Bulk Assignment',
        `Assigned ${selected.length} employees to ${cycleData?.name}`,
        selected
      );

      // Show success notification
      addNotification(
        'success',
        `${selected.length} employees assigned successfully!${sendNotification ? ' Notification emails queued.' : ''}`
      );

      // Reset form
      setSelected([]);
      setCycle('');
      setTemplate('');
      setReviewer('');
      setSelfDeadline('');
      setManagerDeadline('');
      setIsProcessing(false);
    }, 1500);
  }, [
  selected,
  cycle,
  template,
  reviewer,
  selfDeadline,
  managerDeadline,
  sendNotification,
  employees,
  addNotification,
  addAuditLog]
  );

  // Revoke Assignment Handler
  const handleRevokeAssignment = useCallback((assignmentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Revoke Assignment',
      message: 'Are you sure you want to revoke this assignment? The employee will be marked as unassigned.',
      variant: 'danger',
      onConfirm: () => {
        const assignment = assignments.find((a) => a.id === assignmentId);
        if (assignment) {
          // Update assignment status
          setAssignments((prev) =>
          prev.map((a) =>
          a.id === assignmentId ? { ...a, status: 'Cancelled' as AssignmentStatus } : a
          )
          );

          // Update employee
          setEmployees((prev) =>
          prev.map((emp) =>
          emp.id === assignment.employeeId ?
          {
            ...emp,
            status: 'Unassigned' as EmployeeStatus,
            currentCycle: null,
            currentTemplate: null,
            currentReviewer: null,
            selfDeadline: null,
            managerDeadline: null,
            appraisalStage: 'Not Started' as AppraisalStage
          } :
          emp
          )
          );

          addAuditLog('Revoke Assignment', `Revoked assignment for ${assignment.employeeName}`, [
          assignment.employeeId]
          );
          addNotification('success', `Assignment revoked for ${assignment.employeeName}`);
        }
      }
    });
  }, [assignments, addAuditLog, addNotification]);

  // Send Reminder Handler
  const handleSendReminder = useCallback((assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setAssignments((prev) =>
      prev.map((a) =>
      a.id === assignmentId ? { ...a, reminderCount: a.reminderCount + 1 } : a
      )
      );
      addNotification('success', `Reminder sent to ${assignment.employeeName}`);
    }
  }, [assignments, addNotification]);

  // Bulk Revoke Handler
  const handleBulkRevoke = useCallback(() => {
    const assignedSelected = selected.filter((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp?.status !== 'Unassigned';
    });

    if (assignedSelected.length === 0) {
      addNotification('warning', 'No assigned employees selected');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Revoke Assignments',
      message: `Are you sure you want to revoke assignments for ${assignedSelected.length} employees?`,
      variant: 'danger',
      onConfirm: () => {
        // Update assignments
        setAssignments((prev) =>
        prev.map((a) =>
        assignedSelected.includes(a.employeeId) && a.status === 'Active' ?
        { ...a, status: 'Cancelled' as AssignmentStatus } :
        a
        )
        );

        // Update employees
        setEmployees((prev) =>
        prev.map((emp) =>
        assignedSelected.includes(emp.id) ?
        {
          ...emp,
          status: 'Unassigned' as EmployeeStatus,
          currentCycle: null,
          currentTemplate: null,
          currentReviewer: null,
          selfDeadline: null,
          managerDeadline: null,
          appraisalStage: 'Not Started' as AppraisalStage
        } :
        emp
        )
        );

        addAuditLog('Bulk Revoke', `Revoked assignments for ${assignedSelected.length} employees`, assignedSelected);
        addNotification('success', `${assignedSelected.length} assignments revoked`);
        setSelected([]);
      }
    });
  }, [selected, employees, addAuditLog, addNotification]);

  // Draft Handlers
  const handleSaveDraft = useCallback((name: string, notes: string) => {
    const draft: DraftAssignment = {
      id: generateId(),
      name,
      employeeIds: selected,
      cycleId: cycle,
      templateId: template,
      reviewerId: reviewer,
      selfDeadline,
      managerDeadline,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes
    };

    setDrafts((prev) => [...prev, draft]);
    addAuditLog('Save Draft', `Saved draft "${name}" with ${selected.length} employees`, selected);
    addNotification('success', `Draft "${name}" saved successfully`);
  }, [selected, cycle, template, reviewer, selfDeadline, managerDeadline, addAuditLog, addNotification]);

  const handleLoadDraft = useCallback((draft: DraftAssignment) => {
    // Filter out employees that no longer exist
    const validIds = draft.employeeIds.filter((id) => employees.some((e) => e.id === id));

    setSelected(validIds);
    setCycle(draft.cycleId);
    setTemplate(draft.templateId);
    setReviewer(draft.reviewerId);
    setSelfDeadline(draft.selfDeadline);
    setManagerDeadline(draft.managerDeadline);

    addNotification('success', `Draft "${draft.name}" loaded`);
  }, [employees, addNotification]);

  const handleDeleteDraft = useCallback((draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId);
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    addNotification('success', `Draft "${draft?.name}" deleted`);
  }, [drafts, addNotification]);

  // View Employee Handler
  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  }, []);

  // Update Notes Handler
  const handleUpdateNotes = useCallback((empId: string, notes: string) => {
    setEmployees((prev) =>
    prev.map((emp) => emp.id === empId ? { ...emp, notes } : emp)
    );
    addNotification('success', 'Notes saved');
  }, [addNotification]);

  // Bulk Edit Handler
  const handleBulkEdit = useCallback(
    (changes: {reviewer?: string;selfDeadline?: string;managerDeadline?: string;}) => {
      const assignedSelected = selected.filter((id) => {
        const emp = employees.find((e) => e.id === id);
        return emp?.status !== 'Unassigned';
      });

      if (assignedSelected.length === 0) {
        addNotification('warning', 'No assigned employees selected');
        return;
      }

      const reviewerData = changes.reviewer ?
      REVIEWERS.find((r) => r.id === changes.reviewer) :
      null;

      setEmployees((prev) =>
      prev.map((emp) => {
        if (assignedSelected.includes(emp.id)) {
          return {
            ...emp,
            currentReviewer: changes.reviewer || emp.currentReviewer,
            selfDeadline: changes.selfDeadline || emp.selfDeadline,
            managerDeadline: changes.managerDeadline || emp.managerDeadline
          };
        }
        return emp;
      })
      );

      setAssignments((prev) =>
      prev.map((a) => {
        if (assignedSelected.includes(a.employeeId) && a.status === 'Active') {
          return {
            ...a,
            reviewerId: changes.reviewer || a.reviewerId,
            reviewerName: reviewerData?.name || a.reviewerName,
            selfDeadline: changes.selfDeadline || a.selfDeadline,
            managerDeadline: changes.managerDeadline || a.managerDeadline
          };
        }
        return a;
      })
      );

      addAuditLog('Bulk Edit', `Updated assignments for ${assignedSelected.length} employees`, assignedSelected);
      addNotification('success', `${assignedSelected.length} assignments updated`);
    },
    [selected, employees, addAuditLog, addNotification]
  );

  // Export Handler
  const handleExport = useCallback(() => {
    const dataToExport = selected.length > 0 ?
    employees.filter((e) => selected.includes(e.id)) :
    filteredEmployees;

    const headers = ['ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Appraisal Stage'];
    const rows = dataToExport.map((emp) => [
    emp.id,
    emp.name,
    emp.email,
    emp.department,
    emp.designation,
    emp.status,
    emp.appraisalStage]
    );

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appraisal-employees-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('success', `Exported ${dataToExport.length} employees`);
  }, [selected, employees, filteredEmployees, addNotification]);

  // Reset Filters Handler
  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      department: '',
      status: '',
      employeeType: '',
      hasAssignment: ''
    });
    addNotification('info', 'Filters reset');
  }, [addNotification]);

  // Status Badge Helper
  const getStatusBadge = (status: EmployeeStatus) => {
    const variants: Record<EmployeeStatus, 'info' | 'warning' | 'success' | 'error' | 'secondary'> = {
      Assigned: 'info',
      'In Progress': 'warning',
      Completed: 'success',
      Overdue: 'error',
      Unassigned: 'secondary'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Validation
  const isFormValid = cycle && template && reviewer && selfDeadline && managerDeadline && selected.length > 0;

  // Summary Stats
  const stats = useMemo(() => ({
    total: filteredEmployees.length,
    unassigned: filteredEmployees.filter((e) => e.status === 'Unassigned').length,
    assigned: filteredEmployees.filter((e) => e.status === 'Assigned').length,
    inProgress: filteredEmployees.filter((e) => e.status === 'In Progress').length,
    completed: filteredEmployees.filter((e) => e.status === 'Completed').length
  }), [filteredEmployees]);

  return (
    <div className="space-y-6 p-6">
      <style>
        {`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in { animation: slide-in 0.3s ease-out; }
        `}
      </style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Cycle Assignment</h1>
          <p className="text-sm text-gray-500">Assign employees to appraisal cycles in bulk</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<History className="w-4 h-4" />} onClick={() => setShowHistoryModal(true)}>
            History ({assignments.filter((a) => a.status === 'Active').length})
          </Button>
          <Button variant="outline" size="sm" leftIcon={<FolderOpen className="w-4 h-4" />} onClick={() => setShowDraftModal(true)}>
            Drafts ({drafts.length})
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase">Unassigned</p>
          <p className="text-2xl font-bold text-gray-600">{stats.unassigned}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 uppercase">Assigned</p>
          <p className="text-2xl font-bold text-blue-700">{stats.assigned}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-600 uppercase">In Progress</p>
          <p className="text-2xl font-bold text-amber-700">{stats.inProgress}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 uppercase">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT PANEL - Employee Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Employee Selection">
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2">
                <Select
                  options={[
                  { value: '', label: 'All Departments' },
                  ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]
                  }
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })} />

                <Select
                  options={[
                  { value: '', label: 'All Status' },
                  { value: 'Unassigned', label: 'Unassigned' },
                  { value: 'Assigned', label: 'Assigned' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' }]
                  }
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })} />

              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  options={[
                  { value: '', label: 'All Types' },
                  ...EMPLOYEE_TYPES.map((t) => ({ value: t, label: t }))]
                  }
                  value={filters.employeeType}
                  onChange={(e) => setFilters({ ...filters, employeeType: e.target.value })} />

                <Select
                  options={[
                  { value: '', label: 'Any Assignment' },
                  { value: 'yes', label: 'Has Assignment' },
                  { value: 'no', label: 'No Assignment' }]
                  }
                  value={filters.hasAssignment}
                  onChange={(e) => setFilters({ ...filters, hasAssignment: e.target.value })} />

              </div>

              {/* Selection Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{selected.length}</span> of{' '}
                  {filteredEmployees.length} selected
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    All
                  </Button>
                  <Button variant="outline" size="sm" onClick={selectUnassigned}>
                    Unassigned
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Employee List */}
              <div className="max-h-[500px] overflow-y-auto border rounded-lg divide-y divide-gray-100">
                {Object.entries(groupedEmployees).length > 0 ?
                Object.entries(groupedEmployees).map(([dept, emps]) => {
                  const deptSelected = emps.filter((e) => selected.includes(e.id)).length;
                  const allDeptSelected = deptSelected === emps.length;

                  return (
                    <div key={dept}>
                        <button
                        onClick={() => toggleDept(dept)}
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">

                          <div className="flex items-center gap-2">
                            {collapsedDepts.includes(dept) ?
                          <ChevronRight className="w-4 h-4 text-gray-400" /> :

                          <ChevronDown className="w-4 h-4 text-gray-400" />
                          }
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">{dept}</span>
                            <Badge variant="secondary">{emps.length}</Badge>
                            {deptSelected > 0 &&
                          <Badge variant="info">{deptSelected} selected</Badge>
                          }
                          </div>
                          <div className="flex gap-1">
                            <button
                            onClick={(e) => {
                              e.stopPropagation();
                              allDeptSelected ? deselectDept(dept) : selectDept(dept);
                            }}
                            className="text-xs text-blue-600 hover:underline px-2">

                              {allDeptSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                        </button>
                        {!collapsedDepts.includes(dept) &&
                      emps.map((emp) =>
                      <div
                        key={emp.id}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/50 transition-colors ${
                        selected.includes(emp.id) ? 'bg-blue-50' : ''}`
                        }>

                              <input
                          type="checkbox"
                          checked={selected.includes(emp.id)}
                          onChange={() => toggleSelect(emp.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer" />

                              <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 cursor-pointer"
                          onClick={() => handleViewEmployee(emp)}>

                                {getInitials(emp.name)}
                              </div>
                              <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleViewEmployee(emp)}>

                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {emp.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {emp.id} · {emp.designation}
                                </p>
                              </div>
                              {getStatusBadge(emp.status)}
                              <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => handleViewEmployee(emp)}>

                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                      )}
                      </div>);

                }) :

                <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No employees found</p>
                  </div>
                }
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL - Configuration */}
        <div className="lg:col-span-3 space-y-4">
          <Card title="Assignment Configuration">
            <div className="space-y-5">
              <Select
                label="Appraisal Cycle *"
                options={[
                { value: '', label: 'Select Cycle...' },
                ...APPRAISAL_CYCLES.filter((c) => c.status === 'Active').map((c) => ({
                  value: c.id,
                  label: c.name
                }))]
                }
                value={cycle}
                onChange={(e) => setCycle(e.target.value)} />


              <Select
                label="Appraisal Template *"
                options={[
                { value: '', label: 'Select Template...' },
                ...applicableTemplates.map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.totalQuestions} questions)`
                }))]
                }
                value={template}
                onChange={(e) => setTemplate(e.target.value)} />


              <Select
                label="Assign Reviewer (Manager) *"
                options={[
                { value: '', label: 'Select Reviewer...' },
                ...applicableReviewers.map((r) => ({
                  value: r.id,
                  label: `${r.name} (${r.designation})`
                }))]
                }
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Self-Appraisal Deadline *"
                  type="date"
                  value={selfDeadline}
                  onChange={(e) => setSelfDeadline(e.target.value)} />

                <Input
                  label="Manager Review Deadline *"
                  type="date"
                  value={managerDeadline}
                  onChange={(e) => setManagerDeadline(e.target.value)} />

              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300" />

                <span className="text-sm text-gray-700">Send notification emails to employees</span>
              </label>
            </div>
          </Card>

          {/* Assignment Preview */}
          {selected.length > 0 &&
          <Card title="Assignment Preview">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">Employees</p>
                  <p className="text-lg font-bold text-blue-700">{selected.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">Cycle</p>
                  <p className="text-sm font-bold text-green-700">
                    {cycle ? APPRAISAL_CYCLES.find((c) => c.id === cycle)?.name : 'Not selected'}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">Template</p>
                  <p className="text-sm font-bold text-purple-700">
                    {template ?
                  APPRAISAL_TEMPLATES.find((t) => t.id === template)?.name :
                  'Not selected'}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-600">Reviewer</p>
                  <p className="text-sm font-bold text-amber-700">
                    {reviewer ? REVIEWERS.find((r) => r.id === reviewer)?.name : 'Not selected'}
                  </p>
                </div>
              </div>

              {sendNotification &&
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    Notification emails will be sent to all selected employees upon assignment.
                  </p>
                </div>
            }

              <div className="flex flex-wrap gap-3">
                <Button
                variant="primary"
                onClick={handleAssign}
                disabled={!isFormValid || isProcessing}
                className="flex-1">

                  {isProcessing ?
                <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </> :

                <>
                      <Send className="w-4 h-4 mr-2" />
                      Assign & Notify ({selected.length})
                    </>
                }
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDraftModal(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              {/* Bulk Actions for Selected */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkEditModal(true)}
                  disabled={!selected.some((id) => employees.find((e) => e.id === id)?.status !== 'Unassigned')}>

                    <Edit className="w-3 h-3 mr-1" /> Edit Assignments
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRevoke}
                  disabled={!selected.some((id) => employees.find((e) => e.id === id)?.status !== 'Unassigned')}>

                    <XCircle className="w-3 h-3 mr-1" /> Revoke Selected
                  </Button>
                </div>
              </div>
            </Card>
          }

          {/* Empty State */}
          {selected.length === 0 &&
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500">No Employees Selected</p>
              <p className="text-sm">Select employees from the left panel to configure assignment</p>
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={selectUnassigned}>
                  Select Unassigned
                </Button>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Modals */}
      <EmployeeDetailModal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onUpdateNotes={handleUpdateNotes} />


      <DraftModal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft} />


      <SaveDraftModal
        isOpen={showSaveDraftModal}
        onClose={() => setShowSaveDraftModal(false)}
        onSave={handleSaveDraft}
        employeeCount={selected.length} />


      <AssignmentHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        assignments={assignments}
        onRevoke={handleRevokeAssignment}
        onSendReminder={handleSendReminder} />


      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        selectedCount={selected.filter((id) => employees.find((e) => e.id === id)?.status !== 'Unassigned').length}
        onApply={handleBulkEdit}
        reviewers={REVIEWERS} />


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