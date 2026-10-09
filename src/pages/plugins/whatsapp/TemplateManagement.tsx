import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, EditIcon, EyeIcon } from 'lucide-react';
export function TemplateManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage WhatsApp message templates for automated
            communications
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Total Templates</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">6</p>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </div>
        </Card>
      </div>
      <Card title="Template Library">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search templates..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Categories'
              },
              {
                value: 'attendance',
                label: 'Attendance'
              },
              {
                value: 'fee',
                label: 'Fee'
              },
              {
                value: 'exam',
                label: 'Exam'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Template Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Language
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    attendance_absent_alert
                  </td>
                  <td className="py-3 px-4">Attendance</td>
                  <td className="py-3 px-4">English</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Approved</Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">fee_due_reminder</td>
                  <td className="py-3 px-4">Fee</td>
                  <td className="py-3 px-4">English</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Approved</Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    exam_schedule_notification
                  </td>
                  <td className="py-3 px-4">Exam</td>
                  <td className="py-3 px-4">English</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Pending</Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}