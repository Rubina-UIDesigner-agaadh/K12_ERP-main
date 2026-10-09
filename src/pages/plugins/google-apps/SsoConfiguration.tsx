import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save } from 'lucide-react';
export function SsoConfiguration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Google SSO Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Configure Single Sign-On with Google Workspace accounts
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Config
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="SSO Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Google SSO</p>
                <p className="text-xs text-gray-500">
                  Allow login with Google Workspace accounts
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input label="Allowed Domain" defaultValue="school.edu" />
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
                <p className="text-sm font-medium">
                  Auto-Create Account on First Login
                </p>
                <p className="text-xs text-gray-500">
                  Create school account if Google user not found
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Force Google SSO for Staff
                </p>
                <p className="text-xs text-gray-500">
                  Disable password login for staff users
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300" />

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
              <span className="text-sm text-gray-600">
                Users with Google SSO
              </span>
              <span className="text-sm font-medium">298 / 342 staff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last SSO Login</span>
              <span className="text-sm font-medium">25 Feb 2026, 11:42 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Failed SSO Attempts (Today)
              </span>
              <span className="text-sm font-medium text-red-600">3</span>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}