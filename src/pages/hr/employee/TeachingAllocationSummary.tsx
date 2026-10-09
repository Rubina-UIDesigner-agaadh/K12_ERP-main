import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  Home,
  Filter,
  Download,
  Printer,
  RefreshCw,
  User,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Eye,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Target,
  Activity } from
'lucide-react';

interface TeacherScheduleSlot {
  period: number;
  time: string;
  subject: string;
  class: string;
  room: string;
}

interface TeacherSchedule {
  monday: TeacherScheduleSlot[];
  tuesday: TeacherScheduleSlot[];
  wednesday: TeacherScheduleSlot[];
  thursday: TeacherScheduleSlot[];
  friday: TeacherScheduleSlot[];
  saturday: TeacherScheduleSlot[];
}

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  mainSubject: string;
  additionalSubjects: string[];
  classesAssigned: string[];
  totalWeeklyPeriods: number;
  maxPeriods: number;
  schedule: TeacherSchedule;
  email: string;
  phone: string;
  experience: number;
}

const periodTimes = [
{ period: 1, time: '8:00 - 8:45' },
{ period: 2, time: '8:45 - 9:30' },
{ period: 3, time: '9:45 - 10:30' },
{ period: 4, time: '10:30 - 11:15' },
{ period: 5, time: '11:30 - 12:15' },
{ period: 6, time: '12:15 - 1:00' },
{ period: 7, time: '2:00 - 2:45' },
{ period: 8, time: '2:45 - 3:30' }];


const generateSchedule = (periods: number): TeacherSchedule => {
  const days: (keyof TeacherSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Geography'];
  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2', 'Room 201', 'Room 202'];

  const schedule: TeacherSchedule = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  };

  let remainingPeriods = periods;

  for (const day of days) {
    if (remainingPeriods <= 0) break;
    const periodsToday = Math.min(Math.floor(Math.random() * 5) + 3, remainingPeriods, 7);
    const usedPeriods: number[] = [];

    for (let i = 0; i < periodsToday; i++) {
      let period: number;
      do {
        period = Math.floor(Math.random() * 8) + 1;
      } while (usedPeriods.includes(period));
      usedPeriods.push(period);

      schedule[day].push({
        period,
        time: periodTimes[period - 1].time,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        class: classes[Math.floor(Math.random() * classes.length)],
        room: rooms[Math.floor(Math.random() * rooms.length)]
      });
      remainingPeriods--;
    }

    schedule[day].sort((a, b) => a.period - b.period);
  }

  return schedule;
};

const mockTeachers: Teacher[] = [
{
  id: 'TCH001',
  name: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  designation: 'Senior Teacher',
  department: 'Mathematics',
  mainSubject: 'Mathematics',
  additionalSubjects: ['Statistics'],
  classesAssigned: ['10-A', '10-B', '11-A', '11-B', '12-A'],
  totalWeeklyPeriods: 28,
  maxPeriods: 24,
  schedule: generateSchedule(28),
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  experience: 15
},
{
  id: 'TCH002',
  name: 'Mrs. Priya Sharma',
  avatar: 'PS',
  designation: 'Teacher',
  department: 'Science',
  mainSubject: 'Physics',
  additionalSubjects: ['General Science'],
  classesAssigned: ['10-A', '10-B', '11-A', '11-B'],
  totalWeeklyPeriods: 22,
  maxPeriods: 24,
  schedule: generateSchedule(22),
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  experience: 8
},
{
  id: 'TCH003',
  name: 'Mr. Amit Patel',
  avatar: 'AP',
  designation: 'HOD',
  department: 'Science',
  mainSubject: 'Chemistry',
  additionalSubjects: [],
  classesAssigned: ['11-A', '11-B', '12-A', '12-B'],
  totalWeeklyPeriods: 18,
  maxPeriods: 24,
  schedule: generateSchedule(18),
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  experience: 12
},
{
  id: 'TCH004',
  name: 'Ms. Sneha Reddy',
  avatar: 'SR',
  designation: 'Teacher',
  department: 'English',
  mainSubject: 'English',
  additionalSubjects: ['Literature'],
  classesAssigned: ['9-A', '9-B', '10-A'],
  totalWeeklyPeriods: 12,
  maxPeriods: 24,
  schedule: generateSchedule(12),
  email: 'sneha.reddy@school.edu',
  phone: '+91 98765 43213',
  experience: 4
},
{
  id: 'TCH005',
  name: 'Dr. Vikram Singh',
  avatar: 'VS',
  designation: 'Senior Teacher',
  department: 'Biology',
  mainSubject: 'Biology',
  additionalSubjects: ['Environmental Science'],
  classesAssigned: ['10-A', '10-B', '11-A', '11-B', '12-A', '12-B'],
  totalWeeklyPeriods: 26,
  maxPeriods: 24,
  schedule: generateSchedule(26),
  email: 'vikram.singh@school.edu',
  phone: '+91 98765 43214',
  experience: 18
},
{
  id: 'TCH006',
  name: 'Mrs. Kavita Iyer',
  avatar: 'KI',
  designation: 'Teacher',
  department: 'Social Studies',
  mainSubject: 'History',
  additionalSubjects: ['Civics'],
  classesAssigned: ['9-A', '9-B', '10-A', '10-B'],
  totalWeeklyPeriods: 20,
  maxPeriods: 24,
  schedule: generateSchedule(20),
  email: 'kavita.iyer@school.edu',
  phone: '+91 98765 43215',
  experience: 6
},
{
  id: 'TCH007',
  name: 'Mr. Sanjay Gupta',
  avatar: 'SG',
  designation: 'Teacher',
  department: 'Computer Science',
  mainSubject: 'Computer Science',
  additionalSubjects: ['Programming'],
  classesAssigned: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B'],
  totalWeeklyPeriods: 24,
  maxPeriods: 24,
  schedule: generateSchedule(24),
  email: 'sanjay.gupta@school.edu',
  phone: '+91 98765 43216',
  experience: 10
},
{
  id: 'TCH008',
  name: 'Ms. Meera Nair',
  avatar: 'MN',
  designation: 'Assistant Teacher',
  department: 'Mathematics',
  mainSubject: 'Mathematics',
  additionalSubjects: [],
  classesAssigned: ['9-A', '9-B'],
  totalWeeklyPeriods: 10,
  maxPeriods: 24,
  schedule: generateSchedule(10),
  email: 'meera.nair@school.edu',
  phone: '+91 98765 43217',
  experience: 2
},
{
  id: 'TCH009',
  name: 'Dr. Arun Verma',
  avatar: 'AV',
  designation: 'Senior Teacher',
  department: 'Physics',
  mainSubject: 'Physics',
  additionalSubjects: ['Advanced Physics'],
  classesAssigned: ['11-A', '11-B', '12-A', '12-B'],
  totalWeeklyPeriods: 21,
  maxPeriods: 24,
  schedule: generateSchedule(21),
  email: 'arun.verma@school.edu',
  phone: '+91 98765 43218',
  experience: 14
},
{
  id: 'TCH010',
  name: 'Mrs. Lakshmi Menon',
  avatar: 'LM',
  designation: 'Teacher',
  department: 'Geography',
  mainSubject: 'Geography',
  additionalSubjects: ['Environmental Studies'],
  classesAssigned: ['9-A', '9-B', '10-A'],
  totalWeeklyPeriods: 14,
  maxPeriods: 24,
  schedule: generateSchedule(14),
  email: 'lakshmi.menon@school.edu',
  phone: '+91 98765 43219',
  experience: 5
},
{
  id: 'TCH011',
  name: 'Mr. Rohit Joshi',
  avatar: 'RJ',
  designation: 'Teacher',
  department: 'Physical Education',
  mainSubject: 'Physical Education',
  additionalSubjects: ['Sports'],
  classesAssigned: ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B'],
  totalWeeklyPeriods: 30,
  maxPeriods: 24,
  schedule: generateSchedule(30),
  email: 'rohit.joshi@school.edu',
  phone: '+91 98765 43220',
  experience: 7
},
{
  id: 'TCH012',
  name: 'Ms. Anita Das',
  avatar: 'AD',
  designation: 'Teacher',
  department: 'Arts',
  mainSubject: 'Fine Arts',
  additionalSubjects: ['Music'],
  classesAssigned: ['9-A', '9-B'],
  totalWeeklyPeriods: 8,
  maxPeriods: 24,
  schedule: generateSchedule(8),
  email: 'anita.das@school.edu',
  phone: '+91 98765 43221',
  experience: 3
}];


const academicYears = [
{ value: '2024-25', label: '2024-25 (Current)' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


const classOptions = [
{ value: 'all', label: 'All Classes' },
{ value: '9', label: 'Class 9' },
{ value: '10', label: 'Class 10' },
{ value: '11', label: 'Class 11' },
{ value: '12', label: 'Class 12' }];


const subjectOptions = [
{ value: 'all', label: 'All Subjects' },
{ value: 'mathematics', label: 'Mathematics' },
{ value: 'physics', label: 'Physics' },
{ value: 'chemistry', label: 'Chemistry' },
{ value: 'biology', label: 'Biology' },
{ value: 'english', label: 'English' },
{ value: 'computer_science', label: 'Computer Science' },
{ value: 'history', label: 'History' },
{ value: 'geography', label: 'Geography' }];


type LoadStatus = 'underutilized' | 'optimal' | 'overloaded';

const getLoadStatus = (periods: number): LoadStatus => {
  if (periods < 15) return 'underutilized';
  if (periods <= 24) return 'optimal';
  return 'overloaded';
};

const getLoadStatusConfig = (status: LoadStatus) => {
  switch (status) {
    case 'underutilized':
      return {
        label: 'Underutilized',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200',
        icon: <AlertTriangle className="w-3 h-3" />,
        rowBg: ''
      };
    case 'optimal':
      return {
        label: 'Optimal',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
        rowBg: ''
      };
    case 'overloaded':
      return {
        label: 'Overloaded',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: <AlertCircle className="w-3 h-3" />,
        rowBg: 'bg-red-50'
      };
  }
};

export function TeachingAllocationSummary() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredTeachers = useMemo(() => {
    return mockTeachers.filter((teacher) => {
      // Filter by class
      if (selectedClass !== 'all') {
        const hasClass = teacher.classesAssigned.some((cls) => cls.startsWith(selectedClass));
        if (!hasClass) return false;
      }

      // Filter by subject
      if (selectedSubject !== 'all') {
        const subjectMatch = teacher.mainSubject.toLowerCase().replace(' ', '_') === selectedSubject ||
        teacher.additionalSubjects.some((s) => s.toLowerCase().replace(' ', '_') === selectedSubject);
        if (!subjectMatch) return false;
      }

      return true;
    });
  }, [selectedClass, selectedSubject]);

  const sortedTeachers = useMemo(() => {
    return [...filteredTeachers].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'subject':
          comparison = a.mainSubject.localeCompare(b.mainSubject);
          break;
        case 'periods':
          comparison = a.totalWeeklyPeriods - b.totalWeeklyPeriods;
          break;
        case 'status':
          const statusOrder = { underutilized: 0, optimal: 1, overloaded: 2 };
          comparison = statusOrder[getLoadStatus(a.totalWeeklyPeriods)] - statusOrder[getLoadStatus(b.totalWeeklyPeriods)];
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTeachers, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowTimetableModal(true);
  };

  const stats = useMemo(() => {
    const total = filteredTeachers.length;
    const underutilized = filteredTeachers.filter((t) => getLoadStatus(t.totalWeeklyPeriods) === 'underutilized').length;
    const optimal = filteredTeachers.filter((t) => getLoadStatus(t.totalWeeklyPeriods) === 'optimal').length;
    const overloaded = filteredTeachers.filter((t) => getLoadStatus(t.totalWeeklyPeriods) === 'overloaded').length;
    const totalPeriods = filteredTeachers.reduce((sum, t) => sum + t.totalWeeklyPeriods, 0);
    const avgPeriods = total > 0 ? Math.round(totalPeriods / total) : 0;

    return { total, underutilized, optimal, overloaded, totalPeriods, avgPeriods };
  }, [filteredTeachers]);

  const days: (keyof TeacherSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Reports</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Teaching Allocation Summary</span>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teaching Workload & Allocation Summary
          </h1>
          <p className="text-sm text-gray-500">
            Analyze teacher workload to ensure optimal distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Academic Year"
            options={academicYears}
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)} />

          <Select
            label="Select Class"
            options={classOptions}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)} />

          <Select
            label="Select Subject"
            options={subjectOptions}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)} />

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedClass('all');
                setSelectedSubject('all');
              }}
              className="w-full">

              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Teachers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.optimal}</p>
              <p className="text-xs text-gray-500">Optimal Load</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.underutilized}</p>
              <p className="text-xs text-gray-500">Underutilized</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.overloaded}</p>
              <p className="text-xs text-gray-500">Overloaded</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPeriods}</p>
              <p className="text-xs text-gray-500">Total Periods</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPeriods}</p>
              <p className="text-xs text-gray-500">Avg Periods/Teacher</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Distribution Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Load Distribution Bar */}
        <Card title="Load Distribution">
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Optimal (16-24)</span>
                <span className="text-sm font-bold text-green-700">{stats.optimal}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.optimal / stats.total * 100}%` }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-amber-700">Underutilized (&lt;15)</span>
                <span className="text-sm font-bold text-amber-700">{stats.underutilized}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.underutilized / stats.total * 100}%` }} />

              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-red-700">Overloaded (&gt;24)</span>
                <span className="text-sm font-bold text-red-700">{stats.overloaded}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.overloaded / stats.total * 100}%` }} />

              </div>
            </div>
          </div>
        </Card>

        {/* Period Distribution Heatmap */}
        <Card title="Period Range Distribution">
          <div className="grid grid-cols-4 gap-2 py-2">
            {[
            { range: '0-10', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods <= 10).length, color: 'bg-red-100 text-red-800' },
            { range: '11-15', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 10 && t.totalWeeklyPeriods <= 15).length, color: 'bg-amber-100 text-amber-800' },
            { range: '16-20', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 15 && t.totalWeeklyPeriods <= 20).length, color: 'bg-green-100 text-green-800' },
            { range: '21-24', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 20 && t.totalWeeklyPeriods <= 24).length, color: 'bg-green-100 text-green-800' },
            { range: '25-28', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 24 && t.totalWeeklyPeriods <= 28).length, color: 'bg-orange-100 text-orange-800' },
            { range: '29-32', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 28 && t.totalWeeklyPeriods <= 32).length, color: 'bg-red-100 text-red-800' },
            { range: '33-36', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 32 && t.totalWeeklyPeriods <= 36).length, color: 'bg-red-200 text-red-900' },
            { range: '36+', count: filteredTeachers.filter((t) => t.totalWeeklyPeriods > 36).length, color: 'bg-red-300 text-red-900' }].
            map((item, index) =>
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${item.color}`}>

                <p className="text-lg font-bold">{item.count}</p>
                <p className="text-xs">{item.range}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Department Summary */}
        <Card title="Department Summary">
          <div className="space-y-3 py-2">
            {[
            { dept: 'Mathematics', teachers: 2, avgLoad: 19 },
            { dept: 'Science', teachers: 3, avgLoad: 22 },
            { dept: 'English', teachers: 1, avgLoad: 12 },
            { dept: 'Social Studies', teachers: 2, avgLoad: 17 },
            { dept: 'Computer Science', teachers: 1, avgLoad: 24 }].
            map((item, index) =>
            <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">{item.dept}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">{item.teachers} teachers</span>
                  <span className={`text-sm font-medium ${
                item.avgLoad < 15 ? 'text-amber-600' :
                item.avgLoad <= 24 ? 'text-green-600' : 'text-red-600'}`
                }>
                    {item.avgLoad} avg
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Workload Table */}
      <Card title="Teacher Workload Matrix">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            Click on a teacher's name to view their detailed weekly timetable
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-2">
                    Teacher Name
                    {sortColumn === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
                    }
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('subject')}>

                  <div className="flex items-center gap-2">
                    Main Subject
                    {sortColumn === 'subject' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
                    }
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Classes Assigned
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('periods')}>

                  <div className="flex items-center justify-center gap-2">
                    Total Weekly Periods
                    {sortColumn === 'periods' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
                    }
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Load Bar
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center gap-2">
                    Load Status
                    {sortColumn === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
                    }
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTeachers.map((teacher) => {
                const loadStatus = getLoadStatus(teacher.totalWeeklyPeriods);
                const statusConfig = getLoadStatusConfig(loadStatus);
                const loadPercentage = teacher.totalWeeklyPeriods / teacher.maxPeriods * 100;

                return (
                  <tr
                    key={teacher.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${statusConfig.rowBg}`}>

                    {/* Teacher Name */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTeacherClick(teacher)}
                        className="flex items-center gap-3 text-left hover:text-blue-600 group">

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                          {teacher.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-gray-500">{teacher.designation}</p>
                        </div>
                      </button>
                    </td>

                    {/* Main Subject */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {teacher.mainSubject}
                        </span>
                        {teacher.additionalSubjects.length > 0 &&
                        <p className="text-xs text-gray-500 mt-1">
                            +{teacher.additionalSubjects.join(', ')}
                          </p>
                        }
                      </div>
                    </td>

                    {/* Classes Assigned */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classesAssigned.map((cls, index) =>
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">

                            {cls}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Weekly Periods */}
                    <td className="py-3 px-4 text-center">
                      <span className={`text-lg font-bold ${
                      loadStatus === 'overloaded' ? 'text-red-600' :
                      loadStatus === 'underutilized' ? 'text-amber-600' : 'text-gray-900'}`
                      }>
                        {teacher.totalWeeklyPeriods}
                      </span>
                      <span className="text-sm text-gray-400">/{teacher.maxPeriods}</span>
                    </td>

                    {/* Load Bar */}
                    <td className="py-3 px-4">
                      <div className="w-32 mx-auto">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                            loadStatus === 'overloaded' ? 'bg-red-500' :
                            loadStatus === 'underutilized' ? 'bg-amber-500' : 'bg-green-500'}`
                            }
                            style={{ width: `${Math.min(loadPercentage, 100)}%` }} />

                        </div>
                        <p className="text-xs text-center text-gray-500 mt-1">
                          {Math.round(loadPercentage)}% capacity
                        </p>
                      </div>
                    </td>

                    {/* Load Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTeacherClick(teacher)}>

                        <Eye className="w-4 h-4 mr-1" />
                        View Schedule
                      </Button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {sortedTeachers.length} of {mockTeachers.length} teachers
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Optimal (16-24)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">Underutilized (&lt;15)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Overloaded (&gt;24)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Timetable Modal */}
      {showTimetableModal && selectedTeacher &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowTimetableModal(false)} />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  {selectedTeacher.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedTeacher.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedTeacher.designation} • {selectedTeacher.mainSubject}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getLoadStatusConfig(getLoadStatus(selectedTeacher.totalWeeklyPeriods)).bgColor} ${
                  getLoadStatusConfig(getLoadStatus(selectedTeacher.totalWeeklyPeriods)).textColor}`}>
                      {getLoadStatusConfig(getLoadStatus(selectedTeacher.totalWeeklyPeriods)).icon}
                      {selectedTeacher.totalWeeklyPeriods} periods/week
                    </span>
                  </div>
                </div>
              </div>
              <button
              onClick={() => setShowTimetableModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">

                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Timetable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Weekly Timetable
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-700 w-24">
                        Period
                      </th>
                      {dayLabels.map((day, index) =>
                    <th
                      key={index}
                      className="p-3 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-700 min-w-[140px]">

                          {day}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {periodTimes.map((slot) =>
                  <tr key={slot.period}>
                        <td className="p-2 border border-gray-200 bg-gray-50 text-center">
                          <div className="text-sm font-medium text-gray-700">
                            Period {slot.period}
                          </div>
                          <div className="text-xs text-gray-500">{slot.time}</div>
                        </td>
                        {days.map((day, dayIndex) => {
                      const scheduleSlot = selectedTeacher.schedule[day].find(
                        (s) => s.period === slot.period
                      );

                      return (
                        <td
                          key={dayIndex}
                          className={`p-2 border border-gray-200 text-center ${
                          scheduleSlot ? 'bg-blue-50' : 'bg-white'}`
                          }>

                              {scheduleSlot ?
                          <div className="space-y-1">
                                  <div className="text-sm font-medium text-blue-700">
                                    {scheduleSlot.subject}
                                  </div>
                                  <div className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                    {scheduleSlot.class}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {scheduleSlot.room}
                                  </div>
                                </div> :

                          <span className="text-gray-300 text-sm">-</span>
                          }
                            </td>);

                    })}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                {days.map((day, index) => {
                const dayPeriods = selectedTeacher.schedule[day].length;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">

                      <span className="text-sm font-medium text-gray-700">
                        {dayLabels[index]}
                      </span>
                      <span className={`text-lg font-bold ${
                    dayPeriods > 6 ? 'text-red-600' :
                    dayPeriods < 3 ? 'text-amber-600' : 'text-green-600'}`
                    }>
                        {dayPeriods} periods
                      </span>
                    </div>);

              })}
              </div>

              {/* Teacher Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Teacher Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm text-gray-900">{selectedTeacher.experience} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm text-gray-900">{selectedTeacher.department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={() => setShowTimetableModal(false)}>
                Close
              </Button>
              <Button variant="primary">
                <Printer className="w-4 h-4 mr-2" />
                Print Schedule
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}