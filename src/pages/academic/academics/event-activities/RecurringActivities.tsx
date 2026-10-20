import React, { useMemo, useState } from 'react';
import { Download, Pencil, Repeat, Trash2 } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { TEACHER_STAFF, downloadTeacherCsv } from './teacherData';

const STORAGE_KEY = 'k12-recurring-activities-extra-v1';
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
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
const ACTIVITY_TYPES = [
  { value: 'duty', label: 'Special Duty' },
  { value: 'assembly', label: 'Assembly Duty' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'supervision', label: 'Supervision' },
  { value: 'training', label: 'Training' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

type RecurringPriority = 'low' | 'medium' | 'high';
type RecurringDraft = {
  name: string;
  description: string;
  type: string;
  location: string;
  assignmentType: string;
  startTime: string;
  endTime: string;
  priority: RecurringPriority;
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

type RecurringActivityRecord = RecurringDraft & {
  id: string;
  assignedTeacherIds: string[];
  rotatingTeacherIds: string[];
  currentRotationIndex: number;
  departmentId: string;
  status: string;
  reminderMinutes: number[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  skipDates: string[];
  totalOccurrences: number;
  completedOccurrences: number;
};

const emptyDraft = (): RecurringDraft => ({
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

const mockRecurring = (
  id: string,
  patch: Partial<RecurringActivityRecord> & Pick<RecurringActivityRecord, 'name'>,
): RecurringActivityRecord => ({
  description: '',
  type: 'duty',
  location: '',
  assignmentType: 'individual',
  startTime: '07:00',
  endTime: '08:00',
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
  startDate: '2025-11-24',
  endDate: '2026-03-31',
  notes: '',
  assignedTeacherIds: [],
  rotatingTeacherIds: [],
  currentRotationIndex: 0,
  departmentId: '',
  status: 'active',
  reminderMinutes: [15],
  createdBy: 'Sample',
  createdAt: '2025-11-20T08:00:00.000Z',
  updatedAt: '2025-11-20T08:00:00.000Z',
  skipDates: [],
  totalOccurrences: 0,
  completedOccurrences: 0,
  ...patch,
  id,
});

const DEFAULT_RECURRING_ACTIVITIES: RecurringActivityRecord[] = [
  mockRecurring('ra-mock-gate', {
    name: 'Gate Duty (Morning)',
    type: 'duty',
    location: 'Main Gate',
    startTime: '07:00',
    endTime: '08:15',
    recurrenceType: 'weekly',
    weekDays: [1, 2, 3, 4, 5, 6],
    assignedTeacherIds: ['Mr. R. Kumar', 'Ms. P. Roy'],
    priority: 'high',
    status: 'active',
    notes: 'Two teachers at the main gate before assembly.',
  }),
  mockRecurring('ra-mock-assembly', {
    name: 'Assembly Duty',
    type: 'assembly',
    location: 'Assembly Ground',
    startTime: '07:30',
    endTime: '07:50',
    recurrenceType: 'daily',
    weekDays: [1, 2, 3, 4, 5],
    assignedTeacherIds: ['Mrs. P. Gupta'],
    priority: 'medium',
    status: 'active',
  }),
  mockRecurring('ra-mock-lunch', {
    name: 'Lunch / Canteen Supervision',
    type: 'supervision',
    location: 'Canteen',
    startTime: '12:30',
    endTime: '13:00',
    recurrenceType: 'weekly',
    weekDays: [1, 2, 3, 4, 5],
    assignedTeacherIds: ['Mr. J. Khan'],
    priority: 'medium',
    status: 'paused',
    notes: 'Paused during exam week.',
  }),
  mockRecurring('ra-mock-library', {
    name: 'Library Supervision',
    type: 'duty',
    location: 'Library',
    startTime: '13:00',
    endTime: '14:30',
    recurrenceType: 'weekly',
    weekDays: [2, 4],
    assignedTeacherIds: ['Mrs. K. Singh'],
    priority: 'low',
    status: 'active',
  }),
  mockRecurring('ra-mock-meeting', {
    name: 'Weekly Staff Academic Meeting',
    type: 'meeting',
    location: 'Staff Room',
    startTime: '15:00',
    endTime: '16:00',
    recurrenceType: 'weekly',
    weekDays: [5],
    assignedTeacherIds: ['Mr. A. Sharma', 'Mr. V. Patel'],
    priority: 'high',
    status: 'active',
  }),
  mockRecurring('ra-mock-ptm', {
    name: 'First Saturday PTM Duty',
    type: 'event',
    location: 'Classrooms',
    startTime: '09:00',
    endTime: '12:00',
    recurrenceType: 'monthly',
    weekDays: [6],
    monthWeek: 1,
    monthWeekDay: 6,
    assignedTeacherIds: ['Ms. M. Verma', 'Mrs. S. Joshi'],
    priority: 'medium',
    status: 'active',
  }),
  mockRecurring('ra-mock-bus', {
    name: 'Bus Duty (Afternoon)',
    type: 'duty',
    location: 'Bus Bay',
    startTime: '14:30',
    endTime: '15:30',
    recurrenceType: 'weekly',
    weekDays: [1, 2, 3, 4, 5],
    assignedTeacherIds: ['Mr. H. Nair'],
    priority: 'high',
    status: 'active',
  }),
];

const loadRecurring = (): RecurringActivityRecord[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(raw) && raw.length > 0) return raw;
  } catch {
    /* use sample data */
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECURRING_ACTIVITIES));
  } catch {
    /* ignore */
  }
  return DEFAULT_RECURRING_ACTIVITIES;
};

const teacherLabel = (value: string) =>
  TEACHER_STAFF.find((teacher) => teacher.id === value || teacher.name === value)?.name || value;

const typeLabel = (value: string) =>
  ACTIVITY_TYPES.find((item) => item.value === value)?.label || value || '—';

const recurrenceLabel = (value: string) =>
  RECURRENCE_TYPES.find((item) => item.value === value)?.label || value || '—';

const weekDaysLabel = (days: number[] | undefined) => {
  if (!Array.isArray(days) || days.length === 0) return '—';
  return days.map((day) => DAYS[day] || String(day)).join(', ');
};

const priorityVariant = (priority: string) =>
  priority === 'high' ? 'danger' : priority === 'low' ? 'info' : 'warning';

const statusVariant = (status: string) =>
  status === 'active' ? 'success' : status === 'paused' ? 'warning' : status === 'completed' ? 'info' : 'danger';

export function RecurringActivities() {
  const [activities, setActivities] = useState<RecurringActivityRecord[]>(() => loadRecurring());
  const [typeFilter, setTypeFilter] = useState('All');
  const [recurrenceFilter, setRecurrenceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recurringDraft, setRecurringDraft] = useState<RecurringDraft>(emptyDraft);
  const [assignedTeachers, setAssignedTeachers] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const persist = (next: RecurringActivityRecord[]) => {
    setActivities(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const flash = (msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(''), 4000);
  };

  const filtered = useMemo(
    () =>
      activities.filter((activity) => {
        if (typeFilter !== 'All' && activity.type !== typeFilter) return false;
        if (recurrenceFilter !== 'All' && activity.recurrenceType !== recurrenceFilter) return false;
        if (statusFilter !== 'All' && activity.status !== statusFilter) return false;
        return true;
      }),
    [activities, typeFilter, recurrenceFilter, statusFilter],
  );

  const openEdit = (record: RecurringActivityRecord) => {
    setEditingId(record.id);
    setRecurringDraft({
      name: record.name || '',
      description: record.description || '',
      type: record.type || 'duty',
      location: record.location || '',
      assignmentType: record.assignmentType || 'individual',
      startTime: record.startTime || '09:00',
      endTime: record.endTime || '10:00',
      priority: (record.priority as RecurringPriority) || 'medium',
      recurrenceType: record.recurrenceType || 'weekly',
      weekDays: Array.isArray(record.weekDays) ? record.weekDays : [1, 2, 3, 4, 5],
      monthDay: Number(record.monthDay) || 0,
      monthWeek: Number(record.monthWeek) || 0,
      monthWeekDay: Number(record.monthWeekDay) || 1,
      yearMonth: Number(record.yearMonth) || 0,
      yearDay: Number(record.yearDay) || 1,
      customPattern: record.customPattern || '',
      interval: Number(record.interval) || 1,
      startDate: record.startDate || '',
      endDate: record.endDate || '',
      notes: record.notes || '',
    });
    setAssignedTeachers(
      (Array.isArray(record.assignedTeacherIds) ? record.assignedTeacherIds : []).map(teacherLabel),
    );
    setRecurringOpen(true);
  };

  const saveRecurring = () => {
    if (!recurringDraft.name.trim() || !recurringDraft.startTime || !recurringDraft.startDate) {
      flash('Name, start time, and start date are required for a recurring activity.');
      return;
    }
    if (!editingId) return;
    const next = activities.map((activity) =>
      activity.id === editingId
        ? {
            ...activity,
            name: recurringDraft.name.trim(),
            description: recurringDraft.description,
            type: recurringDraft.type,
            location: recurringDraft.location,
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
            assignedTeacherIds: assignedTeachers,
            priority: recurringDraft.priority,
            notes: recurringDraft.notes,
            updatedAt: new Date().toISOString(),
          }
        : activity,
    );
    persist(next);
    setRecurringOpen(false);
    setEditingId(null);
    flash(`“${recurringDraft.name.trim()}” updated.`);
  };

  const toggleStatus = (id: string) => {
    const next = activities.map((activity) => {
      if (activity.id !== id) return activity;
      const status = activity.status === 'active' ? 'paused' : 'active';
      return { ...activity, status, updatedAt: new Date().toISOString() };
    });
    persist(next);
    const updated = next.find((activity) => activity.id === id);
    flash(updated?.status === 'paused' ? 'Activity paused.' : 'Activity resumed.');
  };

  const deleteActivity = (id: string) => {
    const record = activities.find((activity) => activity.id === id);
    if (!record) return;
    if (!window.confirm(`Delete “${record.name}”? This cannot be undone.`)) return;
    persist(activities.filter((activity) => activity.id !== id));
    flash(`“${record.name}” deleted.`);
  };

  const exportCsv = () =>
    downloadTeacherCsv(
      'recurring-activities.csv',
      filtered.map((activity) => ({
        Name: activity.name,
        Type: typeLabel(activity.type),
        'Recurrence Pattern': recurrenceLabel(activity.recurrenceType),
        'Days of Week': weekDaysLabel(activity.weekDays),
        'Start Date': activity.startDate || '',
        'End Date': activity.endDate || '',
        'Assigned Teachers': (activity.assignedTeacherIds || []).map(teacherLabel).join('; '),
        Priority: activity.priority || '',
        Status: activity.status || '',
      })),
    );

  const toggleTeacher = (name: string) =>
    setAssignedTeachers((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );

  const teacherIsAssigned = (teacherName: string) => assignedTeachers.includes(teacherName);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Recurring Activities Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Activities converted from Duty Roster. Edit the recurrence, pause or resume, and export the list.
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {message && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>
      )}

      <Card title="Filters">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className={labelClass}>Type</span>
            <select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="All">All types</option>
              {ACTIVITY_TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Recurrence Type</span>
            <select className={inputClass} value={recurrenceFilter} onChange={(event) => setRecurrenceFilter(event.target.value)}>
              <option value="All">All patterns</option>
              {RECURRENCE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Status</span>
            <select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-2xl font-bold text-indigo-700">{activities.length}</p>
          <p className="text-xs text-slate-500">Total activities</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-emerald-700">{activities.filter((item) => item.status === 'active').length}</p>
          <p className="text-xs text-slate-500">Active</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-amber-600">{activities.filter((item) => item.status === 'paused').length}</p>
          <p className="text-xs text-slate-500">Paused</p>
        </Card>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Recurrence Pattern</th>
                <th className="px-3 py-3">Days of Week</th>
                <th className="px-3 py-3">Start Date</th>
                <th className="px-3 py-3">End Date</th>
                <th className="px-3 py-3">Assigned Teachers</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((activity) => (
                <tr key={activity.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{activity.name}</p>
                    {activity.location ? <p className="text-[11px] text-slate-400">{activity.location}</p> : null}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{typeLabel(activity.type)}</td>
                  <td className="px-3 py-3 text-slate-600">{recurrenceLabel(activity.recurrenceType)}</td>
                  <td className="px-3 py-3 text-slate-600">{weekDaysLabel(activity.weekDays)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-600">{activity.startDate || '—'}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-600">{activity.endDate || '—'}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {(activity.assignedTeacherIds || []).length
                      ? (activity.assignedTeacherIds || []).map(teacherLabel).join(', ')
                      : '—'}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={priorityVariant(activity.priority)}>{activity.priority || 'medium'}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={statusVariant(activity.status)}>{activity.status || 'active'}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => openEdit(activity)} leftIcon={<Pencil className="h-3.5 w-3.5" />}>
                        Edit
                      </Button>
                      <Button variant="outline" onClick={() => toggleStatus(activity.id)}>
                        {activity.status === 'active' ? 'Pause' : 'Resume'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => deleteActivity(activity.id)}
                        className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-500 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">
                    No recurring activities found. Convert a duty in Duty Roster to Recurring to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={recurringOpen}
        onClose={() => setRecurringOpen(false)}
        title="Convert to Recurring Activity"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRecurringOpen(false)}>Cancel</Button>
            <Button onClick={saveRecurring}>Save Recurring Activity</Button>
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
              <select className={inputClass} value={recurringDraft.priority} onChange={(event) => setRecurringDraft((current) => ({ ...current, priority: event.target.value as RecurringPriority }))}>
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
          <div className="rounded-lg border border-slate-100 p-3">
            <p className={labelClass}>Assigned Teachers · {assignedTeachers.length} selected</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {TEACHER_STAFF.map((teacher) => (
                <label key={teacher.id} className="flex items-center gap-2 rounded border border-slate-100 px-2 py-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={teacherIsAssigned(teacher.name)}
                    onChange={() => toggleTeacher(teacher.name)}
                  />
                  {teacher.name}
                  <span className="text-slate-400">{teacher.designation}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
