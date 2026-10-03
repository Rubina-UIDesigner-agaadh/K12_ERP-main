import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon, CheckCircleIcon } from 'lucide-react';
export function Microsoft365Auth() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Microsoft 365 Authentication
          </h1>
          <p className="text-sm text-gray-500">
            Configure Microsoft 365 / Azure AD credentials and tenant settings
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
        <Card title="Azure AD Configuration">
          <div className="space-y-4">
            <Input label="Tenant ID" placeholder="Enter Azure Tenant ID..." />
            <Input
              label="Client ID (Application ID)"
              placeholder="Enter Client ID..." />

            <Input
              label="Client Secret"
              type="password"
              placeholder="Enter Client Secret..." />

            <Input
              label="Redirect URI"
              defaultValue="https://school.edu/auth/microsoft/callback" />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Required Permissions
              </p>
              {[
              'Mail.Send',
              'Calendars.ReadWrite',
              'Files.ReadWrite',
              'Teams.ReadWrite',
              'User.Read'].
              map((perm) =>
              <div key={perm} className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  defaultChecked />

                  <span className="text-sm text-gray-700 font-mono text-xs">
                    {perm}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card title="Connection Status">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Microsoft 365 Connected
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Tenant: school.onmicrosoft.com
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Access Token</span>
                <Badge variant="success">Valid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Azure AD</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Teams API</span>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SharePoint</span>
                <Badge variant="warning">Pending Setup</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}