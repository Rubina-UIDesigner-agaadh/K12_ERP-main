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
import { CheckCircleIcon, CircleIcon, PlusIcon } from 'lucide-react';
const milestones = [
{
  id: 'MS-001',
  project: 'Science Lab Setup',
  milestone: 'Site Preparation Complete',
  dueDate: '2025-06-15',
  completedOn: '2025-06-14',
  status: 'Completed'
},
{
  id: 'MS-002',
  project: 'Science Lab Setup',
  milestone: 'Equipment Procurement',
  dueDate: '2025-06-30',
  completedOn: null,
  status: 'In Progress'
},
{
  id: 'MS-003',
  project: 'Science Lab Setup',
  milestone: 'Installation & Setup',
  dueDate: '2025-07-31',
  completedOn: null,
  status: 'Pending'
},
{
  id: 'MS-004',
  project: 'Science Lab Setup',
  milestone: 'Testing & Commissioning',
  dueDate: '2025-08-15',
  completedOn: null,
  status: 'Pending'
},
{
  id: 'MS-005',
  project: 'Science Lab Setup',
  milestone: 'Handover & Training',
  dueDate: '2025-08-31',
  completedOn: null,
  status: 'Pending'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Pending: 'bg-gray-100 text-gray-600',
    Delayed: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function MilestoneTracking() {
  const [tab, setTab] = useState('timeline');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Milestone Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track project milestones and completion status
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="timeline" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="timeline">Milestone Timeline</TabsTrigger>
            <TabsTrigger value="add">Add Milestone</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="p-5">
            <div className="mb-4">
              <Select
                options={[
                {
                  value: 'lab',
                  label: 'Science Lab Setup'
                },
                {
                  value: 'annual',
                  label: 'Annual Day 2025'
                },
                {
                  value: 'smart',
                  label: 'Smart Classroom'
                }]
                }
                className="w-56" />

            </div>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {milestones.map((ms, i) =>
                <div
                  key={i}
                  className="flex items-start gap-4 pl-12 relative">

                    <div className="absolute left-3 top-1">
                      {ms.status === 'Completed' ?
                    <CheckCircleIcon className="w-5 h-5 text-green-500 bg-white" /> :
                    ms.status === 'In Progress' ?
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div> :

                    <CircleIcon className="w-5 h-5 text-gray-300 bg-white" />
                    }
                    </div>
                    <div
                    className={`flex-1 p-4 rounded-xl border ${ms.status === 'Completed' ? 'border-green-200 bg-green-50/50' : ms.status === 'In Progress' ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}`}>

                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800">
                          {ms.milestone}
                        </p>
                        {statusBadge(ms.status)}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Due: {ms.dueDate}</span>
                        {ms.completedOn &&
                      <span className="text-green-600">
                            Completed: {ms.completedOn}
                          </span>
                      }
                      </div>
                      {ms.status === 'In Progress' &&
                    <Button
                      variant="primary"
                      className="text-xs h-7 px-3 mt-2">

                          Mark Complete
                        </Button>
                    }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add" className="p-5">
            <div className="max-w-md">
              <Card title="Add New Milestone">
                <div className="space-y-3">
                  <Select
                    label="Project"
                    options={[
                    {
                      value: 'lab',
                      label: 'Science Lab Setup'
                    },
                    {
                      value: 'annual',
                      label: 'Annual Day 2025'
                    },
                    {
                      value: 'smart',
                      label: 'Smart Classroom'
                    }]
                    } />

                  <Input
                    label="Milestone Name"
                    placeholder="e.g. Phase 1 Complete" />

                  <Input label="Due Date" type="date" />
                  <Select
                    label="Assigned To"
                    options={[
                    {
                      value: 'sharma',
                      label: 'Mr. Sharma'
                    },
                    {
                      value: 'patel',
                      label: 'Mrs. Patel'
                    },
                    {
                      value: 'verma',
                      label: 'Mr. Verma'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="What needs to be achieved..." />

                  </div>
                  <Button variant="primary" className="w-full">
                    Add Milestone
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}