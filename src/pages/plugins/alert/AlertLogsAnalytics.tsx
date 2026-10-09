import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function AlertLogsAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Alert Logs & Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Complete history of all alerts with performance analytics
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">4,821</p>
            <p className="text-sm text-gray-500">Total Alerts (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">4,612</p>
            <p className="text-sm text-gray-500">Resolved</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">2.4 hrs</p>
            <p className="text-sm text-gray-500">Avg. Resolution Time</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">95.7%</p>
            <p className="text-sm text-gray-500">Resolution Rate</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Alerts by Category">
          <div className="space-y-3">
            {[
            {
              cat: 'Academic',
              count: 2184,
              pct: 45,
              color: 'bg-blue-500'
            },
            {
              cat: 'Finance',
              count: 1206,
              pct: 25,
              color: 'bg-green-500'
            },
            {
              cat: 'Transport',
              count: 724,
              pct: 15,
              color: 'bg-orange-500'
            },
            {
              cat: 'System',
              count: 482,
              pct: 10,
              color: 'bg-purple-500'
            },
            {
              cat: 'Safety',
              count: 225,
              pct: 5,
              color: 'bg-red-500'
            }].
            map((item) =>
            <div key={item.cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-24">{item.cat}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{
                    width: `${item.pct}%`
                  }} />

                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {item.count.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>
        <Card title="Alert Log">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[
            {
              title: 'Bus Off Route',
              cat: 'Transport',
              time: '11:42 AM',
              status: 'Active'
            },
            {
              title: 'Student Absent - Rahul',
              cat: 'Academic',
              time: '09:00 AM',
              status: 'Resolved'
            },
            {
              title: 'Fee Overdue - Priya',
              cat: 'Finance',
              time: '08:00 AM',
              status: 'Resolved'
            },
            {
              title: 'Device Offline BIO-003',
              cat: 'System',
              time: '07:30 AM',
              status: 'Active'
            }].
            map((log) =>
            <div
              key={log.title + log.time}
              className="flex items-center justify-between p-2 border border-gray-100 rounded">

                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {log.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.cat} • {log.time}
                  </p>
                </div>
                <Badge variant={log.status === 'Active' ? 'danger' : 'success'}>
                  {log.status}
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}