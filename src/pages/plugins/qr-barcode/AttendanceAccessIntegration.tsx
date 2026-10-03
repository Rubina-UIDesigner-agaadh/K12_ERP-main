import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, CheckCircleIcon, DoorOpenIcon } from 'lucide-react';
export function AttendanceAccessIntegration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance & Access Integration
          </h1>
          <p className="text-sm text-gray-500">
            Configure QR/Barcode scan triggers for attendance marking and access
            control
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Attendance Integration">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Student Attendance via QR
                </p>
                <p className="text-xs text-gray-500">
                  Mark attendance when student scans QR at entry
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Staff Attendance via Barcode
                </p>
                <p className="text-xs text-gray-500">
                  Mark staff attendance on badge scan
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Auto In/Out Detection
                </p>
                <p className="text-xs text-gray-500">
                  Automatically detect entry vs exit based on time
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Select
              label="Attendance Module Sync"
              options={[
              {
                value: 'realtime',
                label: 'Real-time Sync'
              },
              {
                value: 'batch',
                label: 'Batch Sync (Every 5 min)'
              },
              {
                value: 'manual',
                label: 'Manual Sync'
              }]
              }
              defaultValue="realtime" />

          </div>
        </Card>

        <Card title="Access Control">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Gate Access Control
                </p>
                <p className="text-xs text-gray-500">
                  Allow/deny entry based on valid QR scan
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Library Access
                </p>
                <p className="text-xs text-gray-500">
                  Restrict library entry to valid members
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Lab / Special Room Access
                </p>
                <p className="text-xs text-gray-500">
                  Control access to restricted areas
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <Select
              label="Denied Access Action"
              options={[
              {
                value: 'alert',
                label: 'Send Alert to Admin'
              },
              {
                value: 'log',
                label: 'Log Only'
              },
              {
                value: 'notify',
                label: 'Notify Parent + Admin'
              }]
              }
              defaultValue="alert" />

          </div>
        </Card>

        <Card title="Integration Status">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Attendance Module</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Gate Controller API</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Library System</span>
              <Badge variant="warning">Pending Setup</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Biometric Sync</span>
              <Badge variant="danger">Disconnected</Badge>
            </div>
          </div>
        </Card>

        <Card title="Scan Points Configuration">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <DoorOpenIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Main Gate - Entry</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <DoorOpenIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Main Gate - Exit</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <DoorOpenIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Library Entrance</span>
              </div>
              <Badge variant="warning">Inactive</Badge>
            </div>
            <Button variant="outline" className="w-full">
              + Add Scan Point
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}