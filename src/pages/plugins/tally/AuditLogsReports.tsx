import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon } from 'lucide-react';
export function AuditLogsReports() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tally Audit Logs & Reports
          </h1>
          <p className="text-sm text-gray-500">
            Complete audit trail of all Tally sync and posting activities
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Audit Log
        </Button>
      </div>
      <Card title="Audit Log">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input type="date" className="w-40" />
            <Input type="date" className="w-40" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Actions'
              },
              {
                value: 'sync',
                label: 'Sync'
              },
              {
                value: 'export',
                label: 'Export'
              },
              {
                value: 'error',
                label: 'Error'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Records
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">25 Feb 2026, 11:00</td>
                  <td className="py-3 px-4">Auto Sync - Vouchers</td>
                  <td className="py-3 px-4">System</td>
                  <td className="py-3 px-4">156</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Partial</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">24 Feb 2026, 17:30</td>
                  <td className="py-3 px-4">Manual Export</td>
                  <td className="py-3 px-4">Admin</td>
                  <td className="py-3 px-4">342</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}