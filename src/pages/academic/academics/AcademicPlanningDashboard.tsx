import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileBarChart2,
  FileText,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_ATPS,
  DEFAULT_CURRICULUM_CHAPTERS,
  DEFAULT_LESSON_PLANS,
  DEFAULT_MONTHLY_PLANS,
  DEFAULT_WEEKLY_PLANS,
  downloadPlanningCsv,
  loadPlanningCollection,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type LessonPlanRecord,
  type MonthlyTeachingPlanRecord,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { SyllabusCompletionTracker } from './SyllabusCompletionTracker';
import { TeacherProgressDashboard } from './TeacherProgressDashboard';

type ClassProgress = { className: string; percent: number };
type ManagementTab = 'planning' | 'syllabus' | 'teacher';

const INITIAL_CLASS_PROGRESS: ClassProgress[] = [
  { className: 'Class 6', percent: 78 },
  { className: 'Class 7', percent: 71 },
  { className: 'Class 8', percent: 65 },
  { className: 'Class 9', percent: 58 },
  { className: 'Class 10', percent: 48 },
  { className: 'Class 11', percent: 67 },
  { className: 'Class 12', percent: 69 },
];

const INITIAL_WEEK_PLAN = [
  { className: 'Class 10-A', subject: 'Physics', chapter: 'Chapter 5', topic: 'Pressure & Buoyancy', periods: 5, completedPeriods: 3 },
  { className: 'Class 10-A', subject: 'Chemistry', chapter: 'Chapter 4', topic: 'Carbon Compounds', periods: 4, completedPeriods: 4 },
  { className: 'Class 9-B', subject: 'Maths', chapter: 'Chapter 6', topic: 'Lines & Angles', periods: 6, completedPeriods: 2 },
];

const INITIAL_RECENT_PLANS = [
  { teacher: 'Mr. R. Kumar', className: 'Class 12-A', subject: 'Physics', topic: 'Wave Optics', period: 3, date: '27-Nov-2025', status: 'Approved by HOD' },
  { teacher: 'Mrs. S. Joshi', className: 'Class 11-B', subject: 'Chemistry', topic: 'Organic Chemistry', period: 2, date: '27-Nov-2025', status: 'Pending HOD Review' },
  { teacher: 'Mr. V. Patel', className: 'Class 9-A', subject: 'Maths', topic: 'Triangles', period: 4, date: '27-Nov-2025', status: 'Approved' },
];

const CLASS_OPTIONS = [
  'All Classes',
  ...Array.from({ length: 12 }, (_, index) => `Class ${index + 1}-A`),
  'Class 2-B',
  'Class 9-B',
  'Class 11-B',
];

const TEACHER_OPTIONS = [
  'All Teachers',
  'Ms. Priya Sharma',
  'Mr. Rajesh Patel',
  'Ms. Anita Verma',
  'Mr. Suresh Kumar',
  'Ms. Kavita Nair',
  'Mr. R. Kumar',
  'Mrs. S. Joshi',
  'Mr. V. Patel',
];

const DEFAULT_FILTERS = {
  academicYear: '2025-26',
  term: 'Term 1',
  className: 'All Classes',
  teacher: 'All Teachers',
  dateFrom: '2026-04-01',
  dateTo: '2026-10-16',
};

const MANAGEMENT_KPIS = [
  { label: 'Overall Syllabus Completion', value: '72%', note: 'School-wide vs plan', icon: BookOpen, tone: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
  { label: 'Classes On Track', value: '18 / 24', note: 'Meeting expected pace', icon: CheckCircle2, tone: 'text-green-700 bg-green-50 border-green-100' },
  { label: 'Classes Behind', value: '4', note: 'Need catch-up support', icon: AlertTriangle, tone: 'text-amber-700 bg-amber-50 border-amber-100' },
  { label: 'Classes Significantly Behind', value: '2', note: 'Urgent intervention', icon: AlertTriangle, tone: 'text-red-700 bg-red-50 border-red-100' },
  { label: 'Teachers with All Plans Submitted', value: '14 / 18', note: '4 still pending', icon: ClipboardCheck, tone: 'text-blue-700 bg-blue-50 border-blue-100' },
  { label: 'Pending Lesson Plan Approvals', value: '7', note: 'Awaiting HOD review', icon: Clock3, tone: 'text-yellow-700 bg-yellow-50 border-yellow-100' },
  { label: 'Average Attendance Compliance', value: '94%', note: 'Across all teachers', icon: TrendingUp, tone: 'text-purple-700 bg-purple-50 border-purple-100' },
  { label: 'Activities Completed', value: '186 / 220', note: 'This academic year', icon: Activity, tone: 'text-teal-700 bg-teal-50 border-teal-100' },
];

const TABS: { id: ManagementTab; label: string }[] = [
  { id: 'planning', label: 'Planning' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'teacher', label: 'Teacher' },
];

const routeTo = (id: string) => `/academic/academics/${id}`;

const matchesClass = (value: string, selected: string) => {
  if (!selected || selected === 'All Classes') return true;
  const base = (item: string) => item.replace(/-[A-Z]$/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
  return value === selected || base(value) === base(selected);
};

const matchesTeacher = (value: string, selected: string) =>
  !selected || selected === 'All Teachers' || value === selected;

export function AcademicPlanningDashboard() {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState(DEFAULT_FILTERS.academicYear);
  const [term, setTerm] = useState(DEFAULT_FILTERS.term);
  const [className, setClassName] = useState(DEFAULT_FILTERS.className);
  const [teacher, setTeacher] = useState(DEFAULT_FILTERS.teacher);
  const [dateFrom, setDateFrom] = useState(DEFAULT_FILTERS.dateFrom);
  const [dateTo, setDateTo] = useState(DEFAULT_FILTERS.dateTo);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<ManagementTab>('planning');
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const liveData = useMemo(() => ({
    atps: loadPlanningCollection<AnnualTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS),
    chapters: loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS),
    lessons: loadPlanningCollection<LessonPlanRecord>(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS),
    monthly: loadPlanningCollection<MonthlyTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS),
    weekly: loadPlanningCollection<WeeklyTeachingItem>(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS),
  }), [refreshKey]);
  const annualCompletion = liveData.atps.length ? Math.round(liveData.atps.reduce((sum, item) => sum + (item.completeness || 0), 0) / liveData.atps.length) : 0;
  const monthlyCompletion = liveData.monthly.length ? Math.round(liveData.monthly.reduce((sum, item) => sum + (item.completionPercent || 0), 0) / liveData.monthly.length) : 0;

  const pendingLessons = liveData.lessons.filter((lesson) => lesson.status === 'Submitted').length;
  const seededPendingLessons = DEFAULT_LESSON_PLANS.filter((lesson) => lesson.status === 'Submitted').length;
  const pendingApprovalCount = Math.max(0, 23 + pendingLessons - seededPendingLessons);
  const averageClassProgress = 65.1;

  const syllabusRows = INITIAL_CLASS_PROGRESS.filter((row) => matchesClass(row.className, applied.className));
  const weekPlans = INITIAL_WEEK_PLAN.filter((plan) => matchesClass(plan.className, applied.className));
  const recentPlans = INITIAL_RECENT_PLANS.filter(
    (plan) => matchesClass(plan.className, applied.className) && matchesTeacher(plan.teacher, applied.teacher)
  ).filter((plan) => statusFilter === 'All' || plan.status.toLowerCase().includes(statusFilter.toLowerCase()));

  const exportSyllabus = () => downloadPlanningCsv(`syllabus-progress-${applied.academicYear}-${applied.term.toLowerCase().replace(' ', '-')}.csv`, [
    ...syllabusRows.map((row) => ({ class: row.className, completionPercent: row.percent, academicYear: applied.academicYear, term: applied.term })),
  ]);

  const exportAllReports = () => downloadPlanningCsv('academic-management-kpis.csv', MANAGEMENT_KPIS.map((kpi) => ({ metric: kpi.label, value: kpi.value, note: kpi.note })));

  const navigateTo = (id: string) => navigate(routeTo(id));
  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const applyFilters = () => setApplied({ academicYear, term, className, teacher, dateFrom, dateTo });
  const resetFilters = () => {
    setAcademicYear(DEFAULT_FILTERS.academicYear);
    setTerm(DEFAULT_FILTERS.term);
    setClassName(DEFAULT_FILTERS.className);
    setTeacher(DEFAULT_FILTERS.teacher);
    setDateFrom(DEFAULT_FILTERS.dateFrom);
    setDateTo(DEFAULT_FILTERS.dateTo);
    setApplied(DEFAULT_FILTERS);
  };

  const alerts: Array<{ title: string; description: string; action: string; tone: string; onClick: () => void; secondaryAction?: string; onSecondaryClick?: () => void }> = [
    {
      title: 'Class 10-A Science — 15% Behind',
      description: 'Physics Chapter 5 has not started yet. Exam in 3 weeks — urgent action needed.',
      action: 'View Plan',
      secondaryAction: 'Alert Teacher',
      tone: 'border-l-rose-500',
      onClick: () => navigateTo('teaching-plan'),
      onSecondaryClick: () => showMessage('Alert sent to the Class 10-A Science teacher.'),
    },
    {
      title: `${pendingApprovalCount} Lesson Plans pending HOD approval`,
      description: 'Oldest pending: 5 days ago.',
      action: 'Review Now',
      tone: 'border-l-amber-500',
      onClick: () => navigateTo('teaching-plan'),
    },
  ];

  const statusVariant = (status: string): 'success' | 'warning' | 'primary' | 'default' => {
    if (status === 'Completed' || status.startsWith('Approved')) return 'success';
    if (status === 'Today' || status.startsWith('Pending')) return 'warning';
    if (status === 'Planned') return 'primary';
    return 'default';
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-gray-50 min-h-full">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs text-gray-500">Home → Academic → Curriculum & Academic Planning</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">Academic Management Dashboard</h1>
          <p className="text-sm text-gray-500">
            Academic Year {applied.academicYear} · Last updated 16 Oct 2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportAllReports}>Export All Reports</Button>
          <Button size="sm" variant="primary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => { setRefreshKey((value) => value + 1); showMessage('Dashboard refreshed.'); }}>Refresh</Button>
        </div>
      </header>

      {message && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <section aria-label="Academic management summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {MANAGEMENT_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-lg border p-4 ${kpi.tone}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="mt-1 text-xs opacity-80">{kpi.note}</p>
            </div>
          );
        })}
      </section>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-gray-700">
            Academic Year
            <select aria-label="Academic year" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} className="mt-1 block w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
              <option value="2024-25">2024-25</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Term
            <select aria-label="Term" value={term} onChange={(event) => setTerm(event.target.value)} className="mt-1 block w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Full Year</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Class
            <select aria-label="Class" value={className} onChange={(event) => setClassName(event.target.value)} className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              {CLASS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Teacher
            <select aria-label="Teacher" value={teacher} onChange={(event) => setTeacher(event.target.value)} className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              {TEACHER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Date From
            <input type="date" aria-label="Date from" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
          </label>
          <label className="text-sm text-gray-700">
            Date To
            <input type="date" aria-label="Date to" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
          </label>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={resetFilters}>Reset</Button>
            <Button size="sm" variant="primary" onClick={applyFilters}>Apply</Button>
          </div>
        </div>
      </Card>

      <div className="sticky top-0 z-20 -mx-4 border-b border-gray-200 bg-gray-50 px-4 md:-mx-6 md:px-6">
        <div className="flex gap-1" role="tablist" aria-label="Academic management tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'planning' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
            </select>
            <Button size="sm" variant="outline" leftIcon={<CalendarDays className="h-4 w-4" />} onClick={() => navigateTo('teaching-plan')}>Teaching Plan</Button>
            <Button size="sm" variant="outline" leftIcon={<ClipboardCheck className="h-4 w-4" />} onClick={() => navigateTo('teacher-plan-progress')}>Teacher Plan Progress</Button>
            <Button size="sm" variant="outline" leftIcon={<BookOpen className="h-4 w-4" />} onClick={() => navigateTo('syllabus-planner')}>Syllabus Planner</Button>
            <Button size="sm" variant="primary" leftIcon={<Download className="h-4 w-4" />} onClick={exportSyllabus}>Export</Button>
          </div>

          <section aria-label="Academic planning details" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card title="Annual & Monthly plan completion">
              <div className="space-y-4">
                {[{ label: 'Annual plan completion', value: annualCompletion }, { label: 'Monthly plan completion', value: monthlyCompletion }].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-sm"><span className="font-medium text-gray-700">{row.label}</span><b className="text-indigo-700">{row.value}%</b></div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${row.value}%` }} /></div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Syllabus Completion by Class" headerAction={<button type="button" onClick={() => navigateTo('syllabus-planner')} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">Syllabus Planner →</button>}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                <span className="text-gray-600">Target by end of {applied.term}</span><span className="font-semibold text-gray-900">75%</span>
                <span className="text-gray-500">Current class average</span><span className="font-semibold text-indigo-700">{averageClassProgress}%</span>
              </div>
              <div className="space-y-3">
                {syllabusRows.map((row) => {
                  const status = row.percent >= 67 ? 'On track' : row.percent >= 58 ? 'At risk' : 'Behind';
                  const color = row.percent >= 67 ? 'bg-emerald-500' : row.percent >= 58 ? 'bg-amber-500' : 'bg-rose-500';
                  const statusColor = row.percent >= 67 ? 'text-emerald-700' : row.percent >= 58 ? 'text-amber-700' : 'text-rose-700';
                  return (
                    <div key={row.className} className="grid grid-cols-[76px_minmax(0,1fr)_44px_64px] items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">{row.className}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100" aria-label={`${row.percent}% complete`}><div className={`h-full rounded-full ${color}`} style={{ width: `${row.percent}%` }} /></div>
                      <span className="text-right text-sm font-semibold text-gray-900">{row.percent}%</span>
                      <span className={`text-right text-xs font-medium ${statusColor}`}>{status}</span>
                    </div>
                  );
                })}
                {syllabusRows.length === 0 && <p className="text-sm text-gray-500">No classes match the selected filters.</p>}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">Progress is shown for the selected academic year and term.</span>
                <Button size="xs" variant="outline" leftIcon={<FileBarChart2 className="h-3.5 w-3.5" />} onClick={exportSyllabus}>Full Syllabus Report</Button>
              </div>
            </Card>

            <Card title="Alerts & Actions Needed" headerAction={<Badge variant="danger">{alerts.length} alerts</Badge>}>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.title} className={`rounded-r-lg border-l-4 ${alert.tone} bg-gray-50 px-3 py-3`}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-2.5">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <div className="min-w-0"><p className="text-sm font-semibold text-gray-900">{alert.title}</p><p className="mt-1 text-xs leading-5 text-gray-600">{alert.description}</p></div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-1 self-start">
                        <Button size="xs" variant="outline" onClick={alert.onClick}>{alert.action}</Button>
                        {alert.secondaryAction && <Button size="xs" variant="ghost" onClick={alert.onSecondaryClick}>{alert.secondaryAction}</Button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="This Week’s Teaching Plan" headerAction={<Badge variant="info">24–29 Nov 2025</Badge>}>
              <div className="space-y-3">
                {weekPlans.map((plan) => {
                  const complete = Math.round(plan.completedPeriods / plan.periods * 100);
                  const isSlow = complete < 50;
                  return <div key={`${plan.className}-${plan.subject}`} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div><p className="text-sm font-semibold text-gray-900">{plan.className} | {plan.subject} — {plan.chapter}</p><p className="mt-1 text-xs text-gray-600">{plan.topic} — {plan.periods} periods</p></div>
                      <Badge variant={complete === 100 ? 'success' : isSlow ? 'warning' : 'info'}>{complete === 100 ? 'Complete' : isSlow ? 'Slow' : 'In progress'}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${complete === 100 ? 'bg-emerald-500' : isSlow ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${complete}%` }} /></div><span className="whitespace-nowrap text-xs font-semibold text-gray-700">{plan.completedPeriods} of {plan.periods} periods done</span></div>
                  </div>;
                })}
                {weekPlans.length === 0 && <p className="text-sm text-gray-500">No weekly plans match the selected filters.</p>}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3"><span className="text-xs text-gray-500">Selected week · Class and subject progress</span><Button size="xs" variant="outline" leftIcon={<CalendarDays className="h-3.5 w-3.5" />} onClick={() => navigateTo('teaching-plan')}>Full Weekly Plan</Button></div>
            </Card>

            <Card title="Recent Lesson Plans Submitted" headerAction={<Button size="xs" variant="ghost" onClick={() => navigateTo('teacher-plan-progress')}>Teacher Plan Progress →</Button>}>
              <div className="divide-y divide-gray-100">
                {recentPlans.map((plan) => (
                  <button key={`${plan.teacher}-${plan.topic}`} type="button" onClick={() => navigateTo('teaching-plan')} className="flex w-full flex-col gap-2 py-3 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-2">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><FileText className="h-4 w-4" /></span>
                      <span className="min-w-0"><span className="block truncate text-sm font-semibold text-gray-900">{plan.teacher} — {plan.subject} — {plan.className}</span><span className="mt-1 block text-xs text-gray-500">Period {plan.period} · {plan.date} · {plan.topic}</span></span>
                    </div>
                    <Badge variant={statusVariant(plan.status)} className="self-start sm:self-center">{plan.status}</Badge>
                  </button>
                ))}
                {recentPlans.length === 0 && <p className="py-3 text-sm text-gray-500">No lesson plans match the selected filters.</p>}
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Approved plans are included in the teacher submission tracker.</div>
            </Card>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 shadow-sm">
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-indigo-600" />Dashboard follows Teaching Plan, Teacher Plan Progress and Syllabus Planner.</span>
            <Button size="xs" variant="ghost" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => setRefreshKey((value) => value + 1)}>Refresh summary</Button>
          </div>
          <div className="sr-only" aria-live="polite">{liveData.chapters.length} curriculum chapters and {liveData.weekly.length} weekly plan records loaded.</div>
        </div>
      )}

      {activeTab === 'syllabus' && (
        <SyllabusCompletionTracker
          embedded
          classFilter={applied.className}
          teacherFilter={applied.teacher}
          termFilter={applied.term}
        />
      )}

      {activeTab === 'teacher' && (
        <TeacherProgressDashboard
          embedded
          teacherFilter={applied.teacher}
          classFilter={applied.className}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      )}
    </div>
  );
}
