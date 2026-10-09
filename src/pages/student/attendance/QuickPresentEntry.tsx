import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Users,
  BookOpen,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  RotateCcw,
  UserCheck,
  UserX,
  Check,
  X,
  AlertCircle } from
'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'unmarked';
type AttendanceMode = 'whole-day' | 'subject-wise';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  grNo: string;
  photo?: string;
  status: AttendanceStatus;
  time?: string;
  remarks?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  period: number;
  startTime: string;
  endTime: string;
}

const initialStudents: Student[] = [
{ id: '1', rollNo: '01', name: 'Aarav Patel', grNo: 'GR001', status: 'unmarked' },
{ id: '2', rollNo: '02', name: 'Aditi Sharma', grNo: 'GR002', status: 'unmarked' },
{ id: '3', rollNo: '03', name: 'Arjun Kumar', grNo: 'GR003', status: 'unmarked' },
{ id: '4', rollNo: '04', name: 'Diya Singh', grNo: 'GR004', status: 'unmarked' },
{ id: '5', rollNo: '05', name: 'Ishaan Gupta', grNo: 'GR005', status: 'unmarked' },
{ id: '6', rollNo: '06', name: 'Kavya Reddy', grNo: 'GR006', status: 'unmarked' },
{ id: '7', rollNo: '07', name: 'Rohan Verma', grNo: 'GR007', status: 'unmarked' },
{ id: '8', rollNo: '08', name: 'Sanya Joshi', grNo: 'GR008', status: 'unmarked' },
{ id: '9', rollNo: '09', name: 'Vivaan Mehta', grNo: 'GR009', status: 'unmarked' },
{ id: '10', rollNo: '10', name: 'Ananya Iyer', grNo: 'GR010', status: 'unmarked' },
{ id: '11', rollNo: '11', name: 'Kabir Malhotra', grNo: 'GR011', status: 'unmarked' },
{ id: '12', rollNo: '12', name: 'Myra Kapoor', grNo: 'GR012', status: 'unmarked' },
{ id: '13', rollNo: '13', name: 'Reyansh Shah', grNo: 'GR013', status: 'unmarked' },
{ id: '14', rollNo: '14', name: 'Saanvi Nair', grNo: 'GR014', status: 'unmarked' },
{ id: '15', rollNo: '15', name: 'Vihaan Choudhary', grNo: 'GR015', status: 'unmarked' },
{ id: '16', rollNo: '16', name: 'Zara Khan', grNo: 'GR016', status: 'unmarked' }];


const subjects: Subject[] = [
{ id: '1', name: 'Mathematics', code: 'MATH101', teacher: 'Mr. Sharma', period: 1, startTime: '08:00', endTime: '08:45' },
{ id: '2', name: 'Physics', code: 'PHY101', teacher: 'Mrs. Gupta', period: 2, startTime: '08:45', endTime: '09:30' },
{ id: '3', name: 'Chemistry', code: 'CHEM101', teacher: 'Mr. Kumar', period: 3, startTime: '09:45', endTime: '10:30' },
{ id: '4', name: 'English', code: 'ENG101', teacher: 'Ms. Patel', period: 4, startTime: '10:30', endTime: '11:15' },
{ id: '5', name: 'Biology', code: 'BIO101', teacher: 'Dr. Reddy', period: 5, startTime: '11:30', endTime: '12:15' },
{ id: '6', name: 'Computer Science', code: 'CS101', teacher: 'Mr. Verma', period: 6, startTime: '12:15', endTime: '01:00' },
{ id: '7', name: 'History', code: 'HIST101', teacher: 'Mrs. Singh', period: 7, startTime: '02:00', endTime: '02:45' },
{ id: '8', name: 'Geography', code: 'GEO101', teacher: 'Mr. Joshi', period: 8, startTime: '02:45', endTime: '03:30' }];


const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'science', label: 'Science' },
{ value: 'commerce', label: 'Commerce' },
{ value: 'arts', label: 'Arts' }];


const classOptions = [
{ value: '', label: 'Select Class' },
{ value: '9', label: 'Class 9' },
{ value: '10', label: 'Class 10' },
{ value: '11', label: 'Class 11' },
{ value: '12', label: 'Class 12' }];


const sectionOptions = [
{ value: '', label: 'Select Section' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const sessionOptions = [
{ value: 'full', label: 'Full Day' },
{ value: 'morning', label: 'Morning Session' },
{ value: 'afternoon', label: 'Afternoon Session' }];


export function QuickPresentEntry() {
  const [department, setDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState('full');
  const [searchQuery, setSearchQuery] = useState('');

  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('whole-day');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [subjectAttendance, setSubjectAttendance] = useState<Map<string, Student[]>>(new Map());

  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showAbsentOnly, setShowAbsentOnly] = useState(false);
  const [showUnmarkedOnly, setShowUnmarkedOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubject);
  }, [selectedSubject]);

  const currentStudents = useMemo(() => {
    if (attendanceMode === 'subject-wise' && selectedSubject) {
      return (
        subjectAttendance.get(selectedSubject) ||
        students.map((s) => ({ ...s, status: 'unmarked' as AttendanceStatus })));

    }
    return students;
  }, [attendanceMode, selectedSubject, students, subjectAttendance]);

  const filteredStudents = useMemo(() => {
    let filtered = currentStudents;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
        s.name.toLowerCase().includes(query) ||
        s.rollNo.includes(query) ||
        s.grNo.toLowerCase().includes(query)
      );
    }
    if (showAbsentOnly) {
      filtered = filtered.filter((s) => s.status === 'absent');
    }
    if (showUnmarkedOnly) {
      filtered = filtered.filter((s) => s.status === 'unmarked');
    }
    return filtered;
  }, [currentStudents, searchQuery, showAbsentOnly, showUnmarkedOnly]);

  const stats = useMemo(() => {
    const total = currentStudents.length;
    const present = currentStudents.filter((s) => s.status === 'present').length;
    const absent = currentStudents.filter((s) => s.status === 'absent').length;
    const late = currentStudents.filter((s) => s.status === 'late').length;
    const excused = currentStudents.filter((s) => s.status === 'excused').length;
    const unmarked = currentStudents.filter((s) => s.status === 'unmarked').length;
    return { total, present, absent, late, excused, unmarked };
  }, [currentStudents]);

  const subjectStats = useMemo(() => {
    const statsMap = new Map<string, {present: number;absent: number;total: number;}>();
    subjects.forEach((subject) => {
      const subjectStudents = subjectAttendance.get(subject.id) || [];
      statsMap.set(subject.id, {
        present: subjectStudents.filter((s) => s.status === 'present').length,
        absent: subjectStudents.filter((s) => s.status === 'absent').length,
        total: students.length
      });
    });
    return statsMap;
  }, [subjectAttendance, students.length]);

  const toggleStatus = (studentId: string, newStatus: AttendanceStatus) => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    if (attendanceMode === 'subject-wise' && selectedSubject) {
      const currentSubjectStudents =
      subjectAttendance.get(selectedSubject) ||
      students.map((s) => ({ ...s, status: 'unmarked' as AttendanceStatus }));
      const updatedStudents = currentSubjectStudents.map((s) =>
      s.id === studentId ? { ...s, status: newStatus, time: currentTime } : s
      );
      setSubjectAttendance(new Map(subjectAttendance.set(selectedSubject, updatedStudents)));
    } else {
      setStudents(
        students.map((s) =>
        s.id === studentId ? { ...s, status: newStatus, time: currentTime } : s
        )
      );
    }
  };

  const markAllAs = (status: AttendanceStatus) => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    if (attendanceMode === 'subject-wise' && selectedSubject) {
      const updatedStudents = students.map((s) => ({ ...s, status, time: currentTime }));
      setSubjectAttendance(new Map(subjectAttendance.set(selectedSubject, updatedStudents)));
    } else {
      setStudents(students.map((s) => ({ ...s, status, time: currentTime })));
    }
  };

  const resetAttendance = () => {
    if (attendanceMode === 'subject-wise' && selectedSubject) {
      const resetStudents = students.map((s) => ({
        ...s,
        status: 'unmarked' as AttendanceStatus,
        time: undefined
      }));
      setSubjectAttendance(new Map(subjectAttendance.set(selectedSubject, resetStudents)));
    } else {
      setStudents(students.map((s) => ({ ...s, status: 'unmarked', time: undefined })));
    }
  };

  const handleLoadStudents = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStudents(initialStudents.map((s) => ({ ...s, status: 'unmarked' })));
      setSubjectAttendance(new Map());
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);
  };

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRowBgColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-50';
      case 'absent':
        return 'bg-red-50';
      case 'late':
        return 'bg-yellow-50';
      case 'excused':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Present Entry</h1>
          <p className="text-gray-500 mt-1">
            Fast attendance marking for classes -{' '}
            {attendanceMode === 'whole-day' ? 'Whole Day' : 'Subject Wise'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lastSaved &&
          <span className="text-sm text-gray-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Last saved: {lastSaved}
            </span>
          }
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
            Print
          </Button>
          <Button
            variant="primary"
            leftIcon={
            isSaving ?
            <RefreshCw className="w-4 h-4 animate-spin" /> :

            <Save className="w-4 h-4" />

            }
            onClick={handleSaveAttendance}
            disabled={isSaving || stats.unmarked === stats.total}>

            {isSaving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Attendance Mode Toggle */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Attendance Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAttendanceMode('whole-day')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                attendanceMode === 'whole-day' ?
                'bg-white text-blue-600 shadow-sm' :
                'text-gray-600 hover:text-gray-900'}`
                }>

                <Calendar className="w-4 h-4" />
                Whole Day
              </button>
              <button
                onClick={() => setAttendanceMode('subject-wise')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                attendanceMode === 'subject-wise' ?
                'bg-white text-blue-600 shadow-sm' :
                'text-gray-600 hover:text-gray-900'}`
                }>

                <BookOpen className="w-4 h-4" />
                Subject Wise
              </button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            rightIcon={
            showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            }>

            <Filter className="w-4 h-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </Card>

      {/* Filters */}
      {showFilters &&
      <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select
            label="Department"
            options={departmentOptions}
            value={department}
            onChange={(val) => setDepartment(val)} />

            <Select
            label="Class"
            options={classOptions}
            value={selectedClass}
            onChange={(val) => setSelectedClass(val)} />

            <Select
            label="Section"
            options={sectionOptions}
            value={selectedSection}
            onChange={(val) => setSelectedSection(val)} />

            <Input
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} />

            {attendanceMode === 'whole-day' &&
          <Select
            label="Session"
            options={sessionOptions}
            value={session}
            onChange={(val) => setSession(val)} />

          }
            <div className="flex items-end">
              <Button
              variant="outline"
              className="w-full"
              onClick={handleLoadStudents}
              disabled={isLoading || !selectedClass || !selectedSection}
              leftIcon={
              isLoading ?
              <RefreshCw className="w-4 h-4 animate-spin" /> :

              <Users className="w-4 h-4" />

              }>

                {isLoading ? 'Loading...' : 'Load Students'}
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Subject Selection for Subject-wise Mode */}
      {attendanceMode === 'subject-wise' &&
      <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Subject & Period</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {subjects.map((subject) => {
            const subjectStat = subjectStats.get(subject.id);
            const isSelected = selectedSubject === subject.id;
            const isMarked = subjectStat && subjectStat.present + subjectStat.absent > 0;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject.id);
                  setSelectedPeriod(subject.period);
                }}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                isSelected ?
                'border-blue-500 bg-blue-50 ring-2 ring-blue-200' :
                isMarked ?
                'border-green-300 bg-green-50 hover:border-green-400' :
                'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`
                }>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-500">P{subject.period}</span>
                    {isMarked && <CheckCircle className="w-3 h-3 text-green-500" />}
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate">{subject.name}</p>
                  {subjectStat && (subjectStat.present > 0 || subjectStat.absent > 0) &&
                <div className="flex gap-1 text-xs mt-1">
                      <span className="text-green-600">{subjectStat.present}P</span>
                      <span className="text-red-600">{subjectStat.absent}A</span>
                    </div>
                }
                </button>);

          })}
          </div>

          {currentSubject &&
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-semibold text-gray-900">{currentSubject.name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    Period {currentSubject.period} • {currentSubject.startTime} -{' '}
                    {currentSubject.endTime} • {currentSubject.teacher}
                  </span>
                </div>
              </div>
              <Badge variant="info">{currentSubject.code}</Badge>
            </div>
        }
        </Card>
      }

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          <p className="text-xs text-yellow-600">Late</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
          <p className="text-xs text-blue-600">Excused</p>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
          <p className="text-xs text-gray-500">Unmarked</p>
        </div>
      </div>

      {/* Quick Actions & Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              Quick Actions:
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => markAllAs('present')}
              leftIcon={<UserCheck className="w-4 h-4" />}>

              All Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => markAllAs('absent')}
              leftIcon={<UserX className="w-4 h-4" />}>

              All Absent
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetAttendance}
              leftIcon={<RotateCcw className="w-4 h-4" />}>

              Reset
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Input
              placeholder="Search by name, roll no, or GR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full sm:w-64" />

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={showAbsentOnly ? 'primary' : 'outline'}
                onClick={() => {
                  setShowAbsentOnly(!showAbsentOnly);
                  setShowUnmarkedOnly(false);
                }}>

                Absent Only
              </Button>
              <Button
                size="sm"
                variant={showUnmarkedOnly ? 'primary' : 'outline'}
                onClick={() => {
                  setShowUnmarkedOnly(!showUnmarkedOnly);
                  setShowAbsentOnly(false);
                }}>

                Unmarked Only
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="font-medium text-gray-900">
            Students - Class {selectedClass}-{selectedSection}
            {attendanceMode === 'subject-wise' && currentSubject && ` • ${currentSubject.name}`}
          </span>
          <Badge variant="info">{filteredStudents.length} students</Badge>
        </div>

        {attendanceMode === 'subject-wise' && !selectedSubject ?
        <div className="py-16 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a Subject</p>
            <p className="text-sm">Choose a subject from above to mark attendance</p>
          </div> :
        filteredStudents.length === 0 ?
        <div className="py-16 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm w-16">
                    Roll No
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm w-24">
                    GR No
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                    Student Name
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm w-24">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm w-20">
                    Time
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-10 text-center text-green-600">P</span>
                      <span className="w-10 text-center text-red-600">A</span>
                      <span className="w-10 text-center text-yellow-600">L</span>
                      <span className="w-10 text-center text-blue-600">E</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, index) =>
              <tr
                key={student.id}
                className={`${getRowBgColor(student.status)} hover:bg-opacity-80 transition-colors`}>

                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-gray-700">
                        {student.rollNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500">{student.grNo}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-gray-600">
                            {student.name.
                        split(' ').
                        map((n) => n[0]).
                        join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getStatusBadgeVariant(student.status)} className="text-xs">
                        {student.status === 'unmarked' ? 'Unmarked' : student.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs text-gray-500">{student.time || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                      onClick={() => toggleStatus(student.id, 'present')}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                      student.status === 'present' ?
                      'bg-green-500 text-white shadow-md ring-2 ring-green-300' :
                      'bg-white text-gray-400 hover:bg-green-100 hover:text-green-600 border border-gray-200'}`
                      }
                      title="Present">

                          <Check className="w-5 h-5" />
                        </button>
                        <button
                      onClick={() => toggleStatus(student.id, 'absent')}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                      student.status === 'absent' ?
                      'bg-red-500 text-white shadow-md ring-2 ring-red-300' :
                      'bg-white text-gray-400 hover:bg-red-100 hover:text-red-600 border border-gray-200'}`
                      }
                      title="Absent">

                          <X className="w-5 h-5" />
                        </button>
                        <button
                      onClick={() => toggleStatus(student.id, 'late')}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                      student.status === 'late' ?
                      'bg-yellow-500 text-white shadow-md ring-2 ring-yellow-300' :
                      'bg-white text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 border border-gray-200'}`
                      }
                      title="Late">

                          <Clock className="w-5 h-5" />
                        </button>
                        <button
                      onClick={() => toggleStatus(student.id, 'excused')}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                      student.status === 'excused' ?
                      'bg-blue-500 text-white shadow-md ring-2 ring-blue-300' :
                      'bg-white text-gray-400 hover:bg-blue-100 hover:text-blue-600 border border-gray-200'}`
                      }
                      title="Excused">

                          <AlertCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </Card>

      {/* Subject-wise Summary */}
      {attendanceMode === 'subject-wise' &&
      <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <span className="font-medium text-gray-900">Today's Subject-wise Attendance Summary</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Period</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Teacher</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Time</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Present</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Absent</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((subject) => {
                const stat = subjectStats.get(subject.id);
                const isMarked = stat && (stat.present > 0 || stat.absent > 0);
                return (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-700">P{subject.period}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{subject.name}</p>
                          <p className="text-xs text-gray-500">{subject.code}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{subject.teacher}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {subject.startTime} - {subject.endTime}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-600 font-bold">{stat?.present || 0}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-red-600 font-bold">{stat?.absent || 0}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={isMarked ? 'success' : 'warning'}>
                          {isMarked ? 'Done' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                        size="sm"
                        variant={selectedSubject === subject.id ? 'primary' : 'outline'}
                        onClick={() => {
                          setSelectedSubject(subject.id);
                          setSelectedPeriod(subject.period);
                        }}>

                          {isMarked ? 'Edit' : 'Mark'}
                        </Button>
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Floating Save Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-lg w-14 h-14 p-0"
          onClick={handleSaveAttendance}
          disabled={isSaving || stats.unmarked === stats.total}>

          {isSaving ?
          <RefreshCw className="w-6 h-6 animate-spin" /> :

          <Save className="w-6 h-6" />
          }
        </Button>
      </div>
    </div>);

}