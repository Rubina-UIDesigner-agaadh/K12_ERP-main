import React, { useMemo, useState } from 'react';
import { Search, RotateCcw, Download, ArrowUp, ArrowDown, Mail, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import {
  loadStreamStore, saveStreamStore, pushAudit, downloadCsv, stamp, type StreamStore, type StreamWaitRow, type WaitMove
} from './ApplicationsDashboard';

const rowKey = (r: StreamWaitRow) => `${r.roll}-${r.pos}-${r.stream}`;

type HistoryRow = WaitMove & { prevPos?: string; result?: string };

const SEAT_CAPS: Record<string, number> = { Science: 80, Commerce: 70, Arts: 60, Vocational: 30 };

const COMBOS: Record<string, string[]> = {
  Science: ['PCM', 'PCB', 'PCMB'],
  Commerce: ['Commerce with Math', 'Commerce without Math'],
  Arts: ['Humanities', 'Arts with Psychology'],
  Vocational: ['IT', 'Hospitality'],
};

const ELECTIVES: Record<string, string[]> = {
  Science: ['Computer Science', 'Physical Education', 'Informatics Practices'],
  Commerce: ['Entrepreneurship', 'Physical Education', 'Informatics Practices'],
  Arts: ['Fine Arts', 'Physical Education', 'Music'],
  Vocational: ['Retail', 'Beauty & Wellness', 'IT Tools'],
};

const REMOVE_REASONS = ['Student withdrew', 'Joined another school', 'No response', 'Admin decision'];

const EXTRA_WAIT: StreamWaitRow[] = [
  { pos: 4, name: 'Ananya Iyer', roll: 'CBSE1004', cat: 'ST', pct: 48.5, stream: 'Arts', comb: 'Humanities', why: 'Cutoff not met for Science', date: '20-06-2025', round: 'Round 1', notified: 'No' },
  { pos: 5, name: 'Kabir Khan', roll: 'CBSE1005', cat: 'General', pct: 84.1, stream: 'Science', comb: 'PCMB', why: 'Round 1 seat not confirmed', date: '20-06-2025', round: 'Round 2', notified: 'Yes' },
  { pos: 6, name: 'Sara Ali', roll: 'CBSE1008', cat: 'General', pct: 88.0, stream: 'Commerce', comb: 'Commerce with Math', why: 'Preference reshuffle after decline', date: '21-06-2025', round: 'Round 2', notified: 'No' },
  { pos: 7, name: 'Vivaan Reddy', roll: 'CBSE1009', cat: 'SC', pct: 39.2, stream: 'Vocational', comb: 'IT', why: 'Waitlisted after counselling', date: '22-06-2025', round: 'Round 2', notified: 'Yes' },
  { pos: 8, name: 'Neha Shah', roll: 'CBSE0911', cat: 'General', pct: 82.6, stream: 'Science', comb: 'PCM', why: 'Seat released — waiting Round 2', date: '22-06-2025', round: 'Round 2', notified: 'No' },
  { pos: 9, name: 'Arjun Nair', roll: 'CBSE0912', cat: 'OBC', pct: 67.4, stream: 'Commerce', comb: 'Commerce without Math', why: 'Category seats exhausted', date: '23-06-2025', round: 'Round 2', notified: 'Yes' },
];

function withExtraWaitlist(store: StreamStore): StreamStore {
  const have = new Set(store.waitlist.map((row) => row.roll));
  const add = EXTRA_WAIT.filter((row) => !have.has(row.roll));
  if (!add.length) return store;
  const waitlist = [...store.waitlist, ...add].map((row, index) => ({ ...row, pos: index + 1 }));
  const next = { ...store, waitlist };
  saveStreamStore(next);
  return next;
}

const HISTORY_SEED: HistoryRow[] = [
  { at: '24 Jun 2025, 10:15', student: 'Rahul K', action: 'Promoted', stream: 'Science', prevPos: '#3', result: 'Accepted', by: 'Auto' },
  { at: '25 Jun 2025, 09:00', student: 'Meena P', action: 'No Response', stream: 'Science', prevPos: '#1', result: 'Moved to #3', by: 'Auto' },
  { at: '25 Jun 2025, 14:40', student: 'Suresh R', action: 'Removed', stream: 'Commerce', prevPos: '#2', result: 'Not Allotted', by: 'Admin' },
];

const field = (label: string, children: React.ReactNode) => (
  <label className="block text-xs font-medium text-gray-600">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);

const inputClass = 'w-full px-3 py-2 border rounded-lg text-sm';

export function WaitlistManager() {
  const [store, setStore] = useState<StreamStore>(() => withExtraWaitlist(loadStreamStore()));
  const [year, setYear] = useState('2025-26');
  const [stream, setStream] = useState('all');
  const [round, setRound] = useState('all');
  const [notified, setNotified] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailBody, setMailBody] = useState('A waitlist seat may become available. Please keep documents ready.');
  const [promoteRow, setPromoteRow] = useState<StreamWaitRow | null>(null);
  const [promoteComb, setPromoteComb] = useState('');
  const [promoteElective, setPromoteElective] = useState('');
  const [promoteNote, setPromoteNote] = useState('');
  const [promoteNotify, setPromoteNotify] = useState(true);
  const [promoteDeadlineDate, setPromoteDeadlineDate] = useState('2025-06-27');
  const [promoteDeadlineTime, setPromoteDeadlineTime] = useState('17:00');
  const [removeRow, setRemoveRow] = useState<StreamWaitRow | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeReason, setRemoveReason] = useState(REMOVE_REASONS[0]);
  const [removeNotes, setRemoveNotes] = useState('');
  const [removeNotify, setRemoveNotify] = useState(true);

  const persist = (next: StreamStore) => { saveStreamStore(next); setStore(next); };

  const rows = useMemo(() => store.waitlist.filter((r) => {
    if (stream !== 'all' && r.stream !== stream) return false;
    if (round !== 'all' && r.round !== round) return false;
    if (notified !== 'all' && r.notified !== notified) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${r.name} ${r.roll} ${r.stream} ${r.comb}`.toLowerCase().includes(q)) return false;
    return true;
  }), [store.waitlist, year, stream, round, notified, search]);

  const seatAvailable = (streamName: string) => {
    const used = store.applications.filter((a) => a.allotted === streamName && (a.status === 'Allotted' || a.status === 'Accepted')).length;
    return used < (SEAT_CAPS[streamName] || 40);
  };

  const pushMove = (next: StreamStore, row: HistoryRow) => {
    next.movements = [{ at: row.at, student: row.student, action: row.action, stream: row.stream, by: row.by, prevPos: row.prevPos, result: row.result } as WaitMove, ...next.movements];
  };

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
      pushMove(next, { at: stamp(), student: row.name, action: 'Promoted', stream: row.stream, prevPos: `#${row.pos}`, result: 'Allotted', by: 'Admin' });
    });
    next.waitlist = next.waitlist.filter((w) => !keys.includes(rowKey(w))).map((w, i) => ({ ...w, pos: i + 1 }));
    pushAudit(next, 'Waitlist Allot', keys.join(', '), 'Manual allot from waitlist');
    persist(next);
    setNotice(`Allotted ${keys.length} waitlisted student(s).`);
    setSelected([]);
  };

  const openPromote = (row: StreamWaitRow) => {
    setPromoteRow(row);
    setPromoteComb(row.comb || (COMBOS[row.stream] || [''])[0]);
    setPromoteElective((ELECTIVES[row.stream] || [''])[0]);
    setPromoteNote('');
    setPromoteNotify(true);
    setPromoteDeadlineDate('2025-06-27');
    setPromoteDeadlineTime('17:00');
  };

  const confirmPromote = () => {
    if (!promoteRow) return;
    const next = { ...store };
    next.applications = next.applications.map((a) => a.roll === promoteRow.roll ? { ...a, status: 'Allotted', allotted: promoteRow.stream, eligibility: 'Eligible' } : a);
    next.waitlist = next.waitlist.filter((w) => rowKey(w) !== rowKey(promoteRow)).map((w, i) => ({ ...w, pos: i + 1 }));
    if (promoteNotify) {
      next.waitlist = next.waitlist.map((w) => w);
    }
    pushMove(next, { at: stamp(), student: promoteRow.name, action: 'Promoted', stream: promoteRow.stream, prevPos: `#${promoteRow.pos}`, result: 'Accepted', by: 'Admin' });
    pushAudit(next, 'Waitlist Promote', promoteRow.roll, `${promoteComb} · ${promoteElective}${promoteNote ? ` · ${promoteNote}` : ''}${promoteNotify ? ' · student notified' : ''}. Deadline ${promoteDeadlineDate} ${promoteDeadlineTime}`);
    persist(next);
    setPromoteRow(null);
    setNotice(`${promoteRow.name} promoted to ${promoteRow.stream}.`);
  };

  const confirmRemove = () => {
    const targets = removeRow ? [removeRow] : store.waitlist.filter((w) => selected.includes(rowKey(w)));
    if (!targets.length) return;
    const next = { ...store };
    const keys = targets.map(rowKey);
    targets.forEach((row) => {
      next.applications = next.applications.map((a) => a.roll === row.roll ? { ...a, status: 'Rejected', allotted: '', eligibility: a.eligibility } : a);
      pushMove(next, { at: stamp(), student: row.name, action: 'Removed', stream: row.stream, prevPos: `#${row.pos}`, result: 'Not Allotted', by: 'Admin' });
    });
    next.waitlist = next.waitlist.filter((w) => !keys.includes(rowKey(w))).map((w, i) => ({ ...w, pos: i + 1 }));
    pushAudit(next, 'Waitlist Remove', keys.join(', '), `${removeReason}${removeNotes ? ` · ${removeNotes}` : ''}${removeNotify ? ' · student notified' : ''}`);
    persist(next);
    setRemoveRow(null);
    setRemoveOpen(false);
    setRemoveNotes('');
    setSelected([]);
    setNotice(`Removed ${targets.length} student(s) from waitlist (Not Allotted).`);
  };

  const storedHistory = store.movements as HistoryRow[];
  const history: HistoryRow[] = storedHistory.some((row) => row.student === 'Rahul K')
    ? storedHistory
    : [...storedHistory, ...HISTORY_SEED];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Stream Selection → Waitlist Manager</p>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist Manager</h1>
          <p className="text-sm text-gray-500">Search, reorder, promote and remove waitlisted students</p>
        </div>
        <Button variant="outline" onClick={() => downloadCsv([['Pos', 'Student', 'Roll', '%', 'Stream', 'Round', 'Notified'], ...rows.map((r) => [r.pos, r.name, r.roll, r.pct, r.stream, r.round, r.notified])], 'waitlist.csv')}><Download className="w-4 h-4 mr-1" /> Export</Button>
      </div>

      {notice && <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="bg-white rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {field('Academic Year', (
            <select value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
              <option>2025-26</option><option>2024-25</option>
            </select>
          ))}
          {field('Stream', (
            <select value={stream} onChange={(e) => setStream(e.target.value)} className={inputClass}>
              {['all', 'Science', 'Commerce', 'Arts', 'Vocational'].map((s) => <option key={s} value={s}>{s === 'all' ? 'All Streams' : s}</option>)}
            </select>
          ))}
          {field('Round', (
            <select value={round} onChange={(e) => setRound(e.target.value)} className={inputClass}>
              <option value="all">All Rounds</option>
              <option>Round 1</option>
              <option>Round 2</option>
              <option>Round 3</option>
            </select>
          ))}
          {field('Notified', (
            <select value={notified} onChange={(e) => setNotified(e.target.value)} className={inputClass}>
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
              <Button variant="outline" onClick={() => { setRemoveRow(null); setRemoveOpen(true); setRemoveReason(REMOVE_REASONS[0]); setRemoveNotes(''); setRemoveNotify(true); }}><Trash2 className="w-4 h-4 mr-1" /> Remove</Button>
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
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openPromote(r)}>Promote</Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { setRemoveRow(r); setRemoveOpen(true); setRemoveReason(REMOVE_REASONS[0]); setRemoveNotes(''); setRemoveNotify(true); }}>Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Waitlist Movement History</h2>
          <p className="text-xs text-gray-500">Permanent log of promotions, removals and auto-moves.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Date & Time', 'Student', 'Action', 'Stream', 'Previous Position', 'Result', 'Done By'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No movement history yet.</td></tr>}
              {history.map((m, index) => (
                <tr key={`${m.at}-${m.student}-${index}`}>
                  <td className="px-3 py-2 text-xs text-gray-600">{m.at}</td>
                  <td className="px-3 py-2 font-medium">{m.student}</td>
                  <td className="px-3 py-2">{m.action}</td>
                  <td className="px-3 py-2">{m.stream}</td>
                  <td className="px-3 py-2">{m.prevPos || '—'}</td>
                  <td className="px-3 py-2">{m.result || '—'}</td>
                  <td className="px-3 py-2">{m.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={Boolean(promoteRow)} onClose={() => setPromoteRow(null)} title="Promote Student" size="lg">
        {promoteRow && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><p className="text-xs text-gray-500">Student Name</p><p className="font-semibold">{promoteRow.name}</p></div>
              <div><p className="text-xs text-gray-500">Category</p><p className="font-semibold">{promoteRow.cat}</p></div>
              <div><p className="text-xs text-gray-500">Stream Being Promoted To</p><p className="font-semibold">{promoteRow.stream}</p></div>
              <div>
                <p className="text-xs text-gray-500">Category Seat Available?</p>
                {seatAvailable(promoteRow.stream)
                  ? <p className="font-semibold text-emerald-700">✅ Yes</p>
                  : <p className="font-semibold text-red-700">❌ No — warning: no category seat is currently free.</p>}
              </div>
            </div>
            {field('Combination to Allot', (
              <select className={inputClass} value={promoteComb} onChange={(e) => setPromoteComb(e.target.value)}>
                {(COMBOS[promoteRow.stream] || [promoteRow.comb]).map((c) => <option key={c}>{c}</option>)}
              </select>
            ))}
            {field('Elective', (
              <select className={inputClass} value={promoteElective} onChange={(e) => setPromoteElective(e.target.value)}>
                {(ELECTIVES[promoteRow.stream] || ['General']).map((c) => <option key={c}>{c}</option>)}
              </select>
            ))}
            {field('Promotion Note', (
              <input className={inputClass} value={promoteNote} onChange={(e) => setPromoteNote(e.target.value)} placeholder="Optional internal note" />
            ))}
            <Toggle label="Notify Student" checked={promoteNotify} onChange={setPromoteNotify} />
            <div className="grid gap-3 sm:grid-cols-2">
              {field('Response Deadline Date', (
                <input type="date" className={inputClass} value={promoteDeadlineDate} onChange={(e) => setPromoteDeadlineDate(e.target.value)} />
              ))}
              {field('Response Deadline Time', (
                <input type="time" className={inputClass} value={promoteDeadlineTime} onChange={(e) => setPromoteDeadlineTime(e.target.value)} />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPromoteRow(null)}>Cancel</Button>
              <Button onClick={confirmPromote}>Confirm Promotion</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={removeOpen} onClose={() => { setRemoveOpen(false); setRemoveRow(null); }} title="Remove from Waitlist">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500">Student</p>
            <p className="font-semibold">
              {removeRow ? `${removeRow.name} · ${removeRow.roll}` : `${selected.length} selected student(s)`}
            </p>
          </div>
          {field('Removal Reason', (
            <select className={inputClass} value={removeReason} onChange={(e) => setRemoveReason(e.target.value)}>
              {REMOVE_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          ))}
          <Textarea label="Additional Notes" rows={3} value={removeNotes} onChange={(e) => setRemoveNotes(e.target.value)} />
          <Toggle label="Notify Student of Removal" checked={removeNotify} onChange={setRemoveNotify} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setRemoveOpen(false); setRemoveRow(null); }}>Cancel</Button>
            <Button onClick={confirmRemove}>Confirm Removal</Button>
          </div>
        </div>
      </Modal>

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
    </div>
  );
}

export default WaitlistManager;
