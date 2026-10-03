import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Search, Upload, Save, History } from 'lucide-react';
export function StudentLeaveRequest() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Leave Request
          </h1>
          <p className="text-sm text-gray-500">
            Apply for student leave and upload supporting documents
          </p>
        </div>
        <Button variant="outline">
          <History className="w-4 h-4 mr-2" />
          View History
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Leave Application">
            <div className="space-y-6">
              {/* Student Search */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    label="Search Student"
                    placeholder="Enter Name or GR No"
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

                </div>
                <Button>Search</Button>
              </div>

              {/* Student Details (Placeholder) */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-blue-900">Rahul Sharma</p>
                  <p className="text-sm text-blue-700">
                    Class: 10-A • GR: 2023001
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 uppercase">Attendance</p>
                  <p className="font-bold text-blue-900">92%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Leave Type"
                  options={[
                  {
                    value: 'sick',
                    label: 'Sick Leave'
                  },
                  {
                    value: 'casual',
                    label: 'Casual Leave'
                  },
                  {
                    value: 'emergency',
                    label: 'Emergency Leave'
                  }]
                  } />

                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" label="From Date" />
                  <Input type="date" label="To Date" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Leave
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter detailed reason..." />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments (Medical Certificate etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JPG up to 5MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline">Save Draft</Button>
                <Button variant="primary">Submit Request</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Leave Policy Summary">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Sick Leave Limit</span>
                <span className="font-medium">10 Days/Year</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Casual Leave Limit</span>
                <span className="font-medium">5 Days/Term</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Document Required</span>
                <span className="font-medium">&gt; 2 Days</span>
              </div>
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-xs mt-4">
                Note: Leaves exceeding 3 days require Principal's approval.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}