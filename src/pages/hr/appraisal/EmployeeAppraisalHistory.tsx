import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  MessageSquare,
  Download,
  Printer,
  Clock,
  Briefcase,
  Building,
  Filter,
  X,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  FileText,
  Share2,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  AlertCircle,
  BookOpen,
  Target,
  Zap,
  Users,
  Edit,
  Save,
  Trash2,
  Plus,
  Copy,
  Mail } from
'lucide-react';

// Types
interface AppraisalYear {
  year: string;
  cycleName: string;
  finalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  managerComment: string;
  selfScore: number;
  managerScore: number;
  peerScore: number;
  studentScore: number;
  strengths: string[];
  improvements: string[];
  expanded: boolean;
  goals?: Goal[];
  achievements?: string[];
  trainingsAttended?: string[];
  promotionRecommended?: boolean;
  incrementPercentage?: number;
}

interface Goal {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  weight: number;
  achievement: number;
}

interface Employee {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  yearsOfService: number;
  avatar: string;
  email: string;
  phone: string;
  reportingManager: string;
  history: AppraisalYear[];
}

interface Note {
  id: string;
  employeeId: string;
  year: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

interface ComparisonData {
  years: string[];
  metrics: {
    name: string;
    values: number[];
  }[];
}

type ExportFormat = 'csv' | 'json' | 'pdf';
type GradeFilter = 'all' | 'A' | 'B' | 'C' | 'D' | 'E';
type ViewMode = 'timeline' | 'cards' | 'table';

// Extended employee data
const employees: Employee[] = [
{
  id: 'EMP001',
  code: 'EMP-2020-001',
  name: 'Rajesh Kumar',
  designation: 'Senior Mathematics Teacher',
  department: 'Mathematics',
  joiningDate: '2020-04-15',
  yearsOfService: 4,
  avatar: 'RK',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  reportingManager: 'Dr. Suresh Patel',
  history: [
  {
    year: '2024',
    cycleName: 'Annual Review 2023-24',
    finalScore: 88,
    grade: 'A',
    managerComment:
    'Exceptional performance in curriculum delivery and student engagement. Rajesh has shown remarkable leadership in department initiatives and mentoring junior staff.',
    selfScore: 85,
    managerScore: 90,
    peerScore: 88,
    studentScore: 89,
    strengths: ['Subject expertise', 'Student engagement', 'Team collaboration'],
    improvements: ['Research publications', 'Technology integration'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Complete advanced certification', status: 'completed', weight: 25, achievement: 100 },
    { id: 'g2', title: 'Mentor 3 junior teachers', status: 'completed', weight: 25, achievement: 100 },
    { id: 'g3', title: 'Publish research paper', status: 'in-progress', weight: 25, achievement: 60 },
    { id: 'g4', title: 'Implement new teaching methods', status: 'completed', weight: 25, achievement: 90 }],

    achievements: ['Best Teacher Award Q2', 'Led Math Olympiad Team', '100% pass rate'],
    trainingsAttended: ['Advanced Pedagogy', 'Digital Teaching Tools', 'Leadership Workshop'],
    promotionRecommended: true,
    incrementPercentage: 12
  },
  {
    year: '2023',
    cycleName: 'Annual Review 2022-23',
    finalScore: 82,
    grade: 'B',
    managerComment:
    'Good overall performance with consistent results. Shows dedication to teaching and willingness to take on additional responsibilities.',
    selfScore: 80,
    managerScore: 84,
    peerScore: 82,
    studentScore: 82,
    strengths: ['Classroom management', 'Punctuality', 'Subject knowledge'],
    improvements: ['Innovation in teaching methods', 'Parent communication'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Complete certification course', status: 'completed', weight: 30, achievement: 100 },
    { id: 'g2', title: 'Improve student pass rate', status: 'completed', weight: 40, achievement: 95 },
    { id: 'g3', title: 'Parent engagement initiative', status: 'in-progress', weight: 30, achievement: 70 }],

    achievements: ['Improved class average by 15%', 'Organized Inter-school Quiz'],
    trainingsAttended: ['Classroom Management', 'Parent Communication'],
    promotionRecommended: false,
    incrementPercentage: 10
  },
  {
    year: '2022',
    cycleName: 'Annual Review 2021-22',
    finalScore: 78,
    grade: 'B',
    managerComment:
    'Steady performance with room for growth. Adapting well to new curriculum changes and showing improvement in student outcomes.',
    selfScore: 75,
    managerScore: 80,
    peerScore: 78,
    studentScore: 79,
    strengths: ['Dedication', 'Reliability', 'Student rapport'],
    improvements: ['Assessment techniques', 'Use of technology'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Adapt to new curriculum', status: 'completed', weight: 50, achievement: 85 },
    { id: 'g2', title: 'Technology integration', status: 'in-progress', weight: 50, achievement: 60 }],

    achievements: ['Smooth curriculum transition', 'Student feedback improvement'],
    trainingsAttended: ['New Curriculum Training', 'Basic IT Skills'],
    promotionRecommended: false,
    incrementPercentage: 8
  },
  {
    year: '2021',
    cycleName: 'Annual Review 2020-21',
    finalScore: 72,
    grade: 'C',
    managerComment:
    'First full year of service. Shows potential and eagerness to learn. Needs to develop more confidence in handling challenging situations.',
    selfScore: 70,
    managerScore: 74,
    peerScore: 72,
    studentScore: 72,
    strengths: ['Enthusiasm', 'Learning attitude', 'Cooperation'],
    improvements: ['Classroom control', 'Time management', 'Documentation'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Complete probation successfully', status: 'completed', weight: 50, achievement: 100 },
    { id: 'g2', title: 'Establish teaching routine', status: 'completed', weight: 50, achievement: 80 }],

    achievements: ['Successful completion of first year'],
    trainingsAttended: ['Induction Training', 'Teaching Fundamentals'],
    promotionRecommended: false,
    incrementPercentage: 5
  },
  {
    year: '2020',
    cycleName: 'Probation Review',
    finalScore: 68,
    grade: 'C',
    managerComment:
    'Probation period completed satisfactorily. Demonstrates basic teaching competencies and willingness to improve.',
    selfScore: 65,
    managerScore: 70,
    peerScore: 68,
    studentScore: 69,
    strengths: ['Subject fundamentals', 'Punctuality', 'Positive attitude'],
    improvements: ['Teaching methodology', 'Student assessment', 'Communication'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Complete probation', status: 'completed', weight: 100, achievement: 100 }],

    achievements: ['Probation cleared'],
    trainingsAttended: ['Onboarding Program'],
    promotionRecommended: false,
    incrementPercentage: 0
  }]

},
{
  id: 'EMP002',
  code: 'EMP-2019-045',
  name: 'Priya Sharma',
  designation: 'English Teacher',
  department: 'English',
  joiningDate: '2019-07-01',
  yearsOfService: 5,
  avatar: 'PS',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  reportingManager: 'Mrs. Anita Desai',
  history: [
  {
    year: '2024',
    cycleName: 'Annual Review 2023-24',
    finalScore: 92,
    grade: 'A',
    managerComment:
    'Outstanding performance across all parameters. Priya has been instrumental in improving English proficiency scores across the school.',
    selfScore: 88,
    managerScore: 94,
    peerScore: 92,
    studentScore: 94,
    strengths: ['Creative teaching', 'Student motivation', 'Extra-curricular involvement'],
    improvements: ['Administrative tasks'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Lead English Department initiatives', status: 'completed', weight: 30, achievement: 100 },
    { id: 'g2', title: 'Organize literary fest', status: 'completed', weight: 30, achievement: 100 },
    { id: 'g3', title: 'Improve school average in English', status: 'completed', weight: 40, achievement: 95 }],

    achievements: ['Best Department Award', 'Literary Fest Success', 'National Level Student Achievement'],
    trainingsAttended: ['Creative Writing Workshop', 'Leadership Training', 'Event Management'],
    promotionRecommended: true,
    incrementPercentage: 15
  },
  {
    year: '2023',
    cycleName: 'Annual Review 2022-23',
    finalScore: 90,
    grade: 'A',
    managerComment:
    'Excellent year with significant contributions to literary events and student achievements in competitions.',
    selfScore: 87,
    managerScore: 92,
    peerScore: 90,
    studentScore: 91,
    strengths: ['Innovation', 'Student outcomes', 'Event organization'],
    improvements: ['Documentation', 'Peer mentoring'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Organize debate competition', status: 'completed', weight: 40, achievement: 100 },
    { id: 'g2', title: 'Improve writing skills program', status: 'completed', weight: 60, achievement: 90 }],

    achievements: ['Debate Team Winners', 'Writing Competition Organizer'],
    trainingsAttended: ['Public Speaking', 'Assessment Methods'],
    promotionRecommended: true,
    incrementPercentage: 12
  },
  {
    year: '2022',
    cycleName: 'Annual Review 2021-22',
    finalScore: 85,
    grade: 'A',
    managerComment:
    'Consistent high performer with excellent student feedback and peer collaboration.',
    selfScore: 82,
    managerScore: 87,
    peerScore: 85,
    studentScore: 86,
    strengths: ['Teaching quality', 'Creativity', 'Reliability'],
    improvements: ['Research work', 'Technology adoption'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Maintain high student satisfaction', status: 'completed', weight: 50, achievement: 95 },
    { id: 'g2', title: 'Collaborate with peers', status: 'completed', weight: 50, achievement: 90 }],

    achievements: ['High Student Ratings', 'Peer Collaboration Award'],
    trainingsAttended: ['Digital Learning Tools', 'Collaborative Teaching'],
    promotionRecommended: false,
    incrementPercentage: 10
  },
  {
    year: '2021',
    cycleName: 'Annual Review 2020-21',
    finalScore: 80,
    grade: 'B',
    managerComment:
    'Strong performance during challenging online teaching period. Adapted well to new methods.',
    selfScore: 78,
    managerScore: 82,
    peerScore: 80,
    studentScore: 80,
    strengths: ['Adaptability', 'Online teaching', 'Student support'],
    improvements: ['Assessment variety', 'Parent engagement'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Transition to online teaching', status: 'completed', weight: 60, achievement: 90 },
    { id: 'g2', title: 'Maintain student engagement', status: 'completed', weight: 40, achievement: 85 }],

    achievements: ['Smooth Online Transition', 'Student Retention'],
    trainingsAttended: ['Online Teaching Tools', 'Virtual Classroom Management'],
    promotionRecommended: false,
    incrementPercentage: 8
  },
  {
    year: '2020',
    cycleName: 'Annual Review 2019-20',
    finalScore: 75,
    grade: 'B',
    managerComment:
    'Good first full year. Shows promise and dedication to the profession.',
    selfScore: 72,
    managerScore: 77,
    peerScore: 75,
    studentScore: 76,
    strengths: ['Enthusiasm', 'Subject knowledge', 'Punctuality'],
    improvements: ['Classroom management', 'Differentiated instruction'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Establish classroom presence', status: 'completed', weight: 50, achievement: 80 },
    { id: 'g2', title: 'Complete training requirements', status: 'completed', weight: 50, achievement: 100 }],

    achievements: ['Successfully Completed First Year', 'Good Student Feedback'],
    trainingsAttended: ['Teaching Methods', 'Classroom Management Basics'],
    promotionRecommended: false,
    incrementPercentage: 5
  }]

},
{
  id: 'EMP003',
  code: 'EMP-2018-022',
  name: 'Amit Patel',
  designation: 'Science Teacher',
  department: 'Science',
  joiningDate: '2018-01-15',
  yearsOfService: 6,
  avatar: 'AP',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  reportingManager: 'Dr. Ramesh Gupta',
  history: [
  {
    year: '2024',
    cycleName: 'Annual Review 2023-24',
    finalScore: 78,
    grade: 'B',
    managerComment:
    'Good performance with consistent delivery. Needs to focus more on innovative teaching methods.',
    selfScore: 76,
    managerScore: 80,
    peerScore: 78,
    studentScore: 78,
    strengths: ['Lab management', 'Safety protocols', 'Subject knowledge'],
    improvements: ['Student engagement', 'Interactive teaching', 'Research'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Improve lab safety', status: 'completed', weight: 40, achievement: 100 },
    { id: 'g2', title: 'Student project guidance', status: 'in-progress', weight: 60, achievement: 70 }],

    achievements: ['Zero Lab Accidents', 'Science Fair Participation'],
    trainingsAttended: ['Lab Safety', 'Project-Based Learning'],
    promotionRecommended: false,
    incrementPercentage: 8
  },
  {
    year: '2023',
    cycleName: 'Annual Review 2022-23',
    finalScore: 75,
    grade: 'B',
    managerComment:
    'Steady performance. Reliable in lab management but needs more enthusiasm in classroom teaching.',
    selfScore: 73,
    managerScore: 77,
    peerScore: 75,
    studentScore: 75,
    strengths: ['Reliability', 'Technical knowledge', 'Lab skills'],
    improvements: ['Classroom energy', 'Student motivation', 'Innovation'],
    expanded: false,
    goals: [
    { id: 'g1', title: 'Maintain lab standards', status: 'completed', weight: 50, achievement: 95 },
    { id: 'g2', title: 'Improve teaching methods', status: 'in-progress', weight: 50, achievement: 60 }],

    achievements: ['Lab Certification Renewed'],
    trainingsAttended: ['Teaching Innovation', 'Student Psychology'],
    promotionRecommended: false,
    incrementPercentage: 6
  }]

}];


// Current user simulation
const CURRENT_USER = 'Admin User';

export function EmployeeAppraisalHistory() {
  // Core state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedYears, setExpandedYears] = useState<string[]>([]);

  // Filter state
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [yearRangeStart, setYearRangeStart] = useState<string>('');
  const [yearRangeEnd, setYearRangeEnd] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(true);

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  // Comparison state
  const [selectedYearsForComparison, setSelectedYearsForComparison] = useState<string[]>([]);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteYear, setNoteYear] = useState<string>('');

  // Detail modal state
  const [selectedYearDetail, setSelectedYearDetail] = useState<AppraisalYear | null>(null);

  // Loading and message states
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

  // Get filtered employees based on search
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    const query = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
      e.name.toLowerCase().includes(query) ||
      e.code.toLowerCase().includes(query) ||
      e.id.toLowerCase().includes(query) ||
      e.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get selected employee
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId);
  }, [selectedEmployeeId]);

  // Filter history based on grade and year filters
  const filteredHistory = useMemo(() => {
    if (!selectedEmployee) return [];

    let history = [...selectedEmployee.history];

    // Filter by grade
    if (gradeFilter !== 'all') {
      history = history.filter((h) => h.grade === gradeFilter);
    }

    // Filter by year range
    if (yearRangeStart) {
      history = history.filter((h) => parseInt(h.year) >= parseInt(yearRangeStart));
    }
    if (yearRangeEnd) {
      history = history.filter((h) => parseInt(h.year) <= parseInt(yearRangeEnd));
    }

    return history;
  }, [selectedEmployee, gradeFilter, yearRangeStart, yearRangeEnd]);

  // Calculate performance insights
  const performanceInsights = useMemo(() => {
    if (!selectedEmployee || selectedEmployee.history.length === 0) return null;

    const history = selectedEmployee.history;
    const scores = history.map((h) => h.finalScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const latestScore = scores[0];
    const previousScore = scores[1] || scores[0];
    const trend = latestScore - previousScore;

    const gradeDistribution = history.reduce(
      (acc, h) => {
        acc[h.grade] = (acc[h.grade] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const avgSelfScore = history.reduce((a, b) => a + b.selfScore, 0) / history.length;
    const avgManagerScore = history.reduce((a, b) => a + b.managerScore, 0) / history.length;
    const avgPeerScore = history.reduce((a, b) => a + b.peerScore, 0) / history.length;
    const avgStudentScore = history.reduce((a, b) => a + b.studentScore, 0) / history.length;

    const promotionCount = history.filter((h) => h.promotionRecommended).length;
    const totalIncrement = history.reduce((a, b) => a + (b.incrementPercentage || 0), 0);

    return {
      avgScore: avgScore.toFixed(1),
      maxScore,
      minScore,
      latestScore,
      trend,
      gradeDistribution,
      avgSelfScore: avgSelfScore.toFixed(1),
      avgManagerScore: avgManagerScore.toFixed(1),
      avgPeerScore: avgPeerScore.toFixed(1),
      avgStudentScore: avgStudentScore.toFixed(1),
      promotionCount,
      totalIncrement,
      yearsAnalyzed: history.length
    };
  }, [selectedEmployee]);

  // Get comparison data
  const comparisonData = useMemo((): ComparisonData | null => {
    if (!selectedEmployee || selectedYearsForComparison.length < 2) return null;

    const selectedYearsData = selectedEmployee.history.filter((h) =>
    selectedYearsForComparison.includes(h.year)
    );

    return {
      years: selectedYearsData.map((y) => y.year),
      metrics: [
      { name: 'Final Score', values: selectedYearsData.map((y) => y.finalScore) },
      { name: 'Self Score', values: selectedYearsData.map((y) => y.selfScore) },
      { name: 'Manager Score', values: selectedYearsData.map((y) => y.managerScore) },
      { name: 'Peer Score', values: selectedYearsData.map((y) => y.peerScore) },
      { name: 'Student Score', values: selectedYearsData.map((y) => y.studentScore) }]

    };
  }, [selectedEmployee, selectedYearsForComparison]);

  // Toggle year expansion
  const toggleYear = useCallback((year: string) => {
    setExpandedYears((prev) =>
    prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  }, []);

  // Expand all years
  const expandAllYears = useCallback(() => {
    if (!selectedEmployee) return;
    setExpandedYears(selectedEmployee.history.map((h) => h.year));
  }, [selectedEmployee]);

  // Collapse all years
  const collapseAllYears = useCallback(() => {
    setExpandedYears([]);
  }, []);

  // Toggle year for comparison
  const toggleYearComparison = useCallback((year: string) => {
    setSelectedYearsForComparison((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      if (prev.length >= 3) {
        setErrorMessage('You can compare up to 3 years at a time');
        setTimeout(() => setErrorMessage(null), 3000);
        return prev;
      }
      return [...prev, year];
    });
  }, []);

  // Open comparison modal
  const openComparisonModal = useCallback(() => {
    if (selectedYearsForComparison.length < 2) {
      setErrorMessage('Please select at least 2 years to compare');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setShowComparisonModal(true);
  }, [selectedYearsForComparison]);

  // Clear year comparison selection
  const clearYearComparison = useCallback(() => {
    setSelectedYearsForComparison([]);
  }, []);

  // Open note modal
  const openNoteModal = useCallback((year: string) => {
    setNoteYear(year);
    setCurrentNote('');
    setShowNoteModal(true);
  }, []);

  // Save note
  const saveNote = useCallback(() => {
    if (!currentNote.trim() || !selectedEmployeeId || !noteYear) {
      setErrorMessage('Please enter a note');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      employeeId: selectedEmployeeId,
      year: noteYear,
      content: currentNote.trim(),
      createdAt: new Date(),
      createdBy: CURRENT_USER
    };

    setNotes((prev) => [...prev, newNote]);
    setShowNoteModal(false);
    setCurrentNote('');
    setNoteYear('');
    setSuccessMessage('Note saved successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [currentNote, selectedEmployeeId, noteYear]);

  // Delete note
  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setSuccessMessage('Note deleted');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Get notes for a specific year
  const getNotesForYear = useCallback(
    (year: string) => {
      return notes.filter((n) => n.employeeId === selectedEmployeeId && n.year === year);
    },
    [notes, selectedEmployeeId]
  );

  // Open detail modal
  const openDetailModal = useCallback((year: AppraisalYear) => {
    setSelectedYearDetail(year);
    setShowDetailModal(true);
  }, []);

  // Export data
  const exportData = useCallback(
    (format: ExportFormat) => {
      if (!selectedEmployee) return;

      setIsLoading(true);

      setTimeout(() => {
        const exportPayload = {
          employee: {
            id: selectedEmployee.id,
            code: selectedEmployee.code,
            name: selectedEmployee.name,
            designation: selectedEmployee.designation,
            department: selectedEmployee.department,
            joiningDate: selectedEmployee.joiningDate,
            yearsOfService: selectedEmployee.yearsOfService
          },
          appraisalHistory: filteredHistory.map((h) => ({
            year: h.year,
            cycleName: h.cycleName,
            finalScore: h.finalScore,
            grade: h.grade,
            selfScore: h.selfScore,
            managerScore: h.managerScore,
            peerScore: h.peerScore,
            studentScore: h.studentScore,
            managerComment: h.managerComment,
            strengths: h.strengths,
            improvements: h.improvements,
            promotionRecommended: h.promotionRecommended,
            incrementPercentage: h.incrementPercentage
          })),
          insights: performanceInsights,
          exportedAt: new Date().toISOString(),
          exportedBy: CURRENT_USER
        };

        if (format === 'csv') {
          const headers = [
          'Year',
          'Cycle',
          'Final Score',
          'Grade',
          'Self Score',
          'Manager Score',
          'Peer Score',
          'Student Score',
          'Promotion Recommended',
          'Increment %'];

          const rows = filteredHistory.map((h) =>
          [
          h.year,
          h.cycleName,
          h.finalScore,
          h.grade,
          h.selfScore,
          h.managerScore,
          h.peerScore,
          h.studentScore,
          h.promotionRecommended ? 'Yes' : 'No',
          h.incrementPercentage || 0].
          join(',')
          );

          const csvContent = [
          `Employee: ${selectedEmployee.name} (${selectedEmployee.code})`,
          `Department: ${selectedEmployee.department}`,
          `Generated: ${new Date().toLocaleString()}`,
          '',
          headers.join(','),
          ...rows].
          join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `appraisal_history_${selectedEmployee.code}.csv`;
          link.click();
          URL.revokeObjectURL(link.href);
        } else if (format === 'json') {
          const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
            type: 'application/json'
          });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `appraisal_history_${selectedEmployee.code}.json`;
          link.click();
          URL.revokeObjectURL(link.href);
        } else if (format === 'pdf') {
          console.log('PDF export data:', exportPayload);
          setSuccessMessage('PDF export initiated. Check your downloads.');
        }

        setIsLoading(false);
        setShowExportModal(false);
        setSuccessMessage(`Data exported successfully as ${format.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }, 1000);
    },
    [selectedEmployee, filteredHistory, performanceInsights]
  );

  // Print functionality
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Share via email
  const shareViaEmail = useCallback(() => {
    if (!selectedEmployee) return;

    const subject = encodeURIComponent(
      `Appraisal History - ${selectedEmployee.name} (${selectedEmployee.code})`
    );
    const body = encodeURIComponent(
      `Please find the appraisal history for ${selectedEmployee.name}.\n\nLatest Score: ${selectedEmployee.history[0]?.finalScore || 'N/A'}\nGrade: ${selectedEmployee.history[0]?.grade || 'N/A'}\n\nGenerated on: ${new Date().toLocaleDateString()}`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareModal(false);
    setSuccessMessage('Email client opened');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [selectedEmployee]);

  // Copy link
  const copyLink = useCallback(() => {
    if (!selectedEmployee) return;

    const link = `${window.location.origin}/hr/appraisal/history/${selectedEmployee.id}`;
    navigator.clipboard.writeText(link);
    setSuccessMessage('Link copied to clipboard');
    setTimeout(() => setSuccessMessage(null), 3000);
    setShowShareModal(false);
  }, [selectedEmployee]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setGradeFilter('all');
    setYearRangeStart('');
    setYearRangeEnd('');
    setSearchQuery('');
    setSuccessMessage('Filters reset');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Get grade badge
  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      A: 'bg-green-100 text-green-700 border-green-200',
      B: 'bg-blue-100 text-blue-700 border-blue-200',
      C: 'bg-amber-100 text-amber-700 border-amber-200',
      D: 'bg-orange-100 text-orange-700 border-orange-200',
      E: 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold border-2 ${colors[grade] || colors.C}`}>

        {grade}
      </span>);

  };

  // Get grade border color
  const getGradeBorderColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: 'border-l-green-500',
      B: 'border-l-blue-500',
      C: 'border-l-amber-500',
      D: 'border-l-orange-500',
      E: 'border-l-red-500'
    };
    return colors[grade] || colors.C;
  };

  // Get score trend
  const getScoreTrend = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />+{diff}
        </span>);

    } else if (diff < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm">
          <TrendingDown className="w-4 h-4 mr-1" />
          {diff}
        </span>);

    }
    return <span className="text-gray-500 text-sm">—</span>;
  };

  // Get available years for dropdown
  const availableYears = useMemo(() => {
    if (!selectedEmployee) return [];
    return selectedEmployee.history.map((h) => h.year);
  }, [selectedEmployee]);

  return (
    <div className="space-y-6 p-6" ref={printRef}>
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 no-print">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>HR</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Appraisal</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Employee History</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Appraisal History</h1>
          <p className="text-sm text-gray-500">
            View historical performance data and score trajectory
          </p>
        </div>
        {selectedEmployee &&
        <div className="flex gap-2 no-print">
            <Button variant="outline" onClick={() => setShowInsightsModal(true)}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </Button>
            <Button variant="outline" onClick={() => setShowShareModal(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      </div>

      {/* Messages */}
      {successMessage &&
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)}>
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      }

      {errorMessage &&
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      }

      {/* Search and Employee Selection */}
      <Card className="p-4 no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee ID, name, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                <X className="w-4 h-4" />
              </button>
            }
          </div>

          <Select
            label=""
            options={[
            { value: '', label: 'Select Employee' },
            ...filteredEmployees.map((e) => ({
              value: e.id,
              label: `${e.code} - ${e.name}`
            }))]
            }
            value={selectedEmployeeId}
            onChange={(val) => {
              setSelectedEmployeeId(val as string);
              setExpandedYears([]);
              setSelectedYearsForComparison([]);
            }} />


          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50' : ''}>

            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(gradeFilter !== 'all' || yearRangeStart || yearRangeEnd) &&
            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
            }
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters &&
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Filter
                </label>
                <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value as GradeFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="all">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                  <option value="E">Grade E</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year From
                </label>
                <select
                value={yearRangeStart}
                onChange={(e) => setYearRangeStart(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="">Any</option>
                  {availableYears.map((y) =>
                <option key={y} value={y}>
                      {y}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year To
                </label>
                <select
                value={yearRangeEnd}
                onChange={(e) => setYearRangeEnd(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="">Any</option>
                  {availableYears.map((y) =>
                <option key={y} value={y}>
                      {y}
                    </option>
                )}
                </select>
              </div>

              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* No Employee Selected State */}
      {!selectedEmployee ?
      <Card className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Employee</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Choose an employee from the dropdown above to view their complete appraisal
            history and performance trajectory.
          </p>
          {filteredEmployees.length > 0 && filteredEmployees.length < employees.length &&
        <p className="mt-4 text-sm text-blue-600">
              {filteredEmployees.length} employee(s) match your search
            </p>
        }
        </Card> :

      <>
          {/* Employee Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">{selectedEmployee.avatar}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                <p className="text-gray-600">{selectedEmployee.designation}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {selectedEmployee.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined:{' '}
                    {new Date(selectedEmployee.joiningDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedEmployee.yearsOfService} Years of Service
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Reports to: {selectedEmployee.reportingManager}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {selectedEmployee.email}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{selectedEmployee.code}</Badge>
            </div>
          </Card>

          {/* Score Trajectory Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                Score Trajectory ({filteredHistory.length} Years)
              </h3>
              <div className="flex items-center gap-2 no-print">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}>

                  {showScoreBreakdown ?
                <EyeOff className="w-4 h-4 mr-1" /> :

                <Eye className="w-4 h-4 mr-1" />
                }
                  {showScoreBreakdown ? 'Hide' : 'Show'} Trend
                </Button>
              </div>
            </div>

            {showScoreBreakdown &&
          <div className="relative h-48 flex items-end justify-between gap-4 px-4">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400 py-2">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
                  {[100, 75, 50, 25, 0].map((line) =>
              <div key={line} className="border-b border-gray-100 w-full" />
              )}
                </div>
                <div className="relative flex-1 flex items-end justify-around ml-12">
                  {filteredHistory.
              slice().
              reverse().
              map((year, idx, arr) => {
                const prevScore = idx > 0 ? arr[idx - 1].finalScore : undefined;
                return (
                  <div
                    key={year.year}
                    className="flex flex-col items-center gap-2 relative cursor-pointer hover:opacity-80"
                    onClick={() => openDetailModal(year)}>

                          <div className="relative">
                            <div
                        className={`w-12 rounded-t-lg transition-all duration-500 ${
                        year.grade === 'A' ?
                        'bg-green-500' :
                        year.grade === 'B' ?
                        'bg-blue-500' :
                        year.grade === 'C' ?
                        'bg-amber-500' :
                        'bg-red-500'}`
                        }
                        style={{ height: `${year.finalScore * 1.6}px` }} />

                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-900">
                              {year.finalScore}
                            </div>
                            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                              {getScoreTrend(year.finalScore, prevScore)}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">{year.year}</span>
                        </div>);

              })}
                </div>
              </div>
          }

            {filteredHistory.length === 0 &&
          <div className="text-center py-8 text-gray-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No appraisal records match the current filters.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
          }
          </Card>

          {/* Controls for Timeline */}
          {filteredHistory.length > 0 &&
        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  Year-wise Performance History
                </h3>
                <span className="text-sm text-gray-500">
                  ({filteredHistory.length} records)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedYearsForComparison.length > 0 &&
            <>
                    <span className="text-sm text-gray-600">
                      {selectedYearsForComparison.length} selected
                    </span>
                    <Button variant="primary" size="sm" onClick={openComparisonModal}>
                      Compare Years
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearYearComparison}>
                      Clear
                    </Button>
                    <div className="h-6 w-px bg-gray-200 mx-2" />
                  </>
            }

                <Button variant="outline" size="sm" onClick={expandAllYears}>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAllYears}>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Collapse All
                </Button>
              </div>
            </div>
        }

          {/* Year-wise History */}
          <div className="space-y-4">
            {filteredHistory.map((year, idx) => {
            const isExpanded = expandedYears.includes(year.year);
            const prevYear = filteredHistory[idx + 1];
            const yearNotes = getNotesForYear(year.year);
            const isSelectedForComparison = selectedYearsForComparison.includes(year.year);

            return (
              <Card
                key={year.year}
                className={`overflow-hidden border-l-4 ${getGradeBorderColor(year.grade)} ${
                isSelectedForComparison ? 'ring-2 ring-blue-500' : ''}`
                }>

                  {/* Header */}
                  <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleYear(year.year)}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Comparison Checkbox */}
                        <div className="no-print">
                          <input
                          type="checkbox"
                          checked={isSelectedForComparison}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleYearComparison(year.year);
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{year.year}</p>
                          <p className="text-xs text-gray-500">{year.cycleName}</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div className="flex items-center gap-4">
                          {getGradeBadge(year.grade)}
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{year.finalScore}</p>
                            <p className="text-xs text-gray-500">Final Score</p>
                          </div>
                          {getScoreTrend(year.finalScore, prevYear?.finalScore)}
                        </div>

                        {/* Quick badges */}
                        <div className="flex items-center gap-2 ml-4">
                          {year.promotionRecommended &&
                        <Badge variant="success" className="text-xs">
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              Promotion Rec.
                            </Badge>
                        }
                          {year.incrementPercentage && year.incrementPercentage > 10 &&
                        <Badge variant="info" className="text-xs">
                              +{year.incrementPercentage}% Increment
                            </Badge>
                        }
                          {yearNotes.length > 0 &&
                        <Badge variant="secondary" className="text-xs">
                              {yearNotes.length} Note(s)
                            </Badge>
                        }
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-gray-600 line-clamp-1 max-w-md">
                            {year.managerComment.substring(0, 80)}...
                          </p>
                        </div>
                        {isExpanded ?
                      <ChevronUp className="w-5 h-5 text-gray-400" /> :

                      <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded &&
                <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-blue-600 uppercase">Self Score</p>
                          <p className="text-xl font-bold text-blue-700">{year.selfScore}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-green-600 uppercase">Manager Score</p>
                          <p className="text-xl font-bold text-green-700">{year.managerScore}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-600 uppercase">Peer Score</p>
                          <p className="text-xl font-bold text-purple-700">{year.peerScore}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-amber-600 uppercase">Student Score</p>
                          <p className="text-xl font-bold text-amber-700">{year.studentScore}</p>
                        </div>
                      </div>

                      {/* Manager Comment */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Manager's Comment</p>
                            <p className="text-sm text-gray-600 mt-1">{year.managerComment}</p>
                          </div>
                        </div>
                      </div>

                      {/* Strengths and Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <Star className="w-4 h-4 text-green-500" />
                            Key Strengths
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {year.strengths.map((s, i) =>
                        <Badge key={i} variant="success">
                                {s}
                              </Badge>
                        )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <Target className="w-4 h-4 text-amber-500" />
                            Areas for Improvement
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {year.improvements.map((s, i) =>
                        <Badge key={i} variant="warning">
                                {s}
                              </Badge>
                        )}
                          </div>
                        </div>
                      </div>

                      {/* Goals */}
                      {year.goals && year.goals.length > 0 &&
                  <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <Target className="w-4 h-4 text-blue-500" />
                            Goals ({year.goals.length})
                          </p>
                          <div className="space-y-2">
                            {year.goals.slice(0, 3).map((goal) =>
                      <div
                        key={goal.id}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">

                                <div className="flex items-center gap-2">
                                  {goal.status === 'completed' ?
                          <CheckCircle className="w-4 h-4 text-green-500" /> :
                          goal.status === 'in-progress' ?
                          <Clock className="w-4 h-4 text-amber-500" /> :

                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          }
                                  <span className="text-sm">{goal.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {goal.achievement}% achieved
                                  </span>
                                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                              className={`h-full ${
                              goal.achievement >= 80 ?
                              'bg-green-500' :
                              goal.achievement >= 50 ?
                              'bg-amber-500' :
                              'bg-red-500'}`
                              }
                              style={{ width: `${goal.achievement}%` }} />

                                  </div>
                                </div>
                              </div>
                      )}
                            {year.goals.length > 3 &&
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedYearDetail(year);
                          setShowGoalsModal(true);
                        }}>

                                View All Goals ({year.goals.length})
                              </Button>
                      }
                          </div>
                        </div>
                  }

                      {/* Achievements & Trainings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {year.achievements && year.achievements.length > 0 &&
                    <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <Award className="w-4 h-4 text-yellow-500" />
                              Achievements
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {year.achievements.map((a, i) =>
                        <li key={i}>{a}</li>
                        )}
                            </ul>
                          </div>
                    }
                        {year.trainingsAttended && year.trainingsAttended.length > 0 &&
                    <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <BookOpen className="w-4 h-4 text-purple-500" />
                              Trainings Attended
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {year.trainingsAttended.map((t, i) =>
                        <Badge key={i} variant="secondary">
                                  {t}
                                </Badge>
                        )}
                            </div>
                          </div>
                    }
                      </div>

                      {/* Increment & Promotion */}
                      {(year.incrementPercentage !== undefined || year.promotionRecommended) &&
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                          {year.incrementPercentage !== undefined &&
                    <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-green-500" />
                              <span className="text-sm">
                                Increment: <strong>{year.incrementPercentage}%</strong>
                              </span>
                            </div>
                    }
                          {year.promotionRecommended &&
                    <div className="flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-blue-600 font-medium">
                                Promotion Recommended
                              </span>
                            </div>
                    }
                        </div>
                  }

                      {/* Notes */}
                      {yearNotes.length > 0 &&
                  <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Notes ({yearNotes.length})
                          </p>
                          <div className="space-y-2">
                            {yearNotes.map((note) =>
                      <div
                        key={note.id}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">

                                <div className="flex justify-between items-start">
                                  <p className="text-sm text-gray-700">{note.content}</p>
                                  <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className="text-gray-400 hover:text-red-500 no-print">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {note.createdBy} • {note.createdAt.toLocaleString()}
                                </p>
                              </div>
                      )}
                          </div>
                        </div>
                  }

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 no-print">
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openNoteModal(year.year);
                      }}>

                          <Plus className="w-4 h-4 mr-1" />
                          Add Note
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(year);
                      }}>

                          <Eye className="w-4 h-4 mr-1" />
                          Full Details
                        </Button>
                      </div>
                    </div>
                }
                </Card>);

          })}
          </div>
        </>
      }

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Appraisal History"
        size="sm">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose a format to export the appraisal history data.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => exportData('csv')}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <FileText className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">CSV Format</div>
                <div className="text-xs text-gray-500">
                  Compatible with Excel, Google Sheets
                </div>
              </div>
            </button>
            <button
              onClick={() => exportData('json')}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">JSON Format</div>
                <div className="text-xs text-gray-500">For developers and API integration</div>
              </div>
            </button>
            <button
              onClick={() => exportData('pdf')}
              disabled={isLoading}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <FileText className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">PDF Report</div>
                <div className="text-xs text-gray-500">Formatted report for printing</div>
              </div>
            </button>
          </div>
          {isLoading &&
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating export...
            </div>
          }
        </div>
      </Modal>

      {/* Comparison Modal */}
      <Modal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        title="Year-wise Comparison"
        size="lg">

        {comparisonData &&
        <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Metric
                    </th>
                    {comparisonData.years.map((year) =>
                  <th
                    key={year}
                    className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase">

                        {year}
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonData.metrics.map((metric) => {
                  const max = Math.max(...metric.values);
                  const min = Math.min(...metric.values);
                  return (
                    <tr key={metric.name}>
                        <td className="py-2 px-3 font-medium">{metric.name}</td>
                        {metric.values.map((value, idx) =>
                      <td
                        key={idx}
                        className={`py-2 px-3 text-center font-bold ${
                        value === max ?
                        'text-green-600 bg-green-50' :
                        value === min ?
                        'text-red-600 bg-red-50' :
                        ''}`
                        }>

                            {value}
                          </td>
                      )}
                      </tr>);

                })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowComparisonModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title={`Add Note for ${noteYear}`}
        size="sm">

        <div className="space-y-4">
          <Textarea
            label="Note"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={4} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveNote}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Appraisal History"
        size="sm">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share {selectedEmployee?.name}'s appraisal history.
          </p>
          <div className="space-y-3">
            <button
              onClick={shareViaEmail}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <Mail className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Share via Email</div>
                <div className="text-xs text-gray-500">Open email client with summary</div>
              </div>
            </button>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <Copy className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Copy Link</div>
                <div className="text-xs text-gray-500">Copy shareable link to clipboard</div>
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* Insights Modal */}
      <Modal
        isOpen={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        title="Performance Insights"
        size="lg">

        {performanceInsights &&
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 uppercase mb-1">Average Score</p>
                <p className="text-2xl font-bold text-blue-700">
                  {performanceInsights.avgScore}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 uppercase mb-1">Best Score</p>
                <p className="text-2xl font-bold text-green-700">
                  {performanceInsights.maxScore}
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <p className="text-xs text-amber-600 uppercase mb-1">Lowest Score</p>
                <p className="text-2xl font-bold text-amber-700">
                  {performanceInsights.minScore}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-xs text-purple-600 uppercase mb-1">Latest Trend</p>
                <div className="flex items-center justify-center gap-1">
                  {performanceInsights.trend > 0 ?
                <TrendingUp className="w-5 h-5 text-green-600" /> :
                performanceInsights.trend < 0 ?
                <TrendingDown className="w-5 h-5 text-red-600" /> :

                <Minus className="w-5 h-5 text-gray-500" />
                }
                  <span
                  className={`text-xl font-bold ${
                  performanceInsights.trend > 0 ?
                  'text-green-700' :
                  performanceInsights.trend < 0 ?
                  'text-red-700' :
                  'text-gray-600'}`
                  }>

                    {performanceInsights.trend > 0 ? '+' : ''}
                    {performanceInsights.trend}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Average Scores by Category
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Self Assessment</p>
                  <p className="text-lg font-bold">{performanceInsights.avgSelfScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Manager Rating</p>
                  <p className="text-lg font-bold">{performanceInsights.avgManagerScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Peer Review</p>
                  <p className="text-lg font-bold">{performanceInsights.avgPeerScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Student Feedback</p>
                  <p className="text-lg font-bold">{performanceInsights.avgStudentScore}</p>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Grade Distribution</h4>
              <div className="flex items-center gap-4">
                {Object.entries(performanceInsights.gradeDistribution).map(([grade, count]) =>
              <div key={grade} className="flex items-center gap-2">
                    {getGradeBadge(grade)}
                    <span className="text-sm text-gray-600">×{count}</span>
                  </div>
              )}
              </div>
            </div>

            {/* Career Progress */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  Promotion Recommendations
                </h4>
                <p className="text-2xl font-bold text-green-800">
                  {performanceInsights.promotionCount}
                </p>
                <p className="text-xs text-green-600">
                  out of {performanceInsights.yearsAnalyzed} appraisal cycles
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Total Increments
                </h4>
                <p className="text-2xl font-bold text-blue-800">
                  {performanceInsights.totalIncrement}%
                </p>
                <p className="text-xs text-blue-600">cumulative increment over tenure</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowInsightsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Appraisal Details - ${selectedYearDetail?.year}`}
        size="lg">

        {selectedYearDetail &&
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                {getGradeBadge(selectedYearDetail.grade)}
                <div>
                  <p className="text-xl font-bold">{selectedYearDetail.cycleName}</p>
                  <p className="text-sm text-gray-500">Year {selectedYearDetail.year}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {selectedYearDetail.finalScore}
                </p>
                <p className="text-sm text-gray-500">Final Score</p>
              </div>
            </div>

            {/* All details... */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 uppercase">Self</p>
                <p className="text-xl font-bold text-blue-700">
                  {selectedYearDetail.selfScore}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600 uppercase">Manager</p>
                <p className="text-xl font-bold text-green-700">
                  {selectedYearDetail.managerScore}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xs text-purple-600 uppercase">Peer</p>
                <p className="text-xl font-bold text-purple-700">
                  {selectedYearDetail.peerScore}
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-600 uppercase">Student</p>
                <p className="text-xl font-bold text-amber-700">
                  {selectedYearDetail.studentScore}
                </p>
              </div>
            </div>

            {/* Manager Comment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Manager's Comment</h4>
              <p className="text-gray-600">{selectedYearDetail.managerComment}</p>
            </div>

            {/* Goals */}
            {selectedYearDetail.goals && selectedYearDetail.goals.length > 0 &&
          <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Goals ({selectedYearDetail.goals.length})
                </h4>
                <div className="space-y-2">
                  {selectedYearDetail.goals.map((goal) =>
              <div
                key={goal.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">

                      <div className="flex items-center gap-3">
                        {goal.status === 'completed' ?
                  <CheckCircle className="w-5 h-5 text-green-500" /> :
                  goal.status === 'in-progress' ?
                  <Clock className="w-5 h-5 text-amber-500" /> :

                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  }
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-xs text-gray-500">Weight: {goal.weight}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{goal.achievement}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                      className={`h-full ${
                      goal.achievement >= 80 ?
                      'bg-green-500' :
                      goal.achievement >= 50 ?
                      'bg-amber-500' :
                      'bg-red-500'}`
                      }
                      style={{ width: `${goal.achievement}%` }} />

                        </div>
                      </div>
                    </div>
              )}
                </div>
              </div>
          }

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Goals Modal */}
      <Modal
        isOpen={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        title={`Goals - ${selectedYearDetail?.year}`}
        size="lg">

        {selectedYearDetail?.goals &&
        <div className="space-y-4">
            {selectedYearDetail.goals.map((goal) =>
          <div
            key={goal.id}
            className="bg-white border border-gray-200 rounded-lg p-4">

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {goal.status === 'completed' ?
                <CheckCircle className="w-6 h-6 text-green-500" /> :
                goal.status === 'in-progress' ?
                <Clock className="w-6 h-6 text-amber-500" /> :

                <AlertCircle className="w-6 h-6 text-gray-400" />
                }
                    <div>
                      <p className="font-semibold text-gray-900">{goal.title}</p>
                      <p className="text-sm text-gray-500">
                        Weight: {goal.weight}% | Status:{' '}
                        <span className="capitalize">{goal.status.replace('-', ' ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{goal.achievement}%</p>
                    <p className="text-xs text-gray-500">Achieved</p>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                className={`h-full transition-all ${
                goal.achievement >= 80 ?
                'bg-green-500' :
                goal.achievement >= 50 ?
                'bg-amber-500' :
                'bg-red-500'}`
                }
                style={{ width: `${goal.achievement}%` }} />

                </div>
              </div>
          )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowGoalsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Print styles */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>
    </div>);

}