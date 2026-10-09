import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
export function ApiTokenManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Google API Token Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage OAuth tokens and service account keys for Google APIs
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Generate Token
        </Button>
      </div>
      <Card title="Active Tokens">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Token Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  API
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Created
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Expires
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[
              {
                name: 'Classroom Sync Token',
                api: 'Google Classroom',
                created: '01 Jan 2026',
                expires: '01 Jan 2027',
                status: 'Active'
              },
              {
                name: 'Drive Sync Token',
                api: 'Google Drive',
                created: '01 Jan 2026',
                expires: '01 Jan 2027',
                status: 'Active'
              },
              {
                name: 'Calendar Token',
                api: 'Google Calendar',
                created: '15 Jan 2026',
                expires: '15 Jan 2027',
                status: 'Active'
              },
              {
                name: 'Gmail Token',
                api: 'Gmail API',
                created: '01 Feb 2026',
                expires: '01 Feb 2027',
                status: 'Expiring Soon'
              }].
              map((token) =>
              <tr
                key={token.name}
                className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4 font-medium">{token.name}</td>
                  <td className="py-3 px-4">{token.api}</td>
                  <td className="py-3 px-4">{token.created}</td>
                  <td className="py-3 px-4">{token.expires}</td>
                  <td className="py-3 px-4">
                    <Badge
                    variant={
                    token.status === 'Active' ? 'success' : 'warning'
                    }>

                      {token.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <RefreshCwIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}