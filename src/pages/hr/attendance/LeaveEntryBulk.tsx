import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Save,
  X,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Info,
  FileText,
  Trash2,
  Check } from
'lucide-react';
interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  avatar: string;
}
const ALL_EMPLOYEES: Employee[] = [
{
  id: 'EMP001',
  name: 'John Doe',
  department: 'Engineering',
  designation: 'Senior Developer',
  avatar: 'JD'
},
{
  id: 'EMP002',
  name: 'Jane Smith',
  department: 'HR',
  designation: 'HR Manager',
  avatar: 'JS'
},
{
  id: 'EMP003',
  name: 'Robert Johnson',
  department: 'Finance',
  designation: 'Accountant',
  avatar: 'RJ'
},
{
  id: 'EMP004',
  name: 'Emily Davis',
  department: 'Marketing',
  designation: 'Marketing Lead',
  avatar: 'ED'
},
{
  id: 'EMP005',
  name: 'Michael Brown',
  department: 'Engineering',
  designation: 'Developer',
  avatar: 'MB'
},
{
  id: 'EMP006',
  name: 'Sarah Wilson',
  department: 'Operations',
  designation: 'Operations Manager',
  avatar: 'SW'
},
{
  id: 'EMP007',
  name: 'David Lee',
  department: 'IT Support',
  designation: 'IT Administrator',
  avatar: 'DL'
},
{
  id: 'EMP008',
  name: 'Lisa Anderson',
  department: 'Sales',
  designation: 'Sales Executive',
  avatar: 'LA'
},
{
  id: 'EMP009',
  name: 'James Taylor',
  department: 'Engineering',
  designation: 'Tech Lead',
  avatar: 'JT'
},
{
  id: 'EMP010',
  name: 'Jennifer Martinez',
  department: 'HR',
  designation: 'HR Executive',
  avatar: 'JM'
},
{
  id: 'EMP011',
  name: 'Christopher Garcia',
  department: 'Engineering',
  designation: 'Developer',
  avatar: 'CG'
},
{
  id: 'EMP012',
  name: 'Amanda Robinson',
  department: 'Engineering',
  designation: 'QA Engineer',
  avatar: 'AR'
},
{
  id: 'EMP013',
  name: 'Kevin White',
  department: 'Finance',
  designation: 'Senior Accountant',
  avatar: 'KW'
},
{
  id: 'EMP014',
  name: 'Michelle Harris',
  department: 'Marketing',
  designation: 'Content Writer',
  avatar: 'MH'
},
{
  id: 'EMP015',
  name: 'Daniel Clark',
  department: 'IT Support',
  designation: 'Network Admin',
  avatar: 'DC'
}];

const DEPARTMENTS = [
'All Departments',
'Engineering',
'HR',
'Finance',
'Marketing',
'Operations',
'IT Support',
'Sales'];

export function LeaveEntryBulk() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('2024-03-25');
  const [toDate, setToDate] = useState('2024-03-27');
  const [leaveDuration, setLeaveDuration] = useState('full');
  const [reason, setReason] = useState(
    'Team offsite event - Annual team building activity'
  );
  const [notifyTo, setNotifyTo] = useState('all');
  const [sendEmail, setSendEmail] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const filteredEmployees = useMemo(() => {
    return ALL_EMPLOYEES.filter((emp) => {
      const matchesDept =
      selectedDept === 'All Departments' || emp.department === selectedDept;
      const matchesSearch =
      searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [searchQuery, selectedDept]);
  const selectedEmployees = useMemo(() => {
    return ALL_EMPLOYEES.filter((emp) => selectedIds.has(emp.id));
  }, [selectedIds]);
  const toggleEmployee = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    setSelectedIds(new Set(filteredEmployees.map((e) => e.id)));
  };
  const clearAll = () => {
    setSelectedIds(new Set());
  };
  const removeEmployee = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const calculateLeaveDays = () => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return (
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  };
  const leaveDays = calculateLeaveDays();
  const totalLeaveDays = selectedIds.size * leaveDays;
  const avatarColors = [
  'from-teal-500 to-teal-700',
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-green-500 to-green-700',
  'from-orange-500 to-orange-700'];

  const getAvatarColor = (id: string) => {
    const index = parseInt(id.replace('EMP', '')) % avatarColors.length;
    return avatarColors[index];
  };
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Entry Bulk</h1>
          <p className="text-sm text-gray-500">
            Apply leave for multiple employees at once
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Template
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4 mr-2" />
            Submit Leave Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">
                {ALL_EMPLOYEES.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Selected</p>
              <p className="text-2xl font-bold text-teal-600">
                {selectedIds.size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Leave Days</p>
              <p className="text-2xl font-bold text-orange-600">{leaveDays}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Leave Days</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalLeaveDays}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Leave Details</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">

                <option value="">Select Leave Type</option>
                <option value="cl">Casual Leave (CL)</option>
                <option value="pl">Privilege Leave (PL)</option>
                <option value="sl">Sick Leave (SL)</option>
                <option value="el">Earned Leave (EL)</option>
                <option value="co">Comp-Off (CO)</option>
                <option value="lop">Loss of Pay (LOP)</option>
                <option value="holiday">Company Holiday</option>
                <option value="optional">Optional Holiday</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Duration
              </label>
              <select
                value={leaveDuration}
                onChange={(e) => setLeaveDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">

                <option value="full">Full Day</option>
                <option value="half_first">First Half</option>
                <option value="half_second">Second Half</option>
              </select>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Total Working Days:
                </span>
                <span className="font-bold text-teal-600">
                  {leaveDays} days
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Excluding weekends and holidays
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                rows={3}
                placeholder="Enter reason for bulk leave application..."
                value={reason}
                onChange={(e) => setReason(e.target.value)} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notify To
              </label>
              <select
                value={notifyTo}
                onChange={(e) => setNotifyTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">

                <option value="all">All Reporting Managers</option>
                <option value="single">Single Manager</option>
                <option value="hr">HR Only</option>
                <option value="none">No Notification</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">
                  Auto-approve for eligible employees
                </span>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${autoApprove ? 'bg-teal-600' : 'bg-gray-300'}`}
                  onClick={() => setAutoApprove(!autoApprove)}>

                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${autoApprove ? 'translate-x-5' : 'translate-x-0.5'}`} />

                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">
                  Send email notification
                </span>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${sendEmail ? 'bg-teal-600' : 'bg-gray-300'}`}
                  onClick={() => setSendEmail(!sendEmail)}>

                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${sendEmail ? 'translate-x-5' : 'translate-x-0.5'}`} />

                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Employee Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Employee Selection
              </h3>
              {selectedIds.size > 0 &&
              <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                  {selectedIds.size} selected
                </span>
              }
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />

              </div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">

                {DEPARTMENTS.map((d) =>
                <option key={d} value={d}>
                    {d}
                  </option>
                )}
              </select>
            </div>

            {/* Selected chips */}
            {selectedIds.size > 0 &&
            <div className="flex flex-wrap gap-2 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <span className="text-xs font-medium text-teal-700 self-center">
                  Selected:
                </span>
                {selectedEmployees.slice(0, 8).map((emp) =>
              <span
                key={emp.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-teal-200 text-teal-800 rounded-full text-xs font-medium">

                    {emp.name.split(' ')[0]}
                    <button
                  onClick={() => removeEmployee(emp.id)}
                  className="hover:text-red-600 transition-colors">

                      <X className="w-3 h-3" />
                    </button>
                  </span>
              )}
                {selectedIds.size > 8 &&
              <span className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                    +{selectedIds.size - 8} more
                  </span>
              }
                <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-800 font-medium ml-auto">

                  Clear all
                </button>
              </div>
            }

            {/* Employee List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  {filteredEmployees.length} employees
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={selectAll}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium">

                    Select All
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium">

                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {filteredEmployees.length === 0 ?
                <div className="py-10 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No employees found</p>
                  </div> :

                filteredEmployees.map((employee) => {
                  const isSelected = selectedIds.has(employee.id);
                  return (
                    <div
                      key={employee.id}
                      onClick={() => toggleEmployee(employee.id)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>

                        {/* Checkbox */}
                        <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}>

                          {isSelected &&
                        <Check className="w-3 h-3 text-white" />
                        }
                        </div>
                        {/* Avatar */}
                        <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(employee.id)} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>

                          {employee.avatar}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                          className={`text-sm font-medium truncate ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>

                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {employee.id} • {employee.department} •{' '}
                            {employee.designation}
                          </p>
                        </div>
                        {/* Selected indicator */}
                        {isSelected &&
                      <span className="text-xs text-teal-600 font-medium flex-shrink-0">
                            Selected
                          </span>
                      }
                      </div>);

                })
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Employees Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Selected Employees Summary
          </h3>
          {selectedIds.size > 0 &&
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800 font-medium">

              Clear Selection
            </button>
          }
        </div>
        <div className="p-6">
          {selectedIds.size === 0 ?
          <div className="text-center py-10">
              <Users className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No employees selected</p>
              <p className="text-sm text-gray-400 mt-1">
                Select employees from the list above to apply bulk leave
              </p>
            </div> :

          <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        After Deduction
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEmployees.map((employee) =>
                  <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                          className={`w-8 h-8 bg-gradient-to-br ${getAvatarColor(employee.id)} rounded-full flex items-center justify-center`}>

                              <span className="text-xs font-medium text-white">
                                {employee.avatar}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {employee.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {employee.department}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                            {leaveType ? leaveType.toUpperCase() : 'CL'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">
                          {leaveDays} days
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                          8 days
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-green-600">
                          {Math.max(0, 8 - leaveDays)} days
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Eligible
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                        onClick={() => removeEmployee(employee.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove">

                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{selectedIds.size}</span>{' '}
                    employees selected
                  </p>
                  <span className="text-gray-300">|</span>
                  <p className="text-sm text-gray-600">
                    Total Leave Days:{' '}
                    <span className="font-medium text-teal-600">
                      {totalLeaveDays}
                    </span>
                  </p>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Balances
                </button>
              </div>
            </>
          }
        </div>
      </div>

      {/* Validation & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Validation Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Eligible Employees
                </p>
                <p className="text-xs text-green-600">
                  Have sufficient leave balance
                </p>
              </div>
              <span className="text-lg font-bold text-green-600">
                {selectedIds.size}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Low Balance
                </p>
                <p className="text-xs text-yellow-600">
                  Balance will go below 2 days
                </p>
              </div>
              <span className="text-lg font-bold text-yellow-600">0</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <X className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Insufficient Balance
                </p>
                <p className="text-xs text-red-600">
                  Cannot apply - will be LOP
                </p>
              </div>
              <span className="text-lg font-bold text-red-600">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 text-gray-500" />
              Import from Excel
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-500" />
              Check Holiday Calendar
            </button>
            <button
              onClick={clearAll}
              className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">

              <RefreshCw className="w-4 h-4 text-gray-500" />
              Reset Selection
            </button>
            <div className="mt-3 flex items-start gap-2 p-3 bg-teal-50 rounded-lg border border-teal-100">
              <Info className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-teal-700">
                Use the search and department filter to quickly find and select
                employees.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Approval Workflow
          </h3>
          <div className="space-y-3">
            {[
            {
              step: 1,
              label: 'Submit Request',
              desc: 'Bulk leave application submitted',
              done: true
            },
            {
              step: 2,
              label: 'Manager Approval',
              desc: 'Respective managers notified',
              done: false
            },
            {
              step: 3,
              label: 'HR Verification',
              desc: 'Balance deduction applied',
              done: false
            },
            {
              step: 4,
              label: 'Completed',
              desc: 'Leave recorded in system',
              done: false
            }].
            map((item, index) =>
            <div key={item.step}>
                <div className="flex items-center gap-3">
                  <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}>

                    {item.done ?
                  <Check className="w-4 h-4" /> :

                  <span className="text-sm font-bold text-gray-500">
                        {item.step}
                      </span>
                  }
                  </div>
                  <div className="flex-1">
                    <p
                    className={`text-sm font-medium ${item.done ? 'text-teal-700' : 'text-gray-700'}`}>

                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                {index < 3 &&
              <div className="ml-4 border-l-2 border-gray-200 h-3 mt-1" />
              }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pb-4">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <FileText className="w-4 h-4 mr-2" />
          Save as Draft
        </button>
        <button className="inline-flex items-center px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors">
          <Save className="w-4 h-4 mr-2" />
          Submit Leave Request
        </button>
      </div>
    </div>);

}