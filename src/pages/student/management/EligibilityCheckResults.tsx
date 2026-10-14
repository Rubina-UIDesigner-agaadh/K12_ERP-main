import React, { useMemo, useState } from 'react';
import { Search, Download, RotateCcw, Printer, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  loadStreamStore, saveStreamStore, pushAudit, downloadCsv, type StreamApplication, type StreamStore
} from './ApplicationsDashboard';

const BRANCHES = ['Main Campus', 'North Campus', 'South Campus', 'West Campus'];

function classOf(classSec: string) {
  return classSec.split('—')[0]?.trim() || classSec;
}
function divisionOf(classSec: string) {
  return classSec.split('—')[1]?.trim() || '';
}
function branchOf(app: StreamApplication) {
  const n = parseInt(app.roll.replace(/\D/g, ''), 10);
  return BRANCHES[(Number.isFinite(n) ? n : 0) % BRANCHES.length];
}

export function EligibilityCheckResults() {
  const [store, setStore] = useState<StreamStore>(() => loadStreamStore());
  const [year, setYear] = useState('2025-26');
  const [branch, setBranch] = useState('all');
  const [klass, setKlass] = useState('all');
  const [division, setDivision] = useState('all');
  const [stream, setStream] = useState('all');
  const [elig, setElig] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [reasonModal, setReasonModal] = useState<{ ids: string[]; to: 'Eligible' | 'Not Eligible' } | null>(null);
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const persist = (next: StreamStore) => { saveStreamStore(next); setStore(next); };

  const classes = useMemo(
    () => Array.from(new Set(store.applications.filter((a) => a.year === year).map((a) => classOf(a.classSec)))).sort(),
    [store.applications, year]
  );
  const divisions = useMemo(
    () => Array.from(new Set(store.applications.filter((a) => a.year === year).map((a) => divisionOf(a.classSec)).filter(Boolean))).sort(),
    [store.applications, year]
  );

  const rows = useMemo(() => store.applications.filter((r) => {
    if (r.year !== year) return false;
    if (branch !== 'all' && branchOf(r) !== branch) return false;
    if (klass !== 'all' && classOf(r.classSec) !== klass) return false;
    if (division !== 'all' && divisionOf(r.classSec) !== division) return false;
    if (stream !== 'all' && r.p1 !== stream && r.p2 !== stream && r.p3 !== stream) return false;
    if (elig !== 'all' && r.eligibility !== elig) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${r.name} ${r.roll} ${r.id} ${r.classSec}`.toLowerCase().includes(q)) return false;
    return true;
  }), [store.applications, year, branch, klass, division, stream, elig, search]);

  const reset = () => {
    setBranch('all'); setKlass('all'); setDivision('all'); setStream('all'); setElig('all'); setSearch(''); setSelected([]);
  };

  const applyOverride = () => {
    if (!reasonModal) return;
    if (reason.trim().length < 8) { setNotice('Enter a reason of at least 8 characters.'); return; }
    const next = { ...store, applications: store.applications.map((a) => reasonModal.ids.includes(a.id) ? { ...a, eligibility: reasonModal.to, status: reasonModal.to === 'Eligible' ? 'Eligible' as const : 'Not Eligible' as const } : a) };
    pushAudit(next, 'Eligibility Override', reasonModal.ids.join(', '), `${reasonModal.to}: ${reason}`);
    persist(next);
    setNotice(`Updated ${reasonModal.ids.length} student(s) to ${reasonModal.to}.`);
    setReasonModal(null); setReason(''); setSelected([]);
  };

  const field = (label: string, children: React.ReactNode) => (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Home → Stream Selection → Eligibility Check Results</p>
          <h1 className="text-2xl font-bold text-gray-900">Eligibility Check Results</h1>
          <p className="text-sm text-gray-500">Search students and review eligibility after automatic checks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
          <Button variant="outline" onClick={() => downloadCsv([['Student', 'Roll', 'Class', 'Division', 'Branch', 'P1', 'Eligibility', '%'], ...rows.map((r) => [r.name, r.roll, classOf(r.classSec), divisionOf(r.classSec), branchOf(r), r.p1, r.eligibility, r.pct])], 'eligibility-results.csv')}><Download className="w-4 h-4 mr-1" /> Export</Button>
        </div>
      </div>

      {notice && <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {field('Academic Year', (
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option>2025-26</option><option>2024-25</option><option>2023-24</option>
            </select>
          ))}
          {field('Branch', (
            <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Branches</option>
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
          ))}
          {field('Class', (
            <select value={klass} onChange={(e) => setKlass(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Classes</option>
              {classes.map((c) => <option key={c}>{c}</option>)}
            </select>
          ))}
          {field('Division', (
            <select value={division} onChange={(e) => setDivision(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Divisions</option>
              {divisions.map((d) => <option key={d}>{d}</option>)}
            </select>
          ))}
          {field('Stream Preference', (
            <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              {['all', 'Science', 'Commerce', 'Arts', 'Vocational'].map((s) => <option key={s} value={s}>{s === 'all' ? 'All Streams' : s}</option>)}
            </select>
          ))}
          {field('Eligibility', (
            <select value={elig} onChange={(e) => setElig(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All</option>
              <option>Eligible</option>
              <option>Not Eligible</option>
              <option>Pending</option>
            </select>
          ))}
          {field('Search Student', (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, roll or admission no." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setNotice(`${rows.length} student(s) match the current filters.`)}><Search className="w-4 h-4 mr-1" /> Search</Button>
          <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          {selected.length > 0 && (
            <>
              <Button variant="outline" onClick={() => setReasonModal({ ids: selected, to: 'Eligible' })}><CheckCircle className="w-4 h-4 mr-1" /> Mark Eligible</Button>
              <Button variant="outline" onClick={() => setReasonModal({ ids: selected, to: 'Not Eligible' })}><XCircle className="w-4 h-4 mr-1" /> Mark Not Eligible</Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" checked={rows.length > 0 && rows.every((r) => selected.includes(r.id))} onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.id) : [])} /></th>
                {['Student', 'Roll', 'Class', 'Division', 'Branch', '1st Pref', 'Eligibility', 'Aggregate %', 'Failing Subjects', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 && <tr><td colSpan={11} className="px-3 py-10 text-center text-gray-400">No students match the current search.</td></tr>}
              {rows.map((r) => {
                const failing = r.pct < 60 ? ['Mathematics'] : r.eligibility === 'Not Eligible' ? ['Science'] : [];
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => setSelected((s) => s.includes(r.id) ? s.filter((id) => id !== r.id) : [...s, r.id])} /></td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2">{r.roll}</td>
                    <td className="px-3 py-2">{classOf(r.classSec)}</td>
                    <td className="px-3 py-2">{divisionOf(r.classSec) || '—'}</td>
                    <td className="px-3 py-2">{branchOf(r)}</td>
                    <td className="px-3 py-2">{r.p1}</td>
                    <td className="px-3 py-2"><Badge variant={r.eligibility === 'Eligible' ? 'success' : r.eligibility === 'Not Eligible' ? 'danger' : 'warning'}>{r.eligibility}</Badge></td>
                    <td className="px-3 py-2">{r.pct.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-xs text-red-600">{failing.join(', ') || '—'}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button type="button" className="p-1.5 hover:bg-gray-100 rounded" title="Override Eligible" onClick={() => setReasonModal({ ids: [r.id], to: 'Eligible' })}><CheckCircle className="w-4 h-4 text-green-600" /></button>
                        <button type="button" className="p-1.5 hover:bg-gray-100 rounded" title="Override Not Eligible" onClick={() => setReasonModal({ ids: [r.id], to: 'Not Eligible' })}><XCircle className="w-4 h-4 text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!reasonModal} onClose={() => setReasonModal(null)} title="Override Eligibility">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Reason is required for audit.</p>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Explain the override…" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReasonModal(null)}>Cancel</Button>
            <Button onClick={applyOverride}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EligibilityCheckResults;
