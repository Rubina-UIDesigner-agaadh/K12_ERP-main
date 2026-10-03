import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EyeIcon,
  ChevronDownIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  ClockIcon,
  RefreshCwIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SlidersHorizontalIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  ColumnsIcon,
  CheckIcon } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

// Types
interface ProbationEmployee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employeeType: string;
  dateOfJoining: string;
  probationPeriod: string;
  probationMonths: number;
  probationStartDate: string;
  probationEndDate: string;
  daysLeft: number;
  daysCompleted: number;
  totalProbationDays: number;
  status: 'On Probation' | 'Ending Soon' | 'Overdue' | 'Extended';
  reportingManager: string;
  branch: string;
  gender: string;
  photo?: string;
}

// Mock Data
const probationEmployeesData: ProbationEmployee[] = [
{
  id: '1',
  employeeCode: 'EMP001',
  name: 'Priya Sharma',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43210',
  department: 'Science',
  designation: 'Physics Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-08-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-08-01',
  probationEndDate: '2025-02-01',
  daysLeft: 5,
  daysCompleted: 175,
  totalProbationDays: 180,
  status: 'Ending Soon',
  reportingManager: 'Dr. Rajesh Kumar',
  branch: 'Main Campus',
  gender: 'Female'
},
{
  id: '2',
  employeeCode: 'EMP002',
  name: 'James Wilson',
  email: 'james.wilson@school.edu',
  phone: '+91 98765 43211',
  department: 'English',
  designation: 'English Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-07-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-07-15',
  probationEndDate: '2025-01-15',
  daysLeft: -12,
  daysCompleted: 192,
  totalProbationDays: 180,
  status: 'Overdue',
  reportingManager: 'Mrs. Sarah Johnson',
  branch: 'Main Campus',
  gender: 'Male'
},
{
  id: '3',
  employeeCode: 'EMP003',
  name: 'Anita Desai',
  email: 'anita.desai@school.edu',
  phone: '+91 98765 43212',
  department: 'Primary',
  designation: 'Primary Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-09-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-09-01',
  probationEndDate: '2025-03-01',
  daysLeft: 34,
  daysCompleted: 146,
  totalProbationDays: 180,
  status: 'On Probation',
  reportingManager: 'Mrs. Kavitha Nair',
  branch: 'Junior Wing',
  gender: 'Female'
},
{
  id: '4',
  employeeCode: 'EMP004',
  name: 'Rahul Verma',
  email: 'rahul.verma@school.edu',
  phone: '+91 98765 43213',
  department: 'Mathematics',
  designation: 'Mathematics Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-10-01',
  probationPeriod: '3 Months',
  probationMonths: 3,
  probationStartDate: '2024-10-01',
  probationEndDate: '2025-01-01',
  daysLeft: -26,
  daysCompleted: 116,
  totalProbationDays: 90,
  status: 'Overdue',
  reportingManager: 'Dr. Suresh Patel',
  branch: 'Main Campus',
  gender: 'Male'
},
{
  id: '5',
  employeeCode: 'EMP005',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@school.edu',
  phone: '+91 98765 43214',
  department: 'Computer Science',
  designation: 'Computer Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-11-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-11-01',
  probationEndDate: '2025-05-01',
  daysLeft: 95,
  daysCompleted: 85,
  totalProbationDays: 180,
  status: 'On Probation',
  reportingManager: 'Mr. Anil Sharma',
  branch: 'Main Campus',
  gender: 'Female'
},
{
  id: '6',
  employeeCode: 'EMP006',
  name: 'Mohammed Iqbal',
  email: 'mohammed.iqbal@school.edu',
  phone: '+91 98765 43215',
  department: 'Administration',
  designation: 'Office Assistant',
  employeeType: 'Non-Teaching Staff',
  dateOfJoining: '2024-06-15',
  probationPeriod: '12 Months',
  probationMonths: 12,
  probationStartDate: '2024-06-15',
  probationEndDate: '2025-06-15',
  daysLeft: 140,
  daysCompleted: 220,
  totalProbationDays: 360,
  status: 'On Probation',
  reportingManager: 'Mr. Rajendra Singh',
  branch: 'Main Campus',
  gender: 'Male'
},
{
  id: '7',
  employeeCode: 'EMP007',
  name: 'Kavitha Menon',
  email: 'kavitha.menon@school.edu',
  phone: '+91 98765 43216',
  department: 'Hindi',
  designation: 'Hindi Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-12-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-12-01',
  probationEndDate: '2025-06-01',
  daysLeft: 126,
  daysCompleted: 54,
  totalProbationDays: 180,
  status: 'On Probation',
  reportingManager: 'Dr. Priya Gupta',
  branch: 'Senior Wing',
  gender: 'Female'
},
{
  id: '8',
  employeeCode: 'EMP008',
  name: 'Vikram Singh',
  email: 'vikram.singh@school.edu',
  phone: '+91 98765 43217',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-08-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-08-15',
  probationEndDate: '2025-02-15',
  daysLeft: 19,
  daysCompleted: 161,
  totalProbationDays: 180,
  status: 'Ending Soon',
  reportingManager: 'Mr. Deepak Chauhan',
  branch: 'Main Campus',
  gender: 'Male'
},
{
  id: '9',
  employeeCode: 'EMP009',
  name: 'Lakshmi Iyer',
  email: 'lakshmi.iyer@school.edu',
  phone: '+91 98765 43218',
  department: 'Music',
  designation: 'Music Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-07-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-07-01',
  probationEndDate: '2025-01-01',
  daysLeft: -26,
  daysCompleted: 206,
  totalProbationDays: 180,
  status: 'Extended',
  reportingManager: 'Mrs. Meena Krishnan',
  branch: 'Arts Wing',
  gender: 'Female'
},
{
  id: '10',
  employeeCode: 'EMP010',
  name: 'Arjun Nair',
  email: 'arjun.nair@school.edu',
  phone: '+91 98765 43219',
  department: 'Library',
  designation: 'Librarian',
  employeeType: 'Non-Teaching Staff',
  dateOfJoining: '2024-09-15',
  probationPeriod: '3 Months',
  probationMonths: 3,
  probationStartDate: '2024-09-15',
  probationEndDate: '2024-12-15',
  daysLeft: -43,
  daysCompleted: 133,
  totalProbationDays: 90,
  status: 'Overdue',
  reportingManager: 'Dr. Sunil Kumar',
  branch: 'Main Campus',
  gender: 'Male'
},
{
  id: '11',
  employeeCode: 'EMP011',
  name: 'Deepa Sharma',
  email: 'deepa.sharma@school.edu',
  phone: '+91 98765 43220',
  department: 'Art',
  designation: 'Art Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-10-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-10-15',
  probationEndDate: '2025-04-15',
  daysLeft: 79,
  daysCompleted: 101,
  totalProbationDays: 180,
  status: 'On Probation',
  reportingManager: 'Mrs. Asha Rao',
  branch: 'Arts Wing',
  gender: 'Female'
},
{
  id: '12',
  employeeCode: 'EMP012',
  name: 'Suresh Kumar',
  email: 'suresh.kumar@school.edu',
  phone: '+91 98765 43221',
  department: 'Accounts',
  designation: 'Accountant',
  employeeType: 'Non-Teaching Staff',
  dateOfJoining: '2024-11-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  probationStartDate: '2024-11-15',
  probationEndDate: '2025-05-15',
  daysLeft: 109,
  daysCompleted: 71,
  totalProbationDays: 180,
  status: 'On Probation',
  reportingManager: 'Mr. Ganesh Iyer',
  branch: 'Main Campus',
  gender: 'Male'
}];


const departments = [
'All Departments',
'Science',
'Mathematics',
'English',
'Hindi',
'Computer Science',
'Physical Education',
'Music',
'Art',
'Primary',
'Library',
'Administration',
'Accounts'];


const designations = [
'All Designations',
'Physics Teacher',
'Chemistry Teacher',
'Biology Teacher',
'Mathematics Teacher',
'English Teacher',
'Hindi Teacher',
'Computer Teacher',
'Sports Teacher',
'Music Teacher',
'Art Teacher',
'Primary Teacher',
'Librarian',
'Office Assistant',
'Accountant'];


const employeeTypes = ['All Types', 'Teaching Staff', 'Non-Teaching Staff'];

const branches = ['All Branches', 'Main Campus', 'Junior Wing', 'Senior Wing', 'Arts Wing'];

const probationPeriods = ['All Periods', '3 Months', '6 Months', '12 Months'];

const statusOptions = ['All Status', 'On Probation', 'Ending Soon', 'Overdue', 'Extended'];

// Progress Bar Component
const ProgressBar: React.FC<{completed: number;total: number;status: string;}> = ({
  completed,
  total,
  status
}) => {
  const percentage = Math.min(completed / total * 100, 100);

  const getColor = () => {
    if (status === 'Overdue' || status === 'Extended') return 'bg-red-500';
    if (status === 'Ending Soon') return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }} />

      </div>
      <p className="text-xs text-gray-500 mt-1">{Math.round(percentage)}% completed</p>
    </div>);

};

// Main Component
export function ProbationConfirmationList() {
  const navigate = useNavigate();

  // State
  const [employees] = useState<ProbationEmployee[]>(probationEmployeesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDesignation, setSelectedDesignation] = useState('All Designations');
  const [selectedEmployeeType, setSelectedEmployeeType] = useState('All Types');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedProbationPeriod, setSelectedProbationPeriod] = useState('All Periods');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [joiningDateFrom, setJoiningDateFrom] = useState('');
  const [joiningDateTo, setJoiningDateTo] = useState('');
  const [probationEndFrom, setProbationEndFrom] = useState('');
  const [probationEndTo, setProbationEndTo] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    employeeCode: true,
    name: true,
    department: true,
    designation: true,
    employeeType: true,
    dateOfJoining: true,
    probationPeriod: true,
    probationEndDate: true,
    progress: true,
    daysLeft: true,
    status: true,
    reportingManager: false,
    branch: false,
    email: false,
    phone: false
  });

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery);

    const matchesDepartment =
    selectedDepartment === 'All Departments' || emp.department === selectedDepartment;

    const matchesDesignation =
    selectedDesignation === 'All Designations' || emp.designation === selectedDesignation;

    const matchesEmployeeType =
    selectedEmployeeType === 'All Types' || emp.employeeType === selectedEmployeeType;

    const matchesBranch = selectedBranch === 'All Branches' || emp.branch === selectedBranch;

    const matchesProbationPeriod =
    selectedProbationPeriod === 'All Periods' || emp.probationPeriod === selectedProbationPeriod;

    const matchesStatus = selectedStatus === 'All Status' || emp.status === selectedStatus;

    const matchesJoiningDateFrom =
    !joiningDateFrom || new Date(emp.dateOfJoining) >= new Date(joiningDateFrom);

    const matchesJoiningDateTo =
    !joiningDateTo || new Date(emp.dateOfJoining) <= new Date(joiningDateTo);

    const matchesProbationEndFrom =
    !probationEndFrom || new Date(emp.probationEndDate) >= new Date(probationEndFrom);

    const matchesProbationEndTo =
    !probationEndTo || new Date(emp.probationEndDate) <= new Date(probationEndTo);

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesDesignation &&
      matchesEmployeeType &&
      matchesBranch &&
      matchesProbationPeriod &&
      matchesStatus &&
      matchesJoiningDateFrom &&
      matchesJoiningDateTo &&
      matchesProbationEndFrom &&
      matchesProbationEndTo);

  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: any = a[sortField as keyof ProbationEmployee];
    let bValue: any = b[sortField as keyof ProbationEmployee];

    if (sortField === 'daysLeft') {
      aValue = a.daysLeft;
      bValue = b.daysLeft;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + rowsPerPage);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDownIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ArrowUpIcon className="w-4 h-4 text-blue-600" /> :

    <ArrowDownIcon className="w-4 h-4 text-blue-600" />;

  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All Departments');
    setSelectedDesignation('All Designations');
    setSelectedEmployeeType('All Types');
    setSelectedBranch('All Branches');
    setSelectedProbationPeriod('All Periods');
    setSelectedStatus('All Status');
    setJoiningDateFrom('');
    setJoiningDateTo('');
    setProbationEndFrom('');
    setProbationEndTo('');
  };

  // Check if any filter is active
  const hasActiveFilters =
  searchQuery ||
  selectedDepartment !== 'All Departments' ||
  selectedDesignation !== 'All Designations' ||
  selectedEmployeeType !== 'All Types' ||
  selectedBranch !== 'All Branches' ||
  selectedProbationPeriod !== 'All Periods' ||
  selectedStatus !== 'All Status' ||
  joiningDateFrom ||
  joiningDateTo ||
  probationEndFrom ||
  probationEndTo;

  // Toggle column visibility
  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev]
    }));
  };

  // Get status badge variant
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'On Probation':
        return 'default';
      case 'Ending Soon':
        return 'warning';
      case 'Overdue':
        return 'danger';
      case 'Extended':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get days left text
  const getDaysLeftText = (daysLeft: number, status: string) => {
    if (status === 'Extended') {
      return `Extended (${Math.abs(daysLeft)} days over)`;
    }
    if (daysLeft < 0) {
      return `${Math.abs(daysLeft)} days overdue`;
    }
    if (daysLeft === 0) {
      return 'Ends today';
    }
    return `${daysLeft} days left`;
  };

  // Get days left color
  const getDaysLeftColor = (daysLeft: number, status: string) => {
    if (status === 'Extended' || daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 15) return 'text-orange-600';
    if (daysLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-blue-600" />
            Probation Employee List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage employees currently on probation period
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExportDropdown(!showExportDropdown)}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
            {showExportDropdown &&
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-20">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileSpreadsheetIcon className="w-4 h-4 text-green-600" />
                  Export to Excel
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-blue-600" />
                  Export to CSV
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-red-600" />
                  Export to PDF
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <PrinterIcon className="w-4 h-4 text-gray-600" />
                  Print List
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        {/* Primary Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, employee code, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>

          {/* Department Filter */}
          <div className="w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {departments.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {statusOptions.map((status) =>
              <option key={status} value={status}>
                  {status}
                </option>
              )}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? 'bg-blue-50 border-blue-200' : ''}>

            <SlidersHorizontalIcon className="w-4 h-4 mr-2" />
            Advanced Filters
            <ChevronDownIcon
              className={`w-4 h-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />

          </Button>

          {/* Column Visibility */}
          <div className="relative">
            <Button variant="outline" onClick={() => setShowColumnDropdown(!showColumnDropdown)}>
              <ColumnsIcon className="w-4 h-4 mr-2" />
              Columns
            </Button>
            {showColumnDropdown &&
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56 z-20 max-h-80 overflow-y-auto">
                {Object.entries(visibleColumns).map(([key, value]) =>
              <button
                key={key}
                onClick={() => toggleColumn(key)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">

                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {value && <CheckIcon className="w-4 h-4 text-blue-600" />}
                  </button>
              )}
              </div>
            }
          </div>

          {/* Clear Filters */}
          {hasActiveFilters &&
          <Button variant="ghost" onClick={clearAllFilters}>
              <XIcon className="w-4 h-4 mr-1" />
              Clear
            </Button>
          }
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
        <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Designation */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
                <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {designations.map((des) =>
                <option key={des} value={des}>
                      {des}
                    </option>
                )}
                </select>
              </div>

              {/* Employee Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Employee Type</label>
                <select
                value={selectedEmployeeType}
                onChange={(e) => setSelectedEmployeeType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {employeeTypes.map((type) =>
                <option key={type} value={type}>
                      {type}
                    </option>
                )}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
                <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {branches.map((branch) =>
                <option key={branch} value={branch}>
                      {branch}
                    </option>
                )}
                </select>
              </div>

              {/* Probation Period */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Probation Period
                </label>
                <select
                value={selectedProbationPeriod}
                onChange={(e) => setSelectedProbationPeriod(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {probationPeriods.map((period) =>
                <option key={period} value={period}>
                      {period}
                    </option>
                )}
                </select>
              </div>

              {/* Joining Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Joining Date From
                </label>
                <input
                type="date"
                value={joiningDateFrom}
                onChange={(e) => setJoiningDateFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Joining Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Joining Date To</label>
                <input
                type="date"
                value={joiningDateTo}
                onChange={(e) => setJoiningDateTo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Probation End From */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Probation End From
                </label>
                <input
                type="date"
                value={probationEndFrom}
                onChange={(e) => setProbationEndFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Probation End To */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Probation End To
                </label>
                <input
                type="date"
                value={probationEndTo}
                onChange={(e) => setProbationEndTo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
          </div>
        }
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{paginatedEmployees.length}</span> of{' '}
          <span className="font-medium">{filteredEmployees.length}</span> employees on probation
          {hasActiveFilters &&
          <span className="text-blue-600 ml-1">(filtered from {employees.length} total)</span>
          }
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.employeeCode &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeCode')}>

                    <div className="flex items-center gap-1">
                      Emp Code
                      {getSortIcon('employeeCode')}
                    </div>
                  </th>
                }
                {visibleColumns.name &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                    <div className="flex items-center gap-1">
                      Employee Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                }
                {visibleColumns.email &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                }
                {visibleColumns.phone &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                }
                {visibleColumns.department &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}>

                    <div className="flex items-center gap-1">
                      Department
                      {getSortIcon('department')}
                    </div>
                  </th>
                }
                {visibleColumns.designation &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('designation')}>

                    <div className="flex items-center gap-1">
                      Designation
                      {getSortIcon('designation')}
                    </div>
                  </th>
                }
                {visibleColumns.employeeType &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                }
                {visibleColumns.branch &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                }
                {visibleColumns.reportingManager &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporting Manager
                  </th>
                }
                {visibleColumns.dateOfJoining &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dateOfJoining')}>

                    <div className="flex items-center gap-1">
                      Joining Date
                      {getSortIcon('dateOfJoining')}
                    </div>
                  </th>
                }
                {visibleColumns.probationPeriod &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probation Period
                  </th>
                }
                {visibleColumns.probationEndDate &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('probationEndDate')}>

                    <div className="flex items-center gap-1">
                      Probation End
                      {getSortIcon('probationEndDate')}
                    </div>
                  </th>
                }
                {visibleColumns.progress &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                }
                {visibleColumns.daysLeft &&
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('daysLeft')}>

                    <div className="flex items-center gap-1">
                      Days Left
                      {getSortIcon('daysLeft')}
                    </div>
                  </th>
                }
                {visibleColumns.status &&
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                }
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEmployees.map((employee) =>
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  {visibleColumns.employeeCode &&
                <td className="px-4 py-3">
                      <span className="text-sm font-medium text-blue-600">{employee.employeeCode}</span>
                    </td>
                }
                  {visibleColumns.name &&
                <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.gender}</p>
                        </div>
                      </div>
                    </td>
                }
                  {visibleColumns.email &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{employee.email}</span>
                    </td>
                }
                  {visibleColumns.phone &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{employee.phone}</span>
                    </td>
                }
                  {visibleColumns.department &&
                <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{employee.department}</span>
                      </div>
                    </td>
                }
                  {visibleColumns.designation &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{employee.designation}</span>
                    </td>
                }
                  {visibleColumns.employeeType &&
                <td className="px-4 py-3">
                      <span
                    className={`text-xs px-2 py-1 rounded ${
                    employee.employeeType === 'Teaching Staff' ?
                    'bg-blue-50 text-blue-700' :
                    'bg-purple-50 text-purple-700'}`
                    }>

                        {employee.employeeType}
                      </span>
                    </td>
                }
                  {visibleColumns.branch &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{employee.branch}</span>
                    </td>
                }
                  {visibleColumns.reportingManager &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{employee.reportingManager}</span>
                    </td>
                }
                  {visibleColumns.dateOfJoining &&
                <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(employee.dateOfJoining)}
                        </span>
                      </div>
                    </td>
                }
                  {visibleColumns.probationPeriod &&
                <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{employee.probationPeriod}</span>
                      </div>
                    </td>
                }
                  {visibleColumns.probationEndDate &&
                <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {formatDate(employee.probationEndDate)}
                      </span>
                    </td>
                }
                  {visibleColumns.progress &&
                <td className="px-4 py-3">
                      <div className="w-24">
                        <ProgressBar
                      completed={employee.daysCompleted}
                      total={employee.totalProbationDays}
                      status={employee.status} />

                      </div>
                    </td>
                }
                  {visibleColumns.daysLeft &&
                <td className="px-4 py-3">
                      <span
                    className={`text-sm font-medium ${getDaysLeftColor(employee.daysLeft, employee.status)}`}>

                        {getDaysLeftText(employee.daysLeft, employee.status)}
                      </span>
                    </td>
                }
                  {visibleColumns.status &&
                <td className="px-4 py-3">
                      <Badge variant={getStatusVariant(employee.status)}>{employee.status}</Badge>
                    </td>
                }
                  <td className="px-4 py-3">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/hr/employee/${employee.id}/profile`)}>

                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Empty State */}
          {paginatedEmployees.length === 0 &&
          <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
              <p className="text-sm text-gray-500">
                {hasActiveFilters ?
              'Try adjusting your filters to find what you are looking for.' :
              'There are no employees on probation at the moment.'}
              </p>
              {hasActiveFilters &&
            <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                  Clear all filters
                </Button>
            }
            </div>
          }
        </div>

        {/* Pagination */}
        {paginatedEmployees.length > 0 && totalPages > 1 &&
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">

                <ChevronsLeftIcon className="w-4 h-4" />
              </button>
              <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">

                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  currentPage === pageNum ?
                  'bg-blue-600 text-white' :
                  'hover:bg-gray-100 text-gray-700'}`
                  }>

                    {pageNum}
                  </button>);

            })}
              <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">

                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">

                <ChevronsRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      </Card>

      {/* Click outside to close dropdowns */}
      {(showExportDropdown || showColumnDropdown) &&
      <div
        className="fixed inset-0 z-10"
        onClick={() => {
          setShowExportDropdown(false);
          setShowColumnDropdown(false);
        }} />

      }
    </div>);

}