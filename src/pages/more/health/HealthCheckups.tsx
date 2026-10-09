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
import { PlusIcon, SearchIcon } from 'lucide-react';
const checkupRecords = [
{
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  date: '2025-03-15',
  height: '158 cm',
  weight: '52 kg',
  bmi: '20.8',
  vision: '6/6',
  dental: 'Good',
  status: 'Normal'
},
{
  rollNo: '2024-067',
  name: 'Priya Patel',
  class: 'Class 6-B',
  date: '2025-03-15',
  height: '145 cm',
  weight: '38 kg',
  bmi: '18.1',
  vision: '6/9',
  dental: 'Cavity',
  status: 'Follow-up'
},
{
  rollNo: '2024-089',
  name: 'Kavya Nair',
  class: 'Class 7-A',
  date: '2025-03-15',
  height: '152 cm',
  weight: '45 kg',
  bmi: '19.5',
  vision: '6/6',
  dental: 'Good',
  status: 'Normal'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Normal: 'bg-green-100 text-green-700',
    'Follow-up': 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function HealthCheckups() {
  const [tab, setTab] = useState('annual');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Checkups</h1>
          <p className="text-sm text-gray-500 mt-1">
            Annual health checks, BMI tracking and vision/dental records
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Record Checkup
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="annual" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="annual">Annual Health Check</TabsTrigger>
            <TabsTrigger value="bmi">BMI Tracking</TabsTrigger>
            <TabsTrigger value="vision">Vision / Dental</TabsTrigger>
          </TabsList>

          <TabsContent value="annual" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search students..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Classes'
                },
                {
                  value: '6',
                  label: 'Class 6'
                },
                {
                  value: '7',
                  label: 'Class 7'
                },
                {
                  value: '8',
                  label: 'Class 8'
                }]
                }
                className="w-40" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Student'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'date',
                header: 'Checkup Date'
              },
              {
                key: 'height',
                header: 'Height'
              },
              {
                key: 'weight',
                header: 'Weight'
              },
              {
                key: 'bmi',
                header: 'BMI'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      View
                    </Button>

              }]
              }
              data={checkupRecords} />

          </TabsContent>

          <TabsContent value="bmi" className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'Underweight (<18.5)',
                count: 45,
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                label: 'Normal (18.5-24.9)',
                count: 892,
                color: 'text-green-600',
                bg: 'bg-green-50'
              },
              {
                label: 'Overweight (25-29.9)',
                count: 234,
                color: 'text-yellow-600',
                bg: 'bg-yellow-50'
              },
              {
                label: 'Obese (≥30)',
                count: 77,
                color: 'text-red-600',
                bg: 'bg-red-50'
              }].
              map((s, i) =>
              <div key={i} className={`p-4 rounded-xl ${s.bg}`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                </div>
              )}
            </div>
            <Card title="BMI Distribution by Class">
              <div className="space-y-3">
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(
                  (cls, i) =>
                  <div key={i}>
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {cls}
                      </p>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div
                        className="bg-blue-400"
                        style={{
                          width: '8%'
                        }}
                        title="Underweight" />

                        <div
                        className="bg-green-500"
                        style={{
                          width: '72%'
                        }}
                        title="Normal" />

                        <div
                        className="bg-yellow-400"
                        style={{
                          width: '15%'
                        }}
                        title="Overweight" />

                        <div
                        className="bg-red-400"
                        style={{
                          width: '5%'
                        }}
                        title="Obese" />

                      </div>
                    </div>

                )}
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  {[
                  {
                    c: 'bg-blue-400',
                    l: 'Underweight'
                  },
                  {
                    c: 'bg-green-500',
                    l: 'Normal'
                  },
                  {
                    c: 'bg-yellow-400',
                    l: 'Overweight'
                  },
                  {
                    c: 'bg-red-400',
                    l: 'Obese'
                  }].
                  map((leg, i) =>
                  <span key={i} className="flex items-center gap-1">
                      <span
                      className={`w-3 h-2 ${leg.c} rounded inline-block`} />

                      {leg.l}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vision" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Vision Records">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                    {
                      label: 'Normal Vision (6/6)',
                      count: 892,
                      color: 'text-green-600'
                    },
                    {
                      label: 'Mild Defect',
                      count: 234,
                      color: 'text-yellow-600'
                    },
                    {
                      label: 'Needs Glasses',
                      count: 122,
                      color: 'text-red-600'
                    }].
                    map((s, i) =>
                    <div
                      key={i}
                      className="text-center p-3 bg-gray-50 rounded-lg">

                        <p className={`text-lg font-bold ${s.color}`}>
                          {s.count}
                        </p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                    )}
                  </div>
                  <Table
                    columns={[
                    {
                      key: 'name',
                      header: 'Student'
                    },
                    {
                      key: 'class',
                      header: 'Class'
                    },
                    {
                      key: 'vision',
                      header: 'Vision',
                      render: (r) =>
                      <span
                        className={
                        r.vision !== '6/6' ?
                        'text-orange-600 font-medium' :
                        'text-green-600'
                        }>

                            {r.vision}
                          </span>

                    }]
                    }
                    data={checkupRecords} />

                </div>
              </Card>
              <Card title="Dental Records">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                    {
                      label: 'Good',
                      count: 934,
                      color: 'text-green-600'
                    },
                    {
                      label: 'Cavity',
                      count: 198,
                      color: 'text-yellow-600'
                    },
                    {
                      label: 'Needs Treatment',
                      count: 116,
                      color: 'text-red-600'
                    }].
                    map((s, i) =>
                    <div
                      key={i}
                      className="text-center p-3 bg-gray-50 rounded-lg">

                        <p className={`text-lg font-bold ${s.color}`}>
                          {s.count}
                        </p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                    )}
                  </div>
                  <Table
                    columns={[
                    {
                      key: 'name',
                      header: 'Student'
                    },
                    {
                      key: 'class',
                      header: 'Class'
                    },
                    {
                      key: 'dental',
                      header: 'Dental',
                      render: (r) =>
                      <span
                        className={
                        r.dental !== 'Good' ?
                        'text-orange-600 font-medium' :
                        'text-green-600'
                        }>

                            {r.dental}
                          </span>

                    }]
                    }
                    data={checkupRecords} />

                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}