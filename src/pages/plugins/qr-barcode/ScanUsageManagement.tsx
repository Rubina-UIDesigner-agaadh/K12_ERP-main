import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { ScanLineIcon, ActivityIcon } from 'lucide-react';
export function ScanUsageManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scan & Usage Management
          </h1>
          <p className="text-sm text-gray-500">
            Monitor scan events, usage patterns and scanner device activity
          </p>
        </div>
        <Button variant="primary">
          <ScanLineIcon className="w-4 h-4 mr-2" />
          Test Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">4,821</p>
            <p className="text-sm text-gray-500">Total Scans Today</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Active Scanners</p>
            <p className="text-xs text-green-600 mt-1">All online</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Failed Scans</p>
            <p className="text-xs text-red-600 mt-1">Needs attention</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">99.9%</p>
            <p className="text-sm text-gray-500">Scan Success Rate</p>
            <p className="text-xs text-green-600 mt-1">Excellent</p>
          </div>
        </Card>
      </div>

      <Card title="Recent Scan Activity">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search by entity or scanner..."
              className="flex-1" />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Events'
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
                value: 'expired',
                label: 'Expired Code'
              }]
              }
              defaultValue="all" />

            <Select
              options={[
              {
                value: 'today',
                label: 'Today'
              },
              {
                value: 'week',
                label: 'This Week'
              },
              {
                value: 'month',
                label: 'This Month'
              }]
              }
              defaultValue="today" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Entity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Scanner
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">08:32 AM</td>
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-STU-001</td>
                  <td className="py-3 px-4">Gate Scanner 1</td>
                  <td className="py-3 px-4">Main Entrance</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">08:31 AM</td>
                  <td className="py-3 px-4">Priya Patel</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-STU-002</td>
                  <td className="py-3 px-4">Gate Scanner 1</td>
                  <td className="py-3 px-4">Main Entrance</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">08:29 AM</td>
                  <td className="py-3 px-4">Unknown</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-XXX-999</td>
                  <td className="py-3 px-4">Library Scanner</td>
                  <td className="py-3 px-4">Library</td>
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