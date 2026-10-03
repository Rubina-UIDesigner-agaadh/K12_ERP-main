import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function OnlinePaymentManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Online Payment Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage all online fee payment transactions
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">₹48.2L</p>
            <p className="text-sm text-gray-500">Collected (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">2,841</p>
            <p className="text-sm text-gray-500">Successful Txns</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">42</p>
            <p className="text-sm text-gray-500">Failed Txns</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">₹1.2L</p>
            <p className="text-sm text-gray-500">Pending Settlement</p>
          </div>
        </Card>
      </div>
      <Card title="Transaction List">
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
                value: 'success',
                label: 'Success'
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
              placeholder="Search by student or txn ID..."
              className="flex-1" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Txn ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Fee Head
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">TXN-2026-4821</td>
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4">Tuition Fee</td>
                  <td className="py-3 px-4">₹12,500</td>
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">TXN-2026-4820</td>
                  <td className="py-3 px-4">Priya Patel</td>
                  <td className="py-3 px-4">Transport Fee</td>
                  <td className="py-3 px-4">₹3,000</td>
                  <td className="py-3 px-4">25 Feb 2026</td>
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