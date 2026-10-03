import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, EditIcon, EyeIcon } from 'lucide-react';
export function ContentAnnouncementControl() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Content & Announcement Control
          </h1>
          <p className="text-sm text-gray-500">
            Manage app content, banners and announcements displayed to users
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Active Announcements</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-500">Scheduled</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-400">28</p>
            <p className="text-sm text-gray-500">Archived</p>
          </div>
        </Card>
      </div>
      <Card title="Content List">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search content..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'banner',
                label: 'Banner'
              },
              {
                value: 'announcement',
                label: 'Announcement'
              },
              {
                value: 'news',
                label: 'News'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Audience
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Published
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Annual Sports Day</td>
                  <td className="py-3 px-4">Announcement</td>
                  <td className="py-3 px-4">All</td>
                  <td className="py-3 px-4">25 Feb 2026</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Fee Payment Banner</td>
                  <td className="py-3 px-4">Banner</td>
                  <td className="py-3 px-4">Parents</td>
                  <td className="py-3 px-4">20 Feb 2026</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-blue-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}