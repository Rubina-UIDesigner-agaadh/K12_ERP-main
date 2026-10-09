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
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  BuildingIcon,
  DownloadIcon,
  PrinterIcon,
  BellIcon,
  RefreshCwIcon,
  Trash2Icon,
  EditIcon } from
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

interface Substitution {
  id: string;
  absentTeacher: string;
  subject: string;
  class: string;
  period: string;
  date: string;
  substituteTeacher: string;
  status: 'Assigned' | 'Unassigned' | 'Completed' | 'Cancelled';
  reason: string;
  notified: boolean;
}
const initialSubstitutions: Substitution[] = [
{
  id: 'SUB-001',
  absentTeacher: 'Mrs. Sharma',
  subject: 'Mathematics',
  class: 'Class 8-A',
  period: 'P2',
  date: '2026-02-25',
  substituteTeacher: 'Mr. Mehta',
  status: 'Assigned',
  reason: 'Medical Leave',
  notified: true
},
{
  id: 'SUB-002',
  absentTeacher: 'Mr. Verma',
  subject: 'Science',
  class: 'Class 9-B',
  period: 'P4',
  date: '2026-02-25',
  substituteTeacher: 'Mrs. Singh',
  status: 'Assigned',
  reason: 'Personal Leave',
  notified: true
},
{
  id: 'SUB-003',
  absentTeacher: 'Mrs. Patel',
  subject: 'English',
  class: 'Class 7-A',
  period: 'P1',
  date: '2026-02-25',
  substituteTeacher: '',
  status: 'Unassigned',
  reason: 'Sick Leave',
  notified: false
},
{
  id: 'SUB-004',
  absentTeacher: 'Mr. Kumar',
  subject: 'Social Studies',
  class: 'Class 10-B',
  period: 'P3',
  date: '2026-02-25',
  substituteTeacher: 'Ms. Nair',
  status: 'Completed',
  reason: 'Training',
  notified: true
},
{
  id: 'SUB-005',
  absentTeacher: 'Ms. Anita',
  subject: 'Art & Craft',
  class: 'Class 6-A',
  period: 'P5',
  date: '2026-02-24',
  substituteTeacher: 'Mr. Suresh',
  status: 'Completed',
  reason: 'Medical Leave',
  notified: true
},
{
  id: 'SUB-006',
  absentTeacher: 'Mr. Suresh',
  subject: 'PE',
  class: 'Class 8-B',
  period: 'P6',
  date: '2026-02-24',
  substituteTeacher: '',
  status: 'Cancelled',
  reason: 'Class Cancelled',
  notified: false
}];

const availableTeachers = [
{
  name: 'Mr. Mehta',
  subject: 'Hindi',
  freePeriods: ['P1', 'P3', 'P5'],
  classes: 3,
  load: 'Light'
},
{
  name: 'Mrs. Singh',
  subject: 'Social Studies',
  freePeriods: ['P2', 'P4'],
  classes: 4,
  load: 'Normal'
},
{
  name: 'Mr. Kumar',
  subject: 'PE',
  freePeriods: ['P1', 'P2', 'P6'],
  classes: 5,
  load: 'Normal'
},
{
  name: 'Ms. Nair',
  subject: 'Hindi',
  freePeriods: ['P3', 'P4', 'P5'],
  classes: 3,
  load: 'Light'
},
{
  name: 'Mr. Suresh',
  subject: 'Computer',
  freePeriods: ['P2', 'P5'],
  classes: 6,
  load: 'High'
}];

const statusVariant = (
s: string)
: 'success' | 'warning' | 'danger' | 'default' => {
  if (s === 'Assigned') return 'success';
  if (s === 'Unassigned') return 'danger';
  if (s === 'Completed') return 'default';
  return 'warning';
};
export function SubstitutionManagement() {
  const [tab, setTab] = useState('today');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [substitutions, setSubstitutions] =
  useState<Substitution[]>(initialSubstitutions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Substitution | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const [historyDate, setHistoryDate] = useState('');
  const [historyStatus, setHistoryStatus] = useState('');
  const [newSub, setNewSub] = useState({
    date: '',
    absentTeacher: '',
    class: '',
    period: '',
    subject: '',
    reason: '',
    substituteTeacher: ''
  });
  const [saving, setSaving] = useState(false);
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
  const todaySubs = substitutions.filter((s) => s.date === '2026-02-25');
  const absentCount = [...new Set(todaySubs.map((s) => s.absentTeacher))].length;
  const assignedCount = todaySubs.filter(
    (s) => s.status === 'Assigned' || s.status === 'Completed'
  ).length;
  const unassignedCount = todaySubs.filter(
    (s) => s.status === 'Unassigned'
  ).length;
  const handleAssign = (sub: Substitution) => {
    setSelectedSub(sub);
    setShowAssignModal(true);
  };
  const handleQuickAssign = (teacherName: string) => {
    if (!selectedSub) return;
    setSubstitutions((prev) =>
    prev.map((s) =>
    s.id === selectedSub.id ?
    {
      ...s,
      substituteTeacher: teacherName,
      status: 'Assigned',
      notified: false
    } :
    s
    )
    );
    setShowAssignModal(false);
  };
  const handleSendNotification = (id: string) => {
    setSubstitutions((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      notified: true
    } :
    s
    )
    );
  };
  const handleSaveNewSub = () => {
    setSaving(true);
    setTimeout(() => {
      const sub: Substitution = {
        id: `SUB-${String(substitutions.length + 1).padStart(3, '0')}`,
        absentTeacher: newSub.absentTeacher,
        subject: newSub.subject,
        class: newSub.class,
        period: newSub.period,
        date: newSub.date || '2026-02-25',
        substituteTeacher: newSub.substituteTeacher,
        status: newSub.substituteTeacher ? 'Assigned' : 'Unassigned',
        reason: newSub.reason,
        notified: false
      };
      setSubstitutions((prev) => [sub, ...prev]);
      setNewSub({
        date: '',
        absentTeacher: '',
        class: '',
        period: '',
        subject: '',
        reason: '',
        substituteTeacher: ''
      });
      setSaving(false);
      setShowAddModal(false);
    }, 800);
  };
  const historyData = substitutions.filter((s) => {
    const matchSearch =
    !historySearch ||
    s.absentTeacher.toLowerCase().includes(historySearch.toLowerCase()) ||
    s.class.toLowerCase().includes(historySearch.toLowerCase());
    const matchDate = !historyDate || s.date === historyDate;
    const matchStatus = !historyStatus || s.status === historyStatus;
    return matchSearch && matchDate && matchStatus;
  });
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
            Substitution Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage teacher substitutions, track absent staff and notify
            substitutes
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PrinterIcon className="w-4 h-4" />}>

            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}>

            Add Substitution
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
          <Input
            label="Date"
            type="date"
            defaultValue="2026-02-25"
            className="w-44" />

        </div>
        {!selectedBranches.includes('all') &&
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
          <div className="p-2 bg-red-100 rounded-lg">
            <UserIcon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            <p className="text-xs text-gray-500">Absent Teachers Today</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{assignedCount}</p>
            <p className="text-xs text-gray-500">Substitutions Assigned</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangleIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {unassignedCount}
            </p>
            <p className="text-xs text-gray-500">Unassigned Periods</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BellIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {
              todaySubs.filter((s) => !s.notified && s.status === 'Assigned').
              length
              }
            </p>
            <p className="text-xs text-gray-500">Notifications Pending</p>
          </div>
        </div>
      </div>

      {/* Unassigned Alert */}
      {unassignedCount > 0 &&
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>{unassignedCount} period(s)</strong> still unassigned.
            Please assign substitutes immediately.
          </span>
          <Button
          variant="outline"
          size="xs"
          className="ml-auto border-red-300 text-red-600"
          onClick={() => setTab('assign')}>

            Assign Now
          </Button>
        </div>
      }

      <Card noPadding>
        <Tabs defaultValue="today" value={tab} onValueChange={setTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="today">Today's Substitutions</TabsTrigger>
            <TabsTrigger value="assign">Assign Substitute</TabsTrigger>
            <TabsTrigger value="available">Available Teachers</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Today's Substitutions */}
          <TabsContent value="today" className="p-5">
            <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">Tuesday, 25 February 2026</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                Refresh
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID',
                render: (row) =>
                <span className="font-mono text-xs text-gray-500">
                      {row.id}
                    </span>

              },
              {
                key: 'absentTeacher',
                header: 'Absent Teacher',
                render: (row) =>
                <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {row.absentTeacher}
                      </p>
                      <p className="text-xs text-gray-400">{row.reason}</p>
                    </div>

              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'class',
                header: 'Class'
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
                key: 'substituteTeacher',
                header: 'Substitute',
                render: (row) =>
                row.substituteTeacher ?
                <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-800">
                          {row.substituteTeacher}
                        </span>
                        {!row.notified && row.status === 'Assigned' &&
                  <span
                    className="w-2 h-2 bg-orange-400 rounded-full"
                    title="Not notified" />

                  }
                      </div> :

                <span className="text-red-500 text-xs font-medium">
                        Not Assigned
                      </span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1 flex-wrap">
                      {row.status === 'Unassigned' &&
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleAssign(row)}>

                          Assign
                        </Button>
                  }
                      {row.status === 'Assigned' && !row.notified &&
                  <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<BellIcon className="w-3 h-3" />}
                    onClick={() => handleSendNotification(row.id)}>

                          Notify
                        </Button>
                  }
                      {row.status === 'Assigned' &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}>

                          Edit
                        </Button>
                  }
                      {(row.status === 'Assigned' ||
                  row.status === 'Unassigned') &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2Icon className="w-3 h-3" />}
                    className="text-red-500">

                          Cancel
                        </Button>
                  }
                    </div>

              }]
              }
              data={todaySubs} />

          </TabsContent>

          {/* Assign Substitute */}
          <TabsContent value="assign" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Create Substitution">
                <div className="space-y-3">
                  <Input
                    label="Date"
                    type="date"
                    value={newSub.date}
                    onChange={(e) =>
                    setNewSub((p) => ({
                      ...p,
                      date: e.target.value
                    }))
                    } />

                  <Select
                    label="Absent Teacher"
                    options={[
                    {
                      value: '',
                      label: 'Select Teacher'
                    },
                    {
                      value: 'Mrs. Sharma',
                      label: 'Mrs. Sharma (Mathematics)'
                    },
                    {
                      value: 'Mr. Patel',
                      label: 'Mr. Patel (Science)'
                    },
                    {
                      value: 'Mrs. Verma',
                      label: 'Mrs. Verma (English)'
                    },
                    {
                      value: 'Mr. Kumar',
                      label: 'Mr. Kumar (Social Studies)'
                    },
                    {
                      value: 'Ms. Anita',
                      label: 'Ms. Anita (Art)'
                    }]
                    }
                    value={newSub.absentTeacher}
                    onChange={(v) =>
                    setNewSub((p) => ({
                      ...p,
                      absentTeacher: v
                    }))
                    } />

                  <Select
                    label="Reason for Absence"
                    options={[
                    {
                      value: '',
                      label: 'Select Reason'
                    },
                    {
                      value: 'Medical Leave',
                      label: 'Medical Leave'
                    },
                    {
                      value: 'Personal Leave',
                      label: 'Personal Leave'
                    },
                    {
                      value: 'Sick Leave',
                      label: 'Sick Leave'
                    },
                    {
                      value: 'Training',
                      label: 'Training / Workshop'
                    },
                    {
                      value: 'Emergency',
                      label: 'Emergency'
                    }]
                    }
                    value={newSub.reason}
                    onChange={(v) =>
                    setNewSub((p) => ({
                      ...p,
                      reason: v
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
                      value: 'Class 6-A',
                      label: 'Class 6-A'
                    },
                    {
                      value: 'Class 7-A',
                      label: 'Class 7-A'
                    },
                    {
                      value: 'Class 8-A',
                      label: 'Class 8-A'
                    },
                    {
                      value: 'Class 8-B',
                      label: 'Class 8-B'
                    },
                    {
                      value: 'Class 9-A',
                      label: 'Class 9-A'
                    },
                    {
                      value: 'Class 9-B',
                      label: 'Class 9-B'
                    },
                    {
                      value: 'Class 10-A',
                      label: 'Class 10-A'
                    },
                    {
                      value: 'Class 10-B',
                      label: 'Class 10-B'
                    }]
                    }
                    value={newSub.class}
                    onChange={(v) =>
                    setNewSub((p) => ({
                      ...p,
                      class: v
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
                      value: 'P1',
                      label: 'Period 1 (8:00–8:45)'
                    },
                    {
                      value: 'P2',
                      label: 'Period 2 (8:45–9:30)'
                    },
                    {
                      value: 'P3',
                      label: 'Period 3 (9:45–10:30)'
                    },
                    {
                      value: 'P4',
                      label: 'Period 4 (10:30–11:15)'
                    },
                    {
                      value: 'P5',
                      label: 'Period 5 (12:00–12:45)'
                    },
                    {
                      value: 'P6',
                      label: 'Period 6 (12:45–1:30)'
                    }]
                    }
                    value={newSub.period}
                    onChange={(v) =>
                    setNewSub((p) => ({
                      ...p,
                      period: v
                    }))
                    } />

                  <Input
                    label="Subject"
                    placeholder="e.g. Mathematics"
                    value={newSub.subject}
                    onChange={(e) =>
                    setNewSub((p) => ({
                      ...p,
                      subject: e.target.value
                    }))
                    } />

                  <Select
                    label="Substitute Teacher (Optional)"
                    options={[
                    {
                      value: '',
                      label: 'Assign Later'
                    },
                    ...availableTeachers.map((t) => ({
                      value: t.name,
                      label: `${t.name} (${t.subject})`
                    }))]
                    }
                    value={newSub.substituteTeacher}
                    onChange={(v) =>
                    setNewSub((p) => ({
                      ...p,
                      substituteTeacher: v
                    }))
                    } />

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSaveNewSub}
                    leftIcon={
                    saving ?
                    <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                    <PlusIcon className="w-4 h-4" />

                    }>

                    {saving ? 'Saving...' : 'Create Substitution'}
                  </Button>
                </div>
              </Card>
              <Card title="Unassigned Periods — Quick Assign">
                <div className="space-y-2">
                  {todaySubs.filter((s) => s.status === 'Unassigned').length ===
                  0 ?
                  <div className="text-center py-8 text-gray-400">
                      <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm">All periods assigned!</p>
                    </div> :

                  todaySubs.
                  filter((s) => s.status === 'Unassigned').
                  map((sub) =>
                  <div
                    key={sub.id}
                    className="p-3 bg-red-50 border border-red-100 rounded-lg">

                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {sub.class} — {sub.period}
                              </p>
                              <p className="text-xs text-gray-500">
                                {sub.subject} • Absent: {sub.absentTeacher}
                              </p>
                            </div>
                            <Badge variant="danger">Unassigned</Badge>
                          </div>
                          <Button
                      variant="primary"
                      size="xs"
                      className="w-full"
                      onClick={() => handleAssign(sub)}>

                            Assign Substitute
                          </Button>
                        </div>
                  )
                  }
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Available Teachers */}
          <TabsContent value="available" className="p-5">
            <div className="flex gap-3 mb-4 flex-wrap">
              <Select
                options={[
                {
                  value: '',
                  label: 'All Subjects'
                },
                {
                  value: 'Mathematics',
                  label: 'Mathematics'
                },
                {
                  value: 'Science',
                  label: 'Science'
                },
                {
                  value: 'English',
                  label: 'English'
                },
                {
                  value: 'Hindi',
                  label: 'Hindi'
                }]
                }
                className="w-40" />

              <Select
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

            </div>
            <div className="space-y-3">
              {availableTeachers.map((t, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">

                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {t.subject}
                      </span>
                      <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.load === 'High' ? 'bg-red-100 text-red-700' : t.load === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

                        {t.load} Load
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" /> Free:{' '}
                        {t.freePeriods.join(', ')}
                      </span>
                      <span>{t.classes} classes assigned</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Schedule
                    </Button>
                    <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PlusIcon className="w-3 h-3" />}>

                      Assign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
              <Input
                placeholder="Search by teacher or class..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="w-56" />

              <Input
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
                className="w-44" />

              <Select
                options={[
                {
                  value: '',
                  label: 'All Statuses'
                },
                {
                  value: 'Assigned',
                  label: 'Assigned'
                },
                {
                  value: 'Unassigned',
                  label: 'Unassigned'
                },
                {
                  value: 'Completed',
                  label: 'Completed'
                },
                {
                  value: 'Cancelled',
                  label: 'Cancelled'
                }]
                }
                value={historyStatus}
                onChange={setHistoryStatus}
                className="w-36" />

              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export
              </Button>
            </div>
            <Table
              columns={[
              {
                key: 'id',
                header: 'ID',
                render: (row) =>
                <span className="font-mono text-xs text-gray-500">
                      {row.id}
                    </span>

              },
              {
                key: 'date',
                header: 'Date'
              },
              {
                key: 'absentTeacher',
                header: 'Absent Teacher'
              },
              {
                key: 'subject',
                header: 'Subject'
              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'period',
                header: 'Period'
              },
              {
                key: 'substituteTeacher',
                header: 'Substitute',
                render: (row) =>
                row.substituteTeacher ||
                <span className="text-gray-400 text-xs">—</span>

              },
              {
                key: 'reason',
                header: 'Reason',
                render: (row) =>
                <span className="text-xs text-gray-500">{row.reason}</span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge variant={statusVariant(row.status)}>
                      {row.status}
                    </Badge>

              }]
              }
              data={historyData} />

            {historyData.length === 0 &&
            <div className="text-center py-8 text-gray-400 text-sm">
                No substitutions found matching your filters.
              </div>
            }
          </TabsContent>
        </Tabs>
      </Card>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Substitute — ${selectedSub?.class} ${selectedSub?.period}`}>

        <div className="space-y-4">
          {selectedSub &&
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Absent:</span>{' '}
                  <strong>{selectedSub.absentTeacher}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Subject:</span>{' '}
                  <strong>{selectedSub.subject}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Class:</span>{' '}
                  <strong>{selectedSub.class}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Period:</span>{' '}
                  <strong>{selectedSub.period}</strong>
                </div>
              </div>
            </div>
          }
          <h4 className="text-sm font-semibold text-gray-700">
            Available Teachers for this Period
          </h4>
          <div className="space-y-2">
            {availableTeachers.map((t, i) =>
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.subject} • Free: {t.freePeriods.join(', ')}
                  </p>
                </div>
                <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.load === 'High' ? 'bg-red-100 text-red-700' : t.load === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

                  {t.load}
                </span>
                <Button
                variant="primary"
                size="xs"
                onClick={() => handleQuickAssign(t.name)}>

                  Assign
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Substitution Modal (duplicate of assign tab but as modal) */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Substitution"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={newSub.date}
              onChange={(e) =>
              setNewSub((p) => ({
                ...p,
                date: e.target.value
              }))
              } />

            <Select
              label="Absent Teacher"
              options={[
              {
                value: '',
                label: 'Select Teacher'
              },
              {
                value: 'Mrs. Sharma',
                label: 'Mrs. Sharma'
              },
              {
                value: 'Mr. Patel',
                label: 'Mr. Patel'
              },
              {
                value: 'Mrs. Verma',
                label: 'Mrs. Verma'
              },
              {
                value: 'Mr. Kumar',
                label: 'Mr. Kumar'
              }]
              }
              value={newSub.absentTeacher}
              onChange={(v) =>
              setNewSub((p) => ({
                ...p,
                absentTeacher: v
              }))
              } />

            <Select
              label="Reason"
              options={[
              {
                value: '',
                label: 'Select Reason'
              },
              {
                value: 'Medical Leave',
                label: 'Medical Leave'
              },
              {
                value: 'Personal Leave',
                label: 'Personal Leave'
              },
              {
                value: 'Training',
                label: 'Training'
              },
              {
                value: 'Emergency',
                label: 'Emergency'
              }]
              }
              value={newSub.reason}
              onChange={(v) =>
              setNewSub((p) => ({
                ...p,
                reason: v
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
                value: 'Class 8-A',
                label: 'Class 8-A'
              },
              {
                value: 'Class 9-A',
                label: 'Class 9-A'
              },
              {
                value: 'Class 10-A',
                label: 'Class 10-A'
              }]
              }
              value={newSub.class}
              onChange={(v) =>
              setNewSub((p) => ({
                ...p,
                class: v
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
              value={newSub.period}
              onChange={(v) =>
              setNewSub((p) => ({
                ...p,
                period: v
              }))
              } />

            <Input
              label="Subject"
              placeholder="e.g. Mathematics"
              value={newSub.subject}
              onChange={(e) =>
              setNewSub((p) => ({
                ...p,
                subject: e.target.value
              }))
              } />

            <Select
              label="Substitute Teacher"
              options={[
              {
                value: '',
                label: 'Assign Later'
              },
              ...availableTeachers.map((t) => ({
                value: t.name,
                label: t.name
              }))]
              }
              value={newSub.substituteTeacher}
              onChange={(v) =>
              setNewSub((p) => ({
                ...p,
                substituteTeacher: v
              }))
              } />

          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveNewSub}
              leftIcon={
              saving ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <PlusIcon className="w-4 h-4" />

              }>

              {saving ? 'Saving...' : 'Create Substitution'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}