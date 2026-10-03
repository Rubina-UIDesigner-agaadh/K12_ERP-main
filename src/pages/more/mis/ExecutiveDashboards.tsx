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
import { DownloadIcon, TrendingUpIcon } from 'lucide-react';
export function ExecutiveDashboards() {
  const [tab, setTab] = useState('academic');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Executive Dashboards
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Academic performance, attendance, fee collection and staff metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
            {
              value: '2025-26',
              label: '2025-26'
            },
            {
              value: '2024-25',
              label: '2024-25'
            }]
            }
            className="w-32" />

          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card noPadding>
        <Tabs defaultValue="academic" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="academic">Academic Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Analytics</TabsTrigger>
            <TabsTrigger value="fee">Fee Collection</TabsTrigger>
            <TabsTrigger value="staff">Staff Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Overall Pass Rate',
                value: '97.5%',
                color: 'text-green-600'
              },
              {
                label: 'Avg. Score',
                value: '72.4%',
                color: 'text-blue-600'
              },
              {
                label: 'Distinction Rate',
                value: '28.4%',
                color: 'text-purple-600'
              },
              {
                label: 'Improvement Rate',
                value: '+4.2%',
                color: 'text-teal-600'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Subject-wise Performance">
                <div className="space-y-2">
                  {[
                  {
                    subject: 'Mathematics',
                    avg: 68,
                    pass: 94
                  },
                  {
                    subject: 'Science',
                    avg: 74,
                    pass: 97
                  },
                  {
                    subject: 'English',
                    avg: 76,
                    pass: 98
                  },
                  {
                    subject: 'Social Studies',
                    avg: 79,
                    pass: 99
                  },
                  {
                    subject: 'Hindi',
                    avg: 82,
                    pass: 99
                  }].
                  map((s, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-28">
                        {s.subject}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${s.avg}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8">
                        {s.avg}%
                      </span>
                      <span className="text-xs text-green-600 w-12">
                        Pass: {s.pass}%
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Class-wise Average Score">
                <div className="flex items-end gap-3 h-36">
                  {[
                  {
                    class: 'Cl.6',
                    score: 74
                  },
                  {
                    class: 'Cl.7',
                    score: 71
                  },
                  {
                    class: 'Cl.8',
                    score: 73
                  },
                  {
                    class: 'Cl.9',
                    score: 69
                  },
                  {
                    class: 'Cl.10',
                    score: 76
                  },
                  {
                    class: 'Cl.11',
                    score: 72
                  },
                  {
                    class: 'Cl.12',
                    score: 78
                  }].
                  map((c, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[10px] text-gray-400">
                        {c.score}%
                      </span>
                      <div
                      className="w-full bg-purple-500 rounded-t-sm"
                      style={{
                        height: `${c.score / 100 * 120}px`
                      }} />

                      <span className="text-[10px] text-gray-500">
                        {c.class}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Overall Attendance',
                value: '94.2%',
                color: 'text-green-600'
              },
              {
                label: 'Students Below 75%',
                value: '18',
                color: 'text-red-600'
              },
              {
                label: 'Perfect Attendance',
                value: '234',
                color: 'text-blue-600'
              },
              {
                label: 'Avg. Daily Present',
                value: '1,175',
                color: 'text-purple-600'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Monthly Attendance Trend">
                <div className="flex items-end gap-2 h-28">
                  {[92, 94, 91, 95, 94, 93].map((v, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[10px] text-gray-400">{v}%</span>
                      <div
                      className="w-full bg-green-500 rounded-t-sm"
                      style={{
                        height: `${v / 100 * 100}px`
                      }} />

                      <span className="text-[10px] text-gray-500">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Class-wise Attendance">
                <div className="space-y-2">
                  {[
                  {
                    class: 'Class 6',
                    rate: '96%',
                    color: 'bg-green-500'
                  },
                  {
                    class: 'Class 7',
                    rate: '95%',
                    color: 'bg-green-500'
                  },
                  {
                    class: 'Class 8',
                    rate: '93%',
                    color: 'bg-blue-500'
                  },
                  {
                    class: 'Class 9',
                    rate: '91%',
                    color: 'bg-yellow-500'
                  },
                  {
                    class: 'Class 10',
                    rate: '94%',
                    color: 'bg-blue-500'
                  }].
                  map((c, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-16">
                        {c.class}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${c.color} rounded-full`}
                        style={{
                          width: c.rate
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {c.rate}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fee" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Total Collected',
                value: '₹1.12 Cr',
                color: 'text-green-600'
              },
              {
                label: 'Pending',
                value: '₹22.4L',
                color: 'text-orange-600'
              },
              {
                label: 'Overdue',
                value: '₹8.6L',
                color: 'text-red-600'
              },
              {
                label: 'Collection Rate',
                value: '83.6%',
                color: 'text-blue-600'
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
            <Card title="Fee Collection by Month">
              <div className="flex items-end gap-3 h-36">
                {[
                {
                  m: 'Jan',
                  v: 18.2
                },
                {
                  m: 'Feb',
                  v: 19.1
                },
                {
                  m: 'Mar',
                  v: 17.8
                },
                {
                  m: 'Apr',
                  v: 20.4
                },
                {
                  m: 'May',
                  v: 18.9
                },
                {
                  m: 'Jun',
                  v: 18.4
                }].
                map((d, i) =>
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1">

                    <span className="text-[10px] text-gray-400">{d.v}L</span>
                    <div
                    className="w-full bg-purple-500 rounded-t-sm"
                    style={{
                      height: `${d.v / 22 * 120}px`
                    }} />

                    <span className="text-[10px] text-gray-500">{d.m}</span>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Total Staff',
                value: '87',
                color: 'text-blue-600'
              },
              {
                label: 'Teaching Staff',
                value: '52',
                color: 'text-green-600'
              },
              {
                label: 'Avg. Attendance',
                value: '96.8%',
                color: 'text-purple-600'
              },
              {
                label: 'On Leave Today',
                value: '4',
                color: 'text-orange-600'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Department-wise Staff">
                <div className="space-y-2">
                  {[
                  {
                    dept: 'Science',
                    count: 8
                  },
                  {
                    dept: 'Mathematics',
                    count: 6
                  },
                  {
                    dept: 'Languages',
                    count: 10
                  },
                  {
                    dept: 'Social Studies',
                    count: 5
                  },
                  {
                    dept: 'Physical Education',
                    count: 3
                  },
                  {
                    dept: 'Arts & Music',
                    count: 4
                  }].
                  map((d, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-28">
                        {d.dept}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{
                          width: `${d.count / 10 * 100}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {d.count}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Staff Performance Ratings">
                <div className="space-y-2">
                  {[
                  {
                    rating: 'Excellent (4.5-5.0)',
                    count: 18,
                    pct: 35,
                    color: 'bg-green-500'
                  },
                  {
                    rating: 'Good (3.5-4.4)',
                    count: 24,
                    pct: 46,
                    color: 'bg-blue-500'
                  },
                  {
                    rating: 'Average (2.5-3.4)',
                    count: 8,
                    pct: 15,
                    color: 'bg-yellow-500'
                  },
                  {
                    rating: 'Below Average',
                    count: 2,
                    pct: 4,
                    color: 'bg-red-400'
                  }].
                  map((r, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-40">
                        {r.rating}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${r.color} rounded-full`}
                        style={{
                          width: `${r.pct}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {r.count}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}