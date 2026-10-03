import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  Home,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Lock,
  Send,
  Pause,
  Play,
  CalendarPlus,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Copy,
  Download,
  Upload,
  Settings,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Info,
  Unlock,
  Archive,
  BarChart3,
  FileText,
  Mail,
  Bell,
  History,
  UserPlus,
  UserMinus,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Save,
  Printer,
  Target,
  Award,
  TrendingUp,
  MessageSquare } from
'lucide-react';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type CycleStatus = 'Planning' | 'Active' | 'Paused' | 'Locked' | 'Published' | 'Completed' | 'Cancelled';

type PhaseStatus = 'Pending' | 'In Progress' | 'Completed' | 'Skipped';

type AppraisalPhase = {
  id: string;
  name: string;
  status: PhaseStatus;
  startDate: string | null;
  endDate: string | null;
  completedCount: number;
  totalCount: number;
};

type CycleHistory = {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
};

type AppraisalCycle = {
  id: string;
  name: string;
  description: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  currentPhase: number;
  phases: AppraisalPhase[];
  totalEmployees: number;
  completedEmployees: number;
  status: CycleStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  templateId: string | null;
  notificationsEnabled: boolean;
  autoProgressEnabled: boolean;
  history: CycleHistory[];
  excludedEmployees: string[];
  reviewersAssigned: number;
  calibrationMeetingDate: string | null;
  publishedDate: string | null;
};

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type ModalType =
'none' |
'create' |
'edit' |
'view' |
'delete' |
'extend' |
'publish' |
'start' |
'pause' |
'resume' |
'lock' |
'unlock' |
'cancel' |
'clone' |
'addEmployees' |
'removeEmployees' |
'sendReminder' |
'advancePhase' |
'revertPhase' |
'history' |
'settings' |
'export';

type ActionMenuType = string | null;

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const ACADEMIC_YEARS = ['2024-25', '2023-24', '2022-23', '2021-22'];

const DEFAULT_PHASES: Omit<AppraisalPhase, 'id'>[] = [
{ name: 'Planning', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 0 },
{ name: 'Self Review', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 0 },
{ name: 'Manager Review', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 0 },
{ name: 'Calibration', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 0 },
{ name: 'Published', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 0 }];


const CYCLE_TEMPLATES = [
{ id: 'annual', name: 'Annual Performance Review', phases: 5 },
{ id: 'midterm', name: 'Mid-Term Review', phases: 4 },
{ id: 'probation', name: 'Probation Review', phases: 3 },
{ id: 'quarterly', name: 'Quarterly Check-in', phases: 3 },
{ id: 'custom', name: 'Custom Cycle', phases: 0 }];


/* -------------------------------------------------------------------------- */
/* Initial Data                                                                */
/* -------------------------------------------------------------------------- */

const generateInitialCycles = (): AppraisalCycle[] => [
{
  id: 'CYC001',
  name: 'Annual Performance Review 2024-25',
  description: 'Comprehensive annual performance evaluation for all employees',
  academicYear: '2024-25',
  startDate: '2024-01-15',
  endDate: '2024-03-31',
  currentPhase: 2,
  phases: [
  { id: 'P1', name: 'Planning', status: 'Completed', startDate: '2024-01-15', endDate: '2024-01-25', completedCount: 245, totalCount: 245 },
  { id: 'P2', name: 'Self Review', status: 'Completed', startDate: '2024-01-26', endDate: '2024-02-15', completedCount: 245, totalCount: 245 },
  { id: 'P3', name: 'Manager Review', status: 'In Progress', startDate: '2024-02-16', endDate: '2024-03-10', completedCount: 189, totalCount: 245 },
  { id: 'P4', name: 'Calibration', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 },
  { id: 'P5', name: 'Published', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 }],

  totalEmployees: 245,
  completedEmployees: 189,
  status: 'Active',
  createdBy: 'HR Admin',
  createdAt: '2024-01-10T10:00:00',
  updatedAt: '2024-02-20T14:30:00',
  templateId: 'annual',
  notificationsEnabled: true,
  autoProgressEnabled: false,
  history: [
  { id: 'H1', action: 'Created', performedBy: 'HR Admin', timestamp: '2024-01-10T10:00:00', details: 'Cycle created from Annual template' },
  { id: 'H2', action: 'Started', performedBy: 'HR Admin', timestamp: '2024-01-15T09:00:00', details: 'Cycle started, Planning phase initiated' },
  { id: 'H3', action: 'Phase Advanced', performedBy: 'System', timestamp: '2024-01-26T00:00:00', details: 'Advanced to Self Review phase' },
  { id: 'H4', action: 'Phase Advanced', performedBy: 'HR Admin', timestamp: '2024-02-16T09:00:00', details: 'Advanced to Manager Review phase' }],

  excludedEmployees: ['EMP050', 'EMP051'],
  reviewersAssigned: 45,
  calibrationMeetingDate: '2024-03-15',
  publishedDate: null
},
{
  id: 'CYC002',
  name: 'Mid-Term Review Q2 2024',
  description: 'Quarterly performance check-in for Q2',
  academicYear: '2024-25',
  startDate: '2024-04-01',
  endDate: '2024-04-30',
  currentPhase: 0,
  phases: [
  { id: 'P1', name: 'Planning', status: 'In Progress', startDate: '2024-04-01', endDate: '2024-04-05', completedCount: 0, totalCount: 245 },
  { id: 'P2', name: 'Self Review', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 },
  { id: 'P3', name: 'Manager Review', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 },
  { id: 'P4', name: 'Calibration', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 },
  { id: 'P5', name: 'Published', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 245 }],

  totalEmployees: 245,
  completedEmployees: 0,
  status: 'Planning',
  createdBy: 'HR Admin',
  createdAt: '2024-03-20T11:00:00',
  updatedAt: '2024-03-20T11:00:00',
  templateId: 'midterm',
  notificationsEnabled: true,
  autoProgressEnabled: true,
  history: [
  { id: 'H1', action: 'Created', performedBy: 'HR Admin', timestamp: '2024-03-20T11:00:00', details: 'Cycle created from Mid-Term template' }],

  excludedEmployees: [],
  reviewersAssigned: 0,
  calibrationMeetingDate: null,
  publishedDate: null
},
{
  id: 'CYC003',
  name: 'Probation Review - Batch 3',
  description: 'Probation evaluation for new joiners - Batch 3',
  academicYear: '2024-25',
  startDate: '2024-02-01',
  endDate: '2024-02-28',
  currentPhase: 3,
  phases: [
  { id: 'P1', name: 'Planning', status: 'Completed', startDate: '2024-02-01', endDate: '2024-02-03', completedCount: 18, totalCount: 18 },
  { id: 'P2', name: 'Self Review', status: 'Completed', startDate: '2024-02-04', endDate: '2024-02-10', completedCount: 18, totalCount: 18 },
  { id: 'P3', name: 'Manager Review', status: 'Completed', startDate: '2024-02-11', endDate: '2024-02-20', completedCount: 18, totalCount: 18 },
  { id: 'P4', name: 'Calibration', status: 'In Progress', startDate: '2024-02-21', endDate: '2024-02-25', completedCount: 15, totalCount: 18 },
  { id: 'P5', name: 'Published', status: 'Pending', startDate: null, endDate: null, completedCount: 0, totalCount: 18 }],

  totalEmployees: 18,
  completedEmployees: 15,
  status: 'Locked',
  createdBy: 'HR Manager',
  createdAt: '2024-01-25T14:00:00',
  updatedAt: '2024-02-22T16:00:00',
  templateId: 'probation',
  notificationsEnabled: true,
  autoProgressEnabled: false,
  history: [
  { id: 'H1', action: 'Created', performedBy: 'HR Manager', timestamp: '2024-01-25T14:00:00', details: 'Cycle created for Batch 3 probationers' },
  { id: 'H2', action: 'Started', performedBy: 'HR Manager', timestamp: '2024-02-01T09:00:00', details: 'Cycle started' },
  { id: 'H3', action: 'Locked', performedBy: 'HR Admin', timestamp: '2024-02-22T16:00:00', details: 'Cycle locked for final review' }],

  excludedEmployees: [],
  reviewersAssigned: 8,
  calibrationMeetingDate: '2024-02-23',
  publishedDate: null
},
{
  id: 'CYC004',
  name: 'Annual Performance Review 2023-24',
  description: 'Previous year annual performance evaluation',
  academicYear: '2023-24',
  startDate: '2023-01-15',
  endDate: '2023-03-31',
  currentPhase: 4,
  phases: [
  { id: 'P1', name: 'Planning', status: 'Completed', startDate: '2023-01-15', endDate: '2023-01-25', completedCount: 232, totalCount: 232 },
  { id: 'P2', name: 'Self Review', status: 'Completed', startDate: '2023-01-26', endDate: '2023-02-15', completedCount: 232, totalCount: 232 },
  { id: 'P3', name: 'Manager Review', status: 'Completed', startDate: '2023-02-16', endDate: '2023-03-10', completedCount: 232, totalCount: 232 },
  { id: 'P4', name: 'Calibration', status: 'Completed', startDate: '2023-03-11', endDate: '2023-03-20', completedCount: 232, totalCount: 232 },
  { id: 'P5', name: 'Published', status: 'Completed', startDate: '2023-03-21', endDate: '2023-03-31', completedCount: 232, totalCount: 232 }],

  totalEmployees: 232,
  completedEmployees: 232,
  status: 'Published',
  createdBy: 'HR Admin',
  createdAt: '2023-01-05T10:00:00',
  updatedAt: '2023-03-31T17:00:00',
  templateId: 'annual',
  notificationsEnabled: false,
  autoProgressEnabled: false,
  history: [
  { id: 'H1', action: 'Created', performedBy: 'HR Admin', timestamp: '2023-01-05T10:00:00', details: 'Cycle created' },
  { id: 'H2', action: 'Published', performedBy: 'HR Director', timestamp: '2023-03-31T17:00:00', details: 'Results published to all employees' }],

  excludedEmployees: [],
  reviewersAssigned: 42,
  calibrationMeetingDate: '2023-03-15',
  publishedDate: '2023-03-31'
},
{
  id: 'CYC005',
  name: 'Mid-Term Review Q4 2023',
  description: 'Quarterly performance check-in for Q4 2023',
  academicYear: '2023-24',
  startDate: '2023-10-01',
  endDate: '2023-10-31',
  currentPhase: 4,
  phases: [
  { id: 'P1', name: 'Planning', status: 'Completed', startDate: '2023-10-01', endDate: '2023-10-03', completedCount: 230, totalCount: 230 },
  { id: 'P2', name: 'Self Review', status: 'Completed', startDate: '2023-10-04', endDate: '2023-10-15', completedCount: 230, totalCount: 230 },
  { id: 'P3', name: 'Manager Review', status: 'Completed', startDate: '2023-10-16', endDate: '2023-10-25', completedCount: 230, totalCount: 230 },
  { id: 'P4', name: 'Calibration', status: 'Completed', startDate: '2023-10-26', endDate: '2023-10-28', completedCount: 230, totalCount: 230 },
  { id: 'P5', name: 'Published', status: 'Completed', startDate: '2023-10-29', endDate: '2023-10-31', completedCount: 230, totalCount: 230 }],

  totalEmployees: 230,
  completedEmployees: 230,
  status: 'Completed',
  createdBy: 'HR Admin',
  createdAt: '2023-09-25T11:00:00',
  updatedAt: '2023-10-31T18:00:00',
  templateId: 'midterm',
  notificationsEnabled: false,
  autoProgressEnabled: true,
  history: [
  { id: 'H1', action: 'Created', performedBy: 'HR Admin', timestamp: '2023-09-25T11:00:00', details: 'Cycle created' },
  { id: 'H2', action: 'Completed', performedBy: 'System', timestamp: '2023-10-31T18:00:00', details: 'All phases completed, cycle marked as finished' }],

  excludedEmployees: [],
  reviewersAssigned: 40,
  calibrationMeetingDate: '2023-10-27',
  publishedDate: '2023-10-31'
}];


/* -------------------------------------------------------------------------- */
/* Utility Functions                                                           */
/* -------------------------------------------------------------------------- */

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

const generateCycleId = (): string => {
  return `CYC${String(Date.now()).slice(-6)}`;
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
        return <CheckCircle2 className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
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
            <X className="h-4 w-4" />
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
  size = 'md',
  footer








}: {isOpen: boolean;onClose: () => void;title: string;subtitle?: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';footer?: React.ReactNode;}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer &&
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              {footer}
            </div>
          }
        </div>
      </div>
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

  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />,
    success: <CheckCircle className="w-6 h-6 text-green-600" />
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{iconMap[variant]}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <div className="text-sm text-gray-600">{message}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 ${variantStyles[variant]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>

            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
  cycle,
  isOpen,
  onToggle,
  onClose,
  onAction






}: {cycle: AppraisalCycle;isOpen: boolean;onToggle: () => void;onClose: () => void;onAction: (action: ModalType) => void;}) {
  if (!isOpen) {
    return (
      <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
        <MoreHorizontal className="w-4 h-4" />
      </button>);

  }

  return (
    <div className="relative">
      <button onClick={onToggle} className="p-2 bg-gray-100 rounded-lg">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
        <button
          onClick={() => onAction('view')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button
          onClick={() => onAction('history')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

          <History className="w-4 h-4" />
          View History
        </button>
        
        {(cycle.status === 'Planning' || cycle.status === 'Active') &&
        <>
            <hr className="my-1" />
            <button
            onClick={() => onAction('edit')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

              <Edit className="w-4 h-4" />
              Edit Cycle
            </button>
            <button
            onClick={() => onAction('settings')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

              <Settings className="w-4 h-4" />
              Settings
            </button>
          </>
        }

        {cycle.status === 'Active' &&
        <>
            <hr className="my-1" />
            <button
            onClick={() => onAction('advancePhase')}
            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2">

              <ArrowRight className="w-4 h-4" />
              Advance Phase
            </button>
            {cycle.currentPhase > 0 &&
          <button
            onClick={() => onAction('revertPhase')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                <ArrowLeft className="w-4 h-4" />
                Revert Phase
              </button>
          }
            <button
            onClick={() => onAction('sendReminder')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

              <Bell className="w-4 h-4" />
              Send Reminder
            </button>
            <button
            onClick={() => onAction('addEmployees')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

              <UserPlus className="w-4 h-4" />
              Add Employees
            </button>
            <button
            onClick={() => onAction('removeEmployees')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

              <UserMinus className="w-4 h-4" />
              Remove Employees
            </button>
          </>
        }

        <hr className="my-1" />
        <button
          onClick={() => onAction('clone')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

          <Copy className="w-4 h-4" />
          Clone Cycle
        </button>
        <button
          onClick={() => onAction('export')}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

          <Download className="w-4 h-4" />
          Export Data
        </button>

        {(cycle.status === 'Planning' || cycle.status === 'Active' || cycle.status === 'Paused') &&
        <>
            <hr className="my-1" />
            <button
            onClick={() => onAction('cancel')}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">

              <XCircle className="w-4 h-4" />
              Cancel Cycle
            </button>
          </>
        }

        {cycle.status === 'Planning' &&
        <button
          onClick={() => onAction('delete')}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">

            <Trash2 className="w-4 h-4" />
            Delete Cycle
          </button>
        }
      </div>
    </div>);

}

/* -------------------------------------------------------------------------- */
/* Create/Edit Cycle Form                                                      */
/* -------------------------------------------------------------------------- */

function CycleForm({
  cycle,
  onSubmit,
  onCancel,
  isEdit = false





}: {cycle?: AppraisalCycle;onSubmit: (data: Partial<AppraisalCycle>) => void;onCancel: () => void;isEdit?: boolean;}) {
  const [formData, setFormData] = useState({
    name: cycle?.name || '',
    description: cycle?.description || '',
    academicYear: cycle?.academicYear || ACADEMIC_YEARS[0],
    startDate: cycle?.startDate || '',
    endDate: cycle?.endDate || '',
    templateId: cycle?.templateId || 'annual',
    notificationsEnabled: cycle?.notificationsEnabled ?? true,
    autoProgressEnabled: cycle?.autoProgressEnabled ?? false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Cycle name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Cycle Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Annual Performance Review 2024-25"
            error={errors.name} />

        </div>

        <div className="col-span-2">
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this appraisal cycle"
            rows={3} />

        </div>

        <div>
          <Select
            label="Academic Year"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            options={ACADEMIC_YEARS.map((year) => ({ value: year, label: year }))} />

        </div>

        <div>
          <Select
            label="Cycle Template"
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
            options={CYCLE_TEMPLATES.map((t) => ({ value: t.id, label: t.name }))}
            disabled={isEdit} />

        </div>

        <div>
          <Input
            label="Start Date *"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate} />

        </div>

        <div>
          <Input
            label="End Date *"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate} />

        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Settings</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notificationsEnabled}
              onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
              className="rounded border-gray-300" />

            <div>
              <p className="text-sm font-medium text-gray-700">Enable Notifications</p>
              <p className="text-xs text-gray-500">Send email notifications for phase changes and reminders</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoProgressEnabled}
              onChange={(e) => setFormData({ ...formData, autoProgressEnabled: e.target.checked })}
              className="rounded border-gray-300" />

            <div>
              <p className="text-sm font-medium text-gray-700">Auto-Progress Phases</p>
              <p className="text-xs text-gray-500">Automatically advance phases when all submissions are complete</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Update Cycle' : 'Create Cycle'}
        </Button>
      </div>
    </form>);

}

/* -------------------------------------------------------------------------- */
/* Main Component                                                              */
/* -------------------------------------------------------------------------- */

export function AppraisalCycleStatusView() {
  // Data state
  const [cycles, setCycles] = useState<AppraisalCycle[]>(generateInitialCycles);

  // Filter state
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedCycle, setSelectedCycle] = useState<AppraisalCycle | null>(null);
  const [actionMenuId, setActionMenuId] = useState<ActionMenuType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());

  // Form state for extend
  const [extendDate, setExtendDate] = useState('');

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

  // Filter cycles
  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => {
      const matchesYear = filterYear === 'all' || cycle.academicYear === filterYear;
      const matchesStatus = filterStatus === 'all' || cycle.status === filterStatus;
      const matchesSearch = cycle.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesStatus && matchesSearch;
    });
  }, [cycles, filterYear, filterStatus, searchQuery]);

  // Create cycle
  const handleCreateCycle = useCallback(
    (data: Partial<AppraisalCycle>) => {
      const newCycle: AppraisalCycle = {
        id: generateCycleId(),
        name: data.name || '',
        description: data.description || '',
        academicYear: data.academicYear || ACADEMIC_YEARS[0],
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        currentPhase: 0,
        phases: DEFAULT_PHASES.map((p, idx) => ({
          ...p,
          id: `P${idx + 1}`,
          totalCount: 245
        })),
        totalEmployees: 245,
        completedEmployees: 0,
        status: 'Planning',
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateId: data.templateId || null,
        notificationsEnabled: data.notificationsEnabled ?? true,
        autoProgressEnabled: data.autoProgressEnabled ?? false,
        history: [
        {
          id: generateId(),
          action: 'Created',
          performedBy: 'Current User',
          timestamp: new Date().toISOString(),
          details: `Cycle created from ${CYCLE_TEMPLATES.find((t) => t.id === data.templateId)?.name || 'custom'} template`
        }],

        excludedEmployees: [],
        reviewersAssigned: 0,
        calibrationMeetingDate: null,
        publishedDate: null
      };

      setCycles((prev) => [newCycle, ...prev]);
      setModalType('none');
      showNotification('Appraisal cycle created successfully');
    },
    [showNotification]
  );

  // Update cycle
  const handleUpdateCycle = useCallback(
    (data: Partial<AppraisalCycle>) => {
      if (!selectedCycle) return;

      setCycles((prev) =>
      prev.map((c) =>
      c.id === selectedCycle.id ?
      {
        ...c,
        ...data,
        updatedAt: new Date().toISOString(),
        history: [
        ...c.history,
        {
          id: generateId(),
          action: 'Updated',
          performedBy: 'Current User',
          timestamp: new Date().toISOString(),
          details: 'Cycle details updated'
        }]

      } :
      c
      )
      );
      setModalType('none');
      setSelectedCycle(null);
      showNotification('Cycle updated successfully');
    },
    [selectedCycle, showNotification]
  );

  // Start cycle
  const handleStartCycle = useCallback(() => {
    if (!selectedCycle) return;

    setIsLoading(true);
    setTimeout(() => {
      setCycles((prev) =>
      prev.map((c) =>
      c.id === selectedCycle.id ?
      {
        ...c,
        status: 'Active' as CycleStatus,
        phases: c.phases.map((p, idx) =>
        idx === 0 ?
        { ...p, status: 'In Progress' as PhaseStatus, startDate: new Date().toISOString().split('T')[0] } :
        p
        ),
        updatedAt: new Date().toISOString(),
        history: [
        ...c.history,
        {
          id: generateId(),
          action: 'Started',
          performedBy: 'Current User',
          timestamp: new Date().toISOString(),
          details: 'Cycle started, Planning phase initiated'
        }]

      } :
      c
      )
      );
      setIsLoading(false);
      setModalType('none');
      setSelectedCycle(null);
      showNotification(`${selectedCycle.name} has been started`);
    }, 1000);
  }, [selectedCycle, showNotification]);

  // Pause cycle
  const handlePauseCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      status: 'Paused' as CycleStatus,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Paused',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: 'Cycle paused'
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been paused`, 'warning');
  }, [selectedCycle, showNotification]);

  // Resume cycle
  const handleResumeCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      status: 'Active' as CycleStatus,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Resumed',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: 'Cycle resumed'
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been resumed`);
  }, [selectedCycle, showNotification]);

  // Extend cycle
  const handleExtendCycle = useCallback(() => {
    if (!selectedCycle || !extendDate) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      endDate: extendDate,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Extended',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: `End date extended to ${formatDate(extendDate)}`
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    setExtendDate('');
    showNotification(`${selectedCycle.name} has been extended`);
  }, [selectedCycle, extendDate, showNotification]);

  // Lock cycle
  const handleLockCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      status: 'Locked' as CycleStatus,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Locked',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: 'Cycle locked for final review'
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been locked`, 'warning');
  }, [selectedCycle, showNotification]);

  // Unlock cycle
  const handleUnlockCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      status: 'Active' as CycleStatus,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Unlocked',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: 'Cycle unlocked'
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been unlocked`);
  }, [selectedCycle, showNotification]);

  // Publish cycle
  const handlePublishCycle = useCallback(() => {
    if (!selectedCycle) return;

    setIsLoading(true);
    setTimeout(() => {
      setCycles((prev) =>
      prev.map((c) =>
      c.id === selectedCycle.id ?
      {
        ...c,
        status: 'Published' as CycleStatus,
        publishedDate: new Date().toISOString().split('T')[0],
        currentPhase: c.phases.length - 1,
        phases: c.phases.map((p) => ({ ...p, status: 'Completed' as PhaseStatus })),
        completedEmployees: c.totalEmployees,
        updatedAt: new Date().toISOString(),
        history: [
        ...c.history,
        {
          id: generateId(),
          action: 'Published',
          performedBy: 'Current User',
          timestamp: new Date().toISOString(),
          details: 'Results published to all employees'
        }]

      } :
      c
      )
      );
      setIsLoading(false);
      setModalType('none');
      setSelectedCycle(null);
      showNotification(`${selectedCycle.name} has been published`);
    }, 1500);
  }, [selectedCycle, showNotification]);

  // Cancel cycle
  const handleCancelCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      status: 'Cancelled' as CycleStatus,
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Cancelled',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: 'Cycle cancelled'
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been cancelled`, 'warning');
  }, [selectedCycle, showNotification]);

  // Delete cycle
  const handleDeleteCycle = useCallback(() => {
    if (!selectedCycle) return;

    setCycles((prev) => prev.filter((c) => c.id !== selectedCycle.id));
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`${selectedCycle.name} has been deleted`);
  }, [selectedCycle, showNotification]);

  // Clone cycle
  const handleCloneCycle = useCallback(() => {
    if (!selectedCycle) return;

    const clonedCycle: AppraisalCycle = {
      ...selectedCycle,
      id: generateCycleId(),
      name: `${selectedCycle.name} (Copy)`,
      status: 'Planning',
      currentPhase: 0,
      completedEmployees: 0,
      phases: selectedCycle.phases.map((p) => ({
        ...p,
        id: generateId(),
        status: 'Pending' as PhaseStatus,
        startDate: null,
        endDate: null,
        completedCount: 0
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedDate: null,
      history: [
      {
        id: generateId(),
        action: 'Created',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: `Cloned from ${selectedCycle.name}`
      }]

    };

    setCycles((prev) => [clonedCycle, ...prev]);
    setModalType('none');
    setSelectedCycle(null);
    showNotification('Cycle cloned successfully');
  }, [selectedCycle, showNotification]);

  // Advance phase
  const handleAdvancePhase = useCallback(() => {
    if (!selectedCycle) return;

    const nextPhase = selectedCycle.currentPhase + 1;
    if (nextPhase >= selectedCycle.phases.length) {
      showNotification('Cannot advance - already at final phase', 'warning');
      return;
    }

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      currentPhase: nextPhase,
      phases: c.phases.map((p, idx) => {
        if (idx === c.currentPhase) {
          return { ...p, status: 'Completed' as PhaseStatus, endDate: new Date().toISOString().split('T')[0] };
        }
        if (idx === nextPhase) {
          return { ...p, status: 'In Progress' as PhaseStatus, startDate: new Date().toISOString().split('T')[0] };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Phase Advanced',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: `Advanced to ${c.phases[nextPhase].name} phase`
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`Advanced to ${selectedCycle.phases[nextPhase].name} phase`);
  }, [selectedCycle, showNotification]);

  // Revert phase
  const handleRevertPhase = useCallback(() => {
    if (!selectedCycle || selectedCycle.currentPhase === 0) return;

    const prevPhase = selectedCycle.currentPhase - 1;

    setCycles((prev) =>
    prev.map((c) =>
    c.id === selectedCycle.id ?
    {
      ...c,
      currentPhase: prevPhase,
      phases: c.phases.map((p, idx) => {
        if (idx === c.currentPhase) {
          return { ...p, status: 'Pending' as PhaseStatus, startDate: null, endDate: null };
        }
        if (idx === prevPhase) {
          return { ...p, status: 'In Progress' as PhaseStatus, endDate: null };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
      history: [
      ...c.history,
      {
        id: generateId(),
        action: 'Phase Reverted',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        details: `Reverted to ${c.phases[prevPhase].name} phase`
      }]

    } :
    c
    )
    );
    setModalType('none');
    setSelectedCycle(null);
    showNotification(`Reverted to ${selectedCycle.phases[prevPhase].name} phase`, 'warning');
  }, [selectedCycle, showNotification]);

  // Send reminder
  const handleSendReminder = useCallback(() => {
    if (!selectedCycle) return;

    const pendingCount = selectedCycle.totalEmployees - selectedCycle.completedEmployees;
    showNotification(`Reminder sent to ${pendingCount} employees with pending submissions`);
    setModalType('none');
    setSelectedCycle(null);
  }, [selectedCycle, showNotification]);

  // Export data
  const handleExportData = useCallback(
    (format: 'csv' | 'excel' | 'pdf') => {
      if (!selectedCycle) return;

      const data = {
        ...selectedCycle,
        phases: selectedCycle.phases.map((p) => ({
          name: p.name,
          status: p.status,
          startDate: p.startDate,
          endDate: p.endDate,
          completion: `${p.completedCount}/${p.totalCount}`
        }))
      };

      if (format === 'csv') {
        const csvContent = JSON.stringify(data, null, 2);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedCycle.id}_export.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Data exported as CSV');
      } else {
        showNotification(`Data exported as ${format.toUpperCase()}`, 'info');
      }
      setModalType('none');
      setSelectedCycle(null);
    },
    [selectedCycle, showNotification]
  );

  // Refresh data
  const handleRefresh = useCallback(() => {
    showNotification('Data refreshed', 'info');
  }, [showNotification]);

  // Toggle expanded cycle
  const toggleExpandedCycle = useCallback((cycleId: string) => {
    setExpandedCycles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cycleId)) {
        newSet.delete(cycleId);
      } else {
        newSet.add(cycleId);
      }
      return newSet;
    });
  }, []);

  // Handle action from menu
  const handleAction = useCallback(
    (cycle: AppraisalCycle, action: ModalType) => {
      setSelectedCycle(cycle);
      setActionMenuId(null);

      if (action === 'extend') {
        setExtendDate(cycle.endDate);
      }

      setModalType(action);
    },
    []
  );

  // Get status badge
  const getStatusBadge = (status: CycleStatus) => {
    switch (status) {
      case 'Planning':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Planning
          </Badge>);

      case 'Active':
        return (
          <Badge variant="info">
            <Play className="w-3 h-3 mr-1" />
            Active
          </Badge>);

      case 'Paused':
        return (
          <Badge variant="warning">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>);

      case 'Locked':
        return (
          <Badge variant="warning">
            <Lock className="w-3 h-3 mr-1" />
            Locked
          </Badge>);

      case 'Published':
        return (
          <Badge variant="success">
            <Send className="w-3 h-3 mr-1" />
            Published
          </Badge>);

      case 'Completed':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>);

      case 'Cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>);

      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get phase icon
  const getPhaseIcon = (phase: AppraisalPhase, idx: number, currentPhase: number) => {
    if (phase.status === 'Completed' || idx < currentPhase) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>);

    }
    if (phase.status === 'In Progress' || idx === currentPhase) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-blue-100">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>);

    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <div className="w-3 h-3 bg-gray-400 rounded-full" />
      </div>);

  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>HR</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Appraisal</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Cycle Status View</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Cycle Status</h1>
          <p className="text-sm text-gray-500">Track and manage appraisal cycles across phases</p>
        </div>
        <Button variant="primary" onClick={() => setModalType('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cycles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            label=""
            options={[
            { value: 'all', label: 'All Academic Years' },
            ...ACADEMIC_YEARS.map((year) => ({ value: year, label: year }))]
            }
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)} />

          <Select
            label=""
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Planning', label: 'Planning' },
            { value: 'Active', label: 'Active' },
            { value: 'Paused', label: 'Paused' },
            { value: 'Locked', label: 'Locked' },
            { value: 'Published', label: 'Published' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' }]
            }
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)} />

          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Cycles List */}
      <div className="space-y-4">
        {filteredCycles.map((cycle) =>
        <Card key={cycle.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                  onClick={() => toggleExpandedCycle(cycle.id)}
                  className="p-1 hover:bg-gray-100 rounded">

                    {expandedCycles.has(cycle.id) ?
                  <ChevronUp className="w-4 h-4" /> :

                  <ChevronDown className="w-4 h-4" />
                  }
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
                  {getStatusBadge(cycle.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {cycle.completedEmployees}/{cycle.totalEmployees} employees
                  </span>
                  <span className="text-xs text-gray-400">ID: {cycle.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cycle.status === 'Active' &&
              <>
                    <Button variant="outline" size="sm" onClick={() => handleAction(cycle, 'pause')}>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAction(cycle, 'extend')}>
                      <CalendarPlus className="w-4 h-4 mr-1" />
                      Extend
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAction(cycle, 'lock')}>
                      <Lock className="w-4 h-4 mr-1" />
                      Lock
                    </Button>
                  </>
              }
                {cycle.status === 'Paused' &&
              <Button variant="primary" size="sm" onClick={() => handleAction(cycle, 'resume')}>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </Button>
              }
                {cycle.status === 'Planning' &&
              <Button variant="primary" size="sm" onClick={() => handleAction(cycle, 'start')}>
                    <Play className="w-4 h-4 mr-1" />
                    Start Cycle
                  </Button>
              }
                {cycle.status === 'Locked' &&
              <>
                    <Button variant="outline" size="sm" onClick={() => handleAction(cycle, 'unlock')}>
                      <Unlock className="w-4 h-4 mr-1" />
                      Unlock
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleAction(cycle, 'publish')}>
                      <Send className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                  </>
              }
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(cycle, 'view')}>

                  <Eye className="w-4 h-4" />
                </Button>
                <ActionMenu
                cycle={cycle}
                isOpen={actionMenuId === cycle.id}
                onToggle={() => setActionMenuId(actionMenuId === cycle.id ? null : cycle.id)}
                onClose={() => setActionMenuId(null)}
                onAction={(action) => handleAction(cycle, action)} />

              </div>
            </div>

            {/* Phase Timeline */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {cycle.phases.map((phase, idx) =>
              <div key={phase.id} className="flex flex-col items-center relative z-10">
                    {getPhaseIcon(phase, idx, cycle.currentPhase)}
                    <span
                  className={`mt-2 text-xs font-medium ${
                  phase.status === 'Completed' ?
                  'text-green-600' :
                  phase.status === 'In Progress' ?
                  'text-blue-600' :
                  'text-gray-400'}`
                  }>

                      {phase.name}
                    </span>
                    {phase.status === 'In Progress' &&
                <span className="mt-1 text-xs text-blue-500 font-medium">Current</span>
                }
                  </div>
              )}
              </div>

              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${cycle.currentPhase / (cycle.phases.length - 1) * 100}%`
                }} />

              </div>
            </div>

            {/* Expanded Details */}
            {expandedCycles.has(cycle.id) &&
          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Created By</p>
                  <p className="text-sm font-medium text-gray-900">{cycle.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(cycle.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Reviewers Assigned</p>
                  <p className="text-sm font-medium text-gray-900">{cycle.reviewersAssigned}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Calibration Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {cycle.calibrationMeetingDate ? formatDate(cycle.calibrationMeetingDate) : 'Not scheduled'}
                  </p>
                </div>
                {cycle.description &&
            <div className="col-span-2 md:col-span-4">
                    <p className="text-xs text-gray-500 uppercase">Description</p>
                    <p className="text-sm text-gray-700">{cycle.description}</p>
                  </div>
            }
              </div>
          }

            {/* Progress Bar */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Completion</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(cycle.completedEmployees / cycle.totalEmployees * 100)}%
                    </p>
                  </div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${cycle.completedEmployees / cycle.totalEmployees * 100}%`
                    }} />

                  </div>
                </div>
                {cycle.status === 'Active' && cycle.completedEmployees < cycle.totalEmployees &&
              <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{cycle.totalEmployees - cycle.completedEmployees} pending submissions</span>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction(cycle, 'sendReminder')}>

                      <Bell className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>
                  </div>
              }
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {filteredCycles.length === 0 &&
      <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cycles Found</h3>
          <p className="text-gray-500 mb-4">No appraisal cycles match your current filters.</p>
          <Button variant="primary" onClick={() => setModalType('create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Cycle
          </Button>
        </Card>
      }

      {/* Create Cycle Modal */}
      <Modal
        isOpen={modalType === 'create'}
        onClose={() => setModalType('none')}
        title="Create New Appraisal Cycle"
        subtitle="Set up a new performance review cycle"
        size="lg">

        <CycleForm
          onSubmit={handleCreateCycle}
          onCancel={() => setModalType('none')} />

      </Modal>

      {/* Edit Cycle Modal */}
      <Modal
        isOpen={modalType === 'edit'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        title="Edit Appraisal Cycle"
        subtitle={selectedCycle?.id}
        size="lg">

        {selectedCycle &&
        <CycleForm
          cycle={selectedCycle}
          onSubmit={handleUpdateCycle}
          onCancel={() => {
            setModalType('none');
            setSelectedCycle(null);
          }}
          isEdit />

        }
      </Modal>

      {/* View Cycle Modal */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        title={selectedCycle?.name || 'Cycle Details'}
        subtitle={selectedCycle?.id}
        size="lg">

        {selectedCycle &&
        <div className="space-y-6">
            <div className="flex items-center gap-3">
              {getStatusBadge(selectedCycle.status)}
              <span className="text-sm text-gray-500">
                {formatDate(selectedCycle.startDate)} — {formatDate(selectedCycle.endDate)}
              </span>
            </div>

            {selectedCycle.description &&
          <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900">{selectedCycle.description}</p>
              </div>
          }

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCycle.totalEmployees}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">Completed</p>
                <p className="text-2xl font-bold text-green-600">{selectedCycle.completedEmployees}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {selectedCycle.totalEmployees - selectedCycle.completedEmployees}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase">Completion</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(selectedCycle.completedEmployees / selectedCycle.totalEmployees * 100)}%
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Phase Details</h4>
              <div className="space-y-2">
                {selectedCycle.phases.map((phase, idx) =>
              <div
                key={phase.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                phase.status === 'In Progress' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`
                }>

                    <div className="flex items-center gap-3">
                      {getPhaseIcon(phase, idx, selectedCycle.currentPhase)}
                      <div>
                        <p className="font-medium text-gray-900">{phase.name}</p>
                        {phase.startDate &&
                    <p className="text-xs text-gray-500">
                            {formatDate(phase.startDate)}
                            {phase.endDate && ` — ${formatDate(phase.endDate)}`}
                          </p>
                    }
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {phase.completedCount}/{phase.totalCount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(phase.completedCount / phase.totalCount * 100)}%
                      </p>
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500 uppercase">Created By</p>
                <p className="text-sm font-medium">{selectedCycle.createdBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Last Updated</p>
                <p className="text-sm font-medium">{formatDateTime(selectedCycle.updatedAt)}</p>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={modalType === 'history'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        title="Cycle History"
        subtitle={selectedCycle?.name}
        size="md">

        {selectedCycle &&
        <div className="space-y-4">
            {selectedCycle.history.length === 0 ?
          <p className="text-center text-gray-500 py-8">No history available</p> :

          selectedCycle.history.
          slice().
          reverse().
          map((entry) =>
          <div key={entry.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <History className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(entry.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{entry.details}</p>
                      <p className="text-xs text-gray-400 mt-1">By: {entry.performedBy}</p>
                    </div>
                  </div>
          )
          }
          </div>
        }
      </Modal>

      {/* Extend Cycle Modal */}
      <Modal
        isOpen={modalType === 'extend'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
          setExtendDate('');
        }}
        title="Extend Cycle End Date"
        subtitle={selectedCycle?.name}
        size="sm"
        footer={
        <div className="flex justify-end gap-3">
            <Button
            variant="outline"
            onClick={() => {
              setModalType('none');
              setSelectedCycle(null);
              setExtendDate('');
            }}>

              Cancel
            </Button>
            <Button variant="primary" onClick={handleExtendCycle} disabled={!extendDate}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Extend
            </Button>
          </div>
        }>

        {selectedCycle &&
        <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current End Date</p>
              <p className="font-medium">{formatDate(selectedCycle.endDate)}</p>
            </div>
            <Input
            label="New End Date"
            type="date"
            value={extendDate}
            onChange={(e) => setExtendDate(e.target.value)}
            min={selectedCycle.endDate} />

          </div>
        }
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={modalType === 'export'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        title="Export Cycle Data"
        subtitle={selectedCycle?.name}
        size="sm">

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleExportData('csv')}>

            <FileText className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleExportData('excel')}>

            <Download className="w-4 h-4 mr-2" />
            Export as Excel
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleExportData('pdf')}>

            <Printer className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </Modal>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={modalType === 'start'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleStartCycle}
        title="Start Appraisal Cycle"
        message={
        <div>
            <p>Are you sure you want to start <strong>{selectedCycle?.name}</strong>?</p>
            <p className="mt-2 text-sm">This will begin the Planning phase and notify all participants.</p>
          </div>
        }
        confirmText="Start Cycle"
        variant="success"
        isLoading={isLoading} />


      <ConfirmationModal
        isOpen={modalType === 'pause'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handlePauseCycle}
        title="Pause Appraisal Cycle"
        message={`Are you sure you want to pause ${selectedCycle?.name}? All submissions will be temporarily halted.`}
        confirmText="Pause Cycle"
        variant="warning" />


      <ConfirmationModal
        isOpen={modalType === 'resume'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleResumeCycle}
        title="Resume Appraisal Cycle"
        message={`Resume ${selectedCycle?.name}? Submissions will be re-enabled.`}
        confirmText="Resume Cycle"
        variant="success" />


      <ConfirmationModal
        isOpen={modalType === 'lock'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleLockCycle}
        title="Lock Appraisal Cycle"
        message={`Lock ${selectedCycle?.name}? No further submissions will be allowed.`}
        confirmText="Lock Cycle"
        variant="warning" />


      <ConfirmationModal
        isOpen={modalType === 'unlock'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleUnlockCycle}
        title="Unlock Appraisal Cycle"
        message={`Unlock ${selectedCycle?.name}? Submissions will be re-enabled.`}
        confirmText="Unlock Cycle"
        variant="info" />


      <ConfirmationModal
        isOpen={modalType === 'publish'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handlePublishCycle}
        title="Publish Appraisal Results"
        message={
        <div>
            <p>Are you sure you want to publish the results for <strong>{selectedCycle?.name}</strong>?</p>
            <p className="mt-2 text-sm">This action cannot be undone. All employees will be able to view their appraisal results.</p>
          </div>
        }
        confirmText="Publish Results"
        variant="success"
        isLoading={isLoading} />


      <ConfirmationModal
        isOpen={modalType === 'cancel'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleCancelCycle}
        title="Cancel Appraisal Cycle"
        message={`Are you sure you want to cancel ${selectedCycle?.name}? This action cannot be undone.`}
        confirmText="Cancel Cycle"
        variant="danger" />


      <ConfirmationModal
        isOpen={modalType === 'delete'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleDeleteCycle}
        title="Delete Appraisal Cycle"
        message={`Are you sure you want to permanently delete ${selectedCycle?.name}? This action cannot be undone.`}
        confirmText="Delete Cycle"
        variant="danger" />


      <ConfirmationModal
        isOpen={modalType === 'clone'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleCloneCycle}
        title="Clone Appraisal Cycle"
        message={`Create a copy of ${selectedCycle?.name}?`}
        confirmText="Clone Cycle"
        variant="info" />


      <ConfirmationModal
        isOpen={modalType === 'advancePhase'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleAdvancePhase}
        title="Advance to Next Phase"
        message={
        selectedCycle && selectedCycle.currentPhase < selectedCycle.phases.length - 1 ?
        <div>
              <p>Advance from <strong>{selectedCycle.phases[selectedCycle.currentPhase].name}</strong> to <strong>{selectedCycle.phases[selectedCycle.currentPhase + 1].name}</strong>?</p>
              <p className="mt-2 text-sm">Current phase will be marked as completed.</p>
            </div> :
        'Cannot advance - already at final phase'
        }
        confirmText="Advance Phase"
        variant="info" />


      <ConfirmationModal
        isOpen={modalType === 'revertPhase'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleRevertPhase}
        title="Revert to Previous Phase"
        message={
        selectedCycle && selectedCycle.currentPhase > 0 ?
        <div>
              <p>Revert from <strong>{selectedCycle.phases[selectedCycle.currentPhase].name}</strong> to <strong>{selectedCycle.phases[selectedCycle.currentPhase - 1].name}</strong>?</p>
              <p className="mt-2 text-sm">This may affect completed submissions.</p>
            </div> :
        'Cannot revert - already at first phase'
        }
        confirmText="Revert Phase"
        variant="warning" />


      <ConfirmationModal
        isOpen={modalType === 'sendReminder'}
        onClose={() => {
          setModalType('none');
          setSelectedCycle(null);
        }}
        onConfirm={handleSendReminder}
        title="Send Reminder"
        message={
        selectedCycle ?
        <p>Send reminder emails to {selectedCycle.totalEmployees - selectedCycle.completedEmployees} employees with pending submissions?</p> :
        ''
        }
        confirmText="Send Reminder"
        variant="info" />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}