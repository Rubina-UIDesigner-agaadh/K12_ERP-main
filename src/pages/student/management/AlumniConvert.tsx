import React, { useMemo, useState } from 'react';
import {
  GraduationCap,
  CheckSquare,
  Square,
  Search,
  AlertCircle,
  UserCheck,
  FileText,
  Users,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw,
  Download,
  Printer,
  User,
  Hash,
  Building2,
  BookOpen,
  Calendar,
  Info,
  Eye,
  ArrowRight,
  Loader2 } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';

// --- Types ---
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  suId: string;
  grNo: string;
  admissionNo: string;
  class: string;
  section: string;
  department: string;
  batch: string;
  tags: string[];
  status: string;
  leavingDate: string;
  reason: string;
  fatherName: string;
  motherName: string;
  contact: string;
  email: string;
  address: string;
  tcIssued: boolean;
  gender: string;
  dob: string;
}

interface AuditLog {
  id: number;
  studentName: string;
  originalId: string;
  alumniId: string;
  method: string;
  performedBy: string;
  date: string;
  status: string;
}

type TabType = 'single' | 'bulk' | 'audit';

// --- Mock Data ---
const MOCK_STUDENTS: Student[] = [
{
  id: 1,
  firstName: 'Rohan',
  lastName: 'Verma',
  name: 'Rohan Verma',
  suId: 'SU-2023-001',
  grNo: 'GR-10001',
  admissionNo: 'ADM-1001',
  class: '12',
  section: 'A',
  department: 'Science',
  batch: '2023-2024',
  tags: ['School Captain', 'Debate Winner'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Suresh Verma',
  motherName: 'Anita Verma',
  contact: '9876543201',
  email: 'rohan.verma@example.com',
  address: '123, Main Street, City',
  tcIssued: false,
  gender: 'Male',
  dob: '2006-05-15'
},
{
  id: 2,
  firstName: 'Aditi',
  lastName: 'Rao',
  name: 'Aditi Rao',
  suId: 'SU-2023-002',
  grNo: 'GR-10002',
  admissionNo: 'ADM-1002',
  class: '12',
  section: 'A',
  department: 'Science',
  batch: '2023-2024',
  tags: ['Sports Captain'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Vikram Rao',
  motherName: 'Priya Rao',
  contact: '9876543202',
  email: 'aditi.rao@example.com',
  address: '456, Park Avenue, City',
  tcIssued: true,
  gender: 'Female',
  dob: '2006-08-22'
},
{
  id: 3,
  firstName: 'Kabir',
  lastName: 'Singh',
  name: 'Kabir Singh',
  suId: 'SU-2023-003',
  grNo: 'GR-10003',
  admissionNo: 'ADM-1003',
  class: '12',
  section: 'B',
  department: 'Commerce',
  batch: '2023-2024',
  tags: ['Science Club'],
  status: 'TC Issued',
  leavingDate: '2024-02-15',
  reason: 'Transfer',
  fatherName: 'Raj Singh',
  motherName: 'Meena Singh',
  contact: '9876543203',
  email: 'kabir.singh@example.com',
  address: '789, Lake View, City',
  tcIssued: true,
  gender: 'Male',
  dob: '2006-03-10'
},
{
  id: 4,
  firstName: 'Meera',
  lastName: 'Patel',
  name: 'Meera Patel',
  suId: 'SU-2023-004',
  grNo: 'GR-10004',
  admissionNo: 'ADM-1004',
  class: '12',
  section: 'B',
  department: 'Commerce',
  batch: '2023-2024',
  tags: [],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Amit Patel',
  motherName: 'Suman Patel',
  contact: '9876543204',
  email: 'meera.patel@example.com',
  address: '321, Hill Road, City',
  tcIssued: false,
  gender: 'Female',
  dob: '2006-11-28'
},
{
  id: 5,
  firstName: 'Arjun',
  lastName: 'Gupta',
  name: 'Arjun Gupta',
  suId: 'SU-2023-005',
  grNo: 'GR-10005',
  admissionNo: 'ADM-1005',
  class: '12',
  section: 'C',
  department: 'Arts',
  batch: '2023-2024',
  tags: ['Music Club', 'Drama'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Rakesh Gupta',
  motherName: 'Kavita Gupta',
  contact: '9876543205',
  email: 'arjun.gupta@example.com',
  address: '567, Garden Colony, City',
  tcIssued: false,
  gender: 'Male',
  dob: '2006-07-19'
},
{
  id: 6,
  firstName: 'Zara',
  lastName: 'Khan',
  name: 'Zara Khan',
  suId: 'SU-2023-006',
  grNo: 'GR-10006',
  admissionNo: 'ADM-1006',
  class: '12',
  section: 'C',
  department: 'Arts',
  batch: '2023-2024',
  tags: ['Head Girl', 'Dance'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Imran Khan',
  motherName: 'Fatima Khan',
  contact: '9876543206',
  email: 'zara.khan@example.com',
  address: '890, River Side, City',
  tcIssued: false,
  gender: 'Female',
  dob: '2006-01-05'
},
{
  id: 7,
  firstName: 'Vihaan',
  lastName: 'Kumar',
  name: 'Vihaan Kumar',
  suId: 'SU-2023-007',
  grNo: 'GR-10007',
  admissionNo: 'ADM-1007',
  class: '11',
  section: 'A',
  department: 'Science',
  batch: '2023-2024',
  tags: ['Math Olympiad'],
  status: 'TC Issued',
  leavingDate: '2024-01-20',
  reason: 'Family Relocation',
  fatherName: 'Ajay Kumar',
  motherName: 'Neha Kumar',
  contact: '9876543207',
  email: 'vihaan.kumar@example.com',
  address: '234, Temple Road, City',
  tcIssued: true,
  gender: 'Male',
  dob: '2007-09-12'
},
{
  id: 8,
  firstName: 'Ananya',
  lastName: 'Sharma',
  name: 'Ananya Sharma',
  suId: 'SU-2023-008',
  grNo: 'GR-10008',
  admissionNo: 'ADM-1008',
  class: '10',
  section: 'A',
  department: 'General',
  batch: '2023-2024',
  tags: ['Topper'],
  status: 'TC Issued',
  leavingDate: '2024-02-28',
  reason: 'Transfer to Other School',
  fatherName: 'Dinesh Sharma',
  motherName: 'Geeta Sharma',
  contact: '9876543208',
  email: 'ananya.sharma@example.com',
  address: '678, Market Street, City',
  tcIssued: true,
  gender: 'Female',
  dob: '2008-04-25'
},
{
  id: 9,
  firstName: 'Ishaan',
  lastName: 'Mehta',
  name: 'Ishaan Mehta',
  suId: 'SU-2023-009',
  grNo: 'GR-10009',
  admissionNo: 'ADM-1009',
  class: '12',
  section: 'A',
  department: 'Science',
  batch: '2023-2024',
  tags: ['Chess Champion'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Prakash Mehta',
  motherName: 'Ritu Mehta',
  contact: '9876543209',
  email: 'ishaan.mehta@example.com',
  address: '901, College Road, City',
  tcIssued: false,
  gender: 'Male',
  dob: '2006-12-08'
},
{
  id: 10,
  firstName: 'Priya',
  lastName: 'Reddy',
  name: 'Priya Reddy',
  suId: 'SU-2023-010',
  grNo: 'GR-10010',
  admissionNo: 'ADM-1010',
  class: '12',
  section: 'B',
  department: 'Commerce',
  batch: '2023-2024',
  tags: ['Accountancy Topper'],
  status: 'Passed Out',
  leavingDate: '2024-03-31',
  reason: 'Course Completed',
  fatherName: 'Suresh Reddy',
  motherName: 'Lakshmi Reddy',
  contact: '9876543210',
  email: 'priya.reddy@example.com',
  address: '345, Station Road, City',
  tcIssued: false,
  gender: 'Female',
  dob: '2006-06-30'
}];


const MOCK_AUDIT_LOGS: AuditLog[] = [
{
  id: 101,
  studentName: 'Arjun Gupta',
  originalId: 'SU-2022-055',
  alumniId: 'ALM-2024-001',
  method: 'Single',
  performedBy: 'Admin User (Principal)',
  date: '2024-04-01 10:30 AM',
  status: 'Active'
},
{
  id: 102,
  studentName: 'Zara Khan',
  originalId: 'SU-2022-089',
  alumniId: 'ALM-2024-002',
  method: 'Bulk',
  performedBy: 'Admin User (Bulk)',
  date: '2024-04-02 09:15 AM',
  status: 'Active'
},
{
  id: 103,
  studentName: 'Vihaan Kumar',
  originalId: 'SU-2022-012',
  alumniId: 'ALM-2024-003',
  method: 'Single',
  performedBy: 'Admin User (VP)',
  date: '2024-04-02 11:00 AM',
  status: 'Reverted'
},
{
  id: 104,
  studentName: 'Meera Patel',
  originalId: 'SU-2023-004',
  alumniId: 'ALM-2024-004',
  method: 'Single',
  performedBy: 'Admin User (Registrar)',
  date: '2024-04-03 02:45 PM',
  status: 'Active'
},
{
  id: 105,
  studentName: 'Kabir Singh',
  originalId: 'SU-2023-003',
  alumniId: 'ALM-2024-005',
  method: 'Single',
  performedBy: 'Admin User (Principal)',
  date: '2024-04-03 04:20 PM',
  status: 'Active'
}];


// Filter Options
const classOptions = [
{ value: '', label: 'All Classes' },
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


const batchOptions = [
{ value: '', label: 'All Batches' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' },
{ value: '2021-2022', label: '2021-2022' }];


const statusOptions = [
{ value: '', label: 'All Status' },
{ value: 'Passed Out', label: 'Passed Out' },
{ value: 'TC Issued', label: 'TC Issued' }];


const tcIssuedOptions = [
{ value: '', label: 'All' },
{ value: 'true', label: 'TC Issued' },
{ value: 'false', label: 'TC Not Issued' }];


export function AlumniConvertPage() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  // --- Filter States ---
  const [filters, setFilters] = useState({
    searchQuery: '',
    firstName: '',
    lastName: '',
    suId: '',
    grNo: '',
    admissionNo: '',
    class: '',
    section: '',
    department: '',
    batch: '',
    status: '',
    tcIssued: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // --- State: Single Convert ---
  const [selectedStudentForConvert, setSelectedStudentForConvert] = useState<Student | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // --- State: Bulk Convert ---
  const [isBulkPanelOpen, setIsBulkPanelOpen] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<number[]>([]);
  const [isBulkSuccessOpen, setIsBulkSuccessOpen] = useState(false);
  const [bulkFilters, setBulkFilters] = useState({
    class: '',
    section: '',
    department: '',
    batch: '',
    status: ''
  });

  // --- State: Audit ---
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // --- Filter Logic ---
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      // Quick search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.suId.toLowerCase().includes(query) ||
        student.grNo.toLowerCase().includes(query) ||
        student.admissionNo.toLowerCase().includes(query) ||
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // First Name filter
      if (filters.firstName) {
        if (!student.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) {
          return false;
        }
      }

      // Last Name filter
      if (filters.lastName) {
        if (!student.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) {
          return false;
        }
      }

      // SU ID filter
      if (filters.suId) {
        if (!student.suId.toLowerCase().includes(filters.suId.toLowerCase())) {
          return false;
        }
      }

      // GR No filter
      if (filters.grNo) {
        if (!student.grNo.toLowerCase().includes(filters.grNo.toLowerCase())) {
          return false;
        }
      }

      // Admission No filter
      if (filters.admissionNo) {
        if (!student.admissionNo.toLowerCase().includes(filters.admissionNo.toLowerCase())) {
          return false;
        }
      }

      // Class filter
      if (filters.class && student.class !== filters.class) {
        return false;
      }

      // Section filter
      if (filters.section && student.section !== filters.section) {
        return false;
      }

      // Department filter
      if (filters.department && student.department !== filters.department) {
        return false;
      }

      // Batch filter
      if (filters.batch && student.batch !== filters.batch) {
        return false;
      }

      // Status filter
      if (filters.status && student.status !== filters.status) {
        return false;
      }

      // TC Issued filter
      if (filters.tcIssued) {
        const tcValue = filters.tcIssued === 'true';
        if (student.tcIssued !== tcValue) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Bulk filtered students
  const bulkFilteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      if (bulkFilters.class && student.class !== bulkFilters.class) return false;
      if (bulkFilters.section && student.section !== bulkFilters.section) return false;
      if (bulkFilters.department && student.department !== bulkFilters.department) return false;
      if (bulkFilters.batch && student.batch !== bulkFilters.batch) return false;
      if (bulkFilters.status && student.status !== bulkFilters.status) return false;
      return true;
    });
  }, [bulkFilters]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    if (!auditSearchQuery) return auditLogs;
    const query = auditSearchQuery.toLowerCase();
    return auditLogs.filter(
      (log) =>
      log.studentName.toLowerCase().includes(query) ||
      log.originalId.toLowerCase().includes(query) ||
      log.alumniId.toLowerCase().includes(query)
    );
  }, [auditLogs, auditSearchQuery]);

  // --- Handlers ---
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
      admissionNo: '',
      class: '',
      section: '',
      department: '',
      batch: '',
      status: '',
      tcIssued: ''
    });
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };

  const handleSingleConvertClick = (student: Student) => {
    setSelectedStudentForConvert(student);
    setShowPreview(false);
  };

  const handleConvertConfirm = () => {
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      // Add to audit logs
      if (selectedStudentForConvert) {
        const newLog: AuditLog = {
          id: Date.now(),
          studentName: selectedStudentForConvert.name,
          originalId: selectedStudentForConvert.suId,
          alumniId: `ALM-${new Date().getFullYear()}-${String(auditLogs.length + 1).padStart(3, '0')}`,
          method: 'Single',
          performedBy: 'Admin User',
          date: new Date().toLocaleString(),
          status: 'Active'
        };
        setAuditLogs((prev) => [newLog, ...prev]);
      }
      setSelectedStudentForConvert(null);
    }, 1500);
  };

  const handleBulkToggle = (id: number) => {
    setBulkSelection((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkSelectAll = () => {
    if (bulkSelection.length === bulkFilteredStudents.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(bulkFilteredStudents.map((s) => s.id));
    }
  };

  const handleBulkConvertAction = () => {
    setIsBulkPanelOpen(false);
    // Add all to audit logs
    const selectedStudents = MOCK_STUDENTS.filter((s) => bulkSelection.includes(s.id));
    const newLogs: AuditLog[] = selectedStudents.map((student, index) => ({
      id: Date.now() + index,
      studentName: student.name,
      originalId: student.suId,
      alumniId: `ALM-${new Date().getFullYear()}-${String(auditLogs.length + index + 1).padStart(3, '0')}`,
      method: 'Bulk',
      performedBy: 'Admin User (Bulk)',
      date: new Date().toLocaleString(),
      status: 'Active'
    }));
    setAuditLogs((prev) => [...newLogs, ...prev]);
    setIsBulkSuccessOpen(true);
  };

  const handleRevert = (logId: number) => {
    if (
    window.confirm(
      'This will move the alumni record back to a student record and unlock archived data. Confirm revert?'
    ))
    {
      setAuditLogs((prev) =>
      prev.map((log) =>
      log.id === logId ? { ...log, status: 'Reverted' } : log
      )
      );
    }
  };

  const handleClearBulkFilters = () => {
    setBulkFilters({
      class: '',
      section: '',
      department: '',
      batch: '',
      status: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  // --- Render Functions ---
  const renderSingleConvertTab = () =>
  <div className="space-y-6 pb-6">
      {/* Search and Filter Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Search Students</h3>
          </div>
          <div className="flex gap-2">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

              {showAdvancedFilters ?
            <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide Filters
                </> :

            <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Advanced Filters
                </>
            }
            </Button>
            {hasActiveFilters &&
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
          }
          </div>
        </div>

        {/* Quick Search */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              placeholder="Quick search by name, SU ID, GR No, or Admission No..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>
          </div>
          <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
            {isSearching ?
          <Loader2 className="w-4 h-4 animate-spin" /> :

          <Search className="w-4 h-4" />
          }
            <span className="ml-2">Search</span>
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('bulk')}>
            <Users className="w-4 h-4 mr-2" />
            Bulk Convert
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
      <div className="pt-4 border-t border-gray-200 space-y-4">
            {/* Row 1: Name Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Student Name</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
              placeholder="First Name"
              value={filters.firstName}
              onChange={(e) => handleFilterChange('firstName', e.target.value)}
              leftIcon={<User className="w-4 h-4 text-gray-400" />} />

                <Input
              placeholder="Last Name"
              value={filters.lastName}
              onChange={(e) => handleFilterChange('lastName', e.target.value)}
              leftIcon={<User className="w-4 h-4 text-gray-400" />} />

              </div>
            </div>

            {/* Row 2: ID Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Student Identifiers</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
              placeholder="SU ID (e.g., SU-2023-001)"
              value={filters.suId}
              onChange={(e) => handleFilterChange('suId', e.target.value)}
              leftIcon={<Hash className="w-4 h-4 text-gray-400" />} />

                <Input
              placeholder="GR No (e.g., GR-10001)"
              value={filters.grNo}
              onChange={(e) => handleFilterChange('grNo', e.target.value)}
              leftIcon={<FileText className="w-4 h-4 text-gray-400" />} />

                <Input
              placeholder="Admission No (e.g., ADM-1001)"
              value={filters.admissionNo}
              onChange={(e) => handleFilterChange('admissionNo', e.target.value)}
              leftIcon={<BookOpen className="w-4 h-4 text-gray-400" />} />

              </div>
            </div>

            {/* Row 3: Class Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Class & Section</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
              options={classOptions} />

                <Select
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              options={sectionOptions} />

                <Select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              options={departmentOptions} />

                <Select
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
              options={batchOptions} />

              </div>
            </div>

            {/* Row 4: Status Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={statusOptions} />

                <Select
              value={filters.tcIssued}
              onChange={(e) => handleFilterChange('tcIssued', e.target.value)}
              options={tcIssuedOptions} />

              </div>
            </div>
          </div>
      }
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Eligible Students
          </h3>
          <Badge variant="info">{filteredStudents.length} found</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ?
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) =>
      <div
        key={student.id}
        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-300"
        onClick={() => handleSingleConvertClick(student)}>

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </h4>
                    <p className="text-xs text-gray-500">{student.suId}</p>
                  </div>
                </div>
                <Badge
            variant={student.status === 'Passed Out' ? 'success' : 'warning'}>

                  {student.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>
                  <p className="text-xs text-gray-400">GR No</p>
                  <p className="font-medium">{student.grNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Admission No</p>
                  <p className="font-medium">{student.admissionNo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Class</p>
                  <p className="font-medium">{student.class}-{student.section}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Department</p>
                  <p className="font-medium">{student.department}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {student.tags.slice(0, 2).map((tag, idx) =>
            <span
              key={idx}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">

                      {tag}
                    </span>
            )}
                  {student.tags.length > 2 &&
            <span className="text-xs text-gray-400">+{student.tags.length - 2}</span>
            }
                </div>
                <div className="flex items-center gap-1">
                  {student.tcIssued &&
            <Badge variant="warning" className="text-xs">TC</Badge>
            }
                  <Button variant="ghost" size="sm" className="p-1">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
      )}
        </div> :

    <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700">No Students Found</h4>
            <p className="text-sm text-gray-500 max-w-md">
              No students match your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
    }
    </div>;


  const renderBulkConvertTab = () =>
  <div className="space-y-6 pb-6">
      {/* Intro Block */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-blue-900">
              Bulk Alumni Conversion
            </h2>
            <p className="text-sm text-blue-700 mt-1">
              Select multiple students based on class, department, or status and convert them to alumni in one action.
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsBulkPanelOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Open Bulk Panel
          </Button>
        </div>
      </Card>

      {/* Quick Filter Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
          onClick={() => {
            setBulkFilters({ ...bulkFilters, status: 'Passed Out', class: '12' });
            setIsBulkPanelOpen(true);
          }}
          className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm transition-all">

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Class XII - Passed Out</h4>
                <p className="text-xs text-gray-500">2023-2024 Batch</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">~{MOCK_STUDENTS.filter((s) => s.class === '12' && s.status === 'Passed Out').length} Eligible Students</p>
          </div>

          <div
          onClick={() => {
            setBulkFilters({ ...bulkFilters, status: 'TC Issued' });
            setIsBulkPanelOpen(true);
          }}
          className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm transition-all">

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">TC Issued Students</h4>
                <p className="text-xs text-gray-500">All Classes</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">~{MOCK_STUDENTS.filter((s) => s.tcIssued).length} Eligible Students</p>
          </div>

          <div
          onClick={() => {
            setBulkFilters({ ...bulkFilters, department: 'Science' });
            setIsBulkPanelOpen(true);
          }}
          className="bg-white p-4 rounded-lg border hover:border-blue-400 cursor-pointer shadow-sm transition-all">

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Science Department</h4>
                <p className="text-xs text-gray-500">All Classes</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">~{MOCK_STUDENTS.filter((s) => s.department === 'Science').length} Eligible Students</p>
          </div>
        </div>
      </div>

      {/* Department-wise Summary */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Department-wise Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Science', 'Commerce', 'Arts', 'General'].map((dept) => {
          const count = MOCK_STUDENTS.filter((s) => s.department === dept).length;
          return (
            <div
              key={dept}
              className="p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setBulkFilters({ ...bulkFilters, department: dept });
                setIsBulkPanelOpen(true);
              }}>

                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{dept}</p>
              </div>);

        })}
        </div>
      </Card>
    </div>;


  const renderAuditTrailTab = () =>
  <div className="space-y-6 pb-6">
      {/* Summary */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <Badge variant="success" className="px-3 py-1">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Active: {auditLogs.filter((l) => l.status === 'Active').length}
          </Badge>
          <Badge variant="danger" className="px-3 py-1">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reverted: {auditLogs.filter((l) => l.status === 'Reverted').length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
            type="text"
            placeholder="Search audit logs..."
            value={auditSearchQuery}
            onChange={(e) => setAuditSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Audit Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumni ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuditLogs.map((log) =>
            <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{log.studentName}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {log.originalId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {log.alumniId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={log.method === 'Single' ? 'info' : 'default'}>
                      {log.method}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {log.performedBy}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {log.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={log.status === 'Active' ? 'success' : 'danger'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {log.status === 'Active' &&
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleRevert(log.id)}>

                        <RotateCcw className="w-4 h-4 mr-1" />
                        Revert
                      </Button>
                }
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;


  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="p-6 pb-2 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              Alumni Convert
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Convert students to alumni with comprehensive search and filters
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="warning" className="px-3 py-1">
              {MOCK_STUDENTS.length} Pending
            </Badge>
            <Badge variant="success" className="px-3 py-1">
              {auditLogs.filter((l) => l.status === 'Active').length} Converted
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 border-b border-gray-100">
          {[
          { id: 'single', label: 'Single Convert', icon: User },
          { id: 'bulk', label: 'Bulk Convert', icon: Users },
          { id: 'audit', label: 'Audit Trail', icon: Clock }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === tab.id ?
            'text-blue-600' :
            'text-gray-500 hover:text-gray-700'}`
            }>

              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id &&
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            }
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'single' && renderSingleConvertTab()}
        {activeTab === 'bulk' && renderBulkConvertTab()}
        {activeTab === 'audit' && renderAuditTrailTab()}
      </div>

      {/* Single Convert Modal */}
      <Modal
        isOpen={!!selectedStudentForConvert}
        onClose={() => setSelectedStudentForConvert(null)}
        title="Convert to Alumni"
        size="lg"
        footer={
        <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setSelectedStudentForConvert(null)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={handleConvertConfirm}
            disabled={isConverting}>

              {isConverting ?
            <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </> :

            <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Convert & Notify
                </>
            }
            </Button>
          </div>
        }>

        {selectedStudentForConvert &&
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Student Info Header */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-700">
                    {selectedStudentForConvert.firstName[0]}{selectedStudentForConvert.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{selectedStudentForConvert.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-sm text-gray-600">SU ID: {selectedStudentForConvert.suId}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-600">GR: {selectedStudentForConvert.grNo}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-600">Adm: {selectedStudentForConvert.admissionNo}</span>
                  </div>
                </div>
                <Badge variant={selectedStudentForConvert.status === 'Passed Out' ? 'success' : 'warning'}>
                  {selectedStudentForConvert.status}
                </Badge>
              </div>
            </div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Class & Section</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.class}-{selectedStudentForConvert.section}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Batch</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.batch}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Father's Name</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.fatherName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Leaving Date</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.leavingDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="font-medium text-gray-900">{selectedStudentForConvert.reason}</p>
              </div>
            </div>

            {/* Conversion Settings */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">
                Conversion Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                label="Auto-Generated Alumni ID"
                defaultValue={`ALM-${new Date().getFullYear()}-${String(auditLogs.length + 1).padStart(3, '0')}`}
                readOnly
                className="bg-gray-50" />

                <Select
                label="Alumni Category"
                options={[
                { value: 'regular', label: 'Regular' },
                { value: 'honorary', label: 'Honorary' },
                { value: 'staff', label: 'Staff Child' }]
                } />

                <Select
                label="Profile Visibility"
                options={[
                { value: 'public', label: 'Visible to all alumni' },
                { value: 'private', label: 'Private' }]
                } />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Records to Archive
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {['Academic', 'Attendance', 'Fees', 'Library', 'Transport'].map((record) =>
                  <label key={record} className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                        {record}
                      </label>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                label="Email ID"
                defaultValue={selectedStudentForConvert.email} />

                <Input
                label="Mobile Number"
                defaultValue={selectedStudentForConvert.contact} />

              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">
                Notification Settings
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  Create Alumni Login
                </label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Email</Button>
                <Button variant="outline" size="sm">WhatsApp</Button>
                <Button variant="primary" size="sm">Both</Button>
                <Button variant="ghost" size="sm">None</Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border rounded-lg">
              <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex justify-between items-center p-3 bg-gray-50 text-sm font-semibold text-gray-700">

                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Conversion Preview
                </span>
                {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showPreview &&
            <div className="p-4 space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-green-800 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Will be moved to Alumni Profile:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Contact Details (Email, Phone)</li>
                      <li>Achievements & Tags</li>
                      <li>Profile Photo</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Will be locked (Archived):
                    </p>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Academic Records (Class {selectedStudentForConvert.class})</li>
                      <li>Attendance History</li>
                      <li>Fee Records</li>
                      <li>Library Records</li>
                    </ul>
                  </div>
                </div>
            }
            </div>
          </div>
        }
      </Modal>

      {/* Bulk Convert Modal */}
      <Modal
        isOpen={isBulkPanelOpen}
        onClose={() => setIsBulkPanelOpen(false)}
        title="Bulk Alumni Conversion"
        size="xl"
        footer={
        <div className="flex justify-between items-center w-full">
            <span className="text-sm text-gray-600 font-medium">
              {bulkSelection.length} students selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsBulkPanelOpen(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              disabled={bulkSelection.length === 0}
              onClick={handleBulkConvertAction}>

                <CheckCircle2 className="w-4 h-4 mr-2" />
                Convert {bulkSelection.length} Students
              </Button>
            </div>
          </div>
        }>

        <div className="space-y-4 h-[60vh] flex flex-col">
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pb-4 border-b">
            <Select
              value={bulkFilters.class}
              onChange={(e) => setBulkFilters({ ...bulkFilters, class: e.target.value })}
              options={classOptions} />

            <Select
              value={bulkFilters.section}
              onChange={(e) => setBulkFilters({ ...bulkFilters, section: e.target.value })}
              options={sectionOptions} />

            <Select
              value={bulkFilters.department}
              onChange={(e) => setBulkFilters({ ...bulkFilters, department: e.target.value })}
              options={departmentOptions} />

            <Select
              value={bulkFilters.status}
              onChange={(e) => setBulkFilters({ ...bulkFilters, status: e.target.value })}
              options={statusOptions} />

            <Button variant="ghost" onClick={handleClearBulkFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>

          {/* Select All */}
          <div className="flex justify-between items-center px-2">
            <label
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={handleBulkSelectAll}>

              {bulkSelection.length === bulkFilteredStudents.length && bulkFilteredStudents.length > 0 ?
              <CheckSquare className="w-5 h-5 text-blue-600" /> :

              <Square className="w-5 h-5 text-gray-400" />
              }
              Select All ({bulkFilteredStudents.length})
            </label>
            <span className="text-xs text-gray-500">{bulkSelection.length} selected</span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">
                    Select
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    IDs
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Class
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bulkFilteredStudents.map((student) =>
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                  bulkSelection.includes(student.id) ? 'bg-blue-50' : ''}`
                  }
                  onClick={() => handleBulkToggle(student.id)}>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {bulkSelection.includes(student.id) ?
                    <CheckSquare className="w-5 h-5 text-blue-600" /> :

                    <Square className="w-5 h-5 text-gray-400" />
                    }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.batch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs text-gray-600">{student.suId}</p>
                      <p className="text-xs text-gray-400">{student.grNo}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {student.class}-{student.section}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {student.department}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={student.status === 'Passed Out' ? 'success' : 'warning'}>
                        {student.status}
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Bulk Success Modal */}
      <Modal
        isOpen={isBulkSuccessOpen}
        onClose={() => {
          setIsBulkSuccessOpen(false);
          setBulkSelection([]);
        }}
        title="Bulk Conversion Complete"
        size="lg">

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{bulkSelection.length}</p>
              <p className="text-sm text-green-800">Successfully Converted</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">0</p>
              <p className="text-sm text-red-800">Failed</p>
            </div>
          </div>

          <div className="border rounded-lg max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Original ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">New Alumni ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_STUDENTS.filter((s) => bulkSelection.includes(s.id)).map((s, index) =>
                <tr key={s.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{s.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{s.suId}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      ALM-{new Date().getFullYear()}-{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-4 py-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsBulkSuccessOpen(false);
                setBulkSelection([]);
                setActiveTab('audit');
              }}>

              View Audit Trail
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}

export { AlumniConvertPage as AlumniConvert };
export default AlumniConvertPage;