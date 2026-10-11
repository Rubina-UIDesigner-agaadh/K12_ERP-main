import React, { useMemo, useState } from 'react';
import {
  Search, RotateCcw, Download, Printer, Eye, CheckCircle, XCircle, Mail,
  Play, SlidersHorizontal, FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { StudentApplicationDetail } from './StudentApplicationDetail';

export type AppStatus =
  | 'Draft' | 'Submitted' | 'Under Review' | 'Eligible' | 'Not Eligible'
  | 'Allotted' | 'Waitlisted' | 'Accepted' | 'Rejected';

export interface StreamApplication {
  id: string;
  name: string;
  photo: string;
  roll: string;
  classSec: string;
  pct: number;
  category: 'General' | 'SC' | 'ST' | 'OBC' | 'EWS';
  p1: string;
  p2: string;
  p3: string;
  status: AppStatus;
  eligibility: 'Eligible' | 'Not Eligible' | 'Pending';
  allotted: string;
  submitted: string;
  year: string;
  round: string;
}

export const STREAM_APPLICATIONS: StreamApplication[] = [
  { id: 'APP-2025-10042', name: 'Aarav Patel', photo: 'AP', roll: 'CBSE1001', classSec: '10 — A', pct: 91.2, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Accepted', eligibility: 'Eligible', allotted: 'Science', submitted: '05-06-2025 10:30', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10043', name: 'Diya Sharma', photo: 'DS', roll: 'CBSE1002', classSec: '10 — A', pct: 78.4, category: 'OBC', p1: 'Commerce', p2: 'Arts', p3: 'Vocational', status: 'Allotted', eligibility: 'Eligible', allotted: 'Commerce', submitted: '05-06-2025 11:12', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10044', name: 'Rohan Mehta', photo: 'RM', roll: 'CBSE1003', classSec: '10 — B', pct: 62.0, category: 'SC', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Waitlisted', eligibility: 'Eligible', allotted: '', submitted: '06-06-2025 09:05', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10045', name: 'Ananya Iyer', photo: 'AI', roll: 'CBSE1004', classSec: '10 — B', pct: 48.5, category: 'ST', p1: 'Arts', p2: 'Vocational', p3: 'Commerce', status: 'Not Eligible', eligibility: 'Not Eligible', allotted: '', submitted: '06-06-2025 14:22', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10046', name: 'Kabir Khan', photo: 'KK', roll: 'CBSE1005', classSec: '10 — C', pct: 84.1, category: 'General', p1: 'Science', p2: 'Commerce', p3: 'Arts', status: 'Under Review', eligibility: 'Pending', allotted: '', submitted: '07-06-2025 08:40', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10047', name: 'Meera Joshi', photo: 'MJ', roll: 'CBSE1006', classSec: '10 — C', pct: 71.8, category: 'EWS', p1: 'Commerce', p2: 'Science', p3: 'Arts', status: 'Eligible', eligibility: 'Eligible', allotted: '', submitted: '07-06-2025 16:18', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10048', name: 'Ishaan Gupta', photo: 'IG', roll: 'CBSE1007', classSec: '10 — A', pct: 55.3, category: 'OBC', p1: 'Vocational', p2: 'Arts', p3: 'Commerce', status: 'Submitted', eligibility: 'Pending', allotted: '', submitted: '08-06-2025 10:02', year: '2025-26', round: 'Round 2' },
  { id: 'APP-2025-10049', name: 'Sara Ali', photo: 'SA', roll: 'CBSE1008', classSec: '10 — B', pct: 88.0, category: 'General', p1: 'Science', p2: 'Arts', p3: 'Commerce', status: 'Draft', eligibility: 'Pending', allotted: '', submitted: '—', year: '2025-26', round: 'Round 1' },
  { id: 'APP-2025-10050', name: 'Vivaan Reddy', photo: 'VR', roll: 'CBSE1009', classSec: '10 — C', pct: 39.2, category: 'SC', p1: 'Arts', p2: 'Vocational', p3: 'Commerce', status: 'Rejected', eligibility: 'Eligible', allotted: 'Arts', submitted: '04-06-2025 12:11', year: '2025-26', round: 'Counselling' }
];

const STATUS_VARIANT: Record<AppStatus, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'primary'> = {
  Draft: 'default',
  Submitted: 'info',
  'Under Review': 'warning',
  Eligible: 'success',
  'Not Eligible': 'danger',
  Allotted: 'primary',
  Waitlisted: 'warning',
  Accepted: 'success',
  Rejected: 'danger'
};

const SUMMARY: { key: AppStatus | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'Total Received', color: 'bg-blue-600' },
  { key: 'Draft', label: 'Draft', color: 'bg-gray-500' },
  { key: 'Submitted', label: 'Submitted', color: 'bg-teal-600' },
  { key: 'Under Review', label: 'Under Review', color: 'bg-yellow-500' },
  { key: 'Eligible', label: 'Eligible', color: 'bg-green-600' },
  { key: 'Not Eligible', label: 'Not Eligible', color: 'bg-red-600' },
  { key: 'Allotted', label: 'Allotted', color: 'bg-purple-600' },
  { key: 'Waitlisted', label: 'Waitlisted', color: 'bg-orange-500' },
  { key: 'Accepted', label: 'Accepted', color: 'bg-emerald-800' },
  { key: 'Rejected', label: 'Rejected', color: 'bg-red-800' }
];

const pctColor = (pct: number) => pct >= 75 ? 'text-green-700 font-semibold' : pct >= 50 ? 'text-yellow-700 font-semibold' : 'text-red-600 font-semibold';

const csv = (rows: (string | number)[][], name: string) => {
  const blob = new Blob(['\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
};

export function ApplicationsDashboard() {
  const [year, setYear] = useState('2025-26');
  const [stream, setStream] = useState('all');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [round, setRound] = useState('all');
  const [minPct, setMinPct] = useState(0);
  const [maxPct, setMaxPct] = useState(100);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'pct' | 'submitted' | 'status'>('submitted');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StreamApplication | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = STREAM_APPLICATIONS.filter((r) => {
      if (r.year !== year) return false;
      if (stream !== 'all' && r.p1 !== stream && r.p2 !== stream && r.p3 !== stream) return false;
      if (status !== 'all' && r.status !== status) return false;
      if (category !== 'all' && r.category !== category) return false;
      if (round !== 'all' && r.round !== round) return false;
      if (r.pct < minPct || r.pct > maxPct) return false;
      if (term && !`${r.name} ${r.roll} ${r.id}`.toLowerCase().includes(term)) return false;
      return true;
    });
    rows.sort((a, b) => {
      const av = sortBy === 'name' ? a.name : sortBy === 'pct' ? a.pct : sortBy === 'status' ? a.status : a.submitted;
      const bv = sortBy === 'name' ? b.name : sortBy === 'pct' ? b.pct : sortBy === 'status' ? b.status : b.submitted;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [year, stream, status, category, round, minPct, maxPct, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const colOn = (key: string) => !hiddenCols.includes(key);
  const toggleCol = (key: string) => setHiddenCols((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]);

  const reset = () => {
    setStream('all'); setStatus('all'); setCategory('all'); setRound('all');
    setMinPct(0); setMaxPct(100); setFrom(''); setTo(''); setSearch(''); setSelected([]); setPage(1);
  };

  if (viewing) {
    return <StudentApplicationDetail application={viewing} onBack={() => setViewing(null)} />;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Applications</p>
          <h1 className="text-2xl font-bold text-gray-900">Student Applications</h1>
          <p className="text-sm text-gray-500">View and manage all stream selection applications</p>
        </div>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>2025-26</option>
          <option>2024-25</option>
          <option>2023-24</option>
        </select>
      </div>

      {notice && (
        <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>×</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SUMMARY.map((card) => {
          const count = card.key === 'all' ? STREAM_APPLICATIONS.filter((r) => r.year === year).length : STREAM_APPLICATIONS.filter((r) => r.year === year && r.status === card.key).length;
          return (
            <button key={card.label} type="button" onClick={() => { setStatus(card.key === 'all' ? 'all' : card.key); setPage(1); }} className={`${card.color} text-white rounded-xl p-3 text-left`}>
              <p className="text-xs text-white/80">{card.label}</p>
              <p className="text-2xl font-bold">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 gap-3 items-end border-b">
          <select value={stream} onChange={(e) => setStream(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {['all', 'Science', 'Commerce', 'Arts', 'Vocational'].map((o) => <option key={o} value={o}>{o === 'all' ? 'All Streams' : o}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Status</option>
            {SUMMARY.filter((s) => s.key !== 'all').map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {['all', 'General', 'SC', 'ST', 'OBC', 'EWS'].map((o) => <option key={o} value={o}>{o === 'all' ? 'All Categories' : o}</option>)}
          </select>
          <select value={round} onChange={(e) => setRound(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {['all', 'Round 1', 'Round 2', 'Counselling'].map((o) => <option key={o} value={o}>{o === 'all' ? 'All Rounds' : o}</option>)}
          </select>
          <div className="text-xs text-gray-600">
            Marks {minPct}% – {maxPct}%
            <input type="range" min={0} max={100} value={minPct} onChange={(e) => setMinPct(Number(e.target.value))} className="w-full" />
            <input type="range" min={0} max={100} value={maxPct} onChange={(e) => setMaxPct(Number(e.target.value))} className="w-full" />
          </div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name / roll / admission" className="w-full pl-8 pr-2 py-2 border rounded-lg text-sm" />
            </div>
            <button type="button" onClick={reset} className="text-xs text-indigo-600 whitespace-nowrap"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset</button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-4 py-3 bg-indigo-50 border-b flex flex-wrap gap-2 items-center">
            <span className="text-sm text-indigo-800 font-medium">{selected.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => setNotice(`Eligibility check queued for ${selected.length} student(s).`)}><Play className="w-3.5 h-3.5 mr-1" /> Run Eligibility Check</Button>
            <Button size="sm" variant="outline" onClick={() => setNotice('Marked eligible. Reason captured.')}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark as Eligible</Button>
            <Button size="sm" variant="outline" onClick={() => setNotice('Marked not eligible. Reason captured.')}><XCircle className="w-3.5 h-3.5 mr-1" /> Mark as Not Eligible</Button>
            <Button size="sm" variant="outline" onClick={() => setNotice('Notification composer opened for selected students.')}><Mail className="w-3.5 h-3.5 mr-1" /> Send Notification</Button>
            <Button size="sm" variant="outline" onClick={() => csv([['ID', 'Name', 'Roll', 'Status'], ...filtered.filter((r) => selected.includes(r.id)).map((r) => [r.id, r.name, r.roll, r.status])], 'selected-applications.csv')}><Download className="w-3.5 h-3.5 mr-1" /> Export Selected</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear Selection</Button>
          </div>
        )}

        <div className="px-4 py-2 flex flex-wrap items-center gap-3 text-sm border-b bg-gray-50">
          <label>Rows <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">{[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}</select></label>
          <label>Sort <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="border rounded px-2 py-1">
            <option value="name">Name</option><option value="pct">Aggregate %</option><option value="submitted">Submission Date</option><option value="status">Status</option>
          </select></label>
          <label>Order <select value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')} className="border rounded px-2 py-1"><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
          <span className="inline-flex items-center gap-1 text-gray-500"><SlidersHorizontal className="w-3.5 h-3.5" /> Columns</span>
          {['roll', 'p2', 'p3', 'allotted'].map((c) => (
            <label key={c} className="text-xs"><input type="checkbox" checked={colOn(c)} onChange={() => toggleCol(c)} className="mr-1" />{c}</label>
          ))}
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={() => csv([['ID', 'Student', 'Roll', '%', 'Status'], ...filtered.map((r) => [r.id, r.name, r.roll, r.pct, r.status])], 'applications.csv')}><FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel</Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="w-3.5 h-3.5 mr-1" /> Print / PDF</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" checked={pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))} onChange={(e) => setSelected(e.target.checked ? Array.from(new Set([...selected, ...pageRows.map((r) => r.id)])) : selected.filter((id) => !pageRows.some((r) => r.id === id)))} /></th>
                {['#', 'Student', 'Roll Number', 'Class & Section', 'Aggregate %', 'Category', '1st Preference', '2nd Preference', '3rd Preference', 'Status', 'Eligibility', 'Allotted Stream', 'Submitted On', 'Actions'].map((h) =>
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((s) => s.includes(row.id) ? s.filter((id) => id !== row.id) : [...s, row.id])} /></td>
                  <td className="px-3 py-2 text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">{row.photo}</span>
                      <span className="font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{colOn('roll') ? row.roll : '—'}</td>
                  <td className="px-3 py-2">{row.classSec}</td>
                  <td className={`px-3 py-2 ${pctColor(row.pct)}`}>{row.pct.toFixed(1)}%</td>
                  <td className="px-3 py-2"><Badge variant="secondary">{row.category}</Badge></td>
                  <td className="px-3 py-2"><Badge variant="info">{row.p1}</Badge></td>
                  <td className="px-3 py-2">{colOn('p2') ? <Badge variant="outline">{row.p2}</Badge> : '—'}</td>
                  <td className="px-3 py-2">{colOn('p3') ? <Badge variant="outline">{row.p3}</Badge> : '—'}</td>
                  <td className="px-3 py-2"><Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge></td>
                  <td className="px-3 py-2">{row.eligibility === 'Eligible' ? '✅ Eligible' : row.eligibility === 'Not Eligible' ? '❌ Not Eligible' : '⏳ Pending'}</td>
                  <td className="px-3 py-2">{colOn('allotted') ? (row.allotted || '—') : '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.submitted}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" title="View" onClick={() => setViewing(row)} className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                      <button type="button" title="Check" onClick={() => setNotice(`Eligibility re-checked for ${row.name}.`)} className="p-1.5 hover:bg-gray-100 rounded"><Play className="w-4 h-4" /></button>
                      <button type="button" title="Override" onClick={() => setNotice(`Override opened for ${row.name}.`)} className="p-1.5 hover:bg-gray-100 rounded"><CheckCircle className="w-4 h-4" /></button>
                      <button type="button" title="Allot" onClick={() => setNotice(`Manual allotment opened for ${row.name}.`)} className="p-1.5 hover:bg-gray-100 rounded text-indigo-600">🎯</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 text-sm border-t">
          <span>{filtered.length} applications</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="px-2 py-1">Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsDashboard;
