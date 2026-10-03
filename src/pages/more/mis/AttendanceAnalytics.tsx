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
import { DownloadIcon } from 'lucide-react';
export function AttendanceAnalytics() {
  const [tab, setTab] = useState('daily');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daily, class-wise and trend analysis of student attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
            {
              value: 'jun',
              label: 'June 2025'
            },
            {
              value: 'may',
              label: 'May 2025'
            },
            {
              value: 'apr',
              label: 'April 2025'
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
          label: "Today's Attendance",
          value: '94.2%',
          color: 'text-green-600'
        },
        {
          label: 'Present Today',
          value: '1,175',
          color: 'text-blue-600'
        },
        {
          label: 'Absent Today',
          value: '73',
          color: 'text-red-600'
        },
        {
          label: 'Monthly Average',
          value: '93.8%',
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

      <Card noPadding>
        <Tabs defaultValue="daily" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="classwise">Class-wise</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Today's Attendance by Class">
                <div className="space-y-2">
                  {[
                  {
                    class: 'Class 6',
                    present: 118,
                    total: 120,
                    rate: '98.3%',
                    color: 'bg-green-500'
                  },
                  {
                    class: 'Class 7',
                    present: 109,
                    total: 115,
                    rate: '94.8%',
                    color: 'bg-blue-500'
                  },
                  {
                    class: 'Class 8',
                    present: 110,
                    total: 118,
                    rate: '93.2%',
                    color: 'bg-blue-500'
                  },
                  {
                    class: 'Class 9',
                    present: 102,
                    total: 112,
                    rate: '91.1%',
                    color: 'bg-yellow-500'
                  },
                  {
                    class: 'Class 10',
                    present: 105,
                    total: 108,
                    rate: '97.2%',
                    color: 'bg-green-500'
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
                      <span className="text-xs text-gray-500">
                        {c.present}/{c.total}
                      </span>
                      <span className="text-xs font-semibold text-gray-700 w-12">
                        {c.rate}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Absent Students Today">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                  {
                    name: 'Arjun Sharma',
                    class: 'Class 8-A',
                    reason: 'Not informed'
                  },
                  {
                    name: 'Priya Patel',
                    class: 'Class 9-B',
                    reason: 'Medical leave'
                  },
                  {
                    name: 'Rohan Mehta',
                    class: 'Class 7-A',
                    reason: 'Not informed'
                  },
                  {
                    name: 'Kavya Nair',
                    class: 'Class 6-B',
                    reason: 'Family function'
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">

                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-red-600">
                          {s.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.class} • {s.reason}
                        </p>
                      </div>
                      <Button variant="ghost" className="text-xs h-6 px-2">
                        SMS
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classwise" className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                    'Class',
                    'Total Students',
                    'Working Days',
                    'Avg. Present',
                    'Avg. Absent',
                    'Attendance %',
                    'Below 75%'].
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
                  {[
                  {
                    class: 'Class 6',
                    total: 120,
                    days: 22,
                    present: 116,
                    absent: 4,
                    rate: '96.7%',
                    below75: 2
                  },
                  {
                    class: 'Class 7',
                    total: 115,
                    days: 22,
                    present: 109,
                    absent: 6,
                    rate: '94.8%',
                    below75: 3
                  },
                  {
                    class: 'Class 8',
                    total: 118,
                    days: 22,
                    present: 110,
                    absent: 8,
                    rate: '93.2%',
                    below75: 4
                  },
                  {
                    class: 'Class 9',
                    total: 112,
                    days: 22,
                    present: 102,
                    absent: 10,
                    rate: '91.1%',
                    below75: 5
                  },
                  {
                    class: 'Class 10',
                    total: 108,
                    days: 22,
                    present: 105,
                    absent: 3,
                    rate: '97.2%',
                    below75: 1
                  }].
                  map((row, i) =>
                  <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {row.class}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.total}</td>
                      <td className="px-4 py-3 text-gray-600">{row.days}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        {row.present}
                      </td>
                      <td className="px-4 py-3 text-red-500 font-medium">
                        {row.absent}
                      </td>
                      <td className="px-4 py-3">
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${parseFloat(row.rate) >= 95 ? 'bg-green-100 text-green-700' : parseFloat(row.rate) >= 90 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>

                          {row.rate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-red-500 font-medium">
                        {row.below75}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Monthly Attendance Trend (%)">
                <div className="flex items-end gap-2 h-36">
                  {[
                  {
                    m: 'Jan',
                    v: 92
                  },
                  {
                    m: 'Feb',
                    v: 94
                  },
                  {
                    m: 'Mar',
                    v: 91
                  },
                  {
                    m: 'Apr',
                    v: 95
                  },
                  {
                    m: 'May',
                    v: 94
                  },
                  {
                    m: 'Jun',
                    v: 93
                  }].
                  map((d, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[10px] text-gray-400">{d.v}%</span>
                      <div
                      className="w-full bg-blue-500 rounded-t-sm"
                      style={{
                        height: `${d.v / 100 * 120}px`
                      }} />

                      <span className="text-[10px] text-gray-500">{d.m}</span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Year-wise Comparison">
                <div className="space-y-3">
                  {[
                  {
                    year: '2021-22',
                    rate: '91.2%'
                  },
                  {
                    year: '2022-23',
                    rate: '92.8%'
                  },
                  {
                    year: '2023-24',
                    rate: '93.4%'
                  },
                  {
                    year: '2024-25',
                    rate: '94.2%'
                  }].
                  map((yr, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 w-16">
                        {yr.year}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: yr.rate
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-green-600">
                        {yr.rate}
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