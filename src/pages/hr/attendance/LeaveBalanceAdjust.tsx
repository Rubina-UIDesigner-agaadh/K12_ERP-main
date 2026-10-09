import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Save,
  X,
  Plus,
  Minus,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  History,
  Search,
  RefreshCw,
  Info } from
'lucide-react';

export function LeaveBalanceAdjust() {
  const [action, setAction] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const adjustmentHistory = [
  { id: 1, date: '28 Jan 2024', type: 'CL', action: 'Add', qty: 2, by: 'Admin', reason: 'Annual credit correction' },
  { id: 2, date: '15 Jan 2024', type: 'SL', action: 'Deduct', qty: 1, by: 'HR Manager', reason: 'Duplicate entry removed' },
  { id: 3, date: '10 Jan 2024', type: 'EL', action: 'Add', qty: 5, by: 'Admin', reason: 'Carry forward from 2023' }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Balance Adjust
          </h1>
          <p className="text-sm text-gray-500">
            Single-entry correction for individual employee leave balance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Adjustment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Employee Selection">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search & Select Employee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID or department..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
              </div>
              <Select
                label="Select Employee"
                options={[
                { value: '', label: 'Choose an employee' },
                { value: 'EMP001', label: 'John Doe - EMP001 (Engineering)' },
                { value: 'EMP002', label: 'Jane Smith - EMP002 (HR)' },
                { value: 'EMP003', label: 'Robert Johnson - EMP003 (Finance)' },
                { value: 'EMP004', label: 'Emily Davis - EMP004 (Marketing)' },
                { value: 'EMP005', label: 'Michael Brown - EMP005 (Engineering)' },
                { value: 'EMP006', label: 'Sarah Wilson - EMP006 (Operations)' }]
                }
                defaultValue=""
                onChange={(e) => setSelectedEmployee(e.target.value)} />


              {selectedEmployee &&
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">JD</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-600">EMP001 • Senior Developer</p>
                      <p className="text-sm text-gray-500">Engineering Department</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Joined: 15 Mar 2022
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </Card>

          <Card title="Adjustment Details">
            <div className="space-y-4">
              <Select
                label="Leave Type"
                options={[
                { value: '', label: 'Select Leave Type' },
                { value: 'cl', label: 'Casual Leave (CL)' },
                { value: 'pl', label: 'Privilege Leave (PL)' },
                { value: 'sl', label: 'Sick Leave (SL)' },
                { value: 'el', label: 'Earned Leave (EL)' },
                { value: 'co', label: 'Comp-Off (CO)' },
                { value: 'ml', label: 'Maternity Leave (ML)' },
                { value: 'pl', label: 'Paternity Leave (PL)' },
                { value: 'lop', label: 'Loss of Pay (LOP)' }]
                }
                defaultValue="" />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAction('add')}
                    className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center gap-3 ${
                    action === 'add' ?
                    'border-green-500 bg-green-50 text-green-700' :
                    'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                    }>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    action === 'add' ? 'bg-green-100' : 'bg-gray-100'}`
                    }>
                      <Plus className={`w-5 h-5 ${action === 'add' ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Add / Credit</p>
                      <p className="text-xs opacity-75">Increase balance</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setAction('deduct')}
                    className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center gap-3 ${
                    action === 'deduct' ?
                    'border-red-500 bg-red-50 text-red-700' :
                    'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
                    }>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    action === 'deduct' ? 'bg-red-100' : 'bg-gray-100'}`
                    }>
                      <Minus className={`w-5 h-5 ${action === 'deduct' ? 'text-red-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Deduct / Debit</p>
                      <p className="text-xs opacity-75">Decrease balance</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity (Days)"
                  type="number"
                  placeholder="Enter number of days"
                  defaultValue=""
                  min="0.5"
                  step="0.5" />

                <Input
                  label="Effective Date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]} />

              </div>

              <Select
                label="Reason Category"
                options={[
                { value: '', label: 'Select Reason' },
                { value: 'correction', label: 'Balance Correction' },
                { value: 'annual_credit', label: 'Annual Leave Credit' },
                { value: 'carry_forward', label: 'Carry Forward Adjustment' },
                { value: 'policy_change', label: 'Policy Change' },
                { value: 'encashment', label: 'Leave Encashment' },
                { value: 'reversal', label: 'Leave Reversal' },
                { value: 'joining_prorata', label: 'Pro-rata (New Joining)' },
                { value: 'resignation', label: 'Resignation Settlement' },
                { value: 'other', label: 'Other' }]
                }
                defaultValue="" />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter detailed justification for this adjustment (mandatory)..."
                  required />

                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters required. This will be recorded in the audit log.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Send notification to employee
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  defaultChecked />

              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Notify reporting manager
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

              </div>
            </div>
          </Card>

          <Card title="Supporting Documents">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Attach supporting document (optional)
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 5MB
                </p>
                <Button variant="outline" className="mt-3">
                  Choose File
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Current Leave Balance">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-blue-100 text-blue-700">
                    CL
                  </span>
                  <span className="text-sm text-gray-700">Casual Leave</span>
                </div>
                <span className="text-sm font-bold text-gray-900">8 days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-green-100 text-green-700">
                    PL
                  </span>
                  <span className="text-sm text-gray-700">Privilege Leave</span>
                </div>
                <span className="text-sm font-bold text-gray-900">12 days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-orange-100 text-orange-700">
                    SL
                  </span>
                  <span className="text-sm text-gray-700">Sick Leave</span>
                </div>
                <span className="text-sm font-bold text-gray-900">5 days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-purple-100 text-purple-700">
                    EL
                  </span>
                  <span className="text-sm text-gray-700">Earned Leave</span>
                </div>
                <span className="text-sm font-bold text-gray-900">15 days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-teal-100 text-teal-700">
                    CO
                  </span>
                  <span className="text-sm text-gray-700">Comp-Off</span>
                </div>
                <span className="text-sm font-bold text-gray-900">3 days</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-6 flex items-center justify-center text-xs font-bold rounded bg-red-100 text-red-700">
                    LOP
                  </span>
                  <span className="text-sm text-gray-700">Loss of Pay</span>
                </div>
                <span className="text-sm font-bold text-red-600">2 days</span>
              </div>
              <div className="flex items-center justify-between py-3 bg-gray-50 rounded-lg px-3 mt-2">
                <span className="text-sm font-semibold text-gray-700">Total Available</span>
                <span className="text-lg font-bold text-blue-600">43 days</span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Balance
              </Button>
            </div>
          </Card>

          <Card title="Adjustment Preview">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${action === 'add' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action === 'add' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {action === 'add' ?
                    <Plus className="w-5 h-5 text-green-600" /> :

                    <Minus className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className={`font-semibold ${action === 'add' ? 'text-green-800' : 'text-red-800'}`}>
                      {action === 'add' ? 'Credit' : 'Debit'} Adjustment
                    </p>
                    <p className={`text-sm ${action === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                      Casual Leave (CL)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Balance:</span>
                    <span className="font-medium">8 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Adjustment:</span>
                    <span className={`font-medium ${action === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                      {action === 'add' ? '+' : '-'}2 days
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium text-gray-700">New Balance:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {action === 'add' ? '10' : '6'} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Review Before Saving
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This adjustment will be recorded in the audit log and cannot be automatically reversed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Recent Adjustments">
            <div className="space-y-3">
              {adjustmentHistory.map((item) =>
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-5 flex items-center justify-center text-xs font-bold rounded ${
                    item.action === 'Add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                    }>
                        {item.action === 'Add' ? '+' : '-'}{item.qty}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{item.reason}</p>
                  <p className="text-xs text-gray-400">By: {item.by}</p>
                </div>
              )}
              <Button variant="outline" className="w-full">
                <History className="w-4 h-4 mr-2" />
                View Full History
              </Button>
            </div>
          </Card>

          <Card title="Help & Guidelines">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Adjustments should only be made for genuine corrections or policy-based credits.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">
                  All adjustments are logged and may be subject to audit review.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">
                  For bulk adjustments, use the "Leave Balance Adjust Bulk" module.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Contact HR admin for queries regarding leave policies.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}