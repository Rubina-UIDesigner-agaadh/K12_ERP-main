import React from 'react';
import { CheckCircle, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
export function MyPolicyAcknowledgements() {
  const history = [
  {
    id: 1,
    policy: 'IT Acceptable Use Policy',
    version: 'v2.0',
    date: '10-Jan-2024 09:15 AM',
    channel: 'First Login',
    status: 'Current'
  },
  {
    id: 2,
    policy: 'Code of Conduct',
    version: 'v1.5',
    date: '15-Jun-2023 02:30 PM',
    channel: 'Manual',
    status: 'Outdated'
  },
  {
    id: 3,
    policy: 'Data Privacy Statement',
    version: 'v1.0',
    date: '01-Jan-2023 10:00 AM',
    channel: 'First Login',
    status: 'Current'
  }];

  const columns = [
  {
    key: 'policy',
    header: 'Policy Name'
  },
  {
    key: 'version',
    header: 'Version'
  },
  {
    key: 'date',
    header: 'Acknowledged On'
  },
  {
    key: 'channel',
    header: 'Channel'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge
      variant={row.status === 'Current' ? 'success' : 'warning'}
      className="flex items-center gap-1 w-fit">

          {row.status === 'Current' ?
      <CheckCircle className="w-3 h-3" /> :

      <AlertTriangle className="w-3 h-3" />
      }
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Action',
    render: () =>
    <Button variant="ghost" size="xs">
          <FileText className="w-4 h-4 mr-1" /> View
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Acknowledgements</h1>
        <p className="text-sm text-gray-500">
          History of policies you have read and accepted.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
          <Clock className="w-4 h-4" />
          This log is read-only and serves as an official record of your policy
          acceptances.
        </div>
        <Table columns={columns} data={history} />
      </Card>
    </div>);

}