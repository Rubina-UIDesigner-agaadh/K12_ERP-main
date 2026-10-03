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
import {
  CheckCircleIcon,
  XCircleIcon,
  HistoryIcon,
  ArchiveIcon } from
'lucide-react';
const pendingPosts = [
{
  id: 'POST-001',
  title: 'Upcoming Science Fair Registration',
  author: 'Mr. Patel (Teacher)',
  type: 'Announcement',
  submitted: '2025-06-10 09:00',
  status: 'Pending'
},
{
  id: 'POST-002',
  title: 'Lost: Blue School Bag near Playground',
  author: 'Parent - Mrs. Sharma',
  type: 'Notice',
  submitted: '2025-06-10 10:30',
  status: 'Pending'
},
{
  id: 'POST-003',
  title: 'Chess Club Meeting This Friday',
  author: 'Mr. Verma (Teacher)',
  type: 'Announcement',
  submitted: '2025-06-09 14:00',
  status: 'Pending'
}];

const editHistory = [
{
  post: 'Annual Day 2025',
  editedBy: 'Admin',
  editedOn: '2025-06-09 11:00',
  change: 'Updated venue details',
  version: 'v2'
},
{
  post: 'Fee Circular June',
  editedBy: 'Accounts',
  editedOn: '2025-06-08 09:30',
  change: 'Corrected due date',
  version: 'v2'
},
{
  post: 'Annual Day 2025',
  editedBy: 'Admin',
  editedOn: '2025-06-07 16:00',
  change: 'Initial creation',
  version: 'v1'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Archived: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ModerationWorkflow() {
  const [tab, setTab] = useState('approval');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Moderation & Workflow
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Post approval workflow, comment moderation, edit history and
            archiving
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Pending Approval',
          value: '3',
          color: 'text-yellow-600'
        },
        {
          label: 'Approved Today',
          value: '8',
          color: 'text-green-600'
        },
        {
          label: 'Rejected',
          value: '1',
          color: 'text-red-600'
        },
        {
          label: 'Archived Posts',
          value: '24',
          color: 'text-gray-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="text-center p-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="approval" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="approval">Post Approval</TabsTrigger>
            <TabsTrigger value="comments">Comment Moderation</TabsTrigger>
            <TabsTrigger value="history">Edit History</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
            <TabsTrigger value="expiry">Expiry Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="approval" className="p-5">
            <div className="space-y-3">
              {pendingPosts.map((post, i) =>
              <div
                key={i}
                className="p-4 border border-yellow-200 bg-yellow-50/30 rounded-xl">

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.author} • {post.type} • {post.submitted}
                      </p>
                    </div>
                    {statusBadge(post.status)}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" className="text-xs h-7 px-3">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" className="text-xs h-7 px-3">
                      Request Changes
                    </Button>
                    <Button
                    variant="ghost"
                    className="text-xs h-7 px-3 text-red-500">

                      <XCircleIcon className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                    <Button variant="ghost" className="text-xs h-7 px-3">
                      Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search comments..." className="flex-1" />
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'pending',
                  label: 'Pending'
                },
                {
                  value: 'approved',
                  label: 'Approved'
                },
                {
                  value: 'flagged',
                  label: 'Flagged'
                }]
                }
                className="w-40" />

            </div>
            <div className="space-y-3">
              {[
              {
                user: 'Parent - Mr. Patel',
                post: 'Annual Day 2025',
                comment: 'Can we register online?',
                time: '2 hours ago',
                status: 'Approved'
              },
              {
                user: 'Anonymous',
                post: 'Fee Circular',
                comment: 'This is unfair!',
                time: '3 hours ago',
                status: 'Flagged'
              },
              {
                user: 'Teacher - Mrs. Verma',
                post: 'Science Fair',
                comment: 'Great initiative!',
                time: '5 hours ago',
                status: 'Approved'
              }].
              map((c, i) =>
              <div
                key={i}
                className={`p-4 border rounded-xl ${c.status === 'Flagged' ? 'border-red-200 bg-red-50/20' : 'border-gray-200'}`}>

                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-700">
                      {c.user} on "{c.post}"
                    </p>
                    {statusBadge(c.status)}
                  </div>
                  <p className="text-sm text-gray-700 my-2">"{c.comment}"</p>
                  <p className="text-xs text-gray-400 mb-2">{c.time}</p>
                  <div className="flex gap-2">
                    <Button
                    variant="ghost"
                    className="text-xs h-6 px-2 text-green-600">

                      Approve
                    </Button>
                    <Button
                    variant="ghost"
                    className="text-xs h-6 px-2 text-red-500">

                      Remove
                    </Button>
                    <Button variant="ghost" className="text-xs h-6 px-2">
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-5">
            <Table
              columns={[
              {
                key: 'post',
                header: 'Post'
              },
              {
                key: 'editedBy',
                header: 'Edited By'
              },
              {
                key: 'editedOn',
                header: 'Edited On'
              },
              {
                key: 'change',
                header: 'Change Description'
              },
              {
                key: 'version',
                header: 'Version',
                render: (r) =>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {r.version}
                    </span>

              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      <HistoryIcon className="w-3 h-3 mr-1" />
                      Restore
                    </Button>

              }]
              }
              data={editHistory} />

          </TabsContent>

          <TabsContent value="archive" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search archived posts..."
                className="flex-1" />

              <Button variant="outline">
                <ArchiveIcon className="w-4 h-4 mr-2" />
                Archive Selected
              </Button>
            </div>
            <div className="space-y-2">
              {[
              {
                title: 'Exam Timetable - Term 1 2024',
                archivedOn: '2025-01-15',
                type: 'Academic'
              },
              {
                title: 'Annual Day 2024 Highlights',
                archivedOn: '2025-02-01',
                type: 'Event'
              },
              {
                title: 'Fee Circular - March 2025',
                archivedOn: '2025-04-01',
                type: 'Circular'
              }].
              map((post, i) =>
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">

                  <ArchiveIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      Archived: {post.archivedOn} • {post.type}
                    </p>
                  </div>
                  <Button variant="ghost" className="text-xs h-7 px-2">
                    Restore
                  </Button>
                  <Button
                  variant="ghost"
                  className="text-xs h-7 px-2 text-red-500">

                    Delete
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="expiry" className="p-5">
            <Card title="Post Expiry Settings">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Configure automatic expiry rules for different post types.
                </p>
                {[
                {
                  type: 'Announcements',
                  defaultExpiry: '30 days'
                },
                {
                  type: 'Fee Circulars',
                  defaultExpiry: '60 days'
                },
                {
                  type: 'Event Posts',
                  defaultExpiry: '7 days after event'
                },
                {
                  type: 'Emergency Alerts',
                  defaultExpiry: '24 hours'
                },
                {
                  type: 'Academic Updates',
                  defaultExpiry: '90 days'
                }].
                map((rule, i) =>
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">

                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {rule.type}
                    </span>
                    <Select
                    options={[
                    {
                      value: '7',
                      label: '7 days'
                    },
                    {
                      value: '14',
                      label: '14 days'
                    },
                    {
                      value: '30',
                      label: '30 days'
                    },
                    {
                      value: '60',
                      label: '60 days'
                    },
                    {
                      value: '90',
                      label: '90 days'
                    },
                    {
                      value: 'never',
                      label: 'Never expire'
                    }]
                    }
                    className="w-36" />

                  </div>
                )}
                <Button variant="primary" className="w-full">
                  Save Expiry Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}