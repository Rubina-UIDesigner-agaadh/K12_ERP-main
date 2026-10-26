import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  DownloadIcon,
  PrinterIcon,
} from 'lucide-react';

interface DutyRow {
  id: string;
  teacher: string;
  department: string;
  dutyType: string;
  assigned: number;
  completed: number;
  missed: number;
  pending: number;
  lastDuty: string;
}

const ROWS: DutyRow[] = [
  { id: 'T-102', teacher: 'Mrs. Sharma', department: 'English', dutyType: 'Invigilation', assigned: 12, completed: 11, missed: 0, pending: 1, lastDuty: '18 Oct 2025' },
  { id: 'T-118', teacher: 'Mr. Verma', department: 'Mathematics', dutyType: 'Assembly', assigned: 8, completed: 6, missed: 1, pending: 1, lastDuty: '20 Oct 2025' },
  { id: 'T-091', teacher: 'Mrs. Patel', department: 'Science', dutyType: 'Break duty', assigned: 20, completed: 18, missed: 0, pending: 2, lastDuty: '21 Oct 2025' },
  { id: 'T-140', teacher: 'Mr. Nair', department: 'PE', dutyType: 'Sports ground', assigned: 16, completed: 14, missed: 2, pending: 0, lastDuty: '19 Oct 2025' },
  { id: 'T-077', teacher: 'Ms. Iyer', department: 'Computer', dutyType: 'Lab supervision', assigned: 10, completed: 10, missed: 0, pending: 0, lastDuty: '21 Oct 2025' },
  { id: 'T-155', teacher: 'Mr. Joshi', department: 'Social Studies', dutyType: 'Bus duty', assigned: 14, completed: 11, missed: 1, pending: 2, lastDuty: '17 Oct 2025' },
  { id: 'T-109', teacher: 'Mrs. Kapoor', department: 'Hindi', dutyType: 'Invigilation', assigned: 9, completed: 7, missed: 0, pending: 2, lastDuty: '16 Oct 2025' },
];

const DEPT_OPTIONS = [
  { value: 'all', label: 'All departments' },
  { value: 'English', label: 'English' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'PE', label: 'PE' },
  { value: 'Computer', label: 'Computer' },
  { value: 'Social Studies', label: 'Social Studies' },
  { value: 'Hindi', label: 'Hindi' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All duty types' },
  { value: 'Invigilation', label: 'Invigilation' },
  { value: 'Assembly', label: 'Assembly' },
  { value: 'Break duty', label: 'Break duty' },
  { value: 'Sports ground', label: 'Sports ground' },
  { value: 'Lab supervision', label: 'Lab supervision' },
  { value: 'Bus duty', label: 'Bus duty' },
];

function compliance(row: DutyRow) {
  if (!row.assigned) return 0;
  return Math.round((row.completed / row.assigned) * 100);
}

export function TeachersDutiesReports() {
  const [dept, setDept] = useState('all');
  const [dutyType, setDutyType] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) =>
      (dept === 'all' || r.department === dept)
      && (dutyType === 'all' || r.dutyType === dutyType)
      && (q === '' || r.teacher.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)),
    );
  }, [dept, dutyType, query]);

  const stats = useMemo(() => {
    const assigned = rows.reduce((n, r) => n + r.assigned, 0);
    const completed = rows.reduce((n, r) => n + r.completed, 0);
    const missed = rows.reduce((n, r) => n + r.missed, 0);
    const pending = rows.reduce((n, r) => n + r.pending, 0);
    return { assigned, completed, missed, pending, pct: assigned ? Math.round((completed / assigned) * 100) : 0 };
  }, [rows]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'teacher', header: 'Teacher' },
    { key: 'department', header: 'Department' },
    { key: 'dutyType', header: 'Duty type' },
    { key: 'assigned', header: 'Assigned' },
    { key: 'completed', header: 'Completed' },
    { key: 'missed', header: 'Missed' },
    { key: 'pending', header: 'Pending' },
    {
      key: 'compliance',
      header: 'Compliance',
      render: (r: DutyRow) => {
        const pct = compliance(r);
        return <Badge variant={pct >= 90 ? 'success' : pct >= 75 ? 'warning' : 'danger'}>{pct}%</Badge>;
      },
    },
    { key: 'lastDuty', header: 'Last duty' },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Teacher&apos;s Duties Reports</h1>
          <p className="text-sm text-gray-500">Assigned, completed and missed duties by teacher and duty type</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PrinterIcon className="mr-1 h-4 w-4" /> Print</Button>
          <Button variant="primary" size="sm"><DownloadIcon className="mr-1 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Department" value={dept} options={DEPT_OPTIONS} onChange={(e) => setDept(e.target.value)} />
          <Select label="Duty type" value={dutyType} options={TYPE_OPTIONS} onChange={(e) => setDutyType(e.target.value)} />
          <Input label="Search teacher" placeholder="Name or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600"><ClipboardListIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Assigned</p><p className="text-lg font-bold">{stats.assigned}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600"><CheckCircleIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold">{stats.completed} ({stats.pct}%)</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-2 text-red-600"><AlertTriangleIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Missed</p><p className="text-lg font-bold">{stats.missed}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2 text-amber-600"><ClipboardListIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Pending</p><p className="text-lg font-bold">{stats.pending}</p></div>
          </div>
        </Card>
      </div>

      <Card title="Teacher duty summary">
        <Table columns={columns} data={rows} emptyMessage="No duty records match the filters" />
      </Card>
    </div>
  );
}

export default TeachersDutiesReports;
