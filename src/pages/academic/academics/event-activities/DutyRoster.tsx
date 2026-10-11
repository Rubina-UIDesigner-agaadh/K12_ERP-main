import React, { useMemo, useState } from 'react';
import { Download, Plus, Send, Sparkles } from 'lucide-react';
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
const autoRuleOptions: Array<{ key: 'equalDistribution' | 'respectGap' | 'limitHods' | 'balanceSenior' | 'previewBeforeSave'; label: string }> = [
  { key: 'equalDistribution', label: 'Equal distribution — balance assignment counts' },
  { key: 'respectGap', label: 'Respect minimum gap; no consecutive-day assignments' },
  { key: 'limitHods', label: 'Consider designation / department constraints' },
  { key: 'balanceSenior', label: 'Balance senior and junior staff' },
  { key: 'previewBeforeSave', label: 'Preview generated roster before saving' }
];
type AssignmentForm = DutyAssignmentRecord & { assignmentType: 'Single Assignment' | 'Recurring' | 'Full Roster'; repeatUntil: string; assignmentMethod: 'Manual' | 'Auto-assign' };
type TeacherExclusion = { name: string; startDate?: string; endDate?: string };
const parseTeacherExclusions = (value: string): TeacherExclusion[] => value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
  const range = line.match(/^(.+?)\s*[|@]\s*(\d{4}-\d{2}-\d{2})(?:\s*(?:to|–|-)\s*(\d{4}-\d{2}-\d{2}))?\s*$/i);
  if (range?.[1] && range[2]) return { name: range[1].trim(), startDate: range[2], endDate: range[3] || range[2] };
  return { name: line.split(/\s+[—–]\s+/)[0].trim() };
});
const dateStep = (date: string, days: number) => { const [yearText = '1970', monthText = '1', dayText = '1'] = date.split('-'); const d = new Date(Number(yearText), Number(monthText) - 1, Number(dayText) + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const dateShort = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const monthBounds = (date: string) => { const [yearText = '1970', monthText = '1'] = date.split('-'); const year = Number(yearText); const month = Number(monthText); const paddedMonth = String(month).padStart(2, '0'); const finalDay = new Date(year, month, 0).getDate(); return { from: `${year}-${paddedMonth}-01`, to: `${year}-${paddedMonth}-${String(finalDay).padStart(2, '0')}` }; };
const newAssignment = (type: DutyTypeRecord, date: string): AssignmentForm => ({ id: createTeacherRecordId('da'), dutyTypeId: type.id, dutyTypeName: type.name, date, startTime: type.startTime, endTime: type.endTime, location: type.defaultLocation, teachers: [], status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: false, assignmentType: 'Single Assignment', repeatUntil: '', assignmentMethod: 'Manual' });

export function DutyRoster() {
  const [assignments, setAssignments] = useState<DutyAssignmentRecord[]>(() => loadTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, DEFAULT_DUTY_ASSIGNMENTS));
  const [duties] = useState<DutyTypeRecord[]>(() => loadTeacherCollection(DUTY_TYPES_STORAGE_KEY, DEFAULT_DUTY_TYPES));
  const [fromDate, setFromDate] = useState('2025-11-25');
  const [toDate, setToDate] = useState('2025-11-29');
  const [view, setView] = useState('Weekly');
  const [autoView, setAutoView] = useState('Weekly');
  const [dutyFilter, setDutyFilter] = useState('All');
  const [form, setForm] = useState<AssignmentForm | null>(null);
  const [autoOpen, setAutoOpen] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<DutyAssignmentRecord[]>([]);
  const [autoRange, setAutoRange] = useState({ from: '2025-11-25', to: '2025-11-29', dutyIds: duties.filter((duty) => ['duty-001','duty-002','duty-003','duty-004','duty-005','duty-007'].includes(duty.id)).map((duty) => duty.id), exclusions: '', equalDistribution: true, respectGap: true, limitHods: true, balanceSenior: true, previewBeforeSave: true });
  const [message, setMessage] = useState('');

  const persist = (next: DutyAssignmentRecord[]) => { setAssignments(next); saveTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, next); };
  const filtered = useMemo(() => assignments.filter((assignment) => assignment.date >= fromDate && assignment.date <= toDate && (dutyFilter === 'All' || assignment.dutyTypeId === dutyFilter)), [assignments, fromDate, toDate, dutyFilter]);
  const weekDays = useMemo(() => {
    const list: string[] = []; let cursor = fromDate; let count = 0;
    const maxDays = view === 'Weekly' ? 7 : 31;
    while (cursor && cursor <= toDate && count < maxDays) { list.push(cursor); cursor = dateStep(cursor, 1); count += 1; }
    return list;
  }, [fromDate, toDate, view]);
  const changeRosterView = (nextView: string) => {
    setView(nextView);
    if (nextView === 'Weekly') setToDate(dateStep(fromDate, 4));
    if (nextView === 'Monthly') { const range = monthBounds(fromDate); setFromDate(range.from); setToDate(range.to); }
  };
  const changeAutoView = (nextView: string) => {
    setAutoView(nextView);
    if (nextView === 'Weekly') setAutoRange((current) => ({ ...current, to: dateStep(current.from, 4) }));
    if (nextView === 'Monthly') setAutoRange((current) => ({ ...current, ...monthBounds(current.from) }));
  };
  const dutyRows = duties.filter((duty) => dutyFilter === 'All' || duty.id === dutyFilter);
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
    if (!form || !form.dutyTypeId || !form.date) return;
    const duty = duties.find((item) => item.id === form.dutyTypeId);
    if (form.assignmentMethod === 'Manual' && form.teachers.length < (duty?.teachersPerDuty || 1)) {
      setMessage(`Select at least ${duty?.teachersPerDuty || 1} teacher(s) for ${duty?.name || 'this duty type'}.`);
      return;
    }
    const dates: string[] = [form.date];
    if ((form.assignmentType === 'Recurring' || form.assignmentType === 'Full Roster') && form.repeatUntil && form.repeatUntil >= form.date) {
      let cursor = dateStep(form.date, 1); let limit = 0;
      while (cursor <= form.repeatUntil && limit < 90) { const day = new Date(`${cursor}T00:00:00`).getDay(); if (day !== 0 && day !== 6) dates.push(cursor); cursor = dateStep(cursor, 1); limit += 1; }
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
  const mergeGenerated = (generated: DutyAssignmentRecord[]) => {
    const replacements = new Map<string, DutyAssignmentRecord>();
    generated.forEach((item) => replacements.set(item.id, item));
    const existingIds = new Set(assignments.map((item) => item.id));
    return [...generated.filter((item) => !existingIds.has(item.id)), ...assignments.map((item) => replacements.get(item.id) || item)];
  };
  const generatePreview = () => {
    const selectedTypes = duties.filter((duty) => autoRange.dutyIds.includes(duty.id) && duty.status === 'Active');
    const exclusions = parseTeacherExclusions(autoRange.exclusions);
    const dates: string[] = []; let cursor = autoRange.from; let limit = 0;
    while (cursor && cursor <= autoRange.to && limit < 90) { const weekday = new Date(`${cursor}T00:00:00`).getDay(); if (weekday !== 0 && weekday !== 6) dates.push(cursor); cursor = dateStep(cursor, 1); limit += 1; }
    if (!selectedTypes.length || !dates.length) { setMessage('Select at least one active duty type and a valid date range.'); return; }
    let working = [...assignments];
    const preview: DutyAssignmentRecord[] = [];
    dates.forEach((date) => selectedTypes.forEach((duty) => {
      const existingSlot = working.find((item) => item.date === date && item.dutyTypeId === duty.id);
      if (existingSlot?.teachers.length) return;
      const teachers = selectAutoTeachers(duty, date, working, exclusions, { respectGap: autoRange.respectGap, equalDistribution: autoRange.equalDistribution, limitHods: autoRange.limitHods, balanceSenior: autoRange.balanceSenior });
      const record: DutyAssignmentRecord = existingSlot
        ? { ...existingSlot, teachers }
        : { id: createTeacherRecordId('da'), dutyTypeId: duty.id, dutyTypeName: duty.name, date, startTime: duty.startTime, endTime: duty.endTime, location: duty.defaultLocation, teachers, status: 'Scheduled', substituteTeacher: '', specialInstructions: '', notifyTeachers: true, notificationChannels: ['In-App', 'Email'], notified: false };
      preview.push(record);
      working = existingSlot ? working.map((item) => item.id === existingSlot.id ? record : item) : [record, ...working];
    }));
    if (!preview.length) { setMessage('All selected duty slots in this range already have assignments. Existing roster entries were left unchanged.'); return; }
    if (autoRange.previewBeforeSave) setGeneratedPreview(preview);
    else {
      persist(mergeGenerated(preview));
      setAutoOpen(false);
      setMessage(`Auto-generated roster saved: ${preview.length} assignment(s).`);
      window.setTimeout(() => setMessage(''), 4000);
    }
  };
  const saveGenerated = () => {
    if (!generatedPreview.length) return;
    persist(mergeGenerated(generatedPreview));
    setAutoOpen(false); setGeneratedPreview([]);
    setMessage(`Generated roster saved: ${generatedPreview.length} assignment(s). Unassigned slots: ${generatedPreview.filter((item) => !item.teachers.length).length}.`);
    window.setTimeout(() => setMessage(''), 4500);
  };
  const toggleAutoDuty = (id: string) => setAutoRange((current) => ({ ...current, dutyIds: current.dutyIds.includes(id) ? current.dutyIds.filter((item) => item !== id) : [...current.dutyIds, id] }));

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">📋 Duty Roster</h1><p className="mt-1 text-sm text-slate-500">Plan single assignments or generate a fair rotating roster for staff.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportRoster}>Export</Button><Button variant="outline" leftIcon={<Send className="h-4 w-4" />} onClick={notifyStaff}>Send to Staff</Button><Button variant="outline" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => { setGeneratedPreview([]); setAutoOpen(true); }}>Auto-Generate Roster</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>Create Duty Assignment</Button></div></div>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><label><span className={labelClass}>View</span><select className={inputClass} value={view} onChange={(event) => changeRosterView(event.target.value)}><option>Weekly</option><option>Monthly</option><option>Custom Range</option></select></label><label><span className={labelClass}>From Date</span><input type="date" className={inputClass} value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label><label><span className={labelClass}>To Date</span><input type="date" className={inputClass} value={toDate} onChange={(event) => setToDate(event.target.value)} /></label><label><span className={labelClass}>Duty Type</span><select className={inputClass} value={dutyFilter} onChange={(event) => setDutyFilter(event.target.value)}><option>All</option>{duties.map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}</select></label><div className="flex items-end"><Badge variant="info">{view} roster · {filtered.length} assignments</Badge></div></div></Card>
    <Card noPadding className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr><th className="sticky left-0 z-10 min-w-56 bg-slate-50 px-4 py-3 text-[11px] uppercase tracking-wide text-slate-500">Duty / Time</th>{weekDays.map((day) => <th key={day} className="min-w-44 bg-slate-50 px-3 py-3 text-[11px] uppercase tracking-wide text-slate-500">{dateShort(day)}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{dutyRows.map((duty) => <tr key={duty.id}><td className="sticky left-0 bg-white px-4 py-3"><p className="font-semibold text-slate-800">{duty.icon} {duty.name}</p><p className="text-[11px] text-slate-500">{duty.startTime} — {duty.endTime}</p></td>{weekDays.map((day) => { const cell = filtered.filter((assignment) => assignment.dutyTypeId === duty.id && assignment.date === day); return <td key={`${duty.id}-${day}`} className="px-3 py-2 align-top">{cell.length ? cell.map((assignment) => <button key={assignment.id} onClick={() => { setForm({ ...assignment, assignmentType: 'Single Assignment', repeatUntil: '', assignmentMethod: 'Manual' }); }} className="mb-1 block w-full rounded-lg border border-slate-100 bg-slate-50 p-2 text-left hover:border-indigo-200 hover:bg-indigo-50"><p className="text-xs font-semibold text-slate-800">{assignment.teachers.join(', ') || 'Unassigned'}</p><div className="mt-1 flex flex-wrap gap-1">{assignment.teachers.map((teacher) => <span key={teacher} className="text-[10px] text-slate-500">{teacher}</span>)}<Badge variant={assignment.status === 'Done' ? 'success' : assignment.status === 'Absent' ? 'danger' : assignment.status === 'Substituted' ? 'warning' : 'info'}>{assignment.status}{assignment.substituteTeacher ? ` · sub ${assignment.substituteTeacher}` : ''}</Badge></div></button>) : <span className="text-xs text-slate-300">—</span>}</td>; })}</tr>)}{dutyRows.length === 0 && <tr><td colSpan={weekDays.length + 1} className="px-4 py-10 text-center text-sm text-slate-400">No duty types available.</td></tr>}</tbody></table></div></Card>
    <div className="grid gap-4 lg:grid-cols-2"><Card title="Alerts This Period"><div className="space-y-2 text-sm">{absentThisWeek.length ? absentThisWeek.map((assignment) => <p key={assignment.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {assignment.teachers.join(', ')} — {assignment.status} for {assignment.dutyTypeName} on {dateShort(assignment.date)}{assignment.substituteTeacher ? `; ${assignment.substituteTeacher} covered.` : ''}</p>) : <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">No absences are recorded in this date range.</p>}{unassignedCount > 0 && <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {unassignedCount} duty slot(s) are unassigned. Use Auto-Generate or Create Duty Assignment.</p>}</div></Card><Card title="Roster Summary"><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-xl font-bold text-indigo-700">{filtered.length}</p><p className="text-[11px] text-slate-500">Assignments</p></div><div><p className="text-xl font-bold text-emerald-700">{filtered.filter((item) => item.status === 'Done').length}</p><p className="text-[11px] text-slate-500">Completed</p></div><div><p className="text-xl font-bold text-amber-700">{unassignedCount}</p><p className="text-[11px] text-slate-500">Unassigned</p></div></div></Card></div>

    <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title="📋 Create Duty Assignment" size="lg" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button variant="outline" onClick={() => saveAssignment(false)}>Save Duty</Button><Button onClick={() => saveAssignment(true)}>Save &amp; Notify Teachers</Button></div>}>
      {form && <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1"><div className="grid gap-4 md:grid-cols-2"><label><span className={labelClass}>Assignment Type</span><select className={inputClass} value={form.assignmentType} onChange={(event) => updateForm('assignmentType', event.target.value as AssignmentForm['assignmentType'])}><option>Single Assignment</option><option>Recurring</option><option>Full Roster</option></select></label><label><span className={labelClass}>Duty Type</span><select className={inputClass} value={form.dutyTypeId} onChange={(event) => updateDutyType(event.target.value)}>{duties.filter((duty) => duty.status === 'Active').map((duty) => <option key={duty.id} value={duty.id}>{duty.icon} {duty.name}</option>)}</select></label><label><span className={labelClass}>Date</span><input type="date" className={inputClass} value={form.date} onChange={(event) => updateForm('date', event.target.value)} /></label>{(form.assignmentType === 'Recurring' || form.assignmentType === 'Full Roster') && <label><span className={labelClass}>Repeat Until</span><input type="date" className={inputClass} value={form.repeatUntil} onChange={(event) => updateForm('repeatUntil', event.target.value)} /></label>}<label><span className={labelClass}>Start Time</span><input className={inputClass} value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} /></label><label><span className={labelClass}>End Time</span><input className={inputClass} value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} /></label><label><span className={labelClass}>Location</span><input className={inputClass} value={form.location} onChange={(event) => updateForm('location', event.target.value)} /></label><label><span className={labelClass}>Assignment Method</span><select className={inputClass} value={form.assignmentMethod} onChange={(event) => updateForm('assignmentMethod', event.target.value as AssignmentForm['assignmentMethod'])}><option>Manual</option><option>Auto-assign</option></select></label></div><label className="block"><span className={labelClass}>Special Instructions</span><textarea className={`${inputClass} min-h-20`} value={form.specialInstructions} onChange={(event) => updateForm('specialInstructions', event.target.value)} /></label><div className="rounded-lg border border-slate-100 p-3"><p className={labelClass}>Select Teachers · {form.teachers.length} selected (required: {duties.find((item) => item.id === form.dutyTypeId)?.teachersPerDuty || 1})</p><div className="grid gap-2 sm:grid-cols-2">{TEACHER_STAFF.map((teacher) => <label key={teacher.id} className="flex items-center gap-2 rounded border border-slate-100 px-2 py-1.5 text-xs"><input type="checkbox" checked={form.teachers.includes(teacher.name)} onChange={() => toggleTeacher(teacher.name)} />{teacher.name}<span className="text-slate-400">{teacher.designation}</span></label>)}</div></div><div className="grid gap-3 md:grid-cols-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.notifyTeachers} onChange={(event) => updateForm('notifyTeachers', event.target.checked)} />Notify teachers of assignment</label><div className="flex flex-wrap gap-3">{['In-App','Email','SMS'].map((channel) => <label key={channel} className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={form.notificationChannels.includes(channel)} onChange={() => toggleChannel(channel)} />{channel}</label>)}</div></div></div>}
    </Modal>

    <Modal isOpen={autoOpen} onClose={() => { setAutoOpen(false); setGeneratedPreview([]); }} title="🤖 Auto-Generate Duty Roster" size="xl" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setAutoOpen(false); setGeneratedPreview([]); }}>Cancel</Button>{generatedPreview.length ? <Button onClick={saveGenerated}>Save Generated Roster ({generatedPreview.length})</Button> : <Button onClick={generatePreview}>Generate Preview</Button>}</div>}>
      <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1"><div className="grid gap-4 md:grid-cols-3"><label><span className={labelClass}>Generate Roster For</span><select className={inputClass} value={autoView} onChange={(event) => changeAutoView(event.target.value)}><option>Weekly</option><option>Monthly</option><option>Custom Range</option></select></label><label><span className={labelClass}>From Date</span><input type="date" className={inputClass} value={autoRange.from} onChange={(event) => setAutoRange((current) => ({ ...current, from: event.target.value }))} /></label><label><span className={labelClass}>To Date</span><input type="date" className={inputClass} value={autoRange.to} onChange={(event) => setAutoRange((current) => ({ ...current, to: event.target.value }))} /></label></div><div><p className={labelClass}>Duty Types to Include</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{duties.filter((duty) => duty.status === 'Active').map((duty) => <label key={duty.id} className="flex items-center gap-2 rounded border border-slate-100 px-2 py-2 text-xs"><input type="checkbox" checked={autoRange.dutyIds.includes(duty.id)} onChange={() => toggleAutoDuty(duty.id)} />{duty.name}</label>)}</div></div><label className="block"><span className={labelClass}>Exclusions · one per line; bare name excludes the range, or append | YYYY-MM-DD to YYYY-MM-DD</span><textarea className={`${inputClass} min-h-16`} value={autoRange.exclusions} onChange={(event) => setAutoRange((current) => ({ ...current, exclusions: event.target.value }))} placeholder="Mr. A. Sharma | 2025-11-25 to 2025-11-26" /></label><div className="grid gap-2 md:grid-cols-2">{autoRuleOptions.map((rule) => <label key={rule.key} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs"><input type="checkbox" checked={autoRange[rule.key]} onChange={(event) => setAutoRange((current) => ({ ...current, [rule.key]: event.target.checked }))} />{rule.label}</label>)}</div>{generatedPreview.length > 0 && <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3"><p className="text-sm font-bold text-indigo-900">Preview: {generatedPreview.length} assignments · {generatedPreview.filter((item) => !item.teachers.length).length} unassigned</p><div className="mt-2 max-h-52 overflow-y-auto text-xs">{generatedPreview.slice(0, 30).map((item) => <p key={item.id} className="border-b border-indigo-100 py-1">{dateShort(item.date)} · {item.dutyTypeName} · {item.teachers.join(', ') || 'Unassigned'}</p>)}</div></div>}</div>
    </Modal>
  </div>;
}
