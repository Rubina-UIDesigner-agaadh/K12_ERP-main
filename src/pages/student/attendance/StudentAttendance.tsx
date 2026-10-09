import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  UserSearch,
  Building2,
  GraduationCap,
  Hash,
  IdCard,
  BookOpen,
  Users } from
'lucide-react';

interface SearchFilters {
  firstName: string;
  lastName: string;
  grNo: string;
  suId: string;
  rollNo: string;
  class: string;
  section: string;
  department: string;
}

interface AttendanceRecord {
  date: string;
  day: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  time: string;
  subject?: string;
}

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  grNo: string;
  suId: string;
  rollNo: string;
  class: string;
  section: string;
  department: string;
  email: string;
  phone: string;
  parentPhone: string;
  address: string;
  attendancePercentage: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  photo?: string;
}

const initialFilters: SearchFilters = {
  firstName: '',
  lastName: '',
  grNo: '',
  suId: '',
  rollNo: '',
  class: '',
  section: '',
  department: ''
};

const classOptions = [
{ value: '', label: 'All Classes' },
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
{ value: '12', label: 'Class 12' }];


const sectionOptions = [
{ value: '', label: 'All Sections' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' },
{ value: 'E', label: 'Section E' }];


const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'science', label: 'Science' },
{ value: 'commerce', label: 'Commerce' },
{ value: 'arts', label: 'Arts' },
{ value: 'computer', label: 'Computer Science' },
{ value: 'medical', label: 'Medical' },
{ value: 'engineering', label: 'Engineering' }];


const monthOptions = [
{ value: '01', label: 'January' },
{ value: '02', label: 'February' },
{ value: '03', label: 'March' },
{ value: '04', label: 'April' },
{ value: '05', label: 'May' },
{ value: '06', label: 'June' },
{ value: '07', label: 'July' },
{ value: '08', label: 'August' },
{ value: '09', label: 'September' },
{ value: '10', label: 'October' },
{ value: '11', label: 'November' },
{ value: '12', label: 'December' }];


const yearOptions = [
{ value: '2024', label: '2024' },
{ value: '2023', label: '2023' },
{ value: '2022', label: '2022' }];


export function StudentAttendance() {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [studentFound, setStudentFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock student data
  const [studentData] = useState<StudentData>({
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    grNo: 'GR-2020-001',
    suId: 'SU-12345',
    rollNo: '15',
    class: '10',
    section: 'A',
    department: 'Science',
    email: 'rahul.sharma@school.edu',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 43211',
    address: '123 Main Street, City, State 12345',
    attendancePercentage: 85,
    totalPresent: 180,
    totalAbsent: 32,
    totalLate: 8,
    totalExcused: 5
  });

  const attendanceHistory: AttendanceRecord[] = [
  {
    date: '2024-03-15',
    day: 'Friday',
    status: 'Present',
    time: '08:15 AM',
    subject: 'All Classes'
  },
  {
    date: '2024-03-14',
    day: 'Thursday',
    status: 'Present',
    time: '08:10 AM',
    subject: 'All Classes'
  },
  {
    date: '2024-03-13',
    day: 'Wednesday',
    status: 'Absent',
    time: '-',
    subject: 'All Classes'
  },
  {
    date: '2024-03-12',
    day: 'Tuesday',
    status: 'Late',
    time: '08:45 AM',
    subject: 'All Classes'
  },
  {
    date: '2024-03-11',
    day: 'Monday',
    status: 'Present',
    time: '08:05 AM',
    subject: 'All Classes'
  },
  {
    date: '2024-03-08',
    day: 'Friday',
    status: 'Excused',
    time: '-',
    subject: 'Medical Leave'
  },
  {
    date: '2024-03-07',
    day: 'Thursday',
    status: 'Present',
    time: '08:12 AM',
    subject: 'All Classes'
  },
  {
    date: '2024-03-06',
    day: 'Wednesday',
    status: 'Present',
    time: '08:08 AM',
    subject: 'All Classes'
  }];


  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setStudentFound(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setStudentFound(true);
      setIsSearching(false);
    }, 1000);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== '').length;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Late':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Excused':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100';
      case 'Absent':
        return 'bg-red-100';
      case 'Late':
        return 'bg-yellow-100';
      case 'Excused':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'danger';
      case 'Late':
        return 'warning';
      case 'Excused':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Attendance
          </h1>
          <p className="text-gray-500 mt-1">
            Search and view individual student attendance details
          </p>
        </div>
        {studentFound &&
        <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
            <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
          </div>
        }
      </div>

      {/* Search Filters Card */}
      <Card>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Search Student
              </h2>
              {getActiveFiltersCount() > 0 &&
              <Badge variant="info">{getActiveFiltersCount()} filters</Badge>
              }
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                rightIcon={
                showAdvancedFilters ?
                <ChevronUp className="w-4 h-4" /> :

                <ChevronDown className="w-4 h-4" />

                }>

                <Filter className="w-4 h-4 mr-1" />
                {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={filters.firstName}
              onChange={(e) => handleFilterChange('firstName', e.target.value)}
              leftIcon={<User className="w-4 h-4 text-gray-400" />} />

            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={filters.lastName}
              onChange={(e) => handleFilterChange('lastName', e.target.value)}
              leftIcon={<User className="w-4 h-4 text-gray-400" />} />

            <Input
              label="GR Number"
              placeholder="Enter GR number"
              value={filters.grNo}
              onChange={(e) => handleFilterChange('grNo', e.target.value)}
              leftIcon={<Hash className="w-4 h-4 text-gray-400" />} />

            <Input
              label="SU ID"
              placeholder="Enter SU ID"
              value={filters.suId}
              onChange={(e) => handleFilterChange('suId', e.target.value)}
              leftIcon={<IdCard className="w-4 h-4 text-gray-400" />} />

          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters &&
          <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                label="Roll Number"
                placeholder="Enter roll number"
                value={filters.rollNo}
                onChange={(e) => handleFilterChange('rollNo', e.target.value)}
                leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />} />

                <Select
                label="Class"
                options={classOptions}
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)} />

                <Select
                label="Section"
                options={sectionOptions}
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)} />

                <Select
                label="Department"
                options={departmentOptions}
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)} />

              </div>
            </div>
          }

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              leftIcon={
              isSearching ?
              <RefreshCw className="w-4 h-4 animate-spin" /> :

              <Search className="w-4 h-4" />

              }
              className="flex-1 sm:flex-none">

              {isSearching ? 'Searching...' : 'Search Student'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              leftIcon={<X className="w-4 h-4" />}
              className="flex-1 sm:flex-none">

              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {studentFound ?
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Profile Card */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">
                      {studentData.firstName} {studentData.lastName}
                    </h3>
                    <p className="text-blue-100">
                      Class {studentData.class}-{studentData.section}
                    </p>
                    <p className="text-blue-100 text-sm">
                      {studentData.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      GR Number
                    </p>
                    <p className="font-medium text-gray-900">{studentData.grNo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      SU ID
                    </p>
                    <p className="font-medium text-gray-900">{studentData.suId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </p>
                    <p className="font-medium text-gray-900">{studentData.rollNo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Section
                    </p>
                    <p className="font-medium text-gray-900">{studentData.section}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Contact Information
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{studentData.email}</p>
                    <p className="text-gray-600">{studentData.phone}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Overall Attendance Stats */}
            <Card title="Overall Attendance">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none" />

                      <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={
                      studentData.attendancePercentage >= 75 ?
                      '#10b981' :
                      studentData.attendancePercentage >= 50 ?
                      '#f59e0b' :
                      '#ef4444'
                      }
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${studentData.attendancePercentage / 100 * 352} 352`}
                      strokeLinecap="round" />

                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {studentData.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-xl font-bold text-green-600">
                      {studentData.totalPresent}
                    </p>
                    <p className="text-xs text-gray-500">Present</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-xl font-bold text-red-600">
                      {studentData.totalAbsent}
                    </p>
                    <p className="text-xs text-gray-500">Absent</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-xl font-bold text-yellow-600">
                      {studentData.totalLate}
                    </p>
                    <p className="text-xs text-gray-500">Late</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-xl font-bold text-blue-600">
                      {studentData.totalExcused}
                    </p>
                    <p className="text-xs text-gray-500">Excused</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Month/Year Filter */}
            <Card>
              <div className="p-4 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Select
                  label="Month"
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)} />

                </div>
                <div className="flex-1">
                  <Select
                  label="Year"
                  options={yearOptions}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)} />

                </div>
                <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
                  Apply Filter
                </Button>
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card title="Monthly Summary - March 2024">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">22</p>
                  <p className="text-sm text-gray-500">Working Days</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-sm text-gray-500">Present</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-500">Absent</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-500">Late</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-500">Excused</p>
                </div>
              </div>
            </Card>

            {/* Attendance Calendar View */}
            <Card title="Attendance Calendar">
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
              <div key={day} className="p-2 font-medium text-gray-500">
                    {day}
                  </div>
              )}
                {/* Empty cells for offset */}
                {[...Array(5)].map((_, i) =>
              <div key={`empty-${i}`} className="p-2" />
              )}
                {/* Calendar days */}
                {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isWeekend = (day + 4) % 7 === 0 || (day + 4) % 7 === 6;
                const isPresent = !isWeekend && Math.random() > 0.2;
                const isAbsent = !isWeekend && !isPresent && Math.random() > 0.5;
                const isLate = !isWeekend && !isPresent && !isAbsent;

                return (
                  <div
                    key={day}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isWeekend ?
                    'bg-gray-100 text-gray-400' :
                    isPresent ?
                    'bg-green-100 text-green-700 hover:bg-green-200' :
                    isAbsent ?
                    'bg-red-100 text-red-700 hover:bg-red-200' :
                    isLate ?
                    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                    'bg-gray-50 hover:bg-gray-100'}`
                    }
                    title={
                    isWeekend ?
                    'Weekend' :
                    isPresent ?
                    'Present' :
                    isAbsent ?
                    'Absent' :
                    'Late'
                    }>

                      {day}
                    </div>);

              })}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100" />
                  <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100" />
                  <span className="text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-100" />
                  <span className="text-gray-600">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100" />
                  <span className="text-gray-600">Excused</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100" />
                  <span className="text-gray-600">Weekend/Holiday</span>
                </div>
              </div>
            </Card>

            {/* Recent Attendance History */}
            <Card title="Recent Attendance History">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Day
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record, index) =>
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBgColor(record.status)}`}>

                              {getStatusIcon(record.status)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {record.date}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{record.day}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadgeVariant(record.status) as any}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{record.time}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {record.subject}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <Button variant="outline" size="sm">
                  Load More Records
                </Button>
              </div>
            </Card>
          </div>
        </div> : (

      /* Empty State */
      <Card className="py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Student Selected
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Use the search filters above to find a student and view their
              attendance details. You can search by name, GR number, SU ID, roll
              number, or filter by class and section.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Search by Name</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="w-4 h-4" />
                <span>Search by GR No</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <IdCard className="w-4 h-4" />
                <span>Search by SU ID</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <GraduationCap className="w-4 h-4" />
                <span>Filter by Class</span>
              </div>
            </div>
          </div>
        </Card>)
      }
    </div>);

}