import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, AlertTriangleIcon } from 'lucide-react';
export function ExceptionErrorHandling() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Exception & Error Handling
          </h1>
          <p className="text-sm text-gray-500">
            Manage biometric exceptions, failed verifications and manual
            overrides
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Rules
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">24</p>
            <p className="text-sm text-gray-500">Unmatched Punches</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">8</p>
            <p className="text-sm text-gray-500">Failed Verifications</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-yellow-600">12</p>
            <p className="text-sm text-gray-500">Manual Overrides Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500">Device Errors</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Exception Rules">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Allow Manual Override</p>
                <p className="text-xs text-gray-500">
                  Admin can manually mark attendance on bio failure
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Alert on Repeated Failures
                </p>
                <p className="text-xs text-gray-500">
                  Notify admin if same user fails 3+ times
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Select
              label="On Unmatched Punch"
              options={[
              {
                value: 'log',
                label: 'Log Only'
              },
              {
                value: 'alert',
                label: 'Alert Admin'
              },
              {
                value: 'both',
                label: 'Log & Alert'
              }]
              }
              defaultValue="both" />

            <Select
              label="Fallback Method"
              options={[
              {
                value: 'pin',
                label: 'PIN Entry'
              },
              {
                value: 'card',
                label: 'Card Swipe'
              },
              {
                value: 'manual',
                label: 'Manual Entry'
              }]
              }
              defaultValue="pin" />

          </div>
        </Card>
        <Card title="Pending Exceptions">
          <div className="space-y-3">
            {[
            {
              name: 'Rahul Sharma',
              issue: 'Fingerprint not matched',
              time: '08:32 AM',
              action: 'Override'
            },
            {
              name: 'Unknown User',
              issue: 'User not enrolled',
              time: '08:28 AM',
              action: 'Enroll'
            },
            {
              name: 'Priya Patel',
              issue: 'Device timeout',
              time: '08:15 AM',
              action: 'Retry'
            }].
            map((exc) =>
            <div
              key={exc.name + exc.time}
              className="p-3 border border-orange-200 bg-orange-50 rounded-lg">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {exc.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {exc.issue} • {exc.time}
                    </p>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline font-medium">
                    {exc.action}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}