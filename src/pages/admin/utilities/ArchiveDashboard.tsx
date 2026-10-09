// ArchiveDashboard.tsx — Archive Management ▸ Dashboard (Page 1)
// Storage health KPIs, alerts & pending actions, distribution chart, activity feed,
// module-wise tier breakdown, active retrievals, upcoming jobs and the 12-month trend.
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Archive,
  Database,
  HardDrive,
  TrendingUp,
  Gauge,
  Server,
  Cloudy,
  DownloadCloud,
  AlertTriangle,
  Activity,
  Layers,
  Clock,
  CalendarClock,
  RefreshCw,
  FileDown,
  Settings,
  Bell,
  Eye,
  RotateCcw,
  Snowflake,
  Trash2,
  ChevronRight,
  LineChart as LineChartIcon
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, gb, Donut, TrendChart, TH, ProgressBar } from './archiveUi';

/* ------------------------------------------------------------------ data */

interface AlertRow {
  id: string;
  level: 'Critical' | 'Warning' | 'Info';
  icon: string;
  title: string;
  detail: string;
  actions: string[];
}

const ALERTS: AlertRow[] = [
  {
    id: 'a1',
    level: 'Critical',
    icon: '🔴',
    title: 'Archive job FAILED last night — Finance/GL module',
    detail: 'Nightly job failed at 02:14 AM — retry needed',
    actions: ['View Details', 'Retry Now']
  },
  {
    id: 'a2',
    level: 'Warning',
    icon: '🟡',
    title: 'Primary DB approaching size limit (85% of 50 GB)',
    detail: 'Consider archiving older data sooner',
    actions: ['View Modules', 'Adjust Rules']
  },
  {
    id: 'a3',
    level: 'Warning',
    icon: '🟡',
    title: '3 modules have data eligible for cold push',
    detail: 'Attendance (2 yrs), Audit Logs (2 yrs), Notification (1 yr)',
    actions: ['Push to Cold', 'View Details']
  },
  {
    id: 'a4',
    level: 'Info',
    icon: '🔵',
    title: 'Retrieval RETR-2025-001 expires in 4 hours',
    detail: 'FY 2019-20 GL data will be removed from ERP soon',
    actions: ['Export Now', 'Extend 24hrs']
  },
  {
    id: 'a5',
    level: 'Info',
    icon: '🔵',
    title: '2 files in cold storage eligible for deletion',
    detail: 'FY 2016-17 data — 8 year retention met',
    actions: ['Review', 'View Files']
  }
];

interface ModuleSizeRow {
  id: string;
  module: string;
  icon: string;
  primary: number;
  archive: number;
  cold: number;
  health: 'healthy' | 'growing' | 'action' | 'monitor' | 'cleanup';
  note: string;
}

const MODULE_SIZES: ModuleSizeRow[] = [
  { id: 'm1', module: 'Finance / GL', icon: '💰', primary: 1.8, archive: 5.2, cold: 8.5, health: 'healthy', note: 'Healthy' },
  { id: 'm2', module: 'Fee Module', icon: '💸', primary: 2.1, archive: 3.1, cold: 5.2, health: 'growing', note: 'Growing' },
  { id: 'm3', module: 'Payroll', icon: '👩‍🏫', primary: 0.6, archive: 2.5, cold: 4.1, health: 'healthy', note: 'Healthy' },
  { id: 'm4', module: 'Attendance', icon: '🕐', primary: 1.2, archive: 4.8, cold: 7.3, health: 'healthy', note: 'Healthy' },
  { id: 'm5', module: 'Examination', icon: '📝', primary: 0.8, archive: 3.5, cold: 6.2, health: 'healthy', note: 'Healthy' },
  { id: 'm6', module: 'Documents (Photos/PDFs)', icon: '📷', primary: 2.5, archive: 6.8, cold: 5.5, health: 'action', note: 'Needs Archiving!' },
  { id: 'm7', module: 'Audit Logs', icon: '📋', primary: 1.8, archive: 3.5, cold: 2.8, health: 'monitor', note: 'Monitor' },
  { id: 'm8', module: 'Notifications', icon: '📱', primary: 0.5, archive: 1.5, cold: 0.0, health: 'healthy', note: 'Healthy' },
  { id: 'm9', module: 'System Logs', icon: '🔔', primary: 0.7, archive: 1.4, cold: 0.1, health: 'cleanup', note: 'Cleanup' },
  { id: 'm10', module: 'Scholarship', icon: '🎓', primary: 0.3, archive: 0.8, cold: 0.5, health: 'healthy', note: 'Healthy' }
];

const ACTIVITY = [
  { time: 'Today, 02:05 AM', ok: true, title: 'Finance/GL archive job — 12,450 records moved to archive', note: '245 MB freed', failed: false },
  { time: 'Today, 02:35 AM', ok: false, title: 'FAILED: Fee module archive job', note: 'Error: Disk space timeout on archive server', failed: true },
  { time: 'Yesterday, 03:45 AM', ok: true, title: 'Cold push job — 8 files pushed', note: '850 MB → 212 MB (compressed, 75% smaller)', failed: false },
  { time: '26-Sep-2025, 09:15 AM', ok: true, title: 'Retrieval RETR-2025-001 completed', note: 'FY 2019-20 GL data — 3 files — 4.2 hrs · Retrieved by: Finance Manager', failed: false }
];

const UPCOMING_JOBS = [
  { time: 'Tonight 02:00 AM', icon: '🔄', title: 'Nightly Archive Job', detail: 'Modules: All eligible modules · Estimated records: ~15,000' },
  { time: 'Tonight 03:00 AM', icon: '❄️', title: 'Cold Storage Push Job', detail: 'Modules: Attendance FY 2020-21 · Files to push: 3 files (~250 MB)' },
  { time: 'Sunday 01:00 AM', icon: '🗑️', title: 'Cleanup Job (Logs/Temp)', detail: 'System logs > 30 days, Temp files · Estimated cleanup: ~450 MB' }
];

const TREND_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const TREND_PRIMARY = [14, 13.4, 13.1, 12.9, 12.7, 12.6, 12.5, 12.5, 12.4, 12.4, 12.3, 12.3];
const TREND_ARCHIVE = [22, 24, 26, 28, 29.5, 31, 32, 33, 33.8, 34.4, 34.9, 35.2];
const TREND_COLD = [8, 12, 16, 20, 24, 28, 31, 34, 36, 38, 39.2, 40];
const TREND_TOTAL = TREND_LABELS.map((_, i) => +(TREND_PRIMARY[i] + TREND_ARCHIVE[i] + TREND_COLD[i]).toFixed(1));

const HEALTH_TONE: Record<ModuleSizeRow['health'], { pill: 'green' | 'amber' | 'rose' | 'blue'; dot: string }> = {
  healthy: { pill: 'green', dot: '🟢' },
  growing: { pill: 'amber', dot: '🟡' },
  action: { pill: 'rose', dot: '🔴' },
  monitor: { pill: 'amber', dot: '🟡' },
  cleanup: { pill: 'amber', dot: '🟡' }
};

/* ---------------------------------------------------------------- page */

export function ArchiveDashboard() {
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [periodFilter, setPeriodFilter] = useState('This Year');
  const [searchModule, setSearchModule] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [alerts, setAlerts] = useState(ALERTS);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const modules = MODULE_SIZES.filter(
    (m) => !searchModule || m.module.toLowerCase().includes(searchModule.toLowerCase())
  );
  const totals = MODULE_SIZES.reduce(
    (acc, m) => ({
      primary: acc.primary + m.primary,
      archive: acc.archive + m.archive,
      cold: acc.cold + m.cold
    }),
    { primary: 0, archive: 0, cold: 0 }
  );

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={Archive}
        title="Archive Dashboard"
        screen="Dashboard"
        restricted="RESTRICTED ACCESS — Super Admin & Finance Manager only"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => showToast('Dashboard metrics refreshed from the archive service.')}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => showToast('Dashboard report exported as PDF (management copy).')}
            >
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Dashboard Report
            </Button>
            <Button
              size="sm"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => showToast('Opening Archive Settings & Rules…')}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" /> Archive Settings
            </Button>
          </>
        }
      />

      {/* SECTION 2 — storage health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        <KpiCard
          icon={HardDrive}
          label="Total Storage Used"
          value={gb(87.5)}
          progress={{ used: 87.5, total: 200, color: 'bg-indigo-500' }}
          progressLabel="43% Used"
        />
        <KpiCard
          icon={Database}
          label="Primary DB Size"
          value={gb(12.3)}
          progress={{ used: 12.3, total: 50, color: 'bg-rose-500' }}
          progressLabel="25% Used"
        />
        <KpiCard
          icon={Server}
          label="Archive DB Size"
          value={gb(35.2)}
          progress={{ used: 35.2, total: 100, color: 'bg-amber-500' }}
          progressLabel="35% Used"
          badge={<Pill tone="green">🟢 Good</Pill>}
        />
        <KpiCard
          icon={Cloudy}
          label="Cold Storage Size"
          value={gb(40)}
          progress={{ used: 40, total: 100, color: 'bg-sky-500' }}
          progressLabel="40% Used"
          badge={<Pill tone="green">🟢 Good</Pill>}
        />
        <KpiCard
          icon={TrendingUp}
          label="Growth This Month"
          value="+1.2 GB"
          sub={<span className="text-emerald-700 font-medium">🔼 Normal Growth</span>}
        />
        <KpiCard
          icon={Gauge}
          label="Storage Health Score"
          value="92 / 100"
          tone="text-emerald-700"
          sub={<span className="text-emerald-700 font-medium">🟢 Excellent</span>}
        />
      </div>

      {/* SECTION 3 — alerts */}
      <Panel
        icon={AlertTriangle}
        title="Alerts & Pending Actions"
        subtitle={`${alerts.length} open item(s) — nightly jobs, thresholds, retrievals and retention`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setAlerts([]);
              showToast('All archive alerts marked as read.');
            }}
          >
            Mark All Read
          </Button>
        }
      >
        <div className="divide-y divide-gray-100">
          {alerts.map((a) => (
            <div key={a.id} className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-3">
              <div className="flex-1 flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">{a.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{a.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{a.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:w-[260px] shrink-0">
                <Badge
                  variant={a.level === 'Critical' ? 'danger' : a.level === 'Warning' ? 'warning' : 'info'}
                  className="whitespace-nowrap"
                >
                  {a.level}
                </Badge>
                <div className="flex flex-wrap gap-1.5">
                  {a.actions.map((act) =>
                    act === 'Retry Now' ? (
                      <Button
                        key={act}
                        size="sm"
                        className="text-[11px] h-7 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => {
                          setAlerts((prev) => prev.filter((x) => x.id !== a.id));
                          showToast('Archive job queued for retry — you will be notified on completion.');
                        }}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> {act}
                      </Button>
                    ) : (
                      <Button
                        key={act}
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={() => showToast(`${act} — opening the related archive screen.`)}
                      >
                        {act}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-gray-500">
              🎉 No pending actions — the archive system is healthy.
            </p>
          )}
        </div>
      </Panel>

      {/* SECTION 4 & 5 — distribution + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel icon={Layers} title="Storage Distribution" subtitle="Where the 87.5 GB currently lives">
          <div className="p-5 space-y-5">
            <Donut
              segments={[
                { label: '🔥 Primary DB', value: 12.3, color: '#f43f5e' },
                { label: '🌡️ Archive DB', value: 35.2, color: '#f59e0b' },
                { label: '❄️ Cold Storage', value: 40.0, color: '#0ea5e9' }
              ]}
            />
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                  <span>Primary</span>
                  <span>12.3 / 50 GB</span>
                </div>
                <ProgressBar value={12.3} max={50} color="bg-rose-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                  <span>Archive</span>
                  <span>35.2 / 100 GB</span>
                </div>
                <ProgressBar value={35.2} max={100} color="bg-amber-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                  <span>Cold</span>
                  <span>40.0 / 100 GB</span>
                </div>
                <ProgressBar value={40} max={100} color="bg-sky-500" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => showToast('Detailed breakdown opens in the Data Tier Browser.')}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> View Detailed Breakdown
            </Button>
          </div>
        </Panel>

        <Panel icon={Activity} title="Recent Archive Activity Feed" subtitle="Newest first — jobs, cold pushes and retrievals">
          <div className="p-5 space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">{a.ok ? '✅' : '❌'}</span>
                <div className="flex-1 border-b border-dashed border-gray-100 pb-3">
                  <p className="text-[11px] text-gray-400">{a.time}</p>
                  <p className="text-xs font-semibold text-gray-900 mt-0.5">{a.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{a.note}</p>
                  {a.failed && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] text-indigo-700 border-indigo-200"
                        onClick={() => showToast('Fee module archive job queued for retry.')}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Retry
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px]"
                        onClick={() => showToast('Alert email sent to the archive administrator.')}
                      >
                        <Bell className="w-3 h-3 mr-1" /> Alert Admin
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="text-xs w-full" onClick={() => showToast('Opening the full activity log…')}>
              <ChevronRight className="w-3.5 h-3.5 mr-1" /> View Full Activity Log
            </Button>
          </div>
        </Panel>
      </div>

      {/* SECTION 6 — module-wise breakdown */}
      <Panel
        icon={Layers}
        title="Module-wise Data Size & Tier Breakdown"
        subtitle="Where each module's data currently sits, and what needs attention"
        actions={
          <>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"
            >
              <option>All Modules</option>
              {MODULE_SIZES.map((m) => (
                <option key={m.id}>{m.module}</option>
              ))}
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"
            >
              <option>This Year</option>
              <option>Last 2 Years</option>
              <option>All Time</option>
            </select>
            <input
              value={searchModule}
              onChange={(e) => setSearchModule(e.target.value)}
              placeholder="Search module"
              className="py-1.5 px-2 border border-gray-300 rounded-md text-xs w-40"
            />
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={TH}>Module</th>
                <th className={TH}>🔥 Primary DB Size</th>
                <th className={TH}>🌡️ Archive DB Size</th>
                <th className={TH}>❄️ Cold Storage</th>
                <th className={TH}>Total Size</th>
                <th className={TH}>Status &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-indigo-50/20">
                  <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">
                    {m.icon} {m.module}
                  </td>
                  <td className="p-3 text-gray-700">
                    {gb(m.primary)} {HEALTH_TONE[m.health].dot}
                  </td>
                  <td className="p-3 text-gray-700">{gb(m.archive)}</td>
                  <td className="p-3 text-gray-700">{gb(m.cold)}</td>
                  <td className="p-3 font-semibold text-gray-900">{gb(m.primary + m.archive + m.cold)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone={HEALTH_TONE[m.health].pill}>{m.note}</Pill>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => showToast(`${m.module}: archive / cold-push / retrieve actions opened.`)}
                      >
                        <Settings className="w-3 h-3 mr-1" /> Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold text-gray-900">
                <td className="p-3">TOTALS</td>
                <td className="p-3">{gb(totals.primary)}</td>
                <td className="p-3">{gb(totals.archive)}</td>
                <td className="p-3">{gb(totals.cold)}</td>
                <td className="p-3">{gb(totals.primary + totals.archive + totals.cold)}</td>
                <td className="p-3" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-600">
          <p>🟢 Good — Within recommended size for this module</p>
          <p>🟡 Monitor — Approaching recommended size limit</p>
          <p>🔴 Action Required — Exceeds recommended size — archive now!</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => showToast('Archiving all red modules — job queued after approval.')}
            >
              ✅ Archive All Red Modules
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] text-sky-700 border-sky-200"
              onClick={() => showToast('Cold push queued for all eligible modules.')}
            >
              <Snowflake className="w-3 h-3 mr-1" /> Cold Push All Eligible
            </Button>
          </div>
        </div>
      </Panel>

      {/* SECTION 7 & 8 — retrievals + upcoming jobs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel icon={Clock} title="Active Retrievals" subtitle="Data temporarily restored from cold storage">
          <div className="p-5 space-y-4">
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-800">RETR-2025-001</span>
                <Pill tone="amber">⏳ In Progress</Pill>
              </div>
              <p className="text-xs text-gray-700">FY 2019-20 GL Data (3 files)</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <span>Requested by: Finance Manager</span>
                <span>Speed: Standard (3-5 hours)</span>
              </div>
              <ProgressBar value={75} max={100} color="bg-indigo-500" label="Progress: 75%" />
              <p className="text-[11px] text-amber-700 font-medium">Expires in: 71 hrs 23 min</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast('Opening retrieved GL data…')}>
                  <Eye className="w-3 h-3 mr-1" /> View Data
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast('Exporting retrieved data…')}>
                  <FileDown className="w-3 h-3 mr-1" /> Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] text-rose-700 border-rose-200"
                  onClick={() => showToast('Retrieval cancelled — temp tables will be cleaned.')}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Cancel
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">No other active retrievals</p>
            <Button variant="outline" size="sm" className="text-xs w-full" onClick={() => showToast('New retrieval request form opened.')}>
              <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> New Retrieval Request
            </Button>
          </div>
        </Panel>

        <Panel icon={CalendarClock} title="Upcoming Jobs" subtitle="What the scheduler will run next">
          <div className="divide-y divide-gray-100">
            {UPCOMING_JOBS.map((j) => (
              <div key={j.title} className="px-5 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-700">{j.time}</span>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast(`${j.title} paused.`)}>
                      ⏸️ Pause
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast(`${j.title} configuration opened.`)}>
                      <Settings className="w-3 h-3 mr-1" /> Configure
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-900">
                  {j.icon} {j.title}
                </p>
                <p className="text-[11px] text-gray-500">{j.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* SECTION 9 — growth trend */}
      <Panel
        icon={LineChartIcon}
        title="Storage Growth Trend — Last 12 Months"
        subtitle="Primary stayed flat while archive and cold tiers absorbed the growth"
        actions={
          <>
            <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>All Tiers</option>
              <option>Primary only</option>
              <option>Archive only</option>
              <option>Cold only</option>
            </select>
            <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 24 Months</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Growth chart exported as PNG.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Chart
            </Button>
          </>
        }
      >
        <div className="p-5 space-y-3">
          <TrendChart
            labels={TREND_LABELS}
            min={0}
            max={95}
            series={[
              { name: 'Total', color: '#4f46e5', values: TREND_TOTAL, dashed: true },
              { name: 'Cold', color: '#0ea5e9', values: TREND_COLD },
              { name: 'Archive', color: '#f59e0b', values: TREND_ARCHIVE },
              { name: 'Primary', color: '#f43f5e', values: TREND_PRIMARY }
            ]}
          />
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-800 space-y-1">
            <p>📌 KEY INSIGHT: Primary DB stayed flat (good!) — Archive &amp; Cold grew as expected</p>
            <p>📌 Without archiving: Total would be 185 GB by now — Archiving saved 97.5 GB!</p>
          </div>
        </div>
      </Panel>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ArchiveDashboard;
