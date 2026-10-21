import React, { useMemo, useState } from 'react';
import { Download, Plus, Repeat } from 'lucide-react';
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
  saveTeacherCollection
} from './teacherData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
type AssignmentForm = DutyAssignmentRecord & { assignmentType: 'Single Assignment' | 'Recurring' | 'Full Roster'; repeatUntil: string; assignmentMethod: 'Manual' | 'Auto-assign' };
type TeacherExclusion = { name: string; startDate?: string; endDate?: string };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_OPTIONS = [{ value: 1, label: 'First' }, { value: 2, label: 'Second' }, { value: 3, label: 'Third' }, { value: 4, label: 'Fourth' }, { value: 5, label: 'Last' }];
const RECURRENCE_TYPES = [
  { value: 'daily', label: 'Daily', description: 'Repeats every day or specific weekdays' },
  { value: 'weekly', label: 'Weekly', description: 'Repeats on selected days every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Repeats every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Repeats on specific day of month' },
  { value: 'yearly', label: 'Yearly', description: 'Repeats on specific date each year' },
  { value: 'custom', label: 'Custom', description: 'Custom interval pattern' }
];
const mondayOfDate = (date: string) => {
  const [yearText = '1970', monthText = '1', dayText = '1'] = date.split('-');
  const d = new Date(Number(yearText), Number(monthText) - 1, Number(dayText));
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
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
type RecurringDraft = {
  name: string; description: string; type: string; location: string; assignmentType: string;
  startTime: string; endTime: string; priority: 'low' | 'medium' | 'high';
  recurrenceType: string; weekDays: number[]; monthDay: number; monthWeek: number; monthWeekDay: number;
  yearMonth: number; yearDay: number; customPattern: string; interval: number; startDate: string; endDate: string; notes: string;
};
const dateStep = (date: string, days: number) => { const [yearText = '1970', monthText = '1', dayText = '1'] = date.split('-'); const d = new Date(Number(yearText), Number(monthText) - 1, Number(dayText) + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const dateShort = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const monthBounds = (date: string) => { const [yearText = '1970', monthText = '1'] = date.split('-'); const year = Number(yearText); const month = Number(monthText); const paddedMonth = String(month).padStart(2, '0'); const finalDay = new Date(year, month, 0).getDate(); return { from: `${year}-${paddedMonth}-01`, to: `${year}-${paddedMonth}-${String(finalDay).padStart(2, '0')}` }; };
const newAssignment = (type: DutyTypeRecord, date: string): AssignmentForm => ({ id: createTeacherRecordId('da'), dutyTypeId: type.id, dutyTypeName: type.name, date, startTime: type.startTime, endTime: type.endTime, location: type.defaultLocation, teachers: [], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: false, assignmentType: 'Single Assignment', repeatUntil: '', assignmentMethod: 'Manual' });

export function DutyRoster() {
  const [assignments, setAssignments] = useState<DutyAssignmentRecord[]>(() => loadTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, DEFAULT_DUTY_ASSIGNMENTS));
  const [duties, setDuties] = useState<DutyTypeRecord[]>(() => loadTeacherCollection(DUTY_TYPES_STORAGE_KEY, DEFAULT_DUTY_TYPES));
  const [fromDate, setFromDate] = useState('2025-11-24');
  const [toDate, setToDate] = useState('2025-11-29');
  const [view, setView] = useState('Weekly');
  const [dutyFilter, setDutyFilter] = useState('All');
  const [form, setForm] = useState<AssignmentForm | null>(null);
  const [dutyMasterOpen, setDutyMasterOpen] = useState(false);
  const [dutyMasterName, setDutyMasterName] = useState('');
  const [dutyMasterCategory, setDutyMasterCategory] = useState('Academic');
  const [dutyMasterFrequency, setDutyMasterFrequency] = useState('Daily');
  const [dutyMasterStart, setDutyMasterStart] = useState('07:00 AM');
  const [dutyMasterEnd, setDutyMasterEnd] = useState('08:00 AM');
  const [dutyMasterLocation, setDutyMasterLocation] = useState('');
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [recurringDraft, setRecurringDraft] = useState<RecurringDraft>({ name: '', description: '', type: 'duty', location: '', assignmentType: 'individual', startTime: '09:00', endTime: '10:00', priority: 'medium', recurrenceType: 'weekly', weekDays: [1, 2, 3, 4, 5], monthDay: 0, monthWeek: 0, monthWeekDay: 1, yearMonth: 0, yearDay: 1, customPattern: '', interval: 1, startDate: '', endDate: '', notes: '' });
  const [message, setMessage] = useState('');

  const persist = (next: DutyAssignmentRecord[]) => { setAssignments(next); saveTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, next); };
  const persistDuties = (next: DutyTypeRecord[]) => { setDuties(next); saveTeacherCollection(DUTY_TYPES_STORAGE_KEY, next); };
  const saveDutyType = () => {
    if (!dutyMasterName.trim()) { setMessage('Enter a duty type name.'); return; }
    const saved: DutyTypeRecord = {
      ...(duties[0] || DEFAULT_DUTY_TYPES[0]),
      id: createTeacherRecordId('duty'),
      name: dutyMasterName.trim(),
      code: `DUTY-${dutyMasterName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'NEW'}`,
      category: dutyMasterCategory,
      frequency: dutyMasterFrequency,
      startTime: dutyMasterStart,
      endTime: dutyMasterEnd,
      defaultLocation: dutyMasterLocation,
      status: 'Active'
    };
    persistDuties([saved, ...duties]);
    setDutyMasterOpen(false);
    setDutyMasterName('');
    setMessage(`Duty type “${saved.name}” saved to Duty Master.`);
    window.setTimeout(() => setMessage(''), 3500);
  };
  const openRecurringFromForm = () => {
    if (!form) return;
    setRecurringDraft({
      name: form.dutyTypeName,
      description: form.specialInstructions || '',
      type: 'duty',
      location: form.location,
      assignmentType: 'individual',
      startTime: toTimeInput(form.startTime),
      endTime: form.endTime ? toTimeInput(form.endTime) : '10:00',
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
      startDate: form.date,
      endDate: form.repeatUntil || '',
      notes: form.specialInstructions || ''
    });
    setRecurringOpen(true);
  };
  const saveRecurringFromDuty = () => {
    if (!recurringDraft.name.trim() || !recurringDraft.startTime || !recurringDraft.startDate) { setMessage('Name, start time, and start date are required for a recurring activity.'); return; }
    const extraKey = 'k12-recurring-activities-extra-v1';
    const record = {
      id: createTeacherRecordId('ra'),
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
      assignedTeacherIds: form?.teachers || [],
      rotatingTeacherIds: [],
      currentRotationIndex: 0,
      departmentId: '',
      status: 'active',
      priority: recurringDraft.priority,
      reminderMinutes: [15],
      notes: recurringDraft.notes,
      createdBy: 'Duty Roster',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skipDates: [],
      totalOccurrences: 0,
      completedOccurrences: 0
    };
    try {
      const existing = JSON.parse(localStorage.getItem(extraKey) || '[]');
      localStorage.setItem(extraKey, JSON.stringify(Array.isArray(existing) ? [record, ...existing] : [record]));
    } catch {
      localStorage.setItem(extraKey, JSON.stringify([record]));
    }
    setRecurringOpen(false);
    setMessage(`“${record.name}” saved as a recurring activity.`);
    window.setTimeout(() => setMessage(''), 4000);
  };
  const filtered = useMemo(() => assignments.filter((assignment) => assignment.date >= fromDate && assignment.date <= toDate && (dutyFilter === 'All' || assignment.dutyTypeName.toLowerCase().includes(dutyFilter.toLowerCase()))), [assignments, fromDate, toDate, dutyFilter]);
  const weekDays = useMemo(() => {
    if (view === 'Weekly') {
      const start = mondayOfDate(fromDate);
      return Array.from({ length: 6 }, (_, index) => dateStep(start, index));
    }
    const list: string[] = []; let cursor = fromDate; let count = 0;
    while (cursor && cursor <= toDate && count < 31) {
      const [yearText = '1970', monthText = '1', dayText = '1'] = cursor.split('-');
      const weekday = new Date(Number(yearText), Number(monthText) - 1, Number(dayText)).getDay();
      if (weekday !== 0) list.push(cursor);
      cursor = dateStep(cursor, 1);
      count += 1;
    }
    return list;
  }, [fromDate, toDate, view]);
  const changeRosterView = (nextView: string) => {
    setView(nextView);
    if (nextView === 'Weekly') {
      const monday = mondayOfDate(fromDate);
      setFromDate(monday);
      setToDate(dateStep(monday, 5));
    }
    if (nextView === 'Monthly') { const range = monthBounds(fromDate); setFromDate(range.from); setToDate(range.to); }
  };
  const dutyRows = duties.filter((duty) => dutyFilter === 'All' || duty.name.toLowerCase().includes(dutyFilter.toLowerCase()));
  const absentThisWeek = filtered.filter((assignment) => assignment.status === 'Absent' || assignment.status === 'Substituted');
  const unassignedCount = filtered.filter((assignment) => assignment.teachers.length === 0).length;
  const openCreate = () => {
    const type = duties.find((duty) => duty.status === 'Active') || DEFAULT_DUTY_TYPES[0];
    setForm(newAssignment(type, fromDate));
  };
  const updateForm = <K extends keyof AssignmentForm,>(key: K, value: AssignmentForm[K]) => setForm((current) => current ? { ...current, [key]: value } : current);
  const updateDutyType = (id: string) => {
    const duty = duties.find((item) => item.id === id);
    if (duty) setForm((current) => current ? { ...current, dutyTypeId: duty.id, dutyTypeName: duty.name, startTime: duty.startTime, endTime: duty.endTime, location: duty.defaultLocation } : current);
  };
  const toggleTeacher = (name: string) => setForm((current) => current ? { ...current, teachers: current.teachers.includes(name) ? current.teachers.filter((teacher) => teacher !== name) : [...current.teachers, name] } : current);
  const toggleChannel = (channel: string) => setForm((current) => current ? { ...current, notificationChannels: current.notificationChannels.includes(channel) ? current.notificationChannels.filter((item) => item !== channel) : [...current.notificationChannels, channel] } : current);
  const selectAutoTeachers = (duty: DutyTypeRecord, date: string, existing: DutyAssignmentRecord[], exclusions: TeacherExclusion[], rules = { respectGap: true, equalDistribution: true, limitHods: true, balanceSenior: true }) => {
    let candidates = TEACHER_STAFF.filter((teacher) => !exclusions.some((item) => item.name.toLowerCase() === teacher.name.toLowerCase() && (!item.startDate || (date >= item.startDate && date <= (item.endDate || item.startDate)))) && (duty.eligibleAllTeachingStaff || teacher.designation.toLowerCase().includes(duty.specificDesignation.toLowerCase())));
    if (rules.limitHods) {
      const nonLeadership = candidates.filter((teacher) => !['principal', 'hod'].some((term) => teacher.designation.toLowerCase().includes(term)));
      if (nonLeadership.length >= duty.teachersPerDuty) candidates = nonLeadership;
    }
    const priorAssignments = existing.filter((item) => item.date < date);
    const lastDateFor = (name: string) => { const dates = priorAssignments.filter((item) => item.teachers.includes(name)).map((item) => item.date).sort(); return dates[dates.length - 1] || ''; };
    const countFor = (name: string) => priorAssignments.filter((item) => item.teachers.includes(name)).length;
    const seniorityRank = (designation: string) => designation.includes('PGT') ? 0 : designation.includes('TGT') ? 1 : 2;
    const eligible = candidates.filter((teacher) => {
      if (existing.some((item) => item.date === date && item.teachers.includes(teacher.name))) return false;
      const previous = lastDateFor(teacher.name);
      if (!previous) return true;
      const days = Math.round((new Date(`${date}T00:00:00`).getTime() - new Date(`${previous}T00:00:00`).getTime()) / 86400000);
      return days > 0 && (!rules.respectGap || days >= (duty.minimumGapDays || 0));
    }).sort((a, b) => {
      const workload = rules.equalDistribution ? countFor(a.name) - countFor(b.name) : 0;
      const seniority = rules.balanceSenior ? seniorityRank(a.designation) - seniorityRank(b.designation) : 0;
      return workload || seniority || a.name.localeCompare(b.name);
    });
    return eligible.slice(0, duty.teachersPerDuty).map((teacher) => teacher.name);
  };
  const saveAssignment = (notify = false) => {
    if (!form || !form.dutyTypeName.trim() || !form.date) { setMessage('Enter a duty type and date before saving.'); return; }
    const duty = duties.find((item) => item.id === form.dutyTypeId);
    if (form.assignmentMethod === 'Manual' && form.teachers.length < (duty?.teachersPerDuty || 1)) {
      setMessage(`Select at least ${duty?.teachersPerDuty || 1} teacher(s) for ${duty?.name || 'this duty type'}.`);
      return;
    }
    const dates: string[] = [form.date];
    if ((form.assignmentType === 'Recurring' || form.assignmentType === 'Full Roster') && form.repeatUntil && form.repeatUntil >= form.date) {
      let cursor = dateStep(form.date, 1); let limit = 0;
      while (cursor <= form.repeatUntil && limit < 90) { const day = new Date(`${cursor}T00:00:00`).getDay(); if (day !== 0) dates.push(cursor); cursor = dateStep(cursor, 1); limit += 1; }
    }
    const created = dates.map((date, index) => {
      const teachers = form.assignmentMethod === 'Auto-assign' && duty ? selectAutoTeachers(duty, date, [...assignments, ...dates.slice(0, index).map((previousDate) => ({ ...form, date: previousDate }))], []) : form.teachers;
      const { assignmentType: _assignmentType, repeatUntil: _repeatUntil, assignmentMethod: _assignmentMethod, ...record } = form;
      return { ...record, id: dates.length > 1 ? createTeacherRecordId('da') : form.id, date, teachers, notified: notify && form.notifyTeachers, status: form.status };
    });
    if (dates.length === 1 && assignments.some((item) => item.id === created[0].id)) {
      persist(assignments.map((item) => item.id === created[0].id ? created[0] : item));
    } else persist([...created, ...assignments]);
    setForm(null);
    setMessage(notify ? `${created.length} duty assignment(s) saved and staff notification queued.` : `${created.length} duty assignment(s) saved.`);
    window.setTimeout(() => setMessage(''), 4000);
  };
  const exportRoster = () => downloadTeacherCsv('duty-roster.csv', filtered.map((assignment) => ({ Duty: assignment.dutyTypeName, Date: assignment.date, Time: `${assignment.startTime}–${assignment.endTime}`, Location: assignment.location, Teachers: assignment.teachers.join('; '), Status: assignment.status, Substitute: assignment.substituteTeacher })));
  const notifyStaff = () => {
    const ids = new Set(filtered.map((item) => item.id));
    persist(assignments.map((assignment) => ids.has(assignment.id) ? { ...assignment, notified: true } : assignment));
    setMessage(`${filtered.length} duty assignment(s) marked as sent to staff.`); window.setTimeout(() => setMessage(''), 3500);
  };
  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Duty Roster</h1><p className="mt-1 text-sm text-slate-500">Plan single assignments or generate a fair rotating roster for staff.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportRoster}>Export</Button><Button variant="outline" onClick={() => setDutyMasterOpen(true)}>Duty Master</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>Create Duty Assignment</Button></div></div>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><label><span className={labelClass}>View</span><select className={inputClass} value={view} onChange={(event) => changeRosterView(event.target.value)}><option>Weekly</option><option>Monthly</option><option>Custom Range</option></select></label><label><span className={labelClass}>From Date</span><input type="date" className={inputClass} value={fromDate} onChange={(event) => {
            const next = event.target.value;
            if (view === 'Weekly') {
              const monday = mondayOfDate(next);
              setFromDate(monday);
              setToDate(dateStep(monday, 5));
            } else setFromDate(next);
          }} /></label><label><span className={labelClass}>To Date</span><input type="date" className={inputClass} value={toDate} onChange={(event) => setToDate(event.target.value)} /></label><label><span className={labelClass}>Duty Type</span><select className={inputClass} value={dutyFilter} onChange={(event) => setDutyFilter(event.target.value)}><option value="All">All</option>{duties.map((duty) => <option key={duty.id} value={duty.name}>{duty.name}</option>)}</select></label><div className="flex items-end"><Badge variant="info">{view} roster · {filtered.length} assignments</Badge></div></div></Card>
    <Card noPadding className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr><th className="sticky left-0 z-10 min-w-56 bg-slate-50 px-4 py-3 text-[11px] uppercase tracking-wide text-slate-500">Duty / Time</th>{weekDays.map((day) => <th key={day} className="min-w-44 bg-slate-50 px-3 py-3 text-[11px] uppercase tracking-wide text-slate-500">{dateShort(day)}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{dutyRows.map((duty) => <tr key={duty.id}><td className="sticky left-0 bg-white px-4 py-3"><p className="font-semibold text-slate-800">{duty.icon} {duty.name}</p><p className="text-[11px] text-slate-500">{duty.startTime} — {duty.endTime}</p></td>{weekDays.map((day) => { const cell = filtered.filter((assignment) => assignment.dutyTypeId === duty.id && assignment.date === day); return <td key={`${duty.id}-${day}`} className="px-3 py-2 align-top">{cell.length ? cell.map((assignment) => <button key={assignment.id} onClick={() => { setForm({ ...assignment, assignmentType: 'Single Assignment', repeatUntil: '', assignmentMethod: 'Manual' }); }} className="mb-1 block w-full rounded-lg border border-slate-100 bg-slate-50 p-2 text-left hover:border-indigo-200 hover:bg-indigo-50"><p className="text-xs font-semibold text-slate-800">{assignment.teachers.join(', ') || 'Unassigned'}</p><div className="mt-1 flex flex-wrap gap-1">{assignment.teachers.map((teacher) => <span key={teacher} className="text-[10px] text-slate-500">{teacher}</span>)}<Badge variant={assignment.status === 'Done' ? 'success' : assignment.status === 'Absent' ? 'danger' : assignment.status === 'Substituted' ? 'warning' : 'info'}>{assignment.status}{assignment.substituteTeacher ? ` · sub ${assignment.substituteTeacher}` : ''}</Badge></div></button>) : <span className="text-xs text-slate-300">—</span>}</td>; })}</tr>)}{dutyRows.length === 0 && <tr><td colSpan={weekDays.length + 1} className="px-4 py-10 text-center text-sm text-slate-400">No duty types available.</td></tr>}</tbody></table></div></Card>
    <div className="grid gap-4 lg:grid-cols-2"><Card title="Alerts This Period"><div className="space-y-2 text-sm">{absentThisWeek.length ? absentThisWeek.map((assignment) => <p key={assignment.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {assignment.teachers.join(', ')} — {assignment.status} for {assignment.dutyTypeName} on {dateShort(assignment.date)}{assignment.substituteTeacher ? `; ${assignment.substituteTeacher} covered.` : ''}</p>) : <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">No absences are recorded in this date range.</p>}{unassignedCount > 0 && <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {unassignedCount} duty slot(s) are unassigned. Use Create Duty Assignment.</p>}</div></Card><Card title="Roster Summary"><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-xl font-bold text-indigo-700">{filtered.length}</p><p className="text-[11px] text-slate-500">Assignments</p></div><div><p className="text-xl font-bold text-emerald-700">{filtered.filter((item) => item.status === 'Done').length}</p><p className="text-[11px] text-slate-500">Completed</p></div><div><p className="text-xl font-bold text-amber-700">{unassignedCount}</p><p className="text-[11px] text-slate-500">Unassigned</p></div></div></Card></div>

    <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title="Create Duty Assignment" size="lg" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button variant="outline" leftIcon={<Repeat className="h-4 w-4" />} onClick={openRecurringFromForm}>Convert to Recurring</Button><Button variant="outline" onClick={() => saveAssignment(false)}>Save Duty</Button><Button onClick={() => saveAssignment(true)}>Save &amp; Notify Teachers</Button></div>}>
      {form && <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1"><div className="grid gap-4 md:grid-cols-2"><label><span className={labelClass}>Assignment Type</span><select className={inputClass} value={form.assignmentType} onChange={(event) => updateForm('assignmentType', event.target.value as AssignmentForm['assignmentType'])}><option>Single Assignment</option><option>Recurring</option><option>Full Roster</option></select></label><label><span className={labelClass}>Duty Type</span><select className={inputClass} value={form.dutyTypeId} onChange={(event) => updateDutyType(event.target.value)}>{duties.filter((duty) => duty.status === 'Active').map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}</select></label><label><span className={labelClass}>Date</span><input type="date" className={inputClass} value={form.date} onChange={(event) => updateForm('date', event.target.value)} /></label>{(form.assignmentType === 'Recurring' || form.assignmentType === 'Full Roster') && <label><span className={labelClass}>Repeat Until</span><input type="date" className={inputClass} value={form.repeatUntil} onChange={(event) => updateForm('repeatUntil', event.target.value)} /></label>}<label><span className={labelClass}>Start Time</span><input className={inputClass} value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} /></label><label><span className={labelClass}>End Time</span><input className={inputClass} value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} /></label><label><span className={labelClass}>Location</span><input className={inputClass} value={form.location} onChange={(event) => updateForm('location', event.target.value)} /></label><label><span className={labelClass}>Assignment Method</span><select className={inputClass} value={form.assignmentMethod} onChange={(event) => updateForm('assignmentMethod', event.target.value as AssignmentForm['assignmentMethod'])}><option>Manual</option><option>Auto-assign</option></select></label></div><label className="block"><span className={labelClass}>Special Instructions</span><textarea className={`${inputClass} min-h-20`} value={form.specialInstructions} onChange={(event) => updateForm('specialInstructions', event.target.value)} /></label><div className="rounded-lg border border-slate-100 p-3"><p className={labelClass}>Select Teachers · {form.teachers.length} selected (required: {duties.find((item) => item.id === form.dutyTypeId)?.teachersPerDuty || 1})</p><div className="grid gap-2 sm:grid-cols-2">{TEACHER_STAFF.map((teacher) => <label key={teacher.id} className="flex items-center gap-2 rounded border border-slate-100 px-2 py-1.5 text-xs"><input type="checkbox" checked={form.teachers.includes(teacher.name)} onChange={() => toggleTeacher(teacher.name)} />{teacher.name}<span className="text-slate-400">{teacher.designation}</span></label>)}</div></div><div className="grid gap-3 md:grid-cols-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.notifyTeachers} onChange={(event) => updateForm('notifyTeachers', event.target.checked)} />Notify teachers of assignment</label><div className="flex flex-wrap gap-3">{['In-App','Email','SMS'].map((channel) => <label key={channel} className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={form.notificationChannels.includes(channel)} onChange={() => toggleChannel(channel)} />{channel}</label>)}</div></div></div>}
    </Modal>

    <Modal isOpen={dutyMasterOpen} onClose={() => setDutyMasterOpen(false)} title="Duty Master · Create Duty Type" size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDutyMasterOpen(false)}>Cancel</Button><Button onClick={saveDutyType}>Save Duty Type</Button></div>}>
      <div className="grid gap-4 md:grid-cols-2">
        <label><span className={labelClass}>Duty Name</span><input className={inputClass} value={dutyMasterName} onChange={(event) => setDutyMasterName(event.target.value)} placeholder="Gate Duty — Morning" /></label>
        <label><span className={labelClass}>Category</span><select className={inputClass} value={dutyMasterCategory} onChange={(event) => setDutyMasterCategory(event.target.value)}>{['Campus Safety', 'Academic', 'Examination', 'Transport', 'Events', 'Hostel', 'Sports', 'Safety', 'Campus', 'Health'].map((category) => <option key={category}>{category}</option>)}</select></label>
        <label><span className={labelClass}>Frequency</span><select className={inputClass} value={dutyMasterFrequency} onChange={(event) => setDutyMasterFrequency(event.target.value)}>{['Daily', 'Weekly', 'Per Exam', 'Per Event', 'As Needed', 'Rotational', 'Per PTM', 'Per Period', 'On-call'].map((frequency) => <option key={frequency}>{frequency}</option>)}</select></label>
        <label><span className={labelClass}>Default Location</span><input className={inputClass} value={dutyMasterLocation} onChange={(event) => setDutyMasterLocation(event.target.value)} /></label>
        <label><span className={labelClass}>Default Start Time</span><input className={inputClass} value={dutyMasterStart} onChange={(event) => setDutyMasterStart(event.target.value)} /></label>
        <label><span className={labelClass}>Default End Time</span><input className={inputClass} value={dutyMasterEnd} onChange={(event) => setDutyMasterEnd(event.target.value)} /></label>
      </div>
      <p className="mt-3 text-xs text-slate-500">New duty types are saved with Duty Master and appear in the Duty Type dropdown.</p>
    </Modal>

    <Modal isOpen={recurringOpen} onClose={() => setRecurringOpen(false)} title="Convert to Recurring Activity" size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRecurringOpen(false)}>Cancel</Button><Button onClick={saveRecurringFromDuty}>Save Recurring Activity</Button></div>}>
      <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
        <label><span className={labelClass}>Activity Name *</span><input className={inputClass} value={recurringDraft.name} onChange={(event) => setRecurringDraft((current) => ({ ...current, name: event.target.value }))} /></label>
        <div className="grid grid-cols-3 gap-4">
          <label><span className={labelClass}>Start Time *</span><input type="time" className={inputClass} value={recurringDraft.startTime} onChange={(event) => setRecurringDraft((current) => ({ ...current, startTime: event.target.value }))} /></label>
          <label><span className={labelClass}>End Time</span><input type="time" className={inputClass} value={recurringDraft.endTime} onChange={(event) => setRecurringDraft((current) => ({ ...current, endTime: event.target.value }))} /></label>
          <label><span className={labelClass}>Priority</span><select className={inputClass} value={recurringDraft.priority} onChange={(event) => setRecurringDraft((current) => ({ ...current, priority: event.target.value as RecurringDraft['priority'] }))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        </div>
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-700"><Repeat className="h-4 w-4" /> Recurrence Pattern</h4>
          <div className="space-y-4">
            <label><span className={labelClass}>Frequency</span><select className={inputClass} value={recurringDraft.recurrenceType} onChange={(event) => setRecurringDraft((current) => ({ ...current, recurrenceType: event.target.value }))}>{RECURRENCE_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label} - {item.description}</option>)}</select></label>
            {['daily', 'weekly', 'biweekly'].includes(recurringDraft.recurrenceType) && (
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Days of Week</span>
                <div className="flex gap-2">
                  {DAYS.map((day, index) => (
                    <button type="button" key={day} onClick={() => setRecurringDraft((current) => ({ ...current, weekDays: current.weekDays.includes(index) ? current.weekDays.filter((item) => item !== index) : [...current.weekDays, index].sort((a, b) => a - b) }))} className={`h-10 w-10 rounded-full text-sm font-medium ${recurringDraft.weekDays.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{day.charAt(0)}</button>
                  ))}
                </div>
              </div>
            )}
            {recurringDraft.recurrenceType === 'monthly' && (
              <div className="grid grid-cols-2 gap-4">
                <label><span className={labelClass}>Day of Month</span><select className={inputClass} value={recurringDraft.monthDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthDay: Number(event.target.value) }))}><option value={0}>Select day</option>{Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
                <div>
                  <span className="mb-1 block text-sm font-medium text-slate-700">Or Week of Month</span>
                  <div className="flex gap-2">
                    <select className={inputClass} value={recurringDraft.monthWeek} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthWeek: Number(event.target.value) }))}><option value={0}>Select week</option>{WEEK_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                    <select className={inputClass} value={recurringDraft.monthWeekDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, monthWeekDay: Number(event.target.value) }))}><option value={0}>Select day</option>{DAYS.map((day, index) => <option key={day} value={index}>{day}</option>)}</select>
                  </div>
                </div>
              </div>
            )}
            {recurringDraft.recurrenceType === 'yearly' && (
              <div className="grid grid-cols-2 gap-4">
                <label><span className={labelClass}>Month</span><select className={inputClass} value={recurringDraft.yearMonth} onChange={(event) => setRecurringDraft((current) => ({ ...current, yearMonth: Number(event.target.value) }))}>{MONTHS.map((month, index) => <option key={month} value={index}>{month}</option>)}</select></label>
                <label><span className={labelClass}>Day</span><select className={inputClass} value={recurringDraft.yearDay} onChange={(event) => setRecurringDraft((current) => ({ ...current, yearDay: Number(event.target.value) }))}>{Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
              </div>
            )}
            {recurringDraft.recurrenceType === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <label><span className={labelClass}>Interval</span><input type="number" min={1} className={inputClass} value={recurringDraft.interval} onChange={(event) => setRecurringDraft((current) => ({ ...current, interval: Number(event.target.value) || 1 }))} /></label>
                <label><span className={labelClass}>Custom Pattern</span><input className={inputClass} value={recurringDraft.customPattern} onChange={(event) => setRecurringDraft((current) => ({ ...current, customPattern: event.target.value }))} placeholder="Every 3 weeks on Monday" /></label>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label><span className={labelClass}>Start Date *</span><input type="date" className={inputClass} value={recurringDraft.startDate} onChange={(event) => setRecurringDraft((current) => ({ ...current, startDate: event.target.value }))} /></label>
              <label><span className={labelClass}>End Date (Optional)</span><input type="date" className={inputClass} value={recurringDraft.endDate} onChange={(event) => setRecurringDraft((current) => ({ ...current, endDate: event.target.value }))} /></label>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>;
}
