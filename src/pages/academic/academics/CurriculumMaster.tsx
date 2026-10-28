import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, CloudUpload, Copy, Download, Edit3, Eye, FileText, Folder, GripVertical, Info, List, Lock, MoreVertical, Plus, RefreshCw, Search, Table2, Trash2, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ACADEMIC_PLANNING_KEYS, ACADEMIC_YEARS, CLASSES, DEFAULT_CURRICULUM_CHAPTERS, DEFAULT_LESSON_PLANS, DEFAULT_LEARNING_OBJECTIVES, DEFAULT_MONTHLY_PLANS, SUBJECTS, TERMS, createBlankChapter, createBlankTopic, downloadPlanningCsv, loadPlanningCollection, newPlanningId, savePlanningCollection, type CurriculumChapter, type CurriculumSubTopic, type CurriculumTopic } from './academicPlanningData';
import { CheckField, EmptyState, PageHeader, PlanningPanel, SelectField, StatusPill, TextAreaField, TextField } from './academicPlanningData';

const UPLOADS_KEY = 'k12-curriculum-uploads-v1';
const MATERIALS_KEY = 'k12-study-materials-v1';
const EXTRAS_KEY = 'k12-curriculum-node-extras-v1';
const MATERIAL_TYPES = ['Textbook', 'Notes', 'Worksheet', 'Question Bank', 'Reference Material', 'Other'] as const;

type NodeKind = 'chapter' | 'topic' | 'subtopic';
type TabId = 'structure' | 'upload';
type UploadPhase = 'idle' | 'queue' | 'processing' | 'results';
type MapStatus = 'matched' | 'review' | 'new';
type UploadStatus = 'Processed' | 'Partial' | 'Pending' | 'Failed';

interface NodeExtras { locked?: boolean }
interface AttachedMaterial { id: string; fileName: string; fileKind: string; size: string; className: string; subject: string; chapter: string; topic?: string }
interface UploadFile { id: string; name: string; size: string; sizeBytes: number; kind: 'PDF' | 'DOCX' | 'PPTX' | 'TXT'; progress: number }
interface DetectedRow { id: string; detected: string; matchLabel: string; matchId: string; status: MapStatus; action: 'map' | 'create' | 'skip' }
interface UploadRecord { id: string; fileName: string; className: string; subject: string; materialType: string; mapped: string; uploadDate: string; status: UploadStatus }

const codeForChapter = (chapter: CurriculumChapter) => `CH-${chapter.className.replace(/\D/g, '') || '00'}-${chapter.subject.slice(0, 3).toUpperCase()}-${String(chapter.chapterNumber).padStart(2, '0')}`;
const codeForTopic = (topic: CurriculumTopic) => `TP-${topic.number.trim().replace(/[^0-9.]+/g, '').replace(/\./g, '-') || 'NEW'}`;
const loadJson = <T,>(key: string, fallback: T): T => { try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const saveJson = (key: string, value: unknown) => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } };
const inputCls = 'h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none';
const field = (label: string, children: React.ReactNode) => <label className="block text-xs font-medium text-gray-600">{label}<div className="mt-1">{children}</div></label>;

export function CurriculumMaster() {
  const [chapters, setChapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [selectedClass, setSelectedClass] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('class') || 'Class 10' : 'Class 10');
  const [selectedSubject, setSelectedSubject] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('subject') || 'Science' : 'Science');
  const [termFilter, setTermFilter] = useState('All');
  const [view, setView] = useState('List View');
  const [selectedChapterId, setSelectedChapterId] = useState('ch-10-sci-01');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'ch-10-sci-01': true });
  const [chapterForm, setChapterForm] = useState<CurriculumChapter | null>(null);
  const [topicForm, setTopicForm] = useState<CurriculumTopic | null>(null);
  const [message, setMessage] = useState('');
  const [draggedId, setDraggedId] = useState('');
  const [tab, setTab] = useState<TabId>('structure');
  const [search, setSearch] = useState('');
  const [treeSelected, setTreeSelected] = useState<{ kind: NodeKind; chapterId: string; topicId?: string; subId?: string } | null>({ kind: 'chapter', chapterId: 'ch-10-sci-01' });
  const [checked, setChecked] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const [extras, setExtras] = useState<Record<string, NodeExtras>>(() => loadJson(EXTRAS_KEY, {}));
  const [toast, setToast] = useState<{ kind: 'success' | 'warning' | 'error' | 'info'; text: string } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<NodeKind>('chapter');
  const [addForm, setAddForm] = useState({ year: '2025-26', className: 'Class 10', subject: 'Science', parentChapter: '', parentTopic: '', name: '', description: '', status: 'Active', sequence: '1' });
  const [materials, setMaterials] = useState<AttachedMaterial[]>(() => loadJson<AttachedMaterial[]>(MATERIALS_KEY, []).map((item) => ({ id: item.id, fileName: item.fileName, fileKind: item.fileKind || 'PDF', size: item.size, className: item.className, subject: item.subject, chapter: item.chapter, topic: item.topic })));
  const [uploads, setUploads] = useState<UploadRecord[]>(() => loadJson(UPLOADS_KEY, [
    { id: 'u1', fileName: 'Real_Numbers_Notes.pdf', className: 'Class 10', subject: 'Mathematics', materialType: 'Notes', mapped: '5/5', uploadDate: '15 Oct 2026', status: 'Processed' },
    { id: 'u2', fileName: 'Polynomials_Textbook.pdf', className: 'Class 10', subject: 'Mathematics', materialType: 'Textbook', mapped: '3/5', uploadDate: '20 Oct 2026', status: 'Partial' },
    { id: 'u3', fileName: 'Linear_Equations_PPT.pptx', className: 'Class 10', subject: 'Mathematics', materialType: 'Notes', mapped: '0/4', uploadDate: '22 Oct 2026', status: 'Pending' }
  ]));
  const [upYear, setUpYear] = useState('2025-26');
  const [upClass, setUpClass] = useState('Class 10');
  const [upSubject, setUpSubject] = useState('Science');
  const [upType, setUpType] = useState<typeof MATERIAL_TYPES[number]>('Notes');
  const [dropHot, setDropHot] = useState(false);
  const [queue, setQueue] = useState<UploadFile[]>([]);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [step, setStep] = useState(0);
  const [overall, setOverall] = useState(0);
  const [detected, setDetected] = useState<DetectedRow[]>([]);
  const [confidence, setConfidence] = useState(87);
  const [editMapping, setEditMapping] = useState(false);
  const [uploadSearch, setUploadSearch] = useState('');
  const [uploadPage, setUploadPage] = useState(1);
  const [uploadSelected, setUploadSelected] = useState<string[]>([]);
  const [uploadSub, setUploadSub] = useState<'upload' | 'list'>('upload');
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = (next: CurriculumChapter[]) => { setChapters(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, next); };
  const updateChapter = <K extends keyof CurriculumChapter,>(key: K, value: CurriculumChapter[K]) => setChapterForm((current) => current ? { ...current, [key]: value } : current);
  const updateTopic = <K extends keyof CurriculumTopic,>(key: K, value: CurriculumTopic[K]) => setTopicForm((current) => current ? { ...current, [key]: value } : current);
  const subjectOptions = useMemo(() => ['All Subjects', ...new Set([...SUBJECTS, ...chapters.filter((item) => item.className === selectedClass).map((item) => item.subject)])], [chapters, selectedClass]);
  const filtered = useMemo(() => chapters.filter((item) => item.academicYear === academicYear && item.className === selectedClass && (selectedSubject === 'All Subjects' || item.subject === selectedSubject) && (termFilter === 'All' || item.term === termFilter) && (!search || item.name.toLowerCase().includes(search.toLowerCase()) || item.topics.some((topic) => topic.name.toLowerCase().includes(search.toLowerCase()) || topic.subtopics.some((sub) => sub.name.toLowerCase().includes(search.toLowerCase()))))).sort((a, b) => a.chapterNumber - b.chapterNumber), [chapters, academicYear, selectedClass, selectedSubject, termFilter, search]);
  useEffect(() => { if (!filtered.some((item) => item.id === selectedChapterId)) setSelectedChapterId(filtered[0]?.id || ''); }, [filtered, selectedChapterId]);
  useEffect(() => { saveJson(EXTRAS_KEY, extras); }, [extras]);
  useEffect(() => { saveJson(UPLOADS_KEY, uploads); }, [uploads]);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 3500); return () => window.clearTimeout(t); }, [toast]);
  useEffect(() => { const onDoc = () => setMenu(null); document.addEventListener('click', onDoc); return () => document.removeEventListener('click', onDoc); }, []);
  const flash = (kind: 'success' | 'warning' | 'error' | 'info', text: string) => setToast({ kind, text });
  const topicCount = filtered.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const periodCount = filtered.reduce((sum, chapter) => sum + chapter.allocatedPeriods, 0);
  const noResources = filtered.flatMap((chapter) => chapter.topics).filter((topic) => !topic.textbookPages && !topic.videoLinks && !topic.worksheets && !topic.digitalTools).length;
  const noObjectives = filtered.filter((chapter) => chapter.topics.length > 0 && chapter.topics.every((topic) => topic.learningObjectives.length === 0)).length;
  const linkedLessonChapterIds = loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS);
  const linkedObjectiveChapterIds = loadPlanningCollection(ACADEMIC_PLANNING_KEYS.objectives, DEFAULT_LEARNING_OBJECTIVES);
  const locked = (id: string) => Boolean(extras[id]?.locked);

  const startNewChapter = () => { const blank = createBlankChapter(); blank.academicYear = academicYear; blank.className = selectedClass; blank.subject = selectedSubject === 'All Subjects' ? 'Science' : selectedSubject; blank.chapterNumber = Math.max(0, ...chapters.filter((item) => item.className === selectedClass && item.subject === blank.subject).map((item) => item.chapterNumber)) + 1; blank.code = codeForChapter(blank); const topic = createBlankTopic(blank.id); topic.number = `${blank.chapterNumber}.1`; topic.code = codeForTopic(topic); blank.topics = [topic]; setChapterForm(blank); setTopicForm(topic); };
  const editChapter = (record: CurriculumChapter) => { setChapterForm({ ...record, topics: [...record.topics] }); setTopicForm(record.topics[0] ? { ...record.topics[0], subtopics: [...record.topics[0].subtopics], learningObjectives: [...record.topics[0].learningObjectives], questionTypes: [...record.topics[0].questionTypes] } : null); };
  const saveChapter = () => {
    if (!chapterForm?.name.trim()) { setMessage('Enter the official chapter name before saving.'); return; }
    let topics = [...(chapterForm.topics || [])];
    if (topicForm) {
      const savedTopic = { ...topicForm, name: topicForm.name.trim(), chapterId: chapterForm.id, code: codeForTopic(topicForm), periods: Math.max(0, Number(topicForm.periods)) };
      topics = topics.some((item) => item.id === savedTopic.id) ? topics.map((item) => item.id === savedTopic.id ? savedTopic : item) : [...topics, savedTopic];
    }
    const saved = { ...chapterForm, name: chapterForm.name.trim(), code: codeForChapter(chapterForm), chapterNumber: Math.max(1, Number(chapterForm.chapterNumber)), allocatedPeriods: Math.max(0, Number(chapterForm.allocatedPeriods), topics.reduce((sum, item) => sum + item.periods, 0)), topics, completionPercent: topics.length ? Math.round(topics.reduce((sum, item) => sum + item.completionPercent, 0) / topics.length) : chapterForm.completionPercent };
    persist(chapters.some((item) => item.id === saved.id) ? chapters.map((item) => item.id === saved.id ? saved : item) : [...chapters, saved]);
    setSelectedChapterId(saved.id); setExpanded((current) => ({ ...current, [saved.id]: true })); setChapterForm(null); setTopicForm(null); setMessage(`Chapter “${saved.name}” saved.`); window.setTimeout(() => setMessage(''), 3000);
  };
  const startTopic = (chapter: CurriculumChapter, existing?: CurriculumTopic) => {
    const blank = existing ? { ...existing, subtopics: [...existing.subtopics], learningObjectives: [...existing.learningObjectives], questionTypes: [...existing.questionTypes] } : createBlankTopic(chapter.id);
    blank.chapterId = chapter.id; blank.number = existing?.number || `${chapter.chapterNumber}.${chapter.topics.length + 1}`; blank.code = existing?.code || codeForTopic(blank);
    const topics = existing || chapter.topics.some((item) => item.id === blank.id) ? chapter.topics : [...chapter.topics, blank];
    setChapterForm({ ...chapter, topics }); setTopicForm(blank);
  };
  const deleteChapter = (record: CurriculumChapter) => {
    if (locked(record.id)) { setMessage('This chapter is locked.'); return; }
    const hasLinkedRecord = linkedObjectiveChapterIds.some((item) => item.chapterId === record.id || item.chapterName === record.name) || linkedLessonChapterIds.some((item) => item.chapter === record.name) || loadPlanningCollection(ACADEMIC_PLANNING_KEYS.monthlyPlans, DEFAULT_MONTHLY_PLANS).some((item) => item.chaptersToCover.includes(record.name));
    if (hasLinkedRecord) { setMessage('This chapter has linked objectives, lesson plans, or monthly plans and cannot be deleted.'); return; }
    if (typeof window !== 'undefined' && !window.confirm(`Delete ${record.name}?`)) return;
    persist(chapters.filter((item) => item.id !== record.id)); setMessage(`Chapter “${record.name}” deleted.`);
  };
  const deleteTopic = (parent: CurriculumChapter, topic: CurriculumTopic) => {
    const linked = linkedLessonChapterIds.some((item) => item.topic === topic.name) || linkedObjectiveChapterIds.some((item) => item.topicName === topic.name);
    if (linked) { setMessage('This topic has linked lesson plans or objectives and cannot be deleted.'); return; }
    if (typeof window !== 'undefined' && !window.confirm(`Delete topic ${topic.name}?`)) return;
    persist(chapters.map((item) => item.id === parent.id ? { ...item, topics: item.topics.filter((entry) => entry.id !== topic.id) } : item)); setMessage(`Topic “${topic.name}” deleted.`);
  };
  const exportCurriculum = () => downloadPlanningCsv('curriculum-guide.csv', filtered.flatMap((chapter) => chapter.topics.length ? chapter.topics.map((topic) => ({ AcademicYear: chapter.academicYear, Class: chapter.className, Subject: chapter.subject, Chapter: chapter.name, ChapterNumber: chapter.chapterNumber, Term: chapter.term, Topic: topic.name, Periods: topic.periods, Completion: topic.completionPercent })) : [{ AcademicYear: chapter.academicYear, Class: chapter.className, Subject: chapter.subject, Chapter: chapter.name, ChapterNumber: chapter.chapterNumber, Term: chapter.term, Topic: '', Periods: chapter.allocatedPeriods, Completion: chapter.completionPercent }]));
  const copyFromPreviousYear = () => {
    const previousYear = `${Number(academicYear.slice(0, 4)) - 1}-${String(Number(academicYear.slice(0, 4)) % 100).padStart(2, '0')}`;
    const previous = chapters.filter((item) => item.academicYear === previousYear && item.className === selectedClass && (selectedSubject === 'All Subjects' || item.subject === selectedSubject));
    const source = previous.length ? previous : filtered;
    if (!source.length) { setMessage(`No curriculum found to copy for ${selectedClass}.`); return; }
    const copies = source.map((item, index) => ({ ...item, id: newPlanningId('chapter'), academicYear, chapterNumber: index + 1, code: codeForChapter({ ...item, chapterNumber: index + 1 }), completionPercent: 0, topics: item.topics.map((topic) => ({ ...topic, id: newPlanningId('topic'), completionPercent: 0, status: 'Not Started' as const, learningObjectives: topic.learningObjectives.map((objective) => ({ ...objective, id: newPlanningId('obj') })) })) }));
    persist([...chapters.filter((item) => !(item.academicYear === academicYear && item.className === selectedClass && (selectedSubject === 'All Subjects' || item.subject === selectedSubject))), ...copies]); setMessage(`Copied ${copies.length} chapter(s) from ${previous.length ? previousYear : 'the current curriculum'} into ${academicYear}.`);
  };
  const moveChapter = (chapterId: string, targetId: string) => {
    if (!chapterId || chapterId === targetId || locked(chapterId)) return;
    const sourceIndex = chapters.findIndex((item) => item.id === chapterId); const targetIndex = chapters.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const next = [...chapters]; const moved = next.splice(sourceIndex, 1)[0]; if (!moved) return; next.splice(targetIndex, 0, moved); const renumbered = next.map((item) => item.className === moved.className && item.subject === moved.subject && item.academicYear === moved.academicYear ? { ...item, chapterNumber: next.filter((candidate) => candidate.className === item.className && candidate.subject === item.subject && candidate.academicYear === item.academicYear).findIndex((candidate) => candidate.id === item.id) + 1 } : item);
    persist(renumbered.map((item) => item.className === moved.className && item.subject === moved.subject && item.academicYear === moved.academicYear ? { ...item, code: codeForChapter(item) } : item));
  };
  const editSubtopic = (index: number, key: keyof CurriculumSubTopic, value: string | number) => updateTopic('subtopics', (topicForm?.subtopics || []).map((item, i) => i === index ? { ...item, [key]: value } as CurriculumSubTopic : item));
  const duplicateChapter = (chapter: CurriculumChapter) => {
    const copy: CurriculumChapter = { ...chapter, id: newPlanningId('chapter'), name: `${chapter.name} (Copy)`, chapterNumber: Math.max(0, ...chapters.filter((item) => item.className === chapter.className && item.subject === chapter.subject).map((item) => item.chapterNumber)) + 1, topics: chapter.topics.map((topic) => ({ ...topic, id: newPlanningId('topic'), subtopics: topic.subtopics.map((sub) => ({ ...sub, id: newPlanningId('sub') })) })) };
    copy.code = codeForChapter(copy);
    persist([...chapters, copy]);
    setMessage(`Duplicated “${chapter.name}”.`);
  };
  const materialCount = (chapterName: string, topicName?: string) => materials.filter((item) => item.className === selectedClass && (selectedSubject === 'All Subjects' || item.subject === selectedSubject) && item.chapter.includes(chapterName) && (!topicName || (item.topic || '').includes(topicName))).length;
  const chapterDot = (chapter: CurriculumChapter): 'green' | 'yellow' | 'red' => {
    if (!chapter.topics.length) return materialCount(chapter.name) ? 'green' : 'red';
    const counts = chapter.topics.map((topic) => materialCount(chapter.name, topic.name));
    if (counts.every((value) => value > 0)) return 'green';
    if (counts.some((value) => value > 0)) return 'yellow';
    return 'red';
  };
  const treeChapter = chapters.find((item) => item.id === treeSelected?.chapterId) || null;
  const treeTopic = treeChapter?.topics.find((item) => item.id === treeSelected?.topicId) || null;
  const treeSub = treeTopic?.subtopics.find((item) => item.id === treeSelected?.subId) || null;
  const attachedForSelection = useMemo(() => {
    if (!treeChapter) return [];
    return materials.filter((item) => item.className === treeChapter.className && item.subject === treeChapter.subject && item.chapter.includes(treeChapter.name) && (!treeTopic || (item.topic || '').includes(treeTopic.name)));
  }, [materials, treeChapter, treeTopic]);

  const openAdd = (type: NodeKind = 'chapter') => {
    setAddType(type);
    setAddForm({ year: academicYear, className: selectedClass, subject: selectedSubject === 'All Subjects' ? 'Science' : selectedSubject, parentChapter: filtered[0]?.id || '', parentTopic: filtered[0]?.topics[0]?.id || '', name: '', description: '', status: 'Active', sequence: type === 'chapter' ? String(Math.max(0, ...filtered.map((item) => item.chapterNumber)) + 1) : `${filtered[0]?.chapterNumber || 1}.1` });
    setAddOpen(true);
  };
  const saveAdd = (another: boolean) => {
    if (!addForm.name.trim()) { flash('error', 'Name is required.'); return; }
    if (addType === 'chapter') {
      const blank = createBlankChapter();
      blank.academicYear = addForm.year; blank.className = addForm.className; blank.subject = addForm.subject; blank.chapterNumber = Number(addForm.sequence) || filtered.length + 1; blank.name = addForm.name.trim(); blank.introduction = addForm.description; blank.status = addForm.status === 'Inactive' ? 'Inactive' : 'Active'; blank.code = codeForChapter(blank);
      const topic = createBlankTopic(blank.id); topic.number = `${blank.chapterNumber}.1`; topic.code = codeForTopic(topic); blank.topics = [topic];
      persist([...chapters, blank]); setSelectedChapterId(blank.id); setTreeSelected({ kind: 'chapter', chapterId: blank.id });
    } else if (addType === 'topic') {
      const parent = chapters.find((item) => item.id === addForm.parentChapter); if (!parent) { flash('error', 'Select a parent chapter.'); return; }
      const topic = createBlankTopic(parent.id); topic.number = addForm.sequence; topic.name = addForm.name.trim();
      persist(chapters.map((item) => item.id === parent.id ? { ...item, topics: [...item.topics, topic] } : item));
      startTopic(parent, topic);
      setAddOpen(false); return;
    } else {
      const parent = chapters.find((item) => item.id === addForm.parentChapter); const topic = parent?.topics.find((item) => item.id === addForm.parentTopic);
      if (!parent || !topic) { flash('error', 'Select parent chapter and topic.'); return; }
      const sub: CurriculumSubTopic = { id: newPlanningId('sub'), number: addForm.sequence, name: addForm.name.trim(), periods: 1, teachingNotes: addForm.description };
      persist(chapters.map((item) => item.id === parent.id ? { ...item, topics: item.topics.map((entry) => entry.id === topic.id ? { ...entry, hasSubtopics: true, subtopics: [...entry.subtopics, sub] } : entry) } : item));
    }
    flash('success', `${addType === 'chapter' ? 'Chapter' : addType === 'topic' ? 'Topic' : 'Sub-topic'} added.`);
    if (another) setAddForm((current) => ({ ...current, name: '', description: '' })); else setAddOpen(false);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next: UploadFile[] = Array.from(list).slice(0, 10).map((file) => { const ext = file.name.split('.').pop()?.toLowerCase(); const kind = ext === 'docx' ? 'DOCX' : ext === 'pptx' ? 'PPTX' : ext === 'txt' ? 'TXT' : 'PDF'; return { id: newPlanningId('file'), name: file.name, size: file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`, sizeBytes: file.size, kind, progress: 0 }; });
    setQueue((current) => [...current, ...next].slice(0, 10)); setPhase('queue');
  };
  const analyze = () => {
    if (!upYear || !upClass || !upSubject) { flash('error', 'Academic Year, Class and Subject are required.'); return; }
    if (!queue.length) { flash('error', 'Add at least one file.'); return; }
    setPhase('processing'); setStep(1); setOverall(10);
    [700, 1500, 2400, 3300].forEach((ms, index) => {
      window.setTimeout(() => {
        setStep(index + 1); setOverall((index + 1) * 25); setQueue((current) => current.map((file) => ({ ...file, progress: Math.min(100, (index + 1) * 25) })));
        if (index === 3) {
          const first = queue[0]?.name || '';
          setDetected([
            { id: 'd1', detected: `${filtered[0]?.name || 'Chapter 1'} (p.1-18)`, matchLabel: filtered[0] ? `Ch1: ${filtered[0].name}` : 'Not Found', matchId: filtered[0]?.id || '', status: 'matched', action: 'map' },
            { id: 'd2', detected: `${filtered[0]?.topics[0]?.name || 'Topic 1.1'} (p.8-12)`, matchLabel: filtered[0]?.topics[0]?.name || 'Not Found', matchId: filtered[0]?.topics[0]?.id || '', status: 'matched', action: 'map' },
            { id: 'd3', detected: 'Division Algorithm (p.13)', matchLabel: 'Not Found', matchId: '', status: 'review', action: 'map' },
            { id: 'd4', detected: first.toLowerCase().includes('poly') ? 'Polynomials (p.19-35)' : 'Extension topic (p.36-52)', matchLabel: 'No Match Found', matchId: '', status: 'new', action: 'create' }
          ]);
          setConfidence(first.toLowerCase().includes('poly') ? 74 : 87); setPhase('results'); flash('success', 'Analysis complete — review the detected structure before confirming.');
        }
      }, ms);
    });
  };
  const confirmMapping = () => {
    const created = detected.filter((row) => row.action === 'create' && row.status === 'new');
    let nextChapters = chapters;
    created.forEach((row) => {
      const blank = createBlankChapter(); blank.academicYear = upYear; blank.className = upClass; blank.subject = upSubject; blank.chapterNumber = Math.max(0, ...nextChapters.filter((item) => item.className === upClass && item.subject === upSubject).map((item) => item.chapterNumber)) + 1; blank.name = row.detected.replace(/ \(p\..*$/, ''); blank.code = codeForChapter(blank);
      nextChapters = [...nextChapters, blank];
    });
    persist(nextChapters);
    const skipped = detected.filter((row) => row.action === 'skip').length;
    const mappedCount = detected.filter((row) => row.action !== 'skip').length;
    const mappedName = detected.find((row) => row.action !== 'skip')?.matchLabel || detected[0]?.detected || 'Unmapped';
    const typeMap: Record<string, string> = { Textbook: 'Textbook', Notes: 'Notes', Worksheet: 'Worksheet', 'Question Bank': 'Question Bank', 'Reference Material': 'Reference', Other: 'Notes' };
    const additions = queue.map((file) => ({ id: file.id, fileName: file.name, className: upClass, subject: upSubject, chapter: mappedName, topic: '', materialType: typeMap[upType] || 'Notes', fileKind: file.kind === 'TXT' ? 'PDF' : file.kind, size: file.size, sizeBytes: file.sizeBytes, uploadedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), uploadedAt: Date.now(), uploadedBy: 'Curriculum Master', downloads: 0, pages: 8, preview: [file.name] }));
    saveJson(MATERIALS_KEY, [...additions, ...loadJson(MATERIALS_KEY, [])]);
    setMaterials((current) => [...additions.map((item) => ({ id: item.id, fileName: item.fileName, fileKind: item.fileKind, size: item.size, className: item.className, subject: item.subject, chapter: item.chapter, topic: item.topic })), ...current]);
    setUploads((current) => [{ id: newPlanningId('up'), fileName: queue[0]?.name || 'Upload', className: upClass, subject: upSubject, materialType: upType, mapped: `${mappedCount}/${detected.length}`, uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), status: skipped ? 'Partial' : 'Processed' }, ...current]);
    setPhase('idle'); setQueue([]); setUploadSub('list'); flash(skipped ? 'warning' : 'success', skipped ? `${mappedCount} of ${detected.length} sections mapped.` : 'Mapping confirmed and materials linked.');
  };

  const uploadRows = uploads.filter((item) => !uploadSearch || item.fileName.toLowerCase().includes(uploadSearch.toLowerCase()));
  const uploadPageSize = 10;
  const uploadPageCount = Math.max(1, Math.ceil(uploadRows.length / uploadPageSize));
  const pagedUploads = uploadRows.slice((uploadPage - 1) * uploadPageSize, uploadPage * uploadPageSize);
  const treeMenu = (id: string, items: { label: string; onClick: () => void }[]) => (
    <div className="relative">
      <button type="button" className="rounded p-1 opacity-0 hover:bg-gray-100 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); setMenu(menu === id ? null : id); }}><MoreVertical className="h-4 w-4 text-gray-500" /></button>
      {menu === id && <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg">{items.map((item) => <button key={item.label} type="button" className="block w-full px-3 py-1.5 text-left hover:bg-gray-50" onClick={(event) => { event.stopPropagation(); item.onClick(); setMenu(null); }}>{item.label}</button>)}</div>}
    </div>
  );

  return <div className="space-y-5 p-4 md:p-6">
    <PageHeader title="Curriculum Master" description="Build and maintain the class/subject curriculum structure: chapters, topics and sub-topics." actions={<><Button onClick={startNewChapter}><Plus className="h-4 w-4" />Add Chapter & Topic</Button><Button variant="outline" onClick={() => openAdd('chapter')}><Plus className="h-4 w-4" />Add New</Button><Button variant="outline" onClick={copyFromPreviousYear}><Copy className="h-4 w-4" />Copy from Last Year</Button><Button variant="outline" onClick={() => { persist(loadPlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS)); flash('info', 'Curriculum refreshed.'); }}><RefreshCw className="h-4 w-4" />Refresh</Button></>} />

    <div className="flex gap-2 border-b border-gray-200">
      <button type="button" onClick={() => setTab('structure')} className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm ${tab === 'structure' ? 'border-b-2 border-blue-600 font-bold text-blue-700' : 'font-medium text-gray-500'}`}><Folder className="h-4 w-4" /> Curriculum Structure</button>
      <button type="button" onClick={() => setTab('upload')} className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm ${tab === 'upload' ? 'border-b-2 border-blue-600 font-bold text-blue-700' : 'font-medium text-gray-500'}`}><CloudUpload className="h-4 w-4" /> Upload Study Material</button>
    </div>

    {tab === 'structure' && <>
    <Card><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><SelectField label="Class" value={selectedClass} onChange={setSelectedClass} options={CLASSES} /><SelectField label="Subject" value={subjectOptions.includes(selectedSubject) ? selectedSubject : 'All Subjects'} onChange={setSelectedSubject} options={subjectOptions} /><SelectField label="Term" value={termFilter} onChange={setTermFilter} options={['All', ...TERMS]} /><SelectField label="Academic Year" value={academicYear} onChange={setAcademicYear} options={ACADEMIC_YEARS} /><div><p className="mb-1 text-xs font-medium text-gray-600">Search</p><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chapters, topics..." className={`${inputCls} pl-9`} /></div></div></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-xs text-slate-500"><span>View:</span><Button size="xs" variant={view === 'List View' ? 'primary' : 'outline'} onClick={() => setView('List View')}><List className="h-3.5 w-3.5" />List View</Button><Button size="xs" variant={view === 'Table View' ? 'primary' : 'outline'} onClick={() => setView('Table View')}><Table2 className="h-3.5 w-3.5" />Table View</Button><Button size="xs" variant={view === 'Tree View' ? 'primary' : 'outline'} onClick={() => setView('Tree View')}><Folder className="h-3.5 w-3.5" />Tree View</Button></div><Badge variant="info">{academicYear}</Badge></div></Card>
    {message && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{message}</div>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Card><p className="text-2xl font-bold text-indigo-700">{filtered.length}</p><p className="text-xs text-slate-500">Total chapters</p></Card><Card><p className="text-2xl font-bold text-sky-700">{topicCount}</p><p className="text-xs text-slate-500">Total topics</p></Card><Card><p className="text-2xl font-bold text-emerald-700">{periodCount}</p><p className="text-xs text-slate-500">Periods allocated in the selected curriculum</p></Card><Card><p className="flex items-center gap-2 text-2xl font-bold text-amber-700"><AlertTriangle className="h-5 w-5" />{noResources + noObjectives}</p><p className="text-xs text-slate-500">Resource / objective gaps</p></Card></div>
    {(noResources > 0 || noObjectives > 0) && <div className="grid gap-2 md:grid-cols-2">{noResources > 0 && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">{noResources} topic(s) have no textbook, worksheet, video or digital resource linked.</div>}{noObjectives > 0 && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900">{noObjectives} chapter(s) have no learning objectives yet.</div>}</div>}

    {view !== 'Tree View' && <Card title={`${selectedClass} · ${selectedSubject}`} headerAction={<Badge variant="info">{filtered.length} chapter(s)</Badge>}>
      {filtered.length === 0 ? <EmptyState>No curriculum entries for the selected class, subject, term and year. Add a chapter to begin.</EmptyState> : view === 'Table View' ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Chapter</th><th className="px-3 py-2">Term</th><th className="px-3 py-2">Periods</th><th className="px-3 py-2">Topics</th><th className="px-3 py-2">Progress</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((chapter) => <tr key={chapter.id}><td className="px-3 py-2">{chapter.chapterNumber}</td><td className="px-3 py-2 font-semibold">{chapter.name}<p className="text-[10px] text-slate-400">{chapter.code}</p></td><td className="px-3 py-2">{chapter.term}</td><td className="px-3 py-2">{chapter.allocatedPeriods}</td><td className="px-3 py-2">{chapter.topics.length}</td><td className="px-3 py-2">{chapter.completionPercent}%</td><td className="px-3 py-2"><StatusPill status={chapter.completionPercent === 100 ? 'Complete' : chapter.completionPercent ? 'Ongoing' : 'Not Started'} /></td><td className="px-3 py-2"><Button size="xs" variant="outline" onClick={() => editChapter(chapter)}>Edit</Button> <Button size="xs" variant="outline" onClick={() => setExpanded((current) => ({ ...current, [chapter.id]: !current[chapter.id] }))}>Details</Button></td></tr>)}</tbody></table></div> : <div className="space-y-2">{filtered.map((chapter) => <div key={chapter.id} draggable onDragStart={() => setDraggedId(chapter.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { moveChapter(draggedId, chapter.id); setDraggedId(''); }} className="rounded-xl border border-slate-200 bg-white"><div className="flex flex-wrap items-center gap-2 p-3"><button className="cursor-grab text-slate-400" title="Drag to reorder"><GripVertical className="h-4 w-4" /></button><button className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => { setSelectedChapterId(chapter.id); setExpanded((current) => ({ ...current, [chapter.id]: !current[chapter.id] })); }}>{expanded[chapter.id] ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}<span className="min-w-0"><span className="font-bold text-slate-800">CHAPTER {chapter.chapterNumber}: {chapter.name}</span><span className="ml-2 text-[10px] font-normal text-slate-400">{chapter.code}</span></span></button><span className="text-xs text-slate-500">{chapter.allocatedPeriods} periods</span><Badge variant="info">{chapter.term}</Badge><StatusPill status={chapter.completionPercent === 100 ? 'Complete' : chapter.completionPercent ? 'Ongoing' : 'Not Started'} /><Button size="xs" variant="outline" onClick={() => editChapter(chapter)}><Edit3 className="h-3.5 w-3.5" />Edit Chapter</Button><Button size="xs" variant="outline" onClick={() => startTopic(chapter)}><Plus className="h-3.5 w-3.5" />Topic</Button><Button size="xs" variant="ghost" onClick={() => deleteChapter(chapter)} title="Delete only if no linked records"><Trash2 className="h-3.5 w-3.5" /></Button></div>{expanded[chapter.id] && <div className="border-t border-slate-100 bg-slate-50/60 p-3"><div className="mb-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-4"><p><b>Periods:</b> {chapter.allocatedPeriods} allocated · {chapter.bufferPeriods} buffer</p><p><b>Scheduled:</b> {chapter.scheduledMonthFrom}–{chapter.scheduledMonthTo}</p><p><b>Status:</b> {chapter.status}</p><p><b>Learning methods:</b> {chapter.teachingMethods.join(', ') || '—'}</p></div>{chapter.topics.length ? <div className="space-y-2">{chapter.topics.map((topic) => <div key={topic.id} className="rounded-lg border border-slate-200 bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold text-slate-800">Topic {topic.number}: {topic.name}</p><p className="text-[10px] text-slate-500">{topic.periods} periods · {topic.subtopics.length} sub-topic(s) · {topic.learningObjectives.length} objective(s)</p></div><div className="flex items-center gap-2"><span className="text-xs font-semibold">{topic.completionPercent}%</span><StatusPill status={topic.status} /><Button size="xs" variant="outline" onClick={() => startTopic(chapter, topic)}><Edit3 className="h-3 w-3" />Edit</Button><Button size="xs" variant="ghost" onClick={() => deleteTopic(chapter, topic)}><Trash2 className="h-3 w-3" /></Button></div></div>{topic.subtopics.length > 0 && <div className="mt-2 border-l-2 border-indigo-100 pl-3">{topic.subtopics.map((sub) => <p key={sub.id} className="py-0.5 text-[11px] text-slate-600">↳ {sub.number} {sub.name} · {sub.periods} period(s)</p>)}</div>}<div className="mt-2 flex flex-wrap gap-1">{topic.learningObjectives.map((objective) => <Badge key={objective.id} variant="outline">{objective.bloomLevel}: {objective.statement}</Badge>)}</div></div>)}</div> : <EmptyState>No topics added under this chapter yet.</EmptyState>}<Button size="xs" variant="outline" className="mt-3" onClick={() => startTopic(chapter)}><Plus className="h-3.5 w-3.5" />Add Topic under Chapter</Button><div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400"><Eye className="h-3 w-3" />View full chapter details by selecting Edit Chapter.</div></div>}</div>)}</div>}
    </Card>}

    {view === 'Tree View' && <div className="flex flex-col gap-4 xl:flex-row">
      <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white xl:w-[35%]">
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <p className="text-xs italic text-gray-500">{selectedClass} — {selectedSubject} | {academicYear}</p>
        </div>
        <div className="max-h-[70vh] flex-1 overflow-auto p-2">
          {filtered.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No curriculum entries for this class, subject and year.</p>}
          {filtered.map((chapter) => {
            const dot = chapterDot(chapter); const open = expanded[chapter.id];
            return <div key={chapter.id} draggable={!locked(chapter.id)} onDragStart={() => setDraggedId(chapter.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { moveChapter(draggedId, chapter.id); setDraggedId(''); }} className={`group mb-1 rounded-lg ${treeSelected?.chapterId === chapter.id && treeSelected.kind === 'chapter' ? 'bg-blue-50' : ''} ${draggedId && draggedId !== chapter.id ? 'border-t-2 border-dashed border-blue-400' : ''}`}>
              <div className="flex items-center gap-1 px-1 py-1.5">
                <input type="checkbox" className="opacity-0 group-hover:opacity-100" checked={checked.includes(chapter.id)} onChange={(event) => setChecked(event.target.checked ? [...checked, chapter.id] : checked.filter((id) => id !== chapter.id))} />
                <GripVertical className="h-3.5 w-3.5 cursor-grab text-gray-300" />
                <button type="button" onClick={() => setExpanded((current) => ({ ...current, [chapter.id]: !current[chapter.id] }))}>{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
                <button type="button" className="flex min-w-0 flex-1 items-center gap-1 text-left text-sm" onClick={() => { setTreeSelected({ kind: 'chapter', chapterId: chapter.id }); setSelectedChapterId(chapter.id); }}><Folder className="h-4 w-4 shrink-0 text-orange-500" /><span className={`truncate font-semibold ${search && chapter.name.toLowerCase().includes(search.toLowerCase()) ? 'bg-yellow-200' : ''}`}>Chapter {chapter.chapterNumber}: {chapter.name}</span></button>
                <span className="hidden text-[10px] text-gray-500 sm:inline">{chapter.topics.length} Topics</span>
                <span className={`h-2.5 w-2.5 rounded-full ${dot === 'green' ? 'bg-green-500' : dot === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                {locked(chapter.id) && <Lock className="h-3.5 w-3.5 text-gray-400" />}
                {treeMenu(chapter.id, [{ label: 'Edit', onClick: () => editChapter(chapter) }, { label: 'Add Topic', onClick: () => startTopic(chapter) }, { label: 'Duplicate', onClick: () => duplicateChapter(chapter) }, { label: locked(chapter.id) ? 'Unlock' : 'Lock', onClick: () => setExtras((current) => ({ ...current, [chapter.id]: { locked: !locked(chapter.id) } })) }, { label: 'Delete', onClick: () => deleteChapter(chapter) }])}
              </div>
              {open && chapter.topics.map((topic) => <div key={topic.id} className="ml-6">
                <div className={`group flex items-center gap-1 rounded-md px-1 py-1 ${treeSelected?.topicId === topic.id && treeSelected.kind === 'topic' ? 'bg-blue-50' : ''}`}>
                  <input type="checkbox" className="opacity-0 group-hover:opacity-100" checked={checked.includes(topic.id)} onChange={(event) => setChecked(event.target.checked ? [...checked, topic.id] : checked.filter((id) => id !== topic.id))} />
                  <button type="button" onClick={() => setExpanded((current) => ({ ...current, [topic.id]: !current[topic.id] }))}>{expanded[topic.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</button>
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-1 text-left text-sm" onClick={() => setTreeSelected({ kind: 'topic', chapterId: chapter.id, topicId: topic.id })}><FileText className="h-3.5 w-3.5 text-blue-500" /><span className="truncate">{topic.number} {topic.name}</span></button>
                  <span className="text-[10px] text-gray-400">{topic.subtopics.length} Sub-topics</span>
                  <span className={`h-2 w-2 rounded-full ${materialCount(chapter.name, topic.name) ? 'bg-green-500' : topic.subtopics.length ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  {treeMenu(topic.id, [{ label: 'Edit', onClick: () => startTopic(chapter, topic) }, { label: 'Add Sub-Topic', onClick: () => { const sub: CurriculumSubTopic = { id: newPlanningId('sub'), number: `${topic.number}.${topic.subtopics.length + 1}`, name: 'New sub-topic', periods: 1, teachingNotes: '' }; persist(chapters.map((item) => item.id === chapter.id ? { ...item, topics: item.topics.map((entry) => entry.id === topic.id ? { ...entry, hasSubtopics: true, subtopics: [...entry.subtopics, sub] } : entry) } : item)); } }, { label: 'Delete', onClick: () => deleteTopic(chapter, topic) }])}
                </div>
                {expanded[topic.id] && topic.subtopics.map((sub) => <div key={sub.id} className={`group ml-7 flex items-center gap-1 rounded-md px-1 py-1 text-sm ${treeSelected?.subId === sub.id ? 'bg-blue-50' : ''}`}>
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-1 text-left" onClick={() => setTreeSelected({ kind: 'subtopic', chapterId: chapter.id, topicId: topic.id, subId: sub.id })}><span className="text-emerald-600">●</span><span className="truncate">{sub.number} {sub.name}</span></button>
                  {treeMenu(sub.id, [{ label: 'Edit', onClick: () => startTopic(chapter, topic) }, { label: 'Attach Material', onClick: () => { setTab('upload'); flash('info', 'Upload a file to attach it to this sub-topic.'); } }, { label: 'Delete', onClick: () => persist(chapters.map((item) => item.id === chapter.id ? { ...item, topics: item.topics.map((entry) => entry.id === topic.id ? { ...entry, subtopics: entry.subtopics.filter((row) => row.id !== sub.id) } : entry) } : item)) }])}
                </div>)}
              </div>)}
            </div>;
          })}
        </div>
        <div className="border-t border-gray-100 p-2">
          {checked.length > 0 && <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm"><span className="font-semibold">{checked.length} items selected</span><button type="button" onClick={() => { const first = filtered.find((item) => checked.includes(item.id)); if (first) duplicateChapter(first); }}>Duplicate</button><button type="button" onClick={() => { checked.forEach((id) => { const chapter = chapters.find((item) => item.id === id); if (chapter) deleteChapter(chapter); }); setChecked([]); }}>Delete</button><button type="button" onClick={exportCurriculum}>Export as Excel</button></div>}
          <button type="button" className="w-full rounded-lg border border-blue-300 py-2 text-sm font-semibold text-blue-700" onClick={() => openAdd('chapter')}>+ Add Chapter</button>
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5">
        {!treeChapter ? <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500"><Info className="mb-2 h-10 w-10 text-blue-200" />Select a chapter, topic or sub-topic in the tree to view details.</div> : <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${treeSelected?.kind === 'chapter' ? 'bg-orange-100 text-orange-700' : treeSelected?.kind === 'topic' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{treeSelected?.kind === 'chapter' ? 'CHAPTER' : treeSelected?.kind === 'topic' ? 'TOPIC' : 'SUB-TOPIC'}</span><h2 className="text-lg font-bold text-gray-900">{treeSelected?.kind === 'chapter' ? treeChapter.name : treeSelected?.kind === 'topic' ? treeTopic?.name : treeSub?.name}</h2></div>
          <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <p><b>Class / Subject:</b> {treeChapter.className} · {treeChapter.subject}</p>
            <p><b>Term / Year:</b> {treeChapter.term} · {treeChapter.academicYear}</p>
            <p><b>Periods:</b> {treeSelected?.kind === 'topic' ? treeTopic?.periods : treeSelected?.kind === 'subtopic' ? treeSub?.periods : treeChapter.allocatedPeriods}</p>
            <p><b>Status:</b> {treeChapter.status}</p>
            {treeTopic && <p><b>Difficulty:</b> {treeTopic.difficulty} · Bloom: {treeTopic.bloomLevel}</p>}
            {treeChapter.introduction && <p className="sm:col-span-2"><b>Description:</b> {treeChapter.introduction}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => treeSelected?.kind === 'topic' && treeTopic ? startTopic(treeChapter, treeTopic) : editChapter(treeChapter)}><Edit3 className="h-4 w-4" />Open full Chapter & Topic editor</Button>
            {treeSelected?.kind === 'chapter' && <Button size="sm" variant="outline" onClick={() => startTopic(treeChapter)}><Plus className="h-4 w-4" />Add Topic</Button>}
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Attached Study Materials</p>
            {attachedForSelection.length === 0 ? <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center text-sm text-gray-500"><CloudUpload className="mx-auto mb-2 h-8 w-8 text-blue-300" />No materials attached yet. Upload from the Upload tab.</div> : attachedForSelection.map((item) => <div key={item.id} className="mb-2 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-red-500" /> {item.fileName} <span className="text-xs text-gray-400">{item.size}</span></span><span className="flex gap-1"><button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => flash('info', `Previewing ${item.fileName}`)}><Eye className="h-4 w-4" /></button><button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => flash('success', `Downloaded “${item.fileName}”.`)}><Download className="h-4 w-4" /></button><button type="button" className="rounded p-1 hover:bg-gray-100" onClick={() => setMaterials((current) => current.filter((row) => row.id !== item.id))}><Trash2 className="h-4 w-4 text-red-500" /></button></span></div>)}
          </div>
        </div>}
      </div>
    </div>}
    </>}

    {tab === 'upload' && <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setUploadSub('upload')} className={`rounded-lg px-3 py-1.5 text-sm ${uploadSub === 'upload' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Upload</button>
        <button type="button" onClick={() => setUploadSub('list')} className={`rounded-lg px-3 py-1.5 text-sm ${uploadSub === 'list' ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>Uploaded Materials</button>
      </div>
      {uploadSub === 'upload' && phase !== 'processing' && phase !== 'results' && <>
        <div><h2 className="text-lg font-bold text-gray-900">Upload Study Material</h2><p className="text-sm text-gray-500">Upload documents and let the system automatically detect and map chapters, topics, and sub-topics.</p></div>
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
          {field('Academic Year *', <div className="relative"><Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><select value={upYear} onChange={(event) => setUpYear(event.target.value)} className={`${inputCls} pl-9`}>{ACADEMIC_YEARS.map((item) => <option key={item}>{item}</option>)}</select></div>)}
          {field('Class *', <select value={upClass} onChange={(event) => setUpClass(event.target.value)} className={inputCls}>{CLASSES.map((item) => <option key={item}>{item}</option>)}</select>)}
          {field('Subject *', <select value={upSubject} onChange={(event) => setUpSubject(event.target.value)} className={inputCls}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select>)}
        </div>
        <div className="flex flex-wrap gap-2">{MATERIAL_TYPES.map((item) => <button key={item} type="button" onClick={() => setUpType(item)} className={`rounded-full px-3 py-1.5 text-sm ${upType === item ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600'}`}>{item}</button>)}</div>
        <div onDragOver={(event) => { event.preventDefault(); setDropHot(true); }} onDragLeave={() => setDropHot(false)} onDrop={(event) => { event.preventDefault(); setDropHot(false); addFiles(event.dataTransfer.files); }} className={`rounded-xl border-2 border-dashed p-10 text-center ${dropHot ? 'border-blue-600 bg-[#EBF5FF]' : 'border-gray-300 bg-[#FAFAFA]'}`}>
          <CloudUpload className="mx-auto h-16 w-16 text-blue-300" />
          <p className="mt-2 font-bold text-gray-800">{dropHot ? 'Drop to upload!' : 'Drag & Drop your files here'}</p>
          <p className="text-sm text-gray-500">or</p>
          <button type="button" className="mt-2 rounded-lg border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-700" onClick={() => fileRef.current?.click()}>Browse Files</button>
          <p className="mt-2 text-xs text-gray-400">Supported formats: PDF, DOCX, PPTX, TXT | Max size: 50MB per file | Up to 10 files at once</p>
          <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.txt" className="hidden" onChange={(event) => addFiles(event.target.files)} />
        </div>
        {queue.length > 0 && <div className="rounded-xl border border-gray-200 bg-white p-4">{queue.map((file) => <div key={file.id} className="mb-2 flex items-center gap-3"><span className={`w-12 text-center text-xs font-bold ${file.kind === 'PDF' ? 'text-red-600' : file.kind === 'DOCX' ? 'text-blue-600' : 'text-orange-600'}`}>{file.kind}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium" title={file.name}>{file.name} <span className="text-xs text-gray-400">{file.size}</span></p><div className="mt-1 h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${file.progress}%` }} /></div></div><button type="button" onClick={() => setQueue((current) => current.filter((item) => item.id !== file.id))}><X className="h-4 w-4 text-gray-400" /></button></div>)}<p className="mt-2 text-xs text-gray-500">Total files: {queue.length} | Total size: {(queue.reduce((sum, item) => sum + item.sizeBytes, 0) / 1048576).toFixed(1)} MB</p><button type="button" onClick={analyze} className="mt-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Upload & Analyze</button></div>}
      </>}
      {phase === 'processing' && <div className="rounded-xl border border-blue-200 bg-white p-6"><ol className="space-y-3">{['File Validation — Checking file format and integrity...', 'Text Extraction — Reading document content...', 'Structure Analysis — Detecting chapters, topics, sub-topics...', 'Curriculum Matching — Mapping to existing curriculum...'].map((label, index) => <li key={label} className="flex items-center gap-3 text-sm"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}</span>{label}</li>)}</ol><p className="mt-4 text-sm text-gray-600">Processing: {queue[0]?.name} (1 of {queue.length})</p><div className="mt-2 h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${overall}%` }} /></div><p className="mt-1 text-xs text-gray-500">Overall Progress: {overall}%</p></div>}
      {phase === 'results' && <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">Analysis Complete — Please review the detected structure before confirming</div>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{queue[0]?.name}</p><p className="text-xs text-gray-500">Total pages: 24</p></div><span className={`rounded-full px-3 py-1 text-sm font-bold ${confidence >= 80 ? 'bg-green-100 text-green-700' : confidence >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>Confidence: {confidence}%</span></div>
        <div className="grid grid-cols-2 text-xs font-bold uppercase text-gray-500"><p>Detected From Document</p><p>Existing Curriculum</p></div>
        {detected.map((row) => <div key={row.id} className="rounded-lg border border-gray-200 p-3"><div className="flex flex-wrap items-center gap-2 text-sm"><span className="flex-1">{row.detected}</span><span className="text-gray-400">═══▶</span><span className="flex-1">{row.matchLabel}</span><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${row.status === 'matched' ? 'bg-green-100 text-green-700' : row.status === 'review' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{row.status === 'matched' ? 'Auto Matched' : row.status === 'review' ? 'Needs Review' : 'New - Not in Curriculum'}</span></div>{(row.status !== 'matched' || editMapping) && <div className={`mt-2 space-y-1 rounded-md p-2 text-sm ${row.status === 'new' ? 'bg-blue-50' : 'bg-amber-50'}`}><label className="flex items-center gap-2"><input type="radio" checked={row.action === 'map'} onChange={() => setDetected((current) => current.map((item) => item.id === row.id ? { ...item, action: 'map' } : item))} /> Map to existing curriculum node</label>{row.action === 'map' && <select className={inputCls} value={row.matchId} onChange={(event) => setDetected((current) => current.map((item) => item.id === row.id ? { ...item, matchId: event.target.value, matchLabel: filtered.find((ch) => ch.id === event.target.value)?.name || item.matchLabel } : item))}><option value="">Select node</option>{filtered.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}</select>}<label className="flex items-center gap-2"><input type="radio" checked={row.action === 'create'} onChange={() => setDetected((current) => current.map((item) => item.id === row.id ? { ...item, action: 'create' } : item))} /> Create as new node</label><label className="flex items-center gap-2"><input type="radio" checked={row.action === 'skip'} onChange={() => setDetected((current) => current.map((item) => item.id === row.id ? { ...item, action: 'skip' } : item))} /> Skip / Ignore this section</label></div>}</div>)}
        <div className="flex flex-wrap justify-end gap-2"><button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => setPhase('queue')}>Back</button><button type="button" className="rounded-lg border border-blue-400 px-4 py-2 text-sm text-blue-700" onClick={() => setEditMapping(true)}>Edit Mapping</button><button type="button" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white" onClick={confirmMapping}>Confirm & Save</button></div>
      </div>}
      {uploadSub === 'list' && <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={uploadSearch} onChange={(event) => { setUploadSearch(event.target.value); setUploadPage(1); }} placeholder="Search by file name..." className={`${inputCls} w-64 pl-9`} /></div></div>
        {uploadSelected.length > 0 && <div className="mb-2 flex gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm"><button type="button" onClick={() => { setUploads((current) => current.filter((item) => !uploadSelected.includes(item.id))); setUploadSelected([]); flash('success', 'Selected files deleted.'); }}>Delete Selected</button><button type="button" onClick={() => flash('success', 'Selected files queued for download.')}>Download Selected</button></div>}
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2"><input type="checkbox" checked={pagedUploads.length > 0 && pagedUploads.every((item) => uploadSelected.includes(item.id))} onChange={(event) => setUploadSelected(event.target.checked ? pagedUploads.map((item) => item.id) : [])} /></th><th className="px-3 py-2">#</th><th className="px-3 py-2">File Name</th><th className="px-3 py-2">Class</th><th className="px-3 py-2">Subject</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Chapters Mapped</th><th className="px-3 py-2">Upload Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Actions</th></tr></thead><tbody>{pagedUploads.map((item, index) => <tr key={item.id} className="border-t border-gray-100"><td className="px-3 py-2"><input type="checkbox" checked={uploadSelected.includes(item.id)} onChange={(event) => setUploadSelected(event.target.checked ? [...uploadSelected, item.id] : uploadSelected.filter((id) => id !== item.id))} /></td><td className="px-3 py-2">{(uploadPage - 1) * uploadPageSize + index + 1}</td><td className="px-3 py-2 font-medium text-blue-700"><FileText className="mr-1 inline h-4 w-4" />{item.fileName}</td><td className="px-3 py-2">{item.className}</td><td className="px-3 py-2">{item.subject}</td><td className="px-3 py-2"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{item.materialType}</span></td><td className="px-3 py-2">{item.mapped} {item.status === 'Processed' ? <Check className="ml-1 inline h-3.5 w-3.5 text-green-600" /> : null}</td><td className="px-3 py-2">{item.uploadDate}</td><td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.status === 'Processed' ? 'bg-green-100 text-green-700' : item.status === 'Partial' ? 'bg-orange-100 text-orange-700' : item.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></td><td className="px-3 py-2"><button type="button" className="mr-1" title="Preview" onClick={() => flash('info', `Previewing ${item.fileName}`)}><Eye className="inline h-4 w-4" /></button><button type="button" className="mr-1" title="Re-Analyze" onClick={() => { setQueue([{ id: item.id, name: item.fileName, size: '1.2 MB', sizeBytes: 1200000, kind: 'PDF', progress: 0 }]); setUploadSub('upload'); analyze(); }}><RefreshCw className="inline h-4 w-4" /></button><button type="button" title="Delete" onClick={() => setUploads((current) => current.filter((row) => row.id !== item.id))}><Trash2 className="inline h-4 w-4 text-red-500" /></button></td></tr>)}</tbody></table></div>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600"><span>Showing {(uploadPage - 1) * uploadPageSize + 1}–{Math.min(uploadPage * uploadPageSize, uploadRows.length)} of {uploadRows.length} results</span><div className="flex gap-1"><button type="button" disabled={uploadPage === 1} onClick={() => setUploadPage((value) => value - 1)} className="rounded border px-2 py-1 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>{Array.from({ length: uploadPageCount }, (_, index) => index + 1).map((num) => <button key={num} type="button" onClick={() => setUploadPage(num)} className={`h-8 w-8 rounded ${uploadPage === num ? 'bg-blue-600 text-white' : 'border'}`}>{num}</button>)}<button type="button" disabled={uploadPage === uploadPageCount} onClick={() => setUploadPage((value) => value + 1)} className="rounded border px-2 py-1 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div>
      </div>}
    </div>}

    {addOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50" onClick={() => setAddOpen(false)} /><div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-3"><h3 className="font-semibold">Add New Curriculum Node</h3><button type="button" onClick={() => setAddOpen(false)}><X className="h-5 w-5 text-gray-400" /></button></div><div className="space-y-3 p-5"><div className="grid grid-cols-3 gap-2">{(['chapter', 'topic', 'subtopic'] as const).map((item) => <button key={item} type="button" onClick={() => setAddType(item)} className={`rounded-lg border px-3 py-2 text-sm capitalize ${addType === item ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700' : 'border-gray-200'}`}>{item === 'subtopic' ? 'Sub-Topic' : item}</button>)}</div><div className="grid gap-3 md:grid-cols-2">{field('Academic Year', <select className={inputCls} value={addForm.year} onChange={(event) => setAddForm((current) => ({ ...current, year: event.target.value }))}>{ACADEMIC_YEARS.map((item) => <option key={item}>{item}</option>)}</select>)}{field('Class', <select className={inputCls} value={addForm.className} onChange={(event) => setAddForm((current) => ({ ...current, className: event.target.value }))}>{CLASSES.map((item) => <option key={item}>{item}</option>)}</select>)}{field('Subject', <select className={inputCls} value={addForm.subject} onChange={(event) => setAddForm((current) => ({ ...current, subject: event.target.value }))}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select>)}</div>{addType !== 'chapter' && field('Parent Chapter', <select className={inputCls} value={addForm.parentChapter} onChange={(event) => setAddForm((current) => ({ ...current, parentChapter: event.target.value }))}><option value="">Select</option>{chapters.filter((item) => item.className === addForm.className && item.subject === addForm.subject).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>)}{addType === 'subtopic' && field('Parent Topic', <select className={inputCls} value={addForm.parentTopic} onChange={(event) => setAddForm((current) => ({ ...current, parentTopic: event.target.value }))}><option value="">Select</option>{(chapters.find((item) => item.id === addForm.parentChapter)?.topics || []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>)}{field('Name *', <input className={inputCls} value={addForm.name} onChange={(event) => setAddForm((current) => ({ ...current, name: event.target.value }))} />)}{field('Description', <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={3} value={addForm.description} onChange={(event) => setAddForm((current) => ({ ...current, description: event.target.value }))} />)}{field('Sequence Order', <input className={`${inputCls} bg-gray-50`} value={addForm.sequence} onChange={(event) => setAddForm((current) => ({ ...current, sequence: event.target.value }))} />)}{field('Status', <select className={inputCls} value={addForm.status} onChange={(event) => setAddForm((current) => ({ ...current, status: event.target.value }))}><option>Active</option><option>Draft</option><option>Inactive</option></select>)}</div><div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3"><button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => setAddOpen(false)}>Cancel</button><button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => saveAdd(false)}>Save</button><button type="button" className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700" onClick={() => saveAdd(true)}>Save & Add Another</button></div></div></div>}

    <Modal isOpen={Boolean(chapterForm)} onClose={() => { setChapterForm(null); setTopicForm(null); }} title={chapterForm ? `${chapters.some((item) => item.id === chapterForm.id) ? 'Edit' : 'Add'} Chapter & Topic` : 'Chapter & Topic'} size="xl" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setChapterForm(null); setTopicForm(null); }}>Cancel</Button><Button onClick={saveChapter}>Save Chapter & Topic</Button></div>}>
      {chapterForm && <div className="max-h-[76vh] space-y-4 overflow-y-auto pr-1"><PlanningPanel title="Panel 1 · Chapter Identity"><div className="grid gap-3 md:grid-cols-3"><TextField label="Class" value={chapterForm.className} onChange={(value) => updateChapter('className', value)} /><TextField label="Subject" value={chapterForm.subject} onChange={(value) => updateChapter('subject', value)} /><TextField label="Chapter Number" type="number" min="1" value={chapterForm.chapterNumber} onChange={(value) => { const next = { ...chapterForm, chapterNumber: Number(value) || 1 }; setChapterForm({ ...next, code: codeForChapter(next) }); }} /><TextField label="Chapter Name" value={chapterForm.name} onChange={(value) => updateChapter('name', value)} placeholder="Full official chapter name" /><TextField label="Chapter Code · Auto-generated" value={codeForChapter(chapterForm)} readOnly /><SelectField label="Term" value={chapterForm.term} onChange={(value) => updateChapter('term', value)} options={TERMS} /><SelectField label="Academic Year" value={chapterForm.academicYear} onChange={(value) => updateChapter('academicYear', value)} options={ACADEMIC_YEARS} /><TextField label="Syllabus URL" value={chapterForm.syllabusUrl} onChange={(value) => updateChapter('syllabusUrl', value)} /><SelectField label="Status" value={chapterForm.status} onChange={(value) => updateChapter('status', value as CurriculumChapter['status'])} options={['Active', 'Inactive']} /></div></PlanningPanel>
        <PlanningPanel title="Panel 3 · Chapter Content"><div className="grid gap-3 md:grid-cols-2"><TextAreaField label="Chapter Introduction" value={chapterForm.introduction} onChange={(value) => updateChapter('introduction', value)} /><TextAreaField label="Key Concepts · comma separated" value={chapterForm.keyConcepts} onChange={(value) => updateChapter('keyConcepts', value)} /><TextAreaField label="Key Vocabulary" value={chapterForm.keyVocabulary} onChange={(value) => updateChapter('keyVocabulary', value)} /><TextField label="NCERT Exercises" value={chapterForm.ncertExercises} onChange={(value) => updateChapter('ncertExercises', value)} /><TextAreaField label="Important Formulas" value={chapterForm.importantFormulas} onChange={(value) => updateChapter('importantFormulas', value)} /><TextAreaField label="Common Misconceptions" value={chapterForm.commonMisconceptions} onChange={(value) => updateChapter('commonMisconceptions', value)} /><TextAreaField label="Connection to Real Life" value={chapterForm.realLifeConnection} onChange={(value) => updateChapter('realLifeConnection', value)} /></div></PlanningPanel>
        {!topicForm && <PlanningPanel title="Topics in this chapter"><Button size="xs" variant="outline" onClick={() => { const next = createBlankTopic(chapterForm.id); next.number = `${chapterForm.chapterNumber}.${(chapterForm.topics || []).length + 1}`; next.code = codeForTopic(next); setChapterForm({ ...chapterForm, topics: [...(chapterForm.topics || []), next] }); setTopicForm(next); }}><Plus className="h-3.5 w-3.5" />Add Topic</Button></PlanningPanel>}
        {topicForm && <>
        <PlanningPanel title="Topics in this chapter">
          <div className="mb-3 flex flex-wrap gap-2">{(chapterForm.topics || []).map((topic) => <Button key={topic.id} size="xs" variant={topicForm.id === topic.id ? 'primary' : 'outline'} onClick={() => { const merged = (chapterForm.topics || []).map((item) => item.id === topicForm.id ? topicForm : item); setChapterForm({ ...chapterForm, topics: merged }); setTopicForm({ ...topic, subtopics: [...topic.subtopics], learningObjectives: [...topic.learningObjectives], questionTypes: [...topic.questionTypes] }); }}>Topic {topic.number}: {topic.name || 'Untitled'}</Button>)}<Button size="xs" variant="outline" onClick={() => { const merged = (chapterForm.topics || []).map((item) => item.id === topicForm.id ? topicForm : item); const next = createBlankTopic(chapterForm.id); next.number = `${chapterForm.chapterNumber}.${merged.length + 1}`; next.code = codeForTopic(next); setChapterForm({ ...chapterForm, topics: [...merged, next] }); setTopicForm(next); }}><Plus className="h-3.5 w-3.5" />Add Topic</Button></div>
        </PlanningPanel>
        <PlanningPanel title="Panel 1 · Topic Identity"><div className="grid gap-3 md:grid-cols-2"><TextField label="Chapter · Locked parent" value={chapterForm.name || ''} readOnly /><TextField label="Topic Number" value={topicForm.number} onChange={(value) => { const next = { ...topicForm, number: value }; setTopicForm({ ...next, code: codeForTopic(next) }); }} /><TextField label="Topic Name" value={topicForm.name} onChange={(value) => updateTopic('name', value)} /><TextField label="Topic Code · Auto-generated" value={codeForTopic(topicForm)} readOnly /><CheckField label="Has sub-topics" checked={topicForm.hasSubtopics} onChange={(checkedValue) => updateTopic('hasSubtopics', checkedValue)} /></div></PlanningPanel>
        <PlanningPanel title="Panel 2 · Sub-topics"><div className="space-y-2">{topicForm.subtopics.map((sub, index) => <div key={sub.id} className="grid gap-2 rounded-lg border border-slate-100 p-2 md:grid-cols-[110px_1fr_100px_1fr_auto]"><TextField label="Number" value={sub.number} onChange={(value) => editSubtopic(index, 'number', value)} /><TextField label="Sub-topic Name" value={sub.name} onChange={(value) => editSubtopic(index, 'name', value)} /><TextField label="Periods" type="number" min="0" value={sub.periods} onChange={(value) => editSubtopic(index, 'periods', Number(value) || 0)} /><TextField label="Teaching Notes" value={sub.teachingNotes} onChange={(value) => editSubtopic(index, 'teachingNotes', value)} /><Button size="xs" variant="ghost" className="self-end" onClick={() => updateTopic('subtopics', topicForm.subtopics.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button></div>)}<Button size="xs" variant="outline" onClick={() => updateTopic('subtopics', [...topicForm.subtopics, { id: newPlanningId('sub'), number: `${topicForm.number}.${topicForm.subtopics.length + 1}`, name: '', periods: 1, teachingNotes: '' }])}><Plus className="h-3.5 w-3.5" />Add Sub-topic</Button></div></PlanningPanel>
        </>}
      </div>}
    </Modal>

    {toast && <div className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white shadow-lg ${toast.kind === 'success' ? 'bg-green-600' : toast.kind === 'warning' ? 'bg-orange-500' : toast.kind === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>{toast.text}</div>}
  </div>;
}
