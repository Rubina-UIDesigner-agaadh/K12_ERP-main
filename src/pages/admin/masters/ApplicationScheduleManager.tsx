import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Calendar, Plus, Save, Search } from 'lucide-react';

interface Schedule {
  id: string;
  name: string;
  year: string;
  program: string;
  classFrom: string;
  classTo: string;
  open: string;
  close: string;
  documents: string;
  payment: string;
  exam: string;
  interview: string;
  result: string;
  admission: string;
  freeze: string;
  lateAllowed: boolean;
  lateUntil: string;
  waitlistOpen: boolean;
  reopen: boolean;
  status: 'Upcoming' | 'Open' | 'Closing Soon' | 'Closed' | 'Frozen';
  remarks: string;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const CLASSES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const fmt = (iso: string) => iso ? iso.split('-').reverse().join('-') : '—';

function deriveStatus(s: Schedule, today: string): Schedule['status'] {
  if (s.freeze && today >= s.freeze) return 'Frozen';
  if (today < s.open) return 'Upcoming';
  if (today > s.close && !s.reopen) return 'Closed';
  const close = new Date(`${s.close}T00:00:00`).getTime();
  const now = new Date(`${today}T00:00:00`).getTime();
  if (close - now <= 3 * 86400000) return 'Closing Soon';
  return 'Open';
}

const SEED: Schedule[] = [
  { id: 'SCH-001', name: 'Pre-Primary 2026-27', year: '2026-27', program: 'Pre-Primary', classFrom: 'Nursery', classTo: 'UKG', open: '2026-10-01', close: '2026-10-31', documents: '2026-11-05', payment: '2026-11-10', exam: '', interview: '2026-11-12', result: '2026-11-18', admission: '2026-11-25', freeze: '2026-12-01', lateAllowed: true, lateUntil: '2026-11-03', waitlistOpen: true, reopen: false, status: 'Open', remarks: 'Walk-in interviews on Saturdays' },
  { id: 'SCH-002', name: 'Class 11 Science', year: '2026-27', program: 'Day School', classFrom: '11', classTo: '11', open: '2026-11-15', close: '2026-12-10', documents: '2026-12-15', payment: '2026-12-18', exam: '2026-12-20', interview: '2026-12-22', result: '2026-12-28', admission: '2027-01-10', freeze: '2027-01-20', lateAllowed: false, lateUntil: '', waitlistOpen: true, reopen: false, status: 'Upcoming', remarks: '' }
];

export function ApplicationScheduleManager() {
  const [rows, setRows] = useState<Schedule[]>(SEED);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const blank = (): Schedule => ({
    id: '', name: '', year: '2026-27', program: 'Day School', classFrom: '1', classTo: '1',
    open: today, close: '', documents: '', payment: '', exam: '', interview: '', result: '', admission: '', freeze: '',
    lateAllowed: false, lateUntil: '', waitlistOpen: true, reopen: false, status: 'Upcoming', remarks: ''
  });

  const withStatus = rows.map((r) => ({ ...r, status: deriveStatus(r, today) }));
  const filtered = withStatus.filter((r) => !q || `${r.name} ${r.program} ${r.classFrom}`.toLowerCase().includes(q.toLowerCase()));

  const validate = (s: Schedule) => {
    const e: string[] = [];
    if (!s.name.trim()) e.push('Schedule name is required.');
    if (!s.open || !s.close) e.push('Application open and close dates are required.');
    const order: [string, string][] = [
      ['open', 'close'], ['close', 'documents'], ['documents', 'payment'], ['payment', 'exam'],
      ['exam', 'interview'], ['interview', 'result'], ['result', 'admission'], ['admission', 'freeze']
    ];
    const val: Record<string, string> = s as any;
    order.forEach(([a, b]) => {
      if (val[a] && val[b] && val[b] < val[a]) e.push(`${b} cannot be before ${a}.`);
    });
    if (s.lateAllowed && s.lateUntil && s.lateUntil < s.close) e.push('Late window must be on or after close date.');
    return e;
  };

  const save = () => {
    if (!editing) return;
    const e = validate(editing);
    if (e.length) { setErrors(e); return; }
    const next = { ...editing, status: deriveStatus(editing, today) };
    if (editing.id) setRows((list) => list.map((r) => r.id === editing.id ? next : r));
    else setRows((list) => [{ ...next, id: `SCH-${String(list.length + 1).padStart(3, '0')}` }, ...list]);
    setOpen(false);
    setNotice('Application schedule saved. Status is derived from dates.');
  };

  const counts = useMemo(() => ({
    open: withStatus.filter((r) => r.status === 'Open' || r.status === 'Closing Soon').length,
    upcoming: withStatus.filter((r) => r.status === 'Upcoming').length,
    closed: withStatus.filter((r) => r.status === 'Closed' || r.status === 'Frozen').length
  }), [withStatus]);

  const variant = (s: Schedule['status']) => s === 'Open' ? 'success' : s === 'Closing Soon' ? 'warning' : s === 'Upcoming' ? 'info' : 'default';

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Application Schedule Manager</h1>
          <p className="text-sm text-gray-500">Control admission windows, late applications and freeze dates.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditing(blank()); setErrors([]); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> New Schedule</Button>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-green-700">{counts.open}</p><p className="text-xs text-gray-500">Open now</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-blue-700">{counts.upcoming}</p><p className="text-xs text-gray-500">Upcoming</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-2xl font-bold text-gray-700">{counts.closed}</p><p className="text-xs text-gray-500">Closed / Frozen</p></div>
      </div>

      <Card>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input className={`${inputClass} pl-9`} placeholder="Search schedules" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Schedule', 'Classes', 'Open → Close', 'Exam / Interview', 'Result', 'Admission freeze', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2"><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.year} · {r.program}</p></td>
                <td className="px-3 py-2">{r.classFrom} – {r.classTo}</td>
                <td className="px-3 py-2">{fmt(r.open)} → {fmt(r.close)}{r.lateAllowed ? <span className="block text-xs text-amber-700">Late till {fmt(r.lateUntil)}</span> : null}</td>
                <td className="px-3 py-2 text-xs">{r.exam ? `Exam ${fmt(r.exam)}` : '—'}<br />{r.interview ? `Interview ${fmt(r.interview)}` : '—'}</td>
                <td className="px-3 py-2">{fmt(r.result)}</td>
                <td className="px-3 py-2">{fmt(r.admission)} / {fmt(r.freeze)}</td>
                <td className="px-3 py-2"><Badge variant={variant(r.status)}>{r.status}</Badge></td>
                <td className="px-3 py-2"><Button variant="outline" onClick={() => { setEditing({ ...r }); setErrors([]); setOpen(true); }}>Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Application Schedule' : 'New Application Schedule'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button></div>}>
        {editing && (
          <div className="space-y-4">
            {errors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{errors.map((e) => <p key={e}>• {e}</p>)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3"><Input label="Schedule Name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <Select label="Academic Year *" options={['2025-26', '2026-27', '2027-28'].map((y) => ({ value: y, label: y }))} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              <Select label="Program *" options={['Day School', 'Boarding', 'Pre-Primary', 'Senior Secondary'].map((y) => ({ value: y, label: y }))} value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })} />
              <Select label="Class From *" options={CLASSES.map((y) => ({ value: y, label: y }))} value={editing.classFrom} onChange={(e) => setEditing({ ...editing, classFrom: e.target.value })} />
              <Select label="Class To *" options={CLASSES.map((y) => ({ value: y, label: y }))} value={editing.classTo} onChange={(e) => setEditing({ ...editing, classTo: e.target.value })} />
            </div>
            <p className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> Timeline</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Applications Open *" type="date" value={editing.open} onChange={(e) => setEditing({ ...editing, open: e.target.value })} />
              <Input label="Applications Close *" type="date" value={editing.close} onChange={(e) => setEditing({ ...editing, close: e.target.value })} />
              <Input label="Document submission" type="date" value={editing.documents} onChange={(e) => setEditing({ ...editing, documents: e.target.value })} />
              <Input label="Payment deadline" type="date" value={editing.payment} onChange={(e) => setEditing({ ...editing, payment: e.target.value })} />
              <Input label="Entrance exam" type="date" value={editing.exam} onChange={(e) => setEditing({ ...editing, exam: e.target.value })} />
              <Input label="Interview" type="date" value={editing.interview} onChange={(e) => setEditing({ ...editing, interview: e.target.value })} />
              <Input label="Result date" type="date" value={editing.result} onChange={(e) => setEditing({ ...editing, result: e.target.value })} />
              <Input label="Admission confirmation" type="date" value={editing.admission} onChange={(e) => setEditing({ ...editing, admission: e.target.value })} />
              <Input label="Freeze date" type="date" value={editing.freeze} onChange={(e) => setEditing({ ...editing, freeze: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={editing.lateAllowed} onChange={(e) => setEditing({ ...editing, lateAllowed: e.target.checked })} /> Allow late applications</label>
              <Input label="Late until" type="date" value={editing.lateUntil} onChange={(e) => setEditing({ ...editing, lateUntil: e.target.value })} />
              <label className="flex items-center gap-2 text-sm mt-6"><input type="checkbox" checked={editing.waitlistOpen} onChange={(e) => setEditing({ ...editing, waitlistOpen: e.target.checked })} /> Waitlist open</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.reopen} onChange={(e) => setEditing({ ...editing, reopen: e.target.checked })} /> Reopen after close</label>
            </div>
            <p className="text-xs text-gray-500">Computed status: {deriveStatus(editing, today)}</p>
            <textarea className={inputClass} rows={2} placeholder="Remarks" value={editing.remarks} onChange={(e) => setEditing({ ...editing, remarks: e.target.value })} />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApplicationScheduleManager;
