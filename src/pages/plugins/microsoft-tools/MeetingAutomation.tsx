import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, VideoIcon, PlusIcon } from 'lucide-react';
export function MeetingAutomation() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Microsoft Teams Meeting Automation
          </h1>
          <p className="text-sm text-gray-500">
            Automate Teams meeting creation for classes, PTMs and staff meetings
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Auto-Meeting Rules">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Auto-Create for Online Classes
                </p>
                <p className="text-xs text-gray-500">
                  Generate Teams link for each online class
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">PTM Meeting Auto-Create</p>
                <p className="text-xs text-gray-500">
                  Create Teams meetings for parent-teacher meetings
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Staff Meeting Auto-Create</p>
                <p className="text-xs text-gray-500">
                  Auto-schedule recurring staff meetings
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
                <p className="text-sm font-medium">Auto-Record Meetings</p>
                <p className="text-xs text-gray-500">
                  Record and save to SharePoint
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
          </div>
        </Card>
        <Card title="Upcoming Automated Meetings">
          <div className="space-y-3">
            {[
            {
              title: 'Class 10-A - Mathematics',
              time: '26 Feb, 09:00 AM',
              type: 'Online Class',
              status: 'Scheduled'
            },
            {
              title: 'Class 9-B - Science',
              time: '26 Feb, 10:00 AM',
              type: 'Online Class',
              status: 'Scheduled'
            },
            {
              title: 'Staff Meeting - Feb',
              time: '27 Feb, 04:00 PM',
              type: 'Staff Meeting',
              status: 'Pending'
            }].
            map((meeting) =>
            <div
              key={meeting.title}
              className="p-3 border border-gray-200 rounded-lg">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {meeting.time} • {meeting.type}
                    </p>
                  </div>
                  <Badge
                  variant={
                  meeting.status === 'Scheduled' ? 'success' : 'warning'
                  }>

                    {meeting.status}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}