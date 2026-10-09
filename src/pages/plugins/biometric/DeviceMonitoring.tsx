import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, ActivityIcon, AlertTriangleIcon } from 'lucide-react';
export function DeviceMonitoring() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Biometric Device Monitoring
          </h1>
          <p className="text-sm text-gray-500">
            Real-time health monitoring of all biometric devices
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
            <p className="text-2xl font-bold text-green-600">16</p>
            <p className="text-sm text-gray-500">Devices Online</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">2</p>
            <p className="text-sm text-gray-500">Devices Offline</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">1</p>
            <p className="text-sm text-gray-500">Low Battery</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">99.1%</p>
            <p className="text-sm text-gray-500">Uptime (Month)</p>
          </div>
        </Card>
      </div>
      <Card title="Device Health Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
          {
            id: 'BIO-001',
            location: 'Main Gate',
            status: 'Online',
            battery: '85%',
            temp: '32°C',
            lastPing: '1 min ago',
            punches: 342
          },
          {
            id: 'BIO-002',
            location: 'Staff Room',
            status: 'Online',
            battery: '92%',
            temp: '30°C',
            lastPing: '1 min ago',
            punches: 89
          },
          {
            id: 'BIO-003',
            location: 'Library',
            status: 'Offline',
            battery: '12%',
            temp: '—',
            lastPing: '2 hrs ago',
            punches: 0
          },
          {
            id: 'BIO-004',
            location: 'Lab Block',
            status: 'Online',
            battery: '78%',
            temp: '31°C',
            lastPing: '2 min ago',
            punches: 24
          },
          {
            id: 'BIO-005',
            location: 'Admin Block',
            status: 'Online',
            battery: '65%',
            temp: '29°C',
            lastPing: '1 min ago',
            punches: 56
          },
          {
            id: 'BIO-006',
            location: 'Sports Ground',
            status: 'Online',
            battery: '45%',
            temp: '35°C',
            lastPing: '3 min ago',
            punches: 12
          }].
          map((device) =>
          <div
            key={device.id}
            className={`p-4 border rounded-lg ${device.status === 'Offline' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>

              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{device.id}</p>
                  <p className="text-xs text-gray-500">{device.location}</p>
                </div>
                <Badge
                variant={device.status === 'Online' ? 'success' : 'danger'}>

                  {device.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  Battery:{' '}
                  <span
                  className={`font-medium ${parseInt(device.battery) < 20 ? 'text-red-600' : 'text-gray-900'}`}>

                    {device.battery}
                  </span>
                </div>
                <div>
                  Temp:{' '}
                  <span className="font-medium text-gray-900">
                    {device.temp}
                  </span>
                </div>
                <div>
                  Last Ping:{' '}
                  <span className="font-medium text-gray-900">
                    {device.lastPing}
                  </span>
                </div>
                <div>
                  Punches:{' '}
                  <span className="font-medium text-gray-900">
                    {device.punches}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}