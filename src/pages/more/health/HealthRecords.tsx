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
import { SearchIcon, PlusIcon, HeartIcon } from 'lucide-react';
const healthProfiles = [
{
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  bloodGroup: 'B+',
  allergies: 'Peanuts',
  conditions: 'Mild Asthma',
  lastCheckup: '2025-03-15'
},
{
  rollNo: '2024-067',
  name: 'Priya Patel',
  class: 'Class 6-B',
  bloodGroup: 'O+',
  allergies: 'None',
  conditions: 'None',
  lastCheckup: '2025-03-15'
},
{
  rollNo: '2024-089',
  name: 'Kavya Nair',
  class: 'Class 7-A',
  bloodGroup: 'A+',
  allergies: 'Dust',
  conditions: 'Spectacles',
  lastCheckup: '2025-03-15'
}];

export function HealthRecords() {
  const [tab, setTab] = useState('profiles');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="text-sm text-gray-500 mt-1">
            Student medical profiles, blood groups and allergy information
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Health Record
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Records',
          value: '1,248',
          color: 'text-blue-600'
        },
        {
          label: 'With Allergies',
          value: '87',
          color: 'text-orange-600'
        },
        {
          label: 'With Conditions',
          value: '124',
          color: 'text-purple-600'
        },
        {
          label: 'Pending Checkup',
          value: '234',
          color: 'text-red-600'
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
        <Tabs defaultValue="profiles" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="profiles">Medical Profiles</TabsTrigger>
            <TabsTrigger value="bloodgroup">Blood Group Records</TabsTrigger>
            <TabsTrigger value="allergies">Allergy Information</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search students..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Classes'
                },
                {
                  value: '6',
                  label: 'Class 6'
                },
                {
                  value: '7',
                  label: 'Class 7'
                },
                {
                  value: '8',
                  label: 'Class 8'
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
                header: 'Student Name'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'bloodGroup',
                header: 'Blood Group',
                render: (r) =>
                <span className="font-bold text-red-600">
                      {r.bloodGroup}
                    </span>

              },
              {
                key: 'allergies',
                header: 'Allergies',
                render: (r) =>
                <span
                  className={
                  r.allergies !== 'None' ?
                  'text-orange-600 font-medium text-xs' :
                  'text-gray-400 text-xs'
                  }>

                      {r.allergies}
                    </span>

              },
              {
                key: 'conditions',
                header: 'Medical Conditions',
                render: (r) =>
                <span
                  className={
                  r.conditions !== 'None' ?
                  'text-purple-600 font-medium text-xs' :
                  'text-gray-400 text-xs'
                  }>

                      {r.conditions}
                    </span>

              },
              {
                key: 'lastCheckup',
                header: 'Last Checkup'
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
              data={healthProfiles} />

          </TabsContent>

          <TabsContent value="bloodgroup" className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
              {
                group: 'O+',
                count: 342,
                color: 'bg-red-500'
              },
              {
                group: 'A+',
                count: 289,
                color: 'bg-blue-500'
              },
              {
                group: 'B+',
                count: 234,
                color: 'bg-green-500'
              },
              {
                group: 'AB+',
                count: 156,
                color: 'bg-purple-500'
              },
              {
                group: 'O-',
                count: 89,
                color: 'bg-red-400'
              },
              {
                group: 'A-',
                count: 67,
                color: 'bg-blue-400'
              },
              {
                group: 'B-',
                count: 45,
                color: 'bg-green-400'
              },
              {
                group: 'AB-',
                count: 26,
                color: 'bg-purple-400'
              }].
              map((bg, i) =>
              <div
                key={i}
                className="text-center p-4 border border-gray-200 rounded-xl">

                  <div
                  className={`w-10 h-10 ${bg.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>

                    <HeartIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-gray-800 text-lg">{bg.group}</p>
                  <p className="text-sm text-gray-500">{bg.count} students</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="allergies" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Allergy Summary">
                <div className="space-y-2">
                  {[
                  {
                    type: 'Food Allergies',
                    count: 45,
                    examples: 'Peanuts, Dairy, Eggs'
                  },
                  {
                    type: 'Environmental',
                    count: 28,
                    examples: 'Dust, Pollen, Pet dander'
                  },
                  {
                    type: 'Medication',
                    count: 12,
                    examples: 'Penicillin, Aspirin'
                  },
                  {
                    type: 'Insect Stings',
                    count: 8,
                    examples: 'Bee, Wasp'
                  },
                  {
                    type: 'Other',
                    count: 15,
                    examples: 'Latex, Chemicals'
                  }].
                  map((a, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {a.type}
                        </p>
                        <p className="text-xs text-gray-500">{a.examples}</p>
                      </div>
                      <span className="text-sm font-bold text-orange-600">
                        {a.count}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Students with Allergies">
                <div className="space-y-2">
                  {healthProfiles.
                  filter((p) => p.allergies !== 'None').
                  map((p, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-orange-600">
                            {p.name[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.class}</p>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          {p.allergies}
                        </span>
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