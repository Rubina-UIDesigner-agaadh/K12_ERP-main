import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  User,
  Building,
  Briefcase,
  Calendar,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Info,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  SlidersHorizontal } from
'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'probation';
  employeeType: string;
  location: string;
  reportingManager: string;
  experience: number;
}

const departments = [
{ value: 'all', label: 'All Departments' },
{ value: 'mathematics', label: 'Mathematics' },
{ value: 'science', label: 'Science' },
{ value: 'english', label: 'English' },
{ value: 'social_studies', label: 'Social Studies' },
{ value: 'computer_science', label: 'Computer Science' },
{ value: 'physical_education', label: 'Physical Education' },
{ value: 'administration', label: 'Administration' },
{ value: 'finance', label: 'Finance' },
{ value: 'human_resources', label: 'Human Resources' },
{ value: 'transport', label: 'Transport' },
{ value: 'maintenance', label: 'Maintenance' }];


const statusOptions = [
{ value: 'all', label: 'All Status' },
{ value: 'active', label: 'Active' },
{ value: 'inactive', label: 'Inactive' },
{ value: 'on_leave', label: 'On Leave' },
{ value: 'probation', label: 'Probation' }];


const mockEmployees: Employee[] = [
{
  id: '1',
  employeeId: 'EMP001',
  fullName: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  joiningDate: '2018-06-15',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Dr. Amit Shah',
  experience: 15
},
{
  id: '2',
  employeeId: 'EMP002',
  fullName: 'Mrs. Priya Sharma',
  avatar: 'PS',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  department: 'Science',
  designation: 'Teacher',
  joiningDate: '2020-01-10',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Mr. Vikram Singh',
  experience: 8
},
{
  id: '3',
  employeeId: 'EMP003',
  fullName: 'Mr. Amit Patel',
  avatar: 'AP',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  department: 'Science',
  designation: 'HOD',
  joiningDate: '2015-03-20',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Principal',
  experience: 12
},
{
  id: '4',
  employeeId: 'EMP004',
  fullName: 'Ms. Sneha Reddy',
  avatar: 'SR',
  email: 'sneha.reddy@school.edu',
  phone: '+91 98765 43213',
  department: 'English',
  designation: 'Teacher',
  joiningDate: '2022-07-01',
  status: 'probation',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Mrs. Lakshmi Menon',
  experience: 3
},
{
  id: '5',
  employeeId: 'EMP005',
  fullName: 'Dr. Vikram Singh',
  avatar: 'VS',
  email: 'vikram.singh@school.edu',
  phone: '+91 98765 43214',
  department: 'Science',
  designation: 'Senior Teacher',
  joiningDate: '2016-08-15',
  status: 'on_leave',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Mr. Amit Patel',
  experience: 18
},
{
  id: '6',
  employeeId: 'EMP006',
  fullName: 'Mrs. Kavita Iyer',
  avatar: 'KI',
  email: 'kavita.iyer@school.edu',
  phone: '+91 98765 43215',
  department: 'Social Studies',
  designation: 'Teacher',
  joiningDate: '2019-04-10',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Dr. Amit Shah',
  experience: 6
},
{
  id: '7',
  employeeId: 'EMP007',
  fullName: 'Mr. Sanjay Gupta',
  avatar: 'SG',
  email: 'sanjay.gupta@school.edu',
  phone: '+91 98765 43216',
  department: 'Computer Science',
  designation: 'Teacher',
  joiningDate: '2017-11-20',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Tech Building',
  reportingManager: 'Dr. Rajesh Kumar',
  experience: 10
},
{
  id: '8',
  employeeId: 'EMP008',
  fullName: 'Ms. Meera Nair',
  avatar: 'MN',
  email: 'meera.nair@school.edu',
  phone: '+91 98765 43217',
  department: 'Mathematics',
  designation: 'Assistant Teacher',
  joiningDate: '2023-02-01',
  status: 'probation',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Dr. Rajesh Kumar',
  experience: 2
},
{
  id: '9',
  employeeId: 'EMP009',
  fullName: 'Dr. Arun Verma',
  avatar: 'AV',
  email: 'arun.verma@school.edu',
  phone: '+91 98765 43218',
  department: 'Science',
  designation: 'Senior Teacher',
  joiningDate: '2014-06-01',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Mr. Amit Patel',
  experience: 14
},
{
  id: '10',
  employeeId: 'EMP010',
  fullName: 'Mrs. Lakshmi Menon',
  avatar: 'LM',
  email: 'lakshmi.menon@school.edu',
  phone: '+91 98765 43219',
  department: 'English',
  designation: 'HOD',
  joiningDate: '2012-03-15',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Principal',
  experience: 20
},
{
  id: '11',
  employeeId: 'EMP011',
  fullName: 'Mr. Suresh Pillai',
  avatar: 'SP',
  email: 'suresh.pillai@school.edu',
  phone: '+91 98765 43220',
  department: 'Administration',
  designation: 'Admin Officer',
  joiningDate: '2018-09-01',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Admin Block',
  reportingManager: 'Director',
  experience: 8
},
{
  id: '12',
  employeeId: 'EMP012',
  fullName: 'Mrs. Geeta Krishnan',
  avatar: 'GK',
  email: 'geeta.krishnan@school.edu',
  phone: '+91 98765 43221',
  department: 'Finance',
  designation: 'Accountant',
  joiningDate: '2016-01-10',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Admin Block',
  reportingManager: 'Mr. Suresh Pillai',
  experience: 12
},
{
  id: '13',
  employeeId: 'EMP013',
  fullName: 'Mr. David Thomas',
  avatar: 'DT',
  email: 'david.thomas@school.edu',
  phone: '+91 98765 43222',
  department: 'Transport',
  designation: 'Transport Coordinator',
  joiningDate: '2019-07-15',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Transport Office',
  reportingManager: 'Mr. Suresh Pillai',
  experience: 7
},
{
  id: '14',
  employeeId: 'EMP014',
  fullName: 'Mrs. Anita Desai',
  avatar: 'AD',
  email: 'anita.desai@school.edu',
  phone: '+91 98765 43223',
  department: 'Human Resources',
  designation: 'HR Manager',
  joiningDate: '2017-04-01',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Admin Block',
  reportingManager: 'Director',
  experience: 10
},
{
  id: '15',
  employeeId: 'EMP015',
  fullName: 'Mr. Rohit Joshi',
  avatar: 'RJ',
  email: 'rohit.joshi@school.edu',
  phone: '+91 98765 43224',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  joiningDate: '2020-08-01',
  status: 'inactive',
  employeeType: 'Teaching',
  location: 'Sports Complex',
  reportingManager: 'Principal',
  experience: 5
},
{
  id: '16',
  employeeId: 'EMP016',
  fullName: 'Ms. Fatima Khan',
  avatar: 'FK',
  email: 'fatima.khan@school.edu',
  phone: '+91 98765 43225',
  department: 'Science',
  designation: 'Lab Assistant',
  joiningDate: '2021-05-15',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Science Lab',
  reportingManager: 'Mr. Amit Patel',
  experience: 4
},
{
  id: '17',
  employeeId: 'EMP017',
  fullName: 'Mr. Ramesh Yadav',
  avatar: 'RY',
  email: 'ramesh.yadav@school.edu',
  phone: '+91 98765 43226',
  department: 'Maintenance',
  designation: 'Maintenance Head',
  joiningDate: '2015-10-01',
  status: 'active',
  employeeType: 'Non-Teaching',
  location: 'Main Campus',
  reportingManager: 'Mr. Suresh Pillai',
  experience: 15
},
{
  id: '18',
  employeeId: 'EMP018',
  fullName: 'Mrs. Sunita Rao',
  avatar: 'SR',
  email: 'sunita.rao@school.edu',
  phone: '+91 98765 43227',
  department: 'Social Studies',
  designation: 'Teacher',
  joiningDate: '2022-01-15',
  status: 'active',
  employeeType: 'Teaching',
  location: 'Main Campus',
  reportingManager: 'Mrs. Kavita Iyer',
  experience: 3
}];


type SortColumn = 'employeeId' | 'fullName' | 'department' | 'designation' | 'joiningDate' | 'status';
type SortDirection = 'asc' | 'desc';

const getStatusConfig = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        dotColor: 'bg-green-500',
        icon: <CheckCircle className="w-3 h-3" />
      };
    case 'inactive':
      return {
        label: 'Inactive',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        icon: <XCircle className="w-3 h-3" />
      };
    case 'on_leave':
      return {
        label: 'On Leave',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        dotColor: 'bg-amber-500',
        icon: <Clock className="w-3 h-3" />
      };
    case 'probation':
      return {
        label: 'Probation',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        dotColor: 'bg-blue-500',
        icon: <Activity className="w-3 h-3" />
      };
    default:
      return {
        label: 'Unknown',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        dotColor: 'bg-gray-500',
        icon: <Info className="w-3 h-3" />
      };
  }
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function EmployeeRegisterView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('employeeId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
        !emp.fullName.toLowerCase().includes(query) &&
        !emp.employeeId.toLowerCase().includes(query) &&
        !emp.email.toLowerCase().includes(query) &&
        !emp.designation.toLowerCase().includes(query))
        {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== 'all') {
        if (emp.department.toLowerCase().replace(' ', '_') !== departmentFilter) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, departmentFilter, statusFilter]);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'employeeId':
          comparison = a.employeeId.localeCompare(b.employeeId);
          break;
        case 'fullName':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'designation':
          comparison = a.designation.localeCompare(b.designation);
          break;
        case 'joiningDate':
          comparison = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEmployees, sortColumn, sortDirection]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(startIndex, startIndex + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedEmployees.length / pageSize);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    // Simulate export
    alert(`Exporting ${sortedEmployees.length} employee records to Excel...`);
  };

  const stats = useMemo(() => {
    const total = mockEmployees.length;
    const active = mockEmployees.filter((e) => e.status === 'active').length;
    const inactive = mockEmployees.filter((e) => e.status === 'inactive').length;
    const onLeave = mockEmployees.filter((e) => e.status === 'on_leave').length;
    const probation = mockEmployees.filter((e) => e.status === 'probation').length;

    return { total, active, inactive, onLeave, probation };
  }, []);

  const SortIcon = ({ column }: {column: SortColumn;}) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ArrowUp className="w-4 h-4 text-blue-600" /> :

    <ArrowDown className="w-4 h-4 text-blue-600" />;

  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Employee</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Register View</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Employee Register View
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive read-only view of all employees in the organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary" onClick={handleExportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Employees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.onLeave}</p>
              <p className="text-xs text-gray-500">On Leave</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.probation}</p>
              <p className="text-xs text-gray-500">Probation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Search & Filters</h3>
            {(searchQuery || departmentFilter !== 'all' || statusFilter !== 'all') &&
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Filters Active
              </span>
            }
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>

                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>

                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showFilters &&
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
              type="text"
              placeholder="Search by name, employee ID, email, or designation..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />

              {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-5 h-5" />
                </button>
            }
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
              label="Department"
              options={departments}
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }} />

              <Select
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }} />

              <div className="md:col-span-2 flex items-end justify-end">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{sortedEmployees.length}</span> of{' '}
          <span className="font-semibold">{mockEmployees.length}</span> employees
        </p>
        {(searchQuery || departmentFilter !== 'all' || statusFilter !== 'all') &&
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium">

            Clear filters to see all employees
          </button>
        }
      </div>

      {/* Data Table View */}
      {viewMode === 'table' &&
      <Card title="Employee Register">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeId')}>

                    <div className="flex items-center gap-2">
                      Employee ID
                      <SortIcon column="employeeId" />
                    </div>
                  </th>
                  <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('fullName')}>

                    <div className="flex items-center gap-2">
                      Full Name
                      <SortIcon column="fullName" />
                    </div>
                  </th>
                  <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}>

                    <div className="flex items-center gap-2">
                      Department
                      <SortIcon column="department" />
                    </div>
                  </th>
                  <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('designation')}>

                    <div className="flex items-center gap-2">
                      Designation
                      <SortIcon column="designation" />
                    </div>
                  </th>
                  <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('joiningDate')}>

                    <div className="flex items-center gap-2">
                      Joining Date
                      <SortIcon column="joiningDate" />
                    </div>
                  </th>
                  <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}>

                    <div className="flex items-center justify-center gap-2">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length > 0 ?
              paginatedEmployees.map((employee, index) => {
                const statusConfig = getStatusConfig(employee.status);

                return (
                  <tr
                    key={employee.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`
                    }>

                        {/* Employee ID */}
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono font-medium text-gray-900">
                            {employee.employeeId}
                          </span>
                        </td>

                        {/* Full Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                              {employee.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{employee.fullName}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{employee.department}</span>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{employee.designation}</span>
                          </div>
                        </td>

                        {/* Joining Date */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{formatDate(employee.joiningDate)}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details">

                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>);

              }) :

              <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <Users className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium text-gray-500">No employees found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
              }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedEmployees.length > 0 &&
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, sortedEmployees.length)} of{' '}
                  {sortedEmployees.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm">

                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
        }
        </Card>
      }

      {/* Grid View */}
      {viewMode === 'grid' &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedEmployees.length > 0 ?
        paginatedEmployees.map((employee) => {
          const statusConfig = getStatusConfig(employee.status);

          return (
            <div
              key={employee.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => setSelectedEmployee(employee)}>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                        {employee.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{employee.fullName}</p>
                        <p className="text-xs text-gray-500">{employee.employeeId}</p>
                      </div>
                    </div>
                    <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span>{employee.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{employee.designation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined {formatDate(employee.joiningDate)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{employee.employeeType}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>);

        }) :

        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="w-12 h-12 mb-3" />
              <p className="text-lg font-medium text-gray-500">No employees found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
        }
        </div>
      }

      {/* Grid View Pagination */}
      {viewMode === 'grid' && sortedEmployees.length > 0 &&
      <div className="flex items-center justify-center gap-2">
          <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">

            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">

            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Employee Detail Modal */}
      {selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setSelectedEmployee(null)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedEmployee.fullName}</h2>
                    <p className="text-blue-100">{selectedEmployee.employeeId}</p>
                  </div>
                </div>
                <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur`}>

                  <span className={`w-2 h-2 rounded-full ${getStatusConfig(selectedEmployee.status).dotColor}`}></span>
                  {getStatusConfig(selectedEmployee.status).label}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Building className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Department</span>
                  </div>
                  <p className="font-semibold text-gray-900">{selectedEmployee.department}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Designation</span>
                  </div>
                  <p className="font-semibold text-gray-900">{selectedEmployee.designation}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Joining Date</span>
                  </div>
                  <p className="font-semibold text-gray-900">{formatDate(selectedEmployee.joiningDate)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Experience</span>
                  </div>
                  <p className="font-semibold text-gray-900">{selectedEmployee.experience} years</p>
                </div>
              </div>

              {/* Contact Info */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Contact Information</h3>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedEmployee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{selectedEmployee.location}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Employee Type</p>
                  <p className="font-medium text-gray-900">{selectedEmployee.employeeType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Reporting Manager</p>
                  <p className="font-medium text-gray-900">{selectedEmployee.reportingManager}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}