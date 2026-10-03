import React from 'react';
import { Activity, Filter, Eye, Shield } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
export function MyDataAccessLog() {
  const logs = [
  {
    id: 1,
    date: '10-Nov-2024 14:30',
    actor: 'Self',
    action: 'View',
    area: 'Payslip',
    details: 'Downloaded Oct 2024 Payslip'
  },
  {
    id: 2,
    date: '09-Nov-2024 10:15',
    actor: 'Admin (HR)',
    action: 'Update',
    area: 'Profile',
    details: 'Updated address details per request'
  },
  {
    id: 3,
    date: '08-Nov-2024 09:00',
    actor: 'System',
    action: 'Process',
    area: 'Attendance',
    details: 'Monthly attendance calculation'
  }];

  const columns = [
  {
    key: 'date',
    header: 'Date & Time'
  },
  {
    key: 'actor',
    header: 'Performed By'
  },
  {
    key: 'action',
    header: 'Action',
    render: (row: any) =>
    <Badge
      variant={
      row.action === 'Update' ?
      'warning' :
      row.action === 'View' ?
      'info' :
      'default'
      }>

          {row.action}
        </Badge>

  },
  {
    key: 'area',
    header: 'Data Area'
  },
  {
    key: 'details',
    header: 'Details'
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Access Log</h1>
        <p className="text-sm text-gray-500">
          Transparency log showing who accessed or modified your data.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <Input type="date" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Areas'
              },
              {
                value: 'profile',
                label: 'Profile'
              },
              {
                value: 'finance',
                label: 'Finance'
              },
              {
                value: 'medical',
                label: 'Medical'
              }]
              } />

            <Select
              options={[
              {
                value: 'all',
                label: 'All Actions'
              },
              {
                value: 'view',
                label: 'View'
              },
              {
                value: 'update',
                label: 'Update'
              }]
              } />

          </div>
        </div>

        <Table columns={columns} data={logs} />
      </Card>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
        <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Audit Policy</h4>
          <p className="text-sm text-gray-600 mt-1">
            This log displays key access events for the last 90 days. Routine
            system operations may be grouped.
          </p>
        </div>
      </div>
    </div>);

}