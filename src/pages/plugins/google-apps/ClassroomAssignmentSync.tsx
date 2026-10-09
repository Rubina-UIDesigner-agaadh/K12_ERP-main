import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, Save } from 'lucide-react';
export function ClassroomAssignmentSync() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Classroom & Assignment Sync
          </h1>
          <p className="text-sm text-gray-500">
            Sync Google Classroom courses and assignments with the school system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-500">Classrooms Synced</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">342</p>
            <p className="text-sm text-gray-500">Assignments Synced</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">1,248</p>
            <p className="text-sm text-gray-500">Students Enrolled</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-sm text-gray-500">Pending Sync</p>
          </div>
        </Card>
      </div>
      <Card title="Sync Configuration">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Sync Direction"
              options={[
              {
                value: 'both',
                label: 'Bidirectional'
              },
              {
                value: 'to-google',
                label: 'School → Google'
              },
              {
                value: 'from-google',
                label: 'Google → School'
              }]
              }
              defaultValue="both" />

            <Select
              label="Sync Frequency"
              options={[
              {
                value: 'realtime',
                label: 'Real-time'
              },
              {
                value: 'hourly',
                label: 'Every Hour'
              },
              {
                value: 'daily',
                label: 'Daily'
              }]
              }
              defaultValue="hourly" />

          </div>
          <div className="space-y-3">
            {[
            {
              item: 'Course / Class Sync',
              enabled: true
            },
            {
              item: 'Assignment Sync',
              enabled: true
            },
            {
              item: 'Student Enrollment Sync',
              enabled: true
            },
            {
              item: 'Grades / Marks Sync',
              enabled: false
            },
            {
              item: 'Submission Sync',
              enabled: true
            }].
            map((s) =>
            <div
              key={s.item}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                <span className="text-sm font-medium text-gray-900">
                  {s.item}
                </span>
                <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked={s.enabled} />

              </div>
            )}
          </div>
        </div>
      </Card>
    </div>);

}