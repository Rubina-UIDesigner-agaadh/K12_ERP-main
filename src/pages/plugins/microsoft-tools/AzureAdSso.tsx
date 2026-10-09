import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save } from 'lucide-react';
export function AzureAdSso() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Azure AD SSO</h1>
          <p className="text-sm text-gray-500">
            Configure Single Sign-On with Azure Active Directory
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Config
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Azure AD SSO Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Azure AD SSO</p>
                <p className="text-xs text-gray-500">
                  Allow login with Microsoft accounts
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Azure AD Domain"
              defaultValue="school.onmicrosoft.com" />

            <Select
              label="SSO for Roles"
              options={[
              {
                value: 'all',
                label: 'All Users'
              },
              {
                value: 'staff',
                label: 'Staff Only'
              },
              {
                value: 'admin',
                label: 'Admin Only'
              }]
              }
              defaultValue="staff" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto-Provision Users</p>
                <p className="text-xs text-gray-500">
                  Create accounts from Azure AD directory
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Sync Azure AD Groups</p>
                <p className="text-xs text-gray-500">
                  Map AD groups to school roles
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="SSO Status">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">SSO Status</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Users with MS SSO</span>
              <span className="text-sm font-medium">245 / 342 staff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">AD Groups Synced</span>
              <span className="text-sm font-medium">8 groups</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm font-medium">25 Feb 2026, 10:00 AM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}