import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, EditIcon, EyeIcon, CopyIcon } from 'lucide-react';
export function TemplateManager() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Email Template Manager
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage HTML email templates for automated communications
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
      <Card title="Template Library">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search templates..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Categories'
              },
              {
                value: 'fee',
                label: 'Fee'
              },
              {
                value: 'academic',
                label: 'Academic'
              },
              {
                value: 'attendance',
                label: 'Attendance'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
            {
              name: 'Fee Receipt',
              category: 'Fee',
              lastUsed: '25 Feb 2026',
              status: 'Active'
            },
            {
              name: 'Absent Alert',
              category: 'Attendance',
              lastUsed: '25 Feb 2026',
              status: 'Active'
            },
            {
              name: 'Exam Schedule',
              category: 'Academic',
              lastUsed: '20 Feb 2026',
              status: 'Active'
            },
            {
              name: 'Welcome Email',
              category: 'Onboarding',
              lastUsed: '15 Feb 2026',
              status: 'Active'
            },
            {
              name: 'Password Reset',
              category: 'Security',
              lastUsed: '10 Feb 2026',
              status: 'Active'
            },
            {
              name: 'Result Published',
              category: 'Academic',
              lastUsed: '5 Feb 2026',
              status: 'Inactive'
            }].
            map((tpl) =>
            <div
              key={tpl.name}
              className="p-4 border border-gray-200 rounded-lg">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tpl.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {tpl.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last used: {tpl.lastUsed}
                    </p>
                  </div>
                  <Badge
                  variant={tpl.status === 'Active' ? 'success' : 'warning'}>

                    {tpl.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>);

}