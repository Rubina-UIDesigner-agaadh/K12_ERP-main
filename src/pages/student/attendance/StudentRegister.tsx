import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  X,
  User,
  Hash,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Eye,
  CheckCircle,
  XCircle,
  Clock } from
'lucide-react';

interface Student {
  id: number;
  grNo: string;
  suId: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
  rollNo: number;
  attendance: string[];
}

function statusMeta(status: string) {
  if (status === 'Present') return { icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-100', badge: 'success' as const };
  if (status === 'Absent') return { icon: <XCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-100', badge: 'danger' as const };
  if (status === 'Late') return { icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-100', badge: 'warning' as const };
  return { icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100', badge: 'info' as const };
}

function StudentAttendanceViewPanel({
  student,
  month,
  year,
  onMonthChange,
  onYearChange,
  onClose
}: {
  student: Student;
  month: string;
  year: string;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
  onClose: () => void;
}) {
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const firstWeekday = new Date(Number(year), Number(month) - 1, 1).getDay();
  const present = student.attendance.filter((s) => s === 'P').length;
  const absent = student.attendance.filter((s) => s === 'A').length;
  const leave = student.attendance.filter((s) => s === 'L').length;
  const holiday = student.attendance.filter((s) => s === 'H').length;
  const working = Math.max(daysInMonth - holiday, 1);
  const percent = Math.round(present / working * 100);
  const history = student.attendance.slice(0, daysInMonth).map((code, index) => {
    const day = index + 1;
    const date = new Date(Number(year), Number(month) - 1, day);
    const map: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = { P: 'Present', A: 'Absent', L: 'Late', H: 'Excused' };
    return {
      date: `${year}-${month}-${String(day).padStart(2, '0')}`,
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      status: map[code] || 'Present',
      time: code === 'P' ? '08:10 AM' : code === 'L' ? '08:42 AM' : '-',
      remarks: code === 'H' ? 'Holiday / Weekend' : 'All Classes'
    };
  }).filter((_, i) => {
    const d = new Date(Number(year), Number(month) - 1, i + 1).getDay();
    return d !== 0;
  }).slice(-10).reverse();

  const monthOptions = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-gray-50 shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student Attendance</h2>
            <p className="text-sm text-gray-500">{student.firstName} {student.lastName} · {student.grNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Export Report</Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-3">
          <div className="space-y-5">
            <Card className="overflow-hidden" noPadding>
              <div className="bg-blue-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
                    <p className="text-blue-100">Class {student.class}-{student.section}</p>
                    <p className="text-sm text-blue-100">{student.department}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs uppercase tracking-wider text-gray-500">GR Number</p><p className="font-medium text-gray-900">{student.grNo}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-gray-500">SU ID</p><p className="font-medium text-gray-900">{student.suId}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-gray-500">Roll Number</p><p className="font-medium text-gray-900">{student.rollNo}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-gray-500">Section</p><p className="font-medium text-gray-900">{student.section}</p></div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">Contact Information</p>
                  <p className="text-sm text-gray-600">{student.firstName.toLowerCase()}.{student.lastName.toLowerCase()}@school.edu</p>
                  <p className="text-sm text-gray-600">+91 98765 43{String(student.id).padStart(3, '0')}</p>
                </div>
              </div>
            </Card>

            <Card title="Overall Attendance">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90 transform">
                      <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={percent >= 75 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${percent / 100 * 352} 352`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{percent}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-green-50 p-3 text-center"><p className="text-xl font-bold text-green-600">{present}</p><p className="text-xs text-gray-500">Present</p></div>
                  <div className="rounded-lg bg-red-50 p-3 text-center"><p className="text-xl font-bold text-red-600">{absent}</p><p className="text-xs text-gray-500">Absent</p></div>
                  <div className="rounded-lg bg-yellow-50 p-3 text-center"><p className="text-xl font-bold text-yellow-600">{leave}</p><p className="text-xs text-gray-500">Late</p></div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center"><p className="text-xl font-bold text-blue-600">{holiday}</p><p className="text-xs text-gray-500">Excused</p></div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <Card>
              <div className="flex flex-col items-end gap-4 sm:flex-row">
                <div className="flex-1">
                  <Select label="Month" options={monthOptions} value={month} onChange={(e) => onMonthChange(typeof e === 'string' ? e : e.target.value)} />
                </div>
                <div className="flex-1">
                  <Select
                    label="Year"
                    options={[{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }, { value: '2024', label: '2024' }]}
                    value={year}
                    onChange={(e) => onYearChange(typeof e === 'string' ? e : e.target.value)} />
                </div>
                <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>Apply Filter</Button>
              </div>
            </Card>

            <Card title={`Monthly Summary - ${monthOptions.find((m) => m.value === month)?.label} ${year}`}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <div className="rounded-lg bg-gray-50 p-4 text-center"><p className="text-2xl font-bold text-gray-900">{working}</p><p className="text-sm text-gray-500">Working Days</p></div>
                <div className="rounded-lg bg-green-50 p-4 text-center"><p className="text-2xl font-bold text-green-600">{present}</p><p className="text-sm text-gray-500">Present</p></div>
                <div className="rounded-lg bg-red-50 p-4 text-center"><p className="text-2xl font-bold text-red-600">{absent}</p><p className="text-sm text-gray-500">Absent</p></div>
                <div className="rounded-lg bg-yellow-50 p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{leave}</p><p className="text-sm text-gray-500">Late</p></div>
                <div className="rounded-lg bg-blue-50 p-4 text-center"><p className="text-2xl font-bold text-blue-600">{holiday}</p><p className="text-sm text-gray-500">Excused</p></div>
              </div>
            </Card>

            <Card title="Attendance Calendar">
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) =>
                <div key={d} className="p-2 font-medium text-gray-500">{d}</div>
                )}
                {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} className="p-2" />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const code = student.attendance[i] || 'P';
                  const cls = code === 'H' ? 'bg-gray-100 text-gray-400' : code === 'P' ? 'bg-green-100 text-green-700' : code === 'A' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
                  const title = code === 'H' ? 'Weekend/Holiday' : code === 'P' ? 'Present' : code === 'A' ? 'Absent' : 'Late';
                  return <div key={i} className={`cursor-pointer rounded-lg p-2 ${cls}`} title={title}>{i + 1}</div>;
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-green-100" /><span className="text-gray-600">Present</span></div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-red-100" /><span className="text-gray-600">Absent</span></div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-yellow-100" /><span className="text-gray-600">Late</span></div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-blue-100" /><span className="text-gray-600">Excused</span></div>
                <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-gray-100" /><span className="text-gray-600">Weekend/Holiday</span></div>
              </div>
            </Card>

            <Card title="Recent Attendance History">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Date', 'Day', 'Status', 'Time', 'Remarks'].map((h) =>
                      <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-500">{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => {
                      const meta = statusMeta(record.status);
                      return (
                        <tr key={record.date} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.bg}`}>{meta.icon}</div>
                              <span className="font-medium text-gray-900">{record.date}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{record.day}</td>
                          <td className="px-4 py-3"><Badge variant={meta.badge}>{record.status}</Badge></td>
                          <td className="px-4 py-3 text-gray-600">{record.time}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{record.remarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentRegister() {
  // Filter States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [grNo, setGrNo] = useState('');
  const [suId, setSuId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState<'whole-day' | 'subject-wise'>('whole-day');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [viewMonth, setViewMonth] = useState('10');
  const [viewYear, setViewYear] = useState('2026');

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    { value: 'MATH', label: 'Mathematics' },
    { value: 'PHY', label: 'Physics' },
    { value: 'CHEM', label: 'Chemistry' },
    { value: 'BIO', label: 'Biology' },
    { value: 'ENG', label: 'English' },
    { value: 'HIN', label: 'Hindi' },
    { value: 'SST', label: 'Social Studies' },
    { value: 'CS', label: 'Computer Science' }
  ];

  // Get days in month
  const getDaysInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get day name for header
  const getDayName = (day: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  // Check if day is Sunday
  const isSunday = (day: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0;
  };

  // Sample students data
  const allStudents: Student[] = [
  {
    id: 1,
    grNo: 'GR-2024-001',
    suId: 'STU-001',
    firstName: 'Aarav',
    lastName: 'Patel',
    class: '10',
    section: 'A',
    department: 'Science',
    rollNo: 1,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : 'P')
  },
  {
    id: 2,
    grNo: 'GR-2024-002',
    suId: 'STU-002',
    firstName: 'Zara',
    lastName: 'Khan',
    class: '10',
    section: 'A',
    department: 'Science',
    rollNo: 2,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i === 5 || i === 12 ? 'A' : 'P')
  },
  {
    id: 3,
    grNo: 'GR-2024-003',
    suId: 'STU-003',
    firstName: 'Rohan',
    lastName: 'Gupta',
    class: '10',
    section: 'A',
    department: 'Science',
    rollNo: 3,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i === 8 ? 'L' : 'P')
  },
  {
    id: 4,
    grNo: 'GR-2024-004',
    suId: 'STU-004',
    firstName: 'Priya',
    lastName: 'Sharma',
    class: '10',
    section: 'B',
    department: 'Science',
    rollNo: 4,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i === 3 || i === 15 || i === 22 ? 'A' : 'P')
  },
  {
    id: 5,
    grNo: 'GR-2024-005',
    suId: 'STU-005',
    firstName: 'Arjun',
    lastName: 'Singh',
    class: '10',
    section: 'B',
    department: 'Science',
    rollNo: 5,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : 'P')
  },
  {
    id: 6,
    grNo: 'GR-2024-006',
    suId: 'STU-006',
    firstName: 'Ananya',
    lastName: 'Reddy',
    class: '11',
    section: 'A',
    department: 'Commerce',
    rollNo: 1,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i === 10 || i === 11 ? 'L' : 'P')
  },
  {
    id: 7,
    grNo: 'GR-2024-007',
    suId: 'STU-007',
    firstName: 'Vikram',
    lastName: 'Malhotra',
    class: '11',
    section: 'A',
    department: 'Commerce',
    rollNo: 2,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i % 10 === 0 ? 'A' : 'P')
  },
  {
    id: 8,
    grNo: 'GR-2024-008',
    suId: 'STU-008',
    firstName: 'Kavya',
    lastName: 'Joshi',
    class: '12',
    section: 'A',
    department: 'Arts',
    rollNo: 1,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : 'P')
  },
  {
    id: 9,
    grNo: 'GR-2024-009',
    suId: 'STU-009',
    firstName: 'Ishaan',
    lastName: 'Verma',
    class: '12',
    section: 'B',
    department: 'Arts',
    rollNo: 1,
    attendance: Array(31).
    fill('P').
    map((_, i) =>
    isSunday(i + 1) ? 'H' : i === 2 || i === 7 || i === 14 || i === 21 ? 'A' : 'P'
    )
  },
  {
    id: 10,
    grNo: 'GR-2024-010',
    suId: 'STU-010',
    firstName: 'Myra',
    lastName: 'Kapoor',
    class: '9',
    section: 'A',
    department: 'Science',
    rollNo: 1,
    attendance: Array(31).
    fill('P').
    map((_, i) => isSunday(i + 1) ? 'H' : i === 18 ? 'L' : 'P')
  }];


  // Filter students based on all criteria
  const filteredStudents = allStudents.filter((student) => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSection = !selectedSection || student.section === selectedSection;
    const matchesDepartment = !selectedDepartment || student.department === selectedDepartment;
    const matchesGrNo = !grNo || student.grNo.toLowerCase().includes(grNo.toLowerCase());
    const matchesSuId = !suId || student.suId.toLowerCase().includes(suId.toLowerCase());
    const matchesFirstName =
    !firstName || student.firstName.toLowerCase().includes(firstName.toLowerCase());
    const matchesLastName =
    !lastName || student.lastName.toLowerCase().includes(lastName.toLowerCase());

    return (
      matchesClass &&
      matchesSection &&
      matchesDepartment &&
      matchesGrNo &&
      matchesSuId &&
      matchesFirstName &&
      matchesLastName);

  });

  // Reset all filters
  const resetFilters = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedDepartment('');
    setGrNo('');
    setSuId('');
    setFirstName('');
    setLastName('');
    setAttendanceMode('whole-day');
    setSelectedSubject('');
  };

  // Check if any filter is active
  const hasActiveFilters =
  selectedClass ||
  selectedSection ||
  selectedDepartment ||
  grNo ||
  suId ||
  firstName ||
  lastName;

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
      newMonth--;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
    }

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Format month display
  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate statistics
  const calculateStats = (attendance: string[]) => {
    const present = attendance.filter((s) => s === 'P').length;
    const absent = attendance.filter((s) => s === 'A').length;
    const leave = attendance.filter((s) => s === 'L').length;
    const holiday = attendance.filter((s) => s === 'H').length;
    const workingDays = daysInMonth - holiday;
    const percent = workingDays > 0 ? Math.round(present / workingDays * 100) : 0;
    return { present, absent, leave, holiday, workingDays, percent };
  };

  // Get status color class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'P':
        return 'text-green-600 bg-green-50';
      case 'A':
        return 'text-red-600 bg-red-50 font-bold';
      case 'L':
        return 'text-yellow-600 bg-yellow-50';
      case 'H':
        return 'text-gray-400 bg-gray-100';
      default:
        return '';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Attendance Register</h1>
            <p className="text-sm text-gray-500">
              {attendanceMode === 'subject-wise'
                ? `Subject-wise monthly register${selectedSubject ? ` · ${subjectOptions.find((s) => s.value === selectedSubject)?.label}` : ''}`
                : 'Whole-day monthly attendance with detailed filters'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="p-4">
          {/* Primary Filters Row */}
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

                <option value="">All Departments</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

                <option value="">All Classes</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div className="min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance type</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setAttendanceMode('whole-day'); setSelectedSubject(''); }}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${attendanceMode === 'whole-day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  Whole Day
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceMode('subject-wise')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${attendanceMode === 'subject-wise' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  Subject-wise
                </button>
              </div>
            </div>

            {attendanceMode === 'subject-wise' &&
            <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {subjectOptions.map((opt) =>
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                  )}
                </select>
              </div>
            }

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="whitespace-nowrap">

                <Filter className="w-4 h-4 mr-2" />
                {showAdvancedFilters ? 'Hide' : 'More'} Filters
                {showAdvancedFilters ?
                <ChevronUp className="w-4 h-4 ml-2" /> :

                <ChevronDown className="w-4 h-4 ml-2" />
                }
              </Button>

              {hasActiveFilters &&
              <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              }
            </div>
          </div>

          {/* Advanced Filters Row */}
          {showAdvancedFilters &&
          <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      GR Number
                    </div>
                  </label>
                  <div className="relative">
                    <input
                    type="text"
                    value={grNo}
                    onChange={(e) => setGrNo(e.target.value)}
                    placeholder="Search by GR No..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    {grNo &&
                  <button
                    onClick={() => setGrNo('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      Student ID (SU ID)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                    type="text"
                    value={suId}
                    onChange={(e) => setSuId(e.target.value)}
                    placeholder="Search by SU ID..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    {suId &&
                  <button
                    onClick={() => setSuId('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      First Name
                    </div>
                  </label>
                  <div className="relative">
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Search by first name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    {firstName &&
                  <button
                    onClick={() => setFirstName('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Last Name
                    </div>
                  </label>
                  <div className="relative">
                    <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Search by last name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                    {lastName &&
                  <button
                    onClick={() => setLastName('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-4 h-4" />
                      </button>
                  }
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Active Filters Display */}
          {hasActiveFilters &&
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {selectedDepartment &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  Dept: {selectedDepartment}
                  <button onClick={() => setSelectedDepartment('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {selectedClass &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  Class: {selectedClass}
                  <button onClick={() => setSelectedClass('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {selectedSection &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  Section: {selectedSection}
                  <button onClick={() => setSelectedSection('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {grNo &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  GR: {grNo}
                  <button onClick={() => setGrNo('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {suId &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  SU ID: {suId}
                  <button onClick={() => setSuId('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {firstName &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  First Name: {firstName}
                  <button onClick={() => setFirstName('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
              {lastName &&
            <Badge variant="secondary" className="flex items-center gap-1">
                  Last Name: {lastName}
                  <button onClick={() => setLastName('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
            }
            </div>
          }
        </Card>

        {/* Month Navigation & Summary Card */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Attendance for:</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-bold text-gray-900 min-w-[150px] text-center">
                  {formatMonth(selectedMonth)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{daysInMonth}</p>
                <p className="text-xs text-gray-500">Days</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left min-w-[50px] sticky left-0 bg-gray-50 z-20">
                    #
                  </th>
                  <th className="border border-gray-200 p-2 text-left min-w-[100px] sticky left-[50px] bg-gray-50 z-20">
                    GR No.
                  </th>
                  <th className="border border-gray-200 p-2 text-left min-w-[150px] sticky left-[150px] bg-gray-50 z-20">
                    Student Name
                  </th>
                  <th className="border border-gray-200 p-2 text-center min-w-[80px] bg-gray-50">
                    Class
                  </th>
                  {days.map((d) =>
                  <th
                    key={d}
                    className={`border border-gray-200 p-1 text-center w-8 ${
                    isSunday(d) ? 'bg-red-50' : ''}`
                    }>

                      <div className="text-xs text-gray-400">{getDayName(d)}</div>
                      <div>{d}</div>
                    </th>
                  )}
                  <th className="border border-gray-200 p-2 text-center bg-green-50 min-w-[50px]">
                    P
                  </th>
                  <th className="border border-gray-200 p-2 text-center bg-red-50 min-w-[50px]">
                    A
                  </th>
                  <th className="border border-gray-200 p-2 text-center bg-yellow-50 min-w-[50px]">
                    L
                  </th>
                  <th className="border border-gray-200 p-2 text-center bg-blue-50 min-w-[60px]">
                    %
                  </th>
                  <th className="border border-gray-200 p-2 text-center bg-gray-50 min-w-[70px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const stats = calculateStats(student.attendance.slice(0, daysInMonth));
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 text-center sticky left-0 bg-white z-10">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 p-2 font-mono text-xs sticky left-[50px] bg-white z-10">
                        {student.grNo}
                      </td>
                      <td className="border border-gray-200 p-2 sticky left-[150px] bg-white z-10">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{student.suId}</p>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        <Badge variant="secondary">
                          {student.class}-{student.section}
                        </Badge>
                      </td>
                      {student.attendance.slice(0, daysInMonth).map((status, i) =>
                      <td
                        key={i}
                        className={`border border-gray-200 p-1 text-center text-xs ${getStatusClass(
                          status
                        )} ${isSunday(i + 1) ? 'bg-red-50' : ''}`}>

                          {status}
                        </td>
                      )}
                      <td className="border border-gray-200 p-2 text-center font-bold text-green-700 bg-green-50">
                        {stats.present}
                      </td>
                      <td className="border border-gray-200 p-2 text-center font-bold text-red-700 bg-red-50">
                        {stats.absent}
                      </td>
                      <td className="border border-gray-200 p-2 text-center font-bold text-yellow-700 bg-yellow-50">
                        {stats.leave}
                      </td>
                      <td
                        className={`border border-gray-200 p-2 text-center font-bold ${
                        stats.percent >= 75 ?
                        'text-green-700 bg-green-50' :
                        stats.percent >= 50 ?
                        'text-yellow-700 bg-yellow-50' :
                        'text-red-700 bg-red-50'}`
                        }>

                        {stats.percent}%
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View student attendance"
                          onClick={() => {
                            setViewingStudent(student);
                            const [y, m] = selectedMonth.split('-');
                            setViewYear(y);
                            setViewMonth(m);
                          }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 &&
          <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No students found matching your criteria</p>
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          }
        </Card>

        {/* Legend */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-medium text-gray-700">Legend:</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 border border-green-300 rounded flex items-center justify-center text-xs font-bold text-green-700">
                P
              </span>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 border border-red-300 rounded flex items-center justify-center text-xs font-bold text-red-700">
                A
              </span>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-xs font-bold text-yellow-700">
                L
              </span>
              <span className="text-sm text-gray-600">Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                H
              </span>
              <span className="text-sm text-gray-600">Holiday</span>
            </div>
            <div className="border-l pl-6 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Attendance % Color Code:
              </span>
              <span className="text-sm text-green-600 font-medium">≥75% Good</span>
              <span className="text-sm text-yellow-600 font-medium">50-74% Warning</span>
              <span className="text-sm text-red-600 font-medium">&lt;50% Critical</span>
            </div>
          </div>
        </Card>
      </div>

      {viewingStudent &&
      <StudentAttendanceViewPanel
        student={viewingStudent}
        month={viewMonth}
        year={viewYear}
        onMonthChange={setViewMonth}
        onYearChange={setViewYear}
        onClose={() => setViewingStudent(null)} />
      }
    </div>);

}