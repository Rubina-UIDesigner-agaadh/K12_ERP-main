import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  XCircle,
  Info,
  Eye,
  Search,
  X,
  FileText,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Upload,
  Download,
  Filter,
  RotateCcw,
  MessageSquare,
  Pencil,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Send,
  Paperclip,
  MoreVertical,
  RefreshCw,
  History,
  UserCheck,
  FileUp } from
'lucide-react';

// ============ UI COMPONENTS ============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300',
    outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      disabled={disabled}
      {...props}>

      {children}
    </button>);

}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  error?: string;
}

function Input({
  label,
  leftIcon,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      }
      <div className="relative">
        {leftIcon &&
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </div>
        }
        <input
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          leftIcon ? 'pl-10' : ''} ${
          error ? 'border-red-500' : ''} ${className}`}
          {...props} />

      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}

interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      }
      <textarea
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
        error ? 'border-red-500' : ''} ${
        className}`}
        rows={3}
        {...props} />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder
}: SelectProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      }
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">

        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
    </div>);

}

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-700',
    secondary: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>

      {children}
    </span>);

}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose} />

        <div
          className={`relative bg-white rounded-xl shadow-xl ${sizes[size]} w-full p-6 z-10 max-h-[90vh] overflow-y-auto`}>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors">

              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>);

}

// ============ TYPES ============
interface TimelineItem {
  id: string;
  date: string;
  action: string;
  user: string;
  comment?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Exception {
  id: number;
  empName: string;
  empCode: string;
  department: string;
  exceptionType: string;
  description: string;
  detectedOn: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved' | 'In Progress' | 'Escalated';
  assignedTo?: string;
  resolvedBy?: string;
  resolvedOn?: string;
  resolutionNotes?: string;
  documents: Document[];
  timeline: TimelineItem[];
}

type SortField = 'empName' | 'department' | 'exceptionType' | 'detectedOn' | 'severity' | 'status';
type SortDirection = 'asc' | 'desc';

// ============ INITIAL DATA ============
const INITIAL_EXCEPTION_DATA: Exception[] = [
{
  id: 1,
  empName: 'Rajesh Kumar',
  empCode: 'EMP001',
  department: 'Teaching',
  exceptionType: 'Missing Bank Details',
  description: 'Bank account number not updated in system',
  detectedOn: '2025-05-15',
  severity: 'High',
  status: 'Open',
  documents: [],
  timeline: [
  {
    id: 't1',
    date: '2025-05-15T10:30:00',
    action: 'Exception detected',
    user: 'System'
  }]

},
{
  id: 2,
  empName: 'Priya Sharma',
  empCode: 'EMP002',
  department: 'Administration',
  exceptionType: 'Attendance Mismatch',
  description: 'Working days (22) do not match attendance records (20)',
  detectedOn: '2025-05-14',
  severity: 'Medium',
  status: 'Open',
  documents: [],
  timeline: [
  {
    id: 't2',
    date: '2025-05-14T09:15:00',
    action: 'Exception detected',
    user: 'System'
  }]

},
{
  id: 3,
  empName: 'Amit Patel',
  empCode: 'EMP003',
  department: 'IT Department',
  exceptionType: 'Salary Component Error',
  description: 'HRA calculation exceeds 40% of basic salary',
  detectedOn: '2025-05-13',
  severity: 'Low',
  status: 'Resolved',
  resolvedBy: 'Admin User',
  resolvedOn: '2025-05-14',
  resolutionNotes: 'HRA percentage corrected to 35% as per policy',
  documents: [],
  timeline: [
  {
    id: 't3',
    date: '2025-05-13T14:20:00',
    action: 'Exception detected',
    user: 'System'
  },
  {
    id: 't4',
    date: '2025-05-14T11:45:00',
    action: 'Exception resolved',
    user: 'Admin User',
    comment: 'HRA percentage corrected to 35% as per policy'
  }]

},
{
  id: 4,
  empName: 'Sneha Reddy',
  empCode: 'EMP004',
  department: 'Finance',
  exceptionType: 'PF Deduction Error',
  description: 'PF amount calculated incorrectly for current month',
  detectedOn: '2025-05-12',
  severity: 'High',
  status: 'In Progress',
  assignedTo: 'HR Manager',
  documents: [],
  timeline: [
  {
    id: 't5',
    date: '2025-05-12T16:00:00',
    action: 'Exception detected',
    user: 'System'
  },
  {
    id: 't6',
    date: '2025-05-13T09:00:00',
    action: 'Assigned to HR Manager',
    user: 'Admin User'
  }]

},
{
  id: 5,
  empName: 'Vikram Singh',
  empCode: 'EMP005',
  department: 'Support Staff',
  exceptionType: 'Leave Without Pay',
  description: 'LWP days not reflected in salary calculation',
  detectedOn: '2025-05-11',
  severity: 'Medium',
  status: 'Escalated',
  documents: [],
  timeline: [
  {
    id: 't7',
    date: '2025-05-11T08:30:00',
    action: 'Exception detected',
    user: 'System'
  },
  {
    id: 't8',
    date: '2025-05-12T10:00:00',
    action: 'Escalated to senior management',
    user: 'HR Manager',
    comment: 'Requires policy clarification'
  }]

},
{
  id: 6,
  empName: 'Ananya Gupta',
  empCode: 'EMP006',
  department: 'Teaching',
  exceptionType: 'Tax Declaration Missing',
  description: 'Investment declaration for current FY not submitted',
  detectedOn: '2025-05-10',
  severity: 'Medium',
  status: 'Open',
  documents: [],
  timeline: [
  {
    id: 't9',
    date: '2025-05-10T11:00:00',
    action: 'Exception detected',
    user: 'System'
  }]

},
{
  id: 7,
  empName: 'Rahul Verma',
  empCode: 'EMP007',
  department: 'Administration',
  exceptionType: 'Overtime Calculation Error',
  description: 'Overtime hours not matching with approved requests',
  detectedOn: '2025-05-09',
  severity: 'Low',
  status: 'Resolved',
  resolvedBy: 'Payroll Admin',
  resolvedOn: '2025-05-10',
  resolutionNotes: 'Overtime hours verified and corrected',
  documents: [],
  timeline: [
  {
    id: 't10',
    date: '2025-05-09T15:30:00',
    action: 'Exception detected',
    user: 'System'
  },
  {
    id: 't11',
    date: '2025-05-10T14:00:00',
    action: 'Exception resolved',
    user: 'Payroll Admin',
    comment: 'Overtime hours verified and corrected'
  }]

}];


const DEPARTMENTS = [
{ value: 'Teaching', label: 'Teaching' },
{ value: 'Administration', label: 'Administration' },
{ value: 'IT Department', label: 'IT Department' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Support Staff', label: 'Support Staff' }];


const EXCEPTION_TYPES = [
{ value: 'Missing Bank Details', label: 'Missing Bank Details' },
{ value: 'Attendance Mismatch', label: 'Attendance Mismatch' },
{ value: 'Salary Component Error', label: 'Salary Component Error' },
{ value: 'PF Deduction Error', label: 'PF Deduction Error' },
{ value: 'Leave Without Pay', label: 'Leave Without Pay' },
{ value: 'Tax Declaration Missing', label: 'Tax Declaration Missing' },
{ value: 'Overtime Calculation Error', label: 'Overtime Calculation Error' },
{ value: 'Bonus Calculation Error', label: 'Bonus Calculation Error' },
{ value: 'Reimbursement Pending', label: 'Reimbursement Pending' }];


const STATUSES = [
{ value: 'Open', label: 'Open' },
{ value: 'In Progress', label: 'In Progress' },
{ value: 'Escalated', label: 'Escalated' },
{ value: 'Resolved', label: 'Resolved' }];


const SEVERITIES = [
{ value: 'High', label: 'High' },
{ value: 'Medium', label: 'Medium' },
{ value: 'Low', label: 'Low' }];


const MONTHS = [
{ value: 'May 2025', label: 'May 2025' },
{ value: 'April 2025', label: 'April 2025' },
{ value: 'March 2025', label: 'March 2025' },
{ value: 'February 2025', label: 'February 2025' },
{ value: 'January 2025', label: 'January 2025' }];


const EMPLOYEES = [
{ value: 'EMP001', label: 'Rajesh Kumar (EMP001)', name: 'Rajesh Kumar', department: 'Teaching' },
{ value: 'EMP002', label: 'Priya Sharma (EMP002)', name: 'Priya Sharma', department: 'Administration' },
{ value: 'EMP003', label: 'Amit Patel (EMP003)', name: 'Amit Patel', department: 'IT Department' },
{ value: 'EMP004', label: 'Sneha Reddy (EMP004)', name: 'Sneha Reddy', department: 'Finance' },
{ value: 'EMP005', label: 'Vikram Singh (EMP005)', name: 'Vikram Singh', department: 'Support Staff' },
{ value: 'EMP006', label: 'Ananya Gupta (EMP006)', name: 'Ananya Gupta', department: 'Teaching' },
{ value: 'EMP007', label: 'Rahul Verma (EMP007)', name: 'Rahul Verma', department: 'Administration' },
{ value: 'EMP008', label: 'Kavita Nair (EMP008)', name: 'Kavita Nair', department: 'Finance' }];


const ASSIGNEES = [
{ value: 'HR Manager', label: 'HR Manager' },
{ value: 'Payroll Admin', label: 'Payroll Admin' },
{ value: 'Finance Head', label: 'Finance Head' },
{ value: 'Admin User', label: 'Admin User' }];


// ============ MAIN COMPONENT ============
export function PayrollExceptionList() {
  // Data state
  const [exceptions, setExceptions] = useState<Exception[]>(INITIAL_EXCEPTION_DATA);

  // Filter state
  const [filters, setFilters] = useState({
    month: 'May 2025',
    department: '',
    exceptionType: '',
    status: '',
    severity: '',
    search: ''
  });

  // Sort state
  const [sortField, setSortField] = useState<SortField>('detectedOn');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Current exception state
  const [selectedExceptionId, setSelectedExceptionId] = useState<number | null>(null);
  const [currentException, setCurrentException] = useState<Exception | null>(null);

  // Form states
  const [newException, setNewException] = useState({
    empCode: '',
    exceptionType: '',
    description: '',
    severity: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const [editForm, setEditForm] = useState({
    exceptionType: '',
    description: '',
    severity: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const [resolveForm, setResolveForm] = useState({
    notes: ''
  });

  const [assignForm, setAssignForm] = useState({
    assignee: '',
    comment: ''
  });

  const [commentText, setCommentText] = useState('');
  const [bulkAction, setBulkAction] = useState('');

  // ============ COMPUTED VALUES ============
  const filteredExceptions = useMemo(() => {
    let result = [...exceptions];

    // Apply filters
    if (filters.department) {
      result = result.filter((e) => e.department === filters.department);
    }
    if (filters.exceptionType) {
      result = result.filter((e) => e.exceptionType === filters.exceptionType);
    }
    if (filters.status) {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters.severity) {
      result = result.filter((e) => e.severity === filters.severity);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
        e.empName.toLowerCase().includes(searchLower) ||
        e.empCode.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === 'severity') {
        const severityOrder = { High: 3, Medium: 2, Low: 1 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [exceptions, filters, sortField, sortDirection]);

  const paginatedExceptions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExceptions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExceptions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredExceptions.length / itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: exceptions.length,
      open: exceptions.filter((e) => e.status === 'Open').length,
      inProgress: exceptions.filter((e) => e.status === 'In Progress').length,
      resolved: exceptions.filter((e) => e.status === 'Resolved').length,
      escalated: exceptions.filter((e) => e.status === 'Escalated').length,
      highSeverity: exceptions.filter((e) => e.severity === 'High' && e.status !== 'Resolved').length
    };
  }, [exceptions]);

  // ============ HANDLERS ============
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedExceptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedExceptions.map((e) => e.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleViewDetails = (exception: Exception) => {
    setCurrentException(exception);
    setSelectedExceptionId(exception.id);
    setShowDetailModal(true);
  };

  const handleOpenAdd = () => {
    setNewException({
      empCode: '',
      exceptionType: '',
      description: '',
      severity: 'Medium'
    });
    setShowAddModal(true);
  };

  const handleAddException = () => {
    if (!newException.empCode || !newException.exceptionType || !newException.description) {
      alert('Please fill in all required fields');
      return;
    }

    const employee = EMPLOYEES.find((e) => e.value === newException.empCode);
    if (!employee) return;

    const newExc: Exception = {
      id: Date.now(),
      empName: employee.name,
      empCode: newException.empCode,
      department: employee.department,
      exceptionType: newException.exceptionType,
      description: newException.description,
      severity: newException.severity,
      status: 'Open',
      detectedOn: new Date().toISOString().split('T')[0],
      documents: [],
      timeline: [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString(),
        action: 'Exception created manually',
        user: 'Current User'
      }]

    };

    setExceptions([newExc, ...exceptions]);
    setShowAddModal(false);
    alert('Exception added successfully');
  };

  const handleOpenEdit = (exception: Exception) => {
    setCurrentException(exception);
    setEditForm({
      exceptionType: exception.exceptionType,
      description: exception.description,
      severity: exception.severity
    });
    setShowEditModal(true);
  };

  const handleEditException = () => {
    if (!currentException) return;

    setExceptions(
      exceptions.map((e) => {
        if (e.id === currentException.id) {
          return {
            ...e,
            exceptionType: editForm.exceptionType,
            description: editForm.description,
            severity: editForm.severity,
            timeline: [
            ...e.timeline,
            {
              id: `t-${Date.now()}`,
              date: new Date().toISOString(),
              action: 'Exception details updated',
              user: 'Current User'
            }]

          };
        }
        return e;
      })
    );

    setShowEditModal(false);
    // Update current exception in detail modal if open
    if (showDetailModal && currentException) {
      const updated = exceptions.find((e) => e.id === currentException.id);
      if (updated) setCurrentException(updated);
    }
    alert('Exception updated successfully');
  };

  const handleOpenResolve = (exception: Exception) => {
    setCurrentException(exception);
    setResolveForm({ notes: '' });
    setShowResolveModal(true);
  };

  const handleResolveException = () => {
    if (!currentException) return;
    if (!resolveForm.notes.trim()) {
      alert('Please enter resolution notes');
      return;
    }

    const now = new Date();

    setExceptions(
      exceptions.map((e) => {
        if (e.id === currentException.id) {
          return {
            ...e,
            status: 'Resolved',
            resolvedBy: 'Current User',
            resolvedOn: now.toISOString().split('T')[0],
            resolutionNotes: resolveForm.notes,
            timeline: [
            ...e.timeline,
            {
              id: `t-${Date.now()}`,
              date: now.toISOString(),
              action: 'Exception resolved',
              user: 'Current User',
              comment: resolveForm.notes
            }]

          };
        }
        return e;
      })
    );

    setShowResolveModal(false);
    setShowDetailModal(false);
    alert('Exception marked as resolved');
  };

  const handleOpenAssign = (exception: Exception) => {
    setCurrentException(exception);
    setAssignForm({ assignee: '', comment: '' });
    setShowAssignModal(true);
  };

  const handleAssignException = () => {
    if (!currentException || !assignForm.assignee) {
      alert('Please select an assignee');
      return;
    }

    setExceptions(
      exceptions.map((e) => {
        if (e.id === currentException.id) {
          return {
            ...e,
            status: 'In Progress',
            assignedTo: assignForm.assignee,
            timeline: [
            ...e.timeline,
            {
              id: `t-${Date.now()}`,
              date: new Date().toISOString(),
              action: `Assigned to ${assignForm.assignee}`,
              user: 'Current User',
              comment: assignForm.comment || undefined
            }]

          };
        }
        return e;
      })
    );

    setShowAssignModal(false);
    alert(`Exception assigned to ${assignForm.assignee}`);
  };

  const handleEscalate = (exception: Exception) => {
    if (!window.confirm('Are you sure you want to escalate this exception?')) return;

    setExceptions(
      exceptions.map((e) => {
        if (e.id === exception.id) {
          return {
            ...e,
            status: 'Escalated',
            timeline: [
            ...e.timeline,
            {
              id: `t-${Date.now()}`,
              date: new Date().toISOString(),
              action: 'Exception escalated',
              user: 'Current User'
            }]

          };
        }
        return e;
      })
    );

    alert('Exception escalated successfully');
  };

  const handleOpenDelete = (exception: Exception) => {
    setCurrentException(exception);
    setShowDeleteConfirm(true);
  };

  const handleDeleteException = () => {
    if (!currentException) return;

    setExceptions(exceptions.filter((e) => e.id !== currentException.id));
    setShowDeleteConfirm(false);
    setShowDetailModal(false);
    alert('Exception deleted successfully');
  };

  const handleAddComment = () => {
    if (!currentException || !commentText.trim()) return;

    setExceptions(
      exceptions.map((e) => {
        if (e.id === currentException.id) {
          const updatedTimeline = [
          ...e.timeline,
          {
            id: `t-${Date.now()}`,
            date: new Date().toISOString(),
            action: 'Comment added',
            user: 'Current User',
            comment: commentText
          }];

          return { ...e, timeline: updatedTimeline };
        }
        return e;
      })
    );

    // Update current exception
    const updated = exceptions.find((e) => e.id === currentException.id);
    if (updated) {
      setCurrentException({
        ...updated,
        timeline: [
        ...updated.timeline,
        {
          id: `t-${Date.now()}`,
          date: new Date().toISOString(),
          action: 'Comment added',
          user: 'Current User',
          comment: commentText
        }]

      });
    }

    setCommentText('');
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentException || !e.target.files?.length) return;

    const file = e.target.files[0];
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString()
    };

    setExceptions(
      exceptions.map((exc) => {
        if (exc.id === currentException.id) {
          return {
            ...exc,
            documents: [...exc.documents, newDoc],
            timeline: [
            ...exc.timeline,
            {
              id: `t-${Date.now()}`,
              date: new Date().toISOString(),
              action: `Document uploaded: ${file.name}`,
              user: 'Current User'
            }]

          };
        }
        return exc;
      })
    );

    // Update current exception
    setCurrentException({
      ...currentException,
      documents: [...currentException.documents, newDoc]
    });

    setShowUploadModal(false);
    alert('Document uploaded successfully');
  };

  const handleDeleteDocument = (docId: string) => {
    if (!currentException) return;
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    setExceptions(
      exceptions.map((exc) => {
        if (exc.id === currentException.id) {
          return {
            ...exc,
            documents: exc.documents.filter((d) => d.id !== docId)
          };
        }
        return exc;
      })
    );

    setCurrentException({
      ...currentException,
      documents: currentException.documents.filter((d) => d.id !== docId)
    });
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.length === 0) return;

    if (bulkAction === 'resolve') {
      setExceptions(
        exceptions.map((e) => {
          if (selectedIds.includes(e.id)) {
            return {
              ...e,
              status: 'Resolved',
              resolvedBy: 'Current User',
              resolvedOn: new Date().toISOString().split('T')[0],
              timeline: [
              ...e.timeline,
              {
                id: `t-${Date.now()}-${e.id}`,
                date: new Date().toISOString(),
                action: 'Exception resolved (bulk action)',
                user: 'Current User'
              }]

            };
          }
          return e;
        })
      );
      alert(`${selectedIds.length} exceptions marked as resolved`);
    } else if (bulkAction === 'escalate') {
      setExceptions(
        exceptions.map((e) => {
          if (selectedIds.includes(e.id)) {
            return {
              ...e,
              status: 'Escalated',
              timeline: [
              ...e.timeline,
              {
                id: `t-${Date.now()}-${e.id}`,
                date: new Date().toISOString(),
                action: 'Exception escalated (bulk action)',
                user: 'Current User'
              }]

            };
          }
          return e;
        })
      );
      alert(`${selectedIds.length} exceptions escalated`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} exceptions?`)) return;
      setExceptions(exceptions.filter((e) => !selectedIds.includes(e.id)));
      alert(`${selectedIds.length} exceptions deleted`);
    }

    setSelectedIds([]);
    setShowBulkActionModal(false);
    setBulkAction('');
  };

  const handleResetFilters = () => {
    setFilters({
      month: 'May 2025',
      department: '',
      exceptionType: '',
      status: '',
      severity: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
    ['Employee Name', 'Employee Code', 'Department', 'Exception Type', 'Description', 'Detected On', 'Severity', 'Status'].join(','),
    ...filteredExceptions.map((e) =>
    [e.empName, e.empCode, e.department, e.exceptionType, `"${e.description}"`, e.detectedOn, e.severity, e.status].join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-exceptions-${filters.month.replace(' ', '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // In real app, this would fetch from API
    setExceptions([...INITIAL_EXCEPTION_DATA]);
    setSelectedIds([]);
    alert('Data refreshed');
  };

  // ============ RENDER HELPERS ============
  const getSeverityBadge = (severity: string) => {
    const config: Record<string, {variant: 'danger' | 'warning' | 'info';icon: React.ReactNode;}> = {
      High: { variant: 'danger', icon: <XCircle className="w-3 h-3" /> },
      Medium: { variant: 'warning', icon: <AlertTriangle className="w-3 h-3" /> },
      Low: { variant: 'info', icon: <Info className="w-3 h-3" /> }
    };
    const { variant, icon } = config[severity] || config.Low;
    return (
      <Badge variant={variant} className="inline-flex items-center gap-1">
        {icon}
        {severity}
      </Badge>);

  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      Open: 'warning',
      'In Progress': 'info',
      Resolved: 'success',
      Escalated: 'danger'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const SortIcon = ({ field }: {field: SortField;}) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3" /> :

    <ChevronDown className="w-3 h-3" />;

  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Payroll Exception List
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and resolve payroll processing exceptions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Add Exception
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filters</span>
            </div>
            <Button variant="ghost" size="xs" onClick={handleResetFilters}>
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Select
              label="Month"
              value={filters.month}
              onChange={(val) => setFilters({ ...filters, month: val })}
              options={MONTHS} />

            <Select
              label="Department"
              value={filters.department}
              onChange={(val) => setFilters({ ...filters, department: val })}
              placeholder="All Departments"
              options={DEPARTMENTS} />

            <Select
              label="Exception Type"
              value={filters.exceptionType}
              onChange={(val) => setFilters({ ...filters, exceptionType: val })}
              placeholder="All Types"
              options={EXCEPTION_TYPES} />

            <Select
              label="Status"
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val })}
              placeholder="All Status"
              options={STATUSES} />

            <Select
              label="Severity"
              value={filters.severity}
              onChange={(val) => setFilters({ ...filters, severity: val })}
              placeholder="All Severity"
              options={SEVERITIES} />

            <Input
              label="Search"
              placeholder="Name, Code, Description..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })} />

          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 &&
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                {selectedIds.length} exception(s) selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}>

                Clear Selection
              </Button>
              <Button
              size="sm"
              onClick={() => setShowBulkActionModal(true)}>

                Bulk Actions
              </Button>
            </div>
          </div>
        }

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing {paginatedExceptions.length} of {filteredExceptions.length} exceptions
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded text-sm">

              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Exception Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                      selectedIds.length === paginatedExceptions.length &&
                      paginatedExceptions.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300" />

                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('empName')}>

                    <div className="flex items-center gap-1">
                      Employee
                      <SortIcon field="empName" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('department')}>

                    <div className="flex items-center gap-1">
                      Department
                      <SortIcon field="department" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('exceptionType')}>

                    <div className="flex items-center gap-1">
                      Exception Type
                      <SortIcon field="exceptionType" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('detectedOn')}>

                    <div className="flex items-center gap-1">
                      Detected On
                      <SortIcon field="detectedOn" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('severity')}>

                    <div className="flex items-center justify-center gap-1">
                      Severity
                      <SortIcon field="severity" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('status')}>

                    <div className="flex items-center justify-center gap-1">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedExceptions.length === 0 ?
                <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No exceptions found</p>
                    </td>
                  </tr> :

                paginatedExceptions.map((row) =>
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${
                  row.severity === 'High' ?
                  'border-l-4 border-l-red-400' :
                  row.severity === 'Medium' ?
                  'border-l-4 border-l-amber-400' :
                  'border-l-4 border-l-blue-400'} ${
                  selectedIds.includes(row.id) ? 'bg-indigo-50' : ''}`}>

                      <td className="py-3 px-4">
                        <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                      className="w-4 h-4 rounded border-slate-300" />

                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">
                          {row.empName}
                        </div>
                        <div className="text-xs text-slate-500">{row.empCode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{row.department}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {row.exceptionType}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {row.description}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(row.detectedOn).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getSeverityBadge(row.severity)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        onClick={() => handleViewDetails(row)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details">

                            <Eye className="w-4 h-4" />
                          </button>
                          {row.status !== 'Resolved' &&
                      <>
                              <button
                          onClick={() => handleOpenEdit(row)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit">

                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                          onClick={() => handleOpenResolve(row)}
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark Resolved">

                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </>
                      }
                          <button
                        onClick={() => handleOpenDelete(row)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 &&
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}>

                First
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}>

                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}>

                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}>

                Last
              </Button>
            </div>
          </div>
        }

        {/* ============ MODALS ============ */}

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Exception Details"
          size="lg">

          {currentException &&
          <div className="space-y-6">
              {/* Employee Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Employee Name
                    </div>
                    <div className="font-semibold text-slate-900">
                      {currentException.empName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Employee Code
                    </div>
                    <div className="font-semibold text-slate-900">
                      {currentException.empCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Department
                    </div>
                    <div className="font-medium text-slate-700">
                      {currentException.department}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Detected On
                    </div>
                    <div className="font-medium text-slate-700">
                      {new Date(currentException.detectedOn).toLocaleDateString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      }
                    )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exception Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Exception Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Exception Type
                      </div>
                      <div className="font-medium text-slate-900">
                        {currentException.exceptionType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(currentException.severity)}
                      {getStatusBadge(currentException.status)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Description
                    </div>
                    <div className="text-sm text-slate-700">
                      {currentException.description}
                    </div>
                  </div>
                  {currentException.assignedTo &&
                <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Assigned To
                      </div>
                      <div className="text-sm text-slate-700">
                        {currentException.assignedTo}
                      </div>
                    </div>
                }
                  {currentException.status === 'Resolved' &&
                <>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          Resolved By
                        </div>
                        <div className="text-sm text-slate-700">
                          {currentException.resolvedBy} on{' '}
                          {new Date(currentException.resolvedOn!).toLocaleDateString(
                        'en-IN'
                      )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          Resolution Notes
                        </div>
                        <div className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg">
                          {currentException.resolutionNotes}
                        </div>
                      </div>
                    </>
                }
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Activity Timeline
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {currentException.timeline.map((item) =>
                <div key={item.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {item.action}
                        </div>
                        {item.comment &&
                    <div className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                            {item.comment}
                          </div>
                    }
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                          • {item.user}
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>

              {/* Add Comment */}
              {currentException.status !== 'Resolved' &&
            <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">
                    Add Comment
                  </h4>
                  <div className="flex gap-2">
                    <Input
                  placeholder="Type your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)} />

                    <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            }

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Attached Documents
                  </h4>
                  {currentException.status !== 'Resolved' &&
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowUploadModal(true)}>

                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                }
                </div>
                {currentException.documents.length === 0 ?
              <div className="text-center py-6 bg-slate-50 rounded-lg">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No documents attached</p>
                  </div> :

              <div className="space-y-2">
                    {currentException.documents.map((doc) =>
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">

                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <span className="text-sm text-slate-700">{doc.name}</span>
                            <div className="text-xs text-slate-400">
                              {doc.size} • Uploaded by {doc.uploadedBy}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="xs">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteDocument(doc.id)}>

                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                )}
                  </div>
              }
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {currentException.status !== 'Resolved' &&
                <>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenEdit(currentException);
                    }}>

                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenAssign(currentException);
                    }}>

                        <UserCheck className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                      {currentException.status !== 'Escalated' &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEscalate(currentException)}>

                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Escalate
                        </Button>
                  }
                    </>
                }
                </div>
                <div className="flex items-center gap-2">
                  <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}>

                    Close
                  </Button>
                  {currentException.status !== 'Resolved' &&
                <Button
                  variant="success"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenResolve(currentException);
                  }}>

                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Resolved
                    </Button>
                }
                </div>
              </div>
            </div>
          }
        </Modal>

        {/* Add Exception Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Exception"
          size="md">

          <div className="space-y-4">
            <Select
              label="Employee"
              value={newException.empCode}
              onChange={(val) => setNewException({ ...newException, empCode: val })}
              placeholder="Select Employee"
              options={EMPLOYEES} />

            <Select
              label="Exception Type"
              value={newException.exceptionType}
              onChange={(val) => setNewException({ ...newException, exceptionType: val })}
              placeholder="Select Exception Type"
              options={EXCEPTION_TYPES} />

            <Textarea
              label="Description"
              value={newException.description}
              onChange={(e) =>
              setNewException({ ...newException, description: e.target.value })
              }
              placeholder="Describe the exception..." />

            <Select
              label="Severity"
              value={newException.severity}
              onChange={(val) =>
              setNewException({
                ...newException,
                severity: val as 'High' | 'Medium' | 'Low'
              })
              }
              options={SEVERITIES} />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddException}>Add Exception</Button>
            </div>
          </div>
        </Modal>

        {/* Edit Exception Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Exception"
          size="md">

          <div className="space-y-4">
            <Select
              label="Exception Type"
              value={editForm.exceptionType}
              onChange={(val) => setEditForm({ ...editForm, exceptionType: val })}
              options={EXCEPTION_TYPES} />

            <Textarea
              label="Description"
              value={editForm.description}
              onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
              } />

            <Select
              label="Severity"
              value={editForm.severity}
              onChange={(val) =>
              setEditForm({
                ...editForm,
                severity: val as 'High' | 'Medium' | 'Low'
              })
              }
              options={SEVERITIES} />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditException}>Save Changes</Button>
            </div>
          </div>
        </Modal>

        {/* Resolve Exception Modal */}
        <Modal
          isOpen={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          title="Resolve Exception"
          size="md">

          <div className="space-y-4">
            {currentException &&
            <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>{currentException.empName}</strong> -{' '}
                  {currentException.exceptionType}
                </p>
              </div>
            }
            <Textarea
              label="Resolution Notes"
              value={resolveForm.notes}
              onChange={(e) => setResolveForm({ notes: e.target.value })}
              placeholder="Describe how the exception was resolved..." />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowResolveModal(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleResolveException}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark as Resolved
              </Button>
            </div>
          </div>
        </Modal>

        {/* Assign Exception Modal */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Exception"
          size="md">

          <div className="space-y-4">
            {currentException &&
            <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>{currentException.empName}</strong> -{' '}
                  {currentException.exceptionType}
                </p>
              </div>
            }
            <Select
              label="Assign To"
              value={assignForm.assignee}
              onChange={(val) => setAssignForm({ ...assignForm, assignee: val })}
              placeholder="Select Assignee"
              options={ASSIGNEES} />

            <Textarea
              label="Comment (Optional)"
              value={assignForm.comment}
              onChange={(e) =>
              setAssignForm({ ...assignForm, comment: e.target.value })
              }
              placeholder="Add any notes for the assignee..." />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignException}>
                <UserCheck className="w-4 h-4 mr-1" />
                Assign
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Exception"
          size="sm">

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <p className="text-sm text-red-700">
                Are you sure you want to delete this exception? This action cannot
                be undone.
              </p>
            </div>
            {currentException &&
            <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>{currentException.empName}</strong> -{' '}
                  {currentException.exceptionType}
                </p>
              </div>
            }
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteException}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        {/* Bulk Action Modal */}
        <Modal
          isOpen={showBulkActionModal}
          onClose={() => setShowBulkActionModal(false)}
          title="Bulk Actions"
          size="sm">

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Apply action to {selectedIds.length} selected exception(s)
            </p>
            <Select
              label="Select Action"
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Choose action..."
              options={[
              { value: 'resolve', label: 'Mark as Resolved' },
              { value: 'escalate', label: 'Escalate' },
              { value: 'delete', label: 'Delete' }]
              } />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkActionModal(false);
                  setBulkAction('');
                }}>

                Cancel
              </Button>
              <Button onClick={handleBulkAction} disabled={!bulkAction}>
                Apply Action
              </Button>
            </div>
          </div>
        </Modal>

        {/* Upload Document Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Document"
          size="sm">

          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 mb-3">
                Click to select or drag and drop your file
              </p>
              <input
                type="file"
                onChange={handleUploadDocument}
                className="hidden"
                id="file-upload" />

              <label htmlFor="file-upload">
                <Button variant="outline" as="span" className="cursor-pointer">
                  <Paperclip className="w-4 h-4 mr-1" />
                  Select File
                </Button>
              </label>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>);

}

export default PayrollExceptionList;