import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  DownloadIcon,
  TrendingUpIcon,
  EyeIcon,
  BarChart2Icon } from
'lucide-react';
export function AnalyticsInsights() {
  const [tab, setTab] = useState('overview');
  const topPosts = [
  {
    title: 'Annual Day 2025 Registration',
    views: 789,
    engagement: '68%',
    category: 'Event'
  },
  {
    title: 'Arjun Sharma wins Science Olympiad',
    views: 634,
    engagement: '82%',
    category: 'Achievement'
  },
  {
    title: 'Fee Payment Reminder',
    views: 412,
    engagement: '45%',
    category: 'Circular'
  },
  {
    title: 'Holiday Announcement',
    views: 398,
    engagement: '91%',
    category: 'Notice'
  },
  {
    title: 'PTM Schedule Released',
    views: 356,
    engagement: '74%',
    category: 'Academic'
  }];

  const categoryStats = [
  {
    category: 'Announcements',
    posts: 24,
    avgViews: 312,
    engagement: '72%'
  },
  {
    category: 'Academic Updates',
    posts: 18,
    avgViews: 245,
    engagement: '68%'
  },
  {
    category: 'Events',
    posts: 12,
    avgViews: 456,
    engagement: '81%'
  },
  {
    category: 'Fee Circulars',
    posts: 8,
    avgViews: 389,
    engagement: '56%'
  },
  {
    category: 'Emergency',
    posts: 3,
    avgViews: 892,
    engagement: '95%'
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Post reach, engagement rates, most viewed updates and compliance
            analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
            {
              value: '7',
              label: 'Last 7 days'
            },
            {
              value: '30',
              label: 'Last 30 days'
            },
            {
              value: '90',
              label: 'Last 90 days'
            }]
            }
            className="w-36" />

          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Post Reach',
          value: '12,456',
          change: '+18%',
          color: 'text-blue-600'
        },
        {
          label: 'Avg. Engagement Rate',
          value: '74.2%',
          change: '+5.1%',
          color: 'text-green-600'
        },
        {
          label: 'Posts Published',
          value: '65',
          change: '+12',
          color: 'text-purple-600'
        },
        {
          label: 'Compliance Pending',
          value: '4',
          change: '-2',
          color: 'text-orange-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUpIcon className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  {s.change}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reach">Post Reach</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Daily Reach (Last 7 Days)">
                <div className="flex items-end gap-2 h-28">
                  {[
                  {
                    d: 'Mon',
                    v: 1245
                  },
                  {
                    d: 'Tue',
                    v: 1456
                  },
                  {
                    d: 'Wed',
                    v: 1123
                  },
                  {
                    d: 'Thu',
                    v: 1678
                  },
                  {
                    d: 'Fri',
                    v: 1890
                  },
                  {
                    d: 'Sat',
                    v: 987
                  },
                  {
                    d: 'Sun',
                    v: 654
                  }].
                  map((d, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[9px] text-gray-400">{d.v}</span>
                      <div
                      className="w-full bg-blue-500 rounded-t-sm"
                      style={{
                        height: `${d.v / 2000 * 100}px`
                      }} />

                      <span className="text-[9px] text-gray-500">{d.d}</span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Top Performing Posts">
                <div className="space-y-2">
                  {topPosts.slice(0, 4).map((post, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                      <span className="text-xs font-bold text-gray-400 w-4">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-400">{post.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-800">
                          {post.views}
                        </p>
                        <p className="text-xs text-green-600">
                          {post.engagement}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reach" className="p-5">
            <div className="space-y-3">
              {topPosts.map((post, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">

                  <span className="text-sm font-bold text-gray-400 w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400">{post.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-800">
                      {post.views}
                    </span>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${post.views / 800 * 100}%`
                      }} />

                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Engagement by Post Type">
                <div className="space-y-3">
                  {[
                  {
                    type: 'Emergency Alerts',
                    rate: '95%',
                    color: 'bg-red-500'
                  },
                  {
                    type: 'Events',
                    rate: '81%',
                    color: 'bg-purple-500'
                  },
                  {
                    type: 'Achievements',
                    rate: '78%',
                    color: 'bg-yellow-500'
                  },
                  {
                    type: 'Announcements',
                    rate: '72%',
                    color: 'bg-blue-500'
                  },
                  {
                    type: 'Academic Updates',
                    rate: '68%',
                    color: 'bg-green-500'
                  },
                  {
                    type: 'Fee Circulars',
                    rate: '56%',
                    color: 'bg-orange-500'
                  }].
                  map((e, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-32">
                        {e.type}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${e.color} rounded-full`}
                        style={{
                          width: e.rate
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8">
                        {e.rate}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Engagement Trend">
                <div className="flex items-end gap-2 h-28">
                  {[
                  {
                    m: 'Jan',
                    v: 68
                  },
                  {
                    m: 'Feb',
                    v: 71
                  },
                  {
                    m: 'Mar',
                    v: 69
                  },
                  {
                    m: 'Apr',
                    v: 74
                  },
                  {
                    m: 'May',
                    v: 72
                  },
                  {
                    m: 'Jun',
                    v: 74
                  }].
                  map((d, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[9px] text-gray-400">{d.v}%</span>
                      <div
                      className="w-full bg-green-500 rounded-t-sm"
                      style={{
                        height: `${d.v / 100 * 100}px`
                      }} />

                      <span className="text-[9px] text-gray-500">{d.m}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                    'Category',
                    'Posts Published',
                    'Avg. Views',
                    'Avg. Engagement',
                    'Performance'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">

                        {h}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoryStats.map((row, i) =>
                  <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {row.category}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.posts}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">
                        {row.avgViews}
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">
                        {row.engagement}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: row.engagement
                            }} />

                          </div>
                          <BarChart2Icon className="w-3 h-3 text-gray-400" />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Compliance Pending Alerts">
                <div className="space-y-2">
                  {[
                  {
                    item: 'UDISE Data not submitted',
                    deadline: '2025-09-30',
                    urgency: 'Medium'
                  },
                  {
                    item: 'Annual Report pending',
                    deadline: '2025-07-31',
                    urgency: 'High'
                  },
                  {
                    item: 'Staff verification incomplete',
                    deadline: '2025-06-30',
                    urgency: 'High'
                  },
                  {
                    item: 'Fee structure not filed',
                    deadline: '2025-07-01',
                    urgency: 'Medium'
                  }].
                  map((item, i) =>
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${item.urgency === 'High' ? 'bg-red-50 border border-red-100' : 'bg-yellow-50 border border-yellow-100'}`}>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.item}
                        </p>
                        <p className="text-xs text-gray-400">
                          Deadline: {item.deadline}
                        </p>
                      </div>
                      <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>

                        {item.urgency}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Compliance Score">
                <div className="text-center py-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3" />

                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        strokeDasharray="70 30" />

                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xl font-bold text-gray-900">70%</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Overall Compliance Score
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    7 of 10 items compliant
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}