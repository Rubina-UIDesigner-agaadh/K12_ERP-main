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
import { Textarea } from '../../../components/ui/Textarea';
import { PlusIcon, SearchIcon } from 'lucide-react';
const projects = [
{
  id: 'PRJ-001',
  name: 'New Science Lab Setup',
  category: 'Infrastructure',
  budget: '₹12L',
  startDate: '2025-06-01',
  endDate: '2025-08-31',
  manager: 'Mr. Sharma',
  status: 'In Progress'
},
{
  id: 'PRJ-002',
  name: 'Annual Day 2025',
  category: 'Event',
  budget: '₹1.5L',
  startDate: '2025-06-15',
  endDate: '2025-07-05',
  manager: 'Mrs. Patel',
  status: 'Planning'
},
{
  id: 'PRJ-003',
  name: 'Smart Classroom Upgrade',
  category: 'IT',
  budget: '₹8L',
  startDate: '2025-05-01',
  endDate: '2025-07-31',
  manager: 'Mr. Verma',
  status: 'In Progress'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    'In Progress': 'bg-blue-100 text-blue-700',
    Planning: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    'On Hold': 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ProjectSetup() {
  const [tab, setTab] = useState('projects');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Setup</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage school projects with budgets and timelines
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="projects" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="projects">All Projects</TabsTrigger>
            <TabsTrigger value="create">Create Project</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
            <TabsTrigger value="timeline">Timeline Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search projects..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'planning',
                  label: 'Planning'
                },
                {
                  value: 'inprogress',
                  label: 'In Progress'
                },
                {
                  value: 'completed',
                  label: 'Completed'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Project ID'
              },
              {
                key: 'name',
                header: 'Project Name'
              },
              {
                key: 'category',
                header: 'Category'
              },
              {
                key: 'budget',
                header: 'Budget'
              },
              {
                key: 'startDate',
                header: 'Start Date'
              },
              {
                key: 'endDate',
                header: 'End Date'
              },
              {
                key: 'manager',
                header: 'Manager'
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
                      Manage
                    </Button>

              }]
              }
              data={projects} />

          </TabsContent>

          <TabsContent value="create" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input label="Project Name" placeholder="Enter project name" />
                <Select
                  label="Category"
                  options={[
                  {
                    value: 'infrastructure',
                    label: 'Infrastructure'
                  },
                  {
                    value: 'event',
                    label: 'Event'
                  },
                  {
                    value: 'it',
                    label: 'IT'
                  },
                  {
                    value: 'academic',
                    label: 'Academic'
                  },
                  {
                    value: 'other',
                    label: 'Other'
                  }]
                  } />

                <Input
                  label="Project Manager"
                  placeholder="Responsible person" />

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start Date" type="date" />
                  <Input label="End Date" type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Project Description
                  </label>
                  <Textarea
                    placeholder="Describe the project objectives..."
                    rows={4} />

                </div>
              </div>
              <div className="space-y-4">
                <Card title="Budget & Resources">
                  <div className="space-y-3">
                    <Input
                      label="Total Budget (₹)"
                      type="number"
                      placeholder="0.00" />

                    <Select
                      label="Budget Head"
                      options={[
                      {
                        value: 'infra',
                        label: 'Infrastructure Fund'
                      },
                      {
                        value: 'events',
                        label: 'Events Fund'
                      },
                      {
                        value: 'it',
                        label: 'IT Fund'
                      },
                      {
                        value: 'academic',
                        label: 'Academic Fund'
                      }]
                      } />

                    <Input
                      label="Team Size"
                      type="number"
                      placeholder="Number of team members" />

                  </div>
                </Card>
                <Card title="Priority & Visibility">
                  <div className="space-y-3">
                    <Select
                      label="Priority"
                      options={[
                      {
                        value: 'high',
                        label: 'High'
                      },
                      {
                        value: 'medium',
                        label: 'Medium'
                      },
                      {
                        value: 'low',
                        label: 'Low'
                      }]
                      } />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Visible to All Staff
                      </span>
                      <button className="relative w-9 h-5 rounded-full bg-blue-500">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                      </button>
                    </div>
                  </div>
                </Card>
                <Button variant="primary" className="w-full">
                  Create Project
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="p-5">
            <div className="space-y-4">
              {projects.map((proj, i) =>
              <Card key={i} title={proj.name}>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                  {
                    label: 'Total Budget',
                    value: proj.budget
                  },
                  {
                    label: 'Allocated',
                    value:
                    '₹' +
                    (
                    parseInt(proj.budget.replace(/[₹L]/g, '')) * 0.8).
                    toFixed(1) +
                    'L'
                  },
                  {
                    label: 'Spent',
                    value:
                    '₹' +
                    (
                    parseInt(proj.budget.replace(/[₹L]/g, '')) * 0.5).
                    toFixed(1) +
                    'L'
                  },
                  {
                    label: 'Remaining',
                    value:
                    '₹' +
                    (
                    parseInt(proj.budget.replace(/[₹L]/g, '')) * 0.5).
                    toFixed(1) +
                    'L'
                  }].
                  map((s, si) =>
                  <div
                    key={si}
                    className="text-center p-3 bg-gray-50 rounded-lg">

                        <p className="text-base font-bold text-gray-900">
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                  )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="p-5">
            <div className="space-y-4">
              {projects.map((proj, i) =>
              <Card key={i} title={proj.name}>
                  <div className="space-y-2">
                    {[
                  'Planning',
                  'Procurement',
                  'Execution',
                  'Testing',
                  'Completion'].
                  map((phase, pi) =>
                  <div key={pi} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-24">
                          {phase}
                        </span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                          <div
                        className={`h-full rounded-full ${pi < 2 ? 'bg-green-500' : pi === 2 ? 'bg-blue-500' : 'bg-gray-200'}`}
                        style={{
                          width: `${pi < 2 ? 100 : pi === 2 ? 60 : 0}%`
                        }} />

                        </div>
                        <span className="text-xs text-gray-400 w-16">
                          {pi < 2 ? 'Done' : pi === 2 ? '60%' : 'Pending'}
                        </span>
                      </div>
                  )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}