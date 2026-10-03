import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Filter,
  BookOpen,
  Search,
  RefreshCw,
  Calendar,
  X,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Info,
  User } from
'lucide-react';

// Types
interface Student {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  fatherName: string;
  contact: string;
}

interface SubjectAttendanceStudent extends Student {
  attendance: number[]; // 1=present, 0=absent, 2=holiday, 3=late, 4=half-day
}

interface Subject {
  id: string;
  code: string;
  name: string;
  teacher: string;
  periodsPerWeek: number;
}

// Filter Options
const classOptions = [
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
{ value: '12', label: 'Class 12' }];


const sectionOptions = [
{ value: '', label: '-- Select Section --' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const subjectOptions = [
{ value: '', label: '-- Select Subject --' },
{ value: 'MATH', label: 'Mathematics' },
{ value: 'PHY', label: 'Physics' },
{ value: 'CHEM', label: 'Chemistry' },
{ value: 'BIO', label: 'Biology' },
{ value: 'ENG', label: 'English' },
{ value: 'HIN', label: 'Hindi' },
{ value: 'SST', label: 'Social Studies' },
{ value: 'CS', label: 'Computer Science' },
{ value: 'PE', label: 'Physical Education' },
{ value: 'ART', label: 'Art & Craft' }];


const monthOptions = [
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
{ value: '12', label: 'December' }];


const yearOptions = [
{ value: '', label: '-- Select Year --' },
{ value: '2024', label: '2024' },
{ value: '2023', label: '2023' },
{ value: '2022', label: '2022' }];


// Subject Details Map
const subjectDetailsMap: {[key: string]: Subject;} = {
  'MATH': { id: '1', code: 'MATH', name: 'Mathematics', teacher: 'Mr. Rajesh Sharma', periodsPerWeek: 6 },
  'PHY': { id: '2', code: 'PHY', name: 'Physics', teacher: 'Mrs. Priya Patel', periodsPerWeek: 5 },
  'CHEM': { id: '3', code: 'CHEM', name: 'Chemistry', teacher: 'Mr. Amit Kumar', periodsPerWeek: 5 },
  'BIO': { id: '4', code: 'BIO', name: 'Biology', teacher: 'Dr. Meera Reddy', periodsPerWeek: 5 },
  'ENG': { id: '5', code: 'ENG', name: 'English', teacher: 'Ms. Sneha Gupta', periodsPerWeek: 6 },
  'HIN': { id: '6', code: 'HIN', name: 'Hindi', teacher: 'Mr. Vikram Singh', periodsPerWeek: 4 },
  'SST': { id: '7', code: 'SST', name: 'Social Studies', teacher: 'Mrs. Kavita Joshi', periodsPerWeek: 4 },
  'CS': { id: '8', code: 'CS', name: 'Computer Science', teacher: 'Mr. Rahul Verma', periodsPerWeek: 3 },
  'PE': { id: '9', code: 'PE', name: 'Physical Education', teacher: 'Mr. Sunil Yadav', periodsPerWeek: 2 },
  'ART': { id: '10', code: 'ART', name: 'Art & Craft', teacher: 'Mrs. Anita Desai', periodsPerWeek: 2 }
};

// Generate sample student data
const generateStudentData = (totalPeriods: number): SubjectAttendanceStudent[] => {
  const students: SubjectAttendanceStudent[] = [
  { id: '1', rollNo: '01', name: 'Aarav Patel', admissionNo: 'ADM2024001', fatherName: 'Ramesh Patel', contact: '9876543201', attendance: [] },
  { id: '2', rollNo: '02', name: 'Aditi Sharma', admissionNo: 'ADM2024002', fatherName: 'Suresh Sharma', contact: '9876543202', attendance: [] },
  { id: '3', rollNo: '03', name: 'Arjun Kumar', admissionNo: 'ADM2024003', fatherName: 'Vijay Kumar', contact: '9876543203', attendance: [] },
  { id: '4', rollNo: '04', name: 'Diya Singh', admissionNo: 'ADM2024004', fatherName: 'Mahendra Singh', contact: '9876543204', attendance: [] },
  { id: '5', rollNo: '05', name: 'Ishaan Gupta', admissionNo: 'ADM2024005', fatherName: 'Anil Gupta', contact: '9876543205', attendance: [] },
  { id: '6', rollNo: '06', name: 'Kavya Reddy', admissionNo: 'ADM2024006', fatherName: 'Prakash Reddy', contact: '9876543206', attendance: [] },
  { id: '7', rollNo: '07', name: 'Rohan Verma', admissionNo: 'ADM2024007', fatherName: 'Rakesh Verma', contact: '9876543207', attendance: [] },
  { id: '8', rollNo: '08', name: 'Sanya Joshi', admissionNo: 'ADM2024008', fatherName: 'Dinesh Joshi', contact: '9876543208', attendance: [] },
  { id: '9', rollNo: '09', name: 'Vivaan Mehta', admissionNo: 'ADM2024009', fatherName: 'Ajay Mehta', contact: '9876543209', attendance: [] },
  { id: '10', rollNo: '10', name: 'Ananya Iyer', admissionNo: 'ADM2024010', fatherName: 'Krishnan Iyer', contact: '9876543210', attendance: [] },
  { id: '11', rollNo: '11', name: 'Kabir Malhotra', admissionNo: 'ADM2024011', fatherName: 'Sanjay Malhotra', contact: '9876543211', attendance: [] },
  { id: '12', rollNo: '12', name: 'Myra Chopra', admissionNo: 'ADM2024012', fatherName: 'Vikram Chopra', contact: '9876543212', attendance: [] },
  { id: '13', rollNo: '13', name: 'Reyansh Kapoor', admissionNo: 'ADM2024013', fatherName: 'Rajesh Kapoor', contact: '9876543213', attendance: [] },
  { id: '14', rollNo: '14', name: 'Saanvi Nair', admissionNo: 'ADM2024014', fatherName: 'Gopalan Nair', contact: '9876543214', attendance: [] },
  { id: '15', rollNo: '15', name: 'Vihaan Saxena', admissionNo: 'ADM2024015', fatherName: 'Alok Saxena', contact: '9876543215', attendance: [] }];


  // Generate random attendance for each student
  return students.map((student) => ({
    ...student,
    attendance: Array.from({ length: totalPeriods }, () => {
      const rand = Math.random();
      if (rand > 0.92) return 2; // Holiday
      if (rand > 0.85) return 0; // Absent
      if (rand > 0.80) return 3; // Late
      return 1; // Present
    })
  }));
};

// Generate period dates for a month
const generatePeriodDates = (month: number, year: number, periodsPerWeek: number): {date: string;day: string;periodNo: number;}[] => {
  const dates: {date: string;day: string;periodNo: number;}[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let periodCount = 0;
  const periodsPerDay = Math.ceil(periodsPerWeek / 5); // Assuming 5 working days

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    // Add periods for this day (simplified: 1 period per day for the subject)
    if (periodCount < periodsPerWeek * 4) {// Approximately 4 weeks
      dates.push({
        date: `${day}`,
        day: dayNames[dayOfWeek],
        periodNo: periodCount + 1
      });
      periodCount++;
    }
  }

  return dates;
};

export function SubjectwiseAttendance() {
  // Filter States
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [registerFormat, setRegisterFormat] = useState('detailed');
  const [includeSignature, setIncludeSignature] = useState(true);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  // Check if form is valid
  const isFormValid = selectedClass && selectedSection && selectedSubject && selectedMonth && selectedYear;

  // Get subject details
  const subjectDetails = selectedSubject ? subjectDetailsMap[selectedSubject] : null;

  // Generate period dates
  const periodDates = useMemo(() => {
    if (!selectedMonth || !selectedYear || !subjectDetails) return [];
    return generatePeriodDates(parseInt(selectedMonth), parseInt(selectedYear), subjectDetails.periodsPerWeek);
  }, [selectedMonth, selectedYear, subjectDetails]);

  // Generate student data
  const studentData = useMemo(() => {
    if (!isGenerated || periodDates.length === 0) return [];
    return generateStudentData(periodDates.length);
  }, [isGenerated, periodDates.length]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return studentData;
    const query = searchTerm.toLowerCase();
    return studentData.filter(
      (s) => s.name.toLowerCase().includes(query) ||
      s.rollNo.includes(query) ||
      s.admissionNo.toLowerCase().includes(query)
    );
  }, [studentData, searchTerm]);

  // Calculate totals for a student
  const calculateTotals = (attendance: number[]) => {
    const present = attendance.filter((a) => a === 1).length;
    const absent = attendance.filter((a) => a === 0).length;
    const late = attendance.filter((a) => a === 3).length;
    const holidays = attendance.filter((a) => a === 2).length;
    const totalPeriods = attendance.length - holidays;
    const percentage = totalPeriods > 0 ? Math.round(present / totalPeriods * 100) : 0;
    return { present, absent, late, holidays, totalPeriods, percentage };
  };

  // Calculate class totals
  const classTotals = useMemo(() => {
    if (filteredStudents.length === 0) return { present: 0, absent: 0, late: 0, avgPercentage: 0 };

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalPercentage = 0;

    filteredStudents.forEach((student) => {
      const totals = calculateTotals(student.attendance);
      totalPresent += totals.present;
      totalAbsent += totals.absent;
      totalLate += totals.late;
      totalPercentage += totals.percentage;
    });

    return {
      present: totalPresent,
      absent: totalAbsent,
      late: totalLate,
      avgPercentage: Math.round(totalPercentage / filteredStudents.length)
    };
  }, [filteredStudents]);

  // Get month name
  const getMonthName = (month: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(month) - 1];
  };

  // Get status icon
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            P
          </span>);

      case 0:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
            A
          </span>);

      case 2:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
            H
          </span>);

      case 3:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
            L
          </span>);

      case 4:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
            HD
          </span>);

      default:
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
            -
          </span>);

    }
  };

  // Handle generate register
  const handleGenerateRegister = () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsGenerated(true);
    }, 1500);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedSubject('');
    setSelectedMonth('');
    setSelectedYear('');
    setSearchTerm('');
    setIsGenerated(false);
  };

  // Navigate month
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
    setIsGenerated(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7" />
            Subject-wise Attendance Register
          </h1>
          <p className="text-gray-500 mt-1">
            Generate and view attendance register for specific subjects
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Generate Subject Attendance Register
          </h3>
        </div>

        <div className="space-y-6">
          {/* Step 1: Class and Section */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 1: Select Class and Section
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Class *"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setIsGenerated(false);
                }}
                options={classOptions} />

              <Select
                label="Select Section *"
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setIsGenerated(false);
                }}
                options={sectionOptions} />

            </div>
          </div>

          {/* Step 2: Subject Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 2: Select Subject
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Subject *"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setIsGenerated(false);
                }}
                options={subjectOptions} />

              {selectedSubject && subjectDetailsMap[selectedSubject] &&
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-900">Subject Details</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Teacher: {subjectDetailsMap[selectedSubject].teacher}
                  </p>
                  <p className="text-sm text-blue-700">
                    Periods/Week: {subjectDetailsMap[selectedSubject].periodsPerWeek}
                  </p>
                </div>
              }
            </div>
          </div>

          {/* Step 3: Month and Year */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 3: Select Month and Year
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Month *"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setIsGenerated(false);
                }}
                options={monthOptions} />

              <Select
                label="Select Year *"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setIsGenerated(false);
                }}
                options={yearOptions} />

            </div>
          </div>

          {/* Step 4: Register Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Step 4: Register Options
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Register Format"
                value={registerFormat}
                onChange={(e) => setRegisterFormat(e.target.value)}
                options={[
                { value: 'detailed', label: 'Detailed (with all info)' },
                { value: 'compact', label: 'Compact (attendance only)' }]
                } />

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
              disabled={!isFormValid || isLoading}>

              {isLoading ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </> :

              <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Register
                </>
              }
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {!isFormValid &&
            <p className="text-sm text-gray-500 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Please fill all required fields
              </p>
            }
          </div>
        </div>
      </Card>

      {/* Generated Register */}
      {isGenerated && subjectDetails &&
      <>
          {/* Register Header and Actions */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Subject Attendance Register Generated
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {subjectDetails.name} ({subjectDetails.code}) · {getMonthName(selectedMonth)} {selectedYear} · Class {selectedClass}-{selectedSection}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            {/* Month Navigation and Search */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                  {getMonthName(selectedMonth)} {selectedYear}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateRegister}
                className="ml-2">

                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reload
                </Button>
              </div>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search student by name, roll no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                </div>
              </div>
            </div>
          </Card>

          {/* Register Document */}
          <Card className="p-6" id="subject-register">
            {/* Official Header */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                Subject Attendance Register
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                (Period-wise Attendance Record)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm text-left">
                <div>
                  <span className="font-medium text-gray-700">Subject: </span>
                  <span className="text-gray-900">{subjectDetails.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Code: </span>
                  <span className="text-gray-900">{subjectDetails.code}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Class: </span>
                  <span className="text-gray-900">{selectedClass}-{selectedSection}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Month: </span>
                  <span className="text-gray-900">{getMonthName(selectedMonth)} {selectedYear}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Teacher: </span>
                  <span className="text-gray-900">{subjectDetails.teacher}</span>
                </div>
              </div>
            </div>

            {/* Summary Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Total Students</p>
                  <p className="text-lg font-bold text-gray-900">{filteredStudents.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Periods</p>
                  <p className="text-lg font-bold text-gray-900">{periodDates.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Present</p>
                  <p className="text-lg font-bold text-green-600">{classTotals.present}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Absent</p>
                  <p className="text-lg font-bold text-red-600">{classTotals.absent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg. Attendance</p>
                  <p className="text-lg font-bold text-blue-600">{classTotals.avgPercentage}%</p>
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
                  <th className="text-left py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 min-w-[90px]">
                        Adm. No
                      </th>
                  }
                    {periodDates.map((period, index) =>
                  <th
                    key={index}
                    className="text-center py-1 px-1 font-medium text-gray-600 border-r border-gray-300 min-w-[32px]">

                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-xs text-gray-400">{period.day}</span>
                          <span className="text-xs">{period.date}</span>
                        </div>
                      </th>
                  )}
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-green-50 min-w-[35px]">
                      P
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-red-50 min-w-[35px]">
                      A
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 border-r border-gray-300 bg-yellow-50 min-w-[35px]">
                      L
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 min-w-[50px]">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                  const totals = calculateTotals(student.attendance);
                  return (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`
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
                        {student.attendance.map((status, i) =>
                      <td
                        key={i}
                        className="text-center py-1 px-0.5 border-r border-gray-200">

                            {getStatusIcon(status)}
                          </td>
                      )}
                        <td className="text-center py-2 px-2 font-semibold text-green-700 bg-green-50/50 border-r border-gray-200">
                          {totals.present}
                        </td>
                        <td className="text-center py-2 px-2 font-semibold text-red-700 bg-red-50/50 border-r border-gray-200">
                          {totals.absent}
                        </td>
                        <td className="text-center py-2 px-2 font-semibold text-yellow-700 bg-yellow-50/50 border-r border-gray-200">
                          {totals.late}
                        </td>
                        <td className="text-center py-2 px-2">
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
                      </tr>);

                })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                    <td
                    colSpan={registerFormat === 'detailed' ? 3 : 2}
                    className="py-2 px-2 text-gray-700 border-r border-gray-300 sticky left-0 bg-gray-100">

                      Period Totals
                    </td>
                    {periodDates.map((_, index) => {
                    const presentCount = filteredStudents.filter(
                      (s) => s.attendance[index] === 1
                    ).length;
                    return (
                      <td
                        key={index}
                        className="text-center py-2 px-1 text-xs text-gray-700 border-r border-gray-200">

                          {presentCount}
                        </td>);

                  })}
                    <td className="text-center py-2 px-2 text-green-700 border-r border-gray-200">
                      {classTotals.present}
                    </td>
                    <td className="text-center py-2 px-2 text-red-700 border-r border-gray-200">
                      {classTotals.absent}
                    </td>
                    <td className="text-center py-2 px-2 text-yellow-700 border-r border-gray-200">
                      {classTotals.late}
                    </td>
                    <td className="text-center py-2 px-2">
                      <Badge variant="info">{classTotals.avgPercentage}%</Badge>
                    </td>
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
                <span className="w-5 h-5 rounded-full bg-gray-100 inline-flex items-center justify-center text-gray-400 text-xs font-bold">
                  H
                </span>
                Holiday / No Class
              </span>
            </div>

            {/* Signature Section */}
            {includeSignature &&
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Subject Teacher</p>
                    <p className="text-xs text-gray-500">{subjectDetails.teacher}</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Class Teacher</p>
                    <p className="text-xs text-gray-500">Signature with Date</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Principal</p>
                    <p className="text-xs text-gray-500">Signature with Date & Seal</p>
                  </div>
                </div>
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>
                    Generated on: {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </p>
                  <p className="mt-1">
                    This is a computer generated document. Please verify and sign for authentication.
                  </p>
                </div>
              </div>
          }
          </Card>

          {/* Low Attendance Alert */}
          {filteredStudents.filter((s) => calculateTotals(s.attendance).percentage < 75).length > 0 &&
        <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Students with Low Attendance in {subjectDetails.name} (Below 75%)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    These students require attention due to low subject attendance:
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
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-red-700" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">
                                  {student.rollNo}. {student.name}
                                </span>
                                <p className="text-xs text-gray-500">
                                  Present: {totals.present} | Absent: {totals.absent} | Late: {totals.late}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{student.contact}</span>
                              <Badge variant="danger">{totals.percentage}%</Badge>
                            </div>
                          </div>);

                })}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Warning Letters
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
        }

          {/* Excellent Attendance */}
          {filteredStudents.filter((s) => calculateTotals(s.attendance).percentage >= 95).length > 0 &&
        <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Students with Excellent Attendance in {subjectDetails.name} (95%+)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {filteredStudents.
                filter((s) => calculateTotals(s.attendance).percentage >= 95).
                sort((a, b) => calculateTotals(b.attendance).percentage - calculateTotals(a.attendance).percentage).
                map((student, idx) => {
                  const totals = calculateTotals(student.attendance);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg">

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

export default SubjectwiseAttendance;