import React, { useState } from 'react';
import { User, Mail, Phone, Globe, Save, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
export function MyAccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your basic profile preferences and recovery details.
          </p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}>

          {isEditing ? 'Cancel Edit' : 'Edit Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Profile Preferences">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred Name / Nickname"
                placeholder="How should we address you?"
                defaultValue="Rajesh"
                disabled={!isEditing}
                icon={<User className="w-4 h-4 text-gray-400" />} />

              <Select
                label="Time Zone"
                options={[
                {
                  value: 'ist',
                  label: '(GMT+05:30) India Standard Time'
                },
                {
                  value: 'utc',
                  label: '(GMT+00:00) UTC'
                }]
                }
                disabled={!isEditing}
                className="w-full" />

            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Recovery Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Alternate Email"
                  placeholder="For password recovery"
                  defaultValue="rajesh.personal@gmail.com"
                  disabled={!isEditing}
                  icon={<Mail className="w-4 h-4 text-gray-400" />} />

                <Input
                  label="Alternate Mobile"
                  placeholder="For OTPs"
                  defaultValue="+91 99887 76655"
                  disabled={!isEditing}
                  icon={<Phone className="w-4 h-4 text-gray-400" />} />

              </div>
              {isEditing &&
              <div className="mt-3 flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Changing recovery details will require OTP verification sent
                  to your current registered contact.
                </div>
              }
            </div>

            {isEditing &&
            <div className="pt-4 flex justify-end">
                <Button variant="primary">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            }
          </div>
        </Card>

        <Card title="System Defaults">
          <div className="space-y-4">
            <Select
              label="Date Format"
              options={[
              {
                value: 'dd-mm-yyyy',
                label: 'DD-MM-YYYY (31-12-2024)'
              },
              {
                value: 'mm-dd-yyyy',
                label: 'MM-DD-YYYY (12-31-2024)'
              },
              {
                value: 'yyyy-mm-dd',
                label: 'YYYY-MM-DD (2024-12-31)'
              }]
              }
              disabled={!isEditing} />

            <Select
              label="Time Format"
              options={[
              {
                value: '12',
                label: '12-hour (02:30 PM)'
              },
              {
                value: '24',
                label: '24-hour (14:30)'
              }]
              }
              disabled={!isEditing} />

          </div>
        </Card>
      </div>
    </div>);

}