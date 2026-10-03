import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Printer,
  Download,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  School,
  Baby,
  BookMarked,
  FileSpreadsheet,
  Image,
  Maximize2,
  Minimize2,
  Settings,
  List,
  Grid3X3,
  ArrowUpDown,
  Check,
  SlidersHorizontal,
  Layers } from
'lucide-react';

// ============================================
// Types
// ============================================

type ClassLevel = 'Pre-Primary' | 'Primary' | 'Middle' | 'Secondary' | 'Higher Secondary';
type Stream = 'Science' | 'Commerce' | 'Arts' | 'General' | 'NA';
type ResultStatus = 'PASS' | 'FAIL' | 'ATKT' | 'ABSENT' | 'WITHHELD';
type ExamType = 'Unit Test 1' | 'Unit Test 2' | 'Unit Test 3' | 'Unit Test 4' | 'Half Yearly' | 'Annual' | 'Pre-Board' | 'Board Exam' | 'Supplementary';

interface ClassInfo {
  id: string;
  name: string;
  shortName: string;
  level: ClassLevel;
  sequence: number;
  hasStreams: boolean;
  availableStreams: Stream[];
  hasBoard: boolean;
}

interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  minPassing: number;
  theoryMax?: number;
  theoryObtained?: number;
  practicalMax?: number;
  practicalObtained?: number;
  internalMax?: number;
  internalObtained?: number;
  totalObtained: number;
  grade: string;
  isPassed: boolean;
}

interface StudentRecord {
  id: number;
  seatNo: string;
  rollNo: string;
  grNo: string;
  admissionNo: string;
  studentName: string;
  motherName: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: string;
  classId: string;
  className: string;
  section: string;
  stream: Stream;
  schoolName: string;
  schoolCode: string;
  schoolAddress: string;
  centerName: string;
  centerCode: string;
  examSession: string;
  examType: ExamType;
  examDate: string;
  subjects: SubjectMark[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  rank?: number;
  resultStatus: ResultStatus;
  remarks: string;
  attendance: {
    totalDays: number;
    presentDays: number;
    percentage: number;
  };
  photo?: string;
}

// ============================================
// Constants
// ============================================

const allClasses: ClassInfo[] = [
{ id: 'NUR', name: 'Nursery', shortName: 'NUR', level: 'Pre-Primary', sequence: 1, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'LKG', name: 'LKG', shortName: 'LKG', level: 'Pre-Primary', sequence: 2, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'UKG', name: 'UKG', shortName: 'UKG', level: 'Pre-Primary', sequence: 3, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C1', name: 'Class 1', shortName: '1', level: 'Primary', sequence: 4, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C2', name: 'Class 2', shortName: '2', level: 'Primary', sequence: 5, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C3', name: 'Class 3', shortName: '3', level: 'Primary', sequence: 6, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C4', name: 'Class 4', shortName: '4', level: 'Primary', sequence: 7, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C5', name: 'Class 5', shortName: '5', level: 'Primary', sequence: 8, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C6', name: 'Class 6', shortName: '6', level: 'Middle', sequence: 9, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C7', name: 'Class 7', shortName: '7', level: 'Middle', sequence: 10, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C8', name: 'Class 8', shortName: '8', level: 'Middle', sequence: 11, hasStreams: false, availableStreams: ['NA'], hasBoard: false },
{ id: 'C9', name: 'Class 9', shortName: '9', level: 'Secondary', sequence: 12, hasStreams: false, availableStreams: ['General'], hasBoard: false },
{ id: 'C10', name: 'Class 10', shortName: '10', level: 'Secondary', sequence: 13, hasStreams: false, availableStreams: ['General'], hasBoard: true },
{ id: 'C11', name: 'Class 11', shortName: '11', level: 'Higher Secondary', sequence: 14, hasStreams: true, availableStreams: ['Science', 'Commerce', 'Arts'], hasBoard: false },
{ id: 'C12', name: 'Class 12', shortName: '12', level: 'Higher Secondary', sequence: 15, hasStreams: true, availableStreams: ['Science', 'Commerce', 'Arts'], hasBoard: true }];


const examTypes: ExamType[] = ['Unit Test 1', 'Unit Test 2', 'Unit Test 3', 'Unit Test 4', 'Half Yearly', 'Annual', 'Pre-Board', 'Board Exam', 'Supplementary'];
const academicSessions = ['2024-25', '2023-24', '2022-23', '2021-22'];
const sections = ['A', 'B', 'C', 'D', 'E'];
const classLevels: ClassLevel[] = ['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Higher Secondary'];

// ============================================
// Helper Functions
// ============================================

const getGradeFromPercentage = (pct: number): string => {
  if (pct >= 91) return 'A1';
  if (pct >= 81) return 'A2';
  if (pct >= 71) return 'B1';
  if (pct >= 61) return 'B2';
  if (pct >= 51) return 'C1';
  if (pct >= 41) return 'C2';
  if (pct >= 33) return 'D';
  if (pct >= 21) return 'E';
  return 'F';
};

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'text-green-700 bg-green-100';
  if (grade.startsWith('B')) return 'text-blue-700 bg-blue-100';
  if (grade.startsWith('C')) return 'text-yellow-700 bg-yellow-100';
  if (grade === 'D') return 'text-orange-700 bg-orange-100';
  return 'text-red-700 bg-red-100';
};

const getResultStatusColor = (status: ResultStatus): string => {
  switch (status) {
    case 'PASS':return 'bg-green-100 text-green-800';
    case 'FAIL':return 'bg-red-100 text-red-800';
    case 'ATKT':return 'bg-orange-100 text-orange-800';
    case 'ABSENT':return 'bg-gray-100 text-gray-800';
    case 'WITHHELD':return 'bg-purple-100 text-purple-800';
    default:return 'bg-gray-100 text-gray-800';
  }
};

const getLevelIcon = (level: ClassLevel) => {
  switch (level) {
    case 'Pre-Primary':return Baby;
    case 'Primary':return BookOpen;
    case 'Middle':return BookMarked;
    case 'Secondary':return GraduationCap;
    case 'Higher Secondary':return School;
    default:return BookOpen;
  }
};

// Generate mock student data
const generateMockStudents = (classId: string, section: string, stream: Stream, examType: ExamType, session: string): StudentRecord[] => {
  const classInfo = allClasses.find((c) => c.id === classId);
  if (!classInfo) return [];

  const studentNames = [
  { name: 'HARSH PATEL', father: 'RAJESH PATEL', mother: 'KAVITA PATEL', gender: 'Male' as const },
  { name: 'PRIYA SHAH', father: 'MUKESH SHAH', mother: 'REENA SHAH', gender: 'Female' as const },
  { name: 'RAJ MEHTA', father: 'SURESH MEHTA', mother: 'KIRAN MEHTA', gender: 'Male' as const },
  { name: 'NEHA JOSHI', father: 'RAMESH JOSHI', mother: 'MEENA JOSHI', gender: 'Female' as const },
  { name: 'VIVEK DESAI', father: 'BHARAT DESAI', mother: 'GITA DESAI', gender: 'Male' as const },
  { name: 'KOMAL PATEL', father: 'JAYESH PATEL', mother: 'HETAL PATEL', gender: 'Female' as const },
  { name: 'RAVI KUMAR', father: 'MAHESH KUMAR', mother: 'SUNITA KUMAR', gender: 'Male' as const },
  { name: 'SNEHA GANDHI', father: 'PRAVIN GANDHI', mother: 'JAYA GANDHI', gender: 'Female' as const },
  { name: 'AMIT SHARMA', father: 'VIJAY SHARMA', mother: 'ASHA SHARMA', gender: 'Male' as const },
  { name: 'POOJA VERMA', father: 'ANIL VERMA', mother: 'SUMAN VERMA', gender: 'Female' as const }];


  // Define subjects based on class level and stream
  const getSubjects = (): Omit<SubjectMark, 'totalObtained' | 'grade' | 'isPassed'>[] => {
    if (classInfo.level === 'Pre-Primary') {
      return [
      { subjectCode: 'ENG', subjectName: 'English', maxMarks: 50, minPassing: 17 },
      { subjectCode: 'NUM', subjectName: 'Numbers', maxMarks: 50, minPassing: 17 },
      { subjectCode: 'EVS', subjectName: 'Environmental Awareness', maxMarks: 50, minPassing: 17 },
      { subjectCode: 'ART', subjectName: 'Art & Craft', maxMarks: 50, minPassing: 17 }];

    }

    if (classInfo.level === 'Primary') {
      return [
      { subjectCode: 'ENG', subjectName: 'English', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'GUJ', subjectName: 'Gujarati', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'HIN', subjectName: 'Hindi', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'MATH', subjectName: 'Mathematics', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'EVS', subjectName: 'Environmental Studies', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'GK', subjectName: 'General Knowledge', maxMarks: 50, minPassing: 17 },
      { subjectCode: 'COMP', subjectName: 'Computer', maxMarks: 50, minPassing: 17 }];

    }

    if (classInfo.level === 'Middle') {
      return [
      { subjectCode: 'ENG', subjectName: 'English', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'GUJ', subjectName: 'Gujarati', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'HIN', subjectName: 'Hindi', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'MATH', subjectName: 'Mathematics', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'SCI', subjectName: 'Science', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'SS', subjectName: 'Social Science', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: 'COMP', subjectName: 'Computer Science', maxMarks: 50, minPassing: 17, theoryMax: 30, practicalMax: 20 }];

    }

    if (classInfo.level === 'Secondary') {
      return [
      { subjectCode: '001', subjectName: 'Gujarati (FL)', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: '002', subjectName: 'English (SL)', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: '003', subjectName: 'Hindi/Sanskrit', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: '041', subjectName: 'Mathematics', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: '086', subjectName: 'Science & Technology', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 },
      { subjectCode: '087', subjectName: 'Social Science', maxMarks: 100, minPassing: 33, theoryMax: 80, internalMax: 20 }];

    }

    // Higher Secondary
    if (stream === 'Science') {
      return [
      { subjectCode: '013', subjectName: 'English', maxMarks: 100, minPassing: 33, theoryMax: 100 },
      { subjectCode: '054', subjectName: 'Physics', maxMarks: 100, minPassing: 33, theoryMax: 70, practicalMax: 30 },
      { subjectCode: '055', subjectName: 'Chemistry', maxMarks: 100, minPassing: 33, theoryMax: 70, practicalMax: 30 },
      { subjectCode: '056', subjectName: 'Biology', maxMarks: 100, minPassing: 33, theoryMax: 70, practicalMax: 30 },
      { subjectCode: '041', subjectName: 'Mathematics', maxMarks: 100, minPassing: 33, theoryMax: 100 }];

    }

    if (stream === 'Commerce') {
      return [
      { subjectCode: '013', subjectName: 'English', maxMarks: 100, minPassing: 33, theoryMax: 100 },
      { subjectCode: '071', subjectName: 'Accountancy', maxMarks: 100, minPassing: 33, theoryMax: 80, practicalMax: 20 },
      { subjectCode: '072', subjectName: 'Statistics', maxMarks: 100, minPassing: 33, theoryMax: 100 },
      { subjectCode: '073', subjectName: 'Economics', maxMarks: 100, minPassing: 33, theoryMax: 100 },
      { subjectCode: '074', subjectName: 'Business Studies', maxMarks: 100, minPassing: 33, theoryMax: 100 }];

    }

    // Arts
    return [
    { subjectCode: '013', subjectName: 'English', maxMarks: 100, minPassing: 33, theoryMax: 100 },
    { subjectCode: '031', subjectName: 'History', maxMarks: 100, minPassing: 33, theoryMax: 100 },
    { subjectCode: '032', subjectName: 'Political Science', maxMarks: 100, minPassing: 33, theoryMax: 100 },
    { subjectCode: '041', subjectName: 'Geography', maxMarks: 100, minPassing: 33, theoryMax: 70, practicalMax: 30 },
    { subjectCode: '033', subjectName: 'Sociology', maxMarks: 100, minPassing: 33, theoryMax: 100 }];

  };

  const baseSubjects = getSubjects();

  return studentNames.map((stu, idx) => {
    // Generate random marks for each subject
    const subjects: SubjectMark[] = baseSubjects.map((sub) => {
      const baseScore = 40 + Math.floor(Math.random() * 55); // 40-95 range mostly
      let theoryObtained: number | undefined;
      let practicalObtained: number | undefined;
      let internalObtained: number | undefined;

      if (sub.theoryMax) {
        theoryObtained = Math.min(sub.theoryMax, Math.floor(baseScore / 100 * sub.theoryMax + Math.random() * 10));
      }
      if (sub.practicalMax) {
        practicalObtained = Math.min(sub.practicalMax, Math.floor(baseScore / 100 * sub.practicalMax + Math.random() * 5));
      }
      if (sub.internalMax) {
        internalObtained = Math.min(sub.internalMax, Math.floor(baseScore / 100 * sub.internalMax + Math.random() * 3));
      }

      const totalObtained = (theoryObtained ?? 0) + (practicalObtained ?? 0) + (internalObtained ?? 0) ||
      Math.min(sub.maxMarks, Math.floor(baseScore / 100 * sub.maxMarks));
      const percentage = totalObtained / sub.maxMarks * 100;
      const grade = getGradeFromPercentage(percentage);
      const isPassed = totalObtained >= sub.minPassing;

      return {
        ...sub,
        theoryObtained,
        practicalObtained,
        internalObtained,
        totalObtained,
        grade,
        isPassed
      };
    });

    const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const totalObtainedMarks = subjects.reduce((sum, s) => sum + s.totalObtained, 0);
    const percentage = totalObtainedMarks / totalMaxMarks * 100;
    const failedCount = subjects.filter((s) => !s.isPassed).length;
    const resultStatus: ResultStatus = failedCount === 0 ? 'PASS' : failedCount <= 2 ? 'ATKT' : 'FAIL';

    return {
      id: idx + 1,
      seatNo: `G${session.replace('-', '')}${String(idx + 1).padStart(5, '0')}`,
      rollNo: `${classId}${section}${String(idx + 1).padStart(3, '0')}`,
      grNo: `GR-${10000 + idx}`,
      admissionNo: `ADM${session.substring(0, 4)}${String(idx + 1).padStart(4, '0')}`,
      studentName: stu.name,
      motherName: stu.mother,
      fatherName: stu.father,
      dob: `${2007 + Math.floor(Math.random() * 10)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
      gender: stu.gender,
      category: ['General', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
      classId,
      className: classInfo.name,
      section,
      stream,
      schoolName: 'Shree Sarvodaya Higher Secondary School',
      schoolCode: 'GJ-AHM-10293',
      schoolAddress: 'Nr. City Center, Navrangpura, Ahmedabad - 380009',
      centerName: 'Ahmedabad Main Center',
      centerCode: 'C-3381',
      examSession: session,
      examType,
      examDate: '2024-03-15',
      subjects,
      totalMaxMarks,
      totalObtainedMarks,
      percentage: Math.round(percentage * 100) / 100,
      overallGrade: getGradeFromPercentage(percentage),
      rank: idx + 1,
      resultStatus,
      remarks: resultStatus === 'PASS' ? 'Promoted to next class' : resultStatus === 'ATKT' ? 'Allowed to keep terms' : 'Detained',
      attendance: {
        totalDays: 220,
        presentDays: 180 + Math.floor(Math.random() * 35),
        percentage: 0
      }
    };
  }).map((s) => ({
    ...s,
    attendance: {
      ...s.attendance,
      percentage: Math.round(s.attendance.presentDays / s.attendance.totalDays * 100 * 10) / 10
    }
  })).sort((a, b) => b.percentage - a.percentage).map((s, idx) => ({ ...s, rank: idx + 1 }));
};

// ============================================
// UI Components
// ============================================

const Card: React.FC<{children: React.ReactNode;className?: string;title?: string;}> = ({ children, className = '', title }) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {title &&
  <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
  }
    <div className="p-6">{children}</div>
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
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
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>

      {children}
    </button>);

};

const Badge: React.FC<{children: React.ReactNode;variant?: string;className?: string;}> = ({ children, variant = 'default', className = '' }) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>);

};

const Input: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  type?: string;
}> = ({ value, onChange, placeholder, label, leftIcon, className = '', type = 'text' }) =>
<div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{leftIcon}</div>}
      <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${leftIcon ? 'pl-10' : ''}`} />

    </div>
  </div>;


const Select: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {value: string;label: string;}[];
  label?: string;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, options, label, className = '', placeholder }) =>
<div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) =>
    <option key={opt.value} value={opt.value}>{opt.label}</option>
    )}
    </select>
  </div>;


// ============================================
// Mark Sheet Component (Printable)
// ============================================

const MarkSheetReport: React.FC<{
  student: StudentRecord;
  watermarkEnabled: boolean;
  watermarkText: string;
  showConfidential: boolean;
}> = ({ student, watermarkEnabled, watermarkText, showConfidential }) => {
  const classInfo = allClasses.find((c) => c.id === student.classId);

  return (
    <div className="marksheet-page relative bg-white text-gray-900 print:shadow-none">
      {/* Watermark */}
      {watermarkEnabled &&
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-gray-200 font-extrabold text-8xl tracking-widest transform -rotate-30 opacity-20 select-none">
            {watermarkText || 'GSEB'}
          </div>
        </div>
      }

      {/* Confidential Stamp */}
      {showConfidential &&
      <div className="absolute top-16 right-8 transform rotate-12 border-4 border-red-500 text-red-500 font-bold text-lg px-4 py-2 opacity-60">
          CONFIDENTIAL
        </div>
      }

      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 border-2 border-gray-800 flex items-center justify-center bg-gray-50">
              <School className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 uppercase">Gujarat Secondary & Higher Secondary Education Board</h1>
              <p className="text-sm font-medium text-gray-600">Gandhinagar, Gujarat - 382016</p>
              <div className="mt-2 flex items-center gap-4">
                <Badge variant="info" className="text-sm px-3 py-1">
                  {student.examType}
                </Badge>
                <span className="text-sm text-gray-600">Session: {student.examSession}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Seat Number</div>
            <div className="text-2xl font-bold border-2 border-gray-800 px-4 py-2 inline-block">
              {student.seatNo}
            </div>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-12 gap-4 mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <div className="col-span-9 p-4 border-r border-gray-300">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Student Name</p>
              <p className="font-bold text-gray-900">{student.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Father's Name</p>
              <p className="font-semibold text-gray-800">{student.fatherName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Mother's Name</p>
              <p className="font-semibold text-gray-800">{student.motherName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
              <p className="font-semibold text-gray-800">{student.dob}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Class / Section</p>
              <p className="font-semibold text-gray-800">{student.className} - {student.section}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Stream</p>
              <p className="font-semibold text-gray-800">{student.stream !== 'NA' ? student.stream : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Roll No / GR No</p>
              <p className="font-semibold text-gray-800">{student.rollNo} / {student.grNo}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 mb-1">School</p>
              <p className="font-semibold text-gray-800">{student.schoolName}</p>
              <p className="text-xs text-gray-500">{student.schoolCode}</p>
            </div>
          </div>
        </div>
        <div className="col-span-3 p-4 bg-gray-50 flex flex-col items-center justify-center">
          <div className="w-24 h-28 border border-gray-300 bg-white flex items-center justify-center mb-2">
            <Users className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-xs text-gray-500">Student Photo</p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300 w-20">Code</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">Subject</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-16">Max</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-16">Min</th>
              {student.subjects.some((s) => s.theoryMax) &&
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-20">Theory</th>
              }
              {student.subjects.some((s) => s.practicalMax) &&
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-20">Practical</th>
              }
              {student.subjects.some((s) => s.internalMax) &&
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-20">Internal</th>
              }
              <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 w-16">Total</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 w-16">Grade</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((sub, idx) =>
            <tr key={idx} className={`border-b border-gray-200 ${!sub.isPassed ? 'bg-red-50' : ''}`}>
                <td className="px-3 py-2 font-mono text-gray-700 border-r border-gray-300">{sub.subjectCode}</td>
                <td className="px-3 py-2 text-gray-900 border-r border-gray-300">{sub.subjectName}</td>
                <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-300">{sub.maxMarks}</td>
                <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-300">{sub.minPassing}</td>
                {student.subjects.some((s) => s.theoryMax) &&
              <td className="px-3 py-2 text-center border-r border-gray-300">
                    {sub.theoryObtained !== undefined ?
                <span>{sub.theoryObtained}/{sub.theoryMax}</span> :
                '-'}
                  </td>
              }
                {student.subjects.some((s) => s.practicalMax) &&
              <td className="px-3 py-2 text-center border-r border-gray-300">
                    {sub.practicalObtained !== undefined ?
                <span>{sub.practicalObtained}/{sub.practicalMax}</span> :
                '-'}
                  </td>
              }
                {student.subjects.some((s) => s.internalMax) &&
              <td className="px-3 py-2 text-center border-r border-gray-300">
                    {sub.internalObtained !== undefined ?
                <span>{sub.internalObtained}/{sub.internalMax}</span> :
                '-'}
                  </td>
              }
                <td className="px-3 py-2 text-center font-bold border-r border-gray-300">
                  <span className={!sub.isPassed ? 'text-red-600' : 'text-gray-900'}>{sub.totalObtained}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(sub.grade)}`}>
                    {sub.grade}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 border-t-2 border-gray-400">
              <td colSpan={2} className="px-3 py-3 font-bold text-gray-900 border-r border-gray-300">Grand Total</td>
              <td className="px-3 py-3 text-center font-bold text-gray-900 border-r border-gray-300">{student.totalMaxMarks}</td>
              <td className="px-3 py-3 text-center font-bold text-gray-700 border-r border-gray-300">-</td>
              {student.subjects.some((s) => s.theoryMax) && <td className="px-3 py-3 border-r border-gray-300"></td>}
              {student.subjects.some((s) => s.practicalMax) && <td className="px-3 py-3 border-r border-gray-300"></td>}
              {student.subjects.some((s) => s.internalMax) && <td className="px-3 py-3 border-r border-gray-300"></td>}
              <td className="px-3 py-3 text-center font-bold text-xl text-gray-900 border-r border-gray-300">{student.totalObtainedMarks}</td>
              <td className="px-3 py-3 text-center">
                <span className={`px-3 py-1 rounded font-bold ${getGradeColor(student.overallGrade)}`}>
                  {student.overallGrade}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Result Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Result Status</p>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getResultStatusColor(student.resultStatus)}`}>
            {student.resultStatus === 'PASS' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {student.resultStatus}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Percentage</p>
          <p className="text-2xl font-bold text-gray-900">{student.percentage.toFixed(2)}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Overall Grade</p>
          <span className={`inline-block px-4 py-1 rounded text-lg font-bold ${getGradeColor(student.overallGrade)}`}>
            {student.overallGrade}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Class Rank</p>
          <p className="text-2xl font-bold text-gray-900">#{student.rank}</p>
        </div>
      </div>

      {/* Attendance & Remarks */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Attendance</p>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">{student.attendance.presentDays}</span>
              <span className="text-gray-500">/{student.attendance.totalDays} days</span>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              ({student.attendance.percentage}%)
            </div>
          </div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Remarks</p>
          <p className="text-gray-800">{student.remarks}</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        <div className="text-center">
          <div className="h-12 border-b border-gray-400 mb-2"></div>
          <p className="text-sm font-semibold text-gray-700">Class Teacher</p>
        </div>
        <div className="text-center">
          <div className="h-12 border-b border-gray-400 mb-2"></div>
          <p className="text-sm font-semibold text-gray-700">Principal</p>
        </div>
        <div className="text-center">
          <div className="h-12 border-b border-gray-400 mb-2"></div>
          <p className="text-sm font-semibold text-gray-700">Board Authorized Signatory</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p className="font-semibold">Note:</p>
        <ul className="list-disc pl-5 mt-1 space-y-0.5">
          <li>This is a computer-generated statement of marks.</li>
          <li>In case of any discrepancy, please contact the school examination section.</li>
          <li>The grading system follows GSEB guidelines.</li>
        </ul>
      </div>
    </div>);

};

// ============================================
// Main Component
// ============================================

export function GSEBMarkSheetReportPage() {
  // Filter State
  const [selectedSession, setSelectedSession] = useState('2024-25');
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('Annual');
  const [selectedClassId, setSelectedClassId] = useState('C10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStream, setSelectedStream] = useState<Stream>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ResultStatus | 'ALL'>('ALL');

  // UI State
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Preview State
  const [previewStudent, setPreviewStudent] = useState<StudentRecord | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState('SAMPLE');
  const [showConfidential, setShowConfidential] = useState(false);

  // Print Ref
  const printRef = useRef<HTMLDivElement>(null);

  // Selected Class Info
  const selectedClass = useMemo(() => {
    return allClasses.find((c) => c.id === selectedClassId);
  }, [selectedClassId]);

  // Classes grouped by level
  const classesByLevel = useMemo(() => {
    const grouped: Record<ClassLevel, ClassInfo[]> = {
      'Pre-Primary': [],
      'Primary': [],
      'Middle': [],
      'Secondary': [],
      'Higher Secondary': []
    };
    allClasses.forEach((c) => grouped[c.level].push(c));
    return grouped;
  }, []);

  // Load Students
  const handleLoadStudents = () => {
    setIsLoading(true);
    setSelectedStudentIds([]);

    setTimeout(() => {
      const data = generateMockStudents(
        selectedClassId,
        selectedSection,
        selectedStream,
        selectedExamType,
        selectedSession
      );
      setStudents(data);
      setIsLoading(false);
    }, 500);
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
      s.studentName.toLowerCase().includes(query) ||
      s.seatNo.toLowerCase().includes(query) ||
      s.rollNo.toLowerCase().includes(query) ||
      s.grNo.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((s) => s.resultStatus === filterStatus);
    }

    return filtered;
  }, [students, searchQuery, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    const pass = students.filter((s) => s.resultStatus === 'PASS').length;
    const fail = students.filter((s) => s.resultStatus === 'FAIL').length;
    const atkt = students.filter((s) => s.resultStatus === 'ATKT').length;
    const avgPercentage = students.length > 0 ?
    (students.reduce((sum, s) => sum + s.percentage, 0) / students.length).toFixed(2) :
    '0.00';

    return { total: students.length, pass, fail, atkt, avgPercentage };
  }, [students]);

  // Selection Handlers
  const toggleSelectAll = () => {
    const visibleIds = filteredStudents.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedStudentIds((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // View Report Card
  const handleViewReport = (student: StudentRecord) => {
    setPreviewStudent(student);
    setShowPreviewModal(true);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export Handlers
  const handleExportPDF = () => {
    alert('Export to PDF functionality would be implemented here');
  };

  const handleExportExcel = () => {
    alert('Export to Excel functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .marksheet-page {
            page-break-after: always;
            margin: 0;
            padding: 15mm;
            border: none !important;
            box-shadow: none !important;
          }
        }
        .marksheet-page {
          width: 210mm;
          min-height: 297mm;
          padding: 12mm;
          margin: 0 auto 16px auto;
          border: 1px solid #d1d5db;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 no-print">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mark Sheet Report</h1>
              <p className="text-sm text-gray-500">View, print, and export student report cards</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} disabled={selectedStudentIds.length === 0}>
              <Printer className="w-4 h-4 mr-2" />
              Print ({selectedStudentIds.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 no-print">
        {/* Filters Section */}
        {showFilters &&
        <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  Search & Filter
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                setSearchQuery('');
                setFilterStatus('ALL');
              }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <Select
                label="Academic Session"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                options={academicSessions.map((s) => ({ value: s, label: s }))} />


                <Select
                label="Exam Type"
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
                options={examTypes.map((t) => ({ value: t, label: t }))} />


                <Select
                label="Class"
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const cls = allClasses.find((c) => c.id === e.target.value);
                  if (cls && !cls.hasStreams) {
                    setSelectedStream(cls.availableStreams[0]);
                  }
                }}
                options={allClasses.map((c) => ({ value: c.id, label: c.name }))} />


                <Select
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={sections.map((s) => ({ value: s, label: `Section ${s}` }))} />


                {selectedClass?.hasStreams &&
              <Select
                label="Stream"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value as Stream)}
                options={selectedClass.availableStreams.map((s) => ({ value: s, label: s }))} />

              }

                <div className="flex items-end">
                  <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleLoadStudents}
                  disabled={isLoading}>

                    {isLoading ?
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                  <Search className="w-4 h-4 mr-2" />
                  }
                    Load Students
                  </Button>
                </div>
              </div>

              {students.length > 0 &&
            <div className="flex flex-col lg:flex-row gap-4 pt-4 border-t border-gray-200">
                  <div className="flex-1">
                    <Input
                  placeholder="Search by Name, Seat No, Roll No, GR No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter:</span>
                    {(['ALL', 'PASS', 'FAIL', 'ATKT'] as const).map((status) =>
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filterStatus === status ?
                  'bg-indigo-600 text-white' :
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                  }>

                        {status}
                      </button>
                )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                      <List className="w-5 h-5" />
                    </button>
                    <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}>

                      <Grid3X3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
            }
            </div>
          </Card>
        }

        {/* Stats Cards */}
        {students.length > 0 &&
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Students</p>
                </div>
                <Users className="w-8 h-8 text-gray-300" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.pass}</p>
                  <p className="text-xs text-gray-500">Passed</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.fail}</p>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.atkt}</p>
                  <p className="text-xs text-gray-500">ATKT</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{stats.avgPercentage}%</p>
                  <p className="text-xs text-gray-500">Avg. Percentage</p>
                </div>
                <Award className="w-8 h-8 text-indigo-200" />
              </div>
            </Card>
          </div>
        }

        {/* Student List */}
        {students.length > 0 ?
        <Card>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-gray-900">
                  {selectedClass?.name} - Section {selectedSection}
                  {selectedClass?.hasStreams && ` (${selectedStream})`}
                </h3>
                <Badge variant="info">{selectedExamType}</Badge>
                <Badge variant="default">{selectedSession}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Showing {filteredStudents.length} of {students.length}
                </span>
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  {filteredStudents.every((s) => selectedStudentIds.includes(s.id)) ?
                'Deselect All' :
                'Select All'}
                </Button>
              </div>
            </div>

            {viewMode === 'list' ?
          <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && filteredStudents.every((s) => selectedStudentIds.includes(s.id))}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300" />

                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Rank</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Seat No</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Roll No</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Student Name</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Marks</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Percentage</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Result</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) =>
                <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleSelectOne(student.id)}
                      className="rounded border-gray-300" />

                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                            #{student.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-gray-900">{student.seatNo}</td>
                        <td className="px-4 py-3 text-gray-600">{student.rollNo}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-gray-900">{student.studentName}</p>
                            <p className="text-xs text-gray-500">GR: {student.grNo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-semibold">{student.totalObtainedMarks}</span>
                          <span className="text-gray-500">/{student.totalMaxMarks}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-900">
                          {student.percentage.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getGradeColor(student.overallGrade)}`}>
                            {student.overallGrade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getResultStatusColor(student.resultStatus)}`}>
                            {student.resultStatus === 'PASS' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {student.resultStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="xs" onClick={() => handleViewReport(student)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="xs" onClick={() => {
                        setSelectedStudentIds([student.id]);
                        setTimeout(handlePrint, 100);
                      }}>
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="xs">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div> :

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStudents.map((student) =>
            <div
              key={student.id}
              className={`p-4 border rounded-xl transition-all cursor-pointer ${
              selectedStudentIds.includes(student.id) ?
              'border-indigo-500 bg-indigo-50' :
              'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`
              }
              onClick={() => toggleSelectOne(student.id)}>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{student.studentName}</p>
                          <p className="text-xs text-gray-500">{student.seatNo}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getResultStatusColor(student.resultStatus)}`}>
                        {student.resultStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{student.percentage.toFixed(1)}%</p>
                        <p className="text-[10px] text-gray-500">Percentage</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className={`text-lg font-bold ${getGradeColor(student.overallGrade).split(' ')[0]}`}>
                          {student.overallGrade}
                        </p>
                        <p className="text-[10px] text-gray-500">Grade</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-indigo-600">#{student.rank}</p>
                        <p className="text-[10px] text-gray-500">Rank</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {student.totalObtainedMarks}/{student.totalMaxMarks}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(student);
                    }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">

                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
            )}
              </div>
          }
          </Card> :

        <Card className="p-16 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Loaded</h3>
            <p className="text-gray-500 mb-4">
              Select class, section, exam type and click "Load Students" to view report cards
            </p>
          </Card>
        }
      </div>

      {/* Preview Modal */}
      {showPreviewModal && previewStudent &&
      <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPreviewModal(false)} />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-10">
            <div className="relative bg-gray-100 rounded-xl shadow-2xl max-w-4xl w-full">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Report Card Preview</h2>
                  <p className="text-sm text-gray-500">{previewStudent.studentName} - {previewStudent.seatNo}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                      className="rounded border-gray-300" />

                      Watermark
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                      type="checkbox"
                      checked={showConfidential}
                      onChange={(e) => setShowConfidential(e.target.checked)}
                      className="rounded border-gray-300" />

                      Confidential
                    </label>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                  setSelectedStudentIds([previewStudent.id]);
                  handlePrint();
                }}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg">

                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                <MarkSheetReport
                student={previewStudent}
                watermarkEnabled={watermarkEnabled}
                watermarkText={watermarkText}
                showConfidential={showConfidential} />

              </div>
            </div>
          </div>
        </div>
      }

      {/* Print Area */}
      <div className="print-area" ref={printRef}>
        {selectedStudentIds.map((id) => {
          const student = students.find((s) => s.id === id);
          if (!student) return null;
          return (
            <MarkSheetReport
              key={id}
              student={student}
              watermarkEnabled={watermarkEnabled}
              watermarkText={watermarkText}
              showConfidential={showConfidential} />);


        })}
      </div>
    </div>);

}

export default GSEBMarkSheetReportPage;