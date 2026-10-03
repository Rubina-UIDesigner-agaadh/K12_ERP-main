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
  SearchIcon,
  ClockIcon,
  LogOutIcon,
  FileTextIcon } from
'lucide-react';
const lateEntries = [
{
  id: 'LE-001',
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  arrivalTime: '09:45',
  reason: 'Medical appointment',
  parentConsent: true,
  date: '2025-06-10'
},
{
  id: 'LE-002',
  rollNo: '2024-067',
  name: 'Priya Patel',
  class: 'Class 6-B',
  arrivalTime: '10:15',
  reason: 'Traffic delay',
  parentConsent: false,
  date: '2025-06-10'
},
{
  id: 'LE-003',
  rollNo: '2024-023',
  name: 'Rohan Mehta',
  class: 'Class 9-A',
  arrivalTime: '09:30',
  reason: 'Bus breakdown',
  parentConsent: true,
  date: '2025-06-10'
}];

const earlyDepartures = [
{
  id: 'ED-001',
  rollNo: '2024-089',
  name: 'Kavya Nair',
  class: 'Class 7-A',
  departureTime: '13:00',
  reason: 'Doctor visit',
  collectedBy: 'Father',
  date: '2025-06-10'
},
{
  id: 'ED-002',
  rollNo: '2024-112',
  name: 'Rahul Singh',
  class: 'Class 10-B',
  departureTime: '14:30',
  reason: 'Family emergency',
  collectedBy: 'Mother',
  date: '2025-06-10'
}];

const studentGatePasses = [
{
  id: 'SGP-001',
  rollNo: '2024-045',
  name: 'Arjun Sharma',
  class: 'Class 8-A',
  purpose: 'Medical',
  issuedAt: '11:00',
  validTill: '14:00',
  approvedBy: 'Class Teacher',
  status: 'Active'
},
{
  id: 'SGP-002',
  rollNo: '2024-067',
  name: 'Priya Patel',
  class: 'Class 6-B',
  purpose: 'Personal',
  issuedAt: '13:30',
  validTill: '15:30',
  approvedBy: 'Principal',
  status: 'Used'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Used: 'bg-gray-100 text-gray-600',
    Expired: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function StudentMovement() {
  const [tab, setTab] = useState('late');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Movement</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track late entries, early departures and student gate passes
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Log Movement
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Late Entries Today',
          value: '8',
          color: 'text-orange-600',
          bg: 'bg-orange-50'
        },
        {
          label: 'Early Departures',
          value: '3',
          color: 'text-red-600',
          bg: 'bg-red-50'
        },
        {
          label: 'Gate Passes Issued',
          value: '5',
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className={`flex items-center gap-3 p-1`}>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <ClockIcon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="late" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="late">Late Entry Register</TabsTrigger>
            <TabsTrigger value="early">Early Departure Register</TabsTrigger>
            <TabsTrigger value="gatepass">Gate Pass for Students</TabsTrigger>
          </TabsList>

          <TabsContent value="late" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search students..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Input type="date" className="w-44" />
              <Button variant="primary">
                <ClockIcon className="w-4 h-4 mr-2" />
                Log Late Entry
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Entry ID'
              },
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
                key: 'arrivalTime',
                header: 'Arrival Time'
              },
              {
                key: 'reason',
                header: 'Reason'
              },
              {
                key: 'parentConsent',
                header: 'Parent Consent',
                render: (r) =>
                r.parentConsent ?
                <span className="text-green-600 text-xs font-medium">
                        ✓ Yes
                      </span> :

                <span className="text-red-500 text-xs">✗ No</span>

              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      SMS Parent
                    </Button>

              }]
              }
              data={lateEntries} />

          </TabsContent>

          <TabsContent value="early" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search students..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Input type="date" className="w-44" />
              <Button variant="primary">
                <LogOutIcon className="w-4 h-4 mr-2" />
                Log Early Departure
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Entry ID'
              },
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
                key: 'departureTime',
                header: 'Departure Time'
              },
              {
                key: 'reason',
                header: 'Reason'
              },
              {
                key: 'collectedBy',
                header: 'Collected By'
              },
              {
                key: 'actions',
                header: '',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      Print Slip
                    </Button>

              }]
              }
              data={earlyDepartures} />

          </TabsContent>

          <TabsContent value="gatepass" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input placeholder="Search passes..." className="flex-1" />
                  <Button variant="primary">
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    Issue Pass
                  </Button>
                </div>
                <Table
                  columns={[
                  {
                    key: 'id',
                    header: 'Pass No.'
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
                    key: 'purpose',
                    header: 'Purpose'
                  },
                  {
                    key: 'issuedAt',
                    header: 'Issued At'
                  },
                  {
                    key: 'validTill',
                    header: 'Valid Till'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={studentGatePasses} />

              </div>
              <Card title="Issue Student Gate Pass">
                <div className="space-y-3">
                  <Input
                    label="Student Roll No."
                    placeholder="Enter roll number" />

                  <Input label="Student Name" placeholder="Auto-filled" />
                  <Input label="Class & Section" placeholder="Auto-filled" />
                  <Select
                    label="Purpose"
                    options={[
                    {
                      value: 'medical',
                      label: 'Medical'
                    },
                    {
                      value: 'personal',
                      label: 'Personal Emergency'
                    },
                    {
                      value: 'sports',
                      label: 'Sports Event'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Issue Time" type="time" />
                    <Input label="Return By" type="time" />
                  </div>
                  <Select
                    label="Approved By"
                    options={[
                    {
                      value: 'teacher',
                      label: 'Class Teacher'
                    },
                    {
                      value: 'principal',
                      label: 'Principal'
                    },
                    {
                      value: 'admin',
                      label: 'Admin'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    Issue Gate Pass
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}