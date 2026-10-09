import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { CheckCircle, XCircle, Calendar, User, Clock, FileText, Filter, Download } from 'lucide-react';

export function SettleDays() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Settle Days
          </h1>
          <p className="text-sm text-gray-500">
            Adjust comp-offs and working holidays for employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <Filter className="w-4 h-4 mr-2" />
            Filter Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Settlement Criteria">
          <div className="space-y-4">
            <Select
              label="Select Employee"
              options={[
              {
                value: '',
                label: 'Choose Employee'
              },
              {
                value: 'emp001',
                label: 'John Doe - EMP001'
              },
              {
                value: 'emp002',
                label: 'Jane Smith - EMP002'
              },
              {
                value: 'emp003',
                label: 'Robert Johnson - EMP003'
              },
              {
                value: 'emp004',
                label: 'Emily Davis - EMP004'
              }]
              }
              defaultValue="" />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="From Date"
                type="date"
                defaultValue="2024-01-01" />

              <Input
                label="To Date"
                type="date"
                defaultValue="2024-01-31" />

            </div>
            <Select
              label="Settlement Type"
              options={[
              {
                value: 'compoff',
                label: 'Comp-Off Days'
              },
              {
                value: 'holiday',
                label: 'Working Holidays'
              },
              {
                value: 'both',
                label: 'Both'
              }]
              }
              defaultValue="both" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Include Pending Requests
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
          </div>
        </Card>

        <Card title="Employee Summary">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Comp-Offs</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Working Holidays</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Used Days</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-purple-600">6</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600">Department: <span className="font-medium">Engineering</span></p>
              <p className="text-sm text-gray-600">Designation: <span className="font-medium">Senior Developer</span></p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Days Eligible for Settlement">
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Worked
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">01 Jan 2024</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Monday</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Comp-Off
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">Weekend Support</td>
                  <td className="px-4 py-3 text-sm text-gray-900">9.5</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">31 Mar 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">15 Jan 2024</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Monday</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Holiday
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">Pongal Festival</td>
                  <td className="px-4 py-3 text-sm text-gray-900">8.0</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">15 Apr 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">20 Jan 2024</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Saturday</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Comp-Off
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">Project Deployment</td>
                  <td className="px-4 py-3 text-sm text-gray-900">10.0</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">20 Apr 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-gray-600">
              Selected <span className="font-medium">2</span> of <span className="font-medium">3</span> eligible days
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg">
                Total Days to Settle: 2
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Settlement Details">
          <div className="space-y-4">
            <Select
              label="Settlement Action"
              options={[
              {
                value: 'convert',
                label: 'Convert to Leave Balance'
              },
              {
                value: 'encash',
                label: 'Encash Days'
              },
              {
                value: 'extend',
                label: 'Extend Validity'
              }]
              }
              defaultValue="convert" />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Days to Settle"
                type="number"
                defaultValue="2" />

              <Input
                label="Validity Extension (Days)"
                type="number"
                defaultValue="30" />

            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Auto-approve Similar Requests
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

            </div>
          </div>
        </Card>

        <Card title="Remarks & Actions">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter remarks for this settlement..." />

            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Send Notification to Employee
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button variant="primary" className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Settlement
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}