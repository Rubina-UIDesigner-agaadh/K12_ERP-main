import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Grid3X3,
  Inbox,
  Info,
  LayoutList,
  Maximize2,
  MessageSquare,
  Play,
  Printer,
  RefreshCw,
  Search,
  Share2,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const MATERIALS_KEY = 'k12-study-materials-v1';
const SHARES_KEY = 'k12-study-shares-v1';
const PAGE_SIZE_CARD = 12;
const PAGE_SIZE_LIST = 10;

type FileKind = 'PDF' | 'DOCX' | 'PPTX' | 'Video';
type MaterialType = 'Notes' | 'Textbook' | 'Worksheet' | 'Question Bank' | 'Reference';
type ViewMode = 'card' | 'list' | 'chapter';
type ShareTarget = 'teachers' | 'subject' | 'class' | 'students';
type RoleName = 'Teacher' | 'Admin' | 'Super Admin';

interface StudyMaterialRecord {
  id: string;
  fileName: string;
  className: string;
  subject: string;
  chapter: string;
  topic: string;
  materialType: MaterialType;
  fileKind: FileKind;
  size: string;
  sizeBytes: number;
  uploadedOn: string;
  uploadedAt: number;
  uploadedBy: string;
  downloads: number;
  pages: number;
  preview: string[];
}

interface SharedItem {
  id: string;
  materialId: string;
  sharedBy: string;
  sharedByRole: string;
  sharedAt: string;
  sharedAtMs: number;
  message?: string;
  expiry?: string;
  allowReshare: boolean;
  read: boolean;
}

interface Assignment {
  className: string;
  subjects: string[];
}

const CURRENT_USER: { name: string; role: RoleName; assignments: Assignment[] } = {
  name: 'Mrs. Priya Sharma',
  role: 'Teacher',
  assignments: [
    { className: 'Class 9', subjects: ['Mathematics', 'Science'] },
    { className: 'Class 10', subjects: ['Mathematics'] }
  ]
};

const TEACHERS = [
  { id: 't1', name: 'Mr. Rajesh Kumar', className: 'Class 10', subject: 'Mathematics', role: 'HOD - Mathematics' },
  { id: 't2', name: 'Mr. V. Patel', className: 'Class 10', subject: 'Mathematics', role: 'Teacher' },
  { id: 't3', name: 'Ms. Anita Verma', className: 'Class 9', subject: 'Science', role: 'Teacher' },
  { id: 't4', name: 'Mrs. S. Joshi', className: 'Class 10', subject: 'Chemistry', role: 'Teacher' },
  { id: 't5', name: 'Mr. Suresh Kumar', className: 'Class 9', subject: 'Mathematics', role: 'Teacher' },
  { id: 't6', name: 'Ms. Kavita Nair', className: 'Class 9', subject: 'Science', role: 'Teacher' }
];

const STUDENTS = [
  { id: 's1', name: 'Aarav Sharma', className: 'Class 10', division: 'A' },
  { id: 's2', name: 'Diya Patel', className: 'Class 10', division: 'B' },
  { id: 's3', name: 'Ishaan Mehta', className: 'Class 9', division: 'A' },
  { id: 's4', name: 'Ananya Iyer', className: 'Class 9', division: 'B' },
  { id: 's5', name: 'Rohan Gupta', className: 'Class 10', division: 'A' },
  { id: 's6', name: 'Meera Shah', className: 'Class 10', division: 'C' },
  { id: 's7', name: 'Kabir Singh', className: 'Class 9', division: 'A' }
];
const STUDENT_CLASSES = Array.from(new Set(STUDENTS.map((item) => item.className)));

const CURRICULUM: Record<string, Record<string, { name: string; topics: string[] }[]>> = {
  'Class 9': {
    Mathematics: [
      { name: 'Chapter 1: Number Systems', topics: ['1.1 Irrational Numbers', '1.2 Real Numbers and Decimal Expansions', '1.3 Operations on Real Numbers'] },
      { name: 'Chapter 2: Polynomials', topics: ['2.1 Polynomials in One Variable', '2.2 Zeroes of a Polynomial'] }
    ],
    Science: [
      { name: 'Chapter 1: Matter in Our Surroundings', topics: ['1.1 Physical Nature of Matter', '1.2 States of Matter'] },
      { name: 'Chapter 2: Is Matter Around Us Pure', topics: ['2.1 Mixtures', '2.2 Solutions'] }
    ]
  },
  'Class 10': {
    Mathematics: [
      { name: 'Chapter 1: Real Numbers', topics: ['1.1 Introduction to Real Numbers', "1.2 Euclid's Division Lemma", '1.3 Fundamental Theorem'] },
      { name: 'Chapter 2: Polynomials', topics: ['2.1 Geometrical Meaning of Zeroes', '2.2 Relationship between Zeroes and Coefficients'] },
      { name: 'Chapter 3: Linear Equations', topics: ['3.1 Pair of Linear Equations', '3.2 Graphical Method', '3.3 Algebraic Methods'] }
    ]
  }
};

const TYPE_STYLES: Record<MaterialType, string> = {
  Notes: 'bg-blue-600 text-white',
  Textbook: 'bg-purple-600 text-white',
  Worksheet: 'bg-green-600 text-white',
  'Question Bank': 'bg-amber-500 text-white',
  Reference: 'bg-slate-600 text-white'
};

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const saveJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
};

const pages = (title: string, body: string) => [
  `${title}\n\n${body}`,
  `${title} — continued\n\nWorked example 1\nStep 1. Identify the given values.\nStep 2. Apply the relevant result.\nStep 3. Write the conclusion.`,
  `${title} — practice\n\n1. Solve the first exercise.\n2. Compare your method with the notes.\n3. Attempt the challenge question.`
];

const seedMaterials = (): StudyMaterialRecord[] => [
  { id: 'm1', fileName: 'Real_Numbers_Intro.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: '1.1 Introduction to Real Numbers', materialType: 'Notes', fileKind: 'PDF', size: '2.1 MB', sizeBytes: 2100000, uploadedOn: '15 Oct 2026', uploadedAt: Date.parse('2026-10-15'), uploadedBy: 'Mrs. Priya Sharma', downloads: 48, pages: 24, preview: pages('Real Numbers — Introduction', 'A real number is any value on the number line, including rationals and irrationals.') },
  { id: 'm2', fileName: 'Real_Numbers_PPT.pptx', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: '1.1 Introduction to Real Numbers', materialType: 'Notes', fileKind: 'PPTX', size: '5.0 MB', sizeBytes: 5000000, uploadedOn: '15 Oct 2026', uploadedAt: Date.parse('2026-10-15'), uploadedBy: 'Mrs. Priya Sharma', downloads: 31, pages: 12, preview: ['Slide 1 — Real Numbers', 'Slide 2 — Number line', 'Slide 3 — Rational vs Irrational', 'Slide 4 — Decimal expansions'] },
  { id: 'm3', fileName: 'Euclid_Division_Lemma.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: "1.2 Euclid's Division Lemma", materialType: 'Notes', fileKind: 'PDF', size: '1.8 MB', sizeBytes: 1800000, uploadedOn: '16 Oct 2026', uploadedAt: Date.parse('2026-10-16'), uploadedBy: 'Mrs. Priya Sharma', downloads: 22, pages: 10, preview: pages("Euclid's Division Lemma", 'For any two positive integers a and b there exist unique integers q and r such that a = bq + r, 0 ≤ r < b.') },
  { id: 'm4', fileName: 'FTA_Practice_Worksheet.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: '1.3 Fundamental Theorem', materialType: 'Worksheet', fileKind: 'PDF', size: '900 KB', sizeBytes: 900000, uploadedOn: '17 Oct 2026', uploadedAt: Date.parse('2026-10-17'), uploadedBy: 'Mrs. Priya Sharma', downloads: 19, pages: 6, preview: pages('Fundamental Theorem of Arithmetic', 'Every composite number can be expressed as a product of primes, unique up to order.') },
  { id: 'm5', fileName: 'Real_Numbers_Textbook.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: '1.1 Introduction to Real Numbers', materialType: 'Textbook', fileKind: 'PDF', size: '8.4 MB', sizeBytes: 8400000, uploadedOn: '04 Oct 2026', uploadedAt: Date.parse('2026-10-04'), uploadedBy: 'Library Desk', downloads: 90, pages: 18, preview: pages('NCERT · Real Numbers', 'Chapter excerpt for classroom use.') },
  { id: 'm6', fileName: 'Polynomial_Advanced_Notes.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.1 Geometrical Meaning of Zeroes', materialType: 'Notes', fileKind: 'PDF', size: '2.4 MB', sizeBytes: 2400000, uploadedOn: '20 Oct 2026', uploadedAt: Date.parse('2026-10-20'), uploadedBy: 'Mr. Rajesh Kumar', downloads: 41, pages: 16, preview: pages('Polynomials — Advanced Notes', 'Zeroes of a polynomial are the x-intercepts of its graph.') },
  { id: 'm7', fileName: 'Polynomials_Textbook.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.2 Relationship between Zeroes and Coefficients', materialType: 'Textbook', fileKind: 'PDF', size: '6.1 MB', sizeBytes: 6100000, uploadedOn: '05 Oct 2026', uploadedAt: Date.parse('2026-10-05'), uploadedBy: 'Library Desk', downloads: 55, pages: 14, preview: pages('NCERT · Polynomials', 'Relationship between zeroes and coefficients.') },
  { id: 'm8', fileName: 'Polynomials_Question_Bank.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.2 Relationship between Zeroes and Coefficients', materialType: 'Question Bank', fileKind: 'PDF', size: '1.1 MB', sizeBytes: 1100000, uploadedOn: '21 Oct 2026', uploadedAt: Date.parse('2026-10-21'), uploadedBy: 'Mrs. Priya Sharma', downloads: 27, pages: 8, preview: pages('Polynomials Question Bank', 'MCQ, short and long answer practice.') },
  { id: 'm9', fileName: 'Linear_Equations_Notes.docx', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 3: Linear Equations', topic: '3.1 Pair of Linear Equations', materialType: 'Notes', fileKind: 'DOCX', size: '780 KB', sizeBytes: 780000, uploadedOn: '18 Oct 2026', uploadedAt: Date.parse('2026-10-18'), uploadedBy: 'Mrs. Priya Sharma', downloads: 16, pages: 7, preview: pages('Pair of Linear Equations', 'Two linear equations in two variables represent a pair of straight lines.') },
  { id: 'm10', fileName: 'Linear_Equations_Graph.pptx', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 3: Linear Equations', topic: '3.2 Graphical Method', materialType: 'Notes', fileKind: 'PPTX', size: '4.2 MB', sizeBytes: 4200000, uploadedOn: '19 Oct 2026', uploadedAt: Date.parse('2026-10-19'), uploadedBy: 'Mrs. Priya Sharma', downloads: 14, pages: 9, preview: ['Slide 1 — Graphical method', 'Slide 2 — Intersecting lines', 'Slide 3 — Parallel lines', 'Slide 4 — Coincident lines'] },
  { id: 'm11', fileName: 'Algebraic_Methods_Worksheet.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 3: Linear Equations', topic: '3.3 Algebraic Methods', materialType: 'Worksheet', fileKind: 'PDF', size: '640 KB', sizeBytes: 640000, uploadedOn: '22 Oct 2026', uploadedAt: Date.parse('2026-10-22'), uploadedBy: 'Mrs. Priya Sharma', downloads: 11, pages: 5, preview: pages('Substitution and Elimination', 'Practice both algebraic methods.') },
  { id: 'm12', fileName: 'Number_Systems_Notes.pdf', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 1: Number Systems', topic: '1.1 Irrational Numbers', materialType: 'Notes', fileKind: 'PDF', size: '1.6 MB', sizeBytes: 1600000, uploadedOn: '08 Oct 2026', uploadedAt: Date.parse('2026-10-08'), uploadedBy: 'Mrs. Priya Sharma', downloads: 33, pages: 11, preview: pages('Irrational Numbers', 'Numbers that cannot be written as p/q.') },
  { id: 'm13', fileName: 'Decimal_Expansions_Worksheet.pdf', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 1: Number Systems', topic: '1.2 Real Numbers and Decimal Expansions', materialType: 'Worksheet', fileKind: 'PDF', size: '520 KB', sizeBytes: 520000, uploadedOn: '09 Oct 2026', uploadedAt: Date.parse('2026-10-09'), uploadedBy: 'Mrs. Priya Sharma', downloads: 18, pages: 4, preview: pages('Decimal Expansions', 'Terminating and non-terminating recurring decimals.') },
  { id: 'm14', fileName: 'Operations_On_Reals.pptx', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 1: Number Systems', topic: '1.3 Operations on Real Numbers', materialType: 'Notes', fileKind: 'PPTX', size: '3.3 MB', sizeBytes: 3300000, uploadedOn: '10 Oct 2026', uploadedAt: Date.parse('2026-10-10'), uploadedBy: 'Mrs. Priya Sharma', downloads: 21, pages: 8, preview: ['Slide 1 — Operations', 'Slide 2 — Closure', 'Slide 3 — Identities'] },
  { id: 'm15', fileName: 'Class9_Polynomials_Notes.pdf', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.1 Polynomials in One Variable', materialType: 'Notes', fileKind: 'PDF', size: '1.4 MB', sizeBytes: 1400000, uploadedOn: '11 Oct 2026', uploadedAt: Date.parse('2026-10-11'), uploadedBy: 'Mrs. Priya Sharma', downloads: 25, pages: 9, preview: pages('Polynomials in One Variable', 'Degree, coefficients and standard form.') },
  { id: 'm16', fileName: 'Zeroes_of_Polynomial_QB.pdf', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.2 Zeroes of a Polynomial', materialType: 'Question Bank', fileKind: 'PDF', size: '980 KB', sizeBytes: 980000, uploadedOn: '12 Oct 2026', uploadedAt: Date.parse('2026-10-12'), uploadedBy: 'Mrs. Priya Sharma', downloads: 17, pages: 7, preview: pages('Zeroes of a Polynomial', 'Find zeroes from factorisation.') },
  { id: 'm17', fileName: 'Matter_Notes.pdf', className: 'Class 9', subject: 'Science', chapter: 'Chapter 1: Matter in Our Surroundings', topic: '1.1 Physical Nature of Matter', materialType: 'Notes', fileKind: 'PDF', size: '2.0 MB', sizeBytes: 2000000, uploadedOn: '06 Oct 2026', uploadedAt: Date.parse('2026-10-06'), uploadedBy: 'Mrs. Priya Sharma', downloads: 44, pages: 13, preview: pages('Physical Nature of Matter', 'Matter is made up of particles.') },
  { id: 'm18', fileName: 'States_of_Matter.pptx', className: 'Class 9', subject: 'Science', chapter: 'Chapter 1: Matter in Our Surroundings', topic: '1.2 States of Matter', materialType: 'Notes', fileKind: 'PPTX', size: '4.8 MB', sizeBytes: 4800000, uploadedOn: '07 Oct 2026', uploadedAt: Date.parse('2026-10-07'), uploadedBy: 'Mrs. Priya Sharma', downloads: 29, pages: 10, preview: ['Slide 1 — Solid', 'Slide 2 — Liquid', 'Slide 3 — Gas'] },
  { id: 'm19', fileName: 'Mixtures_Worksheet.pdf', className: 'Class 9', subject: 'Science', chapter: 'Chapter 1: Matter in Our Surroundings', topic: '1.1 Physical Nature of Matter', materialType: 'Worksheet', fileKind: 'PDF', size: '430 KB', sizeBytes: 430000, uploadedOn: '08 Oct 2026', uploadedAt: Date.parse('2026-10-08'), uploadedBy: 'Mrs. Priya Sharma', downloads: 15, pages: 3, preview: pages('Matter worksheet', 'Short questions on particles and diffusion.') },
  { id: 'm20', fileName: 'Mixtures_Reference.pdf', className: 'Class 9', subject: 'Science', chapter: 'Chapter 2: Is Matter Around Us Pure', topic: '2.1 Mixtures', materialType: 'Reference', fileKind: 'PDF', size: '3.1 MB', sizeBytes: 3100000, uploadedOn: '13 Oct 2026', uploadedAt: Date.parse('2026-10-13'), uploadedBy: 'Ms. Anita Verma', downloads: 12, pages: 15, preview: pages('Mixtures reference', 'Homogeneous and heterogeneous mixtures.') },
  { id: 'm21', fileName: 'Solutions_Lab_Notes.docx', className: 'Class 9', subject: 'Science', chapter: 'Chapter 2: Is Matter Around Us Pure', topic: '2.2 Solutions', materialType: 'Notes', fileKind: 'DOCX', size: '610 KB', sizeBytes: 610000, uploadedOn: '14 Oct 2026', uploadedAt: Date.parse('2026-10-14'), uploadedBy: 'Mrs. Priya Sharma', downloads: 9, pages: 5, preview: pages('Solutions', 'Solute, solvent and concentration.') },
  { id: 'm22', fileName: 'Number_Systems_Video.mp4', className: 'Class 9', subject: 'Mathematics', chapter: 'Chapter 1: Number Systems', topic: '1.1 Irrational Numbers', materialType: 'Notes', fileKind: 'Video', size: '28 MB', sizeBytes: 28000000, uploadedOn: '12 Oct 2026', uploadedAt: Date.parse('2026-10-12'), uploadedBy: 'Mrs. Priya Sharma', downloads: 61, pages: 1, preview: ['Video lesson — Irrational numbers on the number line.'] },
  { id: 'm23', fileName: 'Real_Numbers_Revision.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 1: Real Numbers', topic: "1.2 Euclid's Division Lemma", materialType: 'Worksheet', fileKind: 'PDF', size: '720 KB', sizeBytes: 720000, uploadedOn: '23 Oct 2026', uploadedAt: Date.parse('2026-10-23'), uploadedBy: 'Mrs. Priya Sharma', downloads: 8, pages: 4, preview: pages('Revision worksheet', 'HCF using Euclid’s algorithm.') },
  { id: 'm24', fileName: 'Polynomials_Graph_Activity.pdf', className: 'Class 10', subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', topic: '2.1 Geometrical Meaning of Zeroes', materialType: 'Worksheet', fileKind: 'PDF', size: '860 KB', sizeBytes: 860000, uploadedOn: '24 Oct 2026', uploadedAt: Date.parse('2026-10-24'), uploadedBy: 'Mrs. Priya Sharma', downloads: 6, pages: 5, preview: pages('Graph activity', 'Plot quadratic polynomials and read zeroes.') },
  { id: 'm25', fileName: 'Coal_and_Petroleum_Notes.pdf', className: 'Class 8', subject: 'Science', chapter: 'Chapter 3: Coal and Petroleum', topic: '3.1 Natural resources', materialType: 'Notes', fileKind: 'PDF', size: '1.1 MB', sizeBytes: 1100000, uploadedOn: '01 Oct 2026', uploadedAt: Date.parse('2026-10-01'), uploadedBy: 'Ms. P. Roy', downloads: 20, pages: 8, preview: pages('Coal and Petroleum', 'Fossil fuels — not in this teacher’s assignment.') }
];

const seedShares = (): SharedItem[] => [
  { id: 'sh1', materialId: 'm6', sharedBy: 'Mr. Rajesh Kumar', sharedByRole: 'HOD - Mathematics', sharedAt: '25 Oct 2026, 10:30 AM', sharedAtMs: Date.parse('2026-10-25T10:30:00'), message: 'Please use these notes for mid-term prep', expiry: '30 Nov 2026', allowReshare: true, read: false },
  { id: 'sh2', materialId: 'm8', sharedBy: 'Mr. V. Patel', sharedByRole: 'Teacher', sharedAt: '26 Oct 2026, 09:10 AM', sharedAtMs: Date.parse('2026-10-26T09:10:00'), message: 'Question bank for extra practice.', allowReshare: false, read: false },
  { id: 'sh3', materialId: 'm20', sharedBy: 'Ms. Anita Verma', sharedByRole: 'Teacher', sharedAt: '27 Oct 2026, 04:15 PM', sharedAtMs: Date.parse('2026-10-27T16:15:00'), allowReshare: true, read: false },
  { id: 'sh4', materialId: 'm5', sharedBy: 'Library Desk', sharedByRole: 'Admin', sharedAt: '18 Oct 2026, 11:00 AM', sharedAtMs: Date.parse('2026-10-18T11:00:00'), message: 'Updated textbook scan.', allowReshare: true, read: true },
  { id: 'sh5', materialId: 'm7', sharedBy: 'Mr. Rajesh Kumar', sharedByRole: 'HOD - Mathematics', sharedAt: '12 Oct 2026, 02:40 PM', sharedAtMs: Date.parse('2026-10-12T14:40:00'), expiry: '15 Dec 2026', allowReshare: false, read: true }
];

const isAdminRole = (role: RoleName) => role === 'Admin' || role === 'Super Admin';

const fileIconBox = (kind: FileKind, large = false) => {
  const size = large ? 'h-16 w-16 text-3xl' : 'h-10 w-10 text-lg';
  if (kind === 'PDF') return <div className={`${size} flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold`}>PDF</div>;
  if (kind === 'DOCX') return <div className={`${size} flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold`}>W</div>;
  if (kind === 'PPTX') return <div className={`${size} flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 font-bold`}>PPT</div>;
  return (
    <div className={`${size} relative flex items-center justify-center rounded-lg bg-slate-800 text-white`}>
      <Play className={large ? 'h-7 w-7' : 'h-4 w-4'} fill="currentColor" />
    </div>
  );
};

const highlight = (text: string, q: string) => {
  if (!q || q.length < 2) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200 px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const downloadBlob = (row: StudyMaterialRecord) => {
  const blob = new Blob([`${row.fileName}\n${row.className} | ${row.subject}\n${row.chapter}\n${row.topic}\n\n${row.preview.join('\n\n')}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const ext = row.fileKind === 'PDF' ? 'pdf' : row.fileKind === 'DOCX' ? 'docx' : row.fileKind === 'PPTX' ? 'pptx' : 'mp4';
  link.href = url;
  link.download = row.fileName.includes('.') ? row.fileName : `${row.fileName}.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

type ToastKind = 'success' | 'warning' | 'error' | 'info';

export function StudyMaterial() {
  const [materials, setMaterials] = useState<StudyMaterialRecord[]>(() => {
    const saved = loadJson<StudyMaterialRecord[]>(MATERIALS_KEY, []);
    return saved.length ? saved : seedMaterials();
  });
  const [shares, setShares] = useState<SharedItem[]>(() => {
    const saved = loadJson<SharedItem[]>(SHARES_KEY, []);
    return saved.length ? saved : seedShares();
  });
  const [tab, setTab] = useState<'mine' | 'shared'>('mine');
  const [draftClass, setDraftClass] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftChapter, setDraftChapter] = useState('');
  const [draftType, setDraftType] = useState('All Types');
  const [draftSearch, setDraftSearch] = useState('');
  const [applied, setApplied] = useState({ className: '', subject: '', chapter: '', type: 'All Types', search: '' });
  const [view, setView] = useState<ViewMode>('card');
  const [sortBy, setSortBy] = useState('Newest First');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<StudyMaterialRecord | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [shareRow, setShareRow] = useState<StudyMaterialRecord | null>(null);
  const [shareTarget, setShareTarget] = useState<ShareTarget>('teachers');
  const [shareQuery, setShareQuery] = useState('');
  const [sharePicked, setSharePicked] = useState<string[]>([]);
  const [shareClass, setShareClass] = useState('');
  const [shareDivision, setShareDivision] = useState('');
  const [shareStudentId, setShareStudentId] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareExpiryOn, setShareExpiryOn] = useState(false);
  const [shareExpiry, setShareExpiry] = useState('');
  const [shareReshare, setShareReshare] = useState(false);
  const [shareNotify, setShareNotify] = useState(true);
  const [shareEmail, setShareEmail] = useState(false);
  const [detailsRow, setDetailsRow] = useState<StudyMaterialRecord | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [sharedFilter, setSharedFilter] = useState<'all' | 'unread' | 'week' | 'month'>('all');
  const [sharedSort, setSharedSort] = useState('Newest First');
  const [toast, setToast] = useState<{ kind: ToastKind; text: string } | null>(null);
  const [tooltip, setTooltip] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const user = CURRENT_USER;
  const admin = isAdminRole(user.role);

  useEffect(() => { saveJson(MATERIALS_KEY, materials); }, [materials]);
  useEffect(() => { saveJson(SHARES_KEY, shares); }, [shares]);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const flash = (kind: ToastKind, text: string) => setToast({ kind, text });

  const assignedClasses = user.assignments.map((item) => item.className);
  const subjectsForClass = (className: string) => {
    if (!className) {
      const all = new Set<string>();
      user.assignments.forEach((item) => item.subjects.forEach((subject) => all.add(subject)));
      return Array.from(all);
    }
    return user.assignments.find((item) => item.className === className)?.subjects || [];
  };
  const chaptersFor = (className: string, subject: string) => {
    if (!className || !subject) return [];
    return (CURRICULUM[className]?.[subject] || []).map((item) => item.name);
  };

  const allowed = (row: StudyMaterialRecord) => {
    if (admin) return true;
    const match = user.assignments.find((item) => item.className === row.className);
    return Boolean(match && match.subjects.includes(row.subject));
  };

  const mine = useMemo(() => materials.filter(allowed), [materials, admin]);

  const filtered = useMemo(() => {
    let rows = mine.filter((row) => {
      if (applied.className && row.className !== applied.className) return false;
      if (applied.subject && row.subject !== applied.subject) return false;
      if (applied.chapter && row.chapter !== applied.chapter) return false;
      if (applied.type !== 'All Types' && row.materialType !== applied.type) return false;
      if (applied.search) {
        const q = applied.search.toLowerCase();
        if (![row.fileName, row.chapter, row.topic, row.subject].some((value) => value.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'Oldest First') return a.uploadedAt - b.uploadedAt;
      if (sortBy === 'Name A-Z') return a.fileName.localeCompare(b.fileName);
      if (sortBy === 'Name Z-A') return b.fileName.localeCompare(a.fileName);
      if (sortBy === 'Most Downloaded') return b.downloads - a.downloads;
      return b.uploadedAt - a.uploadedAt;
    });
    return rows;
  }, [mine, applied, sortBy]);

  const pageSize = view === 'list' ? PAGE_SIZE_LIST : PAGE_SIZE_CARD;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const groupedBySubject = useMemo(() => {
    const map = new Map<string, StudyMaterialRecord[]>();
    filtered.forEach((row) => {
      const list = map.get(row.subject) || [];
      list.push(row);
      map.set(row.subject, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const runFilter = (next = { className: draftClass, subject: draftSubject, chapter: draftChapter, type: draftType, search: draftSearch }) => {
    setLoading(true);
    window.setTimeout(() => {
      setApplied(next);
      setPage(1);
      setSelected([]);
      setLoading(false);
    }, 350);
  };

  const liveResults = useMemo(() => {
    const q = draftSearch.trim();
    if (q.length < 2) return { chapters: [] as string[], topics: [] as string[], materials: [] as StudyMaterialRecord[] };
    const lower = q.toLowerCase();
    const chapters = new Set<string>();
    const topics = new Set<string>();
    mine.forEach((row) => {
      if (row.chapter.toLowerCase().includes(lower)) chapters.add(row.chapter);
      if (row.topic.toLowerCase().includes(lower)) topics.add(row.topic);
    });
    return {
      chapters: Array.from(chapters).slice(0, 5),
      topics: Array.from(topics).slice(0, 5),
      materials: mine.filter((row) => row.fileName.toLowerCase().includes(lower)).slice(0, 6)
    };
  }, [draftSearch, mine]);

  const unreadCount = shares.filter((item) => !item.read).length;
  const materialById = (id: string) => materials.find((item) => item.id === id);

  const sharedRows = useMemo(() => {
    const now = Date.parse('2026-10-28T12:00:00');
    const weekAgo = now - 7 * 24 * 3600 * 1000;
    const monthAgo = now - 30 * 24 * 3600 * 1000;
    let rows = shares.filter((item) => {
      if (sharedFilter === 'unread' && item.read) return false;
      if (sharedFilter === 'week' && item.sharedAtMs < weekAgo) return false;
      if (sharedFilter === 'month' && item.sharedAtMs < monthAgo) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => sharedSort === 'Oldest First' ? a.sharedAtMs - b.sharedAtMs : b.sharedAtMs - a.sharedAtMs);
    return rows;
  }, [shares, sharedFilter, sharedSort]);

  const sharedBySubject = useMemo(() => {
    const map = new Map<string, SharedItem[]>();
    sharedRows.forEach((item) => {
      const subject = materialById(item.materialId)?.subject || 'Other';
      const list = map.get(subject) || [];
      list.push(item);
      map.set(subject, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [sharedRows, materials]);

  const openPreview = (row: StudyMaterialRecord) => {
    setPreview(row);
    setPreviewPage(1);
    setZoom(100);
  };

  const doDownload = (row: StudyMaterialRecord) => {
    downloadBlob(row);
    setMaterials((current) => current.map((item) => item.id === row.id ? { ...item, downloads: item.downloads + 1 } : item));
    flash('success', `Downloaded “${row.fileName}”.`);
  };

  const openShare = (row: StudyMaterialRecord) => {
    setShareRow(row);
    setShareTarget('teachers');
    setShareQuery('');
    setSharePicked([]);
    setShareClass('');
    setShareDivision('');
    setShareStudentId('');
    setShareMessage('');
    setShareExpiryOn(false);
    setShareExpiry('');
    setShareReshare(false);
    setShareNotify(true);
    setShareEmail(false);
  };

  const sharePeople = () => {
    if (shareTarget === 'students') {
      return STUDENTS.filter((item) => {
        if (shareClass && item.className !== shareClass) return false;
        if (shareDivision && item.division !== shareDivision) return false;
        if (shareStudentId && item.id !== shareStudentId) return false;
        if (shareQuery && !item.name.toLowerCase().includes(shareQuery.toLowerCase())) return false;
        return true;
      });
    }
    let list = TEACHERS;
    if (shareTarget === 'subject' && shareRow) list = TEACHERS.filter((item) => item.subject === shareRow.subject);
    if (shareTarget === 'class' && shareRow) list = TEACHERS.filter((item) => item.className === shareRow.className);
    return list.filter((item) => !shareQuery || item.name.toLowerCase().includes(shareQuery.toLowerCase()));
  };

  const confirmShare = () => {
    if (!shareRow) return;
    const people = shareTarget === 'students'
      ? STUDENTS.filter((item) => sharePicked.includes(item.id))
      : shareTarget === 'teachers'
        ? TEACHERS.filter((item) => sharePicked.includes(item.id))
        : sharePeople();
    if (!people.length) {
      flash('error', 'Select at least one recipient.');
      return;
    }
    const nextShares = people.map((person) => ({
      id: `sh-${Date.now()}-${person.id}`,
      materialId: shareRow.id,
      sharedBy: user.name,
      sharedByRole: user.role,
      sharedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      sharedAtMs: Date.now(),
      message: shareMessage.trim() || undefined,
      expiry: shareExpiryOn ? shareExpiry : undefined,
      allowReshare: shareReshare,
      read: false
    }));
    setShares((current) => [...nextShares, ...current]);
    setShareRow(null);
    flash('success', `Material shared successfully with ${people.length} ${shareTarget === 'students' ? 'student' : 'teacher'}${people.length === 1 ? '' : 's'}.`);
  };

  const markRead = (id: string) => setShares((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  const markAllRead = () => {
    setShares((current) => current.map((item) => ({ ...item, read: true })));
    flash('info', 'All shared materials marked as read.');
  };

  const chapterGroups = useMemo(() => {
    const className = applied.className || assignedClasses[0] || 'Class 10';
    const subject = applied.subject || subjectsForClass(className)[0] || 'Mathematics';
    const chapters = CURRICULUM[className]?.[subject] || [];
    return chapters.map((chapter) => ({
      ...chapter,
      materials: filtered.filter((row) => row.chapter === chapter.name),
      topics: chapter.topics.map((topic) => ({
        name: topic,
        materials: filtered.filter((row) => row.chapter === chapter.name && row.topic === topic)
      }))
    }));
  }, [applied, filtered, assignedClasses]);

  const skeleton = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="h-32 animate-pulse bg-gray-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );

  const emptyMine = (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
      <FolderOpen className="mb-3 h-16 w-16 text-blue-200" />
      <p className="text-lg font-bold text-gray-800">No Materials Found</p>
      <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
    </div>
  );

  const actionBtn = (label: string, icon: React.ReactNode, color: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors ${color}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <BookOpen className="h-6 w-6 text-blue-600" /> Study Material
          </h1>
          <p className="mt-1 text-sm text-gray-500">Home &gt; Academics &gt; Study Material</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 400);
            flash('info', 'Materials refreshed.');
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {!admin && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">PS</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-gray-900">{user.name}</p>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">{user.role}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-600">
              Assigned Classes &amp; Subjects: {user.assignments.map((item) => `${item.className} (${item.subjects.join(', ')})`).join(' | ')}
            </p>
          </div>
          <div className="relative">
            <button type="button" className="rounded-full p-1 text-blue-600 hover:bg-blue-100" onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)}>
              <Info className="h-4 w-4" />
            </button>
            {tooltip && (
              <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                You can only view materials for your assigned classes and subjects.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab('mine')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm ${tab === 'mine' ? 'border-b-2 border-blue-600 font-bold text-blue-700' : 'font-medium text-gray-500'}`}
        >
          <BookOpen className="h-4 w-4" /> My Materials
        </button>
        <button
          type="button"
          onClick={() => { setTab('shared'); setShares((current) => current); }}
          className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm ${tab === 'shared' ? 'border-b-2 border-blue-600 font-bold text-blue-700' : 'font-medium text-gray-500'}`}
        >
          <Inbox className="h-4 w-4" /> Shared With Me
          {unreadCount > 0 && <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">{unreadCount}</span>}
        </button>
      </div>

      {tab === 'mine' && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-[140px] flex-1 text-xs font-medium text-gray-600">
                Class
                <select value={draftClass} onChange={(event) => { setDraftClass(event.target.value); setDraftSubject(''); setDraftChapter(''); }} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">All assigned</option>
                  {(admin ? ['Class 8', 'Class 9', 'Class 10'] : assignedClasses).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="min-w-[140px] flex-1 text-xs font-medium text-gray-600">
                Subject
                <select value={draftSubject} onChange={(event) => { setDraftSubject(event.target.value); setDraftChapter(''); }} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">All assigned</option>
                  {(admin ? ['Mathematics', 'Science'] : subjectsForClass(draftClass)).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="min-w-[180px] flex-1 text-xs font-medium text-gray-600">
                Chapter
                <select value={draftChapter} onChange={(event) => setDraftChapter(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="">All chapters</option>
                  {chaptersFor(draftClass, draftSubject).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="min-w-[140px] flex-1 text-xs font-medium text-gray-600">
                Material Type
                <select value={draftType} onChange={(event) => setDraftType(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none">
                  {['All Types', 'Notes', 'Textbook', 'Worksheet', 'Question Bank', 'Reference'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <div className="relative min-w-[220px] flex-[1.4]" ref={searchRef}>
                <label className="text-xs font-medium text-gray-600">Search</label>
                <div className="relative mt-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={draftSearch}
                    onChange={(event) => { setDraftSearch(event.target.value); setSearchOpen(event.target.value.trim().length >= 2); }}
                    onFocus={() => setSearchOpen(draftSearch.trim().length >= 2)}
                    onKeyDown={(event) => { if (event.key === 'Enter') { setSearchOpen(false); runFilter(); } }}
                    placeholder="Search by file name or keyword..."
                    className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {searchOpen && (liveResults.chapters.length + liveResults.topics.length + liveResults.materials.length > 0) && (
                  <div className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {liveResults.chapters.length > 0 && <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">Chapters</p>}
                    {liveResults.chapters.map((item) => (
                      <button key={item} type="button" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-blue-50" onClick={() => { setDraftChapter(item); setSearchOpen(false); runFilter({ ...applied, chapter: item, search: draftSearch, className: draftClass, subject: draftSubject, type: draftType }); }}>
                        {highlight(item, draftSearch)}
                      </button>
                    ))}
                    {liveResults.topics.length > 0 && <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">Topics</p>}
                    {liveResults.topics.map((item) => (
                      <button key={item} type="button" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-blue-50" onClick={() => { setDraftSearch(item); setSearchOpen(false); runFilter({ className: draftClass, subject: draftSubject, chapter: draftChapter, type: draftType, search: item }); }}>
                        {highlight(item, draftSearch)}
                      </button>
                    ))}
                    {liveResults.materials.length > 0 && <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">Materials</p>}
                    {liveResults.materials.map((item) => (
                      <button key={item.id} type="button" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-blue-50" onClick={() => { setSearchOpen(false); openPreview(item); }}>
                        {highlight(item.fileName, draftSearch)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => runFilter()} className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Apply</button>
              <button
                type="button"
                onClick={() => {
                  setDraftClass(''); setDraftSubject(''); setDraftChapter(''); setDraftType('All Types'); setDraftSearch('');
                  runFilter({ className: '', subject: '', chapter: '', type: 'All Types', search: '' });
                }}
                className="h-10 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
            {!admin && <p className="mt-2 text-xs italic text-gray-400">Showing materials for your assigned classes and subjects only.</p>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">Showing {filtered.length} materials</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
                <button type="button" onClick={() => setView('card')} className={`px-3 py-1.5 text-sm ${view === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`} title="Card View"><Grid3X3 className="h-4 w-4" /></button>
                <button type="button" onClick={() => setView('list')} className={`px-3 py-1.5 text-sm ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`} title="List View"><LayoutList className="h-4 w-4" /></button>
                <button type="button" onClick={() => setView('chapter')} className={`px-3 py-1.5 text-sm ${view === 'chapter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`} title="Chapter View"><BookOpen className="h-4 w-4" /></button>
              </div>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-9 rounded-lg border border-gray-300 px-2 text-sm">
                {['Newest First', 'Oldest First', 'Name A-Z', 'Name Z-A', 'Most Downloaded'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          {loading ? skeleton : filtered.length === 0 ? emptyMine : view === 'card' ? (
            <div className="space-y-6">
              {groupedBySubject.map(([subject, rows]) => (
                <section key={subject}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">{subject}</h3>
                    <span className="text-xs text-gray-500">{rows.length} material{rows.length === 1 ? '' : 's'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {rows.map((row) => (
                <div key={row.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="relative h-32 overflow-hidden bg-gray-100">
                    <div className="flex h-full items-center justify-center transition duration-300 group-hover:scale-110">
                      {row.fileKind === 'Video' ? (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white"><Play className="h-10 w-10" fill="currentColor" /></div>
                      ) : row.fileKind === 'PDF' ? (
                        <FileText className="h-14 w-14 text-red-500" />
                      ) : row.fileKind === 'DOCX' ? (
                        <FileText className="h-14 w-14 text-blue-500" />
                      ) : (
                        <FileText className="h-14 w-14 text-orange-500" />
                      )}
                    </div>
                    <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLES[row.materialType]}`}>{row.materialType}</span>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-bold text-gray-900">{row.fileName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><BookOpen className="h-3 w-3" /> {row.className} | {row.subject}</p>
                    <p className="mt-0.5 text-xs text-gray-500">Ch {row.chapter.replace('Chapter ', '')}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{row.size} • {row.uploadedOn}</p>
                  </div>
                  <div className="flex gap-1 border-t border-gray-100 p-2">
                    {actionBtn('View', <Eye className="h-3.5 w-3.5" />, 'border-gray-300 text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800', () => openPreview(row))}
                    {actionBtn('Download', <Download className="h-3.5 w-3.5" />, 'border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600', () => doDownload(row))}
                    {actionBtn('Share', <Share2 className="h-3.5 w-3.5" />, 'border-green-300 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600', () => openShare(row))}
                  </div>
                </div>
              ))}
                  </div>
                </section>
              ))}
            </div>
          ) : view === 'list' ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {selected.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2 text-sm">
                  <span className="font-semibold text-blue-800">{selected.length} selected</span>
                  <button type="button" className="rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-semibold text-blue-700" onClick={() => { filtered.filter((row) => selected.includes(row.id)).forEach(doDownload); }}>Download All</button>
                  <button type="button" className="rounded-md border border-green-300 bg-white px-3 py-1 text-xs font-semibold text-green-700" onClick={() => { const first = filtered.find((row) => selected.includes(row.id)); if (first) openShare(first); }}>Share All</button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-2"><input type="checkbox" checked={paged.length > 0 && paged.every((row) => selected.includes(row.id))} onChange={(event) => setSelected(event.target.checked ? Array.from(new Set([...selected, ...paged.map((row) => row.id)])) : selected.filter((id) => !paged.some((row) => row.id === id)))} /></th>
                      <th className="px-3 py-2">File</th>
                      <th className="px-3 py-2">Class</th>
                      <th className="px-3 py-2">Subject</th>
                      <th className="px-3 py-2">Chapter</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Uploaded On</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedBySubject.map(([subject, rows]) => (
                      <React.Fragment key={subject}>
                        <tr className="border-t border-gray-200 bg-slate-50">
                          <td colSpan={9} className="px-3 py-2 text-sm font-bold text-gray-800">{subject} <span className="font-normal text-gray-500">· {rows.length} material{rows.length === 1 ? '' : 's'}</span></td>
                        </tr>
                    {rows.map((row) => (
                      <tr key={row.id} className="group border-t border-gray-100 hover:bg-blue-50">
                        <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(row.id)} onChange={(event) => setSelected(event.target.checked ? [...selected, row.id] : selected.filter((id) => id !== row.id))} /></td>
                        <td className="px-3 py-2">
                          <button type="button" className="flex items-center gap-2 font-medium text-blue-700 hover:underline" onClick={() => openPreview(row)}>
                            {fileIconBox(row.fileKind)}
                            <span>{row.fileName}</span>
                          </button>
                        </td>
                        <td className="px-3 py-2">{row.className}</td>
                        <td className="px-3 py-2">{row.subject}</td>
                        <td className="px-3 py-2">{row.chapter}</td>
                        <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLES[row.materialType]}`}>{row.materialType}</span></td>
                        <td className="px-3 py-2">{row.size}</td>
                        <td className="px-3 py-2">{row.uploadedOn}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                            <button type="button" className="rounded p-1 hover:bg-white" title="View" onClick={() => openPreview(row)}><Eye className="h-4 w-4" /></button>
                            <button type="button" className="rounded p-1 hover:bg-white" title="Download" onClick={() => doDownload(row)}><Download className="h-4 w-4" /></button>
                            <button type="button" className="rounded p-1 hover:bg-white" title="Share" onClick={() => openShare(row)}><Share2 className="h-4 w-4" /></button>
                            <button type="button" className="rounded p-1 hover:bg-white" title="Details" onClick={() => setDetailsRow(row)}><Info className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {chapterGroups.map((chapter) => (
                <div key={chapter.name} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left" onClick={() => setExpandedChapters((current) => ({ ...current, [chapter.name]: !current[chapter.name] }))}>
                    <span className="flex items-center gap-2 font-semibold text-gray-800">
                      {expandedChapters[chapter.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <BookOpen className="h-4 w-4 text-orange-500" /> {chapter.name}
                    </span>
                    <span className="text-xs text-gray-500">{chapter.materials.length} Materials</span>
                  </button>
                  {expandedChapters[chapter.name] && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                      {chapter.topics.map((topic) => (
                        <div key={topic.name} className="mb-1">
                          <button type="button" className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-white" onClick={() => setExpandedTopics((current) => ({ ...current, [topic.name]: !current[topic.name] }))}>
                            <span className="flex items-center gap-2">
                              {expandedTopics[topic.name] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                              <FileText className="h-3.5 w-3.5 text-blue-500" /> {topic.name}
                            </span>
                            <span className="text-xs text-gray-500">{topic.materials.length ? `${topic.materials.length} Material${topic.materials.length === 1 ? '' : 's'}` : 'No Materials'}</span>
                          </button>
                          {expandedTopics[topic.name] && (
                            <div className="ml-7 space-y-1 pb-2">
                              {topic.materials.length === 0 ? (
                                <p className="text-xs italic text-gray-400">No study material available for this topic.</p>
                              ) : topic.materials.map((row) => (
                                <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                                  <span className="flex items-center gap-2"><span className="text-xs font-bold text-gray-500">{row.fileKind}</span> {row.fileName} <span className="text-xs text-gray-400">{row.size}</span></span>
                                  <span className="flex gap-1">
                                    <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs" onClick={() => openPreview(row)}>View</button>
                                    <button type="button" className="rounded border border-blue-300 px-2 py-1 text-xs text-blue-700" onClick={() => doDownload(row)}>Download</button>
                                    <button type="button" className="rounded border border-green-300 px-2 py-1 text-xs text-green-700" onClick={() => openShare(row)}>Share</button>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {view !== 'chapter' && !loading && filtered.length > 0 && (
            <p className="text-sm text-gray-600">{filtered.length} material{filtered.length === 1 ? '' : 's'} across {groupedBySubject.length} subject{groupedBySubject.length === 1 ? '' : 's'}</p>
          )}
        </>
      )}

      {tab === 'shared' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">Materials Shared With You</h2>
            <button type="button" className="text-sm font-semibold text-blue-600 hover:underline" onClick={markAllRead}>Mark All as Read</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' }
            ] as const).map((chip) => (
              <button key={chip.id} type="button" onClick={() => setSharedFilter(chip.id)} className={`rounded-full px-3 py-1 text-sm ${sharedFilter === chip.id ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-600'}`}>{chip.label}</button>
            ))}
            <select value={sharedSort} onChange={(event) => setSharedSort(event.target.value)} className="ml-auto h-9 rounded-lg border border-gray-300 px-2 text-sm">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
          {sharedRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <Inbox className="mb-3 h-24 w-24 text-blue-200" />
              <p className="text-lg font-bold text-gray-800">No Materials Shared Yet</p>
              <p className="mt-1 text-sm text-gray-500">When someone shares a study material with you, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sharedBySubject.map(([subject, items]) => (
                <section key={subject} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">{subject}</h3>
                    <span className="text-xs text-gray-500">{items.length} material{items.length === 1 ? '' : 's'}</span>
                  </div>
              {items.map((item) => {
                const row = materialById(item.materialId);
                if (!row) return null;
                return (
                  <div key={item.id} className={`flex flex-wrap items-start gap-4 rounded-xl border p-4 ${item.read ? 'border-gray-200 bg-white' : 'border-gray-200 border-l-4 border-l-blue-600 bg-[#FAFCFF]'}`}>
                    {fileIconBox(row.fileKind, true)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-gray-900">{row.fileName}</p>
                        {!item.read && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Shared by: {item.sharedBy} ({item.sharedByRole})</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" /> {item.sharedAt}</p>
                      <p className="mt-1 text-xs text-blue-700">{row.className} | {row.subject} | {row.chapter}</p>
                      {item.message && <p className="mt-1 flex items-center gap-1 text-xs italic text-gray-600"><MessageSquare className="h-3 w-3" /> Message: {item.message}</p>}
                      {item.expiry && <p className="mt-1 text-xs text-orange-600">Expires: {item.expiry}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white" onClick={() => { markRead(item.id); openPreview(row); }}><Eye className="h-3.5 w-3.5" /> View</button>
                      <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md border border-green-300 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-600 hover:text-white" onClick={() => { markRead(item.id); doDownload(row); }}><Download className="h-3.5 w-3.5" /> Download</button>
                      {item.allowReshare && <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100" onClick={() => openShare(row)}><Share2 className="h-3.5 w-3.5" /> Re-Share</button>}
                    </div>
                  </div>
                );
              })}
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-900 px-4 py-3 text-white">
            <p className="font-semibold">{preview.fileName}</p>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-md bg-white/10 px-3 py-1.5 text-sm" onClick={() => window.print()}><Printer className="mr-1 inline h-4 w-4" /> Print</button>
              <button type="button" className="rounded-md bg-white/10 px-3 py-1.5 text-sm" onClick={() => doDownload(preview)}><Download className="mr-1 inline h-4 w-4" /> Download</button>
              <button type="button" className="rounded-md bg-white/10 px-3 py-1.5 text-sm" onClick={() => { setPreview(null); openShare(preview); }}><Share2 className="mr-1 inline h-4 w-4" /> Share</button>
              <button type="button" className="rounded-md bg-white/10 p-1.5" onClick={() => setPreview(null)}><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-6">
            {preview.fileKind === 'Video' ? (
              <div className="flex h-[70vh] w-full max-w-4xl flex-col items-center justify-center rounded-xl bg-black text-white">
                <Play className="mb-3 h-16 w-16" fill="currentColor" />
                <p className="text-sm text-gray-300">{preview.preview[0]}</p>
                <video controls className="mt-4 h-12 w-full max-w-xl" />
              </div>
            ) : (
              <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-gray-800">{preview.preview[previewPage - 1]}</pre>
              </div>
            )}
          </div>
          {preview.fileKind !== 'Video' && (
            <div className="flex items-center justify-center gap-3 bg-gray-900 py-3 text-white">
              <button type="button" disabled={previewPage === 1} onClick={() => setPreviewPage((value) => value - 1)} className="rounded bg-white/10 p-1 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm">Page {previewPage} of {preview.preview.length}</span>
              <button type="button" disabled={previewPage === preview.preview.length} onClick={() => setPreviewPage((value) => value + 1)} className="rounded bg-white/10 p-1 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              <button type="button" onClick={() => setZoom((value) => Math.max(75, value - 10))} className="rounded bg-white/10 p-1"><ZoomOut className="h-4 w-4" /></button>
              <span className="text-xs">{zoom}%</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(150, value + 10))} className="rounded bg-white/10 p-1"><ZoomIn className="h-4 w-4" /></button>
              <button type="button" onClick={() => setZoom(100)} className="rounded bg-white/10 p-1"><Maximize2 className="h-4 w-4" /></button>
            </div>
          )}
          <div className="bg-gray-950 px-4 py-2 text-center text-xs text-gray-300">
            {preview.className} | {preview.subject} | {preview.chapter} | {preview.materialType} | {preview.size} | Uploaded: {preview.uploadedOn}
          </div>
        </div>
      )}

      {shareRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShareRow(null)} />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <h3 className="font-semibold text-gray-900">Share “{shareRow.fileName}”</h3>
              <button type="button" onClick={() => setShareRow(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-xs font-semibold uppercase text-gray-500">Share With</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'teachers', label: 'Individual Teacher(s)' },
                  { id: 'subject', label: 'All Teachers of this Subject' },
                  { id: 'class', label: 'All Teachers of this Class' },
                  { id: 'students', label: 'Specific Students' }
                ] as const).map((item) => (
                  <button key={item.id} type="button" onClick={() => { setShareTarget(item.id); setSharePicked([]); }} className={`rounded-lg border px-3 py-2 text-left text-sm ${shareTarget === item.id ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700' : 'border-gray-200'}`}>{item.label}</button>
                ))}
              </div>
              {(shareTarget === 'teachers' || shareTarget === 'students') && (
                <div>
                  {shareTarget === 'students' && (
                    <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <label className="text-xs font-medium text-gray-600">
                        Class
                        <select value={shareClass} onChange={(event) => { setShareClass(event.target.value); setShareDivision(''); setShareStudentId(''); setSharePicked([]); }} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm">
                          <option value="">All classes</option>
                          {STUDENT_CLASSES.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-gray-600">
                        Division
                        <select value={shareDivision} onChange={(event) => { setShareDivision(event.target.value); setShareStudentId(''); setSharePicked([]); }} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm">
                          <option value="">All divisions</option>
                          {Array.from(new Set(STUDENTS.filter((item) => !shareClass || item.className === shareClass).map((item) => item.division))).map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-gray-600">
                        Student name
                        <select value={shareStudentId} onChange={(event) => { setShareStudentId(event.target.value); setSharePicked(event.target.value ? [event.target.value] : []); }} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm">
                          <option value="">All students</option>
                          {STUDENTS.filter((item) => (!shareClass || item.className === shareClass) && (!shareDivision || item.division === shareDivision)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                      </label>
                    </div>
                  )}
                  <input value={shareQuery} onChange={(event) => setShareQuery(event.target.value)} placeholder={shareTarget === 'students' ? 'Search students by name...' : 'Search teachers by name...'} className="mb-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm" />
                  <div className="max-h-44 overflow-auto rounded-lg border border-gray-200">
                    {sharePeople().map((person) => (
                      <label key={person.id} className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-0">
                        <input type="checkbox" checked={sharePicked.includes(person.id)} onChange={(event) => setSharePicked(event.target.checked ? [...sharePicked, person.id] : sharePicked.filter((id) => id !== person.id))} />
                        <span>
                          <span className="font-medium">{person.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{person.className}{'division' in person ? ` · ${person.division}` : ''}{'subject' in person ? ` · ${person.subject}` : ''}</span>
                        </span>
                      </label>
                    ))}
                    {sharePeople().length === 0 && <p className="px-3 py-3 text-sm text-gray-500">No students match class, division and name.</p>}
                  </div>
                </div>
              )}
              {(shareTarget === 'subject' || shareTarget === 'class') && (
                <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">Will share with {sharePeople().length} teacher{sharePeople().length === 1 ? '' : 's'}.</p>
              )}
              <textarea value={shareMessage} onChange={(event) => setShareMessage(event.target.value)} placeholder="Add a note or message (optional)..." className="h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={shareExpiryOn} onChange={(event) => setShareExpiryOn(event.target.checked)} /> Set expiry date</label>
                {shareExpiryOn && <input type="date" value={shareExpiry} onChange={(event) => setShareExpiry(event.target.value)} className="h-10 rounded-lg border border-gray-300 px-3 text-sm" />}
                <label className="flex items-center gap-2"><input type="checkbox" checked={shareReshare} onChange={(event) => setShareReshare(event.target.checked)} /> Allow recipient to re-share</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={shareNotify} onChange={(event) => setShareNotify(event.target.checked)} /> Send in-app notification</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={shareEmail} onChange={(event) => setShareEmail(event.target.checked)} /> Send email notification</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-3">
              <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => setShareRow(null)}>Cancel</button>
              <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={confirmShare}>Share Now</button>
            </div>
          </div>
        </div>
      )}

      {detailsRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailsRow(null)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Material details</h3>
              <button type="button" onClick={() => setDetailsRow(null)}><X className="h-4 w-4" /></button>
            </div>
            <dl className="space-y-1 text-sm">
              <p><b>File:</b> {detailsRow.fileName}</p>
              <p><b>Class / Subject:</b> {detailsRow.className} · {detailsRow.subject}</p>
              <p><b>Chapter:</b> {detailsRow.chapter}</p>
              <p><b>Topic:</b> {detailsRow.topic}</p>
              <p><b>Type:</b> {detailsRow.materialType} · {detailsRow.fileKind}</p>
              <p><b>Size:</b> {detailsRow.size}</p>
              <p><b>Uploaded:</b> {detailsRow.uploadedOn} by {detailsRow.uploadedBy}</p>
              <p><b>Downloads:</b> {detailsRow.downloads}</p>
            </dl>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white shadow-lg ${toast.kind === 'success' ? 'bg-green-600' : toast.kind === 'warning' ? 'bg-orange-500' : toast.kind === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
