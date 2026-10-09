import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Save,
  Eye,
  X,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  Percent,
  Calculator,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Users,
  Calendar,
  Clock,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  ShieldCheck,
  History,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  ArrowUpDown,
  Loader2,
  RefreshCw,
  Trophy,
  BookText,
  Layers,
  ClipboardList,
  UserCheck,
  FileCheck,
  Send,
  Info,
  Hash,
  Building2,
  ListChecks,
  Sparkles,
  ArrowRight,
  Edit3,
  Trash2,
  Copy,
  ExternalLink } from
'lucide-react';

// ==================== TYPE DEFINITIONS ====================

interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: string;
  contact: string;
  email: string;
  address: string;
  photo?: string;
}

interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  cbseCode: string;
  subjectType: 'Main' | 'Language' | 'Elective' | 'Skill' | 'Additional';
  isSkillSubject: boolean;
  maxMarks: number;
  theoryMax: number;
  theoryObtained: number | null;
  internalMax: number;
  internalObtained: number | null;
  practicalMax: number;
  practicalObtained: number | null;
  totalObtained: number | null;
  grade: string | null;
  gradePoint: number | null;
  isPassed: boolean;
  isAbsent: boolean;
  remarks: string;
}

interface StudentResult {
  id: string;
  studentId: string;
  student: Student;
  classId: string;
  className: string;
  section: string;
  examId: string;
  examName: string;
  termId: string;
  termName: string;
  session: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  overallGrade: string;
  gradePoint: number;
  rank: number | null;
  result: 'PASS' | 'FAIL' | 'COMPARTMENT' | 'ABSENT' | 'PENDING';
  compartmentSubjects: string[];
  passedSubjects: number;
  failedSubjects: number;
  totalSubjects: number;
  bestFiveTotal: number;
  bestFivePercentage: number;
  isEligibleForPromotion: boolean;
  attendance: number;
  remarks: string;
  generatedAt: string | null;
  generatedBy: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  lockedAt: string | null;
  lockedBy: string | null;
  isLocked: boolean;
  isVerified: boolean;
  isPublished: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  displayName: string;
}

interface SectionOption {
  id: string;
  name: string;
  classId: string;
}

interface SubjectOption {
  id: string;
  name: string;
  code: string;
  cbseCode: string;
  type: string;
  classIds: string[];
}

interface ExamOption {
  id: string;
  name: string;
  type: string;
  termId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface TermOption {
  id: string;
  name: string;
  session: string;
  startDate: string;
  endDate: string;
}

interface GradeScale {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// ==================== MAIN COMPONENT ====================

export function CBSEResultGeneration() {
  // ==================== STATE MANAGEMENT ====================

  // Filter States
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterResult, setFilterResult] = useState<'all' | 'pass' | 'fail' | 'compartment' | 'pending' | 'absent'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'generated' | 'verified' | 'locked' | 'pending'>('all');

  // Selection States
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Modal States
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState<boolean>(false);
  const [previewStudent, setPreviewStudent] = useState<StudentResult | null>(null);

  // Processing States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sorting & Pagination
  const [sortField, setSortField] = useState<string>('rollNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Expanded Rows
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // ==================== STATIC DATA ====================

  // Grade Scale
  const gradeScale: GradeScale[] = [
  { grade: 'A1', minMarks: 91, maxMarks: 100, gradePoint: 10, description: 'Outstanding', color: 'text-emerald-700', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300' },
  { grade: 'A2', minMarks: 81, maxMarks: 90, gradePoint: 9, description: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { grade: 'B1', minMarks: 71, maxMarks: 80, gradePoint: 8, description: 'Very Good', color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { grade: 'B2', minMarks: 61, maxMarks: 70, gradePoint: 7, description: 'Good', color: 'text-sky-700', bgColor: 'bg-sky-100', borderColor: 'border-sky-300' },
  { grade: 'C1', minMarks: 51, maxMarks: 60, gradePoint: 6, description: 'Above Average', color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
  { grade: 'C2', minMarks: 41, maxMarks: 50, gradePoint: 5, description: 'Average', color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' },
  { grade: 'D', minMarks: 33, maxMarks: 40, gradePoint: 4, description: 'Below Average', color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-300' },
  { grade: 'E', minMarks: 0, maxMarks: 32, gradePoint: 0, description: 'Needs Improvement', color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-300' }];


  // Classes
  const classes: ClassOption[] = [
  { id: 'class-9', name: 'IX', displayName: 'Class IX' },
  { id: 'class-10', name: 'X', displayName: 'Class X' },
  { id: 'class-11', name: 'XI', displayName: 'Class XI' },
  { id: 'class-12', name: 'XII', displayName: 'Class XII' }];


  // Sections
  const sections: SectionOption[] = [
  { id: 'sec-9a', name: 'A', classId: 'class-9' },
  { id: 'sec-9b', name: 'B', classId: 'class-9' },
  { id: 'sec-9c', name: 'C', classId: 'class-9' },
  { id: 'sec-10a', name: 'A', classId: 'class-10' },
  { id: 'sec-10b', name: 'B', classId: 'class-10' },
  { id: 'sec-10c', name: 'C', classId: 'class-10' },
  { id: 'sec-11a', name: 'A', classId: 'class-11' },
  { id: 'sec-11b', name: 'B', classId: 'class-11' },
  { id: 'sec-12a', name: 'A', classId: 'class-12' },
  { id: 'sec-12b', name: 'B', classId: 'class-12' }];


  // Subjects
  const subjects: SubjectOption[] = [
  { id: 'sub-eng', name: 'English', code: 'ENG', cbseCode: '184', type: 'Language', classIds: ['class-9', 'class-10', 'class-11', 'class-12'] },
  { id: 'sub-hin', name: 'Hindi', code: 'HIN', cbseCode: '002', type: 'Language', classIds: ['class-9', 'class-10', 'class-11', 'class-12'] },
  { id: 'sub-math', name: 'Mathematics', code: 'MATH', cbseCode: '041', type: 'Main', classIds: ['class-9', 'class-10', 'class-11', 'class-12'] },
  { id: 'sub-sci', name: 'Science', code: 'SCI', cbseCode: '086', type: 'Main', classIds: ['class-9', 'class-10'] },
  { id: 'sub-sst', name: 'Social Science', code: 'SST', cbseCode: '087', type: 'Main', classIds: ['class-9', 'class-10'] },
  { id: 'sub-phy', name: 'Physics', code: 'PHY', cbseCode: '042', type: 'Main', classIds: ['class-11', 'class-12'] },
  { id: 'sub-chem', name: 'Chemistry', code: 'CHEM', cbseCode: '043', type: 'Main', classIds: ['class-11', 'class-12'] },
  { id: 'sub-bio', name: 'Biology', code: 'BIO', cbseCode: '044', type: 'Main', classIds: ['class-11', 'class-12'] },
  { id: 'sub-cs', name: 'Computer Science', code: 'CS', cbseCode: '083', type: 'Elective', classIds: ['class-11', 'class-12'] },
  { id: 'sub-it', name: 'Information Technology', code: 'IT', cbseCode: '402', type: 'Skill', classIds: ['class-9', 'class-10'] },
  { id: 'sub-ai', name: 'Artificial Intelligence', code: 'AI', cbseCode: '417', type: 'Skill', classIds: ['class-9', 'class-10'] }];


  // Terms
  const terms: TermOption[] = [
  { id: 'term-1', name: 'Term 1', session: '2024-25', startDate: '2024-04-01', endDate: '2024-09-30' },
  { id: 'term-2', name: 'Term 2', session: '2024-25', startDate: '2024-10-01', endDate: '2025-03-31' }];


  // Exams
  const exams: ExamOption[] = [
  { id: 'exam-ut1', name: 'Unit Test 1', type: 'Unit Test', termId: 'term-1', startDate: '2024-05-15', endDate: '2024-05-20', isActive: false },
  { id: 'exam-mid', name: 'Mid Term Examination', type: 'Term Exam', termId: 'term-1', startDate: '2024-09-01', endDate: '2024-09-15', isActive: false },
  { id: 'exam-ut2', name: 'Unit Test 2', type: 'Unit Test', termId: 'term-2', startDate: '2024-11-10', endDate: '2024-11-15', isActive: false },
  { id: 'exam-pre', name: 'Pre-Board Examination', type: 'Board Prep', termId: 'term-2', startDate: '2024-12-15', endDate: '2024-12-30', isActive: true },
  { id: 'exam-annual', name: 'Annual Examination', type: 'Final Exam', termId: 'term-2', startDate: '2025-02-15', endDate: '2025-03-15', isActive: true }];


  // Sample Students
  const studentsData: Student[] = [
  { id: 'std-001', rollNo: '01', admissionNo: 'DPS/2020/001', name: 'Aarav Sharma', fatherName: 'Rajesh Sharma', motherName: 'Priya Sharma', dob: '2009-05-15', gender: 'Male', category: 'General', contact: '9876543210', email: 'aarav@email.com', address: 'New Delhi' },
  { id: 'std-002', rollNo: '02', admissionNo: 'DPS/2020/002', name: 'Ananya Gupta', fatherName: 'Vikram Gupta', motherName: 'Neha Gupta', dob: '2009-08-22', gender: 'Female', category: 'General', contact: '9876543211', email: 'ananya@email.com', address: 'New Delhi' },
  { id: 'std-003', rollNo: '03', admissionNo: 'DPS/2020/003', name: 'Arjun Singh', fatherName: 'Manpreet Singh', motherName: 'Harpreet Kaur', dob: '2009-03-10', gender: 'Male', category: 'General', contact: '9876543212', email: 'arjun@email.com', address: 'New Delhi' },
  { id: 'std-004', rollNo: '04', admissionNo: 'DPS/2020/004', name: 'Diya Patel', fatherName: 'Hitesh Patel', motherName: 'Rina Patel', dob: '2009-11-05', gender: 'Female', category: 'OBC', contact: '9876543213', email: 'diya@email.com', address: 'New Delhi' },
  { id: 'std-005', rollNo: '05', admissionNo: 'DPS/2020/005', name: 'Ishaan Verma', fatherName: 'Ashok Verma', motherName: 'Sunita Verma', dob: '2009-07-18', gender: 'Male', category: 'General', contact: '9876543214', email: 'ishaan@email.com', address: 'New Delhi' },
  { id: 'std-006', rollNo: '06', admissionNo: 'DPS/2020/006', name: 'Kavya Reddy', fatherName: 'Suresh Reddy', motherName: 'Lakshmi Reddy', dob: '2009-01-25', gender: 'Female', category: 'General', contact: '9876543215', email: 'kavya@email.com', address: 'Hyderabad' },
  { id: 'std-007', rollNo: '07', admissionNo: 'DPS/2020/007', name: 'Krishna Kumar', fatherName: 'Ram Kumar', motherName: 'Sita Devi', dob: '2009-09-12', gender: 'Male', category: 'SC', contact: '9876543216', email: 'krishna@email.com', address: 'New Delhi' },
  { id: 'std-008', rollNo: '08', admissionNo: 'DPS/2020/008', name: 'Meera Nair', fatherName: 'Gopalan Nair', motherName: 'Devika Nair', dob: '2009-04-30', gender: 'Female', category: 'General', contact: '9876543217', email: 'meera@email.com', address: 'Kerala' },
  { id: 'std-009', rollNo: '09', admissionNo: 'DPS/2020/009', name: 'Neha Agarwal', fatherName: 'Sanjay Agarwal', motherName: 'Meena Agarwal', dob: '2009-06-08', gender: 'Female', category: 'General', contact: '9876543218', email: 'neha@email.com', address: 'New Delhi' },
  { id: 'std-010', rollNo: '10', admissionNo: 'DPS/2020/010', name: 'Om Prakash', fatherName: 'Shiv Prakash', motherName: 'Kamla Devi', dob: '2009-12-20', gender: 'Male', category: 'OBC', contact: '9876543219', email: 'om@email.com', address: 'New Delhi' },
  { id: 'std-011', rollNo: '11', admissionNo: 'DPS/2020/011', name: 'Priya Mishra', fatherName: 'Anil Mishra', motherName: 'Rekha Mishra', dob: '2009-02-14', gender: 'Female', category: 'General', contact: '9876543220', email: 'priya@email.com', address: 'Lucknow' },
  { id: 'std-012', rollNo: '12', admissionNo: 'DPS/2020/012', name: 'Rahul Joshi', fatherName: 'Mukesh Joshi', motherName: 'Anita Joshi', dob: '2009-08-05', gender: 'Male', category: 'General', contact: '9876543221', email: 'rahul@email.com', address: 'New Delhi' }];


  // Sample Results
  const [results, setResults] = useState<StudentResult[]>([
  {
    id: 'res-001',
    studentId: 'std-001',
    student: studentsData[0],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [
    { subjectId: 'sub-eng', subjectName: 'English', subjectCode: 'ENG', cbseCode: '184', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 72, internalMax: 20, internalObtained: 18, practicalMax: 0, practicalObtained: null, totalObtained: 90, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN', cbseCode: '002', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 68, internalMax: 20, internalObtained: 17, practicalMax: 0, practicalObtained: null, totalObtained: 85, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH', cbseCode: '041', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 75, internalMax: 20, internalObtained: 19, practicalMax: 0, practicalObtained: null, totalObtained: 94, grade: 'A1', gradePoint: 10, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sci', subjectName: 'Science', subjectCode: 'SCI', cbseCode: '086', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 70, internalMax: 0, internalObtained: null, practicalMax: 20, practicalObtained: 18, totalObtained: 88, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sst', subjectName: 'Social Science', subjectCode: 'SST', cbseCode: '087', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 65, internalMax: 20, internalObtained: 16, practicalMax: 0, practicalObtained: null, totalObtained: 81, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-it', subjectName: 'Information Technology', subjectCode: 'IT', cbseCode: '402', subjectType: 'Skill', isSkillSubject: true, maxMarks: 100, theoryMax: 50, theoryObtained: 42, internalMax: 0, internalObtained: null, practicalMax: 50, practicalObtained: 45, totalObtained: 87, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' }],

    totalMarks: 525,
    maxMarks: 600,
    percentage: 87.5,
    overallGrade: 'A2',
    gradePoint: 9.17,
    rank: 1,
    result: 'PASS',
    compartmentSubjects: [],
    passedSubjects: 6,
    failedSubjects: 0,
    totalSubjects: 6,
    bestFiveTotal: 438,
    bestFivePercentage: 87.6,
    isEligibleForPromotion: true,
    attendance: 95.5,
    remarks: 'Excellent Performance',
    generatedAt: '2025-03-01T10:00:00',
    generatedBy: 'Admin',
    verifiedAt: '2025-03-02T14:00:00',
    verifiedBy: 'Principal',
    lockedAt: '2025-03-03T10:00:00',
    lockedBy: 'Admin',
    isLocked: true,
    isVerified: true,
    isPublished: true
  },
  {
    id: 'res-002',
    studentId: 'std-002',
    student: studentsData[1],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [
    { subjectId: 'sub-eng', subjectName: 'English', subjectCode: 'ENG', cbseCode: '184', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 65, internalMax: 20, internalObtained: 16, practicalMax: 0, practicalObtained: null, totalObtained: 81, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN', cbseCode: '002', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 58, internalMax: 20, internalObtained: 15, practicalMax: 0, practicalObtained: null, totalObtained: 73, grade: 'B1', gradePoint: 8, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH', cbseCode: '041', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 70, internalMax: 20, internalObtained: 18, practicalMax: 0, practicalObtained: null, totalObtained: 88, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sci', subjectName: 'Science', subjectCode: 'SCI', cbseCode: '086', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 62, internalMax: 0, internalObtained: null, practicalMax: 20, practicalObtained: 17, totalObtained: 79, grade: 'B1', gradePoint: 8, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sst', subjectName: 'Social Science', subjectCode: 'SST', cbseCode: '087', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 55, internalMax: 20, internalObtained: 14, practicalMax: 0, practicalObtained: null, totalObtained: 69, grade: 'B2', gradePoint: 7, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-it', subjectName: 'Information Technology', subjectCode: 'IT', cbseCode: '402', subjectType: 'Skill', isSkillSubject: true, maxMarks: 100, theoryMax: 50, theoryObtained: 38, internalMax: 0, internalObtained: null, practicalMax: 50, practicalObtained: 42, totalObtained: 80, grade: 'B1', gradePoint: 8, isPassed: true, isAbsent: false, remarks: '' }],

    totalMarks: 470,
    maxMarks: 600,
    percentage: 78.3,
    overallGrade: 'B1',
    gradePoint: 8.17,
    rank: 3,
    result: 'PASS',
    compartmentSubjects: [],
    passedSubjects: 6,
    failedSubjects: 0,
    totalSubjects: 6,
    bestFiveTotal: 390,
    bestFivePercentage: 78.0,
    isEligibleForPromotion: true,
    attendance: 92.0,
    remarks: 'Good Performance',
    generatedAt: '2025-03-01T10:00:00',
    generatedBy: 'Admin',
    verifiedAt: '2025-03-02T14:00:00',
    verifiedBy: 'Principal',
    lockedAt: null,
    lockedBy: null,
    isLocked: false,
    isVerified: true,
    isPublished: false
  },
  {
    id: 'res-003',
    studentId: 'std-003',
    student: studentsData[2],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [
    { subjectId: 'sub-eng', subjectName: 'English', subjectCode: 'ENG', cbseCode: '184', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 45, internalMax: 20, internalObtained: 12, practicalMax: 0, practicalObtained: null, totalObtained: 57, grade: 'C1', gradePoint: 6, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN', cbseCode: '002', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 52, internalMax: 20, internalObtained: 14, practicalMax: 0, practicalObtained: null, totalObtained: 66, grade: 'B2', gradePoint: 7, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH', cbseCode: '041', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 22, internalMax: 20, internalObtained: 8, practicalMax: 0, practicalObtained: null, totalObtained: 30, grade: 'E', gradePoint: 0, isPassed: false, isAbsent: false, remarks: 'Failed' },
    { subjectId: 'sub-sci', subjectName: 'Science', subjectCode: 'SCI', cbseCode: '086', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 48, internalMax: 0, internalObtained: null, practicalMax: 20, practicalObtained: 14, totalObtained: 62, grade: 'B2', gradePoint: 7, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sst', subjectName: 'Social Science', subjectCode: 'SST', cbseCode: '087', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 42, internalMax: 20, internalObtained: 11, practicalMax: 0, practicalObtained: null, totalObtained: 53, grade: 'C1', gradePoint: 6, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-it', subjectName: 'Information Technology', subjectCode: 'IT', cbseCode: '402', subjectType: 'Skill', isSkillSubject: true, maxMarks: 100, theoryMax: 50, theoryObtained: 32, internalMax: 0, internalObtained: null, practicalMax: 50, practicalObtained: 38, totalObtained: 70, grade: 'B2', gradePoint: 7, isPassed: true, isAbsent: false, remarks: '' }],

    totalMarks: 338,
    maxMarks: 600,
    percentage: 56.3,
    overallGrade: 'C1',
    gradePoint: 5.5,
    rank: 8,
    result: 'COMPARTMENT',
    compartmentSubjects: ['Mathematics'],
    passedSubjects: 5,
    failedSubjects: 1,
    totalSubjects: 6,
    bestFiveTotal: 308,
    bestFivePercentage: 61.6,
    isEligibleForPromotion: false,
    attendance: 88.5,
    remarks: 'Compartment in Mathematics',
    generatedAt: '2025-03-01T10:00:00',
    generatedBy: 'Admin',
    verifiedAt: null,
    verifiedBy: null,
    lockedAt: null,
    lockedBy: null,
    isLocked: false,
    isVerified: false,
    isPublished: false
  },
  {
    id: 'res-004',
    studentId: 'std-004',
    student: studentsData[3],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [
    { subjectId: 'sub-eng', subjectName: 'English', subjectCode: 'ENG', cbseCode: '184', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 75, internalMax: 20, internalObtained: 19, practicalMax: 0, practicalObtained: null, totalObtained: 94, grade: 'A1', gradePoint: 10, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN', cbseCode: '002', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 72, internalMax: 20, internalObtained: 18, practicalMax: 0, practicalObtained: null, totalObtained: 90, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH', cbseCode: '041', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 78, internalMax: 20, internalObtained: 20, practicalMax: 0, practicalObtained: null, totalObtained: 98, grade: 'A1', gradePoint: 10, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sci', subjectName: 'Science', subjectCode: 'SCI', cbseCode: '086', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 76, internalMax: 0, internalObtained: null, practicalMax: 20, practicalObtained: 19, totalObtained: 95, grade: 'A1', gradePoint: 10, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-sst', subjectName: 'Social Science', subjectCode: 'SST', cbseCode: '087', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 70, internalMax: 20, internalObtained: 18, practicalMax: 0, practicalObtained: null, totalObtained: 88, grade: 'A2', gradePoint: 9, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-it', subjectName: 'Information Technology', subjectCode: 'IT', cbseCode: '402', subjectType: 'Skill', isSkillSubject: true, maxMarks: 100, theoryMax: 50, theoryObtained: 45, internalMax: 0, internalObtained: null, practicalMax: 50, practicalObtained: 47, totalObtained: 92, grade: 'A1', gradePoint: 10, isPassed: true, isAbsent: false, remarks: '' }],

    totalMarks: 557,
    maxMarks: 600,
    percentage: 92.8,
    overallGrade: 'A1',
    gradePoint: 9.67,
    rank: null,
    result: 'PENDING',
    compartmentSubjects: [],
    passedSubjects: 6,
    failedSubjects: 0,
    totalSubjects: 6,
    bestFiveTotal: 465,
    bestFivePercentage: 93.0,
    isEligibleForPromotion: true,
    attendance: 97.0,
    remarks: '',
    generatedAt: null,
    generatedBy: null,
    verifiedAt: null,
    verifiedBy: null,
    lockedAt: null,
    lockedBy: null,
    isLocked: false,
    isVerified: false,
    isPublished: false
  },
  {
    id: 'res-005',
    studentId: 'std-005',
    student: studentsData[4],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [
    { subjectId: 'sub-eng', subjectName: 'English', subjectCode: 'ENG', cbseCode: '184', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 25, internalMax: 20, internalObtained: 6, practicalMax: 0, practicalObtained: null, totalObtained: 31, grade: 'E', gradePoint: 0, isPassed: false, isAbsent: false, remarks: 'Failed' },
    { subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN', cbseCode: '002', subjectType: 'Language', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 30, internalMax: 20, internalObtained: 8, practicalMax: 0, practicalObtained: null, totalObtained: 38, grade: 'D', gradePoint: 4, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH', cbseCode: '041', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 20, internalMax: 20, internalObtained: 5, practicalMax: 0, practicalObtained: null, totalObtained: 25, grade: 'E', gradePoint: 0, isPassed: false, isAbsent: false, remarks: 'Failed' },
    { subjectId: 'sub-sci', subjectName: 'Science', subjectCode: 'SCI', cbseCode: '086', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 22, internalMax: 0, internalObtained: null, practicalMax: 20, practicalObtained: 8, totalObtained: 30, grade: 'E', gradePoint: 0, isPassed: false, isAbsent: false, remarks: 'Failed' },
    { subjectId: 'sub-sst', subjectName: 'Social Science', subjectCode: 'SST', cbseCode: '087', subjectType: 'Main', isSkillSubject: false, maxMarks: 100, theoryMax: 80, theoryObtained: 35, internalMax: 20, internalObtained: 10, practicalMax: 0, practicalObtained: null, totalObtained: 45, grade: 'C2', gradePoint: 5, isPassed: true, isAbsent: false, remarks: '' },
    { subjectId: 'sub-it', subjectName: 'Information Technology', subjectCode: 'IT', cbseCode: '402', subjectType: 'Skill', isSkillSubject: true, maxMarks: 100, theoryMax: 50, theoryObtained: 28, internalMax: 0, internalObtained: null, practicalMax: 50, practicalObtained: 30, totalObtained: 58, grade: 'C1', gradePoint: 6, isPassed: true, isAbsent: false, remarks: '' }],

    totalMarks: 227,
    maxMarks: 600,
    percentage: 37.8,
    overallGrade: 'D',
    gradePoint: 2.5,
    rank: 10,
    result: 'FAIL',
    compartmentSubjects: ['English', 'Mathematics', 'Science'],
    passedSubjects: 3,
    failedSubjects: 3,
    totalSubjects: 6,
    bestFiveTotal: 196,
    bestFivePercentage: 39.2,
    isEligibleForPromotion: false,
    attendance: 75.0,
    remarks: 'Failed in 3 subjects',
    generatedAt: '2025-03-01T10:00:00',
    generatedBy: 'Admin',
    verifiedAt: null,
    verifiedBy: null,
    lockedAt: null,
    lockedBy: null,
    isLocked: false,
    isVerified: false,
    isPublished: false
  },
  {
    id: 'res-006',
    studentId: 'std-006',
    student: studentsData[5],
    classId: 'class-10',
    className: 'X',
    section: 'A',
    examId: 'exam-annual',
    examName: 'Annual Examination',
    termId: 'term-2',
    termName: 'Term 2',
    session: '2024-25',
    subjects: [],
    totalMarks: 0,
    maxMarks: 600,
    percentage: 0,
    overallGrade: '-',
    gradePoint: 0,
    rank: null,
    result: 'PENDING',
    compartmentSubjects: [],
    passedSubjects: 0,
    failedSubjects: 0,
    totalSubjects: 6,
    bestFiveTotal: 0,
    bestFivePercentage: 0,
    isEligibleForPromotion: false,
    attendance: 0,
    remarks: 'Marks not entered',
    generatedAt: null,
    generatedBy: null,
    verifiedAt: null,
    verifiedBy: null,
    lockedAt: null,
    lockedBy: null,
    isLocked: false,
    isVerified: false,
    isPublished: false
  }]
  );

  // ==================== HELPER FUNCTIONS ====================

  const getGradeFromMarks = (marks: number): GradeScale => {
    return gradeScale.find((g) => marks >= g.minMarks && marks <= g.maxMarks) || gradeScale[gradeScale.length - 1];
  };

  const getFilteredSections = useMemo(() => {
    if (!selectedClass) return [];
    return sections.filter((s) => s.classId === selectedClass);
  }, [selectedClass]);

  const getFilteredSubjects = useMemo(() => {
    if (!selectedClass) return subjects;
    return subjects.filter((s) => s.classIds.includes(selectedClass));
  }, [selectedClass]);

  const getFilteredExams = useMemo(() => {
    if (!selectedTerm) return exams;
    return exams.filter((e) => e.termId === selectedTerm);
  }, [selectedTerm]);

  // ==================== FILTERED & SORTED RESULTS ====================

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Class filter
    if (selectedClass) {
      filtered = filtered.filter((r) => r.classId === selectedClass);
    }

    // Section filter
    if (selectedSection) {
      filtered = filtered.filter((r) => r.section === sections.find((s) => s.id === selectedSection)?.name);
    }

    // Term filter
    if (selectedTerm) {
      filtered = filtered.filter((r) => r.termId === selectedTerm);
    }

    // Exam filter
    if (selectedExam) {
      filtered = filtered.filter((r) => r.examId === selectedExam);
    }

    // Subject filter - check if student has that subject
    if (selectedSubject) {
      filtered = filtered.filter((r) =>
      r.subjects.some((s) => s.subjectId === selectedSubject)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((r) =>
      r.student.name.toLowerCase().includes(query) ||
      r.student.rollNo.toLowerCase().includes(query) ||
      r.student.admissionNo.toLowerCase().includes(query) ||
      r.student.fatherName.toLowerCase().includes(query)
      );
    }

    // Result filter
    if (filterResult !== 'all') {
      filtered = filtered.filter((r) => r.result.toLowerCase() === filterResult);
    }

    // Status filter
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'generated':
          filtered = filtered.filter((r) => r.generatedAt !== null && !r.isVerified);
          break;
        case 'verified':
          filtered = filtered.filter((r) => r.isVerified && !r.isLocked);
          break;
        case 'locked':
          filtered = filtered.filter((r) => r.isLocked);
          break;
        case 'pending':
          filtered = filtered.filter((r) => r.result === 'PENDING');
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let compareA: any, compareB: any;

      switch (sortField) {
        case 'rollNo':
          compareA = parseInt(a.student.rollNo);
          compareB = parseInt(b.student.rollNo);
          break;
        case 'name':
          compareA = a.student.name;
          compareB = b.student.name;
          break;
        case 'percentage':
          compareA = a.percentage;
          compareB = b.percentage;
          break;
        case 'rank':
          compareA = a.rank || 999;
          compareB = b.rank || 999;
          break;
        case 'result':
          compareA = a.result;
          compareB = b.result;
          break;
        default:
          compareA = parseInt(a.student.rollNo);
          compareB = parseInt(b.student.rollNo);
      }

      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return filtered;
  }, [results, selectedClass, selectedSection, selectedTerm, selectedExam, selectedSubject, searchQuery, filterResult, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==================== STATISTICS ====================

  const statistics = useMemo(() => {
    const total = filteredResults.length;
    const passed = filteredResults.filter((r) => r.result === 'PASS').length;
    const failed = filteredResults.filter((r) => r.result === 'FAIL').length;
    const compartment = filteredResults.filter((r) => r.result === 'COMPARTMENT').length;
    const pending = filteredResults.filter((r) => r.result === 'PENDING').length;
    const absent = filteredResults.filter((r) => r.result === 'ABSENT').length;
    const generated = filteredResults.filter((r) => r.generatedAt !== null).length;
    const verified = filteredResults.filter((r) => r.isVerified).length;
    const locked = filteredResults.filter((r) => r.isLocked).length;

    const validResults = filteredResults.filter((r) => r.result !== 'PENDING' && r.result !== 'ABSENT');
    const avgPercentage = validResults.length > 0 ?
    validResults.reduce((sum, r) => sum + r.percentage, 0) / validResults.length :
    0;

    const highestPercentage = validResults.length > 0 ?
    Math.max(...validResults.map((r) => r.percentage)) :
    0;
    const lowestPercentage = validResults.length > 0 ?
    Math.min(...validResults.map((r) => r.percentage)) :
    0;

    const topperName = validResults.length > 0 ?
    validResults.find((r) => r.percentage === highestPercentage)?.student.name || '-' :
    '-';

    return {
      total,
      passed,
      failed,
      compartment,
      pending,
      absent,
      generated,
      verified,
      locked,
      passPercent: total > 0 ? (passed / (total - pending - absent) * 100).toFixed(1) : '0',
      avgPercentage: avgPercentage.toFixed(1),
      highestPercentage: highestPercentage.toFixed(1),
      lowestPercentage: lowestPercentage.toFixed(1),
      topperName
    };
  }, [filteredResults]);

  // ==================== ACTION HANDLERS ====================

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(paginatedResults.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents((prev) => prev.filter((s) => s !== id));
    } else {
      setSelectedStudents((prev) => [...prev, id]);
    }
  };

  const toggleExpandRow = (id: string) => {
    if (expandedRows.includes(id)) {
      setExpandedRows((prev) => prev.filter((r) => r !== id));
    } else {
      setExpandedRows((prev) => [...prev, id]);
    }
  };

  const generateResults = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setGenerationProgress(i);
    }

    setResults((prev) => prev.map((r) => {
      if (r.result === 'PENDING' && r.subjects.length > 0) {
        const failedMainSubjects = r.subjects.filter((s) => !s.isSkillSubject && !s.isPassed);
        let result: 'PASS' | 'FAIL' | 'COMPARTMENT' = 'PASS';

        if (failedMainSubjects.length === 0) {
          result = 'PASS';
        } else if (failedMainSubjects.length <= 2) {
          result = 'COMPARTMENT';
        } else {
          result = 'FAIL';
        }

        return {
          ...r,
          result,
          compartmentSubjects: failedMainSubjects.map((s) => s.subjectName),
          generatedAt: new Date().toISOString(),
          generatedBy: 'Admin',
          remarks: result === 'PASS' ?
          'Promoted to next class' :
          result === 'COMPARTMENT' ?
          `Compartment in ${failedMainSubjects.map((s) => s.subjectName).join(', ')}` :
          `Failed in ${failedMainSubjects.length} subjects`
        };
      }
      return r;
    }));

    setIsGenerating(false);
    setShowGenerateModal(false);
  };

  const handleResetFilters = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedSubject('');
    setSelectedExam('');
    setSelectedTerm('');
    setSearchQuery('');
    setFilterResult('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // ==================== BADGE COMPONENTS ====================

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'PASS':
        return (
          <Badge className="bg-green-100 text-green-700 border border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" /> PASS
          </Badge>);

      case 'FAIL':
        return (
          <Badge className="bg-red-100 text-red-700 border border-red-300">
            <XCircle className="w-3 h-3 mr-1" /> FAIL
          </Badge>);

      case 'COMPARTMENT':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" /> COMP
          </Badge>);

      case 'ABSENT':
        return (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
            <AlertCircle className="w-3 h-3 mr-1" /> ABSENT
          </Badge>);

      case 'PENDING':
        return (
          <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
            <Clock className="w-3 h-3 mr-1" /> PENDING
          </Badge>);

      default:
        return <Badge>{result}</Badge>;
    }
  };

  const getStatusBadge = (result: StudentResult) => {
    if (result.isLocked) {
      return (
        <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
          <Lock className="w-3 h-3 mr-1" /> Locked
        </Badge>);

    }
    if (result.isVerified) {
      return (
        <Badge className="bg-green-100 text-green-700 border border-green-300">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
        </Badge>);

    }
    if (result.generatedAt) {
      return (
        <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
          <FileCheck className="w-3 h-3 mr-1" /> Generated
        </Badge>);

    }
    return (
      <Badge className="bg-gray-100 text-gray-600 border border-gray-300">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>);

  };

  // ==================== CHECK FILTERS SELECTED ====================

  const isFiltersSelected = selectedClass && selectedExam && selectedTerm;

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== HEADER ==================== */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-200">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CBSE Result Generation</h1>
              <p className="text-sm text-gray-500">Generate, verify and publish examination results</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Session 2024-25
            </Badge>
            <Badge className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              CBSE Compliant
            </Badge>
            
            <div className="h-6 w-px bg-gray-300 mx-2 hidden lg:block" />
            
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowGenerateModal(true)}
              disabled={statistics.pending === 0}
              className="bg-green-600 hover:bg-green-700">

              <Zap className="w-4 h-4 mr-2" />
              Generate Results
            </Button>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="p-6 space-y-6">
        
        {/* ==================== FILTER SECTION ==================== */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Search & Filter Results</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Class Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection('');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">

                <option value="">All Classes</option>
                {classes.map((cls) =>
                <option key={cls.id} value={cls.id}>{cls.displayName}</option>
                )}
              </select>
            </div>

            {/* Section Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedClass}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">

                <option value="">All Sections</option>
                {getFilteredSections.map((sec) =>
                <option key={sec.id} value={sec.id}>Section {sec.name}</option>
                )}
              </select>
            </div>

            {/* Term Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Term <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => {
                  setSelectedTerm(e.target.value);
                  setSelectedExam('');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">

                <option value="">Select Term</option>
                {terms.map((term) =>
                <option key={term.id} value={term.id}>{term.name} ({term.session})</option>
                )}
              </select>
            </div>

            {/* Exam Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" />
                Examination <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedTerm}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">

                <option value="">Select Exam</option>
                {getFilteredExams.map((exam) =>
                <option key={exam.id} value={exam.id}>{exam.name}</option>
                )}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <BookText className="w-3.5 h-3.5" />
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">

                <option value="">All Subjects</option>
                {getFilteredSubjects.map((sub) =>
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                )}
              </select>
            </div>

            {/* Student Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Roll No, Adm No..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

              </div>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Result:</span>
              <div className="flex gap-1">
                {['all', 'pass', 'fail', 'compartment', 'pending'].map((status) =>
                <button
                  key={status}
                  onClick={() => {
                    setFilterResult(status as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterResult === status ?
                  'bg-green-100 text-green-700 border border-green-300' :
                  'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`
                  }>

                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )}
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Status:</span>
              <div className="flex gap-1">
                {['all', 'pending', 'generated', 'verified', 'locked'].map((status) =>
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === status ?
                  'bg-blue-100 text-blue-700 border border-blue-300' :
                  'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`
                  }>

                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {isFiltersSelected &&
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-green-700">Active Filters:</span>
                {selectedClass &&
              <Badge className="bg-white text-green-700 border border-green-200">
                    {classes.find((c) => c.id === selectedClass)?.displayName}
                  </Badge>
              }
                {selectedSection &&
              <Badge className="bg-white text-green-700 border border-green-200">
                    Section {sections.find((s) => s.id === selectedSection)?.name}
                  </Badge>
              }
                {selectedTerm &&
              <Badge className="bg-white text-green-700 border border-green-200">
                    {terms.find((t) => t.id === selectedTerm)?.name}
                  </Badge>
              }
                {selectedExam &&
              <Badge className="bg-white text-green-700 border border-green-200">
                    {exams.find((e) => e.id === selectedExam)?.name}
                  </Badge>
              }
                {selectedSubject &&
              <Badge className="bg-white text-green-700 border border-green-200">
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </Badge>
              }
              </div>
            </div>
          }
        </Card>

        {/* ==================== SHOW MESSAGE IF FILTERS NOT SELECTED ==================== */}
        {!isFiltersSelected &&
        <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Filters to View Results</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  Please select Class, Term, and Examination to view and generate student results
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Info className="w-4 h-4" />
                <span>Required filters are marked with *</span>
              </div>
            </div>
          </Card>
        }

        {/* ==================== MAIN CONTENT WHEN FILTERS SELECTED ==================== */}
        {isFiltersSelected &&
        <>
            {/* ==================== STATISTICS CARDS ==================== */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Students</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{statistics.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Passed</p>
                    <p className="text-2xl font-black text-green-600 mt-1">{statistics.passed}</p>
                    <p className="text-xs text-green-600">{statistics.passPercent}%</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Failed</p>
                    <p className="text-2xl font-black text-red-600 mt-1">{statistics.failed}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Compartment</p>
                    <p className="text-2xl font-black text-yellow-600 mt-1">{statistics.compartment}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">{statistics.pending}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Class Average</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{statistics.avgPercentage}%</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* ==================== PERFORMANCE SUMMARY ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Highest Score</p>
                    <p className="text-3xl font-black text-green-800">{statistics.highestPercentage}%</p>
                    <p className="text-xs text-green-600 mt-1 truncate">{statistics.topperName}</p>
                  </div>
                  <Trophy className="w-10 h-10 text-green-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Lowest Score</p>
                    <p className="text-3xl font-black text-orange-800">{statistics.lowestPercentage}%</p>
                  </div>
                  <TrendingDown className="w-10 h-10 text-orange-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Generated</p>
                    <p className="text-3xl font-black text-blue-800">{statistics.generated}</p>
                    <p className="text-xs text-blue-600 mt-1">of {statistics.total} results</p>
                  </div>
                  <FileCheck className="w-10 h-10 text-blue-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Verified & Locked</p>
                    <p className="text-3xl font-black text-purple-800">{statistics.locked}</p>
                    <p className="text-xs text-purple-600 mt-1">Ready to publish</p>
                  </div>
                  <Lock className="w-10 h-10 text-purple-600" />
                </div>
              </Card>
            </div>

            {/* ==================== RESULTS TABLE ==================== */}
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Student Results</h3>
                  <Badge className="bg-gray-100 text-gray-600">
                    {filteredResults.length} students
                  </Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedStudents.length > 0 &&
                <>
                      <Badge className="bg-blue-100 text-blue-700">
                        {selectedStudents.length} selected
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ListChecks className="w-4 h-4 mr-1.5" />
                        Verify Selected
                      </Button>
                      <Button variant="outline" size="sm">
                        <Lock className="w-4 h-4 mr-1.5" />
                        Lock Selected
                      </Button>
                      <div className="h-6 w-px bg-gray-200" />
                    </>
                }
                  <Button variant="outline" size="sm">
                    <ListChecks className="w-4 h-4 mr-1.5" />
                    Verify All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4 mr-1.5" />
                    Lock All
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left w-12">
                        <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />

                      </th>
                      <th className="py-3 px-4 text-left w-12"></th>
                      <th className="py-3 px-4 text-left">
                        <button
                        onClick={() => handleSort('rollNo')}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700">

                          Roll No
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">
                        <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700">

                          Student Details
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Subjects
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total Marks
                      </th>
                      <th className="py-3 px-4 text-center">
                        <button
                        onClick={() => handleSort('percentage')}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700 mx-auto">

                          Percentage
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        CGPA
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedResults.map((result) => {
                    const gradeInfo = getGradeFromMarks(result.percentage);
                    const isExpanded = expandedRows.includes(result.id);
                    const isSelected = selectedStudents.includes(result.id);

                    return (
                      <React.Fragment key={result.id}>
                          <tr className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}>
                            <td className="py-3 px-4">
                              <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectStudent(result.id)}
                              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />

                            </td>
                            <td className="py-3 px-4">
                              <button
                              onClick={() => toggleExpandRow(result.id)}
                              className="p-1 hover:bg-gray-100 rounded">

                                {isExpanded ?
                              <ChevronDown className="w-4 h-4 text-gray-500" /> :

                              <ChevronRight className="w-4 h-4 text-gray-500" />
                              }
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                {result.student.rollNo}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{result.student.name}</p>
                                <p className="text-xs text-gray-500">{result.student.admissionNo}</p>
                                <p className="text-xs text-gray-400">F: {result.student.fatherName}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-green-600 font-semibold">{result.passedSubjects}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-600">{result.totalSubjects}</span>
                                {result.failedSubjects > 0 &&
                              <span className="text-red-500 text-xs ml-1">
                                    ({result.failedSubjects} F)
                                  </span>
                              }
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-semibold text-gray-900">
                                {result.totalMarks}/{result.maxMarks}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-green-600">
                                {result.percentage.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center justify-center w-10 h-8 rounded font-bold text-sm ${gradeInfo.bgColor} ${gradeInfo.color} border ${gradeInfo.borderColor}`}>
                                {result.overallGrade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-semibold text-purple-600">
                                {result.gradePoint.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {result.rank ?
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                                  {result.rank}
                                </span> :

                            <span className="text-gray-400">-</span>
                            }
                            </td>
                            <td className="py-3 px-4 text-center">
                              {getResultBadge(result.result)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {getStatusBadge(result)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPreviewStudent(result);
                                  setShowPreviewModal(true);
                                }}>

                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row - Subject Details */}
                          {isExpanded &&
                        <tr className="bg-gray-50">
                              <td colSpan={13} className="py-4 px-8">
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    Subject-wise Performance
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Subject</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Code</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Type</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Theory</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Internal/Prac</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Grade</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">GP</th>
                                          <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {result.subjects.map((subject, idx) => {
                                      const subGrade = getGradeFromMarks(subject.totalObtained || 0);
                                      return (
                                        <tr key={idx} className={!subject.isPassed ? 'bg-red-50' : ''}>
                                              <td className="py-2 px-3">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-medium">{subject.subjectName}</span>
                                                  {subject.isSkillSubject &&
                                              <Badge className="bg-purple-100 text-purple-700 text-[10px]">Skill</Badge>
                                              }
                                                </div>
                                              </td>
                                              <td className="py-2 px-3 text-center text-gray-500">{subject.cbseCode}</td>
                                              <td className="py-2 px-3 text-center">
                                                <Badge className="bg-gray-100 text-gray-600 text-[10px]">{subject.subjectType}</Badge>
                                              </td>
                                              <td className="py-2 px-3 text-center">
                                                {subject.theoryObtained}/{subject.theoryMax}
                                              </td>
                                              <td className="py-2 px-3 text-center">
                                                {subject.internalObtained !== null ?
                                            `${subject.internalObtained}/${subject.internalMax}` :
                                            subject.practicalObtained !== null ?
                                            `${subject.practicalObtained}/${subject.practicalMax}` :
                                            '-'
                                            }
                                              </td>
                                              <td className="py-2 px-3 text-center font-bold">{subject.totalObtained}/100</td>
                                              <td className="py-2 px-3 text-center">
                                                <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold ${subGrade.bgColor} ${subGrade.color}`}>
                                                  {subject.grade}
                                                </span>
                                              </td>
                                              <td className="py-2 px-3 text-center font-semibold text-purple-600">{subject.gradePoint}</td>
                                              <td className="py-2 px-3 text-center">
                                                {subject.isPassed ?
                                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> :

                                            <XCircle className="w-4 h-4 text-red-600 mx-auto" />
                                            }
                                              </td>
                                            </tr>);

                                    })}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Additional Info */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                      <p className="text-xs text-blue-600">Best 5 Total</p>
                                      <p className="text-lg font-bold text-blue-800">{result.bestFiveTotal}/500</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                      <p className="text-xs text-green-600">Best 5 %</p>
                                      <p className="text-lg font-bold text-green-800">{result.bestFivePercentage.toFixed(1)}%</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                      <p className="text-xs text-purple-600">Attendance</p>
                                      <p className="text-lg font-bold text-purple-800">{result.attendance}%</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                      <p className="text-xs text-orange-600">Remarks</p>
                                      <p className="text-sm font-medium text-orange-800 truncate">{result.remarks || '-'}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                        }
                        </React.Fragment>);

                  })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredResults.length === 0 &&
            <div className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">No results found matching your filters</p>
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
            }

              {/* Pagination */}
              {filteredResults.length > 0 &&
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">
                      Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-semibold text-gray-900">
                        {Math.min(currentPage * itemsPerPage, filteredResults.length)}
                      </span>{' '}
                      of <span className="font-semibold text-gray-900">{filteredResults.length}</span> results
                    </p>
                    <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded px-2 py-1 text-sm">

                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}>

                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum ?
                        'bg-green-600 text-white' :
                        'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`
                        }>

                            {pageNum}
                          </button>);

                  })}
                    </div>
                    <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}>

                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            }
            </Card>

            {/* ==================== GRADE SCALE REFERENCE ==================== */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                CBSE Grade Scale Reference
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {gradeScale.map((grade) =>
              <div
                key={grade.grade}
                className={`p-3 rounded-lg text-center ${grade.bgColor} border ${grade.borderColor}`}>

                    <p className={`text-lg font-bold ${grade.color}`}>{grade.grade}</p>
                    <p className="text-xs text-gray-600">{grade.minMarks}-{grade.maxMarks}%</p>
                    <p className="text-[10px] text-gray-500">GP: {grade.gradePoint}</p>
                  </div>
              )}
              </div>
            </Card>
          </>
        }
      </div>

      {/* ==================== GENERATE MODAL ==================== */}
      {showGenerateModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Generate Results
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowGenerateModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!isGenerating ?
          <>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      This will generate results for <strong>{statistics.pending}</strong> pending students.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Processing Steps:</h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Calculate total marks and percentage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Assign grades (A1-E) based on marks
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Determine Pass/Fail/Compartment status
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Calculate Best of 5 and CGPA
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Assign class ranks
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={generateResults} className="bg-green-600 hover:bg-green-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Now
                  </Button>
                </div>
              </> :

          <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
                <p className="font-medium text-gray-900 mb-2">Generating Results...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }} />

                </div>
                <p className="text-sm text-gray-500">{generationProgress}% Complete</p>
              </div>
          }
          </Card>
        </div>
      }

      {/* ==================== PREVIEW MODAL ==================== */}
      {showPreviewModal && previewStudent &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Result Details - {previewStudent.student.name}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Roll Number</p>
                  <p className="font-semibold text-gray-900">{previewStudent.student.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission No</p>
                  <p className="font-semibold text-gray-900">{previewStudent.student.admissionNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-semibold text-gray-900">{previewStudent.className}-{previewStudent.section}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Result</p>
                  {getResultBadge(previewStudent.result)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Father's Name</p>
                  <p className="font-semibold text-gray-900">{previewStudent.student.fatherName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{previewStudent.student.dob}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Examination</p>
                  <p className="font-semibold text-gray-900">{previewStudent.examName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Session</p>
                  <p className="font-semibold text-gray-900">{previewStudent.session}</p>
                </div>
              </div>

              {/* Subject-wise Marks */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Subject-wise Performance
                </h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Code</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Theory</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Int/Prac</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Grade</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">GP</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewStudent.subjects.map((subject, idx) => {
                      const subGrade = getGradeFromMarks(subject.totalObtained || 0);
                      return (
                        <tr key={idx} className={!subject.isPassed ? 'bg-red-50' : ''}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{subject.subjectName}</span>
                                {subject.isSkillSubject &&
                              <Badge className="bg-purple-100 text-purple-700 text-[10px]">Skill</Badge>
                              }
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-500">{subject.cbseCode}</td>
                            <td className="py-3 px-4 text-center">{subject.theoryObtained}/{subject.theoryMax}</td>
                            <td className="py-3 px-4 text-center">
                              {subject.internalObtained !== null ?
                            `${subject.internalObtained}/${subject.internalMax}` :
                            subject.practicalObtained !== null ?
                            `${subject.practicalObtained}/${subject.practicalMax}` :
                            '-'
                            }
                            </td>
                            <td className="py-3 px-4 text-center font-bold">{subject.totalObtained}/100</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center justify-center w-10 h-7 rounded text-sm font-bold ${subGrade.bgColor} ${subGrade.color}`}>
                                {subject.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-purple-600">{subject.gradePoint}</td>
                            <td className="py-3 px-4 text-center">
                              {subject.isPassed ?
                            <Badge className="bg-green-100 text-green-700">Pass</Badge> :

                            <Badge className="bg-red-100 text-red-700">Fail</Badge>
                            }
                            </td>
                          </tr>);

                    })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
                  <p className="text-sm text-blue-700">Total Marks</p>
                  <p className="text-2xl font-bold text-blue-800">{previewStudent.totalMarks}/{previewStudent.maxMarks}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center border border-green-200">
                  <p className="text-sm text-green-700">Percentage</p>
                  <p className="text-2xl font-bold text-green-800">{previewStudent.percentage.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center border border-purple-200">
                  <p className="text-sm text-purple-700">Overall Grade</p>
                  <p className="text-2xl font-bold text-purple-800">{previewStudent.overallGrade}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center border border-orange-200">
                  <p className="text-sm text-orange-700">CGPA</p>
                  <p className="text-2xl font-bold text-orange-800">{previewStudent.gradePoint.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center border border-yellow-200">
                  <p className="text-sm text-yellow-700">Rank</p>
                  <p className="text-2xl font-bold text-yellow-800">{previewStudent.rank || '-'}</p>
                </div>
              </div>

              {/* Compartment/Fail Info */}
              {previewStudent.result === 'COMPARTMENT' &&
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Compartment</h4>
                      <p className="text-sm text-yellow-700">
                        Failed in: {previewStudent.compartmentSubjects.join(', ')}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Student needs to appear for compartment examination
                      </p>
                    </div>
                  </div>
                </div>
            }

              {previewStudent.result === 'FAIL' &&
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Failed</h4>
                      <p className="text-sm text-red-700">
                        Failed in {previewStudent.failedSubjects} subjects: {previewStudent.compartmentSubjects.join(', ')}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Student needs to repeat the class
                      </p>
                    </div>
                  </div>
                </div>
            }

              {/* Generation Info */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Processing Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Generated At</p>
                    <p className="font-medium">{previewStudent.generatedAt ? new Date(previewStudent.generatedAt).toLocaleString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Generated By</p>
                    <p className="font-medium">{previewStudent.generatedBy || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Verified At</p>
                    <p className="font-medium">{previewStudent.verifiedAt ? new Date(previewStudent.verifiedAt).toLocaleString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    {getStatusBadge(previewStudent)}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default CBSEResultGeneration;