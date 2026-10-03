import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, PlusIcon, LinkIcon } from 'lucide-react';
export function CompanyLedgerMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Company & Ledger Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Map school accounts and fee heads to Tally company ledgers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Mapping
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tally Company Configuration">
          <div className="space-y-4">
            <Input label="Tally Company Name" defaultValue="ABC School Trust" />
            <Input
              label="Tally Server URL"
              defaultValue="http://localhost:9000" />

            <Input label="Username" defaultValue="admin" />
            <Input label="Password" type="password" defaultValue="••••••••" />
            <Select
              label="Financial Year"
              options={[
              {
                value: '2025-26',
                label: '2025-26'
              },
              {
                value: '2024-25',
                label: '2024-25'
              }]
              }
              defaultValue="2025-26" />

            <Button variant="outline" className="w-full">
              Test Connection
            </Button>
          </div>
        </Card>
        <Card title="Ledger Mappings">
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      School Account
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Tally Ledger
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                  {
                    school: 'Tuition Fee',
                    tally: 'Tuition Fee Income',
                    mapped: true
                  },
                  {
                    school: 'Transport Fee',
                    tally: 'Transport Income',
                    mapped: true
                  },
                  {
                    school: 'Library Fee',
                    tally: 'Library Income',
                    mapped: true
                  },
                  {
                    school: 'Exam Fee',
                    tally: '',
                    mapped: false
                  }].
                  map((row) =>
                  <tr
                    key={row.school}
                    className="border-b border-gray-100 hover:bg-gray-50">

                      <td className="py-2 px-3">{row.school}</td>
                      <td className="py-2 px-3">
                        {row.tally ||
                      <span className="text-gray-400 italic">
                            Not mapped
                          </span>
                      }
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant={row.mapped ? 'success' : 'warning'}>
                          {row.mapped ? 'Mapped' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}