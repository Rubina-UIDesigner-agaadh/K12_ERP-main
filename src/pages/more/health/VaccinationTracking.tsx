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
  PlusIcon,
  BellIcon,
  CheckCircleIcon,
  AlertCircleIcon } from
'lucide-react';
const vaccinations = [
{
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  vaccine: 'Hepatitis B',
  dose: 'Dose 3',
  date: '2025-03-15',
  nextDue: null,
  status: 'Complete'
},
{
  rollNo: '2024-067',
  name: 'Priya Patel',
  class: 'Class 6-B',
  vaccine: 'MMR',
  dose: 'Dose 2',
  date: '2025-01-20',
  nextDue: '2025-07-20',
  status: 'Due Soon'
},
{
  rollNo: '2024-089',
  name: 'Kavya Nair',
  class: 'Class 7-A',
  vaccine: 'Typhoid',
  dose: 'Dose 1',
  date: null,
  nextDue: '2025-06-30',
  status: 'Overdue'
}];

const schedule = [
{
  vaccine: 'BCG',
  ageGroup: 'At Birth',
  doses: 1,
  description: 'Tuberculosis prevention'
},
{
  vaccine: 'Hepatitis B',
  ageGroup: 'Birth, 6 weeks, 6 months',
  doses: 3,
  description: 'Hepatitis B prevention'
},
{
  vaccine: 'DPT',
  ageGroup: '6, 10, 14 weeks + boosters',
  doses: 5,
  description: 'Diphtheria, Pertussis, Tetanus'
},
{
  vaccine: 'Polio (OPV)',
  ageGroup: 'Birth, 6, 10, 14 weeks',
  doses: 4,
  description: 'Polio prevention'
},
{
  vaccine: 'MMR',
  ageGroup: '9 months, 15 months',
  doses: 2,
  description: 'Measles, Mumps, Rubella'
},
{
  vaccine: 'Typhoid',
  ageGroup: 'Annual (school age)',
  doses: 1,
  description: 'Typhoid prevention'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Complete: 'bg-green-100 text-green-700',
    'Due Soon': 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
    Pending: 'bg-gray-100 text-gray-600'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function VaccinationTracking() {
  const [tab, setTab] = useState('records');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vaccination Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track vaccination schedules and send due date alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BellIcon className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Fully Vaccinated',
          value: '892',
          color: 'text-green-600'
        },
        {
          label: 'Due Soon',
          value: '124',
          color: 'text-yellow-600'
        },
        {
          label: 'Overdue',
          value: '45',
          color: 'text-red-600'
        },
        {
          label: 'Not Recorded',
          value: '187',
          color: 'text-gray-500'
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
        <Tabs defaultValue="records" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="records">Vaccination Records</TabsTrigger>
            <TabsTrigger value="schedule">Vaccination Schedule</TabsTrigger>
            <TabsTrigger value="alerts">Due Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search students..." className="flex-1" />
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Vaccines'
                },
                {
                  value: 'hepb',
                  label: 'Hepatitis B'
                },
                {
                  value: 'mmr',
                  label: 'MMR'
                },
                {
                  value: 'typhoid',
                  label: 'Typhoid'
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
                  value: 'complete',
                  label: 'Complete'
                },
                {
                  value: 'due',
                  label: 'Due Soon'
                },
                {
                  value: 'overdue',
                  label: 'Overdue'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No.'
              },
              {
                key: 'name',
                header: 'Student'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'vaccine',
                header: 'Vaccine'
              },
              {
                key: 'dose',
                header: 'Dose'
              },
              {
                key: 'date',
                header: 'Date Given',
                render: (r) =>
                r.date || <span className="text-gray-400">Not given</span>
              },
              {
                key: 'nextDue',
                header: 'Next Due',
                render: (r) =>
                r.nextDue || <span className="text-gray-400">—</span>
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
                      Update
                    </Button>

              }]
              }
              data={vaccinations} />

          </TabsContent>

          <TabsContent value="schedule" className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                    'Vaccine',
                    'Age Group / Timing',
                    'Total Doses',
                    'Description',
                    'Status'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">

                        {h}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedule.map((row, i) =>
                  <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {row.vaccine}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {row.ageGroup}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-blue-600">
                        {row.doses}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {row.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircleIcon className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="p-5">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                  <p className="font-semibold text-red-800">
                    Overdue Vaccinations (45 students)
                  </p>
                </div>
                <div className="space-y-2">
                  {vaccinations.
                  filter((v) => v.status === 'Overdue').
                  map((v, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white border border-red-100 rounded-lg">

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {v.name} — {v.class}
                          </p>
                          <p className="text-xs text-gray-500">
                            {v.vaccine} {v.dose} • Due: {v.nextDue}
                          </p>
                        </div>
                        <Button
                      variant="outline"
                      className="text-xs h-7 px-2 border-red-300 text-red-600">

                          Notify Parent
                        </Button>
                      </div>
                  )}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BellIcon className="w-5 h-5 text-yellow-600" />
                  <p className="font-semibold text-yellow-800">
                    Due Soon (124 students)
                  </p>
                </div>
                <div className="space-y-2">
                  {vaccinations.
                  filter((v) => v.status === 'Due Soon').
                  map((v, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white border border-yellow-100 rounded-lg">

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {v.name} — {v.class}
                          </p>
                          <p className="text-xs text-gray-500">
                            {v.vaccine} {v.dose} • Due: {v.nextDue}
                          </p>
                        </div>
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          Remind
                        </Button>
                      </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  <BellIcon className="w-4 h-4 mr-2" />
                  Send All Overdue Reminders
                </Button>
                <Button variant="outline" className="flex-1">
                  Send Due Soon Reminders
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}