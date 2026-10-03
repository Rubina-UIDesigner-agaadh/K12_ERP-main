import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save } from 'lucide-react';
export function ChannelDeliveryManagement() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Channel & Delivery Management
          </h1>
          <p className="text-sm text-gray-500">
            Configure delivery channels and routing rules for each alert type
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <p className="text-sm font-bold">SMS</p>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-2 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-bold">WhatsApp</p>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-2 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded">
              <span className="text-lg">📧</span>
            </div>
            <div>
              <p className="text-sm font-bold">Email</p>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-2 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <p className="text-sm font-bold">Push Notification</p>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Channel Routing by Alert Category">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Alert Category
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  SMS
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  WhatsApp
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Email
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  Push
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">
                  IVR Call
                </th>
              </tr>
            </thead>
            <tbody>
              {[
              {
                cat: 'Academic (Attendance)',
                sms: true,
                wa: true,
                email: true,
                push: true,
                ivr: false
              },
              {
                cat: 'Finance (Fee)',
                sms: true,
                wa: true,
                email: true,
                push: true,
                ivr: false
              },
              {
                cat: 'Transport',
                sms: true,
                wa: true,
                email: false,
                push: true,
                ivr: true
              },
              {
                cat: 'Safety / Emergency',
                sms: true,
                wa: true,
                email: true,
                push: true,
                ivr: true
              },
              {
                cat: 'Academic (Results)',
                sms: false,
                wa: true,
                email: true,
                push: true,
                ivr: false
              }].
              map((row) =>
              <tr
                key={row.cat}
                className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4 font-medium">{row.cat}</td>
                  {[row.sms, row.wa, row.email, row.push, row.ivr].map(
                  (val, i) =>
                  <td key={i} className="py-3 px-4 text-center">
                        <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      defaultChecked={val} />

                      </td>

                )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}