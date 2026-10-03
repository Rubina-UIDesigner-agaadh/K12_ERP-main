// DataExport.tsx — Utilities ▸ Data Export Wizard
// Single page replacement for the deleted “Data Backup & Restore Utility”.
// The school picks an export TEMPLATE (what data), then exports the whole set to
// CSV or Excel. No imports, no writes — a template only ever produces a file.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  DownloadCloud,
  FileDown,
  FileSpreadsheet,
  FileText,
  CalendarClock,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Eye,
  Database,
  Lock
} from 'lucide-react';

interface ExportJob {
  id: string;
  name: string;
  module: string;
  format: 'Excel' | 'CSV' | 'PDF' | 'JSON';
  rows: number;
  size: string;
  when: string;
  by: string;
  status: 'Ready' | 'Processing' | 'Scheduled' | 'Expired';
}

const HISTORY: ExportJob[] = [
  { id: 'EXP-2025-0184', name: 'Fee Collection — FY 2025-26 (All classes)', module: 'Fee', format: 'Excel', rows: 18_450, size: '6.4 MB', when: '30-Sep-2025 09:12 AM', by: 'Priya Gupta (Finance Manager)', status: 'Ready' },
  { id: 'EXP-2025-0183', name: 'Trial Balance — Sep 2025', module: 'Finance / GL', format: 'PDF', rows: 1_240, size: '820 KB', when: '29-Sep-2025 06:40 PM', by: 'Priya Gupta (Finance Manager)', status: 'Ready' },
  { id: 'EXP-2025-0182', name: 'Student Master — Active students only', module: 'Student', format: 'CSV', rows: 4_120, size: '1.2 MB', when: '29-Sep-2025 11:05 AM', by: 'Anil Mehta (Super Admin)', status: 'Ready' },
  { id: 'EXP-2025-0181', name: 'Payroll Register — Aug 2025', module: 'Payroll', format: 'Excel', rows: 268, size: '410 KB', when: '28-Sep-2025 04:22 PM', by: 'Kavita Rao (HR Manager)', status: 'Ready' },
  { id: 'EXP-2025-0180', name: 'Attendance Summary — Q2 2025-26', module: 'Attendance', format: 'CSV', rows: 96_400, size: '12.8 MB', when: '28-Sep-2025 02:00 AM', by: 'System (Scheduled)', status: 'Processing' },
  { id: 'EXP-2025-0179', name: 'Expense Vouchers — FY 2024-25', module: 'Expenses', format: 'Excel', rows: 3_820, size: '2.1 MB', when: '15-Sep-2025 10:30 AM', by: 'Priya Gupta (Finance Manager)', status: 'Expired' }
];

const MODULE_DATASETS: Record<string, string[]> = {
  'Fee': ['Fee Collection Register', 'Fee Defaulter List', 'Receipt-wise Detail', 'Concession & Discount Register'],
  'Finance / GL': ['Trial Balance', 'Income & Expenditure', 'Balance Sheet', 'Day Book', 'Voucher Register'],
  'Expenses': ['Expense Vouchers', 'Vendor-wise Spend', 'Budget vs Actual', 'Purchase Register'],
  'Student': ['Student Master', 'Admission Register', 'Class-wise Strength', 'TC Register'],
  'Payroll': ['Payroll Register', 'Salary Slip Data', 'Bank Advice', 'PF / ESI Summary'],
  'Attendance': ['Student Attendance Summary', 'Employee Attendance Summary', 'Absentee Report'],
  'Examination': ['Marks Register', 'Result Summary', 'Report Card Data', 'Grade Distribution']
};

const FORMATS = [
  { id: 'Excel' as const, icon: FileSpreadsheet, label: 'Excel (.xlsx)', hint: 'Recommended — headers, totals and auto-filter already applied' },
  { id: 'CSV' as const, icon: FileText, label: 'CSV (.csv)', hint: 'Plain text — opens in every tool and re-imports cleanly' }
];

// ---------------------------------------------------------------------------
// Export templates — the school picks ONE template and exports everything it
// covers. A template bundles the module, the data set and its column layout.
// ---------------------------------------------------------------------------
interface ExportTemplate {
  id: string;
  name: string;
  module: string;
  dataset: string;
  description: string;
  approx: string;
}

const TEMPLATES: ExportTemplate[] = [
  { id: 'tpl-fee-collection', name: 'Fee Collection Register', module: 'Fee', dataset: 'Fee Collection Register', description: 'Every receipt with amount, mode, fee head and collector', approx: '18,450' },
  { id: 'tpl-fee-defaulter', name: 'Fee Defaulter List', module: 'Fee', dataset: 'Fee Defaulter List', description: 'Pending dues by class, student and instalment', approx: '1,842' },
  { id: 'tpl-fee-receipt-detail', name: 'Receipt-wise Detail', module: 'Fee', dataset: 'Receipt-wise Detail', description: 'Line-level split of each receipt across fee heads', approx: '26,900' },
  { id: 'tpl-fee-concession', name: 'Concession & Discount Register', module: 'Fee', dataset: 'Concession & Discount Register', description: 'Concessions, scholarships and waivers applied', approx: '3,120' },
  { id: 'tpl-gl-trial-balance', name: 'Trial Balance', module: 'Finance / GL', dataset: 'Trial Balance', description: 'Ledger-wise opening, debit, credit and closing', approx: '1,240' },
  { id: 'tpl-gl-income-expenditure', name: 'Income & Expenditure', module: 'Finance / GL', dataset: 'Income & Expenditure', description: 'Statement of income and expenditure by head', approx: '860' },
  { id: 'tpl-gl-balance-sheet', name: 'Balance Sheet', module: 'Finance / GL', dataset: 'Balance Sheet', description: 'Assets and liabilities as on the selected date', approx: '740' },
  { id: 'tpl-gl-day-book', name: 'Day Book', module: 'Finance / GL', dataset: 'Day Book', description: 'All vouchers posted on a day with narration', approx: '2,480' },
  { id: 'tpl-exp-vouchers', name: 'Expense Vouchers', module: 'Expenses', dataset: 'Expense Vouchers', description: 'Voucher-wise expense with head, vendor and tax', approx: '3,820' },
  { id: 'tpl-exp-vendor', name: 'Vendor-wise Spend', module: 'Expenses', dataset: 'Vendor-wise Spend', description: 'Spend consolidated per vendor and head', approx: '620' },
  { id: 'tpl-exp-budget', name: 'Budget vs Actual', module: 'Expenses', dataset: 'Budget vs Actual', description: 'Budget consumption with variance per head', approx: '310' },
  { id: 'tpl-stu-master', name: 'Student Master', module: 'Student', dataset: 'Student Master', description: 'Every active student with class, guardian and status', approx: '4,120' },
  { id: 'tpl-stu-admission', name: 'Admission Register', module: 'Student', dataset: 'Admission Register', description: 'Admission details with date, class and documents', approx: '2,860' },
  { id: 'tpl-stu-strength', name: 'Class-wise Strength', module: 'Student', dataset: 'Class-wise Strength', description: 'Boys, girls and total strength per class-section', approx: '120' },
  { id: 'tpl-pay-register', name: 'Payroll Register', module: 'Payroll', dataset: 'Payroll Register', description: 'Monthly payroll with gross, deductions and net pay', approx: '268' },
  { id: 'tpl-pay-bank-advice', name: 'Bank Advice', module: 'Payroll', dataset: 'Bank Advice', description: 'Bank-transfer advice file for salary disbursement', approx: '268' },
  { id: 'tpl-att-student', name: 'Student Attendance Summary', module: 'Attendance', dataset: 'Student Attendance Summary', description: 'Day-wise attendance summary per class and section', approx: '96,400' },
  { id: 'tpl-att-employee', name: 'Employee Attendance Summary', module: 'Attendance', dataset: 'Employee Attendance Summary', description: 'Staff attendance with late, leave and overtime', approx: '8,240' },
  { id: 'tpl-exam-marks', name: 'Marks Register', module: 'Examination', dataset: 'Marks Register', description: 'Subject-wise marks with grade and examiner', approx: '42,600' },
  { id: 'tpl-exam-result', name: 'Result Summary', module: 'Examination', dataset: 'Result Summary', description: 'Result, percentage and division per student', approx: '4,120' }
];

export function DataExport() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [templateQuery, setTemplateQuery] = useState('');
  const [templateModule, setTemplateModule] = useState('All modules');
  const [module, setModule] = useState(TEMPLATES[0].module);
  const [dataset, setDataset] = useState(TEMPLATES[0].dataset);
  const [fy, setFy] = useState('FY 2025-26');
  const [fromDate, setFromDate] = useState('2025-04-01');
  const [toDate, setToDate] = useState('2025-09-30');
  const [format, setFormat] = useState<'Excel' | 'CSV' | 'PDF' | 'JSON'>('Excel');
  const [compress, setCompress] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [email, setEmail] = useState('priya.gupta@school.com');
  const [rowsEstimate] = useState(18_450);
  const [recent, setRecent] = useState<ExportJob[]>(HISTORY);
  const [preview, setPreview] = useState<ExportJob | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const selectedTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  const pickTemplate = (tpl: ExportTemplate) => {
    setTemplateId(tpl.id);
    setModule(tpl.module);
    setDataset(tpl.dataset);
  };

  const visibleTemplates = TEMPLATES.filter((t) => {
    if (templateModule !== 'All modules' && t.module !== templateModule) return false;
    if (!templateQuery) return true;
    const q = templateQuery.toLowerCase();
    return `${t.name} ${t.module} ${t.dataset} ${t.description}`.toLowerCase().includes(q);
  });

  const runExport = () => {
    const job: ExportJob = {
      id: `EXP-2025-0${185 + recent.length - HISTORY.length}`,
      name: `${selectedTemplate.name} — ${fromDate} to ${toDate}`,
      module,
      format,
      rows: rowsEstimate,
      size: format === 'Excel' ? '6.4 MB' : format === 'CSV' ? '4.1 MB' : format === 'PDF' ? '1.8 MB' : '7.2 MB',
      when: 'Just now',
      by: 'You (Super Admin)',
      status: 'Ready'
    };
    setRecent((prev) => [job, ...prev]);
    showToast(`${format} export ready — ${job.name}${sendEmail ? ` (emailed to ${email})` : ''}`);
  };

  return (
    <div className="space-y-6 py-6">
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <DownloadCloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <nav className="text-[11px] text-gray-500">
              Home &gt; Administration &gt; Utilities &gt; <span className="text-gray-700 font-medium">Data Export Wizard</span>
            </nav>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">Data Export Wizard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Pick a data template, and the wizard exports the whole set of school ERP data behind it as an Excel or CSV sheet.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={fy} onChange={(e) => setFy(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-md text-xs bg-white">
            <option>FY 2025-26</option>
            <option>FY 2024-25</option>
            <option>FY 2023-24</option>
          </select>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Export presets reloaded.')}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* restriction banner */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900 space-y-0.5">
          <p className="font-bold">Exports are read-only and fully logged</p>
          <p>
            Nobody can import or overwrite data from this page — it only writes a file. Every export records the module, filter
            range, row count, operator and file hash in the Audit Trail. Salary, PF and bank details are masked for anyone
            below HR Manager.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* LEFT — config */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">1. Select a data template</h2>
              <span className="text-[11px] text-gray-500 ml-auto">
                {visibleTemplates.length} of {TEMPLATES.length} templates
              </span>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Search templates</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      value={templateQuery}
                      onChange={(e) => setTemplateQuery(e.target.value)}
                      placeholder="Search by template, module or data set..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Module</label>
                  <select
                    value={templateModule}
                    onChange={(e) => setTemplateModule(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white"
                  >
                    {['All modules', ...Object.keys(MODULE_DATASETS)].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {visibleTemplates.map((tpl) => {
                  const isSelected = tpl.id === templateId;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => pickTemplate(tpl)}
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-start gap-2">
                        <FileSpreadsheet className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <span className="min-w-0">
                          <span className="block font-semibold text-gray-900">{tpl.name}</span>
                          <span className="block text-[11px] text-gray-500">{tpl.description}</span>
                          <span className="block text-[10px] text-gray-400 mt-1">
                            {tpl.module} · {tpl.dataset} · ≈ {tpl.approx} records
                          </span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto shrink-0" />}
                      </span>
                    </button>
                  );
                })}
                {visibleTemplates.length === 0 && (
                  <p className="md:col-span-2 text-center text-gray-500 py-6">
                    No template matches “{templateQuery}”.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-semibold text-indigo-900">Selected: {selectedTemplate.name}</span>
                <span className="text-indigo-800">Template id {selectedTemplate.id}</span>
                <span className="text-indigo-800 ml-auto">≈ {selectedTemplate.approx} records will be written</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">From Date</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">To Date</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Class / Department</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>All Classes</option>
                    <option>Class IX</option>
                    <option>Class X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1 font-medium">Status</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white">
                    <option>Active / Paid only</option>
                    <option>All records</option>
                    <option>Cancelled only</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    placeholder="Optional: search within the export set"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => showToast('Record count recalculated for the selected filters.')}>
                  Preview Record Count
                </Button>
                <Badge variant="info">≈ {rowsEstimate.toLocaleString('en-IN')} records</Badge>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <FileDown className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">3. Choose the export format</h2>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      format === f.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <f.icon className={`w-5 h-5 shrink-0 ${format === f.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>
                      <span className="block font-semibold text-gray-900">{f.label}</span>
                      <span className="block text-[11px] text-gray-500">{f.hint}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} />
                  <span className="text-gray-700">Compress as .zip (recommended for &gt; 5 MB)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                  <span className="text-gray-700">Email me the download link</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`p-1.5 border border-gray-300 rounded-md text-xs ${sendEmail ? '' : 'opacity-50'}`}
                  disabled={!sendEmail}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={runExport}>
                  <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Export Now
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Save as scheduled export dialog opened.')}>
                  <CalendarClock className="w-3.5 h-3.5 mr-1.5" /> Save as Scheduled Export
                </Button>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => showToast('Export settings reset.')}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* history */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-gray-900">Recent Exports</h2>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>All Modules</option>
              <option>Fee</option>
              <option>Finance / GL</option>
              <option>Payroll</option>
            </select>
            <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>This FY</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Export log downloaded.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Log
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" data-testid="export-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Export ID</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">What was exported</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Format</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Rows</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">When</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">By</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((h) => (
                <tr key={h.id} className="hover:bg-indigo-50/20">
                  <td className="p-3 font-mono text-[10px] text-indigo-700 whitespace-nowrap">{h.id}</td>
                  <td className="p-3 text-gray-800">{h.name}</td>
                  <td className="p-3 text-gray-700 whitespace-nowrap">{h.module}</td>
                  <td className="p-3 text-gray-700">{h.format}</td>
                  <td className="p-3 text-gray-700">{h.rows ? h.rows.toLocaleString('en-IN') : '—'}</td>
                  <td className="p-3 text-gray-700">{h.size}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{h.when}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{h.by}</td>
                  <td className="p-3">
                    <Badge
                      variant={h.status === 'Ready' ? 'success' : h.status === 'Processing' ? 'info' : h.status === 'Scheduled' ? 'warning' : 'default'}
                    >
                      {h.status === 'Ready' ? '✅ Ready' : h.status === 'Processing' ? '⏳ Processing' : h.status === 'Scheduled' ? '🕐 Scheduled' : '⚠️ Expired'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {h.status === 'Ready' ? (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${h.id} downloaded (${h.size}).`)}>
                            <DownloadCloud className="w-3 h-3 mr-1" /> Download
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPreview(h)}>
                            <Eye className="w-3 h-3 mr-1" /> Details
                          </Button>
                        </>
                      ) : h.status === 'Expired' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px]"
                          onClick={() => {
                            setRecent((prev) => prev.map((x) => (x.id === h.id ? { ...x, status: 'Ready', when: 'Just now' } : x)));
                            showToast(`${h.id} regenerated and ready to download.`);
                          }}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Re-run
                        </Button>
                      ) : (
                        <Badge variant="info">In queue</Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <Modal isOpen onClose={() => setPreview(null)} title={`Export Details — ${preview.id}`} size="lg">
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
              <p className="font-bold">{preview.name}</p>
              <p className="text-[11px] text-indigo-100">
                {preview.module} · {preview.format} · {preview.rows.toLocaleString('en-IN')} rows · {preview.size}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <p>Export ID: <strong className="font-mono">{preview.id}</strong></p>
              <p>Generated: <strong>{preview.when}</strong></p>
              <p>Requested By: <strong>{preview.by}</strong></p>
              <p>Status: <strong>{preview.status}</strong></p>
              <p>Compression: <strong>ZIP enabled</strong></p>
              <p className="md:col-span-2">
                File checksum: <span className="font-mono text-[10px]">a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 (SHA256, logged in Audit Trail)</span>
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast(`${preview.id} download started.`)}>
                <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Download Again
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Audit entry for this export opened (Archive Audit Trail).')}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> View Audit Entry
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setPreview(null)}>
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

export default DataExport;
