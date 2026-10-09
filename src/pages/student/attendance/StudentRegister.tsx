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
  FileSpreadsheet } from
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

export function StudentRegister() {
  // Filter States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [grNo, setGrNo] = useState('');
  const [suId, setSuId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
              Monthly attendance view with detailed filters
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
    </div>);

}