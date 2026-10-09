import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon } from 'lucide-react';
export function AppUsageAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            App Usage Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Track user engagement, feature usage and app performance metrics
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
            <p className="text-2xl font-bold text-gray-900">2,841</p>
            <p className="text-sm text-gray-500">Active Users (Today)</p>
            <p className="text-xs text-green-600">↑ 8% from yesterday</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">18.4 min</p>
            <p className="text-sm text-gray-500">Avg. Session Duration</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-gray-500">App Adoption Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">4.8 ★</p>
            <p className="text-sm text-gray-500">App Store Rating</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Most Used Features">
          <div className="space-y-3">
            {[
            {
              feature: 'Attendance View',
              usage: 92,
              color: 'bg-blue-500'
            },
            {
              feature: 'Notifications',
              usage: 88,
              color: 'bg-green-500'
            },
            {
              feature: 'Fee Payment',
              usage: 76,
              color: 'bg-purple-500'
            },
            {
              feature: 'Timetable',
              usage: 71,
              color: 'bg-orange-500'
            },
            {
              feature: 'Results',
              usage: 65,
              color: 'bg-red-500'
            },
            {
              feature: 'Transport Tracking',
              usage: 58,
              color: 'bg-yellow-500'
            }].
            map((item) =>
            <div key={item.feature} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">
                  {item.feature}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{
                    width: `${item.usage}%`
                  }} />

                </div>
                <span className="text-sm text-gray-600 w-10 text-right">
                  {item.usage}%
                </span>
              </div>
            )}
          </div>
        </Card>
        <Card title="User Breakdown">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                Students
              </span>
              <span className="text-lg font-bold text-blue-700">1,248</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">
                Parents
              </span>
              <span className="text-lg font-bold text-green-700">1,856</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-800">
                Teachers
              </span>
              <span className="text-lg font-bold text-purple-700">342</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-800">
                Admin Staff
              </span>
              <span className="text-lg font-bold text-orange-700">48</span>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}