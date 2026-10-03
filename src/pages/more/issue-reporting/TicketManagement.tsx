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
import { SearchIcon, ArrowUpIcon } from 'lucide-react';
const tickets = [
{
  id: 'TKT-001',
  title: 'Projector not working',
  assignedTo: 'IT Dept',
  priority: 'High',
  sla: '4 hrs',
  elapsed: '2 hrs',
  status: 'In Progress'
},
{
  id: 'TKT-002',
  title: 'Broken bench',
  assignedTo: 'Maintenance',
  priority: 'Medium',
  sla: '24 hrs',
  elapsed: '6 hrs',
  status: 'Open'
},
{
  id: 'TKT-003',
  title: 'Canteen complaint',
  assignedTo: 'Admin',
  priority: 'Low',
  sla: '72 hrs',
  elapsed: '18 hrs',
  status: 'Resolved'
},
{
  id: 'TKT-004',
  title: 'Internet issue in lab',
  assignedTo: 'IT Dept',
  priority: 'High',
  sla: '4 hrs',
  elapsed: '1 hr',
  status: 'Open'
}];

const escalationMatrix = [
{
  level: 'Level 1',
  handler: 'Department Head',
  triggerAfter: 'SLA breach',
  action: 'Auto-notify + reassign'
},
{
  level: 'Level 2',
  handler: 'Vice Principal',
  triggerAfter: '2x SLA breach',
  action: 'Escalate + alert management'
},
{
  level: 'Level 3',
  handler: 'Principal',
  triggerAfter: '3x SLA breach',
  action: 'Immediate intervention required'
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
export function TicketManagement() {
  const [tab, setTab] = useState('all');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign, track and escalate support tickets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Open',
          value: '8',
          color: 'text-blue-600'
        },
        {
          label: 'Assigned',
          value: '6',
          color: 'text-purple-600'
        },
        {
          label: 'SLA Breached',
          value: '2',
          color: 'text-red-600'
        },
        {
          label: 'Resolved Today',
          value: '4',
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
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="assign">Assign Tickets</TabsTrigger>
            <TabsTrigger value="status">Status Tracking</TabsTrigger>
            <TabsTrigger value="escalation">Escalation Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search tickets..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Departments'
                },
                {
                  value: 'it',
                  label: 'IT Dept'
                },
                {
                  value: 'maintenance',
                  label: 'Maintenance'
                },
                {
                  value: 'admin',
                  label: 'Admin'
                }]
                }
                className="w-44" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'open',
                  label: 'Open'
                },
                {
                  value: 'inprogress',
                  label: 'In Progress'
                },
                {
                  value: 'resolved',
                  label: 'Resolved'
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
                key: 'assignedTo',
                header: 'Assigned To'
              },
              {
                key: 'priority',
                header: 'Priority',
                render: (r) => priorityBadge(r.priority)
              },
              {
                key: 'sla',
                header: 'SLA'
              },
              {
                key: 'elapsed',
                header: 'Elapsed'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: '',
                render: (r) =>
                <div className="flex gap-1">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        View
                      </Button>
                      {r.status !== 'Resolved' &&
                  <Button
                    variant="ghost"
                    className="text-xs h-7 px-2 text-orange-500">

                          <ArrowUpIcon className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                  }
                    </div>

              }]
              }
              data={tickets} />

          </TabsContent>

          <TabsContent value="assign" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Assign Ticket">
                <div className="space-y-3">
                  <Input label="Ticket ID" placeholder="Enter ticket ID" />
                  <Select
                    label="Assign To Department"
                    options={[
                    {
                      value: 'it',
                      label: 'IT Department'
                    },
                    {
                      value: 'maintenance',
                      label: 'Maintenance'
                    },
                    {
                      value: 'admin',
                      label: 'Admin Office'
                    },
                    {
                      value: 'accounts',
                      label: 'Accounts'
                    },
                    {
                      value: 'transport',
                      label: 'Transport'
                    }]
                    } />

                  <Input
                    label="Assign To Person"
                    placeholder="Staff name (optional)" />

                  <Input label="Expected Resolution Date" type="date" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Assignment Notes
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Instructions for the assignee..." />

                  </div>
                  <Button variant="primary" className="w-full">
                    Assign Ticket
                  </Button>
                </div>
              </Card>
              <Card title="Unassigned Tickets">
                <div className="space-y-2">
                  {tickets.
                  filter((t) => t.status === 'Open').
                  map((t, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {t.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t.id} • SLA: {t.sla}
                          </p>
                        </div>
                        {priorityBadge(t.priority)}
                        <Button variant="outline" className="text-xs h-7 px-2">
                          Assign
                        </Button>
                      </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
              {
                status: 'Open',
                tickets: tickets.filter((t) => t.status === 'Open'),
                color: 'border-blue-400 bg-blue-50'
              },
              {
                status: 'In Progress',
                tickets: tickets.filter((t) => t.status === 'In Progress'),
                color: 'border-orange-400 bg-orange-50'
              },
              {
                status: 'Resolved',
                tickets: tickets.filter((t) => t.status === 'Resolved'),
                color: 'border-green-400 bg-green-50'
              }].
              map((col, i) =>
              <div
                key={i}
                className={`border-l-4 rounded-xl p-4 ${col.color}`}>

                  <p className="font-bold text-gray-700 mb-2">
                    {col.status} ({col.tickets.length})
                  </p>
                  <div className="space-y-2">
                    {col.tickets.map((t, ti) =>
                  <div
                    key={ti}
                    className="bg-white rounded-lg p-3 shadow-sm">

                        <p className="text-xs font-semibold text-gray-800">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.id} • {t.assignedTo}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          {priorityBadge(t.priority)}
                          <span className="text-xs text-gray-400">
                            {t.elapsed}
                          </span>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="escalation" className="p-5">
            <div className="space-y-4 mb-6">
              {escalationMatrix.map((level, i) =>
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-yellow-200 bg-yellow-50' : i === 1 ? 'border-orange-200 bg-orange-50' : 'border-red-200 bg-red-50'}`}>

                  <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-orange-500' : 'bg-red-500'}`}>

                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {level.level} — {level.handler}
                    </p>
                    <p className="text-xs text-gray-500">
                      Triggered: {level.triggerAfter}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Action: {level.action}
                    </p>
                  </div>
                  <Button variant="ghost" className="text-xs h-7 px-2">
                    Configure
                  </Button>
                </div>
              )}
            </div>
            <Card title="Active Escalations">
              <div className="space-y-2">
                {tickets.
                filter(
                  (t) => t.priority === 'High' && t.status !== 'Resolved'
                ).
                map((t, i) =>
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">

                      <ArrowUpIcon className="w-4 h-4 text-red-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t.id} • Elapsed: {t.elapsed} / SLA: {t.sla}
                        </p>
                      </div>
                      <Button
                    variant="outline"
                    className="text-xs h-7 px-2 border-red-300 text-red-600">

                        Escalate Now
                      </Button>
                    </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}