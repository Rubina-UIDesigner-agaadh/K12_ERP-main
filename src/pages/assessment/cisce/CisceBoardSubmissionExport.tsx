import React, {
  useCallback,
  useMemo,
  useState,
  Fragment,
  createElement,
  Component } from
'react';
import {
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Upload,
  Printer,
  Share2,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  User,
  Calendar,
  Clock,
  Award,
  Target,
  BarChart3,
  FileText,
  FileSpreadsheet,
  FileCheck,
  FileWarning,
  FileX,
  FilePlus,
  FolderOpen,
  Send,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  Check,
  Filter,
  Settings,
  HelpCircle,
  ExternalLink,
  Shield,
  Lock,
  Unlock,
  Database,
  Server,
  Cloud,
  CloudUpload,
  Zap,
  Hash,
  Percent,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  ListChecks,
  CircleDot,
  Circle,
  Square,
  SquareCheck,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  RotateCcw,
  History,
  Save,
  Package,
  Layers,
  Grid,
  List,
  Table,
  LayoutGrid,
  Columns,
  Rows,
  Binary,
  Code,
  Terminal,
  Workflow,
  GitBranch,
  Flag,
  Bookmark,
  Star,
  MessageSquare,
  Bell,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Link,
  Paperclip,
  Image,
  FileImage,
  Verified,
  BadgeCheck,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Timer,
  Hourglass,
  Play,
  Pause,
  StopCircle,
  SkipForward,
  FastForward,
  Loader2,
  FileCode,
  FileJson,
  Activity,
  Fingerprint,
  Key,
  AlertOctagon,
  Router,
  Cpu,
  ScrollText,
  ClipboardX,
  CheckSquare,
  MoreVertical,
  ArrowLeft,
  ArrowDown } from
'lucide-react';
// ========== TYPES ==========
interface SubjectCode {
  code: string;
  name: string;
  board: 'ICSE' | 'ISC';
  class: string[];
  type: 'core' | 'elective' | 'language' | 'additional';
  hasInternal: boolean;
  hasPractical: boolean;
  internalWeight: number;
  externalWeight: number;
  maxMarks: number;
  passingMarks: number;
}
interface ValidationError {
  studentId: string;
  studentName: string;
  rollNo: string;
  subject: string;
  errorType: 'critical' | 'warning' | 'info';
  category: 'student' | 'marks' | 'subject';
  description: string;
  field: string;
}
interface StudentSubmissionData {
  id: string;
  rollNo: string;
  boardRollNo: string;
  name: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  category: string;
  stream?: string;
  subjects: {
    code: string;
    name: string;
    internalMarks: number | null;
    theoryMarks: number | null;
    practicalMarks: number | null;
    totalMarks: number | null;
    grade: string;
    status: 'valid' | 'missing' | 'invalid' | 'warning';
    errors: string[];
    warnings: string[];
  }[];
  overallStatus: 'valid' | 'has-warnings' | 'has-errors' | 'incomplete';
  validationErrors: ValidationError[];
  validationWarnings: ValidationError[];
}
interface ExportConfig {
  format: 'csv' | 'excel' | 'xml' | 'json' | 'txt';
  includeHeaders: boolean;
  includeGrades: boolean;
  includeRemarks: boolean;
  separateInternal: boolean;
  encoding: 'utf-8' | 'ascii' | 'iso-8859-1';
  delimiter: ',' | ';' | '\t' | '|';
}
interface ExportHistoryRecord {
  id: string;
  date: string;
  time: string;
  generatedBy: string;
  ipAddress: string;
  class: string;
  section: string;
  examType: string;
  submissionType: string;
  recordCount: number;
  fileVersion: string;
  fileHashId: string;
  status: 'generated' | 'submitted' | 'accepted' | 'rejected' | 'corrected';
  fileName: string;
  fileSize: string;
  validRecords: number;
  errorRecords: number;
  warningRecords: number;
}
interface BoardFormatConfig {
  requiredFields: string[];
  mandatorySubjectCodes: string[];
  maxMarksRules: {
    subject: string;
    max: number;
  }[];
  gradeConversionRules: {
    minMarks: number;
    maxMarks: number;
    grade: string;
  }[];
  practicalTheorySplit: {
    subject: string;
    practical: number;
    theory: number;
  }[];
  fileFormat: string;
  characterLimits: {
    field: string;
    limit: number;
  }[];
  allowedValueRanges: {
    field: string;
    min: number;
    max: number;
  }[];
  requiredColumnOrder: string[];
}
// ========== MOCK DATA ==========
const subjectCodesDB: SubjectCode[] = [
{
  code: '01',
  name: 'English Language',
  board: 'ICSE',
  class: ['10'],
  type: 'language',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '02',
  name: 'English Literature',
  board: 'ICSE',
  class: ['10'],
  type: 'language',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '03',
  name: 'Hindi',
  board: 'ICSE',
  class: ['10'],
  type: 'language',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '04',
  name: 'History & Civics',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '05',
  name: 'Geography',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '06',
  name: 'Mathematics',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '07',
  name: 'Science (Physics)',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: true,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '08',
  name: 'Science (Chemistry)',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: true,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '09',
  name: 'Science (Biology)',
  board: 'ICSE',
  class: ['10'],
  type: 'core',
  hasInternal: true,
  hasPractical: true,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '10',
  name: 'Computer Applications',
  board: 'ICSE',
  class: ['10'],
  type: 'elective',
  hasInternal: true,
  hasPractical: true,
  internalWeight: 50,
  externalWeight: 50,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '11',
  name: 'Commercial Studies',
  board: 'ICSE',
  class: ['10'],
  type: 'elective',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '12',
  name: 'Economics',
  board: 'ICSE',
  class: ['10'],
  type: 'elective',
  hasInternal: true,
  hasPractical: false,
  internalWeight: 20,
  externalWeight: 80,
  maxMarks: 100,
  passingMarks: 33
},
{
  code: '51',
  name: 'English',
  board: 'ISC',
  class: ['12'],
  type: 'language',
  hasInternal: false,
  hasPractical: false,
  internalWeight: 0,
  externalWeight: 100,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '52',
  name: 'Hindi',
  board: 'ISC',
  class: ['12'],
  type: 'language',
  hasInternal: false,
  hasPractical: false,
  internalWeight: 0,
  externalWeight: 100,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '53',
  name: 'Physics',
  board: 'ISC',
  class: ['12'],
  type: 'core',
  hasInternal: false,
  hasPractical: true,
  internalWeight: 0,
  externalWeight: 70,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '54',
  name: 'Chemistry',
  board: 'ISC',
  class: ['12'],
  type: 'core',
  hasInternal: false,
  hasPractical: true,
  internalWeight: 0,
  externalWeight: 70,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '55',
  name: 'Mathematics',
  board: 'ISC',
  class: ['12'],
  type: 'core',
  hasInternal: false,
  hasPractical: false,
  internalWeight: 0,
  externalWeight: 100,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '56',
  name: 'Biology',
  board: 'ISC',
  class: ['12'],
  type: 'core',
  hasInternal: false,
  hasPractical: true,
  internalWeight: 0,
  externalWeight: 70,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '57',
  name: 'Computer Science',
  board: 'ISC',
  class: ['12'],
  type: 'elective',
  hasInternal: false,
  hasPractical: true,
  internalWeight: 0,
  externalWeight: 70,
  maxMarks: 100,
  passingMarks: 40
},
{
  code: '58',
  name: 'Accountancy',
  board: 'ISC',
  class: ['12'],
  type: 'elective',
  hasInternal: false,
  hasPractical: false,
  internalWeight: 0,
  externalWeight: 100,
  maxMarks: 100,
  passingMarks: 40
}];

const boardFormatConfig: BoardFormatConfig = {
  requiredFields: [
  'Board Roll No',
  'Student Name',
  'Date of Birth',
  'Gender',
  'Category',
  'Subject Code',
  'Marks'],

  mandatorySubjectCodes: ['01', '02', '06', '07', '08', '09'],
  maxMarksRules: [
  {
    subject: 'Internal Assessment',
    max: 20
  },
  {
    subject: 'Theory',
    max: 80
  },
  {
    subject: 'Practical',
    max: 30
  },
  {
    subject: 'Total',
    max: 100
  }],

  gradeConversionRules: [
  {
    minMarks: 91,
    maxMarks: 100,
    grade: 'A1'
  },
  {
    minMarks: 81,
    maxMarks: 90,
    grade: 'A2'
  },
  {
    minMarks: 71,
    maxMarks: 80,
    grade: 'B1'
  },
  {
    minMarks: 61,
    maxMarks: 70,
    grade: 'B2'
  },
  {
    minMarks: 51,
    maxMarks: 60,
    grade: 'C1'
  },
  {
    minMarks: 41,
    maxMarks: 50,
    grade: 'C2'
  },
  {
    minMarks: 33,
    maxMarks: 40,
    grade: 'D'
  },
  {
    minMarks: 0,
    maxMarks: 32,
    grade: 'E'
  }],

  practicalTheorySplit: [
  {
    subject: 'Physics',
    practical: 20,
    theory: 80
  },
  {
    subject: 'Chemistry',
    practical: 20,
    theory: 80
  },
  {
    subject: 'Biology',
    practical: 20,
    theory: 80
  },
  {
    subject: 'Computer Applications',
    practical: 50,
    theory: 50
  }],

  fileFormat: 'CSV (Comma Separated Values)',
  characterLimits: [
  {
    field: 'Student Name',
    limit: 50
  },
  {
    field: 'Board Roll No',
    limit: 15
  },
  {
    field: 'Category',
    limit: 20
  }],

  allowedValueRanges: [
  {
    field: 'Marks',
    min: 0,
    max: 100
  },
  {
    field: 'Internal',
    min: 0,
    max: 20
  },
  {
    field: 'Theory',
    min: 0,
    max: 80
  }],

  requiredColumnOrder: [
  'Board Roll No',
  'Name',
  'DOB',
  'Gender',
  'Category',
  'Subject Code',
  'Internal',
  'Theory',
  'Practical',
  'Total',
  'Grade']

};
const generateMockSubmissionData = (): StudentSubmissionData[] => {
  const students: StudentSubmissionData[] = [];
  const firstNames = [
  'Aarav',
  'Ananya',
  'Arjun',
  'Diya',
  'Ishaan',
  'Kavya',
  'Krishna',
  'Meera',
  'Neha',
  'Om',
  'Priya',
  'Rahul',
  'Riya',
  'Sanjay',
  'Sneha',
  'Tanvi',
  'Varun',
  'Vihaan',
  'Yashika',
  'Zara',
  'Aditya',
  'Bhavna',
  'Chirag',
  'Deepa',
  'Eshan'];

  const lastNames = [
  'Sharma',
  'Gupta',
  'Patel',
  'Singh',
  'Kumar',
  'Reddy',
  'Iyer',
  'Nair',
  'Verma',
  'Prakash',
  'Menon',
  'Joshi',
  'Kapoor',
  'Rao',
  'Pillai',
  'Desai',
  'Malhotra',
  'Saxena',
  'Chauhan',
  'Khan'];

  const icseSubjects = subjectCodesDB.filter((s) => s.board === 'ICSE');
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const studentSubjects: StudentSubmissionData['subjects'] = [];
    const validationErrors: ValidationError[] = [];
    const validationWarnings: ValidationError[] = [];
    const selectedSubjects = icseSubjects.slice(
      0,
      6 + Math.floor(Math.random() * 2)
    );
    for (const subj of selectedSubjects) {
      const hasError = Math.random() < 0.1;
      const hasMissing = Math.random() < 0.08;
      const hasWarning = Math.random() < 0.15;
      let internalMarks: number | null =
      Math.round(Math.random() * 20 * 10) / 10;
      let theoryMarks: number | null =
      Math.round((30 + Math.random() * 50) * 10) / 10;
      let practicalMarks: number | null = subj.hasPractical ?
      Math.round((15 + Math.random() * 15) * 10) / 10 :
      null;
      const subjectErrors: string[] = [];
      const subjectWarnings: string[] = [];
      if (hasMissing) {
        if (Math.random() < 0.5) {
          internalMarks = null;
          subjectErrors.push('Internal marks missing');
          validationErrors.push({
            studentId: `STU${String(i + 1).padStart(3, '0')}`,
            studentName: `${firstName} ${lastName}`,
            rollNo: String(i + 1).padStart(2, '0'),
            subject: subj.name,
            errorType: 'critical',
            category: 'marks',
            description: 'Internal assessment marks are missing',
            field: 'Internal Marks'
          });
        } else {
          theoryMarks = null;
          subjectErrors.push('Theory marks missing');
          validationErrors.push({
            studentId: `STU${String(i + 1).padStart(3, '0')}`,
            studentName: `${firstName} ${lastName}`,
            rollNo: String(i + 1).padStart(2, '0'),
            subject: subj.name,
            errorType: 'critical',
            category: 'marks',
            description: 'Theory marks are missing',
            field: 'Theory Marks'
          });
        }
      }
      if (hasError && !hasMissing) {
        if (Math.random() < 0.5) {
          internalMarks = 25;
          subjectErrors.push('Internal marks exceed maximum (20)');
          validationErrors.push({
            studentId: `STU${String(i + 1).padStart(3, '0')}`,
            studentName: `${firstName} ${lastName}`,
            rollNo: String(i + 1).padStart(2, '0'),
            subject: subj.name,
            errorType: 'critical',
            category: 'marks',
            description: 'Internal marks exceed maximum allowed value of 20',
            field: 'Internal Marks'
          });
        }
      }
      if (hasWarning && !hasError && !hasMissing) {
        if (theoryMarks !== null && theoryMarks < subj.passingMarks) {
          subjectWarnings.push('Marks below passing threshold');
          validationWarnings.push({
            studentId: `STU${String(i + 1).padStart(3, '0')}`,
            studentName: `${firstName} ${lastName}`,
            rollNo: String(i + 1).padStart(2, '0'),
            subject: subj.name,
            errorType: 'warning',
            category: 'marks',
            description: 'Theory marks are below the passing threshold',
            field: 'Theory Marks'
          });
        }
      }
      let totalMarks: number | null = null;
      if (internalMarks !== null && theoryMarks !== null) {
        totalMarks =
        Math.round(
          (internalMarks + theoryMarks + (practicalMarks || 0)) * 10
        ) / 10;
      }
      let status: 'valid' | 'missing' | 'invalid' | 'warning' = 'valid';
      if (subjectErrors.length > 0) {
        status = subjectErrors.some((e) => e.includes('missing')) ?
        'missing' :
        'invalid';
      } else if (subjectWarnings.length > 0) {
        status = 'warning';
      }
      studentSubjects.push({
        code: subj.code,
        name: subj.name,
        internalMarks,
        theoryMarks,
        practicalMarks,
        totalMarks,
        grade: totalMarks ? calculateGrade(totalMarks) : '-',
        status,
        errors: subjectErrors,
        warnings: subjectWarnings
      });
    }
    let overallStatus: 'valid' | 'has-warnings' | 'has-errors' | 'incomplete' =
    'valid';
    if (validationErrors.length > 0) {
      overallStatus = validationErrors.some((e) =>
      e.description.includes('missing')
      ) ?
      'incomplete' :
      'has-errors';
    } else if (validationWarnings.length > 0) {
      overallStatus = 'has-warnings';
    }
    students.push({
      id: `STU${String(i + 1).padStart(3, '0')}`,
      rollNo: String(i + 1).padStart(2, '0'),
      boardRollNo: `ICSE2024${String(1000 + i)}`,
      name: `${firstName} ${lastName}`,
      dateOfBirth: `200${8 + Math.floor(Math.random() * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() < 0.5 ? 'M' : 'F',
      category: ['General', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
      stream: ['Science', 'Commerce', 'Arts'][Math.floor(Math.random() * 3)],
      subjects: studentSubjects,
      overallStatus,
      validationErrors,
      validationWarnings
    });
  }
  return students;
};
const generateExportHistory = (): ExportHistoryRecord[] => {
  const records: ExportHistoryRecord[] = [];
  const statuses: ExportHistoryRecord['status'][] = [
  'generated',
  'submitted',
  'accepted',
  'rejected',
  'corrected'];

  const submissionTypes = [
  'Internal Marks Upload',
  'Theory Marks Upload',
  'Practical Marks Upload',
  'Student Registration File'];

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    records.push({
      id: `EXP${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      generatedBy: ['Admin', 'Examination Incharge', 'Principal'][
      Math.floor(Math.random() * 3)],

      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      class: 'Class 10',
      section: ['A', 'B', 'C', 'All'][Math.floor(Math.random() * 4)],
      examType: 'Annual Examination',
      submissionType:
      submissionTypes[Math.floor(Math.random() * submissionTypes.length)],
      recordCount: 20 + Math.floor(Math.random() * 30),
      fileVersion: `v${i + 1}.0`,
      fileHashId: `SHA256:${Math.random().toString(36).substring(2, 15)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      fileName: `CISCE_ICSE_2024_25_Export_${i + 1}.csv`,
      fileSize: `${(Math.random() * 500 + 50).toFixed(1)} KB`,
      validRecords: 18 + Math.floor(Math.random() * 10),
      errorRecords: Math.floor(Math.random() * 3),
      warningRecords: Math.floor(Math.random() * 5)
    });
  }
  return records;
};
const calculateGrade = (marks: number): string => {
  if (marks >= 91) return 'A1';
  if (marks >= 81) return 'A2';
  if (marks >= 71) return 'B1';
  if (marks >= 61) return 'B2';
  if (marks >= 51) return 'C1';
  if (marks >= 41) return 'C2';
  if (marks >= 33) return 'D';
  return 'E';
};
// ========== REUSABLE COMPONENTS ==========
function Card({
  children,
  className = '',
  title,
  headerAction,
  noPadding = false






}: {children: React.ReactNode;className?: string;title?: string;headerAction?: React.ReactNode;noPadding?: boolean;}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>

      {title &&
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {headerAction}
        </div>
      }
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>);

}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick















}: {children: React.ReactNode;variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost' | 'warning';size?: 'sm' | 'md' | 'lg';disabled?: boolean;loading?: boolean;className?: string;onClick?: () => void;}) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}>

      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>);

}
function Badge({
  children,
  variant = 'default',
  className = ''




}: {children: React.ReactNode;variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';className?: string;}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-indigo-100 text-indigo-700'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>

      {children}
    </span>);

}
function Select({
  label,
  options,
  value,
  onChange,
  className = '',
  disabled = false,
  multiple = false











}: {label?: string;options: {value: string;label: string;}[];value: string | string[];onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;className?: string;disabled?: boolean;multiple?: boolean;}) {
  return (
    <div className={className}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <select
        value={value as string}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">

        {options.map((opt) =>
        <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )}
      </select>
    </div>);

}
function Checkbox({
  checked,
  onChange,
  label,
  disabled = false





}: {checked: boolean;onChange: (checked: boolean) => void;label?: string;disabled?: boolean;}) {
  return (
    <label
      className={`inline-flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>);

}
function Tooltip({
  children,
  content



}: {children: React.ReactNode;content: string;}) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>);

}
function ProgressBar({
  value,
  max,
  color = 'bg-blue-500',
  size = 'sm',
  showLabel = false,
  animated = false







}: {value: number;max: number;color?: string;size?: 'xs' | 'sm' | 'md';showLabel?: boolean;animated?: boolean;}) {
  const percentage = Math.min(value / max * 100, 100);
  const heights = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3'
  };
  return (
    <div className="w-full">
      <div
        className={`${heights[size]} bg-gray-200 rounded-full overflow-hidden`}>

        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
          style={{
            width: `${percentage}%`
          }} />

      </div>
      {showLabel &&
      <p className="text-xs text-gray-500 mt-1 text-right">
          {percentage.toFixed(1)}%
        </p>
      }
    </div>);

}
function StatusIcon({
  status









}: {status: 'valid' | 'has-warnings' | 'has-errors' | 'incomplete' | 'missing' | 'invalid' | 'warning';}) {
  switch (status) {
    case 'valid':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'has-warnings':
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'has-errors':
    case 'invalid':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'incomplete':
    case 'missing':
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
}
function Tab({
  label,
  active,
  onClick,
  icon: Icon,
  badge








}: {label: string;active: boolean;onClick: () => void;icon?: ComponentType<{className?: string;}>;badge?: number;}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

      {Icon && <Icon className="w-4 h-4" />}
      {label}
      {badge !== undefined && badge > 0 &&
      <span
        className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>

          {badge}
        </span>
      }
    </button>);

}
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue









}: {title: string;value: number | string;icon: ComponentType<{className?: string;}>;color: 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'purple';trend?: 'up' | 'down';trendValue?: string;}) {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 border-blue-100',
    green: 'from-green-50 to-emerald-50 border-green-100',
    yellow: 'from-yellow-50 to-amber-50 border-yellow-100',
    red: 'from-red-50 to-rose-50 border-red-100',
    orange: 'from-orange-50 to-amber-50 border-orange-100',
    purple: 'from-purple-50 to-indigo-50 border-purple-100'
  };
  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };
  const valueColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  };
  return (
    <Card className={`p-4 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColors[color]}`}>
            {value}
          </p>
          {trend && trendValue &&
          <div
            className={`flex items-center gap-1 mt-1 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>

              {trend === 'up' ?
            <ArrowUpRight className="w-3 h-3" /> :

            <ArrowDownRight className="w-3 h-3" />
            }
              {trendValue}
            </div>
          }
        </div>
        <div className={`p-3 rounded-xl ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>);

}
// ========== MAIN COMPONENT ==========
export function CISCEBoardSubmissionExport() {
  // State
  const [activeTab, setActiveTab] = useState<
    'filters' | 'validation' | 'preview' | 'history'>(
    'filters');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['10']);
  const [selectedSection, setSelectedSection] = useState('all');
  const [examType, setExamType] = useState('annual');
  const [submissionType, setSubmissionType] = useState('internal-marks');
  const [studentsData, setStudentsData] = useState<StudentSubmissionData[]>(
    () => generateMockSubmissionData()
  );
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>(
    () => generateExportHistory()
  );
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [expandedErrorRow, setExpandedErrorRow] = useState<string | null>(null);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    includeHeaders: true,
    includeGrades: true,
    includeRemarks: false,
    separateInternal: true,
    encoding: 'utf-8',
    delimiter: ','
  });
  // Computed Values
  const allValidationErrors = useMemo(() => {
    return studentsData.flatMap((s) => s.validationErrors);
  }, [studentsData]);
  const allValidationWarnings = useMemo(() => {
    return studentsData.flatMap((s) => s.validationWarnings);
  }, [studentsData]);
  const validationStats = useMemo(() => {
    const valid = studentsData.filter((s) => s.overallStatus === 'valid').length;
    const warnings = studentsData.filter(
      (s) => s.overallStatus === 'has-warnings'
    ).length;
    const errors = studentsData.filter(
      (s) => s.overallStatus === 'has-errors'
    ).length;
    const incomplete = studentsData.filter(
      (s) => s.overallStatus === 'incomplete'
    ).length;
    return {
      valid,
      warnings,
      errors,
      incomplete,
      total: studentsData.length
    };
  }, [studentsData]);
  const canExport = useMemo(() => {
    return (
      validationStats.errors === 0 &&
      validationStats.incomplete === 0 &&
      validationComplete);

  }, [validationStats, validationComplete]);
  const previewData = useMemo(() => {
    return studentsData.
    filter(
      (s) =>
      s.overallStatus === 'valid' || s.overallStatus === 'has-warnings'
    ).
    slice(0, 5);
  }, [studentsData]);
  // Handlers
  const handleValidation = async () => {
    setIsValidating(true);
    setValidationComplete(false);
    // Simulate validation process
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsValidating(false);
    setValidationComplete(true);
    setActiveTab('validation');
  };
  const handleGenerate = async () => {
    if (!canExport) {
      setActiveTab('validation');
      return;
    }
    setIsGenerating(true);
    setGenerationProgress(0);
    // Simulate generation progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGenerationProgress(i);
    }
    setIsGenerating(false);
    setShowDownloadConfirm(true);
  };
  const handleDownload = () => {
    // Generate file content
    const dataToExport = studentsData.filter(
      (s) => s.overallStatus === 'valid' || s.overallStatus === 'has-warnings'
    );
    let content = '';
    let filename = `CISCE_${academicYear.replace('-', '_')}_${submissionType.replace('-', '_')}`;
    if (exportConfig.format === 'csv') {
      const headers = boardFormatConfig.requiredColumnOrder.join(
        exportConfig.delimiter
      );
      content = headers + '\n';
      dataToExport.forEach((student) => {
        student.subjects.forEach((subject) => {
          const row = [
          student.boardRollNo,
          student.name,
          student.dateOfBirth,
          student.gender,
          student.category,
          subject.code,
          String(subject.internalMarks ?? ''),
          String(subject.theoryMarks ?? ''),
          String(subject.practicalMarks ?? ''),
          String(subject.totalMarks ?? ''),
          subject.grade];

          content += row.join(exportConfig.delimiter) + '\n';
        });
      });
      filename += '.csv';
    } else if (exportConfig.format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      filename += '.json';
    }
    // Download file
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // Add to history
    const newRecord: ExportHistoryRecord = {
      id: `EXP${String(exportHistory.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      generatedBy: 'Admin',
      ipAddress: '192.168.1.100',
      class: `Class ${selectedClasses.join(', ')}`,
      section: selectedSection,
      examType: examType === 'annual' ? 'Annual Examination' : examType,
      submissionType: submissionType.
      split('-').
      map((w) => w.charAt(0).toUpperCase() + w.slice(1)).
      join(' '),
      recordCount: dataToExport.length,
      fileVersion: 'v1.0',
      fileHashId: `SHA256:${Math.random().toString(36).substring(2, 15)}`,
      status: 'generated',
      fileName: filename,
      fileSize: `${(content.length / 1024).toFixed(1)} KB`,
      validRecords: validationStats.valid,
      errorRecords: validationStats.errors,
      warningRecords: validationStats.warnings
    };
    setExportHistory([newRecord, ...exportHistory]);
    setShowDownloadConfirm(false);
  };
  const handleResetFilters = () => {
    setAcademicYear('2024-2025');
    setSelectedClasses(['10']);
    setSelectedSection('all');
    setExamType('annual');
    setSubmissionType('internal-marks');
    setValidationComplete(false);
  };
  const getSubmissionStatusBadge = (status: ExportHistoryRecord['status']) => {
    const statusConfig: Record<
      ExportHistoryRecord['status'],
      {
        variant: 'success' | 'warning' | 'danger' | 'info' | 'default';
        label: string;
      }> =
    {
      generated: {
        variant: 'info',
        label: 'Generated'
      },
      submitted: {
        variant: 'warning',
        label: 'Submitted'
      },
      accepted: {
        variant: 'success',
        label: 'Accepted'
      },
      rejected: {
        variant: 'danger',
        label: 'Rejected'
      },
      corrected: {
        variant: 'primary' as any,
        label: 'Corrected & Resubmitted'
      }
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Examination</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Board Submission</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">CISCE Export</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
              <CloudUpload className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CISCE Board Submission Export
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Generate official board-compliant export files for ICSE/ISC
                submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="info" className="px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Board: CISCE
            </Badge>
            <Badge variant="default" className="px-3 py-1">
              <Lock className="w-3 h-3 mr-1" />
              Role: Examination Incharge
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card noPadding>
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-4">
              <Tab
                label="Filters"
                active={activeTab === 'filters'}
                onClick={() => setActiveTab('filters')}
                icon={Filter} />

              <Tab
                label="Validation"
                active={activeTab === 'validation'}
                onClick={() => setActiveTab('validation')}
                icon={ShieldCheck}
                badge={allValidationErrors.length} />

              <Tab
                label="Preview"
                active={activeTab === 'preview'}
                onClick={() => setActiveTab('preview')}
                icon={Eye} />

              <Tab
                label="History"
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                icon={History} />

            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* ========== FILTERS TAB ========== */}
            {activeTab === 'filters' &&
            <div className="space-y-6">
                {/* Header & Filter Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Filter & Selection
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Board Name
                      </label>
                      <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium">
                        CISCE (ICSE/ISC)
                      </div>
                    </div>
                    <Select
                    label="Academic Year"
                    options={[
                    {
                      value: '2023-2024',
                      label: '2023-2024'
                    },
                    {
                      value: '2024-2025',
                      label: '2024-2025'
                    },
                    {
                      value: '2025-2026',
                      label: '2025-2026'
                    }]
                    }
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)} />

                    <Select
                    label="Class / Standard"
                    options={[
                    {
                      value: '10',
                      label: 'Class 10 (ICSE)'
                    },
                    {
                      value: '12',
                      label: 'Class 12 (ISC)'
                    }]
                    }
                    value={selectedClasses[0]}
                    onChange={(e) => setSelectedClasses([e.target.value])} />

                    <Select
                    label="Section"
                    options={[
                    {
                      value: 'all',
                      label: 'All Sections'
                    },
                    {
                      value: 'A',
                      label: 'Section A'
                    },
                    {
                      value: 'B',
                      label: 'Section B'
                    },
                    {
                      value: 'C',
                      label: 'Section C'
                    },
                    {
                      value: 'D',
                      label: 'Section D'
                    }]
                    }
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)} />

                    <Select
                    label="Exam Type"
                    options={[
                    {
                      value: 'annual',
                      label: 'Annual Examination'
                    },
                    {
                      value: 'compartment',
                      label: 'Compartment Exam'
                    },
                    {
                      value: 'improvement',
                      label: 'Improvement Exam'
                    },
                    {
                      value: 'supplementary',
                      label: 'Supplementary Exam'
                    }]
                    }
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)} />

                    <Select
                    label="Submission Type"
                    options={[
                    {
                      value: 'internal-marks',
                      label: 'Internal Marks Upload'
                    },
                    {
                      value: 'theory-marks',
                      label: 'Theory Marks Upload'
                    },
                    {
                      value: 'practical-marks',
                      label: 'Practical Marks Upload'
                    },
                    {
                      value: 'attendance',
                      label: 'Attendance Data'
                    },
                    {
                      value: 'subject-mapping',
                      label: 'Subject Mapping File'
                    },
                    {
                      value: 'student-registration',
                      label: 'Student Registration File'
                    },
                    {
                      value: 'result-declaration',
                      label: 'Result Declaration File'
                    }]
                    }
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value)} />

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={handleResetFilters}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                    <Button
                    variant="outline"
                    onClick={() => setShowPreviewModal(true)}>

                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                    variant="primary"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={!canExport}>

                      <Download className="w-4 h-4 mr-2" />
                      Generate Export
                    </Button>
                  </div>
                </div>

                {/* Board Format Configuration Panel */}
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-100 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Settings className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Board Format Configuration
                        </h3>
                        <p className="text-xs text-gray-500">
                          System-controlled rules (Read-only)
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">
                      <Lock className="w-3 h-3 mr-1" />
                      Read Only
                    </Badge>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Required Fields */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-blue-500" />
                        Required Fields
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {boardFormatConfig.requiredFields.map((field, idx) =>
                      <Badge key={idx} variant="info" className="text-xs">
                            {field}
                          </Badge>
                      )}
                      </div>
                    </div>

                    {/* Mandatory Subject Codes */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-500" />
                        Mandatory Subject Codes
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {boardFormatConfig.mandatorySubjectCodes.map(
                        (code, idx) =>
                        <Badge
                          key={idx}
                          variant="success"
                          className="font-mono text-xs">

                              {code}
                            </Badge>

                      )}
                      </div>
                    </div>

                    {/* Maximum Marks Rules */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        Maximum Marks Rules
                      </h4>
                      <div className="space-y-1 text-sm">
                        {boardFormatConfig.maxMarksRules.map((rule, idx) =>
                      <div key={idx} className="flex justify-between">
                            <span className="text-gray-600">
                              {rule.subject}
                            </span>
                            <span className="font-medium text-gray-900">
                              {rule.max}
                            </span>
                          </div>
                      )}
                      </div>
                    </div>

                    {/* Grade Conversion Rules */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        Grade Conversion Rules
                      </h4>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        {boardFormatConfig.gradeConversionRules.map(
                        (rule, idx) =>
                        <div
                          key={idx}
                          className="text-center p-1 bg-gray-50 rounded">

                              <div className="font-bold text-gray-900">
                                {rule.grade}
                              </div>
                              <div className="text-gray-500">
                                {rule.minMarks}-{rule.maxMarks}
                              </div>
                            </div>

                      )}
                      </div>
                    </div>

                    {/* File Format Requirement */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        File Format Requirement
                      </h4>
                      <p className="text-sm text-gray-700 font-medium">
                        {boardFormatConfig.fileFormat}
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p>• Encoding: UTF-8</p>
                        <p>• Max Size: 10MB</p>
                        <p>• Delimiter: Comma (,)</p>
                      </div>
                    </div>

                    {/* Character Limits */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-red-500" />
                        Character Limits
                      </h4>
                      <div className="space-y-1 text-sm">
                        {boardFormatConfig.characterLimits.map((limit, idx) =>
                      <div key={idx} className="flex justify-between">
                            <span className="text-gray-600">{limit.field}</span>
                            <span className="font-medium text-gray-900">
                              {limit.limit} chars
                            </span>
                          </div>
                      )}
                      </div>
                    </div>

                    {/* Required Column Order */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2 lg:col-span-3">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Columns className="w-4 h-4 text-indigo-500" />
                        Required Column Order
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {boardFormatConfig.requiredColumnOrder.map(
                        (col, idx) =>
                        <Fragment key={idx}>
                              <Badge variant="default" className="text-xs">
                                {idx + 1}. {col}
                              </Badge>
                              {idx <
                          boardFormatConfig.requiredColumnOrder.length -
                          1 &&
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          }
                            </Fragment>

                      )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard
                  title="Total Students"
                  value={validationStats.total}
                  icon={Users}
                  color="blue" />

                  <StatCard
                  title="Valid Records"
                  value={validationStats.valid}
                  icon={CheckCircle2}
                  color="green" />

                  <StatCard
                  title="With Warnings"
                  value={validationStats.warnings}
                  icon={AlertTriangle}
                  color="yellow" />

                  <StatCard
                  title="With Errors"
                  value={validationStats.errors}
                  icon={XCircle}
                  color="red" />

                  <StatCard
                  title="Incomplete"
                  value={validationStats.incomplete}
                  icon={AlertCircle}
                  color="orange" />

                </div>

                {/* Validation CTA */}
                {!validationComplete &&
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Run Data Validation
                          </h3>
                          <p className="text-sm text-gray-600">
                            Validate all selected records before generating
                            export file
                          </p>
                        </div>
                      </div>
                      <Button
                    variant="primary"
                    onClick={handleValidation}
                    loading={isValidating}>

                        <Activity className="w-4 h-4 mr-2" />
                        Validate Now
                      </Button>
                    </div>
                    {isValidating &&
                <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Validating records...</span>
                          <span>Please wait</span>
                        </div>
                        <ProgressBar
                    value={60}
                    max={100}
                    color="bg-blue-500"
                    size="sm"
                    animated />

                      </div>
                }
                  </Card>
              }

                {/* Validation Complete Banner */}
                {validationComplete && canExport &&
              <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800">
                          Validation Passed
                        </h3>
                        <p className="text-sm text-green-700">
                          All records validated successfully. Ready to generate
                          export file.
                        </p>
                      </div>
                      <Button variant="success" onClick={handleGenerate}>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Export
                      </Button>
                    </div>
                  </Card>
              }

                {/* Validation Failed Banner */}
                {validationComplete && !canExport &&
              <Card className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <AlertOctagon className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800">
                          Export Blocked - Critical Errors Found
                        </h3>
                        <p className="text-sm text-red-700">
                          {validationStats.errors + validationStats.incomplete}{' '}
                          record(s) have critical errors that must be fixed
                          before export.
                        </p>
                      </div>
                      <Button
                    variant="danger"
                    onClick={() => setActiveTab('validation')}>

                        <Eye className="w-4 h-4 mr-2" />
                        View Errors
                      </Button>
                    </div>
                  </Card>
              }
              </div>
            }

            {/* ========== VALIDATION TAB ========== */}
            {activeTab === 'validation' &&
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Data Validation Engine
                    </h3>
                    <p className="text-sm text-gray-500">
                      Comprehensive validation of all selected records
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                    variant="outline"
                    onClick={handleValidation}
                    loading={isValidating}>

                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-validate
                    </Button>
                  </div>
                </div>

                {/* Validation Result Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                  title="Total Selected"
                  value={validationStats.total}
                  icon={Users}
                  color="blue" />

                  <StatCard
                  title="Valid Records"
                  value={validationStats.valid}
                  icon={CheckCircle2}
                  color="green" />

                  <StatCard
                  title="Error Records"
                  value={validationStats.errors + validationStats.incomplete}
                  icon={XCircle}
                  color="red" />

                  <StatCard
                  title="Warning Records"
                  value={validationStats.warnings}
                  icon={AlertTriangle}
                  color="yellow" />

                </div>

                {/* Validation Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Student-Level Validation */}
                  <Card className="bg-blue-50 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-blue-900">
                        Student-Level Validation
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Registration Number exists
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Board Roll Number mapped
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Date of Birth format correct
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Gender code valid
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Subject enrollment complete
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Category/Stream mapped
                      </li>
                    </ul>
                  </Card>

                  {/* Marks Validation */}
                  <Card className="bg-green-50 border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-900">
                        Marks Validation
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-center gap-2">
                        {allValidationErrors.filter(
                        (e) => e.category === 'marks'
                      ).length > 0 ?
                      <XCircle className="w-4 h-4 text-red-500" /> :

                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      }
                        Marks within defined maximum
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Absent value format correct
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Grace marks applied correctly
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Internal + Theory totals match
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Overall total calculation accurate
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Grade conversion accurate
                      </li>
                    </ul>
                  </Card>

                  {/* Subject Code Validation */}
                  <Card className="bg-purple-50 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-purple-900">
                        Subject Code Validation
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Subject codes match board master
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Elective subjects mapped correctly
                      </li>
                      <li className="flex items-center gap-2">
                        {allValidationErrors.filter(
                        (e) => e.category === 'subject'
                      ).length > 0 ?
                      <XCircle className="w-4 h-4 text-red-500" /> :

                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      }
                        No missing subject entries
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Practical/Theory split correct
                      </li>
                    </ul>
                  </Card>
                </div>

                {/* Error Log Table */}
                {allValidationErrors.length > 0 &&
              <Card
                title="Validation Errors"
                headerAction={
                <Badge variant="danger">
                        {allValidationErrors.length} Error(s)
                      </Badge>
                }
                noPadding>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-red-50 border-b border-red-100">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-red-700 uppercase">
                              Student
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-red-700 uppercase">
                              Subject
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-red-700 uppercase">
                              Error Type
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-red-700 uppercase">
                              Description
                            </th>
                            <th className="py-3 px-4 text-center text-xs font-semibold text-red-700 uppercase">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allValidationErrors.map((error, idx) =>
                      <tr
                        key={idx}
                        className="hover:bg-red-25 transition-colors">

                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {error.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Roll: {error.rollNo}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {error.subject}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                            variant={
                            error.errorType === 'critical' ?
                            'danger' :
                            'warning'
                            }>

                                  {error.errorType === 'critical' ?
                            'Critical' :
                            'Warning'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {error.description}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Fix
                                </Button>
                              </td>
                            </tr>
                      )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
              }

                {/* Warning Log Table */}
                {allValidationWarnings.length > 0 &&
              <Card
                title="Validation Warnings"
                headerAction={
                <Badge variant="warning">
                        {allValidationWarnings.length} Warning(s)
                      </Badge>
                }
                noPadding>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-yellow-50 border-b border-yellow-100">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-yellow-700 uppercase">
                              Student
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-yellow-700 uppercase">
                              Subject
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-yellow-700 uppercase">
                              Warning
                            </th>
                            <th className="py-3 px-4 text-center text-xs font-semibold text-yellow-700 uppercase">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allValidationWarnings.map((warning, idx) =>
                      <tr
                        key={idx}
                        className="hover:bg-yellow-25 transition-colors">

                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {warning.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Roll: {warning.rollNo}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {warning.subject}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {warning.description}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </td>
                            </tr>
                      )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
              }

                {/* All Valid Message */}
                {allValidationErrors.length === 0 && validationComplete &&
              <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      All Records Validated Successfully!
                    </h3>
                    <p className="text-green-600 mb-6">
                      No critical errors found.{' '}
                      {validationStats.warnings > 0 ?
                  `${validationStats.warnings} warnings to review.` :
                  'Ready for export.'}
                    </p>
                    <Button
                  variant="success"
                  onClick={() => setActiveTab('preview')}>

                      <Eye className="w-4 h-4 mr-2" />
                      Preview Export Data
                    </Button>
                  </Card>
              }
              </div>
            }

            {/* ========== PREVIEW TAB ========== */}
            {activeTab === 'preview' &&
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Export Preview
                    </h3>
                    <p className="text-sm text-gray-500">
                      Preview data exactly as it will appear in the export file
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Select
                    options={[
                    {
                      value: 'csv',
                      label: 'CSV Format'
                    },
                    {
                      value: 'excel',
                      label: 'Excel Format'
                    },
                    {
                      value: 'xml',
                      label: 'XML Format'
                    },
                    {
                      value: 'json',
                      label: 'JSON Format'
                    }]
                    }
                    value={exportConfig.format}
                    onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
                      format: e.target.value as any
                    })
                    } />

                    <Button
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={!canExport}
                    loading={isGenerating}>

                      <Download className="w-4 h-4 mr-2" />
                      Generate & Download
                    </Button>
                  </div>
                </div>

                {/* Export Format Section */}
                <Card title="Export Format Options">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                  {
                    value: 'csv',
                    label: 'CSV',
                    icon: FileText,
                    desc: 'Comma Separated Values'
                  },
                  {
                    value: 'excel',
                    label: 'Excel',
                    icon: FileSpreadsheet,
                    desc: 'Microsoft Excel Format'
                  },
                  {
                    value: 'xml',
                    label: 'XML',
                    icon: FileCode,
                    desc: 'Extensible Markup Language'
                  },
                  {
                    value: 'json',
                    label: 'JSON',
                    icon: FileJson,
                    desc: 'JavaScript Object Notation'
                  }].
                  map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() =>
                        setExportConfig({
                          ...exportConfig,
                          format: format.value as any
                        })
                        }
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${exportConfig.format === format.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>

                          <Icon
                          className={`w-8 h-8 ${exportConfig.format === format.value ? 'text-blue-600' : 'text-gray-400'}`} />

                          <span
                          className={`font-semibold ${exportConfig.format === format.value ? 'text-blue-600' : 'text-gray-700'}`}>

                            {format.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format.desc}
                          </span>
                        </button>);

                  })}
                  </div>

                  {exportConfig.format === 'csv' &&
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <Select
                    label="Delimiter"
                    options={[
                    {
                      value: ',',
                      label: 'Comma (,)'
                    },
                    {
                      value: ';',
                      label: 'Semicolon (;)'
                    },
                    {
                      value: '\t',
                      label: 'Tab'
                    },
                    {
                      value: '|',
                      label: 'Pipe (|)'
                    }]
                    }
                    value={exportConfig.delimiter}
                    onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
                      delimiter: e.target.value as any
                    })
                    } />

                      <Select
                    label="Encoding"
                    options={[
                    {
                      value: 'utf-8',
                      label: 'UTF-8'
                    },
                    {
                      value: 'ascii',
                      label: 'ASCII'
                    },
                    {
                      value: 'iso-8859-1',
                      label: 'ISO-8859-1'
                    }]
                    }
                    value={exportConfig.encoding}
                    onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
                      encoding: e.target.value as any
                    })
                    } />

                    </div>
                }

                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                    <Checkbox
                    checked={exportConfig.includeHeaders}
                    onChange={(checked) =>
                    setExportConfig({
                      ...exportConfig,
                      includeHeaders: checked
                    })
                    }
                    label="Include column headers" />

                    <Checkbox
                    checked={exportConfig.includeGrades}
                    onChange={(checked) =>
                    setExportConfig({
                      ...exportConfig,
                      includeGrades: checked
                    })
                    }
                    label="Include grade columns" />

                    <Checkbox
                    checked={exportConfig.separateInternal}
                    onChange={(checked) =>
                    setExportConfig({
                      ...exportConfig,
                      separateInternal: checked
                    })
                    }
                    label="Separate internal assessment columns" />

                  </div>
                </Card>

                {/* Preview Table */}
                <Card
                title="Data Preview (First 5 Records)"
                headerAction={<Badge variant="info">Sample Preview</Badge>}
                noPadding>

                  {/* Header Row Format */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Header Row Format
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {boardFormatConfig.requiredColumnOrder.map((col, idx) =>
                    <Badge
                      key={idx}
                      variant="default"
                      className="font-mono text-xs">

                          {col}
                        </Badge>
                    )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-50 border-b border-blue-100">
                        <tr>
                          <th className="py-3 px-3 text-left text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Board Roll No
                          </th>
                          <th className="py-3 px-3 text-left text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Name
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            DOB
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Gender
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Category
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Subject Code
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Internal
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Theory
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Practical
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Total
                          </th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-blue-700 whitespace-nowrap">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewData.map((student) =>
                      student.subjects.
                      slice(0, 2).
                      map((subject, subIdx) =>
                      <tr
                        key={`${student.id}-${subIdx}`}
                        className="hover:bg-gray-50">

                                <td className="py-2 px-3 font-mono text-xs text-blue-600">
                                  {student.boardRollNo}
                                </td>
                                <td className="py-2 px-3 font-medium text-gray-900 whitespace-nowrap">
                                  {student.name}
                                </td>
                                <td className="py-2 px-3 text-center text-gray-600">
                                  {student.dateOfBirth}
                                </td>
                                <td className="py-2 px-3 text-center text-gray-600">
                                  {student.gender}
                                </td>
                                <td className="py-2 px-3 text-center text-gray-600">
                                  {student.category}
                                </td>
                                <td className="py-2 px-3 text-center font-mono font-medium">
                                  {subject.code}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {subject.internalMarks ?? '-'}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {subject.theoryMarks ?? '-'}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {subject.practicalMarks ?? '-'}
                                </td>
                                <td className="py-2 px-3 text-center font-semibold">
                                  {subject.totalMarks ?? '-'}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${subject.grade === 'A1' || subject.grade === 'A2' ? 'bg-green-100 text-green-700' : subject.grade === 'B1' || subject.grade === 'B2' ? 'bg-blue-100 text-blue-700' : subject.grade === 'C1' || subject.grade === 'C2' ? 'bg-yellow-100 text-yellow-700' : subject.grade === 'D' ? 'bg-orange-100 text-orange-700' : subject.grade === 'E' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>

                                    {subject.grade}
                                  </span>
                                </td>
                              </tr>
                      )
                      )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
                    Showing 5 of{' '}
                    {
                  studentsData.filter(
                    (s) =>
                    s.overallStatus === 'valid' ||
                    s.overallStatus === 'has-warnings'
                  ).length
                  }{' '}
                    valid records
                  </div>
                </Card>

                {/* Preview Info */}
                <Card className="p-4 bg-blue-50 border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        Preview Matches Export Structure
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        The preview above exactly matches how the data will
                        appear in the final exported file. Column order,
                        formatting, and values are all aligned with CISCE
                        requirements.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            }

            {/* ========== HISTORY TAB ========== */}
            {activeTab === 'history' &&
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Export History & Audit Log
                    </h3>
                    <p className="text-sm text-gray-500">
                      Track all export activities and submission statuses
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Audit Log
                  </Button>
                </div>

                {/* History Table */}
                <Card noPadding>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Date & Time
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Class
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Exam
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Submission Type
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                            Records
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Generated By
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {exportHistory.map((record) =>
                      <Fragment key={record.id}>
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {record.date}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {record.time}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="text-gray-900">
                                    {record.class}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Section {record.section}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-700">
                                {record.examType}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="info">
                                  {record.submissionType}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {record.recordCount}
                                  </p>
                                  <div className="flex justify-center gap-2 text-xs">
                                    <span className="text-green-600">
                                      {record.validRecords}✓
                                    </span>
                                    {record.errorRecords > 0 &&
                                <span className="text-red-600">
                                        {record.errorRecords}✗
                                      </span>
                                }
                                    {record.warningRecords > 0 &&
                                <span className="text-yellow-600">
                                        {record.warningRecords}⚠
                                      </span>
                                }
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {getSubmissionStatusBadge(record.status)}
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="text-gray-900">
                                    {record.generatedBy}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {record.ipAddress}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1">
                                  <Tooltip content="Download">
                                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                      <Download className="w-4 h-4 text-gray-500" />
                                    </button>
                                  </Tooltip>
                                  <Tooltip content="View Log">
                                    <button
                                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                  onClick={() =>
                                  setExpandedErrorRow(
                                    expandedErrorRow === record.id ?
                                    null :
                                    record.id
                                  )
                                  }>

                                      {expandedErrorRow === record.id ?
                                  <ChevronUp className="w-4 h-4 text-gray-500" /> :

                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                  }
                                    </button>
                                  </Tooltip>
                                  <Tooltip content="Regenerate">
                                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                      <RefreshCw className="w-4 h-4 text-gray-500" />
                                    </button>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                            {expandedErrorRow === record.id &&
                        <tr className="bg-gray-50">
                                <td colSpan={8} className="p-4">
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                      Export Details
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-500">
                                          File Name
                                        </p>
                                        <p className="font-medium text-gray-900">
                                          {record.fileName}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">
                                          File Size
                                        </p>
                                        <p className="font-medium text-gray-900">
                                          {record.fileSize}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Version</p>
                                        <p className="font-medium text-gray-900">
                                          {record.fileVersion}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">
                                          File Hash
                                        </p>
                                        <p className="font-mono text-xs text-gray-900 truncate">
                                          {record.fileHashId}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                      <Button variant="outline" size="sm">
                                        <ScrollText className="w-4 h-4 mr-2" />
                                        View Validation Log
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Re-download File
                                      </Button>
                                      {record.status === 'rejected' &&
                                <Button variant="warning" size="sm">
                                          <RefreshCw className="w-4 h-4 mr-2" />
                                          Correct & Resubmit
                                        </Button>
                                }
                                    </div>
                                  </div>
                                </td>
                              </tr>
                        }
                          </Fragment>
                      )}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Audit Trail Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-green-50 border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Accepted Submissions
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {
                        exportHistory.filter((r) => r.status === 'accepted').
                        length
                        }
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-yellow-50 border-yellow-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Pending Submissions
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {
                        exportHistory.filter(
                          (r) =>
                          r.status === 'submitted' ||
                          r.status === 'generated'
                        ).length
                        }
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-red-50 border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Rejected Submissions
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {
                        exportHistory.filter((r) => r.status === 'rejected').
                        length
                        }
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }
          </div>
        </Card>

        {/* Help Section */}
        <Card className="p-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>Need Help?</strong> Contact CISCE support at{' '}
                <a href="mailto:support@cisce.org" className="underline">
                  support@cisce.org
                </a>{' '}
                or call 1800-XXX-XXXX for technical assistance with board
                submissions.
              </p>
            </div>
            <Button variant="outline" size="sm" className="bg-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              CISCE Portal
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}
export default CISCEBoardSubmissionExport;