import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  SearchIcon,
  PrinterIcon,
  DownloadIcon,
  PlusIcon,
  EyeIcon,
  FileTextIcon,
  CheckCircleIcon,
  UsersIcon,
  FilterIcon,
  RefreshCwIcon,
  XIcon,
  Loader2Icon,
  CalendarIcon,
  UserIcon,
  HashIcon,
  BookOpenIcon,
  AwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckSquareIcon,
  CopyIcon,
  Building2Icon } from
'lucide-react';

// Types
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  suId: string;
  grNo: string;
  admissionNo: string;
  class: string;
  section: string;
  department: string;
  rollNo: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  contact: string;
  email: string;
}

interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  grNo: string;
  suId: string;
  class: string;
  section: string;
  certNo: string;
  issueDate: string;
  examName: string;
  status: 'Issued' | 'Printed' | 'Draft' | 'Cancelled';
  issuedBy: string;
  createdAt: string;
}

// Options
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
{ value: 'D', label: 'Section D' }];


const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'Science', label: 'Science' },
{ value: 'Commerce', label: 'Commerce' },
{ value: 'Arts', label: 'Arts' },
{ value: 'General', label: 'General' }];


const examOptions = [
{ value: '', label: '-- Select Examination --' },
{ value: 'Annual Examination 2024', label: 'Annual Examination 2024' },
{ value: 'Half Yearly Examination 2024', label: 'Half Yearly Examination 2024' },
{ value: 'Quarterly Examination 2024', label: 'Quarterly Examination 2024' },
{ value: 'Unit Test 3 - 2024', label: 'Unit Test 3 - 2024' },
{ value: 'Unit Test 2 - 2024', label: 'Unit Test 2 - 2024' },
{ value: 'Unit Test 1 - 2024', label: 'Unit Test 1 - 2024' }];


// Mock Students Data
const mockStudents: Student[] = [
{ id: '1', firstName: 'Rahul', lastName: 'Sharma', name: 'Rahul Sharma', suId: 'SU-2024-001', grNo: 'GR001', admissionNo: 'ADM2024001', class: '10', section: 'A', department: 'Science', rollNo: '15', fatherName: 'Ramesh Sharma', motherName: 'Sunita Sharma', dob: '2008-05-15', gender: 'Male', contact: '9876543201', email: 'rahul@example.com' },
{ id: '2', firstName: 'Priya', lastName: 'Patel', name: 'Priya Patel', suId: 'SU-2024-002', grNo: 'GR002', admissionNo: 'ADM2024002', class: '10', section: 'A', department: 'Science', rollNo: '08', fatherName: 'Suresh Patel', motherName: 'Kavita Patel', dob: '2008-08-22', gender: 'Female', contact: '9876543202', email: 'priya@example.com' },
{ id: '3', firstName: 'Amit', lastName: 'Kumar', name: 'Amit Kumar', suId: 'SU-2024-003', grNo: 'GR003', admissionNo: 'ADM2024003', class: '10', section: 'B', department: 'Science', rollNo: '22', fatherName: 'Vijay Kumar', motherName: 'Meena Kumar', dob: '2008-03-10', gender: 'Male', contact: '9876543203', email: 'amit@example.com' },
{ id: '4', firstName: 'Sneha', lastName: 'Gupta', name: 'Sneha Gupta', suId: 'SU-2024-004', grNo: 'GR004', admissionNo: 'ADM2024004', class: '10', section: 'B', department: 'Commerce', rollNo: '05', fatherName: 'Anil Gupta', motherName: 'Rekha Gupta', dob: '2008-11-28', gender: 'Female', contact: '9876543204', email: 'sneha@example.com' },
{ id: '5', firstName: 'Ravi', lastName: 'Singh', name: 'Ravi Singh', suId: 'SU-2024-005', grNo: 'GR005', admissionNo: 'ADM2024005', class: '10', section: 'A', department: 'Science', rollNo: '12', fatherName: 'Mahendra Singh', motherName: 'Saroj Singh', dob: '2008-07-19', gender: 'Male', contact: '9876543205', email: 'ravi@example.com' },
{ id: '6', firstName: 'Anjali', lastName: 'Verma', name: 'Anjali Verma', suId: 'SU-2024-006', grNo: 'GR006', admissionNo: 'ADM2024006', class: '9', section: 'A', department: 'Commerce', rollNo: '03', fatherName: 'Rakesh Verma', motherName: 'Asha Verma', dob: '2009-01-05', gender: 'Female', contact: '9876543206', email: 'anjali@example.com' },
{ id: '7', firstName: 'Vikram', lastName: 'Yadav', name: 'Vikram Yadav', suId: 'SU-2024-007', grNo: 'GR007', admissionNo: 'ADM2024007', class: '9', section: 'B', department: 'Arts', rollNo: '18', fatherName: 'Shyam Yadav', motherName: 'Kamla Yadav', dob: '2009-09-12', gender: 'Male', contact: '9876543207', email: 'vikram@example.com' },
{ id: '8', firstName: 'Pooja', lastName: 'Joshi', name: 'Pooja Joshi', suId: 'SU-2024-008', grNo: 'GR008', admissionNo: 'ADM2024008', class: '9', section: 'A', department: 'Science', rollNo: '11', fatherName: 'Dinesh Joshi', motherName: 'Geeta Joshi', dob: '2009-04-25', gender: 'Female', contact: '9876543208', email: 'pooja@example.com' },
{ id: '9', firstName: 'Karan', lastName: 'Mehta', name: 'Karan Mehta', suId: 'SU-2024-009', grNo: 'GR009', admissionNo: 'ADM2024009', class: '11', section: 'A', department: 'Science', rollNo: '07', fatherName: 'Ajay Mehta', motherName: 'Neha Mehta', dob: '2007-06-30', gender: 'Male', contact: '9876543209', email: 'karan@example.com' },
{ id: '10', firstName: 'Neha', lastName: 'Reddy', name: 'Neha Reddy', suId: 'SU-2024-010', grNo: 'GR010', admissionNo: 'ADM2024010', class: '11', section: 'B', department: 'Commerce', rollNo: '14', fatherName: 'Suresh Reddy', motherName: 'Lakshmi Reddy', dob: '2007-12-08', gender: 'Female', contact: '9876543210', email: 'neha@example.com' },
{ id: '11', firstName: 'Arjun', lastName: 'Nair', name: 'Arjun Nair', suId: 'SU-2024-011', grNo: 'GR011', admissionNo: 'ADM2024011', class: '12', section: 'A', department: 'Science', rollNo: '02', fatherName: 'Gopalan Nair', motherName: 'Prema Nair', dob: '2006-02-14', gender: 'Male', contact: '9876543211', email: 'arjun@example.com' },
{ id: '12', firstName: 'Divya', lastName: 'Iyer', name: 'Divya Iyer', suId: 'SU-2024-012', grNo: 'GR012', admissionNo: 'ADM2024012', class: '12', section: 'A', department: 'Science', rollNo: '09', fatherName: 'Krishnan Iyer', motherName: 'Radha Iyer', dob: '2006-10-20', gender: 'Female', contact: '9876543212', email: 'divya@example.com' }];


// Tab Types
type TabType = 'single' | 'bulk' | 'history';

// Main Component
export function FirstTrialCombined() {
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('single');

  // Filters State
  const [filters, setFilters] = useState({
    searchQuery: '',
    firstName: '',
    lastName: '',
    suId: '',
    grNo: '',
    class: '',
    section: '',
    department: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Certificate Generation State
  const [selectedExam, setSelectedExam] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  // Single Issue State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);

  // Bulk Issue State
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Preview State
  const [showPreview, setShowPreview] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  // Filter Students
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.suId.toLowerCase().includes(query) ||
        student.grNo.toLowerCase().includes(query) ||
        student.admissionNo.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.firstName && !student.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) {
        return false;
      }

      if (filters.lastName && !student.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) {
        return false;
      }

      if (filters.suId && !student.suId.toLowerCase().includes(filters.suId.toLowerCase())) {
        return false;
      }

      if (filters.grNo && !student.grNo.toLowerCase().includes(filters.grNo.toLowerCase())) {
        return false;
      }

      if (filters.class && student.class !== filters.class) {
        return false;
      }

      if (filters.section && student.section !== filters.section) {
        return false;
      }

      if (filters.department && student.department !== filters.department) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Handlers
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      firstName: '',
      lastName: '',
      suId: '',
      grNo: '',
      class: '',
      section: '',
      department: ''
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedStudent(null);
    setSelectedStudents([]);
    handleClearFilters();
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
    prev.includes(studentId) ?
    prev.filter((id) => id !== studentId) :
    [...prev, studentId]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const generateCertificateNumber = (index: number = 0) => {
    const year = new Date().getFullYear();
    const number = String(certificates.length + index + 1).padStart(4, '0');
    return `FT-${year}-${number}`;
  };

  const handleGenerateSingle = () => {
    if (!selectedStudent || !selectedExam) return;

    setIsGeneratingSingle(true);
    setTimeout(() => {
      const newCert: Certificate = {
        id: String(Date.now()),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        grNo: selectedStudent.grNo,
        suId: selectedStudent.suId,
        class: selectedStudent.class,
        section: selectedStudent.section,
        certNo: generateCertificateNumber(),
        issueDate: issueDate,
        examName: selectedExam,
        status: 'Issued',
        issuedBy: 'Admin',
        createdAt: new Date().toISOString()
      };
      setCertificates((prev) => [newCert, ...prev]);
      setIsGeneratingSingle(false);
      setSelectedStudent(null);
      setSelectedExam('');
      setRemarks('');
      handleClearFilters();
    }, 1500);
  };

  const handleGenerateBulk = () => {
    if (selectedStudents.length === 0 || !selectedExam) return;

    setIsGeneratingBulk(true);
    setTimeout(() => {
      const newCerts: Certificate[] = selectedStudents.map((studentId, index) => {
        const student = mockStudents.find((s) => s.id === studentId)!;
        return {
          id: String(Date.now() + index),
          studentId: student.id,
          studentName: student.name,
          grNo: student.grNo,
          suId: student.suId,
          class: student.class,
          section: student.section,
          certNo: generateCertificateNumber(index),
          issueDate: issueDate,
          examName: selectedExam,
          status: 'Issued',
          issuedBy: 'Admin',
          createdAt: new Date().toISOString()
        };
      });
      setCertificates((prev) => [...newCerts, ...prev]);
      setIsGeneratingBulk(false);
      setShowBulkSuccess(true);
    }, 2000);
  };

  const handlePreview = (student: Student) => {
    setPreviewStudent(student);
    setShowPreview(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Issued':return 'success';
      case 'Printed':return 'info';
      case 'Draft':return 'warning';
      case 'Cancelled':return 'danger';
      default:return 'default';
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  // Render Single Issue Content
  const renderSingleIssue = () =>
  <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            Search Student
          </h3>
          <div className="flex gap-2">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

              {showAdvancedFilters ?
            <><ChevronUpIcon className="w-4 h-4 mr-1" /> Hide Filters</> :

            <><ChevronDownIcon className="w-4 h-4 mr-1" /> Advanced Filters</>
            }
            </Button>
            {hasActiveFilters &&
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <XIcon className="w-4 h-4 mr-1" /> Clear
              </Button>
          }
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
          type="text"
          placeholder="Search by name, SU ID, GR No, or Admission No..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
      <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
            label="First Name"
            placeholder="Enter first name"
            value={filters.firstName}
            onChange={(e) => handleFilterChange('firstName', e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />} />

              <Input
            label="Last Name"
            placeholder="Enter last name"
            value={filters.lastName}
            onChange={(e) => handleFilterChange('lastName', e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />} />

              <Input
            label="SU ID"
            placeholder="e.g., SU-2024-001"
            value={filters.suId}
            onChange={(e) => handleFilterChange('suId', e.target.value)}
            leftIcon={<HashIcon className="w-4 h-4 text-gray-400" />} />

              <Input
            label="GR No"
            placeholder="e.g., GR001"
            value={filters.grNo}
            onChange={(e) => handleFilterChange('grNo', e.target.value)}
            leftIcon={<FileTextIcon className="w-4 h-4 text-gray-400" />} />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
            label="Class"
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            options={classOptions} />

              <Select
            label="Section"
            value={filters.section}
            onChange={(e) => handleFilterChange('section', e.target.value)}
            options={sectionOptions} />

              <Select
            label="Department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            options={departmentOptions} />

            </div>
          </div>
      }

        {/* Search Results */}
        {(filters.searchQuery || hasActiveFilters) && !selectedStudent &&
      <div className="mt-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {filteredStudents.length > 0 ?
        filteredStudents.map((student) =>
        <div
          key={student.id}
          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => handleSelectStudent(student)}>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          SU ID: {student.suId} · GR: {student.grNo} · Class {student.class}-{student.section} · {student.department}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Select</Button>
                  </div>
                </div>
        ) :

        <div className="p-6 text-center text-gray-500">
                <SearchIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No students found matching your criteria</p>
              </div>
        }
          </div>
      }
      </Card>

      {/* Selected Student & Certificate Details */}
      {selectedStudent &&
    <Card className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Certificate Details</h3>

          {/* Selected Student */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-700">
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{selectedStudent.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <span>SU ID: {selectedStudent.suId}</span>
                    <span>GR: {selectedStudent.grNo}</span>
                    <span>Class: {selectedStudent.class}-{selectedStudent.section}</span>
                    <span>Roll: {selectedStudent.rollNo}</span>
                    <span>Dept: {selectedStudent.department}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Certificate Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
          label="Examination *"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          options={examOptions} />

            <Input
          label="Issue Date *"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)} />

            <Input
          label="Remarks (Optional)"
          placeholder="Any additional notes..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)} />

          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
          variant="primary"
          onClick={handleGenerateSingle}
          disabled={!selectedExam || isGeneratingSingle}>

              {isGeneratingSingle ?
          <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> Generating...</> :

          <><PlusIcon className="w-4 h-4 mr-2" /> Generate Certificate</>
          }
            </Button>
            <Button variant="outline" onClick={() => handlePreview(selectedStudent)} disabled={!selectedExam}>
              <EyeIcon className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" /> Print Directly
            </Button>
          </div>
        </Card>
    }
    </div>;


  // Render Bulk Issue Content
  const renderBulkIssue = () =>
  <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filter Students
          </h3>
          {hasActiveFilters &&
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <XIcon className="w-4 h-4 mr-1" /> Clear Filters
            </Button>
        }
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <Input
          placeholder="First Name"
          value={filters.firstName}
          onChange={(e) => handleFilterChange('firstName', e.target.value)}
          leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />} />

          <Input
          placeholder="Last Name"
          value={filters.lastName}
          onChange={(e) => handleFilterChange('lastName', e.target.value)}
          leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />} />

          <Input
          placeholder="SU ID"
          value={filters.suId}
          onChange={(e) => handleFilterChange('suId', e.target.value)}
          leftIcon={<HashIcon className="w-4 h-4 text-gray-400" />} />

          <Input
          placeholder="GR No"
          value={filters.grNo}
          onChange={(e) => handleFilterChange('grNo', e.target.value)}
          leftIcon={<FileTextIcon className="w-4 h-4 text-gray-400" />} />

          <Select
          value={filters.class}
          onChange={(e) => handleFilterChange('class', e.target.value)}
          options={classOptions} />

          <Select
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          options={departmentOptions} />

        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <Select
          label="Examination *"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          options={examOptions} />

          <Input
          label="Issue Date *"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)} />

          <Input
          label="Remarks (Optional)"
          placeholder="Any additional notes..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)} />

        </div>
      </Card>

      {/* Student Selection */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-900">Select Students</h3>
            <Badge variant="info">{filteredStudents.length} students</Badge>
            {selectedStudents.length > 0 &&
          <Badge variant="success">{selectedStudents.length} selected</Badge>
          }
          </div>
          <Button variant="ghost" size="sm" onClick={toggleAllStudents}>
            {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ?
          <><XIcon className="w-4 h-4 mr-1" /> Deselect All</> :

          <><CheckSquareIcon className="w-4 h-4 mr-1" /> Select All</>
          }
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                  <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={toggleAllStudents}
                  className="rounded border-gray-300 text-blue-600" />

                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SU ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GR No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ?
            filteredStudents.map((student) =>
            <tr
              key={student.id}
              className={`hover:bg-gray-50 ${selectedStudents.includes(student.id) ? 'bg-blue-50' : ''}`}>

                    <td className="px-4 py-3">
                      <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudentSelection(student.id)}
                  className="rounded border-gray-300 text-blue-600" />

                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium">{student.firstName[0]}{student.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">Roll: {student.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.suId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.grNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.class}-{student.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.department}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(student)}>
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
            ) :

            <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <SearchIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No students found matching your criteria</p>
                  </td>
                </tr>
            }
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {selectedStudents.length} of {filteredStudents.length} students selected
          </p>
          <div className="flex gap-3">
            <Button
            variant="outline"
            disabled={selectedStudents.length === 0}>

              <EyeIcon className="w-4 h-4 mr-2" /> Preview All
            </Button>
            <Button
            variant="primary"
            onClick={handleGenerateBulk}
            disabled={selectedStudents.length === 0 || !selectedExam || isGeneratingBulk}>

              {isGeneratingBulk ?
            <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> Generating...</> :

            <><PrinterIcon className="w-4 h-4 mr-2" /> Generate {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Certificates</>
            }
            </Button>
          </div>
        </div>
      </Card>
    </div>;


  // Render History Content
  const renderHistory = () =>
  <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Certificate Issue History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <PrinterIcon className="w-4 h-4 mr-1" /> Print
          </Button>
        </div>
      </div>

      {certificates.length > 0 ?
    <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SU ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GR No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Examination</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) =>
          <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{cert.certNo}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cert.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.suId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.grNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.class}-{cert.section}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.examName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.issueDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadgeVariant(cert.status)}>{cert.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><EyeIcon className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><PrinterIcon className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><DownloadIcon className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><CopyIcon className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
          )}
            </tbody>
          </table>
        </div> :

    <div className="text-center py-12">
          <FileTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-1">No Certificates Issued Yet</h4>
          <p className="text-sm text-gray-500">Start by generating certificates from the Single or Bulk Issue tabs.</p>
        </div>
    }
    </Card>;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AwardIcon className="w-7 h-7" />
            First Trial Certificates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate single or bulk first trial certificates
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="info">{certificates.length} Issued</Badge>
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => handleTabChange('single')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'single' ?
            'border-blue-600 text-blue-600' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }>

            <FileTextIcon className="w-4 h-4" />
            Single Issue
          </button>
          <button
            onClick={() => handleTabChange('bulk')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'bulk' ?
            'border-blue-600 text-blue-600' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }>

            <UsersIcon className="w-4 h-4" />
            Bulk Issue
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history' ?
            'border-blue-600 text-blue-600' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }>

            <BookOpenIcon className="w-4 h-4" />
            Issue History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'single' && renderSingleIssue()}
        {activeTab === 'bulk' && renderBulkIssue()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Certificate Preview"
        size="xl">

        {previewStudent &&
        <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="bg-white border-4 border-double border-gray-300 p-8 max-w-2xl mx-auto text-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">First Trial Certificate</h2>
                  <p className="text-sm text-gray-500">Certificate No: {generateCertificateNumber()}</p>
                </div>
                <div className="my-8">
                  <p className="text-lg text-gray-700">This is to certify that</p>
                  <p className="text-2xl font-bold text-blue-800 my-2">{previewStudent.name}</p>
                  <p className="text-gray-600">S/o {previewStudent.fatherName}</p>
                  <p className="text-gray-600">SU ID: {previewStudent.suId} | GR No: {previewStudent.grNo}</p>
                  <p className="text-lg text-gray-700 mt-4">
                    has appeared in the <span className="font-semibold">{selectedExam || 'Examination'}</span>
                  </p>
                  <p className="text-gray-600">Class {previewStudent.class}-{previewStudent.section}</p>
                </div>
                <div className="mt-8 flex justify-between text-sm text-gray-600">
                  <span>Date: {issueDate}</span>
                  <span>Principal Signature</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
              <Button variant="outline"><PrinterIcon className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="outline"><DownloadIcon className="w-4 h-4 mr-2" /> Download</Button>
            </div>
          </div>
        }
      </Modal>

      {/* Bulk Success Modal */}
      <Modal
        isOpen={showBulkSuccess}
        onClose={() => {setShowBulkSuccess(false);setSelectedStudents([]);setSelectedExam('');}}
        title="Bulk Generation Complete"
        size="lg">

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{selectedStudents.length} Certificates Generated</h3>
            <p className="text-sm text-gray-500">All certificates are ready for printing</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{selectedStudents.length}</p>
              <p className="text-xs text-gray-500">Successful</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline"><DownloadIcon className="w-4 h-4 mr-2" /> Download All</Button>
            <Button variant="outline"><PrinterIcon className="w-4 h-4 mr-2" /> Print All</Button>
            <Button variant="primary" onClick={() => {setShowBulkSuccess(false);setSelectedStudents([]);setSelectedExam('');}}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export default FirstTrialCombined;