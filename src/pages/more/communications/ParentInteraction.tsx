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
  CalendarIcon,
  FileTextIcon,
  StarIcon } from
'lucide-react';
const ptmSchedules = [
{
  id: 'PTM-001',
  class: 'Class 8-A',
  teacher: 'Mrs. Sharma',
  date: '2025-06-14',
  time: '10:00 - 13:00',
  venue: 'Classroom 8A',
  registered: 28,
  total: 35,
  status: 'Upcoming'
},
{
  id: 'PTM-002',
  class: 'Class 10-B',
  teacher: 'Mr. Verma',
  date: '2025-06-15',
  time: '14:00 - 17:00',
  venue: 'Classroom 10B',
  registered: 32,
  total: 38,
  status: 'Upcoming'
},
{
  id: 'PTM-003',
  class: 'Class 6-A',
  teacher: 'Mrs. Patel',
  date: '2025-06-08',
  time: '10:00 - 13:00',
  venue: 'Classroom 6A',
  registered: 30,
  total: 30,
  status: 'Completed'
}];

const feedbacks = [
{
  id: 'FB-001',
  parent: 'Mr. Ramesh Patel',
  student: 'Arjun Patel (8-A)',
  category: 'Teaching Quality',
  rating: 4,
  date: '2025-06-08',
  status: 'Reviewed'
},
{
  id: 'FB-002',
  parent: 'Mrs. Sunita Verma',
  student: 'Priya Verma (6-B)',
  category: 'Infrastructure',
  rating: 3,
  date: '2025-06-09',
  status: 'Pending'
},
{
  id: 'FB-003',
  parent: 'Mr. Anil Kumar',
  student: 'Rahul Kumar (10-A)',
  category: 'Academics',
  rating: 5,
  date: '2025-06-10',
  status: 'Reviewed'
}];

const consentForms = [
{
  id: 'CF-001',
  title: 'Annual Day Participation Consent',
  class: 'All Classes',
  issued: '2025-06-01',
  deadline: '2025-06-10',
  received: 342,
  total: 450,
  status: 'Active'
},
{
  id: 'CF-002',
  title: 'Sports Day Consent Form',
  class: 'Class 6-10',
  issued: '2025-05-25',
  deadline: '2025-06-05',
  received: 280,
  total: 280,
  status: 'Closed'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Active: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-600',
    Reviewed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
const renderStars = (rating: number) =>
<div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) =>
  <StarIcon
    key={i}
    className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

  )}
  </div>;

export function ParentInteraction() {
  const [tab, setTab] = useState('ptm');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Parent Interaction
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            PTM scheduling, feedback, consent forms and meeting records
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Schedule PTM
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="ptm" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="ptm">PTM Scheduling</TabsTrigger>
            <TabsTrigger value="feedback">Parent Feedback</TabsTrigger>
            <TabsTrigger value="consent">Consent Forms</TabsTrigger>
            <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
          </TabsList>

          <TabsContent value="ptm" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search PTM sessions..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

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

              <Button variant="primary">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule PTM
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'PTM ID'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'teacher',
                header: 'Teacher'
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
                key: 'venue',
                header: 'Venue'
              },
              {
                key: 'registered',
                header: 'Registered',
                render: (r) => `${r.registered}/${r.total}`
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
                      {r.status === 'Upcoming' &&
                  <Button
                    variant="ghost"
                    className="text-xs h-7 px-2 text-red-500">

                          Cancel
                        </Button>
                  }
                    </div>

              }]
              }
              data={ptmSchedules} />

          </TabsContent>

          <TabsContent value="feedback" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search feedback..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'teaching',
                  label: 'Teaching Quality'
                },
                {
                  value: 'infra',
                  label: 'Infrastructure'
                },
                {
                  value: 'academics',
                  label: 'Academics'
                }]
                }
                className="w-44" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'parent',
                header: 'Parent'
              },
              {
                key: 'student',
                header: 'Student'
              },
              {
                key: 'category',
                header: 'Category'
              },
              {
                key: 'rating',
                header: 'Rating',
                render: (r) => renderStars(r.rating)
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
              data={feedbacks} />

          </TabsContent>

          <TabsContent value="consent" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search consent forms..." className="flex-1" />
              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Form ID'
              },
              {
                key: 'title',
                header: 'Title'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'issued',
                header: 'Issued On'
              },
              {
                key: 'deadline',
                header: 'Deadline'
              },
              {
                key: 'received',
                header: 'Received',
                render: (r) =>
                <span className="font-medium">
                      {r.received}/{r.total}
                    </span>

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
              data={consentForms} />

          </TabsContent>

          <TabsContent value="minutes" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search meeting records..."
                    className="flex-1" />

                  <Button variant="primary">
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    Add Minutes
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                  {
                    title: 'PTM - Class 6-A',
                    date: '2025-06-08',
                    attendees: 30,
                    points: 5
                  },
                  {
                    title: 'Parent Advisory Meeting',
                    date: '2025-05-20',
                    attendees: 12,
                    points: 8
                  }].
                  map((m, i) =>
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">

                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800">{m.title}</p>
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          View
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {m.date} • {m.attendees} attendees • {m.points} action
                        points
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Card title="Record Meeting Minutes">
                <div className="space-y-3">
                  <Input
                    label="Meeting Title"
                    placeholder="e.g. PTM - Class 8-A" />

                  <Input label="Meeting Date" type="date" />
                  <Input
                    label="Attendees Count"
                    type="number"
                    placeholder="Number of attendees" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Minutes / Discussion Points
                    </label>
                    <Textarea
                      placeholder="Record key discussion points and decisions..."
                      rows={5} />

                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Action Items
                    </label>
                    <Textarea
                      placeholder="List action items with responsible persons..."
                      rows={3} />

                  </div>
                  <Button variant="primary" className="w-full">
                    Save Meeting Minutes
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}