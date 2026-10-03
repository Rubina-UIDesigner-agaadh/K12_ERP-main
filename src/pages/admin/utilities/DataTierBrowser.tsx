// DataTierBrowser.tsx — Archive Management ▸ Data Tier Browser (Page 2)
// One search across primary / archive / cold, tier tabs, filters, results table
// and the slide-in record detail panel (read-only for archived data).
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  Layers,
  Search,
  RefreshCw,
  FileDown,
  DownloadCloud,
  Eye,
  Pencil,
  Printer,
  Info,
  X,
  Lock
} from 'lucide-react';
import { ArchiveHeader, Panel, TierBadge, TH, type Tier } from './archiveUi';

interface TierRecord {
  id: string;
  tier: Tier;
  date: string;
  module: string;
  icon: string;
  type: string;
  description: string;
  ref: string;
  amount: string;
  period: string;
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
  { id: 'r1', tier: 'HOT', date: '05-Sep-25', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q2', ref: 'REC-2025-00892', amount: '₹15,500', period: 'FY 2025-26', status: 'Active', student: 'Rahul Kumar — Class IX-A — ADM-2022-045' },
  { id: 'r2', tier: 'HOT', date: '15-Aug-25', module: 'Exam', icon: '📝', type: 'Marks', description: 'Unit Test 2 Marks', ref: 'EXAM-2025-0234', amount: '87.5%', period: 'FY 2025-26', status: 'Active', student: 'Meera Nair — Class VIII-B — ADM-2021-112' },
  { id: 'r3', tier: 'HOT', date: '01-Apr-25', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q1', ref: 'REC-2025-00234', amount: '₹15,000', period: 'FY 2025-26', status: 'Active', student: 'Rahul Kumar — Class IX-A — ADM-2022-045' },
  {
    id: 'r4', tier: 'WARM', date: '05-Oct-24', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q2', ref: 'REC-2024-00712', amount: '₹15,000', period: 'FY 2024-25',
    archivedOn: '01-April-2026 02:35 AM', server: 'archive-db-01.erp.school', coldPut: 'Estimated April 2029 (3 years from archiving)',
    retainUntil: 'March 2032 (8 years from creation)', status: '🔒 LOCKED — Archived',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045', mode: 'Cash', collectedBy: 'Ramesh Sharma (Cashier)',
    approvedBy: 'Priya Gupta (Finance Manager)', gl: 'JV-2024-071 (Dr. Cash / Cr. Tuition Fee Revenue)'
  },
  {
    id: 'r5', tier: 'WARM', date: '03-Apr-24', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q1', ref: 'REC-2024-00456', amount: '₹14,500', period: 'FY 2024-25',
    archivedOn: '01-April-2026 02:35 AM', server: 'archive-db-01.erp.school', coldPut: 'Estimated April 2029 (3 years from archiving)',
    retainUntil: 'March 2032 (8 years from creation)', status: '🔒 LOCKED — Archived',
    student: 'Rahul Kumar — Class IX-A — ADM-2022-045', mode: 'Cash', collectedBy: 'Ramesh Sharma (Cashier)',
    approvedBy: 'Priya Gupta (Finance Manager)', gl: 'JV-2024-045 (Dr. Cash / Cr. Tuition Fee Revenue)'
  },
  { id: 'r6', tier: 'WARM', date: '15-Mar-24', module: 'Exam', icon: '📝', type: 'Report Card', description: 'Annual Report Card', ref: 'RC-2023-24-045', amount: '88.5%', period: 'FY 2023-24', archivedOn: '01-April-2025 02:30 AM', server: 'archive-db-01.erp.school', status: '🔒 LOCKED — Archived' },
  { id: 'r7', tier: 'WARM', date: '05-Oct-23', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q2', ref: 'REC-2023-00589', amount: '₹14,000', period: 'FY 2023-24', archivedOn: '01-April-2025 02:30 AM', server: 'archive-db-01.erp.school', status: '🔒 LOCKED — Archived' },
  { id: 'r8', tier: 'COLD', date: '05-Apr-22', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q1', ref: 'REC-2022-00234', amount: '₹13,500', period: 'FY 2022-23', coldPut: '01-April-2025 03:40 AM', retainUntil: 'March 2030', status: '❄️ In Cold Storage' },
  { id: 'r9', tier: 'COLD', date: '15-Mar-22', module: 'Exam', icon: '📝', type: 'Report Card', description: 'Annual Report Card', ref: 'RC-2021-22-045', amount: '86.5%', period: 'FY 2021-22', coldPut: '01-April-2024 03:35 AM', retainUntil: 'March 2029', status: '❄️ In Cold Storage' },
  { id: 'r10', tier: 'COLD', date: '03-Apr-21', module: 'Fee', icon: '💰', type: 'Receipt', description: 'Tuition Fee Q1', ref: 'REC-2021-00189', amount: '₹13,000', period: 'FY 2021-22', coldPut: '01-April-2023 03:30 AM', retainUntil: 'March 2028', status: '❄️ In Cold Storage' }
];

type TierTab = 'ALL' | Tier;

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
  const [showPrimary, setShowPrimary] = useState(true);
  const [showArchive, setShowArchive] = useState(true);
  const [showCold, setShowCold] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [detail, setDetail] = useState<TierRecord | null>(null);
  const [retrievedIds, setRetrievedIds] = useState<string[]>([]);
  const [retrievedQuery, setRetrievedQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const retrieveRecords = (records: TierRecord[]) => {
    const coldRecords = records.filter((record) => record.tier === 'COLD');
    if (coldRecords.length === 0) {
      showToast('No cold-storage records are included in the current selection.');
      return;
    }
    const newlyRetrieved = coldRecords.filter((record) => !retrievedIds.includes(record.id)).length;
    setRetrievedIds((current) => Array.from(new Set([...current, ...coldRecords.map((record) => record.id)])));
    showToast(`${newlyRetrieved || coldRecords.length} cold record(s) are available in Retrieved Data below.`);
  };

  const showRetrievedRecord = (record: TierRecord) => {
    setRetrievedQuery(record.ref);
    window.setTimeout(() => document.getElementById('retrieved-data')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const retrieveAndShow = (record: TierRecord) => {
    if (!retrievedIds.includes(record.id)) retrieveRecords([record]);
    setRetrievedQuery(record.ref);
    setDetail(null);
    window.setTimeout(() => document.getElementById('retrieved-data')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };

  const visible = RECORDS.filter((r) => {
    if (tab !== 'ALL' && r.tier !== tab) return false;
    if (r.tier === 'HOT' && !showPrimary) return false;
    if (r.tier === 'WARM' && !showArchive) return false;
    if (r.tier === 'COLD' && !showCold) return false;
    if (module !== 'All' && !r.module.startsWith(module)) return false;
    if (dataType !== 'All' && r.type !== dataType) return false;
    if (period !== 'All' && r.period !== period) return false;
    if (
      applied &&
      !`${r.ref} ${r.description} ${r.module} ${r.student || ''}`.toLowerCase().includes(applied.toLowerCase())
    )
      return false;
    return true;
  });

  const retrievedRecords = RECORDS.filter((record) => retrievedIds.includes(record.id));
  const filteredRetrievedRecords = retrievedRecords.filter((record) =>
    !retrievedQuery || `${record.ref} ${record.description} ${record.module} ${record.type} ${record.student || ''} ${record.period}`.toLowerCase().includes(retrievedQuery.toLowerCase())
  );

  // Full index size per tier — the table below shows the first 10 matches of 47.
  const counts = { hot: 12, warm: 28, cold: 7 };

  const tabs: { id: TierTab; label: string; hint: string }[] = [
    { id: 'ALL', label: '📋 All Tiers', hint: '87.5 GB total' },
    { id: 'HOT', label: '🔥 Primary (12.3 GB)', hint: 'Instant access' },
    { id: 'WARM', label: '🌡️ Archive (35.2 GB)', hint: 'Seconds access' },
    { id: 'COLD', label: '❄️ Cold Storage (40 GB)', hint: 'Hours to access' }
  ];

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={Layers}
        title="Data Tier & Retrieval"
        screen="Data Tier & Retrieval"
        actions={
          <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Indexes re-synced across all tiers.')}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Index
          </Button>
        }
      />

      {/* SECTION 1 — unified search */}
      <Panel icon={Search} title="Unified Search" subtitle="Searches primary DB → archive DB → cold storage index">
        <div className="p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setApplied(query)}
                placeholder="Search across all tiers — name, ID, receipt no., voucher no."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setApplied(query)}>
              🔍 Search
            </Button>
          </div>
          <p className="text-[11px] text-gray-500">
            Results are grouped by Primary, Archive and Cold Storage, with each tier clearly marked — select a row to view or retrieve.
          </p>
        </div>
      </Panel>

      {/* SECTION 2 — tier tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              tab === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-xs font-bold text-gray-900">{t.label}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{t.hint}</div>
          </button>
        ))}
      </div>

      {/* SECTION 3 — filters */}
      <Panel icon={Search} title="Filters & Controls" subtitle="Narrow the result set before searching">
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Module</label>
              <select value={module} onChange={(e) => setModule(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All</option>
                <option value="Fee">Fee</option>
                <option value="Exam">Examination</option>
                <option value="Finance">Finance / GL</option>
                <option value="Payroll">Payroll</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Data Type</label>
              <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All</option>
                <option value="Receipt">Receipt</option>
                <option value="Marks">Marks</option>
                <option value="Report Card">Report Card</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">All</option>
                <option value="FY 2025-26">FY 2025-26</option>
                <option value="FY 2024-25">FY 2024-25</option>
                <option value="FY 2023-24">FY 2023-24</option>
                <option value="FY 2022-23">FY 2022-23</option>
                <option value="FY 2021-22">FY 2021-22</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1 font-medium">Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white">
                <option>Any</option>
                <option>&lt; 1 MB</option>
                <option>1 - 100 MB</option>
                <option>&gt; 100 MB</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-700">
            <span className="font-medium">Show:</span>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showPrimary} onChange={(e) => setShowPrimary(e.target.checked)} /> Primary Data
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showArchive} onChange={(e) => setShowArchive(e.target.checked)} /> Archive Data
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showCold} onChange={(e) => setShowCold(e.target.checked)} /> Cold Storage Index
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} /> Deleted Records
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setApplied(query)}>
              🔍 Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setQuery('');
                setApplied('');
                setTab('ALL');
                setModule('All');
                setDataType('All');
                setPeriod('All');
                setFromDate('');
                setToDate('');
                setSize('Any');
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Results exported to Excel.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Results
            </Button>
            <Button variant="outline" size="sm" className="text-xs text-sky-700 border-sky-200" onClick={() => retrieveRecords(visible.filter((record) => record.tier === 'COLD'))}>
              <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Retrieve Visible Cold Records
            </Button>
          </div>
        </div>
      </Panel>

      {/* SECTION 4 — results */}
      <Panel
        icon={Layers}
        title={`Search Results — "${applied || 'All records'}"`}
        subtitle={`${counts.hot + counts.warm + counts.cold} records found (🔥 ${counts.hot} in Primary | 🌡️ ${counts.warm} in Archive | ❄️ ${counts.cold} in Cold Storage) — showing the first ${visible.length}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" data-testid="tier-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={`${TH} w-12 text-center`}>#</th>
                <th className={TH}>Tier</th>
                <th className={TH}>Date</th>
                <th className={TH}>Module / Type</th>
                <th className={TH}>Description</th>
                <th className={TH}>Reference No.</th>
                <th className={TH}>Amount</th>
                <th className={TH}>Period</th>
                <th className={`${TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((r, i) => (
                <tr key={r.id} className="hover:bg-indigo-50/20">
                  <td className="p-3 text-center text-gray-400 font-mono">{i + 1}</td>
                  <td className="p-3">
                    <TierBadge tier={r.tier} />
                    {retrievedIds.includes(r.id) && <span className="mt-1 block text-[10px] font-semibold text-emerald-700">✓ Retrieved</span>}
                  </td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{r.date}</td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">
                    {r.icon} {r.module} / {r.type}
                  </td>
                  <td className="p-3 text-gray-700">{r.description}</td>
                  <td className="p-3 font-mono text-indigo-700">{r.ref}</td>
                  <td className="p-3 font-semibold text-gray-900">{r.amount}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{r.period}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setDetail(r)}>
                        <Eye className="w-3 h-3 mr-1" /> {r.tier === 'COLD' ? 'Info' : 'View'}
                      </Button>
                      {r.tier === 'HOT' && (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.ref} opened for editing.`)}>
                            <Pencil className="w-3 h-3 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.ref} exported.`)}>
                            <FileDown className="w-3 h-3 mr-1" /> Export
                          </Button>
                        </>
                      )}
                      {r.tier === 'WARM' && (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.ref} sent to printer.`)}>
                            <Printer className="w-3 h-3 mr-1" /> Print
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${r.ref} exported.`)}>
                            <FileDown className="w-3 h-3 mr-1" /> Export
                          </Button>
                        </>
                      )}
                      {r.tier === 'COLD' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] text-sky-700 border-sky-200"
                          onClick={() => retrievedIds.includes(r.id) ? showRetrievedRecord(r) : retrieveAndShow(r)}
                        >
                          <DownloadCloud className="w-3 h-3 mr-1" /> {retrievedIds.includes(r.id) ? 'View Retrieved' : 'Retrieve & View'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">
                    No records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-600">
          <p>🔥 HOT → In Primary DB — Instant access — All actions available</p>
          <p>🌡️ WARM → In Archive DB — Seconds access — Read-only (view/print/export)</p>
          <p>❄️ COLD → In Cold Storage — Hours to access — Must request retrieval first</p>
        </div>
      </Panel>

      {retrievedRecords.length > 0 && (
        <section id="retrieved-data" className="scroll-mt-4">
          <Panel
            icon={DownloadCloud}
            title={`Retrieved Data (${retrievedRecords.length})`}
            subtitle="Cold-storage records retrieved in this browser preview. Search and view the returned record data below."
            actions={<input aria-label="Search retrieved data" value={retrievedQuery} onChange={(event) => setRetrievedQuery(event.target.value)} placeholder="Search retrieved records…" className="h-9 w-56 rounded-md border border-gray-300 px-3 text-xs" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs border-collapse">
                <thead><tr className="bg-gray-50 border-b border-gray-200"><th className={TH}>Reference</th><th className={TH}>Date</th><th className={TH}>Module / Type</th><th className={TH}>Retrieved Data</th><th className={TH}>Student / Entity</th><th className={TH}>Amount / Score</th><th className={TH}>Period</th><th className={`${TH} text-right`}>Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{filteredRetrievedRecords.map((record) => <tr key={record.id} className="hover:bg-emerald-50/40"><td className="p-3 font-mono text-indigo-700">{record.ref}</td><td className="p-3 whitespace-nowrap text-gray-600">{record.date}</td><td className="p-3 text-gray-700">{record.module} / {record.type}</td><td className="p-3 font-medium text-gray-800">{record.description}</td><td className="p-3 text-gray-700">{record.student || '—'}</td><td className="p-3 font-semibold text-gray-900">{record.amount}</td><td className="p-3 text-gray-600">{record.period}</td><td className="p-3 text-right"><Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setDetail(record)}><Eye className="w-3 h-3 mr-1" />View record</Button></td></tr>)}{filteredRetrievedRecords.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-500">No retrieved records match this search.</td></tr>}</tbody>
              </table>
            </div>
          </Panel>
        </section>
      )}

      {/* SECTION 5 — record detail slide-in panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDetail(null)} />
          <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">📋 Record Detail — {detail.ref}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {detail.tier === 'WARM' ? '🌡️ ARCHIVE DATA' : detail.tier === 'COLD' ? '❄️ COLD STORAGE' : '🔥 PRIMARY DATA'} · {detail.period} · {detail.module} Module
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast(`${detail.ref} exported.`)}>
                  <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export
                </Button>
                <button onClick={() => setDetail(null)} className="p-1.5 text-gray-400 hover:text-gray-700" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">STORAGE INFORMATION</p>
                <div className="space-y-1 text-gray-700">
                  <p>
                    Current Location:{' '}
                    <strong>
                      {detail.tier === 'HOT' ? '🔥 PRIMARY DATABASE' : detail.tier === 'WARM' ? '🌡️ ARCHIVE DATABASE' : '❄️ COLD STORAGE (AWS S3 Glacier)'}
                    </strong>
                  </p>
                  <p>Archived On: {detail.archivedOn || detail.coldPut || '—'}</p>
                  <p>Archive Server: {detail.server || 'archive-db-01.erp.school'}</p>
                  <p>Will Move to Cold: {detail.coldPut || 'Estimated 3 years after archiving'}</p>
                  <p>Legal Retain Until: {detail.retainUntil || 'March 2032 (8 years from creation)'}</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                <p className="font-bold text-gray-800 text-[11px] border-b pb-1">RECORD DETAILS</p>
                <div className="grid grid-cols-1 gap-1 text-gray-700">
                  <p>Reference No.: <strong className="font-mono">{detail.ref}</strong></p>
                  <p>Type: {detail.icon} {detail.module} / {detail.type} — {detail.description}</p>
                  {detail.student && <p>Student: {detail.student}</p>}
                  <p>Amount / Score: <strong>{detail.amount}</strong></p>
                  <p>Date: {detail.date}</p>
                  {detail.mode && <p>Payment Mode: {detail.mode}</p>}
                  {detail.collectedBy && <p>Collected By: {detail.collectedBy}</p>}
                  {detail.approvedBy && <p>Approved By: {detail.approvedBy}</p>}
                  {detail.gl && <p>GL Entry: {detail.gl}</p>}
                  <p>Status: {detail.status}</p>
                </div>
              </div>

              {detail.tier !== 'HOT' && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">This record is in {detail.tier === 'WARM' ? 'ARCHIVE' : 'COLD STORAGE'} — Read Only Mode</p>
                    <p>Edit and Delete are not available for archived records.</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                {detail.tier === 'COLD' && <Button size="sm" className="text-xs bg-sky-600 text-white hover:bg-sky-700" onClick={() => retrieveAndShow(detail)}><DownloadCloud className="w-3.5 h-3.5 mr-1.5" />{retrievedIds.includes(detail.id) ? 'View Retrieved Data' : 'Retrieve & View Data'}</Button>}
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Receipt sent to printer.')}>
                  <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Receipt
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('PDF downloaded.')}>
                  <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Linked GL entry opened.')}>
                  <Info className="w-3.5 h-3.5 mr-1.5" /> View GL Entry
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDetail(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default DataTierBrowser;
