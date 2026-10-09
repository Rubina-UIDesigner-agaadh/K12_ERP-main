import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  RefreshCwIcon,
  BellIcon,
  AlertTriangleIcon,
  CheckCircleIcon } from
'lucide-react';
export function AlertDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Dashboard</h1>
          <p className="text-sm text-gray-500">
            Real-time overview of all active alerts and system notifications
          </p>
        </div>
        <Button variant="outline">
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-sm text-gray-500">Critical Alerts</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BellIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">18</p>
              <p className="text-sm text-gray-500">High Priority</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">142</p>
              <p className="text-sm text-gray-500">Total Today</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">121</p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Active Alerts">
        <div className="space-y-3">
          {[
          {
            title: 'Bus GJ-01-EF-9012 Off Route',
            category: 'Transport',
            severity: 'Critical',
            time: '11:42 AM',
            status: 'Active'
          },
          {
            title: '24 Students Absent - Class 10',
            category: 'Academic',
            severity: 'High',
            time: '09:00 AM',
            status: 'Active'
          },
          {
            title: 'Fee Overdue - 48 Students',
            category: 'Finance',
            severity: 'High',
            time: '08:00 AM',
            status: 'Active'
          },
          {
            title: 'Biometric Device BIO-003 Offline',
            category: 'System',
            severity: 'Medium',
            time: '07:30 AM',
            status: 'Active'
          },
          {
            title: 'Low SMS Credits (< 10,000)',
            category: 'System',
            severity: 'Medium',
            time: '06:00 AM',
            status: 'Acknowledged'
          }].
          map((alert) =>
          <div
            key={alert.title}
            className={`p-4 border rounded-lg ${alert.severity === 'Critical' ? 'border-red-200 bg-red-50' : alert.severity === 'High' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.category} • {alert.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                  variant={
                  alert.severity === 'Critical' ?
                  'danger' :
                  alert.severity === 'High' ?
                  'warning' :
                  'info'
                  }>

                    {alert.severity}
                  </Badge>
                  <Badge
                  variant={alert.status === 'Active' ? 'danger' : 'warning'}>

                    {alert.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}