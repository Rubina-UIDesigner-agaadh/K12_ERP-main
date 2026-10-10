import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Download, Printer, Send, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Toggle } from '../../../components/ui/Toggle';
import { ACADEMIC_PLANNING_KEYS, CLASSES, DEFAULT_ATPS, DEFAULT_CURRICULUM_CHAPTERS, DEFAULT_LESSON_PLANS, PageHeader, SelectField, TextAreaField, downloadPlanningCsv, loadPlanningCollection, savePlanningCollection, type AnnualTeachingPlanRecord, type CurriculumChapter, type LessonPlanRecord } from './academicPlanningData';
import { NOTIFICATION_RULE_DEFAULTS, REVIEW_KEYS, addAlert, daysBetween, departmentFor, expectedPercentForChapters, loadAlerts, monthKeyFor, periodsPerWeekFor, periodsTaughtFor, progressStateFor, progressStateTone, round1, teacherFor, todayIso, type AlertRecord, type NotificationRule, type ProgressLog, buildSeedProgressLogs, type ProgressState, formatShortDate, CURRENT_ACADEMIC_YEAR, parseIso } from './curriculumReviewData';

type ViewMode = 'Class-wise' | 'Subject-wise' | 'Teacher-wise' | 'Department-wise';
const VIEW_MODES: ViewMode[] = ['Class-wise', 'Subject-wise', 'Teacher-wise', 'Department-wise'];
const DEPARTMENTS = ['Science', 'Maths', 'Languages', 'Social Studies', 'Arts & Physical Education'];

export interface Unit {
  key: string;
  className: string;
  subject: string;
  teacher: string;
  department: string;
  chapters: CurriculumChapter[];
  taught: number;
  total: number;
  actual: number;
  expected: number;
  diff: number;
  state: ProgressState;
  atpStatus: string;
  lpThisWeek: number;
  periodsPerWeek: number;
}

const stateBadge = (state: ProgressState): string => progressStateTone(state);
const cellTone = (diff: number): string => diff >= 0 ? 'bg-green-100 text-green-800' : diff >= -10 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800';
const riskFor = (diff: number): { label: string; tone: string } => diff >= -5 ? { label: '🟢 Low', tone: 'text-green-700' } : diff >= -15 ? { label: '🟡 Medium', tone: 'text-amber-700' } : { label: '🔴 High', tone: 'text-red-700' };

// Build the class-subject units that every view aggregates.
export const buildUnits = (chapters: CurriculumChapter[], logs: ProgressLog[], atps: AnnualTeachingPlanRecord[], lessons: LessonPlanRecord[], today: string): Unit[] => {
  const pairs = [...new Set(chapters.map((chapter) => `${chapter.className}|${chapter.subject}`))];
  return pairs.map((pair) => {
    const [className, subject] = pair.split('|');
    const unitChapters = chapters.filter((chapter) => chapter.className === className && chapter.subject === subject);
    const taught = unitChapters.reduce((sum, chapter) => sum + periodsTaughtFor(chapter, logs), 0);
    const total = unitChapters.reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0);
    const actual = total ? Math.round((taught / total) * 100) : 0;
    const expected = expectedPercentForChapters(unitChapters, today);
    const diff = actual - expected;
    const atp = atps.find((item) => item.className === className && item.subject === subject);
    const lpThisWeek = lessons.filter((lesson) => lesson.className === className && lesson.subject === subject && lesson.status !== 'Draft' && daysBetween(lesson.date, today) >= 0 && daysBetween(lesson.date, today) <= 6).length;
    return {
      key: pair,
      className,
      subject,
      teacher: teacherFor(atps, className, subject),
      department: departmentFor(subject),
      chapters: unitChapters,
      taught,
      total,
      actual,
      expected,
      diff,
      state: progressStateFor(actual, expected),
      atpStatus: atp ? atp.status : 'Not submitted',
      lpThisWeek,
      periodsPerWeek: periodsPerWeekFor(atps, className, subject)
    };
  });
};

const aggregate = (name: string, units: Unit[]) => {
  const taught = units.reduce((sum, unit) => sum + unit.taught, 0);
  const total = units.reduce((sum, unit) => sum + unit.total, 0);
  const actual = total ? Math.round((taught / total) * 100) : 0;
  const expected = units.length ? Math.round(units.reduce((sum, unit) => sum + unit.expected, 0) / units.length) : 0;
  return {
    name,
    units,
    actual,
    expected,
    diff: actual - expected,
    state: progressStateFor(actual, expected),
    behind: units.filter((unit) => unit.diff < -5).length
  };
};

export function TeachingProgressDashboard() {
  const today = todayIso();
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [atps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection<AnnualTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [lessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection<LessonPlanRecord>(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [logs] = useState<ProgressLog[]>(() => loadPlanningCollection<ProgressLog>(REVIEW_KEYS.progressLogs, buildSeedProgressLogs(DEFAULT_CURRICULUM_CHAPTERS)));
  const [rules, setRules] = useState<NotificationRule[]>(() => loadPlanningCollection<NotificationRule>(REVIEW_KEYS.notificationRules, NOTIFICATION_RULE_DEFAULTS));
  const [alerts, setAlerts] = useState<AlertRecord[]>(() => loadAlerts());
  const [viewMode, setViewMode] = useState<ViewMode>('Class-wise');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Most behind');
  const [hodDepartment, setHodDepartment] = useState('Science');
  const [exportPeriod, setExportPeriod] = useState('Monthly');
  const [termA, setTermA] = useState('Term 1');
  const [termB, setTermB] = useState('Term 2');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [rescheduleUnit, setRescheduleUnit] = useState<Unit | null>(null);
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [toast, setToast] = useState('');

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };
  const refreshAlerts = (next: AlertRecord[]) => setAlerts(next);

  const units = useMemo(() => buildUnits(chapters, logs, atps, lessons, today), [chapters, logs, atps, lessons, today]);
  const teachers = [...new Set(units.map((unit) => unit.teacher))];

  // School snapshot
  const schoolTaught = units.reduce((sum, unit) => sum + unit.taught, 0);
  const schoolTotal = units.reduce((sum, unit) => sum + unit.total, 0);
  const schoolActual = schoolTotal ? Math.round((schoolTaught / schoolTotal) * 100) : 0;
  const stateCount = (state: ProgressState) => units.filter((unit) => unit.state === state).length;
  const teacherPlanStatus = teachers.map((teacher) => {
    const mine = atps.filter((atp) => atp.teacher === teacher);
    return { teacher, pending: mine.length === 0 || mine.some((atp) => atp.status === 'Draft' || atp.status === 'Returned') };
  });
  const allPlansIn = teacherPlanStatus.filter((item) => !item.pending).length;

  // Grouped views
  const groups = useMemo(() => {
    const map = new Map<string, Unit[]>();
    units.forEach((unit) => {
      const key = viewMode === 'Class-wise' ? unit.className : viewMode === 'Subject-wise' ? unit.subject : viewMode === 'Teacher-wise' ? unit.teacher : unit.department;
      map.set(key, [...(map.get(key) || []), unit]);
    });
    const rows = [...map.entries()].map(([name, list]) => aggregate(name, list));
    if (sortBy === 'Most behind') rows.sort((a, b) => a.diff - b.diff);
    else if (sortBy === 'Most ahead') rows.sort((a, b) => b.diff - a.diff);
    else rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [units, viewMode, sortBy]);

  // Class x Subject matrix
  const matrixClasses = CLASSES.filter((item) => units.some((unit) => unit.className === item));
  const matrixSubjects = [...new Set(units.map((unit) => unit.subject))];
  const classRowOrder = useMemo(() => {
    const rows = matrixClasses.map((className) => {
      const mine = units.filter((unit) => unit.className === className);
      return { className, avgDiff: mine.length ? mine.reduce((sum, unit) => sum + unit.diff, 0) / mine.length : 0 };
    });
    if (sortBy === 'Most behind') rows.sort((a, b) => a.avgDiff - b.avgDiff);
    else if (sortBy === 'Most ahead') rows.sort((a, b) => b.avgDiff - a.avgDiff);
    else rows.sort((a, b) => a.className.localeCompare(b.className));
    return rows.map((row) => row.className);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, sortBy]);

  // Department table
  const departmentRows = DEPARTMENTS.map((department) => {
    const mine = units.filter((unit) => unit.department === department);
    if (!mine.length) return null;
    const approved = atps.filter((atp) => departmentFor(atp.subject) === department && (atp.status === 'HOD Approved')).length;
    const totalAtps = atps.filter((atp) => departmentFor(atp.subject) === department).length;
    const lpSubmitted = mine.reduce((sum, unit) => sum + unit.lpThisWeek, 0);
    const lpScheduled = mine.reduce((sum, unit) => sum + unit.periodsPerWeek, 0);
    return { department, classes: mine.length, avg: aggregate(department, mine).actual, approved, totalAtps, lpSubmitted, lpScheduled, behind: mine.filter((unit) => unit.diff < -5).length };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  // Teacher table (HOD's department)
  const deptUnits = units.filter((unit) => unit.department === hodDepartment);
  const deptTeachers = [...new Set(deptUnits.map((unit) => unit.teacher))];
  const teacherRows = deptTeachers.map((teacher) => {
    const mine = deptUnits.filter((unit) => unit.teacher === teacher);
    const agg = aggregate(teacher, mine);
    const atpStatus = atps.find((atp) => atp.teacher === teacher && departmentFor(atp.subject) === hodDepartment);
    return {
      teacher,
      classes: mine.length,
      avg: agg.actual,
      diff: agg.diff,
      atp: atpStatus ? atpStatus.status : 'Not submitted',
      lp: mine.reduce((sum, unit) => sum + unit.lpThisWeek, 0),
      lpScheduled: mine.reduce((sum, unit) => sum + unit.periodsPerWeek, 0)
    };
  });

  // Risk panel
  const highRisk = units.filter((unit) => unit.diff < -10 || unit.state === 'Significantly Behind');
  const mediumRisk = units.filter((unit) => !highRisk.includes(unit) && unit.diff < -5);
  const aheadUnits = units.filter((unit) => unit.diff >= 5);

  // Monthly trend across logs
  const monthlyBuckets = Object.entries(logs.reduce<Record<string, number>>((acc, log) => {
    const key = monthKeyFor(log.date);
    acc[key] = (acc[key] || 0) + log.periodsUsed;
    return acc;
  }, {})).sort(([a], [b]) => a.localeCompare(b)).slice(-6);
  const trendDirection = monthlyBuckets.length >= 2 ? monthlyBuckets[monthlyBuckets.length - 1][1] - monthlyBuckets[monthlyBuckets.length - 2][1] : 0;

  // Weekly LP submissions for the last 8 weeks
  const weeklyLp = Array.from({ length: 8 }, (_, index) => {
    const weekEnd = 7 * (7 - index);
    const count = lessons.filter((lesson) => lesson.submitToHod && daysBetween(lesson.createdAt || lesson.date, today) >= weekEnd && daysBetween(lesson.createdAt || lesson.date, today) < weekEnd + 7).length;
    return { label: `W-${7 - index}`, count };
  });

  // Term comparison
  const subjectsForCompare = [...new Set(units.map((unit) => unit.subject))];
  const termAverage = (subject: string, term: string): number | null => {
    const scoped = chapters.filter((chapter) => chapter.subject === subject && chapter.term === term);
    if (!scoped.length) return null;
    const taught = scoped.reduce((sum, chapter) => sum + periodsTaughtFor(chapter, logs), 0);
    const total = scoped.reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0);
    return total ? Math.round((taught / total) * 100) : 0;
  };
  const termCompareRows = subjectsForCompare.map((subject) => ({ subject, a: termAverage(subject, termA), b: termAverage(subject, termB) }));

  const subjectAverages = [...new Set(units.map((unit) => unit.subject))].map((subject) => ({ subject, avg: aggregate(subject, units.filter((unit) => unit.subject === subject)).actual }));
  const classAverages = matrixClasses.map((className) => ({ className, avg: aggregate(className, units.filter((unit) => unit.className === className)).actual }));

  // Actions
  const toggleRule = (id: string, enabled: boolean) => {
    const next = rules.map((rule) => rule.id === id ? { ...rule, enabled } : rule);
    setRules(next);
    savePlanningCollection(REVIEW_KEYS.notificationRules, next);
  };

  const sendWeeklySummary = () => {
    let next = alerts;
    const message = `Weekly progress: school-wide ${schoolActual}% complete, ${stateCount('Behind') + stateCount('Significantly Behind')} unit(s) behind.`;
    ['HOD', 'Principal'].forEach((target) => { next = [{ id: `ALERT-${Date.now()}-${target}`, date: today, kind: 'Weekly summary', target, message }, ...next]; });
    savePlanningCollection(REVIEW_KEYS.alerts, next);
    refreshAlerts(next);
    flash('Weekly summary logged for HODs and the Principal. Email delivery needs the Communications module.');
  };

  const alertTeacher = (unit: Unit) => {
    refreshAlerts(addAlert('Teacher alert', unit.teacher, `${unit.className} ${unit.subject} is ${Math.abs(unit.diff)}% behind target. Please review the plan.`));
    flash(`Alert logged for ${unit.teacher}.`);
  };

  const alertHod = (unit: Unit) => {
    refreshAlerts(addAlert('HOD alert', unit.department, `${unit.className} ${unit.subject} needs attention (${unit.actual}% vs ${unit.expected}% expected).`));
    flash('Alert logged for the HOD.');
  };

  const shareAsResource = (unit: Unit) => {
    refreshAlerts(addAlert('HOD alert', unit.teacher, `${unit.className} ${unit.subject} is ahead of schedule. Consider sharing resources with colleagues.`));
    flash(`Sharing request logged for ${unit.teacher}.`);
  };

  const submitReschedule = () => {
    if (!rescheduleUnit) return;
    const remaining = Math.max(0, rescheduleUnit.total - rescheduleUnit.taught);
    const weeksLeft = Math.max(1, Math.floor(daysBetween(today, `${parseIso(today).getFullYear() + (parseIso(today).getMonth() >= 2 ? 1 : 0)}-03-31`) / 7));
    const neededPerWeek = round1(remaining / weeksLeft);
    refreshAlerts(addAlert('HOD alert', rescheduleUnit.department, `Reschedule requested for ${rescheduleUnit.className} ${rescheduleUnit.subject}: ${remaining} period(s) left, about ${neededPerWeek} per week needed. ${rescheduleNote}`.trim()));
    setRescheduleUnit(null);
    setRescheduleNote('');
    flash('Reschedule request logged for the HOD.');
  };

  const exportReport = () => {
    downloadPlanningCsv(`teaching-progress-${exportPeriod.toLowerCase()}-${today}.csv`, units.map((unit) => ({
      Class: unit.className,
      Subject: unit.subject,
      Teacher: unit.teacher,
      Department: unit.department,
      'Actual %': unit.actual,
      'Expected %': unit.expected,
      State: unit.state,
      'ATP Status': unit.atpStatus,
      'LPs This Week': unit.lpThisWeek,
      [`Report Period`]: exportPeriod
    })));
  };

  const toggleGroup = (key: string) => setExpandedGroups((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  const recentAlerts = alerts.slice(0, 8);
  const behindRule = rules.find((rule) => rule.id === 'behind-10');

  return (
    <div className="space-y-6">
      <PageHeader
        title="📊 Teaching Progress Dashboard"
        description={`Progress across classes, subjects, teachers and departments · ${CURRENT_ACADEMIC_YEAR} · as of ${formatShortDate(today)}`}
        actions={<>
          <div className="w-40"><SelectField label="" value={exportPeriod} onChange={setExportPeriod} options={['Weekly', 'Monthly']} /></div>
          <Button variant="outline" onClick={exportReport}><Download className="h-4 w-4" />Export Progress Report</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Management Summary</Button>
          <Button onClick={sendWeeklySummary}><Send className="h-4 w-4" />Send Weekly Summary Now</Button>
        </>} />

      {toast && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{toast}</div>}

      {/* School snapshot */}
      <Card title="School-wide Progress Snapshot (Principal View)">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 p-4 md:col-span-1">
            <p className="text-xs text-gray-500">Combined syllabus completion</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{schoolActual}%</p>
            <p className="text-xs text-gray-500">{schoolTaught} of {schoolTotal} periods</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Classes on track / ahead</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{stateCount('On Track') + stateCount('Ahead')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Behind / significantly behind</p>
            <p className="mt-1 text-2xl font-bold text-amber-700">{stateCount('Behind')} <span className="text-base text-red-700">/ {stateCount('Significantly Behind')}</span></p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Teachers with all plans submitted</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{allPlansIn} <span className="text-base text-gray-500">/ {teachers.length} (pending {teachers.length - allPlansIn})</span></p>
          </div>
        </div>
      </Card>

      {/* Class x Subject matrix */}
      <Card title="Class × Subject Matrix">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">🟢 At or above target</span>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">🟡 Up to 10 points below</span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-red-800">🔴 More than 10 points below</span>
          <span className="ml-auto text-gray-500">Click a cell to drill down</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-center text-sm">
            <thead><tr><th className="px-2 py-2 text-left text-xs uppercase text-gray-500">Class</th>{matrixSubjects.map((subject) => <th key={subject} className="px-2 py-2 text-xs uppercase text-gray-500">{subject}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">
              {classRowOrder.map((className) => (
                <tr key={className}>
                  <td className="px-2 py-2 text-left font-medium">{className}</td>
                  {matrixSubjects.map((subject) => {
                    const unit = units.find((item) => item.className === className && item.subject === subject);
                    if (!unit) return <td key={subject} className="px-2 py-2 text-gray-300">—</td>;
                    return (
                      <td key={subject} className="px-1 py-1">
                        <button type="button" onClick={() => setSelectedUnit(unit.key)} className={`w-full rounded-md px-2 py-2 text-xs font-semibold ${cellTone(unit.diff)} ${selectedUnit === unit.key ? 'ring-2 ring-indigo-500' : ''}`} title={`${unit.actual}% actual, ${unit.expected}% expected`}>
                          {unit.actual}%
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedUnit && (() => {
          const unit = units.find((item) => item.key === selectedUnit);
          if (!unit) return null;
          return (
            <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{unit.className} · {unit.subject} — {unit.teacher}</p>
              <p className="text-xs text-gray-600">{unit.actual}% complete, {unit.expected}% expected today ({unit.diff >= 0 ? '+' : ''}{unit.diff} points). ATP: {unit.atpStatus}. Lesson plans this week: {unit.lpThisWeek}/{unit.periodsPerWeek}.</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                {unit.chapters.map((chapter) => <li key={chapter.id}>{chapter.chapterNumber}. {chapter.name} — {periodsTaughtFor(chapter, logs)}/{chapter.allocatedPeriods} periods</li>)}
              </ul>
            </div>
          );
        })()}
      </Card>

      {/* Grouped views */}
      <Card title="Progress by View" noPadding headerAction={<div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">{VIEW_MODES.map((mode) => <button key={mode} type="button" onClick={() => { setViewMode(mode); setExpandedGroups([]); }} className={`rounded-full border px-3 py-1 text-xs font-medium ${viewMode === mode ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-600'}`}>{mode}</button>)}</div>
        <div className="w-44"><SelectField label="" value={sortBy} onChange={setSortBy} options={['Most behind', 'Most ahead', 'Alphabetical']} /></div>
      </div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">{viewMode.replace('-wise', '')}</th><th className="px-3 py-3">Units</th><th className="px-3 py-3">Actual %</th><th className="px-3 py-3">Expected %</th><th className="px-3 py-3">State</th><th className="px-3 py-3">Behind units</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map((group) => (
                <React.Fragment key={group.name}>
                  <tr className="cursor-pointer hover:bg-gray-50" onClick={() => toggleGroup(group.name)}>
                    <td className="px-3 py-3 font-medium"><span className="inline-flex items-center gap-1">{expandedGroups.includes(group.name) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}{group.name}</span></td>
                    <td className="px-3 py-3">{group.units.length}</td>
                    <td className="px-3 py-3">{group.actual}%</td>
                    <td className="px-3 py-3">{group.expected}%</td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stateBadge(group.state)}`}>{group.state}</span></td>
                    <td className="px-3 py-3">{group.behind}</td>
                  </tr>
                  {expandedGroups.includes(group.name) && group.units.map((unit) => (
                    <tr key={unit.key} className="bg-gray-50 text-xs">
                      <td className="px-3 py-2 pl-10">{viewMode === 'Class-wise' ? unit.subject : unit.className} <span className="text-gray-500">· {viewMode === 'Teacher-wise' ? unit.subject : unit.teacher}</span></td>
                      <td className="px-3 py-2">ATP: {unit.atpStatus}</td>
                      <td className="px-3 py-2">{unit.actual}%</td>
                      <td className="px-3 py-2">{unit.expected}%</td>
                      <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 font-medium ${stateBadge(unit.state)}`}>{unit.state}</span></td>
                      <td className="px-3 py-2">LPs {unit.lpThisWeek}/{unit.periodsPerWeek}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {groups.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No progress data is available.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Department breakdown */}
      <Card title="Department-wise Breakdown" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Department</th><th className="px-3 py-3">Classes Teaching</th><th className="px-3 py-3">Avg Completion</th><th className="px-3 py-3">ATPs Approved</th><th className="px-3 py-3">LPs This Week</th><th className="px-3 py-3">Behind Classes</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {departmentRows.map((row) => (
                <tr key={row.department}>
                  <td className="px-3 py-3 font-medium">{row.department}</td>
                  <td className="px-3 py-3">{row.classes} class-sections</td>
                  <td className="px-3 py-3"><span className={row.avg >= 70 ? 'text-green-700' : 'text-amber-700'}>{row.avg}%</span></td>
                  <td className="px-3 py-3">{row.approved}/{row.totalAtps} {row.approved === row.totalAtps ? '✅' : '⚠️'}</td>
                  <td className="px-3 py-3">{row.lpSubmitted}/{row.lpScheduled}</td>
                  <td className="px-3 py-3">{row.behind} {row.behind > 0 ? '🔴' : '🟢'}</td>
                </tr>
              ))}
              {departmentRows.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No departments have chapters yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Teacher performance */}
      <Card title="Teacher Performance (HOD View — Own Department)" noPadding headerAction={<div className="w-56"><SelectField label="" value={hodDepartment} onChange={setHodDepartment} options={DEPARTMENTS} /></div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Teacher</th><th className="px-3 py-3">Classes</th><th className="px-3 py-3">Avg Completion</th><th className="px-3 py-3">ATP Status</th><th className="px-3 py-3">LP This Week</th><th className="px-3 py-3">Attendance</th><th className="px-3 py-3">Risk Level</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {teacherRows.map((row) => (
                <tr key={row.teacher}>
                  <td className="px-3 py-3 font-medium">{row.teacher}</td>
                  <td className="px-3 py-3">{row.classes} classes</td>
                  <td className="px-3 py-3">{row.avg}%</td>
                  <td className="px-3 py-3">{row.atp === 'HOD Approved' ? '✅ Approved' : `⚠️ ${row.atp}`}</td>
                  <td className="px-3 py-3">{row.lp}/{row.lpScheduled}</td>
                  <td className="px-3 py-3 text-gray-400" title="Attendance is not tracked in the curriculum module">Not tracked</td>
                  <td className={`px-3 py-3 font-medium ${riskFor(row.diff).tone}`}>{riskFor(row.diff).label}</td>
                </tr>
              ))}
              {teacherRows.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No teachers in this department.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Risk analysis */}
      <Card title="Risk Analysis">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700">High risk — need immediate attention ({highRisk.length})</p>
            {highRisk.map((unit) => (
              <div key={unit.key} className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-gray-900">{unit.className} {unit.subject} — {unit.actual}% complete, {unit.total - unit.taught} periods remaining</p>
                <p className="text-xs text-gray-600">{unit.teacher} · {unit.department}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="xs" variant="outline" onClick={() => alertTeacher(unit)}>📧 Alert Teacher</Button>
                  <Button size="xs" variant="outline" onClick={() => { setSelectedUnit(unit.key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>📊 View Detail</Button>
                  <Button size="xs" variant="outline" onClick={() => { setRescheduleUnit(unit); setRescheduleNote(''); }}>📅 Reschedule Plan</Button>
                </div>
              </div>
            ))}
            {highRisk.length === 0 && <p className="text-xs text-gray-500">No high-risk classes.</p>}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-amber-700">Medium risk — monitor closely ({mediumRisk.length})</p>
            {mediumRisk.map((unit) => (
              <div key={unit.key} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-medium text-gray-900">{unit.className} {unit.subject}</p>
                <p className="text-xs text-gray-600">{unit.actual}% vs {unit.expected}% expected · projected at current pace {unit.lpThisWeek > 0 ? 'on track' : 'needs LPs this week'}</p>
                <Button size="xs" variant="outline" className="mt-2" onClick={() => alertHod(unit)}>Alert HOD</Button>
              </div>
            ))}
            {mediumRisk.length === 0 && <p className="text-xs text-gray-500">No classes in the medium-risk band.</p>}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-green-700">Ahead of schedule ({aheadUnits.length})</p>
            {aheadUnits.map((unit) => (
              <div key={unit.key} className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
                <p className="font-medium text-gray-900"><Star className="mr-1 inline h-3.5 w-3.5 text-green-600" />{unit.className} {unit.subject}</p>
                <p className="text-xs text-gray-600">{unit.teacher} · {unit.actual}% vs {unit.expected}%</p>
                <Button size="xs" variant="outline" className="mt-2" onClick={() => shareAsResource(unit)}>Share resources with colleagues</Button>
              </div>
            ))}
            {aheadUnits.length === 0 && <p className="text-xs text-gray-500">No classes are ahead of schedule yet.</p>}
          </div>
        </div>
      </Card>

      {/* Trends */}
      <Card title="Trend Charts">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-800">Month-wise progress trend (periods logged) — {trendDirection > 0 ? '▲ improving' : trendDirection < 0 ? '▼ declining' : '► steady'} vs last month</p>
            <div className="mt-3 flex h-40 items-end gap-3">
              {monthlyBuckets.map(([month, value]) => (
                <div key={month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{value}</span>
                  <div className="w-full rounded-t bg-indigo-500" style={{ height: `${Math.max(4, (value / Math.max(1, ...monthlyBuckets.map((item) => item[1]))) * 120)}px` }} />
                  <span className="text-[10px] text-gray-600">{month}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Teacher activity — lesson plan submissions per week</p>
            <div className="mt-3 flex h-40 items-end gap-2">
              {weeklyLp.map((week) => (
                <div key={week.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{week.count}</span>
                  <div className="w-full rounded-t bg-emerald-500" style={{ height: `${Math.max(4, (week.count / Math.max(1, ...weeklyLp.map((item) => item.count))) * 120)}px` }} />
                  <span className="text-[10px] text-gray-600">{week.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Class performance comparison (avg completion)</p>
            <div className="mt-3 space-y-2">
              {classAverages.map((item) => (
                <div key={item.className} className="grid grid-cols-[90px_1fr_40px] items-center gap-2 text-xs"><span>{item.className}</span><span className="h-2 overflow-hidden rounded-full bg-gray-200"><span className="block h-full bg-indigo-600" style={{ width: `${item.avg}%` }} /></span><span className="text-right">{item.avg}%</span></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Subject-wise difficulty (lowest completion first)</p>
            <div className="mt-3 space-y-2">
              {[...subjectAverages].sort((a, b) => a.avg - b.avg).map((item) => (
                <div key={item.subject} className="grid grid-cols-[130px_1fr_40px] items-center gap-2 text-xs"><span>{item.subject}</span><span className="h-2 overflow-hidden rounded-full bg-gray-200"><span className={`block h-full ${item.avg < 60 ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${item.avg}%` }} /></span><span className="text-right">{item.avg}%</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-800">Compare terms</p>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            <SelectField label="Term A" value={termA} onChange={setTermA} options={['Term 1', 'Term 2', 'Term 3']} />
            <SelectField label="Term B" value={termB} onChange={setTermB} options={['Term 1', 'Term 2', 'Term 3']} />
          </div>
          <table className="mt-3 w-full text-left text-xs">
            <thead className="text-gray-500"><tr><th className="py-1">Subject</th><th>{termA}</th><th>{termB}</th><th>Change</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {termCompareRows.map((row) => (
                <tr key={row.subject}><td className="py-1.5">{row.subject}</td><td>{row.a === null ? '—' : `${row.a}%`}</td><td>{row.b === null ? '—' : `${row.b}%`}</td><td>{row.a === null || row.b === null ? '—' : `${row.b - row.a >= 0 ? '+' : ''}${row.b - row.a}`}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="outline" disabled title="Needs multi-year progress history, which this module does not store yet.">Identify patterns across years</Button>
          <span className="text-xs text-gray-500">Multi-year history is not stored yet, so year-on-year patterns are unavailable.</span>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Automatic Notification System">
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3">
              <span className="text-sm text-gray-700">{rule.label}</span>
              <Toggle checked={rule.enabled} onChange={(value) => toggleRule(rule.id, value)} size="sm" />
            </div>
          ))}
          <p className="text-xs text-gray-500">Rules are saved for this browser. Alerts are logged below; delivery to email or SMS needs the Communications module.</p>
          {behindRule && !behindRule.enabled && <p className="flex items-center gap-2 text-xs text-amber-700"><AlertTriangle className="h-3.5 w-3.5" />The 10%-behind alert is off.</p>}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Recent alert log</p>
          <ul className="space-y-1.5 text-xs text-gray-700">
            {recentAlerts.map((alert) => <li key={alert.id} className="rounded bg-gray-50 px-3 py-2"><span className="font-medium">{formatShortDate(alert.date)} · {alert.kind} → {alert.target}:</span> {alert.message}</li>)}
            {recentAlerts.length === 0 && <li className="text-gray-500">No alerts have been logged yet.</li>}
          </ul>
        </div>
      </Card>

      <Modal isOpen={rescheduleUnit !== null} onClose={() => setRescheduleUnit(null)} title={rescheduleUnit ? `Reschedule plan: ${rescheduleUnit.className} ${rescheduleUnit.subject}` : 'Reschedule plan'} size="md"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRescheduleUnit(null)}>Cancel</Button><Button variant="primary" onClick={submitReschedule}>Send Reschedule Request</Button></div>}>
        {rescheduleUnit && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>{rescheduleUnit.total - rescheduleUnit.taught} period(s) remain against {rescheduleUnit.periodsPerWeek} scheduled per week. The HOD will receive this request with the pace needed to finish by March 31.</p>
            <TextAreaField label="Reason or proposed change" value={rescheduleNote} onChange={setRescheduleNote} placeholder="e.g. Merge two revision periods, add one extra period on Fridays" />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeachingProgressDashboard;