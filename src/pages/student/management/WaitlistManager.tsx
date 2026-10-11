import React, { useState } from 'react';
import { Download, Mail, Trash2, ArrowUp } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';

const WAIT = [
  { pos: 1, name: 'Rohan Mehta', roll: 'CBSE1003', cat: 'SC', pct: 62, stream: 'Science', comb: 'PCM', why: '1st Pref Full — All Category Seats Gone', date: '19-06-2025', round: 'Round 1', notified: 'Yes' },
  { pos: 2, name: 'Ishaan Gupta', roll: 'CBSE1007', cat: 'OBC', pct: 55.3, stream: 'Science', comb: 'PCB', why: '1st Pref Full', date: '19-06-2025', round: 'Round 1', notified: 'No' },
  { pos: 3, name: 'Meera Joshi', roll: 'CBSE1006', cat: 'EWS', pct: 71.8, stream: 'Commerce', comb: 'Commerce with Math', why: 'EWS seats exhausted', date: '19-06-2025', round: 'Round 1', notified: 'Yes' }
];

const MOVES = [
  { at: '21 Jun 2025', student: 'Kabir Khan', action: 'Promoted — Seat Freed', stream: 'Science', by: 'System (Auto)' },
  { at: '22 Jun 2025', student: 'Sara Ali', action: 'Removed — Student Withdrew', stream: 'Commerce', by: 'Admin' },
  { at: '23 Jun 2025', student: 'Diya Sharma', action: 'Seat Accepted', stream: 'Science', by: 'Student' }
];

export function WaitlistManager() {
  const [stream, setStream] = useState('All');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Position');
  const [dir, setDir] = useState('Ascending');
  const [auto, setAuto] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const rows = WAIT.filter((r) => (stream === 'All' || r.stream === stream) && (cat === 'All' || r.cat === cat));

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
          ['Total on Waitlist', '42'], ['Science', '18'], ['Commerce', '12'], ['Arts', '8'],
          ['Vocational', '4'], ['Promoted This Round', '6'], ['Seats Available Now', '3']
        ].map(([k, v]) => <div key={k} className="bg-white border rounded-xl p-3"><p className="text-xs text-gray-500">{k}</p><p className="text-xl font-bold">{v}</p></div>)}
      </div>

      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <select value={stream} onChange={(e) => setStream(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Science</option><option>Commerce</option><option>Arts</option><option>Vocational</option></select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>General</option><option>SC</option><option>ST</option><option>OBC</option><option>EWS</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>Position</option><option>Aggregate %</option><option>Date Added</option></select>
        <select value={dir} onChange={(e) => setDir(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>Ascending</option><option>Descending</option></select>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-3 py-2"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.roll) : [])} /></th>
            {['Pos', 'Student', 'Roll', 'Category', 'Agg %', 'Stream', 'Combination', 'Why Waitlisted', 'Date', 'Round', 'Notified', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y">
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
                <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setNotice(`${r.name} promoted.`)}><ArrowUp className="w-4 h-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Toggle checked={auto} onChange={setAuto} label="Enable Auto-Promotion" />
        <div><label className="text-xs text-gray-600">Notify student within</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>2 Hours</option><option>24 Hours</option></select></div>
        <div><label className="text-xs text-gray-600">Response window</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>48 Hours</option><option>24 Hours</option></select></div>
        <div><label className="text-xs text-gray-600">If no response</label><select className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>Move to next</option><option>Skip</option><option>Notify Admin</option></select></div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setNotice(`Promoted ${selected.length || 1} student(s).`)}><ArrowUp className="w-4 h-4 mr-1" /> Promote Selected</Button>
        <Button variant="outline" onClick={() => setNotice('Notification sent.')}><Mail className="w-4 h-4 mr-1" /> Notify Selected</Button>
        <Button variant="outline" onClick={() => setNotice('Removed from waitlist with reason.')}><Trash2 className="w-4 h-4 mr-1" /> Remove from Waitlist</Button>
        <Button variant="outline" onClick={() => setNotice('Waitlist exported.')}><Download className="w-4 h-4 mr-1" /> Export Waitlist</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <h2 className="font-semibold p-4">Waitlist Movement History</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['Date & Time', 'Student', 'Action', 'Stream', 'Done By'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{MOVES.map((m) => <tr key={m.at + m.student}><td className="px-3 py-2">{m.at}</td><td className="px-3 py-2">{m.student}</td><td className="px-3 py-2">{m.action}</td><td className="px-3 py-2">{m.stream}</td><td className="px-3 py-2">{m.by}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default WaitlistManager;
