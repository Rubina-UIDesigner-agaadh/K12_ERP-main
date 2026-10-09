// Archive Management ▸ Retrieval Management
// Browser-only retrieval workflow: requests are saved in shared local storage,
// can be progressed/completed here, and completed records feed the data viewer.
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
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
import {
  ArchiveRetrievalItem,
  ArchiveRetrievalRequest,
  ArchiveRetrievedRecord,
  completeRetrieval,
  downloadCsv,
  enqueueRetrieval,
  formatArchiveDate,
  loadArchiveWorkflowState,
  saveArchiveWorkflowState,
  setRetrievalProgress,
  subscribeToArchiveWorkflowState
} from './archiveWorkflowState';

interface ColdOption extends ArchiveRetrievalItem {
  year: string;
}

const COLD_FILES: ColdOption[] = [
  { id: 'f1', name: 'GL_FY2019-20_JournalEntries.gz.enc', module: 'Finance', sizeMB: 118, costINR: 35, year: 'FY 2019-20', type: 'Journal Entries', description: 'General ledger journal entries', date: '01-Apr-2019', reference: 'GL-FY19-20', amount: '—' },
  { id: 'f2', name: 'FEE_FY2019-20_Receipts.gz.enc', module: 'Fee', sizeMB: 78, costINR: 23, year: 'FY 2019-20', type: 'Receipts', description: 'Fee receipt archive', date: '05-Apr-2019', reference: 'FEE-FY19-20', amount: '—' },
  { id: 'f3', name: 'PAYROLL_FY2019-20_Monthly.gz.enc', module: 'Payroll', sizeMB: 62, costINR: 19, year: 'FY 2019-20', type: 'Payroll', description: 'Monthly payroll archive', date: '30-Apr-2019', reference: 'PAY-FY19-20', amount: '—' },
  { id: 'f4', name: 'ATTEND_FY2019-20_Employee.gz.enc', module: 'HR', sizeMB: 88, costINR: 26, year: 'FY 2019-20', type: 'Employee Attendance', description: 'Employee attendance records', date: '01-Apr-2019', reference: 'ATT-FY19-20', amount: '—' },
  { id: 'f5', name: 'EXAM_FY2018-19_Marks.gz.enc', module: 'Exam', sizeMB: 54, costINR: 16, year: 'FY 2018-19', type: 'Examination', description: 'Examination marks and reports', date: '15-Mar-2018', reference: 'EXAM-FY18-19', amount: '—' }
];

const TABS = ['➕ New Request', '⏳ Active Retrievals', '📊 View Retrieved Data', '📋 Retrieval History'];
const SPEEDS: Array<{ id: ArchiveRetrievalRequest['speed']; icon: string; time: string; note: string; rate: number }> = [
  { id: 'Expedited', icon: '⚡', time: '1–5 min', note: 'Emergency only', rate: 1.5 },
  { id: 'Standard', icon: '🔵', time: '3–5 hrs', note: 'Normal use', rate: 0.3 },
  { id: 'Bulk', icon: '💰', time: '5–12 hrs', note: 'Non-urgent / lowest cost', rate: 0.1 }
];
const accessHoursFor = (windowChoice: string, customDays: number) => windowChoice === '24 hours' ? 24 : windowChoice === '7 days' ? 168 : windowChoice === 'Custom' ? Math.max(1, customDays) * 24 : 72;
const formatBytes = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toLocaleString('en-IN')} MB`;

const exportRetrievedRecords = (records: ArchiveRetrievedRecord[], filename: string) => downloadCsv(
  filename,
  ['Reference', 'Date', 'Module', 'Type', 'Description', 'Student / Entity', 'Amount', 'Period', 'File', 'Retrieval ID', 'Cost INR'],
  records.map((record) => [record.reference, record.date, record.module, record.type, record.title, record.student || '', record.amount, record.period, record.fileName, record.retrievalId, record.costINR])
);

export function RetrievalManagement() {
  const [tab, setTab] = useState(TABS[0]);
  const [fileSearch, setFileSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['f1', 'f2']);
  const [speed, setSpeed] = useState<ArchiveRetrievalRequest['speed']>('Standard');
  const [accessWindow, setAccessWindow] = useState('72 hours');
  const [customDays, setCustomDays] = useState(30);
  const [reason, setReason] = useState('Income Tax Audit — AY 2020-21');
  const [attachmentName, setAttachmentName] = useState('');
  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [historyStatus, setHistoryStatus] = useState('All Status');
  const [historyPeriod, setHistoryPeriod] = useState('All Time');
  const [viewerSearch, setViewerSearch] = useState('');
  const [viewerType, setViewerType] = useState('All Types');
  const [viewerRequest, setViewerRequest] = useState('All Requests');
  const [workflow, setWorkflow] = useState(() => loadArchiveWorkflowState());
  const [detail, setDetail] = useState<ArchiveRetrievedRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => subscribeToArchiveWorkflowState(() => setWorkflow(loadArchiveWorkflowState())), []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const chosen = COLD_FILES.filter((file) => selectedFiles.includes(file.id));
  const totalSize = chosen.reduce((sum, file) => sum + file.sizeMB, 0);
  const rate = SPEEDS.find((item) => item.id === speed)?.rate || 0.3;
  const totalCost = Math.round(totalSize * rate);
  const approval = totalCost > 50 ? 'Principal — Mr. A. Sharma' : 'Finance Manager (self-approved)';
  const activeRequests = workflow.retrievals.filter((request) => request.status === 'Queued' || request.status === 'In Progress');
  const completedRequests = workflow.retrievals.filter((request) => request.status === 'Complete');
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const completedThisMonth = completedRequests.filter((request) => new Date(request.completedAt || request.requestedAt) >= monthStart);
  const costThisMonth = workflow.retrievals.filter((request) => new Date(request.requestedAt) >= monthStart).reduce((sum, request) => sum + request.costINR, 0);
  const temporaryRecords = workflow.retrievedRecords.filter((record) => {
    const request = workflow.retrievals.find((item) => item.id === record.retrievalId);
    return request?.status === 'Complete' && (!request.expiresAt || new Date(request.expiresAt).getTime() > Date.now());
  });
  const temporaryRequestIds = new Set(temporaryRecords.map((record) => record.retrievalId));
  const temporarySizeMB = workflow.retrievals.filter((request) => temporaryRequestIds.has(request.id)).reduce((sum, request) => sum + request.items.reduce((total, item) => total + item.sizeMB, 0), 0);
  const filteredCold = useMemo(() => COLD_FILES.filter((file) =>
    (!fileSearch || `${file.name} ${file.module} ${file.type} ${file.reference}`.toLowerCase().includes(fileSearch.toLowerCase())) &&
    (moduleFilter === 'All' || file.module === moduleFilter) &&
    (typeFilter === 'All' || file.type === typeFilter) &&
    (periodFilter === 'All' || file.year === periodFilter)
  ), [fileSearch, moduleFilter, typeFilter, periodFilter]);

  const viewerRecords = useMemo(() => workflow.retrievedRecords.filter((record) => {
    if (viewerRequest !== 'All Requests' && record.retrievalId !== viewerRequest) return false;
    if (viewerType !== 'All Types' && record.type !== viewerType) return false;
    if (viewerSearch && !`${record.reference} ${record.title} ${record.module} ${record.type} ${record.student || ''} ${record.fileName}`.toLowerCase().includes(viewerSearch.toLowerCase())) return false;
    const request = workflow.retrievals.find((item) => item.id === record.retrievalId);
    return !request?.expiresAt || new Date(request.expiresAt).getTime() > Date.now();
  }), [workflow, viewerRequest, viewerType, viewerSearch]);

  const filteredHistory = workflow.retrievals.filter((request) => {
    const isActive = request.status === 'Queued' || request.status === 'In Progress';
    if (historyStatus === 'Active' && !isActive) return false;
    if (historyStatus === 'Done' && request.status !== 'Complete') return false;
    if (historyStatus === 'Cancelled' && request.status !== 'Cancelled') return false;
    const requestedAt = new Date(request.requestedAt).getTime();
    if (historyPeriod === 'This Month' && requestedAt < monthStart.getTime()) return false;
    if (historyPeriod === 'Last 3 Months') {
      const start = new Date(); start.setMonth(start.getMonth() - 3);
      if (requestedAt < start.getTime()) return false;
    }
    return true;
  });

  const toggleFile = (id: string) => setSelectedFiles((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]);

  const submitRequest = () => {
    if (!chosen.length) { showToast('Select at least one cold-storage file first.'); return; }
    if (!reason.trim()) { showToast('Enter a purpose or reason before submitting.'); return; }
    const selectedSpeed = SPEEDS.find((item) => item.id === speed);
    const items = chosen.map((file) => ({ ...file, costINR: Math.round(file.sizeMB * (selectedSpeed?.rate || 0.3)) }));
    const created = enqueueRetrieval({
      items,
      speed,
      accessHours: accessHoursFor(accessWindow, customDays),
      reason: reason.trim(),
      requestedBy: 'Finance Manager — Priya Gupta',
      approval,
      costINR: totalCost,
      notificationInApp: notifyApp,
      notificationEmail: notifyEmail,
      notificationSms: notifySms,
      attachmentName: attachmentName || undefined
    });
    setSelectedFiles([]);
    setTab(TABS[1]);
    showToast(`${created.id} submitted${totalCost > 50 ? ' for Principal approval' : ''} · ${inr(totalCost)} estimated retrieval charge.`);
  };

  const saveDraft = () => {
    if (!chosen.length) { showToast('Select at least one file to save this draft.'); return; }
    const draft = { selectedFiles, speed, accessWindow, customDays, reason, attachmentName, notifyApp, notifyEmail, notifySms, savedAt: new Date().toISOString() };
    try { window.localStorage.setItem('k12-archive-retrieval-draft-v1', JSON.stringify(draft)); } catch { /* storage is optional */ }
    showToast('Retrieval request draft saved in this browser.');
  };

  const cancelRequest = (request: ArchiveRetrievalRequest) => {
    const next = { ...workflow, retrievals: workflow.retrievals.map((item) => item.id === request.id ? { ...item, status: 'Cancelled' as const } : item) };
    saveArchiveWorkflowState(next);
    setWorkflow(next);
    showToast(`${request.id} cancelled. No temporary data was kept.`);
  };

  const markComplete = (request: ArchiveRetrievalRequest) => {
    const next = completeRetrieval(request.id);
    setWorkflow(next);
    setTab(TABS[2]);
    setViewerRequest(request.id);
    showToast(`${request.id} is complete. Retrieved records are now available in the viewer.`);
  };

  const progressRequest = (request: ArchiveRetrievalRequest) => {
    const nextProgress = Math.min(90, request.progress + 10);
    const next = setRetrievalProgress(request.id, nextProgress);
    setWorkflow(next);
    showToast(`${request.id} progress updated to ${nextProgress}%.`);
  };

  const toggleEmailOnCompletion = (request: ArchiveRetrievalRequest) => {
    const next = { ...workflow, retrievals: workflow.retrievals.map((item) => item.id === request.id ? { ...item, notificationEmail: !item.notificationEmail } : item) };
    saveArchiveWorkflowState(next);
    setWorkflow(next);
    showToast(request.notificationEmail ? 'Completion email notification disabled.' : 'Completion email notification enabled.');
  };

  const extendAccess = (requestId: string) => {
    const request = workflow.retrievals.find((item) => item.id === requestId);
    if (!request) return;
    const base = Math.max(Date.now(), request.expiresAt ? new Date(request.expiresAt).getTime() : Date.now());
    const nextExpiry = new Date(base + 24 * 60 * 60 * 1000).toISOString();
    const next = { ...workflow, retrievals: workflow.retrievals.map((item) => item.id === requestId ? { ...item, expiresAt: nextExpiry } : item) };
    saveArchiveWorkflowState(next);
    setWorkflow(next);
    showToast(`${requestId} access extended by 24 hours until ${formatArchiveDate(nextExpiry)}.`);
  };

  const reRequest = (request: ArchiveRetrievalRequest) => {
    const created = enqueueRetrieval({
      items: request.items,
      speed: request.speed,
      accessHours: request.accessHours,
      reason: `Re-retrieval: ${request.reason}`,
      requestedBy: 'Finance Manager — Priya Gupta',
      approval: request.approval,
      costINR: request.costINR,
      notificationInApp: request.notificationInApp,
      notificationEmail: request.notificationEmail,
      notificationSms: request.notificationSms
    });
    setWorkflow(loadArchiveWorkflowState());
    setTab(TABS[1]);
    showToast(`${created.id} created from ${request.id}.`);
  };

  const exportHistory = () => {
    downloadCsv('archive-retrieval-history.csv', ['Retrieval ID', 'Requested At', 'Requested By', 'Files', 'Speed', 'Reason', 'Cost INR', 'Status', 'Progress', 'Expires At'],
      filteredHistory.map((request) => [request.id, request.requestedAt, request.requestedBy, request.items.map((item) => item.name).join('; '), request.speed, request.reason, request.costINR, request.status, request.progress, request.expiresAt || '']));
    showToast(`${filteredHistory.length} retrieval request(s) exported as CSV.`);
  };

  const allRequestOptions = workflow.retrievals.filter((request) => request.status === 'Complete');
  const selectedCompletedRequest = viewerRequest === 'All Requests' ? undefined : workflow.retrievals.find((request) => request.id === viewerRequest);

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={DownloadCloud}
        title="Retrieval Management"
        screen="Retrieval Management"
        restricted="Cold-storage retrieval charges are estimates in this frontend-only workflow; approval is required above ₹50 per request"
        actions={<>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => { setWorkflow(loadArchiveWorkflowState()); showToast('Retrieval requests refreshed from this browser.'); }}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh Status</Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={exportHistory}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export History</Button>
        </>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={Clock} label="Active Retrievals" value={`${activeRequests.length} Request${activeRequests.length === 1 ? '' : 's'}`} sub="Queued or in progress" />
        <KpiCard icon={CheckCircle2} label="Completed This Month" value={`${completedThisMonth.length} Request${completedThisMonth.length === 1 ? '' : 's'}`} tone="text-emerald-700" sub="Only complete requests" />
        <KpiCard icon={Database} label="Data in Temporary Access" value={formatBytes(temporarySizeMB)} sub={`${temporaryRecords.length} record(s) across ${temporaryRequestIds.size} active temporary retrieval(s)`} />
        <KpiCard icon={AlarmClock} label="Expiring Within 6 Hrs" value={`${workflow.retrievals.filter((request) => request.status === 'Complete' && request.expiresAt && new Date(request.expiresAt).getTime() - Date.now() <= 6 * 60 * 60 * 1000 && new Date(request.expiresAt).getTime() > Date.now()).length} Request(s)`} tone="text-amber-700" sub="Completed temporary copies" />
        <KpiCard icon={IndianRupee} label="Cost This Month" value={inr(costThisMonth)} sub={`${workflow.retrievals.filter((request) => new Date(request.requestedAt) >= monthStart).length} request(s) · estimated`} />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((item) => <button key={item} onClick={() => setTab(item)} className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${tab === item ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{item}</button>)}
      </div>

      {tab === TABS[0] && <Panel icon={DownloadCloud} title="New Retrieval Request" subtitle="Select cold-storage files, choose retrieval speed, define temporary access and submit for approval">
        <div className="p-5 space-y-5">
          <section className="space-y-3"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">1. Select cold-storage files</p>
            <div className="flex flex-col sm:flex-row gap-2"><div className="relative flex-1"><Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" /><input value={fileSearch} onChange={(event) => setFileSearch(event.target.value)} placeholder="Search file, module, type or reference" className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs" /></div><Button variant="outline" size="sm" className="text-xs" onClick={() => setFileSearch(fileSearch.trim())}><Search className="w-3.5 h-3.5 mr-1.5" />Apply Search</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3"><label className="text-[11px] text-gray-600">Module<select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white"><option>All</option>{Array.from(new Set(COLD_FILES.map((file) => file.module))).map((moduleName) => <option key={moduleName}>{moduleName}</option>)}</select></label><label className="text-[11px] text-gray-600">Data Type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white"><option>All</option>{Array.from(new Set(COLD_FILES.map((file) => file.type))).map((type) => <option key={type}>{type}</option>)}</select></label><label className="text-[11px] text-gray-600">Period<select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white"><option>All</option>{Array.from(new Set(COLD_FILES.map((file) => file.year))).map((year) => <option key={year}>{year}</option>)}</select></label></div>
            <div className="overflow-x-auto rounded-lg border border-gray-200"><table className="w-full min-w-[740px] text-left text-xs border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={TH}>File Name</th><th className={TH}>Module / Type</th><th className={TH}>Period</th><th className={TH}>Size</th><th className={TH}>Standard Cost</th><th className={`${TH} text-center`}>Select</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredCold.map((file) => <tr key={file.id} className={selectedFiles.includes(file.id) ? 'bg-indigo-50/40' : ''}><td className="p-3 font-mono text-gray-800">{file.name}</td><td className="p-3 text-gray-700">{file.module} · {file.type}</td><td className="p-3 text-gray-700">{file.year}</td><td className="p-3 text-gray-700">{file.sizeMB} MB</td><td className="p-3 text-gray-700">{inr(file.costINR)}</td><td className="p-3 text-center"><input type="checkbox" checked={selectedFiles.includes(file.id)} onChange={() => toggleFile(file.id)} aria-label={`Select ${file.name}`} /></td></tr>)}{filteredCold.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No cold-storage files match those filters.</td></tr>}</tbody></table></div>
            <p className="text-[11px] text-gray-600">Selected: <strong>{chosen.length} file(s)</strong> · <strong>{totalSize} MB</strong></p>
          </section>

          <section className="space-y-3"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">2. Retrieval speed and estimated cost</p><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{SPEEDS.map((option) => { const cost = Math.round(totalSize * option.rate); return <button key={option.id} onClick={() => setSpeed(option.id)} className={`rounded-lg border p-3 text-left transition-colors ${speed === option.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-900">{option.icon} {option.id}</span><span className="text-xs font-bold text-gray-900">{inr(cost)}</span></div><p className="text-[11px] text-gray-500 mt-1">{option.time} · {option.note}{speed === option.id ? ' · Selected' : ''}</p></button>; })}</div><p className="text-[11px] text-gray-500">Rate estimate: expedited ₹1.50/MB · standard ₹0.30/MB · bulk ₹0.10/MB. Final provider charges may differ.</p></section>

          <section className="space-y-3"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">3. Temporary access window</p><div className="flex flex-wrap items-center gap-4 text-xs">{['24 hours', '72 hours', '7 days'].map((windowChoice) => <label key={windowChoice} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="access" checked={accessWindow === windowChoice} onChange={() => setAccessWindow(windowChoice)} /><span>{windowChoice}{windowChoice === '72 hours' ? ' · Recommended' : ''}</span></label>)}<label className="flex items-center gap-2"><input type="radio" name="access" checked={accessWindow === 'Custom'} onChange={() => setAccessWindow('Custom')} />Custom days <input type="number" min={1} max={365} value={customDays} onChange={(event) => setCustomDays(Math.max(1, Number(event.target.value) || 1))} disabled={accessWindow !== 'Custom'} className="w-20 p-1 border border-gray-300 rounded text-xs disabled:bg-gray-100" /></label></div><p className="text-[11px] text-gray-500">At expiry, the temporary ERP copy is removed. The cold-storage original remains unchanged.</p></section>

          <section className="space-y-3"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">4. Purpose and supporting document</p><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for retrieval" className="w-full p-2 border border-gray-300 rounded-md text-xs" /><label className="flex items-center gap-2 text-xs text-gray-700 rounded-md border border-gray-300 px-3 py-2 cursor-pointer"><Paperclip className="w-4 h-4" /><span>{attachmentName || 'Upload IT Notice (Optional)'}</span><input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" className="sr-only" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || '')} /></label></div></section>

          <section className="space-y-2"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">5. Approval</p><div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700"><p>Estimated cost: <strong>{inr(totalCost)}</strong></p><p>Requested by: <strong>Finance Manager — Priya Gupta</strong></p><p>Approval: <strong>{approval}</strong></p></div></section>

          <section className="space-y-2"><p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1">6. Notifications</p><div className="flex flex-wrap gap-4 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={notifyApp} onChange={(event) => setNotifyApp(event.target.checked)} />In-app when ready</label><label className="flex items-center gap-2"><input type="checkbox" checked={notifyEmail} onChange={(event) => setNotifyEmail(event.target.checked)} />Email when ready</label><label className="flex items-center gap-2"><input type="checkbox" checked={notifySms} onChange={(event) => setNotifySms(event.target.checked)} />SMS when ready</label></div></section>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 px-4 py-3 text-xs text-indigo-900"><strong>SUMMARY:</strong> {chosen.length} file(s) · {formatBytes(totalSize)} · {speed} · {accessHoursFor(accessWindow, customDays)} hours access · {inr(totalCost)} estimated</div>
          <div className="flex flex-wrap gap-2"><Button size="sm" onClick={submitRequest} disabled={!chosen.length}><DownloadCloud className="w-3.5 h-3.5 mr-1.5" />Submit Request</Button><Button variant="outline" size="sm" onClick={saveDraft}><FileDown className="w-3.5 h-3.5 mr-1.5" />Save as Draft</Button><Button variant="ghost" size="sm" onClick={() => { setSelectedFiles([]); setReason(''); setAttachmentName(''); showToast('The current request form was cleared.'); }}>Clear Form</Button></div>
        </div>
      </Panel>}

      {tab === TABS[1] && <Panel icon={Clock} title="Active Retrievals — Request Tracker" subtitle={`${activeRequests.length} queued or in-progress request(s)`} actions={<Button variant="outline" size="sm" className="text-xs" onClick={() => { setWorkflow(loadArchiveWorkflowState()); showToast('Tracker refreshed.'); }}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>}>
        <div className="p-5 space-y-4">{activeRequests.map((request) => <div key={request.id} className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 space-y-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-mono text-xs font-bold text-indigo-800">{request.id}</p><p className="mt-1 text-xs text-gray-700">{request.items.length} file(s) · {request.items.map((item) => item.module).filter((value, index, arr) => arr.indexOf(value) === index).join(', ')} · {request.speed}</p><p className="mt-1 text-[11px] text-gray-500">Requested by {request.requestedBy} · {formatArchiveDate(request.requestedAt)}</p></div><Pill tone={request.status === 'Queued' ? 'amber' : 'blue'}>{request.status}</Pill></div><div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700"><p>Purpose: <strong>{request.reason}</strong></p><p>Approval: <strong>{request.approval}</strong></p><p>Access window: <strong>{request.accessHours} hours</strong></p><p>Estimated cost: <strong>{inr(request.costINR)}</strong></p>{request.attachmentName && <p>Attachment: <strong>{request.attachmentName}</strong></p>}</div><ProgressBar value={request.progress} max={100} color="bg-indigo-500" label={`${request.progress}% complete · ${request.status === 'Queued' ? 'awaiting provider / approval' : 'simulated frontend progress'}`} /><div className="overflow-x-auto rounded-lg border border-white"><table className="w-full text-left text-xs"><thead><tr className="bg-white"><th className={TH}>File</th><th className={TH}>Module</th><th className={TH}>Size</th><th className={TH}>Cost</th><th className={TH}>Status</th></tr></thead><tbody className="divide-y divide-gray-100">{request.items.map((item) => <tr key={item.id} className="bg-white"><td className="p-3 font-mono text-gray-800">{item.name}</td><td className="p-3 text-gray-700">{item.module}</td><td className="p-3 text-gray-700">{item.sizeMB} MB</td><td className="p-3 text-gray-700">{inr(item.costINR)}</td><td className="p-3 text-gray-700">{request.status}</td></tr>)}</tbody></table></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" className="text-xs" onClick={() => progressRequest(request)} disabled={request.progress >= 90}>Simulate Progress +10%</Button><Button size="sm" className="text-xs" onClick={() => markComplete(request)}><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Mark Complete & Load Data</Button><Button variant="outline" size="sm" className="text-xs" onClick={() => toggleEmailOnCompletion(request)}><Mail className="w-3.5 h-3.5 mr-1.5" />{request.notificationEmail ? 'Disable Email Alert' : 'Email When Done'}</Button><Button variant="outline" size="sm" className="text-xs text-rose-700 border-rose-200" onClick={() => cancelRequest(request)}><XCircle className="w-3.5 h-3.5 mr-1.5" />Cancel</Button></div></div>)}{activeRequests.length === 0 && <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500"><Clock className="mx-auto mb-2 h-6 w-6 text-gray-400" /><p className="font-semibold text-gray-700">No active retrieval requests</p><p className="mt-1 text-xs">Submit a cold-storage request to start the workflow.</p><Button size="sm" className="mt-4" onClick={() => setTab(TABS[0])}>Create Retrieval Request</Button></div>}</div>
      </Panel>}

      {tab === TABS[2] && <Panel icon={BarChart3} title={`Retrieved Data${selectedCompletedRequest ? ` — ${selectedCompletedRequest.id}` : ''}`} subtitle="Only completed requests with an unexpired temporary copy are listed" actions={<><Button variant="outline" size="sm" className="text-xs" disabled={!selectedCompletedRequest} onClick={() => selectedCompletedRequest && extendAccess(selectedCompletedRequest.id)}>Extend 24 Hours</Button><Button size="sm" className="text-xs" disabled={!viewerRecords.length} onClick={() => exportRetrievedRecords(viewerRecords, 'retrieved-cold-storage-data.csv')}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export All</Button></>}>
        <div className="p-5 space-y-4"><div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900"><span>⚠️</span><p>This is a temporary, read-only copy. The original remains in cold storage. Edit, delete and create actions are unavailable; expired temporary copies are hidden.</p></div><div className="flex flex-col md:flex-row gap-2"><input value={viewerSearch} onChange={(event) => setViewerSearch(event.target.value)} placeholder="Search retrieved data" className="flex-1 p-2 border border-gray-300 rounded-md text-xs" /><select value={viewerType} onChange={(event) => setViewerType(event.target.value)} className="p-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Types</option>{Array.from(new Set(workflow.retrievedRecords.map((record) => record.type))).map((type) => <option key={type}>{type}</option>)}</select><select value={viewerRequest} onChange={(event) => setViewerRequest(event.target.value)} className="p-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Requests</option>{allRequestOptions.map((request) => <option key={request.id} value={request.id}>{request.id}</option>)}</select><Button variant="outline" size="sm" className="text-xs" disabled={!viewerRecords.length} onClick={() => exportRetrievedRecords(viewerRecords, 'retrieved-filtered-data.csv')}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Filtered</Button></div><div className="overflow-x-auto rounded-lg border border-gray-200"><table className="w-full min-w-[980px] text-left text-xs border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={TH}>Reference</th><th className={TH}>Date</th><th className={TH}>Module / Type</th><th className={TH}>Retrieved Data</th><th className={TH}>Period</th><th className={TH}>Request / Cost</th><th className={`${TH} text-right`}>Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{viewerRecords.map((record) => <tr key={record.id} className="hover:bg-indigo-50/30"><td className="p-3 font-mono text-indigo-700">{record.reference}</td><td className="p-3 text-gray-600 whitespace-nowrap">{record.date}</td><td className="p-3 text-gray-700">{record.module} / {record.type}</td><td className="p-3 font-medium text-gray-800">{record.title}</td><td className="p-3 text-gray-600">{record.period}</td><td className="p-3 text-gray-700"><span className="font-mono">{record.retrievalId}</span><br />{inr(record.costINR)}</td><td className="p-3 text-right"><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setDetail(record)}><Eye className="w-3 h-3 mr-1" />View</Button></td></tr>)}{viewerRecords.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-gray-500"><Database className="mx-auto mb-2 h-6 w-6 text-gray-400" /><p className="font-semibold text-gray-700">No retrieved data available</p><p className="mt-1 text-xs">Complete a retrieval request to display its returned records here.</p></td></tr>}</tbody></table></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" className="text-xs" disabled={!viewerRecords.length} onClick={() => window.print()}><Printer className="w-3.5 h-3.5 mr-1.5" />Print Summary</Button><Button variant="outline" size="sm" className="text-xs" onClick={() => setTab(TABS[0])}><DownloadCloud className="w-3.5 h-3.5 mr-1.5" />Request New Retrieval</Button></div></div>
      </Panel>}

      {tab === TABS[3] && <Panel icon={Clock} title="Retrieval History" subtitle="Every request created in this browser, including queue, completion and cancellation" actions={<><select value={historyStatus} onChange={(event) => setHistoryStatus(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Status</option><option>Active</option><option>Done</option><option>Cancelled</option></select><select value={historyPeriod} onChange={(event) => setHistoryPeriod(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option>All Time</option><option>This Month</option><option>Last 3 Months</option></select><Button variant="outline" size="sm" className="text-xs" onClick={exportHistory}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export History CSV</Button></>}>
        <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs border-collapse" data-testid="retrieval-history"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={`${TH} w-12 text-center`}>#</th><th className={TH}>Retrieval ID</th><th className={TH}>Requested By</th><th className={TH}>Files</th><th className={TH}>Speed</th><th className={TH}>Cost</th><th className={TH}>Status</th><th className={TH}>Requested</th><th className={`${TH} text-right`}>Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredHistory.map((request, index) => <tr key={request.id} className="hover:bg-indigo-50/20"><td className="p-3 text-center text-gray-400">{index + 1}</td><td className="p-3 font-mono font-semibold text-indigo-700">{request.id}</td><td className="p-3 text-gray-700">{request.requestedBy}</td><td className="p-3 text-gray-700">{request.items.length} · {request.items.map((item) => item.name).join(', ')}</td><td className="p-3 text-gray-700">{request.speed}</td><td className="p-3 font-semibold">{inr(request.costINR)}</td><td className="p-3"><Pill tone={request.status === 'Complete' ? 'green' : request.status === 'Cancelled' ? 'rose' : 'amber'}>{request.status}</Pill></td><td className="p-3 whitespace-nowrap text-gray-600">{formatArchiveDate(request.requestedAt)}</td><td className="p-3"><div className="flex justify-end gap-1">{request.status === 'Complete' ? <><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => { setViewerRequest(request.id); setTab(TABS[2]); }}><Eye className="w-3 h-3 mr-1" />View Data</Button><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => exportRetrievedRecords(workflow.retrievedRecords.filter((record) => record.retrievalId === request.id), `${request.id.toLowerCase()}-retrieved.csv`)}><FileDown className="w-3 h-3 mr-1" />Export</Button></> : request.status === 'Cancelled' ? <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => reRequest(request)}><DownloadCloud className="w-3 h-3 mr-1" />Re-request</Button> : <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setTab(TABS[1])}>Track</Button>}</div></td></tr>)}{filteredHistory.length === 0 && <tr><td colSpan={9} className="p-10 text-center text-gray-500">No retrieval requests match the selected history filters.</td></tr>}</tbody></table></div><div className="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-500">Complete requests create temporary viewable data until expiry; cancelled requests remain in the audit history but expose no retrieved records.</div>
      </Panel>}

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail ? `Retrieved Record — ${detail.reference}` : ''} size="lg">
        {detail && <div className="space-y-4 text-xs"><div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"><p className="font-bold text-gray-900">{detail.title}</p><p className="mt-1 text-gray-600">{detail.module} · {detail.type} · {detail.period}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700"><p>Reference: <strong className="font-mono">{detail.reference}</strong></p><p>Date: <strong>{detail.date}</strong></p><p>Amount / Score: <strong>{detail.amount}</strong></p><p>Student / Entity: <strong>{detail.student || '—'}</strong></p><p>Source file: <strong className="font-mono">{detail.fileName}</strong></p><p>Retrieval request: <strong className="font-mono">{detail.retrievalId}</strong></p><p>Retrieved at: <strong>{formatArchiveDate(detail.retrievedAt)}</strong></p><p>Estimated retrieval charge: <strong>{inr(detail.costINR)}</strong></p></div><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => exportRetrievedRecords([detail], `${detail.retrievalId.toLowerCase()}-record.csv`)}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Record</Button><Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-3.5 h-3.5 mr-1.5" />Print</Button><Button size="sm" onClick={() => setDetail(null)}>Close</Button></div></div>}
      </Modal>

      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

export default RetrievalManagement;
