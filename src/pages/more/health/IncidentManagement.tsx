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
import { PlusIcon, PhoneIcon } from 'lucide-react';
const incidents = [
{
  id: 'INC-001',
  student: 'Arjun Sharma',
  class: 'Class 8-A',
  type: 'Injury',
  description: 'Fell during sports, minor knee injury',
  date: '2025-06-10',
  time: '10:30 AM',
  firstAid: true,
  parentNotified: true,
  status: 'Resolved'
},
{
  id: 'INC-002',
  student: 'Priya Patel',
  class: 'Class 6-B',
  type: 'Illness',
  description: 'Fever and headache',
  date: '2025-06-09',
  time: '02:00 PM',
  firstAid: true,
  parentNotified: true,
  status: 'Resolved'
},
{
  id: 'INC-003',
  student: 'Rohan Mehta',
  class: 'Class 9-A',
  type: 'Injury',
  description: 'Sprained ankle during PE',
  date: '2025-06-08',
  time: '11:15 AM',
  firstAid: true,
  parentNotified: false,
  status: 'Follow-up'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Resolved: 'bg-green-100 text-green-700',
    'Follow-up': 'bg-orange-100 text-orange-700',
    Active: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function IncidentManagement() {
  const [tab, setTab] = useState('incidents');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incident Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Injury reports, first aid records and emergency contacts
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Report Incident
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="incidents" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="incidents">Injury Reports</TabsTrigger>
            <TabsTrigger value="firstaid">First Aid Records</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search incidents..." className="flex-1" />
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'injury',
                  label: 'Injury'
                },
                {
                  value: 'illness',
                  label: 'Illness'
                },
                {
                  value: 'emergency',
                  label: 'Emergency'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID'
              },
              {
                key: 'student',
                header: 'Student'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'type',
                header: 'Type'
              },
              {
                key: 'description',
                header: 'Description'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'firstAid',
                header: 'First Aid',
                render: (r) =>
                r.firstAid ?
                <span className="text-green-600 text-xs font-medium">
                        ✓ Given
                      </span> :

                <span className="text-red-500 text-xs">✗ No</span>

              },
              {
                key: 'parentNotified',
                header: 'Parent Notified',
                render: (r) =>
                r.parentNotified ?
                <span className="text-green-600 text-xs font-medium">
                        ✓ Yes
                      </span> :

                <Button variant="outline" className="text-xs h-6 px-2">
                        Notify
                      </Button>

              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              }]
              }
              data={incidents} />

          </TabsContent>

          <TabsContent value="firstaid" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Log First Aid Treatment">
                <div className="space-y-3">
                  <Input
                    label="Student Roll No."
                    placeholder="Enter roll number" />

                  <Select
                    label="Incident Type"
                    options={[
                    {
                      value: 'injury',
                      label: 'Injury'
                    },
                    {
                      value: 'illness',
                      label: 'Illness'
                    },
                    {
                      value: 'allergic',
                      label: 'Allergic Reaction'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Incident Description
                    </label>
                    <Textarea
                      placeholder="Describe what happened..."
                      rows={3} />

                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      First Aid Given
                    </label>
                    <Textarea placeholder="Treatment provided..." rows={3} />
                  </div>
                  <Input label="Treated By" placeholder="Staff name" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Parent Notified
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Referred to Hospital
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-gray-300">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    Save First Aid Record
                  </Button>
                </div>
              </Card>
              <Card title="Recent First Aid Cases">
                <div className="space-y-2">
                  {incidents.map((inc, i) =>
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {inc.student}
                        </p>
                        {statusBadge(inc.status)}
                      </div>
                      <p className="text-xs text-gray-500">{inc.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {inc.date} {inc.time}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="School Emergency Contacts">
                <div className="space-y-3">
                  {[
                  {
                    role: 'School Doctor',
                    name: 'Dr. Priya Mehta',
                    phone: '9876543210',
                    available: '8AM-4PM'
                  },
                  {
                    role: 'Nurse',
                    name: 'Mrs. Sunita Rao',
                    phone: '9765432109',
                    available: 'All Day'
                  },
                  {
                    role: 'Ambulance',
                    name: 'City Hospital',
                    phone: '108',
                    available: '24/7'
                  },
                  {
                    role: 'Police',
                    name: 'Local Station',
                    phone: '100',
                    available: '24/7'
                  },
                  {
                    role: 'Fire Brigade',
                    name: 'Fire Station',
                    phone: '101',
                    available: '24/7'
                  },
                  {
                    role: 'Principal',
                    name: 'Mr. Ramesh Kumar',
                    phone: '9654321098',
                    available: 'School Hours'
                  }].
                  map((contact, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <PhoneIcon className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {contact.role} • {contact.available}
                        </p>
                      </div>
                      <a
                      href={`tel:${contact.phone}`}
                      className="text-sm font-bold text-blue-600">

                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Add Emergency Contact">
                <div className="space-y-3">
                  <Select
                    label="Contact Type"
                    options={[
                    {
                      value: 'medical',
                      label: 'Medical'
                    },
                    {
                      value: 'security',
                      label: 'Security'
                    },
                    {
                      value: 'admin',
                      label: 'Administrative'
                    },
                    {
                      value: 'external',
                      label: 'External Agency'
                    }]
                    } />

                  <Input
                    label="Contact Name"
                    placeholder="Name or organization" />

                  <Input
                    label="Role / Designation"
                    placeholder="e.g. School Doctor" />

                  <Input
                    label="Phone Number"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel" />

                  <Input
                    label="Availability"
                    placeholder="e.g. 8AM-4PM, 24/7" />

                  <Input
                    label="Location / Address"
                    placeholder="Room no. or address" />

                  <Button variant="primary" className="w-full">
                    Add Emergency Contact
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}