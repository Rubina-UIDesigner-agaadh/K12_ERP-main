import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, AlertTriangleIcon } from 'lucide-react';
export function BounceSpamHandling() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bounce & Spam Handling
          </h1>
          <p className="text-sm text-gray-500">
            Manage bounced emails, spam complaints and suppression lists
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">204</p>
            <p className="text-sm text-gray-500">Hard Bounces</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">48</p>
            <p className="text-sm text-gray-500">Soft Bounces</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-yellow-600">12</p>
            <p className="text-sm text-gray-500">Spam Complaints</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-600">264</p>
            <p className="text-sm text-gray-500">Suppressed Emails</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bounce Handling Rules">
          <div className="space-y-4">
            <Select
              label="Hard Bounce Action"
              options={[
              {
                value: 'suppress',
                label: 'Add to Suppression List'
              },
              {
                value: 'notify',
                label: 'Notify Admin'
              },
              {
                value: 'both',
                label: 'Both'
              }]
              }
              defaultValue="both" />

            <Input
              label="Soft Bounce Retry Attempts"
              type="number"
              defaultValue="3" />

            <Input
              label="Retry Interval (hours)"
              type="number"
              defaultValue="24" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto-Update Contact Email</p>
                <p className="text-xs text-gray-500">
                  Flag bounced emails for admin review
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="Suppression List">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add email to suppress..."
                className="flex-1" />

              <Button variant="outline">Add</Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
              'invalid@bad.com',
              'noemail@test.com',
              'bounced@example.com'].
              map((email) =>
              <div
                key={email}
                className="flex items-center justify-between p-2 bg-gray-50 rounded">

                  <span className="text-sm font-mono">{email}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">Suppressed</Badge>
                    <button className="text-red-500 text-xs hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>);

}