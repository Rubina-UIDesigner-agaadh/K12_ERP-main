import React, { useMemo, useState, useRef, Fragment } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  GraduationCap,
  Award,
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  CheckCheck,
  AlertTriangle,
  Info,
  RefreshCcw,
  Send,
  Clock,
  Star,
  BookOpen,
  Calendar,
  ChevronDown,
  Shield,
  Stamp } from
'lucide-react';
// ============ TYPE DEFINITIONS ============
interface SubjectResult {
  subjectId: string;
  subjectName: string;
  shortName: string;
  code: string;
  maxMarks: number;
  theoryMarks: number;
  practicalMarks: number;
  internalMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isPassed: boolean;
  isAbsent: boolean;
}
interface StudentResult {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  section: string;
  subjects: SubjectResult[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  overallGrade: string;
  rank: number;
  isPassed: boolean;
  isLocked: boolean;
  isApproved: boolean;
  approvedBy: string;
  approvedOn: string;
  remarks: string;
}
type ApprovalStatus = 'all' | 'pending' | 'approved' | 'locked';
// ============ CONSTANTS ============
const SUBJECTS_CONFIG = [
{
  id: 'ENG_L',
  name: 'English Language',
  shortName: 'Eng. Lang.',
  code: '101',
  maxMarks: 80
},
{
  id: 'ENG_LIT',
  name: 'English Literature',
  shortName: 'Eng. Lit.',
  code: '102',
  maxMarks: 80
},
{
  id: 'HINDI',
  name: 'Hindi',
  shortName: 'Hindi',
  code: '201',
  maxMarks: 80
},
{
  id: 'MATH',
  name: 'Mathematics',
  shortName: 'Maths',
  code: '301',
  maxMarks: 80
},
{
  id: 'PHY',
  name: 'Physics',
  shortName: 'Physics',
  code: '401',
  maxMarks: 70
},
{
  id: 'CHEM',
  name: 'Chemistry',
  shortName: 'Chem.',
  code: '402',
  maxMarks: 70
},
{
  id: 'HIST_CIV',
  name: 'History & Civics',
  shortName: 'Hist. & Civ.',
  code: '501',
  maxMarks: 80
},
{
  id: 'GEO',
  name: 'Geography',
  shortName: 'Geo.',
  code: '502',
  maxMarks: 80
}];

const GRADE_SCALE = [
{
  grade: 'A1',
  label: 'Outstanding',
  range: '91–100%',
  color: 'bg-emerald-500',
  bg: 'bg-emerald-50',
  text: 'text-emerald-700',
  border: 'border-emerald-200'
},
{
  grade: 'A2',
  label: 'Excellent',
  range: '81–90%',
  color: 'bg-green-500',
  bg: 'bg-green-50',
  text: 'text-green-700',
  border: 'border-green-200'
},
{
  grade: 'B1',
  label: 'Very Good',
  range: '71–80%',
  color: 'bg-blue-500',
  bg: 'bg-blue-50',
  text: 'text-blue-700',
  border: 'border-blue-200'
},
{
  grade: 'B2',
  label: 'Good',
  range: '61–70%',
  color: 'bg-indigo-500',
  bg: 'bg-indigo-50',
  text: 'text-indigo-700',
  border: 'border-indigo-200'
},
{
  grade: 'C1',
  label: 'Satisfactory',
  range: '51–60%',
  color: 'bg-purple-500',
  bg: 'bg-purple-50',
  text: 'text-purple-700',
  border: 'border-purple-200'
},
{
  grade: 'C2',
  label: 'Average',
  range: '41–50%',
  color: 'bg-yellow-500',
  bg: 'bg-yellow-50',
  text: 'text-yellow-700',
  border: 'border-yellow-200'
},
{
  grade: 'D',
  label: 'Marginal',
  range: '33–40%',
  color: 'bg-orange-500',
  bg: 'bg-orange-50',
  text: 'text-orange-700',
  border: 'border-orange-200'
},
{
  grade: 'E1',
  label: 'Needs Improvement',
  range: '21–32%',
  color: 'bg-red-400',
  bg: 'bg-red-50',
  text: 'text-red-600',
  border: 'border-red-200'
},
{
  grade: 'E2',
  label: 'Fail',
  range: '0–20%',
  color: 'bg-red-700',
  bg: 'bg-red-100',
  text: 'text-red-800',
  border: 'border-red-300'
}];

const calculateGrade = (pct: number): string => {
  if (pct >= 91) return 'A1';
  if (pct >= 81) return 'A2';
  if (pct >= 71) return 'B1';
  if (pct >= 61) return 'B2';
  if (pct >= 51) return 'C1';
  if (pct >= 41) return 'C2';
  if (pct >= 33) return 'D';
  if (pct >= 21) return 'E1';
  return 'E2';
};
const getGradeInfo = (grade: string) =>
GRADE_SCALE.find((g) => g.grade === grade) ||
GRADE_SCALE[GRADE_SCALE.length - 1];
// ============ MOCK DATA ============
const STUDENT_DATA: Array<[string, string, string, string]> = [
['Aarav Sharma', 'Rajesh Sharma', 'Sunita Sharma', '2008-03-15'],
['Priya Patel', 'Mahesh Patel', 'Rekha Patel', '2008-07-22'],
['Rahul Verma', 'Suresh Verma', 'Anita Verma', '2008-01-10'],
['Sneha Gupta', 'Amit Gupta', 'Priya Gupta', '2008-11-05'],
['Arjun Singh', 'Harinder Singh', 'Gurpreet Singh', '2008-05-18'],
['Kavya Reddy', 'Venkat Reddy', 'Lakshmi Reddy', '2008-09-30'],
['Vikram Malhotra', 'Ashok Malhotra', 'Neha Malhotra', '2008-04-12'],
['Ananya Iyer', 'Krishnan Iyer', 'Meena Iyer', '2008-08-25'],
['Rohan Mehta', 'Vijay Mehta', 'Seema Mehta', '2008-02-14'],
['Ishita Joshi', 'Ramesh Joshi', 'Kavita Joshi', '2008-06-08'],
['Aditya Vardhan', 'Dinesh Vardhan', 'Sudha Vardhan', '2008-12-20'],
['Meera Nair', 'Krishnan Nair', 'Radha Nair', '2008-10-03'],
['Sanjay Das', 'Sumit Das', 'Puja Das', '2008-03-28'],
['Divya Kapoor', 'Sanjay Kapoor', 'Ritu Kapoor', '2008-07-16'],
['Karan Bhatt', 'Manish Bhatt', 'Swati Bhatt', '2008-01-31']];

const generateSubjectResult = (
config: (typeof SUBJECTS_CONFIG)[0])
: SubjectResult => {
  const isAbsent = Math.random() < 0.05;
  if (isAbsent) {
    return {
      subjectId: config.id,
      subjectName: config.name,
      shortName: config.shortName,
      code: config.code,
      maxMarks: config.maxMarks,
      theoryMarks: 0,
      practicalMarks: 0,
      internalMarks: 0,
      totalMarks: 0,
      percentage: 0,
      grade: 'AB',
      isPassed: false,
      isAbsent: true
    };
  }
  const theory = Math.floor(Math.random() * (config.maxMarks - 20) + 20);
  const internal = Math.floor(Math.random() * 16 + 5);
  const total = theory + internal;
  const maxTotal = config.maxMarks + 20;
  const pct = total / maxTotal * 100;
  return {
    subjectId: config.id,
    subjectName: config.name,
    shortName: config.shortName,
    code: config.code,
    maxMarks: config.maxMarks,
    theoryMarks: theory,
    practicalMarks: 0,
    internalMarks: internal,
    totalMarks: total,
    percentage: pct,
    grade: calculateGrade(pct),
    isPassed: theory >= Math.floor(config.maxMarks * 0.33),
    isAbsent: false
  };
};
const generateStudentResults = (): StudentResult[] => {
  return STUDENT_DATA.map(([name, fatherName, motherName, dob], idx) => {
    const subjects = SUBJECTS_CONFIG.map(generateSubjectResult);
    const totalMarks = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
    const totalMaxMarks = SUBJECTS_CONFIG.reduce(
      (sum, s) => sum + s.maxMarks + 20,
      0
    );
    const percentage = totalMarks / totalMaxMarks * 100;
    const overallGrade = calculateGrade(percentage);
    const isPassed = subjects.every((s) => s.isPassed || s.isAbsent);
    const isApproved = Math.random() > 0.4;
    const isLocked = isApproved && Math.random() > 0.3;
    return {
      id: `STU${String(idx + 1).padStart(4, '0')}`,
      rollNo: String(idx + 1).padStart(2, '0'),
      admissionNo: `ICSE/2024/${String(idx + 1).padStart(4, '0')}`,
      name,
      fatherName,
      motherName,
      dob,
      section: ['A', 'B', 'C'][idx % 3],
      subjects,
      totalMarks,
      totalMaxMarks,
      percentage,
      overallGrade,
      rank: 0,
      isPassed,
      isLocked,
      isApproved,
      approvedBy: isApproved ? 'Mrs. Sharma (Principal)' : '',
      approvedOn: isApproved ? '2024-12-15' : '',
      remarks: isPassed ?
      percentage >= 80 ?
      'Excellent performance. Keep it up!' :
      'Good performance.' :
      'Needs improvement in some subjects.'
    };
  }).map((s, _, arr) => {
    // Assign ranks
    const sorted = [...arr].sort((a, b) => b.percentage - a.percentage);
    return {
      ...s,
      rank: sorted.findIndex((r) => r.id === s.id) + 1
    };
  });
};
// ============ INLINE UI COMPONENTS ============
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>

    {children}
  </div>;

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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>

      {children}
    </span>);

};
// ============ MAIN COMPONENT ============
export function CisceReportCard() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [selectedClass, setSelectedClass] = useState('Class 10 – A');
  const [selectedExam, setSelectedExam] = useState('Half Yearly');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<ApprovalStatus>('all');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [showGradeScale, setShowGradeScale] = useState(false);
  const [students, setStudents] = useState<StudentResult[]>(() =>
  generateStudentResults()
  );
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchApproval =
      approvalFilter === 'all' ?
      true :
      approvalFilter === 'approved' ?
      s.isApproved :
      approvalFilter === 'locked' ?
      s.isLocked :
      !s.isApproved;
      return matchSearch && matchApproval;
    });
  }, [students, searchQuery, approvalFilter]);
  const stats = useMemo(() => {
    const total = students.length;
    const passed = students.filter((s) => s.isPassed).length;
    const failed = students.filter((s) => !s.isPassed).length;
    const approved = students.filter((s) => s.isApproved).length;
    const locked = students.filter((s) => s.isLocked).length;
    const pending = students.filter((s) => !s.isApproved).length;
    const avgPercent =
    students.reduce((sum, s) => sum + s.percentage, 0) / total;
    const highest = Math.max(...students.map((s) => s.percentage));
    const lowest = Math.min(...students.map((s) => s.percentage));
    const gradeDistribution = GRADE_SCALE.map((g) => ({
      ...g,
      count: students.filter((s) => s.overallGrade === g.grade).length
    })).filter((g) => g.count > 0);
    return {
      total,
      passed,
      failed,
      approved,
      locked,
      pending,
      avgPercent,
      highest,
      lowest,
      gradeDistribution
    };
  }, [students]);
  const handleApprove = (studentId: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      isApproved: true,
      approvedBy: 'Mrs. Sharma (Principal)',
      approvedOn: new Date().toISOString().split('T')[0]
    } :
    s
    )
    );
  };
  const handleLock = (studentId: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      isLocked: !s.isLocked
    } :
    s
    )
    );
  };
  const handleBulkApprove = () => {
    setStudents((prev) =>
    prev.map((s) =>
    selectedStudents.has(s.id) ?
    {
      ...s,
      isApproved: true,
      approvedBy: 'Mrs. Sharma (Principal)',
      approvedOn: new Date().toISOString().split('T')[0]
    } :
    s
    )
    );
    setSelectedStudents(new Set());
  };
  const handleBulkLock = () => {
    setStudents((prev) =>
    prev.map((s) =>
    selectedStudents.has(s.id) && s.isApproved ?
    {
      ...s,
      isLocked: true
    } :
    s
    )
    );
    setSelectedStudents(new Set());
  };
  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };
  const toggleSelect = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-600 to-indigo-700 rounded-xl shadow-lg shadow-teal-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>CISCE Board</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-teal-600 font-medium">
                    Tabulation Register
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Result Tabulation Register
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="info">ICSE / ISC</Badge>
                  <Badge variant="default">{selectedClass}</Badge>
                  <Badge variant="purple">{selectedExam}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleBulkApprove}
                disabled={selectedStudents.size === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${selectedStudents.size > 0 ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>

                <CheckCheck className="w-4 h-4" />
                Approve Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option>2024-25</option>
                <option>2023-24</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Class & Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500">

                {[
                'Class 9 – A',
                'Class 9 – B',
                'Class 10 – A',
                'Class 10 – B',
                'Class 11 – A',
                'Class 12 – A'].
                map((c) =>
                <option key={c}>{c}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Examination
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500">

                {[
                'Unit Test 1',
                'Half Yearly',
                'Unit Test 2',
                'Preliminary Exam',
                'ICSE Board Exam'].
                map((e) =>
                <option key={e}>{e}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Roll No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />

              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Approval Status
              </label>
              <select
                value={approvalFilter}
                onChange={(e) =>
                setApprovalFilter(e.target.value as ApprovalStatus)
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option value="all">All Students</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card className="p-4 border-l-4 border-l-indigo-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Total
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.total}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Passed
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {stats.passed}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Failed
            </p>
            <p className="text-2xl font-black text-red-600 mt-1">
              {stats.failed}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-teal-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Approved
            </p>
            <p className="text-2xl font-black text-teal-600 mt-1">
              {stats.approved}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-yellow-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Pending
            </p>
            <p className="text-2xl font-black text-yellow-600 mt-1">
              {stats.pending}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Locked
            </p>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {stats.locked}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Avg %
            </p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {stats.avgPercent.toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Pass %
            </p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {stats.total > 0 ?
              Math.round(stats.passed / stats.total * 100) :
              0}
              %
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {/* Main Tabulation Table */}
          <div className="xl:col-span-3">
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-teal-600 to-indigo-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-white" />
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Tabulation Register
                    </h2>
                    <p className="text-xs text-teal-200">
                      {filteredStudents.length} students
                    </p>
                  </div>
                </div>
                {selectedStudents.size > 0 &&
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">
                      {selectedStudents.size} selected
                    </span>
                    <button
                    onClick={handleBulkApprove}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-teal-700 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors">

                      <CheckCheck className="w-3.5 h-3.5" />
                      Approve All
                    </button>
                    <button
                    onClick={handleBulkLock}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">

                      <Lock className="w-3.5 h-3.5" />
                      Lock All
                    </button>
                  </div>
                }
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3 text-left w-10">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 hover:bg-gray-200 rounded">

                          {selectedStudents.size === filteredStudents.length &&
                          filteredStudents.length > 0 ?
                          <CheckCircle2 className="w-4.5 h-4.5 text-teal-600" /> :

                          <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                          }
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[180px]">
                        Student
                      </th>
                      {SUBJECTS_CONFIG.map((sub) =>
                      <th
                        key={sub.id}
                        className="px-2 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">

                          <div>{sub.shortName}</div>
                          <div className="text-[9px] font-normal text-gray-400">
                            /{sub.maxMarks + 20}
                          </div>
                        </th>
                      )}
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => {
                      const gradeInfo = getGradeInfo(student.overallGrade);
                      const isExpanded = expandedStudent === student.id;
                      const isSelected = selectedStudents.has(student.id);
                      return (
                        <Fragment key={student.id}>
                          <tr
                            className={`transition-colors ${isSelected ? 'bg-teal-50' : student.isLocked ? 'bg-purple-50/40' : 'hover:bg-gray-50/60'}`}>

                            {/* Checkbox */}
                            <td className="px-3 py-3">
                              <button
                                onClick={() => toggleSelect(student.id)}
                                className="p-1 hover:bg-gray-200 rounded">

                                {isSelected ?
                                <CheckCircle2 className="w-4 h-4 text-teal-600" /> :

                                <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                                }
                              </button>
                            </td>
                            {/* Rank */}
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300' : student.rank === 2 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-300' : student.rank === 3 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300' : 'bg-gray-50 text-gray-600'}`}>

                                {student.rank}
                              </span>
                            </td>
                            {/* Student */}
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {student.name.
                                  split(' ').
                                  map((n) => n[0]).
                                  join('').
                                  slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Roll: {student.rollNo} ·{' '}
                                    {student.admissionNo}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/* Subject marks */}
                            {student.subjects.map((sub) => {
                              const subGradeInfo = getGradeInfo(sub.grade);
                              return (
                                <td
                                  key={sub.subjectId}
                                  className="px-2 py-3 text-center">

                                  {sub.isAbsent ?
                                  <span className="inline-flex items-center justify-center w-10 h-8 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg">
                                      AB
                                    </span> :

                                  <div className="flex flex-col items-center gap-0.5">
                                      <span
                                      className={`text-sm font-bold ${sub.isPassed ? 'text-gray-900' : 'text-red-600'}`}>

                                        {sub.totalMarks}
                                      </span>
                                      <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${subGradeInfo.bg} ${subGradeInfo.text}`}>

                                        {sub.grade}
                                      </span>
                                    </div>
                                  }
                                </td>);

                            })}
                            {/* Total */}
                            <td className="px-3 py-3 text-center">
                              <span className="text-sm font-bold text-gray-900">
                                {student.totalMarks}
                              </span>
                              <span className="text-xs text-gray-400">
                                /{student.totalMaxMarks}
                              </span>
                            </td>
                            {/* Percentage */}
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`text-sm font-bold ${student.percentage >= 75 ? 'text-emerald-600' : student.percentage >= 50 ? 'text-blue-600' : student.percentage >= 33 ? 'text-yellow-600' : 'text-red-600'}`}>

                                {student.percentage.toFixed(1)}%
                              </span>
                            </td>
                            {/* Grade */}
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-10 h-9 rounded-lg text-white text-xs font-bold shadow-sm ${gradeInfo.color}`}>

                                {student.overallGrade}
                              </span>
                            </td>
                            {/* Result */}
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${student.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                                {student.isPassed ?
                                <>
                                    <CheckCircle2 className="w-3 h-3" /> PASS
                                  </> :

                                <>
                                    <XCircle className="w-3 h-3" /> FAIL
                                  </>
                                }
                              </span>
                            </td>
                            {/* Approval Status */}
                            <td className="px-3 py-3 text-center">
                              {student.isLocked ?
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                  <Lock className="w-3 h-3" /> Locked
                                </span> :
                              student.isApproved ?
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                                  <Stamp className="w-3 h-3" /> Approved
                                </span> :

                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              }
                            </td>
                            {/* Actions */}
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() =>
                                  setExpandedStudent(
                                    isExpanded ? null : student.id
                                  )
                                  }
                                  className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                  title="View Details">

                                  <Eye className="w-4 h-4" />
                                </button>
                                {!student.isApproved &&
                                <button
                                  onClick={() => handleApprove(student.id)}
                                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve">

                                    <CheckCheck className="w-4 h-4" />
                                  </button>
                                }
                                <button
                                  onClick={() => handleLock(student.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${student.isLocked ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
                                  title={student.isLocked ? 'Unlock' : 'Lock'}>

                                  {student.isLocked ?
                                  <Unlock className="w-4 h-4" /> :

                                  <Lock className="w-4 h-4" />
                                  }
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Detail Row */}
                          {isExpanded &&
                          <tr>
                              <td
                              colSpan={SUBJECTS_CONFIG.length + 9}
                              className="px-0 py-0">

                                <div className="bg-gradient-to-b from-teal-50 to-white border-t border-b border-teal-100 px-6 py-5">
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Student Info */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-teal-600" />
                                        Student Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Admission No.
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {student.admissionNo}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Father's Name
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {student.fatherName}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Mother's Name
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {student.motherName}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Date of Birth
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {new Date(
                                            student.dob
                                          ).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Section
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {student.section}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">
                                            Class Rank
                                          </span>
                                          <span className="font-bold text-teal-700">
                                            #{student.rank}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Subject-wise Performance */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-teal-600" />
                                        Subject-wise Performance
                                      </h4>
                                      <div className="space-y-2">
                                        {student.subjects.map((sub) => {
                                        const maxTotal = sub.maxMarks + 20;
                                        const pct = sub.isAbsent ?
                                        0 :
                                        sub.totalMarks / maxTotal * 100;
                                        const subGradeInfo = getGradeInfo(
                                          sub.grade
                                        );
                                        return (
                                          <div key={sub.subjectId}>
                                              <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700">
                                                  {sub.shortName}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  {sub.isAbsent ?
                                                <span className="text-xs text-gray-400">
                                                      Absent
                                                    </span> :

                                                <>
                                                      <span className="text-xs font-bold text-gray-900">
                                                        {sub.totalMarks}/
                                                        {maxTotal}
                                                      </span>
                                                      <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${subGradeInfo.bg} ${subGradeInfo.text}`}>

                                                        {sub.grade}
                                                      </span>
                                                    </>
                                                }
                                                </div>
                                              </div>
                                              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                className={`h-full rounded-full transition-all ${subGradeInfo.color}`}
                                                style={{
                                                  width: `${pct}%`
                                                }} />

                                              </div>
                                            </div>);

                                      })}
                                      </div>
                                    </div>

                                    {/* Result Summary & Approval */}
                                    <div className="space-y-4">
                                      {/* Result Card */}
                                      <div
                                      className={`rounded-xl p-4 border ${gradeInfo.border} ${gradeInfo.bg}`}>

                                        <div className="flex items-center justify-between mb-3">
                                          <div>
                                            <p
                                            className={`text-xs font-semibold ${gradeInfo.text} uppercase tracking-wide`}>

                                              Overall Result
                                            </p>
                                            <p className="text-2xl font-black text-gray-900 mt-1">
                                              {student.percentage.toFixed(1)}%
                                            </p>
                                          </div>
                                          <div
                                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md ${gradeInfo.color}`}>

                                            {student.overallGrade}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${student.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                                            {student.isPassed ?
                                          <CheckCircle2 className="w-4 h-4" /> :

                                          <XCircle className="w-4 h-4" />
                                          }
                                            {student.isPassed ?
                                          'PASSED' :
                                          'FAILED'}
                                          </span>
                                          <span className="text-sm text-gray-600">
                                            {gradeInfo.label}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2 italic">
                                          "{student.remarks}"
                                        </p>
                                      </div>

                                      {/* Approval Info */}
                                      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                          <Shield className="w-4 h-4 text-teal-600" />
                                          Approval Status
                                        </h4>
                                        {student.isApproved ?
                                      <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-teal-700">
                                              <CheckCircle2 className="w-4 h-4" />
                                              <span className="font-semibold">
                                                Approved
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                              By: {student.approvedBy}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              On:{' '}
                                              {new Date(
                                            student.approvedOn
                                          ).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                            </p>
                                          </div> :

                                      <div className="space-y-3">
                                            <p className="text-xs text-yellow-700 font-medium flex items-center gap-1.5">
                                              <Clock className="w-3.5 h-3.5" />
                                              Pending principal approval
                                            </p>
                                            <button
                                          onClick={() =>
                                          handleApprove(student.id)
                                          }
                                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors">

                                              <CheckCheck className="w-4 h-4" />
                                              Approve Result
                                            </button>
                                          </div>
                                      }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          }
                        </Fragment>);

                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <strong className="text-gray-900">
                    {filteredStudents.length}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-gray-900">{students.length}</strong>{' '}
                  students
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Pass Rate:{' '}
                    <strong className="text-emerald-600">
                      {stats.total > 0 ?
                      Math.round(stats.passed / stats.total * 100) :
                      0}
                      %
                    </strong>
                  </span>
                  <span>
                    Class Avg:{' '}
                    <strong className="text-blue-600">
                      {stats.avgPercent.toFixed(1)}%
                    </strong>
                  </span>
                  <span>
                    Highest:{' '}
                    <strong className="text-green-600">
                      {stats.highest.toFixed(1)}%
                    </strong>
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Grade Distribution */}
            <Card className="p-4">
              <button
                onClick={() => setShowGradeScale(!showGradeScale)}
                className="w-full flex items-center justify-between mb-4">

                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Grade Distribution
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${showGradeScale ? 'rotate-180' : ''}`} />

              </button>
              <div className="space-y-2">
                {stats.gradeDistribution.map((g) =>
                <div key={g.grade} className="flex items-center gap-3">
                    <span
                    className={`w-9 h-7 rounded-lg ${g.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>

                      {g.grade}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className={`h-full ${g.color} transition-all duration-500`}
                      style={{
                        width: `${stats.total > 0 ? g.count / stats.total * 100 : 0}%`
                      }} />

                    </div>
                    <span className="text-xs font-bold text-gray-700 w-5 text-right">
                      {g.count}
                    </span>
                  </div>
                )}
              </div>

              {showGradeScale &&
              <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    CISCE Grade Scale
                  </p>
                  <div className="space-y-1.5">
                    {GRADE_SCALE.map((g) =>
                  <div
                    key={g.grade}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${g.bg} border ${g.border}`}>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${g.text}`}>
                            {g.grade}
                          </span>
                          <span className={`text-xs ${g.text}`}>{g.label}</span>
                        </div>
                        <span className={`text-[10px] font-medium ${g.text}`}>
                          {g.range}
                        </span>
                      </div>
                  )}
                  </div>
                </div>
              }
            </Card>

            {/* Top Performers */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {[...students].
                sort((a, b) => b.percentage - a.percentage).
                slice(0, 5).
                map((s, idx) => {
                  const gradeInfo = getGradeInfo(s.overallGrade);
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                        <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${idx === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300' : idx === 1 ? 'bg-gray-100 text-gray-700 ring-2 ring-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300' : 'bg-gray-50 text-gray-500'}`}>

                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Roll: {s.rollNo}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {s.percentage.toFixed(1)}%
                          </p>
                          <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${gradeInfo.bg} ${gradeInfo.text}`}>

                            {s.overallGrade}
                          </span>
                        </div>
                      </div>);

                })}
              </div>
            </Card>

            {/* Approval Progress */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-teal-600" />
                Approval Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Approved</span>
                  <span className="font-bold text-teal-700">
                    {stats.total > 0 ?
                    Math.round(stats.approved / stats.total * 100) :
                    0}
                    %
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? stats.approved / stats.total * 100 : 0}%`
                    }} />

                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <span className="text-sm font-bold text-teal-700">
                    {stats.approved}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">
                    {stats.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Locked</span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {stats.locked}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 bg-gradient-to-br from-teal-600 to-indigo-700 border-0">
              <h3 className="text-xs font-bold text-teal-200 uppercase tracking-wide mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStudents((prev) =>
                    prev.map((s) => ({
                      ...s,
                      isApproved: true,
                      approvedBy: 'Mrs. Sharma (Principal)',
                      approvedOn: new Date().toISOString().split('T')[0]
                    }))
                    );
                  }}
                  className="w-full flex items-center justify-start gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-lg transition-colors">

                  <CheckCheck className="w-4 h-4" />
                  Approve All Results
                </button>
                <button
                  onClick={() => {
                    setStudents((prev) =>
                    prev.map((s) =>
                    s.isApproved ?
                    {
                      ...s,
                      isLocked: true
                    } :
                    s
                    )
                    );
                  }}
                  className="w-full flex items-center justify-start gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-lg transition-colors">

                  <Lock className="w-4 h-4" />
                  Lock Approved Results
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-teal-700 text-sm font-bold rounded-lg hover:bg-teal-50 transition-colors">
                  <Send className="w-4 h-4" />
                  Publish Results
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}
export default CisceReportCard;