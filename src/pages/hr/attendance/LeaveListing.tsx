import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Printer,
  Upload,
  ArrowRight,
  User,
  Users,
  Info,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Square,
  Copy,
  Mail,
  MessageSquare,
  Paperclip,
  CalendarOff,
  CalendarCheck,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  Ban,
  Pause,
  Play,
  History,
  Send } from
'lucide-react';
export function LeaveListing() {
  const [sortColumn, setSortColumn] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const leaveApplications = [
  {
    id: 'LV001',
    applicationDate: '2024-02-01',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    leaveType: 'Casual Leave',
    leaveTypeCode: 'CL',
    fromDate: '2024-02-05',
    toDate: '2024-02-07',
    duration: 3,
    reason: 'Personal work - Family function',
    status: 'pending',
    currentBalance: 8,
    afterBalance: 5,
    approver: 'Michael Johnson',
    approverStatus: 'pending',
    appliedOn: '2024-02-01 10:30 AM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543210',
    handoverTo: 'Jane Smith',
    comments: null,
    priority: 'normal'
  },
  {
    id: 'LV002',
    applicationDate: '2024-01-31',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    leaveType: 'Sick Leave',
    leaveTypeCode: 'SL',
    fromDate: '2024-02-01',
    toDate: '2024-02-02',
    duration: 2,
    reason: 'Medical checkup and rest',
    status: 'approved',
    currentBalance: 5,
    afterBalance: 3,
    approver: 'Admin User',
    approverStatus: 'approved',
    appliedOn: '2024-01-31 09:15 AM',
    attachments: 1,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543211',
    handoverTo: 'Robert Johnson',
    comments: 'Medical certificate attached',
    approvedOn: '2024-01-31 02:30 PM',
    priority: 'high'
  },
  {
    id: 'LV003',
    applicationDate: '2024-01-30',
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    department: 'Finance',
    designation: 'Accountant',
    leaveType: 'Privilege Leave',
    leaveTypeCode: 'PL',
    fromDate: '2024-02-15',
    toDate: '2024-02-20',
    duration: 6,
    reason: 'Vacation - Trip to Kerala',
    status: 'approved',
    currentBalance: 15,
    afterBalance: 9,
    approver: 'Sarah Wilson',
    approverStatus: 'approved',
    appliedOn: '2024-01-30 11:45 AM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543212',
    handoverTo: 'Emily Davis',
    comments: 'Annual vacation plan',
    approvedOn: '2024-01-30 04:00 PM',
    priority: 'normal'
  },
  {
    id: 'LV004',
    applicationDate: '2024-01-29',
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    leaveType: 'Casual Leave',
    leaveTypeCode: 'CL',
    fromDate: '2024-01-30',
    toDate: '2024-01-30',
    duration: 1,
    reason: 'Personal emergency',
    status: 'rejected',
    currentBalance: 6,
    afterBalance: 5,
    approver: 'Michael Johnson',
    approverStatus: 'rejected',
    appliedOn: '2024-01-29 03:20 PM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543213',
    handoverTo: 'John Doe',
    comments: null,
    rejectedOn: '2024-01-29 05:00 PM',
    rejectionReason: 'Critical marketing campaign scheduled',
    priority: 'normal'
  },
  {
    id: 'LV005',
    applicationDate: '2024-01-28',
    employeeId: 'EMP005',
    employeeName: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    leaveType: 'Comp Off',
    leaveTypeCode: 'CO',
    fromDate: '2024-02-08',
    toDate: '2024-02-08',
    duration: 1,
    reason: 'Utilizing comp-off for weekend work',
    status: 'approved',
    currentBalance: 3,
    afterBalance: 2,
    approver: 'James Taylor',
    approverStatus: 'approved',
    appliedOn: '2024-01-28 02:00 PM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543214',
    handoverTo: 'David Lee',
    comments: 'Worked on 21st Jan (Sunday)',
    approvedOn: '2024-01-28 04:30 PM',
    priority: 'normal'
  },
  {
    id: 'LV006',
    applicationDate: '2024-01-27',
    employeeId: 'EMP006',
    employeeName: 'Sarah Wilson',
    department: 'Operations',
    designation: 'Operations Manager',
    leaveType: 'Maternity Leave',
    leaveTypeCode: 'ML',
    fromDate: '2024-03-01',
    toDate: '2024-08-31',
    duration: 180,
    reason: 'Maternity leave as per policy',
    status: 'approved',
    currentBalance: 180,
    afterBalance: 0,
    approver: 'CEO',
    approverStatus: 'approved',
    appliedOn: '2024-01-27 10:00 AM',
    attachments: 2,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543215',
    handoverTo: 'Multiple Team Members',
    comments: 'Medical documents attached',
    approvedOn: '2024-01-27 03:00 PM',
    priority: 'high'
  },
  {
    id: 'LV007',
    applicationDate: '2024-01-26',
    employeeId: 'EMP007',
    employeeName: 'David Lee',
    department: 'IT Support',
    designation: 'IT Administrator',
    leaveType: 'Casual Leave',
    leaveTypeCode: 'CL',
    fromDate: '2024-01-29',
    toDate: '2024-01-29',
    duration: 0.5,
    reason: 'Doctor appointment',
    status: 'cancelled',
    currentBalance: 9,
    afterBalance: 8.5,
    approver: 'IT Head',
    approverStatus: 'cancelled',
    appliedOn: '2024-01-26 04:45 PM',
    attachments: 0,
    isHalfDay: true,
    halfDaySession: 'First Half',
    contactDuringLeave: '+91 9876543216',
    handoverTo: 'Michael Brown',
    comments: null,
    cancelledOn: '2024-01-27 09:00 AM',
    cancellationReason: 'Appointment rescheduled',
    priority: 'low'
  },
  {
    id: 'LV008',
    applicationDate: '2024-01-25',
    employeeId: 'EMP008',
    employeeName: 'Lisa Anderson',
    department: 'Sales',
    designation: 'Sales Executive',
    leaveType: 'Earned Leave',
    leaveTypeCode: 'EL',
    fromDate: '2024-02-12',
    toDate: '2024-02-16',
    duration: 5,
    reason: 'Family vacation to Goa',
    status: 'pending',
    currentBalance: 12,
    afterBalance: 7,
    approver: 'Sales Head',
    approverStatus: 'pending',
    appliedOn: '2024-01-25 11:30 AM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543217',
    handoverTo: 'James Taylor',
    comments: 'Have completed all pending targets',
    priority: 'normal'
  },
  {
    id: 'LV009',
    applicationDate: '2024-01-24',
    employeeId: 'EMP009',
    employeeName: 'James Taylor',
    department: 'Engineering',
    designation: 'Tech Lead',
    leaveType: 'Paternity Leave',
    leaveTypeCode: 'PTL',
    fromDate: '2024-01-25',
    toDate: '2024-02-07',
    duration: 14,
    reason: 'Paternity leave for newborn care',
    status: 'approved',
    currentBalance: 15,
    afterBalance: 1,
    approver: 'CTO',
    approverStatus: 'approved',
    appliedOn: '2024-01-24 09:00 AM',
    attachments: 1,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543218',
    handoverTo: 'John Doe',
    comments: 'Birth certificate attached',
    approvedOn: '2024-01-24 11:00 AM',
    priority: 'high'
  },
  {
    id: 'LV010',
    applicationDate: '2024-01-23',
    employeeId: 'EMP010',
    employeeName: 'Jennifer Martinez',
    department: 'HR',
    designation: 'HR Executive',
    leaveType: 'Loss of Pay',
    leaveTypeCode: 'LOP',
    fromDate: '2024-01-24',
    toDate: '2024-01-26',
    duration: 3,
    reason: 'Extended personal leave',
    status: 'approved',
    currentBalance: 0,
    afterBalance: -3,
    approver: 'HR Head',
    approverStatus: 'approved',
    appliedOn: '2024-01-23 05:00 PM',
    attachments: 0,
    isHalfDay: false,
    contactDuringLeave: '+91 9876543219',
    handoverTo: 'Jane Smith',
    comments: 'Exhausted all leave balance',
    approvedOn: '2024-01-23 06:00 PM',
    priority: 'normal'
  }];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const SortIcon = ({ column }) => {
    if (sortColumn !== column)
    return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :

    <ChevronDown className="w-3 h-3 text-blue-600" />;

  };
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>);

      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>);

      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <Ban className="w-3 h-3" />
            Cancelled
          </span>);

      default:
        return null;
    }
  };
  const getLeaveTypeBadge = (type, code) => {
    const colors = {
      CL: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      SL: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200'
      },
      PL: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      },
      EL: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200'
      },
      CO: {
        bg: 'bg-teal-100',
        text: 'text-teal-700',
        border: 'border-teal-200'
      },
      ML: {
        bg: 'bg-pink-100',
        text: 'text-pink-700',
        border: 'border-pink-200'
      },
      PTL: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        border: 'border-indigo-200'
      },
      LOP: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200'
      }
    };
    const style = colors[code] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200'
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${style.bg} ${style.text} border ${style.border}`}>

        {code}
      </span>);

  };
  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <div
            className="w-2 h-2 bg-red-500 rounded-full"
            title="High Priority" />);


      case 'normal':
        return (
          <div
            className="w-2 h-2 bg-green-500 rounded-full"
            title="Normal Priority" />);


      case 'low':
        return (
          <div
            className="w-2 h-2 bg-gray-400 rounded-full"
            title="Low Priority" />);


      default:
        return null;
    }
  };
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedRows.length === leaveApplications.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(leaveApplications.map((app) => app.id));
    }
  };
  const statusCounts = {
    all: leaveApplications.length,
    pending: leaveApplications.filter((app) => app.status === 'pending').length,
    approved: leaveApplications.filter((app) => app.status === 'approved').
    length,
    rejected: leaveApplications.filter((app) => app.status === 'rejected').
    length,
    cancelled: leaveApplications.filter((app) => app.status === 'cancelled').
    length
  };
  const filteredApplications =
  activeFilter === 'all' ?
  leaveApplications :
  leaveApplications.filter((app) => app.status === activeFilter);
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Listing</h1>
          <p className="text-sm text-gray-500">
            Track and manage all employee leave applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Leave Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {leaveApplications.length}
          </p>
          <p className="text-xs text-blue-600">Applications</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">
              Action Required
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {statusCounts.pending}
          </p>
          <p className="text-xs text-yellow-600">Pending</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              {Math.round(statusCounts.approved / statusCounts.all * 100)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {statusCounts.approved}
          </p>
          <p className="text-xs text-green-600">Approved</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-700">
            {statusCounts.rejected}
          </p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <Ban className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">By Employee</span>
          </div>
          <p className="text-2xl font-bold text-gray-700">
            {statusCounts.cancelled}
          </p>
          <p className="text-xs text-gray-600">Cancelled</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-700">32</p>
          <p className="text-xs text-purple-600">Total Days</p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(
                  (filter) =>
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${activeFilter === filter ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                      {filter} ({statusCounts[filter]})
                    </button>

                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee, reason..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

              </div>
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Departments'
                },
                {
                  value: 'engineering',
                  label: 'Engineering'
                },
                {
                  value: 'hr',
                  label: 'Human Resources'
                },
                {
                  value: 'finance',
                  label: 'Finance'
                },
                {
                  value: 'marketing',
                  label: 'Marketing'
                },
                {
                  value: 'operations',
                  label: 'Operations'
                },
                {
                  value: 'sales',
                  label: 'Sales'
                },
                {
                  value: 'it',
                  label: 'IT Support'
                }]
                }
                defaultValue="all" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Leave Types'
                },
                {
                  value: 'cl',
                  label: 'Casual Leave'
                },
                {
                  value: 'sl',
                  label: 'Sick Leave'
                },
                {
                  value: 'pl',
                  label: 'Privilege Leave'
                },
                {
                  value: 'el',
                  label: 'Earned Leave'
                },
                {
                  value: 'co',
                  label: 'Comp Off'
                },
                {
                  value: 'ml',
                  label: 'Maternity Leave'
                },
                {
                  value: 'ptl',
                  label: 'Paternity Leave'
                },
                {
                  value: 'lop',
                  label: 'Loss of Pay'
                }]
                }
                defaultValue="all" />

              <Input type="date" placeholder="From Date" />
              <Input type="date" placeholder="To Date" />
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {selectedRows.length > 0 &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                <span className="font-semibold">{selectedRows.length}</span>{' '}
                application(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-sm py-1 px-3">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Bulk Approve
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <XCircle className="w-3 h-3 mr-1" />
                  Bulk Reject
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <Download className="w-3 h-3 mr-1" />
                  Export Selected
                </Button>
                <Button
                variant="outline"
                className="text-sm py-1 px-3"
                onClick={() => setSelectedRows([])}>

                  Clear Selection
                </Button>
              </div>
            </div>
          }

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-20 border-r">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={
                        selectedRows.length === filteredApplications.length
                        }
                        onChange={toggleSelectAll} />

                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-20 border-r min-w-[50px]"></th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-16 bg-gray-50 z-20 border-r min-w-[80px]">
                      Leave ID
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                      onClick={() => handleSort('applicationDate')}>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Application Date
                        <SortIcon column="applicationDate" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
                      onClick={() => handleSort('employeeName')}>

                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Employee
                        <SortIcon column="employeeName" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Leave Type
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Duration
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
                      onClick={() => handleSort('fromDate')}>

                      <div className="flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3" />
                        Dates Applied
                        <SortIcon column="fromDate" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                      Reason
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px]">
                      Balance
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Approver
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-l">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application, index) =>
                  <tr
                    key={application.id}
                    className={`hover:bg-blue-50/50 ${selectedRows.includes(application.id) ? 'bg-blue-50' : application.status === 'rejected' ? 'bg-red-50/30' : application.status === 'pending' ? 'bg-yellow-50/30' : application.status === 'cancelled' ? 'bg-gray-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                      <td className="px-3 py-3 sticky left-0 bg-inherit border-r">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.includes(application.id)}
                        onChange={() => toggleRowSelection(application.id)} />

                      </td>
                      <td className="px-3 py-3 sticky left-10 bg-inherit border-r">
                        {getPriorityIndicator(application.priority)}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-blue-600 sticky left-16 bg-inherit border-r">
                        {application.id}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900">
                          {application.applicationDate}
                        </div>
                        <div className="text-xs text-gray-500">
                          {application.appliedOn}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                              {application.employeeName.
                            split(' ').
                            map((n) => n[0]).
                            join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {application.employeeName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.employeeId} •{' '}
                              {application.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {getLeaveTypeBadge(
                          application.leaveType,
                          application.leaveTypeCode
                        )}
                          <span className="text-xs text-gray-600">
                            {application.leaveType}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-sm font-bold rounded-lg ${application.duration >= 5 ? 'bg-red-100 text-red-700' : application.duration >= 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>

                          {application.duration}{' '}
                          {application.duration === 1 ||
                        application.duration === 0.5 ?
                        'day' :
                        'days'}
                        </span>
                        {application.isHalfDay &&
                      <div className="text-xs text-gray-500 mt-1">
                            {application.halfDaySession}
                          </div>
                      }
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-start gap-2">
                          <CalendarCheck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-900">
                              {application.fromDate}
                              {application.fromDate !== application.toDate &&
                            ` to ${application.toDate}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                              application.fromDate
                            ).toLocaleDateString('en-US', {
                              weekday: 'short'
                            })}
                              {application.fromDate !== application.toDate &&
                            ` - ${new Date(
                              application.toDate
                            ).toLocaleDateString('en-US', {
                              weekday: 'short'
                            })}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p
                        className="text-sm text-gray-700 line-clamp-2"
                        title={application.reason}>

                          {application.reason}
                        </p>
                        {application.comments &&
                      <p className="text-xs text-gray-500 mt-1 italic">
                            {application.comments}
                          </p>
                      }
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {application.currentBalance}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span
                          className={`text-sm font-bold ${application.afterBalance < 0 ? 'text-red-600' : application.afterBalance <= 2 ? 'text-orange-600' : 'text-green-600'}`}>

                            {application.afterBalance}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(application.status)}
                        {application.status === 'approved' &&
                      application.approvedOn &&
                      <div className="text-xs text-gray-500 mt-1">
                              {application.approvedOn}
                            </div>
                      }
                        {application.status === 'rejected' &&
                      application.rejectedOn &&
                      <div
                        className="text-xs text-red-600 mt-1"
                        title={application.rejectionReason}>

                              {application.rejectedOn}
                            </div>
                      }
                        {application.status === 'cancelled' &&
                      application.cancelledOn &&
                      <div
                        className="text-xs text-gray-500 mt-1"
                        title={application.cancellationReason}>

                              {application.cancelledOn}
                            </div>
                      }
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {application.approver === 'CEO' ||
                        application.approver === 'CTO' ?
                        <UserCheck className="w-4 h-4 text-purple-500" /> :

                        <User className="w-4 h-4 text-gray-400" />
                        }
                          <div>
                            <p className="text-sm text-gray-900">
                              {application.approver}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {application.approverStatus}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="View Details">

                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {application.status === 'pending' &&
                        <>
                              <button
                            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                            title="Approve">

                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                              <button
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reject">

                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                        }
                          {(application.status === 'pending' ||
                        application.status === 'approved') &&
                        <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Edit">

                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                        }
                          {application.attachments > 0 &&
                        <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors relative"
                          title={`${application.attachments} Attachments`}>

                              <Paperclip className="w-4 h-4 text-gray-500" />
                              <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                {application.attachments}
                              </span>
                            </button>
                        }
                          <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="More Options">

                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-medium">
                  1-{filteredApplications.length}
                </span>{' '}
                of{' '}
                <span className="font-medium">
                  {filteredApplications.length}
                </span>{' '}
                applications
              </p>
              <Select
                options={[
                {
                  value: '10',
                  label: '10 per page'
                },
                {
                  value: '25',
                  label: '25 per page'
                },
                {
                  value: '50',
                  label: '50 per page'
                },
                {
                  value: '100',
                  label: '100 per page'
                }]
                }
                defaultValue="25" />

            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                1
              </span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
                2
              </span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
                3
              </span>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Leave Statistics">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {Math.round(
                  statusCounts.approved / (
                  statusCounts.all - statusCounts.cancelled) *
                  100
                )}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${statusCounts.approved / (statusCounts.all - statusCounts.cancelled) * 100}%`
                }} />

            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg. Leave Duration</span>
                <span className="font-semibold">3.2 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Most Common Type</span>
                <span className="font-semibold text-blue-600">
                  Casual Leave
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Peak Leave Month</span>
                <span className="font-semibold">February</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Processing Time
                </span>
                <span className="text-xs text-gray-500">Avg. 2.5 hrs</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">&lt; 1 hour</span>
                  <span className="text-xs font-medium">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">1-4 hours</span>
                  <span className="text-xs font-medium">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">&gt; 4 hours</span>
                  <span className="text-xs font-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Leave Type Distribution">
          <div className="space-y-3">
            {[
            {
              type: 'Casual Leave',
              count: 4,
              percentage: 40,
              color: 'blue'
            },
            {
              type: 'Sick Leave',
              count: 1,
              percentage: 10,
              color: 'orange'
            },
            {
              type: 'Privilege Leave',
              count: 1,
              percentage: 10,
              color: 'green'
            },
            {
              type: 'Earned Leave',
              count: 1,
              percentage: 10,
              color: 'purple'
            },
            {
              type: 'Maternity Leave',
              count: 1,
              percentage: 10,
              color: 'pink'
            },
            {
              type: 'Paternity Leave',
              count: 1,
              percentage: 10,
              color: 'indigo'
            },
            {
              type: 'Others',
              count: 1,
              percentage: 10,
              color: 'gray'
            }].
            map((item, index) =>
            <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div
                  className={`w-2 h-2 rounded-full bg-${item.color}-500`}>
                </div>
                  <span className="text-sm text-gray-700">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full bg-${item.color}-500 rounded-full`}
                    style={{
                      width: `${item.percentage}%`
                    }} />

                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Department-wise Applications">
          <div className="space-y-3">
            {[
            {
              dept: 'Engineering',
              pending: 1,
              approved: 2,
              total: 4
            },
            {
              dept: 'HR',
              pending: 0,
              approved: 2,
              total: 2
            },
            {
              dept: 'Finance',
              pending: 0,
              approved: 1,
              total: 1
            },
            {
              dept: 'Marketing',
              pending: 0,
              approved: 0,
              total: 1
            },
            {
              dept: 'Operations',
              pending: 0,
              approved: 1,
              total: 1
            },
            {
              dept: 'Sales',
              pending: 1,
              approved: 0,
              total: 1
            }].
            map((dept, index) =>
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">

                <span className="text-sm text-gray-700">{dept.dept}</span>
                <div className="flex items-center gap-2">
                  {dept.pending > 0 &&
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      {dept.pending}P
                    </span>
                }
                  {dept.approved > 0 &&
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {dept.approved}A
                    </span>
                }
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {dept.total}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Leave Application
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Leave Calendar View
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Leave Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <History className="w-4 h-4 mr-2" />
              Leave History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="w-4 h-4 mr-2" />
              Send Reminders
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-800">
                    Pending Actions
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    {statusCounts.pending} applications awaiting approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Activity">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              {
                time: '2 hours ago',
                employee: 'John Doe',
                action: 'Applied',
                type: 'CL',
                details: '3 days leave for family function'
              },
              {
                time: '5 hours ago',
                employee: 'Jane Smith',
                action: 'Approved',
                type: 'SL',
                details: 'Medical checkup approved by Admin'
              },
              {
                time: '1 day ago',
                employee: 'Robert Johnson',
                action: 'Applied',
                type: 'PL',
                details: '6 days vacation to Kerala'
              },
              {
                time: '1 day ago',
                employee: 'Emily Davis',
                action: 'Rejected',
                type: 'CL',
                details: 'Conflict with campaign schedule'
              },
              {
                time: '2 days ago',
                employee: 'Sarah Wilson',
                action: 'Approved',
                type: 'ML',
                details: '180 days maternity leave'
              }].
              map((activity, index) =>
              <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {activity.time}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {activity.employee}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${activity.action === 'Approved' ? 'bg-green-100 text-green-700' : activity.action === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>

                      {activity.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {activity.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {activity.details}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}