import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, EditIcon } from 'lucide-react';
export function DltTemplateManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            DLT & Template Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage DLT-registered SMS templates for TRAI compliance
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">32</p>
            <p className="text-sm text-gray-500">Total Templates</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">28</p>
            <p className="text-sm text-gray-500">DLT Approved</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">4</p>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </div>
        </Card>
      </div>
      <Card title="SMS Templates">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search templates..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'approved',
                label: 'Approved'
              },
              {
                value: 'pending',
                label: 'Pending'
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
                    DLT Template ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Category
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
                {[
                {
                  name: 'Attendance Absent Alert',
                  dlt: '1234567890123',
                  cat: 'Attendance',
                  status: 'Approved'
                },
                {
                  name: 'Fee Due Reminder',
                  dlt: '1234567890124',
                  cat: 'Fee',
                  status: 'Approved'
                },
                {
                  name: 'Exam Schedule',
                  dlt: '1234567890125',
                  cat: 'Academic',
                  status: 'Approved'
                },
                {
                  name: 'Result Published',
                  dlt: 'Pending',
                  cat: 'Academic',
                  status: 'Pending'
                }].
                map((tpl) =>
                <tr
                  key={tpl.name}
                  className="border-b border-gray-100 hover:bg-gray-50">

                    <td className="py-3 px-4 font-medium">{tpl.name}</td>
                    <td className="py-3 px-4 font-mono text-xs">{tpl.dlt}</td>
                    <td className="py-3 px-4">{tpl.cat}</td>
                    <td className="py-3 px-4">
                      <Badge
                      variant={
                      tpl.status === 'Approved' ? 'success' : 'warning'
                      }>

                        {tpl.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}