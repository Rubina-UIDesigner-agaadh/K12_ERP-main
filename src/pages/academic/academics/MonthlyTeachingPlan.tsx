import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Download, Plus, Printer, WandSparkles } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import {
  CLASSES,
  MONTHS,
  SUBJECTS,
  academicYearForMonthYear,
  createBlankMonthlyPeriod,
  createBlankMonthlyPlan,
  downloadPlanningCsv,
  matchesTeachingPlanFilters,
  shiftCalendarMonth,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type MonthlyPlanPeriod,
  type MonthlyTeachingPlanRecord,
  type TeachingPlanFilters,
} from './academicPlanningData';
import { EmptyState, PlanningPanel, SelectField, StatusPill, TextAreaField, TextField } from './academicPlanningData';

export function MonthlyTeachingPlan({
  plans,
  persistPlans,
  atps,
  chapters,
  filters,
  month,
  calendarYear,
  onMonthChange,
  createTick = 0,
  onPrint,
}: {
  plans: MonthlyTeachingPlanRecord[];
  persistPlans: (next: MonthlyTeachingPlanRecord[]) => void;
  atps: AnnualTeachingPlanRecord[];
  chapters: CurriculumChapter[];
  filters: TeachingPlanFilters;
  month: string;
  calendarYear: string;
  onMonthChange: (month: string, year: string) => void;
  createTick?: number;
  onPrint?: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [scope, setScope] = useState('All Plans');
  const [form, setForm] = useState<MonthlyTeachingPlanRecord | null>(null);
  const [message, setMessage] = useState('');
  const lastCreateTick = useRef(createTick);
  const persistMessage = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 3500); };
  const update = <K extends keyof MonthlyTeachingPlanRecord,>(key: K, value: MonthlyTeachingPlanRecord[K]) => setForm((current) => current ? { ...current, [key]: value } : current);
  const updatePeriod = (id: string, patch: Partial<MonthlyPlanPeriod>) => setForm((current) => current ? { ...current, periods: current.periods.map((period) => period.id === id ? { ...period, ...patch } : period) } : current);

  const yearFiltered = useMemo(() => plans.filter((item) => academicYearForMonthYear(item.month, item.year) === filters.academicYear && matchesTeachingPlanFilters(item, filters)), [plans, filters]);
  const monthPlans = useMemo(() => yearFiltered.filter((item) => item.month === month && item.year === calendarYear && (statusFilter === 'All Statuses' || item.status === statusFilter)), [yearFiltered, month, calendarYear, statusFilter]);
  const displayed = useMemo(() => {
    if (scope === 'My Plans') return [];
    if (scope === 'Department Plans') return [];
    return monthPlans;
  }, [monthPlans, scope]);

  const openNew = () => {
    const blank = createBlankMonthlyPlan();
    blank.month = month;
    blank.year = calendarYear;
    blank.className = filters.className === 'All Classes' ? blank.className : filters.className;
    blank.subject = filters.subject === 'All Subjects' ? blank.subject : filters.subject;
    blank.teacher = filters.teacher === 'All Teachers' ? blank.teacher : filters.teacher;
    blank.section = filters.section === 'All Sections' ? blank.section : filters.section;
    setForm(blank);
  };

  useEffect(() => {
    if (createTick && createTick !== lastCreateTick.current) {
      lastCreateTick.current = createTick;
      openNew();
    }
  }, [createTick]);

  const openEdit = (record: MonthlyTeachingPlanRecord) => setForm({ ...record, submitTo: record.submitTo || `HOD — ${record.subject}`, submittedDate: record.submittedDate || '', hodName: record.hodName || `HOD — ${record.subject}`, hodFeedback: record.hodFeedback || '', hodReviewedOn: record.hodReviewedOn || '', periods: record.periods.map((period) => ({ ...period })) });
  const moveMonth = (delta: number) => {
    const next = shiftCalendarMonth(month, calendarYear, delta);
    onMonthChange(next.month, next.year);
  };
  const goCurrentMonth = () => {
    const now = new Date();
    onMonthChange(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()], String(now.getFullYear()));
  };

  const autoPopulate = () => {
    if (!form) return;
    const academicYear = academicYearForMonthYear(form.month, form.year);
    const atp = atps.find((item) =>
      item.teacher === form.teacher
      && item.className === form.className
      && item.sections.split(',').map((part) => part.trim()).includes(form.section)
      && item.subject === form.subject
      && item.academicYear === academicYear
      && (item.status === 'HOD Approved' || item.status === 'Principal Viewed' || item.principalViewed)
    );
    if (!atp) { persistMessage('No approved ATP matches this teacher, class, section, subject and academic year.'); return; }
    const existingChapters = new Set(form.periods.map((period) => period.chapter).filter(Boolean));
    const additions: MonthlyPlanPeriod[] = [];
    const missingCurriculum: string[] = [];
    Object.entries(atp.monthlyDistribution || {}).forEach(([chapterName, months]) => {
      const allocated = Number(months[form.month] || 0);
      if (allocated <= 0) return;
      if (existingChapters.has(chapterName)) return;
      const chapter = chapters.find((item) => item.name === chapterName && item.className === form.className && item.subject === form.subject);
      if (!chapter) missingCurriculum.push(chapterName);
      for (let index = 0; index < allocated; index += 1) {
        additions.push({
          ...createBlankMonthlyPeriod(),
          weekNumber: (index % 4) + 1,
          periodNumber: form.periods.length + additions.length + 1,
          chapter: chapterName,
          topic: chapter?.topics[index]?.name || '',
        });
      }
    });
    if (!additions.length && !missingCurriculum.length) { persistMessage('ATP has no unused period allocations for this month, or rows already exist.'); return; }
    setForm((current) => current ? { ...current, linkedAtpId: atp.id, chaptersToCover: [...new Set([...current.chaptersToCover.split('; ').filter(Boolean), ...additions.map((item) => item.chapter)])].join('; '), periods: [...current.periods, ...additions], totalPeriodsPlanned: current.periods.length + additions.length } : current);
    persistMessage(missingCurriculum.length
      ? `Added ${additions.length} period row(s) from ATP ${atp.id}. Curriculum details missing for: ${missingCurriculum.join(', ')}.`
      : `Added ${additions.length} period row(s) from approved ATP ${atp.id}. Existing rows were not duplicated.`);
  };

  const teachingCompletion = (record: MonthlyTeachingPlanRecord) => {
    if (!record.periods.length) return 0;
    return Math.round(record.periods.filter((item) => item.status === 'Completed').length / record.periods.length * 100);
  };
  const documentCompleteness = (record: MonthlyTeachingPlanRecord) => Math.min(100, Math.round([record.teacher, record.className, record.subject, record.periods.length, record.chaptersToCover].filter(Boolean).length / 5 * 100));

  const save = (action: MonthlyTeachingPlanRecord['status']) => {
    if (!form || !form.teacher || !form.subject) { persistMessage('Select a teacher and subject before saving.'); return; }
    if (action === 'HOD Viewed' && !(form.hodFeedback || '').trim()) { persistMessage('Add HOD feedback before recording the review.'); return; }
    const today = new Date().toISOString().slice(0, 10);
    const saved = { ...form, status: action, submittedDate: action === 'Submitted' ? today : form.submittedDate, hodReviewedOn: action === 'HOD Viewed' ? today : form.hodReviewedOn, completionPercent: teachingCompletion(form), totalPeriodsPlanned: Math.max(0, Number(form.totalPeriodsPlanned) || form.periods.length) };
    persistPlans(plans.some((item) => item.id === saved.id) ? plans.map((item) => item.id === saved.id ? saved : item) : [saved, ...plans]);
    setForm(null);
    persistMessage(action === 'Submitted' ? 'Monthly teaching plan submitted for HOD review.' : action === 'HOD Viewed' ? 'HOD review recorded on the monthly plan.' : 'Monthly teaching plan draft saved.');
  };
  const addPeriod = () => { if (!form) return; setForm({ ...form, periods: [...form.periods, { ...createBlankMonthlyPeriod(), weekNumber: Math.min(5, form.periods.length + 1), periodNumber: form.periods.length + 1 }] }); };
  const exportPlan = (record: MonthlyTeachingPlanRecord) => downloadPlanningCsv(`monthly-plan-${record.className}-${record.month}-${record.year}.csv`, record.periods.map((item) => ({ Week: item.weekNumber, Date: item.date, Period: item.periodNumber, Chapter: item.chapter, Topic: item.topic, SubTopic: item.subTopic, Method: item.teachingMethod, Resources: item.resources, ExpectedOutcome: item.expectedOutcome, Status: item.status, Note: item.note })));
  const shareWithParents = (record: MonthlyTeachingPlanRecord) => { exportPlan(record); persistMessage(`CSV exported for ${record.className} ${record.subject}. No parent message was sent.`); };
  const allRows = displayed.flatMap((item) => item.periods);
  const planned = form?.periods.length || 0;
  const done = form?.periods.filter((item) => item.status === 'Completed').length || 0;
  const chapterGroups = [...new Set((form?.periods || []).map((item) => item.chapter).filter(Boolean))];
  const startedChapters = chapterGroups.filter((chapter) => form?.periods.some((item) => item.chapter === chapter && item.status !== 'Planned'));
  const completedChapters = chapterGroups.filter((chapter) => {
    const rows = form?.periods.filter((item) => item.chapter === chapter) || [];
    return rows.length > 0 && rows.every((item) => item.status === 'Completed');
  });

  return (
    <div className="space-y-5 border-t border-slate-200 pt-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Monthly Teaching Plans</h2>
          <p className="text-sm text-slate-500">Translate annual allocations into dated teaching periods and monitor monthly delivery.</p>
        </div>
        <div className="tp-no-print flex flex-wrap gap-2">
          <Button onClick={openNew}><Plus className="h-4 w-4" />Create Monthly Plan</Button>
          <Button variant="outline" onClick={onPrint}><Printer className="h-4 w-4" />Print Monthly Plans</Button>
        </div>
      </div>

      <Card className="tp-no-print">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-end gap-2">
            <Button size="sm" variant="outline" onClick={() => moveMonth(-1)}><ChevronLeft className="h-4 w-4" />Previous Month</Button>
            <div className="min-w-44 text-center"><p className="text-[10px] font-semibold uppercase text-slate-500">Selected month</p><p className="text-lg font-bold text-slate-900">{month} {calendarYear}</p><p className="text-[10px] text-slate-400">AY {academicYearForMonthYear(month, calendarYear)}</p></div>
            <Button size="sm" variant="outline" onClick={() => moveMonth(1)}>Next Month<ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={goCurrentMonth}><CalendarDays className="h-4 w-4" />Current Month</Button>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <SelectField label="Monthly workflow status" value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Draft', 'Submitted', 'HOD Viewed']} />
            <SelectField label="Data scope" value={scope} onChange={setScope} options={['All Plans', 'My Plans', 'Department Plans']} />
          </div>
        </div>
      </Card>

      {message && <div className="tp-no-print rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
      {(scope === 'My Plans' || scope === 'Department Plans') && <p className="text-xs text-amber-700">Signed-in teacher or department context is not available, so {scope.toLowerCase()} cannot be resolved. Showing an empty list instead of assuming a teacher.</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card><p className="text-2xl font-bold text-indigo-700">{displayed.length}</p><p className="text-xs text-slate-500">Teacher–class plans this month</p></Card>
        <Card><p className="text-2xl font-bold text-emerald-700">{displayed.length ? Math.round(displayed.reduce((sum, item) => sum + teachingCompletion(item), 0) / displayed.length) : 0}%</p><p className="text-xs text-slate-500">Average teaching completion</p></Card>
        <Card><p className="text-2xl font-bold text-amber-700">{displayed.filter((item) => item.status === 'Draft').length}</p><p className="text-xs text-slate-500">Draft / not submitted</p></Card>
        <Card><p className="text-2xl font-bold text-rose-700">{displayed.filter((item) => item.status === 'Submitted').length}</p><p className="text-xs text-slate-500">Awaiting HOD review</p></Card>
        <Card><p className="text-2xl font-bold text-sky-700">{displayed.reduce((sum, item) => sum + item.totalPeriodsPlanned, 0)}</p><p className="text-xs text-slate-500">Periods planned</p></Card>
      </div>

      <Card title={`Monthly Plan Status · ${month} ${calendarYear}`} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="px-3 py-3">Teacher</th><th className="px-3 py-3">Class / Section</th><th className="px-3 py-3">Subject</th><th className="px-3 py-3">Linked ATP</th><th className="px-3 py-3">Periods</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Completion</th><th className="px-3 py-3">HOD Review</th><th className="px-3 py-3 tp-no-print">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-3 font-semibold">{item.teacher}</td>
                  <td className="px-3 py-3">{item.className} · {item.section}</td>
                  <td className="px-3 py-3">{item.subject}</td>
                  <td className="px-3 py-3 text-xs">{item.linkedAtpId || 'Unlinked'}</td>
                  <td className="px-3 py-3">{item.totalPeriodsPlanned}/{item.totalPeriodsAvailable}</td>
                  <td className="px-3 py-3"><StatusPill status={item.status} /></td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${teachingCompletion(item)}%` }} /></div>{teachingCompletion(item)}%<span className="text-[10px] text-slate-400">doc {documentCompleteness(item)}%</span></div></td>
                  <td className="px-3 py-3 text-[10px]">{item.hodReviewedOn ? <><b>{item.hodName}</b><p className="text-slate-400">Reviewed {item.hodReviewedOn}</p></> : item.status === 'Submitted' ? <span className="text-amber-700">Awaiting HOD · {item.submitTo}</span> : '—'}{item.hodFeedback && <p className="mt-1 max-w-44 text-slate-500">{item.hodFeedback}</p>}</td>
                  <td className="px-3 py-3 tp-no-print"><div className="flex gap-1"><Button size="xs" variant="outline" onClick={() => openEdit(item)}>View / Edit</Button><Button size="xs" variant="outline" onClick={() => exportPlan(item)}><Download className="h-3 w-3" />Export</Button><Button size="xs" variant="outline" onClick={() => shareWithParents(item)}>Share</Button></div></td>
                </tr>
              ))}
              {displayed.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No monthly plans for this month and filter selection.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Period Completion Snapshot">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex justify-between text-xs"><span>Completed periods across displayed plans</span><span>{allRows.filter((row) => row.status === 'Completed').length}/{allRows.length}</span></div>
            <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${allRows.length ? allRows.filter((row) => row.status === 'Completed').length / allRows.length * 100 : 0}%` }} /></div>
            <p className="mt-2 text-[10px] text-slate-500">Teaching completion is recalculated from period statuses. A chapter is complete only when every period for that chapter is Completed.</p>
          </div>
          <div className="flex flex-wrap gap-2">{['Planned', 'Completed', 'Skipped', 'Postponed', 'Substituted'].map((status) => <Badge key={status} variant={status === 'Completed' ? 'success' : status === 'Skipped' ? 'danger' : 'info'}>{status}: {allRows.filter((row) => row.status === status).length}</Badge>)}</div>
        </div>
      </Card>

      <Modal isOpen={Boolean(form)} onClose={() => setForm(null)} title={form ? `${form.month} ${form.year} · Monthly Teaching Plan` : 'Monthly Plan'} size="xl" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button variant="outline" onClick={() => save('Draft')}>Save Draft</Button><Button onClick={() => save('Submitted')}><CalendarDays className="h-4 w-4" />Submit to HOD</Button>{form && (form.status === 'Submitted' || form.status === 'HOD Viewed') && <Button variant="outline" onClick={() => save('HOD Viewed')}>{form.status === 'Submitted' ? 'Record HOD Review' : 'Save HOD Review'}</Button>}</div>}>
        {form && (
          <div className="max-h-[76vh] space-y-4 overflow-y-auto pr-1">
            <PlanningPanel title="Plan Header Information">
              <div className="grid gap-3 md:grid-cols-3">
                <TextField label="Teacher" value={form.teacher} onChange={(value) => update('teacher', value)} />
                <SelectField label="Class" value={form.className} onChange={(value) => update('className', value)} options={CLASSES} />
                <TextField label="Section" value={form.section} onChange={(value) => update('section', value)} />
                <SelectField label="Subject" value={form.subject} onChange={(value) => update('subject', value)} options={SUBJECTS} />
                <SelectField label="Month" value={form.month} onChange={(value) => update('month', value)} options={MONTHS} />
                <TextField label="Calendar year" value={form.year} onChange={(value) => update('year', value)} />
                <TextField label="Linked ATP" value={form.linkedAtpId || 'Unlinked'} readOnly />
                <TextAreaField label="Chapters to Cover This Month" value={form.chaptersToCover} onChange={(value) => update('chaptersToCover', value)} />
                <div className="flex items-end"><Button variant="outline" onClick={autoPopulate}><WandSparkles className="h-4 w-4" />Auto-populate from ATP</Button></div>
                <TextField label="Total Periods Available" type="number" min="0" value={form.totalPeriodsAvailable} onChange={(value) => update('totalPeriodsAvailable', Number(value) || 0)} />
                <TextField label="Total Periods Planned" type="number" min="0" value={form.totalPeriodsPlanned} onChange={(value) => update('totalPeriodsPlanned', Number(value) || 0)} />
                <TextField label="Buffer Periods" type="number" min="0" value={form.bufferPeriods} onChange={(value) => update('bufferPeriods', Number(value) || 0)} />
              </div>
            </PlanningPanel>
            <PlanningPanel title="Week-by-Week Plan Table" description="Add one row for every planned class period, including method, resource and expected outcome.">
              <div className="mb-2 flex justify-end"><Button size="xs" variant="outline" onClick={addPeriod}><Plus className="h-3.5 w-3.5" />Add Period</Button></div>
              {form.periods.length ? (
                <div className="space-y-3">{form.periods.map((period) => (
                  <div key={period.id} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-4">
                    <TextField label="Week Number" type="number" min="1" max="5" value={period.weekNumber} onChange={(value) => updatePeriod(period.id, { weekNumber: Number(value) || 1 })} />
                    <TextField label="Date" type="date" value={period.date} onChange={(value) => updatePeriod(period.id, { date: value })} />
                    <TextField label="Period Number" type="number" min="1" value={period.periodNumber} onChange={(value) => updatePeriod(period.id, { periodNumber: Number(value) || 1 })} />
                    <SelectField label="Status" value={period.status} onChange={(value) => updatePeriod(period.id, { status: value as MonthlyPlanPeriod['status'] })} options={['Planned', 'Completed', 'Skipped', 'Postponed']} />
                    <TextField label="Chapter" value={period.chapter} onChange={(value) => updatePeriod(period.id, { chapter: value })} />
                    <TextField label="Topic" value={period.topic} onChange={(value) => updatePeriod(period.id, { topic: value })} />
                    <TextField label="Sub-topic" value={period.subTopic} onChange={(value) => updatePeriod(period.id, { subTopic: value })} />
                    <SelectField label="Teaching Method" value={period.teachingMethod} onChange={(value) => updatePeriod(period.id, { teachingMethod: value })} options={['Lecture', 'Demo', 'Discussion', 'Activity', 'Lab', 'Test', 'Revision']} />
                    <TextField label="Resources to Use" value={period.resources} onChange={(value) => updatePeriod(period.id, { resources: value })} />
                    <TextField label="Expected Outcome" value={period.expectedOutcome} onChange={(value) => updatePeriod(period.id, { expectedOutcome: value })} />
                    <SelectField label="Student Understanding" value={period.understanding} onChange={(value) => updatePeriod(period.id, { understanding: value })} options={['Excellent', 'Good', 'Fair', 'Needs Revision']} />
                    <TextField label="Skipped / Postponed Reason" value={period.reason} onChange={(value) => updatePeriod(period.id, { reason: value })} />
                    <TextField label="Moved To Date" type="date" value={period.movedToDate} onChange={(value) => updatePeriod(period.id, { movedToDate: value })} />
                    <TextField label="Daily Note" value={period.note} onChange={(value) => updatePeriod(period.id, { note: value })} />
                    <Button size="xs" variant="ghost" className="self-end" onClick={() => update('periods', form.periods.filter((item) => item.id !== period.id))}>Remove period</Button>
                  </div>
                ))}</div>
              ) : <EmptyState>No period rows yet. Add a row or populate topics from the approved ATP.</EmptyState>}
            </PlanningPanel>
            <PlanningPanel title="Special Periods This Month">
              <div className="grid gap-3 md:grid-cols-2">
                <TextAreaField label="Test Dates · Assessment Calendar" value={form.testDates} onChange={(value) => update('testDates', value)} />
                <TextAreaField label="Lab Dates" value={form.labDates} onChange={(value) => update('labDates', value)} />
                <TextAreaField label="Revision Dates" value={form.revisionDates} onChange={(value) => update('revisionDates', value)} />
                <TextAreaField label="Assignment Due Dates" value={form.assignmentDueDates} onChange={(value) => update('assignmentDueDates', value)} />
                <TextAreaField label="Holiday Impact" value={form.holidayImpact} onChange={(value) => update('holidayImpact', value)} />
              </div>
            </PlanningPanel>
            <PlanningPanel title="Month Summary & Review">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded bg-indigo-50 p-3 text-xs">Theory periods <b className="block text-xl">{form.periods.filter((item) => !['Lab', 'Test', 'Revision'].includes(item.teachingMethod)).length}</b></div>
                <div className="rounded bg-sky-50 p-3 text-xs">Lab periods <b className="block text-xl">{form.periods.filter((item) => item.teachingMethod === 'Lab').length}</b></div>
                <div className="rounded bg-amber-50 p-3 text-xs">Test periods <b className="block text-xl">{form.periods.filter((item) => item.teachingMethod === 'Test').length}</b></div>
                <div className="rounded bg-emerald-50 p-3 text-xs">Revision periods <b className="block text-xl">{form.periods.filter((item) => item.teachingMethod === 'Revision').length}</b></div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <TextAreaField label="Topics Carrying Over" value={form.topicsCarryingOver} onChange={(value) => update('topicsCarryingOver', value)} />
                <TextAreaField label="Student Performance Observation" value={form.studentObservation} onChange={(value) => update('studentObservation', value)} />
                <TextAreaField label="Resources That Worked Well" value={form.resourcesWorked} onChange={(value) => update('resourcesWorked', value)} />
                <TextAreaField label="Resources That Didn't Work" value={form.resourcesNotWorked} onChange={(value) => update('resourcesNotWorked', value)} />
                <TextAreaField label="Significant Events Impacting Teaching" value={form.significantEvents} onChange={(value) => update('significantEvents', value)} />
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-xs"><b>Started this month:</b> {startedChapters.join(', ') || '—'}<br /><b>Completed this month (all periods done):</b> {completedChapters.join(', ') || '—'}<br /><b>Teaching completion:</b> {done}/{planned} planned periods ({planned ? Math.round(done / planned * 100) : 0}%) · document completeness {documentCompleteness(form)}%</div>
            </PlanningPanel>
            <PlanningPanel title="HOD Submission & Review" description="Track monthly plan submission, review feedback and the HOD review date.">
              <div className="grid gap-3 md:grid-cols-3">
                <TextField label="Submit To" value={form.submitTo} onChange={(value) => update('submitTo', value)} />
                <TextField label="Submitted Date" type="date" value={form.submittedDate} onChange={(value) => update('submittedDate', value)} />
                <TextField label="HOD Name" value={form.hodName} onChange={(value) => update('hodName', value)} />
                <TextField label="HOD Reviewed On" type="date" value={form.hodReviewedOn} onChange={(value) => update('hodReviewedOn', value)} />
                <SelectField label="Workflow Status" value={form.status} onChange={(value) => update('status', value as MonthlyTeachingPlanRecord['status'])} options={['Draft', 'Submitted', 'HOD Viewed']} />
                <TextAreaField label="HOD Feedback" value={form.hodFeedback} onChange={(value) => update('hodFeedback', value)} />
              </div>
              <p className="mt-2 text-[10px] text-slate-500">“Record HOD Review” saves the feedback and marks this plan as HOD Viewed.</p>
            </PlanningPanel>
          </div>
        )}
      </Modal>
    </div>
  );
}
