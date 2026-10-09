import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Save } from 'lucide-react';
export function RoleBasedAccessSetup() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Role-Based Access Setup
          </h1>
          <p className="text-sm text-gray-500">
            Define which app features are accessible to each user role
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Access Rules
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['Student', 'Parent', 'Teacher', 'Admin'].map((role) =>
        <Card key={role} title={`${role} Role`}>
            <div className="space-y-2">
              {[
            'Dashboard',
            'Attendance',
            'Fees',
            'Timetable',
            'Results',
            'Homework',
            'Notifications',
            'Transport Tracking',
            'Library',
            'Communication'].
            map((feature) =>
            <div
              key={feature}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">

                  <span className="text-sm text-gray-700">{feature}</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-xs text-gray-500">
                      <input
                    type="checkbox"
                    className="h-3.5 w-3.5 text-blue-600 rounded border-gray-300"
                    defaultChecked />

                      View
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-500">
                      <input
                    type="checkbox"
                    className="h-3.5 w-3.5 text-blue-600 rounded border-gray-300"
                    defaultChecked={role === 'Admin' || role === 'Teacher'} />

                      Edit
                    </label>
                  </div>
                </div>
            )}
            </div>
          </Card>
        )}
      </div>
    </div>);

}