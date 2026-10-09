// File: src/pages/admin/utilities/LogViewerAuditExport.tsx
// Utilities ▸ System Log — one unified page for Audit Logs (who did what, where,
// when) and System Logs (events, errors, performance, cron).
//
// Every entry stores WHO / WHAT / WHAT CHANGED (before → after) / WHEN / WHERE &
// HOW / RESULT / CONTEXT. Logs are immutable: there is no edit and no delete
// button anywhere on this page, and sensitive values are never stored.
import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  ScrollText,
  ShieldAlert,
  Filter,
  Search,
  RefreshCw,
  Play,
  Pause,
  FileDown,
  FileSpreadsheet,
  FileText,
  Eye,
  Copy,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Lock,
  UserCog,
  History,
  Database,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  SEED_LOGS,
  EVENT_CATALOG,
  ALL_EVENTS,
  CATEGORY_META,
  CATEGORIES,
  RETENTION_POLICY,
  PRIORITY_TABLE,
  NEVER_LOGGED,
  MASKED_FIELD_EXAMPLES,
  SECURITY_ALERTS,
  MODULE_OPTIONS,
  BRANCH_OPTIONS,
  ACTION_OPTIONS,
  STATUS_OPTIONS,
  type LogCategory,
  type LogEntry,
  type LogStatus
} from './systemLogData';

const PAGE_SIZE = 10;

const TABS = [
  '📋 All Logs',
  '🔐 Security & Access',
  '✏️ Data Changes (Audit)',
  '⚙️ System & Errors',
  '🔄 Scheduled Jobs',
  '📤 Export, Print & Sharing',
  '🗂️ Event Catalog',
  '📜 Retention & Priority'
] as const;
type Tab = (typeof TABS)[number];

const DATA_CHANGE_ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT'];

const STATUS_STYLE: Record<LogStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  blocked: 'bg-gray-900 text-white border-gray-900'
};

const STATUS_ICON: Record<LogStatus, React.ElementType> = {
  success: CheckCircle2,
  failed: XCircle,
  warning: AlertTriangle,
  blocked: Ban
};

const fmtValue = (v: unknown): string => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
};

/** Build the field-by-field before → after diff for one entry. */
function buildDiff(entry: LogEntry) {
  const oldV = (entry.oldValues || {}) as Record<string, unknown>;
  const newV = (entry.newValues || {}) as Record<string, unknown>;
  const keys = Array.from(new Set([...Object.keys(oldV), ...Object.keys(newV)]));
  return keys.map((k) => ({
    field: k,
    before: fmtValue(oldV[k]),
    after: fmtValue(newV[k]),
    changed: fmtValue(oldV[k]) !== fmtValue(newV[k])
  }));
}

export function LogViewerAuditExport() {
  const [tab, setTab] = useState<Tab>(TABS[0]);
  // filters
  const [category, setCategory] = useState<'All' | LogCategory>('All');
  const [module, setModule] = useState('All');
  const [action, setAction] = useState('All');
  const [userQuery, setUserQuery] = useState('');
  const [status, setStatus] = useState<'All' | LogStatus>('All');
  const [datePreset, setDatePreset] = useState('Last 30 Days');
  const [fromDate, setFromDate] = useState('2025-09-01');
  const [toDate, setToDate] = useState('2025-09-30');
  const [branch, setBranch] = useState('All');
  const [ipQuery, setIpQuery] = useState('');
  const [logIdQuery, setLogIdQuery] = useState('');
  // ui
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<LogEntry | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [alertsRead, setAlertsRead] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  /* ------------------------------------------------ real-time refresh (30 s) */
  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => setLastRefresh(new Date()), 30000);
    return () => window.clearInterval(id);
  }, [autoRefresh]);

  const refreshNow = () => {
    setLastRefresh(new Date());
    showToast('Log table refreshed — immutable records, nothing is re-written.');
  };

  const exportLogs = (format: 'CSV' | 'Excel' | 'PDF') =>
    showToast(`Exporting ${format} of the ${filtered.length} filtered log entries — the export itself is logged too.`);

  /* ----------------------------------------------------------- date window */
  const inDateWindow = (iso: string) => {
    if (datePreset === 'Today') return iso === '2025-09-30';
    if (datePreset === 'Last 7 Days') return iso >= '2025-09-24';
    if (datePreset === 'Last 30 Days') return iso >= '2025-09-01';
    if (datePreset === 'Custom') {
      if (fromDate && iso < fromDate) return false;
      if (toDate && iso > toDate) return false;
      return true;
    }
    return true;
  };

  /* ----------------------------------------------------------- filter engine */
  const filtered = useMemo(() => {
    return SEED_LOGS.filter((l) => {
      // tab slice
      if (tab === TABS[1] && l.category !== 'Security') return false;
      if (tab === TABS[2] && !DATA_CHANGE_ACTIONS.includes(l.action)) return false;
      if (tab === TABS[3] && !['System', 'Error'].includes(l.category)) return false;
      if (tab === TABS[4] && !(l.type.startsWith('cron_') || l.type === 'scheduled_job_failed' || l.module === 'Cron')) return false;
      if (tab === TABS[5] && l.category !== 'Export') return false;
      // filters
      if (category !== 'All' && l.category !== category) return false;
      if (module !== 'All' && l.module !== module) return false;
      if (action !== 'All' && l.action !== action) return false;
      if (status !== 'All' && l.status !== status) return false;
      if (branch !== 'All' && l.branch !== branch) return false;
      if (userQuery && !`${l.userName} ${l.userEmpId} ${l.userRole}`.toLowerCase().includes(userQuery.toLowerCase())) return false;
      if (ipQuery && !l.ip.includes(ipQuery.trim())) return false;
      if (logIdQuery) {
        const q = logIdQuery.toLowerCase().trim();
        if (!(l.id.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))) return false;
      }
      if (!inDateWindow(l.date)) return false;
      return true;
    });
  }, [tab, category, module, action, status, branch, userQuery, ipQuery, logIdQuery, datePreset, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ---------------------------------------------------------------- helpers */
  const resetFilters = () => {
    setCategory('All');
    setModule('All');
    setAction('All');
    setUserQuery('');
    setStatus('All');
    setDatePreset('Last 30 Days');
    setFromDate('2025-09-01');
    setToDate('2025-09-30');
    setBranch('All');
    setIpQuery('');
    setLogIdQuery('');
    setPage(1);
  };

  const viewUserActivity = (entry: LogEntry) => {
    setUserQuery(entry.userName);
    setTab(TABS[0]);
    setCategory('All');
    setDetail(null);
    setPage(1);
    showToast(`Filtered to all activity by ${entry.userName} (${entry.userEmpId}).`);
  };

  const copyId = (id: string) => {
    try {
      const p = (navigator as Navigator & { clipboard?: { writeText?: (s: string) => Promise<void> } }).clipboard?.writeText?.(id);
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* clipboard is not available — the toast still confirms the action */
    }
    showToast(`Log ID ${id} copied to clipboard.`);
  };

  const catalog = useMemo(() => {
    const q = catalogQuery.toLowerCase().trim();
    return EVENT_CATALOG.map((c) => ({
      category: c.category,
      events: q ? c.events.filter((e) => `${e.key} ${e.label} ${e.action} ${e.module}`.toLowerCase().includes(q)) : c.events
    })).filter((c) => c.events.length > 0);
  }, [catalogQuery]);

  const panel = 'bg-white border border-gray-200 rounded-xl';
  const th = 'p-3 font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap';

  return (
    <div className="space-y-6 py-6">
      {/* ─────────────────────────────── header */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 flex-wrap">
          <span>Home</span>
          <span>&gt;</span>
          <span>Administration</span>
          <span>&gt;</span>
          <span>Utilities</span>
          <span>&gt;</span>
          <span className="text-gray-800 font-semibold">System Log</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                System Log
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-0.5">
                  FY: 2025-26
                </span>
              </h1>
              <p className="text-xs text-gray-500">
                Unified Audit Logs + System Logs · every action, event, error and cron run across all modules
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={datePreset}
              aria-label="Date range"
              onChange={(e) => setDatePreset(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-md text-xs bg-white"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs" onClick={refreshNow}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'primary' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => {
                setAutoRefresh((v) => !v);
                showToast(autoRefresh ? 'Auto-refresh stopped.' : 'Auto-refresh started — the table reloads every 30 seconds.');
              }}
            >
              {autoRefresh ? <Pause className="w-3.5 h-3.5 mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh (30 s)'}
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast(`${alertsRead ? 0 : SECURITY_ALERTS.length} security alert(s) open.`)}>
              <Bell className="w-3.5 h-3.5 mr-1.5" /> Alerts
            </Button>
            <Badge variant="warning">{alertsRead ? 0 : SECURITY_ALERTS.length} unread security alerts</Badge>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] text-indigo-900">
          <Lock className="w-3.5 h-3.5" />
          <span>
            <strong>Immutable records.</strong> There is no edit and no delete button on this page — not even for the Super
            Admin. Logs are permanent, read-only and backed up nightly.
          </span>
        </div>
        {autoRefresh && (
          <div className="mt-2 text-[11px] text-emerald-700">
            🟢 Real-time refresh active — table reloads every 30 seconds
            {lastRefresh ? ` · last refresh ${lastRefresh.toLocaleTimeString('en-IN')}` : ''}
          </div>
        )}
      </div>

      {/* ─────────────────────────────── filters */}
      <div className={panel}>
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-gray-900">Filters &amp; Search</h2>
          <span className="text-[11px] text-gray-500">Every filter works together — combine as many as you need</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as LogCategory | 'All')} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].icon} {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Module</label>
              <select value={module} onChange={(e) => setModule(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All Modules</option>
                {MODULE_OPTIONS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Action</label>
              <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All Actions</option>
                {ACTION_OPTIONS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as LogStatus | 'All')} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">User (name or employee ID)</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. Meenal Joshi or EMP-2077"
                  className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Branch</label>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All Branches</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">IP Address</label>
              <input
                value={ipQuery}
                onChange={(e) => setIpQuery(e.target.value)}
                placeholder="e.g. 10.0.4 or 45.116.208.19"
                className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Search by Log ID (or keyword)</label>
              <input
                value={logIdQuery}
                onChange={(e) => setLogIdQuery(e.target.value)}
                placeholder="e.g. LOG-2025-09-28-MRK-5821"
                className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">From Date</label>
              <input
                type="date"
                value={fromDate}
                disabled={datePreset !== 'Custom'}
                onChange={(e) => setFromDate(e.target.value)}
                className={`w-full p-1.5 border border-gray-300 rounded-md text-xs ${datePreset !== 'Custom' ? 'opacity-50' : ''}`}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">To Date</label>
              <input
                type="date"
                value={toDate}
                disabled={datePreset !== 'Custom'}
                onChange={(e) => setToDate(e.target.value)}
                className={`w-full p-1.5 border border-gray-300 rounded-md text-xs ${datePreset !== 'Custom' ? 'opacity-50' : ''}`}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Date Range Presets</label>
              <div className="flex flex-wrap gap-1">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'Custom'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setDatePreset(p)}
                    className={`px-2 py-1.5 rounded-md border text-[11px] ${
                      datePreset === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold' : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => showToast(`Filters applied — ${filtered.length} of ${SEED_LOGS.length} entries shown.`)}>
              <Filter className="w-3.5 h-3.5 mr-1.5" /> Apply Filters
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={resetFilters}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
            <span className="text-[11px] text-gray-500 ml-1">
              Showing <strong>{filtered.length}</strong> of {SEED_LOGS.length} entries
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-gray-600">Export Logs:</span>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => exportLogs('CSV')}>
                <FileText className="w-3.5 h-3.5 mr-1.5" /> CSV
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => exportLogs('Excel')}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => exportLogs('PDF')}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> PDF
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* ─────────────────────────────── security alerts */}
      <div className={panel}>
        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-gray-900">Security Alerts</h2>
          <span className="text-[11px] text-gray-500">Recent critical security events — investigate first</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setAlertsRead(true)}>
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setCategory('Security');
                setTab(TABS[1]);
                setPage(1);
                showToast('Filtered to Security & Access logs.');
              }}
            >
              View All Security Logs
            </Button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {SECURITY_ALERTS.map((a) => (
            <div key={a.id} className="px-5 py-3 flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {a.title}{' '}
                    <Badge variant={a.severity === 'Critical' ? 'danger' : a.severity === 'High' ? 'warning' : 'info'}>{a.severity}</Badge>
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">{a.detail}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {a.user} · IP {a.ip} · {a.when} · {a.id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => {
                    const match = SEED_LOGS.find((l) => l.category === 'Security' && l.status !== 'success');
                    if (match) {
                      setDetail(match);
                      showToast('Opened the related log entry.');
                    }
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" /> Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────── tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────── log table */}
      {tab !== TABS[6] && tab !== TABS[7] && (
        <div className={panel}>
          <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
            <ScrollText className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Log Entries</h2>
            <span className="text-[11px] text-gray-500">
              {filtered.length} record(s) · newest first · click any row for the full WHO / WHAT / BEFORE → AFTER detail
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="log-table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={th}>Log ID</th>
                  <th className={th}>Date &amp; Time</th>
                  <th className={th}>Category</th>
                  <th className={th}>Action</th>
                  <th className={th}>Module / Page</th>
                  <th className={th}>What Happened</th>
                  <th className={th}>Performed By</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((l) => {
                  const SIcon = STATUS_ICON[l.status];
                  return (
                    <tr key={l.id} className="hover:bg-indigo-50/20 cursor-pointer" onClick={() => setDetail(l)}>
                      <td className="p-3 font-mono text-[10px] text-indigo-700 whitespace-nowrap">
                        {l.id}
                        {l.highPriority && (
                          <span className="ml-1 text-[9px] font-semibold text-rose-600" title="High priority for audit">
                            ●
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600 whitespace-nowrap">{l.createdAt}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-gray-800">
                          {CATEGORY_META[l.category].icon} {l.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{l.action}</Badge>
                      </td>
                      <td className="p-3 text-gray-700 whitespace-nowrap">
                        {l.module}
                        <div className="text-[10px] text-gray-500">{l.page}</div>
                      </td>
                      <td className="p-3 text-gray-700 max-w-md">
                        {l.description}
                        <div className="text-[10px] font-mono text-gray-400">{l.type}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-gray-800 font-medium">{l.userName}</div>
                        <div className="text-[10px] text-gray-500">
                          {l.userRole} · {l.userEmpId}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${STATUS_STYLE[l.status]}`}>
                          <SIcon className="w-3 h-3" /> {l.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px]"
                          onClick={(e) => {
                            (e as React.MouseEvent).stopPropagation();
                            setDetail(l);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500">
                      No log entries match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
            <span>
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                <ChevronLeft className="w-3 h-3 mr-1" /> Prev
              </Button>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                Next <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-[10px] text-gray-400 flex flex-wrap items-center gap-3">
            <span>🔒 Read-only · no edit action · no delete action</span>
            <span>● = flagged high priority for audit (reprints, bulk exports, sensitive reads, permission changes)</span>
            <span>Retention is enforced per category — see the Retention &amp; Priority tab</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────── event catalog */}
      {tab === TABS[6] && (
        <div className={panel}>
          <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Event Catalog — every event key the system captures</h2>
            <span className="text-[11px] text-gray-500">{ALL_EVENTS.length} event keys across {EVENT_CATALOG.length} categories</span>
            <div className="ml-auto relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                placeholder="Search events e.g. marks_edited"
                className="pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-xs w-64"
              />
            </div>
          </div>
          <div className="p-5 space-y-5">
            {catalog.map((c) => (
              <div key={c.category} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    {CATEGORY_META[c.category].icon} {c.category}
                  </span>
                  <Badge variant={CATEGORY_META[c.category].priority === 'Critical' ? 'danger' : CATEGORY_META[c.category].priority === 'High' ? 'warning' : 'info'}>
                    {CATEGORY_META[c.category].priority}
                  </Badge>
                  <span className="text-[10px] text-gray-500">Retention: {CATEGORY_META[c.category].retention}</span>
                  <span className="text-[11px] text-gray-600 ml-auto">
                    {c.events.length} event key(s) · {CATEGORY_META[c.category].note}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {c.events.map((e) => (
                    <div key={e.key} className="px-4 py-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <code className="text-[11px] font-mono text-indigo-700 w-60 shrink-0">{e.key}</code>
                      <span className="text-[11px] text-gray-700 flex-1">{e.label}</span>
                      <span className="text-[10px] font-semibold text-gray-500 w-16 shrink-0">{e.action}</span>
                      <span className="text-[10px] text-gray-500 w-28 shrink-0">{e.module}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {catalog.length === 0 && <p className="p-6 text-center text-xs text-gray-500">No event key matches “{catalogQuery}”.</p>}
          </div>
        </div>
      )}

      {/* ─────────────────────────────── retention & priority */}
      {tab === TABS[7] && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className={panel}>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-gray-900">Log Retention Policy</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse" data-testid="retention-table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={th}>Category</th>
                      <th className={th}>Minimum Retention</th>
                      <th className={th}>Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {RETENTION_POLICY.map((r) => (
                      <tr key={r.category}>
                        <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">
                          {typeof r.category === 'string' && r.category in CATEGORY_META ? CATEGORY_META[r.category as LogCategory].icon : '•'} {r.category}
                        </td>
                        <td className="p-3">
                          <Badge variant="primary">{r.years}</Badge>
                        </td>
                        <td className="p-3 text-gray-600">{r.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600">
                <p>• Logs are <strong>never permanently deleted</strong>. After the retention period they are moved to cold / archive storage.</p>
                <p>• Communication logs are not yet covered by a retention rule — they currently follow the System &amp; Configuration rule (3 years) until a policy is set in Archive Settings &amp; Rules.</p>
                <p>• Retention changes are themselves logged as <code className="font-mono">retention_policy_changed</code>.</p>
              </div>
            </div>

            <div className={panel}>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-gray-900">Priority Levels</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse" data-testid="priority-table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={th}>Category</th>
                      <th className={th}>Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PRIORITY_TABLE.map((p) => (
                      <tr key={p.area}>
                        <td className="p-3 text-gray-800">{p.area}</td>
                        <td className="p-3">
                          <Badge variant={p.priority === 'Critical' ? 'danger' : p.priority === 'High' ? 'warning' : 'info'}>{p.priority}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-600">
                Critical categories raise an immediate alert to the Super Admin; High and Medium categories appear in the daily digest.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className={panel}>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-gray-900">What Is Never Logged</h2>
                <span className="text-[11px] text-gray-500">Under no circumstances is any of this stored in a log entry</span>
              </div>
              <ul className="p-5 space-y-2 text-xs text-gray-700">
                {NEVER_LOGGED.map((n) => (
                  <li key={n} className="flex items-start gap-2">
                    <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={panel}>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-gray-900">How Sensitive Fields Are Stored</h2>
                <span className="text-[11px] text-gray-500">Masking applied before the entry is written</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={th}>Field</th>
                      <th className={th}>What the log actually stores</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MASKED_FIELD_EXAMPLES.map((m) => (
                      <tr key={m.field}>
                        <td className="p-3 font-mono text-[11px] text-gray-800">{m.field}</td>
                        <td className="p-3 text-gray-600">{m.stored}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-600">
                Sensitive reads are still logged in full — e.g. <code className="font-mono">student_medical_viewed</code> records who opened
                the medical record, when and from where, but never the record content itself.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────── row detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDetail(null)} />
          <div className="relative h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700">{detail.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${STATUS_STYLE[detail.status]}`}>
                      {detail.status}
                    </span>
                    {detail.highPriority && <Badge variant="danger">High priority</Badge>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{detail.description}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {CATEGORY_META[detail.category].icon} {detail.category} · {detail.action} · {detail.module} / {detail.page}
                  </p>
                </div>
                <button onClick={() => setDetail(null)} className="p-1.5 text-gray-400 hover:text-gray-700" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* WHO */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">👤 WHO — performed the action</p>
                <p className="text-gray-700">User: <strong>{detail.userName}</strong></p>
                <p className="text-gray-700">Role at the time: <strong>{detail.userRole}</strong></p>
                <p className="text-gray-700">Employee ID: <strong>{detail.userEmpId}</strong></p>
                <p className="text-gray-700">User ID: <strong>USR-{detail.userId}</strong></p>
                <p className="text-[11px] text-gray-500">
                  Name, role and employee ID are snapshots taken at the moment of the action — they stay correct even if the user is
                  later renamed, moved or deleted.
                </p>
              </div>

              {/* WHEN */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">🕒 WHEN</p>
                <p className="text-gray-700">Timestamp (local): <strong>{detail.createdAt}</strong></p>
                <p className="text-gray-700">Academic Year: <strong>{detail.academicYear}</strong></p>
                <p className="text-gray-700">Stored in UTC internally, displayed in the school timezone (Asia/Kolkata)</p>
              </div>

              {/* WHAT */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">📌 WHAT — action &amp; affected record</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-gray-700">
                  <p>Action: <strong>{detail.action}</strong></p>
                  <p>Event type: <strong className="font-mono text-[11px]">{detail.type}</strong></p>
                  <p>Module: <strong>{detail.module}</strong></p>
                  <p>Page: <strong>{detail.page}</strong></p>
                  <p>Entity type: <strong>{detail.entityType || '—'}</strong></p>
                  <p>Entity ID: <strong className="font-mono">{detail.entityId || '—'}</strong></p>
                  <p className="md:col-span-2">Entity label: <strong>{detail.entityLabel || '—'}</strong></p>
                </div>
              </div>

              {/* BEFORE → AFTER */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">🔁 BEFORE → AFTER — what actually changed</p>
                {buildDiff(detail).length === 0 ? (
                  <p className="text-[11px] text-gray-500">
                    No field-level change captured — this is a read / login / system event, so only the access itself is recorded.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse" data-testid="diff-table">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-2 font-semibold text-gray-600 uppercase tracking-wider">Field</th>
                          <th className="p-2 font-semibold text-gray-600 uppercase tracking-wider">Old value</th>
                          <th className="p-2 font-semibold text-gray-600 uppercase tracking-wider">New value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {buildDiff(detail).map((d) => (
                          <tr key={d.field} className={d.changed ? 'bg-amber-50/50' : ''}>
                            <td className="p-2 font-mono text-[10px] text-gray-700">{d.field}</td>
                            <td className="p-2 text-gray-600 break-all">{d.before}</td>
                            <td className={`p-2 break-all ${d.changed ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{d.after}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-[10px] text-gray-400">
                  Old and new values are JSON snapshots taken at write time. Sensitive fields are pre-masked — see Retention &amp; Priority ▸
                  “How sensitive fields are stored”.
                </p>
              </div>

              {/* STATUS */}
              <div className={`rounded-lg border p-3 space-y-1.5 ${STATUS_STYLE[detail.status]}`}>
                <p className="font-bold text-[11px] uppercase">⚑ {detail.status}</p>
                {detail.failureReason ? (
                  <p className="text-[11px]">Failure reason: {detail.failureReason}</p>
                ) : (
                  <p className="text-[11px]">Completed without error.</p>
                )}
              </div>

              {/* WHERE & HOW */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">🌐 WHERE &amp; HOW</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-gray-700">
                  <p>IP address: <strong className="font-mono">{detail.ip}</strong></p>
                  <p>Device: <strong>{detail.device}</strong></p>
                  <p>Browser: <strong>{detail.browser}</strong></p>
                  <p>Operating system: <strong>{detail.os}</strong></p>
                  <p>Session ID: <strong className="font-mono text-[11px]">{detail.sessionId}</strong></p>
                  <p>Request ID: <strong className="font-mono text-[11px]">{detail.requestId}</strong></p>
                </div>
              </div>

              {/* CONTEXT */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">🏫 CONTEXT</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-gray-700">
                  <p>Branch: <strong>{detail.branch}</strong></p>
                  <p>Class: <strong>{detail.classId || '—'}</strong></p>
                  <p>Division: <strong>{detail.divisionId || '—'}</strong></p>
                </div>
                <p className="text-[11px] text-gray-500">Category priority: <strong>{CATEGORY_META[detail.category].priority}</strong> · Retention: <strong>{CATEGORY_META[detail.category].retention}</strong></p>
              </div>

              {/* actions — deliberately no edit / delete */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast(`Opening the affected record ${detail.entityId || detail.entityLabel || ''}…`)}>
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Original Record
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => viewUserActivity(detail)}>
                  <UserCog className="w-3.5 h-3.5 mr-1.5" /> View User Activity
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => copyId(detail.id)}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Log ID
                </Button>
                <Button variant="ghost" size="sm" className="text-xs ml-auto" onClick={() => setDetail(null)}>
                  <X className="w-3.5 h-3.5 mr-1.5" /> Close
                </Button>
              </div>
              <p className="text-[10px] text-gray-400">
                This record is immutable — there is no edit button and no delete button, on this and every other log entry.
              </p>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default LogViewerAuditExport;
