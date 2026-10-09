import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import { PlusIcon, PinIcon, BellIcon, CalendarIcon } from 'lucide-react';
const posts = [
{
  id: 1,
  title: 'Annual Day 2025 - Registration Open',
  type: 'Announcement',
  author: 'Admin',
  date: '2025-06-10',
  pinned: true,
  scheduled: false,
  reads: 342
},
{
  id: 2,
  title: 'Arjun Sharma wins State Science Olympiad',
  type: 'Achievement',
  author: 'Principal',
  date: '2025-06-09',
  pinned: false,
  scheduled: false,
  reads: 289
},
{
  id: 3,
  title: 'Mrs. Sharma recognized as Best Teacher',
  type: 'Recognition',
  author: 'Admin',
  date: '2025-06-08',
  pinned: false,
  scheduled: false,
  reads: 234
},
{
  id: 4,
  title: 'Fee Payment Reminder - June 2025',
  type: 'Circular',
  author: 'Accounts',
  date: '2025-06-07',
  pinned: true,
  scheduled: false,
  reads: 412
},
{
  id: 5,
  title: 'Birthday Wishes - June Birthdays',
  type: 'Birthday',
  author: 'System',
  date: '2025-06-01',
  pinned: false,
  scheduled: true,
  reads: 156
}];

const typeBadge = (t: string) => {
  const c: Record<string, string> = {
    Announcement: 'bg-blue-100 text-blue-700',
    Achievement: 'bg-yellow-100 text-yellow-700',
    Recognition: 'bg-purple-100 text-purple-700',
    Circular: 'bg-orange-100 text-orange-700',
    Birthday: 'bg-pink-100 text-pink-700',
    Emergency: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[t] || 'bg-gray-100 text-gray-600'}`}>

      {t}
    </span>);

};
export function InternalSchoolUpdates() {
  const [tab, setTab] = useState('feed');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Internal School Updates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            School announcements, achievements, circulars and alerts
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="feed" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="feed">All Updates</TabsTrigger>
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search updates..." className="flex-1" />
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'announcement',
                  label: 'Announcement'
                },
                {
                  value: 'achievement',
                  label: 'Achievement'
                },
                {
                  value: 'circular',
                  label: 'Circular'
                },
                {
                  value: 'emergency',
                  label: 'Emergency'
                }]
                }
                className="w-44" />

            </div>
            <div className="space-y-3">
              {posts.map((post, i) =>
              <div
                key={i}
                className={`p-4 border rounded-xl ${post.pinned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.pinned &&
                    <PinIcon className="w-3.5 h-3.5 text-blue-500" />
                    }
                      <p className="font-semibold text-gray-800 text-sm">
                        {post.title}
                      </p>
                    </div>
                    {typeBadge(post.type)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>By {post.author}</span>
                    <span>{post.date}</span>
                    <span>{post.reads} reads</span>
                    {post.scheduled &&
                  <span className="flex items-center gap-1 text-blue-500">
                        <CalendarIcon className="w-3 h-3" />
                        Scheduled
                      </span>
                  }
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" className="text-xs h-6 px-2">
                      Edit
                    </Button>
                    <Button variant="ghost" className="text-xs h-6 px-2">
                      {post.pinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button
                    variant="ghost"
                    className="text-xs h-6 px-2 text-red-500">

                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Input label="Post Title" placeholder="Enter post title" />
                <Select
                  label="Post Type"
                  options={[
                  {
                    value: 'announcement',
                    label: 'Announcement'
                  },
                  {
                    value: 'achievement',
                    label: 'Achievement'
                  },
                  {
                    value: 'recognition',
                    label: 'Teacher Recognition'
                  },
                  {
                    value: 'circular',
                    label: 'Circular'
                  },
                  {
                    value: 'birthday',
                    label: 'Birthday Post'
                  },
                  {
                    value: 'homework',
                    label: 'Homework Alert'
                  },
                  {
                    value: 'result',
                    label: 'Result Published'
                  },
                  {
                    value: 'emergency',
                    label: 'Emergency Broadcast'
                  }]
                  } />

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Content
                  </label>
                  <Textarea placeholder="Write your post content..." rows={5} />
                </div>
              </div>
              <div className="space-y-4">
                <Card title="Post Settings">
                  <div className="space-y-3">
                    <Select
                      label="Target Audience"
                      options={[
                      {
                        value: 'all',
                        label: 'All'
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

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Pin Post</span>
                      <button className="relative w-9 h-5 rounded-full bg-gray-300">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Schedule Post
                      </span>
                      <button className="relative w-9 h-5 rounded-full bg-gray-300">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                    <Input label="Publish Date" type="datetime-local" />
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

          <TabsContent value="pinned" className="p-5">
            <div className="space-y-3">
              {posts.
              filter((p) => p.pinned).
              map((post, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50/30 rounded-xl">

                    <PinIcon className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {post.type} • {post.date} • {post.reads} reads
                      </p>
                    </div>
                    <Button variant="ghost" className="text-xs h-7 px-2">
                      Unpin
                    </Button>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="p-5">
            <div className="space-y-3">
              {posts.
              filter((p) => p.scheduled).
              map((post, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 bg-gray-50 rounded-xl">

                    <CalendarIcon className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {post.type} • Scheduled for {post.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                      <Button
                    variant="ghost"
                    className="text-xs h-7 px-2 text-red-500">

                        Cancel
                      </Button>
                    </div>
                  </div>
              )}
              <Button variant="primary" className="w-full">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule New Post
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}