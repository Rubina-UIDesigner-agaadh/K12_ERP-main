import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { DownloadIcon, UploadIcon } from 'lucide-react';
export function ExportImportControls() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Export / Import Controls
          </h1>
          <p className="text-sm text-gray-500">
            Manually export data to Tally XML format or import Tally data
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Export to Tally">
          <div className="space-y-4">
            <Select
              label="Export Type"
              options={[
              {
                value: 'vouchers',
                label: 'Vouchers'
              },
              {
                value: 'ledgers',
                label: 'Ledgers'
              },
              {
                value: 'masters',
                label: 'Masters'
              }]
              }
              defaultValue="vouchers" />

            <Input label="From Date" type="date" />
            <Input label="To Date" type="date" />
            <Select
              label="Format"
              options={[
              {
                value: 'xml',
                label: 'Tally XML'
              },
              {
                value: 'csv',
                label: 'CSV'
              }]
              }
              defaultValue="xml" />

            <Button variant="primary" className="w-full">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </Card>
        <Card title="Import from Tally">
          <div className="space-y-4">
            <Select
              label="Import Type"
              options={[
              {
                value: 'ledgers',
                label: 'Ledger List'
              },
              {
                value: 'groups',
                label: 'Groups'
              },
              {
                value: 'vouchers',
                label: 'Vouchers'
              }]
              }
              defaultValue="ledgers" />

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drop Tally XML file here or
              </p>
              <Button variant="outline" className="mt-2">
                Browse File
              </Button>
            </div>
            <Button variant="primary" className="w-full">
              <UploadIcon className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}