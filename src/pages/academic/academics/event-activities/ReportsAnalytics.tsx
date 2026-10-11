import React, { useMemo, useState } from 'react';
import { Download, FileDown, FileText, Printer, Search } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import {
  COMPETITION_EVENTS_STORAGE_KEY,
  COMPETITION_PARTICIPANTS_STORAGE_KEY,
  COMPETITION_RESULTS_STORAGE_KEY,
  DEFAULT_COMPETITION_EVENTS,
  DEFAULT_COMPETITION_PARTICIPANTS,
  DEFAULT_COMPETITION_RESULTS,
  CompetitionEventRecord,
  CompetitionParticipantRecord,
  CompetitionStudentResult,
  loadCompetitionCollection
} from './competitionData';
import {
  DEFAULT_EVENT_EXECUTIONS,
  DEFAULT_EVENT_REVIEWS,
  DEFAULT_SCHOOL_EVENTS,
  EVENT_EXECUTIONS_STORAGE_KEY,
  EVENT_REVIEWS_STORAGE_KEY,
  SCHOOL_EVENTS_STORAGE_KEY,
  EventExecutionSnapshot,
  EventReviewRecord,
  SchoolEventRecord,
  loadEventCollection
} from './eventData';
import {
  DEFAULT_DUTY_ASSIGNMENTS,
  DEFAULT_DUTY_ATTENDANCE,
  DEFAULT_DUTY_MONTH_SUMMARY,
  DEFAULT_DUTY_TYPES,
  DEFAULT_PROFESSIONAL_DEVELOPMENT,
  DEFAULT_TEACHER_ACHIEVEMENTS,
  DUTY_ASSIGNMENTS_STORAGE_KEY,
  DUTY_ATTENDANCE_STORAGE_KEY,
  DUTY_MONTH_SUMMARY_STORAGE_KEY,
  DUTY_TYPES_STORAGE_KEY,
  PROFESSIONAL_DEVELOPMENT_STORAGE_KEY,
  TEACHER_ACHIEVEMENTS_STORAGE_KEY,
  DutyAssignmentRecord,
  DutyAttendanceRecord,
  DutyMonthlySummaryRecord,
  DutyTypeRecord,
  ProfessionalDevelopmentRecord,
  TeacherAchievementRecord,
  downloadTeacherCsv,
  loadTeacherCollection
} from './teacherData';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';
type CsvRow = Record<string, string | number | boolean>;
interface ReportItem { id: number; title: string; }
const reportGroups: Array<{ category: string; icon: string; reports: ReportItem[] }> = [
  { category: 'Competition Reports', icon: '🏆', reports: [
    { id: 1, title: 'All Competitions This Year Report' }, { id: 2, title: 'Student Participation Summary Report' }, { id: 3, title: 'Class-wise Competition Participation' }, { id: 4, title: 'School Achievements & Medals Report' }, { id: 5, title: 'Student-wise Achievement Record' }, { id: 6, title: 'Inter-House Competition Points Report' }, { id: 7, title: 'External Competition Registration Report' }, { id: 8, title: 'Pending Results Report' }
  ] },
  { category: 'Event Reports', icon: '🎉', reports: [
    { id: 9, title: 'All Events This Year Report' }, { id: 10, title: 'Events Budget vs Actual Report' }, { id: 11, title: 'Event Attendance Report' }, { id: 12, title: 'Upcoming Events Calendar Report' }, { id: 13, title: 'Event Coordinator Performance Report' }, { id: 14, title: 'Event Photos & Documentation Log' }
  ] },
  { category: 'Teacher Activities Reports', icon: '👩‍🏫', reports: [
    { id: 15, title: 'Teacher Professional Development Summary' }, { id: 16, title: 'Department-wise Training Report' }, { id: 17, title: 'Teacher-wise Activity Report' }, { id: 18, title: 'Certifications Earned This Year' }, { id: 19, title: 'Teacher Achievements Report' }, { id: 20, title: 'Credit Points Summary — All Teachers' }, { id: 21, title: 'External Training Days Used Report' }
  ] },
  { category: 'Duty Reports', icon: '📋', reports: [
    { id: 22, title: 'Complete Duty Roster Report' }, { id: 23, title: 'Teacher Duty Count Report' }, { id: 24, title: 'Duty Absence Report' }, { id: 25, title: 'Invigilation Duty Report (Per Exam)' }, { id: 26, title: 'Substitute Duty Report' }, { id: 27, title: 'Monthly Duty Summary' }, { id: 28, title: 'Teacher-wise Duty Performance Report' }
  ] },
  { category: 'Combined / Analytics', icon: '📊', reports: [
    { id: 29, title: 'Annual School Activity Report (All)' }, { id: 30, title: 'Student Achievement Data (for TC/RC)' }, { id: 31, title: 'CBSE Annual Return Support Data' }, { id: 32, title: 'Staff Performance Summary (Activities)' }
  ] }
];
const allReports = reportGroups.flatMap((group) => group.reports.map((report) => ({ ...report, category: group.category })));
const groupRows = (rows: CsvRow[], field: string, valueField: string, sumField?: string): CsvRow[] => {
  const grouped = new Map<string, { count: number; sum: number }>();
  rows.forEach((row) => {
    const key = String(row[field] || 'Unspecified');
    const current = grouped.get(key) || { count: 0, sum: 0 };
    current.count += 1;
    current.sum += Number(sumField ? row[sumField] || 0 : 0);
    grouped.set(key, current);
  });
  return [...grouped.entries()].map(([name, value]) => ({ [valueField]: name, Records: value.count, ...(sumField ? { [sumField]: value.sum } : {}) }));
};
const inPeriod = (date: string, period: string) => {
  if (period === 'All Periods' || !date) return true;
  const [startYear] = period.replace('AY ', '').split('-');
  const start = `${startYear}-04-01`;
  const end = `${Number(startYear) + 1}-03-31`;
  return date >= start && date <= end;
};
const eventBudgetRows = (events: SchoolEventRecord[]): CsvRow[] => events.flatMap((event) => event.budgetItems.map((budget) => ({ Event: event.name, Date: event.date, Item: budget.item, Estimated: budget.estimatedCost, Actual: budget.actualCost ?? '', Variance: budget.actualCost === null ? '' : budget.actualCost - budget.estimatedCost, Vendor: budget.vendor })));

export function ReportsAnalytics() {
  const [period, setPeriod] = useState('AY 2025-26');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<{ report: ReportItem & { category: string }; rows: CsvRow[] } | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Record<number, number>>({});
  const [message, setMessage] = useState('');

  const competitionEvents = loadCompetitionCollection<CompetitionEventRecord[]>(COMPETITION_EVENTS_STORAGE_KEY, DEFAULT_COMPETITION_EVENTS).filter((item) => inPeriod(item.startDate, period));
  const competitionParticipants = loadCompetitionCollection<CompetitionParticipantRecord[]>(COMPETITION_PARTICIPANTS_STORAGE_KEY, DEFAULT_COMPETITION_PARTICIPANTS).filter((item) => competitionEvents.some((event) => event.id === item.eventId));
  const competitionResults = loadCompetitionCollection<CompetitionStudentResult[]>(COMPETITION_RESULTS_STORAGE_KEY, DEFAULT_COMPETITION_RESULTS).filter((item) => competitionEvents.some((event) => event.id === item.eventId));
  const schoolEvents = loadEventCollection<SchoolEventRecord[]>(SCHOOL_EVENTS_STORAGE_KEY, DEFAULT_SCHOOL_EVENTS).filter((item) => inPeriod(item.date, period));
  const eventExecutions = loadEventCollection<EventExecutionSnapshot[]>(EVENT_EXECUTIONS_STORAGE_KEY, DEFAULT_EVENT_EXECUTIONS).filter((item) => schoolEvents.some((event) => event.id === item.eventId));
  const eventReviews = loadEventCollection<EventReviewRecord[]>(EVENT_REVIEWS_STORAGE_KEY, DEFAULT_EVENT_REVIEWS).filter((item) => schoolEvents.some((event) => event.id === item.eventId));
  const pdRecords = loadTeacherCollection<ProfessionalDevelopmentRecord[]>(PROFESSIONAL_DEVELOPMENT_STORAGE_KEY, DEFAULT_PROFESSIONAL_DEVELOPMENT).filter((item) => item.academicYear === period.replace('AY ', '') || period === 'All Periods' || inPeriod(item.startDate, period));
  const achievements = loadTeacherCollection<TeacherAchievementRecord[]>(TEACHER_ACHIEVEMENTS_STORAGE_KEY, DEFAULT_TEACHER_ACHIEVEMENTS).filter((item) => inPeriod(item.date, period));
  const dutyTypes = loadTeacherCollection<DutyTypeRecord[]>(DUTY_TYPES_STORAGE_KEY, DEFAULT_DUTY_TYPES);
  const dutyAssignments = loadTeacherCollection<DutyAssignmentRecord[]>(DUTY_ASSIGNMENTS_STORAGE_KEY, DEFAULT_DUTY_ASSIGNMENTS).filter((item) => inPeriod(item.date, period));
  const dutyAttendance = loadTeacherCollection<DutyAttendanceRecord[]>(DUTY_ATTENDANCE_STORAGE_KEY, DEFAULT_DUTY_ATTENDANCE).filter((item) => inPeriod(item.date, period));
  const dutySummary = loadTeacherCollection<DutyMonthlySummaryRecord[]>(DUTY_MONTH_SUMMARY_STORAGE_KEY, DEFAULT_DUTY_MONTH_SUMMARY);

  const filteredReports = useMemo(() => allReports.filter((report) => `${report.title} ${report.category}`.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const reportRows = (id: number): CsvRow[] => {
    const compEventRows: CsvRow[] = competitionEvents.map((item) => ({ Event: item.name, Type: item.typeName, Level: item.level, Date: item.startDate, Status: item.status, Organizer: item.organizerMode }));
    const participantRows: CsvRow[] = competitionParticipants.map((item) => ({ Student: item.studentName, Class: item.className, RollNumber: item.rollNumber, Event: competitionEvents.find((event) => event.id === item.eventId)?.name || item.eventId, Registration: item.registrationStatus, ParentConsent: item.parentConsent }));
    const resultRows: CsvRow[] = competitionResults.map((item) => ({ Student: item.studentName, Class: item.className, Position: item.position, Award: item.award, House: item.house, HousePoints: item.housePoints, Score: item.score }));
    const schoolEventRows: CsvRow[] = schoolEvents.map((item) => ({ Event: item.name, Type: item.typeName, Date: item.date, Venue: item.venueName, Status: item.status, ExpectedAttendance: item.expectedAttendance, EstimatedBudget: item.budgetItems.reduce((sum, line) => sum + line.estimatedCost, 0) }));
    const pdRows: CsvRow[] = pdRecords.map((item) => ({ Teacher: item.teacherName, Department: item.department, Activity: item.activityName, Type: item.activityTypeName, Date: item.startDate, EndDate: item.endDate, Mode: item.mode, CreditPoints: item.creditPoints, WorkingDaysUsed: item.workingDaysUsed, Certificate: item.certificateReceived, Verification: item.verificationStatus }));
    const achievementRows: CsvRow[] = achievements.map((item) => ({ Teacher: item.teacherName, Achievement: item.achievement, Category: item.category, AwardedBy: item.awardedBy, Date: item.date, Level: item.level, Points: item.points, Verified: item.verified }));
    const dutyRows: CsvRow[] = dutyAssignments.map((item) => ({ Duty: item.dutyTypeName, Date: item.date, Time: `${item.startTime}–${item.endTime}`, Teachers: item.teachers.join('; '), Status: item.status, Substitute: item.substituteTeacher, Location: item.location }));
    if (id === 1) return compEventRows;
    if (id === 2) return participantRows;
    if (id === 3) return groupRows(participantRows, 'Class', 'Class');
    if (id === 4 || id === 5) return resultRows;
    if (id === 6) return groupRows(resultRows, 'House', 'House', 'HousePoints');
    if (id === 7) return compEventRows.filter((row) => String(row.Organizer).toLowerCase().includes('external'));
    if (id === 8) return compEventRows.filter((row) => row.Status !== 'Completed' && row.Status !== 'Cancelled');
    if (id === 9) return schoolEventRows;
    if (id === 10) return eventBudgetRows(schoolEvents);
    if (id === 11) return schoolEvents.map((item) => { const execution = eventExecutions.find((record) => record.eventId === item.id); return { Event: item.name, Date: item.date, Expected: item.expectedAttendance, Counted: execution?.actualCounted ?? '', Students: execution?.studentCount ?? '', Parents: execution?.parentCount ?? '', Staff: execution?.staffCount ?? '' }; });
    if (id === 12) return schoolEventRows.filter((row) => row.Status !== 'Completed' && row.Status !== 'Cancelled');
    if (id === 13) return schoolEvents.flatMap((event) => event.responsibilities.map((item) => ({ Event: event.name, Date: event.date, Responsibility: item.role, Coordinator: item.assignedTo, Status: event.status })));
    if (id === 14) return schoolEvents.map((event) => { const review = eventReviews.find((item) => item.eventId === event.id); const execution = eventExecutions.find((item) => item.eventId === event.id); return { Event: event.name, Date: event.date, Circular: event.circularFile, Photos: review?.photos || execution?.photoFiles.join('; ') || '', Videos: review?.videos || '', PressCoverage: review?.pressCoverage || '', Feedback: review?.feedbackSummary || '' }; });
    if (id === 15) return pdRows;
    if (id === 16) return groupRows(pdRows, 'Department', 'Department', 'CreditPoints');
    if (id === 17) return groupRows(pdRows, 'Teacher', 'Teacher', 'CreditPoints');
    if (id === 18) return pdRows.filter((row) => row.Certificate === true);
    if (id === 19) return achievementRows;
    if (id === 20) return [...groupRows(pdRows, 'Teacher', 'Teacher', 'CreditPoints'), ...groupRows(achievementRows, 'Teacher', 'Teacher', 'Points')];
    if (id === 21) return pdRows.filter((row) => Number(row.WorkingDaysUsed) > 0);
    if (id === 22) return dutyRows;
    if (id === 23) return groupRows(dutyRows.flatMap((row) => String(row.Teachers).split('; ').filter(Boolean).map((Teacher) => ({ ...row, Teacher }))), 'Teacher', 'Teacher');
    if (id === 24) return dutyAttendance.filter((item) => item.status === 'Absent').map((item) => ({ Date: item.date, Duty: item.dutyTypeName, Teacher: item.teacherName, Status: item.status, Substitute: item.substituteTeacher, Remarks: item.remarks }));
    if (id === 25) { const examDutyIds = new Set(dutyTypes.filter((duty) => duty.category === 'Examination').map((duty) => duty.id)); return dutyRows.filter((row) => examDutyIds.has(dutyAssignments.find((item) => item.dutyTypeName === row.Duty)?.dutyTypeId || '')); }
    if (id === 26) return dutyRows.filter((row) => row.Substitute !== '');
    if (id === 27) return dutySummary.map((item) => ({ Teacher: item.teacherName, TotalDuties: item.totalDuties, DutiesDone: item.dutiesDone, Absences: item.absences, Note: item.note }));
    if (id === 28) { const teacherDutyRows = dutyRows.flatMap((row) => String(row.Teachers).split('; ').filter(Boolean).map((Teacher) => ({ ...row, Teacher }))); return groupRows(teacherDutyRows, 'Teacher', 'Teacher'); }
    if (id === 29) return [
      { Area: 'Competitions', Records: competitionEvents.length, Detail: 'Competition occurrences' }, { Area: 'School Events', Records: schoolEvents.length, Detail: 'Event planning records' }, { Area: 'Teacher Development', Records: pdRecords.length, Detail: 'Training / learning activities' }, { Area: 'Teacher Achievements', Records: achievements.length, Detail: 'Recognition records' }, { Area: 'Duty Assignments', Records: dutyAssignments.length, Detail: 'Staff duty slots' }
    ];
    if (id === 30) return resultRows;
    if (id === 31) return [
      { SupportArea: 'Teacher Professional Development', Records: pdRecords.length, CreditPoints: pdRecords.reduce((sum, item) => sum + item.creditPoints, 0), Certificates: pdRecords.filter((item) => item.certificateReceived).length },
      { SupportArea: 'Competitions', Records: competitionEvents.length, ParticipationRecords: competitionParticipants.length, Results: competitionResults.length },
      { SupportArea: 'School Events', Records: schoolEvents.length, Completed: schoolEvents.filter((item) => item.status === 'Completed').length },
      { SupportArea: 'Teacher Duties', Records: dutyAssignments.length, AttendanceRecords: dutyAttendance.length }
    ];
    const staffRows = new Map<string, { credits: number; awards: number; duties: number; absences: number }>();
    const staffNames = new Set([...pdRecords.map((item) => item.teacherName), ...achievements.map((item) => item.teacherName), ...dutyRows.flatMap((item) => String(item.Teachers).split('; ').filter(Boolean))]);
    staffNames.forEach((name) => staffRows.set(name, { credits: pdRecords.filter((item) => item.teacherName === name).reduce((sum, item) => sum + item.creditPoints, 0), awards: achievementRows.filter((item) => item.Teacher === name).reduce((sum, item) => sum + Number(item.Points || 0), 0), duties: dutyRows.filter((item) => String(item.Teachers).split('; ').includes(name)).length, absences: dutyAttendance.filter((item) => item.teacherName === name && item.status === 'Absent').length }));
    return [...staffRows.entries()].map(([Teacher, stats]) => ({ Teacher, CreditPoints: stats.credits, AchievementPoints: stats.awards, Duties: stats.duties, Absences: stats.absences }));
  };

  const runReport = (report: ReportItem & { category: string }, asPdf = false) => {
    const rows = reportRows(report.id);
    const safeRows = rows.length ? rows : [{ Report: report.title, Period: period, Records: 0 }];
    setPreview({ report, rows: safeRows });
    setLastGenerated((current) => ({ ...current, [report.id]: safeRows.length }));
    if (asPdf) window.setTimeout(() => window.print(), 300);
    else setMessage(`${report.title}: ${safeRows.length} row(s) generated for ${period}.`);
  };
  const exportExcel = (report: ReportItem & { category: string }) => downloadTeacherCsv(`${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${period.replace(/[^0-9-]+/g, '')}.csv`, reportRows(report.id).length ? reportRows(report.id) : [{ Report: report.title, Period: period, Records: 0 }]);
  const exportAll = () => downloadTeacherCsv(`event-activities-reports-${period.replace(/[^0-9-]+/g, '')}.csv`, allReports.map((report) => ({ Category: report.category, Report: report.title, Records: reportRows(report.id).length, Period: period })));

  return <div className="space-y-6 p-4 md:p-6">
    <style>{`@media print { body * { visibility: hidden !important; } #reports-print-area, #reports-print-area * { visibility: visible !important; } #reports-print-area { position: absolute; inset: 0; width: 100%; } .no-print { display: none !important; } }`}</style>
    <div className="no-print flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Teacher Duties Section</p><h1 className="mt-1 text-2xl font-bold text-slate-900">📊 Reports &amp; Analytics</h1><p className="mt-1 text-sm text-slate-500">Cross-module reporting across competitions, events, teacher development, achievements and duties.</p></div><div className="flex flex-wrap items-end gap-2"><label><span className="mb-1 block text-xs font-semibold text-slate-600">Period</span><select className={inputClass} value={period} onChange={(event) => setPeriod(event.target.value)}><option>AY 2025-26</option><option>AY 2026-27</option><option>All Periods</option></select></label><Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportAll}>Export Reports</Button></div></div>
    {message && <div className="no-print rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <div className="no-print grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
      ['Competitions', competitionEvents.length], ['Events', schoolEvents.length], ['Teacher Activities', pdRecords.length], ['Achievements', achievements.length], ['Duty Assignments', dutyAssignments.length]
    ].map(([label, value]) => <Card key={String(label)}><p className="text-2xl font-bold text-indigo-700">{value}</p><p className="text-xs text-slate-500">{label} · {period}</p></Card>)}</div>
    <Card noPadding className="no-print overflow-hidden"><div className="border-b border-slate-100 bg-slate-50 p-4"><div className="relative max-w-2xl"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a report by name or section..." /></div></div><div className="space-y-6 p-4">{reportGroups.map((group) => { const items = filteredReports.filter((report) => report.category === group.category); if (!items.length) return null; return <section key={group.category}><div className="mb-3 flex items-center gap-2"><h2 className="font-bold text-slate-800">{group.icon} {group.category}</h2><Badge variant="secondary">{items.length} reports</Badge></div><div className="overflow-x-auto rounded-lg border border-slate-100"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Report</th><th className="px-3 py-2">Generated</th><th className="px-3 py-2 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((report) => <tr key={report.id}><td className="px-3 py-2 text-slate-400">{report.id}</td><td className="px-3 py-2 font-medium text-slate-800">{report.title}</td><td className="px-3 py-2 text-xs text-slate-500">{lastGenerated[report.id] !== undefined ? `${lastGenerated[report.id]} row(s)` : 'Not generated'}</td><td className="px-3 py-2"><div className="flex justify-end gap-1"><Button size="xs" variant="outline" onClick={() => runReport(report)}><FileText className="h-3.5 w-3.5" />Generate</Button><Button size="xs" variant="outline" onClick={() => runReport(report, true)}><Printer className="h-3.5 w-3.5" />PDF</Button><Button size="xs" variant="outline" onClick={() => exportExcel(report)}><FileDown className="h-3.5 w-3.5" />Excel / CSV</Button></div></td></tr>)}</tbody></table></div></section>; })}</div></Card>
    {preview && <div id="reports-print-area"><Card title={`${preview.report.category} — ${preview.report.title}`} headerAction={<Badge variant="info">{period}</Badge>}><p className="mb-3 text-xs text-slate-500">{preview.rows.length} row(s) · reporting period {period}</p><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="bg-slate-50"><tr>{Object.keys(preview.rows[0]).map((key) => <th key={key} className="px-3 py-2 font-semibold text-slate-600">{key}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{preview.rows.slice(0, 100).map((row, index) => <tr key={index}>{Object.keys(preview.rows[0]).map((key) => <td key={key} className="px-3 py-2 text-slate-700">{String(row[key] ?? '')}</td>)}</tr>)}</tbody></table></div><p className="mt-3 text-[10px] text-slate-400">Preview is limited to the first 100 rows. Export CSV for the complete report.</p><div className="no-print mt-3 flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => exportExcel(preview.report)}><Download className="h-4 w-4" />Export CSV</Button><Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print / Save as PDF</Button></div></Card></div>}
  </div>;
}
