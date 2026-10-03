import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Phone, MessageSquare, CheckSquare, Search } from 'lucide-react';
export function AttendanceFollowUp() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const students = [
  {
    id: '1',
    name: 'Rohan Gupta',
    class: '8-C',
    absentDays: 5,
    consecutive: 3,
    lastPresent: '2024-03-08',
    parentName: 'Suresh Gupta',
    contact: '9876543210',
    lastFollowUp: '2024-03-10 (Call)',
    status: 'Pending'
  },
  {
    id: '2',
    name: 'Sneha Singh',
    class: '9-A',
    absentDays: 8,
    consecutive: 2,
    lastPresent: '2024-03-05',
    parentName: 'Raj Singh',
    contact: '9876543211',
    lastFollowUp: 'None',
    status: 'Critical'
  }];

  const columns = [
  {
    key: 'student',
    header: 'Student Details',
    render: (row: any) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.class}</div>
        </div>

  },
  {
    key: 'absence',
    header: 'Absence Stats',
    render: (row: any) =>
    <div className="text-sm">
          <div className="text-red-600 font-medium">
            {row.absentDays} Days Total
          </div>
          <div className="text-xs text-gray-500">
            {row.consecutive} Consecutive
          </div>
        </div>

  },
  {
    key: 'parent',
    header: 'Parent Contact',
    render: (row: any) =>
    <div className="text-sm">
          <div>{row.parentName}</div>
          <div className="text-blue-600">{row.contact}</div>
        </div>

  },
  {
    key: 'followup',
    header: 'Last Follow-up',
    render: (row: any) =>
    <span className="text-sm text-gray-600">{row.lastFollowUp}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge variant={row.status === 'Critical' ? 'danger' : 'warning'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm" title="Call Parent">
            <Phone className="w-4 h-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Send SMS">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" title="Mark Resolved">
            <CheckSquare className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Follow Up
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage student absenteeism
          </p>
        </div>
        <Button variant="primary">
          <MessageSquare className="w-4 h-4 mr-2" />
          Bulk SMS Reminder
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search Student..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

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
            label="Absence Criteria"
            options={[
            {
              value: '3days',
              label: '> 3 Days'
            },
            {
              value: '5days',
              label: '> 5 Days'
            },
            {
              value: 'consecutive',
              label: 'Consecutive Absence'
            }]
            } />

          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              Filter List
            </Button>
          </div>
        </div>

        <Table columns={columns} data={students} />
      </Card>
    </div>);

}