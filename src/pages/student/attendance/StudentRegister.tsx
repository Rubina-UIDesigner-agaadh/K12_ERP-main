import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
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

function statusLabel(code: string) {
  if (code === 'A') return 'Absent';
  if (code === 'L') return 'Excused';
  if (code === 'H') return 'Holiday';
  return 'Present';
}

function StudentAttendanceViewPanel({
  student,
  selectedMonth,
  onClose
}: {
  student: Student;
  selectedMonth: string;
  onClose: () => void;
}) {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [monthValue, setMonthValue] = useState(selectedMonth);
  const [anchorDay, setAnchorDay] = useState(1);
  const [year, month] = monthValue.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const safeAnchor = Math.min(Math.max(1, anchorDay), daysInMonth);
  const weekStart = Math.max(1, Math.min(safeAnchor, daysInMonth - 6));
  const visibleDays = range === 'daily'
    ? [safeAnchor]
    : range === 'weekly'
      ? days.filter((day) => day >= weekStart && day < weekStart + 7)
      : days;
  const monthCodes = days.map((d) => student.attendance[d - 1] || 'P');
  const present = monthCodes.filter((s) => s === 'P').length;
  const absent = monthCodes.filter((s) => s === 'A').length;
  const excused = monthCodes.filter((s) => s === 'L').length;
  const holiday = monthCodes.filter((s) => s === 'H').length;
  const late = 0;
  const working = Math.max(daysInMonth - holiday, 1);
  const percent = Math.round(present / working * 100);
  const periodLabel = range === 'daily'
    ? new Date(year, month - 1, safeAnchor).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    : range === 'weekly'
      ? `${new Date(year, month - 1, visibleDays[0]).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${new Date(year, month - 1, visibleDays[visibleDays.length - 1]).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthTitle = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const email = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@school.edu`;
  const phone = `+91 98765 432${String(10 + student.id).padStart(2, '0')}`;
  const parentPhone = `+91 98765 432${String(11 + student.id).padStart(2, '0')}`;
  const shift = (dir: number) => {
    if (range === 'monthly') {
      const next = new Date(year, month - 1 + dir, 1);
      setMonthValue(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
      return;
    }
    const base = range === 'daily' ? safeAnchor : weekStart;
    const next = new Date(year, month - 1, base + dir * (range === 'daily' ? 1 : 7));
    setMonthValue(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setAnchorDay(next.getDate());
  };
  const getStatusIcon = (code: string) => {
    if (code === 'A') return <XCircle className="w-5 h-5 text-red-600" />;
    if (code === 'L') return <Calendar className="w-5 h-5 text-blue-600" />;
    if (code === 'H') return <Clock className="w-5 h-5 text-gray-400" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };
  const getStatusBg = (code: string) => {
    if (code === 'A') return 'bg-red-100';
    if (code === 'L') return 'bg-blue-100';
    if (code === 'H') return 'bg-gray-100';
    return 'bg-green-100';
  };
  const getStatusBadge = (code: string) => {
    if (code === 'A') return 'danger';
    if (code === 'L') return 'info';
    if (code === 'H') return 'secondary';
    return 'success';
  };
  const history = [...visibleDays].reverse().map((d) => {
    const date = new Date(year, month - 1, d);
    const code = student.attendance[d - 1] || 'P';
    return {
      day: d,
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      code,
      time: code === 'P' ? '08:15 AM' : '-',
      remarks: code === 'L' ? 'Medical Leave' : code === 'H' ? 'Holiday' : 'All Classes'
    };
  });
  const dayCellClass = (code: string, isWeekend: boolean) => {
    if (isWeekend || code === 'H') return 'bg-gray-100 text-gray-400';
    if (code === 'A') return 'bg-red-100 text-red-700';
    if (code === 'L') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-gray-50 shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student Attendance</h2>
            <p className="text-sm text-gray-500">{student.firstName} {student.lastName} · {student.grNo} · Class {student.class}-{student.section}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Export Report</Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {([{ id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRange(item.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${range === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-gray-700">Attendance for:</span>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <Button variant="ghost" size="sm" onClick={() => shift(-1)}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="font-bold text-gray-900 min-w-[180px] text-center">{periodLabel}</span>
              <Button variant="ghost" size="sm" onClick={() => shift(1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card className="overflow-hidden" noPadding>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
                      <p className="text-blue-100">Class {student.class}-{student.section}</p>
                      <p className="text-blue-100 text-sm">{student.department}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">GR Number</p>
                      <p className="font-medium text-gray-900">{student.grNo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">SU ID</p>
                      <p className="font-medium text-gray-900">{student.suId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Roll Number</p>
                      <p className="font-medium text-gray-900">{student.rollNo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Section</p>
                      <p className="font-medium text-gray-900">{student.section}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Contact Information</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">{email}</p>
                      <p className="text-gray-600">{phone}</p>
                      <p className="text-gray-600">Parent: {parentPhone}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Overall Attendance">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
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
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-green-600">{present}</p>
                      <p className="text-xs text-gray-500">Present</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-red-600">{absent}</p>
                      <p className="text-xs text-gray-500">Absent</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-yellow-600">{late}</p>
                      <p className="text-xs text-gray-500">Late</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-blue-600">{excused}</p>
                      <p className="text-xs text-gray-500">Excused</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card title={`Monthly Summary - ${monthTitle}`}>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{working}</p>
                    <p className="text-sm text-gray-500">Working Days</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{present}</p>
                    <p className="text-sm text-gray-500">Present</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{absent}</p>
                    <p className="text-sm text-gray-500">Absent</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{late}</p>
                    <p className="text-sm text-gray-500">Late</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{excused}</p>
                    <p className="text-sm text-gray-500">Excused</p>
                  </div>
                </div>
              </Card>

              <Card title="Attendance Calendar">
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
                    <div key={day} className="p-2 font-medium text-gray-500">{day}</div>
                  )}
                  {[...Array(firstWeekday)].map((_, i) => <div key={`empty-${i}`} className="p-2" />)}
                  {days.map((day) => {
                    const code = student.attendance[day - 1] || 'P';
                    const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6;
                    const inRange = visibleDays.includes(day);
                    return (
                      <div
                        key={day}
                        title={statusLabel(code)}
                        className={`p-2 rounded-lg ${dayCellClass(code, isWeekend)} ${inRange ? 'ring-2 ring-blue-400' : 'opacity-70'}`}>
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100" /><span className="text-gray-600">Present</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100" /><span className="text-gray-600">Absent</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-100" /><span className="text-gray-600">Late</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100" /><span className="text-gray-600">Excused</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-100" /><span className="text-gray-600">Weekend/Holiday</span></div>
                </div>
              </Card>

              <Card title="Recent Attendance History">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Day</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record) =>
                        <tr key={record.day} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBg(record.code)}`}>
                                {getStatusIcon(record.code)}
                              </div>
                              <span className="font-medium text-gray-900">{record.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{record.weekday}</td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadge(record.code) as 'success' | 'danger' | 'info' | 'secondary'}>{statusLabel(record.code)}</Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{record.time}</td>
                          <td className="py-3 px-4 text-gray-500 text-sm">{record.remarks}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
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
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [anchorDay, setAnchorDay] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState<'whole-day' | 'subject-wise'>('whole-day');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

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
  const safeAnchor = Math.min(Math.max(1, anchorDay), daysInMonth);
  const weekStart = Math.max(1, Math.min(safeAnchor, daysInMonth - 6));
  const visibleDays = viewMode === 'daily'
    ? [safeAnchor]
    : viewMode === 'weekly'
      ? days.filter((day) => day >= weekStart && day < weekStart + 7)
      : days;

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

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const delta = direction === 'next' ? 1 : -1;
    const [year, month] = selectedMonth.split('-').map(Number);
    if (viewMode === 'monthly') {
      navigateMonth(direction);
      return;
    }
    const base = viewMode === 'daily' ? safeAnchor : weekStart;
    const next = new Date(year, month - 1, base + delta * (viewMode === 'daily' ? 1 : 7));
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setAnchorDay(next.getDate());
  };

  // Format month display
  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const [periodYear, periodMonth] = selectedMonth.split('-').map(Number);
  const periodLabel = viewMode === 'daily'
    ? new Date(periodYear, periodMonth - 1, safeAnchor).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    : viewMode === 'weekly'
      ? `${new Date(periodYear, periodMonth - 1, visibleDays[0] ?? safeAnchor).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${new Date(periodYear, periodMonth - 1, visibleDays[visibleDays.length - 1] ?? safeAnchor).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
      : formatMonth(selectedMonth);

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
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {([{ id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setViewMode(item.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${viewMode === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                {item.label}
              </button>
            ))}
          </div>
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
                <Button variant="ghost" size="sm" onClick={() => navigatePeriod('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-bold text-gray-900 min-w-[200px] text-center">
                  {periodLabel}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigatePeriod('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              {viewMode === 'monthly' &&
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              }

            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{visibleDays.length}</p>
                <p className="text-xs text-gray-500">{viewMode === 'daily' ? 'Day' : viewMode === 'weekly' ? 'Week days' : 'Days'}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
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
                  {visibleDays.map((d) =>
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
                      {visibleDays.map((d) => {
                        const status = student.attendance[d - 1];
                        return (
                      <td
                        key={d}
                        className={`border border-gray-200 p-1 text-center text-xs ${getStatusClass(
                          status
                        )} ${isSunday(d) ? 'bg-red-50' : ''}`}>

                          {status}
                        </td>
                        );
                      })}
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
                          onClick={() => setViewingStudent(student)}>
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
        selectedMonth={selectedMonth}
        onClose={() => setViewingStudent(null)} />
      }
    </div>);

}