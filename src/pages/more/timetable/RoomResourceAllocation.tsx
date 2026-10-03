import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  PlusIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BuildingIcon,
  SearchIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  DownloadIcon,
  RefreshCwIcon,
  SaveIcon } from
'lucide-react';
const branchOptions = [
{
  value: 'all',
  label: 'All Branches',
  color: 'bg-gray-600'
},
{
  value: 'main',
  label: 'Main Campus',
  color: 'bg-blue-600'
},
{
  value: 'north',
  label: 'North Branch',
  color: 'bg-green-600'
},
{
  value: 'south',
  label: 'South Branch',
  color: 'bg-orange-600'
},
{
  value: 'east',
  label: 'East Branch',
  color: 'bg-purple-600'
}];

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  floor: string;
  status: 'Occupied' | 'Available' | 'Maintenance';
  branch: string;
  features: string[];
}
const initialRooms: Room[] = [
{
  id: 'R-001',
  name: 'Classroom 8-A',
  type: 'Classroom',
  capacity: 45,
  floor: '1st',
  status: 'Occupied',
  branch: 'Main Campus',
  features: ['Projector', 'AC']
},
{
  id: 'R-002',
  name: 'Computer Lab 1',
  type: 'Lab',
  capacity: 30,
  floor: '2nd',
  status: 'Available',
  branch: 'Main Campus',
  features: ['30 PCs', 'Projector', 'AC']
},
{
  id: 'R-003',
  name: 'Science Lab',
  type: 'Lab',
  capacity: 35,
  floor: '2nd',
  status: 'Occupied',
  branch: 'Main Campus',
  features: ['Equipment', 'Safety Gear']
},
{
  id: 'R-004',
  name: 'Library',
  type: 'Library',
  capacity: 60,
  floor: 'Ground',
  status: 'Available',
  branch: 'Main Campus',
  features: ['8500 Books', 'Reading Area']
},
{
  id: 'R-005',
  name: 'Auditorium',
  type: 'Hall',
  capacity: 500,
  floor: 'Ground',
  status: 'Available',
  branch: 'Main Campus',
  features: ['Stage', 'Sound System', 'AC']
},
{
  id: 'R-006',
  name: 'Biology Lab',
  type: 'Lab',
  capacity: 30,
  floor: '3rd',
  status: 'Maintenance',
  branch: 'Main Campus',
  features: ['Microscopes', 'Specimens']
},
{
  id: 'R-007',
  name: 'Art Room',
  type: 'Activity',
  capacity: 40,
  floor: '1st',
  status: 'Available',
  branch: 'North Branch',
  features: ['Drawing Boards', 'Storage']
},
{
  id: 'R-008',
  name: 'Music Room',
  type: 'Activity',
  capacity: 25,
  floor: '1st',
  status: 'Available',
  branch: 'North Branch',
  features: ['Instruments', 'Soundproof']
}];

const labSchedule = [
{
  id: 1,
  lab: 'Computer Lab 1',
  class: 'Class 9-A',
  subject: 'Computer Science',
  day: 'Monday',
  period: 'P3',
  teacher: 'Mr. Verma',
  status: 'Confirmed'
},
{
  id: 2,
  lab: 'Science Lab',
  class: 'Class 10-B',
  subject: 'Chemistry',
  day: 'Tuesday',
  period: 'P4',
  teacher: 'Mrs. Patel',
  status: 'Confirmed'
},
{
  id: 3,
  lab: 'Computer Lab 1',
  class: 'Class 8-B',
  subject: 'Computer Science',
  day: 'Wednesday',
  period: 'P2',
  teacher: 'Mr. Verma',
  status: 'Confirmed'
},
{
  id: 4,
  lab: 'Biology Lab',
  class: 'Class 11-A',
  subject: 'Biology',
  day: 'Thursday',
  period: 'P3',
  teacher: 'Ms. Nair',
  status: 'Pending'
},
{
  id: 5,
  lab: 'Science Lab',
  class: 'Class 9-A',
  subject: 'Physics',
  day: 'Friday',
  period: 'P5',
  teacher: 'Mr. Patel',
  status: 'Confirmed'
}];

const conflicts = [
{
  id: 'CONF-001',
  room: 'Computer Lab 1',
  conflict: 'Double booking on Monday P3',
  classes: 'Class 9-A & Class 10-A',
  severity: 'High',
  date: '2026-02-25'
},
{
  id: 'CONF-002',
  room: 'Science Lab',
  conflict: 'Maintenance scheduled during class time',
  classes: 'Class 10-B',
  severity: 'Medium',
  date: '2026-02-26'
}];

const statusVariant = (
s: string)
: 'success' | 'warning' | 'danger' | 'default' | 'primary' => {
  if (s === 'Available' || s === 'Confirmed') return 'success';
  if (s === 'Maintenance' || s === 'Pending') return 'warning';
  if (s === 'Occupied') return 'primary';
  return 'default';
};
const availabilityGrid = [
{
  room: 'Classroom 8-A',
  schedule: [
  'Class 8-A\nMaths',
  'Class 8-A\nSci',
  '',
  'Class 8-A\nEng',
  'Class 8-A\nHindi',
  '',
  'Class 8-A\nSS',
  'Class 8-A\nArt']

},
{
  room: 'Computer Lab 1',
  schedule: ['', '', '', 'Class 9-A\nCS', '', '', '', 'Class 8-B\nCS']
},
{
  room: 'Science Lab',
  schedule: ['', '', '', '', 'Class 10-B\nChem', '', '', '']
},
{
  room: 'Library',
  schedule: ['', '', '', '', '', '', 'Open', 'Open']
},
{
  room: 'Auditorium',
  schedule: ['', '', '', '', '', '', '', '']
},
{
  room: 'Biology Lab',
  schedule: [
  'Maint.',
  'Maint.',
  '',
  'Maint.',
  'Maint.',
  '',
  'Maint.',
  'Maint.']

}];

export function RoomResourceAllocation() {
  const [tab, setTab] = useState('rooms');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [roomSearch, setRoomSearch] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [roomStatusFilter, setRoomStatusFilter] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);
  const [checkType, setCheckType] = useState('all');
  const [checkPeriod, setCheckPeriod] = useState('week');
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'Classroom',
    capacity: '',
    floor: '',
    branch: 'Main Campus'
  });
  const [newSchedule, setNewSchedule] = useState({
    lab: '',
    class: '',
    subject: '',
    day: '',
    period: '',
    teacher: ''
  });
  const [editRoom, setEditRoom] = useState<Partial<Room>>({});
  const toggleBranch = (val: string) => {
    if (val === 'all') {
      setSelectedBranches(['all']);
      return;
    }
    setSelectedBranches((prev) => {
      const without = prev.filter((b) => b !== 'all');
      return without.includes(val) ?
      without.filter((b) => b !== val) :
      [...without, val];
    });
  };
  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
    !roomSearch ||
    r.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
    r.id.toLowerCase().includes(roomSearch.toLowerCase());
    const matchType = !roomTypeFilter || r.type === roomTypeFilter;
    const matchStatus = !roomStatusFilter || r.status === roomStatusFilter;
    const matchBranch =
    selectedBranches.includes('all') ||
    selectedBranches.some(
      (b) => branchOptions.find((bo) => bo.value === b)?.label === r.branch
    );
    return matchSearch && matchType && matchStatus && matchBranch;
  });
  const handleSaveRoom = () => {
    setSaving(true);
    setTimeout(() => {
      const room: Room = {
        id: `R-${String(rooms.length + 1).padStart(3, '0')}`,
        name: newRoom.name,
        type: newRoom.type,
        capacity: parseInt(newRoom.capacity) || 30,
        floor: newRoom.floor,
        status: 'Available',
        branch: newRoom.branch,
        features: []
      };
      setRooms((prev) => [...prev, room]);
      setNewRoom({
        name: '',
        type: 'Classroom',
        capacity: '',
        floor: '',
        branch: 'Main Campus'
      });
      setSaving(false);
      setShowAddRoomModal(false);
    }, 800);
  };
  const handleSaveEdit = () => {
    if (!selectedRoom) return;
    setSaving(true);
    setTimeout(() => {
      setRooms((prev) =>
      prev.map((r) =>
      r.id === selectedRoom.id ?
      {
        ...r,
        ...editRoom
      } :
      r
      )
      );
      setSaving(false);
      setShowEditModal(false);
    }, 600);
  };
  const handleDeleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };
  const handleRunCheck = () => {
    setRunningCheck(true);
    setTimeout(() => setRunningCheck(false), 2000);
  };
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const maintenanceCount = rooms.filter(
    (r) => r.status === 'Maintenance'
  ).length;
  const selectedBranchLabels = selectedBranches.includes('all') ?
  'All Branches' :
  branchOptions.
  filter((b) => selectedBranches.includes(b.value)).
  map((b) => b.label).
  join(', ');
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Room & Resource Allocation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage room master, lab scheduling, resource booking and conflict
            detection
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setShowAddRoomModal(true)}>

            Add Room
          </Button>
        </div>
      </div>

      {/* Multi-Branch Filter */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Branch
            </label>
            <div className="flex flex-wrap gap-2">
              {branchOptions.map((b) =>
              <button
                key={b.value}
                onClick={() => toggleBranch(b.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedBranches.includes(b.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>

                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  {b.label}
                </button>
              )}
            </div>
          </div>
        </div>
        {!selectedBranches.includes('all') && selectedBranches.length > 0 &&
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <BuildingIcon className="w-3.5 h-3.5" />
            <span>
              Showing data for:{' '}
              <strong className="text-gray-700">{selectedBranchLabels}</strong>
            </span>
          </div>
        }
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BuildingIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
            <p className="text-xs text-gray-500">Total Rooms</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {availableCount}
            </p>
            <p className="text-xs text-gray-500">Available Now</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {occupiedCount}
            </p>
            <p className="text-xs text-gray-500">Currently Occupied</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {maintenanceCount}
            </p>
            <p className="text-xs text-gray-500">Under Maintenance</p>
          </div>
        </div>
      </div>

      <Card noPadding>
        <Tabs defaultValue="rooms" value={tab} onValueChange={setTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="rooms">Room Master</TabsTrigger>
            <TabsTrigger value="labs">Lab Scheduling</TabsTrigger>
            <TabsTrigger value="availability">Room Availability</TabsTrigger>
            <TabsTrigger value="conflicts">Conflict Detection</TabsTrigger>
          </TabsList>

          {/* Room Master */}
          <TabsContent value="rooms" className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
              <Input
                placeholder="Search rooms..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="w-52" />

              <Select
                options={[
                {
                  value: '',
                  label: 'All Types'
                },
                {
                  value: 'Classroom',
                  label: 'Classroom'
                },
                {
                  value: 'Lab',
                  label: 'Lab'
                },
                {
                  value: 'Library',
                  label: 'Library'
                },
                {
                  value: 'Hall',
                  label: 'Hall'
                },
                {
                  value: 'Activity',
                  label: 'Activity Room'
                }]
                }
                value={roomTypeFilter}
                onChange={setRoomTypeFilter}
                className="w-40" />

              <Select
                options={[
                {
                  value: '',
                  label: 'All Statuses'
                },
                {
                  value: 'Available',
                  label: 'Available'
                },
                {
                  value: 'Occupied',
                  label: 'Occupied'
                },
                {
                  value: 'Maintenance',
                  label: 'Maintenance'
                }]
                }
                value={roomStatusFilter}
                onChange={setRoomStatusFilter}
                className="w-40" />

            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'Room ID',
                render: (row) =>
                <span className="font-mono text-xs font-semibold text-gray-600">
                      {row.id}
                    </span>

              },
              {
                key: 'name',
                header: 'Room Name',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.name}
                    </span>

              },
              {
                key: 'type',
                header: 'Type',
                render: (row) =>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.type === 'Lab' ? 'bg-green-100 text-green-700' : row.type === 'Classroom' ? 'bg-blue-100 text-blue-700' : row.type === 'Hall' ? 'bg-purple-100 text-purple-700' : row.type === 'Library' ? 'bg-yellow-100 text-yellow-700' : 'bg-pink-100 text-pink-700'}`}>

                      {row.type}
                    </span>

              },
              {
                key: 'capacity',
                header: 'Capacity',
                render: (row) =>
                <span className="font-medium">{row.capacity}</span>

              },
              {
                key: 'floor',
                header: 'Floor'
              },
              {
                key: 'branch',
                header: 'Branch',
                render: (row) =>
                <span className="text-xs text-gray-500">{row.branch}</span>

              },
              {
                key: 'features',
                header: 'Features',
                render: (row) =>
                <div className="flex flex-wrap gap-1">
                      {row.features.slice(0, 2).map((f) =>
                  <span
                    key={f}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">

                          {f}
                        </span>
                  )}
                      {row.features.length > 2 &&
                  <span className="text-xs text-gray-400">
                          +{row.features.length - 2}
                        </span>
                  }
                    </div>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge variant={statusVariant(row.status) as any}>
                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}
                    onClick={() => {
                      setSelectedRoom(row);
                      setEditRoom({
                        name: row.name,
                        type: row.type,
                        capacity: row.capacity,
                        floor: row.floor,
                        status: row.status
                      });
                      setShowEditModal(true);
                    }}>

                        Edit
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<CalendarIcon className="w-3 h-3" />}
                    onClick={() => {
                      setSelectedRoom(row);
                      setShowScheduleModal(true);
                    }}>

                        Schedule
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2Icon className="w-3 h-3" />}
                    className="text-red-500"
                    onClick={() => handleDeleteRoom(row.id)}>

                        Del
                      </Button>
                    </div>

              }]
              }
              data={filteredRooms} />

            {filteredRooms.length === 0 &&
            <div className="text-center py-8 text-gray-400 text-sm">
                No rooms found matching your filters.
              </div>
            }
          </TabsContent>

          {/* Lab Scheduling */}
          <TabsContent value="labs" className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
                  <Select
                    options={[
                    {
                      value: 'all',
                      label: 'All Labs'
                    },
                    {
                      value: 'comp',
                      label: 'Computer Lab'
                    },
                    {
                      value: 'sci',
                      label: 'Science Lab'
                    },
                    {
                      value: 'bio',
                      label: 'Biology Lab'
                    }]
                    }
                    className="w-44" />

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => setShowScheduleModal(true)}>

                    Schedule Lab
                  </Button>
                </div>
                <Table
                  columns={[
                  {
                    key: 'lab',
                    header: 'Lab',
                    render: (row) =>
                    <span className="font-medium text-gray-900 text-sm">
                          {row.lab}
                        </span>

                  },
                  {
                    key: 'class',
                    header: 'Class'
                  },
                  {
                    key: 'subject',
                    header: 'Subject'
                  },
                  {
                    key: 'day',
                    header: 'Day'
                  },
                  {
                    key: 'period',
                    header: 'Period',
                    render: (row) =>
                    <span className="font-mono text-sm font-semibold text-blue-700">
                          {row.period}
                        </span>

                  },
                  {
                    key: 'teacher',
                    header: 'Teacher'
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) =>
                    <Badge variant={statusVariant(row.status) as any}>
                          {row.status}
                        </Badge>

                  },
                  {
                    key: 'actions',
                    header: '',
                    render: () =>
                    <div className="flex gap-1">
                          <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<EditIcon className="w-3 h-3" />}>

                            Edit
                          </Button>
                          <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<Trash2Icon className="w-3 h-3" />}
                        className="text-red-500">

                            Del
                          </Button>
                        </div>

                  }]
                  }
                  data={labSchedule} />

              </div>
              <Card title="Schedule Lab Session">
                <div className="space-y-3">
                  <Select
                    label="Lab"
                    options={[
                    {
                      value: '',
                      label: 'Select Lab'
                    },
                    {
                      value: 'comp1',
                      label: 'Computer Lab 1'
                    },
                    {
                      value: 'comp2',
                      label: 'Computer Lab 2'
                    },
                    {
                      value: 'sci',
                      label: 'Science Lab'
                    },
                    {
                      value: 'bio',
                      label: 'Biology Lab'
                    }]
                    }
                    value={newSchedule.lab}
                    onChange={(v) =>
                    setNewSchedule((p) => ({
                      ...p,
                      lab: v
                    }))
                    } />

                  <Select
                    label="Class"
                    options={[
                    {
                      value: '',
                      label: 'Select Class'
                    },
                    {
                      value: '8a',
                      label: 'Class 8-A'
                    },
                    {
                      value: '9a',
                      label: 'Class 9-A'
                    },
                    {
                      value: '10a',
                      label: 'Class 10-A'
                    },
                    {
                      value: '11a',
                      label: 'Class 11-A'
                    }]
                    }
                    value={newSchedule.class}
                    onChange={(v) =>
                    setNewSchedule((p) => ({
                      ...p,
                      class: v
                    }))
                    } />

                  <Input
                    label="Subject"
                    placeholder="e.g. Computer Science"
                    value={newSchedule.subject}
                    onChange={(e) =>
                    setNewSchedule((p) => ({
                      ...p,
                      subject: e.target.value
                    }))
                    } />

                  <Select
                    label="Day"
                    options={[
                    {
                      value: '',
                      label: 'Select Day'
                    },
                    {
                      value: 'mon',
                      label: 'Monday'
                    },
                    {
                      value: 'tue',
                      label: 'Tuesday'
                    },
                    {
                      value: 'wed',
                      label: 'Wednesday'
                    },
                    {
                      value: 'thu',
                      label: 'Thursday'
                    },
                    {
                      value: 'fri',
                      label: 'Friday'
                    },
                    {
                      value: 'sat',
                      label: 'Saturday'
                    }]
                    }
                    value={newSchedule.day}
                    onChange={(v) =>
                    setNewSchedule((p) => ({
                      ...p,
                      day: v
                    }))
                    } />

                  <Select
                    label="Period"
                    options={[
                    {
                      value: '',
                      label: 'Select Period'
                    },
                    {
                      value: 'p1',
                      label: 'Period 1 (8:00–8:45)'
                    },
                    {
                      value: 'p2',
                      label: 'Period 2 (8:45–9:30)'
                    },
                    {
                      value: 'p3',
                      label: 'Period 3 (9:45–10:30)'
                    },
                    {
                      value: 'p4',
                      label: 'Period 4 (10:30–11:15)'
                    },
                    {
                      value: 'p5',
                      label: 'Period 5 (12:00–12:45)'
                    }]
                    }
                    value={newSchedule.period}
                    onChange={(v) =>
                    setNewSchedule((p) => ({
                      ...p,
                      period: v
                    }))
                    } />

                  <Select
                    label="Teacher"
                    options={[
                    {
                      value: '',
                      label: 'Select Teacher'
                    },
                    {
                      value: 'verma',
                      label: 'Mr. Verma'
                    },
                    {
                      value: 'patel',
                      label: 'Mrs. Patel'
                    },
                    {
                      value: 'sharma',
                      label: 'Mr. Sharma'
                    },
                    {
                      value: 'nair',
                      label: 'Ms. Nair'
                    }]
                    }
                    value={newSchedule.teacher}
                    onChange={(v) =>
                    setNewSchedule((p) => ({
                      ...p,
                      teacher: v
                    }))
                    } />

                  <Button
                    variant="primary"
                    className="w-full"
                    leftIcon={<SaveIcon className="w-4 h-4" />}>

                    Schedule Lab
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Room Availability Grid */}
          <TabsContent value="availability" className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
              <Input
                label="Date"
                type="date"
                defaultValue="2026-02-25"
                className="w-44" />

              <Select
                label="Period"
                options={[
                {
                  value: '',
                  label: 'All Periods'
                },
                {
                  value: 'P1',
                  label: 'Period 1'
                },
                {
                  value: 'P2',
                  label: 'Period 2'
                },
                {
                  value: 'P3',
                  label: 'Period 3'
                },
                {
                  value: 'P4',
                  label: 'Period 4'
                },
                {
                  value: 'P5',
                  label: 'Period 5'
                },
                {
                  value: 'P6',
                  label: 'Period 6'
                }]
                }
                className="w-36" />

              <Select
                label="Room Type"
                options={[
                {
                  value: '',
                  label: 'All Types'
                },
                {
                  value: 'Classroom',
                  label: 'Classroom'
                },
                {
                  value: 'Lab',
                  label: 'Lab'
                },
                {
                  value: 'Hall',
                  label: 'Hall'
                }]
                }
                className="w-36" />

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                  Refresh
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-600 w-36">
                      Room
                    </th>
                    {[
                    'P1\n8:00',
                    'P2\n8:45',
                    'Break',
                    'P3\n9:45',
                    'P4\n10:30',
                    'Lunch',
                    'P5\n12:00',
                    'P6\n12:45'].
                    map((p) =>
                    <th
                      key={p}
                      className={`border border-gray-200 px-2 py-2 text-center font-semibold text-gray-600 ${p === 'Break' || p === 'Lunch' ? 'bg-gray-100 text-gray-400 w-12' : 'w-20'}`}>

                        {p.split('\n').map((line, i) =>
                      <div key={i}>{line}</div>
                      )}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {availabilityGrid.map((row, ri) =>
                  <tr key={ri} className="hover:bg-gray-50/50">
                      <td className="border border-gray-200 px-3 py-2 font-medium text-gray-700 bg-gray-50 text-xs">
                        {row.room}
                      </td>
                      {[
                    'P1',
                    'P2',
                    'Break',
                    'P3',
                    'P4',
                    'Lunch',
                    'P5',
                    'P6'].
                    map((p, pi) => {
                      if (p === 'Break' || p === 'Lunch')
                      return (
                        <td
                          key={p}
                          className="border border-gray-200 px-1 py-2 text-center text-gray-400 bg-gray-50">

                              {p}
                            </td>);

                      const idx =
                      p === 'P1' ?
                      0 :
                      p === 'P2' ?
                      1 :
                      p === 'P3' ?
                      2 :
                      p === 'P4' ?
                      3 :
                      p === 'P5' ?
                      4 :
                      5;
                      const content = row.schedule[idx];
                      const isMaint = content === 'Maint.';
                      return (
                        <td
                          key={p}
                          className="border border-gray-200 px-1 py-1.5 text-center">

                            {content ?
                          <div
                            className={`rounded px-1 py-0.5 text-[10px] font-medium leading-tight ${isMaint ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-800'}`}>

                                {content.split('\n').map((line, i) =>
                            <div key={i}>{line}</div>
                            )}
                              </div> :

                          <div className="bg-green-50 text-green-600 rounded px-1 py-0.5 text-[10px]">
                                Free
                              </div>
                          }
                          </td>);

                    })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 inline-block" />{' '}
                Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-50 border border-green-200 inline-block" />{' '}
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200 inline-block" />{' '}
                Maintenance
              </span>
            </div>
          </TabsContent>

          {/* Conflict Detection */}
          <TabsContent value="conflicts" className="p-5 space-y-4">
            {conflicts.length > 0 &&
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                  <p className="font-semibold text-red-800">
                    {conflicts.length} scheduling conflict(s) detected
                  </p>
                </div>
                <div className="space-y-2">
                  {conflicts.map((c, i) =>
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white border border-red-100 rounded-lg">

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {c.room}
                        </p>
                        <p className="text-xs text-gray-600">{c.conflict}</p>
                        <p className="text-xs text-gray-400">
                          Affected: {c.classes} • Date: {c.date}
                        </p>
                      </div>
                      <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>

                        {c.severity}
                      </span>
                      <Button
                    variant="outline"
                    size="xs"
                    className="border-red-300 text-red-600">

                        Resolve
                      </Button>
                    </div>
                )}
                </div>
              </div>
            }
            <Card title="Run Conflict Check">
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Run a full conflict detection scan across all room bookings
                  and timetables.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Check Type"
                    options={[
                    {
                      value: 'all',
                      label: 'Full Check'
                    },
                    {
                      value: 'rooms',
                      label: 'Room Conflicts'
                    },
                    {
                      value: 'teachers',
                      label: 'Teacher Conflicts'
                    },
                    {
                      value: 'labs',
                      label: 'Lab Conflicts'
                    }]
                    }
                    value={checkType}
                    onChange={setCheckType} />

                  <Select
                    label="For Period"
                    options={[
                    {
                      value: 'week',
                      label: 'This Week'
                    },
                    {
                      value: 'month',
                      label: 'This Month'
                    },
                    {
                      value: 'term',
                      label: 'This Term'
                    }]
                    }
                    value={checkPeriod}
                    onChange={setCheckPeriod} />

                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleRunCheck}
                  leftIcon={
                  runningCheck ?
                  <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                  <AlertTriangleIcon className="w-4 h-4" />

                  }>

                  {runningCheck ? 'Running Check...' : 'Run Conflict Detection'}
                </Button>
                {!runningCheck &&
                <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-red-700">
                        {conflicts.length}
                      </p>
                      <p className="text-xs text-red-500">Conflicts Found</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-green-700">
                        {rooms.length - conflicts.length}
                      </p>
                      <p className="text-xs text-green-500">Rooms Clear</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-blue-700">
                        {labSchedule.length}
                      </p>
                      <p className="text-xs text-blue-500">Lab Sessions</p>
                    </div>
                  </div>
                }
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Room Modal */}
      <Modal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        title="Add New Room">

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Room Name"
              placeholder="e.g. Classroom 9-A"
              value={newRoom.name}
              onChange={(e) =>
              setNewRoom((p) => ({
                ...p,
                name: e.target.value
              }))
              } />

            <Select
              label="Room Type"
              options={[
              {
                value: 'Classroom',
                label: 'Classroom'
              },
              {
                value: 'Lab',
                label: 'Lab'
              },
              {
                value: 'Library',
                label: 'Library'
              },
              {
                value: 'Hall',
                label: 'Hall'
              },
              {
                value: 'Activity',
                label: 'Activity Room'
              }]
              }
              value={newRoom.type}
              onChange={(v) =>
              setNewRoom((p) => ({
                ...p,
                type: v
              }))
              } />

            <Input
              label="Capacity"
              type="number"
              placeholder="e.g. 40"
              value={newRoom.capacity}
              onChange={(e) =>
              setNewRoom((p) => ({
                ...p,
                capacity: e.target.value
              }))
              } />

            <Input
              label="Floor"
              placeholder="e.g. 1st, Ground"
              value={newRoom.floor}
              onChange={(e) =>
              setNewRoom((p) => ({
                ...p,
                floor: e.target.value
              }))
              } />

            <Select
              label="Branch"
              options={branchOptions.
              filter((b) => b.value !== 'all').
              map((b) => ({
                value: b.label,
                label: b.label
              }))}
              value={newRoom.branch}
              onChange={(v) =>
              setNewRoom((p) => ({
                ...p,
                branch: v
              }))
              } />

          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setShowAddRoomModal(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveRoom}
              leftIcon={
              saving ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <SaveIcon className="w-4 h-4" />

              }>

              {saving ? 'Saving...' : 'Add Room'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Room: ${selectedRoom?.name || ''}`}>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Room Name"
              value={editRoom.name || ''}
              onChange={(e) =>
              setEditRoom((p) => ({
                ...p,
                name: e.target.value
              }))
              } />

            <Select
              label="Room Type"
              options={[
              {
                value: 'Classroom',
                label: 'Classroom'
              },
              {
                value: 'Lab',
                label: 'Lab'
              },
              {
                value: 'Library',
                label: 'Library'
              },
              {
                value: 'Hall',
                label: 'Hall'
              },
              {
                value: 'Activity',
                label: 'Activity Room'
              }]
              }
              value={editRoom.type || ''}
              onChange={(v) =>
              setEditRoom((p) => ({
                ...p,
                type: v
              }))
              } />

            <Input
              label="Capacity"
              type="number"
              value={String(editRoom.capacity || '')}
              onChange={(e) =>
              setEditRoom((p) => ({
                ...p,
                capacity: parseInt(e.target.value)
              }))
              } />

            <Input
              label="Floor"
              value={editRoom.floor || ''}
              onChange={(e) =>
              setEditRoom((p) => ({
                ...p,
                floor: e.target.value
              }))
              } />

            <Select
              label="Status"
              options={[
              {
                value: 'Available',
                label: 'Available'
              },
              {
                value: 'Occupied',
                label: 'Occupied'
              },
              {
                value: 'Maintenance',
                label: 'Maintenance'
              }]
              }
              value={editRoom.status || ''}
              onChange={(v) =>
              setEditRoom((p) => ({
                ...p,
                status: v as Room['status']
              }))
              } />

          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              leftIcon={
              saving ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <SaveIcon className="w-4 h-4" />

              }>

              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Room Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={`Schedule Room: ${selectedRoom?.name || 'Lab Session'}`}>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Class"
              options={[
              {
                value: '',
                label: 'Select Class'
              },
              {
                value: '8a',
                label: 'Class 8-A'
              },
              {
                value: '9a',
                label: 'Class 9-A'
              },
              {
                value: '10a',
                label: 'Class 10-A'
              }]
              } />

            <Input label="Subject" placeholder="e.g. Computer Science" />
            <Select
              label="Day"
              options={[
              {
                value: '',
                label: 'Select Day'
              },
              {
                value: 'mon',
                label: 'Monday'
              },
              {
                value: 'tue',
                label: 'Tuesday'
              },
              {
                value: 'wed',
                label: 'Wednesday'
              },
              {
                value: 'thu',
                label: 'Thursday'
              },
              {
                value: 'fri',
                label: 'Friday'
              }]
              } />

            <Select
              label="Period"
              options={[
              {
                value: '',
                label: 'Select Period'
              },
              {
                value: 'p1',
                label: 'Period 1'
              },
              {
                value: 'p2',
                label: 'Period 2'
              },
              {
                value: 'p3',
                label: 'Period 3'
              },
              {
                value: 'p4',
                label: 'Period 4'
              },
              {
                value: 'p5',
                label: 'Period 5'
              }]
              } />

            <Select
              label="Teacher"
              options={[
              {
                value: '',
                label: 'Select Teacher'
              },
              {
                value: 'verma',
                label: 'Mr. Verma'
              },
              {
                value: 'patel',
                label: 'Mrs. Patel'
              },
              {
                value: 'sharma',
                label: 'Mr. Sharma'
              }]
              } />

          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setShowScheduleModal(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<SaveIcon className="w-4 h-4" />}>

              Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}