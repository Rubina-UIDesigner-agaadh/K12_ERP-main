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
  DownloadIcon,
  CheckCircleIcon,
  FileTextIcon,
  UploadIcon,
  UserPlusIcon } from
'lucide-react';
const inquiries = [
{
  id: 'INQ-001',
  name: 'Arjun Sharma',
  class: 'Class 6',
  date: '2025-06-01',
  source: 'Walk-in',
  status: 'Pending'
},
{
  id: 'INQ-002',
  name: 'Priya Patel',
  class: 'Class 9',
  date: '2025-06-02',
  source: 'Website',
  status: 'Contacted'
},
{
  id: 'INQ-003',
  name: 'Rohan Mehta',
  class: 'Class 1',
  date: '2025-06-03',
  source: 'Referral',
  status: 'Form Issued'
},
{
  id: 'INQ-004',
  name: 'Sneha Gupta',
  class: 'Class 11',
  date: '2025-06-04',
  source: 'Phone',
  status: 'Pending'
}];

const admissionForms = [
{
  id: 'ADM-101',
  name: 'Arjun Sharma',
  class: 'Class 6',
  submitted: '2025-06-05',
  mode: 'Online',
  status: 'Under Review'
},
{
  id: 'ADM-102',
  name: 'Kavya Nair',
  class: 'Class 3',
  submitted: '2025-06-04',
  mode: 'Offline',
  status: 'Approved'
},
{
  id: 'ADM-103',
  name: 'Rahul Singh',
  class: 'Class 8',
  submitted: '2025-06-03',
  mode: 'Online',
  status: 'Pending Docs'
}];

const documents = [
{
  student: 'Arjun Sharma',
  doc: 'Birth Certificate',
  uploaded: true,
  verified: false
},
{
  student: 'Arjun Sharma',
  doc: 'Transfer Certificate',
  uploaded: true,
  verified: true
},
{
  student: 'Arjun Sharma',
  doc: 'Aadhaar Card',
  uploaded: false,
  verified: false
},
{
  student: 'Kavya Nair',
  doc: 'Birth Certificate',
  uploaded: true,
  verified: true
},
{
  student: 'Kavya Nair',
  doc: 'Medical Certificate',
  uploaded: true,
  verified: true
}];

const enrollments = [
{
  rollNo: '2025-001',
  name: 'Kavya Nair',
  class: 'Class 3',
  section: 'A',
  admDate: '2025-06-10',
  status: 'Enrolled'
},
{
  rollNo: '2025-002',
  name: 'Rahul Singh',
  class: 'Class 8',
  section: 'B',
  admDate: '2025-06-11',
  status: 'Enrolled'
}];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Contacted: 'bg-blue-100 text-blue-700',
    'Form Issued': 'bg-purple-100 text-purple-700',
    Approved: 'bg-green-100 text-green-700',
    'Under Review': 'bg-orange-100 text-orange-700',
    'Pending Docs': 'bg-red-100 text-red-700',
    Enrolled: 'bg-green-100 text-green-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>

      {status}
    </span>);

};
export function AdmissionManagement() {
  const [tab, setTab] = useState('inquiry');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admission Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the complete admission lifecycle from inquiry to enrollment
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Inquiry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Inquiries',
          value: '124',
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        },
        {
          label: 'Forms Submitted',
          value: '87',
          color: 'text-purple-600',
          bg: 'bg-purple-50'
        },
        {
          label: 'Under Review',
          value: '34',
          color: 'text-orange-600',
          bg: 'bg-orange-50'
        },
        {
          label: 'Enrolled',
          value: '52',
          color: 'text-green-600',
          bg: 'bg-green-50'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className={`text-center p-1`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="inquiry" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="inquiry">Inquiry Registration</TabsTrigger>
            <TabsTrigger value="prospectus">Prospectus</TabsTrigger>
            <TabsTrigger value="forms">Admission Forms</TabsTrigger>
            <TabsTrigger value="documents">Document Upload</TabsTrigger>
            <TabsTrigger value="workflow">Approval Workflow</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiry" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search inquiries..."
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
                  value: 'contacted',
                  label: 'Contacted'
                }]
                }
                className="w-40" />

              <Button variant="outline">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Inquiry ID'
              },
              {
                key: 'name',
                header: 'Student Name'
              },
              {
                key: 'class',
                header: 'Class Sought'
              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'source',
                header: 'Source'
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => statusBadge(r.status)
              },
              {
                key: 'actions',
                header: 'Actions',
                render: () =>
                <Button variant="ghost" className="text-xs h-7 px-2">
                      Follow Up
                    </Button>

              }]
              }
              data={inquiries} />

          </TabsContent>

          <TabsContent value="prospectus" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Prospectus Management">
                <div className="space-y-3">
                  {[
                  {
                    name: 'Prospectus 2025-26',
                    type: 'PDF',
                    size: '2.4 MB',
                    downloads: 234
                  },
                  {
                    name: 'Fee Structure 2025-26',
                    type: 'PDF',
                    size: '0.8 MB',
                    downloads: 189
                  },
                  {
                    name: 'Admission Brochure',
                    type: 'PDF',
                    size: '5.1 MB',
                    downloads: 312
                  }].
                  map((doc, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div className="flex items-center gap-3">
                        <FileTextIcon className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {doc.type} • {doc.size} • {doc.downloads} downloads
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-xs h-7 px-2">
                          View
                        </Button>
                        <Button variant="ghost" className="text-xs h-7 px-2">
                          Replace
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-2">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload New Document
                  </Button>
                </div>
              </Card>
              <Card title="Issue Prospectus">
                <div className="space-y-4">
                  <Input
                    label="Student / Parent Name"
                    placeholder="Enter name" />

                  <Input label="Contact Number" placeholder="+91 XXXXX XXXXX" />
                  <Select
                    label="Class Interested In"
                    options={[
                    {
                      value: '',
                      label: 'Select class'
                    },
                    {
                      value: '1',
                      label: 'Class 1'
                    },
                    {
                      value: '6',
                      label: 'Class 6'
                    },
                    {
                      value: '9',
                      label: 'Class 9'
                    }]
                    } />

                  <Select
                    label="Delivery Method"
                    options={[
                    {
                      value: 'email',
                      label: 'Email'
                    },
                    {
                      value: 'whatsapp',
                      label: 'WhatsApp'
                    },
                    {
                      value: 'print',
                      label: 'Print Copy'
                    }]
                    } />

                  <Button variant="primary" className="w-full">
                    Issue Prospectus
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search forms..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Modes'
                },
                {
                  value: 'online',
                  label: 'Online'
                },
                {
                  value: 'offline',
                  label: 'Offline'
                }]
                }
                className="w-40" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                New Form
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Form No.'
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
                key: 'submitted',
                header: 'Submitted On'
              },
              {
                key: 'mode',
                header: 'Mode',
                render: (r) =>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.mode === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>

                      {r.mode}
                    </span>

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
                      Review
                    </Button>

              }]
              }
              data={admissionForms} />

          </TabsContent>

          <TabsContent value="documents" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search by student..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Documents'
                },
                {
                  value: 'pending',
                  label: 'Pending Verification'
                },
                {
                  value: 'verified',
                  label: 'Verified'
                }]
                }
                className="w-48" />

            </div>
            <Table
              columns={[
              {
                key: 'student',
                header: 'Student Name'
              },
              {
                key: 'doc',
                header: 'Document Type'
              },
              {
                key: 'uploaded',
                header: 'Uploaded',
                render: (r) =>
                r.uploaded ?
                <span className="text-green-600 font-medium text-xs">
                        ✓ Yes
                      </span> :

                <span className="text-red-500 text-xs">✗ No</span>

              },
              {
                key: 'verified',
                header: 'Verified',
                render: (r) =>
                r.verified ?
                <span className="text-green-600 font-medium text-xs">
                        ✓ Verified
                      </span> :

                <span className="text-yellow-600 text-xs">Pending</span>

              },
              {
                key: 'actions',
                header: '',
                render: (r) =>
                !r.verified && r.uploaded ?
                <Button
                  variant="ghost"
                  className="text-xs h-7 px-2 text-green-600">

                        Verify
                      </Button> :
                null
              }]
              }
              data={documents} />

          </TabsContent>

          <TabsContent value="workflow" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
              {
                stage: 'Form Review',
                count: 12,
                color: 'border-blue-400 bg-blue-50'
              },
              {
                stage: 'Document Verification',
                count: 8,
                color: 'border-orange-400 bg-orange-50'
              },
              {
                stage: 'Principal Approval',
                count: 5,
                color: 'border-purple-400 bg-purple-50'
              }].
              map((s, i) =>
              <div key={i} className={`border-l-4 rounded-lg p-4 ${s.color}`}>
                  <p className="text-sm font-semibold text-gray-700">
                    {s.stage}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {s.count}
                  </p>
                  <p className="text-xs text-gray-500">applications pending</p>
                </div>
              )}
            </div>
            <Card title="Pending Approvals">
              <Table
                columns={[
                {
                  key: 'id',
                  header: 'Form No.'
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
                  key: 'submitted',
                  header: 'Submitted'
                },
                {
                  key: 'status',
                  header: 'Stage',
                  render: (r) => statusBadge(r.status)
                },
                {
                  key: 'actions',
                  header: '',
                  render: () =>
                  <div className="flex gap-1">
                        <Button variant="primary" className="text-xs h-7 px-2">
                          Approve
                        </Button>
                        <Button variant="outline" className="text-xs h-7 px-2">
                          Reject
                        </Button>
                      </div>

                }]
                }
                data={admissionForms} />

            </Card>
          </TabsContent>

          <TabsContent value="enrollment" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Search enrolled students..."
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="flex-1" />

              <Button variant="primary">
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Enroll Student
              </Button>
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
                key: 'section',
                header: 'Section'
              },
              {
                key: 'admDate',
                header: 'Admission Date'
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
                      ID Card
                    </Button>

              }]
              }
              data={enrollments} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}