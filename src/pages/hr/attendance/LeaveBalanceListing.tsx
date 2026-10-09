import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  Users,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  MoreHorizontal,
  Settings,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Upload } from
'lucide-react';

export function LeaveBalanceListing() {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);

  const leaveTypes = [
  { key: 'cl', label: 'CL', fullName: 'Casual Leave', entitled: 12, bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
  { key: 'pl', label: 'PL', fullName: 'Privilege Leave', entitled: 15, bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200' },
  { key: 'sl', label: 'SL', fullName: 'Sick Leave', entitled: 10, bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200' },
  { key: 'el', label: 'EL', fullName: 'Earned Leave', entitled: 20, bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200' },
  { key: 'co', label: 'CO', fullName: 'Comp-Off', entitled: 0, bgColor: 'bg-teal-50', textColor: 'text-teal-600', borderColor: 'border-teal-200' },
  { key: 'ml', label: 'ML', fullName: 'Maternity Leave', entitled: 180, bgColor: 'bg-pink-50', textColor: 'text-pink-600', borderColor: 'border-pink-200' },
  { key: 'ptl', label: 'PTL', fullName: 'Paternity Leave', entitled: 15, bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-indigo-200' },
  { key: 'lop', label: 'LOP', fullName: 'Loss of Pay', entitled: 0, bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' }];


  const employees = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', status: 'Active', cl: 8, pl: 12, sl: 5, el: 15, co: 3, ml: 0, ptl: 0, lop: 0, total: 43, used: 14, carryForward: 5 },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', status: 'Active', cl: 5, pl: 8, sl: 3, el: 10, co: 1, ml: 0, ptl: 0, lop: 2, total: 27, used: 18, carryForward: 3 },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', status: 'Active', cl: 10, pl: 15, sl: 6, el: 18, co: 2, ml: 0, ptl: 0, lop: 0, total: 51, used: 6, carryForward: 8 },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', cl: 6, pl: 10, sl: 4, el: 12, co: 4, ml: 0, ptl: 0, lop: 1, total: 36, used: 12, carryForward: 4 },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', status: 'Active', cl: 12, pl: 14, sl: 6, el: 20, co: 0, ml: 0, ptl: 0, lop: 0, total: 52, used: 5, carryForward: 7 },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', status: 'Active', cl: 4, pl: 6, sl: 2, el: 8, co: 5, ml: 0, ptl: 0, lop: 3, total: 25, used: 22, carryForward: 2 },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', status: 'Active', cl: 9, pl: 11, sl: 5, el: 14, co: 2, ml: 0, ptl: 0, lop: 0, total: 41, used: 10, carryForward: 6 },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', status: 'Active', cl: 7, pl: 9, sl: 4, el: 11, co: 1, ml: 0, ptl: 0, lop: 1, total: 32, used: 15, carryForward: 3 },
  { id: 'EMP009', name: 'James Taylor', department: 'Engineering', designation: 'Tech Lead', status: 'Active', cl: 3, pl: 5, sl: 2, el: 6, co: 6, ml: 0, ptl: 0, lop: 0, total: 22, used: 25, carryForward: 4 },
  { id: 'EMP010', name: 'Jennifer Martinez', department: 'HR', designation: 'HR Executive', status: 'Active', cl: 11, pl: 13, sl: 6, el: 16, co: 0, ml: 0, ptl: 0, lop: 0, total: 46, used: 8, carryForward: 5 },
  { id: 'EMP011', name: 'Christopher Garcia', department: 'Finance', designation: 'Finance Manager', status: 'Active', cl: 2, pl: 4, sl: 1, el: 5, co: 3, ml: 0, ptl: 0, lop: 4, total: 15, used: 28, carryForward: 2 },
  { id: 'EMP012', name: 'Amanda Robinson', department: 'Marketing', designation: 'Content Writer', status: 'Probation', cl: 6, pl: 7, sl: 3, el: 10, co: 2, ml: 0, ptl: 0, lop: 0, total: 28, used: 5, carryForward: 0 }];


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

  const getBalanceStyle = (value, type, entitled) => {
    if (type === 'lop' && value > 0) return 'text-red-600 font-bold bg-red-50';
    if (value === 0) return 'text-gray-400';
    if (entitled > 0 && value <= entitled * 0.2) return 'text-orange-600 font-semibold bg-orange-50';
    if (entitled > 0 && value >= entitled * 0.8) return 'text-green-600 font-medium';
    return 'text-gray-900';
  };

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

  const totalLeaves = employees.reduce((sum, emp) => sum + emp.total, 0);
  const totalUsed = employees.reduce((sum, emp) => sum + emp.used, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Balance Listing
          </h1>
          <p className="text-sm text-gray-500">
            Company-wide leave ledger with current balances for all employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Employees</p>
              <p className="text-3xl font-bold">{employees.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2">Active in system</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Total Balance</p>
              <p className="text-3xl font-bold">{totalLeaves}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-green-100 mt-2">Days available</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100">Total Used</p>
              <p className="text-3xl font-bold">{totalUsed}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-orange-100 mt-2">Days utilized</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Avg Balance</p>
              <p className="text-3xl font-bold">{Math.round(totalLeaves / employees.length)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-purple-100 mt-2">Per employee</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-100">Utilization</p>
              <p className="text-3xl font-bold">{Math.round(totalUsed / (totalLeaves + totalUsed) * 100)}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-teal-100 mt-2">Overall rate</p>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {leaveTypes.map((type) => {
          const total = employees.reduce((sum, emp) => sum + emp[type.key], 0);
          return (
            <div key={type.key} className={`${type.bgColor} p-3 rounded-lg border ${type.borderColor}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${type.textColor} uppercase`}>{type.label}</span>
                <span className={`text-lg font-bold ${type.textColor}`}>{total}</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate" title={type.fullName}>{type.fullName}</p>
            </div>);

        })}
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, department..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />

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
                { value: 'active', label: 'Active' },
                { value: 'probation', label: 'Probation' },
                { value: 'notice', label: 'Notice Period' },
                { value: 'inactive', label: 'Inactive' }]
                }
                defaultValue="all" />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">As on:</span>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]} />

              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Columns
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
                  <Edit className="w-3 h-3 mr-1" />
                  Bulk Adjust
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <Download className="w-3 h-3 mr-1" />
                  Export Selected
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
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-10 bg-gray-50 z-20 border-r min-w-[70px]"
                      onClick={() => handleSort('id')}>

                      <div className="flex items-center gap-1">
                        Emp ID
                        <SortIcon column="id" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-24 bg-gray-50 z-20 border-r min-w-[180px]"
                      onClick={() => handleSort('name')}>

                      <div className="flex items-center gap-1">
                        Employee Name
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                      onClick={() => handleSort('department')}>

                      <div className="flex items-center gap-1">
                        Department
                        <SortIcon column="department" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[70px]">
                      Status
                    </th>
                    {leaveTypes.map((type) =>
                    <th
                      key={type.key}
                      className={`px-2 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[50px] ${type.bgColor} ${type.textColor}`}
                      onClick={() => handleSort(type.key)}
                      title={type.fullName}>

                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1">
                            {type.label}
                            <SortIcon column={type.key} />
                          </div>
                          <span className="text-[9px] font-normal opacity-70">({type.entitled})</span>
                        </div>
                      </th>
                    )}
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-100 min-w-[60px] border-l"
                      onClick={() => handleSort('total')}>

                      <div className="flex items-center justify-center gap-1">
                        Total
                        <SortIcon column="total" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[60px]"
                      onClick={() => handleSort('used')}>

                      <div className="flex items-center justify-center gap-1">
                        Used
                        <SortIcon column="used" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      CF
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] border-l">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) =>
                  <tr
                    key={employee.id}
                    className={`hover:bg-blue-50/50 ${selectedRows.includes(employee.id) ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                      <td className="px-3 py-2 sticky left-0 bg-inherit border-r">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.includes(employee.id)}
                        onChange={() => toggleRowSelection(employee.id)} />

                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-blue-600 sticky left-10 bg-inherit border-r">
                        {employee.id}
                      </td>
                      <td className="px-3 py-2 sticky left-24 bg-inherit border-r">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                              {employee.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                            <p className="text-xs text-gray-500 truncate">{employee.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">{employee.department}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      employee.status === 'Active' ?
                      'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'}`
                      }>
                          {employee.status}
                        </span>
                      </td>
                      {leaveTypes.map((type) =>
                    <td
                      key={type.key}
                      className={`px-2 py-2 text-center text-sm ${getBalanceStyle(employee[type.key], type.key, type.entitled)}`}>

                          {employee[type.key]}
                        </td>
                    )}
                      <td className="px-3 py-2 text-center text-sm font-bold text-gray-900 bg-gray-50 border-l">
                        {employee.total}
                      </td>
                      <td className="px-3 py-2 text-center text-sm font-medium text-orange-600">
                        {employee.used}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-purple-600">
                        {employee.carryForward}
                      </td>
                      <td className="px-3 py-2 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Edit Balance">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
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
                    <td colSpan="5" className="px-3 py-3 text-xs text-gray-700 sticky left-0 bg-gray-100 border-r">
                      Total ({employees.length} Employees)
                    </td>
                    {leaveTypes.map((type) =>
                    <td key={type.key} className={`px-2 py-3 text-center text-sm ${type.textColor} font-bold`}>
                        {employees.reduce((sum, emp) => sum + emp[type.key], 0)}
                      </td>
                    )}
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 bg-gray-200 border-l">
                      {totalLeaves}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-orange-700">
                      {totalUsed}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-purple-700">
                      {employees.reduce((sum, emp) => sum + emp.carryForward, 0)}
                    </td>
                    <td className="px-3 py-3 border-l"></td>
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
                { value: '100', label: '100 per page' },
                { value: 'all', label: 'Show All' }]
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
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">4</span>
              <span className="px-3 py-1 text-gray-600 text-sm">...</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">7</span>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Leave Type Legend">
          <div className="space-y-2">
            {leaveTypes.map((type) => {
              const total = employees.reduce((sum, emp) => sum + emp[type.key], 0);
              const percentage = totalLeaves > 0 ? Math.round(total / totalLeaves * 100) : 0;
              return (
                <div key={type.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-10 h-6 flex items-center justify-center text-xs font-bold rounded ${type.bgColor} ${type.textColor}`}>
                      {type.label}
                    </span>
                    <span className="text-sm text-gray-700">{type.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${type.bgColor.replace('50', '500')}`}
                        style={{ width: `${percentage}%` }} />

                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{total}</span>
                  </div>
                </div>);

            })}
          </div>
        </Card>

        <Card title="Department Summary">
          <div className="space-y-3">
            {['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT Support', 'Sales'].map((dept) => {
              const deptEmployees = employees.filter((e) => e.department === dept);
              const deptTotal = deptEmployees.reduce((sum, emp) => sum + emp.total, 0);
              const avgBalance = deptEmployees.length > 0 ? Math.round(deptTotal / deptEmployees.length) : 0;
              return (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-gray-700 truncate">{dept}</span>
                    <span className="text-xs text-gray-400">({deptEmployees.length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(deptTotal / 100 * 100, 100)}%` }} />

                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-10 text-right">{deptTotal}</span>
                    <span className="text-xs text-gray-500 w-12 text-right">~{avgBalance}/emp</span>
                  </div>
                </div>);

            })}
          </div>
        </Card>

        <Card title="Balance Alerts">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Critical Low Balance</p>
                <p className="text-xs text-red-600">Less than 2 days remaining</p>
              </div>
              <span className="text-xl font-bold text-red-600">3</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">Low Balance Warning</p>
                <p className="text-xs text-orange-600">Less than 20% remaining</p>
              </div>
              <span className="text-xl font-bold text-orange-600">5</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">Expiring Soon</p>
                <p className="text-xs text-purple-600">Carry forward expires in 30 days</p>
              </div>
              <span className="text-xl font-bold text-purple-600">8</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Healthy Balance</p>
                <p className="text-xs text-green-600">More than 80% remaining</p>
              </div>
              <span className="text-xl font-bold text-green-600">4</span>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Balance Adjustment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Annual Leave Reset
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Carry Forward Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Generate Leave Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics Dashboard
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Last Sync</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Today, 06:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Leave Balance Trend by Department">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                {leaveTypes.slice(0, 5).map((type) =>
                <th key={type.key} className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${type.textColor}`}>
                    {type.label}
                  </th>
                )}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Balance
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg/Employee
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              { dept: 'Engineering', trend: 'up', change: '+5.2%' },
              { dept: 'HR', trend: 'down', change: '-2.1%' },
              { dept: 'Finance', trend: 'up', change: '+3.8%' },
              { dept: 'Marketing', trend: 'same', change: '0%' },
              { dept: 'Operations', trend: 'down', change: '-4.5%' },
              { dept: 'IT Support', trend: 'up', change: '+1.2%' },
              { dept: 'Sales', trend: 'up', change: '+2.9%' }].
              map((row) => {
                const deptEmployees = employees.filter((e) => e.department === row.dept);
                const deptTotal = deptEmployees.reduce((sum, emp) => sum + emp.total, 0);
                const avgBalance = deptEmployees.length > 0 ? Math.round(deptTotal / deptEmployees.length) : 0;
                return (
                  <tr key={row.dept} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{row.dept}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{deptEmployees.length}</td>
                    {leaveTypes.slice(0, 5).map((type) =>
                    <td key={type.key} className={`px-4 py-3 text-sm text-center font-medium ${type.textColor}`}>
                        {deptEmployees.reduce((sum, emp) => sum + emp[type.key], 0)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">{deptTotal}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{avgBalance}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.trend === 'up' &&
                        <>
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">{row.change}</span>
                          </>
                        }
                        {row.trend === 'down' &&
                        <>
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">{row.change}</span>
                          </>
                        }
                        {row.trend === 'same' &&
                        <span className="text-sm text-gray-500">{row.change}</span>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}