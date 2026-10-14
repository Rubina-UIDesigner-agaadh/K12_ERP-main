import React, { useRef, useState } from 'react';
import { Play, Eye, Pause, RotateCcw, CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import {
  downloadCsv,
  loadStreamStore,
  pushAudit,
  saveStreamStore,
  stamp,
  streamMeets,
  type StreamApplication,
  type StreamStore
} from './ApplicationsDashboard';
import { StudentApplicationDetail } from './StudentApplicationDetail';

const SEAT_CAP: Record<string, number> = { Science: 3, Commerce: 3, Arts: 2, Vocational: 2 };

function allocate(store: StreamStore, includeWait: boolean) {
  const seats = { ...SEAT_CAP };
  const used: Record<string, number> = { Science: 0, Commerce: 0, Arts: 0, Vocational: 0 };
  const waitlist = includeWait ? [...store.waitlist] : store.waitlist.filter((w) => false);
  const candidates = store.applications
    .filter((a) => a.year === '2025-26' && a.status !== 'Draft' && a.status !== 'Rejected' && a.status !== 'Accepted' && a.eligibility !== 'Not Eligible')
    .slice()
    .sort((a, b) => b.pct - a.pct);

  const results: { app: StreamApplication; pref: string; stream: string; comb: string; reason: string; status: 'Allotted' | 'Waitlisted' }[] = [];

  candidates.forEach((a) => {
    const prefs = [a.p1, a.p2, a.p3];
    let placed = '';
    let prefLabel = '—';
    let reason = 'Seats exhausted';
    prefs.forEach((p, idx) => {
      if (placed) return;
      if (!streamMeets(a.pct, p)) {
        reason = `${idx + 1}st Pref not eligible`;
        return;
      }
      if ((used[p] || 0) < (seats[p] || 0)) {
        placed = p;
        prefLabel = `${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : 'rd'}`;
        reason = `${prefLabel} Pref — Seat Available`;
        used[p] = (used[p] || 0) + 1;
      } else {
        reason = `${idx + 1} Pref Full`;
      }
    });
    if (placed) {
      a.status = a.status === 'Accepted' ? a.status : 'Allotted';
      a.allotted = placed;
      results.push({ app: a, pref: prefLabel, stream: placed, comb: placed === 'Science' ? 'PCM' : placed, reason, status: 'Allotted' });
    } else {
      a.status = 'Waitlisted';
      a.allotted = '';
      results.push({ app: a, pref: '—', stream: a.p1, comb: a.p1 === 'Science' ? 'PCM' : a.p1, reason, status: 'Waitlisted' });
      if (!waitlist.some((w) => w.roll === a.roll)) {
        waitlist.push({
          pos: waitlist.length + 1,
          name: a.name,
          roll: a.roll,
          cat: a.category,
          pct: a.pct,
          stream: a.p1,
          comb: a.p1 === 'Science' ? 'PCM' : a.p1,
          why: reason,
          date: stamp().split(' ')[0],
          round: store.currentRound,
          notified: 'No'
        });
      }
    }
  });

  store.waitlist = waitlist.map((w, i) => ({ ...w, pos: i + 1 }));
  store.lastAllotment = stamp();
  store.roundStatus = 'Completed';
  return results;
}

export function AllotmentControlPanel() {
  const [store, setStore] = useState(() => loadStreamStore());
  const [type, setType] = useState('Auto');
  const [sort, setSort] = useState('Aggregate %');
  const [tb1, setTb1] = useState('Math Marks');
  const [tb2, setTb2] = useState('Date of Birth');
  const [includeWait, setIncludeWait] = useState(true);
  const [notify, setNotify] = useState(true);
  const [channels, setChannels] = useState<string[]>(['SMS', 'Email']);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [results, setResults] = useState<{ app: StreamApplication; pref: string; stream: string; comb: string; reason: string; status: string }[]>([]);
  const [viewing, setViewing] = useState<StreamApplication | null>(null);
  const [rerunOpen, setRerunOpen] = useState(false);
  const [password, setPassword] = useState('');
  const timer = useRef<number | null>(null);
  const previewRef = useRef(false);

  const checklistItems = [
    { key: 'apps', label: 'All applications submitted and locked' },
    { key: 'eligibility', label: 'Eligibility check completed for all' },
    { key: 'seats', label: 'Seat matrix fully configured' },
    { key: 'schedule', label: 'Current schedule phase is active' },
    { key: 'previous', label: 'Previous round acceptance window closed' }
  ];
  const ready = checklistItems.every((c) => store.checklist[c.key]);

  const persist = (next: StreamStore) => {
    saveStreamStore(next);
    setStore({ ...next, applications: [...next.applications], waitlist: [...next.waitlist], checklist: { ...next.checklist } });
  };

  const stopTimer = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const finishRun = () => {
    const next = loadStreamStore();
    const allocated = previewRef.current ? allocate({ ...next, applications: next.applications.map((a) => ({ ...a })), waitlist: next.waitlist.map((w) => ({ ...w })) }, includeWait) : allocate(next, includeWait);
    if (!previewRef.current) {
      pushAudit(next, 'Allotment Run', next.currentRound, `${type} allotment · sort ${sort} · ${allocated.filter((r) => r.status === 'Allotted').length} allotted`);
      if (notify) pushAudit(next, 'Notification', next.currentRound, `Allotment notices via ${channels.join(', ')}`);
      saveStreamStore(next);
      setStore(loadStreamStore());
    }
    setResults(allocated);
    setDone(true);
    setRunning(false);
    setPaused(false);
    setNotice(previewRef.current ? 'Dry run complete. Results not saved.' : `${next.currentRound} allotment completed.`);
  };

  const run = (preview: boolean) => {
    if (!ready && !preview) { setNotice('Checklist incomplete. Allotment cannot run.'); return; }
    previewRef.current = preview;
    stopTimer();
    setRunning(true); setDone(false); setPaused(false); setProgress(0);
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          stopTimer();
          finishRun();
          return 100;
        }
        return p + 12;
      });
    }, 200);
  };

  const toggleCh = (c: string) => setChannels((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  if (viewing) {
    return (
      <StudentApplicationDetail
        application={viewing}
        onBack={() => setViewing(null)}
        onChange={(updated) => {
          const next = loadStreamStore();
          next.applications = next.applications.map((a) => a.id === updated.id ? updated : a);
          persist(next);
          setViewing(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Allotment → Control Panel</p>
        <div className="flex items-center gap-3 mt-1"><h1 className="text-2xl font-bold">Allotment Control Panel</h1><Badge variant="info">2025-26</Badge></div>
        <p className="text-sm text-gray-500">Run the allocation engine, monitor rounds and publish results</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Pre-allotment Checklist</h2>
        <ul className="space-y-2 text-sm">
          {checklistItems.map((c) => (
            <li key={c.key}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(store.checklist[c.key])}
                  onChange={(e) => {
                    const next = loadStreamStore();
                    next.checklist = { ...next.checklist, [c.key]: e.target.checked };
                    persist(next);
                  }}
                />
                {store.checklist[c.key] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                {c.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-gray-600">Allotment Round Number</label>
          <select value={store.currentRound} onChange={(e) => { const next = loadStreamStore(); next.currentRound = e.target.value; persist(next); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
            <option>Round 1</option><option>Round 2</option><option>Round 3</option>
          </select>
        </div>
        <div><label className="text-xs text-gray-600">Allotment Type *</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Auto</option><option>Manual</option></select></div>
        <div><label className="text-xs text-gray-600">Primary Merit Sort *</label><select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Aggregate %</option><option>Board Marks</option><option>Subject Marks</option></select></div>
        <div><label className="text-xs text-gray-600">Tiebreaker 1 *</label><select value={tb1} onChange={(e) => setTb1(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Math Marks</option><option>Science Marks</option><option>DOB</option></select></div>
        <div><label className="text-xs text-gray-600">Tiebreaker 2 *</label><select value={tb2} onChange={(e) => setTb2(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Date of Birth</option><option>Alphabetical order</option></select></div>
        <Toggle checked={includeWait} onChange={setIncludeWait} label="Include waitlisted from previous round" />
        <Toggle checked={notify} onChange={setNotify} label="Notify students after allotment" />
        {notify && <div className="md:col-span-2 flex flex-wrap gap-3 text-sm">{['SMS', 'Email', 'WhatsApp', 'App Notification'].map((c) => <label key={c}><input type="checkbox" checked={channels.includes(c)} onChange={() => toggleCh(c)} className="mr-1" />{c}</label>)}</div>}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run(false)} disabled={!ready || running}><Play className="w-4 h-4 mr-1" /> Run Allotment Round</Button>
        <Button variant="outline" onClick={() => run(true)} disabled={running}><Eye className="w-4 h-4 mr-1" /> Preview / Dry Run</Button>
        <Button variant="outline" disabled={!running || paused} onClick={() => { stopTimer(); setPaused(true); setRunning(false); setNotice('Allotment paused. Resume to continue.'); }}><Pause className="w-4 h-4 mr-1" /> Pause</Button>
        <Button variant="outline" disabled={!paused} onClick={() => { setPaused(false); setRunning(true); timer.current = window.setInterval(() => { setProgress((p) => { if (p >= 100) { stopTimer(); finishRun(); return 100; } return p + 12; }); }, 200); }}>Resume</Button>
        <Button variant="outline" onClick={() => { const next = loadStreamStore(); next.roundStatus = 'Published'; persist(next); setNotice(`${next.currentRound} results published to parent portal.`); }}>Publish Results</Button>
        <Button variant="outline" onClick={() => { const next = loadStreamStore(); next.roundStatus = 'Locked'; persist(next); setNotice(`${next.currentRound} is locked. Re-run requires admin password.`); }}>Lock Round</Button>
        <Button variant="outline" onClick={() => setRerunOpen(true)}><RotateCcw className="w-4 h-4 mr-1" /> Re-run Allotment</Button>
      </div>

      {running && (
        <div className="bg-white rounded-xl border p-5">
          <p className="font-medium mb-2">{store.currentRound} Allotment in Progress...</p>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-600" style={{ width: `${progress}%` }} /></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mt-3">
            <span>Processed {Math.round((progress / 100) * store.applications.length)}</span>
            <span>Engine: {type}</span>
            <span>Sort: {sort}</span>
            <span>TB: {tb1} / {tb2}</span>
            <span>{Math.max(0, Math.round((100 - progress) / 12 * 0.2))}s remaining</span>
          </div>
        </div>
      )}

      {done && results.length > 0 && (
        <>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Agg %', 'Pref', 'Stream', 'Combination', 'Reason', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {results.map((r) => (
                  <tr key={r.app.roll}>
                    <td className="px-3 py-2 font-medium">{r.app.name}</td>
                    <td className="px-3 py-2">{r.app.roll}</td>
                    <td className="px-3 py-2">{r.app.pct}</td>
                    <td className="px-3 py-2">{r.pref}</td>
                    <td className="px-3 py-2">{r.stream}</td>
                    <td className="px-3 py-2">{r.comb}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{r.reason}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Allotted' ? 'success' : 'warning'}>{r.status}</Badge></td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setViewing(r.app)}>View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" onClick={() => downloadCsv([['Student', 'Roll', 'Stream', 'Status', 'Reason'], ...results.map((r) => [r.app.name, r.app.roll, r.stream, r.status, r.reason])], 'allotment-results.csv')}><Download className="w-4 h-4 mr-1" /> Export Results</Button>
        </>
      )}

      <Modal
        isOpen={rerunOpen}
        onClose={() => setRerunOpen(false)}
        title="Confirm re-run"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRerunOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (password !== 'admin') { setNotice('Re-run requires admin password (use admin).'); return; }
              setRerunOpen(false); setPassword(''); run(false);
            }}>Re-run</Button>
          </div>
        }>
        <p className="text-sm text-gray-600 mb-3">Re-running overwrites the current round. Enter admin password to continue.</p>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </Modal>
    </div>
  );
}

export default AllotmentControlPanel;
