import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  PlusIcon,
  SaveIcon,
  LockIcon,
  UnlockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  Trash2Icon,
  EditIcon,
  BuildingIcon,
  DownloadIcon,
  RefreshCwIcon,
  PencilIcon,
  XIcon,
  CheckIcon } from
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

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'Regular' | 'Break' | 'Lunch' | 'Assembly' | 'Activity';
  duration: number;
}
const initialPeriods: Period[] = [
{
  id: 'P1',
  name: 'Period 1',
  startTime: '08:00',
  endTime: '08:45',
  type: 'Regular',
  duration: 45
},
{
  id: 'P2',
  name: 'Period 2',
  startTime: '08:45',
  endTime: '09:30',
  type: 'Regular',
  duration: 45
},
{
  id: 'BRK',
  name: 'Break',
  startTime: '09:30',
  endTime: '09:45',
  type: 'Break',
  duration: 15
},
{
  id: 'P3',
  name: 'Period 3',
  startTime: '09:45',
  endTime: '10:30',
  type: 'Regular',
  duration: 45
},
{
  id: 'P4',
  name: 'Period 4',
  startTime: '10:30',
  endTime: '11:15',
  type: 'Regular',
  duration: 45
},
{
  id: 'LCH',
  name: 'Lunch',
  startTime: '11:15',
  endTime: '12:00',
  type: 'Lunch',
  duration: 45
},
{
  id: 'P5',
  name: 'Period 5',
  startTime: '12:00',
  endTime: '12:45',
  type: 'Regular',
  duration: 45
},
{
  id: 'P6',
  name: 'Period 6',
  startTime: '12:45',
  endTime: '13:30',
  type: 'Regular',
  duration: 45
}];

const days = [
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday',
'Sunday'];

type DayType = 'Full Day' | 'Half Day' | 'Holiday';
const dayTypeColors: Record<DayType, string> = {
  'Full Day': 'bg-green-100 text-green-700 border-green-200',
  'Half Day': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Holiday: 'bg-red-100 text-red-700 border-red-200'
};
const typeBadge = (t: string) => {
  const c: Record<string, string> = {
    Regular: 'bg-blue-100 text-blue-700',
    Break: 'bg-yellow-100 text-yellow-700',
    Lunch: 'bg-green-100 text-green-700',
    Assembly: 'bg-purple-100 text-purple-700',
    Activity: 'bg-pink-100 text-pink-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[t] || 'bg-gray-100 text-gray-600'}`}>

      {t}
    </span>);

};
const subjectColors: Record<string, string> = {
  Maths: 'bg-blue-100 text-blue-800',
  Science: 'bg-green-100 text-green-800',
  English: 'bg-purple-100 text-purple-800',
  Hindi: 'bg-orange-100 text-orange-800',
  SS: 'bg-yellow-100 text-yellow-800',
  Art: 'bg-pink-100 text-pink-800',
  PE: 'bg-teal-100 text-teal-800',
  Library: 'bg-indigo-100 text-indigo-800',
  Activity: 'bg-red-100 text-red-800',
  Computer: 'bg-cyan-100 text-cyan-800'
};
const subjectOptions = [
'Maths',
'Science',
'English',
'Hindi',
'SS',
'Art',
'PE',
'Library',
'Activity',
'Computer'];

const teacherOptions: Record<string, string> = {
  Maths: 'Mrs. Sharma',
  Science: 'Mr. Patel',
  English: 'Mrs. Verma',
  Hindi: 'Ms. Nair',
  SS: 'Mr. Kumar',
  Art: 'Ms. Anita',
  PE: 'Mr. Suresh',
  Library: '—',
  Activity: '—',
  Computer: 'Mr. Raj'
};
const defaultOverrideCells: Record<string, string[]> = {
  Mon: ['Maths', 'Science', '', 'English', 'Hindi', '', 'SS', 'Art'],
  Tue: ['English', 'Maths', '', 'Science', 'SS', '', 'Hindi', 'PE'],
  Wed: ['Science', 'Hindi', '', 'Maths', 'English', '', 'Art', 'SS'],
  Thu: ['Hindi', 'SS', '', 'English', 'Maths', '', 'Science', 'Library'],
  Fri: ['Maths', 'English', '', 'Hindi', 'Science', '', 'PE', 'SS'],
  Sat: ['Science', 'Maths', '', 'English', 'Activity', '', '', '']
};
const timetablePreview = [
{
  day: 'Mon',
  cells: ['Maths', 'Science', '', 'English', 'Hindi', '', 'SS', 'Art']
},
{
  day: 'Tue',
  cells: ['English', 'Maths', '', 'Science', 'SS', '', 'Hindi', 'PE']
},
{
  day: 'Wed',
  cells: ['Science', 'Hindi', '', 'Maths', 'English', '', 'Art', 'SS']
},
{
  day: 'Thu',
  cells: ['Hindi', 'SS', '', 'English', 'Maths', '', 'Science', 'Library']
},
{
  day: 'Fri',
  cells: ['Maths', 'English', '', 'Hindi', 'Science', '', 'PE', 'SS']
},
{
  day: 'Sat',
  cells: ['Science', 'Maths', '', 'English', 'Activity', '', '', '']
}];

// Map period column label to cell array index
const periodColToIdx: Record<string, number> = {
  P1: 0,
  P2: 1,
  P3: 3,
  P4: 4,
  P5: 6,
  P6: 7
};
export function TimetableSetup() {
  const [tab, setTab] = useState('configuration');
  const [periods, setPeriods] = useState<Period[]>(initialPeriods);
  const [periodsLocked, setPeriodsLocked] = useState(false);
  const [dayTypes, setDayTypes] = useState<Record<string, DayType>>({
    Monday: 'Full Day',
    Tuesday: 'Full Day',
    Wednesday: 'Full Day',
    Thursday: 'Full Day',
    Friday: 'Full Day',
    Saturday: 'Half Day',
    Sunday: 'Holiday'
  });
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [selectedClass, setSelectedClass] = useState('class-8a');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Partial<Period>>({
    name: '',
    startTime: '',
    endTime: '',
    type: 'Regular',
    duration: 45
  });
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [fullDayStart, setFullDayStart] = useState('08:00');
  const [fullDayEnd, setFullDayEnd] = useState('13:30');
  const [halfDayStart, setHalfDayStart] = useState('08:00');
  const [halfDayEnd, setHalfDayEnd] = useState('12:00');
  const [savedTimings, setSavedTimings] = useState(false);
  // Manual Override Mode state
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideCells, setOverrideCells] = useState<Record<string, string[]>>(
    () =>
    Object.fromEntries(
      Object.entries(defaultOverrideCells).map(([day, cells]) => [
      day,
      [...cells]]
      )
    )
  );
  const [overrideSaved, setOverrideSaved] = useState(false);
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
  const handleDayTypeChange = (day: string, type: DayType) => {
    setDayTypes((prev) => ({
      ...prev,
      [day]: type
    }));
  };
  const handleDeletePeriod = (id: string) => {
    if (periodsLocked) return;
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  };
  const handleAddPeriod = () => {
    if (!newPeriod.name || !newPeriod.startTime || !newPeriod.endTime) return;
    const period: Period = {
      id: `P${Date.now()}`,
      name: newPeriod.name!,
      startTime: newPeriod.startTime!,
      endTime: newPeriod.endTime!,
      type: newPeriod.type as Period['type'] || 'Regular',
      duration: newPeriod.duration || 45
    };
    setPeriods((prev) => [...prev, period]);
    setNewPeriod({
      name: '',
      startTime: '',
      endTime: '',
      type: 'Regular',
      duration: 45
    });
    setShowAddPeriod(false);
  };
  const handleAutoGenerate = () => {
    setGenerating(true);
    setManualOverride(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };
  const handleEnterOverride = () => {
    setManualOverride(true);
    setOverrideSaved(false);
    if (!generated) setGenerated(true);
  };
  const handleExitOverride = () => {
    setManualOverride(false);
  };
  const handleSaveOverride = () => {
    setOverrideSaved(true);
    setManualOverride(false);
  };
  const handleResetOverride = () => {
    setOverrideCells(
      Object.fromEntries(
        Object.entries(defaultOverrideCells).map(([day, cells]) => [
        day,
        [...cells]]
        )
      )
    );
  };
  const handleCellChange = (day: string, cellIdx: number, value: string) => {
    setOverrideCells((prev) => ({
      ...prev,
      [day]: prev[day].map((c, i) => i === cellIdx ? value : c)
    }));
  };
  const regularPeriods = periods.filter((p) => p.type === 'Regular').length;
  const selectedBranchLabels = selectedBranches.includes('all') ?
  'All Branches' :
  branchOptions.
  filter((b) => selectedBranches.includes(b.value)).
  map((b) => b.label).
  join(', ');
  const displayRows = manualOverride ?
  Object.entries(overrideCells).map(([day, cells]) => ({
    day,
    cells
  })) :
  timetablePreview;
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Setup</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure period master, working days, subject allocations and
            auto-generate timetables
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export
          </Button>
          <Button variant="primary" leftIcon={<SaveIcon className="w-4 h-4" />}>
            Save Settings
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
          <Select
            label="Academic Year"
            options={[
            {
              value: '2025-26',
              label: '2025-26'
            },
            {
              value: '2024-25',
              label: '2024-25'
            }]
            }
            value={selectedYear}
            onChange={setSelectedYear}
            className="w-36" />

        </div>
        {!selectedBranches.includes('all') && selectedBranches.length > 0 &&
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <BuildingIcon className="w-3.5 h-3.5" />
            <span>
              Configuring for:{' '}
              <strong className="text-gray-700">{selectedBranchLabels}</strong>
            </span>
          </div>
        }
      </Card>

      <Card noPadding>
        <Tabs defaultValue="configuration" value={tab} onValueChange={setTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="periods">Periods Master</TabsTrigger>
            <TabsTrigger value="subjects">Subject Allocation</TabsTrigger>
            <TabsTrigger value="generator">Timetable Generator</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Day Type Configuration">
                <div className="space-y-3">
                  {days.map((day) =>
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <span className="text-sm font-medium text-gray-700 w-24">
                        {day}
                      </span>
                      <div className="flex gap-1">
                        {(['Full Day', 'Half Day', 'Holiday'] as DayType[]).map(
                        (type) =>
                        <button
                          key={type}
                          onClick={() => handleDayTypeChange(day, type)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${dayTypes[day] === type ? dayTypeColors[type] : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>

                              {type}
                            </button>

                      )}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    className="w-full"
                    leftIcon={<SaveIcon className="w-4 h-4" />}>

                    Save Day Configuration
                  </Button>
                </div>
              </Card>

              <div className="space-y-4">
                <Card title="School Timings — Full Day">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Start Time"
                        type="time"
                        value={fullDayStart}
                        onChange={(e) => setFullDayStart(e.target.value)} />

                      <Input
                        label="End Time"
                        type="time"
                        value={fullDayEnd}
                        onChange={(e) => setFullDayEnd(e.target.value)} />

                    </div>
                    <Input
                      label="Total Periods Per Day"
                      type="number"
                      defaultValue="6" />

                    <Input
                      label="Period Duration (minutes)"
                      type="number"
                      defaultValue="45" />

                  </div>
                </Card>
                <Card title="School Timings — Half Day">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Start Time"
                        type="time"
                        value={halfDayStart}
                        onChange={(e) => setHalfDayStart(e.target.value)} />

                      <Input
                        label="End Time"
                        type="time"
                        value={halfDayEnd}
                        onChange={(e) => setHalfDayEnd(e.target.value)} />

                    </div>
                    <Input
                      label="Total Periods (Half Day)"
                      type="number"
                      defaultValue="4" />

                  </div>
                </Card>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setSavedTimings(true)}
                  leftIcon={
                  savedTimings ?
                  <CheckCircleIcon className="w-4 h-4" /> :

                  <SaveIcon className="w-4 h-4" />

                  }>

                  {savedTimings ? 'Timings Saved!' : 'Save Timings'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Periods Master Tab */}
          <TabsContent value="periods" className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Period Schedule
                </h3>
                <span className="text-xs text-gray-500">
                  {regularPeriods} regular · {periods.length - regularPeriods}{' '}
                  breaks/other
                </span>
                {periodsLocked ?
                <Badge variant="danger">
                    <LockIcon className="w-3 h-3 mr-1" />
                    Locked
                  </Badge> :

                <Badge variant="success">
                    <UnlockIcon className="w-3 h-3 mr-1" />
                    Editable
                  </Badge>
                }
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={
                  periodsLocked ?
                  <UnlockIcon className="w-4 h-4" /> :

                  <LockIcon className="w-4 h-4" />

                  }
                  onClick={() => setPeriodsLocked(!periodsLocked)}
                  className={
                  periodsLocked ?
                  'text-red-600 border-red-200 hover:bg-red-50' :
                  ''
                  }>

                  {periodsLocked ?
                  'Unlock Configuration' :
                  'Lock Configuration'}
                </Button>
                {!periodsLocked &&
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => setShowAddPeriod(!showAddPeriod)}>

                    Add Period
                  </Button>
                }
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<SaveIcon className="w-4 h-4" />}
                  disabled={periodsLocked}>

                  Save & Apply
                </Button>
              </div>
            </div>

            {periodsLocked &&
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <LockIcon className="w-4 h-4 flex-shrink-0" />
                Period configuration is locked. Unlock to make changes.
              </div>
            }

            {showAddPeriod && !periodsLocked &&
            <Card className="mb-4 bg-blue-50 border-blue-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Add New Period
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Input
                  label="Period Name"
                  placeholder="e.g. Period 7"
                  value={newPeriod.name || ''}
                  onChange={(e) =>
                  setNewPeriod((p) => ({
                    ...p,
                    name: e.target.value
                  }))
                  } />

                  <Input
                  label="Start Time"
                  type="time"
                  value={newPeriod.startTime || ''}
                  onChange={(e) =>
                  setNewPeriod((p) => ({
                    ...p,
                    startTime: e.target.value
                  }))
                  } />

                  <Input
                  label="End Time"
                  type="time"
                  value={newPeriod.endTime || ''}
                  onChange={(e) =>
                  setNewPeriod((p) => ({
                    ...p,
                    endTime: e.target.value
                  }))
                  } />

                  <Select
                  label="Type"
                  options={[
                  {
                    value: 'Regular',
                    label: 'Regular'
                  },
                  {
                    value: 'Break',
                    label: 'Break'
                  },
                  {
                    value: 'Lunch',
                    label: 'Lunch'
                  },
                  {
                    value: 'Assembly',
                    label: 'Assembly'
                  },
                  {
                    value: 'Activity',
                    label: 'Activity'
                  }]
                  }
                  value={newPeriod.type || 'Regular'}
                  onChange={(v) =>
                  setNewPeriod((p) => ({
                    ...p,
                    type: v as Period['type']
                  }))
                  } />

                  <Input
                  label="Duration (min)"
                  type="number"
                  value={String(newPeriod.duration || 45)}
                  onChange={(e) =>
                  setNewPeriod((p) => ({
                    ...p,
                    duration: parseInt(e.target.value)
                  }))
                  } />

                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="primary" size="sm" onClick={handleAddPeriod}>
                    Add Period
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPeriod(false)}>

                    Cancel
                  </Button>
                </div>
              </Card>
            }

            <Table
              columns={[
              {
                key: 'id',
                header: 'ID',
                render: (row) =>
                <span className="font-mono text-xs font-semibold text-gray-600">
                      {row.id}
                    </span>

              },
              {
                key: 'name',
                header: 'Period Name',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.name}
                    </span>

              },
              {
                key: 'startTime',
                header: 'Start Time',
                render: (row) =>
                <span className="font-mono text-sm">{row.startTime}</span>

              },
              {
                key: 'endTime',
                header: 'End Time',
                render: (row) =>
                <span className="font-mono text-sm">{row.endTime}</span>

              },
              {
                key: 'duration',
                header: 'Duration',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.duration} min
                    </span>

              },
              {
                key: 'type',
                header: 'Type',
                render: (row) => typeBadge(row.type)
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
                    disabled={periodsLocked}
                    onClick={() => setEditingPeriodId(row.id)}>

                        Edit
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2Icon className="w-3 h-3" />}
                    className="text-red-500"
                    disabled={periodsLocked}
                    onClick={() => handleDeletePeriod(row.id)}>

                        Del
                      </Button>
                    </div>

              }]
              }
              data={periods} />


            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Weekly Period Summary
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {days.map((day) =>
                <div
                  key={day}
                  className={`p-2 rounded-lg border text-center ${dayTypes[day] === 'Holiday' ? 'bg-red-50 border-red-100' : dayTypes[day] === 'Half Day' ? 'bg-yellow-50 border-yellow-100' : 'bg-white border-gray-200'}`}>

                    <p className="text-xs font-semibold text-gray-600">
                      {day.slice(0, 3)}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {dayTypes[day] === 'Holiday' ?
                    '0' :
                    dayTypes[day] === 'Half Day' ?
                    '4' :
                    regularPeriods}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayTypes[day] === 'Holiday' ? 'Holiday' : 'periods'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Subject Allocation Tab */}
          <TabsContent value="subjects" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Subject Allocation per Week">
                <div className="space-y-3">
                  <Select
                    label="Class"
                    options={[
                    {
                      value: 'class-8a',
                      label: 'Class 8-A'
                    },
                    {
                      value: 'class-9a',
                      label: 'Class 9-A'
                    },
                    {
                      value: 'class-10a',
                      label: 'Class 10-A'
                    },
                    {
                      value: 'class-11a',
                      label: 'Class 11-A'
                    },
                    {
                      value: 'class-12a',
                      label: 'Class 12-A'
                    }]
                    }
                    value={selectedClass}
                    onChange={setSelectedClass} />

                  <div className="space-y-2">
                    {[
                    {
                      subject: 'Mathematics',
                      periods: 6
                    },
                    {
                      subject: 'Science / Physics',
                      periods: 5
                    },
                    {
                      subject: 'English',
                      periods: 5
                    },
                    {
                      subject: 'Social Studies / History',
                      periods: 4
                    },
                    {
                      subject: 'Hindi / Second Language',
                      periods: 4
                    },
                    {
                      subject: 'Computer Science',
                      periods: 2
                    },
                    {
                      subject: 'Physical Education',
                      periods: 2
                    },
                    {
                      subject: 'Art & Craft',
                      periods: 2
                    }].
                    map((s, i) =>
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 flex-1">
                          {s.subject}
                        </span>
                        <Input
                        type="number"
                        defaultValue={s.periods.toString()}
                        className="w-20 text-center" />

                        <span className="text-xs text-gray-400 w-20">
                          periods/week
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Total: <strong>30 periods/week</strong>
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<SaveIcon className="w-4 h-4" />}>

                      Save Allocation
                    </Button>
                  </div>
                </div>
              </Card>
              <Card title="Teacher-Subject Mapping">
                <div className="space-y-2">
                  {[
                  {
                    teacher: 'Mrs. Sharma',
                    subject: 'Mathematics',
                    classes: 'Class 8-A, 8-B, 9-A',
                    periods: 18
                  },
                  {
                    teacher: 'Mr. Patel',
                    subject: 'Science',
                    classes: 'Class 7-A, 8-A, 9-B',
                    periods: 15
                  },
                  {
                    teacher: 'Mrs. Verma',
                    subject: 'English',
                    classes: 'Class 6-A, 7-A, 8-A',
                    periods: 15
                  },
                  {
                    teacher: 'Mr. Kumar',
                    subject: 'Social Studies',
                    classes: 'Class 9-A, 9-B, 10-A',
                    periods: 12
                  },
                  {
                    teacher: 'Ms. Nair',
                    subject: 'Hindi',
                    classes: 'Class 8-A, 8-B, 9-A',
                    periods: 12
                  }].
                  map((m, i) =>
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium text-gray-800">
                          {m.teacher}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {m.subject}
                          </span>
                          <span className="text-xs text-gray-400">
                            {m.periods} periods/wk
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{m.classes}</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-xs h-8"
                    leftIcon={<PlusIcon className="w-3 h-3" />}>

                    Add Mapping
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Timetable Generator Tab */}
          <TabsContent value="generator" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Settings + Conflict */}
              <div className="md:col-span-1 space-y-4">
                <Card title="Generator Settings">
                  <div className="space-y-3">
                    <Select
                      label="Class"
                      options={[
                      {
                        value: '',
                        label: 'Select Class'
                      },
                      ...Array.from(
                        {
                          length: 12
                        },
                        (_, i) => ({
                          value: `class-${i + 1}`,
                          label: `Class ${i + 1}`
                        })
                      )]
                      } />

                    <Select
                      label="Section"
                      options={[
                      {
                        value: '',
                        label: 'Select Section'
                      },
                      {
                        value: 'a',
                        label: 'Section A'
                      },
                      {
                        value: 'b',
                        label: 'Section B'
                      },
                      {
                        value: 'c',
                        label: 'Section C'
                      }]
                      } />

                    <Select
                      label="Academic Year"
                      options={[
                      {
                        value: '2025-26',
                        label: '2025-26'
                      },
                      {
                        value: '2024-25',
                        label: '2024-25'
                      }]
                      } />

                    <div className="pt-2 space-y-2">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleAutoGenerate}
                        leftIcon={
                        generating ?
                        <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                        <CheckCircleIcon className="w-4 h-4" />

                        }>

                        {generating ?
                        'Generating...' :
                        'Auto-Generate Timetable'}
                      </Button>
                      <Button
                        variant="outline"
                        className={`w-full transition-colors ${manualOverride ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100' : ''}`}
                        leftIcon={<PencilIcon className="w-4 h-4" />}
                        onClick={handleEnterOverride}>

                        {manualOverride ?
                        'Override Mode Active' :
                        'Manual Override Mode'}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card title="Conflict Detection">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangleIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800">
                          Teacher Conflict
                        </p>
                        <p className="text-xs text-yellow-600">
                          Mrs. Sharma — Mon P3 double-booked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-green-800">
                          Room Allocation
                        </p>
                        <p className="text-xs text-green-600">
                          All rooms available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-green-800">
                          Period Allocation
                        </p>
                        <p className="text-xs text-green-600">
                          All subjects allocated correctly
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs">

                      Re-run Conflict Check
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right: Timetable Preview / Override Editor */}
              <div className="md:col-span-2">
                <Card
                  title={
                  manualOverride ?
                  'Manual Override Editor — Class 8-A' :
                  'Generated Timetable Preview — Class 8-A'
                  }>

                  {/* Override Mode Banner */}
                  {manualOverride &&
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <PencilIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-800">
                          Manual Override Mode Active
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          Use the dropdowns in each cell to assign subjects.
                          Changes override the auto-generated schedule.
                        </p>
                      </div>
                      <button
                      onClick={handleExitOverride}
                      className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium shrink-0">

                        <XIcon className="w-3.5 h-3.5" />
                        Exit
                      </button>
                    </div>
                  }

                  {/* Override Saved Banner */}
                  {overrideSaved && !manualOverride &&
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs font-semibold text-green-800">
                        Manual overrides saved successfully. Timetable updated.
                      </p>
                    </div>
                  }

                  {/* Empty state */}
                  {!generated && !generating && !manualOverride &&
                  <div className="text-center py-12 text-gray-400">
                      <RefreshCwIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">
                        Select class and click Auto-Generate to preview
                        timetable
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        Or use Manual Override Mode to build from scratch
                      </p>
                    </div>
                  }

                  {/* Generating spinner */}
                  {generating &&
                  <div className="text-center py-12 text-blue-500">
                      <RefreshCwIcon className="w-10 h-10 mx-auto mb-2 animate-spin" />
                      <p className="text-sm">Generating optimal timetable...</p>
                    </div>
                  }

                  {/* Timetable grid (generated or override) */}
                  {(generated || manualOverride) && !generating &&
                  <>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr
                            className={
                            manualOverride ? 'bg-amber-50' : 'bg-gray-50'
                            }>

                              <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-600 w-14">
                                Day
                              </th>
                              {[
                            'P1',
                            'P2',
                            'Break',
                            'P3',
                            'P4',
                            'Lunch',
                            'P5',
                            'P6'].
                            map((p) =>
                            <th
                              key={p}
                              className={`border border-gray-200 px-2 py-2 text-center font-semibold text-gray-600 ${p === 'Break' || p === 'Lunch' ? 'bg-gray-100 text-gray-400 w-12' : 'w-20'}`}>

                                  {p}
                                </th>
                            )}
                            </tr>
                          </thead>
                          <tbody>
                            {displayRows.map((row) =>
                          <tr key={row.day} className="hover:bg-gray-50/50">
                                <td className="border border-gray-200 px-2 py-2 font-semibold text-gray-700 bg-gray-50">
                                  {row.day}
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
                            map((p) => {
                              if (p === 'Break' || p === 'Lunch') {
                                return (
                                  <td
                                    key={p}
                                    className="border border-gray-200 px-1 py-2 text-center text-gray-400 bg-gray-50">

                                        {p}
                                      </td>);

                              }
                              const cellIdx = periodColToIdx[p];
                              const subject = row.cells[cellIdx] || '';
                              if (manualOverride) {
                                return (
                                  <td
                                    key={p}
                                    className="border border-amber-200 px-1 py-1 text-center bg-amber-50/20">

                                        <select
                                      value={subject}
                                      onChange={(e) =>
                                      handleCellChange(
                                        row.day,
                                        cellIdx,
                                        e.target.value
                                      )
                                      }
                                      className={`w-full text-xs rounded px-1 py-0.5 border border-gray-200 cursor-pointer focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none font-medium transition-colors ${subject ? subjectColors[subject] || 'bg-gray-100 text-gray-700' : 'bg-white text-gray-400'}`}>

                                          <option value="">— Free —</option>
                                          {subjectOptions.map((s) =>
                                      <option key={s} value={s}>
                                              {s}
                                            </option>
                                      )}
                                        </select>
                                        {subject &&
                                    teacherOptions[subject] &&
                                    teacherOptions[subject] !== '—' &&
                                    <div className="text-[9px] text-gray-400 mt-0.5 truncate px-0.5">
                                              {teacherOptions[subject]}
                                            </div>
                                    }
                                      </td>);

                              }
                              return (
                                <td
                                  key={p}
                                  className="border border-gray-200 px-1 py-2 text-center">

                                      {subject &&
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${subjectColors[subject] || 'bg-gray-100 text-gray-700'}`}>

                                          {subject}
                                        </span>
                                  }
                                    </td>);

                            })}
                              </tr>
                          )}
                          </tbody>
                        </table>
                      </div>

                      {/* Action buttons */}
                      {manualOverride ?
                    <div className="flex flex-wrap gap-2 mt-4">
                          <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<SaveIcon className="w-4 h-4" />}
                        onClick={handleSaveOverride}>

                            Save Override
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<XIcon className="w-4 h-4" />}
                        onClick={handleExitOverride}>

                            Cancel
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                        onClick={handleResetOverride}>

                            Reset to Generated
                          </Button>
                        </div> :

                    <div className="flex flex-wrap gap-2 mt-4">
                          <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<SaveIcon className="w-4 h-4" />}>

                            Approve & Save
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGenerated(false);
                          handleAutoGenerate();
                        }}>

                            Regenerate
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<PencilIcon className="w-4 h-4" />}
                        onClick={handleEnterOverride}>

                            Manual Edit
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<DownloadIcon className="w-4 h-4" />}>

                            Export PDF
                          </Button>
                        </div>
                    }
                    </>
                  }
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}