import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Save } from 'lucide-react';
export function OutlookCalendarIntegration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Outlook & Calendar Integration
          </h1>
          <p className="text-sm text-gray-500">
            Sync school events and schedules with Microsoft Outlook and Calendar
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Outlook Email Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Send via Outlook</p>
                <p className="text-xs text-gray-500">
                  Use Outlook as email provider
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Sync Sent Emails</p>
                <p className="text-xs text-gray-500">
                  Log Outlook emails in school system
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="Calendar Sync">
          <div className="space-y-3">
            {[
            {
              item: 'Timetable → Outlook Calendar',
              enabled: true
            },
            {
              item: 'Exam Schedule → Calendar',
              enabled: true
            },
            {
              item: 'School Events → Calendar',
              enabled: true
            },
            {
              item: 'Holidays → Calendar',
              enabled: true
            },
            {
              item: 'Staff Meetings → Calendar',
              enabled: false
            }].
            map((s) =>
            <div
              key={s.item}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                <span className="text-sm text-gray-900">{s.item}</span>
                <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked={s.enabled} />

              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}