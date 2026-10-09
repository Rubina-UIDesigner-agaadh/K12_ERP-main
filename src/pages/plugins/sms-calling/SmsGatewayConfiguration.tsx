import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon, MessageSquareIcon } from 'lucide-react';
export function SmsGatewayConfiguration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            SMS Gateway Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Configure SMS gateway credentials and sender settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Test SMS
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Gateway Settings">
          <div className="space-y-4">
            <Select
              label="SMS Provider"
              options={[
              {
                value: 'msg91',
                label: 'MSG91'
              },
              {
                value: 'textlocal',
                label: 'Textlocal'
              },
              {
                value: 'twilio',
                label: 'Twilio'
              },
              {
                value: 'kaleyra',
                label: 'Kaleyra'
              },
              {
                value: 'valuefirst',
                label: 'ValueFirst'
              }]
              }
              defaultValue="msg91" />

            <Input
              label="API Key / Auth Key"
              type="password"
              placeholder="Enter API Key..." />

            <Input label="Sender ID" defaultValue="SCHOOL" />
            <Select
              label="SMS Type"
              options={[
              {
                value: 'transactional',
                label: 'Transactional'
              },
              {
                value: 'promotional',
                label: 'Promotional'
              }]
              }
              defaultValue="transactional" />

            <Input label="Test Mobile Number" placeholder="+91 9876543210" />
          </div>
        </Card>
        <Card title="Connection Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquareIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  MSG91 - Connected
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Last verified: 25 Feb 2026
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sender ID Status</span>
                <Badge variant="success">Approved</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">DLT Registration</span>
                <Badge variant="success">Registered</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SMS Credits</span>
                <span className="text-sm font-medium">48,291 remaining</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Rate</span>
                <span className="text-sm font-medium text-green-600">
                  97.8%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}