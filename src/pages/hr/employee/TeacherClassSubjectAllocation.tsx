import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Flag,
  Info,
  Layers,
  Pencil,
  RotateCcw,
  Save,
  Users,
  X,
  XCircle } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  code: string;
  avatar: string;
  department: string;
  qualification: string;
  experience: number;
  subjects: string[];
  currentLoad: number;
  maxLoad: number;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  isClassTeacher: boolean;
  classTeacherOf: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'Theory' | 'Lab' | 'Practical' | 'Language' | 'Co-curricular';
  weeklySessions: number;
  assignedTeacher: string | null;
  alternateTeacher: string | null;
  isElective: boolean;
  maxStudents?: number;
}

interface ClassSection {
  id: string;
  value: string;
  label: string;
  grade: number;
  section: string;
  stream?: string;
  classTeacher: string | null;
  totalStudents: number;
  subjects: Subject[];
  roomNumber: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}


// ==================== MOCK DATA ====================
const academicYears = [
{ value: '2026-27', label: '2026-27 (Current)' },
{ value: '2025-26', label: '2025-26' },
{ value: '2024-25', label: '2024-25' }];


const mockTeachers: Teacher[] = [
{
  id: 'TCH001',
  name: 'Dr. Robert Smith',
  code: 'TCH001',
  avatar: 'RS',
  department: 'Mathematics',
  qualification: 'Ph.D. Mathematics',
  experience: 15,
  subjects: ['Mathematics', 'Statistics', 'Applied Mathematics'],
  currentLoad: 22,
  maxLoad: 24,
  email: 'robert.smith@school.edu',
  phone: '+91 98765 43210',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 10 - Section A'
},
{
  id: 'TCH002',
  name: 'Mrs. Sarah Johnson',
  code: 'TCH002',
  avatar: 'SJ',
  department: 'Physics',
  qualification: 'M.Sc. Physics, B.Ed',
  experience: 12,
  subjects: ['Physics', 'General Science'],
  currentLoad: 18,
  maxLoad: 24,
  email: 'sarah.johnson@school.edu',
  phone: '+91 98765 43211',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH003',
  name: 'Mr. Michael Chen',
  code: 'TCH003',
  avatar: 'MC',
  department: 'Chemistry',
  qualification: 'M.Sc. Chemistry',
  experience: 8,
  subjects: ['Chemistry', 'General Science', 'Environmental Science'],
  currentLoad: 20,
  maxLoad: 24,
  email: 'michael.chen@school.edu',
  phone: '+91 98765 43212',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 9 - Section B'
},
{
  id: 'TCH004',
  name: 'Ms. Emily Davis',
  code: 'TCH004',
  avatar: 'ED',
  department: 'English',
  qualification: 'M.A. English Literature',
  experience: 10,
  subjects: ['English', 'Literature', 'Creative Writing'],
  currentLoad: 16,
  maxLoad: 24,
  email: 'emily.davis@school.edu',
  phone: '+91 98765 43213',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 9 - Section A'
},
{
  id: 'TCH005',
  name: 'Mr. David Wilson',
  code: 'TCH005',
  avatar: 'DW',
  department: 'Social Science',
  qualification: 'M.A. History, B.Ed',
  experience: 14,
  subjects: ['History', 'Civics', 'Geography', 'Economics'],
  currentLoad: 14,
  maxLoad: 24,
  email: 'david.wilson@school.edu',
  phone: '+91 98765 43214',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH006',
  name: 'Mrs. Lisa Taylor',
  code: 'TCH006',
  avatar: 'LT',
  department: 'Biology',
  qualification: 'M.Sc. Zoology',
  experience: 9,
  subjects: ['Biology', 'Life Science', 'Botany', 'Zoology'],
  currentLoad: 19,
  maxLoad: 24,
  email: 'lisa.taylor@school.edu',
  phone: '+91 98765 43215',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH007',
  name: 'Mr. James Anderson',
  code: 'TCH007',
  avatar: 'JA',
  department: 'Computer Science',
  qualification: 'M.Tech. Computer Science',
  experience: 7,
  subjects: ['Computer Science', 'Programming', 'IT'],
  currentLoad: 24,
  maxLoad: 24,
  email: 'james.anderson@school.edu',
  phone: '+91 98765 43216',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 11 - Section A'
},
{
  id: 'TCH008',
  name: 'Ms. Jennifer Brown',
  code: 'TCH008',
  avatar: 'JB',
  department: 'Geography',
  qualification: 'M.A. Geography',
  experience: 6,
  subjects: ['Geography', 'Environmental Science', 'Map Reading'],
  currentLoad: 12,
  maxLoad: 24,
  email: 'jennifer.brown@school.edu',
  phone: '+91 98765 43217',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH009',
  name: 'Dr. Patricia Martinez',
  code: 'TCH009',
  avatar: 'PM',
  department: 'Mathematics',
  qualification: 'Ph.D. Applied Mathematics',
  experience: 18,
  subjects: ['Mathematics', 'Advanced Math', 'Calculus'],
  currentLoad: 15,
  maxLoad: 24,
  email: 'patricia.martinez@school.edu',
  phone: '+91 98765 43218',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH010',
  name: 'Mr. Richard Lee',
  code: 'TCH010',
  avatar: 'RL',
  department: 'Physical Education',
  qualification: 'M.P.Ed',
  experience: 11,
  subjects: ['Physical Education', 'Health', 'Sports'],
  currentLoad: 20,
  maxLoad: 24,
  email: 'richard.lee@school.edu',
  phone: '+91 98765 43219',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 10 - Section B'
},
{
  id: 'TCH011',
  name: 'Mrs. Priya Sharma',
  code: 'TCH011',
  avatar: 'PS',
  department: 'Hindi',
  qualification: 'M.A. Hindi',
  experience: 13,
  subjects: ['Hindi', 'Sanskrit'],
  currentLoad: 18,
  maxLoad: 24,
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43220',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH012',
  name: 'Mr. Amit Kumar',
  code: 'TCH012',
  avatar: 'AK',
  department: 'Arts',
  qualification: 'M.F.A',
  experience: 5,
  subjects: ['Art', 'Craft', 'Music'],
  currentLoad: 16,
  maxLoad: 24,
  email: 'amit.kumar@school.edu',
  phone: '+91 98765 43221',
  status: 'On Leave',
  isClassTeacher: false,
  classTeacherOf: null
}];


const getSubjectsForGrade = (grade: number): Subject[] => {
  const commonSubjects: Subject[] = [
  { id: 'SUB001', name: 'Mathematics', code: 'MATH', type: 'Theory', weeklySessions: 6, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB002', name: 'English', code: 'ENG', type: 'Language', weeklySessions: 5, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB003', name: 'Hindi', code: 'HIN', type: 'Language', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB004', name: 'Physics', code: 'PHY', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB005', name: 'Physics Lab', code: 'PHY-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB006', name: 'Chemistry', code: 'CHEM', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB007', name: 'Chemistry Lab', code: 'CHEM-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB008', name: 'Biology', code: 'BIO', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB009', name: 'History', code: 'HIST', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB010', name: 'Geography', code: 'GEO', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB011', name: 'Computer Science', code: 'CS', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB012', name: 'Computer Lab', code: 'CS-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB013', name: 'Physical Education', code: 'PE', type: 'Practical', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB014', name: 'Art & Craft', code: 'ART', type: 'Co-curricular', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: true }];


  if (grade >= 11) {
    return [
    ...commonSubjects.slice(0, 8),
    { id: 'SUB015', name: 'Advanced Mathematics', code: 'ADV-MATH', type: 'Theory', weeklySessions: 5, assignedTeacher: null, alternateTeacher: null, isElective: false },
    { id: 'SUB016', name: 'Economics', code: 'ECO', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: true },
    ...commonSubjects.slice(10)];

  }
  return commonSubjects;
};

const initialClassSections: ClassSection[] = [
{ id: 'CS001', value: 'grade-9-a', label: 'Grade 9 - Section A', grade: 9, section: 'A', classTeacher: 'TCH004', totalStudents: 35, subjects: getSubjectsForGrade(9), roomNumber: '101' },
{ id: 'CS002', value: 'grade-9-b', label: 'Grade 9 - Section B', grade: 9, section: 'B', classTeacher: 'TCH003', totalStudents: 32, subjects: getSubjectsForGrade(9), roomNumber: '102' },
{ id: 'CS003', value: 'grade-10-a', label: 'Grade 10 - Section A', grade: 10, section: 'A', classTeacher: 'TCH001', totalStudents: 38, subjects: getSubjectsForGrade(10), roomNumber: '201' },
{ id: 'CS004', value: 'grade-10-b', label: 'Grade 10 - Section B', grade: 10, section: 'B', classTeacher: 'TCH010', totalStudents: 36, subjects: getSubjectsForGrade(10), roomNumber: '202' },
{ id: 'CS005', value: 'grade-11-a', label: 'Grade 11 - Section A (Science)', grade: 11, section: 'A', stream: 'Science', classTeacher: 'TCH007', totalStudents: 30, subjects: getSubjectsForGrade(11), roomNumber: '301' },
{ id: 'CS006', value: 'grade-11-b', label: 'Grade 11 - Section B (Commerce)', grade: 11, section: 'B', stream: 'Commerce', classTeacher: null, totalStudents: 28, subjects: getSubjectsForGrade(11), roomNumber: '302' }];


// ==================== TOAST COMPONENT ====================
const ToastContainer: React.FC<{toasts: Toast[];onDismiss: (id: string) => void;}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getStyle = (type: Toast['type']) => {
    switch (type) {
      case 'success':return 'bg-green-50 border-green-200 text-green-800';
      case 'error':return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[320px] ${getStyle(toast.type)}`}>
          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

// ==================== TEACHER DROPDOWN COMPONENT ====================
// ==================== ASSIGNMENT HELPERS ====================

interface SubjectAssignment {
  primary: string | null;
  co: string | null;
}

interface AssignmentState {
  classTeachers: Record<string, string | null>;
  subjectTeachers: Record<string, SubjectAssignment>;
}

type AuditAction = 'Assigned' | 'Changed' | 'Removed';

interface AuditEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  academicYear: string;
  action: AuditAction;
  classId: string;
  teacherId: string;
  role: 'Class Teacher' | 'Subject Teacher';
  subjectOrRole: string;
  doneBy: string;
}

type AuditDraft = Omit<AuditEntry, 'id' | 'date' | 'academicYear' | 'doneBy'>;

const TERM_OPTIONS = ['Term 1', 'Term 2', 'Full Year'];
const CURRENT_USER = 'Admin';
const CLASS_LIST: ClassSection[] = initialClassSections;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EMPTY_SUBJECT: SubjectAssignment = { primary: null, co: null };

const toIsoLocal = (date: Date): string =>
`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const formatDisplayDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}-${MONTH_SHORT[Number(month) - 1]}-${year}`;
};

const classShortLabel = (cls: ClassSection): string =>
`Gr ${cls.grade}-${cls.section}${cls.stream ? ` (${cls.stream})` : ''}`;

const findClass = (classId: string): ClassSection | undefined => CLASS_LIST.find((cls) => cls.id === classId);

const subjectKey = (classId: string, subjectId: string): string => `${classId}::${subjectId}`;

const sessionKeyOf = (year: string, term: string): string => `${year}|${term}`;

const getTeacher = (id: string | null | undefined): Teacher | undefined =>
id ? mockTeachers.find((teacher) => teacher.id === id) : undefined;

// Only active teachers are offered in dropdowns. Inactive / missing teachers are never offered.
const isOfferable = (teacher: Teacher | undefined): boolean => !!teacher && teacher.status === 'Active';

const offerableTeachers = mockTeachers
.filter((teacher) => isOfferable(teacher))
.sort((a, b) => a.name.localeCompare(b.name));

const subjectOf = (state: AssignmentState, classId: string, subjectId: string): SubjectAssignment =>
state.subjectTeachers[subjectKey(classId, subjectId)] ?? EMPTY_SUBJECT;

// Class where this teacher is already class teacher (ignoring one class)
const classWhereClassTeacher = (state: AssignmentState, teacherId: string, exceptClassId?: string): ClassSection | undefined =>
CLASS_LIST.find((cls) => cls.id !== exceptClassId && state.classTeachers[cls.id] === teacherId);

const statesEqual = (a: AssignmentState, b: AssignmentState): boolean => {
  const classIds = Object.keys({ ...a.classTeachers, ...b.classTeachers });
  if (classIds.some((id) => (a.classTeachers[id] ?? null) !== (b.classTeachers[id] ?? null))) return false;
  const subjectKeys = Object.keys({ ...a.subjectTeachers, ...b.subjectTeachers });
  return subjectKeys.every((key) => {
    const x = a.subjectTeachers[key] ?? EMPTY_SUBJECT;
    const y = b.subjectTeachers[key] ?? EMPTY_SUBJECT;
    return x.primary === y.primary && x.co === y.co;
  });
};

const buildInitialAssignments = (): AssignmentState => {
  const classTeachers: Record<string, string | null> = {};
  const subjectTeachers: Record<string, SubjectAssignment> = {};
  CLASS_LIST.forEach((cls, classIndex) => {
    classTeachers[cls.id] = cls.classTeacher;
    cls.subjects.forEach((subject, subjectIndex) => {
      const baseName = subject.name.replace(/ Lab$/, '').toLowerCase();
      const eligible = offerableTeachers.filter((teacher) =>
      teacher.subjects.some((name) => name.toLowerCase() === baseName));
      const primary = eligible.length > 0 ? eligible[(classIndex + subjectIndex) % eligible.length].id : null;
      subjectTeachers[subjectKey(cls.id, subject.id)] = { primary, co: null };
    });
  });
  return { classTeachers, subjectTeachers };
};

const SEED_AUDIT: AuditEntry[] = [
{ id: 'AUD-SEED-01', date: '2026-10-09', academicYear: '2026-27', action: 'Assigned', classId: 'CS003', teacherId: 'TCH001', role: 'Class Teacher', subjectOrRole: 'Class Teacher', doneBy: CURRENT_USER },
{ id: 'AUD-SEED-02', date: '2026-10-09', academicYear: '2026-27', action: 'Assigned', classId: 'CS004', teacherId: 'TCH010', role: 'Class Teacher', subjectOrRole: 'Class Teacher', doneBy: CURRENT_USER },
{ id: 'AUD-SEED-03', date: '2026-10-08', academicYear: '2026-27', action: 'Changed', classId: 'CS002', teacherId: 'TCH003', role: 'Subject Teacher', subjectOrRole: 'Mathematics', doneBy: CURRENT_USER },
{ id: 'AUD-SEED-04', date: '2026-10-08', academicYear: '2026-27', action: 'Removed', classId: 'CS001', teacherId: 'TCH004', role: 'Subject Teacher', subjectOrRole: 'Physics', doneBy: CURRENT_USER }];


const collectWarnings = (state: AssignmentState): string[] => {
  const warnings: string[] = [];
  CLASS_LIST.forEach((cls) => {
    if (!state.classTeachers[cls.id]) warnings.push(`${classShortLabel(cls)}: no class teacher`);
    cls.subjects.forEach((subject) => {
      const assignment = subjectOf(state, cls.id, subject.id);
      if (!assignment.primary) {
        warnings.push(`${classShortLabel(cls)} · ${subject.name}: no teacher`);
      } else if (classWhereClassTeacher(state, assignment.primary, cls.id)) {
        warnings.push(`${classShortLabel(cls)} · ${subject.name}: teacher is also a class teacher`);
      }
    });
  });
  return warnings;
};

// Validates class teacher selections. Inactive teachers are only rejected when newly selected.
const validateClassTeachers = (state: AssignmentState, changed: AuditDraft[]): string[] => {
  const errors: string[] = [];
  const used = new Map<string, string>();
  CLASS_LIST.forEach((cls) => {
    const teacherId = state.classTeachers[cls.id];
    if (!teacherId) return;
    if (changed.some((d) => d.classId === cls.id) && !isOfferable(getTeacher(teacherId))) {
      errors.push(`${classShortLabel(cls)}: selected teacher is inactive or missing`);
    }
    if (used.has(teacherId)) {
      errors.push(`${getTeacher(teacherId)?.name ?? teacherId} is already class teacher of ${used.get(teacherId)}`);
    } else {
      used.set(teacherId, classShortLabel(cls));
    }
  });
  return errors;
};

const validateSubjectTeachers = (state: AssignmentState, classIds: string[], changed: AuditDraft[]): string[] => {
  const errors: string[] = [];
  CLASS_LIST.filter((cls) => classIds.includes(cls.id)).forEach((cls) => {
    cls.subjects.forEach((subject) => {
      const assignment = subjectOf(state, cls.id, subject.id);
      const label = `${classShortLabel(cls)} · ${subject.name}`;
      const isNew = (teacherId: string | null) =>
      !!teacherId && changed.some((d) => d.classId === cls.id && d.subjectOrRole.startsWith(subject.name) && d.teacherId === teacherId);
      if (assignment.primary && !isOfferable(getTeacher(assignment.primary)) && isNew(assignment.primary)) {
        errors.push(`${label}: teacher is inactive or missing`);
      }
      if (assignment.co && !isOfferable(getTeacher(assignment.co)) && isNew(assignment.co)) {
        errors.push(`${label}: co-teacher is inactive or missing`);
      }
      if (assignment.primary && assignment.primary === assignment.co) {
        errors.push(`${label}: duplicate entry (same teacher, same subject, same class)`);
      }
    });
  });
  return errors;
};

const diffClassTeachers = (before: AssignmentState, after: AssignmentState): AuditDraft[] => {
  const drafts: AuditDraft[] = [];
  CLASS_LIST.forEach((cls) => {
    const prev = before.classTeachers[cls.id] ?? null;
    const next = after.classTeachers[cls.id] ?? null;
    if (prev === next) return;
    drafts.push({
      action: !prev ? 'Assigned' : !next ? 'Removed' : 'Changed',
      classId: cls.id,
      teacherId: (next ?? prev) as string,
      role: 'Class Teacher',
      subjectOrRole: 'Class Teacher'
    });
  });
  return drafts;
};

const diffSubjectTeachers = (before: AssignmentState, after: AssignmentState, classIds: string[]): AuditDraft[] => {
  const drafts: AuditDraft[] = [];
  CLASS_LIST.filter((cls) => classIds.includes(cls.id)).forEach((cls) => {
    cls.subjects.forEach((subject) => {
      const prev = subjectOf(before, cls.id, subject.id);
      const next = subjectOf(after, cls.id, subject.id);
      if (prev.primary !== next.primary) {
        drafts.push({
          action: !prev.primary ? 'Assigned' : !next.primary ? 'Removed' : 'Changed',
          classId: cls.id,
          teacherId: (next.primary ?? prev.primary) as string,
          role: 'Subject Teacher',
          subjectOrRole: subject.name
        });
      }
      if (prev.co !== next.co) {
        drafts.push({
          action: !prev.co ? 'Assigned' : !next.co ? 'Removed' : 'Changed',
          classId: cls.id,
          teacherId: (next.co ?? prev.co) as string,
          role: 'Subject Teacher',
          subjectOrRole: `${subject.name} (Co-teacher)`
        });
      }
    });
  });
  return drafts;
};

const escapeHtml = (value: string): string =>
value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const AUDIT_ACTION_STYLE: Record<AuditAction, string> = {
  Assigned: 'bg-green-100 text-green-700',
  Changed: 'bg-blue-100 text-blue-700',
  Removed: 'bg-red-100 text-red-700'
};

// ==================== MAIN COMPONENT ====================

export function TeacherClassSubjectAllocation() {
  const defaultYear = academicYears[0].value;
  const defaultTerm = TERM_OPTIONS[0];
  const initialSaved = useMemo(() => buildInitialAssignments(), []);

  // Session filters (drive everything below once "Load Assignments" is clicked)
  const [yearDraft, setYearDraft] = useState(defaultYear);
  const [termDraft, setTermDraft] = useState(defaultTerm);
  const [activeSession, setActiveSession] = useState({ year: defaultYear, term: defaultTerm });
  const activeKey = sessionKeyOf(activeSession.year, activeSession.term);

  // Client-side data stores (no backend)
  const [savedStore, setSavedStore] = useState<Record<string, AssignmentState>>(() => ({
    [sessionKeyOf(defaultYear, defaultTerm)]: initialSaved
  }));
  const [auditStore, setAuditStore] = useState<Record<string, AuditEntry[]>>(() => ({
    [sessionKeyOf(defaultYear, defaultTerm)]: SEED_AUDIT
  }));
  const [draft, setDraft] = useState<AssignmentState>(initialSaved);

  const saved = savedStore[activeKey] ?? initialSaved;
  const auditRows = auditStore[activeKey] ?? [];
  const isDirty = !statesEqual(draft, saved);

  // UI state
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set([CLASS_LIST[0].id]));
  const [auditFilters, setAuditFilters] = useState({ from: '', to: '', teacherId: '', classId: '', role: '' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Summary stats (live, from the draft)
  const totalClasses = CLASS_LIST.length;
  const classTeachersAssigned = CLASS_LIST.filter((cls) => draft.classTeachers[cls.id]).length;
  const totalSlots = CLASS_LIST.reduce((sum, cls) => sum + cls.subjects.length, 0);
  const filledSlots = CLASS_LIST.reduce(
    (sum, cls) => sum + cls.subjects.filter((subject) => subjectOf(draft, cls.id, subject.id).primary).length,
    0
  );
  const pendingCount = (totalClasses - classTeachersAssigned) + (totalSlots - filledSlots);

  // Unsaved-changes guard: browser close / reload, and in-app navigation (BrowserRouter has no data-router blocker)
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const originalPushState = window.history.pushState;
    const guardedPushState = function (this: History, data: unknown, unused: string, url?: string | URL | null) {
      if (!window.confirm('You have unsaved assignment changes. Leave this page without saving?')) return;
      originalPushState.call(this, data, unused, url);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState = guardedPushState as History['pushState'];
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
    };
  }, [isDirty]);

  const pushToast = (type: Toast['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 5000);
  };

  const handleLoadAssignments = () => {
    if (isDirty && !window.confirm('Discard unsaved changes and load the selected session?')) return;
    const key = sessionKeyOf(yearDraft, termDraft);
    const nextSaved = savedStore[key] ?? buildInitialAssignments();
    if (!savedStore[key]) {
      setSavedStore((prev) => ({ ...prev, [key]: nextSaved }));
    }
    setDraft(nextSaved);
    setActiveSession({ year: yearDraft, term: termDraft });
    setEditingRows(new Set());
    pushToast('info', `Loaded ${yearDraft} · ${termDraft}: ${totalClasses} classes with their curriculum mapping.`);
  };

  // ----- Draft edits -----
  const setClassTeacher = (classId: string, teacherId: string) => {
    setDraft((prev) => ({
      ...prev,
      classTeachers: { ...prev.classTeachers, [classId]: teacherId || null }
    }));
  };

  const setSubjectTeacher = (classId: string, subjectId: string, field: 'primary' | 'co', teacherId: string) => {
    const value = teacherId || null;
    setDraft((prev) => {
      const current = subjectOf(prev, classId, subjectId);
      const next: SubjectAssignment = field === 'primary'
        ? { primary: value, co: current.co === value ? null : current.co }
        : { primary: current.primary, co: value };
      return { ...prev, subjectTeachers: { ...prev.subjectTeachers, [subjectKey(classId, subjectId)]: next } };
    });
  };

  const toggleEditRow = (classId: string) => {
    setEditingRows((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) next.delete(classId);
      else next.add(classId);
      return next;
    });
  };

  const toggleClassGroup = (classId: string) => {
    setExpandedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) next.delete(classId);
      else next.add(classId);
      return next;
    });
  };

  // ----- Saving (every save writes audit entries automatically) -----
  const commitSave = (nextSaved: AssignmentState, drafts: AuditDraft[]) => {
    const today = toIsoLocal(new Date());
    setSavedStore((prev) => ({ ...prev, [activeKey]: nextSaved }));
    if (drafts.length > 0) {
      const entries: AuditEntry[] = drafts.map((entry, index) => ({
        ...entry,
        id: `AUD-${Date.now()}-${index}`,
        date: today,
        academicYear: activeSession.year,
        doneBy: CURRENT_USER
      }));
      setAuditStore((prev) => ({ ...prev, [activeKey]: [...entries, ...(prev[activeKey] ?? [])] }));
    }
    const warnings = collectWarnings(nextSaved).length;
    if (drafts.length === 0) {
      pushToast('info', 'No changes to save.');
      return;
    }
    pushToast(
      warnings > 0 ? 'warning' : 'success',
      `${drafts.length} assignment${drafts.length === 1 ? '' : 's'} saved successfully, ${warnings} warning${warnings === 1 ? '' : 's'} found`
    );
  };

  const saveClassTeachers = () => {
    const nextSaved: AssignmentState = { ...saved, classTeachers: { ...draft.classTeachers } };
    const drafts = diffClassTeachers(saved, nextSaved);
    const errors = validateClassTeachers(nextSaved, drafts);
    if (errors.length > 0) {
      pushToast('error', `Class teachers not saved: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`);
      return;
    }
    commitSave(nextSaved, drafts);
    setEditingRows(new Set());
  };

  const saveSubjectTeachers = (classIds: string[]) => {
    const subjectTeachers = { ...saved.subjectTeachers };
    CLASS_LIST.filter((cls) => classIds.includes(cls.id)).forEach((cls) => {
      cls.subjects.forEach((subject) => {
        const key = subjectKey(cls.id, subject.id);
        subjectTeachers[key] = subjectOf(draft, cls.id, subject.id);
      });
    });
    const nextSaved: AssignmentState = { ...saved, subjectTeachers };
    const drafts = diffSubjectTeachers(saved, nextSaved, classIds);
    const errors = validateSubjectTeachers(nextSaved, classIds, drafts);
    if (errors.length > 0) {
      pushToast('error', `Subject teachers not saved: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`);
      return;
    }
    commitSave(nextSaved, drafts);
  };

  const saveAll = () => {
    const nextSaved: AssignmentState = {
      classTeachers: { ...draft.classTeachers },
      subjectTeachers: { ...draft.subjectTeachers }
    };
    const classDrafts = diffClassTeachers(saved, nextSaved);
    const subjectDrafts = diffSubjectTeachers(saved, nextSaved, CLASS_LIST.map((cls) => cls.id));
    const drafts = [...classDrafts, ...subjectDrafts];
    const errors = [
    ...validateClassTeachers(nextSaved, classDrafts),
    ...validateSubjectTeachers(nextSaved, CLASS_LIST.map((cls) => cls.id), subjectDrafts)];

    if (errors.length > 0) {
      pushToast('error', `Nothing saved: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`);
      return;
    }
    commitSave(nextSaved, drafts);
    setEditingRows(new Set());
  };

  const resetChanges = () => {
    if (!isDirty) {
      pushToast('info', 'There are no unsaved changes to reset.');
      return;
    }
    setDraft(saved);
    setEditingRows(new Set());
    pushToast('info', 'Unsaved changes were reverted to the last saved state.');
  };

  // ----- Audit log (read-only) -----
  const filteredAudit = auditRows.filter((row) =>
  (!auditFilters.from || row.date >= auditFilters.from) &&
  (!auditFilters.to || row.date <= auditFilters.to) &&
  (!auditFilters.teacherId || row.teacherId === auditFilters.teacherId) &&
  (!auditFilters.classId || row.classId === auditFilters.classId) &&
  (!auditFilters.role || row.role === auditFilters.role));

  const auditTableRows = filteredAudit.map((row) => ({
    date: formatDisplayDate(row.date),
    year: row.academicYear,
    action: row.action,
    cls: classShortLabel(findClass(row.classId) ?? CLASS_LIST[0]),
    teacher: getTeacher(row.teacherId)?.name ?? row.teacherId,
    subject: row.subjectOrRole,
    doneBy: row.doneBy
  }));

  const exportAuditExcel = () => {
    const header = ['Date', 'Academic Year', 'Action', 'Class', 'Teacher', 'Subject / Role', 'Done By'];
    const lines = [header, ...auditTableRows.map((r) => [r.date, r.year, r.action, r.cls, r.teacher, r.subject, r.doneBy])]
    .map((cols) => cols.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teacher-assignment-records-${activeSession.year}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    pushToast('success', `Exported ${auditTableRows.length} record(s) to Excel (.csv).`);
  };

  const exportAuditPdf = () => {
    const win = window.open('', '_blank');
    if (!win) {
      pushToast('error', 'Pop-up blocked. Allow pop-ups for this site to export PDF.');
      return;
    }
    const body = auditTableRows.map((r) => `<tr>${[r.date, r.year, r.action, r.cls, r.teacher, r.subject, r.doneBy].map((v) => `<td>${escapeHtml(String(v))}</td>`).join('')}</tr>`).join('');
    win.document.write(`<html><head><title>Teacher Assignment Records</title><style>body{font-family:Arial,sans-serif;font-size:12px;padding:24px;color:#111}h1{font-size:18px;margin:0 0 4px}p{margin:0 0 12px;color:#555}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f3f4f6}</style></head><body><h1>Teacher Assignment Records</h1><p>${escapeHtml(activeSession.year)} · ${escapeHtml(activeSession.term)} · Generated by ${CURRENT_USER}</p><table><thead><tr><th>Date</th><th>Academic Year</th><th>Action</th><th>Class</th><th>Teacher</th><th>Subject / Role</th><th>Done By</th></tr></thead><tbody>${body || '<tr><td colspan="7">No records</td></tr>'}</tbody></table></body></html>`);
    win.document.close();
    window.setTimeout(() => win.print(), 300);
  };

  // ----- Render helpers -----
  const subjectSelectOptions = (selectedId: string | null, exceptId?: string) => {
    const selected = getTeacher(selectedId);
    return (
      <>
        {selected && !isOfferable(selected) && (
          <option value={selected.id} disabled>{`${selected.name} — inactive / not offered`}</option>
        )}
        {offerableTeachers.filter((teacher) => teacher.id !== exceptId).map((teacher) => {
          const elsewhere = classWhereClassTeacher(draft, teacher.id);
          return (
            <option key={teacher.id} value={teacher.id}>
              {elsewhere ? `${teacher.name} · ⚑ Class Teacher of ${classShortLabel(elsewhere)}` : `${teacher.name} · ${teacher.department}`}
            </option>
          );
        })}
      </>
    );
  };

  const completionFor = (cls: ClassSection) => {
    const done = cls.subjects.filter((subject) => subjectOf(draft, cls.id, subject.id).primary).length;
    return { done, total: cls.subjects.length };
  };

  const groupHasChanges = (cls: ClassSection) =>
  cls.subjects.some((subject) => {
    const a = subjectOf(draft, cls.id, subject.id);
    const b = subjectOf(saved, cls.id, subject.id);
    return a.primary !== b.primary || a.co !== b.co;
  });

  const expandAll = () => setExpandedClasses(new Set(CLASS_LIST.map((cls) => cls.id)));
  const collapseAll = () => setExpandedClasses(new Set());

  const selectClass = 'w-full min-w-[220px] px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Assignment Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Assign class teachers and subject teachers to classes in bulk, from one page.
        </p>
      </div>

      {/* Sticky session / filter bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <Select
              label="Academic Year"
              options={academicYears}
              value={yearDraft}
              onChange={(e: any) => setYearDraft(e.target.value)} />
            <Select
              label="Term / Semester"
              options={TERM_OPTIONS.map((term) => ({ value: term, label: term }))}
              value={termDraft}
              onChange={(e: any) => setTermDraft(e.target.value)} />
            <div className="flex items-end">
              <Button variant="primary" onClick={handleLoadAssignments} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Load Assignments
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Showing: <span className="font-medium text-gray-900">{activeSession.year} · {activeSession.term}</span></span>
            {isDirty ?
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Unsaved changes
              </span> :
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> All changes saved
              </span>}
          </div>
        </div>
      </div>

      {/* Summary stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Classes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalClasses}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Class Teachers Assigned</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{classTeachersAssigned} <span className="text-base font-normal text-gray-500">/ {totalClasses}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Subject Slots Filled</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filledSlots} <span className="text-base font-normal text-gray-500">/ {totalSlots}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Pending</p>
          <p className={`text-2xl font-bold mt-1 ${pendingCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{pendingCount}</p>
        </div>
      </div>

      {/* SECTION 1 — Class teacher assignment */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              1. Class Teacher Assignment
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">One class has one class teacher. Teachers already assigned elsewhere are greyed out.</p>
          </div>
          <Button variant="primary" size="sm" onClick={saveClassTeachers}>
            <Save className="w-4 h-4 mr-2" />
            Assign All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Class</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Section</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Current Class Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Assign Class Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {CLASS_LIST.map((cls, index) => {
                const savedTeacherId = saved.classTeachers[cls.id] ?? null;
                const draftTeacherId = draft.classTeachers[cls.id] ?? null;
                const savedTeacher = getTeacher(savedTeacherId);
                const draftTeacher = getTeacher(draftTeacherId);
                const locked = !!savedTeacherId && !editingRows.has(cls.id);
                const changed = draftTeacherId !== savedTeacherId;
                const needsReassignment = !!draftTeacherId && !isOfferable(draftTeacher);
                return (
                  <tr key={cls.id} className={changed ? 'bg-blue-50/50' : ''}>
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      Grade {cls.grade}{cls.stream ? ` · ${cls.stream}` : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{cls.section}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {savedTeacher ?
                      <span>{savedTeacher.name}{!isOfferable(savedTeacher) && <span className="text-red-600"> (inactive)</span>}</span> :
                      <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={draftTeacherId ?? ''}
                        disabled={locked}
                        onChange={(e) => setClassTeacher(cls.id, e.target.value)}
                        className={selectClass}>
                        <option value="">— Select teacher —</option>
                        {draftTeacher && !isOfferable(draftTeacher) &&
                        <option value={draftTeacher.id} disabled>{`${draftTeacher.name} — inactive / not offered`}</option>}
                        {offerableTeachers.map((teacher) => {
                          const elsewhere = classWhereClassTeacher(draft, teacher.id, cls.id);
                          return (
                            <option key={teacher.id} value={teacher.id} disabled={!!elsewhere}>
                              {elsewhere ?
                              `${teacher.name} — Class Teacher of ${classShortLabel(elsewhere)}` :
                              `${teacher.name} · ${teacher.department}`}
                            </option>);

                        })}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {needsReassignment ?
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Reassign
                        </span> :
                      draftTeacherId ?
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Assigned
                        </span> :
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Not Assigned
                        </span>}
                      {changed && <span className="ml-2 text-xs text-blue-600">Unsaved</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {savedTeacherId &&
                        <button
                          type="button"
                          title="Edit class teacher"
                          onClick={() => toggleEditRow(cls.id)}
                          className={`p-1.5 rounded-lg transition-colors ${editingRows.has(cls.id) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                          <Pencil className="w-4 h-4" />
                        </button>}
                        {draftTeacherId &&
                        <button
                          type="button"
                          title="Clear class teacher"
                          onClick={() => setClassTeacher(cls.id, '')}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <X className="w-4 h-4" />
                        </button>}
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 2 — Subject teacher assignment (Option A: class-wise expandable rows) */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              2. Subject Teacher Assignment
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Subjects come from each class's curriculum. One teacher may teach the same subject in several classes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>Expand all</Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>Collapse all</Button>
          </div>
        </div>
        <div className="px-5 py-2 border-b border-gray-100 bg-gray-50 text-xs text-gray-600 flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1"><Flag className="w-3.5 h-3.5 text-amber-600" /> Class teacher also teaching elsewhere (allowed)</span>
          <span className="inline-flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-600" /> Subject with no teacher = incomplete</span>
        </div>
        <div className="divide-y divide-gray-200">
          {CLASS_LIST.map((cls) => {
            const { done, total } = completionFor(cls);
            const complete = done === total;
            const expanded = expandedClasses.has(cls.id);
            const classTeacher = getTeacher(draft.classTeachers[cls.id]);
            const hasChanges = groupHasChanges(cls);
            return (
              <div key={cls.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleClassGroup(cls.id); } }}
                  onClick={() => toggleClassGroup(cls.id)}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {expanded ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{cls.label}</p>
                      <p className="text-xs text-gray-500 truncate">
                        Class teacher: {classTeacher ? classTeacher.name : <span className="text-amber-700">not assigned</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:w-80">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${complete ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${complete ? 'text-green-700' : 'text-amber-700'}`}>
                      {done}/{total} subjects assigned
                    </span>
                    {hasChanges && <span className="text-xs text-blue-600 whitespace-nowrap">Unsaved</span>}
                  </div>
                </div>

                {expanded &&
                <div className="px-5 pb-5">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Assigned Teacher</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Co-teacher (optional)</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {cls.subjects.map((subject) => {
                            const a = subjectOf(draft, cls.id, subject.id);
                            const b = subjectOf(saved, cls.id, subject.id);
                            const primaryTeacher = getTeacher(a.primary);
                            const flagClass = a.primary ? classWhereClassTeacher(draft, a.primary, cls.id) : undefined;
                            const isEmpty = !a.primary;
                            const isDuplicate = !!a.primary && a.primary === a.co;
                            const isInactive = !!a.primary && !isOfferable(primaryTeacher);
                            const unsaved = a.primary !== b.primary || a.co !== b.co;
                            return (
                              <tr key={subject.id} className={isEmpty || isDuplicate || isInactive ? 'bg-red-50/60' : ''}>
                                <td className="px-4 py-2">
                                  <p className="font-medium text-gray-900">{subject.name}</p>
                                  <p className="text-xs text-gray-500">{subject.code} · {subject.type} · {subject.weeklySessions}/wk</p>
                                </td>
                                <td className="px-4 py-2">
                                  <select
                                    value={a.primary ?? ''}
                                    onChange={(e) => setSubjectTeacher(cls.id, subject.id, 'primary', e.target.value)}
                                    className={`${selectClass} ${isEmpty ? 'border-red-300' : ''}`}>
                                    <option value="">— Not assigned —</option>
                                    {subjectSelectOptions(a.primary)}
                                  </select>
                                </td>
                                <td className="px-4 py-2">
                                  <select
                                    value={a.co ?? ''}
                                    onChange={(e) => setSubjectTeacher(cls.id, subject.id, 'co', e.target.value)}
                                    className={selectClass}>
                                    <option value="">— None —</option>
                                    {subjectSelectOptions(a.co, a.primary ?? undefined)}
                                  </select>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1.5">
                                    {isEmpty &&
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                        <XCircle className="w-3.5 h-3.5" /> Incomplete
                                      </span>}
                                    {isDuplicate &&
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Duplicate warning
                                      </span>}
                                    {isInactive &&
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                        <XCircle className="w-3.5 h-3.5" /> Teacher inactive
                                      </span>}
                                    {!isEmpty && !isDuplicate && !isInactive && flagClass &&
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                                        <Flag className="w-3.5 h-3.5" /> Class Teacher of {classShortLabel(flagClass)}
                                      </span>}
                                    {!isEmpty && !isDuplicate && !isInactive && !flagClass &&
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" /> Assigned
                                      </span>}
                                    {unsaved && <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Unsaved</span>}
                                  </div>
                                </td>
                              </tr>);

                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3">
                      <p className="text-xs text-gray-500">{total - done} subject(s) still need a teacher.</p>
                      <Button variant="secondary" size="sm" disabled={!hasChanges} onClick={() => saveSubjectTeachers([cls.id])}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Section
                      </Button>
                    </div>
                  </div>}
              </div>);

          })}
        </div>
      </Card>

      {/* SECTION 3 — Assignment records / audit log (read-only) */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              3. Assignment Records / Audit Log
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Entries are logged automatically on every save. Read-only.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportAuditExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportAuditPdf}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">From date</label>
            <input type="date" value={auditFilters.from} onChange={(e) => setAuditFilters({ ...auditFilters, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">To date</label>
            <input type="date" value={auditFilters.to} onChange={(e) => setAuditFilters({ ...auditFilters, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teacher name</label>
            <select value={auditFilters.teacherId} onChange={(e) => setAuditFilters({ ...auditFilters, teacherId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All teachers</option>
              {mockTeachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
            <select value={auditFilters.classId} onChange={(e) => setAuditFilters({ ...auditFilters, classId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All classes</option>
              {CLASS_LIST.map((cls) => <option key={cls.id} value={cls.id}>{cls.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select value={auditFilters.role} onChange={(e) => setAuditFilters({ ...auditFilters, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="">All roles</option>
              <option value="Class Teacher">Class Teacher</option>
              <option value="Subject Teacher">Subject Teacher</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Academic Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Class</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Subject / Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Done By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {auditTableRows.length === 0 &&
              <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No assignment records match these filters.</td>
                </tr>}
              {auditTableRows.map((row, index) =>
              <tr key={`${row.date}-${index}`}>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{row.date}</td>
                  <td className="px-4 py-3 text-gray-700">{row.year}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${AUDIT_ACTION_STYLE[row.action]}`}>{row.action}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.cls}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.teacher}</td>
                  <td className="px-4 py-3 text-gray-700">{row.subject}</td>
                  <td className="px-4 py-3 text-gray-700">{row.doneBy}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
          Showing {auditTableRows.length} of {auditRows.length} records for {activeSession.year} · {activeSession.term}
        </div>
      </Card>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            {isDirty ?
            <span className="text-amber-700 font-medium">You have unsaved changes.</span> :
            <span className="text-green-700">Everything is saved for this session.</span>}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={saveClassTeachers} disabled={!isDirty}>Save Class Teachers</Button>
            <Button variant="outline" onClick={() => saveSubjectTeachers(CLASS_LIST.map((cls) => cls.id))} disabled={!isDirty}>Save Subject Teachers</Button>
            <Button variant="primary" onClick={saveAll} disabled={!isDirty}>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
            <Button variant="ghost" onClick={resetChanges} disabled={!isDirty}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))} />
    </div>);

}

export default TeacherClassSubjectAllocation;
