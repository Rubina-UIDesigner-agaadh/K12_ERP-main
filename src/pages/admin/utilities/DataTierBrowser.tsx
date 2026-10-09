// Archive Management ▸ Data Tier & Retrieval
// Search and view archive/cold-storage records. Cold data is visible as a
// retrieved copy only after its retrieval request is completed.
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import {
  Layers,
  Search,
  RefreshCw,
  FileDown,
  DownloadCloud,
  Eye,
  Printer,
  Snowflake
} from 'lucide-react';
import { ArchiveHeader, Panel, TierBadge, TH } from './archiveUi';
import {
  ArchiveRetrievedRecord,
  downloadCsv,
  enqueueRetrieval,
  loadArchiveWorkflowState,
  subscribeToArchiveWorkflowState
} from './archiveWorkflowState';

interface TierRecord {
  id: string;
  tier: 'WARM' | 'COLD';
  date: string;
  module: string;
  icon: string;
  type: string;
  description: string;
  ref: string;
  amount: string;
  period: string;
  sizeMB: number;
  archivedOn?: string;
  server?: string;
  coldPut?: string;
  retainUntil?: string;
  status: string;
  student?: string;
  mode?: string;
  collectedBy?: string;
  approvedBy?: string;
  gl?: string;
}

const RECORDS: TierRecord[] = [
  {
    id: 'r4', tier: 'WARM', date: '05-Oct-24', module: 'Fee', icon: '💰', type: 'Receipt',
    description: 'Tuition Fee Q2', ref: 'REC-2024-00712', amount: '₹15,000', period: 'FY 2024-25', sizeMB: 0.4,
    archivedOn: '01-Apr-2025 02:35 AM', server: 'archive-db-01.erp.school', coldPut: 'Estimated April 2028 (3 years from archiving)',
    retainUntil: 'March 2032 (8 years from creation)', status: 'Locked — Archived',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045', mode: 'Cash', collectedBy: 'Ramesh Sharma (Cashier)',
    approvedBy: 'Priya Gupta (Finance Manager)', gl: 'JV-2024-071 (Dr. Cash / Cr. Tuition Fee Revenue)'
  },
  {
    id: 'r5', tier: 'WARM', date: '03-Apr-24', module: 'Fee', icon: '💰', type: 'Receipt',
    description: 'Tuition Fee Q1', ref: 'REC-2024-00456', amount: '₹14,500', period: 'FY 2023-24', sizeMB: 0.3,
    archivedOn: '01-Apr-2025 02:35 AM', server: 'archive-db-01.erp.school', coldPut: 'Estimated April 2028 (3 years from archiving)',
    retainUntil: 'March 2032 (8 years from creation)', status: 'Locked — Archived',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045', mode: 'Cash', collectedBy: 'Ramesh Sharma (Cashier)',
    approvedBy: 'Priya Gupta (Finance Manager)', gl: 'JV-2024-045 (Dr. Cash / Cr. Tuition Fee Revenue)'
  },
  {
    id: 'r6', tier: 'WARM', date: '15-Mar-24', module: 'Exam', icon: '📝', type: 'Report Card',
    description: 'Annual Report Card', ref: 'RC-2023-24-045', amount: '88.5%', period: 'FY 2023-24', sizeMB: 0.6,
    archivedOn: '01-Apr-2025 02:30 AM', server: 'archive-db-01.erp.school', status: 'Locked — Archived',
    student: 'Meera Nair — Class VIII-B — ADM-2021-112'
  },
  {
    id: 'r7', tier: 'WARM', date: '05-Oct-23', module: 'Fee', icon: '💰', type: 'Receipt',
    description: 'Tuition Fee Q2', ref: 'REC-2023-00589', amount: '₹14,000', period: 'FY 2022-23', sizeMB: 0.3,
    archivedOn: '01-Apr-2025 02:30 AM', server: 'archive-db-01.erp.school', status: 'Locked — Archived',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045'
  },
  {
    id: 'r8', tier: 'COLD', date: '05-Apr-22', module: 'Fee', icon: '💰', type: 'Receipt',
    description: 'Tuition Fee Q1', ref: 'REC-2022-00234', amount: '₹13,500', period: 'FY 2021-22', sizeMB: 78,
    coldPut: '01-Apr-2025 03:40 AM', retainUntil: 'March 2030', status: 'In Cold Storage',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045'
  },
  {
    id: 'r9', tier: 'COLD', date: '15-Mar-22', module: 'Exam', icon: '📝', type: 'Report Card',
    description: 'Annual Report Card', ref: 'RC-2021-22-045', amount: '86.5%', period: 'FY 2021-22', sizeMB: 68,
    coldPut: '01-Apr-2024 03:35 AM', retainUntil: 'March 2029', status: 'In Cold Storage',
    student: 'Meera Nair — Class VIII-B — ADM-2021-112'
  },
  {
    id: 'r10', tier: 'COLD', date: '03-Apr-21', module: 'Fee', icon: '💰', type: 'Receipt',
    description: 'Tuition Fee Q1', ref: 'REC-2021-00189', amount: '₹13,000', period: 'FY 2020-21', sizeMB: 52,
    coldPut: '01-Apr-2023 03:30 AM', retainUntil: 'March 2028', status: 'In Cold Storage',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045'
  }
];

type TierTab = 'ALL' | 'WARM' | 'COLD';
const RETRIEVAL_RATE_PER_MB = 0.3;
const retrievalCost = (record: TierRecord) => Math.max(1, Math.round(record.sizeMB * RETRIEVAL_RATE_PER_MB));

const parseRecordDate = (value: string) => {
  const parsed = new Date(value.replace(/-(\d{2})$/, '-20$1'));
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const fromRetrievedRecord = (record: ArchiveRetrievedRecord): TierRecord => ({
  id: record.id,
  tier: 'COLD',
  date: record.date,
  module: record.module,
  icon: '❄️',
  type: record.type,
  description: record.title,
  ref: record.reference,
  amount: record.amount,
  period: record.period,
  sizeMB: 0,
  coldPut: 'Retrieved to temporary ERP storage',
  retainUntil: 'See retrieval access expiry',
  status: 'Retrieved — Read Only',
  student: record.student
});

export function DataTierBrowser() {
  const [query, setQuery] = useState('');
  const [applied, setApplied] = useState('');
  const [tab, setTab] = useState<TierTab>('ALL');
  const [module, setModule] = useState('All');
  const [dataType, setDataType] = useState('All');
  const [period, setPeriod] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [size, setSize] = useState('Any');
  const [showArchive, setShowArchive] = useState(true);
  const [showCold, setShowCold] = useState(true);
  const [detail, setDetail] = useState<TierRecord | null>(null);
  const [pendingRetrieve, setPendingRetrieve] = useState<TierRecord | null>(null);
  const [retrievals, setRetrievals] = useState(() => loadArchiveWorkflowState().retrievals);
  const [retrievedRecords, setRetrievedRecords] = useState<ArchiveRetrievedRecord[]>(() => loadArchiveWorkflowState().retrievedRecords);
  const [retrievedQuery, setRetrievedQuery] = useState('');
  const [lastSynced, setLastSynced] = useState('Local sample index loaded');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => subscribeToArchiveWorkflowState(() => {
    const state = loadArchiveWorkflowState();
    setRetrievals(state.retrievals);
    setRetrievedRecords(state.retrievedRecords);
  }), []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const visibleRetrievedRecords = useMemo(() => retrievedRecords.filter((record) => {
    const request = retrievals.find((item) => item.id === record.retrievalId);
    return request?.status === 'Complete' && (!request.expiresAt || new Date(request.expiresAt).getTime() > Date.now());
  }), [retrievedRecords, retrievals]);
  const isRetrieved = (record: TierRecord) => visibleRetrievedRecords.some((item) => item.id === record.id);
  const requestFor = (record: TierRecord) => retrievals.find((request) => request.items.some((item) => item.sourceRecordId === record.id) && (request.status === 'Queued' || request.status === 'In Progress'));

  const visible = useMemo(() => RECORDS.filter((record) => {
    if (tab !== 'ALL' && record.tier !== tab) return false;
    if (record.tier === 'WARM' && !showArchive) return false;
    if (record.tier === 'COLD' && !showCold) return false;
    if (module !== 'All' && !record.module.startsWith(module)) return false;
    if (dataType !== 'All' && record.type !== dataType) return false;
    if (period !== 'All' && record.period !== period) return false;
    if (applied && !`${record.ref} ${record.description} ${record.module} ${record.student || ''}`.toLowerCase().includes(applied.toLowerCase())) return false;
    if (fromDate && parseRecordDate(record.date) < new Date(`${fromDate}T00:00:00`).getTime()) return false;
    if (toDate && parseRecordDate(record.date) > new Date(`${toDate}T23:59:59.999`).getTime()) return false;
    if (size === '< 1 MB' && record.sizeMB >= 1) return false;
    if (size === '1 - 100 MB' && (record.sizeMB < 1 || record.sizeMB > 100)) return false;
    if (size === '> 100 MB' && record.sizeMB <= 100) return false;
    return true;
  }), [tab, showArchive, showCold, module, dataType, period, applied, fromDate, toDate, size]);

  const retrievedFiltered = visibleRetrievedRecords.filter((record) =>
    !retrievedQuery || `${record.reference} ${record.title} ${record.module} ${record.type} ${record.student || ''} ${record.period} ${record.fileName}`.toLowerCase().includes(retrievedQuery.toLowerCase())
  );

  const beginRetrieval = (record: TierRecord) => {
    setPendingRetrieve(record);
    setDetail(null);
  };

  const confirmRetrieval = () => {
    if (!pendingRetrieve) return;
    const request = enqueueRetrieval({
      items: [{
        id: pendingRetrieve.id,
        sourceRecordId: pendingRetrieve.id,
        name: `${pendingRetrieve.ref}.archive`,
        module: pendingRetrieve.module,
        sizeMB: pendingRetrieve.sizeMB,
        costINR: retrievalCost(pendingRetrieve),
        reference: pendingRetrieve.ref,
        type: pendingRetrieve.type,
        description: pendingRetrieve.description,
        date: pendingRetrieve.date,
        amount: pendingRetrieve.amount,
        period: pendingRetrieve.period,
        student: pendingRetrieve.student
      }],
      speed: 'Standard',
      accessHours: 72,
      reason: `Data Tier Browser request for ${pendingRetrieve.ref}`,
      requestedBy: 'Finance Manager',
      approval: retrievalCost(pendingRetrieve) > 50 ? 'Principal approval' : 'Finance Manager',
      costINR: retrievalCost(pendingRetrieve),
      notificationInApp: true,
      notificationEmail: true
    });
    setPendingRetrieve(null);
    showToast(`${request.id} queued for retrieval. Track it in Retrieval Management; the record appears here when complete.`);
  };

  const openRetrieved = (record: ArchiveRetrievedRecord) => {
    setDetail(fromRetrievedRecord(record));
  };
  const syncIndex = () => {
    const state = loadArchiveWorkflowState();
    setRetrievals(state.retrievals);
    setRetrievedRecords(state.retrievedRecords);
    setLastSynced(new Date().toLocaleString('en-IN'));
    showToast(`Local archive index refreshed: ${RECORDS.length} sample archive/cold items and ${state.retrievedRecords.length} retrieved record(s).`);
  };

  const exportVisible = () => {
    downloadCsv('archive-data-tier-search.csv',
      ['Tier', 'Date', 'Module', 'Type', 'Description', 'Reference', 'Amount', 'Period', 'Size MB', 'Retrieval Cost INR'],
      visible.map((record) => [record.tier === 'WARM' ? 'Archive' : 'Cold Storage', record.date, record.module, record.type, record.description, record.ref, record.amount, record.period, record.sizeMB, record.tier === 'COLD' ? retrievalCost(record) : ''])
    );
    showToast(`${visible.length} archive/cold record(s) exported as CSV.`);
  };

  const resetFilters = () => {
    setQuery(''); setApplied(''); setTab('ALL'); setModule('All'); setDataType('All'); setPeriod('All');
    setFromDate(''); setToDate(''); setSize('Any'); setShowArchive(true); setShowCold(true);
  };

  const tiers: { id: TierTab; label: string; hint: string }[] = [
    { id: 'ALL', label: '📋 All Archive & Cold Data', hint: 'Archive and Cold Storage only' },
    { id: 'WARM', label: '🌡️ Archive', hint: 'Fast read-only access' },
    { id: 'COLD', label: '❄️ Cold Storage', hint: 'Retrieval may take hours · charges apply' }
  ];

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={Layers}
        title="Data Tier & Retrieval"
        screen="Data Tier & Retrieval"
        actions={<Button variant="outline" size="sm" className="text-xs" onClick={syncIndex}><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Index</Button>}
      />

      <Panel icon={Search} title="Unified Archive Search" subtitle="Search archived records and the cold-storage index; Primary Storage is not included">
        <div className="p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && setApplied(query)} placeholder="Search name, student, receipt, voucher, or reference" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setApplied(query)}><Search className="w-3.5 h-3.5 mr-1.5" /> Search</Button>
          </div>
          <p className="text-[11px] text-gray-500">Search results include a View Data action. Cold-storage rows also show retrieval cost and a separate Retrieve Data action.</p>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((tierOption) => (
          <button key={tierOption.id} onClick={() => setTab(tierOption.id)} className={`rounded-xl border p-3 text-left transition-colors ${tab === tierOption.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <div className="text-xs font-bold text-gray-900">{tierOption.label}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{tierOption.hint}</div>
          </button>
        ))}
      </div>

      <Panel icon={Search} title="Filters & Controls" subtitle="Filters apply to the Archive and Cold Storage index">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-[11px] text-gray-600">Module
              <select value={module} onChange={(event) => setModule(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All modules</option><option value="Fee">Fee</option><option value="Exam">Examination</option><option value="Finance">Finance / GL</option><option value="Payroll">Payroll</option>
              </select>
            </label>
            <label className="text-[11px] text-gray-600">Data Type
              <select value={dataType} onChange={(event) => setDataType(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All types</option><option value="Receipt">Receipt</option><option value="Marks">Marks</option><option value="Report Card">Report Card</option>
              </select>
            </label>
            <label className="text-[11px] text-gray-600">Period
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All periods</option><option>FY 2024-25</option><option>FY 2023-24</option><option>FY 2022-23</option><option>FY 2021-22</option><option>FY 2020-21</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-[11px] text-gray-600">From Date<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs" /></label>
            <label className="text-[11px] text-gray-600">To Date<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs" /></label>
            <label className="text-[11px] text-gray-600">Record size
              <select value={size} onChange={(event) => setSize(event.target.value)} className="mt-1 w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white"><option>Any</option><option>&lt; 1 MB</option><option>1 - 100 MB</option><option>&gt; 100 MB</option></select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-700">
            <span className="font-medium">Show:</span>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={showArchive} onChange={(event) => setShowArchive(event.target.checked)} /> Archive Data</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={showCold} onChange={(event) => setShowCold(event.target.checked)} /> Cold Storage Index</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setApplied(query)}><Search className="w-3.5 h-3.5 mr-1.5" /> Apply Search</Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={resetFilters}><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset</Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={exportVisible}><FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Results CSV</Button>
          </div>
        </div>
      </Panel>

      <Panel icon={Layers} title={`Search Results — ${applied ? `“${applied}”` : 'All records'}`} subtitle={`${visible.length} matching archive/cold record(s); only Archive and Cold Storage are indexed here · synced ${lastSynced}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-xs border-collapse" data-testid="tier-table">
            <thead><tr className="bg-gray-50 border-b border-gray-200"><th className={`${TH} w-12 text-center`}>#</th><th className={TH}>Tier</th><th className={TH}>Date</th><th className={TH}>Module / Type</th><th className={TH}>Description</th><th className={TH}>Reference No.</th><th className={TH}>Amount</th><th className={TH}>Period</th><th className={TH}>Retrieval Cost</th><th className={`${TH} text-right`}>Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((record, index) => {
                const retrieved = isRetrieved(record);
                const pending = requestFor(record);
                return <tr key={record.id} className="hover:bg-indigo-50/20">
                  <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                  <td className="p-3"><TierBadge tier={record.tier} />{retrieved && <span className="mt-1 block text-[10px] font-semibold text-emerald-700">✓ Retrieved</span>}{!retrieved && pending && <span className="mt-1 block text-[10px] font-semibold text-amber-700">{pending.status}: {pending.id}</span>}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{record.date}</td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">{record.icon} {record.module} / {record.type}</td>
                  <td className="p-3 text-gray-700">{record.description}</td>
                  <td className="p-3 font-mono text-indigo-700">{record.ref}</td>
                  <td className="p-3 font-semibold text-gray-900">{record.amount}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{record.period}</td>
                  <td className="p-3 text-gray-700">{record.tier === 'COLD' ? `₹${retrievalCost(record).toLocaleString('en-IN')}` : '—'}</td>
                  <td className="p-3"><div className="flex items-center justify-end gap-1.5 flex-wrap">
                    <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setDetail(record)}><Eye className="w-3 h-3 mr-1" />View Data</Button>
                    {record.tier === 'COLD' && (retrieved ? <Button variant="outline" size="sm" className="h-7 text-[10px] text-emerald-700" onClick={() => { setRetrievedQuery(record.ref); document.getElementById('retrieved-data')?.scrollIntoView({ behavior: 'smooth' }); }}><Eye className="w-3 h-3 mr-1" />View Retrieved</Button> : <Button variant="outline" size="sm" className="h-7 text-[10px] text-sky-700 border-sky-200" onClick={() => beginRetrieval(record)} disabled={!!pending}><DownloadCloud className="w-3 h-3 mr-1" />{pending ? 'Retrieval Queued' : 'Retrieve Data'}</Button>)}
                    {record.tier === 'WARM' && <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => downloadCsv(`${record.ref.toLowerCase()}.csv`, ['Reference', 'Date', 'Module', 'Type', 'Description', 'Amount', 'Period'], [[record.ref, record.date, record.module, record.type, record.description, record.amount, record.period]])}><FileDown className="w-3 h-3 mr-1" />Export</Button>}
                  </div></td>
                </tr>;
              })}
              {visible.length === 0 && <tr><td colSpan={10} className="p-12 text-center text-gray-500">No records match the current filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600"><p>🌡️ Archive — immediate read-only view, print and export.</p><p>❄️ Cold Storage — metadata and retrieval cost are visible; full data appears below only after the request is completed.</p></div>
      </Panel>

      {visibleRetrievedRecords.length > 0 && <section id="retrieved-data" className="scroll-mt-4"><Panel icon={DownloadCloud} title={`Retrieved Data (${visibleRetrievedRecords.length})`} subtitle="Only completed cold-storage retrievals are shown here; temporary read-only copies" actions={<input aria-label="Search retrieved data" value={retrievedQuery} onChange={(event) => setRetrievedQuery(event.target.value)} placeholder="Search retrieved records…" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-xs" />}>
        <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-200"><th className={TH}>Reference</th><th className={TH}>Date</th><th className={TH}>Module / Type</th><th className={TH}>Retrieved Data</th><th className={TH}>Student / Entity</th><th className={TH}>Amount / Score</th><th className={TH}>Period</th><th className={TH}>Request / Cost</th><th className={`${TH} text-right`}>Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{retrievedFiltered.map((record) => <tr key={record.id} className="hover:bg-emerald-50/40"><td className="p-3 font-mono text-indigo-700">{record.reference}</td><td className="p-3 whitespace-nowrap text-gray-600">{record.date}</td><td className="p-3 text-gray-700">{record.module} / {record.type}</td><td className="p-3 font-medium text-gray-800">{record.title}</td><td className="p-3 text-gray-700">{record.student || '—'}</td><td className="p-3 font-semibold text-gray-900">{record.amount}</td><td className="p-3 text-gray-600">{record.period}</td><td className="p-3 text-gray-600"><span className="font-mono">{record.retrievalId}</span><br />₹{record.costINR.toLocaleString('en-IN')}</td><td className="p-3 text-right"><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => openRetrieved(record)}><Eye className="w-3 h-3 mr-1" />View Data</Button></td></tr>)}{retrievedFiltered.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-gray-500">No retrieved records match this search.</td></tr>}</tbody></table></div>
        <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-2"><Button variant="outline" size="sm" className="text-xs" onClick={() => downloadCsv('retrieved-archive-data.csv', ['Reference', 'Date', 'Module', 'Type', 'Description', 'Student', 'Amount', 'Period', 'Retrieval ID', 'Cost INR'], retrievedFiltered.map((record) => [record.reference, record.date, record.module, record.type, record.title, record.student || '', record.amount, record.period, record.retrievalId, record.costINR]))}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Retrieved Data</Button><Button variant="outline" size="sm" className="text-xs" onClick={() => { window.print(); }}><Printer className="w-3.5 h-3.5 mr-1.5" />Print</Button></div>
      </Panel></section>}

      <Modal isOpen={!!pendingRetrieve} onClose={() => setPendingRetrieve(null)} title="Confirm Cold-Storage Retrieval" size="md">
        {pendingRetrieve && <div className="space-y-4 text-sm"><div className="rounded-lg border border-sky-200 bg-sky-50 p-4"><p className="font-semibold text-sky-900">{pendingRetrieve.ref} · {pendingRetrieve.module} {pendingRetrieve.type}</p><p className="mt-1 text-xs text-sky-800">{pendingRetrieve.description} · {pendingRetrieve.sizeMB} MB compressed</p><p className="mt-2 text-sm font-bold text-sky-900">Estimated retrieval charge: ₹{retrievalCost(pendingRetrieve).toLocaleString('en-IN')}</p></div><p className="text-xs text-gray-600">The request will appear in Retrieval Management. Retrieved data is shown only after the request is marked complete.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPendingRetrieve(null)}>Cancel</Button><Button onClick={confirmRetrieval}><DownloadCloud className="w-4 h-4 mr-2" />Request Retrieval</Button></div></div>}
      </Modal>

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail ? `Record Detail — ${detail.ref}` : ''} size="lg">
        {detail && <div className="space-y-4 text-xs"><div className="rounded-lg border border-gray-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-gray-900">{detail.icon} {detail.description}</p><p className="text-gray-500 mt-1">{detail.module} · {detail.type} · {detail.period}</p></div><TierBadge tier={detail.tier} /></div><div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700"><p>Reference: <strong className="font-mono">{detail.ref}</strong></p><p>Date: <strong>{detail.date}</strong></p><p>Amount / Score: <strong>{detail.amount}</strong></p><p>Student: <strong>{detail.student || '—'}</strong></p><p>Storage status: <strong>{detail.status}</strong></p><p>Record size: <strong>{detail.sizeMB ? `${detail.sizeMB} MB` : 'retrieved temporary copy'}</strong></p></div></div><div className="rounded-lg border border-gray-200 p-4 space-y-1 text-gray-700"><p className="font-bold text-gray-800">STORAGE INFORMATION</p><p>Archived on: {detail.archivedOn || detail.coldPut || '—'}</p><p>Archive server: {detail.server || (detail.tier === 'COLD' ? 'AWS S3 Glacier · ap-south-1 (Mumbai)' : 'archive-db-01.erp.school')}</p><p>Legal retention: {detail.retainUntil || 'As specified by the record retention policy'}</p>{detail.mode && <p>Payment mode: {detail.mode} · Collected by: {detail.collectedBy || '—'}</p>}{detail.approvedBy && <p>Approved by: {detail.approvedBy}</p>}{detail.gl && <p>Linked GL entry: {detail.gl}</p>}</div>{detail.tier === 'COLD' && !isRetrieved(detail) && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 flex gap-2"><Snowflake className="w-4 h-4 shrink-0" /><p>Cold data is read-only. Request retrieval to access the full record copy. Estimated retrieval charge: <strong>₹{retrievalCost(detail).toLocaleString('en-IN')}</strong>.</p></div>}<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" size="sm" onClick={() => downloadCsv(`${detail.ref.toLowerCase()}.csv`, ['Reference', 'Date', 'Module', 'Type', 'Description', 'Amount', 'Period'], [[detail.ref, detail.date, detail.module, detail.type, detail.description, detail.amount, detail.period]])}><FileDown className="w-3.5 h-3.5 mr-1.5" />Export Record</Button><Button variant="outline" size="sm" onClick={() => { window.print(); }}><Printer className="w-3.5 h-3.5 mr-1.5" />Print</Button>{detail.tier === 'COLD' && !isRetrieved(detail) && <Button size="sm" onClick={() => beginRetrieval(detail)}><DownloadCloud className="w-3.5 h-3.5 mr-1.5" />Retrieve Data</Button>}</div></div>}
      </Modal>

      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">{toast}</div>}
    </div>
  );
}

export default DataTierBrowser;
