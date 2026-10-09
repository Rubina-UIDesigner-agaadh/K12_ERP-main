import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  PlusIcon,
  CalendarIcon,
  SearchIcon,
  XIcon,
  EditIcon,
  Trash2Icon,
  CheckIcon,
  XCircleIcon,
  DownloadIcon,
  FilterIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  MoreVerticalIcon,
  CopyIcon,
  PrinterIcon,
  FileTextIcon,
  UploadIcon,
  SaveIcon,
  UndoIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type OvertimeStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

type OvertimeEntry = {
  id: number;
  empId: string;
  empName: string;
  department: string;
  date: string;
  hours: number;
  rate: number;
  totalAmount: number;
  status: OvertimeStatus;
  remarks: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Employee = {
  id: string;
  name: string;
  department: string;
  defaultRate: number;
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

type DrawerMode = 'add' | 'edit' | 'view';

type SortField = 'empName' | 'date' | 'hours' | 'totalAmount' | 'status';
type SortDirection = 'asc' | 'desc';

type BulkAction = 'approve' | 'reject' | 'delete' | 'export';

/* -------------------------------------------------------------------------- */
/* Initial Data                                                                */
/* -------------------------------------------------------------------------- */

const generateInitialData = (): OvertimeEntry[] => [
{
  id: 1,
  empId: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'teaching',
  date: '2025-05-15',
  hours: 4,
  rate: 250,
  totalAmount: 1000,
  status: 'Approved',
  remarks: 'Extra classes for board exam preparation',
  approvedBy: 'Admin',
  approvedAt: '2025-05-16',
  createdAt: '2025-05-15T10:30:00',
  updatedAt: '2025-05-16T09:00:00'
},
{
  id: 2,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  department: 'admin',
  date: '2025-05-14',
  hours: 3,
  rate: 200,
  totalAmount: 600,
  status: 'Pending',
  remarks: 'Admission process support',
  approvedBy: null,
  approvedAt: null,
  createdAt: '2025-05-14T16:00:00',
  updatedAt: '2025-05-14T16:00:00'
},
{
  id: 3,
  empId: 'EMP003',
  empName: 'Amit Patel',
  department: 'it',
  date: '2025-05-13',
  hours: 5,
  rate: 300,
  totalAmount: 1500,
  status: 'Approved',
  remarks: 'Server maintenance and upgrade',
  approvedBy: 'Admin',
  approvedAt: '2025-05-14',
  createdAt: '2025-05-13T20:00:00',
  updatedAt: '2025-05-14T10:00:00'
},
{
  id: 4,
  empId: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'teaching',
  date: '2025-05-12',
  hours: 2,
  rate: 220,
  totalAmount: 440,
  status: 'Approved',
  remarks: 'Parent-teacher meeting coordination',
  approvedBy: 'Admin',
  approvedAt: '2025-05-13',
  createdAt: '2025-05-12T18:30:00',
  updatedAt: '2025-05-13T11:00:00'
},
{
  id: 5,
  empId: 'EMP005',
  empName: 'Vikram Singh',
  department: 'admin',
  date: '2025-05-11',
  hours: 6,
  rate: 180,
  totalAmount: 1080,
  status: 'Rejected',
  remarks: 'Event organization',
  approvedBy: 'Admin',
  approvedAt: '2025-05-12',
  createdAt: '2025-05-11T21:00:00',
  updatedAt: '2025-05-12T09:30:00'
},
{
  id: 6,
  empId: 'EMP006',
  empName: 'Meera Joshi',
  department: 'teaching',
  date: '2025-05-10',
  hours: 3.5,
  rate: 240,
  totalAmount: 840,
  status: 'Pending',
  remarks: 'Exam paper evaluation',
  approvedBy: null,
  approvedAt: null,
  createdAt: '2025-05-10T19:00:00',
  updatedAt: '2025-05-10T19:00:00'
},
{
  id: 7,
  empId: 'EMP007',
  empName: 'Arun Nair',
  department: 'it',
  date: '2025-05-09',
  hours: 4,
  rate: 280,
  totalAmount: 1120,
  status: 'Approved',
  remarks: 'Network infrastructure setup',
  approvedBy: 'Admin',
  approvedAt: '2025-05-10',
  createdAt: '2025-05-09T22:00:00',
  updatedAt: '2025-05-10T08:00:00'
},
{
  id: 8,
  empId: 'EMP002',
  empName: 'Priya Sharma',
  department: 'admin',
  date: '2025-04-28',
  hours: 2,
  rate: 200,
  totalAmount: 400,
  status: 'Approved',
  remarks: 'Month-end closing activities',
  approvedBy: 'Admin',
  approvedAt: '2025-04-29',
  createdAt: '2025-04-28T18:00:00',
  updatedAt: '2025-04-29T09:00:00'
}];


const EMPLOYEES: Employee[] = [
{ id: 'EMP001', name: 'Rajesh Kumar', department: 'teaching', defaultRate: 250 },
{ id: 'EMP002', name: 'Priya Sharma', department: 'admin', defaultRate: 200 },
{ id: 'EMP003', name: 'Amit Patel', department: 'it', defaultRate: 300 },
{ id: 'EMP004', name: 'Sneha Reddy', department: 'teaching', defaultRate: 220 },
{ id: 'EMP005', name: 'Vikram Singh', department: 'admin', defaultRate: 180 },
{ id: 'EMP006', name: 'Meera Joshi', department: 'teaching', defaultRate: 240 },
{ id: 'EMP007', name: 'Arun Nair', department: 'it', defaultRate: 280 },
{ id: 'EMP008', name: 'Kavita Menon', department: 'teaching', defaultRate: 230 },
{ id: 'EMP009', name: 'Suresh Rao', department: 'admin', defaultRate: 190 },
{ id: 'EMP010', name: 'Deepa Iyer', department: 'it', defaultRate: 310 }];


const DEPARTMENTS: Department[] = [
{ id: 'teaching', name: 'Teaching' },
{ id: 'admin', name: 'Administration' },
{ id: 'it', name: 'IT Department' }];


const MONTHS = [
{ value: '2025-05', label: 'May 2025' },
{ value: '2025-04', label: 'April 2025' },
{ value: '2025-03', label: 'March 2025' },
{ value: '2025-02', label: 'February 2025' },
{ value: '2025-01', label: 'January 2025' }];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

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
        return <AlertCircleIcon className="h-4 w-4" />;
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
    <div className="fixed bottom-4 right-4 z-[60] space-y-2">
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









}: {isOpen: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string;confirmText?: string;cancelText?: string;variant?: 'danger' | 'warning' | 'info';}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
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
  onApprove,
  onReject,
  onDelete,
  onDuplicate








}: {entry: OvertimeEntry;onView: () => void;onEdit: () => void;onApprove: () => void;onReject: () => void;onDelete: () => void;onDuplicate: () => void;}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">

        <MoreVerticalIcon className="w-4 h-4" />
      </button>

      {isOpen &&
      <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
            <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

              <EyeIcon className="w-4 h-4" />
              View Details
            </button>
            {entry.status === 'Pending' &&
          <>
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
                onApprove();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">

                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
              onClick={() => {
                onReject();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">

                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </button>
              </>
          }
            <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">

              <CopyIcon className="w-4 h-4" />
              Duplicate
            </button>
            <hr className="my-1" />
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
/* Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function OvertimeAdditionalEarnings() {
  // Data state
  const [overtimeData, setOvertimeData] = useState<OvertimeEntry[]>(generateInitialData);
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());

  // UI state
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('add');
  const [editingEntry, setEditingEntry] = useState<OvertimeEntry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<OvertimeEntry | null>(null);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<BulkAction | null>(null);

  // Filter state
  const [filters, setFilters] = useState({
    month: '2025-05',
    department: '',
    status: '',
    search: ''
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    hours: '',
    rate: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate total amount from form
  const calculatedTotal = useMemo(() => {
    if (formData.hours && formData.rate) {
      return parseFloat(formData.hours) * parseFloat(formData.rate);
    }
    return 0;
  }, [formData.hours, formData.rate]);

  // Show notification helper
  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Auto-fill rate when employee is selected
  useEffect(() => {
    if (formData.employee && drawerMode === 'add') {
      const employee = EMPLOYEES.find((e) => e.id === formData.employee);
      if (employee) {
        setFormData((prev) => ({ ...prev, rate: employee.defaultRate.toString() }));
      }
    }
  }, [formData.employee, drawerMode]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...overtimeData];

    // Filter by month
    if (filters.month) {
      result = result.filter((entry) => entry.date.startsWith(filters.month));
    }

    // Filter by department
    if (filters.department) {
      result = result.filter((entry) => entry.department === filters.department);
    }

    // Filter by status
    if (filters.status) {
      result = result.filter((entry) => entry.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (entry) =>
        entry.empName.toLowerCase().includes(searchLower) ||
        entry.empId.toLowerCase().includes(searchLower) ||
        entry.remarks.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'empName':
          comparison = a.empName.localeCompare(b.empName);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'hours':
          comparison = a.hours - b.hours;
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [overtimeData, filters, sortField, sortDirection]);

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
    const monthData = overtimeData.filter((entry) => entry.date.startsWith(filters.month));
    return {
      totalEntries: monthData.length,
      pendingCount: monthData.filter((e) => e.status === 'Pending').length,
      approvedCount: monthData.filter((e) => e.status === 'Approved').length,
      rejectedCount: monthData.filter((e) => e.status === 'Rejected').length,
      totalHours: monthData.filter((e) => e.status === 'Approved').reduce((sum, e) => sum + e.hours, 0),
      totalAmount: monthData.filter((e) => e.status === 'Approved').reduce((sum, e) => sum + e.totalAmount, 0)
    };
  }, [overtimeData, filters.month]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.employee) {
      errors.employee = 'Please select an employee';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        errors.date = 'Date cannot be in the future';
      }
    }

    if (!formData.hours) {
      errors.hours = 'Hours are required';
    } else {
      const hours = parseFloat(formData.hours);
      if (hours <= 0) {
        errors.hours = 'Hours must be greater than 0';
      } else if (hours > 24) {
        errors.hours = 'Hours cannot exceed 24';
      }
    }

    if (!formData.rate) {
      errors.rate = 'Rate is required';
    } else {
      const rate = parseFloat(formData.rate);
      if (rate <= 0) {
        errors.rate = 'Rate must be greater than 0';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      employee: '',
      date: '',
      hours: '',
      rate: '',
      remarks: ''
    });
    setFormErrors({});
    setEditingEntry(null);
  }, []);

  // Open drawer for adding
  const openAddDrawer = useCallback(() => {
    resetForm();
    setDrawerMode('add');
    setShowDrawer(true);
  }, [resetForm]);

  // Open drawer for editing
  const openEditDrawer = useCallback((entry: OvertimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      employee: entry.empId,
      date: entry.date,
      hours: entry.hours.toString(),
      rate: entry.rate.toString(),
      remarks: entry.remarks
    });
    setFormErrors({});
    setDrawerMode('edit');
    setShowDrawer(true);
  }, []);

  // Open drawer for viewing
  const openViewDrawer = useCallback((entry: OvertimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      employee: entry.empId,
      date: entry.date,
      hours: entry.hours.toString(),
      rate: entry.rate.toString(),
      remarks: entry.remarks
    });
    setDrawerMode('view');
    setShowDrawer(true);
  }, []);

  // Close drawer
  const closeDrawer = useCallback(() => {
    setShowDrawer(false);
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

    const hours = parseFloat(formData.hours);
    const rate = parseFloat(formData.rate);
    const totalAmount = hours * rate;

    if (drawerMode === 'add') {
      const newEntry: OvertimeEntry = {
        id: Math.max(...overtimeData.map((e) => e.id), 0) + 1,
        empId: employee.id,
        empName: employee.name,
        department: employee.department,
        date: formData.date,
        hours,
        rate,
        totalAmount,
        status: 'Pending',
        remarks: formData.remarks,
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setOvertimeData((prev) => [newEntry, ...prev]);
      showNotification(`Overtime entry added for ${employee.name}`);
    } else if (drawerMode === 'edit' && editingEntry) {
      setOvertimeData((prev) =>
      prev.map((entry) =>
      entry.id === editingEntry.id ?
      {
        ...entry,
        empId: employee.id,
        empName: employee.name,
        department: employee.department,
        date: formData.date,
        hours,
        rate,
        totalAmount,
        remarks: formData.remarks,
        updatedAt: new Date().toISOString()
      } :
      entry
      )
      );
      showNotification(`Overtime entry updated for ${employee.name}`);
    }

    closeDrawer();
  }, [formData, drawerMode, editingEntry, overtimeData, validateForm, showNotification, closeDrawer]);

  // Approve entry
  const handleApprove = useCallback(
    (entry: OvertimeEntry) => {
      setOvertimeData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        status: 'Approved' as OvertimeStatus,
        approvedBy: 'Admin',
        approvedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      } :
      e
      )
      );
      showNotification(`Overtime entry for ${entry.empName} has been approved`);
    },
    [showNotification]
  );

  // Reject entry
  const handleReject = useCallback(
    (entry: OvertimeEntry) => {
      setOvertimeData((prev) =>
      prev.map((e) =>
      e.id === entry.id ?
      {
        ...e,
        status: 'Rejected' as OvertimeStatus,
        approvedBy: 'Admin',
        approvedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      } :
      e
      )
      );
      showNotification(`Overtime entry for ${entry.empName} has been rejected`, 'warning');
    },
    [showNotification]
  );

  // Delete entry
  const handleDelete = useCallback(
    (entry: OvertimeEntry) => {
      setOvertimeData((prev) => prev.filter((e) => e.id !== entry.id));
      setSelectedEntries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(entry.id);
        return newSet;
      });
      showNotification(`Overtime entry for ${entry.empName} has been deleted`);
      setShowDeleteModal(false);
      setEntryToDelete(null);
    },
    [showNotification]
  );

  // Duplicate entry
  const handleDuplicate = useCallback(
    (entry: OvertimeEntry) => {
      const newEntry: OvertimeEntry = {
        ...entry,
        id: Math.max(...overtimeData.map((e) => e.id), 0) + 1,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOvertimeData((prev) => [newEntry, ...prev]);
      showNotification(`Overtime entry duplicated for ${entry.empName}`);
    },
    [overtimeData, showNotification]
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
    (action: BulkAction) => {
      const selectedData = overtimeData.filter((e) => selectedEntries.has(e.id));

      switch (action) {
        case 'approve':
          setOvertimeData((prev) =>
          prev.map((e) =>
          selectedEntries.has(e.id) && e.status === 'Pending' ?
          {
            ...e,
            status: 'Approved' as OvertimeStatus,
            approvedBy: 'Admin',
            approvedAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
          } :
          e
          )
          );
          showNotification(`${selectedData.filter((e) => e.status === 'Pending').length} entries approved`);
          break;

        case 'reject':
          setOvertimeData((prev) =>
          prev.map((e) =>
          selectedEntries.has(e.id) && e.status === 'Pending' ?
          {
            ...e,
            status: 'Rejected' as OvertimeStatus,
            approvedBy: 'Admin',
            approvedAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
          } :
          e
          )
          );
          showNotification(`${selectedData.filter((e) => e.status === 'Pending').length} entries rejected`, 'warning');
          break;

        case 'delete':
          setOvertimeData((prev) => prev.filter((e) => !selectedEntries.has(e.id)));
          showNotification(`${selectedEntries.size} entries deleted`);
          break;

        case 'export':
          exportData(selectedData);
          break;
      }

      setSelectedEntries(new Set());
      setShowBulkActionModal(false);
    },
    [overtimeData, selectedEntries, showNotification]
  );

  // Export data
  const exportData = useCallback(
    (data: OvertimeEntry[] = filteredData) => {
      const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Hours', 'Rate', 'Total Amount', 'Status', 'Remarks'];
      const rows = data.map((entry) => [
      entry.empId,
      entry.empName,
      DEPARTMENTS.find((d) => d.id === entry.department)?.name || entry.department,
      entry.date,
      entry.hours,
      entry.rate,
      entry.totalAmount,
      entry.status,
      entry.remarks]
      );

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `overtime_report_${filters.month}.csv`;
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
      search: ''
    });
    showNotification('Filters reset', 'info');
  }, [showNotification]);

  // Get status badge
  const getStatusBadge = (status: OvertimeStatus) => {
    const variants: Record<OvertimeStatus, 'success' | 'warning' | 'destructive' | 'default'> = {
      Approved: 'success',
      Pending: 'warning',
      Rejected: 'destructive',
      Cancelled: 'default'
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
          .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Overtime & Additional Earnings</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage overtime entries and additional earnings for employees
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" leftIcon={<DownloadIcon className="w-4 h-4" />} onClick={() => exportData()}>
                Export
              </Button>
              <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={openAddDrawer}>
                Add Overtime
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Entries</p>
              <p className="text-2xl font-semibold mt-1">{summaryStats.totalEntries}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-yellow-600 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-semibold text-yellow-700 mt-1">{summaryStats.pendingCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 uppercase tracking-wide">Approved Hours</p>
              <p className="text-2xl font-semibold text-green-700 mt-1">{summaryStats.totalHours} hrs</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-xs text-indigo-600 uppercase tracking-wide">Total Amount</p>
              <p className="text-2xl font-semibold text-indigo-700 mt-1">₹{summaryStats.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
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
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={[
                { value: '', label: 'All Status' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' }]
                }
                className="w-40" />

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
              <strong>{selectedEntries.size}</strong> entries selected
            </span>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('approve');
                setShowBulkActionModal(true);
              }}>

                <CheckIcon className="w-4 h-4 mr-1" />
                Approve All
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('reject');
                setShowBulkActionModal(true);
              }}>

                <XCircleIcon className="w-4 h-4 mr-1" />
                Reject All
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

        {/* Table */}
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

                    Employee Name
                    <SortIndicator field="empName" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('date')}>

                    Date
                    <SortIndicator field="date" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('hours')}>

                    Hours
                    <SortIndicator field="hours" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Rate/Hour</th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('totalAmount')}>

                    Total Amount
                    <SortIndicator field="totalAmount" />
                  </th>
                  <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:text-slate-700"
                    onClick={() => handleSort('status')}>

                    Status
                    <SortIndicator field="status" />
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedData.length === 0 ?
                <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <ClockIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="font-medium">No overtime entries found</p>
                        <p className="text-sm">Try adjusting your filters or add a new entry</p>
                      </div>
                    </td>
                  </tr> :

                paginatedData.map((row) =>
                <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${selectedEntries.has(row.id) ? 'bg-indigo-50' : ''}`}>
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
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(row.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">{row.hours} hrs</td>
                      <td className="py-3 px-4 text-right text-slate-600">₹{row.rate}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">₹{row.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(row.status)}</td>
                      <td className="py-3 px-4 text-center">
                        <ActionMenu
                      entry={row}
                      onView={() => openViewDrawer(row)}
                      onEdit={() => openEditDrawer(row)}
                      onApprove={() => handleApprove(row)}
                      onReject={() => handleReject(row)}
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

        {/* Right Slide Drawer */}
        {showDrawer &&
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
            <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl transform transition-transform">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {drawerMode === 'add' ? 'Add Overtime Entry' : drawerMode === 'edit' ? 'Edit Overtime Entry' : 'View Overtime Entry'}
                  </h3>
                  <button onClick={closeDrawer} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {/* Employee Select */}
                    <div>
                      <Select
                      label="Employee Name"
                      placeholder="Select Employee"
                      value={formData.employee}
                      onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                      options={EMPLOYEES.map((emp) => ({
                        value: emp.id,
                        label: `${emp.name} (${emp.id})`
                      }))}
                      disabled={drawerMode === 'view'} />

                      {formErrors.employee && <p className="text-xs text-red-500 mt-1">{formErrors.employee}</p>}
                    </div>

                    {/* Date */}
                    <div>
                      <Input
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      disabled={drawerMode === 'view'} />

                      {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                    </div>

                    {/* Hours */}
                    <div>
                      <Input
                      label="Overtime Hours"
                      type="number"
                      placeholder="Enter hours"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      min="0.5"
                      max="24"
                      step="0.5"
                      disabled={drawerMode === 'view'} />

                      {formErrors.hours && <p className="text-xs text-red-500 mt-1">{formErrors.hours}</p>}
                    </div>

                    {/* Rate */}
                    <div>
                      <Input
                      label="Rate per Hour (₹)"
                      type="number"
                      placeholder="Enter rate"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      min="1"
                      disabled={drawerMode === 'view'} />

                      {formErrors.rate && <p className="text-xs text-red-500 mt-1">{formErrors.rate}</p>}
                    </div>

                    {/* Total Amount Display */}
                    {calculatedTotal > 0 &&
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="text-xs text-indigo-600 uppercase tracking-wide mb-1">Total Amount</div>
                        <div className="text-2xl font-bold text-indigo-900">₹{calculatedTotal.toLocaleString()}</div>
                        <p className="text-xs text-indigo-600 mt-1">
                          {formData.hours} hours × ₹{formData.rate}/hour
                        </p>
                      </div>
                  }

                    {/* Remarks */}
                    <Textarea
                    label="Remarks"
                    placeholder="Enter remarks (optional)"
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    disabled={drawerMode === 'view'} />


                    {/* View Mode - Additional Info */}
                    {drawerMode === 'view' && editingEntry &&
                  <div className="border-t pt-4 mt-4 space-y-3">
                        <h4 className="font-medium text-slate-900">Entry Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-slate-500">Status</p>
                            <p className="font-medium">{editingEntry.status}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Department</p>
                            <p className="font-medium">
                              {DEPARTMENTS.find((d) => d.id === editingEntry.department)?.name || editingEntry.department}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Created At</p>
                            <p className="font-medium">{new Date(editingEntry.createdAt).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Updated At</p>
                            <p className="font-medium">{new Date(editingEntry.updatedAt).toLocaleString()}</p>
                          </div>
                          {editingEntry.approvedBy &&
                      <>
                              <div>
                                <p className="text-slate-500">Approved By</p>
                                <p className="font-medium">{editingEntry.approvedBy}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Approved At</p>
                                <p className="font-medium">{editingEntry.approvedAt}</p>
                              </div>
                            </>
                      }
                        </div>
                      </div>
                  }
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                  {drawerMode === 'view' ?
                <div className="flex items-center gap-2">
                      <Button variant="outline" className="flex-1" onClick={closeDrawer}>
                        Close
                      </Button>
                      {editingEntry?.status === 'Pending' &&
                  <>
                          <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setDrawerMode('edit');
                      }}>

                            <EditIcon className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        if (editingEntry) {
                          handleApprove(editingEntry);
                          closeDrawer();
                        }
                      }}>

                            <CheckIcon className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </>
                  }
                    </div> :

                <div className="flex items-center gap-2">
                      <Button variant="outline" className="flex-1" onClick={closeDrawer}>
                        Cancel
                      </Button>
                      <Button variant="primary" className="flex-1" onClick={handleSubmit}>
                        <SaveIcon className="w-4 h-4 mr-1" />
                        {drawerMode === 'add' ? 'Submit' : 'Update'}
                      </Button>
                    </div>
                }
                </div>
              </div>
            </div>
          </div>
        }

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
          title="Delete Overtime Entry"
          message={`Are you sure you want to delete the overtime entry for ${entryToDelete?.empName}? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger" />


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
          bulkActionType === 'approve' ?
          'Approve Selected Entries' :
          bulkActionType === 'reject' ?
          'Reject Selected Entries' :
          'Delete Selected Entries'
          }
          message={`Are you sure you want to ${bulkActionType} ${selectedEntries.size} selected entries?${bulkActionType === 'delete' ? ' This action cannot be undone.' : ''}`}
          confirmText={bulkActionType === 'approve' ? 'Approve All' : bulkActionType === 'reject' ? 'Reject All' : 'Delete All'}
          variant={bulkActionType === 'delete' ? 'danger' : bulkActionType === 'reject' ? 'warning' : 'info'} />

      </div>

      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}