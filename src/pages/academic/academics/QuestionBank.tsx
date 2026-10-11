import React, { useMemo, useState } from 'react';
import { ArchiveRestore, Archive, Copy, Download, Eye, FilePlus2, Pencil, Plus, Printer, RefreshCw, Save, Trash2, Wand2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ACADEMIC_PLANNING_KEYS, BLOOM_LEVELS, CLASSES, DEFAULT_CURRICULUM_CHAPTERS, PageHeader, SelectField, TextAreaField, TextField, CheckField, downloadPlanningCsv, loadPlanningCollection, savePlanningCollection, newPlanningId, type CurriculumChapter } from './academicPlanningData';
import { QUESTION_TYPES_BANK, REVIEW_KEYS, blankQuestion, buildSeedQuestions, formatShortDate, todayIso, type QuestionDifficulty, type QuestionPaperRecord, type QuestionRecord, type QuestionSource, type QuestionType } from './curriculumReviewData';

const DIFFICULTIES: QuestionDifficulty[] = ['Easy', 'Medium', 'Hard', 'Very Hard'];
const SOURCES: QuestionSource[] = ['NCERT Textbook', 'NCERT Exemplar', 'Board Previous Paper', 'Teacher Created', 'Reference Book', 'External'];
const MIN_QUESTIONS_PER_CHAPTER = 10;
const HIGHER_ORDER = ['Apply', 'Analyse', 'Evaluate'];

// Deterministic PRNG so "Regenerate" gives a new but repeatable paper for each seed.
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const shuffle = <T,>(items: T[], rand: () => number): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rand() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};
const statusOf = (question: QuestionRecord): 'Approved' | 'Draft' | 'Retired' => question.retired ? 'Retired' : question.hodReviewed ? 'Approved' : 'Draft';
const STATUS_TONE: Record<string, string> = { Approved: 'bg-green-100 text-green-700', Draft: 'bg-amber-100 text-amber-800', Retired: 'bg-gray-200 text-gray-600' };
const DIFF_TONE: Record<string, string> = { Easy: 'bg-green-100 text-green-700', Medium: 'bg-blue-100 text-blue-700', Hard: 'bg-orange-100 text-orange-700', 'Very Hard': 'bg-red-100 text-red-700' };

const emptyQuestion = (className: string, subject: string, chapter = ''): QuestionRecord => ({
  ...blankQuestion(className, subject),
  id: newPlanningId('Q'),
  chapter,
  addedOn: todayIso(),
  createdBy: 'Subject teacher'
});

export function QuestionBank() {
  const today = todayIso();
  const [questions, setQuestions] = useState<QuestionRecord[]>(() => loadPlanningCollection<QuestionRecord>(REVIEW_KEYS.questions, buildSeedQuestions(DEFAULT_CURRICULUM_CHAPTERS)));
  const [papers, setPapers] = useState<QuestionPaperRecord[]>(() => loadPlanningCollection<QuestionPaperRecord>(REVIEW_KEYS.papers, []));
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection<CurriculumChapter>(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [filters, setFilters] = useState({ className: 'Class 10', subject: 'Science', chapter: 'All Chapters', difficulty: 'All', bloom: 'All', type: 'All', source: 'All', status: 'All', search: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionRecord | null>(null);
  const [form, setForm] = useState<QuestionRecord>(() => emptyQuestion('Class 10', 'Science'));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [viewing, setViewing] = useState<QuestionRecord | null>(null);
  const [paperOpen, setPaperOpen] = useState(false);
  const [paperConfig, setPaperConfig] = useState({ title: 'Unit Test', className: 'Class 10', subject: 'Science', chapters: [] as string[], totalMarks: 40, durationMinutes: 90, easyPct: 30, mediumPct: 50, hardPct: 20, requireHigherOrder: true });
  const [paperSeed, setPaperSeed] = useState(1);
  const [paperIds, setPaperIds] = useState<string[]>([]);
  const [paperNotes, setPaperNotes] = useState<string[]>([]);
  const [toast, setToast] = useState('');

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500); };
  const persist = (next: QuestionRecord[]) => { setQuestions(next); savePlanningCollection(REVIEW_KEYS.questions, next); };

  const classOptions = CLASSES.filter((item) => questions.some((question) => question.className === item) || item === 'Class 10');
  const subjectOptions = [...new Set([...questions.map((question) => question.subject), ...chapters.map((chapter) => chapter.subject)])];
  const chapterOptionsFor = (className: string, subject: string) => [...new Set(chapters.filter((chapter) => chapter.className === className && chapter.subject === subject).map((chapter) => chapter.name))];
  const chapterNames = chapterOptionsFor(filters.className, filters.subject);

  const scoped = useMemo(() => questions.filter((question) => question.className === filters.className && question.subject === filters.subject), [questions, filters.className, filters.subject]);
  const visible = useMemo(() => scoped.filter((question) =>
    (filters.chapter === 'All Chapters' || question.chapter === filters.chapter) &&
    (filters.difficulty === 'All' || question.difficulty === filters.difficulty) &&
    (filters.bloom === 'All' || question.bloom === filters.bloom) &&
    (filters.type === 'All' || question.type === filters.type) &&
    (filters.source === 'All' || question.source === filters.source) &&
    (filters.status === 'All' || statusOf(question) === filters.status) &&
    (!filters.search || `${question.text} ${question.topic} ${question.id}`.toLowerCase().includes(filters.search.toLowerCase()))
  ), [scoped, filters]);

  // Stats
  const approvedCount = scoped.filter((question) => statusOf(question) === 'Approved').length;
  const retiredCount = scoped.filter((question) => question.retired).length;
  const draftCount = scoped.filter((question) => statusOf(question) === 'Draft').length;
  const difficultyCounts = DIFFICULTIES.map((level) => ({ level, count: scoped.filter((question) => question.difficulty === level && !question.retired).length }));
  const bloomCounts = BLOOM_LEVELS.map((level) => ({ level, count: scoped.filter((question) => question.bloom === level && !question.retired).length }));
  const statTotal = scoped.filter((question) => !question.retired).length;

  // Form validation
  const validate = (value: QuestionRecord): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!value.chapter) errors.chapter = 'Choose the chapter.';
    if (!value.text.trim()) errors.text = 'Enter the question text.';
    if (!value.modelAnswer.trim() && value.type !== 'MCQ' && value.type !== 'True-False') errors.modelAnswer = 'Enter a model answer.';
    if (value.type === 'MCQ') {
      const options = value.options.filter((option) => option.trim());
      if (options.length < 2) errors.options = 'MCQ needs at least two options.';
      if (!value.correctOption || !options.includes(value.correctOption)) errors.correctOption = 'Pick the correct option from the list.';
    }
    if (value.marks <= 0) errors.marks = 'Marks must be more than 0.';
    if (value.expectedMinutes <= 0) errors.expectedMinutes = 'Expected time must be more than 0 minutes.';
    return errors;
  };
  const duplicateWarning = (value: QuestionRecord): string => {
    const normalised = value.text.trim().toLowerCase();
    if (!normalised) return '';
    const match = questions.find((item) => item.id !== value.id && item.chapter === value.chapter && item.text.trim().toLowerCase() === normalised);
    return match ? `A question with the same text already exists in this chapter (${match.id}).` : '';
  };

  const openCreate = (chapter = '') => {
    setEditing(null);
    setForm(emptyQuestion(filters.className, filters.subject, chapter));
    setFormErrors({});
    setFormOpen(true);
  };
  const openEdit = (question: QuestionRecord) => {
    setEditing(question);
    setForm({ ...question, options: [...question.options] });
    setFormErrors({});
    setFormOpen(true);
  };
  const saveQuestion = (asApproved: boolean) => {
    const value = { ...form, hodReviewed: asApproved ? true : form.hodReviewed, options: form.type === 'MCQ' ? form.options.map((option) => option.trim()).filter(Boolean) : [] };
    const errors = validate(value);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    const next = editing ? questions.map((item) => item.id === editing.id ? value : item) : [value, ...questions];
    persist(next);
    setFormOpen(false);
    flash(editing ? 'Question updated.' : 'Question added to the bank.');
  };
  const duplicate = (question: QuestionRecord) => {
    persist([{ ...question, id: newPlanningId('Q'), hodReviewed: false, retired: false, usageCount: 0, lastUsed: '', performancePct: null, addedOn: today }, ...questions]);
    flash('Question duplicated as a draft.');
  };
  const toggleRetire = (question: QuestionRecord) => {
    persist(questions.map((item) => item.id === question.id ? { ...item, retired: !item.retired } : item));
    flash(question.retired ? 'Question restored to the bank.' : 'Question retired. It will not appear in new papers.');
  };
  const deleteQuestion = (question: QuestionRecord) => {
    if (question.usageCount > 0) { flash('This question has been used in tests. Retire it instead of deleting.'); return; }
    if (!window.confirm('Delete this question permanently?')) return;
    persist(questions.filter((item) => item.id !== question.id));
    flash('Question deleted.');
  };

  // Paper generation
  const paperEligible = useMemo(() => questions.filter((question) =>
    question.className === paperConfig.className && question.subject === paperConfig.subject && statusOf(question) === 'Approved' &&
    (paperConfig.chapters.length === 0 || paperConfig.chapters.includes(question.chapter))
  ), [questions, paperConfig]);

  const buildPaper = (seed: number) => {
    const rand = mulberry32(seed * 9973 + 7);
    const notes: string[] = [];
    const target = paperConfig.totalMarks;
    const plan: Array<{ level: QuestionDifficulty; pct: number }> = [
      { level: 'Easy', pct: paperConfig.easyPct }, { level: 'Medium', pct: paperConfig.mediumPct }, { level: 'Hard', pct: paperConfig.hardPct }
    ];
    const picked: QuestionRecord[] = [];
    let marks = 0;
    const pickFrom = (pool: QuestionRecord[], limit: number) => {
      let added = 0;
      for (const question of shuffle(pool, rand)) {
        if (added >= limit) break;
        if (picked.some((item) => item.id === question.id) || marks + question.marks > target) continue;
        picked.push(question);
        marks += question.marks;
        added += question.marks;
      }
      return added;
    };
    plan.forEach(({ level, pct }) => {
      const want = Math.round((target * pct) / 100);
      const pool = paperEligible.filter((question) => question.difficulty === level);
      const got = pickFrom(pool, want);
      if (got < want) notes.push(`${level}: ${want - got} mark(s) short. Only ${pool.length} approved question(s) available.`);
    });
    // Fill the remaining marks from anything eligible
    pickFrom(paperEligible, target - marks);
    if (marks < target) notes.push(`Paper is ${target - marks} mark(s) short of ${target}. Approve more questions to complete it.`);
    if (paperConfig.requireHigherOrder && !picked.some((question) => HIGHER_ORDER.includes(question.bloom))) notes.push('No Apply, Analyse or Evaluate question was selected. Add one from the bank.');
    setPaperIds(picked.map((question) => question.id));
    setPaperNotes(notes);
  };
  const openPaper = () => {
    setPaperSeed(1);
    setPaperConfig((state) => ({ ...state, chapters: [] }));
    setPaperIds([]);
    setPaperNotes([]);
    setPaperOpen(true);
  };
  const generate = () => {
    const totalPct = paperConfig.easyPct + paperConfig.mediumPct + paperConfig.hardPct;
    if (totalPct !== 100) { setPaperNotes([`Difficulty mix must add to 100% (now ${totalPct}%).`]); setPaperIds([]); return; }
    buildPaper(paperSeed);
  };
  const regenerate = () => { const next = paperSeed + 1; setPaperSeed(next); buildPaper(next); };
  const removeFromPaper = (id: string) => setPaperIds((items) => items.filter((item) => item !== id));
  const swapInPaper = (id: string) => {
    const current = questions.find((item) => item.id === id);
    if (!current) return;
    const replacement = paperEligible.find((item) => !paperIds.includes(item.id) && item.marks === current.marks && item.difficulty === current.difficulty);
    if (!replacement) { flash('No other approved question with the same marks and difficulty is available.'); return; }
    setPaperIds((items) => items.map((item) => item === id ? replacement.id : item));
  };
  const paperQuestions = paperIds.map((id) => questions.find((item) => item.id === id)).filter((item): item is QuestionRecord => Boolean(item));
  const paperTotal = paperQuestions.reduce((sum, question) => sum + question.marks, 0);
  const savePaper = () => {
    if (!paperQuestions.length) { flash('Generate a paper before saving.'); return; }
    const record: QuestionPaperRecord = { id: newPlanningId('QP'), title: paperConfig.title || 'Untitled paper', className: paperConfig.className, subject: paperConfig.subject, chapters: paperConfig.chapters, totalMarks: paperTotal, durationMinutes: paperConfig.durationMinutes, questionIds: paperIds, createdOn: today, status: 'Prepared' };
    const next = [record, ...papers];
    setPapers(next);
    savePlanningCollection(REVIEW_KEYS.papers, next);
    setPaperOpen(false);
    flash(`Paper saved as draft with ${paperQuestions.length} questions (${paperTotal} marks).`);
  };
  const exportPaper = () => downloadPlanningCsv(`${paperConfig.title.replace(/\s+/g, '-').toLowerCase() || 'paper'}.csv`, paperQuestions.map((question, index) => ({ No: index + 1, Chapter: question.chapter, Type: question.type, Difficulty: question.difficulty, Bloom: question.bloom, Marks: question.marks, Question: question.text })));

  // Gap analysis
  const gapRows = chapterNames.map((chapter) => {
    const mine = scoped.filter((question) => question.chapter === chapter && !question.retired && statusOf(question) === 'Approved');
    const count = (level: QuestionDifficulty) => mine.filter((question) => question.difficulty === level).length;
    const gaps: string[] = [];
    if (mine.length < MIN_QUESTIONS_PER_CHAPTER) gaps.push(`Add ${MIN_QUESTIONS_PER_CHAPTER - mine.length} more approved question(s)`);
    if (count('Hard') + count('Very Hard') === 0) gaps.push('No Hard questions');
    if (!mine.some((question) => question.bloom === 'Analyse' || question.bloom === 'Evaluate')) gaps.push('No Analyse/Evaluate questions');
    if (mine.length > 0 && mine.every((question) => question.usageCount === 0)) gaps.push('Bank never used for this chapter');
    return { chapter, easy: count('Easy'), medium: count('Medium'), hard: count('Hard'), veryHard: count('Very Hard'), total: mine.length, gaps };
  });

  const filterSet = (key: keyof typeof filters, value: string) => setFilters((state) => ({ ...state, [key]: value }));
  const update = <K extends keyof QuestionRecord>(key: K, value: QuestionRecord[K]) => setForm((state) => ({ ...state, [key]: value }));
  const err = (key: string) => formErrors[key] ? <p className="mt-1 text-xs text-red-600">{formErrors[key]}</p> : null;
  const dup = duplicateWarning(form);
  const formChapterOptions = chapterOptionsFor(form.className, form.subject);
  const topicOptions = (DEFAULT_CURRICULUM_CHAPTERS.find((chapter) => chapter.name === form.chapter && chapter.className === form.className && chapter.subject === form.subject)?.topics || []).map((topic) => topic.name);

  return (
    <div className="space-y-6">
      <PageHeader
        title="🧠 Question Bank"
        description="Build a reusable bank of questions, generate test papers, and find chapters with gaps."
        actions={<>
          <Button onClick={() => openCreate()}><Plus className="h-4 w-4" />Add Question</Button>
          <Button variant="outline" onClick={openPaper}><Wand2 className="h-4 w-4" />Generate Test Paper</Button>
          <Button variant="outline" onClick={() => downloadPlanningCsv('question-bank.csv', visible.map((question) => ({ ID: question.id, Chapter: question.chapter, Topic: question.topic, Type: question.type, Difficulty: question.difficulty, Bloom: question.bloom, Marks: question.marks, Status: statusOf(question), Source: question.source, Question: question.text, Usage: question.usageCount })))}><Download className="h-4 w-4" />Export</Button>
        </>} />

      {toast && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{toast}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-gray-500">Questions in scope</p><p className="mt-1 text-2xl font-bold text-gray-900">{statTotal}</p><p className="text-xs text-gray-500">{retiredCount} retired</p></Card>
        <Card><p className="text-xs text-gray-500">Approved</p><p className="mt-1 text-2xl font-bold text-green-700">{approvedCount}</p><p className="text-xs text-gray-500">{draftCount} drafts awaiting review</p></Card>
        <Card><p className="text-xs text-gray-500">Difficulty mix</p><p className="mt-1 text-sm text-gray-800">{difficultyCounts.map((item) => `${item.level} ${item.count}`).join(' · ')}</p></Card>
        <Card><p className="text-xs text-gray-500">Bloom coverage</p><p className="mt-1 text-sm text-gray-800">{bloomCounts.map((item) => `${item.level} ${item.count}`).join(' · ')}</p></Card>
      </div>

      {/* Filters and list */}
      <Card title={`Question List (${visible.length})`} noPadding headerAction={<div className="w-56"><TextField label="" value={filters.search} onChange={(value) => filterSet('search', value)} placeholder="Search text, topic or ID" /></div>}>
        <div className="grid grid-cols-2 gap-3 border-b border-gray-200 p-4 md:grid-cols-4 xl:grid-cols-8">
          <SelectField label="Class" value={filters.className} onChange={(value) => { setFilters((state) => ({ ...state, className: value, chapter: 'All Chapters' })); }} options={classOptions} />
          <SelectField label="Subject" value={filters.subject} onChange={(value) => { setFilters((state) => ({ ...state, subject: value, chapter: 'All Chapters' })); }} options={subjectOptions} />
          <SelectField label="Chapter" value={filters.chapter} onChange={(value) => filterSet('chapter', value)} options={['All Chapters', ...chapterNames]} />
          <SelectField label="Difficulty" value={filters.difficulty} onChange={(value) => filterSet('difficulty', value)} options={['All', ...DIFFICULTIES]} />
          <SelectField label="Bloom" value={filters.bloom} onChange={(value) => filterSet('bloom', value)} options={['All', ...BLOOM_LEVELS]} />
          <SelectField label="Type" value={filters.type} onChange={(value) => filterSet('type', value)} options={['All', ...QUESTION_TYPES_BANK]} />
          <SelectField label="Source" value={filters.source} onChange={(value) => filterSet('source', value)} options={['All', ...SOURCES]} />
          <SelectField label="Status" value={filters.status} onChange={(value) => filterSet('status', value)} options={['All', 'Approved', 'Draft', 'Retired']} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">ID</th><th className="px-3 py-3">Question</th><th className="px-3 py-3">Chapter / Topic</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Difficulty</th><th className="px-3 py-3">Bloom</th><th className="px-3 py-3">Marks</th><th className="px-3 py-3">Used</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((question) => (
                <tr key={question.id} className={question.retired ? 'opacity-60' : ''}>
                  <td className="px-3 py-3 text-xs text-gray-500">{question.id.slice(0, 12)}</td>
                  <td className="max-w-xs px-3 py-3 text-gray-900"><span className="line-clamp-2">{question.text || '—'}</span></td>
                  <td className="px-3 py-3 text-xs">{question.chapter}<br /><span className="text-gray-500">{question.topic}</span></td>
                  <td className="px-3 py-3 text-xs">{question.type}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFF_TONE[question.difficulty]}`}>{question.difficulty}</span></td>
                  <td className="px-3 py-3 text-xs">{question.bloom}</td>
                  <td className="px-3 py-3">{question.marks}</td>
                  <td className="px-3 py-3 text-xs">{question.usageCount}× {question.lastUsed ? `(${formatShortDate(question.lastUsed)})` : ''}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[statusOf(question)]}`}>{statusOf(question)}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <Button size="xs" variant="ghost" onClick={() => setViewing(question)} title="View"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="xs" variant="ghost" onClick={() => openEdit(question)} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="xs" variant="ghost" onClick={() => duplicate(question)} title="Duplicate"><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="xs" variant="ghost" onClick={() => toggleRetire(question)} title={question.retired ? 'Restore' : 'Retire'}>{question.retired ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}</Button>
                      <Button size="xs" variant="ghost" onClick={() => deleteQuestion(question)} title="Delete"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-500">No questions match these filters. Add one to start the bank.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gap analysis */}
      <Card title="Gap Analysis by Chapter" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Chapter</th><th className="px-3 py-3">Easy</th><th className="px-3 py-3">Medium</th><th className="px-3 py-3">Hard</th><th className="px-3 py-3">Very Hard</th><th className="px-3 py-3">Approved total</th><th className="px-3 py-3">Gaps</th><th className="px-3 py-3">Action</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {gapRows.map((row) => (
                <tr key={row.chapter}>
                  <td className="px-3 py-3 font-medium">{row.chapter}</td>
                  <td className="px-3 py-3">{row.easy}</td><td className="px-3 py-3">{row.medium}</td><td className="px-3 py-3">{row.hard}</td><td className="px-3 py-3">{row.veryHard}</td>
                  <td className="px-3 py-3">{row.total}</td>
                  <td className="px-3 py-3 text-xs">{row.gaps.length ? <span className="text-amber-800">⚠️ {row.gaps.join('; ')}</span> : <span className="text-green-700">✅ No gaps</span>}</td>
                  <td className="px-3 py-3"><Button size="xs" variant="outline" onClick={() => openCreate(row.chapter)}>Add questions</Button></td>
                </tr>
              ))}
              {gapRows.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No chapters for this class and subject.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {papers.length > 0 && (
        <Card title="Saved Papers">
          <ul className="space-y-2 text-sm">{papers.slice(0, 6).map((paper) => <li key={paper.id} className="flex justify-between rounded bg-gray-50 px-3 py-2"><span>{paper.title} · {paper.className} {paper.subject}</span><span className="text-gray-500">{paper.questionIds.length} questions · {paper.totalMarks} marks · {paper.status}</span></li>)}</ul>
        </Card>
      )}

      {/* Add / edit form */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Question' : 'Add Question'} size="xl"
        footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="outline" onClick={() => saveQuestion(false)}><Save className="h-4 w-4" />Save as Draft</Button><Button variant="primary" onClick={() => saveQuestion(true)}>Save and Approve</Button></div>}>
        <div className="space-y-6">
          {dup && <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {dup}</p>}
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">1. Classification</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SelectField label="Class" value={form.className} onChange={(value) => update('className', value)} options={CLASSES} />
              <SelectField label="Subject" value={form.subject} onChange={(value) => update('subject', value)} options={subjectOptions} />
              <div><SelectField label="Chapter" value={form.chapter} onChange={(value) => update('chapter', value)} options={[{ value: '', label: 'Select chapter' }, ...formChapterOptions]} />{err('chapter')}</div>
              <SelectField label="Topic" value={form.topic} onChange={(value) => update('topic', value)} options={[{ value: '', label: 'Select topic' }, ...topicOptions]} />
              <TextField label="Sub-topic" value={form.subTopic} onChange={(value) => update('subTopic', value)} />
              <SelectField label="Question type" value={form.type} onChange={(value) => update('type', value as QuestionType)} options={QUESTION_TYPES_BANK} />
            </div>
          </section>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">2. Question content</p>
            <div><TextAreaField label="Question text" value={form.text} onChange={(value) => update('text', value)} placeholder="Write the question as students will see it" />{err('text')}</div>
            {form.type === 'MCQ' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><TextAreaField label="Options (one per line)" value={form.options.join('\n')} onChange={(value) => update('options', value.split('\n'))} />{err('options')}</div>
                <div><SelectField label="Correct option" value={form.correctOption} onChange={(value) => update('correctOption', value)} options={[{ value: '', label: 'Select the correct option' }, ...form.options.map((option) => option.trim()).filter(Boolean)]} />{err('correctOption')}</div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <TextField label="Image or diagram (file name)" value={form.imageName} onChange={(value) => update('imageName', value)} />
              <TextField label="Formula (optional)" value={form.formula} onChange={(value) => update('formula', value)} />
              <div className="flex items-end"><CheckField label="All options correct (multi-answer)" checked={form.allCorrect} onChange={(value) => update('allCorrect', value)} /></div>
            </div>
          </section>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">3. Answer and marking</p>
            <div><TextAreaField label="Model answer" value={form.modelAnswer} onChange={(value) => update('modelAnswer', value)} />{err('modelAnswer')}</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextAreaField label="Key points" value={form.keyPoints} onChange={(value) => update('keyPoints', value)} />
              <TextAreaField label="Marking scheme" value={form.markingScheme} onChange={(value) => update('markingScheme', value)} />
              <TextAreaField label="Alternate answers" value={form.alternateAnswers} onChange={(value) => update('alternateAnswers', value)} />
              <TextAreaField label="Partial marks guidance" value={form.partialMarks} onChange={(value) => update('partialMarks', value)} />
            </div>
            <TextAreaField label="Solution steps" value={form.solutionSteps} onChange={(value) => update('solutionSteps', value)} />
          </section>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">4. Difficulty and marks</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <SelectField label="Difficulty" value={form.difficulty} onChange={(value) => update('difficulty', value as QuestionDifficulty)} options={DIFFICULTIES} />
              <SelectField label="Bloom level" value={form.bloom} onChange={(value) => update('bloom', value as QuestionRecord['bloom'])} options={BLOOM_LEVELS} />
              <div><TextField label="Marks" type="number" min={1} value={form.marks} onChange={(value) => update('marks', Number(value))} />{err('marks')}</div>
              <div><TextField label="Expected time (minutes)" type="number" min={1} value={form.expectedMinutes} onChange={(value) => update('expectedMinutes', Number(value))} />{err('expectedMinutes')}</div>
            </div>
            <p className="text-xs text-gray-500">Student performance: {form.performancePct === null ? 'not yet used in a test' : `${form.performancePct}% average`}</p>
          </section>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">5. Teaching insight</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextAreaField label="What it tests" value={form.whatItTests} onChange={(value) => update('whatItTests', value)} />
              <TextAreaField label="Common wrong answers" value={form.commonWrongAnswers} onChange={(value) => update('commonWrongAnswers', value)} />
              <TextAreaField label="Misconception" value={form.misconception} onChange={(value) => update('misconception', value)} />
              <TextAreaField label="Remediation" value={form.remediation} onChange={(value) => update('remediation', value)} />
              <TextAreaField label="Extension" value={form.extension} onChange={(value) => update('extension', value)} />
              <TextAreaField label="Simplification" value={form.simplification} onChange={(value) => update('simplification', value)} />
            </div>
          </section>
          <section className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">6. Source and quality</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SelectField label="Source" value={form.source} onChange={(value) => update('source', value as QuestionSource)} options={SOURCES} />
              <TextField label="Source reference" value={form.sourceRef} onChange={(value) => update('sourceRef', value)} />
              <TextField label="Source year" value={form.sourceYear} onChange={(value) => update('sourceYear', value)} />
              <TextField label="Created by" value={form.createdBy} onChange={(value) => update('createdBy', value)} />
              <TextField label="Copyright note" value={form.copyright} onChange={(value) => update('copyright', value)} />
              <div className="flex items-end gap-4"><CheckField label="HOD reviewed (approved)" checked={form.hodReviewed} onChange={(value) => update('hodReviewed', value)} /><CheckField label="Retired" checked={form.retired} onChange={(value) => update('retired', value)} /></div>
            </div>
          </section>
        </div>
      </Modal>

      {/* View */}
      <Modal isOpen={viewing !== null} onClose={() => setViewing(null)} title={viewing ? `Question ${viewing.id.slice(0, 12)}` : 'Question'} size="md" footer={<div className="flex justify-end"><Button variant="outline" onClick={() => setViewing(null)}>Close</Button></div>}>
        {viewing && <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{viewing.text}</p>
          {viewing.type === 'MCQ' && <ol className="list-[upper-alpha] pl-6 text-gray-700">{viewing.options.map((option) => <li key={option} className={option === viewing.correctOption ? 'font-semibold text-green-700' : ''}>{option}</li>)}</ol>}
          <p className="text-xs text-gray-600"><span className="font-medium">Model answer:</span> {viewing.modelAnswer || '—'}</p>
          <p className="text-xs text-gray-600">{viewing.chapter} · {viewing.type} · {viewing.difficulty} · {viewing.bloom} · {viewing.marks} marks · {viewing.source}</p>
        </div>}
      </Modal>

      {/* Paper generator */}
      <Modal isOpen={paperOpen} onClose={() => setPaperOpen(false)} title="Generate Test Paper" size="xl"
        footer={<div className="flex flex-wrap justify-between gap-2"><div className="flex gap-2"><Button variant="outline" onClick={regenerate} disabled={!paperIds.length}><RefreshCw className="h-4 w-4" />Regenerate</Button><Button variant="outline" onClick={exportPaper} disabled={!paperIds.length}><Download className="h-4 w-4" />Export</Button><Button variant="outline" onClick={() => window.print()} disabled={!paperIds.length}><Printer className="h-4 w-4" />Print</Button></div><div className="flex gap-2"><Button variant="outline" onClick={() => setPaperOpen(false)}>Close</Button><Button variant="primary" onClick={savePaper} disabled={!paperIds.length}><FilePlus2 className="h-4 w-4" />Save Paper</Button></div></div>}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2"><TextField label="Paper title" value={paperConfig.title} onChange={(value) => setPaperConfig((state) => ({ ...state, title: value }))} /></div>
            <SelectField label="Class" value={paperConfig.className} onChange={(value) => setPaperConfig((state) => ({ ...state, className: value, chapters: [] }))} options={classOptions} />
            <SelectField label="Subject" value={paperConfig.subject} onChange={(value) => setPaperConfig((state) => ({ ...state, subject: value, chapters: [] }))} options={subjectOptions} />
            <TextField label="Total marks" type="number" min={1} value={paperConfig.totalMarks} onChange={(value) => setPaperConfig((state) => ({ ...state, totalMarks: Number(value) }))} />
            <TextField label="Duration (minutes)" type="number" min={1} value={paperConfig.durationMinutes} onChange={(value) => setPaperConfig((state) => ({ ...state, durationMinutes: Number(value) }))} />
            <TextField label="Easy %" type="number" min={0} max={100} value={paperConfig.easyPct} onChange={(value) => setPaperConfig((state) => ({ ...state, easyPct: Number(value) }))} />
            <TextField label="Medium %" type="number" min={0} max={100} value={paperConfig.mediumPct} onChange={(value) => setPaperConfig((state) => ({ ...state, mediumPct: Number(value) }))} />
            <TextField label="Hard %" type="number" min={0} max={100} value={paperConfig.hardPct} onChange={(value) => setPaperConfig((state) => ({ ...state, hardPct: Number(value) }))} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-600">Chapters (none selected = all approved chapters)</p>
            <div className="flex flex-wrap gap-3">
              {chapterOptionsFor(paperConfig.className, paperConfig.subject).map((chapter) => (
                <label key={chapter} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={paperConfig.chapters.includes(chapter)} onChange={(event) => setPaperConfig((state) => ({ ...state, chapters: event.target.checked ? [...state.chapters, chapter] : state.chapters.filter((item) => item !== chapter) }))} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />{chapter}</label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <CheckField label="Require at least one Apply / Analyse / Evaluate question" checked={paperConfig.requireHigherOrder} onChange={(value) => setPaperConfig((state) => ({ ...state, requireHigherOrder: value }))} />
            <p className="text-xs text-gray-500">{paperEligible.length} approved question(s) eligible</p>
            <Button variant="primary" size="sm" onClick={generate}><Wand2 className="h-4 w-4" />Generate</Button>
          </div>
          {paperNotes.map((note) => <p key={note} className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">⚠️ {note}</p>)}
          {paperQuestions.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-gray-900">{paperQuestions.length} questions · {paperTotal} / {paperConfig.totalMarks} marks</span><span className="text-xs text-gray-500">Duration {paperConfig.durationMinutes} min</span></div>
              <ol className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {paperQuestions.map((question, index) => (
                  <li key={question.id} className="flex items-start gap-3 px-3 py-2 text-sm">
                    <span className="w-6 shrink-0 font-semibold text-gray-500">{index + 1}.</span>
                    <div className="flex-1"><p className="text-gray-900">{question.text}</p><p className="text-xs text-gray-500">{question.chapter} · {question.type} · {question.difficulty} · {question.bloom} · {question.marks} marks</p></div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="xs" variant="outline" onClick={() => swapInPaper(question.id)}>Swap</Button>
                      <Button size="xs" variant="ghost" onClick={() => removeFromPaper(question.id)}><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className="text-xs text-gray-500">Generation uses only approved, non-retired questions. Each Regenerate gives a new selection from the same pool.</p>
        </div>
      </Modal>
    </div>
  );
}

export default QuestionBank;
