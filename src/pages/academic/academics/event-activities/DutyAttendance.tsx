import React, { useMemo, useState } from 'react';
import { Download, FileText, Save } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  DEFAULT_DUTY_ASSIGNMENTS,
  DEFAULT_DUTY_ATTENDANCE,
  DEFAULT_DUTY_MONTH_SUMMARY,
  DEFAULT_DUTY_TYPES,
  DUTY_ASSIGNMENTS_STORAGE_KEY,
  DUTY_ATTENDANCE_STORAGE_KEY,
  DUTY_MONTH_SUMMARY_STORAGE_KEY,
  DUTY_TYPES_STORAGE_KEY,
  TEACHER_STAFF,
  DutyAssignmentRecord,
  DutyAttendanceRecord,
  DutyMonthlySummaryRecord,
  createTeacherRecordId,
  downloadTeacherCsv,
  loadTeacherCollection,
  saveTeacherCollection
} from './teacherData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const labelClass = 'mb-1 block text-xs font-semibold text-slate-600';
type AttendanceStatus = DutyAttendanceRecord['status'];
const statusVariant = (status: AttendanceStatus): 'success' | 'warning' | 'danger' | 'info' | 'default' => status === 'Present' ? 'success' : status === 'Absent' ? 'danger' : status === 'Late' || status === 'Substituted' ? 'warning' : 'info';
const dateTitle = (value: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
const completeStatuses: AttendanceStatus[] = ['Present', 'Late', 'Substituted'];
const fallbackAttendanceStatus = (assignment: DutyAssignmentRecord, records: DutyAttendanceRecord[]): AttendanceStatus => {
  if (assignment.status === 'Done') return 'Present';
  const hasIndividualRecords = records.some((record) => record.assignmentId === assignment.id);
  if (!hasIndividualRecords && assignment.status === 'Absent') return 'Absent';
  if (!hasIndividualRecords && assignment.status === 'Substituted') return 'Substituted';
  return 'Upcoming';
};

export function DutyAttendance() {
  const [assignments, setAssignments] = useState<DutyAssignmentRecord[]>(() => loadTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, DEFAULT_DUTY_ASSIGNMENTS));
  const [attendance, setAttendance] = useState<DutyAttendanceRecord[]>(() => loadTeacherCollection(DUTY_ATTENDANCE_STORAGE_KEY, DEFAULT_DUTY_ATTENDANCE));
  const [duties] = useState(() => loadTeacherCollection(DUTY_TYPES_STORAGE_KEY, DEFAULT_DUTY_TYPES));
  const [monthSummary, setMonthSummary] = useState<DutyMonthlySummaryRecord[]>(() => loadTeacherCollection(DUTY_MONTH_SUMMARY_STORAGE_KEY, DEFAULT_DUTY_MONTH_SUMMARY));
  const [date, setDate] = useState('2025-11-27');
  const [dutyFilter, setDutyFilter] = useState('All');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('da-2511-lunch-3');
  const [teacherName, setTeacherName] = useState('Mr. D. Joshi');
  const [status, setStatus] = useState<AttendanceStatus>('Present');
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  const assignmentsForDate = useMemo(() => assignments.filter((assignment) => assignment.date === date && (dutyFilter === 'All' || assignment.dutyTypeId === dutyFilter)), [assignments, date, dutyFilter]);
  const attendanceRows = useMemo(() => assignmentsForDate.flatMap((assignment) => assignment.teachers.map((teacher) => {
    const found = attendance.find((record) => record.assignmentId === assignment.id && record.teacherName === teacher);
    return { assignment, teacherName: teacher, status: found?.status || fallbackAttendanceStatus(assignment, attendance), substituteTeacher: found?.substituteTeacher || assignment.substituteTeacher, remarks: found?.remarks || '' };
  })), [assignmentsForDate, attendance]);
  const selectedAssignment = assignmentsForDate.find((item) => item.id === selectedAssignmentId) || assignmentsForDate[0];
  const attendanceCount = attendanceRows.filter((row) => row.status === 'Present' || row.status === 'Late' || row.status === 'Substituted').length;
  const absenceCount = attendanceRows.filter((row) => row.status === 'Absent').length;

  const changeDate = (nextDate: string) => {
    setDate(nextDate);
    const first = assignments.find((assignment) => assignment.date === nextDate && (dutyFilter === 'All' || assignment.dutyTypeId === dutyFilter));
    setSelectedAssignmentId(first?.id || '');
    setTeacherName(first?.teachers[0] || '');
  };
  const changeDutyFilter = (nextFilter: string) => {
    setDutyFilter(nextFilter);
    const first = assignments.find((assignment) => assignment.date === date && (nextFilter === 'All' || assignment.dutyTypeId === nextFilter));
    setSelectedAssignmentId(first?.id || '');
    setTeacherName(first?.teachers[0] || '');
  };
  const persistAttendance = (next: DutyAttendanceRecord[]) => { setAttendance(next); saveTeacherCollection(DUTY_ATTENDANCE_STORAGE_KEY, next); };
  const persistSummary = (next: DutyMonthlySummaryRecord[]) => { setMonthSummary(next); saveTeacherCollection(DUTY_MONTH_SUMMARY_STORAGE_KEY, next); };
  const adjustSummary = (records: DutyMonthlySummaryRecord[], name: string, totalDelta: number, doneDelta: number, absenceDelta: number) => {
    if (!name || (!totalDelta && !doneDelta && !absenceDelta)) return records;
    const existing = records.find((item) => item.teacherName === name);
    const nextRecord: DutyMonthlySummaryRecord = {
      teacherName: name,
      totalDuties: Math.max(0, (existing?.totalDuties || 0) + totalDelta),
      dutiesDone: Math.max(0, (existing?.dutiesDone || 0) + doneDelta),
      absences: Math.max(0, (existing?.absences || 0) + absenceDelta),
      note: Math.max(0, (existing?.absences || 0) + absenceDelta) > 0 ? `${Math.max(0, (existing?.absences || 0) + absenceDelta)} absence(s) — review needed` : '0 absences — Excellent'
    };
    return existing ? records.map((item) => item.teacherName === name ? nextRecord : item) : [...records, nextRecord];
  };
  const findCurrentStatus = (assignment: DutyAssignmentRecord, name: string): AttendanceStatus => {
    const found = attendance.find((item) => item.assignmentId === assignment.id && item.teacherName === name);
    if (found) return found.status;
    return fallbackAttendanceStatus(assignment, attendance);
  };
  const markAttendance = () => {
    if (!selectedAssignment || !teacherName) return;
    const old = attendance.find((item) => item.assignmentId === selectedAssignment.id && item.teacherName === teacherName);
    const oldStatus = old?.status || findCurrentStatus(selectedAssignment, teacherName);
    const record: DutyAttendanceRecord = { id: old?.id || createTeacherRecordId('att'), assignmentId: selectedAssignment.id, date: selectedAssignment.date, dutyTypeId: selectedAssignment.dutyTypeId, dutyTypeName: selectedAssignment.dutyTypeName, teacherName, status, substituteTeacher: status === 'Substituted' || status === 'Absent' ? substituteTeacher : '', remarks };
    const nextAttendance = old ? attendance.map((item) => item.id === old.id ? record : item) : [record, ...attendance];
    persistAttendance(nextAttendance);
    const wasCounted = oldStatus !== 'Upcoming';
    const doneBefore = completeStatuses.includes(oldStatus);
    const doneNow = completeStatuses.includes(status);
    const absentBefore = oldStatus === 'Absent';
    const absentNow = status === 'Absent';
    let nextSummary = adjustSummary(monthSummary, teacherName, wasCounted ? 0 : 1, Number(doneNow) - Number(doneBefore), Number(absentNow) - Number(absentBefore));
    const previousSubstitute = oldStatus === 'Substituted' ? old?.substituteTeacher || selectedAssignment.substituteTeacher : '';
    if (previousSubstitute) nextSummary = adjustSummary(nextSummary, previousSubstitute, -1, -1, 0);
    if (status === 'Substituted' && substituteTeacher) nextSummary = adjustSummary(nextSummary, substituteTeacher, 1, 1, 0);
    if (nextSummary !== monthSummary) persistSummary(nextSummary);
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id !== selectedAssignment.id) return assignment;
      const peerStatuses = assignment.teachers.map((name) => name === teacherName ? status : findCurrentStatus(assignment, name));
      const nextStatus: DutyAssignmentRecord['status'] = peerStatuses.includes('Absent') ? 'Absent' : peerStatuses.includes('Substituted') ? 'Substituted' : peerStatuses.every((value) => completeStatuses.includes(value)) ? 'Done' : 'Scheduled';
      return { ...assignment, status: nextStatus, substituteTeacher: status === 'Absent' || status === 'Substituted' ? substituteTeacher : assignment.substituteTeacher };
    });
    setAssignments(updatedAssignments); saveTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, updatedAssignments);
    setRemarks(''); setMessage(`${teacherName} marked ${status.toLowerCase()} for ${selectedAssignment.dutyTypeName}.`); window.setTimeout(() => setMessage(''), 3500);
  };
  const selectRow = (assignment: DutyAssignmentRecord, name: string, rowStatus: AttendanceStatus, substitute: string, rowRemarks: string) => {
    setSelectedAssignmentId(assignment.id); setTeacherName(name); setStatus(rowStatus); setSubstituteTeacher(substitute); setRemarks(rowRemarks);
  };
  const exportDaily = () => downloadTeacherCsv('duty-attendance.csv', attendanceRows.map((row) => ({ Date: date, Duty: row.assignment.dutyTypeName, Time: `${row.assignment.startTime}–${row.assignment.endTime}`, Teacher: row.teacherName, Status: row.status, Substitute: row.substituteTeacher, Remarks: row.remarks })));
  const statusToDelta = (record: DutyMonthlySummaryRecord) => record.totalDuties ? `${record.dutiesDone} / ${record.totalDuties}` : '0 / 0';

  return <div className="space-y-6 p-4 md:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">📋 Duty Attendance</h1><p className="mt-1 text-sm text-slate-500">Record present, absent, late or substituted status for assigned duties.</p></div><div className="flex flex-wrap gap-2"><label><span className={labelClass}>Date</span><input type="date" className={inputClass} value={date} onChange={(event) => changeDate(event.target.value)} /></label><label><span className={labelClass}>Duty Type</span><select className={inputClass} value={dutyFilter} onChange={(event) => changeDutyFilter(event.target.value)}><option>All</option>{duties.map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}</select></label><div className="flex items-end"><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportDaily}>Export</Button></div></div></div>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <div className="grid gap-3 sm:grid-cols-3"><Card><p className="text-2xl font-bold text-indigo-700">{assignmentsForDate.length}</p><p className="text-xs text-slate-500">Duty assignments · {dateTitle(date)}</p></Card><Card><p className="text-2xl font-bold text-emerald-700">{attendanceCount}</p><p className="text-xs text-slate-500">Present / completed / substituted</p></Card><Card><p className="text-2xl font-bold text-rose-600">{absenceCount}</p><p className="text-xs text-slate-500">Absences recorded</p></Card></div>
    <Card title="Today's Duties Status" noPadding><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Duty Type &amp; Time</th><th className="px-4 py-3">Assigned Teacher</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Substitute / Remarks</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{attendanceRows.map((row, index) => <tr key={`${row.assignment.id}-${row.teacherName}`} className="hover:bg-indigo-50/30"><td className="px-4 py-3 text-slate-400">{index + 1}</td><td className="px-4 py-3"><p className="font-semibold text-slate-800">{duties.find((item) => item.id === row.assignment.dutyTypeId)?.icon} {row.assignment.dutyTypeName}</p><p className="text-[11px] text-slate-500">{row.assignment.startTime} — {row.assignment.endTime}</p></td><td className="px-4 py-3">{row.teacherName}</td><td className="px-4 py-3"><Badge variant={statusVariant(row.status)}>{row.status}</Badge></td><td className="px-4 py-3 text-xs text-slate-600">{row.substituteTeacher || row.remarks || '—'}</td><td className="px-4 py-3 text-right"><Button size="xs" variant="outline" onClick={() => selectRow(row.assignment, row.teacherName, row.status, row.substituteTeacher, row.remarks)}><FileText className="h-3.5 w-3.5" />Note / Mark</Button></td></tr>)}{attendanceRows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No duties are scheduled for this date and filter.</td></tr>}</tbody></table></div></Card>

    <Card title="Mark Duty Completion"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><label><span className={labelClass}>Duty</span><select className={inputClass} value={selectedAssignment?.id || ''} onChange={(event) => { const assignment = assignments.find((item) => item.id === event.target.value); setSelectedAssignmentId(event.target.value); if (assignment) setTeacherName(assignment.teachers[0] || ''); }}><option value="">Select duty…</option>{assignmentsForDate.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.dutyTypeName} · {assignment.startTime}</option>)}</select></label><label><span className={labelClass}>Teacher</span><select className={inputClass} value={teacherName} onChange={(event) => setTeacherName(event.target.value)}>{(selectedAssignment?.teachers.length ? selectedAssignment.teachers : TEACHER_STAFF.map((teacher) => teacher.name)).map((name) => <option key={name}>{name}</option>)}</select></label><label><span className={labelClass}>Status</span><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as AttendanceStatus)}>{['Present','Absent','Late','Substituted','Upcoming'].map((value) => <option key={value}>{value}</option>)}</select></label>{(status === 'Absent' || status === 'Substituted') && <label><span className={labelClass}>Substitute Teacher</span><select className={inputClass} value={substituteTeacher} onChange={(event) => setSubstituteTeacher(event.target.value)}><option value="">Select substitute…</option>{TEACHER_STAFF.filter((teacher) => teacher.name !== teacherName).map((teacher) => <option key={teacher.id}>{teacher.name}</option>)}</select></label>}</div><label className="mt-4 block"><span className={labelClass}>Remarks</span><input className={inputClass} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Absence reason, late arrival or supervisor note" /></label><div className="mt-4 flex justify-end"><Button leftIcon={<Save className="h-4 w-4" />} onClick={markAttendance} disabled={!selectedAssignmentId || !teacherName}>Mark Attendance</Button></div></Card>

    <Card title="Duty Absence Summary — This Month" noPadding><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Total Duties</th><th className="px-4 py-3">Duties Done</th><th className="px-4 py-3">Absences / Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{monthSummary.map((record) => <tr key={record.teacherName}><td className="px-4 py-3 font-medium">{record.teacherName}</td><td className="px-4 py-3">{record.totalDuties}</td><td className="px-4 py-3">{record.dutiesDone}</td><td className="px-4 py-3"><span className={record.absences ? 'text-amber-700' : 'text-emerald-700'}>{record.note}</span></td></tr>)}</tbody></table></div><p className="mt-3 px-4 pb-4 text-[10px] text-slate-400">Completion ratio = duties done / total duty records: {monthSummary.map(statusToDelta).join(' · ')}</p></Card>
  </div>;
}
