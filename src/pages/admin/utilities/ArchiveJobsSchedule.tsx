// ArchiveJobsSchedule.tsx — Archive Management ▸ Archive Jobs & Schedule (Page 3)
// Job KPIs, tabs, active/scheduled jobs table, 30-day history and the manual archive trigger.
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Database,
  Plus,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Mail,
  Eye,
  FileDown,
  AlertTriangle
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH } from './archiveUi';
import { downloadCsv } from './archiveWorkflowState';

interface JobRow {
  id: string;
  icon: string;
  name: string;
  detail: string;
  type: 'Nightly' | 'Monthly' | 'Weekly' | 'Daily' | 'Annual';
  kind: 'Archive' | 'Cold Push' | 'Cleanup' | 'Backup';
  schedule: string;
  cadence: string;
  status: 'Active' | 'FAILED' | 'Paused' | 'Scheduled';
  statusNote?: string;
}

const JOBS: JobRow[] = [
  { id: 'j1', icon: '🔄', name: 'Finance/GL Archive', detail: 'All GL/JE older than 2yr', type: 'Nightly', kind: 'Archive', schedule: 'Daily 2:00 AM', cadence: 'Every night', status: 'Active' },
  { id: 'j2', icon: '🔄', name: 'Fee Records Archive', detail: 'Fee receipts > 2 years', type: 'Nightly', kind: 'Archive', schedule: 'Daily 2:05 AM', cadence: 'Every night', status: 'FAILED', statusNote: 'Last run FAILED' },
  { id: 'j3', icon: '🔄', name: 'Attendance Archive', detail: 'Daily records > 1 year', type: 'Nightly', kind: 'Archive', schedule: 'Daily 2:15 AM', cadence: 'Every night', status: 'Active' },
  { id: 'j4', icon: '🔄', name: 'Payroll Archive', detail: 'Salary data > 2 years', type: 'Monthly', kind: 'Archive', schedule: '1st Sun 2 AM', cadence: 'Monthly', status: 'Active' },
  { id: 'j5', icon: '❄️', name: 'Cold Storage Push', detail: 'Archive data > 3 years', type: 'Monthly', kind: 'Cold Push', schedule: '1st Sun 3 AM', cadence: 'Monthly', status: 'Active' },
  { id: 'j6', icon: '🗑️', name: 'Notification Log Cleanup', detail: 'Notif. logs > 90 days', type: 'Weekly', kind: 'Cleanup', schedule: 'Sun 1:00 AM', cadence: 'Weekly', status: 'Active' },
  { id: 'j7', icon: '🗑️', name: 'System Log Cleanup', detail: 'System logs > 30 days', type: 'Daily', kind: 'Cleanup', schedule: 'Daily 4:00 AM', cadence: 'Every night', status: 'Active' },
  { id: 'j8', icon: '🗑️', name: 'Temp File Cleanup', detail: 'Temp uploads > 7 days', type: 'Daily', kind: 'Cleanup', schedule: 'Daily 4:30 AM', cadence: 'Every night', status: 'Active' },
  { id: 'j9', icon: '💾', name: 'Full Database Backup', detail: 'Backup primary DB', type: 'Daily', kind: 'Backup', schedule: 'Daily 5:00 AM', cadence: 'Every night', status: 'Active' },
  { id: 'j10', icon: '📅', name: 'Annual Year-End Archive', detail: 'Full FY archiving', type: 'Annual', kind: 'Archive', schedule: 'April 1st', cadence: 'Yearly', status: 'Scheduled', statusNote: 'Next: Apr 2026' }
];

interface JobHistoryRow {
  id: string;
  job: string;
  run: string;
  records: string;
  freed: string;
  status: 'Done' | 'Failed';
  authorizedBy?: string;
  note?: string;
}

const HISTORY: JobHistoryRow[] = [
  { id: 'h1', job: 'Finance/GL Archive', run: '27-Sep 02:05 AM', records: '12,450', freed: '245 MB', status: 'Done' },
  { id: 'h2', job: 'Fee Records Archive', run: '27-Sep 02:05 AM', records: '0', freed: '0 MB', status: 'Failed' },
  { id: 'h3', job: 'Attendance Archive', run: '27-Sep 02:15 AM', records: '8,230', freed: '185 MB', status: 'Done' },
  { id: 'h4', job: 'System Log Cleanup', run: '27-Sep 04:00 AM', records: '125,000', freed: '380 MB', status: 'Done' },
  { id: 'h5', job: 'Temp File Cleanup', run: '27-Sep 04:30 AM', records: '450', freed: '85 MB', status: 'Done' },
  { id: 'h6', job: 'Full DB Backup', run: '27-Sep 05:00 AM', records: 'Primary 16.2 GB', freed: '—', status: 'Done' },
  { id: 'h7', job: 'Cold Storage Push', run: '01-Sep 03:45 AM', records: '25,000', freed: '2.1 GB', status: 'Done' },
  { id: 'h8', job: 'Notification Cleanup', run: '21-Sep 01:30 AM', records: '45,000', freed: '520 MB', status: 'Done' }
];

const TABS = ['📋 All Jobs', '🔄 Nightly Archive', '❄️ Cold Push', '🗑️ Cleanup', '📋 Job History'];
const JOB_SCHEDULE_STORAGE_KEY = 'k12-archive-job-schedule-v1';
const readSavedSchedulerState = (): { jobs: JobRow[]; historyRows: JobHistoryRow[] } => {
  if (typeof window === 'undefined') return { jobs: JOBS, historyRows: HISTORY };
  try {
    const saved = JSON.parse(window.localStorage.getItem(JOB_SCHEDULE_STORAGE_KEY) || 'null');
    const validJobs = Array.isArray(saved?.jobs) && saved.jobs.every((job: any) => job && typeof job.id === 'string' && typeof job.name === 'string' && ['Active', 'FAILED', 'Paused', 'Scheduled'].includes(job.status));
    const validHistory = Array.isArray(saved?.historyRows) && saved.historyRows.every((row: any) => row && typeof row.id === 'string' && typeof row.job === 'string' && ['Done', 'Failed'].includes(row.status));
    return { jobs: validJobs ? saved.jobs as JobRow[] : JOBS, historyRows: validHistory ? saved.historyRows as JobHistoryRow[] : HISTORY };
  } catch { return { jobs: JOBS, historyRows: HISTORY }; }
};

export function ArchiveJobsSchedule() {
  const [initialSchedulerState] = useState(readSavedSchedulerState);
  const [tab, setTab] = useState(TABS[0]);
  const [jobs, setJobs] = useState<JobRow[]>(initialSchedulerState.jobs);
  const [historyRows, setHistoryRows] = useState<JobHistoryRow[]>(initialSchedulerState.historyRows);
  const [detail, setDetail] = useState<JobRow | null>(null);
  const [historyDetail, setHistoryDetail] = useState<JobHistoryRow | null>(null);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [newJobName, setNewJobName] = useState('');
  const [newJobModule, setNewJobModule] = useState('Finance / GL');
  const [newJobKind, setNewJobKind] = useState<JobRow['kind']>('Archive');
  const [newJobType, setNewJobType] = useState<JobRow['type']>('Nightly');
  const [newJobSchedule, setNewJobSchedule] = useState('Daily 2:00 AM');
  const [newJobDetail, setNewJobDetail] = useState('');
  const [configDraft, setConfigDraft] = useState<JobRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // manual trigger
  const [manualModule, setManualModule] = useState('Finance / GL');
  const [manualAction, setManualAction] = useState('Archive to Archive DB');
  const [olderThan, setOlderThan] = useState('2 years');
  const [maxRecords, setMaxRecords] = useState('50,000');
  const [authorizer, setAuthorizer] = useState('Principal');
  // history filters
  const [historyJob, setHistoryJob] = useState('All Jobs');
  const [historyStatus, setHistoryStatus] = useState('All Status');
  useEffect(() => {
    try { window.localStorage.setItem(JOB_SCHEDULE_STORAGE_KEY, JSON.stringify({ jobs, historyRows })); }
    catch { /* scheduler remains usable in memory if storage is blocked */ }
  }, [jobs, historyRows]);
  const allPaused = jobs.some((job) => job.status !== 'Scheduled' && job.status !== 'FAILED') && jobs.filter((job) => job.status !== 'Scheduled' && job.status !== 'FAILED').every((job) => job.status === 'Paused');

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };
  const refreshSchedule = () => {
    const saved = readSavedSchedulerState();
    setJobs(saved.jobs); setHistoryRows(saved.historyRows);
    showToast('Archive jobs and run history reloaded from this browser.');
  };
  const queueFailureAlert = (job: JobRow) => {
    const entry: JobHistoryRow = { id: `h-alert-${Date.now()}`, job: `Alert request — ${job.name}`, run: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }), records: '1 notification request', freed: '—', status: 'Done' };
    setHistoryRows((previous) => [entry, ...previous]);
    showToast('Failure alert request recorded in local history; this preview does not send email.');
  };

  const buildHistoryEntry = (jobName: string, kind: JobRow['kind'], status: JobHistoryRow['status'] = 'Done'): JobHistoryRow => ({
    id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    job: jobName,
    run: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    records: kind === 'Backup' ? 'Snapshot created' : status === 'Done' ? '8,450' : '0',
    freed: kind === 'Backup' || kind === 'Cold Push' ? '—' : status === 'Done' ? '185 MB' : '0 MB',
    status
  });
  const runJobNow = (job: JobRow) => {
    setHistoryRows((previous) => [buildHistoryEntry(job.name, job.kind), ...previous]);
    if (job.status === 'FAILED') setJobs((previous) => previous.map((item) => item.id === job.id ? { ...item, status: 'Active', statusNote: undefined } : item));
    showToast(`${job.name} run recorded in the local job history.`);
  };
  const runAllJobs = () => {
    const eligible = jobs.filter((job) => job.status !== 'Paused' && job.status !== 'Scheduled');
    if (!eligible.length) { showToast('No active jobs are available to run.'); return; }
    setHistoryRows((previous) => [...eligible.map((job) => buildHistoryEntry(job.name, job.kind)), ...previous]);
    setJobs((previous) => previous.map((job) => job.status === 'FAILED' ? { ...job, status: 'Active', statusNote: undefined } : job));
    showToast(`${eligible.length} job run(s) recorded in local job history.`);
  };
  const toggleAllJobs = (pause: boolean) => {
    setJobs((previous) => previous.map((job) => {
      if (job.status === 'Scheduled' || job.status === 'FAILED') return job;
      return { ...job, status: pause ? 'Paused' : 'Active' };
    }));
    showToast(pause ? 'All runnable archive jobs paused.' : 'Runnable archive jobs resumed.');
  };
  const saveNewJob = () => {
    if (!newJobName.trim() || !newJobDetail.trim()) { showToast('Enter a job name and selection criteria.'); return; }
    const created: JobRow = { id: `j-${Date.now()}`, icon: newJobKind === 'Cold Push' ? '❄️' : newJobKind === 'Cleanup' ? '🗑️' : newJobKind === 'Backup' ? '💾' : '🔄', name: newJobName.trim(), detail: `${newJobModule} · ${newJobDetail.trim()}`, type: newJobType, kind: newJobKind, schedule: newJobSchedule, cadence: newJobType, status: 'Active' };
    setJobs((previous) => [created, ...previous]); setJobFormOpen(false); setNewJobName(''); setNewJobDetail('');
    showToast(`${created.name} added to the job list.`);
  };
  const saveJobConfiguration = () => {
    if (!configDraft?.name.trim() || !configDraft.detail.trim()) { showToast('Job name and criteria are required.'); return; }
    setJobs((previous) => previous.map((job) => job.id === configDraft.id ? configDraft : job));
    setConfigDraft(null); showToast('Job configuration saved.');
  };
  const exportRows = (rows: JobHistoryRow[]) => {
    downloadCsv('archive-job-history.csv', ['Job', 'Run Date/Time', 'Records Processed', 'Space Freed', 'Status', 'Authorized By', 'Notes'], rows.map((row) => [row.job, row.run, row.records, row.freed, row.status, row.authorizedBy || '', row.note || '']));
    showToast(`${rows.length} job-history row(s) exported as CSV.`);
  };
  const addManualRun = () => {
    const parsedMax = Number(maxRecords.replace(/,/g, ''));
    if (!Number.isFinite(parsedMax) || parsedMax < 1) { showToast('Enter a valid maximum record count.'); return; }
    const entry = buildHistoryEntry(`${manualModule} · ${manualAction}`, manualAction.includes('Cold') ? 'Cold Push' : manualAction.includes('Cleanup') ? 'Cleanup' : 'Archive');
    setHistoryRows((previous) => [{ ...entry, records: Math.min(parsedMax, 8450).toLocaleString('en-IN'), authorizedBy: authorizer, note: `Older than ${olderThan}; max ${parsedMax.toLocaleString('en-IN')} records.` }, ...previous]);
    showToast(`Manual ${manualAction} recorded for ${manualModule}; authorization by ${authorizer} is captured in the local run detail.`);
  };
  const saveManualAsJob = () => {
    const parsedMax = Number(maxRecords.replace(/,/g, ''));
    if (!Number.isFinite(parsedMax) || parsedMax < 1) { showToast('Enter a valid maximum record count before scheduling.'); return; }
    const created: JobRow = { id: `j-manual-${Date.now()}`, icon: '🔄', name: `${manualModule} ${manualAction}`, detail: `Older than ${olderThan} · up to ${parsedMax.toLocaleString('en-IN')} records`, type: 'Nightly', kind: manualAction.includes('Cold') ? 'Cold Push' : manualAction.includes('Cleanup') ? 'Cleanup' : 'Archive', schedule: 'Daily 2:00 AM', cadence: 'Daily', status: 'Active' };
    setJobs((previous) => [created, ...previous]); showToast(`${created.name} added as a scheduled job.`);
  };

  const tabFiltered = jobs.filter((j) => {
    if (tab === TABS[1]) return j.kind === 'Archive' && j.type === 'Nightly';
    if (tab === TABS[2]) return j.kind === 'Cold Push';
    if (tab === TABS[3]) return j.kind === 'Cleanup';
    return true;
  });

  const history = historyRows.filter(
    (h) =>
      (historyJob === 'All Jobs' || h.job === historyJob) &&
      (historyStatus === 'All Status' || h.status === historyStatus)
  );

  const showHistory = tab === TABS[4];
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const successfulRunsToday = historyRows.filter((row) => {
    const timestamp = Number(row.id.match(/^h-(\d+)-/)?.[1] || 0);
    return timestamp >= startOfToday.getTime() && row.status === 'Done';
  }).length;
  const failedJobsCount = jobs.filter((job) => job.status === 'FAILED').length;
  const freedTodayMB = historyRows.filter((row) => {
    const timestamp = Number(row.id.match(/^h-(\d+)-/)?.[1] || 0);
    return timestamp >= startOfToday.getTime() && row.status === 'Done';
  }).reduce((total, row) => {
    const match = row.freed.match(/([\d.]+)\s*(GB|MB)/i);
    if (!match) return total;
    const amount = Number(match[1]);
    return total + (match[2].toUpperCase() === 'GB' ? amount * 1024 : amount);
  }, 0);
  const nextScheduledJob = jobs.find((job) => job.status === 'Active' && job.type === 'Nightly') || jobs.find((job) => job.status === 'Scheduled');

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={CalendarClock}
        title="Archive Jobs & Schedule"
        screen="Archive Jobs & Schedule"
        restricted="Frontend-only scheduler preview — jobs and run history are saved in this browser; no backend scheduler executes them."
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={refreshSchedule}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => exportRows(historyRows)}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export History
            </Button>
          </>
        }
      />

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={CheckCircle2} label="Jobs Today (Successful)" value={`${successfulRunsToday} Run${successfulRunsToday === 1 ? '' : 's'}`} tone="text-emerald-700" sub="Local run history · today" />
        <KpiCard icon={XCircle} label="Failed Jobs (Need Attention)" value={`${failedJobsCount} Failed`} tone={failedJobsCount ? 'text-rose-700' : 'text-emerald-700'} sub={failedJobsCount ? 'Action needed' : 'All jobs healthy'} />
        <KpiCard icon={Clock} label="Running Now" value="0 Running" sub="Runs are logged immediately in this preview" />
        <KpiCard icon={CalendarDays} label="Next Job Scheduled" value={nextScheduledJob?.schedule || 'No active schedule'} sub={nextScheduledJob?.name || 'Configure a job'} />
        <KpiCard icon={Database} label="Freed Today From Primary" value={`${freedTodayMB.toLocaleString('en-IN')} MB`} tone={freedTodayMB ? 'text-emerald-700' : 'text-gray-700'} sub="Local run-history estimate · no live archive ran" />
      </div>

      {/* SECTION 2 — tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!showHistory && (
        <>
          {/* SECTION 3 — jobs table */}
          <Panel
            icon={CalendarClock}
            title="All Archive Jobs — Schedule & Status"
            subtitle={`${tabFiltered.length} job(s) in this view`}
            actions={
              <>
                <Button size="sm" className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setJobFormOpen(true)}>
                  <Plus className="w-3 h-3 mr-1" /> Add New Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => toggleAllJobs(true)}
                >
                  <Pause className="w-3 h-3 mr-1" /> Pause All Jobs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => toggleAllJobs(false)}
                >
                  <Play className="w-3 h-3 mr-1" /> Resume All
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={runAllJobs}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Run All Now
                </Button>
              </>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" data-testid="jobs-table">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={`${TH} w-12 text-center`}>#</th>
                    <th className={TH}>Job Name</th>
                    <th className={TH}>Type</th>
                    <th className={TH}>Schedule</th>
                    <th className={TH}>Status</th>
                    <th className={`${TH} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tabFiltered.map((j, i) => (
                    <tr key={j.id} className="hover:bg-indigo-50/20">
                      <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">
                          {j.icon} {j.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{j.detail}</div>
                      </td>
                      <td className="p-3 text-gray-700 whitespace-nowrap">
                        {j.type}
                        <div className="text-[10px] text-gray-500">{j.kind}</div>
                      </td>
                      <td className="p-3 text-gray-700 whitespace-nowrap">
                        {j.schedule}
                        <div className="text-[10px] text-gray-500">{j.cadence}</div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            j.status === 'Active' ? 'success' : j.status === 'FAILED' ? 'danger' : j.status === 'Paused' ? 'warning' : 'info'
                          }
                        >
                          {j.status === 'Active' ? '✅ Active' : j.status === 'FAILED' ? '❌ FAILED' : j.status === 'Paused' ? '⏸️ Paused' : '🔵 Scheduled'}
                        </Badge>
                        {j.statusNote && <div className="text-[10px] text-gray-500 mt-1">{j.statusNote}</div>}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <button
                            onClick={() => setDetail(j)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title="View job log"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfigDraft({ ...j })}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Configure"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          {j.status !== 'Scheduled' && (
                            <button
                              onClick={() => {
                                setJobs((prev) =>
                                  prev.map((x) =>
                                    x.id === j.id ? { ...x, status: x.status === 'Paused' ? 'Active' : 'Paused' } : x
                                  )
                                );
                                showToast(`${j.name} ${j.status === 'Paused' ? 'resumed' : 'paused'}.`);
                              }}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                              title={j.status === 'Paused' ? 'Resume' : 'Pause'}
                            >
                              {j.status === 'Paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>
                          )}
                          {j.status === 'FAILED' ? (
                            <>
                              <Button
                                size="sm"
                                className="h-7 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => runJobNow(j)}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" /> Retry
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => queueFailureAlert(j)}>
                                <Mail className="w-3 h-3 mr-1" /> Queue Alert
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => runJobNow(j)}>
                              <Play className="w-3 h-3 mr-1" /> Run Now
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allPaused && (
              <div className="px-5 py-2 border-t border-amber-100 bg-amber-50 text-[11px] text-amber-800">
                ⏸️ All jobs are currently paused — no automated archiving will run until you press “Resume All”.
              </div>
            )}
          </Panel>

          {/* SECTION 4 — history */}
          <Panel
            icon={Clock}
            title="Job History — Last 30 Days"
            subtitle="Every run with records processed and space freed"
            actions={
              <>
                <select value={historyJob} onChange={(e) => setHistoryJob(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>All Jobs</option>
                  {jobs.map((j) => (
                    <option key={j.id}>{j.name}</option>
                  ))}
                </select>
                <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>All Status</option>
                  <option>Done</option>
                  <option>Failed</option>
                </select>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => exportRows(history)}>
                  <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export History
                </Button>
              </>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={`${TH} w-12 text-center`}>#</th>
                    <th className={TH}>Job Name</th>
                    <th className={TH}>Run Date/Time</th>
                    <th className={TH}>Records Processed</th>
                    <th className={TH}>Space Freed</th>
                    <th className={TH}>Status</th>
                    <th className={`${TH} text-right`}>Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((h, i) => (
                    <tr key={h.id} className="hover:bg-indigo-50/20">
                      <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                      <td className="p-3 text-gray-900 font-medium">{h.job}</td>
                      <td className="p-3 text-gray-600 whitespace-nowrap">{h.run}</td>
                      <td className="p-3 text-gray-700">{h.records}</td>
                      <td className="p-3 text-gray-700">{h.freed}</td>
                      <td className="p-3">
                        <Pill tone={h.status === 'Done' ? 'green' : 'rose'}>{h.status === 'Done' ? '✅ Done' : '❌ Failed'}</Pill>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setHistoryDetail(h)}>
                          <Eye className="w-3 h-3 mr-1" /> View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500">
                        No runs match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}

      {showHistory && (
        <Panel icon={Clock} title="Job History — Last 30 Days" subtitle="Full run log across every archive job" actions={<><select value={historyJob} onChange={(event) => setHistoryJob(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Jobs</option>{jobs.map((job) => <option key={job.id}>{job.name}</option>)}</select><select value={historyStatus} onChange={(event) => setHistoryStatus(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Status</option><option>Done</option><option>Failed</option></select><Button variant="outline" size="sm" className="text-xs" onClick={() => exportRows(history)}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export CSV</Button></>}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={`${TH} w-12 text-center`}>#</th>
                  <th className={TH}>Job Name</th>
                  <th className={TH}>Run Date/Time</th>
                  <th className={TH}>Records</th>
                  <th className={TH}>Space Freed</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h, i) => (
                  <tr key={h.id} className="hover:bg-indigo-50/20">
                    <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                    <td className="p-3 text-gray-900 font-medium">{h.job}</td>
                    <td className="p-3 text-gray-600">{h.run}</td>
                    <td className="p-3 text-gray-700">{h.records}</td>
                    <td className="p-3 text-gray-700">{h.freed}</td>
                    <td className="p-3">
                      <Pill tone={h.status === 'Done' ? 'green' : 'rose'}>{h.status}</Pill>
                    </td>
                    <td className="p-3 text-right"><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setHistoryDetail(h)}><Eye className="w-3 h-3 mr-1" />Details</Button></td>
                  </tr>
                ))}
                {history.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-gray-500">No runs match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* SECTION 5 — manual trigger */}
      <Panel icon={Plus} title="Manual Archive Trigger" subtitle="Run an archive job immediately, outside of the schedule">
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Module</label>
              <select value={manualModule} onChange={(e) => setManualModule(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                <option>Finance / GL</option>
                <option>Fee Module</option>
                <option>Payroll</option>
                <option>Attendance</option>
                <option>Examination</option>
                <option>Documents</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Action</label>
              <div className="space-y-1.5 p-2.5 border border-gray-200 rounded-md bg-gray-50 text-xs">
                {['Archive to Archive DB', 'Push to Cold Storage', 'Cleanup'].map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="manual-action" checked={manualAction === a} onChange={() => setManualAction(a)} />
                    <span className={manualAction === a ? 'font-semibold text-gray-900' : 'text-gray-600'}>{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Records older than</label>
                <select value={olderThan} onChange={(e) => setOlderThan(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>3 years</option>
                  <option>5 years</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-1 font-medium">Max records (per run)</label>
                <input value={maxRecords} onChange={(e) => setMaxRecords(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Authorization required</label>
              <select value={authorizer} onChange={(e) => setAuthorizer(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                <option>Principal</option>
                <option>Finance Manager</option>
                <option>Super Admin</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Mandatory for manual jobs</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 space-y-2">
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Estimated Impact</p>
              <div className="text-xs text-gray-700 space-y-1">
                <p>Records to Process: <strong>~8,450 records</strong></p>
                <p>Estimated Space Freed: <strong>~185 MB from Primary DB</strong></p>
                <p>Estimated Duration: <strong>~15 minutes</strong></p>
                <p>Best Time to Run: <strong>Off-peak hours recommended</strong></p>
                <p className="pt-1 text-[11px] text-gray-600">
                  Target: {manualModule} · {manualAction} · older than {olderThan} · limit {maxRecords} records
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>In production, running during business hours may slow down the ERP. A simulated run here captures authorization by {authorizer} in local run history; it does not execute an archive operation.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={addManualRun}
              >
                ▶️ Run Archive Now
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={saveManualAsJob}>
                💾 Save as New Scheduled Job
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setManualModule('Finance / GL'); setManualAction('Archive to Archive DB'); setOlderThan('2 years'); setMaxRecords('50,000'); setAuthorizer('Principal'); showToast('Manual trigger form reset.'); }}>
                Cancel / Reset Form
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      {detail && (
        <Modal isOpen onClose={() => setDetail(null)} title={`Job Log — ${detail.name}`} size="lg">
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <p className="font-bold">{detail.icon} {detail.name}</p>
                <p className="text-[11px] text-indigo-100">{detail.detail}</p>
              </div>
              <Badge className="bg-white/20 text-white border-none">{detail.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <p>Type: <strong>{detail.type} · {detail.kind}</strong></p>
              <p>Schedule: <strong>{detail.schedule}</strong></p>
              <p>Cadence: <strong>{detail.cadence}</strong></p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="font-bold text-gray-800 text-[11px] mb-1">LAST RUN LOG</p>
              <pre className="text-[10px] font-mono text-gray-600 whitespace-pre-wrap">
{`02:00:00  job started (scheduler)
02:00:04  lock acquired on module tables
02:05:12  12,450 records copied to archive DB
02:05:40  checksum verified — 12,450 / 12,450 match
02:28:57  primary rows deleted, index refreshed
02:28:57  job finished successfully`}
              </pre>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => exportRows(historyRows.filter((row) => row.job === detail.name))}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download Log CSV
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => { setConfigDraft({ ...detail }); setDetail(null); }}>
                <Settings className="w-3.5 h-3.5 mr-1.5" /> Configure
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={jobFormOpen} onClose={() => setJobFormOpen(false)} title="Add Archive Job" size="lg">
        <div className="space-y-4 text-xs"><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-gray-600">Job name<input value={newJobName} onChange={(event) => setNewJobName(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Module / data scope<input value={newJobModule} onChange={(event) => setNewJobModule(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Job type<select value={newJobType} onChange={(event) => setNewJobType(event.target.value as JobRow['type'])} className="mt-1 w-full rounded-md border border-gray-300 p-2"><option>Nightly</option><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Annual</option></select></label><label className="text-gray-600">Action type<select value={newJobKind} onChange={(event) => setNewJobKind(event.target.value as JobRow['kind'])} className="mt-1 w-full rounded-md border border-gray-300 p-2"><option>Archive</option><option>Cold Push</option><option>Cleanup</option><option>Backup</option></select></label><label className="text-gray-600">Schedule<input value={newJobSchedule} onChange={(event) => setNewJobSchedule(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Selection criteria<input value={newJobDetail} onChange={(event) => setNewJobDetail(event.target.value)} placeholder="e.g. data older than 2 years" className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setJobFormOpen(false)}>Cancel</Button><Button onClick={saveNewJob}><Plus className="w-4 h-4 mr-2" />Add Job</Button></div></div>
      </Modal>

      <Modal isOpen={!!configDraft} onClose={() => setConfigDraft(null)} title={configDraft ? `Configure — ${configDraft.name}` : ''} size="lg">
        {configDraft && <div className="space-y-4 text-xs"><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><label className="text-gray-600">Job name<input value={configDraft.name} onChange={(event) => setConfigDraft({ ...configDraft, name: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Description / criteria<input value={configDraft.detail} onChange={(event) => setConfigDraft({ ...configDraft, detail: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Schedule<input value={configDraft.schedule} onChange={(event) => setConfigDraft({ ...configDraft, schedule: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label><label className="text-gray-600">Run status<select value={configDraft.status} onChange={(event) => setConfigDraft({ ...configDraft, status: event.target.value as JobRow['status'] })} className="mt-1 w-full rounded-md border border-gray-300 p-2"><option>Active</option><option>Paused</option><option>Scheduled</option><option>FAILED</option></select></label><label className="text-gray-600">Cadence<input value={configDraft.cadence} onChange={(event) => setConfigDraft({ ...configDraft, cadence: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 p-2" /></label></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfigDraft(null)}>Cancel</Button><Button onClick={saveJobConfiguration}><Settings className="w-4 h-4 mr-2" />Save Configuration</Button></div></div>}
      </Modal>

      <Modal isOpen={!!historyDetail} onClose={() => setHistoryDetail(null)} title={historyDetail ? `Job Run Detail — ${historyDetail.job}` : ''} size="md">
        {historyDetail && <div className="space-y-4 text-xs"><div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4"><p className="font-semibold text-indigo-900">{historyDetail.job}</p><p className="mt-1 text-indigo-800">{historyDetail.run} · {historyDetail.status}</p></div><div className="grid grid-cols-2 gap-2 text-gray-700"><p>Records processed: <strong>{historyDetail.records}</strong></p><p>Space freed: <strong>{historyDetail.freed}</strong></p><p>Run ID: <strong className="font-mono">{historyDetail.id}</strong></p><p>Result: <strong>{historyDetail.status}</strong></p>{historyDetail.authorizedBy && <p>Authorized by: <strong>{historyDetail.authorizedBy}</strong></p>}</div>{historyDetail.note && <p className="rounded-lg bg-gray-50 p-3 text-gray-700">Run notes: {historyDetail.note}</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => exportRows([historyDetail])}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Detail</Button><Button onClick={() => setHistoryDetail(null)}>Close</Button></div></div>}
      </Modal>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ArchiveJobsSchedule;
