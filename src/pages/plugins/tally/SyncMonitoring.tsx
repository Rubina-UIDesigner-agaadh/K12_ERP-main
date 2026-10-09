import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, ActivityIcon } from 'lucide-react';
export function SyncMonitoring() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sync Monitoring</h1>
          <p className="text-sm text-gray-500">
            Monitor real-time Tally sync status and resolve sync issues
          </p>
        </div>
        <Button variant="outline">
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">Connected</p>
            <p className="text-sm text-gray-500">Tally Server Status</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">25 Feb 2026</p>
            <p className="text-sm text-gray-500">Last Successful Sync</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-sm text-gray-500">Pending Vouchers</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-500">Sync Errors</p>
          </div>
        </Card>
      </div>
      <Card title="Sync History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Sync Time
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Records
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Success
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Failed
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">25 Feb 2026, 11:00 AM</td>
                <td className="py-3 px-4">Auto Sync</td>
                <td className="py-3 px-4">156</td>
                <td className="py-3 px-4 text-green-600">153</td>
                <td className="py-3 px-4 text-red-600">3</td>
                <td className="py-3 px-4">
                  <Badge variant="warning">Partial</Badge>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">25 Feb 2026, 08:00 AM</td>
                <td className="py-3 px-4">Auto Sync</td>
                <td className="py-3 px-4">89</td>
                <td className="py-3 px-4 text-green-600">89</td>
                <td className="py-3 px-4 text-green-600">0</td>
                <td className="py-3 px-4">
                  <Badge variant="success">Success</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}