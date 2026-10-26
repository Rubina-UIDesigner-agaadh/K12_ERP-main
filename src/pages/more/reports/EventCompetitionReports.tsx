import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  DownloadIcon,
  FileTextIcon,
  PrinterIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react';

type Kind = 'Event' | 'Competition';
type Status = 'Upcoming' | 'Ongoing' | 'Completed';

interface Row {
  id: string;
  kind: Kind;
  name: string;
  category: string;
  date: string;
  audience: string;
  participants: number;
  winners: string;
  status: Status;
}

const ROWS: Row[] = [
  { id: 'EV-104', kind: 'Event', name: 'Annual Day 2026', category: 'Cultural', date: '12 Dec 2025', audience: 'Whole school', participants: 820, winners: '—', status: 'Upcoming' },
  { id: 'EV-098', kind: 'Event', name: 'Science Exhibition', category: 'Academic', date: '18 Oct 2025', audience: 'Classes 6–12', participants: 246, winners: 'Class 9-B', status: 'Completed' },
  { id: 'EV-101', kind: 'Event', name: 'Sports Day Heats', category: 'Sports', date: '04 Nov 2025', audience: 'Classes 3–12', participants: 510, winners: '—', status: 'Ongoing' },
  { id: 'CP-044', kind: 'Competition', name: 'Inter-House Debate', category: 'Literary', date: '22 Oct 2025', audience: 'Classes 8–12', participants: 48, winners: 'Blue House', status: 'Completed' },
  { id: 'CP-051', kind: 'Competition', name: 'Math Olympiad (Internal)', category: 'Academic', date: '08 Nov 2025', audience: 'Classes 6–10', participants: 132, winners: '—', status: 'Upcoming' },
  { id: 'CP-039', kind: 'Competition', name: 'Inter-School Football', category: 'Sports', date: '15 Sep 2025', audience: 'U-17', participants: 22, winners: 'Main Campus', status: 'Completed' },
  { id: 'EV-090', kind: 'Event', name: 'Independence Day Assembly', category: 'National', date: '15 Aug 2025', audience: 'Whole school', participants: 940, winners: '—', status: 'Completed' },
  { id: 'CP-047', kind: 'Competition', name: 'Art & Craft Fest', category: 'Cultural', date: '28 Oct 2025', audience: 'Classes 1–8', participants: 186, winners: 'Diya Iyer', status: 'Completed' },
];

const KIND_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'Event', label: 'Events' },
  { value: 'Competition', label: 'Competitions' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Completed', label: 'Completed' },
];

function statusBadge(status: Status) {
  const map: Record<Status, 'info' | 'warning' | 'success'> = {
    Upcoming: 'info',
    Ongoing: 'warning',
    Completed: 'success',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function EventCompetitionReports() {
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) =>
      (kind === 'all' || r.kind === kind)
      && (status === 'all' || r.status === status)
      && (q === '' || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)),
    );
  }, [kind, status, query]);

  const stats = useMemo(() => ({
    events: rows.filter((r) => r.kind === 'Event').length,
    competitions: rows.filter((r) => r.kind === 'Competition').length,
    participants: rows.reduce((n, r) => n + r.participants, 0),
    completed: rows.filter((r) => r.status === 'Completed').length,
  }), [rows]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'kind', header: 'Type', render: (r: Row) => <Badge variant={r.kind === 'Competition' ? 'warning' : 'info'}>{r.kind}</Badge> },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    { key: 'date', header: 'Date' },
    { key: 'audience', header: 'Audience' },
    { key: 'participants', header: 'Participants' },
    { key: 'winners', header: 'Winner / result' },
    { key: 'status', header: 'Status', render: (r: Row) => statusBadge(r.status) },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Event and Competition Reports</h1>
          <p className="text-sm text-gray-500">Participation, results and status across school events and competitions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PrinterIcon className="mr-1 h-4 w-4" /> Print</Button>
          <Button variant="primary" size="sm"><DownloadIcon className="mr-1 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Type" value={kind} options={KIND_OPTIONS} onChange={(e) => setKind(e.target.value)} />
          <Select label="Status" value={status} options={STATUS_OPTIONS} onChange={(e) => setStatus(e.target.value)} />
          <Input label="Search" placeholder="Name, ID or category" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-600"><FileTextIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Events</p><p className="text-lg font-bold">{stats.events}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2 text-amber-600"><StarIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Competitions</p><p className="text-lg font-bold">{stats.competitions}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600"><UsersIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Participants</p><p className="text-lg font-bold">{stats.participants}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600"><StarIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold">{stats.completed}</p></div>
          </div>
        </Card>
      </div>

      <Card title="Report rows">
        <Table columns={columns} data={rows} emptyMessage="No events or competitions match the filters" />
      </Card>
    </div>
  );
}

export default EventCompetitionReports;
