import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Search,
  Save,
  RotateCcw,
  UserCheck,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  History,
  FileText,
  UserX,
  Shield,
  Download,
  Eye,
  Trash2 } from
'lucide-react';

export function EmployeeAttendanceAdmin() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Attendance Admin
          </h1>
          <p className="text-sm text-gray-500">
            Administrative intervention for manual attendance corrections and adjustments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            View Audit Log
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Corrections
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Administrative Access</h3>
            <p className="text-sm text-yellow-700 mt-1">
              All changes made on this page are logged for audit purposes. Please ensure you have proper authorization and provide detailed reasons for any corrections.
            </p>
          </div>
        </div>
      </div>

      {/* Employee Search Section */}
      <Card title="Search Employee Record">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Search Employee"
                placeholder="Enter employee name, ID, or email..."
                icon={<Search className="w-4 h-4" />} />

            </div>
            <Select
              label="Department"
              options={[
              { value: 'all', label: 'All Departments' },
              { value: 'it', label: 'IT Department' },
              { value: 'hr', label: 'Human Resources' },
              { value: 'finance', label: 'Finance' },
              { value: 'operations', label: 'Operations' },
              { value: 'marketing', label: 'Marketing' }]
              }
              defaultValue="all" />

            <Input
              label="Select Date"
              type="date"
              defaultValue="2024-01-15" />

          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
            <Button variant="primary">
              <Search className="w-4 h-4 mr-2" />
              Search Records
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Details Card */}
        <Card title="Employee Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-blue-600">JA</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">John Anderson</h3>
                <p className="text-sm text-gray-500">EMP-2024-001</p>
                <p className="text-sm text-gray-500">IT Department</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">john.anderson@company.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Designation</span>
                <span className="text-sm font-medium text-gray-900">Senior Developer</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reporting Manager</span>
                <span className="text-sm font-medium text-gray-900">Sarah Williams</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shift Timing</span>
                <span className="text-sm font-medium text-gray-900">9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Attendance Record */}
        <Card title="Current Attendance Record">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">15 January 2024</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Current In Time</span>
                  <p className="font-medium text-gray-900">--:--</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Current Out Time</span>
                  <p className="font-medium text-gray-900">--:--</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Working Hours</span>
                  <p className="font-medium text-gray-900">0 hrs</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Current Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Biometric Captured</span>
                <span className="text-red-600 font-medium">No</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Leave Applied</span>
                <span className="text-red-600 font-medium">No</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Holiday</span>
                <span className="text-red-600 font-medium">No</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly Summary */}
        <Card title="Monthly Summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Month</span>
              <span className="font-medium text-gray-900">January 2024</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-xs text-green-700">Present Days</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-xs text-red-700">Absent Days</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">5</p>
                <p className="text-xs text-yellow-700">Late Arrivals</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">2</p>
                <p className="text-xs text-blue-700">Half Days</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">Corrections Made</span>
              <span className="font-medium text-orange-600">1</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Correction Form */}
      <Card title="Attendance Correction Form">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Time Correction */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Time Correction
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Corrected In Time"
                  type="time"
                  defaultValue="09:00" />

                <Input
                  label="Corrected Out Time"
                  type="time"
                  defaultValue="18:00" />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Break Start Time"
                  type="time"
                  defaultValue="13:00" />

                <Input
                  label="Break End Time"
                  type="time"
                  defaultValue="14:00" />

              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Calculated Working Hours</span>
                  <span className="font-semibold text-blue-800">8 hrs 00 mins</span>
                </div>
              </div>
            </div>

            {/* Right Column - Status Change */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                Status Change
              </h3>
              <Select
                label="Change Attendance Status"
                options={[
                { value: 'present', label: 'Present - Full Day' },
                { value: 'present_half', label: 'Present - Half Day' },
                { value: 'absent', label: 'Absent' },
                { value: 'leave', label: 'On Leave' },
                { value: 'wfh', label: 'Work From Home' },
                { value: 'on_duty', label: 'On Duty / Official Visit' },
                { value: 'comp_off', label: 'Compensatory Off' }]
                }
                defaultValue="present" />

              <Select
                label="Correction Type"
                options={[
                { value: 'missed_punch', label: 'Missed Punch' },
                { value: 'biometric_failure', label: 'Biometric Failure' },
                { value: 'system_error', label: 'System Error' },
                { value: 'power_outage', label: 'Power Outage' },
                { value: 'manager_approval', label: 'Manager Approved Exception' },
                { value: 'other', label: 'Other' }]
                }
                defaultValue="missed_punch" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Mark as Late Arrival
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Mark as Early Departure
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

              </div>
            </div>
          </div>

          {/* Reason and Documentation */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-orange-600" />
              Reason & Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Correction <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="Please provide a detailed reason for this attendance correction..."
                    defaultValue="Employee was present but biometric device was not working. Verified with security gate pass records.">
                  </textarea>
                </div>
                <Input
                  label="Reference Document / Ticket Number"
                  placeholder="e.g., HR-TICKET-2024-001"
                  defaultValue="HR-TICKET-2024-045" />

              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Supporting Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag & drop files or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <Select
                  label="Verified By"
                  options={[
                  { value: 'security', label: 'Security Team' },
                  { value: 'manager', label: 'Reporting Manager' },
                  { value: 'hr', label: 'HR Department' },
                  { value: 'it', label: 'IT Support' },
                  { value: 'self', label: 'Self Declaration' }]
                  }
                  defaultValue="security" />

              </div>
            </div>
          </div>

          {/* Authorization */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-purple-600" />
              Authorization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Admin Name"
                defaultValue="Admin User"
                disabled />

              <Input
                label="Admin ID"
                defaultValue="ADMIN-001"
                disabled />

              <Input
                label="Correction Date & Time"
                defaultValue="16 Jan 2024, 10:30 AM"
                disabled />

            </div>
            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1" />

              <label className="text-sm text-gray-600">
                I confirm that this correction is made with proper authorization and the information provided is accurate. I understand that all changes are logged for audit purposes.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Changes
            </Button>
            <Button variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Apply Correction
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Corrections History */}
      <Card title="Recent Corrections History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Original Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Corrected Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Correction Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Corrected By</th>
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
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    14 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">Biometric Failure</span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">Admin User</div>
                    <div className="text-gray-500">15 Jan, 09:30 AM</div>
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
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    13 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Half Day
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Full Day
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">Missed Punch</span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">HR Manager</div>
                    <div className="text-gray-500">14 Jan, 02:15 PM</div>
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
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    12 Jan 2024
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <UserCheck className="w-3 h-3 mr-1" />
                    WFH
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">Manager Approved</span>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">Admin User</div>
                    <div className="text-gray-500">13 Jan, 11:00 AM</div>
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
            Showing 1-3 of 28 corrections
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

      {/* Bottom Section - Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Correction Statistics */}
        <Card title="Correction Statistics">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Corrections (This Month)</span>
              <span className="font-semibold text-gray-900">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Absent to Present</span>
              <span className="font-semibold text-green-600">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Corrections</span>
              <span className="font-semibold text-blue-600">10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status Changes</span>
              <span className="font-semibold text-orange-600">3</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Most Common Reason</span>
                <span className="text-sm font-medium text-gray-900">Biometric Failure</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Requests */}
        <Card title="Pending Correction Requests">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-800">DM</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">David Martinez</p>
                  <p className="text-xs text-gray-500">10 Jan 2024 - Absent to Present</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-800">LP</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Lisa Parker</p>
                  <p className="text-xs text-gray-500">11 Jan 2024 - Time Correction</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-800">RK</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Robert Kim</p>
                  <p className="text-xs text-gray-500">12 Jan 2024 - WFH Request</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button variant="outline" className="w-full">
              View All Pending Requests (5)
            </Button>
          </div>
        </Card>

        {/* Quick Settings */}
        <Card title="Admin Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Require Manager Approval
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
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
                Mandatory Reason Field
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Allow Backdated Corrections
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
            <Input
              label="Max Backdated Days Allowed"
              type="number"
              defaultValue="7" />

            <Select
              label="Default Correction Type"
              options={[
              { value: 'missed_punch', label: 'Missed Punch' },
              { value: 'biometric_failure', label: 'Biometric Failure' },
              { value: 'system_error', label: 'System Error' }]
              }
              defaultValue="missed_punch" />

          </div>
        </Card>
      </div>
    </div>);

}