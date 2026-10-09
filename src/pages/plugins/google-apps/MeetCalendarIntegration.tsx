import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, CalendarIcon, VideoIcon } from 'lucide-react';
export function MeetCalendarIntegration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Google Meet & Calendar Integration
          </h1>
          <p className="text-sm text-gray-500">
            Integrate Google Meet for virtual classes and Google Calendar for
            scheduling
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Google Meet Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto-Create Meet Links</p>
                <p className="text-xs text-gray-500">
                  Generate Meet link for each online class
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Record Sessions</p>
                <p className="text-xs text-gray-500">
                  Auto-record and save to Google Drive
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <Select
              label="Default Meeting Duration"
              options={[
              {
                value: '45',
                label: '45 minutes'
              },
              {
                value: '60',
                label: '60 minutes'
              },
              {
                value: '90',
                label: '90 minutes'
              }]
              }
              defaultValue="45" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Send Calendar Invites</p>
                <p className="text-xs text-gray-500">
                  Auto-send invites to students and teachers
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
          <div className="space-y-4">
            <div className="space-y-3">
              {[
              {
                item: 'Timetable → Google Calendar',
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
                item: 'PTM Schedule → Calendar',
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
          </div>
        </Card>
      </div>
    </div>);

}