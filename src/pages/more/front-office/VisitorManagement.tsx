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
  PrinterIcon,
  LogInIcon,
  LogOutIcon } from
'lucide-react';
const visitors = [
{
  id: 'V-001',
  name: 'Ramesh Patel',
  purpose: 'Meet Teacher',
  host: 'Mrs. Sharma',
  checkIn: '09:15',
  checkOut: '10:00',
  date: '2025-06-10',
  status: 'Checked Out'
},
{
  id: 'V-002',
  name: 'Sunita Verma',
  purpose: 'Admission Inquiry',
  host: 'Admin Office',
  checkIn: '10:30',
  checkOut: '-',
  date: '2025-06-10',
  status: 'Inside'
},
{
  id: 'V-003',
  name: 'Anil Kumar',
  purpose: 'Fee Payment',
  host: 'Accounts',
  checkIn: '11:00',
  checkOut: '11:20',
  date: '2025-06-10',
  status: 'Checked Out'
}];

const gatePasses = [
{
  id: 'GP-001',
  visitor: 'Ramesh Patel',
  issuedBy: 'Security',
  validFrom: '09:00',
  validTo: '11:00',
  date: '2025-06-10',
  status: 'Used'
},
{
  id: 'GP-002',
  visitor: 'Sunita Verma',
  issuedBy: 'Admin',
  validFrom: '10:00',
  validTo: '13:00',
  date: '2025-06-10',
  status: 'Active'
}];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Inside: 'bg-green-100 text-green-700',
    'Checked Out': 'bg-gray-100 text-gray-600',
    Active: 'bg-blue-100 text-blue-700',
    Used: 'bg-gray-100 text-gray-600',
    Expired: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>

      {status}
    </span>);

};
export function VisitorManagement() {
  const [tab, setTab] = useState('log');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visitor Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all campus visitors securely
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <LogInIcon className="w-4 h-4 mr-2" />
            Check In
          </Button>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Visitor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Currently Inside',
          value: '3',
          color: 'text-green-600'
        },
        {
          label: "Today's Visitors",
          value: '18',
          color: 'text-blue-600'
        },
        {
          label: 'Gate Passes Issued',
          value: '15',
          color: 'text-purple-600'
        },
        {
          label: 'Avg. Visit Duration',
          value: '42 min',
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
        <Tabs defaultValue="log" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="log">Visitor Entry Log</TabsTrigger>
            <TabsTrigger value="gatepass">Gate Pass Management</TabsTrigger>
            <TabsTrigger value="idcard">ID Card Print</TabsTrigger>
            <TabsTrigger value="security">Security Check-in/out</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search visitors..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Input type="date" className="w-44" />
              <Button variant="outline">Export</Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Visitor ID'
              },
              {
                key: 'name',
                header: 'Name'
              },
              {
                key: 'purpose',
                header: 'Purpose'
              },
              {
                key: 'host',
                header: 'Whom to Meet'
              },
              {
                key: 'checkIn',
                header: 'Check In'
              },
              {
                key: 'checkOut',
                header: 'Check Out'
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
                r.status === 'Inside' ?
                <Button variant="outline" className="text-xs h-7 px-2">
                        <LogOutIcon className="w-3 h-3 mr-1" />
                        Check Out
                      </Button> :
                null
              }]
              }
              data={visitors} />

          </TabsContent>

          <TabsContent value="gatepass" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search gate passes..."
                    className="flex-1" />

                  <Button variant="primary">
                    <PlusIcon className="w-4 h-4 mr-2" />
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
                    key: 'visitor',
                    header: 'Visitor'
                  },
                  {
                    key: 'validFrom',
                    header: 'Valid From'
                  },
                  {
                    key: 'validTo',
                    header: 'Valid To'
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
                          <PrinterIcon className="w-3 h-3 mr-1" />
                          Print
                        </Button>

                  }]
                  }
                  data={gatePasses} />

              </div>
              <Card title="Issue New Gate Pass">
                <div className="space-y-3">
                  <Input label="Visitor Name" placeholder="Enter name" />
                  <Input label="Contact Number" placeholder="+91 XXXXX XXXXX" />
                  <Input
                    label="Purpose of Visit"
                    placeholder="Reason for visit" />

                  <Input
                    label="Whom to Meet"
                    placeholder="Teacher / Department" />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Valid From" type="time" />
                    <Input label="Valid To" type="time" />
                  </div>
                  <Button variant="primary" className="w-full">
                    Issue Gate Pass
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="idcard" className="p-5">
            <Card title="Visitor ID Card Generator">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input label="Visitor Name" placeholder="Enter full name" />
                  <Input label="Contact Number" placeholder="+91 XXXXX XXXXX" />
                  <Input
                    label="Organization / Address"
                    placeholder="Company or address" />

                  <Select
                    label="Visit Purpose"
                    options={[
                    {
                      value: 'meeting',
                      label: 'Meeting'
                    },
                    {
                      value: 'admission',
                      label: 'Admission'
                    },
                    {
                      value: 'delivery',
                      label: 'Delivery'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <Input label="Valid Date" type="date" />
                  <Button variant="primary" className="w-full">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Generate & Print ID Card
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50">
                  <div className="w-full max-w-xs bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
                    <div className="text-center mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-2">
                        <span className="text-blue-600 font-bold text-lg">
                          V
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        VISITOR PASS
                      </p>
                      <p className="text-xs text-gray-500">
                        Sunrise International School
                      </p>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>
                        <span className="font-medium">Name:</span> [Visitor
                        Name]
                      </p>
                      <p>
                        <span className="font-medium">Purpose:</span> [Purpose]
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> [Date]
                      </p>
                      <p>
                        <span className="font-medium">Valid Till:</span> [Time]
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Preview</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Quick Check-in">
                <div className="space-y-3">
                  <Input label="Visitor Name" placeholder="Enter name" />
                  <Input label="Phone Number" placeholder="+91 XXXXX XXXXX" />
                  <Input
                    label="Vehicle Number (Optional)"
                    placeholder="GJ-XX-XXXX" />

                  <Select
                    label="Entry Gate"
                    options={[
                    {
                      value: 'main',
                      label: 'Main Gate'
                    },
                    {
                      value: 'side',
                      label: 'Side Gate'
                    },
                    {
                      value: 'back',
                      label: 'Back Gate'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    <LogInIcon className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                </div>
              </Card>
              <Card title="Currently Inside">
                <div className="space-y-2">
                  {visitors.
                  filter((v) => v.status === 'Inside').
                  map((v, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {v.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {v.purpose} • In since {v.checkIn}
                          </p>
                        </div>
                        <Button
                      variant="outline"
                      className="text-xs h-7 px-2 border-green-300 text-green-700">

                          <LogOutIcon className="w-3 h-3 mr-1" />
                          Out
                        </Button>
                      </div>
                  )}
                  {visitors.filter((v) => v.status === 'Inside').length ===
                  0 &&
                  <p className="text-center text-gray-400 py-4 text-sm">
                      No visitors currently inside
                    </p>
                  }
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}