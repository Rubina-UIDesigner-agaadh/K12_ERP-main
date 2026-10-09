import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  Home,
  Calendar,
  Clock,
  Coffee,
  Heart,
  Briefcase,
  Baby,
  Plane,
  GraduationCap,
  CalendarDays,
  CalendarCheck,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  AlertCircle,
  Clock3,
  History,
  ChevronDown,
  Eye,
  ArrowRight,
  Zap,
  Sun,
  Umbrella,
  Activity,
  Info,
  Filter,
  Plus,
  Shield,
  CalendarPlus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Search,
  Users,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  UserCircle } from
'lucide-react';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  leaveBalance: {
    total: number;
    used: number;
    pending: number;
    balance: number;
  };
}

interface LeaveType {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  total: number;
  used: number;
  pending: number;
  balance: number;
  carryForward: number;
  lapseDate: string;
  color: string;
  bgColor: string;
  progressColor: string;
  description: string;
}

interface LeaveTransaction {
  id: string;
  leaveType: string;
  leaveTypeId: string;
  action: 'approved' | 'rejected' | 'pending' | 'cancelled' | 'credited';
  days: number;
  date: string;
  period: string;
  approvedBy: string | null;
  remarks: string | null;
}

interface YearlyLeaveStats {
  totalEntitled: number;
  totalUsed: number;
  totalPending: number;
  totalBalance: number;
  lossOfPay: number;
  attendancePercentage: number;
}

// Mock employees data
const employees: Employee[] = [
{
  id: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  joiningDate: '2018-06-15',
  status: 'active',
  leaveBalance: { total: 254, used: 24, pending: 3, balance: 227 }
},
{
  id: 'EMP002',
  name: 'Mrs. Priya Sharma',
  avatar: 'PS',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  department: 'Science',
  designation: 'Teacher',
  joiningDate: '2019-04-10',
  status: 'active',
  leaveBalance: { total: 254, used: 18, pending: 0, balance: 236 }
},
{
  id: 'EMP003',
  name: 'Mr. Amit Patel',
  avatar: 'AP',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  department: 'English',
  designation: 'Teacher',
  joiningDate: '2020-07-01',
  status: 'on-leave',
  leaveBalance: { total: 254, used: 35, pending: 5, balance: 214 }
},
{
  id: 'EMP004',
  name: 'Ms. Sunita Verma',
  avatar: 'SV',
  email: 'sunita.verma@school.edu',
  phone: '+91 98765 43213',
  department: 'Hindi',
  designation: 'Senior Teacher',
  joiningDate: '2017-01-15',
  status: 'active',
  leaveBalance: { total: 254, used: 12, pending: 2, balance: 240 }
},
{
  id: 'EMP005',
  name: 'Mr. Rahul Singh',
  avatar: 'RS',
  email: 'rahul.singh@school.edu',
  phone: '+91 98765 43214',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  joiningDate: '2021-03-20',
  status: 'active',
  leaveBalance: { total: 254, used: 8, pending: 0, balance: 246 }
},
{
  id: 'EMP006',
  name: 'Mrs. Meena Reddy',
  avatar: 'MR',
  email: 'meena.reddy@school.edu',
  phone: '+91 98765 43215',
  department: 'Computer Science',
  designation: 'Teacher',
  joiningDate: '2019-08-01',
  status: 'active',
  leaveBalance: { total: 254, used: 22, pending: 1, balance: 231 }
},
{
  id: 'EMP007',
  name: 'Dr. Arun Gupta',
  avatar: 'AG',
  email: 'arun.gupta@school.edu',
  phone: '+91 98765 43216',
  department: 'Chemistry',
  designation: 'HOD',
  joiningDate: '2015-06-10',
  status: 'active',
  leaveBalance: { total: 254, used: 15, pending: 0, balance: 239 }
},
{
  id: 'EMP008',
  name: 'Ms. Kavita Joshi',
  avatar: 'KJ',
  email: 'kavita.joshi@school.edu',
  phone: '+91 98765 43217',
  department: 'Biology',
  designation: 'Teacher',
  joiningDate: '2022-01-05',
  status: 'active',
  leaveBalance: { total: 254, used: 5, pending: 0, balance: 249 }
},
{
  id: 'EMP009',
  name: 'Mr. Vijay Nair',
  avatar: 'VN',
  email: 'vijay.nair@school.edu',
  phone: '+91 98765 43218',
  department: 'Social Studies',
  designation: 'Teacher',
  joiningDate: '2020-11-15',
  status: 'inactive',
  leaveBalance: { total: 254, used: 28, pending: 0, balance: 226 }
},
{
  id: 'EMP010',
  name: 'Mrs. Anita Desai',
  avatar: 'AD',
  email: 'anita.desai@school.edu',
  phone: '+91 98765 43219',
  department: 'Art',
  designation: 'Teacher',
  joiningDate: '2018-09-01',
  status: 'active',
  leaveBalance: { total: 254, used: 20, pending: 4, balance: 230 }
}];


const getLeaveTypesForEmployee = (employeeId: string): LeaveType[] => {
  // Generate slightly different values based on employee for variety
  const seed = parseInt(employeeId.replace('EMP', ''));

  return [
  {
    id: 'casual',
    name: 'Casual Leave',
    shortName: 'CL',
    icon: <Coffee className="w-6 h-6" />,
    total: 12,
    used: (4 + seed) % 12,
    pending: seed % 3,
    balance: 12 - (4 + seed) % 12 - seed % 3,
    carryForward: 0,
    lapseDate: '2025-03-31',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    progressColor: '#3B82F6',
    description: 'For personal matters and short breaks'
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    shortName: 'SL',
    icon: <Heart className="w-6 h-6" />,
    total: 10,
    used: (3 + seed) % 10,
    pending: 0,
    balance: 10 - (3 + seed) % 10,
    carryForward: 2,
    lapseDate: '2025-03-31',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    progressColor: '#EF4444',
    description: 'Medical leave with certificate for >2 days'
  },
  {
    id: 'privilege',
    name: 'Privilege Leave',
    shortName: 'PL',
    icon: <Briefcase className="w-6 h-6" />,
    total: 15,
    used: (6 + seed) % 15,
    pending: seed % 4,
    balance: 15 - (6 + seed) % 15 - seed % 4,
    carryForward: 5,
    lapseDate: 'No Lapse',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    progressColor: '#22C55E',
    description: 'Pre-planned leaves, apply 7 days in advance'
  },
  {
    id: 'earned',
    name: 'Earned Leave',
    shortName: 'EL',
    icon: <Sparkles className="w-6 h-6" />,
    total: 20,
    used: (8 + seed) % 20,
    pending: 0,
    balance: 20 - (8 + seed) % 20,
    carryForward: 10,
    lapseDate: 'No Lapse',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    progressColor: '#F59E0B',
    description: 'Accumulated leaves based on service'
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    shortName: 'ML',
    icon: <Baby className="w-6 h-6" />,
    total: 180,
    used: 0,
    pending: 0,
    balance: 180,
    carryForward: 0,
    lapseDate: 'As per policy',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    progressColor: '#EC4899',
    description: 'For expecting and new mothers'
  },
  {
    id: 'compensatory',
    name: 'Compensatory Off',
    shortName: 'CO',
    icon: <CalendarCheck className="w-6 h-6" />,
    total: 5,
    used: (2 + seed) % 5,
    pending: 0,
    balance: 5 - (2 + seed) % 5,
    carryForward: 0,
    lapseDate: '30 days from credit',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    progressColor: '#9333EA',
    description: 'For work done on holidays/weekends'
  },
  {
    id: 'restricted',
    name: 'Restricted Holiday',
    shortName: 'RH',
    icon: <Sun className="w-6 h-6" />,
    total: 2,
    used: seed % 2,
    pending: 0,
    balance: 2 - seed % 2,
    carryForward: 0,
    lapseDate: '2025-12-31',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    progressColor: '#F97316',
    description: 'Optional holidays'
  },
  {
    id: 'study',
    name: 'Study Leave',
    shortName: 'STL',
    icon: <GraduationCap className="w-6 h-6" />,
    total: 10,
    used: seed % 5,
    pending: 0,
    balance: 10 - seed % 5,
    carryForward: 0,
    lapseDate: '2025-12-31',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    progressColor: '#6366F1',
    description: 'For examinations and academic pursuits'
  }];

};

const getTransactionsForEmployee = (employeeId: string): LeaveTransaction[] => {
  return [
  {
    id: 'TXN001',
    leaveType: 'Casual Leave',
    leaveTypeId: 'casual',
    action: 'approved',
    days: 1,
    date: '2025-01-10',
    period: 'Jan 15, 2025',
    approvedBy: 'Dr. Amit Shah',
    remarks: 'Personal work'
  },
  {
    id: 'TXN002',
    leaveType: 'Sick Leave',
    leaveTypeId: 'sick',
    action: 'approved',
    days: 2,
    date: '2025-01-05',
    period: 'Jan 06-07, 2025',
    approvedBy: 'Dr. Amit Shah',
    remarks: 'Fever and cold'
  },
  {
    id: 'TXN003',
    leaveType: 'Privilege Leave',
    leaveTypeId: 'privilege',
    action: 'pending',
    days: 3,
    date: '2025-01-08',
    period: 'Jan 20-22, 2025',
    approvedBy: null,
    remarks: 'Family function'
  },
  {
    id: 'TXN004',
    leaveType: 'Compensatory Off',
    leaveTypeId: 'compensatory',
    action: 'credited',
    days: 1,
    date: '2025-01-02',
    period: 'Worked on Dec 25, 2024',
    approvedBy: 'System',
    remarks: 'Christmas working'
  },
  {
    id: 'TXN005',
    leaveType: 'Casual Leave',
    leaveTypeId: 'casual',
    action: 'rejected',
    days: 2,
    date: '2024-12-28',
    period: 'Dec 30-31, 2024',
    approvedBy: 'Dr. Amit Shah',
    remarks: 'Year-end workload'
  },
  {
    id: 'TXN006',
    leaveType: 'Privilege Leave',
    leaveTypeId: 'privilege',
    action: 'approved',
    days: 5,
    date: '2024-12-15',
    period: 'Dec 20-24, 2024',
    approvedBy: 'Dr. Amit Shah',
    remarks: 'Vacation'
  }];

};

const getActionConfig = (action: LeaveTransaction['action']) => {
  switch (action) {
    case 'approved':
      return {
        label: 'Approved',
        icon: <Check className="w-3 h-3" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        sign: '-'
      };
    case 'rejected':
      return {
        label: 'Rejected',
        icon: <X className="w-3 h-3" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        sign: ''
      };
    case 'pending':
      return {
        label: 'Pending',
        icon: <Clock3 className="w-3 h-3" />,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        sign: '-'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: <X className="w-3 h-3" />,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        sign: ''
      };
    case 'credited':
      return {
        label: 'Credited',
        icon: <Plus className="w-3 h-3" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        sign: '+'
      };
    default:
      return {
        label: 'Unknown',
        icon: <AlertCircle className="w-3 h-3" />,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        sign: ''
      };
  }
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

interface CircularProgressProps {
  used: number;
  total: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  used,
  total,
  color,
  size = 120,
  strokeWidth = 10
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = total > 0 ? used / total * 100 : 0;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  const remaining = total - used;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth} />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out" />

      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
        <span className="text-xs text-gray-500">Available</span>
      </div>
    </div>);

};

const getStatusConfig = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return { label: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-700' };
    case 'on-leave':
      return { label: 'On Leave', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
    case 'inactive':
      return { label: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    default:
      return { label: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
  }
};

export function ViewLeaveBalance() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))];
    return depts.sort();
  }, []);

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
      departmentFilter === 'all' || employee.department === departmentFilter;

      const matchesStatus =
      statusFilter === 'all' || employee.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchQuery, departmentFilter, statusFilter]);

  // Get leave types and transactions for selected employee
  const leaveTypes = selectedEmployee ?
  getLeaveTypesForEmployee(selectedEmployee.id) :
  [];

  const recentTransactions = selectedEmployee ?
  getTransactionsForEmployee(selectedEmployee.id) :
  [];

  const yearlyStats: YearlyLeaveStats = selectedEmployee ?
  {
    totalEntitled: leaveTypes.reduce((sum, lt) => sum + lt.total, 0),
    totalUsed: leaveTypes.reduce((sum, lt) => sum + lt.used, 0),
    totalPending: leaveTypes.reduce((sum, lt) => sum + lt.pending, 0),
    totalBalance: leaveTypes.reduce((sum, lt) => sum + lt.balance, 0),
    lossOfPay: 0,
    attendancePercentage: 96.5
  } :
  {
    totalEntitled: 0,
    totalUsed: 0,
    totalPending: 0,
    totalBalance: 0,
    lossOfPay: 0,
    attendancePercentage: 0
  };

  const displayedTransactions = showAllTransactions ?
  recentTransactions :
  recentTransactions.slice(0, 3);

  // Employee List View
  if (!selectedEmployee) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Leave</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">View Balance</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Leave Balance</h1>
            <p className="text-sm text-gray-500">
              Search and view leave balances for all employees
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" />

            </div>

            {/* Department Filter */}
            <div className="w-full lg:w-56">
              <Select
                options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map((dept) => ({ value: dept, label: dept }))]
                }
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)} />

            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <Select
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'on-leave', label: 'On Leave' },
                { value: 'inactive', label: 'Inactive' }]
                }
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)} />

            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Showing <strong className="text-gray-900">{filteredEmployees.length}</strong> of{' '}
                <strong className="text-gray-900">{employees.length}</strong> employees
              </span>
            </div>
            {searchQuery &&
            <button
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('all');
                setStatusFilter('all');
              }}
              className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">

                <X className="w-4 h-4" />
                Clear filters
              </button>
            }
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              Employee Directory
            </h2>
          </div>

          {filteredEmployees.length > 0 ?
          <div className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => {
              const statusConfig = getStatusConfig(employee.status);
              const usagePercentage = Math.round(
                employee.leaveBalance.used / employee.leaveBalance.total * 100
              );

              return (
                <div
                  key={employee.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors">

                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {employee.avatar}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {employee.name}
                          </h3>
                          <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {employee.department}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {employee.email}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {employee.designation} • {employee.id}
                        </p>
                      </div>

                      {/* Leave Balance Summary */}
                      <div className="hidden md:flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {employee.leaveBalance.balance}
                          </p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {employee.leaveBalance.used}
                          </p>
                          <p className="text-xs text-gray-500">Used</p>
                        </div>
                        {employee.leaveBalance.pending > 0 &&
                      <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                              {employee.leaveBalance.pending}
                            </p>
                            <p className="text-xs text-gray-500">Pending</p>
                          </div>
                      }
                        <div className="w-24">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${usagePercentage}%` }} />

                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {usagePercentage}% used
                          </p>
                        </div>
                      </div>

                      {/* View Button */}
                      <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedEmployee(employee)}
                      className="flex-shrink-0">

                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>);

            })}
            </div> :

          <div className="px-6 py-16 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('all');
                setStatusFilter('all');
              }}>

                Clear all filters
              </Button>
            </div>
          }
        </div>
      </div>);

  }

  // Employee Leave Balance Detail View
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Leave</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <button
          onClick={() => setSelectedEmployee(null)}
          className="text-teal-600 hover:text-teal-700">

          View Balance
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">{selectedEmployee.name}</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedEmployee(null)}
            className="flex-shrink-0">

            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Balance Dashboard</h1>
            <p className="text-sm text-gray-500">
              Leave entitlements, usage, and transaction history for {selectedEmployee.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={[
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' }]
            }
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)} />

          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="primary">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Apply Leave
          </Button>
        </div>
      </div>

      {/* User Info & Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Card */}
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
              {selectedEmployee.avatar}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{selectedEmployee.name}</h2>
              <p className="text-teal-100 text-sm">{selectedEmployee.designation}</p>
              <p className="text-teal-100 text-sm">{selectedEmployee.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-teal-100 text-xs">Employee ID</p>
              <p className="font-semibold">{selectedEmployee.id}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-teal-100 text-xs">Since</p>
              <p className="font-semibold">
                {new Date(selectedEmployee.joiningDate).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entitled</p>
              <p className="text-2xl font-bold text-gray-900">{yearlyStats.totalEntitled}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>For year {selectedYear}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">{yearlyStats.totalBalance}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {Math.round(yearlyStats.totalBalance / yearlyStats.totalEntitled * 100)}%
              remaining
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {yearlyStats.attendancePercentage}%
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${yearlyStats.attendancePercentage}%` }} />

          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">
                Used: <strong className="text-gray-900">{yearlyStats.totalUsed}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">
                Pending: <strong className="text-gray-900">{yearlyStats.totalPending}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">
                Balance: <strong className="text-gray-900">{yearlyStats.totalBalance}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">
                LOP: <strong className="text-gray-900">{yearlyStats.lossOfPay}</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>
              Leave year: Apr {selectedYear} - Mar {parseInt(selectedYear) + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Leave Balance Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          Leave Balances by Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveTypes.map((leave) => {
            const usedPercentage = leave.used / leave.total * 100;

            return (
              <div
                key={leave.id}
                onClick={() => setSelectedLeaveType(leave)}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${leave.bgColor} ${leave.color} flex items-center justify-center`}>

                      {leave.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{leave.name}</h3>
                      <p className="text-xs text-gray-500">{leave.shortName}</p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center my-6">
                  <CircularProgress
                    used={leave.used}
                    total={leave.total}
                    color={leave.progressColor}
                    size={130}
                    strokeWidth={12} />

                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold text-gray-900">{leave.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Used</span>
                    <span className="font-semibold text-gray-900">{leave.used}</span>
                  </div>
                  {leave.pending > 0 &&
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pending</span>
                      <span className="font-semibold text-yellow-600">{leave.pending}</span>
                    </div>
                  }
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-700 font-medium">Balance</span>
                    <span className={`font-bold ${leave.color}`}>{leave.balance}</span>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usedPercentage}%`,
                        backgroundColor: leave.progressColor
                      }} />

                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {usedPercentage.toFixed(0)}% utilized
                  </p>
                </div>

                {/* Carry Forward Info */}
                {leave.carryForward > 0 &&
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600">
                    <Sparkles className="w-3 h-3" />
                    <span>{leave.carryForward} carry forward</span>
                  </div>
                }
              </div>);

          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllTransactions(!showAllTransactions)}>

            {showAllTransactions ? 'Show Less' : 'View All'}
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
              showAllTransactions ? 'rotate-180' : ''}`
              } />

          </Button>
        </div>

        <div className="divide-y divide-gray-100">
          {displayedTransactions.map((transaction) => {
            const actionConfig = getActionConfig(transaction.action);
            const leaveType = leaveTypes.find((lt) => lt.id === transaction.leaveTypeId);

            return (
              <div
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors">

                <div className="flex items-center gap-4">
                  {/* Leave Type Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${leaveType?.bgColor || 'bg-gray-100'} ${
                    leaveType?.color || 'text-gray-600'} flex items-center justify-center flex-shrink-0`
                    }>

                    {leaveType?.icon || <Calendar className="w-5 h-5" />}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {transaction.leaveType}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${actionConfig.bgColor} ${actionConfig.textColor}`}>

                        {actionConfig.icon}
                        {actionConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.period}</p>
                    {transaction.remarks &&
                    <p className="text-xs text-gray-400 mt-1">"{transaction.remarks}"</p>
                    }
                  </div>

                  {/* Days */}
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                      transaction.action === 'credited' ?
                      'text-green-600' :
                      transaction.action === 'rejected' ||
                      transaction.action === 'cancelled' ?
                      'text-gray-400' :
                      'text-red-600'}`
                      }>

                      {actionConfig.sign}
                      {transaction.days} {transaction.days === 1 ? 'Day' : 'Days'}
                    </span>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>

                {/* Approver Info */}
                {transaction.approvedBy && transaction.action !== 'pending' &&
                <div className="mt-2 ml-16 flex items-center gap-1 text-xs text-gray-400">
                    <Check className="w-3 h-3" />
                    <span>by {transaction.approvedBy}</span>
                  </div>
                }
              </div>);

          })}
        </div>

        {/* Empty State */}
        {displayedTransactions.length === 0 &&
        <div className="px-6 py-12 text-center">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent leave transactions</p>
          </div>
        }
      </div>

      {/* Leave Calendar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Leaves */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-gray-500" />
            Upcoming Leaves
          </h3>
          <div className="space-y-3">
            {recentTransactions.
            filter((t) => t.action === 'approved' || t.action === 'pending').
            slice(0, 3).
            map((leave) => {
              const leaveType = leaveTypes.find((lt) => lt.id === leave.leaveTypeId);
              return (
                <div
                  key={leave.id}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                  leaveType?.bgColor || 'bg-gray-50'}`
                  }>

                    <div
                    className={`w-10 h-10 rounded-lg bg-white ${
                    leaveType?.color || 'text-gray-600'} flex items-center justify-center shadow-sm`
                    }>

                      {leaveType?.icon || <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{leave.period}</p>
                      <p className="text-sm text-gray-500">{leave.leaveType}</p>
                    </div>
                    <div className="text-right">
                      <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      leave.action === 'approved' ?
                      'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'}`
                      }>

                        {leave.action === 'approved' ?
                      <Check className="w-3 h-3" /> :

                      <Clock3 className="w-3 h-3" />
                      }
                        {leave.days} day(s)
                      </span>
                    </div>
                  </div>);

            })}
          </div>
        </div>

        {/* Leave Policy Highlights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            Policy Highlights
          </h3>
          <div className="space-y-3">
            {[
            {
              icon: <Coffee className="w-4 h-4" />,
              text: 'Casual Leave: Max 3 consecutive days',
              color: 'text-blue-600'
            },
            {
              icon: <Heart className="w-4 h-4" />,
              text: 'Sick Leave: Certificate required for >2 days',
              color: 'text-red-600'
            },
            {
              icon: <Briefcase className="w-4 h-4" />,
              text: 'Privilege Leave: Apply 7 days in advance',
              color: 'text-green-600'
            },
            {
              icon: <CalendarCheck className="w-4 h-4" />,
              text: 'Comp Off: Avail within 30 days',
              color: 'text-purple-600'
            },
            {
              icon: <AlertCircle className="w-4 h-4" />,
              text: 'LOP after exhausting all leave types',
              color: 'text-amber-600'
            }].
            map((policy, index) =>
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={policy.color}>{policy.icon}</span>
                <span className="text-sm text-gray-700">{policy.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Leave View Modal */}
      {selectedLeaveType &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setSelectedLeaveType(null)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className={`${selectedLeaveType.bgColor} px-6 py-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                  className={`w-14 h-14 rounded-xl bg-white ${selectedLeaveType.color} flex items-center justify-center shadow-lg`}>

                    {selectedLeaveType.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedLeaveType.name}
                    </h2>
                    <p className="text-sm text-gray-600">{selectedLeaveType.description}</p>
                  </div>
                </div>
                <button
                onClick={() => setSelectedLeaveType(null)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors">

                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Circular Progress */}
              <div className="flex justify-center mb-6">
                <CircularProgress
                used={selectedLeaveType.used}
                total={selectedLeaveType.total}
                color={selectedLeaveType.progressColor}
                size={160}
                strokeWidth={14} />

              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-gray-900">{selectedLeaveType.total}</p>
                  <p className="text-sm text-gray-500">Total Entitled</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {selectedLeaveType.balance}
                  </p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-red-600">{selectedLeaveType.used}</p>
                  <p className="text-sm text-gray-500">Used</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-yellow-600">
                    {selectedLeaveType.pending}
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Carry Forward</span>
                  <span className="font-semibold text-gray-900">
                    {selectedLeaveType.carryForward} days
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Lapse Date</span>
                  <span className="font-semibold text-gray-900">
                    {selectedLeaveType.lapseDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedLeaveType(null)}>
                Close
              </Button>
              <Button variant="primary">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Apply {selectedLeaveType.shortName}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}