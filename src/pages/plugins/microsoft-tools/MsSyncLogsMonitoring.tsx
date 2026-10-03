import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon, RefreshCwIcon } from 'lucide-react';
export function MsSyncLogsMonitoring() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Microsoft Tools Sync Logs & Monitoring
          </h1>
          <p className="text-sm text-gray-500">
            Monitor Microsoft 365 integration sync activity and errors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">98.8%</p>
            <p className="text-sm text-gray-500">Sync Success Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">3,421</p>
            <p className="text-sm text-gray-500">Sync Events Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">41</p>
            <p className="text-sm text-gray-500">Sync Errors</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">11:42 AM</p>
            <p className="text-sm text-gray-500">Last Sync</p>
          </div>
        </Card>
      </div>
      <Card title="Sync Log">
        <div className="space-y-4">
          <Select
            options={[
            {
              value: 'all',
              label: 'All Services'
            },
            {
              value: 'teams',
              label: 'Teams'
            },
            {
              value: 'onedrive',
              label: 'OneDrive'
            },
            {
              value: 'calendar',
              label: 'Outlook Calendar'
            }]
            }
            defaultValue="all" />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Records
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">11:42 AM</td>
                  <td className="py-3 px-4">Teams</td>
                  <td className="py-3 px-4">Assignment Sync</td>
                  <td className="py-3 px-4">18</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">11:30 AM</td>
                  <td className="py-3 px-4">OneDrive</td>
                  <td className="py-3 px-4">File Upload</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">11:00 AM</td>
                  <td className="py-3 px-4">Outlook Calendar</td>
                  <td className="py-3 px-4">Event Sync</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Failed</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}