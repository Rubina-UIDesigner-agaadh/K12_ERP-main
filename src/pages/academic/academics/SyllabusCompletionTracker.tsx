import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, Download, Eye, Plus, Printer, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ACADEMIC_PLANNING_KEYS, CLASSES, DEFAULT_ATPS, DEFAULT_CURRICULUM_CHAPTERS, DEFAULT_LESSON_PLANS, EmptyState, PageHeader, SelectField, TextAreaField, TextField, downloadPlanningCsv, loadPlanningCollection, savePlanningCollection, newPlanningId, type AnnualTeachingPlanRecord, type CurriculumChapter, type LessonPlanRecord, type PeriodStatus } from './academicPlanningData';
import { AssessmentRecord, CURRENT_AY_START, CURRENT_ACADEMIC_YEAR, NOTIFICATION_RULE_DEFAULTS, NotificationRule, PERIODS_PER_WEEK_DEFAULT, ProgressLog, REVIEW_KEYS, SEED_ASSESSMENTS, addAlert, addDaysIso, buildSeedProgressLogs, daysBetween, expectedPercentForChapter, expectedPercentForChapters, formatShortDate, monthRangeIso, parseIso, percentForChapter, periodsPerWeekFor, periodsTaughtFor, progressStateFor, progressStateTone, teacherFor, todayIso, toIsoDate, type ProgressState } from './curriculumReviewData';

const TERMS = ['All Terms', 'Term 1', 'Term 2', 'Term 3'];
const COVERAGE_OPTIONS: ProgressLog['coverage'][] = ['Fully Completed', 'Partially Completed', 'Not Covered'];
const UNDERSTANDING_OPTIONS: ProgressLog['understanding'][] = ['Excellent', 'Good', 'Fair', 'Needs Revision'];
const LOST_PERIOD_STATUSES: PeriodStatus[] = ['Skipped', 'Postponed', 'Missed', 'Substituted'];

type AsOfMode = 'today' | 'specific' | 'projection';

const chapterStatusLabel = (percent: number, lastLogDate: string | null, today: string): { label: string; tone: string } => {
  if (percent >= 100) return { label: '✅ Complete', tone: 'bg-green-100 text-green-700' };
  if (percent > 0) {
    const stale = lastLogDate ? daysBetween(lastLogDate, today) > 14 : true;
    return stale ? { label: '❌ Behind', tone: 'bg-red-100 text-red-700' } : { label: '🟡 In Progress', tone: 'bg-blue-100 text-blue-700' };
  }
  return { label: '⏳ Not Started', tone: 'bg-gray-100 text-gray-700' };
};

// Gauge drawn as two arcs: the expected position (dashed grey) and the actual completion (solid).
function ProgressGauge({ actual, expected }: { actual: number; expected: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 150 150" className="h-44 w-44" role="img" aria-label={`${actual}% complete, ${expected}% expected`}>
      <circle cx="75" cy="75" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
      <circle cx="75" cy="75" r={radius} fill="none" stroke="#9ca3af" strokeWidth="3" strokeDasharray={`${(expected / 100) * circumference} ${circumference}`} transform="rotate(-90 75 75)" />
      <circle cx="75" cy="75" r={radius} fill="none" stroke="#4f46e5" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(Math.min(actual, 100) / 100) * circumference} ${circumference}`} transform="rotate(-90 75 75)" />
      <text x="75" y="72" textAnchor="middle" className="fill-gray-900" style={{ fontSize: 26, fontWeight: 700 }}>{actual}%</text>
      <text x="75" y="93" textAnchor="middle" className="fill-gray-500" style={{ fontSize: 10 }}>expected {expected}%</text>
    </svg>
  );
}

// Simple SVG line chart: each series is a list of values across the same labels.
function LineChart({ labels, series }: { labels: string[]; series: Array<{ name: string; color: string; values: number[] }> }) {
  const width = 640;
  const height = 220;
  const pad = 36;
  const max = Math.max(1, ...series.flatMap((item) => item.values));
  const x = (index: number) => pad + (index * (width - pad * 2)) / Math.max(1, labels.length - 1);
  const y = (value: number) => height - pad - (value / max) * (height - pad * 2);
  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Progress line chart">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#d1d5db" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#d1d5db" />
        {labels.map((label, index) => <text key={label} x={x(index)} y={height - 12} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500">{label}</text>)}
        {series.map((item) => (
          <g key={item.name}>
            <polyline fill="none" stroke={item.color} strokeWidth="2.5" points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')} />
            {item.values.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r="3" fill={item.color} />)}
          </g>
        ))}
      </svg>
      <div className="flex gap-4 text-xs text-gray-600">{series.map((item) => <span key={item.name} className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded" style={{ background: item.color }} />{item.name}</span>)}</div>
    </div>
  );
}

export function SyllabusCompletionTracker() {
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [atps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection<AnnualTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [lessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection<LessonPlanRecord>(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [logs, setLogs] = useState<ProgressLog[]>(() => loadPlanningCollection<ProgressLog>(REVIEW_KEYS.progressLogs, buildSeedProgressLogs(DEFAULT_CURRICULUM_CHAPTERS)));
  const [assessments] = useState<AssessmentRecord[]>(() => loadPlanningCollection<AssessmentRecord>(REVIEW_KEYS.assessments, SEED_ASSESSMENTS));
  const [rules, setRules] = useState<NotificationRule[]>(() => loadPlanningCollection<NotificationRule>(REVIEW_KEYS.notificationRules, NOTIFICATION_RULE_DEFAULTS));
  const [classFilter, setClassFilter] = useState('All Classes');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [termFilter, setTermFilter] = useState('All Terms');
  const [asOfMode, setAsOfMode] = useState<AsOfMode>('today');
  const [specificDate, setSpecificDate] = useState(todayIso());
  const [expanded, setExpanded] = useState<string[]>([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState<'Quick' | 'Detailed'>('Quick');
  const [preselectChapter, setPreselectChapter] = useState('');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState<Partial<ProgressLog> & { topicChoice: string; lessonChoice: string }>({ topicChoice: '', lessonChoice: '' });
  const [formError, setFormError] = useState('');

  const today = todayIso();
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };
  const persistLogs = (next: ProgressLog[]) => { setLogs(next); savePlanningCollection(REVIEW_KEYS.progressLogs, next); };

  const termEnd = (term: string): string => {
    const scoped = chapters.filter((chapter) => term === 'All Terms' || chapter.term === term);
    const ends = scoped.map((chapter) => monthRangeIso(chapter.scheduledMonthTo || chapter.scheduledMonthFrom).end).sort();
    return ends.length ? ends[ends.length - 1] : toIsoDate(new Date(CURRENT_AY_START + 1, 2, 31));
  };
  const asOf = asOfMode === 'today' ? today : asOfMode === 'specific' ? specificDate : termEnd(termFilter);

  const scopedChapters = useMemo(() => chapters.filter((chapter) =>
    (classFilter === 'All Classes' || chapter.className === classFilter) &&
    (subjectFilter === 'All Subjects' || chapter.subject === subjectFilter) &&
    (termFilter === 'All Terms' || chapter.term === termFilter) &&
    (teacherFilter === 'All Teachers' || teacherFor(atps, chapter.className, chapter.subject) === teacherFilter)
  ), [chapters, atps, classFilter, subjectFilter, termFilter, teacherFilter]);

  const scopedIds = new Set(scopedChapters.map((chapter) => chapter.id));
  const scopedLogs = logs.filter((log) => scopedIds.has(log.chapterId));
  const classOptions = ['All Classes', ...CLASSES.filter((item) => chapters.some((chapter) => chapter.className === item))];
  const subjectOptions = ['All Subjects', ...[...new Set(chapters.map((chapter) => chapter.subject))]];
  const teacherOptions = ['All Teachers', ...[...new Set(atps.map((atp) => atp.teacher))]];

  // Headline metrics
  const totalPeriods = scopedChapters.reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0);
  const takenPeriods = scopedChapters.reduce((sum, chapter) => sum + periodsTaughtFor(chapter, scopedLogs), 0);
  const actualPct = totalPeriods ? Math.round((takenPeriods / totalPeriods) * 100) : 0;
  const expectedPct = expectedPercentForChapters(scopedChapters, asOf);
  const overallState: ProgressState = progressStateFor(actualPct, expectedPct);
  const chaptersDone = scopedChapters.filter((chapter) => percentForChapter(chapter, scopedLogs) >= 100).length;
  const topicsTotal = scopedChapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const topicsDone = scopedChapters.reduce((sum, chapter) => sum + chapter.topics.filter((topic) => topic.completionPercent >= 100).length, 0);
  const periodsRemaining = Math.max(0, totalPeriods - takenPeriods);
  const yearEnd = toIsoDate(new Date(CURRENT_AY_START + 1, 2, 31));
  const daysToYearEnd = Math.max(0, daysBetween(today, yearEnd));
  const classSubjectPairs = [...new Set(scopedChapters.map((chapter) => `${chapter.className}|${chapter.subject}`))];
  const availableFuturePeriods = classSubjectPairs.reduce((sum, pair) => {
    const [className, subject] = pair.split('|');
    return sum + Math.floor(daysToYearEnd / 7) * periodsPerWeekFor(atps, className, subject);
  }, 0);
  const feasibilityRatio = availableFuturePeriods ? periodsRemaining / availableFuturePeriods : periodsRemaining > 0 ? Infinity : 0;
  const feasibility = feasibilityRatio <= 0.8 ? '✅ Completable' : feasibilityRatio <= 1 ? '⚠️ Tight' : '❌ At Risk';

  // Pace analysis (last 28 days of logged periods)
  const recentLogs = scopedLogs.filter((log) => daysBetween(log.date, today) >= 0 && daysBetween(log.date, today) <= 28);
  const recentPeriods = recentLogs.reduce((sum, log) => sum + log.periodsUsed, 0);
  const periodsPerWeekPace = recentPeriods / 4;
  const paceCompletion = periodsPerWeekPace > 0 ? addDaysIso(today, Math.ceil((periodsRemaining / periodsPerWeekPace) * 7)) : null;
  const thisMonth = today.slice(0, 7);
  const lostThisMonth = scopedLogs.filter((log) => log.date.startsWith(thisMonth) && LOST_PERIOD_STATUSES.includes(log.periodStatus));
  const lostBreakdown = LOST_PERIOD_STATUSES.map((status) => ({ status, count: lostThisMonth.filter((log) => log.periodStatus === status).length }));

  // Chapter rows
  const chapterRows = scopedChapters.map((chapter) => {
    const chapterLogs = scopedLogs.filter((log) => log.chapterId === chapter.id);
    const taught = periodsTaughtFor(chapter, scopedLogs);
    const percent = percentForChapter(chapter, scopedLogs);
    const lastLog = chapterLogs.map((log) => log.date).sort().pop() || null;
    const firstLog = chapterLogs.map((log) => log.date).sort()[0] || '';
    const recent = chapterLogs.filter((log) => daysBetween(log.date, today) <= 28).reduce((sum, log) => sum + log.periodsUsed, 0);
    const pacePerWeek = recent / 4;
    const remaining = chapter.allocatedPeriods - taught;
    const projected = remaining <= 0 ? '' : pacePerWeek > 0 ? addDaysIso(today, Math.ceil((remaining / pacePerWeek) * 7)) : '';
    const linkedPlans = lessons.filter((lesson) => lesson.className === chapter.className && lesson.subject === chapter.subject && lesson.chapter === chapter.name).length;
    return { chapter, taught, percent, lastLog, firstLog, projected, linkedPlans, status: chapterStatusLabel(percent, lastLog, today), expected: expectedPercentForChapter(chapter, asOf), pacePerWeek, remaining };
  });

  // Alerts
  const alerts: string[] = [];
  assessments
    .filter((assessment) => assessment.status !== 'Cancelled' && daysBetween(today, assessment.date) >= 0 && daysBetween(today, assessment.date) <= 15)
    .forEach((assessment) => {
      const related = chapters.filter((chapter) => chapter.className === assessment.className && chapter.subject === assessment.subject && chapter.term === (assessment.term || chapter.term));
      const incomplete = related.filter((chapter) => percentForChapter(chapter, logs) < 100);
      if (incomplete.length) {
        const periods = incomplete.reduce((sum, chapter) => sum + Math.max(0, chapter.allocatedPeriods - periodsTaughtFor(chapter, logs)), 0);
        alerts.push(`${assessment.name} (${assessment.subject}) is in ${daysBetween(today, assessment.date)} day(s). ${incomplete.length} chapter(s) not yet covered, about ${periods} period(s) needed.`);
      }
    });
  chapterRows.forEach((row) => {
    if (row.remaining > 0 && row.pacePerWeek > 0 && row.projected && daysBetween(asOf, row.projected) > 0 && !(row.chapter.status === 'Inactive')) {
      alerts.push(`At current pace, ${row.chapter.name} (${row.chapter.className} ${row.chapter.subject}) will not be completed by ${formatShortDate(termEnd(row.chapter.term))}.`);
    }
    if (row.percent > 0 && row.percent < 100 && row.lastLog && daysBetween(row.lastLog, today) > 14) {
      alerts.push(`${row.chapter.name} (${row.chapter.className} ${row.chapter.subject}) has had no entries for ${daysBetween(row.lastLog, today)} days. Is the teacher on leave?`);
    }
  });
  scopedChapters.forEach((chapter) => {
    const shortTopics = chapter.topics.filter((topic) => topic.periods <= 1 && topic.completionPercent < 100);
    if (shortTopics.length >= 2) alerts.push(`${chapter.name}: topics ${shortTopics[0].number} and ${shortTopics[1].number} are one period each. Consider combining them to save time.`);
  });

  // Charts
  const chartLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthEnds = chartLabels.map((_, index) => toIsoDate(new Date(index <= 8 ? CURRENT_AY_START : CURRENT_AY_START + 1, (index + 3) % 12 + 1, 0)));
  const plannedCumulative = monthEnds.map((monthEnd) => scopedChapters
    .filter((chapter) => daysBetween(monthRangeIso(chapter.scheduledMonthTo || chapter.scheduledMonthFrom).end, monthEnd) >= 0)
    .reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0));
  // Actual is plotted only up to the current month; future months have no logs yet.
  const currentMonthIndex = (parseIso(today).getMonth() + 9) % 12;
  const loggedCumulative = monthEnds.slice(0, currentMonthIndex + 1).map((monthEnd) => scopedLogs.filter((log) => log.date <= monthEnd).reduce((sum, log) => sum + log.periodsUsed, 0));
  const monthlyLogged = chartLabels.map((_, index) => {
    const monthKey = toIsoDate(new Date(index <= 8 ? CURRENT_AY_START : CURRENT_AY_START + 1, (index + 3) % 12, 1)).slice(0, 7);
    return scopedLogs.filter((log) => log.date.startsWith(monthKey)).reduce((sum, log) => sum + log.periodsUsed, 0);
  });

  // Update form
  const openUpdate = (chapterId?: string) => {
    setPreselectChapter(chapterId || '');
    setForm({ date: today, chapterId: chapterId || '', topicChoice: '', subTopic: '', coverage: 'Fully Completed', periodsUsed: 1, understanding: 'Good', lessonPlanId: '', notes: '', topicName: '', lessonChoice: '', whatCovered: '', whatRemains: '', continueTomorrow: false, extraResources: '', homework: '', classResponse: '' });
    setFormError('');
    setUpdateMode('Quick');
    setUpdateOpen(true);
  };
  const chapterOptions = scopedChapters.length ? scopedChapters : chapters;
  const selectedChapter = chapters.find((chapter) => chapter.id === form.chapterId);
  const topicOptions = selectedChapter ? ['Whole chapter', ...selectedChapter.topics.map((topic) => topic.name)] : [];
  const matchingLessons = lessons.filter((lesson) => selectedChapter && lesson.className && lesson.chapter === selectedChapter.name && lesson.date === form.date);

  const saveUpdate = () => {
    if (!selectedChapter) { setFormError('Choose a chapter.'); return; }
    if (!form.date) { setFormError('Choose a date.'); return; }
    if (!form.topicChoice) { setFormError('Choose a topic.'); return; }
    const periods = Number(form.periodsUsed ?? 0);
    if (periods < 0 || periods > 10) { setFormError('Periods used must be between 0 and 10.'); return; }
    const coverage = form.coverage || 'Fully Completed';
    const record: ProgressLog = {
      id: newPlanningId('LOG'),
      date: form.date || today,
      mode: updateMode,
      academicYear: selectedChapter.academicYear,
      className: selectedChapter.className,
      subject: selectedChapter.subject,
      teacher: teacherFor(atps, selectedChapter.className, selectedChapter.subject),
      chapterId: selectedChapter.id,
      chapterName: selectedChapter.name,
      topicName: form.topicChoice || 'Whole chapter',
      subTopic: form.subTopic || '',
      coverage,
      periodsUsed: coverage === 'Not Covered' ? 0 : periods,
      periodStatus: coverage === 'Not Covered' ? 'Skipped' : 'Completed',
      understanding: form.understanding || 'Good',
      lessonPlanId: form.lessonChoice || '',
      notes: form.notes || '',
      continueTomorrow: !!form.continueTomorrow,
      whatCovered: form.whatCovered || '',
      whatRemains: form.whatRemains || '',
      extraResources: form.extraResources || '',
      homework: form.homework || '',
      classResponse: form.classResponse || ''
    };
    persistLogs([record, ...logs]);
    setUpdateOpen(false);
    flash(`Progress saved for ${selectedChapter.name}: ${record.periodsUsed} period(s) logged.`);
  };

  const toggleRule = (id: string, enabled: boolean) => {
    const next = rules.map((rule) => rule.id === id ? { ...rule, enabled } : rule);
    setRules(next);
    savePlanningCollection(REVIEW_KEYS.notificationRules, next);
    flash(enabled ? 'Automatic alert enabled.' : 'Automatic alert disabled.');
  };

  const exportProgress = () => downloadPlanningCsv('syllabus-completion.csv', chapterRows.map((row) => ({
    Class: row.chapter.className,
    Subject: row.chapter.subject,
    Teacher: teacherFor(atps, row.chapter.className, row.chapter.subject),
    Term: row.chapter.term,
    Chapter: `${row.chapter.chapterNumber}. ${row.chapter.name}`,
    'Allocated Periods': row.chapter.allocatedPeriods,
    'Periods Taught': row.taught,
    'Percent Complete': row.percent,
    'Expected Percent': row.expected,
    Status: row.status.label,
    'Started On': row.firstLog || '—',
    'Projected Completion': row.projected || '—',
    'Linked Lesson Plans': row.linkedPlans
  })));

  const exportGapReport = () => {
    const rows = scopedChapters.flatMap((chapter) => chapter.topics.filter((topic) => topic.completionPercent < 100).map((topic) => ({
      Class: chapter.className,
      Subject: chapter.subject,
      Chapter: chapter.name,
      Topic: `${topic.number} ${topic.name}`,
      'Periods Planned': topic.periods,
      'Completion %': topic.completionPercent,
      'Exam Risk': asOfMode === 'projection' ? 'Check against exam date' : 'Review before exam'
    })));
    if (!rows.length) { flash('No topics are open in this view. Nothing to export.'); return; }
    downloadPlanningCsv('syllabus-gap-report.csv', rows);
  };

  const exportCompletionRecord = () => downloadPlanningCsv('completion-record-cbse.csv', scopedChapters.map((chapter) => ({
    'Academic Year': chapter.academicYear,
    Class: chapter.className,
    Subject: chapter.subject,
    'Chapter No.': chapter.chapterNumber,
    'Chapter Name': chapter.name,
    'Board Reference': chapter.boardReference || '—',
    'Periods Allocated': chapter.allocatedPeriods,
    'Periods Taught': periodsTaughtFor(chapter, scopedLogs),
    'Completion %': percentForChapter(chapter, scopedLogs)
  })));

  const toggleExpanded = (id: string) => setExpanded((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const behindRule = rules.find((rule) => rule.id === 'behind-10');

  const topicRows = (chapter: CurriculumChapter) => chapter.topics.map((topic) => {
    const logged = scopedLogs.filter((log) => log.chapterId === chapter.id && log.topicName === topic.name);
    const done = Math.min(topic.periods, Math.round((topic.periods * topic.completionPercent) / 100) + logged.reduce((sum, log) => sum + log.periodsUsed, 0));
    const lastTaught = logged.map((log) => log.date).sort().pop() || '';
    const status = done >= topic.periods ? '✅ Done' : done > 0 ? `🟡 ${Math.round((done / topic.periods) * 100)}%` : '⏳ Plan';
    return { topic, done, lastTaught, status, remaining: Math.max(0, topic.periods - done) };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="📋 Syllabus Completion Tracker"
        description="See what has been taught against the plan, and spot gaps before exams."
        actions={<>
          <Button onClick={() => openUpdate()}><Plus className="h-4 w-4" />Update Progress</Button>
          <Button variant="outline" onClick={exportProgress}><Download className="h-4 w-4" />Export Progress</Button>
          <Button variant="outline" onClick={exportGapReport}><Download className="h-4 w-4" />Syllabus Gap Report</Button>
          <Button variant="outline" onClick={exportCompletionRecord}><Download className="h-4 w-4" />Completion Record (CBSE)</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </>} />

      {toast && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{toast}</div>}

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SelectField label="Class" value={classFilter} onChange={setClassFilter} options={classOptions} />
          <SelectField label="Subject" value={subjectFilter} onChange={setSubjectFilter} options={subjectOptions} />
          <SelectField label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={teacherOptions} />
          <SelectField label="Term" value={termFilter} onChange={setTermFilter} options={TERMS} />
          <SelectField label="As of" value={asOfMode} onChange={(value) => setAsOfMode(value as AsOfMode)} options={[{ value: 'today', label: 'Today' }, { value: 'specific', label: 'Specific date' }, { value: 'projection', label: 'End of term projection' }]} />
          {asOfMode === 'specific' && <TextField label="Date" type="date" value={specificDate} onChange={setSpecificDate} />}
        </div>
        <p className="mt-3 text-xs text-gray-500">Benchmark date: {formatShortDate(asOf)} · Academic year {CURRENT_ACADEMIC_YEAR}. Chapter schedules are mapped onto this year.</p>
      </Card>

      {/* Overall completion */}
      <Card title="Overall Completion">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center gap-2">
            <ProgressGauge actual={actualPct} expected={expectedPct} />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${progressStateTone(overallState)}`}>{overallState}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Periods Completed', value: `${takenPeriods} / ${totalPeriods}` },
              { label: 'Chapters Fully Done', value: `${chaptersDone} / ${scopedChapters.length}` },
              { label: 'Topics Fully Done', value: `${topicsDone} / ${topicsTotal}` },
              { label: 'Days to End of Year', value: `${daysToYearEnd} days` },
              { label: 'Periods Remaining', value: `${periodsRemaining}` },
              { label: 'Available Future Periods', value: `${availableFuturePeriods}` },
              { label: 'Feasibility', value: feasibility },
              { label: 'Expected by Benchmark', value: `${expectedPct}%` }
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card title={`Alerts & Recommendations (${alerts.length})`}>
          <ul className="space-y-2">
            {alerts.slice(0, 12).map((alert) => (
              <li key={alert} className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />{alert}</li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
            <span>Alert HOD automatically when a class falls 10% behind:</span>
            <Button size="xs" variant={behindRule?.enabled ? 'primary' : 'outline'} onClick={() => toggleRule('behind-10', !behindRule?.enabled)}>{behindRule?.enabled ? 'On' : 'Off'}</Button>
          </div>
        </Card>
      )}

      {/* Chapter table */}
      <Card title="Chapter-wise Status" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr><th className="px-3 py-3">Chapter</th><th className="px-3 py-3">Term</th><th className="px-3 py-3">Allocated</th><th className="px-3 py-3">Taught</th><th className="px-3 py-3">% Complete</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Started On</th><th className="px-3 py-3">Expected Completion</th><th className="px-3 py-3">Lesson Plans</th><th className="px-3 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chapterRows.map((row) => (
                <React.Fragment key={row.chapter.id}>
                  <tr>
                    <td className="px-3 py-3"><p className="font-medium text-gray-900">{row.chapter.chapterNumber}. {row.chapter.name}</p><p className="text-xs text-gray-500">{row.chapter.className} · {row.chapter.subject} · {teacherFor(atps, row.chapter.className, row.chapter.subject)}</p></td>
                    <td className="px-3 py-3">{row.chapter.term}</td>
                    <td className="px-3 py-3">{row.chapter.allocatedPeriods}</td>
                    <td className="px-3 py-3">{row.taught}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, row.percent)}%` }} /></div><span className="text-xs">{row.percent}% <span className="text-gray-400">(exp {row.expected}%)</span></span></div>
                    </td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.status.tone}`}>{row.status.label}</span></td>
                    <td className="px-3 py-3 whitespace-nowrap">{row.firstLog ? formatShortDate(row.firstLog) : '—'}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{row.percent >= 100 ? 'Completed' : row.projected ? formatShortDate(row.projected) : '—'}</td>
                    <td className="px-3 py-3">{row.linkedPlans}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5">
                        <Button size="xs" variant="outline" onClick={() => openUpdate(row.chapter.id)}><Save className="h-3.5 w-3.5" />Update</Button>
                        <Button size="xs" variant="ghost" onClick={() => toggleExpanded(row.chapter.id)}><Eye className="h-3.5 w-3.5" />{expanded.includes(row.chapter.id) ? 'Hide' : 'View Details'}</Button>
                      </div>
                    </td>
                  </tr>
                  {expanded.includes(row.chapter.id) && (
                    <tr>
                      <td colSpan={10} className="bg-gray-50 px-6 py-4">
                        <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-700"><ChevronDown className="h-3.5 w-3.5" />Topic-wise detail</p>
                        {row.chapter.topics.length === 0 ? <EmptyState>No topics are defined for this chapter in the Curriculum Master.</EmptyState> : (
                          <table className="w-full text-left text-xs">
                            <thead className="text-gray-500"><tr><th className="py-1">Topic</th><th>Sub-topics</th><th>Periods planned</th><th>Periods done</th><th>Status</th><th>Last taught</th><th>Notes</th></tr></thead>
                            <tbody className="divide-y divide-gray-200">
                              {topicRows(row.chapter).map((item) => (
                                <tr key={item.topic.id}>
                                  <td className="py-1.5 font-medium">{item.topic.number} {item.topic.name}</td>
                                  <td>{item.topic.subtopics.length}</td>
                                  <td>{item.topic.periods}</td>
                                  <td>{item.done}</td>
                                  <td>{item.status}</td>
                                  <td>{item.lastTaught ? formatShortDate(item.lastTaught) : '—'}</td>
                                  <td>{item.remaining > 0 ? `${item.remaining} more needed` : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {chapterRows.length === 0 && <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500">No chapters match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pace analysis */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Pace Analysis">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-gray-600">Periods taught in last 4 weeks</dt><dd className="font-semibold">{recentPeriods}</dd>
            <dt className="text-gray-600">Average periods per week</dt><dd className="font-semibold">{periodsPerWeekPace.toFixed(1)}</dd>
            <dt className="text-gray-600">At this pace, completion date</dt><dd className="font-semibold">{paceCompletion ? formatShortDate(paceCompletion) : 'No recent teaching to project from'}</dd>
            <dt className="text-gray-600">Remaining periods needed</dt><dd className="font-semibold">{periodsRemaining}</dd>
            <dt className="text-gray-600">Available future periods</dt><dd className="font-semibold">{availableFuturePeriods}</dd>
            <dt className="text-gray-600">Feasibility check</dt><dd className="font-semibold">{feasibility === '✅ Completable' ? '✅ Sufficient time' : feasibility === '⚠️ Tight' ? '⚠️ Tight — increase pace' : '❌ Not enough time'}</dd>
          </dl>
          <p className="mt-3 text-xs text-gray-500">Periods per week come from each teacher’s Annual Teaching Plan ({PERIODS_PER_WEEK_DEFAULT} assumed where no plan exists).</p>
        </Card>
        <Card title="Absences and Substitutions (this month)">
          <p className="text-sm text-gray-700">Periods lost this month: <span className="font-semibold">{lostThisMonth.length}</span></p>
          <ul className="mt-3 space-y-1 text-sm">{lostBreakdown.map((item) => <li key={item.status} className="flex justify-between"><span>{item.status}</span><span className="font-medium">{item.count}</span></li>)}</ul>
          <p className="mt-3 text-xs text-gray-500">Counted from logged periods with status Skipped, Postponed, Missed or Substituted.</p>
        </Card>
      </div>

      {/* Charts */}
      <Card title="Comparison Charts">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">Progress vs planned (cumulative periods)</p>
            <LineChart labels={chartLabels} series={[{ name: 'Planned (chapters due by month end)', color: '#9ca3af', values: plannedCumulative }, { name: 'Actual (logged periods)', color: '#4f46e5', values: loggedCumulative }]} />
            <p className="mt-2 text-xs text-gray-500">Actual counts periods logged through Update Progress. Seeded completion from the Curriculum Master is not dated, so it is not plotted.</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">Chapter-wise completion</p>
            <div className="space-y-2">
              {chapterRows.slice(0, 10).map((row) => (
                <div key={row.chapter.id} className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs">
                  <span className="truncate text-gray-700">{row.chapter.name}</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-32 overflow-hidden rounded-full bg-gray-200"><span className="block h-full bg-indigo-600" style={{ width: `${Math.min(100, row.percent)}%` }} /></span><span className="w-10 text-right">{row.percent}%</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="xl:col-span-2">
            <p className="mb-2 text-sm font-semibold text-gray-800">Monthly progress (periods logged per month)</p>
            <div className="flex h-40 items-end gap-2">
              {monthlyLogged.map((value, index) => (
                <div key={chartLabels[index]} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{value}</span>
                  <div className="w-full rounded-t bg-indigo-500" style={{ height: `${Math.max(2, (value / Math.max(1, ...monthlyLogged)) * 120)}px` }} />
                  <span className="text-[10px] text-gray-600">{chartLabels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Update modal */}
      <Modal isOpen={updateOpen} onClose={() => setUpdateOpen(false)} title="Update Progress" size="lg"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button><Button variant="primary" onClick={saveUpdate}><Save className="h-4 w-4" />Save Progress</Button></div>}>
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['Quick', 'Detailed'] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => setUpdateMode(mode)} className={`rounded-full border px-3 py-1 text-xs font-medium ${updateMode === mode ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-600'}`}>{mode === 'Quick' ? 'Quick update (most common)' : 'Detailed update'}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField label="Date" type="date" value={form.date || ''} onChange={(value) => setForm((state) => ({ ...state, date: value, lessonChoice: '' }))} />
            <SelectField label="Chapter" value={form.chapterId || ''} onChange={(value) => setForm((state) => ({ ...state, chapterId: value, topicChoice: '', lessonChoice: '' }))} options={[{ value: '', label: 'Select chapter' }, ...chapterOptions.map((chapter) => ({ value: chapter.id, label: `${chapter.className} · ${chapter.subject} · ${chapter.chapterNumber}. ${chapter.name}` }))]} />
            <SelectField label="Topic" value={form.topicChoice || ''} onChange={(value) => setForm((state) => ({ ...state, topicChoice: value }))} options={[{ value: '', label: 'Select topic' }, ...topicOptions.map((item) => ({ value: item, label: item }))]} />
            <TextField label="Sub-topic (if applicable)" value={form.subTopic || ''} onChange={(value) => setForm((state) => ({ ...state, subTopic: value }))} placeholder="e.g. 9.1.2 Image formation" />
            <SelectField label="Status" value={form.coverage || 'Fully Completed'} onChange={(value) => setForm((state) => ({ ...state, coverage: value as ProgressLog['coverage'] }))} options={COVERAGE_OPTIONS} />
            <TextField label="Periods used today" type="number" min={0} max={10} value={form.periodsUsed ?? 0} onChange={(value) => setForm((state) => ({ ...state, periodsUsed: Number(value) }))} />
            <SelectField label="Understanding level" value={form.understanding || 'Good'} onChange={(value) => setForm((state) => ({ ...state, understanding: value as ProgressLog['understanding'] }))} options={UNDERSTANDING_OPTIONS} />
            <SelectField label="Linked lesson plan" value={form.lessonChoice || ''} onChange={(value) => setForm((state) => ({ ...state, lessonChoice: value }))} options={[{ value: '', label: matchingLessons.length ? 'Select plan' : 'No plan found for this date' }, ...matchingLessons.map((lesson) => ({ value: lesson.id, label: lesson.title || lesson.topic }))]} />
          </div>
          <TextAreaField label="Notes" value={form.notes || ''} onChange={(value) => setForm((state) => ({ ...state, notes: value }))} placeholder="Observations from the session" />
          {updateMode === 'Detailed' && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
              <TextAreaField label="What was covered" value={form.whatCovered || ''} onChange={(value) => setForm((state) => ({ ...state, whatCovered: value }))} />
              <TextAreaField label="What remains in this topic" value={form.whatRemains || ''} onChange={(value) => setForm((state) => ({ ...state, whatRemains: value }))} />
              <SelectField label="Will continue tomorrow" value={form.continueTomorrow ? 'Yes' : 'No'} onChange={(value) => setForm((state) => ({ ...state, continueTomorrow: value === 'Yes' }))} options={['No', 'Yes']} />
              <TextField label="Additional resources used" value={form.extraResources || ''} onChange={(value) => setForm((state) => ({ ...state, extraResources: value }))} placeholder="Videos, models, worksheets" />
              <TextField label="Homework assigned" value={form.homework || ''} onChange={(value) => setForm((state) => ({ ...state, homework: value }))} placeholder="Leave blank for no homework" />
              <TextField label="Class performance" value={form.classResponse || ''} onChange={(value) => setForm((state) => ({ ...state, classResponse: value }))} placeholder="How the class responded" />
            </div>
          )}
          {formError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default SyllabusCompletionTracker;
