import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  AlertCircle,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  ChevronRight,
  Calendar,
  Layers,
  GraduationCap,
  BookOpen,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Eye,
  X,
  ChevronDown,
  ChevronLeft,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  File,
  FolderOpen,
  Hash,
  User,
  School,
  ClipboardList,
  Table,
  LayoutList,
  FileCheck,
  Stamp,
  Signature,
  Building2,
  Shield,
  BookMarked,
  ListChecks,
  BarChart2,
  PenTool,
  Send,
  RefreshCw,
  Settings,
  Info,
  Star,
  Medal,
  Crown,
  UserCheck,
  Percent,
  Calculator,
  Minus } from
'lucide-react';

// ============================================
// Types
// ============================================

interface Student {
  id: string;
  grNo: string;
  uid: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  category: string;
  subjects: SubjectMark[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  division: string;
  result: 'Pass' | 'Fail' | 'Compartment';
  rank: number;
  attendance: number;
}

interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  theoryMax: number;
  theoryObtained: number;
  practicalMax: number;
  practicalObtained: number;
  internalMax: number;
  internalObtained: number;
  totalMax: number;
  totalObtained: number;
  grade: string;
  isPassed: boolean;
}

interface SubjectAnalysis {
  subjectCode: string;
  subjectName: string;
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  passPercentage: number;
  highest: number;
  lowest: number;
  average: number;
  median: number;
  standardDeviation: number;
  gradeDistribution: {grade: string;count: number;percentage: number;}[];
  rangeDistribution: {range: string;count: number;}[];
}

interface ClassSummary {
  class: string;
  section: string;
  totalStudents: number;
  appeared: number;
  passed: number;
  failed: number;
  compartment: number;
  passPercentage: number;
  distinctionCount: number;
  firstDivision: number;
  secondDivision: number;
  thirdDivision: number;
  classAverage: number;
  topperName: string;
  topperPercentage: number;
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{className?: string;}>;
  category: 'student' | 'class' | 'subject' | 'official';
  formats: string[];
  mandatory: boolean;
}

// ============================================
// Constants
// ============================================

const classOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const sectionOptions = ['A', 'B', 'C', 'D', 'E'];
const examOptions = ['Annual Exam 2024', 'Half Yearly 2024', 'Unit Test 3', 'Unit Test 2', 'Unit Test 1'];
const academicYearOptions = ['2024-2025', '2023-2024', '2022-2023'];
const subjectsList = [
{ code: 'ENG', name: 'English', hasTheory: true, hasPractical: false, hasInternal: true },
{ code: 'HIN', name: 'Hindi', hasTheory: true, hasPractical: false, hasInternal: true },
{ code: 'MAT', name: 'Mathematics', hasTheory: true, hasPractical: false, hasInternal: true },
{ code: 'SCI', name: 'Science', hasTheory: true, hasPractical: true, hasInternal: true },
{ code: 'SST', name: 'Social Studies', hasTheory: true, hasPractical: false, hasInternal: true },
{ code: 'PHY', name: 'Physics', hasTheory: true, hasPractical: true, hasInternal: false },
{ code: 'CHE', name: 'Chemistry', hasTheory: true, hasPractical: true, hasInternal: false },
{ code: 'BIO', name: 'Biology', hasTheory: true, hasPractical: true, hasInternal: false },
{ code: 'CS', name: 'Computer Science', hasTheory: true, hasPractical: true, hasInternal: false }];


const reportTypes: ReportType[] = [
{
  id: 'final-result-register',
  name: 'Final Result Register',
  description: 'Class-wise complete result register with all student details, marks, grades, and divisions',
  icon: ClipboardList,
  category: 'class',
  formats: ['PDF', 'Excel', 'Print'],
  mandatory: true
},
{
  id: 'consolidated-summary',
  name: 'Consolidated Result Summary',
  description: 'Overall class summary with pass/fail statistics, division counts, and subject performance',
  icon: BarChart2,
  category: 'class',
  formats: ['PDF', 'Excel'],
  mandatory: true
},
{
  id: 'subject-analysis',
  name: 'Subject-wise Analysis Report',
  description: 'Detailed subject analysis with highest, lowest, average marks and grade distribution',
  icon: BookOpen,
  category: 'subject',
  formats: ['PDF', 'Excel'],
  mandatory: true
},
{
  id: 'mark-register',
  name: 'Mark Register (Bound Format)',
  description: 'Traditional bound register format for physical inspection and audit compliance',
  icon: BookMarked,
  category: 'official',
  formats: ['PDF', 'Print'],
  mandatory: true
},
{
  id: 'student-marksheet',
  name: 'Student Marksheet',
  description: 'Official marksheet format with board logo, school code, and all examination details',
  icon: FileCheck,
  category: 'student',
  formats: ['PDF', 'Print'],
  mandatory: true
},
{
  id: 'toppers-list',
  name: 'Toppers List Report',
  description: 'Merit list with top performers, rank holders, and subject toppers',
  icon: Crown,
  category: 'class',
  formats: ['PDF', 'Excel'],
  mandatory: false
},
{
  id: 'failed-students',
  name: 'Failed Students Report',
  description: 'List of failed/compartment students with subject-wise failure details',
  icon: AlertTriangle,
  category: 'student',
  formats: ['PDF', 'Excel'],
  mandatory: false
},
{
  id: 'grade-distribution',
  name: 'Grade Distribution Report',
  description: 'Complete grade-wise distribution analysis for all subjects',
  icon: PieChart,
  category: 'subject',
  formats: ['PDF', 'Excel'],
  mandatory: false
},
{
  id: 'comparative-analysis',
  name: 'Comparative Analysis Report',
  description: 'Term-wise, section-wise, or year-wise comparative performance analysis',
  icon: TrendingUp,
  category: 'class',
  formats: ['PDF', 'Excel'],
  mandatory: false
},
{
  id: 'attendance-report',
  name: 'Exam Attendance Report',
  description: 'Student attendance during examination with absent/present status',
  icon: UserCheck,
  category: 'official',
  formats: ['PDF', 'Excel'],
  mandatory: true
}];


const gradeConfig = [
{ grade: 'A1', min: 91, max: 100, points: 10, remark: 'Outstanding' },
{ grade: 'A2', min: 81, max: 90, points: 9, remark: 'Excellent' },
{ grade: 'B1', min: 71, max: 80, points: 8, remark: 'Very Good' },
{ grade: 'B2', min: 61, max: 70, points: 7, remark: 'Good' },
{ grade: 'C1', min: 51, max: 60, points: 6, remark: 'Average' },
{ grade: 'C2', min: 41, max: 50, points: 5, remark: 'Below Average' },
{ grade: 'D', min: 33, max: 40, points: 4, remark: 'Pass' },
{ grade: 'E', min: 0, max: 32, points: 0, remark: 'Fail' }];


// ============================================
// Mock Data Generation
// ============================================

const generateMockStudents = (cls: string, section: string, count: number): Student[] => {
  const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya', 'Aadhya', 'Pari', 'Saanvi', 'Riya', 'Kavya',
  'Rohan', 'Kabir', 'Shaurya', 'Atharv', 'Advait', 'Dhruv', 'Yash', 'Arnav', 'Laksh', 'Kian',
  'Zara', 'Kiara', 'Avni', 'Prisha', 'Navya', 'Anika', 'Tara', 'Mira', 'Nisha', 'Pooja'];


  const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Nair', 'Iyer', 'Chopra',
  'Malhotra', 'Kapoor', 'Joshi', 'Menon', 'Rao', 'Das', 'Bose', 'Mukherjee', 'Bansal', 'Agarwal'];


  const fatherNames = ['Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh', 'Mukesh', 'Lokesh', 'Prakash', 'Vikash', 'Rakesh'];
  const motherNames = ['Sunita', 'Anita', 'Kavita', 'Geeta', 'Seema', 'Neeta', 'Reema', 'Meena', 'Suman', 'Poonam'];
  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fatherFirst = fatherNames[Math.floor(Math.random() * fatherNames.length)];
    const motherFirst = motherNames[Math.floor(Math.random() * motherNames.length)];
    const gender: 'Male' | 'Female' | 'Other' = i % 3 === 0 ? 'Female' : 'Male';

    // Generate subject marks
    const subjectMarks: SubjectMark[] = subjectsList.slice(0, 6).map((sub) => {
      const theoryMax = 80;
      const practicalMax = sub.hasPractical ? 20 : 0;
      const internalMax = sub.hasInternal ? 20 : 0;
      const totalMax = theoryMax + practicalMax + (sub.hasInternal ? 0 : 0); // Simplified

      const theoryObtained = Math.floor(Math.random() * 50) + 30;
      const practicalObtained = sub.hasPractical ? Math.floor(Math.random() * 10) + 10 : 0;
      const internalObtained = sub.hasInternal ? Math.floor(Math.random() * 10) + 10 : 0;
      const totalObtained = theoryObtained + practicalObtained + internalObtained;

      const percentage = totalObtained / (theoryMax + practicalMax + internalMax) * 100;
      const gradeInfo = gradeConfig.find((g) => percentage >= g.min && percentage <= g.max) || gradeConfig[gradeConfig.length - 1];

      return {
        subjectCode: sub.code,
        subjectName: sub.name,
        theoryMax,
        theoryObtained,
        practicalMax,
        practicalObtained,
        internalMax,
        internalObtained,
        totalMax: theoryMax + practicalMax + internalMax,
        totalObtained,
        grade: gradeInfo.grade,
        isPassed: percentage >= 33
      };
    });

    const totalMarks = subjectMarks.reduce((sum, s) => sum + s.totalObtained, 0);
    const maxMarks = subjectMarks.reduce((sum, s) => sum + s.totalMax, 0);
    const percentage = totalMarks / maxMarks * 100;

    const failedSubjects = subjectMarks.filter((s) => !s.isPassed).length;
    let result: 'Pass' | 'Fail' | 'Compartment' = 'Pass';
    if (failedSubjects > 2) result = 'Fail';else
    if (failedSubjects > 0) result = 'Compartment';

    let division = 'Third';
    if (percentage >= 60) division = 'First';else
    if (percentage >= 45) division = 'Second';

    const gradeInfo = gradeConfig.find((g) => percentage >= g.min && percentage <= g.max) || gradeConfig[gradeConfig.length - 1];

    students.push({
      id: `STU${String(i + 1).padStart(5, '0')}`,
      grNo: `GR${String(5000 + i).padStart(5, '0')}`,
      uid: `UID${String(2024000000 + i)}`,
      rollNo: String(i + 1),
      firstName,
      lastName,
      fatherName: `${fatherFirst} ${lastName}`,
      motherName: `${motherFirst} ${lastName}`,
      class: cls,
      section,
      gender,
      dateOfBirth: `${2008 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      subjects: subjectMarks,
      totalMarks,
      maxMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade: gradeInfo.grade,
      division,
      result,
      rank: 0,
      attendance: Math.floor(Math.random() * 10) + 90
    });
  }

  // Assign ranks
  students.sort((a, b) => b.percentage - a.percentage);
  students.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return students;
};

// Generate students for multiple sections
const generateAllStudents = (): Student[] => {
  const allStudents: Student[] = [];

  const classConfigs = [
  { cls: 'X', sections: ['A', 'B', 'C'], count: 40 },
  { cls: 'IX', sections: ['A', 'B'], count: 35 },
  { cls: 'XII', sections: ['A', 'B'], count: 30 }];


  classConfigs.forEach((config) => {
    config.sections.forEach((section) => {
      allStudents.push(...generateMockStudents(config.cls, section, config.count));
    });
  });

  return allStudents;
};

const mockStudents = generateAllStudents();

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
}> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>);

};

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: {value: string;label: string;}[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder = 'Select...', className = '' }) =>
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}>

    <option value="">{placeholder}</option>
    {options.map((opt) =>
  <option key={opt.value} value={opt.value}>{opt.label}</option>
  )}
  </select>;


const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: string;
}> = ({ value, max = 100, color = 'indigo', showLabel = false, height = 'h-2' }) => {
  const percentage = Math.min(value / max * 100, 100);

  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${colorClasses[color] || colorClasses.indigo}`}
          style={{ width: `${percentage}%` }} />

      </div>
      {showLabel &&
      <span className="text-xs text-gray-500 mt-1">{Math.round(percentage)}%</span>
      }
    </div>);

};

// ============================================
// Main Component
// ============================================

export function ResultAnalysisReport() {
  // State
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedExam, setSelectedExam] = useState('Annual Exam 2024');
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'reports'>('analysis');
  const [selectedReportCategory, setSelectedReportCategory] = useState<'all' | 'student' | 'class' | 'subject' | 'official'>('all');
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    let filtered = mockStudents.filter((s) => s.class === selectedClass);
    if (selectedSection) {
      filtered = filtered.filter((s) => s.section === selectedSection);
    }
    return filtered;
  }, [selectedClass, selectedSection]);

  // Class Summary Statistics
  const classSummary = useMemo((): ClassSummary => {
    const students = filteredStudents;
    const total = students.length;
    const passed = students.filter((s) => s.result === 'Pass').length;
    const failed = students.filter((s) => s.result === 'Fail').length;
    const compartment = students.filter((s) => s.result === 'Compartment').length;

    const distinctionCount = students.filter((s) => s.percentage >= 75).length;
    const firstDiv = students.filter((s) => s.percentage >= 60).length;
    const secondDiv = students.filter((s) => s.percentage >= 45 && s.percentage < 60).length;
    const thirdDiv = students.filter((s) => s.percentage >= 33 && s.percentage < 45).length;

    const classAvg = total > 0 ? students.reduce((sum, s) => sum + s.percentage, 0) / total : 0;

    const topper = students[0];

    return {
      class: selectedClass,
      section: selectedSection || 'All',
      totalStudents: total,
      appeared: total,
      passed,
      failed,
      compartment,
      passPercentage: total > 0 ? Math.round(passed / total * 100 * 10) / 10 : 0,
      distinctionCount,
      firstDivision: firstDiv,
      secondDivision: secondDiv,
      thirdDivision: thirdDiv,
      classAverage: Math.round(classAvg * 10) / 10,
      topperName: topper ? `${topper.firstName} ${topper.lastName}` : '-',
      topperPercentage: topper ? topper.percentage : 0
    };
  }, [filteredStudents, selectedClass, selectedSection]);

  // Subject Analysis
  const subjectAnalysis = useMemo((): SubjectAnalysis[] => {
    if (filteredStudents.length === 0) return [];

    return subjectsList.slice(0, 6).map((subject) => {
      const subjectMarks = filteredStudents.map((s) =>
      s.subjects.find((sub) => sub.subjectCode === subject.code)
      ).filter(Boolean) as SubjectMark[];

      const marks = subjectMarks.map((s) => s.totalObtained / s.totalMax * 100);
      const passed = subjectMarks.filter((s) => s.isPassed).length;
      const failed = subjectMarks.length - passed;

      const sortedMarks = [...marks].sort((a, b) => a - b);
      const median = sortedMarks.length > 0 ?
      sortedMarks[Math.floor(sortedMarks.length / 2)] :
      0;

      const avg = marks.length > 0 ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
      const variance = marks.length > 0 ?
      marks.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) / marks.length :
      0;
      const stdDev = Math.sqrt(variance);

      const gradeDistribution = gradeConfig.map((g) => ({
        grade: g.grade,
        count: subjectMarks.filter((s) => {
          const pct = s.totalObtained / s.totalMax * 100;
          return pct >= g.min && pct <= g.max;
        }).length,
        percentage: 0
      }));

      gradeDistribution.forEach((g) => {
        g.percentage = subjectMarks.length > 0 ? Math.round(g.count / subjectMarks.length * 100) : 0;
      });

      const rangeDistribution = [
      { range: '0-20', count: marks.filter((m) => m <= 20).length },
      { range: '21-40', count: marks.filter((m) => m > 20 && m <= 40).length },
      { range: '41-60', count: marks.filter((m) => m > 40 && m <= 60).length },
      { range: '61-80', count: marks.filter((m) => m > 60 && m <= 80).length },
      { range: '81-100', count: marks.filter((m) => m > 80).length }];


      return {
        subjectCode: subject.code,
        subjectName: subject.name,
        totalStudents: subjectMarks.length,
        appeared: subjectMarks.length,
        passed,
        failed,
        passPercentage: subjectMarks.length > 0 ? Math.round(passed / subjectMarks.length * 100 * 10) / 10 : 0,
        highest: Math.max(...marks, 0),
        lowest: Math.min(...marks, 0),
        average: Math.round(avg * 10) / 10,
        median: Math.round(median * 10) / 10,
        standardDeviation: Math.round(stdDev * 10) / 10,
        gradeDistribution,
        rangeDistribution
      };
    });
  }, [filteredStudents]);

  // Grade Distribution
  const gradeDistribution = useMemo(() => {
    const distribution = gradeConfig.map((g) => ({
      grade: g.grade,
      count: filteredStudents.filter((s) => s.grade === g.grade).length,
      percentage: 0,
      color: g.grade.startsWith('A') ? 'green' : g.grade.startsWith('B') ? 'blue' : g.grade === 'C1' || g.grade === 'C2' ? 'yellow' : g.grade === 'D' ? 'orange' : 'red'
    }));

    distribution.forEach((d) => {
      d.percentage = filteredStudents.length > 0 ? Math.round(d.count / filteredStudents.length * 100 * 10) / 10 : 0;
    });

    return distribution.filter((d) => d.count > 0);
  }, [filteredStudents]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    let reports = reportTypes;
    if (selectedReportCategory !== 'all') {
      reports = reports.filter((r) => r.category === selectedReportCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      reports = reports.filter((r) =>
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
      );
    }
    return reports;
  }, [selectedReportCategory, searchQuery]);

  // Handlers
  const handleGenerateReport = (report: ReportType) => {
    setSelectedReport(report);
    setShowReportPreview(true);
  };

  const handleExportReport = (format: string) => {
    alert(`Exporting ${selectedReport?.name} as ${format}...`);
  };

  const getResultBadgeVariant = (result: string): 'success' | 'danger' | 'warning' => {
    switch (result) {
      case 'Pass':return 'success';
      case 'Fail':return 'danger';
      default:return 'warning';
    }
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade === 'C1' || grade === 'C2') return 'text-yellow-600';
    if (grade === 'D') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo-600" />
              Result Analysis & Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive result analysis, government reports, and official documents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <School className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">CBSE Affiliation: 2730125</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              <Calendar className="w-3 h-3 inline mr-1" />
              Academic Year
            </label>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              options={academicYearOptions.map((y) => ({ value: y, label: y }))} />

          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              <FileText className="w-3 h-3 inline mr-1" />
              Examination
            </label>
            <Select
              value={selectedExam}
              onChange={setSelectedExam}
              options={examOptions.map((e) => ({ value: e, label: e }))} />

          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              <GraduationCap className="w-3 h-3 inline mr-1" />
              Class
            </label>
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              options={classOptions.map((c) => ({ value: c, label: `Class ${c}` }))} />

          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              <Layers className="w-3 h-3 inline mr-1" />
              Section
            </label>
            <Select
              value={selectedSection}
              onChange={setSelectedSection}
              options={sectionOptions.map((s) => ({ value: s, label: `Section ${s}` }))}
              placeholder="All Sections" />

          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              <BookOpen className="w-3 h-3 inline mr-1" />
              Subject
            </label>
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={subjectsList.map((s) => ({ value: s.code, label: s.name }))}
              placeholder="All Subjects" />

          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analysis' ?
            'bg-indigo-600 text-white' :
            'text-gray-600 hover:bg-gray-100'}`
            }>

            <BarChart2 className="w-4 h-4 inline mr-2" />
            Analysis Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports' ?
            'bg-indigo-600 text-white' :
            'text-gray-600 hover:bg-gray-100'}`
            }>

            <FileText className="w-4 h-4 inline mr-2" />
            Generate Reports
          </button>
        </div>
      </div>

      {/* Analysis Dashboard Tab */}
      {activeTab === 'analysis' &&
      <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <Badge variant="info">Total</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{classSummary.totalStudents}</p>
              <p className="text-xs text-gray-500">Students</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <Badge variant="success">{classSummary.passPercentage}%</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600">{classSummary.passed}</p>
              <p className="text-xs text-gray-500">Passed</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <Badge variant="danger">Fail</Badge>
              </div>
              <p className="text-2xl font-bold text-red-600">{classSummary.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <Badge variant="warning">Comp.</Badge>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{classSummary.compartment}</p>
              <p className="text-xs text-gray-500">Compartment</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <Badge variant="purple">75%+</Badge>
              </div>
              <p className="text-2xl font-bold text-purple-600">{classSummary.distinctionCount}</p>
              <p className="text-xs text-gray-500">Distinction</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <Badge variant="info">Avg</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600">{classSummary.classAverage}%</p>
              <p className="text-xs text-gray-500">Class Average</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Grade Distribution */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  Grade Distribution
                </h3>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-end justify-between h-48 gap-2 px-4">
                {gradeDistribution.map((item, idx) => {
                const colorMap: Record<string, string> = {
                  green: 'bg-green-500',
                  blue: 'bg-blue-500',
                  yellow: 'bg-yellow-500',
                  orange: 'bg-orange-500',
                  red: 'bg-red-500'
                };

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full relative">
                        <div
                        className={`w-full ${colorMap[item.color]} rounded-t-lg transition-all duration-500 hover:brightness-110 cursor-pointer relative`}
                        style={{ height: `${Math.max(item.percentage * 1.8, 10)}px` }}>

                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-gray-700">{item.grade}</span>
                        <p className="text-[10px] text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>);

              })}
              </div>
            </Card>

            {/* Topper & Division Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Class Topper
              </h3>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{classSummary.topperName}</p>
                    <p className="text-sm text-yellow-700">{classSummary.topperPercentage}%</p>
                  </div>
                </div>
                <Badge variant="warning">
                  <Star className="w-3 h-3 mr-1" />
                  Rank 1
                </Badge>
              </div>

              <h4 className="font-medium text-gray-700 mb-3">Division Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">First Division (60%+)</span>
                  <span className="font-bold text-green-600">{classSummary.firstDivision}</span>
                </div>
                <ProgressBar value={classSummary.firstDivision} max={classSummary.totalStudents} color="green" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Second Division (45-60%)</span>
                  <span className="font-bold text-blue-600">{classSummary.secondDivision}</span>
                </div>
                <ProgressBar value={classSummary.secondDivision} max={classSummary.totalStudents} color="blue" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Third Division (33-45%)</span>
                  <span className="font-bold text-yellow-600">{classSummary.thirdDivision}</span>
                </div>
                <ProgressBar value={classSummary.thirdDivision} max={classSummary.totalStudents} color="yellow" />
              </div>
            </Card>
          </div>

          {/* Subject Analysis Table */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Subject-wise Performance Analysis
              </h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Appeared</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Passed</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Pass %</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Highest</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Lowest</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Average</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Std Dev</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subjectAnalysis.map((subject) =>
                <tr key={subject.subjectCode} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 rounded-full bg-indigo-500" />
                          <div>
                            <p className="font-medium text-gray-900">{subject.subjectName}</p>
                            <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{subject.appeared}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-600 font-medium">{subject.passed}</span>
                        <span className="text-gray-400 text-xs"> / {subject.failed}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={subject.passPercentage >= 90 ? 'success' : subject.passPercentage >= 75 ? 'info' : 'warning'}>
                          {subject.passPercentage}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-600 font-bold">{Math.round(subject.highest)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-red-600 font-bold">{Math.round(subject.lowest)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-indigo-600">{subject.average}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{subject.standardDeviation}</td>
                      <td className="px-4 py-3 text-center">
                        <TrendingUp className="w-4 h-4 text-green-500 inline" />
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Top 10 Performers
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Roll No</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total Marks</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Percentage</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Grade</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Division</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.slice(0, 10).map((student) =>
                <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mx-auto ${
                    student.rank === 1 ? 'bg-yellow-500' :
                    student.rank === 2 ? 'bg-gray-400' :
                    student.rank === 3 ? 'bg-amber-600' : 'bg-indigo-500'}`
                    }>
                          {student.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">GR: {student.grNo}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{student.rollNo}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold">{student.totalMarks}</span>
                        <span className="text-gray-400">/{student.maxMarks}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-indigo-600">{student.percentage}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${getGradeColor(student.grade)}`}>{student.grade}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={student.division === 'First' ? 'success' : student.division === 'Second' ? 'info' : 'warning'}>
                          {student.division}
                        </Badge>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      }

      {/* Reports Tab */}
      {activeTab === 'reports' &&
      <>
          {/* Report Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
          { id: 'all', label: 'All Reports', icon: FolderOpen },
          { id: 'student', label: 'Student Reports', icon: User },
          { id: 'class', label: 'Class Reports', icon: Users },
          { id: 'subject', label: 'Subject Reports', icon: BookOpen },
          { id: 'official', label: 'Official/Mandatory', icon: Shield }].
          map((cat) =>
          <button
            key={cat.id}
            onClick={() => setSelectedReportCategory(cat.id as typeof selectedReportCategory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReportCategory === cat.id ?
            'bg-indigo-600 text-white' :
            'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`
            }>

                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
          )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredReports.map((report) =>
          <Card
            key={report.id}
            className={`p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
            report.mandatory ? 'border-l-red-500' : 'border-l-indigo-500'}`
            }
            onClick={() => handleGenerateReport(report)}>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
              report.category === 'official' ? 'bg-red-50 text-red-600' :
              report.category === 'student' ? 'bg-blue-50 text-blue-600' :
              report.category === 'class' ? 'bg-green-50 text-green-600' :
              'bg-purple-50 text-purple-600'}`
              }>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{report.name}</h4>
                      {report.mandatory &&
                  <Badge variant="danger" className="text-[10px]">Mandatory</Badge>
                  }
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {report.formats.map((format) =>
                    <span
                      key={format}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                      format === 'PDF' ? 'bg-red-100 text-red-700' :
                      format === 'Excel' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'}`
                      }>

                            {format}
                          </span>
                    )}
                      </div>
                      <Button variant="ghost" size="xs">
                        Generate <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
          )}
          </div>

          {/* Mandatory Reports Section */}
          <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Government / Board Mandatory Reports</h3>
                <p className="text-sm text-gray-600">Required for inspections, audits, and affiliation renewal</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportTypes.filter((r) => r.mandatory).map((report) =>
            <div
              key={report.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleGenerateReport(report)}>

                  <report.icon className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                    <p className="text-[10px] text-gray-500">Click to generate</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
            )}
            </div>
          </Card>
        </>
      }

      {/* Report Preview Modal */}
      {showReportPreview && selectedReport &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <selectedReport.icon className="w-6 h-6 text-indigo-600" />
                <div>
                  <h2 className="font-bold text-gray-900">{selectedReport.name}</h2>
                  <p className="text-sm text-gray-500">
                    Class {selectedClass}{selectedSection ? `-${selectedSection}` : ''} • {selectedExam}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedReport.formats.map((format) =>
              <Button
                key={format}
                variant={format === 'PDF' ? 'danger' : format === 'Excel' ? 'success' : 'primary'}
                size="sm"
                onClick={() => handleExportReport(format)}>

                    {format === 'PDF' ? <FileText className="w-4 h-4 mr-1" /> :
                format === 'Excel' ? <FileSpreadsheet className="w-4 h-4 mr-1" /> :
                <Printer className="w-4 h-4 mr-1" />}
                    {format}
                  </Button>
              )}
                <Button variant="ghost" onClick={() => setShowReportPreview(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content - Report Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
                {/* Report Header (Official Format) */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                  <div className="flex justify-center items-center gap-6 mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <School className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">DELHI PUBLIC SCHOOL</h1>
                      <p className="text-sm text-gray-600">Sector 45, Gurugram, Haryana - 122003</p>
                      <p className="text-xs text-gray-500">Affiliation No: 2730125 | School Code: 12345</p>
                    </div>
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <Shield className="w-10 h-10 text-gray-500" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-indigo-700 mt-4">{selectedReport.name.toUpperCase()}</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Academic Year: {selectedYear} | Examination: {selectedExam}
                  </p>
                  <p className="text-sm text-gray-600">
                    Class: {selectedClass}{selectedSection ? `-${selectedSection}` : ' (All Sections)'}
                  </p>
                </div>

                {/* Report Content Based on Type */}
                {selectedReport.id === 'final-result-register' &&
              <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-left">S.No</th>
                          <th className="border border-gray-300 px-2 py-2 text-left">Roll No</th>
                          <th className="border border-gray-300 px-2 py-2 text-left">GR No</th>
                          <th className="border border-gray-300 px-2 py-2 text-left">Student Name</th>
                          {subjectsList.slice(0, 6).map((sub) =>
                      <th key={sub.code} className="border border-gray-300 px-2 py-2 text-center">{sub.code}</th>
                      )}
                          <th className="border border-gray-300 px-2 py-2 text-center">Total</th>
                          <th className="border border-gray-300 px-2 py-2 text-center">%</th>
                          <th className="border border-gray-300 px-2 py-2 text-center">Grade</th>
                          <th className="border border-gray-300 px-2 py-2 text-center">Division</th>
                          <th className="border border-gray-300 px-2 py-2 text-center">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.slice(0, 15).map((student, idx) =>
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-2 py-1.5">{idx + 1}</td>
                            <td className="border border-gray-300 px-2 py-1.5">{student.rollNo}</td>
                            <td className="border border-gray-300 px-2 py-1.5">{student.grNo}</td>
                            <td className="border border-gray-300 px-2 py-1.5 font-medium">
                              {student.firstName} {student.lastName}
                            </td>
                            {student.subjects.map((sub) =>
                      <td key={sub.subjectCode} className="border border-gray-300 px-2 py-1.5 text-center">
                                {sub.totalObtained}
                              </td>
                      )}
                            <td className="border border-gray-300 px-2 py-1.5 text-center font-bold">{student.totalMarks}</td>
                            <td className="border border-gray-300 px-2 py-1.5 text-center font-bold">{student.percentage}%</td>
                            <td className={`border border-gray-300 px-2 py-1.5 text-center font-bold ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </td>
                            <td className="border border-gray-300 px-2 py-1.5 text-center">{student.division}</td>
                            <td className={`border border-gray-300 px-2 py-1.5 text-center font-bold ${
                      student.result === 'Pass' ? 'text-green-600' : student.result === 'Fail' ? 'text-red-600' : 'text-yellow-600'}`
                      }>
                              {student.result}
                            </td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-2 italic">... showing first 15 records of {filteredStudents.length} total</p>
                  </div>
              }

                {selectedReport.id === 'consolidated-summary' &&
              <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200">
                        <p className="text-3xl font-bold text-blue-600">{classSummary.totalStudents}</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center border border-green-200">
                        <p className="text-3xl font-bold text-green-600">{classSummary.passed}</p>
                        <p className="text-sm text-gray-600">Passed ({classSummary.passPercentage}%)</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center border border-red-200">
                        <p className="text-3xl font-bold text-red-600">{classSummary.failed}</p>
                        <p className="text-sm text-gray-600">Failed</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg text-center border border-yellow-200">
                        <p className="text-3xl font-bold text-yellow-600">{classSummary.compartment}</p>
                        <p className="text-sm text-gray-600">Compartment</p>
                      </div>
                    </div>

                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Count</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Distinction (75%+)</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{classSummary.distinctionCount}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(classSummary.distinctionCount / classSummary.totalStudents * 100)}%</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">First Division (60-75%)</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{classSummary.firstDivision - classSummary.distinctionCount}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{Math.round((classSummary.firstDivision - classSummary.distinctionCount) / classSummary.totalStudents * 100)}%</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Second Division (45-60%)</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{classSummary.secondDivision}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(classSummary.secondDivision / classSummary.totalStudents * 100)}%</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Third Division (33-45%)</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{classSummary.thirdDivision}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{Math.round(classSummary.thirdDivision / classSummary.totalStudents * 100)}%</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-bold">Class Average</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold text-indigo-600" colSpan={2}>{classSummary.classAverage}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              }

                {selectedReport.id === 'subject-analysis' &&
              <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2 text-left">Subject</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Appeared</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Passed</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Failed</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Pass %</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Highest</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Lowest</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Average</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Median</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Std Dev</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectAnalysis.map((subject, idx) =>
                    <tr key={subject.subjectCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-3 py-2 font-medium">{subject.subjectName}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{subject.appeared}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-green-600 font-medium">{subject.passed}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600 font-medium">{subject.failed}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold">{subject.passPercentage}%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-green-600">{Math.round(subject.highest)}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600">{Math.round(subject.lowest)}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold text-indigo-600">{subject.average}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{subject.median}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{subject.standardDeviation}</td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                  </div>
              }

                {selectedReport.id === 'student-marksheet' && filteredStudents[0] &&
              <div className="border-2 border-gray-400 p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold">STATEMENT OF MARKS</h3>
                      <p className="text-sm text-gray-600">{selectedExam} | {selectedYear}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <p><strong>Name:</strong> {filteredStudents[0].firstName} {filteredStudents[0].lastName}</p>
                        <p><strong>Father's Name:</strong> {filteredStudents[0].fatherName}</p>
                        <p><strong>Mother's Name:</strong> {filteredStudents[0].motherName}</p>
                      </div>
                      <div>
                        <p><strong>Roll No:</strong> {filteredStudents[0].rollNo}</p>
                        <p><strong>GR No:</strong> {filteredStudents[0].grNo}</p>
                        <p><strong>Class:</strong> {filteredStudents[0].class}-{filteredStudents[0].section}</p>
                      </div>
                    </div>

                    <table className="w-full text-sm border-collapse mb-6">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-400 px-3 py-2">Subject</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Code</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Theory</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Practical</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Internal</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Total</th>
                          <th className="border border-gray-400 px-3 py-2 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents[0].subjects.map((sub) =>
                    <tr key={sub.subjectCode}>
                            <td className="border border-gray-400 px-3 py-2">{sub.subjectName}</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">{sub.subjectCode}</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">{sub.theoryObtained}/{sub.theoryMax}</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">{sub.practicalMax > 0 ? `${sub.practicalObtained}/${sub.practicalMax}` : '-'}</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">{sub.internalMax > 0 ? `${sub.internalObtained}/${sub.internalMax}` : '-'}</td>
                            <td className="border border-gray-400 px-3 py-2 text-center font-bold">{sub.totalObtained}/{sub.totalMax}</td>
                            <td className={`border border-gray-400 px-3 py-2 text-center font-bold ${getGradeColor(sub.grade)}`}>{sub.grade}</td>
                          </tr>
                    )}
                        <tr className="bg-gray-100 font-bold">
                          <td className="border border-gray-400 px-3 py-2" colSpan={5}>Grand Total</td>
                          <td className="border border-gray-400 px-3 py-2 text-center">{filteredStudents[0].totalMarks}/{filteredStudents[0].maxMarks}</td>
                          <td className="border border-gray-400 px-3 py-2 text-center">{filteredStudents[0].grade}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="grid grid-cols-3 gap-4 text-sm text-center mb-6">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-bold text-xl text-indigo-600">{filteredStudents[0].percentage}%</p>
                        <p className="text-gray-600">Percentage</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-bold text-xl">{filteredStudents[0].division}</p>
                        <p className="text-gray-600">Division</p>
                      </div>
                      <div className={`p-3 rounded ${
                  filteredStudents[0].result === 'Pass' ? 'bg-green-50' :
                  filteredStudents[0].result === 'Fail' ? 'bg-red-50' : 'bg-yellow-50'}`
                  }>
                        <p className={`font-bold text-xl ${
                    filteredStudents[0].result === 'Pass' ? 'text-green-600' :
                    filteredStudents[0].result === 'Fail' ? 'text-red-600' : 'text-yellow-600'}`
                    }>{filteredStudents[0].result}</p>
                        <p className="text-gray-600">Result</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-300 text-center text-xs">
                      <div>
                        <div className="border-t border-gray-400 pt-2 mt-8">Class Teacher</div>
                      </div>
                      <div>
                        <div className="border-t border-gray-400 pt-2 mt-8">Examiner</div>
                      </div>
                      <div>
                        <div className="border-t border-gray-400 pt-2 mt-8">Principal</div>
                      </div>
                    </div>
                  </div>
              }

                {/* Default Preview for other reports */}
                {!['final-result-register', 'consolidated-summary', 'subject-analysis', 'student-marksheet'].includes(selectedReport.id) &&
              <div className="text-center py-12">
                    <selectedReport.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{selectedReport.name}</h3>
                    <p className="text-gray-500 mb-6">{selectedReport.description}</p>
                    <p className="text-sm text-gray-400">Click on export buttons above to generate this report</p>
                  </div>
              }

                {/* Report Footer */}
                <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <div>
                      <p>Generated on: {new Date().toLocaleString()}</p>
                      <p>Generated by: Admin</p>
                    </div>
                    <div className="text-right">
                      <p>This is a computer generated report</p>
                      <p>Page 1 of 1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Strategic Insights Footer */}
      <Card className="p-6 bg-gradient-to-r from-indigo-700 to-blue-800 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-300" />
              Strategic Performance Insights
            </h3>
            <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
              Class {selectedClass} shows <strong>{classSummary.passPercentage}%</strong> pass rate with{' '}
              <strong>{classSummary.distinctionCount}</strong> distinctions. 
              {classSummary.failed > 0 &&
              <> Mathematics and Science require targeted remediation for <strong>{classSummary.failed}</strong> students.</>
              }
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center px-4 border-r border-indigo-400/30">
              <p className="text-2xl font-black">{classSummary.failed}</p>
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Need Support</p>
            </div>
            <div className="text-center px-4 border-r border-indigo-400/30">
              <p className="text-2xl font-black">{classSummary.passed}</p>
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Promoted</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-black">{filteredStudents.filter((s) => s.percentage === 100).length}</p>
              <p className="text-[10px] text-indigo-200 uppercase font-bold">Perfect 100</p>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}

export default ResultAnalysisReport;