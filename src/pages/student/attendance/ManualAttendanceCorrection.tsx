import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Save,
  Edit2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  FileText,
  Download,
  Printer,
  Eye,
  ArrowLeft,
  Check,
  AlertCircle,
  MessageSquare,
  UserCheck,
  UserX,
  ClipboardList,
  BookOpen,
  Building2,
  GraduationCap,
  Hash,
  IdCard,
  Layers,
  RotateCcw,
  Send,
  Info,
  Trash2,
  Plus,
  Minus } from
'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'half-day';
type CorrectionStatus = 'pending' | 'approved' | 'rejected';
type ViewMode = 'search' | 'correction' | 'history';
type AttendanceType = 'whole-day' | 'subject-wise';

interface SearchFilters {
  grNo: string;
  suId: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
}

interface Student {
  id: string;
  grNo: string;
  suId: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  department: string;
  email: string;
  phone: string;
  photo?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  type: AttendanceType;
  subject?: string;
  period?: number;
  status: AttendanceStatus;
  time?: string;
  markedBy: string;
  markedAt: string;
  isModified: boolean;
  modifiedBy?: string;
  modifiedAt?: string;
  originalStatus?: AttendanceStatus;
  remarks?: string;
}

interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  originalStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
  remarks: string;
  requestedBy: string;
  requestedAt: string;
  status: CorrectionStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Initial filter state
const initialFilters: SearchFilters = {
  grNo: '',
  suId: '',
  rollNo: '',
  firstName: '',
  lastName: '',
  class: '',
  section: '',
  department: ''
};

// Filter Options
const classOptions = [
{ value: '', label: 'All Classes' },
{ value: '9', label: 'Class 9' },
{ value: '10', label: 'Class 10' },
{ value: '11', label: 'Class 11' },
{ value: '12', label: 'Class 12' }];


const sectionOptions = [
{ value: '', label: 'All Sections' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'science', label: 'Science' },
{ value: 'commerce', label: 'Commerce' },
{ value: 'arts', label: 'Arts' }];


const statusOptions = [
{ value: 'present', label: 'Present' },
{ value: 'absent', label: 'Absent' },
{ value: 'late', label: 'Late' },
{ value: 'excused', label: 'Excused / Leave' },
{ value: 'half-day', label: 'Half Day' }];


const correctionReasonOptions = [
{ value: '', label: 'Select Reason' },
{ value: 'marking-error', label: 'Marking Error by Teacher' },
{ value: 'late-entry', label: 'Late Entry Not Recorded' },
{ value: 'early-leave', label: 'Early Leave with Permission' },
{ value: 'leave-approved', label: 'Leave Approved Later' },
{ value: 'biometric-issue', label: 'Biometric Device Issue' },
{ value: 'system-error', label: 'System Error' },
{ value: 'medical-emergency', label: 'Medical Emergency' },
{ value: 'parent-request', label: 'Parent Request' },
{ value: 'other', label: 'Other' }];


const subjectOptions = [
{ value: '', label: 'All Subjects' },
{ value: 'math', label: 'Mathematics' },
{ value: 'physics', label: 'Physics' },
{ value: 'chemistry', label: 'Chemistry' },
{ value: 'english', label: 'English' },
{ value: 'biology', label: 'Biology' }];


// Mock Data
const mockStudent: Student = {
  id: '1',
  grNo: 'GR-2020-001',
  suId: 'SU-12345',
  rollNo: '15',
  firstName: 'Rahul',
  lastName: 'Sharma',
  class: '10',
  section: 'A',
  department: 'Science',
  email: 'rahul.sharma@school.edu',
  phone: '+91 98765 43210'
};

const mockAttendanceRecords: AttendanceRecord[] = [
{
  id: '1',
  date: '2024-03-15',
  day: 'Friday',
  type: 'whole-day',
  status: 'absent',
  markedBy: 'Mr. Sharma (Class Teacher)',
  markedAt: '08:30 AM',
  isModified: false
},
{
  id: '2',
  date: '2024-03-14',
  day: 'Thursday',
  type: 'whole-day',
  status: 'present',
  time: '08:10 AM',
  markedBy: 'Mr. Sharma (Class Teacher)',
  markedAt: '08:30 AM',
  isModified: false
},
{
  id: '3',
  date: '2024-03-13',
  day: 'Wednesday',
  type: 'whole-day',
  status: 'late',
  time: '08:45 AM',
  markedBy: 'Mr. Sharma (Class Teacher)',
  markedAt: '08:30 AM',
  isModified: true,
  modifiedBy: 'Admin',
  modifiedAt: '2024-03-13 10:00 AM',
  originalStatus: 'absent',
  remarks: 'Student came late due to traffic'
},
{
  id: '4',
  date: '2024-03-12',
  day: 'Tuesday',
  type: 'subject-wise',
  subject: 'Mathematics',
  period: 1,
  status: 'present',
  time: '08:05 AM',
  markedBy: 'Mr. Kumar',
  markedAt: '08:45 AM',
  isModified: false
},
{
  id: '5',
  date: '2024-03-12',
  day: 'Tuesday',
  type: 'subject-wise',
  subject: 'Physics',
  period: 2,
  status: 'absent',
  markedBy: 'Mrs. Patel',
  markedAt: '09:45 AM',
  isModified: false
},
{
  id: '6',
  date: '2024-03-11',
  day: 'Monday',
  type: 'whole-day',
  status: 'excused',
  markedBy: 'Mr. Sharma (Class Teacher)',
  markedAt: '08:30 AM',
  isModified: false,
  remarks: 'Medical leave approved'
}];


const mockCorrectionHistory: CorrectionRequest[] = [
{
  id: '1',
  studentId: '1',
  studentName: 'Rahul Sharma',
  date: '2024-03-13',
  originalStatus: 'absent',
  newStatus: 'late',
  reason: 'Late Entry Not Recorded',
  remarks: 'Student came late due to traffic jam',
  requestedBy: 'Mr. Sharma',
  requestedAt: '2024-03-13 09:30 AM',
  status: 'approved',
  approvedBy: 'Admin',
  approvedAt: '2024-03-13 10:00 AM'
},
{
  id: '2',
  studentId: '1',
  studentName: 'Rahul Sharma',
  date: '2024-03-08',
  originalStatus: 'absent',
  newStatus: 'excused',
  reason: 'Leave Approved Later',
  remarks: 'Medical emergency - doctor visit',
  requestedBy: 'Parent',
  requestedAt: '2024-03-08 02:00 PM',
  status: 'approved',
  approvedBy: 'Admin',
  approvedAt: '2024-03-08 03:30 PM'
},
{
  id: '3',
  studentId: '1',
  studentName: 'Rahul Sharma',
  date: '2024-03-05',
  originalStatus: 'absent',
  newStatus: 'present',
  reason: 'Marking Error by Teacher',
  remarks: 'Wrong student marked absent',
  requestedBy: 'Mr. Kumar',
  requestedAt: '2024-03-05 11:00 AM',
  status: 'rejected',
  approvedBy: 'Admin',
  approvedAt: '2024-03-05 12:00 PM',
  rejectionReason: 'No evidence provided'
}];


export function ManualAttendanceCorrection() {
  // Filter States
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [attendanceTypeFilter, setAttendanceTypeFilter] = useState<'all' | AttendanceType>('all');
  const [subjectFilter, setSubjectFilter] = useState('');

  // View States
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [studentFound, setStudentFound] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showCorrectionHistory, setShowCorrectionHistory] = useState(false);

  // Correction Form States
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [entryTime, setEntryTime] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Bulk Correction States
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Loading States
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle filter change
  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setDateFrom('');
    setDateTo('');
    setAttendanceTypeFilter('all');
    setSubjectFilter('');
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((v) => v !== '').length;
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setStudent(mockStudent);
      setAttendanceRecords(mockAttendanceRecords);
      setStudentFound(true);
      setIsSearching(false);
    }, 1000);
  };

  // Handle select record for correction
  const handleSelectRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setNewStatus(record.status);
    setEntryTime(record.time || '');
    setViewMode('correction');
  };

  // Handle bulk selection
  const handleBulkSelect = (recordId: string) => {
    setSelectedRecords((prev) =>
    prev.includes(recordId) ?
    prev.filter((id) => id !== recordId) :
    [...prev, recordId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRecords.length === attendanceRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(attendanceRecords.map((r) => r.id));
    }
  };

  // Handle save correction
  const handleSaveCorrection = () => {
    if (!correctionReason) {
      return;
    }
    setShowConfirmModal(true);
  };

  // Handle confirm correction
  const handleConfirmCorrection = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Update the record in the list
      if (selectedRecord) {
        setAttendanceRecords((prev) =>
        prev.map((r) =>
        r.id === selectedRecord.id ?
        {
          ...r,
          status: newStatus,
          time: entryTime || r.time,
          isModified: true,
          modifiedBy: 'Admin',
          modifiedAt: new Date().toLocaleString(),
          originalStatus: r.status,
          remarks: remarks
        } :
        r
        )
        );
      }

      // Reset form
      setTimeout(() => {
        setShowSuccessModal(false);
        setViewMode('search');
        setSelectedRecord(null);
        setNewStatus('present');
        setEntryTime('');
        setCorrectionReason('');
        setCustomReason('');
        setRemarks('');
      }, 2000);
    }, 1500);
  };

  // Handle back
  const handleBack = () => {
    if (viewMode === 'correction') {
      setViewMode('search');
      setSelectedRecord(null);
    } else if (viewMode === 'history') {
      setViewMode('search');
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':return 'success';
      case 'absent':return 'danger';
      case 'late':return 'warning';
      case 'excused':return 'info';
      case 'half-day':return 'default';
      default:return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent':return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late':return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'excused':return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'half-day':return <Minus className="w-4 h-4 text-gray-500" />;
      default:return null;
    }
  };

  // Get correction status badge
  const getCorrectionStatusBadge = (status: CorrectionStatus) => {
    switch (status) {
      case 'approved':return 'success';
      case 'rejected':return 'danger';
      case 'pending':return 'warning';
      default:return 'default';
    }
  };

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    let filtered = attendanceRecords;

    if (attendanceTypeFilter !== 'all') {
      filtered = filtered.filter((r) => r.type === attendanceTypeFilter);
    }

    if (subjectFilter) {
      filtered = filtered.filter((r) => r.subject?.toLowerCase() === subjectFilter);
    }

    return filtered;
  }, [attendanceRecords, attendanceTypeFilter, subjectFilter]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== 'search' &&
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          }
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {viewMode === 'search' && 'Manual Attendance Correction'}
              {viewMode === 'correction' && 'Correction Details'}
              {viewMode === 'history' && 'Correction History'}
            </h1>
            <p className="text-gray-500 mt-1">
              {viewMode === 'search' && 'Search and correct attendance records manually'}
              {viewMode === 'correction' && `Editing attendance for ${student?.firstName} ${student?.lastName}`}
              {viewMode === 'history' && 'View all correction requests and their status'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {viewMode === 'search' && studentFound &&
          <>
              <Button
              variant="outline"
              leftIcon={<History className="w-4 h-4" />}
              onClick={() => setShowHistoryModal(true)}>

                Correction History
              </Button>
              <Button
              variant={bulkMode ? 'primary' : 'outline'}
              onClick={() => setBulkMode(!bulkMode)}
              leftIcon={<ClipboardList className="w-4 h-4" />}>

                {bulkMode ? 'Exit Bulk Mode' : 'Bulk Correction'}
              </Button>
            </>
          }
          <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
            Print
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {viewMode === 'search' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="space-y-6">
            {/* Search Filters Card */}
            <Card>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-900">Search Student</h2>
                    {getActiveFiltersCount() > 0 &&
                  <Badge variant="info">{getActiveFiltersCount()} filters</Badge>
                  }
                  </div>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  rightIcon={showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}>

                    {showAdvancedFilters ? 'Less' : 'More'}
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Quick Search */}
                <Input
                label="Quick Search"
                placeholder="GR No, SU ID, Name, or Roll No"
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                value={filters.grNo || filters.suId || filters.firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Auto-detect search type
                  if (value.startsWith('GR')) {
                    handleFilterChange('grNo', value);
                  } else if (value.startsWith('SU')) {
                    handleFilterChange('suId', value);
                  } else {
                    handleFilterChange('firstName', value);
                  }
                }} />


                {/* Advanced Filters */}
                {showAdvancedFilters &&
              <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
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

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                    label="GR Number"
                    placeholder="GR-XXXX-XXX"
                    value={filters.grNo}
                    onChange={(e) => handleFilterChange('grNo', e.target.value)}
                    leftIcon={<Hash className="w-4 h-4 text-gray-400" />} />

                      <Input
                    label="SU ID"
                    placeholder="SU-XXXXX"
                    value={filters.suId}
                    onChange={(e) => handleFilterChange('suId', e.target.value)}
                    leftIcon={<IdCard className="w-4 h-4 text-gray-400" />} />

                    </div>

                    <Input
                  label="Roll Number"
                  placeholder="Enter roll number"
                  value={filters.rollNo}
                  onChange={(e) => handleFilterChange('rollNo', e.target.value)}
                  leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />} />


                    <div className="grid grid-cols-2 gap-4">
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

                    </div>

                    <Select
                  label="Department"
                  options={departmentOptions}
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)} />

                  </div>
              }

                {/* Date Selection */}
                <div className="pt-4 border-t border-gray-100">
                  <Input
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)} />

                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                  className="flex-1"
                  onClick={handleSearch}
                  disabled={isSearching}
                  leftIcon={isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}>

                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                  <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  leftIcon={<X className="w-4 h-4" />}>

                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            {/* Student Details Card */}
            {studentFound && student &&
          <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                      <span className="text-xl font-bold text-white">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{student.firstName} {student.lastName}</h3>
                      <p className="text-blue-100">Class {student.class}-{student.section}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">GR Number</p>
                      <p className="font-medium">{student.grNo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">SU ID</p>
                      <p className="font-medium">{student.suId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Roll Number</p>
                      <p className="font-medium">{student.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{student.department}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 text-sm">
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium">{student.email}</p>
                    <p className="text-gray-600">{student.phone}</p>
                  </div>
                </div>
              </Card>
          }
          </div>

          {/* Attendance Records */}
          <div className="lg:col-span-2 space-y-6">
            {studentFound ?
          <>
                {/* Filters for Records */}
                <Card className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input
                    label="From Date"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)} />

                      <Input
                    label="To Date"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)} />

                      <Select
                    label="Attendance Type"
                    options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'whole-day', label: 'Whole Day' },
                    { value: 'subject-wise', label: 'Subject Wise' }]
                    }
                    value={attendanceTypeFilter}
                    onChange={(e) => setAttendanceTypeFilter(e.target.value as any)} />

                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                      Apply
                    </Button>
                  </div>
                </Card>

                {/* Bulk Actions */}
                {bulkMode && selectedRecords.length > 0 &&
            <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                    type="checkbox"
                    checked={selectedRecords.length === attendanceRecords.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300" />

                        <span className="font-medium text-blue-800">
                          {selectedRecords.length} records selected
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedRecords([])}>
                          Clear Selection
                        </Button>
                        <Button size="sm" leftIcon={<Edit2 className="w-4 h-4" />}>
                          Bulk Correct
                        </Button>
                      </div>
                    </div>
                  </Card>
            }

                {/* Attendance Records List */}
                <Card title={`Attendance Records (${filteredRecords.length})`}>
                  <div className="divide-y divide-gray-100">
                    {filteredRecords.map((record) =>
                <div
                  key={record.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  record.isModified ? 'bg-yellow-50' : ''}`
                  }>

                        {bulkMode &&
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record.id)}
                    onChange={() => handleBulkSelect(record.id)}
                    className="rounded border-gray-300 mr-4" />

                  }

                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    record.status === 'present' ? 'bg-green-100' :
                    record.status === 'absent' ? 'bg-red-100' :
                    record.status === 'late' ? 'bg-yellow-100' :
                    record.status === 'excused' ? 'bg-blue-100' :
                    'bg-gray-100'}`
                    }>
                            {getStatusIcon(record.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{record.date}</p>
                              <span className="text-gray-400">•</span>
                              <p className="text-gray-500">{record.day}</p>
                              {record.isModified &&
                        <Badge variant="warning" className="text-xs">Modified</Badge>
                        }
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {record.type === 'subject-wise' &&
                        <>
                                  <BookOpen className="w-3 h-3" />
                                  <span>{record.subject} (Period {record.period})</span>
                                  <span className="text-gray-300">|</span>
                                </>
                        }
                              <span>Marked by {record.markedBy}</span>
                              {record.time &&
                        <>
                                  <span className="text-gray-300">|</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{record.time}</span>
                                </>
                        }
                            </div>
                            {record.remarks &&
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {record.remarks}
                              </p>
                      }
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={getStatusBadgeVariant(record.status)}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                            {record.originalStatus &&
                      <p className="text-xs text-gray-400 mt-1 line-through">
                                Was: {record.originalStatus}
                              </p>
                      }
                          </div>
                          <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectRecord(record)}
                      leftIcon={<Edit2 className="w-4 h-4" />}>

                            Edit
                          </Button>
                        </div>
                      </div>
                )}
                  </div>

                  {filteredRecords.length === 0 &&
              <div className="py-12 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No attendance records found for the selected criteria</p>
                    </div>
              }
                </Card>
              </> :

          <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Edit2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Search for a Student</h3>
                  <p className="text-sm max-w-md">
                    Use the search panel to find a student by their GR number, SU ID, 
                    roll number, name, or class details to view and correct their attendance records.
                  </p>
                </div>
              </Card>
          }
          </div>
        </div>
      }

      {/* Correction View */}
      {viewMode === 'correction' && selectedRecord && student &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold">{student.firstName} {student.lastName}</h3>
                    <p className="text-blue-100 text-sm">Class {student.class}-{student.section}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">GR No:</span>
                  <span className="font-medium">{student.grNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Roll No:</span>
                  <span className="font-medium">{student.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-medium">{student.department}</span>
                </div>
              </div>
            </Card>

            {/* Current Record Info */}
            <Card title="Current Record">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{selectedRecord.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Day</p>
                      <p className="font-medium">{selectedRecord.day}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium capitalize">{selectedRecord.type.replace('-', ' ')}</p>
                    </div>
                    {selectedRecord.subject &&
                  <div>
                        <p className="text-gray-500">Subject</p>
                        <p className="font-medium">{selectedRecord.subject}</p>
                      </div>
                  }
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.status)}
                      <span className="font-bold text-lg capitalize">{selectedRecord.status}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(selectedRecord.status)} className="text-lg px-3 py-1">
                    {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Marked by: {selectedRecord.markedBy}</p>
                  <p>Marked at: {selectedRecord.markedAt}</p>
                  {selectedRecord.time && <p>Entry time: {selectedRecord.time}</p>}
                </div>

                {selectedRecord.isModified &&
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
                    <div className="flex items-center gap-2 text-yellow-800 font-medium mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Previously Modified
                    </div>
                    <p className="text-yellow-700">
                      Changed from "{selectedRecord.originalStatus}" by {selectedRecord.modifiedBy} on {selectedRecord.modifiedAt}
                    </p>
                  </div>
              }
              </div>
            </Card>
          </div>

          {/* Correction Form */}
          <div className="lg:col-span-2">
            <Card title="Correction Details">
              <div className="space-y-6">
                {/* Status Change Visualization */}
                <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  selectedRecord.status === 'present' ? 'bg-green-100' :
                  selectedRecord.status === 'absent' ? 'bg-red-100' :
                  selectedRecord.status === 'late' ? 'bg-yellow-100' :
                  'bg-blue-100'}`
                  }>
                      {selectedRecord.status === 'present' && <CheckCircle className="w-8 h-8 text-green-500" />}
                      {selectedRecord.status === 'absent' && <XCircle className="w-8 h-8 text-red-500" />}
                      {selectedRecord.status === 'late' && <Clock className="w-8 h-8 text-yellow-500" />}
                      {selectedRecord.status === 'excused' && <AlertCircle className="w-8 h-8 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-500">Current</p>
                    <p className="font-bold capitalize">{selectedRecord.status}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-12 h-0.5 bg-gray-300 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-gray-300 border-y-4 border-y-transparent" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  newStatus === 'present' ? 'bg-green-100' :
                  newStatus === 'absent' ? 'bg-red-100' :
                  newStatus === 'late' ? 'bg-yellow-100' :
                  newStatus === 'excused' ? 'bg-blue-100' :
                  'bg-gray-100'}`
                  }>
                      {newStatus === 'present' && <CheckCircle className="w-8 h-8 text-green-500" />}
                      {newStatus === 'absent' && <XCircle className="w-8 h-8 text-red-500" />}
                      {newStatus === 'late' && <Clock className="w-8 h-8 text-yellow-500" />}
                      {newStatus === 'excused' && <AlertCircle className="w-8 h-8 text-blue-500" />}
                      {newStatus === 'half-day' && <Minus className="w-8 h-8 text-gray-500" />}
                    </div>
                    <p className="text-sm text-gray-500">New</p>
                    <p className="font-bold capitalize">{newStatus}</p>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="grid grid-cols-5 gap-2">
                  {statusOptions.map((option) =>
                <button
                  key={option.value}
                  onClick={() => setNewStatus(option.value as AttendanceStatus)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                  newStatus === option.value ?
                  option.value === 'present' ? 'border-green-500 bg-green-50' :
                  option.value === 'absent' ? 'border-red-500 bg-red-50' :
                  option.value === 'late' ? 'border-yellow-500 bg-yellow-50' :
                  option.value === 'excused' ? 'border-blue-500 bg-blue-50' :
                  'border-gray-500 bg-gray-50' :
                  'border-gray-200 hover:border-gray-300'}`
                  }>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                  option.value === 'present' ? 'bg-green-100' :
                  option.value === 'absent' ? 'bg-red-100' :
                  option.value === 'late' ? 'bg-yellow-100' :
                  option.value === 'excused' ? 'bg-blue-100' :
                  'bg-gray-100'}`
                  }>
                        {option.value === 'present' && <Check className="w-4 h-4 text-green-600" />}
                        {option.value === 'absent' && <X className="w-4 h-4 text-red-600" />}
                        {option.value === 'late' && <Clock className="w-4 h-4 text-yellow-600" />}
                        {option.value === 'excused' && <AlertCircle className="w-4 h-4 text-blue-600" />}
                        {option.value === 'half-day' && <Minus className="w-4 h-4 text-gray-600" />}
                      </div>
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                )}
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(newStatus === 'present' || newStatus === 'late') &&
                <Input
                  label="Entry Time"
                  type="time"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  leftIcon={<Clock className="w-4 h-4 text-gray-400" />} />

                }
                  <Select
                  label="Reason for Correction *"
                  options={correctionReasonOptions}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  required />

                </div>

                {correctionReason === 'other' &&
              <Input
                label="Specify Reason *"
                placeholder="Enter the reason for correction"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                required />

              }

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks / Notes
                  </label>
                  <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add any additional notes or remarks about this correction..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)} />

                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supporting Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Leave application, medical certificate, etc.
                    </p>
                  </div>
                </div>

                {/* Warning for absent to present */}
                {selectedRecord.status === 'absent' && newStatus === 'present' &&
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Changing attendance from "Absent" to "Present" requires proper documentation. 
                        Please ensure you have valid supporting evidence.
                      </p>
                    </div>
                  </div>
              }

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <div className="flex gap-3">
                    <Button
                    variant="outline"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => {
                      setNewStatus(selectedRecord.status);
                      setEntryTime(selectedRecord.time || '');
                      setCorrectionReason('');
                      setCustomReason('');
                      setRemarks('');
                    }}>

                      Reset
                    </Button>
                    <Button
                    variant="primary"
                    leftIcon={<Save className="w-4 h-4" />}
                    onClick={handleSaveCorrection}
                    disabled={!correctionReason || correctionReason === 'other' && !customReason}>

                      Save Correction
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Correction</h3>
                  <p className="text-sm text-gray-500">Review and confirm the changes</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <Badge variant={getStatusBadgeVariant(selectedRecord?.status || 'absent')} className="text-lg px-4 py-1">
                    {selectedRecord?.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Current</p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <Badge variant={getStatusBadgeVariant(newStatus)} className="text-lg px-4 py-1">
                    {newStatus}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">New</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Student:</span>
                  <span className="font-medium">{student?.firstName} {student?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{selectedRecord?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason:</span>
                  <span className="font-medium">
                    {correctionReasonOptions.find((r) => r.value === correctionReason)?.label || customReason}
                  </span>
                </div>
                {entryTime &&
              <div className="flex justify-between">
                    <span className="text-gray-500">Entry Time:</span>
                    <span className="font-medium">{entryTime}</span>
                  </div>
              }
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>This action will be logged in the audit trail.</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleConfirmCorrection}
              disabled={isSaving}
              leftIcon={isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}>

                {isSaving ? 'Saving...' : 'Confirm & Save'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Success Modal */}
      {showSuccessModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Correction Saved!</h3>
            <p className="text-gray-500">
              The attendance record has been successfully updated.
            </p>
          </div>
        </div>
      }

      {/* Correction History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Correction History</h3>
                  <p className="text-sm text-gray-500">All attendance corrections for this student</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {mockCorrectionHistory.map((correction) =>
            <div key={correction.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  correction.status === 'approved' ? 'bg-green-100' :
                  correction.status === 'rejected' ? 'bg-red-100' :
                  'bg-yellow-100'}`
                  }>
                        {correction.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {correction.status === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
                        {correction.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{correction.date}</p>
                          <Badge variant={getCorrectionStatusBadge(correction.status)}>
                            {correction.status.charAt(0).toUpperCase() + correction.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant={getStatusBadgeVariant(correction.originalStatus)}>
                            {correction.originalStatus}
                          </Badge>
                          <span className="text-gray-400">→</span>
                          <Badge variant={getStatusBadgeVariant(correction.newStatus)}>
                            {correction.newStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{correction.reason}</p>
                        {correction.remarks &&
                    <p className="text-sm text-gray-500 mt-1 italic">"{correction.remarks}"</p>
                    }
                        {correction.rejectionReason &&
                    <p className="text-sm text-red-600 mt-1">
                            Rejection reason: {correction.rejectionReason}
                          </p>
                    }
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Requested by {correction.requestedBy}</p>
                      <p>{correction.requestedAt}</p>
                      {correction.approvedBy &&
                  <p className="mt-1 text-gray-400">
                          {correction.status === 'approved' ? 'Approved' : 'Rejected'} by {correction.approvedBy}
                        </p>
                  }
                    </div>
                  </div>
                </div>
            )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}