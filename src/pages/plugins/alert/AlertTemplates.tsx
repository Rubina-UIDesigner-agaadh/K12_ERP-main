import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, EditIcon, EyeIcon } from 'lucide-react';
export function AlertTemplates() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert Templates</h1>
          <p className="text-sm text-gray-500">
            Create and manage message templates for each alert type and channel
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Template List">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Channels'
                },
                {
                  value: 'sms',
                  label: 'SMS'
                },
                {
                  value: 'whatsapp',
                  label: 'WhatsApp'
                },
                {
                  value: 'email',
                  label: 'Email'
                }]
                }
                defaultValue="all" />

            </div>
            <div className="space-y-2">
              {[
              {
                name: 'Absent Alert - SMS',
                channel: 'SMS',
                alert: 'Student Absent',
                status: 'Active'
              },
              {
                name: 'Absent Alert - WhatsApp',
                channel: 'WhatsApp',
                alert: 'Student Absent',
                status: 'Active'
              },
              {
                name: 'Fee Reminder - Email',
                channel: 'Email',
                alert: 'Fee Overdue',
                status: 'Active'
              },
              {
                name: 'Bus Delay - SMS',
                channel: 'SMS',
                alert: 'Bus Delayed',
                status: 'Active'
              },
              {
                name: 'Emergency - All',
                channel: 'All',
                alert: 'Emergency',
                status: 'Active'
              }].
              map((tpl) =>
              <div
                key={tpl.name}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">

                  <div>
                    <p className="text-sm font-medium">{tpl.name}</p>
                    <p className="text-xs text-gray-500">
                      {tpl.channel} • {tpl.alert}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{tpl.status}</Badge>
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card title="Template Editor">
          <div className="space-y-4">
            <Input label="Template Name" placeholder="Enter template name..." />
            <Select
              label="Alert Type"
              options={[
              {
                value: 'absent',
                label: 'Student Absent'
              },
              {
                value: 'fee',
                label: 'Fee Overdue'
              },
              {
                value: 'transport',
                label: 'Bus Delayed'
              }]
              }
              defaultValue="absent" />

            <Select
              label="Channel"
              options={[
              {
                value: 'sms',
                label: 'SMS'
              },
              {
                value: 'whatsapp',
                label: 'WhatsApp'
              },
              {
                value: 'email',
                label: 'Email'
              },
              {
                value: 'push',
                label: 'Push Notification'
              }]
              }
              defaultValue="sms" />

            <Textarea
              label="Message Body"
              placeholder="Dear {parent_name}, your child {student_name} was absent on {date}..."
              rows={4} />

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">
                Available Variables:
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {'{student_name}'}, {'{parent_name}'}, {'{date}'}, {'{class}'},{' '}
                {'{school_name}'}
              </p>
            </div>
            <Button variant="primary" className="w-full">
              Save Template
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}