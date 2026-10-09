import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  Building,
  Calendar,
  Users,
  Hash,
  Percent,
  Award,
  Calculator,
  Layers,
  LayoutGrid,
  ClipboardList,
  BookOpen,
  Info,
  Lock,
  Unlock,
  History,
  Printer,
  Check,
  Star,
  Trophy,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Sliders,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  GripVertical,
  Move,
  Copy,
  RefreshCw,
  Download,
  Upload,
  Send,
  Archive,
  Wand2,
  Sparkles,
  Scale,
  ListOrdered,
  Crown,
  CircleDot,
  RotateCcw,
  Image,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Grid,
  List,
  Table,
  FileCheck,
  PenTool,
  MessageSquare,
  User,
  Signature,
  Stamp,
  School,
  Badge as BadgeIcon,
  Columns,
  Rows,
  LayoutTemplate,
  Palette,
  EyeOff,
  Monitor,
  Smartphone,
  ArrowRight,
  ArrowDown,
  Link2,
  Unlink,
  Database,
  Zap,
  Play,
  Pause } from
'lucide-react';

// ============================================
// Types
// ============================================

interface Exam {
  id: string;
  name: string;
  code: string;
  type: 'unit_test' | 'term' | 'practical' | 'internal' | 'annual';
  maxMarks: number;
  isActive: boolean;
}

interface ExamInSemester {
  examId: string;
  exam: Exam;
  displayName: string;
  weightage: number;
  order: number;
  showInReport: boolean;
}

interface SemesterConfig {
  id: string;
  name: string;
  displayName: string;
  exams: ExamInSemester[];
  weightageInFinal: number;
  isActive: boolean;
}

interface SubjectConfig {
  id: string;
  name: string;
  code: string;
  type: 'core' | 'elective' | 'language' | 'activity';
  totalYearlyMarks: number;
  conversionTo: number;
  passMarks: number;
  gradeRuleId: string;
  showPractical: boolean;
  showInternal: boolean;
  practicalMaxMarks: number;
  internalMaxMarks: number;
}

interface DisplayOptions {
  showPercentage: boolean;
  showGrade: boolean;
  showConvertedMarks: boolean;
  showRemarks: boolean;
  showTeacherComments: boolean;
  showPrincipalSignature: boolean;
  showClassTeacherSignature: boolean;
  showParentSignature: boolean;
  showAttendance: boolean;
  showRank: boolean;
  showCGPA: boolean;
  showSubjectWiseGrade: boolean;
  showFormativeAssessment: boolean;
  showSummativeAssessment: boolean;
  printOrientation: 'portrait' | 'landscape';
  showSchoolLogo: boolean;
  showWatermark: boolean;
  headerContent: string;
  footerContent: string;
}

interface ReportCardConfig {
  id: string;
  academicYear: string;
  board: string;
  standard: string;
  section: string;
  reportType: 'semester' | 'final';
  semesters: SemesterConfig[];
  subjects: SubjectConfig[];
  conversionMode: 'actual' | 'convert_100' | 'custom';
  customConversionTotal: number;
  displayOptions: DisplayOptions;
  gradeScaleId: string;
  roundingRule: 'round_off' | 'round_up' | 'round_down' | 'decimal_1' | 'decimal_2';
  status: 'draft' | 'active' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
  modifiedBy: string;
  changeNotes: string;
}

interface VersionHistory {
  version: number;
  modifiedBy: string;
  modifiedAt: string;
  changeNotes: string;
  status: string;
}

// ============================================
// Constants
// ============================================

const academicYears = ['2023-24', '2024-25', '2025-26'];
const boards = ['CBSE', 'GSEB', 'ICSE', 'State Board', 'Internal'];
const standards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sections = ['A', 'B', 'C', 'D'];

// Mock Exams Data
const availableExams: Exam[] = [
{ id: 'ut1', name: 'Unit Test 1', code: 'UT1', type: 'unit_test', maxMarks: 50, isActive: true },
{ id: 'ut2', name: 'Unit Test 2', code: 'UT2', type: 'unit_test', maxMarks: 50, isActive: true },
{ id: 'ut3', name: 'Unit Test 3', code: 'UT3', type: 'unit_test', maxMarks: 50, isActive: true },
{ id: 'ut4', name: 'Unit Test 4', code: 'UT4', type: 'unit_test', maxMarks: 50, isActive: true },
{ id: 'mid1', name: 'Mid Term Examination', code: 'MID1', type: 'term', maxMarks: 100, isActive: true },
{ id: 'mid2', name: 'Half Yearly Examination', code: 'HY', type: 'term', maxMarks: 100, isActive: true },
{ id: 'final', name: 'Final Examination', code: 'FINAL', type: 'annual', maxMarks: 100, isActive: true },
{ id: 'pract1', name: 'Practical 1', code: 'PR1', type: 'practical', maxMarks: 50, isActive: true },
{ id: 'pract2', name: 'Practical 2', code: 'PR2', type: 'practical', maxMarks: 50, isActive: true },
{ id: 'int1', name: 'Internal Assessment 1', code: 'IA1', type: 'internal', maxMarks: 20, isActive: true },
{ id: 'int2', name: 'Internal Assessment 2', code: 'IA2', type: 'internal', maxMarks: 20, isActive: true },
{ id: 'proj', name: 'Project Work', code: 'PROJ', type: 'internal', maxMarks: 20, isActive: true }];


// Mock Subjects Data
const availableSubjects: SubjectConfig[] = [
{ id: 'math', name: 'Mathematics', code: 'MATH', type: 'core', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: false, showInternal: true, practicalMaxMarks: 0, internalMaxMarks: 20 },
{ id: 'sci', name: 'Science', code: 'SCI', type: 'core', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: true, showInternal: true, practicalMaxMarks: 30, internalMaxMarks: 20 },
{ id: 'eng', name: 'English', code: 'ENG', type: 'language', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: false, showInternal: true, practicalMaxMarks: 0, internalMaxMarks: 20 },
{ id: 'hin', name: 'Hindi', code: 'HIN', type: 'language', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: false, showInternal: true, practicalMaxMarks: 0, internalMaxMarks: 20 },
{ id: 'sst', name: 'Social Science', code: 'SST', type: 'core', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: false, showInternal: true, practicalMaxMarks: 0, internalMaxMarks: 20 },
{ id: 'cs', name: 'Computer Science', code: 'CS', type: 'elective', totalYearlyMarks: 200, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: true, showInternal: false, practicalMaxMarks: 30, internalMaxMarks: 0 },
{ id: 'pe', name: 'Physical Education', code: 'PE', type: 'activity', totalYearlyMarks: 100, conversionTo: 100, passMarks: 33, gradeRuleId: 'cbse', showPractical: true, showInternal: false, practicalMaxMarks: 70, internalMaxMarks: 0 }];


// Grade Scales
const gradeScales = [
{ id: 'cbse', name: 'CBSE 9-Point Scale' },
{ id: 'gseb', name: 'GSEB Standard Scale' },
{ id: 'icse', name: 'ICSE Grade Scale' },
{ id: 'primary', name: 'Primary Grade Scale' }];


// ============================================
// Helper Components
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
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
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
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange';
  className?: string;
  size?: 'sm' | 'md';
}> = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700'
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
  const sizeStyles = {
    sm: { container: 'h-5 w-9', dot: 'h-3 w-3', translate: 'translate-x-5' },
    md: { container: 'h-6 w-11', dot: 'h-4 w-4', translate: 'translate-x-6' }
  };

  const styles = sizeStyles[size];

  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex ${styles.container} items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
      checked ? 'bg-blue-600' : 'bg-gray-300'}`}>

      <span
        className={`inline-block ${styles.dot} transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
        checked ? styles.translate : 'translate-x-1'}`
        } />

    </button>);

};

const ProgressBar: React.FC<{
  value: number;
  max: number;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}> = ({ value, max, showLabel = true, color = 'blue' }) => {
  const percentage = max > 0 ? Math.min(value / max * 100, 100) : 0;
  const isExceeded = value > max;
  const isComplete = value === max;

  const colorStyles = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const barColor = isExceeded ? 'bg-red-500' : isComplete ? 'bg-green-500' : colorStyles[color];

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }} />

      </div>
      {showLabel &&
      <div className={`text-xs mt-1 text-right font-medium ${
      isExceeded ? 'text-red-600' : isComplete ? 'text-green-600' : 'text-gray-500'}`
      }>
          {value}% / {max}%
        </div>
      }
    </div>);

};

// ============================================
// Main Component
// ============================================

export function FinalReportCardSetup() {
  // Basic Selection States
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [board, setBoard] = useState('');
  const [standard, setStandard] = useState('');
  const [section, setSection] = useState('');
  const [reportType, setReportType] = useState<'semester' | 'final'>('final');

  // Configuration States
  const [semesters, setSemesters] = useState<SemesterConfig[]>([
  {
    id: 'sem1',
    name: 'Semester 1',
    displayName: 'First Semester',
    exams: [],
    weightageInFinal: 40,
    isActive: true
  },
  {
    id: 'sem2',
    name: 'Semester 2',
    displayName: 'Second Semester',
    exams: [],
    weightageInFinal: 60,
    isActive: true
  }]
  );

  const [subjects, setSubjects] = useState<SubjectConfig[]>(availableSubjects);
  const [conversionMode, setConversionMode] = useState<'actual' | 'convert_100' | 'custom'>('convert_100');
  const [customConversionTotal, setCustomConversionTotal] = useState(100);
  const [gradeScaleId, setGradeScaleId] = useState('cbse');
  const [roundingRule, setRoundingRule] = useState<'round_off' | 'round_up' | 'round_down' | 'decimal_1' | 'decimal_2'>('round_off');

  // Display Options
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showPercentage: true,
    showGrade: true,
    showConvertedMarks: true,
    showRemarks: true,
    showTeacherComments: true,
    showPrincipalSignature: true,
    showClassTeacherSignature: true,
    showParentSignature: true,
    showAttendance: true,
    showRank: true,
    showCGPA: true,
    showSubjectWiseGrade: true,
    showFormativeAssessment: true,
    showSummativeAssessment: true,
    printOrientation: 'portrait',
    showSchoolLogo: true,
    showWatermark: false,
    headerContent: 'Progress Report Card',
    footerContent: 'This is a computer generated report card'
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'semesters' | 'subjects' | 'display' | 'preview'>('semesters');
  const [expandedSemester, setExpandedSemester] = useState<string | null>('sem1');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [configStatus, setConfigStatus] = useState<'draft' | 'active' | 'archived'>('draft');
  const [currentVersion, setCurrentVersion] = useState(1);
  const [changeNotes, setChangeNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedExamForAdd, setSelectedExamForAdd] = useState<string>('');

  // Version History
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([
  {
    version: 1,
    modifiedBy: 'Admin User',
    modifiedAt: '2024-02-15 10:30 AM',
    changeNotes: 'Initial setup',
    status: 'draft'
  }]
  );

  // Computed Values
  const totalSemesterWeightage = useMemo(() => {
    return semesters.filter((s) => s.isActive).reduce((sum, s) => sum + s.weightageInFinal, 0);
  }, [semesters]);

  const isWeightageValid = totalSemesterWeightage === 100;

  const getSemesterExamWeightage = (semesterId: string) => {
    const semester = semesters.find((s) => s.id === semesterId);
    if (!semester) return 0;
    return semester.exams.reduce((sum, e) => sum + e.weightage, 0);
  };

  // Handlers
  const handleAddExamToSemester = (semesterId: string, examId: string) => {
    const exam = availableExams.find((e) => e.id === examId);
    if (!exam) return;

    setSemesters((prev) => prev.map((sem) => {
      if (sem.id === semesterId) {
        // Check if exam already exists
        if (sem.exams.find((e) => e.examId === examId)) return sem;

        return {
          ...sem,
          exams: [...sem.exams, {
            examId: exam.id,
            exam: exam,
            displayName: exam.name,
            weightage: 0,
            order: sem.exams.length + 1,
            showInReport: true
          }]
        };
      }
      return sem;
    }));
    setSelectedExamForAdd('');
  };

  const handleRemoveExamFromSemester = (semesterId: string, examId: string) => {
    setSemesters((prev) => prev.map((sem) => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          exams: sem.exams.filter((e) => e.examId !== examId)
        };
      }
      return sem;
    }));
  };

  const handleUpdateExamWeightage = (semesterId: string, examId: string, weightage: number) => {
    setSemesters((prev) => prev.map((sem) => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          exams: sem.exams.map((e) =>
          e.examId === examId ? { ...e, weightage } : e
          )
        };
      }
      return sem;
    }));
  };

  const handleUpdateExamDisplayName = (semesterId: string, examId: string, displayName: string) => {
    setSemesters((prev) => prev.map((sem) => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          exams: sem.exams.map((e) =>
          e.examId === examId ? { ...e, displayName } : e
          )
        };
      }
      return sem;
    }));
  };

  const handleUpdateSemesterWeightage = (semesterId: string, weightage: number) => {
    setSemesters((prev) => prev.map((sem) =>
    sem.id === semesterId ? { ...sem, weightageInFinal: weightage } : sem
    ));
  };

  const handleUpdateSubject = (subjectId: string, field: keyof SubjectConfig, value: any) => {
    setSubjects((prev) => prev.map((sub) =>
    sub.id === subjectId ? { ...sub, [field]: value } : sub
    ));
  };

  const handleUpdateDisplayOption = (field: keyof DisplayOptions, value: any) => {
    setDisplayOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSemester = () => {
    const newId = `sem${semesters.length + 1}`;
    setSemesters((prev) => [...prev, {
      id: newId,
      name: `Semester ${semesters.length + 1}`,
      displayName: `Semester ${semesters.length + 1}`,
      exams: [],
      weightageInFinal: 0,
      isActive: true
    }]);
  };

  const handleRemoveSemester = (semesterId: string) => {
    if (semesters.length <= 1) {
      alert('At least one semester is required');
      return;
    }
    setSemesters((prev) => prev.filter((s) => s.id !== semesterId));
  };

  const handleMoveExam = (semesterId: string, examId: string, direction: 'up' | 'down') => {
    setSemesters((prev) => prev.map((sem) => {
      if (sem.id === semesterId) {
        const examIndex = sem.exams.findIndex((e) => e.examId === examId);
        if (examIndex === -1) return sem;

        const newIndex = direction === 'up' ? examIndex - 1 : examIndex + 1;
        if (newIndex < 0 || newIndex >= sem.exams.length) return sem;

        const newExams = [...sem.exams];
        [newExams[examIndex], newExams[newIndex]] = [newExams[newIndex], newExams[examIndex]];

        return { ...sem, exams: newExams.map((e, idx) => ({ ...e, order: idx + 1 })) };
      }
      return sem;
    }));
  };

  // Validation
  const validateConfiguration = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate semester weightage
    if (totalSemesterWeightage !== 100) {
      newErrors.semesterWeightage = `Total semester weightage must equal 100% (currently ${totalSemesterWeightage}%)`;
    }

    // Validate exam weightage for each semester
    semesters.forEach((sem) => {
      if (sem.isActive && sem.exams.length > 0) {
        const examWeightage = getSemesterExamWeightage(sem.id);
        if (examWeightage !== 100) {
          newErrors[`semester_${sem.id}`] = `${sem.name} exam weightage must equal 100% (currently ${examWeightage}%)`;
        }
      }
    });

    // Validate grade scale
    if (!gradeScaleId) {
      newErrors.gradeScale = 'Please select a grade scale';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAsDraft = () => {
    setConfigStatus('draft');
    setCurrentVersion((prev) => prev + 1);
    setVersionHistory((prev) => [...prev, {
      version: currentVersion + 1,
      modifiedBy: 'Current User',
      modifiedAt: new Date().toLocaleString(),
      changeNotes: changeNotes || 'Saved as draft',
      status: 'draft'
    }]);
    setChangeNotes('');
    alert('Configuration saved as draft!');
  };

  const handleActivate = () => {
    if (!validateConfiguration()) {
      alert('Please fix validation errors before activating');
      return;
    }

    setConfigStatus('active');
    setCurrentVersion((prev) => prev + 1);
    setVersionHistory((prev) => [...prev, {
      version: currentVersion + 1,
      modifiedBy: 'Current User',
      modifiedAt: new Date().toLocaleString(),
      changeNotes: changeNotes || 'Configuration activated',
      status: 'active'
    }]);
    setChangeNotes('');
    alert('Report card configuration activated successfully!');
  };

  const handleArchive = () => {
    setConfigStatus('archived');
  };

  const getExamTypeBadge = (type: string) => {
    const config: Record<string, {variant: 'info' | 'purple' | 'green' | 'orange' | 'yellow';label: string;}> = {
      unit_test: { variant: 'info', label: 'Unit Test' },
      term: { variant: 'purple', label: 'Term Exam' },
      practical: { variant: 'green', label: 'Practical' },
      internal: { variant: 'orange', label: 'Internal' },
      annual: { variant: 'yellow', label: 'Annual' }
    };
    const { variant, label } = config[type] || config.unit_test;
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  const getSubjectTypeBadge = (type: string) => {
    const config: Record<string, {variant: 'info' | 'purple' | 'green' | 'orange';label: string;}> = {
      core: { variant: 'info', label: 'Core' },
      elective: { variant: 'purple', label: 'Elective' },
      language: { variant: 'green', label: 'Language' },
      activity: { variant: 'orange', label: 'Activity' }
    };
    const { variant, label } = config[type] || config.core;
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  // Sample Preview Data
  const sampleStudentData = {
    name: 'Aarav Sharma',
    rollNo: '01',
    grNo: 'GR2024001',
    class: `${standard}-${section || 'A'}`,
    dob: '15-Mar-2010',
    attendance: { present: 180, total: 200, percentage: 90 },
    subjects: subjects.map((sub) => ({
      ...sub,
      semester1: Math.floor(Math.random() * 40) + 60,
      semester2: Math.floor(Math.random() * 40) + 60,
      internal: sub.showInternal ? Math.floor(Math.random() * 15) + 5 : 0,
      practical: sub.showPractical ? Math.floor(Math.random() * 20) + 10 : 0,
      total: 0,
      percentage: 0,
      grade: 'A2'
    })).map((sub) => ({
      ...sub,
      total: sub.semester1 + sub.semester2 + sub.internal + sub.practical,
      percentage: (sub.semester1 + sub.semester2 + sub.internal + sub.practical) / sub.totalYearlyMarks * 100
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Final Report Card Setup</h1>
              <p className="text-sm text-gray-500">Design semester & consolidated report card structure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {configStatus === 'active' &&
            <Badge variant="success" className="px-3 py-1.5">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </Badge>
            }
            {configStatus === 'draft' &&
            <Badge variant="warning" className="px-3 py-1.5">
                <Edit className="w-4 h-4 mr-1" />
                Draft
              </Badge>
            }
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Errors Display */}
      {Object.keys(errors).length > 0 &&
      <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900">Validation Errors</h4>
              <ul className="mt-2 space-y-1">
                {Object.values(errors).map((error, idx) =>
              <li key={idx} className="text-sm text-red-700">• {error}</li>
              )}
              </ul>
            </div>
          </div>
        </Card>
      }

      {/* Basic Selection */}
      <Card className="mb-6 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Basic Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Academic Year *
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                {academicYears.map((year) =>
                <option key={year} value={year}>{year}</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                Board *
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                <option value="">Select Board</option>
                {boards.map((b) =>
                <option key={b} value={b}>{b}</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                Class *
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                <option value="">Select Class</option>
                {standards.map((s) =>
                <option key={s} value={s}>Class {s}</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                <option value="">All Sections</option>
                {sections.map((s) =>
                <option key={s} value={s}>Section {s}</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Report Type *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'semester' | 'final')}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                <option value="semester">Semester Report Card</option>
                <option value="final">Final Consolidated Report Card</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6 flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 overflow-x-auto">
        {[
        { id: 'semesters', label: 'Semester Structure', icon: Layers },
        { id: 'subjects', label: 'Subject Configuration', icon: BookOpen },
        { id: 'display', label: 'Display Options', icon: LayoutTemplate },
        { id: 'preview', label: 'Preview', icon: Eye }].
        map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ?
              'bg-indigo-600 text-white' :
              'text-gray-600 hover:bg-gray-100'}`
              }>

              <Icon className="w-4 h-4" />
              {tab.label}
            </button>);

        })}
      </div>

      {/* Semester Structure Tab */}
      {activeTab === 'semesters' &&
      <div className="space-y-6">
          {/* Semester Weightage Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Semester/Term Weightage in Final Result
              </h3>
              <Button variant="outline" size="sm" onClick={handleAddSemester}>
                <Plus className="w-4 h-4 mr-2" />
                Add Semester
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {semesters.map((sem) =>
            <div key={sem.id} className={`p-4 rounded-xl border-2 ${
            sem.isActive ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50 opacity-60'}`
            }>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{sem.name}</h4>
                    <ToggleSwitch
                  checked={sem.isActive}
                  onChange={(val) => setSemesters((prev) => prev.map((s) => s.id === sem.id ? { ...s, isActive: val } : s))}
                  size="sm" />

                  </div>
                  <div className="flex items-center gap-2">
                    <input
                  type="number"
                  value={sem.weightageInFinal}
                  onChange={(e) => handleUpdateSemesterWeightage(sem.id, parseInt(e.target.value) || 0)}
                  disabled={!sem.isActive}
                  className="w-20 rounded-lg border border-gray-300 p-2 text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none" />

                    <span className="text-gray-500 font-medium">%</span>
                  </div>
                </div>
            )}
            </div>

            {/* Weightage Validation */}
            <div className={`p-4 rounded-lg flex items-center justify-between ${
          isWeightageValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`
          }>
              <div className="flex items-center gap-2">
                {isWeightageValid ?
              <CheckCircle className="w-5 h-5 text-green-600" /> :

              <AlertCircle className="w-5 h-5 text-red-600" />
              }
                <span className={`font-medium ${isWeightageValid ? 'text-green-700' : 'text-red-700'}`}>
                  Total Weightage: {totalSemesterWeightage}%
                </span>
              </div>
              {!isWeightageValid &&
            <span className="text-sm text-red-600">Must equal 100%</span>
            }
            </div>
          </Card>

          {/* Individual Semester Configuration */}
          {semesters.filter((s) => s.isActive).map((semester) =>
        <Card key={semester.id} className="overflow-hidden">
              <div
            className={`p-4 cursor-pointer ${
            expandedSemester === semester.id ? 'bg-indigo-600 text-white' : 'bg-gray-50'}`
            }
            onClick={() => setExpandedSemester(expandedSemester === semester.id ? null : semester.id)}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedSemester === semester.id ?
                <ChevronDown className="w-5 h-5" /> :

                <ChevronRight className="w-5 h-5" />
                }
                    <h3 className="font-bold text-lg">{semester.displayName}</h3>
                    <Badge variant={expandedSemester === semester.id ? 'default' : 'info'} className={expandedSemester === semester.id ? 'bg-white/20 text-white' : ''}>
                      {semester.exams.length} exams
                    </Badge>
                    <Badge variant={expandedSemester === semester.id ? 'default' : 'purple'} className={expandedSemester === semester.id ? 'bg-white/20 text-white' : ''}>
                      {semester.weightageInFinal}% weightage
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {semester.exams.length > 0 &&
                <span className={`text-sm ${expandedSemester === semester.id ? 'text-white/80' : 'text-gray-500'}`}>
                        Exam Weightage: {getSemesterExamWeightage(semester.id)}%
                      </span>
                }
                  </div>
                </div>
              </div>

              {expandedSemester === semester.id &&
          <div className="p-6">
                  {/* Add Exam Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Add Exam to {semester.name}</h4>
                    <div className="flex items-center gap-3">
                      <select
                  value={selectedExamForAdd}
                  onChange={(e) => setSelectedExamForAdd(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                        <option value="">Select an exam to add...</option>
                        {availableExams.
                  filter((e) => !semester.exams.find((se) => se.examId === e.id)).
                  map((exam) =>
                  <option key={exam.id} value={exam.id}>
                              {exam.name} ({exam.maxMarks} marks) - {exam.type}
                            </option>
                  )}
                      </select>
                      <Button
                  variant="primary"
                  onClick={() => handleAddExamToSemester(semester.id, selectedExamForAdd)}
                  disabled={!selectedExamForAdd}>

                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Exam List */}
                  {semester.exams.length === 0 ?
            <div className="text-center py-8 text-gray-500">
                      <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No exams added yet</p>
                      <p className="text-sm">Select exams from the dropdown above</p>
                    </div> :

            <div className="space-y-3">
                      {semester.exams.map((examConfig, index) =>
              <div key={examConfig.examId} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
                          {/* Order Controls */}
                          <div className="flex flex-col gap-1">
                            <button
                    onClick={() => handleMoveExam(semester.id, examConfig.examId, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>

                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                    onClick={() => handleMoveExam(semester.id, examConfig.examId, 'down')}
                    disabled={index === semester.exams.length - 1}
                    className={`p-1 rounded ${index === semester.exams.length - 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>

                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Order Number */}
                          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            {index + 1}
                          </span>

                          {/* Exam Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{examConfig.exam.name}</span>
                              {getExamTypeBadge(examConfig.exam.type)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Max: {examConfig.exam.maxMarks} marks</span>
                              <span>Code: {examConfig.exam.code}</span>
                            </div>
                          </div>

                          {/* Display Name */}
                          <div className="w-48">
                            <label className="text-xs text-gray-500 block mb-1">Display Name</label>
                            <input
                    type="text"
                    value={examConfig.displayName}
                    onChange={(e) => handleUpdateExamDisplayName(semester.id, examConfig.examId, e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />

                          </div>

                          {/* Weightage */}
                          <div className="w-24">
                            <label className="text-xs text-gray-500 block mb-1">Weightage %</label>
                            <input
                    type="number"
                    value={examConfig.weightage}
                    onChange={(e) => handleUpdateExamWeightage(semester.id, examConfig.examId, parseInt(e.target.value) || 0)}
                    className="w-full rounded border border-gray-300 p-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />

                          </div>

                          {/* Show in Report Toggle */}
                          <div className="flex items-center gap-2">
                            <ToggleSwitch
                    checked={examConfig.showInReport}
                    onChange={(val) => {
                      setSemesters((prev) => prev.map((sem) => {
                        if (sem.id === semester.id) {
                          return {
                            ...sem,
                            exams: sem.exams.map((e) => e.examId === examConfig.examId ? { ...e, showInReport: val } : e)
                          };
                        }
                        return sem;
                      }));
                    }}
                    size="sm" />

                            <span className="text-xs text-gray-500">Show</span>
                          </div>

                          {/* Remove Button */}
                          <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveExamFromSemester(semester.id, examConfig.examId)}>

                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
              )}

                      {/* Exam Weightage Total */}
                      <div className={`p-4 rounded-lg flex items-center justify-between ${
              getSemesterExamWeightage(semester.id) === 100 ?
              'bg-green-50 border border-green-200' :
              'bg-yellow-50 border border-yellow-200'}`
              }>
                        <span className={`font-medium ${
                getSemesterExamWeightage(semester.id) === 100 ? 'text-green-700' : 'text-yellow-700'}`
                }>
                          Total Exam Weightage: {getSemesterExamWeightage(semester.id)}%
                        </span>
                        {getSemesterExamWeightage(semester.id) !== 100 &&
                <span className="text-sm text-yellow-600">
                            {100 - getSemesterExamWeightage(semester.id)}% remaining
                          </span>
                }
                      </div>
                    </div>
            }
                </div>
          }
            </Card>
        )}

          {/* Conversion Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Consolidated Marks Conversion
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
            { id: 'actual', label: 'Show Actual Total', description: 'Display marks as obtained (e.g., 180/200)', icon: Hash },
            { id: 'convert_100', label: 'Convert to 100', description: 'Convert total marks to 100 scale', icon: Percent },
            { id: 'custom', label: 'Custom Conversion', description: 'Define custom conversion total', icon: Sliders }].
            map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  onClick={() => setConversionMode(mode.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  conversionMode === mode.id ?
                  'border-indigo-500 bg-indigo-50' :
                  'border-gray-200 hover:border-indigo-300'}`
                  }>

                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-6 h-6 ${conversionMode === mode.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                      {conversionMode === mode.id && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900">{mode.label}</h4>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                  </div>);

            })}
            </div>

            {conversionMode === 'custom' &&
          <div className="p-4 bg-gray-50 rounded-xl">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Custom Conversion Total</label>
                <div className="flex items-center gap-3">
                  <input
                type="number"
                value={customConversionTotal}
                onChange={(e) => setCustomConversionTotal(parseInt(e.target.value) || 100)}
                className="w-32 rounded-lg border border-gray-300 p-2.5 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />

                  <span className="text-gray-500">marks</span>
                </div>
              </div>
          }

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Grade Scale</label>
                <select
                value={gradeScaleId}
                onChange={(e) => setGradeScaleId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                  <option value="">Select Grade Scale</option>
                  {gradeScales.map((scale) =>
                <option key={scale.id} value={scale.id}>{scale.name}</option>
                )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Rounding Rule</label>
                <select
                value={roundingRule}
                onChange={(e) => setRoundingRule(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">

                  <option value="round_off">Round Off (Standard)</option>
                  <option value="round_up">Round Up</option>
                  <option value="round_down">Round Down</option>
                  <option value="decimal_1">1 Decimal Place</option>
                  <option value="decimal_2">2 Decimal Places</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Subjects Tab */}
      {activeTab === 'subjects' &&
      <Card className="overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Subject-Wise Consolidated Structure
            </h3>
            <p className="text-sm text-gray-500 mt-1">Configure marks structure for each subject</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Total Yearly Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Convert To</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Pass Marks</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Show Practical</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Practical Max</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Show Internal</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Internal Max</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Grade Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((subject) =>
              <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{subject.name}</p>
                        <p className="text-xs text-gray-500">{subject.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getSubjectTypeBadge(subject.type)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                    type="number"
                    value={subject.totalYearlyMarks}
                    onChange={(e) => handleUpdateSubject(subject.id, 'totalYearlyMarks', parseInt(e.target.value) || 0)}
                    className="w-20 mx-auto block rounded border border-gray-300 p-1.5 text-center focus:ring-2 focus:ring-indigo-500 outline-none" />

                    </td>
                    <td className="px-4 py-3">
                      <input
                    type="number"
                    value={subject.conversionTo}
                    onChange={(e) => handleUpdateSubject(subject.id, 'conversionTo', parseInt(e.target.value) || 0)}
                    className="w-20 mx-auto block rounded border border-gray-300 p-1.5 text-center focus:ring-2 focus:ring-indigo-500 outline-none" />

                    </td>
                    <td className="px-4 py-3">
                      <input
                    type="number"
                    value={subject.passMarks}
                    onChange={(e) => handleUpdateSubject(subject.id, 'passMarks', parseInt(e.target.value) || 0)}
                    className="w-16 mx-auto block rounded border border-gray-300 p-1.5 text-center focus:ring-2 focus:ring-indigo-500 outline-none" />

                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch
                    checked={subject.showPractical}
                    onChange={(val) => handleUpdateSubject(subject.id, 'showPractical', val)}
                    size="sm" />

                    </td>
                    <td className="px-4 py-3">
                      <input
                    type="number"
                    value={subject.practicalMaxMarks}
                    onChange={(e) => handleUpdateSubject(subject.id, 'practicalMaxMarks', parseInt(e.target.value) || 0)}
                    disabled={!subject.showPractical}
                    className={`w-16 mx-auto block rounded border border-gray-300 p-1.5 text-center focus:ring-2 focus:ring-indigo-500 outline-none ${!subject.showPractical ? 'bg-gray-100' : ''}`} />

                    </td>
                    <td className="px-4 py-3 text-center">
                      <ToggleSwitch
                    checked={subject.showInternal}
                    onChange={(val) => handleUpdateSubject(subject.id, 'showInternal', val)}
                    size="sm" />

                    </td>
                    <td className="px-4 py-3">
                      <input
                    type="number"
                    value={subject.internalMaxMarks}
                    onChange={(e) => handleUpdateSubject(subject.id, 'internalMaxMarks', parseInt(e.target.value) || 0)}
                    disabled={!subject.showInternal}
                    className={`w-16 mx-auto block rounded border border-gray-300 p-1.5 text-center focus:ring-2 focus:ring-indigo-500 outline-none ${!subject.showInternal ? 'bg-gray-100' : ''}`} />

                    </td>
                    <td className="px-4 py-3">
                      <select
                    value={subject.gradeRuleId}
                    onChange={(e) => handleUpdateSubject(subject.id, 'gradeRuleId', e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">

                        {gradeScales.map((scale) =>
                    <option key={scale.id} value={scale.id}>{scale.name}</option>
                    )}
                      </select>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Display Options Tab */}
      {activeTab === 'display' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Show/Hide Options */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              Show/Hide Elements
            </h3>
            <div className="space-y-4">
              {[
            { key: 'showPercentage', label: 'Show Percentage', icon: Percent },
            { key: 'showGrade', label: 'Show Grade', icon: Award },
            { key: 'showConvertedMarks', label: 'Show Converted Marks', icon: Calculator },
            { key: 'showSubjectWiseGrade', label: 'Subject-wise Grade', icon: BookOpen },
            { key: 'showCGPA', label: 'Show CGPA', icon: Star },
            { key: 'showRank', label: 'Show Rank', icon: Trophy },
            { key: 'showAttendance', label: 'Show Attendance', icon: Calendar },
            { key: 'showFormativeAssessment', label: 'Formative Assessment', icon: ClipboardList },
            { key: 'showSummativeAssessment', label: 'Summative Assessment', icon: FileCheck },
            { key: 'showRemarks', label: 'Show Remarks Section', icon: MessageSquare }].
            map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <ToggleSwitch
                    checked={(displayOptions as any)[item.key]}
                    onChange={(val) => handleUpdateDisplayOption(item.key as keyof DisplayOptions, val)} />

                  </div>);

            })}
            </div>
          </Card>

          {/* Signatures & Comments */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-indigo-600" />
              Signatures & Comments
            </h3>
            <div className="space-y-4">
              {[
            { key: 'showTeacherComments', label: 'Teacher Comments', icon: MessageSquare },
            { key: 'showClassTeacherSignature', label: 'Class Teacher Signature', icon: PenTool },
            { key: 'showPrincipalSignature', label: 'Principal Signature', icon: Stamp },
            { key: 'showParentSignature', label: 'Parent Signature', icon: User }].
            map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <ToggleSwitch
                    checked={(displayOptions as any)[item.key]}
                    onChange={(val) => handleUpdateDisplayOption(item.key as keyof DisplayOptions, val)} />

                  </div>);

            })}
            </div>
          </Card>

          {/* Print Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              Print Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Show School Logo</span>
                </div>
                <ToggleSwitch
                checked={displayOptions.showSchoolLogo}
                onChange={(val) => handleUpdateDisplayOption('showSchoolLogo', val)} />

              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Show Watermark</span>
                </div>
                <ToggleSwitch
                checked={displayOptions.showWatermark}
                onChange={(val) => handleUpdateDisplayOption('showWatermark', val)} />

              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Print Orientation</label>
                <div className="flex gap-3">
                  {['portrait', 'landscape'].map((orientation) =>
                <button
                  key={orientation}
                  onClick={() => handleUpdateDisplayOption('printOrientation', orientation)}
                  className={`flex-1 p-3 rounded-lg border-2 capitalize font-medium transition-all ${
                  displayOptions.printOrientation === orientation ?
                  'border-indigo-500 bg-indigo-50 text-indigo-700' :
                  'border-gray-200 text-gray-600 hover:border-indigo-300'}`
                  }>

                      {orientation === 'portrait' ? <Smartphone className="w-5 h-5 mx-auto mb-1" /> : <Monitor className="w-5 h-5 mx-auto mb-1" />}
                      {orientation}
                    </button>
                )}
                </div>
              </div>
            </div>
          </Card>

          {/* Header & Footer */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-indigo-600" />
              Header & Footer Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Header Content</label>
                <input
                type="text"
                value={displayOptions.headerContent}
                onChange={(e) => handleUpdateDisplayOption('headerContent', e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., Progress Report Card" />

              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Footer Content</label>
                <input
                type="text"
                value={displayOptions.footerContent}
                onChange={(e) => handleUpdateDisplayOption('footerContent', e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., This is a computer generated report" />

              </div>
            </div>
          </Card>
        </div>
      }

      {/* Preview Tab */}
      {activeTab === 'preview' &&
      <Card className="overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Report Card Preview
            </h3>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white">Sample Student Data</Badge>
              <Button variant="outline" size="sm" className="bg-white text-indigo-600 border-white">
                <Printer className="w-4 h-4 mr-2" />
                Print Preview
              </Button>
            </div>
          </div>

          <div className="p-8 bg-gray-100">
            {/* Report Card Preview */}
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center">
                {displayOptions.showSchoolLogo &&
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <School className="w-12 h-12 text-blue-700" />
                  </div>
              }
                <h1 className="text-2xl font-bold">ABC School</h1>
                <p className="text-blue-200">Excellence in Education</p>
                <h2 className="text-xl font-semibold mt-4">{displayOptions.headerContent}</h2>
                <p className="text-sm text-blue-200">Academic Year: {academicYear}</p>
              </div>

              {/* Student Details */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Student Name</p>
                    <p className="font-semibold text-gray-900">{sampleStudentData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Roll No.</p>
                    <p className="font-semibold text-gray-900">{sampleStudentData.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">GR No.</p>
                    <p className="font-semibold text-gray-900">{sampleStudentData.grNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Class</p>
                    <p className="font-semibold text-gray-900">{sampleStudentData.class}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{sampleStudentData.dob}</p>
                  </div>
                  {displayOptions.showAttendance &&
                <>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Working Days</p>
                        <p className="font-semibold text-gray-900">{sampleStudentData.attendance.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Present Days</p>
                        <p className="font-semibold text-gray-900">{sampleStudentData.attendance.present}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Attendance %</p>
                        <p className="font-semibold text-gray-900">{sampleStudentData.attendance.percentage}%</p>
                      </div>
                    </>
                }
                </div>
              </div>

              {/* Marks Table */}
              <div className="p-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-600">Subject</th>
                      {semesters.filter((s) => s.isActive).map((sem) =>
                    <th key={sem.id} className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                          {sem.displayName}
                        </th>
                    )}
                      {displayOptions.showFormativeAssessment &&
                    <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">Internal</th>
                    }
                      {displayOptions.showSummativeAssessment && subjects.some((s) => s.showPractical) &&
                    <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">Practical</th>
                    }
                      <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">Total</th>
                      {displayOptions.showPercentage &&
                    <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">%</th>
                    }
                      {displayOptions.showSubjectWiseGrade &&
                    <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-600">Grade</th>
                    }
                    </tr>
                  </thead>
                  <tbody>
                    {sampleStudentData.subjects.map((sub) =>
                  <tr key={sub.id}>
                        <td className="border border-gray-300 px-3 py-2 font-medium">{sub.name}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{sub.semester1}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{sub.semester2}</td>
                        {displayOptions.showFormativeAssessment &&
                    <td className="border border-gray-300 px-3 py-2 text-center">{sub.internal || '-'}</td>
                    }
                        {displayOptions.showSummativeAssessment && subjects.some((s) => s.showPractical) &&
                    <td className="border border-gray-300 px-3 py-2 text-center">{sub.practical || '-'}</td>
                    }
                        <td className="border border-gray-300 px-3 py-2 text-center font-bold">{sub.total}</td>
                        {displayOptions.showPercentage &&
                    <td className="border border-gray-300 px-3 py-2 text-center">{sub.percentage.toFixed(1)}%</td>
                    }
                        {displayOptions.showSubjectWiseGrade &&
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-blue-600">{sub.grade}</td>
                    }
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 uppercase">Total Marks</p>
                    <p className="text-2xl font-bold text-gray-900">580/700</p>
                  </div>
                  {displayOptions.showConvertedMarks && conversionMode !== 'actual' &&
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase">Converted</p>
                      <p className="text-2xl font-bold text-gray-900">82.8/{conversionMode === 'convert_100' ? '100' : customConversionTotal}</p>
                    </div>
                }
                  {displayOptions.showPercentage &&
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase">Percentage</p>
                      <p className="text-2xl font-bold text-green-600">82.86%</p>
                    </div>
                }
                  {displayOptions.showGrade &&
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase">Grade</p>
                      <p className="text-2xl font-bold text-blue-600">A2</p>
                    </div>
                }
                  {displayOptions.showCGPA &&
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase">CGPA</p>
                      <p className="text-2xl font-bold text-purple-600">8.4</p>
                    </div>
                }
                  {displayOptions.showRank &&
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-xs text-gray-500 uppercase">Rank</p>
                      <p className="text-2xl font-bold text-orange-600">5th</p>
                    </div>
                }
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 uppercase">Result</p>
                    <p className="text-2xl font-bold text-green-600">PASS</p>
                  </div>
                </div>
              </div>

              {/* Remarks & Signatures */}
              {(displayOptions.showRemarks || displayOptions.showTeacherComments) &&
            <div className="p-6 border-t border-gray-200">
                  {displayOptions.showTeacherComments &&
              <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase mb-2">Teacher's Comments</p>
                      <div className="h-16 border border-dashed border-gray-300 rounded-lg bg-gray-50"></div>
                    </div>
              }
                </div>
            }

              {/* Signatures */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between">
                  {displayOptions.showClassTeacherSignature &&
                <div className="text-center">
                      <div className="h-12 w-32 border-b border-gray-400 mb-2"></div>
                      <p className="text-xs text-gray-500">Class Teacher</p>
                    </div>
                }
                  {displayOptions.showPrincipalSignature &&
                <div className="text-center">
                      <div className="h-12 w-32 border-b border-gray-400 mb-2"></div>
                      <p className="text-xs text-gray-500">Principal</p>
                    </div>
                }
                  {displayOptions.showParentSignature &&
                <div className="text-center">
                      <div className="h-12 w-32 border-b border-gray-400 mb-2"></div>
                      <p className="text-xs text-gray-500">Parent/Guardian</p>
                    </div>
                }
                </div>
              </div>

              {/* Footer */}
              {displayOptions.footerContent &&
            <div className="p-4 bg-gray-100 text-center text-xs text-gray-500 border-t border-gray-200">
                  {displayOptions.footerContent}
                </div>
            }
            </div>
          </div>
        </Card>
      }

      {/* Action Buttons */}
      <Card className="mt-6 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Change Notes (for version history)</label>
            <input
              type="text"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="Describe changes made..."
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />

          </div>
          <div className="flex items-center gap-3">
            {configStatus === 'active' &&
            <Button variant="outline" onClick={handleArchive} className="text-gray-600">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            }
            <Button variant="outline" onClick={handleSaveAsDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              variant="success"
              onClick={handleActivate}
              disabled={!isWeightageValid}>

              <CheckCircle className="w-4 h-4 mr-2" />
              Activate
            </Button>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Version: v{currentVersion}</span>
          <span>Last Modified: {new Date().toLocaleString()}</span>
        </div>
      </Card>

      {/* Info Note */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Final Report Card Configuration Guidelines
            </p>
            <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
              <li>Semester/Term weightages must total 100%</li>
              <li>Exam weightages within each semester must total 100%</li>
              <li>Ensure grade scale is properly configured before activation</li>
              <li>Preview the report card before activating the configuration</li>
              <li>All activated configurations are locked and tracked in version history</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* History Modal */}
      {showHistory &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Version History
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)} className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {versionHistory.map((version, index) =>
            <div key={index} className={`p-4 rounded-lg border mb-3 ${
            version.version === currentVersion ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`
            }>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={version.status === 'active' ? 'success' : version.status === 'draft' ? 'warning' : 'default'}>
                        v{version.version}
                      </Badge>
                      {version.version === currentVersion &&
                  <Badge variant="info" size="sm">Current</Badge>
                  }
                    </div>
                    <span className="text-xs text-gray-500">{version.modifiedAt}</span>
                  </div>
                  <p className="text-sm text-gray-700">{version.changeNotes}</p>
                  <p className="text-xs text-gray-500 mt-1">Modified by: {version.modifiedBy}</p>
                </div>
            )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={() => setShowHistory(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default FinalReportCardSetup;