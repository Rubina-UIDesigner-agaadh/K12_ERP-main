import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Lock,
  Unlock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  Calculator,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  MoreHorizontal,
  Settings,
  AlertCircle,
  Check,
  X,
  Loader,
  Shield,
  FileText,
  Send,
  Printer,
  Info,
  ChevronUp,
  ChevronDown,
  Zap,
  TrendingUp } from
'lucide-react';

export function MonthlyAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [processingStatus, setProcessingStatus] = useState('pending'); // pending, processing, processed, locked
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const employees = [
  {
    id: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    totalDays: 31,
    presentDays: 22,
    absentDays: 0,
    leaveDays: 2,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 0,
    compOff: 0,
    overtimeHours: 8,
    payableDays: 24,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    totalDays: 31,
    presentDays: 21,
    absentDays: 1,
    leaveDays: 0,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 2,
    compOff: 0,
    overtimeHours: 0,
    payableDays: 22,
    status: 'processed',
    remarks: '2 days LOP deducted'
  },
  {
    id: 'EMP003',
    name: 'Robert Johnson',
    department: 'Finance',
    designation: 'Accountant',
    totalDays: 31,
    presentDays: 20,
    absentDays: 0,
    leaveDays: 3,
    weekOffs: 6,
    holidays: 1,
    halfDays: 1,
    lop: 0,
    compOff: 0,
    overtimeHours: 4,
    payableDays: 23.5,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    totalDays: 31,
    presentDays: 18,
    absentDays: 2,
    leaveDays: 2,
    weekOffs: 6,
    holidays: 1,
    halfDays: 2,
    lop: 0,
    compOff: 0,
    overtimeHours: 0,
    payableDays: 22,
    status: 'pending',
    remarks: 'Pending manager approval for 2 leaves'
  },
  {
    id: 'EMP005',
    name: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    totalDays: 31,
    presentDays: 23,
    absentDays: 0,
    leaveDays: 1,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 0,
    compOff: 0,
    overtimeHours: 12,
    payableDays: 24,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP006',
    name: 'Sarah Wilson',
    department: 'Operations',
    designation: 'Operations Manager',
    totalDays: 31,
    presentDays: 19,
    absentDays: 3,
    leaveDays: 0,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 2,
    compOff: 0,
    overtimeHours: 0,
    payableDays: 20,
    status: 'error',
    remarks: 'Attendance mismatch - needs review'
  },
  {
    id: 'EMP007',
    name: 'David Lee',
    department: 'IT Support',
    designation: 'IT Administrator',
    totalDays: 31,
    presentDays: 22,
    absentDays: 0,
    leaveDays: 2,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 0,
    compOff: 0,
    overtimeHours: 6,
    payableDays: 24,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP008',
    name: 'Lisa Anderson',
    department: 'Sales',
    designation: 'Sales Executive',
    totalDays: 31,
    presentDays: 20,
    absentDays: 1,
    leaveDays: 2,
    weekOffs: 6,
    holidays: 1,
    halfDays: 1,
    lop: 0,
    compOff: 0,
    overtimeHours: 0,
    payableDays: 22.5,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP009',
    name: 'James Taylor',
    department: 'Engineering',
    designation: 'Tech Lead',
    totalDays: 31,
    presentDays: 21,
    absentDays: 0,
    leaveDays: 3,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 0,
    compOff: 0,
    overtimeHours: 16,
    payableDays: 24,
    status: 'processed',
    remarks: ''
  },
  {
    id: 'EMP010',
    name: 'Jennifer Martinez',
    department: 'HR',
    designation: 'HR Executive',
    totalDays: 31,
    presentDays: 22,
    absentDays: 1,
    leaveDays: 1,
    weekOffs: 6,
    holidays: 1,
    halfDays: 0,
    lop: 0,
    compOff: 0,
    overtimeHours: 0,
    payableDays: 23,
    status: 'pending',
    remarks: 'Leave approval pending'
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
    if (sortColumn !== column) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :
    <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Processed
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>);

      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>);

      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
            <Lock className="w-3 h-3" />
            Locked
          </span>);

      default:
        return null;
    }
  };

  const processedCount = employees.filter((e) => e.status === 'processed').length;
  const pendingCount = employees.filter((e) => e.status === 'pending').length;
  const errorCount = employees.filter((e) => e.status === 'error').length;
  const totalPayableDays = employees.reduce((sum, e) => sum + e.payableDays, 0);
  const totalOvertimeHours = employees.reduce((sum, e) => sum + e.overtimeHours, 0);
  const totalLOP = employees.reduce((sum, e) => sum + e.lop, 0);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === employees.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(employees.map((e) => e.id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Attendance Processing
          </h1>
          <p className="text-sm text-gray-500">
            Calculate payable days and finalize attendance for payroll
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recalculate
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
          {processingStatus === 'locked' ?
          <Button variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50">
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Attendance
            </Button> :

          <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
              <Lock className="w-4 h-4 mr-2" />
              Lock Attendance
            </Button>
          }
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
              <Button variant="outline" className="p-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3">
                <Calendar className="w-5 h-5" />
                <select
                  className="bg-transparent border-none text-white font-semibold focus:outline-none cursor-pointer"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}>

                  <option value="01" className="text-gray-900">January</option>
                  <option value="02" className="text-gray-900">February</option>
                  <option value="03" className="text-gray-900">March</option>
                  <option value="04" className="text-gray-900">April</option>
                  <option value="05" className="text-gray-900">May</option>
                  <option value="06" className="text-gray-900">June</option>
                  <option value="07" className="text-gray-900">July</option>
                  <option value="08" className="text-gray-900">August</option>
                  <option value="09" className="text-gray-900">September</option>
                  <option value="10" className="text-gray-900">October</option>
                  <option value="11" className="text-gray-900">November</option>
                  <option value="12" className="text-gray-900">December</option>
                </select>
                <select
                  className="bg-transparent border-none text-white font-semibold focus:outline-none cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}>

                  <option value="2024" className="text-gray-900">2024</option>
                  <option value="2023" className="text-gray-900">2023</option>
                  <option value="2022" className="text-gray-900">2022</option>
                </select>
              </div>
              <Button variant="outline" className="p-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/30"></div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/70">Working Days:</span>
              <span className="font-bold text-xl">24</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/70">Holidays:</span>
              <span className="font-bold text-xl">1</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/70">Week Offs:</span>
              <span className="font-bold text-xl">6</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            processingStatus === 'locked' ?
            'bg-purple-500/50' :
            processingStatus === 'processing' ?
            'bg-yellow-500/50' :
            'bg-white/20'}`
            }>
              {processingStatus === 'locked' ?
              <>
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Locked for Payroll</span>
                </> :
              processingStatus === 'processing' ?
              <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="font-medium">Processing...</span>
                </> :

              <>
                  <Unlock className="w-4 h-4" />
                  <span className="font-medium">Open for Editing</span>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
          <p className="text-xs text-gray-500">Employees</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">{Math.round(processedCount / employees.length * 100)}%</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{processedCount}</p>
          <p className="text-xs text-gray-500">Processed</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-yellow-600 font-medium">Action Needed</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-600 font-medium">Review</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{errorCount}</p>
          <p className="text-xs text-gray-500">Errors</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-5 h-5 text-purple-500" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{totalPayableDays}</p>
          <p className="text-xs text-gray-500">Total Payable Days</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">{totalOvertimeHours} hrs</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{totalLOP}</p>
          <p className="text-xs text-gray-500">LOP Days</p>
        </div>
      </div>

      {(pendingCount > 0 || errorCount > 0) &&
      <div className={`rounded-xl p-4 flex items-start gap-3 ${
      errorCount > 0 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`
      }>
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${errorCount > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
          <div className="flex-1">
            <h3 className={`font-medium ${errorCount > 0 ? 'text-red-800' : 'text-yellow-800'}`}>
              {errorCount > 0 ? 'Errors Found - Cannot Lock Attendance' : 'Pending Items Require Attention'}
            </h3>
            <p className={`text-sm mt-1 ${errorCount > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              {errorCount > 0 ?
            `${errorCount} employee(s) have attendance errors that need to be resolved before locking.` :
            `${pendingCount} employee(s) have pending approvals or missing data.`
            }
            </p>
          </div>
          <Button variant="outline" className={`${
        errorCount > 0 ? 'border-red-300 text-red-700 hover:bg-red-100' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'}`
        }>
            View Issues
          </Button>
        </div>
      }

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

              </div>
              <Select
                options={[
                { value: 'all', label: 'All Departments' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'finance', label: 'Finance' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'operations', label: 'Operations' },
                { value: 'it', label: 'IT Support' },
                { value: 'sales', label: 'Sales' }]
                }
                defaultValue="all" />

              <Select
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'processed', label: 'Processed' },
                { value: 'pending', label: 'Pending' },
                { value: 'error', label: 'Error' },
                { value: 'locked', label: 'Locked' }]
                }
                defaultValue="all" />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Recalculate Selected
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Processing Rules
              </Button>
            </div>
          </div>

          {selectedRows.length > 0 &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                <span className="font-semibold">{selectedRows.length}</span> employee(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-sm py-1 px-3">
                  <Play className="w-3 h-3 mr-1" />
                  Process Selected
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark as Verified
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => setSelectedRows([])}>
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
                        checked={selectedRows.length === employees.length}
                        onChange={toggleSelectAll} />

                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-10 bg-gray-50 z-20 border-r min-w-[200px]"
                      onClick={() => handleSort('name')}>

                      <div className="flex items-center gap-1">
                        Employee
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Department
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[60px] bg-green-50"
                      onClick={() => handleSort('presentDays')}
                      title="Present Days">

                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          P
                          <SortIcon column="presentDays" />
                        </div>
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-red-50"
                      title="Absent Days">

                      A
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-blue-50"
                      title="Leave Days">

                      L
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-gray-100"
                      title="Week Offs">

                      WO
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-purple-50"
                      title="Holidays">

                      H
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-yellow-50"
                      title="Half Days">

                      HD
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-red-100"
                      title="Loss of Pay">

                      LOP
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] bg-orange-50"
                      title="Overtime Hours">

                      OT
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[90px] bg-indigo-100 text-indigo-700 border-l-2 border-indigo-300"
                      onClick={() => handleSort('payableDays')}>

                      <div className="flex items-center justify-center gap-1">
                        Payable
                        <SortIcon column="payableDays" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Remarks
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-l">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) =>
                  <tr
                    key={employee.id}
                    className={`hover:bg-blue-50/50 ${
                    selectedRows.includes(employee.id) ? 'bg-blue-50' :
                    employee.status === 'error' ? 'bg-red-50/30' :
                    employee.status === 'pending' ? 'bg-yellow-50/30' :
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`
                    }>

                      <td className="px-3 py-3 sticky left-0 bg-inherit border-r">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.includes(employee.id)}
                        onChange={() => toggleRowSelection(employee.id)} />

                      </td>
                      <td className="px-3 py-3 sticky left-10 bg-inherit border-r">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                              {employee.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.id} • {employee.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">{employee.department}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-semibold text-green-600">{employee.presentDays}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-semibold ${employee.absentDays > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {employee.absentDays}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-semibold text-blue-600">{employee.leaveDays}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm text-gray-500">{employee.weekOffs}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm text-purple-600">{employee.holidays}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm ${employee.halfDays > 0 ? 'text-yellow-600 font-medium' : 'text-gray-400'}`}>
                          {employee.halfDays}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-semibold ${employee.lop > 0 ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded' : 'text-gray-400'}`}>
                          {employee.lop}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm ${employee.overtimeHours > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
                          {employee.overtimeHours}h
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center border-l-2 border-indigo-200">
                        <span className="text-lg font-bold text-indigo-700">{employee.payableDays}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(employee.status)}
                      </td>
                      <td className="px-3 py-3">
                        {employee.remarks ?
                      <span className="text-xs text-gray-600 line-clamp-2" title={employee.remarks}>
                            {employee.remarks}
                          </span> :

                      <span className="text-xs text-gray-400">—</span>
                      }
                      </td>
                      <td className="px-3 py-3 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          {employee.status === 'error' &&
                        <button className="p-1.5 hover:bg-red-100 rounded-lg transition-colors" title="Resolve Error">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </button>
                        }
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="More Options">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr className="font-semibold">
                    <td colSpan="3" className="px-3 py-3 text-sm text-gray-700 sticky left-0 bg-gray-100 border-r">
                      Total ({employees.length} Employees)
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-green-700">
                      {employees.reduce((sum, e) => sum + e.presentDays, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-red-700">
                      {employees.reduce((sum, e) => sum + e.absentDays, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-blue-700">
                      {employees.reduce((sum, e) => sum + e.leaveDays, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-600">
                      {employees.reduce((sum, e) => sum + e.weekOffs, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-purple-700">
                      {employees.reduce((sum, e) => sum + e.holidays, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-yellow-700">
                      {employees.reduce((sum, e) => sum + e.halfDays, 0)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-red-700">
                      {totalLOP}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-orange-700">
                      {totalOvertimeHours}h
                    </td>
                    <td className="px-3 py-3 text-center text-lg font-bold text-indigo-700 border-l-2 border-indigo-300">
                      {totalPayableDays}
                    </td>
                    <td colSpan="3" className="px-3 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1-{employees.length}</span> of <span className="font-medium">156</span> employees
              </p>
              <Select
                options={[
                { value: '10', label: '10 per page' },
                { value: '25', label: '25 per page' },
                { value: '50', label: '50 per page' },
                { value: '100', label: '100 per page' }]
                }
                defaultValue="25" />

            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">2</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">3</span>
              <span className="px-3 py-1 text-gray-600 text-sm">...</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">7</span>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Processing Summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processing Progress</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(processedCount / employees.length * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
              style={{ width: `${processedCount / employees.length * 100}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">{processedCount}</p>
                <p className="text-xs text-gray-500">Processed</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-600">{errorCount}</p>
                <p className="text-xs text-gray-500">Errors</p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Payable Days</span>
                <span className="font-bold text-gray-900">{totalPayableDays}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Average per Employee</span>
                <span className="font-bold text-gray-900">{(totalPayableDays / employees.length).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total LOP Days</span>
                <span className="font-bold text-red-600">{totalLOP}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Overtime Hours</span>
                <span className="font-bold text-orange-600">{totalOvertimeHours}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Lock Attendance">
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
            processingStatus === 'locked' ?
            'bg-purple-50 border-purple-300' :
            errorCount > 0 ?
            'bg-red-50 border-red-300' :
            pendingCount > 0 ?
            'bg-yellow-50 border-yellow-300' :
            'bg-green-50 border-green-300'}`
            }>
              <div className="flex items-center gap-3 mb-3">
                {processingStatus === 'locked' ?
                <Lock className="w-8 h-8 text-purple-600" /> :
                errorCount > 0 ?
                <XCircle className="w-8 h-8 text-red-600" /> :
                pendingCount > 0 ?
                <AlertTriangle className="w-8 h-8 text-yellow-600" /> :

                <CheckCircle className="w-8 h-8 text-green-600" />
                }
                <div>
                  <p className={`font-semibold ${
                  processingStatus === 'locked' ?
                  'text-purple-800' :
                  errorCount > 0 ?
                  'text-red-800' :
                  pendingCount > 0 ?
                  'text-yellow-800' :
                  'text-green-800'}`
                  }>
                    {processingStatus === 'locked' ?
                    'Attendance Locked' :
                    errorCount > 0 ?
                    'Cannot Lock - Errors Found' :
                    pendingCount > 0 ?
                    'Pending Items Exist' :
                    'Ready to Lock'
                    }
                  </p>
                  <p className={`text-sm ${
                  processingStatus === 'locked' ?
                  'text-purple-600' :
                  errorCount > 0 ?
                  'text-red-600' :
                  pendingCount > 0 ?
                  'text-yellow-600' :
                  'text-green-600'}`
                  }>
                    {processingStatus === 'locked' ?
                    'Locked on 31 Jan 2024, 06:30 PM' :
                    errorCount > 0 ?
                    `Resolve ${errorCount} error(s) first` :
                    pendingCount > 0 ?
                    `${pendingCount} pending approval(s)` :
                    'All records processed successfully'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">All attendance entries verified</span>
              </div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 ?
                <X className="w-4 h-4 text-red-500" /> :

                <Check className="w-4 h-4 text-green-500" />
                }
                <span className="text-sm text-gray-600">All leave requests approved</span>
              </div>
              <div className="flex items-center gap-2">
                {errorCount > 0 ?
                <X className="w-4 h-4 text-red-500" /> :

                <Check className="w-4 h-4 text-green-500" />
                }
                <span className="text-sm text-gray-600">No calculation errors</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Overtime hours verified</span>
              </div>
            </div>

            {processingStatus === 'locked' ?
            <Button variant="outline" className="w-full text-orange-600 border-orange-300 hover:bg-orange-50">
                <Unlock className="w-4 h-4 mr-2" />
                Unlock for Corrections
              </Button> :

            <Button
              variant="primary"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={errorCount > 0}>

                <Lock className="w-4 h-4 mr-2" />
                Lock Attendance for Payroll
              </Button>
            }

            <p className="text-xs text-gray-500 text-center">
              Once locked, attendance cannot be modified without HR approval
            </p>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Play className="w-4 h-4 mr-2" />
              Process All Pending
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="w-4 h-4 mr-2" />
              Recalculate All
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Payroll Input
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="w-4 h-4 mr-2" />
              Send to Payroll System
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Printer className="w-4 h-4 mr-2" />
              Print Attendance Summary
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Processing Info</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Payable days = Present + Paid Leave + Holidays (during working period)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Processing History & Audit Log">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              { time: '31 Jan 2024, 06:30 PM', action: 'Attendance Locked', by: 'Admin User', details: 'Locked for January 2024 payroll', status: 'success' },
              { time: '31 Jan 2024, 06:25 PM', action: 'Bulk Processing', by: 'System', details: 'Processed 156 employee records', status: 'success' },
              { time: '31 Jan 2024, 05:45 PM', action: 'Error Resolved', by: 'HR Manager', details: 'Fixed attendance mismatch for EMP006', status: 'success' },
              { time: '31 Jan 2024, 04:30 PM', action: 'Manual Adjustment', by: 'HR Executive', details: 'Added 2 LOP days for EMP002', status: 'info' },
              { time: '31 Jan 2024, 03:15 PM', action: 'Recalculation', by: 'System', details: 'Recalculated payable days for all employees', status: 'success' }].
              map((log, index) =>
              <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{log.time}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.by}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                  <td className="px-4 py-3">
                    {log.status === 'success' &&
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Success
                      </span>
                  }
                    {log.status === 'info' &&
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        <Info className="w-3 h-3" />
                        Info
                      </span>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <X className="w-4 h-4 mr-2" />
          Cancel Changes
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Recalculate All
        </Button>
        <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
          <FileText className="w-4 h-4 mr-2" />
          Generate Payroll Input
        </Button>
        <Button variant="primary" className="bg-purple-600 hover:bg-purple-700" disabled={errorCount > 0}>
          <Lock className="w-4 h-4 mr-2" />
          Lock Attendance
        </Button>
      </div>
    </div>);

}