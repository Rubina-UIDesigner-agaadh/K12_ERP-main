import React, { useState } from 'react';
import { Tabs } from '../../../components/ui/Tabs';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
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
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  FileTextIcon,
  SearchIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  Loader2Icon,
  CheckIcon,
  InfoIcon } from
'lucide-react';

// ── Types ──
interface Student {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  contact: string;
  address: string;
  category: string;
  gender: string;
}

interface MonthlyAttendanceData extends Student {
  attendance: number[]; // 1=present, 0=absent, 2=holiday, 3=late, 4=half-day, 5=leave
}

interface YearlyAttendanceData extends Student {
  monthlyPresent: number[];
  monthlyAbsent: number[];
  monthlyWorking: number[];
}

// ── Monthly Register Tab ──
function MonthlyRegister() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [registerFormat, setRegisterFormat] = useState('detailed');
  const [includeRemarks, setIncludeRemarks] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get days in selected month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = selectedMonth && selectedYear ?
  getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear)) :
  31;
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

  // Sample student data
  const students: MonthlyAttendanceData[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rollNo: '01',
    admissionNo: 'ADM2024001',
    fatherName: 'Ramesh Sharma',
    motherName: 'Sunita Sharma',
    contact: '9876543210',
    address: '123, Main Street, City',
    category: 'General',
    gender: 'Male',
    attendance: [1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 3, 0, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1]
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '02',
    admissionNo: 'ADM2024002',
    fatherName: 'Suresh Patel',
    motherName: 'Kavita Patel',
    contact: '9876543211',
    address: '456, Park Avenue, City',
    category: 'OBC',
    gender: 'Female',
    attendance: [1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1]
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '03',
    admissionNo: 'ADM2024003',
    fatherName: 'Vijay Kumar',
    motherName: 'Meena Kumar',
    contact: '9876543212',
    address: '789, Lake View, City',
    category: 'SC',
    gender: 'Male',
    attendance: [1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1]
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNo: '04',
    admissionNo: 'ADM2024004',
    fatherName: 'Anil Gupta',
    motherName: 'Rekha Gupta',
    contact: '9876543213',
    address: '321, Hill Road, City',
    category: 'General',
    gender: 'Female',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1]
  },
  {
    id: '5',
    name: 'Ravi Singh',
    rollNo: '05',
    admissionNo: 'ADM2024005',
    fatherName: 'Mahendra Singh',
    motherName: 'Saroj Singh',
    contact: '9876543214',
    address: '567, Garden Colony, City',
    category: 'General',
    gender: 'Male',
    attendance: [1, 1, 1, 1, 0, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0]
  },
  {
    id: '6',
    name: 'Anjali Verma',
    rollNo: '06',
    admissionNo: 'ADM2024006',
    fatherName: 'Rakesh Verma',
    motherName: 'Asha Verma',
    contact: '9876543215',
    address: '890, River Side, City',
    category: 'OBC',
    gender: 'Female',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]
  },
  {
    id: '7',
    name: 'Vikram Yadav',
    rollNo: '07',
    admissionNo: 'ADM2024007',
    fatherName: 'Shyam Yadav',
    motherName: 'Kamla Yadav',
    contact: '9876543216',
    address: '234, Temple Road, City',
    category: 'OBC',
    gender: 'Male',
    attendance: [1, 1, 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 0, 2, 1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 2, 0, 1, 1]
  },
  {
    id: '8',
    name: 'Pooja Sharma',
    rollNo: '08',
    admissionNo: 'ADM2024008',
    fatherName: 'Dinesh Sharma',
    motherName: 'Geeta Sharma',
    contact: '9876543217',
    address: '678, Market Street, City',
    category: 'General',
    gender: 'Female',
    attendance: [1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1]
  },
  {
    id: '9',
    name: 'Karan Mehta',
    rollNo: '09',
    admissionNo: 'ADM2024009',
    fatherName: 'Ajay Mehta',
    motherName: 'Neha Mehta',
    contact: '9876543218',
    address: '901, College Road, City',
    category: 'General',
    gender: 'Male',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 1]
  },
  {
    id: '10',
    name: 'Neha Joshi',
    rollNo: '10',
    admissionNo: 'ADM2024010',
    fatherName: 'Prakash Joshi',
    motherName: 'Suman Joshi',
    contact: '9876543219',
    address: '345, Station Road, City',
    category: 'ST',
    gender: 'Female',
    attendance: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1]
  }];


  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const calculateTotals = (attendance: number[]) => {
    const present = attendance.slice(0, daysInMonth).filter((a) => a === 1).length;
    const absent = attendance.slice(0, daysInMonth).filter((a) => a === 0).length;
    const late = attendance.slice(0, daysInMonth).filter((a) => a === 3).length;
    const halfDay = attendance.slice(0, daysInMonth).filter((a) => a === 4).length;
    const leave = attendance.slice(0, daysInMonth).filter((a) => a === 5).length;
    const holidays = attendance.slice(0, daysInMonth).filter((a) => a === 2).length;
    const workingDays = daysInMonth - holidays;
    const percentage = workingDays > 0 ? Math.round(present / workingDays * 100) : 0;
    return { present, absent, late, halfDay, leave, holidays, workingDays, percentage };
  };

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

  // Handle generate register
  const handleGenerateRegister = () => {
    if (!selectedClass || !selectedSection || !selectedMonth || !selectedYear) {
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedMonth('');
    setSelectedYear('');
    setIsGenerated(false);
    setSearchTerm('');
  };

  // Check if form is valid
  const isFormValid = selectedClass && selectedSection && selectedMonth && selectedYear;

  // Calculate class totals
  const classTotals = filteredStudents.reduce(
    (acc, student) => {
      const totals = calculateTotals(student.attendance);
      return {
        present: acc.present + totals.present,
        absent: acc.absent + totals.absent,
        late: acc.late + totals.late,
        workingDays: totals.workingDays // Same for all
      };
    },
    { present: 0, absent: 0, late: 0, workingDays: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Register Generation Form */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Generate Monthly Attendance Register
          </h3>
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 1: Select Class and Section
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Class *"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                { value: '', label: '-- Select Class --' },
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
                label="Select Section *"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={[
                { value: '', label: '-- Select Section --' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
                { value: 'D', label: 'Section D' }]
                } />

            </div>
          </div>

          {/* Step 2: Month and Year Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 2: Select Month and Year for Register
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Month *"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                options={[
                { value: '', label: '-- Select Month --' },
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
                label="Select Year *"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={[
                { value: '', label: '-- Select Year --' },
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' },
                { value: '2021', label: '2021' }]
                } />

            </div>
          </div>

          {/* Step 3: Register Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 3: Register Options
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Register Format"
                value={registerFormat}
                onChange={(e) => setRegisterFormat(e.target.value)}
                options={[
                { value: 'detailed', label: 'Detailed (with all columns)' },
                { value: 'compact', label: 'Compact (attendance only)' },
                { value: 'summary', label: 'Summary (totals only)' }]
                } />

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRemarks}
                    onChange={(e) => setIncludeRemarks(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="text-sm text-gray-700">Include Remarks Column</span>
                </label>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignature}
                    onChange={(e) => setIncludeSignature(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="text-sm text-gray-700">Include Signature Section</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleGenerateRegister}
              disabled={!isFormValid || isGenerating}>

              {isGenerating ?
              <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Generating Register...
                </> :

              <>
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Generate Register
                </>
              }
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {!isFormValid &&
            <p className="text-sm text-gray-500 flex items-center gap-1">
                <InfoIcon className="w-4 h-4" />
                Please fill all required fields to generate register
              </p>
            }
          </div>
        </div>
      </Card>

      {/* Generated Register */}
      {isGenerated &&
      <>
          {/* Register Header and Actions */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Attendance Register Generated Successfully
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {getMonthName(selectedMonth)} {selectedYear} · Class {selectedClass}-{selectedSection} · {filteredStudents.length} Students
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Register
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search by name, roll no, or admission no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>
          </Card>

          {/* Register Document */}
          <Card className="p-6 print:p-4" id="monthly-register">
            {/* Register Header - Official Format */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                Monthly Attendance Register
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                (As per School Records)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div className="text-left">
                  <span className="font-medium text-gray-700">Class: </span>
                  <span className="text-gray-900">{selectedClass}-{selectedSection}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Month/Year: </span>
                  <span className="text-gray-900">{getMonthName(selectedMonth)} {selectedYear}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Total Students: </span>
                  <span className="text-gray-900">{filteredStudents.length}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Working Days: </span>
                  <span className="text-gray-900">{classTotals.workingDays}</span>
                </div>
              </div>
            </div>

            {/* Register Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 sticky left-0 bg-gray-100 z-10 min-w-[40px]">
                      Roll
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 sticky left-10 bg-gray-100 z-10 min-w-[140px]">
                      Student Name
                    </th>
                    {registerFormat === 'detailed' &&
                  <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[100px]">
                        Adm. No
                      </th>
                  }
                    {days.map((d) => {
                    const month = parseInt(selectedMonth);
                    const year = parseInt(selectedYear);
                    const dayName = getDayName(d, month, year);
                    const sunday = isSunday(d, month, year);
                    return (
                      <th
                        key={d}
                        className={`text-center py-1 px-1 font-medium border-r border-gray-300 min-w-[28px] ${
                        sunday ? 'bg-gray-200 text-gray-400' : 'text-gray-600'}`
                        }>

                          <div className="flex flex-col items-center leading-tight">
                            <span className="text-xs">{dayName}</span>
                            <span className="text-xs">{d}</span>
                          </div>
                        </th>);

                  })}
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-green-50 min-w-[35px]">
                      P
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-red-50 min-w-[35px]">
                      A
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[45px]">
                      %
                    </th>
                    {includeRemarks &&
                  <th className="text-center py-2 px-2 font-semibold text-gray-700 min-w-[100px]">
                        Remarks
                      </th>
                  }
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                  const totals = calculateTotals(student.attendance);
                  return (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`
                      }>

                        <td className="py-2 px-2 text-gray-700 border-r border-gray-200 sticky left-0 bg-inherit font-medium text-center">
                          {student.rollNo}
                        </td>
                        <td className="py-2 px-2 border-r border-gray-200 sticky left-10 bg-inherit">
                          <p className="font-medium text-gray-900 text-xs">{student.name}</p>
                          {registerFormat === 'detailed' &&
                        <p className="text-xs text-gray-500">S/o {student.fatherName}</p>
                        }
                        </td>
                        {registerFormat === 'detailed' &&
                      <td className="py-2 px-2 text-gray-600 text-xs border-r border-gray-200">
                            {student.admissionNo}
                          </td>
                      }
                        {student.attendance.slice(0, daysInMonth).map((a, i) =>
                      <td
                        key={i}
                        className={`text-center py-1 px-0.5 border-r border-gray-200 ${
                        isSunday(i + 1, parseInt(selectedMonth), parseInt(selectedYear)) ?
                        'bg-gray-100' :
                        ''}`
                        }>

                            {getStatusIcon(a, i + 1)}
                          </td>
                      )}
                        <td className="text-center py-2 px-2 font-semibold text-green-700 bg-green-50/50 border-r border-gray-200">
                          {totals.present}
                        </td>
                        <td className="text-center py-2 px-2 font-semibold text-red-700 bg-red-50/50 border-r border-gray-200">
                          {totals.absent}
                        </td>
                        <td className="text-center py-2 px-2 border-r border-gray-200">
                          <Badge
                          variant={
                          totals.percentage >= 90 ?
                          'success' :
                          totals.percentage >= 75 ?
                          'warning' :
                          'danger'
                          }>

                            {totals.percentage}%
                          </Badge>
                        </td>
                        {includeRemarks &&
                      <td className="py-2 px-2 text-gray-500 text-xs">
                            {totals.percentage < 75 &&
                        <span className="text-red-600">Low Attendance</span>
                        }
                          </td>
                      }
                      </tr>);

                })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                    <td
                    colSpan={registerFormat === 'detailed' ? 3 : 2}
                    className="py-2 px-2 text-gray-700 border-r border-gray-300 sticky left-0 bg-gray-100">

                      Daily Present Count
                    </td>
                    {days.map((d) => {
                    const presentCount = filteredStudents.filter(
                      (s) => s.attendance[d - 1] === 1
                    ).length;
                    const sunday = isSunday(d, parseInt(selectedMonth), parseInt(selectedYear));
                    return (
                      <td
                        key={d}
                        className={`text-center py-2 px-1 text-xs border-r border-gray-200 ${
                        sunday ? 'bg-gray-200 text-gray-400' : 'text-gray-700'}`
                        }>

                          {sunday ? '-' : presentCount}
                        </td>);

                  })}
                    <td className="text-center py-2 px-2 text-green-700 border-r border-gray-200">
                      {classTotals.present}
                    </td>
                    <td className="text-center py-2 px-2 text-red-700 border-r border-gray-200">
                      {classTotals.absent}
                    </td>
                    <td className="text-center py-2 px-2 border-r border-gray-200">
                      <Badge variant="info">
                        {Math.round(classTotals.present / (classTotals.present + classTotals.absent) * 100)}%
                      </Badge>
                    </td>
                    {includeRemarks && <td></td>}
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-green-100 inline-flex items-center justify-center text-green-700 text-xs font-bold">
                  P
                </span>
                Present
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-red-100 inline-flex items-center justify-center text-red-700 text-xs font-bold">
                  A
                </span>
                Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-yellow-100 inline-flex items-center justify-center text-yellow-700 text-xs font-bold">
                  L
                </span>
                Late
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-orange-100 inline-flex items-center justify-center text-orange-700 text-xs font-bold">
                  HD
                </span>
                Half Day
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-blue-100 inline-flex items-center justify-center text-blue-700 text-xs font-bold">
                  LV
                </span>
                Leave
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-gray-100 inline-flex items-center justify-center text-gray-400 text-xs font-bold">
                  H
                </span>
                Holiday/Sunday
              </span>
            </div>

            {/* Signature Section */}
            {includeSignature &&
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Class Teacher</p>
                    <p className="text-xs text-gray-500">Signature with Date</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Head of Department</p>
                    <p className="text-xs text-gray-500">Signature with Date</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Principal</p>
                    <p className="text-xs text-gray-500">Signature with Date & Seal</p>
                  </div>
                </div>
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="mt-1">This is a computer generated document. Please verify and sign for authentication.</p>
                </div>
              </div>
          }
          </Card>

          {/* Low Attendance Students */}
          {filteredStudents.filter((s) => calculateTotals(s.attendance).percentage < 75).length > 0 &&
        <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Students with Attendance Below 75%
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    The following students require attention due to low attendance:
                  </p>
                  <div className="space-y-2">
                    {filteredStudents.
                filter((s) => calculateTotals(s.attendance).percentage < 75).
                map((student) => {
                  const totals = calculateTotals(student.attendance);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-lg">

                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {student.rollNo}. {student.name}
                              </span>
                              <Badge variant="danger">{totals.percentage}%</Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              Present: {totals.present} | Absent: {totals.absent}
                            </div>
                          </div>);

                })}
                  </div>
                </div>
              </div>
            </Card>
        }
        </>
      }
    </div>);

}

// ── Yearly Register Tab ──
function YearlyRegister() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [registerFormat, setRegisterFormat] = useState('detailed');
  const [includeQuarterly, setIncludeQuarterly] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const months = [
  { short: 'Apr', full: 'April', index: 0 },
  { short: 'May', full: 'May', index: 1 },
  { short: 'Jun', full: 'June', index: 2 },
  { short: 'Jul', full: 'July', index: 3 },
  { short: 'Aug', full: 'August', index: 4 },
  { short: 'Sep', full: 'September', index: 5 },
  { short: 'Oct', full: 'October', index: 6 },
  { short: 'Nov', full: 'November', index: 7 },
  { short: 'Dec', full: 'December', index: 8 },
  { short: 'Jan', full: 'January', index: 9 },
  { short: 'Feb', full: 'February', index: 10 },
  { short: 'Mar', full: 'March', index: 11 }];


  // Working days per month
  const workingDays = [26, 25, 22, 26, 26, 23, 25, 24, 22, 26, 24, 26];
  const totalWorkingDays = workingDays.reduce((a, b) => a + b, 0);

  // Sample student data
  const students: YearlyAttendanceData[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rollNo: '01',
    admissionNo: 'ADM2024001',
    fatherName: 'Ramesh Sharma',
    motherName: 'Sunita Sharma',
    contact: '9876543210',
    address: '123, Main Street, City',
    category: 'General',
    gender: 'Male',
    monthlyPresent: [24, 22, 20, 23, 24, 21, 23, 22, 20, 24, 22, 23],
    monthlyAbsent: [2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3],
    monthlyWorking: workingDays
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '02',
    admissionNo: 'ADM2024002',
    fatherName: 'Suresh Patel',
    motherName: 'Kavita Patel',
    contact: '9876543211',
    address: '456, Park Avenue, City',
    category: 'OBC',
    gender: 'Female',
    monthlyPresent: [25, 23, 21, 24, 25, 22, 24, 23, 21, 25, 23, 24],
    monthlyAbsent: [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    monthlyWorking: workingDays
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '03',
    admissionNo: 'ADM2024003',
    fatherName: 'Vijay Kumar',
    motherName: 'Meena Kumar',
    contact: '9876543212',
    address: '789, Lake View, City',
    category: 'SC',
    gender: 'Male',
    monthlyPresent: [22, 20, 18, 21, 22, 19, 21, 20, 18, 22, 20, 21],
    monthlyAbsent: [4, 5, 4, 5, 4, 4, 4, 4, 4, 4, 4, 5],
    monthlyWorking: workingDays
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNo: '04',
    admissionNo: 'ADM2024004',
    fatherName: 'Anil Gupta',
    motherName: 'Rekha Gupta',
    contact: '9876543213',
    address: '321, Hill Road, City',
    category: 'General',
    gender: 'Female',
    monthlyPresent: [25, 24, 22, 25, 25, 23, 25, 24, 22, 25, 24, 25],
    monthlyAbsent: [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1],
    monthlyWorking: workingDays
  },
  {
    id: '5',
    name: 'Ravi Singh',
    rollNo: '05',
    admissionNo: 'ADM2024005',
    fatherName: 'Mahendra Singh',
    motherName: 'Saroj Singh',
    contact: '9876543214',
    address: '567, Garden Colony, City',
    category: 'General',
    gender: 'Male',
    monthlyPresent: [23, 21, 19, 22, 23, 20, 22, 21, 19, 23, 21, 22],
    monthlyAbsent: [3, 4, 3, 4, 3, 3, 3, 3, 3, 3, 3, 4],
    monthlyWorking: workingDays
  },
  {
    id: '6',
    name: 'Anjali Verma',
    rollNo: '06',
    admissionNo: 'ADM2024006',
    fatherName: 'Rakesh Verma',
    motherName: 'Asha Verma',
    contact: '9876543215',
    address: '890, River Side, City',
    category: 'OBC',
    gender: 'Female',
    monthlyPresent: [26, 25, 22, 26, 26, 23, 25, 24, 22, 26, 24, 26],
    monthlyAbsent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyWorking: workingDays
  },
  {
    id: '7',
    name: 'Vikram Yadav',
    rollNo: '07',
    admissionNo: 'ADM2024007',
    fatherName: 'Shyam Yadav',
    motherName: 'Kamla Yadav',
    contact: '9876543216',
    address: '234, Temple Road, City',
    category: 'OBC',
    gender: 'Male',
    monthlyPresent: [18, 16, 14, 17, 18, 15, 17, 16, 14, 18, 16, 17],
    monthlyAbsent: [8, 9, 8, 9, 8, 8, 8, 8, 8, 8, 8, 9],
    monthlyWorking: workingDays
  },
  {
    id: '8',
    name: 'Pooja Sharma',
    rollNo: '08',
    admissionNo: 'ADM2024008',
    fatherName: 'Dinesh Sharma',
    motherName: 'Geeta Sharma',
    contact: '9876543217',
    address: '678, Market Street, City',
    category: 'General',
    gender: 'Female',
    monthlyPresent: [24, 23, 20, 24, 24, 21, 23, 22, 20, 24, 22, 24],
    monthlyAbsent: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    monthlyWorking: workingDays
  },
  {
    id: '9',
    name: 'Karan Mehta',
    rollNo: '09',
    admissionNo: 'ADM2024009',
    fatherName: 'Ajay Mehta',
    motherName: 'Neha Mehta',
    contact: '9876543218',
    address: '901, College Road, City',
    category: 'General',
    gender: 'Male',
    monthlyPresent: [25, 24, 21, 25, 25, 22, 24, 23, 21, 25, 23, 25],
    monthlyAbsent: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    monthlyWorking: workingDays
  },
  {
    id: '10',
    name: 'Neha Joshi',
    rollNo: '10',
    admissionNo: 'ADM2024010',
    fatherName: 'Prakash Joshi',
    motherName: 'Suman Joshi',
    contact: '9876543219',
    address: '345, Station Road, City',
    category: 'ST',
    gender: 'Female',
    monthlyPresent: [25, 24, 21, 25, 25, 22, 24, 23, 21, 25, 23, 25],
    monthlyAbsent: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    monthlyWorking: workingDays
  }];


  // Filter students
  const filteredStudents = students.filter(
    (student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate yearly totals for a student
  const calculateYearlyTotals = (student: YearlyAttendanceData) => {
    const totalPresent = student.monthlyPresent.reduce((a, b) => a + b, 0);
    const totalAbsent = student.monthlyAbsent.reduce((a, b) => a + b, 0);
    const percentage = Math.round(totalPresent / totalWorkingDays * 100);
    return { totalPresent, totalAbsent, percentage };
  };

  // Calculate quarterly totals
  const calculateQuarterlyTotals = (student: YearlyAttendanceData, quarterMonths: number[]) => {
    const present = quarterMonths.reduce((sum, i) => sum + student.monthlyPresent[i], 0);
    const working = quarterMonths.reduce((sum, i) => sum + workingDays[i], 0);
    const percentage = Math.round(present / working * 100);
    return { present, working, percentage };
  };

  // Handle generate register
  const handleGenerateRegister = () => {
    if (!selectedClass || !selectedSection || !selectedAcademicYear) {
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedAcademicYear('');
    setIsGenerated(false);
    setSearchTerm('');
  };

  // Check if form is valid
  const isFormValid = selectedClass && selectedSection && selectedAcademicYear;

  // Calculate class averages
  const classAverage = Math.round(
    filteredStudents.reduce((sum, s) => sum + calculateYearlyTotals(s).percentage, 0) /
    filteredStudents.length
  );

  return (
    <div className="space-y-6">
      {/* Register Generation Form */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpenIcon className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Generate Yearly Attendance Register
          </h3>
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 1: Select Class and Section
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Class *"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                { value: '', label: '-- Select Class --' },
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
                label="Select Section *"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={[
                { value: '', label: '-- Select Section --' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
                { value: 'D', label: 'Section D' }]
                } />

            </div>
          </div>

          {/* Step 2: Academic Year Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 2: Select Academic Year
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Academic Year *"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                options={[
                { value: '', label: '-- Select Academic Year --' },
                { value: '2024-2025', label: '2024-2025 (April 2024 - March 2025)' },
                { value: '2023-2024', label: '2023-2024 (April 2023 - March 2024)' },
                { value: '2022-2023', label: '2022-2023 (April 2022 - March 2023)' },
                { value: '2021-2022', label: '2021-2022 (April 2021 - March 2022)' }]
                } />

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Academic Year Duration</p>
                {selectedAcademicYear ?
                <p className="text-sm font-medium text-gray-900">
                    April {selectedAcademicYear.split('-')[0]} to March {selectedAcademicYear.split('-')[1]}
                  </p> :

                <p className="text-sm text-gray-400">Select academic year to see duration</p>
                }
              </div>
            </div>
          </div>

          {/* Step 3: Register Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 3: Register Options
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Register Format"
                value={registerFormat}
                onChange={(e) => setRegisterFormat(e.target.value)}
                options={[
                { value: 'detailed', label: 'Detailed (with all columns)' },
                { value: 'compact', label: 'Compact (attendance only)' },
                { value: 'summary', label: 'Summary (totals only)' }]
                } />

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQuarterly}
                    onChange={(e) => setIncludeQuarterly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="text-sm text-gray-700">Include Quarterly Summary</span>
                </label>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignature}
                    onChange={(e) => setIncludeSignature(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <span className="text-sm text-gray-700">Include Signature Section</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleGenerateRegister}
              disabled={!isFormValid || isGenerating}>

              {isGenerating ?
              <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Generating Register...
                </> :

              <>
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Generate Register
                </>
              }
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {!isFormValid &&
            <p className="text-sm text-gray-500 flex items-center gap-1">
                <InfoIcon className="w-4 h-4" />
                Please fill all required fields to generate register
              </p>
            }
          </div>
        </div>
      </Card>

      {/* Generated Register */}
      {isGenerated &&
      <>
          {/* Register Header and Actions */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Yearly Attendance Register Generated Successfully
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Academic Year {selectedAcademicYear} · Class {selectedClass}-{selectedSection} · {filteredStudents.length} Students · {totalWorkingDays} Working Days
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Register
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search by name, roll no, or admission no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>
          </Card>

          {/* Register Document */}
          <Card className="p-6 print:p-4" id="yearly-register">
            {/* Register Header - Official Format */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                Annual Attendance Register
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                (Academic Year: {selectedAcademicYear})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div className="text-left">
                  <span className="font-medium text-gray-700">Class: </span>
                  <span className="text-gray-900">{selectedClass}-{selectedSection}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Session: </span>
                  <span className="text-gray-900">{selectedAcademicYear}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Total Students: </span>
                  <span className="text-gray-900">{filteredStudents.length}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Total Working Days: </span>
                  <span className="text-gray-900">{totalWorkingDays}</span>
                </div>
              </div>
            </div>

            {/* Working Days Row Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Monthly Working Days:</p>
              <div className="grid grid-cols-12 gap-2 text-xs">
                {months.map((month, idx) =>
              <div key={month.short} className="text-center">
                    <p className="font-medium text-gray-600">{month.short}</p>
                    <p className="text-gray-900">{workingDays[idx]}</p>
                  </div>
              )}
              </div>
            </div>

            {/* Register Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[40px]">
                      Roll
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">
                      Student Name
                    </th>
                    {registerFormat === 'detailed' &&
                  <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[90px]">
                        Adm. No
                      </th>
                  }
                    {months.map((m) =>
                  <th
                    key={m.short}
                    className="text-center py-2 px-1 font-medium text-gray-600 border-r border-gray-300 min-w-[40px]">

                        {m.short}
                      </th>
                  )}
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-green-50 min-w-[50px]">
                      Total P
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-red-50 min-w-[50px]">
                      Total A
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[50px]">
                      %
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 min-w-[70px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                  const totals = calculateYearlyTotals(student);
                  return (
                    <React.Fragment key={student.id}>
                        <tr
                        className={`border-b border-gray-200 hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`
                        }>

                          <td className="py-2 px-2 text-gray-700 border-r border-gray-200 font-medium text-center">
                            {student.rollNo}
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 text-xs">{student.name}</p>
                                {registerFormat === 'detailed' &&
                              <p className="text-xs text-gray-500">S/o {student.fatherName}</p>
                              }
                              </div>
                              <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={() =>
                              setSelectedStudentId(
                                selectedStudentId === student.id ? null : student.id
                              )
                              }>

                                <EyeIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                          {registerFormat === 'detailed' &&
                        <td className="py-2 px-2 text-gray-600 text-xs border-r border-gray-200">
                              {student.admissionNo}
                            </td>
                        }
                          {student.monthlyPresent.map((days, i) => {
                          const monthPct = Math.round(days / workingDays[i] * 100);
                          return (
                            <td key={i} className="text-center py-2 px-1 border-r border-gray-200">
                                <span
                                className={`text-xs font-medium ${
                                monthPct >= 90 ?
                                'text-green-700' :
                                monthPct >= 75 ?
                                'text-yellow-700' :
                                'text-red-700'}`
                                }>

                                  {days}
                                </span>
                              </td>);

                        })}
                          <td className="text-center py-2 px-2 font-semibold text-green-700 bg-green-50/50 border-r border-gray-200">
                            {totals.totalPresent}
                          </td>
                          <td className="text-center py-2 px-2 font-semibold text-red-700 bg-red-50/50 border-r border-gray-200">
                            {totals.totalAbsent}
                          </td>
                          <td className="text-center py-2 px-2 border-r border-gray-200">
                            <Badge
                            variant={
                            totals.percentage >= 90 ?
                            'success' :
                            totals.percentage >= 75 ?
                            'warning' :
                            'danger'
                            }>

                              {totals.percentage}%
                            </Badge>
                          </td>
                          <td className="text-center py-2 px-2">
                            {totals.percentage >= 90 ?
                          <span className="text-xs text-green-700 font-medium">Excellent</span> :
                          totals.percentage >= 75 ?
                          <span className="text-xs text-yellow-700 font-medium">Good</span> :

                          <span className="text-xs text-red-700 font-medium">Critical</span>
                          }
                          </td>
                        </tr>
                        {selectedStudentId === student.id &&
                      <tr className="bg-gray-50 border-b border-gray-200">
                            <td colSpan={registerFormat === 'detailed' ? 17 : 16} className="p-4">
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500">Full Name</p>
                                  <p className="font-medium text-gray-900">{student.name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Father's Name</p>
                                  <p className="font-medium text-gray-900">{student.fatherName}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Mother's Name</p>
                                  <p className="font-medium text-gray-900">{student.motherName}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Contact</p>
                                  <p className="font-medium text-gray-900">{student.contact}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Category</p>
                                  <p className="font-medium text-gray-900">{student.category}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Gender</p>
                                  <p className="font-medium text-gray-900">{student.gender}</p>
                                </div>
                              </div>
                              {includeQuarterly &&
                          <div className="mt-4 grid grid-cols-4 gap-4">
                                  {[
                            { name: 'Q1 (Apr-Jun)', months: [0, 1, 2] },
                            { name: 'Q2 (Jul-Sep)', months: [3, 4, 5] },
                            { name: 'Q3 (Oct-Dec)', months: [6, 7, 8] },
                            { name: 'Q4 (Jan-Mar)', months: [9, 10, 11] }].
                            map((quarter) => {
                              const qTotals = calculateQuarterlyTotals(student, quarter.months);
                              return (
                                <div key={quarter.name} className="p-2 bg-white rounded border border-gray-200">
                                        <p className="text-xs text-gray-500">{quarter.name}</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {qTotals.present}/{qTotals.working} days
                                        </p>
                                        <Badge
                                    variant={
                                    qTotals.percentage >= 90 ?
                                    'success' :
                                    qTotals.percentage >= 75 ?
                                    'warning' :
                                    'danger'
                                    }>

                                          {qTotals.percentage}%
                                        </Badge>
                                      </div>);

                            })}
                                </div>
                          }
                            </td>
                          </tr>
                      }
                      </React.Fragment>);

                })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                    <td
                    colSpan={registerFormat === 'detailed' ? 3 : 2}
                    className="py-2 px-2 text-gray-700 border-r border-gray-300">

                      Class Average
                    </td>
                    {months.map((_, i) => {
                    const avgPresent = Math.round(
                      filteredStudents.reduce((sum, s) => sum + s.monthlyPresent[i], 0) /
                      filteredStudents.length
                    );
                    return (
                      <td key={i} className="text-center py-2 px-1 text-gray-700 text-xs border-r border-gray-200">
                          {avgPresent}
                        </td>);

                  })}
                    <td className="text-center py-2 px-2 text-green-700 border-r border-gray-200">
                      {Math.round(
                      filteredStudents.reduce((sum, s) => sum + calculateYearlyTotals(s).totalPresent, 0) /
                      filteredStudents.length
                    )}
                    </td>
                    <td className="text-center py-2 px-2 text-red-700 border-r border-gray-200">
                      {Math.round(
                      filteredStudents.reduce((sum, s) => sum + calculateYearlyTotals(s).totalAbsent, 0) /
                      filteredStudents.length
                    )}
                    </td>
                    <td className="text-center py-2 px-2 border-r border-gray-200">
                      <Badge variant="info">{classAverage}%</Badge>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Quarterly Summary */}
            {includeQuarterly &&
          <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quarterly Class Summary</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
              { name: 'Quarter 1', period: 'April - June', months: [0, 1, 2] },
              { name: 'Quarter 2', period: 'July - September', months: [3, 4, 5] },
              { name: 'Quarter 3', period: 'October - December', months: [6, 7, 8] },
              { name: 'Quarter 4', period: 'January - March', months: [9, 10, 11] }].
              map((quarter) => {
                const quarterWorking = quarter.months.reduce((sum, i) => sum + workingDays[i], 0);
                const quarterAvg = Math.round(
                  filteredStudents.reduce((sum, s) => {
                    const qPresent = quarter.months.reduce((p, i) => p + s.monthlyPresent[i], 0);
                    return sum + qPresent / quarterWorking * 100;
                  }, 0) / filteredStudents.length
                );
                return (
                  <div key={quarter.name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{quarter.name}</p>
                        <p className="text-xs text-gray-500">{quarter.period}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{quarterAvg}%</p>
                        <p className="text-xs text-gray-500">{quarterWorking} working days</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                        className={`h-2 rounded-full ${
                        quarterAvg >= 90 ?
                        'bg-green-500' :
                        quarterAvg >= 75 ?
                        'bg-yellow-500' :
                        'bg-red-500'}`
                        }
                        style={{ width: `${quarterAvg}%` }}>
                      </div>
                        </div>
                      </div>);

              })}
                </div>
              </div>
          }

            {/* Signature Section */}
            {includeSignature &&
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Class Teacher</p>
                    <p className="text-xs text-gray-500">Signature with Date</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Head of Department</p>
                    <p className="text-xs text-gray-500">Signature with Date</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Principal</p>
                    <p className="text-xs text-gray-500">Signature with Date & Seal</p>
                  </div>
                </div>
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="mt-1">This is a computer generated document. Please verify and sign for authentication.</p>
                </div>
              </div>
          }
          </Card>

          {/* Low Attendance Students Alert */}
          {filteredStudents.filter((s) => calculateYearlyTotals(s).percentage < 75).length > 0 &&
        <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Students with Annual Attendance Below 75%
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    These students may face attendance shortage issues and require immediate attention:
                  </p>
                  <div className="space-y-2">
                    {filteredStudents.
                filter((s) => calculateYearlyTotals(s).percentage < 75).
                map((student) => {
                  const totals = calculateYearlyTotals(student);
                  const shortage = Math.ceil(totalWorkingDays * 0.75) - totals.totalPresent;
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg">

                            <div>
                              <span className="font-medium text-gray-900">
                                {student.rollNo}. {student.name}
                              </span>
                              <p className="text-xs text-gray-500">
                                Contact: {student.contact}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {totals.totalPresent}/{totalWorkingDays} days
                                </p>
                                <p className="text-xs text-red-600">
                                  Shortage: {shortage} days
                                </p>
                              </div>
                              <Badge variant="danger">{totals.percentage}%</Badge>
                            </div>
                          </div>);

                })}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <PrinterIcon className="w-4 h-4 mr-2" />
                      Print Notice Letters
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Generate Shortage Report
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
        }

          {/* Perfect Attendance Students */}
          {filteredStudents.filter((s) => calculateYearlyTotals(s).percentage >= 95).length > 0 &&
        <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Students with Excellent Attendance (95%+)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    These students have maintained excellent attendance throughout the year:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {filteredStudents.
                filter((s) => calculateYearlyTotals(s).percentage >= 95).
                sort((a, b) => calculateYearlyTotals(b).percentage - calculateYearlyTotals(a).percentage).
                map((student, idx) => {
                  const totals = calculateYearlyTotals(student);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg">

                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                                <p className="text-xs text-gray-500">Roll: {student.rollNo}</p>
                              </div>
                            </div>
                            <Badge variant="success">{totals.percentage}%</Badge>
                          </div>);

                })}
                  </div>
                </div>
              </div>
            </Card>
        }
        </>
      }
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
            Attendance Register Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate, print, and export monthly and yearly attendance registers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Button>
        </div>
      </div>

      

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'monthly' ? <MonthlyRegister /> : <YearlyRegister />}
      </div>
    </div>);

}

export default AttendanceRegisterCombined;