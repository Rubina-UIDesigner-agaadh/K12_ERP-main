import React, { useMemo, useState } from 'react';
import { Download, Plus, Repeat, Trash2 } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  DEFAULT_DUTY_ASSIGNMENTS,
  DEFAULT_DUTY_TYPES,
  DUTY_ASSIGNMENTS_STORAGE_KEY,
  DUTY_TYPES_STORAGE_KEY,
  TEACHER_STAFF,
  DutyAssignmentRecord,
  DutyTypeRecord,
  createTeacherRecordId,
  downloadTeacherCsv,
  loadTeacherCollection,
  saveTeacherCollection,
} from './teacherData';

// ─── Shared Styles ─────────────────────────────────────────────────────────────
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

// ─── Constants ─────────────────────────────────────────────────────────────────
const WEEK_DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

type AssignMode = 'All Teachers → All Duties' | 'Rotate Teachers Across Duties' | 'Auto-assign';
type BulkStep = 'configure' | 'preview';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_OPTIONS = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' },
  { value: 4, label: 'Fourth' },
  { value: 5, label: 'Last' },
];
const RECURRENCE_TYPES = [
  { value: 'daily', label: 'Daily', description: 'Repeats every day or specific weekdays' },
  { value: 'weekly', label: 'Weekly', description: 'Repeats on selected days every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Repeats every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Repeats on specific day of month' },
  { value: 'yearly', label: 'Yearly', description: 'Repeats on specific date each year' },
  { value: 'custom', label: 'Custom', description: 'Custom interval pattern' },
];
const RECURRING_STORAGE_KEY = 'k12-recurring-activities-extra-v1';
type RecurringDraft = {
  name: string;
  description: string;
  type: string;
  location: string;
  assignmentType: string;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  recurrenceType: string;
  weekDays: number[];
  monthDay: number;
  monthWeek: number;
  monthWeekDay: number;
  yearMonth: number;
  yearDay: number;
  customPattern: string;
  interval: number;
  startDate: string;
  endDate: string;
  notes: string;
};
const emptyRecurringDraft = (): RecurringDraft => ({
  name: '',
  description: '',
  type: 'duty',
  location: '',
  assignmentType: 'individual',
  startTime: '09:00',
  endTime: '10:00',
  priority: 'medium',
  recurrenceType: 'weekly',
  weekDays: [1, 2, 3, 4, 5],
  monthDay: 0,
  monthWeek: 0,
  monthWeekDay: 1,
  yearMonth: 0,
  yearDay: 1,
  customPattern: '',
  interval: 1,
  startDate: '',
  endDate: '',
  notes: '',
});
const toTimeInput = (value: string) => {
  if (!value) return '09:00';
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '09:00';
  let hour = Number(match[1]);
  const minute = match[2];
  const mer = (match[3] || '').toUpperCase();
  if (mer === 'PM' && hour < 12) hour += 12;
  if (mer === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}`;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const dateStep = (date: string, days: number): string => {
  const [y = '1970', m = '1', d = '1'] = date.split('-');
  const dt = new Date(Number(y), Number(m) - 1, Number(d) + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};

const dateShort = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

const buildDateRange = (from: string, to: string, allowedWeekDays: number[]): string[] => {
  const dates: string[] = [];
  let cursor = from;
  let guard = 0;
  while (cursor <= to && guard < 366) {
    const dow = new Date(`${cursor}T00:00:00`).getDay();
    if (allowedWeekDays.includes(dow)) dates.push(cursor);
    cursor = dateStep(cursor, 1);
    guard += 1;
  }
  return dates;
};

// ─── Preview Row ──────────────────────────────────────────────────────────────
type PreviewRow = {
  id: string;
  date: string;
  duty: DutyTypeRecord;
  teachers: string[];
  removed: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function BulkDutyAssign() {
  // ── persisted state ──
  const [assignments, setAssignments] = useState<DutyAssignmentRecord[]>(() =>
    loadTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, DEFAULT_DUTY_ASSIGNMENTS),
  );
  const [duties] = useState<DutyTypeRecord[]>(() =>
    loadTeacherCollection(DUTY_TYPES_STORAGE_KEY, DEFAULT_DUTY_TYPES),
  );

  // ── form config ──
  const [fromDate, setFromDate] = useState('2025-11-24');
  const [toDate, setToDate] = useState('2025-11-29');
  const [selectedDutyIds, setSelectedDutyIds] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [allowedDays, setAllowedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [assignMode, setAssignMode] = useState<AssignMode>('All Teachers → All Duties');
  const [notifyTeachers, setNotifyTeachers] = useState(true);
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['In-App', 'Email']);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // ── step / ui state ──
  const [step, setStep] = useState<BulkStep>('configure');
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [recurringDraft, setRecurringDraft] = useState<RecurringDraft>(emptyRecurringDraft);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const persist = (next: DutyAssignmentRecord[]) => {
    setAssignments(next);
    saveTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, next);
  };

  const flash = (msg: string, ms = 4000) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(''), ms);
  };

  const openRecurringFromBulk = () => {
    const selectedDuties = duties.filter((d) => selectedDutyIds.includes(d.id));
    if (selectedDuties.length === 0) {
      flash('Select at least one duty type before converting to recurring.');
      return;
    }
    const duty = selectedDuties[0];
    setRecurringDraft({
      name: selectedDuties.length === 1 ? duty.name : `${selectedDuties.length} selected duties`,
      description: specialInstructions,
      type: 'duty',
      location: duty.defaultLocation,
      assignmentType: 'individual',
      startTime: toTimeInput(duty.startTime),
      endTime: duty.endTime ? toTimeInput(duty.endTime) : '10:00',
      priority: 'medium',
      recurrenceType: 'weekly',
      weekDays: allowedDays.length ? allowedDays : [1, 2, 3, 4, 5],
      monthDay: 0,
      monthWeek: 0,
      monthWeekDay: 1,
      yearMonth: 0,
      yearDay: 1,
      customPattern: '',
      interval: 1,
      startDate: fromDate,
      endDate: toDate,
      notes: specialInstructions,
    });
    setRecurringOpen(true);
  };

  const saveRecurringFromBulk = () => {
    if (!recurringDraft.name.trim() || !recurringDraft.startTime || !recurringDraft.startDate) {
      flash('Name, start time, and start date are required for a recurring activity.');
      return;
    }
    const selectedDuties = duties.filter((d) => selectedDutyIds.includes(d.id));
    const sources = selectedDuties.length ? selectedDuties : [undefined];
    const records = sources.map((duty) => ({
      id: createTeacherRecordId('ra'),
      name: (selectedDuties.length <= 1 ? recurringDraft.name.trim() : duty?.name) || recurringDraft.name.trim(),
      description: recurringDraft.description,
      type: recurringDraft.type,
      location: duty?.defaultLocation || recurringDraft.location,
      startTime: recurringDraft.startTime,
      endTime: recurringDraft.endTime,
      recurrenceType: recurringDraft.recurrenceType,
      weekDays: recurringDraft.weekDays,
      monthDay: recurringDraft.monthDay,
      monthWeek: recurringDraft.monthWeek,
      monthWeekDay: recurringDraft.monthWeekDay,
      yearMonth: recurringDraft.yearMonth,
      yearDay: recurringDraft.yearDay,
      customPattern: recurringDraft.customPattern,
      interval: Number(recurringDraft.interval) || 1,
      startDate: recurringDraft.startDate,
      endDate: recurringDraft.endDate,
      assignmentType: recurringDraft.assignmentType,
      assignedTeacherIds: selectedTeachers,
      rotatingTeacherIds: [],
      currentRotationIndex: 0,
      departmentId: '',
      status: 'active',
      priority: recurringDraft.priority,
      reminderMinutes: [15],
      notes: recurringDraft.notes,
      createdBy: 'Bulk Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skipDates: [],
      totalOccurrences: 0,
      completedOccurrences: 0,
    }));
    try {
      const existing = JSON.parse(localStorage.getItem(RECURRING_STORAGE_KEY) || '[]');
      localStorage.setItem(
        RECURRING_STORAGE_KEY,
        JSON.stringify(Array.isArray(existing) ? [...records, ...existing] : records),
      );
    } catch {
      localStorage.setItem(RECURRING_STORAGE_KEY, JSON.stringify(records));
    }
    setRecurringOpen(false);
    flash(
      records.length === 1
        ? `“${records[0].name}” saved as a recurring activity.`
        : `${records.length} duty types saved as recurring activities.`,
    );
  };

  // ─── Toggle helpers ────────────────────────────────────────────────────────
  const toggleDuty = (id: string) =>
    setSelectedDutyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleTeacher = (name: string) =>
    setSelectedTeachers((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );

  const toggleDay = (dow: number) =>
    setAllowedDays((prev) =>
      prev.includes(dow) ? prev.filter((x) => x !== dow) : [...prev, dow].sort((a, b) => a - b),
    );

  const toggleChannel = (ch: string) =>
    setNotificationChannels((prev) =>
      prev.includes(ch) ? prev.filter((x) => x !== ch) : [...prev, ch],
    );

  // ─── Auto-assign logic (mirrors DutyRoster) ────────────────────────────────
  const selectAutoTeachers = (
    duty: DutyTypeRecord,
    date: string,
    existing: DutyAssignmentRecord[],
  ): string[] => {
    const candidates = TEACHER_STAFF.filter(
      (t) =>
        duty.eligibleAllTeachingStaff ||
        t.designation.toLowerCase().includes(duty.specificDesignation.toLowerCase()),
    );
    const nonLeadership = candidates.filter(
      (t) => !['principal', 'hod'].some((term) => t.designation.toLowerCase().includes(term)),
    );
    const pool = nonLeadership.length >= duty.teachersPerDuty ? nonLeadership : candidates;

    const priorAssignments = existing.filter((a) => a.date < date);
    const countFor = (name: string) =>
      priorAssignments.filter((a) => a.teachers.includes(name)).length;
    const lastDateFor = (name: string) => {
      const dates = priorAssignments
        .filter((a) => a.teachers.includes(name))
        .map((a) => a.date)
        .sort();
      return dates[dates.length - 1] || '';
    };

    const eligible = pool
      .filter((t) => {
        if (existing.some((a) => a.date === date && a.teachers.includes(t.name))) return false;
        const prev = lastDateFor(t.name);
        if (!prev) return true;
        const gap = Math.round(
          (new Date(`${date}T00:00:00`).getTime() - new Date(`${prev}T00:00:00`).getTime()) /
            86400000,
        );
        return gap >= (duty.minimumGapDays || 0);
      })
      .sort((a, b) => countFor(a.name) - countFor(b.name) || a.name.localeCompare(b.name));

    return eligible.slice(0, duty.teachersPerDuty).map((t) => t.name);
  };

  // ─── Build Preview ─────────────────────────────────────────────────────────
  const buildPreview = () => {
    if (selectedDutyIds.length === 0) {
      flash('Select at least one duty type before previewing.');
      return;
    }
    if (assignMode !== 'Auto-assign' && selectedTeachers.length === 0) {
      flash('Select at least one teacher or use Auto-assign mode.');
      return;
    }
    if (!fromDate || !toDate || fromDate > toDate) {
      flash('Enter a valid date range.');
      return;
    }
    if (allowedDays.length === 0) {
      flash('Select at least one day of the week.');
      return;
    }

    const dates = buildDateRange(fromDate, toDate, allowedDays);
    if (dates.length === 0) {
      flash('No dates fall on the selected weekdays within the date range.');
      return;
    }

    const selectedDuties = duties.filter(
      (d) => selectedDutyIds.includes(d.id) && d.status === 'Active',
    );
    const rows: PreviewRow[] = [];
    const running = [...assignments]; // grows as we build, for auto-assign context

    dates.forEach((date) => {
      selectedDuties.forEach((duty, dutyIndex) => {
        let teachers: string[] = [];

        if (assignMode === 'Auto-assign') {
          teachers = selectAutoTeachers(duty, date, running);
        } else if (assignMode === 'All Teachers → All Duties') {
          teachers = selectedTeachers;
        } else {
          // Rotate Teachers Across Duties
          if (selectedTeachers.length === 0) return;
          const perDuty = duty.teachersPerDuty || 1;
          const totalTeachers = selectedTeachers.length;
          const offset = (dutyIndex * perDuty) % totalTeachers;
          teachers = Array.from(
            { length: perDuty },
            (_, i) => selectedTeachers[(offset + i) % totalTeachers],
          );
        }

        const row: PreviewRow = {
          id: createTeacherRecordId('bulk'),
          date,
          duty,
          teachers,
          removed: false,
        };
        rows.push(row);

        // push into running list so auto-assign can see it
        running.push({
          id: row.id,
          dutyTypeId: duty.id,
          dutyTypeName: duty.name,
          date,
          startTime: duty.startTime,
          endTime: duty.endTime,
          location: duty.defaultLocation,
          teachers,
          status: 'Scheduled',
          substituteTeacher: '',
          specialInstructions,
          notifyTeachers,
          notificationChannels,
          notified: false,
        });
      });
    });

    setPreviewRows(rows);
    setStep('preview');
  };

  // ─── Remove row from preview ───────────────────────────────────────────────
  const removePreviewRow = (id: string) =>
    setPreviewRows((prev) => prev.map((r) => (r.id === id ? { ...r, removed: true } : r)));

  const restorePreviewRow = (id: string) =>
    setPreviewRows((prev) => prev.map((r) => (r.id === id ? { ...r, removed: false } : r)));

  // ─── Edit teachers inline in preview ──────────────────────────────────────
  const togglePreviewTeacher = (rowId: string, name: string) =>
    setPreviewRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              teachers: r.teachers.includes(name)
                ? r.teachers.filter((t) => t !== name)
                : [...r.teachers, name],
            }
          : r,
      ),
    );

  // ─── Save all ──────────────────────────────────────────────────────────────
  const saveAll = (notify: boolean) => {
    const toSave = previewRows.filter((r) => !r.removed);
    if (toSave.length === 0) {
      flash('Nothing to save — all rows have been removed.');
      return;
    }

    setSaving(true);
    const newRecords: DutyAssignmentRecord[] = toSave.map((r) => ({
      id: r.id,
      dutyTypeId: r.duty.id,
      dutyTypeName: r.duty.name,
      date: r.date,
      startTime: r.duty.startTime,
      endTime: r.duty.endTime,
      location: r.duty.defaultLocation,
      teachers: r.teachers,
      status: 'Scheduled',
      substituteTeacher: '',
      specialInstructions,
      notifyTeachers: notify,
      notificationChannels,
      notified: notify,
    }));

    persist([...newRecords, ...assignments]);
    setSaving(false);
    setStep('configure');
    setPreviewRows([]);
    flash(
      notify
        ? `${newRecords.length} duty assignment(s) saved and teachers notified.`
        : `${newRecords.length} duty assignment(s) saved successfully.`,
    );
  };

  // ─── Export preview ────────────────────────────────────────────────────────
  const exportPreview = () =>
    downloadTeacherCsv(
      'bulk-duty-assignments.csv',
      previewRows
        .filter((r) => !r.removed)
        .map((r) => ({
          Date: r.date,
          Duty: r.duty.name,
          Time: `${r.duty.startTime}–${r.duty.endTime}`,
          Location: r.duty.defaultLocation,
          Teachers: r.teachers.join('; '),
          Status: 'Scheduled',
        })),
    );

  // ─── Derived counts ────────────────────────────────────────────────────────
  const activeRows = useMemo(() => previewRows.filter((r) => !r.removed), [previewRows]);
  const removedCount = useMemo(() => previewRows.filter((r) => r.removed).length, [previewRows]);
  const unassignedCount = useMemo(
    () => activeRows.filter((r) => r.teachers.length === 0).length,
    [activeRows],
  );

  const activeDuties = duties.filter((d) => d.status === 'Active');

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Teacher Duties Section
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Bulk Duty Assignment</h1>
          <p className="mt-1 text-sm text-slate-500">
            Assign multiple duty types to multiple teachers across a date range in one action.
          </p>
        </div>

        {step === 'configure' && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" leftIcon={<Repeat className="h-4 w-4" />} onClick={openRecurringFromBulk}>
              Convert to Recurring
            </Button>
          </div>
        )}
        {step === 'preview' && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStep('configure')}>
              ← Back to Configure
            </Button>
            <Button variant="outline" leftIcon={<Repeat className="h-4 w-4" />} onClick={openRecurringFromBulk}>
              Convert to Recurring
            </Button>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportPreview}>
              Export Preview
            </Button>
            <Button variant="outline" onClick={() => saveAll(false)}>
              Save Assignments
            </Button>
            <Button onClick={() => saveAll(true)}>Save &amp; Notify Teachers</Button>
          </div>
        )}
      </div>

      {/* ── Flash Message ── */}
      {message && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">
          {message}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — CONFIGURE
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 'configure' && (
        <div className="space-y-5">
          {/* ── Date Range & Days ── */}
          <Card title="Step 1 · Date Range & Days">
            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className={labelClass}>From Date *</span>
                <input
                  type="date"
                  className={inputClass}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>
              <label>
                <span className={labelClass}>To Date *</span>
                <input
                  type="date"
                  className={inputClass}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
              <div>
                <span className={labelClass}>
                  Estimated Dates:{' '}
                  <span className="font-bold text-indigo-700">
                    {buildDateRange(fromDate, toDate, allowedDays).length} day(s)
                  </span>
                </span>
                <div className="mt-2 flex gap-2">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`h-9 w-9 rounded-full text-xs font-semibold transition-colors ${
                        allowedDays.includes(day.value)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {day.label.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ── Duty Types ── */}
          <Card title="Step 2 · Select Duty Types">
            <p className="mb-3 text-xs text-slate-500">
              {selectedDutyIds.length === 0
                ? 'No duty types selected.'
                : `${selectedDutyIds.length} duty type(s) selected.`}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {activeDuties.map((duty) => {
                const checked = selectedDutyIds.includes(duty.id);
                return (
                  <label
                    key={duty.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      checked
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={checked}
                      onChange={() => toggleDuty(duty.id)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {duty.icon} {duty.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {duty.startTime} – {duty.endTime} · {duty.defaultLocation || 'No location'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Requires {duty.teachersPerDuty} teacher(s) · {duty.category}
                      </p>
                    </div>
                  </label>
                );
              })}
              {activeDuties.length === 0 && (
                <p className="col-span-3 text-sm text-slate-400">
                  No active duty types found. Add them in Duty Master first.
                </p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDutyIds(activeDuties.map((d) => d.id))}
              >
                Select All
              </Button>
              <Button variant="outline" onClick={() => setSelectedDutyIds([])}>
                Clear All
              </Button>
            </div>
          </Card>

          {/* ── Assignment Mode ── */}
          <Card title="Step 3 · Assignment Mode">
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  'All Teachers → All Duties',
                  'Rotate Teachers Across Duties',
                  'Auto-assign',
                ] as AssignMode[]
              ).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAssignMode(mode)}
                  className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                    assignMode === mode
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold">{mode}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {mode === 'All Teachers → All Duties' &&
                      'All selected teachers are assigned to every selected duty on each date.'}
                    {mode === 'Rotate Teachers Across Duties' &&
                      'Teachers are distributed and rotated across duty slots to spread workload.'}
                    {mode === 'Auto-assign' &&
                      'System picks teachers automatically using gap, seniority and workload rules.'}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* ── Teacher Selection ── */}
          {assignMode !== 'Auto-assign' && (
            <Card title="Step 4 · Select Teachers">
              <p className="mb-3 text-xs text-slate-500">
                {selectedTeachers.length === 0
                  ? 'No teachers selected.'
                  : `${selectedTeachers.length} teacher(s) selected.`}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {TEACHER_STAFF.map((teacher) => {
                  const checked = selectedTeachers.includes(teacher.name);
                  return (
                    <label
                      key={teacher.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs transition-colors ${
                        checked
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-indigo-100 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTeacher(teacher.name)}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{teacher.name}</p>
                        <p className="text-slate-400">{teacher.designation}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTeachers(TEACHER_STAFF.map((t) => t.name))}
                >
                  Select All
                </Button>
                <Button variant="outline" onClick={() => setSelectedTeachers([])}>
                  Clear All
                </Button>
              </div>
            </Card>
          )}

          {/* ── Options ── */}
          <Card title={assignMode !== 'Auto-assign' ? 'Step 5 · Options' : 'Step 4 · Options'}>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className={labelClass}>Special Instructions (applied to all)</span>
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={specialInstructions}
                  placeholder="Any instructions for the bulk assigned duties..."
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={notifyTeachers}
                    onChange={(e) => setNotifyTeachers(e.target.checked)}
                  />
                  <span className="font-medium text-slate-700">Notify teachers of assignment</span>
                </label>
                {notifyTeachers && (
                  <div className="flex flex-wrap gap-3 pl-5">
                    {['In-App', 'Email', 'SMS'].map((ch) => (
                      <label key={ch} className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={notificationChannels.includes(ch)}
                          onChange={() => toggleChannel(ch)}
                        />
                        {ch}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* ── CTA ── */}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" leftIcon={<Repeat className="h-4 w-4" />} onClick={openRecurringFromBulk}>
              Convert to Recurring
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={buildPreview}>
              Generate Preview →
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 'preview' && (
        <div className="space-y-5">
          {/* ── Summary Cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-2xl font-bold text-indigo-700">{activeRows.length}</p>
              <p className="text-xs text-slate-500">Total Assignments</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-emerald-700">{selectedDutyIds.length}</p>
              <p className="text-xs text-slate-500">Duty Types Included</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-amber-600">{unassignedCount}</p>
              <p className="text-xs text-slate-500">Unassigned Slots</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-rose-600">{removedCount}</p>
              <p className="text-xs text-slate-500">Removed from Preview</p>
            </Card>
          </div>

          {/* ── Preview Alerts ── */}
          {unassignedCount > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              ⚠️ {unassignedCount} slot(s) have no teachers assigned — check auto-assign eligibility
              rules or select teachers manually.
            </div>
          )}

          {/* ── Preview Table ── */}
          <Card noPadding className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">
                Preview · {activeRows.length} assignment(s) ready to save
              </p>
              <p className="text-xs text-slate-500">
                You can remove rows or adjust teachers before saving. Removed rows are skipped.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="border border-slate-200 px-3 py-2">#</th>
                    <th className="border border-slate-200 px-3 py-2">Date</th>
                    <th className="border border-slate-200 px-3 py-2">Duty Type</th>
                    <th className="border border-slate-200 px-3 py-2">Time</th>
                    <th className="border border-slate-200 px-3 py-2">Location</th>
                    <th className="border border-slate-200 px-3 py-2">Assigned Teachers</th>
                    <th className="border border-slate-200 px-3 py-2">Status</th>
                    <th className="border border-slate-200 px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        row.removed
                          ? 'bg-rose-50 opacity-50 line-through'
                          : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/60'
                      }
                    >
                      <td className="border border-slate-200 px-3 py-2 text-slate-400">
                        {index + 1}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                        {dateShort(row.date)}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        <p className="font-semibold text-slate-800">
                          {row.duty.icon} {row.duty.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{row.duty.category}</p>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 whitespace-nowrap text-slate-600">
                        {row.duty.startTime} – {row.duty.endTime}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-600">
                        {row.duty.defaultLocation || '—'}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {row.removed ? (
                          <span className="text-xs text-slate-400">Removed</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {TEACHER_STAFF.map((t) => (
                              <label
                                key={t.id}
                                className={`flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
                                  row.teachers.includes(t.name)
                                    ? 'border-indigo-300 bg-indigo-100 text-indigo-800'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={row.teachers.includes(t.name)}
                                  onChange={() => togglePreviewTeacher(row.id, t.name)}
                                />
                                {t.name.split(' ')[0]}
                              </label>
                            ))}
                          </div>
                        )}
                        {!row.removed && row.teachers.length === 0 && (
                          <Badge variant="warning">Unassigned</Badge>
                        )}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {row.removed ? (
                          <Badge variant="danger">Removed</Badge>
                        ) : row.teachers.length === 0 ? (
                          <Badge variant="warning">Unassigned</Badge>
                        ) : (
                          <Badge variant="info">Scheduled</Badge>
                        )}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {row.removed ? (
                          <button
                            type="button"
                            onClick={() => restorePreviewRow(row.id)}
                            className="text-xs font-medium text-indigo-600 hover:underline"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removePreviewRow(row.id)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Remove from preview"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {previewRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-slate-200 px-4 py-12 text-center text-sm text-slate-400"
                      >
                        No assignments were generated. Adjust your configuration and try again.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                <span>
                  <Badge variant="info">Scheduled</Badge> Ready to save
                </span>
                <span>
                  <Badge variant="warning">Unassigned</Badge> No teacher selected
                </span>
                <span>
                  <Badge variant="danger">Removed</Badge> Skipped on save
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => saveAll(false)} disabled={saving}>
                  Save Assignments
                </Button>
                <Button onClick={() => saveAll(true)} disabled={saving}>
                  Save &amp; Notify Teachers
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Modal
        isOpen={recurringOpen}
        onClose={() => setRecurringOpen(false)}
        title="Convert to Recurring Activity"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRecurringOpen(false)}>Cancel</Button>
            <Button onClick={saveRecurringFromBulk}>Save Recurring Activity</Button>
          </div>
        }
      >
        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          <label>
            <span className={labelClass}>Activity Name *</span>
            <input className={inputClass} value={recurringDraft.name} onChange={(event) => setRecurringDraft((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label>
              <span className={labelClass}>Start Time *</span>
              <input type="time" className={inputClass} value={recurringDraft.startTime} onChange={(event) => setRecurringDraft((current) => ({ ...current, startTime: event.target.value }))} />
            </label>
            <label>
              <span className={labelClass}>End Time</span>
              <input type="time" className={inputClass} value={recurringDraft.endTime} onChange={(event) => setRecurringDraft((current) => ({ ...current, endTime: event.target.value }))} />
            </label>
            <label>
              <span className={labelClass}>Priority</span>
              <select className={inputClass} value={recurringDraft.priority} onChange={(event) => setRecurringDraft((current) => ({ ...current, priority: event.target.value as RecurringDraft['priority'] }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-700"><Repeat className="h-4 w-4" /> Recurrence Pattern</h4>
            <div className="space-y-4">
              <label>
                <span className={labelClass}>Frequency</span>
                <select className={inputClass} value={recurringDraft.recurrenceType} onChange={(event) => setRecurringDraft((current) => ({ ...current, recurrenceType: event.target.value }))}>
                  {RECURRENCE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label} - {item.description}</option>
                  ))}
                </select>
              </label>
              {['daily', 'weekly', 'biweekly'].includes(recurringDraft.recurrenceType) && (
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Days of Week</span>
                  <div className="flex gap-2">
                    {DAYS.map((day, index) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setRecurringDraft((current) => ({
                          ...current,
                          weekDays: current.weekDays.includes(index)
                            ? current.weekDays.filter((item) => item !== index)
                            : [...current.weekDays, index].sort((a, b) => a - b),
                        }))}
                        className={`h-10 w-10 rounded-full text-sm font-medium ${recurringDraft.weekDays.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {day.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {recurringDraft.recurrenceType === 'monthly' && (
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>Day of Month</span>
                    <select className={inputClass} value={recurringDraft.monthDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthDay: Number(event.target.value) }))}>
                      <option value={0}>Select day</option>
                      {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                    </select>
                  </label>
                  <div>
                    <span className="mb-1 block text-sm font-medium text-slate-700">Or Week of Month</span>
                    <div className="flex gap-2">
                      <select className={inputClass} value={recurringDraft.monthWeek} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthWeek: Number(event.target.value) }))}>
                        <option value={0}>Select week</option>
                        {WEEK_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                      <select className={inputClass} value={recurringDraft.monthWeekDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthWeekDay: Number(event.target.value) }))}>
                        <option value={0}>Select day</option>
                        {DAYS.map((day, index) => <option key={day} value={index}>{day}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {recurringDraft.recurrenceType === 'yearly' && (
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>Month</span>
                    <select className={inputClass} value={recurringDraft.yearMonth} onChange={(event) => setRecurringDraft((current) => ({ ...current, yearMonth: Number(event.target.value) }))}>
                      {MONTHS.map((month, index) => <option key={month} value={index}>{month}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>Day</span>
                    <select className={inputClass} value={recurringDraft.yearDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, yearDay: Number(event.target.value) }))}>
                      {Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                    </select>
                  </label>
                </div>
              )}
              {recurringDraft.recurrenceType === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>Interval</span>
                    <input type="number" min={1} className={inputClass} value={recurringDraft.interval} onChange={(event) => setRecurringDraft((current) => ({ ...current, interval: Number(event.target.value) || 1 }))} />
                  </label>
                  <label>
                    <span className={labelClass}>Custom Pattern</span>
                    <input className={inputClass} value={recurringDraft.customPattern} onChange={(event) => setRecurringDraft((current) => ({ ...current, customPattern: event.target.value }))} placeholder="Every 3 weeks on Monday" />
                  </label>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className={labelClass}>Start Date *</span>
                  <input type="date" className={inputClass} value={recurringDraft.startDate} onChange={(event) => setRecurringDraft((current) => ({ ...current, startDate: event.target.value }))} />
                </label>
                <label>
                  <span className={labelClass}>End Date (Optional)</span>
                  <input type="date" className={inputClass} value={recurringDraft.endDate} onChange={(event) => setRecurringDraft((current) => ({ ...current, endDate: event.target.value }))} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { BulkDutyAssign as BulkPlanning };
