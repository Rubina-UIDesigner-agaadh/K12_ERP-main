import React, { useMemo, useState } from 'react';
import { Search, RotateCcw, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  loadStreamStore,
  pushAudit,
  saveStreamStore,
  streamMeets,
  type StreamApplication
} from './ApplicationsDashboard';
import { StudentApplicationDetail } from './StudentApplicationDetail';

const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];

export function ManualCounsellingAllotment() {
  const [store, setStore] = useState(() => loadStreamStore());
  const [year, setYear] = useState('2025-26');
  const [streamFilter, setStreamFilter] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<StreamApplication | null>(null);
  const [newStream, setNewStream] = useState('');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StreamApplication | null>(null);

  const persist = () => setStore(loadStreamStore());

  const list = useMemo(() => store.applications.filter((s) => {
    if (s.year !== year) return false;
    if (s.status === 'Draft') return false;
    if (streamFilter !== 'all' && s.allotted !== streamFilter && s.p1 !== streamFilter) return false;
    if (status !== 'all' && s.status !== status) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${s.name} ${s.roll} ${s.id} ${s.allotted}`.toLowerCase().includes(q)) return false;
    return true;
  }), [store, year, streamFilter, status, search]);

  const saveOverride = () => {
    if (!picked || !newStream) {
      setNotice('Select a student and the stream to override.');
      return;
    }
    if (reason.trim().length < 8) {
      setNotice('Enter an override reason of at least 8 characters.');
      return;
    }
    const next = loadStreamStore();
    next.applications = next.applications.map((a) => a.id === picked.id
      ? { ...a, status: 'Allotted', allotted: newStream, eligibility: streamMeets(a.pct, newStream) ? 'Eligible' : a.eligibility }
      : a);
    next.waitlist = next.waitlist.filter((w) => w.roll !== picked.roll);
    pushAudit(next, 'Manual Stream Override', picked.name, `${picked.allotted || 'Unallotted'} → ${newStream}. ${reason}`);
    saveStreamStore(next);
    persist();
    setPicked((p) => p ? { ...p, status: 'Allotted', allotted: newStream } : p);
    setNotice(`Stream for ${picked.name} overridden to ${newStream}.`);
    setReason('');
  };

  const field = (label: string, children: React.ReactNode) => (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );

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
        <p className="text-xs text-gray-500">Home → Stream Selection → Manual Allotment</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Manual Allotment</h1>
        <p className="text-sm text-gray-500">Override stream selection for students allotted from the Allotment Control Panel</p>
      </div>

      {notice && <div className="flex justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="bg-white rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {field('Academic Year', (
            <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option>2025-26</option><option>2024-25</option>
            </select>
          ))}
          {field('Current Stream', (
            <select value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Streams</option>
              {STREAMS.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field('Status', (
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="all">All Statuses</option>
              {['Eligible', 'Allotted', 'Waitlisted', 'Accepted', 'Not Eligible', 'Under Review', 'Submitted'].map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field('Search Student', (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, roll or allotted stream" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setNotice(`${list.length} student(s) listed for override.`)}><Search className="w-4 h-4 mr-1" /> Search</Button>
          <Button variant="outline" onClick={() => { setYear('2025-26'); setStreamFilter('all'); setStatus('all'); setSearch(''); setPicked(null); }}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Student', 'Roll', 'Class', 'Aggregate %', 'Preference 1', 'Allotted Stream', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.length === 0 && <tr><td colSpan={8} className="px-3 py-10 text-center text-gray-400">No students found. Run allotment from the Allotment Control Panel, then override here.</td></tr>}
                {list.map((s) => (
                  <tr key={s.id} className={`hover:bg-gray-50 ${picked?.id === s.id ? 'bg-indigo-50' : ''}`}>
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2">{s.roll}</td>
                    <td className="px-3 py-2">{s.classSec}</td>
                    <td className="px-3 py-2">{s.pct.toFixed(1)}%</td>
                    <td className="px-3 py-2">{s.p1}</td>
                    <td className="px-3 py-2">{s.allotted || '—'}</td>
                    <td className="px-3 py-2"><Badge variant={s.status === 'Allotted' || s.status === 'Accepted' ? 'success' : s.status === 'Waitlisted' ? 'warning' : 'secondary'}>{s.status}</Badge></td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setPicked(s); setNewStream(s.allotted || s.p1); }}>Override</Button>
                        <Button size="sm" variant="ghost" onClick={() => setViewing(s)}>View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Override Stream</h2>
          {picked ? (
            <>
              <p className="text-sm text-gray-600">{picked.name} · {picked.roll}</p>
              <p className="text-xs text-gray-500">Current allotment: <b>{picked.allotted || 'Not allotted'}</b> · 1st preference: {picked.p1}</p>
              {field('New Stream', (
                <select value={newStream} onChange={(e) => setNewStream(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select stream</option>
                  {STREAMS.map((s) => <option key={s}>{s}</option>)}
                </select>
              ))}
              {newStream && !streamMeets(picked.pct, newStream) && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">Aggregate {picked.pct}% is below the usual cutoff for {newStream}. Override will still apply.</p>
              )}
              {field('Override Reason *', (
                <Textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this stream being changed?" />
              ))}
              <Button onClick={saveOverride}><Save className="w-4 h-4 mr-1" /> Save Override</Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Select a student from the list to override the stream allotted by the control panel.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManualCounsellingAllotment;
