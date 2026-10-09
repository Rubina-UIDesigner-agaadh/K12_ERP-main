import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Search,
  Save,
  RotateCcw,
  PlusCircle,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  History,
  FileText,
  Info,
  Download,
  Eye,
  Edit3,
  Trash2,
  Gift,
  Award,
  TrendingUp,
  Briefcase,
  UserPlus,
  RefreshCw } from
'lucide-react';

export function LeaveBalanceAdd() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Balance Add
          </h1>
          <p className="text-sm text-gray-500">
            Credit new leave balance to employees with validity period
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Credit History
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Bulk Credit
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Leave Credit Information</h3>
            <p className="text-sm text-blue-700 mt-1">
              Use this form to manually credit leave days to employee accounts. Credited leaves will be available for the employee to apply within the specified validity period. All transactions are logged for audit purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Credit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Credit Leave Balance">
            <div className="space-y-6">
              {/* Employee Selection */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Employee Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Employee <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search by name, employee ID, or email..." />

                    </div>
                  </div>
                  <Select
                    label="Department Filter"
                    options={[
                    { value: 'all', label: 'All Departments' },
                    { value: 'it', label: 'IT Department' },
                    { value: 'hr', label: 'Human Resources' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'operations', label: 'Operations' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'sales', label: 'Sales' }]
                    }
                    defaultValue="all" />

                  <Select
                    label="Branch Filter"
                    options={[
                    { value: 'all', label: 'All Branches' },
                    { value: 'hq', label: 'Head Office' },
                    { value: 'branch1', label: 'Branch - North' },
                    { value: 'branch2', label: 'Branch - South' },
                    { value: 'branch3', label: 'Branch - East' }]
                    }
                    defaultValue="all" />

                </div>

                {/* Selected Employee Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">JA</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">John Anderson</h4>
                      <p className="text-sm text-gray-500">EMP-2024-001 • Senior Developer</p>
                      <p className="text-sm text-gray-500">IT Department • Head Office</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Joined: 15 Jan 2023</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Type Selection */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  Leave Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Select Leave Type"
                    options={[
                    { value: '', label: '-- Select Leave Type --' },
                    { value: 'casual', label: 'Casual Leave (CL)' },
                    { value: 'sick', label: 'Sick Leave (SL)' },
                    { value: 'earned', label: 'Earned Leave (EL)' },
                    { value: 'privilege', label: 'Privilege Leave (PL)' },
                    { value: 'compensatory', label: 'Compensatory Off (CO)' },
                    { value: 'maternity', label: 'Maternity Leave' },
                    { value: 'paternity', label: 'Paternity Leave' },
                    { value: 'bereavement', label: 'Bereavement Leave' },
                    { value: 'special', label: 'Special Leave' }]
                    }
                    defaultValue="casual" />

                  <Input
                    label="Number of Days to Credit"
                    type="number"
                    placeholder="Enter number of days"
                    defaultValue="5" />

                </div>

                {/* Leave Type Info */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">Casual Leave (CL)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div>
                          <span className="text-xs text-green-600">Max Annual</span>
                          <p className="text-sm font-medium text-green-800">12 days</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-600">Carry Forward</span>
                          <p className="text-sm font-medium text-green-800">No</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-600">Encashable</span>
                          <p className="text-sm font-medium text-green-800">No</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-600">Credit Frequency</span>
                          <p className="text-sm font-medium text-green-800">Yearly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  Validity Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Valid From Date"
                    type="date"
                    defaultValue="2024-01-01" />

                  <Input
                    label="Valid To Date"
                    type="date"
                    defaultValue="2024-12-31" />

                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700">
                      Validity Period: <strong>365 days</strong> (01 Jan 2024 - 31 Dec 2024)
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit Reason */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Credit Details
                </h3>
                <Select
                  label="Credit Reason"
                  options={[
                  { value: '', label: '-- Select Reason --' },
                  { value: 'annual_credit', label: 'Annual Leave Credit' },
                  { value: 'quarterly_credit', label: 'Quarterly Leave Credit' },
                  { value: 'joining_bonus', label: 'Joining Bonus' },
                  { value: 'promotion', label: 'Promotion Benefit' },
                  { value: 'special_award', label: 'Special Award' },
                  { value: 'compensatory', label: 'Compensatory Credit' },
                  { value: 'policy_change', label: 'Policy Change Adjustment' },
                  { value: 'correction', label: 'Balance Correction' },
                  { value: 'other', label: 'Other' }]
                  }
                  defaultValue="annual_credit" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="Enter remarks or additional notes for this credit transaction..."
                    defaultValue="Annual casual leave credit for the year 2024 as per company policy.">
                  </textarea>
                </div>
                <Input
                  label="Reference Number (Optional)"
                  placeholder="e.g., HR-REF-2024-001" />

              </div>

              {/* Notification Settings */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-600" />
                  Notification Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Notify Employee via Email
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Notify Employee via SMS
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Notify Reporting Manager
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Send In-App Notification
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="primary">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Credit Balance
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Current Leave Balance */}
          <Card title="Current Leave Balance">
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500">John Anderson</p>
                <p className="text-xs text-gray-400">EMP-2024-001</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700">CL</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Casual Leave</span>
                  </div>
                  <span className="font-bold text-blue-600">5 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">SL</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Sick Leave</span>
                  </div>
                  <span className="font-bold text-green-600">8 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-700">EL</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Earned Leave</span>
                  </div>
                  <span className="font-bold text-purple-600">12 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-700">CO</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Comp Off</span>
                  </div>
                  <span className="font-bold text-orange-600">2 days</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Balance</span>
                  <span className="text-lg font-bold text-gray-900">27 days</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Leave Summary */}
          <Card title="Leave Usage Summary">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-gray-500">Year 2024</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-green-600">32</p>
                  <p className="text-xs text-green-700">Total Credited</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-red-600">5</p>
                  <p className="text-xs text-red-700">Total Used</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">27</p>
                  <p className="text-xs text-blue-700">Available</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-yellow-600">2</p>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Full History
              </Button>
            </div>
          </Card>

          {/* Quick Credit Templates */}
          <Card title="Quick Credit Templates">
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Annual Credit</p>
                  <p className="text-xs text-gray-500">CL: 12, SL: 12, EL: 15</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quarterly Credit</p>
                  <p className="text-xs text-gray-500">CL: 3, SL: 3</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Joiner Credit</p>
                  <p className="text-xs text-gray-500">Pro-rata calculation</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Promotion Bonus</p>
                  <p className="text-xs text-gray-500">EL: 5 days bonus</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Policy Info */}
          <Card title="Leave Policy Quick Info">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-600">Casual leave cannot be carried forward</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-600">Earned leave can be encashed</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-600">Max accumulation: 60 days EL</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-sm text-gray-600">Sick leave requires medical certificate after 2 days</span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                <FileText className="w-4 h-4 mr-2" />
                View Full Policy
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Credit History */}
      <Card title="Recent Leave Credit History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Leave Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Days Credited</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Valid From</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Valid To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Credited By</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Credit Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Sarah Williams</div>
                    <div className="text-sm text-gray-500">EMP-2024-002</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Casual Leave
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">+12 days</span>
                </td>
                <td className="py-3 px-4 text-gray-700">01 Jan 2024</td>
                <td className="py-3 px-4 text-gray-700">31 Dec 2024</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">Admin User</div>
                    <div className="text-gray-500">HR Department</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    01 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-500">EMP-2024-003</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Sick Leave
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">+12 days</span>
                </td>
                <td className="py-3 px-4 text-gray-700">01 Jan 2024</td>
                <td className="py-3 px-4 text-gray-700">31 Dec 2024</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">Admin User</div>
                    <div className="text-gray-500">HR Department</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    01 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Emily Johnson</div>
                    <div className="text-sm text-gray-500">EMP-2024-004</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Earned Leave
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">+15 days</span>
                </td>
                <td className="py-3 px-4 text-gray-700">01 Jan 2024</td>
                <td className="py-3 px-4 text-gray-700">31 Dec 2024</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">HR Manager</div>
                    <div className="text-gray-500">HR Department</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    01 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">David Martinez</div>
                    <div className="text-sm text-gray-500">EMP-2024-005</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Compensatory Off
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">+2 days</span>
                </td>
                <td className="py-3 px-4 text-gray-700">15 Jan 2024</td>
                <td className="py-3 px-4 text-gray-700">15 Apr 2024</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">Admin User</div>
                    <div className="text-gray-500">HR Department</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    15 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1-4 of 156 credit transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="primary" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Bottom Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="This Month's Credits">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">245</p>
              <p className="text-sm text-gray-500">Total Days Credited</p>
            </div>
          </div>
        </Card>
        <Card title="Employees Credited">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">52</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </Card>
        <Card title="Pending Credits">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500">Awaiting Approval</p>
            </div>
          </div>
        </Card>
        <Card title="Credit Reversals">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}