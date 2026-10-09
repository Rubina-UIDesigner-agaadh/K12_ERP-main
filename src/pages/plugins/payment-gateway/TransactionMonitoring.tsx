import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';
export function TransactionMonitoring() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction Monitoring
          </h1>
          <p className="text-sm text-gray-500">
            Real-time monitoring of payment transactions and fraud detection
          </p>
        </div>
        <Button variant="outline">
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">142</p>
            <p className="text-sm text-gray-500">Transactions Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">138</p>
            <p className="text-sm text-gray-500">Successful</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">4</p>
            <p className="text-sm text-gray-500">Failed</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500">Suspicious</p>
          </div>
        </Card>
      </div>
      <Card title="Live Transaction Feed">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[
          {
            id: 'TXN-4821',
            student: 'Rahul Sharma',
            amount: '₹12,500',
            time: '11:42 AM',
            status: 'success'
          },
          {
            id: 'TXN-4820',
            student: 'Priya Patel',
            amount: '₹8,000',
            time: '11:38 AM',
            status: 'success'
          },
          {
            id: 'TXN-4819',
            student: 'Amit Singh',
            amount: '₹5,500',
            time: '11:31 AM',
            status: 'failed'
          },
          {
            id: 'TXN-4818',
            student: 'Sunita Verma',
            amount: '₹12,500',
            time: '11:25 AM',
            status: 'success'
          }].
          map((txn) =>
          <div
            key={txn.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">

              <div>
                <p className="text-sm font-medium">{txn.student}</p>
                <p className="text-xs text-gray-500">
                  {txn.id} • {txn.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{txn.amount}</span>
                <Badge
                variant={txn.status === 'success' ? 'success' : 'danger'}>

                  {txn.status}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}