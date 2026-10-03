import React, { useState, useMemo } from 'react';
import {
  Palette,
  Save,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings2,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Calculator,
  Info,
  History,
  Target,
  Lightbulb,
  FileText,
  Layers,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Award,
  Sparkles,
  BookOpen,
  BarChart3,
  Copy,
  Download,
  Upload,
  Filter,
  Users,
  Calendar,
  GraduationCap,
  School,
  Building2,
  RefreshCcw,
  Lock,
  Unlock,
  X,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Percent,
  Star,
  ClipboardList,
  Presentation,
  FlaskConical,
  Globe,
  Microscope,
  PenTool,
  Music,
  Dumbbell,
  Code,
  MessageSquare,
  Send,
  Clock,
  XCircle,
  Paperclip,
  ChevronUp } from
'lucide-react';

// ============ TYPE DEFINITIONS ============

type ProjectType = 'INVESTIGATORY' | 'MODEL' | 'PORTFOLIO' | 'ART' | 'PRACTICAL' | 'ACTIVITY' | 'PRESENTATION' | 'ASSIGNMENT';
type EntryStatus = 'pending' | 'draft' | 'submitted' | 'approved' | 'rejected';
type EntryMode = 'marks' | 'rubric';
type GradeType = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

interface RubricLevel {
  id: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
}

interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxMarks: number;
  weight: number;
}

interface ProjectConfig {
  id: string;
  name: string;
  type: ProjectType;
  maxMarks: number;
  subjectId: string;
  subjectName: string;
  description: string;
  rubrics: RubricCriteria[];
  isActive: boolean;
}

interface StudentAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface StudentProjectEntry {
  studentId: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  section: string;
  marks: number | null;
  rubricScores: Record<string, number>;
  totalMarks: number;
  percentage: number;
  grade: GradeType | null;
  status: EntryStatus;
  teacherRemark: string;
  submittedOn?: string;
  evaluatedOn?: string;
  attachments: StudentAttachment[];
}

interface FilterState {
  academicYear: string;
  term: string;
  standard: number | 'all';
  section: string | 'all';
  subject: string | 'all';
  projectType: ProjectType | 'all';
  entryStatus: EntryStatus | 'all';
  searchQuery: string;
}

interface GradeMapping {
  grade: GradeType;
  label: string;
  minPercent: number;
  maxPercent: number;
  color: string;
  bg: string;
  text: string;
}

// ============ CONSTANTS ============

const projectTypeConfig: Record<ProjectType, {label: string;icon: React.ElementType;bg: string;text: string;}> = {
  INVESTIGATORY: { label: 'Investigatory Project', icon: Microscope, bg: 'bg-purple-100', text: 'text-purple-700' },
  MODEL: { label: 'Model Making', icon: Layers, bg: 'bg-blue-100', text: 'text-blue-700' },
  PORTFOLIO: { label: 'Portfolio', icon: FileText, bg: 'bg-teal-100', text: 'text-teal-700' },
  ART: { label: 'Art/Craft Project', icon: Palette, bg: 'bg-rose-100', text: 'text-rose-700' },
  PRACTICAL: { label: 'Practical Work', icon: FlaskConical, bg: 'bg-green-100', text: 'text-green-700' },
  ACTIVITY: { label: 'Activity Based', icon: Sparkles, bg: 'bg-amber-100', text: 'text-amber-700' },
  PRESENTATION: { label: 'Presentation', icon: Presentation, bg: 'bg-indigo-100', text: 'text-indigo-700' },
  ASSIGNMENT: { label: 'Assignment', icon: ClipboardList, bg: 'bg-cyan-100', text: 'text-cyan-700' }
};

const gradeMapping: GradeMapping[] = [
{ grade: 'A+', label: 'Excellent', minPercent: 90, maxPercent: 100, color: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-700' },
{ grade: 'A', label: 'Very Good', minPercent: 80, maxPercent: 89, color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700' },
{ grade: 'B+', label: 'Good', minPercent: 70, maxPercent: 79, color: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
{ grade: 'B', label: 'Satisfactory', minPercent: 60, maxPercent: 69, color: 'bg-sky-500', bg: 'bg-sky-100', text: 'text-sky-700' },
{ grade: 'C+', label: 'Average', minPercent: 50, maxPercent: 59, color: 'bg-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-700' },
{ grade: 'C', label: 'Below Average', minPercent: 40, maxPercent: 49, color: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' },
{ grade: 'D', label: 'Marginal', minPercent: 33, maxPercent: 39, color: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700' },
{ grade: 'F', label: 'Fail', minPercent: 0, maxPercent: 32, color: 'bg-red-700', bg: 'bg-red-200', text: 'text-red-800' }];


const rubricLevels: RubricLevel[] = [
{ id: 'l1', name: 'Excellent', description: 'Exceeds all expectations', minScore: 90, maxScore: 100, color: 'green' },
{ id: 'l2', name: 'Good', description: 'Meets expectations well', minScore: 75, maxScore: 89, color: 'blue' },
{ id: 'l3', name: 'Satisfactory', description: 'Partially meets expectations', minScore: 60, maxScore: 74, color: 'yellow' },
{ id: 'l4', name: 'Needs Improvement', description: 'Below expectations', minScore: 40, maxScore: 59, color: 'orange' },
{ id: 'l5', name: 'Poor', description: 'Does not meet expectations', minScore: 0, maxScore: 39, color: 'red' }];


const subjects = [
{ id: 'ENG', name: 'English', code: '101' },
{ id: 'HIN', name: 'Hindi', code: '102' },
{ id: 'MATH', name: 'Mathematics', code: '201' },
{ id: 'PHY', name: 'Physics', code: '301' },
{ id: 'CHEM', name: 'Chemistry', code: '302' },
{ id: 'BIO', name: 'Biology', code: '303' },
{ id: 'HIST', name: 'History', code: '401' },
{ id: 'GEO', name: 'Geography', code: '402' },
{ id: 'CS', name: 'Computer Science', code: '501' },
{ id: 'ENV', name: 'Environmental Science', code: '601' }];


const terms = [
{ id: 'sem1', name: 'Semester 1', shortName: 'S1' },
{ id: 'sem2', name: 'Semester 2', shortName: 'S2' }];


const REMARK_TEMPLATES = [
'Excellent work! Shows thorough understanding and creativity.',
'Good effort. Demonstrates solid grasp of concepts.',
'Satisfactory work. Some areas need improvement.',
'Needs improvement in research and presentation.',
'Outstanding project! Exceptional in all criteria.',
'Well-organized and clearly presented.',
'Creative approach but needs more technical depth.',
'Good research but presentation could be improved.',
'Shows potential. Encourage to participate more actively.',
'Incomplete submission. Please resubmit with required components.'];


// ============ UTILITY FUNCTIONS ============

const getGradeFromPercent = (percent: number): GradeType => {
  for (const g of gradeMapping) {
    if (percent >= g.minPercent) return g.grade;
  }
  return 'F';
};

const getPercentFromGrade = (grade: GradeType): number => {
  const mapping: Record<GradeType, number> = {
    'A+': 95, 'A': 85, 'B+': 75, 'B': 65, 'C+': 55, 'C': 45, 'D': 35, 'F': 25
  };
  return mapping[grade] || 0;
};

const getGradeConfig = (grade: GradeType | null): GradeMapping | undefined => {
  if (!grade) return undefined;
  return gradeMapping.find((g) => g.grade === grade);
};

const getLevelColorClass = (color: string): string => {
  const colors: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };
  return colors[color] || 'bg-gray-500';
};

const getLevelBgClass = (color: string): string => {
  const colors: Record<string, string> = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    orange: 'border-orange-200 bg-orange-50',
    red: 'border-red-200 bg-red-50'
  };
  return colors[color] || 'border-gray-200 bg-gray-50';
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getInitials = (name: string): string => {
  return name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2);
};

// ============ MOCK DATA ============

const generateMockRubrics = (): RubricCriteria[] => [
{ id: 'r1', name: 'Research & Content', description: 'Quality and depth of research', maxMarks: 25, weight: 25 },
{ id: 'r2', name: 'Creativity & Innovation', description: 'Original ideas and creative presentation', maxMarks: 20, weight: 20 },
{ id: 'r3', name: 'Presentation & Organization', description: 'Structure, clarity, visual appeal', maxMarks: 20, weight: 20 },
{ id: 'r4', name: 'Technical Skills', description: 'Application of subject knowledge', maxMarks: 20, weight: 20 },
{ id: 'r5', name: 'Communication & Viva', description: 'Oral presentation skills', maxMarks: 15, weight: 15 }];


const generateMockProjects = (): ProjectConfig[] => [
{
  id: 'P001',
  name: 'Environmental Sustainability Project',
  type: 'INVESTIGATORY',
  maxMarks: 100,
  subjectId: 'ENV',
  subjectName: 'Environmental Science',
  description: 'Research-based project on environmental sustainability',
  rubrics: generateMockRubrics(),
  isActive: true
},
{
  id: 'P002',
  name: 'Mathematical Modeling',
  type: 'MODEL',
  maxMarks: 100,
  subjectId: 'MATH',
  subjectName: 'Mathematics',
  description: 'Create mathematical models for real-world problems',
  rubrics: generateMockRubrics(),
  isActive: true
},
{
  id: 'P003',
  name: 'History Research Paper',
  type: 'ASSIGNMENT',
  maxMarks: 100,
  subjectId: 'HIST',
  subjectName: 'History',
  description: 'Research paper on Indian Independence Movement',
  rubrics: generateMockRubrics(),
  isActive: true
}];


const generateMockStudents = (count: number = 30): StudentProjectEntry[] => {
  const names = [
  'Aarav Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Gupta', 'Arjun Singh',
  'Kavya Reddy', 'Vikram Malhotra', 'Ananya Iyer', 'Rohan Mehta', 'Ishita Joshi',
  'Aditya Vardhan', 'Meera Nair', 'Sanjay Das', 'Divya Kapoor', 'Karan Bhatt',
  'Simran Saxena', 'Amit Pandey', 'Neha Desai', 'Siddharth Roy', 'Pallavi Sinha',
  'Mohit Gupta', 'Riya Kaur', 'Raj Mishra', 'Tanya Advani', 'Yash Chopra',
  'Nisha Patil', 'Varun Agarwal', 'Kiara Malhotra', 'Aryan Verma', 'Diya Shah'];


  const sections = ['A', 'B', 'C'];

  return names.slice(0, count).map((name, idx) => {
    const section = sections[idx % 3];
    const rollNo = String(idx + 1).padStart(2, '0');

    // Random data generation
    const hasData = Math.random() > 0.3;
    const rubricScores = hasData ? {
      r1: Math.floor(Math.random() * 26),
      r2: Math.floor(Math.random() * 21),
      r3: Math.floor(Math.random() * 21),
      r4: Math.floor(Math.random() * 21),
      r5: Math.floor(Math.random() * 16)
    } : {};

    const totalMarks = Object.values(rubricScores).reduce((a: number, b) => a + (b as number), 0);
    const percentage = totalMarks;
    const grade = totalMarks > 0 ? getGradeFromPercent(percentage) : null;

    let status: EntryStatus = 'pending';
    if (hasData) {
      const rand = Math.random();
      if (rand > 0.7) status = 'approved';else
      if (rand > 0.5) status = 'submitted';else
      if (rand > 0.3) status = 'draft';else
      if (rand > 0.1) status = 'rejected';
    }

    const attachments: StudentAttachment[] = hasData && Math.random() > 0.5 ? [
    { id: `a${idx}1`, name: 'project_report.pdf', type: 'pdf', size: `${(Math.random() * 5 + 1).toFixed(1)} MB` },
    ...(Math.random() > 0.7 ? [{ id: `a${idx}2`, name: 'presentation.pptx', type: 'pptx', size: `${(Math.random() * 8 + 2).toFixed(1)} MB` }] : [])] :
    [];

    return {
      studentId: `STU${String(idx + 1).padStart(4, '0')}`,
      rollNo,
      name,
      admissionNo: `ADM/2024/${String(idx + 1).padStart(4, '0')}`,
      section,
      marks: totalMarks || null,
      rubricScores,
      totalMarks,
      percentage,
      grade,
      status,
      teacherRemark: hasData && status !== 'pending' ? REMARK_TEMPLATES[Math.floor(Math.random() * REMARK_TEMPLATES.length)] : '',
      submittedOn: hasData ? new Date(Date.now() - Math.random() * 86400000 * 30).toISOString() : undefined,
      evaluatedOn: hasData && status === 'approved' ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : undefined,
      attachments
    };
  });
};

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
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', disabled = false, className = '', onClick }) => {
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
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>

      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>);

};

// ============ RUBRIC SCORE INPUT CELL ============

const RubricScoreCell: React.FC<{
  value: number | undefined;
  maxMarks: number;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  rubricName: string;
}> = ({ value, maxMarks, onChange, disabled, rubricName }) => {
  const [localValue, setLocalValue] = useState(value?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  const hasError = value !== undefined && value > maxMarks;
  const isValid = value !== undefined && value <= maxMarks;

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue === '') {
      onChange(null);
    } else {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue) && numValue >= 0) {
        onChange(Math.min(numValue, maxMarks));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setLocalValue(val);
    }
  };

  return (
    <div className="relative group">
      <input
        type="text"
        value={isFocused ? localValue : value !== undefined ? value.toString() : ''}
        onChange={handleChange}
        onFocus={() => {
          setIsFocused(true);
          setLocalValue(value?.toString() || '');
        }}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="-"
        className={`w-full px-2 py-2 border-2 rounded-xl text-center text-sm font-bold outline-none transition-all ${
        hasError ?
        'border-red-300 bg-red-50 text-red-700' :
        isValid ?
        'border-green-300 bg-green-50 text-green-700' :
        'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'} ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
        {rubricName}
        <br />
        <span className="text-gray-300">Max: {maxMarks}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>);

};

// ============ STATUS BADGE ============

const StatusBadge: React.FC<{status: EntryStatus;}> = ({ status }) => {
  const configs = {
    approved: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
    submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700', icon: Send },
    draft: { label: 'Draft', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Edit3 },
    pending: { label: 'Pending', bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
    rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
      <Icon className={`w-3.5 h-3.5 ${config.text}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>);

};

// ============ MAIN COMPONENT ============

export function CISCEProjectActivityEntry() {
  // State
  const [filters, setFilters] = useState<FilterState>({
    academicYear: '2024-25',
    term: 'sem1',
    standard: 10,
    section: 'all',
    subject: 'ENV',
    projectType: 'all',
    entryStatus: 'all',
    searchQuery: ''
  });

  const [projects] = useState<ProjectConfig[]>(generateMockProjects());
  const [students, setStudents] = useState<StudentProjectEntry[]>(() => generateMockStudents(25));
  const [entryMode, setEntryMode] = useState<EntryMode>('rubric');
  const [selectedProject, setSelectedProject] = useState<ProjectConfig | null>(projects[0]);
  const [isDirty, setIsDirty] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [activeRemarkDropdown, setActiveRemarkDropdown] = useState<string | null>(null);

  // Available projects based on subject filter
  const availableProjects = useMemo(() => {
    if (filters.subject === 'all') return projects;
    return projects.filter((p) => p.subjectId === filters.subject);
  }, [projects, filters.subject]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSection = filters.section === 'all' || student.section === filters.section;
      const matchesStatus = filters.entryStatus === 'all' || student.status === filters.entryStatus;
      const matchesSearch = filters.searchQuery === '' ||
      student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      student.rollNo.includes(filters.searchQuery) ||
      student.admissionNo.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesSection && matchesStatus && matchesSearch;
    });
  }, [students, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const assessed = filteredStudents.filter((s) => s.status !== 'pending').length;
    const pending = filteredStudents.filter((s) => s.status === 'pending').length;
    const submitted = filteredStudents.filter((s) => s.status === 'submitted').length;
    const approved = filteredStudents.filter((s) => s.status === 'approved').length;
    const rejected = filteredStudents.filter((s) => s.status === 'rejected').length;
    const draft = filteredStudents.filter((s) => s.status === 'draft').length;

    const completedStudents = filteredStudents.filter((s) => s.totalMarks > 0);
    const avgMarks = completedStudents.length > 0 ?
    completedStudents.reduce((sum, s) => sum + s.totalMarks, 0) / completedStudents.length :
    0;

    const highestMarks = completedStudents.length > 0 ?
    Math.max(...completedStudents.map((s) => s.totalMarks)) :
    0;

    const lowestMarks = completedStudents.length > 0 ?
    Math.min(...completedStudents.map((s) => s.totalMarks)) :
    0;

    // Grade distribution
    const gradeDistribution = gradeMapping.map((g) => ({
      ...g,
      count: filteredStudents.filter((s) => s.grade === g.grade).length
    }));

    // Rubric-wise averages
    const rubricAverages = selectedProject?.rubrics.map((rubric) => {
      const scores = completedStudents.
      map((s) => s.rubricScores[rubric.id]).
      filter((s) => s !== undefined);
      const avg = scores.length > 0 ?
      scores.reduce((a, b) => a + b, 0) / scores.length :
      0;
      return {
        rubricId: rubric.id,
        average: avg,
        percentage: avg / rubric.maxMarks * 100
      };
    }) || [];

    return {
      total, assessed, pending, submitted, approved, rejected, draft,
      avgMarks, highestMarks, lowestMarks,
      gradeDistribution, rubricAverages
    };
  }, [filteredStudents, selectedProject]);

  // Handlers
  const handleSubjectChange = (subjectId: string) => {
    setFilters((prev) => ({ ...prev, subject: subjectId }));
    const subjectProjects = projects.filter((p) => p.subjectId === subjectId);
    if (subjectProjects.length > 0) {
      setSelectedProject(subjectProjects[0]);
    }
  };

  const handleRubricScoreChange = (studentId: string, rubricId: string, value: number | null) => {
    setStudents((prev) => prev.map((student) => {
      if (student.studentId !== studentId) return student;

      const newRubricScores = { ...student.rubricScores };
      if (value === null) {
        delete newRubricScores[rubricId];
      } else {
        newRubricScores[rubricId] = value;
      }

      const totalMarks = Object.values(newRubricScores).reduce((sum, s) => sum + s, 0);
      const percentage = totalMarks;
      const grade = totalMarks > 0 ? getGradeFromPercent(percentage) : null;
      const status: EntryStatus = Object.keys(newRubricScores).length > 0 ?
      student.status === 'pending' ? 'draft' : student.status :
      'pending';

      return {
        ...student,
        rubricScores: newRubricScores,
        marks: totalMarks || null,
        totalMarks,
        percentage,
        grade,
        status,
        evaluatedOn: totalMarks > 0 ? new Date().toISOString() : undefined
      };
    }));
    setIsDirty(true);
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setStudents((prev) => prev.map((student) =>
    student.studentId === studentId ?
    { ...student, teacherRemark: remark } :
    student
    ));
    setIsDirty(true);
  };

  const handleSubmitStudent = (studentId: string) => {
    setStudents((prev) => prev.map((student) =>
    student.studentId === studentId && student.totalMarks > 0 ?
    {
      ...student,
      status: 'submitted',
      submittedOn: new Date().toISOString()
    } :
    student
    ));
    setIsDirty(true);
  };

  const handleBulkSubmit = () => {
    setStudents((prev) => prev.map((student) =>
    selectedStudents.includes(student.studentId) && student.totalMarks > 0 ?
    {
      ...student,
      status: 'submitted',
      submittedOn: new Date().toISOString()
    } :
    student
    ));
    setSelectedStudents([]);
    setIsDirty(true);
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.studentId));
    }
  };

  const handleSave = () => {
    setIsDirty(false);
    alert(`Saved ${stats.assessed} entries for ${selectedProject?.name}!`);
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      section: 'all',
      projectType: 'all',
      entryStatus: 'all',
      searchQuery: ''
    }));
  };

  // Render student row
  const renderStudentRow = (student: StudentProjectEntry) => {
    const isExpanded = expandedStudent === student.studentId;
    const isSelected = selectedStudents.includes(student.studentId);
    const gradeConfig = student.grade ? getGradeConfig(student.grade) : undefined;

    return (
      <div key={student.studentId} className="border-b border-gray-100 last:border-0">
        {/* Main Row */}
        <div className={`px-4 py-4 grid grid-cols-12 gap-4 items-center transition-colors ${
        isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`
        }>
          {/* Checkbox */}
          <div className="col-span-1">
            <button
              onClick={() => {
                setSelectedStudents((prev) =>
                prev.includes(student.studentId) ?
                prev.filter((id) => id !== student.studentId) :
                [...prev, student.studentId]
                );
              }}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">

              {isSelected ?
              <CheckCircle2 className="w-5 h-5 text-indigo-600" /> :

              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              }
            </button>
          </div>

          {/* Student Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {getInitials(student.name)}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                <div className="text-xs text-gray-500">
                  Roll: {student.rollNo} | {student.admissionNo}
                </div>
              </div>
            </div>
          </div>

          {/* Rubric Scores */}
          <div className="col-span-5">
            <div className="grid grid-cols-5 gap-2">
              {selectedProject?.rubrics.map((rubric) =>
              <RubricScoreCell
                key={rubric.id}
                value={student.rubricScores[rubric.id]}
                maxMarks={rubric.maxMarks}
                onChange={(value) => handleRubricScoreChange(student.studentId, rubric.id, value)}
                disabled={student.status === 'approved'}
                rubricName={rubric.name} />

              )}
            </div>
          </div>

          {/* Total Marks */}
          <div className="col-span-1 text-center">
            <div className="font-bold text-xl text-gray-900">{student.totalMarks}</div>
            <div className="text-xs text-gray-500">/{selectedProject?.maxMarks || 100}</div>
          </div>

          {/* Grade */}
          <div className="col-span-1 text-center">
            {student.grade ?
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${getGradeConfig(student.grade)?.bg} ${getGradeConfig(student.grade)?.text} border-${student.grade === 'A+' ? 'emerald' : student.grade === 'A' ? 'green' : student.grade.startsWith('B') ? 'blue' : student.grade.startsWith('C') ? 'yellow' : 'red'}-200`}>
                {student.grade}
              </span> :

            <span className="text-gray-300">--</span>
            }
          </div>

          {/* Status */}
          <div className="col-span-1 text-center">
            <StatusBadge status={student.status} />
          </div>

          {/* Actions */}
          <div className="col-span-1 text-center">
            <button
              onClick={() => setExpandedStudent(isExpanded ? null : student.studentId)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">

              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded &&
        <div className="px-4 py-6 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rubric Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Rubric-wise Assessment
                </h4>
                <div className="space-y-3">
                  {selectedProject?.rubrics.map((rubric) => {
                  const score = student.rubricScores[rubric.id] || 0;
                  const percentage = score / rubric.maxMarks * 100;
                  const level = rubricLevels.find((l) => percentage >= l.minScore && percentage <= l.maxScore);

                  return (
                    <div key={rubric.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-900">{rubric.name}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{rubric.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-2xl font-bold text-gray-900">{score}</span>
                            <span className="text-sm text-gray-500">/{rubric.maxMarks}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${level ? getLevelColorClass(level.color) : 'bg-gray-400'}`}
                          style={{ width: `${percentage}%` }} />

                        </div>

                        {/* Level Indicators */}
                        <div className="flex justify-between text-xs">
                          {rubricLevels.map((lvl) => {
                          const isActive = level?.id === lvl.id;
                          return (
                            <span
                              key={lvl.id}
                              className={`${isActive ? 'font-bold text-gray-900' : 'text-gray-400'}`}>

                                {lvl.name}
                              </span>);

                        })}
                        </div>
                      </div>);

                })}
                </div>
              </div>

              {/* Remarks & Attachments */}
              <div className="space-y-6">
                {/* Teacher Remark */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    Teacher's Remark
                  </h4>
                  <div className="relative">
                    <textarea
                    value={student.teacherRemark}
                    onChange={(e) => handleRemarkChange(student.studentId, e.target.value)}
                    placeholder="Enter detailed remarks about the student's project..."
                    rows={4}
                    maxLength={500}
                    disabled={student.status === 'approved'}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors ${
                    student.status === 'approved' ?
                    'bg-gray-100 text-gray-500 cursor-not-allowed' :
                    'bg-white border-gray-200'}`
                    } />

                    <div className="mt-2 flex items-center justify-between">
                      <div className="relative">
                        <button
                        onClick={() => setActiveRemarkDropdown(
                          activeRemarkDropdown === student.studentId ? null : student.studentId
                        )}
                        disabled={student.status === 'approved'}
                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50">

                          <FileText className="w-3.5 h-3.5" />
                          Use Template
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Template Dropdown */}
                        {activeRemarkDropdown === student.studentId &&
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="p-3 bg-gray-50 border-b border-gray-200">
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Quick Templates
                              </span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {REMARK_TEMPLATES.map((template, index) =>
                          <button
                            key={index}
                            onClick={() => {
                              handleRemarkChange(student.studentId, template);
                              setActiveRemarkDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 border-b border-gray-100 last:border-0 transition-colors">

                                  {template}
                                </button>
                          )}
                            </div>
                          </div>
                      }
                      </div>
                      <span className="text-xs text-gray-400">
                        {student.teacherRemark.length}/500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    Attachments
                  </h4>
                  {student.attachments.length > 0 ?
                <div className="space-y-2">
                      {student.attachments.map((file) =>
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group">

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <FileText className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{file.name}</span>
                              <p className="text-xs text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                  )}
                    </div> :

                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No attachments submitted</p>
                    </div>
                }
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  {student.status === 'draft' && student.totalMarks > 0 &&
                <button
                  onClick={() => handleSubmitStudent(student.studentId)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm">

                      <Send className="w-4 h-4" />
                      Submit Assessment
                    </button>
                }
                  {student.status === 'approved' &&
                <span className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Approved
                    </span>
                }
                  {student.status === 'rejected' &&
                <button
                  onClick={() => {
                    setStudents((prev) => prev.map((s) =>
                    s.studentId === student.studentId ? { ...s, status: 'draft' } : s
                    ));
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium">

                      <RefreshCcw className="w-4 h-4" />
                      Revise & Resubmit
                    </button>
                }
                </div>
              </div>
            </div>
          </div>
        }
      </div>);

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>CISCE Board</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-indigo-600 font-medium">Project Assessment</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Project & Activity Assessment</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="purple">Rubric-Based Evaluation</Badge>
                  {selectedProject &&
                  <Badge variant="default">Max: {selectedProject.maxMarks} Marks</Badge>
                  }
                  {isDirty && <Badge variant="warning">Unsaved Changes</Badge>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={!isDirty}>
                <Save className="w-4 h-4 mr-2" />
                Save All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Filter & Search</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RefreshCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {/* Academic Year */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Academic Year</label>
              <select
                value={filters.academicYear}
                onChange={(e) => setFilters((prev) => ({ ...prev, academicYear: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>
            
            {/* Term */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Term</label>
              <select
                value={filters.term}
                onChange={(e) => setFilters((prev) => ({ ...prev, term: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                {terms.map((term) =>
                <option key={term.id} value={term.id}>{term.name}</option>
                )}
              </select>
            </div>
            
            {/* Class */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
              <select
                value={filters.standard}
                onChange={(e) => setFilters((prev) => ({
                  ...prev,
                  standard: e.target.value === 'all' ? 'all' : parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                {[8, 9, 10, 11, 12].map((std) =>
                <option key={std} value={std}>Class {std}</option>
                )}
              </select>
            </div>
            
            {/* Section */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
              <select
                value={filters.section}
                onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                {subjects.map((subject) =>
                <option key={subject.id} value={subject.id}>{subject.name}</option>
                )}
              </select>
            </div>
            
            {/* Project Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Type</label>
              <select
                value={filters.projectType}
                onChange={(e) => setFilters((prev) => ({ ...prev, projectType: e.target.value as ProjectType | 'all' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                <option value="all">All Types</option>
                {Object.entries(projectTypeConfig).map(([type, config]) =>
                <option key={type} value={type}>{config.label}</option>
                )}
              </select>
            </div>
            
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Roll No..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-500">Entry Status:</span>
            {(['all', 'pending', 'draft', 'submitted', 'approved'] as const).map((status) =>
            <button
              key={status}
              onClick={() => setFilters((prev) => ({ ...prev, entryStatus: status === 'all' ? 'all' : status }))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filters.entryStatus === status ?
              'bg-indigo-600 text-white' :
              'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
              }>

                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1 opacity-70">
                  ({status === 'all' ? students.length : students.filter((s) => s.status === status).length})
                </span>
              </button>
            )}
          </div>
        </Card>

        {/* Project Info Card */}
        {selectedProject &&
        <Card className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedProject.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                    <BookOpen className="w-4 h-4" />
                    {selectedProject.subjectName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    <Target className="w-4 h-4" />
                    Max: {selectedProject.maxMarks}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    <Layers className="w-4 h-4" />
                    {selectedProject.rubrics.length} Rubrics
                  </span>
                </div>
              </div>
            </div>
          </Card>
        }

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Entry Table */}
          <div className="xl:col-span-3">
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-900">
                    {filteredStudents.length} Students
                  </span>
                  {selectedProject &&
                  <Badge variant="purple">
                      {selectedProject.name}
                    </Badge>
                  }
                </div>
                <div className="flex items-center gap-3">
                  {selectedStudents.length > 0 &&
                  <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <span className="text-sm font-medium text-indigo-700">
                        {selectedStudents.length} selected
                      </span>
                      <button
                      onClick={handleBulkSubmit}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">

                        <Send className="w-3.5 h-3.5" />
                        Submit All
                      </button>
                      <button
                      onClick={() => setSelectedStudents([])}
                      className="text-indigo-600 hover:text-indigo-800">

                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  }
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-12">
                        <button onClick={handleSelectAll} className="p-1.5 hover:bg-gray-200 rounded-lg">
                          {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ?
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" /> :

                          <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                          }
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Student</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500" colSpan={5}>
                        <div className="flex flex-col items-center gap-0.5">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          <span>Rubric Scores</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Grade</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                    {/* Rubric Header Row */}
                    <tr className="bg-indigo-50/50 border-b border-indigo-100">
                      <th className="px-4 py-2" colSpan={2}></th>
                      {selectedProject?.rubrics.map((rubric) =>
                      <th key={rubric.id} className="px-4 py-2 text-center">
                          <div className="text-xs font-medium text-indigo-700 truncate" title={`${rubric.name} (Max: ${rubric.maxMarks})`}>
                            {rubric.name.split(' ')[0]}
                            <br />
                            <span className="text-indigo-500">({rubric.maxMarks})</span>
                          </div>
                        </th>
                      )}
                      <th colSpan={4}></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length > 0 ?
                    filteredStudents.map(renderStudentRow) :

                    <tr>
                        <td colSpan={12} className="p-12 text-center">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                          <p className="text-gray-500">
                            {filters.searchQuery || filters.entryStatus !== 'all' ?
                          'Try adjusting your filters' :
                          'No students in this class section'}
                          </p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredStudents.length}</span> students
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Grade Legend */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                Grade Scale (CISCE)
              </h3>
              <div className="space-y-2">
                {gradeMapping.map((g) =>
                <div key={g.grade} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-7 rounded-lg ${g.color} text-white text-xs font-bold flex items-center justify-center`}>
                        {g.grade}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{g.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{g.minPercent}-{g.maxPercent}%</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Entry Statistics */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Assessment Progress
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Completion</span>
                  <span>{stats.total > 0 ? Math.round(stats.assessed / stats.total * 100) : 0}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${stats.total > 0 ? stats.assessed / stats.total * 100 : 0}%` }} />

                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <Badge variant="success">{stats.approved}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Submitted</span>
                  </div>
                  <Badge variant="info">{stats.submitted}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">Draft</span>
                  </div>
                  <Badge variant="warning">{stats.draft}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <Badge variant="default">{stats.pending}</Badge>
                </div>
              </div>
              
              {/* Average Score */}
              <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-600 font-medium mb-1">Class Average</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-purple-700">
                    {stats.avgMarks.toFixed(1)}
                  </span>
                  <span className="text-sm text-purple-500 font-medium mb-1">
                    / {selectedProject?.maxMarks || 100}
                  </span>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  High: {stats.highestMarks} | Low: {stats.lowestMarks}
                </p>
              </div>
            </Card>

            {/* Rubric-wise Performance */}
            {selectedProject &&
            <Card className="p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Rubric Performance
                </h3>
                <div className="space-y-3">
                  {stats.rubricAverages.map((rubric, idx) => {
                  const rubricInfo = selectedProject.rubrics.find((r) => r.id === rubric.rubricId);
                  if (!rubricInfo) return null;

                  return (
                    <div key={rubric.rubricId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{rubricInfo.name}</span>
                          <span className="text-xs font-bold text-gray-900">
                            {rubric.average.toFixed(1)}/{rubricInfo.maxMarks}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                          rubric.percentage >= 80 ? 'bg-green-500' :
                          rubric.percentage >= 60 ? 'bg-blue-500' :
                          rubric.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`
                          }
                          style={{ width: `${rubric.percentage}%` }} />

                        </div>
                      </div>);

                })}
                </div>
              </Card>
            }

            {/* Grade Distribution */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Grade Distribution
              </h3>
              <div className="space-y-2">
                {stats.gradeDistribution.filter((g) => g.count > 0).map((g) =>
                <div key={g.grade} className="flex items-center gap-3">
                    <span className={`w-8 h-6 rounded ${g.color} text-white text-[10px] font-bold flex items-center justify-center`}>
                      {g.grade}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className={`h-full ${g.color} transition-all duration-500`}
                      style={{ width: `${stats.total > 0 ? g.count / stats.total * 100 : 0}%` }} />

                    </div>
                    <span className="text-xs font-bold text-gray-600 w-6 text-right">{g.count}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
              <h3 className="text-xs font-semibold text-purple-200 uppercase tracking-wide mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Bulk Grade Assign
                </Button>
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-start">
                  <Layers className="w-4 h-4 mr-2" />
                  Edit Rubrics
                </Button>
                <Button className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold justify-center">
                  Submit for Approval
                </Button>
              </div>
            </Card>

            {/* Guidelines */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-900">CISCE Assessment</p>
                  <p className="text-[11px] text-blue-700 leading-relaxed mt-1">
                    Projects are evaluated using rubric-based criteria. Each rubric has defined performance levels and weightage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

export default CISCEProjectActivityEntry;