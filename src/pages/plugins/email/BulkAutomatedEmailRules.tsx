import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Save, PlusIcon } from 'lucide-react';
export function BulkAutomatedEmailRules() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk & Automated Email Rules
          </h1>
          <p className="text-sm text-gray-500">
            Configure trigger-based automated emails and bulk email campaigns
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
      <Card title="Automated Email Rules">
        <div className="space-y-3">
          {[
          {
            trigger: 'Fee Receipt Generated',
            template: 'Fee Receipt',
            recipient: 'Parent',
            status: true
          },
          {
            trigger: 'Student Absent',
            template: 'Absent Alert',
            recipient: 'Parent',
            status: true
          },
          {
            trigger: 'Exam Schedule Published',
            template: 'Exam Schedule',
            recipient: 'Parent & Student',
            status: true
          },
          {
            trigger: 'New Admission',
            template: 'Welcome Email',
            recipient: 'Parent',
            status: true
          },
          {
            trigger: 'Password Reset Request',
            template: 'Password Reset',
            recipient: 'User',
            status: true
          },
          {
            trigger: 'Result Published',
            template: 'Result Published',
            recipient: 'Parent & Student',
            status: false
          },
          {
            trigger: 'Fee Due (7 days)',
            template: 'Fee Reminder',
            recipient: 'Parent',
            status: true
          }].
          map((rule) =>
          <div
            key={rule.trigger}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {rule.trigger}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Template: {rule.template} → {rule.recipient}
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