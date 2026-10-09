import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Edit3,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  Layers,
  Calendar,
  BookOpen,
  FileText,
  GraduationCap,
  Target,
  BarChart3,
  ArrowRight,
  RefreshCw,
  X,
  Check,
  Clock,
  Grid3X3,
  PieChart,
  ListChecks,
  AlertTriangle,
  Sparkles,
  Link,
  Lock,
  Unlock,
  Building,
  Users,
  Hash,
  Percent,
  Calculator,
  ClipboardList,
  Award,
  TrendingUp,
  Sliders,
  Search,
  Filter,
  Copy,
  Download,
  Upload,
  Printer,
  LayoutDashboard,
  CheckSquare,
  Square,
  MoreVertical,
  Activity,
  Zap,
  School,
  BookMarked,
  FileCheck,
  ToggleLeft,
  ToggleRight,
  FolderOpen,
  Move,
  ArrowLeftRight } from
'lucide-react';

// ============================================
// Types
// ============================================

type ConfigStatus = 'Draft' | 'Active' | 'Archived';

interface ExamConfig {
  id: string;
  examId: string;
  examName: string;
  examCode: string;
  examType: string;
  maxMarks: number;
  passingMarks: number;
  scheduledDate: string;
  order: number;
  isActive: boolean;
  termId: string | null;
}

interface Term {
  id: string;
  name: string;
  order: number;
  weightage: number;
  startDate: string;
  endDate: string;
}

interface SubjectMarksBreakdown {
  id: string;
  componentName: string;
  maxMarks: number;
  description: string;
}

interface ExamSubjectConfig {
  examId: string;
  examName: string;
  isIncluded: boolean;
  maxMarks: number;
  passingMarks: number;
  hasCustomBreakdown: boolean;
  breakdowns: SubjectMarksBreakdown[];
  isExpanded: boolean;
}

interface SubjectConfig {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  defaultTotalMarks: number;
  examConfigs: ExamSubjectConfig[];
  isExpanded: boolean;
}

interface ClassAssessmentConfig {
  id: string;
  academicYear: string;
  board: string;
  classId: string;
  className: string;
  terms: Term[];
  exams: ExamConfig[];
  subjects: SubjectConfig[];
  status: ConfigStatus;
  totalExams: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================
// Mock Data
// ============================================

const academicYears = ['2023-24', '2024-25', '2025-26'];
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'General'];

const allClasses = [
{ id: 'I', name: 'Class I', level: 'Primary' },
{ id: 'II', name: 'Class II', level: 'Primary' },
{ id: 'III', name: 'Class III', level: 'Primary' },
{ id: 'IV', name: 'Class IV', level: 'Primary' },
{ id: 'V', name: 'Class V', level: 'Primary' },
{ id: 'VI', name: 'Class VI', level: 'Middle' },
{ id: 'VII', name: 'Class VII', level: 'Middle' },
{ id: 'VIII', name: 'Class VIII', level: 'Middle' },
{ id: 'IX', name: 'Class IX', level: 'Secondary' },
{ id: 'X', name: 'Class X', level: 'Secondary' },
{ id: 'XI', name: 'Class XI', level: 'Senior Secondary' },
{ id: 'XII', name: 'Class XII', level: 'Senior Secondary' }];


const examMasterData = [
{ id: 'ex1', name: 'Unit Test 1', code: 'UT1', type: 'Unit Test', scheduledDate: '2024-05-15' },
{ id: 'ex2', name: 'Unit Test 2', code: 'UT2', type: 'Unit Test', scheduledDate: '2024-07-15' },
{ id: 'ex3', name: 'Half Yearly Examination', code: 'HY', type: 'Term Exam', scheduledDate: '2024-09-15' },
{ id: 'ex4', name: 'Unit Test 3', code: 'UT3', type: 'Unit Test', scheduledDate: '2024-11-15' },
{ id: 'ex5', name: 'Unit Test 4', code: 'UT4', type: 'Unit Test', scheduledDate: '2025-01-15' },
{ id: 'ex6', name: 'Annual Examination', code: 'ANN', type: 'Final Exam', scheduledDate: '2025-03-01' },
{ id: 'ex7', name: 'Practical Examination', code: 'PRAC', type: 'Practical', scheduledDate: '2025-02-15' },
{ id: 'ex8', name: 'Pre-Board Examination', code: 'PB', type: 'Board Prep', scheduledDate: '2025-01-20' },
{ id: 'ex9', name: 'Internal Assessment 1', code: 'IA1', type: 'Internal', scheduledDate: '2024-06-30' },
{ id: 'ex10', name: 'Internal Assessment 2', code: 'IA2', type: 'Internal', scheduledDate: '2024-12-30' },
{ id: 'ex11', name: 'Project Work', code: 'PROJ', type: 'Project', scheduledDate: '2025-02-28' },
{ id: 'ex12', name: 'Oral Test', code: 'ORAL', type: 'Oral', scheduledDate: '2025-02-20' }];


const getSubjectsForClass = (classId: string) => {
  const secondarySubjects = [
  { id: 'eng', code: 'ENG', name: 'English', totalMarks: 100 },
  { id: 'hin', code: 'HIN', name: 'Hindi', totalMarks: 100 },
  { id: 'math', code: 'MATH', name: 'Mathematics', totalMarks: 100 },
  { id: 'sci', code: 'SCI', name: 'Science', totalMarks: 100 },
  { id: 'sst', code: 'SST', name: 'Social Science', totalMarks: 100 },
  { id: 'it', code: 'IT', name: 'Information Technology', totalMarks: 100 }];


  const seniorSubjects = [
  { id: 'eng', code: 'ENG', name: 'English', totalMarks: 100 },
  { id: 'phy', code: 'PHY', name: 'Physics', totalMarks: 100 },
  { id: 'chem', code: 'CHEM', name: 'Chemistry', totalMarks: 100 },
  { id: 'math', code: 'MATH', name: 'Mathematics', totalMarks: 100 },
  { id: 'cs', code: 'CS', name: 'Computer Science', totalMarks: 100 },
  { id: 'pe', code: 'PE', name: 'Physical Education', totalMarks: 100 }];


  const primarySubjects = [
  { id: 'eng', code: 'ENG', name: 'English', totalMarks: 100 },
  { id: 'hin', code: 'HIN', name: 'Hindi', totalMarks: 100 },
  { id: 'math', code: 'MATH', name: 'Mathematics', totalMarks: 100 },
  { id: 'evs', code: 'EVS', name: 'Environmental Science', totalMarks: 100 },
  { id: 'gk', code: 'GK', name: 'General Knowledge', totalMarks: 50 }];


  if (['XI', 'XII'].includes(classId)) return seniorSubjects;
  if (['IX', 'X'].includes(classId)) return secondarySubjects;
  return primarySubjects;
};

// ============================================
// Utility Functions
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 11);

const getExamTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Unit Test': 'bg-blue-100 text-blue-700 border-blue-300',
    'Term Exam': 'bg-green-100 text-green-700 border-green-300',
    'Final Exam': 'bg-purple-100 text-purple-700 border-purple-300',
    'Practical': 'bg-orange-100 text-orange-700 border-orange-300',
    'Internal': 'bg-pink-100 text-pink-700 border-pink-300',
    'Board Prep': 'bg-red-100 text-red-700 border-red-300',
    'Project': 'bg-teal-100 text-teal-700 border-teal-300',
    'Oral': 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };
  return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
};

const getStatusColor = (status: ConfigStatus) => {
  switch (status) {
    case 'Active':return 'bg-green-100 text-green-800';
    case 'Draft':return 'bg-yellow-100 text-yellow-800';
    case 'Archived':return 'bg-gray-100 text-gray-800';
    default:return 'bg-gray-100 text-gray-800';
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Primary':return 'bg-green-50 border-green-200 text-green-700';
    case 'Middle':return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'Secondary':return 'bg-purple-50 border-purple-200 text-purple-700';
    case 'Senior Secondary':return 'bg-orange-50 border-orange-200 text-orange-700';
    default:return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

const getTermColor = (index: number) => {
  const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500'];

  return colors[index % colors.length];
};

const getTermBgColor = (index: number) => {
  const colors = [
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-orange-50 border-orange-200',
  'bg-pink-50 border-pink-200',
  'bg-teal-50 border-teal-200'];

  return colors[index % colors.length];
};

// Helper to create exam configs for a subject
const createExamConfigsForSubject = (exams: ExamConfig[]): ExamSubjectConfig[] => {
  return exams.map((exam) => ({
    examId: exam.id,
    examName: exam.examName,
    isIncluded: true,
    maxMarks: exam.maxMarks,
    passingMarks: Math.round(exam.maxMarks * 0.33),
    hasCustomBreakdown: false,
    breakdowns: [],
    isExpanded: false
  }));
};

// Create initial configs
const createInitialConfigs = (): ClassAssessmentConfig[] => {
  const createConfig = (
  id: string,
  classId: string,
  className: string,
  status: ConfigStatus)
  : ClassAssessmentConfig => {
    const terms: Term[] = [
    { id: 't1', name: 'Term 1', order: 1, weightage: 50, startDate: '2024-04-01', endDate: '2024-09-30' },
    { id: 't2', name: 'Term 2', order: 2, weightage: 50, startDate: '2024-10-01', endDate: '2025-03-31' }];


    const exams: ExamConfig[] = [
    { id: 'e1', examId: 'ex1', examName: 'Unit Test 1', examCode: 'UT1', examType: 'Unit Test', maxMarks: 40, passingMarks: 13, scheduledDate: '2024-05-15', order: 1, isActive: true, termId: 't1' },
    { id: 'e2', examId: 'ex3', examName: 'Half Yearly Examination', examCode: 'HY', examType: 'Term Exam', maxMarks: 80, passingMarks: 26, scheduledDate: '2024-09-15', order: 2, isActive: true, termId: 't1' },
    { id: 'e3', examId: 'ex4', examName: 'Unit Test 3', examCode: 'UT3', examType: 'Unit Test', maxMarks: 40, passingMarks: 13, scheduledDate: '2024-11-15', order: 3, isActive: true, termId: 't2' },
    { id: 'e4', examId: 'ex6', examName: 'Annual Examination', examCode: 'ANN', examType: 'Final Exam', maxMarks: 80, passingMarks: 26, scheduledDate: '2025-03-01', order: 4, isActive: true, termId: 't2' }];


    const classSubjects = getSubjectsForClass(classId);
    const subjects: SubjectConfig[] = classSubjects.map((sub) => ({
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      defaultTotalMarks: sub.totalMarks,
      examConfigs: createExamConfigsForSubject(exams),
      isExpanded: false
    }));

    const totalMarks = exams.reduce((sum, e) => sum + e.maxMarks, 0);

    return {
      id,
      academicYear: '2024-25',
      board: 'CBSE',
      classId,
      className,
      terms,
      exams,
      subjects,
      status,
      totalExams: exams.length,
      totalMarks,
      createdAt: '2024-01-15',
      updatedAt: '2024-02-20',
      createdBy: 'Admin'
    };
  };

  return [
  createConfig('cfg1', 'X', 'Class X', 'Active'),
  createConfig('cfg2', 'IX', 'Class IX', 'Active'),
  createConfig('cfg3', 'VIII', 'Class VIII', 'Draft'),
  createConfig('cfg4', 'XII', 'Class XII', 'Active')];

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
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
  onClick={onClick}>

    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-white',
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
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>

      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
  size?: 'sm' | 'md';
}> = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
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

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const sizeConfig = size === 'sm' ?
  { container: 'h-5 w-9', dot: 'h-3 w-3', translate: 'translate-x-5' } :
  { container: 'h-6 w-11', dot: 'h-4 w-4', translate: 'translate-x-6' };

  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex ${sizeConfig.container} items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>

      <span
        className={`inline-block ${sizeConfig.dot} transform rounded-full bg-white shadow-lg transition-transform duration-200 ${checked ? sizeConfig.translate : 'translate-x-1'}`} />

    </button>);

};

// ============================================
// Main Component
// ============================================

export function AssessmentPatternSetup() {
  // Active view
  const [activeView, setActiveView] = useState<'dashboard' | 'setup'>('dashboard');
  const [activeTab, setActiveTab] = useState<'class-selection' | 'exams' | 'terms' | 'subjects' | 'validation' | 'preview'>('class-selection');

  // Dashboard state
  const [dashboardConfigs, setDashboardConfigs] = useState<ClassAssessmentConfig[]>(createInitialConfigs());
  const [dashboardFilter, setDashboardFilter] = useState('');
  const [dashboardStatusFilter, setDashboardStatusFilter] = useState<ConfigStatus | 'All'>('All');

  // Selection State
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Current editing config
  const [currentConfig, setCurrentConfig] = useState<ClassAssessmentConfig | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [subjects, setSubjects] = useState<SubjectConfig[]>([]);

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [subjectViewMode, setSubjectViewMode] = useState<'bySubject' | 'byExam'>('bySubject');
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [newTermName, setNewTermName] = useState('');

  // ============================================
  // Dashboard Computed Values
  // ============================================

  const filteredDashboardConfigs = useMemo(() => {
    return dashboardConfigs.filter((config) => {
      const matchesSearch = config.className.toLowerCase().includes(dashboardFilter.toLowerCase()) ||
      config.board.toLowerCase().includes(dashboardFilter.toLowerCase());
      const matchesStatus = dashboardStatusFilter === 'All' || config.status === dashboardStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dashboardConfigs, dashboardFilter, dashboardStatusFilter]);

  const dashboardStats = useMemo(() => {
    return {
      total: dashboardConfigs.length,
      active: dashboardConfigs.filter((c) => c.status === 'Active').length,
      draft: dashboardConfigs.filter((c) => c.status === 'Draft').length,
      archived: dashboardConfigs.filter((c) => c.status === 'Archived').length
    };
  }, [dashboardConfigs]);

  // ============================================
  // Class Selection Handlers
  // ============================================

  const toggleClassSelection = (classId: string) => {
    setSelectedClasses((prev) =>
    prev.includes(classId) ?
    prev.filter((id) => id !== classId) :
    [...prev, classId]
    );
  };

  const selectAllClasses = () => {
    setSelectedClasses(allClasses.map((c) => c.id));
  };

  const clearClassSelection = () => {
    setSelectedClasses([]);
  };

  const selectByLevel = (level: string) => {
    const levelClasses = allClasses.filter((c) => c.level === level).map((c) => c.id);
    const allSelected = levelClasses.every((id) => selectedClasses.includes(id));

    if (allSelected) {
      setSelectedClasses((prev) => prev.filter((id) => !levelClasses.includes(id)));
    } else {
      setSelectedClasses((prev) => [...new Set([...prev, ...levelClasses])]);
    }
  };

  // ============================================
  // Initialize Configuration
  // ============================================

  const initializeSetup = () => {
    if (selectedClasses.length === 0) return;

    const firstClass = selectedClasses[0];
    const classInfo = allClasses.find((c) => c.id === firstClass);

    const classSubjects = getSubjectsForClass(firstClass);
    const subjectConfigs: SubjectConfig[] = classSubjects.map((sub) => ({
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      defaultTotalMarks: sub.totalMarks,
      examConfigs: [],
      isExpanded: false
    }));

    const newConfig: ClassAssessmentConfig = {
      id: generateId(),
      academicYear: selectedAcademicYear,
      board: selectedBoard,
      classId: firstClass,
      className: classInfo?.name || `Class ${firstClass}`,
      terms: [],
      exams: [],
      subjects: subjectConfigs,
      status: 'Draft',
      totalExams: 0,
      totalMarks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User'
    };

    setCurrentConfig(newConfig);
    setTerms([]);
    setExams([]);
    setSubjects(subjectConfigs);
    setEditingConfigId(null);
    setActiveTab('exams');
    setActiveView('setup');
  };

  // ============================================
  // Term Management
  // ============================================

  const addTerm = () => {
    const termName = newTermName.trim() || `Term ${terms.length + 1}`;
    const newTerm: Term = {
      id: generateId(),
      name: termName,
      order: terms.length + 1,
      weightage: 0,
      startDate: '',
      endDate: ''
    };
    setTerms((prev) => [...prev, newTerm]);
    setNewTermName('');
    setShowTermModal(false);
  };

  const updateTerm = (termId: string, updates: Partial<Term>) => {
    setTerms((prev) => prev.map((t) => t.id === termId ? { ...t, ...updates } : t));
  };

  const removeTerm = (termId: string) => {
    // Unassign all exams from this term
    setExams((prev) => prev.map((e) => e.termId === termId ? { ...e, termId: null } : e));
    // Remove the term
    setTerms((prev) => prev.filter((t) => t.id !== termId).map((t, idx) => ({ ...t, order: idx + 1 })));
  };

  const assignExamToTerm = (examId: string, termId: string | null) => {
    setExams((prev) => prev.map((e) => e.id === examId ? { ...e, termId } : e));
  };

  const moveTermUp = (termId: string) => {
    const index = terms.findIndex((t) => t.id === termId);
    if (index <= 0) return;

    const newTerms = [...terms];
    [newTerms[index], newTerms[index - 1]] = [newTerms[index - 1], newTerms[index]];
    setTerms(newTerms.map((t, idx) => ({ ...t, order: idx + 1 })));
  };

  const moveTermDown = (termId: string) => {
    const index = terms.findIndex((t) => t.id === termId);
    if (index >= terms.length - 1) return;

    const newTerms = [...terms];
    [newTerms[index], newTerms[index + 1]] = [newTerms[index + 1], newTerms[index]];
    setTerms(newTerms.map((t, idx) => ({ ...t, order: idx + 1 })));
  };

  // Get unassigned exams (not in any term)
  const unassignedExamsToTerms = useMemo(() => {
    return exams.filter((e) => !e.termId);
  }, [exams]);

  // Get exams for a specific term
  const getExamsForTerm = (termId: string) => {
    return exams.filter((e) => e.termId === termId);
  };

  // ============================================
  // Exam Management
  // ============================================

  const addExam = (examData: typeof examMasterData[0]) => {
    const newExam: ExamConfig = {
      id: generateId(),
      examId: examData.id,
      examName: examData.name,
      examCode: examData.code,
      examType: examData.type,
      maxMarks: 0, // Initialize with 0, user will set marks
      passingMarks: 0,
      scheduledDate: examData.scheduledDate,
      order: exams.length + 1,
      isActive: true,
      termId: null
    };

    setExams((prev) => [...prev, newExam]);

    // Add this exam to all subjects
    setSubjects((prev) => prev.map((subject) => ({
      ...subject,
      examConfigs: [
      ...subject.examConfigs,
      {
        examId: newExam.id,
        examName: newExam.examName,
        isIncluded: true,
        maxMarks: 0,
        passingMarks: 0,
        hasCustomBreakdown: false,
        breakdowns: [],
        isExpanded: false
      }]

    })));

    setShowExamModal(false);
  };

  const updateExam = (examId: string, updates: Partial<ExamConfig>) => {
    setExams((prev) => prev.map((e) => e.id === examId ? { ...e, ...updates } : e));

    // Update exam in subjects if marks changed
    if (updates.maxMarks !== undefined || updates.examName) {
      setSubjects((prev) => prev.map((subject) => ({
        ...subject,
        examConfigs: subject.examConfigs.map((ec) => {
          if (ec.examId !== examId) return ec;
          return {
            ...ec,
            examName: updates.examName ?? ec.examName,
            maxMarks: updates.maxMarks ?? ec.maxMarks,
            passingMarks: updates.passingMarks ?? ec.passingMarks
          };
        })
      })));
    }
  };

  const removeExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId).map((e, idx) => ({ ...e, order: idx + 1 })));

    // Remove this exam from all subjects
    setSubjects((prev) => prev.map((subject) => ({
      ...subject,
      examConfigs: subject.examConfigs.filter((ec) => ec.examId !== examId)
    })));
  };

  const moveExam = (examId: string, direction: 'up' | 'down') => {
    const index = exams.findIndex((e) => e.id === examId);
    if (direction === 'up' && index === 0 || direction === 'down' && index === exams.length - 1) {
      return;
    }

    const newExams = [...exams];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newExams[index], newExams[swapIndex]] = [newExams[swapIndex], newExams[index]];

    setExams(newExams.map((e, idx) => ({ ...e, order: idx + 1 })));
  };

  const unassignedExams = useMemo(() => {
    const assignedIds = new Set(exams.map((e) => e.examId));
    return examMasterData.filter((e) => !assignedIds.has(e.id));
  }, [exams]);

  // ============================================
  // Subject Management
  // ============================================

  const toggleSubjectExpanded = (subjectId: string) => {
    setSubjects((prev) => prev.map((sub) =>
    sub.subjectId === subjectId ? { ...sub, isExpanded: !sub.isExpanded } : sub
    ));
  };

  const toggleSubjectInExam = (subjectId: string, examId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ? { ...ec, isIncluded: !ec.isIncluded } : ec
        )
      };
    }));
  };

  const updateSubjectExamConfig = (
  subjectId: string,
  examId: string,
  updates: Partial<ExamSubjectConfig>) =>
  {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ? { ...ec, ...updates } : ec
        )
      };
    }));
  };

  const toggleExamBreakdown = (subjectId: string, examId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ?
        { ...ec, hasCustomBreakdown: !ec.hasCustomBreakdown, isExpanded: !ec.hasCustomBreakdown } :
        ec
        )
      };
    }));
  };

  const toggleExamConfigExpanded = (subjectId: string, examId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ? { ...ec, isExpanded: !ec.isExpanded } : ec
        )
      };
    }));
  };

  const addBreakdownToExam = (subjectId: string, examId: string) => {
    const newBreakdown: SubjectMarksBreakdown = {
      id: generateId(),
      componentName: '',
      maxMarks: 0,
      description: ''
    };
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ?
        { ...ec, breakdowns: [...ec.breakdowns, newBreakdown] } :
        ec
        )
      };
    }));
  };

  const updateBreakdownInExam = (
  subjectId: string,
  examId: string,
  breakdownId: string,
  updates: Partial<SubjectMarksBreakdown>) =>
  {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ?
        {
          ...ec,
          breakdowns: ec.breakdowns.map((b) =>
          b.id === breakdownId ? { ...b, ...updates } : b
          )
        } :
        ec
        )
      };
    }));
  };

  const removeBreakdownFromExam = (subjectId: string, examId: string, breakdownId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) =>
        ec.examId === examId ?
        { ...ec, breakdowns: ec.breakdowns.filter((b) => b.id !== breakdownId) } :
        ec
        )
      };
    }));
  };

  // Bulk operations
  const includeSubjectInAllExams = (subjectId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) => ({ ...ec, isIncluded: true }))
      };
    }));
  };

  const excludeSubjectFromAllExams = (subjectId: string) => {
    setSubjects((prev) => prev.map((subject) => {
      if (subject.subjectId !== subjectId) return subject;
      return {
        ...subject,
        examConfigs: subject.examConfigs.map((ec) => ({ ...ec, isIncluded: false }))
      };
    }));
  };

  // ============================================
  // Validation
  // ============================================

  const validateConfig = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (exams.length === 0) {
      errors.push({ field: 'exams', message: 'At least one exam is required', severity: 'error' });
    }

    exams.forEach((exam) => {
      if (exam.maxMarks <= 0) {
        errors.push({ field: `exam-${exam.id}`, message: `${exam.examName}: Maximum marks must be greater than 0`, severity: 'error' });
      }
      if (exam.passingMarks > exam.maxMarks) {
        errors.push({ field: `exam-${exam.id}`, message: `${exam.examName}: Passing marks cannot exceed max marks`, severity: 'error' });
      }
      if (!exam.termId && terms.length > 0) {
        errors.push({ field: `exam-${exam.id}`, message: `${exam.examName}: Not assigned to any term`, severity: 'warning' });
      }
    });

    if (terms.length > 0) {
      const totalWeightage = terms.reduce((sum, t) => sum + t.weightage, 0);
      if (totalWeightage !== 100 && totalWeightage !== 0) {
        errors.push({ field: 'terms', message: `Term weightages should total 100% (currently ${totalWeightage}%)`, severity: 'warning' });
      }
    }

    subjects.forEach((subject) => {
      subject.examConfigs.forEach((examConfig) => {
        if (examConfig.isIncluded && examConfig.hasCustomBreakdown) {
          const breakdownTotal = examConfig.breakdowns.reduce((sum, b) => sum + b.maxMarks, 0);
          if (breakdownTotal !== examConfig.maxMarks) {
            errors.push({
              field: `subject-${subject.subjectId}-exam-${examConfig.examId}`,
              message: `${subject.subjectName} (${examConfig.examName}): Breakdown total (${breakdownTotal}) doesn't match exam marks (${examConfig.maxMarks})`,
              severity: 'error'
            });
          }
          examConfig.breakdowns.forEach((breakdown) => {
            if (!breakdown.componentName.trim()) {
              errors.push({
                field: `breakdown-${breakdown.id}`,
                message: `${subject.subjectName} (${examConfig.examName}): Component name is required`,
                severity: 'warning'
              });
            }
          });
        }
      });

      // Check if subject is included in at least one exam
      const includedInAnyExam = subject.examConfigs.some((ec) => ec.isIncluded);
      if (!includedInAnyExam && exams.length > 0) {
        errors.push({
          field: `subject-${subject.subjectId}`,
          message: `${subject.subjectName}: Not included in any exam`,
          severity: 'warning'
        });
      }
    });

    return errors;
  }, [exams, subjects, terms]);

  useMemo(() => {
    const errors = validateConfig();
    setValidationErrors(errors);
  }, [validateConfig]);

  // ============================================
  // Save & Actions
  // ============================================

  const handleSave = async (status?: ConfigStatus) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const totalExamMarks = exams.reduce((sum, e) => sum + e.maxMarks, 0);

    if (currentConfig) {
      const updatedConfig: ClassAssessmentConfig = {
        ...currentConfig,
        terms: [...terms],
        exams: [...exams],
        subjects: [...subjects],
        status: status || currentConfig.status || 'Draft',
        totalExams: exams.length,
        totalMarks: totalExamMarks,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (editingConfigId) {
        setDashboardConfigs((prev) => prev.map((c) => c.id === editingConfigId ? updatedConfig : c));
      } else {
        setDashboardConfigs((prev) => [...prev, updatedConfig]);
      }

      setCurrentConfig(updatedConfig);
      setEditingConfigId(updatedConfig.id);
    }

    setIsSaving(false);
    alert(`Configuration ${status === 'Active' ? 'activated' : 'saved'} successfully!`);

    if (status === 'Active') {
      goBackToDashboard();
    }
  };

  const handleEditConfig = (config: ClassAssessmentConfig) => {
    const termConfigs = config.terms.map((t) => ({ ...t }));
    const examConfigs = config.exams.map((e) => ({ ...e }));

    const subjectConfigs = config.subjects.length > 0 ?
    config.subjects.map((s) => ({
      ...s,
      examConfigs: s.examConfigs.map((ec) => ({ ...ec, breakdowns: ec.breakdowns.map((b) => ({ ...b })) }))
    })) :
    getSubjectsForClass(config.classId).map((sub) => ({
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      defaultTotalMarks: sub.totalMarks,
      examConfigs: createExamConfigsForSubject(examConfigs),
      isExpanded: false
    }));

    setCurrentConfig({ ...config });
    setTerms(termConfigs);
    setExams(examConfigs);
    setSubjects(subjectConfigs);
    setSelectedClasses([config.classId]);
    setSelectedAcademicYear(config.academicYear);
    setSelectedBoard(config.board);
    setEditingConfigId(config.id);
    setActiveTab('exams');
    setActiveView('setup');
  };

  const handleDeleteConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      setDashboardConfigs((prev) => prev.filter((c) => c.id !== configId));
    }
  };

  const handleDuplicateConfig = (config: ClassAssessmentConfig) => {
    const newConfig: ClassAssessmentConfig = {
      ...config,
      id: generateId(),
      terms: config.terms.map((t) => ({ ...t, id: generateId() })),
      exams: config.exams.map((e) => ({ ...e, id: generateId() })),
      subjects: config.subjects.map((s) => ({
        ...s,
        examConfigs: s.examConfigs.map((ec) => ({
          ...ec,
          breakdowns: ec.breakdowns.map((b) => ({ ...b, id: generateId() }))
        }))
      })),
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDashboardConfigs((prev) => [...prev, newConfig]);
  };

  const goBackToDashboard = () => {
    setActiveView('dashboard');
    setCurrentConfig(null);
    setTerms([]);
    setExams([]);
    setSubjects([]);
    setSelectedClasses([]);
    setEditingConfigId(null);
    setActiveTab('class-selection');
  };

  const startNewConfig = () => {
    setCurrentConfig(null);
    setTerms([]);
    setExams([]);
    setSubjects([]);
    setSelectedClasses([]);
    setEditingConfigId(null);
    setActiveTab('class-selection');
    setActiveView('setup');
  };

  // ============================================
  // Computed Values
  // ============================================

  const totalExamMarks = exams.reduce((sum, e) => sum + e.maxMarks, 0);
  const errorCount = validationErrors.filter((e) => e.severity === 'error').length;
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length;

  // ============================================
  // Render Dashboard
  // ============================================

  const renderDashboard = () =>
  <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assessment Pattern Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of all class assessment configurations</p>
        </div>
        <Button variant="primary" onClick={startNewConfig}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Pattern
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Configurations</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{dashboardStats.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboardStats.draft}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-xl">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Archived</p>
              <p className="text-2xl font-bold text-gray-600">{dashboardStats.archived}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              value={dashboardFilter}
              onChange={(e) => setDashboardFilter(e.target.value)}
              placeholder="Search by class or board..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            {(['All', 'Active', 'Draft', 'Archived'] as const).map((status) =>
          <button
            key={status}
            onClick={() => setDashboardStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${dashboardStatusFilter === status ?
            'bg-blue-600 text-white' :
            'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
            }>

                {status}
              </button>
          )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDashboardConfigs.map((config) =>
      <Card key={config.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`p-4 ${config.status === 'Active' ? 'bg-green-50' : config.status === 'Draft' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.status === 'Active' ? 'bg-green-100' : config.status === 'Draft' ? 'bg-yellow-100' : 'bg-gray-100'}`
              }>
                    <GraduationCap className={`w-6 h-6 ${config.status === 'Active' ? 'text-green-600' : config.status === 'Draft' ? 'text-yellow-600' : 'text-gray-600'}`
                } />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{config.className}</h3>
                    <p className="text-sm text-gray-500">{config.board} • {config.academicYear}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(config.status)}>{config.status}</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">{config.terms?.length || 0}</p>
                  <p className="text-xs text-blue-600">Terms</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-700">{config.totalExams}</p>
                  <p className="text-xs text-purple-600">Exams</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-700">{config.totalMarks}</p>
                  <p className="text-xs text-green-600">Marks</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created: {config.createdAt}</span>
                <span>Updated: {config.updatedAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditConfig(config)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDuplicateConfig(config)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(config.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
      )}

        {filteredDashboardConfigs.length === 0 &&
      <div className="col-span-full">
            <Card className="p-12 text-center">
              <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No configurations found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or create a new pattern</p>
              <Button variant="primary" className="mt-4" onClick={startNewConfig}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Pattern
              </Button>
            </Card>
          </div>
      }
      </div>
    </div>;


  // ============================================
  // Render Class Selection
  // ============================================

  const renderClassSelection = () =>
  <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Select Classes for Assessment Setup</h2>
        <p className="text-gray-500 mt-2">Choose one or more classes to configure their assessment structure</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                {academicYears.map((year) =>
              <option key={year} value={year}>{year}</option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Board <span className="text-red-500">*</span>
              </label>
              <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                {boards.map((board) =>
              <option key={board} value={board}>{board}</option>
              )}
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Classes</h3>
            <div className="flex items-center gap-2">
              <Badge variant="info">{selectedClasses.length} selected</Badge>
              <Button variant="ghost" size="sm" onClick={selectAllClasses}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={clearClassSelection}>
                Clear
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
            <span className="text-sm text-gray-500 mr-2">Quick Select:</span>
            {['Primary', 'Middle', 'Secondary', 'Senior Secondary'].map((level) => {
            const levelClasses = allClasses.filter((c) => c.level === level).map((c) => c.id);
            const allSelected = levelClasses.every((id) => selectedClasses.includes(id));
            return (
              <button
                key={level}
                onClick={() => selectByLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${allSelected ?
                'bg-blue-600 text-white border-blue-600' :
                'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`
                }>

                  {level}
                </button>);

          })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allClasses.map((cls) => {
            const isSelected = selectedClasses.includes(cls.id);
            return (
              <div
                key={cls.id}
                onClick={() => toggleClassSelection(cls.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ?
                'bg-blue-600 text-white border-blue-600' :
                `${getLevelColor(cls.level)} hover:border-blue-400`}`
                }>

                  <div className="flex items-center justify-between mb-2">
                    {isSelected ?
                  <CheckSquare className="w-5 h-5" /> :

                  <Square className="w-5 h-5" />
                  }
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`
                  }>
                      {cls.level.split(' ')[0]}
                    </span>
                  </div>
                  <p className="font-bold text-center">{cls.id}</p>
                  <p className={`text-xs text-center mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                    {cls.name}
                  </p>
                </div>);

          })}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
          variant="primary"
          size="lg"
          onClick={initializeSetup}
          disabled={selectedClasses.length === 0}>

            Continue to Exam Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {selectedClasses.length === 0 &&
      <p className="text-center text-sm text-red-500">Please select at least one class to continue</p>
      }
      </div>
    </div>;


  // ============================================
  // Render Exam Setup
  // ============================================

  const renderExamSetup = () =>
  <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Exam Setup</h2>
          <p className="text-gray-500">
            Add exams and configure marks for {currentConfig?.className} • {currentConfig?.academicYear}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowExamModal(true)} disabled={unassignedExams.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exam
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Exams</p>
                <p className="text-2xl font-bold text-blue-700">{exams.length}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Marks</p>
                <p className="text-2xl font-bold text-purple-700">{totalExamMarks}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Exams without marks</p>
            <p className="text-xl font-bold text-orange-600">
              {exams.filter((e) => e.maxMarks === 0).length}
            </p>
          </div>
        </div>
      </Card>

      {exams.some((e) => e.maxMarks === 0) &&
    <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-800 font-medium">Some exams don't have marks configured</p>
              <p className="text-sm text-orange-600 mt-1">
                Please set the maximum marks and passing marks for all exams below.
              </p>
            </div>
          </div>
        </Card>
    }

      <Card className="overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-900">Configure Exams & Marks</h3>
        </div>

        {exams.length === 0 ?
      <div className="p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No exams added yet</p>
            <p className="text-sm text-gray-500 mt-1">Add exams from the exam master to define the assessment structure</p>
            <Button variant="primary" className="mt-4" onClick={() => setShowExamModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Exam
            </Button>
          </div> :

      <div className="divide-y divide-gray-100">
            {exams.map((exam, index) =>
        <div key={exam.id} className={`p-4 hover:bg-gray-50 transition-colors ${exam.maxMarks === 0 ? 'bg-orange-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                onClick={() => moveExam(exam.id, 'up')}
                disabled={index === 0}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">

                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                onClick={() => moveExam(exam.id, 'down')}
                disabled={index === exams.length - 1}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">

                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {exam.order}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{exam.examName}</h4>
                      <Badge className={getExamTypeColor(exam.examType)} size="sm">{exam.examType}</Badge>
                      {exam.maxMarks === 0 &&
                <Badge variant="warning" size="sm">Marks not set</Badge>
                }
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exam.scheduledDate}
                      </span>
                      <span>Code: {exam.examCode}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <label className="text-xs text-gray-500 block mb-1">Max Marks <span className="text-red-500">*</span></label>
                      <input
                  type="number"
                  value={exam.maxMarks || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    updateExam(exam.id, {
                      maxMarks: val,
                      passingMarks: Math.round(val * 0.33)
                    });
                  }}
                  placeholder="0"
                  className={`w-20 px-3 py-2 border rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none ${exam.maxMarks === 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-300'}`
                  }
                  min={0} />

                    </div>
                    <div className="text-center">
                      <label className="text-xs text-gray-500 block mb-1">Pass Marks</label>
                      <input
                  type="number"
                  value={exam.passingMarks || ''}
                  onChange={(e) => updateExam(exam.id, { passingMarks: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                  min={0}
                  max={exam.maxMarks} />

                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                checked={exam.isActive}
                onChange={(val) => updateExam(exam.id, { isActive: val })}
                size="sm" />

                    <span className="text-xs text-gray-500">Active</span>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => removeExam(exam.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
        )}
          </div>
      }
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Exam Type Legend</h4>
        <div className="flex flex-wrap gap-2">
          {['Unit Test', 'Term Exam', 'Final Exam', 'Practical', 'Internal', 'Board Prep', 'Project', 'Oral'].map((type) =>
        <Badge key={type} className={getExamTypeColor(type)}>{type}</Badge>
        )}
        </div>
      </Card>
    </div>;


  // ============================================
  // Render Term Setup
  // ============================================

  const renderTermSetup = () =>
  <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Term Setup</h2>
          <p className="text-gray-500">
            Create terms and assign exams to each term for {currentConfig?.className}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowTermModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>

      {exams.length === 0 ?
    <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No exams configured yet</p>
          <p className="text-sm text-gray-500 mt-1">Please add exams first in the Exam Setup tab</p>
          <Button variant="primary" className="mt-4" onClick={() => setActiveTab('exams')}>
            Go to Exam Setup
          </Button>
        </Card> :

    <>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Term Organization</p>
                <p className="text-sm text-blue-600 mt-1">
                  • Create terms (e.g., Term 1, Term 2, Semester 1, etc.)<br />
                  • Assign exams to each term using the dropdown<br />
                  • Unassigned exams will appear in the "Unassigned" section
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Terms Column */}
            <div className="lg:col-span-2 space-y-4">
              {terms.length === 0 ?
          <Card className="p-8 text-center border-2 border-dashed border-gray-300">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No terms created yet</p>
                  <p className="text-sm text-gray-500 mt-1">Create terms to organize your exams</p>
                  <Button variant="primary" className="mt-4" onClick={() => setShowTermModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Term
                  </Button>
                </Card> :

          terms.map((term, termIndex) => {
            const termExams = getExamsForTerm(term.id);
            const termMarks = termExams.reduce((sum, e) => sum + e.maxMarks, 0);

            return (
              <Card key={term.id} className="overflow-hidden">
                      <div className={`p-4 ${getTermBgColor(termIndex)} border-b`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                          onClick={() => moveTermUp(term.id)}
                          disabled={termIndex === 0}
                          className="p-1 hover:bg-white/50 rounded disabled:opacity-30">

                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                          onClick={() => moveTermDown(term.id)}
                          disabled={termIndex === terms.length - 1}
                          className="p-1 hover:bg-white/50 rounded disabled:opacity-30">

                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                            <div className={`w-10 h-10 ${getTermColor(termIndex)} rounded-lg flex items-center justify-center text-white font-bold`}>
                              {term.order}
                            </div>
                            <div>
                              {editingTermId === term.id ?
                        <input
                          type="text"
                          value={term.name}
                          onChange={(e) => updateTerm(term.id, { name: e.target.value })}
                          onBlur={() => setEditingTermId(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingTermId(null)}
                          className="px-2 py-1 border border-gray-300 rounded font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                          autoFocus /> :


                        <h3
                          className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => setEditingTermId(term.id)}>

                                  {term.name}
                                  <Edit3 className="w-3 h-3 inline ml-2 text-gray-400" />
                                </h3>
                        }
                              <p className="text-sm text-gray-500">
                                {termExams.length} exam{termExams.length !== 1 ? 's' : ''} • {termMarks} marks
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-500">Weightage:</label>
                              <input
                          type="number"
                          value={term.weightage || ''}
                          onChange={(e) => updateTerm(term.id, { weightage: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          min={0}
                          max={100} />

                              <span className="text-xs text-gray-500">%</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeTerm(term.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        {termExams.length === 0 ?
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-sm text-gray-500">No exams assigned to this term</p>
                            <p className="text-xs text-gray-400 mt-1">Use the dropdown in the exam cards to assign exams</p>
                          </div> :

                  <div className="space-y-2">
                            {termExams.map((exam, idx) =>
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="font-medium text-gray-900">{exam.examName}</span>
                                    <Badge className={`ml-2 ${getExamTypeColor(exam.examType)}`} size="sm">{exam.examType}</Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-600">{exam.maxMarks} marks</span>
                                  <button
                          onClick={() => assignExamToTerm(exam.id, null)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                          title="Remove from term">

                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                    )}
                          </div>
                  }
                      </div>
                    </Card>);

          })
          }
            </div>

            {/* Unassigned Exams Sidebar */}
            <div className="space-y-4">
              <Card className="overflow-hidden sticky top-4">
                <div className="p-4 bg-gray-100 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Unassigned Exams
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{unassignedExamsToTerms.length} exam{unassignedExamsToTerms.length !== 1 ? 's' : ''} to assign</p>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {unassignedExamsToTerms.length === 0 ?
              <div className="text-center py-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">All exams assigned!</p>
                    </div> :

              <div className="space-y-3">
                      {unassignedExamsToTerms.map((exam) =>
                <div
                  key={exam.id}
                  className="p-3 border rounded-lg bg-white hover:border-blue-300 transition-colors">

                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">{exam.examName}</span>
                            <Badge className={getExamTypeColor(exam.examType)} size="sm">{exam.examType}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{exam.maxMarks} marks</span>
                            {terms.length > 0 ?
                    <select
                      value=""
                      onChange={(e) => assignExamToTerm(exam.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none">

                                <option value="">Assign to term...</option>
                                {terms.map((term) =>
                      <option key={term.id} value={term.id}>{term.name}</option>
                      )}
                              </select> :

                    <span className="text-xs text-orange-500">Create a term first</span>
                    }
                          </div>
                        </div>
                )}
                    </div>
              }
                </div>
              </Card>

              {terms.length > 0 &&
          <Card className="p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Term Summary</h4>
                  <div className="space-y-2">
                    {terms.map((term, idx) => {
                const termExams = getExamsForTerm(term.id);
                const termMarks = termExams.reduce((sum, e) => sum + e.maxMarks, 0);
                return (
                  <div key={term.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getTermColor(idx)}`}></div>
                            <span className="text-gray-700">{term.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{termExams.length} exams</span>
                            <span className="font-medium text-gray-900">{termMarks}m</span>
                          </div>
                        </div>);

              })}
                    <div className="border-t pt-2 mt-2 flex items-center justify-between font-medium">
                      <span className="text-gray-700">Total</span>
                      <span className="text-gray-900">{totalExamMarks} marks</span>
                    </div>
                  </div>
                </Card>
          }
            </div>
          </div>
        </>
    }
    </div>;


  // ============================================
  // Render Subject Configuration
  // ============================================

  const renderSubjectConfiguration = () =>
  <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Subject-Exam Configuration</h2>
          <p className="text-gray-500">Configure which subjects appear in which exams and optionally divide marks into components</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View by:</span>
          <button
          onClick={() => setSubjectViewMode('bySubject')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${subjectViewMode === 'bySubject' ?
          'bg-blue-600 text-white' :
          'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
          }>

            <BookOpen className="w-4 h-4 inline mr-1" />
            Subject
          </button>
          <button
          onClick={() => setSubjectViewMode('byExam')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${subjectViewMode === 'byExam' ?
          'bg-blue-600 text-white' :
          'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
          }>

            <Target className="w-4 h-4 inline mr-1" />
            Exam
          </button>
        </div>
      </div>

      {exams.length === 0 ?
    <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No exams configured yet</p>
          <p className="text-sm text-gray-500 mt-1">Please add exams first in the Exam Setup tab</p>
          <Button variant="primary" className="mt-4" onClick={() => setActiveTab('exams')}>
            Go to Exam Setup
          </Button>
        </Card> :

    <>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Subject-Exam Configuration</p>
                <p className="text-sm text-blue-600 mt-1">
                  • Toggle subjects on/off for each exam using the switches<br />
                  • Set specific marks for each subject in each exam<br />
                  • Optionally divide marks into components (Theory, Practical, etc.) per exam
                </p>
              </div>
            </div>
          </Card>

          {subjectViewMode === 'bySubject' ?
      // View by Subject
      <div className="space-y-4">
              {subjects.map((subject) => {
          const includedExamsCount = subject.examConfigs.filter((ec) => ec.isIncluded).length;
          const totalSubjectMarks = subject.examConfigs.
          filter((ec) => ec.isIncluded).
          reduce((sum, ec) => sum + ec.maxMarks, 0);

          return (
            <Card key={subject.subjectId} className="overflow-hidden">
                    <div
                className={`p-4 flex items-center justify-between cursor-pointer ${subject.isExpanded ? 'bg-blue-50 border-b' : 'bg-gray-50'}`
                }
                onClick={() => toggleSubjectExpanded(subject.subjectId)}>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{subject.subjectName}</h3>
                            <Badge variant="default" size="sm">{subject.subjectCode}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Included in {includedExamsCount}/{exams.length} exams • Total: {totalSubjectMarks} marks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {e.stopPropagation();includeSubjectInAllExams(subject.subjectId);}}>

                            Include All
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {e.stopPropagation();excludeSubjectFromAllExams(subject.subjectId);}}>

                            Exclude All
                          </Button>
                        </div>
                        {subject.isExpanded ?
                  <ChevronUp className="w-5 h-5 text-gray-400" /> :

                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                      </div>
                    </div>

                    {subject.isExpanded &&
              <div className="p-4">
                        <div className="space-y-3">
                          {subject.examConfigs.map((examConfig) => {
                    const exam = exams.find((e) => e.id === examConfig.examId);
                    if (!exam) return null;

                    const breakdownTotal = examConfig.breakdowns.reduce((sum, b) => sum + b.maxMarks, 0);
                    const isBreakdownValid = !examConfig.hasCustomBreakdown || breakdownTotal === examConfig.maxMarks;
                    const term = terms.find((t) => t.id === exam.termId);

                    return (
                      <div
                        key={examConfig.examId}
                        className={`border rounded-lg overflow-hidden ${examConfig.isIncluded ? 'border-blue-200' : 'border-gray-200 opacity-60'}`
                        }>

                                <div className="p-3 bg-gray-50 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <ToggleSwitch
                              checked={examConfig.isIncluded}
                              onChange={() => toggleSubjectInExam(subject.subjectId, examConfig.examId)}
                              size="sm" />

                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{exam.examName}</span>
                                        <Badge className={getExamTypeColor(exam.examType)} size="sm">{exam.examType}</Badge>
                                        {term &&
                                <Badge variant="info" size="sm">{term.name}</Badge>
                                }
                                      </div>
                                      <span className="text-xs text-gray-500">{exam.scheduledDate}</span>
                                    </div>
                                  </div>

                                  {examConfig.isIncluded &&
                          <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500">Marks:</label>
                                        <input
                                type="number"
                                value={examConfig.maxMarks || ''}
                                onChange={(e) => updateSubjectExamConfig(
                                  subject.subjectId,
                                  examConfig.examId,
                                  { maxMarks: parseInt(e.target.value) || 0 }
                                )}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                min={0} />

                                      </div>
                                      <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500">Pass:</label>
                                        <input
                                type="number"
                                value={examConfig.passingMarks || ''}
                                onChange={(e) => updateSubjectExamConfig(
                                  subject.subjectId,
                                  examConfig.examId,
                                  { passingMarks: parseInt(e.target.value) || 0 }
                                )}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                min={0} />

                                      </div>

                                      <div className="flex items-center gap-2 border-l pl-4">
                                        <span className="text-xs text-gray-500">Breakdown</span>
                                        <ToggleSwitch
                                checked={examConfig.hasCustomBreakdown}
                                onChange={() => toggleExamBreakdown(subject.subjectId, examConfig.examId)}
                                size="sm" />

                                      </div>

                                      {examConfig.hasCustomBreakdown &&
                            <button
                              onClick={() => toggleExamConfigExpanded(subject.subjectId, examConfig.examId)}
                              className="p-1 hover:bg-gray-200 rounded">

                                          {examConfig.isExpanded ?
                              <ChevronUp className="w-4 h-4" /> :

                              <ChevronDown className="w-4 h-4" />
                              }
                                        </button>
                            }
                                    </div>
                          }
                                </div>

                                {examConfig.isIncluded && examConfig.hasCustomBreakdown && examConfig.isExpanded &&
                        <div className="p-3 bg-white border-t">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="text-sm font-medium text-gray-700">Marks Breakdown</h5>
                                      <Button
                              variant="outline"
                              size="xs"
                              onClick={() => addBreakdownToExam(subject.subjectId, examConfig.examId)}>

                                        <Plus className="w-3 h-3 mr-1" />
                                        Add Component
                                      </Button>
                                    </div>

                                    {examConfig.breakdowns.length === 0 ?
                          <div className="text-center py-4 bg-gray-50 rounded border-2 border-dashed border-gray-200">
                                        <p className="text-sm text-gray-500">No components added</p>
                                      </div> :

                          <div className="space-y-2">
                                        {examConfig.breakdowns.map((breakdown, idx) =>
                            <div key={breakdown.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                              {idx + 1}
                                            </span>
                                            <input
                                type="text"
                                value={breakdown.componentName}
                                onChange={(e) => updateBreakdownInExam(
                                  subject.subjectId,
                                  examConfig.examId,
                                  breakdown.id,
                                  { componentName: e.target.value }
                                )}
                                placeholder="Component name"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

                                            <input
                                type="number"
                                value={breakdown.maxMarks || ''}
                                onChange={(e) => updateBreakdownInExam(
                                  subject.subjectId,
                                  examConfig.examId,
                                  breakdown.id,
                                  { maxMarks: parseInt(e.target.value) || 0 }
                                )}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                min={0} />

                                            <span className="text-xs text-gray-500">marks</span>
                                            <button
                                onClick={() => removeBreakdownFromExam(subject.subjectId, examConfig.examId, breakdown.id)}
                                className="p-1 hover:bg-red-100 rounded">

                                              <Trash2 className="w-3 h-3 text-red-500" />
                                            </button>
                                          </div>
                            )}

                                        <div className={`p-2 rounded flex items-center justify-between ${isBreakdownValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`
                            }>
                                          <span className={`text-sm font-medium ${isBreakdownValid ? 'text-green-700' : 'text-red-700'}`}>
                                            Total
                                          </span>
                                          <span className={`text-sm font-bold ${isBreakdownValid ? 'text-green-700' : 'text-red-700'}`}>
                                            {breakdownTotal} / {examConfig.maxMarks}
                                            {!isBreakdownValid &&
                                <span className="ml-1">
                                                ({examConfig.maxMarks - breakdownTotal > 0 ? `${examConfig.maxMarks - breakdownTotal} remaining` : `${breakdownTotal - examConfig.maxMarks} over`})
                                              </span>
                                }
                                          </span>
                                        </div>
                                      </div>
                          }
                                  </div>
                        }
                              </div>);

                  })}
                        </div>
                      </div>
              }
                  </Card>);

        })}
            </div> :

      // View by Exam
      <div className="space-y-4">
              {terms.length > 0 ?
        terms.map((term, termIndex) => {
          const termExams = getExamsForTerm(term.id);
          if (termExams.length === 0) return null;

          return (
            <div key={term.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getTermColor(termIndex)}`}></div>
                        <h3 className="font-semibold text-gray-900">{term.name}</h3>
                        <Badge variant="info" size="sm">{termExams.length} exams</Badge>
                      </div>

                      {termExams.map((exam) => renderExamCard(exam))}
                    </div>);

        }) :

        exams.map((exam) => renderExamCard(exam))
        }

              {unassignedExamsToTerms.length > 0 && terms.length > 0 &&
        <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <h3 className="font-semibold text-gray-500">Unassigned Exams</h3>
                    <Badge variant="warning" size="sm">{unassignedExamsToTerms.length} exams</Badge>
                  </div>

                  {unassignedExamsToTerms.map((exam) => renderExamCard(exam))}
                </div>
        }
            </div>
      }
        </>
    }
    </div>;


  const renderExamCard = (exam: ExamConfig) => {
    const subjectsInExam = subjects.filter((s) =>
    s.examConfigs.find((ec) => ec.examId === exam.id)?.isIncluded
    );
    const totalMarksForExam = subjects.reduce((sum, s) => {
      const ec = s.examConfigs.find((ec) => ec.examId === exam.id);
      return sum + (ec?.isIncluded ? ec.maxMarks : 0);
    }, 0);
    const term = terms.find((t) => t.id === exam.termId);

    return (
      <Card key={exam.id} className="overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {exam.order}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{exam.examName}</h3>
                  <Badge className={getExamTypeColor(exam.examType)} size="sm">{exam.examType}</Badge>
                  {term && <Badge variant="info" size="sm">{term.name}</Badge>}
                </div>
                <p className="text-sm text-gray-500">
                  {subjectsInExam.length} subjects • Total: {totalMarksForExam} marks
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{exam.scheduledDate}</p>
              <p className="text-lg font-bold text-blue-600">{exam.maxMarks} marks</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((subject) => {
              const examConfig = subject.examConfigs.find((ec) => ec.examId === exam.id);
              if (!examConfig) return null;

              return (
                <div
                  key={subject.subjectId}
                  className={`p-3 rounded-lg border-2 transition-all ${examConfig.isIncluded ?
                  'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50 opacity-60'}`
                  }>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={examConfig.isIncluded}
                        onChange={() => toggleSubjectInExam(subject.subjectId, exam.id)}
                        size="sm" />

                      <span className="font-medium text-gray-900">{subject.subjectName}</span>
                    </div>
                    <Badge variant="default" size="sm">{subject.subjectCode}</Badge>
                  </div>

                  {examConfig.isIncluded &&
                  <div className="flex items-center gap-2 mt-2">
                      <input
                      type="number"
                      value={examConfig.maxMarks || ''}
                      onChange={(e) => updateSubjectExamConfig(
                        subject.subjectId,
                        exam.id,
                        { maxMarks: parseInt(e.target.value) || 0 }
                      )}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      min={0} />

                      <span className="text-xs text-gray-500">marks</span>
                      {examConfig.hasCustomBreakdown &&
                    <Badge variant="info" size="sm">
                          {examConfig.breakdowns.length} components
                        </Badge>
                    }
                    </div>
                  }
                </div>);

            })}
          </div>
        </div>
      </Card>);

  };

  // ============================================
  // Render Validation
  // ============================================

  const renderValidation = () =>
  <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-4 ${errorCount === 0 && warningCount === 0 ? 'bg-green-50 border-green-200' : ''}`}>
          <div className="flex items-center gap-3">
            {errorCount === 0 && warningCount === 0 ?
          <CheckCircle2 className="w-8 h-8 text-green-600" /> :

          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          }
            <div>
              <p className="text-sm text-gray-600">Validation Status</p>
              <p className="text-xl font-bold">
                {errorCount === 0 && warningCount === 0 ? 'All Valid!' : 'Issues Found'}
              </p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${errorCount > 0 ? 'bg-red-50 border-red-200' : ''}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-8 h-8 ${errorCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-xl font-bold text-red-600">{errorCount}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${warningCount > 0 ? 'bg-yellow-50 border-yellow-200' : ''}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-8 h-8 ${warningCount > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm text-gray-600">Warnings</p>
              <p className="text-xl font-bold text-yellow-600">{warningCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Validation Results</h3>
        </div>
        <div className="p-4 space-y-3">
          {validationErrors.length === 0 ?
        <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-green-700">Configuration is valid!</p>
              <p className="text-sm text-gray-500">All validation rules passed successfully</p>
            </div> :

        validationErrors.map((error, index) =>
        <div
          key={index}
          className={`flex items-start gap-3 p-3 rounded-lg ${error.severity === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`
          }>

                {error.severity === 'error' ?
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" /> :

          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
          }
                <div>
                  <p className={`font-medium ${error.severity === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>
                    {error.message}
                  </p>
                </div>
              </div>
        )
        }
        </div>
      </Card>

      <Card>
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Configuration Checklist</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              {exams.length > 0 ?
            <CheckCircle2 className="w-5 h-5 text-green-500" /> :

            <AlertCircle className="w-5 h-5 text-red-500" />
            }
              <span className={exams.length > 0 ? 'text-green-700' : 'text-red-700'}>
                At least one exam is configured
              </span>
            </li>
            <li className="flex items-center gap-3">
              {exams.every((e) => e.maxMarks > 0) ?
            <CheckCircle2 className="w-5 h-5 text-green-500" /> :

            <AlertCircle className="w-5 h-5 text-red-500" />
            }
              <span className={exams.every((e) => e.maxMarks > 0) ? 'text-green-700' : 'text-red-700'}>
                All exams have valid max marks
              </span>
            </li>
            <li className="flex items-center gap-3">
              {terms.length === 0 || exams.every((e) => e.termId) ?
            <CheckCircle2 className="w-5 h-5 text-green-500" /> :

            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            }
              <span className="text-gray-700">
                All exams are assigned to terms
              </span>
            </li>
            <li className="flex items-center gap-3">
              {subjects.every((s) => s.examConfigs.some((ec) => ec.isIncluded)) ?
            <CheckCircle2 className="w-5 h-5 text-green-500" /> :

            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            }
              <span className="text-gray-700">
                All subjects are included in at least one exam
              </span>
            </li>
            <li className="flex items-center gap-3">
              {subjects.every((s) =>
            s.examConfigs.every((ec) =>
            !ec.hasCustomBreakdown ||
            ec.breakdowns.reduce((sum, b) => sum + b.maxMarks, 0) === ec.maxMarks
            )
            ) ?
            <CheckCircle2 className="w-5 h-5 text-green-500" /> :

            <AlertCircle className="w-5 h-5 text-red-500" />
            }
              <span className="text-gray-700">
                All subject breakdowns match exam marks
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>;


  // ============================================
  // Render Preview
  // ============================================

  const renderPreview = () =>
  <div className="p-6 space-y-6">
      <Card className="overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentConfig?.className} Assessment Pattern</h2>
              <p className="text-blue-100 mt-1">
                {currentConfig?.board} • {currentConfig?.academicYear}
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">{currentConfig?.status}</Badge>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-200 text-sm">Terms</p>
              <p className="text-3xl font-bold">{terms.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-200 text-sm">Total Exams</p>
              <p className="text-3xl font-bold">{exams.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-200 text-sm">Total Marks</p>
              <p className="text-3xl font-bold">{totalExamMarks}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-200 text-sm">Subjects</p>
              <p className="text-3xl font-bold">{subjects.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {terms.length > 0 &&
    <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            Term Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {terms.map((term, index) => {
          const termExams = getExamsForTerm(term.id);
          const termMarks = termExams.reduce((sum, e) => sum + e.maxMarks, 0);

          return (
            <div key={term.id} className={`p-4 rounded-lg border-2 ${getTermBgColor(index)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${getTermColor(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {term.order}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{term.name}</h4>
                      <p className="text-xs text-gray-500">{term.weightage}% weightage</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {termExams.map((exam) =>
                <div key={exam.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{exam.examName}</span>
                        <span className="font-medium text-gray-900">{exam.maxMarks}m</span>
                      </div>
                )}
                  </div>
                  <div className="border-t mt-3 pt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{termExams.length} exams</span>
                    <span className="text-sm font-bold text-gray-900">{termMarks} marks</span>
                  </div>
                </div>);

        })}
          </div>
        </Card>
    }

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Exam Schedule
        </h3>
        <div className="relative">
          {exams.map((exam, index) => {
          const term = terms.find((t) => t.id === exam.termId);

          return (
            <div key={exam.id} className="flex items-start gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${exam.isActive ? 'bg-blue-600' : 'bg-gray-400'}`
                }>
                    {exam.order}
                  </div>
                  {index < exams.length - 1 &&
                <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                }
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exam.examName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getExamTypeColor(exam.examType)} size="sm">{exam.examType}</Badge>
                        {term && <Badge variant="info" size="sm">{term.name}</Badge>}
                        <span className="text-sm text-gray-500">{exam.scheduledDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{exam.maxMarks} marks</p>
                      <p className="text-xs text-gray-500">Pass: {exam.passingMarks}</p>
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Subject-Exam Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left font-semibold text-gray-700">Subject</th>
                {exams.map((exam) =>
              <th key={exam.id} className="border p-2 text-center font-semibold text-gray-700">
                    <div className="text-xs">{exam.examCode}</div>
                    <div className="text-[10px] text-gray-500">{exam.maxMarks}m</div>
                  </th>
              )}
                <th className="border p-2 text-center font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => {
              const totalMarks = subject.examConfigs.
              filter((ec) => ec.isIncluded).
              reduce((sum, ec) => sum + ec.maxMarks, 0);

              return (
                <tr key={subject.subjectId}>
                    <td className="border p-2 font-medium text-gray-900">
                      {subject.subjectName}
                      <span className="text-xs text-gray-500 ml-1">({subject.subjectCode})</span>
                    </td>
                    {exams.map((exam) => {
                    const ec = subject.examConfigs.find((e) => e.examId === exam.id);
                    return (
                      <td key={exam.id} className="border p-2 text-center">
                          {ec?.isIncluded ?
                        <div>
                              <span className="font-bold text-blue-600">{ec.maxMarks}</span>
                              {ec.hasCustomBreakdown && ec.breakdowns.length > 0 &&
                          <div className="text-[10px] text-gray-500 mt-1">
                                  {ec.breakdowns.map((b) => b.componentName).join(', ')}
                                </div>
                          }
                            </div> :

                        <span className="text-gray-300">—</span>
                        }
                        </td>);

                  })}
                    <td className="border p-2 text-center font-bold text-gray-900">{totalMarks}</td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Marks Distribution by Exam Type
        </h3>
        <div className="space-y-3">
          {['Unit Test', 'Term Exam', 'Final Exam', 'Practical', 'Internal', 'Board Prep', 'Project', 'Oral'].map((type) => {
          const typeExams = exams.filter((e) => e.examType === type);
          const typeTotal = typeExams.reduce((sum, e) => sum + e.maxMarks, 0);
          const percentage = totalExamMarks > 0 ? typeTotal / totalExamMarks * 100 : 0;

          if (typeExams.length === 0) return null;

          return (
            <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getExamTypeColor(type)} size="sm">{type}</Badge>
                    <span className="text-sm text-gray-600">({typeExams.length} exam{typeExams.length > 1 ? 's' : ''})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{typeTotal} marks ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{ width: `${percentage}%` }} />

                </div>
              </div>);

        })}
        </div>
      </Card>
    </div>;


  // ============================================
  // Exam Selection Modal
  // ============================================

  const ExamSelectionModal = () => {
    if (!showExamModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-900">Add Exam from Exam Master</h3>
            <button onClick={() => setShowExamModal(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {unassignedExams.length === 0 ?
            <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No more exams available</p>
                <p className="text-sm text-gray-500">All exams have been assigned</p>
              </div> :

            <div className="space-y-3">
                {unassignedExams.map((exam) =>
              <div
                key={exam.id}
                className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                onClick={() => addExam(exam)}>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getExamTypeColor(exam.type)} size="sm">{exam.type}</Badge>
                          <span className="text-sm text-gray-500">{exam.code}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Scheduled: {exam.scheduledDate}</p>
                        <p className="text-xs text-orange-600 mt-1">Marks to be configured</p>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            }
          </div>
          <div className="p-4 border-t bg-gray-50">
            <Button variant="outline" onClick={() => setShowExamModal(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </Card>
      </div>);

  };

  // ============================================
  // Term Modal
  // ============================================

  const TermModal = () => {
    if (!showTermModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-900">Add New Term</h3>
            <button onClick={() => setShowTermModal(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term Name
            </label>
            <input
              type="text"
              value={newTermName}
              onChange={(e) => setNewTermName(e.target.value)}
              placeholder={`e.g., Term ${terms.length + 1}, Semester ${terms.length + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus />

          </div>
          <div className="p-4 border-t bg-gray-50 flex gap-3">
            <Button variant="outline" onClick={() => setShowTermModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={addTerm} className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              Add Term
            </Button>
          </div>
        </Card>
      </div>);

  };

  // ============================================
  // Tab Navigation
  // ============================================

  const tabs = [
  { id: 'class-selection', label: 'Class Selection', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'exams', label: 'Exam Setup', icon: <Target className="w-4 h-4" />, badge: exams.length },
  { id: 'terms', label: 'Term Setup', icon: <FolderOpen className="w-4 h-4" />, badge: terms.length },
  { id: 'subjects', label: 'Subject Config', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'validation', label: 'Validation', icon: <ListChecks className="w-4 h-4" />, badge: errorCount + warningCount },
  { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> }];


  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {activeView === 'setup' &&
              <Button variant="ghost" onClick={goBackToDashboard}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              }
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                {activeView === 'dashboard' ?
                <LayoutDashboard className="w-6 h-6 text-white" /> :

                <Settings className="w-6 h-6 text-white" />
                }
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {activeView === 'dashboard' ? 'Assessment Pattern Dashboard' : 'Assessment Pattern Setup'}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeView === 'dashboard' ?
                  'Manage assessment configurations for all classes' :
                  currentConfig ?
                  `${currentConfig.className} • ${currentConfig.board} • ${currentConfig.academicYear}` :
                  'Configure assessment pattern for selected classes'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeView === 'setup' && currentConfig &&
              <>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${errorCount === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                }>
                    {errorCount === 0 ?
                  <CheckCircle2 className="w-4 h-4" /> :

                  <AlertCircle className="w-4 h-4" />
                  }
                    <span className="text-sm font-medium">
                      {errorCount === 0 ? 'Valid' : `${errorCount} errors`}
                    </span>
                  </div>

                  <Badge className={getStatusColor(currentConfig.status)}>{currentConfig.status}</Badge>

                  <Button variant="outline" onClick={() => handleSave()} disabled={isSaving}>
                    {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Draft
                  </Button>

                  <Button variant="success" onClick={() => handleSave('Active')} disabled={isSaving || errorCount > 0}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                </>
              }
            </div>
          </div>

          {activeView === 'setup' &&
          <div className="border-t">
              <nav className="flex space-x-1 px-0" aria-label="Tabs">
                {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ?
                'border-blue-600 text-blue-600' :
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }>

                    {tab.icon}
                    {tab.label}
                    {tab.badge !== undefined && tab.badge > 0 &&
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`
                }>
                        {tab.badge}
                      </span>
                }
                  </button>
              )}
              </nav>
            </div>
          }
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeView === 'dashboard' ?
        renderDashboard() :

        <Card className="m-6">
            {activeTab === 'class-selection' && renderClassSelection()}
            {activeTab === 'exams' && currentConfig && renderExamSetup()}
            {activeTab === 'terms' && currentConfig && renderTermSetup()}
            {activeTab === 'subjects' && currentConfig && renderSubjectConfiguration()}
            {activeTab === 'validation' && currentConfig && renderValidation()}
            {activeTab === 'preview' && currentConfig && renderPreview()}

            {!currentConfig && activeTab !== 'class-selection' &&
          <div className="p-12 text-center">
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">Please select classes first</p>
                <p className="text-sm text-gray-500 mt-2">Go to Class Selection tab to choose classes</p>
                <Button variant="primary" className="mt-4" onClick={() => setActiveTab('class-selection')}>
                  Go to Class Selection
                </Button>
              </div>
          }
          </Card>
        }
      </div>

      <ExamSelectionModal />
      <TermModal />
    </div>);

}

export default AssessmentPatternSetup;