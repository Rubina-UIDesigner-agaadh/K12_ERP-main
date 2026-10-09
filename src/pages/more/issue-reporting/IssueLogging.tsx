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
import { PlusIcon, SearchIcon, AlertTriangleIcon } from 'lucide-react';
const issues = [
{
  id: 'ISS-001',
  title: 'Projector not working in Class 8',
  raisedBy: 'Teacher - Mrs. Sharma',
  type: 'IT Support',
  category: 'Infrastructure',
  priority: 'High',
  date: '2025-06-10',
  status: 'Open'
},
{
  id: 'ISS-002',
  title: 'Broken bench in playground',
  raisedBy: 'Student - Arjun',
  type: 'Maintenance',
  category: 'Infrastructure',
  priority: 'Medium',
  date: '2025-06-09',
  status: 'In Progress'
},
{
  id: 'ISS-003',
  title: 'Canteen food quality complaint',
  raisedBy: 'Parent - Mr. Patel',
  type: 'Complaint',
  category: 'Facilities',
  priority: 'Low',
  date: '2025-06-08',
  status: 'Resolved'
},
{
  id: 'ISS-004',
  title: 'Internet connectivity issue in lab',
  raisedBy: 'Teacher - Mr. Verma',
  type: 'IT Support',
  category: 'IT',
  priority: 'High',
  date: '2025-06-10',
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
    Resolved: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function IssueLogging() {
  const [tab, setTab] = useState('log');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Logging</h1>
          <p className="text-sm text-gray-500 mt-1">
            Raise and track issues from students, parents and staff
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Raise Ticket
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Open Issues',
          value: '12',
          color: 'text-blue-600'
        },
        {
          label: 'High Priority',
          value: '4',
          color: 'text-red-600'
        },
        {
          label: 'In Progress',
          value: '6',
          color: 'text-orange-600'
        },
        {
          label: 'Resolved Today',
          value: '3',
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
        <Tabs defaultValue="log" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="log">Issue Log</TabsTrigger>
            <TabsTrigger value="raise">Raise Ticket</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="priority">Priority Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search issues..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'it',
                  label: 'IT Support'
                },
                {
                  value: 'maintenance',
                  label: 'Maintenance'
                },
                {
                  value: 'complaint',
                  label: 'Complaint'
                }]
                }
                className="w-40" />

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
                header: 'Ticket ID'
              },
              {
                key: 'title',
                header: 'Issue'
              },
              {
                key: 'raisedBy',
                header: 'Raised By'
              },
              {
                key: 'category',
                header: 'Category'
              },
              {
                key: 'priority',
                header: 'Priority',
                render: (r) => priorityBadge(r.priority)
              },
              {
                key: 'date',
                header: 'Date'
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
              data={issues} />

          </TabsContent>

          <TabsContent value="raise" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Raise New Ticket">
                <div className="space-y-4">
                  <Select
                    label="Raised By"
                    options={[
                    {
                      value: 'student',
                      label: 'Student'
                    },
                    {
                      value: 'parent',
                      label: 'Parent'
                    },
                    {
                      value: 'staff',
                      label: 'Staff'
                    },
                    {
                      value: 'teacher',
                      label: 'Teacher'
                    }]
                    } />

                  <Input
                    label="Name / Roll No."
                    placeholder="Enter name or roll number" />

                  <Select
                    label="Issue Category"
                    options={[
                    {
                      value: 'it',
                      label: 'IT Support'
                    },
                    {
                      value: 'infra',
                      label: 'Infrastructure'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    },
                    {
                      value: 'facilities',
                      label: 'Facilities'
                    },
                    {
                      value: 'transport',
                      label: 'Transport'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <Input
                    label="Issue Title"
                    placeholder="Brief description of the issue" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Detailed Description
                    </label>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      rows={4} />

                  </div>
                  <Select
                    label="Priority Level"
                    options={[
                    {
                      value: 'high',
                      label: 'High - Urgent'
                    },
                    {
                      value: 'medium',
                      label: 'Medium - Normal'
                    },
                    {
                      value: 'low',
                      label: 'Low - Can Wait'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    <AlertTriangleIcon className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </div>
              </Card>
              <Card title="Quick Stats">
                <div className="space-y-3">
                  {[
                  {
                    category: 'IT Support',
                    open: 4,
                    resolved: 12
                  },
                  {
                    category: 'Infrastructure',
                    open: 3,
                    resolved: 8
                  },
                  {
                    category: 'Facilities',
                    open: 2,
                    resolved: 15
                  },
                  {
                    category: 'Academic',
                    open: 1,
                    resolved: 6
                  },
                  {
                    category: 'Transport',
                    open: 2,
                    resolved: 4
                  }].
                  map((cat, i) =>
                  <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-28">
                        {cat.category}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${cat.resolved / (cat.open + cat.resolved) * 100}%`
                        }} />

                      </div>
                      <span className="text-xs text-gray-400">
                        {cat.open} open
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
              {
                name: 'IT Support',
                icon: '💻',
                count: 8,
                color: 'bg-blue-50 border-blue-200'
              },
              {
                name: 'Infrastructure',
                icon: '🏗️',
                count: 5,
                color: 'bg-orange-50 border-orange-200'
              },
              {
                name: 'Facilities',
                icon: '🏫',
                count: 3,
                color: 'bg-green-50 border-green-200'
              },
              {
                name: 'Academic',
                icon: '📚',
                count: 2,
                color: 'bg-purple-50 border-purple-200'
              },
              {
                name: 'Transport',
                icon: '🚌',
                count: 4,
                color: 'bg-yellow-50 border-yellow-200'
              },
              {
                name: 'Other',
                icon: '📋',
                count: 1,
                color: 'bg-gray-50 border-gray-200'
              }].
              map((cat, i) =>
              <div
                key={i}
                className={`border rounded-xl p-4 text-center cursor-pointer hover:shadow-sm transition-shadow ${cat.color}`}>

                  <p className="text-2xl mb-2">{cat.icon}</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {cat.name}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {cat.count}
                  </p>
                  <p className="text-xs text-gray-500">open issues</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="priority" className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {[
              {
                level: 'High Priority',
                color: 'border-red-400 bg-red-50',
                textColor: 'text-red-700',
                issues: issues.filter((i) => i.priority === 'High'),
                sla: 'Resolve within 4 hours'
              },
              {
                level: 'Medium Priority',
                color: 'border-yellow-400 bg-yellow-50',
                textColor: 'text-yellow-700',
                issues: issues.filter((i) => i.priority === 'Medium'),
                sla: 'Resolve within 24 hours'
              },
              {
                level: 'Low Priority',
                color: 'border-green-400 bg-green-50',
                textColor: 'text-green-700',
                issues: issues.filter((i) => i.priority === 'Low'),
                sla: 'Resolve within 72 hours'
              }].
              map((col, i) =>
              <div
                key={i}
                className={`border-l-4 rounded-xl p-4 ${col.color}`}>

                  <p className={`font-bold text-sm mb-1 ${col.textColor}`}>
                    {col.level}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">{col.sla}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {col.issues.length}
                  </p>
                  <p className="text-xs text-gray-500">issues</p>
                  <div className="mt-3 space-y-1">
                    {col.issues.map((issue, ii) =>
                  <p key={ii} className="text-xs text-gray-600 truncate">
                        • {issue.title}
                      </p>
                  )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}