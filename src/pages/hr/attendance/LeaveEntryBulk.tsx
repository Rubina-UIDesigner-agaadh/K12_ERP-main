import React, { useMemo, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import {
  Save,
  Search,
  Users,
  Calendar,
  Clock,
  UserPlus,
  Download,
  Upload,
  Info,
  Trash2,
  Plus,
  XCircle,
  CheckCircle,
  AlertTriangle } from
'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  avatar: string;
}

type LeaveCode = 'CL' | 'PL' | 'SL' | 'EL' | 'CO' | 'LOP' | 'HOL' | 'OPT';
type Duration = 'full' | 'first_half' | 'second_half';
type LeaveStatus = 'Pending' | 'Approved' | 'Withdrawn';

interface LeaveRecord {
  id: number;
  empId: string;
  leave: LeaveCode;
  from: string;
  to: string;
  days: number;
  duration: Duration;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  source: 'Bulk' | 'Single';
}

const ALL_EMPLOYEES: Employee[] = [
{ id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', avatar: 'JD' },
{ id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', avatar: 'JS' },
{ id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', avatar: 'RJ' },
{ id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', avatar: 'ED' },
{ id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', avatar: 'MB' },
{ id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', avatar: 'SW' },
{ id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', avatar: 'DL' },
{ id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', avatar: 'LA' },
{ id: 'EMP009', name: 'James Taylor', department: 'Engineering', designation: 'Tech Lead', avatar: 'JT' },
{ id: 'EMP010', name: 'Jennifer Martinez', department: 'HR', designation: 'HR Executive', avatar: 'JM' },
{ id: 'EMP011', name: 'Christopher Garcia', department: 'Engineering', designation: 'Developer', avatar: 'CG' },
{ id: 'EMP012', name: 'Amanda Robinson', department: 'Engineering', designation: 'QA Engineer', avatar: 'AR' },
{ id: 'EMP013', name: 'Kevin White', department: 'Finance', designation: 'Senior Accountant', avatar: 'KW' },
{ id: 'EMP014', name: 'Michelle Harris', department: 'Marketing', designation: 'Content Writer', avatar: 'MH' },
{ id: 'EMP015', name: 'Daniel Clark', department: 'IT Support', designation: 'Network Admin', avatar: 'DC' }];

const LEAVE_OPTIONS: { value: LeaveCode; label: string }[] = [
{ value: 'CL', label: 'Casual Leave (CL)' },
{ value: 'PL', label: 'Privilege Leave (PL)' },
{ value: 'SL', label: 'Sick Leave (SL)' },
{ value: 'EL', label: 'Earned Leave (EL)' },
{ value: 'CO', label: 'Comp-Off (CO)' },
{ value: 'LOP', label: 'Loss of Pay (LOP)' },
{ value: 'HOL', label: 'Company Holiday' },
{ value: 'OPT', label: 'Optional Holiday' }];

const LEAVE_LABEL: Record<string, string> = Object.fromEntries(LEAVE_OPTIONS.map((opt) => [opt.value, opt.label]));

const DURATION_OPTIONS = [
{ value: 'full', label: 'Full Day' },
{ value: 'first_half', label: 'First Half' },
{ value: 'second_half', label: 'Second Half' }];

const DEPARTMENTS = ['All Departments', ...Array.from(new Set(ALL_EMPLOYEES.map((emp) => emp.department)))];

const MIN_REASON = 10;

const SEED_RECORDS: LeaveRecord[] = [
{ id: 1, empId: 'EMP001', leave: 'CL', from: '2026-09-14', to: '2026-09-15', days: 2, duration: 'full', reason: 'Family function', status: 'Approved', appliedOn: '2026-09-08', source: 'Single' },
{ id: 2, empId: 'EMP001', leave: 'SL', from: '2026-08-03', to: '2026-08-03', days: 1, duration: 'full', reason: 'Fever and doctor visit', status: 'Approved', appliedOn: '2026-08-03', source: 'Single' },
{ id: 3, empId: 'EMP002', leave: 'EL', from: '2026-07-20', to: '2026-07-24', days: 5, duration: 'full', reason: 'Pre-planned family vacation', status: 'Approved', appliedOn: '2026-07-01', source: 'Bulk' },
{ id: 4, empId: 'EMP004', leave: 'CL', from: '2026-10-22', to: '2026-10-22', days: 1, duration: 'first_half', reason: 'Bank work', status: 'Pending', appliedOn: '2026-10-06', source: 'Single' }];

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isoPlus = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Counts Monday-Friday days between two ISO dates (inclusive). Half-day applies to a single-day request.
const countLeaveDays = (from: string, to: string, duration: Duration) => {
  if (!from || !to) return 0;
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (end < start) return 0;
  if (from === to && duration !== 'full') return 0.5;
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

const overlaps = (a: { from: string; to: string }, b: { from: string; to: string }) => a.from <= b.to && b.from <= a.to;

const formatDate = (iso: string) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const STATUS_STYLE: Record<LeaveStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Withdrawn: 'bg-gray-200 text-gray-700'
};

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm';

export function LeaveEntryBulk({ lockedMode }: { lockedMode?: 'bulk' | 'single' } = {}) {
  const [mode, setMode] = useState<'bulk' | 'single'>(lockedMode ?? 'bulk');
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [records, setRecords] = useState<LeaveRecord[]>(SEED_RECORDS);
  const [nextId, setNextId] = useState(100);

  // Bulk entry state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [leaveType, setLeaveType] = useState<LeaveCode | ''>('');
  const [fromDate, setFromDate] = useState(isoPlus(5));
  const [toDate, setToDate] = useState(isoPlus(6));
  const [leaveDuration, setLeaveDuration] = useState<Duration>('full');
  const [reason, setReason] = useState('Team offsite event - Annual team building activity');
  const [notifyTo, setNotifyTo] = useState('all');
  const [sendEmail, setSendEmail] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  // Single employee state
  const [singleId, setSingleId] = useState('EMP001');
  const [historyStatus, setHistoryStatus] = useState<'all' | LeaveStatus>('all');
  const [singleOpen, setSingleOpen] = useState(false);
  const [singleForm, setSingleForm] = useState({
    leave: 'CL' as LeaveCode | '',
    from: todayIso(),
    to: todayIso(),
    duration: 'full' as Duration,
    reason: '',
    contact: '',
    attachment: ''
  });
  const [singleErrors, setSingleErrors] = useState<string[]>([]);

  const filteredEmployees = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return ALL_EMPLOYEES.filter((emp) => {
      const matchesDept = selectedDept === 'All Departments' || emp.department === selectedDept;
      const matchesSearch =
        term === '' ||
        emp.name.toLowerCase().includes(term) ||
        emp.id.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term);
      return matchesDept && matchesSearch;
    });
  }, [searchQuery, selectedDept]);

  const selectedEmployees = ALL_EMPLOYEES.filter((emp) => selectedIds.includes(emp.id));
  const leaveDays = countLeaveDays(fromDate, toDate, leaveDuration);
  const totalLeaveDays = selectedEmployees.length * leaveDays;
  const allFilteredSelected = filteredEmployees.length > 0 && filteredEmployees.every((emp) => selectedIds.includes(emp.id));

  const toggleEmployee = (id: string) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const selectFiltered = () => {
    setSelectedIds((ids) => Array.from(new Set([...ids, ...filteredEmployees.map((emp) => emp.id)])));
  };

  const deselectFiltered = () => {
    const visible = filteredEmployees.map((emp) => emp.id);
    setSelectedIds((ids) => ids.filter((id) => !visible.includes(id)));
  };

  const validateBulk = () => {
    const problems: string[] = [];
    if (selectedEmployees.length === 0) problems.push('Select at least one employee.');
    if (!leaveType) problems.push('Choose a leave type.');
    if (!fromDate || !toDate) problems.push('Choose both From and To dates.');
    else if (toDate < fromDate) problems.push('To date cannot be before From date.');
    if (leaveDays === 0 && fromDate && toDate && toDate >= fromDate) problems.push('The selected range has no working days (weekends only).');
    if (reason.trim().length < MIN_REASON) problems.push(`Reason must be at least ${MIN_REASON} characters.`);
    return problems;
  };

  const submitBulk = () => {
    const problems = validateBulk();
    setBulkErrors(problems);
    if (problems.length > 0) {
      setNotice({ type: 'error', text: problems[0] });
      return;
    }
    const conflicts = selectedEmployees.filter((emp) =>
      records.some((rec) => rec.empId === emp.id && rec.status !== 'Withdrawn' && overlaps(rec, { from: fromDate, to: toDate }))
    );
    const toApply = selectedEmployees.filter((emp) => !conflicts.includes(emp));
    const appliedOn = todayIso();
    const status: LeaveStatus = autoApprove ? 'Approved' : 'Pending';
    if (toApply.length > 0) {
      setRecords((prev) => [
        ...toApply.map((emp, index) => ({
          id: nextId + index,
          empId: emp.id,
          leave: leaveType as LeaveCode,
          from: fromDate,
          to: toDate,
          days: leaveDays,
          duration: leaveDuration,
          reason: reason.trim(),
          status,
          appliedOn,
          source: 'Bulk' as const
        })),
        ...prev]);
      setNextId((id) => id + toApply.length);
    }
    setSelectedIds(conflicts.map((emp) => emp.id));
    setNotice({
      type: conflicts.length ? 'info' : 'success',
      text: `${toApply.length} leave request(s) ${autoApprove ? 'approved' : 'submitted for approval'}${sendEmail ? ' and notification sent' : ''}.${conflicts.length ? ` Skipped ${conflicts.length} with overlapping leave: ${conflicts.map((emp) => emp.name).join(', ')}.` : ''}`
    });
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    const ids = Array.from(new Set(
      text.split(/\r?\n/).map((line) => line.split(',')[0].trim().replace(/^"|"$/g, '')).filter((id) => ALL_EMPLOYEES.some((emp) => emp.id === id))
    ));
    if (ids.length === 0) {
      setNotice({ type: 'error', text: 'No matching employee IDs were found in the file.' });
      return;
    }
    setSelectedIds(ids);
    setNotice({ type: 'success', text: `${ids.length} employee(s) selected from ${file.name}.` });
  };

  const downloadBulkTemplate = () => {
    downloadCsv('leave-entry-template.csv', [
      ['employee_id', 'leave_type', 'from_date', 'to_date', 'duration', 'reason'],
      ['EMP001', 'CL', '2026-10-15', '2026-10-16', 'full', 'Family function']]);
    setNotice({ type: 'success', text: 'Template downloaded.' });
  };

  // Single employee
  const singleEmp = ALL_EMPLOYEES.find((emp) => emp.id === singleId) ?? ALL_EMPLOYEES[0];
  const singleRecords = records
    .filter((rec) => rec.empId === singleId && (historyStatus === 'all' || rec.status === historyStatus))
    .sort((a, b) => (a.from < b.from ? 1 : -1));
  const takenByType = LEAVE_OPTIONS.map((opt) => ({
    code: opt.value,
    days: records
      .filter((rec) => rec.empId === singleId && rec.leave === opt.value && rec.status === 'Approved')
      .reduce((sum, rec) => sum + rec.days, 0)
  })).filter((item) => item.days > 0);

  const singleDays = countLeaveDays(singleForm.from, singleForm.to, singleForm.duration);

  const openSingle = () => {
    setSingleErrors([]);
    setSingleForm({
      leave: 'CL',
      from: todayIso(),
      to: todayIso(),
      duration: 'full',
      reason: '',
      contact: '',
      attachment: ''
    });
    setSingleOpen(true);
  };

  const submitSingle = () => {
    const problems: string[] = [];
    if (!singleForm.leave) problems.push('Choose a leave type.');
    if (!singleForm.from || !singleForm.to) problems.push('Choose both From and To dates.');
    else if (singleForm.to < singleForm.from) problems.push('To date cannot be before From date.');
    else if (singleDays === 0) problems.push('The selected range has no working days (weekends only).');
    if (singleForm.reason.trim().length < MIN_REASON) problems.push(`Reason must be at least ${MIN_REASON} characters.`);
    if (singleForm.contact && !/^[0-9+\-\s]{7,15}$/.test(singleForm.contact)) problems.push('Contact number looks invalid.');
    const clash = records.find((rec) => rec.empId === singleId && rec.status !== 'Withdrawn' && overlaps(rec, { from: singleForm.from, to: singleForm.to }));
    if (clash) problems.push(`Overlaps an existing ${LEAVE_LABEL[clash.leave] ?? clash.leave} request (${formatDate(clash.from)} – ${formatDate(clash.to)}).`);
    setSingleErrors(problems);
    if (problems.length > 0) return;
    setRecords((prev) => [{
      id: nextId,
      empId: singleId,
      leave: singleForm.leave as LeaveCode,
      from: singleForm.from,
      to: singleForm.to,
      days: singleDays,
      duration: singleForm.duration,
      reason: singleForm.reason.trim(),
      status: 'Pending',
      appliedOn: todayIso(),
      source: 'Single'
    }, ...prev]);
    setNextId((id) => id + 1);
    setSingleOpen(false);
    setNotice({ type: 'success', text: `Leave request created for ${singleEmp.name} (${singleDays} day(s)) and sent for approval.` });
  };

  const withdraw = (rec: LeaveRecord) => {
    setRecords((prev) => prev.map((item) => (item.id === rec.id ? { ...item, status: 'Withdrawn' } : item)));
    setNotice({ type: 'info', text: `Leave request for ${formatDate(rec.from)} withdrawn.` });
  };

  const downloadHistory = () => {
    downloadCsv(`leave-history-${singleId}.csv`, [
      ['Applied On', 'Leave Type', 'From', 'To', 'Days', 'Duration', 'Reason', 'Status', 'Source'],
      ...singleRecords.map((rec) => [rec.appliedOn, LEAVE_LABEL[rec.leave] ?? rec.leave, rec.from, rec.to, rec.days, rec.duration, rec.reason, rec.status, rec.source])]);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Entry</h1>
          <p className="text-sm text-gray-500">Apply leave for multiple employees at once, or manage one employee's leave requests and history</p>
        </div>
        {mode === 'bulk' ?
        <div className="flex gap-2">
            <button type="button" onClick={downloadBulkTemplate} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" /> Template
            </button>
            <button type="button" onClick={submitBulk} className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4 mr-2" /> Submit Leave Requests
            </button>
          </div> :
        <button type="button" onClick={openSingle} className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" /> New Leave Request
          </button>
        }
      </div>

      {!lockedMode && <div className="flex gap-2 border-b border-gray-200">
        {([
        { id: 'bulk', label: 'Bulk Leave Entry (multiple employees)' },
        { id: 'single', label: 'Single Employee & History' }] as const).map((tab) =>
        <button
          key={tab.id}
          type="button"
          onClick={() => setMode(tab.id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${mode === tab.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {tab.label}
          </button>
        )}
      </div>}

      {notice &&
      <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100" title="Dismiss">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      }

      {mode === 'bulk' &&
      <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
                <div><p className="text-xs text-gray-500">Total Employees</p><p className="text-2xl font-bold text-blue-600">{ALL_EMPLOYEES.length}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"><UserPlus className="w-5 h-5 text-teal-600" /></div>
                <div><p className="text-xs text-gray-500">Selected</p><p className="text-2xl font-bold text-teal-600">{selectedIds.length}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-orange-600" /></div>
                <div><p className="text-xs text-gray-500">Working Days (per employee)</p><p className="text-2xl font-bold text-orange-600">{leaveDays}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-purple-600" /></div>
                <div><p className="text-xs text-gray-500">Total Leave Days</p><p className="text-2xl font-bold text-purple-600">{totalLeaveDays}</p></div>
              </div>
            </div>
          </div>

          {bulkErrors.length > 0 &&
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
              {bulkErrors.map((message) => <p key={message} className="text-xs text-yellow-800 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> {message}</p>)}
            </div>
          }

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Leave Details</h3></div>
              <div className="p-6 space-y-4">
                <Select
                  label="Leave Type *"
                  options={[{ value: '', label: 'Select Leave Type' }, ...LEAVE_OPTIONS]}
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveCode | '')} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <Select label="Leave Duration" options={DURATION_OPTIONS} value={leaveDuration} onChange={(e) => setLeaveDuration(e.target.value as Duration)} />
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Working days:</span>
                    <span className="font-bold text-teal-600">{leaveDays} day(s)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Excludes Saturdays and Sundays</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
                  <textarea className={inputClass} rows={3} placeholder="Enter reason for bulk leave application..." value={reason} onChange={(e) => setReason(e.target.value)} />
                  <p className="text-xs text-gray-500 mt-1">{reason.trim().length}/{MIN_REASON} minimum characters</p>
                </div>
                <Select
                  label="Notify To"
                  options={[
                  { value: 'all', label: 'All Reporting Managers' },
                  { value: 'single', label: 'Single Manager' },
                  { value: 'hr', label: 'HR Only' },
                  { value: 'none', label: 'No Notification' }]}
                  value={notifyTo}
                  onChange={(e) => setNotifyTo(e.target.value)} />
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Send email notification</span>
                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="rounded border-gray-300" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Auto-approve for eligible employees</span>
                    <input type="checkbox" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} className="rounded border-gray-300" />
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">Select Employees</h3>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <Upload className="w-4 h-4" /> Import IDs (CSV)
                    <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleBulkImport} />
                  </label>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, ID, department..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                  </div>
                  <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={selectFiltered} disabled={filteredEmployees.length === 0 || allFilteredSelected} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                    Select all shown ({filteredEmployees.length})
                  </button>
                  <button type="button" onClick={deselectFiltered} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Deselect shown</button>
                  <button type="button" onClick={() => setSelectedIds([])} disabled={selectedIds.length === 0} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {filteredEmployees.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No employees found</p>}
                  {filteredEmployees.map((emp) => {
                    const checked = selectedIds.includes(emp.id);
                    return (
                      <label key={emp.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 ${checked ? 'bg-teal-50' : ''}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleEmployee(emp.id)} className="rounded border-gray-300" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-semibold">{emp.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                          <p className="text-xs text-gray-500 truncate">{emp.id} · {emp.department} · {emp.designation}</p>
                        </div>
                      </label>);
                  })}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Selected ({selectedEmployees.length})</p>
                  {selectedEmployees.length === 0 ?
                  <p className="text-sm text-gray-500">No employees selected</p> :
                  <div className="flex flex-wrap gap-2">
                      {selectedEmployees.map((emp) => (
                        <span key={emp.id} className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full pl-3 pr-1.5 py-1 text-sm text-teal-800">
                          {emp.name}
                          <button type="button" onClick={() => toggleEmployee(emp.id)} className="p-0.5 rounded-full hover:bg-teal-100" title="Remove">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  }
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800">Employees who already have an overlapping leave request for these dates will be skipped and listed after submission.</p>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={submitBulk} className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" /> Submit for {selectedEmployees.length} employee(s)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      }

      {mode === 'single' &&
      <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Select
                label="Employee"
                options={ALL_EMPLOYEES.map((emp) => ({ value: emp.id, label: `${emp.name} - ${emp.id} (${emp.department})` }))}
                value={singleId}
                onChange={(e) => setSingleId(e.target.value)} />
              <div className="flex items-center gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">{singleEmp.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{singleEmp.name}</p>
                  <p className="text-sm text-gray-600">{singleEmp.id} · {singleEmp.designation}</p>
                  <p className="text-sm text-gray-500">{singleEmp.department} Department</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Approved leave taken (days)</p>
              {takenByType.length === 0 ?
              <p className="text-sm text-gray-500">No approved leave recorded yet.</p> :
              <div className="flex flex-wrap gap-3">
                  {takenByType.map((item) => (
                    <div key={item.code} className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-500">{LEAVE_LABEL[item.code]}</p>
                      <p className="text-lg font-bold text-gray-900">{item.days}</p>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">Leave History</h3>
                <p className="text-xs text-gray-500">All leave requests for {singleEmp.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value as 'all' | LeaveStatus)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="all">All statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
                <button type="button" onClick={downloadHistory} disabled={singleRecords.length === 0} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40">
                  <Download className="w-4 h-4 mr-2" /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Applied On', 'Leave Type', 'From', 'To', 'Days', 'Duration', 'Reason', 'Status', 'Source', 'Action'].map((head) =>
                    <th key={head} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {singleRecords.length === 0 &&
                  <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-500">No leave records for this filter.</td></tr>
                  }
                  {singleRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{formatDate(rec.appliedOn)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{LEAVE_LABEL[rec.leave] ?? rec.leave}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(rec.from)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(rec.to)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{rec.days}</td>
                      <td className="px-4 py-3 text-gray-600">{DURATION_OPTIONS.find((opt) => opt.value === rec.duration)?.label}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={rec.reason}>{rec.reason}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLE[rec.status]}`}>{rec.status}</span></td>
                      <td className="px-4 py-3 text-gray-500">{rec.source}</td>
                      <td className="px-4 py-3">
                        {rec.status === 'Pending' ?
                        <button type="button" onClick={() => withdraw(rec)} className="text-xs font-medium text-red-600 hover:underline">Withdraw</button> :
                        <span className="text-xs text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <Modal
        isOpen={singleOpen}
        onClose={() => setSingleOpen(false)}
        title={`New Leave Request — ${singleEmp.name}`}
        size="lg"
        footer={
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">{singleDays} working day(s)</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSingleOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={submitSingle} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">Submit Request</button>
            </div>
          </div>}>
        <div className="space-y-4">
          {singleErrors.length > 0 &&
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              {singleErrors.map((message) => <p key={message} className="text-xs text-red-700">• {message}</p>)}
            </div>
          }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Leave Type *" options={[{ value: '', label: 'Select Leave Type' }, ...LEAVE_OPTIONS]} value={singleForm.leave} onChange={(e) => setSingleForm({ ...singleForm, leave: e.target.value as LeaveCode | '' })} />
            <Select label="Duration" options={DURATION_OPTIONS} value={singleForm.duration} onChange={(e) => setSingleForm({ ...singleForm, duration: e.target.value as Duration })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From *</label>
              <input type="date" value={singleForm.from} onChange={(e) => setSingleForm({ ...singleForm, from: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
              <input type="date" value={singleForm.to} onChange={(e) => setSingleForm({ ...singleForm, to: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <textarea rows={3} value={singleForm.reason} onChange={(e) => setSingleForm({ ...singleForm, reason: e.target.value })} placeholder="Describe the reason for leave" className={inputClass} />
            <p className="text-xs text-gray-500 mt-1">{singleForm.reason.trim().length}/{MIN_REASON} minimum characters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact number (optional)</label>
              <input type="text" value={singleForm.contact} onChange={(e) => setSingleForm({ ...singleForm, contact: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting document (optional)</label>
              <label className="inline-flex w-full cursor-pointer items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                <span className="truncate">{singleForm.attachment || 'Choose PDF, JPG or PNG'}</span>
                <input type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(e) => setSingleForm({ ...singleForm, attachment: e.target.files?.[0]?.name ?? '' })} />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}
