import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon } from 'lucide-react';
export function PaymentAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Insights on online payment trends, success rates and collection
            patterns
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">₹4.82Cr</p>
            <p className="text-sm text-gray-500">Total Collected (Year)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">97.1%</p>
            <p className="text-sm text-gray-500">Success Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">68%</p>
            <p className="text-sm text-gray-500">Online Adoption</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">UPI 54%</p>
            <p className="text-sm text-gray-500">Top Payment Mode</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Payment Mode Breakdown">
          <div className="space-y-3">
            {[
            {
              mode: 'UPI',
              pct: 54,
              color: 'bg-blue-500'
            },
            {
              mode: 'Net Banking',
              pct: 22,
              color: 'bg-green-500'
            },
            {
              mode: 'Credit/Debit Card',
              pct: 18,
              color: 'bg-purple-500'
            },
            {
              mode: 'Wallet',
              pct: 6,
              color: 'bg-orange-500'
            }].
            map((item) =>
            <div key={item.mode} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-36">{item.mode}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{
                    width: `${item.pct}%`
                  }} />

                </div>
                <span className="text-sm text-gray-600 w-10 text-right">
                  {item.pct}%
                </span>
              </div>
            )}
          </div>
        </Card>
        <Card title="Monthly Collection Trend">
          <div className="space-y-2">
            {[
            {
              month: 'Oct',
              amount: '₹38.2L'
            },
            {
              month: 'Nov',
              amount: '₹42.1L'
            },
            {
              month: 'Dec',
              amount: '₹28.4L'
            },
            {
              month: 'Jan',
              amount: '₹51.8L'
            },
            {
              month: 'Feb',
              amount: '₹48.2L'
            }].
            map((item) =>
            <div key={item.month} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{item.month}</span>
                <div className="flex-1 bg-blue-100 rounded p-2 text-sm font-medium text-blue-700">
                  {item.amount}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>);

}