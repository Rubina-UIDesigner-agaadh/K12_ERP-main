// components/ViewResultScreen.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Eye,
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  School,
  Users,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  CheckSquare,
  XSquare,
  RefreshCcw,
  UploadCloud,
  FileX,
  AlertCircle,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Save,
  MessageSquare,
  Lock,
  Unlock,
  Shield,
  UserCheck,
  X,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Star,
  Info,
  AlertTriangle,
  Send,
  History,
  ExternalLink,
  Copy,
  Share2,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Percent,
  Calculator,
  PieChart,
  Activity,
  Zap,
  Crown,
  Medal,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Settings,
  HelpCircle,
  Bell,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  FileMinus,
  Layers,
  Grid,
  List,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut } from
'lucide-react';

// ============== Types ==============
interface Student {
  id: string;
  studentName: string;
  rollNo: string;
  grNo: string;
  admissionNo: string;
  class: string;
  section: string;
  branch: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  parentName: string;
  parentContact: string;
  email: string;
  address: string;
  photo?: string;
}

interface SubjectResult {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  theoryMax: number;
  theoryObtained: number;
  practicalMax: number;
  practicalObtained: number;
  internalMax: number;
  internalObtained: number;
  totalMax: number;
  totalObtained: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  classAverage: number;
  classHighest: number;
  rank: number;
  teacherName: string;
  remarks?: string;
  status: 'pass' | 'fail' | 'absent' | 'pending';
}

interface StudentResult {
  id: string;
  student: Student;
  examId: string;
  examName: string;
  examType: string;
  academicYear: string;
  term: string;
  subjects: SubjectResult[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  rank: number;
  classRank: number;
  sectionRank: number;
  status: 'published' | 'generated' | 'not_generated' | 'pending_approval' | 'rejected';
  attendance: number;
  conductGrade: string;
  remarks: string;
  teacherRemarks: string;
  principalRemarks: string;
  generatedAt?: string;
  publishedAt?: string;
  generatedBy?: string;
  publishedBy?: string;
  lastModified?: string;
  previousPercentage?: number;
  trend: 'up' | 'down' | 'stable';
}

interface FilterState {
  academicYear: string;
  branch: string;
  standard: string;
  division: string;
  examName: string;
  examType: string;
  resultStatus: string;
  searchQuery: string;
  gradeFilter: string;
  rankFilter: string;
}

// ============== Constants ==============
const ACADEMIC_YEARS = ['2022-23', '2023-24', '2024-25', '2025-26'];

const BRANCHES = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'west', name: 'West Branch' },
{ id: 'east', name: 'East Branch' },
{ id: 'north', name: 'North Branch' }];


const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DIVISIONS = ['A', 'B', 'C', 'D', 'E'];

const EXAMS = [
{ id: 'all', name: 'All Exams', type: 'all' },
{ id: 'ut1', name: 'Unit Test 1', type: 'unit' },
{ id: 'ut2', name: 'Unit Test 2', type: 'unit' },
{ id: 'ut3', name: 'Unit Test 3', type: 'unit' },
{ id: 'ut4', name: 'Unit Test 4', type: 'unit' },
{ id: 'half', name: 'Half Yearly Examination', type: 'term' },
{ id: 'final', name: 'Final Examination', type: 'term' },
{ id: 'practical', name: 'Practical Examination', type: 'practical' },
{ id: 'pre_board', name: 'Pre-Board Examination', type: 'board' }];


const RESULT_STATUSES = [
{ id: 'all', name: 'All Status', color: 'gray', icon: List },
{ id: 'published', name: 'Published', color: 'green', icon: CheckCircle },
{ id: 'generated', name: 'Generated', color: 'blue', icon: FileCheck },
{ id: 'pending_approval', name: 'Pending Approval', color: 'yellow', icon: Clock },
{ id: 'not_generated', name: 'Not Generated', color: 'orange', icon: FileMinus },
{ id: 'rejected', name: 'Rejected', color: 'red', icon: XCircle }];


const GRADE_CONFIG: Record<string, {color: string;bgColor: string;textColor: string;points: number;}> = {
  'A+': { color: '#059669', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800', points: 10 },
  'A': { color: '#10b981', bgColor: 'bg-green-100', textColor: 'text-green-800', points: 9 },
  'B+': { color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-800', points: 8 },
  'B': { color: '#6366f1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800', points: 7 },
  'C+': { color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-800', points: 6 },
  'C': { color: '#f97316', bgColor: 'bg-orange-100', textColor: 'text-orange-800', points: 5 },
  'D': { color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800', points: 4 },
  'E': { color: '#dc2626', bgColor: 'bg-red-200', textColor: 'text-red-900', points: 2 },
  'F': { color: '#991b1b', bgColor: 'bg-red-300', textColor: 'text-red-900', points: 0 },
  '-': { color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-600', points: 0 }
};

// ============== Mock Data Generation ==============
const generateMockResults = (): StudentResult[] => {
  const students = [
  { id: 'STU001', name: 'Aarav Sharma', rollNo: '101', grNo: 'GR2024001', gender: 'Male' as const },
  { id: 'STU002', name: 'Priya Patel', rollNo: '102', grNo: 'GR2024002', gender: 'Female' as const },
  { id: 'STU003', name: 'Rahul Kumar', rollNo: '103', grNo: 'GR2024003', gender: 'Male' as const },
  { id: 'STU004', name: 'Sneha Gupta', rollNo: '104', grNo: 'GR2024004', gender: 'Female' as const },
  { id: 'STU005', name: 'Vikram Singh', rollNo: '105', grNo: 'GR2024005', gender: 'Male' as const },
  { id: 'STU006', name: 'Anita Desai', rollNo: '106', grNo: 'GR2024006', gender: 'Female' as const },
  { id: 'STU007', name: 'Mohit Verma', rollNo: '107', grNo: 'GR2024007', gender: 'Male' as const },
  { id: 'STU008', name: 'Neha Reddy', rollNo: '108', grNo: 'GR2024008', gender: 'Female' as const },
  { id: 'STU009', name: 'Arjun Mehta', rollNo: '109', grNo: 'GR2024009', gender: 'Male' as const },
  { id: 'STU010', name: 'Kavya Iyer', rollNo: '110', grNo: 'GR2024010', gender: 'Female' as const },
  { id: 'STU011', name: 'Rohan Das', rollNo: '111', grNo: 'GR2024011', gender: 'Male' as const },
  { id: 'STU012', name: 'Ishita Joshi', rollNo: '112', grNo: 'GR2024012', gender: 'Female' as const },
  { id: 'STU013', name: 'Aditya Verma', rollNo: '113', grNo: 'GR2024013', gender: 'Male' as const },
  { id: 'STU014', name: 'Nisha Kapoor', rollNo: '114', grNo: 'GR2024014', gender: 'Female' as const },
  { id: 'STU015', name: 'Karan Bajaj', rollNo: '115', grNo: 'GR2024015', gender: 'Male' as const }];


  const subjects = [
  { id: 'ENG', name: 'English', code: 'ENG101', teacher: 'Mrs. Sarah Johnson' },
  { id: 'HIN', name: 'Hindi', code: 'HIN101', teacher: 'Mr. Rajesh Kumar' },
  { id: 'MAT', name: 'Mathematics', code: 'MAT101', teacher: 'Dr. Amit Sharma' },
  { id: 'SCI', name: 'Science', code: 'SCI101', teacher: 'Mrs. Priya Nair' },
  { id: 'SST', name: 'Social Studies', code: 'SST101', teacher: 'Mr. Vikram Singh' },
  { id: 'CS', name: 'Computer Science', code: 'CS101', teacher: 'Ms. Neha Gupta' }];


  const statuses: StudentResult['status'][] = ['published', 'generated', 'not_generated', 'pending_approval', 'published', 'published', 'generated'];
  const branches = ['main', 'west', 'east', 'main', 'main'];
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    if (percentage >= 25) return 'E';
    return 'F';
  };

  return students.map((student, index) => {
    const status = statuses[index % statuses.length];
    const isGenerated = status !== 'not_generated';

    const subjectResults: SubjectResult[] = subjects.map((subject) => {
      const theoryMax = 80;
      const practicalMax = 20;
      const internalMax = 20;
      const totalMax = theoryMax + practicalMax + internalMax;

      const theoryObtained = isGenerated ? Math.floor(40 + Math.random() * 40) : 0;
      const practicalObtained = isGenerated ? Math.floor(10 + Math.random() * 10) : 0;
      const internalObtained = isGenerated ? Math.floor(10 + Math.random() * 10) : 0;
      const totalObtained = theoryObtained + practicalObtained + internalObtained;
      const percentage = Math.round(totalObtained / totalMax * 100);
      const grade = isGenerated ? getGrade(percentage) : '-';

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        theoryMax,
        theoryObtained,
        practicalMax,
        practicalObtained,
        internalMax,
        internalObtained,
        totalMax,
        totalObtained,
        percentage,
        grade,
        gradePoint: GRADE_CONFIG[grade]?.points || 0,
        classAverage: 65 + Math.random() * 15,
        classHighest: 90 + Math.random() * 8,
        rank: Math.floor(Math.random() * 15) + 1,
        teacherName: subject.teacher,
        remarks: percentage >= 75 ? 'Excellent' : percentage >= 50 ? 'Good' : percentage >= 33 ? 'Needs Improvement' : 'Attention Required',
        status: percentage >= 33 ? 'pass' : 'fail'
      };
    });

    const totalMarks = subjectResults.reduce((sum, s) => sum + s.totalObtained, 0);
    const maxMarks = subjectResults.reduce((sum, s) => sum + s.totalMax, 0);
    const percentage = Math.round(totalMarks / maxMarks * 100);
    const grade = isGenerated ? getGrade(percentage) : '-';
    const previousPercentage = isGenerated ? percentage + (Math.random() * 10 - 5) : undefined;

    return {
      id: `RES${String(index + 1).padStart(4, '0')}`,
      student: {
        id: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        grNo: student.grNo,
        admissionNo: `ADM2024${String(index + 1).padStart(3, '0')}`,
        class: '10',
        section: 'A',
        branch: branches[index % branches.length],
        gender: student.gender,
        dob: '2008-05-15',
        parentName: `Mr. ${student.name.split(' ')[1] || 'Parent'}`,
        parentContact: `+91 98765${String(10000 + index).slice(-5)}`,
        email: `${student.name.toLowerCase().replace(' ', '.')}@school.edu`,
        address: 'Mumbai, Maharashtra'
      },
      examId: 'final',
      examName: 'Final Examination',
      examType: 'term',
      academicYear: '2024-25',
      term: 'Term 2',
      subjects: subjectResults,
      totalMarks: isGenerated ? totalMarks : 0,
      maxMarks,
      percentage: isGenerated ? percentage : 0,
      grade,
      gradePoint: GRADE_CONFIG[grade]?.points || 0,
      rank: isGenerated ? index + 1 : 0,
      classRank: isGenerated ? index + 1 : 0,
      sectionRank: isGenerated ? index + 1 : 0,
      status,
      attendance: 85 + Math.floor(Math.random() * 15),
      conductGrade: ['A', 'A', 'B+', 'A', 'B'][index % 5],
      remarks: isGenerated ? 'Regular and sincere student' : '',
      teacherRemarks: isGenerated ? 'Shows consistent effort' : '',
      principalRemarks: isGenerated ? 'Keep up the good work' : '',
      generatedAt: isGenerated ? '2024-03-15T10:30:00' : undefined,
      publishedAt: status === 'published' ? '2024-03-16T14:00:00' : undefined,
      generatedBy: isGenerated ? 'Admin User' : undefined,
      publishedBy: status === 'published' ? 'Principal' : undefined,
      lastModified: '2024-03-15T10:30:00',
      previousPercentage,
      trend: isGenerated ? trends[Math.floor(Math.random() * 3)] : 'stable'
    };
  }).sort((a, b) => b.percentage - a.percentage).map((r, i) => ({
    ...r,
    rank: r.status !== 'not_generated' ? i + 1 : 0,
    classRank: r.status !== 'not_generated' ? i + 1 : 0
  }));
};

// ============== Utility Functions ==============
const getGradeConfig = (grade: string) => {
  return GRADE_CONFIG[grade] || GRADE_CONFIG['-'];
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, {color: string;bgColor: string;icon: React.ReactNode;label: string;}> = {
    published: { color: 'text-green-700', bgColor: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" />, label: 'Published' },
    generated: { color: 'text-blue-700', bgColor: 'bg-blue-100', icon: <FileCheck className="w-4 h-4" />, label: 'Generated' },
    pending_approval: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
    not_generated: { color: 'text-orange-700', bgColor: 'bg-orange-100', icon: <FileMinus className="w-4 h-4" />, label: 'Not Generated' },
    rejected: { color: 'text-red-700', bgColor: 'bg-red-100', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' }
  };
  return configs[status] || configs.not_generated;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInitials = (name: string): string => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

// ============== Sub Components ==============

// Toast Notification
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const configs = {
    success: { bg: 'bg-green-500', icon: <CheckCircle className="w-5 h-5" /> },
    error: { bg: 'bg-red-500', icon: <XCircle className="w-5 h-5" /> },
    warning: { bg: 'bg-yellow-500', icon: <AlertTriangle className="w-5 h-5" /> },
    info: { bg: 'bg-blue-500', icon: <Info className="w-5 h-5" /> }
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] ${configs[type].bg} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right`}>
      {configs[type].icon}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>);

};

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-indigo-600 hover:bg-indigo-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  const iconConfigs = {
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />,
    success: <CheckCircle className="w-6 h-6 text-green-600" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
            {iconConfigs[type]}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">

            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 text-white rounded-xl transition-colors font-medium ${buttonColors[type]}`}>

            {confirmText}
          </button>
        </div>
      </div>
    </div>);

};

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showComparison?: {value: number;label: string;};
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  color,
  showComparison
}) => {
  const percentage = Math.min(value / max * 100, 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  const getColor = () => {
    if (color) return color;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden relative ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }} />

        {showComparison &&
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
          style={{ left: `${showComparison.value / max * 100}%` }}
          title={showComparison.label} />

        }
      </div>
      {showLabel &&
      <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{value}/{max}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      }
    </div>);

};

// Circular Progress
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  showValue = true,
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - value / 100 * circumference;

  const getColor = () => {
    if (value >= 75) return '#10b981';
    if (value >= 50) return '#3b82f6';
    if (value >= 33) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700" />

      </svg>
      {showValue &&
      <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{Math.round(value)}%</span>
          {label && <span className="text-xs text-gray-500">{label}</span>}
        </div>
      }
    </div>);

};

// Grade Badge
interface GradeBadgeProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  showPoints?: boolean;
}

const GradeBadge: React.FC<GradeBadgeProps> = ({ grade, size = 'md', showPoints = false }) => {
  const config = getGradeConfig(grade);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <span className={`inline-flex items-center rounded-full font-bold ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}>
        {grade}
      </span>
      {showPoints && grade !== '-' &&
      <span className="text-xs text-gray-500">({config.points} pts)</span>
      }
    </div>);

};

// Rank Badge
interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md' }) => {
  const sizeClasses = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' };

  if (rank === 0) {
    return <span className="text-gray-400">-</span>;
  }

  if (rank === 1) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg`}>
        <Crown className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </div>);

  }
  if (rank === 2) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold shadow-md`}>
        {rank}
      </div>);

  }
  if (rank === 3) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-bold shadow-md`}>
        {rank}
      </div>);

  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold`}>
      {rank}
    </div>);

};

// Trend Indicator
interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  value?: number;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, value }) => {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="w-4 h-4" />
        {value !== undefined && <span className="text-xs font-medium">+{value.toFixed(1)}%</span>}
      </div>);

  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="w-4 h-4" />
        {value !== undefined && <span className="text-xs font-medium">{value.toFixed(1)}%</span>}
      </div>);

  }
  return (
    <div className="flex items-center gap-1 text-gray-400">
      <Minus className="w-4 h-4" />
    </div>);

};

// Stat Card
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {value: number;isPositive: boolean;};
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  const colorClasses: Record<string, {bg: string;iconBg: string;}> = {
    blue: { bg: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100 text-blue-600' },
    green: { bg: 'bg-green-50 border-green-200', iconBg: 'bg-green-100 text-green-600' },
    orange: { bg: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100 text-orange-600' },
    purple: { bg: 'bg-purple-50 border-purple-200', iconBg: 'bg-purple-100 text-purple-600' },
    red: { bg: 'bg-red-50 border-red-200', iconBg: 'bg-red-100 text-red-600' },
    indigo: { bg: 'bg-indigo-50 border-indigo-200', iconBg: 'bg-indigo-100 text-indigo-600' }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl border p-5 ${colors.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend &&
          <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ?
            <ArrowUpRight className="w-4 h-4 text-green-600" /> :

            <ArrowDownRight className="w-4 h-4 text-red-600" />
            }
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          }
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>);

};

// ============== Result Preview Modal ==============
interface ResultPreviewModalProps {
  isOpen: boolean;
  result: StudentResult | null;
  onClose: () => void;
  onPublish?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDownload?: (id: string, format: 'pdf' | 'excel') => void;
  onPrint?: (id: string) => void;
}

const ResultPreviewModal: React.FC<ResultPreviewModalProps> = ({
  isOpen,
  result,
  onClose,
  onPublish,
  onEdit,
  onDownload,
  onPrint
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'analytics' | 'history'>('overview');
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !result) return null;

  const student = result.student;
  const statusConfig = getStatusConfig(result.status);
  const gradeConfig = getGradeConfig(result.grade);

  const passedSubjects = result.subjects.filter((s) => s.status === 'pass').length;
  const failedSubjects = result.subjects.filter((s) => s.status === 'fail').length;
  const totalSubjects = result.subjects.length;

  const highestSubject = result.subjects.reduce((max, s) => s.percentage > max.percentage ? s : max, result.subjects[0]);
  const lowestSubject = result.subjects.reduce((min, s) => s.percentage < min.percentage ? s : min, result.subjects[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl my-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {getInitials(student.studentName)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{student.studentName}</h2>
                <p className="text-white/80 text-sm">
                  Roll No: {student.rollNo} | GR: {student.grNo} | Class: {student.class}-{student.section}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <span className="text-white/70 text-xs">
                    {result.examName} • {result.academicYear}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {result.status === 'generated' && onPublish &&
              <button
                onClick={() => onPublish(result.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">

                  <UploadCloud className="w-4 h-4" />
                  Publish
                </button>
              }
              {onDownload &&
              <button
                onClick={() => onDownload(result.id, 'pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">

                  <Download className="w-4 h-4" />
                  Download
                </button>
              }
              {onPrint &&
              <button
                onClick={() => onPrint(result.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">

                  <Printer className="w-4 h-4" />
                  Print
                </button>
              }
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors">

                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'subjects', label: 'Subject-wise', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'history', label: 'History', icon: History }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ?
              'border-indigo-600 text-indigo-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]" ref={printRef}>
          {/* Overview Tab */}
          {activeTab === 'overview' &&
          <div className="p-6">
              {/* Result Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Total Marks</p>
                  <p className="text-2xl font-bold">{result.totalMarks}/{result.maxMarks}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Percentage</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{result.percentage}%</p>
                    <TrendIndicator
                    trend={result.trend}
                    value={result.previousPercentage ? Math.abs(result.percentage - result.previousPercentage) : undefined} />

                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Grade</p>
                  <p className="text-2xl font-bold">{result.grade}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Class Rank</p>
                  <p className="text-2xl font-bold">#{result.classRank}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Passed</p>
                  <p className="text-2xl font-bold">{passedSubjects}/{totalSubjects}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-xl p-4 text-white">
                  <p className="text-sm text-white/80">Attendance</p>
                  <p className="text-2xl font-bold">{result.attendance}%</p>
                </div>
              </div>

              {/* Student & Result Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Student Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Student Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Roll Number</p>
                      <p className="text-sm font-medium text-gray-900">{student.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">GR Number</p>
                      <p className="text-sm font-medium text-gray-900">{student.grNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Admission No</p>
                      <p className="text-sm font-medium text-gray-900">{student.admissionNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class & Section</p>
                      <p className="text-sm font-medium text-gray-900">{student.class}-{student.section}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Parent/Guardian</p>
                      <p className="text-sm font-medium text-gray-900">{student.parentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm font-medium text-gray-900">{student.parentContact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{student.email}</p>
                    </div>
                  </div>
                </div>

                {/* Examination Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    Examination Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Exam Name</p>
                      <p className="text-sm font-medium text-gray-900">{result.examName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Academic Year</p>
                      <p className="text-sm font-medium text-gray-900">{result.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Term</p>
                      <p className="text-sm font-medium text-gray-900">{result.term}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conduct Grade</p>
                      <GradeBadge grade={result.conductGrade} size="sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Generated On</p>
                      <p className="text-sm font-medium text-gray-900">{formatDateTime(result.generatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Published On</p>
                      <p className="text-sm font-medium text-gray-900">{formatDateTime(result.publishedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Subject Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Subject Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Theory</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Practical</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Internal</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">%</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Grade</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.subjects.map((subject) =>
                    <tr key={subject.subjectId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{subject.subjectName}</p>
                              <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">
                            {subject.theoryObtained}/{subject.theoryMax}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">
                            {subject.practicalObtained}/{subject.practicalMax}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-700">
                            {subject.internalObtained}/{subject.internalMax}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                            {subject.totalObtained}/{subject.totalMax}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                            {subject.percentage}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <GradeBadge grade={subject.grade} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        subject.status === 'pass' ? 'bg-green-100 text-green-700' :
                        subject.status === 'fail' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'}`
                        }>
                              {subject.status === 'pass' ? 'Pass' : subject.status === 'fail' ? 'Fail' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-indigo-50 font-semibold">
                        <td className="px-4 py-3 text-indigo-900">Total</td>
                        <td className="px-4 py-3 text-center text-indigo-900">
                          {result.subjects.reduce((s, sub) => s + sub.theoryObtained, 0)}/
                          {result.subjects.reduce((s, sub) => s + sub.theoryMax, 0)}
                        </td>
                        <td className="px-4 py-3 text-center text-indigo-900">
                          {result.subjects.reduce((s, sub) => s + sub.practicalObtained, 0)}/
                          {result.subjects.reduce((s, sub) => s + sub.practicalMax, 0)}
                        </td>
                        <td className="px-4 py-3 text-center text-indigo-900">
                          {result.subjects.reduce((s, sub) => s + sub.internalObtained, 0)}/
                          {result.subjects.reduce((s, sub) => s + sub.internalMax, 0)}
                        </td>
                        <td className="px-4 py-3 text-center text-indigo-900">
                          {result.totalMarks}/{result.maxMarks}
                        </td>
                        <td className="px-4 py-3 text-center text-indigo-900">
                          {result.percentage}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <GradeBadge grade={result.grade} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        failedSubjects === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                        }>
                            {failedSubjects === 0 ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Remarks Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Class Teacher Remarks
                  </h4>
                  <p className="text-sm text-blue-700">{result.teacherRemarks || 'No remarks'}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Principal Remarks
                  </h4>
                  <p className="text-sm text-purple-700">{result.principalRemarks || 'No remarks'}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    General Remarks
                  </h4>
                  <p className="text-sm text-green-700">{result.remarks || 'No remarks'}</p>
                </div>
              </div>
            </div>
          }

          {/* Subjects Tab */}
          {activeTab === 'subjects' &&
          <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.subjects.map((subject) => {
                const subjectGradeConfig = getGradeConfig(subject.grade);
                return (
                  <div key={subject.subjectId} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`p-4 ${subjectGradeConfig.bgColor}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-bold ${subjectGradeConfig.textColor}`}>{subject.subjectName}</h3>
                            <p className={`text-sm ${subjectGradeConfig.textColor} opacity-75`}>{subject.subjectCode}</p>
                          </div>
                          <GradeBadge grade={subject.grade} size="lg" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Theory</p>
                            <p className="text-lg font-bold text-gray-900">{subject.theoryObtained}/{subject.theoryMax}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Practical</p>
                            <p className="text-lg font-bold text-gray-900">{subject.practicalObtained}/{subject.practicalMax}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Internal</p>
                            <p className="text-lg font-bold text-gray-900">{subject.internalObtained}/{subject.internalMax}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Total Score</span>
                            <span className="text-sm font-semibold text-gray-900">{subject.totalObtained}/{subject.totalMax} ({subject.percentage}%)</span>
                          </div>
                          <ProgressBar value={subject.percentage} showLabel={false} size="md" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600">Class Average</p>
                            <p className="text-lg font-bold text-blue-700">{subject.classAverage.toFixed(1)}%</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600">Class Highest</p>
                            <p className="text-lg font-bold text-green-700">{subject.classHighest.toFixed(1)}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Rank:</span>
                            <RankBadge rank={subject.rank} size="sm" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Teacher:</span>
                            <span className="text-xs font-medium text-gray-700">{subject.teacherName}</span>
                          </div>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }

          {/* Analytics Tab */}
          {activeTab === 'analytics' &&
          <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                  <div className="flex items-center justify-center mb-6">
                    <CircularProgress value={result.percentage} size={150} strokeWidth={12} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">Passed Subjects</p>
                      <p className="text-2xl font-bold text-green-700">{passedSubjects}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600">Failed Subjects</p>
                      <p className="text-2xl font-bold text-red-700">{failedSubjects}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">Total Subjects</p>
                      <p className="text-2xl font-bold text-blue-700">{totalSubjects}</p>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Comparison */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
                  <div className="space-y-4">
                    {result.subjects.map((subject) =>
                  <div key={subject.subjectId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{subject.subjectName}</span>
                          <span className="text-sm text-gray-600">{subject.percentage}%</span>
                        </div>
                        <div className="relative">
                          <ProgressBar
                        value={subject.percentage}
                        showLabel={false}
                        size="sm"
                        showComparison={{ value: subject.classAverage, label: 'Class Avg' }} />

                        </div>
                      </div>
                  )}
                  </div>
                </div>

                {/* Best & Worst Subjects */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Strengths & Weaknesses</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Best Subject</h4>
                      </div>
                      <p className="text-lg font-bold text-green-700">{highestSubject.subjectName}</p>
                      <p className="text-sm text-green-600">{highestSubject.percentage}% • Grade {highestSubject.grade}</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-800">Needs Improvement</h4>
                      </div>
                      <p className="text-lg font-bold text-red-700">{lowestSubject.subjectName}</p>
                      <p className="text-sm text-red-600">{lowestSubject.percentage}% • Grade {lowestSubject.grade}</p>
                    </div>
                  </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(GRADE_CONFIG).filter(([g]) => g !== '-').map(([grade, config]) => {
                    const count = result.subjects.filter((s) => s.grade === grade).length;
                    if (count === 0) return null;
                    return (
                      <div key={grade} className={`px-4 py-2 rounded-xl ${config.bgColor}`}>
                          <span className={`text-lg font-bold ${config.textColor}`}>{grade}</span>
                          <span className={`ml-2 text-sm ${config.textColor}`}>×{count}</span>
                        </div>);

                  })}
                  </div>
                </div>
              </div>
            </div>
          }

          {/* History Tab */}
          {activeTab === 'history' &&
          <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Result History & Activity Log
                </h3>
                <div className="space-y-4">
                  {result.publishedAt &&
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Result Published</p>
                        <p className="text-sm text-green-700">{formatDateTime(result.publishedAt)}</p>
                        <p className="text-xs text-green-600 mt-1">Published by: {result.publishedBy}</p>
                      </div>
                    </div>
                }
                  {result.generatedAt &&
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Result Generated</p>
                        <p className="text-sm text-blue-700">{formatDateTime(result.generatedAt)}</p>
                        <p className="text-xs text-blue-600 mt-1">Generated by: {result.generatedBy}</p>
                      </div>
                    </div>
                }
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-gray-200 rounded-full">
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Last Modified</p>
                      <p className="text-sm text-gray-700">{formatDateTime(result.lastModified)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Result ID: {result.id}</span>
            </div>
            <div className="flex items-center gap-3">
              {onEdit && result.status !== 'published' &&
              <button
                onClick={() => onEdit(result.id)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">

                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              }
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">

                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

// ============== Main Component ==============
export function ViewResultScreen() {
  // State
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    academicYear: '2024-25',
    branch: 'all',
    standard: '10',
    division: 'A',
    examName: 'all',
    examType: 'all',
    resultStatus: 'all',
    searchQuery: '',
    gradeFilter: 'all',
    rankFilter: 'all'
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: string | null;direction: 'asc' | 'desc';}>({ key: 'rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toast, setToast] = useState<{message: string;type: 'success' | 'error' | 'warning' | 'info';} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
  } | null>(null);

  // Load data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(generateMockResults());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [filters.academicYear, filters.standard, filters.division]);

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return results.filter((result) => {
      const matchesBranch = filters.branch === 'all' || result.student.branch === filters.branch;
      const matchesStandard = result.student.class === filters.standard;
      const matchesDivision = result.student.section === filters.division;
      const matchesExam = filters.examName === 'all' || result.examId === filters.examName;
      const matchesStatus = filters.resultStatus === 'all' || result.status === filters.resultStatus;
      const matchesSearch =
      result.student.studentName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      result.student.grNo.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      result.student.rollNo.includes(filters.searchQuery);
      const matchesGrade = filters.gradeFilter === 'all' || result.grade === filters.gradeFilter;

      return matchesBranch && matchesStandard && matchesDivision && matchesExam && matchesStatus && matchesSearch && matchesGrade;
    });
  }, [results, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: any = sortConfig.key === 'studentName' ? a.student.studentName :
      sortConfig.key === 'rollNo' ? a.student.rollNo :
      sortConfig.key === 'grNo' ? a.student.grNo :
      (a as any)[sortConfig.key];
      let bValue: any = sortConfig.key === 'studentName' ? b.student.studentName :
      sortConfig.key === 'rollNo' ? b.student.rollNo :
      sortConfig.key === 'grNo' ? b.student.grNo :
      (b as any)[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc' ?
      String(aValue).localeCompare(String(bValue)) :
      String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Statistics
  const statistics = useMemo(() => {
    const published = filteredData.filter((r) => r.status === 'published').length;
    const generated = filteredData.filter((r) => r.status === 'generated').length;
    const pending = filteredData.filter((r) => r.status === 'pending_approval').length;
    const notGenerated = filteredData.filter((r) => r.status === 'not_generated').length;
    const avgPercentage = filteredData.filter((r) => r.status !== 'not_generated').length > 0 ?
    Math.round(filteredData.filter((r) => r.status !== 'not_generated').reduce((sum, r) => sum + r.percentage, 0) / filteredData.filter((r) => r.status !== 'not_generated').length) :
    0;

    return {
      total: filteredData.length,
      published,
      generated,
      pending,
      notGenerated,
      avgPercentage
    };
  }, [filteredData]);

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleViewResult = (result: StudentResult) => {
    setSelectedResult(result);
    setShowPreviewModal(true);
  };

  const handlePublishResult = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Publish Result',
      message: 'Are you sure you want to publish this result? This action will make the result visible to students and parents.',
      type: 'success',
      onConfirm: () => {
        setResults((prev) => prev.map((r) =>
        r.id === id ? { ...r, status: 'published', publishedAt: new Date().toISOString() } : r
        ));
        setConfirmModal(null);
        setShowPreviewModal(false);
        setToast({ message: 'Result published successfully!', type: 'success' });
      }
    });
  };

  const handleBulkPublish = () => {
    const eligibleResults = selectedRows.filter((id) => {
      const result = results.find((r) => r.id === id);
      return result && result.status === 'generated';
    });

    if (eligibleResults.length === 0) {
      setToast({ message: 'No eligible results to publish', type: 'warning' });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Bulk Publish Results',
      message: `Are you sure you want to publish ${eligibleResults.length} result(s)?`,
      type: 'success',
      onConfirm: () => {
        setResults((prev) => prev.map((r) =>
        eligibleResults.includes(r.id) ? { ...r, status: 'published', publishedAt: new Date().toISOString() } : r
        ));
        setSelectedRows([]);
        setConfirmModal(null);
        setToast({ message: `${eligibleResults.length} results published successfully!`, type: 'success' });
      }
    });
  };

  const handleBulkGenerate = () => {
    const eligibleResults = selectedRows.filter((id) => {
      const result = results.find((r) => r.id === id);
      return result && result.status === 'not_generated';
    });

    if (eligibleResults.length === 0) {
      setToast({ message: 'No eligible results to generate', type: 'warning' });
      return;
    }

    setToast({ message: `Generating ${eligibleResults.length} results...`, type: 'info' });

    setTimeout(() => {
      setResults((prev) => prev.map((r) =>
      eligibleResults.includes(r.id) ? { ...r, status: 'generated', generatedAt: new Date().toISOString() } : r
      ));
      setSelectedRows([]);
      setToast({ message: `${eligibleResults.length} results generated successfully!`, type: 'success' });
    }, 1500);
  };

  const handleDownload = (id: string, format: 'pdf' | 'excel') => {
    setToast({ message: `Downloading ${format.toUpperCase()}...`, type: 'info' });
  };

  const handlePrint = (id: string) => {
    setToast({ message: 'Preparing print view...', type: 'info' });
  };

  const handleResetFilters = () => {
    setFilters({
      academicYear: '2024-25',
      branch: 'all',
      standard: '10',
      division: 'A',
      examName: 'all',
      examType: 'all',
      resultStatus: 'all',
      searchQuery: '',
      gradeFilter: 'all',
      rankFilter: 'all'
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm Modal */}
      {confirmModal &&
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(null)} />

      }

      {/* Result Preview Modal */}
      <ResultPreviewModal
        isOpen={showPreviewModal}
        result={selectedResult}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedResult(null);
        }}
        onPublish={handlePublishResult}
        onDownload={handleDownload}
        onPrint={handlePrint} />


      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Examination</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-indigo-600 font-medium">View Results</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo-600" />
              Assessment Results
            </h1>
            <p className="text-gray-500 mt-1">
              View, analyze and manage student examination results
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              Export Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
              <FileText className="w-4 h-4 text-red-600" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white">
              <Printer className="w-4 h-4 text-gray-600" />
              Print All
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Total Students"
            value={statistics.total}
            icon={<Users className="w-6 h-6" />}
            color="blue" />

          <StatCard
            title="Published"
            value={statistics.published}
            subtitle={`${Math.round(statistics.published / statistics.total * 100) || 0}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green" />

          <StatCard
            title="Generated"
            value={statistics.generated}
            icon={<FileCheck className="w-6 h-6" />}
            color="indigo" />

          <StatCard
            title="Pending"
            value={statistics.pending}
            icon={<Clock className="w-6 h-6" />}
            color="orange" />

          <StatCard
            title="Not Generated"
            value={statistics.notGenerated}
            icon={<FileMinus className="w-6 h-6" />}
            color="red" />

          <StatCard
            title="Class Average"
            value={`${statistics.avgPercentage}%`}
            icon={<Target className="w-6 h-6" />}
            color="purple" />

        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filter Results</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">

                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">

                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showFilters ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {showFilters &&
          <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Year</label>
                  <select
                  value={filters.academicYear}
                  onChange={(e) => setFilters((prev) => ({ ...prev, academicYear: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {ACADEMIC_YEARS.map((year) =>
                  <option key={year} value={year}>{year}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch</label>
                  <select
                  value={filters.branch}
                  onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {BRANCHES.map((b) =>
                  <option key={b.id} value={b.id}>{b.name}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Standard</label>
                  <select
                  value={filters.standard}
                  onChange={(e) => setFilters((prev) => ({ ...prev, standard: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {STANDARDS.map((s) =>
                  <option key={s} value={s}>Standard {s}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Division</label>
                  <select
                  value={filters.division}
                  onChange={(e) => setFilters((prev) => ({ ...prev, division: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {DIVISIONS.map((d) =>
                  <option key={d} value={d}>Division {d}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Examination</label>
                  <select
                  value={filters.examName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, examName: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {EXAMS.map((exam) =>
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Result Status</label>
                  <select
                  value={filters.resultStatus}
                  onChange={(e) => setFilters((prev) => ({ ...prev, resultStatus: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    {RESULT_STATUSES.map((status) =>
                  <option key={status.id} value={status.id}>{status.name}</option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Filter</label>
                  <select
                  value={filters.gradeFilter}
                  onChange={(e) => setFilters((prev) => ({ ...prev, gradeFilter: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

                    <option value="all">All Grades</option>
                    {Object.keys(GRADE_CONFIG).filter((g) => g !== '-').map((grade) =>
                  <option key={grade} value={grade}>{grade}</option>
                  )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Search Student</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder="Search by Name, GR Number or Roll No..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />

                    {filters.searchQuery &&
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 &&
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                {selectedRows.length} student(s) selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
              onClick={handleBulkGenerate}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-300 bg-white text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-medium">

                <RefreshCcw className="w-4 h-4" />
                Generate Results
              </button>
              <button
              onClick={handleBulkPublish}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium">

                <UploadCloud className="w-4 h-4" />
                Publish Results
              </button>
              <button
              onClick={() => setSelectedRows([])}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">

                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        }

        {/* Results Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-12 py-4 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && paginatedData.every((row) => selectedRows.includes(row.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                  </th>
                  <th
                    className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('rollNo')}>

                    <div className="flex items-center gap-1">
                      Roll No
                      {sortConfig.key === 'rollNo' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                      }
                    </div>
                  </th>
                  <th
                    className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('studentName')}>

                    <div className="flex items-center gap-1">
                      Student Name
                      {sortConfig.key === 'studentName' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                      }
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase">GR Number</th>
                  <th
                    className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('totalMarks')}>

                    <div className="flex items-center justify-center gap-1">
                      Marks
                      {sortConfig.key === 'totalMarks' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                      }
                    </div>
                  </th>
                  <th
                    className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('percentage')}>

                    <div className="flex items-center justify-center gap-1">
                      Percentage
                      {sortConfig.key === 'percentage' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                      }
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Grade</th>
                  <th
                    className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900"
                    onClick={() => handleSort('rank')}>

                    <div className="flex items-center justify-center gap-1">
                      Rank
                      {sortConfig.key === 'rank' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
                      }
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="py-4 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ?
                <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <RefreshCcw className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
                        <span>Loading results...</span>
                      </div>
                    </td>
                  </tr> :
                paginatedData.length === 0 ?
                <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FileX className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium text-gray-900">No results found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
                        <button
                        onClick={handleResetFilters}
                        className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">

                          <RotateCcw className="w-4 h-4" />
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr> :

                paginatedData.map((result) => {
                  const statusConfig = getStatusConfig(result.status);
                  const isNotGenerated = result.status === 'not_generated';

                  return (
                    <tr
                      key={result.id}
                      className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(result.id) ? 'bg-indigo-50' : ''}`}>

                        <td className="py-4 px-4">
                          <input
                          type="checkbox"
                          checked={selectedRows.includes(result.id)}
                          onChange={() => handleSelectRow(result.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />

                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">{result.student.rollNo}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(result.student.studentName)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{result.student.studentName}</p>
                              <p className="text-xs text-gray-500">{result.student.class}-{result.student.section}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 font-mono">{result.student.grNo}</td>
                        <td className="py-4 px-4 text-center">
                          {isNotGenerated ?
                        <span className="text-gray-400">-</span> :

                        <span className="text-sm font-medium text-gray-900">{result.totalMarks}/{result.maxMarks}</span>
                        }
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isNotGenerated ?
                        <span className="text-gray-400">-</span> :

                        <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{result.percentage}%</span>
                              <TrendIndicator trend={result.trend} />
                            </div>
                        }
                        </td>
                        <td className="py-4 px-4 text-center">
                          <GradeBadge grade={result.grade} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isNotGenerated ?
                        <span className="text-gray-400">-</span> :

                        <RankBadge rank={result.rank} />
                        }
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {!isNotGenerated ?
                          <>
                                <button
                              onClick={() => handleViewResult(result)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Result">

                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                              onClick={() => handleDownload(result.id, 'pdf')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download PDF">

                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                              onClick={() => handlePrint(result.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Print">

                                  <Printer className="w-4 h-4" />
                                </button>
                                {result.status === 'generated' &&
                            <button
                              onClick={() => handlePublishResult(result.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Publish">

                                    <UploadCloud className="w-4 h-4" />
                                  </button>
                            }
                              </> :

                          <button
                            onClick={() => {
                              setToast({ message: 'Generating result...', type: 'info' });
                              setTimeout(() => {
                                setResults((prev) => prev.map((r) =>
                                r.id === result.id ? { ...r, status: 'generated', generatedAt: new Date().toISOString() } : r
                                ));
                                setToast({ message: 'Result generated successfully!', type: 'success' });
                              }, 1500);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">

                                <RefreshCcw className="w-3 h-3" />
                                Generate
                              </button>
                          }
                          </div>
                        </td>
                      </tr>);

                })
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">

                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
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
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum ?
                      'bg-indigo-600 text-white' :
                      'border border-gray-200 hover:bg-gray-50'}`
                      }>

                      {pageNum}
                    </button>);

                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Role-based access control active. Only authorized personnel can view, generate or publish results.</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Last sync: {formatDateTime(new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    </div>);

}

export default ViewResultScreen;