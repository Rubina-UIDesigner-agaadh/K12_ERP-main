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
import { DownloadIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
export function FinancialOverview() {
  const [tab, setTab] = useState('fee');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fee collection, expense summary and financial health indicators
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Revenue',
          value: '₹1.34 Cr',
          change: '+8.5%',
          trend: 'up',
          color: 'text-green-600'
        },
        {
          label: 'Total Expenses',
          value: '₹1.06 Cr',
          change: '+4.2%',
          trend: 'up',
          color: 'text-red-600'
        },
        {
          label: 'Net Surplus',
          value: '₹28L',
          change: '+18%',
          trend: 'up',
          color: 'text-blue-600'
        },
        {
          label: 'Fee Pending',
          value: '₹22.4L',
          change: '-12%',
          trend: 'down',
          color: 'text-orange-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {s.trend === 'up' ?
              <TrendingUpIcon className="w-3 h-3 text-green-500" /> :

              <TrendingDownIcon className="w-3 h-3 text-red-500" />
              }
                <span
                className={`text-xs font-medium ${s.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>

                  {s.change}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="fee" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="fee">Fee Collection</TabsTrigger>
            <TabsTrigger value="expense">Expense Summary</TabsTrigger>
            <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
          </TabsList>

          <TabsContent value="fee" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Fee Collection by Head">
                <div className="space-y-2">
                  {[
                  {
                    head: 'Tuition Fee',
                    collected: '₹82.4L',
                    pending: '₹12.1L',
                    rate: '87%'
                  },
                  {
                    head: 'Transport Fee',
                    collected: '₹14.2L',
                    pending: '₹3.8L',
                    rate: '79%'
                  },
                  {
                    head: 'Activity Fee',
                    collected: '₹8.6L',
                    pending: '₹1.4L',
                    rate: '86%'
                  },
                  {
                    head: 'Exam Fee',
                    collected: '₹6.8L',
                    pending: '₹0.8L',
                    rate: '89%'
                  },
                  {
                    head: 'Library Fee',
                    collected: '₹2.4L',
                    pending: '₹0.3L',
                    rate: '89%'
                  }].
                  map((f, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {f.head}
                        </p>
                        <p className="text-xs text-gray-400">
                          Collected: {f.collected} | Pending: {f.pending}
                        </p>
                      </div>
                      <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${parseInt(f.rate) >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>

                        {f.rate}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Monthly Collection Trend">
                <div className="flex items-end gap-2 h-36">
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
                      className="w-full bg-green-500 rounded-t-sm"
                      style={{
                        height: `${d.v / 22 * 120}px`
                      }} />

                      <span className="text-[10px] text-gray-500">{d.m}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expense" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Expense by Category">
                <div className="space-y-2">
                  {[
                  {
                    cat: 'Staff Salaries',
                    amount: '₹82L',
                    pct: 77,
                    color: 'bg-blue-500'
                  },
                  {
                    cat: 'Infrastructure',
                    amount: '₹8.2L',
                    pct: 8,
                    color: 'bg-orange-500'
                  },
                  {
                    cat: 'Events & Activities',
                    amount: '₹5.6L',
                    pct: 5,
                    color: 'bg-purple-500'
                  },
                  {
                    cat: 'IT & Technology',
                    amount: '₹4.1L',
                    pct: 4,
                    color: 'bg-teal-500'
                  },
                  {
                    cat: 'Utilities',
                    amount: '₹3.8L',
                    pct: 4,
                    color: 'bg-yellow-500'
                  },
                  {
                    cat: 'Others',
                    amount: '₹2.3L',
                    pct: 2,
                    color: 'bg-gray-400'
                  }].
                  map((e, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <div
                      className={`w-2.5 h-2.5 rounded-full ${e.color} shrink-0`} />

                      <span className="text-xs text-gray-600 w-32">
                        {e.cat}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${e.color} rounded-full`}
                        style={{
                          width: `${e.pct}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-12 text-right">
                        {e.amount}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Monthly Expense Trend">
                <div className="flex items-end gap-2 h-36">
                  {[
                  {
                    m: 'Jan',
                    v: 16.8
                  },
                  {
                    m: 'Feb',
                    v: 17.2
                  },
                  {
                    m: 'Mar',
                    v: 15.9
                  },
                  {
                    m: 'Apr',
                    v: 18.1
                  },
                  {
                    m: 'May',
                    v: 17.4
                  },
                  {
                    m: 'Jun',
                    v: 16.6
                  }].
                  map((d, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[10px] text-gray-400">{d.v}L</span>
                      <div
                      className="w-full bg-red-400 rounded-t-sm"
                      style={{
                        height: `${d.v / 20 * 120}px`
                      }} />

                      <span className="text-[10px] text-gray-500">{d.m}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="p-5">
            <Card title="Budget vs Actual Summary">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                      'Category',
                      'Annual Budget',
                      'Spent (YTD)',
                      'Remaining',
                      'Utilization',
                      'Status'].
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
                      cat: 'Staff Salaries',
                      budget: 120,
                      spent: 82,
                      util: 68
                    },
                    {
                      cat: 'Infrastructure',
                      budget: 15,
                      spent: 8.2,
                      util: 55
                    },
                    {
                      cat: 'Events',
                      budget: 8,
                      spent: 5.6,
                      util: 70
                    },
                    {
                      cat: 'IT & Tech',
                      budget: 6,
                      spent: 4.1,
                      util: 68
                    },
                    {
                      cat: 'Utilities',
                      budget: 4,
                      spent: 3.8,
                      util: 95
                    }].
                    map((row, i) => {
                      const remaining = row.budget - row.spent;
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {row.cat}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            ₹{row.budget}L
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            ₹{row.spent}L
                          </td>
                          <td
                            className={`px-4 py-3 font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                            ₹{remaining.toFixed(1)}L
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${row.util > 90 ? 'bg-red-400' : 'bg-blue-500'}`}
                                  style={{
                                    width: `${row.util}%`
                                  }} />

                              </div>
                              <span className="text-xs text-gray-600">
                                {row.util}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.util > 90 ? 'bg-red-100 text-red-700' : row.util > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>

                              {row.util > 90 ?
                              'Critical' :
                              row.util > 70 ?
                              'On Track' :
                              'Under Budget'}
                            </span>
                          </td>
                        </tr>);

                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}