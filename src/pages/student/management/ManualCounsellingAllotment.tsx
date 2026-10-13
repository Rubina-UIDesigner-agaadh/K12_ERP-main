import React, { useMemo, useState } from 'react';
import { Search, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import {
  loadStreamStore,
  pushAudit,
  saveStreamStore,
  stamp,
  streamMeets,
  type StreamApplication
} from './ApplicationsDashboard';
import { StudentApplicationDetail } from './StudentApplicationDetail';

export function ManualCounsellingAllotment() {
  const [store, setStore] = useState(() => loadStreamStore());
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [round, setRound] = useState('All');
  const [cat, setCat] = useState('All');
  const [picked, setPicked] = useState<StreamApplication | null>(null);
  const [stream, setStream] = useState('');
  const [comb, setComb] = useState('');
  const [elective, setElective] = useState('');
  const [justification, setJustification] = useState('');
  const [override, setOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StreamApplication | null>(null);

  const list = useMemo(() => {
    return store.applications.filter((s) => {
      const term = q.trim().toLowerCase();
      if (term && !`${s.name} ${s.roll} ${s.id}`.toLowerCase().includes(term)) return false;
      if (status !== 'All' && s.status !== status) return false;
      if (round !== 'All' && s.round !== round) return false;
      if (cat !== 'All' && s.category !== cat) return false;
      return s.status === 'Waitlisted' || s.status === 'Not Eligible' || s.status === 'Eligible' || s.status === 'Submitted' || s.status === 'Under Review' || status !== 'All';
    });
  }, [store, q, status, cat, round]);

  const seats = stream === 'Science'
    ? [{ cat: 'General', total: 40, avail: 5 }, { cat: 'OBC', total: 15, avail: 0 }, { cat: 'SC', total: 10, avail: 2 }]
    : [{ cat: 'General', total: 40, avail: 12 }, { cat: 'OBC', total: 15, avail: 4 }, { cat: 'SC', total: 10, avail: 3 }];

  const persist = () => setStore(loadStreamStore());

  const save = () => {
    if (!picked || !stream || !comb || justification.trim().length < 30 || !confirm) {
      setNotice('Select student, stream, combination, 30+ char reason, and confirm.');
      return;
    }
    if (override && overrideReason.trim().length < 8) {
      setNotice('Override reason is required.');
      return;
    }
    const eligible = streamMeets(picked.pct, stream);
    if (!eligible && !override) {
      setNotice(`${picked.name} is not eligible for ${stream}. Enable eligibility override.`);
      return;
    }
    const next = loadStreamStore();
    next.applications = next.applications.map((a) => a.id === picked.id ? { ...a, status: 'Allotted', allotted: stream, eligibility: 'Eligible' } : a);
    next.waitlist = next.waitlist.filter((w) => w.roll !== picked.roll);
    next.counselling = [{ name: picked.name, cat: picked.category, stream, comb, reason: justification, by: 'Counsellor Mehta', date: stamp().split(' ')[0] }, ...next.counselling];
    pushAudit(next, 'Manual Allotment', picked.name, `${stream} — ${comb}${elective ? ` / ${elective}` : ''} — ${justification}`);
    saveStreamStore(next);
    persist();
    setPicked((p) => p ? { ...p, status: 'Allotted', allotted: stream, eligibility: 'Eligible' } : p);
    setNotice(`Manual allotment of ${stream} — ${comb} saved for ${picked.name}.`);
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
        <p className="text-xs text-gray-500">Home → Allotment → Manual Allotment</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold">Manual Allotment — Counselling Mode</h1>
          <Badge variant="info">Counsellor Mehta</Badge>
        </div>
        <p className="text-sm text-gray-500">Manually assign streams to special case students</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name / Roll / Admission No" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Waitlisted</option><option>Not Eligible</option><option>Eligible</option><option>Submitted</option><option>Under Review</option></select>
        <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Round 1</option><option>Round 2</option><option>Counselling</option></select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>General</option><option>SC</option><option>ST</option><option>OBC</option><option>EWS</option></select>
        <div className="md:col-span-4 border rounded-lg divide-y max-h-48 overflow-y-auto">
          {list.length === 0 && <p className="px-3 py-4 text-sm text-gray-400">No students match the search.</p>}
          {list.map((s) => (
            <button type="button" key={s.id} onClick={() => { setPicked(s); setStream(s.p1); setComb(''); setJustification(''); setConfirm(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 ${picked?.id === s.id ? 'bg-indigo-50' : ''}`}>
              {s.name} · {s.roll} · {s.status} · {s.pct}%
            </button>
          ))}
        </div>
      </div>

      {picked && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <h2 className="font-semibold text-base">Student Information</h2>
              <Button size="sm" variant="ghost" onClick={() => setViewing(picked)}>Open full profile</Button>
            </div>
            <p><b>{picked.name}</b> · {picked.roll} · {picked.classSec}</p>
            <p>Category {picked.category} · Aggregate {picked.pct}%</p>
            <p>Preferences: {picked.p1} / {picked.p2} / {picked.p3}</p>
            <p>Science {streamMeets(picked.pct, 'Science') ? '✅ Eligible' : '❌ Not Eligible'} · Commerce {streamMeets(picked.pct, 'Commerce') ? '✅' : '❌'} · Arts {streamMeets(picked.pct, 'Arts') ? '✅' : '❌'}</p>
            <p>Current status: {picked.status} · Allotted: {picked.allotted || '—'}</p>
          </div>
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="font-semibold">Manual Allotment Form</h2>
            <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Stream *</option><option>Science</option><option>Commerce</option><option>Arts</option><option>Vocational</option></select>
            <select value={comb} onChange={(e) => setComb(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Combination *</option><option>PCM</option><option>PCB</option><option>Commerce with Math</option><option>Humanities</option></select>
            <select value={elective} onChange={(e) => setElective(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Elective (if any)</option><option>Computer Science</option><option>Psychology</option></select>
            <Textarea rows={3} value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Allotment justification (min 30 characters) *" />
            <p className="text-xs text-gray-500">{justification.trim().length}/30 characters</p>
            <Toggle checked={override} onChange={setOverride} label="Override eligibility rules?" />
            {override && <Textarea rows={2} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Override reason *" />}
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} /> I confirm this manual allotment is justified</label>
            {stream && (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500"><th>Category</th><th>Total</th><th>Available</th><th>Can Allot?</th></tr></thead>
                <tbody>{seats.map((s) => <tr key={s.cat}><td>{s.cat}</td><td>{s.total}</td><td>{s.avail}</td><td>{s.avail > 0 ? '✅ Yes' : '❌ No'}</td></tr>)}</tbody>
              </table>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={save}>🎯 Confirm Manual Allotment</Button>
              <Button variant="outline" onClick={() => {
                const next = loadStreamStore();
                pushAudit(next, 'Notification', picked.id, `Counselling allotment notice for ${picked.name}`);
                saveStreamStore(next);
                setNotice(`Notification sent to ${picked.name}.`);
              }}><Mail className="w-4 h-4 mr-1" /> Notify Student</Button>
              <Button variant="outline" onClick={() => { setPicked(null); setStream(''); setComb(''); setJustification(''); setConfirm(false); }}>Search Another</Button>
              <Button variant="ghost" onClick={() => { setStream(''); setComb(''); setJustification(''); setConfirm(false); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Recent Counselling Allotments</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Student', 'Category', 'Stream', 'Combination', 'Reason', 'By', 'Date'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {store.counselling.length === 0 && <tr><td colSpan={7} className="px-3 py-4 text-gray-400">No counselling allotments yet.</td></tr>}
            {store.counselling.map((r, i) => <tr key={r.name + r.date + i}><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.cat}</td><td className="px-3 py-2">{r.stream}</td><td className="px-3 py-2">{r.comb}</td><td className="px-3 py-2">{r.reason}</td><td className="px-3 py-2">{r.by}</td><td className="px-3 py-2">{r.date}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManualCounsellingAllotment;
