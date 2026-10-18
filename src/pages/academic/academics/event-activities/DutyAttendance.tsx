import React, { useMemo, useState } from 'react';
import { Download, Save } from 'lucide-react';
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
const markStatuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Substituted'];
const completeStatuses: AttendanceStatus[] = ['Present', 'Late', 'Substituted'];
const dateTitle = (value: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '';
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
  const [remarksByKey, setRemarksByKey] = useState<Record<string, string>>({});
  const [substituteByKey, setSubstituteByKey] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const assignmentsForDate = useMemo(() => assignments.filter((assignment) => assignment.date === date && (dutyFilter === 'All' || assignment.dutyTypeId === dutyFilter || assignment.dutyTypeName === dutyFilter)), [assignments, date, dutyFilter]);
  const attendanceRows = useMemo(() => assignmentsForDate.flatMap((assignment) => assignment.teachers.map((teacher) => {
    const found = attendance.find((record) => record.assignmentId === assignment.id && record.teacherName === teacher);
    const key = `${assignment.id}::${teacher}`;
    return {
      key,
      assignment,
      teacherName: teacher,
      status: found?.status || fallbackAttendanceStatus(assignment, attendance),
      substituteTeacher: substituteByKey[key] ?? found?.substituteTeacher ?? assignment.substituteTeacher,
      remarks: remarksByKey[key] ?? found?.remarks ?? ''
    };
  })), [assignmentsForDate, attendance, remarksByKey, substituteByKey]);
  const presentCount = attendanceRows.filter((row) => row.status === 'Present' || row.status === 'Late').length;
  const absenceCount = attendanceRows.filter((row) => row.status === 'Absent').length;
  const lateCount = attendanceRows.filter((row) => row.status === 'Late').length;

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
  const markRow = (assignment: DutyAssignmentRecord, teacherName: string, status: AttendanceStatus, substituteTeacher: string, remarks: string) => {
    const old = attendance.find((item) => item.assignmentId === assignment.id && item.teacherName === teacherName);
    const oldStatus = old?.status || findCurrentStatus(assignment, teacherName);
    const record: DutyAttendanceRecord = { id: old?.id || createTeacherRecordId('att'), assignmentId: assignment.id, date: assignment.date, dutyTypeId: assignment.dutyTypeId, dutyTypeName: assignment.dutyTypeName, teacherName, status, substituteTeacher: status === 'Substituted' || status === 'Absent' ? substituteTeacher : '', remarks };
    const nextAttendance = old ? attendance.map((item) => item.id === old.id ? record : item) : [record, ...attendance];
    persistAttendance(nextAttendance);
    const wasCounted = oldStatus !== 'Upcoming';
    const doneBefore = completeStatuses.includes(oldStatus);
    const doneNow = completeStatuses.includes(status);
    const absentBefore = oldStatus === 'Absent';
    const absentNow = status === 'Absent';
    let nextSummary = adjustSummary(monthSummary, teacherName, wasCounted ? 0 : 1, Number(doneNow) - Number(doneBefore), Number(absentNow) - Number(absentBefore));
    const previousSubstitute = oldStatus === 'Substituted' ? old?.substituteTeacher || assignment.substituteTeacher : '';
    if (previousSubstitute) nextSummary = adjustSummary(nextSummary, previousSubstitute, -1, -1, 0);
    if (status === 'Substituted' && substituteTeacher) nextSummary = adjustSummary(nextSummary, substituteTeacher, 1, 1, 0);
    if (nextSummary !== monthSummary) persistSummary(nextSummary);
    const updatedAssignments = assignments.map((item) => {
      if (item.id !== assignment.id) return item;
      const peerStatuses = item.teachers.map((name) => name === teacherName ? status : findCurrentStatus(item, name));
      const nextStatus: DutyAssignmentRecord['status'] = peerStatuses.includes('Absent') ? 'Absent' : peerStatuses.includes('Substituted') ? 'Substituted' : peerStatuses.every((value) => completeStatuses.includes(value)) ? 'Done' : 'Scheduled';
      return { ...item, status: nextStatus, substituteTeacher: status === 'Absent' || status === 'Substituted' ? substituteTeacher : item.substituteTeacher };
    });
    setAssignments(updatedAssignments); saveTeacherCollection(DUTY_ASSIGNMENTS_STORAGE_KEY, updatedAssignments);
    setMessage(`${teacherName} marked ${status.toLowerCase()} for ${assignment.dutyTypeName}.`);
    window.setTimeout(() => setMessage(''), 2500);
  };
  const exportDaily = () => downloadTeacherCsv('duty-attendance.csv', attendanceRows.map((row) => ({ Date: date, Duty: row.assignment.dutyTypeName, Time: `${row.assignment.startTime}–${row.assignment.endTime}`, Teacher: row.teacherName, Status: row.status, Substitute: row.substituteTeacher, Remarks: row.remarks })));
  const markAllPresent = () => {
    attendanceRows.forEach((row) => {
      if (row.status !== 'Present') markRow(row.assignment, row.teacherName, 'Present', '', row.remarks);
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Duty Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">Mark the daily duty register — present, absent, late or substituted — like a class attendance sheet.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label><span className={labelClass}>Date</span><input type="date" className={inputClass} value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label><span className={labelClass}>Duty Type</span><select className={inputClass} value={dutyFilter} onChange={(event) => setDutyFilter(event.target.value)}><option>All</option>{duties.map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}</select></label>
          <div className="flex items-end gap-2">
            <Button variant="outline" leftIcon={<Save className="h-4 w-4" />} onClick={markAllPresent}>Mark all present</Button>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportDaily}>Export</Button>
          </div>
        </div>
      </div>
      {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card noPadding className="overflow-hidden border-slate-300">
        <div className="border-b border-slate-300 bg-slate-100 px-4 py-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Daily Duty Register</p>
              <h2 className="text-lg font-bold text-slate-900">{dateTitle(date)}</h2>
            </div>
            <div className="flex gap-4 text-center text-xs">
              <div><p className="text-lg font-bold text-emerald-700">{presentCount}</p><p className="text-slate-500">Present</p></div>
              <div><p className="text-lg font-bold text-amber-600">{lateCount}</p><p className="text-slate-500">Late</p></div>
              <div><p className="text-lg font-bold text-rose-600">{absenceCount}</p><p className="text-slate-500">Absent</p></div>
              <div><p className="text-lg font-bold text-slate-700">{attendanceRows.length}</p><p className="text-slate-500">On register</p></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-center text-[11px] uppercase tracking-wide text-slate-600">
                <th className="border border-slate-300 px-2 py-2">#</th>
                <th className="border border-slate-300 px-3 py-2 text-left">Teacher</th>
                <th className="border border-slate-300 px-3 py-2 text-left">Duty</th>
                <th className="border border-slate-300 px-3 py-2">Time</th>
                <th className="border border-slate-300 px-2 py-2">P</th>
                <th className="border border-slate-300 px-2 py-2">A</th>
                <th className="border border-slate-300 px-2 py-2">L</th>
                <th className="border border-slate-300 px-2 py-2">Sub</th>
                <th className="border border-slate-300 px-3 py-2 text-left">Substitute</th>
                <th className="border border-slate-300 px-3 py-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows.map((row, index) => (
                <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="border border-slate-300 px-2 py-2 text-center text-slate-400">{index + 1}</td>
                  <td className="border border-slate-300 px-3 py-2 font-medium text-slate-800">{row.teacherName}</td>
                  <td className="border border-slate-300 px-3 py-2">{row.assignment.dutyTypeName}<span className="block text-[11px] text-slate-500">{row.assignment.location}</span></td>
                  <td className="border border-slate-300 px-3 py-2 text-center whitespace-nowrap text-slate-600">{row.assignment.startTime} – {row.assignment.endTime}</td>
                  {markStatuses.map((status) => {
                    const active = row.status === status;
                    const colors = status === 'Present' ? 'bg-emerald-600 text-white' : status === 'Absent' ? 'bg-rose-600 text-white' : status === 'Late' ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white';
                    const letter = status === 'Present' ? 'P' : status === 'Absent' ? 'A' : status === 'Late' ? 'L' : 'S';
                    return (
                      <td key={status} className="border border-slate-300 px-1 py-1 text-center">
                        <button type="button" title={status} onClick={() => markRow(row.assignment, row.teacherName, status, row.substituteTeacher, row.remarks)} className={`h-8 w-8 rounded-full text-xs font-bold ${active ? colors : 'bg-white text-slate-400 hover:bg-slate-100'}`}>{letter}</button>
                      </td>
                    );
                  })}
                  <td className="border border-slate-300 px-2 py-1">
                    <select className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs" value={row.substituteTeacher} onChange={(event) => { const value = event.target.value; setSubstituteByKey((current) => ({ ...current, [row.key]: value })); if (row.status === 'Absent' || row.status === 'Substituted') markRow(row.assignment, row.teacherName, row.status === 'Absent' ? 'Absent' : 'Substituted', value, row.remarks); }}>
                      <option value="">—</option>
                      {TEACHER_STAFF.filter((teacher) => teacher.name !== row.teacherName).map((teacher) => <option key={teacher.id}>{teacher.name}</option>)}
                    </select>
                  </td>
                  <td className="border border-slate-300 px-2 py-1">
                    <input className="w-full rounded border border-slate-200 px-2 py-1 text-xs" value={row.remarks} placeholder="Note" onChange={(event) => setRemarksByKey((current) => ({ ...current, [row.key]: event.target.value }))} onBlur={(event) => { if (row.status !== 'Upcoming') markRow(row.assignment, row.teacherName, row.status, row.substituteTeacher, event.target.value); }} />
                  </td>
                </tr>
              ))}
              {attendanceRows.length === 0 && <tr><td colSpan={10} className="border border-slate-300 px-4 py-12 text-center text-sm text-slate-400">No duties are on the register for this date.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 border-t border-slate-300 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
          <span><Badge variant="success">P</Badge> Present</span>
          <span><Badge variant="danger">A</Badge> Absent</span>
          <span><Badge variant="warning">L</Badge> Late</span>
          <span><Badge variant="info">S</Badge> Substituted</span>
          <span className="ml-auto">Tap a letter to mark the sheet. Remarks save when you leave the field.</span>
        </div>
      </Card>
    </div>
  );
}
