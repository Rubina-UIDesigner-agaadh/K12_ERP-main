import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { UsersIcon, DownloadIcon } from 'lucide-react';
export function StudentBoardingTracking() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Boarding Tracking
          </h1>
          <p className="text-sm text-gray-500">
            Track student boarding and deboarding events for each trip
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
            <p className="text-2xl font-bold text-gray-900">1,248</p>
            <p className="text-sm text-gray-500">Total Transport Students</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">1,186</p>
            <p className="text-sm text-gray-500">Boarded Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">62</p>
            <p className="text-sm text-gray-500">Absent / Not Boarded</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-500">Parent Notifications Sent</p>
          </div>
        </Card>
      </div>

      <Card title="Boarding Log">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select
              options={[
              {
                value: 'all',
                label: 'All Routes'
              },
              {
                value: 'route-a',
                label: 'Route A'
              },
              {
                value: 'route-b',
                label: 'Route B'
              }]
              }
              defaultValue="all" />

            <Select
              options={[
              {
                value: 'morning',
                label: 'Morning Trip'
              },
              {
                value: 'evening',
                label: 'Evening Trip'
              }]
              }
              defaultValue="morning" />

            <Input type="date" className="w-40" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Class
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Route
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Stop
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Boarded At
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4">10-A</td>
                  <td className="py-3 px-4">Route A</td>
                  <td className="py-3 px-4">Sector 12</td>
                  <td className="py-3 px-4">07:42 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Boarded</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Priya Patel</td>
                  <td className="py-3 px-4">9-B</td>
                  <td className="py-3 px-4">Route A</td>
                  <td className="py-3 px-4">Market Area</td>
                  <td className="py-3 px-4">07:51 AM</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Boarded</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Amit Singh</td>
                  <td className="py-3 px-4">8-C</td>
                  <td className="py-3 px-4">Route B</td>
                  <td className="py-3 px-4">North Zone</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Not Boarded</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}