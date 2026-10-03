// RetrievalManagement.tsx — Archive Management ▸ Retrieval Management (Page 5)
// Retrieval KPIs, the 6-step new-request form, live tracker with the 10-step status,
// the retrieved-data viewer (read-only) and the retrieval history table.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  DownloadCloud,
  Clock,
  CheckCircle2,
  Database,
  AlarmClock,
  IndianRupee,
  Search,
  RefreshCw,
  FileDown,
  Printer,
  Eye,
  Mail,
  XCircle,
  Paperclip,
  BarChart3
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH, ProgressBar, inr } from './archiveUi';

interface ColdOption {
  id: string;
  name: string;
  module: string;
  size: number;
  cost: number;
}

const COLD_FILES: ColdOption[] = [
  { id: 'f1', name: 'GL_FY2019-20_JournalEntries.gz.enc', module: 'Finance', size: 118, cost: 35 },
  { id: 'f2', name: 'FEE_FY2019-20_Receipts.gz.enc', module: 'Fee', size: 78, cost: 23 },
  { id: 'f3', name: 'PAYROLL_FY2019-20_Monthly.gz.enc', module: 'Payroll', size: 62, cost: 19 },
  { id: 'f4', name: 'ATTEND_FY2019-20_Employee.gz.enc', module: 'HR', size: 88, cost: 26 }
];

const HISTORY = [
  { id: 'RETR-2025-001', by: 'Finance Manager', files: '2 files — FY 19-20', speed: 'Standard', cost: 59, status: 'Active' },
  { id: 'RETR-2025-000', by: 'Finance Manager', files: '1 file — FY 2018-19', speed: 'Expedited', cost: 45, status: 'Done' },
  { id: 'RETR-2024-089', by: 'Principal', files: '5 files — FY 2020-21', speed: 'Bulk', cost: 28, status: 'Done' },
  { id: 'RETR-2024-045', by: 'Finance Manager', files: '2 files — FY 2021-22', speed: 'Standard', cost: 38, status: 'Done' },
  { id: 'RETR-2024-012', by: 'HR Manager', files: '1 file — Payroll 17', speed: 'Standard', cost: 18, status: 'Done' },
  { id: 'RETR-2023-098', by: 'Statutory Audit', files: '8 files — FY 2016-17', speed: 'Bulk', cost: 95, status: 'Done' }
];

const GL_ROWS = [
  { date: '01-Apr-19', voucher: 'JV-2019-001', desc: 'Opening Balance FY 19-20', debit: '5,00,000', credit: '' },
  { date: '05-Apr-19', voucher: 'RV-2019-045', desc: 'Fee — Rahul Kumar X-A', debit: '12,000', credit: '' },
  { date: '07-Apr-19', voucher: 'PV-2019-012', desc: 'Salary — April 2019', debit: '', credit: '80,000' }
];

const TABS = ['➕ New Request', '⏳ Active Retrievals', '📊 View Retrieved Data', '📋 Retrieval History'];

export function RetrievalManagement() {
  const [tab, setTab] = useState(TABS[0]);
  const [source, setSource] = useState('Cold Storage');
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['f1', 'f2']);
  const [speed, setSpeed] = useState<'Expedited' | 'Standard' | 'Bulk'>('Standard');
  const [accessWindow, setAccessWindow] = useState('72 hours');
  const [reason, setReason] = useState('Income Tax Audit — AY 2020-21');
  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [historyStatus, setHistoryStatus] = useState('All Status');
  const [progress, setProgress] = useState(72);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const chosen = COLD_FILES.filter((f) => selectedFiles.includes(f.id));
  const totalSize = chosen.reduce((s, f) => s + f.size, 0);
  const rate = speed === 'Expedited' ? 1.5 : speed === 'Standard' ? 0.3 : 0.1;
  const totalCost = Math.round(totalSize * rate);
  const approval = totalCost > 50 ? 'Principal — Mr. A. Sharma' : 'Finance Manager (self-approved)';

  const toggleFile = (id: string) =>
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredCold = COLD_FILES.filter((f) => !fileSearch || f.name.toLowerCase().includes(fileSearch.toLowerCase()));
  const history = HISTORY.filter((h) => historyStatus === 'All Status' || h.status === historyStatus);

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={DownloadCloud}
        title="Retrieval Management"
        screen="Retrieval Management"
        restricted="Retrieval requests are billed — approval is required above ₹50 per request"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Retrieval statuses refreshed.')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Status
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Retrieval history exported.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export History
            </Button>
          </>
        }
      />

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={Clock} label="Active Retrievals" value="1 Retrieval" sub="In Progress" />
        <KpiCard icon={CheckCircle2} label="Completed This Month" value="5 Retrievals" tone="text-emerald-700" sub="✅ Done" />
        <KpiCard icon={Database} label="Temp Data in ERP Now" value="1.1 GB" sub="Temp tables" />
        <KpiCard icon={AlarmClock} label="Expiring Within 6 Hrs" value="1 Retrieval" tone="text-amber-700" sub="⚠️ Export Now!" />
        <KpiCard icon={IndianRupee} label="Cost This Month" value={inr(165)} sub="5 retrievals" />
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

      {/* SECTION 3 — new request form */}
      {tab === TABS[0] && (
        <Panel icon={DownloadCloud} title="New Retrieval Request" subtitle="Six steps — pick the data, choose the speed, set access window and get it approved">
          <div className="p-5 space-y-5">
            {/* step 1 */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 1: What do you need?</p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-medium text-gray-600">Source:</span>
                {['Cold Storage', 'Archive DB — No retrieval needed, direct access'].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="source" checked={source === s} onChange={() => setSource(s)} />
                    <span className={source === s ? 'font-semibold text-gray-900' : 'text-gray-600'}>{s}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
                  <input
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    placeholder="Search cold storage files…"
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Cold storage index searched.')}>
                  🔍 Search Cold Storage
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>Module: All</option>
                  <option>Finance</option>
                  <option>Fee</option>
                  <option>Payroll</option>
                </select>
                <select className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>Data Type: All</option>
                  <option>Journal Entries</option>
                  <option>Receipts</option>
                </select>
                <select className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>Period: FY 2019-20</option>
                  <option>Period: FY 2018-19</option>
                  <option>Period: All</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={TH}>File Name</th>
                      <th className={TH}>Module</th>
                      <th className={TH}>Comp. Size</th>
                      <th className={TH}>Cost</th>
                      <th className={`${TH} text-center`}>Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCold.map((f) => (
                      <tr key={f.id} className={selectedFiles.includes(f.id) ? 'bg-indigo-50/40' : ''}>
                        <td className="p-3 font-mono text-gray-800">{f.name}</td>
                        <td className="p-3 text-gray-700">{f.module}</td>
                        <td className="p-3 text-gray-700">{f.size} MB</td>
                        <td className="p-3 text-gray-700">{inr(f.cost)}</td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(f.id)}
                            onChange={() => toggleFile(f.id)}
                            aria-label={`Select ${f.name}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-600">
                Selected: <strong>{chosen.length} files</strong> | <strong>{totalSize} MB total</strong>
              </p>
            </div>

            {/* step 2 */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 2: Retrieval Speed</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(
                  [
                    { id: 'Expedited' as const, icon: '⚡', time: '1-5 min', note: 'Emergency only' },
                    { id: 'Standard' as const, icon: '🔵', time: '3-5 hrs', note: 'Normal use' },
                    { id: 'Bulk' as const, icon: '💰', time: '5-12 hrs', note: 'Non-urgent / save money' }
                  ]
                ).map((s) => {
                  const cost = Math.round(totalSize * (s.id === 'Expedited' ? 1.5 : s.id === 'Standard' ? 0.3 : 0.1));
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSpeed(s.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        speed === s.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900">
                          {s.icon} {s.id}
                        </span>
                        <span className="text-xs font-bold text-gray-900">{inr(cost)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {s.time} · {s.note}
                        {speed === s.id ? ' ← Selected' : ''}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* step 3 */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 3: How long do you need access?</p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {['24 hours', '72 hours', '7 days'].map((w) => (
                  <label key={w} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="access" checked={accessWindow === w} onChange={() => setAccessWindow(w)} />
                    <span className={accessWindow === w ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                      {w}
                      {w === '72 hours' ? ' ← Recommended' : ''}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input type="radio" name="access" checked={accessWindow === 'Custom'} onChange={() => setAccessWindow('Custom')} />
                  <span className="text-gray-600">Custom:</span>
                  <input type="number" className="w-20 p-1 border border-gray-300 rounded text-xs" defaultValue={30} />
                  <span className="text-gray-600">days</span>
                </label>
              </div>
              <p className="text-[11px] text-gray-500">
                After expiry the temp data is deleted from the ERP — the cold storage original is untouched.
              </p>
            </div>

            {/* step 4 */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 4: Purpose / Reason</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for retrieval"
                  className="w-full p-2 border border-gray-300 rounded-md text-xs"
                />
                <Button variant="outline" size="sm" className="text-xs justify-start" onClick={() => showToast('Supporting document attached.')}>
                  <Paperclip className="w-3.5 h-3.5 mr-1.5" /> Upload IT Notice (Optional)
                </Button>
              </div>
            </div>

            {/* step 5 */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 5: Authorization</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
                <p>
                  Cost: <strong>{inr(totalCost)}</strong> → {totalCost > 50 ? 'Requires Principal approval (> ₹50 threshold)' : 'Within Finance Manager limit'}
                </p>
                <p>Requested By: Finance Manager — Priya Gupta 🔒 Auto</p>
                <p>Approval Required From: <strong>{approval}</strong> 🔒 Auto-determined</p>
              </div>
            </div>

            {/* step 6 */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">Step 6: Notifications</p>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifyApp} onChange={(e) => setNotifyApp(e.target.checked)} /> In-App notification when ready
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} /> Email: priya.gupta@school.com
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} /> SMS: 98XXXXXXXX
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 px-4 py-3 text-xs text-indigo-900">
              <strong>SUMMARY:</strong> {chosen.length} files | {totalSize} MB | {speed} ({speed === 'Expedited' ? '1-5 min' : speed === 'Standard' ? '3-5 hrs' : '5-12 hrs'}) | {accessWindow} access | {inr(totalCost)} cost
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  setProgress(72);
                  setTab(TABS[1]);
                  showToast(`Retrieval request submitted for approval — ${chosen.length} file(s), ${inr(totalCost)}.`);
                }}
              >
                📤 Submit Request
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Retrieval request saved as draft.')}>
                💾 Save as Draft
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => showToast('Request discarded.')}>
                Cancel
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* SECTION 4 — active tracker */}
      {tab === TABS[1] && (
        <Panel
          icon={Clock}
          title="Active Retrievals — Real-Time Tracker"
          subtitle="Live AWS Glacier status and the ERP ingest pipeline"
          actions={
            <>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Status refreshed from AWS.')}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Status
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('You will be emailed when the retrieval completes.')}>
                <Mail className="w-3.5 h-3.5 mr-1.5" /> Email When Done
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-rose-700 border-rose-200"
                onClick={() => showToast('Retrieval cancelled — temp tables will be removed.')}
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Retrieval
              </Button>
            </>
          }
        >
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
              <p>Retrieval ID: <strong className="font-mono">RETR-2025-001</strong></p>
              <p>Requested By: Finance Manager — Priya Gupta</p>
              <p>Approved By: Principal — Mr. A. Sharma (10:15 AM)</p>
              <p>Files: 2 files (GL + Fee — FY 2019-20)</p>
              <p>Speed: Standard (3-5 hours)</p>
              <p>Started: 27-Sep-2025 10:17 AM</p>
              <p>Access Until: 30-Sep-2025 10:17 AM (72 hours)</p>
              <p>Cost: {inr(59)} (Standard retrieval)</p>
            </div>

            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 space-y-2">
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Overall Progress</p>
              <ProgressBar value={progress} max={100} color="bg-indigo-500" label={`${progress}% Complete · Estimated completion 01:45 PM (1 hr 28 min remaining)`} />
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
                  ⏩ Simulate progress +10%
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    setProgress(100);
                    setTab(TABS[2]);
                    showToast('Retrieval completed — temp data is ready to browse.');
                  }}
                >
                  ✅ Mark Complete
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={TH}>File</th>
                    <th className={TH}>AWS Status</th>
                    <th className={TH}>ERP Status</th>
                    <th className={TH}>Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-mono text-gray-800">GL_FY2019-20_JournalEntries</td>
                    <td className="p-3 text-gray-700">✅ Retrieved from Glacier</td>
                    <td className="p-3 text-gray-700">📥 Downloading — 118 MB in progress</td>
                    <td className="p-3 w-40">
                      <ProgressBar value={80} max={100} color="bg-indigo-500" label="80%" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-gray-800">FEE_FY2019-20_Receipts</td>
                    <td className="p-3 text-gray-700">⏳ Processing — in AWS queue</td>
                    <td className="p-3 text-gray-700">⏳ Waiting — not started yet</td>
                    <td className="p-3 w-40">
                      <ProgressBar value={0} max={100} color="bg-gray-400" label="0%" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">
                Step-by-step status (File 1 — GL Journal Entries)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
                {[
                  ['✅', '1. Request sent to AWS Glacier', '10:17 AM'],
                  ['✅', '2. AWS confirmed request', '10:17 AM'],
                  ['✅', '3. AWS retrieved from deep archive', '11:52 AM — 95 min'],
                  ['✅', '4. AWS notified ERP — file ready', '11:52 AM'],
                  ['📥', '5. ERP downloading from AWS', 'In progress — 80% done'],
                  ['⏳', '6. ERP will decrypt file', 'Pending'],
                  ['⏳', '7. ERP will decompress file', 'Pending'],
                  ['⏳', '8. ERP will verify data integrity', 'Pending'],
                  ['⏳', '9. ERP will load to temp table', 'Pending'],
                  ['⏳', '10. ERP will notify Finance Manager', 'Pending']
                ].map(([icon, label, when]) => (
                  <p key={label} className={label.startsWith('5.') ? 'text-indigo-700 font-semibold' : 'text-gray-600'}>
                    {icon} {label} <span className="text-gray-400">[{when}]</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* SECTION 5 — retrieved data viewer */}
      {tab === TABS[2] && (
        <Panel
          icon={BarChart3}
          title="Retrieved Data Viewer — RETR-2025-001"
          subtitle="❄️ Cold storage data — FY 2019-20 · Expires 30-Sep-2025 10:17 AM (71 hrs 45 min)"
          actions={
            <>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Access window extended by 24 hours.')}>
                ⏰ Extend by 24 Hours
              </Button>
              <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => showToast('All retrieved data exported as Excel.')}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export All Now
              </Button>
            </>
          }
        >
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
              <span>⚠️</span>
              <p>
                This is a TEMPORARY COPY. The original remains in cold storage and the temp copy is removed automatically
                after expiry. Edit, Delete and Create are NOT available for this data.
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={TH}>Module / Data Type</th>
                    <th className={TH}>Records</th>
                    <th className={TH}>Period</th>
                    <th className={`${TH} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 text-gray-800">💰 GL Journal Entries</td>
                    <td className="p-3 text-gray-700">11,250 recs</td>
                    <td className="p-3 text-gray-700">FY 2019-20</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('Browsing GL journal entries…')}>
                          <Eye className="w-3 h-3 mr-1" /> Browse
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('GL journal entries exported.')}>
                          <FileDown className="w-3 h-3 mr-1" /> Export
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-800">💸 Fee Receipts</td>
                    <td className="p-3 text-gray-700">7,890 recs</td>
                    <td className="p-3 text-gray-700">FY 2019-20</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('Browsing fee receipts…')}>
                          <Eye className="w-3 h-3 mr-1" /> Browse
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('Fee receipts exported.')}>
                          <FileDown className="w-3 h-3 mr-1" /> Export
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Panel icon={Search} title="Browse retrieved data — Finance / GL (FY 2019-20)" subtitle="Read-only temporary tables">
              <div className="p-4 flex flex-wrap gap-2">
                <input placeholder="Search within retrieved data" className="flex-1 min-w-[220px] p-1.5 border border-gray-300 rounded-md text-xs" />
                <select className="p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                  <option>All Types</option>
                  <option>Journal Entries</option>
                  <option>Receipts</option>
                </select>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Filtered rows exported.')}>
                  <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Filtered
                </Button>
              </div>
              <div className="overflow-x-auto border-t border-gray-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={`${TH} w-12 text-center`}>#</th>
                      <th className={TH}>Date</th>
                      <th className={TH}>Voucher No.</th>
                      <th className={TH}>Description</th>
                      <th className={TH}>Debit</th>
                      <th className={TH}>Credit</th>
                      <th className={`${TH} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {GL_ROWS.map((r, i) => (
                      <tr key={r.voucher}>
                        <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                        <td className="p-3 text-gray-700">{r.date}</td>
                        <td className="p-3 font-mono text-indigo-700">{r.voucher}</td>
                        <td className="p-3 text-gray-700">{r.desc}</td>
                        <td className="p-3 text-gray-700">{r.debit}</td>
                        <td className="p-3 text-gray-700">{r.credit}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.voucher} opened.`)}>
                              <Eye className="w-3 h-3 mr-1" /> View
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.voucher} sent to printer.`)}>
                              <Printer className="w-3 h-3 mr-1" /> Print
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 text-[11px] text-rose-700">
                ❌ Edit | ❌ Delete | ❌ Create → NOT AVAILABLE (cold storage retrieved data is READ ONLY)
              </div>
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Report generated from retrieved data.')}>
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Generate Report from Retrieved Data
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Exported as Excel.')}>
                  <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export All as Excel
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Summary sent to printer.')}>
                  <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Summary
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setTab(TABS[0])}>
                  🔄 Request New Retrieval
                </Button>
              </div>
            </Panel>
          </div>
        </Panel>
      )}

      {/* SECTION 6 — history */}
      {tab === TABS[3] && (
        <Panel
          icon={Clock}
          title="Retrieval History — All Past Retrievals"
          subtitle="Every request with speed, cost and current status"
          actions={
            <>
              <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Done</option>
              </select>
              <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                <option>All Time</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Retrieval history exported.')}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export History
              </Button>
            </>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="retrieval-history">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={`${TH} w-12 text-center`}>#</th>
                  <th className={TH}>Retrieval ID</th>
                  <th className={TH}>Requested By</th>
                  <th className={TH}>Files Retrieved</th>
                  <th className={TH}>Speed</th>
                  <th className={TH}>Cost</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h, i) => (
                  <tr key={h.id} className="hover:bg-indigo-50/20">
                    <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                    <td className="p-3 font-mono font-semibold text-indigo-700">{h.id}</td>
                    <td className="p-3 text-gray-700">{h.by}</td>
                    <td className="p-3 text-gray-700">{h.files}</td>
                    <td className="p-3 text-gray-700">{h.speed}</td>
                    <td className="p-3 text-gray-900 font-semibold">{inr(h.cost)}</td>
                    <td className="p-3">
                      <Pill tone={h.status === 'Active' ? 'amber' : 'green'}>{h.status === 'Active' ? '⏳ Active' : '✅ Done'}</Pill>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {h.status === 'Active' ? (
                          <>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setTab(TABS[2])}>
                              <BarChart3 className="w-3 h-3 mr-1" /> View Data
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast('Retrieved data exported.')}>
                              <FileDown className="w-3 h-3 mr-1" /> Export
                            </Button>
                          </>
                        ) : (
                          <>
                            <Pill tone="amber">⚠️ Expired</Pill>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setTab(TABS[0])}>
                              <DownloadCloud className="w-3 h-3 mr-1" /> Re-retrieve
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600">
            <p>⏳ Active → In progress OR retrieved and within the expiry window (data can be viewed)</p>
            <p>✅ Done → Completed and expired (temp data deleted, original still in cold storage)</p>
            <p>❌ Failed → Retrieval failed — retry needed · ❌ Cancelled → Cancelled before completion</p>
          </div>
        </Panel>
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

export default RetrievalManagement;
