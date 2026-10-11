import React, { useState } from 'react';
import { Play, Eye, Pause, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';

const CHECKLIST = [
  { label: 'All applications submitted and locked', ok: true },
  { label: 'Eligibility check completed for all', ok: true },
  { label: 'Seat matrix fully configured', ok: true },
  { label: 'Current schedule phase is active', ok: true },
  { label: 'Previous round acceptance window closed', ok: true }
];

const RESULTS = [
  { name: 'Aarav Patel', roll: 'CBSE1001', pct: 91.2, cat: 'General', pref: '1st', stream: 'Science', comb: 'PCM', reason: '1st Pref — Seat Available', status: 'Allotted' },
  { name: 'Diya Sharma', roll: 'CBSE1002', pct: 78.4, cat: 'OBC', pref: '1st', stream: 'Commerce', comb: 'Commerce with Math', reason: '1st Pref — Seat Available', status: 'Allotted' },
  { name: 'Rohan Mehta', roll: 'CBSE1003', pct: 62.0, cat: 'SC', pref: '2nd', stream: 'Commerce', comb: 'Commerce', reason: '1st Pref Full', status: 'Allotted' },
  { name: 'Meera Joshi', roll: 'CBSE1006', pct: 71.8, cat: 'EWS', pref: '—', stream: 'Commerce', comb: '—', reason: 'Seats exhausted in category', status: 'Waitlisted' }
];

export function AllotmentControlPanel() {
  const [type, setType] = useState('Auto');
  const [sort, setSort] = useState('Aggregate %');
  const [tb1, setTb1] = useState('Math Marks');
  const [tb2, setTb2] = useState('Date of Birth');
  const [includeWait, setIncludeWait] = useState(true);
  const [notify, setNotify] = useState(true);
  const [channels, setChannels] = useState<string[]>(['SMS', 'Email']);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const ready = CHECKLIST.every((c) => c.ok);

  const run = (preview: boolean) => {
    if (!ready && !preview) { setNotice('Checklist incomplete. Allotment cannot run.'); return; }
    setRunning(true); setDone(false); setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t); setRunning(false); setDone(true);
          setNotice(preview ? 'Dry run complete. Results not saved.' : 'Round 1 allotment completed.');
          return 100;
        }
        return p + 12;
      });
    }, 220);
  };

  const toggleCh = (c: string) => setChannels((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Allotment → Control Panel</p>
        <div className="flex items-center gap-3 mt-1"><h1 className="text-2xl font-bold">Allotment Control Panel</h1><Badge variant="info">2025-26</Badge></div>
        <p className="text-sm text-gray-500">Run and monitor stream allotment rounds</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Current Round', 'Round 1'], ['Round Status', 'Completed'], ['Last Allotment Run', '19 Jun 2025, 09:00'],
          ['Total Eligible', '265'], ['Allotted So Far', '198'], ['Waitlisted', '42'], ['Accepted', '160'],
          ['Rejected', '18'], ['Acceptance Deadline', '25 Jun 2025']
        ].map(([k, v]) => <div key={k} className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">{k}</p><p className="font-semibold">{v}</p></div>)}
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-3">Pre-allotment Checklist</h2>
        <ul className="space-y-2 text-sm">
          {CHECKLIST.map((c) => <li key={c.label} className="flex items-center gap-2">{c.ok ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}{c.label}</li>)}
        </ul>
      </div>

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="text-xs text-gray-600">Allotment Round Number</label><input readOnly value="Round 1" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm" /></div>
        <div><label className="text-xs text-gray-600">Allotment Type *</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Auto</option><option>Manual</option><option>Counselling</option></select></div>
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
        <Button variant="outline" disabled={!running} onClick={() => { setRunning(false); setNotice('Allotment paused.'); }}><Pause className="w-4 h-4 mr-1" /> Pause</Button>
        <Button variant="outline" onClick={() => setNotice('Re-run requires admin password confirmation.')}><RotateCcw className="w-4 h-4 mr-1" /> Re-run Allotment</Button>
      </div>

      {running && (
        <div className="bg-white rounded-xl border p-5">
          <p className="font-medium mb-2">Round 1 Allotment in Progress...</p>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-600" style={{ width: `${progress}%` }} /></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mt-3">
            <span>Processed {Math.round(progress * 3)} / 300</span>
            <span>Allotted {Math.round(progress * 1.95)}</span>
            <span>Waitlisted {Math.round(progress * 0.25)}</span>
            <span>Errors 0</span>
            <span>~30s remaining</span>
          </div>
        </div>
      )}

      {done && (
        <>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Agg %', 'Category', 'Pref', 'Stream', 'Combination', 'Reason', 'Status'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {RESULTS.map((r) => (
                  <tr key={r.roll}>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2">{r.roll}</td>
                    <td className="px-3 py-2">{r.pct}</td>
                    <td className="px-3 py-2"><Badge variant="secondary">{r.cat}</Badge></td>
                    <td className="px-3 py-2">{r.pref}</td>
                    <td className="px-3 py-2">{r.stream}</td>
                    <td className="px-3 py-2">{r.comb}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{r.reason}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Allotted' ? 'success' : 'warning'}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[['Processed', '300'], ['1st Pref', '160'], ['2nd Pref', '28'], ['3rd Pref', '10'], ['Waitlisted', '42'], ['Errors', '0']].map(([k, v]) =>
              <div key={k} className="bg-white border rounded-xl p-4 text-center"><p className="text-xs text-gray-500">{k}</p><p className="text-xl font-bold">{v}</p></div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AllotmentControlPanel;
