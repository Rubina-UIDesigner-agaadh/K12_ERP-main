import { MONTHS, createBlankLesson, DEFAULT_CURRICULUM_CHAPTERS, DEFAULT_ATPS, newPlanningId, loadPlanningCollection, savePlanningCollection, type CurriculumChapter, type LessonPlanRecord, type LessonProcedurePhase, type AnnualTeachingPlanRecord, type BloomLevel, type PeriodStatus } from './academicPlanningData';

// Shared data layer for the HOD review, syllabus tracking, progress, assessment, question bank and report pages.
// Seed data is deterministic and anchored to today's date so the demo always has pending items, due dates and history.

export const REVIEW_KEYS = {
  reviews: 'k12-lesson-plan-reviews-v1',
  progressLogs: 'k12-syllabus-progress-logs-v1',
  assessments: 'k12-internal-assessments-v1',
  assessmentMarks: 'k12-internal-assessment-marks-v1',
  questions: 'k12-question-bank-v1',
  papers: 'k12-question-papers-v1',
  alerts: 'k12-teaching-progress-alerts-v1',
  notificationRules: 'k12-progress-notification-rules-v1',
  reportSchedules: 'k12-curriculum-report-schedules-v1'
} as const;

// Replace with the value from Institute Profile when it is wired in.
export const INSTITUTE_NAME = 'Institute Name (from Institute Profile)';
export const PERIODS_PER_WEEK_DEFAULT = 6;

// ---------- Dates ----------
export const toIsoDate = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const parseIso = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};
export const todayIso = (): string => toIsoDate(new Date());
export const addDaysIso = (iso: string, days: number): string => {
  const date = parseIso(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};
export const daysBetween = (fromIso: string, toIsoValue: string): number => Math.round((parseIso(toIsoValue).getTime() - parseIso(fromIso).getTime()) / 86400000);
export const formatShortDate = (iso: string): string => {
  if (!iso) return '—';
  return parseIso(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Holidays used by the assessment scheduler. Configure these from the Academic Calendar when it is connected.
export const SCHOOL_HOLIDAYS_ISO: string[] = ['2026-10-02', '2026-11-08', '2026-12-25', '2027-01-26'];
export const isHolidayIso = (iso: string): boolean => SCHOOL_HOLIDAYS_ISO.includes(iso);

// ---------- Academic year window ----------
export const CURRENT_AY_START = (() => {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
})();
export const CURRENT_ACADEMIC_YEAR = `${CURRENT_AY_START}-${String((CURRENT_AY_START + 1) % 100).padStart(2, '0')}`;
export const AY_MONTHS = MONTHS;

// Month name in the academic year (April = first month) to a [start, end] ISO range.
export const monthRangeIso = (monthName: string): { start: string; end: string } => {
  const index = AY_MONTHS.indexOf(monthName);
  const safeIndex = index < 0 ? 0 : index;
  const calendarMonth = (safeIndex + 3) % 12;
  const year = safeIndex <= 8 ? CURRENT_AY_START : CURRENT_AY_START + 1;
  const start = toIsoDate(new Date(year, calendarMonth, 1));
  const end = toIsoDate(new Date(year, calendarMonth + 1, 0));
  return { start, end };
};

// Expected % complete for a chapter as of a date, interpolated across its scheduled months.
export const expectedPercentForChapter = (chapter: CurriculumChapter, asOfIso: string): number => {
  const from = monthRangeIso(chapter.scheduledMonthFrom || AY_MONTHS[0]);
  const to = monthRangeIso(chapter.scheduledMonthTo || chapter.scheduledMonthFrom || AY_MONTHS[0]);
  const startMs = parseIso(from.start).getTime();
  const endMs = parseIso(to.end).getTime();
  const asOfMs = parseIso(asOfIso).getTime();
  if (asOfMs <= startMs) return 0;
  if (asOfMs >= endMs || endMs === startMs) return 100;
  return Math.round(((asOfMs - startMs) / (endMs - startMs)) * 100);
};

// Expected % for a set of chapters, weighted by allocated periods.
export const expectedPercentForChapters = (chapters: CurriculumChapter[], asOfIso: string): number => {
  const totalPeriods = chapters.reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0);
  if (!totalPeriods) return 0;
  const weighted = chapters.reduce((sum, chapter) => sum + expectedPercentForChapter(chapter, asOfIso) * chapter.allocatedPeriods, 0);
  return Math.round(weighted / totalPeriods);
};

// Periods taught = seeded completion from the curriculum master + logged periods, capped at allocation.
export const periodsTaughtFor = (chapter: CurriculumChapter, logs: ProgressLog[]): number => {
  const base = Math.round((chapter.allocatedPeriods * chapter.completionPercent) / 100);
  const logged = logs.filter((log) => log.chapterId === chapter.id).reduce((sum, log) => sum + log.periodsUsed, 0);
  return Math.min(chapter.allocatedPeriods, base + logged);
};

export const percentForChapter = (chapter: CurriculumChapter, logs: ProgressLog[]): number => {
  if (!chapter.allocatedPeriods) return 0;
  return Math.round((periodsTaughtFor(chapter, logs) / chapter.allocatedPeriods) * 100);
};

export type ProgressState = 'Ahead' | 'On Track' | 'Behind' | 'Significantly Behind';
export const progressStateFor = (actual: number, expected: number): ProgressState => {
  const gap = actual - expected;
  if (gap >= 5) return 'Ahead';
  if (gap > -5) return 'On Track';
  if (gap > -15) return 'Behind';
  return 'Significantly Behind';
};

export const progressStateTone = (state: string): string => {
  if (state === 'Ahead' || state === 'On Track') return 'bg-green-100 text-green-700';
  if (state === 'Behind') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-700';
};

// Subject to department mapping used by the dashboards.
export const departmentFor = (subject: string): string => {
  if (['Physics', 'Chemistry', 'Biology', 'Science', 'EVS', 'Computer Science'].includes(subject)) return 'Science';
  if (['Mathematics'].includes(subject)) return 'Maths';
  if (['English', 'Hindi'].includes(subject)) return 'Languages';
  if (['Social Science', 'History', 'Geography'].includes(subject)) return 'Social Studies';
  return 'Arts & Physical Education';
};

export const teacherFor = (atps: AnnualTeachingPlanRecord[], className: string, subject: string): string => {
  const match = atps.find((atp) => atp.className === className && atp.subject === subject);
  return match ? match.teacher : 'Unassigned';
};

export const periodsPerWeekFor = (atps: AnnualTeachingPlanRecord[], className: string, subject: string): number => {
  const match = atps.find((atp) => atp.className === className && atp.subject === subject);
  return match && match.periodsPerWeek ? match.periodsPerWeek : PERIODS_PER_WEEK_DEFAULT;
};

// ---------- Lesson plan review ----------
export type RatingValue = 'Good' | 'Needs Work' | 'Missing';
export type ReviewDecision = 'Approved' | 'Approved with Suggestions' | 'Returned for Revision' | 'Rejected';

export const RATING_OPTIONS: RatingValue[] = ['Good', 'Needs Work', 'Missing'];
export const RATING_POINTS: Record<RatingValue, number> = { Good: 2, 'Needs Work': 1, Missing: 0 };
export const REVIEW_CRITERIA: string[] = [
  'Learning objectives are clear, specific, and measurable',
  'Content aligned with NCERT/Board curriculum',
  'Prior knowledge connection established',
  'Activities are student-centred and engaging',
  'Time allocation is realistic for each phase',
  'Differentiation strategies included',
  'Assessment strategy present and appropriate',
  'Homework is relevant and manageable',
  'Resources are appropriate and school-available'
];

// Percentage score across the nine criteria. Null until every criterion is rated.
export const calculateReviewScore = (ratings: Record<number, RatingValue | undefined>): number | null => {
  const values = REVIEW_CRITERIA.map((_, index) => ratings[index]);
  if (values.some((value) => value === undefined)) return null;
  const points = values.reduce<number>((sum, value) => sum + RATING_POINTS[value as RatingValue], 0);
  return Math.round((points / (REVIEW_CRITERIA.length * 2)) * 100);
};

export const scoreLabel = (score: number | null): string => {
  if (score === null) return 'Not rated';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

export interface LessonReviewRecord {
  id: string;
  lessonId: string;
  teacher: string;
  className: string;
  subject: string;
  topic: string;
  lessonDate: string;
  submittedOn: string;
  reviewedOn: string;
  decision: ReviewDecision;
  ratings: Record<number, RatingValue>;
  comments: Record<number, string>;
  sectionComments: Record<string, string>;
  overallFeedback: string;
  positives: string;
  improvements: string;
  score: number | null;
  reviewMinutes: number;
  revisedOn: string;
  markedExample: boolean;
}

// Maps an HOD decision to the lesson plan status that teachers see.
export const lessonStatusForDecision = (decision: ReviewDecision): LessonPlanRecord['status'] =>
  decision === 'Approved' || decision === 'Approved with Suggestions' ? 'Approved' : 'Returned';

const SAMPLE_PROCEDURE = (minutes: number): LessonProcedurePhase[] => [
  { id: newPlanningId('phase'), phase: 'Introduction and recap', minutes: Math.round(minutes * 0.15), teacherActivity: 'Recap previous lesson with two quick questions.', studentActivity: 'Answer on mini-whiteboards.', questions: 'What did we learn last time?', resources: 'Whiteboard', checkUnderstanding: 'Thumbs up / down' },
  { id: newPlanningId('phase'), phase: 'Concept development', minutes: Math.round(minutes * 0.45), teacherActivity: 'Demonstrate the concept with a worked example.', studentActivity: 'Copy the example and predict the outcome.', questions: 'What changes if we change one variable?', resources: 'Textbook, ray box / model', checkUnderstanding: 'Exit prediction' },
  { id: newPlanningId('phase'), phase: 'Guided activity', minutes: Math.round(minutes * 0.3), teacherActivity: 'Circulate and guide pair work.', studentActivity: 'Complete the activity sheet in pairs.', questions: 'Why does this result match the rule?', resources: 'Activity sheet', checkUnderstanding: 'Pair check' },
  { id: newPlanningId('phase'), phase: 'Summary and exit ticket', minutes: minutes - Math.round(minutes * 0.15) - Math.round(minutes * 0.45) - Math.round(minutes * 0.3), teacherActivity: 'Summarise key points and set exit ticket.', studentActivity: 'Write a two-line summary.', questions: 'Name one real-life use.', resources: 'Exit ticket slip', checkUnderstanding: 'Exit ticket marks' }
];

const submittedLesson = (id: string, teacher: string, employeeId: string, className: string, section: string, subject: string, chapter: string, topic: string, lessonDate: string, submittedOn: string, status: LessonPlanRecord['status']): LessonPlanRecord => ({
  ...createBlankLesson(),
  id,
  teacher,
  employeeId,
  className,
  section,
  subject,
  date: lessonDate,
  periodNumber: 3,
  durationMinutes: 45,
  chapter,
  topic,
  title: `${topic}`,
  objectives: [{ id: `${id}-o1`, statement: `Explain ${topic.toLowerCase()} using a worked example`, bloomLevel: 'Understand' as BloomLevel, actionVerb: 'Explain', expectedOutcome: 'Students solve one similar problem', assessmentMethod: 'Exit ticket' }],
  priorKnowledge: 'Students recall the basic definition from the previous lesson.',
  hookQuestion: 'Why does this happen in everyday life?',
  procedure: SAMPLE_PROCEDURE(45),
  differentiation: { 'Support learners': 'Provide a partially completed worksheet.', 'Extension learners': 'Ask for a real-life example with reasoning.' },
  homeworkAssigned: true,
  homeworkType: 'Written',
  homeworkDescription: 'Complete the three back-exercise questions.',
  assessmentMethod: 'Exit ticket',
  assessmentQuestions: 'One application question from the topic.',
  status,
  submitToHod: true,
  submissionNote: 'Submitted for HOD review.',
  createdAt: submittedOn
});

// Lessons waiting for HOD review. Dates are relative to today.
const today = todayIso();
export const REVIEW_SEED_QUEUE: LessonPlanRecord[] = [
  submittedLesson('LP-REV-001', 'Mr. R. Kumar', 'EMP-1024', 'Class 10', 'A', 'Science', 'Light—Reflection and Refraction', 'Lenses and Magnification', addDaysIso(today, 1), addDaysIso(today, -2), 'Submitted'),
  submittedLesson('LP-REV-002', 'Mrs. S. Joshi', 'EMP-1031', 'Class 10', 'A', 'Chemistry', 'Acids, Bases and Salts', 'Understanding Acids and Bases', addDaysIso(today, 3), addDaysIso(today, -4), 'Submitted'),
  submittedLesson('LP-REV-003', 'Mr. V. Patel', 'EMP-1040', 'Class 10', 'A', 'Mathematics', 'Real Numbers', 'Euclid’s division lemma', addDaysIso(today, 1), addDaysIso(today, -1), 'Submitted'),
  submittedLesson('LP-REV-004', 'Ms. P. Roy', 'EMP-1083', 'Class 8', 'A', 'Science', 'Coal and Petroleum', 'Natural resources', addDaysIso(today, 6), addDaysIso(today, -1), 'Submitted'),
  submittedLesson('LP-REV-005', 'Mrs. P. Gupta', 'EMP-1028', 'Class 10', 'A', 'English', 'A Letter to God', 'Reading and comprehension', addDaysIso(today, 4), addDaysIso(today, -6), 'Submitted'),
  submittedLesson('LP-REV-006', 'Mr. R. Kumar', 'EMP-1024', 'Class 10', 'C', 'Science', 'Light—Reflection and Refraction', 'Spherical Mirrors', addDaysIso(today, 2), addDaysIso(today, -3), 'Submitted'),
  submittedLesson('LP-REV-007', 'Mrs. S. Joshi', 'EMP-1031', 'Class 10', 'A', 'Chemistry', 'Chemical Reactions & Equations', 'Chemical Equations — Introduction', addDaysIso(today, 7), addDaysIso(today, -9), 'Submitted'),
  submittedLesson('LP-REV-008', 'Mr. V. Patel', 'EMP-1040', 'Class 10', 'B', 'Mathematics', 'Real Numbers', 'Fundamental theorem of arithmetic', addDaysIso(today, 4), addDaysIso(today, -2), 'Submitted')
];

// Lessons already reviewed, used for history, analytics and trends.
const HISTORY_TOPICS: Array<[string, string, string, string, string]> = [
  ['Mr. R. Kumar', 'Science', 'Light—Reflection and Refraction', 'Reflection Laws', 'Class 10'],
  ['Mrs. S. Joshi', 'Chemistry', 'Acids, Bases and Salts', 'Indicators', 'Class 10'],
  ['Mr. V. Patel', 'Mathematics', 'Real Numbers', 'HCF and LCM', 'Class 10'],
  ['Mrs. P. Gupta', 'English', 'A Letter to God', 'Character and theme', 'Class 10'],
  ['Ms. P. Roy', 'Science', 'Coal and Petroleum', 'Fossil fuels', 'Class 8'],
  ['Mr. R. Kumar', 'Physics', 'Electricity', 'Ohm’s law', 'Class 10'],
  ['Mr. V. Patel', 'Mathematics', 'Real Numbers', 'Irrational numbers', 'Class 10'],
  ['Mrs. P. Gupta', 'English', 'A Letter to God', 'Reading and comprehension', 'Class 10'],
  ['Mrs. S. Joshi', 'Chemistry', 'Chemical Reactions & Equations', 'Balancing equations', 'Class 10'],
  ['Ms. P. Roy', 'Science', 'Coal and Petroleum', 'Conservation', 'Class 8']
];
const HISTORY_DECISIONS: ReviewDecision[] = ['Approved', 'Approved with Suggestions', 'Approved', 'Returned for Revision', 'Approved', 'Approved with Suggestions', 'Rejected', 'Approved', 'Returned for Revision', 'Approved'];
const RATING_PATTERN: RatingValue[] = ['Good', 'Good', 'Good', 'Needs Work', 'Good', 'Missing'];

const buildHistory = (): { lessons: LessonPlanRecord[]; reviews: LessonReviewRecord[] } => {
  const lessons: LessonPlanRecord[] = [];
  const reviews: LessonReviewRecord[] = [];
  HISTORY_TOPICS.forEach(([teacher, subject, chapter, topic, className], index) => {
    const decision = HISTORY_DECISIONS[index];
    const reviewedOn = addDaysIso(today, -(index * 2 + 1));
    const submittedOn = addDaysIso(reviewedOn, -(1 + (index % 3)));
    const lessonId = `LP-HIST-${String(index + 1).padStart(3, '0')}`;
    const lessonDate = addDaysIso(submittedOn, 2);
    lessons.push(submittedLesson(lessonId, teacher, `EMP-${1024 + index}`, className, 'A', subject, chapter, topic, lessonDate, submittedOn, lessonStatusForDecision(decision)));
    const ratings: Record<number, RatingValue> = {};
    const comments: Record<number, string> = {};
    REVIEW_CRITERIA.forEach((_, criterion) => {
      const rating = RATING_PATTERN[(index * 3 + criterion) % RATING_PATTERN.length];
      ratings[criterion] = rating;
      if (rating !== 'Good') comments[criterion] = 'Tighten this point before the next lesson.';
    });
    const score = calculateReviewScore(ratings);
    reviews.push({
      id: `REV-HIST-${index + 1}`,
      lessonId,
      teacher,
      className,
      subject,
      topic,
      lessonDate,
      submittedOn,
      reviewedOn,
      decision,
      ratings,
      comments,
      sectionComments: {},
      overallFeedback: decision === 'Rejected' ? 'Core concept is not addressed; please build a new plan.' : 'Good structure overall. See the comments on individual criteria.',
      positives: 'Clear hook question and organised procedure.',
      improvements: decision === 'Approved' ? '' : 'Add an assessment question that checks the target objective.',
      score,
      reviewMinutes: 6 + ((index * 7) % 15),
      revisedOn: decision === 'Returned for Revision' && index % 2 === 0 ? addDaysIso(reviewedOn, 2) : '',
      markedExample: (score ?? 0) >= 90
    });
  });
  return { lessons, reviews };
};
const HISTORY = buildHistory();
export const REVIEW_SEED_HISTORY_LESSONS: LessonPlanRecord[] = HISTORY.lessons;
export const REVIEW_SEED_REVIEWS: LessonReviewRecord[] = HISTORY.reviews;

export const loadLessonsForReview = (): LessonPlanRecord[] => loadPlanningCollection<LessonPlanRecord>(
  'k12-lesson-plans-v1',
  [...REVIEW_SEED_QUEUE, ...REVIEW_SEED_HISTORY_LESSONS]
);

// ---------- Syllabus progress logs ----------
export interface ProgressLog {
  id: string;
  date: string;
  mode: 'Quick' | 'Detailed';
  academicYear: string;
  className: string;
  subject: string;
  teacher: string;
  chapterId: string;
  chapterName: string;
  topicName: string;
  subTopic: string;
  coverage: 'Fully Completed' | 'Partially Completed' | 'Not Covered';
  periodsUsed: number;
  periodStatus: PeriodStatus;
  understanding: 'Excellent' | 'Good' | 'Fair' | 'Needs Revision';
  lessonPlanId: string;
  notes: string;
  continueTomorrow: boolean;
  whatCovered: string;
  whatRemains: string;
  extraResources: string;
  homework: string;
  classResponse: string;
}

// Recent logs so pace, monthly trend and "untouched chapter" alerts have data to work with.
export const buildSeedProgressLogs = (chapters: CurriculumChapter[]): ProgressLog[] => {
  const logs: ProgressLog[] = [];
  const inProgress = chapters.filter((chapter) => chapter.completionPercent > 0 && chapter.completionPercent < 100 && chapter.className === 'Class 10');
  inProgress.forEach((chapter, chapterIndex) => {
    const topic = chapter.topics[0];
    for (let step = 0; step < 4; step += 1) {
      const daysAgo = (chapterIndex % 3) * 5 + step * 6 + 1;
      logs.push({
        id: `LOG-${chapter.id}-${step}`,
        date: addDaysIso(today, -daysAgo),
        mode: 'Quick',
        academicYear: chapter.academicYear,
        className: chapter.className,
        subject: chapter.subject,
        teacher: teacherFor(DEFAULT_ATPS, chapter.className, chapter.subject),
        chapterId: chapter.id,
        chapterName: chapter.name,
        topicName: topic ? topic.name : chapter.name,
        subTopic: '',
        coverage: step === 3 ? 'Partially Completed' : 'Fully Completed',
        periodsUsed: 1 + (step % 2),
        periodStatus: 'Completed',
        understanding: step === 2 ? 'Fair' : 'Good',
        lessonPlanId: '',
        notes: '',
        continueTomorrow: step === 3,
        whatCovered: '',
        whatRemains: '',
        extraResources: '',
        homework: '',
        classResponse: ''
      });
    }
  });
  // Older logs spread across earlier months for the monthly trend.
  for (let month = 1; month <= 5; month += 1) {
    const logDate = addDaysIso(today, -month * 30);
    logs.push({ ...logs[0], id: `LOG-HIST-${month}`, date: logDate, periodsUsed: 4 + month, coverage: 'Fully Completed', periodStatus: 'Completed', understanding: 'Good', continueTomorrow: false, chapterId: inProgress[0] ? inProgress[0].id : logs[0].chapterId, chapterName: inProgress[0] ? inProgress[0].name : logs[0].chapterName });
  }
  return logs;
};

// ---------- Internal assessments ----------
export type AssessmentType = 'Periodic Test' | 'Class Test' | 'Assignment' | 'Project' | 'Practical Exam' | 'Subject Enrichment Activity' | 'Notebook Submission' | 'Viva' | 'Oral Test';
export const ASSESSMENT_TYPES: AssessmentType[] = ['Periodic Test', 'Class Test', 'Assignment', 'Project', 'Practical Exam', 'Subject Enrichment Activity', 'Notebook Submission', 'Viva', 'Oral Test'];
export type IAComponent = 'Periodic Test 1' | 'Periodic Test 2' | 'Notebook Submission' | 'Subject Enrichment';
export const IA_COMPONENTS: IAComponent[] = ['Periodic Test 1', 'Periodic Test 2', 'Notebook Submission', 'Subject Enrichment'];
// CBSE structure used on the IA calendar: periodic tests are best of two, scaled to 10 marks.
export const IA_COMPONENT_MAX: Record<IAComponent, number> = { 'Periodic Test 1': 10, 'Periodic Test 2': 10, 'Notebook Submission': 5, 'Subject Enrichment': 5 };
export const IA_BEST_OF_TWO_MAX = 10;
export type AssessmentStatus = 'Planned' | 'Ongoing' | 'Completed' | 'Marks Entered' | 'Cancelled';
export type QuestionPaperStatus = 'Not prepared' | 'Prepared' | 'Finalized' | 'Sealed';

export interface AssessmentRecord {
  id: string;
  name: string;
  type: AssessmentType;
  className: string;
  section: string;
  subject: string;
  term: string;
  date: string;
  session: 'Morning' | 'Afternoon' | 'In-class period';
  startTime: string;
  durationMinutes: number;
  venue: string;
  noticeDays: number;
  resultsBy: string;
  parentNotify: boolean;
  conductedBy: 'Subject teacher' | 'External evaluator' | 'Peer evaluation';
  maxMarks: number;
  minPassMarks: number;
  scalingRequired: boolean;
  scaledMax: number;
  iaComponent: IAComponent | '';
  chapters: string;
  topicsIncluded: string;
  topicsExcluded: string;
  syllabusCoveragePct: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionTypes: string;
  paperSource: 'Teacher-created' | 'From Question Bank' | 'External';
  questionPaperStatus: QuestionPaperStatus;
  markingSchemeUploaded: boolean;
  hodReviewed: boolean;
  hodApproval: 'Pending' | 'Approved';
  status: AssessmentStatus;
  paperFileName: string;
  notes: string;
}

export interface MarkSheet {
  assessmentId: string;
  marks: Record<string, number | null>;
  finalizedOn: string;
}

// Sample roster for the IA tracker. Replace with the student module roster when connected.
export const SAMPLE_ROSTER: Array<{ id: string; name: string; section: string }> = [
  { id: 'S-1001', name: 'Rahul Kumar', section: 'A' },
  { id: 'S-1002', name: 'Priya Sharma', section: 'A' },
  { id: 'S-1003', name: 'Aman Verma', section: 'A' },
  { id: 'S-1004', name: 'Neha Joshi', section: 'A' },
  { id: 'S-1005', name: 'Karan Mehta', section: 'A' },
  { id: 'S-1006', name: 'Ananya Iyer', section: 'A' }
];

const seedAssessment = (id: string, name: string, type: AssessmentType, subject: string, offset: number, maxMarks: number, iaComponent: IAComponent | '', status: AssessmentStatus, scalingRequired: boolean, scaledMax: number, qpStatus: QuestionPaperStatus): AssessmentRecord => ({
  id,
  name,
  type,
  className: 'Class 10',
  section: 'A',
  subject,
  term: 'Term 1',
  date: addDaysIso(today, offset),
  session: 'Morning',
  startTime: '09:00',
  durationMinutes: 60,
  venue: 'Classroom',
  noticeDays: 7,
  resultsBy: addDaysIso(today, offset + 5),
  parentNotify: true,
  conductedBy: 'Subject teacher',
  maxMarks,
  minPassMarks: Math.round(maxMarks * 0.33),
  scalingRequired,
  scaledMax,
  iaComponent,
  chapters: '',
  topicsIncluded: '',
  topicsExcluded: '',
  syllabusCoveragePct: 40,
  difficulty: 'Mixed',
  questionTypes: 'MCQ, Short Answer',
  paperSource: 'From Question Bank',
  questionPaperStatus: qpStatus,
  markingSchemeUploaded: qpStatus !== 'Not prepared',
  hodReviewed: qpStatus === 'Finalized' || qpStatus === 'Sealed',
  hodApproval: qpStatus === 'Finalized' || qpStatus === 'Sealed' ? 'Approved' : 'Pending',
  status,
  paperFileName: '',
  notes: ''
});

export const SEED_ASSESSMENTS: AssessmentRecord[] = [
  seedAssessment('AS-001', 'Periodic Test 1 — Chapters 1-3', 'Periodic Test', 'Science', -20, 40, 'Periodic Test 1', 'Marks Entered', true, 10, 'Sealed'),
  seedAssessment('AS-002', 'Notebook Check — Term 1', 'Notebook Submission', 'Science', -10, 5, 'Notebook Submission', 'Marks Entered', false, 5, 'Not prepared'),
  seedAssessment('AS-003', 'Periodic Test 2 — Chapters 4-8', 'Periodic Test', 'Science', 21, 40, 'Periodic Test 2', 'Planned', true, 10, 'Prepared'),
  seedAssessment('AS-004', 'Science Lab Practical', 'Practical Exam', 'Science', 6, 10, 'Subject Enrichment', 'Planned', false, 5, 'Not prepared'),
  seedAssessment('AS-005', 'Algebra Class Test', 'Class Test', 'Mathematics', 3, 20, '', 'Planned', false, 20, 'Prepared'),
  seedAssessment('AS-006', 'Grammar Assignment', 'Assignment', 'English', 14, 10, 'Subject Enrichment', 'Planned', false, 5, 'Not prepared'),
  seedAssessment('AS-007', 'Chemistry Mini Project', 'Project', 'Chemistry', 28, 20, 'Subject Enrichment', 'Planned', true, 5, 'Not prepared'),
  seedAssessment('AS-008', 'Maths Oral Test', 'Oral Test', 'Mathematics', 10, 10, '', 'Planned', false, 10, 'Not prepared')
];

export const SEED_MARK_SHEETS: MarkSheet[] = [
  { assessmentId: 'AS-001', marks: { 'S-1001': 8, 'S-1002': 9, 'S-1003': 6, 'S-1004': 7, 'S-1005': 5, 'S-1006': 9 }, finalizedOn: addDaysIso(today, -15) },
  { assessmentId: 'AS-002', marks: { 'S-1001': 4, 'S-1002': 5, 'S-1003': 3, 'S-1004': 4, 'S-1005': 4, 'S-1006': 5 }, finalizedOn: addDaysIso(today, -8) }
];

// ---------- Question bank ----------
export type QuestionType = 'MCQ' | 'True-False' | 'Fill in Blank' | 'Match' | 'Short Answer' | 'Long Answer' | 'Numerical' | 'Diagram-based' | 'Case Study' | 'Activity-based';
export const QUESTION_TYPES_BANK: QuestionType[] = ['MCQ', 'True-False', 'Fill in Blank', 'Match', 'Short Answer', 'Long Answer', 'Numerical', 'Diagram-based', 'Case Study', 'Activity-based'];
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
export type QuestionSource = 'NCERT Textbook' | 'NCERT Exemplar' | 'Board Previous Paper' | 'Teacher Created' | 'Reference Book' | 'External';

export interface QuestionRecord {
  id: string;
  className: string;
  subject: string;
  chapter: string;
  topic: string;
  subTopic: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  bloom: BloomLevel;
  marks: number;
  expectedMinutes: number;
  text: string;
  imageName: string;
  formula: string;
  options: string[];
  correctOption: string;
  allCorrect: boolean;
  modelAnswer: string;
  keyPoints: string;
  markingScheme: string;
  alternateAnswers: string;
  partialMarks: string;
  solutionSteps: string;
  whatItTests: string;
  commonWrongAnswers: string;
  misconception: string;
  remediation: string;
  extension: string;
  simplification: string;
  source: QuestionSource;
  sourceRef: string;
  sourceYear: string;
  createdBy: string;
  hodReviewed: boolean;
  copyright: string;
  addedOn: string;
  lastUsed: string;
  usageCount: number;
  performancePct: number | null;
  retired: boolean;
}

export const blankQuestion = (className = 'Class 10', subject = 'Science'): QuestionRecord => ({
  id: newPlanningId('Q'),
  className,
  subject,
  chapter: '',
  topic: '',
  subTopic: '',
  type: 'Short Answer',
  difficulty: 'Medium',
  bloom: 'Understand',
  marks: 2,
  expectedMinutes: 3,
  text: '',
  imageName: '',
  formula: '',
  options: ['', '', '', ''],
  correctOption: '',
  allCorrect: false,
  modelAnswer: '',
  keyPoints: '',
  markingScheme: '',
  alternateAnswers: '',
  partialMarks: '',
  solutionSteps: '',
  whatItTests: '',
  commonWrongAnswers: '',
  misconception: '',
  remediation: '',
  extension: '',
  simplification: '',
  source: 'Teacher Created',
  sourceRef: '',
  sourceYear: '',
  createdBy: 'Mr. R. Kumar',
  hodReviewed: false,
  copyright: '',
  addedOn: todayIso(),
  lastUsed: '',
  usageCount: 0,
  performancePct: null,
  retired: false
});

// Questions generated from the Class 10 Science curriculum topics so the bank is not empty on first use.
const BANK_TYPE_CYCLE: Array<[QuestionType, number, QuestionDifficulty, BloomLevel]> = [
  ['MCQ', 1, 'Easy', 'Remember'],
  ['Short Answer', 2, 'Medium', 'Understand'],
  ['Numerical', 3, 'Hard', 'Apply'],
  ['Long Answer', 5, 'Medium', 'Analyse']
];
export const buildSeedQuestions = (chapters: CurriculumChapter[]): QuestionRecord[] => {
  const questions: QuestionRecord[] = [];
  chapters.filter((chapter) => chapter.className === 'Class 10' && chapter.subject === 'Science' && chapter.topics.length > 0).forEach((chapter) => {
    chapter.topics.forEach((topic, topicIndex) => {
      BANK_TYPE_CYCLE.forEach(([type, marks, difficulty, bloom], cycleIndex) => {
        if ((topicIndex + cycleIndex) % 3 === 2) return;
        const base = blankQuestion('Class 10', 'Science');
        const usageCount = (topicIndex * 2 + cycleIndex) % 4;
        questions.push({
          ...base,
          id: `Q-SEED-${chapter.chapterNumber}-${topicIndex}-${cycleIndex}`,
          chapter: chapter.name,
          topic: topic.name,
          type,
          marks,
          difficulty,
          bloom,
          expectedMinutes: marks * 2,
          text: `${type === 'Numerical' ? 'Solve a problem' : 'Explain'} on: ${topic.name}.`,
          modelAnswer: `Model answer covering ${topic.name.toLowerCase()}.`,
          keyPoints: 'Definition; key rule; example',
          source: cycleIndex === 0 ? 'NCERT Textbook' : 'Teacher Created',
          sourceRef: cycleIndex === 0 ? `Textbook, Ch ${chapter.chapterNumber}` : '',
          addedOn: addDaysIso(today, -(topicIndex + 10)),
          lastUsed: usageCount > 1 ? addDaysIso(today, -(topicIndex * 5 + 20)) : '',
          usageCount,
          performancePct: usageCount > 0 ? 55 + ((topicIndex * 7) % 35) : null,
          hodReviewed: cycleIndex !== 3
        });
      });
    });
  });
  return questions;
};

export interface QuestionPaperRecord {
  id: string;
  title: string;
  className: string;
  subject: string;
  chapters: string[];
  totalMarks: number;
  durationMinutes: number;
  questionIds: string[];
  createdOn: string;
  status: QuestionPaperStatus;
}

// ---------- Alerts, notifications, schedules ----------
export interface AlertRecord {
  id: string;
  date: string;
  kind: 'Teacher alert' | 'HOD alert' | 'Assessment notice' | 'Weekly summary';
  target: string;
  message: string;
}

export const NOTIFICATION_RULE_DEFAULTS = [
  { id: 'weekly-summary', label: 'Every Monday: weekly progress summary to HODs and Principal', enabled: true },
  { id: 'behind-10', label: 'When a class falls 10% behind target: alert HOD', enabled: true },
  { id: 'no-plan-3', label: 'When a teacher has not submitted a lesson plan for 3+ consecutive days: alert HOD', enabled: true },
  { id: 'atp-week', label: 'When ATP is not submitted one week before deadline: alert teacher and HOD', enabled: true }
];

export interface NotificationRule { id: string; label: string; enabled: boolean }

export interface ReportSchedule {
  id: string;
  reportId: string;
  reportName: string;
  frequency: 'Every Monday (weekly)' | 'Monthly (1st)' | 'Custom day';
  customDay: string;
  recipients: string;
  createdOn: string;
}

export const loadAlerts = (): AlertRecord[] => loadPlanningCollection<AlertRecord>(REVIEW_KEYS.alerts, []);
export const saveAlerts = (records: AlertRecord[]): void => savePlanningCollection(REVIEW_KEYS.alerts, records);
export const addAlert = (kind: AlertRecord['kind'], target: string, message: string): AlertRecord[] => {
  const next = [{ id: newPlanningId('ALERT'), date: todayIso(), kind, target, message }, ...loadAlerts()];
  saveAlerts(next);
  return next;
};

// ---------- Chapter helpers used across pages ----------
export const loadCurriculumChapters = (storageKey: string): CurriculumChapter[] => loadPlanningCollection<CurriculumChapter>(storageKey, DEFAULT_CURRICULUM_CHAPTERS);

export const termOfChapter = (chapter: CurriculumChapter): string => chapter.term || 'Term 1';

// Round to one decimal for display.
export const round1 = (value: number): number => Math.round(value * 10) / 10;

// Month key used by monthly charts and trend tables: "Apr 2026" style labels.
export const monthLabelFor = (iso: string): string => parseIso(iso).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

export const monthKeyFor = (iso: string): string => iso.slice(0, 7);
