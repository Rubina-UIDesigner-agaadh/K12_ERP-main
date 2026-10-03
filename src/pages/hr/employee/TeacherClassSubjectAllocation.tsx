import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  Save,
  Copy,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Home,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  User,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  FlaskConical,
  BookText,
  Info,
  RefreshCw,
  CheckCircle,
  Loader2,
  Settings,
  UserCheck,
  UserX,
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Star,
  Award,
  Briefcase,
  School,
  Building,
  ClipboardList,
  UserPlus,
  XCircle,
  MoreHorizontal } from
'lucide-react';

// ==================== TYPES ====================
interface Teacher {
  id: string;
  name: string;
  code: string;
  avatar: string;
  department: string;
  qualification: string;
  experience: number;
  subjects: string[];
  currentLoad: number;
  maxLoad: number;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  isClassTeacher: boolean;
  classTeacherOf: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'Theory' | 'Lab' | 'Practical' | 'Language' | 'Co-curricular';
  weeklySessions: number;
  assignedTeacher: string | null;
  alternateTeacher: string | null;
  isElective: boolean;
  maxStudents?: number;
}

interface ClassSection {
  id: string;
  value: string;
  label: string;
  grade: number;
  section: string;
  stream?: string;
  classTeacher: string | null;
  totalStudents: number;
  subjects: Subject[];
  roomNumber: string;
}

interface Allocation {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  role: 'Primary' | 'Alternate';
  sessions: number;
  createdAt: string;
  updatedAt: string;
}

interface ConflictInfo {
  type: 'overload' | 'time_conflict' | 'duplicate' | 'qualification' | 'class_teacher';
  message: string;
  severity: 'warning' | 'error' | 'info';
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

type ViewMode = 'table' | 'grid';
type TabType = 'allocation' | 'class-teachers' | 'workload' | 'history';

// ==================== MOCK DATA ====================
const academicYears = [
{ value: '2024-25', label: '2024-25 (Current)' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


const mockTeachers: Teacher[] = [
{
  id: 'TCH001',
  name: 'Dr. Robert Smith',
  code: 'TCH001',
  avatar: 'RS',
  department: 'Mathematics',
  qualification: 'Ph.D. Mathematics',
  experience: 15,
  subjects: ['Mathematics', 'Statistics', 'Applied Mathematics'],
  currentLoad: 22,
  maxLoad: 24,
  email: 'robert.smith@school.edu',
  phone: '+91 98765 43210',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 10 - Section A'
},
{
  id: 'TCH002',
  name: 'Mrs. Sarah Johnson',
  code: 'TCH002',
  avatar: 'SJ',
  department: 'Physics',
  qualification: 'M.Sc. Physics, B.Ed',
  experience: 12,
  subjects: ['Physics', 'General Science'],
  currentLoad: 18,
  maxLoad: 24,
  email: 'sarah.johnson@school.edu',
  phone: '+91 98765 43211',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH003',
  name: 'Mr. Michael Chen',
  code: 'TCH003',
  avatar: 'MC',
  department: 'Chemistry',
  qualification: 'M.Sc. Chemistry',
  experience: 8,
  subjects: ['Chemistry', 'General Science', 'Environmental Science'],
  currentLoad: 20,
  maxLoad: 24,
  email: 'michael.chen@school.edu',
  phone: '+91 98765 43212',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 9 - Section B'
},
{
  id: 'TCH004',
  name: 'Ms. Emily Davis',
  code: 'TCH004',
  avatar: 'ED',
  department: 'English',
  qualification: 'M.A. English Literature',
  experience: 10,
  subjects: ['English', 'Literature', 'Creative Writing'],
  currentLoad: 16,
  maxLoad: 24,
  email: 'emily.davis@school.edu',
  phone: '+91 98765 43213',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 9 - Section A'
},
{
  id: 'TCH005',
  name: 'Mr. David Wilson',
  code: 'TCH005',
  avatar: 'DW',
  department: 'Social Science',
  qualification: 'M.A. History, B.Ed',
  experience: 14,
  subjects: ['History', 'Civics', 'Geography', 'Economics'],
  currentLoad: 14,
  maxLoad: 24,
  email: 'david.wilson@school.edu',
  phone: '+91 98765 43214',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH006',
  name: 'Mrs. Lisa Taylor',
  code: 'TCH006',
  avatar: 'LT',
  department: 'Biology',
  qualification: 'M.Sc. Zoology',
  experience: 9,
  subjects: ['Biology', 'Life Science', 'Botany', 'Zoology'],
  currentLoad: 19,
  maxLoad: 24,
  email: 'lisa.taylor@school.edu',
  phone: '+91 98765 43215',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH007',
  name: 'Mr. James Anderson',
  code: 'TCH007',
  avatar: 'JA',
  department: 'Computer Science',
  qualification: 'M.Tech. Computer Science',
  experience: 7,
  subjects: ['Computer Science', 'Programming', 'IT'],
  currentLoad: 24,
  maxLoad: 24,
  email: 'james.anderson@school.edu',
  phone: '+91 98765 43216',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 11 - Section A'
},
{
  id: 'TCH008',
  name: 'Ms. Jennifer Brown',
  code: 'TCH008',
  avatar: 'JB',
  department: 'Geography',
  qualification: 'M.A. Geography',
  experience: 6,
  subjects: ['Geography', 'Environmental Science', 'Map Reading'],
  currentLoad: 12,
  maxLoad: 24,
  email: 'jennifer.brown@school.edu',
  phone: '+91 98765 43217',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH009',
  name: 'Dr. Patricia Martinez',
  code: 'TCH009',
  avatar: 'PM',
  department: 'Mathematics',
  qualification: 'Ph.D. Applied Mathematics',
  experience: 18,
  subjects: ['Mathematics', 'Advanced Math', 'Calculus'],
  currentLoad: 15,
  maxLoad: 24,
  email: 'patricia.martinez@school.edu',
  phone: '+91 98765 43218',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH010',
  name: 'Mr. Richard Lee',
  code: 'TCH010',
  avatar: 'RL',
  department: 'Physical Education',
  qualification: 'M.P.Ed',
  experience: 11,
  subjects: ['Physical Education', 'Health', 'Sports'],
  currentLoad: 20,
  maxLoad: 24,
  email: 'richard.lee@school.edu',
  phone: '+91 98765 43219',
  status: 'Active',
  isClassTeacher: true,
  classTeacherOf: 'Grade 10 - Section B'
},
{
  id: 'TCH011',
  name: 'Mrs. Priya Sharma',
  code: 'TCH011',
  avatar: 'PS',
  department: 'Hindi',
  qualification: 'M.A. Hindi',
  experience: 13,
  subjects: ['Hindi', 'Sanskrit'],
  currentLoad: 18,
  maxLoad: 24,
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43220',
  status: 'Active',
  isClassTeacher: false,
  classTeacherOf: null
},
{
  id: 'TCH012',
  name: 'Mr. Amit Kumar',
  code: 'TCH012',
  avatar: 'AK',
  department: 'Arts',
  qualification: 'M.F.A',
  experience: 5,
  subjects: ['Art', 'Craft', 'Music'],
  currentLoad: 16,
  maxLoad: 24,
  email: 'amit.kumar@school.edu',
  phone: '+91 98765 43221',
  status: 'On Leave',
  isClassTeacher: false,
  classTeacherOf: null
}];


const getSubjectsForGrade = (grade: number): Subject[] => {
  const commonSubjects: Subject[] = [
  { id: 'SUB001', name: 'Mathematics', code: 'MATH', type: 'Theory', weeklySessions: 6, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB002', name: 'English', code: 'ENG', type: 'Language', weeklySessions: 5, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB003', name: 'Hindi', code: 'HIN', type: 'Language', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB004', name: 'Physics', code: 'PHY', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB005', name: 'Physics Lab', code: 'PHY-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB006', name: 'Chemistry', code: 'CHEM', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB007', name: 'Chemistry Lab', code: 'CHEM-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB008', name: 'Biology', code: 'BIO', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB009', name: 'History', code: 'HIST', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB010', name: 'Geography', code: 'GEO', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB011', name: 'Computer Science', code: 'CS', type: 'Theory', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB012', name: 'Computer Lab', code: 'CS-L', type: 'Lab', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB013', name: 'Physical Education', code: 'PE', type: 'Practical', weeklySessions: 3, assignedTeacher: null, alternateTeacher: null, isElective: false },
  { id: 'SUB014', name: 'Art & Craft', code: 'ART', type: 'Co-curricular', weeklySessions: 2, assignedTeacher: null, alternateTeacher: null, isElective: true }];


  if (grade >= 11) {
    return [
    ...commonSubjects.slice(0, 8),
    { id: 'SUB015', name: 'Advanced Mathematics', code: 'ADV-MATH', type: 'Theory', weeklySessions: 5, assignedTeacher: null, alternateTeacher: null, isElective: false },
    { id: 'SUB016', name: 'Economics', code: 'ECO', type: 'Theory', weeklySessions: 4, assignedTeacher: null, alternateTeacher: null, isElective: true },
    ...commonSubjects.slice(10)];

  }
  return commonSubjects;
};

const initialClassSections: ClassSection[] = [
{ id: 'CS001', value: 'grade-9-a', label: 'Grade 9 - Section A', grade: 9, section: 'A', classTeacher: 'TCH004', totalStudents: 35, subjects: getSubjectsForGrade(9), roomNumber: '101' },
{ id: 'CS002', value: 'grade-9-b', label: 'Grade 9 - Section B', grade: 9, section: 'B', classTeacher: 'TCH003', totalStudents: 32, subjects: getSubjectsForGrade(9), roomNumber: '102' },
{ id: 'CS003', value: 'grade-10-a', label: 'Grade 10 - Section A', grade: 10, section: 'A', classTeacher: 'TCH001', totalStudents: 38, subjects: getSubjectsForGrade(10), roomNumber: '201' },
{ id: 'CS004', value: 'grade-10-b', label: 'Grade 10 - Section B', grade: 10, section: 'B', classTeacher: 'TCH010', totalStudents: 36, subjects: getSubjectsForGrade(10), roomNumber: '202' },
{ id: 'CS005', value: 'grade-11-a', label: 'Grade 11 - Section A (Science)', grade: 11, section: 'A', stream: 'Science', classTeacher: 'TCH007', totalStudents: 30, subjects: getSubjectsForGrade(11), roomNumber: '301' },
{ id: 'CS006', value: 'grade-11-b', label: 'Grade 11 - Section B (Commerce)', grade: 11, section: 'B', stream: 'Commerce', classTeacher: null, totalStudents: 28, subjects: getSubjectsForGrade(11), roomNumber: '302' }];


// ==================== TOAST COMPONENT ====================
const ToastContainer: React.FC<{toasts: Toast[];onDismiss: (id: string) => void;}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getStyle = (type: Toast['type']) => {
    switch (type) {
      case 'success':return 'bg-green-50 border-green-200 text-green-800';
      case 'error':return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[320px] ${getStyle(toast.type)}`}>
          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

// ==================== TEACHER DROPDOWN COMPONENT ====================
interface TeacherDropdownProps {
  subject: Subject;
  selectedTeacher: Teacher | undefined;
  conflicts: ConflictInfo[];
  teachers: Teacher[];
  isActive: boolean;
  onToggle: () => void;
  onSelect: (teacherId: string | null) => void;
  isAlternate?: boolean;
  excludeTeacherId?: string | null;
  onViewTeacher?: (teacher: Teacher) => void;
}

const TeacherDropdown: React.FC<TeacherDropdownProps> = ({
  subject,
  selectedTeacher,
  conflicts,
  teachers,
  isActive,
  onToggle,
  onSelect,
  isAlternate = false,
  excludeTeacherId,
  onViewTeacher
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState('');

  const hasError = conflicts.some((c) => c.severity === 'error');
  const hasWarning = conflicts.some((c) => c.severity === 'warning');

  const filteredTeachers = teachers.filter(
    (teacher) =>
    teacher.id !== excludeTeacherId &&
    teacher.status === 'Active' && (
    teacher.name.toLowerCase().includes(localSearch.toLowerCase()) ||
    teacher.department.toLowerCase().includes(localSearch.toLowerCase()) ||
    teacher.subjects.some((s) => s.toLowerCase().includes(localSearch.toLowerCase())))
  );

  const getLoadPercentage = (teacher: Teacher): number => {
    return Math.round(teacher.currentLoad / teacher.maxLoad * 100);
  };

  const getLoadColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getLoadTextColor = (percentage: number): string => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-amber-600';
    return 'text-green-600';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isActive) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActive, onToggle]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-lg transition-colors ${
        hasError ? 'border-red-300 bg-red-50' :
        hasWarning ? 'border-amber-300 bg-amber-50' :
        selectedTeacher ? 'border-gray-300 bg-white hover:border-blue-400' :
        'border-gray-300 bg-gray-50 hover:border-gray-400'}`
        }>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedTeacher ?
          <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {selectedTeacher.avatar}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedTeacher.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {selectedTeacher.department} • {selectedTeacher.currentLoad}/{selectedTeacher.maxLoad}
                </p>
              </div>
            </> :

          <span className="text-sm text-gray-500">
              {isAlternate ? 'Select alternate teacher...' : 'Select teacher...'}
            </span>
          }
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {hasError &&
          <div className="relative group">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                {conflicts.filter((c) => c.severity === 'error').map((c, i) => <p key={i}>{c.message}</p>)}
              </div>
            </div>
          }
          {hasWarning && !hasError &&
          <div className="relative group">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                {conflicts.filter((c) => c.severity === 'warning').map((c, i) => <p key={i}>{c.message}</p>)}
              </div>
            </div>
          }
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isActive &&
      <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              placeholder="Search teachers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus />

            </div>
          </div>

          {selectedTeacher &&
        <button
          onClick={() => {onSelect(null);setLocalSearch('');}}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-b border-gray-200">

              <X className="w-4 h-4" />
              Clear Selection
            </button>
        }

          <div className="max-h-64 overflow-y-auto">
            {filteredTeachers.length > 0 ?
          filteredTeachers.map((teacher) => {
            const loadPercentage = getLoadPercentage(teacher);
            const isSelected = selectedTeacher?.id === teacher.id;
            const isOverloaded = loadPercentage >= 100;

            return (
              <div
                key={teacher.id}
                className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                isSelected ? 'bg-blue-50' :
                isOverloaded ? 'bg-gray-50 opacity-60' :
                'hover:bg-gray-50'}`
                }>

                    <button
                  onClick={() => {if (!isOverloaded) {onSelect(teacher.id);setLocalSearch('');}}}
                  disabled={isOverloaded}
                  className="flex items-center gap-3 flex-1 text-left">

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {teacher.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{teacher.name}</p>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                          {teacher.isClassTeacher &&
                      <Star className="w-3 h-3 text-yellow-500" title="Class Teacher" />
                      }
                        </div>
                        <p className="text-xs text-gray-500">{teacher.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                          className={`h-full rounded-full ${getLoadColor(loadPercentage)}`}
                          style={{ width: `${Math.min(loadPercentage, 100)}%` }} />

                          </div>
                          <span className={`text-xs font-medium ${getLoadTextColor(loadPercentage)}`}>
                            {teacher.currentLoad}/{teacher.maxLoad}
                          </span>
                        </div>
                      </div>
                    </button>
                    {onViewTeacher &&
                <button
                  onClick={() => onViewTeacher(teacher)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="View Profile">

                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                }
                  </div>);

          }) :

          <div className="p-4 text-center text-gray-500">
                <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No teachers found</p>
              </div>
          }
          </div>
        </div>
      }
    </div>);

};

// ==================== MAIN COMPONENT ====================
export function TeacherClassSubjectAllocation() {
  // Core State
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [classSections, setClassSections] = useState<ClassSection[]>(initialClassSections);
  const [selectedClassSection, setSelectedClassSection] = useState('grade-10-a');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('allocation');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal State
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false);
  const [showAssignClassTeacherModal, setShowAssignClassTeacherModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Selected Items State
  const [selectedTeacherProfile, setSelectedTeacherProfile] = useState<Teacher | null>(null);
  const [selectedClassForTeacher, setSelectedClassForTeacher] = useState<ClassSection | null>(null);
  const [copyFromSection, setCopyFromSection] = useState('');

  // Form State
  const [newSubjectForm, setNewSubjectForm] = useState({
    name: '',
    code: '',
    type: 'Theory' as Subject['type'],
    weeklySessions: 4,
    isElective: false
  });

  // Loading State
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ==================== HELPERS ====================
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load subjects when class section changes
  useEffect(() => {
    const classData = classSections.find((c) => c.value === selectedClassSection);
    if (classData) {
      setSubjects(classData.subjects.map((s) => ({ ...s })));
    }
    setHasUnsavedChanges(false);
  }, [selectedClassSection, classSections]);

  const currentClass = useMemo(() => {
    return classSections.find((c) => c.value === selectedClassSection);
  }, [classSections, selectedClassSection]);

  const getTeacherById = (id: string | null): Teacher | undefined => {
    return teachers.find((t) => t.id === id);
  };

  const departments = useMemo(() => {
    const depts = [...new Set(teachers.map((t) => t.department))];
    return depts.map((d) => ({ value: d, label: d }));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = !departmentFilter || t.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [teachers, searchQuery, departmentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalSubjects = subjects.length;
    const assignedSubjects = subjects.filter((s) => s.assignedTeacher).length;
    const unassignedSubjects = subjects.filter((s) => !s.assignedTeacher).length;
    const totalSessions = subjects.reduce((sum, s) => sum + s.weeklySessions, 0);
    const classesWithoutClassTeacher = classSections.filter((c) => !c.classTeacher).length;
    const totalClasses = classSections.length;

    return { totalSubjects, assignedSubjects, unassignedSubjects, totalSessions, classesWithoutClassTeacher, totalClasses };
  }, [subjects, classSections]);

  // Conflict checking
  const checkConflicts = (teacherId: string, subjectId: string, isAlternate: boolean = false): ConflictInfo[] => {
    const conflicts: ConflictInfo[] = [];
    const teacher = getTeacherById(teacherId);
    if (!teacher) return conflicts;

    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return conflicts;

    // Check workload
    const additionalLoad = subject.weeklySessions;
    if (teacher.currentLoad + additionalLoad > teacher.maxLoad) {
      conflicts.push({
        type: 'overload',
        message: `${teacher.name} will exceed max load (${teacher.currentLoad + additionalLoad}/${teacher.maxLoad})`,
        severity: 'warning'
      });
    }

    if (teacher.currentLoad >= teacher.maxLoad) {
      conflicts.push({
        type: 'overload',
        message: `${teacher.name} is at maximum capacity`,
        severity: 'error'
      });
    }

    // Check duplicate in same class
    if (!isAlternate) {
      const duplicate = subjects.find((s) => s.id !== subjectId && s.assignedTeacher === teacherId);
      if (duplicate) {
        conflicts.push({
          type: 'duplicate',
          message: `${teacher.name} is also assigned to ${duplicate.name}`,
          severity: 'info'
        });
      }
    }

    // Check alternate same as primary
    if (isAlternate) {
      const subjectData = subjects.find((s) => s.id === subjectId);
      if (subjectData?.assignedTeacher === teacherId) {
        conflicts.push({
          type: 'duplicate',
          message: 'Alternate cannot be same as primary teacher',
          severity: 'error'
        });
      }
    }

    // Check qualification
    const subjectName = subject.name.replace(' Lab', '').split(' ')[0];
    if (!teacher.subjects.some((s) => s.toLowerCase().includes(subjectName.toLowerCase()) || subjectName.toLowerCase().includes(s.toLowerCase().split(' ')[0]))) {
      conflicts.push({
        type: 'qualification',
        message: `${teacher.name} may not be qualified for ${subject.name}`,
        severity: 'warning'
      });
    }

    return conflicts;
  };

  // ==================== HANDLERS ====================
  const handleTeacherAssign = (subjectId: string, teacherId: string | null, isAlternate: boolean = false) => {
    setSubjects((prev) =>
    prev.map((subject) =>
    subject.id === subjectId ?
    isAlternate ?
    { ...subject, alternateTeacher: teacherId } :
    { ...subject, assignedTeacher: teacherId } :
    subject
    )
    );
    setHasUnsavedChanges(true);
    setActiveDropdown(null);

    if (teacherId) {
      const teacher = getTeacherById(teacherId);
      const subject = subjects.find((s) => s.id === subjectId);
      if (teacher && subject) {
        addToast('success', `${teacher.name} assigned to ${subject.name}`);
      }
    }
  };

  const handleAssignClassTeacher = (classId: string, teacherId: string | null) => {
    // Remove previous class teacher assignment
    if (teacherId) {
      setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return { ...t, isClassTeacher: true, classTeacherOf: classSections.find((c) => c.id === classId)?.label || null };
        }
        if (t.classTeacherOf === classSections.find((c) => c.id === classId)?.label) {
          return { ...t, isClassTeacher: false, classTeacherOf: null };
        }
        return t;
      })
      );
    }

    setClassSections((prev) =>
    prev.map((c) => c.id === classId ? { ...c, classTeacher: teacherId } : c)
    );
    setShowAssignClassTeacherModal(false);
    setSelectedClassForTeacher(null);
    setHasUnsavedChanges(true);

    if (teacherId) {
      const teacher = getTeacherById(teacherId);
      const classSection = classSections.find((c) => c.id === classId);
      if (teacher && classSection) {
        addToast('success', `${teacher.name} assigned as Class Teacher for ${classSection.label}`);
      }
    }
  };

  const handleRemoveClassTeacher = (classId: string) => {
    const classSection = classSections.find((c) => c.id === classId);
    if (classSection?.classTeacher) {
      setTeachers((prev) =>
      prev.map((t) =>
      t.id === classSection.classTeacher ?
      { ...t, isClassTeacher: false, classTeacherOf: null } :
      t
      )
      );
    }

    setClassSections((prev) =>
    prev.map((c) => c.id === classId ? { ...c, classTeacher: null } : c)
    );
    setHasUnsavedChanges(true);
    addToast('info', 'Class teacher removed');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Update class sections with new subjects
      setClassSections((prev) =>
      prev.map((c) =>
      c.value === selectedClassSection ? { ...c, subjects: subjects } : c
      )
      );
      setIsSaving(false);
      setHasUnsavedChanges(false);
      addToast('success', 'Allocation saved successfully!');
    }, 1500);
  };

  const handleCopyAllocation = () => {
    if (!copyFromSection) return;

    const sourceClass = classSections.find((c) => c.value === copyFromSection);
    if (sourceClass) {
      setSubjects(sourceClass.subjects.map((s) => ({ ...s })));
      setShowCopyModal(false);
      setCopyFromSection('');
      setHasUnsavedChanges(true);
      addToast('success', `Allocation copied from ${sourceClass.label}`);
    }
  };

  const handleViewTeacherProfile = (teacher: Teacher) => {
    setSelectedTeacherProfile(teacher);
    setShowTeacherProfileModal(true);
  };

  const handleAddSubject = () => {
    if (!newSubjectForm.name || !newSubjectForm.code) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    const newSubject: Subject = {
      id: `SUB${Date.now()}`,
      name: newSubjectForm.name,
      code: newSubjectForm.code,
      type: newSubjectForm.type,
      weeklySessions: newSubjectForm.weeklySessions,
      assignedTeacher: null,
      alternateTeacher: null,
      isElective: newSubjectForm.isElective
    };

    setSubjects((prev) => [...prev, newSubject]);
    setNewSubjectForm({ name: '', code: '', type: 'Theory', weeklySessions: 4, isElective: false });
    setShowAddSubjectModal(false);
    setHasUnsavedChanges(true);
    addToast('success', `${newSubject.name} added successfully`);
  };

  const handleRemoveSubject = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setHasUnsavedChanges(true);
    if (subject) {
      addToast('info', `${subject.name} removed`);
    }
  };

  const handleAutoAssign = () => {
    // Simple auto-assign logic: match subjects to qualified teachers
    const updatedSubjects = subjects.map((subject) => {
      if (subject.assignedTeacher) return subject;

      const subjectName = subject.name.replace(' Lab', '').split(' ')[0].toLowerCase();
      const qualifiedTeacher = teachers.find(
        (t) =>
        t.status === 'Active' &&
        t.currentLoad < t.maxLoad &&
        t.subjects.some((s) => s.toLowerCase().includes(subjectName) || subjectName.includes(s.toLowerCase().split(' ')[0]))
      );

      return qualifiedTeacher ? { ...subject, assignedTeacher: qualifiedTeacher.id } : subject;
    });

    setSubjects(updatedSubjects);
    setHasUnsavedChanges(true);
    addToast('success', 'Auto-assignment completed');
  };

  const handleClearAllAssignments = () => {
    setSubjects((prev) => prev.map((s) => ({ ...s, assignedTeacher: null, alternateTeacher: null })));
    setHasUnsavedChanges(true);
    addToast('info', 'All assignments cleared');
  };

  const getSubjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Theory':return <BookText className="w-4 h-4 text-blue-500" />;
      case 'Lab':return <FlaskConical className="w-4 h-4 text-purple-500" />;
      case 'Practical':return <Zap className="w-4 h-4 text-orange-500" />;
      case 'Language':return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'Co-curricular':return <Award className="w-4 h-4 text-pink-500" />;
      default:return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSubjectTypeBadge = (type: string) => {
    switch (type) {
      case 'Theory':return 'bg-blue-100 text-blue-800';
      case 'Lab':return 'bg-purple-100 text-purple-800';
      case 'Practical':return 'bg-orange-100 text-orange-800';
      case 'Language':return 'bg-green-100 text-green-800';
      case 'Co-curricular':return 'bg-pink-100 text-pink-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Academics</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Teacher & Class Allocation</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-blue-600" />
            Teacher Class / Subject Allocation
          </h1>
          <p className="text-sm text-gray-500">Assign class teachers and subject teachers to classes with conflict detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={academicYear}
            onChange={setAcademicYear}
            options={academicYears}
            className="w-40" />

        </div>
      </div>

      {/* Main Content Card */}
      <Card className="p-0 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex -mb-px overflow-x-auto">
            {[
            { id: 'allocation' as TabType, label: 'Subject Allocation', icon: BookOpen },
            { id: 'class-teachers' as TabType, label: 'Class Teachers', icon: UserCheck },
            { id: 'workload' as TabType, label: 'Teacher Workload', icon: Clock }].
            map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive ?
                  'border-blue-500 text-blue-600' :
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }>

                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>);

            })}
          </nav>
        </div>

        <div className="p-6">
          {/* ==================== SUBJECT ALLOCATION TAB ==================== */}
          {activeTab === 'allocation' &&
          <div className="space-y-6">
              {/* Selection Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class & Section</label>
                  <Select
                  value={selectedClassSection}
                  onChange={setSelectedClassSection}
                  options={classSections.map((c) => ({ value: c.value, label: c.label }))} />

                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setShowCopyModal(true)} leftIcon={<Copy className="w-4 h-4" />}>
                    Copy From...
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddSubjectModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Add Subject
                  </Button>
                </div>
              </div>

              {/* Class Info Card */}
              {currentClass &&
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <School className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{currentClass.label}</h3>
                      <p className="text-sm text-blue-700">
                        Room: {currentClass.roomNumber} • Students: {currentClass.totalStudents}
                        {currentClass.stream && ` • Stream: ${currentClass.stream}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-blue-600">Class Teacher</p>
                      {currentClass.classTeacher ?
                  <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-blue-900">
                            {getTeacherById(currentClass.classTeacher)?.name || 'Unknown'}
                          </span>
                        </div> :

                  <Badge variant="warning">Not Assigned</Badge>
                  }
                    </div>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedClassForTeacher(currentClass);
                    setShowAssignClassTeacherModal(true);
                  }}>

                      {currentClass.classTeacher ? 'Change' : 'Assign'}
                    </Button>
                  </div>
                </div>
            }

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
                      <p className="text-sm text-gray-500">Total Subjects</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.assignedSubjects}</p>
                      <p className="text-sm text-gray-500">Assigned</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{stats.unassignedSubjects}</p>
                      <p className="text-sm text-gray-500">Unassigned</p>
                    </div>
                    <UserX className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalSessions}</p>
                      <p className="text-sm text-gray-500">Weekly Sessions</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleAutoAssign} leftIcon={<Zap className="w-4 h-4" />}>
                  Auto Assign
                </Button>
                <Button variant="outline" onClick={handleClearAllAssignments} leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Clear All
                </Button>
                <div className="flex-1" />
                {stats.unassignedSubjects > 0 &&
              <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{stats.unassignedSubjects} subjects need assignment</span>
                  </div>
              }
              </div>

              {/* Allocation Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Sessions/Week</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[280px]">Subject Teacher</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 min-w-[280px]">Alternate Teacher</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => {
                    const assignedTeacher = getTeacherById(subject.assignedTeacher);
                    const alternateTeacher = getTeacherById(subject.alternateTeacher);
                    const assignedConflicts = subject.assignedTeacher ? checkConflicts(subject.assignedTeacher, subject.id) : [];
                    const alternateConflicts = subject.alternateTeacher ? checkConflicts(subject.alternateTeacher, subject.id, true) : [];

                    return (
                      <tr
                        key={subject.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !subject.assignedTeacher ? 'bg-amber-50/50' : ''}`
                        }>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getSubjectTypeIcon(subject.type)}
                              <div>
                                <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                                {subject.isElective &&
                              <Badge variant="secondary" className="ml-2 text-xs">Elective</Badge>
                              }
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 font-mono">{subject.code}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectTypeBadge(subject.type)}`}>
                              {subject.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                              {subject.weeklySessions}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <TeacherDropdown
                            subject={subject}
                            selectedTeacher={assignedTeacher}
                            conflicts={assignedConflicts}
                            teachers={teachers}
                            isActive={activeDropdown === `${subject.id}-assigned`}
                            onToggle={() => setActiveDropdown(activeDropdown === `${subject.id}-assigned` ? null : `${subject.id}-assigned`)}
                            onSelect={(teacherId) => handleTeacherAssign(subject.id, teacherId)}
                            excludeTeacherId={subject.alternateTeacher}
                            onViewTeacher={handleViewTeacherProfile} />

                          </td>
                          <td className="py-3 px-4">
                            <TeacherDropdown
                            subject={subject}
                            selectedTeacher={alternateTeacher}
                            conflicts={alternateConflicts}
                            teachers={teachers}
                            isActive={activeDropdown === `${subject.id}-alternate`}
                            onToggle={() => setActiveDropdown(activeDropdown === `${subject.id}-alternate` ? null : `${subject.id}-alternate`)}
                            onSelect={(teacherId) => handleTeacherAssign(subject.id, teacherId, true)}
                            isAlternate
                            excludeTeacherId={subject.assignedTeacher}
                            onViewTeacher={handleViewTeacherProfile} />

                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                            onClick={() => handleRemoveSubject(subject.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Subject">

                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Theory</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Lab</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Practical</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Language</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Error</span>
                </div>
              </div>
            </div>
          }

          {/* ==================== CLASS TEACHERS TAB ==================== */}
          {activeTab === 'class-teachers' &&
          <div className="space-y-6">
              {/* Info Banner */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Each class must have one Class Teacher assigned. Class Teachers are responsible for overall class management,
                  student welfare, and parent communication.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                      <p className="text-sm text-gray-500">Total Classes</p>
                    </div>
                    <School className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.totalClasses - stats.classesWithoutClassTeacher}</p>
                      <p className="text-sm text-gray-500">With Class Teacher</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{stats.classesWithoutClassTeacher}</p>
                      <p className="text-sm text-gray-500">Without Class Teacher</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
              </div>

              {/* Class Teachers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classSections.map((classSection) => {
                const classTeacher = getTeacherById(classSection.classTeacher);
                return (
                  <div
                    key={classSection.id}
                    className={`rounded-lg border-2 p-4 transition-all ${
                    classTeacher ?
                    'bg-white border-green-200 hover:border-green-300' :
                    'bg-amber-50 border-amber-200 hover:border-amber-300'}`
                    }>

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{classSection.label}</h4>
                          <p className="text-sm text-gray-500">
                            Room {classSection.roomNumber} • {classSection.totalStudents} students
                          </p>
                        </div>
                        {classTeacher ?
                      <Badge variant="success" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Assigned
                          </Badge> :

                      <Badge variant="warning">Not Assigned</Badge>
                      }
                      </div>

                      {classTeacher ?
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                            {classTeacher.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{classTeacher.name}</p>
                            <p className="text-sm text-gray-500">{classTeacher.department}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                          onClick={() => handleViewTeacherProfile(classTeacher)}
                          className="p-1.5 hover:bg-gray-200 rounded"
                          title="View Profile">

                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                          onClick={() => handleRemoveClassTeacher(classSection.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                          title="Remove">

                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div> :

                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-amber-300 rounded-lg">
                          <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedClassForTeacher(classSection);
                          setShowAssignClassTeacherModal(true);
                        }}
                        leftIcon={<UserPlus className="w-4 h-4" />}>

                            Assign Class Teacher
                          </Button>
                        </div>
                    }
                    </div>);

              })}
              </div>
            </div>
          }

          {/* ==================== WORKLOAD TAB ==================== */}
          {activeTab === 'workload' &&
          <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                  <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

                </div>
                <Select
                value={departmentFilter}
                onChange={setDepartmentFilter}
                options={[{ value: '', label: 'All Departments' }, ...departments]}
                className="w-48" />

              </div>

              {/* Workload Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Teacher</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subjects</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Workload</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Class Teacher</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => {
                    const loadPercentage = Math.round(teacher.currentLoad / teacher.maxLoad * 100);
                    const loadColor = loadPercentage >= 100 ? 'bg-red-500' : loadPercentage >= 80 ? 'bg-amber-500' : 'bg-green-500';
                    const loadTextColor = loadPercentage >= 100 ? 'text-red-600' : loadPercentage >= 80 ? 'text-amber-600' : 'text-green-600';

                    return (
                      <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                                {teacher.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{teacher.name}</p>
                                <p className="text-xs text-gray-500">{teacher.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-700">{teacher.department}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects.slice(0, 3).map((subj, i) =>
                            <Badge key={i} variant="secondary" className="text-xs">{subj}</Badge>
                            )}
                              {teacher.subjects.length > 3 &&
                            <Badge variant="secondary" className="text-xs">+{teacher.subjects.length - 3}</Badge>
                            }
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${loadColor}`} style={{ width: `${Math.min(loadPercentage, 100)}%` }} />
                              </div>
                              <span className={`text-sm font-medium ${loadTextColor}`}>
                                {teacher.currentLoad}/{teacher.maxLoad}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {teacher.isClassTeacher ?
                          <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs text-gray-600">{teacher.classTeacherOf?.split(' - ')[0]}</span>
                              </div> :

                          <span className="text-gray-400">-</span>
                          }
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={teacher.status === 'Active' ? 'success' : teacher.status === 'On Leave' ? 'warning' : 'secondary'}>
                              {teacher.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                            onClick={() => handleViewTeacherProfile(teacher)}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title="View Profile">

                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {hasUnsavedChanges &&
          <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">You have unsaved changes</span>
            </div>
          }
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>

            {isSaving ? 'Saving...' : 'Save Allocation'}
          </Button>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Copy Allocation Modal */}
      <Modal isOpen={showCopyModal} onClose={() => setShowCopyModal(false)} title="Copy Allocation" size="md">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Copying to:</strong> {currentClass?.label}
            </p>
          </div>
          <Select
            label="Copy allocations from"
            value={copyFromSection}
            onChange={setCopyFromSection}
            options={[
            { value: '', label: 'Select section...' },
            ...classSections.filter((c) => c.value !== selectedClassSection).map((c) => ({ value: c.value, label: c.label }))]
            } />

          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-amber-800">This will replace all current allocations.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCopyModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCopyAllocation} disabled={!copyFromSection} leftIcon={<Copy className="w-4 h-4" />}>
              Copy Allocation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Teacher Profile Modal */}
      <Modal isOpen={showTeacherProfileModal} onClose={() => setShowTeacherProfileModal(false)} title="Teacher Profile" size="lg">
        {selectedTeacherProfile &&
        <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                {selectedTeacherProfile.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTeacherProfile.name}</h3>
                <p className="text-gray-500">{selectedTeacherProfile.code}</p>
                <Badge variant={selectedTeacherProfile.status === 'Active' ? 'success' : 'warning'} className="mt-1">
                  {selectedTeacherProfile.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="font-medium">{selectedTeacherProfile.department}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Qualification</p>
                <p className="font-medium">{selectedTeacherProfile.qualification}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Experience</p>
                <p className="font-medium">{selectedTeacherProfile.experience} years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Workload</p>
                <p className="font-medium">{selectedTeacherProfile.currentLoad}/{selectedTeacherProfile.maxLoad} sessions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-medium">{selectedTeacherProfile.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{selectedTeacherProfile.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Teaching Subjects</p>
              <div className="flex flex-wrap gap-2">
                {selectedTeacherProfile.subjects.map((subj, i) =>
              <Badge key={i} variant="primary">{subj}</Badge>
              )}
              </div>
            </div>

            {selectedTeacherProfile.isClassTeacher &&
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Class Teacher</p>
                  <p className="text-sm text-yellow-700">{selectedTeacherProfile.classTeacherOf}</p>
                </div>
              </div>
          }

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowTeacherProfileModal(false)}>Close</Button>
            </div>
          </div>
        }
      </Modal>

      {/* Assign Class Teacher Modal */}
      <Modal
        isOpen={showAssignClassTeacherModal}
        onClose={() => {setShowAssignClassTeacherModal(false);setSelectedClassForTeacher(null);}}
        title="Assign Class Teacher"
        size="md">

        {selectedClassForTeacher &&
        <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Assigning to:</strong> {selectedClassForTeacher.label}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {teachers.filter((t) => t.status === 'Active').map((teacher) => {
              const isCurrentClassTeacher = selectedClassForTeacher.classTeacher === teacher.id;
              const isOtherClassTeacher = teacher.isClassTeacher && !isCurrentClassTeacher;

              return (
                <button
                  key={teacher.id}
                  onClick={() => handleAssignClassTeacher(selectedClassForTeacher.id, teacher.id)}
                  disabled={isOtherClassTeacher}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                  isCurrentClassTeacher ? 'bg-green-50 border-green-300' :
                  isOtherClassTeacher ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' :
                  'bg-white border-gray-200 hover:border-blue-300'}`
                  }>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                      {teacher.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        {isCurrentClassTeacher && <Check className="w-4 h-4 text-green-600" />}
                        {isOtherClassTeacher && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{teacher.department}</p>
                      {isOtherClassTeacher &&
                    <p className="text-xs text-amber-600">Already Class Teacher: {teacher.classTeacherOf}</p>
                    }
                    </div>
                  </button>);

            })}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => {setShowAssignClassTeacherModal(false);setSelectedClassForTeacher(null);}}>
                Cancel
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Add Subject Modal */}
      <Modal isOpen={showAddSubjectModal} onClose={() => setShowAddSubjectModal(false)} title="Add New Subject" size="md">
        <div className="space-y-4">
          <Input
            label="Subject Name *"
            placeholder="e.g., Sociology"
            value={newSubjectForm.name}
            onChange={(e) => setNewSubjectForm((prev) => ({ ...prev, name: e.target.value }))} />

          <Input
            label="Subject Code *"
            placeholder="e.g., SOC"
            value={newSubjectForm.code}
            onChange={(e) => setNewSubjectForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject Type"
              value={newSubjectForm.type}
              onChange={(val) => setNewSubjectForm((prev) => ({ ...prev, type: val as Subject['type'] }))}
              options={[
              { value: 'Theory', label: 'Theory' },
              { value: 'Lab', label: 'Lab' },
              { value: 'Practical', label: 'Practical' },
              { value: 'Language', label: 'Language' },
              { value: 'Co-curricular', label: 'Co-curricular' }]
              } />

            <Input
              label="Weekly Sessions"
              type="number"
              value={newSubjectForm.weeklySessions}
              onChange={(e) => setNewSubjectForm((prev) => ({ ...prev, weeklySessions: parseInt(e.target.value) || 0 }))}
              min={1}
              max={10} />

          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newSubjectForm.isElective}
              onChange={(e) => setNewSubjectForm((prev) => ({ ...prev, isElective: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded" />

            <span className="text-sm text-gray-700">This is an elective subject</span>
          </label>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddSubjectModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddSubject} leftIcon={<Plus className="w-4 h-4" />}>
              Add Subject
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export default TeacherClassSubjectAllocation;