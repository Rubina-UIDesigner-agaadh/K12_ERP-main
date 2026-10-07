// Archive Management ▸ Cold Storage Manager
// Frontend-only cold push, retrieval and deletion-approval flows. All detail and
// confirmation panels are centered modals; requests persist in archive workflow state.
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import {
  Snowflake, Package, Trash2, UploadCloud, Search, RefreshCw, Info,
  DownloadCloud, FileDown, CheckCircle2, CheckCircle, ShieldAlert
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH } from './archiveUi';
import {
  ArchiveRetrievalItem, downloadCsv, enqueueRetrieval,
  loadArchiveWorkflowState, saveArchiveWorkflowState,
  subscribeToArchiveWorkflowState
} from './archiveWorkflowState';

interface ColdFile {
  id: string;
  name: string;
  module: string;
  period: string;
  compressed: number;
  original: number;
  pushed: string;
  retrievals: number;
  eligibleForDeletion?: boolean;
}
interface PushCandidate { id: string; module: string; detail: string; age: string; fileCount: number; sizeGB: number; period: string }

const INITIAL_FILES: ColdFile[] = [
  { id: 'c1', name: 'GL_FY2019-20_JournalEntries.gz.enc', module: 'Finance', period: 'FY 19-20', compressed: 118, original: 405, pushed: '01-Apr-22', retrievals: 2 },
  { id: 'c2', name: 'FEE_FY2019-20_Receipts.gz.enc', module: 'Fee', period: 'FY 19-20', compressed: 78, original: 285, pushed: '01-Apr-22', retrievals: 1 },
  { id: 'c3', name: 'PAYROLL_FY2019-20_Monthly.gz.enc', module: 'Payroll', period: 'FY 19-20', compressed: 62, original: 225, pushed: '01-Apr-22', retrievals: 0 },
  { id: 'c4', name: 'ATTEND_FY2019-20_Employee.gz.enc', module: 'HR', period: 'FY 19-20', compressed: 88, original: 320, pushed: '01-Apr-22', retrievals: 1 },
  { id: 'c5', name: 'ATTEND_FY2019-20_Student.gz.enc', module: 'Academic', period: 'FY 19-20', compressed: 105, original: 425, pushed: '01-Apr-22', retrievals: 0 },
  { id: 'c6', name: 'EXAM_FY2019-20_Marks.gz.enc', module: 'Exam', period: 'FY 19-20', compressed: 42, original: 165, pushed: '01-Apr-22', retrievals: 0 },
  { id: 'c7', name: 'GL_FY2018-19_JournalEntries.gz.enc', module: 'Finance', period: 'FY 18-19', compressed: 112, original: 390, pushed: '01-Apr-21', retrievals: 3 },
  { id: 'c8', name: 'FEE_FY2018-19_Receipts.gz.enc', module: 'Fee', period: 'FY 18-19', compressed: 72, original: 265, pushed: '01-Apr-21', retrievals: 2 },
  { id: 'c9', name: 'GL_FY2016-17_JournalEntries.gz.enc', module: 'Finance', period: 'FY 16-17', compressed: 95, original: 340, pushed: '01-Apr-19', retrievals: 1, eligibleForDeletion: true },
  { id: 'c10', name: 'FEE_FY2016-17_Receipts.gz.enc', module: 'Fee', period: 'FY 16-17', compressed: 65, original: 235, pushed: '01-Apr-19', retrievals: 0, eligibleForDeletion: true }
];
const INITIAL_CANDIDATES: PushCandidate[] = [
  { id: 'p1', module: 'Audit Logs', detail: '3 files · 2.1 GB in Archive DB', age: '2 years in archive', fileCount: 3, sizeGB: 2.1, period: 'FY 2022-23' },
  { id: 'p2', module: 'Attendance', detail: '2 files · 1.4 GB in Archive DB', age: '3 years in archive', fileCount: 2, sizeGB: 1.4, period: 'FY 2021-22' },
  { id: 'p3', module: 'Notifications', detail: '5 files · 0.6 GB in Archive DB', age: '1 year in archive', fileCount: 5, sizeGB: 0.6, period: 'FY 2023-24' }
];
const TABS = ['📦 All Files', '📤 Eligible for Cold Push', '🗑️ Eligible for Deletion', '📋 Upload History'];
const todayLabel = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

export function ColdStorageManager() {
  const [tab, setTab] = useState(TABS[0]);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [infoFile, setInfoFile] = useState<ColdFile | null>(null);
  const [pendingRetrieve, setPendingRetrieve] = useState<ColdFile[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ColdFile[] | null>(null);
  const [pushTarget, setPushTarget] = useState<PushCandidate | null>(null);
  const [workflow, setWorkflow] = useState(() => loadArchiveWorkflowState());
  const [lastSynced, setLastSynced] = useState('Not synced this session');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => subscribeToArchiveWorkflowState(() => setWorkflow(loadArchiveWorkflowState())), []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const currentFiles = useMemo(() => files.filter((file) => {
    if (tab === TABS[1] && file.eligibleForDeletion) return false;
    if (tab === TABS[2] && !file.eligibleForDeletion) return false;
    return (!search || `${file.name} ${file.module} ${file.period}`.toLowerCase().includes(search.toLowerCase())) &&
      (moduleFilter === 'All' || file.module === moduleFilter) &&
      (periodFilter === 'All' || file.period === periodFilter);
  }), [files, tab, search, moduleFilter, periodFilter]);

  const totalCompressed = files.reduce((sum, file) => sum + file.compressed, 0) / 1024;
  const totalOriginal = files.reduce((sum, file) => sum + file.original, 0) / 1024;
  const eligibleFiles = files.filter((file) => file.eligibleForDeletion);
  const requestedDeletionIds = new Set(workflow.deletionRequests.map((request) => request.fileId));
  const pendingRequests = workflow.retrievals.filter((request) => request.status === 'Queued' || request.status === 'In Progress');

  const toggle = (id: string) => setSelected((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]);
  const selectVisible = (checked: boolean) => setSelected((previous) => checked ? Array.from(new Set([...previous, ...currentFiles.map((file) => file.id)])) : previous.filter((id) => !currentFiles.some((file) => file.id === id)));
  const openRetrieval = (items: ColdFile[]) => {
    if (!items.length) { showToast('Select one or more files to request retrieval.'); return; }
    setPendingRetrieve(items);
  };
  const confirmRetrieval = () => {
    if (!pendingRetrieve?.length) return;
    const items: ArchiveRetrievalItem[] = pendingRetrieve.map((file) => ({
      id: file.id, name: file.name, module: file.module, sizeMB: file.compressed,
      costINR: Math.round(file.compressed * 0.3), reference: file.name.replace(/\.gz\.enc$/, ''),
      type: `${file.module} archive`, description: `${file.module} cold-storage data`, date: file.pushed,
      amount: '—', period: file.period
    }));
    const cost = items.reduce((sum, item) => sum + item.costINR, 0);
    const request = enqueueRetrieval({
      items, speed: 'Standard', accessHours: 72, reason: 'Requested from Cold Storage Manager',
      requestedBy: 'Super Admin', approval: cost > 50 ? 'Principal approval' : 'Super Admin', costINR: cost,
      notificationInApp: true, notificationEmail: true
    });
    setPendingRetrieve(null); setSelected([]);
    showToast(`${request.id} queued for ${items.length} file(s) · estimated ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cost)}.`);
  };
  const openDeletionRequest = (items: ColdFile[]) => {
    const eligible = items.filter((file) => file.eligibleForDeletion);
    if (!eligible.length) { showToast('No eligible files were selected for deletion approval.'); return; }
    setPendingDelete(eligible);
  };
  const confirmDeletionRequest = () => {
    if (!pendingDelete?.length) return;
    const next = {
      ...workflow,
      deletionRequests: [
        ...workflow.deletionRequests.filter((request) => !pendingDelete.some((file) => file.id === request.fileId)),
        ...pendingDelete.map((file) => ({ fileId: file.id, requestedAt: new Date().toISOString(), status: 'Pending Approval' as const }))
      ]
    };
    saveArchiveWorkflowState(next); setWorkflow(next); setPendingDelete(null); setSelected([]);
    showToast(`Deletion request submitted for ${pendingDelete.length} file(s). No data was deleted; approvals are still required.`);
  };
  const commitColdPush = () => {
    if (!pushTarget) return;
    const compressedTotal = Math.max(1, Math.round(pushTarget.sizeGB * 1024));
    const filesToAdd = Array.from({ length: pushTarget.fileCount }, (_, index): ColdFile => ({
      id: `${pushTarget.id}-${Date.now()}-${index + 1}`,
      name: `${pushTarget.module.replace(/\s+/g, '_').toUpperCase()}_${pushTarget.period.replace(/\s+/g, '')}_Part${index + 1}.gz.enc`,
      module: pushTarget.module, period: pushTarget.period,
      compressed: Math.max(1, Math.round(compressedTotal / pushTarget.fileCount)),
      original: Math.max(1, Math.round(compressedTotal / pushTarget.fileCount * 3.3)),
      pushed: todayLabel(), retrievals: 0
    }));
    setFiles((previous) => [...filesToAdd, ...previous]);
    setCandidates((previous) => previous.filter((candidate) => candidate.id !== pushTarget.id));
    const label = pushTarget.module;
    setPushTarget(null);
    showToast(`${label}: ${filesToAdd.length} file(s) indexed in Cold Storage.`);
  };
  const exportFiles = (records: ColdFile[], filename = 'cold-storage-files.csv') => {
    downloadCsv(filename, ['File', 'Module', 'Period', 'Compressed MB', 'Original MB', 'Pushed', 'Retrievals', 'Deletion Eligible', 'Approval Status'], records.map((file) => [file.name, file.module, file.period, file.compressed, file.original, file.pushed, file.retrievals, file.eligibleForDeletion ? 'Yes' : 'No', requestedDeletionIds.has(file.id) ? 'Pending Approval' : '—']));
    showToast(`${records.length} file record(s) exported as CSV.`);
  };
  const modules = Array.from(new Set(files.map((file) => file.module)));
  const periods = Array.from(new Set(files.map((file) => file.period)));

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader icon={Snowflake} title="Cold Storage Manager" screen="Cold Storage Manager" actions={<>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => { setLastSynced(new Date().toLocaleString('en-IN')); showToast('Cold-storage file index refreshed in this browser.'); }}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Sync Index</Button>
        <Button size="sm" className="text-xs bg-sky-600 hover:bg-sky-700 text-white" onClick={() => { setTab(TABS[1]); setPushTarget(candidates[0] || null); if (!candidates.length) showToast('No archive files currently meet the cold-push criteria.'); }}><UploadCloud className="w-3.5 h-3.5 mr-1.5" />Push New Archive</Button>
      </>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard icon={Snowflake} label="Cold Storage Used" value={`${totalCompressed.toFixed(1)} GB`} sub={`Compressed · ~${totalOriginal.toFixed(0)} GB original`} />
        <KpiCard icon={Package} label="Indexed Files" value={`${files.length} Files`} sub={lastSynced === 'Not synced this session' ? lastSynced : `Synced ${lastSynced}`} />
        <KpiCard icon={Trash2} label="Eligible for Deletion" value={`${eligibleFiles.length} Files`} tone="text-rose-700" sub={`${Array.from(requestedDeletionIds).filter((id) => eligibleFiles.some((file) => file.id === id)).length} pending approval`} />
        <KpiCard icon={UploadCloud} label="Eligible for Cold Push" value={`${candidates.length} Modules`} tone="text-sky-700" sub="Review and push from Archive DB" />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">{TABS.map((label) => <button key={label} onClick={() => setTab(label)} className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${tab === label ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{label}</button>)}</div>

      {tab === TABS[1] && <Panel icon={UploadCloud} title="Files Eligible for Cold Push" subtitle="Review archive candidates before adding them to the cold-storage index"><div className="divide-y divide-gray-100">{candidates.map((candidate) => <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3"><div><p className="text-xs font-semibold text-gray-900">{candidate.module}</p><p className="text-[11px] text-gray-500">{candidate.detail} · {candidate.age} · Period {candidate.period}</p></div><Button size="sm" className="h-7 text-[11px] bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setPushTarget(candidate)}><Snowflake className="w-3 h-3 mr-1" />Push to Cold</Button></div>)}{candidates.length === 0 && <p className="p-8 text-center text-xs text-gray-500">No archive candidates remain. New candidate data would appear after the archive index refreshes.</p>}</div></Panel>}

      {tab === TABS[2] && <Panel icon={Trash2} title="Files Eligible for Deletion" subtitle="Retention period is met; removal still requires Super Admin, Principal and Management approval"><div className="divide-y divide-gray-100">{eligibleFiles.map((file) => <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3"><div><p className="text-xs font-semibold text-gray-900 font-mono">{file.name}</p><p className="text-[11px] text-gray-500">{file.module} · {file.period} · {file.compressed} MB compressed · pushed {file.pushed} · retention met</p></div><div className="flex items-center gap-2">{requestedDeletionIds.has(file.id) && <Pill tone="amber">Pending Approval</Pill>}<Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setInfoFile(file)}><Info className="w-3 h-3 mr-1" />Review</Button><Button variant="outline" size="sm" className="h-7 text-[11px] text-rose-700 border-rose-200" onClick={() => openDeletionRequest([file])}><Trash2 className="w-3 h-3 mr-1" />Request Delete</Button></div></div>)}{eligibleFiles.length === 0 && <p className="p-8 text-center text-xs text-gray-500">No files currently meet the configured deletion retention period.</p>}</div></Panel>}

      {tab === TABS[3] && <Panel icon={UploadCloud} title="Cold Storage Upload History" subtitle="Indexed files and their provider push dates" actions={<Button variant="outline" size="sm" className="text-xs" onClick={() => exportFiles(files, 'cold-storage-upload-history.csv')}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export History</Button>}><div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={TH}>Pushed On</th><th className={TH}>File</th><th className={TH}>Size</th><th className={TH}>Status</th><th className={TH}>Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{files.map((file) => <tr key={file.id}><td className="p-3 text-gray-600">{file.pushed}</td><td className="p-3 font-mono text-gray-800">{file.name}</td><td className="p-3 text-gray-700">{file.compressed} MB</td><td className="p-3"><Pill tone="green">Uploaded</Pill></td><td className="p-3"><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setInfoFile(file)}><Info className="w-3 h-3 mr-1" />Details</Button></td></tr>)}</tbody></table></div></Panel>}

      {(tab === TABS[0] || tab === TABS[1] || tab === TABS[2]) && <Panel icon={Snowflake} title="Cold Storage Files — AWS S3 Glacier" subtitle="Provider: AWS S3 Glacier · Region: ap-south-1 (Mumbai) · Vault: school-xyz-archive" actions={<><div className="relative"><Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search files..." className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs w-52" /></div><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option value="All">Module: All</option>{modules.map((item) => <option key={item}>{item}</option>)}</select><select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white"><option value="All">Period: All</option>{periods.map((item) => <option key={item}>{item}</option>)}</select></>}>
        <div className="overflow-x-auto"><table className="w-full min-w-[1200px] text-left text-xs border-collapse" data-testid="cold-table"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={`${TH} w-10`}><input type="checkbox" aria-label="Select all visible files" checked={currentFiles.length > 0 && currentFiles.every((file) => selected.includes(file.id))} onChange={(event) => selectVisible(event.target.checked)} /></th><th className={TH}>File Name</th><th className={TH}>Module</th><th className={TH}>Period</th><th className={TH}>Compressed</th><th className={TH}>Original</th><th className={TH}>Pushed Date</th><th className={TH}>Retrieval Count</th><th className={`${TH} text-right`}>Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{currentFiles.map((file) => <tr key={file.id} className="hover:bg-sky-50/20"><td className="p-3"><input type="checkbox" checked={selected.includes(file.id)} onChange={() => toggle(file.id)} aria-label={`Select ${file.name}`} /></td><td className="p-3 font-mono text-gray-800">{file.name}</td><td className="p-3 text-gray-700">{file.module}</td><td className="p-3 text-gray-700 whitespace-nowrap">{file.period}</td><td className="p-3 text-gray-700">{file.compressed} MB</td><td className="p-3 text-gray-700">{file.original} MB</td><td className="p-3 text-gray-600">{file.pushed}</td><td className="p-3 text-gray-600">{file.retrievals} {file.retrievals === 1 ? 'time' : 'times'}</td><td className="p-3"><div className="flex items-center justify-end gap-1 flex-wrap"><button onClick={() => setInfoFile(file)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View file information"><Info className="w-4 h-4" /></button><Button variant="outline" size="sm" className="h-7 text-[10px] text-sky-700 border-sky-200" onClick={() => openRetrieval([file])}><DownloadCloud className="w-3 h-3 mr-1" />Retrieve</Button>{file.eligibleForDeletion && <Pill tone={requestedDeletionIds.has(file.id) ? 'amber' : 'rose'}>{requestedDeletionIds.has(file.id) ? 'Delete Pending' : 'Eligible for Delete'}</Pill>}</div></td></tr>)}{currentFiles.length === 0 && <tr><td colSpan={9} className="p-10 text-center text-gray-500">No cold-storage files match the filters.</td></tr>}</tbody></table></div>
        <div className="px-5 py-3 border-t border-gray-100 space-y-3"><p className="text-[11px] text-gray-600">Showing {currentFiles.length} of {files.length} indexed files · {totalCompressed.toFixed(1)} GB compressed · ~{totalOriginal.toFixed(0)} GB original</p><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => selectVisible(true)}>Select Visible</Button><Button variant="outline" size="sm" className="h-7 text-[11px] text-sky-700 border-sky-200" onClick={() => openRetrieval(files.filter((file) => selected.includes(file.id)))}><DownloadCloud className="w-3 h-3 mr-1" />Retrieve Selected ({files.filter((file) => selected.includes(file.id)).length})</Button><Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => exportFiles(currentFiles)}><FileDown className="w-3 h-3 mr-1" />Export Visible</Button><Button variant="outline" size="sm" className="h-7 text-[11px] text-rose-700 border-rose-200" onClick={() => openDeletionRequest(files.filter((file) => file.eligibleForDeletion && selected.includes(file.id)))}><Trash2 className="w-3 h-3 mr-1" />Request Delete Selected</Button></div></div>
      </Panel>}

      <Modal isOpen={!!pushTarget} onClose={() => setPushTarget(null)} title="Confirm Cold-Storage Push" size="md">{pushTarget && <div className="space-y-4 text-sm"><div className="rounded-lg border border-sky-200 bg-sky-50 p-4"><p className="font-semibold text-sky-900">{pushTarget.module} · {pushTarget.period}</p><p className="mt-1 text-xs text-sky-800">{pushTarget.detail} · {pushTarget.age}</p><p className="mt-2 text-xs text-sky-800">This frontend demo will add {pushTarget.fileCount} file(s) to the cold-storage index; no external provider upload is performed.</p></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPushTarget(null)}>Cancel</Button><Button onClick={commitColdPush}><Snowflake className="w-4 h-4 mr-2" />Add to Cold Index</Button></div></div>}</Modal>

      <Modal isOpen={!!pendingRetrieve} onClose={() => setPendingRetrieve(null)} title="Confirm Cold-Storage Retrieval" size="lg">{pendingRetrieve && <div className="space-y-4 text-sm"><div className="rounded-lg border border-sky-200 bg-sky-50 p-4 space-y-2"><p className="font-semibold text-sky-900">{pendingRetrieve.length} file(s) selected · Standard retrieval</p>{pendingRetrieve.map((file) => <p key={file.id} className="text-xs text-sky-800">{file.name} · {file.compressed} MB · estimated ₹{Math.round(file.compressed * 0.3).toLocaleString('en-IN')}</p>)}<p className="border-t border-sky-200 pt-2 font-bold text-sky-900">Estimated total: ₹{pendingRetrieve.reduce((sum, file) => sum + Math.round(file.compressed * 0.3), 0).toLocaleString('en-IN')}</p></div><p className="text-xs text-gray-600">The request will be queued in Retrieval Management. No file is exposed as retrieved until the request is completed.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPendingRetrieve(null)}>Cancel</Button><Button onClick={confirmRetrieval}><DownloadCloud className="w-4 h-4 mr-2" />Submit Retrieval Request</Button></div></div>}</Modal>

      <Modal isOpen={!!pendingDelete} onClose={() => setPendingDelete(null)} title="Request Deletion Approval" size="md">{pendingDelete && <div className="space-y-4 text-sm"><div className="rounded-lg border border-rose-200 bg-rose-50 p-4"><div className="flex items-center gap-2 text-rose-900 font-semibold"><ShieldAlert className="w-4 h-4" />Deletion is not immediate</div><ul className="mt-2 space-y-1 text-xs text-rose-800">{pendingDelete.map((file) => <li key={file.id}>{file.name} · {file.period}</li>)}</ul><p className="mt-2 text-xs text-rose-800">Super Admin, Principal and Management approval are required. This request will be logged; the cold data will remain intact.</p></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDeletionRequest}><Trash2 className="w-4 h-4 mr-2" />Submit for Approval</Button></div></div>}</Modal>

      <Modal isOpen={!!infoFile} onClose={() => setInfoFile(null)} title={infoFile ? `File Information — ${infoFile.name}` : ''} size="lg">{infoFile && <div className="space-y-3 text-xs"><div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 space-y-1.5 text-gray-700"><p className="font-bold text-gray-800 text-[11px]">STORAGE DETAILS</p><p>Storage tier: Cold Storage · AWS S3 Glacier</p><p>AWS Vault: <span className="font-mono">school-xyz-archive</span></p><p>Region: ap-south-1 (Mumbai, India)</p><p>Pushed to cold storage: {infoFile.pushed}</p><p>Compression: GZIP Level 6 · Encryption: AES-256</p><p>Compressed: {infoFile.compressed} MB · Original: {infoFile.original} MB ({Math.round((1 - infoFile.compressed / infoFile.original) * 100)}% smaller)</p><p>Estimated Standard Retrieval: ₹{Math.round(infoFile.compressed * 0.3).toLocaleString('en-IN')}</p></div><div className="rounded-lg border border-gray-200 p-3 space-y-1.5 text-gray-700"><p className="font-bold text-gray-800 text-[11px]">DATA DETAILS</p><p>Module: {infoFile.module} · Period: {infoFile.period}</p><p>File: <span className="font-mono">{infoFile.name}</span></p><p>Retrieval count in index: {infoFile.retrievals}</p><p>Archive checksum is verified on retrieval in the production workflow.</p></div><div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5 text-amber-900"><p className="font-bold text-[11px]">RETENTION</p><p>{infoFile.eligibleForDeletion ? 'Retention period met; deletion still requires all configured approvals.' : 'This file remains under its configured retention policy.'}</p><p>Eligibility does not delete data automatically.</p></div><div className="flex flex-wrap justify-end gap-2 pt-1 border-t border-gray-100"><Button size="sm" className="text-xs bg-sky-600 hover:bg-sky-700 text-white" onClick={() => { openRetrieval([infoFile]); setInfoFile(null); }}><DownloadCloud className="w-3.5 h-3.5 mr-1.5" />Request Retrieval</Button><Button variant="outline" size="sm" className="text-xs" onClick={() => exportFiles([infoFile], `${infoFile.id}-metadata.csv`)}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Metadata</Button><Button variant="ghost" size="sm" className="text-xs" onClick={() => setInfoFile(null)}>Close</Button></div></div>}</Modal>

      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

export default ColdStorageManager;
