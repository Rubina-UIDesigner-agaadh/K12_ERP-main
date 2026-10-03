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
import { PlusIcon, SearchIcon, ClockIcon } from 'lucide-react';
const tasks = [
{
  id: 'TSK-001',
  title: 'Procure lab equipment',
  project: 'Science Lab Setup',
  assignedTo: 'Mr. Sharma',
  priority: 'High',
  dueDate: '2025-06-20',
  status: 'In Progress'
},
{
  id: 'TSK-002',
  title: 'Design stage layout',
  project: 'Annual Day 2025',
  assignedTo: 'Mrs. Patel',
  priority: 'Medium',
  dueDate: '2025-06-25',
  status: 'Open'
},
{
  id: 'TSK-003',
  title: 'Install smart boards',
  project: 'Smart Classroom',
  assignedTo: 'Mr. Verma',
  priority: 'High',
  dueDate: '2025-06-30',
  status: 'In Progress'
},
{
  id: 'TSK-004',
  title: 'Prepare invitation cards',
  project: 'Annual Day 2025',
  assignedTo: 'Ms. Singh',
  priority: 'Low',
  dueDate: '2025-06-28',
  status: 'Open'
}];

const priorityBadge = (p: string) => {
  const c: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[p] || 'bg-gray-100 text-gray-600'}`}>

      {p}
    </span>);

};
const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    Completed: 'bg-green-100 text-green-700',
    Overdue: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function TaskManagement() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign tasks, set priorities and track deadlines
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Tasks',
          value: '24',
          color: 'text-blue-600'
        },
        {
          label: 'In Progress',
          value: '8',
          color: 'text-orange-600'
        },
        {
          label: 'Overdue',
          value: '3',
          color: 'text-red-600'
        },
        {
          label: 'Completed',
          value: '13',
          color: 'text-green-600'
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
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="assign">Assign Task</TabsTrigger>
            <TabsTrigger value="priority">Priority Levels</TabsTrigger>
            <TabsTrigger value="deadlines">Deadline Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search tasks..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Projects'
                },
                {
                  value: 'lab',
                  label: 'Science Lab'
                },
                {
                  value: 'annual',
                  label: 'Annual Day'
                },
                {
                  value: 'smart',
                  label: 'Smart Classroom'
                }]
                }
                className="w-44" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Priority'
                },
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
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Task ID'
              },
              {
                key: 'title',
                header: 'Task'
              },
              {
                key: 'project',
                header: 'Project'
              },
              {
                key: 'assignedTo',
                header: 'Assigned To'
              },
              {
                key: 'priority',
                header: 'Priority',
                render: (r) => priorityBadge(r.priority)
              },
              {
                key: 'dueDate',
                header: 'Due Date'
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
                      Update
                    </Button>

              }]
              }
              data={tasks} />

          </TabsContent>

          <TabsContent value="assign" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Assign New Task">
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
                    label="Task Title"
                    placeholder="Enter task description" />

                  <Input label="Assign To" placeholder="Staff name" />
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

                  <Input label="Due Date" type="date" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Task Details
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Additional instructions..." />

                  </div>
                  <Button variant="primary" className="w-full">
                    Assign Task
                  </Button>
                </div>
              </Card>
              <Card title="My Tasks">
                <div className="space-y-2">
                  {tasks.slice(0, 3).map((t, i) =>
                  <div
                    key={i}
                    className="p-3 border border-gray-200 rounded-lg">

                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-800">
                          {t.title}
                        </p>
                        {priorityBadge(t.priority)}
                      </div>
                      <p className="text-xs text-gray-400">
                        {t.project} • Due: {t.dueDate}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {statusBadge(t.status)}
                        <Button
                        variant="ghost"
                        className="text-xs h-6 px-2 ml-auto">

                          Mark Done
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="priority" className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {[
              {
                level: 'High Priority',
                color: 'border-red-400 bg-red-50',
                tasks: tasks.filter((t) => t.priority === 'High')
              },
              {
                level: 'Medium Priority',
                color: 'border-yellow-400 bg-yellow-50',
                tasks: tasks.filter((t) => t.priority === 'Medium')
              },
              {
                level: 'Low Priority',
                color: 'border-green-400 bg-green-50',
                tasks: tasks.filter((t) => t.priority === 'Low')
              }].
              map((col, i) =>
              <div
                key={i}
                className={`border-l-4 rounded-xl p-4 ${col.color}`}>

                  <p className="font-bold text-gray-700 mb-3">
                    {col.level} ({col.tasks.length})
                  </p>
                  <div className="space-y-2">
                    {col.tasks.map((t, ti) =>
                  <div
                    key={ti}
                    className="bg-white rounded-lg p-3 shadow-sm">

                        <p className="text-xs font-semibold text-gray-800">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.assignedTo} • {t.dueDate}
                        </p>
                        {statusBadge(t.status)}
                      </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deadlines" className="p-5">
            <div className="space-y-3">
              {tasks.
              sort(
                (a, b) =>
                new Date(a.dueDate).getTime() -
                new Date(b.dueDate).getTime()
              ).
              map((t, i) => {
                const daysLeft = Math.ceil(
                  (new Date(t.dueDate).getTime() - Date.now()) / (
                  1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${daysLeft < 3 ? 'border-red-200 bg-red-50' : daysLeft < 7 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>

                      <ClockIcon
                      className={`w-5 h-5 shrink-0 ${daysLeft < 3 ? 'text-red-500' : daysLeft < 7 ? 'text-yellow-500' : 'text-gray-400'}`} />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t.project} • Assigned to {t.assignedTo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">
                          {t.dueDate}
                        </p>
                        <p
                        className={`text-xs font-medium ${daysLeft < 3 ? 'text-red-600' : daysLeft < 7 ? 'text-yellow-600' : 'text-gray-500'}`}>

                          {daysLeft} days left
                        </p>
                      </div>
                      {statusBadge(t.status)}
                    </div>);

              })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}