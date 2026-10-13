import React, { useMemo, useState } from 'react';
import { Download, BarChart3, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { downloadCsv, loadStreamStore } from './ApplicationsDashboard';

export function StreamReportsAnalytics() {
  const [year, setYear] = useState('2025-26');
  const [round, setRound] = useState('All Rounds');
  const [notice, setNotice] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const store = loadStreamStore();

  const apps = useMemo(() => {
    return store.applications.filter((a) => {
      if (a.year !== year) return false;
      if (round !== 'All Rounds' && a.round !== round) return false;
      return true;
    });
  }, [store, year, round]);

  const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];
  const funnel = STREAMS.map((stream) => {
    const applied = apps.filter((a) => a.p1 === stream || a.p2 === stream || a.p3 === stream).length;
    const eligible = apps.filter((a) => a.eligibility === 'Eligible' && (a.p1 === stream || a.p2 === stream || a.p3 === stream)).length;
    const allotted = apps.filter((a) => a.allotted === stream || ((a.status === 'Allotted' || a.status === 'Accepted') && a.allotted === stream)).length;
    const wait = store.waitlist.filter((w) => w.stream === stream).length;
    const seats = stream === 'Science' ? 80 : stream === 'Commerce' ? 70 : stream === 'Arts' ? 55 : 25;
    const fill = seats ? Math.round((allotted / seats) * 1000) / 10 : 0;
    return { stream, applied, eligible, allotted, wait, seats, fill };
  });

  const cats = ['General', 'OBC', 'SC', 'ST', 'EWS'].map((cat) => ({
    cat,
    sci: apps.filter((a) => a.category === cat && a.allotted === 'Science').length,
    com: apps.filter((a) => a.category === cat && a.allotted === 'Commerce').length,
    arts: apps.filter((a) => a.category === cat && a.allotted === 'Arts').length,
    voc: apps.filter((a) => a.category === cat && a.allotted === 'Vocational').length
  }));

  const focused = focus ? apps.filter((a) => a.p1 === focus || a.allotted === focus) : [];

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
          <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white"><option>All Rounds</option><option>Round 1</option><option>Round 2</option><option>Counselling</option></select>
          <Button variant="outline" onClick={() => {
            downloadCsv([['Stream', 'Applied', 'Eligible', 'Allotted', 'Waitlist', 'Seats', 'Fill %'], ...funnel.map((s) => [s.stream, s.applied, s.eligible, s.allotted, s.wait, s.seats, s.fill])], `stream-analytics-${year}.csv`);
            setNotice('Analytics exported.');
          }}><Download className="w-4 h-4 mr-1" /> Export</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Applications', apps.length],
          ['Eligible', apps.filter((a) => a.eligibility === 'Eligible').length],
          ['Allotted', apps.filter((a) => a.status === 'Allotted' || a.status === 'Accepted').length],
          ['Waitlisted', apps.filter((a) => a.status === 'Waitlisted').length]
        ].map(([k, v]) => (
          <div key={String(k)} className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">{k}</p><p className="text-2xl font-bold">{v}</p></div>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Stream Funnel — click a stream to drill down</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Stream', 'Applied', 'Eligible', 'Allotted', 'Waitlist', 'Seats', 'Fill %'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {funnel.map((s) => (
              <tr key={s.stream} className={`cursor-pointer hover:bg-indigo-50 ${focus === s.stream ? 'bg-indigo-50' : ''}`} onClick={() => setFocus(focus === s.stream ? null : s.stream)}>
                <td className="px-3 py-2 font-medium text-indigo-700">{s.stream}</td>
                <td className="px-3 py-2">{s.applied}</td>
                <td className="px-3 py-2">{s.eligible}</td>
                <td className="px-3 py-2">{s.allotted}</td>
                <td className="px-3 py-2">{s.wait}</td>
                <td className="px-3 py-2">{s.seats}</td>
                <td className="px-3 py-2"><Badge variant={s.fill >= 85 ? 'success' : s.fill >= 50 ? 'warning' : 'danger'}>{s.fill}%</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {focus && (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-semibold">{focus} applicants ({focused.length})</h2>
            <Button size="sm" variant="ghost" onClick={() => setFocus(null)}>Close</Button>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>{['Student', 'Roll', 'Agg %', 'Pref 1', 'Status', 'Allotted'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {focused.map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-2">{a.name}</td>
                  <td className="px-3 py-2">{a.roll}</td>
                  <td className="px-3 py-2">{a.pct}%</td>
                  <td className="px-3 py-2">{a.p1}</td>
                  <td className="px-3 py-2"><Badge variant="secondary">{a.status}</Badge></td>
                  <td className="px-3 py-2">{a.allotted || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border overflow-x-auto">
          <h2 className="font-semibold p-4">Preference Analysis (1st / 2nd / 3rd)</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>{['Stream', '1st Pref', '2nd Pref', '3rd Pref', 'Got 1st'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {STREAMS.map((s) => (
                <tr key={s}>
                  <td className="px-3 py-2 font-medium">{s}</td>
                  <td className="px-3 py-2">{apps.filter((a) => a.p1 === s).length}</td>
                  <td className="px-3 py-2">{apps.filter((a) => a.p2 === s).length}</td>
                  <td className="px-3 py-2">{apps.filter((a) => a.p3 === s).length}</td>
                  <td className="px-3 py-2">{apps.filter((a) => a.p1 === s && a.allotted === s).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl border overflow-x-auto">
          <h2 className="font-semibold p-4">Waitlist Movement</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>{['Stream', 'On waitlist', 'Notified', 'Moved up'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {STREAMS.map((s) => {
                const wl = store.waitlist.filter((w) => w.stream === s);
                return (
                  <tr key={s}>
                    <td className="px-3 py-2 font-medium">{s}</td>
                    <td className="px-3 py-2">{wl.length}</td>
                    <td className="px-3 py-2">{wl.filter((w) => w.notified === 'Yes').length}</td>
                    <td className="px-3 py-2">{store.movements.filter((m) => m.stream === s).length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Category Mix (Allotted)</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Category', 'Science', 'Commerce', 'Arts', 'Vocational'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{cats.map((c) => <tr key={c.cat}><td className="px-3 py-2">{c.cat}</td><td className="px-3 py-2">{c.sci}</td><td className="px-3 py-2">{c.com}</td><td className="px-3 py-2">{c.arts}</td><td className="px-3 py-2">{c.voc}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default StreamReportsAnalytics;
