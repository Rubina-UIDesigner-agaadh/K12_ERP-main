import React, { useState, useMemo } from 'react';
import {
  Search, Save, Download, Filter, GraduationCap, ArrowRight, Mail, FileText, ChevronDown, ChevronUp,
  AlertCircle, Users, Bus, Activity, RefreshCw, Eye, Printer, CheckCircle, Clock, BookOpen, Shield,
  Heart, Home, Phone, DollarSign, Calendar, Tag, Award, UserCheck, Info, Building2, CalendarDays } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';

// --- Types ---
interface Student {
  id: number;name: string;suId: string;grNo: string;class: string;section: string;department: string;
  status: string;feeStatus: string;parentMobile: string;gender: string;category: string;socialCategory: string;
  admissionType: string;ews: string;rte: string;minorityStatus: string;disability: string;disabilityType: string;
  religion: string;caste: string;transport: string;hostel: string;scholarship: string;attendance: number;
  fatherName: string;motherName: string;dob: string;bloodGroup: string;admissionYear: string;
  branch: string;batch: string;
}

interface FilterState {
  branches: string[];batch: string;studentName: string;admissionNo: string;suId: string;grNo: string;
  rollNumber: string;admissionYear: string;admissionType: string;status: string;academicYear: string;
  class: string;section: string;department: string;stream: string;resultStatus: string;percentageFrom: string;
  percentageTo: string;socialCategory: string;ews: string;rte: string;minorityStatus: string;disability: string;
  disabilityType: string;studentStatus: string;hostelDayScholar: string;transportUser: string;libraryMember: string;
  gender: string;dobFrom: string;dobTo: string;religion: string;caste: string;bloodGroup: string;
  nationality: string;motherTongue: string;fatherName: string;motherName: string;parentMobile: string;
  parentEmail: string;guardianType: string;feeStatus: string;outstandingFrom: string;outstandingTo: string;
  scholarship: string;freeshipRte: string;attendanceFrom: string;attendanceTo: string;chronicAbsentee: string;
  disciplineCases: string;lastAttendanceDate: string;transportRoute: string;busNumber: string;hostelName: string;
  roomNumber: string;medicalAlert: string;specialNeeds: string;allergiesRecorded: string;tags: string[];
}

const branches = [
{ id: 'main', name: 'Main Campus', color: 'blue' },
{ id: 'north', name: 'North Branch', color: 'emerald' },
{ id: 'south', name: 'South Branch', color: 'violet' },
{ id: 'east', name: 'East Branch', color: 'amber' }];


const batches = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

const branchColors: Record<string, string> = { main: 'bg-blue-500', north: 'bg-emerald-500', south: 'bg-violet-500', east: 'bg-amber-500' };

const initialFilters: FilterState = {
  branches: branches.map((b) => b.id), batch: '2024-25', studentName: '', admissionNo: '', suId: '', grNo: '',
  rollNumber: '', admissionYear: '', admissionType: '', status: '', academicYear: '2024-2025', class: '',
  section: '', department: '', stream: '', resultStatus: '', percentageFrom: '', percentageTo: '',
  socialCategory: '', ews: '', rte: '', minorityStatus: '', disability: '', disabilityType: '',
  studentStatus: '', hostelDayScholar: '', transportUser: '', libraryMember: '', gender: '', dobFrom: '',
  dobTo: '', religion: '', caste: '', bloodGroup: '', nationality: '', motherTongue: '', fatherName: '',
  motherName: '', parentMobile: '', parentEmail: '', guardianType: '', feeStatus: '', outstandingFrom: '',
  outstandingTo: '', scholarship: '', freeshipRte: '', attendanceFrom: '', attendanceTo: '', chronicAbsentee: '',
  disciplineCases: '', lastAttendanceDate: '', transportRoute: '', busNumber: '', hostelName: '', roomNumber: '',
  medicalAlert: '', specialNeeds: '', allergiesRecorded: '', tags: []
};

// --- Mock Data ---
const MOCK_RESULTS: Student[] = [
{ id: 1, name: 'Aarav Patel', suId: 'SU-2024-001', grNo: 'GR-1001', class: '10', section: 'A', department: 'Science', status: 'Active', feeStatus: 'Paid', parentMobile: '9876543210', gender: 'Male', category: 'General', socialCategory: 'General', admissionType: 'Regular', ews: 'No', rte: 'No', minorityStatus: 'No', disability: 'No', disabilityType: '', religion: 'Hindu', caste: 'Patel', transport: 'Route 5', hostel: 'No', scholarship: 'No', attendance: 92, fatherName: 'Rajesh Patel', motherName: 'Priya Patel', dob: '2008-05-15', bloodGroup: 'B+', admissionYear: '2024', branch: 'main', batch: '2024-25' },
{ id: 2, name: 'Zara Khan', suId: 'SU-2024-002', grNo: 'GR-1005', class: '10', section: 'A', department: 'Commerce', status: 'Active', feeStatus: 'Due', parentMobile: '9876543211', gender: 'Female', category: 'OBC', socialCategory: 'OBC', admissionType: 'RTE', ews: 'No', rte: 'Yes', minorityStatus: 'Yes', disability: 'No', disabilityType: '', religion: 'Islam', caste: 'Khan', transport: 'No', hostel: 'No', scholarship: 'Yes', attendance: 88, fatherName: 'Ahmed Khan', motherName: 'Fatima Khan', dob: '2008-08-22', bloodGroup: 'A+', admissionYear: '2024', branch: 'north', batch: '2024-25' },
{ id: 3, name: 'Rohan Verma', suId: 'SU-2023-003', grNo: 'GR-1102', class: '12', section: 'B', department: 'Science', status: 'Passed Out', feeStatus: 'Paid', parentMobile: '9876543212', gender: 'Male', category: 'General', socialCategory: 'General', admissionType: 'Regular', ews: 'Yes', rte: 'No', minorityStatus: 'No', disability: 'No', disabilityType: '', religion: 'Hindu', caste: 'Verma', transport: 'Hostel', hostel: 'Boys Hostel A', scholarship: 'Merit', attendance: 95, fatherName: 'Suresh Verma', motherName: 'Kavita Verma', dob: '2006-03-10', bloodGroup: 'O+', admissionYear: '2023', branch: 'main', batch: '2023-24' },
{ id: 4, name: 'Ishita Sharma', suId: 'SU-2023-004', grNo: 'GR-1150', class: '12', section: 'B', department: 'Arts', status: 'TC Issued', feeStatus: 'Paid', parentMobile: '9876543213', gender: 'Female', category: 'General', socialCategory: 'General', admissionType: 'Transfer', ews: 'No', rte: 'No', minorityStatus: 'No', disability: 'No', disabilityType: '', religion: 'Hindu', caste: 'Sharma', transport: 'No', hostel: 'No', scholarship: 'No', attendance: 85, fatherName: 'Anil Sharma', motherName: 'Rekha Sharma', dob: '2006-11-05', bloodGroup: 'AB+', admissionYear: '2023', branch: 'south', batch: '2023-24' },
{ id: 5, name: 'Vikram Singh', suId: 'SU-2024-005', grNo: 'GR-1200', class: '9', section: 'C', department: 'Science', status: 'Active', feeStatus: 'Overdue', parentMobile: '9876543214', gender: 'Male', category: 'SC', socialCategory: 'SC', admissionType: 'RTE', ews: 'Yes', rte: 'Yes', minorityStatus: 'No', disability: 'Yes', disabilityType: 'Visual Impairment', religion: 'Hindu', caste: 'Singh', transport: 'Route 2', hostel: 'No', scholarship: 'SC/ST', attendance: 78, fatherName: 'Mahendra Singh', motherName: 'Sunita Singh', dob: '2009-07-18', bloodGroup: 'B-', admissionYear: '2024', branch: 'east', batch: '2024-25' },
{ id: 6, name: 'Priya Reddy', suId: 'SU-2024-006', grNo: 'GR-1210', class: '11', section: 'A', department: 'Commerce', status: 'Active', feeStatus: 'Paid', parentMobile: '9876543215', gender: 'Female', category: 'OBC', socialCategory: 'OBC', admissionType: 'Management', ews: 'No', rte: 'No', minorityStatus: 'No', disability: 'No', disabilityType: '', religion: 'Hindu', caste: 'Reddy', transport: 'Route 3', hostel: 'No', scholarship: 'No', attendance: 90, fatherName: 'Suresh Reddy', motherName: 'Lakshmi Reddy', dob: '2007-01-25', bloodGroup: 'O+', admissionYear: '2024', branch: 'north', batch: '2024-25' },
{ id: 7, name: 'Imran Ali', suId: 'SU-2024-007', grNo: 'GR-1220', class: '8', section: 'B', department: 'General', status: 'Active', feeStatus: 'Due', parentMobile: '9876543216', gender: 'Male', category: 'General', socialCategory: 'General', admissionType: 'Regular', ews: 'No', rte: 'No', minorityStatus: 'Yes', disability: 'No', disabilityType: '', religion: 'Islam', caste: 'Ali', transport: 'No', hostel: 'Boys Hostel B', scholarship: 'Minority', attendance: 82, fatherName: 'Rashid Ali', motherName: 'Shabana Ali', dob: '2010-09-12', bloodGroup: 'A-', admissionYear: '2024', branch: 'south', batch: '2024-25' },
{ id: 8, name: 'Sneha Kulkarni', suId: 'SU-2024-008', grNo: 'GR-1230', class: '10', section: 'C', department: 'Science', status: 'Active', feeStatus: 'Paid', parentMobile: '9876543217', gender: 'Female', category: 'ST', socialCategory: 'ST', admissionType: 'RTE', ews: 'Yes', rte: 'Yes', minorityStatus: 'No', disability: 'Yes', disabilityType: 'Hearing Impairment', religion: 'Hindu', caste: 'Kulkarni', transport: 'Route 4', hostel: 'No', scholarship: 'SC/ST', attendance: 75, fatherName: 'Anil Kulkarni', motherName: 'Meera Kulkarni', dob: '2008-04-30', bloodGroup: 'AB-', admissionYear: '2024', branch: 'east', batch: '2024-25' }];


// --- Options ---
const createOptions = (values: string[], prefix = '') => [{ value: '', label: `All ${prefix}` }, ...values.map((v) => ({ value: v, label: v }))];

const admissionYearOptions = createOptions(['2024', '2023', '2022', '2021', '2020'], 'Years');
const admissionTypeOptions = createOptions(['Regular', 'RTE', 'Management', 'Transfer', 'Sports Quota', 'Staff Quota'], 'Types');
const statusOptions = createOptions(['Active', 'Inactive', 'Passed Out', 'TC Issued', 'Dropout'], 'Status');
const academicYearOptions = createOptions(['2024-2025', '2023-2024', '2022-2023'], 'Years');
const classOptions = [{ value: '', label: 'All Classes' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))];
const sectionOptions = createOptions(['A', 'B', 'C', 'D'], 'Sections');
const departmentOptions = createOptions(['Science', 'Commerce', 'Arts', 'General', 'Vocational'], 'Departments');
const streamOptions = [{ value: '', label: 'All Streams' }, { value: 'PCM', label: 'PCM' }, { value: 'PCB', label: 'PCB' }, { value: 'Commerce', label: 'Commerce' }, { value: 'Humanities', label: 'Humanities' }];
const resultStatusOptions = createOptions(['Passed', 'Failed', 'Pending'], '');
const socialCategoryOptions = createOptions(['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC', 'Other'], 'Categories');
const yesNoOptions = [{ value: '', label: 'All' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
const genderOptions = createOptions(['Male', 'Female', 'Other'], 'Genders');
const religionOptions = createOptions(['Hindu', 'Islam', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'], 'Religions');
const bloodGroupOptions = createOptions(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], '');
const hostelDayScholarOptions = [{ value: '', label: 'All' }, { value: 'Hostel', label: 'Hostel' }, { value: 'Day Scholar', label: 'Day Scholar' }];
const feeStatusOptions = createOptions(['Paid', 'Due', 'Overdue', 'Partial'], 'Status');
const scholarshipOptions = [{ value: '', label: 'All' }, { value: 'Yes', label: 'Has Scholarship' }, { value: 'No', label: 'No Scholarship' }, { value: 'Merit', label: 'Merit' }, { value: 'SC/ST', label: 'SC/ST' }, { value: 'Minority', label: 'Minority' }, { value: 'Sports', label: 'Sports' }];
const transportRouteOptions = createOptions(['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5'], 'Routes');
const hostelNameOptions = createOptions(['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel A', 'Girls Hostel B'], 'Hostels');
const guardianTypeOptions = createOptions(['Parent', 'Local Guardian', 'Other'], '');
const disabilityTypeOptions = createOptions(['Visual Impairment', 'Hearing Impairment', 'Locomotor Disability', 'Intellectual Disability', 'Autism', 'Cerebral Palsy', 'Multiple Disabilities', 'Other'], 'Types');
const availableTags = ['Olympiad Winner', 'Sports Captain', 'Scholarship', 'Class Monitor', 'NCC', 'NSS', 'Scout/Guide', 'Cultural Lead', 'Science Club', 'Debate Team'];

// --- Main Component ---
export function StudentCustomSearchPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showResults, setShowResults] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Student[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'tags' && (value as string[]).length > 0) count++;else
      if (key === 'branches' && (value as string[]).length < branches.length) count++;else
      if (key !== 'branches' && key !== 'tags' && value !== '' && value !== initialFilters[key as keyof FilterState]) count++;
    });
    return count;
  }, [filters]);

  const handleFilterChange = (field: keyof FilterState, value: string | string[]) => setFilters((prev) => ({ ...prev, [field]: value }));

  const toggleBranch = (branchId: string) => {
    setFilters((prev) => ({
      ...prev,
      branches: prev.branches.includes(branchId) ? prev.branches.filter((id) => id !== branchId) : [...prev.branches, branchId]
    }));
  };

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const results = MOCK_RESULTS.filter((student) => {
        if (filters.branches.length > 0 && !filters.branches.includes(student.branch)) return false;
        if (filters.batch && student.batch !== filters.batch) return false;
        if (filters.studentName && !student.name.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
        if (filters.suId && !student.suId.toLowerCase().includes(filters.suId.toLowerCase())) return false;
        if (filters.grNo && !student.grNo.toLowerCase().includes(filters.grNo.toLowerCase())) return false;
        if (filters.admissionYear && student.admissionYear !== filters.admissionYear) return false;
        if (filters.admissionType && student.admissionType !== filters.admissionType) return false;
        if (filters.status && student.status !== filters.status) return false;
        if (filters.class && student.class !== filters.class) return false;
        if (filters.section && student.section !== filters.section) return false;
        if (filters.department && student.department !== filters.department) return false;
        if (filters.socialCategory && student.socialCategory !== filters.socialCategory) return false;
        if (filters.ews && student.ews !== filters.ews) return false;
        if (filters.rte && student.rte !== filters.rte) return false;
        if (filters.minorityStatus && student.minorityStatus !== filters.minorityStatus) return false;
        if (filters.disability && student.disability !== filters.disability) return false;
        if (filters.disabilityType && student.disabilityType !== filters.disabilityType) return false;
        if (filters.gender && student.gender !== filters.gender) return false;
        if (filters.religion && student.religion !== filters.religion) return false;
        if (filters.bloodGroup && student.bloodGroup !== filters.bloodGroup) return false;
        if (filters.fatherName && !student.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())) return false;
        if (filters.motherName && !student.motherName.toLowerCase().includes(filters.motherName.toLowerCase())) return false;
        if (filters.parentMobile && !student.parentMobile.includes(filters.parentMobile)) return false;
        if (filters.feeStatus && student.feeStatus !== filters.feeStatus) return false;
        if (filters.scholarship && filters.scholarship === 'Yes' && student.scholarship === 'No') return false;
        if (filters.scholarship && filters.scholarship === 'No' && student.scholarship !== 'No') return false;
        if (filters.transportUser === 'Yes' && student.transport === 'No') return false;
        if (filters.transportUser === 'No' && student.transport !== 'No') return false;
        if (filters.transportRoute && student.transport !== filters.transportRoute) return false;
        if (filters.hostelDayScholar === 'Hostel' && (!student.hostel || student.hostel === 'No')) return false;
        if (filters.hostelDayScholar === 'Day Scholar' && student.hostel && student.hostel !== 'No') return false;
        if (filters.hostelName && student.hostel !== filters.hostelName) return false;
        if (filters.attendanceFrom && student.attendance < parseFloat(filters.attendanceFrom)) return false;
        if (filters.attendanceTo && student.attendance > parseFloat(filters.attendanceTo)) return false;
        return true;
      });
      setFilteredResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 1000);
  };

  const handleReset = () => {setFilters(initialFilters);setShowResults(false);setFilteredResults([]);setSelectedStudents([]);};
  const toggleSelection = (id: number) => setSelectedStudents((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  const toggleAll = () => setSelectedStudents(selectedStudents.length === filteredResults.length ? [] : filteredResults.map((s) => s.id));
  const toggleTag = (tag: string) => setFilters((prev) => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] }));

  const columns = [
  { key: 'select', header: <input type="checkbox" checked={selectedStudents.length === filteredResults.length && filteredResults.length > 0} onChange={toggleAll} className="rounded text-blue-600 h-4 w-4" />, render: (row: Student) => <input type="checkbox" checked={selectedStudents.includes(row.id)} onChange={() => toggleSelection(row.id)} className="rounded text-blue-600 h-4 w-4" /> },
  { key: 'name', header: 'Student', render: (row: Student) => <div><span className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{row.name}</span><p className="text-xs text-gray-500">{row.fatherName}</p></div> },
  { key: 'ids', header: 'IDs', render: (row: Student) => <div><p className="text-sm font-mono">{row.grNo}</p><p className="text-xs text-gray-500 font-mono">{row.suId}</p></div> },
  { key: 'branch', header: 'Branch', render: (row: Student) => <Badge variant="secondary" className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${branchColors[row.branch]}`} />{branches.find((b) => b.id === row.branch)?.name}</Badge> },
  { key: 'class', header: 'Class', render: (row: Student) => <span>{row.class}-{row.section}</span> },
  { key: 'category', header: 'Category', render: (row: Student) => <div className="flex flex-col gap-1"><Badge variant="secondary" className="text-xs">{row.socialCategory}</Badge>{row.ews === 'Yes' && <Badge variant="warning" className="text-xs">EWS</Badge>}{row.rte === 'Yes' && <Badge variant="info" className="text-xs">RTE</Badge>}{row.minorityStatus === 'Yes' && <Badge variant="secondary" className="text-xs">Minority</Badge>}{row.disability === 'Yes' && <Badge variant="danger" className="text-xs">PWD</Badge>}</div> },
  { key: 'admissionType', header: 'Admission', render: (row: Student) => <Badge variant={row.admissionType === 'Regular' ? 'success' : row.admissionType === 'RTE' ? 'info' : 'warning'}>{row.admissionType}</Badge> },
  { key: 'status', header: 'Status', render: (row: Student) => <Badge variant={row.status === 'Active' ? 'success' : row.status === 'TC Issued' ? 'warning' : 'secondary'}>{row.status}</Badge> },
  { key: 'feeStatus', header: 'Fee', render: (row: Student) => <Badge variant={row.feeStatus === 'Paid' ? 'success' : row.feeStatus === 'Due' ? 'warning' : 'danger'}>{row.feeStatus}</Badge> },
  { key: 'contact', header: 'Contact', render: (row: Student) => <span className="text-sm">{row.parentMobile}</span> },
  { key: 'actions', header: 'Actions', render: () => <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button> }];


  const branchStats = useMemo(() => branches.map((b) => ({ ...b, count: filteredResults.filter((s) => s.branch === b.id).length })), [filteredResults]);

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Search className="w-7 h-7" />Advanced Student Search</h1>
          <p className="text-sm text-gray-500 mt-1">Build complex queries to find specific student groups</p>
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && <Badge variant="info">{activeFilterCount} filters active</Badge>}
          <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleReset}>Reset</Button>
          <Button variant="outline" leftIcon={<Save className="w-4 h-4" />} onClick={() => setIsSaveModalOpen(true)}>Save Search</Button>
          <Button variant="primary" leftIcon={<Search className="w-4 h-4" />} onClick={handleRunSearch} disabled={isSearching}>{isSearching ? 'Searching...' : 'Run Search'}</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Branch & Batch Selection */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Branch & Batch Selection</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Branch Multi-Select */}
            <div className="relative min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch (Multiple)</label>
              <button onClick={() => {setShowBranchDropdown(!showBranchDropdown);setShowBatchDropdown(false);}}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {filters.branches.length === branches.length ? 'All Branches' : filters.branches.length === 0 ? 'Select Branches' : `${filters.branches.length} Branch${filters.branches.length > 1 ? 'es' : ''}`}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showBranchDropdown &&
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg z-20">
                  <button onClick={() => setFilters((prev) => ({ ...prev, branches: branches.map((b) => b.id) }))}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 border-b flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.branches.length === branches.length ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {filters.branches.length === branches.length && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>All Branches
                  </button>
                  {branches.map((branch) =>
                <button key={branch.id} onClick={() => toggleBranch(branch.id)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.branches.includes(branch.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {filters.branches.includes(branch.id) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`w-2 h-2 rounded-full ${branchColors[branch.id]}`} />{branch.name}
                    </button>
                )}
                </div>
              }
            </div>

            {/* Batch Single-Select */}
            <div className="relative min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch (Academic Year)</label>
              <button onClick={() => {setShowBatchDropdown(!showBatchDropdown);setShowBranchDropdown(false);}}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{filters.batch || 'Select Batch'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showBatchDropdown &&
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg z-20">
                  {batches.map((batch) =>
                <button key={batch} onClick={() => {handleFilterChange('batch', batch);setShowBatchDropdown(false);}}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${filters.batch === batch ? 'bg-blue-50 text-blue-600' : ''}`}>{batch}</button>
                )}
                </div>
              }
            </div>
          </div>

          {/* Selected Filters Display */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-blue-200">
            <span className="text-sm text-gray-500">Selected:</span>
            <Badge variant="primary">{filters.batch}</Badge>
            {filters.branches.map((branchId) => {
              const branch = branches.find((b) => b.id === branchId);
              return branch && <Badge key={branchId} variant="secondary" className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${branchColors[branchId]}`} />{branch.name}</Badge>;
            })}
          </div>
        </Card>

        {/* 1. Identity & Admission */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4"><UserCheck className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-gray-900">Identity & Admission</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Input label="Student Name" placeholder="Search by name..." value={filters.studentName} onChange={(e) => handleFilterChange('studentName', e.target.value)} />
            <Input label="GR Number" placeholder="e.g., GR-1001" value={filters.grNo} onChange={(e) => handleFilterChange('grNo', e.target.value)} />
            <Input label="SU ID" placeholder="e.g., SU-2024-001" value={filters.suId} onChange={(e) => handleFilterChange('suId', e.target.value)} />
            <Input label="Admission No" placeholder="Exact match" value={filters.admissionNo} onChange={(e) => handleFilterChange('admissionNo', e.target.value)} />
            <Input label="Roll Number" placeholder="Exact match" value={filters.rollNumber} onChange={(e) => handleFilterChange('rollNumber', e.target.value)} />
            <Select label="Admission Year" value={filters.admissionYear} onChange={(e) => handleFilterChange('admissionYear', e.target.value)} options={admissionYearOptions} />
            <Select label="Admission Type" value={filters.admissionType} onChange={(e) => handleFilterChange('admissionType', e.target.value)} options={admissionTypeOptions} />
            <Select label="Status" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} options={statusOptions} />
          </div>
        </Card>

        {/* 2. Academic Criteria */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4"><GraduationCap className="w-5 h-5 text-green-600" /><h3 className="text-lg font-semibold text-gray-900">Academic Criteria</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select label="Academic Year" value={filters.academicYear} onChange={(e) => handleFilterChange('academicYear', e.target.value)} options={academicYearOptions} />
            <Select label="Class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} options={classOptions} />
            <Select label="Section" value={filters.section} onChange={(e) => handleFilterChange('section', e.target.value)} options={sectionOptions} />
            <Select label="Department" value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)} options={departmentOptions} />
            <Select label="Stream" value={filters.stream} onChange={(e) => handleFilterChange('stream', e.target.value)} options={streamOptions} />
            <Select label="Result Status" value={filters.resultStatus} onChange={(e) => handleFilterChange('resultStatus', e.target.value)} options={resultStatusOptions} />
            <Input label="Percentage From" placeholder="%" type="number" value={filters.percentageFrom} onChange={(e) => handleFilterChange('percentageFrom', e.target.value)} />
            <Input label="Percentage To" placeholder="%" type="number" value={filters.percentageTo} onChange={(e) => handleFilterChange('percentageTo', e.target.value)} />
          </div>
        </Card>

        {/* 3. Category & Reservation */}
        <Card className="p-6 border-2 border-blue-100 bg-blue-50/30">
          <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-purple-600" /><h3 className="text-lg font-semibold text-gray-900">Category & Reservation</h3><Badge variant="info" className="text-xs">Key Filters</Badge></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Select label="Social Category" value={filters.socialCategory} onChange={(e) => handleFilterChange('socialCategory', e.target.value)} options={socialCategoryOptions} />
            <Select label="Admission Type" value={filters.admissionType} onChange={(e) => handleFilterChange('admissionType', e.target.value)} options={admissionTypeOptions} />
            <Select label="EWS Status" value={filters.ews} onChange={(e) => handleFilterChange('ews', e.target.value)} options={yesNoOptions} />
            <Select label="RTE Status" value={filters.rte} onChange={(e) => handleFilterChange('rte', e.target.value)} options={yesNoOptions} />
            <Select label="Minority Status" value={filters.minorityStatus} onChange={(e) => handleFilterChange('minorityStatus', e.target.value)} options={yesNoOptions} />
            <Select label="Disability (PWD)" value={filters.disability} onChange={(e) => handleFilterChange('disability', e.target.value)} options={yesNoOptions} />
          </div>
          {filters.disability === 'Yes' &&
          <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select label="Disability Type" value={filters.disabilityType} onChange={(e) => handleFilterChange('disabilityType', e.target.value)} options={disabilityTypeOptions} />
              </div>
            </div>
          }
          <div className="mt-4 pt-4 border-t border-blue-200 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Info className="w-4 h-4" />Tip: Use these filters to find students eligible for specific schemes or quotas</span>
          </div>
        </Card>

        {/* 4. Enrollment & Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4"><CheckCircle className="w-5 h-5 text-teal-600" /><h3 className="text-lg font-semibold text-gray-900">Enrollment & Status</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Student Status" value={filters.studentStatus} onChange={(e) => handleFilterChange('studentStatus', e.target.value)} options={statusOptions} />
            <Select label="Hostel / Day Scholar" value={filters.hostelDayScholar} onChange={(e) => handleFilterChange('hostelDayScholar', e.target.value)} options={hostelDayScholarOptions} />
            <Select label="Transport User" value={filters.transportUser} onChange={(e) => handleFilterChange('transportUser', e.target.value)} options={yesNoOptions} />
            <Select label="Library Member" value={filters.libraryMember} onChange={(e) => handleFilterChange('libraryMember', e.target.value)} options={yesNoOptions} />
          </div>
        </Card>

        {/* Toggle Advanced Filters */}
        <div className="flex justify-center">
          <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-full border shadow-sm transition-all">
            {showMoreFilters ? <>Hide Advanced Filters <ChevronUp className="w-4 h-4" /></> : <>Show Advanced Filters (6 more sections) <ChevronDown className="w-4 h-4" /></>}
          </button>
        </div>

        {/* Advanced Filters */}
        {showMoreFilters &&
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            {/* 5. Personal & Demographic */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-orange-600" /><h3 className="text-lg font-semibold text-gray-900">Personal & Demographic</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Select label="Gender" value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)} options={genderOptions} />
                <Input label="DOB From" type="date" value={filters.dobFrom} onChange={(e) => handleFilterChange('dobFrom', e.target.value)} />
                <Input label="DOB To" type="date" value={filters.dobTo} onChange={(e) => handleFilterChange('dobTo', e.target.value)} />
                <Select label="Religion" value={filters.religion} onChange={(e) => handleFilterChange('religion', e.target.value)} options={religionOptions} />
                <Input label="Caste" placeholder="Enter caste" value={filters.caste} onChange={(e) => handleFilterChange('caste', e.target.value)} />
                <Select label="Blood Group" value={filters.bloodGroup} onChange={(e) => handleFilterChange('bloodGroup', e.target.value)} options={bloodGroupOptions} />
              </div>
            </Card>

            {/* 6. Parent & Contact */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><Phone className="w-5 h-5 text-indigo-600" /><h3 className="text-lg font-semibold text-gray-900">Parent & Contact</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Input label="Father Name" placeholder="Contains..." value={filters.fatherName} onChange={(e) => handleFilterChange('fatherName', e.target.value)} />
                <Input label="Mother Name" placeholder="Contains..." value={filters.motherName} onChange={(e) => handleFilterChange('motherName', e.target.value)} />
                <Input label="Parent Mobile" placeholder="Phone number" value={filters.parentMobile} onChange={(e) => handleFilterChange('parentMobile', e.target.value)} />
                <Input label="Parent Email" placeholder="Email" value={filters.parentEmail} onChange={(e) => handleFilterChange('parentEmail', e.target.value)} />
                <Select label="Guardian Type" value={filters.guardianType} onChange={(e) => handleFilterChange('guardianType', e.target.value)} options={guardianTypeOptions} />
              </div>
            </Card>

            {/* 7. Fees & Finance */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5 text-emerald-600" /><h3 className="text-lg font-semibold text-gray-900">Fees & Finance</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Select label="Fee Status" value={filters.feeStatus} onChange={(e) => handleFilterChange('feeStatus', e.target.value)} options={feeStatusOptions} />
                <Input label="Outstanding (>)" placeholder="Amount" type="number" value={filters.outstandingFrom} onChange={(e) => handleFilterChange('outstandingFrom', e.target.value)} />
                <Input label="Outstanding (<)" placeholder="Amount" type="number" value={filters.outstandingTo} onChange={(e) => handleFilterChange('outstandingTo', e.target.value)} />
                <Select label="Scholarship" value={filters.scholarship} onChange={(e) => handleFilterChange('scholarship', e.target.value)} options={scholarshipOptions} />
                <Select label="RTE / Freeship" value={filters.freeshipRte} onChange={(e) => handleFilterChange('freeshipRte', e.target.value)} options={yesNoOptions} />
              </div>
            </Card>

            {/* 8. Attendance & Discipline */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-red-600" /><h3 className="text-lg font-semibold text-gray-900">Attendance & Discipline</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Input label="Attendance % From" placeholder="%" type="number" value={filters.attendanceFrom} onChange={(e) => handleFilterChange('attendanceFrom', e.target.value)} />
                <Input label="Attendance % To" placeholder="%" type="number" value={filters.attendanceTo} onChange={(e) => handleFilterChange('attendanceTo', e.target.value)} />
                <Select label="Chronic Absentee" value={filters.chronicAbsentee} onChange={(e) => handleFilterChange('chronicAbsentee', e.target.value)} options={yesNoOptions} />
                <Select label="Discipline Cases" value={filters.disciplineCases} onChange={(e) => handleFilterChange('disciplineCases', e.target.value)} options={yesNoOptions} />
                <Input label="Last Attendance Date" type="date" value={filters.lastAttendanceDate} onChange={(e) => handleFilterChange('lastAttendanceDate', e.target.value)} />
              </div>
            </Card>

            {/* 9. Transport & Hostel */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><Bus className="w-5 h-5 text-amber-600" /><h3 className="text-lg font-semibold text-gray-900">Transport & Hostel</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select label="Transport Route" value={filters.transportRoute} onChange={(e) => handleFilterChange('transportRoute', e.target.value)} options={transportRouteOptions} />
                <Input label="Bus Number" placeholder="Bus No." value={filters.busNumber} onChange={(e) => handleFilterChange('busNumber', e.target.value)} />
                <Select label="Hostel Name" value={filters.hostelName} onChange={(e) => handleFilterChange('hostelName', e.target.value)} options={hostelNameOptions} />
                <Input label="Room Number" placeholder="Room No" value={filters.roomNumber} onChange={(e) => handleFilterChange('roomNumber', e.target.value)} />
              </div>
            </Card>

            {/* 10. Health & Special */}
            <Card className="p-6 bg-red-50/30 border-red-100">
              <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-red-500" /><h3 className="text-lg font-semibold text-gray-900">Health & Special Flags</h3><Badge variant="secondary" className="text-xs">Restricted Access</Badge></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select label="Medical Alert" value={filters.medicalAlert} onChange={(e) => handleFilterChange('medicalAlert', e.target.value)} options={yesNoOptions} />
                <Select label="Special Needs" value={filters.specialNeeds} onChange={(e) => handleFilterChange('specialNeeds', e.target.value)} options={yesNoOptions} />
                <Select label="Allergies Recorded" value={filters.allergiesRecorded} onChange={(e) => handleFilterChange('allergiesRecorded', e.target.value)} options={yesNoOptions} />
              </div>
            </Card>

            {/* 11. Tags */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4"><Tag className="w-5 h-5 text-cyan-600" /><h3 className="text-lg font-semibold text-gray-900">Tags & Custom Fields</h3></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {availableTags.map((tag) =>
                <button key={tag} onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${filters.tags.includes(tag) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{tag}</button>
                )}
                </div>
              </div>
            </Card>
          </div>
        }

        {/* Results Section */}
        {showResults &&
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
            {/* Bulk Action Bar */}
            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-700 p-2 rounded-full"><Filter className="w-4 h-4" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Search Results</h3>
                  <p className="text-sm text-gray-500">{filteredResults.length} student{filteredResults.length !== 1 && 's'} found{selectedStudents.length > 0 && ` · ${selectedStudents.length} selected`}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button size="sm" variant="outline" disabled={selectedStudents.length === 0} leftIcon={<GraduationCap className="w-4 h-4" />}>Convert to Alumni</Button>
                <Button size="sm" variant="outline" disabled={selectedStudents.length === 0} leftIcon={<ArrowRight className="w-4 h-4" />}>Promote</Button>
                <Button size="sm" variant="outline" disabled={selectedStudents.length === 0} leftIcon={<Mail className="w-4 h-4" />}>Send SMS</Button>
                <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
                <Button size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />}>Print</Button>
              </div>
            </div>

            {/* Branch-wise Stats */}
            {filteredResults.length > 0 &&
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <Card className="p-3 text-center"><p className="text-2xl font-bold text-gray-900">{filteredResults.length}</p><p className="text-xs text-gray-500">Total</p></Card>
                {branchStats.filter((b) => filters.branches.includes(b.id)).map((b) =>
            <Card key={b.id} className="p-3 text-center">
                    <p className={`text-2xl font-bold ${branchColors[b.id].replace('bg-', 'text-')}`}>{b.count}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><span className={`w-2 h-2 rounded-full ${branchColors[b.id]}`} />{b.name.split(' ')[0]}</p>
                  </Card>
            )}
                <Card className="p-3 text-center"><p className="text-2xl font-bold text-green-600">{filteredResults.filter((s) => s.status === 'Active').length}</p><p className="text-xs text-gray-500">Active</p></Card>
                <Card className="p-3 text-center"><p className="text-2xl font-bold text-blue-600">{filteredResults.filter((s) => s.rte === 'Yes').length}</p><p className="text-xs text-gray-500">RTE</p></Card>
                <Card className="p-3 text-center"><p className="text-2xl font-bold text-amber-600">{filteredResults.filter((s) => s.ews === 'Yes').length}</p><p className="text-xs text-gray-500">EWS</p></Card>
              </div>
          }

            {/* Results Table */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-500">Showing {filteredResults.length} results</span>
                <span className="text-sm text-gray-400 italic">First 500 rows displayed</span>
              </div>
              {filteredResults.length > 0 ?
            <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>{columns.map((col) => <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header}</th>)}</tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.map((student) =>
                  <tr key={student.id} className="hover:bg-gray-50">
                          {columns.map((col) => <td key={col.key} className="px-4 py-3 whitespace-nowrap">{col.render ? col.render(student) : (student as any)[col.key]}</td>)}
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div> :

            <div className="flex flex-col items-center justify-center py-16 px-4">
                  <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Students Found</h3>
                  <p className="text-sm text-gray-500 text-center max-w-md">No students match your search criteria. Try adjusting your filters.</p>
                </div>
            }
              <div className="p-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">Page 1 of 1</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </Card>
          </div>
        }
      </div>

      {/* Save Search Modal */}
      <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Save Search Template" size="md">
        <div className="space-y-4">
          <Input label="Template Name" placeholder="e.g., SC/ST Students with Fee Due" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full p-2 border border-gray-300 rounded-md text-sm" rows={3} placeholder="Describe what this search finds..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Active Filters Summary</label><div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">{activeFilterCount > 0 ? <span>{activeFilterCount} filters will be saved with this template</span> : <span className="text-amber-600">No filters active. Add some filters before saving.</span>}</div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label><div className="flex gap-4"><label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="visibility" className="text-blue-600" defaultChecked />Private</label><label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="visibility" className="text-blue-600" />Shared</label></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Settings</label><div className="space-y-2"><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className="rounded text-blue-600" />Auto-run on dashboard load</label><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" className="rounded text-blue-600" />Make available in Reports module</label></div></div>
          <div className="flex justify-end gap-2 pt-4 border-t"><Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setIsSaveModalOpen(false)}>Save Template</Button></div>
        </div>
      </Modal>
    </div>);

}

export { StudentCustomSearchPage as StudentCustomSearch };
export default StudentCustomSearchPage;