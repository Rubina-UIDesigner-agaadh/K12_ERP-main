import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { LinkIcon, PlusIcon } from 'lucide-react';
export function EntityMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entity Mapping</h1>
          <p className="text-sm text-gray-500">
            Map QR/Barcode codes to Students, Staff, Assets, and Library items
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-blue-600">1,248</p>
            <p className="text-sm text-gray-500 mt-1">Students Mapped</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-green-600">342</p>
            <p className="text-sm text-gray-500 mt-1">Staff Mapped</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-orange-600">856</p>
            <p className="text-sm text-gray-500 mt-1">Assets Mapped</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-purple-600">4,521</p>
            <p className="text-sm text-gray-500 mt-1">Library Items</p>
          </div>
        </Card>
      </div>

      <Card title="Mapping Configuration">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Entity Type"
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
              },
              {
                value: 'asset',
                label: 'Asset'
              },
              {
                value: 'library',
                label: 'Library'
              }]
              }
              defaultValue="all" />

            <Select
              label="Mapping Status"
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'mapped',
                label: 'Mapped'
              },
              {
                value: 'unmapped',
                label: 'Unmapped'
              }]
              }
              defaultValue="all" />

            <Input placeholder="Search by name or ID..." />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Entity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Code Assigned
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Code Format
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Rahul Sharma (STU-001)</td>
                  <td className="py-3 px-4">Student</td>
                  <td className="py-3 px-4 font-mono text-xs">
                    QR-STU-2024-001
                  </td>
                  <td className="py-3 px-4">QR Code</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Mapped</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs">
                      Reassign
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Priya Patel (STU-002)</td>
                  <td className="py-3 px-4">Student</td>
                  <td className="py-3 px-4 font-mono text-xs">
                    QR-STU-2024-002
                  </td>
                  <td className="py-3 px-4">QR Code</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Mapped</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs">
                      Reassign
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">Laptop Dell (AST-045)</td>
                  <td className="py-3 px-4">Asset</td>
                  <td className="py-3 px-4 text-gray-400">—</td>
                  <td className="py-3 px-4 text-gray-400">—</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Unmapped</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      Map Now
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