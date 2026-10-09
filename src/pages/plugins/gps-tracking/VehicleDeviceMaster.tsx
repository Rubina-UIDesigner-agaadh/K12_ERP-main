import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, TruckIcon, EditIcon } from 'lucide-react';
export function VehicleDeviceMaster() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vehicle & Device Master
          </h1>
          <p className="text-sm text-gray-500">
            Register and manage transport vehicles and GPS tracking devices
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Total Vehicles</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">21</p>
            <p className="text-sm text-gray-500">GPS Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-gray-500">Device Offline</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-500">Devices Registered</p>
          </div>
        </Card>
      </div>

      <Card title="Vehicle Registry">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search vehicle or device..."
              className="flex-1" />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Status'
              },
              {
                value: 'active',
                label: 'Active'
              },
              {
                value: 'inactive',
                label: 'Inactive'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Vehicle No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Driver
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    GPS Device ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Device Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">GJ-01-AB-1234</td>
                  <td className="py-3 px-4">School Bus</td>
                  <td className="py-3 px-4">Ramesh Kumar</td>
                  <td className="py-3 px-4 font-mono text-xs">GPS-DEV-001</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Online</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">GJ-01-CD-5678</td>
                  <td className="py-3 px-4">Mini Van</td>
                  <td className="py-3 px-4">Suresh Patel</td>
                  <td className="py-3 px-4 font-mono text-xs">GPS-DEV-002</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Online</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">GJ-01-EF-9012</td>
                  <td className="py-3 px-4">School Bus</td>
                  <td className="py-3 px-4">Mahesh Shah</td>
                  <td className="py-3 px-4 font-mono text-xs">GPS-DEV-003</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Offline</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EditIcon className="w-4 h-4" />
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