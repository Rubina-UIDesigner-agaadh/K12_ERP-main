import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon } from 'lucide-react';
export function AttendanceSyncEngine() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Sync Engine
          </h1>
          <p className="text-sm text-gray-500">
            Configure how biometric punches sync to the attendance module
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sync Configuration">
          <div className="space-y-4">
            <Select
              label="Sync Mode"
              options={[
              {
                value: 'realtime',
                label: 'Real-time (Push)'
              },
              {
                value: 'interval',
                label: 'Interval-based (Pull)'
              },
              {
                value: 'manual',
                label: 'Manual Only'
              }]
              }
              defaultValue="realtime" />

            <Select
              label="Sync Interval"
              options={[
              {
                value: '1',
                label: 'Every 1 minute'
              },
              {
                value: '5',
                label: 'Every 5 minutes'
              },
              {
                value: '15',
                label: 'Every 15 minutes'
              }]
              }
              defaultValue="5" />

            <Select
              label="Attendance Module Target"
              options={[
              {
                value: 'staff',
                label: 'Staff Attendance'
              },
              {
                value: 'student',
                label: 'Student Attendance'
              },
              {
                value: 'both',
                label: 'Both'
              }]
              }
              defaultValue="both" />

            <Select
              label="In/Out Detection"
              options={[
              {
                value: 'auto',
                label: 'Auto (First = IN, Last = OUT)'
              },
              {
                value: 'device',
                label: 'Device-defined Direction'
              },
              {
                value: 'time',
                label: 'Time-based (Before noon = IN)'
              }]
              }
              defaultValue="auto" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Sync Holidays</p>
                <p className="text-xs text-gray-500">
                  Skip sync on declared holidays
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Alert on Sync Failure</p>
                <p className="text-xs text-gray-500">
                  Notify admin if sync fails
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="Sync Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Sync Engine Running
              </p>
              <p className="text-xs text-green-600 mt-1">
                Mode: Real-time • Last sync: 11:42 AM
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Records Synced Today
                </span>
                <span className="text-sm font-medium">4,821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Records</span>
                <span className="text-sm font-medium text-orange-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sync Errors Today</span>
                <span className="text-sm font-medium text-red-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Devices</span>
                <span className="text-sm font-medium">16 / 18</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Module Connection
              </p>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Staff Attendance Module
                </span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Student Attendance Module
                </span>
                <Badge variant="success">Connected</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}