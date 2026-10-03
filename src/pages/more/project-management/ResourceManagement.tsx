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
import { PlusIcon, UsersIcon, PackageIcon } from 'lucide-react';
const staffAllocations = [
{
  id: 'SA-001',
  staff: 'Mr. Sharma',
  role: 'Project Lead',
  project: 'Science Lab Setup',
  allocation: '80%',
  from: '2025-06-01',
  to: '2025-08-31',
  status: 'Active'
},
{
  id: 'SA-002',
  staff: 'Mrs. Patel',
  role: 'Event Coordinator',
  project: 'Annual Day 2025',
  allocation: '60%',
  from: '2025-06-15',
  to: '2025-07-05',
  status: 'Active'
},
{
  id: 'SA-003',
  staff: 'Mr. Verma',
  role: 'IT Lead',
  project: 'Smart Classroom',
  allocation: '100%',
  from: '2025-05-01',
  to: '2025-07-31',
  status: 'Active'
}];

const resources = [
{
  id: 'RES-001',
  name: 'Projector',
  type: 'Equipment',
  project: 'Annual Day 2025',
  bookedFrom: '2025-07-04',
  bookedTo: '2025-07-05',
  status: 'Booked'
},
{
  id: 'RES-002',
  name: 'School Hall',
  type: 'Venue',
  project: 'Annual Day 2025',
  bookedFrom: '2025-07-05',
  bookedTo: '2025-07-05',
  status: 'Booked'
},
{
  id: 'RES-003',
  name: 'Sound System',
  type: 'Equipment',
  project: 'Annual Day 2025',
  bookedFrom: '2025-07-05',
  bookedTo: '2025-07-05',
  status: 'Pending'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Active: 'bg-green-100 text-green-700',
    Booked: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Available: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function ResourceManagement() {
  const [tab, setTab] = useState('staff');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resource Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Staff allocation, resource booking and progress tracking
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Allocate Resource
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="staff" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="staff">Staff Allocation</TabsTrigger>
            <TabsTrigger value="booking">Resource Booking</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Table
                  columns={[
                  {
                    key: 'staff',
                    header: 'Staff'
                  },
                  {
                    key: 'role',
                    header: 'Role'
                  },
                  {
                    key: 'project',
                    header: 'Project'
                  },
                  {
                    key: 'allocation',
                    header: 'Allocation'
                  },
                  {
                    key: 'from',
                    header: 'From'
                  },
                  {
                    key: 'to',
                    header: 'To'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={staffAllocations} />

              </div>
              <Card title="Allocate Staff">
                <div className="space-y-3">
                  <Select
                    label="Project"
                    options={[
                    {
                      value: 'lab',
                      label: 'Science Lab Setup'
                    },
                    {
                      value: 'annual',
                      label: 'Annual Day 2025'
                    },
                    {
                      value: 'smart',
                      label: 'Smart Classroom'
                    }]
                    } />

                  <Input label="Staff Name" placeholder="Search staff member" />
                  <Input
                    label="Role in Project"
                    placeholder="e.g. Project Lead" />

                  <Select
                    label="Allocation (%)"
                    options={[
                    {
                      value: '25',
                      label: '25%'
                    },
                    {
                      value: '50',
                      label: '50%'
                    },
                    {
                      value: '75',
                      label: '75%'
                    },
                    {
                      value: '100',
                      label: '100%'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <Button variant="primary" className="w-full">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Allocate Staff
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="booking" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Table
                  columns={[
                  {
                    key: 'name',
                    header: 'Resource'
                  },
                  {
                    key: 'type',
                    header: 'Type'
                  },
                  {
                    key: 'project',
                    header: 'Project'
                  },
                  {
                    key: 'bookedFrom',
                    header: 'From'
                  },
                  {
                    key: 'bookedTo',
                    header: 'To'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={resources} />

              </div>
              <Card title="Book Resource">
                <div className="space-y-3">
                  <Select
                    label="Resource Type"
                    options={[
                    {
                      value: 'venue',
                      label: 'Venue'
                    },
                    {
                      value: 'equipment',
                      label: 'Equipment'
                    },
                    {
                      value: 'vehicle',
                      label: 'Vehicle'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <Input
                    label="Resource Name"
                    placeholder="e.g. School Hall, Projector" />

                  <Select
                    label="Project"
                    options={[
                    {
                      value: 'lab',
                      label: 'Science Lab Setup'
                    },
                    {
                      value: 'annual',
                      label: 'Annual Day 2025'
                    },
                    {
                      value: 'smart',
                      label: 'Smart Classroom'
                    }]
                    } />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <Button variant="primary" className="w-full">
                    <PackageIcon className="w-4 h-4 mr-2" />
                    Book Resource
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="p-5">
            <div className="space-y-4">
              {[
              {
                project: 'Science Lab Setup',
                progress: 65,
                tasks: {
                  total: 12,
                  done: 8
                },
                budget: {
                  total: 12,
                  spent: 7.8
                }
              },
              {
                project: 'Annual Day 2025',
                progress: 30,
                tasks: {
                  total: 20,
                  done: 6
                },
                budget: {
                  total: 1.5,
                  spent: 0.4
                }
              },
              {
                project: 'Smart Classroom',
                progress: 45,
                tasks: {
                  total: 15,
                  done: 7
                },
                budget: {
                  total: 8,
                  spent: 3.6
                }
              }].
              map((proj, i) =>
              <Card key={i} title={proj.project}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Overall Progress
                      </p>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
                        <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${proj.progress}%`
                        }} />

                      </div>
                      <p className="text-sm font-bold text-blue-600">
                        {proj.progress}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Tasks</p>
                      <p className="text-xl font-bold text-gray-900">
                        {proj.tasks.done}/{proj.tasks.total}
                      </p>
                      <p className="text-xs text-green-600">completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Budget Used</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{proj.budget.spent}L
                      </p>
                      <p className="text-xs text-gray-400">
                        of ₹{proj.budget.total}L
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}