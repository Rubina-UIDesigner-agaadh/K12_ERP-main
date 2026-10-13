import React, { useMemo, useState } from 'react';
import { Download, Search, Eye, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { downloadCsv, loadStreamStore, parseSubmitted, type StreamAuditEntry } from './ApplicationsDashboard';

export function StreamAuditLog() {
  const store = loadStreamStore();
  const [q, setQ] = useState('');
  const [action, setAction] = useState('All');
  const [role, setRole] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [picked, setPicked] = useState<StreamAuditEntry | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const actions = Array.from(new Set(store.audit.map((l) => l.action)));
  const roles = Array.from(new Set(store.audit.map((l) => l.role)));

  const rows = useMemo(() => {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(`${to}T23:59:59`) : null;
    return store.audit.filter((l) => {
      const term = q.trim().toLowerCase();
      if (term && !`${l.actor} ${l.entity} ${l.detail} ${l.action}`.toLowerCase().includes(term)) return false;
      if (action !== 'All' && l.action !== action) return false;
      if (role !== 'All' && l.role !== role) return false;
      const when = parseSubmitted(l.at);
      if (fromDate && when && when < fromDate) return false;
      if (toDate && when && when > toDate) return false;
      return true;
    });
  }, [store.audit, q, action, role, from, to]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → Audit → Stream Selection Log</p>
          <h1 className="text-2xl font-bold mt-1">Stream Audit Log</h1>
          <p className="text-sm text-gray-500">Immutable trail of allotment, eligibility and counselling actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            downloadCsv([['When', 'Actor', 'Role', 'Action', 'Entity', 'Detail', 'IP'], ...rows.map((l) => [l.at, l.actor, l.role, l.action, l.entity, l.detail, l.ip])], 'stream-audit.csv');
            setNotice('Audit log exported.');
          }}><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Actor / entity / detail" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
          <option>All</option>
          {actions.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm">
          <option>All</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" />
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" />
        <Button size="sm" variant="ghost" onClick={() => { setQ(''); setAction('All'); setRole('All'); setFrom(''); setTo(''); setPage(1); }}>Reset</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Matching entries</p><p className="text-2xl font-bold">{rows.length}</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Allotment actions</p><p className="text-2xl font-bold">{rows.filter((r) => r.action.toLowerCase().includes('allot')).length}</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Eligibility actions</p><p className="text-2xl font-bold">{rows.filter((r) => r.action.toLowerCase().includes('eligib')).length}</p></div>
        <div className="bg-white border rounded-xl p-4"><p className="text-xs text-gray-500">Document actions</p><p className="text-2xl font-bold">{rows.filter((r) => r.action.toLowerCase().includes('document')).length}</p></div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['When', 'Actor', 'Role', 'Action', 'Entity', 'Detail', 'IP', ''].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {pageRows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No audit entries match.</td></tr>}
            {pageRows.map((l) => (
              <tr key={l.at + l.entity + l.action} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">{l.at}</td>
                <td className="px-3 py-2 font-medium">{l.actor}</td>
                <td className="px-3 py-2"><Badge variant="secondary">{l.role}</Badge></td>
                <td className="px-3 py-2">{l.action}</td>
                <td className="px-3 py-2">{l.entity}</td>
                <td className="px-3 py-2 text-gray-600">{l.detail}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{l.ip}</td>
                <td className="px-3 py-2"><Button size="sm" variant="ghost" onClick={() => setPicked(l)}><Eye className="w-4 h-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-3 text-sm border-t">
          <span>{rows.length} entries</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="px-2 py-1">Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={Boolean(picked)} onClose={() => setPicked(null)} title="Audit entry" footer={<Button onClick={() => setPicked(null)}>Close</Button>}>
        {picked && (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-gray-500">When</dt><dd>{picked.at}</dd></div>
            <div><dt className="text-xs text-gray-500">Actor</dt><dd>{picked.actor}</dd></div>
            <div><dt className="text-xs text-gray-500">Role</dt><dd>{picked.role}</dd></div>
            <div><dt className="text-xs text-gray-500">Action</dt><dd>{picked.action}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-gray-500">Entity</dt><dd>{picked.entity}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-gray-500">Detail</dt><dd>{picked.detail}</dd></div>
            <div><dt className="text-xs text-gray-500">IP</dt><dd>{picked.ip}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  );
}

export default StreamAuditLog;
