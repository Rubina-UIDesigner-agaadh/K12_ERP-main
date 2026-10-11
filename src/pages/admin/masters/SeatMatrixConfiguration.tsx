import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Download, Lock, Plus, Save, Search, Unlock } from 'lucide-react';

type QuotaKey = 'general' | 'obc' | 'sc' | 'st' | 'ews' | 'minority' | 'staffWard' | 'management' | 'nri' | 'cwsn';
interface SeatRow {
  id: string;
  year: string;
  board: string;
  program: string;
  className: string;
  stream: string;
  shift: string;
  campus: string;
  total: number;
  male: number;
  female: number;
  other: number;
  quotas: Record<QuotaKey, number>;
  occupied: number;
  waitlist: number;
  overAllot: boolean;
  frozen: boolean;
  remarks: string;
}

const YEARS = ['2025-26', '2026-27', '2027-28'];
const BOARDS = ['CBSE', 'ICSE', 'State', 'IB', 'Cambridge'];
const PROGRAMS = ['Day School', 'Boarding', 'Pre-Primary', 'Senior Secondary'];
const CLASSES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const STREAMS = ['N/A', 'Science', 'Commerce', 'Arts', 'Vocational'];
const SHIFTS = ['Morning', 'Afternoon', 'Full Day'];
const CAMPUSES = ['Main Campus', 'North Campus', 'East Campus', 'West Campus'];
const QUOTAS: { key: QuotaKey; label: string }[] = [
  { key: 'general', label: 'General' }, { key: 'obc', label: 'OBC' }, { key: 'sc', label: 'SC' },
  { key: 'st', label: 'ST' }, { key: 'ews', label: 'EWS' }, { key: 'minority', label: 'Minority' },
  { key: 'staffWard', label: 'Staff Ward' }, { key: 'management', label: 'Management' },
  { key: 'nri', label: 'NRI / PIO' }, { key: 'cwsn', label: 'CWSN' }
];
const emptyQuotas = (): Record<QuotaKey, number> => QUOTAS.reduce((acc, q) => ({ ...acc, [q.key]: 0 }), {} as Record<QuotaKey, number>);
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const SEED: SeatRow[] = [
  { id: 'SM-001', year: '2026-27', board: 'CBSE', program: 'Day School', className: '1', stream: 'N/A', shift: 'Morning', campus: 'Main Campus', total: 40, male: 20, female: 20, other: 0, quotas: { ...emptyQuotas(), general: 20, obc: 8, sc: 4, st: 2, ews: 4, staffWard: 2 }, occupied: 28, waitlist: 6, overAllot: false, frozen: false, remarks: 'Standard section A' },
  { id: 'SM-002', year: '2026-27', board: 'CBSE', program: 'Day School', className: '11', stream: 'Science', shift: 'Morning', campus: 'Main Campus', total: 36, male: 18, female: 18, other: 0, quotas: { ...emptyQuotas(), general: 18, obc: 6, sc: 4, ews: 4, management: 2, nri: 2 }, occupied: 36, waitlist: 12, overAllot: true, frozen: true, remarks: 'Science closed after cutoff' },
  { id: 'SM-003', year: '2026-27', board: 'CBSE', program: 'Pre-Primary', className: 'Nursery', stream: 'N/A', shift: 'Morning', campus: 'North Campus', total: 30, male: 15, female: 15, other: 0, quotas: { ...emptyQuotas(), general: 16, staffWard: 4, ews: 4, minority: 4, cwsn: 2 }, occupied: 11, waitlist: 0, overAllot: false, frozen: false, remarks: '' }
];

export function SeatMatrixConfiguration() {
  const [rows, setRows] = useState<SeatRow[]>(SEED);
  const [q, setQ] = useState('');
  const [year, setYear] = useState('2026-27');
  const [campus, setCampus] = useState('All');
  const [klass, setKlass] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SeatRow | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const blank = (): SeatRow => ({
    id: '', year: '2026-27', board: 'CBSE', program: 'Day School', className: '1', stream: 'N/A',
    shift: 'Morning', campus: 'Main Campus', total: 40, male: 20, female: 20, other: 0,
    quotas: { ...emptyQuotas(), general: 40 }, occupied: 0, waitlist: 0, overAllot: false, frozen: false, remarks: ''
  });

  const filtered = rows.filter((r) =>
    (year === 'All' || r.year === year) &&
    (campus === 'All' || r.campus === campus) &&
    (klass === 'All' || r.className === klass) &&
    (!q || `${r.className} ${r.stream} ${r.campus} ${r.program}`.toLowerCase().includes(q.toLowerCase()))
  );

  const remaining = (r: SeatRow) => Math.max(0, r.total - r.occupied);
  const quotaSum = (r: SeatRow) => QUOTAS.reduce((s, q) => s + (r.quotas[q.key] || 0), 0);
  const genderSum = (r: SeatRow) => r.male + r.female + r.other;

  const validate = (r: SeatRow) => {
    const e: string[] = [];
    if (!r.year || !r.board || !r.program || !r.className || !r.campus) e.push('Academic year, board, program, class and campus are required.');
    if (r.total <= 0) e.push('Total sanctioned seats must be greater than 0.');
    if (genderSum(r) > r.total) e.push('Male + Female + Other cannot exceed total seats.');
    if (quotaSum(r) > r.total) e.push('Quota seats cannot exceed total sanctioned seats.');
    if (r.occupied > r.total && !r.overAllot) e.push('Occupied seats exceed total. Enable over-allotment or reduce occupied.');
    if (r.frozen) e.push('Frozen matrices cannot be edited. Unfreeze first.');
    return e;
  };

  const save = () => {
    if (!editing) return;
    const e = validate(editing);
    if (e.length) { setErrors(e); return; }
    setErrors([]);
    if (editing.id) setRows((list) => list.map((r) => r.id === editing.id ? editing : r));
    else setRows((list) => [{ ...editing, id: `SM-${String(list.length + 1).padStart(3, '0')}` }, ...list]);
    setOpen(false);
    setNotice('Seat matrix saved.');
  };

  const totals = useMemo(() => ({
    sanctioned: filtered.reduce((s, r) => s + r.total, 0),
    occupied: filtered.reduce((s, r) => s + r.occupied, 0),
    remaining: filtered.reduce((s, r) => s + remaining(r), 0),
    waitlist: filtered.reduce((s, r) => s + r.waitlist, 0)
  }), [filtered]);

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seat Matrix Configuration</h1>
          <p className="text-sm text-gray-500">Define sanctioned seats by class, stream, campus and quota.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNotice('Seat matrix exported.')}><Download className="w-4 h-4 mr-1" /> Export</Button>
          <Button variant="primary" onClick={() => { setEditing(blank()); setErrors([]); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add Matrix</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Sanctioned', totals.sanctioned], ['Occupied', totals.occupied], ['Remaining', totals.remaining], ['Waitlist', totals.waitlist]
        ].map(([l, v]) => (
          <div key={String(l)} className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold">{v}</p><p className="text-xs text-gray-500">{l}</p></div>
        ))}
      </div>

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input className={`${inputClass} pl-9`} placeholder="Search class / stream / campus" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={inputClass} value={year} onChange={(e) => setYear(e.target.value)}>{['All', ...YEARS].map((y) => <option key={y}>{y}</option>)}</select>
          <select className={inputClass} value={campus} onChange={(e) => setCampus(e.target.value)}><option>All</option>{CAMPUSES.map((c) => <option key={c}>{c}</option>)}</select>
          <select className={inputClass} value={klass} onChange={(e) => setKlass(e.target.value)}><option>All</option>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </Card>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Class / Stream', 'Campus · Shift', 'Total', 'Gender', 'Occupied', 'Remaining', 'Waitlist', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2"><p className="font-medium">Class {r.className} · {r.stream}</p><p className="text-xs text-gray-500">{r.year} · {r.board} · {r.program}</p></td>
                <td className="px-3 py-2">{r.campus}<br /><span className="text-xs text-gray-500">{r.shift}</span></td>
                <td className="px-3 py-2 font-semibold">{r.total}</td>
                <td className="px-3 py-2 text-xs">M {r.male} · F {r.female} · O {r.other}</td>
                <td className="px-3 py-2">{r.occupied}</td>
                <td className="px-3 py-2 text-teal-700 font-semibold">{remaining(r)}</td>
                <td className="px-3 py-2">{r.waitlist}</td>
                <td className="px-3 py-2 space-x-1">
                  {r.frozen && <Badge variant="warning">Frozen</Badge>}
                  {r.overAllot && <Badge variant="info">Over-allot</Badge>}
                  {!r.frozen && remaining(r) === 0 && <Badge variant="danger">Full</Badge>}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Button variant="outline" onClick={() => { setEditing({ ...r, quotas: { ...r.quotas } }); setErrors([]); setOpen(true); }}>Edit</Button>
                  <Button variant="outline" className="ml-1" onClick={() => setRows((list) => list.map((x) => x.id === r.id ? { ...x, frozen: !x.frozen } : x))}>
                    {r.frozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Seat Matrix' : 'New Seat Matrix'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button></div>}>
        {editing && (
          <div className="space-y-4">
            {errors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 space-y-1">{errors.map((e) => <p key={e}>• {e}</p>)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select label="Academic Year *" options={YEARS.map((y) => ({ value: y, label: y }))} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              <Select label="Board *" options={BOARDS.map((y) => ({ value: y, label: y }))} value={editing.board} onChange={(e) => setEditing({ ...editing, board: e.target.value })} />
              <Select label="Program *" options={PROGRAMS.map((y) => ({ value: y, label: y }))} value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })} />
              <Select label="Class *" options={CLASSES.map((y) => ({ value: y, label: y }))} value={editing.className} onChange={(e) => setEditing({ ...editing, className: e.target.value })} />
              <Select label="Stream" options={STREAMS.map((y) => ({ value: y, label: y }))} value={editing.stream} onChange={(e) => setEditing({ ...editing, stream: e.target.value })} />
              <Select label="Shift" options={SHIFTS.map((y) => ({ value: y, label: y }))} value={editing.shift} onChange={(e) => setEditing({ ...editing, shift: e.target.value })} />
              <Select label="Campus *" options={CAMPUSES.map((y) => ({ value: y, label: y }))} value={editing.campus} onChange={(e) => setEditing({ ...editing, campus: e.target.value })} />
              <Input label="Total sanctioned seats *" type="number" value={String(editing.total)} onChange={(e) => setEditing({ ...editing, total: Number(e.target.value) || 0 })} />
              <Input label="Occupied (read-only mock)" type="number" value={String(editing.occupied)} onChange={(e) => setEditing({ ...editing, occupied: Number(e.target.value) || 0 })} />
            </div>
            <p className="text-sm font-semibold">Gender split</p>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Male" type="number" value={String(editing.male)} onChange={(e) => setEditing({ ...editing, male: Number(e.target.value) || 0 })} />
              <Input label="Female" type="number" value={String(editing.female)} onChange={(e) => setEditing({ ...editing, female: Number(e.target.value) || 0 })} />
              <Input label="Other" type="number" value={String(editing.other)} onChange={(e) => setEditing({ ...editing, other: Number(e.target.value) || 0 })} />
            </div>
            <p className="text-sm font-semibold">Quota seats</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {QUOTAS.map((q) => (
                <Input key={q.key} label={q.label} type="number" value={String(editing.quotas[q.key])} onChange={(e) => setEditing({ ...editing, quotas: { ...editing.quotas, [q.key]: Number(e.target.value) || 0 } })} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Waitlist capacity" type="number" value={String(editing.waitlist)} onChange={(e) => setEditing({ ...editing, waitlist: Number(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={editing.overAllot} onChange={(e) => setEditing({ ...editing, overAllot: e.target.checked })} /> Allow over-allotment</label>
              <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={editing.frozen} onChange={(e) => setEditing({ ...editing, frozen: e.target.checked })} /> Freeze matrix</label>
            </div>
            <p className="text-xs text-gray-500">Quota total {quotaSum(editing)} / {editing.total} · Gender total {genderSum(editing)} / {editing.total} · Remaining {remaining(editing)}</p>
            <textarea className={inputClass} rows={2} placeholder="Remarks" value={editing.remarks} onChange={(e) => setEditing({ ...editing, remarks: e.target.value })} />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SeatMatrixConfiguration;
