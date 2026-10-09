import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  FileText,
  Calendar,
  Building2,
  User,
  Filter,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
  FileCheck,
  FileClock,
  Briefcase,
  UserMinus,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Printer,
  Edit,
  Archive } from
'lucide-react';

// Types
interface ExitEmployee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  staffType: 'Teaching' | 'Non-Teaching' | 'Support' | 'Contract';
  dateOfJoining: string;
  relievingDate: string;
  exitType: 'Resignation' | 'Retirement' | 'Termination' | 'Contract End' | 'Absconding' | 'Death';
  reason: string;
  noticePeriod: string;
  noticeServed: boolean;
  clearanceStatus: 'Completed' | 'Pending' | 'In Progress';
  relievingLetterIssued: boolean;
  experienceLetterIssued: boolean;
  fullAndFinalStatus: 'Settled' | 'Pending' | 'In Progress';
  fullAndFinalAmount: number;
  exitInterviewDone: boolean;
  remarks: string;
  processedBy: string;
  avatar?: string;
}

interface FilterState {
  search: string;
  department: string;
  exitType: string;
  year: string;
  clearanceStatus: string;
  staffType: string;
  letterStatus: string;
  fnfStatus: string;
}

// Mock Data
const mockExitEmployees: ExitEmployee[] = [
{
  id: '1',
  code: 'EMP098',
  name: 'Thomas Anderson',
  email: 'thomas.a@school.edu',
  phone: '+91 9876543301',
  department: 'IT Support',
  designation: 'System Admin',
  staffType: 'Non-Teaching',
  dateOfJoining: '2019-03-10',
  relievingDate: '2023-12-31',
  exitType: 'Resignation',
  reason: 'Better opportunity',
  noticePeriod: '30 days',
  noticeServed: true,
  clearanceStatus: 'Completed',
  relievingLetterIssued: true,
  experienceLetterIssued: true,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 125000,
  exitInterviewDone: true,
  remarks: 'Good performer, left on positive terms',
  processedBy: 'HR Manager'
},
{
  id: '2',
  code: 'EMP105',
  name: 'Maria Garcia',
  email: 'maria.g@school.edu',
  phone: '+91 9876543302',
  department: 'Spanish Dept',
  designation: 'Teacher',
  staffType: 'Contract',
  dateOfJoining: '2020-06-01',
  relievingDate: '2024-01-15',
  exitType: 'Contract End',
  reason: 'Contract period completed',
  noticePeriod: 'N/A',
  noticeServed: true,
  clearanceStatus: 'Completed',
  relievingLetterIssued: true,
  experienceLetterIssued: true,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 85000,
  exitInterviewDone: true,
  remarks: 'Excellent teacher, contract not renewed due to budget constraints',
  processedBy: 'Academic Coordinator'
},
{
  id: '3',
  code: 'EMP067',
  name: 'Robert Williams',
  email: 'robert.w@school.edu',
  phone: '+91 9876543303',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  staffType: 'Teaching',
  dateOfJoining: '2010-07-15',
  relievingDate: '2024-02-28',
  exitType: 'Retirement',
  reason: 'Superannuation',
  noticePeriod: '90 days',
  noticeServed: true,
  clearanceStatus: 'Completed',
  relievingLetterIssued: true,
  experienceLetterIssued: true,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 450000,
  exitInterviewDone: true,
  remarks: 'Retired after 14 years of dedicated service',
  processedBy: 'Principal'
},
{
  id: '4',
  code: 'EMP142',
  name: 'Priya Patel',
  email: 'priya.p@school.edu',
  phone: '+91 9876543304',
  department: 'Administration',
  designation: 'Office Assistant',
  staffType: 'Non-Teaching',
  dateOfJoining: '2021-09-01',
  relievingDate: '2024-03-10',
  exitType: 'Resignation',
  reason: 'Personal reasons',
  noticePeriod: '30 days',
  noticeServed: false,
  clearanceStatus: 'In Progress',
  relievingLetterIssued: false,
  experienceLetterIssued: false,
  fullAndFinalStatus: 'In Progress',
  fullAndFinalAmount: 45000,
  exitInterviewDone: false,
  remarks: 'Short notice resignation, clearance pending',
  processedBy: 'Admin Officer'
},
{
  id: '5',
  code: 'EMP089',
  name: 'James Wilson',
  email: 'james.w@school.edu',
  phone: '+91 9876543305',
  department: 'Security',
  designation: 'Security Guard',
  staffType: 'Support',
  dateOfJoining: '2018-04-20',
  relievingDate: '2023-11-15',
  exitType: 'Termination',
  reason: 'Misconduct',
  noticePeriod: 'Immediate',
  noticeServed: false,
  clearanceStatus: 'Completed',
  relievingLetterIssued: false,
  experienceLetterIssued: false,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 15000,
  exitInterviewDone: false,
  remarks: 'Terminated due to policy violation',
  processedBy: 'HR Manager'
},
{
  id: '6',
  code: 'EMP156',
  name: 'Anita Sharma',
  email: 'anita.s@school.edu',
  phone: '+91 9876543306',
  department: 'English',
  designation: 'Teacher',
  staffType: 'Teaching',
  dateOfJoining: '2022-04-01',
  relievingDate: '2024-03-31',
  exitType: 'Resignation',
  reason: 'Relocation',
  noticePeriod: '60 days',
  noticeServed: true,
  clearanceStatus: 'Pending',
  relievingLetterIssued: false,
  experienceLetterIssued: false,
  fullAndFinalStatus: 'Pending',
  fullAndFinalAmount: 78000,
  exitInterviewDone: false,
  remarks: 'Relocating to another city',
  processedBy: 'Vice Principal'
},
{
  id: '7',
  code: 'EMP078',
  name: 'Ravi Kumar',
  email: 'ravi.k@school.edu',
  phone: '+91 9876543307',
  department: 'Transport',
  designation: 'Driver',
  staffType: 'Support',
  dateOfJoining: '2017-01-10',
  relievingDate: '2023-08-20',
  exitType: 'Absconding',
  reason: 'Left without notice',
  noticePeriod: 'N/A',
  noticeServed: false,
  clearanceStatus: 'Pending',
  relievingLetterIssued: false,
  experienceLetterIssued: false,
  fullAndFinalStatus: 'Pending',
  fullAndFinalAmount: 0,
  exitInterviewDone: false,
  remarks: 'Absconded without any intimation, dues pending recovery',
  processedBy: 'HR Manager'
},
{
  id: '8',
  code: 'EMP112',
  name: 'Dr. Sunita Verma',
  email: 'sunita.v@school.edu',
  phone: '+91 9876543308',
  department: 'Science',
  designation: 'HOD',
  staffType: 'Teaching',
  dateOfJoining: '2008-06-01',
  relievingDate: '2024-01-31',
  exitType: 'Retirement',
  reason: 'Voluntary retirement',
  noticePeriod: '90 days',
  noticeServed: true,
  clearanceStatus: 'Completed',
  relievingLetterIssued: true,
  experienceLetterIssued: true,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 520000,
  exitInterviewDone: true,
  remarks: 'Took VRS after 16 years of service',
  processedBy: 'Principal'
},
{
  id: '9',
  code: 'EMP134',
  name: 'Mohammed Ali',
  email: 'mohammed.a@school.edu',
  phone: '+91 9876543309',
  department: 'Accounts',
  designation: 'Accountant',
  staffType: 'Non-Teaching',
  dateOfJoining: '2019-11-15',
  relievingDate: '2024-02-15',
  exitType: 'Resignation',
  reason: 'Higher studies',
  noticePeriod: '30 days',
  noticeServed: true,
  clearanceStatus: 'Completed',
  relievingLetterIssued: true,
  experienceLetterIssued: true,
  fullAndFinalStatus: 'Settled',
  fullAndFinalAmount: 95000,
  exitInterviewDone: true,
  remarks: 'Left to pursue MBA',
  processedBy: 'Finance Manager'
},
{
  id: '10',
  code: 'EMP145',
  name: 'Jennifer Brown',
  email: 'jennifer.b@school.edu',
  phone: '+91 9876543310',
  department: 'Music',
  designation: 'Music Teacher',
  staffType: 'Contract',
  dateOfJoining: '2023-04-01',
  relievingDate: '2024-03-31',
  exitType: 'Contract End',
  reason: 'Contract completed',
  noticePeriod: 'N/A',
  noticeServed: true,
  clearanceStatus: 'In Progress',
  relievingLetterIssued: false,
  experienceLetterIssued: false,
  fullAndFinalStatus: 'In Progress',
  fullAndFinalAmount: 65000,
  exitInterviewDone: true,
  remarks: 'Contract ended, offered renewal but declined',
  processedBy: 'Arts Coordinator'
}];


// Filter Options
const departments = [
'IT Support',
'Spanish Dept',
'Mathematics',
'Administration',
'Security',
'English',
'Transport',
'Science',
'Accounts',
'Music',
'Hindi',
'Physics',
'Chemistry',
'Library'];


const exitTypes = ['Resignation', 'Retirement', 'Termination', 'Contract End', 'Absconding', 'Death'];
const staffTypes = ['Teaching', 'Non-Teaching', 'Support', 'Contract'];
const clearanceStatuses = ['Completed', 'Pending', 'In Progress'];
const fnfStatuses = ['Settled', 'Pending', 'In Progress'];
const years = ['2024', '2023', '2022', '2021', '2020'];

export function ExitRelievedEmployees() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    exitType: '',
    year: '',
    clearanceStatus: '',
    staffType: '',
    letterStatus: '',
    fnfStatus: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return mockExitEmployees.filter((employee) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
        employee.name.toLowerCase().includes(searchLower) ||
        employee.code.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.designation.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.department && employee.department !== filters.department) {
        return false;
      }

      if (filters.exitType && employee.exitType !== filters.exitType) {
        return false;
      }

      if (filters.year) {
        const exitYear = new Date(employee.relievingDate).getFullYear().toString();
        if (exitYear !== filters.year) return false;
      }

      if (filters.clearanceStatus && employee.clearanceStatus !== filters.clearanceStatus) {
        return false;
      }

      if (filters.staffType && employee.staffType !== filters.staffType) {
        return false;
      }

      if (filters.letterStatus) {
        if (filters.letterStatus === 'issued') {
          if (!employee.relievingLetterIssued && !employee.experienceLetterIssued) return false;
        } else if (filters.letterStatus === 'pending') {
          if (employee.relievingLetterIssued && employee.experienceLetterIssued) return false;
        }
      }

      if (filters.fnfStatus && employee.fullAndFinalStatus !== filters.fnfStatus) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort employees
  const sortedEmployees = useMemo(() => {
    if (!sortConfig) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof ExitEmployee];
      let bValue: any = b[sortConfig.key as keyof ExitEmployee];

      if (sortConfig.key === 'relievingDate' || sortConfig.key === 'dateOfJoining') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      exitType: '',
      year: '',
      clearanceStatus: '',
      staffType: '',
      letterStatus: '',
      fnfStatus: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
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
    setSelectedEmployees([]);
  };

  const calculateServiceDuration = (joinDate: string, exitDate: string) => {
    const join = new Date(joinDate);
    const exit = new Date(exitDate);
    const diffTime = Math.abs(exit.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor(diffDays % 365 / 30);
    return `${years}y ${months}m`;
  };

  const getExitTypeColor = (type: string) => {
    switch (type) {
      case 'Resignation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Retirement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Termination':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Contract End':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Absconding':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Death':
        return 'bg-gray-800 text-white border-gray-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClearanceColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFnFColor = (status: string) => {
    switch (status) {
      case 'Settled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
          <h1 className="text-2xl font-bold text-gray-900">Exit & Relieved Employees</h1>
          <p className="text-sm text-gray-500 mt-1">
            Archive of past employees and exit records • {mockExitEmployees.length} total records
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">

              <Download className="w-4 h-4" />
              <span>Export Archive</span>
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
                placeholder="Search by name, code, email..."
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

            {/* Exit Type */}
            <select
              value={filters.exitType}
              onChange={(e) => handleFilterChange('exitType', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Exit Types</option>
              {exitTypes.map((type) =>
              <option key={type} value={type}>
                  {type}
                </option>
              )}
            </select>

            {/* Year */}
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Years</option>
              {years.map((year) =>
              <option key={year} value={year}>
                  Year: {year}
                </option>
              )}
            </select>

            {/* Clearance Status */}
            <select
              value={filters.clearanceStatus}
              onChange={(e) => handleFilterChange('clearanceStatus', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">

              <option value="">All Clearance Status</option>
              {clearanceStatuses.map((status) =>
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

              <Filter className="w-4 h-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Departments</option>
                  {departments.map((dept) =>
                <option key={dept} value={dept}>
                      {dept}
                    </option>
                )}
                </select>
              </div>

              {/* Staff Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Staff Type</label>
                <select
                value={filters.staffType}
                onChange={(e) => handleFilterChange('staffType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All Staff Types</option>
                  {staffTypes.map((type) =>
                <option key={type} value={type}>
                      {type}
                    </option>
                )}
                </select>
              </div>

              {/* Letter Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Letter Status
                </label>
                <select
                value={filters.letterStatus}
                onChange={(e) => handleFilterChange('letterStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All</option>
                  <option value="issued">Letters Issued</option>
                  <option value="pending">Letters Pending</option>
                </select>
              </div>

              {/* F&F Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">F&F Status</label>
                <select
                value={filters.fnfStatus}
                onChange={(e) => handleFilterChange('fnfStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm">

                  <option value="">All F&F Status</option>
                  {fnfStatuses.map((status) =>
                <option key={status} value={status}>
                      {status}
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
                {selectedEmployees.length} record(s) selected
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
              <button
              onClick={() => handleBulkAction('print')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">

                <Printer className="w-4 h-4" />
                Print Letters
              </button>
            </div>
          </div>
        }

        {/* Results Info */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {sortedEmployees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, sortedEmployees.length)}
            </span>{' '}
            of <span className="font-medium">{sortedEmployees.length}</span> records
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
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={handleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedEmployees.length === paginatedEmployees.length &&
                    paginatedEmployees.length > 0 ?
                    <CheckCircle className="w-4 h-4 text-indigo-600" /> :

                    <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    }
                  </button>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-1">
                    Employee
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dept / Designation
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('relievingDate')}>

                  <div className="flex items-center gap-1">
                    Service Dates
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Exit Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Clearance
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  F&F Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployees.map((employee) =>
              <React.Fragment key={employee.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                      onClick={() => handleSelectEmployee(employee.id)}
                      className="p-1 hover:bg-gray-200 rounded">

                        {selectedEmployees.includes(employee.id) ?
                      <CheckCircle className="w-4 h-4 text-indigo-600" /> :

                      <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                      }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name.
                        split(' ').
                        map((n) => n[0]).
                        join('').
                        slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm text-gray-900">{employee.department}</div>
                        <div className="text-xs text-gray-500">{employee.designation}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          Join: {new Date(employee.dateOfJoining).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        </div>
                        <div className="flex items-center gap-1 font-medium text-red-600">
                          <UserMinus className="w-3 h-3" />
                          Exit: {new Date(employee.relievingDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        </div>
                        <div className="text-gray-500">
                          Duration: {calculateServiceDuration(employee.dateOfJoining, employee.relievingDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getExitTypeColor(
                        employee.exitType
                      )}`}>

                        {employee.exitType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClearanceColor(
                        employee.clearanceStatus
                      )}`}>

                        {employee.clearanceStatus === 'Completed' && <CheckCircle className="w-3 h-3" />}
                        {employee.clearanceStatus === 'Pending' && <AlertCircle className="w-3 h-3" />}
                        {employee.clearanceStatus === 'In Progress' && <Clock className="w-3 h-3" />}
                        {employee.clearanceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                        className={`flex items-center gap-1 text-xs ${
                        employee.relievingLetterIssued ? 'text-green-600' : 'text-gray-400'}`
                        }
                        title="Relieving Letter">

                          {employee.relievingLetterIssued ?
                        <FileCheck className="w-4 h-4" /> :

                        <FileClock className="w-4 h-4" />
                        }
                          <span>RL</span>
                        </div>
                        <div
                        className={`flex items-center gap-1 text-xs ${
                        employee.experienceLetterIssued ? 'text-green-600' : 'text-gray-400'}`
                        }
                        title="Experience Letter">

                          {employee.experienceLetterIssued ?
                        <FileCheck className="w-4 h-4" /> :

                        <FileClock className="w-4 h-4" />
                        }
                          <span>EL</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getFnFColor(
                          employee.fullAndFinalStatus
                        )}`}>

                          {employee.fullAndFinalStatus}
                        </span>
                        {employee.fullAndFinalAmount > 0 &&
                      <div className="text-xs text-gray-500 mt-1">
                            ₹{employee.fullAndFinalAmount.toLocaleString('en-IN')}
                          </div>
                      }
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 relative">
                        <button
                        onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() =>
                        setShowActionsMenu(showActionsMenu === employee.id ? null : employee.id)
                        }
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">

                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {showActionsMenu === employee.id &&
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button
                          onClick={() => {
                            console.log('Edit:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <Edit className="w-4 h-4" />
                              Edit Record
                            </button>
                            <button
                          onClick={() => {
                            console.log('Generate Relieving Letter:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <FileText className="w-4 h-4" />
                              Generate Relieving Letter
                            </button>
                            <button
                          onClick={() => {
                            console.log('Generate Experience Letter:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <FileText className="w-4 h-4" />
                              Generate Experience Letter
                            </button>
                            <button
                          onClick={() => {
                            console.log('Download Documents:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <Download className="w-4 h-4" />
                              Download All Documents
                            </button>
                            <button
                          onClick={() => {
                            console.log('Send Email:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                              <Mail className="w-4 h-4" />
                              Send Email
                            </button>
                            <hr className="my-1" />
                            <button
                          onClick={() => {
                            console.log('Archive:', employee.id);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-600">

                              <Archive className="w-4 h-4" />
                              Archive Record
                            </button>
                          </div>
                      }
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {expandedRow === employee.id &&
                <tr className="bg-gray-50">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {/* Contact Info */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Contact Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {employee.email}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {employee.phone}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                {employee.staffType}
                              </div>
                            </div>
                          </div>

                          {/* Exit Details */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Exit Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="text-gray-600">
                                <span className="font-medium">Reason:</span> {employee.reason}
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Notice Period:</span> {employee.noticePeriod}
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Notice Served:</span>{' '}
                                {employee.noticeServed ?
                            <span className="text-green-600">Yes</span> :

                            <span className="text-red-600">No</span>
                            }
                              </div>
                            </div>
                          </div>

                          {/* Process Status */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Process Status
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-medium">Exit Interview:</span>
                                {employee.exitInterviewDone ?
                            <CheckCircle className="w-4 h-4 text-green-500" /> :

                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            }
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Processed By:</span> {employee.processedBy}
                              </div>
                            </div>
                          </div>

                          {/* Remarks */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Remarks
                            </h4>
                            <p className="text-sm text-gray-600 italic">{employee.remarks}</p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                        onClick={() => console.log('Chat:', employee.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">

                            <MessageCircle className="w-4 h-4" />
                            Send Message
                          </button>
                          <button
                        onClick={() => console.log('Email:', employee.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">

                            <Mail className="w-4 h-4" />
                            Send Email
                          </button>
                          <button
                        onClick={() => console.log('Print:', employee.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">

                            <Printer className="w-4 h-4" />
                            Print Record
                          </button>
                        </div>
                      </td>
                    </tr>
                }
                </React.Fragment>
              )}
            </tbody>
          </table>

          {paginatedEmployees.length === 0 &&
          <div className="text-center py-12">
              <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No exit records found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700">

                Clear all filters
              </button>
            </div>
          }
        </div>

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