import React, { useState, Fragment } from 'react';
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
  PackageIcon,
  CheckCircleIcon,
  DownloadIcon } from
'lucide-react';
const lostItems = [
{
  id: 'LI-001',
  item: 'School Bag',
  category: 'Bag',
  reportedBy: 'Arjun Sharma (Class 8-A)',
  date: '2025-06-08',
  location: 'Playground',
  status: 'Pending'
},
{
  id: 'LI-002',
  item: 'ID Card',
  category: 'ID Card',
  reportedBy: 'Priya Patel (Class 6-B)',
  date: '2025-06-09',
  location: 'Canteen',
  status: 'Claimed'
},
{
  id: 'LI-003',
  item: 'Water Bottle',
  category: 'Other',
  reportedBy: 'Rohan Mehta (Class 9-A)',
  date: '2025-06-10',
  location: 'Classroom 9A',
  status: 'Pending'
}];

const foundItems = [
{
  id: 'FI-001',
  item: 'Blue School Bag',
  category: 'Bag',
  foundBy: 'Security Guard',
  date: '2025-06-08',
  location: 'Main Gate',
  status: 'Unclaimed'
},
{
  id: 'FI-002',
  item: 'Student ID Card',
  category: 'ID Card',
  foundBy: 'Teacher - Mrs. Sharma',
  date: '2025-06-09',
  location: 'Staff Room',
  status: 'Claimed'
},
{
  id: 'FI-003',
  item: 'Calculator',
  category: 'Electronic',
  foundBy: 'Class Monitor',
  date: '2025-06-10',
  location: 'Library',
  status: 'Unclaimed'
}];

const claimRequests = [
{
  id: 'CR-001',
  itemId: 'FI-001',
  claimant: 'Arjun Sharma',
  class: 'Class 8-A',
  submittedOn: '2025-06-09',
  status: 'Pending Approval'
},
{
  id: 'CR-002',
  itemId: 'FI-002',
  claimant: 'Priya Patel',
  class: 'Class 6-B',
  submittedOn: '2025-06-09',
  status: 'Approved'
}];

const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Claimed: 'bg-green-100 text-green-700',
    Unclaimed: 'bg-blue-100 text-blue-700',
    Closed: 'bg-gray-100 text-gray-600',
    'Pending Approval': 'bg-orange-100 text-orange-700',
    Approved: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[s] || 'bg-gray-100 text-gray-600'}`}>

      {s}
    </span>);

};
const categories = [
'Bag',
'Books',
'ID Card',
'Uniform',
'Electronic',
'Water Bottle',
'Lunch Box',
'Other'];

export function LostFoundManagement() {
  const [tab, setTab] = useState('lost');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lost & Found Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track lost items, found items, claims and handovers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Report Lost
          </Button>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Log Found Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Lost Reports',
          value: '12',
          color: 'text-red-600'
        },
        {
          label: 'Found Items',
          value: '9',
          color: 'text-blue-600'
        },
        {
          label: 'Pending Claims',
          value: '4',
          color: 'text-orange-600'
        },
        {
          label: 'Returned',
          value: '7',
          color: 'text-green-600'
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
        <Tabs defaultValue="lost" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="lost">Lost Items</TabsTrigger>
            <TabsTrigger value="found">Found Items</TabsTrigger>
            <TabsTrigger value="claims">Claim Requests</TabsTrigger>
            <TabsTrigger value="tracker">Status Tracker</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search lost items..."
                    leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                    className="flex-1" />

                  <Select
                    options={[
                    {
                      value: 'all',
                      label: 'All Categories'
                    },
                    ...categories.map((c) => ({
                      value: c.toLowerCase(),
                      label: c
                    }))]
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
                    key: 'item',
                    header: 'Item'
                  },
                  {
                    key: 'category',
                    header: 'Category'
                  },
                  {
                    key: 'reportedBy',
                    header: 'Reported By'
                  },
                  {
                    key: 'date',
                    header: 'Date'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => statusBadge(r.status)
                  }]
                  }
                  data={lostItems} />

              </div>
              <Card title="Report Lost Item">
                <div className="space-y-3">
                  <Input label="Item Name" placeholder="Describe the item" />
                  <Select
                    label="Category"
                    options={categories.map((c) => ({
                      value: c.toLowerCase(),
                      label: c
                    }))} />

                  <Input
                    label="Student Name / Roll No."
                    placeholder="Who lost it?" />

                  <Input
                    label="Last Seen Location"
                    placeholder="Where was it last seen?" />

                  <Input label="Date Lost" type="date" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Additional details (color, brand, etc.)"
                      rows={3} />

                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 transition-colors">
                    <PackageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">
                      Upload item photo (optional)
                    </p>
                  </div>
                  <Button variant="primary" className="w-full">
                    Submit Lost Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="found" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search found items..."
                    leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                    className="flex-1" />

                  <Select
                    options={[
                    {
                      value: 'all',
                      label: 'All Status'
                    },
                    {
                      value: 'unclaimed',
                      label: 'Unclaimed'
                    },
                    {
                      value: 'claimed',
                      label: 'Claimed'
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
                    key: 'item',
                    header: 'Item'
                  },
                  {
                    key: 'category',
                    header: 'Category'
                  },
                  {
                    key: 'foundBy',
                    header: 'Found By'
                  },
                  {
                    key: 'location',
                    header: 'Location'
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
                    r.status === 'Unclaimed' ?
                    <Button variant="ghost" className="text-xs h-7 px-2">
                            Match
                          </Button> :
                    null
                  }]
                  }
                  data={foundItems} />

              </div>
              <Card title="Log Found Item">
                <div className="space-y-3">
                  <Input
                    label="Item Description"
                    placeholder="What was found?" />

                  <Select
                    label="Category"
                    options={categories.map((c) => ({
                      value: c.toLowerCase(),
                      label: c
                    }))} />

                  <Input label="Found By" placeholder="Name of finder" />
                  <Input
                    label="Found Location"
                    placeholder="Where was it found?" />

                  <Input label="Date Found" type="date" />
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 transition-colors">
                    <PackageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Upload item photo</p>
                  </div>
                  <Button variant="primary" className="w-full">
                    Log Found Item
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="claims" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search claims..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'pending',
                  label: 'Pending'
                },
                {
                  value: 'approved',
                  label: 'Approved'
                }]
                }
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Claim ID'
              },
              {
                key: 'itemId',
                header: 'Item Ref.'
              },
              {
                key: 'claimant',
                header: 'Claimant'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'submittedOn',
                header: 'Submitted On'
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
                r.status === 'Pending Approval' ?
                <div className="flex gap-1">
                        <Button variant="primary" className="text-xs h-7 px-2">
                          Approve
                        </Button>
                        <Button variant="outline" className="text-xs h-7 px-2">
                          Reject
                        </Button>
                      </div> :
                r.status === 'Approved' ?
                <Button
                  variant="ghost"
                  className="text-xs h-7 px-2 text-green-600">

                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Handover
                      </Button> :
                null
              }]
              }
              data={claimRequests} />

          </TabsContent>

          <TabsContent value="tracker" className="p-5">
            <div className="space-y-3">
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Search by item or student..."
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="flex-1" />

                <Select
                  options={[
                  {
                    value: 'all',
                    label: 'All Status'
                  },
                  {
                    value: 'pending',
                    label: 'Pending'
                  },
                  {
                    value: 'claimed',
                    label: 'Claimed'
                  },
                  {
                    value: 'closed',
                    label: 'Closed'
                  }]
                  }
                  className="w-40" />

              </div>
              {[
              {
                id: 'LI-001',
                item: 'School Bag',
                student: 'Arjun Sharma',
                date: '2025-06-08',
                status: 'Pending',
                steps: [true, false, false, false]
              },
              {
                id: 'LI-002',
                item: 'ID Card',
                student: 'Priya Patel',
                date: '2025-06-09',
                status: 'Claimed',
                steps: [true, true, true, false]
              }].
              map((item, i) =>
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.item}{' '}
                        <span className="text-gray-400 text-sm">
                          ({item.id})
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Reported by {item.student} on {item.date}
                      </p>
                    </div>
                    {statusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                  'Reported',
                  'Found Match',
                  'Claim Submitted',
                  'Handed Over'].
                  map((step, si) =>
                  <Fragment key={si}>
                        <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${item.steps[si] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>

                          {item.steps[si] ? '✓' : '○'} {step}
                        </div>
                        {si < 3 &&
                    <div
                      className={`flex-1 h-0.5 ${item.steps[si] && item.steps[si + 1] ? 'bg-green-400' : 'bg-gray-200'}`} />

                    }
                      </Fragment>
                  )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="report" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Generate Report">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="From Date" type="date" />
                    <Input label="To Date" type="date" />
                  </div>
                  <Select
                    label="Category Filter"
                    options={[
                    {
                      value: 'all',
                      label: 'All Categories'
                    },
                    ...categories.map((c) => ({
                      value: c.toLowerCase(),
                      label: c
                    }))]
                    } />

                  <Select
                    label="Status Filter"
                    options={[
                    {
                      value: 'all',
                      label: 'All Status'
                    },
                    {
                      value: 'pending',
                      label: 'Pending'
                    },
                    {
                      value: 'claimed',
                      label: 'Claimed'
                    },
                    {
                      value: 'closed',
                      label: 'Closed'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </Card>
              <Card title="Summary">
                <div className="space-y-3">
                  {[
                  {
                    label: 'Total Lost Reports (This Month)',
                    value: '12'
                  },
                  {
                    label: 'Items Found & Logged',
                    value: '9'
                  },
                  {
                    label: 'Successfully Returned',
                    value: '7'
                  },
                  {
                    label: 'Pending Resolution',
                    value: '5'
                  },
                  {
                    label: 'Most Common Category',
                    value: 'Bags (4 items)'
                  },
                  {
                    label: 'Most Common Location',
                    value: 'Playground'
                  }].
                  map((r, i) =>
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-gray-50 last:border-0">

                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {r.value}
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