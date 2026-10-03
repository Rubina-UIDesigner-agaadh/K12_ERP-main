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
import {
  PlusIcon,
  SearchIcon,
  PhoneIcon,
  CalendarIcon,
  BellIcon } from
'lucide-react';
const complaints = [
{
  id: 'CMP-001',
  name: 'Parent - Sharma',
  type: 'Complaint',
  subject: 'Bus delay issue',
  date: '2025-06-10',
  priority: 'High',
  status: 'Open'
},
{
  id: 'CMP-002',
  name: 'Staff - Mehta',
  type: 'Request',
  subject: 'Stationery request',
  date: '2025-06-09',
  priority: 'Low',
  status: 'Resolved'
},
{
  id: 'CMP-003',
  name: 'Parent - Patel',
  type: 'Complaint',
  subject: 'Canteen food quality',
  date: '2025-06-08',
  priority: 'Medium',
  status: 'In Progress'
}];

const calls = [
{
  id: 'CALL-001',
  caller: 'Mr. Ramesh Patel',
  phone: '9876543210',
  purpose: 'Fee inquiry',
  time: '09:30 AM',
  date: '2025-06-10',
  handledBy: 'Receptionist',
  status: 'Completed'
},
{
  id: 'CALL-002',
  caller: 'Mrs. Sunita Verma',
  phone: '9765432109',
  purpose: 'Admission query',
  time: '10:15 AM',
  date: '2025-06-10',
  handledBy: 'Admin',
  status: 'Transferred'
},
{
  id: 'CALL-003',
  caller: 'Unknown',
  phone: '9654321098',
  purpose: 'General inquiry',
  time: '11:00 AM',
  date: '2025-06-10',
  handledBy: 'Receptionist',
  status: 'Completed'
}];

const appointments = [
{
  id: 'APT-001',
  visitor: 'Mr. Anil Kumar',
  withWhom: 'Principal',
  date: '2025-06-12',
  time: '10:00 AM',
  purpose: 'Academic discussion',
  status: 'Confirmed'
},
{
  id: 'APT-002',
  visitor: 'Mrs. Priya Singh',
  withWhom: 'Class Teacher',
  date: '2025-06-13',
  time: '11:30 AM',
  purpose: 'Student performance',
  status: 'Pending'
}];

const followUps = [
{
  id: 'FU-001',
  ref: 'CMP-001',
  contact: 'Parent - Sharma',
  action: 'Call back regarding bus delay',
  dueDate: '2025-06-11',
  assignedTo: 'Transport Dept',
  status: 'Pending'
},
{
  id: 'FU-002',
  ref: 'APT-001',
  contact: 'Mr. Anil Kumar',
  action: 'Confirm appointment',
  dueDate: '2025-06-11',
  assignedTo: 'Reception',
  status: 'Done'
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
    Resolved: 'bg-green-100 text-green-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-gray-100 text-gray-600',
    Transferred: 'bg-purple-100 text-purple-700',
    Done: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ReceptionHelpdesk() {
  const [tab, setTab] = useState('complaints');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reception & Helpdesk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage complaints, calls, appointments and follow-ups
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Log New Request
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Open Complaints',
          value: '7',
          color: 'text-red-600'
        },
        {
          label: 'Calls Today',
          value: '23',
          color: 'text-blue-600'
        },
        {
          label: 'Appointments',
          value: '5',
          color: 'text-purple-600'
        },
        {
          label: 'Pending Follow-ups',
          value: '4',
          color: 'text-orange-600'
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
        <Tabs defaultValue="complaints" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="complaints">Complaint / Request</TabsTrigger>
            <TabsTrigger value="calls">Call Register</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="followup">Follow-up Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search complaints..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'complaint',
                  label: 'Complaint'
                },
                {
                  value: 'request',
                  label: 'Request'
                }]
                }
                className="w-40" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Log Complaint
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'name',
                header: 'Raised By'
              },
              {
                key: 'type',
                header: 'Type'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'priority',
                header: 'Priority',
                render: (r) => priorityBadge(r.priority)
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
              data={complaints} />

          </TabsContent>

          <TabsContent value="calls" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search calls..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Input type="date" className="w-44" />
              <Button variant="primary">
                <PhoneIcon className="w-4 h-4 mr-2" />
                Log Call
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Call ID'
              },
              {
                key: 'caller',
                header: 'Caller Name'
              },
              {
                key: 'phone',
                header: 'Phone'
              },
              {
                key: 'purpose',
                header: 'Purpose'
              },
              {
                key: 'time',
                header: 'Time'
              },
              {
                key: 'handledBy',
                header: 'Handled By'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              }]
              }
              data={calls} />

          </TabsContent>

          <TabsContent value="appointments" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search appointments..."
                    className="flex-1" />

                  <Button variant="primary">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
                <Table
                  columns={[
                  {
                    key: 'visitor',
                    header: 'Visitor'
                  },
                  {
                    key: 'withWhom',
                    header: 'With'
                  },
                  {
                    key: 'date',
                    header: 'Date'
                  },
                  {
                    key: 'time',
                    header: 'Time'
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
                          Reschedule
                        </Button>

                  }]
                  }
                  data={appointments} />

              </div>
              <Card title="Schedule Appointment">
                <div className="space-y-3">
                  <Input label="Visitor Name" placeholder="Full name" />
                  <Input label="Contact Number" placeholder="+91 XXXXX XXXXX" />
                  <Select
                    label="Meeting With"
                    options={[
                    {
                      value: 'principal',
                      label: 'Principal'
                    },
                    {
                      value: 'teacher',
                      label: 'Class Teacher'
                    },
                    {
                      value: 'admin',
                      label: 'Admin Office'
                    },
                    {
                      value: 'accounts',
                      label: 'Accounts'
                    }]
                    } />

                  <Input label="Purpose" placeholder="Reason for appointment" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date" type="date" />
                    <Input label="Time" type="time" />
                  </div>
                  <Button variant="primary" className="w-full">
                    Schedule Appointment
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="followup" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search follow-ups..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'pending',
                  label: 'Pending'
                },
                {
                  value: 'done',
                  label: 'Done'
                }]
                }
                className="w-40" />

              <Button variant="primary">
                <BellIcon className="w-4 h-4 mr-2" />
                Add Follow-up
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Follow-up ID'
              },
              {
                key: 'ref',
                header: 'Reference'
              },
              {
                key: 'contact',
                header: 'Contact'
              },
              {
                key: 'action',
                header: 'Action Required'
              },
              {
                key: 'dueDate',
                header: 'Due Date'
              },
              {
                key: 'assignedTo',
                header: 'Assigned To'
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
                r.status === 'Pending' ?
                <Button
                  variant="ghost"
                  className="text-xs h-7 px-2 text-green-600">

                        Mark Done
                      </Button> :
                null
              }]
              }
              data={followUps} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}