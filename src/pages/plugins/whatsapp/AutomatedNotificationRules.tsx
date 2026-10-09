import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, PlusIcon } from 'lucide-react';
export function AutomatedNotificationRules() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Automated Notification Rules
          </h1>
          <p className="text-sm text-gray-500">
            Configure trigger-based WhatsApp notifications for school events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>
      <Card title="Notification Rules">
        <div className="space-y-4">
          {[
          {
            event: 'Student Absent',
            template: 'attendance_absent_alert',
            recipient: 'Parent',
            status: true
          },
          {
            event: 'Fee Due (3 days)',
            template: 'fee_due_reminder',
            recipient: 'Parent',
            status: true
          },
          {
            event: 'Fee Paid',
            template: 'fee_payment_confirmation',
            recipient: 'Parent',
            status: true
          },
          {
            event: 'Exam Result Published',
            template: 'result_notification',
            recipient: 'Parent & Student',
            status: true
          },
          {
            event: 'Holiday Announcement',
            template: 'holiday_notice',
            recipient: 'All',
            status: false
          },
          {
            event: 'Bus Delayed (>10 min)',
            template: 'transport_delay_alert',
            recipient: 'Parent',
            status: true
          },
          {
            event: 'New Circular Published',
            template: 'circular_notification',
            recipient: 'Parent',
            status: false
          }].
          map((rule) =>
          <div
            key={rule.event}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {rule.event}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Template: <span className="font-mono">{rule.template}</span> →{' '}
                  {rule.recipient}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={rule.status ? 'success' : 'warning'}>
                  {rule.status ? 'Active' : 'Inactive'}
                </Badge>
                <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked={rule.status} />

              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}