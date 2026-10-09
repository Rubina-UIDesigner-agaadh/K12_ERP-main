// UserLog.tsx — RBAC ▸ User Log
//
// Scope: authentication activity and access-control (RBAC) changes only — for
// one user at a time. What the user did inside academics, finance, admissions,
// and the other ERP modules belongs to the System Log (Utilities ▸ System Log).
//
// Four tabs:
//   1. 🔐 Login, Logout & Active Sessions
//   2. 🚨 Security & Access Violations
//   3. 🔑 Password & Authentication Changes
//   4. 👤 Account & RBAC Changes
//
// Read-only: there is no edit and no delete action anywhere on this page. Rows
// are clickable and expand to the full captured detail. Sensitive values —
// passwords, OTP numbers, reset tokens, 2FA secrets — are never stored.
import React, { Fragment, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Download,
  FileDown,
  ChevronDown,
  ChevronUp,
  Monitor,
  Smartphone,
  Tablet,
  LogIn,
  Clock,
  KeyRound,
  Lock,
  Fingerprint,
  UserCog,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Globe,
  History,
  Users,
  Eye,
  CalendarDays,
} from 'lucide-react';
import {
  ACCOUNT_GROUP_FILTERS,
  DATE_PRESETS,
  LOG_USERS,
  SECURITY_KIND_FILTERS,
  SEVERITY_META,
  SESSION_STATE_META,
  STATUS_FILTERS,
  bundleFor,
  userById,
  type AccountChangeRow,
  type AuthEventRow,
  type DatePreset,
  type FilterStatus,
  type SessionRow,
  type SecurityEventRow,
  type UserLogBundle
} from './userLogData';

/* ------------------------------------------------------------------ helpers */

const TODAY_ISO = '2025-09-30';

const TABS = [
  { id: 'sessions', icon: '🔐', label: 'Login, Logout & Active Sessions' },
  { id: 'security', icon: '🚨', label: 'Security & Access Violations' },
  { id: 'auth', icon: '🔑', label: 'Password & Authentication Changes' },
  { id: 'account', icon: '👤', label: 'Account & RBAC Changes' }
] as const;
type TabId = (typeof TABS)[number]['id'];

const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

/** '28 Sep 2025, 11:30:22 AM' → '2025-09-28' */
const isoOf = (at: string): string => {
  const m = /^(\d{2}) ([A-Za-z]{3}) (\d{4})/.exec(at.trim());
  if (!m) return '';
  return `${m[3]}-${MONTHS[m[2]] || '01'}-${m[1]}`;
};

const DEVICE_ICON: Record<string, React.ElementType> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };
const REASON_LABEL: Record<string, string> = {
  manual_logout: 'Manual logout',
  session_expired: 'Session expired (idle timeout)',
  force_logout: 'Force logout by admin',
  browser_closed: 'Browser closed',
  '—': '—'
};

const panel = 'bg-white border border-slate-200 rounded-xl';
const th = 'p-3 font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap text-[11px]';
const td = 'p-3 align-top text-slate-700';

/** Timestamp — school local time, UTC offset on hover. */
const Ts: React.FC<{ at: string; className?: string }> = ({ at, className }) => (
  <span className={className} title={`${at} — school local time (IST, UTC+05:30)`}>
    {at}
  </span>
);

const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-2 text-xs">
    <span className="w-40 flex-shrink-0 text-slate-500">{label}</span>
    <span className="font-medium text-slate-900">{children}</span>
  </div>
);

/* --------------------------------------------------------------------- page */

export function UserLog() {
  const [userId, setUserId] = useState('u1');
  const [userQuery, setUserQuery] = useState('');
  const [userListOpen, setUserListOpen] = useState(false);
  const [tab, setTab] = useState<TabId>('sessions');

  // Draft filters (what the panel shows) + applied filters (what the tables use).
  const [draftPreset, setDraftPreset] = useState<DatePreset>('Last 30 Days');
  const [draftFrom, setDraftFrom] = useState(TODAY_ISO);
  const [draftTo, setDraftTo] = useState(TODAY_ISO);
  const [draftStatus, setDraftStatus] = useState<'All' | FilterStatus>('All');
  const [applied, setApplied] = useState<{ preset: DatePreset; from: string; to: string; status: 'All' | FilterStatus }>({
    preset: 'Last 30 Days',
    from: TODAY_ISO,
    to: TODAY_ISO,
    status: 'All'
  });

  const [securityKind, setSecurityKind] = useState<'all' | SecurityEventRow['kind']>('all');
  const [accountGroup, setAccountGroup] = useState<'all' | AccountChangeRow['group']>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const user = userById(userId);
  const bundle: UserLogBundle = bundleFor(userId);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3600);
  };

  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ---------------------------------------------------------------- filters */

  const inWindow = (at: string): boolean => {
    const iso = isoOf(at);
    if (!iso) return true;
    switch (applied.preset) {
      case 'Today':
        return iso === TODAY_ISO;
      case 'Last 7 Days':
        return iso >= '2025-09-24';
      case 'Last 30 Days':
        return iso >= '2025-09-01';
      case 'Last 3 Months':
        return iso >= '2025-07-01';
      case 'This Academic Year':
        return iso >= '2025-04-01';
      case 'Custom Range':
        if (applied.from && iso < applied.from) return false;
        if (applied.to && iso > applied.to) return false;
        return true;
      default:
        return true;
    }
  };

  const keep = (at: string, status: FilterStatus): boolean =>
    inWindow(at) && (applied.status === 'All' || applied.status === status);

  const sessions = bundle.sessions.filter((s) => keep(s.at, s.filterStatus));
  const activeSessions = bundle.sessions.filter((s) => s.state === 'active');
  const securityEvents = bundle.securityEvents.filter(
    (v) => keep(v.at, v.filterStatus) && (securityKind === 'all' || v.kind === securityKind)
  );
  const authEvents = bundle.authEvents.filter((a) => keep(a.at, a.filterStatus));
  const accountChanges = bundle.accountChanges.filter(
    (c) => keep(c.at, c.filterStatus) && (accountGroup === 'all' || c.group === accountGroup)
  );

  const filteredUsers = LOG_USERS.filter(
    (u) => !userQuery || `${u.name} ${u.empId} ${u.role}`.toLowerCase().includes(userQuery.toLowerCase())
  );

  const applyFilters = () => {
    setApplied({ preset: draftPreset, from: draftFrom, to: draftTo, status: draftStatus });
    setOpen({});
    showToast(`Filters applied — ${draftPreset}${draftStatus !== 'All' ? ` · status: ${draftStatus}` : ''}.`);
  };

  const resetFilters = () => {
    setDraftPreset('Last 30 Days');
    setDraftFrom(TODAY_ISO);
    setDraftTo(TODAY_ISO);
    setDraftStatus('All');
    setApplied({ preset: 'Last 30 Days', from: TODAY_ISO, to: TODAY_ISO, status: 'All' });
    setSecurityKind('all');
    setAccountGroup('all');
    setOpen({});
    showToast('Filters reset to the last 30 days.');
  };

  const visibleCount = (id: TabId): number =>
    id === 'sessions' ? sessions.length : id === 'security' ? securityEvents.length : id === 'auth' ? authEvents.length : accountChanges.length;

  /* ----------------------------------------------------------------- export */

  const downloadCsv = (text: string, fileName: string) => {
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const csvEscape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

  /** Exactly what the current tab shows, after the applied filters. */
  const visibleRows = (): { header: string[]; rows: string[][] } => {
    if (tab === 'sessions') {
      return {
        header: ['Login At', 'IP Address', 'IP Type', 'Device', 'Browser', 'OS', 'Duration', 'Status', 'Session ID', 'Login Method', '2FA', 'End Reason'],
        rows: sessions.map((s) => [
          s.at, s.ip, s.ipType, s.device, s.browser, s.os, s.duration, SESSION_STATE_META[s.state].label, s.sessionId, s.loginMethod,
          s.twoFA ? 'Yes' : 'No', REASON_LABEL[s.endReason]
        ])
      };
    }
    if (tab === 'security') {
      return {
        header: ['Timestamp', 'Event', 'Type', 'Severity', 'Details', 'IP', 'Device'],
        rows: securityEvents.map((v) => [v.at, v.event, v.kind, v.severity, v.details, v.ip || '—', v.device || '—'])
      };
    }
    if (tab === 'auth') {
      return {
        header: ['Timestamp', 'Event', 'Category', 'Details', 'Method', 'Attempt', 'By', 'Email'],
        rows: authEvents.map((a) => [a.at, a.event, a.kind, a.details, a.method || '—', a.attempt || '—', a.by || '—', a.maskedEmail || '—'])
      };
    }
    return {
      header: ['Timestamp', 'Change Type', 'Group', 'Details', 'Done By', 'Reason'],
      rows: accountChanges.map((c) => [c.at, c.changeType, c.group, c.details, c.doneBy, c.reason || '—'])
    };
  };

  const exportLog = (format: 'CSV' | 'PDF') => {
    const { header, rows } = visibleRows();
    if (rows.length === 0) {
      showToast('Nothing to export — no rows are visible with the current filters.');
      return;
    }
    if (format === 'CSV') {
      const csv = [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n');
      downloadCsv(csv, `${user.empId}_user_log_${tab}_${TODAY_ISO}.csv`);
      showToast(`CSV export ready — ${rows.length} row(s) of the visible filtered log (${tabLabel(tab)}).`);
      return;
    }
    showToast(`PDF export ready — ${rows.length} row(s) of the visible filtered log (${tabLabel(tab)}).`);
  };

  const tabLabel = (id: TabId) => TABS.find((t) => t.id === id)?.label || id;

  /* ----------------------------------------------------------------- render */

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* ───────────────────────────────────────── header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Shield className="w-7 h-7 text-blue-600 mt-0.5" />
          <div>
            <nav className="text-[11px] text-slate-500">
              RBAC &nbsp;/&nbsp; <span className="text-slate-700 font-medium">User Log</span>
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
              User Log
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">
                Auth &amp; RBAC events only · FY: 2025-26
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              WHO · WHEN · WHAT · WHERE · RESULT — logins, access violations, authentication changes and account/RBAC changes for
              one user at a time.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => showToast(`User log refreshed for ${user.name} — immutable records, nothing is re-written.`)}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" data-testid="export-csv" onClick={() => exportLog('CSV')}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" data-testid="export-pdf" onClick={() => exportLog('PDF')}>
            <FileDown className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* ───────────────────────────────────────── user selector */}
      <div className={panel} data-testid="user-panel">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <UserCog className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">User Selector</h2>
          <span className="text-[11px] text-slate-500">Pick the user whose authentication and RBAC activity you want to inspect</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="relative max-w-xl">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">View logs for</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                data-testid="user-search"
                value={userQuery}
                onChange={(e) => {
                  setUserQuery(e.target.value);
                  setUserListOpen(true);
                }}
                onFocus={() => setUserListOpen(true)}
                placeholder="Search by name or Employee ID..."
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => setUserListOpen((v) => !v)}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700"
                title="Show users"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            {userListOpen && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    data-testid={`user-option-${u.id}`}
                    onClick={() => {
                      setUserId(u.id);
                      setUserListOpen(false);
                      setUserQuery('');
                      setOpen({});
                      showToast(`Showing authentication and RBAC activity for ${u.name} (${u.empId}).`);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-0 ${
                      u.id === userId ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <span className="text-lg">{u.icon}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-slate-800">{u.name}</span>
                      <span className="block text-[11px] text-slate-500">
                        {u.empId} · {u.role} · {u.branch}
                      </span>
                    </span>
                    <Badge variant={u.status === 'Active' ? 'success' : 'warning'}>{u.status}</Badge>
                  </button>
                ))}
                {filteredUsers.length === 0 && <p className="px-4 py-3 text-xs text-slate-500">No user matches “{userQuery}”.</p>}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-3xl">{user.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {user.empId} · {user.role} · {user.branch} ·{' '}
                <span className={user.status === 'Active' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                  {user.status === 'Active' ? '🟢 Active' : '🟠 Suspended'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Joined: {user.joined} · <Ts at={user.lastLogin} /> · Data scope: {user.dataScope} · Classes:{' '}
                {user.classes.length ? user.classes.join(', ') : '—'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {LOG_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setUserId(u.id);
                    setOpen({});
                  }}
                  className={`px-2 py-1 rounded-md border text-[11px] ${
                    u.id === userId ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {u.empId}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { icon: LogIn, label: 'Logins — last 30 days', value: bundle.quickStats.logins, tone: 'text-blue-700' },
              { icon: Globe, label: 'Active sessions now', value: bundle.quickStats.activeNow, tone: bundle.quickStats.activeNow ? 'text-emerald-700' : 'text-slate-500' },
              { icon: XCircle, label: 'Failed logins', value: bundle.quickStats.failedLogins, tone: bundle.quickStats.failedLogins ? 'text-rose-700' : 'text-emerald-700' },
              { icon: ShieldAlert, label: 'Security flags', value: bundle.quickStats.flags, tone: bundle.quickStats.flags ? 'text-amber-700' : 'text-emerald-700' }
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</span>
                  <s.icon className="w-4 h-4 text-slate-300" />
                </div>
                <div className={`text-xl font-bold ${s.tone}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────── filters (all tabs) */}
      <div className={panel}>
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <span className="text-[11px] text-slate-500">Date range and status apply to every tab below</span>
          <span className="ml-auto text-[11px] text-slate-500">
            Applied: <strong className="text-slate-700">{applied.preset}</strong>
            {applied.status !== 'All' ? ` · status: ${applied.status}` : ''}
            {applied.preset === 'Custom Range' ? ` · ${applied.from} → ${applied.to}` : ''}
          </span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Date range:</span>
            {DATE_PRESETS.map((p) => (
              <button
                key={p}
                data-testid={`date-preset-${p.replace(/\s+/g, '-')}`}
                onClick={() => setDraftPreset(p)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors ${
                  draftPreset === p ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {draftPreset === 'Custom Range' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">From date</label>
                <input
                  type="date"
                  data-testid="from-date"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">To date</label>
                <input
                  type="date"
                  data-testid="to-date"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-2xl">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Status</label>
              <select
                data-testid="status-filter"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value as 'All' | FilterStatus)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="text-xs" data-testid="apply-filters" onClick={applyFilters}>
              <Search className="w-3.5 h-3.5 mr-1.5" /> Apply Filters
            </Button>
            <Button variant="outline" size="sm" className="text-xs" data-testid="reset-filters" onClick={resetFilters}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
            <span className="text-[11px] text-slate-500">
              Timestamps are shown in the school’s local timezone (IST) — hover any timestamp for the UTC offset.
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────── tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            data-testid={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.icon} {t.label} ({visibleCount(t.id)})
          </button>
        ))}
      </div>

      {/* ══════════════════════════ TAB 1 — LOGIN, LOGOUT & ACTIVE SESSIONS */}
      {tab === 'sessions' && (
        <div className="space-y-4">
          {/* Active sessions right now — not windowed: it is live state */}
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Active Sessions Right Now</h2>
              <span className="text-[11px] text-slate-500">{activeSessions.length} active session(s) found — live, not date-filtered</span>
            </div>
            {activeSessions.length === 0 ? (
              <p className="p-5 text-xs text-slate-500" data-testid="no-active-sessions">
                No active sessions — {user.name} is not signed in right now.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse" data-testid="active-sessions-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className={th}>Logged In At</th>
                      <th className={th}>IP Address</th>
                      <th className={th}>Device</th>
                      <th className={th}>Duration</th>
                      <th className={`${th} text-right`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeSessions.map((s, idx) => {
                      const D = DEVICE_ICON[s.device] || Monitor;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className={td}>
                            <Ts at={s.at} />
                            <span className={`block text-[11px] font-medium ${idx === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {idx === 0 ? '(Current)' : '(Second device · concurrent)'}
                            </span>
                          </td>
                          <td className={td}>
                            <span className="font-mono">{s.ip}</span>
                            <span className="block text-[11px] text-slate-400">({s.ipType})</span>
                          </td>
                          <td className={td}>
                            <span className="inline-flex items-center gap-1.5">
                              <D className="w-3.5 h-3.5 text-slate-400" /> {s.device}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {s.browser} · {s.os}
                            </span>
                          </td>
                          <td className={td}>
                            {s.duration}
                            <span className="block text-[11px] text-emerald-600">Still active</span>
                          </td>
                          <td className={`${td} text-right`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-rose-700 border-rose-200"
                              data-testid={`force-out-${s.id}`}
                              onClick={() =>
                                showToast(
                                  `Force logout recorded for ${user.name} — session ${s.sessionId} terminated by Admin. Sign-in is blocked on that device.`
                                )
                              }
                            >
                              <Ban className="w-3.5 h-3.5 mr-1" /> Force Out
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Session summary */}
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Session Summary</h2>
              <span className="text-[11px] text-slate-500">Last 30 days · {user.name}</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 text-xs">
              <p className="text-slate-600">
                Total Sessions: <strong className="block text-slate-900 text-sm">{bundle.sessionSummary.totalSessions}</strong>
              </p>
              <p className="text-slate-600">
                Average Duration: <strong className="block text-slate-900 text-sm">{bundle.sessionSummary.avgDuration}</strong>
              </p>
              <p className="text-slate-600">
                Unique IPs Used: <strong className="block text-slate-900 text-sm">{bundle.sessionSummary.uniqueIps}</strong>
              </p>
              <p className="text-slate-600">
                Most Used Device: <strong className="block text-slate-900 text-sm">{bundle.sessionSummary.mostUsedDevice}</strong>
              </p>
              <p className="text-slate-600">
                Last Active: <strong className="block text-slate-900 text-sm">{bundle.sessionSummary.lastActive}</strong>
              </p>
            </div>
          </div>

          {/* Session history */}
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Login, Logout &amp; Session History</h2>
              <span className="text-[11px] text-slate-500">{sessions.length} record(s) · click any row for the full session detail</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" data-testid="sessions-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={th}>Date &amp; Time</th>
                    <th className={th}>IP Address</th>
                    <th className={th}>Device</th>
                    <th className={th}>Duration</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((s) => {
                    const D = DEVICE_ICON[s.device] || Monitor;
                    const meta = SESSION_STATE_META[s.state];
                    const isOpen = !!open[`session-${s.id}`];
                    return (
                      <Fragment key={s.id}>
                        <tr
                          data-testid={`session-row-${s.id}`}
                          onClick={() => toggle(`session-${s.id}`)}
                          className="cursor-pointer hover:bg-slate-50"
                        >
                          <td className={td}>
                            <Ts at={s.at} />
                          </td>
                          <td className={td}>
                            <span className="font-mono">{s.ip}</span>
                            <span className="block text-[11px] text-slate-400">({s.ipType})</span>
                          </td>
                          <td className={td}>
                            <span className="inline-flex items-center gap-1.5">
                              <D className="w-3.5 h-3.5 text-slate-400" /> {s.device}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {s.browser} · {s.os}
                            </span>
                          </td>
                          <td className={td}>
                            {s.duration}
                            <span className="block text-[11px] text-slate-400">{s.durationNote}</span>
                          </td>
                          <td className={td}>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${meta.cls}`}>
                              {meta.icon} {meta.label}
                            </span>
                          </td>
                          <td className={`${td} text-right`}>
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-700">
                              <Eye className="w-3.5 h-3.5" /> {isOpen ? 'Hide' : 'View'}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 inline ml-1 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 inline ml-1 text-slate-400" />
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr data-testid={`session-detail-${s.id}`} className="bg-slate-50/70">
                            <td colSpan={6} className="p-4">
                              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 max-w-3xl">
                                <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                  <Fingerprint className="w-3.5 h-3.5 text-blue-600" /> Session Detail
                                </p>
                                <DetailRow label="Session ID">
                                  <span className="font-mono">{s.sessionId}</span>
                                </DetailRow>
                                <DetailRow label="Login">
                                  <Ts at={s.at} />
                                </DetailRow>
                                <DetailRow label="Logout / End">
                                  {s.logoutAt ? <Ts at={s.logoutAt} /> : s.state === 'active' ? 'Still signed in' : '—'}
                                </DetailRow>
                                <DetailRow label="Duration">{s.duration}</DetailRow>
                                <DetailRow label="End Reason">{REASON_LABEL[s.endReason]}</DetailRow>
                                <DetailRow label="IP Address">
                                  <span className="font-mono">{s.ip}</span> ({s.ipType} network)
                                </DetailRow>
                                <DetailRow label="Device">
                                  {s.device} · {s.browser} · {s.os}
                                </DetailRow>
                                <DetailRow label="Login Method">{s.loginMethod}</DetailRow>
                                <DetailRow label="2FA Used">{s.twoFA ? 'Yes' : 'No'}</DetailRow>
                                {s.attempt && <DetailRow label="Attempt">{s.attempt}</DetailRow>}
                                <DetailRow label="Security Flags">{s.securityNote}</DetailRow>
                                {s.flags.length > 0 && (
                                  <DetailRow label="Flag Codes">
                                    <span className="font-mono text-[11px]">{s.flags.join(', ')}</span>
                                  </DetailRow>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {sessions.length === 0 && (
              <p className="p-5 text-xs text-slate-500" data-testid="tab-empty">
                No login or session records for {user.name} inside the applied filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════ TAB 2 — SECURITY & ACCESS VIOLATIONS */}
      {tab === 'security' && (
        <div className="space-y-4">
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Security Status</h2>
              <span className="text-[11px] text-slate-500">Authentication security only — page-level access violations for other modules are in the System Log</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">🛡️ Account Status</span>
                <strong className="text-slate-900 text-sm">{bundle.securityStatus.accountStatus}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Failed Login</span>
                <strong className="text-slate-900 text-sm">{bundle.securityStatus.lastFailedLogin}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Account Locked</span>
                <strong className="text-slate-900 text-sm">{bundle.securityStatus.accountLocked}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Total Security Flags</span>
                <strong className="text-slate-900 text-sm">{bundle.securityStatus.totalFlags}</strong>
              </div>
            </div>
          </div>

          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Security &amp; Access Events</h2>
              <span className="text-[11px] text-slate-500">{securityEvents.length} event(s)</span>
            </div>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Event type:</span>
              {SECURITY_KIND_FILTERS.map((f) => (
                <button
                  key={f.id}
                  data-testid={`sec-chip-${f.id}`}
                  onClick={() => setSecurityKind(f.id)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors ${
                    securityKind === f.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" data-testid="security-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={th}>Timestamp</th>
                    <th className={th}>Event</th>
                    <th className={th}>Severity</th>
                    <th className={th}>Details</th>
                    <th className={`${th} text-right`}>Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {securityEvents.map((v) => {
                    const sev = SEVERITY_META[v.severity];
                    const isOpen = !!open[`security-${v.id}`];
                    return (
                      <Fragment key={v.id}>
                        <tr
                          data-testid={`security-row-${v.id}`}
                          onClick={() => toggle(`security-${v.id}`)}
                          className={`cursor-pointer hover:bg-slate-50 ${v.severity === 'High' ? 'bg-rose-50/40' : ''}`}
                        >
                          <td className={td}>
                            <Ts at={v.at} />
                          </td>
                          <td className={td}>
                            <span className="font-medium text-slate-900">
                              {v.icon} {v.event}
                            </span>
                            <span className="block text-[11px] text-slate-400">{v.kind}</span>
                          </td>
                          <td className={td}>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${sev.cls}`}>
                              {sev.icon} {v.severity}
                            </span>
                          </td>
                          <td className={`${td} max-w-md`}>
                            <span className="line-clamp-2">{v.details}</span>
                          </td>
                          <td className={`${td} text-right`}>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 inline text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 inline text-slate-400" />
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr data-testid={`security-detail-${v.id}`} className="bg-slate-50/70">
                            <td colSpan={5} className="p-4">
                              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 max-w-3xl">
                                <p className="text-xs font-bold text-slate-900">
                                  {v.icon} {v.event} — {v.severity} severity
                                </p>
                                <DetailRow label="Timestamp">
                                  <Ts at={v.at} />
                                </DetailRow>
                                <DetailRow label="Details">{v.details}</DetailRow>
                                {v.attempt && <DetailRow label="Attempt">{v.attempt}</DetailRow>}
                                {v.reason && <DetailRow label="Failure reason"><span className="font-mono">{v.reason}</span></DetailRow>}
                                {v.ip && <DetailRow label="IP Address"><span className="font-mono">{v.ip}</span></DetailRow>}
                                {v.device && <DetailRow label="Device">{v.device}</DetailRow>}
                                {v.lockedBy && (
                                  <>
                                    <DetailRow label="Locked by">{v.lockedBy}</DetailRow>
                                    {v.unlockedAt && <DetailRow label="Unlocked at"><Ts at={v.unlockedAt} /></DetailRow>}
                                    {v.unlockedBy && <DetailRow label="Unlocked by">{v.unlockedBy}</DetailRow>}
                                  </>
                                )}
                                {v.terminatedBy && <DetailRow label="Terminated by">{v.terminatedBy}</DetailRow>}
                                {v.terminatedSession && (
                                  <DetailRow label="Terminated session"><span className="font-mono">{v.terminatedSession}</span></DetailRow>
                                )}
                                {v.flags && v.flags.length > 0 && (
                                  <DetailRow label="Suspicious flags">
                                    <span className="font-mono text-[11px]">{v.flags.join(', ')}</span>
                                  </DetailRow>
                                )}
                                <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                                  Severity meaning: {SEVERITY_META[v.severity].meaning}.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {securityEvents.length === 0 && (
              <p className="p-5 text-xs text-slate-500" data-testid="tab-empty">
                No security events for {user.name} inside the applied filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════ TAB 3 — PASSWORD & AUTHENTICATION CHANGES */}
      {tab === 'auth' && (
        <div className="space-y-4">
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Auth Summary</h2>
              <span className="text-[11px] text-slate-500">How this user authenticates — nothing sensitive is stored</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Last Password Change</span>
                <strong className="text-slate-900 text-sm">{bundle.authSummary.lastPasswordChange}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Total Password Resets</span>
                <strong className="text-slate-900 text-sm">{bundle.authSummary.totalResets}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">2FA Status</span>
                <strong className="text-slate-900 text-sm">{bundle.authSummary.twoFA}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">OTP Events This Month</span>
                <strong className="text-slate-900 text-sm">{bundle.authSummary.otpThisMonth}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-[11px] text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Never logged under any circumstance: actual password values (old or new), OTP numeric values, password reset tokens
              or links, and 2FA secret keys or backup code values.
            </span>
          </div>

          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Password, OTP &amp; 2FA Events</h2>
              <span className="text-[11px] text-slate-500">{authEvents.length} event(s) · click any row for the full detail</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" data-testid="auth-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={th}>Timestamp</th>
                    <th className={th}>Event</th>
                    <th className={th}>Details</th>
                    <th className={`${th} text-right`}>Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {authEvents.map((a) => {
                    const isOpen = !!open[`auth-${a.id}`];
                    return (
                      <Fragment key={a.id}>
                        <tr data-testid={`auth-row-${a.id}`} onClick={() => toggle(`auth-${a.id}`)} className="cursor-pointer hover:bg-slate-50">
                          <td className={td}>
                            <Ts at={a.at} />
                          </td>
                          <td className={td}>
                            <span className="font-medium text-slate-900">
                              {a.icon} {a.event}
                            </span>
                            <span className="block text-[11px] text-slate-400">{a.kind}</span>
                          </td>
                          <td className={`${td} max-w-xl`}>{a.details}</td>
                          <td className={`${td} text-right`}>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 inline text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 inline text-slate-400" />
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr data-testid={`auth-detail-${a.id}`} className="bg-slate-50/70">
                            <td colSpan={4} className="p-4">
                              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 max-w-3xl">
                                <p className="text-xs font-bold text-slate-900">
                                  {a.icon} {a.event}
                                </p>
                                <DetailRow label="Timestamp">
                                  <Ts at={a.at} />
                                </DetailRow>
                                <DetailRow label="Category">{a.kind}</DetailRow>
                                <DetailRow label="Details">{a.details}</DetailRow>
                                {a.purpose && <DetailRow label="Purpose">{a.purpose}</DetailRow>}
                                {a.method && <DetailRow label="Method / Reason">{a.method}</DetailRow>}
                                {a.attempt && <DetailRow label="Attempt">{a.attempt}</DetailRow>}
                                {a.by && <DetailRow label="Done by">{a.by}</DetailRow>}
                                {a.maskedEmail && (
                                  <DetailRow label="Email sent to">
                                    <span className="font-mono">{a.maskedEmail}</span> (partially masked)
                                  </DetailRow>
                                )}
                                {a.note && <DetailRow label="Note">{a.note}</DetailRow>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {authEvents.length === 0 && (
              <p className="p-5 text-xs text-slate-500" data-testid="tab-empty">
                No password, OTP or 2FA events for {user.name} inside the applied filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════ TAB 4 — ACCOUNT & RBAC CHANGES */}
      {tab === 'account' && (
        <div className="space-y-4">
          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Account Timeline</h2>
              <span className="text-[11px] text-slate-500">Changes made TO this user by administrators</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Account Created</span>
                <strong className="text-slate-900 text-sm">{bundle.accountTimeline.created}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Role Change</span>
                <strong className="text-slate-900 text-sm">{bundle.accountTimeline.lastRoleChange}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Permission Change</span>
                <strong className="text-slate-900 text-sm">{bundle.accountTimeline.lastPermissionChange}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Scope Change</span>
                <strong className="text-slate-900 text-sm">{bundle.accountTimeline.lastScopeChange}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Status Change</span>
                <strong className="text-slate-900 text-sm">{bundle.accountTimeline.lastStatusChange}</strong>
              </div>
            </div>
          </div>

          <div className={panel}>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Account &amp; RBAC Change Log</h2>
              <span className="text-[11px] text-slate-500">{accountChanges.length} change(s) · click any row for before &amp; after</span>
            </div>
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">Change type:</span>
              {ACCOUNT_GROUP_FILTERS.map((f) => (
                <button
                  key={f.id}
                  data-testid={`acc-chip-${f.id}`}
                  onClick={() => setAccountGroup(f.id)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors ${
                    accountGroup === f.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" data-testid="account-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={th}>Timestamp</th>
                    <th className={th}>Change Type</th>
                    <th className={th}>Details</th>
                    <th className={th}>Done By</th>
                    <th className={`${th} text-right`}>Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accountChanges.map((c) => {
                    const isOpen = !!open[`account-${c.id}`];
                    return (
                      <Fragment key={c.id}>
                        <tr data-testid={`account-row-${c.id}`} onClick={() => toggle(`account-${c.id}`)} className="cursor-pointer hover:bg-slate-50">
                          <td className={td}>
                            <Ts at={c.at} />
                          </td>
                          <td className={td}>
                            <span className="font-medium text-slate-900">
                              {c.icon} {c.changeType}
                            </span>
                            <span className="block text-[11px] text-slate-400">{c.group}</span>
                          </td>
                          <td className={`${td} max-w-md`}>{c.details}</td>
                          <td className={td}>{c.doneBy}</td>
                          <td className={`${td} text-right`}>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 inline text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 inline text-slate-400" />
                            )}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr data-testid={`account-detail-${c.id}`} className="bg-slate-50/70">
                            <td colSpan={5} className="p-4">
                              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 max-w-4xl">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-slate-900">
                                    {c.icon} Change Detail: {c.changeType}
                                  </p>
                                  <Badge variant="secondary" className="text-[10px]">
                                    {c.group}
                                  </Badge>
                                </div>

                                <DetailRow label="Timestamp">
                                  <Ts at={c.at} />
                                </DetailRow>
                                <DetailRow label="Changed By">{c.doneBy}</DetailRow>
                                <DetailRow label="Reason">{c.reason || '—'}</DetailRow>
                                {c.note && <DetailRow label="Note">{c.note}</DetailRow>}

                                {c.diff && c.diff.length > 0 && (
                                  <div className="pt-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                      Before → After ({c.group === 'role' ? 'permissions sample' : 'permission'})
                                    </p>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden max-w-xl">
                                      <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50">
                                          <tr>
                                            <th className="p-2 font-semibold text-slate-600">Permission</th>
                                            <th className="p-2 font-semibold text-slate-600">Before</th>
                                            <th className="p-2 font-semibold text-slate-600">After</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {c.diff.map((d) => (
                                            <tr key={d.label}>
                                              <td className="p-2 text-slate-700">{d.label}</td>
                                              <td className="p-2 text-slate-600">{d.before}</td>
                                              <td className="p-2 font-medium text-slate-900">
                                                {d.after}
                                                {d.isNew && <span className="ml-2 text-[10px] text-emerald-700">← Newly granted</span>}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {c.fields && c.fields.length > 0 && (
                                  <div className="pt-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Field changes</p>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden max-w-xl">
                                      <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50">
                                          <tr>
                                            <th className="p-2 font-semibold text-slate-600">Field</th>
                                            <th className="p-2 font-semibold text-slate-600">Before</th>
                                            <th className="p-2 font-semibold text-slate-600">After</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {c.fields.map((f) => (
                                            <tr key={f.label}>
                                              <td className="p-2 text-slate-700">{f.label}</td>
                                              <td className="p-2 text-slate-600">{f.before}</td>
                                              <td className="p-2 font-medium text-slate-900">{f.after}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {c.scope && c.scope.length > 0 && (
                                  <div className="pt-1 space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                      Scope in use: {c.scopeName || user.dataScope}
                                    </p>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden max-w-xl">
                                      <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50">
                                          <tr>
                                            <th className="p-2 font-semibold text-slate-600">Class</th>
                                            <th className="p-2 font-semibold text-slate-600">Division</th>
                                            <th className="p-2 font-semibold text-slate-600">Subject</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          {c.scope.map((s) => (
                                            <tr key={`${s.className}-${s.division}-${s.subject}`}>
                                              <td className="p-2 text-slate-700">{s.className}</td>
                                              <td className="p-2 text-slate-700">{s.division}</td>
                                              <td className="p-2 font-medium text-slate-900">
                                                {s.subject}
                                                {s.isNew && <span className="ml-2 text-[10px] text-emerald-700">← Newly added</span>}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {c.previousAssignments && (
                                      <p className="text-[11px] text-slate-500">Previous assignments (unchanged): {c.previousAssignments}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {accountChanges.length === 0 && (
              <p className="p-5 text-xs text-slate-500" data-testid="tab-empty">
                No account or RBAC changes for {user.name} inside the applied filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────── read-only note */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
        <Lock className="w-3.5 h-3.5" />
        <span>
          This log is permanent and read-only — there is no edit and no delete action anywhere on this page, and every row is immutable.
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Covers logins, access violations, authentication changes and account/RBAC changes only — for everything a user did inside
          other ERP modules, use <strong>System Log</strong> in Utilities.
        </span>
      </div>

      {/* ───────────────────────────────────────── toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default UserLog;
