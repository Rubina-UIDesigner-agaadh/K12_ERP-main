import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Calendar } from
'lucide-react';

// Mock Data Types
interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late';
  time: string;
}

export function DivisionRegister() {
  // State for filters
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Mock Data
  const students: Student[] = [
  {
    id: '1',
    rollNo: '01',
    name: 'Aarav Patel',
    status: 'Present',
    time: '08:15 AM'
  },
  {
    id: '2',
    rollNo: '02',
    name: 'Aditi Sharma',
    status: 'Present',
    time: '08:10 AM'
  },
  {
    id: '3',
    rollNo: '03',
    name: 'Arjun Kumar',
    status: 'Absent',
    time: '-'
  },
  {
    id: '4',
    rollNo: '04',
    name: 'Diya Singh',
    status: 'Late',
    time: '08:45 AM'
  },
  {
    id: '5',
    rollNo: '05',
    name: 'Ishaan Gupta',
    status: 'Present',
    time: '08:05 AM'
  },
  {
    id: '6',
    rollNo: '06',
    name: 'Kavya Reddy',
    status: 'Present',
    time: '08:20 AM'
  },
  {
    id: '7',
    rollNo: '07',
    name: 'Rohan Verma',
    status: 'Absent',
    time: '-'
  },
  {
    id: '8',
    rollNo: '08',
    name: 'Sanya Joshi',
    status: 'Present',
    time: '08:12 AM'
  }];


  // Table Columns Configuration
  const columns = [
  {
    key: 'rollNo',
    header: 'Roll No',
    render: (row: Student) =>
    <span className="font-mono text-sm">{row.rollNo}</span>

  },
  {
    key: 'name',
    header: 'Student Name',
    render: (row: Student) =>
    <span className="font-medium text-gray-900">{row.name}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Student) =>
    <Badge
      variant={
      row.status === 'Present' ?
      'success' :
      row.status === 'Absent' ?
      'danger' :
      'warning'
      }>

          {row.status === 'Present' && <CheckCircle className="w-3 h-3 mr-1" />}
          {row.status === 'Absent' && <XCircle className="w-3 h-3 mr-1" />}
          {row.status === 'Late' && <Clock className="w-3 h-3 mr-1" />}
          {row.status}
        </Badge>

  },
  {
    key: 'time',
    header: 'Entry Time',
    render: (row: Student) =>
    <span className="text-sm text-gray-600">{row.time}</span>

  }];


  // Statistics
  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.filter((s) => s.status === 'Absent').length;
  const lateCount = students.filter((s) => s.status === 'Late').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Division Register
          </h1>
          <p className="text-gray-500 mt-1">
            View class-wise attendance register
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Department Filter */}
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
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            }
            placeholder="Class" />


          {/* Section Filter */}
          <Select
            label="Section"
            value={selectedSection}
            onChange={setSelectedSection}
            options={[
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
            { value: 'D', label: 'Section D' }]
            }
            placeholder="Section" />


          {/* Date Filter */}
          <Input
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} />


          {/* Status Filter */}
          <Select
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
            { value: 'all', label: 'All Students' },
            { value: 'present', label: 'Present Only' },
            { value: 'absent', label: 'Absent Only' },
            { value: 'late', label: 'Late Only' }]
            }
            placeholder="Status" />


          {/* Apply Button */}
          <div className="flex items-end">
            <Button className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      

      {/* Register Table */}
      <Card title="Attendance Register" noPadding>
        <Table columns={columns} data={students} />
      </Card>
    </div>);

}