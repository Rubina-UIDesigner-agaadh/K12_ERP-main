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
import { FilterIcon, SearchIcon, PinIcon, TagIcon } from 'lucide-react';
export function SmartTargetingFiltering() {
  const [tab, setTab] = useState('targeting');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
  'Admin',
  'Teachers']
  );
  const roles = ['Admin', 'Teachers', 'Parents', 'Students', 'Support Staff'];
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Smart Targeting & Filtering
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure role-based targeting, class-wise filters and content
            search
          </p>
        </div>
      </div>

      <Card noPadding>
        <Tabs defaultValue="targeting" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="targeting">Role-based Targeting</TabsTrigger>
            <TabsTrigger value="classwise">Class-wise Targeting</TabsTrigger>
            <TabsTrigger value="filters">Content Filters</TabsTrigger>
            <TabsTrigger value="search">Search & Keyword</TabsTrigger>
            <TabsTrigger value="pinned">Pinned Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="targeting" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Configure Post Targeting">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Target Roles
                    </label>
                    <div className="space-y-2">
                      {roles.map((role, i) =>
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                          <input
                          type="checkbox"
                          checked={selectedRoles.includes(role)}
                          onChange={() =>
                          setSelectedRoles((prev) =>
                          prev.includes(role) ?
                          prev.filter((r) => r !== role) :
                          [...prev, role]
                          )
                          }
                          className="h-4 w-4 text-blue-600 rounded" />

                          <span className="text-sm text-gray-700">{role}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {Math.floor(Math.random() * 200 + 50)} users
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-700">
                      Selected: {selectedRoles.join(', ')}
                    </p>
                    <p className="text-xs text-blue-500 mt-0.5">
                      Estimated reach: ~{selectedRoles.length * 120} users
                    </p>
                  </div>
                  <Button variant="primary" className="w-full">
                    Apply Targeting
                  </Button>
                </div>
              </Card>
              <Card title="Targeting Rules">
                <div className="space-y-3">
                  {[
                  {
                    rule: 'Fee Circulars',
                    target: 'Parents Only',
                    posts: 12
                  },
                  {
                    rule: 'Academic Updates',
                    target: 'Teachers + Students',
                    posts: 34
                  },
                  {
                    rule: 'Staff Notices',
                    target: 'Staff Only',
                    posts: 8
                  },
                  {
                    rule: 'Emergency Alerts',
                    target: 'All Users',
                    posts: 3
                  },
                  {
                    rule: 'Achievement Posts',
                    target: 'All Users',
                    posts: 18
                  }].
                  map((rule, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <TagIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {rule.rule}
                        </p>
                        <p className="text-xs text-gray-400">→ {rule.target}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {rule.posts} posts
                      </span>
                      <Button variant="ghost" className="text-xs h-6 px-2">
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classwise" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Class-wise Distribution">
                <div className="space-y-2">
                  {[
                  'Class 6',
                  'Class 7',
                  'Class 8',
                  'Class 9',
                  'Class 10',
                  'Class 11',
                  'Class 12'].
                  map((cls, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                      <input
                      type="checkbox"
                      defaultChecked={i < 5}
                      className="h-4 w-4 text-blue-600 rounded" />

                      <span className="text-sm text-gray-700 flex-1">
                        {cls}
                      </span>
                      <span className="text-xs text-gray-400">
                        ~{Math.floor(Math.random() * 50 + 80)} parents
                      </span>
                    </div>
                  )}
                  <Button variant="primary" className="w-full mt-2">
                    Apply Class Filter
                  </Button>
                </div>
              </Card>
              <Card title="Section-wise Targeting">
                <div className="space-y-3">
                  <Select
                    label="Select Class"
                    options={[
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

                  <div className="space-y-2">
                    {['Section A', 'Section B', 'Section C'].map((sec, i) =>
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                        <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 rounded" />

                        <span className="text-sm text-gray-700">{sec}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          ~40 parents
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="primary" className="w-full">
                    Apply Section Filter
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Filter Posts">
                <div className="space-y-3">
                  <Select
                    label="Filter by Category"
                    options={[
                    {
                      value: 'all',
                      label: 'All Categories'
                    },
                    {
                      value: 'announcement',
                      label: 'Announcements'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    },
                    {
                      value: 'fee',
                      label: 'Fee Related'
                    },
                    {
                      value: 'event',
                      label: 'Events'
                    },
                    {
                      value: 'emergency',
                      label: 'Emergency'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <Select
                    label="Sort By"
                    options={[
                    {
                      value: 'newest',
                      label: 'Newest First'
                    },
                    {
                      value: 'oldest',
                      label: 'Oldest First'
                    },
                    {
                      value: 'popular',
                      label: 'Most Popular'
                    },
                    {
                      value: 'important',
                      label: 'Important First'
                    }]
                    } />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Show Important Only
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-gray-300">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </Card>
              <Card title="Active Filters">
                <div className="space-y-2">
                  {[
                  {
                    filter: 'Category: Announcements',
                    active: true
                  },
                  {
                    filter: 'Date: Last 7 days',
                    active: true
                  },
                  {
                    filter: 'Audience: Parents',
                    active: true
                  }].
                  map((f, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">

                      <span className="text-xs font-medium text-blue-700 flex-1">
                        {f.filter}
                      </span>
                      <button className="text-blue-400 hover:text-blue-700 text-xs">
                        ✕
                      </button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-red-500">

                    Clear All Filters
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="search" className="p-5">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Search posts by keyword..."
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="flex-1" />

                <Button variant="primary">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <Card title="Recent Searches">
                <div className="flex flex-wrap gap-2">
                  {[
                  'Annual Day',
                  'Fee Reminder',
                  'Exam Schedule',
                  'Holiday',
                  'Sports Day',
                  'PTM'].
                  map((term, i) =>
                  <button
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors">

                      {term}
                    </button>
                  )}
                </div>
              </Card>
              <Card title="Mark as Important">
                <div className="space-y-2">
                  {[
                  'Annual Day 2025 Registration',
                  'Fee Payment Deadline',
                  'Exam Timetable'].
                  map((post, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <span className="text-sm text-gray-700 flex-1">
                        {post}
                      </span>
                      <Button
                      variant="ghost"
                      className="text-xs h-6 px-2 text-orange-500">

                        Mark Important
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pinned" className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
              {
                category: 'Announcements',
                pinned: 3,
                color: 'bg-blue-50 border-blue-200'
              },
              {
                category: 'Fee Circulars',
                pinned: 2,
                color: 'bg-orange-50 border-orange-200'
              },
              {
                category: 'Academic Updates',
                pinned: 4,
                color: 'bg-green-50 border-green-200'
              },
              {
                category: 'Events',
                pinned: 1,
                color: 'bg-purple-50 border-purple-200'
              },
              {
                category: 'Emergency',
                pinned: 0,
                color: 'bg-red-50 border-red-200'
              },
              {
                category: 'Achievements',
                pinned: 2,
                color: 'bg-yellow-50 border-yellow-200'
              }].
              map((cat, i) =>
              <div
                key={i}
                className={`border rounded-xl p-4 text-center ${cat.color}`}>

                  <PinIcon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">
                    {cat.category}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {cat.pinned}
                  </p>
                  <p className="text-xs text-gray-500">pinned posts</p>
                  <Button variant="ghost" className="text-xs h-6 px-2 mt-2">
                    Manage
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}