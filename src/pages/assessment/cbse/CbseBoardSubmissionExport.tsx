import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings2,
  Eye,
  RefreshCcw,
  Search,
  Shield,
  Database,
  ClipboardCheck,
  FileCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Zap,
  Lock,
  Unlock,
  FileDown,
  Send,
  Clock,
  Target,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  Filter,
  RotateCcw,
  CheckCheck,
  XCircle,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  ArrowUpDown,
  MoreVertical,
  FileWarning,
  CircleDot,
  Check,
  X,
  Play,
  Pause,
  ListChecks,
  FileOutput,
  Printer,
  History,
  Building2,
  Hash,
  Type,
  Binary,
  CalendarDays,
  UserCheck,
  BookText,
  ClipboardList,
  Package,
  FileArchive,
  Globe,
  Server,
  Workflow,
  ArrowDownToLine,
  ShieldCheck,
  CircleAlert,
  TriangleAlert,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  BarChart3,
  FileJson,
  FileCode,
  Table,
  Key,
  Activity,
  Link,
  Loader2,
  FileX,
  AlertOctagon,
  UserX,
  BookX,
  Calculator,
  Award,
  Percent,
  Ban,
  RotateCw,
  FileSearch,
  Network,
  Fingerprint,
  MapPinned } from
'lucide-react';

// ==================== TYPE DEFINITIONS ====================

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
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subject?: string;
  subjectCode?: string;
  errorType: string;
  category: 'student' | 'marks' | 'subject';
  description: string;
  severity: ValidationSeverity;
  field: string;
  currentValue?: string;
  expectedValue?: string;
  fixable: boolean;
}

interface Student {
  id: string;
  registrationNo: string;
  boardRollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  stream?: string;
  pwdStatus: boolean;
  standard: number;
  section: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  result: 'Pass' | 'Fail' | 'Compartment';
  isValid: boolean;
  hasWarnings: boolean;
  errors: ValidationError[];
}

interface SubjectMarks {
  code: string;
  internalCode: string;
  name: string;
  type: 'Theory' | 'Practical' | 'Theory+Practical';
  theoryMax: number;
  theoryObtained: number | null;
  practicalMax: number;
  practicalObtained: number | null;
  internalMax: number;
  internalObtained: number | null;
  totalMax: number;
  totalObtained: number | null;
  grade: string | null;
  isAbsent: boolean;
  graceMarks: number;
}

interface BoardConfig {
  boardName: string;
  boardCode: string;
  requiredFields: string[];
  mandatorySubjectCodes: {code: string;name: string;}[];
  maxMarksRules: {
    theory: number;
    practical: number;
    internal: number;
    total: number;
  };
  gradeConversionRules: {minPercentage: number;maxPercentage: number;grade: string;}[];
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
  ipAddress: string;
}

// ==================== CONSTANTS ====================

const SUBMISSION_TYPES: {value: SubmissionType;label: string;icon: React.ElementType;description: string;}[] = [
{ value: 'internal_marks', label: 'Internal Marks Upload', icon: FileText, description: 'Upload internal assessment marks' },
{ value: 'theory_marks', label: 'Theory Marks Upload', icon: BookOpen, description: 'Upload theory examination marks' },
{ value: 'practical_marks', label: 'Practical Marks Upload', icon: Zap, description: 'Upload practical examination marks' },
{ value: 'attendance_data', label: 'Attendance Data', icon: Calendar, description: 'Upload student attendance records' },
{ value: 'subject_mapping', label: 'Subject Mapping File', icon: MapPin, description: 'Upload subject code mapping' },
{ value: 'student_registration', label: 'Student Registration File', icon: Users, description: 'Upload student registration data' },
{ value: 'result_declaration', label: 'Result Declaration File', icon: Award, description: 'Upload final result declaration' }];


const EXAM_TYPES = [
{ value: 'pre_board', label: 'Pre-Board Examination' },
{ value: 'board', label: 'Board Examination' },
{ value: 'supplementary', label: 'Supplementary Examination' },
{ value: 'improvement', label: 'Improvement Examination' },
{ value: 'compartment', label: 'Compartment Examination' }];


const ACADEMIC_YEARS = [
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


const CLASSES = [
{ value: 9, label: 'Class IX' },
{ value: 10, label: 'Class X (Board)' },
{ value: 11, label: 'Class XI' },
{ value: 12, label: 'Class XII (Board)' }];


const SECTIONS = ['A', 'B', 'C', 'D'];

// ==================== MOCK DATA GENERATORS ====================

const generateBoardConfig = (): BoardConfig => ({
  boardName: 'Central Board of Secondary Education',
  boardCode: 'CBSE',
  requiredFields: [
  'School Code', 'Board Roll Number', 'Student Name', 'Father Name',
  'Mother Name', 'Date of Birth', 'Gender', 'Category', 'PWD Status',
  'Subject Code', 'Subject Name', 'Theory Marks', 'Practical Marks',
  'Internal Marks', 'Total Marks', 'Grade', 'Result'],

  mandatorySubjectCodes: [
  { code: '184', name: 'English Core' },
  { code: '002', name: 'Hindi Core' },
  { code: '041', name: 'Mathematics' },
  { code: '086', name: 'Science' },
  { code: '087', name: 'Social Science' }],

  maxMarksRules: { theory: 80, practical: 20, internal: 20, total: 100 },
  gradeConversionRules: [
  { minPercentage: 91, maxPercentage: 100, grade: 'A1' },
  { minPercentage: 81, maxPercentage: 90, grade: 'A2' },
  { minPercentage: 71, maxPercentage: 80, grade: 'B1' },
  { minPercentage: 61, maxPercentage: 70, grade: 'B2' },
  { minPercentage: 51, maxPercentage: 60, grade: 'C1' },
  { minPercentage: 41, maxPercentage: 50, grade: 'C2' },
  { minPercentage: 33, maxPercentage: 40, grade: 'D' },
  { minPercentage: 0, maxPercentage: 32, grade: 'E (Fail)' }],

  practicalTheorySplit: { theory: 80, practical: 20 },
  fileFormatRequirement: ['csv', 'xlsx'],
  characterLimits: [
  { field: 'Student Name', maxLength: 50 },
  { field: 'Father Name', maxLength: 50 },
  { field: 'Mother Name', maxLength: 50 },
  { field: 'School Code', maxLength: 7 },
  { field: 'Subject Code', maxLength: 3 }],

  allowedValueRanges: [
  { field: 'Theory Marks', min: 0, max: 80 },
  { field: 'Practical Marks', min: 0, max: 20 },
  { field: 'Internal Marks', min: 0, max: 20 },
  { field: 'Total Marks', min: 0, max: 100 }],

  requiredColumnOrder: [
  'SCH_CODE', 'ROLL_NO', 'STU_NAME', 'FATHER_NAME', 'MOTHER_NAME',
  'DOB', 'GENDER', 'CATEGORY', 'PWD_FLAG', 'SUB_CODE', 'SUB_NAME',
  'THEORY_MRK', 'PRACT_MRK', 'IA_MRK', 'TOTAL_MRK', 'GRADE', 'RESULT'],

  absentValueFormat: 'AB',
  graceMarksAllowed: true,
  maxGraceMarks: 5
});

const generateMockStudents = (): Student[] => {
  const names = [
  { name: 'ADITYA VARDHAN SHARMA', father: 'RAJESH KUMAR SHARMA', mother: 'SUNITA SHARMA' },
  { name: 'ANANYA GUPTA', father: 'VIKRAM GUPTA', mother: 'NEHA GUPTA' },
  { name: 'RAHUL VERMA WITH EXTREMELY LONG NAME EXCEEDING LIMIT', father: 'MANPREET SINGH', mother: 'HARPREET KAUR' },
  { name: 'PRIYA PATEL', father: 'HITESH PATEL', mother: 'RINA PATEL' },
  { name: 'KAVYA REDDY', father: 'SURESH REDDY', mother: 'LAKSHMI REDDY' },
  { name: 'KRISHNA KUMAR', father: 'RAM KUMAR', mother: 'SITA DEVI' },
  { name: 'MEERA IYER', father: 'VENKATESH IYER', mother: 'SARASWATI IYER' },
  { name: 'ARJUN NAIR', father: 'KRISHNAN NAIR', mother: 'LAKSHMI NAIR' }];


  const subjects = [
  { code: '184', name: 'English Core', type: 'Theory' as const, hasPractical: false },
  { code: '002', name: 'Hindi Core', type: 'Theory' as const, hasPractical: false },
  { code: '041', name: 'Mathematics', type: 'Theory' as const, hasPractical: false },
  { code: '086', name: 'Science', type: 'Theory+Practical' as const, hasPractical: true },
  { code: '087', name: 'Social Science', type: 'Theory' as const, hasPractical: false },
  { code: '402', name: 'Information Technology', type: 'Theory+Practical' as const, hasPractical: true }];


  const students: Student[] = [];
  const genders: ('M' | 'F')[] = ['M', 'F'];
  const categories: ('GEN' | 'OBC' | 'SC' | 'ST' | 'EWS')[] = ['GEN', 'OBC', 'SC', 'ST', 'EWS'];

  names.forEach((nameData, idx) => {
    const studentSubjects: SubjectMarks[] = (idx === 3 ? subjects.slice(0, 2) : subjects).map((sub, subIdx) => {
      const theoryMax = sub.hasPractical ? 60 : 80;
      const practicalMax = sub.hasPractical ? 20 : 0;
      const internalMax = sub.hasPractical ? 0 : 20;

      const hasMarksError = idx === 2 && sub.code === '184';
      const isAbsent = idx === 5 && sub.code === '086';

      const theoryObtained = isAbsent ? null : hasMarksError ? 95 : Math.floor(Math.random() * (theoryMax - 30)) + 30;
      const practicalObtained = isAbsent ? null : sub.hasPractical ? Math.floor(Math.random() * 15) + 5 : null;
      const internalObtained = isAbsent ? null : !sub.hasPractical ? Math.floor(Math.random() * 15) + 5 : null;
      const totalObtained = (theoryObtained || 0) + (practicalObtained || 0) + (internalObtained || 0);

      const percentage = totalObtained / (theoryMax + practicalMax + internalMax) * 100;
      const grade = percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' :
      percentage >= 61 ? 'B2' : percentage >= 51 ? 'C1' : percentage >= 41 ? 'C2' :
      percentage >= 33 ? 'D' : 'E';

      return {
        code: sub.code,
        internalCode: `INT_${sub.code}`,
        name: sub.name,
        type: sub.type,
        theoryMax,
        theoryObtained,
        practicalMax,
        practicalObtained,
        internalMax,
        internalObtained,
        totalMax: theoryMax + practicalMax + internalMax,
        totalObtained: isAbsent ? null : totalObtained,
        grade: isAbsent ? null : grade,
        isAbsent,
        graceMarks: 0
      };
    });

    const totalMarks = studentSubjects.reduce((acc, sub) => acc + (sub.totalObtained || 0), 0);
    const maxMarks = studentSubjects.reduce((acc, sub) => acc + sub.totalMax, 0);
    const percentage = totalMarks / maxMarks * 100;

    const errors: ValidationError[] = [];

    // Name length error
    if (nameData.name.length > 50) {
      errors.push({
        id: `err-${idx}-name`,
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `2630001${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Character Limit Exceeded',
        category: 'student',
        description: `Student name exceeds 50 character limit (${nameData.name.length} chars)`,
        severity: 'error',
        field: 'name',
        currentValue: nameData.name,
        expectedValue: nameData.name.substring(0, 50),
        fixable: true
      });
    }

    // Marks error
    if (idx === 2) {
      errors.push({
        id: `err-${idx}-marks`,
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `2630001${String(idx + 1).padStart(3, '0')}`,
        subject: 'English Core',
        subjectCode: '184',
        errorType: 'Marks Exceed Maximum',
        category: 'marks',
        description: 'Theory marks (95) exceed maximum allowed (80)',
        severity: 'error',
        field: 'theoryMarks',
        currentValue: '95',
        expectedValue: '0-80',
        fixable: false
      });
    }

    // Missing roll number
    if (idx === 4) {
      errors.push({
        id: `err-${idx}-roll`,
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: '',
        errorType: 'Missing Board Roll Number',
        category: 'student',
        description: 'Board Roll Number is required but not mapped',
        severity: 'error',
        field: 'boardRollNo',
        fixable: false
      });
    }

    // Subject count error
    if (idx === 3) {
      errors.push({
        id: `err-${idx}-subjects`,
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `2630001${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Insufficient Subjects',
        category: 'subject',
        description: 'Only 2 subjects found, minimum 5 required',
        severity: 'error',
        field: 'subjects',
        currentValue: '2',
        expectedValue: '5+',
        fixable: false
      });
    }

    // Warning for low marks
    if (idx === 6) {
      errors.push({
        id: `err-${idx}-warning`,
        studentId: `STU${String(idx + 1).padStart(4, '0')}`,
        studentName: nameData.name,
        rollNo: `2630001${String(idx + 1).padStart(3, '0')}`,
        errorType: 'Low Performance Alert',
        category: 'marks',
        description: 'Student has borderline marks - verify before submission',
        severity: 'warning',
        field: 'totalMarks',
        fixable: false
      });
    }

    students.push({
      id: `STU${String(idx + 1).padStart(4, '0')}`,
      registrationNo: `REG2024${String(idx + 1).padStart(5, '0')}`,
      boardRollNo: idx === 4 ? '' : `2630001${String(idx + 1).padStart(3, '0')}`,
      name: nameData.name,
      fatherName: nameData.father,
      motherName: nameData.mother,
      dob: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2009`,
      gender: genders[idx % 2],
      category: categories[idx % 5],
      pwdStatus: idx === 5,
      standard: 10,
      section: SECTIONS[idx % 4],
      subjects: studentSubjects,
      totalMarks,
      maxMarks,
      percentage,
      grade: percentage >= 91 ? 'A1' : percentage >= 81 ? 'A2' : percentage >= 71 ? 'B1' :
      percentage >= 61 ? 'B2' : percentage >= 51 ? 'C1' : percentage >= 41 ? 'C2' :
      percentage >= 33 ? 'D' : 'E',
      result: percentage >= 33 ? 'Pass' : 'Fail',
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
  examType: 'Board Examination',
  submissionType: 'theory_marks',
  recordCount: 125,
  fileVersion: '1.0',
  fileHashId: 'SHA256:a1b2c3d4e5f6789...',
  status: 'accepted',
  fileName: 'CBSE_Class10_Theory_2024.csv',
  acknowledgmentNo: 'CBSE/2024/ACK/001234'
},
{
  id: 'EXP002',
  generatedBy: 'Exam Coordinator',
  dateTime: '2024-02-10 10:15:00',
  ipAddress: '192.168.1.105',
  classes: [10],
  examType: 'Board Examination',
  submissionType: 'internal_marks',
  recordCount: 125,
  fileVersion: '1.0',
  fileHashId: 'SHA256:b2c3d4e5f6789a...',
  status: 'submitted',
  fileName: 'CBSE_Class10_Internal_2024.csv'
},
{
  id: 'EXP003',
  generatedBy: 'Admin User',
  dateTime: '2024-02-05 16:45:00',
  ipAddress: '192.168.1.100',
  classes: [12],
  examType: 'Board Examination',
  submissionType: 'practical_marks',
  recordCount: 85,
  fileVersion: '1.0',
  fileHashId: 'SHA256:c3d4e5f6789ab...',
  status: 'rejected',
  fileName: 'CBSE_Class12_Practical_2024.csv',
  failureReason: 'Subject code mismatch for 3 students'
},
{
  id: 'EXP004',
  generatedBy: 'Admin User',
  dateTime: '2024-02-06 09:00:00',
  ipAddress: '192.168.1.100',
  classes: [12],
  examType: 'Board Examination',
  submissionType: 'practical_marks',
  recordCount: 85,
  fileVersion: '1.1',
  fileHashId: 'SHA256:d4e5f6789abc...',
  status: 'accepted',
  fileName: 'CBSE_Class12_Practical_2024_v2.csv',
  acknowledgmentNo: 'CBSE/2024/ACK/001198'
}];


// ==================== MAIN COMPONENT ====================

export function CBSEBoardSubmissionExport() {
  // ==================== STATE MANAGEMENT ====================

  const [boardConfig] = useState<BoardConfig>(generateBoardConfig());
  const [students, setStudents] = useState<Student[]>([]);
  const [exportHistory] = useState<ExportHistory[]>(generateExportHistory());

  // Tab State
  const [activeTab, setActiveTab] = useState<TabId>('filters');

  // Filter States
  const [academicYear, setAcademicYear] = useState<string>('2024-25');
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [examType, setExamType] = useState<string>('');
  const [submissionType, setSubmissionType] = useState<SubmissionType | ''>('');

  // Export States
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [validationProgress, setValidationProgress] = useState(0);

  // API States
  const [apiEnabled, setApiEnabled] = useState(false);

  // Config Panel State
  const [expandedConfigSections, setExpandedConfigSections] = useState<Set<string>>(new Set(['required', 'marks']));

  // Current User Role (mock)
  const currentUserRole: UserRole = 'admin';

  // ==================== COMPUTED VALUES ====================

  const validationSummary = useMemo(() => {
    const total = students.length;
    const valid = students.filter((s) => s.isValid && !s.hasWarnings).length;
    const invalid = students.filter((s) => !s.isValid).length;
    const warning = students.filter((s) => s.isValid && s.hasWarnings).length;
    const totalErrors = students.reduce((acc, s) => acc + s.errors.filter((e) => e.severity === 'error').length, 0);
    const totalWarnings = students.reduce((acc, s) => acc + s.errors.filter((e) => e.severity === 'warning').length, 0);
    const totalSubjects = students.reduce((acc, s) => acc + s.subjects.length, 0);
    const readyForExport = valid + warning;

    return { total, valid, invalid, warning, totalErrors, totalWarnings, totalSubjects, readyForExport };
  }, [students]);

  const allValidationErrors = useMemo(() => {
    return students.flatMap((s) => s.errors);
  }, [students]);

  const canExport = validationSummary.invalid === 0 && students.length > 0;

  // Role-based access check
  const hasEditAccess = ['admin', 'examination_incharge', 'principal'].includes(currentUserRole);

  // ==================== HANDLERS ====================

  const toggleConfigSection = (section: string) => {
    setExpandedConfigSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);else
      newSet.add(section);
      return newSet;
    });
  };

  const handleClassToggle = (classValue: number) => {
    setSelectedClasses((prev) =>
    prev.includes(classValue) ?
    prev.filter((c) => c !== classValue) :
    [...prev, classValue]
    );
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections((prev) =>
    prev.includes(section) ?
    prev.filter((s) => s !== section) :
    [...prev, section]
    );
  };

  const handleReset = () => {
    setSelectedClasses([]);
    setSelectedSections([]);
    setExamType('');
    setSubmissionType('');
    setStudents([]);
    setGenerationProgress(0);
    setValidationProgress(0);
  };

  const handleGenerate = useCallback(async () => {
    if (selectedClasses.length === 0 || !examType || !submissionType) {
      alert('Please select Class, Exam Type, and Submission Type');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStudents(generateMockStudents());
    setIsGenerating(false);
    setActiveTab('validation');

  }, [selectedClasses, examType, submissionType]);

  const handleRunValidation = useCallback(async () => {
    setIsValidating(true);
    setValidationProgress(0);

    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsValidating(false);
  }, []);

  const handleFixError = (studentId: string, field: string) => {
    setStudents((prev) => prev.map((student) => {
      if (student.id !== studentId) return student;

      let updated = { ...student };

      if (field === 'name' && student.name.length > 50) {
        updated.name = student.name.substring(0, 50);
        updated.errors = student.errors.filter((e) => e.field !== 'name');
      }

      updated.isValid = updated.errors.filter((e) => e.severity === 'error').length === 0;
      updated.hasWarnings = updated.errors.filter((e) => e.severity === 'warning').length > 0;

      return updated;
    }));
  };

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!canExport) {
      alert('Cannot export with validation errors. Please fix all issues first.');
      return;
    }

    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate export content
    const headers = boardConfig.requiredColumnOrder.join(',');
    let content = headers + '\n';

    students.filter((s) => s.isValid || s.hasWarnings).forEach((student) => {
      student.subjects.forEach((subject) => {
        const row = [
        '2630001',
        student.boardRollNo,
        `"${student.name}"`,
        `"${student.fatherName}"`,
        `"${student.motherName}"`,
        student.dob,
        student.gender,
        student.category,
        student.pwdStatus ? 'Y' : 'N',
        subject.code,
        `"${subject.name}"`,
        subject.theoryObtained ?? boardConfig.absentValueFormat,
        subject.practicalObtained ?? '',
        subject.internalObtained ?? '',
        subject.totalObtained ?? boardConfig.absentValueFormat,
        subject.grade ?? '',
        student.result].
        join(',');
        content += row + '\n';
      });
    });

    // Download
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CBSE_Export_${selectedClasses.join('-')}_${new Date().toISOString().slice(0, 10)}.${format}`;
    link.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
  }, [canExport, students, boardConfig, selectedClasses]);

  const handleDirectSubmit = () => {
    alert('This is a demo. In production, this would:\n\n1. Validate API token\n2. Submit data to CBSE portal\n3. Store acknowledgment number\n4. Log submission details');
  };

  const handlePreview = () => {
    if (students.length === 0) {
      alert('Please generate data first');
      return;
    }
    setActiveTab('preview');
  };

  const handleRedownload = (id: string) => {
    alert(`Downloading file for export ${id}`);
  };

  const handleViewLog = (id: string) => {
    alert(`Viewing log for export ${id}`);
  };

  const handleRegenerate = (id: string) => {
    alert(`Regenerating export ${id}`);
  };

  // ==================== STATUS CONFIG ====================

  const getStatusConfig = (status: SubmissionStatus) => {
    const configs = {
      generated: { label: 'Generated', bg: 'bg-gray-100', text: 'text-gray-700', icon: FileCheck },
      submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700', icon: Send },
      accepted: { label: 'Accepted', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      corrected_resubmitted: { label: 'Corrected', bg: 'bg-purple-100', text: 'text-purple-700', icon: RefreshCcw }
    };
    return configs[status];
  };

  // ==================== RENDER ====================

  // Access control
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
      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
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
              <Badge className={`px-3 py-1.5 ${hasEditAccess ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
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
                CBSE Portal
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mt-4 -mb-4">
            {[
            { id: 'filters' as TabId, label: 'Filters & Selection', icon: Filter },
            { id: 'validation' as TabId, label: 'Data Validation', icon: ClipboardCheck, badge: validationSummary.totalErrors > 0 ? validationSummary.totalErrors : undefined },
            { id: 'preview' as TabId, label: 'Preview Export', icon: Eye },
            { id: 'history' as TabId, label: 'Export History', icon: History, badge: exportHistory.length }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ?
              'border-orange-600 text-orange-600 bg-orange-50/50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
              }>

                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined &&
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              tab.id === 'validation' && tab.badge > 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`
              }>
                    {tab.badge}
                  </span>
              }
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ==================== FILTERS TAB ==================== */}
        {activeTab === 'filters' &&
        <>
            {/* Board Name - Read Only */}
            <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Selected Board</p>
                  <p className="text-lg font-bold text-orange-900">{boardConfig.boardName}</p>
                  <p className="text-sm text-orange-700">Board Code: {boardConfig.boardCode}</p>
                </div>
                <Lock className="w-4 h-4 text-orange-400" />
              </div>
            </Card>

            {/* Filter Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Select Data for Export</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Reset Filters
                </Button>
              </div>

              <div className="space-y-6">
                {/* Row 1: Academic Year & Exam Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">

                      {ACADEMIC_YEARS.map((year) =>
                    <option key={year.value} value={year.value}>{year.label}</option>
                    )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Exam Type <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">

                      <option value="">Select Exam Type</option>
                      {EXAM_TYPES.map((exam) =>
                    <option key={exam.value} value={exam.value}>{exam.label}</option>
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
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedClasses.includes(cls.value) ?
                    'border-orange-600 bg-orange-50 text-orange-700' :
                    'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                    }>

                        {selectedClasses.includes(cls.value) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
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
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedSections.includes(section) ?
                    'border-orange-600 bg-orange-50 text-orange-700' :
                    'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                    }>

                        {selectedSections.includes(section) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                        Section {section}
                      </button>
                  )}
                  </div>
                </div>

                {/* Submission Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Submission Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SUBMISSION_TYPES.map((type) =>
                  <button
                    key={type.value}
                    onClick={() => setSubmissionType(type.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                    submissionType === type.value ?
                    'border-orange-600 bg-orange-50' :
                    'border-gray-200 bg-white hover:border-gray-300'}`
                    }>

                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                      submissionType === type.value ? 'bg-orange-100' : 'bg-gray-100'}`
                      }>
                            <type.icon className={`w-5 h-5 ${
                        submissionType === type.value ? 'text-orange-600' : 'text-gray-500'}`
                        } />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                        submissionType === type.value ? 'text-orange-700' : 'text-gray-700'}`
                        }>{type.label}</p>
                            <p className="text-xs text-gray-500">{type.description}</p>
                          </div>
                        </div>
                      </button>
                  )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button variant="ghost" onClick={handleReset}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePreview} disabled={students.length === 0}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={selectedClasses.length === 0 || !examType || !submissionType}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">

                      <Zap className="w-4 h-4 mr-2" />
                      Generate Export Data
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating &&
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
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
                </div>
            }
            </Card>

            {/* Board Format Configuration Panel */}
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
                {/* Required Fields */}
                <ConfigSection
                id="required"
                title="Required Fields"
                icon={FileCheck}
                isExpanded={expandedConfigSections.has('required')}
                onToggle={() => toggleConfigSection('required')}>

                  <div className="flex flex-wrap gap-2">
                    {boardConfig.requiredFields.map((field) =>
                  <Badge key={field} className="bg-blue-100 text-blue-700 border border-blue-200">{field}</Badge>
                  )}
                  </div>
                </ConfigSection>

                {/* Mandatory Subject Codes */}
                <ConfigSection
                id="subjects"
                title="Mandatory Subject Codes"
                icon={BookOpen}
                isExpanded={expandedConfigSections.has('subjects')}
                onToggle={() => toggleConfigSection('subjects')}>

                  <div className="flex flex-wrap gap-2">
                    {boardConfig.mandatorySubjectCodes.map((sub) =>
                  <Badge key={sub.code} className="bg-purple-100 text-purple-700 border border-purple-200">
                        {sub.code} - {sub.name}
                      </Badge>
                  )}
                  </div>
                </ConfigSection>

                {/* Maximum Marks Rules */}
                <ConfigSection
                id="marks"
                title="Maximum Marks Rules"
                icon={Target}
                isExpanded={expandedConfigSections.has('marks')}
                onToggle={() => toggleConfigSection('marks')}>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">{boardConfig.maxMarksRules.theory}</p>
                      <p className="text-xs text-blue-600">Theory Max</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-700">{boardConfig.maxMarksRules.practical}</p>
                      <p className="text-xs text-purple-600">Practical Max</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-700">{boardConfig.maxMarksRules.internal}</p>
                      <p className="text-xs text-orange-600">Internal Max</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">{boardConfig.maxMarksRules.total}</p>
                      <p className="text-xs text-green-600">Total Max</p>
                    </div>
                  </div>
                </ConfigSection>

                {/* Grade Conversion Rules */}
                <ConfigSection
                id="grades"
                title="Grade Conversion Rules"
                icon={Award}
                isExpanded={expandedConfigSections.has('grades')}
                onToggle={() => toggleConfigSection('grades')}>

                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {boardConfig.gradeConversionRules.map((rule) =>
                  <div key={rule.grade} className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-700">{rule.grade}</p>
                        <p className="text-[10px] text-gray-500">{rule.minPercentage}-{rule.maxPercentage}%</p>
                      </div>
                  )}
                  </div>
                </ConfigSection>

                {/* File Format & Column Order */}
                <ConfigSection
                id="format"
                title="File Format & Column Order"
                icon={FileSpreadsheet}
                isExpanded={expandedConfigSections.has('format')}
                onToggle={() => toggleConfigSection('format')}>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Supported Formats:</span>
                      {boardConfig.fileFormatRequirement.map((format) =>
                    <Badge key={format} className="bg-green-100 text-green-700 border border-green-200">{format.toUpperCase()}</Badge>
                    )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Required Column Order:</p>
                      <div className="flex flex-wrap gap-1">
                        {boardConfig.requiredColumnOrder.map((col, idx) =>
                      <span key={col} className="inline-flex items-center text-xs">
                            <span className="px-2 py-1 bg-gray-100 rounded font-mono">{col}</span>
                            {idx < boardConfig.requiredColumnOrder.length - 1 &&
                        <ArrowRight className="w-3 h-3 text-gray-300 mx-1" />
                        }
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                </ConfigSection>

                {/* Character Limits */}
                <ConfigSection
                id="limits"
                title="Character Limits & Value Ranges"
                icon={Settings2}
                isExpanded={expandedConfigSections.has('limits')}
                onToggle={() => toggleConfigSection('limits')}>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {boardConfig.characterLimits.map((limit) =>
                  <div key={limit.field} className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">{limit.field}</p>
                        <p className="text-sm font-semibold text-gray-700">Max {limit.maxLength} chars</p>
                      </div>
                  )}
                    {boardConfig.allowedValueRanges.map((range) =>
                  <div key={range.field} className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">{range.field}</p>
                        <p className="text-sm font-semibold text-gray-700">{range.min} - {range.max}</p>
                      </div>
                  )}
                  </div>
                </ConfigSection>

                {/* Special Rules */}
                <ConfigSection
                id="special"
                title="Special Rules"
                icon={Sparkles}
                isExpanded={expandedConfigSections.has('special')}
                onToggle={() => toggleConfigSection('special')}>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Absent Value Format</span>
                      <Badge className="bg-blue-100 text-blue-700">{boardConfig.absentValueFormat}</Badge>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Grace Marks Allowed</span>
                      <Badge className={boardConfig.graceMarksAllowed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {boardConfig.graceMarksAllowed ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">Max Grace Marks</span>
                      <Badge className="bg-purple-100 text-purple-700">{boardConfig.maxGraceMarks}</Badge>
                    </div>
                  </div>
                </ConfigSection>
              </div>
            </Card>
          </>
        }

        {/* ==================== VALIDATION TAB ==================== */}
        {activeTab === 'validation' &&
        <>
            {students.length === 0 ?
          <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <Database className="w-10 h-10 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">No Data Generated</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Please go to Filters tab and generate export data first
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('filters')}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Go to Filters
                  </Button>
                </div>
              </Card> :

          <>
                {/* Validation Controls */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Data Validation Engine</h2>
                    <p className="text-sm text-gray-500">Validates all records against CBSE board requirements</p>
                  </div>
                  <Button
                variant="primary"
                onClick={handleRunValidation}
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
                        <div className="mt-2 h-2 bg-indigo-200 rounded-full overflow-hidden">
                          <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${validationProgress}%` }} />

                        </div>
                      </div>
                    </div>
                  </Card>
            }

                {/* Validation Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="p-4 border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Selected</p>
                        <p className="text-2xl font-bold text-gray-900">{validationSummary.total}</p>
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
                        <p className="text-2xl font-bold text-green-700">{validationSummary.valid}</p>
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
                        <p className="text-2xl font-bold text-red-700">{validationSummary.invalid}</p>
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
                        <p className="text-2xl font-bold text-amber-700">{validationSummary.warning}</p>
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
                {!canExport && validationSummary.totalErrors > 0 &&
            <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900">Export Blocked - Critical Errors Detected</p>
                        <p className="text-sm text-red-700 mt-1">
                          {validationSummary.totalErrors} critical error(s) must be resolved before export. 
                          Fix all errors in the table below to enable export functionality.
                        </p>
                      </div>
                    </div>
                  </Card>
            }

                {/* Validation Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ValidationCategory
                title="Student-Level Validation"
                icon={UserCheck}
                color="blue"
                items={[
                { label: 'Registration Number Exists', pass: true },
                { label: 'Board Roll Number Mapped', pass: validationSummary.invalid === 0 },
                { label: 'Date of Birth Format', pass: true },
                { label: 'Gender Code Valid', pass: true },
                { label: 'Subject Enrollment Complete', pass: validationSummary.invalid === 0 },
                { label: 'Category/Stream Mapping', pass: true }]
                } />


                  <ValidationCategory
                title="Marks Validation"
                icon={Calculator}
                color="purple"
                items={[
                { label: 'Marks Within Maximum', pass: validationSummary.invalid === 0 },
                { label: 'Absent Value Format', pass: true },
                { label: 'Grace Marks Applied', pass: true },
                { label: 'Theory + Internal Totals', pass: true },
                { label: 'Overall Calculation', pass: true },
                { label: 'Grade Conversion', pass: true }]
                } />


                  <ValidationCategory
                title="Subject Code Validation"
                icon={BookText}
                color="orange"
                items={[
                { label: 'Board-Approved Codes', pass: true },
                { label: 'Elective Subjects Mapped', pass: true },
                { label: 'No Missing Entries', pass: validationSummary.invalid === 0 }]
                } />

                </div>

                {/* Error Log Table */}
                {allValidationErrors.length > 0 &&
            <Card className="overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h4 className="font-bold text-gray-900">Validation Error Log</h4>
                        <Badge className="bg-red-100 text-red-700 border border-red-200">
                          {allValidationErrors.filter((e) => e.severity === 'error').length} Errors
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                          {allValidationErrors.filter((e) => e.severity === 'warning').length} Warnings
                        </Badge>
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
                          {allValidationErrors.map((error) =>
                    <tr key={error.id} className={`hover:bg-gray-50 ${error.severity === 'error' ? 'bg-red-50/50' : 'bg-amber-50/50'}`}>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {error.studentName.length > 25 ? error.studentName.substring(0, 25) + '...' : error.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500">Roll: {error.rollNo || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{error.subject || '—'}</td>
                              <td className="px-4 py-3">
                                <Badge className={error.severity === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}>
                                  {error.errorType}
                                </Badge>
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
                        <Button variant="outline" size="sm" onClick={() => handleFixError(error.studentId, error.field)}>
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
              </>
          }
          </>
        }

        {/* ==================== PREVIEW TAB ==================== */}
        {activeTab === 'preview' &&
        <>
            {students.length === 0 ?
          <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <Eye className="w-10 h-10 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">No Data to Preview</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Please go to Filters tab and generate export data first
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('filters')}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Go to Filters
                  </Button>
                </div>
              </Card> :

          <>
                {/* Export Format Selection */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Export Preview</h2>
                    <p className="text-sm text-gray-500">Preview data exactly as it will appear in the export file</p>
                  </div>
                  <div className="flex gap-2">
                    {boardConfig.fileFormatRequirement.map((format) =>
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  exportFormat === format ?
                  'border-orange-600 bg-orange-50 text-orange-700' :
                  'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                  }>

                        {format === 'csv' && <FileText className="w-4 h-4" />}
                        {format === 'xlsx' && <FileSpreadsheet className="w-4 h-4" />}
                        {format === 'xml' && <FileCode className="w-4 h-4" />}
                        {format === 'json' && <FileJson className="w-4 h-4" />}
                        {format.toUpperCase()}
                      </button>
                )}
                  </div>
                </div>

                {/* Header Row Format */}
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

                {/* Data Preview Table */}
                <Card className="overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">Sample Data Preview</h4>
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-200">First 5 Records</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Total: {validationSummary.readyForExport} records ready for export</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          {['SCH_CODE', 'ROLL_NO', 'STU_NAME', 'FATHER', 'DOB', 'GENDER', 'CAT', 'SUB_CODE', 'SUB_NAME', 'THEORY', 'PRACT', 'IA', 'TOTAL', 'GRADE', 'RESULT'].map((col) =>
                      <th key={col} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase whitespace-nowrap">{col}</th>
                      )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.filter((s) => s.isValid || s.hasWarnings).slice(0, 5).map((student) =>
                    student.subjects.slice(0, 2).map((subject, sIdx) =>
                    <tr key={`${student.id}-${sIdx}`} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-mono">2630001</td>
                              <td className="px-3 py-2 font-mono">{student.boardRollNo || <span className="text-red-500">MISSING</span>}</td>
                              <td className="px-3 py-2 font-medium truncate max-w-[150px]" title={student.name}>{student.name}</td>
                              <td className="px-3 py-2 truncate max-w-[100px]">{student.fatherName}</td>
                              <td className="px-3 py-2 font-mono">{student.dob}</td>
                              <td className="px-3 py-2 text-center">{student.gender}</td>
                              <td className="px-3 py-2 text-center">{student.category}</td>
                              <td className="px-3 py-2 font-mono">{subject.code}</td>
                              <td className="px-3 py-2 truncate max-w-[100px]">{subject.name}</td>
                              <td className="px-3 py-2 text-center">{subject.theoryObtained ?? 'AB'}</td>
                              <td className="px-3 py-2 text-center">{subject.practicalObtained ?? '-'}</td>
                              <td className="px-3 py-2 text-center">{subject.internalObtained ?? '-'}</td>
                              <td className="px-3 py-2 text-center font-bold">{subject.totalObtained ?? 'AB'}</td>
                              <td className="px-3 py-2 text-center">
                                <Badge className="bg-blue-100 text-blue-700">{subject.grade || '-'}</Badge>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <Badge className={student.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                  {student.result}
                                </Badge>
                              </td>
                            </tr>
                    )
                    )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
                    ... and {Math.max(0, validationSummary.readyForExport - 5)} more records
                  </div>
                </Card>

                {/* Export Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex gap-3">
                    {boardConfig.fileFormatRequirement.map((format) =>
                <Button
                  key={format}
                  variant="outline"
                  onClick={() => handleExport(format)}
                  disabled={!canExport || isExporting}
                  loading={isExporting && exportFormat === format}>

                        {format === 'csv' && <FileText className="w-4 h-4 mr-2" />}
                        {format === 'xlsx' && <FileSpreadsheet className="w-4 h-4 mr-2" />}
                        Download {format.toUpperCase()}
                      </Button>
                )}
                  </div>

                  {apiEnabled &&
              <Button
                variant="primary"
                size="lg"
                onClick={handleDirectSubmit}
                disabled={!canExport || isExporting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">

                      <Send className="w-4 h-4 mr-2" />
                      Direct API Submission
                    </Button>
              }
                </div>

                {/* Export Warning */}
                {!canExport &&
            <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-800">
                        <span className="font-bold">Export Disabled:</span> Fix all validation errors before downloading or submitting.
                      </p>
                    </div>
                  </Card>
            }

                {/* API Configuration */}
                <Card className="border-green-200 bg-green-50/30">
                  <div className="p-4 border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                          <Globe className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-900">Direct API Submission</h3>
                          <p className="text-sm text-green-700">Submit directly to CBSE portal</p>
                        </div>
                      </div>
                      <button
                    onClick={() => setApiEnabled(!apiEnabled)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${apiEnabled ? 'bg-green-600' : 'bg-gray-300'}`}>

                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${apiEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  {apiEnabled &&
              <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">API Endpoint</label>
                          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                            <Link className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 font-mono">api.cbse.nic.in/submit</span>
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
                            Direct API submission will immediately upload data to the CBSE portal. 
                            Ensure all validations pass before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
              }
                </Card>
              </>
          }
          </>
        }

        {/* ==================== HISTORY TAB ==================== */}
        {activeTab === 'history' &&
        <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Export & Submission History</h2>
                <p className="text-sm text-gray-500">Track all generated exports and their submission status</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Audit Log
              </Button>
            </div>

            <Card className="overflow-hidden">
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
                    {exportHistory.map((item) => {
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
                            <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Class {item.classes.join(', ')}</Badge>
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
                              <Button variant="ghost" size="sm" onClick={() => handleRedownload(item.id)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleViewLog(item.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {item.status === 'rejected' &&
                            <Button variant="ghost" size="sm" onClick={() => handleRegenerate(item.id)}>
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
                  <p className="text-gray-500">Last Generated By</p>
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
          </>
        }
      </div>

      {/* Sticky Generate Button */}
      {activeTab === 'filters' && selectedClasses.length > 0 && examType && submissionType &&
      <div className="fixed bottom-6 right-6 z-40">
          <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          loading={isGenerating}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/30">

            <Zap className="w-5 h-5 mr-2" />
            Generate Export Data
          </Button>
        </div>
      }
    </div>);

}

// ==================== HELPER COMPONENTS ====================

interface ConfigSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ id, title, icon: Icon, isExpanded, onToggle, children }) =>
<div className="border border-orange-100 rounded-lg bg-white overflow-hidden">
    <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-3 hover:bg-orange-50 transition-colors">

      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      {isExpanded ?
    <ChevronDown className="w-4 h-4 text-gray-400" /> :

    <ChevronRight className="w-4 h-4 text-gray-400" />
    }
    </button>
    {isExpanded &&
  <div className="p-3 pt-0 border-t border-orange-100">
        {children}
      </div>
  }
  </div>;


interface ValidationCategoryProps {
  title: string;
  icon: React.ElementType;
  color: 'blue' | 'purple' | 'orange';
  items: {label: string;pass: boolean;}[];
}

const ValidationCategory: React.FC<ValidationCategoryProps> = ({ title, icon: Icon, color, items }) => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${colors[color].bg}`}>
          <Icon className={`w-4 h-4 ${colors[color].text}`} />
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-2 text-sm">
        {items.map((item) =>
        <div key={item.label} className="flex items-center justify-between">
            <span className="text-gray-600">{item.label}</span>
            {item.pass ?
          <CheckCircle2 className="w-4 h-4 text-green-600" /> :

          <XCircle className="w-4 h-4 text-red-600" />
          }
          </div>
        )}
      </div>
    </Card>);

};

export default CBSEBoardSubmissionExport;