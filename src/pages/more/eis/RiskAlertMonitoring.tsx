import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  AlertTriangleIcon,
  UserXIcon,
  DollarSignIcon,
  TrendingDownIcon } from
'lucide-react';
const lowAttendance = [
{
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  attendance: '62%',
  absentDays: 18,
  lastPresent: '2025-06-08',
  parentContacted: true
},
{
  rollNo: '2024-089',
  name: 'Kavya Nair',
  class: 'Class 7-B',
  attendance: '68%',
  absentDays: 14,
  lastPresent: '2025-06-09',
  parentContacted: false
},
{
  rollNo: '2024-112',
  name: 'Rahul Singh',
  class: 'Class 10-A',
  attendance: '71%',
  absentDays: 12,
  lastPresent: '2025-06-10',
  parentContacted: true
}];

const feeDefaulters = [
{
  rollNo: '2024-023',
  name: 'Priya Patel',
  class: 'Class 9-B',
  outstanding: '₹12,500',
  dueDate: '2025-05-15',
  overdueDays: 26,
  lastPayment: '2025-03-10'
},
{
  rollNo: '2024-067',
  name: 'Rohan Mehta',
  class: 'Class 6-A',
  outstanding: '₹8,200',
  dueDate: '2025-05-15',
  overdueDays: 26,
  lastPayment: '2025-02-20'
},
{
  rollNo: '2024-134',
  name: 'Sneha Gupta',
  class: 'Class 11-A',
  outstanding: '₹18,000',
  dueDate: '2025-04-30',
  overdueDays: 41,
  lastPayment: '2025-01-15'
}];

const performanceDrop = [
{
  rollNo: '2024-056',
  name: 'Anil Kumar',
  class: 'Class 9-A',
  subject: 'Mathematics',
  prevScore: 78,
  currentScore: 52,
  drop: '-26%',
  alert: 'High'
},
{
  rollNo: '2024-078',
  name: 'Meera Shah',
  class: 'Class 8-B',
  subject: 'Science',
  prevScore: 82,
  currentScore: 61,
  drop: '-21%',
  alert: 'Medium'
},
{
  rollNo: '2024-091',
  name: 'Vikram Patel',
  class: 'Class 10-A',
  subject: 'English',
  prevScore: 75,
  currentScore: 58,
  drop: '-17%',
  alert: 'Medium'
}];

const alertBadge = (a: string) => {
  const c: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[a] || 'bg-gray-100 text-gray-600'}`}>

      {a}
    </span>);

};
export function RiskAlertMonitoring() {
  const [tab, setTab] = useState('attendance');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Risk & Alert Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor attendance risks, fee defaulters and performance drops
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Low Attendance Alerts',
          value: '18',
          icon: UserXIcon,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          desc: 'Below 75%'
        },
        {
          label: 'Fee Defaulters',
          value: '34',
          icon: DollarSignIcon,
          color: 'text-red-600',
          bg: 'bg-red-50',
          desc: 'Overdue > 15 days'
        },
        {
          label: 'Performance Drops',
          value: '12',
          icon: TrendingDownIcon,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          desc: 'Drop > 15%'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="flex items-center gap-3 p-1">
              <div className={`p-2.5 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-600 font-medium">{s.label}</p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="attendance" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="attendance">Low Attendance Alerts</TabsTrigger>
            <TabsTrigger value="fee">Fee Defaulters</TabsTrigger>
            <TabsTrigger value="performance">Performance Drop</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="p-5">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-orange-700">
                Students with attendance below 75% require immediate
                intervention
              </p>
            </div>
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Student Name'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'attendance',
                header: 'Attendance',
                render: (r) =>
                <span className="font-bold text-red-600">
                      {r.attendance}
                    </span>

              },
              {
                key: 'absentDays',
                header: 'Absent Days'
              },
              {
                key: 'lastPresent',
                header: 'Last Present'
              },
              {
                key: 'parentContacted',
                header: 'Parent Contacted',
                render: (r) =>
                r.parentContacted ?
                <span className="text-green-600 text-xs font-medium">
                        ✓ Yes
                      </span> :

                <span className="text-red-500 text-xs">✗ No</span>

              },
              {
                key: 'actions',
                header: '',
                render: (r) =>
                !r.parentContacted ?
                <Button variant="outline" className="text-xs h-7 px-2">
                        Contact Parent
                      </Button> :
                null
              }]
              }
              data={lowAttendance} />

          </TabsContent>

          <TabsContent value="fee" className="p-5">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">
                Total outstanding: ₹3,84,200 from 34 students
              </p>
            </div>
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Student Name'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'outstanding',
                header: 'Outstanding',
                render: (r) =>
                <span className="font-bold text-red-600">
                      {r.outstanding}
                    </span>

              },
              {
                key: 'dueDate',
                header: 'Due Date'
              },
              {
                key: 'overdueDays',
                header: 'Overdue Days',
                render: (r) =>
                <span className="font-medium text-orange-600">
                      {r.overdueDays} days
                    </span>

              },
              {
                key: 'lastPayment',
                header: 'Last Payment'
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="outline" className="text-xs h-7 px-2">
                      Send Reminder
                    </Button>

              }]
              }
              data={feeDefaulters} />

          </TabsContent>

          <TabsContent value="performance" className="p-5">
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Student Name'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'prevScore',
                header: 'Previous Score'
              },
              {
                key: 'currentScore',
                header: 'Current Score',
                render: (r) =>
                <span className="font-bold text-red-600">
                      {r.currentScore}
                    </span>

              },
              {
                key: 'drop',
                header: 'Drop',
                render: (r) =>
                <span className="font-bold text-red-600">{r.drop}</span>

              },
              {
                key: 'alert',
                header: 'Alert Level',
                render: (r) => alertBadge(r.alert)
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      Counsel
                    </Button>

              }]
              }
              data={performanceDrop} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}