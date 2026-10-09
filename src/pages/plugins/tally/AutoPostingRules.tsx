import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save } from 'lucide-react';
export function AutoPostingRules() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Auto Posting Rules
          </h1>
          <p className="text-sm text-gray-500">
            Define rules for automatic voucher posting to Tally on transaction
            events
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Rules
        </Button>
      </div>
      <Card title="Posting Rules">
        <div className="space-y-4">
          {[
          {
            trigger: 'Fee Receipt Generated',
            action: 'Post Receipt Voucher',
            ledger: 'Cash/Bank → Fee Income',
            status: true
          },
          {
            trigger: 'Online Payment Confirmed',
            action: 'Post Receipt Voucher',
            ledger: 'Bank → Fee Income',
            status: true
          },
          {
            trigger: 'Fee Refund Processed',
            action: 'Post Payment Voucher',
            ledger: 'Fee Income → Bank',
            status: true
          },
          {
            trigger: 'Expense Approved',
            action: 'Post Payment Voucher',
            ledger: 'Expense Head → Bank',
            status: false
          },
          {
            trigger: 'Scholarship Applied',
            action: 'Post Journal Voucher',
            ledger: 'Scholarship Expense → Fee Income',
            status: true
          }].
          map((rule) =>
          <div
            key={rule.trigger}
            className="p-4 border border-gray-200 rounded-lg">

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rule.trigger}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Action: {rule.action}
                  </p>
                  <p className="text-xs text-gray-500">Ledger: {rule.ledger}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={rule.status ? 'success' : 'warning'}>
                    {rule.status ? 'Active' : 'Inactive'}
                  </Badge>
                  <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  defaultChecked={rule.status} />

                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}