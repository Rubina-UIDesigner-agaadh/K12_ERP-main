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
import { DownloadIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
export function ComplianceGovernmentData() {
  const [tab, setTab] = useState('udise');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compliance & Government Data
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            UDISE data, EWS tracking and RTE compliance management
          </p>
        </div>
        <Button variant="outline">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="udise" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="udise">UDISE Data</TabsTrigger>
            <TabsTrigger value="ews">EWS Tracking</TabsTrigger>
            <TabsTrigger value="rte">RTE Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="udise" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="UDISE+ Data Summary">
                <div className="space-y-3">
                  {[
                  {
                    label: 'UDISE Code',
                    value: 'GJ24010001234'
                  },
                  {
                    label: 'School Name',
                    value: 'Sunrise International School'
                  },
                  {
                    label: 'Academic Year',
                    value: '2024-25'
                  },
                  {
                    label: 'Total Enrollment',
                    value: '1,248'
                  },
                  {
                    label: 'Boys Enrollment',
                    value: '634'
                  },
                  {
                    label: 'Girls Enrollment',
                    value: '614'
                  },
                  {
                    label: 'SC Students',
                    value: '48'
                  },
                  {
                    label: 'ST Students',
                    value: '22'
                  },
                  {
                    label: 'OBC Students',
                    value: '312'
                  },
                  {
                    label: 'Total Teachers',
                    value: '52'
                  },
                  {
                    label: 'Last Submitted',
                    value: '2024-09-30'
                  },
                  {
                    label: 'Submission Status',
                    value: 'Submitted'
                  }].
                  map((r, i) =>
                  <div
                    key={i}
                    className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">

                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span
                      className={`text-sm font-semibold ${r.label === 'Submission Status' ? 'text-green-600' : 'text-gray-800'}`}>

                        {r.value}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="primary" className="w-full mt-4">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download UDISE Report
                </Button>
              </Card>
              <Card title="Update UDISE Data">
                <div className="space-y-3">
                  <Select
                    label="Academic Year"
                    options={[
                    {
                      value: '2024-25',
                      label: '2024-25'
                    },
                    {
                      value: '2025-26',
                      label: '2025-26'
                    }]
                    } />

                  <Input
                    label="Total Enrollment"
                    type="number"
                    defaultValue="1248" />

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Boys" type="number" defaultValue="634" />
                    <Input label="Girls" type="number" defaultValue="614" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="SC" type="number" defaultValue="48" />
                    <Input label="ST" type="number" defaultValue="22" />
                    <Input label="OBC" type="number" defaultValue="312" />
                  </div>
                  <Input
                    label="Total Teachers"
                    type="number"
                    defaultValue="52" />

                  <Button variant="primary" className="w-full">
                    Update & Submit UDISE
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ews" className="p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
              {
                label: 'EWS Seats Available',
                value: '62',
                color: 'text-blue-600'
              },
              {
                label: 'EWS Enrolled',
                value: '58',
                color: 'text-green-600'
              },
              {
                label: 'Pending Verification',
                value: '4',
                color: 'text-orange-600'
              },
              {
                label: 'Scholarship Disbursed',
                value: '54',
                color: 'text-purple-600'
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
                key: 'category',
                header: 'Category'
              },
              {
                key: 'incomeProof',
                header: 'Income Proof',
                render: (r) =>
                r.incomeProof ?
                <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3" />
                        Verified
                      </span> :

                <span className="text-orange-500 text-xs flex items-center gap-1">
                        <AlertCircleIcon className="w-3 h-3" />
                        Pending
                      </span>

              },
              {
                key: 'scholarship',
                header: 'Scholarship',
                render: (r) =>
                r.scholarship ?
                <span className="text-green-600 text-xs font-medium">
                        Disbursed
                      </span> :

                <span className="text-gray-400 text-xs">Pending</span>

              }]
              }
              data={[
              {
                rollNo: '2024-EWS-001',
                name: 'Raju Sharma',
                class: 'Class 6-A',
                category: 'EWS',
                incomeProof: true,
                scholarship: true
              },
              {
                rollNo: '2024-EWS-002',
                name: 'Meena Patel',
                class: 'Class 7-B',
                category: 'EWS',
                incomeProof: true,
                scholarship: true
              },
              {
                rollNo: '2024-EWS-003',
                name: 'Suresh Kumar',
                class: 'Class 8-A',
                category: 'EWS',
                incomeProof: false,
                scholarship: false
              }]
              } />

          </TabsContent>

          <TabsContent value="rte" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="RTE Compliance Checklist">
                <div className="space-y-2">
                  {[
                  {
                    item: '25% EWS/DG seats filled',
                    status: true
                  },
                  {
                    item: 'Student-Teacher ratio ≤ 30:1',
                    status: true
                  },
                  {
                    item: 'No detention policy (Class 1-8)',
                    status: true
                  },
                  {
                    item: 'Free textbooks provided',
                    status: true
                  },
                  {
                    item: 'Midday meal program',
                    status: false
                  },
                  {
                    item: 'Barrier-free access',
                    status: true
                  },
                  {
                    item: 'Separate toilets for boys/girls',
                    status: true
                  },
                  {
                    item: 'Playground available',
                    status: true
                  },
                  {
                    item: 'Library with books',
                    status: true
                  },
                  {
                    item: 'Annual school calendar submitted',
                    status: true
                  }].
                  map((item, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">

                      {item.status ?
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" /> :

                    <AlertCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
                    }
                      <span
                      className={`text-sm ${item.status ? 'text-gray-700' : 'text-red-600 font-medium'}`}>

                        {item.item}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="RTE Summary">
                <div className="space-y-3">
                  {[
                  {
                    label: 'Compliance Score',
                    value: '90%',
                    color: 'text-green-600'
                  },
                  {
                    label: 'Items Compliant',
                    value: '9/10',
                    color: 'text-green-600'
                  },
                  {
                    label: 'Non-compliant Items',
                    value: '1',
                    color: 'text-red-600'
                  },
                  {
                    label: 'Last Audit Date',
                    value: '2025-03-15',
                    color: 'text-gray-700'
                  },
                  {
                    label: 'Next Audit Due',
                    value: '2025-09-15',
                    color: 'text-blue-600'
                  }].
                  map((r, i) =>
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-gray-50 last:border-0">

                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span className={`text-sm font-semibold ${r.color}`}>
                        {r.value}
                      </span>
                    </div>
                  )}
                  <Button variant="primary" className="w-full mt-2">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download RTE Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}