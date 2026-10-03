import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { FingerprintIcon, PlusIcon } from 'lucide-react';
export function UserBiometricMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User Biometric Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Enroll and map biometric data (fingerprint/face) to staff and
            students
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Enroll User
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">342</p>
            <p className="text-sm text-gray-500">Staff Enrolled</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">1,248</p>
            <p className="text-sm text-gray-500">Students Enrolled</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">24</p>
            <p className="text-sm text-gray-500">Pending Enrollment</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">8</p>
            <p className="text-sm text-gray-500">Failed Enrollments</p>
          </div>
        </Card>
      </div>
      <Card title="Enrollment Status">
        <div className="space-y-4">
          <div className="flex gap-3">
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
                label: 'All Status'
              },
              {
                value: 'enrolled',
                label: 'Enrolled'
              },
              {
                value: 'pending',
                label: 'Pending'
              }]
              }
              defaultValue="all" />

            <Input placeholder="Search by name or ID..." className="flex-1" />
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
                    Fingerprint
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Face ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Enrolled On
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Ramesh Kumar</td>
                  <td className="py-3 px-4">Staff</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Enrolled</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Enrolled</Badge>
                  </td>
                  <td className="py-3 px-4">01 Jan 2026</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs">
                      Re-enroll
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma</td>
                  <td className="py-3 px-4">Student</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Enrolled</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Pending</Badge>
                  </td>
                  <td className="py-3 px-4">15 Jan 2026</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs">
                      Enroll Face
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}