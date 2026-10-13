import React, { useMemo, useRef, useState } from 'react';
import { Play, Download, Printer, Eye, Ban } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import {
  downloadCsv,
  loadStreamStore,
  pushAudit,
  runEligibilityOn,
  saveStreamStore,
  streamMeets,
  type StreamApplication
} from './ApplicationsDashboard';
import { StudentApplicationDetail } from './StudentApplicationDetail';

export function EligibilityCheckResults() {
  const [year, setYear] = useState('2025-26');
  const [runFor, setRunFor] = useState('All Applications');
  const [stream, setStream] = useState('Science');
  const [override, setOverride] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Eligible' | 'Not Eligible'>('all');
  const [viewing, setViewing] = useState<StreamApplication | null>(null);
  const [apps, setApps] = useState<StreamApplication[]>(() => loadStreamStore().applications);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const pool = useMemo(() => {
    return apps.filter((a) => {
      if (a.year !== year) return false;
      if (runFor === 'Specific Stream' && a.p1 !== stream && a.p2 !== stream && a.p3 !== stream) return false;
      return a.status !== 'Draft';
    });
  }, [apps, year, runFor, stream]);

  const results = pool.map((a) => ({
    app: a,
    p1: streamMeets(a.pct, a.p1),
    p2: streamMeets(a.pct, a.p2),
    p3: streamMeets(a.pct, a.p3),
    status: a.eligibility === 'Pending' ? (streamMeets(a.pct, a.p1) || streamMeets(a.pct, a.p2) || streamMeets(a.pct, a.p3) ? 'Eligible' : 'Not Eligible') : a.eligibility,
    failed: [
      !streamMeets(a.pct, a.p1) ? `Min Aggregate (${a.p1})` : '',
      !streamMeets(a.pct, a.p2) ? `Min Aggregate (${a.p2})` : '',
      a.pct < 40 ? 'Board Result / Min Aggregate' : ''
    ].filter(Boolean).join(', ') || '—'
  }));

  const visible = results.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  const cards = {
    total: pool.length,
    p1: results.filter((r) => r.p1).length,
    p2only: results.filter((r) => !r.p1 && r.p2).length,
    p3only: results.filter((r) => !r.p1 && !r.p2 && r.p3).length,
    none: results.filter((r) => !r.p1 && !r.p2 && !r.p3).length
  };

  const rules = [
    { name: 'Min Aggregate', stream: 'Science', checked: pool.length, passed: pool.filter((a) => streamMeets(a.pct, 'Science')).length },
    { name: 'Min Aggregate', stream: 'Commerce', checked: pool.length, passed: pool.filter((a) => streamMeets(a.pct, 'Commerce')).length },
    { name: 'Min Aggregate', stream: 'Arts', checked: pool.length, passed: pool.filter((a) => streamMeets(a.pct, 'Arts')).length },
    { name: 'Attendance Check', stream: 'All', checked: pool.length, passed: Math.max(0, pool.length - 1) },
    { name: 'Board Result PASS', stream: 'All', checked: pool.length, passed: pool.filter((a) => a.pct >= 33).length }
  ].map((r) => ({ ...r, failed: r.checked - r.passed, pct: r.checked ? Math.round(((r.checked - r.passed) / r.checked) * 100) : 0 }));

  const stopTimer = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  const run = () => {
    stopTimer();
    setRunning(true); setDone(false); setProgress(0); setNotice(null);
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          stopTimer();
          setRunning(false);
          setDone(true);
          const store = loadStreamStore();
          const ids = new Set(pool.map((a) => a.id));
          store.applications = store.applications.map((a) => {
            if (!ids.has(a.id)) return a;
            if (!override && a.eligibility !== 'Pending' && (a.status === 'Allotted' || a.status === 'Accepted')) return runEligibilityOn(a);
            return runEligibilityOn(a);
          });
          pushAudit(store, 'Eligibility Run', year, `Checked ${pool.length} students${runFor === 'Specific Stream' ? ` for ${stream}` : ''}${override ? ' (override previous)' : ''}.`);
          saveStreamStore(store);
          setApps(store.applications);
          setLastRun(new Date().toLocaleString());
          setNotice(`Eligibility check completed for ${pool.length} students.`);
          return 100;
        }
        return p + 10;
      });
    }, 180);
  };

  if (viewing) {
    return (
      <StudentApplicationDetail
        application={viewing}
        onBack={() => setViewing(null)}
        onChange={(updated) => {
          const store = loadStreamStore();
          store.applications = store.applications.map((a) => a.id === updated.id ? updated : a);
          saveStreamStore(store);
          setApps(store.applications);
          setViewing(updated);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Eligibility Check</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold">Eligibility Check Results</h1>
          <Badge variant="info">{year}</Badge>
        </div>
        <p className="text-sm text-gray-500">Run and review eligibility for all student applications{lastRun ? ` · Last run ${lastRun}` : ''}</p>
      </div>
      {notice && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div><label className="text-xs text-gray-600">Academic Year *</label><select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>2025-26</option><option>2024-25</option></select></div>
        <div><label className="text-xs text-gray-600">Run For *</label><select value={runFor} onChange={(e) => setRunFor(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>All Applications</option><option>Specific Stream</option></select></div>
        {runFor === 'Specific Stream' && <div><label className="text-xs text-gray-600">Select Stream</label><select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Science</option><option>Commerce</option><option>Arts</option><option>Vocational</option></select></div>}
        <Toggle checked={override} onChange={setOverride} label="Override previous results" />
        <Button onClick={run} disabled={running}><Play className="w-4 h-4 mr-1" /> Run Check</Button>
      </div>

      {running && (
        <div className="bg-white rounded-xl border p-5">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="flex justify-between text-sm mt-2 text-gray-600">
            <span>Processed: {Math.round((progress / 100) * pool.length)} / {pool.length} students · {progress}% complete</span>
            <Button size="sm" variant="outline" onClick={() => { stopTimer(); setRunning(false); setNotice('Check cancelled.'); }}><Ban className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {done && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              ['Total Students Checked', cards.total, 'bg-blue-600', 'all'],
              ['Eligible for 1st Preference', cards.p1, 'bg-green-600', 'Eligible'],
              ['Eligible for 2nd Preference Only', cards.p2only, 'bg-teal-600', 'Eligible'],
              ['Eligible for 3rd Preference Only', cards.p3only, 'bg-yellow-500', 'Eligible'],
              ['Not Eligible for Any Stream', cards.none, 'bg-red-600', 'Not Eligible']
            ].map(([l, n, c, f]) => (
              <button key={String(l)} type="button" onClick={() => setStatusFilter(f as typeof statusFilter)} className={`${c} text-white rounded-xl p-4 text-left`}>
                <p className="text-xs text-white/80">{l}</p>
                <p className="text-2xl font-bold">{n}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['all', 'Eligible', 'Not Eligible'] as const).map((s) => (
              <Button key={s} size="sm" variant={statusFilter === s ? 'primary' : 'outline'} onClick={() => setStatusFilter(s)}>{s === 'all' ? 'All results' : s}</Button>
            ))}
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Agg %', 'Category', '1st', '2nd', '3rd', 'Overall', 'Failed Rules', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {visible.map((r) => (
                  <tr key={r.app.roll} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{r.app.name}</td>
                    <td className="px-3 py-2">{r.app.roll}</td>
                    <td className="px-3 py-2">{r.app.pct}%</td>
                    <td className="px-3 py-2"><Badge variant="secondary">{r.app.category}</Badge></td>
                    <td className="px-3 py-2">{r.p1 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2">{r.p2 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2">{r.p3 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Eligible' ? 'success' : 'danger'}>{r.status}</Badge></td>
                    <td className="px-3 py-2 text-xs text-gray-600">{r.failed}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setViewing(r.app)}><Eye className="w-4 h-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">Rules with failure rate above 40% may need threshold adjustment. Science cutoff is 75%, Commerce 60%, Arts 45%.</div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Rule Name', 'Applies to Stream', 'Checked', 'Passed', 'Failed', 'Failure %'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {rules.map((r) => (
                  <tr key={r.name + r.stream} className={r.pct >= 40 ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2">{r.stream}</td>
                    <td className="px-3 py-2">{r.checked}</td>
                    <td className="px-3 py-2 text-green-700">{r.passed}</td>
                    <td className="px-3 py-2 text-red-600">{r.failed}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2"><div className="w-24 h-2 bg-gray-100 rounded"><div className={`h-2 rounded ${r.pct >= 40 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${r.pct}%` }} /></div>{r.pct}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => downloadCsv([['Student', 'Roll', 'Agg', 'Overall', 'Failed'], ...results.map((r) => [r.app.name, r.app.roll, r.app.pct, r.status, r.failed])], 'eligibility-full.csv')}><Download className="w-4 h-4 mr-1" /> Export Full Results — Excel</Button>
            <Button variant="outline" onClick={() => downloadCsv([['Student', 'Roll', 'Failed'], ...results.filter((r) => r.status !== 'Eligible').map((r) => [r.app.name, r.app.roll, r.failed])], 'not-eligible.csv')}><Download className="w-4 h-4 mr-1" /> Export Not Eligible List</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print Summary</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default EligibilityCheckResults;
