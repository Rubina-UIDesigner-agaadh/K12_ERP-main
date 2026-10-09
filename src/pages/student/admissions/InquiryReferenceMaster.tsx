import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
export function InquiryReferenceMaster() {
  const references = [
  {
    id: 1,
    name: 'Newspaper Advertisement',
    code: 'REF-001',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Social Media (Facebook/Instagram)',
    code: 'REF-002',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Friend / Relative Referral',
    code: 'REF-003',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Website Inquiry',
    code: 'REF-004',
    status: 'Active'
  }];

  const columns = [
  {
    key: 'code',
    header: 'Code',
    render: (row: any) =>
    <span className="font-mono text-xs">{row.code}</span>

  },
  {
    key: 'name',
    header: 'Reference Source',
    render: (row: any) => <span className="font-medium">{row.name}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => <Badge variant="success">{row.status}</Badge>
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inquiry Reference Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage sources of admission inquiries
          </p>
        </div>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Reference Sources">
            <Table columns={columns} data={references} />
          </Card>
        </div>

        <div>
          <Card title="Add New Source">
            <div className="space-y-4">
              <Input label="Source Name" placeholder="e.g. Radio Campaign" />
              <Input label="Short Code" placeholder="e.g. REF-005" />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-600"
                  defaultChecked />

                <span className="text-sm text-gray-700">Active</span>
              </div>
              <Button className="w-full mt-2">Save Source</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}