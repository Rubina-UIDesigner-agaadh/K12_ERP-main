import React, { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  Shield,
  Bell,
  Save,
  Moon,
  Lock,
  Smartphone,
  Mail } from
'lucide-react';
interface SettingsPageProps {
  onBack: () => void;
}
export function SettingsPage({ onBack }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('general');
  // Mock State
  const [settings, setSettings] = useState({
    language: 'English',
    timezone: 'IST (UTC+05:30)',
    dateFormat: 'DD/MM/YYYY',
    emailNotif: true,
    smsNotif: true,
    pushNotif: false,
    twoFactor: false
  });
  const SectionButton = ({
    id,
    icon: Icon,
    label




  }: {id: string;icon: any;label: string;}) =>
  <button
    onClick={() => setActiveSection(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === id ? 'bg-[#0F4C5C] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>

      <Icon className="h-5 w-5" />
      {label}
    </button>;

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">

            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your application preferences
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0F4C5C] text-white rounded-lg font-medium hover:bg-[#145369] transition-colors shadow-sm">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-2">
          <SectionButton
            id="general"
            icon={Globe}
            label="General Preferences" />

          <SectionButton
            id="security"
            icon={Shield}
            label="Security & Password" />

          <SectionButton id="notifications" icon={Bell} label="Notifications" />
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {activeSection === 'general' &&
          <div className="p-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  General Preferences
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Customize your regional settings and display options.
                </p>

                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                    value={settings.language}
                    onChange={(e) =>
                    setSettings({
                      ...settings,
                      language: e.target.value
                    })
                    }
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] py-2.5">

                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                    value={settings.timezone}
                    onChange={(e) =>
                    setSettings({
                      ...settings,
                      timezone: e.target.value
                    })
                    }
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] py-2.5">

                      <option>IST (UTC+05:30)</option>
                      <option>PST (UTC-08:00)</option>
                      <option>EST (UTC-05:00)</option>
                      <option>GMT (UTC+00:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                    value={settings.dateFormat}
                    onChange={(e) =>
                    setSettings({
                      ...settings,
                      dateFormat: e.target.value
                    })
                    }
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C] py-2.5">

                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeSection === 'security' &&
          <div className="p-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Security Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Manage your password and authentication methods.
                </p>

                <div className="space-y-6 max-w-2xl">
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#0F4C5C]" />
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C]" />

                      <input
                      type="password"
                      placeholder="New Password"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C]" />

                      <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0F4C5C] focus:border-[#0F4C5C]" />

                      <button className="text-sm text-[#0F4C5C] font-medium hover:underline">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-xs text-gray-500">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <button
                    onClick={() =>
                    setSettings({
                      ...settings,
                      twoFactor: !settings.twoFactor
                    })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactor ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>

                      <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />

                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeSection === 'notifications' &&
          <div className="p-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Choose how you want to receive updates.
                </p>

                <div className="space-y-4 max-w-2xl">
                  {[
                {
                  id: 'emailNotif',
                  label: 'Email Notifications',
                  desc: 'Receive daily summaries and alerts',
                  icon: Mail
                },
                {
                  id: 'smsNotif',
                  label: 'SMS Alerts',
                  desc: 'Get important updates via SMS',
                  icon: Smartphone
                },
                {
                  id: 'pushNotif',
                  label: 'Push Notifications',
                  desc: 'Receive real-time browser notifications',
                  icon: Bell
                }].
                map((item) =>
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">

                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.label}
                          </h3>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <button
                    onClick={() =>
                    setSettings({
                      ...settings,
                      [item.id]:
                      !settings[item.id as keyof typeof settings]
                    })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.id as keyof typeof settings] ? 'bg-[#0F4C5C]' : 'bg-gray-200'}`}>

                        <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings[item.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'}`} />

                      </button>
                    </div>
                )}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}