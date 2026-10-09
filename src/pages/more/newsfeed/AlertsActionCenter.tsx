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
import {
  AlertTriangleIcon,
  BellIcon,
  CheckSquareIcon,
  ArrowRightIcon } from
'lucide-react';
const alerts = [
{
  id: 'ALT-001',
  title: 'Fee Payment Deadline - June 15',
  priority: 'High',
  dueDate: '2025-06-15',
  type: 'Fee',
  acknowledged: false,
  status: 'Active'
},
{
  id: 'ALT-002',
  title: 'CBSE Board Exam Date Sheet Released',
  priority: 'High',
  dueDate: '2025-06-20',
  type: 'Academic',
  acknowledged: true,
  status: 'Active'
},
{
  id: 'ALT-003',
  title: 'Annual Day Registration Closes',
  priority: 'Medium',
  dueDate: '2025-06-18',
  type: 'Event',
  acknowledged: false,
  status: 'Active'
},
{
  id: 'ALT-004',
  title: 'Staff Meeting - Mandatory Attendance',
  priority: 'High',
  dueDate: '2025-06-12',
  type: 'Staff',
  acknowledged: false,
  status: 'Active'
}];

const priorityBadge = (p: string) => {
  const c: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Info: 'bg-blue-100 text-blue-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[p] || 'bg-gray-100 text-gray-600'}`}>

      {p}
    </span>);

};
export function AlertsActionCenter() {
  const [tab, setTab] = useState('alerts');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Alerts & Action Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Priority alerts, due date reminders, task conversion and compliance
            checklists
          </p>
        </div>
        <Button variant="primary">
          <BellIcon className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Active Alerts',
          value: '4',
          color: 'text-red-600'
        },
        {
          label: 'Pending Acknowledgement',
          value: '3',
          color: 'text-orange-600'
        },
        {
          label: 'Due Today',
          value: '1',
          color: 'text-yellow-600'
        },
        {
          label: 'Compliance Pending',
          value: '2',
          color: 'text-purple-600'
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
        <Tabs defaultValue="alerts" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="reminders">Due Date Reminders</TabsTrigger>
            <TabsTrigger value="tasks">Convert to Task</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="p-5">
            <div className="space-y-3">
              {alerts.map((alert, i) =>
              <div
                key={i}
                className={`p-4 border rounded-xl ${alert.priority === 'High' ? 'border-red-200 bg-red-50/20' : 'border-yellow-200 bg-yellow-50/20'}`}>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon
                      className={`w-4 h-4 mt-0.5 shrink-0 ${alert.priority === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />

                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {alert.dueDate} • {alert.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {priorityBadge(alert.priority)}
                      {alert.acknowledged &&
                    <span className="text-xs text-green-600 font-medium">
                          ✓ Acknowledged
                        </span>
                    }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged &&
                  <Button variant="primary" className="text-xs h-7 px-3">
                        <CheckSquareIcon className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                  }
                    <Button variant="ghost" className="text-xs h-7 px-3">
                      <ArrowRightIcon className="w-3 h-3 mr-1" />
                      Convert to Task
                    </Button>
                    <Button variant="ghost" className="text-xs h-7 px-3">
                      Assign to Dept.
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Set Due Date Reminder">
                <div className="space-y-3">
                  <Input
                    label="Reminder Title"
                    placeholder="What needs to be done?" />

                  <Input label="Due Date" type="date" />
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
                      value: 'info',
                      label: 'Info'
                    }]
                    } />

                  <Select
                    label="Notify"
                    options={[
                    {
                      value: 'all',
                      label: 'All Staff'
                    },
                    {
                      value: 'admin',
                      label: 'Admin Only'
                    },
                    {
                      value: 'dept',
                      label: 'Specific Department'
                    }]
                    } />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Require Acknowledgement
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    Set Reminder
                  </Button>
                </div>
              </Card>
              <Card title="Upcoming Due Dates">
                <div className="space-y-2">
                  {alerts.map((a, i) => {
                    const days = Math.ceil(
                      (new Date(a.dueDate).getTime() - Date.now()) / (
                      1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg ${days <= 3 ? 'bg-red-50' : days <= 7 ? 'bg-yellow-50' : 'bg-gray-50'}`}>

                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-800">
                            {a.title}
                          </p>
                          <p className="text-xs text-gray-400">{a.dueDate}</p>
                        </div>
                        <span
                          className={`text-xs font-bold ${days <= 3 ? 'text-red-600' : days <= 7 ? 'text-yellow-600' : 'text-gray-500'}`}>

                          {days}d
                        </span>
                      </div>);

                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="p-5">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Convert alerts and notices into actionable tasks and send to
                Project Management.
              </p>
              {alerts.
              filter((a) => !a.acknowledged).
              map((alert, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {alert.dueDate} • {alert.type}
                      </p>
                    </div>
                    {priorityBadge(alert.priority)}
                    <div className="flex gap-2">
                      <Select
                    options={[
                    {
                      value: 'admin',
                      label: 'Admin'
                    },
                    {
                      value: 'accounts',
                      label: 'Accounts'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    }]
                    }
                    className="w-32" />

                      <Button variant="primary" className="text-xs h-8 px-3">
                        <ArrowRightIcon className="w-3 h-3 mr-1" />
                        Create Task
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="p-5">
            <Card title="Compliance Checklist">
              <div className="space-y-2">
                {[
                {
                  item: 'UDISE Data Submitted',
                  deadline: '2025-09-30',
                  status: 'Pending'
                },
                {
                  item: 'Annual Report Filed',
                  deadline: '2025-07-31',
                  status: 'Pending'
                },
                {
                  item: 'Fire Safety Audit',
                  deadline: '2025-08-15',
                  status: 'Done'
                },
                {
                  item: 'Staff Verification Documents',
                  deadline: '2025-06-30',
                  status: 'Pending'
                },
                {
                  item: 'RTE Compliance Report',
                  deadline: '2025-09-15',
                  status: 'Done'
                },
                {
                  item: 'Fee Structure Submission',
                  deadline: '2025-07-01',
                  status: 'Pending'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${item.status === 'Done' ? 'bg-green-50' : 'bg-yellow-50'}`}>

                    <input
                    type="checkbox"
                    checked={item.status === 'Done'}
                    readOnly
                    className="h-4 w-4 text-green-600 rounded" />

                    <div className="flex-1">
                      <p
                      className={`text-sm font-medium ${item.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>

                        {item.item}
                      </p>
                      <p className="text-xs text-gray-400">
                        Deadline: {item.deadline}
                      </p>
                    </div>
                    {item.status !== 'Done' &&
                  <Button variant="ghost" className="text-xs h-6 px-2">
                        Mark Done
                      </Button>
                  }
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}