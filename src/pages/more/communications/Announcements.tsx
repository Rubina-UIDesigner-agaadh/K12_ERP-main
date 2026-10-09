import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import {
  PlusIcon,
  PinIcon,
  AlertTriangleIcon,
  ImageIcon,
  MegaphoneIcon } from
'lucide-react';
const announcements = [
{
  id: 'ANN-001',
  title: 'School Closed on 15th June',
  type: 'Emergency',
  audience: 'All',
  pinned: true,
  expiresOn: '2025-06-15',
  status: 'Active'
},
{
  id: 'ANN-002',
  title: 'Annual Sports Day Registration Open',
  type: 'General',
  audience: 'Students',
  pinned: true,
  expiresOn: '2025-06-20',
  status: 'Active'
},
{
  id: 'ANN-003',
  title: 'Parent-Teacher Meeting Schedule',
  type: 'General',
  audience: 'Parents',
  pinned: false,
  expiresOn: '2025-06-12',
  status: 'Active'
},
{
  id: 'ANN-004',
  title: 'Exam Timetable Released',
  type: 'Academic',
  audience: 'All',
  pinned: false,
  expiresOn: '2025-06-30',
  status: 'Expired'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Expired: 'bg-gray-100 text-gray-600',
    Draft: 'bg-yellow-100 text-yellow-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
const typeBadge = (t: string) => {
  const c: Record<string, string> = {
    Emergency: 'bg-red-100 text-red-700',
    General: 'bg-blue-100 text-blue-700',
    Academic: 'bg-purple-100 text-purple-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[t] || 'bg-gray-100 text-gray-600'}`}>

      {t}
    </span>);

};
export function Announcements() {
  const [tab, setTab] = useState('broadcast');
  const [emergencyMode, setEmergencyMode] = useState(false);
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Broadcast instant announcements, manage pins and banners
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={
            emergencyMode ? 'border-red-400 text-red-600 bg-red-50' : ''
            }
            onClick={() => setEmergencyMode(!emergencyMode)}>

            <AlertTriangleIcon className="w-4 h-4 mr-2" />
            {emergencyMode ? 'Emergency Mode ON' : 'Emergency Mode'}
          </Button>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {emergencyMode &&
      <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangleIcon className="w-6 h-6 text-red-600 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-red-800">
              Emergency Alert Mode Active
            </p>
            <p className="text-sm text-red-600">
              All announcements will be sent as high-priority alerts to all
              users immediately.
            </p>
          </div>
          <Button
          variant="outline"
          className="border-red-400 text-red-600"
          onClick={() => setEmergencyMode(false)}>

            Deactivate
          </Button>
        </div>
      }

      <Card noPadding>
        <Tabs defaultValue="broadcast" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
            <TabsTrigger value="pinned">Pinned Announcements</TabsTrigger>
            <TabsTrigger value="banner">Homepage Banner</TabsTrigger>
            <TabsTrigger value="all">All Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="broadcast" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Instant Broadcast">
                <div className="space-y-4">
                  <Input
                    label="Announcement Title"
                    placeholder="Enter announcement title" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Message
                    </label>
                    <Textarea
                      placeholder="Write your announcement..."
                      rows={4} />

                  </div>
                  <Select
                    label="Audience"
                    options={[
                    {
                      value: 'all',
                      label: 'All Users'
                    },
                    {
                      value: 'parents',
                      label: 'Parents'
                    },
                    {
                      value: 'students',
                      label: 'Students'
                    },
                    {
                      value: 'staff',
                      label: 'Staff'
                    }]
                    } />

                  <Select
                    label="Type"
                    options={[
                    {
                      value: 'general',
                      label: 'General'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    },
                    {
                      value: 'emergency',
                      label: 'Emergency'
                    }]
                    } />

                  <Input label="Expiry Date" type="date" />
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Pin this announcement
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-gray-300">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    <MegaphoneIcon className="w-4 h-4 mr-2" />
                    Broadcast Now
                  </Button>
                </div>
              </Card>
              <div className="space-y-4">
                <Card title="Quick Stats">
                  <div className="space-y-3">
                    {[
                    {
                      label: 'Active Announcements',
                      value: '3',
                      color: 'text-green-600'
                    },
                    {
                      label: 'Pinned',
                      value: '2',
                      color: 'text-blue-600'
                    },
                    {
                      label: 'Expiring Today',
                      value: '1',
                      color: 'text-orange-600'
                    },
                    {
                      label: 'Total This Month',
                      value: '18',
                      color: 'text-gray-700'
                    }].
                    map((s, i) =>
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b border-gray-50 last:border-0">

                        <span className="text-sm text-gray-500">{s.label}</span>
                        <span className={`text-sm font-bold ${s.color}`}>
                          {s.value}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
                <Card title="Notification Channels">
                  <div className="space-y-2">
                    {[
                    'App Push Notification',
                    'SMS',
                    'WhatsApp',
                    'Email',
                    'Homepage Banner'].
                    map((ch, i) =>
                    <div
                      key={i}
                      className="flex items-center justify-between py-2">

                        <span className="text-sm text-gray-700">{ch}</span>
                        <button
                        className={`relative w-9 h-5 rounded-full transition-colors ${i < 3 ? 'bg-blue-500' : 'bg-gray-300'}`}>

                          <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${i < 3 ? 'translate-x-4' : 'translate-x-0'}`} />

                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pinned" className="p-5">
            <div className="space-y-3">
              {announcements.
              filter((a) => a.pinned).
              map((ann, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl">

                    <PinIcon className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">
                          {ann.title}
                        </p>
                        {typeBadge(ann.type)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Audience: {ann.audience} • Expires: {ann.expiresOn}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Unpin
                      </Button>
                      <Button
                    variant="ghost"
                    className="text-xs h-7 px-2 text-red-500">

                        Remove
                      </Button>
                    </div>
                  </div>
              )}
              <Button variant="outline" className="w-full">
                <PinIcon className="w-4 h-4 mr-2" />
                Pin Another Announcement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="banner" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Configure Homepage Banner">
                <div className="space-y-4">
                  <Input
                    label="Banner Title"
                    placeholder="Enter banner headline" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Banner Message
                    </label>
                    <Textarea
                      placeholder="Short announcement text..."
                      rows={3} />

                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 transition-colors">
                    <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">
                      Upload banner image (1200×300px)
                    </p>
                  </div>
                  <Select
                    label="Banner Type"
                    options={[
                    {
                      value: 'info',
                      label: 'Info (Blue)'
                    },
                    {
                      value: 'success',
                      label: 'Success (Green)'
                    },
                    {
                      value: 'warning',
                      label: 'Warning (Orange)'
                    },
                    {
                      value: 'danger',
                      label: 'Alert (Red)'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Show From" type="date" />
                    <Input label="Show Until" type="date" />
                  </div>
                  <Button variant="primary" className="w-full">
                    Publish Banner
                  </Button>
                </div>
              </Card>
              <Card title="Banner Preview">
                <div className="space-y-3">
                  <div className="bg-blue-600 text-white rounded-xl p-4">
                    <p className="font-bold text-sm">
                      📢 Annual Day Celebration
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      Join us for the Annual Day on 25th June 2025 at the school
                      auditorium. All parents are invited.
                    </p>
                  </div>
                  <div className="bg-orange-500 text-white rounded-xl p-4">
                    <p className="font-bold text-sm">⚠ Fee Due Reminder</p>
                    <p className="text-xs text-orange-100 mt-1">
                      Last date for fee payment is 15th June 2025. Late fee will
                      be applicable after this date.
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Banner previews
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="all" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search announcements..." className="flex-1" />
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'general',
                  label: 'General'
                },
                {
                  value: 'emergency',
                  label: 'Emergency'
                },
                {
                  value: 'academic',
                  label: 'Academic'
                }]
                }
                className="w-40" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'active',
                  label: 'Active'
                },
                {
                  value: 'expired',
                  label: 'Expired'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'title',
                header: 'Title'
              },
              {
                key: 'type',
                header: 'Type',
                render: (r) => typeBadge(r.type)
              },
              {
                key: 'audience',
                header: 'Audience'
              },
              {
                key: 'pinned',
                header: 'Pinned',
                render: (r) =>
                r.pinned ?
                <PinIcon className="w-4 h-4 text-blue-500" /> :

                <span className="text-gray-300">—</span>

              },
              {
                key: 'expiresOn',
                header: 'Expires On'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      Edit
                    </Button>

              }]
              }
              data={announcements} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}