import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { SendIcon, UsersIcon } from 'lucide-react';
export function BulkMessagingPanel() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk Messaging Panel
          </h1>
          <p className="text-sm text-gray-500">
            Send WhatsApp messages to large groups of parents, students or staff
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Compose Message">
          <div className="space-y-4">
            <Select
              label="Message Type"
              options={[
              {
                value: 'template',
                label: 'Use Approved Template'
              },
              {
                value: 'custom',
                label: 'Custom Message (Session)'
              }]
              }
              defaultValue="template" />

            <Select
              label="Template"
              options={[
              {
                value: 'fee_due',
                label: 'fee_due_reminder'
              },
              {
                value: 'exam_schedule',
                label: 'exam_schedule_notification'
              },
              {
                value: 'holiday',
                label: 'holiday_notice'
              }]
              }
              defaultValue="fee_due" />

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
              }]
              }
              defaultValue="all-parents" />

            <Select
              label="Class Filter"
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

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Estimated Recipients: 1,856 contacts
                </span>
              </div>
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
              name: 'Fee Due Reminder - Feb',
              sent: 1856,
              delivered: 1821,
              read: 1654,
              date: '20 Feb 2026'
            },
            {
              name: 'Exam Schedule Notice',
              sent: 1248,
              delivered: 1231,
              read: 1189,
              date: '15 Feb 2026'
            },
            {
              name: 'Annual Day Invitation',
              sent: 2104,
              delivered: 2089,
              read: 1876,
              date: '10 Feb 2026'
            }].
            map((campaign) =>
            <div
              key={campaign.name}
              className="p-3 border border-gray-200 rounded-lg">

                <p className="text-sm font-medium text-gray-900">
                  {campaign.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{campaign.date}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-gray-600">
                    Sent: <strong>{campaign.sent}</strong>
                  </span>
                  <span className="text-green-600">
                    Delivered: <strong>{campaign.delivered}</strong>
                  </span>
                  <span className="text-blue-600">
                    Read: <strong>{campaign.read}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}