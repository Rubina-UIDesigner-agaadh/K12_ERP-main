import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { MessageSquare, CheckSquare, Search, Filter, RefreshCw, CheckCircle } from 'lucide-react';

type FollowStatus = 'Pending' | 'Critical' | 'Resolved';

interface FollowUpStudent {
  id: string;
  firstName: string;
  lastName: string;
  grNo: string;
  suId: string;
  class: string;
  section: string;
  department: string;
  branch: string;
  batch: string;
  absentDays: number;
  consecutive: number;
  lastPresent: string;
  parentName: string;
  contact: string;
  lastFollowUp: string;
  status: FollowStatus;
}

const INITIAL_STUDENTS: FollowUpStudent[] = [
  { id: '1', firstName: 'Rohan', lastName: 'Gupta', grNo: 'GR-2024-101', suId: 'STU-101', class: '8', section: 'C', department: 'Science', branch: 'Main', batch: '2024-25', absentDays: 5, consecutive: 3, lastPresent: '2026-10-28', parentName: 'Suresh Gupta', contact: '9876543210', lastFollowUp: '2026-10-30 (Call)', status: 'Pending' },
  { id: '2', firstName: 'Sneha', lastName: 'Singh', grNo: 'GR-2024-102', suId: 'STU-102', class: '9', section: 'A', department: 'Arts', branch: 'North', batch: '2024-25', absentDays: 8, consecutive: 2, lastPresent: '2026-10-25', parentName: 'Raj Singh', contact: '9876543211', lastFollowUp: 'None', status: 'Critical' },
  { id: '3', firstName: 'Aarav', lastName: 'Patel', grNo: 'GR-2024-103', suId: 'STU-103', class: '10', section: 'A', department: 'Science', branch: 'Main', batch: '2024-25', absentDays: 4, consecutive: 1, lastPresent: '2026-11-03', parentName: 'Meera Patel', contact: '9876543212', lastFollowUp: '2026-11-04 (Reminder)', status: 'Pending' },
  { id: '4', firstName: 'Zara', lastName: 'Khan', grNo: 'GR-2024-104', suId: 'STU-104', class: '10', section: 'B', department: 'Commerce', branch: 'West', batch: '2024-25', absentDays: 12, consecutive: 5, lastPresent: '2026-10-20', parentName: 'Imran Khan', contact: '9876543213', lastFollowUp: 'None', status: 'Critical' },
  { id: '5', firstName: 'Vihaan', lastName: 'Sharma', grNo: 'GR-2024-105', suId: 'STU-105', class: '11', section: 'A', department: 'Science', branch: 'South', batch: '2025-26', absentDays: 3, consecutive: 3, lastPresent: '2026-11-01', parentName: 'Anita Sharma', contact: '9876543214', lastFollowUp: '2026-11-02 (Reminder)', status: 'Pending' },
  { id: '6', firstName: 'Ananya', lastName: 'Reddy', grNo: 'GR-2024-106', suId: 'STU-106', class: '12', section: 'B', department: 'Commerce', branch: 'Main', batch: '2023-24', absentDays: 6, consecutive: 0, lastPresent: '2026-11-04', parentName: 'Kiran Reddy', contact: '9876543215', lastFollowUp: 'None', status: 'Pending' },
  { id: '7', firstName: 'Kabir', lastName: 'Mehta', grNo: 'GR-2024-107', suId: 'STU-107', class: '9', section: 'C', department: 'Arts', branch: 'North', batch: '2024-25', absentDays: 9, consecutive: 4, lastPresent: '2026-10-22', parentName: 'Nisha Mehta', contact: '9876543216', lastFollowUp: '2026-10-24 (Reminder)', status: 'Critical' },
  { id: '8', firstName: 'Diya', lastName: 'Nair', grNo: 'GR-2024-108', suId: 'STU-108', class: '8', section: 'A', department: 'Science', branch: 'West', batch: '2025-26', absentDays: 2, consecutive: 2, lastPresent: '2026-11-02', parentName: 'Ravi Nair', contact: '9876543217', lastFollowUp: 'None', status: 'Pending' },
  { id: '9', firstName: 'Ishaan', lastName: 'Joshi', grNo: 'GR-2024-109', suId: 'STU-109', class: '11', section: 'B', department: 'Arts', branch: 'South', batch: '2023-24', absentDays: 7, consecutive: 1, lastPresent: '2026-10-30', parentName: 'Pooja Joshi', contact: '9876543218', lastFollowUp: '2026-11-01 (Reminder)', status: 'Resolved' },
  { id: '10', firstName: 'Myra', lastName: 'Desai', grNo: 'GR-2024-110', suId: 'STU-110', class: '12', section: 'A', department: 'Commerce', branch: 'Main', batch: '2024-25', absentDays: 11, consecutive: 6, lastPresent: '2026-10-18', parentName: 'Amit Desai', contact: '9876543219', lastFollowUp: 'None', status: 'Critical' }
];

const EMPTY_FILTERS = {
  search: '',
  grNo: '',
  suId: '',
  firstName: '',
  lastName: '',
  department: '',
  class: '',
  section: '',
  branch: '',
  batch: '',
  status: '',
  absence: '',
  lastPresentFrom: '',
  lastPresentTo: ''
};

function todayLabel() {
  return new Date().toISOString().slice(0, 10);
}

export function AttendanceFollowUp() {
  const [students, setStudents] = useState<FollowUpStudent[]>(INITIAL_STUDENTS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [notice, setNotice] = useState('');

  const setFilter = (key: keyof typeof EMPTY_FILTERS, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    return students.filter((row) => {
      const q = applied.search.trim().toLowerCase();
      if (q) {
        const hay = `${row.firstName} ${row.lastName} ${row.grNo} ${row.suId} ${row.parentName} ${row.contact}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (applied.grNo && !row.grNo.toLowerCase().includes(applied.grNo.toLowerCase())) return false;
      if (applied.suId && !row.suId.toLowerCase().includes(applied.suId.toLowerCase())) return false;
      if (applied.firstName && !row.firstName.toLowerCase().includes(applied.firstName.toLowerCase())) return false;
      if (applied.lastName && !row.lastName.toLowerCase().includes(applied.lastName.toLowerCase())) return false;
      if (applied.department && row.department !== applied.department) return false;
      if (applied.class && row.class !== applied.class) return false;
      if (applied.section && row.section !== applied.section) return false;
      if (applied.branch && row.branch !== applied.branch) return false;
      if (applied.batch && row.batch !== applied.batch) return false;
      if (applied.status && row.status !== applied.status) return false;
      if (applied.absence === '3days' && row.absentDays <= 3) return false;
      if (applied.absence === '5days' && row.absentDays <= 5) return false;
      if (applied.absence === 'consecutive' && row.consecutive < 2) return false;
      if (applied.lastPresentFrom && row.lastPresent < applied.lastPresentFrom) return false;
      if (applied.lastPresentTo && row.lastPresent > applied.lastPresentTo) return false;
      return true;
    });
  }, [students, applied]);

  const sendReminder = (ids: string[]) => {
    if (ids.length === 0) return;
    const stamp = `${todayLabel()} (Reminder)`;
    setStudents((prev) => prev.map((row) => ids.includes(row.id) ? { ...row, lastFollowUp: stamp } : row));
    setNotice(ids.length === 1
      ? `Reminder sent to parent of ${students.find((s) => s.id === ids[0])?.firstName ?? 'student'}.`
      : `Reminder sent to ${ids.length} parent(s).`);
  };

  const markResolved = (id: string) => {
    setStudents((prev) => prev.map((row) => row.id === id ? { ...row, status: 'Resolved' } : row));
    const row = students.find((s) => s.id === id);
    setNotice(`${row?.firstName ?? 'Student'} marked as resolved.`);
  };

  const columns = [
    {
      key: 'student',
      header: 'Student Details',
      render: (row: FollowUpStudent) =>
        <div>
          <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
          <div className="text-xs text-gray-500">{row.grNo} · {row.suId}</div>
          <div className="text-xs text-gray-500">Class {row.class}-{row.section} · {row.department}</div>
        </div>
    },
    {
      key: 'branch',
      header: 'Branch / Batch',
      render: (row: FollowUpStudent) =>
        <div className="text-sm">
          <div className="text-gray-900">{row.branch}</div>
          <div className="text-xs text-gray-500">{row.batch}</div>
        </div>
    },
    {
      key: 'absence',
      header: 'Absence Stats',
      render: (row: FollowUpStudent) =>
        <div className="text-sm">
          <div className="text-red-600 font-medium">{row.absentDays} Days Total</div>
          <div className="text-xs text-gray-500">{row.consecutive} Consecutive</div>
        </div>
    },
    {
      key: 'lastPresent',
      header: 'Last Present',
      render: (row: FollowUpStudent) => <span className="text-sm text-gray-700">{row.lastPresent}</span>
    },
    {
      key: 'parent',
      header: 'Parent Contact',
      render: (row: FollowUpStudent) =>
        <div className="text-sm">
          <div>{row.parentName}</div>
          <div className="text-blue-600">{row.contact}</div>
        </div>
    },
    {
      key: 'followup',
      header: 'Last Follow-up',
      render: (row: FollowUpStudent) => <span className="text-sm text-gray-600">{row.lastFollowUp}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: FollowUpStudent) =>
        <Badge variant={row.status === 'Critical' ? 'danger' : row.status === 'Resolved' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: FollowUpStudent) =>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="Send Reminder"
            disabled={row.status === 'Resolved'}
            onClick={() => sendReminder([row.id])}>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Mark Resolved"
            disabled={row.status === 'Resolved'}
            onClick={() => markResolved(row.id)}>
            <CheckSquare className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
    }
  ];

  const openIds = filtered.filter((row) => row.status !== 'Resolved').map((row) => row.id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Follow Up</h1>
          <p className="text-sm text-gray-500">Track and manage student absenteeism</p>
        </div>
        <Button variant="primary" onClick={() => sendReminder(openIds)} disabled={openIds.length === 0}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Reminder
        </Button>
      </div>

      {notice &&
      <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="flex-1">{notice}</span>
          <button type="button" className="text-green-700 hover:underline" onClick={() => setNotice('')}>Dismiss</button>
        </div>
      }

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-800">Search & Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            label="Search"
            placeholder="Name, GR No, SU ID, parent, phone"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <Input label="GR Number" placeholder="Search by GR No..." value={filters.grNo} onChange={(e) => setFilter('grNo', e.target.value)} />
          <Input label="SU ID" placeholder="Search by SU ID..." value={filters.suId} onChange={(e) => setFilter('suId', e.target.value)} />
          <Input label="First Name" placeholder="First name" value={filters.firstName} onChange={(e) => setFilter('firstName', e.target.value)} />
          <Input label="Last Name" placeholder="Last name" value={filters.lastName} onChange={(e) => setFilter('lastName', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={filters.department} onChange={(e) => setFilter('department', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Departments</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={filters.class} onChange={(e) => setFilter('class', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Classes</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select value={filters.section} onChange={(e) => setFilter('section', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select value={filters.branch} onChange={(e) => setFilter('branch', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Branches</option>
              <option value="Main">Main</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="West">West</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select value={filters.batch} onChange={(e) => setFilter('batch', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Batches</option>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Critical">Critical</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Absence Criteria</label>
            <select value={filters.absence} onChange={(e) => setFilter('absence', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
              <option value="">All Absences</option>
              <option value="3days">&gt; 3 Days</option>
              <option value="5days">&gt; 5 Days</option>
              <option value="consecutive">Consecutive Absence</option>
            </select>
          </div>
          <Input type="date" label="Last Present From" value={filters.lastPresentFrom} onChange={(e) => setFilter('lastPresentFrom', e.target.value)} />
          <Input type="date" label="Last Present To" value={filters.lastPresentTo} onChange={(e) => setFilter('lastPresentTo', e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setApplied(filters)}>
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={() => { setFilters(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">{filtered.length} student{filtered.length === 1 ? '' : 's'} matching filters</p>
        </div>
        <Table columns={columns} data={filtered} emptyMessage="No students found matching your filters" />
      </Card>
    </div>
  );
}
