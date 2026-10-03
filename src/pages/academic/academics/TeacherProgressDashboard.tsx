import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  DownloadIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  BarChart2Icon,
  CalendarIcon,
  AwardIcon } from
'lucide-react';
interface TeacherStat {
  name: string;
  subject: string;
  class: string;
  activePlans: number;
  pendingApprovals: number;
  curriculumPct: number;
  attendanceCompliance: number;
  activitiesCompleted: number;
  activitiesTotal: number;
}
const teacherStats: TeacherStat[] = [
{
  name: 'Ms. Priya Sharma',
  subject: 'English',
  class: 'Class 1-A',
  activePlans: 6,
  pendingApprovals: 2,
  curriculumPct: 78,
  attendanceCompliance: 96,
  activitiesCompleted: 42,
  activitiesTotal: 50
},
{
  name: 'Mr. Rajesh Patel',
  subject: 'Mathematics',
  class: 'Class 2-B',
  activePlans: 5,
  pendingApprovals: 1,
  curriculumPct: 65,
  attendanceCompliance: 91,
  activitiesCompleted: 35,
  activitiesTotal: 50
},
{
  name: 'Ms. Anita Verma',
  subject: 'Science',
  class: 'Class 3-A',
  activePlans: 7,
  pendingApprovals: 3,
  curriculumPct: 82,
  attendanceCompliance: 98,
  activitiesCompleted: 48,
  activitiesTotal: 55
},
{
  name: 'Mr. Suresh Kumar',
  subject: 'Social Studies',
  class: 'Class 4-A',
  activePlans: 4,
  pendingApprovals: 0,
  curriculumPct: 90,
  attendanceCompliance: 94,
  activitiesCompleted: 44,
  activitiesTotal: 48
},
{
  name: 'Ms. Kavita Nair',
  subject: 'Hindi',
  class: 'Class 2-A',
  activePlans: 5,
  pendingApprovals: 1,
  curriculumPct: 71,
  attendanceCompliance: 89,
  activitiesCompleted: 38,
  activitiesTotal: 50
}];

const recentActivities = [
{
  id: 1,
  teacher: 'Ms. Priya Sharma',
  action: 'Submitted lesson plan for Week 8',
  time: '2 hours ago',
  type: 'plan'
},
{
  id: 2,
  teacher: 'Mr. Rajesh Patel',
  action: 'Marked attendance for Class 2-B',
  time: '3 hours ago',
  type: 'attendance'
},
{
  id: 3,
  teacher: 'Ms. Anita Verma',
  action: 'Completed Science Lab activity',
  time: '5 hours ago',
  type: 'activity'
},
{
  id: 4,
  teacher: 'Mr. Suresh Kumar',
  action: 'Updated curriculum progress — Chapter 9',
  time: '1 day ago',
  type: 'curriculum'
},
{
  id: 5,
  teacher: 'Ms. Kavita Nair',
  action: 'Lesson plan approved by HOD',
  time: '1 day ago',
  type: 'approval'
}];

const pendingApprovalsList = [
{
  id: 1,
  teacher: 'Ms. Priya Sharma',
  plan: 'Week 8 – Phonics Advanced',
  class: 'Class 1-A',
  submittedOn: '24 Feb 2026',
  daysWaiting: 1
},
{
  id: 2,
  teacher: 'Ms. Priya Sharma',
  plan: 'Week 9 – Reading Comprehension',
  class: 'Class 1-A',
  submittedOn: '23 Feb 2026',
  daysWaiting: 2
},
{
  id: 3,
  teacher: 'Mr. Rajesh Patel',
  plan: 'Week 8 – Fractions Introduction',
  class: 'Class 2-B',
  submittedOn: '24 Feb 2026',
  daysWaiting: 1
},
{
  id: 4,
  teacher: 'Ms. Anita Verma',
  plan: 'Week 8 – Plant Life Cycle',
  class: 'Class 3-A',
  submittedOn: '22 Feb 2026',
  daysWaiting: 3
},
{
  id: 5,
  teacher: 'Ms. Anita Verma',
  plan: 'Week 9 – Animal Habitats',
  class: 'Class 3-A',
  submittedOn: '23 Feb 2026',
  daysWaiting: 2
},
{
  id: 6,
  teacher: 'Ms. Anita Verma',
  plan: 'Week 10 – Water Cycle',
  class: 'Class 3-A',
  submittedOn: '24 Feb 2026',
  daysWaiting: 1
},
{
  id: 7,
  teacher: 'Ms. Kavita Nair',
  plan: 'Week 8 – Vyakaran Basics',
  class: 'Class 2-A',
  submittedOn: '24 Feb 2026',
  daysWaiting: 1
}];

export function TeacherProgressDashboard() {
  const [dateFrom, setDateFrom] = useState('2026-02-01');
  const [dateTo, setDateTo] = useState('2026-02-28');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const totalActivePlans = teacherStats.reduce((s, t) => s + t.activePlans, 0);
  const totalPending = teacherStats.reduce((s, t) => s + t.pendingApprovals, 0);
  const avgCurriculum = Math.round(
    teacherStats.reduce((s, t) => s + t.curriculumPct, 0) / teacherStats.length
  );
  const avgAttendance = Math.round(
    teacherStats.reduce((s, t) => s + t.attendanceCompliance, 0) /
    teacherStats.length
  );
  const totalActivitiesCompleted = teacherStats.reduce(
    (s, t) => s + t.activitiesCompleted,
    0
  );
  const totalActivitiesTotal = teacherStats.reduce(
    (s, t) => s + t.activitiesTotal,
    0
  );
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Progress Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor lesson plans, curriculum completion, attendance compliance
            and activity progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Summary
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40" />

          <Input
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40" />

          <Select
            label="Teacher"
            options={[
            {
              value: '',
              label: 'All Teachers'
            },
            {
              value: 'priya',
              label: 'Ms. Priya Sharma'
            },
            {
              value: 'rajesh',
              label: 'Mr. Rajesh Patel'
            },
            {
              value: 'anita',
              label: 'Ms. Anita Verma'
            },
            {
              value: 'suresh',
              label: 'Mr. Suresh Kumar'
            },
            {
              value: 'kavita',
              label: 'Ms. Kavita Nair'
            }]
            }
            value={filterTeacher}
            onChange={setFilterTeacher}
            className="w-48" />

          <Select
            label="Class"
            options={[
            {
              value: '',
              label: 'All Classes'
            },
            {
              value: 'class-1a',
              label: 'Class 1-A'
            },
            {
              value: 'class-2a',
              label: 'Class 2-A'
            },
            {
              value: 'class-2b',
              label: 'Class 2-B'
            },
            {
              value: 'class-3a',
              label: 'Class 3-A'
            },
            {
              value: 'class-4a',
              label: 'Class 4-A'
            }]
            }
            value={filterClass}
            onChange={setFilterClass}
            className="w-40" />

          <div className="flex items-end gap-2 ml-auto">
            <Button variant="outline" size="sm">
              Reset
            </Button>
            <Button variant="primary" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Active Plans
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-700">{totalActivePlans}</p>
          <p className="text-xs text-blue-500 mt-1">Across all teachers</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
              Pending Approvals
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{totalPending}</p>
          <p className="text-xs text-yellow-500 mt-1">Awaiting HOD review</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Curriculum %
            </span>
          </div>
          <p className="text-3xl font-bold text-green-700">{avgCurriculum}%</p>
          <p className="text-xs text-green-500 mt-1">Average completion</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              Attendance
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-700">{avgAttendance}%</p>
          <p className="text-xs text-purple-500 mt-1">Compliance avg</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              Activities
            </span>
          </div>
          <p className="text-3xl font-bold text-indigo-700">
            {totalActivitiesCompleted}
          </p>
          <p className="text-xs text-indigo-500 mt-1">
            of {totalActivitiesTotal} completed
          </p>
        </div>
      </div>

      {/* Teacher-wise Progress Table */}
      <Card
        title="Teacher-wise Progress Summary"
        headerAction={
        <Badge variant="info">{teacherStats.length} Teachers</Badge>
        }>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Class / Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Active Plans
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Curriculum %
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activities
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teacherStats.map((t, i) =>
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                        {t.name.
                      split(' ').
                      map((n) => n[0]).
                      join('').
                      slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">
                      {t.class}
                    </p>
                    <p className="text-xs text-gray-500">{t.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {t.activePlans}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {t.pendingApprovals > 0 ?
                  <Badge variant="warning">{t.pendingApprovals}</Badge> :

                  <Badge variant="success">0</Badge>
                  }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                        className={`h-2 rounded-full ${t.curriculumPct >= 80 ? 'bg-green-500' : t.curriculumPct >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                        style={{
                          width: `${t.curriculumPct}%`
                        }} />

                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {t.curriculumPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                        className={`h-2 rounded-full ${t.attendanceCompliance >= 95 ? 'bg-green-500' : t.attendanceCompliance >= 85 ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{
                          width: `${t.attendanceCompliance}%`
                        }} />

                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {t.attendanceCompliance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {t.activitiesCompleted}/{t.activitiesTotal}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.round(t.activitiesCompleted / t.activitiesTotal * 100)}%`
                      }} />

                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card
          title="Pending Lesson Plan Approvals"
          headerAction={
          <div className="flex gap-2">
              <Badge variant="warning">
                {pendingApprovalsList.length} Pending
              </Badge>
              <Button variant="primary" size="xs">
                Approve All
              </Button>
            </div>
          }>

          <div className="space-y-2">
            {pendingApprovalsList.map((item) =>
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg">

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.plan}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.teacher} · {item.class}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {item.daysWaiting}d ago
                  </span>
                  <Button variant="primary" size="xs">
                    Approve
                  </Button>
                  <Button variant="outline" size="xs">
                    Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            {recentActivities.map((item) => {
              const iconMap: Record<string, React.ReactNode> = {
                plan: <BookOpenIcon className="w-4 h-4 text-blue-600" />,
                attendance: <UsersIcon className="w-4 h-4 text-green-600" />,
                activity:
                <CheckCircleIcon className="w-4 h-4 text-purple-600" />,

                curriculum:
                <BarChart2Icon className="w-4 h-4 text-indigo-600" />,

                approval: <AwardIcon className="w-4 h-4 text-yellow-600" />
              };
              const bgMap: Record<string, string> = {
                plan: 'bg-blue-100',
                attendance: 'bg-green-100',
                activity: 'bg-purple-100',
                curriculum: 'bg-indigo-100',
                approval: 'bg-yellow-100'
              };
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${bgMap[item.type]} flex items-center justify-center flex-shrink-0`}>

                    {iconMap[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.teacher}
                    </p>
                    <p className="text-xs text-gray-600">{item.action}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {item.time}
                  </span>
                </div>);

            })}
          </div>
        </Card>
      </div>

      {/* Role-based visibility note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Role-based Visibility
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Teachers see only their own data. HODs see their department.
            Principals and Admins see all teachers across all classes. Data
            shown is filtered based on your current role and assigned classes.
          </p>
        </div>
      </div>
    </div>);

}