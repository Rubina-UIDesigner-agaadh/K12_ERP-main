import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon, FilterIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
export function ReportsScanLogs() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Scan Logs
          </h1>
          <p className="text-sm text-gray-500">
            View detailed scan history, usage analytics and generate reports
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
            <p className="text-sm text-gray-500">Total Scans (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">47,956</p>
            <p className="text-sm text-gray-500">Successful</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">335</p>
            <p className="text-sm text-gray-500">Failed / Denied</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">99.3%</p>
            <p className="text-sm text-gray-500">Success Rate</p>
          </div>
        </Card>
      </div>

      <Card title="Scan Log">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input type="date" className="w-40" />
            <Input type="date" className="w-40" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Entities'
              },
              {
                value: 'student',
                label: 'Student'
              },
              {
                value: 'staff',
                label: 'Staff'
              }]
              }
              defaultValue="all" />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Results'
              },
              {
                value: 'success',
                label: 'Success'
              },
              {
                value: 'failed',
                label: 'Failed'
              }]
              }
              defaultValue="all" />

            <Button variant="outline">
              <FilterIcon className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Entity Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Scanner
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Purpose
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">
                    25 Feb 2026, 08:32
                  </td>
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-STU-001</td>
                  <td className="py-3 px-4">Gate-01</td>
                  <td className="py-3 px-4">Attendance</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">
                    25 Feb 2026, 08:31
                  </td>
                  <td className="py-3 px-4">Priya Patel</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-STU-002</td>
                  <td className="py-3 px-4">Gate-01</td>
                  <td className="py-3 px-4">Attendance</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">
                    25 Feb 2026, 08:29
                  </td>
                  <td className="py-3 px-4">Unknown</td>
                  <td className="py-3 px-4 font-mono text-xs">QR-EXP-999</td>
                  <td className="py-3 px-4">Library</td>
                  <td className="py-3 px-4">Access</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Expired</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}