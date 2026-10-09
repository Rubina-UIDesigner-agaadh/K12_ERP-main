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
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DownloadIcon } from
'lucide-react';
export function PerformanceOverview() {
  const [tab, setTab] = useState('fee');
  const feeData = [
  {
    month: 'Jan',
    collected: 18.2,
    target: 20
  },
  {
    month: 'Feb',
    collected: 19.1,
    target: 20
  },
  {
    month: 'Mar',
    collected: 17.8,
    target: 20
  },
  {
    month: 'Apr',
    collected: 20.4,
    target: 20
  },
  {
    month: 'May',
    collected: 18.9,
    target: 20
  },
  {
    month: 'Jun',
    collected: 18.4,
    target: 20
  }];

  const expenseCategories = [
  {
    name: 'Staff Salaries',
    budget: 85,
    spent: 82,
    pct: 96
  },
  {
    name: 'Infrastructure',
    budget: 15,
    spent: 8.2,
    pct: 55
  },
  {
    name: 'Events & Activities',
    budget: 8,
    spent: 5.6,
    pct: 70
  },
  {
    name: 'IT & Technology',
    budget: 6,
    spent: 4.1,
    pct: 68
  },
  {
    name: 'Utilities',
    budget: 4,
    spent: 3.8,
    pct: 95
  },
  {
    name: 'Stationery & Supplies',
    budget: 3,
    spent: 2.1,
    pct: 70
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Performance Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fee collection, expense summary and budget vs actual analysis
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
          label: 'Total Fee Collected',
          value: '₹1.12 Cr',
          change: '+8.5%',
          trend: 'up'
        },
        {
          label: 'Total Expenses',
          value: '₹1.06 Cr',
          change: '+4.2%',
          trend: 'up'
        },
        {
          label: 'Net Surplus',
          value: '₹6.4L',
          change: '+12%',
          trend: 'up'
        },
        {
          label: 'Collection Rate',
          value: '83.6%',
          change: '+2.1%',
          trend: 'up'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {s.trend === 'up' ?
              <TrendingUpIcon className="w-3 h-3 text-green-500" /> :

              <TrendingDownIcon className="w-3 h-3 text-red-500" />
              }
                <span className="text-xs text-green-600 font-medium">
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
              <Card title="Monthly Fee Collection (₹ Lakhs)">
                <div className="flex items-end gap-3 h-36 mt-2">
                  {feeData.map((d, i) =>
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1">

                      <span className="text-[10px] text-gray-400">
                        {d.collected}L
                      </span>
                      <div className="w-full relative">
                        <div
                        className="w-full bg-gray-100 rounded-t-sm"
                        style={{
                          height: `${d.target / 22 * 100}px`
                        }}>

                          <div
                          className="w-full bg-blue-500 rounded-t-sm absolute bottom-0"
                          style={{
                            height: `${d.collected / 22 * 100}px`
                          }} />

                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {d.month}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Collection by Class">
                <div className="space-y-2">
                  {[
                  {
                    class: 'Class 11-12',
                    collected: '₹28.4L',
                    rate: '91%',
                    color: 'bg-green-500'
                  },
                  {
                    class: 'Class 9-10',
                    collected: '₹24.1L',
                    rate: '87%',
                    color: 'bg-blue-500'
                  },
                  {
                    class: 'Class 6-8',
                    collected: '₹32.6L',
                    rate: '84%',
                    color: 'bg-purple-500'
                  },
                  {
                    class: 'Class 1-5',
                    collected: '₹26.9L',
                    rate: '79%',
                    color: 'bg-orange-500'
                  }].
                  map((c, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-20">
                        {c.class}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${c.color} rounded-full`}
                        style={{
                          width: c.rate
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-16 text-right">
                        {c.collected}
                      </span>
                      <span className="text-xs text-gray-400 w-8">
                        {c.rate}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expense" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Expense by Category (₹ Lakhs)">
                <div className="space-y-3">
                  {expenseCategories.map((cat, i) =>
                  <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{cat.name}</span>
                        <span className="font-medium text-gray-800">
                          ₹{cat.spent}L / ₹{cat.budget}L
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full rounded-full ${cat.pct > 90 ? 'bg-red-400' : cat.pct > 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
                        style={{
                          width: `${cat.pct}%`
                        }} />

                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Expense Distribution">
                <div className="space-y-2">
                  {expenseCategories.map((cat, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">

                      <span className="text-sm text-gray-700">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{cat.spent}L
                        </span>
                        <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cat.pct > 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>

                          {cat.pct}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="p-5">
            <Card title="Budget vs Actual (₹ Lakhs) — 2025-26">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                      'Category',
                      'Budget',
                      'Actual',
                      'Variance',
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
                    {expenseCategories.map((cat, i) => {
                      const variance = cat.budget - cat.spent;
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {cat.name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            ₹{cat.budget}L
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            ₹{cat.spent}L
                          </td>
                          <td
                            className={`px-4 py-3 font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>

                            {variance >= 0 ? '+' : ''}₹{variance.toFixed(1)}L
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cat.pct > 90 ? 'bg-red-100 text-red-700' : cat.pct > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>

                              {cat.pct > 90 ?
                              'Over Budget' :
                              cat.pct > 70 ?
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