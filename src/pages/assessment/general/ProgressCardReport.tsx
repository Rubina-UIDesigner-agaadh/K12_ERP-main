import React, { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Printer,
  Download,
  Filter,
  RefreshCcw,
  Settings,
  Eye,
  Search,
  Calendar,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Percent,
  Hash,
  Trophy,
  Medal,
  Star,
  Target,
  Layers,
  LayoutGrid,
  List,
  Table,
  User,
  Phone,
  Mail,
  MapPin,
  Cake,
  Building2,
  Palette,
  Music,
  Dumbbell,
  Brain,
  Heart,
  Sparkles,
  Activity,
  MessageSquare,
  PenLine,
  Stamp,
  ShieldCheck,
  Image,
  Layout,
  LayoutTemplate,
  FileCheck,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Loader2,
  Crown,
  Share2,
  Send,
  History,
  Save,
  Upload,
  ExternalLink,
  Copy,
  Info,
  AlertTriangle,
  Camera,
  Signature,
  Globe,
  Flag,
  Brush,
  Theater,
  Mic,
  Calculator,
  Beaker,
  BookMarked,
  Lightbulb,
  HandHeart,
  UserCheck,
  ClipboardCheck,
  Footprints,
  Compass,
  Puzzle,
  Shapes,
  Waves,
  TreePine,
  Tent,
  Gamepad2,
  Paintbrush,
  Drama,
  Newspaper,
  Languages,
  Binary,
  Atom,
  FlaskConical,
  Microscope,
  Ruler,
  PencilRuler,
  Sigma } from
'lucide-react';

interface SubjectMark {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  subjectType: 'scholastic' | 'co-scholastic';
  theoryMax: number;
  theoryObtained: number;
  practicalMax: number;
  practicalObtained: number;
  internalMax: number;
  internalObtained: number;
  totalMax: number;
  totalObtained: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
  teacherName: string;
  remarks: string;
}

interface CoScholasticArea {
  id: string;
  area: string;
  activities: {
    name: string;
    grade: string;
    remarks: string;
  }[];
}

interface TermResult {
  termId: string;
  termName: string;
  examDate: string;
  subjects: SubjectMark[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  grade: string;
  cgpa: number;
  rank: number | null;
  result: 'Pass' | 'Fail' | 'Compartment';
  attendance: number;
}

interface StudentProgressCard {
  id: number;
  rollNo: string;
  admissionNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  class: string;
  section: string;
  house: string;
  photo: string | null;
  address: string;
  phone: string;
  email: string;
  classTeacher: string;
  academicYear: string;
  terms: TermResult[];
  coScholasticAreas: CoScholasticArea[];
  disciplineGrade: string;
  overallAttendance: number;
  workingDays: number;
  daysPresent: number;
  teacherRemarks: string;
  principalRemarks: string;
  promotedTo: string;
  dateOfIssue: string;
}

interface ProgressCardTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
  isDefault: boolean;
}

export function ProgressCardReport() {
  // Filter States
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Template States
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'marks' | 'coscholastic' | 'attendance' | 'graphs'>('marks');
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(80);
  const [selectedTerms, setSelectedTerms] = useState<string[]>(['term1', 'term2', 'annual']);

  // Display Options
  const [showPhoto, setShowPhoto] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [showCoScholastic, setShowCoScholastic] = useState(true);
  const [showGradeLegend, setShowGradeLegend] = useState(true);
  const [showRemarks, setShowRemarks] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'subject' | 'term'>('subject');

  const printRef = useRef<HTMLDivElement>(null);

  // Filter Options
  const academicYearOptions = [
  { value: '2024-25', label: '2024-25' },
  { value: '2023-24', label: '2023-24' },
  { value: '2022-23', label: '2022-23' }];


  const examOptions = [
  { value: '', label: 'Select Examination' },
  { value: 'annual', label: 'Annual Examination' },
  { value: 'halfyearly', label: 'Half Yearly Examination' },
  { value: 'term1', label: 'Term 1 Examination' },
  { value: 'term2', label: 'Term 2 Examination' },
  { value: 'consolidated', label: 'Consolidated Report' }];


  const standardOptions = [
  { value: '', label: 'Select Standard' },
  { value: '1', label: 'Class I' },
  { value: '2', label: 'Class II' },
  { value: '3', label: 'Class III' },
  { value: '4', label: 'Class IV' },
  { value: '5', label: 'Class V' },
  { value: '6', label: 'Class VI' },
  { value: '7', label: 'Class VII' },
  { value: '8', label: 'Class VIII' },
  { value: '9', label: 'Class IX' },
  { value: '10', label: 'Class X' },
  { value: '11', label: 'Class XI' },
  { value: '12', label: 'Class XII' }];


  const sectionOptions = [
  { value: 'all', label: 'All Sections' },
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' }];


  // Templates
  const templates: ProgressCardTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Template',
    description: 'Clean and professional design suitable for all grades',
    preview: '/templates/standard.png',
    features: ['Student Photo', 'Subject Marks Table', 'Grade Legend', 'Remarks Section', 'Signatures'],
    isDefault: true
  },
  {
    id: 'cbse',
    name: 'CBSE Board Template',
    description: 'Official CBSE format with co-scholastic areas',
    preview: '/templates/cbse.png',
    features: ['CBSE Format', 'Co-Scholastic Areas', 'Discipline Grade', '9-Point Scale', 'Term-wise Marks'],
    isDefault: false
  },
  {
    id: 'icse',
    name: 'ICSE Board Template',
    description: 'ICSE pattern with detailed assessment',
    preview: '/templates/icse.png',
    features: ['ICSE Format', 'Internal Assessment', 'Project Work', 'Practical Marks', 'Comprehensive'],
    isDefault: false
  },
  {
    id: 'modern',
    name: 'Modern Template',
    description: 'Contemporary design with graphs and analytics',
    preview: '/templates/modern.png',
    features: ['Performance Graphs', 'Visual Analytics', 'Color Coded', 'Comparison Charts', 'Interactive'],
    isDefault: false
  },
  {
    id: 'minimal',
    name: 'Minimal Template',
    description: 'Simple and compact design for quick reference',
    preview: '/templates/minimal.png',
    features: ['Compact Layout', 'Essential Info Only', 'Single Page', 'Fast Printing', 'Eco-Friendly'],
    isDefault: false
  },
  {
    id: 'custom',
    name: 'Custom Template',
    description: 'Fully customizable template with your school branding',
    preview: '/templates/custom.png',
    features: ['Custom Header', 'School Logo', 'Custom Colors', 'Flexible Layout', 'Brand Integration'],
    isDefault: false
  }];


  // Grade Scale
  const gradeScale = [
  { range: '91-100', grade: 'A1', gradePoint: 10, description: 'Outstanding' },
  { range: '81-90', grade: 'A2', gradePoint: 9, description: 'Excellent' },
  { range: '71-80', grade: 'B1', gradePoint: 8, description: 'Very Good' },
  { range: '61-70', grade: 'B2', gradePoint: 7, description: 'Good' },
  { range: '51-60', grade: 'C1', gradePoint: 6, description: 'Above Average' },
  { range: '41-50', grade: 'C2', gradePoint: 5, description: 'Average' },
  { range: '33-40', grade: 'D', gradePoint: 4, description: 'Below Average' },
  { range: '0-32', grade: 'E', gradePoint: 0, description: 'Needs Improvement' }];


  // Co-Scholastic Grade Scale
  const coScholasticGradeScale = [
  { grade: 'A', description: 'Outstanding' },
  { grade: 'B', description: 'Very Good' },
  { grade: 'C', description: 'Good' },
  { grade: 'D', description: 'Scope for Improvement' }];


  // Sample Student List
  const studentList = [
  { id: 1, rollNo: '001', name: 'Aarav Sharma', section: 'A' },
  { id: 2, rollNo: '002', name: 'Aanya Patel', section: 'A' },
  { id: 3, rollNo: '003', name: 'Arjun Singh', section: 'A' },
  { id: 4, rollNo: '004', name: 'Diya Gupta', section: 'A' },
  { id: 5, rollNo: '005', name: 'Ishaan Reddy', section: 'B' },
  { id: 6, rollNo: '006', name: 'Kavya Nair', section: 'B' },
  { id: 7, rollNo: '007', name: 'Lakshya Verma', section: 'B' },
  { id: 8, rollNo: '008', name: 'Meera Joshi', section: 'B' }];


  // Sample Student Progress Card Data
  const studentProgressCard: StudentProgressCard = {
    id: 1,
    rollNo: '001',
    admissionNo: 'ADM/2019/001234',
    studentName: 'Aarav Sharma',
    fatherName: 'Mr. Rajesh Sharma',
    motherName: 'Mrs. Priya Sharma',
    dob: '15 August 2009',
    gender: 'Male',
    bloodGroup: 'B+',
    class: 'X',
    section: 'A',
    house: 'Blue House',
    photo: null,
    address: '123, Green Valley, Sector 15, Gurugram, Haryana - 122001',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@email.com',
    classTeacher: 'Mrs. Sunita Verma',
    academicYear: '2024-25',
    terms: [
    {
      termId: 'term1',
      termName: 'Term 1 (April - September)',
      examDate: 'September 2024',
      subjects: [
      { subjectId: 'eng', subjectCode: 'ENG', subjectName: 'English', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 68, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 17, totalMax: 100, totalObtained: 85, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Mrs. Kavita Nair', remarks: 'Good' },
      { subjectId: 'hin', subjectCode: 'HIN', subjectName: 'Hindi', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 62, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 16, totalMax: 100, totalObtained: 78, grade: 'B1', gradePoint: 8, isPassed: true, teacherName: 'Mr. Prakash Joshi', remarks: 'Good' },
      { subjectId: 'math', subjectCode: 'MATH', subjectName: 'Mathematics', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 72, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 18, totalMax: 100, totalObtained: 90, grade: 'A1', gradePoint: 10, isPassed: true, teacherName: 'Mr. R.K. Gupta', remarks: 'Excellent' },
      { subjectId: 'sci', subjectCode: 'SCI', subjectName: 'Science', subjectType: 'scholastic', theoryMax: 60, theoryObtained: 52, practicalMax: 20, practicalObtained: 18, internalMax: 20, internalObtained: 18, totalMax: 100, totalObtained: 88, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Dr. Anita Singh', remarks: 'Very Good' },
      { subjectId: 'sst', subjectCode: 'SST', subjectName: 'Social Studies', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 65, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 17, totalMax: 100, totalObtained: 82, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Mrs. Deepa Menon', remarks: 'Good' },
      { subjectId: 'cs', subjectCode: 'CS', subjectName: 'Computer Science', subjectType: 'scholastic', theoryMax: 50, theoryObtained: 45, practicalMax: 30, practicalObtained: 28, internalMax: 20, internalObtained: 19, totalMax: 100, totalObtained: 92, grade: 'A1', gradePoint: 10, isPassed: true, teacherName: 'Mr. Vikram Reddy', remarks: 'Excellent' }],

      totalMarks: 515,
      totalMaxMarks: 600,
      percentage: 85.83,
      grade: 'A2',
      cgpa: 9.17,
      rank: 3,
      result: 'Pass',
      attendance: 94.5
    },
    {
      termId: 'term2',
      termName: 'Term 2 (October - March)',
      examDate: 'March 2025',
      subjects: [
      { subjectId: 'eng', subjectCode: 'ENG', subjectName: 'English', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 70, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 18, totalMax: 100, totalObtained: 88, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Mrs. Kavita Nair', remarks: 'Improved' },
      { subjectId: 'hin', subjectCode: 'HIN', subjectName: 'Hindi', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 65, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 17, totalMax: 100, totalObtained: 82, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Mr. Prakash Joshi', remarks: 'Good Progress' },
      { subjectId: 'math', subjectCode: 'MATH', subjectName: 'Mathematics', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 75, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 19, totalMax: 100, totalObtained: 94, grade: 'A1', gradePoint: 10, isPassed: true, teacherName: 'Mr. R.K. Gupta', remarks: 'Outstanding' },
      { subjectId: 'sci', subjectCode: 'SCI', subjectName: 'Science', subjectType: 'scholastic', theoryMax: 60, theoryObtained: 55, practicalMax: 20, practicalObtained: 19, internalMax: 20, internalObtained: 18, totalMax: 100, totalObtained: 92, grade: 'A1', gradePoint: 10, isPassed: true, teacherName: 'Dr. Anita Singh', remarks: 'Excellent' },
      { subjectId: 'sst', subjectCode: 'SST', subjectName: 'Social Studies', subjectType: 'scholastic', theoryMax: 80, theoryObtained: 68, practicalMax: 0, practicalObtained: 0, internalMax: 20, internalObtained: 18, totalMax: 100, totalObtained: 86, grade: 'A2', gradePoint: 9, isPassed: true, teacherName: 'Mrs. Deepa Menon', remarks: 'Very Good' },
      { subjectId: 'cs', subjectCode: 'CS', subjectName: 'Computer Science', subjectType: 'scholastic', theoryMax: 50, theoryObtained: 48, practicalMax: 30, practicalObtained: 29, internalMax: 20, internalObtained: 19, totalMax: 100, totalObtained: 96, grade: 'A1', gradePoint: 10, isPassed: true, teacherName: 'Mr. Vikram Reddy', remarks: 'Outstanding' }],

      totalMarks: 538,
      totalMaxMarks: 600,
      percentage: 89.67,
      grade: 'A2',
      cgpa: 9.5,
      rank: 2,
      result: 'Pass',
      attendance: 96.2
    }],

    coScholasticAreas: [
    {
      id: 'workEducation',
      area: 'Work Education',
      activities: [
      { name: 'Regularity & Sincerity', grade: 'A', remarks: 'Excellent' },
      { name: 'Neatness & Creativity', grade: 'A', remarks: 'Very Creative' },
      { name: 'Initiative & Participation', grade: 'B', remarks: 'Good' }]

    },
    {
      id: 'artEducation',
      area: 'Art Education',
      activities: [
      { name: 'Visual Arts', grade: 'A', remarks: 'Talented' },
      { name: 'Performing Arts', grade: 'B', remarks: 'Good participation' }]

    },
    {
      id: 'healthPhysical',
      area: 'Health & Physical Education',
      activities: [
      { name: 'Sports & Games', grade: 'A', remarks: 'State level basketball' },
      { name: 'Physical Fitness', grade: 'A', remarks: 'Excellent' },
      { name: 'Yoga', grade: 'B', remarks: 'Good' }]

    },
    {
      id: 'discipline',
      area: 'Discipline',
      activities: [
      { name: 'Punctuality', grade: 'A', remarks: 'Always on time' },
      { name: 'Behavior', grade: 'A', remarks: 'Exemplary' },
      { name: 'Values & Ethics', grade: 'A', remarks: 'Very responsible' }]

    }],

    disciplineGrade: 'A',
    overallAttendance: 95.35,
    workingDays: 220,
    daysPresent: 210,
    teacherRemarks: 'Aarav has shown exceptional performance throughout the academic year. His analytical skills in Mathematics and Science are commendable. He actively participates in class discussions and helps fellow students. He has shown significant improvement in Hindi this term. Keep up the excellent work!',
    principalRemarks: 'An outstanding student with excellent academic record and all-round development. Aarav is a role model for other students. Promoted to Class XI with distinction.',
    promotedTo: 'Class XI (Science Stream)',
    dateOfIssue: '30 March 2025'
  };

  // Performance Trend Data
  const performanceTrend = studentProgressCard.terms.map((term) => ({
    term: term.termName.split('(')[0].trim(),
    percentage: term.percentage,
    rank: term.rank,
    attendance: term.attendance
  }));

  // Subject Comparison Data
  const subjectComparisonData = studentProgressCard.terms[0].subjects.map((subject) => {
    const term1Mark = studentProgressCard.terms[0].subjects.find((s) => s.subjectId === subject.subjectId)?.totalObtained || 0;
    const term2Mark = studentProgressCard.terms[1]?.subjects.find((s) => s.subjectId === subject.subjectId)?.totalObtained || 0;
    return {
      subject: subject.subjectName,
      subjectCode: subject.subjectCode,
      term1: term1Mark,
      term2: term2Mark,
      change: term2Mark - term1Mark,
      maxMarks: subject.totalMax
    };
  });

  // Helper Functions
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A1':return 'bg-green-100 text-green-700 border-green-200';
      case 'A2':return 'bg-green-50 text-green-600 border-green-100';
      case 'A+':return 'bg-green-100 text-green-700 border-green-200';
      case 'A':return 'bg-green-50 text-green-600 border-green-100';
      case 'B1':return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'B2':return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'B':return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'C1':return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'C2':return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'C':return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'D':return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'E':return 'bg-red-100 text-red-700 border-red-200';
      default:return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Progress Card exported to ${format.toUpperCase()} successfully!`);
    }, 1500);
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId);
    setShowPreview(true);
  };

  const filteredStudents = studentList.filter((student) => {
    const matchesSearch =
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.includes(searchQuery);
    const matchesSection =
    selectedSection === 'all' || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const isConfigComplete = selectedAcademicYear && selectedExam && selectedStandard;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Card Report</h1>
          <p className="text-gray-500 mt-1">
            Generate student-wise detailed progress cards • Academic Year {selectedAcademicYear}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateSelector(true)}>

            <LayoutTemplate className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} disabled={isPrinting || !selectedStudent}>
            {isPrinting ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing...
              </> :

            <>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </>
            }
          </Button>
        </div>
      </div>

      {/* Student Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Student Selector
          </h2>
          <Button variant="ghost" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {academicYearOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          {/* Exam Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Examination <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {examOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          {/* Standard Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {standardOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {sectionOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          {/* Student Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Student
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Roll No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none" />

            </div>
          </div>
        </div>

        {/* Student List */}
        {isConfigComplete &&
        <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Student</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredStudents.map((student) =>
            <div
              key={student.id}
              onClick={() => handleStudentSelect(student.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedStudent === student.id ?
              'border-blue-500 bg-blue-50' :
              'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`
              }>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        Roll: {student.rollNo} | Sec: {student.section}
                      </p>
                    </div>
                    {selectedStudent === student.id &&
                <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                }
                  </div>
                </div>
            )}
            </div>
          </div>
        }
      </Card>

      {/* Main Content - Only show when student is selected */}
      {selectedStudent &&
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Progress Card Content - 3/4 width */}
          <div className="xl:col-span-3 space-y-6">
            {/* Student Profile Header */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo */}
                {showPhoto &&
              <div className="flex-shrink-0">
                    <div className="w-32 h-40 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {studentProgressCard.studentName.charAt(0)}
                    </div>
                  </div>
              }

                {/* Profile Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Student Name</p>
                      <p className="text-lg font-bold text-gray-900">{studentProgressCard.studentName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Father's Name</p>
                      <p className="text-sm font-medium text-gray-700">{studentProgressCard.fatherName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase">Mother's Name</p>
                      <p className="text-sm font-medium text-gray-700">{studentProgressCard.motherName}</p>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Class / Section</p>
                        <p className="text-lg font-bold text-blue-700">
                          {studentProgressCard.class}-{studentProgressCard.section}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Hash className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Roll Number</p>
                        <p className="text-lg font-bold text-purple-700">{studentProgressCard.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Admission No</p>
                        <p className="text-sm font-bold text-green-700">{studentProgressCard.admissionNo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Cake className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-700">{studentProgressCard.dob}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="text-xs text-gray-500">House</p>
                        <p className="text-sm font-medium text-teal-700">{studentProgressCard.house}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                      <User className="w-5 h-5 text-pink-600" />
                      <div>
                        <p className="text-xs text-gray-500">Class Teacher</p>
                        <p className="text-sm font-medium text-pink-700">{studentProgressCard.classTeacher}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-row lg:flex-col gap-3 lg:w-40">
                  <div className="flex-1 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white text-center">
                    <p className="text-2xl font-bold">{studentProgressCard.terms[studentProgressCard.terms.length - 1].percentage.toFixed(1)}%</p>
                    <p className="text-xs opacity-90">Latest %</p>
                  </div>
                  <div className="flex-1 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white text-center">
                    <p className="text-xl font-bold">#{studentProgressCard.terms[studentProgressCard.terms.length - 1].rank}</p>
                    <p className="text-xs opacity-90">Rank</p>
                  </div>
                  <div className="flex-1 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white text-center">
                    <p className="text-xl font-bold">{studentProgressCard.overallAttendance}%</p>
                    <p className="text-xs opacity-90">Attendance</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
            { id: 'marks', label: 'Subject Marks', icon: BookOpen },
            { id: 'coscholastic', label: 'Co-Scholastic', icon: Palette },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'graphs', label: 'Performance Graphs', icon: BarChart3 }].
            map((tab) =>
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}>

                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
            )}
            </div>

            {/* Subject Marks Table */}
            {activeTab === 'marks' &&
          <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Scholastic Areas - Subject Marks</h3>
                  <div className="flex items-center gap-2">
                    {studentProgressCard.terms.map((term) =>
                <Badge key={term.termId} variant="info" className="text-xs">
                        {term.termName.split('(')[0].trim()}
                      </Badge>
                )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th rowSpan={2} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase border-r">
                          Subject
                        </th>
                        {studentProgressCard.terms.map((term) =>
                    <th key={term.termId} colSpan={5} className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase border-r bg-blue-50">
                            {term.termName.split('(')[0].trim()}
                          </th>
                    )}
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {studentProgressCard.terms.map((term) =>
                    <React.Fragment key={term.termId}>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500">Theory</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500">Prac.</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500">Int.</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500">Total</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 border-r">Grade</th>
                          </React.Fragment>
                    )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {studentProgressCard.terms[0].subjects.map((subject) =>
                  <tr key={subject.subjectId} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-r">
                            <div>
                              <p className="font-medium text-gray-900">{subject.subjectName}</p>
                              <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                            </div>
                          </td>
                          {studentProgressCard.terms.map((term) => {
                      const subj = term.subjects.find((s) => s.subjectId === subject.subjectId);
                      return (
                        <React.Fragment key={term.termId}>
                                <td className="py-3 px-2 text-center text-sm">
                                  {subj?.theoryMax ? `${subj.theoryObtained}/${subj.theoryMax}` : '-'}
                                </td>
                                <td className="py-3 px-2 text-center text-sm">
                                  {subj?.practicalMax ? `${subj.practicalObtained}/${subj.practicalMax}` : '-'}
                                </td>
                                <td className="py-3 px-2 text-center text-sm">
                                  {subj?.internalMax ? `${subj.internalObtained}/${subj.internalMax}` : '-'}
                                </td>
                                <td className="py-3 px-2 text-center font-bold text-gray-900">
                                  {subj?.totalObtained}/{subj?.totalMax}
                                </td>
                                <td className="py-3 px-2 text-center border-r">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(subj?.grade || '-')}`}>
                                    {subj?.grade}
                                  </span>
                                </td>
                              </React.Fragment>);

                    })}
                        </tr>
                  )}
                    </tbody>
                    <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-900 border-r">Total / CGPA</td>
                        {studentProgressCard.terms.map((term) =>
                    <React.Fragment key={term.termId}>
                            <td colSpan={3} className="py-3 px-2 text-center font-bold text-gray-900">
                              {term.totalMarks}/{term.totalMaxMarks} ({term.percentage.toFixed(1)}%)
                            </td>
                            <td className="py-3 px-2 text-center font-bold text-purple-700">
                              {term.cgpa.toFixed(2)}
                            </td>
                            <td className="py-3 px-2 text-center border-r">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(term.grade)}`}>
                                {term.grade}
                              </span>
                            </td>
                          </React.Fragment>
                    )}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-700 border-r">Class Rank</td>
                        {studentProgressCard.terms.map((term) =>
                    <td key={term.termId} colSpan={5} className="py-3 px-2 text-center border-r">
                            <div className="flex items-center justify-center gap-2">
                              {term.rank && term.rank <= 3 &&
                        <Crown className={`w-4 h-4 ${
                        term.rank === 1 ? 'text-yellow-500' :
                        term.rank === 2 ? 'text-gray-400' : 'text-orange-500'}`
                        } />
                        }
                              <span className="font-bold text-gray-900">#{term.rank}</span>
                            </div>
                          </td>
                    )}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
          }

            {/* Co-Scholastic Areas */}
            {activeTab === 'coscholastic' && showCoScholastic &&
          <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Co-Scholastic Areas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studentProgressCard.coScholasticAreas.map((area) =>
              <div key={area.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <h4 className="font-semibold flex items-center gap-2">
                          {area.area === 'Work Education' && <Briefcase className="w-4 h-4" />}
                          {area.area === 'Art Education' && <Palette className="w-4 h-4" />}
                          {area.area === 'Health & Physical Education' && <Dumbbell className="w-4 h-4" />}
                          {area.area === 'Discipline' && <ShieldCheck className="w-4 h-4" />}
                          {area.area}
                        </h4>
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                              <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                              <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {area.activities.map((activity, idx) =>
                      <tr key={idx}>
                                <td className="py-2 text-sm text-gray-700">{activity.name}</td>
                                <td className="py-2 text-center">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(activity.grade)}`}>
                                    {activity.grade}
                                  </span>
                                </td>
                                <td className="py-2 text-xs text-gray-500">{activity.remarks}</td>
                              </tr>
                      )}
                          </tbody>
                        </table>
                      </div>
                    </div>
              )}
                </div>

                {/* Discipline & Attendance Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Overall Discipline Grade
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-lg text-2xl font-bold ${getGradeColor(studentProgressCard.disciplineGrade)}`}>
                        {studentProgressCard.disciplineGrade}
                      </span>
                      <span className="text-sm text-gray-600">Exemplary conduct and behavior</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Overall Attendance
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-blue-700">{studentProgressCard.overallAttendance}%</span>
                      <span className="text-sm text-gray-600">
                        {studentProgressCard.daysPresent} / {studentProgressCard.workingDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
          }

            {/* Attendance Tab */}
            {activeTab === 'attendance' &&
          <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Attendance Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-700">{studentProgressCard.workingDays}</p>
                    <p className="text-sm text-gray-600">Working Days</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-700">{studentProgressCard.daysPresent}</p>
                    <p className="text-sm text-gray-600">Days Present</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-red-700">{studentProgressCard.workingDays - studentProgressCard.daysPresent}</p>
                    <p className="text-sm text-gray-600">Days Absent</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-purple-700">{studentProgressCard.overallAttendance}%</p>
                    <p className="text-sm text-gray-600">Attendance %</p>
                  </div>
                </div>

                {/* Term-wise Attendance */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Term-wise Attendance</h4>
                  {studentProgressCard.terms.map((term) =>
              <div key={term.termId} className="flex items-center gap-4">
                      <span className="w-32 text-sm text-gray-600">{term.termName.split('(')[0].trim()}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                    className={`h-full rounded-full ${
                    term.attendance >= 90 ? 'bg-green-500' :
                    term.attendance >= 75 ? 'bg-blue-500' : 'bg-red-500'}`
                    }
                    style={{ width: `${term.attendance}%` }} />

                      </div>
                      <span className="w-16 text-right font-bold text-gray-900">{term.attendance}%</span>
                    </div>
              )}
                </div>

                {/* Attendance Chart */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Attendance Progress</h4>
                  <div className="flex items-end justify-between h-40 gap-4">
                    {studentProgressCard.terms.map((term, idx) =>
                <div key={term.termId} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '120px' }}>
                          <div
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${
                      term.attendance >= 90 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                      term.attendance >= 75 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                      'bg-gradient-to-t from-red-500 to-red-400'}`
                      }
                      style={{ height: `${term.attendance}%` }}>

                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                              {term.attendance}%
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{term.termName.split('(')[0].trim()}</span>
                      </div>
                )}
                  </div>
                </div>
              </Card>
          }

            {/* Performance Graphs */}
            {activeTab === 'graphs' && showGraph &&
          <div className="space-y-6">
                {/* Graph Type Toggle */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Comparison Type:</span>
                  <div className="flex gap-2">
                    <Button
                  variant={comparisonMode === 'subject' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('subject')}>

                      Subject Comparison
                    </Button>
                    <Button
                  variant={comparisonMode === 'term' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setComparisonMode('term')}>

                      Term Comparison
                    </Button>
                  </div>
                </div>

                {/* Subject Comparison Chart */}
                {comparisonMode === 'subject' &&
            <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Subject-wise Performance Comparison
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span className="text-sm text-gray-600">Term 1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-sm text-gray-600">Term 2</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {subjectComparisonData.map((data) =>
                <div key={data.subjectCode} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{data.subject}</span>
                            <span className={`text-xs font-medium ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.change >= 0 ? '+' : ''}{data.change}
                            </span>
                          </div>
                          <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                      className="absolute top-0 h-4 bg-blue-400 rounded-t"
                      style={{ width: `${data.term1}%` }} />

                            <div
                      className="absolute bottom-0 h-4 bg-green-500 rounded-b"
                      style={{ width: `${data.term2}%` }} />

                            <div className="absolute top-0 left-0 h-full flex items-center pl-2">
                              <span className="text-xs font-bold text-white mix-blend-difference">
                                {data.term1} → {data.term2}
                              </span>
                            </div>
                          </div>
                        </div>
                )}
                    </div>
                  </Card>
            }

                {/* Term Comparison Chart */}
                {comparisonMode === 'term' &&
            <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Term-wise Performance Trend
                    </h3>
                    <div className="flex items-end justify-between h-64 gap-8 mb-4">
                      {performanceTrend.map((data, idx) =>
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                            <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${data.percentage}%` }}>

                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-center">
                                <p className="text-lg font-bold text-gray-900">{data.percentage.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500">Rank #{data.rank}</p>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 text-center">{data.term}</span>
                        </div>
                )}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Overall improvement: +{(performanceTrend[performanceTrend.length - 1].percentage - performanceTrend[0].percentage).toFixed(1)}%
                      </span>
                    </div>
                  </Card>
            }

                {/* Subject-wise Radar/Spider Chart Visualization */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Subject Performance Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {subjectComparisonData.map((data) =>
                <div key={data.subjectCode} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-gray-200" />

                            <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${data.term2 / 100 * 220} 220`}
                        className={data.term2 >= 80 ? 'text-green-500' : data.term2 >= 60 ? 'text-blue-500' : 'text-yellow-500'} />

                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-700">{data.term2}%</span>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-600">{data.subjectCode}</p>
                      </div>
                )}
                  </div>
                </Card>
              </div>
          }

            {/* Remarks Section */}
            {showRemarks &&
          <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Remarks & Observations
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Class Teacher's Remarks</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{studentProgressCard.teacherRemarks}</p>
                        <p className="text-xs text-gray-400 mt-3">- {studentProgressCard.classTeacher}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Principal's Remarks</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{studentProgressCard.principalRemarks}</p>
                        <p className="text-xs text-gray-400 mt-3">- Principal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promotion Status */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Promotion Status</p>
                        <p className="text-sm text-gray-600">Promoted to {studentProgressCard.promotedTo}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      PROMOTED
                    </Badge>
                  </div>
                </div>
              </Card>
          }

            {/* Grade Legend */}
            {showGradeLegend &&
          <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-gray-600" />
                  Grade Scale Reference
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {gradeScale.map((item) =>
              <div key={item.grade} className={`p-3 rounded-lg text-center border ${getGradeColor(item.grade)}`}>
                      <p className="text-xl font-bold">{item.grade}</p>
                      <p className="text-xs mt-1">{item.range}</p>
                      <p className="text-[10px] mt-0.5 opacity-75">GP: {item.gradePoint}</p>
                    </div>
              )}
                </div>

                {/* Co-Scholastic Grade Scale */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Co-Scholastic Grade Scale</p>
                  <div className="flex flex-wrap gap-4">
                    {coScholasticGradeScale.map((item) =>
                <div key={item.grade} className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-sm font-bold ${getGradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                        <span className="text-sm text-gray-600">{item.description}</span>
                      </div>
                )}
                  </div>
                </div>
              </Card>
          }
          </div>

          {/* Right Sidebar - 1/4 width */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-600" />
                Template
              </h3>
              <div className="space-y-3">
                {templates.slice(0, 3).map((template) =>
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTemplate === template.id ?
                'border-blue-500 bg-blue-50' :
                'border-gray-200 hover:border-blue-300'}`
                }>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{template.name}</span>
                      {selectedTemplate === template.id &&
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  }
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  </div>
              )}
                <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowTemplateSelector(true)}>

                  View All Templates
                </Button>
              </div>
            </Card>

            {/* Display Options */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Display Options
              </h3>
              <div className="space-y-3">
                {[
              { key: 'showPhoto', label: 'Student Photo', value: showPhoto, setter: setShowPhoto },
              { key: 'showGraph', label: 'Performance Graphs', value: showGraph, setter: setShowGraph },
              { key: 'showCoScholastic', label: 'Co-Scholastic Areas', value: showCoScholastic, setter: setShowCoScholastic },
              { key: 'showGradeLegend', label: 'Grade Legend', value: showGradeLegend, setter: setShowGradeLegend },
              { key: 'showRemarks', label: 'Remarks Section', value: showRemarks, setter: setShowRemarks },
              { key: 'showSignatures', label: 'Signatures', value: showSignatures, setter: setShowSignatures },
              { key: 'showWatermark', label: 'Watermark', value: showWatermark, setter: setShowWatermark }].
              map((option) =>
              <label key={option.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{option.label}</span>
                    <button
                  onClick={() => option.setter(!option.value)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                  option.value ? 'bg-green-500' : 'bg-gray-300'}`
                  }>

                      <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    option.value ? 'translate-x-5' : 'translate-x-0.5'}`
                    } />

                    </button>
                  </label>
              )}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Best Subject</span>
                  <span className="font-bold text-green-700">Computer Science</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Needs Focus</span>
                  <span className="font-bold text-yellow-700">Hindi</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Improvement</span>
                  <span className="font-bold text-blue-700">+3.84%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Rank Change</span>
                  <span className="font-bold text-purple-700">↑ 1 position</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start" size="sm" onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Progress Card
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Progress Card
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email to Parents
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </Card>

            {/* Info */}
            <Card className="p-6 bg-blue-50 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-xs text-blue-700">
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Select student from the list above
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Choose template based on board type
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Toggle sections as needed
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Preview before printing
                </li>
              </ul>
            </Card>
          </div>
        </div>
      }

      {/* Template Selector Modal */}
      {showTemplateSelector &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Select Template</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplateSelector(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) =>
            <div
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template.id);
                setShowTemplateSelector(false);
              }}
              className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id ?
              'border-blue-500 ring-2 ring-blue-200' :
              'border-gray-200 hover:border-blue-300'}`
              }>

                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <LayoutTemplate className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.isDefault &&
                  <Badge variant="info" className="text-xs">Default</Badge>
                  }
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, idx) =>
                  <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                  )}
                      {template.features.length > 3 &&
                  <Badge variant="secondary" className="text-xs">
                          +{template.features.length - 3} more
                        </Badge>
                  }
                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>
        </div>
      }

      {/* Preview Modal */}
      {showPreview && selectedStudent &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative max-w-5xl w-full my-8">
            {/* Toolbar */}
            <div className="bg-gray-800 text-white rounded-t-xl p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Progress Card Preview
              </h3>
              <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>

                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm">{zoomLevel}%</span>
                <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}>

                  <ZoomIn className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-600 mx-2"></div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
                onClick={() => setShowPreview(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div
            className="bg-gray-200 p-8 overflow-auto rounded-b-xl"
            style={{ maxHeight: 'calc(100vh - 200px)' }}>

              <div
              ref={printRef}
              className="bg-white mx-auto shadow-2xl"
              style={{
                width: '210mm',
                minHeight: '297mm',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}>

                {/* Progress Card Content */}
                <div className="p-8">
                  {/* School Header */}
                  <div className="text-center border-b-4 border-blue-600 pb-4 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Delhi Public School</h1>
                    <p className="text-sm text-gray-600">Sector 15, Gurugram, Haryana - 122001</p>
                    <p className="text-xs text-gray-500">CBSE Affiliation No: 530726 | Ph: 0124-1234567</p>
                    <h2 className="text-lg font-bold text-blue-600 mt-4 bg-blue-50 py-2 rounded">
                      PROGRESS REPORT CARD - {selectedAcademicYear}
                    </h2>
                  </div>

                  {/* Student Details */}
                  <div className="flex gap-6 mb-6">
                    {showPhoto &&
                  <div className="w-24 h-30 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                  }
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{studentProgressCard.studentName}</p></div>
                      <div><p className="text-xs text-gray-500">Father's Name</p><p className="font-medium">{studentProgressCard.fatherName}</p></div>
                      <div><p className="text-xs text-gray-500">Mother's Name</p><p className="font-medium">{studentProgressCard.motherName}</p></div>
                      <div><p className="text-xs text-gray-500">Class / Section</p><p className="font-medium">{studentProgressCard.class}-{studentProgressCard.section}</p></div>
                      <div><p className="text-xs text-gray-500">Roll Number</p><p className="font-medium">{studentProgressCard.rollNo}</p></div>
                      <div><p className="text-xs text-gray-500">Admission No</p><p className="font-medium">{studentProgressCard.admissionNo}</p></div>
                      <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium">{studentProgressCard.dob}</p></div>
                      <div><p className="text-xs text-gray-500">Blood Group</p><p className="font-medium">{studentProgressCard.bloodGroup}</p></div>
                      <div><p className="text-xs text-gray-500">House</p><p className="font-medium">{studentProgressCard.house}</p></div>
                    </div>
                  </div>

                  {/* Marks Table (Simplified for preview) */}
                  <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th rowSpan={2} className="border border-blue-700 py-2 px-2">Subject</th>
                        {studentProgressCard.terms.map((term) =>
                      <th key={term.termId} colSpan={2} className="border border-blue-700 py-1 px-2">
                            {term.termName.split('(')[0].trim()}
                          </th>
                      )}
                      </tr>
                      <tr className="bg-blue-500 text-white">
                        {studentProgressCard.terms.map((term) =>
                      <React.Fragment key={term.termId}>
                            <th className="border border-blue-600 py-1 px-1 text-xs">Marks</th>
                            <th className="border border-blue-600 py-1 px-1 text-xs">Grade</th>
                          </React.Fragment>
                      )}
                      </tr>
                    </thead>
                    <tbody>
                      {studentProgressCard.terms[0].subjects.map((subject, idx) =>
                    <tr key={subject.subjectId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 py-1 px-2 font-medium">{subject.subjectName}</td>
                          {studentProgressCard.terms.map((term) => {
                        const subj = term.subjects.find((s) => s.subjectId === subject.subjectId);
                        return (
                          <React.Fragment key={term.termId}>
                                <td className="border border-gray-300 py-1 px-2 text-center">{subj?.totalObtained}/{subj?.totalMax}</td>
                                <td className="border border-gray-300 py-1 px-2 text-center">
                                  <span className={`px-1 rounded text-xs font-bold ${getGradeColor(subj?.grade || '-')}`}>
                                    {subj?.grade}
                                  </span>
                                </td>
                              </React.Fragment>);

                      })}
                        </tr>
                    )}
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-gray-300 py-1 px-2">Total / Percentage</td>
                        {studentProgressCard.terms.map((term) =>
                      <React.Fragment key={term.termId}>
                            <td className="border border-gray-300 py-1 px-2 text-center">{term.totalMarks}/{term.totalMaxMarks}</td>
                            <td className="border border-gray-300 py-1 px-2 text-center">{term.percentage.toFixed(1)}%</td>
                          </React.Fragment>
                      )}
                      </tr>
                    </tbody>
                  </table>

                  {/* Attendance */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Attendance: {studentProgressCard.daysPresent} / {studentProgressCard.workingDays} days ({studentProgressCard.overallAttendance}%)</p>
                  </div>

                  {/* Remarks */}
                  {showRemarks &&
                <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-1">Class Teacher's Remarks:</p>
                        <p className="text-xs text-gray-600">{studentProgressCard.teacherRemarks}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-1">Principal's Remarks:</p>
                        <p className="text-xs text-gray-600">{studentProgressCard.principalRemarks}</p>
                      </div>
                    </div>
                }

                  {/* Signatures */}
                  {showSignatures &&
                <div className="mt-8 flex justify-between items-end">
                      <div className="text-center">
                        <div className="w-32 h-12 border-b-2 border-gray-400 mb-1"></div>
                        <p className="text-xs">Class Teacher</p>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-12 border-b-2 border-gray-400 mb-1"></div>
                        <p className="text-xs">Parent's Signature</p>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-12 border-b-2 border-gray-400 mb-1"></div>
                        <p className="text-xs">Principal</p>
                      </div>
                    </div>
                }

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                    <p>Date of Issue: {studentProgressCard.dateOfIssue}</p>
                    <p>This is a computer generated document</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default ProgressCardReport;

// Missing import for Briefcase
const Briefcase = ({ className }: {className?: string;}) =>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>;