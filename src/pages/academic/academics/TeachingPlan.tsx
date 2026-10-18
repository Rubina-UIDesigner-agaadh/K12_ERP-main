import React, { useMemo, useState } from 'react';
import { Download, Printer, RefreshCw } from 'lucide-react';
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
  downloadPlanningCsv,
  loadPlanningCollection,
  mondayOfDate,
  savePlanningCollection,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type LessonPlanRecord,
  type MonthlyTeachingPlanRecord,
  type TeachingPlanFilters,
  type WeeklyTeachingItem
} from './academicPlanningData';
import { PageHeader, SelectField } from './academicPlanningData';
import { AnnualTeachingPlan } from './AnnualTeachingPlan';
import { MonthlyTeachingPlan } from './MonthlyTeachingPlan';
import { WeeklyTeachingPlan } from './WeeklyTeachingPlan';

const SECTIONS = ['All Sections', 'A', 'B', 'C', 'D'];
const DEPARTMENTS = ['All Departments', 'Science', 'Mathematics', 'Languages', 'Social Science', 'Computer Science'];
const TEACHERS = ['All Teachers', 'Mr. R. Kumar', 'Mrs. S. Joshi', 'Mr. V. Patel', 'Ms. P. Roy', 'Mrs. P. Gupta', 'Mrs. Singh', 'Ms. Roy'];

export function TeachingPlan() {
  const [filters, setFilters] = useState<TeachingPlanFilters>(DEFAULT_TEACHING_PLAN_FILTERS);
  const [planTab, setPlanTab] = useState<'annual' | 'monthly' | 'weekly'>('annual');
  const [atps, setAtps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyTeachingPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS));
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyTeachingItem[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const [lessons, setLessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [weekStart, setWeekStart] = useState(mondayOfDate());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { month: now.toLocaleString('en-IN', { month: 'long' }), year: String(now.getFullYear()) };
  });

  const persistAtps = (next: AnnualTeachingPlanRecord[]) => { setAtps(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.atps, next); };
  const persistMonthly = (next: MonthlyTeachingPlanRecord[]) => { setMonthlyPlans(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, next); };
  const persistWeekly = (next: WeeklyTeachingItem[]) => { setWeeklyPlans(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next); };
  const persistLessons = (next: LessonPlanRecord[]) => { setLessons(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, next); };
  const setFilter = <K extends keyof TeachingPlanFilters,>(key: K, value: TeachingPlanFilters[K]) => setFilters((current) => ({ ...current, [key]: value }));

  const reloadFromStorage = () => {
    setAtps(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
    setMonthlyPlans(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS));
    setWeeklyPlans(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
    setLessons(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  };

  const teacherMonthly = useMemo(() => {
    const groups = new Map<string, MonthlyTeachingPlanRecord[]>();
    monthlyPlans.forEach((plan) => {
      const list = groups.get(plan.teacher) || [];
      list.push(plan);
      groups.set(plan.teacher, list);
    });
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [monthlyPlans]);

  const teacherWeekly = useMemo(() => {
    const groups = new Map<string, WeeklyTeachingItem[]>();
    weeklyPlans.forEach((item) => {
      const list = groups.get(item.teacher) || [];
      list.push(item);
      groups.set(item.teacher, list);
    });
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [weeklyPlans]);

  const runPrint = (section: 'annual' | 'monthly' | 'weekly') => {
    document.querySelectorAll('.tp-section-annual, .tp-section-monthly, .tp-section-weekly').forEach((node) => node.classList.add('print:hidden'));
    document.querySelector(`.tp-section-${section}`)?.classList.remove('print:hidden');
    window.print();
    document.querySelectorAll('.tp-section-annual, .tp-section-monthly, .tp-section-weekly').forEach((node) => node.classList.remove('print:hidden'));
  };

  const exportCsv = () => {
    if (planTab === 'annual') {
      downloadPlanningCsv('annual-teaching-plans.csv', atps.map((item) => ({ ID: item.id, Teacher: item.teacher, Class: item.className, Subject: item.subject, Year: item.academicYear, Status: item.status })));
      return;
    }
    if (planTab === 'monthly') {
      downloadPlanningCsv('monthly-teaching-plans.csv', monthlyPlans.map((item) => ({ ID: item.id, Teacher: item.teacher, Class: item.className, Subject: item.subject, Month: `${item.month} ${item.year}`, Status: item.status })));
      return;
    }
    downloadPlanningCsv('weekly-teaching-plans.csv', weeklyPlans.map((item) => ({ ID: item.id, Teacher: item.teacher, Class: item.className, Subject: item.subject, Date: item.date, Period: item.periodNumber, Topic: item.topic, Status: item.status })));
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader
        title="Teaching Plan"
        description="Annual, monthly and weekly teaching plans listed teacher-wise. Plans already created stay on this page."
        actions={(
          <>
            <Button variant="outline" onClick={reloadFromStorage}><RefreshCw className="h-4 w-4" />Refresh</Button>
            <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button>
            <Button variant="outline" onClick={() => runPrint(planTab)}><Printer className="h-4 w-4" />Print</Button>
          </>
        )}
      />

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <SelectField label="Academic Year" value={filters.academicYear} onChange={(value) => setFilter('academicYear', value)} options={ACADEMIC_YEARS} />
          <SelectField label="Class" value={filters.className} onChange={(value) => setFilter('className', value)} options={['All Classes', ...CLASSES]} />
          <SelectField label="Section" value={filters.section} onChange={(value) => setFilter('section', value)} options={SECTIONS} />
          <SelectField label="Subject" value={filters.subject} onChange={(value) => setFilter('subject', value)} options={['All Subjects', ...SUBJECTS]} />
          <SelectField label="Teacher" value={filters.teacher} onChange={(value) => setFilter('teacher', value)} options={TEACHERS} />
          <SelectField label="Department" value={filters.department} onChange={(value) => setFilter('department', value)} options={DEPARTMENTS} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {([
          ['annual', 'Annual Teaching Plan'],
          ['monthly', 'Monthly Teaching Plan'],
          ['weekly', 'Weekly Teaching Plan']
        ] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setPlanTab(id)} className={`rounded-lg px-4 py-2 text-sm font-medium ${planTab === id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {planTab === 'monthly' && (
        <Card title="Monthly plans by teacher">
          <div className="space-y-3">
            {teacherMonthly.map(([teacher, plans]) => (
              <div key={teacher} className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm font-semibold text-gray-900">{teacher} · {plans.length} plan(s)</p>
                <p className="text-xs text-gray-500">{plans.map((plan) => `${plan.className} ${plan.section} ${plan.subject} — ${plan.month} ${plan.year} (${plan.status})`).join(' · ')}</p>
              </div>
            ))}
            {teacherMonthly.length === 0 && <p className="text-sm text-gray-500">No monthly plans stored yet.</p>}
          </div>
        </Card>
      )}

      {planTab === 'weekly' && (
        <Card title="Weekly plans by teacher">
          <div className="space-y-3">
            {teacherWeekly.map(([teacher, items]) => (
              <div key={teacher} className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm font-semibold text-gray-900">{teacher} · {items.length} period(s)</p>
                <p className="text-xs text-gray-500">{[...new Set(items.map((item) => `${item.className} ${item.section} ${item.subject}`))].join(' · ')}</p>
              </div>
            ))}
            {teacherWeekly.length === 0 && <p className="text-sm text-gray-500">No weekly plans stored yet.</p>}
          </div>
        </Card>
      )}

      {planTab === 'annual' && (
        <div className="tp-section-annual">
          <AnnualTeachingPlan
            atps={atps}
            persistAtps={persistAtps}
            chapters={chapters}
            filters={filters}
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
            month={calendarMonth.month}
            calendarYear={calendarMonth.year}
            onMonthChange={(month, year) => setCalendarMonth({ month, year })}
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
            onPrint={() => runPrint('weekly')}
          />
        </div>
      )}
    </div>
  );
}

export const TeachingPlanManager = TeachingPlan;
export default TeachingPlan;
