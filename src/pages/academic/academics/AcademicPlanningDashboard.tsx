import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  FileBarChart2,
  FilePlus2,
  FileText,
  GraduationCap,
  RefreshCw,
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
  DEFAULT_WEEKLY_PLANS,
  downloadPlanningCsv,
  loadPlanningCollection,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type LessonPlanRecord,
  type WeeklyTeachingItem,
} from './academicPlanningData';

type ClassProgress = { className: string; percent: number };

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

const routeTo = (id: string) => `/academic/academics/${id}`;

export function AcademicPlanningDashboard() {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [term, setTerm] = useState('Term 1');
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState('');

  const liveData = useMemo(() => ({
    atps: loadPlanningCollection<AnnualTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS),
    chapters: loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS),
    lessons: loadPlanningCollection<LessonPlanRecord>(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS),
    weekly: loadPlanningCollection<WeeklyTeachingItem>(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS),
  }), [refreshKey]);

  const pendingLessons = liveData.lessons.filter((lesson) => lesson.status === 'Submitted').length;
  const seededPendingLessons = DEFAULT_LESSON_PLANS.filter((lesson) => lesson.status === 'Submitted').length;
  const seededLessonCount = DEFAULT_LESSON_PLANS.length;
  const addedLessonPlans = Math.max(0, liveData.lessons.length - seededLessonCount);
  const pendingApprovalCount = Math.max(0, 23 + pendingLessons - seededPendingLessons);
  const annualPlanCount = Math.max(42, liveData.atps.length);
  const lessonCountThisWeek = 285 + addedLessonPlans;
  const syllabusRows = INITIAL_CLASS_PROGRESS;
  const averageClassProgress = 65.1;
  const behindScheduleCount = 8;
  const assessmentCount = 12;

  const exportSyllabus = () => downloadPlanningCsv(`syllabus-progress-${academicYear}-${term.toLowerCase().replace(' ', '-')}.csv`, [
    ...syllabusRows.map((row) => ({ class: row.className, completionPercent: row.percent, academicYear, term })),
  ]);

  const navigateTo = (id: string) => navigate(routeTo(id));
  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const kpis = [
    {
      label: 'ANNUAL PLANS CREATED',
      value: `${annualPlanCount} / 42`,
      note: 'All Done',
      icon: CalendarDays,
      tone: 'text-indigo-700 bg-indigo-50',
      trend: 'Complete',
    },
    {
      label: 'LESSON PLANS THIS WEEK',
      value: String(lessonCountThisWeek),
      note: '+12% vs. last week',
      icon: FileText,
      tone: 'text-blue-700 bg-blue-50',
      trend: 'On track',
    },
    {
      label: 'SYLLABUS COMPLETION',
      value: '68.5%',
      note: 'School-wide progress',
      icon: BookOpen,
      tone: 'text-emerald-700 bg-emerald-50',
      trend: 'On track',
    },
    {
      label: 'BEHIND SCHEDULE',
      value: `${behindScheduleCount} classes`,
      note: 'Classes need review',
      icon: AlertTriangle,
      tone: 'text-amber-700 bg-amber-50',
      trend: 'Review',
    },
    {
      label: 'ASSESSMENTS THIS MONTH',
      value: String(assessmentCount),
      note: 'Across all classes',
      icon: ClipboardCheck,
      tone: 'text-violet-700 bg-violet-50',
      trend: 'Scheduled',
    },
    {
      label: 'LESSON PLANS PENDING APPROVAL',
      value: String(pendingApprovalCount),
      note: 'Awaiting HOD review',
      icon: Clock3,
      tone: 'text-rose-700 bg-rose-50',
      trend: 'Review',
    },
  ];

  const alerts: Array<{ title: string; description: string; action: string; tone: string; onClick: () => void; secondaryAction?: string; onSecondaryClick?: () => void }> = [
    {
      title: 'Class 10-A Science — 15% Behind',
      description: 'Physics Chapter 5 has not started yet. Exam in 3 weeks — urgent action needed.',
      action: 'View Plan',
      secondaryAction: 'Alert Teacher',
      tone: 'border-l-rose-500',
      onClick: () => navigateTo('weekly-teaching-plan'),
      onSecondaryClick: () => showMessage('Alert sent to the Class 10-A Science teacher.'),
    },
    {
      title: `${pendingApprovalCount} Lesson Plans pending HOD approval`,
      description: 'Oldest pending: 5 days ago.',
      action: 'Review Now',
      tone: 'border-l-amber-500',
      onClick: () => navigateTo('lesson-plan-creation'),
    },
    {
      title: 'Class 9 Maths — No ATP created yet',
      description: 'Annual Teaching Plan missing for Mr. V. Patel — Class 9 Maths.',
      action: 'Create Now',
      tone: 'border-l-amber-500',
      onClick: () => navigateTo('annual-teaching-plan'),
    },
    {
      title: '12 teachers have not submitted weekly lesson plans',
      description: 'Weekly lesson plans are still missing for the current week.',
      action: 'Send Reminder',
      tone: 'border-l-blue-500',
      onClick: () => showMessage('Weekly plan reminder queued for the 12 teachers.'),
    },
  ];

  const statusVariant = (status: string): 'success' | 'warning' | 'primary' | 'default' => {
    if (status === 'Completed' || status.startsWith('Approved')) return 'success';
    if (status === 'Today' || status.startsWith('Pending')) return 'warning';
    if (status === 'Planned') return 'primary';
    return 'default';
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white shadow-lg">
        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 xl:flex-row xl:items-center xl:justify-between xl:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-200">
                <span>School ERP</span><span className="text-white/40">/</span><span>Academic</span><span className="text-white/40">/</span><span className="text-white">Curriculum &amp; Academic Planning</span>
              </div>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-tight md:text-2xl">Academic Planning</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm">
              <span className="text-indigo-100">AY</span>
              <select aria-label="Academic year" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} className="bg-transparent font-medium text-white outline-none [&>option]:text-gray-900">
                <option value="2025-26">2025-26</option><option value="2026-27">2026-27</option><option value="2024-25">2024-25</option>
              </select>
              <ChevronDown className="h-4 w-4 text-indigo-200" />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm">
              <span className="text-indigo-100">Term</span>
              <select aria-label="Term" value={term} onChange={(event) => setTerm(event.target.value)} className="bg-transparent font-medium text-white outline-none [&>option]:text-gray-900">
                <option>Term 1</option><option>Term 2</option><option>Full year</option>
              </select>
              <ChevronDown className="h-4 w-4 text-indigo-200" />
            </label>
            <button type="button" onClick={() => showMessage('You are all caught up on notifications.')} aria-label="Notifications" className="relative rounded-lg p-2.5 text-indigo-100 transition hover:bg-white/10 hover:text-white">
              <Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-indigo-950" />
            </button>
            <button type="button" onClick={() => showMessage('Signed in as Academic Administrator.')} className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-left hover:bg-white/15">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-300 font-semibold text-indigo-950">AD</span>
              <span className="hidden pr-1 text-sm sm:block"><span className="block font-medium">Admin</span><span className="block text-xs text-indigo-200">Academic Office</span></span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7">
          <div>
            <p className="text-sm text-indigo-200">Curriculum &amp; Academic Planning <span className="mx-1 text-white/40">›</span> Dashboard</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Academic Planning Dashboard</h2>
            <p className="mt-1 text-sm text-indigo-100/80">A real-time view of syllabus delivery, teaching plans, and approvals for {academicYear} · {term}.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" leftIcon={<CalendarDays className="h-4 w-4" />} onClick={() => navigateTo('annual-teaching-plan')}>Create Annual Plan</Button>
            <Button size="sm" variant="secondary" leftIcon={<FilePlus2 className="h-4 w-4" />} onClick={() => navigateTo('lesson-plan-creation')}>New Lesson</Button>
            <Button size="sm" variant="secondary" leftIcon={<FileBarChart2 className="h-4 w-4" />} onClick={exportSyllabus}>Syllabus Report</Button>
            <Button size="sm" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportSyllabus} className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">Export</Button>
          </div>
        </div>
      </header>

      {message && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <section aria-label="Academic summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const attention = kpi.trend === 'Review';
          return (
            <Card key={kpi.label} className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold leading-4 tracking-[0.08em] text-gray-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{kpi.value}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{kpi.note}</p>
                </div>
                <span className={`rounded-xl p-2 ${kpi.tone}`}><Icon className="h-5 w-5" /></span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                <span className={`text-xs font-medium ${attention ? 'text-amber-700' : 'text-emerald-700'}`}>{kpi.trend}</span>
                {kpi.label === 'SYLLABUS COMPLETION' && <span className="text-xs text-gray-400">Term goal 75%</span>}
              </div>
            </Card>
          );
        })}
      </section>

      <section aria-label="Academic planning details" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Syllabus Completion by Class" headerAction={<button type="button" onClick={() => navigateTo('curriculum-master')} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">View curriculum →</button>}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
            <span className="text-gray-600">Target by end of {term}</span><span className="font-semibold text-gray-900">75%</span>
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
            {INITIAL_WEEK_PLAN.map((plan) => {
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
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3"><span className="text-xs text-gray-500">Selected week · Class and subject progress</span><Button size="xs" variant="outline" leftIcon={<CalendarDays className="h-3.5 w-3.5" />} onClick={() => navigateTo('weekly-teaching-plan')}>Full Weekly Plan</Button></div>
        </Card>

        <Card title="Recent Lesson Plans Submitted" headerAction={<Button size="xs" variant="ghost" onClick={() => navigateTo('lesson-plan-creation')}>View All Lesson Plans →</Button>}>
          <div className="divide-y divide-gray-100">
            {INITIAL_RECENT_PLANS.map((plan) => (
              <button key={`${plan.teacher}-${plan.topic}`} type="button" onClick={() => navigateTo('lesson-plan-creation')} className="flex w-full flex-col gap-2 py-3 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-2">
                <div className="flex min-w-0 gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><FileText className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-gray-900">{plan.teacher} — {plan.subject} — {plan.className}</span><span className="mt-1 block text-xs text-gray-500">Period {plan.period} · {plan.date} · {plan.topic}</span></span>
                </div>
                <Badge variant={statusVariant(plan.status)} className="self-start sm:self-center">{plan.status}</Badge>
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500"><CheckCircle2 className="h-4 w-4 text-emerald-600" />Approved plans are included in the teacher submission tracker.</div>
        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 shadow-sm">
        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-indigo-600" />Academic planning data is shared with the curriculum, ATP, monthly, weekly, and lesson-plan workspaces.</span>
        <Button size="xs" variant="ghost" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => setRefreshKey((value) => value + 1)}>Refresh summary</Button>
      </div>
      <div className="sr-only" aria-live="polite">{liveData.chapters.length} curriculum chapters and {liveData.weekly.length} weekly plan records loaded.</div>
    </div>
  );
}
