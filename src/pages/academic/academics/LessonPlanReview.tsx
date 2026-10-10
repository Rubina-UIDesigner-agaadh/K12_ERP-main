import React, { useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronRight, Copy, Download, Eye, Printer, Send, Star, Zap, MessageSquare, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ACADEMIC_PLANNING_KEYS, EmptyState, PageHeader, SelectField, TextAreaField, downloadPlanningCsv, loadPlanningCollection, savePlanningCollection, type LessonPlanRecord } from './academicPlanningData';
import { REVIEW_CRITERIA, REVIEW_KEYS, RATING_OPTIONS, REVIEW_SEED_REVIEWS, addAlert, calculateReviewScore, daysBetween, departmentFor, formatShortDate, lessonStatusForDecision, loadLessonsForReview, scoreLabel, todayIso, type LessonReviewRecord, type RatingValue, type ReviewDecision } from './curriculumReviewData';

const DECISIONS: Array<{ value: ReviewDecision; label: string; effect: string; tone: string }> = [
  { value: 'Approved', label: '✅ Approve', effect: 'Teacher notified, can teach as planned', tone: 'bg-green-600 hover:bg-green-700 text-white' },
  { value: 'Approved with Suggestions', label: '👍 Approve with Suggestions', effect: 'Teacher notified, suggestions for future reference', tone: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { value: 'Returned for Revision', label: '↩️ Return for Revision', effect: 'Teacher must revise and resubmit', tone: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { value: 'Rejected', label: '❌ Reject', effect: 'Teacher must create a new plan', tone: 'bg-red-600 hover:bg-red-700 text-white' }
];

const RATING_STYLES: Record<RatingValue, string> = {
  Good: 'bg-green-600 text-white border-green-600',
  'Needs Work': 'bg-amber-500 text-white border-amber-500',
  Missing: 'bg-red-600 text-white border-red-600'
};
const RATING_LABELS: Record<RatingValue, string> = { Good: '✅ Good', 'Needs Work': '⚠️ Needs Work', Missing: '❌ Missing' };

const decisionTone = (decision: string): string => {
  if (decision === 'Approved') return 'bg-green-100 text-green-700';
  if (decision === 'Approved with Suggestions') return 'bg-blue-100 text-blue-700';
  if (decision === 'Returned for Revision') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-700';
};

interface ReviewFeedback { overall: string; positives: string; improvements: string; sectionComments: Record<string, string> }
const EMPTY_FEEDBACK: ReviewFeedback = { overall: '', positives: '', improvements: '', sectionComments: {} };

const SECTION_KEYS = ['details', 'objectives', 'prior', 'procedure', 'resources', 'assessment'] as const;
type SectionKey = typeof SECTION_KEYS[number];
const SECTION_TITLES: Record<SectionKey, string> = {
  details: 'Lesson details',
  objectives: 'Learning objectives',
  prior: 'Prior knowledge and hook',
  procedure: 'Teaching procedure',
  resources: 'Resources and differentiation',
  assessment: 'Assessment and homework'
};

function ReviewSection({ sectionKey, title, open, onToggle, comment, onComment, children }: { sectionKey: string; title: string; open: boolean; onToggle: () => void; comment: string; onComment: (value: string) => void; children: React.ReactNode }) {
  const [commenting, setCommenting] = useState(false);
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <button type="button" onClick={onToggle} className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {title}
        </button>
        <button type="button" onClick={() => setCommenting((value) => !value)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50" title={`Add a comment on ${title}`} data-section={sectionKey}>
          <MessageSquare className="h-3.5 w-3.5" /> {comment ? 'Edit comment' : 'Add comment'}
        </button>
      </div>
      {open && <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">{children}</div>}
      {(commenting || comment) && (
        <div className="border-t border-gray-100 bg-amber-50 px-4 py-3">
          <TextAreaField label={`HOD comment on ${title}`} value={comment} onChange={onComment} placeholder="Write feedback for this section" />
        </div>
      )}
    </div>
  );
}

export function LessonPlanReview() {
  const [lessons, setLessons] = useState<LessonPlanRecord[]>(() => loadLessonsForReview());
  const [reviews, setReviews] = useState<LessonReviewRecord[]>(() => loadPlanningCollection<LessonReviewRecord>(REVIEW_KEYS.reviews, REVIEW_SEED_REVIEWS));
  const [templates, setTemplates] = useState<LessonPlanRecord[]>(() => loadPlanningCollection<LessonPlanRecord>(`${ACADEMIC_PLANNING_KEYS.lessons}-templates-v1`, []));
  const [search, setSearch] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [historyDecision, setHistoryDecision] = useState('All Decisions');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<number, RatingValue>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [sectionComments, setSectionComments] = useState<Record<string, string>>({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const [positives, setPositives] = useState('');
  const [improvements, setImprovements] = useState('');
  const [openedAt, setOpenedAt] = useState(() => Date.now());
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => Object.fromEntries(SECTION_KEYS.map((key) => [key, true])));
  const [formError, setFormError] = useState('');
  const [confirm, setConfirm] = useState<'quick' | 'bulk' | null>(null);
  const [quickTargetId, setQuickTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const today = todayIso();
  const persistLessons = (next: LessonPlanRecord[]) => { setLessons(next); savePlanningCollection('k12-lesson-plans-v1', next); };
  const persistReviews = (next: LessonReviewRecord[]) => { setReviews(next); savePlanningCollection(REVIEW_KEYS.reviews, next); };
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };

  // Queue: lessons submitted for HOD review, urgent (lesson tomorrow or today) first, then oldest pending.
  const queue = useMemo(() => lessons
    .filter((lesson) => lesson.status === 'Submitted')
    .map((lesson) => ({ lesson, daysPending: daysBetween(lesson.createdAt || today, today), urgent: daysBetween(today, lesson.date) <= 1 }))
    .filter(({ lesson }) => (teacherFilter === 'All Teachers' || lesson.teacher === teacherFilter) && (!search || `${lesson.teacher} ${lesson.className} ${lesson.subject} ${lesson.topic} ${lesson.title}`.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => Number(b.urgent) - Number(a.urgent) || b.daysPending - a.daysPending), [lessons, today, teacherFilter, search]);

  const teachers = [...new Set(lessons.map((lesson) => lesson.teacher))];
  const activeLesson = lessons.find((lesson) => lesson.id === activeId) || null;
  const pendingCount = lessons.filter((lesson) => lesson.status === 'Submitted').length;
  const monthPrefix = today.slice(0, 7);
  const recentReviews = reviews.filter((review) => daysBetween(review.reviewedOn, today) <= 30);

  // Dashboard cards
  const reviewedToday = reviews.filter((review) => review.reviewedOn === today).length;
  const approvedThisMonth = reviews.filter((review) => review.reviewedOn.startsWith(monthPrefix) && (review.decision === 'Approved' || review.decision === 'Approved with Suggestions')).length;
  const returnedCount = recentReviews.filter((review) => review.decision === 'Returned for Revision' || review.decision === 'Rejected').length;
  const avgReviewMinutes = reviews.length ? Math.round(reviews.reduce((sum, review) => sum + review.reviewMinutes, 0) / reviews.length) : 0;
  const submittedLessons = lessons.filter((lesson) => lesson.submitToHod);
  const onTimeLessons = submittedLessons.filter((lesson) => lesson.createdAt && daysBetween(lesson.createdAt, lesson.date) >= 1).length;
  const submissionRate = submittedLessons.length ? Math.round((onTimeLessons / submittedLessons.length) * 100) : 0;

  const liveScore = calculateReviewScore(ratings);
  const ratedCount = Object.keys(ratings).length;

  const openReview = (lesson: LessonPlanRecord) => {
    setActiveId(lesson.id);
    setRatings({});
    setComments({});
    setSectionComments({});
    setOverallFeedback('');
    setPositives('');
    setImprovements('');
    setFormError('');
    setOpenedAt(Date.now());
  };

  const closeReview = () => { setActiveId(null); setFormError(''); };

  const writeReview = (lesson: LessonPlanRecord, decision: ReviewDecision, reviewRatings: Record<number, RatingValue>, reviewComments: Record<number, string>, reviewMinutes: number, feedback: ReviewFeedback) => {
    const record: LessonReviewRecord = {
      id: `REV-${lesson.id}`,
      lessonId: lesson.id,
      teacher: lesson.teacher,
      className: lesson.className,
      subject: lesson.subject,
      topic: lesson.topic,
      lessonDate: lesson.date,
      submittedOn: lesson.createdAt || today,
      reviewedOn: today,
      decision,
      ratings: reviewRatings,
      comments: reviewComments,
      sectionComments: feedback.sectionComments,
      overallFeedback: feedback.overall,
      positives: feedback.positives,
      improvements: feedback.improvements,
      score: calculateReviewScore(reviewRatings),
      reviewMinutes,
      revisedOn: '',
      markedExample: false
    };
    persistReviews([record, ...reviews.filter((item) => item.lessonId !== lesson.id)]);
    const hodFeedback = decision === 'Approved' ? 'Approved by HOD' : `${decision}${feedback.overall ? `: ${feedback.overall}` : ''}`;
    persistLessons(lessons.map((item) => item.id === lesson.id ? { ...item, status: lessonStatusForDecision(decision), hodFeedback, hodName: 'HOD', submitToHod: true } : item));
  };

  const submitDecision = (decision: ReviewDecision) => {
    if (!activeLesson) return;
    if (ratedCount < REVIEW_CRITERIA.length) { setFormError(`Rate all ${REVIEW_CRITERIA.length} criteria before deciding (${ratedCount} rated).`); return; }
    if ((decision === 'Returned for Revision' || decision === 'Rejected') && !overallFeedback.trim()) { setFormError('Add overall feedback explaining the decision for the teacher.'); return; }
    if ((decision === 'Approved with Suggestions' || decision === 'Returned for Revision') && !improvements.trim()) { setFormError('List the specific improvements required.'); return; }
    const minutes = Math.max(1, Math.round((Date.now() - openedAt) / 60000));
    writeReview(activeLesson, decision, ratings, comments, minutes, { overall: overallFeedback, positives, improvements, sectionComments });
    setActiveId(null);
    setFormError('');
    flash(`Decision saved: ${decision}. The lesson status is updated for ${activeLesson.teacher}.`);
  };

  const quickApprove = (lesson: LessonPlanRecord) => {
    writeReview(lesson, 'Approved', {}, {}, 0, EMPTY_FEEDBACK);
    setSelectedIds((ids) => ids.filter((id) => id !== lesson.id));
    if (activeId === lesson.id) setActiveId(null);
    flash(`Quick approval recorded for ${lesson.title || lesson.topic}. No checklist ratings were captured.`);
  };

  const confirmQuick = () => {
    if (confirm === 'quick' && quickTargetId) {
      const lesson = lessons.find((item) => item.id === quickTargetId);
      if (lesson) quickApprove(lesson);
    }
    if (confirm === 'bulk') {
      const targets = lessons.filter((lesson) => selectedIds.includes(lesson.id) && lesson.status === 'Submitted');
      targets.forEach((lesson) => writeReview(lesson, 'Approved', {}, {}, 0, EMPTY_FEEDBACK));
      setSelectedIds([]);
      flash(`${targets.length} lesson plan(s) approved in bulk without detailed review.`);
    }
    setConfirm(null);
    setQuickTargetId(null);
  };

  const toggleSelected = (id: string) => setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  const allQueueSelected = queue.length > 0 && queue.every(({ lesson }) => selectedIds.includes(lesson.id));
  const toggleAllQueue = () => setSelectedIds(allQueueSelected ? [] : queue.map(({ lesson }) => lesson.id));

  const sendReminders = () => {
    const pendingTeachers = [...new Set(lessons.filter((lesson) => lesson.status === 'Submitted').map((lesson) => lesson.teacher))];
    if (!pendingTeachers.length) { flash('No teachers have pending lesson plans to remind.'); return; }
    pendingTeachers.forEach((teacher) => addAlert('Teacher alert', teacher, 'Your lesson plan is waiting for HOD review.'));
    flash(`Reminder logged for ${pendingTeachers.length} teacher(s). Email and SMS delivery needs the Communications module.`);
  };

  const sendFeedbackToAll = () => {
    const teachersWithReturns = [...new Set(reviews.filter((review) => review.decision === 'Returned for Revision' || review.decision === 'Rejected').map((review) => review.teacher))];
    if (!teachersWithReturns.length) { flash('No returned plans to send feedback for.'); return; }
    teachersWithReturns.forEach((teacher) => addAlert('Teacher alert', teacher, 'HOD feedback is available on your returned lesson plans.'));
    flash(`Feedback reminder logged for ${teachersWithReturns.length} teacher(s).`);
  };

  const exportSummary = () => {
    downloadPlanningCsv('hod-lesson-review-summary.csv', reviews.map((review) => ({
      'Date Reviewed': review.reviewedOn,
      Teacher: review.teacher,
      Class: review.className,
      Subject: review.subject,
      Topic: review.topic,
      Decision: review.decision,
      'Score %': review.score ?? 'Not rated',
      'Review Minutes': review.reviewMinutes,
      'Days to Review': daysBetween(review.submittedOn, review.reviewedOn),
      'Revised On': review.revisedOn || 'Not revised'
    })));
  };

  const exportQualityReport = () => {
    downloadPlanningCsv('lesson-plan-quality-report.csv', reviews.map((review) => {
      const row: Record<string, string | number> = { Teacher: review.teacher, Topic: review.topic, 'Overall Score %': review.score ?? 'Not rated', Band: scoreLabel(review.score) };
      REVIEW_CRITERIA.forEach((criterion, index) => { row[`C${index + 1} ${criterion}`] = review.ratings[index] ?? 'Not rated'; });
      return row;
    }));
  };

  const createTemplateFromPlan = (lesson: LessonPlanRecord) => {
    const template: LessonPlanRecord = { ...lesson, id: `TPL-${lesson.id}-${Date.now()}`, title: `${lesson.title} (template)`, status: 'Draft', date: '', submitToHod: false, hodFeedback: '', createdAt: today };
    const next = [template, ...templates];
    setTemplates(next);
    savePlanningCollection(`${ACADEMIC_PLANNING_KEYS.lessons}-templates-v1`, next);
    flash('Template saved. Teachers can load it from Lesson Plan Creation.');
  };

  const templateSource = activeLesson || lessons.find((lesson) => selectedIds.includes(lesson.id)) || null;

  // Analytics
  const teacherStats = teachers.map((teacher) => {
    const teacherReviews = reviews.filter((review) => review.teacher === teacher);
    const scored = teacherReviews.filter((review) => review.score !== null);
    const submitted = lessons.filter((lesson) => lesson.teacher === teacher && lesson.submitToHod);
    const onTime = submitted.filter((lesson) => lesson.createdAt && daysBetween(lesson.createdAt, lesson.date) >= 1).length;
    return {
      teacher,
      submitted: submitted.length,
      onTimePct: submitted.length ? Math.round((onTime / submitted.length) * 100) : 0,
      avgScore: scored.length ? Math.round(scored.reduce((sum, review) => sum + (review.score ?? 0), 0) / scored.length) : null,
      trend: [...teacherReviews].filter((review) => review.score !== null).sort((a, b) => a.reviewedOn.localeCompare(b.reviewedOn)).map((review) => review.score ?? 0)
    };
  }).filter((stat) => stat.submitted > 0 || stat.avgScore !== null);

  const commonIssues = REVIEW_CRITERIA.map((criterion, index) => ({
    criterion,
    failures: reviews.filter((review) => review.ratings[index] === 'Needs Work' || review.ratings[index] === 'Missing').length
  })).sort((a, b) => b.failures - a.failures).slice(0, 5);

  const departmentStats = [...new Set(reviews.map((review) => departmentFor(review.subject)))].map((department) => {
    const deptScores = reviews.filter((review) => departmentFor(review.subject) === department && review.score !== null).map((review) => review.score ?? 0);
    return { department, avg: deptScores.length ? Math.round(deptScores.reduce((sum, value) => sum + value, 0) / deptScores.length) : null, count: deptScores.length };
  });
  const schoolScores = reviews.filter((review) => review.score !== null).map((review) => review.score ?? 0);
  const schoolAvg = schoolScores.length ? Math.round(schoolScores.reduce((sum, value) => sum + value, 0) / schoolScores.length) : null;

  const bestPlans = reviews.filter((review) => review.score !== null && review.score >= 90);
  const toggleExample = (reviewId: string) => persistReviews(reviews.map((review) => review.id === reviewId ? { ...review, markedExample: !review.markedExample } : review));

  const historyRows = reviews
    .filter((review) => historyDecision === 'All Decisions' || review.decision === historyDecision)
    .sort((a, b) => b.reviewedOn.localeCompare(a.reviewedOn));

  const sectionContent = (lesson: LessonPlanRecord): Record<SectionKey, React.ReactNode> => ({
    details: (
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-gray-500">Teacher</dt><dd>{lesson.teacher} ({lesson.employeeId})</dd>
        <dt className="text-gray-500">Class and section</dt><dd>{lesson.className} · {lesson.section}</dd>
        <dt className="text-gray-500">Subject</dt><dd>{lesson.subject}</dd>
        <dt className="text-gray-500">Lesson date and period</dt><dd>{formatShortDate(lesson.date)} · Period {lesson.periodNumber} ({lesson.periodTime})</dd>
        <dt className="text-gray-500">Chapter and topic</dt><dd>{lesson.chapter} — {lesson.topic}</dd>
        <dt className="text-gray-500">Duration</dt><dd>{lesson.durationMinutes} minutes</dd>
      </dl>
    ),
    objectives: lesson.objectives.length ? (
      <ul className="list-disc space-y-1 pl-5">{lesson.objectives.map((objective) => <li key={objective.id}>{objective.statement} <span className="text-xs text-gray-500">({objective.bloomLevel})</span></li>)}</ul>
    ) : <p className="text-gray-500">No objectives were entered.</p>,
    prior: (
      <div className="space-y-2">
        <p><span className="font-medium">Prior knowledge:</span> {lesson.priorKnowledge || '—'}</p>
        <p><span className="font-medium">Hook question:</span> {lesson.hookQuestion || '—'}</p>
        <p><span className="font-medium">Misconceptions to address:</span> {lesson.misconceptions || '—'}</p>
      </div>
    ),
    procedure: (
      <table className="w-full text-left text-xs">
        <thead className="text-gray-500"><tr><th className="py-1">Phase</th><th>Min</th><th>Teacher activity</th><th>Student activity</th><th>Check understanding</th></tr></thead>
        <tbody className="divide-y divide-gray-100">{lesson.procedure.map((phase) => <tr key={phase.id}><td className="py-1.5 font-medium">{phase.phase}</td><td>{phase.minutes}</td><td>{phase.teacherActivity}</td><td>{phase.studentActivity}</td><td>{phase.checkUnderstanding}</td></tr>)}</tbody>
      </table>
    ),
    resources: (
      <div className="space-y-2">
        <p><span className="font-medium">Resources:</span> {[lesson.projectorPpt, lesson.boardWork, lesson.worksheet, lesson.textbookPages].filter(Boolean).join(' · ') || '—'}</p>
        {Object.entries(lesson.differentiation).map(([group, strategy]) => <p key={group}><span className="font-medium">{group}:</span> {strategy}</p>)}
      </div>
    ),
    assessment: (
      <div className="space-y-2">
        <p><span className="font-medium">Assessment method:</span> {lesson.assessmentMethod || '—'}</p>
        <p><span className="font-medium">Assessment questions:</span> {lesson.assessmentQuestions || '—'}</p>
        <p><span className="font-medium">Homework:</span> {lesson.homeworkAssigned ? `${lesson.homeworkType} — ${lesson.homeworkDescription}` : 'None assigned'}</p>
      </div>
    )
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="🎯 Lesson Plan Review (HOD)"
        description="Review submitted lesson plans, give criterion-level feedback, and approve or return them to teachers."
        actions={<>
          <Button variant="outline" onClick={exportSummary}><Download className="h-4 w-4" />Export Review Summary</Button>
          <Button variant="outline" onClick={exportQualityReport}><Download className="h-4 w-4" />Quality Report</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" disabled={!templateSource} onClick={() => templateSource && createTemplateFromPlan(templateSource)} title={templateSource ? 'Save this plan as a reusable template' : 'Open a plan or select one in the queue first'}><Copy className="h-4 w-4" />Create Template</Button>
        </>} />

      {toast && <div className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><span>{toast}</span><button type="button" onClick={() => setToast('')} className="text-green-700"><X className="h-4 w-4" /></button></div>}

      {/* Dashboard */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Pending Reviews', value: pendingCount, hint: 'Waiting for HOD review' },
          { label: 'Reviewed Today', value: reviewedToday, hint: today },
          { label: 'Approved This Month', value: approvedThisMonth, hint: 'Approve and approve with suggestions' },
          { label: 'Returned for Revision', value: returnedCount, hint: 'Returned or rejected, last 30 days' },
          { label: 'Average Review Time', value: `${avgReviewMinutes} min`, hint: 'Time spent per detailed review' },
          { label: 'Submission Rate', value: `${submissionRate}%`, hint: 'Submitted at least a day before the lesson' }
        ].map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-[11px] text-gray-500">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* Queue */}
      <Card title={`Pending Review Queue (${queue.length})`} noPadding>
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-200 px-4 py-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">Search</label>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Teacher, class, subject or topic" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="w-52"><SelectField label="Teacher" value={teacherFilter} onChange={setTeacherFilter} options={['All Teachers', ...teachers]} /></div>
          <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => setConfirm('bulk')} title="Approve every selected plan"><CheckCircle className="h-4 w-4" />Bulk Approve ({selectedIds.length})</Button>
          <Button variant="outline" onClick={sendReminders}><Send className="h-4 w-4" />Send Reminder</Button>
          <Button variant="outline" onClick={sendFeedbackToAll} title="Remind teachers whose plans were returned"><Send className="h-4 w-4" />Send Bulk Feedback</Button>
        </div>
        {selectedIds.length > 0 && <p className="bg-amber-50 px-4 py-2 text-xs text-amber-800">Bulk approval skips the detailed checklist. Use it only for plans you have already checked.</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" aria-label="Select all in queue" checked={allQueueSelected} onChange={toggleAllQueue} disabled={queue.length === 0} /></th>
                <th className="px-3 py-3">Priority</th><th className="px-3 py-3">Teacher</th><th className="px-3 py-3">Class & Subject</th><th className="px-3 py-3">Lesson Date</th><th className="px-3 py-3">Submitted</th><th className="px-3 py-3">Days Pending</th><th className="px-3 py-3">Lesson Topic</th><th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map(({ lesson, daysPending, urgent }) => (
                <tr key={lesson.id} className={activeId === lesson.id ? 'bg-indigo-50' : ''}>
                  <td className="px-3 py-3"><input type="checkbox" aria-label={`Select ${lesson.title}`} checked={selectedIds.includes(lesson.id)} onChange={() => toggleSelected(lesson.id)} /></td>
                  <td className="px-3 py-3 whitespace-nowrap">{urgent ? '🔴 Urgent' : '🟡 Normal'}</td>
                  <td className="px-3 py-3">{lesson.teacher}</td>
                  <td className="px-3 py-3">{lesson.className} {lesson.section} · {lesson.subject}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatShortDate(lesson.date)}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatShortDate(lesson.createdAt)}</td>
                  <td className={`px-3 py-3 font-medium ${daysPending >= 5 ? 'text-red-600' : daysPending >= 3 ? 'text-amber-700' : 'text-gray-700'}`}>{daysPending} day(s)</td>
                  <td className="px-3 py-3">{lesson.topic}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      <Button size="xs" variant="outline" onClick={() => openReview(lesson)}><Eye className="h-3.5 w-3.5" />Review</Button>
                      <Button size="xs" variant="outline" onClick={() => { setQuickTargetId(lesson.id); setConfirm('quick'); }}><Zap className="h-3.5 w-3.5" />Quick Approve</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-500">No lesson plans are waiting for review.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review panel */}
      {activeLesson && (
        <Card title={`Review: ${activeLesson.title || activeLesson.topic}`} headerAction={<Button size="xs" variant="ghost" onClick={closeReview}><X className="h-4 w-4" />Close</Button>}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Left: read-only plan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Lesson plan (read-only)</p>
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" onClick={() => setOpenSections(Object.fromEntries(SECTION_KEYS.map((key) => [key, true])))}>Expand all</Button>
                  <Button size="xs" variant="outline" onClick={() => setOpenSections(Object.fromEntries(SECTION_KEYS.map((key) => [key, false])))}>Collapse all</Button>
                  <Button size="xs" variant="outline" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" />Print view</Button>
                </div>
              </div>
              {SECTION_KEYS.map((key) => {
                const content = sectionContent(activeLesson)[key];
                return (
                  <ReviewSection key={key} sectionKey={key} title={SECTION_TITLES[key]} open={openSections[key] !== false} onToggle={() => setOpenSections((state) => ({ ...state, [key]: !(state[key] !== false) }))} comment={sectionComments[key] || ''} onComment={(value) => setSectionComments((state) => ({ ...state, [key]: value }))}>
                    {content}
                  </ReviewSection>
                );
              })}
            </div>

            {/* Right: HOD form */}
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
                  <p className="text-sm font-semibold text-gray-900">9-point quality checklist</p>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900">Overall score: {liveScore === null ? '—' : `${liveScore}%`}</span>
                    <span className="ml-2 text-xs text-gray-500">{scoreLabel(liveScore)} · {ratedCount}/{REVIEW_CRITERIA.length} rated</span>
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {REVIEW_CRITERIA.map((criterion, index) => (
                    <div key={criterion} className="space-y-2 px-4 py-3">
                      <p className="text-sm text-gray-800"><span className="mr-2 font-semibold text-gray-500">{index + 1}.</span>{criterion}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {RATING_OPTIONS.map((option) => (
                          <button key={option} type="button" onClick={() => setRatings((state) => ({ ...state, [index]: option }))} aria-pressed={ratings[index] === option} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ratings[index] === option ? RATING_STYLES[option] : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}>
                            {RATING_LABELS[option]}
                          </button>
                        ))}
                      </div>
                      <input value={comments[index] || ''} onChange={(event) => setComments((state) => ({ ...state, [index]: event.target.value }))} placeholder="Comment for this criterion (optional)" className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <TextAreaField label="Overall feedback to teacher" value={overallFeedback} onChange={setOverallFeedback} placeholder="Summarise your decision and the main points." />
                <TextAreaField label="Positive aspects to highlight" value={positives} onChange={setPositives} placeholder="What worked well in this plan." />
                <TextAreaField label="Specific improvements required" value={improvements} onChange={setImprovements} placeholder="Concrete changes the teacher should make." />
              </div>

              {formError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

              <div>
                <p className="mb-2 text-xs font-medium text-gray-600">Decision</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DECISIONS.map((decision) => (
                    <div key={decision.value} className="space-y-1">
                      <button type="button" onClick={() => submitDecision(decision.value)} title={decision.effect} className={`w-full rounded-lg px-3 py-2 text-sm font-medium ${decision.tone}`}>{decision.label}</button>
                      <p className="text-[11px] text-gray-500">Teacher effect: {decision.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Analytics */}
      <Card title="HOD Analytics">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4 lg:col-span-2 xl:col-span-3">
            <p className="text-sm font-semibold text-gray-900">Teacher performance summary</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500"><tr><th className="py-1">Teacher</th><th>Plans submitted</th><th>On-time submission</th><th>Average score</th><th>Improvement trend (last scores)</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {teacherStats.map((stat) => {
                    const first = stat.trend[0];
                    const last = stat.trend[stat.trend.length - 1];
                    const arrow = stat.trend.length < 2 ? '—' : last > first ? '▲ Improving' : last < first ? '▼ Declining' : '► Steady';
                    return <tr key={stat.teacher}><td className="py-1.5 font-medium">{stat.teacher}</td><td>{stat.submitted}</td><td>{stat.onTimePct}%</td><td>{stat.avgScore === null ? '—' : `${stat.avgScore}%`}</td><td>{stat.trend.join(' → ') || '—'} <span className="text-gray-500">{arrow}</span></td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">Common issues (criteria failing most)</p>
            <ul className="mt-2 space-y-2 text-xs">
              {commonIssues.map((issue) => <li key={issue.criterion} className="flex justify-between gap-2"><span className="text-gray-700">{issue.criterion}</span><span className="font-semibold text-amber-700">{issue.failures}</span></li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">Department comparison</p>
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex justify-between font-medium"><span>School average</span><span>{schoolAvg === null ? '—' : `${schoolAvg}%`}</span></li>
              {departmentStats.map((item) => <li key={item.department} className="flex justify-between"><span className="text-gray-700">{item.department} ({item.count} reviews)</span><span>{item.avg === null ? '—' : `${item.avg}%`}</span></li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">Best lesson plans (score 90%+)</p>
            <ul className="mt-2 space-y-2 text-xs">
              {bestPlans.map((review) => (
                <li key={review.id} className="flex items-center justify-between gap-2">
                  <span><Star className="mr-1 inline h-3 w-3 text-amber-500" />{review.topic} · {review.teacher}</span>
                  <Button size="xs" variant={review.markedExample ? 'primary' : 'outline'} onClick={() => toggleExample(review.id)}>{review.markedExample ? 'Shared as example' : 'Mark as example'}</Button>
                </li>
              ))}
              {bestPlans.length === 0 && <li className="text-gray-500">No plans have reached 90% yet.</li>}
            </ul>
          </div>
        </div>
      </Card>

      {/* History */}
      <Card title="HOD Review History" noPadding headerAction={
        <div className="flex items-center gap-2">
          <div className="w-52"><SelectField label="" value={historyDecision} onChange={setHistoryDecision} options={['All Decisions', 'Approved', 'Approved with Suggestions', 'Returned for Revision', 'Rejected']} /></div>
          <Button size="xs" variant="outline" onClick={exportSummary}><Download className="h-3.5 w-3.5" />Export</Button>
        </div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr><th className="px-3 py-3">Date Reviewed</th><th className="px-3 py-3">Teacher</th><th className="px-3 py-3">Topic</th><th className="px-3 py-3">Decision</th><th className="px-3 py-3">Score</th><th className="px-3 py-3">Time to Review</th><th className="px-3 py-3">Teacher Response</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyRows.map((review) => (
                <tr key={review.id}>
                  <td className="px-3 py-3 whitespace-nowrap">{formatShortDate(review.reviewedOn)}</td>
                  <td className="px-3 py-3">{review.teacher}</td>
                  <td className="px-3 py-3">{review.topic}</td>
                  <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${decisionTone(review.decision)}`}>{review.decision}</span></td>
                  <td className="px-3 py-3">{review.score === null ? '—' : `${review.score}%`}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{daysBetween(review.submittedOn, review.reviewedOn)} day(s) after submission</td>
                  <td className="px-3 py-3 text-xs">{review.revisedOn ? `Revised on ${formatShortDate(review.revisedOn)} (${daysBetween(review.reviewedOn, review.revisedOn)} day(s) later)` : (review.decision === 'Returned for Revision' || review.decision === 'Rejected') ? 'Awaiting revision' : 'No revision needed'}</td>
                </tr>
              ))}
              {historyRows.length === 0 && <tr><td colSpan={7} className="px-4 py-8"><EmptyState>No reviews match this decision.</EmptyState></td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={confirm !== null} onClose={() => setConfirm(null)} title={confirm === 'bulk' ? 'Bulk approve lesson plans?' : 'Quick approve this plan?'} size="sm"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button><Button variant="primary" onClick={confirmQuick}>Approve</Button></div>}>
        <p className="text-sm text-gray-700">
          {confirm === 'bulk'
            ? `You are approving ${selectedIds.length} lesson plan(s) without a detailed review. No checklist ratings will be recorded for them.`
            : 'Quick approval records an approval without checklist ratings. Use the full review for plans that need feedback.'}
        </p>
      </Modal>
    </div>
  );
}

export default LessonPlanReview;
