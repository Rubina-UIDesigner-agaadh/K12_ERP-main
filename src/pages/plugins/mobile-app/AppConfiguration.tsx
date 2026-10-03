import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, SmartphoneIcon } from 'lucide-react';
export function AppConfiguration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            App Configuration & Feature Control
          </h1>
          <p className="text-sm text-gray-500">
            Configure mobile app settings, branding and feature toggles
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="App Branding">
          <div className="space-y-4">
            <Input label="App Name" defaultValue="School Connect" />
            <Input
              label="App Tagline"
              defaultValue="Your school in your pocket" />

            <Input label="Primary Color (Hex)" defaultValue="#1D4ED8" />
            <Input label="Support Email" defaultValue="support@school.edu" />
            <Input label="App Version" defaultValue="2.4.1" />
          </div>
        </Card>
        <Card title="Feature Toggles">
          <div className="space-y-3">
            {[
            {
              label: 'Attendance View',
              desc: 'Students/parents can view attendance',
              enabled: true
            },
            {
              label: 'Fee Payment',
              desc: 'Online fee payment via app',
              enabled: true
            },
            {
              label: 'Homework Submission',
              desc: 'Submit assignments through app',
              enabled: true
            },
            {
              label: 'Live Transport Tracking',
              desc: 'GPS tracking for parents',
              enabled: true
            },
            {
              label: 'Library Catalog',
              desc: 'Browse and request library books',
              enabled: false
            },
            {
              label: 'Timetable View',
              desc: 'View class timetable',
              enabled: true
            },
            {
              label: 'Result / Report Card',
              desc: 'View exam results',
              enabled: true
            }].
            map((feature) =>
            <div
              key={feature.label}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {feature.label}
                  </p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
                <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked={feature.enabled} />

              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}