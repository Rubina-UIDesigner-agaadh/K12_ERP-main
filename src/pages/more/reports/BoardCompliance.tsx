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
  FilePlus,
  FileTextIcon,
  PrinterIcon,
} from 'lucide-react';

type ItemStatus = 'Complete' | 'In Progress' | 'Pending' | 'Overdue';

interface ComplianceItem {
  id: string;
  area: string;
  requirement: string;
  owner: string;
  due: string;
  status: ItemStatus;
}

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

const ITEMS: ComplianceItem[] = [
  { id: 'CMP-01', area: 'Affiliation', requirement: 'Annual affiliation / recognition renewal', owner: 'Admin', due: '30 Jun 2026', status: 'Complete' },
  { id: 'CMP-02', area: 'Registration', requirement: 'Student registration with the examining body', owner: 'Exam Cell', due: '30 Aug 2026', status: 'In Progress' },
  { id: 'CMP-03', area: 'Candidates', requirement: 'List of candidates for public examinations', owner: 'Exam Cell', due: '10 Nov 2026', status: 'Pending' },
  { id: 'CMP-04', area: 'Practicals', requirement: 'Practical / internal marks upload', owner: 'HODs', due: '20 Jan 2027', status: 'Pending' },
  { id: 'CMP-05', area: 'Staff', requirement: 'Teacher qualification and training log', owner: 'HR', due: '31 Mar 2026', status: 'Complete' },
  { id: 'CMP-06', area: 'Infrastructure', requirement: 'Lab, library and safety affidavit', owner: 'Admin', due: '30 Apr 2026', status: 'Overdue' },
  { id: 'CMP-07', area: 'Coursework', requirement: 'Project / coursework marks entry', owner: 'Subject Teachers', due: '15 Dec 2026', status: 'Pending' },
  { id: 'CMP-08', area: 'Timetable', requirement: 'Public exam timetable acknowledgement', owner: 'Principal', due: '05 Jan 2027', status: 'Pending' },
  { id: 'CMP-09', area: 'Returns', requirement: 'Centre returns and attendance sheets', owner: 'Exam Cell', due: '28 Feb 2027', status: 'Pending' },
  { id: 'CMP-10', area: 'Enrolment', requirement: 'Student index / enrolment number allotment', owner: 'Exam Cell', due: '10 Aug 2026', status: 'Complete' },
  { id: 'CMP-11', area: 'Results', requirement: 'Internal assessment upload', owner: 'Exam Cell', due: '18 Jan 2027', status: 'Pending' },
  { id: 'CMP-12', area: 'UDISE+', requirement: 'UDISE+ school data sync', owner: 'Academic Office', due: '30 Sep 2026', status: 'Overdue' },
];

function statusBadge(status: ItemStatus) {
  const map: Record<ItemStatus, 'success' | 'warning' | 'danger' | 'info'> = {
    Complete: 'success',
    'In Progress': 'info',
    Pending: 'warning',
    Overdue: 'danger',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function printItem(item: ComplianceItem, year: string, branchLabel: string) {
  const html = `<!doctype html><html><head><title>${item.requirement}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111}
      h1{font-size:18px;margin:0 0 4px}
      p{font-size:12px;color:#555;margin:0 0 16px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{border:1px solid #d1d5db;padding:8px;text-align:left}
      th{background:#f3f4f6;width:160px}
    </style></head><body>
    <h1>${item.requirement}</h1>
    <p>${year} · ${branchLabel}</p>
    <table>
      <tr><th>ID</th><td>${item.id}</td></tr>
      <tr><th>Area</th><td>${item.area}</td></tr>
      <tr><th>Requirement</th><td>${item.requirement}</td></tr>
      <tr><th>Owner</th><td>${item.owner}</td></tr>
      <tr><th>Due</th><td>${item.due}</td></tr>
      <tr><th>Status</th><td>${item.status}</td></tr>
    </table></body></html>`;
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
    document.body.removeChild(frame);
  }, 300);
}

export function BoardCompliance() {
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('2025-26');
  const [generatedAt, setGeneratedAt] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');

  const branchLabel =
    branch === 'all' ? 'All branches' : BRANCH_OPTIONS.find((b) => b.value === branch)?.label || branch;

  const stats = useMemo(() => {
    const total = ITEMS.length;
    const complete = ITEMS.filter((i) => i.status === 'Complete').length;
    const pending = ITEMS.filter((i) => i.status === 'Pending' || i.status === 'In Progress').length;
    const overdue = ITEMS.filter((i) => i.status === 'Overdue').length;
    const pct = total ? Math.round((complete / total) * 100) : 0;
    return { total, complete, pending, overdue, pct };
  }, []);

  const handleGenerate = (item: ComplianceItem) => {
    const stamp = new Date().toLocaleString('en-IN');
    setGeneratedAt((prev) => ({ ...prev, [item.id]: stamp }));
    setNotice(`Generated ${item.requirement} for ${year} · ${branchLabel} at ${stamp}`);
  };

  const handleDownload = (item: ComplianceItem) => {
    const header = ['ID', 'Area', 'Requirement', 'Owner', 'Due', 'Status', 'Year', 'Branch'];
    const line = [item.id, item.area, item.requirement, item.owner, item.due, item.status, year, branchLabel]
      .map(csvEscape)
      .join(',');
    const blob = new Blob([[header.join(','), line].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${item.id}-compliance.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setNotice(`Downloaded ${item.id}`);
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'area', header: 'Area' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'owner', header: 'Owner' },
    { key: 'due', header: 'Due' },
    { key: 'status', header: 'Status', render: (row: ComplianceItem) => statusBadge(row.status) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ComplianceItem) => (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            <Button variant="outline" size="xs" onClick={() => printItem(row, year, branchLabel)}>
              <PrinterIcon className="h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="outline" size="xs" onClick={() => handleDownload(row)}>
              <DownloadIcon className="h-3.5 w-3.5" /> Download
            </Button>
            <Button variant="primary" size="xs" onClick={() => handleGenerate(row)}>
              <FilePlus className="h-3.5 w-3.5" /> Generate
            </Button>
          </div>
          {generatedAt[row.id] && (
            <p className="text-[10px] text-gray-400">Generated {generatedAt[row.id]}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Board Compliance</h1>
        <p className="text-sm text-gray-500">
          Affiliation, registration, examination and statutory filings
        </p>
      </div>

      {notice && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {notice}
        </div>
      )}

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Complete</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.complete}/{stats.total}
              </p>
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
              <p className="text-xs text-gray-500">Overall readiness</p>
              <p className="text-lg font-bold text-gray-900">{stats.pct}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Table columns={columns} data={ITEMS} emptyMessage="No compliance items" />
      </Card>
    </div>
  );
}

export default BoardCompliance;
