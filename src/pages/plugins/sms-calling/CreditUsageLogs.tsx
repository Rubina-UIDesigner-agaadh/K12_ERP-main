import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon, PlusIcon } from 'lucide-react';
export function CreditUsageLogs() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Credit Usage & Logs
          </h1>
          <p className="text-sm text-gray-500">
            Monitor SMS credit consumption and purchase history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
          <Button variant="primary">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">48,291</p>
            <p className="text-sm text-gray-500">Credits Remaining</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">48,291</p>
            <p className="text-sm text-gray-500">Used This Month</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">1,00,000</p>
            <p className="text-sm text-gray-500">Total Purchased</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">₹4,829</p>
            <p className="text-sm text-gray-500">Cost This Month</p>
          </div>
        </Card>
      </div>
      <Card title="Credit Usage History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Activity
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Credits Used
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Balance After
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">25 Feb 2026</td>
                <td className="py-3 px-4">Attendance Alerts - Morning</td>
                <td className="py-3 px-4 text-red-600">-1,248</td>
                <td className="py-3 px-4">48,291</td>
                <td className="py-3 px-4 text-orange-600">Debit</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">20 Feb 2026</td>
                <td className="py-3 px-4">Credit Purchase</td>
                <td className="py-3 px-4 text-green-600">+50,000</td>
                <td className="py-3 px-4">96,582</td>
                <td className="py-3 px-4 text-green-600">Credit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}