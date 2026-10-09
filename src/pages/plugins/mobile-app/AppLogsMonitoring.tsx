import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { DownloadIcon, RefreshCwIcon } from 'lucide-react';
export function AppLogsMonitoring() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            App Logs & Monitoring
          </h1>
          <p className="text-sm text-gray-500">
            Monitor app errors, crashes, API failures and system health
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">99.8%</p>
            <p className="text-sm text-gray-500">App Uptime</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-500">Errors (Today)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">1</p>
            <p className="text-sm text-gray-500">Crashes (Today)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">245 ms</p>
            <p className="text-sm text-gray-500">Avg. API Response</p>
          </div>
        </Card>
      </div>
      <Card title="Application Logs">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select
              options={[
              {
                value: 'all',
                label: 'All Levels'
              },
              {
                value: 'error',
                label: 'Error'
              },
              {
                value: 'warning',
                label: 'Warning'
              },
              {
                value: 'info',
                label: 'Info'
              }]
              }
              defaultValue="all" />

            <Input type="date" className="w-40" />
            <Input placeholder="Search logs..." className="flex-1" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <span className="text-red-600 font-bold">[ERROR]</span>{' '}
              <span className="text-gray-500">2026-02-25 14:32:11</span>{' '}
              <span className="text-gray-800">
                {' '}
                NullPointerException in FeePaymentController.processPayment() -
                User: STU-001
              </span>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <span className="text-orange-600 font-bold">[WARN]</span>{' '}
              <span className="text-gray-500">2026-02-25 13:45:22</span>{' '}
              <span className="text-gray-800">
                {' '}
                API response time exceeded 2s for /api/attendance/fetch - 2341ms
              </span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="text-blue-600 font-bold">[INFO]</span>{' '}
              <span className="text-gray-500">2026-02-25 13:30:00</span>{' '}
              <span className="text-gray-800">
                {' '}
                Push notification batch sent: 1248 tokens, 1241 delivered, 7
                failed
              </span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="text-blue-600 font-bold">[INFO]</span>{' '}
              <span className="text-gray-500">2026-02-25 12:00:00</span>{' '}
              <span className="text-gray-800">
                {' '}
                Scheduled sync completed: 342 attendance records synced
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>);

}