import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function AttendanceLogs() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Biometric Attendance Logs
          </h1>
          <p className="text-sm text-gray-500">
            View all biometric punch records and attendance logs
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">4,821</p>
            <p className="text-sm text-gray-500">Total Punches Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">2,410</p>
            <p className="text-sm text-gray-500">Check-Ins</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">2,411</p>
            <p className="text-sm text-gray-500">Check-Outs</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">24</p>
            <p className="text-sm text-gray-500">Unmatched Punches</p>
          </div>
        </Card>
      </div>
      <Card title="Punch Log">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input type="date" className="w-40" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Users'
              },
              {
                value: 'staff',
                label: 'Staff'
              },
              {
                value: 'student',
                label: 'Students'
              }]
              }
              defaultValue="all" />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Devices'
              },
              {
                value: 'bio-001',
                label: 'BIO-001'
              },
              {
                value: 'bio-002',
                label: 'BIO-002'
              }]
              }
              defaultValue="all" />

            <Input placeholder="Search by name..." className="flex-1" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Device
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Punch Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Direction
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Ramesh Kumar</td>
                  <td className="py-3 px-4">Staff</td>
                  <td className="py-3 px-4">BIO-002</td>
                  <td className="py-3 px-4">08:45 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">IN</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Matched</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4">Student</td>
                  <td className="py-3 px-4">BIO-001</td>
                  <td className="py-3 px-4">08:32 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">IN</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Matched</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Unknown</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">BIO-001</td>
                  <td className="py-3 px-4">08:28 AM</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Unmatched</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}