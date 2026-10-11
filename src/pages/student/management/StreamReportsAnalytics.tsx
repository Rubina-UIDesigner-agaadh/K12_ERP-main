import React, { useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const STREAMS = [
  { stream: 'Science', applied: 120, eligible: 86, allotted: 70, wait: 18, seats: 80, fill: 87.5 },
  { stream: 'Commerce', applied: 95, eligible: 80, allotted: 62, wait: 12, seats: 70, fill: 88.6 },
  { stream: 'Arts', applied: 70, eligible: 64, allotted: 48, wait: 8, seats: 55, fill: 87.3 },
  { stream: 'Vocational', applied: 32, eligible: 28, allotted: 20, wait: 4, seats: 25, fill: 80 }
];

const CAT = [
  { cat: 'General', sci: 40, com: 28, arts: 22, voc: 8 },
  { cat: 'OBC', sci: 15, com: 18, arts: 12, voc: 6 },
  { cat: 'SC', sci: 10, com: 10, arts: 8, voc: 4 },
  { cat: 'ST', sci: 3, com: 4, arts: 4, voc: 1 },
  { cat: 'EWS', sci: 2, com: 2, arts: 2, voc: 1 }
];

export function StreamReportsAnalytics() {
  const [year, setYear] = useState('2025-26');
  const [round, setRound] = useState('All Rounds');
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → Reports → Stream Analytics</p>
          <div className="flex items-center gap-2 mt-1"><BarChart3 className="w-6 h-6 text-indigo-600" /><h1 className="text-2xl font-bold">Stream Reports & Analytics</h1></div>
          <p className="text-sm text-gray-500">Demand, eligibility, allotment fill and category mix</p>
        </div>
        <div className="flex gap-2">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white"><option>2025-26</option><option>2024-25</option></select>
          <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white"><option>All Rounds</option><option>Round 1</option><option>Round 2</option></select>
          <Button variant="outline" onClick={() => setNotice('Analytics exported.')}><Download className="w-4 h-4 mr-1" /> Export</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Applications', '317'], ['Eligible', '258'], ['Allotted', '200'], ['Waitlisted', '42']].map(([k, v]) => (
          <div key={k} className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">{k}</p><p className="text-2xl font-bold">{v}</p></div>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Stream Funnel</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Stream', 'Applied', 'Eligible', 'Allotted', 'Waitlist', 'Seats', 'Fill %'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {STREAMS.map((s) => (
              <tr key={s.stream}>
                <td className="px-3 py-2 font-medium">{s.stream}</td>
                <td className="px-3 py-2">{s.applied}</td>
                <td className="px-3 py-2">{s.eligible}</td>
                <td className="px-3 py-2">{s.allotted}</td>
                <td className="px-3 py-2">{s.wait}</td>
                <td className="px-3 py-2">{s.seats}</td>
                <td className="px-3 py-2"><Badge variant={s.fill >= 85 ? 'success' : 'warning'}>{s.fill}%</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Category Mix (Allotted)</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Category', 'Science', 'Commerce', 'Arts', 'Vocational'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{CAT.map((c) => <tr key={c.cat}><td className="px-3 py-2">{c.cat}</td><td className="px-3 py-2">{c.sci}</td><td className="px-3 py-2">{c.com}</td><td className="px-3 py-2">{c.arts}</td><td className="px-3 py-2">{c.voc}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default StreamReportsAnalytics;
