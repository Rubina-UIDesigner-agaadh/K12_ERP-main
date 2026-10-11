import React, { useMemo, useState } from 'react';
import { Download, FileText, Plus, Search } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import {
  ACTIVE_ACADEMIC_YEAR,
  DEFAULT_PROFESSIONAL_DEVELOPMENT,
  DEFAULT_TEACHER_ACTIVITY_TYPES,
  PROFESSIONAL_DEVELOPMENT_STORAGE_KEY,
  TEACHER_ACTIVITY_TYPES_STORAGE_KEY,
  TEACHER_STAFF,
  ProfessionalDevelopmentRecord,
  TeacherActivityTypeRecord,
  calculateActivityCredits,
  createTeacherRecordId,
  downloadTeacherCsv,
  loadTeacherCollection,
  saveTeacherCollection
} from './teacherData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
const levels: ProfessionalDevelopmentRecord['level'][] = ['School', 'District', 'State', 'National', 'International'];
const modes: ProfessionalDevelopmentRecord['mode'][] = ['Offline', 'Online', 'Hybrid'];
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <label className="block"><span className={labelClass}>{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}</label>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-xl border border-slate-200 bg-white"><h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">{title}</h3><div className="space-y-4 p-4">{children}</div></section>; }
const durationInDays = (start: string, end: string) => {
  if (!start || !end) return start ? 1 : 0;
  const first = new Date(`${start}T00:00:00`).getTime(); const last = new Date(`${end}T00:00:00`).getTime();
  return Math.max(1, Math.round((last - first) / 86400000) + 1);
};
const dateLabel = (date: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
function emptyRecord(): ProfessionalDevelopmentRecord {
  const teacher = TEACHER_STAFF[0];
  const type = DEFAULT_TEACHER_ACTIVITY_TYPES[0];
  return {
    id: createTeacherRecordId('pd'), teacherId: teacher.id, teacherName: teacher.name, designation: teacher.designation, department: teacher.department,
    academicYear: ACTIVE_ACADEMIC_YEAR, activityTypeId: type.id, activityTypeName: type.name, activityName: '', organizedBy: '', description: '', subjectArea: '',
    level: 'School', mode: 'Offline', startDate: '', endDate: '', durationDays: 0, durationHours: 0, workingDaysUsed: 0, leaveApplied: false, leaveRef: '',
    venue: '', city: '', travelRequired: false, travelExpenses: null, certificateReceived: false, certificateFile: '', certificateNumber: '', certificateIssuedBy: '',
    keyLearnings: '', applicationPlan: '', creditPoints: 0, workshopMaterials: '', permissionLetter: '', photos: '', managementReport: '',
    hodVerified: false, principalStatus: 'Pending', showOnTeacherProfile: true, includeAnnualReport: true, showOnWebsite: false, showOnParentPortal: false, verificationStatus: 'Draft'
  };
}

export function ProfessionalDevelopment() {
  const [records, setRecords] = useState<ProfessionalDevelopmentRecord[]>(() => loadTeacherCollection(PROFESSIONAL_DEVELOPMENT_STORAGE_KEY, DEFAULT_PROFESSIONAL_DEVELOPMENT));
  const [types] = useState<TeacherActivityTypeRecord[]>(() => loadTeacherCollection(TEACHER_ACTIVITY_TYPES_STORAGE_KEY, DEFAULT_TEACHER_ACTIVITY_TYPES));
  const [search, setSearch] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [form, setForm] = useState<ProfessionalDevelopmentRecord | null>(null);
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => records.filter((record) => {
    const term = search.trim().toLowerCase();
    if (term && !`${record.teacherName} ${record.activityName} ${record.activityTypeName} ${record.department}`.toLowerCase().includes(term)) return false;
    if (teacherFilter !== 'All' && record.teacherId !== teacherFilter) return false;
    if (typeFilter !== 'All' && record.activityTypeId !== typeFilter) return false;
    if (departmentFilter !== 'All' && record.department !== departmentFilter) return false;
    if (fromDate && record.startDate < fromDate) return false;
    if (toDate && record.startDate > toDate) return false;
    return true;
  }), [records, search, teacherFilter, typeFilter, departmentFilter, fromDate, toDate]);
  const totalPoints = filtered.reduce((sum, record) => sum + record.creditPoints, 0);
  const pendingCount = filtered.filter((record) => record.verificationStatus === 'Submitted' || record.principalStatus === 'Pending').length;
  const departments = [...new Set(TEACHER_STAFF.map((teacher) => teacher.department))];
  const persist = (next: ProfessionalDevelopmentRecord[]) => { setRecords(next); saveTeacherCollection(PROFESSIONAL_DEVELOPMENT_STORAGE_KEY, next); };
  function updateForm<K extends keyof ProfessionalDevelopmentRecord>(key: K, value: ProfessionalDevelopmentRecord[K]) { setForm((current) => current ? { ...current, [key]: value } : current); }
  const currentType = form ? types.find((type) => type.id === form.activityTypeId) : undefined;
  const calculatedDuration = form ? durationInDays(form.startDate, form.endDate) : 0;
  const calculatedCredits = form ? calculateActivityCredits(currentType, calculatedDuration) : 0;
  const setDate = (key: 'startDate' | 'endDate', value: string) => setForm((current) => {
    if (!current) return current;
    const next = { ...current, [key]: value };
    const days = durationInDays(next.startDate, next.endDate);
    next.durationDays = days;
    next.durationHours = days * 8;
    if (!next.workingDaysUsed || next.workingDaysUsed > days) next.workingDaysUsed = next.leaveApplied ? days : 0;
    return next;
  });
  const updateTeacher = (teacherId: string) => {
    const teacher = TEACHER_STAFF.find((item) => item.id === teacherId);
    if (teacher) setForm((current) => current ? { ...current, teacherId: teacher.id, teacherName: teacher.name, designation: teacher.designation, department: teacher.department } : current);
  };
  const updateType = (typeId: string) => {
    const type = types.find((item) => item.id === typeId);
    if (type) setForm((current) => current ? { ...current, activityTypeId: type.id, activityTypeName: type.name, creditPoints: calculateActivityCredits(type, durationInDays(current.startDate, current.endDate)) } : current);
  };
  const save = (submit = false) => {
    if (!form || !form.activityName.trim()) { setMessage('Enter an activity name before saving.'); return; }
    const type = types.find((item) => item.id === form.activityTypeId);
    const days = durationInDays(form.startDate, form.endDate);
    const saved: ProfessionalDevelopmentRecord = { ...form, activityName: form.activityName.trim(), durationDays: days, durationHours: form.durationHours || days * 8, creditPoints: calculateActivityCredits(type, days), verificationStatus: submit ? 'Submitted' : form.verificationStatus, principalStatus: submit ? 'Pending' : form.principalStatus };
    persist(records.some((item) => item.id === saved.id) ? records.map((item) => item.id === saved.id ? saved : item) : [saved, ...records]);
    setForm(null); setMessage(submit ? `“${saved.activityName}” submitted for verification.` : `“${saved.activityName}” saved.`); window.setTimeout(() => setMessage(''), 3500);
  };
  const exportRecords = () => downloadTeacherCsv('professional-development.csv', filtered.map((record) => ({ Teacher: record.teacherName, Department: record.department, Activity: record.activityName, Type: record.activityTypeName, StartDate: record.startDate, EndDate: record.endDate, Mode: record.mode, CreditPoints: record.creditPoints, Verification: record.verificationStatus })));
  const summaryReport = () => downloadTeacherCsv('professional-development-summary.csv', [{ Activities: filtered.length, Teachers: new Set(filtered.map((item) => item.teacherId)).size, CreditPoints: totalPoints, PendingVerification: pendingCount, WorkingDaysUsed: filtered.reduce((sum, item) => sum + item.workingDaysUsed, 0) }]);
  const edit = (record: ProfessionalDevelopmentRecord) => setForm({ ...record });
  const fileName = (key: 'certificateFile' | 'workshopMaterials' | 'permissionLetter' | 'photos', file?: File) => { if (file) updateForm(key, file.name); };

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Activities Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">📚 Professional Development</h1><p className="mt-1 text-sm text-slate-500">Log training, workshops, certifications, research and development activities; track verification and credit points.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportRecords}>Export</Button><Button variant="outline" leftIcon={<FileText className="h-4 w-4" />} onClick={summaryReport}>View Summary Report</Button><Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setForm(emptyRecord())}>Log New Activity</Button></div></div>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Records', filtered.length], ['Credit Points', totalPoints], ['Teachers', new Set(filtered.map((item) => item.teacherId)).size], ['Pending Verification', pendingCount]].map(([label, value]) => <Card key={String(label)}><p className="text-2xl font-bold text-indigo-700">{value}</p><p className="text-xs text-slate-500">{label}</p></Card>)}</div>
    <Card noPadding className="overflow-hidden"><div className="grid gap-3 border-b border-slate-100 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-6"><div className="relative xl:col-span-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search teacher or activity..." /></div><select className={inputClass} value={teacherFilter} onChange={(event) => setTeacherFilter(event.target.value)}><option value="All">Teacher: All</option>{TEACHER_STAFF.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}</select><select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="All">Type: All</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select><input className={inputClass} type="date" aria-label="From date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /><input className={inputClass} type="date" aria-label="To date" value={toDate} onChange={(event) => setToDate(event.target.value)} /><select className={inputClass} value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}><option value="All">Department: All</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[930px] text-left text-sm"><thead className="text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Teacher Name</th><th className="px-4 py-3">Activity Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Credits</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((record, index) => <tr key={record.id} className="cursor-pointer hover:bg-indigo-50/30" onClick={() => edit(record)}><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3 font-medium text-slate-800">{record.teacherName}</td><td className="px-4 py-3">{record.activityName}</td><td className="px-4 py-3 text-slate-600">{record.activityTypeName}</td><td className="px-4 py-3 whitespace-nowrap">{dateLabel(record.startDate)}</td><td className="px-4 py-3">{record.department}</td><td className="px-4 py-3 font-semibold text-indigo-700">{record.creditPoints}</td><td className="px-4 py-3"><Badge variant={record.verificationStatus === 'Verified' ? 'success' : record.verificationStatus === 'Rejected' ? 'danger' : 'warning'}>{record.verificationStatus}</Badge></td></tr>)}{filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No development activities match these filters.</td></tr>}</tbody></table></div></Card>

    <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form ? `Log Professional Development — ${form.activityName || 'New Activity'}` : 'Log Activity'} size="xl" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button variant="outline" onClick={() => save(true)}>Submit for Verification</Button><Button onClick={() => save(false)}>Save Activity</Button></div>}>
      {form && <div className="max-h-[76vh] space-y-4 overflow-y-auto pr-1">
        <Panel title="Panel 1 · Who"><div className="grid gap-4 md:grid-cols-3"><Field label="Teacher"><select className={inputClass} value={form.teacherId} onChange={(event) => updateTeacher(event.target.value)}>{TEACHER_STAFF.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name} — {teacher.designation}</option>)}</select></Field><Field label="Department"><input className={`${inputClass} bg-slate-50`} value={form.department} readOnly /></Field><Field label="Academic Year"><input className={`${inputClass} bg-slate-50`} value={form.academicYear} readOnly /></Field></div></Panel>
        <Panel title="Panel 2 · What"><div className="grid gap-4 md:grid-cols-2"><Field label="Activity Type"><select className={inputClass} value={form.activityTypeId} onChange={(event) => updateType(event.target.value)}>{types.filter((type) => type.status === 'Active').map((type) => <option key={type.id} value={type.id}>{type.icon} {type.name}</option>)}</select></Field><Field label="Activity Name"><input className={inputClass} value={form.activityName} onChange={(event) => updateForm('activityName', event.target.value)} placeholder="NEP 2020 Implementation — Teaching Strategies Workshop" /></Field><Field label="Organized By"><input className={inputClass} value={form.organizedBy} onChange={(event) => updateForm('organizedBy', event.target.value)} /></Field><Field label="Subject / Area"><input className={inputClass} value={form.subjectArea} onChange={(event) => updateForm('subjectArea', event.target.value)} /></Field><Field label="Level"><select className={inputClass} value={form.level} onChange={(event) => updateForm('level', event.target.value as ProfessionalDevelopmentRecord['level'])}>{levels.map((level) => <option key={level}>{level}</option>)}</select></Field><Field label="Mode"><select className={inputClass} value={form.mode} onChange={(event) => updateForm('mode', event.target.value as ProfessionalDevelopmentRecord['mode'])}>{modes.map((mode) => <option key={mode}>{mode}</option>)}</select></Field><Field label="Description"><textarea className={`${inputClass} min-h-20`} value={form.description} onChange={(event) => updateForm('description', event.target.value)} /></Field></div></Panel>
        <Panel title="Panel 3 · When"><div className="grid gap-4 md:grid-cols-3"><Field label="Start Date"><input type="date" className={inputClass} value={form.startDate} onChange={(event) => setDate('startDate', event.target.value)} /></Field><Field label="End Date"><input type="date" className={inputClass} value={form.endDate} onChange={(event) => setDate('endDate', event.target.value)} /></Field><Field label="Duration" hint="Auto-calculated from the date range."><input className={`${inputClass} bg-slate-50`} value={`${calculatedDuration} day(s) / ${calculatedDuration * 8} hours`} readOnly /></Field></div><div className="grid gap-3 md:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.workingDaysUsed > 0} onChange={(event) => updateForm('workingDaysUsed', event.target.checked ? Math.max(1, calculatedDuration) : 0)} />Working days used — {form.workingDaysUsed} day(s)</label><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.leaveApplied} onChange={(event) => { updateForm('leaveApplied', event.target.checked); if (event.target.checked) updateForm('workingDaysUsed', Math.max(1, calculatedDuration)); }} />Leave applied / approved</label></div><Field label="Leave Reference" hint="Linked Leave Module reference (demo field)."><input className={inputClass} value={form.leaveRef} onChange={(event) => updateForm('leaveRef', event.target.value)} placeholder="LEAVE-2025-0234" /></Field></Panel>
        <Panel title="Panel 4 · Where"><div className="grid gap-4 md:grid-cols-2"><Field label="Venue"><input className={inputClass} value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} placeholder="Organizer venue or online platform" /></Field><Field label="City"><input className={inputClass} value={form.city} onChange={(event) => updateForm('city', event.target.value)} /></Field><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.travelRequired} onChange={(event) => updateForm('travelRequired', event.target.checked)} />Travel required</label><Field label="Travel Expenses"><input type="number" min="0" className={inputClass} value={form.travelExpenses ?? ''} onChange={(event) => updateForm('travelExpenses', event.target.value === '' ? null : Number(event.target.value))} placeholder="Not applicable" /></Field></div></Panel>
        <Panel title="Panel 5 · Outcome & Learning"><div className="grid gap-4 md:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.certificateReceived} onChange={(event) => updateForm('certificateReceived', event.target.checked)} />Certificate received</label><Field label="Certificate Number"><input className={inputClass} value={form.certificateNumber} onChange={(event) => updateForm('certificateNumber', event.target.value)} /></Field><Field label="Certificate Issued By"><input className={inputClass} value={form.certificateIssuedBy} onChange={(event) => updateForm('certificateIssuedBy', event.target.value)} /></Field><Field label="Certificate File"><input type="file" className={inputClass} onChange={(event) => fileName('certificateFile', event.target.files?.[0])} /><span className="text-[11px] text-slate-500">{form.certificateFile || 'No certificate attached.'}</span></Field><Field label="Key Learnings"><textarea className={`${inputClass} min-h-24`} value={form.keyLearnings} onChange={(event) => updateForm('keyLearnings', event.target.value)} /></Field><Field label="How will you apply this?"><textarea className={`${inputClass} min-h-24`} value={form.applicationPlan} onChange={(event) => updateForm('applicationPlan', event.target.value)} /></Field></div><div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">Credit Points Earned: <strong>{calculatedCredits}</strong> · {currentType?.creditValue} {currentType?.creditBasis} (from Activity Master)</div></Panel>
        <Panel title="Panel 6 · Supporting Documents"><div className="grid gap-4 md:grid-cols-2"><Field label="Workshop Materials / Notes"><input type="file" className={inputClass} onChange={(event) => fileName('workshopMaterials', event.target.files?.[0])} /><span className="text-[11px] text-slate-500">{form.workshopMaterials || 'No file attached.'}</span></Field><Field label="Permission Letter"><input type="file" className={inputClass} onChange={(event) => fileName('permissionLetter', event.target.files?.[0])} /><span className="text-[11px] text-slate-500">{form.permissionLetter || 'No file attached.'}</span></Field><Field label="Photos"><input type="file" accept="image/*" multiple className={inputClass} onChange={(event) => fileName('photos', event.target.files?.[0])} /><span className="text-[11px] text-slate-500">{form.photos || 'No photos attached.'}</span></Field><Field label="Report to Management"><textarea className={`${inputClass} min-h-20`} value={form.managementReport} onChange={(event) => updateForm('managementReport', event.target.value)} placeholder="Brief report on learning and application" /></Field></div></Panel>
        <Panel title="Panel 7 · Approval & Visibility"><div className="grid gap-3 md:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-xs"><input type="checkbox" checked={form.hodVerified} onChange={(event) => updateForm('hodVerified', event.target.checked)} />HOD verified — teacher belongs to selected department</label><Field label="Principal Approval"><select className={inputClass} value={form.principalStatus} onChange={(event) => updateForm('principalStatus', event.target.value as ProfessionalDevelopmentRecord['principalStatus'])}><option>Pending</option><option>Approved</option><option>Rejected</option></select></Field></div><div><p className={labelClass}>Appear on</p><div className="grid gap-2 md:grid-cols-2">{[['showOnTeacherProfile', "Teacher's Profile Page"], ['includeAnnualReport', 'Annual Staff Development Report'], ['showOnWebsite', 'School Website / Newsletter'], ['showOnParentPortal', 'Parent Portal']].map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs"><input type="checkbox" checked={Boolean(form[key as keyof ProfessionalDevelopmentRecord])} onChange={(event) => updateForm(key as keyof ProfessionalDevelopmentRecord, event.target.checked as never)} />{label}</label>)}</div></div><Badge variant={form.verificationStatus === 'Verified' ? 'success' : 'warning'}>Verification: {form.verificationStatus}</Badge></Panel>
      </div>}
    </Modal>
  </div>;
}
