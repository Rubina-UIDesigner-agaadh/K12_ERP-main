import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon } from 'lucide-react';
export function RefundAdjustmentPanel() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Refund & Adjustment Panel
          </h1>
          <p className="text-sm text-gray-500">
            Process payment refunds and fee adjustments
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Refund
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">18</p>
            <p className="text-sm text-gray-500">Pending Refunds</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">₹84,500</p>
            <p className="text-sm text-gray-500">Refunded (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">2-3 days</p>
            <p className="text-sm text-gray-500">Avg. Processing Time</p>
          </div>
        </Card>
      </div>
      <Card title="Refund Requests">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Refund ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Student
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Original Txn
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs">REF-001</td>
                <td className="py-3 px-4">Rahul Sharma</td>
                <td className="py-3 px-4 font-mono text-xs">TXN-4800</td>
                <td className="py-3 px-4">₹5,000</td>
                <td className="py-3 px-4">Duplicate Payment</td>
                <td className="py-3 px-4">
                  <Badge variant="warning">Pending</Badge>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs">REF-002</td>
                <td className="py-3 px-4">Priya Patel</td>
                <td className="py-3 px-4 font-mono text-xs">TXN-4750</td>
                <td className="py-3 px-4">₹3,000</td>
                <td className="py-3 px-4">TC Issued</td>
                <td className="py-3 px-4">
                  <Badge variant="success">Processed</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}