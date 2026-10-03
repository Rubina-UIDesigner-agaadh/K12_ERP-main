import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, DownloadIcon } from 'lucide-react';
export function VoucherFeeSync() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Voucher & Fee Sync
          </h1>
          <p className="text-sm text-gray-500">
            Sync fee collection vouchers and receipts with Tally
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
          <Button variant="primary">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">2,841</p>
            <p className="text-sm text-gray-500">Vouchers Pending Sync</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">48,291</p>
            <p className="text-sm text-gray-500">Synced (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">12</p>
            <p className="text-sm text-gray-500">Sync Errors</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">25 Feb 2026</p>
            <p className="text-sm text-gray-500">Last Sync</p>
          </div>
        </Card>
      </div>
      <Card title="Voucher Sync Queue">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'receipt',
                label: 'Fee Receipt'
              },
              {
                value: 'payment',
                label: 'Payment'
              }]
              }
              defaultValue="all" />

            <Select
              options={[
              {
                value: 'pending',
                label: 'Pending Sync'
              },
              {
                value: 'synced',
                label: 'Synced'
              },
              {
                value: 'error',
                label: 'Error'
              }]
              }
              defaultValue="pending" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Voucher No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Sync Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">REC-2026-4821</td>
                  <td className="py-3 px-4">Fee Receipt</td>
                  <td className="py-3 px-4">₹12,500</td>
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Pending</Badge>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">REC-2026-4820</td>
                  <td className="py-3 px-4">Fee Receipt</td>
                  <td className="py-3 px-4">₹8,000</td>
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Synced</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}