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
  SearchIcon,
  FileTextIcon,
  UploadIcon,
  BellIcon,
  HistoryIcon } from
'lucide-react';
const notices = [
{
  id: 'NC-001',
  title: 'Annual Day Celebration',
  type: 'Notice',
  audience: 'All',
  createdBy: 'Principal',
  date: '2025-06-10',
  version: 'v2',
  status: 'Published'
},
{
  id: 'NC-002',
  title: 'Fee Payment Circular',
  type: 'Circular',
  audience: 'Parents',
  createdBy: 'Accounts',
  date: '2025-06-09',
  version: 'v1',
  status: 'Published'
},
{
  id: 'NC-003',
  title: 'Summer Vacation Schedule',
  type: 'Notice',
  audience: 'All',
  createdBy: 'Admin',
  date: '2025-06-08',
  version: 'v1',
  status: 'Draft'
},
{
  id: 'NC-004',
  title: 'Exam Guidelines 2025',
  type: 'Circular',
  audience: 'Students',
  createdBy: 'Exam Cell',
  date: '2025-06-07',
  version: 'v3',
  status: 'Archived'
}];

const acknowledgements = [
{
  notice: 'Annual Day Celebration',
  total: 450,
  read: 312,
  acknowledged: 289,
  pending: 161
},
{
  notice: 'Fee Payment Circular',
  total: 450,
  read: 398,
  acknowledged: 367,
  pending: 83
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Published: 'bg-green-100 text-green-700',
    Draft: 'bg-yellow-100 text-yellow-700',
    Archived: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function CircularsNotices() {
  const [tab, setTab] = useState('manage');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Circulars & Notices
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, distribute and track circulars and notices
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="manage" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="manage">Notice Management</TabsTrigger>
            <TabsTrigger value="create">Create Notice</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="acknowledgement">Acknowledgement</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search notices..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'notice',
                  label: 'Notice'
                },
                {
                  value: 'circular',
                  label: 'Circular'
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
                  value: 'published',
                  label: 'Published'
                },
                {
                  value: 'draft',
                  label: 'Draft'
                },
                {
                  value: 'archived',
                  label: 'Archived'
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
                header: 'Type'
              },
              {
                key: 'audience',
                header: 'Audience'
              },
              {
                key: 'createdBy',
                header: 'Created By'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'version',
                header: 'Version'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: (r) =>
                <div className="flex gap-1">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Archive
                      </Button>
                    </div>

              }]
              }
              data={notices} />

          </TabsContent>

          <TabsContent value="create" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Notice Title" placeholder="Enter title" />
                  <Select
                    label="Type"
                    options={[
                    {
                      value: 'notice',
                      label: 'Notice'
                    },
                    {
                      value: 'circular',
                      label: 'Circular'
                    }]
                    } />

                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Content (Rich Text)
                  </label>
                  <div className="border border-gray-200 rounded-lg">
                    <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                      {['B', 'I', 'U', 'H1', 'H2', '• List', '1. List'].map(
                        (btn, i) =>
                        <button
                          key={i}
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded">

                            {btn}
                          </button>

                      )}
                    </div>
                    <Textarea
                      placeholder="Write notice content here..."
                      rows={8}
                      className="border-0 rounded-t-none" />

                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-blue-300 transition-colors">
                  <UploadIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Attach Files
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, Images, Documents (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Card title="Distribution Settings">
                  <div className="space-y-3">
                    <Select
                      label="Audience"
                      options={[
                      {
                        value: 'all',
                        label: 'All'
                      },
                      {
                        value: 'parents',
                        label: 'Parents Only'
                      },
                      {
                        value: 'students',
                        label: 'Students Only'
                      },
                      {
                        value: 'staff',
                        label: 'Staff Only'
                      },
                      {
                        value: 'teachers',
                        label: 'Teachers Only'
                      }]
                      } />

                    <Select
                      label="Class-wise"
                      options={[
                      {
                        value: 'all',
                        label: 'All Classes'
                      },
                      {
                        value: '8',
                        label: 'Class 8'
                      },
                      {
                        value: '9',
                        label: 'Class 9'
                      },
                      {
                        value: '10',
                        label: 'Class 10'
                      }]
                      } />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Require Acknowledgement
                      </span>
                      <button className="relative w-9 h-5 rounded-full bg-blue-500">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Send Reminder
                      </span>
                      <button className="relative w-9 h-5 rounded-full bg-blue-500">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                      </button>
                    </div>
                  </div>
                </Card>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                  <Button variant="primary" className="flex-1">
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="p-5">
            <div className="space-y-4">
              {notices.
              filter((n) => n.status === 'Published').
              map((notice, i) =>
              <Card key={i} title={notice.title}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                  {
                    label: 'Total Recipients',
                    value: '450'
                  },
                  {
                    label: 'Delivered',
                    value: '432 (96%)'
                  },
                  {
                    label: 'Read',
                    value: '312 (69%)'
                  },
                  {
                    label: 'Acknowledged',
                    value: '289 (64%)'
                  }].
                  map((s, si) =>
                  <div
                    key={si}
                    className="text-center p-3 bg-gray-50 rounded-lg">

                          <p className="text-lg font-bold text-gray-900">
                            {s.value}
                          </p>
                          <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                  )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" className="text-xs h-7 px-3">
                        <BellIcon className="w-3 h-3 mr-1" />
                        Send Reminder
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-3">
                        View Details
                      </Button>
                    </div>
                  </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="acknowledgement" className="p-5">
            <Table
              columns={[
              {
                key: 'notice',
                header: 'Notice'
              },
              {
                key: 'total',
                header: 'Total'
              },
              {
                key: 'read',
                header: 'Read',
                render: (r) =>
                <span className="text-blue-600 font-medium">{r.read}</span>

              },
              {
                key: 'acknowledged',
                header: 'Acknowledged',
                render: (r) =>
                <span className="text-green-600 font-medium">
                      {r.acknowledged}
                    </span>

              },
              {
                key: 'pending',
                header: 'Pending',
                render: (r) =>
                <span className="text-red-500 font-medium">
                      {r.pending}
                    </span>

              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      Send Reminder
                    </Button>

              }]
              }
              data={acknowledgements} />

          </TabsContent>

          <TabsContent value="history" className="p-5">
            <div className="space-y-4">
              {[
              {
                title: 'Exam Guidelines 2025',
                versions: [
                {
                  v: 'v3',
                  date: '2025-06-07',
                  by: 'Exam Cell',
                  change: 'Updated exam timings'
                },
                {
                  v: 'v2',
                  date: '2025-06-05',
                  by: 'Exam Cell',
                  change: 'Added practical exam schedule'
                },
                {
                  v: 'v1',
                  date: '2025-06-01',
                  by: 'Exam Cell',
                  change: 'Initial draft'
                }]

              }].
              map((item, i) =>
              <Card key={i} title={item.title}>
                  <div className="space-y-2">
                    {item.versions.map((v, vi) =>
                  <div
                    key={vi}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">

                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {v.v}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {v.change}
                          </p>
                          <p className="text-xs text-gray-400">
                            {v.date} by {v.by}
                          </p>
                        </div>
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          <HistoryIcon className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                  )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}