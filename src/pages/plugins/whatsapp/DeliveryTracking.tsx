import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function DeliveryTracking() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Tracking
          </h1>
          <p className="text-sm text-gray-500">
            Track WhatsApp message delivery, read receipts and failures
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
            <p className="text-2xl font-bold text-gray-900">4,821</p>
            <p className="text-sm text-gray-500">Sent Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">4,756</p>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">4,312</p>
            <p className="text-sm text-gray-500">Read</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">65</p>
            <p className="text-sm text-gray-500">Failed</p>
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
                value: 'read',
                label: 'Read'
              },
              {
                value: 'failed',
                label: 'Failed'
              }]
              }
              defaultValue="all" />

            <Input
              placeholder="Search by name or number..."
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
                    Template
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Sent At
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Delivered
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Read
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma (Parent)</td>
                  <td className="py-3 px-4">attendance_absent_alert</td>
                  <td className="py-3 px-4">08:45 AM</td>
                  <td className="py-3 px-4">08:45 AM</td>
                  <td className="py-3 px-4">09:12 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Read</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Priya Patel (Parent)</td>
                  <td className="py-3 px-4">fee_due_reminder</td>
                  <td className="py-3 px-4">09:00 AM</td>
                  <td className="py-3 px-4">09:01 AM</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">Delivered</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Amit Singh (Parent)</td>
                  <td className="py-3 px-4">fee_due_reminder</td>
                  <td className="py-3 px-4">09:00 AM</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">—</td>
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