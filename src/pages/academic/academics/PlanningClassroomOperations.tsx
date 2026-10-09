import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SettingsIcon, CheckCircleIcon } from 'lucide-react';
export function PlanningClassroomOperations() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Classroom Operations Planning
          </h1>
          <p className="text-sm text-gray-500">
            Plan and coordinate physical classroom setups and operational
            requirements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 p-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Activities Today</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Pending Setup</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-500">Ready / Completed</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Operational Requirements Schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Activity / Event
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Class & Room
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Time Slot
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Resources Required
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Requested By
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
              {
                act: 'Science Experiment Demo',
                class: 'X-A (Physics Lab)',
                time: '09:55 AM - 10:35 AM',
                res: 'Projector, Optics Kit',
                req: 'A. Gupta',
                status: 'Setup Ready'
              },
              {
                act: 'Guest Lecture (Career)',
                class: 'XII-Sci (AV Room)',
                time: '11:50 AM - 01:10 PM',
                res: 'Mic, PA System, 50 Chairs',
                req: 'Principal',
                status: 'Pending Setup'
              },
              {
                act: 'Math Quiz Activity',
                class: 'IX-B (Room 105)',
                time: '08:20 AM - 09:00 AM',
                res: 'Printed Worksheets (40)',
                req: 'R. Sharma',
                status: 'Completed'
              },
              {
                act: 'Art Exhibition Prep',
                class: 'All (Art Room)',
                time: '01:50 PM - 02:30 PM',
                res: 'Display Boards, Pins',
                req: 'Art Teacher',
                status: 'Pending Setup'
              }].
              map((row, i) =>
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50">
                
                  <td className="py-3 px-4 font-medium">{row.act}</td>
                  <td className="py-3 px-4 text-gray-600">{row.class}</td>
                  <td className="py-3 px-4 text-xs">{row.time}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{row.res}</td>
                  <td className="py-3 px-4">{row.req}</td>
                  <td className="py-3 px-4">
                    <Badge
                    variant={
                    row.status === 'Completed' ||
                    row.status === 'Setup Ready' ?
                    'success' :
                    'warning'
                    }>
                    
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}