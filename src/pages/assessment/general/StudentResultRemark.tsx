import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Edit3,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  Calculator,
  Layers,
  RefreshCw,
  X,
  Clock,
  History,
  Lock,
  Zap,
  Search,
  FileText,
  BookOpen,
  GraduationCap,
  Beaker,
  FlaskConical,
  Microscope,
  Clipboard,
  AlertTriangle,
  Link,
  Palette,
  Music,
  Dumbbell,
  Wrench,
  Laptop,
  Presentation,
  ListChecks,
  MessageSquare,
  Star,
  Eye as EyeIcon,
  Hand,
  Lightbulb,
  ClipboardList,
  FolderPlus,
  CheckSquare,
  Square,
  Calendar,
  Target,
  FileCheck,
  Award } from
'lucide-react';

// ============================================
// Types
// ============================================

type ConfigStatus = 'Draft' | 'Active' | 'Inactive';

interface PracticalCriterion {
  id: string;
  name: string;
  maxMarks: number;
  description: string;
  order: number;
}

interface SubjectPracticalConfig {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  subjectType: 'core' | 'elective' | 'language';
  hasPractical: boolean;
  totalPracticalMarks: number;
  criteria: PracticalCriterion[];
  isConfigured: boolean;
  isLocked: boolean;
  status: ConfigStatus;
}

interface ExamPracticalConfig {
  id: string;
  examId: string;
  examName: string;
  examCode: string;
  examType: string;
  scheduledDate: string;
  subjects: SubjectPracticalConfig[];
  status: ConfigStatus;
  totalPracticalMarks: number;
  configuredSubjects: number;
  pendingSubjects: number;
}

interface ClassPracticalConfig {
  id: string;
  academicYear: string;
  board: string;
  boardName: string;
  classId: string;
  className: string;
  level: string;
  exams: ExamPracticalConfig[];
  totalExams: number;
  configuredExams: number;
  createdAt: string;
  modifiedAt: string;
}

interface CriteriaTemplate {
  id: string;
  name: string;
  icon: React.ElementType;
  suggestedMarks: number;
  description: string;
  applicableTo: string[];
}

interface SubjectMaster {
  id: string;
  name: string;
  code: string;
  type: 'core' | 'elective' | 'language';
  defaultPracticalMarks: number;
  applicableClasses: string[];
}

interface ExamMaster {
  id: string;
  name: string;
  code: string;
  type: string;
  scheduledDate: string;
}

// ============================================
// Mock Data
// ============================================

const academicYears = ['2024-25', '2025-26', '2026-27'];

const boards = [
{ id: 'cbse', name: 'CBSE' },
{ id: 'icse', name: 'ICSE' },
{ id: 'gseb', name: 'GSEB' },
{ id: 'state', name: 'State Board' }];


const allClasses = [
{ id: '1', name: 'Class I', level: 'Primary' },
{ id: '2', name: 'Class II', level: 'Primary' },
{ id: '3', name: 'Class III', level: 'Primary' },
{ id: '4', name: 'Class IV', level: 'Primary' },
{ id: '5', name: 'Class V', level: 'Primary' },
{ id: '6', name: 'Class VI', level: 'Middle' },
{ id: '7', name: 'Class VII', level: 'Middle' },
{ id: '8', name: 'Class VIII', level: 'Middle' },
{ id: '9', name: 'Class IX', level: 'Secondary' },
{ id: '10', name: 'Class X', level: 'Secondary' },
{ id: '11', name: 'Class XI', level: 'Senior Secondary' },
{ id: '12', name: 'Class XII', level: 'Senior Secondary' }];


const examMaster: ExamMaster[] = [
{ id: 'ut1', name: 'Unit Test 1', code: 'UT1', type: 'Unit Test', scheduledDate: '2024-06-15' },
{ id: 'ut2', name: 'Unit Test 2', code: 'UT2', type: 'Unit Test', scheduledDate: '2024-08-15' },
{ id: 'half', name: 'Half Yearly Examination', code: 'HY', type: 'Term Exam', scheduledDate: '2024-09-20' },
{ id: 'ut3', name: 'Unit Test 3', code: 'UT3', type: 'Unit Test', scheduledDate: '2024-11-15' },
{ id: 'ut4', name: 'Unit Test 4', code: 'UT4', type: 'Unit Test', scheduledDate: '2025-01-15' },
{ id: 'annual', name: 'Annual Examination', code: 'ANN', type: 'Final Exam', scheduledDate: '2025-03-01' },
{ id: 'practical', name: 'Practical Examination', code: 'PRAC', type: 'Practical', scheduledDate: '2025-02-15' },
{ id: 'preboard', name: 'Pre-Board Examination', code: 'PB', type: 'Board Prep', scheduledDate: '2025-01-20' }];


const subjectMaster: SubjectMaster[] = [
{ id: 'sci', name: 'Science', code: 'SCI', type: 'core', defaultPracticalMarks: 20, applicableClasses: ['6', '7', '8', '9', '10'] },
{ id: 'phy', name: 'Physics', code: 'PHY', type: 'core', defaultPracticalMarks: 30, applicableClasses: ['11', '12'] },
{ id: 'chem', name: 'Chemistry', code: 'CHEM', type: 'core', defaultPracticalMarks: 30, applicableClasses: ['11', '12'] },
{ id: 'bio', name: 'Biology', code: 'BIO', type: 'core', defaultPracticalMarks: 30, applicableClasses: ['11', '12'] },
{ id: 'cs', name: 'Computer Science', code: 'CS', type: 'elective', defaultPracticalMarks: 30, applicableClasses: ['6', '7', '8', '9', '10', '11', '12'] },
{ id: 'it', name: 'Information Technology', code: 'IT', type: 'elective', defaultPracticalMarks: 30, applicableClasses: ['9', '10', '11', '12'] },
{ id: 'pe', name: 'Physical Education', code: 'PE', type: 'elective', defaultPracticalMarks: 40, applicableClasses: ['6', '7', '8', '9', '10', '11', '12'] },
{ id: 'art', name: 'Art & Craft', code: 'ART', type: 'elective', defaultPracticalMarks: 30, applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8'] },
{ id: 'music', name: 'Music', code: 'MUS', type: 'elective', defaultPracticalMarks: 30, applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
{ id: 'evs', name: 'Environmental Science', code: 'EVS', type: 'core', defaultPracticalMarks: 20, applicableClasses: ['1', '2', '3', '4', '5'] },
{ id: 'math', name: 'Mathematics Lab', code: 'MATH', type: 'core', defaultPracticalMarks: 20, applicableClasses: ['9', '10', '11', '12'] },
{ id: 'geo', name: 'Geography', code: 'GEO', type: 'elective', defaultPracticalMarks: 20, applicableClasses: ['11', '12'] },
{ id: 'home', name: 'Home Science', code: 'HOME', type: 'elective', defaultPracticalMarks: 30, applicableClasses: ['11', '12'] }];


const criteriaTemplates: CriteriaTemplate[] = [
{ id: 't1', name: 'Experiment Performance', icon: Beaker, suggestedMarks: 10, description: 'Conducting and performing experiments correctly', applicableTo: ['Science', 'Physics', 'Chemistry', 'Biology'] },
{ id: 't2', name: 'Lab Work', icon: FlaskConical, suggestedMarks: 10, description: 'Overall lab work and practical skills', applicableTo: ['Science', 'Physics', 'Chemistry', 'Biology'] },
{ id: 't3', name: 'Record Book', icon: FileText, suggestedMarks: 5, description: 'Maintenance and presentation of practical record', applicableTo: ['all'] },
{ id: 't4', name: 'Viva', icon: MessageSquare, suggestedMarks: 5, description: 'Oral examination and understanding', applicableTo: ['all'] },
{ id: 't5', name: 'Practical File', icon: Clipboard, suggestedMarks: 5, description: 'Practical file submission and documentation', applicableTo: ['all'] },
{ id: 't6', name: 'Observation Skills', icon: EyeIcon, suggestedMarks: 5, description: 'Ability to observe and record findings', applicableTo: ['Science', 'Physics', 'Chemistry', 'Biology'] },
{ id: 't7', name: 'Project Demonstration', icon: Presentation, suggestedMarks: 10, description: 'Project presentation and demonstration skills', applicableTo: ['all'] },
{ id: 't8', name: 'Equipment Handling', icon: Wrench, suggestedMarks: 5, description: 'Proper handling of lab equipment', applicableTo: ['Science', 'Physics', 'Chemistry', 'Biology'] },
{ id: 't9', name: 'Program Execution', icon: Laptop, suggestedMarks: 10, description: 'Writing and executing programs correctly', applicableTo: ['Computer Science', 'IT'] },
{ id: 't10', name: 'Physical Performance', icon: Dumbbell, suggestedMarks: 10, description: 'Physical fitness and sports performance', applicableTo: ['Physical Education'] },
{ id: 't11', name: 'Skill Demonstration', icon: Hand, suggestedMarks: 5, description: 'Demonstration of specific skills', applicableTo: ['Physical Education', 'Art', 'Music'] },
{ id: 't12', name: 'Artwork Quality', icon: Palette, suggestedMarks: 20, description: 'Quality and presentation of artwork', applicableTo: ['Art'] },
{ id: 't13', name: 'Creativity', icon: Lightbulb, suggestedMarks: 10, description: 'Creative thinking and innovation', applicableTo: ['Art', 'Music'] },
{ id: 't14', name: 'Music Performance', icon: Music, suggestedMarks: 15, description: 'Musical performance and accuracy', applicableTo: ['Music'] },
{ id: 't15', name: 'Discipline & Participation', icon: Star, suggestedMarks: 5, description: 'Discipline and class participation', applicableTo: ['Physical Education'] }];


// Helper to generate subjects for a class
const getSubjectsForClass = (classId: string): SubjectMaster[] => {
  return subjectMaster.filter((s) => s.applicableClasses.includes(classId));
};

// Helper to generate exam practical config
const generateExamPracticalConfig = (exam: ExamMaster, classId: string, configured: boolean = false): ExamPracticalConfig => {
  const classSubjects = getSubjectsForClass(classId);
  const subjects: SubjectPracticalConfig[] = classSubjects.map((sub) => ({
    id: `${classId}-${exam.id}-${sub.id}`,
    subjectId: sub.id,
    subjectName: sub.name,
    subjectCode: sub.code,
    subjectType: sub.type,
    hasPractical: true,
    totalPracticalMarks: sub.defaultPracticalMarks,
    criteria: configured ? [
    { id: `${classId}-${exam.id}-${sub.id}-c1`, name: 'Experiment/Practical', maxMarks: Math.floor(sub.defaultPracticalMarks * 0.4), description: 'Main practical component', order: 1 },
    { id: `${classId}-${exam.id}-${sub.id}-c2`, name: 'Record/File', maxMarks: Math.floor(sub.defaultPracticalMarks * 0.3), description: 'Documentation', order: 2 },
    { id: `${classId}-${exam.id}-${sub.id}-c3`, name: 'Viva', maxMarks: sub.defaultPracticalMarks - Math.floor(sub.defaultPracticalMarks * 0.4) - Math.floor(sub.defaultPracticalMarks * 0.3), description: 'Oral examination', order: 3 }] :
    [],
    isConfigured: configured,
    isLocked: false,
    status: configured ? 'Active' : 'Draft'
  }));

  const configuredSubjects = subjects.filter((s) => s.isConfigured).length;
  const totalMarks = subjects.reduce((sum, s) => sum + s.totalPracticalMarks, 0);

  return {
    id: `${classId}-${exam.id}`,
    examId: exam.id,
    examName: exam.name,
    examCode: exam.code,
    examType: exam.type,
    scheduledDate: exam.scheduledDate,
    subjects,
    status: configuredSubjects === subjects.length ? 'Active' : 'Draft',
    totalPracticalMarks: totalMarks,
    configuredSubjects,
    pendingSubjects: subjects.length - configuredSubjects
  };
};

// Generate initial class configs
const generateInitialClassConfigs = (): ClassPracticalConfig[] => {
  return allClasses.map((cls) => {
    // For demo, add some exams to certain classes
    const examsForClass: ExamPracticalConfig[] = [];

    if (['9', '10', '11', '12'].includes(cls.id)) {
      // Senior classes have more exams configured
      examsForClass.push(
        generateExamPracticalConfig(examMaster.find((e) => e.id === 'half')!, cls.id, true),
        generateExamPracticalConfig(examMaster.find((e) => e.id === 'annual')!, cls.id, cls.id === '10' || cls.id === '12'),
        generateExamPracticalConfig(examMaster.find((e) => e.id === 'practical')!, cls.id, false)
      );
    } else if (['6', '7', '8'].includes(cls.id)) {
      // Middle classes have some exams
      examsForClass.push(
        generateExamPracticalConfig(examMaster.find((e) => e.id === 'half')!, cls.id, cls.id === '8'),
        generateExamPracticalConfig(examMaster.find((e) => e.id === 'annual')!, cls.id, false)
      );
    }

    const configuredExams = examsForClass.filter((e) => e.status === 'Active').length;

    return {
      id: `class-${cls.id}`,
      academicYear: '2024-25',
      board: 'cbse',
      boardName: 'CBSE',
      classId: cls.id,
      className: cls.name,
      level: cls.level,
      exams: examsForClass,
      totalExams: examsForClass.length,
      configuredExams,
      createdAt: '2024-01-15',
      modifiedAt: '2024-03-01'
    };
  });
};

// ============================================
// Utility Functions
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 11);

const getStatusColor = (status: ConfigStatus) => {
  switch (status) {
    case 'Active':return 'success';
    case 'Inactive':return 'danger';
    case 'Draft':return 'warning';
    default:return 'default';
  }
};

const getExamTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Unit Test': 'bg-blue-100 text-blue-700',
    'Term Exam': 'bg-green-100 text-green-700',
    'Final Exam': 'bg-purple-100 text-purple-700',
    'Practical': 'bg-orange-100 text-orange-700',
    'Board Prep': 'bg-red-100 text-red-700'
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

const getSubjectTypeColor = (type: string) => {
  switch (type) {
    case 'core':return 'bg-blue-100 text-blue-800';
    case 'elective':return 'bg-green-100 text-green-800';
    case 'language':return 'bg-purple-100 text-purple-800';
    default:return 'bg-gray-100 text-gray-800';
  }
};

const getSubjectIcon = (subjectName: string): React.ElementType => {
  const name = subjectName.toLowerCase();
  if (name.includes('physics')) return Beaker;
  if (name.includes('chemistry')) return FlaskConical;
  if (name.includes('biology')) return Microscope;
  if (name.includes('science') || name.includes('evs')) return Beaker;
  if (name.includes('computer') || name.includes('it')) return Laptop;
  if (name.includes('physical') || name.includes('pe')) return Dumbbell;
  if (name.includes('art')) return Palette;
  if (name.includes('music')) return Music;
  if (name.includes('math')) return Calculator;
  return BookOpen;
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Primary':return 'bg-pink-100 text-pink-700';
    case 'Middle':return 'bg-green-100 text-green-700';
    case 'Secondary':return 'bg-blue-100 text-blue-700';
    case 'Senior Secondary':return 'bg-purple-100 text-purple-700';
    default:return 'bg-gray-100 text-gray-700';
  }
};

// ============================================
// Sub Components
// ============================================

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
  onClick={onClick}>

    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>

        {children}
      </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  size?: 'sm' | 'md';
}> = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>);

};

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: {value: string;label: string;}[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
}> = ({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false, label }) =>
<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}>

      <option value="">{placeholder}</option>
      {options.map((opt) =>
    <option key={opt.value} value={opt.value}>{opt.label}</option>
    )}
    </select>
  </div>;


const Input: React.FC<{
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
}> = ({ value, onChange, placeholder, type = 'text', className = '', disabled = false, label, error, min, max }) =>
<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    min={min}
    max={max}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} />

    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>;


// ============================================
// Main Component
// ============================================

export function PracticalMarkingSetup() {
  // View state: 'classes' -> 'exams' -> 'subjects'
  const [activeView, setActiveView] = useState<'classes' | 'exams' | 'subjects'>('classes');

  // Selection state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [board, setBoard] = useState('cbse');

  // Data state
  const [allClassConfigs, setAllClassConfigs] = useState<ClassPracticalConfig[]>(generateInitialClassConfigs());

  // UI state
  const [selectedSubject, setSelectedSubject] = useState<SubjectPracticalConfig | null>(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('');
  const [copySourceExam, setCopySourceExam] = useState('');

  // New criterion state
  const [newCriterion, setNewCriterion] = useState<Partial<PracticalCriterion>>({
    name: '',
    maxMarks: 0,
    description: ''
  });

  // ============================================
  // Computed Values
  // ============================================

  const currentClassConfig = useMemo(() => {
    if (!selectedClassId) return null;
    return allClassConfigs.find((c) => c.classId === selectedClassId) || null;
  }, [selectedClassId, allClassConfigs]);

  const currentExamConfig = useMemo(() => {
    if (!currentClassConfig || !selectedExamId) return null;
    return currentClassConfig.exams.find((e) => e.examId === selectedExamId) || null;
  }, [currentClassConfig, selectedExamId]);

  const currentSubjects = currentExamConfig?.subjects || [];

  const configuredCount = currentSubjects.filter((s) => s.isConfigured).length;
  const pendingCount = currentSubjects.filter((s) => !s.isConfigured && s.hasPractical).length;

  const selectedSubjectCriteriaTotal = useMemo(() => {
    if (!selectedSubject) return 0;
    return selectedSubject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
  }, [selectedSubject]);

  const selectedSubjectRemainingMarks = useMemo(() => {
    if (!selectedSubject) return 0;
    return selectedSubject.totalPracticalMarks - selectedSubjectCriteriaTotal;
  }, [selectedSubject, selectedSubjectCriteriaTotal]);

  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    currentSubjects.forEach((subject) => {
      if (subject.hasPractical && subject.criteria.length > 0) {
        const total = subject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
        if (total !== subject.totalPracticalMarks) {
          errs.push(`${subject.subjectName}: Criteria total (${total}) doesn't match practical marks (${subject.totalPracticalMarks})`);
        }
      }
    });
    return errs;
  }, [currentSubjects]);

  const filteredClassConfigs = useMemo(() => {
    return allClassConfigs.filter((config) =>
    config.className.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [allClassConfigs, searchFilter]);

  // Available exams to add
  const availableExamsToAdd = useMemo(() => {
    if (!currentClassConfig) return [];
    const existingExamIds = new Set(currentClassConfig.exams.map((e) => e.examId));
    return examMaster.filter((e) => !existingExamIds.has(e.id));
  }, [currentClassConfig]);

  // Available subjects to add
  const availableSubjectsToAdd = useMemo(() => {
    if (!currentExamConfig || !currentClassConfig) return [];
    const existingSubjectIds = new Set(currentExamConfig.subjects.map((s) => s.subjectId));
    return getSubjectsForClass(currentClassConfig.classId).filter((s) => !existingSubjectIds.has(s.id));
  }, [currentExamConfig, currentClassConfig]);

  // Other exams for copy
  const otherExamsForCopy = useMemo(() => {
    if (!currentClassConfig || !selectedExamId) return [];
    return currentClassConfig.exams.filter((e) => e.examId !== selectedExamId && e.configuredSubjects > 0);
  }, [currentClassConfig, selectedExamId]);

  // Dashboard stats
  const dashboardStats = useMemo(() => {
    const classesWithExams = allClassConfigs.filter((c) => c.totalExams > 0).length;
    const totalExams = allClassConfigs.reduce((sum, c) => sum + c.totalExams, 0);
    const configuredExams = allClassConfigs.reduce((sum, c) => sum + c.configuredExams, 0);

    return { classesWithExams, totalExams, configuredExams };
  }, [allClassConfigs]);

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedExamId(null);
    setActiveView('exams');
    setExpandedSubjects(new Set());
  };

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId);
    setActiveView('subjects');
    setExpandedSubjects(new Set());
  };

  const goBackToClasses = () => {
    setActiveView('classes');
    setSelectedClassId(null);
    setSelectedExamId(null);
    setExpandedSubjects(new Set());
  };

  const goBackToExams = () => {
    setActiveView('exams');
    setSelectedExamId(null);
    setExpandedSubjects(new Set());
  };

  // ============================================
  // Exam Management
  // ============================================

  const handleAddExam = (examId: string) => {
    if (!currentClassConfig) return;

    const examInfo = examMaster.find((e) => e.id === examId);
    if (!examInfo) return;

    const newExamConfig = generateExamPracticalConfig(examInfo, currentClassConfig.classId, false);

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      return {
        ...config,
        exams: [...config.exams, newExamConfig],
        totalExams: config.totalExams + 1,
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));

    setShowAddExamModal(false);
  };

  const handleRemoveExam = (examId: string) => {
    if (!currentClassConfig) return;
    if (!confirm('Are you sure you want to remove this exam configuration?')) return;

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      const updatedExams = config.exams.filter((e) => e.examId !== examId);

      return {
        ...config,
        exams: updatedExams,
        totalExams: updatedExams.length,
        configuredExams: updatedExams.filter((e) => e.status === 'Active').length,
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  // ============================================
  // Subject Management
  // ============================================

  const toggleSubjectExpansion = (subjectId: string) => {
    setExpandedSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const handleOpenCriteriaConfig = (subject: SubjectPracticalConfig) => {
    if (subject.isLocked) {
      alert('This subject is locked. Cannot modify criteria.');
      return;
    }
    setSelectedSubject({ ...subject });
    setShowCriteriaModal(true);
  };

  const handleAddCriterion = () => {
    if (!selectedSubject) return;

    if (!newCriterion.name?.trim()) {
      setErrors({ criterion: 'Criterion name is required' });
      return;
    }

    if (!newCriterion.maxMarks || newCriterion.maxMarks <= 0) {
      setErrors({ criterion: 'Marks must be greater than 0' });
      return;
    }

    const newTotal = selectedSubjectCriteriaTotal + (newCriterion.maxMarks || 0);
    if (newTotal > selectedSubject.totalPracticalMarks) {
      setErrors({ criterion: `Total marks (${newTotal}) would exceed practical marks (${selectedSubject.totalPracticalMarks})` });
      return;
    }

    const criterion: PracticalCriterion = {
      id: generateId(),
      name: newCriterion.name,
      maxMarks: newCriterion.maxMarks,
      description: newCriterion.description || '',
      order: selectedSubject.criteria.length + 1
    };

    setSelectedSubject((prev) => ({
      ...prev!,
      criteria: [...prev!.criteria, criterion]
    }));

    setNewCriterion({ name: '', maxMarks: 0, description: '' });
    setErrors({});
  };

  const handleRemoveCriterion = (criterionId: string) => {
    if (!selectedSubject) return;

    setSelectedSubject((prev) => ({
      ...prev!,
      criteria: prev!.criteria.filter((c) => c.id !== criterionId)
    }));
  };

  const handleUpdateCriterion = (criterionId: string, updates: Partial<PracticalCriterion>) => {
    if (!selectedSubject) return;

    setSelectedSubject((prev) => ({
      ...prev!,
      criteria: prev!.criteria.map((c) =>
      c.id === criterionId ? { ...c, ...updates } : c
      )
    }));
  };

  const handleAddTemplatesCriteria = (template: CriteriaTemplate) => {
    if (!selectedSubject) return;

    const newTotal = selectedSubjectCriteriaTotal + template.suggestedMarks;
    if (newTotal > selectedSubject.totalPracticalMarks) {
      alert(`Cannot add. Total would exceed practical marks (${selectedSubject.totalPracticalMarks})`);
      return;
    }

    const criterion: PracticalCriterion = {
      id: generateId(),
      name: template.name,
      maxMarks: template.suggestedMarks,
      description: template.description,
      order: selectedSubject.criteria.length + 1
    };

    setSelectedSubject((prev) => ({
      ...prev!,
      criteria: [...prev!.criteria, criterion]
    }));
  };

  const handleSaveSubjectConfig = () => {
    if (!selectedSubject || !currentClassConfig || !selectedExamId) return;

    const total = selectedSubject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
    if (total !== selectedSubject.totalPracticalMarks && selectedSubject.criteria.length > 0) {
      setErrors({ save: `Criteria total (${total}) must equal practical marks (${selectedSubject.totalPracticalMarks})` });
      return;
    }

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      const updatedExams = config.exams.map((exam) => {
        if (exam.examId !== selectedExamId) return exam;

        const updatedSubjects = exam.subjects.map((s) =>
        s.id === selectedSubject.id ?
        { ...selectedSubject, isConfigured: selectedSubject.criteria.length > 0, status: selectedSubject.criteria.length > 0 ? 'Active' as ConfigStatus : 'Draft' as ConfigStatus } :
        s
        );

        const configuredSubjects = updatedSubjects.filter((s) => s.isConfigured).length;

        return {
          ...exam,
          subjects: updatedSubjects,
          configuredSubjects,
          pendingSubjects: updatedSubjects.length - configuredSubjects,
          status: configuredSubjects === updatedSubjects.length && updatedSubjects.length > 0 ? 'Active' as ConfigStatus : 'Draft' as ConfigStatus
        };
      });

      const configuredExams = updatedExams.filter((e) => e.status === 'Active').length;

      return {
        ...config,
        exams: updatedExams,
        configuredExams,
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));

    setShowCriteriaModal(false);
    setSelectedSubject(null);
    setErrors({});
  };

  const handleUpdateSubjectMarks = (subjectId: string, marks: number) => {
    if (!currentClassConfig || !selectedExamId) return;

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      return {
        ...config,
        exams: config.exams.map((exam) => {
          if (exam.examId !== selectedExamId) return exam;

          const updatedSubjects = exam.subjects.map((s) =>
          s.id === subjectId ? { ...s, totalPracticalMarks: marks } : s
          );

          return {
            ...exam,
            subjects: updatedSubjects,
            totalPracticalMarks: updatedSubjects.reduce((sum, s) => sum + s.totalPracticalMarks, 0)
          };
        }),
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const handleAddSubjectToExam = (subjectId: string, marks: number) => {
    if (!currentClassConfig || !selectedExamId) return;

    const subjectInfo = subjectMaster.find((s) => s.id === subjectId);
    if (!subjectInfo) return;

    const newSubject: SubjectPracticalConfig = {
      id: `${currentClassConfig.classId}-${selectedExamId}-${subjectId}-${generateId()}`,
      subjectId: subjectInfo.id,
      subjectName: subjectInfo.name,
      subjectCode: subjectInfo.code,
      subjectType: subjectInfo.type,
      hasPractical: true,
      totalPracticalMarks: marks,
      criteria: [],
      isConfigured: false,
      isLocked: false,
      status: 'Draft'
    };

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      return {
        ...config,
        exams: config.exams.map((exam) => {
          if (exam.examId !== selectedExamId) return exam;

          const updatedSubjects = [...exam.subjects, newSubject];

          return {
            ...exam,
            subjects: updatedSubjects,
            totalPracticalMarks: updatedSubjects.reduce((sum, s) => sum + s.totalPracticalMarks, 0),
            pendingSubjects: exam.pendingSubjects + 1
          };
        }),
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));

    setShowAddSubjectModal(false);
  };

  const handleRemoveSubjectFromExam = (subjectId: string) => {
    if (!currentClassConfig || !selectedExamId) return;
    if (!confirm('Are you sure you want to remove this subject?')) return;

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      return {
        ...config,
        exams: config.exams.map((exam) => {
          if (exam.examId !== selectedExamId) return exam;

          const updatedSubjects = exam.subjects.filter((s) => s.id !== subjectId);
          const configuredSubjects = updatedSubjects.filter((s) => s.isConfigured).length;

          return {
            ...exam,
            subjects: updatedSubjects,
            totalPracticalMarks: updatedSubjects.reduce((sum, s) => sum + s.totalPracticalMarks, 0),
            configuredSubjects,
            pendingSubjects: updatedSubjects.length - configuredSubjects,
            status: configuredSubjects === updatedSubjects.length && updatedSubjects.length > 0 ? 'Active' : 'Draft'
          };
        }),
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const handleCopyFromExam = () => {
    if (!copySourceExam || !currentClassConfig || !selectedExamId) return;

    const sourceExam = currentClassConfig.exams.find((e) => e.examId === copySourceExam);
    if (!sourceExam) return;

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig.classId) return config;

      return {
        ...config,
        exams: config.exams.map((exam) => {
          if (exam.examId !== selectedExamId) return exam;

          const updatedSubjects = exam.subjects.map((targetSubject) => {
            const sourceSubject = sourceExam.subjects.find(
              (s) => s.subjectId === targetSubject.subjectId && s.isConfigured
            );

            if (sourceSubject && !targetSubject.isLocked) {
              return {
                ...targetSubject,
                criteria: sourceSubject.criteria.map((c) => ({ ...c, id: generateId() })),
                isConfigured: sourceSubject.criteria.length > 0,
                status: sourceSubject.criteria.length > 0 ? 'Active' as ConfigStatus : 'Draft' as ConfigStatus
              };
            }
            return targetSubject;
          });

          const configuredSubjects = updatedSubjects.filter((s) => s.isConfigured).length;

          return {
            ...exam,
            subjects: updatedSubjects,
            configuredSubjects,
            pendingSubjects: updatedSubjects.length - configuredSubjects,
            status: configuredSubjects === updatedSubjects.length && updatedSubjects.length > 0 ? 'Active' : 'Draft'
          };
        }),
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));

    setShowCopyModal(false);
    setCopySourceExam('');
    alert('Configuration copied successfully!');
  };

  const handleSaveAll = async () => {
    if (validationErrors.length > 0) {
      alert('Please fix all validation errors before saving.');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Configuration saved successfully!');
  };

  const handleActivateAll = () => {
    if (!currentExamConfig) return;

    const unconfigured = currentSubjects.filter((s) => s.hasPractical && !s.isConfigured);
    if (unconfigured.length > 0) {
      alert(`Cannot activate. ${unconfigured.length} subjects have pending configuration.`);
      return;
    }

    if (validationErrors.length > 0) {
      alert('Cannot activate. Please fix all validation errors.');
      return;
    }

    setAllClassConfigs((prev) => prev.map((config) => {
      if (config.classId !== currentClassConfig?.classId) return config;

      const updatedExams = config.exams.map((exam) => {
        if (exam.examId !== selectedExamId) return exam;

        return {
          ...exam,
          subjects: exam.subjects.map((s) => ({ ...s, status: 'Active' as ConfigStatus })),
          status: 'Active' as ConfigStatus
        };
      });

      return {
        ...config,
        exams: updatedExams,
        configuredExams: updatedExams.filter((e) => e.status === 'Active').length,
        modifiedAt: new Date().toISOString().split('T')[0]
      };
    }));

    alert('All configurations activated!');
  };

  // ============================================
  // Render Classes View (Dashboard)
  // ============================================

  const renderClassesView = () =>
  <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{allClasses.length}</p>
              <p className="text-sm text-blue-600">Total Classes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{dashboardStats.classesWithExams}</p>
              <p className="text-sm text-green-600">Classes with Exams</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{dashboardStats.totalExams}</p>
              <p className="text-sm text-purple-600">Total Exam Configs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-900">{dashboardStats.configuredExams}</p>
              <p className="text-sm text-teal-600">Fully Configured</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            </div>
          </div>
          <Select
          value={academicYear}
          onChange={setAcademicYear}
          options={academicYears.map((y) => ({ value: y, label: y }))} />

          <Select
          value={board}
          onChange={setBoard}
          options={boards.map((b) => ({ value: b.id, label: b.name }))} />

        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredClassConfigs.map((config) => {
        const classInfo = allClasses.find((c) => c.id === config.classId);
        const progressPercent = config.totalExams > 0 ?
        Math.round(config.configuredExams / config.totalExams * 100) :
        0;

        return (
          <Card
            key={config.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectClass(config.classId)}>

              <div className={`p-4 ${config.configuredExams === config.totalExams && config.totalExams > 0 ? 'bg-green-50' : config.totalExams > 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.configuredExams === config.totalExams && config.totalExams > 0 ? 'bg-green-100' : config.totalExams > 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <GraduationCap className={`w-6 h-6 ${config.configuredExams === config.totalExams && config.totalExams > 0 ? 'text-green-600' : config.totalExams > 0 ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{config.className}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(classInfo?.level || '')}`}>
                        {classInfo?.level}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-700">{config.totalExams}</p>
                    <p className="text-xs text-blue-600">Exams</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-700">{config.configuredExams}</p>
                    <p className="text-xs text-green-600">Configured</p>
                  </div>
                </div>

                {config.totalExams > 0 &&
              <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                    className={`h-2 rounded-full transition-all ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${progressPercent}%` }} />

                    </div>
                  </div>
              }

                <p className="text-xs text-gray-400 text-center">
                  {config.totalExams === 0 ? 'No exams configured yet' : `${config.totalExams - config.configuredExams} pending`}
                </p>
              </div>
            </Card>);

      })}
      </div>
    </div>;


  // ============================================
  // Render Exams View
  // ============================================

  const renderExamsView = () => {
    if (!currentClassConfig) return null;

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{currentClassConfig.totalExams}</p>
                <p className="text-sm text-blue-600">Total Exams</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{currentClassConfig.configuredExams}</p>
                <p className="text-sm text-green-600">Configured</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{currentClassConfig.totalExams - currentClassConfig.configuredExams}</p>
                <p className="text-sm text-yellow-600">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{getSubjectsForClass(currentClassConfig.classId).length}</p>
                <p className="text-sm text-purple-600">Available Subjects</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-600" />
              Exam Practical Configurations
            </h2>
            <Button variant="primary" onClick={() => setShowAddExamModal(true)} disabled={availableExamsToAdd.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exam
            </Button>
          </div>
        </Card>

        {/* Exams List */}
        {currentClassConfig.exams.length === 0 ?
        <Card className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Exams Configured</h3>
            <p className="text-gray-500 mt-2">Add exams to configure practical marks for this class.</p>
            <Button variant="primary" className="mt-4" onClick={() => setShowAddExamModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Exam
            </Button>
          </Card> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentClassConfig.exams.map((exam) => {
            const progressPercent = exam.subjects.length > 0 ?
            Math.round(exam.configuredSubjects / exam.subjects.length * 100) :
            0;

            return (
              <Card
                key={exam.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectExam(exam.examId)}>

                  <div className={`p-4 ${exam.status === 'Active' ? 'bg-green-50' : exam.configuredSubjects > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${exam.status === 'Active' ? 'bg-green-100' : exam.configuredSubjects > 0 ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                          <FileCheck className={`w-6 h-6 ${exam.status === 'Active' ? 'text-green-600' : exam.configuredSubjects > 0 ? 'text-yellow-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{exam.examName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getExamTypeColor(exam.examType)}`}>
                              {exam.examType}
                            </span>
                            <Badge variant={getStatusColor(exam.status)} size="sm">{exam.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-700">{exam.subjects.length}</p>
                        <p className="text-xs text-blue-600">Subjects</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-700">{exam.configuredSubjects}</p>
                        <p className="text-xs text-green-600">Done</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <p className="text-lg font-bold text-purple-700">{exam.totalPracticalMarks}</p>
                        <p className="text-xs text-purple-600">Marks</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Configuration</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                        className={`h-2 rounded-full transition-all ${progressPercent === 100 ? 'bg-green-500' : progressPercent > 0 ? 'bg-yellow-500' : 'bg-gray-300'}`}
                        style={{ width: `${progressPercent}%` }} />

                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exam.scheduledDate}
                      </span>
                      <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExam(exam.examId);
                      }}>

                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>);

          })}

            {/* Add Exam Card */}
            {availableExamsToAdd.length > 0 &&
          <Card
            className="overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
            onClick={() => setShowAddExamModal(true)}>

                <div className="p-8 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Add Exam</h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    {availableExamsToAdd.length} exam(s) available
                  </p>
                </div>
              </Card>
          }
          </div>
        }
      </div>);

  };

  // ============================================
  // Render Subjects View
  // ============================================

  const renderSubjectsView = () => {
    if (!currentClassConfig || !currentExamConfig) return null;

    return (
      <div className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 &&
        <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Validation Errors</h4>
                <ul className="mt-1 space-y-1">
                  {validationErrors.map((err, idx) =>
                <li key={idx} className="text-sm text-red-700">• {err}</li>
                )}
                </ul>
              </div>
            </div>
          </Card>
        }

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{currentSubjects.length}</p>
                <p className="text-sm text-blue-600">Subjects</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{configuredCount}</p>
                <p className="text-sm text-green-600">Configured</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                <p className="text-sm text-yellow-600">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{currentExamConfig.totalPracticalMarks}</p>
                <p className="text-sm text-purple-600">Total Marks</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => setShowAddSubjectModal(true)} disabled={availableSubjectsToAdd.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
            <Button variant="outline" onClick={() => setShowCopyModal(true)} disabled={otherExamsForCopy.length === 0}>
              <Copy className="w-4 h-4 mr-2" />
              Copy from Other Exam
            </Button>
            <div className="flex-1"></div>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </Card>

        {/* Subjects List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-600" />
            Subject Practical Configuration
            <span className="text-sm font-normal text-gray-500">• Click marks to edit</span>
          </h2>

          {currentSubjects.length === 0 ?
          <Card className="p-12 text-center">
              <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Subjects Added</h3>
              <p className="text-gray-500 mt-2">Add subjects to configure practical marks.</p>
              <Button variant="primary" className="mt-4" onClick={() => setShowAddSubjectModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </Card> :

          <div className="space-y-4">
              {currentSubjects.map((subject) => {
              const SubjectIcon = getSubjectIcon(subject.subjectName);
              const isExpanded = expandedSubjects.has(subject.id);
              const criteriaTotal = subject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
              const isValid = criteriaTotal === subject.totalPracticalMarks || subject.criteria.length === 0;

              return (
                <Card key={subject.id} className={`overflow-hidden ${subject.isLocked ? 'border-yellow-300 bg-yellow-50/30' : ''}`}>
                    <div
                    className={`p-4 cursor-pointer ${isExpanded ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleSubjectExpansion(subject.id)}>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject.isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <SubjectIcon className={`w-5 h-5 ${subject.isConfigured ? 'text-green-600' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{subject.subjectName}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSubjectTypeColor(subject.subjectType)}`}>
                                {subject.subjectType}
                              </span>
                              {subject.isLocked && <Lock className="w-4 h-4 text-yellow-600" />}
                            </div>
                            <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                            type="number"
                            value={subject.totalPracticalMarks}
                            onChange={(e) => handleUpdateSubjectMarks(subject.id, parseInt(e.target.value) || 0)}
                            disabled={subject.isLocked}
                            className={`w-20 px-3 py-2 text-center font-bold text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${subject.isLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                            min={0} />

                            <span className="text-xs text-gray-500">marks</span>
                          </div>

                          <Badge variant={getStatusColor(subject.status)}>{subject.status}</Badge>

                          {subject.isConfigured ?
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> :

                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        }

                          {isExpanded ?
                        <ChevronUp className="w-5 h-5 text-gray-400" /> :

                        <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                        </div>
                      </div>
                    </div>

                    {isExpanded &&
                  <div className="border-t p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Button
                        variant="primary"
                        onClick={() => handleOpenCriteriaConfig(subject)}
                        disabled={subject.isLocked}>

                            <Settings className="w-4 h-4 mr-2" />
                            Configure Criteria
                          </Button>
                          <Button
                        variant="danger"
                        onClick={() => handleRemoveSubjectFromExam(subject.id)}
                        disabled={subject.isLocked}>

                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>

                        {subject.criteria.length > 0 &&
                    <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">Configured Criteria</h4>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                                  Total: {criteriaTotal}/{subject.totalPracticalMarks}
                                </span>
                                {isValid ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {subject.criteria.map((criterion) =>
                        <div key={criterion.id} className="bg-white rounded-lg p-3 border">
                                  <p className="text-sm font-medium text-gray-900">{criterion.name}</p>
                                  <p className="text-lg font-bold text-blue-600">{criterion.maxMarks} marks</p>
                                </div>
                        )}
                            </div>
                          </div>
                    }

                        {subject.criteria.length === 0 &&
                    <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                              No criteria configured. Click "Configure Criteria" to set up marking structure.
                            </p>
                          </div>
                    }
                      </div>
                  }
                  </Card>);

            })}
            </div>
          }
        </div>
      </div>);

  };

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {activeView !== 'classes' &&
              <Button
                variant="ghost"
                onClick={activeView === 'subjects' ? goBackToExams : goBackToClasses}>

                  <ChevronLeft className="w-5 h-5" />
                </Button>
              }
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Beaker className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Practical Marking Setup</h1>
                  {activeView === 'exams' && currentClassConfig &&
                  <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-blue-600">{currentClassConfig.className}</span>
                    </>
                  }
                  {activeView === 'subjects' && currentClassConfig && currentExamConfig &&
                  <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-blue-600">{currentClassConfig.className}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-purple-600">{currentExamConfig.examName}</span>
                    </>
                  }
                </div>
                <p className="text-sm text-gray-500">
                  {activeView === 'classes' && 'Select a class to configure practical marks'}
                  {activeView === 'exams' && 'Select an exam to configure subject-wise practical marks'}
                  {activeView === 'subjects' && 'Configure practical marks and criteria for each subject'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeView === 'subjects' && currentExamConfig &&
              <>
                  <Badge variant={getStatusColor(currentExamConfig.status)} className="px-3 py-1">
                    {currentExamConfig.status}
                  </Badge>
                  <Button variant="success" onClick={handleActivateAll} disabled={pendingCount > 0}>
                    <Zap className="w-4 h-4 mr-2" />
                    Activate All
                  </Button>
                  <Button variant="primary" onClick={handleSaveAll} disabled={isSaving}>
                    {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === 'classes' && renderClassesView()}
        {activeView === 'exams' && renderExamsView()}
        {activeView === 'subjects' && renderSubjectsView()}
      </div>

      {/* Add Exam Modal */}
      {showAddExamModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Exam to {currentClassConfig?.className}
              </h3>
              <button onClick={() => setShowAddExamModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableExamsToAdd.length === 0 ?
            <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">All exams have been added.</p>
                </div> :

            <div className="space-y-3">
                  {availableExamsToAdd.map((exam) =>
              <div
                key={exam.id}
                className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleAddExam(exam.id)}>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{exam.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getExamTypeColor(exam.type)}`}>
                              {exam.type}
                            </span>
                            <span className="text-xs text-gray-500">{exam.code}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exam.scheduledDate}
                          </span>
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowAddExamModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Add Subject Modal */}
      {showAddSubjectModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Subject to {currentExamConfig?.examName}
              </h3>
              <button onClick={() => setShowAddSubjectModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableSubjectsToAdd.length === 0 ?
            <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">All subjects have been added.</p>
                </div> :

            <div className="space-y-3">
                  {availableSubjectsToAdd.map((subject) => {
                const SubjectIcon = getSubjectIcon(subject.name);
                return (
                  <div
                    key={subject.id}
                    className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <SubjectIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{subject.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{subject.code}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getSubjectTypeColor(subject.type)}`}>
                                  {subject.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddSubjectToExam(subject.id, subject.defaultPracticalMarks)}>

                            <Plus className="w-4 h-4 mr-1" />
                            Add ({subject.defaultPracticalMarks}m)
                          </Button>
                        </div>
                      </div>);

              })}
                </div>
            }
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowAddSubjectModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Copy from Exam Modal */}
      {showCopyModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Copy className="w-5 h-5" />
                Copy from Another Exam
              </h3>
              <button onClick={() => setShowCopyModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Select an exam to copy criteria from. Only matching subjects will be copied.
              </p>
              <Select
              label="Source Exam"
              value={copySourceExam}
              onChange={setCopySourceExam}
              options={otherExamsForCopy.map((e) => ({
                value: e.examId,
                label: `${e.examName} (${e.configuredSubjects} subjects configured)`
              }))}
              placeholder="Select an exam..." />


              {copySourceExam &&
            <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <Info className="w-4 h-4 inline mr-1" />
                    This will copy criteria from matching subjects. Existing configurations will be overwritten.
                  </p>
                </div>
            }
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCopyModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCopyFromExam} disabled={!copySourceExam}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Configuration
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Criteria Configuration Modal */}
      {showCriteriaModal && selectedSubject &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold">Configure Practical Criteria</h2>
                  <p className="text-sm text-purple-200">{selectedSubject.subjectName} ({selectedSubject.subjectCode})</p>
                </div>
              </div>
              <button onClick={() => setShowCriteriaModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Marks Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-600">Total Practical Marks</p>
                  <p className="text-3xl font-bold text-blue-900">{selectedSubject.totalPracticalMarks}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-600">Criteria Total</p>
                  <p className="text-3xl font-bold text-green-900">{selectedSubjectCriteriaTotal}</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${selectedSubjectRemainingMarks === 0 ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                  <p className={`text-sm ${selectedSubjectRemainingMarks === 0 ? 'text-gray-600' : 'text-yellow-600'}`}>Remaining</p>
                  <p className={`text-3xl font-bold ${selectedSubjectRemainingMarks === 0 ? 'text-gray-900' : 'text-yellow-900'}`}>{selectedSubjectRemainingMarks}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Marks Distribution</span>
                  <span className={`font-medium ${selectedSubjectRemainingMarks === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {Math.round(selectedSubjectCriteriaTotal / selectedSubject.totalPracticalMarks * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                  className={`h-3 rounded-full transition-all ${selectedSubjectCriteriaTotal > selectedSubject.totalPracticalMarks ? 'bg-red-500' : selectedSubjectRemainingMarks === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(selectedSubjectCriteriaTotal / selectedSubject.totalPracticalMarks * 100, 100)}%` }} />

                </div>
              </div>

              {/* Add Criterion Form */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Criterion
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                  label="Criterion Name"
                  value={newCriterion.name || ''}
                  onChange={(value) => setNewCriterion((prev) => ({ ...prev, name: value }))}
                  placeholder="e.g., Experiment" />

                  <Input
                  label="Max Marks"
                  type="number"
                  value={newCriterion.maxMarks || ''}
                  onChange={(value) => setNewCriterion((prev) => ({ ...prev, maxMarks: parseInt(value) || 0 }))}
                  placeholder="0"
                  min={0} />

                  <Input
                  label="Description"
                  value={newCriterion.description || ''}
                  onChange={(value) => setNewCriterion((prev) => ({ ...prev, description: value }))}
                  placeholder="Optional" />

                  <div className="flex items-end">
                    <Button variant="primary" onClick={handleAddCriterion} className="w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
                {errors.criterion && <p className="text-sm text-red-600 mt-2">{errors.criterion}</p>}
              </div>

              {/* Templates */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Quick Add from Templates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {criteriaTemplates.
                filter((t) => t.applicableTo.includes('all') || t.applicableTo.some((a) => selectedSubject.subjectName.includes(a))).
                slice(0, 8).
                map((template) => {
                  const TemplateIcon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleAddTemplatesCriteria(template)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">

                          <TemplateIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{template.name}</span>
                          <Badge variant="info">{template.suggestedMarks}</Badge>
                        </button>);

                })}
                </div>
              </div>

              {/* Criteria List */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Configured Criteria ({selectedSubject.criteria.length})
                </h3>

                {selectedSubject.criteria.length === 0 ?
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No criteria added yet</p>
                  </div> :

              <div className="space-y-2">
                    {selectedSubject.criteria.map((criterion, idx) =>
                <div key={criterion.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border group hover:border-blue-200">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <input
                      type="text"
                      value={criterion.name}
                      onChange={(e) => handleUpdateCriterion(criterion.id, { name: e.target.value })}
                      className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full" />

                          {criterion.description && <p className="text-xs text-gray-500">{criterion.description}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                      type="number"
                      value={criterion.maxMarks}
                      onChange={(e) => handleUpdateCriterion(criterion.id, { maxMarks: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 text-center border rounded font-bold text-blue-600"
                      min={0} />

                          <span className="text-sm text-gray-500">marks</span>
                        </div>
                        <button
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                )}
                  </div>
              }
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <div>
                {errors.save &&
              <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.save}
                  </p>
              }
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowCriteriaModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSaveSubjectConfig}
                disabled={selectedSubjectRemainingMarks !== 0 && selectedSubject.criteria.length > 0}>

                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Preview Modal */}
      {showPreview && currentExamConfig &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <h2 className="text-lg font-bold">Preview - {currentClassConfig?.className} / {currentExamConfig.examName}</h2>
              </div>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Class:</span>
                    <p className="font-medium">{currentClassConfig?.className}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Exam:</span>
                    <p className="font-medium">{currentExamConfig.examName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{currentExamConfig.scheduledDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Marks:</span>
                    <p className="font-medium">{currentExamConfig.totalPracticalMarks}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {currentSubjects.map((subject) =>
              <div key={subject.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{subject.subjectName}</span>
                        <Badge variant={getStatusColor(subject.status)}>{subject.status}</Badge>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{subject.totalPracticalMarks} marks</span>
                    </div>

                    {subject.criteria.length > 0 ?
                <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Criterion</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {subject.criteria.map((c, idx) =>
                    <tr key={c.id}>
                              <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                              <td className="px-4 py-2 font-medium text-gray-900">{c.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{c.description || '-'}</td>
                              <td className="px-4 py-2 text-center font-bold text-blue-600">{c.maxMarks}</td>
                            </tr>
                    )}
                          <tr className="bg-blue-50">
                            <td colSpan={3} className="px-4 py-2 text-right font-semibold text-gray-900">Total</td>
                            <td className="px-4 py-2 text-center font-bold text-blue-700">
                              {subject.criteria.reduce((sum, c) => sum + c.maxMarks, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table> :

                <div className="p-4 text-center text-gray-500">No criteria configured</div>
                }
                  </div>
              )}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default PracticalMarkingSetup;