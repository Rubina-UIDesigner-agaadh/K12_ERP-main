import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Download, Fingerprint, RefreshCw, Search } from 'lucide-react';

type Punch = {
  id: string;
  employee: string;
  empId: string;
  department: string;
  designation: string;
  date: string;
  inTime: string;
  outTime: string;
  device: string;
  source: 'Biometric' | 'QR' | 'RFID' | 'Mobile';
  location: string;
  shift: string;
  status: 'Present' | 'Late' | 'Early departure' | 'Overtime' | 'Mismatch';
};

const PUNCHES: Punch[] = [
  { id: 'DGT-E-001', employee: 'Rajesh Kumar', empId: 'EMP-1001', department: 'Science', designation: 'PGT Physics', date: '2026-10-31', inTime: '07:52 AM', outTime: '04:10 PM', device: 'Staff Gate Fingerprint', source: 'Biometric', location: 'Staff Gate', shift: 'General', status: 'Present' },
  { id: 'DGT-E-002', employee: 'Priya Nair', empId: 'EMP-1002', department: 'Mathematics', designation: 'TGT Maths', date: '2026-10-31', inTime: '08:28 AM', outTime: '04:02 PM', device: 'Staff Gate Fingerprint', source: 'Biometric', location: 'Staff Gate', shift: 'General', status: 'Late' },
  { id: 'DGT-E-003', employee: 'Anil Patel', empId: 'EMP-1008', department: 'Administration', designation: 'Clerk', date: '2026-10-31', inTime: '08:00 AM', outTime: '07:15 PM', device: 'Admin RFID', source: 'RFID', location: 'Office Block', shift: 'General', status: 'Overtime' },
  { id: 'DGT-E-004', employee: 'Meera Iyer', empId: 'EMP-1011', department: 'Languages', designation: 'PGT English', date: '2026-10-31', inTime: '07:55 AM', outTime: '01:20 PM', device: 'QR Staff Kiosk', source: 'QR', location: 'Block C', shift: 'General', status: 'Early departure' },
  { id: 'DGT-E-005', employee: 'Sunil Yadav', empId: 'EMP-1022', department: 'Sports', designation: 'Coach', date: '2026-10-30', inTime: '06:40 AM', outTime: '02:00 PM', device: 'Sports Gate Face', source: 'Biometric', location: 'Sports Complex', shift: 'Morning', status: 'Present' },
  { id: 'DGT-E-006', employee: 'Kavita Shah', empId: 'EMP-1014', department: 'Administration', designation: 'Accountant', date: '2026-10-30', inTime: '08:05 AM', outTime: '-', device: 'Payroll App', source: 'Mobile', location: 'Remote', shift: 'General', status: 'Mismatch' },
  { id: 'DGT-E-007', employee: 'Rohit Desai', empId: 'EMP-1019', department: 'Science', designation: 'Lab Assistant', date: '2026-10-29', inTime: '07:50 AM', outTime: '04:40 PM', device: 'Lab Fingerprint', source: 'Biometric', location: 'Science Lab', shift: 'General', status: 'Overtime' }
];

export function DigitalRegistrationAttendanceHr() {
  const [date, setDate] = useState('2026-10-31');
  const [department, setDepartment] = useState('');
  const [source, setSource] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  const rows = useMemo(() => PUNCHES.filter((row) => {
    if (date && row.date !== date) return false;
    if (department && row.department !== department) return false;
    if (source && row.source !== source) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${row.employee} ${row.empId} ${row.device}`.toLowerCase().includes(q)) return false;
    return true;
  }), [date, department, source, search]);

  const badge = (status: Punch['status']) => {
    if (status === 'Present') return 'success';
    if (status === 'Late' || status === 'Overtime') return 'warning';
    if (status === 'Early departure') return 'info';
    return 'danger';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Registration Attendance</h1>
          <p className="text-sm text-gray-500">Staff attendance captured from biometric, QR, RFID and mobile devices. Overtime hours from these punches feed Timesheets on Overtime & Additional Earnings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setNotice('Latest staff punches refreshed.')}><RefreshCw className="mr-1 h-4 w-4" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => setNotice('Staff digital attendance exported.')}><Download className="mr-1 h-4 w-4" />Export</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="grid gap-4 p-4 md:grid-cols-4">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select label="Department" value={department} onChange={(e) => setDepartment(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All departments' }, { value: 'Science', label: 'Science' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Administration', label: 'Administration' }, { value: 'Sports', label: 'Sports' }, { value: 'Languages', label: 'Languages' }]} />
          <Select label="Source" value={source} onChange={(e) => setSource(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All sources' }, { value: 'Biometric', label: 'Biometric' }, { value: 'QR', label: 'QR' }, { value: 'RFID', label: 'RFID' }, { value: 'Mobile', label: 'Mobile' }]} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Employee, ID, device" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Punches', value: String(rows.length) },
          { label: 'Present', value: String(rows.filter((r) => r.status === 'Present').length) },
          { label: 'Late / OT', value: String(rows.filter((r) => r.status === 'Late' || r.status === 'Overtime').length) },
          { label: 'Exceptions', value: String(rows.filter((r) => r.status === 'Mismatch' || r.status === 'Early departure').length) }
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                {['Employee', 'Department', 'Shift', 'In', 'Out', 'Device', 'Source', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900">{row.employee}</p>
                    <p className="text-xs text-gray-500">{row.empId} · {row.designation}</p>
                  </td>
                  <td className="px-3 py-2">{row.department}</td>
                  <td className="px-3 py-2">{row.shift}</td>
                  <td className="px-3 py-2">{row.inTime}</td>
                  <td className="px-3 py-2">{row.outTime}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1"><Fingerprint className="h-3.5 w-3.5 text-gray-400" />{row.device}</span>
                  </td>
                  <td className="px-3 py-2"><Badge variant="secondary">{row.source}</Badge></td>
                  <td className="px-3 py-2"><Badge variant={badge(row.status)}>{row.status}</Badge></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">No digital punches for these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DigitalRegistrationAttendanceHr;
