import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  AlertTriangleIcon,
  DownloadIcon,
  PrinterIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from 'lucide-react';

type Result = 'Success' | 'Failed' | 'Locked';

interface LoginRow {
  id: string;
  user: string;
  role: string;
  time: string;
  ip: string;
  device: string;
  result: Result;
}

const ROWS: LoginRow[] = [
  { id: 'L-9001', user: 'admin.rao', role: 'Admin', time: '21 Oct 2025 09:12', ip: '10.12.4.21', device: 'Chrome · Windows', result: 'Success' },
  { id: 'L-9002', user: 'priya.sharma', role: 'Teacher', time: '21 Oct 2025 08:55', ip: '10.12.8.44', device: 'Chrome · Android', result: 'Success' },
  { id: 'L-9003', user: 'accounts.mehta', role: 'Finance', time: '21 Oct 2025 08:41', ip: '10.12.4.18', device: 'Edge · Windows', result: 'Success' },
  { id: 'L-9004', user: 'guest.temp', role: 'Staff', time: '21 Oct 2025 08:22', ip: '49.36.12.90', device: 'Firefox · Windows', result: 'Failed' },
  { id: 'L-9005', user: 'ramesh.patel', role: 'Teacher', time: '21 Oct 2025 07:58', ip: '10.12.8.12', device: 'Chrome · Windows', result: 'Success' },
  { id: 'L-9006', user: 'guest.temp', role: 'Staff', time: '21 Oct 2025 07:50', ip: '49.36.12.90', device: 'Firefox · Windows', result: 'Failed' },
  { id: 'L-9007', user: 'guest.temp', role: 'Staff', time: '21 Oct 2025 07:49', ip: '49.36.12.90', device: 'Firefox · Windows', result: 'Locked' },
  { id: 'L-9008', user: 'neeta.mishra', role: 'HR', time: '20 Oct 2025 18:14', ip: '10.12.4.33', device: 'Safari · iPhone', result: 'Success' },
  { id: 'L-9009', user: 'exam.cell', role: 'Exam', time: '20 Oct 2025 16:02', ip: '10.12.4.09', device: 'Chrome · Windows', result: 'Success' },
  { id: 'L-9010', user: 'librarian.das', role: 'Staff', time: '20 Oct 2025 10:27', ip: '10.12.6.02', device: 'Chrome · Windows', result: 'Success' },
];

const RESULT_OPTIONS = [
  { value: 'all', label: 'All results' },
  { value: 'Success', label: 'Success' },
  { value: 'Failed', label: 'Failed' },
  { value: 'Locked', label: 'Locked' },
];

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Exam', label: 'Exam' },
  { value: 'Staff', label: 'Staff' },
];

function resultBadge(result: Result) {
  const map: Record<Result, 'success' | 'danger' | 'warning'> = {
    Success: 'success',
    Failed: 'danger',
    Locked: 'warning',
  };
  return <Badge variant={map[result]}>{result}</Badge>;
}

export function UserLoginReports() {
  const [result, setResult] = useState('all');
  const [role, setRole] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) =>
      (result === 'all' || r.result === result)
      && (role === 'all' || r.role === role)
      && (q === '' || r.user.toLowerCase().includes(q) || r.ip.includes(q) || r.id.toLowerCase().includes(q)),
    );
  }, [result, role, query]);

  const stats = useMemo(() => ({
    total: rows.length,
    success: rows.filter((r) => r.result === 'Success').length,
    failed: rows.filter((r) => r.result === 'Failed').length,
    users: new Set(rows.map((r) => r.user)).size,
  }), [rows]);

  const columns = [
    { key: 'id', header: 'Log ID' },
    { key: 'time', header: 'Time' },
    { key: 'user', header: 'User' },
    { key: 'role', header: 'Role' },
    { key: 'ip', header: 'IP' },
    { key: 'device', header: 'Device' },
    { key: 'result', header: 'Result', render: (r: LoginRow) => resultBadge(r.result) },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Login Reports</h1>
          <p className="text-sm text-gray-500">Successful logins, failed attempts and locked accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PrinterIcon className="mr-1 h-4 w-4" /> Print</Button>
          <Button variant="primary" size="sm"><DownloadIcon className="mr-1 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Result" value={result} options={RESULT_OPTIONS} onChange={(e) => setResult(e.target.value)} />
          <Select label="Role" value={role} options={ROLE_OPTIONS} onChange={(e) => setRole(e.target.value)} />
          <Input label="Search" placeholder="User, IP or log ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600"><ShieldCheckIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Attempts</p><p className="text-lg font-bold">{stats.total}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600"><UserCheckIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Successful</p><p className="text-lg font-bold">{stats.success}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-2 text-red-600"><AlertTriangleIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Failed</p><p className="text-lg font-bold">{stats.failed}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-600"><UserCheckIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Unique users</p><p className="text-lg font-bold">{stats.users}</p></div>
          </div>
        </Card>
      </div>

      <Card title="Login activity">
        <Table columns={columns} data={rows} emptyMessage="No login rows match the filters" />
      </Card>
    </div>
  );
}

export default UserLoginReports;
