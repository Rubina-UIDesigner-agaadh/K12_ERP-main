import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, PlayIcon } from 'lucide-react';
export function RealtimeManualSync() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Real-Time / Manual Sync
          </h1>
          <p className="text-sm text-gray-500">
            Trigger manual sync or monitor real-time biometric data sync status
          </p>
        </div>
        <Button variant="primary">
          <PlayIcon className="w-4 h-4 mr-2" />
          Run Manual Sync
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">Real-time</p>
            <p className="text-sm text-gray-500">Current Sync Mode</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">4,821</p>
            <p className="text-sm text-gray-500">Records Synced Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-gray-500">Pending Records</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">11:42 AM</p>
            <p className="text-sm text-gray-500">Last Sync Time</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Device Sync Status">
          <div className="space-y-3">
            {[
            {
              device: 'BIO-001 (Main Gate)',
              lastSync: '11:42 AM',
              records: 342,
              status: 'Synced'
            },
            {
              device: 'BIO-002 (Staff Room)',
              lastSync: '11:41 AM',
              records: 89,
              status: 'Synced'
            },
            {
              device: 'BIO-003 (Library)',
              lastSync: '10:30 AM',
              records: 0,
              status: 'Offline'
            },
            {
              device: 'BIO-004 (Lab)',
              lastSync: '11:40 AM',
              records: 24,
              status: 'Synced'
            }].
            map((d) =>
            <div
              key={d.device}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">

                <div>
                  <p className="text-sm font-medium">{d.device}</p>
                  <p className="text-xs text-gray-500">
                    Last sync: {d.lastSync} • {d.records} records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === 'Synced' ? 'success' : 'danger'}>
                    {d.status}
                  </Badge>
                  <button className="text-blue-600 hover:text-blue-800">
                    <RefreshCwIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card title="Manual Sync Options">
          <div className="space-y-4">
            <Select
              label="Select Device"
              options={[
              {
                value: 'all',
                label: 'All Devices'
              },
              {
                value: 'bio-001',
                label: 'BIO-001 (Main Gate)'
              },
              {
                value: 'bio-002',
                label: 'BIO-002 (Staff Room)'
              }]
              }
              defaultValue="all" />

            <Select
              label="Sync Type"
              options={[
              {
                value: 'attendance',
                label: 'Attendance Records'
              },
              {
                value: 'users',
                label: 'User Templates'
              },
              {
                value: 'both',
                label: 'Both'
              }]
              }
              defaultValue="attendance" />

            <Select
              label="Date Range"
              options={[
              {
                value: 'today',
                label: 'Today'
              },
              {
                value: 'yesterday',
                label: 'Yesterday'
              },
              {
                value: 'week',
                label: 'This Week'
              }]
              }
              defaultValue="today" />

            <Button variant="primary" className="w-full">
              <PlayIcon className="w-4 h-4 mr-2" />
              Start Sync
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}