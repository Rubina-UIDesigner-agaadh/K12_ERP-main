import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, CheckCircleIcon } from 'lucide-react';
export function AutoReconciliation() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Auto Reconciliation
          </h1>
          <p className="text-sm text-gray-500">
            Automatically reconcile gateway settlements with school fee records
          </p>
        </div>
        <Button variant="primary">
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Run Reconciliation
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">2,799</p>
            <p className="text-sm text-gray-500">Reconciled</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">42</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">5</p>
            <p className="text-sm text-gray-500">Mismatches</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">₹47.8L</p>
            <p className="text-sm text-gray-500">Reconciled Amount</p>
          </div>
        </Card>
      </div>
      <Card title="Reconciliation Summary">
        <div className="space-y-3">
          {[
          {
            date: '25 Feb 2026',
            gateway: '₹4,82,150',
            school: '₹4,82,150',
            diff: '₹0',
            status: 'Matched'
          },
          {
            date: '24 Feb 2026',
            gateway: '₹3,91,200',
            school: '₹3,91,200',
            diff: '₹0',
            status: 'Matched'
          },
          {
            date: '23 Feb 2026',
            gateway: '₹5,12,400',
            school: '₹5,11,900',
            diff: '₹500',
            status: 'Mismatch'
          }].
          map((row) =>
          <div
            key={row.date}
            className={`p-4 rounded-lg border ${row.status === 'Matched' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{row.date}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-600">
                    <span>Gateway: {row.gateway}</span>
                    <span>School: {row.school}</span>
                    <span>Diff: {row.diff}</span>
                  </div>
                </div>
                <Badge
                variant={row.status === 'Matched' ? 'success' : 'danger'}>

                  {row.status}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}