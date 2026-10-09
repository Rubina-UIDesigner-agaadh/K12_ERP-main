import React from 'react';
import { Globe, Clock, Layout, Save } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
export function MyDisplayLanguage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Display & Language</h1>
        <p className="text-sm text-gray-500">
          Customize your interface language and regional formats.
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <div className="space-y-6">
            {/* Language */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> Interface Language
              </h3>
              <Select
                options={[
                {
                  value: 'en',
                  label: 'English (Default)'
                },
                {
                  value: 'hi',
                  label: 'Hindi'
                },
                {
                  value: 'gu',
                  label: 'Gujarati'
                },
                {
                  value: 'mr',
                  label: 'Marathi'
                }]
                }
                className="w-full" />

              <p className="text-xs text-gray-500">
                Note: Some administrative content may remain in English.
              </p>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Landing Page */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layout className="w-4 h-4 text-purple-500" /> Default Landing
                Page
              </h3>
              <Select
                options={[
                {
                  value: 'dashboard',
                  label: 'Dashboard'
                },
                {
                  value: 'inbox',
                  label: 'My Inbox'
                },
                {
                  value: 'calendar',
                  label: 'Academic Calendar'
                }]
                }
                className="w-full" />

            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Date & Time */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Regional Formats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Date Format"
                  options={[
                  {
                    value: 'dmy',
                    label: 'DD/MM/YYYY'
                  },
                  {
                    value: 'mdy',
                    label: 'MM/DD/YYYY'
                  }]
                  } />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Format
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        defaultChecked
                        className="text-blue-600" />

                      <span className="text-sm">12-hour (AM/PM)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        className="text-blue-600" />

                      <span className="text-sm">24-hour</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button variant="primary" className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" /> Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}