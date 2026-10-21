import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  PrinterIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from 'lucide-react';

type BoardId = 'cbse' | 'cisce' | 'gseb';
type ItemStatus = 'Complete' | 'In Progress' | 'Pending' | 'Overdue';

interface ComplianceItem {
  id: string;
  area: string;
  requirement: string;
  owner: string;
  due: string;
  status: ItemStatus;
}

const BOARD_OPTIONS = [
  { value: 'cbse', label: 'CBSE' },
  { value: 'cisce', label: 'CISCE (ICSE / ISC)' },
  { value: 'gseb', label: 'GSEB' },
];

const BRANCH_OPTIONS = [
  { value: 'all', label: 'All Branches' },
  { value: 'main', label: 'Main Campus' },
  { value: 'north', label: 'North Branch' },
  { value: 'south', label: 'South Branch' },
];

const YEAR_OPTIONS = [
  { value: '2025-26', label: '2025-26' },
  { value: '2024-25', label: '2024-25' },
  { value: '2023-24', label: '2023-24' },
];

const BOARD_META: Record<BoardId, { name: string; affiliation: string; code: string; focus: string }> = {
  cbse: {
    name: 'CBSE',
    affiliation: 'Affiliation No. 430123',
    code: 'School Code 10345',
    focus: 'OASIS, LOC, registration and result-data compliance',
  },
  cisce: {
    name: 'CISCE',
    affiliation: 'CISCE Code GJ047',
    code: 'ICSE / ISC',
    focus: 'Candidate registration, coursework and board-exam returns',
  },
  gseb: {
    name: 'GSEB',
    affiliation: 'Index No. 51.123',
    code: 'Gujarat Board',
    focus: 'Index, SSC/HSC forms, science stream and result uploads',
  },
};

const BOARD_ITEMS: Record<BoardId, ComplianceItem[]> = {
  cbse: [
    { id: 'CB-01', area: 'OASIS', requirement: 'Annual OASIS data submission', owner: 'Academic Office', due: '15 Jul 2026', status: 'Complete' },
    { id: 'CB-02', area: 'Registration', requirement: 'Class IX / XI student registration', owner: 'Exam Cell', due: '30 Aug 2026', status: 'In Progress' },
    { id: 'CB-03', area: 'LOC', requirement: 'List of Candidates for Class X / XII', owner: 'Exam Cell', due: '10 Nov 2026', status: 'Pending' },
    { id: 'CB-04', area: 'Practicals', requirement: 'Practical / internal marks upload', owner: 'HODs', due: '20 Jan 2027', status: 'Pending' },
    { id: 'CB-05', area: 'Staff', requirement: 'Teacher qualification & training log', owner: 'HR', due: '31 Mar 2026', status: 'Complete' },
    { id: 'CB-06', area: 'Infrastructure', requirement: 'Lab, library and safety affidavit', owner: 'Admin', due: '30 Apr 2026', status: 'Overdue' },
  ],
  cisce: [
    { id: 'IC-01', area: 'Registration', requirement: 'ICSE / ISC candidate registration', owner: 'Exam Cell', due: '20 Sep 2026', status: 'In Progress' },
    { id: 'IC-02', area: 'Coursework', requirement: 'Project / coursework marks entry', owner: 'Subject Teachers', due: '15 Dec 2026', status: 'Pending' },
    { id: 'IC-03', area: 'Timetable', requirement: 'Board exam timetable acknowledgement', owner: 'Principal', due: '05 Jan 2027', status: 'Pending' },
    { id: 'IC-04', area: 'Returns', requirement: 'Centre returns and attendance sheets', owner: 'Exam Cell', due: '28 Feb 2027', status: 'Pending' },
    { id: 'IC-05', area: 'Affiliation', requirement: 'Annual affiliation compliance pack', owner: 'Admin', due: '30 Jun 2026', status: 'Complete' },
    { id: 'IC-06', area: 'Staff', requirement: 'CISCE teacher eligibility register', owner: 'HR', due: '31 Mar 2026', status: 'Complete' },
  ],
  gseb: [
    { id: 'GS-01', area: 'Index', requirement: 'Student index number allotment', owner: 'Exam Cell', due: '10 Aug 2026', status: 'Complete' },
    { id: 'GS-02', area: 'Forms', requirement: 'SSC / HSC exam form submission', owner: 'Class Teachers', due: '25 Sep 2026', status: 'In Progress' },
    { id: 'GS-03', area: 'Science', requirement: 'Science stream practical batch list', owner: 'Science HOD', due: '12 Dec 2026', status: 'Pending' },
    { id: 'GS-04', area: 'Results', requirement: 'Internal assessment upload', owner: 'Exam Cell', due: '18 Jan 2027', status: 'Pending' },
    { id: 'GS-05', area: 'UDISE+', requirement: 'UDISE+ school data sync', owner: 'Academic Office', due: '30 Sep 2026', status: 'Overdue' },
    { id: 'GS-06', area: 'Staff', requirement: 'GSEB teacher data confirmation', owner: 'HR', due: '31 Mar 2026', status: 'Complete' },
  ],
};

function statusBadge(status: ItemStatus) {
  const map: Record<ItemStatus, 'success' | 'warning' | 'danger' | 'info'> = {
    Complete: 'success',
    'In Progress': 'info',
    Pending: 'warning',
    Overdue: 'danger',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function BoardCompliance() {
  const [board, setBoard] = useState<BoardId>('cbse');
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('2025-26');

  const meta = BOARD_META[board];
  const items = BOARD_ITEMS[board];

  const stats = useMemo(() => {
    const total = items.length;
    const complete = items.filter((i) => i.status === 'Complete').length;
    const pending = items.filter((i) => i.status === 'Pending' || i.status === 'In Progress').length;
    const overdue = items.filter((i) => i.status === 'Overdue').length;
    const pct = total ? Math.round((complete / total) * 100) : 0;
    return { total, complete, pending, overdue, pct };
  }, [items]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'area', header: 'Area' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'owner', header: 'Owner' },
    { key: 'due', header: 'Due' },
    { key: 'status', header: 'Status', render: (row: ComplianceItem) => statusBadge(row.status) },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Board Compliance</h1>
          <p className="text-sm text-gray-500">
            One board at a time — {meta.focus}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="mr-1 h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm">
            <PrinterIcon className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="primary" size="sm">
            <DownloadIcon className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select
            label="Board"
            value={board}
            options={BOARD_OPTIONS}
            onChange={(e) => setBoard(e.target.value as BoardId)}
          />
          <Select
            label="Branch"
            value={branch}
            options={BRANCH_OPTIONS}
            onChange={(e) => setBranch(e.target.value)}
          />
          <Select
            label="Academic Year"
            value={year}
            options={YEAR_OPTIONS}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </Card>

      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
          <div>
            <p className="text-sm font-semibold text-indigo-900">{meta.name} compliance</p>
            <p className="text-xs text-indigo-700">
              {meta.affiliation} · {meta.code} · {year} · {branch === 'all' ? 'All branches' : BRANCH_OPTIONS.find((b) => b.value === branch)?.label}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Complete</p>
              <p className="text-lg font-bold text-gray-900">{stats.complete}/{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-600">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">In progress / pending</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-2 text-red-600">
              <AlertTriangleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Overdue</p>
              <p className="text-lg font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600">
              <FileTextIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Readiness</p>
              <p className="text-lg font-bold text-gray-900">{stats.pct}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title={`${meta.name} requirements`}>
        <Table columns={columns} data={items} emptyMessage="No compliance items for this board" />
      </Card>
    </div>
  );
}

export default BoardCompliance;
