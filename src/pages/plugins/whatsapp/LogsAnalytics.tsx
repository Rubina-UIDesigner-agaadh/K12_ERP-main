import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon } from 'lucide-react';
export function LogsAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            WhatsApp Logs & Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive analytics on WhatsApp messaging performance
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Analytics
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">48,291</p>
            <p className="text-sm text-gray-500">Messages Sent (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">98.6%</p>
            <p className="text-sm text-gray-500">Delivery Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">89.4%</p>
            <p className="text-sm text-gray-500">Read Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">342</p>
            <p className="text-sm text-gray-500">Replies Received</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Message Volume by Category">
          <div className="space-y-3">
            {[
            {
              cat: 'Attendance Alerts',
              count: 18420,
              pct: 38
            },
            {
              cat: 'Fee Reminders',
              count: 12840,
              pct: 27
            },
            {
              cat: 'Exam Notifications',
              count: 8640,
              pct: 18
            },
            {
              cat: 'General Announcements',
              count: 5760,
              pct: 12
            },
            {
              cat: 'Transport Alerts',
              count: 2631,
              pct: 5
            }].
            map((item) =>
            <div key={item.cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-44">{item.cat}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                  className="bg-green-500 h-2 rounded-full"
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
        <Card title="Daily Message Trend">
          <div className="space-y-2">
            {[
            {
              day: 'Mon',
              sent: 1842,
              delivered: 1821
            },
            {
              day: 'Tue',
              sent: 2156,
              delivered: 2134
            },
            {
              day: 'Wed',
              sent: 1934,
              delivered: 1912
            },
            {
              day: 'Thu',
              sent: 2341,
              delivered: 2298
            },
            {
              day: 'Fri',
              sent: 1756,
              delivered: 1734
            }].
            map((day) =>
            <div key={day.day} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{day.day}</span>
                <div className="flex-1 bg-gray-100 rounded p-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Sent: {day.sent}</span>
                    <span className="text-green-600">
                      Delivered: {day.delivered}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}