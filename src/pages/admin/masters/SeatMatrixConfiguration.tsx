import React, { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Download, Printer, Save, RotateCcw, Pencil, X } from 'lucide-react';

type CatKey = 'general' | 'sc' | 'st' | 'obc' | 'ews' | 'sports' | 'mgmt';
const CATS: { key: CatKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'sc', label: 'SC' },
  { key: 'st', label: 'ST' },
  { key: 'obc', label: 'OBC' },
  { key: 'ews', label: 'EWS' },
  { key: 'sports', label: 'Sports' },
  { key: 'mgmt', label: 'Mgmt' }
];
const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];
const YEARS = ['2025-26', '2026-27', '2027-28'];
const STORE = 'k12-seat-matrix-v1';

type CatMap = Record<CatKey, number>;
interface StreamRow {
  stream: string;
  cats: CatMap;
  total: number;
}

const emptyCats = (): CatMap => CATS.reduce((a, c) => ({ ...a, [c.key]: 0 }), {} as CatMap);
const sumCats = (c: CatMap) => CATS.reduce((s, x) => s + (Number(c[x.key]) || 0), 0);

const DEFAULT_YEAR: Record<string, StreamRow[]> = {
  '2025-26': STREAMS.map((stream, i) => {
    const cats: CatMap = { general: [36, 30, 24, 12][i], sc: [8, 8, 6, 4][i], st: [4, 4, 4, 2][i], obc: [12, 12, 8, 4][i], ews: [8, 6, 6, 2][i], sports: [2, 2, 2, 1][i], mgmt: [2, 2, 2, 0][i] };
    return { stream, cats, total: sumCats(cats) };
  }),
  '2026-27': STREAMS.map((stream, i) => {
    const cats: CatMap = { general: [40, 32, 28, 12][i], sc: [10, 10, 8, 4][i], st: [5, 4, 4, 2][i], obc: [15, 14, 10, 5][i], ews: [8, 8, 5, 2][i], sports: [1, 1, 0, 0][i], mgmt: [1, 1, 0, 0][i] };
    return { stream, cats, total: sumCats(cats) };
  }),
  '2027-28': STREAMS.map((stream) => ({ stream, cats: emptyCats(), total: 0 }))
};

const loadYear = (year: string): StreamRow[] => {
  try {
    const raw = window.localStorage.getItem(STORE);
    const all = raw ? JSON.parse(raw) : {};
    if (all[year]?.length) return all[year];
  } catch { /* seed */ }
  return (DEFAULT_YEAR[year] || DEFAULT_YEAR['2026-27']).map((r) => ({ stream: r.stream, total: r.total, cats: { ...r.cats } }));
};

const saveYear = (year: string, rows: StreamRow[]) => {
  try {
    const raw = window.localStorage.getItem(STORE);
    const all = raw ? JSON.parse(raw) : {};
    all[year] = rows;
    window.localStorage.setItem(STORE, JSON.stringify(all));
  } catch { /* ignore */ }
};

const downloadCsv = (grid: (string | number)[][], name: string) => {
  const blob = new Blob(['\uFEFF' + grid.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
};

const liveUsage = (stream: string) => {
  try {
    const store = JSON.parse(window.localStorage.getItem('k12-stream-selection-v1') || '{}');
    const apps = Array.isArray(store.applications) ? store.applications : [];
    const wait = Array.isArray(store.waitlist) ? store.waitlist : [];
    const allotted = apps.filter((a: { allotted?: string; status?: string }) => a.allotted === stream && (a.status === 'Allotted' || a.status === 'Accepted' || a.status === 'Joined')).length;
    const accepted = apps.filter((a: { allotted?: string; status?: string }) => a.allotted === stream && (a.status === 'Accepted' || a.status === 'Joined')).length;
    const released = apps.filter((a: { allotted?: string; status?: string }) => a.status === 'Rejected' && a.allotted === stream).length;
    const waitlisted = wait.filter((w: { stream?: string }) => w.stream === stream).length;
    const byCat = (cat: string) => apps.filter((a: { allotted?: string; category?: string; status?: string }) => a.allotted === stream && a.category === cat && (a.status === 'Allotted' || a.status === 'Accepted')).length;
    return { allotted, accepted, released, waitlisted, byCat };
  } catch {
    return { allotted: 0, accepted: 0, released: 0, waitlisted: 0, byCat: () => 0 };
  }
};

const FALLBACK_LIVE: Record<string, { allotted: number; accepted: number; released: number; waitlisted: number }> = {
  Science: { allotted: 70, accepted: 62, released: 4, waitlisted: 18 },
  Commerce: { allotted: 62, accepted: 55, released: 3, waitlisted: 12 },
  Arts: { allotted: 48, accepted: 40, released: 2, waitlisted: 8 },
  Vocational: { allotted: 20, accepted: 16, released: 1, waitlisted: 4 }
};

export function SeatMatrixConfiguration() {
  const [year, setYear] = useState('2026-27');
  const [rows, setRows] = useState<StreamRow[]>(() => loadYear('2026-27'));
  const [saved, setSaved] = useState<StreamRow[]>(() => loadYear('2026-27'));
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState(false);
  const dirty = JSON.stringify(rows) !== JSON.stringify(saved);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  const setCell = (stream: string, key: CatKey | 'total', value: number) => {
    setRows((list) => list.map((r) => {
      if (r.stream !== stream) return r;
      if (key === 'total') return { ...r, total: value };
      const cats = { ...r.cats, [key]: value };
      return { ...r, cats, total: sumCats(cats) === r.total ? r.total : sumCats(cats) };
    }));
  };

  const loadMatrix = (y = year) => {
    const data = loadYear(y);
    setRows(data);
    setSaved(data);
    setEditing(false);
    setErrors([]);
    setNotice(`Loaded seat matrix for ${y}.`);
  };

  const copyLastYear = () => {
    const idx = YEARS.indexOf(year);
    const prev = idx > 0 ? YEARS[idx - 1] : null;
    if (!prev) { setNotice('No previous year available to copy.'); return; }
    const data = loadYear(prev).map((r) => ({ stream: r.stream, total: r.total, cats: { ...r.cats } }));
    setRows(data);
    setEditing(true);
    setNotice(`Copied ${prev} numbers into ${year}. Adjust differences, then save.`);
  };

  const startFresh = () => {
    setRows(STREAMS.map((stream) => ({ stream, cats: emptyCats(), total: 0 })));
    setEditing(true);
    setNotice('Matrix cleared. Enter seats and save.');
  };

  const rowWarnings = (r: StreamRow) => {
    const sum = sumCats(r.cats);
    if (sum !== r.total) return `${r.stream} row: category totals (${sum}) do not match configured total (${r.total}). Please fix.`;
    if (r.total < 1) return `Total seats for ${r.stream} must be at least 1.`;
    return '';
  };

  const liveFor = (stream: string) => {
    const live = liveUsage(stream);
    const fb = FALLBACK_LIVE[stream] || { allotted: 0, accepted: 0, released: 0, waitlisted: 0 };
    const allotted = live.allotted || fb.allotted;
    const accepted = live.accepted || fb.accepted;
    const released = live.released || fb.released;
    const waitlisted = live.waitlisted || fb.waitlisted;
    return { allotted, accepted, released, waitlisted };
  };

  const belowFillMessages = () => {
    const msgs: string[] = [];
    rows.forEach((r, i) => {
      const live = liveFor(r.stream);
      if (r.total < live.allotted) msgs.push(`Cannot reduce ${r.stream} total to ${r.total} — ${live.allotted} are already filled.`);
      CATS.forEach((c) => {
        const filled = liveUsage(r.stream).byCat(c.label) || 0;
        if (filled && r.cats[c.key] < filled) msgs.push(`Cannot reduce ${c.label} seats to ${r.cats[c.key]} — ${filled} are already filled.`);
      });
      const savedRow = saved[i];
      if (savedRow && r.total < savedRow.total && live.allotted > r.total) {
        msgs.push(`Cannot reduce ${r.stream} seats below current fill count (${live.allotted}).`);
      }
    });
    return msgs;
  };

  const trySave = () => {
    const warns = rows.map(rowWarnings).filter(Boolean);
    if (warns.length) { setErrors(warns); return; }
    const fill = belowFillMessages();
    if (fill.length) { setErrors(fill); return; }
    const reductions = rows.some((r, i) => saved[i] && r.total < saved[i].total);
    if (reductions) { setConfirmSave(true); return; }
    commitSave();
  };

  const commitSave = () => {
    saveYear(year, rows);
    setSaved(rows.map((r) => ({ stream: r.stream, total: r.total, cats: { ...r.cats } })));
    setEditing(false);
    setConfirmSave(false);
    setErrors([]);
    setNotice('Seat matrix saved.');
  };

  const discard = () => {
    setRows(saved.map((r) => ({ stream: r.stream, total: r.total, cats: { ...r.cats } })));
    setEditing(false);
    setErrors([]);
    setNotice('Changes discarded.');
  };

  const grand = rows.reduce((s, r) => s + r.total, 0);
  const colTotals = CATS.reduce((acc, c) => ({ ...acc, [c.key]: rows.reduce((s, r) => s + (r.cats[c.key] || 0), 0) }), {} as CatMap);
  const drawerRow = rows.find((r) => r.stream === drawer);

  const statusOf = (fill: number, available: number) => {
    if (available <= 0 || fill >= 100) return { label: 'Full', color: 'bg-red-600 text-white', bar: 'bg-red-500' };
    if (fill >= 75) return { label: 'Almost Full', color: 'bg-amber-500 text-white', bar: 'bg-amber-500' };
    return { label: 'Available', color: 'bg-emerald-600 text-white', bar: 'bg-emerald-500' };
  };

  return (
    <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-full">
      <div>
        <p className="text-xs text-gray-500">Home → Master Setup → Seat Matrix</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <h1 className="text-xl font-bold text-gray-900">Seat Matrix</h1>
          <Badge variant="info">{year}</Badge>
        </div>
        <p className="text-sm text-gray-500">Configure seats per stream and category — monitor availability in real time</p>
      </div>

      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}
      {dirty && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">You have unsaved seat changes. Save or discard before leaving.</div>}
      {errors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-1">{errors.map((e) => <p key={e}>{e}</p>)}</div>}

      <div className="bg-white border rounded-xl p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-gray-600">Academic Year</label>
          <select value={year} onChange={(e) => {
            if (dirty && !window.confirm('You have unsaved seat changes. Save or discard before leaving.')) return;
            const y = e.target.value;
            setYear(y);
            const data = loadYear(y);
            setRows(data);
            setSaved(data);
            setEditing(false);
            setErrors([]);
          }} className="block mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <Button variant="outline" onClick={() => loadMatrix()}>Load Matrix</Button>
        <Button variant="outline" onClick={copyLastYear}>Copy from Last Year</Button>
        <Button variant="outline" onClick={startFresh}>Start Fresh</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold text-sm">Seat Configuration Grid {editing ? <Badge variant="warning">Edit mode</Badge> : <Badge variant="secondary">View mode</Badge>}</div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Stream</th>
              {CATS.map((c) => <th key={c.key} className="px-3 py-2 text-right">{c.label}</th>)}
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const mismatch = sumCats(r.cats) !== r.total;
              return (
                <tr key={r.stream} className={`border-t ${mismatch ? 'bg-red-50' : ''}`}>
                  <td className="px-3 py-2 font-medium">{r.stream}</td>
                  {CATS.map((c) => (
                    <td key={c.key} className="px-3 py-2 text-right">
                      {editing ? (
                        <input type="number" min={0} className="w-20 text-right border rounded px-2 py-1" value={r.cats[c.key]} onChange={(e) => setCell(r.stream, c.key, Number(e.target.value) || 0)} />
                      ) : r.cats[c.key]}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold">
                    {editing ? (
                      <input type="number" min={0} className="w-20 text-right border rounded px-2 py-1 font-semibold" value={r.total} onChange={(e) => setCell(r.stream, 'total', Number(e.target.value) || 0)} />
                    ) : r.total}
                    {mismatch && <p className="text-[10px] text-red-600 font-normal">Mismatch {sumCats(r.cats)} ≠ {r.total}</p>}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold border-t">
              <td className="px-3 py-2">Column Total</td>
              {CATS.map((c) => <td key={c.key} className="px-3 py-2 text-right">{colTotals[c.key]}</td>)}
              <td className="px-3 py-2 text-right text-indigo-700">{grand}</td>
            </tr>
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-gray-500">Grand total (complete intake for {year}): <b>{grand}</b></p>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold text-sm">Live Availability Monitor</div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Stream', 'Configured', 'Allotted', 'Accepted', 'Released', 'Available Now', 'Waitlisted', 'Fill %', 'Status'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const live = liveFor(r.stream);
              const available = Math.max(0, r.total - live.allotted + live.released);
              const fill = r.total ? Math.round((live.allotted / r.total) * 100) : 0;
              const st = statusOf(fill, available);
              return (
                <tr key={r.stream} className="border-t hover:bg-indigo-50 cursor-pointer" onClick={() => setDrawer(drawer === r.stream ? null : r.stream)}>
                  <td className="px-3 py-2 font-medium text-indigo-700">{r.stream}</td>
                  <td className="px-3 py-2">{r.total}</td>
                  <td className="px-3 py-2">{live.allotted}</td>
                  <td className="px-3 py-2">{live.accepted}</td>
                  <td className="px-3 py-2">{live.released}</td>
                  <td className="px-3 py-2 font-semibold text-teal-700">{available}</td>
                  <td className="px-3 py-2">{live.waitlisted}</td>
                  <td className="px-3 py-2 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded"><div className={`h-2 rounded ${st.bar}`} style={{ width: `${Math.min(100, fill)}%` }} /></div>
                      <span className="text-xs">{fill}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-gray-500">Click a stream row to open category breakdown. Green &lt; 75% · Amber 75–99% · Red 100%.</p>
      </div>

      {drawerRow && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-sm">Category breakdown — {drawerRow.stream}</h2>
            <button type="button" onClick={() => setDrawer(null)}><X className="w-4 h-4" /></button>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{['Category', 'Configured', 'Allotted', 'Available', 'Waitlisted'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {CATS.map((c) => {
                const configured = drawerRow.cats[c.key];
                const allotted = liveUsage(drawerRow.stream).byCat(c.label) || Math.round((liveFor(drawerRow.stream).allotted * configured) / Math.max(1, drawerRow.total));
                const available = Math.max(0, configured - allotted);
                const wait = Math.round((liveFor(drawerRow.stream).waitlisted * configured) / Math.max(1, drawerRow.total));
                return (
                  <tr key={c.key} className="border-t">
                    <td className="px-3 py-2">{c.label}</td>
                    <td className="px-3 py-2">{configured}</td>
                    <td className="px-3 py-2">{allotted}</td>
                    <td className="px-3 py-2">{available}</td>
                    <td className="px-3 py-2">{wait}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!editing && <Button onClick={() => setEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit Matrix</Button>}
        {editing && <Button onClick={trySave}><Save className="w-4 h-4 mr-1" /> Save Changes</Button>}
        {editing && <Button variant="outline" onClick={discard}><RotateCcw className="w-4 h-4 mr-1" /> Discard Changes</Button>}
        <Button variant="outline" onClick={() => {
          downloadCsv([
            ['Stream', ...CATS.map((c) => c.label), 'Total', 'Allotted', 'Accepted', 'Released', 'Available', 'Waitlisted', 'Fill %'],
            ...rows.map((r) => {
              const live = liveFor(r.stream);
              const available = Math.max(0, r.total - live.allotted + live.released);
              const fill = r.total ? Math.round((live.allotted / r.total) * 100) : 0;
              return [r.stream, ...CATS.map((c) => r.cats[c.key]), r.total, live.allotted, live.accepted, live.released, available, live.waitlisted, fill];
            })
          ], `seat-matrix-${year}.csv`);
          setNotice('Seat matrix exported.');
        }}><Download className="w-4 h-4 mr-1" /> Export to Excel</Button>
        <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
      </div>

      <Modal isOpen={confirmSave} onClose={() => setConfirmSave(false)} title="Confirm seat reduction" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmSave(false)}>Cancel</Button>
          <Button onClick={commitSave}>Save anyway</Button>
        </div>
      }>
        <p className="text-sm text-gray-700">You are reducing seats below the previous configured total. Confirm only if this matches current fill.</p>
      </Modal>
    </div>
  );
}

export default SeatMatrixConfiguration;
