import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, PhoneIcon } from 'lucide-react';
export function IvrAutoCallSetup() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            IVR / Auto Call Setup
          </h1>
          <p className="text-sm text-gray-500">
            Configure IVR menus and automated voice call notifications
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Config
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="IVR Configuration">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable IVR System</p>
                <p className="text-xs text-gray-500">
                  Interactive Voice Response for inbound calls
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input label="IVR Phone Number" defaultValue="+91 79 2345 6789" />
            <Select
              label="IVR Provider"
              options={[
              {
                value: 'exotel',
                label: 'Exotel'
              },
              {
                value: 'knowlarity',
                label: 'Knowlarity'
              },
              {
                value: 'ozonetel',
                label: 'Ozonetel'
              }]
              }
              defaultValue="exotel" />

            <Input
              label="Welcome Message (Text-to-Speech)"
              defaultValue="Welcome to ABC School. Press 1 for attendance, Press 2 for fees, Press 3 for results." />

            <Input
              label="Business Hours (From)"
              type="time"
              defaultValue="08:00" />

            <Input
              label="Business Hours (To)"
              type="time"
              defaultValue="18:00" />

          </div>
        </Card>
        <Card title="Auto Call Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Call on Absence</p>
                <p className="text-xs text-gray-500">
                  Call parent when student is absent
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Fee Due Auto Call</p>
                <p className="text-xs text-gray-500">
                  Automated reminder call for fee defaulters
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Emergency Broadcast Call</p>
                <p className="text-xs text-gray-500">
                  Mass call for urgent announcements
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Select
              label="Call Retry Attempts"
              options={[
              {
                value: '1',
                label: '1 attempt'
              },
              {
                value: '2',
                label: '2 attempts'
              },
              {
                value: '3',
                label: '3 attempts'
              }]
              }
              defaultValue="2" />

          </div>
        </Card>
      </div>
    </div>);

}