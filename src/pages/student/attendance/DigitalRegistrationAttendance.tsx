import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Download, Fingerprint, RefreshCw, Search } from 'lucide-react';

type Punch = {
  id: string;
  student: string;
  grNo: string;
  className: string;
  section: string;
  date: string;
  inTime: string;
  outTime: string;
  device: string;
  source: 'Biometric' | 'QR' | 'RFID' | 'Mobile';
  location: string;
  status: 'Present' | 'Late' | 'Early departure' | 'Mismatch';
};

const PUNCHES: Punch[] = [
  { id: 'DGT-S-001', student: 'Aarav Patel', grNo: 'GR-2024-001', className: '10', section: 'A', date: '2026-10-31', inTime: '08:06 AM', outTime: '02:05 PM', device: 'Gate-1 Fingerprint', source: 'Biometric', location: 'Main Gate', status: 'Present' },
  { id: 'DGT-S-002', student: 'Zara Khan', grNo: 'GR-2024-002', className: '10', section: 'A', date: '2026-10-31', inTime: '08:41 AM', outTime: '02:02 PM', device: 'Gate-1 Fingerprint', source: 'Biometric', location: 'Main Gate', status: 'Late' },
  { id: 'DGT-S-003', student: 'Rohan Gupta', grNo: 'GR-2024-003', className: '10', section: 'A', date: '2026-10-31', inTime: '08:04 AM', outTime: '12:40 PM', device: 'QR Kiosk-2', source: 'QR', location: 'Block B', status: 'Early departure' },
  { id: 'DGT-S-004', student: 'Priya Sharma', grNo: 'GR-2024-004', className: '10', section: 'B', date: '2026-10-31', inTime: '08:11 AM', outTime: '02:08 PM', device: 'RFID Turnstile-1', source: 'RFID', location: 'Annex Gate', status: 'Present' },
  { id: 'DGT-S-005', student: 'Arjun Singh', grNo: 'GR-2024-005', className: '10', section: 'B', date: '2026-10-30', inTime: '08:09 AM', outTime: '-', device: 'Parent App', source: 'Mobile', location: 'Remote', status: 'Mismatch' },
  { id: 'DGT-S-006', student: 'Ananya Reddy', grNo: 'GR-2024-006', className: '11', section: 'A', date: '2026-10-30', inTime: '08:02 AM', outTime: '02:10 PM', device: 'Gate-2 Face', source: 'Biometric', location: 'Main Gate', status: 'Present' },
  { id: 'DGT-S-007', student: 'Vikram Malhotra', grNo: 'GR-2024-007', className: '11', section: 'A', date: '2026-10-30', inTime: '08:37 AM', outTime: '02:01 PM', device: 'QR Kiosk-1', source: 'QR', location: 'Block A', status: 'Late' },
  { id: 'DGT-S-008', student: 'Kavya Joshi', grNo: 'GR-2024-008', className: '12', section: 'A', date: '2026-10-29', inTime: '08:08 AM', outTime: '02:04 PM', device: 'Gate-1 Fingerprint', source: 'Biometric', location: 'Main Gate', status: 'Present' }
];

export function DigitalRegistrationAttendance() {
  const [date, setDate] = useState('2026-10-31');
  const [klass, setKlass] = useState('');
  const [section, setSection] = useState('');
  const [source, setSource] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  const rows = useMemo(() => PUNCHES.filter((row) => {
    if (date && row.date !== date) return false;
    if (klass && row.className !== klass) return false;
    if (section && row.section !== section) return false;
    if (source && row.source !== source) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${row.student} ${row.grNo} ${row.device}`.toLowerCase().includes(q)) return false;
    return true;
  }), [date, klass, section, source, search]);

  const badge = (status: Punch['status']) => {
    if (status === 'Present') return 'success';
    if (status === 'Late') return 'warning';
    if (status === 'Early departure') return 'info';
    return 'danger';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Registration Attendance</h1>
          <p className="text-sm text-gray-500">Attendance captured from biometric, QR, RFID and mobile devices. This page shows punches only — it does not import or overwrite the register.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setNotice('Latest device punches refreshed.')}><RefreshCw className="mr-1 h-4 w-4" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => setNotice('Digital attendance exported.')}><Download className="mr-1 h-4 w-4" />Export</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="grid gap-4 p-4 md:grid-cols-5">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select label="Class" value={klass} onChange={(e) => setKlass(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All Classes' }, { value: '10', label: 'Class 10' }, { value: '11', label: 'Class 11' }, { value: '12', label: 'Class 12' }]} />
          <Select label="Section" value={section} onChange={(e) => setSection(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All Sections' }, { value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }]} />
          <Select label="Source" value={source} onChange={(e) => setSource(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All sources' }, { value: 'Biometric', label: 'Biometric' }, { value: 'QR', label: 'QR' }, { value: 'RFID', label: 'RFID' }, { value: 'Mobile', label: 'Mobile' }]} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Student, GR No, device" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Punches', value: String(rows.length) },
          { label: 'Present', value: String(rows.filter((r) => r.status === 'Present').length) },
          { label: 'Late', value: String(rows.filter((r) => r.status === 'Late').length) },
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
                {['Student', 'Class', 'In', 'Out', 'Device', 'Source', 'Location', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900">{row.student}</p>
                    <p className="text-xs text-gray-500">{row.grNo}</p>
                  </td>
                  <td className="px-3 py-2">{row.className}-{row.section}</td>
                  <td className="px-3 py-2">{row.inTime}</td>
                  <td className="px-3 py-2">{row.outTime}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1"><Fingerprint className="h-3.5 w-3.5 text-gray-400" />{row.device}</span>
                  </td>
                  <td className="px-3 py-2"><Badge variant="secondary">{row.source}</Badge></td>
                  <td className="px-3 py-2 text-gray-600">{row.location}</td>
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

export default DigitalRegistrationAttendance;
