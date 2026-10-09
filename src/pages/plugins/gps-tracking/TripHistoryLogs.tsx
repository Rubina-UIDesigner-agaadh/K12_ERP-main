import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon, MapIcon } from 'lucide-react';
export function TripHistoryLogs() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Trip History & Logs
          </h1>
          <p className="text-sm text-gray-500">
            View complete trip history, route playback and travel logs
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card title="Trip Log">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select
              options={[
              {
                value: 'all',
                label: 'All Vehicles'
              },
              {
                value: 'v1',
                label: 'GJ-01-AB-1234'
              },
              {
                value: 'v2',
                label: 'GJ-01-CD-5678'
              }]
              }
              defaultValue="all" />

            <Input type="date" className="w-40" />
            <Input type="date" className="w-40" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Trips'
              },
              {
                value: 'morning',
                label: 'Morning'
              },
              {
                value: 'evening',
                label: 'Evening'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Vehicle
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Route
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Trip
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Start
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    End
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Distance
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Playback
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">GJ-01-AB-1234</td>
                  <td className="py-3 px-4">Route A</td>
                  <td className="py-3 px-4">Morning</td>
                  <td className="py-3 px-4">07:15 AM</td>
                  <td className="py-3 px-4">08:05 AM</td>
                  <td className="py-3 px-4">18.4 km</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Completed</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                      <MapIcon className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">GJ-01-CD-5678</td>
                  <td className="py-3 px-4">Route B</td>
                  <td className="py-3 px-4">Morning</td>
                  <td className="py-3 px-4">07:20 AM</td>
                  <td className="py-3 px-4">08:22 AM</td>
                  <td className="py-3 px-4">22.1 km</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Delayed</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                      <MapIcon className="w-3 h-3" />
                      View
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