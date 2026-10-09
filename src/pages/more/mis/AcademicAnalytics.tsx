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
export function AcademicAnalytics() {
  const [tab, setTab] = useState('classwise');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Class-wise, gender-wise and result trend analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
            {
              value: 'term1',
              label: 'Term 1'
            },
            {
              value: 'term2',
              label: 'Term 2'
            },
            {
              value: 'annual',
              label: 'Annual'
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
        <Tabs defaultValue="classwise" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="classwise">Class-wise Analysis</TabsTrigger>
            <TabsTrigger value="genderwise">Gender-wise Analysis</TabsTrigger>
            <TabsTrigger value="trends">Result Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="classwise" className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                    'Class',
                    'Students',
                    'Avg. Score',
                    'Pass Rate',
                    'Distinction',
                    'Top Score',
                    'Lowest Score'].
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
                    students: 120,
                    avg: '74%',
                    pass: '99%',
                    distinction: '22%',
                    top: '98%',
                    lowest: '38%'
                  },
                  {
                    class: 'Class 7',
                    students: 115,
                    avg: '71%',
                    pass: '98%',
                    distinction: '18%',
                    top: '96%',
                    lowest: '35%'
                  },
                  {
                    class: 'Class 8',
                    students: 118,
                    avg: '73%',
                    pass: '98%',
                    distinction: '20%',
                    top: '97%',
                    lowest: '36%'
                  },
                  {
                    class: 'Class 9',
                    students: 112,
                    avg: '69%',
                    pass: '96%',
                    distinction: '15%',
                    top: '95%',
                    lowest: '32%'
                  },
                  {
                    class: 'Class 10',
                    students: 108,
                    avg: '76%',
                    pass: '98%',
                    distinction: '28%',
                    top: '99%',
                    lowest: '38%'
                  },
                  {
                    class: 'Class 11',
                    students: 95,
                    avg: '72%',
                    pass: '97%',
                    distinction: '24%',
                    top: '97%',
                    lowest: '40%'
                  },
                  {
                    class: 'Class 12',
                    students: 88,
                    avg: '78%',
                    pass: '98%',
                    distinction: '32%',
                    top: '99%',
                    lowest: '42%'
                  }].
                  map((row, i) =>
                  <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {row.class}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {row.students}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">
                        {row.avg}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {row.pass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-purple-600 font-medium">
                        {row.distinction}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.top}</td>
                      <td className="px-4 py-3 text-gray-600">{row.lowest}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="genderwise" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Gender-wise Performance Comparison">
                <div className="space-y-4">
                  {[
                  {
                    subject: 'Mathematics',
                    boys: 68,
                    girls: 72
                  },
                  {
                    subject: 'Science',
                    boys: 74,
                    girls: 76
                  },
                  {
                    subject: 'English',
                    boys: 72,
                    girls: 82
                  },
                  {
                    subject: 'Social Studies',
                    boys: 76,
                    girls: 80
                  },
                  {
                    subject: 'Languages',
                    boys: 70,
                    girls: 84
                  }].
                  map((s, i) =>
                  <div key={i}>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {s.subject}
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-blue-600">Boys</span>
                            <span className="font-medium">{s.boys}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${s.boys}%`
                            }} />

                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-pink-600">Girls</span>
                            <span className="font-medium">{s.girls}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-pink-500 rounded-full"
                            style={{
                              width: `${s.girls}%`
                            }} />

                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Overall Gender Stats">
                <div className="space-y-4">
                  {[
                  {
                    label: 'Total Boys',
                    value: '634',
                    sub: '50.8% of students',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50'
                  },
                  {
                    label: 'Total Girls',
                    value: '614',
                    sub: '49.2% of students',
                    color: 'text-pink-600',
                    bg: 'bg-pink-50'
                  },
                  {
                    label: 'Boys Pass Rate',
                    value: '96.8%',
                    sub: 'vs 98.2% girls',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50'
                  },
                  {
                    label: 'Girls Pass Rate',
                    value: '98.2%',
                    sub: 'vs 96.8% boys',
                    color: 'text-pink-600',
                    bg: 'bg-pink-50'
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${s.bg}`}>

                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className={`text-xl font-bold ${s.color}`}>
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-400">{s.sub}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="5-Year Result Trend">
                <div className="space-y-3">
                  {[
                  {
                    year: '2020-21',
                    passRate: 94.2,
                    avg: 68.4
                  },
                  {
                    year: '2021-22',
                    passRate: 95.8,
                    avg: 70.1
                  },
                  {
                    year: '2022-23',
                    passRate: 96.4,
                    avg: 71.8
                  },
                  {
                    year: '2023-24',
                    passRate: 97.1,
                    avg: 72.9
                  },
                  {
                    year: '2024-25',
                    passRate: 97.5,
                    avg: 74.2
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
                          width: `${yr.passRate}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-green-600 w-12">
                        {yr.passRate}%
                      </span>
                      <span className="text-xs text-gray-400 w-12">
                        Avg: {yr.avg}%
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Subject-wise Trend (Last 3 Years)">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                        'Subject',
                        '2022-23',
                        '2023-24',
                        '2024-25',
                        'Trend'].
                        map((h) =>
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold text-gray-500">

                            {h}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                      {
                        subject: 'Maths',
                        y1: '65%',
                        y2: '67%',
                        y3: '68%',
                        up: true
                      },
                      {
                        subject: 'Science',
                        y1: '71%',
                        y2: '73%',
                        y3: '74%',
                        up: true
                      },
                      {
                        subject: 'English',
                        y1: '74%',
                        y2: '75%',
                        y3: '76%',
                        up: true
                      },
                      {
                        subject: 'S.Studies',
                        y1: '77%',
                        y2: '78%',
                        y3: '79%',
                        up: true
                      }].
                      map((row, i) =>
                      <tr key={i}>
                          <td className="px-3 py-2 font-medium text-gray-700">
                            {row.subject}
                          </td>
                          <td className="px-3 py-2 text-gray-500">{row.y1}</td>
                          <td className="px-3 py-2 text-gray-500">{row.y2}</td>
                          <td className="px-3 py-2 font-semibold text-blue-600">
                            {row.y3}
                          </td>
                          <td className="px-3 py-2 text-green-500">↑</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}