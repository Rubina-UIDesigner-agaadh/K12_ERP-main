import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Clock, Plus, Search } from 'lucide-react';
export function LateArrivalEarlyDeparture() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const records = [
  {
    id: '1',
    student: 'Amit Kumar',
    class: '9-B',
    date: '2024-03-12',
    type: 'Late Arrival',
    time: '08:45 AM',
    deviation: '45 mins',
    reason: 'Bus Breakdown'
  },
  {
    id: '2',
    student: 'Priya Desai',
    class: '10-A',
    date: '2024-03-12',
    type: 'Early Departure',
    time: '01:30 PM',
    deviation: '2 hours',
    reason: 'Medical Appointment'
  }];

  const columns = [
  {
    key: 'student',
    header: 'Student',
    render: (row: any) =>
    <div>
          <div className="font-medium text-gray-900">{row.student}</div>
          <div className="text-xs text-gray-500">{row.class}</div>
        </div>

  },
  {
    key: 'date',
    header: 'Date',
    render: (row: any) => <span className="text-sm">{row.date}</span>
  },
  {
    key: 'type',
    header: 'Type',
    render: (row: any) =>
    <Badge variant={row.type === 'Late Arrival' ? 'warning' : 'info'}>
          {row.type}
        </Badge>

  },
  {
    key: 'timing',
    header: 'Timing',
    render: (row: any) =>
    <div className="text-sm">
          <div className="font-medium">{row.time}</div>
          <div className="text-xs text-red-600">({row.deviation})</div>
        </div>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: any) =>
    <span className="text-sm text-gray-600">{row.reason}</span>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Late Arrival / Early Departure
          </h1>
          <p className="text-sm text-gray-500">
            Log and track student timing deviations
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search Student..."
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Input type="date" />
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
            options={[
            {
              value: 'all',
              label: 'All Types'
            },
            {
              value: 'late',
              label: 'Late Arrival'
            },
            {
              value: 'early',
              label: 'Early Departure'
            }]
            } />

          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Filter Logs
          </Button>
        </div>

        <Table columns={columns} data={records} />
      </Card>
    </div>);

}