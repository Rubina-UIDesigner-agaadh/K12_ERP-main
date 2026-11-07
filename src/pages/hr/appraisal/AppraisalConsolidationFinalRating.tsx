import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Lock, Unlock, Save } from 'lucide-react';

type Tab = 'overview' | 'close' | 'card';
type Row = {
  id: string;
  name: string;
  dept: string;
  self: number;
  manager: number;
  peer: number;
  student: number;
  final: number;
  band: string;
  status: 'Pending' | 'Ready' | 'Locked';
};

const ROWS: Row[] = [
  { id: 'EMP-2041', name: 'Priya Nair', dept: 'Computer Science', self: 4.1, manager: 4.3, peer: 4.0, student: 4.4, final: 4.25, band: 'Exceeds', status: 'Ready' },
  { id: 'EMP-1882', name: 'Rahul Mehta', dept: 'Mathematics', self: 3.6, manager: 3.4, peer: 3.5, student: 3.2, final: 3.42, band: 'Meets', status: 'Pending' },
  { id: 'EMP-2104', name: 'Ananya Iyer', dept: 'Physics', self: 4.4, manager: 4.5, peer: 4.2, student: 4.6, final: 4.48, band: 'Outstanding', status: 'Ready' },
  { id: 'EMP-1760', name: 'Vikram Shah', dept: 'Administration', self: 3.1, manager: 2.9, peer: 3.0, student: 0, final: 2.98, band: 'Below', status: 'Pending' }
];

export function AppraisalConsolidationFinalRating() {
  const [tab, setTab] = useState<Tab>('overview');
  const [cycle, setCycle] = useState('FY 2026–27 Annual');
  const [rows, setRows] = useState<Row[]>(ROWS);
  const [pick, setPick] = useState('EMP-2041');
  const [override, setOverride] = useState('');
  const [reason, setReason] = useState('');
  const [closed, setClosed] = useState(false);
  const [notice, setNotice] = useState('');
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  const stats = useMemo(() => ({
    total: rows.length,
    ready: rows.filter((r) => r.status === 'Ready' || r.status === 'Locked').length,
    pending: rows.filter((r) => r.status === 'Pending').length,
    locked: rows.filter((r) => r.status === 'Locked').length,
    avg: (rows.reduce((s, r) => s + r.final, 0) / rows.length).toFixed(2)
  }), [rows]);
  const card = rows.find((r) => r.id === pick)!;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appraisal Consolidation & Final Rating</h1>
        <p className="text-sm text-gray-500">Combine self, manager, peer and student scores, lock ratings, and close the cycle.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {([{ id: 'overview', label: 'Overview' }, { id: 'close', label: 'Cycle close' }, { id: 'card', label: 'Individual rating card' }] as const).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      <Select label="Appraisal cycle" value={cycle} onChange={(e) => setCycle(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026–27 Annual', label: 'FY 2026–27 Annual' }]} />

      {tab === 'overview' && (
        <>
          <div className="grid gap-3 md:grid-cols-5">
            {[['Employees', stats.total], ['Ready', stats.ready], ['Pending', stats.pending], ['Locked', stats.locked], ['Avg final', stats.avg]].map(([l, v]) => (
              <Card key={String(l)}><p className="text-xs text-gray-500">{l}</p><p className="text-2xl font-bold text-gray-900">{v}</p></Card>
            ))}
          </div>
          <Card title="Score mix">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Dept', 'Self', 'Manager', 'Peer', 'Student', 'Final', 'Band', 'Status', ''].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2 font-medium">{r.name}<div className="text-xs text-gray-400">{r.id}</div></td>
                    <td className="px-3 py-2 text-xs">{r.dept}</td>
                    <td className="px-3 py-2">{r.self.toFixed(1)}</td>
                    <td className="px-3 py-2">{r.manager.toFixed(1)}</td>
                    <td className="px-3 py-2">{r.peer.toFixed(1)}</td>
                    <td className="px-3 py-2">{r.student ? r.student.toFixed(1) : '—'}</td>
                    <td className="px-3 py-2 font-semibold">{r.final.toFixed(2)}</td>
                    <td className="px-3 py-2"><Badge variant={r.band === 'Outstanding' || r.band === 'Exceeds' ? 'success' : r.band === 'Below' ? 'danger' : 'info'}>{r.band}</Badge></td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Locked' ? 'success' : r.status === 'Ready' ? 'info' : 'warning'}>{r.status}</Badge></td>
                    <td className="px-3 py-2">
                      {r.status !== 'Locked'
                        ? <Button size="xs" variant="outline" onClick={() => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: 'Locked' } : x)); flash(`${r.name} rating locked.`); }}><Lock className="mr-1 h-3 w-3" />Lock</Button>
                        : <Button size="xs" variant="ghost" onClick={() => { setRows((p) => p.map((x) => x.id === r.id ? { ...x, status: 'Ready' } : x)); flash(`${r.name} unlocked.`); }}><Unlock className="mr-1 h-3 w-3" />Unlock</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'close' && (
        <Card title="Close appraisal cycle">
          <p className="mb-3 text-sm text-gray-600">Closing publishes locked ratings to increment / IDP and freezes further edits. {stats.pending} employees are still pending.</p>
          <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
            <li>Self, manager, peer and student inputs frozen</li>
            <li>Final bands pushed to Appraisal Outcome & Increment</li>
            <li>Training needs auto-queued for Below / Meets bands</li>
          </ul>
          <div className="flex gap-2">
            <Button disabled={closed || stats.pending > 0} onClick={() => { setClosed(true); flash('Cycle closed. Ratings published.'); }}>Close cycle</Button>
            {stats.pending > 0 && <Button variant="outline" onClick={() => { setRows((p) => p.map((x) => x.status === 'Pending' ? { ...x, status: 'Ready' } : x)); flash('Pending records marked Ready. Review before close.'); }}>Force-mark pending Ready</Button>}
            {closed && <Badge variant="success">Closed</Badge>}
          </div>
        </Card>
      )}

      {tab === 'card' && (
        <Card title="Individual rating card">
          <Select label="Employee" value={pick} onChange={(e) => setPick(typeof e === 'string' ? e : e.target.value)} options={rows.map((r) => ({ value: r.id, label: `${r.name} (${r.id})` }))} />
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {[['Self', card.self], ['Manager', card.manager], ['Peer', card.peer], ['Student', card.student], ['Final', card.final]].map(([l, v]) => (
              <div key={String(l)} className="rounded-lg border bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">{l}</p>
                <p className="text-xl font-bold">{typeof v === 'number' && v ? v.toFixed(2) : '—'}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm">Band: <Badge variant="info">{card.band}</Badge> · Status: <Badge>{card.status}</Badge></p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input label="Committee override (optional)" value={override} onChange={(e) => setOverride(e.target.value)} placeholder="e.g. 4.10" />
            <Textarea label="Override / moderation reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={() => {
              const n = Number(override);
              if (override && (Number.isNaN(n) || !reason.trim())) { flash('Enter a numeric override and a reason.'); return; }
              if (override) setRows((p) => p.map((x) => x.id === pick ? { ...x, final: n, status: 'Ready' } : x));
              flash('Rating card saved.');
            }}><Save className="mr-1 h-4 w-4" />Save rating card</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AppraisalConsolidationFinalRating;
