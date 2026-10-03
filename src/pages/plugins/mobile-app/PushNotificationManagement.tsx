import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { BellIcon, SendIcon, PlusIcon } from 'lucide-react';
export function PushNotificationManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Push Notification Management
          </h1>
          <p className="text-sm text-gray-500">
            Send and manage push notifications to app users
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Notification
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Send Notification">
          <div className="space-y-4">
            <Select
              label="Target Audience"
              options={[
              {
                value: 'all',
                label: 'All Users'
              },
              {
                value: 'students',
                label: 'Students'
              },
              {
                value: 'parents',
                label: 'Parents'
              },
              {
                value: 'teachers',
                label: 'Teachers'
              }]
              }
              defaultValue="all" />

            <Select
              label="Class / Group Filter"
              options={[
              {
                value: 'all',
                label: 'All Classes'
              },
              {
                value: '10',
                label: 'Class 10'
              },
              {
                value: '11',
                label: 'Class 11'
              }]
              }
              defaultValue="all" />

            <Input label="Notification Title" placeholder="Enter title..." />
            <Textarea
              label="Message Body"
              placeholder="Enter notification message..."
              rows={4} />

            <Select
              label="Priority"
              options={[
              {
                value: 'normal',
                label: 'Normal'
              },
              {
                value: 'high',
                label: 'High'
              }]
              }
              defaultValue="normal" />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Schedule
              </Button>
              <Button variant="primary" className="flex-1">
                <SendIcon className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Recent Notifications">
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">Exam Schedule Released</p>
                <Badge variant="success">Sent</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All Students • 25 Feb 2026 • 1,248 delivered
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">Fee Due Reminder</p>
                <Badge variant="success">Sent</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Parents • 24 Feb 2026 • 856 delivered
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">Holiday Announcement</p>
                <Badge variant="warning">Scheduled</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All Users • 26 Feb 2026 • Pending
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}