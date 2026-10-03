import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { SendIcon, UsersIcon } from 'lucide-react';
export function BulkMessaging() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk SMS Messaging
          </h1>
          <p className="text-sm text-gray-500">
            Send SMS messages to large groups of parents, students or staff
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Compose SMS">
          <div className="space-y-4">
            <Select
              label="Message Type"
              options={[
              {
                value: 'template',
                label: 'Use DLT Template'
              },
              {
                value: 'custom',
                label: 'Custom Message'
              }]
              }
              defaultValue="template" />

            <Select
              label="DLT Template"
              options={[
              {
                value: 'absent',
                label: 'Attendance Absent Alert'
              },
              {
                value: 'fee',
                label: 'Fee Due Reminder'
              },
              {
                value: 'exam',
                label: 'Exam Schedule'
              }]
              }
              defaultValue="absent" />

            <Select
              label="Target Audience"
              options={[
              {
                value: 'all-parents',
                label: 'All Parents'
              },
              {
                value: 'class-10',
                label: 'Class 10 Parents'
              },
              {
                value: 'defaulters',
                label: 'Fee Defaulters'
              },
              {
                value: 'all-staff',
                label: 'All Staff'
              }]
              }
              defaultValue="all-parents" />

            <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                Estimated Recipients: 1,856 contacts
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                Estimated Cost: ~185 credits (1 SMS/contact)
              </p>
              <p className="text-xs text-gray-500">Available Credits: 48,291</p>
            </div>
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
        <Card title="Recent Campaigns">
          <div className="space-y-3">
            {[
            {
              name: 'Fee Reminder - Feb',
              sent: 1856,
              delivered: 1821,
              date: '20 Feb 2026'
            },
            {
              name: 'Exam Schedule Notice',
              sent: 1248,
              delivered: 1231,
              date: '15 Feb 2026'
            },
            {
              name: 'Holiday Announcement',
              sent: 2104,
              delivered: 2089,
              date: '10 Feb 2026'
            }].
            map((c) =>
            <div
              key={c.name}
              className="p-3 border border-gray-200 rounded-lg">

                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-gray-500 mt-1">{c.date}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-gray-600">
                    Sent: <strong>{c.sent}</strong>
                  </span>
                  <span className="text-green-600">
                    Delivered: <strong>{c.delivered}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}