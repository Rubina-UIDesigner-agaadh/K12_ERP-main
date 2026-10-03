// ColdStorageManager.tsx — Archive Management ▸ Cold Storage Manager (Page 4)
// Cold storage KPIs, tabs, file index with the file-information popup, plus the
// eligible-for-cold-push and eligible-for-deletion lists and bulk actions.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Snowflake,
  Package,
  Trash2,
  UploadCloud,
  Search,
  RefreshCw,
  Info,
  DownloadCloud,
  FileDown,
  CheckCircle2
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH } from './archiveUi';

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

const FILES: ColdFile[] = [
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

const COLD_PUSH_CANDIDATES = [
  { id: 'p1', module: '📋 Audit Logs', detail: '3 files · 2.1 GB in Archive DB', age: '2 years in archive' },
  { id: 'p2', module: '🕐 Attendance', detail: '2 files · 1.4 GB in Archive DB', age: '3 years in archive' },
  { id: 'p3', module: '📱 Notifications', detail: '5 files · 0.6 GB in Archive DB', age: '1 year in archive' }
];

const TABS = ['📦 All Files', '📤 Eligible for Cold Push', '🗑️ Eligible for Deletion', '📋 Upload History'];

export function ColdStorageManager() {
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [infoFile, setInfoFile] = useState<ColdFile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const files = FILES.filter((f) => {
    if (tab === TABS[1]) return !f.eligibleForDeletion;
    if (tab === TABS[2]) return f.eligibleForDeletion;
    return true;
  })
    .filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .filter((f) => moduleFilter === 'All' || f.module === moduleFilter)
    .filter((f) => periodFilter === 'All' || f.period === periodFilter);

  const totalCompressed = FILES.reduce((s, f) => s + f.compressed, 0) / 1024;
  const totalOriginal = FILES.reduce((s, f) => s + f.original, 0) / 1024;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={Snowflake}
        title="Cold Storage Manager"
        screen="Cold Storage Manager"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Cold storage index re-synced with the provider.')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Index
            </Button>
            <Button size="sm" className="text-xs bg-sky-600 hover:bg-sky-700 text-white" onClick={() => showToast('Cold push job queued for review.')}>
              <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Push New Archive
            </Button>
          </>
        }
      />

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard icon={Snowflake} label="Total in Cold Storage" value="41.2 GB" sub="(Compressed) · ~165 GB original" />
        <KpiCard icon={Package} label="Total Files" value="28 Files" sub="10 shown in this index view" />
        <KpiCard icon={Trash2} label="Eligible for Deletion" value="2 Files (3.2 GB)" tone="text-rose-700" sub="8yr+ retention met · 🗑️ Review Now" />
        <KpiCard icon={UploadCloud} label="Eligible for Cold Push" value="3 Modules" tone="text-sky-700" sub="5yr+ in archive · 📤 Push Now" />
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

      {tab === TABS[1] && (
        <Panel icon={UploadCloud} title="Files Eligible for Cold Push" subtitle="Archive data older than 3 years — move eligible, retention-approved files to Glacier">
          <div className="divide-y divide-gray-100">
            {COLD_PUSH_CANDIDATES.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-xs font-semibold text-gray-900">{c.module}</p>
                  <p className="text-[11px] text-gray-500">{c.detail} · {c.age}</p>
                </div>
                <Button size="sm" className="h-7 text-[11px] bg-sky-600 hover:bg-sky-700 text-white" onClick={() => showToast(`${c.module}: cold push queued.`)}>
                  ❄️ Push to Cold
                </Button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === TABS[2] && (
        <Panel icon={Trash2} title="Files Eligible for Deletion" subtitle="Retention period complete — deletion needs Super Admin + Principal approval">
          <div className="divide-y divide-gray-100">
            {FILES.filter((f) => f.eligibleForDeletion).map((f) => (
              <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-xs font-semibold text-gray-900 font-mono">{f.name}</p>
                  <p className="text-[11px] text-gray-500">
                    {f.module} · {f.period} · {f.compressed} MB compressed · pushed {f.pushed} · 8 year retention met
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setInfoFile(f)}>
                    <Info className="w-3 h-3 mr-1" /> Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] text-rose-700 border-rose-200"
                    onClick={() => showToast(`Deletion request for ${f.name} sent for approval.`)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Request Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === TABS[3] && (
        <Panel icon={UploadCloud} title="Upload History" subtitle="Every file pushed to cold storage">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={TH}>Pushed On</th>
                  <th className={TH}>File</th>
                  <th className={TH}>Size</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {FILES.map((f) => (
                  <tr key={f.id}>
                    <td className="p-3 text-gray-600">{f.pushed}</td>
                    <td className="p-3 font-mono text-gray-800">{f.name}</td>
                    <td className="p-3 text-gray-700">{f.compressed} MB</td>
                    <td className="p-3">
                      <Pill tone="green">✅ Uploaded</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {(tab === TABS[0] || tab === TABS[1] || tab === TABS[2]) && (
        <Panel
          icon={Snowflake}
          title="Cold Storage Files — AWS S3 Glacier"
          subtitle="Provider: AWS S3 Glacier · Region: ap-south-1 (Mumbai) · Vault: school-xyz-archive"
          actions={
            <>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs w-52"
                />
              </div>
              <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">Module: All</option>
                <option>Finance</option>
                <option>Fee</option>
                <option>Payroll</option>
                <option>HR</option>
                <option>Academic</option>
                <option>Exam</option>
              </select>
              <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
                <option value="All">Period: All</option>
                <option>FY 19-20</option>
                <option>FY 18-19</option>
                <option>FY 16-17</option>
              </select>
            </>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="cold-table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={`${TH} w-10`}>
                    <input
                      type="checkbox"
                      checked={files.length > 0 && selected.length === files.length}
                      onChange={(e) => setSelected(e.target.checked ? files.map((f) => f.id) : [])}
                    />
                  </th>
                  <th className={TH}>File Name</th>
                  <th className={TH}>Module</th>
                  <th className={TH}>Period</th>
                  <th className={TH}>Comp. Size</th>
                  <th className={TH}>Original Size</th>
                  <th className={TH}>Pushed Date</th>
                  <th className={TH}>Retrieval Count</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map((f) => (
                  <tr key={f.id} className="hover:bg-sky-50/20">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} />
                    </td>
                    <td className="p-3 font-mono text-gray-800">{f.name}</td>
                    <td className="p-3 text-gray-700">{f.module}</td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">{f.period}</td>
                    <td className="p-3 text-gray-700">{f.compressed} MB</td>
                    <td className="p-3 text-gray-700">{f.original} MB</td>
                    <td className="p-3 text-gray-600">{f.pushed}</td>
                    <td className="p-3 text-gray-600">{f.retrievals === 0 ? '0 times' : f.retrievals === 1 ? '1 time' : `${f.retrievals} times`}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button onClick={() => setInfoFile(f)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="File information">
                          <Info className="w-4 h-4" />
                        </button>
                        {f.eligibleForDeletion ? (
                          <Button variant="outline" size="sm" className="h-7 text-[10px] text-rose-700 border-rose-200" onClick={() => showToast(`${f.name} deletion request sent for approval.`)}>
                            <Trash2 className="w-3 h-3 mr-1" /> ELIGIBLE FOR DEL
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="h-7 text-[10px] text-sky-700 border-sky-200" onClick={() => showToast(`Retrieval requested for ${f.name}.`)}>
                              <DownloadCloud className="w-3 h-3 mr-1" /> Retrieve
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`Deletion request for ${f.name} sent for approval.`)}>
                              <Trash2 className="w-3 h-3 mr-1" /> Del
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500">
                      No cold storage files match the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 space-y-3">
            <p className="text-[11px] text-gray-600">
              TOTAL: 28 files | {totalCompressed.toFixed(1)} GB compressed | ~{totalOriginal.toFixed(0)} GB original
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setSelected(files.map((f) => f.id))}>
                ☑️ Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] text-sky-700 border-sky-200"
                onClick={() => showToast(`${selected.length || 0} file(s) queued for retrieval.`)}
              >
                <DownloadCloud className="w-3 h-3 mr-1" /> Retrieve Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] text-rose-700 border-rose-200"
                onClick={() => showToast('Deletion request raised for the eligible files.')}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Delete Eligible
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* file info popup */}
      {infoFile && (
        <Modal isOpen onClose={() => setInfoFile(null)} title={`File Information — ${infoFile.name}`} size="lg">
          <div className="space-y-3 text-xs">
            <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-3 space-y-1.5 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">STORAGE DETAILS</p>
              <p>AWS Archive ID: <span className="font-mono">HkF9p2z52FnwUn8Jmc2n9FT7FhimGnMH</span></p>
              <p>AWS Vault: <span className="font-mono">school-xyz-archive</span></p>
              <p>Region: ap-south-1 (Mumbai, India)</p>
              <p>Pushed to Cold: {infoFile.pushed}, 03:45 AM</p>
              <p>Compression: GZIP Level 6 · Encryption: AES-256</p>
              <p>
                Compressed Size: {infoFile.compressed} MB · Original Size: {infoFile.original} MB (
                {Math.round((1 - infoFile.compressed / infoFile.original) * 100)}% compression ratio)
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1.5 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">DATA DETAILS</p>
              <p>Module: {infoFile.module} · Period: {infoFile.period}</p>
              <p>Data Type: Journal Entries / Receipts depending on module</p>
              <p>Total Records: 11,250 records</p>
              <p>Archived to DB: 01-April-2021 (1 year in Archive DB)</p>
              <p>Pushed to Cold: after 3 years in Archive DB</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1.5 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">INTEGRITY</p>
              <p>Original Checksum: <span className="font-mono">a1b2c3d4e5f6g7h8i9j0… (SHA256)</span></p>
              <p>Compressed Checksum: <span className="font-mono">x9y8z7w6v5u4t3s2r1q0… (SHA256)</span></p>
              <p>Last Verified: Never (verify on retrieval)</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 space-y-1.5 text-gray-700">
              <p className="font-bold text-gray-800 text-[11px]">RETRIEVAL HISTORY</p>
              <p>Retrieval Count: {infoFile.retrievals} times</p>
              <p>Last Retrieved: 15-March-2025 (for IT Audit) · By Finance Manager — Priya Gupta</p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5 text-amber-900">
              <p className="font-bold text-[11px]">LEGAL RETENTION</p>
              <p>Created: {infoFile.period} · Retention Period: 8 Years (Income Tax Act)</p>
              <p>Eligible for Deletion: April 2027</p>
              <p>Status: 🔒 Must retain until April 2027 unless approved otherwise</p>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-1 border-t border-gray-100">
              <Button size="sm" className="text-xs bg-sky-600 hover:bg-sky-700 text-white" onClick={() => showToast(`Retrieval requested for ${infoFile.name}.`)}>
                <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Request Retrieval
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('File metadata exported.')}>
                <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Metadata
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setInfoFile(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
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

export default ColdStorageManager;
