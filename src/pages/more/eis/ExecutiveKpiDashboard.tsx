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
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  BookOpenIcon,
  DollarSignIcon,
  AlertCircleIcon } from
'lucide-react';
const kpis = [
{
  label: 'Total Students',
  value: '1,248',
  change: '+3.2%',
  trend: 'up',
  icon: UsersIcon,
  color: 'text-blue-600',
  bg: 'bg-blue-50'
},
{
  label: 'Attendance Rate',
  value: '94.2%',
  change: '+1.1%',
  trend: 'up',
  icon: BookOpenIcon,
  color: 'text-green-600',
  bg: 'bg-green-50'
},
{
  label: 'Fee Collection',
  value: '₹18.4L',
  change: '+8.5%',
  trend: 'up',
  icon: DollarSignIcon,
  color: 'text-purple-600',
  bg: 'bg-purple-50'
},
{
  label: 'Pass Percentage',
  value: '96.8%',
  change: '-0.4%',
  trend: 'down',
  icon: BookOpenIcon,
  color: 'text-orange-600',
  bg: 'bg-orange-50'
},
{
  label: 'Staff Strength',
  value: '87',
  change: '+2',
  trend: 'up',
  icon: UsersIcon,
  color: 'text-teal-600',
  bg: 'bg-teal-50'
},
{
  label: 'Open Issues',
  value: '12',
  change: '-3',
  trend: 'up',
  icon: AlertCircleIcon,
  color: 'text-red-600',
  bg: 'bg-red-50'
}];

const admissionTrends = [
{
  year: '2021-22',
  inquiries: 280,
  enrolled: 198
},
{
  year: '2022-23',
  inquiries: 320,
  enrolled: 234
},
{
  year: '2023-24',
  inquiries: 380,
  enrolled: 267
},
{
  year: '2024-25',
  inquiries: 420,
  enrolled: 298
},
{
  year: '2025-26',
  inquiries: 156,
  enrolled: 87
}];

const resultAnalytics = [
{
  class: 'Class 10',
  appeared: 45,
  passed: 44,
  distinction: 18,
  passRate: '97.8%'
},
{
  class: 'Class 9',
  appeared: 52,
  passed: 50,
  distinction: 12,
  passRate: '96.2%'
},
{
  class: 'Class 8',
  appeared: 48,
  passed: 47,
  distinction: 15,
  passRate: '97.9%'
},
{
  class: 'Class 7',
  appeared: 50,
  passed: 49,
  distinction: 10,
  passRate: '98.0%'
}];

export function ExecutiveKpiDashboard() {
  const [tab, setTab] = useState('kpi');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Executive KPI Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time key performance indicators for school management
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

          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <Card noPadding>
        <Tabs defaultValue="kpi" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="kpi">KPI Overview</TabsTrigger>
            <TabsTrigger value="admission">Admission Trends</TabsTrigger>
            <TabsTrigger value="results">Result Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="kpi" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {kpis.map((kpi, i) =>
              <Card key={i}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">{kpi.label}</p>
                      <p className="text-xl font-bold text-gray-900">
                        {kpi.value}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {kpi.trend === 'up' ?
                      <TrendingUpIcon className="w-3 h-3 text-green-500" /> :

                      <TrendingDownIcon className="w-3 h-3 text-red-500" />
                      }
                        <span
                        className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>

                          {kpi.change}
                        </span>
                        <span className="text-xs text-gray-400">
                          vs last year
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Monthly Attendance Trend">
                <div className="flex items-end gap-2 h-28">
                  {[92, 94, 91, 95, 94, 93, 96, 94, 95, 94, 93, 94].map(
                    (v, i) =>
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1">

                        <div
                        className="w-full bg-blue-500 rounded-t-sm"
                        style={{
                          height: `${v / 100 * 100}%`
                        }} />

                        <span className="text-[9px] text-gray-400">
                          {
                        [
                        'J',
                        'F',
                        'M',
                        'A',
                        'M',
                        'J',
                        'J',
                        'A',
                        'S',
                        'O',
                        'N',
                        'D'][
                        i]
                        }
                        </span>
                      </div>

                  )}
                </div>
              </Card>
              <Card title="Fee Collection Progress">
                <div className="space-y-3">
                  {[
                  {
                    label: 'Collected',
                    value: 184,
                    total: 220,
                    color: 'bg-green-500'
                  },
                  {
                    label: 'Pending',
                    value: 36,
                    total: 220,
                    color: 'bg-yellow-400'
                  },
                  {
                    label: 'Overdue',
                    value: 12,
                    total: 220,
                    color: 'bg-red-400'
                  }].
                  map((item, i) =>
                  <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold">
                          ₹{item.value}L (
                          {Math.round(item.value / item.total * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{
                          width: `${item.value / item.total * 100}%`
                        }} />

                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admission" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Year-wise Admission Trend">
                <div className="space-y-3">
                  {admissionTrends.map((yr, i) =>
                  <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {yr.year}
                        </span>
                        <span className="text-gray-500">
                          {yr.enrolled} enrolled / {yr.inquiries} inquiries
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                        className="h-full bg-blue-200 rounded-full"
                        style={{
                          width: `${yr.inquiries / 420 * 100}%`
                        }} />

                        <div
                        className="h-full bg-blue-500 rounded-full absolute top-0 left-0"
                        style={{
                          width: `${yr.enrolled / 420 * 100}%`
                        }} />

                      </div>
                    </div>
                  )}
                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-2 bg-blue-200 rounded inline-block" />{' '}
                      Inquiries
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-2 bg-blue-500 rounded inline-block" />{' '}
                      Enrolled
                    </span>
                  </div>
                </div>
              </Card>
              <Card title="Current Year Admission Status">
                <div className="space-y-3">
                  {[
                  {
                    stage: 'Inquiries Received',
                    count: 156,
                    color: 'bg-blue-500'
                  },
                  {
                    stage: 'Forms Submitted',
                    count: 87,
                    color: 'bg-purple-500'
                  },
                  {
                    stage: 'Under Review',
                    count: 34,
                    color: 'bg-orange-500'
                  },
                  {
                    stage: 'Approved',
                    count: 52,
                    color: 'bg-green-500'
                  },
                  {
                    stage: 'Enrolled',
                    count: 48,
                    color: 'bg-teal-500'
                  }].
                  map((s, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-36">
                        {s.stage}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${s.color} rounded-full`}
                        style={{
                          width: `${s.count / 156 * 100}%`
                        }} />

                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                        {s.count}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Overall Pass Rate',
                value: '97.5%',
                color: 'text-green-600'
              },
              {
                label: 'Distinction',
                value: '28.4%',
                color: 'text-blue-600'
              },
              {
                label: 'First Class',
                value: '45.2%',
                color: 'text-purple-600'
              },
              {
                label: 'Failed',
                value: '2.5%',
                color: 'text-red-600'
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
            <Card title="Class-wise Result Analysis">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                      'Class',
                      'Appeared',
                      'Passed',
                      'Distinction',
                      'Pass Rate'].
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
                    {resultAnalytics.map((row, i) =>
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.class}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.appeared}
                        </td>
                        <td className="px-4 py-3 text-green-600 font-medium">
                          {row.passed}
                        </td>
                        <td className="px-4 py-3 text-blue-600 font-medium">
                          {row.distinction}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {row.passRate}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}