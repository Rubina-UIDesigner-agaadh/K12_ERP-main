// ArchiveJobsSchedule.tsx — Archive Management ▸ Archive Jobs & Schedule (Page 3)
// Job KPIs, tabs, active/scheduled jobs table, 30-day history and the manual archive trigger.
import React, { useState } from 'react';
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

const HISTORY = [
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

export function ArchiveJobsSchedule() {
  const [tab, setTab] = useState(TABS[0]);
  const [jobs, setJobs] = useState(JOBS);
  const [allPaused, setAllPaused] = useState(false);
  const [detail, setDetail] = useState<JobRow | null>(null);
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

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const tabFiltered = jobs.filter((j) => {
    if (tab === TABS[1]) return j.kind === 'Archive' && j.type === 'Nightly';
    if (tab === TABS[2]) return j.kind === 'Cold Push';
    if (tab === TABS[3]) return j.kind === 'Cleanup';
    return true;
  });

  const history = HISTORY.filter(
    (h) =>
      (historyJob === 'All Jobs' || h.job === historyJob) &&
      (historyStatus === 'All Status' || h.status === historyStatus)
  );

  const showHistory = tab === TABS[4];

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={CalendarClock}
        title="Archive Jobs & Schedule"
        screen="Archive Jobs & Schedule"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Job list refreshed.')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Job history exported as CSV.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export History
            </Button>
          </>
        }
      />

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={CheckCircle2} label="Jobs Today (Successful)" value="3 of 5" tone="text-emerald-700" sub="🟢" />
        <KpiCard icon={XCircle} label="Failed Jobs (Need Attention)" value="2 Failed" tone="text-rose-700" sub="🔴 Action Needed" />
        <KpiCard icon={Clock} label="Running Now" value="0 Running" sub="—" />
        <KpiCard icon={CalendarDays} label="Next Job Scheduled" value="Tonight 2:00 AM" sub="Nightly Archive" />
        <KpiCard icon={Database} label="Freed Today From Primary" value="430 MB" tone="text-emerald-700" sub="🟢 Good" />
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
                <Button size="sm" className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => showToast('Add New Job dialog opened.')}>
                  <Plus className="w-3 h-3 mr-1" /> Add New Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => {
                    setAllPaused(true);
                    showToast('All archive jobs paused — automation suspended.');
                  }}
                >
                  <Pause className="w-3 h-3 mr-1" /> Pause All Jobs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => {
                    setAllPaused(false);
                    showToast('All archive jobs resumed.');
                  }}
                >
                  <Play className="w-3 h-3 mr-1" /> Resume All
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast('All jobs queued to run now.')}>
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
                            onClick={() => showToast(`${j.name} configuration opened.`)}
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
                                onClick={() => {
                                  setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, status: 'Active', statusNote: undefined } : x)));
                                  showToast(`${j.name} retried successfully.`);
                                }}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" /> Retry
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('Failure alert emailed to the archive admin.')}>
                                <Mail className="w-3 h-3 mr-1" /> Alert
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${j.name} queued to run now.`)}>
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
                  {JOBS.map((j) => (
                    <option key={j.id}>{j.name}</option>
                  ))}
                </select>
                <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                  <option>All Status</option>
                  <option>Done</option>
                  <option>Failed</option>
                </select>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('History exported (last 30 days).')}>
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
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`Full log for ${h.job} (${h.run}) opened.`)}>
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
        <Panel icon={Clock} title="Job History — Last 30 Days" subtitle="Full run log across every archive job">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {HISTORY.map((h, i) => (
                  <tr key={h.id} className="hover:bg-indigo-50/20">
                    <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                    <td className="p-3 text-gray-900 font-medium">{h.job}</td>
                    <td className="p-3 text-gray-600">{h.run}</td>
                    <td className="p-3 text-gray-700">{h.records}</td>
                    <td className="p-3 text-gray-700">{h.freed}</td>
                    <td className="p-3">
                      <Pill tone={h.status === 'Done' ? 'green' : 'rose'}>{h.status}</Pill>
                    </td>
                  </tr>
                ))}
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
              <p>Running during business hours may slow down the ERP for users. Authorization by {authorizer} is recorded in the audit trail.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => showToast(`Manual ${manualAction} queued for ${manualModule} — awaiting ${authorizer} approval.`)}
              >
                ▶️ Run Archive Now
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Saved as a new scheduled job.')}>
                💾 Save as New Scheduled Job
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => showToast('Manual trigger cancelled.')}>
                Cancel
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
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Log downloaded.')}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ArchiveJobsSchedule;
