import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Eye,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  Globe,
  Archive,
  RefreshCw,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Edit,
  Send,
  GraduationCap,
  Search,
  Copy,
  FileText,
  Target,
  Layers,
  Settings,
  MoreVertical } from
'lucide-react';

// ============================================
// Types
// ============================================

type TimetableStatus = 'Draft' | 'Published' | 'Locked' | 'Archived';

interface TimetableEntry {
  id: string;
  subjectName: string;
  examDate: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: string;
  maxMarks: number;
  instructions: string;
}

interface ReExamEntry {
  id: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  studentCount: number;
}

interface ClassTimetable {
  id: string;
  academicYear: string;
  board: string;
  classId: string;
  className: string;
  section: string;
  examName: string;
  examType: 'Regular' | 'Both';
  regularEntries: TimetableEntry[];
  reExamEntries: ReExamEntry[];
  status: TimetableStatus;
  totalSubjects: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  modifiedAt: string;
}

// ============================================
// Constants & Mock Data
// ============================================

const SUBJECTS = [
'Mathematics',
'Science',
'English',
'Hindi',
'Social Studies',
'Physics',
'Chemistry',
'Biology',
'Computer Science',
'Physical Education',
'Art',
'Music'];


const academicYears = ['2024-25', '2025-26'];
const boards = ['CBSE', 'ICSE', 'State Board'];
const allClasses = [
{ id: '1', name: 'Class I', level: 'Primary' },
{ id: '2', name: 'Class II', level: 'Primary' },
{ id: '3', name: 'Class III', level: 'Primary' },
{ id: '4', name: 'Class IV', level: 'Primary' },
{ id: '5', name: 'Class V', level: 'Primary' },
{ id: '6', name: 'Class VI', level: 'Middle' },
{ id: '7', name: 'Class VII', level: 'Middle' },
{ id: '8', name: 'Class VIII', level: 'Middle' },
{ id: '9', name: 'Class IX', level: 'Secondary' },
{ id: '10', name: 'Class X', level: 'Secondary' },
{ id: '11', name: 'Class XI', level: 'Senior Secondary' },
{ id: '12', name: 'Class XII', level: 'Senior Secondary' }];


const getDayFromDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr).getDay()];
};

const calcDuration = (start: string, end: string): string => {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
};

const generateId = () => Math.random().toString(36).substring(2, 11);

// Generate initial mock timetables
const generateMockTimetables = (): ClassTimetable[] => {
  return [
  {
    id: 'tt-10',
    academicYear: '2024-25',
    board: 'CBSE',
    classId: '10',
    className: 'Class X',
    section: 'All',
    examName: 'Annual Examination 2025',
    examType: 'Both',
    regularEntries: [
    { id: '1', subjectName: 'Mathematics', examDate: '2025-03-10', day: 'Monday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 100, instructions: 'Calculators not allowed' },
    { id: '2', subjectName: 'Science', examDate: '2025-03-12', day: 'Wednesday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 100, instructions: '' },
    { id: '3', subjectName: 'English', examDate: '2025-03-14', day: 'Friday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 100, instructions: '' },
    { id: '4', subjectName: 'Hindi', examDate: '2025-03-17', day: 'Monday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 100, instructions: '' },
    { id: '5', subjectName: 'Social Studies', examDate: '2025-03-19', day: 'Wednesday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 100, instructions: '' }],

    reExamEntries: [
    { id: '1', subjectName: 'Mathematics', examDate: '2025-04-05', startTime: '09:00', endTime: '12:00', duration: '3h', studentCount: 3 },
    { id: '2', subjectName: 'Science', examDate: '2025-04-07', startTime: '09:00', endTime: '12:00', duration: '3h', studentCount: 2 }],

    status: 'Published',
    totalSubjects: 5,
    startDate: '2025-03-10',
    endDate: '2025-03-19',
    createdAt: '2025-01-15',
    modifiedAt: '2025-02-01'
  },
  {
    id: 'tt-12',
    academicYear: '2024-25',
    board: 'CBSE',
    classId: '12',
    className: 'Class XII',
    section: 'All',
    examName: 'Board Examination 2025',
    examType: 'Regular',
    regularEntries: [
    { id: '1', subjectName: 'Physics', examDate: '2025-03-03', day: 'Monday', startTime: '10:00', endTime: '13:00', duration: '3h', maxMarks: 70, instructions: 'Scientific calculators allowed' },
    { id: '2', subjectName: 'Chemistry', examDate: '2025-03-06', day: 'Thursday', startTime: '10:00', endTime: '13:00', duration: '3h', maxMarks: 70, instructions: '' },
    { id: '3', subjectName: 'Mathematics', examDate: '2025-03-10', day: 'Monday', startTime: '10:00', endTime: '13:00', duration: '3h', maxMarks: 80, instructions: '' },
    { id: '4', subjectName: 'English', examDate: '2025-03-13', day: 'Thursday', startTime: '10:00', endTime: '13:00', duration: '3h', maxMarks: 80, instructions: '' },
    { id: '5', subjectName: 'Computer Science', examDate: '2025-03-17', day: 'Monday', startTime: '10:00', endTime: '13:00', duration: '3h', maxMarks: 70, instructions: '' }],

    reExamEntries: [],
    status: 'Locked',
    totalSubjects: 5,
    startDate: '2025-03-03',
    endDate: '2025-03-17',
    createdAt: '2025-01-10',
    modifiedAt: '2025-01-20'
  },
  {
    id: 'tt-9',
    academicYear: '2024-25',
    board: 'CBSE',
    classId: '9',
    className: 'Class IX',
    section: 'All',
    examName: 'Annual Examination 2025',
    examType: 'Regular',
    regularEntries: [
    { id: '1', subjectName: 'Mathematics', examDate: '2025-03-11', day: 'Tuesday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 80, instructions: '' },
    { id: '2', subjectName: 'Science', examDate: '2025-03-13', day: 'Thursday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 80, instructions: '' },
    { id: '3', subjectName: 'English', examDate: '2025-03-15', day: 'Saturday', startTime: '09:00', endTime: '12:00', duration: '3h', maxMarks: 80, instructions: '' }],

    reExamEntries: [],
    status: 'Draft',
    totalSubjects: 3,
    startDate: '2025-03-11',
    endDate: '2025-03-15',
    createdAt: '2025-02-01',
    modifiedAt: '2025-02-10'
  },
  {
    id: 'tt-8',
    academicYear: '2024-25',
    board: 'CBSE',
    classId: '8',
    className: 'Class VIII',
    section: 'All',
    examName: 'Annual Examination 2025',
    examType: 'Both',
    regularEntries: [
    { id: '1', subjectName: 'Mathematics', examDate: '2025-03-12', day: 'Wednesday', startTime: '09:00', endTime: '11:30', duration: '2h 30m', maxMarks: 80, instructions: '' },
    { id: '2', subjectName: 'Science', examDate: '2025-03-14', day: 'Friday', startTime: '09:00', endTime: '11:30', duration: '2h 30m', maxMarks: 80, instructions: '' }],

    reExamEntries: [
    { id: '1', subjectName: 'Mathematics', examDate: '2025-04-08', startTime: '09:00', endTime: '11:30', duration: '2h 30m', studentCount: 5 }],

    status: 'Published',
    totalSubjects: 2,
    startDate: '2025-03-12',
    endDate: '2025-03-14',
    createdAt: '2025-02-05',
    modifiedAt: '2025-02-15'
  },
  {
    id: 'tt-11',
    academicYear: '2024-25',
    board: 'CBSE',
    classId: '11',
    className: 'Class XI',
    section: 'All',
    examName: 'Annual Examination 2025',
    examType: 'Regular',
    regularEntries: [],
    reExamEntries: [],
    status: 'Draft',
    totalSubjects: 0,
    startDate: '',
    endDate: '',
    createdAt: '2025-02-20',
    modifiedAt: '2025-02-20'
  }];

};

// ============================================
// Utility Functions
// ============================================

const getStatusColor = (status: TimetableStatus) => {
  switch (status) {
    case 'Draft':return 'bg-gray-100 text-gray-700';
    case 'Published':return 'bg-green-100 text-green-700';
    case 'Locked':return 'bg-blue-100 text-blue-700';
    case 'Archived':return 'bg-purple-100 text-purple-700';
    default:return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: TimetableStatus) => {
  switch (status) {
    case 'Draft':return <Edit className="w-4 h-4" />;
    case 'Published':return <Globe className="w-4 h-4" />;
    case 'Locked':return <Lock className="w-4 h-4" />;
    case 'Archived':return <Archive className="w-4 h-4" />;
    default:return <Edit className="w-4 h-4" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Primary':return 'bg-pink-100 text-pink-700';
    case 'Middle':return 'bg-green-100 text-green-700';
    case 'Secondary':return 'bg-blue-100 text-blue-700';
    case 'Senior Secondary':return 'bg-purple-100 text-purple-700';
    default:return 'bg-gray-100 text-gray-700';
  }
};

// ============================================
// Sub Components
// ============================================

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
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
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>);

};

// ============================================
// Main Component
// ============================================

export function ExamTimetableGeneration() {
  // View state
  const [activeView, setActiveView] = useState<'dashboard' | 'edit' | 'create'>('dashboard');
  const [currentTimetableId, setCurrentTimetableId] = useState<string | null>(null);

  // Data state
  const [allTimetables, setAllTimetables] = useState<ClassTimetable[]>(generateMockTimetables());

  // Filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<TimetableStatus | 'All'>('All');
  const [academicYearFilter, setAcademicYearFilter] = useState('2024-25');

  // Edit state
  const [activeTab, setActiveTab] = useState<'regular' | 'reexam'>('regular');
  const [editingTimetable, setEditingTimetable] = useState<ClassTimetable | null>(null);

  // Create new state
  const [newAcademicYear, setNewAcademicYear] = useState('2024-25');
  const [newBoard, setNewBoard] = useState('CBSE');
  const [newClassId, setNewClassId] = useState('');
  const [newExamName, setNewExamName] = useState('');

  // UI state
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showStudentList, setShowStudentList] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ============================================
  // Computed Values
  // ============================================

  const currentTimetable = useMemo(() => {
    if (!currentTimetableId) return null;
    return allTimetables.find((t) => t.id === currentTimetableId) || null;
  }, [currentTimetableId, allTimetables]);

  const filteredTimetables = useMemo(() => {
    return allTimetables.filter((tt) => {
      const matchesSearch = tt.className.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tt.examName.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tt.status === statusFilter;
      const matchesYear = tt.academicYear === academicYearFilter;
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [allTimetables, searchFilter, statusFilter, academicYearFilter]);

  const dashboardStats = useMemo(() => {
    const total = allTimetables.filter((t) => t.academicYear === academicYearFilter).length;
    const published = allTimetables.filter((t) => t.academicYear === academicYearFilter && t.status === 'Published').length;
    const draft = allTimetables.filter((t) => t.academicYear === academicYearFilter && t.status === 'Draft').length;
    const locked = allTimetables.filter((t) => t.academicYear === academicYearFilter && t.status === 'Locked').length;

    return { total, published, draft, locked };
  }, [allTimetables, academicYearFilter]);

  const isLocked = editingTimetable?.status === 'Locked' || editingTimetable?.status === 'Archived';

  // Re-exam students mock
  const reExamStudents = [
  { name: 'Arjun Sharma', rollNo: '05', subjects: 'Mathematics', approval: 'Approved' },
  { name: 'Priya Patel', rollNo: '12', subjects: 'Mathematics', approval: 'Approved' },
  { name: 'Karan Mehta', rollNo: '07', subjects: 'Mathematics', approval: 'Approved' }];


  // ============================================
  // Handlers
  // ============================================

  const handleSelectTimetable = (timetableId: string) => {
    const timetable = allTimetables.find((t) => t.id === timetableId);
    if (timetable) {
      setCurrentTimetableId(timetableId);
      setEditingTimetable({ ...timetable });
      setActiveView('edit');
      setActiveTab('regular');
      setConflicts([]);
    }
  };

  const handleCreateNew = () => {
    setNewAcademicYear('2024-25');
    setNewBoard('CBSE');
    setNewClassId('');
    setNewExamName('');
    setActiveView('create');
  };

  const handleCreateTimetable = () => {
    if (!newClassId || !newExamName) {
      alert('Please fill in all required fields');
      return;
    }

    const classInfo = allClasses.find((c) => c.id === newClassId);
    const existingTimetable = allTimetables.find(
      (t) => t.classId === newClassId && t.academicYear === newAcademicYear && t.board === newBoard
    );

    if (existingTimetable) {
      alert('A timetable already exists for this class, year, and board combination');
      return;
    }

    const newTimetable: ClassTimetable = {
      id: generateId(),
      academicYear: newAcademicYear,
      board: newBoard,
      classId: newClassId,
      className: classInfo?.name || '',
      section: 'All',
      examName: newExamName,
      examType: 'Regular',
      regularEntries: [],
      reExamEntries: [],
      status: 'Draft',
      totalSubjects: 0,
      startDate: '',
      endDate: '',
      createdAt: new Date().toISOString().split('T')[0],
      modifiedAt: new Date().toISOString().split('T')[0]
    };

    setAllTimetables((prev) => [...prev, newTimetable]);
    setCurrentTimetableId(newTimetable.id);
    setEditingTimetable(newTimetable);
    setActiveView('edit');
    setActiveTab('regular');
  };

  const handleDeleteTimetable = (timetableId: string) => {
    const timetable = allTimetables.find((t) => t.id === timetableId);
    if (timetable?.status === 'Locked') {
      alert('Cannot delete a locked timetable');
      return;
    }

    if (!confirm('Are you sure you want to delete this timetable?')) return;

    setAllTimetables((prev) => prev.filter((t) => t.id !== timetableId));
  };

  const handleDuplicateTimetable = (timetableId: string) => {
    const original = allTimetables.find((t) => t.id === timetableId);
    if (!original) return;

    const duplicate: ClassTimetable = {
      ...original,
      id: generateId(),
      status: 'Draft',
      examName: `${original.examName} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      modifiedAt: new Date().toISOString().split('T')[0]
    };

    setAllTimetables((prev) => [...prev, duplicate]);
  };

  const goBackToDashboard = () => {
    setActiveView('dashboard');
    setCurrentTimetableId(null);
    setEditingTimetable(null);
    setConflicts([]);
  };

  // Entry management
  const addRegularEntry = () => {
    if (!editingTimetable) return;

    const newEntry: TimetableEntry = {
      id: generateId(),
      subjectName: '',
      examDate: '',
      day: '',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3h',
      maxMarks: 100,
      instructions: ''
    };

    setEditingTimetable((prev) => ({
      ...prev!,
      regularEntries: [...prev!.regularEntries, newEntry]
    }));
  };

  const updateRegularEntry = (id: string, field: keyof TimetableEntry, value: string | number) => {
    if (!editingTimetable) return;

    setEditingTimetable((prev) => ({
      ...prev!,
      regularEntries: prev!.regularEntries.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: value };
        if (field === 'examDate') updated.day = getDayFromDate(value as string);
        if (field === 'startTime' || field === 'endTime') {
          updated.duration = calcDuration(
            field === 'startTime' ? value as string : e.startTime,
            field === 'endTime' ? value as string : e.endTime
          );
        }
        return updated;
      })
    }));
  };

  const removeRegularEntry = (id: string) => {
    if (!editingTimetable) return;

    setEditingTimetable((prev) => ({
      ...prev!,
      regularEntries: prev!.regularEntries.filter((e) => e.id !== id)
    }));
  };

  const addReExamEntry = () => {
    if (!editingTimetable) return;

    const newEntry: ReExamEntry = {
      id: generateId(),
      subjectName: '',
      examDate: '',
      startTime: '09:00',
      endTime: '12:00',
      duration: '3h',
      studentCount: 0
    };

    setEditingTimetable((prev) => ({
      ...prev!,
      reExamEntries: [...prev!.reExamEntries, newEntry],
      examType: 'Both'
    }));
  };

  const updateReExamEntry = (id: string, field: keyof ReExamEntry, value: string | number) => {
    if (!editingTimetable) return;

    setEditingTimetable((prev) => ({
      ...prev!,
      reExamEntries: prev!.reExamEntries.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: value };
        if (field === 'startTime' || field === 'endTime') {
          updated.duration = calcDuration(
            field === 'startTime' ? value as string : e.startTime,
            field === 'endTime' ? value as string : e.endTime
          );
        }
        return updated;
      })
    }));
  };

  const removeReExamEntry = (id: string) => {
    if (!editingTimetable) return;

    setEditingTimetable((prev) => {
      const updated = {
        ...prev!,
        reExamEntries: prev!.reExamEntries.filter((e) => e.id !== id)
      };
      if (updated.reExamEntries.length === 0) {
        updated.examType = 'Regular';
      }
      return updated;
    });
  };

  const checkConflicts = () => {
    if (!editingTimetable) return;

    const found: string[] = [];
    const dateTimeMap: Record<string, string[]> = {};

    editingTimetable.regularEntries.forEach((e) => {
      if (!e.examDate || !e.startTime) return;
      const key = `${e.examDate}-${e.startTime}`;
      if (!dateTimeMap[key]) dateTimeMap[key] = [];
      dateTimeMap[key].push(e.subjectName || 'Unknown');
    });

    Object.entries(dateTimeMap).forEach(([key, subjects]) => {
      if (subjects.length > 1) {
        found.push(`Time conflict on ${key.split('-').slice(0, 3).join('-')} at ${key.split('-')[3]}: ${subjects.join(', ')}`);
      }
    });

    // Check for same date multiple exams
    const dateMap: Record<string, string[]> = {};
    editingTimetable.regularEntries.forEach((e) => {
      if (!e.examDate) return;
      if (!dateMap[e.examDate]) dateMap[e.examDate] = [];
      dateMap[e.examDate].push(e.subjectName || 'Unknown');
    });

    Object.entries(dateMap).forEach(([date, subjects]) => {
      if (subjects.length > 1) {
        found.push(`Multiple exams on ${date}: ${subjects.join(', ')}`);
      }
    });

    setConflicts(found);
  };

  const handleUpdateStatus = (status: TimetableStatus) => {
    if (!editingTimetable) return;

    setEditingTimetable((prev) => ({
      ...prev!,
      status
    }));
  };

  const handleSave = async () => {
    if (!editingTimetable) return;

    setIsSaving(true);

    // Calculate dates
    const dates = editingTimetable.regularEntries.
    map((e) => e.examDate).
    filter((d) => d).
    sort();

    const updatedTimetable: ClassTimetable = {
      ...editingTimetable,
      totalSubjects: editingTimetable.regularEntries.length,
      startDate: dates[0] || '',
      endDate: dates[dates.length - 1] || '',
      modifiedAt: new Date().toISOString().split('T')[0]
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAllTimetables((prev) => prev.map((t) =>
    t.id === updatedTimetable.id ? updatedTimetable : t
    ));

    setEditingTimetable(updatedTimetable);
    setIsSaving(false);
    alert('Timetable saved successfully!');
  };

  // ============================================
  // Render Dashboard
  // ============================================

  const renderDashboard = () =>
  <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{dashboardStats.total}</p>
              <p className="text-sm text-blue-600">Total Timetables</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{dashboardStats.published}</p>
              <p className="text-sm text-green-600">Published</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{dashboardStats.draft}</p>
              <p className="text-sm text-yellow-600">Draft</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{dashboardStats.locked}</p>
              <p className="text-sm text-purple-600">Locked</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by class or exam name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            </div>
          </div>

          <select
          value={academicYearFilter}
          onChange={(e) => setAcademicYearFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

            {academicYears.map((y) =>
          <option key={y} value={y}>{y}</option>
          )}
          </select>

          <div className="flex items-center gap-2">
            {(['All', 'Draft', 'Published', 'Locked', 'Archived'] as const).map((status) =>
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            statusFilter === status ?
            'bg-blue-600 text-white' :
            'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
            }>

                {status}
              </button>
          )}
          </div>

          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Timetable
          </Button>
        </div>
      </Card>

      {/* Timetables Grid */}
      {filteredTimetables.length === 0 ?
    <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Timetables Found</h3>
          <p className="text-gray-500 mt-2">
            {allTimetables.length === 0 ?
        'Start by creating a new exam timetable.' :
        'No timetables match your filters.'
        }
          </p>
          <Button variant="primary" className="mt-4" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Timetable
          </Button>
        </Card> :

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTimetables.map((timetable) => {
        const classInfo = allClasses.find((c) => c.id === timetable.classId);

        return (
          <Card
            key={timetable.id}
            className="overflow-hidden hover:shadow-lg transition-shadow">

                <div
              className={`p-4 cursor-pointer ${
              timetable.status === 'Published' ? 'bg-green-50' :
              timetable.status === 'Locked' ? 'bg-blue-50' :
              timetable.status === 'Archived' ? 'bg-purple-50' : 'bg-gray-50'}`
              }
              onClick={() => handleSelectTimetable(timetable.id)}>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  timetable.status === 'Published' ? 'bg-green-100' :
                  timetable.status === 'Locked' ? 'bg-blue-100' :
                  timetable.status === 'Archived' ? 'bg-purple-100' : 'bg-gray-100'}`
                  }>
                        <GraduationCap className={`w-6 h-6 ${
                    timetable.status === 'Published' ? 'text-green-600' :
                    timetable.status === 'Locked' ? 'text-blue-600' :
                    timetable.status === 'Archived' ? 'text-purple-600' : 'text-gray-500'}`
                    } />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{timetable.className}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(classInfo?.level || '')}`}>
                          {classInfo?.level}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(timetable.status)}`}>
                      {getStatusIcon(timetable.status)}
                      {timetable.status}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{timetable.examName}</h4>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-700">{timetable.totalSubjects}</p>
                      <p className="text-xs text-blue-600">Subjects</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-700">{timetable.reExamEntries.length}</p>
                      <p className="text-xs text-orange-600">Re-Exams</p>
                    </div>
                  </div>

                  {timetable.startDate && timetable.endDate &&
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{timetable.startDate} to {timetable.endDate}</span>
                    </div>
              }

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t">
                    <span>Modified: {timetable.modifiedAt}</span>
                    <div className="flex items-center gap-1">
                      <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTimetable(timetable.id);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600"
                    title="Edit">

                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateTimetable(timetable.id);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-600"
                    title="Duplicate">

                        <Copy className="w-4 h-4" />
                      </button>
                      {timetable.status !== 'Locked' &&
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTimetable(timetable.id);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
                    title="Delete">

                          <Trash2 className="w-4 h-4" />
                        </button>
                  }
                    </div>
                  </div>
                </div>
              </Card>);

      })}

          {/* Add New Card */}
          <Card
        className="overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
        onClick={handleCreateNew}>

            <div className="p-8 flex flex-col items-center justify-center h-full min-h-[250px]">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Create New Timetable</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Add exam schedule for a new class
              </p>
            </div>
          </Card>
        </div>
    }
    </div>;


  // ============================================
  // Render Create View
  // ============================================

  const renderCreateView = () =>
  <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Create New Exam Timetable
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
              value={newAcademicYear}
              onChange={(e) => setNewAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

                {academicYears.map((y) =>
              <option key={y} value={y}>{y}</option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board <span className="text-red-500">*</span>
              </label>
              <select
              value={newBoard}
              onChange={(e) => setNewBoard(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

                {boards.map((b) =>
              <option key={b} value={b}>{b}</option>
              )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <select
            value={newClassId}
            onChange={(e) => setNewClassId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

              <option value="">Select Class</option>
              {allClasses.map((c) =>
            <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
            )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
            type="text"
            value={newExamName}
            onChange={(e) => setNewExamName(e.target.value)}
            placeholder="e.g., Annual Examination 2025"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={goBackToDashboard}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateTimetable}>
            <Plus className="w-4 h-4 mr-2" />
            Create Timetable
          </Button>
        </div>
      </Card>
    </div>;


  // ============================================
  // Render Edit View
  // ============================================

  const renderEditView = () => {
    if (!editingTimetable) return null;

    return (
      <div className="space-y-6">
        {/* Conflicts Alert */}
        {conflicts.length > 0 &&
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertTriangle className="w-5 h-5" />
              {conflicts.length} Conflict(s) Detected
            </div>
            {conflicts.map((c, i) =>
          <p key={i} className="text-sm text-red-700 ml-7">• {c}</p>
          )}
          </div>
        }

        {/* Info Panel */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{editingTimetable.examName}</h3>
              <p className="text-sm text-gray-500">
                {editingTimetable.className} • {editingTimetable.board} • {editingTimetable.academicYear}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingTimetable.examName}
                onChange={(e) => setEditingTimetable((prev) => ({ ...prev!, examName: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={isLocked} />

            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('regular')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'regular' ?
            'bg-white text-blue-700 shadow-sm' :
            'text-gray-600 hover:text-gray-800'}`
            }>

            Regular Exam ({editingTimetable.regularEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('reexam')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'reexam' ?
            'bg-white text-orange-700 shadow-sm' :
            'text-gray-600 hover:text-gray-800'}`
            }>

            Re-Exam ({editingTimetable.reExamEntries.length})
          </button>
        </div>

        {/* Regular Exam Tab */}
        {activeTab === 'regular' &&
        <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Subject-wise Schedule</h3>
                {!isLocked &&
              <Button variant="primary" size="sm" onClick={addRegularEntry}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
              }
              </div>

              {editingTimetable.regularEntries.length === 0 ?
            <div className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subjects added yet</p>
                  {!isLocked &&
              <Button variant="primary" size="sm" className="mt-3" onClick={addRegularEntry}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Subject
                    </Button>
              }
                </div> :

            <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Exam Date</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Time</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">End Time</th>
                        <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Duration</th>
                        <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Max Marks</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Instructions</th>
                        {!isLocked &&
                    <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    }
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {editingTimetable.regularEntries.map((entry) =>
                  <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm font-medium text-gray-900">{entry.subjectName}</span> :

                      <select
                        value={entry.subjectName}
                        onChange={(e) => updateRegularEntry(entry.id, 'subjectName', e.target.value)}
                        className="w-36 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">

                                <option value="">Select</option>
                                {SUBJECTS.map((s) =>
                        <option key={s}>{s}</option>
                        )}
                              </select>
                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.examDate}</span> :

                      <input
                        type="date"
                        value={entry.examDate}
                        onChange={(e) => updateRegularEntry(entry.id, 'examDate', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-sm text-gray-600">{entry.day || '—'}</span>
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.startTime}</span> :

                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => updateRegularEntry(entry.id, 'startTime', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.endTime}</span> :

                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) => updateRegularEntry(entry.id, 'endTime', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {entry.duration || '—'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.maxMarks}</span> :

                      <input
                        type="number"
                        value={entry.maxMarks}
                        onChange={(e) => updateRegularEntry(entry.id, 'maxMarks', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-500">{entry.instructions || '—'}</span> :

                      <input
                        value={entry.instructions}
                        onChange={(e) => updateRegularEntry(entry.id, 'instructions', e.target.value)}
                        placeholder="Optional..."
                        className="w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />

                      }
                          </td>
                          {!isLocked &&
                    <td className="py-2 px-3 text-center">
                              <button
                        onClick={() => removeRegularEntry(entry.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">

                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                    }
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }
            </Card>
          </div>
        }

        {/* Re-Exam Tab */}
        {activeTab === 'reexam' &&
        <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-orange-50 flex items-center justify-between">
                <h3 className="font-semibold text-orange-800">Re-Exam Schedule</h3>
                {!isLocked &&
              <Button variant="primary" size="sm" onClick={addReExamEntry}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Re-Exam
                  </Button>
              }
              </div>

              {editingTimetable.reExamEntries.length === 0 ?
            <div className="p-12 text-center">
                  <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No re-exams scheduled</p>
                  {!isLocked &&
              <Button variant="primary" size="sm" className="mt-3" onClick={addReExamEntry}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Re-Exam
                    </Button>
              }
                </div> :

            <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Exam Date</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Time</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">End Time</th>
                        <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Duration</th>
                        <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Students</th>
                        {!isLocked &&
                    <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    }
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {editingTimetable.reExamEntries.map((entry) =>
                  <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm font-medium text-gray-900">{entry.subjectName}</span> :

                      <select
                        value={entry.subjectName}
                        onChange={(e) => updateReExamEntry(entry.id, 'subjectName', e.target.value)}
                        className="w-36 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">

                                <option value="">Select</option>
                                {SUBJECTS.map((s) =>
                        <option key={s}>{s}</option>
                        )}
                              </select>
                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.examDate}</span> :

                      <input
                        type="date"
                        value={entry.examDate}
                        onChange={(e) => updateReExamEntry(entry.id, 'examDate', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.startTime}</span> :

                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => updateReExamEntry(entry.id, 'startTime', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3">
                            {isLocked ?
                      <span className="text-sm text-gray-700">{entry.endTime}</span> :

                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) => updateReExamEntry(entry.id, 'endTime', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />

                      }
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-sm font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                              {entry.duration || '—'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                        onClick={() => setShowStudentList(showStudentList === entry.id ? null : entry.id)}
                        className="flex items-center gap-1 mx-auto px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">

                              <Users className="w-3 h-3" />
                              {entry.studentCount} students
                            </button>
                          </td>
                          {!isLocked &&
                    <td className="py-2 px-3 text-center">
                              <button
                        onClick={() => removeReExamEntry(entry.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">

                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                    }
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }

              {/* Student List */}
              {showStudentList &&
            <div className="border-t border-gray-200 p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Students Appearing
                  </h4>
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Student Name</th>
                        <th className="py-2 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Roll No</th>
                        <th className="py-2 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Approval</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reExamStudents.map((s, i) =>
                  <tr key={i}>
                          <td className="py-2 px-4 text-sm font-medium text-gray-900">{s.name}</td>
                          <td className="py-2 px-4 text-center text-sm text-gray-600">{s.rollNo}</td>
                          <td className="py-2 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              {s.approval}
                            </span>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }
            </Card>
          </div>
        }

        {/* Status Control & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status Control */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Status Control</h3>
            <div className="flex flex-wrap gap-2">
              {(['Draft', 'Published', 'Locked', 'Archived'] as TimetableStatus[]).map((status) =>
              <button
                key={status}
                onClick={() => handleUpdateStatus(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                editingTimetable.status === status ?
                'border-blue-500 bg-blue-50 text-blue-700' :
                'border-gray-200 text-gray-600 hover:border-gray-300'}`
                }>

                  {getStatusIcon(status)}
                  {status}
                </button>
              )}
            </div>
            {isLocked &&
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Timetable is locked. No further editing is allowed.
              </p>
            }
          </Card>

          {/* Output Options */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Output Options</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="primary" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </Card>
        </div>
      </div>);

  };

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {activeView !== 'dashboard' &&
              <Button variant="ghost" onClick={goBackToDashboard}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              }
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Exam Timetable Generation</h1>
                  {activeView === 'edit' && editingTimetable &&
                  <>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-semibold text-blue-600">{editingTimetable.className}</span>
                    </>
                  }
                </div>
                <p className="text-sm text-gray-500">
                  {activeView === 'dashboard' && 'Manage exam schedules for all classes'}
                  {activeView === 'create' && 'Create a new exam timetable'}
                  {activeView === 'edit' && `Editing ${editingTimetable?.examName || ''}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeView === 'edit' && editingTimetable &&
              <>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(editingTimetable.status)}`}>
                    {getStatusIcon(editingTimetable.status)}
                    {editingTimetable.status}
                  </div>
                  {!isLocked &&
                <Button variant="outline" size="sm" onClick={checkConflicts}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Check Conflicts
                    </Button>
                }
                  {!isLocked &&
                <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ?
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                  <Save className="w-4 h-4 mr-2" />
                  }
                      Save
                    </Button>
                }
                </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'create' && renderCreateView()}
        {activeView === 'edit' && renderEditView()}
      </div>
    </div>);

}

export default ExamTimetableGeneration;