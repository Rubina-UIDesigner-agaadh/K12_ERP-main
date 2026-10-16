import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, ChevronLeft, ChevronRight, Download, Eye, FileCheck2, Plus, Printer, UserRoundCog } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import {
  CLASSES,
  SUBJECTS,
  academicYearForDate,
  createBlankLesson,
  downloadPlanningCsv,
  matchesTeachingPlanFilters,
  mondayOfDate,
  newPlanningId,
  type AnnualTeachingPlanRecord,
  type LessonPlanRecord,
  type PeriodStatus,
  type TeachingPlanFilters,
  type WeeklyTeachingItem,
} from './academicPlanningData';
import { EmptyState, PlanningPanel, SelectField, StatusPill, TextAreaField, TextField } from './academicPlanningData';

const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const teachersFor = (items: WeeklyTeachingItem[]) => [...new Set(items.map((item) => item.teacher).concat(items.map((item) => item.substitute).filter(Boolean)))];
const dateFromIso = (value: string) => new Date(`${value}T00:00:00`);
const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const addDays = (value: string, days: number) => { const date = dateFromIso(value); date.setDate(date.getDate() + days); return isoDate(date); };
const dayFromIso = (value: string) => dateFromIso(value).toLocaleDateString('en-IN', { weekday: 'long' });
const formatShort = (value: string) => dateFromIso(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
const SAMPLE_WEEK = '2025-11-24';

const hasTeacherConflict = (rows: WeeklyTeachingItem[], teacher: string, date: string, periodNumber: number, ignoreId?: string) =>
  rows.find((row) => row.id !== ignoreId && row.date === date && row.periodNumber === periodNumber && (row.teacher === teacher || row.substitute === teacher));

export function WeeklyTeachingPlan({
  items,
  persistItems,
  lessonPlans,
  persistLessons,
  atps,
  filters,
  weekStart,
  onWeekStartChange,
  createTick = 0,
  onPrint,
}: {
  items: WeeklyTeachingItem[];
  persistItems: (next: WeeklyTeachingItem[]) => void;
  lessonPlans: LessonPlanRecord[];
  persistLessons: (next: LessonPlanRecord[]) => void;
  atps: AnnualTeachingPlanRecord[];
  filters: TeachingPlanFilters;
  weekStart: string;
  onWeekStartChange: (value: string) => void;
  createTick?: number;
  onPrint?: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [form, setForm] = useState<WeeklyTeachingItem | null>(null);
  const [substitutionTarget, setSubstitutionTarget] = useState<WeeklyTeachingItem | null>(null);
  const [substituteName, setSubstituteName] = useState('');
  const [substitutionReason, setSubstitutionReason] = useState('');
  const [message, setMessage] = useState('');
  const lastCreateTick = useRef(createTick);
  const messages = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 3500); };
  const update = <K extends keyof WeeklyTeachingItem,>(key: K, value: WeeklyTeachingItem[K]) => setForm((current) => current ? { ...current, [key]: value } : current);
  const weekDays = useMemo(() => dayList.map((day, index) => ({ day, date: addDays(weekStart, index) })), [weekStart]);
  const teachers = teachersFor(items);
  const yearItems = useMemo(() => items.filter((item) => academicYearForDate(item.date) === filters.academicYear && matchesTeachingPlanFilters(item, filters)), [items, filters]);
  const filtered = useMemo(() => yearItems.filter((item) => item.date >= weekStart && item.date <= addDays(weekStart, 5) && (statusFilter === 'All Statuses' || item.status === statusFilter)), [yearItems, weekStart, statusFilter]);
  const departments = [...new Set(items.map((item) => item.department).filter(Boolean))];

  const addNew = () => {
    const date = weekDays[0].date;
    setForm({
      id: newPlanningId('weekly'),
      teacher: filters.teacher === 'All Teachers' ? '' : filters.teacher,
      department: filters.department === 'All Departments' ? '' : filters.department,
      className: filters.className === 'All Classes' ? 'Class 10' : filters.className,
      section: filters.section === 'All Sections' ? 'A' : filters.section,
      subject: filters.subject === 'All Subjects' ? 'Science' : filters.subject,
      date,
      day: dayFromIso(date),
      periodNumber: 1,
      time: '09:30–10:15',
      chapter: '',
      topic: '',
      room: 'Room 10A',
      status: 'Planned',
      substitute: '',
      type: 'Lesson',
      planSubmitted: false,
    });
  };

  useEffect(() => {
    if (createTick && createTick !== lastCreateTick.current) {
      lastCreateTick.current = createTick;
      addNew();
    }
  }, [createTick]);

  const saveItem = () => {
    if (!form?.teacher || !form?.className || !form.subject || !form.date) { messages('Teacher, class, subject and date are required.'); return; }
    if (form.substitute) {
      const conflict = hasTeacherConflict(items, form.substitute, form.date, form.periodNumber, form.id);
      if (conflict) { messages(`Schedule conflict: ${form.substitute} is already assigned ${conflict.className} ${conflict.subject} at this period.`); return; }
    }
    const selfConflict = hasTeacherConflict(items, form.teacher, form.date, form.periodNumber, form.id);
    if (selfConflict) { messages(`Schedule conflict: ${form.teacher} is already assigned ${selfConflict.className} ${selfConflict.subject} at this period.`); return; }
    const saved = { ...form, day: dayFromIso(form.date), status: form.substitute ? 'Substituted' as PeriodStatus : form.status };
    persistItems(items.some((item) => item.id === saved.id) ? items.map((item) => item.id === saved.id ? saved : item) : [saved, ...items]);
    setForm(null);
    messages('Weekly timetable item saved.');
  };
  const toggleLessonSubmission = (item: WeeklyTeachingItem) => {
    const nextValue = !item.planSubmitted;
    persistItems(items.map((row) => row.id === item.id ? { ...row, planSubmitted: nextValue } : row));
    const matching = lessonPlans.find((lesson) => lesson.teacher === item.teacher && lesson.className === item.className && lesson.subject === item.subject && lesson.date === item.date);
    if (matching && nextValue && matching.status === 'Draft') persistLessons(lessonPlans.map((lesson) => lesson.id === matching.id ? { ...lesson, status: 'Submitted' } : lesson));
  };
  const openSubstitution = (item: WeeklyTeachingItem) => { setSubstitutionTarget(item); setSubstituteName(item.substitute || ''); setSubstitutionReason(item.substitutionReason || ''); };
  const assignSubstitute = () => {
    if (!substitutionTarget || !substituteName) { messages('Select a substitute teacher.'); return; }
    const conflict = hasTeacherConflict(items, substituteName, substitutionTarget.date, substitutionTarget.periodNumber, substitutionTarget.id);
    if (conflict) { messages(`Schedule conflict: ${substituteName} is already assigned ${conflict.className} ${conflict.subject} at this period.`); return; }
    const updated = { ...substitutionTarget, substitute: substituteName, substitutionReason: substitutionReason.trim(), status: 'Substituted' as PeriodStatus };
    persistItems(items.map((row) => row.id === updated.id ? updated : row));
    setSubstitutionTarget(null);
    messages(`${substituteName} assigned to cover ${updated.className} ${updated.subject}.`);
  };
  const cancelSubstitution = (item: WeeklyTeachingItem) => persistItems(items.map((row) => row.id === item.id ? { ...row, substitute: '', substitutionReason: '', status: 'Planned' } : row));
  const exportRows = (rows: WeeklyTeachingItem[], filename: string) => downloadPlanningCsv(filename, rows.map((item) => ({ Date: item.date, Day: item.day, Time: item.time, Period: item.periodNumber, Class: item.className, Section: item.section, Subject: item.subject, Teacher: item.teacher, Substitute: item.substitute, SubstitutionReason: item.substitutionReason || '', Chapter: item.chapter, Topic: item.topic, Room: item.room, Status: item.status, LessonPlanSubmitted: item.planSubmitted, Type: item.type })));
  const masterRows = useMemo(() => [...new Set(filtered.map((item) => `${item.className}|${item.section}|${item.periodNumber}`))].sort((left, right) => { const [leftClass, , leftPeriod] = left.split('|'); const [rightClass, , rightPeriod] = right.split('|'); return leftClass.localeCompare(rightClass) || Number(leftPeriod) - Number(rightPeriod); }), [filtered]);
  const statusCounts = { scheduled: filtered.length, completed: filtered.filter((item) => item.status === 'Completed').length, pending: filtered.filter((item) => item.status === 'Planned' || item.status === 'Missed').length, substitutions: filtered.filter((item) => item.status === 'Substituted').length, lessonPlans: filtered.filter((item) => item.planSubmitted).length };
  const unsubmitted = filtered.filter((item) => !item.planSubmitted);
  const teacherSchedule = [...filtered].sort((a, b) => a.teacher.localeCompare(b.teacher) || a.date.localeCompare(b.date) || a.periodNumber - b.periodNumber);
  const addLessonFromSchedule = (item: WeeklyTeachingItem) => {
    const existing = lessonPlans.find((lesson) => lesson.teacher === item.teacher && lesson.className === item.className && lesson.subject === item.subject && lesson.date === item.date && lesson.periodNumber === item.periodNumber);
    if (existing) { messages(`A lesson plan already exists for this period: ${existing.title || existing.id}.`); return; }
    const blank = createBlankLesson();
    blank.teacher = item.teacher; blank.className = item.className; blank.section = item.section; blank.subject = item.subject; blank.date = item.date; blank.periodNumber = item.periodNumber; blank.periodTime = item.time; blank.room = item.room; blank.chapter = item.chapter; blank.topic = item.topic; blank.title = item.topic || `${item.subject} lesson`;
    persistLessons([{ ...blank, status: 'Draft' }, ...lessonPlans]);
    messages(`Draft lesson plan created for ${item.teacher} on ${item.date}.`);
  };
  const liveAlerts = filtered.filter((item) => item.status === 'Missed' || (item.status === 'Substituted' && !item.substitute));

  return (
    <div className="space-y-5 border-t border-slate-200 pt-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Weekly Teaching Plans</h2>
          <p className="text-sm text-slate-500">Coordinate classroom schedules, monitor lesson submissions, and manage teaching coverage.</p>
        </div>
        <div className="tp-no-print flex flex-wrap gap-2">
          <Button onClick={addNew}><Plus className="h-4 w-4" />Add Schedule Item</Button>
          <Button variant="outline" onClick={() => exportRows(filtered, 'weekly-teaching-plan.csv')}><Download className="h-4 w-4" />Export Week</Button>
          <Button variant="outline" onClick={() => { exportRows(filtered, 'parent-weekly-timetable.csv'); messages('Weekly timetable CSV exported. No parent message was sent.'); }}><Download className="h-4 w-4" />Share Timetable</Button>
          <Button variant="outline" onClick={onPrint}><Printer className="h-4 w-4" />Print Weekly Plans</Button>
        </div>
      </div>

      <Card className="tp-no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onWeekStartChange(addDays(weekStart, -7))}><ChevronLeft className="h-4 w-4" />Previous Week</Button>
            <div className="min-w-44 text-center"><p className="text-[10px] font-bold uppercase text-slate-400">Teaching week</p><p className="text-sm font-bold text-slate-800">{formatShort(weekDays[0].date)} – {formatShort(weekDays[5].date)}</p></div>
            <Button size="sm" variant="outline" onClick={() => onWeekStartChange(addDays(weekStart, 7))}>Next Week<ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => onWeekStartChange(mondayOfDate())}><CalendarDays className="h-4 w-4" />Current Week</Button>
            <Button size="sm" variant="outline" onClick={() => onWeekStartChange(SAMPLE_WEEK)}>Sample Week (demo)</Button>
          </div>
          <SelectField label="Period status" value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Planned', 'Completed', 'Skipped', 'Postponed', 'Missed', 'Substituted']} />
        </div>
      </Card>

      {message && <div className="tp-no-print rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card><p className="text-2xl font-bold text-indigo-700">{statusCounts.scheduled}</p><p className="text-xs text-slate-500">Scheduled periods</p></Card>
        <Card><p className="text-2xl font-bold text-emerald-700">{statusCounts.completed}</p><p className="text-xs text-slate-500">Completed</p></Card>
        <Card><p className="text-2xl font-bold text-amber-700">{statusCounts.pending}</p><p className="text-xs text-slate-500">Pending / missed</p></Card>
        <Card><p className="text-2xl font-bold text-sky-700">{statusCounts.substitutions}</p><p className="text-xs text-slate-500">Substitutions</p></Card>
        <Card><p className="text-2xl font-bold text-rose-700">{unsubmitted.length}</p><p className="text-xs text-slate-500">Lesson plans not submitted</p></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="This Week’s Alerts">
          <div className="space-y-2">
            {liveAlerts.map((item) => <div key={item.id} className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle className="h-4 w-4" />{item.status === 'Missed' ? 'Missed class' : 'Uncovered substitution'}: {item.teacher} · {item.className} {item.subject} · {formatShort(item.date)}.</div>)}
            {filtered.filter((item) => !item.planSubmitted).slice(0, 3).map((item) => <div key={`plan-${item.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><span>{item.teacher} has not submitted the lesson plan for {item.className} {item.subject} on {formatShort(item.date)}.</span><Button size="xs" variant="outline" onClick={() => messages(`Local reminder prepared for ${item.teacher}. No email was sent.`)}>Remind</Button></div>)}
            {liveAlerts.length === 0 && unsubmitted.length === 0 && <p className="text-sm text-emerald-700">No operational alerts for this week.</p>}
          </div>
        </Card>
        <Card title="Lesson Plan Submission Tracker" headerAction={<Button size="xs" variant="outline" className="tp-no-print" onClick={() => messages(`Local reminder list prepared for ${unsubmitted.length} unsubmitted lesson plan(s). No email was sent.`)}><Bell className="h-3.5 w-3.5" />Send Reminders</Button>}>
          {filtered.length ? (
            <div className="max-h-52 space-y-2 overflow-y-auto">{filtered.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-3 py-2">
                <span className="text-xs"><b>{item.teacher}</b> · {item.className} · {item.subject} · {formatShort(item.date)}</span>
                <div className="flex gap-1 tp-no-print">
                  <Badge variant={item.planSubmitted ? 'success' : 'warning'}>{item.planSubmitted ? 'Submitted' : 'Pending'}</Badge>
                  <Button size="xs" variant="outline" onClick={() => toggleLessonSubmission(item)}>{item.planSubmitted ? 'Mark Pending' : 'Mark Submitted'}</Button>
                  <Button size="xs" variant="outline" onClick={() => addLessonFromSchedule(item)}>Create Draft</Button>
                </div>
              </div>
            ))}</div>
          ) : <EmptyState>No schedule items in this week.</EmptyState>}
          <p className="mt-2 text-[10px] text-slate-400">Reminder actions are local frontend demo workflows. No messages are delivered.</p>
        </Card>
      </div>

      <Card title="Master Weekly Timetable · Classes × Periods" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="sticky left-0 z-10 bg-slate-50 px-3 py-3">Class · Section · Period</th>{weekDays.map((item) => <th key={item.date} className="min-w-36 px-3 py-3">{item.day}<span className="block font-normal normal-case">{formatShort(item.date)}</span></th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {masterRows.map((rowKey) => {
                const [className, section, period] = rowKey.split('|');
                return (
                  <tr key={rowKey}>
                    <th className="sticky left-0 bg-white px-3 py-3 font-semibold text-slate-700">{className} · {section}<span className="block text-[10px] font-normal text-slate-400">Period {period}</span></th>
                    {weekDays.map((day) => {
                      const cell = filtered.filter((item) => item.className === className && item.section === section && String(item.periodNumber) === period && item.date === day.date);
                      return <td key={day.date} className="align-top border-l border-slate-100 px-2 py-2">{cell.map((item) => <button key={item.id} onClick={() => setForm({ ...item })} className="mb-1 block w-full rounded-lg border border-indigo-100 bg-indigo-50 p-2 text-left hover:bg-indigo-100"><span className="block font-bold text-indigo-900">{item.subject}</span><span className="block text-[10px] text-slate-600">{item.topic || item.chapter || 'Topic not entered'}</span><span className="mt-1 flex flex-wrap gap-1"><Badge variant="info">{item.time}</Badge>{item.substitute ? <Badge variant="warning">Cover: {item.substitute}</Badge> : null}</span></button>)}</td>;
                    })}
                  </tr>
                );
              })}
              {masterRows.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No timetable periods to display.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Teacher-wise Weekly Schedule" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="px-3 py-3">Day / Date</th><th className="px-3 py-3">Period / Time</th><th className="px-3 py-3">Teacher</th><th className="px-3 py-3">Class</th><th className="px-3 py-3">Subject / Topic</th><th className="px-3 py-3">Room</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Lesson Plan</th><th className="px-3 py-3 tp-no-print">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {teacherSchedule.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-3">{item.day}<p className="text-[10px] text-slate-400">{item.date}</p></td>
                  <td className="px-3 py-3">P{item.periodNumber}<p className="text-[10px] text-slate-400">{item.time}</p></td>
                  <td className="px-3 py-3">{item.teacher}{item.substitute ? <p className="text-[10px] text-amber-700">Cover: {item.substitute}</p> : null}</td>
                  <td className="px-3 py-3">{item.className} · {item.section}</td>
                  <td className="px-3 py-3">{item.subject}<p className="text-[10px] text-slate-400">{item.chapter}: {item.topic}</p></td>
                  <td className="px-3 py-3">{item.room}</td>
                  <td className="px-3 py-3"><StatusPill status={item.status} /></td>
                  <td className="px-3 py-3"><Badge variant={item.planSubmitted ? 'success' : 'warning'}>{item.planSubmitted ? 'Submitted' : 'Pending'}</Badge></td>
                  <td className="px-3 py-3 tp-no-print"><div className="flex flex-wrap gap-1"><Button size="xs" variant="outline" onClick={() => setForm({ ...item })}><Eye className="h-3 w-3" />Edit</Button><Button size="xs" variant="outline" onClick={() => toggleLessonSubmission(item)}><FileCheck2 className="h-3 w-3" />{item.planSubmitted ? 'Pending' : 'Submit'}</Button><Button size="xs" variant="outline" onClick={() => openSubstitution(item)}><UserRoundCog className="h-3 w-3" />Substitute</Button></div></td>
                </tr>
              ))}
              {teacherSchedule.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">No teacher schedule in this week.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Substitution Management">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-sky-50 p-3"><p className="text-2xl font-bold text-sky-700">{filtered.filter((item) => item.substitute).length}</p><p className="text-xs text-slate-500">Classes covered</p></div>
          <div className="rounded-lg bg-amber-50 p-3"><p className="text-2xl font-bold text-amber-700">{filtered.filter((item) => item.status === 'Missed').length}</p><p className="text-xs text-slate-500">Missed / uncovered</p></div>
          <div className="rounded-lg bg-indigo-50 p-3"><p className="text-2xl font-bold text-indigo-700">{atps.length}</p><p className="text-xs text-slate-500">ATP records in shared store</p></div>
        </div>
        <div className="mt-3 space-y-2">
          {filtered.filter((item) => item.substitute).map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 p-3 text-xs">
              <span><b>{item.substitute}</b> covers {item.teacher} · {item.className} {item.section} · {item.subject} · {item.day} P{item.periodNumber}<small className="block text-slate-400">{item.substitutionReason ? `Reason: ${item.substitutionReason}` : 'Reason not recorded'}</small></span>
              <Button size="xs" variant="outline" className="tp-no-print" onClick={() => cancelSubstitution(item)}>Clear Substitute</Button>
            </div>
          ))}
          {!filtered.some((item) => item.substitute) && <p className="text-xs text-slate-400">No substitutions assigned for this week.</p>}
        </div>
      </Card>

      <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form ? `${form.className} ${form.section} · Weekly Schedule Item` : 'Schedule Item'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button onClick={saveItem}>Save Schedule Item</Button></div>}>
        {form && (
          <div className="space-y-4">
            <PlanningPanel title="Schedule Identity">
              <div className="grid gap-3 md:grid-cols-3">
                <SelectField label="Teacher" value={form.teacher} onChange={(value) => update('teacher', value)} options={teachers.length ? teachers : ['']} />
                <SelectField label="Department" value={form.department} onChange={(value) => update('department', value)} options={departments.length ? departments : ['Science', 'Mathematics', 'Languages', 'Social Science', 'Arts', 'Technology']} />
                <SelectField label="Class" value={form.className} onChange={(value) => update('className', value)} options={CLASSES} />
                <TextField label="Section" value={form.section} onChange={(value) => update('section', value)} />
                <SelectField label="Subject" value={form.subject} onChange={(value) => update('subject', value)} options={SUBJECTS} />
                <TextField label="Date" type="date" value={form.date} onChange={(value) => update('date', value)} />
                <TextField label="Day" value={dayFromIso(form.date)} readOnly />
                <TextField label="Period Number" type="number" min="1" value={form.periodNumber} onChange={(value) => update('periodNumber', Number(value) || 1)} />
                <TextField label="Time" value={form.time} onChange={(value) => update('time', value)} />
                <TextField label="Room" value={form.room} onChange={(value) => update('room', value)} />
                <TextField label="Chapter" value={form.chapter} onChange={(value) => update('chapter', value)} />
                <TextField label="Topic" value={form.topic} onChange={(value) => update('topic', value)} />
                <SelectField label="Schedule Type" value={form.type} onChange={(value) => update('type', value as WeeklyTeachingItem['type'])} options={['Lesson', 'Test', 'Lab', 'Special Activity']} />
                <SelectField label="Status" value={form.status} onChange={(value) => update('status', value as PeriodStatus)} options={['Planned', 'Completed', 'Skipped', 'Postponed', 'Missed', 'Substituted']} />
              </div>
            </PlanningPanel>
            <PlanningPanel title="Lesson Plan Tracker">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={form.planSubmitted ? 'success' : 'warning'}>{form.planSubmitted ? 'Lesson plan submitted' : 'Lesson plan pending'}</Badge>
                <Button size="xs" variant="outline" onClick={() => update('planSubmitted', !form.planSubmitted)}>{form.planSubmitted ? 'Mark Pending' : 'Mark Submitted'}</Button>
              </div>
              <p className="text-xs text-slate-500">Submission state is tracked with this weekly class item. The connected Lesson Plan Creation page stores the full lesson record.</p>
            </PlanningPanel>
            <PlanningPanel title="Substitution & Coverage">
              <div className="grid gap-3 md:grid-cols-2">
                <SelectField label="Substitute Teacher" value={form.substitute || 'None'} onChange={(value) => update('substitute', value === 'None' ? '' : value)} options={['None', ...teachers.filter((teacher) => teacher !== form.teacher)]} />
                <TextAreaField label="Reason for substitution" value={form.substitutionReason || ''} onChange={(value) => update('substitutionReason', value)} />
              </div>
              <p className="text-xs text-slate-500">Saving checks timetable conflicts for both the assigned teacher and any substitute, including existing cover assignments.</p>
            </PlanningPanel>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(substitutionTarget)} onClose={() => setSubstitutionTarget(null)} title="Manage Class Substitution" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSubstitutionTarget(null)}>Cancel</Button><Button onClick={assignSubstitute}>Confirm Substitute</Button></div>}>
        {substitutionTarget && (
          <div className="space-y-4">
            <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900"><b>{substitutionTarget.teacher}</b> · {substitutionTarget.className} {substitutionTarget.section} · {substitutionTarget.subject}<p>{substitutionTarget.day} {formatShort(substitutionTarget.date)} · Period {substitutionTarget.periodNumber} · {substitutionTarget.time}</p></div>
            <SelectField label="Substitute Teacher" value={substituteName} onChange={setSubstituteName} options={['', ...teachers.filter((teacher) => teacher !== substitutionTarget.teacher)]} />
            <TextAreaField label="Reason for substitution" value={substitutionReason} onChange={setSubstitutionReason} placeholder="Leave / training / other coverage reason" />
            <p className="text-[10px] text-slate-500">Conflict check includes the substitute’s own classes and existing cover assignments at the same date and period.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
