import React, { useState } from 'react';
import { Search, Save, RotateCcw, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CorrectionRow {
  id: string;
  name: string;
  department: string;
  date: string;
  current: string;
  inTime: string;
  outTime: string;
}

const ROSTER: CorrectionRow[] = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', date: '2026-10-08', current: 'Present', inTime: '09:02', outTime: '17:10' },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', date: '2026-10-08', current: 'Absent', inTime: '', outTime: '' },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', date: '2026-10-08', current: 'Late', inTime: '09:41', outTime: '17:05' },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', date: '2026-10-08', current: 'Present', inTime: '08:58', outTime: '17:00' },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', date: '2026-10-08', current: 'Not marked', inTime: '', outTime: '' }
];

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Half Day', 'On Duty', 'Leave'];

export function EmployeeAttendanceAdmin({ embedded = false }: { embedded?: boolean } = {}) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [date, setDate] = useState('2026-10-08');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState('Present');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [rows, setRows] = useState(ROSTER);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = rows.filter((row) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || row.name.toLowerCase().includes(term) || row.id.toLowerCase().includes(term);
    const matchesDept = department === 'all' || row.department === department;
    const matchesDate = row.date === date;
    return matchesSearch && matchesDept && matchesDate;
  });

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const pick = (row: CorrectionRow) => {
    setSelectedId(row.id);
    setStatus(row.current === 'Not marked' ? 'Present' : row.current);
    setInTime(row.inTime);
    setOutTime(row.outTime);
    setReason('');
  };

  const apply = () => {
    if (!selected) {
      setNotice('Select an employee first.');
      return;
    }
    if (reason.trim().length < 8) {
      setNotice('Reason must be at least 8 characters for audit.');
      return;
    }
    setRows((prev) => prev.map((row) => row.id === selected.id ? { ...row, current: status, inTime, outTime } : row));
    setNotice(`Correction saved for ${selected.name}: ${status}${inTime ? ` (${inTime}–${outTime || 'open'})` : ''}.`);
  };

  const reset = () => {
    setSearch('');
    setDepartment('all');
    setHasSearched(false);
    setSelectedId(null);
    setReason('');
    setNotice(null);
  };

  return (
    <div className={embedded ? 'p-5' : 'p-6'}>
      {!embedded && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Employee Attendance Admin</h1>
          <p className="text-sm text-gray-500">Search an employee and apply a manual correction</p>
        </div>
      )}

      {notice && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search employee</label>
            <Search className="w-4 h-4 absolute left-3 top-8 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setHasSearched(true); }} placeholder="Name or employee ID" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="all">All Departments</option>
              {Array.from(new Set(ROSTER.map((r) => r.department))).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Clear Search</Button>
          <Button onClick={() => setHasSearched(true)}><Search className="w-4 h-4 mr-2" /> Search Records</Button>
        </div>

        {hasSearched && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Emp ID', 'Employee', 'Department', 'Current', 'In', 'Out'].map((h) =>
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((row) => (
                  <tr key={row.id} onClick={() => pick(row)} className={`cursor-pointer hover:bg-indigo-50 ${selectedId === row.id ? 'bg-indigo-50' : ''}`}>
                    <td className="px-3 py-2 font-medium text-blue-600">{row.id}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{row.name}</td>
                    <td className="px-3 py-2 text-gray-600">{row.department}</td>
                    <td className="px-3 py-2">{row.current}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.inTime || '—'}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.outTime || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No records for this search.</p>}
          </div>
        )}

        {selected && (
          <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/40 space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">{selected.name}</h3>
              <span className="text-sm text-gray-500">{selected.id} · {selected.department}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Corrected status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">In time</label>
                <input type="time" value={inTime} onChange={(e) => setInTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Out time</label>
                <input type="time" value={outTime} onChange={(e) => setOutTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex items-end text-xs text-gray-500 gap-1 pb-2"><Clock className="w-3.5 h-3.5" /> Logged for audit</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Reason / remark *</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Biometric failed at Gate 2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex justify-end">
              <Button onClick={apply}><Save className="w-4 h-4 mr-2" /> Save Correction</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeAttendanceAdmin;
