import React, { useMemo, useState } from 'react';
import { Select } from '../../../components/ui/Select';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Info,
  Plus,
  Upload,
  XCircle
} from 'lucide-react';

type LeaveCode = 'CL' | 'PL' | 'SL' | 'EL' | 'CO' | 'LOP' | 'HOL' | 'OPT';
type Duration = 'full' | 'first_half' | 'second_half';
type LeaveStatus = 'Pending' | 'Approved' | 'Withdrawn';

interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  avatar: string;
  manager: string;
}

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
}

const EMPLOYEES: Employee[] = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', avatar: 'JD', manager: 'James Taylor' },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', avatar: 'JS', manager: 'Principal' },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', avatar: 'RJ', manager: 'Jennifer Martinez' },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', avatar: 'ED', manager: 'Sarah Wilson' },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', avatar: 'MB', manager: 'James Taylor' }
];

const LEAVE_OPTIONS: { value: LeaveCode; label: string }[] = [
  { value: 'CL', label: 'Casual Leave (CL)' },
  { value: 'PL', label: 'Privilege Leave (PL)' },
  { value: 'SL', label: 'Sick Leave (SL)' },
  { value: 'EL', label: 'Earned Leave (EL)' },
  { value: 'CO', label: 'Comp-Off (CO)' },
  { value: 'LOP', label: 'Loss of Pay (LOP)' },
  { value: 'HOL', label: 'Company Holiday' },
  { value: 'OPT', label: 'Optional Holiday' }
];

const LEAVE_LABEL: Record<string, string> = Object.fromEntries(LEAVE_OPTIONS.map((opt) => [opt.value, opt.label]));

const DURATION_OPTIONS = [
  { value: 'full', label: 'Full Day' },
  { value: 'first_half', label: 'First Half' },
  { value: 'second_half', label: 'Second Half' }
];

const ENTITLED: Record<LeaveCode, number> = {
  CL: 12, PL: 15, SL: 10, EL: 20, CO: 4, LOP: 0, HOL: 0, OPT: 2
};

const STATUS_STYLE: Record<LeaveStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Withdrawn: 'bg-gray-200 text-gray-700'
};

const MIN_REASON = 10;
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDate = (iso: string) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

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

const overlaps = (rec: LeaveRecord, range: { from: string; to: string }) =>
  rec.from <= range.to && rec.to >= range.from;

const SEED: LeaveRecord[] = [
  { id: 1, empId: 'EMP001', leave: 'CL', from: '2026-09-14', to: '2026-09-15', days: 2, duration: 'full', reason: 'Family function', status: 'Approved', appliedOn: '2026-09-08' },
  { id: 2, empId: 'EMP001', leave: 'SL', from: '2026-08-03', to: '2026-08-03', days: 1, duration: 'full', reason: 'Fever and doctor visit', status: 'Approved', appliedOn: '2026-08-03' },
  { id: 3, empId: 'EMP001', leave: 'CL', from: '2026-10-08', to: '2026-10-09', days: 2, duration: 'full', reason: 'Family function', status: 'Approved', appliedOn: '2026-10-02' },
  { id: 4, empId: 'EMP001', leave: 'SL', from: '2026-10-16', to: '2026-10-16', days: 1, duration: 'full', reason: 'Medical appointment', status: 'Pending', appliedOn: '2026-10-10' },
  { id: 5, empId: 'EMP002', leave: 'EL', from: '2026-10-20', to: '2026-10-22', days: 3, duration: 'full', reason: 'Pre-planned family travel', status: 'Approved', appliedOn: '2026-10-01' }
];

const emptyForm = () => ({
  leave: 'CL' as LeaveCode | '',
  from: todayIso(),
  to: todayIso(),
  duration: 'full' as Duration,
  reason: '',
  contact: '',
  attachment: '',
  notifyManager: true
});

export function ApplyLeave() {
  const [empId, setEmpId] = useState('EMP001');
  const [records, setRecords] = useState<LeaveRecord[]>(SEED);
  const [nextId, setNextId] = useState(100);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [historyMonth, setHistoryMonth] = useState(() => todayIso().slice(0, 7));
  const [historyStatus, setHistoryStatus] = useState<'all' | LeaveStatus>('all');

  const employee = EMPLOYEES.find((e) => e.id === empId) ?? EMPLOYEES[0];
  const days = countLeaveDays(form.from, form.to, form.duration);

  const balances = useMemo(() => LEAVE_OPTIONS.map((opt) => {
    const taken = records
      .filter((rec) => rec.empId === empId && rec.leave === opt.value && rec.status === 'Approved')
      .reduce((sum, rec) => sum + rec.days, 0);
    const pending = records
      .filter((rec) => rec.empId === empId && rec.leave === opt.value && rec.status === 'Pending')
      .reduce((sum, rec) => sum + rec.days, 0);
    const entitled = ENTITLED[opt.value];
    return {
      code: opt.value,
      label: opt.label,
      entitled,
      taken,
      pending,
      remaining: opt.value === 'LOP' ? null : Math.max(0, entitled - taken)
    };
  }), [records, empId]);

  const selectedBalance = balances.find((b) => b.code === form.leave);
  const yearTaken = records
    .filter((rec) => rec.empId === empId && rec.status === 'Approved')
    .reduce((sum, rec) => sum + rec.days, 0);

  const monthParts = historyMonth.split('-').map(Number);
  const monthYear = monthParts[0] || new Date().getFullYear();
  const monthIndex = (monthParts[1] || 1) - 1;
  const daysInMonth = new Date(monthYear, monthIndex + 1, 0).getDate();
  const monthStart = `${historyMonth}-01`;
  const monthEnd = `${historyMonth}-${String(daysInMonth).padStart(2, '0')}`;
  const monthLabel = new Date(monthYear, monthIndex, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const monthPad = new Date(monthYear, monthIndex, 1).getDay();

  const empRecords = records
    .filter((rec) => rec.empId === empId && (historyStatus === 'all' || rec.status === historyStatus))
    .sort((a, b) => (a.from < b.from ? 1 : -1));
  const monthRecords = empRecords.filter((rec) => rec.from <= monthEnd && rec.to >= monthStart);
  const monthTakenDays = monthRecords
    .filter((rec) => rec.status === 'Approved')
    .reduce((sum, rec) => sum + rec.days, 0);

  const leaveByDay: Record<number, { code: LeaveCode; status: LeaveStatus }[]> = {};
  monthRecords.forEach((rec) => {
    const cursor = new Date(`${rec.from}T00:00:00`);
    const end = new Date(`${rec.to}T00:00:00`);
    while (cursor <= end) {
      if (cursor.getFullYear() === monthYear && cursor.getMonth() === monthIndex) {
        const day = cursor.getDate();
        if (!leaveByDay[day]) leaveByDay[day] = [];
        leaveByDay[day].push({ code: rec.leave, status: rec.status });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  const shiftMonth = (delta: number) => {
    const next = new Date(monthYear, monthIndex + delta, 1);
    setHistoryMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
  };

  const resetForm = () => {
    setErrors([]);
    setForm(emptyForm());
  };

  const submit = () => {
    const problems: string[] = [];
    if (!form.leave) problems.push('Choose a leave type.');
    if (!form.from || !form.to) problems.push('Choose both From and To dates.');
    else if (form.to < form.from) problems.push('To date cannot be before From date.');
    else if (days === 0) problems.push('The selected range has no working days (weekends only).');
    if (form.reason.trim().length < MIN_REASON) problems.push(`Reason must be at least ${MIN_REASON} characters.`);
    if (form.contact && !/^[0-9+\-\s]{7,15}$/.test(form.contact)) problems.push('Contact number looks invalid.');
    const clash = records.find((rec) => rec.empId === empId && rec.status !== 'Withdrawn' && overlaps(rec, { from: form.from, to: form.to }));
    if (clash) problems.push(`Overlaps an existing ${LEAVE_LABEL[clash.leave] ?? clash.leave} request (${formatDate(clash.from)} – ${formatDate(clash.to)}).`);
    if (form.leave && form.leave !== 'LOP' && selectedBalance && selectedBalance.remaining !== null && days > selectedBalance.remaining) {
      problems.push(`Insufficient ${LEAVE_LABEL[form.leave]} balance. Remaining ${selectedBalance.remaining} day(s), requested ${days}.`);
    }
    setErrors(problems);
    if (problems.length) {
      setNotice({ type: 'error', text: problems[0] });
      return;
    }
    setRecords((prev) => [{
      id: nextId,
      empId,
      leave: form.leave as LeaveCode,
      from: form.from,
      to: form.to,
      days,
      duration: form.duration,
      reason: form.reason.trim(),
      status: 'Pending',
      appliedOn: todayIso()
    }, ...prev]);
    setNextId((id) => id + 1);
    setHistoryMonth(form.from.slice(0, 7));
    setHistoryStatus('all');
    resetForm();
    setNotice({
      type: 'success',
      text: `Leave request submitted for ${employee.name} (${days} day(s))${form.notifyManager ? ` and notified ${employee.manager}` : ''}.`
    });
  };

  const withdraw = (rec: LeaveRecord) => {
    setRecords((prev) => prev.map((item) => (item.id === rec.id ? { ...item, status: 'Withdrawn' as const } : item)));
    setNotice({ type: 'info', text: `Leave request for ${formatDate(rec.from)} withdrawn.` });
  };

  const exportHistory = () => {
    const rows = [
      ['Applied On', 'Leave Type', 'From', 'To', 'Days', 'Duration', 'Reason', 'Status'],
      ...empRecords.map((rec) => [rec.appliedOn, LEAVE_LABEL[rec.leave] ?? rec.leave, rec.from, rec.to, rec.days, rec.duration, rec.reason, rec.status])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leave-history-${empId}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply Leave</h1>
          <p className="text-sm text-gray-500">Submit a leave request and review how many days you have taken each month</p>
        </div>
        <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" /> New Leave Request
        </button>
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} title="Dismiss"><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Employee</p>
          <div className="flex items-center gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">{employee.avatar}</div>
            <div>
              <p className="font-semibold text-gray-900">{employee.name}</p>
              <p className="text-sm text-gray-600">{employee.id} · {employee.designation}</p>
              <p className="text-sm text-gray-500">{employee.department} · Reports to {employee.manager}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Leave balance (this year)</p>
            <p className="text-xs text-gray-500">Approved days taken: <span className="font-semibold text-teal-700">{yearTaken}</span></p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {balances.filter((b) => b.code !== 'HOL').map((b) => (
              <div key={b.code} className={`rounded-lg border p-3 ${form.leave === b.code ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-gray-50'}`}>
                <p className="text-xs text-gray-500 truncate">{b.label}</p>
                <p className="text-lg font-bold text-gray-900">{b.remaining === null ? '—' : b.remaining}<span className="text-xs font-normal text-gray-500"> / {b.entitled || '∞'}</span></p>
                <p className="text-[11px] text-gray-500">Taken {b.taken}{b.pending ? ` · Pending ${b.pending}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 pt-2 border-t border-gray-100">
        <div className="xl:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Apply for leave</h3>
            <p className="text-xs text-gray-500">Weekends are excluded from working-day count</p>
          </div>
          <div className="p-6 space-y-4">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                {errors.map((message) => <p key={message} className="text-xs text-red-700 flex items-start gap-1"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {message}</p>)}
              </div>
            )}
            <Select label="Leave Type *" options={[{ value: '', label: 'Select Leave Type' }, ...LEAVE_OPTIONS]} value={form.leave} onChange={(e) => setForm({ ...form, leave: e.target.value as LeaveCode | '' })} />
            <Select label="Duration" options={DURATION_OPTIONS} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value as Duration })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From *</label>
                <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value, to: e.target.value > form.to ? e.target.value : form.to })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4 text-teal-600" /> Working days</span>
              <span className="font-bold text-teal-700">{days} day(s)</span>
            </div>
            {selectedBalance && selectedBalance.remaining !== null && (
              <p className="text-xs text-gray-500">Remaining {LEAVE_LABEL[selectedBalance.code]}: {selectedBalance.remaining} day(s)</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Describe the reason for leave" className={inputClass} />
              <p className="text-xs text-gray-500 mt-1">{form.reason.trim().length}/{MIN_REASON} minimum characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact number (optional)</label>
              <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting document (optional)</label>
              <label className="inline-flex w-full cursor-pointer items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                <span className="truncate">{form.attachment || 'Choose PDF, JPG or PNG'}</span>
                <input type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0]?.name ?? '' })} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.notifyManager} onChange={(e) => setForm({ ...form, notifyManager: e.target.checked })} className="rounded border-gray-300" />
              Notify reporting manager ({employee.manager})
            </label>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">Pending requests can be withdrawn from the monthly history until they are approved.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Clear</button>
              <button type="button" onClick={submit} className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" /> Submit Request
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-600" /> Leave history</h3>
              <p className="text-xs text-gray-500">Monthly view of leaves taken by {employee.name}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => shiftMonth(-1)} className="px-2 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Previous month">‹</button>
              <input type="month" value={historyMonth} onChange={(e) => setHistoryMonth(e.target.value || historyMonth)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <button type="button" onClick={() => shiftMonth(1)} className="px-2 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Next month">›</button>
              <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value as 'all' | LeaveStatus)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="all">All statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
              <button type="button" onClick={exportHistory} disabled={empRecords.length === 0} className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40">
                <Download className="w-4 h-4 mr-2" /> Export
              </button>
            </div>
          </div>
          <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">{monthLabel}</p>
                <p className="text-sm text-gray-600">Leaves taken this month: <span className="font-bold text-teal-700">{monthTakenDays}</span> day(s)</p>
              </div>
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-gray-400 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: monthPad }).map((_, i) => <div key={`pad-${i}`} className="h-14 rounded-lg bg-gray-50" />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const marks = leaveByDay[day] || [];
                  const approved = marks.some((m) => m.status === 'Approved');
                  const pending = marks.some((m) => m.status === 'Pending');
                  return (
                    <div key={day} className={`h-14 rounded-lg border p-1 text-left ${approved ? 'bg-teal-50 border-teal-200' : pending ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                      <p className="text-xs font-semibold text-gray-700">{day}</p>
                      {marks[0] && <p className="text-[10px] font-medium text-teal-700 truncate">{marks[0].code}{marks.length > 1 ? ` +${marks.length - 1}` : ''}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-teal-50 border border-teal-200" /> Approved</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-50 border border-amber-200" /> Pending</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">This month by type</p>
              {LEAVE_OPTIONS.map((opt) => {
                const taken = monthRecords.filter((rec) => rec.leave === opt.value && rec.status === 'Approved').reduce((sum, rec) => sum + rec.days, 0);
                if (!taken) return null;
                return (
                  <div key={opt.value} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <span className="text-sm font-bold text-gray-900">{taken}</span>
                  </div>
                );
              })}
              {monthTakenDays === 0 && <p className="text-sm text-gray-500">No approved leave in {monthLabel}.</p>}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Applied On', 'Leave Type', 'From', 'To', 'Days', 'Duration', 'Reason', 'Status', 'Action'].map((head) =>
                    <th key={head} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {monthRecords.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500">No leave records for {monthLabel}.</td></tr>
                )}
                {monthRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{formatDate(rec.appliedOn)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{LEAVE_LABEL[rec.leave] ?? rec.leave}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(rec.from)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(rec.to)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{rec.days}</td>
                    <td className="px-4 py-3 text-gray-600">{DURATION_OPTIONS.find((opt) => opt.value === rec.duration)?.label}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={rec.reason}>{rec.reason}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLE[rec.status]}`}>{rec.status}</span></td>
                    <td className="px-4 py-3">
                      {rec.status === 'Pending'
                        ? <button type="button" onClick={() => withdraw(rec)} className="text-xs font-medium text-red-600 hover:underline">Withdraw</button>
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ApplyLeave;
