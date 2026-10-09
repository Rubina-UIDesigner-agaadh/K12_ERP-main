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
  WrenchIcon,
  MonitorIcon,
  TruckIcon } from
'lucide-react';
const infraRequests = [
{
  id: 'MR-001',
  location: 'Classroom 8-A',
  issue: 'Broken window pane',
  reportedBy: 'Mrs. Sharma',
  date: '2025-06-10',
  priority: 'Medium',
  status: 'Open'
},
{
  id: 'MR-002',
  location: 'Playground',
  issue: 'Damaged bench',
  reportedBy: 'Sports Teacher',
  date: '2025-06-09',
  priority: 'Low',
  status: 'In Progress'
},
{
  id: 'MR-003',
  location: 'Washroom Block B',
  issue: 'Leaking tap',
  reportedBy: 'Peon',
  date: '2025-06-08',
  priority: 'High',
  status: 'Resolved'
}];

const itRequests = [
{
  id: 'IT-001',
  location: 'Computer Lab',
  issue: 'Internet not working',
  reportedBy: 'Mr. Verma',
  date: '2025-06-10',
  priority: 'High',
  status: 'In Progress'
},
{
  id: 'IT-002',
  location: 'Classroom 10-B',
  issue: 'Projector bulb fused',
  reportedBy: 'Mrs. Patel',
  date: '2025-06-09',
  priority: 'Medium',
  status: 'Open'
}];

const transportRequests = [
{
  id: 'TR-001',
  vehicle: 'Bus No. 3',
  issue: 'AC not working',
  reportedBy: 'Driver Ramesh',
  date: '2025-06-10',
  priority: 'Medium',
  status: 'Open'
},
{
  id: 'TR-002',
  vehicle: 'Bus No. 1',
  issue: 'Tyre puncture',
  reportedBy: 'Driver Suresh',
  date: '2025-06-09',
  priority: 'High',
  status: 'Resolved'
}];

const priorityBadge = (p: string) => {
  const c: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[p] || 'bg-gray-100 text-gray-600'}`}>

      {p}
    </span>);

};
const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-orange-100 text-orange-700',
    Resolved: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
export function MaintenanceRequests() {
  const [tab, setTab] = useState('infrastructure');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track infrastructure, IT support and transport maintenance requests
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Infrastructure',
          value: '5',
          icon: WrenchIcon,
          color: 'text-orange-600',
          bg: 'bg-orange-50'
        },
        {
          label: 'IT Support',
          value: '3',
          icon: MonitorIcon,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        },
        {
          label: 'Transport',
          value: '2',
          icon: TruckIcon,
          color: 'text-green-600',
          bg: 'bg-green-50'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="flex items-center gap-3 p-1">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label} Open</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="infrastructure" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="it">IT Support</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
          </TabsList>

          <TabsContent value="infrastructure" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search requests..."
                    leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                    className="flex-1" />

                  <Select
                    options={[
                    {
                      value: 'all',
                      label: 'All Status'
                    },
                    {
                      value: 'open',
                      label: 'Open'
                    },
                    {
                      value: 'inprogress',
                      label: 'In Progress'
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
                    key: 'location',
                    header: 'Location'
                  },
                  {
                    key: 'issue',
                    header: 'Issue'
                  },
                  {
                    key: 'priority',
                    header: 'Priority',
                    render: (r) => priorityBadge(r.priority)
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
                  data={infraRequests} />

              </div>
              <Card title="Log Infrastructure Issue">
                <div className="space-y-3">
                  <Input
                    label="Location / Room"
                    placeholder="e.g. Classroom 8-A" />

                  <Select
                    label="Issue Type"
                    options={[
                    {
                      value: 'electrical',
                      label: 'Electrical'
                    },
                    {
                      value: 'plumbing',
                      label: 'Plumbing'
                    },
                    {
                      value: 'furniture',
                      label: 'Furniture'
                    },
                    {
                      value: 'civil',
                      label: 'Civil/Structure'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Description
                    </label>
                    <Textarea placeholder="Describe the issue..." rows={3} />
                  </div>
                  <Select
                    label="Priority"
                    options={[
                    {
                      value: 'high',
                      label: 'High'
                    },
                    {
                      value: 'medium',
                      label: 'Medium'
                    },
                    {
                      value: 'low',
                      label: 'Low'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    Submit Request
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="it" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Table
                  columns={[
                  {
                    key: 'id',
                    header: 'ID'
                  },
                  {
                    key: 'location',
                    header: 'Location'
                  },
                  {
                    key: 'issue',
                    header: 'Issue'
                  },
                  {
                    key: 'priority',
                    header: 'Priority',
                    render: (r) => priorityBadge(r.priority)
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
                  data={itRequests} />

              </div>
              <Card title="Log IT Support Request">
                <div className="space-y-3">
                  <Input
                    label="Location / Lab"
                    placeholder="e.g. Computer Lab" />

                  <Select
                    label="Issue Type"
                    options={[
                    {
                      value: 'network',
                      label: 'Network/Internet'
                    },
                    {
                      value: 'hardware',
                      label: 'Hardware'
                    },
                    {
                      value: 'software',
                      label: 'Software'
                    },
                    {
                      value: 'projector',
                      label: 'Projector/AV'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <Input
                    label="Device/Asset ID (if applicable)"
                    placeholder="Asset tag number" />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Description
                    </label>
                    <Textarea placeholder="Describe the IT issue..." rows={3} />
                  </div>
                  <Select
                    label="Priority"
                    options={[
                    {
                      value: 'high',
                      label: 'High'
                    },
                    {
                      value: 'medium',
                      label: 'Medium'
                    },
                    {
                      value: 'low',
                      label: 'Low'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    Submit IT Request
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Table
                  columns={[
                  {
                    key: 'id',
                    header: 'ID'
                  },
                  {
                    key: 'vehicle',
                    header: 'Vehicle'
                  },
                  {
                    key: 'issue',
                    header: 'Issue'
                  },
                  {
                    key: 'reportedBy',
                    header: 'Reported By'
                  },
                  {
                    key: 'priority',
                    header: 'Priority',
                    render: (r) => priorityBadge(r.priority)
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={transportRequests} />

              </div>
              <Card title="Log Transport Issue">
                <div className="space-y-3">
                  <Select
                    label="Vehicle"
                    options={[
                    {
                      value: 'bus1',
                      label: 'Bus No. 1'
                    },
                    {
                      value: 'bus2',
                      label: 'Bus No. 2'
                    },
                    {
                      value: 'bus3',
                      label: 'Bus No. 3'
                    },
                    {
                      value: 'van1',
                      label: 'Van No. 1'
                    }]
                    } />

                  <Select
                    label="Issue Type"
                    options={[
                    {
                      value: 'mechanical',
                      label: 'Mechanical'
                    },
                    {
                      value: 'electrical',
                      label: 'Electrical'
                    },
                    {
                      value: 'tyre',
                      label: 'Tyre'
                    },
                    {
                      value: 'ac',
                      label: 'AC/Cooling'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe the transport issue..."
                      rows={3} />

                  </div>
                  <Select
                    label="Priority"
                    options={[
                    {
                      value: 'high',
                      label: 'High - Vehicle unusable'
                    },
                    {
                      value: 'medium',
                      label: 'Medium - Partial issue'
                    },
                    {
                      value: 'low',
                      label: 'Low - Minor issue'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    Submit Transport Request
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}