import React, { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const LOGS = [
  { at: '23-06-2025 10:12', actor: 'Admin Rao', role: 'Admin', action: 'Allotment Run', entity: 'Round 1', detail: 'Engine executed — 200 allotted', ip: '10.0.1.12' },
  { at: '22-06-2025 16:40', actor: 'Counsellor Mehta', role: 'Counsellor', action: 'Manual Allotment', entity: 'Kabir Khan', detail: 'Commerce — special case medical', ip: '10.0.1.44' },
  { at: '22-06-2025 11:05', actor: 'Verifier Shah', role: 'Verifier', action: 'Document Rejected', entity: 'Rohan Mehta', detail: 'Income certificate unclear scan', ip: '10.0.2.8' },
  { at: '21-06-2025 09:30', actor: 'System', role: 'System', action: 'Waitlist Promote', entity: 'Kabir Khan', detail: 'Seat freed in Science', ip: '—' },
  { at: '20-06-2025 14:18', actor: 'Admin Rao', role: 'Admin', action: 'Eligibility Run', entity: 'Batch 2025-26', detail: '258 eligible / 59 not eligible', ip: '10.0.1.12' },
  { at: '19-06-2025 18:02', actor: 'Priya Sharma', role: 'Student', action: 'Preference Submit', entity: 'Application APP-1001', detail: 'Science > Commerce > Arts', ip: '103.21.x.x' }
];

export function StreamAuditLog() {
  const [q, setQ] = useState('');
  const [action, setAction] = useState('All');
  const [role, setRole] = useState('All');
  const [notice, setNotice] = useState<string | null>(null);

  const rows = LOGS.filter((l) => {
    const term = q.trim().toLowerCase();
    if (term && !`${l.actor} ${l.entity} ${l.detail}`.toLowerCase().includes(term)) return false;
    if (action !== 'All' && l.action !== action) return false;
    if (role !== 'All' && l.role !== role) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → Audit → Stream Selection Log</p>
          <h1 className="text-2xl font-bold mt-1">Stream Audit Log</h1>
          <p className="text-sm text-gray-500">Immutable trail of allotment, eligibility and counselling actions</p>
        </div>
        <Button variant="outline" onClick={() => setNotice('Audit log exported.')}><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Actor / entity / detail" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <select value={action} onChange={(e) => setAction(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Allotment Run</option><option>Manual Allotment</option><option>Document Rejected</option><option>Waitlist Promote</option><option>Eligibility Run</option><option>Preference Submit</option></select>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Admin</option><option>Counsellor</option><option>Verifier</option><option>System</option><option>Student</option></select>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr>{['When', 'Actor', 'Role', 'Action', 'Entity', 'Detail', 'IP'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs uppercase text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {rows.map((l) => (
              <tr key={l.at + l.entity}>
                <td className="px-3 py-2 whitespace-nowrap">{l.at}</td>
                <td className="px-3 py-2 font-medium">{l.actor}</td>
                <td className="px-3 py-2"><Badge variant="secondary">{l.role}</Badge></td>
                <td className="px-3 py-2">{l.action}</td>
                <td className="px-3 py-2">{l.entity}</td>
                <td className="px-3 py-2 text-gray-600">{l.detail}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StreamAuditLog;
