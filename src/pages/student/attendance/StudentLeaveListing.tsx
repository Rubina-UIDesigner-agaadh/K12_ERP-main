import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Filter, CheckCircle, XCircle, Eye } from 'lucide-react';
export function StudentLeaveListing() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const leaves = [
  {
    id: '1',
    student: 'Rahul Sharma',
    class: '10-A',
    type: 'Sick Leave',
    from: '2024-03-10',
    to: '2024-03-12',
    days: 3,
    status: 'Pending',
    appliedOn: '2024-03-09'
  },
  {
    id: '2',
    student: 'Priya Patel',
    class: '9-B',
    type: 'Casual Leave',
    from: '2024-03-15',
    to: '2024-03-15',
    days: 1,
    status: 'Approved',
    appliedOn: '2024-03-10'
  },
  {
    id: '3',
    student: 'Amit Kumar',
    class: '10-A',
    type: 'Emergency',
    from: '2024-03-01',
    to: '2024-03-05',
    days: 5,
    status: 'Rejected',
    appliedOn: '2024-02-28'
  }];

  const columns = [
  {
    key: 'student',
    header: 'Student Name',
    render: (row: any) =>
    <div>
          <div className="font-medium text-gray-900">{row.student}</div>
          <div className="text-xs text-gray-500">{row.class}</div>
        </div>

  },
  {
    key: 'type',
    header: 'Leave Type',
    render: (row: any) => <span className="text-sm">{row.type}</span>
  },
  {
    key: 'dates',
    header: 'Duration',
    render: (row: any) =>
    <div className="text-sm">
          <div>
            {row.from} to {row.to}
          </div>
          <div className="text-xs text-gray-500">{row.days} Days</div>
        </div>

  },
  {
    key: 'applied',
    header: 'Applied On',
    render: (row: any) =>
    <span className="text-sm text-gray-500">{row.appliedOn}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge
      variant={
      row.status === 'Approved' ?
      'success' :
      row.status === 'Rejected' ?
      'danger' :
      'warning'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm" title="View Details">
            <Eye className="w-4 h-4" />
          </Button>
          {row.status === 'Pending' &&
      <>
              <Button
          variant="ghost"
          size="sm"
          title="Approve"
          className="text-green-600">

                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
          variant="ghost"
          size="sm"
          title="Reject"
          className="text-red-600">

                <XCircle className="w-4 h-4" />
              </Button>
            </>
      }
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Leave Listing
          </h1>
          <p className="text-sm text-gray-500">
            Manage and approve student leave applications
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select
            label="Department"
            options={[
            {
              value: 'all',
              label: 'All Department'
            },
            {
              value: 'A',
              label: 'Science'
            },
            {
              value: 'B',
              label: 'Arts'
            },
            {
              value: 'B',
              label: 'Commerce'
            }]
            }
            placeholder="Select Department" />


          {/* Class Filter */}
          <Select
            label="Class"
            value={selectedClass}
            onChange={setSelectedClass}
            options={[
            {
              value: '9',
              label: 'Class 9'
            },
            {
              value: '10',
              label: 'Class 10'
            },
            {
              value: '11',
              label: 'Class 11'
            },
            {
              value: '12',
              label: 'Class 12'
            }]
            }
            placeholder="Class" />


          {/* Section Filter */}
          <Select
            label="Section"
            value={selectedSection}
            onChange={setSelectedSection}
            options={[
            {
              value: 'A',
              label: 'Section A'
            },
            {
              value: 'B',
              label: 'Section B'
            },
            {
              value: 'C',
              label: 'Section C'
            },
            {
              value: 'D',
              label: 'Section D'
            }]
            }
            placeholder="Section" />


          <Select
            label="Status"
            options={[
            {
              value: 'pending',
              label: 'Pending'
            },
            {
              value: 'approved',
              label: 'Approved'
            },
            {
              value: 'rejected',
              label: 'Rejected'
            }]
            } />

          <Input type="date" label="From Date" />
          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        <Table columns={columns} data={leaves} />
      </Card>
    </div>);

}