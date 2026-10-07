// ArchiveAuditTrail.tsx — Archive Management ▸ Archive Audit Trail (Page 8)
// Immutable event log of every archive operation with filter bar, detail popup and
// a stat strip. Nothing on this page can be edited or deleted — by design.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  DownloadCloud,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  Printer,
  FileDown,
  ShieldAlert,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH } from './archiveUi';

interface AuditEvent {
  id: string;
  when: string;
  action: string;
  actionType: 'ARCHIVE' | 'COLD' | 'CLEANUP' | 'RETRIEVE' | 'SETTINGS' | 'BACKUP' | 'DELETE';
  module: string;
  records: string;
  user: string;
  role: string;
  status: 'Success' | 'FAILED';
  duration: string;
  details: string;
  before?: string;
  after?: string;
  checksum?: string;
  sha?: string;
}

const EVENTS: AuditEvent[] = [
  {
    id: 'ARC-EVT-2025-004521',
    when: '27-Sep-2025 02:00:05 AM',
    action: 'Nightly Archive — Finance/GL Journal Entries > 2 years',
    actionType: 'ARCHIVE',
    module: '💰 Finance / GL',
    records: '12,450 recs',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '23 min 45 sec',
    details: 'Primary DB → Archive DB. Rows locked, copied, verified by full checksum and then deleted from primary.',
    before: '12.5 GB',
    after: '12.3 GB',
    checksum: '✅ 12,450 / 12,450 rows match',
    sha: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
  },
  {
    id: 'ARC-EVT-2025-004520',
    when: '27-Sep-2025 02:05:12 AM',
    action: 'Nightly Archive — Fee Receipts > 2 years — FAILED',
    actionType: 'ARCHIVE',
    module: '💸 Fee Module',
    records: '0 recs',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'FAILED',
    duration: '1 min 12 sec',
    details: 'Verification mismatch on 3 receipts — job aborted, no rows deleted from primary. Alert emailed to Super Admin.',
    checksum: '❌ 8,447 / 8,450 rows match (3 mismatch)',
    sha: '—'
  },
  {
    id: 'ARC-EVT-2025-004519',
    when: '27-Sep-2025 04:00:00 AM',
    action: 'Cleanup — System Logs > 30 days purged',
    actionType: 'CLEANUP',
    module: '🔔 System Logs',
    records: '125,000 rows',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '6 min 30 sec',
    details: 'Log rows older than 30 days deleted permanently. No archive copy is taken for system logs.',
    before: '1.2 GB',
    after: '820 MB'
  },
  {
    id: 'ARC-EVT-2025-004518',
    when: '27-Sep-2025 04:30:00 AM',
    action: 'Cleanup — Temp upload files > 7 days purged',
    actionType: 'CLEANUP',
    module: '📁 Temp Files',
    records: '450 files',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '1 min 05 sec',
    details: 'Orphaned upload temp files removed from the storage bucket.',
    before: '85 MB',
    after: '0 MB'
  },
  {
    id: 'ARC-EVT-2025-004517',
    when: '27-Sep-2025 10:17 AM',
    action: 'Retrieval — RETR-2025-001 (GL FY 19-20 + Fee FY 19-20)',
    actionType: 'RETRIEVE',
    module: '❄️  Cold Storage',
    records: '2 files · 196 MB',
    user: 'Priya Gupta',
    role: 'Finance Manager',
    status: 'Success',
    duration: 'In progress',
    details: 'Initiated with Principal approval. Temp access window 72 hours; auto-delete scheduled at expiry.',
    checksum: '⏳ Verify on load'
  },
  {
    id: 'ARC-EVT-2025-004516',
    when: '01-Sep-2025 03:45:00 AM',
    action: 'Cold Push — FY 2016-17 GL + Fee to AWS Glacier',
    actionType: 'COLD',
    module: '🎓 Academic',
    records: '25,000 recs · 2.1 GB',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '1 hr 12 min',
    details: 'Archive DB → AWS S3 Glacier Deep Archive. Compressed (GZIP 6) and encrypted (AES-256) before upload.',
    before: '2.1 GB in Archive',
    after: '160 MB in Glacier',
    checksum: '✅ SHA256 source and uploaded object match'
  },
  {
    id: 'ARC-EVT-2025-004515',
    when: '21-Sep-2025 01:30 AM',
    action: 'Cleanup — Notification logs > 90 days purged',
    actionType: 'CLEANUP',
    module: '📱 Notifications',
    records: '45,000 rows',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '3 min 20 sec',
    details: 'Notification delivery logs beyond the 90 day policy removed.',
    before: '520 MB',
    after: '110 MB'
  },
  {
    id: 'ARC-EVT-2025-004514',
    when: '15-Sep-2025 11:22 AM',
    action: 'Settings Change — Primary retention 3 years → 2 years (Fee Module)',
    actionType: 'SETTINGS',
    module: '⚙️ Archive Settings',
    records: '1 policy',
    user: 'Anil Mehta',
    role: 'Super Admin',
    status: 'Success',
    duration: '—',
    details: 'Retention policy updated with Principal approval. Legal minimum (8 years total retention) still satisfied.',
    before: 'Primary keep: 3 years',
    after: 'Primary keep: 2 years'
  },
  {
    id: 'ARC-EVT-2025-004513',
    when: '27-Sep-2025 05:00:00 AM',
    action: 'Full database backup snapshot created (pre-archive)',
    actionType: 'BACKUP',
    module: '💾 Backup',
    records: 'Primary 16.2 GB',
    user: 'System (Scheduler)',
    role: 'System',
    status: 'Success',
    duration: '18 min 10 sec',
    details: 'Automatic pre-archive RDS snapshot retained for 30 days as a rollback point.',
    checksum: '✅ Snapshot verified'
  }
];

const ACTION_TYPES = ['All Actions', 'Archive', 'Cold Push', 'Cleanup', 'Retrieve', 'Settings Change', 'Backup', 'Delete'];

const parseAuditTimestamp = (value: string) => {
  const [datePart, timePart = '00:00:00', meridiem = ''] = value.trim().split(/\s+/)
  const [day, monthLabel, year] = datePart.split('-')
  const month = new Date(`${monthLabel} 1, ${year}`).getMonth()
  const [rawHour = 0, minute = 0, second = 0] = timePart.split(':').map(Number)
  const hour = meridiem ? (rawHour % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0) : rawHour
  return new Date(Number(year), month, Number(day), hour, minute, second).getTime()
}

export function ArchiveAuditTrail() {
  const [tab, setTab] = useState<'LOG' | 'DELETE'>('LOG');
  const [query, setQuery] = useState('');
  const [actionType, setActionType] = useState('All Actions');
  const [module, setModule] = useState('All Modules');
  const [user, setUser] = useState('All Users');
  const [status, setStatus] = useState('All Status');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ query: '', actionType: 'All Actions', module: 'All Modules', user: 'All Users', status: 'All Status', fromDate: '', toDate: '' });
  const [detail, setDetail] = useState<AuditEvent | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState('Local sample log loaded');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };
  const commitFilters = () => {
    setAppliedFilters({ query, actionType, module, user, status, fromDate, toDate });
    showToast('Current audit filters applied to the event list.');
  };
  const resetFilters = () => {
    setQuery(''); setActionType('All Actions'); setModule('All Modules'); setUser('All Users'); setStatus('All Status'); setFromDate(''); setToDate('');
    setAppliedFilters({ query: '', actionType: 'All Actions', module: 'All Modules', user: 'All Users', status: 'All Status', fromDate: '', toDate: '' });
    showToast('Audit filters cleared; the full local sample log is displayed.');
  };
  const refreshAuditLog = () => {
    setLastRefreshed(new Date().toLocaleString('en-IN'));
    showToast('Local audit sample refreshed; current filters were retained.');
  };

  const exportFilteredEvents = () => {
    const rows = [
      ['Event ID', 'Date & Time', 'Action', 'Module', 'Records', 'User', 'Role', 'Status', 'Duration', 'Details'],
      ...events.map((event) => [event.id, event.when, event.action, event.module, event.records, event.user, event.role, event.status, event.duration, event.details])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'archive-audit-trail.csv';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast(`${events.length} filtered audit event(s) exported as CSV.`);
  };

  const downloadEventDetail = (event: AuditEvent) => {
    const content = JSON.stringify(event, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${event.id.toLowerCase()}-audit-detail.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast(`Audit detail ${event.id} downloaded.`);
  };

  const events = EVENTS.filter((e) => {
    if (appliedFilters.actionType === 'Archive' && e.actionType !== 'ARCHIVE') return false;
    if (appliedFilters.actionType === 'Cold Push' && e.actionType !== 'COLD') return false;
    if (appliedFilters.actionType === 'Cleanup' && e.actionType !== 'CLEANUP') return false;
    if (appliedFilters.actionType === 'Retrieve' && e.actionType !== 'RETRIEVE') return false;
    if (appliedFilters.actionType === 'Settings Change' && e.actionType !== 'SETTINGS') return false;
    if (appliedFilters.actionType === 'Backup' && e.actionType !== 'BACKUP') return false;
    if (appliedFilters.actionType === 'Delete' && e.actionType !== 'DELETE') return false;
    if (appliedFilters.module !== 'All Modules' && !e.module.includes(appliedFilters.module)) return false;
    if (appliedFilters.user !== 'All Users' && !(e.user.includes(appliedFilters.user) || e.role === appliedFilters.user)) return false;
    if (appliedFilters.status !== 'All Status' && e.status !== appliedFilters.status) return false;
    const timestamp = parseAuditTimestamp(e.when);
    if (appliedFilters.fromDate && timestamp < new Date(`${appliedFilters.fromDate}T00:00:00`).getTime()) return false;
    if (appliedFilters.toDate && timestamp > new Date(`${appliedFilters.toDate}T23:59:59.999`).getTime()) return false;
    if (appliedFilters.query && !`${e.id} ${e.action} ${e.details} ${e.user}`.toLowerCase().includes(appliedFilters.query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={FileSearch}
        title="Archive Audit Trail"
        screen="Archive Audit Trail"
        restricted="System-generated and immutable — Super Admin, Principal and Auditor can read, nobody can edit"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={refreshAuditLog}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={exportFilteredEvents}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Log
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => { window.print(); showToast('Print dialog opened for the audit log.'); }}>
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
            </Button>
          </>
        }
      />

      {/* SECTION 1 — stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={FileSearch} label="Total Archive Events (All Time)" value="4,850" sub="Since Apr 2019" />
        <KpiCard icon={CheckCircle2} label="Successful Operations" value="4,840 (99.8%)" tone="text-emerald-700" sub="🟢 Healthy" />
        <KpiCard icon={XCircle} label="Failed Operations" value="10" tone="text-rose-700" sub="🔴 All investigated" />
        <KpiCard icon={DownloadCloud} label="Retrievals This Year" value="5" sub="Completed requests" />
        <KpiCard icon={Trash2} label="Data Deletions" value="0" tone="text-emerald-700" sub="✅ No cold data ever deleted" />
      </div>

      {/* SECTION 2 — immutability warning */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">🔒 IMMUTABLE LOG — Tamper-Proof Audit Record</p>
          <p>
            This log is append-only. Nobody can edit or delete entries — including the Super Admin. Every event records the
            operator, the exact timestamp, the record count, the checksum result and the before/after state.
          </p>
          <p className="text-[11px] text-amber-800">Retention: permanent · Auditor has full read access for statutory review</p>
        </div>
      </div>

      {/* SECTION 3 — tabs + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTab('LOG')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border ${
            tab === 'LOG' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📋 Archive Operation Log
        </button>
        <button
          onClick={() => setTab('DELETE')}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border ${
            tab === 'DELETE' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          🗑️ Deletion Log (0 entries)
        </button>
        <span className="text-[11px] text-gray-500 ml-auto">
          <Filter className="w-3 h-3 inline mr-1" />
          {events.length} event(s) in the current view
        </span>
      </div>

      <Panel icon={Filter} title="Filter Events" subtitle={`Search by event id, action text, operator or date · local sample refreshed ${lastRefreshed}`}>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search event ID or description"
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs"
              />
            </div>
            <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
              {ACTION_TYPES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select value={module} onChange={(e) => setModule(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
              <option>All Modules</option>
              <option>Finance</option>
              <option>Fee</option>
              <option>Academic</option>
              <option>Notifications</option>
              <option>System Logs</option>
              <option>Temp Files</option>
              <option>Settings</option>
              <option>Backup</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={user} onChange={(e) => setUser(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
              <option>All Users</option>
              <option>System</option>
              <option>Super Admin</option>
              <option>Finance Manager</option>
              <option>Principal</option>
              <option>Auditor</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
              <option>All Status</option>
              <option>Success</option>
              <option>FAILED</option>
            </select>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-1.5 border border-gray-300 rounded-md text-xs" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={commitFilters}>
              <Search className="w-3.5 h-3.5 mr-1.5" /> Apply Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={resetFilters}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={exportFilteredEvents}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>
      </Panel>

      {/* SECTION 4 — the log */}
      {tab === 'LOG' ? (
        <Panel icon={FileSearch} title="Archive Operation Log" subtitle="Every archive, cold push, cleanup, retrieval and settings change">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="audit-table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={TH}>Event ID</th>
                  <th className={TH}>Date &amp; Time</th>
                  <th className={TH}>Action Performed</th>
                  <th className={TH}>Module / Data</th>
                  <th className={TH}>Records</th>
                  <th className={TH}>Performed By</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Duration</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((e) => (
                  <tr key={e.id} className={`hover:bg-indigo-50/20 ${e.status === 'FAILED' ? 'bg-rose-50/40' : ''}`}>
                    <td className="p-3 font-mono text-[10px] text-indigo-700 whitespace-nowrap">{e.id}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{e.when}</td>
                    <td className="p-3 text-gray-800 max-w-md">{e.action}</td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">{e.module}</td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">{e.records}</td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">
                      {e.user}
                      <div className="text-[10px] text-gray-500">{e.role}</div>
                    </td>
                    <td className="p-3">
                      <Pill tone={e.status === 'Success' ? 'green' : 'rose'}>{e.status === 'Success' ? '✅ Success' : '❌ FAILED'}</Pill>
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{e.duration}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setDetail(e)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500">
                      No audit events match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600">
            <p>📦 ARCHIVE → data copied from Primary DB to Archive DB · ❄️ COLD → data pushed to AWS Glacier</p>
            <p>🗑️ CLEANUP → temporary or expired data deleted · 📤 RETRIEVE → data pulled back from cold storage</p>
            <p>⚙️ SETTINGS → retention, security or provider configuration changed · 💾 BACKUP → snapshot created</p>
          </div>
        </Panel>
      ) : (
        <Panel icon={Trash2} title="Deletion Log" subtitle="Cold storage deletions — nothing has ever been deleted">
          <div className="p-10 text-center text-xs text-gray-500 space-y-2">
            <p className="text-3xl">🗑️</p>
            <p className="font-semibold text-gray-700">0 deletions recorded</p>
            <p>No file has ever been deleted from cold storage. Files older than the retention period appear on the Cold Storage Manager page as “eligible for deletion” and require Super Admin + Principal + Management approval.</p>
          </div>
        </Panel>
      )}

      {/* SECTION 5 — detail popup */}
      {detail && (
        <Modal isOpen onClose={() => setDetail(null)} title={`Audit Event — ${detail.id}`} size="lg">
          <div className="space-y-3 text-xs">
            <div
              className={`p-3 rounded-lg text-white ${
                detail.status === 'FAILED' ? 'bg-gradient-to-r from-rose-600 to-rose-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
              }`}
            >
              <p className="font-bold">{detail.status === 'FAILED' ? '❌ FAILED OPERATION' : '✅ SUCCESSFUL OPERATION'}</p>
              <p className="text-[11px] opacity-90">{detail.action}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <p>Event ID: <strong className="font-mono">{detail.id}</strong></p>
              <p>Timestamp: <strong>{detail.when}</strong></p>
              <p>Action Type: <strong>{detail.actionType}</strong></p>
              <p>Module: <strong>{detail.module}</strong></p>
              <p>Records Affected: <strong>{detail.records}</strong></p>
              <p>Duration: <strong>{detail.duration}</strong></p>
              <p>Performed By: <strong>{detail.user}</strong></p>
              <p>Role: <strong>{detail.role}</strong></p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">OPERATION DETAILS</p>
              <p>{detail.details}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">BEFORE / AFTER</p>
              <p>Before: <strong>{detail.before || '—'}</strong></p>
              <p>After: <strong>{detail.after || '—'}</strong></p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">INTEGRITY VERIFICATION</p>
              <p>Checksum Result: <strong>{detail.checksum || '—'}</strong></p>
              <p className="break-all">SHA256: <span className="font-mono text-[10px]">{detail.sha || '—'}</span></p>
            </div>

            {detail.status === 'FAILED' && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-[11px] text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Root cause: 3 receipt rows failed checksum verification. No primary data was deleted. The job was retried on
                  28-Sep 10:45 AM after the corrupted rows were re-exported — see the Retry entry in the log.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => { window.print(); showToast('Print dialog opened for this audit event.'); }}>
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => downloadEventDetail(detail)}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ArchiveAuditTrail;
