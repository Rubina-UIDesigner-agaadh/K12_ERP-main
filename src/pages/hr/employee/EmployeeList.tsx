import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  MoreHorizontal,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Calendar,
  Users,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  CheckSquare,
  Square,
  ArrowUpDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Mail,
  Edit,
  MessageCircle } from
'lucide-react';

// Types
interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  type: 'Teaching' | 'Non-Teaching' | 'Support' | 'Contract';
  status: 'Active' | 'Probation' | 'On Leave' | 'Resigned' | 'Terminated' | 'Retired';
  joiningDate: string;
  gender: 'Male' | 'Female' | 'Other';
  shift: string;
  reportingTo: string;
  location: string;
  experience: number;
  qualification: string;
  avatar?: string;
}

interface FilterState {
  search: string;
  department: string;
  designation: string;
  staffType: string;
  status: string;
  gender: string;
  shift: string;
  location: string;
  joiningDateFrom: string;
  joiningDateTo: string;
  experienceMin: string;
  experienceMax: string;
  reportingTo: string;
  qualification: string;
}

// Mock Data
const mockEmployees: Employee[] = [
{
  id: '1',
  code: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.k@school.edu',
  phone: '+91 9876543201',
  department: 'Mathematics',
  designation: 'HOD',
  type: 'Teaching',
  status: 'Active',
  joiningDate: '2018-06-15',
  gender: 'Male',
  shift: 'Morning',
  reportingTo: 'Principal',
  location: 'Main Campus',
  experience: 15,
  qualification: 'Ph.D Mathematics'
},
{
  id: '2',
  code: 'EMP002',
  name: 'Sarah Jenkins',
  email: 'sarah.j@school.edu',
  phone: '+91 9876543202',
  department: 'English',
  designation: 'Senior Teacher',
  type: 'Teaching',
  status: 'Active',
  joiningDate: '2019-04-01',
  gender: 'Female',
  shift: 'Morning',
  reportingTo: 'Dr. Rajesh Kumar',
  location: 'Main Campus',
  experience: 10,
  qualification: 'M.A English'
},
{
  id: '3',
  code: 'EMP003',
  name: 'Michael Chen',
  email: 'michael.c@school.edu',
  phone: '+91 9876543203',
  department: 'Administration',
  designation: 'Admin Officer',
  type: 'Non-Teaching',
  status: 'On Leave',
  joiningDate: '2020-01-10',
  gender: 'Male',
  shift: 'General',
  reportingTo: 'HR Manager',
  location: 'Admin Block',
  experience: 8,
  qualification: 'MBA'
},
{
  id: '4',
  code: 'EMP004',
  name: 'Priya Sharma',
  email: 'priya.s@school.edu',
  phone: '+91 9876543204',
  department: 'Science',
  designation: 'Lab Assistant',
  type: 'Support',
  status: 'Probation',
  joiningDate: '2023-08-01',
  gender: 'Female',
  shift: 'Morning',
  reportingTo: 'Science HOD',
  location: 'Science Block',
  experience: 2,
  qualification: 'B.Sc Chemistry'
},
{
  id: '5',
  code: 'EMP005',
  name: 'Robert Wilson',
  email: 'robert.w@school.edu',
  phone: '+91 9876543205',
  department: 'Transport',
  designation: 'Driver',
  type: 'Support',
  status: 'Active',
  joiningDate: '2021-03-15',
  gender: 'Male',
  shift: 'Morning',
  reportingTo: 'Transport Manager',
  location: 'Transport Yard',
  experience: 5,
  qualification: 'High School'
},
{
  id: '6',
  code: 'EMP006',
  name: 'Dr. Anita Desai',
  email: 'anita.d@school.edu',
  phone: '+91 9876543206',
  department: 'Science',
  designation: 'HOD',
  type: 'Teaching',
  status: 'Active',
  joiningDate: '2017-07-01',
  gender: 'Female',
  shift: 'Morning',
  reportingTo: 'Principal',
  location: 'Science Block',
  experience: 18,
  qualification: 'Ph.D Physics'
},
{
  id: '7',
  code: 'EMP007',
  name: 'James Anderson',
  email: 'james.a@school.edu',
  phone: '+91 9876543207',
  department: 'Physical Education',
  designation: 'Sports Coach',
  type: 'Teaching',
  status: 'Active',
  joiningDate: '2019-08-15',
  gender: 'Male',
  shift: 'Morning',
  reportingTo: 'Vice Principal',
  location: 'Sports Complex',
  experience: 12,
  qualification: 'M.P.Ed'
},
{
  id: '8',
  code: 'EMP008',
  name: 'Meera Patel',
  email: 'meera.p@school.edu',
  phone: '+91 9876543208',
  department: 'Library',
  designation: 'Librarian',
  type: 'Non-Teaching',
  status: 'Active',
  joiningDate: '2020-06-01',
  gender: 'Female',
  shift: 'General',
  reportingTo: 'Academic Coordinator',
  location: 'Library Block',
  experience: 7,
  qualification: 'M.Lib.Sc'
},
{
  id: '9',
  code: 'EMP009',
  name: 'David Thompson',
  email: 'david.t@school.edu',
  phone: '+91 9876543209',
  department: 'IT',
  designation: 'System Administrator',
  type: 'Non-Teaching',
  status: 'Active',
  joiningDate: '2021-01-15',
  gender: 'Male',
  shift: 'General',
  reportingTo: 'IT Manager',
  location: 'Admin Block',
  experience: 6,
  qualification: 'B.Tech IT'
},
{
  id: '10',
  code: 'EMP010',
  name: 'Sunita Verma',
  email: 'sunita.v@school.edu',
  phone: '+91 9876543210',
  department: 'Accounts',
  designation: 'Accountant',
  type: 'Non-Teaching',
  status: 'Active',
  joiningDate: '2018-04-01',
  gender: 'Female',
  shift: 'General',
  reportingTo: 'Finance Manager',
  location: 'Admin Block',
  experience: 10,
  qualification: 'M.Com, CA'
},
{
  id: '11',
  code: 'EMP011',
  name: 'Rahul Mehta',
  email: 'rahul.m@school.edu',
  phone: '+91 9876543211',
  department: 'Computer Science',
  designation: 'Teacher',
  type: 'Teaching',
  status: 'Probation',
  joiningDate: '2024-01-02',
  gender: 'Male',
  shift: 'Morning',
  reportingTo: 'CS HOD',
  location: 'Computer Lab',
  experience: 3,
  qualification: 'MCA'
},
{
  id: '12',
  code: 'EMP012',
  name: 'Jennifer Williams',
  email: 'jennifer.w@school.edu',
  phone: '+91 9876543212',
  department: 'Music',
  designation: 'Music Teacher',
  type: 'Teaching',
  status: 'Active',
  joiningDate: '2022-07-01',
  gender: 'Female',
  shift: 'Morning',
  reportingTo: 'Arts Coordinator',
  location: 'Arts Block',
  experience: 8,
  qualification: 'M.A Music'
},
{
  id: '13',
  code: 'EMP013',
  name: 'Arun Krishnan',
  email: 'arun.k@school.edu',
  phone: '+91 9876543213',
  department: 'Security',
  designation: 'Security Supervisor',
  type: 'Support',
  status: 'Active',
  joiningDate: '2019-02-01',
  gender: 'Male',
  shift: 'Rotating',
  reportingTo: 'Admin Officer',
  location: 'Main Gate',
  experience: 15,
  qualification: 'High School'
},
{
  id: '14',
  code: 'EMP014',
  name: 'Kavitha Nair',
  email: 'kavitha.n@school.edu',
  phone: '+91 9876543214',
  department: 'Hindi',
  designation: 'Teacher',
  type: 'Teaching',
  status: 'Resigned',
  joiningDate: '2020-06-15',
  gender: 'Female',
  shift: 'Morning',
  reportingTo: 'Hindi HOD',
  location: 'Main Campus',
  experience: 5,
  qualification: 'M.A Hindi'
},
{
  id: '15',
  code: 'EMP015',
  name: 'Mohammed Faiz',
  email: 'mohammed.f@school.edu',
  phone: '+91 9876543215',
  department: 'Maintenance',
  designation: 'Maintenance Head',
  type: 'Support',
  status: 'Active',
  joiningDate: '2017-03-01',
  gender: 'Male',
  shift: 'General',
  reportingTo: 'Admin Officer',
  location: 'Maintenance Block',
  experience: 12,
  qualification: 'ITI'
}];


// Filter Options
const departments = [
'Mathematics',
'English',
'Science',
'Hindi',
'Computer Science',
'Physical Education',
'Music',
'Administration',
'Accounts',
'IT',
'Library',
'Transport',
'Security',
'Maintenance'];


const designations = [
'Principal',
'Vice Principal',
'HOD',
'Senior Teacher',
'Teacher',
'Lab Assistant',
'Sports Coach',
'Music Teacher',
'Librarian',
'Admin Officer',
'Accountant',
'System Administrator',
'Driver',
'Security Supervisor',
'Maintenance Head'];


const staffTypes = ['Teaching', 'Non-Teaching', 'Support', 'Contract'];
const statuses = ['Active', 'Probation', 'On Leave', 'Resigned', 'Terminated', 'Retired'];
const genders = ['Male', 'Female', 'Other'];
const shifts = ['Morning', 'Afternoon', 'General', 'Rotating', 'Night'];
const locations = [
'Main Campus',
'Admin Block',
'Science Block',
'Arts Block',
'Library Block',
'Computer Lab',
'Sports Complex',
'Transport Yard',
'Main Gate',
'Maintenance Block'];


const qualifications = [
'High School',
'ITI',
'Diploma',
'Graduate',
'Post Graduate',
'B.Ed',
'M.Ed',
'Ph.D',
'MBA',
'MCA',
'B.Tech',
'M.Tech'];


export function EmployeeList() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    designation: '',
    staffType: '',
    status: '',
    gender: '',
    shift: '',
    location: '',
    joiningDateFrom: '',
    joiningDateTo: '',
    experienceMin: '',
    experienceMax: '',
    reportingTo: '',
    qualification: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((employee) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
        employee.name.toLowerCase().includes(searchLower) ||
        employee.code.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.phone.includes(filters.search) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.designation.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.department && employee.department !== filters.department) {
        return false;
      }

      if (filters.designation && employee.designation !== filters.designation) {
        return false;
      }

      if (filters.staffType && employee.type !== filters.staffType) {
        return false;
      }

      if (filters.status && employee.status !== filters.status) {
        return false;
      }

      if (filters.gender && employee.gender !== filters.gender) {
        return false;
      }

      if (filters.shift && employee.shift !== filters.shift) {
        return false;
      }

      if (filters.location && employee.location !== filters.location) {
        return false;
      }

      if (filters.joiningDateFrom) {
        if (new Date(employee.joiningDate) < new Date(filters.joiningDateFrom)) {
          return false;
        }
      }

      if (filters.joiningDateTo) {
        if (new Date(employee.joiningDate) > new Date(filters.joiningDateTo)) {
          return false;
        }
      }

      if (filters.experienceMin) {
        if (employee.experience < parseInt(filters.experienceMin)) {
          return false;
        }
      }

      if (filters.experienceMax) {
        if (employee.experience > parseInt(filters.experienceMax)) {
          return false;
        }
      }

      if (filters.reportingTo) {
        const reportingLower = filters.reportingTo.toLowerCase();
        if (!employee.reportingTo.toLowerCase().includes(reportingLower)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const sortedEmployees = useMemo(() => {
    if (!sortConfig) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      designation: '',
      staffType: '',
      status: '',
      gender: '',
      shift: '',
      location: '',
      joiningDateFrom: '',
      joiningDateTo: '',
      experienceMin: '',
      experienceMax: '',
      reportingTo: '',
      qualification: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === paginatedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedEmployees.map((e) => e.id));
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting as ${format}...`);
    setShowExportMenu(false);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on:`, selectedEmployees);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <UserCheck className="w-3 h-3" />;
      case 'On Leave':
        return <Clock className="w-3 h-3" />;
      case 'Probation':
        return <AlertCircle className="w-3 h-3" />;
      case 'Resigned':
      case 'Terminated':
        return <UserX className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Probation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'On Leave':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resigned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Retired':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Teaching':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Non-Teaching':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Support':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Contract':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all {mockEmployees.length} staff members
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${
              viewMode === 'table' ?
              'bg-indigo-100 text-indigo-600' :
              'text-gray-500 hover:bg-gray-100'}`
              }>

              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
              viewMode === 'grid' ?
              'bg-indigo-100 text-indigo-600' :
              'text-gray-500 hover:bg-gray-100'}`
              }>

              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4" />
                  Export as Excel
                </button>
                <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>
            }
          </div>
        </div>
      </div>

     

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Basic Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, code, email, phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />

              {filters.search &&
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>

            {/* Department */}
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Departments</option>
              {departments.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>

            {/* Staff Type */}
            <select
              value={filters.staffType}
              onChange={(e) => handleFilterChange('staffType', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Staff Types</option>
              {staffTypes.map((type) =>
              <option key={type} value={type}>
                  {type}
                </option>
              )}
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Statuses</option>
              {statuses.map((status) =>
              <option key={status} value={status}>
                  {status}
                </option>
              )}
            </select>
          </div>

          {/* Toggle Advanced Filters */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">

              <SlidersHorizontal className="w-4 h-4" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              {showAdvancedFilters ?
              <ChevronUp className="w-4 h-4" /> :

              <ChevronDown className="w-4 h-4" />
              }
            </button>

            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 &&
              <span className="text-sm text-gray-500">
                  {activeFiltersCount} filter(s) applied
                </span>
              }
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">

                <RefreshCw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
        <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Designation */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Designation
                </label>
                <select
                value={filters.designation}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Designations</option>
                  {designations.map((designation) =>
                <option key={designation} value={designation}>
                      {designation}
                    </option>
                )}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Genders</option>
                  {genders.map((gender) =>
                <option key={gender} value={gender}>
                      {gender}
                    </option>
                )}
                </select>
              </div>

              {/* Shift */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shift</label>
                <select
                value={filters.shift}
                onChange={(e) => handleFilterChange('shift', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Shifts</option>
                  {shifts.map((shift) =>
                <option key={shift} value={shift}>
                      {shift}
                    </option>
                )}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Locations</option>
                  {locations.map((location) =>
                <option key={location} value={location}>
                      {location}
                    </option>
                )}
                </select>
              </div>

              {/* Joining Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Joining From
                </label>
                <input
                type="date"
                value={filters.joiningDateFrom}
                onChange={(e) => handleFilterChange('joiningDateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm" />

              </div>

              {/* Joining Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Joining To</label>
                <input
                type="date"
                value={filters.joiningDateTo}
                onChange={(e) => handleFilterChange('joiningDateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm" />

              </div>

              {/* Experience Min */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Min Experience (Years)
                </label>
                <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters.experienceMin}
                onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm" />

              </div>

              {/* Experience Max */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max Experience (Years)
                </label>
                <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters.experienceMax}
                onChange={(e) => handleFilterChange('experienceMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm" />

              </div>

              {/* Reporting To */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Reporting To
                </label>
                <input
                type="text"
                placeholder="Search reporting manager..."
                value={filters.reportingTo}
                onChange={(e) => handleFilterChange('reportingTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm" />

              </div>

              {/* Qualification */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Qualification
                </label>
                <select
                value={filters.qualification}
                onChange={(e) => handleFilterChange('qualification', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Qualifications</option>
                  {qualifications.map((qual) =>
                <option key={qual} value={qual}>
                      {qual}
                    </option>
                )}
                </select>
              </div>
            </div>
          </div>
        }

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 &&
        <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-indigo-700">
                {selectedEmployees.length} employee(s) selected
              </span>
              <button
              onClick={() => setSelectedEmployees([])}
              className="text-sm text-indigo-600 hover:text-indigo-700">

                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
              onClick={() => handleBulkAction('export')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">

                <Download className="w-4 h-4" />
                Export Selected
              </button>
            </div>
          </div>
        }

        {/* Results Info */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, sortedEmployees.length)}
            </span>{' '}
            of <span className="font-medium">{sortedEmployees.length}</span> employees
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">

              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' &&
        <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button onClick={handleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                      {selectedEmployees.length === paginatedEmployees.length &&
                    paginatedEmployees.length > 0 ?
                    <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                    <Square className="w-4 h-4 text-gray-400" />
                    }
                    </button>
                  </th>
                  <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('code')}>

                    <div className="flex items-center gap-1">
                      Code
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                    <div className="flex items-center gap-1">
                      Employee
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}>

                    <div className="flex items-center gap-1">
                      Department
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Staff Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('joiningDate')}>

                    <div className="flex items-center gap-1">
                      Joining Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEmployees.map((employee) =>
              <tr
                key={employee.id}
                className="hover:bg-gray-50 transition-colors">

                    <td className="px-4 py-3">
                      <button
                    onClick={() => handleSelectEmployee(employee.id)}
                    className="p-1 hover:bg-gray-200 rounded">

                        {selectedEmployees.includes(employee.id) ?
                    <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                    <Square className="w-4 h-4 text-gray-400" />
                    }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {employee.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name.
                      split(' ').
                      map((n) => n[0]).
                      join('').
                      slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">{employee.department}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                      employee.type
                    )}`}>

                        {employee.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      employee.status
                    )}`}>

                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(employee.joiningDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 relative">
                        <button
                      className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="View Profile">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() =>
                      setShowActionsMenu(
                        showActionsMenu === employee.id ? null : employee.id
                      )
                      }
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">

                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {showActionsMenu === employee.id &&
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button
                        onClick={() => {
                          console.log('Edit:', employee.id);
                          setShowActionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <Edit className="w-4 h-4" />
                              Edit Details
                            </button>
                            <button
                        onClick={() => {
                          console.log('Chat with:', employee.id);
                          setShowActionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </button>
                            <button
                        onClick={() => {
                          console.log('Download Documents:', employee.id);
                          setShowActionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <Download className="w-4 h-4" />
                              Download Documents
                            </button>
                          </div>
                    }
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>

            {paginatedEmployees.length === 0 &&
          <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700">

                  Clear all filters
                </button>
              </div>
          }
          </div>
        }

        {/* Grid View */}
        {viewMode === 'grid' &&
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedEmployees.map((employee) =>
            <div
              key={employee.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow relative">

                  <div className="absolute top-3 right-3">
                    <button
                  onClick={() => handleSelectEmployee(employee.id)}
                  className="p-1 hover:bg-gray-100 rounded">

                      {selectedEmployees.includes(employee.id) ?
                  <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                  <Square className="w-4 h-4 text-gray-400" />
                  }
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mb-3">
                      {employee.name.
                  split(' ').
                  map((n) => n[0]).
                  join('').
                  slice(0, 2)}
                    </div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                    <span className="font-mono text-xs text-gray-400 mt-1">{employee.code}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {employee.department}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {employee.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    employee.status
                  )}`}>

                      {getStatusIcon(employee.status)}
                      {employee.status}
                    </span>
                    <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                    employee.type
                  )}`}>

                      {employee.type}
                    </span>
                  </div>

                  <button
                className="w-full mt-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">

                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                </div>
            )}
            </div>

            {paginatedEmployees.length === 0 &&
          <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700">

                  Clear all filters
                </button>
              </div>
          }
          </div>
        }

        {/* Pagination */}
        {sortedEmployees.length > 0 &&
        <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">

                First
              </button>
              <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">

                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
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
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum ?
                    'bg-indigo-600 text-white' :
                    'hover:bg-gray-100 text-gray-700'}`
                    }>

                      {pageNum}
                    </button>);

              })}
              </div>

              <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">

                Next
              </button>
              <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">

                Last
              </button>
            </div>
          </div>
        }
      </div>

      {/* Click outside to close menus */}
      {(showActionsMenu || showExportMenu) &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => {
          setShowActionsMenu(null);
          setShowExportMenu(false);
        }} />

      }
    </div>);

}