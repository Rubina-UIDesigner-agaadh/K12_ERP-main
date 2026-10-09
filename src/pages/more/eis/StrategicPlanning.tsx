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
import { TrendingUpIcon, UsersIcon, BuildingIcon, PlusIcon } from 'lucide-react';
export function StrategicPlanning() {
  const [tab, setTab] = useState('enrollment');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Strategic Planning
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enrollment forecasts, staff planning and infrastructure roadmap
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Plan
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="enrollment" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="enrollment">Enrollment Forecast</TabsTrigger>
            <TabsTrigger value="staff">Staff Planning</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="5-Year Enrollment Forecast">
                <div className="space-y-3">
                  {[
                  {
                    year: '2025-26',
                    current: 1248,
                    projected: 1320,
                    growth: '+5.8%'
                  },
                  {
                    year: '2026-27',
                    current: 1320,
                    projected: 1400,
                    growth: '+6.1%'
                  },
                  {
                    year: '2027-28',
                    current: 1400,
                    projected: 1490,
                    growth: '+6.4%'
                  },
                  {
                    year: '2028-29',
                    current: 1490,
                    projected: 1580,
                    growth: '+6.0%'
                  },
                  {
                    year: '2029-30',
                    current: 1580,
                    projected: 1680,
                    growth: '+6.3%'
                  }].
                  map((yr, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 w-16">
                        {yr.year}
                      </span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                        className="h-full bg-blue-200 rounded-full"
                        style={{
                          width: `${yr.projected / 1800 * 100}%`
                        }} />

                        <div
                        className="h-full bg-blue-500 rounded-full absolute top-0 left-0"
                        style={{
                          width: `${yr.current / 1800 * 100}%`
                        }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-800 w-12 text-right">
                        {yr.projected}
                      </span>
                      <span className="text-xs text-green-600 font-medium w-12">
                        {yr.growth}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Forecast Parameters">
                <div className="space-y-3">
                  <Input
                    label="Base Year Students"
                    type="number"
                    defaultValue="1248" />

                  <Input
                    label="Expected Annual Growth (%)"
                    type="number"
                    defaultValue="6" />

                  <Select
                    label="Growth Model"
                    options={[
                    {
                      value: 'linear',
                      label: 'Linear Growth'
                    },
                    {
                      value: 'compound',
                      label: 'Compound Growth'
                    },
                    {
                      value: 'conservative',
                      label: 'Conservative Estimate'
                    }]
                    } />

                  <Input
                    label="New Sections Planned"
                    type="number"
                    defaultValue="2" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Assumptions
                    </label>
                    <Textarea
                      placeholder="Key assumptions for this forecast..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    <TrendingUpIcon className="w-4 h-4 mr-2" />
                    Update Forecast
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Current Staff vs Required">
                <div className="space-y-3">
                  {[
                  {
                    dept: 'Teaching Staff',
                    current: 52,
                    required: 58,
                    gap: 6
                  },
                  {
                    dept: 'Administrative',
                    current: 12,
                    required: 14,
                    gap: 2
                  },
                  {
                    dept: 'Support Staff',
                    current: 18,
                    required: 20,
                    gap: 2
                  },
                  {
                    dept: 'IT Staff',
                    current: 3,
                    required: 4,
                    gap: 1
                  },
                  {
                    dept: 'Security',
                    current: 6,
                    required: 8,
                    gap: 2
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <UsersIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {s.dept}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current: {s.current} | Required: {s.required}
                        </p>
                      </div>
                      <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.gap > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>

                        {s.gap > 0 ? `-${s.gap} needed` : 'Adequate'}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Recruitment Plan">
                <div className="space-y-3">
                  <Select
                    label="Department"
                    options={[
                    {
                      value: 'teaching',
                      label: 'Teaching Staff'
                    },
                    {
                      value: 'admin',
                      label: 'Administrative'
                    },
                    {
                      value: 'support',
                      label: 'Support Staff'
                    }]
                    } />

                  <Input
                    label="Positions to Fill"
                    type="number"
                    placeholder="Number of vacancies" />

                  <Input label="Target Joining Date" type="date" />
                  <Select
                    label="Recruitment Mode"
                    options={[
                    {
                      value: 'direct',
                      label: 'Direct Recruitment'
                    },
                    {
                      value: 'agency',
                      label: 'Through Agency'
                    },
                    {
                      value: 'transfer',
                      label: 'Internal Transfer'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Job Requirements
                    </label>
                    <Textarea
                      placeholder="Qualifications and experience required..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    Create Recruitment Plan
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Infrastructure Roadmap">
                <div className="space-y-3">
                  {[
                  {
                    project: 'New Science Lab',
                    status: 'In Progress',
                    completion: 65,
                    budget: '₹12L',
                    deadline: 'Aug 2025'
                  },
                  {
                    project: 'Library Extension',
                    status: 'Planned',
                    completion: 0,
                    budget: '₹8L',
                    deadline: 'Dec 2025'
                  },
                  {
                    project: 'Smart Classrooms (10)',
                    status: 'In Progress',
                    completion: 40,
                    budget: '₹25L',
                    deadline: 'Sep 2025'
                  },
                  {
                    project: 'Sports Complex',
                    status: 'Planned',
                    completion: 0,
                    budget: '₹45L',
                    deadline: 'Mar 2026'
                  }].
                  map((proj, i) =>
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-3">

                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800 text-sm">
                          {proj.project}
                        </p>
                        <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${proj.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>

                          {proj.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${proj.completion}%`
                          }} />

                        </div>
                        <span className="text-xs text-gray-500">
                          {proj.completion}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Budget: {proj.budget}</span>
                        <span>Deadline: {proj.deadline}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Add Infrastructure Plan">
                <div className="space-y-3">
                  <Input
                    label="Project Name"
                    placeholder="e.g. New Computer Lab" />

                  <Select
                    label="Priority"
                    options={[
                    {
                      value: 'high',
                      label: 'High Priority'
                    },
                    {
                      value: 'medium',
                      label: 'Medium Priority'
                    },
                    {
                      value: 'low',
                      label: 'Low Priority'
                    }]
                    } />

                  <Input
                    label="Estimated Budget (₹)"
                    type="number"
                    placeholder="0.00" />

                  <Input label="Target Completion" type="date" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Project Description
                    </label>
                    <Textarea
                      placeholder="Describe the infrastructure project..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    <BuildingIcon className="w-4 h-4 mr-2" />
                    Add to Roadmap
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}