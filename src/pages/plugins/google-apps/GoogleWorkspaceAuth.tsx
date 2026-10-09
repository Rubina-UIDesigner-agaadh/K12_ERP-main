import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon, CheckCircleIcon } from 'lucide-react';
export function GoogleWorkspaceAuth() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Google Workspace Authentication
          </h1>
          <p className="text-sm text-gray-500">
            Configure Google Workspace OAuth and service account credentials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Test Auth
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="OAuth 2.0 Configuration">
          <div className="space-y-4">
            <Input label="Google Workspace Domain" defaultValue="school.edu" />
            <Input label="Client ID" placeholder="Enter OAuth Client ID..." />
            <Input
              label="Client Secret"
              type="password"
              placeholder="Enter Client Secret..." />

            <Input
              label="Redirect URI"
              defaultValue="https://school.edu/auth/google/callback" />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Required Scopes
              </p>
              {[
              'Gmail API',
              'Google Calendar',
              'Google Classroom',
              'Google Drive',
              'Google Meet'].
              map((scope) =>
              <div key={scope} className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  defaultChecked />

                  <span className="text-sm text-gray-700">{scope}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card title="Connection Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Google Workspace Connected
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Domain: school.edu • 342 users synced
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">OAuth Token</span>
                <Badge variant="success">Valid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service Account</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Admin SDK</span>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Classroom API</span>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}