import React, { useMemo, useState } from 'react';
import { Download, Mail, Trash2, ArrowUp, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import {
  downloadCsv,
  loadStreamStore,
  pushAudit,
  saveStreamStore,
  stamp,
  type StreamApplication,
  type StreamWaitRow
} from './ApplicationsDashboard';
import { StudentApplicationDetail } from './StudentApplicationDetail';

export function WaitlistManager() {
  const [store, setStore] = useState(() => loadStreamStore());
  const [stream, setStream] = useState('All');
  const [round, setRound] = useState('All');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Position');
  const [dir, setDir] = useState('Ascending');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeReason, setRemoveReason] = useState('');
  const [viewing, setViewing] = useState<StreamApplication | null>(null);
  const [notifyWithin, setNotifyWithin] = useState(store.notifyWithin);
  const [responseWindow, setResponseWindow] = useState(store.responseWindow);
  const [noResponse, setNoResponse] = useState(store.noResponse);

  const persist = () => setStore(loadStreamStore());

  const rows = useMemo(() => {
    const list = store.waitlist.filter((r) => (stream === 'All' || r.stream === stream) && (cat === 'All' || r.cat === cat) && (round === 'All' || r.round === round));
    const sorted = [...list].sort((a, b) => {
      const av = sort === 'Position' ? a.pos : sort === 'Aggregate %' ? a.pct : a.date;
      const bv = sort === 'Position' ? b.pos : sort === 'Aggregate %' ? b.pct : b.date;
      if (av < bv) return dir === 'Ascending' ? -1 : 1;
      if (av > bv) return dir === 'Ascending' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [store.waitlist, stream, cat, round, sort, dir]);

  const yearApps = store.applications.filter((a) => a.year === '2025-26');
  const counts = {
    total: store.waitlist.length,
    Science: store.waitlist.filter((w) => w.stream === 'Science').length,
    Commerce: store.waitlist.filter((w) => w.stream === 'Commerce').length,
    Arts: store.waitlist.filter((w) => w.stream === 'Arts').length,
    Vocational: store.waitlist.filter((w) => w.stream === 'Vocational').length,
    promoted: store.movements.filter((m) => m.action.toLowerCase().includes('promot')).length,
    seats: Math.max(0, 3 - yearApps.filter((a) => a.status === 'Allotted').length % 4)
  };

  const promote = (rolls: string[]) => {
    if (!rolls.length) { setNotice('Select at least one student.'); return; }
    const next = loadStreamStore();
    rolls.forEach((roll) => {
      const wait = next.waitlist.find((w) => w.roll === roll);
      next.applications = next.applications.map((a) => a.roll === roll ? { ...a, status: 'Allotted', allotted: wait?.stream || a.p1, eligibility: 'Eligible' } : a);
      next.movements = [{ at: stamp(), student: wait?.name || roll, action: 'Promoted — Seat Freed', stream: wait?.stream || '—', by: store.autoPromote ? 'System (Auto)' : 'Admin' }, ...next.movements];
      pushAudit(next, 'Waitlist Promote', roll, `Promoted to ${wait?.stream}`);
    });
    next.waitlist = next.waitlist.filter((w) => !rolls.includes(w.roll)).map((w, i) => ({ ...w, pos: i + 1 }));
    saveStreamStore(next);
    persist();
    setSelected([]);
    setNotice(`Promoted ${rolls.length} student(s).`);
  };

  const notifySelected = () => {
    const rolls = selected.length ? selected : [];
    if (!rolls.length) { setNotice('Select at least one student.'); return; }
    const next = loadStreamStore();
    next.waitlist = next.waitlist.map((w) => rolls.includes(w.roll) ? { ...w, notified: 'Yes' } : w);
    pushAudit(next, 'Notification', rolls.join(', '), `Waitlist notice · respond within ${responseWindow}`);
    saveStreamStore(next);
    persist();
    setNotice(`Notification sent to ${rolls.length} student(s).`);
  };

  const removeSelected = () => {
    if (!selected.length) { setNotice('Select at least one student.'); return; }
    if (removeReason.trim().length < 8) { setNotice('Removal reason of at least 8 characters is required.'); return; }
    const next = loadStreamStore();
    selected.forEach((roll) => {
      const wait = next.waitlist.find((w) => w.roll === roll);
      next.applications = next.applications.map((a) => a.roll === roll && a.status === 'Waitlisted' ? { ...a, status: 'Rejected' } : a);
      next.movements = [{ at: stamp(), student: wait?.name || roll, action: `Removed — ${removeReason}`, stream: wait?.stream || '—', by: 'Admin' }, ...next.movements];
    });
    next.waitlist = next.waitlist.filter((w) => !selected.includes(w.roll)).map((w, i) => ({ ...w, pos: i + 1 }));
    pushAudit(next, 'Waitlist Remove', selected.join(', '), removeReason);
    saveStreamStore(next);
    persist();
    setSelected([]);
    setRemoveOpen(false);
    setRemoveReason('');
    setNotice('Removed from waitlist with reason.');
  };

  const saveSettings = (patch: Partial<{ autoPromote: boolean; notifyWithin: string; responseWindow: string; noResponse: string }>) => {
    const next = loadStreamStore();
    if (patch.autoPromote !== undefined) next.autoPromote = patch.autoPromote;
    if (patch.notifyWithin) next.notifyWithin = patch.notifyWithin;
    if (patch.responseWindow) next.responseWindow = patch.responseWindow;
    if (patch.noResponse) next.noResponse = patch.noResponse;
    saveStreamStore(next);
    persist();
  };

  const openStudent = (row: StreamWaitRow) => {
    const app = store.applications.find((a) => a.roll === row.roll);
    if (app) setViewing(app);
    else setNotice('Application record not found for this waitlisted student.');
  };

  if (viewing) {
    return (
      <StudentApplicationDetail
        application={viewing}
        onBack={() => setViewing(null)}
        onChange={(updated) => {
          const next = loadStreamStore();
          next.applications = next.applications.map((a) => a.id === updated.id ? updated : a);
          saveStreamStore(next);
          persist();
          setViewing(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Allotment → Waitlist Manager</p>
        <div className="flex items-center gap-3 mt-1"><h1 className="text-2xl font-bold">Waitlist Manager</h1><Badge variant="info">2025-26</Badge></div>
        <p className="text-sm text-gray-500">Monitor and manage students on waitlist for each stream</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          ['Total on Waitlist', counts.total], ['Science', counts.Science], ['Commerce', counts.Commerce], ['Arts', counts.Arts],
          ['Vocational', counts.Vocational], ['Promoted This Round', counts.promoted], ['Seats Available Now', counts.seats]
        ].map(([k, v]) => (
          <button key={String(k)} type="button" onClick={() => { if (['Science', 'Commerce', 'Arts', 'Vocational'].includes(String(k))) setStream(String(k)); }} className="bg-white border rounded-xl p-3 text-left">
            <p className="text-xs text-gray-500">{k}</p>
            <p className="text-xl font-bold">{v}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <select value={stream} onChange={(e) => setStream(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Science</option><option>Commerce</option><option>Arts</option><option>Vocational</option></select>
        <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Round 1</option><option>Round 2</option><option>Counselling</option></select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>General</option><option>SC</option><option>ST</option><option>OBC</option><option>EWS</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>Position</option><option>Aggregate %</option><option>Date Added</option></select>
        <select value={dir} onChange={(e) => setDir(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>Ascending</option><option>Descending</option></select>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-3 py-2"><input type="checkbox" checked={rows.length > 0 && rows.every((r) => selected.includes(r.roll))} onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.roll) : [])} /></th>
            {['Pos', 'Student', 'Roll', 'Category', 'Agg %', 'Stream', 'Combination', 'Why Waitlisted', 'Date', 'Round', 'Notified', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y">
            {rows.length === 0 && <tr><td colSpan={13} className="px-3 py-6 text-center text-gray-400">No waitlisted students for this filter.</td></tr>}
            {rows.map((r) => (
              <tr key={r.roll}>
                <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(r.roll)} onChange={() => setSelected((s) => s.includes(r.roll) ? s.filter((x) => x !== r.roll) : [...s, r.roll])} /></td>
                <td className="px-3 py-2">#{r.pos}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2">{r.roll}</td>
                <td className="px-3 py-2"><Badge variant="secondary">{r.cat}</Badge></td>
                <td className="px-3 py-2">{r.pct}</td>
                <td className="px-3 py-2">{r.stream}</td>
                <td className="px-3 py-2">{r.comb}</td>
                <td className="px-3 py-2 text-xs text-gray-600">{r.why}</td>
                <td className="px-3 py-2">{r.date}</td>
                <td className="px-3 py-2">{r.round}</td>
                <td className="px-3 py-2">{r.notified}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" title="View" onClick={() => openStudent(r)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" title="Promote" onClick={() => promote([r.roll])}><ArrowUp className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Toggle checked={store.autoPromote} onChange={(v) => saveSettings({ autoPromote: v })} label="Enable Auto-Promotion" />
        <div><label className="text-xs text-gray-600">Notify student within</label>
          <select value={notifyWithin} onChange={(e) => { setNotifyWithin(e.target.value); saveSettings({ notifyWithin: e.target.value }); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>2 Hours</option><option>24 Hours</option></select>
        </div>
        <div><label className="text-xs text-gray-600">Response window</label>
          <select value={responseWindow} onChange={(e) => { setResponseWindow(e.target.value); saveSettings({ responseWindow: e.target.value }); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>48 Hours</option><option>24 Hours</option></select>
        </div>
        <div><label className="text-xs text-gray-600">If no response</label>
          <select value={noResponse} onChange={(e) => { setNoResponse(e.target.value); saveSettings({ noResponse: e.target.value }); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Move to next</option><option>Skip</option><option>Notify Admin</option></select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => promote(selected)}><ArrowUp className="w-4 h-4 mr-1" /> Promote Selected</Button>
        <Button variant="outline" onClick={notifySelected}><Mail className="w-4 h-4 mr-1" /> Notify Selected</Button>
        <Button variant="outline" onClick={() => setRemoveOpen(true)}><Trash2 className="w-4 h-4 mr-1" /> Remove from Waitlist</Button>
        <Button variant="outline" onClick={() => downloadCsv([['Pos', 'Student', 'Roll', 'Stream', 'Why'], ...rows.map((r) => [r.pos, r.name, r.roll, r.stream, r.why])], 'waitlist.csv')}><Download className="w-4 h-4 mr-1" /> Export Waitlist</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Waitlist Movement History</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Date & Time', 'Student', 'Action', 'Stream', 'Done By'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{store.movements.map((m) => <tr key={m.at + m.student + m.action}><td className="px-3 py-2">{m.at}</td><td className="px-3 py-2">{m.student}</td><td className="px-3 py-2">{m.action}</td><td className="px-3 py-2">{m.stream}</td><td className="px-3 py-2">{m.by}</td></tr>)}</tbody>
        </table>
      </div>

      <Modal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title="Remove from waitlist"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRemoveOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={removeSelected}>Remove</Button>
          </div>
        }>
        <Textarea rows={3} value={removeReason} onChange={(e) => setRemoveReason(e.target.value)} placeholder="Reason for removal (min 8 characters)" />
      </Modal>
    </div>
  );
}

export default WaitlistManager;
