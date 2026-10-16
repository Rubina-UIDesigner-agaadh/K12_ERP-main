import { useMemo, useState } from 'react';
import { CalendarDays, Download, FilePlus2, Printer, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import {
  ACADEMIC_PLANNING_KEYS,
  ACADEMIC_YEARS,
  CLASSES,
  DEFAULT_ATPS,
  DEFAULT_CURRICULUM_CHAPTERS,
  DEFAULT_LESSON_PLANS,
  DEFAULT_MONTHLY_PLANS,
  DEFAULT_TEACHING_PLAN_FILTERS,
  DEFAULT_WEEKLY_PLANS,
  SUBJECTS,
  academicYearForDate,
  academicYearForMonthYear,
  downloadPlanningCsv,
  loadPlanningCollection,
  matchesTeachingPlanFilters,
  mondayOfDate,
  savePlanningCollection,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type LessonPlanRecord,
  type MonthlyTeachingPlanRecord,
  type TeachingPlanFilters,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { SelectField } from './academicPlanningData';
import { AnnualTeachingPlan } from './AnnualTeachingPlan';
import { MonthlyTeachingPlan } from './MonthlyTeachingPlan';
import { WeeklyTeachingPlan } from './WeeklyTeachingPlan';

const ALL_FILTERS = DEFAULT_TEACHING_PLAN_FILTERS;
const today = new Date();
const currentMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][today.getMonth()];

export function TeachingPlan() {
  const [atps, setAtps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyTeachingPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS));
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyTeachingItem[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const [lessons, setLessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [filters, setFilters] = useState<TeachingPlanFilters>(ALL_FILTERS);
  const [month, setMonth] = useState(currentMonthName);
  const [calendarYear, setCalendarYear] = useState(String(today.getFullYear()));
  const [weekStart, setWeekStart] = useState(mondayOfDate(today));
  const [createAnnualTick, setCreateAnnualTick] = useState(0);
  const [createMonthlyTick, setCreateMonthlyTick] = useState(0);
  const [createWeeklyTick, setCreateWeeklyTick] = useState(0);
  const [printScope, setPrintScope] = useState<'all' | 'annual' | 'monthly' | 'weekly'>('all');
  const [message, setMessage] = useState('');
  const [planTab, setPlanTab] = useState<'annual' | 'monthly' | 'weekly'>('annual');

  const persistAtps = (next: AnnualTeachingPlanRecord[]) => { setAtps(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.atps, next); };
  const persistMonthly = (next: MonthlyTeachingPlanRecord[]) => { setMonthlyPlans(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, next); };
  const persistWeekly = (next: WeeklyTeachingItem[]) => { setWeeklyPlans(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next); };
  const persistLessons = (next: LessonPlanRecord[]) => { setLessons(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, next); };

  const flash = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 4000); };
  const setFilter = (key: keyof TeachingPlanFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  const teachers = useMemo(() => [...new Set([...atps.map((item) => item.teacher), ...monthlyPlans.map((item) => item.teacher), ...weeklyPlans.map((item) => item.teacher)].filter(Boolean))].sort(), [atps, monthlyPlans, weeklyPlans]);
  const departments = useMemo(() => [...new Set([...atps.map((item) => item.department), ...weeklyPlans.map((item) => item.department)].filter(Boolean))].sort(), [atps, weeklyPlans]);

  const annualScoped = useMemo(() => atps.filter((item) => item.academicYear === filters.academicYear && matchesTeachingPlanFilters(item, filters)), [atps, filters]);
  const monthlyScoped = useMemo(() => monthlyPlans.filter((item) => item.month === month && item.year === calendarYear && academicYearForMonthYear(item.month, item.year) === filters.academicYear && matchesTeachingPlanFilters(item, filters)), [monthlyPlans, month, calendarYear, filters]);
  const weeklyScoped = useMemo(() => {
    const weekEnd = (() => { const date = new Date(`${weekStart}T00:00:00`); date.setDate(date.getDate() + 5); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; })();
    return weeklyPlans.filter((item) => item.date >= weekStart && item.date <= weekEnd && academicYearForDate(item.date) === filters.academicYear && matchesTeachingPlanFilters(item, filters));
  }, [weeklyPlans, weekStart, filters]);
  const lessonSubmissions = weeklyScoped.filter((item) => item.planSubmitted).length;

  const runPrint = (scope: 'all' | 'annual' | 'monthly' | 'weekly') => {
    setPrintScope(scope);
    window.setTimeout(() => window.print(), 50);
  };

  const exportAll = () => {
    const annualRows = annualScoped.map((item) => ({
      recordType: 'annual-plan',
      id: item.id,
      academicYear: item.academicYear,
      teacher: item.teacher,
      department: item.department,
      className: item.className,
      section: item.sections,
      subject: item.subject,
      status: item.status,
      month: '',
      year: '',
      date: item.createdDate,
      period: '',
      chapter: '',
      topic: '',
      room: '',
      periodsPlanned: item.netTeachingPeriods,
      lessonSubmitted: '',
    }));
    const monthlyRows = monthlyScoped.flatMap((plan) => (plan.periods.length ? plan.periods : [{ id: plan.id, weekNumber: 0, date: '', periodNumber: 0, chapter: '', topic: '', subTopic: '', teachingMethod: '', resources: '', expectedOutcome: '', status: plan.status, reason: '', movedToDate: '', understanding: '', note: '' }]).map((period) => ({
      recordType: 'monthly-period',
      id: `${plan.id}:${period.id}`,
      academicYear: filters.academicYear,
      teacher: plan.teacher,
      department: '',
      className: plan.className,
      section: plan.section,
      subject: plan.subject,
      status: period.status || plan.status,
      month: plan.month,
      year: plan.year,
      date: period.date,
      period: period.periodNumber,
      chapter: period.chapter,
      topic: period.topic,
      room: '',
      periodsPlanned: plan.totalPeriodsPlanned,
      lessonSubmitted: '',
    })));
    const weeklyRows = weeklyScoped.map((item) => ({
      recordType: 'weekly-schedule',
      id: item.id,
      academicYear: academicYearForDate(item.date),
      teacher: item.teacher,
      department: item.department,
      className: item.className,
      section: item.section,
      subject: item.subject,
      status: item.status,
      month: '',
      year: '',
      date: item.date,
      period: item.periodNumber,
      chapter: item.chapter,
      topic: item.topic,
      room: item.room,
      periodsPlanned: 1,
      lessonSubmitted: item.planSubmitted ? 'Yes' : 'No',
    }));
    const rows = [...annualRows, ...monthlyRows, ...weeklyRows];
    if (!rows.length) { flash('No records match the current filters to export.'); return; }
    downloadPlanningCsv(`teaching-plans-all-${filters.academicYear}.csv`, rows);
  };

  const reloadFromStorage = () => {
    setAtps(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
    setMonthlyPlans(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS));
    setWeeklyPlans(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
    setLessons(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
    flash('Planning data reloaded from local storage.');
  };

  const kpis = [
    { label: 'Annual Plans Created', value: String(annualScoped.length), note: `Academic year ${filters.academicYear}` },
    { label: 'Annual Plans Awaiting HOD Review', value: String(annualScoped.filter((item) => item.status === 'Submitted').length), note: `Academic year ${filters.academicYear}` },
    { label: 'Approved Annual Plans', value: String(annualScoped.filter((item) => item.status === 'HOD Approved' || item.status === 'Principal Viewed' || item.principalViewed).length), note: 'Includes Principal Viewed' },
    { label: 'Monthly Plans — Selected Month', value: String(monthlyScoped.length), note: `${month} ${calendarYear}` },
    { label: 'Scheduled Periods — Selected Week', value: String(weeklyScoped.length), note: `Week of ${weekStart}` },
    { label: 'Lesson Plans Submitted — Selected Week', value: `${lessonSubmissions} / ${weeklyScoped.length || 0}`, note: 'From weekly schedule items' },
  ];

  return (
    <div className={`space-y-6 p-4 md:p-6 bg-slate-50 min-h-full tp-print-${printScope}`}>
      <style>{`
        @media print {
          .tp-no-print { display: none !important; }
          .tp-print-annual .tp-section-monthly, .tp-print-annual .tp-section-weekly { display: none !important; }
          .tp-print-monthly .tp-section-annual, .tp-print-monthly .tp-section-weekly { display: none !important; }
          .tp-print-weekly .tp-section-annual, .tp-print-weekly .tp-section-monthly { display: none !important; }
          table { overflow: visible !important; }
        }
      `}</style>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Teaching Plan Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage annual planning, monthly teaching schedules, and weekly classroom delivery in one place.</p>
        </div>
        <div className="tp-no-print flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => setCreateAnnualTick((value) => value + 1)}><FilePlus2 className="h-4 w-4" />Create ATP</Button>
          <Button size="sm" variant="outline" onClick={() => setCreateMonthlyTick((value) => value + 1)}><CalendarDays className="h-4 w-4" />Create Monthly Plan</Button>
          <Button size="sm" variant="outline" onClick={() => setCreateWeeklyTick((value) => value + 1)}>Add Schedule Item</Button>
          <Button size="sm" variant="outline" onClick={exportAll}><Download className="h-4 w-4" />Export All</Button>
          <Button size="sm" variant="outline" onClick={() => runPrint('all')}><Printer className="h-4 w-4" />Print / PDF</Button>
          <Button size="sm" variant="ghost" onClick={reloadFromStorage}><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
      </header>

      {message && <div role="status" className="tp-no-print rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <Card className="tp-no-print">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <SelectField label="Academic Year" value={filters.academicYear} onChange={(value) => setFilter('academicYear', value)} options={ACADEMIC_YEARS} />
          <SelectField label="Class" value={filters.className} onChange={(value) => setFilter('className', value)} options={['All Classes', ...CLASSES]} />
          <SelectField label="Section" value={filters.section} onChange={(value) => setFilter('section', value)} options={['All Sections', 'A', 'B', 'C', 'D']} />
          <SelectField label="Subject" value={filters.subject} onChange={(value) => setFilter('subject', value)} options={['All Subjects', ...SUBJECTS]} />
          <SelectField label="Teacher" value={filters.teacher} onChange={(value) => setFilter('teacher', value)} options={['All Teachers', ...teachers]} />
          <SelectField label="Department" value={filters.department} onChange={(value) => setFilter('department', value)} options={['All Departments', ...departments]} />
          <div className="flex items-end"><Button variant="outline" onClick={() => setFilters(ALL_FILTERS)}>Reset Filters</Button></div>
        </div>
      </Card>

      <Card title="Planning Overview">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium">Annual Plans <b>{annualScoped.length}</b></span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-sky-50 px-3 py-1 font-medium">Monthly Plans <b>{monthlyScoped.length}</b></span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium">Weekly Periods <b>{weeklyScoped.length}</b></span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 font-medium">Lesson Submissions <b>{lessonSubmissions}</b></span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Counts follow the shared filters. Completion is not implied from a count greater than zero.</p>
      </Card>

      <section aria-label="Shared KPI summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
          </Card>
        ))}
      </section>

      <div className="tp-no-print sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-slate-50 px-4 md:-mx-6 md:px-6" role="tablist" aria-label="Teaching plan levels">
        {([
          { id: 'annual', label: 'Annual Teaching Plans' },
          { id: 'monthly', label: 'Monthly Teaching Plans' },
          { id: 'weekly', label: 'Weekly Teaching Plans' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={planTab === tab.id}
            onClick={() => setPlanTab(tab.id)}
            className={`mr-1 px-4 py-3 text-sm font-semibold border-b-2 ${planTab === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {planTab === 'annual' && (
        <div className="tp-section-annual">
          <AnnualTeachingPlan
            atps={atps}
            persistAtps={persistAtps}
            chapters={chapters}
            filters={filters}
            createTick={createAnnualTick}
            onPrint={() => runPrint('annual')}
          />
        </div>
      )}
      {planTab === 'monthly' && (
        <div className="tp-section-monthly">
          <MonthlyTeachingPlan
            plans={monthlyPlans}
            persistPlans={persistMonthly}
            atps={atps}
            chapters={chapters}
            filters={filters}
            month={month}
            calendarYear={calendarYear}
            onMonthChange={(nextMonth, nextYear) => { setMonth(nextMonth); setCalendarYear(nextYear); }}
            createTick={createMonthlyTick}
            onPrint={() => runPrint('monthly')}
          />
        </div>
      )}
      {planTab === 'weekly' && (
        <div className="tp-section-weekly">
          <WeeklyTeachingPlan
            items={weeklyPlans}
            persistItems={persistWeekly}
            lessonPlans={lessons}
            persistLessons={persistLessons}
            atps={atps}
            filters={filters}
            weekStart={weekStart}
            onWeekStartChange={setWeekStart}
            createTick={createWeeklyTick}
            onPrint={() => runPrint('weekly')}
          />
        </div>
      )}
    </div>
  );
}

export const TeachingPlanManager = TeachingPlan;
export default TeachingPlan;
