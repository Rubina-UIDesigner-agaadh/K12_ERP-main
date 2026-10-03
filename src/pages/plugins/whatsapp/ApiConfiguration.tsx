import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, CheckCircleIcon, RefreshCwIcon } from 'lucide-react';
export function ApiConfiguration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            WhatsApp API Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Configure WhatsApp Business API credentials and connection settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="API Credentials">
          <div className="space-y-4">
            <Select
              label="API Provider"
              options={[
              {
                value: 'meta',
                label: 'Meta (Official WhatsApp Business API)'
              },
              {
                value: 'twilio',
                label: 'Twilio WhatsApp'
              },
              {
                value: 'wati',
                label: 'WATI'
              },
              {
                value: 'interakt',
                label: 'Interakt'
              }]
              }
              defaultValue="meta" />

            <Input
              label="Phone Number ID"
              placeholder="Enter Phone Number ID..." />

            <Input
              label="WhatsApp Business Account ID"
              placeholder="Enter WABA ID..." />

            <Input
              label="Access Token"
              type="password"
              placeholder="Enter API Access Token..." />

            <Input
              label="Webhook URL"
              defaultValue="https://school.edu/api/whatsapp/webhook" />

            <Input
              label="Webhook Verify Token"
              type="password"
              placeholder="Enter verify token..." />

          </div>
        </Card>
        <Card title="Connection Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  API Connected Successfully
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Last verified: 25 Feb 2026, 10:30 AM
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Account</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone Number</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Webhook</span>
                <Badge variant="success">Registered</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Message Limit</span>
                <span className="text-sm font-medium">1,000 / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Messages Sent Today
                </span>
                <span className="text-sm font-medium">342</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}