import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, ShieldIcon } from 'lucide-react';
export function Authentication() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Authentication (OTP / SSO)
          </h1>
          <p className="text-sm text-gray-500">
            Configure login methods, OTP settings and SSO integration for the
            mobile app
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Login Methods">
          <div className="space-y-3">
            {[
            {
              label: 'Username & Password',
              desc: 'Standard login with credentials',
              enabled: true
            },
            {
              label: 'OTP via SMS',
              desc: 'One-time password sent to registered mobile',
              enabled: true
            },
            {
              label: 'OTP via Email',
              desc: 'One-time password sent to registered email',
              enabled: false
            },
            {
              label: 'Google SSO',
              desc: 'Sign in with Google account',
              enabled: false
            },
            {
              label: 'Microsoft SSO',
              desc: 'Sign in with Microsoft account',
              enabled: false
            },
            {
              label: 'Biometric (Fingerprint/Face)',
              desc: 'Device biometric authentication',
              enabled: true
            }].
            map((method) =>
            <div
              key={method.label}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
                <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked={method.enabled} />

              </div>
            )}
          </div>
        </Card>
        <Card title="OTP Configuration">
          <div className="space-y-4">
            <Input label="OTP Length (digits)" type="number" defaultValue="6" />
            <Input
              label="OTP Expiry (minutes)"
              type="number"
              defaultValue="10" />

            <Input label="Max OTP Attempts" type="number" defaultValue="3" />
            <Input
              label="Resend Cooldown (seconds)"
              type="number"
              defaultValue="60" />

            <Select
              label="OTP Provider"
              options={[
              {
                value: 'sms-gateway',
                label: 'SMS Gateway'
              },
              {
                value: 'twilio',
                label: 'Twilio'
              },
              {
                value: 'msg91',
                label: 'MSG91'
              }]
              }
              defaultValue="sms-gateway" />

          </div>
        </Card>
        <Card title="Session Settings">
          <div className="space-y-4">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              defaultValue="30" />

            <Input
              label="Max Active Sessions Per User"
              type="number"
              defaultValue="2" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Force Re-login on Password Change
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Remember Device (30 days)</p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="Security">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Account Lockout After Failed Attempts
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Max Failed Login Attempts"
              type="number"
              defaultValue="5" />

            <Input
              label="Lockout Duration (minutes)"
              type="number"
              defaultValue="15" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Notify Admin on Suspicious Login
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
      </div>
    </div>);

}