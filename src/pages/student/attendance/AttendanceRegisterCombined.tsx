import React, { useState } from 'react';
import { Tabs } from '../../../components/ui/Tabs';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  PrinterIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  FileTextIcon,
  SearchIcon,
  EyeIcon,
  BarChart3Icon,
  PieChartIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon } from
'lucide-react';

// ── Types ──
interface Student {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  fatherName: string;
  contact: string;
}

interface DailyAttendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';
  remarks?: string;
}

interface MonthlyAttendanceData extends Student {
  attendance: number[]; // 1=present, 0=absent, 2=holiday, 3=late, 4=half-day, 5=leave
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  percentage: number;
}

interface YearlyAttendanceData extends Student {
  monthlyPresent: number[];
  monthlyWorking: number[];
  totalPresent: number;
  totalWorking: number;
  percentage: number;
}

// ── Monthly Register Tab ──
function MonthlyRegister() {
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedMonth, setSelectedMonth] = useState('3');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentDetails, setShowStudentDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get days in selected month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get day name for header
  const getDayName = (day: number, month: number, year: number) => {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  // Check if day is Sunday
  const isSunday = (day: number, month: number, year: number) => {
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0;
  };

  // Sample student data with detailed attendance
  const students: MonthlyAttendanceData[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rollNo: '01',
    admissionNo: 'ADM2024001',
    fatherName: 'Ramesh Sharma',
    contact: '9876543210',
    attendance: [1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 3, 0, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1],
    presentDays: 22,
    absentDays: 4,
    lateDays: 1,
    halfDays: 0,
    leaveDays: 0,
    percentage: 85
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '02',
    admissionNo: 'ADM2024002',
    fatherName: 'Suresh Patel',
    contact: '9876543211',
    attendance: [1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1],
    presentDays: 24,
    absentDays: 3,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 89
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '03',
    admissionNo: 'ADM2024003',
    fatherName: 'Vijay Kumar',
    contact: '9876543212',
    attendance: [1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1],
    presentDays: 21,
    absentDays: 5,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 81
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNo: '04',
    admissionNo: 'ADM2024004',
    fatherName: 'Anil Gupta',
    contact: '9876543213',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
    presentDays: 25,
    absentDays: 2,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 93
  },
  {
    id: '5',
    name: 'Ravi Singh',
    rollNo: '05',
    admissionNo: 'ADM2024005',
    fatherName: 'Mahendra Singh',
    contact: '9876543214',
    attendance: [1, 1, 1, 1, 0, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0],
    presentDays: 20,
    absentDays: 6,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 77
  },
  {
    id: '6',
    name: 'Anjali Verma',
    rollNo: '06',
    admissionNo: 'ADM2024006',
    fatherName: 'Rakesh Verma',
    contact: '9876543215',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    presentDays: 27,
    absentDays: 0,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 100
  },
  {
    id: '7',
    name: 'Vikram Yadav',
    rollNo: '07',
    admissionNo: 'ADM2024007',
    fatherName: 'Shyam Yadav',
    contact: '9876543216',
    attendance: [1, 1, 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 2, 1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 2, 0, 1, 1],
    presentDays: 16,
    absentDays: 10,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 62
  },
  {
    id: '8',
    name: 'Pooja Sharma',
    rollNo: '08',
    admissionNo: 'ADM2024008',
    fatherName: 'Dinesh Sharma',
    contact: '9876543217',
    attendance: [1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1],
    presentDays: 24,
    absentDays: 3,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 89
  },
  {
    id: '9',
    name: 'Karan Mehta',
    rollNo: '09',
    admissionNo: 'ADM2024009',
    fatherName: 'Ajay Mehta',
    contact: '9876543218',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1],
    presentDays: 25,
    absentDays: 2,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 93
  },
  {
    id: '10',
    name: 'Neha Joshi',
    rollNo: '10',
    admissionNo: 'ADM2024010',
    fatherName: 'Prakash Joshi',
    contact: '9876543219',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1],
    presentDays: 25,
    absentDays: 2,
    lateDays: 0,
    halfDays: 0,
    leaveDays: 0,
    percentage: 93
  }];


  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalStudents = students.length;
  const totalWorkingDays = days.filter(
    (d) => !isSunday(d, parseInt(selectedMonth), parseInt(selectedYear))
  ).length;
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
  );
  const belowThreshold = students.filter((s) => s.percentage < 75).length;
  const perfectAttendance = students.filter((s) => s.percentage === 100).length;

  // Get status icon for attendance cell
  const getStatusIcon = (status: number, day: number) => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const sunday = isSunday(day, month, year);

    if (sunday || status === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
          H
        </span>);

    }
    if (status === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          P
        </span>);

    }
    if (status === 0) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
          A
        </span>);

    }
    if (status === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
          L
        </span>);

    }
    if (status === 4) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
          HD
        </span>);

    }
    if (status === 5) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
          LV
        </span>);

    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
        -
      </span>);

  };

  // Get month name
  const getMonthName = (month: string) => {
    const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

    return months[parseInt(month) - 1];
  };

  // Handle load data
  const handleLoadData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    let month = parseInt(selectedMonth);
    let year = parseInt(selectedYear);

    if (direction === 'prev') {
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
    } else {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    setSelectedMonth(month.toString());
    setSelectedYear(year.toString());
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filter Options
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedClass('10');
              setSelectedSection('A');
              setSelectedMonth('3');
              setSelectedYear('2024');
              setSearchTerm('');
            }}>

            <RefreshCwIcon className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
            { value: '1', label: 'Class 1' },
            { value: '2', label: 'Class 2' },
            { value: '3', label: 'Class 3' },
            { value: '4', label: 'Class 4' },
            { value: '5', label: 'Class 5' },
            { value: '6', label: 'Class 6' },
            { value: '7', label: 'Class 7' },
            { value: '8', label: 'Class 8' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            } />

          <Select
            label="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={[
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
            { value: 'D', label: 'Section D' }]
            } />

          <Select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={[
            { value: '1', label: 'January' },
            { value: '2', label: 'February' },
            { value: '3', label: 'March' },
            { value: '4', label: 'April' },
            { value: '5', label: 'May' },
            { value: '6', label: 'June' },
            { value: '7', label: 'July' },
            { value: '8', label: 'August' },
            { value: '9', label: 'September' },
            { value: '10', label: 'October' },
            { value: '11', label: 'November' },
            { value: '12', label: 'December' }]
            } />

          <Select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={[
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' }]
            } />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Student
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Roll, Adm No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleLoadData}
              disabled={isLoading}>

              {isLoading ?
              <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" /> :

              <FilterIcon className="w-4 h-4 mr-2" />
              }
              Load Register
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Working Days
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkingDays}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Avg Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgAttendance}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Below 75%
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">{belowThreshold}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                100% Attendance
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">{perfectAttendance}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Register Table */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Attendance Register — {getMonthName(selectedMonth)} {selectedYear} · Class {selectedClass}-{selectedSection}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-2 px-3 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                  Roll
                </th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 sticky left-12 bg-gray-50 z-10 min-w-[150px]">
                  Student Name
                </th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 min-w-[100px]">
                  Adm. No
                </th>
                {days.map((d) => {
                  const month = parseInt(selectedMonth);
                  const year = parseInt(selectedYear);
                  const dayName = getDayName(d, month, year);
                  const sunday = isSunday(d, month, year);
                  return (
                    <th
                      key={d}
                      className={`text-center py-2 px-1 font-medium min-w-[32px] ${
                      sunday ? 'bg-gray-100 text-gray-400' : 'text-gray-500'}`
                      }>

                      <div className="flex flex-col items-center">
                        <span className="text-xs">{dayName}</span>
                        <span>{d}</span>
                      </div>
                    </th>);

                })}
                <th className="text-center py-2 px-3 font-semibold text-gray-700 bg-green-50">
                  P
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700 bg-red-50">
                  A
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700 bg-yellow-50">
                  L
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700">
                  %
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const present = student.attendance.filter((a) => a === 1).length;
                const absent = student.attendance.filter((a) => a === 0).length;
                const late = student.attendance.filter((a) => a === 3).length;
                const working = student.attendance.filter((a) => a !== 2).length;
                const pct = working > 0 ? Math.round(present / working * 100) : 0;

                return (
                  <tr
                    key={student.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`
                    }>

                    <td className="py-2 px-3 sticky left-0 bg-inherit text-gray-600 font-medium">
                      {student.rollNo}
                    </td>
                    <td className="py-2 px-3 sticky left-12 bg-inherit">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">S/o {student.fatherName}</p>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-600 text-xs">
                      {student.admissionNo}
                    </td>
                    {student.attendance.slice(0, daysInMonth).map((a, i) =>
                    <td
                      key={i}
                      className={`text-center py-1 px-1 ${
                      isSunday(i + 1, parseInt(selectedMonth), parseInt(selectedYear)) ?
                      'bg-gray-100' :
                      ''}`
                      }>

                        {getStatusIcon(a, i + 1)}
                      </td>
                    )}
                    <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-50/50">
                      {present}
                    </td>
                    <td className="text-center py-2 px-3 font-semibold text-red-700 bg-red-50/50">
                      {absent}
                    </td>
                    <td className="text-center py-2 px-3 font-semibold text-yellow-700 bg-yellow-50/50">
                      {late}
                    </td>
                    <td className="text-center py-2 px-3">
                      <Badge
                        variant={
                        pct >= 90 ? 'success' : pct >= 75 ? 'warning' : 'danger'
                        }>

                        {pct}%
                      </Badge>
                    </td>
                    <td className="text-center py-2 px-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                        setShowStudentDetails(
                          showStudentDetails === student.id ? null : student.id
                        )
                        }>

                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>);

              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="py-2 px-3 text-gray-700 sticky left-0 bg-gray-100">
                  Daily Totals
                </td>
                {days.map((d) => {
                  const presentCount = filteredStudents.filter(
                    (s) => s.attendance[d - 1] === 1
                  ).length;
                  const total = filteredStudents.length;
                  const sunday = isSunday(d, parseInt(selectedMonth), parseInt(selectedYear));
                  return (
                    <td
                      key={d}
                      className={`text-center py-2 px-1 text-xs ${
                      sunday ? 'bg-gray-200 text-gray-400' : 'text-gray-600'}`
                      }>

                      {sunday ? '-' : `${presentCount}/${total}`}
                    </td>);

                })}
                <td className="text-center py-2 px-3 text-green-700">
                  {filteredStudents.reduce(
                    (sum, s) => sum + s.attendance.filter((a) => a === 1).length,
                    0
                  )}
                </td>
                <td className="text-center py-2 px-3 text-red-700">
                  {filteredStudents.reduce(
                    (sum, s) => sum + s.attendance.filter((a) => a === 0).length,
                    0
                  )}
                </td>
                <td className="text-center py-2 px-3 text-yellow-700">
                  {filteredStudents.reduce(
                    (sum, s) => sum + s.attendance.filter((a) => a === 3).length,
                    0
                  )}
                </td>
                <td className="text-center py-2 px-3">
                  <Badge variant="info">{avgAttendance}%</Badge>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Student Details Modal/Drawer */}
        {showStudentDetails &&
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-gray-900">Student Attendance Details</h4>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStudentDetails(null)}>

                <XCircleIcon className="w-4 h-4" />
              </Button>
            </div>
            {(() => {
            const student = filteredStudents.find((s) => s.id === showStudentDetails);
            if (!student) return null;
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Student Name</p>
                    <p className="font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Roll No / Admission No</p>
                    <p className="font-medium text-gray-900">
                      {student.rollNo} / {student.admissionNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Father's Name</p>
                    <p className="font-medium text-gray-900">{student.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-medium text-gray-900">{student.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Present Days</p>
                    <p className="font-medium text-green-700">{student.presentDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Absent Days</p>
                    <p className="font-medium text-red-700">{student.absentDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Late Days</p>
                    <p className="font-medium text-yellow-700">{student.lateDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Attendance %</p>
                    <Badge
                    variant={
                    student.percentage >= 90 ?
                    'success' :
                    student.percentage >= 75 ?
                    'warning' :
                    'danger'
                    }>

                      {student.percentage}%
                    </Badge>
                  </div>
                </div>);

          })()}
          </div>
        }

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-100 inline-flex items-center justify-center text-green-700 text-xs font-bold">
              P
            </span>
            Present
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-100 inline-flex items-center justify-center text-red-700 text-xs font-bold">
              A
            </span>
            Absent
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-yellow-100 inline-flex items-center justify-center text-yellow-700 text-xs font-bold">
              L
            </span>
            Late
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 inline-flex items-center justify-center text-orange-700 text-xs font-bold">
              HD
            </span>
            Half Day
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-700 text-xs font-bold">
              LV
            </span>
            Leave
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-100 inline-flex items-center justify-center text-gray-400 text-xs font-bold">
              H
            </span>
            Holiday/Sunday
          </span>
        </div>
      </Card>

      {/* Monthly Summary by Week */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((week) => {
            const weekStart = (week - 1) * 7 + 1;
            const weekEnd = Math.min(week * 7, daysInMonth);
            const avgForWeek = 85 + Math.floor(Math.random() * 10);
            return (
              <div key={week} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Week {week}
                </p>
                <p className="text-xs text-gray-500">
                  Day {weekStart} - {weekEnd}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{avgForWeek}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                    avgForWeek >= 90 ?
                    'bg-green-500' :
                    avgForWeek >= 75 ?
                    'bg-yellow-500' :
                    'bg-red-500'}`
                    }
                    style={{ width: `${avgForWeek}%` }}>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </Card>

      {/* Students with Low Attendance Alert */}
      {belowThreshold > 0 &&
      <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Low Attendance Alert
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                The following students have attendance below 75% and may require attention:
              </p>
              <div className="space-y-2">
                {filteredStudents.
              filter((s) => s.percentage < 75).
              map((student) =>
              <div
                key={student.id}
                className="flex items-center justify-between p-2 bg-red-50 rounded-lg">

                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {student.rollNo}. {student.name}
                        </span>
                        <Badge variant="danger">{student.percentage}%</Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Contact: {student.contact}
                      </div>
                    </div>
              )}
              </div>
            </div>
          </div>
        </Card>
      }
    </div>);

}

// ── Yearly Register Tab ──
function YearlyRegister() {
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rollNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const months = [
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' },
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' }];


  // Working days per month
  const workingDays = [26, 25, 22, 26, 26, 23, 25, 24, 22, 26, 24, 26];
  const totalWorkingDays = workingDays.reduce((a, b) => a + b, 0);

  // Sample student data with yearly attendance
  const students: YearlyAttendanceData[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rollNo: '01',
    admissionNo: 'ADM2024001',
    fatherName: 'Ramesh Sharma',
    contact: '9876543210',
    monthlyPresent: [24, 22, 20, 23, 24, 21, 23, 22, 20, 24, 22, 23],
    monthlyWorking: workingDays,
    totalPresent: 268,
    totalWorking: totalWorkingDays,
    percentage: 87
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '02',
    admissionNo: 'ADM2024002',
    fatherName: 'Suresh Patel',
    contact: '9876543211',
    monthlyPresent: [25, 23, 21, 24, 25, 22, 24, 23, 21, 25, 23, 24],
    monthlyWorking: workingDays,
    totalPresent: 280,
    totalWorking: totalWorkingDays,
    percentage: 91
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '03',
    admissionNo: 'ADM2024003',
    fatherName: 'Vijay Kumar',
    contact: '9876543212',
    monthlyPresent: [22, 20, 18, 21, 22, 19, 21, 20, 18, 22, 20, 21],
    monthlyWorking: workingDays,
    totalPresent: 244,
    totalWorking: totalWorkingDays,
    percentage: 79
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNo: '04',
    admissionNo: 'ADM2024004',
    fatherName: 'Anil Gupta',
    contact: '9876543213',
    monthlyPresent: [25, 24, 22, 25, 25, 23, 25, 24, 22, 25, 24, 25],
    monthlyWorking: workingDays,
    totalPresent: 289,
    totalWorking: totalWorkingDays,
    percentage: 94
  },
  {
    id: '5',
    name: 'Ravi Singh',
    rollNo: '05',
    admissionNo: 'ADM2024005',
    fatherName: 'Mahendra Singh',
    contact: '9876543214',
    monthlyPresent: [23, 21, 19, 22, 23, 20, 22, 21, 19, 23, 21, 22],
    monthlyWorking: workingDays,
    totalPresent: 256,
    totalWorking: totalWorkingDays,
    percentage: 83
  },
  {
    id: '6',
    name: 'Anjali Verma',
    rollNo: '06',
    admissionNo: 'ADM2024006',
    fatherName: 'Rakesh Verma',
    contact: '9876543215',
    monthlyPresent: [26, 25, 22, 26, 26, 23, 25, 24, 22, 26, 24, 26],
    monthlyWorking: workingDays,
    totalPresent: 295,
    totalWorking: totalWorkingDays,
    percentage: 96
  },
  {
    id: '7',
    name: 'Vikram Yadav',
    rollNo: '07',
    admissionNo: 'ADM2024007',
    fatherName: 'Shyam Yadav',
    contact: '9876543216',
    monthlyPresent: [18, 16, 14, 17, 18, 15, 17, 16, 14, 18, 16, 17],
    monthlyWorking: workingDays,
    totalPresent: 196,
    totalWorking: totalWorkingDays,
    percentage: 64
  },
  {
    id: '8',
    name: 'Pooja Sharma',
    rollNo: '08',
    admissionNo: 'ADM2024008',
    fatherName: 'Dinesh Sharma',
    contact: '9876543217',
    monthlyPresent: [24, 23, 20, 24, 24, 21, 23, 22, 20, 24, 22, 24],
    monthlyWorking: workingDays,
    totalPresent: 271,
    totalWorking: totalWorkingDays,
    percentage: 88
  },
  {
    id: '9',
    name: 'Karan Mehta',
    rollNo: '09',
    admissionNo: 'ADM2024009',
    fatherName: 'Ajay Mehta',
    contact: '9876543218',
    monthlyPresent: [25, 24, 21, 25, 25, 22, 24, 23, 21, 25, 23, 25],
    monthlyWorking: workingDays,
    totalPresent: 283,
    totalWorking: totalWorkingDays,
    percentage: 92
  },
  {
    id: '10',
    name: 'Neha Joshi',
    rollNo: '10',
    admissionNo: 'ADM2024010',
    fatherName: 'Prakash Joshi',
    contact: '9876543219',
    monthlyPresent: [25, 24, 21, 25, 25, 22, 24, 23, 21, 25, 23, 25],
    monthlyWorking: workingDays,
    totalPresent: 283,
    totalWorking: totalWorkingDays,
    percentage: 92
  }];


  // Filter and sort students
  const filteredStudents = students.
  filter(
    (student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  ).
  sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'rollNo') {
      comparison = parseInt(a.rollNo) - parseInt(b.rollNo);
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'percentage') {
      comparison = a.percentage - b.percentage;
    } else if (sortBy === 'totalPresent') {
      comparison = a.totalPresent - b.totalPresent;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate summary statistics
  const totalStudents = students.length;
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
  );
  const belowThreshold = students.filter((s) => s.percentage < 75).length;
  const excellentAttendance = students.filter((s) => s.percentage >= 90).length;
  const goodAttendance = students.filter(
    (s) => s.percentage >= 75 && s.percentage < 90
  ).length;

  // Monthly class average
  const monthlyClassAverage = months.map((_, idx) => {
    const totalPresent = students.reduce((sum, s) => sum + s.monthlyPresent[idx], 0);
    return Math.round(totalPresent / (totalStudents * workingDays[idx]) * 100);
  });

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Handle load data
  const handleLoadData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filter Options
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedClass('10');
              setSelectedSection('A');
              setSelectedAcademicYear('2024-2025');
              setSearchTerm('');
            }}>

            <RefreshCwIcon className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
            { value: '1', label: 'Class 1' },
            { value: '2', label: 'Class 2' },
            { value: '3', label: 'Class 3' },
            { value: '4', label: 'Class 4' },
            { value: '5', label: 'Class 5' },
            { value: '6', label: 'Class 6' },
            { value: '7', label: 'Class 7' },
            { value: '8', label: 'Class 8' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            } />

          <Select
            label="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={[
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
            { value: 'D', label: 'Section D' }]
            } />

          <Select
            label="Academic Year"
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            options={[
            { value: '2024-2025', label: '2024-2025' },
            { value: '2023-2024', label: '2023-2024' },
            { value: '2022-2023', label: '2022-2023' },
            { value: '2021-2022', label: '2021-2022' }]
            } />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Student
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Roll, Adm No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleLoadData}
              disabled={isLoading}>

              {isLoading ?
              <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" /> :

              <FilterIcon className="w-4 h-4 mr-2" />
              }
              Load Register
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Working Days
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkingDays}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Avg Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgAttendance}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BarChart3Icon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Excellent (≥90%)
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">{excellentAttendance}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Good (75-89%)
              </p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{goodAttendance}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Below 75%
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">{belowThreshold}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Attendance Trend — Class {selectedClass}-{selectedSection}
          </h3>
          <div className="flex gap-2">
            <Button
              variant={showDetailedView ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowDetailedView(!showDetailedView)}>

              <PieChartIcon className="w-4 h-4 mr-2" />
              {showDetailedView ? 'Simple View' : 'Detailed View'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          {months.map((month, idx) =>
          <div key={month.short} className="text-center">
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500">{month.short}</p>
                <p className="text-lg font-bold text-gray-900">{monthlyClassAverage[idx]}%</p>
              </div>
              <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden">
                <div
                className={`absolute bottom-0 left-0 right-0 rounded-lg transition-all ${
                monthlyClassAverage[idx] >= 90 ?
                'bg-green-500' :
                monthlyClassAverage[idx] >= 75 ?
                'bg-yellow-500' :
                'bg-red-500'}`
                }
                style={{ height: `${monthlyClassAverage[idx]}%` }}>
              </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{workingDays[idx]} days</p>
            </div>
          )}
        </div>
      </Card>

      {/* Yearly Register Table */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Yearly Attendance Register — {selectedAcademicYear} · Class {selectedClass}-{selectedSection}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left py-2 px-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rollNo')}>

                  <div className="flex items-center gap-1">
                    Roll
                    {sortBy === 'rollNo' && (
                    sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />)
                    }
                  </div>
                </th>
                <th
                  className="text-left py-2 px-3 font-semibold text-gray-700 min-w-[150px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-1">
                    Student Name
                    {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />)
                    }
                  </div>
                </th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 min-w-[100px]">
                  Adm. No
                </th>
                {months.map((m) =>
                <th
                  key={m.short}
                  className="text-center py-2 px-2 font-medium text-gray-500">

                    {m.short}
                  </th>
                )}
                <th
                  className="text-center py-2 px-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalPresent')}>

                  <div className="flex items-center justify-center gap-1">
                    Total
                    {sortBy === 'totalPresent' && (
                    sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />)
                    }
                  </div>
                </th>
                <th
                  className="text-center py-2 px-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('percentage')}>

                  <div className="flex items-center justify-center gap-1">
                    %
                    {sortBy === 'percentage' && (
                    sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />)
                    }
                  </div>
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-center py-2 px-3 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-100">
                <td colSpan={3} className="py-1 px-3 text-xs font-medium text-gray-500">
                  Working Days →
                </td>
                {workingDays.map((d, i) =>
                <td key={i} className="text-center py-1 px-2 text-xs text-gray-500 font-medium">
                    {d}
                  </td>
                )}
                <td className="text-center py-1 px-3 text-xs font-semibold text-gray-700">
                  {totalWorkingDays}
                </td>
                <td colSpan={3}></td>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const totalPresent = student.monthlyPresent.reduce((a, b) => a + b, 0);
                const pct = Math.round(totalPresent / totalWorkingDays * 100);
                return (
                  <React.Fragment key={student.id}>
                    <tr
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`
                      }>

                      <td className="py-2 px-3 text-gray-600 font-medium">
                        {student.rollNo}
                      </td>
                      <td className="py-2 px-3">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">S/o {student.fatherName}</p>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-600 text-xs">
                        {student.admissionNo}
                      </td>
                      {student.monthlyPresent.map((days, i) => {
                        const monthPct = Math.round(days / workingDays[i] * 100);
                        return (
                          <td key={i} className="text-center py-2 px-2">
                            <div className="flex flex-col items-center">
                              <span
                                className={`text-sm font-medium ${
                                monthPct >= 90 ?
                                'text-green-700' :
                                monthPct >= 75 ?
                                'text-yellow-700' :
                                'text-red-700'}`
                                }>

                                {days}
                              </span>
                              {showDetailedView &&
                              <span className="text-xs text-gray-400">{monthPct}%</span>
                              }
                            </div>
                          </td>);

                      })}
                      <td className="text-center py-2 px-3 font-semibold text-gray-900">
                        {totalPresent}
                      </td>
                      <td className="text-center py-2 px-3">
                        <Badge
                          variant={
                          pct >= 90 ? 'success' : pct >= 75 ? 'warning' : 'danger'
                          }>

                          {pct}%
                        </Badge>
                      </td>
                      <td className="text-center py-2 px-3">
                        {pct >= 90 ?
                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                            <CheckCircleIcon className="w-4 h-4" />
                            Excellent
                          </span> :
                        pct >= 75 ?
                        <span className="inline-flex items-center gap-1 text-yellow-700 text-xs font-medium">
                            <ClockIcon className="w-4 h-4" />
                            Good
                          </span> :

                        <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium">
                            <AlertTriangleIcon className="w-4 h-4" />
                            Critical
                          </span>
                        }
                      </td>
                      <td className="text-center py-2 px-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          setSelectedStudentId(
                            selectedStudentId === student.id ? null : student.id
                          )
                          }>

                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                    {selectedStudentId === student.id &&
                    <tr className="bg-gray-50">
                        <td colSpan={17} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Student Name</p>
                              <p className="font-medium text-gray-900">{student.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Roll No / Adm No</p>
                              <p className="font-medium text-gray-900">
                                {student.rollNo} / {student.admissionNo}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Father's Name</p>
                              <p className="font-medium text-gray-900">{student.fatherName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Contact</p>
                              <p className="font-medium text-gray-900">{student.contact}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Present</p>
                              <p className="font-medium text-green-700">{totalPresent} / {totalWorkingDays}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Absent</p>
                              <p className="font-medium text-red-700">{totalWorkingDays - totalPresent}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Monthly Progress</p>
                            <div className="flex gap-2">
                              {student.monthlyPresent.map((days, i) => {
                              const monthPct = Math.round(days / workingDays[i] * 100);
                              return (
                                <div
                                  key={i}
                                  className="flex-1 h-8 bg-gray-200 rounded relative overflow-hidden"
                                  title={`${months[i].full}: ${monthPct}%`}>

                                    <div
                                    className={`absolute bottom-0 left-0 right-0 ${
                                    monthPct >= 90 ?
                                    'bg-green-500' :
                                    monthPct >= 75 ?
                                    'bg-yellow-500' :
                                    'bg-red-500'}`
                                    }
                                    style={{ height: `${monthPct}%` }}>
                                  </div>
                                  </div>);

                            })}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {months.map((m) =>
                            <div key={m.short} className="flex-1 text-center text-xs text-gray-500">
                                  {m.short}
                                </div>
                            )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  </React.Fragment>);

              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="py-2 px-3 text-gray-700">
                  Class Totals / Average
                </td>
                {months.map((_, i) => {
                  const totalMonthPresent = filteredStudents.reduce(
                    (sum, s) => sum + s.monthlyPresent[i],
                    0
                  );
                  const avgMonthPresent = Math.round(totalMonthPresent / filteredStudents.length);
                  return (
                    <td key={i} className="text-center py-2 px-2 text-gray-600">
                      {avgMonthPresent}
                    </td>);

                })}
                <td className="text-center py-2 px-3 text-gray-700">
                  {Math.round(
                    filteredStudents.reduce((sum, s) => sum + s.totalPresent, 0) /
                    filteredStudents.length
                  )}
                </td>
                <td className="text-center py-2 px-3">
                  <Badge variant="info">{avgAttendance}%</Badge>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Attendance Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Excellent (≥90%)</span>
                <span className="text-sm font-semibold text-green-700">{excellentAttendance} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${excellentAttendance / totalStudents * 100}%` }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Good (75-89%)</span>
                <span className="text-sm font-semibold text-yellow-700">{goodAttendance} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{ width: `${goodAttendance / totalStudents * 100}%` }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Critical (&lt;75%)</span>
                <span className="text-sm font-semibold text-red-700">{belowThreshold} students</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${belowThreshold / totalStudents * 100}%` }}>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quarter-wise Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
            { name: 'Q1 (Apr-Jun)', months: [0, 1, 2] },
            { name: 'Q2 (Jul-Sep)', months: [3, 4, 5] },
            { name: 'Q3 (Oct-Dec)', months: [6, 7, 8] },
            { name: 'Q4 (Jan-Mar)', months: [9, 10, 11] }].
            map((quarter) => {
              const quarterWorkingDays = quarter.months.reduce(
                (sum, i) => sum + workingDays[i],
                0
              );
              const quarterAvg = Math.round(
                quarter.months.reduce((sum, i) => sum + monthlyClassAverage[i], 0) /
                quarter.months.length
              );
              return (
                <div key={quarter.name} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">{quarter.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{quarterAvg}%</p>
                  <p className="text-xs text-gray-500">{quarterWorkingDays} working days</p>
                </div>);

            })}
          </div>
        </Card>
      </div>

      {/* Students with Low Attendance Alert */}
      {belowThreshold > 0 &&
      <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Annual Low Attendance Alert — Students Below 75%
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                These students have annual attendance below the required minimum of 75% and may face academic consequences:
              </p>
              <div className="space-y-2">
                {filteredStudents.
              filter((s) => s.percentage < 75).
              map((student) =>
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg">

                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                          <UserIcon className="w-4 h-4 text-red-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.rollNo}. {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Adm: {student.admissionNo} | Contact: {student.contact}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-700">
                            {student.totalPresent} / {student.totalWorking} days
                          </p>
                          <p className="text-xs text-gray-500">
                            Shortage: {Math.ceil(student.totalWorking * 0.75) - student.totalPresent} days
                          </p>
                        </div>
                        <Badge variant="danger">{student.percentage}%</Badge>
                      </div>
                    </div>
              )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Notice
                </Button>
                <Button variant="outline" size="sm">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Top Performers */}
      <Card className="p-4 border-l-4 border-l-green-500">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              Top Attendance Performers — 95% and Above
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Students with excellent attendance record throughout the year:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {filteredStudents.
              filter((s) => s.percentage >= 95).
              sort((a, b) => b.percentage - a.percentage).
              map((student, idx) =>
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg">

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-green-700 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">Roll: {student.rollNo}</p>
                      </div>
                    </div>
                    <Badge variant="success">{student.percentage}%</Badge>
                  </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>);

}

// ── Main Combined Component ──
export function AttendanceRegisterCombined() {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpenIcon className="w-7 h-7" />
            Attendance Registers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage monthly and yearly attendance registers for all classes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Today: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'monthly' ? <MonthlyRegister /> : <YearlyRegister />}
      </div>
    </div>);

}

export default AttendanceRegisterCombined;