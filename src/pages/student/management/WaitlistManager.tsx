import React, { useMemo, useState } from 'react';
import { Search, RotateCcw, Download, ArrowUp, ArrowDown, Mail, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  loadStreamStore, saveStreamStore, pushAudit, downloadCsv, type StreamStore, type StreamWaitRow
} from './ApplicationsDashboard';

const rowKey = (r: StreamWaitRow) => `${r.roll}-${r.pos}-${r.stream}`;

export function WaitlistManager() {
  const [store, setStore] = useState<StreamStore>(() => loadStreamStore());
  const [year, setYear] = useState('2025-26');
  const [stream, setStream] = useState('all');
  const [round, setRound] = useState('all');
  const [notified, setNotified] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailBody, setMailBody] = useState('A waitlist seat may become available. Please keep documents ready.');
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  const persist = (next: StreamStore) => { saveStreamStore(next); setStore(next); };

  const rows = useMemo(() => store.waitlist.filter((r) => {
    if (stream !== 'all' && r.stream !== stream) return false;
    if (round !== 'all' && r.round !== round) return false;
    if (notified !== 'all' && r.notified !== notified) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${r.name} ${r.roll} ${r.stream} ${r.comb}`.toLowerCase().includes(q)) return false;
    return true;
  }), [store.waitlist, year, stream, round, notified, search]);

  const reorder = (key: string, dir: -1 | 1) => {
    const list = [...store.waitlist];
    const idx = list.findIndex((r) => rowKey(r) === key);
    const nextIdx = idx + dir;
    if (idx < 0 || nextIdx < 0 || nextIdx >= list.length) return;
    const tmp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = tmp;
    const next = { ...store, waitlist: list.map((r, i) => ({ ...r, pos: i + 1 })) };
    pushAudit(next, 'Waitlist Reorder', key, dir === -1 ? 'Moved up' : 'Moved down');
    persist(next);
    setNotice('Waitlist order updated.');
  };

  const allotSelected = (keys = selected) => {
    if (keys.length === 0) return;
    const next = { ...store };
    keys.forEach((key) => {
      const row = next.waitlist.find((w) => rowKey(w) === key);
      if (!row) return;
      next.applications = next.applications.map((a) => a.roll === row.roll ? { ...a, status: 'Allotted', allotted: row.stream, eligibility: 'Eligible' } : a);
    });
    next.waitlist = next.waitlist.filter((w) => !keys.includes(rowKey(w))).map((w, i) => ({ ...w, pos: i + 1 }));
    pushAudit(next, 'Waitlist Allot', keys.join(', '), 'Manual allot from waitlist');
    persist(next);
    setNotice(`Allotted ${keys.length} waitlisted student(s).`);
    setSelected([]);
  };

  const field = (label: string, children: React.ReactNode) => (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Stream Selection → Waitlist Manager</p>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist Manager</h1>
          <p className="text-sm text-gray-500">Search, reorder and allot waitlisted students</p>
        </div>
        <Button variant="outline" onClick={() => downloadCsv([['Pos', 'Student', 'Roll', '%', 'Stream', 'Round', 'Notified'], ...rows.map((r) => [r.pos, r.name, r.roll, r.pct, r.stream, r.round, r.notified])], 'waitlist.csv')}><Download className="w-4 h-4 mr-1" /> Export</Button>
      </div>

      {notice && <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="bg-white rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {field('Academic Year', (
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option>2025-26</option><option>2024-25</option>
            </select>
          ))}
          {field('Stream', (
            <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              {['all', 'Science', 'Commerce', 'Arts', 'Vocational'].map((s) => <option key={s} value={s}>{s === 'all' ? 'All Streams' : s}</option>)}
            </select>
          ))}
          {field('Round', (
            <select value={round} onChange={(e) => setRound(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Rounds</option>
              <option>Round 1</option>
              <option>Round 2</option>
              <option>Round 3</option>
            </select>
          ))}
          {field('Notified', (
            <select value={notified} onChange={(e) => setNotified(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ))}
          {field('Search Student', (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or roll number" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setNotice(`${rows.length} waitlisted student(s) found.`)}><Search className="w-4 h-4 mr-1" /> Search</Button>
          <Button variant="outline" onClick={() => { setYear('2025-26'); setStream('all'); setRound('all'); setNotified('all'); setSearch(''); setSelected([]); }}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          {selected.length > 0 && (
            <>
              <Button variant="outline" onClick={() => allotSelected()}>Allot Selected</Button>
              <Button variant="outline" onClick={() => setMailOpen(true)}><Mail className="w-4 h-4 mr-1" /> Notify</Button>
              <Button variant="outline" onClick={() => setRemoveOpen(true)}><Trash2 className="w-4 h-4 mr-1" /> Remove</Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" checked={rows.length > 0 && rows.every((r) => selected.includes(rowKey(r)))} onChange={(e) => setSelected(e.target.checked ? rows.map(rowKey) : [])} /></th>
                {['Pos', 'Student', 'Roll', 'Aggregate %', 'Stream', 'Combination', 'Reason', 'Waitlisted On', 'Round', 'Notified', 'Order', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 && <tr><td colSpan={13} className="px-3 py-10 text-center text-gray-400">No waitlisted students match the filters.</td></tr>}
              {rows.map((r) => (
                <tr key={rowKey(r)} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(rowKey(r))} onChange={() => setSelected((s) => s.includes(rowKey(r)) ? s.filter((id) => id !== rowKey(r)) : [...s, rowKey(r)])} /></td>
                  <td className="px-3 py-2">{r.pos}</td>
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2">{r.roll}</td>
                  <td className="px-3 py-2">{r.pct.toFixed(1)}%</td>
                  <td className="px-3 py-2"><Badge variant="info">{r.stream}</Badge></td>
                  <td className="px-3 py-2">{r.comb}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{r.why}</td>
                  <td className="px-3 py-2">{r.date}</td>
                  <td className="px-3 py-2">{r.round}</td>
                  <td className="px-3 py-2"><Badge variant={r.notified === 'Yes' ? 'success' : 'warning'}>{r.notified}</Badge></td>
                  <td className="px-3 py-2">
                    <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => reorder(rowKey(r), -1)} title="Move up"><ArrowUp className="w-4 h-4" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => reorder(rowKey(r), 1)} title="Move down"><ArrowDown className="w-4 h-4" /></button>
                  </td>
                  <td className="px-3 py-2">
                    <Button size="sm" variant="ghost" onClick={() => allotSelected([rowKey(r)])}>Allot</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={mailOpen} onClose={() => setMailOpen(false)} title="Notify Waitlisted Students">
        <div className="space-y-3">
          <Textarea rows={4} value={mailBody} onChange={(e) => setMailBody(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMailOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const next = { ...store, waitlist: store.waitlist.map((w) => selected.includes(rowKey(w)) ? { ...w, notified: 'Yes' as const } : w) };
              pushAudit(next, 'Waitlist Notify', selected.join(', '), mailBody);
              persist(next);
              setMailOpen(false);
              setNotice(`Notification sent to ${selected.length} student(s).`);
            }}>Send</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={removeOpen} onClose={() => setRemoveOpen(false)} title="Remove from Waitlist">
        <div className="space-y-3">
          <Textarea rows={3} value={removeReason} onChange={(e) => setRemoveReason(e.target.value)} placeholder="Reason (min 8 characters)" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRemoveOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (removeReason.trim().length < 8) { setNotice('Enter a reason of at least 8 characters.'); return; }
              const next = { ...store, waitlist: store.waitlist.filter((w) => !selected.includes(rowKey(w))).map((w, i) => ({ ...w, pos: i + 1 })) };
              pushAudit(next, 'Waitlist Remove', selected.join(', '), removeReason);
              persist(next);
              setRemoveOpen(false); setRemoveReason(''); setSelected([]); setNotice('Removed from waitlist.');
            }}>Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WaitlistManager;
