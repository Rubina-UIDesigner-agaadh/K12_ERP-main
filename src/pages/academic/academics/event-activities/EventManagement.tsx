import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Table } from '../../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../../components/ui/Tabs';
import { Textarea } from '../../../../components/ui/Textarea';
import {
  PlusIcon,
  SearchIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  DollarSignIcon } from
'lucide-react';
const events = [
{
  id: 'EVT-001',
  name: 'Annual Sports Day',
  type: 'Sports',
  date: '2025-06-25',
  venue: 'School Ground',
  organizer: 'Sports Dept',
  budget: '₹50,000',
  registered: 320,
  status: 'Upcoming'
},
{
  id: 'EVT-002',
  name: 'Science Exhibition',
  type: 'Academic',
  date: '2025-06-20',
  venue: 'School Hall',
  organizer: 'Science Dept',
  budget: '₹25,000',
  registered: 180,
  status: 'Upcoming'
},
{
  id: 'EVT-003',
  name: 'Annual Day 2025',
  type: 'Cultural',
  date: '2025-07-05',
  venue: 'Auditorium',
  organizer: 'Admin',
  budget: '₹1,50,000',
  registered: 450,
  status: 'Planning'
},
{
  id: 'EVT-004',
  name: 'Inter-School Debate',
  type: 'Competition',
  date: '2025-06-10',
  venue: 'Classroom 10A',
  organizer: 'English Dept',
  budget: '₹8,000',
  registered: 45,
  status: 'Completed'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Planning: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function EventManagement() {
  const [tab, setTab] = useState('events');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage school events, registrations and resources
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Upcoming Events',
          value: '3',
          color: 'text-blue-600'
        },
        {
          label: 'Total Registrations',
          value: '995',
          color: 'text-green-600'
        },
        {
          label: 'Total Budget',
          value: '₹2.33L',
          color: 'text-purple-600'
        },
        {
          label: 'Completed This Month',
          value: '2',
          color: 'text-gray-600'
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
        <Tabs defaultValue="events" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="budget">Budgeting</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search events..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'sports',
                  label: 'Sports'
                },
                {
                  value: 'cultural',
                  label: 'Cultural'
                },
                {
                  value: 'academic',
                  label: 'Academic'
                }]
                }
                className="w-40" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'upcoming',
                  label: 'Upcoming'
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
                header: 'Event ID'
              },
              {
                key: 'name',
                header: 'Event Name'
              },
              {
                key: 'type',
                header: 'Type'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'venue',
                header: 'Venue'
              },
              {
                key: 'registered',
                header: 'Registered',
                render: (r) =>
                <span className="font-medium text-blue-600">
                      {r.registered}
                    </span>

              },
              {
                key: 'budget',
                header: 'Budget'
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
              data={events} />

          </TabsContent>

          <TabsContent value="create" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input label="Event Name" placeholder="Enter event name" />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Event Type"
                    options={[
                    {
                      value: 'sports',
                      label: 'Sports'
                    },
                    {
                      value: 'cultural',
                      label: 'Cultural'
                    },
                    {
                      value: 'academic',
                      label: 'Academic'
                    },
                    {
                      value: 'competition',
                      label: 'Competition'
                    }]
                    } />

                  <Input label="Event Date" type="date" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Time" type="time" />
                  <Input label="End Time" type="time" />
                </div>
                <Input label="Venue" placeholder="Location of event" />
                <Input
                  label="Organizer / Department"
                  placeholder="Responsible department" />

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Event Description
                  </label>
                  <Textarea placeholder="Describe the event..." rows={4} />
                </div>
              </div>
              <div className="space-y-4">
                <Card title="Participants">
                  <div className="space-y-3">
                    <Select
                      label="Target Audience"
                      options={[
                      {
                        value: 'all',
                        label: 'All Students'
                      },
                      {
                        value: 'class',
                        label: 'Specific Classes'
                      },
                      {
                        value: 'staff',
                        label: 'Staff'
                      },
                      {
                        value: 'parents',
                        label: 'Parents'
                      }]
                      } />

                    <Input
                      label="Max Participants"
                      type="number"
                      placeholder="Leave blank for unlimited" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Registration Required
                      </span>
                      <button className="relative w-9 h-5 rounded-full bg-blue-500">
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                      </button>
                    </div>
                    <Input label="Registration Deadline" type="date" />
                  </div>
                </Card>
                <Card title="Budget">
                  <div className="space-y-3">
                    <Input
                      label="Estimated Budget (₹)"
                      type="number"
                      placeholder="0.00" />

                    <Select
                      label="Budget Head"
                      options={[
                      {
                        value: 'events',
                        label: 'Events Fund'
                      },
                      {
                        value: 'sports',
                        label: 'Sports Fund'
                      },
                      {
                        value: 'cultural',
                        label: 'Cultural Fund'
                      }]
                      } />

                  </div>
                </Card>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                  <Button variant="primary" className="flex-1">
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="p-5">
            <div className="space-y-4">
              {events.map((evt, i) =>
              <Card key={i} title={evt.name}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                  {
                    label: 'Allocated Budget',
                    value: evt.budget
                  },
                  {
                    label: 'Spent',
                    value:
                    '₹' +
                    (
                    parseInt(evt.budget.replace(/[₹,]/g, '')) * 0.6).
                    toLocaleString()
                  },
                  {
                    label: 'Remaining',
                    value:
                    '₹' +
                    (
                    parseInt(evt.budget.replace(/[₹,]/g, '')) * 0.4).
                    toLocaleString()
                  },
                  {
                    label: 'Utilization',
                    value: '60%'
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

          <TabsContent value="registration" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search registrations..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={events.map((e) => ({
                  value: e.id,
                  label: e.name
                }))}
                className="w-56" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Reg. ID'
              },
              {
                key: 'name',
                header: 'Participant'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'event',
                header: 'Event'
              },
              {
                key: 'registeredOn',
                header: 'Registered On'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              }]
              }
              data={[
              {
                id: 'REG-001',
                name: 'Arjun Sharma',
                class: 'Class 8-A',
                event: 'Annual Sports Day',
                registeredOn: '2025-06-11',
                status: 'Upcoming'
              },
              {
                id: 'REG-002',
                name: 'Priya Patel',
                class: 'Class 9-B',
                event: 'Science Exhibition',
                registeredOn: '2025-06-10',
                status: 'Upcoming'
              }]
              } />

          </TabsContent>

          <TabsContent value="approval" className="p-5">
            <div className="space-y-3">
              {events.
              filter((e) => e.status === 'Planning').
              map((evt, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-yellow-200 bg-yellow-50/50 rounded-xl">

                    <CalendarIcon className="w-5 h-5 text-yellow-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{evt.name}</p>
                      <p className="text-xs text-gray-500">
                        {evt.date} • {evt.venue} • Budget: {evt.budget}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" className="text-xs h-8 px-3">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" className="text-xs h-8 px-3">
                        Request Changes
                      </Button>
                      <Button
                    variant="ghost"
                    className="text-xs h-8 px-3 text-red-500">

                        Reject
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Resource Allocation">
                <div className="space-y-3">
                  <Select
                    label="Event"
                    options={events.map((e) => ({
                      value: e.id,
                      label: e.name
                    }))} />

                  <div className="space-y-2">
                    {[
                    {
                      resource: 'Auditorium',
                      available: true
                    },
                    {
                      resource: 'Sound System',
                      available: true
                    },
                    {
                      resource: 'Projector (x2)',
                      available: false
                    },
                    {
                      resource: 'Chairs (200)',
                      available: true
                    },
                    {
                      resource: 'Microphones (x4)',
                      available: true
                    }].
                    map((r, i) =>
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">

                        <span className="text-sm text-gray-700">
                          {r.resource}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                          className={`text-xs font-medium ${r.available ? 'text-green-600' : 'text-red-500'}`}>

                            {r.available ? 'Available' : 'Booked'}
                          </span>
                          <Button variant="ghost" className="text-xs h-6 px-2">
                            {r.available ? 'Book' : 'Waitlist'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button variant="primary" className="w-full">
                    Confirm Resource Booking
                  </Button>
                </div>
              </Card>
              <Card title="Staff Assignment">
                <div className="space-y-3">
                  {[
                  {
                    role: 'Event Coordinator',
                    assigned: 'Mrs. Sharma'
                  },
                  {
                    role: 'Stage Manager',
                    assigned: 'Mr. Patel'
                  },
                  {
                    role: 'Registration Desk',
                    assigned: 'Ms. Verma'
                  },
                  {
                    role: 'Security In-charge',
                    assigned: 'Mr. Kumar'
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {s.role}
                        </p>
                        <p className="text-xs text-gray-500">{s.assigned}</p>
                      </div>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Change
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}