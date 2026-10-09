import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, ShieldIcon, ClockIcon } from 'lucide-react';
export function SecurityExpiryControls() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Security & Expiry Controls
          </h1>
          <p className="text-sm text-gray-500">
            Configure code security, expiry policies and anti-tampering rules
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Expiry Settings">
          <div className="space-y-4">
            <Select
              label="Default Expiry Policy"
              options={[
              {
                value: 'never',
                label: 'Never Expire'
              },
              {
                value: 'academic-year',
                label: 'Academic Year End'
              },
              {
                value: 'custom',
                label: 'Custom Duration'
              }]
              }
              defaultValue="academic-year" />

            <Input
              label="Custom Expiry (Days)"
              type="number"
              defaultValue="365" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Auto-Renew on New Session
                </p>
                <p className="text-xs text-gray-500">
                  Automatically regenerate codes at session start
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Expiry Warning Notification
                </p>
                <p className="text-xs text-gray-500">
                  Notify admin before codes expire
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Warning Days Before Expiry"
              type="number"
              defaultValue="30" />

          </div>
        </Card>

        <Card title="Security Controls">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Encrypted QR Codes
                </p>
                <p className="text-xs text-gray-500">
                  Use AES-256 encryption for QR data
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  One-Time Use Codes
                </p>
                <p className="text-xs text-gray-500">
                  Invalidate code after first scan (for events)
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Duplicate Scan Detection
                </p>
                <p className="text-xs text-gray-500">
                  Alert on same code scanned twice in short interval
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Duplicate Scan Window (seconds)"
              type="number"
              defaultValue="30" />

            <Select
              label="On Expired Code Scan"
              options={[
              {
                value: 'deny',
                label: 'Deny & Alert Admin'
              },
              {
                value: 'deny-log',
                label: 'Deny & Log Only'
              },
              {
                value: 'warn',
                label: 'Warn & Allow'
              }]
              }
              defaultValue="deny" />

          </div>
        </Card>
      </div>
    </div>);

}