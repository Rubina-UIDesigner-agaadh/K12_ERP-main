import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { CalendarIcon, PaperclipIcon, SendIcon } from 'lucide-react';
export function SchedulingAttachments() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scheduling & Attachments
          </h1>
          <p className="text-sm text-gray-500">
            Schedule email campaigns and manage file attachments
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Schedule Email">
          <div className="space-y-4">
            <Select
              label="Template"
              options={[
              {
                value: 'fee',
                label: 'Fee Reminder'
              },
              {
                value: 'exam',
                label: 'Exam Schedule'
              },
              {
                value: 'circular',
                label: 'Circular'
              }]
              }
              defaultValue="fee" />

            <Select
              label="Recipients"
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

            <Input label="Subject" placeholder="Enter email subject..." />
            <Input label="Schedule Date & Time" type="datetime-local" />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <PaperclipIcon className="w-6 h-6 mx-auto text-gray-400 mb-1" />
              <p className="text-sm text-gray-600">
                Attach files (PDF, DOC, max 5MB)
              </p>
              <Button variant="outline" className="mt-2 text-xs">
                Browse Files
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <SendIcon className="w-4 h-4 mr-2" />
                Send Now
              </Button>
              <Button variant="primary" className="flex-1">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Scheduled Emails">
          <div className="space-y-3">
            {[
            {
              subject: 'March Fee Reminder',
              recipients: 'All Parents',
              scheduled: '1 Mar 2026, 09:00 AM',
              status: 'Scheduled'
            },
            {
              subject: 'Annual Day Invitation',
              recipients: 'All',
              scheduled: '28 Feb 2026, 10:00 AM',
              status: 'Scheduled'
            },
            {
              subject: 'Exam Timetable',
              recipients: 'Class 10 Parents',
              scheduled: '27 Feb 2026, 08:00 AM',
              status: 'Sent'
            }].
            map((email) =>
            <div
              key={email.subject}
              className="p-3 border border-gray-200 rounded-lg">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{email.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {email.recipients} • {email.scheduled}
                    </p>
                  </div>
                  <Badge variant={email.status === 'Sent' ? 'success' : 'info'}>
                    {email.status}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}