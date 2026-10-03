import React, { useState } from 'react';
import { Lock, Shield, Key, Smartphone, Mail } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
export function MyPasswordSecurity() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Password & Security
        </h1>
        <p className="text-sm text-gray-500">
          Manage your login credentials and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <Card title="Change Password">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password" />

            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password" />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter new password" />


            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="show"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded text-blue-600" />

              <label htmlFor="show" className="text-sm text-gray-600">
                Show Passwords
              </label>
            </div>

            {/* Strength Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Password Strength</span>
                <span>Medium</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Use 8+ chars with mix of letters, numbers & symbols.
              </p>
            </div>

            <div className="pt-2">
              <Button variant="primary" className="w-full">
                Update Password
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* 2FA Settings */}
          <Card title="Two-Factor Authentication (2FA)">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-bold text-green-900 text-sm">
                      2FA is Enabled
                    </p>
                    <p className="text-xs text-green-700">
                      Extra layer of security is active.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked />

                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Preferred Method
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    <Smartphone className="w-4 h-4" /> SMS OTP
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium">
                    <Mail className="w-4 h-4" /> Email OTP
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Questions */}
          <Card title="Security Questions">
            <div className="space-y-3">
              <Select
                label="Challenge Question 1"
                options={[
                {
                  value: 'pet',
                  label: "What was your first pet's name?"
                },
                {
                  value: 'city',
                  label: 'In which city were you born?'
                }]
                } />

              <Input
                type="password"
                placeholder="Answer"
                className="bg-gray-50" />

              <div className="pt-2 text-right">
                <Button variant="outline" size="sm">
                  Update Answers
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}