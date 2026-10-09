import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  MessageSquareIcon,
  FileTextIcon,
  CreditCardIcon,
  DownloadIcon,
  DollarSignIcon,
  CheckSquareIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  PlayIcon,
  PauseIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  ChevronDownIcon,
  MailIcon,
  UploadIcon,
  TrashIcon,
  EditIcon,
  CopyIcon,
  MoreVerticalIcon,
  ZapIcon,
  LayersIcon,
  ArrowRightIcon,
  HistoryIcon,
  AwardIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
  Loader2Icon,
  SendIcon } from
'lucide-react';

// Types
interface BulkOperation {
  id: string;
  name: string;
  type: string;
  initiatedBy: string;
  date: string;
  time: string;
  records: number;
  processedRecords: number;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Queued' | 'Cancelled';
  duration: string;
  errorCount: number;
  category: string;
}

interface ScheduledOperation {
  id: string;
  name: string;
  type: string;
  schedule: string;
  recurrence: 'Daily' | 'Weekly' | 'Monthly' | 'One-time';
  status: 'Active' | 'Paused' | 'Disabled';
  lastRun: string;
  nextRun: string;
  createdBy: string;
}

interface OperationTemplate {
  id: string;
  name: string;
  type: string;
  usageCount: number;
  lastUsed: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Custom Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors">

              <XIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>);

};

// Custom Table Component
interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

function Table<T extends Record<string, any>>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) =>
            <th
              key={column.key}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                {column.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) =>
          <tr key={index} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) =>
            <td key={column.key} className="px-4 py-3 text-sm">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
      {data.length === 0 &&
      <div className="text-center py-8 text-gray-500">No data available</div>
      }
    </div>);

}

// Mock Data
const recentOpsData: BulkOperation[] = [
{
  id: '1',
  name: 'Bulk SMS: Fee Reminder',
  type: 'sms',
  initiatedBy: 'Admin',
  date: '20-Feb-2025',
  time: '10:30 AM',
  records: 450,
  processedRecords: 450,
  status: 'Completed',
  duration: '2m 30s',
  errorCount: 0,
  category: 'Communication'
},
{
  id: '2',
  name: 'ID Card Generation - Class 10',
  type: 'idcard',
  initiatedBy: 'Principal',
  date: '18-Feb-2025',
  time: '02:15 PM',
  records: 120,
  processedRecords: 78,
  status: 'In Progress',
  duration: '-',
  errorCount: 2,
  category: 'Documents'
},
{
  id: '3',
  name: 'Attendance Correction - Jan 2025',
  type: 'attendance',
  initiatedBy: 'Class Teacher',
  date: '15-Feb-2025',
  time: '09:00 AM',
  records: 15,
  processedRecords: 15,
  status: 'Completed',
  duration: '45s',
  errorCount: 0,
  category: 'Attendance'
},
{
  id: '4',
  name: 'Bulk Fee Adjustment - Sports Day',
  type: 'fee',
  initiatedBy: 'Accountant',
  date: '10-Feb-2025',
  time: '11:45 AM',
  records: 50,
  processedRecords: 35,
  status: 'Failed',
  duration: '1m 10s',
  errorCount: 15,
  category: 'Finance'
},
{
  id: '5',
  name: 'Data Export: Student List',
  type: 'export',
  initiatedBy: 'Admin',
  date: '05-Feb-2025',
  time: '03:30 PM',
  records: 1200,
  processedRecords: 1200,
  status: 'Completed',
  duration: '5s',
  errorCount: 0,
  category: 'Data'
},
{
  id: '6',
  name: 'Bulk Email: Newsletter',
  type: 'email',
  initiatedBy: 'Admin',
  date: '03-Feb-2025',
  time: '08:00 AM',
  records: 850,
  processedRecords: 0,
  status: 'Queued',
  duration: '-',
  errorCount: 0,
  category: 'Communication'
},
{
  id: '7',
  name: 'Certificate Generation - Annual',
  type: 'certificate',
  initiatedBy: 'Principal',
  date: '01-Feb-2025',
  time: '12:00 PM',
  records: 200,
  processedRecords: 100,
  status: 'Cancelled',
  duration: '5m 20s',
  errorCount: 0,
  category: 'Documents'
}];


const scheduledOpsData: ScheduledOperation[] = [
{
  id: '1',
  name: 'Monthly Attendance Report Email',
  type: 'email',
  schedule: '01-Mar-2025 09:00 AM',
  recurrence: 'Monthly',
  status: 'Active',
  lastRun: '01-Feb-2025',
  nextRun: '01-Mar-2025',
  createdBy: 'Admin'
},
{
  id: '2',
  name: 'Fee Due SMS Notification',
  type: 'sms',
  schedule: '05-Mar-2025 10:00 AM',
  recurrence: 'One-time',
  status: 'Active',
  lastRun: '-',
  nextRun: '05-Mar-2025',
  createdBy: 'Accountant'
},
{
  id: '3',
  name: 'Weekly Progress Report',
  type: 'email',
  schedule: 'Every Monday 08:00 AM',
  recurrence: 'Weekly',
  status: 'Active',
  lastRun: '17-Feb-2025',
  nextRun: '24-Feb-2025',
  createdBy: 'Admin'
},
{
  id: '4',
  name: 'Daily Attendance Summary',
  type: 'export',
  schedule: 'Every Day 06:00 PM',
  recurrence: 'Daily',
  status: 'Paused',
  lastRun: '15-Feb-2025',
  nextRun: '-',
  createdBy: 'Principal'
}];


const operationTemplates: OperationTemplate[] = [
{ id: '1', name: 'Fee Reminder SMS', type: 'sms', usageCount: 45, lastUsed: '20-Feb-2025' },
{ id: '2', name: 'Attendance Report', type: 'email', usageCount: 30, lastUsed: '15-Feb-2025' },
{ id: '3', name: 'Student ID Card', type: 'idcard', usageCount: 12, lastUsed: '18-Feb-2025' },
{ id: '4', name: 'Bonafide Certificate', type: 'certificate', usageCount: 25, lastUsed: '10-Feb-2025' }];


// Progress Bar Component
const ProgressBar: React.FC<{progress: number;status: string;}> = ({ progress, status }) => {
  const getColor = () => {
    if (status === 'Failed') return 'bg-red-500';
    if (status === 'In Progress') return 'bg-blue-500';
    if (status === 'Completed') return 'bg-green-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
        style={{ width: `${progress}%` }} />

    </div>);

};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  bgColor: string;
}> = ({ title, value, icon, change, changeType, bgColor }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change &&
          <p
            className={`text-xs mt-1 ${
            changeType === 'positive' ?
            'text-green-600' :
            changeType === 'negative' ?
            'text-red-600' :
            'text-gray-500'}`
            }>

              {change}
            </p>
          }
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
      </div>
    </div>);

};

// Get Operation Icon
const getOperationIcon = (type: string, size: 'sm' | 'md' = 'sm') => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

  switch (type) {
    case 'sms':
      return <MessageSquareIcon className={`${sizeClass} text-blue-600`} />;
    case 'email':
      return <MailIcon className={`${sizeClass} text-indigo-600`} />;
    case 'certificate':
      return <FileTextIcon className={`${sizeClass} text-green-600`} />;
    case 'idcard':
      return <CreditCardIcon className={`${sizeClass} text-purple-600`} />;
    case 'export':
      return <DownloadIcon className={`${sizeClass} text-orange-600`} />;
    case 'fee':
      return <DollarSignIcon className={`${sizeClass} text-teal-600`} />;
    case 'attendance':
      return <CheckSquareIcon className={`${sizeClass} text-red-600`} />;
    case 'promotion':
      return <TrendingUpIcon className={`${sizeClass} text-amber-600`} />;
    case 'import':
      return <UploadIcon className={`${sizeClass} text-cyan-600`} />;
    default:
      return <LayersIcon className={`${sizeClass} text-gray-600`} />;
  }
};

// Get Operation Background Color
const getOperationBgColor = (type: string) => {
  switch (type) {
    case 'sms':
      return 'bg-blue-50';
    case 'email':
      return 'bg-indigo-50';
    case 'certificate':
      return 'bg-green-50';
    case 'idcard':
      return 'bg-purple-50';
    case 'export':
      return 'bg-orange-50';
    case 'fee':
      return 'bg-teal-50';
    case 'attendance':
      return 'bg-red-50';
    case 'promotion':
      return 'bg-amber-50';
    case 'import':
      return 'bg-cyan-50';
    default:
      return 'bg-gray-50';
  }
};

// Get Status Badge Variant
const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
  switch (status) {
    case 'Completed':
    case 'Active':
      return 'success';
    case 'In Progress':
    case 'Paused':
      return 'warning';
    case 'Failed':
      return 'danger';
    default:
      return 'default';
  }
};

// Main Component
export function BulkAdministrativeActionsHub() {
  // State
  const [activeTab, setActiveTab] = useState<'actions' | 'history' | 'scheduled' | 'templates'>('actions');
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveOperations, setLiveOperations] = useState<BulkOperation[]>(recentOpsData);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: string;operation: BulkOperation;} | null>(null);
  const [scheduledOperations, setScheduledOperations] = useState<ScheduledOperation[]>(scheduledOpsData);

  // Bulk Action Form State
  const [bulkActionForm, setBulkActionForm] = useState({
    targetGroup: 'all',
    selectedClasses: [] as string[],
    selectedSections: [] as string[],
    messageTemplate: '',
    subject: '',
    scheduleType: 'immediate',
    scheduleDate: '',
    scheduleTime: ''
  });

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    operationType: '',
    operationName: '',
    startDate: '',
    startTime: '',
    recurrence: 'One-time'
  });

  // Simulate live progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOperations((prev) =>
      prev.map((op) => {
        if (op.status === 'In Progress' && op.processedRecords < op.records) {
          const newProcessed = Math.min(
            op.processedRecords + Math.floor(Math.random() * 5) + 1,
            op.records
          );
          return {
            ...op,
            processedRecords: newProcessed,
            status: newProcessed === op.records ? 'Completed' : 'In Progress'
          };
        }
        return op;
      })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Quick Actions Configuration
  const quickActions = [
  {
    id: 'sms',
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Bulk SMS',
    desc: 'Send SMS notifications to students/parents',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    stats: { sent: 2450, pending: 120 }
  },
  {
    id: 'email',
    icon: <MailIcon className="w-6 h-6" />,
    title: 'Bulk Email',
    desc: 'Send email notifications with attachments',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    stats: { sent: 1890, pending: 45 }
  },
  {
    id: 'certificate',
    icon: <FileTextIcon className="w-6 h-6" />,
    title: 'Bulk Certificates',
    desc: 'Generate bonafide/leaving/character certificates',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    stats: { generated: 560, pending: 30 }
  },
  {
    id: 'idcard',
    icon: <CreditCardIcon className="w-6 h-6" />,
    title: 'Bulk ID Cards',
    desc: 'Generate and print student/staff ID cards',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    stats: { generated: 890, pending: 50 }
  },
  {
    id: 'export',
    icon: <DownloadIcon className="w-6 h-6" />,
    title: 'Bulk Data Export',
    desc: 'Export system data to Excel/CSV/PDF',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    stats: { exports: 125, lastExport: '2h ago' }
  },
  {
    id: 'fee',
    icon: <DollarSignIcon className="w-6 h-6" />,
    title: 'Bulk Fee Adjustment',
    desc: 'Apply discounts, fines, or adjustments',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    stats: { adjustments: 340, amount: '₹1.2L' }
  },
  {
    id: 'attendance',
    icon: <CheckSquareIcon className="w-6 h-6" />,
    title: 'Attendance Correction',
    desc: 'Update attendance records in bulk',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    stats: { corrections: 78, pending: 5 }
  },
  {
    id: 'promotion',
    icon: <TrendingUpIcon className="w-6 h-6" />,
    title: 'Bulk Promotion',
    desc: 'Promote students to next class',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    stats: { promoted: 1200, pending: 0 }
  },
  {
    id: 'import',
    icon: <UploadIcon className="w-6 h-6" />,
    title: 'Bulk Data Import',
    desc: 'Import data from Excel/CSV files',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    stats: { imports: 45, lastImport: '1d ago' }
  }];


  // Filter operations
  const filteredOperations = liveOperations.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || op.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || op.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Handle operation action
  const handleOperationAction = (type: string, operation: BulkOperation) => {
    setConfirmAction({ type, operation });
    setShowConfirmModal(true);
  };

  // Execute operation action
  const executeOperationAction = () => {
    if (!confirmAction) return;

    setLiveOperations((prev) =>
    prev.map((op) => {
      if (op.id === confirmAction.operation.id) {
        switch (confirmAction.type) {
          case 'cancel':
            return { ...op, status: 'Cancelled' as const };
          case 'retry':
            return { ...op, status: 'In Progress' as const, processedRecords: 0, errorCount: 0 };
          case 'pause':
            return { ...op, status: 'Queued' as const };
          default:
            return op;
        }
      }
      return op;
    })
    );
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Toggle scheduled operation status
  const toggleScheduledStatus = (id: string) => {
    setScheduledOperations((prev) =>
    prev.map((op) => {
      if (op.id === id) {
        return {
          ...op,
          status: op.status === 'Active' ? 'Paused' : 'Active',
          nextRun: op.status === 'Active' ? '-' : op.schedule
        };
      }
      return op;
    })
    );
  };

  // Delete scheduled operation
  const deleteScheduledOperation = (id: string) => {
    setScheduledOperations((prev) => prev.filter((op) => op.id !== id));
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Loader2Icon className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'Queued':
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
      case 'Cancelled':
        return <XCircleIcon className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  // Statistics
  const stats = {
    totalOperations: liveOperations.length,
    completed: liveOperations.filter((op) => op.status === 'Completed').length,
    inProgress: liveOperations.filter((op) => op.status === 'In Progress').length,
    failed: liveOperations.filter((op) => op.status === 'Failed').length,
    totalRecords: liveOperations.reduce((sum, op) => sum + op.records, 0),
    scheduledOps: scheduledOperations.filter((op) => op.status === 'Active').length
  };

  // Reset bulk action form
  const resetBulkActionForm = () => {
    setBulkActionForm({
      targetGroup: 'all',
      selectedClasses: [],
      selectedSections: [],
      messageTemplate: '',
      subject: '',
      scheduleType: 'immediate',
      scheduleDate: '',
      scheduleTime: ''
    });
    setSelectedActionType(null);
  };

  // Columns for recent operations table
  const recentColumns: TableColumn<BulkOperation>[] = [
  {
    key: 'name',
    header: 'Operation',
    render: (row: BulkOperation) =>
    <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getOperationBgColor(row.type)}`}>
            {getOperationIcon(row.type)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.category}</p>
          </div>
        </div>

  },
  {
    key: 'initiatedBy',
    header: 'Initiated By',
    render: (row: BulkOperation) =>
    <div>
          <p className="text-sm text-gray-900">{row.initiatedBy}</p>
          <p className="text-xs text-gray-500">
            {row.date} {row.time}
          </p>
        </div>

  },
  {
    key: 'progress',
    header: 'Progress',
    render: (row: BulkOperation) => {
      const progress = row.processedRecords / row.records * 100;
      return (
        <div className="w-32">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                {row.processedRecords}/{row.records}
              </span>
              <span className="text-xs font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} status={row.status} />
          </div>);

    }
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: BulkOperation) =>
    <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
        </div>

  },
  {
    key: 'duration',
    header: 'Duration',
    render: (row: BulkOperation) =>
    <span className="text-sm text-gray-600">{row.duration}</span>

  },
  {
    key: 'errors',
    header: 'Errors',
    render: (row: BulkOperation) =>
    <span className={`text-sm ${row.errorCount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          {row.errorCount > 0 ? row.errorCount : '-'}
        </span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: BulkOperation) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => {
          setSelectedOperation(row);
          setShowOperationModal(true);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">

            <EyeIcon className="w-4 h-4 text-gray-600" />
          </button>
          {row.status === 'In Progress' &&
      <button
        onClick={() => handleOperationAction('cancel', row)}
        className="p-1.5 rounded-lg hover:bg-orange-50 transition-colors">

              <PauseIcon className="w-4 h-4 text-orange-500" />
            </button>
      }
          {row.status === 'Failed' &&
      <button
        onClick={() => handleOperationAction('retry', row)}
        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">

              <RefreshCwIcon className="w-4 h-4 text-blue-500" />
            </button>
      }
          {(row.status === 'Completed' || row.status === 'Failed') &&
      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <DownloadIcon className="w-4 h-4 text-gray-500" />
            </button>
      }
        </div>

  }];


  // Columns for scheduled operations table
  const scheduledColumns: TableColumn<ScheduledOperation>[] = [
  {
    key: 'name',
    header: 'Operation',
    render: (row: ScheduledOperation) =>
    <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getOperationBgColor(row.type)}`}>
            {getOperationIcon(row.type)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">Created by {row.createdBy}</p>
          </div>
        </div>

  },
  {
    key: 'schedule',
    header: 'Schedule',
    render: (row: ScheduledOperation) =>
    <div>
          <p className="text-sm text-gray-900">{row.schedule}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {row.recurrence}
          </span>
        </div>

  },
  {
    key: 'lastRun',
    header: 'Last Run',
    render: (row: ScheduledOperation) =>
    <span className="text-sm text-gray-600">{row.lastRun}</span>

  },
  {
    key: 'nextRun',
    header: 'Next Run',
    render: (row: ScheduledOperation) =>
    <span className="text-sm text-gray-900 font-medium">{row.nextRun}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ScheduledOperation) =>
    <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ScheduledOperation) =>
    <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <EditIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
        onClick={() => toggleScheduledStatus(row.id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">

            {row.status === 'Active' ?
        <PauseIcon className="w-4 h-4 text-orange-500" /> :

        <PlayIcon className="w-4 h-4 text-green-500" />
        }
          </button>
          <button
        onClick={() => deleteScheduledOperation(row.id)}
        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">

            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>

  }];


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayersIcon className="w-7 h-7 text-blue-600" />
            Bulk Administrative Actions Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Central hub for executing, monitoring, and scheduling bulk operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="primary" onClick={() => setShowNewActionModal(true)}>
            <ZapIcon className="w-4 h-4 mr-2" />
            New Bulk Action
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Operations"
          value={stats.totalOperations}
          icon={<LayersIcon className="w-5 h-5 text-blue-600" />}
          bgColor="bg-blue-50"
          change="Today"
          changeType="neutral" />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
          bgColor="bg-green-50"
          change="+12% this week"
          changeType="positive" />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Loader2Icon className="w-5 h-5 text-orange-600" />}
          bgColor="bg-orange-50"
          change="Active now"
          changeType="neutral" />

        <StatCard
          title="Failed"
          value={stats.failed}
          icon={<XCircleIcon className="w-5 h-5 text-red-600" />}
          bgColor="bg-red-50"
          change="-5% this week"
          changeType="positive" />

        <StatCard
          title="Records Processed"
          value={stats.totalRecords.toLocaleString()}
          icon={<UsersIcon className="w-5 h-5 text-purple-600" />}
          bgColor="bg-purple-50"
          change="This month"
          changeType="neutral" />

        <StatCard
          title="Scheduled"
          value={stats.scheduledOps}
          icon={<ClockIcon className="w-5 h-5 text-teal-600" />}
          bgColor="bg-teal-50"
          change="Active schedules"
          changeType="neutral" />

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm w-fit">
        {[
        { id: 'actions' as const, label: 'Quick Actions', icon: <ZapIcon className="w-4 h-4" /> },
        { id: 'history' as const, label: 'Operation History', icon: <HistoryIcon className="w-4 h-4" /> },
        { id: 'scheduled' as const, label: 'Scheduled', icon: <CalendarIcon className="w-4 h-4" /> },
        { id: 'templates' as const, label: 'Templates', icon: <CopyIcon className="w-4 h-4" /> }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === tab.id ?
          'bg-blue-600 text-white' :
          'text-gray-600 hover:bg-gray-100'}`
          }>

            {tab.icon}
            {tab.label}
          </button>
        )}
      </div>

      {/* Quick Actions Tab */}
      {activeTab === 'actions' &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) =>
        <div
          key={action.id}
          onClick={() => {
            setSelectedActionType(action.id);
            setShowNewActionModal(true);
          }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-500">

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform`}>
                  <div className={action.color}>{action.icon}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    {Object.entries(action.stats).map(([key, value]) =>
                <div key={key} className="text-xs">
                        <span className="text-gray-500 capitalize">{key}: </span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                )}
                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      }

      {/* Operation History Tab */}
      {activeTab === 'history' &&
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search operations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

                </div>
                <div className="relative">
                  <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">

                    <FilterIcon className="w-4 h-4" />
                    Filters
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  {showFilterDropdown &&
                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 w-64">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                            <option value="all">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Failed">Failed</option>
                            <option value="Queued">Queued</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                            <option value="all">All Categories</option>
                            <option value="Communication">Communication</option>
                            <option value="Documents">Documents</option>
                            <option value="Finance">Finance</option>
                            <option value="Attendance">Attendance</option>
                            <option value="Data">Data</option>
                          </select>
                        </div>
                        <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterCategory('all');
                        setShowFilterDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">

                          Clear Filters
                        </button>
                      </div>
                    </div>
                }
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Showing {filteredOperations.length} of {liveOperations.length} operations
                </span>
              </div>
            </div>
          </div>
          <Table columns={recentColumns} data={filteredOperations} />
        </div>
      }

      {/* Scheduled Operations Tab */}
      {activeTab === 'scheduled' &&
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Scheduled Operations</h2>
            <Button variant="primary" onClick={() => setShowScheduleModal(true)}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <Table columns={scheduledColumns} data={scheduledOperations} />
          </div>
        </div>
      }

      {/* Templates Tab */}
      {activeTab === 'templates' &&
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Operation Templates</h2>
            <Button variant="primary">
              <CopyIcon className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {operationTemplates.map((template) =>
          <div
            key={template.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">

                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getOperationBgColor(template.type)}`}>
                    {template.type === 'sms' && <MessageSquareIcon className="w-5 h-5 text-blue-600" />}
                    {template.type === 'email' && <MailIcon className="w-5 h-5 text-indigo-600" />}
                    {template.type === 'idcard' && <CreditCardIcon className="w-5 h-5 text-purple-600" />}
                    {template.type === 'certificate' && <AwardIcon className="w-5 h-5 text-green-600" />}
                  </div>
                  <button className="p-1 rounded-lg hover:bg-gray-100">
                    <MoreVerticalIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Used {template.usageCount} times</span>
                  <span>Last: {template.lastUsed}</span>
                </div>
                <button className="w-full mt-3 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  Use Template
                </button>
              </div>
          )}
          </div>
        </div>
      }

      {/* Operation Details Modal */}
      <Modal
        isOpen={showOperationModal}
        onClose={() => setShowOperationModal(false)}
        title="Operation Details"
        size="lg">

        {selectedOperation &&
        <div className="space-y-6">
            {/* Operation Header */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getOperationBgColor(selectedOperation.type)}`}>
                  {getOperationIcon(selectedOperation.type, 'md')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedOperation.name}</h3>
                  <p className="text-sm text-gray-500">{selectedOperation.category}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(selectedOperation.status)}>
                {selectedOperation.status}
              </Badge>
            </div>

            {/* Progress Section */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">
                  {selectedOperation.processedRecords} / {selectedOperation.records} records
                </span>
              </div>
              <ProgressBar
              progress={selectedOperation.processedRecords / selectedOperation.records * 100}
              status={selectedOperation.status} />

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedOperation.processedRecords}
                  </p>
                  <p className="text-xs text-green-700">Processed</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedOperation.records - selectedOperation.processedRecords}
                  </p>
                  <p className="text-xs text-blue-700">Remaining</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{selectedOperation.errorCount}</p>
                  <p className="text-xs text-red-700">Errors</p>
                </div>
              </div>
            </div>

            {/* Operation Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Initiated By</p>
                <p className="font-medium text-gray-900">{selectedOperation.initiatedBy}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {selectedOperation.date} {selectedOperation.time}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{selectedOperation.duration}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Operation ID</p>
                <p className="font-medium text-gray-900">#{selectedOperation.id}</p>
              </div>
            </div>

            {/* Error Log (if any) */}
            {selectedOperation.errorCount > 0 &&
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Error Log</h4>
                </div>
                <div className="space-y-2 text-sm text-red-700">
                  <p>• Record #123: Invalid phone number format</p>
                  <p>• Record #456: Email delivery failed</p>
                </div>
                <button className="flex items-center gap-2 mt-3 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-100">
                  <DownloadIcon className="w-4 h-4" />
                  Download Full Log
                </button>
              </div>
          }

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              {selectedOperation.status === 'In Progress' &&
            <Button variant="outline">
                  <PauseIcon className="w-4 h-4 mr-2" />
                  Pause
                </Button>
            }
              {selectedOperation.status === 'Failed' &&
            <Button variant="outline">
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Retry
                </Button>
            }
              {selectedOperation.status === 'Completed' &&
            <Button variant="outline">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
            }
              <Button variant="primary" onClick={() => setShowOperationModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* New Bulk Action Modal */}
      <Modal
        isOpen={showNewActionModal}
        onClose={() => {
          setShowNewActionModal(false);
          resetBulkActionForm();
        }}
        title="Create New Bulk Action"
        size="xl">

        <div className="space-y-6">
          {/* Action Type Selection */}
          {!selectedActionType ?
          <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) =>
            <div
              key={action.id}
              onClick={() => setSelectedActionType(action.id)}
              className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50">

                  <div className={`p-2 rounded-lg ${action.bgColor} w-fit mb-2`}>
                    <div className={action.color}>{action.icon}</div>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                </div>
            )}
            </div> :

          <>
              {/* Selected Action Header */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {quickActions.find((a) => a.id === selectedActionType)?.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {quickActions.find((a) => a.id === selectedActionType)?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {quickActions.find((a) => a.id === selectedActionType)?.desc}
                  </p>
                </div>
                <button
                onClick={() => setSelectedActionType(null)}
                className="ml-auto px-3 py-1 text-sm font-medium text-gray-600 hover:bg-blue-100 rounded-lg">

                  Change
                </button>
              </div>

              {/* Target Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['All Students', 'By Class', 'By Section', 'Custom Selection'].map((option) =>
                <button
                  key={option}
                  onClick={() => setBulkActionForm({ ...bulkActionForm, targetGroup: option })}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  bulkActionForm.targetGroup === option ?
                  'border-blue-500 bg-blue-50 text-blue-700' :
                  'border-gray-200 text-gray-600 hover:border-gray-300'}`
                  }>

                      {option}
                    </button>
                )}
                </div>
              </div>

              {/* Class Selection (if By Class selected) */}
              {bulkActionForm.targetGroup === 'By Class' &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Classes
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                'Class 1',
                'Class 2',
                'Class 3',
                'Class 4',
                'Class 5',
                'Class 6',
                'Class 7',
                'Class 8',
                'Class 9',
                'Class 10',
                'Class 11',
                'Class 12'].
                map((cls) =>
                <button
                  key={cls}
                  onClick={() => {
                    const classes = bulkActionForm.selectedClasses.includes(cls) ?
                    bulkActionForm.selectedClasses.filter((c) => c !== cls) :
                    [...bulkActionForm.selectedClasses, cls];
                    setBulkActionForm({ ...bulkActionForm, selectedClasses: classes });
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                  bulkActionForm.selectedClasses.includes(cls) ?
                  'border-blue-500 bg-blue-50 text-blue-700' :
                  'border-gray-200 text-gray-600 hover:border-gray-300'}`
                  }>

                        {cls}
                      </button>
                )}
                  </div>
                </div>
            }

              {/* SMS/Email Content */}
              {(selectedActionType === 'sms' || selectedActionType === 'email') &&
            <>
                  {selectedActionType === 'email' &&
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                  type="text"
                  value={bulkActionForm.subject}
                  onChange={(e) =>
                  setBulkActionForm({ ...bulkActionForm, subject: e.target.value })
                  }
                  placeholder="Enter email subject..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </div>
              }
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template
                    </label>
                    <textarea
                  value={bulkActionForm.messageTemplate}
                  onChange={(e) =>
                  setBulkActionForm({ ...bulkActionForm, messageTemplate: e.target.value })
                  }
                  placeholder="Enter your message here... Use {student_name}, {parent_name}, {class}, {amount} for dynamic fields"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Quick Insert:</span>
                      {['{student_name}', '{parent_name}', '{class}', '{amount}'].map((field) =>
                  <button
                    key={field}
                    onClick={() =>
                    setBulkActionForm({
                      ...bulkActionForm,
                      messageTemplate: bulkActionForm.messageTemplate + ' ' + field
                    })
                    }
                    className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200">

                          {field}
                        </button>
                  )}
                    </div>
                  </div>
                </>
            }

              {/* Schedule Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Execution Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                  onClick={() =>
                  setBulkActionForm({ ...bulkActionForm, scheduleType: 'immediate' })
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  bulkActionForm.scheduleType === 'immediate' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-200 hover:border-gray-300'}`
                  }>

                    <div className="flex items-center gap-2 mb-1">
                      <ZapIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Execute Now</span>
                    </div>
                    <p className="text-xs text-gray-500">Start the operation immediately</p>
                  </button>
                  <button
                  onClick={() =>
                  setBulkActionForm({ ...bulkActionForm, scheduleType: 'scheduled' })
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  bulkActionForm.scheduleType === 'scheduled' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-200 hover:border-gray-300'}`
                  }>

                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Schedule Later</span>
                    </div>
                    <p className="text-xs text-gray-500">Set a specific date and time</p>
                  </button>
                </div>
                {bulkActionForm.scheduleType === 'scheduled' &&
              <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Date</label>
                      <input
                    type="date"
                    value={bulkActionForm.scheduleDate}
                    onChange={(e) =>
                    setBulkActionForm({ ...bulkActionForm, scheduleDate: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Time</label>
                      <input
                    type="time"
                    value={bulkActionForm.scheduleTime}
                    onChange={(e) =>
                    setBulkActionForm({ ...bulkActionForm, scheduleTime: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </div>
                  </div>
              }
              </div>

              {/* Summary */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <InfoIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Operation Summary</p>
                    <p className="text-sm text-amber-700 mt-1">
                      This action will affect approximately <strong>450 students</strong> based on
                      your selection.
                      {selectedActionType === 'sms' && ' SMS charges will apply.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          }

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewActionModal(false);
                resetBulkActionForm();
              }}>

              Cancel
            </Button>
            {selectedActionType &&
            <>
                <Button variant="outline">
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="primary">
                  {bulkActionForm.scheduleType === 'immediate' ?
                <>
                      <SendIcon className="w-4 h-4 mr-2" />
                      Execute Now
                    </> :

                <>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Operation
                    </>
                }
                </Button>
              </>
            }
          </div>
        </div>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
        }}
        title="Confirm Action"
        size="sm">

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
            <AlertTriangleIcon className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">
                {confirmAction?.type === 'cancel' && 'Cancel Operation'}
                {confirmAction?.type === 'retry' && 'Retry Operation'}
                {confirmAction?.type === 'pause' && 'Pause Operation'}
              </p>
              <p className="text-sm text-amber-700">
                {confirmAction?.type === 'cancel' &&
                'This will stop the operation and cannot be undone.'}
                {confirmAction?.type === 'retry' &&
                'This will restart the operation from the beginning.'}
                {confirmAction?.type === 'pause' &&
                'This will pause the operation. You can resume it later.'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmAction(null);
              }}>

              Cancel
            </Button>
            <button
              onClick={executeOperationAction}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
              confirmAction?.type === 'cancel' ?
              'bg-red-600 hover:bg-red-700' :
              'bg-blue-600 hover:bg-blue-700'}`
              }>

              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule New Operation"
        size="lg">

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
            <select
              value={scheduleForm.operationType}
              onChange={(e) => setScheduleForm({ ...scheduleForm, operationType: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select operation type...</option>
              <option value="sms">Bulk SMS</option>
              <option value="email">Bulk Email</option>
              <option value="export">Data Export</option>
              <option value="report">Report Generation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation Name</label>
            <input
              type="text"
              value={scheduleForm.operationName}
              onChange={(e) => setScheduleForm({ ...scheduleForm, operationName: e.target.value })}
              placeholder="Enter a name for this scheduled operation"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={scheduleForm.startDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, startDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
            <div className="grid grid-cols-4 gap-2">
              {['One-time', 'Daily', 'Weekly', 'Monthly'].map((option) =>
              <button
                key={option}
                onClick={() => setScheduleForm({ ...scheduleForm, recurrence: option })}
                className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                scheduleForm.recurrence === option ?
                'border-blue-500 bg-blue-50 text-blue-700' :
                'border-gray-200 text-gray-600 hover:border-gray-300'}`
                }>

                  {option}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}