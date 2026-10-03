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
import { ArrowUpIcon, SearchIcon, AlertTriangleIcon } from 'lucide-react';
const activeEscalations = [
{
  id: 'ESC-001',
  ticketId: 'TKT-001',
  issue: 'Projector not working',
  escalatedTo: 'IT Head',
  level: 'Level 1',
  escalatedOn: '2025-06-10 11:00',
  slaBreached: '2 hrs',
  status: 'Active'
},
{
  id: 'ESC-002',
  ticketId: 'TKT-004',
  issue: 'Internet issue in lab',
  escalatedTo: 'Vice Principal',
  level: 'Level 2',
  escalatedOn: '2025-06-10 09:30',
  slaBreached: '5 hrs',
  status: 'Active'
}];

const escalationHistory = [
{
  id: 'ESC-003',
  ticketId: 'TKT-010',
  issue: 'CCTV not working',
  escalatedTo: 'Principal',
  level: 'Level 3',
  escalatedOn: '2025-06-08',
  resolvedOn: '2025-06-08',
  status: 'Resolved'
},
{
  id: 'ESC-004',
  ticketId: 'TKT-011',
  issue: 'Roof leakage',
  escalatedTo: 'IT Head',
  level: 'Level 1',
  escalatedOn: '2025-06-07',
  resolvedOn: '2025-06-09',
  status: 'Resolved'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Active: 'bg-red-100 text-red-700',
    Resolved: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
const levelBadge = (l: string) => {
  const c: Record<string, string> = {
    'Level 1': 'bg-yellow-100 text-yellow-700',
    'Level 2': 'bg-orange-100 text-orange-700',
    'Level 3': 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[l] || 'bg-gray-100 text-gray-600'}`}>

      {l}
    </span>);

};
export function EscalationManagement() {
  const [tab, setTab] = useState('matrix');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Escalation Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure escalation rules and manage active escalations
          </p>
        </div>
        <Button variant="primary">
          <ArrowUpIcon className="w-4 h-4 mr-2" />
          Manual Escalate
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="matrix" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="matrix">Escalation Matrix</TabsTrigger>
            <TabsTrigger value="active">Active Escalations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="p-5">
            <div className="space-y-4">
              {[
              {
                level: 'Level 1',
                color: 'border-yellow-400 bg-yellow-50',
                badge: 'bg-yellow-500',
                handler: 'Department Head',
                trigger: 'SLA breach (first time)',
                sla: '4 hours',
                action: 'Auto-notify department head + reassign ticket',
                notify: ['Department Head', 'Original Assignee']
              },
              {
                level: 'Level 2',
                color: 'border-orange-400 bg-orange-50',
                badge: 'bg-orange-500',
                handler: 'Vice Principal',
                trigger: '2x SLA breach',
                sla: '8 hours',
                action: 'Escalate to VP + send SMS alert',
                notify: ['Vice Principal', 'Department Head']
              },
              {
                level: 'Level 3',
                color: 'border-red-400 bg-red-50',
                badge: 'bg-red-500',
                handler: 'Principal',
                trigger: '3x SLA breach or critical issue',
                sla: '12 hours',
                action:
                'Immediate principal intervention + emergency protocol',
                notify: ['Principal', 'Vice Principal', 'Department Head']
              }].
              map((level, i) =>
              <div
                key={i}
                className={`border-l-4 rounded-xl p-5 ${level.color}`}>

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                      className={`w-8 h-8 ${level.badge} rounded-full flex items-center justify-center text-white font-bold text-sm`}>

                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {level.level} — {level.handler}
                        </p>
                        <p className="text-xs text-gray-500">
                          Triggered after: {level.trigger}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-xs h-7 px-2">
                      Configure
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Action
                      </p>
                      <p className="text-xs text-gray-700 mt-0.5">
                        {level.action}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Notify
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {level.notify.map((n, ni) =>
                      <span
                        key={ni}
                        className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5">

                            {n}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="p-5">
            {activeEscalations.length > 0 &&
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                <AlertTriangleIcon className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm font-semibold text-red-800">
                  {activeEscalations.length} active escalations require
                  immediate attention
                </p>
              </div>
            }
            <Table
              columns={[
              {
                key: 'id',
                header: 'Escalation ID'
              },
              {
                key: 'ticketId',
                header: 'Ticket'
              },
              {
                key: 'issue',
                header: 'Issue'
              },
              {
                key: 'escalatedTo',
                header: 'Escalated To'
              },
              {
                key: 'level',
                header: 'Level',
                render: (r) => levelBadge(r.level)
              },
              {
                key: 'escalatedOn',
                header: 'Escalated On'
              },
              {
                key: 'slaBreached',
                header: 'SLA Breach'
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
                <Button
                  variant="outline"
                  className="text-xs h-7 px-2 border-red-300 text-red-600">

                      Resolve
                    </Button>

              }]
              }
              data={activeEscalations} />

          </TabsContent>

          <TabsContent value="history" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search escalation history..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Input type="date" className="w-44" />
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'ticketId',
                header: 'Ticket'
              },
              {
                key: 'issue',
                header: 'Issue'
              },
              {
                key: 'escalatedTo',
                header: 'Escalated To'
              },
              {
                key: 'level',
                header: 'Level',
                render: (r) => levelBadge(r.level)
              },
              {
                key: 'escalatedOn',
                header: 'Escalated On'
              },
              {
                key: 'resolvedOn',
                header: 'Resolved On'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              }]
              }
              data={escalationHistory} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}