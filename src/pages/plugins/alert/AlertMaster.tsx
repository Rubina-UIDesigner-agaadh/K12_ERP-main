import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, BellIcon, EditIcon, TrashIcon } from 'lucide-react';
export function AlertMaster() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Master</h1>
          <p className="text-sm text-gray-500">
            Define and manage all alert types, categories and severity levels
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Alert Type
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-500">Alert Types Defined</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">42</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">8</p>
            <p className="text-sm text-gray-500">Critical Alerts</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">6</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
        </Card>
      </div>
      <Card title="Alert Type Registry">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search alert types..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Categories'
              },
              {
                value: 'academic',
                label: 'Academic'
              },
              {
                value: 'finance',
                label: 'Finance'
              },
              {
                value: 'safety',
                label: 'Safety'
              },
              {
                value: 'transport',
                label: 'Transport'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Alert Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Severity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Channels
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
                  name: 'Student Absent',
                  cat: 'Academic',
                  severity: 'Medium',
                  channels: 'SMS, WhatsApp',
                  status: 'Active'
                },
                {
                  name: 'Fee Overdue',
                  cat: 'Finance',
                  severity: 'High',
                  channels: 'SMS, Email',
                  status: 'Active'
                },
                {
                  name: 'Bus Off Route',
                  cat: 'Transport',
                  severity: 'Critical',
                  channels: 'SMS, App, Call',
                  status: 'Active'
                },
                {
                  name: 'Medical Emergency',
                  cat: 'Safety',
                  severity: 'Critical',
                  channels: 'All Channels',
                  status: 'Active'
                },
                {
                  name: 'Low Attendance',
                  cat: 'Academic',
                  severity: 'Low',
                  channels: 'Email',
                  status: 'Active'
                }].
                map((alert) =>
                <tr
                  key={alert.name}
                  className="border-b border-gray-100 hover:bg-gray-50">

                    <td className="py-3 px-4 font-medium">{alert.name}</td>
                    <td className="py-3 px-4">{alert.cat}</td>
                    <td className="py-3 px-4">
                      <Badge
                      variant={
                      alert.severity === 'Critical' ?
                      'danger' :
                      alert.severity === 'High' ?
                      'warning' :
                      alert.severity === 'Medium' ?
                      'info' :
                      'success'
                      }>

                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {alert.channels}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{alert.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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