import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function EmailDeliveryTracking() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Email Delivery Tracking
          </h1>
          <p className="text-sm text-gray-500">
            Track email delivery status, open rates and click-through rates
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
            <p className="text-2xl font-bold text-gray-900">12,841</p>
            <p className="text-sm text-gray-500">Sent (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">98.4%</p>
            <p className="text-sm text-gray-500">Delivery Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">62.3%</p>
            <p className="text-sm text-gray-500">Open Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">204</p>
            <p className="text-sm text-gray-500">Bounced</p>
          </div>
        </Card>
      </div>
      <Card title="Email Delivery Log">
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
                value: 'opened',
                label: 'Opened'
              },
              {
                value: 'bounced',
                label: 'Bounced'
              }]
              }
              defaultValue="all" />

            <Input placeholder="Search by email..." className="flex-1" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Recipient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Sent At
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Opened
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">parent@example.com</td>
                  <td className="py-3 px-4">Fee Receipt - Feb 2026</td>
                  <td className="py-3 px-4">25 Feb, 10:30 AM</td>
                  <td className="py-3 px-4">25 Feb, 11:12 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Opened</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">parent2@example.com</td>
                  <td className="py-3 px-4">Absent Alert - Rahul</td>
                  <td className="py-3 px-4">25 Feb, 09:15 AM</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">Delivered</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">invalid@bad.com</td>
                  <td className="py-3 px-4">Fee Reminder</td>
                  <td className="py-3 px-4">25 Feb, 09:00 AM</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Bounced</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}