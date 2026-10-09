import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon } from 'lucide-react';
export function EmailLogsReports() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Email Logs & Reports
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive email activity logs and performance reports
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
            <p className="text-2xl font-bold text-gray-900">1,48,291</p>
            <p className="text-sm text-gray-500">Total Emails (Year)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">98.4%</p>
            <p className="text-sm text-gray-500">Delivery Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">62.3%</p>
            <p className="text-sm text-gray-500">Avg Open Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">1.6%</p>
            <p className="text-sm text-gray-500">Bounce Rate</p>
          </div>
        </Card>
      </div>
      <Card title="Email Performance by Category">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Sent
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Delivered
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Opened
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Bounced
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Open Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[
              {
                cat: 'Fee Receipts',
                sent: 2841,
                delivered: 2798,
                opened: 2341,
                bounced: 43,
                rate: '83.7%'
              },
              {
                cat: 'Attendance Alerts',
                sent: 4821,
                delivered: 4756,
                opened: 2891,
                bounced: 65,
                rate: '60.8%'
              },
              {
                cat: 'Exam Notifications',
                sent: 1248,
                delivered: 1231,
                opened: 891,
                bounced: 17,
                rate: '72.4%'
              },
              {
                cat: 'General Circulars',
                sent: 3932,
                delivered: 3876,
                opened: 1934,
                bounced: 56,
                rate: '49.9%'
              }].
              map((row) =>
              <tr
                key={row.cat}
                className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4 font-medium">{row.cat}</td>
                  <td className="py-3 px-4">{row.sent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600">
                    {row.delivered.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-blue-600">
                    {row.opened.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-red-600">{row.bounced}</td>
                  <td className="py-3 px-4 font-medium">{row.rate}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}