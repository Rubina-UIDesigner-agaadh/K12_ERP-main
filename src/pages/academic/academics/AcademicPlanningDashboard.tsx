import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_WEEKLY_PLANS,
  academicYearForDate,
  checkpointProgress,
  downloadPlanningCsv,
  isPendingWeeklyPlan,
  loadPlanningCollection,
  mondayOfDate,
  type WeeklyTeachingItem,
} from './academicPlanningData';

type ManagementTab = 'planning' | 'teacher';

const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return isoDate(date);
};
const todayIso = () => isoDate(new Date());
const monthKey = (iso: string) => iso.slice(0, 7);
const formatShort = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const avg = (rows: WeeklyTeachingItem[]) => rows.length ? Math.round(rows.reduce((sum, item) => sum + checkpointProgress(item), 0) / rows.length) : 0;

const DEFAULT_FILTERS = {
  academicYear: '2026-27',
  term: 'Term 1',
  className: 'All Classes',
  teacher: 'All Teachers',
  dateFrom: '2026-04-01',
  dateTo: '2027-03-31',
};

const TABS: { id: ManagementTab; label: string }[] = [
  { id: 'planning', label: 'Planning' },
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

const approvedOf = (item: WeeklyTeachingItem) => item.reviewDecision === 'Approved';

type TeacherInsight = {
  teacher: string;
  department: string;
  created: number;
  approved: number;
  pendingReview: number;
  pendingTasks: number;
  weekly: number;
  monthly: number;
  annual: number;
  classes: string[];
  subjects: string[];
};

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

  const weeklyAll = useMemo(
    () => loadPlanningCollection<WeeklyTeachingItem>(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS),
    [refreshKey]
  );

  const teachers = useMemo(() => Array.from(new Set(weeklyAll.map((row) => row.teacher))).sort(), [weeklyAll]);
  const classes = useMemo(() => Array.from(new Set(weeklyAll.map((row) => row.className))).sort(), [weeklyAll]);

  const today = todayIso();
  const currentWeekStart = mondayOfDate();
  const currentWeekEnd = addDays(currentWeekStart, 5);
  const currentMonth = monthKey(today);

  const scoped = useMemo(() => weeklyAll.filter((row) => {
    if (academicYearForDate(row.date) !== applied.academicYear) return false;
    if (applied.dateFrom && row.date < applied.dateFrom) return false;
    if (applied.dateTo && row.date > applied.dateTo) return false;
    if (!matchesClass(row.className, applied.className)) return false;
    if (!matchesTeacher(row.teacher, applied.teacher)) return false;
    return true;
  }), [weeklyAll, applied]);

  const latestWeekStart = useMemo(() => {
    const dates = scoped.map((row) => row.date).sort();
    if (!dates.length) return currentWeekStart;
    return mondayOfDate(new Date(`${dates[dates.length - 1]}T00:00:00`));
  }, [scoped, currentWeekStart]);
  const latestWeekEnd = addDays(latestWeekStart, 5);

  const weekRows = scoped.filter((row) => row.date >= latestWeekStart && row.date <= latestWeekEnd);
  const monthRows = scoped.filter((row) => monthKey(row.date) === (scoped.length ? monthKey(scoped.map((r) => r.date).sort().slice(-1)[0]) : currentMonth));
  const pendingTasks = scoped.filter((row) => isPendingWeeklyPlan(row, today));
  const created = scoped.length;
  const approved = scoped.filter(approvedOf).length;
  const pendingReview = scoped.filter((row) => row.planSubmitted && row.reviewDecision !== 'Approved').length;
  const weeklyPct = avg(weekRows);
  const monthlyPct = avg(monthRows);
  const annualPct = avg(scoped);

  const insights: TeacherInsight[] = useMemo(() => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    scoped.forEach((row) => {
      const list = map.get(row.teacher) || [];
      list.push(row);
      map.set(row.teacher, list);
    });
    return [...map.entries()].map(([name, rows]) => {
      const week = rows.filter((row) => row.date >= latestWeekStart && row.date <= latestWeekEnd);
      const month = rows.filter((row) => monthKey(row.date) === (rows.length ? monthKey(rows.map((r) => r.date).sort().slice(-1)[0]) : currentMonth));
      return {
        teacher: name,
        department: rows[0]?.department || '—',
        created: rows.length,
        approved: rows.filter(approvedOf).length,
        pendingReview: rows.filter((row) => row.planSubmitted && row.reviewDecision !== 'Approved').length,
        pendingTasks: rows.filter((row) => isPendingWeeklyPlan(row, today)).length,
        weekly: avg(week),
        monthly: avg(month),
        annual: avg(rows),
        classes: Array.from(new Set(rows.map((r) => `${r.className}-${r.section}`))),
        subjects: Array.from(new Set(rows.map((r) => r.subject))),
      };
    }).sort((a, b) => a.annual - b.annual || a.teacher.localeCompare(b.teacher));
  }, [scoped, latestWeekStart, latestWeekEnd, currentMonth, today]);

  const visibleInsights = insights.filter((row) => statusFilter === 'All'
    || (statusFilter === 'Approved' && row.approved > 0)
    || (statusFilter === 'Pending' && (row.pendingTasks > 0 || row.pendingReview > 0)));

  const recentPlans = [...scoped]
    .filter((row) => statusFilter === 'All'
      || (statusFilter === 'Approved' && approvedOf(row))
      || (statusFilter === 'Pending' && (!approvedOf(row) || isPendingWeeklyPlan(row, today)))
      || (statusFilter === 'Draft' && !row.planSubmitted))
    .sort((a, b) => b.date.localeCompare(a.date) || a.periodNumber - b.periodNumber)
    .slice(0, 8);

  const exportAllReports = () => downloadPlanningCsv('teacher-plan-insights.csv', insights.map((row) => ({
    Teacher: row.teacher,
    Department: row.department,
    'Plans created': row.created,
    'Admin approved': row.approved,
    'Pending review': row.pendingReview,
    'Pending tasks': row.pendingTasks,
    'Weekly %': row.weekly,
    'Monthly %': row.monthly,
    'Annual %': row.annual,
  })));

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

  const kpis = [
    { label: 'Plans created', value: String(created), note: 'Teaching plans in range', icon: FileText, tone: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
    { label: 'Admin approved', value: `${approved} / ${created || 0}`, note: 'Principal / admin review', icon: CheckCircle2, tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { label: 'Pending review', value: String(pendingReview), note: 'Submitted, not approved', icon: ClipboardCheck, tone: 'text-amber-700 bg-amber-50 border-amber-100' },
    { label: 'Pending tasks', value: String(pendingTasks.length), note: 'Delayed or incomplete', icon: Clock3, tone: 'text-rose-700 bg-rose-50 border-rose-100' },
    { label: 'Weekly completion', value: `${weeklyPct}%`, note: `${formatShort(latestWeekStart)} – ${formatShort(latestWeekEnd)}`, icon: CalendarDays, tone: 'text-blue-700 bg-blue-50 border-blue-100' },
    { label: 'Monthly completion', value: `${monthlyPct}%`, note: monthRows.length ? monthKey(monthRows[0].date) : currentMonth, icon: CalendarDays, tone: 'text-sky-700 bg-sky-50 border-sky-100' },
    { label: 'Annual completion', value: `${annualPct}%`, note: applied.academicYear, icon: CalendarDays, tone: 'text-teal-700 bg-teal-50 border-teal-100' },
    { label: 'Teachers tracked', value: String(insights.length), note: 'With plans in this view', icon: Users, tone: 'text-purple-700 bg-purple-50 border-purple-100' },
  ];

  const progressBar = (value: number, color = 'bg-indigo-500') => (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full ${value < 50 ? 'bg-rose-500' : value < 75 ? 'bg-amber-500' : color}`} style={{ width: `${value}%` }} />
    </div>
  );

  return (
    <div className="space-y-5 p-4 md:p-6 bg-gray-50 min-h-full">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs text-gray-500">Home → Academic → Curriculum & Academic Planning</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">Academic Management Dashboard</h1>
          <p className="text-sm text-gray-500">
            Teaching plans created by teachers, admin approvals, and completion vs pending work.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportAllReports}>Export All Reports</Button>
          <Button size="sm" variant="primary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => { setRefreshKey((value) => value + 1); showMessage('Dashboard refreshed.'); }}>Refresh</Button>
        </div>
      </header>

      {message && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <section aria-label="Plan summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((kpi) => {
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
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
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
              {['All Classes', ...classes].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Teacher
            <select aria-label="Teacher" value={teacher} onChange={(event) => setTeacher(event.target.value)} className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              {['All Teachers', ...teachers].map((option) => <option key={option}>{option}</option>)}
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
            <Button size="sm" variant="outline" leftIcon={<Users className="h-4 w-4" />} onClick={() => navigateTo('teacher-plan-progress-admin')}>Plan Progress Admin</Button>
            <Button size="sm" variant="primary" leftIcon={<Download className="h-4 w-4" />} onClick={exportAllReports}>Export</Button>
          </div>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card title="Plan completion — weekly / monthly / annual">
              <div className="space-y-4">
                {[
                  { label: 'Weekly', value: weeklyPct, note: `${formatShort(latestWeekStart)} – ${formatShort(latestWeekEnd)}` },
                  { label: 'Monthly', value: monthlyPct, note: monthRows.length ? monthKey(monthRows[0].date) : currentMonth },
                  { label: 'Annual', value: annualPct, note: applied.academicYear },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{row.label} completion</span>
                      <b className="text-indigo-700">{row.value}%</b>
                    </div>
                    {progressBar(row.value)}
                    <p className="mt-1 text-[11px] text-gray-400">{row.note}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Alerts & pending work" headerAction={<Badge variant="danger">{pendingTasks.length + pendingReview} open</Badge>}>
              <div className="space-y-3">
                {pendingReview > 0 && (
                  <div className="rounded-r-lg border-l-4 border-l-amber-500 bg-gray-50 px-3 py-3">
                    <p className="text-sm font-semibold text-gray-900">{pendingReview} plan(s) waiting for admin approval</p>
                    <p className="mt-1 text-xs text-gray-600">Submitted teaching plans that are not approved yet.</p>
                    <Button size="xs" variant="outline" className="mt-2" onClick={() => navigateTo('teaching-plan')}>Review Now</Button>
                  </div>
                )}
                {pendingTasks.length > 0 && (
                  <div className="rounded-r-lg border-l-4 border-l-rose-500 bg-gray-50 px-3 py-3">
                    <p className="text-sm font-semibold text-gray-900">{pendingTasks.length} delayed / incomplete task(s)</p>
                    <p className="mt-1 text-xs text-gray-600">Plan dates have passed and checkpoints are not fully ticked.</p>
                    <Button size="xs" variant="outline" className="mt-2" onClick={() => navigateTo('teacher-plan-progress-admin')}>Open Pending Plans</Button>
                  </div>
                )}
                {insights.filter((row) => row.annual < 75).slice(0, 3).map((row) => (
                  <div key={row.teacher} className="rounded-r-lg border-l-4 border-l-amber-400 bg-gray-50 px-3 py-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{row.teacher} — {row.annual}% annual completion</p>
                        <p className="mt-1 text-xs text-gray-600">{row.pendingTasks} pending task(s) · {row.approved}/{row.created} approved</p>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingReview === 0 && pendingTasks.length === 0 && insights.every((row) => row.annual >= 75) && (
                  <p className="text-sm text-emerald-700">No pending plan work for the selected filters.</p>
                )}
              </div>
            </Card>

            <Card title="This week’s teaching plans" headerAction={<Badge variant="info">{formatShort(latestWeekStart)} – {formatShort(latestWeekEnd)}</Badge>}>
              <div className="space-y-3">
                {weekRows.slice(0, 8).map((plan) => {
                  const complete = checkpointProgress(plan);
                  return (
                    <div key={plan.id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{plan.teacher} · {plan.className}-{plan.section} · {plan.subject}</p>
                          <p className="mt-1 text-xs text-gray-600">{plan.chapter}{plan.topic ? ` — ${plan.topic}` : ''} · Period {plan.periodNumber}</p>
                        </div>
                        <Badge variant={approvedOf(plan) ? 'success' : plan.planSubmitted ? 'warning' : 'default'}>{approvedOf(plan) ? 'Approved' : plan.planSubmitted ? 'Pending review' : 'Draft'}</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${complete === 100 ? 'bg-emerald-500' : complete < 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${complete}%` }} /></div>
                        <span className="whitespace-nowrap text-xs font-semibold text-gray-700">{complete}%</span>
                      </div>
                    </div>
                  );
                })}
                {weekRows.length === 0 && <p className="text-sm text-gray-500">No teaching plans in this week.</p>}
              </div>
              <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                <Button size="xs" variant="outline" onClick={() => navigateTo('teaching-plan')}>Open Teaching Plan</Button>
              </div>
            </Card>

            <Card title="Recent plans · created & approval" headerAction={<Button size="xs" variant="ghost" onClick={() => navigateTo('teacher-plan-progress-admin')}>Admin view →</Button>}>
              <div className="divide-y divide-gray-100">
                {recentPlans.map((plan) => (
                  <button key={plan.id} type="button" onClick={() => navigateTo('teaching-plan')} className="flex w-full flex-col gap-2 py-3 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-2">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><FileText className="h-4 w-4" /></span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gray-900">{plan.teacher} — {plan.subject} — {plan.className}-{plan.section}</span>
                        <span className="mt-1 block text-xs text-gray-500">Period {plan.periodNumber} · {formatShort(plan.date)} · {plan.topic || plan.chapter} · {checkpointProgress(plan)}% complete</span>
                      </span>
                    </div>
                    <Badge variant={approvedOf(plan) ? 'success' : isPendingWeeklyPlan(plan, today) ? 'warning' : 'default'}>
                      {approvedOf(plan) ? 'Approved' : isPendingWeeklyPlan(plan, today) ? 'Pending task' : plan.reviewDecision || 'Awaiting review'}
                    </Badge>
                  </button>
                ))}
                {recentPlans.length === 0 && <p className="py-3 text-sm text-gray-500">No teaching plans match the selected filters.</p>}
              </div>
            </Card>
          </section>
        </div>
      )}

      {activeTab === 'teacher' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Each teacher’s plan completion (weekly, monthly, annual) and pending tasks, from Teaching Plan and Teacher Plan Progress.</p>
          {visibleInsights.length === 0 && (
            <Card>
              <p className="text-sm text-gray-500">No teacher plans match the selected filters.</p>
            </Card>
          )}
          {visibleInsights.map((row) => (
            <Card key={row.teacher}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${row.annual < 50 ? 'bg-red-500' : row.annual < 75 ? 'bg-amber-500' : 'bg-indigo-600'}`}>{initials(row.teacher)}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.teacher}</p>
                    <p className="text-sm text-slate-500">{row.department} · {row.classes.join(', ')} · {row.subjects.join(', ')}</p>
                    <p className="mt-1 text-xs text-slate-500">{row.created} plans created · {row.approved} admin approved · {row.pendingReview} pending review · {row.pendingTasks} pending tasks</p>
                  </div>
                </div>
                <Button size="xs" variant="outline" onClick={() => navigateTo('teacher-plan-progress-admin')}>View in admin</Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Weekly', value: row.weekly },
                  { label: 'Monthly', value: row.monthly },
                  { label: 'Annual', value: row.annual },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-gray-600">{item.label}</span><b>{item.value}%</b></div>
                    {progressBar(item.value, 'bg-emerald-500')}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
