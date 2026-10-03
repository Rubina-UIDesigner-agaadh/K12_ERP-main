import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, RefreshCwIcon, MailIcon } from 'lucide-react';
export function SmtpDomainSetup() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            SMTP & Domain Setup
          </h1>
          <p className="text-sm text-gray-500">
            Configure email server settings, domain authentication and sender
            identity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Test Email
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="SMTP Configuration">
          <div className="space-y-4">
            <Select
              label="Email Provider"
              options={[
              {
                value: 'smtp',
                label: 'Custom SMTP'
              },
              {
                value: 'gmail',
                label: 'Gmail (Google Workspace)'
              },
              {
                value: 'sendgrid',
                label: 'SendGrid'
              },
              {
                value: 'ses',
                label: 'Amazon SES'
              },
              {
                value: 'mailgun',
                label: 'Mailgun'
              }]
              }
              defaultValue="smtp" />

            <Input label="SMTP Host" defaultValue="smtp.school.edu" />
            <Input label="SMTP Port" type="number" defaultValue="587" />
            <Select
              label="Encryption"
              options={[
              {
                value: 'tls',
                label: 'TLS (STARTTLS)'
              },
              {
                value: 'ssl',
                label: 'SSL'
              },
              {
                value: 'none',
                label: 'None'
              }]
              }
              defaultValue="tls" />

            <Input label="Username / Email" defaultValue="noreply@school.edu" />
            <Input label="Password" type="password" defaultValue="••••••••" />
          </div>
        </Card>
        <Card title="Sender Identity & Domain">
          <div className="space-y-4">
            <Input label="From Name" defaultValue="ABC School" />
            <Input label="From Email" defaultValue="noreply@school.edu" />
            <Input label="Reply-To Email" defaultValue="admin@school.edu" />
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-gray-700">
                Domain Authentication
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SPF Record</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DKIM Record</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DMARC Policy</span>
                <Badge variant="warning">Not Set</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}