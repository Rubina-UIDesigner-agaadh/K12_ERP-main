export const ACADEMIC_PLANNING_KEYS = {
  chapters: 'k12-curriculum-master-v1',
  objectives: 'k12-learning-objectives-v1',
  subjectOutcomes: 'k12-subject-outcomes-v1',
  resources: 'k12-textbook-resource-master-v1',
  atps: 'k12-annual-teaching-plans-v1',
  monthlyPlans: 'k12-monthly-teaching-plans-v1',
  weeklyPlans: 'k12-weekly-teaching-plans-v1',
  lessons: 'k12-lesson-plans-v1'
} as const;

export const ACADEMIC_YEARS = ['2025-26', '2026-27', '2024-25'];
export const TERMS = ['Term 1', 'Term 2', 'Term 3'] as const;
export const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
export const CLASSES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`)];
export const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'EVS', 'Hindi', 'Computer Science', 'Art', 'Physical Education'];
export const BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'] as const;
export const QUESTION_TYPES = ['MCQ', 'Short Answer', 'Long Answer', 'Numerical', 'Diagram', 'Practical', 'Project'] as const;
export const TEACHING_METHODS = ['Lecture', 'Discussion', 'Demonstration', 'Activity', 'Project', 'Flipped', 'Problem Solving'] as const;
export const RESOURCE_TYPES = ['Prescribed Textbook', 'Reference Book', 'Lab Manual', 'Workbook / Practice Book', 'Question Bank Book', 'Worksheet', 'Video', 'Animation / Simulation', 'Online Course / URL', 'Digital Content (App)', 'Visual Aid', 'Lab Equipment', 'Audio Resource', 'Past Year Papers', 'Notes / Handouts', 'Flash Cards', 'Mind Maps'] as const;

export type BloomLevel = typeof BLOOM_LEVELS[number];
export type PlanStatus = 'Draft' | 'Submitted' | 'HOD Approved' | 'Principal Viewed' | 'Returned';
export type LessonStatus = 'Draft' | 'Submitted' | 'Approved' | 'Returned';
export type PeriodStatus = 'Planned' | 'Completed' | 'Skipped' | 'Postponed' | 'Missed' | 'Substituted';

export interface CurriculumSubTopic {
  id: string;
  number: string;
  name: string;
  periods: number;
  teachingNotes: string;
}
export interface TopicLearningObjective { id: string; statement: string; bloomLevel: BloomLevel; actionVerb?: string; expectedOutcome?: string; assessmentMethod?: string; }
export interface CurriculumTopic {
  id: string;
  chapterId: string;
  number: string;
  name: string;
  code: string;
  hasSubtopics: boolean;
  subtopics: CurriculumSubTopic[];
  periods: number;
  plannedWeek: string;
  hasRevisionPeriod: boolean;
  learningObjectives: TopicLearningObjective[];
  textbookPages: string;
  referenceBooks: string;
  videoLinks: string;
  worksheets: string;
  labEquipment: string;
  digitalTools: string;
  expectedExamMarks: number;
  questionTypes: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomLevel: BloomLevel;
  commonlyConfusedWith: string;
  completionPercent: number;
  status: 'Not Started' | 'In Progress' | 'Complete';
}
export interface CurriculumChapter {
  id: string;
  academicYear: string;
  className: string;
  subject: string;
  chapterNumber: number;
  name: string;
  code: string;
  term: string;
  boardReference: string;
  syllabusUrl: string;
  status: 'Active' | 'Inactive';
  allocatedPeriods: number;
  scheduledMonthFrom: string;
  scheduledMonthTo: string;
  expectedStartDate: string;
  expectedEndDate: string;
  bufferPeriods: number;
  introduction: string;
  keyConcepts: string;
  keyVocabulary: string;
  ncertExercises: string;
  importantFormulas: string;
  commonMisconceptions: string;
  realLifeConnection: string;
  teachingMethods: string[];
  hasLab: boolean;
  labDescription: string;
  labPeriods: number;
  labRoom: string;
  labGroupSize: number;
  avResources: string;
  fieldTripRequired: boolean;
  fieldTripDetails: string;
  classTestAtEnd: boolean;
  testType: string;
  testMarks: number;
  assignment: boolean;
  assignmentDetails: string;
  boardExamMarks: number;
  highImportanceTopics: string;
  questionTypes: string[];
  connectedSubjects: string;
  connectionDetails: string;
  cocurricularIntegration: string;
  completionPercent: number;
  topics: CurriculumTopic[];
}

export interface LearningObjectiveRecord {
  id: string;
  className: string;
  subject: string;
  chapterId: string;
  chapterName: string;
  topicId: string;
  topicName: string;
  objectiveType: 'Knowledge' | 'Skill' | 'Attitude' | 'Application';
  statement: string;
  studentLanguage: string;
  bloomLevel: BloomLevel;
  actionVerb: string;
  measurableCriteria: string;
  howAssessed: string;
  questionType: string;
  marksWeightage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  linkedQuestions: string;
  ncertReference: string;
  boardGuidelineReference: string;
  previousClassConnection: string;
  nextClassConnection: string;
  crossSubjectConnection: string;
  competencyType: string;
  status: 'Defined' | 'Not yet defined';
}

export interface ResourceRecord {
  id: string;
  name: string;
  shortName: string;
  type: string;
  subjects: string;
  classes: string[];
  chapters: string;
  topics: string;
  learningObjectives: string;
  coverage: string;
  authorPublisher: string;
  editionYear: string;
  language: string;
  format: string;
  physicalLocation: string;
  libraryCatalogNo: string;
  copies: number;
  digitalFile: string;
  url: string;
  accessType: string;
  offlineAvailable: boolean;
  primarySupplementary: string;
  recommendedFor: string;
  whenToUse: string;
  estimatedTime: string;
  teacherNotes: string;
  studentInstructions: string;
  teacherRating: number;
  reviewComments: string;
  hodApproval: string;
  boardRecommended: string;
  alignedWithNEP: boolean;
  curriculumAligned: boolean;
  lastReviewedOn: string;
  cost: number;
  procuredThrough: string;
  addedBy: string;
  availability: 'Available in school' | 'Needs to be sourced' | 'Online only';
  status: 'Active' | 'Inactive';
  procurementRequested: boolean;
}

export interface AnnualTeachingPlanRecord {
  id: string;
  teacher: string;
  employeeId: string;
  department: string;
  className: string;
  sections: string;
  subject: string;
  planTitle: string;
  academicYear: string;
  createdDate: string;
  submittedDate: string;
  hodReviewDate: string;
  status: PlanStatus;
  completeness: number;
  periodsPerWeek: number;
  teachingWeeks: number;
  grossAvailablePeriods: number;
  examPeriods: number;
  periodicTestPeriods: number;
  revisionPeriods: number;
  labPeriods: number;
  bufferPeriods: number;
  netTeachingPeriods: number;
  curriculumPeriodsRequired: number;
  monthlyDistribution: Record<string, Record<string, number>>;
  difficultChapters: string;
  studentChallenges: string;
  integrationPlans: string;
  difficultConceptStrategy: string;
  remedialPlan: string;
  enrichmentPlan: string;
  cocurricularIntegration: string;
  submitTo: string;
  submissionNote: string;
  submissionDeadline: string;
  hodFeedback: string;
  principalViewed: boolean;
  reviewChecklist: Record<string, boolean>;
}

export interface MonthlyPlanPeriod {
  id: string;
  weekNumber: number;
  date: string;
  periodNumber: number;
  chapter: string;
  topic: string;
  subTopic: string;
  teachingMethod: string;
  resources: string;
  expectedOutcome: string;
  status: PeriodStatus;
  reason: string;
  movedToDate: string;
  understanding: string;
  note: string;
}
export interface MonthlyTeachingPlanRecord {
  id: string;
  teacher: string;
  className: string;
  section: string;
  subject: string;
  month: string;
  year: string;
  linkedAtpId: string;
  chaptersToCover: string;
  totalPeriodsAvailable: number;
  totalPeriodsPlanned: number;
  bufferPeriods: number;
  periods: MonthlyPlanPeriod[];
  testDates: string;
  labDates: string;
  revisionDates: string;
  assignmentDueDates: string;
  holidayImpact: string;
  topicsCarryingOver: string;
  studentObservation: string;
  resourcesWorked: string;
  resourcesNotWorked: string;
  significantEvents: string;
  submitTo: string;
  submittedDate: string;
  hodName: string;
  hodFeedback: string;
  hodReviewedOn: string;
  status: 'Draft' | 'Submitted' | 'HOD Viewed';
  completionPercent: number;
}

export interface WeeklyTeachingItem {
  id: string;
  teacher: string;
  department: string;
  className: string;
  section: string;
  subject: string;
  date: string;
  day: string;
  periodNumber: number;
  time: string;
  chapter: string;
  topic: string;
  room: string;
  status: PeriodStatus;
  substitute: string;
  substitutionReason?: string;
  type: 'Lesson' | 'Test' | 'Lab' | 'Special Activity';
  planSubmitted: boolean;
}

export interface LessonProcedurePhase {
  id: string;
  phase: string;
  minutes: number;
  teacherActivity: string;
  studentActivity: string;
  questions: string;
  resources: string;
  checkUnderstanding: string;
}
export interface LessonPlanRecord {
  id: string;
  teacher: string;
  employeeId: string;
  className: string;
  section: string;
  subject: string;
  date: string;
  periodNumber: number;
  periodTime: string;
  durationMinutes: number;
  room: string;
  chapter: string;
  topic: string;
  subTopic: string;
  title: string;
  isContinuation: boolean;
  previousLessonId: string;
  linkedMonthlyPlan: string;
  objectives: TopicLearningObjective[];
  priorKnowledge: string;
  previousRecap: string;
  hookQuestion: string;
  realLifeConnection: string;
  misconceptions: string;
  procedure: LessonProcedurePhase[];
  boardWork: string;
  projectorPpt: string;
  videoLink: string;
  physicalDemo: string;
  labExperiment: string;
  modelChart: string;
  worksheet: string;
  textbookPages: string;
  digitalToolUrl: string;
  differentiation: Record<string, string>;
  homeworkAssigned: boolean;
  homeworkType: string;
  homeworkDescription: string;
  textbookReference: string;
  dueDate: string;
  estimatedHomeworkTime: string;
  classworkDone: string;
  homeworkGrading: string;
  assessmentMethod: string;
  assessmentQuestions: string;
  expectedResponses: string;
  understandingTracking: string;
  reteachAction: string;
  completion: string;
  topicsNotCovered: string;
  incompleteReason: string;
  studentEngagement: string;
  studentUnderstanding: string;
  whatWorkedWell: string;
  whatToImprove: string;
  carryForwardNote: string;
  homeworkCheck: string;
  notableStudents: string;
  status: LessonStatus;
  submitToHod: boolean;
  hodName: string;
  submissionNote: string;
  urgent: boolean;
  hodFeedback: string;
  createdAt: string;
}

export const newPlanningId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
export function loadPlanningCollection<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try { const saved = window.localStorage.getItem(key); if (!saved) return fallback; const parsed = JSON.parse(saved); return Array.isArray(parsed) ? parsed as T[] : fallback; }
  catch { return fallback; }
}
export function savePlanningCollection<T>(key: string, records: T[]): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, JSON.stringify(records)); } catch (error) { console.warn('Academic planning data could not be saved in this browser.', error); }
}
export function downloadPlanningCsv(filename: string, rows: Array<Record<string, string | number | boolean>>): void {
  if (typeof window === 'undefined' || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const quote = (value: string | number | boolean | null | undefined) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(quote).join(','), ...rows.map((row) => headers.map((key) => quote(row[key])).join(','))].join('\r\n');
  const link = document.createElement('a'); const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
}

const blankTopic = (chapterId = ''): CurriculumTopic => ({ id: newPlanningId('topic'), chapterId, number: '', name: '', code: '', hasSubtopics: false, subtopics: [], periods: 1, plannedWeek: '', hasRevisionPeriod: false, learningObjectives: [], textbookPages: '', referenceBooks: '', videoLinks: '', worksheets: '', labEquipment: '', digitalTools: '', expectedExamMarks: 0, questionTypes: [], difficulty: 'Medium', bloomLevel: 'Understand', commonlyConfusedWith: '', completionPercent: 0, status: 'Not Started' });
export const createBlankTopic = blankTopic;
export const createBlankChapter = (): CurriculumChapter => ({ id: newPlanningId('chapter'), academicYear: '2025-26', className: 'Class 10', subject: 'Science', chapterNumber: 1, name: '', code: '', term: 'Term 1', boardReference: '', syllabusUrl: '', status: 'Active', allocatedPeriods: 10, scheduledMonthFrom: 'April', scheduledMonthTo: 'May', expectedStartDate: '', expectedEndDate: '', bufferPeriods: 1, introduction: '', keyConcepts: '', keyVocabulary: '', ncertExercises: '', importantFormulas: '', commonMisconceptions: '', realLifeConnection: '', teachingMethods: ['Lecture', 'Discussion'], hasLab: false, labDescription: '', labPeriods: 0, labRoom: '', labGroupSize: 30, avResources: '', fieldTripRequired: false, fieldTripDetails: '', classTestAtEnd: true, testType: 'Written', testMarks: 20, assignment: true, assignmentDetails: '', boardExamMarks: 0, highImportanceTopics: '', questionTypes: ['MCQ', 'Short Answer'], connectedSubjects: '', connectionDetails: '', cocurricularIntegration: '', completionPercent: 0, topics: [] });
export const createBlankObjective = (): LearningObjectiveRecord => ({ id: newPlanningId('obj'), className: 'Class 10', subject: 'Science', chapterId: '', chapterName: '', topicId: '', topicName: '', objectiveType: 'Knowledge', statement: '', studentLanguage: '', bloomLevel: 'Understand', actionVerb: '', measurableCriteria: '', howAssessed: 'Written test', questionType: 'Short Answer', marksWeightage: 1, difficulty: 'Medium', linkedQuestions: '', ncertReference: '', boardGuidelineReference: '', previousClassConnection: '', nextClassConnection: '', crossSubjectConnection: '', competencyType: 'Critical Thinking', status: 'Defined' });
export const createBlankResource = (): ResourceRecord => ({ id: newPlanningId('resource'), name: '', shortName: '', type: 'Prescribed Textbook', subjects: '', classes: ['Class 10'], chapters: '', topics: '', learningObjectives: '', coverage: 'Full curriculum', authorPublisher: '', editionYear: '', language: 'English', format: 'Physical (Book)', physicalLocation: '', libraryCatalogNo: '', copies: 0, digitalFile: '', url: '', accessType: 'Free', offlineAvailable: true, primarySupplementary: 'Primary', recommendedFor: 'All students', whenToUse: 'Introduction', estimatedTime: '', teacherNotes: '', studentInstructions: '', teacherRating: 0, reviewComments: '', hodApproval: 'Pending', boardRecommended: 'No', alignedWithNEP: false, curriculumAligned: false, lastReviewedOn: '', cost: 0, procuredThrough: '', addedBy: 'Teacher', availability: 'Needs to be sourced', status: 'Active', procurementRequested: false });
export const createBlankAtp = (): AnnualTeachingPlanRecord => ({ id: newPlanningId('ATP'), teacher: 'Mr. R. Kumar', employeeId: 'EMP-1024', department: 'Science', className: 'Class 10', sections: 'A', subject: 'Science', planTitle: 'ATP — Class 10 Science — AY 2025-26', academicYear: '2025-26', createdDate: new Date().toISOString().slice(0, 10), submittedDate: '', hodReviewDate: '', status: 'Draft', completeness: 25, periodsPerWeek: 7, teachingWeeks: 38, grossAvailablePeriods: 266, examPeriods: 15, periodicTestPeriods: 12, revisionPeriods: 20, labPeriods: 0, bufferPeriods: 10, netTeachingPeriods: 209, curriculumPeriodsRequired: 245, monthlyDistribution: {}, difficultChapters: 'Chapter 11 Electricity; Chapter 4 Carbon and its Compounds', studentChallenges: 'Physics numericals, balancing chemical equations and ray diagrams', integrationPlans: 'Connect mathematics formulas to physics and chemistry problems', difficultConceptStrategy: 'Use demonstrations, guided worked examples and structured problem-solving practice.', remedialPlan: 'Small-group reteaching with printed notes and a follow-up skill check.', enrichmentPlan: 'Open-ended investigations and extension problems for advanced learners.', cocurricularIntegration: 'Art and Science model-making linked to optics and energy', submitTo: 'HOD — Science', submissionNote: '', submissionDeadline: '2025-04-15', hodFeedback: '', principalViewed: false, reviewChecklist: {} });
export const createBlankMonthlyPlan = (): MonthlyTeachingPlanRecord => ({ id: newPlanningId('MTP'), teacher: 'Mr. R. Kumar', className: 'Class 10', section: 'A', subject: 'Science', month: 'November', year: '2025', linkedAtpId: '', chaptersToCover: '', totalPeriodsAvailable: 20, totalPeriodsPlanned: 18, bufferPeriods: 2, periods: [], testDates: '', labDates: '', revisionDates: '', assignmentDueDates: '', holidayImpact: '', topicsCarryingOver: '', studentObservation: '', resourcesWorked: '', resourcesNotWorked: '', significantEvents: '', submitTo: 'HOD — Science', submittedDate: '', hodName: 'HOD — Science', hodFeedback: '', hodReviewedOn: '', status: 'Draft', completionPercent: 0 });
export const createBlankMonthlyPeriod = (): MonthlyPlanPeriod => ({ id: newPlanningId('week'), weekNumber: 1, date: '', periodNumber: 1, chapter: '', topic: '', subTopic: '', teachingMethod: 'Discussion', resources: '', expectedOutcome: '', status: 'Planned', reason: '', movedToDate: '', understanding: 'Good', note: '' });
const blankPhase = (phase: string, minutes: number): LessonProcedurePhase => ({ id: newPlanningId('phase'), phase, minutes, teacherActivity: '', studentActivity: '', questions: '', resources: '', checkUnderstanding: '' });
export const createBlankLesson = (): LessonPlanRecord => ({ id: newPlanningId('LP'), teacher: 'Mr. R. Kumar', employeeId: 'EMP-1024', className: 'Class 10', section: 'A', subject: 'Science', date: '', periodNumber: 1, periodTime: '09:30–10:15 AM', durationMinutes: 45, room: 'Room 10A', chapter: '', topic: '', subTopic: '', title: '', isContinuation: false, previousLessonId: '', linkedMonthlyPlan: '', objectives: [], priorKnowledge: '', previousRecap: '', hookQuestion: '', realLifeConnection: '', misconceptions: '', procedure: [blankPhase('Introduction / Hook', 5), blankPhase('Concept Development', 15), blankPhase('Examples & Application', 10), blankPhase('Checking Understanding', 10), blankPhase('Closure & Summary', 5)], boardWork: '', projectorPpt: '', videoLink: '', physicalDemo: '', labExperiment: '', modelChart: '', worksheet: '', textbookPages: '', digitalToolUrl: '', differentiation: { 'Advanced Students': '', 'Struggling Students': '', 'English Language Learners': '', 'Special Needs': '', 'Kinesthetic Learners': '', 'Visual Learners': '' }, homeworkAssigned: false, homeworkType: 'Practice', homeworkDescription: '', textbookReference: '', dueDate: '', estimatedHomeworkTime: '', classworkDone: '', homeworkGrading: 'No', assessmentMethod: 'Exit ticket', assessmentQuestions: '', expectedResponses: '', understandingTracking: '', reteachAction: 'Reteach next period', completion: 'Planned', topicsNotCovered: '', incompleteReason: '', studentEngagement: 'Good', studentUnderstanding: 'Most understood', whatWorkedWell: '', whatToImprove: '', carryForwardNote: '', homeworkCheck: '', notableStudents: '', status: 'Draft', submitToHod: false, hodName: 'HOD — Science', submissionNote: '', urgent: false, hodFeedback: '', createdAt: new Date().toISOString().slice(0, 10) });

const topic = (chapterId: string, number: string, name: string, periods: number, completionPercent: number, objectives: string[] = []): CurriculumTopic => ({ ...blankTopic(chapterId), number, name, code: `TP-${number.replace(/\./g, '-')}`, periods, completionPercent, status: completionPercent === 100 ? 'Complete' : completionPercent > 0 ? 'In Progress' : 'Not Started', learningObjectives: objectives.map((statement, index) => ({ id: `obj-${number}-${index + 1}`, statement, bloomLevel: index ? 'Apply' : 'Understand' })) });
const subtopic = (number: string, name: string, periods: number, teachingNotes = ''): CurriculumSubTopic => ({ id: `sub-${number.replace(/\./g, '-')}`, number, name, periods, teachingNotes });
const topicWithSubtopics = (chapterId: string, number: string, name: string, periods: number, completionPercent: number, objectives: string[], subtopics: CurriculumSubTopic[]): CurriculumTopic => ({ ...topic(chapterId, number, name, periods, completionPercent, objectives), hasSubtopics: true, subtopics });
const chapter = (id: string, className: string, subject: string, chapterNumber: number, name: string, term: string, allocatedPeriods: number, from: string, to: string, completionPercent: number, topics: CurriculumTopic[]): CurriculumChapter => ({ ...createBlankChapter(), id, className, subject, chapterNumber, name, code: `CH-${className.replace(/\D/g, '') || '00'}-${subject.slice(0, 3).toUpperCase()}-${String(chapterNumber).padStart(2, '0')}`, term, boardReference: `NCERT ${className} ${subject} · Chapter ${chapterNumber}`, allocatedPeriods, scheduledMonthFrom: from, scheduledMonthTo: to, expectedStartDate: '2025-04-07', expectedEndDate: '2025-06-30', completionPercent, topics: topics.map((item) => ({ ...item, chapterId: id })) });
const class10ScienceChapter = (number: number, name: string, term: string, periods: number, from: string, to: string, completion: number, topics: CurriculumTopic[] = []) => chapter(`ch-10-sci-${String(number).padStart(2, '0')}`, 'Class 10', 'Science', number, name, term, periods, from, to, completion, topics.map((item) => ({ ...item, textbookPages: item.textbookPages || `NCERT Science Class 10 · Chapter ${number}`, referenceBooks: item.referenceBooks || 'NCERT Exemplar', worksheets: item.worksheets || `Science practice sheet · Chapter ${number}`, digitalTools: item.digitalTools || 'DIKSHA digital learning resource' })));

export const DEFAULT_CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  class10ScienceChapter(1, 'Chemical Reactions & Equations', 'Term 1', 15, 'April', 'April', 100, [topicWithSubtopics('ch-10-sci-01', '1.1', 'Chemical Equations — Introduction', 3, 100, ['Represent a chemical reaction with a word and balanced equation'], [subtopic('1.1.1', 'Word and skeletal equations', 1), subtopic('1.1.2', 'Symbols and state labels', 2)]), topicWithSubtopics('ch-10-sci-01', '1.2', 'Balancing Chemical Equations', 4, 100, ['Balance equations using conservation of mass'], [subtopic('1.2.1', 'Atom count and coefficients', 1), subtopic('1.2.2', 'Balancing by inspection', 3)]), topicWithSubtopics('ch-10-sci-01', '1.3', 'Types of Chemical Reactions', 5, 100, ['Classify combination, decomposition, displacement and exchange reactions'], [subtopic('1.3.1', 'Combination and decomposition', 2), subtopic('1.3.2', 'Displacement reactions', 1), subtopic('1.3.3', 'Double displacement reactions', 2)]), topicWithSubtopics('ch-10-sci-01', '1.4', 'Effects of Oxidation in Daily Life', 3, 100, ['Explain corrosion and rancidity with everyday examples'], [subtopic('1.4.1', 'Corrosion', 2), subtopic('1.4.2', 'Rancidity', 1)])]),
  class10ScienceChapter(2, 'Acids, Bases and Salts', 'Term 1', 18, 'April', 'May', 100, [topic('ch-10-sci-02', '2.1', 'Understanding Acids and Bases', 4, 100, ['Identify acids and bases by properties and indicators']), topic('ch-10-sci-02', '2.2', 'What Do All Acids and Bases Have in Common?', 5, 100, ['Explain the role of ions in acidic and basic solutions']), topic('ch-10-sci-02', '2.3', 'Strength of Acid or Base Solutions', 4, 100, ['Compare solution strength using pH']), topic('ch-10-sci-02', '2.4', 'Importance of pH in Everyday Life', 3, 100, ['Apply pH concepts to soil, digestion and stings']), topic('ch-10-sci-02', '2.5', 'Salts and Their Properties', 2, 100, ['Describe the properties and uses of salts'])]),
  class10ScienceChapter(3, 'Metals and Non-metals', 'Term 1', 16, 'May', 'May', 100, [topic('ch-10-sci-03', '3.1', 'Physical Properties', 3, 100, ['Compare the physical properties of metals and non-metals']), topic('ch-10-sci-03', '3.2', 'Chemical Properties of Metals', 5, 100, ['Describe how metals react with oxygen, water and acids']), topic('ch-10-sci-03', '3.3', 'How Metals and Non-metals React', 4, 100, ['Explain metal and non-metal reactions using electron transfer']), topic('ch-10-sci-03', '3.4', 'Occurrence of Metals', 4, 100, ['Describe occurrence and extraction of common metals'])]),
  class10ScienceChapter(4, 'Carbon and its Compounds', 'Term 1', 15, 'May', 'June', 100),
  class10ScienceChapter(5, 'Life Processes', 'Term 1', 20, 'June', 'August', 100),
  class10ScienceChapter(6, 'Control and Coordination', 'Term 1', 18, 'July', 'August', 100),
  class10ScienceChapter(7, 'How do Organisms Reproduce?', 'Term 1', 16, 'August', 'September', 100),
  class10ScienceChapter(8, 'Heredity and Evolution', 'Term 1', 15, 'September', 'September', 100),
  class10ScienceChapter(9, 'Light—Reflection and Refraction', 'Term 2', 20, 'October', 'November', 50, [topicWithSubtopics('ch-10-sci-09', '9.1', 'Reflection of Light', 5, 100, ['State and apply the laws of reflection'], [subtopic('9.1.1', 'Laws of reflection', 2), subtopic('9.1.2', 'Ray diagrams', 3)]), topicWithSubtopics('ch-10-sci-09', '9.2', 'Spherical Mirrors', 5, 100, ['Explain image formation by spherical mirrors'], [subtopic('9.2.1', 'Image formation by mirrors', 3), subtopic('9.2.2', 'Mirror formula and magnification', 2)]), topicWithSubtopics('ch-10-sci-09', '9.3', 'Refraction of Light', 5, 0, ['State the laws of refraction and define refractive index'], [subtopic('9.3.1', 'What is refraction?', 1), subtopic('9.3.2', 'Laws of refraction', 1), subtopic('9.3.3', 'Refractive index', 1), subtopic('9.3.4', 'Refraction through a glass slab', 1), subtopic('9.3.5', 'Numericals practice', 1)]), topicWithSubtopics('ch-10-sci-09', '9.4', 'Lenses and Magnification', 5, 0, ['Calculate magnification and construct lens ray diagrams'], [subtopic('9.4.1', 'Lens image formation', 2), subtopic('9.4.2', 'Lens formula and power', 3)])]),
  class10ScienceChapter(10, 'Human Eye and Colourful World', 'Term 2', 12, 'November', 'November', 0),
  class10ScienceChapter(11, 'Electricity', 'Term 2', 22, 'November', 'December', 0),
  class10ScienceChapter(12, 'Magnetic Effects of Electric Current', 'Term 2', 16, 'December', 'December', 0),
  class10ScienceChapter(13, 'Our Environment', 'Term 2', 10, 'January', 'January', 0),
  class10ScienceChapter(14, 'Management of Natural Resources', 'Term 2', 10, 'January', 'February', 0),
  class10ScienceChapter(15, 'Periodic Classification of Elements', 'Term 2', 10, 'February', 'February', 0),
  class10ScienceChapter(16, 'Sources of Energy', 'Term 2', 12, 'February', 'March', 0),
  chapter('ch-10-math-01', 'Class 10', 'Mathematics', 1, 'Real Numbers', 'Term 1', 16, 'April', 'May', 82, [topic('ch-10-math-01', '1.1', 'Euclid’s division lemma', 6, 100), topic('ch-10-math-01', '1.2', 'Fundamental theorem of arithmetic', 5, 80), topic('ch-10-math-01', '1.3', 'Irrational numbers', 5, 60)]),
  chapter('ch-10-eng-01', 'Class 10', 'English', 1, 'A Letter to God', 'Term 1', 12, 'April', 'May', 35, [topic('ch-10-eng-01', '1.1', 'Reading and comprehension', 4, 50), topic('ch-10-eng-01', '1.2', 'Character and theme', 4, 25), topic('ch-10-eng-01', '1.3', 'Written response', 4, 25)]),
  chapter('ch-8-sci-03', 'Class 8', 'Science', 3, 'Coal and Petroleum', 'Term 1', 14, 'June', 'July', 28, [topic('ch-8-sci-03', '3.1', 'Natural resources', 4, 50), topic('ch-8-sci-03', '3.2', 'Fossil fuels', 5, 20), topic('ch-8-sci-03', '3.3', 'Conservation', 5, 10)])
];

export const DEFAULT_LEARNING_OBJECTIVES: LearningObjectiveRecord[] = [
  { ...createBlankObjective(), id: 'obj-seed-1', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-01', chapterName: 'Chemical Reactions & Equations', topicId: 'topic-1', topicName: 'Chemical equations', objectiveType: 'Knowledge', statement: 'Balance and classify chemical reactions using evidence from a reaction equation.', studentLanguage: 'I can balance a reaction equation and identify its reaction type.', bloomLevel: 'Apply', actionVerb: 'Balance and classify', measurableCriteria: 'Accurately balance and classify 4 of 5 reactions.', howAssessed: 'Written test', questionType: 'Numerical', marksWeightage: 10, difficulty: 'Medium', ncertReference: 'NCERT p. 6–8', competencyType: 'Scientific reasoning', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-2', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-02', chapterName: 'Acids, Bases and Salts', topicId: 'topic-2', topicName: 'pH scale and indicators', objectiveType: 'Application', statement: 'Predict the products and pH outcome of an acid-base neutralisation reaction.', studentLanguage: 'I can predict what forms when an acid reacts with a base.', bloomLevel: 'Analyse', actionVerb: 'Predict', measurableCriteria: 'Predict and justify the outcome of 4 of 5 neutralisation examples.', howAssessed: 'Written test', questionType: 'Short Answer', marksWeightage: 10, difficulty: 'Medium', ncertReference: 'NCERT p. 18–21', competencyType: 'Critical thinking', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-3', className: 'Class 10', subject: 'Mathematics', chapterId: 'ch-10-math-01', chapterName: 'Real Numbers', topicName: 'Euclid’s division lemma', objectiveType: 'Skill', statement: 'Apply Euclid’s division algorithm to determine the HCF of two integers.', studentLanguage: 'I can find an HCF using repeated division.', bloomLevel: 'Apply', actionVerb: 'Apply', measurableCriteria: 'Show accurate steps for 3 of 4 problems.', howAssessed: 'Written test', questionType: 'Numerical', marksWeightage: 3, difficulty: 'Medium', competencyType: 'Problem solving', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-4', className: 'Class 10', subject: 'English', chapterId: 'ch-10-eng-01', chapterName: 'A Letter to God', topicName: 'Reading and comprehension', objectiveType: 'Knowledge', statement: 'Infer a character’s feelings using textual evidence.', studentLanguage: 'I can explain how a character feels and point to the words that show it.', bloomLevel: 'Understand', actionVerb: 'Infer', measurableCriteria: 'Support an inference with two details from the text.', howAssessed: 'In-class Q&A', questionType: 'Short Answer', marksWeightage: 2, difficulty: 'Easy', competencyType: 'Communication', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-5', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-03', chapterName: 'Metals and Non-metals', topicName: 'Chemical Properties of Metals', objectiveType: 'Knowledge', statement: 'Explain the reactivity series and describe how it predicts the behaviour of metals.', studentLanguage: 'I can explain what the reactivity series tells us about metals.', bloomLevel: 'Understand', actionVerb: 'Explain', measurableCriteria: 'Explain and order at least 6 metals correctly.', howAssessed: 'Written test', questionType: 'Short Answer', marksWeightage: 8, difficulty: 'Medium', ncertReference: 'NCERT · Metals and Non-metals', competencyType: 'Scientific reasoning', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-6', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-09', chapterName: 'Light—Reflection and Refraction', topicName: 'Spherical Mirrors', objectiveType: 'Application', statement: 'Solve mirror and lens problems using ray diagrams and the relevant optical formula.', studentLanguage: 'I can choose an optical formula and solve a mirror or lens problem.', bloomLevel: 'Apply', actionVerb: 'Solve', measurableCriteria: 'Solve 4 of 5 mirror and lens problems with correct working.', howAssessed: 'Written test', questionType: 'Numerical', marksWeightage: 12, difficulty: 'Medium', ncertReference: 'NCERT · Light', competencyType: 'Problem solving', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-7', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-11', chapterName: 'Electricity', topicName: 'Ohm’s Law and electrical circuits', objectiveType: 'Application', statement: 'Apply Ohm’s Law to calculate current, voltage or resistance in a simple circuit.', studentLanguage: 'I can use Ohm’s Law to solve an electrical-circuit problem.', bloomLevel: 'Apply', actionVerb: 'Apply', measurableCriteria: 'Solve circuit calculations accurately and show units.', howAssessed: 'Written test', questionType: 'Numerical', marksWeightage: 12, difficulty: 'Hard', ncertReference: 'NCERT · Electricity', competencyType: 'Critical Thinking', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-8', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-15', chapterName: 'Periodic Classification of Elements', topicName: 'Groups and periods', objectiveType: 'Knowledge', statement: 'Recall how elements are arranged into groups and periods in the modern periodic table.', studentLanguage: 'I can identify a group and a period in the periodic table.', bloomLevel: 'Remember', actionVerb: 'Identify', measurableCriteria: 'Correctly identify the position of 8 of 10 elements.', howAssessed: 'Written test', questionType: 'MCQ', marksWeightage: 2, difficulty: 'Easy', ncertReference: 'NCERT · Periodic Classification', competencyType: 'Scientific Inquiry', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-9', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-12', chapterName: 'Magnetic Effects of Electric Current', topicName: 'Electromagnets', objectiveType: 'Skill', statement: 'Design and explain a safe electromagnet investigation by changing one variable at a time.', studentLanguage: 'I can plan a fair test to find what makes an electromagnet stronger.', bloomLevel: 'Create', actionVerb: 'Design', measurableCriteria: 'Include a testable question, controlled variables and a labelled setup.', howAssessed: 'Project', questionType: 'Practical', marksWeightage: 5, difficulty: 'Hard', ncertReference: 'NCERT · Magnetic Effects', competencyType: 'Creativity', status: 'Defined' },
  { ...createBlankObjective(), id: 'obj-seed-10', className: 'Class 10', subject: 'Science', chapterId: 'ch-10-sci-10', chapterName: 'Human Eye and Colourful World', topicName: 'Vision defects', objectiveType: 'Knowledge', statement: 'Explain how a corrective lens helps form a clear image for a common vision defect.', studentLanguage: 'I can match a vision defect to the lens used to correct it.', bloomLevel: 'Understand', actionVerb: 'Explain', measurableCriteria: 'Match and explain at least 3 common defects and corrections.', howAssessed: 'In-class Q&A', questionType: 'Short Answer', marksWeightage: 3, difficulty: 'Medium', competencyType: 'Scientific reasoning', status: 'Defined' }
];

export const DEFAULT_RESOURCES: ResourceRecord[] = [
  { ...createBlankResource(), id: 'res-1', name: 'NCERT Science Textbook Class 10', shortName: 'NCERT Science 10', type: 'Prescribed Textbook', subjects: 'Science', classes: ['Class 10'], chapters: 'Chemical Reactions & Equations; Light—Reflection and Refraction; Electricity', authorPublisher: 'NCERT', editionYear: '2025', format: 'Physical (Book)', physicalLocation: 'Library · Shelf S-10', libraryCatalogNo: 'LIB-SCI-10-041', copies: 180, cost: 0, availability: 'Available in school', primarySupplementary: 'Primary', status: 'Active', boardRecommended: 'Yes — CBSE', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-2', name: 'NCERT Exemplar — Science Class 10', shortName: 'NCERT Exemplar', type: 'Reference Book', subjects: 'Science', classes: ['Class 10'], chapters: 'Chemical Reactions & Equations; Light—Reflection and Refraction; Electricity', authorPublisher: 'NCERT', editionYear: '2025', format: 'Physical (Book)', physicalLocation: 'Science Department', copies: 42, availability: 'Available in school', primarySupplementary: 'Supplementary', boardRecommended: 'Yes — CBSE', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-3', name: 'Lakhmir Singh Physics Class 10', shortName: 'Lakhmir Singh Physics', type: 'Reference Book', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction; Electricity', authorPublisher: 'Lakhmir Singh & Manjit Kaur', editionYear: '2024', format: 'Physical (Book)', physicalLocation: 'Science Department', copies: 24, cost: 650, availability: 'Available in school', status: 'Active' },
  { ...createBlankResource(), id: 'res-4', name: 'NCERT Lab Manual — Science Class 10', shortName: 'Science Lab Manual', type: 'Lab Manual', subjects: 'Science', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction; Electricity', authorPublisher: 'NCERT', editionYear: '2025', format: 'Physical (Book)', physicalLocation: 'Science Lab', copies: 35, cost: 210, availability: 'Available in school', status: 'Active', procurementRequested: false },
  { ...createBlankResource(), id: 'res-5', name: 'DIKSHA App — Chapter 9 Refraction', shortName: 'DIKSHA Refraction', type: 'Digital Content (App)', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', url: 'https://diksha.gov.in/', format: 'Online URL', accessType: 'Free', offlineAvailable: false, availability: 'Online only', whenToUse: 'Concept development', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-6', name: 'Khan Academy — Light & Optics', shortName: 'Khan Academy Optics', type: 'Online Course / URL', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', url: 'https://www.khanacademy.org/science/physics/geometric-optics', format: 'Online URL', accessType: 'Free', offlineAvailable: false, availability: 'Online only', estimatedTime: '20 min', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-7', name: 'Refraction Animation (MP4)', shortName: 'Refraction Animation', type: 'Video', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', digitalFile: 'refraction-animation.mp4', format: 'Digital File', offlineAvailable: true, availability: 'Available in school', whenToUse: 'Demonstration', estimatedTime: '4 min', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-8', name: 'Mirror-Lens Worksheet', shortName: 'Mirror-Lens Worksheet', type: 'Worksheet', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', worksheets: 'mirror-lens-worksheet.pdf', format: 'Digital File', digitalFile: 'mirror-lens-worksheet.pdf', availability: 'Available in school', status: 'Active' },
  { ...createBlankResource(), id: 'res-9', name: 'Concave Mirror Lab Kit', shortName: 'Concave Mirror Kit', type: 'Lab Equipment', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', format: 'Both', physicalLocation: 'Physics Lab · Cabinet 4', copies: 12, availability: 'Available in school', whenToUse: 'Practical investigation', estimatedTime: '1 period', curriculumAligned: true },
  { ...createBlankResource(), id: 'res-10', name: 'Chapter 9 — Mind Map', shortName: 'Light chapter mind map', type: 'Visual Aid', subjects: 'Science, Physics', classes: ['Class 10'], chapters: 'Light—Reflection and Refraction', format: 'Digital File', digitalFile: 'class10-light-mind-map.pdf', offlineAvailable: true, availability: 'Available in school', whenToUse: 'Revision', recommendedFor: 'Revision / remedial support', studentInstructions: 'Use this visual guide to revise ray rules, formulas and image characteristics.', status: 'Active', curriculumAligned: true }
];

const atp = (id: string, teacher: string, employeeId: string, department: string, className: string, subject: string, status: PlanStatus, completeness: number, submittedDate = ''): AnnualTeachingPlanRecord => ({ ...createBlankAtp(), id, teacher, employeeId, department, className, subject, planTitle: `ATP — ${className} ${subject} — AY 2025-26`, createdDate: '2025-04-01', status, completeness, submittedDate, monthlyDistribution: { 'April': { 'Chemical Reactions & Equations': 15 }, 'May': { 'Acids, Bases and Salts': 10 }, 'June': { 'Acids, Bases and Salts': 8 } } });
export const DEFAULT_ATPS: AnnualTeachingPlanRecord[] = [
  { ...atp('atp-001', 'Mr. R. Kumar', 'EMP-1024', 'Science', 'Class 10', 'Science', 'HOD Approved', 100, '2025-04-18'), periodsPerWeek: 7, teachingWeeks: 38, grossAvailablePeriods: 266, examPeriods: 15, periodicTestPeriods: 12, revisionPeriods: 20, labPeriods: 0, bufferPeriods: 10, netTeachingPeriods: 209, curriculumPeriodsRequired: 245, monthlyDistribution: {
    'Chemical Reactions & Equations': { April: 15 }, 'Acids, Bases and Salts': { May: 10, June: 8 }, 'Metals and Non-metals': { June: 8, July: 8 }, 'Carbon and its Compounds': { August: 8, September: 7 }, 'Life Processes': { August: 8, September: 12 }, 'Control and Coordination': { September: 18 }, 'How do Organisms Reproduce?': { September: 16 }, 'Heredity and Evolution': { September: 15 }, 'Light—Reflection and Refraction': { October: 10, November: 10 }, 'Human Eye and Colourful World': { November: 12 }, Electricity: { November: 10, December: 12 }, 'Magnetic Effects of Electric Current': { December: 16 }, 'Our Environment': { January: 10 }, 'Management of Natural Resources': { January: 5, February: 5 }, 'Periodic Classification of Elements': { February: 10 }, 'Sources of Energy': { February: 6, March: 6 }
  } }, 
  atp('atp-002', 'Mrs. S. Joshi', 'EMP-1031', 'Science', 'Class 10', 'Chemistry', 'Submitted', 88, '2025-04-21'),
  atp('atp-003', 'Mr. V. Patel', 'EMP-1040', 'Mathematics', 'Class 10', 'Mathematics', 'HOD Approved', 100, '2025-04-16'),
  atp('atp-004', 'Ms. P. Roy', 'EMP-1083', 'Science', 'Class 8', 'Science', 'Returned', 74, '2025-04-22'),
  atp('atp-005', 'Mrs. P. Gupta', 'EMP-1028', 'Languages', 'Class 10', 'English', 'Draft', 52)
];

const novemberScienceTopics = [
  '9.1: Reflection of Light', '9.1: Laws of Reflection', '9.2: Spherical Mirrors — Introduction', '9.2: Types of Spherical Mirrors', '9.2: Image Formation — Mirror',
  '9.2: Mirror Formula', '9.2: Numericals Practice', '9.3: Refraction of Light', '9.3: Laws of Refraction', '9.3: Refractive Index',
  '9.4: Lenses — Introduction', '9.4: Image Formation in Lens', '9.4: Lens Formula + Power', 'Practical — Concave Mirror Lab', '9.4: Numericals',
  'Chapter 9 — Revision', 'Chapter 9 — Revision', 'Chapter 9 — Class Test', 'Ch.10: Human Eye — Introduction', 'Ch.10: Structure of Human Eye'
];
const novemberCompletedSlots = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
const novemberSciencePeriods: MonthlyPlanPeriod[] = novemberScienceTopics.map((topicName, index) => ({
  ...createBlankMonthlyPeriod(),
  id: `mtp-p${String(index + 1).padStart(2, '0')}`,
  weekNumber: Math.floor(index / 5) + 1,
  date: ['2025-11-03', '2025-11-05', '2025-11-06', '2025-11-07', '2025-11-08', '2025-11-10', '2025-11-11', '2025-11-13', '2025-11-14', '2025-11-15', '2025-11-17', '2025-11-19', '2025-11-20', '2025-11-21', '2025-11-22', '2025-11-24', '2025-11-26', '2025-11-27', '2025-11-28', '2025-11-29'][index],
  periodNumber: [3, 4, 2, 5, 3][index % 5],
  chapter: index >= 18 ? 'Human Eye and Colourful World' : 'Light—Reflection and Refraction',
  topic: topicName,
  subTopic: index < 5 ? 'Reflection and spherical mirrors' : index < 10 ? 'Refraction' : index < 15 ? 'Lenses and image formation' : index === 17 ? 'Chapter test' : 'Revision and human eye',
  teachingMethod: index === 13 ? 'Lab' : index === 15 || index === 16 ? 'Revision' : index === 17 ? 'Test' : index >= 18 ? 'Lecture' : 'Discussion',
  resources: index === 13 ? 'Concave mirror kit, candle, screen' : 'NCERT Science Class 10, ray diagrams and worksheet',
  expectedOutcome: `Explain and apply ${topicName.toLowerCase()} using a labelled diagram or worked example.`,
  status: novemberCompletedSlots.has(index) ? 'Completed' : 'Planned',
  understanding: novemberCompletedSlots.has(index) ? 'Good' : '—',
  note: novemberCompletedSlots.has(index) ? 'Learning check completed.' : 'Scheduled for this week.'
}));

export const DEFAULT_MONTHLY_PLANS: MonthlyTeachingPlanRecord[] = [
  { ...createBlankMonthlyPlan(), id: 'mtp-001', teacher: 'Mr. R. Kumar', className: 'Class 10', section: 'A', subject: 'Science', month: 'November', year: '2025', linkedAtpId: 'atp-001', chaptersToCover: 'Chapter 9 — Light—Reflection and Refraction; Chapter 10 — Human Eye and Colourful World', totalPeriodsAvailable: 20, totalPeriodsPlanned: 18, bufferPeriods: 2, submitTo: 'Mrs. P. Shah — HOD Science', submittedDate: '2025-11-24', hodName: 'Mrs. P. Shah', hodFeedback: '', hodReviewedOn: '', status: 'Submitted', completionPercent: 75, periods: novemberSciencePeriods, testDates: '27 Nov 2025 — Chapter 9 class test', labDates: '21 Nov 2025 — Concave mirror practical', revisionDates: '24 and 26 Nov 2025', assignmentDueDates: '28 Nov 2025', holidayImpact: 'One school event reduced the available period by one.', topicsCarryingOver: 'Chapter 10 Human Eye introduction and structure', studentObservation: 'Students are confident with reflection; continue guided practice on refraction numericals.' },
  { ...createBlankMonthlyPlan(), id: 'mtp-002', teacher: 'Mrs. S. Joshi', className: 'Class 10', section: 'A', subject: 'Chemistry', month: 'November', year: '2025', linkedAtpId: 'atp-002', chaptersToCover: 'Acids, Bases and Salts', totalPeriodsAvailable: 18, totalPeriodsPlanned: 18, bufferPeriods: 0, submitTo: 'Mrs. P. Shah — HOD Science', submittedDate: '2025-11-22', hodName: 'Mrs. P. Shah', hodFeedback: 'Use one additional guided practice lesson before the chapter test.', hodReviewedOn: '2025-11-28', status: 'HOD Viewed', completionPercent: 48 }
];

const weeklyDates = ['2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27', '2025-11-28', '2025-11-29'];
const weeklyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weeklyTimes = ['08:00–08:45', '08:45–09:30', '09:30–10:15', '10:15–11:00', '11:15–12:00', '12:00–12:45', '12:45–01:30', '01:30–02:15', '02:15–03:00'];
const weeklyPeriodsPerDay = [3, 3, 3, 2, 2, 2];
const weeklyClassSamples = [
  { teacher: 'Mr. R. Kumar', department: 'Science', className: 'Class 10', section: 'A', subject: 'Science', chapter: 'Light—Reflection and Refraction', room: 'Room 10A', topics: ['Chapter 9 Revision', 'Chapter 9 Revision', 'Chapter 9 Class Test', 'Chapter 10 Introduction', 'Chapter 10 — Human Eye', 'Numerical Practice'] },
  { teacher: 'Mrs. Singh', department: 'Mathematics', className: 'Class 10', section: 'A', subject: 'Mathematics', chapter: 'Polynomials', room: 'Room 10A', topics: ['Polynomials — Introduction', 'Types of Polynomials', 'Zeros of Polynomials', 'Graph Work', 'Application Problems', 'Problem Set'] },
  { teacher: 'Ms. Roy', department: 'Languages', className: 'Class 10', section: 'A', subject: 'English', chapter: 'Writing and Grammar', room: 'Room 10A', topics: ['Letter Writing', 'Comprehension Practice', 'Grammar — Tenses', 'Letter Writing', 'Speech Writing', 'Writing Practice'] }
];
export const DEFAULT_WEEKLY_PLANS: WeeklyTeachingItem[] = weeklyClassSamples.flatMap((sample, classIndex) => weeklyDates.flatMap((date, dayIndex) => Array.from({ length: weeklyPeriodsPerDay[dayIndex] }, (_, periodIndex) => {
  const completed = dayIndex < 3;
  const basePeriod = dayIndex < 3 ? classIndex * 3 : classIndex * 2;
  const periodNumber = basePeriod + periodIndex + 1;
  const topic = sample.topics[dayIndex];
  const isClassTest = classIndex === 0 && dayIndex === 2 && periodIndex === 0;
  return {
    id: `wk-${classIndex + 1}-${dayIndex + 1}-${periodIndex + 1}`,
    teacher: sample.teacher,
    department: sample.department,
    className: sample.className,
    section: sample.section,
    subject: sample.subject,
    date,
    day: weeklyDays[dayIndex],
    periodNumber,
    time: weeklyTimes[periodNumber - 1],
    chapter: sample.chapter,
    topic,
    room: isClassTest ? 'Exam Hall CR-101' : sample.room,
    status: completed ? 'Completed' as const : 'Planned' as const,
    substitute: '',
    type: isClassTest ? 'Test' as const : classIndex === 0 && periodIndex === 2 ? 'Lab' as const : 'Lesson' as const,
    planSubmitted: completed
  };
})));

const lesson = (id: string, teacher: string, className: string, subject: string, date: string, title: string, status: LessonStatus, chapterName: string, topicName: string): LessonPlanRecord => ({ ...createBlankLesson(), id, teacher, className, subject, date, title, status, chapter: chapterName, topic: topicName, createdAt: date, objectives: [{ id: `${id}-o1`, statement: `Explain ${topicName.toLowerCase()}.`, bloomLevel: 'Understand' }] });
export const DEFAULT_LESSON_PLANS: LessonPlanRecord[] = [
  { ...lesson('LP-2025-10A-SCI-089', 'Mr. R. Kumar', 'Class 10', 'Science', '2025-11-27', '9.3: Refraction of Light', 'Approved', 'Light—Reflection and Refraction', 'Refraction of Light'), section: 'A', periodNumber: 3, submitToHod: true, hodFeedback: 'Approved by HOD', whatWorkedWell: 'Ray diagrams and the glass-slab demonstration supported understanding.' },
  { ...lesson('LP-2025-10B-SCI-090', 'Mr. R. Kumar', 'Class 10', 'Science', '2025-11-27', '9.4: Lenses Introduction', 'Submitted', 'Light—Reflection and Refraction', 'Lenses and Magnification'), section: 'B', periodNumber: 5, submitToHod: true, submissionNote: 'Submitted for HOD review.' },
  { ...lesson('LP-2025-12A-PHY-091', 'Mr. R. Kumar', 'Class 12', 'Physics', '2025-11-27', 'Wave Optics — Diffraction', 'Approved', 'Wave Optics', 'Diffraction'), section: 'A', periodNumber: 7, submitToHod: true, hodFeedback: 'Approved by HOD' },
  { ...lesson('LP-2025-10C-SCI-092', 'Mr. R. Kumar', 'Class 10', 'Science', '2025-11-26', '9.2: Spherical Mirrors', 'Approved', 'Light—Reflection and Refraction', 'Spherical Mirrors'), section: 'C', periodNumber: 2, submitToHod: true, hodFeedback: 'Approved by HOD' },
  { ...lesson('LP-2025-12B-PHY-093', 'Mr. R. Kumar', 'Class 12', 'Physics', '2025-11-26', 'Electric Current — Basics', 'Approved', 'Electricity', 'Electric current'), section: 'B', periodNumber: 4, submitToHod: true, hodFeedback: 'Approved by HOD' },
  { ...lesson('LP-2025-10A-SCI-088', 'Mr. R. Kumar', 'Class 10', 'Science', '2025-11-25', '9.1: Reflection Laws', 'Approved', 'Light—Reflection and Refraction', 'Reflection of Light'), section: 'A', periodNumber: 3, submitToHod: true, hodFeedback: 'Approved by HOD' }
];
