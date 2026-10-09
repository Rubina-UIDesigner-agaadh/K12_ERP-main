// File: ManualAttendanceMarking.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import {
  AlertCircle, AlertTriangle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Coffee,
  Download, Edit3, FileSpreadsheet, Home, Lock, MessageSquare, Paperclip, Printer, Radio, RefreshCw,
  Save, Search, Send, UserCheck, Wifi, X, XCircle
} from 'lucide-react';

// Types
type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'wfh' | 'on_duty' | 'week_off';

interface Employee {
  id: string;
  serialNo: number;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  shift: string;
  shiftStart: string;
  shiftEnd: string;
  loginTime: string;
  logoutTime: string;
  breakStartTime: string;
  breakEndTime: string;
  grossHours: number;
  breakDuration: number;
  netWorkingHours: number;
  overtime: number;
  status: AttendanceStatus;
  isLate: boolean;
  lateByMinutes: number;
  isEarlyLeave: boolean;
  earlyLeaveMinutes: number;
  remarks: string;
  isEditing: boolean;
}

// Display Configuration (ui-level statuses; Late and Not Marked are derived, not stored)
type ChoiceValue = AttendanceStatus | 'late';
type DisplayStatus = AttendanceStatus | 'late' | 'not_marked';
type StaffType = 'Full-time' | 'Part-time' | 'Contract';
type ModeId = 'auto' | 'manual' | 'hybrid';

const DISPLAY_META: Record<DisplayStatus, { label: string; badge: string; dot: string; icon: React.ReactNode }> = {
  present: { label: 'Present', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  late: { label: 'Late', badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  absent: { label: 'Absent', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', icon: <XCircle className="w-3.5 h-3.5" /> },
  half_day: { label: 'Half Day', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', icon: <Clock className="w-3.5 h-3.5" /> },
  leave: { label: 'On Leave', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', icon: <Coffee className="w-3.5 h-3.5" /> },
  on_duty: { label: 'On Duty', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500', icon: <UserCheck className="w-3.5 h-3.5" /> },
  wfh: { label: 'WFH', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', icon: <Home className="w-3.5 h-3.5" /> },
  week_off: { label: 'Week Off', badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400', icon: <Calendar className="w-3.5 h-3.5" /> },
  not_marked: { label: 'Not Marked', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-300', icon: <AlertCircle className="w-3.5 h-3.5" /> }
};

// Department Options
const departments = [
{ value: 'all', label: 'All Departments' },
{ value: 'IT Department', label: 'IT Department' },
{ value: 'Human Resources', label: 'Human Resources' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Marketing', label: 'Marketing' },
{ value: 'Operations', label: 'Operations' },
{ value: 'Sales', label: 'Sales' },
{ value: 'Administration', label: 'Administration' }];

// Initial Employee Data
const initialEmployees: Employee[] = [
{
  id: '1',
  serialNo: 1,
  employeeId: 'EMP001',
  name: 'John Anderson',
  avatar: 'JA',
  department: 'IT Department',
  designation: 'Senior Developer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:55',
  logoutTime: '18:15',
  breakStartTime: '13:00',
  breakEndTime: '13:45',
  grossHours: 9.33,
  breakDuration: 0.75,
  netWorkingHours: 8.58,
  overtime: 0.25,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '2',
  serialNo: 2,
  employeeId: 'EMP002',
  name: 'Sarah Williams',
  avatar: 'SW',
  department: 'Human Resources',
  designation: 'HR Manager',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:20',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '14:00',
  grossHours: 8.67,
  breakDuration: 1.0,
  netWorkingHours: 7.67,
  overtime: 0,
  status: 'present',
  isLate: true,
  lateByMinutes: 20,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Late arrival - 20 mins',
  isEditing: false
},
{
  id: '3',
  serialNo: 3,
  employeeId: 'EMP003',
  name: 'Michael Chen',
  avatar: 'MC',
  department: 'Finance',
  designation: 'Accountant',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'absent',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Absent - No information',
  isEditing: false
},
{
  id: '4',
  serialNo: 4,
  employeeId: 'EMP004',
  name: 'Emily Johnson',
  avatar: 'EJ',
  department: 'Marketing',
  designation: 'Marketing Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:00',
  logoutTime: '13:30',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 4.5,
  breakDuration: 0,
  netWorkingHours: 4.5,
  overtime: 0,
  status: 'half_day',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: true,
  earlyLeaveMinutes: 270,
  remarks: 'Half day - Permission granted',
  isEditing: false
},
{
  id: '5',
  serialNo: 5,
  employeeId: 'EMP005',
  name: 'David Martinez',
  avatar: 'DM',
  department: 'Operations',
  designation: 'Operations Manager',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'leave',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'CL - Approved',
  isEditing: false
},
{
  id: '6',
  serialNo: 6,
  employeeId: 'EMP006',
  name: 'Lisa Parker',
  avatar: 'LP',
  department: 'IT Department',
  designation: 'Junior Developer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:00',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 9.0,
  breakDuration: 0.5,
  netWorkingHours: 8.5,
  overtime: 0,
  status: 'wfh',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Working from home',
  isEditing: false
},
{
  id: '7',
  serialNo: 7,
  employeeId: 'EMP007',
  name: 'Robert Kim',
  avatar: 'RK',
  department: 'Sales',
  designation: 'Sales Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:30',
  logoutTime: '19:00',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 10.5,
  breakDuration: 0.5,
  netWorkingHours: 10.0,
  overtime: 1.0,
  status: 'on_duty',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Client visit',
  isEditing: false
},
{
  id: '8',
  serialNo: 8,
  employeeId: 'EMP008',
  name: 'Jennifer Davis',
  avatar: 'JD',
  department: 'Human Resources',
  designation: 'HR Executive',
  shift: 'Morning',
  shiftStart: '08:00',
  shiftEnd: '16:00',
  loginTime: '08:00',
  logoutTime: '16:05',
  breakStartTime: '12:00',
  breakEndTime: '12:30',
  grossHours: 8.08,
  breakDuration: 0.5,
  netWorkingHours: 7.58,
  overtime: 0,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '9',
  serialNo: 9,
  employeeId: 'EMP009',
  name: 'Thomas Brown',
  avatar: 'TB',
  department: 'IT Department',
  designation: 'System Administrator',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:05',
  logoutTime: '18:30',
  breakStartTime: '13:15',
  breakEndTime: '14:00',
  grossHours: 9.42,
  breakDuration: 0.75,
  netWorkingHours: 8.67,
  overtime: 0.5,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '10',
  serialNo: 10,
  employeeId: 'EMP010',
  name: 'Maria Garcia',
  avatar: 'MG',
  department: 'Finance',
  designation: 'Financial Analyst',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'week_off',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Sunday - Week Off',
  isEditing: false
},
{
  id: '11',
  serialNo: 11,
  employeeId: 'EMP011',
  name: 'James Wilson',
  avatar: 'JW',
  department: 'Administration',
  designation: 'Admin Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:50',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '13:45',
  grossHours: 9.17,
  breakDuration: 0.75,
  netWorkingHours: 8.42,
  overtime: 0,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '12',
  serialNo: 12,
  employeeId: 'EMP012',
  name: 'Patricia Moore',
  avatar: 'PM',
  department: 'Marketing',
  designation: 'Content Writer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:45',
  logoutTime: '17:30',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 7.75,
  breakDuration: 0.5,
  netWorkingHours: 7.25,
  overtime: 0,
  status: 'present',
  isLate: true,
  lateByMinutes: 45,
  isEarlyLeave: true,
  earlyLeaveMinutes: 30,
  remarks: 'Late arrival, Early departure',
  isEditing: false
}];


// Utility Functions
const parseTime = (timeString: string): number | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const getCurrentTimeStamp = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const calculateWorkingHours = (
loginTime: string,
logoutTime: string,
breakStart: string,
breakEnd: string)
: {grossHours: number;breakDuration: number;netWorkingHours: number;} => {
  const login = parseTime(loginTime);
  const logout = parseTime(logoutTime);
  const breakS = parseTime(breakStart);
  const breakE = parseTime(breakEnd);

  if (login === null || logout === null) {
    return { grossHours: 0, breakDuration: 0, netWorkingHours: 0 };
  }

  const grossMinutes = logout - login;
  const grossHours = grossMinutes / 60;

  let breakDuration = 0;
  if (breakS !== null && breakE !== null) {
    breakDuration = (breakE - breakS) / 60;
  }

  const netWorkingHours = grossHours - breakDuration;

  return {
    grossHours: Math.round(grossHours * 100) / 100,
    breakDuration: Math.round(breakDuration * 100) / 100,
    netWorkingHours: Math.round(netWorkingHours * 100) / 100
  };
};

// ==================== PAGE HELPERS ====================

const PAGE_SIZE = 8;
const DEADLINE_MINUTES = 11 * 60;
const DEVICE_METHODS = ['Fingerprint', 'Face Scan', 'RFID Card'];
const DEVICE_GATES = ['Main Gate', 'Gate 2', 'Staff Entry'];
const TIMED_CHOICES: ChoiceValue[] = ['present', 'late', 'half_day', 'on_duty', 'wfh'];
const CHOICE_LABEL: Record<ChoiceValue, string> = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  half_day: 'Half Day',
  leave: 'On Leave',
  on_duty: 'On Duty',
  wfh: 'WFH',
  week_off: 'Week Off'
};
const EDIT_CHOICES: ChoiceValue[] = ['present', 'late', 'absent', 'half_day', 'leave', 'on_duty', 'wfh', 'week_off'];
const BULK_CHOICES: ChoiceValue[] = ['present', 'absent', 'late', 'half_day', 'leave', 'on_duty'];
const QUICK_FILTERS: { key: 'all' | DisplayStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'present', label: 'Present' },
  { key: 'absent', label: 'Absent' },
  { key: 'late', label: 'Late' },
  { key: 'half_day', label: 'Half Day' },
  { key: 'leave', label: 'Leave' }
];
const SUMMARY_CARDS: { key: 'all' | DisplayStatus; label: string; text: string }[] = [
  { key: 'all', label: 'Total', text: 'text-gray-900' },
  { key: 'present', label: 'Present', text: 'text-green-700' },
  { key: 'absent', label: 'Absent', text: 'text-red-700' },
  { key: 'late', label: 'Late', text: 'text-yellow-700' },
  { key: 'half_day', label: 'Half Day', text: 'text-orange-700' },
  { key: 'leave', label: 'On Leave', text: 'text-blue-700' },
  { key: 'on_duty', label: 'On Duty', text: 'text-indigo-700' },
  { key: 'not_marked', label: 'Not Marked', text: 'text-slate-600' }
];
const MODES: { id: ModeId; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'auto', label: 'Auto', description: 'Biometric / RFID only', icon: <Wifi className="w-4 h-4" /> },
  { id: 'manual', label: 'Manual', description: 'HR marks each record', icon: <Edit3 className="w-4 h-4" /> },
  { id: 'hybrid', label: 'Hybrid', description: 'Device first, HR corrects', icon: <RefreshCw className="w-4 h-4" /> }
];
const FILTER_INPUT_CLASS = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500';
const BUTTON_OUTLINE_CLASS = 'inline-flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed';

interface EditDraft {
  choice: ChoiceValue;
  inTime: string;
  outTime: string;
  reason: string;
  proofName: string;
}

interface AttendanceRow extends Employee {
  staffType: StaffType;
  markSource?: 'auto' | 'manual';
  proofName?: string;
}

const toDateInput = (date: Date): string =>
`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const formatLongDate = (iso: string): string => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
};

// Staff type is not in the mock records, so it is derived from the serial number for filtering
const staffTypeOf = (serialNo: number): StaffType => (serialNo % 4 === 0 ? 'Contract' : serialNo % 3 === 0 ? 'Part-time' : 'Full-time');

// Records with a biometric login are auto-marked. Present records without a login are not marked yet.
const markSourceOf = (employee: Employee): AttendanceRow['markSource'] =>
employee.loginTime ? 'auto' : employee.status === 'present' ? undefined : 'manual';

const toAttendanceRow = (employee: Employee): AttendanceRow => ({
  ...employee,
  staffType: staffTypeOf(employee.serialNo),
  markSource: markSourceOf(employee)
});

const displayStatusOf = (row: AttendanceRow): DisplayStatus => {
  if (!row.markSource) return 'not_marked';
  return row.status === 'present' && row.isLate ? 'late' : row.status;
};

// Overtime = net hours above the standard shift (shift length minus a one-hour break)
const computeOvertime = (row: AttendanceRow, netHours: number): number => {
  const shiftMinutes = (parseTime(row.shiftEnd) ?? 0) - (parseTime(row.shiftStart) ?? 0);
  const standardHours = shiftMinutes / 60 - 1;
  return Math.max(0, Math.round((netHours - standardHours) * 100) / 100);
};

const downloadTextFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob(['\uFEFF' + content], { type: `${mime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const escapeHtmlText = (value: string): string =>
value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sheetRowsOf = (rows: AttendanceRow[]) => rows.map((row) => [
  String(row.serialNo),
  row.name,
  row.employeeId,
  row.department,
  row.staffType,
  DISPLAY_META[displayStatusOf(row)].label,
  row.loginTime || '',
  row.logoutTime || '',
  row.loginTime ? row.netWorkingHours.toFixed(2) : '',
  row.markSource === 'auto' ? 'Auto' : row.markSource === 'manual' ? 'Manual' : '',
  row.remarks
]);

const SHEET_HEADERS = ['#', 'Employee', 'Code', 'Department', 'Staff Type', 'Status', 'IN', 'OUT', 'Hours', 'Source', 'Remarks'];

// ==================== MAIN COMPONENT ====================

export function ManualAttendanceMarking() {
  const [now] = useState(() => new Date());
  const today = toDateInput(now);
  const deadlinePassed = now.getHours() * 60 + now.getMinutes() > DEADLINE_MINUTES;

  const [mode, setMode] = useState<ModeId>('hybrid');
  const [selectedDate, setSelectedDate] = useState(today);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [staffTypeFilter, setStaffTypeFilter] = useState<'all' | StaffType>('all');
  const [searchDraft, setSearchDraft] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | DisplayStatus>('all');
  const [rows, setRows] = useState<AttendanceRow[]>(() => initialEmployees.map(toAttendanceRow));
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [locked, setLocked] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft>({ choice: 'present', inTime: '', outTime: '', reason: '', proofName: '' });
  const [editError, setEditError] = useState<string | null>(null);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [showFullLog, setShowFullLog] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const isToday = selectedDate === today;
  const canEdit = !locked && mode !== 'auto';

  // Scope = date + department + staff type. Summary cards and the quick filters work on this scope.
  const scopeRows = isToday
    ? rows.filter((row) =>
      (departmentFilter === 'all' || row.department === departmentFilter) &&
      (staffTypeFilter === 'all' || row.staffType === staffTypeFilter))
    : [];
  const total = scopeRows.length;
  const countFor = (key: 'all' | DisplayStatus) =>
    key === 'all' ? total : scopeRows.filter((row) => displayStatusOf(row) === key).length;
  const pct = (count: number) => (total ? Math.round((count / total) * 100) : 0);
  const pendingCount = countFor('not_marked');
  const autoCount = scopeRows.filter((row) => row.markSource === 'auto').length;

  const tableRows = scopeRows.filter((row) =>
    (quickFilter === 'all' || displayStatusOf(row) === quickFilter) &&
    (!appliedSearch || [row.name, row.employeeId].some((value) => value.toLowerCase().includes(appliedSearch.toLowerCase()))));
  const totalPages = Math.max(1, Math.ceil(tableRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = tableRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageAllSelected = pageRows.length > 0 && pageRows.every((row) => selectedIds.has(row.id));
  const commentRow = rows.find((row) => row.id === commentId) ?? null;

  // Live device feed (mock device events, one per employee with a biometric login)
  const feed = useMemo(() => initialEmployees
    .filter((employee) => employee.loginTime)
    .map((employee, index) => ({
      id: employee.id,
      name: employee.name,
      code: employee.employeeId,
      time: employee.loginTime,
      method: DEVICE_METHODS[index % DEVICE_METHODS.length],
      gate: DEVICE_GATES[index % DEVICE_GATES.length],
      late: employee.isLate
    }))
    .sort((a, b) => b.time.localeCompare(a.time)), []);
  const feedToday = isToday ? feed : [];

  useEffect(() => {
    setPage(1);
  }, [quickFilter, appliedSearch, departmentFilter, staffTypeFilter, selectedDate]);

  // Unsaved-changes guard: browser close / reload, and in-app navigation (BrowserRouter has no data-router blocker)
  useEffect(() => {
    if (unsavedChanges === 0 || locked) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const originalPushState = window.history.pushState;
    const guardedPushState = function (this: History, data: unknown, unused: string, url?: string | URL | null) {
      if (!window.confirm('You have unsaved attendance changes. Leave this page without saving?')) return;
      originalPushState.call(this, data, unused, url);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState = guardedPushState as History['pushState'];
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
    };
  }, [unsavedChanges, locked]);

  const showNotice = (type: 'success' | 'info' | 'error', text: string) => setNotice({ type, text });

  const updateRows = (ids: string[], patch: (row: AttendanceRow) => AttendanceRow) => {
    setRows((prev) => prev.map((row) => (ids.includes(row.id) ? patch(row) : row)));
  };

  const changeMode = (next: ModeId) => {
    if (next === mode) return;
    setMode(next);
    setEditingId(null);
    setSelectedIds(new Set());
    showNotice('info', next === 'auto'
      ? 'Auto mode: attendance comes from the biometric device only. Manual edits are disabled.'
      : next === 'manual'
        ? 'Manual mode: HR marks attendance by hand. Device entries are shown for reference.'
        : 'Hybrid mode: device entries are used first, and HR can correct any record.');
  };

  const openEdit = (row: AttendanceRow) => {
    const current = displayStatusOf(row);
    setEditingId(row.id);
    setEditDraft({
      choice: current === 'not_marked' ? 'present' : current,
      inTime: row.loginTime,
      outTime: row.logoutTime,
      reason: row.remarks,
      proofName: row.proofName ?? ''
    });
    setEditError(null);
  };

  const applyEdit = (row: AttendanceRow) => {
    const { choice, inTime, outTime, reason, proofName } = editDraft;
    if (TIMED_CHOICES.includes(choice) && !inTime) {
      setEditError('Enter an IN time for this status, or choose Absent, On Leave or Week Off.');
      return;
    }
    const inMinutes = parseTime(inTime);
    const outMinutes = parseTime(outTime);
    if (inMinutes !== null && outMinutes !== null && outMinutes <= inMinutes) {
      setEditError('OUT time must be after the IN time.');
      return;
    }
    const hours = calculateWorkingHours(inTime, outTime, row.breakStartTime, row.breakEndTime);
    const isLate = choice === 'late';
    const lateBy = isLate ? Math.max(1, (inMinutes ?? 0) - (parseTime(row.shiftStart) ?? 0)) : 0;
    updateRows([row.id], (current) => ({
      ...current,
      status: choice === 'late' ? 'present' : choice,
      isLate,
      lateByMinutes: lateBy,
      loginTime: inTime,
      logoutTime: outTime,
      grossHours: hours.grossHours,
      breakDuration: hours.breakDuration,
      netWorkingHours: hours.netWorkingHours,
      overtime: computeOvertime(current, hours.netWorkingHours),
      remarks: reason.trim() || current.remarks,
      proofName: proofName || current.proofName,
      markSource: 'manual'
    }));
    setUnsavedChanges((count) => count + 1);
    setEditingId(null);
    setEditError(null);
    showNotice('success', `Attendance updated for ${row.name}. Click Save All to finish today's changes.`);
  };

  const applyBulk = (choice: ChoiceValue) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    updateRows(ids, (row) => {
      const keepTimes = TIMED_CHOICES.includes(choice);
      const loginTime = keepTimes ? row.loginTime : '';
      const logoutTime = keepTimes ? row.logoutTime : '';
      const hours = calculateWorkingHours(loginTime, logoutTime, row.breakStartTime, row.breakEndTime);
      const isLate = choice === 'late';
      const lateBy = isLate ? Math.max(1, (parseTime(loginTime) ?? 0) - (parseTime(row.shiftStart) ?? 0)) : 0;
      return {
        ...row,
        status: choice === 'late' ? 'present' : choice,
        isLate,
        lateByMinutes: lateBy,
        loginTime,
        logoutTime,
        grossHours: hours.grossHours,
        breakDuration: hours.breakDuration,
        netWorkingHours: hours.netWorkingHours,
        overtime: computeOvertime(row, hours.netWorkingHours),
        markSource: 'manual'
      };
    });
    setUnsavedChanges((count) => count + ids.length);
    setSelectedIds(new Set());
    showNotice('success', `${ids.length} employee(s) marked as ${CHOICE_LABEL[choice]}.`);
  };

  const toggleRowSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) pageRows.forEach((row) => next.delete(row.id));
      else pageRows.forEach((row) => next.add(row.id));
      return next;
    });
  };

  const openComment = (row: AttendanceRow) => {
    setCommentId(row.id);
    setCommentDraft(row.remarks);
  };

  const saveComment = () => {
    if (!commentRow) return;
    const nextText = commentDraft.trim();
    if (nextText !== commentRow.remarks) {
      updateRows([commentRow.id], (row) => ({ ...row, remarks: nextText }));
      setUnsavedChanges((count) => count + 1);
      showNotice('success', `Comment saved for ${commentRow.name}.`);
    }
    setCommentId(null);
  };

  const saveAll = () => {
    if (!canEdit || unsavedChanges === 0) return;
    setUnsavedChanges(0);
    showNotice('success', `All attendance changes for ${formatLongDate(selectedDate)} saved.`);
  };

  const submitDay = () => {
    if (locked || !isToday) return;
    if (pendingCount > 0 && !window.confirm(`${pendingCount} employee(s) are still not marked. Submit anyway? Submitting locks the day's attendance.`)) return;
    setUnsavedChanges(0);
    setLocked(true);
    setEditingId(null);
    setSelectedIds(new Set());
    showNotice('success', `Attendance for ${formatLongDate(selectedDate)} submitted and locked. Edits are disabled.`);
  };

  const exportCsv = () => {
    const lines = [SHEET_HEADERS, ...sheetRowsOf(tableRows)]
      .map((cols) => cols.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    downloadTextFile(`attendance-${selectedDate}.csv`, lines, 'text/csv');
    showNotice('success', `Exported ${tableRows.length} row(s) to CSV.`);
  };

  const openPrintSheet = () => {
    const win = window.open('', '_blank');
    if (!win) {
      showNotice('error', 'Pop-up blocked. Allow pop-ups for this site to print the attendance sheet.');
      return;
    }
    const head = SHEET_HEADERS.map((h) => `<th>${escapeHtmlText(h)}</th>`).join('');
    const body = sheetRowsOf(tableRows)
      .map((cols) => `<tr>${cols.map((v) => `<td>${escapeHtmlText(v)}</td>`).join('')}</tr>`)
      .join('');
    win.document.write(`<html><head><title>Attendance ${selectedDate}</title><style>body{font-family:Arial,sans-serif;font-size:12px;padding:24px;color:#111}h1{font-size:18px;margin:0 0 4px}p{margin:0 0 12px;color:#555}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:5px;text-align:left}th{background:#f3f4f6}</style></head><body><h1>Attendance Sheet</h1><p>${escapeHtmlText(formatLongDate(selectedDate))} · ${tableRows.length} row(s) · Generated by Admin</p><table><thead><tr>${head}</tr></thead><tbody>${body || '<tr><td colspan="11">No rows</td></tr>'}</tbody></table></body></html>`);
    win.document.close();
    window.setTimeout(() => win.print(), 300);
  };

  const sendSmsAlerts = () => {
    const targets = scopeRows.filter((row) => ['absent', 'not_marked'].includes(displayStatusOf(row)));
    showNotice('info', targets.length > 0
      ? `Prepared SMS alerts for ${targets.length} employee(s) who are absent or not marked. Sending needs the SMS gateway, which is not connected in this prototype.`
      : 'No absent or unmarked employees, so there are no SMS alerts to prepare.');
  };

  const clearFilters = () => {
    setDepartmentFilter('all');
    setStaffTypeFilter('all');
    setSearchDraft('');
    setAppliedSearch('');
    setQuickFilter('all');
  };

  const filtersActive = departmentFilter !== 'all' || staffTypeFilter !== 'all' || !!appliedSearch || quickFilter !== 'all';
  const rangeStart = tableRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, tableRows.length);

  return (
    <div className="space-y-6">
      {/* Zone 1: header, mode switch, live sync status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Attendance</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today: {formatLongDate(today)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 xl:gap-3">
            {MODES.map((item) => {
              const active = mode === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${active ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <span className={active ? 'text-green-700' : 'text-gray-500'}>{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                  </div>
                  {active ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-[11px] font-medium whitespace-nowrap">Currently ON</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => changeMode(item.id)}
                      disabled={locked}
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      Switch
                    </button>
                  )}
                </div>);
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Biometric device connected</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> ERP sync: Live</span>
          {locked && (
            <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium"><Lock className="w-3.5 h-3.5" /> Day submitted and locked</span>
          )}
        </div>
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Zone 2: smart filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(e) => setSelectedDate(e.target.value || today)}
              className={FILTER_INPUT_CLASS} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className={FILTER_INPUT_CLASS}>
              {departments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Staff Type</label>
            <select value={staffTypeFilter} onChange={(e) => setStaffTypeFilter(e.target.value as 'all' | StaffType)} className={FILTER_INPUT_CLASS}>
              <option value="all">All Staff Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Employee search</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setAppliedSearch(searchDraft.trim());
                  }}
                  placeholder="Name or employee code"
                  className={`${FILTER_INPUT_CLASS} pl-9`} />
              </div>
              <button
                type="button"
                onClick={() => setAppliedSearch(searchDraft.trim())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 mr-1">Quick filter:</span>
          {QUICK_FILTERS.map((item) => {
            const active = quickFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setQuickFilter(item.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                {item.label}
              </button>);
          })}
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="ml-1 text-xs font-medium text-indigo-600 hover:underline">Clear filters</button>
          )}
        </div>
      </div>

      {/* Zone 3: clickable live summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {SUMMARY_CARDS.map((card) => {
          const count = countFor(card.key);
          const active = quickFilter === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setQuickFilter(card.key)}
              className={`text-left bg-white rounded-xl border p-3 shadow-sm transition-colors ${active ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.text}`}>{count}</p>
              <p className="text-[11px] text-gray-500">{pct(count)}% of {total}</p>
            </button>);
        })}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Zone 6: bulk action bar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={pageAllSelected}
                  disabled={pageRows.length === 0}
                  onChange={toggleSelectPage}
                  className="rounded border-gray-300" />
                Select all (this page)
              </label>
              <span className="text-xs text-gray-500">{selectedIds.size} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BULK_CHOICES.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  disabled={!canEdit || selectedIds.size === 0}
                  onClick={() => applyBulk(choice)}
                  className={BUTTON_OUTLINE_CLASS}>
                  {CHOICE_LABEL[choice]}
                </button>
              ))}
            </div>
          </div>

          {/* Zone 4: attendance table with inline edit (Zone 5) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Attendance Register</h2>
                <p className="text-xs text-gray-500">{formatLongDate(selectedDate)} · {total} employee(s) in scope</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportCsv} disabled={tableRows.length === 0} className={BUTTON_OUTLINE_CLASS}>
                  <Download className="w-4 h-4" /> Export
                </button>
                <button type="button" onClick={openPrintSheet} disabled={tableRows.length === 0} className={BUTTON_OUTLINE_CLASS}>
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={!canEdit || unsavedChanges === 0}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" /> Save All
                </button>
              </div>
            </div>

            {!isToday ? (
              <div className="px-5 py-10 text-center text-sm text-gray-500">
                No attendance records for {formatLongDate(selectedDate)} in this prototype. Records are available for today only.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-10 px-4 py-3" />
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Dept</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">IN</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">OUT</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">HRS</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-10 text-center text-gray-500">No employees match these filters.</td>
                      </tr>
                    )}
                    {pageRows.map((row) => {
                      const display = displayStatusOf(row);
                      const meta = DISPLAY_META[display];
                      const isEditing = editingId === row.id;
                      return (
                        <React.Fragment key={row.id}>
                          <tr className={selectedIds.has(row.id) ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(row.id)}
                                onChange={() => toggleRowSelected(row.id)}
                                aria-label={`Select ${row.name}`}
                                className="rounded border-gray-300" />
                            </td>
                            <td className="px-4 py-3 text-gray-500">{row.serialNo}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                                <div>
                                  <p className="font-medium text-gray-900">{row.name}</p>
                                  <p className="text-xs text-gray-500">{row.employeeId} · {row.staffType}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{row.department}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>
                                {meta.icon}
                                {meta.label}
                              </span>
                              {display === 'late' && <p className="mt-1 text-[11px] text-yellow-700">{row.lateByMinutes} min late</p>}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-gray-900">{row.loginTime || '—'}</p>
                              {row.markSource && (
                                <span className={`text-[10px] font-medium ${row.markSource === 'auto' ? 'text-green-700' : 'text-blue-700'}`}>
                                  {row.markSource === 'auto' ? 'Auto' : 'Manual'}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-900">{row.logoutTime || '—'}</td>
                            <td className="px-4 py-3 text-gray-900">{row.loginTime ? row.netWorkingHours.toFixed(2) : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  title={canEdit ? 'Edit attendance' : 'Editing is disabled in this mode or after submission'}
                                  onClick={() => (isEditing ? setEditingId(null) : openEdit(row))}
                                  disabled={!canEdit}
                                  className={`p-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed ${isEditing ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  title="Comment"
                                  onClick={() => openComment(row)}
                                  className="relative p-1.5 rounded-lg text-gray-600 hover:bg-gray-100">
                                  <MessageSquare className="w-4 h-4" />
                                  {row.remarks && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isEditing && (
                            <tr className="bg-indigo-50/40">
                              <td colSpan={9} className="px-5 py-4">
                                <div className="space-y-4 rounded-xl border border-indigo-200 bg-white p-4 shadow-sm">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">Edit attendance · {row.name}</p>
                                      <p className="text-xs text-gray-500">{row.employeeId} · {row.department} · {formatLongDate(selectedDate)}</p>
                                    </div>
                                    <p className="text-xs text-gray-600">Current status: <span className="font-medium text-gray-900">{meta.label}</span></p>
                                  </div>
                                  <div>
                                    <p className="mb-2 text-xs font-medium text-gray-600">Set status</p>
                                    <div className="flex flex-wrap gap-2">
                                      {EDIT_CHOICES.map((choice) => (
                                        <button
                                          key={choice}
                                          type="button"
                                          onClick={() => setEditDraft((draft) => ({ ...draft, choice }))}
                                          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${editDraft.choice === choice ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                          {CHOICE_LABEL[choice]}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">IN time</label>
                                      <div className="flex gap-2">
                                        <input
                                          type="time"
                                          value={editDraft.inTime}
                                          onChange={(e) => setEditDraft((draft) => ({ ...draft, inTime: e.target.value }))}
                                          className={FILTER_INPUT_CLASS} />
                                        <button
                                          type="button"
                                          onClick={() => setEditDraft((draft) => ({ ...draft, inTime: getCurrentTimeStamp() }))}
                                          className="px-2.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Now</button>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">OUT time</label>
                                      <div className="flex gap-2">
                                        <input
                                          type="time"
                                          value={editDraft.outTime}
                                          onChange={(e) => setEditDraft((draft) => ({ ...draft, outTime: e.target.value }))}
                                          className={FILTER_INPUT_CLASS} />
                                        <button
                                          type="button"
                                          onClick={() => setEditDraft((draft) => ({ ...draft, outTime: getCurrentTimeStamp() }))}
                                          className="px-2.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Now</button>
                                      </div>
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Reason / remark</label>
                                      <input
                                        type="text"
                                        value={editDraft.reason}
                                        onChange={(e) => setEditDraft((draft) => ({ ...draft, reason: e.target.value }))}
                                        placeholder="e.g. Biometric failed at Gate 2"
                                        className={FILTER_INPUT_CLASS} />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Proof attachment (optional)</label>
                                      <div className="flex items-center gap-3">
                                        <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                          <Paperclip className="w-4 h-4" /> Attach file
                                          <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => setEditDraft((draft) => ({ ...draft, proofName: e.target.files?.[0]?.name ?? draft.proofName }))} />
                                        </label>
                                        <span className="truncate text-xs text-gray-500">{editDraft.proofName || 'No file attached'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {editError && <p className="text-sm text-red-600">{editError}</p>}
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingId(null);
                                        setEditError(null);
                                      }}
                                      className={BUTTON_OUTLINE_CLASS}>
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => applyEdit(row)}
                                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>);
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-t border-gray-200 text-sm">
              <p className="text-gray-600">Showing {rangeStart}–{rangeEnd} of {tableRows.length}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                  className={BUTTON_OUTLINE_CLASS}>
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-xs text-gray-500">Page {safePage} of {totalPages}</span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className={BUTTON_OUTLINE_CLASS}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-600">
              {(Object.keys(DISPLAY_META) as DisplayStatus[]).map((key) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${DISPLAY_META[key].dot}`} />
                  {DISPLAY_META[key].label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Zone 7: live auto-feed side panel */}
        <aside className="w-full xl:w-80 flex-shrink-0 xl:sticky xl:top-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-600" />
                Live Auto Feed
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between"><span>Biometric device</span><span className="font-medium text-green-700">Connected</span></div>
              <div className="flex justify-between"><span>Gate readers</span><span className="font-medium text-gray-900">3 of 3 online</span></div>
              <div className="flex justify-between"><span>Last event</span><span className="font-medium text-gray-900">{feedToday[0]?.time ?? '—'}</span></div>
            </div>
            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {feedToday.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-500">No device events for this date.</li>
              )}
              {feedToday.slice(0, 6).map((entry) => (
                <li key={entry.id} className="px-4 py-2.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-gray-900">{entry.time}</span>
                    {entry.late && <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800">LATE</span>}
                  </div>
                  <p className="truncate text-gray-900">{entry.name} <span className="text-xs text-gray-500">({entry.code})</span></p>
                  <p className="text-xs text-gray-500">{entry.method} · {entry.gate}</p>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2 border-t border-gray-200 px-4 py-3 text-center">
              <div className="rounded-lg bg-green-50 py-2">
                <p className="text-lg font-bold text-green-700">{autoCount}</p>
                <p className="text-[11px] text-green-800">Auto-marked</p>
              </div>
              <div className="rounded-lg bg-red-50 py-2">
                <p className="text-lg font-bold text-red-700">{pendingCount}</p>
                <p className="text-[11px] text-red-800">Pending</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => setShowFullLog(true)}
                className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                View Full Auto Log
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Zone 8: sticky bottom bar */}
      <div className="sticky bottom-0 z-30 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <span className={`font-semibold ${pendingCount > 0 ? 'text-red-600' : 'text-green-700'}`}>Remaining unmarked: {pendingCount}</span>
            <span className="text-gray-600">
              Deadline: Mark by 11:00 AM
              {deadlinePassed && <span className="ml-1 font-medium text-red-600">(passed)</span>}
            </span>
            {unsavedChanges > 0 && !locked && <span className="text-blue-700">{unsavedChanges} unsaved change(s)</span>}
            {locked && <span className="inline-flex items-center gap-1 font-medium text-amber-700"><Lock className="w-3.5 h-3.5" /> Submitted and locked</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} disabled={tableRows.length === 0} className={BUTTON_OUTLINE_CLASS}>
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
            <button type="button" onClick={openPrintSheet} disabled={tableRows.length === 0} className={BUTTON_OUTLINE_CLASS}>
              <Printer className="w-4 h-4" /> Print Sheet
            </button>
            <button type="button" onClick={sendSmsAlerts} className={BUTTON_OUTLINE_CLASS}>
              <Send className="w-4 h-4" /> Send SMS Alerts
            </button>
            <button
              type="button"
              onClick={submitDay}
              disabled={locked || !isToday}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed">
              <Lock className="w-4 h-4" /> Save &amp; Submit
            </button>
          </div>
        </div>
      </div>

      {/* Comment popup (💬) */}
      <Modal
        isOpen={!!commentRow}
        onClose={() => setCommentId(null)}
        title={commentRow ? `Comment: ${commentRow.name}` : 'Comment'}
        size="sm"
        footer={(
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setCommentId(null)} className={BUTTON_OUTLINE_CLASS}>Cancel</button>
            <button type="button" onClick={saveComment} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Comment</button>
          </div>)}>
        <div className="space-y-2">
          <p className="text-xs text-gray-500">{commentRow?.employeeId} · {commentRow?.department}</p>
          <textarea
            rows={4}
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder="Add a note for this attendance record"
            className={FILTER_INPUT_CLASS} />
        </div>
      </Modal>

      {/* Full auto log */}
      <Modal
        isOpen={showFullLog}
        onClose={() => setShowFullLog(false)}
        title="Full Auto Log"
        size="lg"
        footer={(
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowFullLog(false)} className={BUTTON_OUTLINE_CLASS}>Close</button>
          </div>)}>
        {feedToday.length === 0 ? (
          <p className="text-sm text-gray-500">No device events for this date.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Time</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Employee</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Method</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Gate</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feedToday.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-3 py-2 font-mono text-xs">{entry.time}</td>
                    <td className="px-3 py-2">{entry.name} <span className="text-xs text-gray-500">({entry.code})</span></td>
                    <td className="px-3 py-2">{entry.method}</td>
                    <td className="px-3 py-2">{entry.gate}</td>
                    <td className="px-3 py-2">{entry.late ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>);

}

export default ManualAttendanceMarking;
