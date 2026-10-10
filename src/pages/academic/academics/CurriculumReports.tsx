import { useMemo, useState } from 'react';
import { CalendarClock, Download, Eye, Printer, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ACADEMIC_PLANNING_KEYS, BLOOM_LEVELS, DEFAULT_ATPS, DEFAULT_CURRICULUM_CHAPTERS, DEFAULT_LESSON_PLANS, PageHeader, SelectField, TextField, downloadPlanningCsv, loadPlanningCollection, savePlanningCollection, newPlanningId, type AnnualTeachingPlanRecord, type CurriculumChapter, type LessonPlanRecord } from './academicPlanningData';
import { IA_COMPONENTS, IA_COMPONENT_MAX, REVIEW_KEYS, SEED_ASSESSMENTS, SEED_MARK_SHEETS, buildSeedProgressLogs, buildSeedQuestions, daysBetween, departmentFor, formatShortDate, isHolidayIso, loadAlerts, type AlertRecord, type AssessmentRecord, type LessonReviewRecord, type MarkSheet, type ProgressLog, type QuestionPaperRecord, type QuestionRecord, type ReportSchedule, todayIso, CURRENT_ACADEMIC_YEAR, REVIEW_SEED_REVIEWS, periodsTaughtFor, expectedPercentForChapters, progressStateFor } from './curriculumReviewData';
import { buildUnits, type Unit } from './TeachingProgressDashboard';

type Row = Record<string, string | number | boolean>;

interface Ctx {
  asOf: string;
  units: Unit[];
  chapters: CurriculumChapter[];
  atps: AnnualTeachingPlanRecord[];
  lessons: LessonPlanRecord[];
  logs: ProgressLog[];
  reviews: LessonReviewRecord[];
  assessments: AssessmentRecord[];
  marks: MarkSheet[];
  questions: QuestionRecord[];
  papers: QuestionPaperRecord[];
  alerts: AlertRecord[];
}

interface ReportDef {
  id: string;
  section: number;
  name: string;
  description: string;
  build: (ctx: Ctx) => Row[];
}

const SECTIONS = [
  '📘 Curriculum Coverage',
  '📝 Planning & Submission',
  '👩‍🏫 Lesson & Teaching Quality',
  '🧪 Assessment & IA',
  '🧠 Question Bank & Papers',
  '🚨 Risk & Interventions',
  '🏛️ Management & Compliance'
];

const pct = (taught: number, total: number): number => total ? Math.round((taught / total) * 100) : 0;
const bandOf = (score: number | null): string => score === null ? 'Not scored' : score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Poor';
const daysWaiting = (from: string, to: string) => Math.max(0, daysBetween(from, to));
const sectionMatch = (assessment: AssessmentRecord, className: string, section: string) => assessment.className === className && assessment.section === section;

const REPORTS: ReportDef[] = [
  // 1. Curriculum coverage
  { id: 'cov-class', section: 0, name: 'Syllabus completion by class', description: 'Completion and expected pace for each class.', build: ({ units }) => {
    const classes = [...new Set(units.map((unit) => unit.className))];
    return classes.map((className) => { const mine = units.filter((unit) => unit.className === className); const taught = mine.reduce((s, u) => s + u.taught, 0); const total = mine.reduce((s, u) => s + u.total, 0); const expected = Math.round(mine.reduce((s, u) => s + u.expected, 0) / mine.length); return { Class: className, Subjects: mine.length, 'Actual %': pct(taught, total), 'Expected %': expected, State: progressStateFor(pct(taught, total), expected) }; });
  } },
  { id: 'cov-subject', section: 0, name: 'Subject-wise completion', description: 'Completion for each subject across classes.', build: ({ units }) => {
    const subjects = [...new Set(units.map((unit) => unit.subject))];
    return subjects.map((subject) => { const mine = units.filter((unit) => unit.subject === subject); const taught = mine.reduce((s, u) => s + u.taught, 0); const total = mine.reduce((s, u) => s + u.total, 0); return { Subject: subject, Classes: mine.length, 'Actual %': pct(taught, total), 'Expected %': Math.round(mine.reduce((s, u) => s + u.expected, 0) / mine.length) }; });
  } },
  { id: 'cov-chapter', section: 0, name: 'Chapter completion status', description: 'Each chapter with periods taught against allocation.', build: ({ chapters, logs, asOf }) => chapters.map((chapter) => { const taught = periodsTaughtFor(chapter, logs); const expected = expectedPercentForChapters([chapter], asOf); const actual = pct(taught, chapter.allocatedPeriods); return { Class: chapter.className, Subject: chapter.subject, Chapter: chapter.name, Term: chapter.term, 'Periods taught': taught, 'Periods allocated': chapter.allocatedPeriods, 'Actual %': actual, 'Expected %': expected, State: progressStateFor(actual, expected) }; }) },
  { id: 'cov-topic', section: 0, name: 'Topic-level coverage gaps', description: 'Topics with no fully completed log entry yet.', build: ({ chapters, logs }) => chapters.flatMap((chapter) => chapter.topics.map((topic) => { const covered = logs.some((log) => log.chapterId === chapter.id && log.topicName === topic.name && log.coverage === 'Fully Completed'); return { Class: chapter.className, Subject: chapter.subject, Chapter: chapter.name, Topic: topic.name, Status: covered ? 'Covered' : 'Gap' }; })).filter((row) => row.Status === 'Gap') },
  { id: 'cov-term', section: 0, name: 'Term-wise coverage comparison', description: 'Average chapter completion by term and subject.', build: ({ chapters, logs }) => {
    const rows: Row[] = [];
    [...new Set(chapters.map((chapter) => chapter.term))].forEach((term) => {
      [...new Set(chapters.filter((chapter) => chapter.term === term).map((chapter) => chapter.subject))].forEach((subject) => {
        const mine = chapters.filter((chapter) => chapter.term === term && chapter.subject === subject);
        const taught = mine.reduce((s, c) => s + periodsTaughtFor(c, logs), 0);
        const total = mine.reduce((s, c) => s + c.allocatedPeriods, 0);
        rows.push({ Term: term, Subject: subject, Chapters: mine.length, 'Actual %': pct(taught, total) });
      });
    });
    return rows;
  } },
  { id: 'cov-cert', section: 0, name: 'CBSE syllabus completion record', description: 'Completion certificate data for each class and subject.', build: ({ chapters, logs }) => {
    const keys = [...new Set(chapters.map((chapter) => `${chapter.className}|${chapter.subject}`))];
    return keys.map((key) => { const [className, subject] = key.split('|'); const mine = chapters.filter((chapter) => chapter.className === className && chapter.subject === subject); const done = mine.filter((chapter) => periodsTaughtFor(chapter, logs) >= chapter.allocatedPeriods).length; return { Class: className, Subject: subject, 'Chapters complete': done, 'Chapters total': mine.length, Status: done === mine.length ? 'Complete' : 'In progress' }; });
  } },

  // 2. Planning and submission
  { id: 'plan-atp', section: 1, name: 'ATP submission status', description: 'Annual teaching plan status per teacher, class and subject.', build: ({ atps }) => atps.map((atp) => ({ Teacher: atp.teacher, Department: atp.department, Class: atp.className, Subject: atp.subject, Status: atp.status, 'Completeness %': atp.completeness, 'Submitted on': atp.submittedDate || '—', 'HOD review date': atp.hodReviewDate || '—' })) },
  { id: 'plan-completeness', section: 1, name: 'Plan completeness and period balance', description: 'Net teaching periods against curriculum requirement.', build: ({ atps }) => atps.map((atp) => ({ Teacher: atp.teacher, Class: atp.className, Subject: atp.subject, 'Net periods': atp.netTeachingPeriods, 'Required periods': atp.curriculumPeriodsRequired, Balance: atp.netTeachingPeriods - atp.curriculumPeriodsRequired })) },
  { id: 'plan-lessons', section: 1, name: 'Lesson plan submission log', description: 'Every lesson plan with its status and period.', build: ({ lessons }) => lessons.map((lesson) => ({ Teacher: lesson.teacher, Class: lesson.className, Subject: lesson.subject, Date: lesson.date, Period: lesson.periodNumber, Title: lesson.title, Status: lesson.status })) },
  { id: 'plan-pending', section: 1, name: 'Lesson plans awaiting HOD review', description: 'Submitted plans and how long they have waited.', build: ({ lessons, asOf }) => lessons.filter((lesson) => lesson.status === 'Submitted').map((lesson) => ({ Teacher: lesson.teacher, Class: lesson.className, Subject: lesson.subject, Date: lesson.date, Title: lesson.title, 'Days waiting': daysWaiting(lesson.date, asOf) })) },
  { id: 'plan-turnaround', section: 1, name: 'HOD review turnaround', description: 'Days from submission to HOD decision.', build: ({ reviews }) => reviews.map((review) => ({ Teacher: review.teacher, Topic: review.topic, Submitted: review.submittedOn, Reviewed: review.reviewedOn, 'Turnaround (days)': daysWaiting(review.submittedOn, review.reviewedOn) })) },
  { id: 'plan-returns', section: 1, name: 'Returned plans and revisions', description: 'Plans sent back for revision and whether they were revised.', build: ({ reviews }) => reviews.filter((review) => review.decision === 'Returned for Revision').map((review) => ({ Teacher: review.teacher, Class: review.className, Subject: review.subject, Topic: review.topic, Decision: review.decision, Revised: review.revisedOn || 'Not revised' })) },

  // 3. Lesson and teaching quality
  { id: 'q-scores', section: 2, name: 'Lesson plan review scores', description: 'Score and band for every reviewed lesson plan.', build: ({ reviews }) => reviews.map((review) => ({ Teacher: review.teacher, Class: review.className, Subject: review.subject, Topic: review.topic, Date: review.lessonDate, 'Score %': review.score ?? '—', Band: bandOf(review.score) })) },
  { id: 'q-teacher-score', section: 2, name: 'Teacher-wise average review score', description: 'Average lesson plan score per teacher.', build: ({ reviews }) => {
    const teachers = [...new Set(reviews.map((review) => review.teacher))];
    return teachers.map((teacher) => { const mine = reviews.filter((review) => review.teacher === teacher && review.score !== null); const avg = mine.length ? Math.round(mine.reduce((s, r) => s + (r.score ?? 0), 0) / mine.length) : '—'; return { Teacher: teacher, Reviews: mine.length, 'Average score %': avg, Band: typeof avg === 'number' ? bandOf(avg) : 'Not scored' }; });
  } },
  { id: 'q-planned-taught', section: 2, name: 'Periods planned vs taught', description: 'Expected periods to date against periods actually taught.', build: ({ units, asOf }) => units.map((unit) => { const expectedPeriods = Math.round((unit.total * unit.expected) / 100); return { Class: unit.className, Subject: unit.subject, Teacher: unit.teacher, 'Expected periods': expectedPeriods, 'Taught periods': unit.taught, Variance: unit.taught - expectedPeriods, 'As of': asOf }; }) },
  { id: 'q-missed', section: 2, name: 'Missed, skipped and postponed periods', description: 'Log entries where a scheduled period did not run as planned.', build: ({ logs }) => logs.filter((log) => ['Missed', 'Skipped', 'Postponed'].includes(log.periodStatus)).map((log) => ({ Date: log.date, Teacher: log.teacher, Class: log.className, Subject: log.subject, Chapter: log.chapterName, Status: log.periodStatus, Notes: log.notes || '—' })) },
  { id: 'q-substitution', section: 2, name: 'Substitution log', description: 'Periods covered by a substitute teacher.', build: ({ logs }) => logs.filter((log) => log.periodStatus === 'Substituted').map((log) => ({ Date: log.date, Teacher: log.teacher, Class: log.className, Subject: log.subject, Chapter: log.chapterName, Notes: log.notes || '—' })) },
  { id: 'q-understanding', section: 2, name: 'Student understanding by class', description: 'Understanding ratings logged in each class and subject.', build: ({ logs }) => {
    const keys = [...new Set(logs.map((log) => `${log.className}|${log.subject}`))];
    return keys.map((key) => { const [className, subject] = key.split('|'); const mine = logs.filter((log) => log.className === className && log.subject === subject); const count = (level: ProgressLog['understanding']) => mine.filter((log) => log.understanding === level).length; return { Class: className, Subject: subject, Excellent: count('Excellent'), Good: count('Good'), Fair: count('Fair'), 'Needs Revision': count('Needs Revision') }; });
  } },

  // 4. Assessment and IA
  { id: 'ia-schedule', section: 3, name: 'IA assessment schedule', description: 'Every assessment with date and status.', build: ({ assessments }) => assessments.map((item) => ({ Assessment: item.name, Type: item.type, Class: item.className, Section: item.section, Subject: item.subject, Date: item.date, Status: item.status })) },
  { id: 'ia-scores', section: 3, name: 'IA score summary by assessment', description: 'Average and pass rate for each assessment with marks.', build: ({ assessments, marks }) => assessments.flatMap((item) => { const sheet = marks.find((m) => m.assessmentId === item.id); if (!sheet) return []; const values = Object.values(sheet.marks).filter((v): v is number => typeof v === 'number'); if (!values.length) return []; return [{ Assessment: item.name, Class: item.className, Section: item.section, Subject: item.subject, 'Max marks': item.scaledMax, Average: Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10, 'Pass %': pct(values.filter((v) => v >= item.minPassMarks).length, values.length) }]; }) },
  { id: 'ia-completion', section: 3, name: 'IA component completion', description: 'Scheduled and completed count for each IA component.', build: ({ assessments }) => {
    const keys = [...new Set(assessments.map((item) => `${item.className}|${item.subject}`))];
    return keys.flatMap((key) => { const [className, subject] = key.split('|'); return IA_COMPONENTS.map((component) => { const mine = assessments.filter((item) => item.className === className && item.subject === subject && item.iaComponent === component && item.status !== 'Cancelled'); return { Class: className, Subject: subject, Component: component, Max: IA_COMPONENT_MAX[component], Scheduled: mine.length, Completed: mine.filter((item) => item.status === 'Marks Entered' || item.status === 'Completed').length }; }); });
  } },
  { id: 'ia-overload', section: 3, name: 'Assessment overload', description: 'Days with three or more assessments for the same class.', build: ({ assessments }) => {
    const rows: Row[] = [];
    [...new Set(assessments.map((item) => `${item.className}|${item.date}`))].forEach((key) => { const [className, date] = key.split('|'); const count = assessments.filter((item) => item.className === className && item.date === date && item.status !== 'Cancelled').length; if (count >= 3) rows.push({ Class: className, Date: date, Assessments: count, Flag: 'Reschedule some' }); });
    return rows;
  } },
  { id: 'ia-marks-status', section: 3, name: 'Marks finalisation status', description: 'Whether marks are finalised, pending, or not yet due.', build: ({ assessments, marks, asOf }) => assessments.filter((item) => item.status !== 'Cancelled').map((item) => { const sheet = marks.find((m) => m.assessmentId === item.id); const finalised = Boolean(sheet && sheet.finalizedOn); const due = daysBetween(item.date, asOf) >= 0; return { Assessment: item.name, Class: item.className, Section: item.section, Subject: item.subject, Date: item.date, 'Marks status': finalised ? 'Finalised' : due ? 'Pending' : 'Not yet due' }; }) },
  { id: 'ia-best-two', section: 3, name: 'Best-of-two periodic test analysis', description: 'PT1 and PT2 averages per section and subject, with the best-of-two average.', build: ({ assessments, marks }) => {
    const rows: Row[] = [];
    const keys = [...new Set(assessments.filter((item) => item.iaComponent === 'Periodic Test 1' || item.iaComponent === 'Periodic Test 2').map((item) => `${item.className}|${item.section}|${item.subject}`))];
    keys.forEach((key) => {
      const [className, section, subject] = key.split('|');
      const avgFor = (component: 'Periodic Test 1' | 'Periodic Test 2') => { const item = assessments.find((a) => a.className === className && a.section === section && a.subject === subject && a.iaComponent === component); const sheet = marks.find((m) => m.assessmentId === item?.id); const values = Object.values(sheet?.marks ?? {}).filter((v): v is number => typeof v === 'number'); return values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10 : null; };
      const pt1 = avgFor('Periodic Test 1'); const pt2 = avgFor('Periodic Test 2');
      rows.push({ Class: className, Section: section, Subject: subject, 'PT1 avg /10': pt1 ?? '—', 'PT2 avg /10': pt2 ?? '—', 'Best-of-two avg /10': pt1 === null && pt2 === null ? '—' : Math.max(pt1 ?? 0, pt2 ?? 0) });
    });
    return rows;
  } },

  // 5. Question bank and papers
  { id: 'qb-inventory', section: 4, name: 'Question bank inventory', description: 'Approved, draft and retired questions by chapter.', build: ({ questions }) => {
    const keys = [...new Set(questions.map((q) => `${q.className}|${q.subject}|${q.chapter}`))];
    return keys.map((key) => { const [className, subject, chapter] = key.split('|'); const mine = questions.filter((q) => q.className === className && q.subject === subject && q.chapter === chapter); return { Class: className, Subject: subject, Chapter: chapter, Total: mine.length, Approved: mine.filter((q) => q.hodReviewed && !q.retired).length, Draft: mine.filter((q) => !q.hodReviewed && !q.retired).length, Retired: mine.filter((q) => q.retired).length }; });
  } },
  { id: 'qb-gap', section: 4, name: 'Question gap analysis', description: 'Chapters with too few approved questions or missing higher-order items.', build: ({ questions }) => {
    const keys = [...new Set(questions.map((q) => `${q.className}|${q.subject}|${q.chapter}`))];
    return keys.map((key) => { const [className, subject, chapter] = key.split('|'); const mine = questions.filter((q) => q.className === className && q.subject === subject && q.chapter === chapter && q.hodReviewed && !q.retired); const gaps: string[] = []; if (mine.length < 10) gaps.push(`Add ${10 - mine.length}`); if (!mine.some((q) => q.difficulty === 'Hard' || q.difficulty === 'Very Hard')) gaps.push('No Hard'); if (!mine.some((q) => q.bloom === 'Analyse' || q.bloom === 'Evaluate')) gaps.push('No Analyse/Evaluate'); return { Class: className, Subject: subject, Chapter: chapter, Approved: mine.length, Gaps: gaps.join('; ') || 'None' }; });
  } },
  { id: 'qb-usage', section: 4, name: 'Question usage and performance', description: 'How often each question was used and how students performed.', build: ({ questions }) => questions.map((q) => ({ ID: q.id.slice(0, 14), Chapter: q.chapter, Difficulty: q.difficulty, 'Usage count': q.usageCount, 'Last used': q.lastUsed ? formatShortDate(q.lastUsed) : '—', 'Avg performance %': q.performancePct ?? '—' })) },
  { id: 'qb-papers', section: 4, name: 'Generated question papers', description: 'Saved test papers with marks and question count.', build: ({ papers }) => papers.map((paper) => ({ Title: paper.title, Class: paper.className, Subject: paper.subject, Questions: paper.questionIds.length, 'Total marks': paper.totalMarks, Duration: `${paper.durationMinutes} min`, Created: paper.createdOn, Status: paper.status })) },
  { id: 'qb-bloom', section: 4, name: 'Bloom coverage by chapter', description: 'Question count at each Bloom level per chapter.', build: ({ questions }) => {
    const keys = [...new Set(questions.filter((q) => !q.retired).map((q) => `${q.className}|${q.subject}|${q.chapter}`))];
    return keys.map((key) => { const [className, subject, chapter] = key.split('|'); const mine = questions.filter((q) => q.className === className && q.subject === subject && q.chapter === chapter && !q.retired); const row: Row = { Class: className, Subject: subject, Chapter: chapter }; BLOOM_LEVELS.forEach((level) => { row[level] = mine.filter((q) => q.bloom === level).length; }); return row; });
  } },
  { id: 'qb-source', section: 4, name: 'Question source mix', description: 'Where the bank questions came from.', build: ({ questions }) => {
    const live = questions.filter((q) => !q.retired);
    const sources = [...new Set(live.map((q) => q.source))];
    return sources.map((source) => { const count = live.filter((q) => q.source === source).length; return { Source: source, Questions: count, 'Share %': pct(count, live.length) }; });
  } },

  // 6. Risk and interventions
  { id: 'rk-behind', section: 5, name: 'Behind-schedule classes', description: 'Units that are behind expected progress.', build: ({ units }) => units.filter((u) => u.state === 'Behind').map((u) => ({ Class: u.className, Subject: u.subject, Teacher: u.teacher, 'Actual %': u.actual, 'Expected %': u.expected, Gap: u.diff })) },
  { id: 'rk-significant', section: 5, name: 'Significantly behind units', description: 'Units more than 15 points behind expected progress.', build: ({ units }) => units.filter((u) => u.state === 'Significantly Behind').map((u) => ({ Class: u.className, Subject: u.subject, Teacher: u.teacher, 'Actual %': u.actual, 'Expected %': u.expected, Gap: u.diff, 'Periods remaining': u.total - u.taught })) },
  { id: 'rk-teacher', section: 5, name: 'Teacher risk summary', description: 'Average gap per teacher and the resulting risk band.', build: ({ units }) => {
    const teachers = [...new Set(units.map((u) => u.teacher))];
    return teachers.map((teacher) => { const mine = units.filter((u) => u.teacher === teacher); const gap = Math.round(mine.reduce((s, u) => s + u.diff, 0) / mine.length); return { Teacher: teacher, Units: mine.length, 'Average gap': gap, Risk: gap >= -5 ? 'Low' : gap >= -15 ? 'Medium' : 'High' }; });
  } },
  { id: 'rk-alerts', section: 5, name: 'Alert log', description: 'All alerts raised from the progress and assessment pages.', build: ({ alerts }) => alerts.map((alert) => ({ Date: alert.date, Kind: alert.kind, Target: alert.target, Message: alert.message })) },
  { id: 'rk-reschedule', section: 5, name: 'Reschedule requests', description: 'Plan reschedule requests raised for HOD review.', build: ({ alerts }) => alerts.filter((alert) => alert.message.startsWith('Reschedule requested')).map((alert) => ({ Date: alert.date, Target: alert.target, Request: alert.message })) },
  { id: 'rk-ahead', section: 5, name: 'Ahead-of-schedule units', description: 'Units ahead of expected progress, candidates for sharing resources.', build: ({ units }) => units.filter((u) => u.diff >= 5).map((u) => ({ Class: u.className, Subject: u.subject, Teacher: u.teacher, 'Actual %': u.actual, 'Expected %': u.expected, Lead: u.diff })) },

  // 7. Management and compliance
  { id: 'mg-principal', section: 6, name: 'Principal summary', description: 'One-page school snapshot for the Principal.', build: ({ units, atps, reviews, assessments, marks }) => {
    const taught = units.reduce((s, u) => s + u.taught, 0); const total = units.reduce((s, u) => s + u.total, 0);
    const pendingPlans = atps.filter((a) => a.status === 'Draft' || a.status === 'Returned').length;
    const approved = atps.filter((a) => a.status === 'HOD Approved' || a.status === 'Principal Viewed').length;
    const finalised = assessments.filter((a) => marks.some((m) => m.assessmentId === a.id && m.finalizedOn)).length;
    const scores = reviews.filter((r) => r.score !== null).map((r) => r.score ?? 0);
    return [
      { Metric: 'School-wide completion %', Value: pct(taught, total) },
      { Metric: 'Units on track or ahead', Value: units.filter((u) => u.diff >= -5).length },
      { Metric: 'Units behind or significantly behind', Value: units.filter((u) => u.diff < -5).length },
      { Metric: 'ATPs approved', Value: `${approved} of ${atps.length}` },
      { Metric: 'ATPs still pending', Value: pendingPlans },
      { Metric: 'Average lesson plan score %', Value: scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : '—' },
      { Metric: 'Assessments with finalised marks', Value: `${finalised} of ${assessments.length}` }
    ];
  } },
  { id: 'mg-dept', section: 6, name: 'Department comparison', description: 'Completion, ATP approval and behind-schedule count by department.', build: ({ units, atps }) => {
    const departments = [...new Set(units.map((u) => u.department))];
    return departments.map((department) => { const mine = units.filter((u) => u.department === department); const taught = mine.reduce((s, u) => s + u.taught, 0); const total = mine.reduce((s, u) => s + u.total, 0); const deptAtps = atps.filter((a) => departmentFor(a.subject) === department); return { Department: department, Units: mine.length, 'Actual %': pct(taught, total), 'ATPs approved': `${deptAtps.filter((a) => a.status === 'HOD Approved' || a.status === 'Principal Viewed').length}/${deptAtps.length}`, Behind: mine.filter((u) => u.diff < -5).length }; });
  } },
  { id: 'mg-teacher-pack', section: 6, name: 'Teacher-wise performance pack', description: 'Completion, plan status and review score per teacher.', build: ({ units, atps, reviews }) => {
    const teachers = [...new Set(units.map((u) => u.teacher))];
    return teachers.map((teacher) => { const mine = units.filter((u) => u.teacher === teacher); const taught = mine.reduce((s, u) => s + u.taught, 0); const total = mine.reduce((s, u) => s + u.total, 0); const plan = atps.find((a) => a.teacher === teacher); const scored = reviews.filter((r) => r.teacher === teacher && r.score !== null); return { Teacher: teacher, Department: departmentFor(mine[0]?.subject ?? ''), Units: mine.length, 'Actual %': pct(taught, total), 'ATP status': plan?.status ?? 'Not submitted', 'Average review score %': scored.length ? Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length) : '—' }; });
  } },
  { id: 'mg-yoy', section: 6, name: 'Year-on-year comparison', description: 'Compares this year with previous years.', build: () => [{ Status: 'Not available', Note: `Multi-year progress history is not stored in this module yet. Only ${CURRENT_ACADEMIC_YEAR} is available.` }] },
  { id: 'mg-calendar', section: 6, name: 'Calendar compliance', description: 'Assessments scheduled on a holiday or Sunday.', build: ({ assessments }) => assessments.filter((a) => a.status !== 'Cancelled').map((a) => { const day = new Date(`${a.date}T00:00:00`).getDay(); return { Assessment: a.name, Date: a.date, Class: a.className, Holiday: isHolidayIso(a.date) ? 'Yes' : 'No', Sunday: day === 0 ? 'Yes' : 'No' }; }).filter((row) => row.Holiday === 'Yes' || row.Sunday === 'Yes') },
  { id: 'mg-decisions', section: 6, name: 'Review decision audit trail', description: 'Every HOD decision on a lesson plan, with date and score.', build: ({ reviews }) => reviews.map((r) => ({ Teacher: r.teacher, Class: r.className, Subject: r.subject, Topic: r.topic, Decision: r.decision, 'Reviewed on': r.reviewedOn, 'Score %': r.score ?? '—' })) }
];

const REPORT_COUNT = REPORTS.length;

export function CurriculumReports() {
  const today = todayIso();
  const [asOf, setAsOf] = useState(today);
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [atps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection<AnnualTeachingPlanRecord>(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [lessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection<LessonPlanRecord>(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [logs] = useState<ProgressLog[]>(() => loadPlanningCollection<ProgressLog>(REVIEW_KEYS.progressLogs, buildSeedProgressLogs(DEFAULT_CURRICULUM_CHAPTERS)));
  const [reviews] = useState<LessonReviewRecord[]>(() => loadPlanningCollection<LessonReviewRecord>(REVIEW_KEYS.reviews, REVIEW_SEED_REVIEWS));
  const [assessments] = useState<AssessmentRecord[]>(() => loadPlanningCollection<AssessmentRecord>(REVIEW_KEYS.assessments, SEED_ASSESSMENTS));
  const [marks] = useState<MarkSheet[]>(() => loadPlanningCollection<MarkSheet>(REVIEW_KEYS.assessmentMarks, SEED_MARK_SHEETS));
  const [questions] = useState<QuestionRecord[]>(() => loadPlanningCollection<QuestionRecord>(REVIEW_KEYS.questions, buildSeedQuestions(DEFAULT_CURRICULUM_CHAPTERS)));
  const [papers] = useState<QuestionPaperRecord[]>(() => loadPlanningCollection<QuestionPaperRecord>(REVIEW_KEYS.papers, []));
  const [alerts] = useState<AlertRecord[]>(() => loadAlerts());
  const [schedules, setSchedules] = useState<ReportSchedule[]>(() => loadPlanningCollection<ReportSchedule>(REVIEW_KEYS.reportSchedules, []));
  const [section, setSection] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ className: 'All', subject: 'All', department: 'All', term: 'All' });
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ frequency: 'Every Monday (weekly)' as ReportSchedule['frequency'], customDay: 'Friday', recipients: 'principal@school.example' });
  const [toast, setToast] = useState('');

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };
  const ctx: Ctx = useMemo(() => ({ asOf, units: buildUnits(chapters, logs, atps, lessons, asOf), chapters, atps, lessons, logs, reviews, assessments, marks, questions, papers, alerts }), [asOf, chapters, atps, lessons, logs, reviews, assessments, marks, questions, papers, alerts]);

  const classOptions = ['All', ...new Set([...chapters.map((c) => c.className), ...assessments.map((a) => a.className)])];
  const subjectOptions = ['All', ...new Set([...chapters.map((c) => c.subject)])];
  const departmentOptions = ['All', ...new Set(chapters.map((c) => departmentFor(c.subject)))];
  const termOptions = ['All', ...new Set(chapters.map((c) => c.term))];

  const applyFilters = (rows: Row[]): Row[] => rows.filter((row) => {
    const keyMatch = (key: string, filter: string) => filter === 'All' || row[key] === undefined || String(row[key]).startsWith(filter) || String(row[key]).includes(filter);
    const subjectOk = keyMatch('Subject', filters.subject) && (filters.department === 'All' || row.Subject === undefined || departmentFor(String(row.Subject)) === filters.department);
    const termOk = keyMatch('Term', filters.term);
    return keyMatch('Class', filters.className) && subjectOk && termOk;
  });

  const rowsFor = (report: ReportDef): Row[] => applyFilters(report.build(ctx));
  const visibleReports = REPORTS.filter((report) => report.section === section && (!search || `${report.name} ${report.description}`.toLowerCase().includes(search.toLowerCase())));
  const previewReport = REPORTS.find((report) => report.id === previewId) || null;
  const previewRows = previewReport ? rowsFor(previewReport) : [];
  const scheduleReport = REPORTS.find((report) => report.id === scheduleId) || null;

  const exportReport = (report: ReportDef) => {
    const rows = rowsFor(report);
    if (!rows.length) { flash('No data for this report with the current filters.'); return; }
    downloadPlanningCsv(`${report.id}-${asOf}.csv`, rows);
    flash(`${report.name} exported (${rows.length} rows).`);
  };

  const exportCatalogue = () => downloadPlanningCsv(`curriculum-reports-catalogue-${asOf}.csv`, REPORTS.map((report) => ({ ID: report.id, Section: SECTIONS[report.section], Report: report.name, Description: report.description, Rows: rowsFor(report).length })));

  const saveSchedule = () => {
    if (!scheduleReport) return;
    if (!scheduleForm.recipients.trim()) { flash('Enter at least one recipient.'); return; }
    const record: ReportSchedule = { id: newPlanningId('SCH'), reportId: scheduleReport.id, reportName: scheduleReport.name, frequency: scheduleForm.frequency, customDay: scheduleForm.frequency === 'Custom day' ? scheduleForm.customDay : '', recipients: scheduleForm.recipients.trim(), createdOn: today };
    const next = [record, ...schedules];
    setSchedules(next);
    savePlanningCollection(REVIEW_KEYS.reportSchedules, next);
    setScheduleId(null);
    flash(`Scheduled "${scheduleReport.name}". Automatic sending needs the Communications module.`);
  };
  const removeSchedule = (id: string) => {
    const next = schedules.filter((item) => item.id !== id);
    setSchedules(next);
    savePlanningCollection(REVIEW_KEYS.reportSchedules, next);
    flash('Schedule removed.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="📑 Curriculum & Academic Planning Reports"
        description={`${REPORT_COUNT} reports across ${SECTIONS.length} sections · ${CURRENT_ACADEMIC_YEAR} · as of ${formatShortDate(asOf)}`}
        actions={<>
          <Button variant="outline" onClick={exportCatalogue}><Download className="h-4 w-4" />Export Report Catalogue</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
        </>} />

      {toast && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{toast}</div>}

      <Card title="Filters">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <TextField label="As-of date" type="date" value={asOf} onChange={setAsOf} />
          <SelectField label="Class" value={filters.className} onChange={(value) => setFilters((state) => ({ ...state, className: value }))} options={classOptions} />
          <SelectField label="Subject" value={filters.subject} onChange={(value) => setFilters((state) => ({ ...state, subject: value }))} options={subjectOptions} />
          <SelectField label="Department" value={filters.department} onChange={(value) => setFilters((state) => ({ ...state, department: value }))} options={departmentOptions} />
          <SelectField label="Term" value={filters.term} onChange={(value) => setFilters((state) => ({ ...state, term: value }))} options={termOptions} />
        </div>
        <p className="mt-2 text-xs text-gray-500">Filters apply to every report that has a class, subject, department or term column. Reports without those columns show all rows.</p>
      </Card>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {SECTIONS.map((label, index) => (
          <button key={label} type="button" onClick={() => setSection(index)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${section === index ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            {label} <span className="opacity-75">({REPORTS.filter((report) => report.section === index).length})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-sm"><TextField label="" value={search} onChange={setSearch} placeholder="Search reports in this section" /></div>
        <Button variant="outline" size="sm" onClick={() => { const rows = visibleReports.map((report) => ({ ID: report.id, Report: report.name, Rows: rowsFor(report).length })); downloadPlanningCsv(`${SECTIONS[section].replace(/[^a-z]+/gi, '-').toLowerCase()}-index.csv`, rows); flash('Section index exported.'); }}><Download className="h-4 w-4" />Export Section Index</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleReports.map((report) => {
          const count = rowsFor(report).length;
          return (
            <Card key={report.id} title={report.name}>
              <p className="text-sm text-gray-600">{report.description}</p>
              <p className="mt-2 text-xs text-gray-500">{count} row{count === 1 ? '' : 's'} with current filters · ID {report.id}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setPreviewId(report.id)}><Eye className="h-4 w-4" />Preview</Button>
                <Button size="sm" variant="outline" onClick={() => exportReport(report)}><Download className="h-4 w-4" />Export CSV</Button>
                <Button size="sm" variant="outline" onClick={() => setScheduleId(report.id)}><CalendarClock className="h-4 w-4" />Schedule</Button>
              </div>
            </Card>
          );
        })}
        {visibleReports.length === 0 && <p className="col-span-full text-sm text-gray-500">No reports match this search.</p>}
      </div>

      {/* Schedules */}
      <Card title={`Scheduled Reports (${schedules.length})`} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Report</th><th className="px-3 py-3">Frequency</th><th className="px-3 py-3">Recipients</th><th className="px-3 py-3">Created</th><th className="px-3 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-3 font-medium">{item.reportName}</td>
                  <td className="px-3 py-3">{item.frequency}{item.customDay ? ` (${item.customDay})` : ''}</td>
                  <td className="px-3 py-3">{item.recipients}</td>
                  <td className="px-3 py-3">{formatShortDate(item.createdOn)}</td>
                  <td className="px-3 py-3"><Button size="xs" variant="ghost" onClick={() => removeSchedule(item.id)} title="Remove schedule"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button></td>
                </tr>
              ))}
              {schedules.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No reports are scheduled. Use Schedule on any report card.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview */}
      <Modal isOpen={previewReport !== null} onClose={() => setPreviewId(null)} title={previewReport ? previewReport.name : 'Preview'} size="xl"
        footer={<div className="flex justify-between gap-2"><Button variant="outline" onClick={() => previewReport && exportReport(previewReport)}><Download className="h-4 w-4" />Export CSV</Button><Button variant="outline" onClick={() => setPreviewId(null)}>Close</Button></div>}>
        {previewReport && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">{previewReport.description} · {previewRows.length} row{previewRows.length === 1 ? '' : 's'}</p>
            <div className="max-h-[60vh] overflow-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-gray-50 uppercase text-gray-500"><tr>{previewRows[0] ? Object.keys(previewRows[0]).map((key) => <th key={key} className="whitespace-nowrap px-3 py-2">{key}</th>) : <th className="px-3 py-2">No data</th>}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {previewRows.slice(0, 200).map((row, index) => <tr key={index}>{Object.keys(previewRows[0]).map((key) => <td key={key} className="whitespace-nowrap px-3 py-1.5">{String(row[key])}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            {previewRows.length > 200 && <p className="text-xs text-gray-500">Showing the first 200 rows. Export CSV for the full set.</p>}
          </div>
        )}
      </Modal>

      {/* Schedule */}
      <Modal isOpen={scheduleReport !== null} onClose={() => setScheduleId(null)} title={scheduleReport ? `Schedule: ${scheduleReport.name}` : 'Schedule'} size="md"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setScheduleId(null)}>Cancel</Button><Button variant="primary" onClick={saveSchedule}>Save Schedule</Button></div>}>
        <div className="space-y-4">
          <SelectField label="Frequency" value={scheduleForm.frequency} onChange={(value) => setScheduleForm((state) => ({ ...state, frequency: value as ReportSchedule['frequency'] }))} options={['Every Monday (weekly)', 'Monthly (1st)', 'Custom day']} />
          {scheduleForm.frequency === 'Custom day' && <SelectField label="Day" value={scheduleForm.customDay} onChange={(value) => setScheduleForm((state) => ({ ...state, customDay: value }))} options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} />}
          <TextField label="Recipients (comma separated emails)" value={scheduleForm.recipients} onChange={(value) => setScheduleForm((state) => ({ ...state, recipients: value }))} />
          <p className="text-xs text-gray-500">Schedules are saved in this browser. The app does not run them in the background; use Export CSV for manual delivery until the Communications module is connected.</p>
        </div>
      </Modal>
    </div>
  );
}

export default CurriculumReports;
