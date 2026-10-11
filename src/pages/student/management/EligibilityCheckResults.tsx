import React, { useState } from 'react';
import { Play, Download, Printer, Eye, Ban } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';

const RESULTS = [
  { name: 'Aarav Patel', roll: 'CBSE1001', pct: 91.2, cat: 'General', p1: true, p2: true, p3: true, status: 'Eligible', failed: '—' },
  { name: 'Diya Sharma', roll: 'CBSE1002', pct: 78.4, cat: 'OBC', p1: true, p2: true, p3: true, status: 'Eligible', failed: '—' },
  { name: 'Rohan Mehta', roll: 'CBSE1003', pct: 62.0, cat: 'SC', p1: false, p2: true, p3: true, status: 'Eligible', failed: 'Min Math Marks (Science)' },
  { name: 'Ananya Iyer', roll: 'CBSE1004', pct: 48.5, cat: 'ST', p1: false, p2: false, p3: true, status: 'Eligible', failed: 'Min Aggregate (Science, Commerce)' },
  { name: 'Kabir Khan', roll: 'CBSE1005', pct: 84.1, cat: 'General', p1: true, p2: true, p3: true, status: 'Eligible', failed: '—' },
  { name: 'Vivaan Reddy', roll: 'CBSE1009', pct: 39.2, cat: 'SC', p1: false, p2: false, p3: false, status: 'Not Eligible', failed: 'Min Aggregate, Board Result' }
];

const RULES = [
  { name: 'Min Aggregate', stream: 'Science', checked: 300, passed: 198, failed: 102, pct: 34 },
  { name: 'Min Math Marks', stream: 'Science', checked: 300, passed: 210, failed: 90, pct: 30 },
  { name: 'Min Science Marks', stream: 'Science', checked: 300, passed: 205, failed: 95, pct: 32 },
  { name: 'Attendance Check', stream: 'All', checked: 300, passed: 270, failed: 30, pct: 10 },
  { name: 'Board Result PASS', stream: 'All', checked: 300, passed: 292, failed: 8, pct: 3 }
];

export function EligibilityCheckResults() {
  const [year, setYear] = useState('2025-26');
  const [runFor, setRunFor] = useState('All Applications');
  const [stream, setStream] = useState('Science');
  const [override, setOverride] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const run = () => {
    setRunning(true); setDone(false); setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setRunning(false); setDone(true); setNotice('Eligibility check completed for 300 students.'); return 100; }
        return p + 10;
      });
    }, 250);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <p className="text-xs text-gray-500">Home → Eligibility Check</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold">Eligibility Check Results</h1>
          <Badge variant="info">{year}</Badge>
        </div>
        <p className="text-sm text-gray-500">Run and review eligibility for all student applications</p>
      </div>
      {notice && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div><label className="text-xs text-gray-600">Academic Year *</label><select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>2025-26</option><option>2024-25</option></select></div>
        <div><label className="text-xs text-gray-600">Run For *</label><select value={runFor} onChange={(e) => setRunFor(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>All Applications</option><option>Specific Stream</option><option>Selected Students</option></select></div>
        {runFor === 'Specific Stream' && <div><label className="text-xs text-gray-600">Select Stream</label><select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Science</option><option>Commerce</option><option>Arts</option></select></div>}
        <Toggle checked={override} onChange={setOverride} label="Override previous results" />
        <Button onClick={run} disabled={running}><Play className="w-4 h-4 mr-1" /> Run Check</Button>
      </div>

      {running && (
        <div className="bg-white rounded-xl border p-5">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="flex justify-between text-sm mt-2 text-gray-600">
            <span>Processed: {Math.round(progress * 3)} / 300 students · {progress}% complete</span>
            <span>Estimated: {Math.max(0, (100 - progress) / 10 * 0.25).toFixed(0)}s remaining</span>
            <Button size="sm" variant="outline" onClick={() => { setRunning(false); setNotice('Check cancelled.'); }}><Ban className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {done && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              ['Total Students Checked', '300', 'bg-blue-600'],
              ['Eligible for 1st Preference', '198', 'bg-green-600'],
              ['Eligible for 2nd Preference Only', '45', 'bg-teal-600'],
              ['Eligible for 3rd Preference Only', '22', 'bg-yellow-500'],
              ['Not Eligible for Any Stream', '35', 'bg-red-600']
            ].map(([l, n, c]) => <div key={l} className={`${c} text-white rounded-xl p-4`}><p className="text-xs text-white/80">{l}</p><p className="text-2xl font-bold">{n}</p></div>)}
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Agg %', 'Category', '1st', '2nd', '3rd', 'Overall', 'Failed Rules', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {RESULTS.map((r) => (
                  <tr key={r.roll} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2">{r.roll}</td>
                    <td className="px-3 py-2">{r.pct}%</td>
                    <td className="px-3 py-2"><Badge variant="secondary">{r.cat}</Badge></td>
                    <td className="px-3 py-2">{r.p1 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2">{r.p2 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2">{r.p3 ? '✅' : '❌'}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Eligible' ? 'success' : 'danger'}>{r.status}</Badge></td>
                    <td className="px-3 py-2 text-xs text-gray-600">{r.failed}</td>
                    <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setNotice(`Opened detail for ${r.name}.`)}><Eye className="w-4 h-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">Rules with failure rate above 40% may need threshold adjustment. Review highlighted rules.</div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Rule Name', 'Applies to Stream', 'Checked', 'Passed', 'Failed', 'Failure %'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {RULES.map((r) => (
                  <tr key={r.name} className={r.pct >= 40 ? 'bg-red-50' : ''}>
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
            <Button variant="outline" onClick={() => setNotice('Full results exported.')}><Download className="w-4 h-4 mr-1" /> Export Full Results — Excel</Button>
            <Button variant="outline" onClick={() => setNotice('Not eligible list exported.')}><Download className="w-4 h-4 mr-1" /> Export Not Eligible List</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print Summary</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default EligibilityCheckResults;
