import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCw, Hash, Edit2 } from 'lucide-react';
export function IdNumberSeriesViewerSync() {
  const series = [
  {
    id: 1,
    entity: 'Student Admission',
    prefix: 'ADM-2024-',
    current: 1245,
    lastUsed: 'Today 10:30 AM'
  },
  {
    id: 2,
    entity: 'Fee Receipt',
    prefix: 'RCPT/24-25/',
    current: 5678,
    lastUsed: 'Today 11:15 AM'
  },
  {
    id: 3,
    entity: 'Employee Code',
    prefix: 'EMP',
    current: 156,
    lastUsed: 'Yesterday'
  },
  {
    id: 4,
    entity: 'Library Accession',
    prefix: 'LIB-',
    current: 8900,
    lastUsed: '2 days ago'
  }];

  const columns = [
  {
    key: 'entity',
    header: 'Entity Name'
  },
  {
    key: 'prefix',
    header: 'Prefix',
    render: (row: any) =>
    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {row.prefix}
        </span>

  },
  {
    key: 'current',
    header: 'Current Sequence',
    render: (row: any) => <span className="font-bold">{row.current}</span>
  },
  {
    key: 'lastUsed',
    header: 'Last Used'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs" title="Sync/Check Gaps">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs" title="Edit Sequence">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Number Series Viewer
          </h1>
          <p className="text-sm text-gray-500">
            View and synchronize auto-incrementing number sequences
          </p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync All Series
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={series} />
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
        <div className="flex gap-2">
          <Hash className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold mb-1">About Number Series Sync</p>
            <p>
              The synchronization tool checks for gaps in number sequences that
              may occur due to failed transactions or deleted records. It
              ensures the &quot;Current Sequence&quot; matches the actual
              maximum value in the database.
            </p>
          </div>
        </div>
      </div>
    </div>);

}