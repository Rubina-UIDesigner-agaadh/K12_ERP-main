import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon, CreditCardIcon } from 'lucide-react';
export function GatewayConfiguration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gateway Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Configure payment gateway credentials and connection settings
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
        <Card title="Gateway Settings">
          <div className="space-y-4">
            <Select
              label="Payment Gateway"
              options={[
              {
                value: 'razorpay',
                label: 'Razorpay'
              },
              {
                value: 'payu',
                label: 'PayU'
              },
              {
                value: 'ccavenue',
                label: 'CCAvenue'
              },
              {
                value: 'paytm',
                label: 'Paytm'
              },
              {
                value: 'stripe',
                label: 'Stripe'
              }]
              }
              defaultValue="razorpay" />

            <Select
              label="Environment"
              options={[
              {
                value: 'production',
                label: 'Production (Live)'
              },
              {
                value: 'sandbox',
                label: 'Sandbox (Test)'
              }]
              }
              defaultValue="production" />

            <Input
              label="API Key / Merchant ID"
              placeholder="Enter API Key..." />

            <Input
              label="API Secret / Salt"
              type="password"
              placeholder="Enter Secret Key..." />

            <Input
              label="Webhook URL"
              defaultValue="https://school.edu/api/payment/webhook" />

            <Input
              label="Return URL (Success)"
              defaultValue="https://school.edu/payment/success" />

            <Input
              label="Return URL (Failure)"
              defaultValue="https://school.edu/payment/failure" />

          </div>
        </Card>
        <Card title="Gateway Status">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Razorpay - Connected
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Last verified: 25 Feb 2026
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Merchant Account</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Webhook</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SSL Certificate</span>
                <Badge variant="success">Valid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Settlement Account
                </span>
                <Badge variant="success">Linked</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}