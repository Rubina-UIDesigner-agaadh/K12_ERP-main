import React, { useState, useMemo, useCallback } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Database,
  ClipboardCheck,
  FileCheck,
  AlertTriangle,
  Info,
  Eye,
  RefreshCcw,
  Send,
  Lock,
  MapPin,
  Target,
  BarChart3,
  Zap,
  FileDown,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Search,
  Filter,
  Users,
  Calendar,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  Edit3,
  Save,
  Trash2,
  Copy,
  ExternalLink,
  HelpCircle,
  Clock,
  CheckCheck,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Printer,
  History,
  Loader2,
  Plus,
  Minus,
  MoreVertical,
  Star,
  Award,
  TrendingUp,
  FileJson,
  FileCode,
  Table,
  Hash,
  Link,
  Globe,
  Key,
  Activity,
  Layers,
  List,
  LayoutGrid,
  Play,
  Pause,
  RotateCcw } from
'lucide-react';

// ============ TYPE DEFINITIONS ============

type SubmissionType =
'internal_marks' |
'theory_marks' |
'practical_marks' |
'attendance_data' |
'subject_mapping' |
'student_registration' |
'result_declaration';

type ExportFormat = 'csv' | 'xlsx' | 'xml' | 'json' | 'txt';
type ValidationSeverity = 'error' | 'warning' | 'info';
type SubmissionStatus = 'generated' | 'submitted' | 'accepted' | 'rejected' | 'corrected_resubmitted';
type TabId = 'filters' | 'validation' | 'preview' | 'history';
type UserRole = 'admin' | 'examination_incharge' | 'principal' | 'coordinator';

interface ValidationError {
  studentId: string;
  studentName: string;
  rollNo: string;
  subject?: string;
  errorType: string;
  description: string;
  severity: ValidationSeverity;
  field: string;
  fixable: boolean;
}

interface StudentRecord {
  id: string;
  registrationNo: string;
  boardRollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  standard: number;
  section: string;
  stream: string;
  subjects: SubjectMarks[];
  isValid: boolean;
  hasWarnings: boolean;
  errors: ValidationError[];
}

interface SubjectMarks {
  subjectCode: string;
  subjectName: string;
  internalSubjectCode: string;
  theoryMax: number;
  theoryObtained: number | null;
  practicalMax: number;
  practicalObtained: number | null;
  internalMax: number;
  internalObtained: number | null;
  totalObtained: number;
  grade: string;
  isAbsent: boolean;
  graceMarks: number;
}

interface BoardConfig {
  boardName: string;
  boardCode: string;
  requiredFields: string[];
  mandatorySubjectCodes: string[];
  maxMarksRules: {theory: number;practical: number;internal: number;total: number;};
  gradeConversionRules: {minPercentage: number;grade: string;}[];
  practicalTheorySplit: {theory: number;practical: number;};
  fileFormatRequirement: ExportFormat[];
  characterLimits: {field: string;maxLength: number;}[];
  allowedValueRanges: {field: string;min: number;max: number;}[];
  requiredColumnOrder: string[];
  absentValueFormat: string;
  graceMarksAllowed: boolean;
  maxGraceMarks: number;
}

interface ExportHistory {
  id: string;
  generatedBy: string;
  dateTime: string;
  ipAddress: string;
  classes: number[];
  examType: string;
  submissionType: SubmissionType;
  recordCount: number;
  fileVersion: string;
  fileHashId: string;
  status: SubmissionStatus;
  fileName: string;
  acknowledgmentNo?: string;
  failureReason?: string;
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
}

// ============ CONSTANTS ============

const SUBMISSION_TYPES: {value: SubmissionType;label: string;icon: React.ElementType;}[] = [
{ value: 'internal_marks', label: 'Internal Marks Upload', icon: FileText },
{ value: 'theory_marks', label: 'Theory Marks Upload', icon: BookOpen },
{ value: 'practical_marks', label: 'Practical Marks Upload', icon: Zap },
{ value: 'attendance_data', label: 'Attendance Data', icon: Calendar },
{ value: 'subject_mapping', label: 'Subject Mapping File', icon: MapPin },
{ value: 'student_registration', label: 'Student Registration File', icon: Users },
{ value: 'result_declaration', label: 'Result Declaration File', icon: Award }];


const EXAM_TYPES = [
{ value: 'annual', label: 'Annual Examination' },
{ value: 'supplementary', label: 'Supplementary Examination' },
{ value: 'improvement', label: 'Improvement Examination' },
{ value: 'compartment', label: 'Compartment Examination' }];


const ACADEMIC_YEARS = [
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


const CLASSES = [
{ value: 9, label: 'Class 9' },
{ value: 10, label: 'Class 10 (SSC)' },
{ value: 11, label: 'Class 11' },
{ value: 12, label: 'Class 12 (HSC)' }];


const SECTIONS = ['A', 'B', 'C', 'D'];

// ============ MOCK DATA GENERATORS ============

const generateBoardConfig = (): BoardConfig => ({
  boardName: 'Gujarat Secondary and Higher Secondary Education Board',
  boardCode: 'GSEB',
  requiredFields: [
  'Registration Number', 'Board Roll Number', 'Student Name', 'Father Name',
  'Date of Birth', 'Gender', 'Category', 'Subject Code', 'Theory Marks',
  'Practical Marks', 'Internal Marks', 'Total Marks', 'Grade', 'Result'],

  mandatorySubjectCodes: ['GUJ001', 'ENG002', 'HIN003', 'MAT004', 'SCI005', 'SST006'],
  maxMarksRules: { theory: 80, practical: 20, internal: 20, total: 100 },
  gradeConversionRules: [
  { minPercentage: 91, grade: 'A1' },
  { minPercentage: 81, grade: 'A2' },
  { minPercentage: 71, grade: 'B1' },
  { minPercentage: 61, grade: 'B2' },
  { minPercentage: 51, grade: 'C1' },
  { minPercentage: 41, grade: 'C2' },
  { minPercentage: 33, grade: 'D' },
  { minPercentage: 21, grade: 'E' },
  { minPercentage: 0, grade: 'F' }],

  practicalTheorySplit: { theory: 80, practical: 20 },
  fileFormatRequirement: ['csv', 'xlsx'],
  characterLimits: [
  { field: 'Student Name', maxLength: 100 },
  { field: 'Father Name', maxLength: 100 },
  { field: 'Subject Code', maxLength: 10 }],

  allowedValueRanges: [
  { field: 'Theory Marks', min: 0, max: 80 },
  { field: 'Practical Marks', min: 0, max: 20 },
  { field: 'Internal Marks', min: 0, max: 20 }],

  requiredColumnOrder: [
  'ROLL_NO', 'BOARD_ROLL_NO', 'STUDENT_NAME', 'FATHER_NAME', 'MOTHER_NAME',
  'DOB', 'GENDER', 'CATEGORY', 'SUB_CODE', 'SUB_NAME', 'THEORY_MARKS',
  'PRACT_MARKS', 'IA_MARKS', 'TOTAL_MARKS', 'GRADE', 'RESULT'],

  absentValueFormat: 'AB',
  graceMarksAllowed: true,
  maxGraceMarks: 5
});

const generateMockStudents = (): StudentRecord[] => {
  const names = [
  { name: 'ADITYA KUMAR VARDHAN', father: 'RAMESH KUMAR VARDHAN', mother: 'SUNITA DEVI' },
  { name: 'PRIYA SHARMA', father: 'VIJAY SHARMA', mother: 'MEENA SHARMA' },
  { name: 'RAHUL VERMA', father: 'SURESH VERMA', mother: 'KAMLA VERMA' },
  { name: 'SUNITA GUPTA', father: 'MOHAN GUPTA', mother: 'REKHA GUPTA' },
  { name: 'AMIT PATEL', father: 'JAYESH PATEL', mother: 'HETAL PATEL' },
  { name: 'KAVYA NAIR', father: 'KRISHNAN NAIR', mother: 'LAKSHMI NAIR' },
  { name: 'ROHAN JOSHI', father: 'PRAKASH JOSHI', mother: 'ANITA JOSHI' },
  { name: 'MEERA IYER', father: 'VENKATESH IYER', mother: 'SARASWATI IYER' },
  { name: 'KARAN MALHOTRA', father: 'RAJIV MALHOTRA', mother: 'NEETA MALHOTRA' },
  { name: 'DIVYA AGARWAL', father: 'SUNIL AGARWAL', mother: 'POONAM AGARWAL' },
  { name: 'STUDENT WITH A VERY LONG NAME EXCEEDING THE CHARACTER LIMIT SET BY BOARD', father: 'FATHER NAME', mother: 'MOTHER NAME' },
  { name: 'ARJUN REDDY', father: 'VENKAT REDDY', mother: 'PADMA REDDY' }];


  const subjects = [
  { code: 'GUJ001', name: 'Gujarati', hasPractical: false },
  { code: 'ENG002', name: 'English', hasPractical: false },
  { code: 'HIN003', name: 'Hindi', hasPractical: false },
  { code: 'MAT004', name: 'Mathematics', hasPractical: false },
  { code: 'SCI005', name: 'Science', hasPractical: true },
  { code: 'SST006', name: 'Social Science', hasPractical: false }];


  const students: StudentRecord[] = [];
  const genders: ('M' | 'F')[] = ['M', 'F'];
  const categories: ('GEN' | 'OBC' | 'SC' | 'ST' | 'EWS')[] = ['GEN', 'OBC', 'SC', 'ST', 'EWS'];

  names.forEach((nameData, idx) => {
    const studentSubjects: SubjectMarks[] = subjects.map((sub) => {
      const theoryMax = sub.hasPractical ? 60 : 80;
      const practicalMax = sub.hasPractical ? 20 : 0;
      const internalMax = 20;

      // Introduce some errors for demonstration
      const hasMarksError = idx === 3 && sub.code === 'MAT004';
      const isAbsent = idx === 5 && sub.code === 'SCI005';

      const theoryObtained = isAbsent ? null : hasMarksError ? 95 : Math.floor(Math.random() * (theoryMax - 20)) + 20;
      const practicalObtained = isAbsent ? null : sub.hasPractical ? Math.floor(Math.random() * practicalMax) + 5 : null;
      const internalObtained = isAbsent ? null : Math.floor(Math.random() * internalMax) + 5;
      const totalObtained = (theoryObtained || 0) + (practicalObtained || 0) + (internalObtained || 0);

      const percentage = totalObtained / (theoryMax + practicalMax + internalMax) * 100;
      const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' :
      percentage >= 61 ? 'B2' : percentage >= 51 ? 'C1' : percentage >= 41 ? 'C2' :
      percentage >= 33 ? 'D' : percentage >= 21 ? 'E' : 'F';

      return {
        subjectCode: sub.code,
        subjectName: sub.name,
        internalSubjectCode: `INT_${sub.code}`,
        theoryMax,
        theoryObtained,
        practicalMax,
        practicalObtained,
        internalMax,
        internalObtained,
        totalObtained,
        grade,
        isAbsent,
        graceMarks: 0
      };
    });

    const errors: ValidationError[] = [];

    // Check for name length error
    if (nameData.name.length > 100) {
      errors.push({
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `${10}A${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Character Limit Exceeded',
        description: `Student name exceeds 100 character limit (${nameData.name.length} characters)`,
        severity: 'error',
        field: 'name',
        fixable: true
      });
    }

    // Check for marks exceeding max
    if (idx === 3) {
      errors.push({
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `${10}A${String(idx + 1).padStart(3, '0')}`,
        subject: 'Mathematics',
        errorType: 'Marks Exceed Maximum',
        description: 'Theory marks (95) exceed maximum allowed (80)',
        severity: 'error',
        field: 'theoryMarks',
        fixable: false
      });
    }

    // Check for missing board roll number
    if (idx === 7) {
      errors.push({
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `${10}A${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Missing Board Roll Number',
        description: 'Board Roll Number is required but not mapped',
        severity: 'error',
        field: 'boardRollNo',
        fixable: false
      });
    }

    // Add warnings
    if (idx === 2) {
      errors.push({
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `${10}A${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Low Performance',
        description: 'Student has marks below 40% - verify before submission',
        severity: 'warning',
        field: 'totalMarks',
        fixable: false
      });
    }

    students.push({
      id: `STU${String(idx + 1).padStart(4, '0')}`,
      registrationNo: `REG2024${String(idx + 1).padStart(5, '0')}`,
      boardRollNo: idx === 7 ? '' : `GJ1024${String(idx + 1).padStart(6, '0')}`,
      name: nameData.name,
      fatherName: nameData.father,
      motherName: nameData.mother,
      dob: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2009`,
      gender: genders[Math.floor(Math.random() * 2)],
      category: categories[Math.floor(Math.random() * 5)],
      standard: 10,
      section: 'A',
      stream: 'General',
      subjects: studentSubjects,
      isValid: errors.filter((e) => e.severity === 'error').length === 0,
      hasWarnings: errors.filter((e) => e.severity === 'warning').length > 0,
      errors
    });
  });

  return students;
};

const generateExportHistory = (): ExportHistory[] => [
{
  id: 'EXP001',
  generatedBy: 'Admin User',
  dateTime: '2024-02-15 14:30:00',
  ipAddress: '192.168.1.100',
  classes: [10],
  examType: 'Annual Examination',
  submissionType: 'theory_marks',
  recordCount: 125,
  fileVersion: '1.0',
  fileHashId: 'SHA256:a1b2c3d4e5f6...',
  status: 'accepted',
  fileName: 'GSEB_STD10_Theory_2024.csv',
  acknowledgmentNo: 'GSEB/2024/ACK/001234'
},
{
  id: 'EXP002',
  generatedBy: 'Exam Coordinator',
  dateTime: '2024-02-10 10:15:00',
  ipAddress: '192.168.1.105',
  classes: [10],
  examType: 'Annual Examination',
  submissionType: 'internal_marks',
  recordCount: 125,
  fileVersion: '1.0',
  fileHashId: 'SHA256:b2c3d4e5f6g7...',
  status: 'submitted',
  fileName: 'GSEB_STD10_Internal_2024.csv'
},
{
  id: 'EXP003',
  generatedBy: 'Admin User',
  dateTime: '2024-02-05 16:45:00',
  ipAddress: '192.168.1.100',
  classes: [12],
  examType: 'Annual Examination',
  submissionType: 'practical_marks',
  recordCount: 85,
  fileVersion: '1.0',
  fileHashId: 'SHA256:c3d4e5f6g7h8...',
  status: 'rejected',
  fileName: 'GSEB_STD12_Practical_2024.csv',
  failureReason: 'Subject code mismatch for 3 students'
},
{
  id: 'EXP004',
  generatedBy: 'Admin User',
  dateTime: '2024-02-06 09:00:00',
  ipAddress: '192.168.1.100',
  classes: [12],
  examType: 'Annual Examination',
  submissionType: 'practical_marks',
  recordCount: 85,
  fileVersion: '1.1',
  fileHashId: 'SHA256:d4e5f6g7h8i9...',
  status: 'accepted',
  fileName: 'GSEB_STD12_Practical_2024_v2.csv',
  acknowledgmentNo: 'GSEB/2024/ACK/001198'
}];


// ============ UI COMPONENTS ============

const Card: React.FC<{children: React.ReactNode;className?: string;}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', onClick }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>

      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
}> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>);

};

const Toggle: React.FC<{value: boolean;onChange: (v: boolean) => void;disabled?: boolean;}> = ({
  value, onChange, disabled
}) =>
<button
  type="button"
  onClick={() => !disabled && onChange(!value)}
  disabled={disabled}
  className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>;


const ProgressBar: React.FC<{progress: number;showLabel?: boolean;color?: string;}> = ({
  progress, showLabel = true, color = 'indigo'
}) =>
<div className="w-full">
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
      className={`h-full bg-${color}-600 transition-all duration-500 ease-out`}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />

    </div>
    {showLabel &&
  <p className="text-xs text-gray-500 mt-1 text-right">{progress.toFixed(0)}%</p>
  }
  </div>;


// ============ TAB NAVIGATION ============

const TabNavigation: React.FC<{
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  validationCount: {errors: number;warnings: number;};
  historyCount: number;
}> = ({ activeTab, onTabChange, validationCount, historyCount }) => {
  const tabs: {id: TabId;label: string;icon: React.ElementType;badge?: {count: number;variant: 'danger' | 'warning' | 'info';};}[] = [
  { id: 'filters', label: 'Filters & Selection', icon: Filter },
  {
    id: 'validation',
    label: 'Data Validation',
    icon: ClipboardCheck,
    badge: validationCount.errors > 0 ?
    { count: validationCount.errors, variant: 'danger' } :
    validationCount.warnings > 0 ?
    { count: validationCount.warnings, variant: 'warning' } :
    undefined
  },
  { id: 'preview', label: 'Preview Export', icon: Eye },
  { id: 'history', label: 'Export History', icon: History, badge: { count: historyCount, variant: 'info' } }];


  return (
    <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id ?
            'border-indigo-600 text-indigo-600 bg-indigo-50/50' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
            }>

            <Icon className="w-4 h-4" />
            {tab.label}
            {tab.badge &&
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
            tab.badge.variant === 'danger' ? 'bg-red-100 text-red-700' :
            tab.badge.variant === 'warning' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'}`
            }>
                {tab.badge.count}
              </span>
            }
          </button>);

      })}
    </div>);

};

// ============ FILTERS TAB ============

interface FiltersState {
  academicYear: string;
  classes: number[];
  sections: string[];
  examType: string;
  submissionType: SubmissionType;
}

const FiltersTab: React.FC<{
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  onGenerate: () => void;
  onPreview: () => void;
  onReset: () => void;
  isGenerating: boolean;
  boardConfig: BoardConfig;
}> = ({ filters, onFiltersChange, onGenerate, onPreview, onReset, isGenerating, boardConfig }) => {
  const handleClassToggle = (classValue: number) => {
    const newClasses = filters.classes.includes(classValue) ?
    filters.classes.filter((c) => c !== classValue) :
    [...filters.classes, classValue];
    onFiltersChange({ ...filters, classes: newClasses });
  };

  const handleSectionToggle = (section: string) => {
    const newSections = filters.sections.includes(section) ?
    filters.sections.filter((s) => s !== section) :
    [...filters.sections, section];
    onFiltersChange({ ...filters, sections: newSections });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Board Name - Read Only */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <School className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Selected Board</p>
            <p className="text-lg font-bold text-orange-900">{boardConfig.boardName}</p>
            <p className="text-sm text-orange-700">Board Code: {boardConfig.boardCode}</p>
          </div>
          <Lock className="w-4 h-4 text-orange-400 ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Academic Year */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <select
            value={filters.academicYear}
            onChange={(e) => onFiltersChange({ ...filters, academicYear: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">

            {ACADEMIC_YEARS.map((year) =>
            <option key={year.value} value={year.value}>{year.label}</option>
            )}
          </select>
        </div>

        {/* Exam Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Exam Type <span className="text-red-500">*</span>
          </label>
          <select
            value={filters.examType}
            onChange={(e) => onFiltersChange({ ...filters, examType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">

            {EXAM_TYPES.map((exam) =>
            <option key={exam.value} value={exam.value}>{exam.label}</option>
            )}
          </select>
        </div>

        {/* Submission Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Submission Type <span className="text-red-500">*</span>
          </label>
          <select
            value={filters.submissionType}
            onChange={(e) => onFiltersChange({ ...filters, submissionType: e.target.value as SubmissionType })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">

            {SUBMISSION_TYPES.map((type) =>
            <option key={type.value} value={type.value}>{type.label}</option>
            )}
          </select>
        </div>
      </div>

      {/* Class Selection - Multi-Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Class / Standard <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-2">(Select multiple)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {CLASSES.map((cls) =>
          <button
            key={cls.value}
            onClick={() => handleClassToggle(cls.value)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
            filters.classes.includes(cls.value) ?
            'border-indigo-600 bg-indigo-50 text-indigo-700' :
            'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
            }>

              {filters.classes.includes(cls.value) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
              {cls.label}
            </button>
          )}
        </div>
      </div>

      {/* Section Selection - Optional */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Section
          <span className="text-gray-400 font-normal ml-2">(Optional - leave empty for all sections)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {SECTIONS.map((section) =>
          <button
            key={section}
            onClick={() => handleSectionToggle(section)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
            filters.sections.includes(section) ?
            'border-indigo-600 bg-indigo-50 text-indigo-700' :
            'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
            }>

              {filters.sections.includes(section) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
              Section {section}
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" onClick={onReset}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onGenerate}
            loading={isGenerating}
            disabled={filters.classes.length === 0}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">

            <Zap className="w-4 h-4 mr-2" />
            Generate Export
          </Button>
        </div>
      </div>
    </div>);

};

// ============ BOARD CONFIG PANEL ============

const BoardConfigPanel: React.FC<{config: BoardConfig;}> = ({ config }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['required', 'marks']));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);else
      newSet.add(section);
      return newSet;
    });
  };

  const sections = [
  {
    id: 'required',
    title: 'Required Fields',
    icon: FileCheck,
    content:
    <div className="flex flex-wrap gap-2">
          {config.requiredFields.map((field) =>
      <Badge key={field} variant="info">{field}</Badge>
      )}
        </div>

  },
  {
    id: 'subjects',
    title: 'Mandatory Subject Codes',
    icon: BookOpen,
    content:
    <div className="flex flex-wrap gap-2">
          {config.mandatorySubjectCodes.map((code) =>
      <Badge key={code} variant="purple">{code}</Badge>
      )}
        </div>

  },
  {
    id: 'marks',
    title: 'Maximum Marks Rules',
    icon: Target,
    content:
    <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{config.maxMarksRules.theory}</p>
            <p className="text-xs text-blue-600">Theory Max</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-700">{config.maxMarksRules.practical}</p>
            <p className="text-xs text-purple-600">Practical Max</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-700">{config.maxMarksRules.internal}</p>
            <p className="text-xs text-orange-600">Internal Max</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{config.maxMarksRules.total}</p>
            <p className="text-xs text-green-600">Total Max</p>
          </div>
        </div>

  },
  {
    id: 'grades',
    title: 'Grade Conversion Rules',
    icon: Award,
    content:
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {config.gradeConversionRules.map((rule) =>
      <div key={rule.grade} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-700">{rule.grade}</p>
              <p className="text-xs text-gray-500">≥{rule.minPercentage}%</p>
            </div>
      )}
        </div>

  },
  {
    id: 'format',
    title: 'File Format & Column Order',
    icon: FileSpreadsheet,
    content:
    <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Supported Formats:</span>
            {config.fileFormatRequirement.map((format) =>
        <Badge key={format} variant="success">{format.toUpperCase()}</Badge>
        )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Required Column Order:</p>
            <div className="flex flex-wrap gap-1">
              {config.requiredColumnOrder.map((col, idx) =>
          <span key={col} className="inline-flex items-center text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded font-mono">{col}</span>
                  {idx < config.requiredColumnOrder.length - 1 &&
            <ArrowRight className="w-3 h-3 text-gray-300 mx-1" />
            }
                </span>
          )}
            </div>
          </div>
        </div>

  },
  {
    id: 'limits',
    title: 'Character Limits & Value Ranges',
    icon: Settings,
    content:
    <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Character Limits</p>
            <div className="grid grid-cols-3 gap-3">
              {config.characterLimits.map((limit) =>
          <div key={limit.field} className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">{limit.field}</p>
                  <p className="text-sm font-semibold text-gray-700">Max {limit.maxLength} chars</p>
                </div>
          )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Allowed Value Ranges</p>
            <div className="grid grid-cols-3 gap-3">
              {config.allowedValueRanges.map((range) =>
          <div key={range.field} className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">{range.field}</p>
                  <p className="text-sm font-semibold text-gray-700">{range.min} - {range.max}</p>
                </div>
          )}
            </div>
          </div>
        </div>

  },
  {
    id: 'special',
    title: 'Special Rules',
    icon: Shield,
    content:
    <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Absent Value Format</span>
            <Badge variant="info">{config.absentValueFormat}</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Grace Marks Allowed</span>
            <Badge variant={config.graceMarksAllowed ? 'success' : 'danger'}>
              {config.graceMarksAllowed ? 'Yes' : 'No'}
            </Badge>
          </div>
          {config.graceMarksAllowed &&
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Maximum Grace Marks</span>
              <Badge variant="purple">{config.maxGraceMarks}</Badge>
            </div>
      }
        </div>

  }];


  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <div className="p-4 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-red-100 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-200 rounded-lg">
            <Shield className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h3 className="font-bold text-orange-900">Board Format Configuration</h3>
            <p className="text-sm text-orange-700">System-controlled rules (Read-Only)</p>
          </div>
          <Lock className="w-4 h-4 text-orange-500 ml-auto" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={section.id} className="border border-orange-100 rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-orange-50 transition-colors">

                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">{section.title}</span>
                </div>
                {isExpanded ?
                <ChevronDown className="w-4 h-4 text-gray-400" /> :

                <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>
              {isExpanded &&
              <div className="p-3 pt-0 border-t border-orange-100">
                  {section.content}
                </div>
              }
            </div>);

        })}
      </div>
    </Card>);

};

// ============ VALIDATION TAB ============

const ValidationTab: React.FC<{
  students: StudentRecord[];
  validationErrors: ValidationError[];
  onFixError: (studentId: string, field: string) => void;
  onRunValidation: () => void;
  isValidating: boolean;
  validationProgress: number;
}> = ({ students, validationErrors, onFixError, onRunValidation, isValidating, validationProgress }) => {
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  const summary = useMemo(() => ({
    total: students.length,
    valid: students.filter((s) => s.isValid && !s.hasWarnings).length,
    errors: students.filter((s) => !s.isValid).length,
    warnings: students.filter((s) => s.isValid && s.hasWarnings).length,
    totalErrorCount: validationErrors.filter((e) => e.severity === 'error').length,
    totalWarningCount: validationErrors.filter((e) => e.severity === 'warning').length
  }), [students, validationErrors]);

  const canExport = summary.errors === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Validation Engine Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Data Validation Engine</h3>
          <p className="text-sm text-gray-500">Validates all records against board requirements</p>
        </div>
        <Button
          variant="primary"
          onClick={onRunValidation}
          loading={isValidating}
          className="bg-gradient-to-r from-indigo-600 to-purple-600">

          <ClipboardCheck className="w-4 h-4 mr-2" />
          Run Full Validation
        </Button>
      </div>

      {/* Validation Progress */}
      {isValidating &&
      <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-900">Validating Records...</p>
              <ProgressBar progress={validationProgress} color="indigo" />
            </div>
          </div>
        </Card>
      }

      {/* Validation Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Selected</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Valid Records</p>
              <p className="text-2xl font-bold text-green-700">{summary.valid}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Error Records</p>
              <p className="text-2xl font-bold text-red-700">{summary.errors}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Warning Records</p>
              <p className="text-2xl font-bold text-amber-700">{summary.warnings}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 border-l-4 ${canExport ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${canExport ? 'bg-green-100' : 'bg-red-100'}`}>
              {canExport ?
              <CheckCheck className="w-5 h-5 text-green-600" /> :

              <Lock className="w-5 h-5 text-red-600" />
              }
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Export Status</p>
              <p className={`text-sm font-bold ${canExport ? 'text-green-700' : 'text-red-700'}`}>
                {canExport ? 'Ready to Export' : 'Export Blocked'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Blocked Warning */}
      {!canExport &&
      <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Export Blocked - Critical Errors Detected</p>
              <p className="text-sm text-red-700 mt-1">
                {summary.totalErrorCount} critical error(s) must be resolved before export. 
                Fix all errors in the table below to enable export functionality.
              </p>
            </div>
          </div>
        </Card>
      }

      {/* Validation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Student-Level Validation</h4>
          </div>
          <div className="space-y-2 text-sm">
            {[
            { label: 'Registration Number', status: 'pass' },
            { label: 'Board Roll Number', status: summary.errors > 0 ? 'fail' : 'pass' },
            { label: 'Date of Birth Format', status: 'pass' },
            { label: 'Gender Code', status: 'pass' },
            { label: 'Subject Enrollment', status: 'pass' },
            { label: 'Category/Stream Mapping', status: 'pass' }].
            map((item) =>
            <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                {item.status === 'pass' ?
              <CheckCircle2 className="w-4 h-4 text-green-600" /> :

              <XCircle className="w-4 h-4 text-red-600" />
              }
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Marks Validation</h4>
          </div>
          <div className="space-y-2 text-sm">
            {[
            { label: 'Marks Within Maximum', status: summary.errors > 0 ? 'fail' : 'pass' },
            { label: 'Absent Value Format', status: 'pass' },
            { label: 'Grace Marks Applied', status: 'pass' },
            { label: 'Theory + Internal Totals', status: 'pass' },
            { label: 'Overall Calculation', status: 'pass' },
            { label: 'Grade Conversion', status: 'pass' }].
            map((item) =>
            <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                {item.status === 'pass' ?
              <CheckCircle2 className="w-4 h-4 text-green-600" /> :

              <XCircle className="w-4 h-4 text-red-600" />
              }
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Subject Code Validation</h4>
          </div>
          <div className="space-y-2 text-sm">
            {[
            { label: 'Board-Approved Codes', status: 'pass' },
            { label: 'Elective Subjects Mapped', status: 'pass' },
            { label: 'No Missing Entries', status: 'pass' }].
            map((item) =>
            <div key={item.label} className="flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                {item.status === 'pass' ?
              <CheckCircle2 className="w-4 h-4 text-green-600" /> :

              <XCircle className="w-4 h-4 text-red-600" />
              }
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Error Log Table */}
      {validationErrors.length > 0 &&
      <Card>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-gray-900">Validation Error Log</h4>
              <Badge variant="danger">{validationErrors.filter((e) => e.severity === 'error').length} Errors</Badge>
              <Badge variant="warning">{validationErrors.filter((e) => e.severity === 'warning').length} Warnings</Badge>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Error Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {validationErrors.map((error, idx) =>
              <tr key={idx} className={`hover:bg-gray-50 ${error.severity === 'error' ? 'bg-red-50/50' : 'bg-amber-50/50'}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{error.studentName.length > 25 ? error.studentName.substring(0, 25) + '...' : error.studentName}</p>
                        <p className="text-xs text-gray-500">Roll: {error.rollNo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{error.subject || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={error.severity === 'error' ? 'danger' : 'warning'}>{error.errorType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">{error.description}</td>
                    <td className="px-4 py-3 text-center">
                      {error.severity === 'error' ?
                  <XCircle className="w-5 h-5 text-red-600 mx-auto" /> :

                  <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {error.fixable ?
                  <Button variant="outline" size="sm" onClick={() => onFixError(error.studentId, error.field)}>
                          <Zap className="w-3 h-3 mr-1" />
                          Fix
                        </Button> :

                  <Button variant="ghost" size="sm">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                  }
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }
    </div>);

};

// ============ PREVIEW TAB ============

const PreviewTab: React.FC<{
  students: StudentRecord[];
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  onDownload: (format: ExportFormat) => void;
  onDirectSubmit: () => void;
  isExporting: boolean;
  apiEnabled: boolean;
  boardConfig: BoardConfig;
}> = ({ students, exportFormat, onExportFormatChange, onDownload, onDirectSubmit, isExporting, apiEnabled, boardConfig }) => {
  const previewData = students.slice(0, 5);
  const hasErrors = students.some((s) => !s.isValid);

  const formatIcons: Record<ExportFormat, React.ElementType> = {
    csv: FileText,
    xlsx: FileSpreadsheet,
    xml: FileCode,
    json: FileJson,
    txt: FileText
  };

  return (
    <div className="p-6 space-y-6">
      {/* Export Format Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Export Format</h3>
          <p className="text-sm text-gray-500">Select the format for board submission</p>
        </div>
        <div className="flex gap-2">
          {boardConfig.fileFormatRequirement.map((format) => {
            const Icon = formatIcons[format];
            return (
              <button
                key={format}
                onClick={() => onExportFormatChange(format)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                exportFormat === format ?
                'border-indigo-600 bg-indigo-50 text-indigo-700' :
                'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                }>

                <Icon className="w-4 h-4" />
                {format.toUpperCase()}
              </button>);

          })}
        </div>
      </div>

      {/* Preview Header */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">Header Row Format</h4>
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {boardConfig.requiredColumnOrder.map((col, idx) =>
          <span key={col} className="inline-flex items-center">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{col}</span>
              {idx < boardConfig.requiredColumnOrder.length - 1 &&
            <span className="text-gray-300 mx-1">|</span>
            }
            </span>
          )}
        </div>
      </Card>

      {/* Preview Table */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-gray-900">Data Preview</h4>
            <Badge variant="info">First 5 Records</Badge>
          </div>
          <p className="text-sm text-gray-500">Total: {students.length} records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                {['ROLL_NO', 'BOARD_ROLL_NO', 'STUDENT_NAME', 'FATHER_NAME', 'DOB', 'GENDER', 'SUB_CODE', 'THEORY', 'PRACT', 'IA', 'TOTAL', 'GRADE', 'RESULT'].map((col) =>
                <th key={col} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase whitespace-nowrap">{col}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {previewData.map((student) =>
              student.subjects.slice(0, 1).map((subject, sIdx) =>
              <tr key={`${student.id}-${sIdx}`} className={`hover:bg-gray-50 ${!student.isValid ? 'bg-red-50/50' : ''}`}>
                    <td className="px-3 py-2 font-mono">{student.registrationNo.slice(-7)}</td>
                    <td className="px-3 py-2 font-mono">{student.boardRollNo || <span className="text-red-500">MISSING</span>}</td>
                    <td className="px-3 py-2 font-medium truncate max-w-[150px]" title={student.name}>{student.name}</td>
                    <td className="px-3 py-2 truncate max-w-[120px]">{student.fatherName}</td>
                    <td className="px-3 py-2 font-mono">{student.dob}</td>
                    <td className="px-3 py-2 text-center">{student.gender}</td>
                    <td className="px-3 py-2 font-mono">{subject.subjectCode}</td>
                    <td className="px-3 py-2 text-center">{subject.theoryObtained ?? 'AB'}</td>
                    <td className="px-3 py-2 text-center">{subject.practicalObtained ?? '-'}</td>
                    <td className="px-3 py-2 text-center">{subject.internalObtained ?? 'AB'}</td>
                    <td className="px-3 py-2 text-center font-bold">{subject.totalObtained}</td>
                    <td className="px-3 py-2 text-center"><Badge variant="default">{subject.grade}</Badge></td>
                    <td className="px-3 py-2 text-center">
                      <Badge variant={subject.totalObtained >= 33 ? 'success' : 'danger'}>
                        {subject.totalObtained >= 33 ? 'PASS' : 'FAIL'}
                      </Badge>
                    </td>
                  </tr>
              )
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          ... and {Math.max(0, students.length - 5)} more records
        </div>
      </Card>

      {/* Download Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3">
          {boardConfig.fileFormatRequirement.map((format) => {
            const Icon = formatIcons[format];
            return (
              <Button
                key={format}
                variant="outline"
                onClick={() => onDownload(format)}
                disabled={hasErrors || isExporting}
                loading={isExporting && exportFormat === format}>

                <Icon className="w-4 h-4 mr-2" />
                Download {format.toUpperCase()}
              </Button>);

          })}
        </div>

        {apiEnabled &&
        <Button
          variant="primary"
          size="lg"
          onClick={onDirectSubmit}
          disabled={hasErrors || isExporting}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">

            <Send className="w-4 h-4 mr-2" />
            Direct API Submission
          </Button>
        }
      </div>

      {/* Export Blocked Warning */}
      {hasErrors &&
      <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              <span className="font-bold">Export Disabled:</span> Fix all validation errors before downloading or submitting.
            </p>
          </div>
        </Card>
      }

      {/* Download Confirmation Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Pre-Download Checklist</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>Verify all student details are correct</li>
              <li>Confirm marks calculation is accurate</li>
              <li>Check subject codes match board requirements</li>
              <li>Download file will be logged for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);

};

// ============ HISTORY TAB ============

const HistoryTab: React.FC<{
  history: ExportHistory[];
  onRedownload: (id: string) => void;
  onViewLog: (id: string) => void;
  onRegenerate: (id: string) => void;
}> = ({ history, onRedownload, onViewLog, onRegenerate }) => {
  const getStatusConfig = (status: SubmissionStatus) => {
    const configs = {
      generated: { label: 'Generated', bg: 'bg-gray-100', text: 'text-gray-700', icon: FileCheck },
      submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700', icon: Send },
      accepted: { label: 'Accepted', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      corrected_resubmitted: { label: 'Corrected & Resubmitted', bg: 'bg-purple-100', text: 'text-purple-700', icon: RefreshCcw }
    };
    return configs[status];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Export & Submission History</h3>
          <p className="text-sm text-gray-500">Track all generated exports and their submission status</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Audit Log
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exam Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Submission Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Records</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acknowledgment</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.dateTime.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{item.dateTime.split(' ')[1]}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">Class {item.classes.join(', ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.examType}</td>
                    <td className="px-4 py-3">
                      <span className="text-gray-700 capitalize">{item.submissionType.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">{item.recordCount}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.text}`} />
                        <span className={`text-xs font-medium ${statusConfig.text}`}>{statusConfig.label}</span>
                      </div>
                      {item.failureReason &&
                      <p className="text-xs text-red-600 mt-1">{item.failureReason}</p>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {item.acknowledgmentNo ?
                      <span className="font-mono text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                          {item.acknowledgmentNo}
                        </span> :

                      <span className="text-gray-400">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onRedownload(item.id)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onViewLog(item.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.status === 'rejected' &&
                        <Button variant="ghost" size="sm" onClick={() => onRegenerate(item.id)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Information */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">Audit Trail Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Generated By</p>
            <p className="font-medium text-gray-900">Admin User</p>
          </div>
          <div>
            <p className="text-gray-500">IP Address</p>
            <p className="font-medium text-gray-900 font-mono">192.168.1.100</p>
          </div>
          <div>
            <p className="text-gray-500">File Hash</p>
            <p className="font-medium text-gray-900 font-mono text-xs">SHA256:a1b2c3...</p>
          </div>
          <div>
            <p className="text-gray-500">Version</p>
            <p className="font-medium text-gray-900">1.0</p>
          </div>
        </div>
      </Card>
    </div>);

};

// ============ API CONFIGURATION PANEL ============

const APIConfigPanel: React.FC<{
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}> = ({ enabled, onToggle }) => {
  return (
    <Card className="border-green-200 bg-green-50/30">
      <div className="p-4 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-200 rounded-lg">
              <Globe className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">Direct API Submission</h3>
              <p className="text-sm text-green-700">Submit directly to board portal</p>
            </div>
          </div>
          <Toggle value={enabled} onChange={onToggle} />
        </div>
      </div>
      {enabled &&
      <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">API Endpoint</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <Link className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 font-mono">api.gseb.gov.in/submit</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">API Token Status</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Key className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Configured & Valid</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Direct API submission will immediately upload data to the board portal. 
                Ensure all validations pass before proceeding.
              </p>
            </div>
          </div>
        </div>
      }
    </Card>);

};

// ============ MAIN COMPONENT ============

export function GSEBBoardSubmissionExport() {
  // State
  const [activeTab, setActiveTab] = useState<TabId>('filters');
  const [boardConfig] = useState<BoardConfig>(generateBoardConfig());
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [exportHistory] = useState<ExportHistory[]>(generateExportHistory());

  const [filters, setFilters] = useState<FiltersState>({
    academicYear: '2024-25',
    classes: [],
    sections: [],
    examType: 'annual',
    submissionType: 'theory_marks'
  });

  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [apiEnabled, setApiEnabled] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Current user role (mock)
  const currentUserRole: UserRole = 'admin';

  // Computed values
  const validationErrors = useMemo(() => {
    return students.flatMap((s) => s.errors);
  }, [students]);

  const validationSummary = useMemo(() => ({
    errors: validationErrors.filter((e) => e.severity === 'error').length,
    warnings: validationErrors.filter((e) => e.severity === 'warning').length
  }), [validationErrors]);

  // Role-based access check
  const hasEditAccess = ['admin', 'examination_incharge', 'principal'].includes(currentUserRole);

  // Handlers
  const handleGenerate = useCallback(() => {
    if (filters.classes.length === 0) {
      alert('Please select at least one class');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setStudents(generateMockStudents());
          setActiveTab('validation');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [filters.classes]);

  const handlePreview = useCallback(() => {
    if (students.length === 0) {
      alert('Please generate data first');
      return;
    }
    setActiveTab('preview');
  }, [students.length]);

  const handleReset = useCallback(() => {
    setFilters({
      academicYear: '2024-25',
      classes: [],
      sections: [],
      examType: 'annual',
      submissionType: 'theory_marks'
    });
    setStudents([]);
  }, []);

  const handleRunValidation = useCallback(() => {
    setIsValidating(true);
    setValidationProgress(0);

    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, []);

  const handleFixError = useCallback((studentId: string, field: string) => {
    setStudents((prev) => prev.map((student) => {
      if (student.id !== studentId) return student;

      // Auto-fix logic
      let updated = { ...student };

      if (field === 'name' && student.name.length > 100) {
        updated.name = student.name.substring(0, 100);
        updated.errors = student.errors.filter((e) => e.field !== 'name');
      }

      // Recalculate validation status
      updated.isValid = updated.errors.filter((e) => e.severity === 'error').length === 0;
      updated.hasWarnings = updated.errors.filter((e) => e.severity === 'warning').length > 0;

      return updated;
    }));
  }, []);

  const handleDownload = useCallback((format: ExportFormat) => {
    const hasErrors = students.some((s) => !s.isValid);
    if (hasErrors) {
      alert('Cannot export with validation errors. Please fix all issues first.');
      return;
    }

    setIsExporting(true);
    setExportFormat(format);

    setTimeout(() => {
      // Generate export content
      const headers = boardConfig.requiredColumnOrder.join(',');
      let content = headers + '\n';

      students.forEach((student) => {
        student.subjects.forEach((subject) => {
          const row = [
          student.registrationNo,
          student.boardRollNo,
          `"${student.name}"`,
          `"${student.fatherName}"`,
          `"${student.motherName}"`,
          student.dob,
          student.gender,
          student.category,
          subject.subjectCode,
          `"${subject.subjectName}"`,
          subject.theoryObtained ?? boardConfig.absentValueFormat,
          subject.practicalObtained ?? '',
          subject.internalObtained ?? boardConfig.absentValueFormat,
          subject.totalObtained,
          subject.grade,
          subject.totalObtained >= 33 ? 'PASS' : 'FAIL'].
          join(',');
          content += row + '\n';
        });
      });

      // Download
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GSEB_Export_${filters.examType}_${filters.classes.join('-')}_${new Date().toISOString().slice(0, 10)}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 1500);
  }, [students, boardConfig, filters]);

  const handleDirectSubmit = useCallback(() => {
    alert('This is a demo. In production, this would:\n\n1. Validate API token\n2. Submit data to GSEB portal\n3. Store acknowledgment number\n4. Log submission details');
  }, []);

  const handleRedownload = useCallback((id: string) => {
    alert(`Downloading file for export ${id}`);
  }, []);

  const handleViewLog = useCallback((id: string) => {
    alert(`Viewing log for export ${id}`);
  }, []);

  const handleRegenerate = useCallback((id: string) => {
    alert(`Regenerating export ${id}`);
  }, []);

  // Access control check
  if (!hasEditAccess && currentUserRole !== 'coordinator') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </Card>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <FileSpreadsheet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Board Submission Export</h1>
                <p className="text-sm text-gray-500">Generate official board-compliant export files for {boardConfig.boardCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={hasEditAccess ? 'success' : 'info'}>
                {currentUserRole === 'admin' ? 'Admin' :
                currentUserRole === 'examination_incharge' ? 'Exam Incharge' :
                currentUserRole === 'principal' ? 'Principal' : 'View Only'}
              </Badge>
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Guide
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Board Portal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Generation Progress */}
        {isGenerating &&
        <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">Generating Export Data...</p>
                <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-orange-600 transition-all duration-300"
                  style={{ width: `${generationProgress}%` }} />

                </div>
              </div>
            </div>
          </Card>
        }

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <Card>
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                validationCount={validationSummary}
                historyCount={exportHistory.length} />


              {/* Tab Content */}
              {activeTab === 'filters' &&
              <FiltersTab
                filters={filters}
                onFiltersChange={setFilters}
                onGenerate={handleGenerate}
                onPreview={handlePreview}
                onReset={handleReset}
                isGenerating={isGenerating}
                boardConfig={boardConfig} />

              }

              {activeTab === 'validation' &&
              <ValidationTab
                students={students}
                validationErrors={validationErrors}
                onFixError={handleFixError}
                onRunValidation={handleRunValidation}
                isValidating={isValidating}
                validationProgress={validationProgress} />

              }

              {activeTab === 'preview' &&
              <PreviewTab
                students={students}
                exportFormat={exportFormat}
                onExportFormatChange={setExportFormat}
                onDownload={handleDownload}
                onDirectSubmit={handleDirectSubmit}
                isExporting={isExporting}
                apiEnabled={apiEnabled}
                boardConfig={boardConfig} />

              }

              {activeTab === 'history' &&
              <HistoryTab
                history={exportHistory}
                onRedownload={handleRedownload}
                onViewLog={handleViewLog}
                onRegenerate={handleRegenerate} />

              }
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Board Config Panel */}
            <BoardConfigPanel config={boardConfig} />

            {/* API Configuration */}
            <APIConfigPanel enabled={apiEnabled} onToggle={setApiEnabled} />

            {/* Quick Stats */}
            {students.length > 0 &&
            <Card className="p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Current Selection
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <span className="font-bold text-gray-900">{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valid</span>
                    <span className="font-bold text-green-600">{students.filter((s) => s.isValid).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">With Errors</span>
                    <span className="font-bold text-red-600">{students.filter((s) => !s.isValid).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">With Warnings</span>
                    <span className="font-bold text-amber-600">{students.filter((s) => s.hasWarnings).length}</span>
                  </div>
                </div>
              </Card>
            }

            {/* Submission Checklist */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Pre-Export Checklist
              </h3>
              <div className="space-y-3">
                {[
                { label: 'Classes Selected', done: filters.classes.length > 0 },
                { label: 'Data Generated', done: students.length > 0 },
                { label: 'Validation Complete', done: students.length > 0 && !isValidating },
                { label: 'No Critical Errors', done: validationSummary.errors === 0 },
                { label: 'Preview Verified', done: false }].
                map((item, idx) =>
                <div key={idx} className={`flex items-center gap-2 ${item.done ? 'text-green-600' : 'text-gray-400'}`}>
                    {item.done ?
                  <CheckCircle2 className="w-4 h-4" /> :

                  <div className="w-4 h-4 border-2 border-current rounded-full" />
                  }
                    <span className="text-sm">{item.label}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Help Section */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Need Help?</p>
                  <p className="text-[11px] text-blue-700 mt-1">
                    Contact examination cell for validation errors or submission issues.
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2 text-blue-700 hover:bg-blue-100 p-0 h-auto text-xs">
                    View Documentation →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Generate Button */}
      {activeTab === 'filters' && filters.classes.length > 0 &&
      <div className="fixed bottom-6 right-6 z-40">
          <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          loading={isGenerating}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30">

            <Zap className="w-5 h-5 mr-2" />
            Generate Export
          </Button>
        </div>
      }
    </div>);

}

export default GSEBBoardSubmissionExport;