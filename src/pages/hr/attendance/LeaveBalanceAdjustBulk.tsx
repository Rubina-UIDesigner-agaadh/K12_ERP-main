import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Minus,
  Plus,
  AlertTriangle,
  CheckSquare,
  Square,
  Trash2,
  Eye } from
'lucide-react';

export function LeaveBalanceAdjustBulk() {
  const [importMethod, setImportMethod] = useState('manual');
  const [selectAll, setSelectAll] = useState(false);

  const employees = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', currentBalance: 12, selected: true },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', currentBalance: 8, selected: true },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', currentBalance: 15, selected: false },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', currentBalance: 10, selected: true },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', currentBalance: 6, selected: false },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', currentBalance: 14, selected: false },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', currentBalance: 9, selected: true },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', currentBalance: 11, selected: false }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Balance Adjust Bulk
          </h1>
          <p className="text-sm text-gray-500">
            Update leave balances for multiple employees at once
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
          <Button variant="primary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Apply Adjustments
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">156</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-green-600">4</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Plus className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Credit</p>
              <p className="text-2xl font-bold text-orange-600">+48</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Actions</p>
              <p className="text-2xl font-bold text-purple-600">4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Import Method">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setImportMethod('manual')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                importMethod === 'manual' ?
                'border-blue-500 bg-blue-50 text-blue-700' :
                'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                }>

                <Users className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Manual Selection</p>
              </button>
              <button
                onClick={() => setImportMethod('excel')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                importMethod === 'excel' ?
                'border-blue-500 bg-blue-50 text-blue-700' :
                'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                }>

                <FileSpreadsheet className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Excel Import</p>
              </button>
            </div>

            {importMethod === 'excel' &&
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop Excel file here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports .xlsx, .xls files up to 5MB
                </p>
                <Button variant="outline" className="mt-3">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            }

            {importMethod === 'manual' &&
            <div className="space-y-3">
                <Select
                label="Filter by Department"
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
                label="Filter by Designation"
                options={[
                { value: 'all', label: 'All Designations' },
                { value: 'manager', label: 'Manager' },
                { value: 'senior', label: 'Senior Level' },
                { value: 'junior', label: 'Junior Level' },
                { value: 'intern', label: 'Intern' }]
                }
                defaultValue="all" />

                <Select
                label="Employment Type"
                options={[
                { value: 'all', label: 'All Types' },
                { value: 'permanent', label: 'Permanent' },
                { value: 'contract', label: 'Contract' },
                { value: 'trainee', label: 'Trainee' }]
                }
                defaultValue="all" />

              </div>
            }
          </div>
        </Card>

        <Card title="Adjustment Settings">
          <div className="space-y-4">
            <Select
              label="Leave Type"
              options={[
              { value: '', label: 'Select Leave Type' },
              { value: 'casual', label: 'Casual Leave (CL)' },
              { value: 'sick', label: 'Sick Leave (SL)' },
              { value: 'earned', label: 'Earned Leave (EL)' },
              { value: 'privilege', label: 'Privilege Leave (PL)' },
              { value: 'compoff', label: 'Comp-Off' },
              { value: 'maternity', label: 'Maternity Leave' },
              { value: 'paternity', label: 'Paternity Leave' }]
              }
              defaultValue="casual" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment Type
              </label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-medium flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Credit
                </button>
                <button className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-200 bg-white text-gray-600 font-medium flex items-center justify-center gap-2 hover:border-gray-300">
                  <Minus className="w-4 h-4" />
                  Debit
                </button>
              </div>
            </div>
            <Input
              label="Adjustment Amount (Days)"
              type="number"
              defaultValue="12"
              placeholder="Enter number of days" />

            <Select
              label="Reason for Adjustment"
              options={[
              { value: '', label: 'Select Reason' },
              { value: 'yearly_reset', label: 'Yearly Reset / Annual Credit' },
              { value: 'policy_change', label: 'Policy Change' },
              { value: 'correction', label: 'Balance Correction' },
              { value: 'carry_forward', label: 'Carry Forward' },
              { value: 'encashment', label: 'Leave Encashment' },
              { value: 'joining', label: 'Pro-rata (New Joining)' },
              { value: 'other', label: 'Other' }]
              }
              defaultValue="yearly_reset" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Override Existing Balance
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Apply Pro-rata Calculation
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
          </div>
        </Card>

        <Card title="Remarks & Confirmation">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks / Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter remarks for this bulk adjustment..."
                defaultValue="Annual leave credit for FY 2024-25. As per company policy, all permanent employees are entitled to 12 days of Casual Leave." />

            </div>
            <Input
              label="Effective Date"
              type="date"
              defaultValue="2024-04-01" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Send Email Notification
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Require Manager Approval
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Review Before Applying
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This action will update leave balances for 4 selected employees. This cannot be undone easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Employee Selection">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <CheckSquare className="w-4 h-4 mr-2" />
                Select All
              </Button>
              <Button variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Deselect All
              </Button>
              <Button variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)} />

                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjustment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) =>
                <tr key={employee.id} className={`hover:bg-gray-50 ${employee.selected ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked={employee.selected} />

                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{employee.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {employee.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{employee.currentBalance} days</span>
                    </td>
                    <td className="px-4 py-3">
                      {employee.selected ?
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          +12 days
                        </span> :

                    <span className="text-sm text-gray-400">—</span>
                    }
                    </td>
                    <td className="px-4 py-3">
                      {employee.selected ?
                    <span className="text-sm font-bold text-blue-600">{employee.currentBalance + 12} days</span> :

                    <span className="text-sm text-gray-400">—</span>
                    }
                    </td>
                    <td className="px-4 py-3">
                      {employee.selected ?
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span> :

                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                          Not Selected
                        </span>
                    }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1-8</span> of <span className="font-medium">156</span> employees
              </p>
              <Select
                options={[
                { value: '10', label: '10 per page' },
                { value: '25', label: '25 per page' },
                { value: '50', label: '50 per page' },
                { value: '100', label: '100 per page' }]
                }
                defaultValue="10" />

            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
              <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">2</span>
              <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">3</span>
              <span className="px-3 py-1 text-gray-600">...</span>
              <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">16</span>
              <Button variant="outline">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Adjustment Summary">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Leave Type</p>
              <p className="text-lg font-bold text-gray-900">Casual Leave (CL)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Adjustment Amount</p>
              <p className="text-lg font-bold text-green-600">+12 Days</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Employees Affected</p>
              <p className="text-lg font-bold text-gray-900">4 Employees</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Days to Credit</p>
              <p className="text-lg font-bold text-blue-600">48 Days</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Employees Preview</h4>
            <div className="flex flex-wrap gap-2">
              {employees.filter((e) => e.selected).map((employee) =>
              <div key={employee.id} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">
                      {employee.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-blue-800">{employee.name}</span>
                  <span className="text-xs text-blue-600">({employee.currentBalance} → {employee.currentBalance + 12})</span>
                  <button className="text-blue-400 hover:text-blue-600">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline">
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Changes
            </Button>
            <Button variant="primary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Adjustments
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}