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
import { PlusIcon, SearchIcon, UsersIcon, StarIcon } from 'lucide-react';
const clubs = [
{
  id: 'CLB-001',
  name: 'Science Club',
  category: 'Academic',
  mentor: 'Mr. Sharma',
  members: 34,
  meetings: 'Every Friday',
  status: 'Active'
},
{
  id: 'CLB-002',
  name: 'Drama Club',
  category: 'Cultural',
  mentor: 'Mrs. Patel',
  members: 28,
  meetings: 'Tue & Thu',
  status: 'Active'
},
{
  id: 'CLB-003',
  name: 'Chess Club',
  category: 'Sports',
  mentor: 'Mr. Verma',
  members: 20,
  meetings: 'Wednesday',
  status: 'Active'
},
{
  id: 'CLB-004',
  name: 'Eco Club',
  category: 'Environment',
  mentor: 'Mrs. Mehta',
  members: 42,
  meetings: 'Monday',
  status: 'Active'
}];

const enrollments = [
{
  id: 'ENR-001',
  student: 'Arjun Sharma',
  class: 'Class 8-A',
  club: 'Science Club',
  enrolledOn: '2025-06-01',
  status: 'Active'
},
{
  id: 'ENR-002',
  student: 'Priya Patel',
  class: 'Class 9-B',
  club: 'Drama Club',
  enrolledOn: '2025-06-02',
  status: 'Active'
},
{
  id: 'ENR-003',
  student: 'Rohan Mehta',
  class: 'Class 7-A',
  club: 'Chess Club',
  enrolledOn: '2025-06-01',
  status: 'Active'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ClubsActivities() {
  const [tab, setTab] = useState('clubs');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Clubs & Activities
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage clubs, enrollments, activity tracking and performance reports
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Club
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Active Clubs',
          value: '12',
          color: 'text-blue-600'
        },
        {
          label: 'Total Members',
          value: '342',
          color: 'text-green-600'
        },
        {
          label: 'Activities This Month',
          value: '18',
          color: 'text-purple-600'
        },
        {
          label: 'Mentors Assigned',
          value: '12',
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
        <Tabs defaultValue="clubs" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="tracking">Activity Tracking</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="reports">Performance Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search clubs..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'academic',
                  label: 'Academic'
                },
                {
                  value: 'cultural',
                  label: 'Cultural'
                },
                {
                  value: 'sports',
                  label: 'Sports'
                }]
                }
                className="w-40" />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map((club, i) =>
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{club.name}</p>
                      <p className="text-xs text-gray-500">
                        {club.category} • {club.meetings}
                      </p>
                    </div>
                    {statusBadge(club.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <UsersIcon className="w-3 h-3" />
                      {club.members} members
                    </span>
                    <span>Mentor: {club.mentor}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" className="flex-1 text-xs h-7">
                      View Members
                    </Button>
                    <Button variant="ghost" className="text-xs h-7 px-2">
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="enrollment" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search enrollments..."
                    className="flex-1" />

                  <Button variant="primary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Enroll Student
                  </Button>
                </div>
                <Table
                  columns={[
                  {
                    key: 'student',
                    header: 'Student'
                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'club',
                    header: 'Club'
                  },
                  {
                    key: 'enrolledOn',
                    header: 'Enrolled On'
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
                      variant="ghost"
                      className="text-xs h-7 px-2 text-red-500">

                          Remove
                        </Button>

                  }]
                  }
                  data={enrollments} />

              </div>
              <Card title="New Enrollment">
                <div className="space-y-3">
                  <Input
                    label="Student Roll No."
                    placeholder="Enter roll number" />

                  <Select
                    label="Club"
                    options={clubs.map((c) => ({
                      value: c.id,
                      label: c.name
                    }))} />

                  <Input label="Enrollment Date" type="date" />
                  <Button variant="primary" className="w-full">
                    Enroll Student
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="p-5">
            <div className="space-y-4">
              {clubs.slice(0, 3).map((club, i) =>
              <Card key={i} title={club.name}>
                  <div className="space-y-2">
                    {[
                  {
                    activity: 'Weekly Meeting',
                    date: '2025-06-13',
                    attendance: '28/34',
                    outcome: 'Project planning session'
                  },
                  {
                    activity: 'Workshop',
                    date: '2025-06-06',
                    attendance: '30/34',
                    outcome: 'Guest speaker session'
                  }].
                  map((act, ai) =>
                  <div
                    key={ai}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {act.activity}
                          </p>
                          <p className="text-xs text-gray-500">
                            {act.date} • {act.outcome}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">
                          {act.attendance}
                        </span>
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          View
                        </Button>
                      </div>
                  )}
                    <Button variant="outline" className="w-full text-xs h-7">
                      <PlusIcon className="w-3 h-3 mr-1" />
                      Log Activity
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map((club, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">

                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-purple-600 font-bold text-sm">
                      {club.mentor.split(' ')[1][0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{club.mentor}</p>
                    <p className="text-xs text-gray-500">
                      Mentor - {club.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {club.members} students
                    </p>
                  </div>
                  <Button variant="ghost" className="text-xs h-7 px-2">
                    Change
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Club Performance Summary">
                <div className="space-y-3">
                  {clubs.map((club, i) =>
                  <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {club.name}
                        </span>
                        <span className="text-gray-500">
                          {club.members} members
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${club.members / 50 * 100}%`
                        }} />

                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Student Performance">
                <div className="space-y-2">
                  {[
                  {
                    name: 'Arjun Sharma',
                    club: 'Science Club',
                    attendance: '95%',
                    rating: 5
                  },
                  {
                    name: 'Priya Patel',
                    club: 'Drama Club',
                    attendance: '88%',
                    rating: 4
                  },
                  {
                    name: 'Rohan Mehta',
                    club: 'Chess Club',
                    attendance: '100%',
                    rating: 5
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.club} • {s.attendance} attendance
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((si) =>
                      <StarIcon
                        key={si}
                        className={`w-3 h-3 ${si <= s.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

                      )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}