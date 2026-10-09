import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, FingerprintIcon, EditIcon } from 'lucide-react';
export function DeviceRegistrationMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Device Registration & Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Register biometric devices and map them to locations
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">18</p>
            <p className="text-sm text-gray-500">Total Devices</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">16</p>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">2</p>
            <p className="text-sm text-gray-500">Offline</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">6</p>
            <p className="text-sm text-gray-500">Locations Covered</p>
          </div>
        </Card>
      </div>
      <Card title="Device Registry">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Device ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Model
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  IP Address
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
              {[
              {
                id: 'BIO-001',
                model: 'ZKTeco F22',
                location: 'Main Gate',
                type: 'Fingerprint',
                ip: '192.168.1.101',
                status: 'Online'
              },
              {
                id: 'BIO-002',
                model: 'ZKTeco F22',
                location: 'Staff Room',
                type: 'Fingerprint',
                ip: '192.168.1.102',
                status: 'Online'
              },
              {
                id: 'BIO-003',
                model: 'Suprema BioStation',
                location: 'Library',
                type: 'Face + Finger',
                ip: '192.168.1.103',
                status: 'Offline'
              }].
              map((device) =>
              <tr
                key={device.id}
                className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4 font-mono text-xs font-medium">
                    {device.id}
                  </td>
                  <td className="py-3 px-4">{device.model}</td>
                  <td className="py-3 px-4">{device.location}</td>
                  <td className="py-3 px-4">{device.type}</td>
                  <td className="py-3 px-4 font-mono text-xs">{device.ip}</td>
                  <td className="py-3 px-4">
                    <Badge
                    variant={
                    device.status === 'Online' ? 'success' : 'danger'
                    }>

                      {device.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}