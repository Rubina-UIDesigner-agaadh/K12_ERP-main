import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function DeliveryReports() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            SMS Delivery Reports
          </h1>
          <p className="text-sm text-gray-500">
            Track SMS delivery status and campaign performance
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">48,291</p>
            <p className="text-sm text-gray-500">Sent (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">97.8%</p>
            <p className="text-sm text-gray-500">Delivery Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">1,062</p>
            <p className="text-sm text-gray-500">Failed</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">48,291</p>
            <p className="text-sm text-gray-500">Credits Used</p>
          </div>
        </Card>
      </div>
      <Card title="Delivery Log">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input type="date" className="w-40" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'delivered',
                label: 'Delivered'
              },
              {
                value: 'failed',
                label: 'Failed'
              },
              {
                value: 'pending',
                label: 'Pending'
              }]
              }
              defaultValue="all" />

            <Input
              placeholder="Search by mobile or name..."
              className="flex-1" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Recipient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Mobile
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Template
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Sent At
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma (Parent)</td>
                  <td className="py-3 px-4">+91 98765 43210</td>
                  <td className="py-3 px-4">Attendance Absent Alert</td>
                  <td className="py-3 px-4">08:45 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Delivered</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Priya Patel (Parent)</td>
                  <td className="py-3 px-4">+91 87654 32109</td>
                  <td className="py-3 px-4">Fee Due Reminder</td>
                  <td className="py-3 px-4">09:00 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Failed</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}