import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import {
  ACADEMIC_PLANNING_KEYS,
  DEFAULT_ATPS,
  DEFAULT_LESSON_PLANS,
  DEFAULT_MONTHLY_PLANS,
  DEFAULT_WEEKLY_PLANS,
  createBlankLesson,
  downloadPlanningCsv,
  loadPlanningCollection,
  mondayOfDate,
  savePlanningCollection,
  type PeriodStatus,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { EmptyState, StatusPill, TextAreaField, TextField } from './academicPlanningData';

const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return isoDate(date); };
const formatShort = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export function TeacherPlanProgressPage({ currentTeacher = 'Mr. R. Kumar' }: { currentTeacher?: string }) {
  const [allWeekly, setAllWeekly] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const [allMonthly, setAllMonthly] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS));
  const [allLessons, setAllLessons] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [allAtps] = useState(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [weekStart, setWeekStart] = useState(mondayOfDate());
  const [skipTarget, setSkipTarget] = useState<WeeklyTeachingItem | null>(null);
  const [skipReason, setSkipReason] = useState('');
  const [postponeTarget, setPostponeTarget] = useState<WeeklyTeachingItem | null>(null);
  const [postponeDate, setPostponeDate] = useState('');
  const [toast, setToast] = useState('');

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 3500); };

  const persistWeekly = (updated: WeeklyTeachingItem) => {
    const next = allWeekly.some((row) => row.id === updated.id) ? allWeekly.map((row) => row.id === updated.id ? updated : row) : [updated, ...allWeekly];
    savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next);
    setAllWeekly(next);
    const monthlyNext = allMonthly.map((plan) => {
      if (plan.teacher !== currentTeacher) return plan;
      const periods = plan.periods.map((period) => {
        const sameDay = period.date === updated.date && period.periodNumber === updated.periodNumber;
        const sameChapter = period.chapter && updated.chapter && period.chapter === updated.chapter;
        if (!sameDay && !sameChapter) return period;
        return { ...period, status: updated.status };
      });
      const done = periods.filter((row) => row.status === 'Completed').length;
      return { ...plan, periods, completionPercent: periods.length ? Math.round(done / periods.length * 100) : plan.completionPercent };
    });
    savePlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, monthlyNext);
    setAllMonthly(monthlyNext);
  };

  const myWeekly = allWeekly.filter((row) => row.teacher === currentTeacher && row.date >= weekStart && row.date <= addDays(weekStart, 5));
  const completed = myWeekly.filter((row) => row.status === 'Completed').length;
  const percent = myWeekly.length ? Math.round(completed / myWeekly.length * 100) : 0;
  const myAtp = allAtps.find((row) => row.teacher === currentTeacher);
  const days = useMemo(() => {
    const map = new Map<string, WeeklyTeachingItem[]>();
    myWeekly.forEach((item) => {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [myWeekly]);

  const mark = (item: WeeklyTeachingItem, status: PeriodStatus) => {
    persistWeekly({ ...item, status });
    flash(status === 'Completed' ? `${item.subject} period marked complete. Weekly progress updated.` : `Period marked ${status}.`);
  };

  const submitLesson = (item: WeeklyTeachingItem) => {
    persistWeekly({ ...item, planSubmitted: true });
    const matching = allLessons.find((lesson) => lesson.teacher === item.teacher && lesson.className === item.className && lesson.subject === item.subject && lesson.date === item.date);
    if (matching) {
      const next = allLessons.map((lesson) => lesson.id === matching.id ? { ...lesson, status: 'Submitted' as const } : lesson);
      savePlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, next);
      setAllLessons(next);
    }
    flash('Lesson plan submitted for this period.');
  };

  const createDraft = (item: WeeklyTeachingItem) => {
    const existing = allLessons.find((lesson) => lesson.teacher === item.teacher && lesson.className === item.className && lesson.date === item.date && lesson.periodNumber === item.periodNumber);
    if (existing) { flash(`Lesson already exists: ${existing.title || existing.id}`); return; }
    const blank = createBlankLesson();
    blank.teacher = item.teacher; blank.className = item.className; blank.section = item.section; blank.subject = item.subject; blank.date = item.date; blank.periodNumber = item.periodNumber; blank.periodTime = item.time; blank.room = item.room; blank.chapter = item.chapter; blank.topic = item.topic; blank.title = item.topic || `${item.subject} lesson`;
    const next = [{ ...blank, status: 'Draft' as const }, ...allLessons];
    savePlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, next);
    setAllLessons(next);
    flash('Draft lesson created for this period.');
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-slate-50 min-h-full">
      {toast && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{toast}</div>}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">{initials(currentTeacher)}</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Weekly Progress Update</h1>
            <p className="text-sm text-slate-500">{currentTeacher} · {myAtp ? `${myAtp.subject} · ${myAtp.className}` : 'Plans assigned to you appear here'} · mark each period complete this week</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => downloadPlanningCsv(`weekly-progress-${currentTeacher.replace(/\s+/g, '-')}.csv`, myWeekly.map((item) => ({ Date: item.date, Period: item.periodNumber, Class: item.className, Subject: item.subject, Status: item.status, Lesson: item.planSubmitted ? 'Submitted' : 'Pending' })))}><Download className="h-4 w-4" />Export This Week</Button>
      </header>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" />Previous Week</Button>
            <div className="min-w-44 text-center">
              <p className="text-[10px] font-bold uppercase text-slate-400">Teaching week</p>
              <p className="text-sm font-bold text-slate-800">{formatShort(weekStart)} – {formatShort(addDays(weekStart, 5))}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setWeekStart(addDays(weekStart, 7))}>Next Week<ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setWeekStart(mondayOfDate())}><CalendarDays className="h-4 w-4" />This Week</Button>
          </div>
          <div className="min-w-[220px]">
            <div className="mb-1 flex justify-between text-sm"><span>Weekly completion</span><b>{completed}/{myWeekly.length} · {percent}%</b></div>
            <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} /></div>
          </div>
        </div>
      </Card>

      {days.length === 0 && (
        <Card>
          <EmptyState>No teaching periods are assigned to you for this week. When a weekly plan is created for you, it will appear here to mark complete.</EmptyState>
        </Card>
      )}

      {days.map(([date, rows]) => (
        <Card key={date} title={formatShort(date)}>
          <div className="space-y-3">
            {rows.sort((a, b) => a.periodNumber - b.periodNumber).map((item) => (
              <div key={item.id} className={`rounded-xl border p-4 ${item.status === 'Completed' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Period {item.periodNumber} · {item.time} · {item.className}-{item.section} · {item.subject}</p>
                    <p className="text-sm text-slate-500">{item.chapter || 'Chapter'}{item.topic ? `: ${item.topic}` : ''}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.status !== 'Completed' && <Button size="sm" onClick={() => mark(item, 'Completed')}><CheckCircle2 className="h-4 w-4" />Mark Complete</Button>}
                  {item.status !== 'Skipped' && <Button size="sm" variant="outline" onClick={() => { setSkipTarget(item); setSkipReason(''); }}>Skip</Button>}
                  {item.status !== 'Postponed' && <Button size="sm" variant="outline" onClick={() => { setPostponeTarget(item); setPostponeDate(''); }}>Postpone</Button>}
                  <Badge variant={item.planSubmitted ? 'success' : 'warning'}>{item.planSubmitted ? 'Lesson submitted' : 'Lesson pending'}</Badge>
                  {!item.planSubmitted && <Button size="sm" variant="outline" onClick={() => submitLesson(item)}>Submit Lesson</Button>}
                  <Button size="sm" variant="ghost" onClick={() => createDraft(item)}>Create Draft Lesson</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Modal isOpen={Boolean(skipTarget)} onClose={() => setSkipTarget(null)} title="Skip this period" size="sm" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSkipTarget(null)}>Cancel</Button><Button onClick={() => { if (skipTarget) mark(skipTarget, 'Skipped'); setSkipTarget(null); }}>Save</Button></div>}>
        <TextAreaField label="Reason" value={skipReason} onChange={setSkipReason} />
      </Modal>
      <Modal isOpen={Boolean(postponeTarget)} onClose={() => setPostponeTarget(null)} title="Postpone this period" size="sm" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPostponeTarget(null)}>Cancel</Button><Button onClick={() => { if (postponeTarget) mark(postponeTarget, 'Postponed'); setPostponeTarget(null); }}>Save</Button></div>}>
        <TextField label="Moved-to date" type="date" value={postponeDate} onChange={setPostponeDate} />
      </Modal>
    </div>
  );
}

export default TeacherPlanProgressPage;
