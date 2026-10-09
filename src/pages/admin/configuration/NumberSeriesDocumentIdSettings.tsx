import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import {
  Activity, CheckCircle2, ChevronLeft, ChevronRight, Copy, Download, Eye,
  FileText, Hash, History, ListRestart, Lock, Plus, RotateCcw, Save,
  Settings2, Trash2, Upload, X
} from 'lucide-react';
import { downloadCsv } from '../utilities/archiveWorkflowState';
import { readXlsxRows } from './xlsxRows';

type ResetType = 'Never' | 'Daily' | 'Monthly' | 'Financial Year' | 'Academic Year';
type SeriesStatus = 'Active' | 'Inactive';
type PageTab = 'Number Series' | 'Document ID Settings' | 'Usage Log';
type LogAction = 'Generated' | 'Manual Update' | 'Reset' | 'Gap Detected' | 'Configuration Updated' | 'Template Updated';
type YearToken = 'None' | 'AY' | 'FY' | 'YYYY' | 'YY';

interface PatternConfig {
  prefix: string;
  separator: string;
  yearToken: YearToken;
  includeSchoolCode: boolean;
  includeBranch: boolean;
  includeMonth: boolean;
  includeDate: boolean;
  includeStudentId: boolean;
  includeClass: boolean;
  sequenceDigits: number;
}
interface NumberSeries {
  id: string; year: string; code: string; name: string; module: string; subModule: string;
  description: string; pattern: string; digitLength: number; startNumber: number;
  increment: number; currentNumber: number; resetType: ResetType; lastReset: string;
  nextReset: string; status: SeriesStatus; lockedForFY: boolean;
  lockCodeAfterUse: boolean; allowManualEntry: boolean; allowGaps: boolean; alertEmail: boolean;
}
interface DocumentTemplate {
  id: string; year: string; code: string; name: string; module: string; subModule: string;
  pattern: string; referenceLabel: string; active: boolean; includeYear: boolean;
  includeBranch: boolean; includeDate: boolean; includeStudentId: boolean;
  includeClass: boolean; duplicateCheck: boolean; signatureRequired: boolean;
  allowReprint: boolean; securePrint: boolean; watermark: string;
}
interface UsageLog {
  id: string; year: string; at: string; seriesCode: string; seriesName: string;
  module: string; subModule: string; sequence: number; formattedNumber: string;
  action: LogAction; performedBy: string; notes: string;
}
interface GlobalSettings {
  schoolCode: string; separator: string; yearFormat: 'YY' | 'YYYY';
  yearStyle: 'AY' | 'FY'; monthFormat: 'MM' | 'MMM';
  uniqueness: 'School-wide' | 'Branch-wise' | 'Module-wise';
  rollover: 'Keep counting' | 'Reset by rule' | 'Require approval';
  notificationEmail: string; logRetentionMonths: number; lockAtYearEnd: boolean;
  preventDuplicates: boolean; requireApprovalForReset: boolean;
  auditSequenceGaps: boolean; allowManualNumbers: boolean;
}

const STORAGE_KEY = 'k12-number-series-document-settings-v3';
const YEARS = ['2025-26', '2026-27', '2024-25', '2023-24'];
const MODULES = ['Admissions', 'Student Records', 'Finance', 'Academics', 'Human Resources', 'Library', 'Transport', 'Hostel', 'Inventory', 'Operations', 'Communication'];
const RESET_OPTIONS: ResetType[] = ['Never', 'Daily', 'Monthly', 'Financial Year', 'Academic Year'];
const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  schoolCode: 'RPS', separator: '/', yearFormat: 'YY', yearStyle: 'AY', monthFormat: 'MM',
  uniqueness: 'School-wide', rollover: 'Reset by rule', notificationEmail: 'admin@school.edu.in',
  logRetentionMonths: 84, lockAtYearEnd: true, preventDuplicates: true,
  requireApprovalForReset: true, auditSequenceGaps: true, allowManualNumbers: false
};

// 42 sample series; format structure is decoded into a guided builder when edited.
const SERIES_DEFINITIONS: Array<[string, string, string, string, string, number, number, ResetType, SeriesStatus]> = [
  ['STU-ADM','Student Admission Number','Admissions','Admissions','ADM/{AY}/{SEQ}',5,1245,'Academic Year','Active'],
  ['STU-ID','Student ID Number','Student Records','Student Identity','STU/{FY}/{SEQ}',6,22145,'Never','Active'],
  ['ADM-ENQ','Admission Enquiry Number','Admissions','Enquiry','ENQ/{YY}/{SEQ}',5,854,'Academic Year','Active'],
  ['STU-TC','Transfer Certificate Number','Student Records','Certificates','TC/{FY}/{SEQ}',5,314,'Never','Active'],
  ['STU-BON','Bonafide Certificate Number','Student Records','Certificates','BON/{AY}/{SEQ}',5,182,'Academic Year','Active'],
  ['STU-CHR','Character Certificate Number','Student Records','Certificates','CHR/{AY}/{SEQ}',5,73,'Never','Active'],
  ['STU-LC','Leaving Certificate Number','Student Records','Certificates','LC/{FY}/{SEQ}',5,207,'Never','Active'],
  ['STU-REG','Student Registration Number','Student Records','Registration','REG/{AY}/{SEQ}',6,18320,'Never','Active'],
  ['STU-ATT','Student Attendance Incident','Student Records','Attendance','ATT/{YYYY}/{MM}/{SEQ}',5,412,'Monthly','Active'],
  ['FEE-RCP','Fee Receipt Number','Finance','Fee Receipts','RCP/{FY}/{SEQ}',6,97842,'Financial Year','Active'],
  ['FEE-RFD','Fee Refund Number','Finance','Refunds','RFD/{FY}/{SEQ}',5,185,'Financial Year','Active'],
  ['FIN-VCH','Fee Voucher Number','Finance','Vouchers','FV/{FY}/{SEQ}',6,12450,'Never','Active'],
  ['GL-JV','General Ledger Journal Voucher','Finance','General Ledger','JV/{FY}/{SEQ}',5,94221,'Financial Year','Active'],
  ['EXP-VCH','Expense Voucher Number','Finance','Expenses','EXP/{FY}/{SEQ}',5,820,'Financial Year','Active'],
  ['PUR-ORD','Purchase Order Number','Finance','Purchasing','PO/{FY}/{SEQ}',5,1442,'Never','Active'],
  ['VEN-INV','Vendor Invoice Number','Finance','Vendor Invoices','VIN/{FY}/{SEQ}',5,716,'Financial Year','Active'],
  ['FIN-CN','Credit Note Number','Finance','Credit Notes','CN/{FY}/{SEQ}',5,148,'Financial Year','Active'],
  ['FIN-DN','Debit Note Number','Finance','Debit Notes','DN/{FY}/{SEQ}',5,195,'Financial Year','Active'],
  ['HR-PAY','Payroll Run Number','Human Resources','Payroll','PAY/{FY}/{MM}/{SEQ}',4,68,'Monthly','Active'],
  ['HR-SAL','Salary Slip Number','Human Resources','Payroll','SAL/{FY}/{MM}/{SEQ}',5,613,'Monthly','Active'],
  ['HR-EMP','Employee ID Number','Human Resources','Employee Records','EMP/{SEQ}',5,156,'Never','Active'],
  ['HR-APT','Appointment Order Number','Human Resources','Appointments','APT/{FY}/{SEQ}',4,94,'Financial Year','Active'],
  ['HR-ATT','Staff Attendance Batch Number','Human Resources','Attendance','HAT/{YYYY}/{MM}/{SEQ}',4,321,'Monthly','Active'],
  ['EXM-SES','Examination Session Number','Academics','Examinations','EXM/{AY}/{SEQ}',4,42,'Never','Active'],
  ['EXM-ADM','Admit Card Number','Academics','Examinations','ADMIT/{AY}/{SEQ}',5,2840,'Academic Year','Active'],
  ['EXM-MRK','Marksheet Number','Academics','Results','MS/{AY}/{SEQ}',5,1834,'Academic Year','Active'],
  ['EXM-RPT','Report Card Number','Academics','Results','RC/{AY}/{SEQ}',5,2490,'Academic Year','Active'],
  ['EXM-ASG','Assessment Number','Academics','Assessment','ASM/{AY}/{SEQ}',5,813,'Academic Year','Active'],
  ['EXM-RES','Result Publication Number','Academics','Results','RES/{AY}/{SEQ}',4,24,'Academic Year','Active'],
  ['ACA-TT','Timetable Version Number','Academics','Timetable','TT/{AY}/{SEQ}',4,58,'Academic Year','Active'],
  ['LIB-ACC','Library Accession Number','Library','Cataloguing','LIB/{SEQ}',6,48950,'Never','Active'],
  ['LIB-ISS','Library Issue Slip Number','Library','Circulation','ISS/{YYYY}/{SEQ}',5,682,'Daily','Inactive'],
  ['LIB-MEM','Library Membership Number','Library','Membership','MEM/{AY}/{SEQ}',5,315,'Academic Year','Active'],
  ['TRN-ROU','Transport Route Number','Transport','Routes','ROUTE/{SEQ}',3,28,'Never','Active'],
  ['TRN-VEH','Vehicle Number','Transport','Vehicles','VEH/{FY}/{SEQ}',4,34,'Never','Active'],
  ['TRN-BUS','Bus Pass Number','Transport','Bus Passes','BUS/{AY}/{SEQ}',5,440,'Academic Year','Inactive'],
  ['HST-ALC','Hostel Allocation Number','Hostel','Allocations','HST/{AY}/{SEQ}',4,182,'Academic Year','Active'],
  ['HST-FEE','Hostel Fee Receipt Number','Hostel','Fee Receipts','HF/{FY}/{SEQ}',5,728,'Financial Year','Active'],
  ['INV-ITM','Inventory Item Number','Inventory','Items','ITM/{SEQ}',6,20415,'Never','Active'],
  ['INV-ISS','Stock Issue Number','Inventory','Stock Issue','SI/{FY}/{SEQ}',5,396,'Financial Year','Inactive'],
  ['OPS-GRV','Grievance Ticket Number','Operations','Grievances','GRV/{YYYY}/{SEQ}',4,9870,'Never','Active'],
  ['COM-SMS','SMS Campaign Number','Communication','SMS Campaigns','SMS/{YYYY}/{MM}/{SEQ}',5,1520,'Monthly','Inactive']
];
const DOCUMENT_DEFINITIONS: Array<[string, string, string, string, string, string]> = [
  ['ADM-FRM','Student Admission Form','Admissions','Admissions','ADM/{AY}/{SEQ}','Admission No.'],
  ['ADM-ACK','Admission Acknowledgement','Admissions','Enquiry','ACK/{AY}/{SEQ}','Acknowledgement No.'],
  ['FEE-RCP','Fee Receipt','Finance','Fee Receipts','RCP/{FY}/{SEQ}','Receipt No.'],
  ['FEE-RFD','Fee Refund Voucher','Finance','Refunds','RFD/{FY}/{SEQ}','Refund No.'],
  ['STU-BON','Bonafide Certificate','Student Records','Certificates','BON/{AY}/{SEQ}','Certificate No.'],
  ['STU-TC','Transfer Certificate','Student Records','Certificates','TC/{FY}/{SEQ}','TC No.'],
  ['STU-LC','Leaving Certificate','Student Records','Certificates','LC/{FY}/{SEQ}','LC No.'],
  ['STU-CHR','Character Certificate','Student Records','Certificates','CHR/{AY}/{SEQ}','Certificate No.'],
  ['EXM-RPT','Student Report Card','Academics','Results','RC/{AY}/{SEQ}','Report No.'],
  ['EXM-MRK','Student Marksheet','Academics','Results','MS/{AY}/{SEQ}','Marksheet No.'],
  ['EXM-ADM','Examination Admit Card','Academics','Examinations','ADMIT/{AY}/{SEQ}','Admit Card No.'],
  ['STU-IDC','Student Identity Card','Student Records','Student Identity','ID/{AY}/{SEQ}','Card No.'],
  ['HR-IDC','Employee Identity Card','Human Resources','Employee Records','EMP/{SEQ}','Employee No.'],
  ['HR-APT','Appointment Letter','Human Resources','Appointments','APT/{FY}/{SEQ}','Order No.'],
  ['HR-SAL','Salary Slip','Human Resources','Payroll','SAL/{FY}/{MM}/{SEQ}','Slip No.'],
  ['FIN-VCH','Expense Voucher','Finance','Expenses','EXP/{FY}/{SEQ}','Voucher No.'],
  ['VEN-INV','Vendor Invoice','Finance','Vendor Invoices','VIN/{FY}/{SEQ}','Invoice No.'],
  ['LIB-ACC','Library Accession Label','Library','Cataloguing','LIB/{SEQ}','Accession No.']
];
const defaultPatternConfig = (prefix = 'DOC'): PatternConfig => ({ prefix, separator: '/', yearToken: 'AY', includeSchoolCode: false, includeBranch: false, includeMonth: false, includeDate: false, includeStudentId: false, includeClass: false, sequenceDigits: 5 });
const parsePatternConfig = (pattern: string, digits: number): PatternConfig => {
  const knownTokens = pattern.match(/\{(?:SC|AY|FY|YYYY|YY|MM|DATE|STU|CLASS|BR|SEQ)\}/g) || [];
  let prefix = pattern.split(/[/{]/)[0].replace(/[^A-Za-z0-9-]/g, '');
  if (prefix === 'SC') prefix = '';
  const yearToken = (['AY','FY','YYYY','YY'].find((token) => pattern.includes(`{${token}}`)) || 'None') as YearToken;
  return {
    prefix, separator: pattern.includes('/') ? '/' : pattern.includes('.') ? '.' : '-',
    yearToken, includeSchoolCode: knownTokens.includes('{SC}'), includeBranch: knownTokens.includes('{BR}'),
    includeMonth: knownTokens.includes('{MM}'), includeDate: knownTokens.includes('{DATE}'),
    includeStudentId: knownTokens.includes('{STU}'), includeClass: knownTokens.includes('{CLASS}'),
    sequenceDigits: Math.max(1, digits || 5)
  };
};
const buildPattern = (config: PatternConfig) => {
  const parts = [config.prefix.trim().toUpperCase()];
  if (config.includeSchoolCode) parts.push('{SC}');
  if (config.yearToken !== 'None') parts.push(`{${config.yearToken}}`);
  if (config.includeMonth) parts.push('{MM}');
  if (config.includeDate) parts.push('{DATE}');
  if (config.includeStudentId) parts.push('{STU}');
  if (config.includeClass) parts.push('{CLASS}');
  if (config.includeBranch) parts.push('{BR}');
  parts.push('{SEQ}');
  return parts.filter(Boolean).join(config.separator);
};
const renderPattern = (pattern: string, digits: number, sequence: number, year: string, settings: GlobalSettings) => {
  const now = new Date();
  const yearStart = year.slice(0, 4) || String(now.getFullYear());
  const yearEnd = String((Number(yearStart) || now.getFullYear()) + 1).slice(-2);
  const yearShort = yearStart.slice(-2);
  const sequenceText = Math.max(0, sequence).toString().padStart(digits, '0');
  const monthNumber = now.getMonth() + 1;
  const monthText = settings.monthFormat === 'MMM' ? now.toLocaleString('en', { month: 'short' }).toUpperCase() : String(monthNumber).padStart(2, '0');
  const dateText = `${yearStart}${String(monthNumber).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return pattern.replace(/\{SEQ\}/g, sequenceText).replace(/\{AY\}/g, year).replace(/\{FY\}/g, year).replace(/\{YYYY\}/g, yearStart).replace(/\{YY\}/g, yearShort).replace(/\{MM\}/g, monthText).replace(/\{DATE\}/g, dateText).replace(/\{BR\}/g, 'MAIN').replace(/\{SC\}/g, settings.schoolCode).replace(/\{CLASS\}/g, '10A').replace(/\{STU\}/g, 'STU-0001');
};
const parseCsvLine = (line: string): string[] => {
  const result: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '"' && line[i + 1] === '"' && quoted) { cell += '"'; i += 1; }
    else if (line[i] === '"') quoted = !quoted;
    else if (line[i] === ',' && !quoted) { result.push(cell.trim()); cell = ''; }
    else cell += line[i];
  }
  result.push(cell.trim()); return result;
};
const nextYear = (year: string) => { const start = Number(year.slice(0, 4)) || 2025; return `${start + 1}-${String((start + 1) % 100).padStart(2, '0')}`; };
const previousYear = (year: string) => { const start = Number(year.slice(0, 4)) || 2025; return `${start - 1}-${String(start % 100).padStart(2, '0')}`; };
const resetLabel = (value: ResetType) => value;

function PatternBuilder({ value, onChange, year, settings, title = 'Build a format' }: { value: PatternConfig; onChange: (next: PatternConfig) => void; year: string; settings: GlobalSettings; title?: string }) {
  const update = <K extends keyof PatternConfig,>(key: K, next: PatternConfig[K]) => onChange({ ...value, [key]: next });
  const toggleFields: Array<[keyof PatternConfig, string]> = [
    ['includeSchoolCode','School code'], ['includeBranch','Branch code'], ['includeMonth','Month'],
    ['includeDate','Full date (YYYYMMDD)'], ['includeStudentId','Student ID'], ['includeClass','Class / section']
  ];
  const preview = renderPattern(buildPattern(value), value.sequenceDigits, 42, year, settings);
  return <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
    <div><p className="text-xs font-bold text-indigo-900">{title}</p><p className="text-[10px] text-indigo-700">Choose each identifier component below; the format is assembled for you.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <label className="text-[11px] font-medium text-gray-600">Prefix / document code<input value={value.prefix} onChange={(e) => update('prefix', e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 font-mono text-xs" placeholder="e.g. RCP" /></label>
      <label className="text-[11px] font-medium text-gray-600">Year segment<select value={value.yearToken} onChange={(e) => update('yearToken', e.target.value as YearToken)} className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-xs"><option value="None">No year</option><option value="AY">Academic year</option><option value="FY">Financial year</option><option value="YYYY">Calendar year (4 digits)</option><option value="YY">Calendar year (2 digits)</option></select></label>
      <label className="text-[11px] font-medium text-gray-600">Separator<select value={value.separator} onChange={(e) => update('separator', e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-xs"><option value="/">Slash /</option><option value="-">Hyphen -</option><option value=".">Dot .</option><option value="_">Underscore _</option></select></label>
      <label className="text-[11px] font-medium text-gray-600">Sequence digits<input type="number" min={1} max={12} value={value.sequenceDigits} onChange={(e) => update('sequenceDigits', Math.min(12, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-xs" /></label>
    </div>
    <div className="flex flex-wrap gap-2">{toggleFields.map(([key, label]) => <label key={String(key)} className="flex items-center gap-2 rounded-md border border-white bg-white px-2.5 py-2 text-[11px] text-gray-700"><input type="checkbox" checked={Boolean(value[key])} onChange={(e) => update(key, e.target.checked)} />{label}</label>)}</div>
    <div className="grid gap-2 rounded-lg border border-white bg-white p-3 md:grid-cols-2"><div><p className="text-[10px] font-bold uppercase text-gray-500">Assembled format</p><code className="mt-1 block break-all font-mono text-xs text-indigo-800">{buildPattern(value)}</code></div><div><p className="text-[10px] font-bold uppercase text-gray-500">Live example for {year}</p><code className="mt-1 block break-all font-mono text-sm font-bold text-indigo-950">{preview}</code></div></div>
  </div>;
}

const seedSeries = (year: string): NumberSeries[] => SERIES_DEFINITIONS.map(([code,name,module,subModule,pattern,digitLength,currentNumber,resetType,status], index) => ({
  id: `${year}:${code}`, year, code, name, module, subModule,
  description: `Automatic ${name.toLowerCase()} sequence for ${subModule}.`, pattern, digitLength,
  startNumber: 1, increment: 1, currentNumber, resetType,
  lastReset: resetType === 'Never' ? 'Never' : '01-Apr-2025',
  nextReset: resetType === 'Never' ? 'No scheduled reset' : resetType === 'Monthly' ? 'Next month' : '01-Apr-2026',
  status, lockedForFY: index < 14, lockCodeAfterUse: true, allowManualEntry: false,
  allowGaps: true, alertEmail: true
}));
const seedDocuments = (year: string): DocumentTemplate[] => DOCUMENT_DEFINITIONS.map(([code,name,module,subModule,pattern,referenceLabel], index) => ({
  id: `${year}:${code}`, year, code, name, module, subModule, pattern, referenceLabel,
  active: index !== 17, includeYear: /\{(?:AY|FY|YYYY|YY)\}/.test(pattern), includeBranch: index < 12,
  includeDate: pattern.includes('{MM}') || pattern.includes('{DATE}'), includeStudentId: /Student|Admission|Fee|Examination/.test(name),
  includeClass: /Student|Examination|Report|Marksheet/.test(name), duplicateCheck: true,
  signatureRequired: /Certificate|Letter|Voucher/.test(name), allowReprint: true,
  securePrint: /Identity Card|Salary Slip/.test(name), watermark: 'Original'
}));
const makeSeedLogs = (series: NumberSeries[], settings: GlobalSettings): UsageLog[] => series.slice(0, 22).map((item,index) => {
  const sequence = Math.max(item.startNumber, item.currentNumber - index);
  const at = new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString();
  return { id:`LOG-SEED-${String(index+1).padStart(3,'0')}`, year:item.year, at, seriesCode:item.code, seriesName:item.name, module:item.module, subModule:item.subModule, sequence, formattedNumber:renderPattern(item.pattern,item.digitLength,sequence,item.year,settings), action:index===8?'Gap Detected':'Generated', performedBy:index%4===0?'Priya Gupta':index%3===0?'Ramesh Sharma':'System', notes:index===8?'Sequence gap detected during integrity check.':'Generated by the ERP sequence service.' };
});
const readStoredState = (): any => { if (typeof window === 'undefined') return {}; try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } };

export function NumberSeriesDocumentIdSettings() {
  const stored = useMemo(readStoredState, []);
  const initialSeries = Array.isArray(stored.series) ? stored.series as NumberSeries[] : seedSeries('2025-26');
  const initialDocs = Array.isArray(stored.documents) ? stored.documents as DocumentTemplate[] : seedDocuments('2025-26');
  const [series, setSeries] = useState<NumberSeries[]>(initialSeries);
  const [documents, setDocuments] = useState<DocumentTemplate[]>(initialDocs);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ ...DEFAULT_GLOBAL_SETTINGS, ...(stored.globalSettings || {}) });
  const [logs, setLogs] = useState<UsageLog[]>(Array.isArray(stored.logs) ? stored.logs : makeSeedLogs(initialSeries, DEFAULT_GLOBAL_SETTINGS));
  const [selectedYear, setSelectedYear] = useState<string>(stored.selectedYear || '2025-26');
  const [activeTab, setActiveTab] = useState<PageTab>('Number Series');
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [subModuleFilter, setSubModuleFilter] = useState('All Sub-Modules');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [resetFilter, setResetFilter] = useState('All Reset Types');
  const [documentSearch, setDocumentSearch] = useState('');
  const [documentModuleFilter, setDocumentModuleFilter] = useState('All Modules');
  const [documentStatusFilter, setDocumentStatusFilter] = useState('All Status');
  const [usageSearch, setUsageSearch] = useState('');
  const [usageModule, setUsageModule] = useState('All Modules');
  const [usageSeries, setUsageSeries] = useState('All Series');
  const [usageUser, setUsageUser] = useState('All Users');
  const [usageFrom, setUsageFrom] = useState('');
  const [usageTo, setUsageTo] = useState('');
  const [showGapsOnly, setShowGapsOnly] = useState(false);
  const [usagePage, setUsagePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [seriesDraft, setSeriesDraft] = useState<NumberSeries | null>(null);
  const [seriesPattern, setSeriesPattern] = useState<PatternConfig>(defaultPatternConfig());
  const [documentDraft, setDocumentDraft] = useState<DocumentTemplate | null>(null);
  const [documentPattern, setDocumentPattern] = useState<PatternConfig>(defaultPatternConfig('DOC'));
  const [seriesModalMode, setSeriesModalMode] = useState<'create' | 'edit' | null>(null);
  const [documentModalMode, setDocumentModalMode] = useState<'create' | 'edit' | null>(null);
  const [detailSeries, setDetailSeries] = useState<NumberSeries | null>(null);
  const [detailDocument, setDetailDocument] = useState<DocumentTemplate | null>(null);
  const [logDetail, setLogDetail] = useState<UsageLog | null>(null);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<NumberSeries | null>(null);
  const [resetTargetValue, setResetTargetValue] = useState(1);
  const [resetReason, setResetReason] = useState('');
  const [approvalReference, setApprovalReference] = useState('');
  const [resetAllOpen, setResetAllOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copySourceYear, setCopySourceYear] = useState('2025-26');
  const [copyDestinationYear, setCopyDestinationYear] = useState('2026-27');
  const [toast, setToast] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const seriesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ series, documents, globalSettings, logs, selectedYear })); }
    catch { /* local edits continue in memory if storage is blocked */ }
  }, [series, documents, globalSettings, logs, selectedYear]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const currentSeries = series.filter((item) => item.year === selectedYear);
  const currentDocs = documents.filter((item) => item.year === selectedYear);
  const moduleOptions = Array.from(new Set([...MODULES, ...series.map((item) => item.module), ...documents.map((item) => item.module)])).sort();
  const allSubModuleOptions = Array.from(new Set([...series.map((item) => item.subModule), ...documents.map((item) => item.subModule)])).sort();
  const subModulesForYear = Array.from(new Set(currentSeries.map((item) => item.subModule))).sort();
  const filteredSeries = useMemo(() => currentSeries.filter((item) => {
    const haystack = `${item.code} ${item.name} ${item.module} ${item.subModule} ${item.pattern}`.toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) && (moduleFilter === 'All Modules' || item.module === moduleFilter) && (subModuleFilter === 'All Sub-Modules' || item.subModule === subModuleFilter) && (statusFilter === 'All Status' || item.status === statusFilter) && (resetFilter === 'All Reset Types' || item.resetType === resetFilter);
  }), [currentSeries, search, moduleFilter, subModuleFilter, statusFilter, resetFilter]);
  const filteredDocs = useMemo(() => currentDocs.filter((item) => (!documentSearch || `${item.code} ${item.name} ${item.module} ${item.subModule} ${item.pattern}`.toLowerCase().includes(documentSearch.toLowerCase())) && (documentModuleFilter === 'All Modules' || item.module === documentModuleFilter) && (documentStatusFilter === 'All Status' || (documentStatusFilter === 'Active' ? item.active : !item.active))), [currentDocs, documentSearch, documentModuleFilter, documentStatusFilter]);
  const filteredLogs = useMemo(() => logs.filter((item) => {
    if (item.year !== selectedYear) return false;
    if (usageModule !== 'All Modules' && item.module !== usageModule) return false;
    if (usageSeries !== 'All Series' && item.seriesCode !== usageSeries) return false;
    if (usageUser !== 'All Users' && item.performedBy !== usageUser) return false;
    if (showGapsOnly && item.action !== 'Gap Detected') return false;
    if (usageSearch && !`${item.seriesCode} ${item.seriesName} ${item.formattedNumber} ${item.performedBy} ${item.notes}`.toLowerCase().includes(usageSearch.toLowerCase())) return false;
    const time = new Date(item.at).getTime();
    if (usageFrom && time < new Date(`${usageFrom}T00:00:00`).getTime()) return false;
    if (usageTo && time > new Date(`${usageTo}T23:59:59.999`).getTime()) return false;
    return true;
  }), [logs, selectedYear, usageModule, usageSeries, usageUser, showGapsOnly, usageSearch, usageFrom, usageTo]);
  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const visibleLogs = filteredLogs.slice((usagePage - 1) * pageSize, usagePage * pageSize);

  const addLog = (item: NumberSeries, action: LogAction, sequence: number, formattedNumber: string, notes: string) => {
    const log: UsageLog = { id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, year: item.year, at: new Date().toISOString(), seriesCode: item.code, seriesName: item.name, module: item.module, subModule: item.subModule, sequence, formattedNumber, action, performedBy: 'Super Admin', notes };
    setLogs((previous) => [log, ...previous]);
  };
  const markSeriesPattern = (next: PatternConfig) => { setSeriesPattern(next); setSeriesDraft((previous) => previous ? { ...previous, pattern: buildPattern(next), digitLength: next.sequenceDigits } : previous); };
  const markDocumentPattern = (next: PatternConfig) => {
    setDocumentPattern(next);
    setDocumentDraft((previous) => previous ? { ...previous, pattern: buildPattern(next), includeYear: next.yearToken !== 'None', includeBranch: next.includeBranch, includeDate: next.includeDate || next.includeMonth, includeStudentId: next.includeStudentId, includeClass: next.includeClass } : previous);
  };
  const openSeriesCreate = () => {
    const draft: NumberSeries = { id: `new-${Date.now()}`, year: selectedYear, code: '', name: '', module: 'Admissions', subModule: 'Admissions', description: '', pattern: '', digitLength: 5, startNumber: 1, increment: 1, currentNumber: 0, resetType: 'Academic Year', lastReset: 'Not reset', nextReset: 'Next academic-year rollover', status: 'Active', lockedForFY: false, lockCodeAfterUse: true, allowManualEntry: false, allowGaps: true, alertEmail: true };
    const config = defaultPatternConfig('ADM'); config.yearToken = 'AY'; config.separator = globalSettings.separator;
    setSeriesDraft(draft); setSeriesPattern(config); setSeriesModalMode('create');
  };
  const openSeriesEdit = (item: NumberSeries) => { setSeriesDraft({ ...item }); setSeriesPattern(parsePatternConfig(item.pattern, item.digitLength)); setSeriesModalMode('edit'); };
  const saveSeries = () => {
    if (!seriesDraft) return;
    const code = seriesDraft.code.trim().toUpperCase(); const name = seriesDraft.name.trim(); const pattern = buildPattern(seriesPattern);
    if (!code || !name || !seriesDraft.module || !seriesDraft.subModule.trim()) { notify('Enter a unique series code, name, module, and sub-module.'); return; }
    if (series.some((item) => item.year === seriesDraft.year && item.code.toUpperCase() === code && item.id !== seriesDraft.id)) { notify(`Series code ${code} already exists for ${seriesDraft.year}.`); return; }
    if (seriesModalMode === 'edit' && seriesDraft.lockCodeAfterUse && seriesDraft.currentNumber > 0) {
      const original = series.find((item) => item.id === seriesDraft.id);
      if (original && original.code !== code) { notify('Series code is locked after first use.'); return; }
    }
    const saved: NumberSeries = { ...seriesDraft, code, name, pattern, digitLength: seriesPattern.sequenceDigits, description: seriesDraft.description.trim() };
    setSeries((previous) => seriesModalMode === 'edit' ? previous.map((item) => item.id === saved.id ? saved : item) : [{ ...saved, id: `${saved.year}:${saved.code}` }, ...previous]);
    addLog(saved, 'Configuration Updated', saved.currentNumber, renderPattern(pattern, saved.digitLength, Math.max(saved.startNumber, saved.currentNumber + saved.increment), saved.year, globalSettings), `${seriesModalMode === 'edit' ? 'Updated' : 'Created'} series configuration.`);
    setSeriesModalMode(null); setSeriesDraft(null); notify(`${saved.name} ${seriesModalMode === 'edit' ? 'updated' : 'created'}.`);
  };
  const openDocumentCreate = () => {
    const draft: DocumentTemplate = { id: `new-doc-${Date.now()}`, year: selectedYear, code: '', name: '', module: 'Admissions', subModule: 'Admissions', pattern: '', referenceLabel: 'Document No.', active: true, includeYear: true, includeBranch: true, includeDate: false, includeStudentId: false, includeClass: false, duplicateCheck: true, signatureRequired: false, allowReprint: true, securePrint: false, watermark: 'Original' };
    const config = defaultPatternConfig('DOC'); config.yearToken = 'AY'; config.includeBranch = true; config.separator = globalSettings.separator;
    setDocumentDraft(draft); setDocumentPattern(config); setDocumentModalMode('create');
  };
  const openDocumentEdit = (item: DocumentTemplate) => { setDocumentDraft({ ...item }); setDocumentPattern(parsePatternConfig(item.pattern, 5)); setDocumentModalMode('edit'); };
  const saveDocument = () => {
    if (!documentDraft) return;
    const code = documentDraft.code.trim().toUpperCase(); const name = documentDraft.name.trim(); const pattern = buildPattern(documentPattern);
    if (!code || !name || !documentDraft.module || !documentDraft.subModule.trim()) { notify('Enter document code, name, module, and sub-module.'); return; }
    if (documents.some((item) => item.year === documentDraft.year && item.code.toUpperCase() === code && item.id !== documentDraft.id)) { notify(`Document ID template ${code} already exists for ${documentDraft.year}.`); return; }
    const saved: DocumentTemplate = { ...documentDraft, code, name, pattern, includeYear: documentPattern.yearToken !== 'None', includeBranch: documentPattern.includeBranch, includeDate: documentPattern.includeDate || documentPattern.includeMonth, includeStudentId: documentPattern.includeStudentId, includeClass: documentPattern.includeClass };
    setDocuments((previous) => documentModalMode === 'edit' ? previous.map((item) => item.id === saved.id ? saved : item) : [{ ...saved, id: `${saved.year}:${saved.code}` }, ...previous]);
    const logSeries = currentSeries.find((item) => item.module === saved.module && item.subModule === saved.subModule) || currentSeries[0];
    if (logSeries) addLog(logSeries, 'Template Updated', 0, renderPattern(pattern, documentPattern.sequenceDigits, 1, saved.year, globalSettings), `${documentModalMode === 'edit' ? 'Updated' : 'Created'} document template ${saved.code}.`);
    setDocumentModalMode(null); setDocumentDraft(null); notify(`${saved.name} ${documentModalMode === 'edit' ? 'updated' : 'created'}.`);
  };
  const generateNext = (item: NumberSeries) => {
    if (item.status !== 'Active') { notify(`${item.code} is inactive and cannot generate a number.`); return; }
    if (item.lockedForFY && globalSettings.lockAtYearEnd && item.year !== selectedYear) { notify(`${item.code} is locked for the selected year.`); return; }
    const next = Math.max(item.startNumber, item.currentNumber + item.increment);
    const formatted = renderPattern(item.pattern, item.digitLength, next, item.year, globalSettings);
    setSeries((previous) => previous.map((current) => current.id === item.id ? { ...current, currentNumber: next } : current));
    addLog(item, 'Generated', next, formatted, 'Generated from the Number Series tab preview.');
    setTestOutput(`${item.name}: ${formatted}`); notify(`Generated ${formatted}.`);
  };
  const requestReset = (item: NumberSeries) => { setResetTarget(item); setResetTargetValue(item.startNumber); setResetReason(''); setApprovalReference(''); };
  const confirmReset = () => {
    if (!resetTarget) return;
    if (!resetReason.trim()) { notify('Enter a reset reason.'); return; }
    if (globalSettings.requireApprovalForReset && !approvalReference.trim()) { notify('Enter the approval/change reference for this reset.'); return; }
    const value = Math.max(0, resetTargetValue);
    setSeries((previous) => previous.map((item) => item.id === resetTarget.id ? { ...item, currentNumber: value, lastReset: new Date().toLocaleDateString('en-IN'), nextReset: resetTarget.resetType === 'Never' ? 'No scheduled reset' : 'Next scheduled rollover' } : item));
    addLog(resetTarget, 'Reset', value, renderPattern(resetTarget.pattern, resetTarget.digitLength, value, resetTarget.year, globalSettings), `${resetReason.trim()}${approvalReference.trim() ? ` · Approval: ${approvalReference.trim()}` : ''}`);
    setResetTarget(null); notify(`${resetTarget.code} reset to ${value}.`);
  };
  const confirmResetAll = () => {
    if (!resetReason.trim()) { notify('Enter a reason for this bulk reset.'); return; }
    if (globalSettings.requireApprovalForReset && !approvalReference.trim()) { notify('Enter the approval/change reference for this reset.'); return; }
    const active = currentSeries.filter((item) => item.status === 'Active');
    setSeries((previous) => previous.map((item) => item.year === selectedYear && item.status === 'Active' ? { ...item, currentNumber: item.startNumber - item.increment, lastReset: new Date().toLocaleDateString('en-IN') } : item));
    active.forEach((item) => addLog(item, 'Reset', item.startNumber - item.increment, renderPattern(item.pattern, item.digitLength, item.startNumber, item.year, globalSettings), `Bulk reset: ${resetReason.trim()} · ${approvalReference.trim()}`));
    setResetAllOpen(false); setResetReason(''); setApprovalReference(''); notify(`${active.length} active series reset for ${selectedYear}.`);
  };
  const changeYear = (year: string) => { setSelectedYear(year); setUsagePage(1); setCopySourceYear(previousYear(year)); setCopyDestinationYear(year); };
  const openCopy = () => { setCopySourceYear(selectedYear); setCopyDestinationYear(nextYear(selectedYear)); setCopyOpen(true); };
  const copyYear = () => {
    const sourceSeries = series.filter((item) => item.year === copySourceYear);
    if (!sourceSeries.length) { notify(`No series exist for ${copySourceYear}.`); return; }
    const knownCodes = new Set(series.filter((item) => item.year === copyDestinationYear).map((item) => item.code));
    const clonedSeries = sourceSeries.filter((item) => !knownCodes.has(item.code)).map((item) => ({ ...item, id: `${copyDestinationYear}:${item.code}`, year: copyDestinationYear, currentNumber: item.startNumber - item.increment, lastReset: 'Copied — not reset', nextReset: item.resetType === 'Never' ? 'No scheduled reset' : `Next ${item.resetType.toLowerCase()} rollover` }));
    const sourceDocs = documents.filter((item) => item.year === copySourceYear);
    const knownDocCodes = new Set(documents.filter((item) => item.year === copyDestinationYear).map((item) => item.code));
    const clonedDocs = sourceDocs.filter((item) => !knownDocCodes.has(item.code)).map((item) => ({ ...item, id: `${copyDestinationYear}:${item.code}`, year: copyDestinationYear }));
    setSeries((previous) => [...clonedSeries, ...previous]); setDocuments((previous) => [...clonedDocs, ...previous]);
    setSelectedYear(copyDestinationYear); setCopyOpen(false); notify(`Copied ${clonedSeries.length} series and ${clonedDocs.length} document templates to ${copyDestinationYear}.`);
  };
  const saveAllSettings = () => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ series, documents, globalSettings, logs, selectedYear })); } catch { /* local data remains active */ } setSavedMessage('Saved in this browser.'); window.setTimeout(() => setSavedMessage(''), 2800); };
  const exportSeries = () => downloadCsv(`number-series-${selectedYear}.csv`, ['Year','Code','Name','Module','Sub-Module','Description','Pattern','Digits','Start','Increment','Current Number','Reset Rule','Status','Year Lock'], currentSeries.map((item) => [item.year,item.code,item.name,item.module,item.subModule,item.description,item.pattern,item.digitLength,item.startNumber,item.increment,item.currentNumber,item.resetType,item.status,item.lockedForFY?'Locked':'Unlocked']));
  const exportDocuments = () => downloadCsv(`document-id-settings-${selectedYear}.csv`, ['Year','Code','Name','Module','Sub-Module','Pattern','Reference Label','Status','Include Year','Include Branch','Include Date','Include Student ID','Include Class','Duplicate Check','Signature','Reprint','Secure Print','Watermark'], currentDocs.map((item) => [item.year,item.code,item.name,item.module,item.subModule,item.pattern,item.referenceLabel,item.active?'Active':'Inactive',item.includeYear?'Yes':'No',item.includeBranch?'Yes':'No',item.includeDate?'Yes':'No',item.includeStudentId?'Yes':'No',item.includeClass?'Yes':'No',item.duplicateCheck?'Yes':'No',item.signatureRequired?'Yes':'No',item.allowReprint?'Yes':'No',item.securePrint?'Yes':'No',item.watermark]));
  const exportUsage = () => downloadCsv(`number-series-usage-${selectedYear}.csv`, ['Date','Series Code','Series Name','Module','Sub-Module','Number','Action','User','Notes'], filteredLogs.map((item) => [item.at,item.seriesCode,item.seriesName,item.module,item.subModule,item.formattedNumber,item.action,item.performedBy,item.notes]));
  const exportJson = () => { const payload = { year: selectedYear, series: currentSeries, documents: currentDocs, settings: globalSettings }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `number-series-${selectedYear}.json`; anchor.click(); URL.revokeObjectURL(url); };
  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      let rows: Array<Record<string, any>> = [];
      if (file.name.toLowerCase().endsWith('.json')) { const parsed = JSON.parse(await file.text()); rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.series) ? parsed.series : []; }
      else { const rawRows = file.name.toLowerCase().endsWith('.xlsx') ? await readXlsxRows(file) : (await file.text()).split(/\r?\n/).filter(Boolean).map(parseCsvLine); if (rawRows.length < 2) throw new Error('Add a header row and at least one data row.'); const headers = rawRows[0].map((value) => value.toLowerCase().replace(/[\s_-]/g, '')); rows = rawRows.slice(1).filter((cells) => cells.some((cell) => cell.trim())).map((cells) => Object.fromEntries(headers.map((header,index) => [header,cells[index] || '']))); }
      const mapped = rows.map((row) => {
        const get = (key: string, fallback = '') => row[key] ?? row[key.toLowerCase()] ?? row[key.replace(/[\s_-]/g,'').toLowerCase()] ?? fallback;
        const code = String(get('code') || get('seriesCode')).trim().toUpperCase(); const name = String(get('name') || get('seriesName')).trim();
        const config: PatternConfig = { ...parsePatternConfig(String(get('pattern') || `${code}/{AY}/{SEQ}`), Number(get('digits', '5')) || 5), prefix: code || 'IMP' };
        if (!code || !name) return null;
        const reset = String(get('resetType','Academic Year')) as ResetType;
        return { id:`${selectedYear}:${code}`, year:selectedYear, code, name, module:String(get('module','Operations')), subModule:String(get('subModule','Imported')), description:String(get('description',`Imported ${name} series.`)), pattern:buildPattern(config), digitLength:config.sequenceDigits, startNumber:Number(get('startNumber','1')) || 1, increment:Math.max(1,Number(get('increment','1')) || 1), currentNumber:Number(get('currentNumber','0')) || 0, resetType:RESET_OPTIONS.includes(reset)?reset:'Academic Year', lastReset:String(get('lastReset','Imported')), nextReset:String(get('nextReset','Not scheduled')), status:String(get('status','Active')).toLowerCase()==='inactive'?'Inactive' as const:'Active' as const, lockedForFY:String(get('lockedForFY','false')).toLowerCase()==='true', lockCodeAfterUse:true, allowManualEntry:false, allowGaps:true, alertEmail:true } as NumberSeries;
      }).filter((item): item is NumberSeries => !!item);
      if (!mapped.length) throw new Error('No valid rows; include code and name columns.');
      const existing = new Set(currentSeries.map((item) => item.code)); const additions = mapped.filter((item) => !existing.has(item.code));
      if (!additions.length) throw new Error('No new series were imported (all codes already exist for this year).');
      setSeries((previous) => [...additions, ...previous]); notify(`${additions.length} series imported.`);
    } catch (error) { notify(error instanceof Error ? error.message : 'Import failed.'); }
    event.target.value = '';
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4"><div><div className="flex items-center gap-2 text-xs text-gray-500"><span>Home</span><ChevronRight className="h-3 w-3"/><span>Admin Tools</span><ChevronRight className="h-3 w-3"/><span>Utilities</span></div><h1 className="mt-1 text-2xl font-bold text-gray-900">Number Series &amp; Document ID Settings</h1><p className="text-sm text-gray-500">Build readable numbering formats and document identifiers by module and sub-module.</p></div><div className="flex flex-wrap items-center gap-2"><select aria-label="Academic year" value={selectedYear} onChange={(e) => changeYear(e.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs">{Array.from(new Set([...YEARS,...series.map((item)=>item.year),...documents.map((item)=>item.year)])).map((year)=><option key={year}>{year}</option>)}</select><Button variant="outline" size="sm" onClick={() => seriesInputRef.current?.click()}><Upload className="mr-1.5 h-3.5 w-3.5"/>Import</Button><input ref={seriesInputRef} type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={importFile}/><Button variant="outline" size="sm" onClick={exportJson}><Download className="mr-1.5 h-3.5 w-3.5"/>Export JSON</Button><Button onClick={saveAllSettings}><Save className="mr-1.5 h-3.5 w-3.5"/>Save Settings</Button></div></div>
      {savedMessage && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{savedMessage}</div>}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">{(['Number Series','Document ID Settings','Usage Log'] as PageTab[]).map((tab) => <button key={tab} onClick={() => { setActiveTab(tab); setUsagePage(1); }} className={`border-b-2 px-4 py-3 text-xs font-semibold ${activeTab===tab?'border-indigo-600 text-indigo-700':'border-transparent text-gray-500'}`}>{tab==='Number Series'?<Hash className="mr-2 inline h-4 w-4"/>:tab==='Document ID Settings'?<FileText className="mr-2 inline h-4 w-4"/>:<History className="mr-2 inline h-4 w-4"/>}{tab}</button>)}</div>
      {activeTab==='Number Series' && <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Number Series</h2><p className="text-xs text-gray-500">Numbering rules for {selectedYear}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={openCopy}><Copy className="mr-1.5 h-3.5 w-3.5"/>Copy to Next Year</Button><Button variant="outline" size="sm" onClick={()=>setResetAllOpen(true)}><RotateCcw className="mr-1.5 h-3.5 w-3.5"/>Reset Active Counters</Button><Button variant="outline" size="sm" onClick={exportSeries}><Download className="mr-1.5 h-3.5 w-3.5"/>Export CSV</Button><Button onClick={openSeriesCreate}><Plus className="mr-1.5 h-4 w-4"/>Create Number Series</Button></div></div><div className="rounded-xl border border-gray-200 bg-white"><div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 md:grid-cols-5"><label className="text-[10px] font-semibold text-gray-500">SEARCH<input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Name, code, module..." className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal text-gray-800"/></label><label className="text-[10px] font-semibold text-gray-500">MODULE<select value={moduleFilter} onChange={(e)=>setModuleFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Modules</option>{moduleOptions.map((module)=><option key={module}>{module}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">SUB-MODULE<select value={subModuleFilter} onChange={(e)=>setSubModuleFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Sub-Modules</option>{subModulesForYear.map((item)=><option key={item}>{item}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">STATUS<select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Status</option><option>Active</option><option>Inactive</option></select></label><label className="text-[10px] font-semibold text-gray-500">RESET RULE<select value={resetFilter} onChange={(e)=>setResetFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Reset Types</option>{RESET_OPTIONS.map((item)=><option key={item}>{item}</option>)}</select></label></div><div className="overflow-x-auto"><table className="w-full min-w-[1280px] text-left text-xs"><thead><tr className="border-y border-gray-100 bg-gray-50"><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Series</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Module / Sub-Module</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Format Preview</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Current / Next</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Reset Rule</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Status / Lock</th><th className="p-3 text-right text-[10px] font-semibold uppercase text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredSeries.map((item)=><tr key={item.id} className="hover:bg-indigo-50/30"><td className="p-3"><button className="text-left" onClick={()=>setDetailSeries(item)}><span className="block font-semibold text-gray-900">{item.name}</span><span className="font-mono text-[10px] text-indigo-700">{item.code}</span></button></td><td className="p-3 text-gray-700">{item.module}<span className="mt-1 block text-[10px] text-gray-500">{item.subModule}</span></td><td className="p-3"><code className="rounded bg-gray-50 px-2 py-1 font-mono text-gray-700">{renderPattern(item.pattern,item.digitLength,Math.max(item.startNumber,item.currentNumber+item.increment),item.year,globalSettings)}</code></td><td className="p-3"><span className="font-mono font-bold">#{item.currentNumber.toLocaleString('en-IN')}</span><span className="mt-1 block text-[10px] text-gray-500">Next: {Math.max(item.startNumber,item.currentNumber+item.increment).toLocaleString('en-IN')}</span></td><td className="p-3 text-gray-700">{resetLabel(item.resetType)}<span className="mt-1 block text-[10px] text-gray-400">Next: {item.nextReset}</span></td><td className="p-3"><Badge variant={item.status==='Active'?'success':'default'}>{item.status}</Badge>{item.lockedForFY&&<span className="ml-1 rounded-full bg-violet-50 px-2 py-1 text-[10px] text-violet-700"><Lock className="mr-1 inline h-3 w-3"/>Year locked</span>}</td><td className="p-3"><div className="flex justify-end gap-1"><Button variant="ghost" size="xs" title="Preview" onClick={()=>setTestOutput(`${item.name}: ${renderPattern(item.pattern,item.digitLength,Math.max(item.startNumber,item.currentNumber+item.increment),item.year,globalSettings)}`)}><Activity className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Generate next number" onClick={()=>generateNext(item)}><ListRestart className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Reset counter" onClick={()=>requestReset(item)}><RotateCcw className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Edit series" onClick={()=>openSeriesEdit(item)}><Settings2 className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Delete series" onClick={()=>{ if(window.confirm(`Delete ${item.name}?`)) setSeries((prev)=>prev.filter((row)=>row.id!==item.id)); }}><Trash2 className="h-4 w-4"/></Button></div></td></tr>)}{filteredSeries.length===0&&<tr><td colSpan={7} className="p-10 text-center text-gray-500">No series match these filters.</td></tr>}</tbody></table></div></div>{testOutput&&<div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900"><span><Activity className="mr-2 inline h-4 w-4"/>{testOutput}</span><button onClick={()=>setTestOutput(null)}><X className="h-4 w-4"/></button></div>}</section>}
      {activeTab==='Document ID Settings'&&<section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Document ID Settings</h2><p className="text-xs text-gray-500">Create and manage document identifiers for {selectedYear}.</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={exportDocuments}><Download className="mr-1.5 h-3.5 w-3.5"/>Export CSV</Button><Button onClick={openDocumentCreate}><Plus className="mr-1.5 h-4 w-4"/>Create Document ID</Button></div></div><div className="rounded-xl border border-gray-200 bg-white"><div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 md:grid-cols-3"><label className="text-[10px] font-semibold text-gray-500">SEARCH<input value={documentSearch} onChange={(e)=>setDocumentSearch(e.target.value)} placeholder="Document name, code or module" className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"/></label><label className="text-[10px] font-semibold text-gray-500">MODULE<select value={documentModuleFilter} onChange={(e)=>setDocumentModuleFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Modules</option>{moduleOptions.map((module)=><option key={module}>{module}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">STATUS<select value={documentStatusFilter} onChange={(e)=>setDocumentStatusFilter(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs font-normal"><option>All Status</option><option>Active</option><option>Inactive</option></select></label></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-xs"><thead><tr className="border-y border-gray-100 bg-gray-50"><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Template</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Module / Sub-Module</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Generated ID Example</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Document Options</th><th className="p-3 text-[10px] font-semibold uppercase text-gray-500">Status</th><th className="p-3 text-right text-[10px] font-semibold uppercase text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredDocs.map((item)=><tr key={item.id} className="hover:bg-indigo-50/30"><td className="p-3"><button className="text-left" onClick={()=>setDetailDocument(item)}><span className="block font-semibold">{item.name}</span><span className="font-mono text-[10px] text-indigo-700">{item.code} · {item.referenceLabel}</span></button></td><td className="p-3">{item.module}<span className="mt-1 block text-[10px] text-gray-500">{item.subModule}</span></td><td className="p-3"><code className="font-mono text-indigo-800">{renderPattern(item.pattern,5,42,item.year,globalSettings)}</code><span className="mt-1 block text-[10px] text-gray-500">{item.pattern}</span></td><td className="p-3 text-gray-600">{[item.includeYear&&'Year',item.includeBranch&&'Branch',item.includeDate&&'Date',item.includeStudentId&&'Student ID',item.includeClass&&'Class'].filter(Boolean).join(' · ')||'No optional tokens'}</td><td className="p-3"><Badge variant={item.active?'success':'default'}>{item.active?'Active':'Inactive'}</Badge></td><td className="p-3 text-right"><Button variant="ghost" size="xs" title="Preview" onClick={()=>setTestOutput(`${item.name}: ${renderPattern(item.pattern,5,42,item.year,globalSettings)}`)}><Eye className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Edit" onClick={()=>openDocumentEdit(item)}><Settings2 className="h-4 w-4"/></Button><Button variant="ghost" size="xs" title="Delete" onClick={()=>{if(window.confirm(`Delete ${item.name}?`))setDocuments((prev)=>prev.filter((row)=>row.id!==item.id));}}><Trash2 className="h-4 w-4"/></Button></td></tr>)}{filteredDocs.length===0&&<tr><td colSpan={6} className="p-10 text-center text-gray-500">No document IDs match these filters.</td></tr>}</tbody></table></div></div></section>}
      {activeTab==='Usage Log'&&<section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-gray-900">Number Usage Log</h2><p className="text-xs text-gray-500">Audit generated IDs, resets, configuration changes, and sequence checks.</p></div><Button variant="outline" size="sm" onClick={exportUsage}><Download className="mr-1.5 h-3.5 w-3.5"/>Export Log CSV</Button></div><div className="rounded-xl border border-gray-200 bg-white"><div className="grid grid-cols-1 gap-3 border-b p-4 md:grid-cols-4"><label className="text-[10px] font-semibold text-gray-500">SEARCH<input value={usageSearch} onChange={(e)=>{setUsageSearch(e.target.value);setUsagePage(1);}} className="mt-1 w-full rounded-md border p-2 text-xs font-normal" placeholder="Number, code, user"/></label><label className="text-[10px] font-semibold text-gray-500">MODULE<select value={usageModule} onChange={(e)=>setUsageModule(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>All Modules</option>{moduleOptions.map((module)=><option key={module}>{module}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">SERIES<select value={usageSeries} onChange={(e)=>setUsageSeries(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>All Series</option>{currentSeries.map((item)=><option key={item.code}>{item.code}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">USER<select value={usageUser} onChange={(e)=>setUsageUser(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>All Users</option>{Array.from(new Set(logs.map((item)=>item.performedBy))).map((person)=><option key={person}>{person}</option>)}</select></label><label className="text-[10px] font-semibold text-gray-500">FROM<input type="date" value={usageFrom} onChange={(e)=>setUsageFrom(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"/></label><label className="text-[10px] font-semibold text-gray-500">TO<input type="date" value={usageTo} onChange={(e)=>setUsageTo(e.target.value)} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"/></label><label className="flex items-end gap-2 text-xs text-gray-600"><input type="checkbox" checked={showGapsOnly} onChange={(e)=>setShowGapsOnly(e.target.checked)}/>Sequence gaps only</label><label className="text-[10px] font-semibold text-gray-500">ROWS PER PAGE<select value={pageSize} onChange={(e)=>{setPageSize(Number(e.target.value));setUsagePage(1);}} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></label></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-xs"><thead><tr className="bg-gray-50"><th className="p-3 text-[10px] uppercase text-gray-500">When</th><th className="p-3 text-[10px] uppercase text-gray-500">Series / Module</th><th className="p-3 text-[10px] uppercase text-gray-500">Generated ID</th><th className="p-3 text-[10px] uppercase text-gray-500">Action / User</th><th className="p-3 text-[10px] uppercase text-gray-500">Notes</th><th className="p-3 text-right text-[10px] uppercase text-gray-500">Detail</th></tr></thead><tbody className="divide-y">{visibleLogs.map((item)=><tr key={item.id} className="hover:bg-gray-50"><td className="p-3 text-gray-600">{new Date(item.at).toLocaleString('en-IN')}</td><td className="p-3"><strong>{item.seriesCode}</strong><span className="block text-[10px] text-gray-500">{item.module} · {item.subModule}</span></td><td className="p-3 font-mono text-indigo-700">{item.formattedNumber}</td><td className="p-3">{item.action}<span className="block text-[10px] text-gray-500">{item.performedBy}</span></td><td className="p-3 text-gray-600">{item.notes}</td><td className="p-3 text-right"><Button variant="ghost" size="xs" onClick={()=>setLogDetail(item)}><Eye className="h-4 w-4"/></Button></td></tr>)}{visibleLogs.length===0&&<tr><td colSpan={6} className="p-10 text-center text-gray-500">No log entries match the filters.</td></tr>}</tbody></table></div><div className="flex items-center justify-between border-t p-3 text-xs text-gray-600"><span>Page {usagePage} of {pageCount} · {filteredLogs.length} entries</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={usagePage<=1} onClick={()=>setUsagePage((page)=>Math.max(1,page-1))}><ChevronLeft className="h-3.5 w-3.5"/>Previous</Button><Button variant="outline" size="sm" disabled={usagePage>=pageCount} onClick={()=>setUsagePage((page)=>Math.min(pageCount,page+1))}>Next<ChevronRight className="h-3.5 w-3.5"/></Button></div></div></div></section>}
      <section className="rounded-xl border border-gray-200 bg-white"><div className="flex items-center justify-between gap-3 border-b p-4"><div><h2 className="flex items-center gap-2 text-sm font-bold"><Settings2 className="h-4 w-4 text-indigo-600"/>Global Numbering Settings</h2><p className="text-[11px] text-gray-500">Defaults shared by all series and document formats.</p></div><Button variant="outline" size="sm" onClick={saveAllSettings}><Save className="mr-1.5 h-3.5 w-3.5"/>Save Global Settings</Button></div><div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3"><label className="text-[10px] font-semibold text-gray-500">SCHOOL CODE<input value={globalSettings.schoolCode} onChange={(e)=>setGlobalSettings((prev)=>({...prev,schoolCode:e.target.value.toUpperCase()}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"/></label><label className="text-[10px] font-semibold text-gray-500">DEFAULT SEPARATOR<select value={globalSettings.separator} onChange={(e)=>setGlobalSettings((prev)=>({...prev,separator:e.target.value}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>/</option><option>-</option><option>.</option><option>_</option></select></label><label className="text-[10px] font-semibold text-gray-500">YEAR FORMAT<select value={globalSettings.yearFormat} onChange={(e)=>setGlobalSettings((prev)=>({...prev,yearFormat:e.target.value as 'YY'|'YYYY'}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>YY</option><option>YYYY</option></select></label><label className="text-[10px] font-semibold text-gray-500">YEAR LABEL STYLE<select value={globalSettings.yearStyle} onChange={(e)=>setGlobalSettings((prev)=>({...prev,yearStyle:e.target.value as 'AY'|'FY'}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>AY</option><option>FY</option></select></label><label className="text-[10px] font-semibold text-gray-500">MONTH FORMAT<select value={globalSettings.monthFormat} onChange={(e)=>setGlobalSettings((prev)=>({...prev,monthFormat:e.target.value as 'MM'|'MMM'}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>MM</option><option>MMM</option></select></label><label className="text-[10px] font-semibold text-gray-500">UNIQUENESS SCOPE<select value={globalSettings.uniqueness} onChange={(e)=>setGlobalSettings((prev)=>({...prev,uniqueness:e.target.value as GlobalSettings['uniqueness']}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>School-wide</option><option>Branch-wise</option><option>Module-wise</option></select></label><label className="text-[10px] font-semibold text-gray-500">ROLLOVER POLICY<select value={globalSettings.rollover} onChange={(e)=>setGlobalSettings((prev)=>({...prev,rollover:e.target.value as GlobalSettings['rollover']}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"><option>Keep counting</option><option>Reset by rule</option><option>Require approval</option></select></label><label className="text-[10px] font-semibold text-gray-500">NOTIFICATION EMAIL<input value={globalSettings.notificationEmail} onChange={(e)=>setGlobalSettings((prev)=>({...prev,notificationEmail:e.target.value}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"/></label><label className="text-[10px] font-semibold text-gray-500">LOG RETENTION (MONTHS)<input type="number" min={1} value={globalSettings.logRetentionMonths} onChange={(e)=>setGlobalSettings((prev)=>({...prev,logRetentionMonths:Number(e.target.value)}))} className="mt-1 w-full rounded-md border p-2 text-xs font-normal"/></label></div><div className="grid grid-cols-1 gap-2 border-t p-4 md:grid-cols-3">{([['lockAtYearEnd','Lock series at year end'],['preventDuplicates','Prevent duplicate IDs'],['requireApprovalForReset','Require approval reference for counter reset'],['auditSequenceGaps','Log skipped sequence gaps'],['allowManualNumbers','Allow authorized manual number entry']] as Array<[keyof GlobalSettings,string]>).map(([key,label])=><label key={key} className="flex items-center gap-2 rounded-lg border p-3 text-xs text-gray-700"><input type="checkbox" checked={Boolean(globalSettings[key])} onChange={(e)=>setGlobalSettings((prev)=>({...prev,[key]:e.target.checked}))}/>{label}</label>)}</div></section>
      {seriesModalMode && seriesDraft && <Modal isOpen onClose={()=>{setSeriesModalMode(null);setSeriesDraft(null);}} title={seriesModalMode==='create'?'Create Number Series':'Edit Number Series'} size="xl"><div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1 text-xs"><div className="grid grid-cols-1 gap-3 md:grid-cols-3"><label className="text-gray-600">Series code<input value={seriesDraft.code} onChange={(e)=>setSeriesDraft((p)=>p?{...p,code:e.target.value.toUpperCase()}:p)} disabled={seriesModalMode==='edit'&&seriesDraft.lockCodeAfterUse&&seriesDraft.currentNumber>0} className="mt-1 w-full rounded-md border p-2 font-mono disabled:bg-gray-100"/></label><label className="text-gray-600">Series name<input value={seriesDraft.name} onChange={(e)=>setSeriesDraft((p)=>p?{...p,name:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Module · type to create<input list="number-series-modules" value={seriesDraft.module} onChange={(e)=>setSeriesDraft((p)=>p?{...p,module:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2" placeholder="e.g. Admissions"/><datalist id="number-series-modules">{moduleOptions.map((item)=><option key={item} value={item}/>)}</datalist></label><label className="text-gray-600">Sub-module · type to create<input list="number-series-submodules" value={seriesDraft.subModule} onChange={(e)=>setSeriesDraft((p)=>p?{...p,subModule:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2" placeholder="e.g. Fee Receipts"/><datalist id="number-series-submodules">{allSubModuleOptions.map((item)=><option key={item} value={item}/>)}</datalist></label><label className="text-gray-600 md:col-span-2">Description<input value={seriesDraft.description} onChange={(e)=>setSeriesDraft((p)=>p?{...p,description:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Year<input value={seriesDraft.year} onChange={(e)=>setSeriesDraft((p)=>p?{...p,year:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Starting number<input type="number" min={0} value={seriesDraft.startNumber} onChange={(e)=>setSeriesDraft((p)=>p?{...p,startNumber:Number(e.target.value)}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Current number<input type="number" min={0} value={seriesDraft.currentNumber} onChange={(e)=>setSeriesDraft((p)=>p?{...p,currentNumber:Number(e.target.value)}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Increment<input type="number" min={1} value={seriesDraft.increment} onChange={(e)=>setSeriesDraft((p)=>p?{...p,increment:Math.max(1,Number(e.target.value))}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Reset rule<select value={seriesDraft.resetType} onChange={(e)=>setSeriesDraft((p)=>p?{...p,resetType:e.target.value as ResetType}:p)} className="mt-1 w-full rounded-md border p-2">{RESET_OPTIONS.map((item)=><option key={item}>{item}</option>)}</select></label><label className="text-gray-600">Status<select value={seriesDraft.status} onChange={(e)=>setSeriesDraft((p)=>p?{...p,status:e.target.value as SeriesStatus}:p)} className="mt-1 w-full rounded-md border p-2"><option>Active</option><option>Inactive</option></select></label></div><PatternBuilder value={seriesPattern} onChange={markSeriesPattern} year={seriesDraft.year} settings={globalSettings} title="Number format builder"/><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{([['lockedForFY','Lock this series for selected year'],['allowManualEntry','Allow authorized manual number entry'],['allowGaps','Allow gaps after cancelled transactions'],['alertEmail','Send configuration alerts']] as Array<[keyof NumberSeries,string]>).map(([key,label])=><label key={key} className="flex items-center gap-2 rounded-lg border p-3 text-gray-700"><input type="checkbox" checked={Boolean(seriesDraft[key])} onChange={(e)=>setSeriesDraft((p)=>p?{...p,[key]:e.target.checked}:p)}/>{label}</label>)}</div><div className="flex justify-end gap-2 border-t pt-3"><Button variant="outline" onClick={()=>{setSeriesModalMode(null);setSeriesDraft(null);}}>Cancel</Button><Button onClick={saveSeries}><Save className="mr-1.5 h-4 w-4"/>Save Series</Button></div></div></Modal>}
      {documentModalMode && documentDraft && <Modal isOpen onClose={()=>{setDocumentModalMode(null);setDocumentDraft(null);}} title={documentModalMode==='create'?'Create Document ID Template':'Edit Document ID Template'} size="xl"><div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1 text-xs"><div className="grid grid-cols-1 gap-3 md:grid-cols-3"><label className="text-gray-600">Template code<input value={documentDraft.code} onChange={(e)=>setDocumentDraft((p)=>p?{...p,code:e.target.value.toUpperCase()}:p)} className="mt-1 w-full rounded-md border p-2 font-mono"/></label><label className="text-gray-600">Document name<input value={documentDraft.name} onChange={(e)=>setDocumentDraft((p)=>p?{...p,name:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Module · type to create<input list="document-id-modules" value={documentDraft.module} onChange={(e)=>setDocumentDraft((p)=>p?{...p,module:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2" placeholder="e.g. Admissions"/><datalist id="document-id-modules">{moduleOptions.map((item)=><option key={item} value={item}/>)}</datalist></label><label className="text-gray-600">Sub-module · type to create<input list="document-id-submodules" value={documentDraft.subModule} onChange={(e)=>setDocumentDraft((p)=>p?{...p,subModule:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2" placeholder="e.g. Certificates"/><datalist id="document-id-submodules">{allSubModuleOptions.map((item)=><option key={item} value={item}/>)}</datalist></label><label className="text-gray-600">Reference label<input value={documentDraft.referenceLabel} onChange={(e)=>setDocumentDraft((p)=>p?{...p,referenceLabel:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Year<input value={documentDraft.year} onChange={(e)=>setDocumentDraft((p)=>p?{...p,year:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label><label className="text-gray-600">Status<select value={documentDraft.active?'Active':'Inactive'} onChange={(e)=>setDocumentDraft((p)=>p?{...p,active:e.target.value==='Active'}:p)} className="mt-1 w-full rounded-md border p-2"><option>Active</option><option>Inactive</option></select></label><label className="text-gray-600">Watermark<input value={documentDraft.watermark} onChange={(e)=>setDocumentDraft((p)=>p?{...p,watermark:e.target.value}:p)} className="mt-1 w-full rounded-md border p-2"/></label></div><PatternBuilder value={documentPattern} onChange={markDocumentPattern} year={documentDraft.year} settings={globalSettings} title="Document ID format builder"/><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{([['duplicateCheck','Prevent duplicate document IDs'],['signatureRequired','Signature required'],['allowReprint','Allow reprint'],['securePrint','Secure print']] as Array<[keyof DocumentTemplate,string]>).map(([key,label])=><label key={key} className="flex items-center gap-2 rounded-lg border p-3 text-gray-700"><input type="checkbox" checked={Boolean(documentDraft[key])} onChange={(e)=>setDocumentDraft((p)=>p?{...p,[key]:e.target.checked}:p)}/>{label}</label>)}</div><div className="flex justify-end gap-2 border-t pt-3"><Button variant="outline" onClick={()=>{setDocumentModalMode(null);setDocumentDraft(null);}}>Cancel</Button><Button onClick={saveDocument}><Save className="mr-1.5 h-4 w-4"/>Save Template</Button></div></div></Modal>}
      <Modal isOpen={!!resetTarget} onClose={()=>setResetTarget(null)} title={resetTarget?`Reset ${resetTarget.code}`:'Reset Counter'} size="md">{resetTarget&&<div className="space-y-3 text-xs"><p className="text-gray-600">Set the current sequence value for <strong>{resetTarget.name}</strong>. This action is written to the usage log.</p><label className="block text-gray-600">New current number<input type="number" min={0} value={resetTargetValue} onChange={(e)=>setResetTargetValue(Number(e.target.value))} className="mt-1 w-full rounded-md border p-2"/></label><label className="block text-gray-600">Reason<input value={resetReason} onChange={(e)=>setResetReason(e.target.value)} className="mt-1 w-full rounded-md border p-2"/></label>{globalSettings.requireApprovalForReset&&<label className="block text-gray-600">Approval / change reference<input value={approvalReference} onChange={(e)=>setApprovalReference(e.target.value)} className="mt-1 w-full rounded-md border p-2"/></label>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setResetTarget(null)}>Cancel</Button><Button onClick={confirmReset}><RotateCcw className="mr-1.5 h-4 w-4"/>Confirm Reset</Button></div></div>}</Modal>
      <Modal isOpen={resetAllOpen} onClose={()=>setResetAllOpen(false)} title={`Reset Active Series — ${selectedYear}`} size="md"><div className="space-y-3 text-xs"><p className="text-gray-600">This resets {currentSeries.filter((item)=>item.status==='Active').length} active series to their configured starting values.</p><label className="block text-gray-600">Reason<input value={resetReason} onChange={(e)=>setResetReason(e.target.value)} className="mt-1 w-full rounded-md border p-2"/></label>{globalSettings.requireApprovalForReset&&<label className="block text-gray-600">Approval / change reference<input value={approvalReference} onChange={(e)=>setApprovalReference(e.target.value)} className="mt-1 w-full rounded-md border p-2"/></label>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setResetAllOpen(false)}>Cancel</Button><Button onClick={confirmResetAll}><RotateCcw className="mr-1.5 h-4 w-4"/>Reset Active Series</Button></div></div></Modal>
      <Modal isOpen={copyOpen} onClose={()=>setCopyOpen(false)} title="Copy Settings to Another Year" size="md"><div className="space-y-3 text-xs"><label className="block text-gray-600">Copy from<select value={copySourceYear} onChange={(e)=>setCopySourceYear(e.target.value)} className="mt-1 w-full rounded-md border p-2">{Array.from(new Set([...YEARS,...series.map((item)=>item.year)])).map((year)=><option key={year}>{year}</option>)}</select></label><label className="block text-gray-600">Copy to<input value={copyDestinationYear} onChange={(e)=>setCopyDestinationYear(e.target.value)} className="mt-1 w-full rounded-md border p-2"/></label><p className="rounded bg-amber-50 p-2 text-amber-800">Existing codes in the destination year are preserved.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setCopyOpen(false)}>Cancel</Button><Button onClick={copyYear}><Copy className="mr-1.5 h-4 w-4"/>Copy Series &amp; Templates</Button></div></div></Modal>
      <Modal isOpen={!!detailSeries} onClose={()=>setDetailSeries(null)} title={detailSeries?`Series Detail — ${detailSeries.code}`:''} size="lg">{detailSeries&&<div className="space-y-4 text-xs"><div className="rounded-lg bg-indigo-50 p-4"><p className="text-lg font-bold text-indigo-950">{detailSeries.name}</p><p className="mt-1 font-mono text-indigo-800">{detailSeries.code} · {detailSeries.module} / {detailSeries.subModule}</p><p className="mt-2 text-indigo-800">{detailSeries.description}</p></div><div className="grid grid-cols-2 gap-2 text-gray-700"><p>Generated format: <code>{detailSeries.pattern}</code></p><p>Example: <code>{renderPattern(detailSeries.pattern,detailSeries.digitLength,Math.max(detailSeries.startNumber,detailSeries.currentNumber+detailSeries.increment),detailSeries.year,globalSettings)}</code></p><p>Current / next: <strong>{detailSeries.currentNumber} / {Math.max(detailSeries.startNumber,detailSeries.currentNumber+detailSeries.increment)}</strong></p><p>Reset: <strong>{detailSeries.resetType}</strong></p><p>Last reset: <strong>{detailSeries.lastReset}</strong></p><p>Next reset: <strong>{detailSeries.nextReset}</strong></p><p>Status: <strong>{detailSeries.status}</strong></p><p>Year lock: <strong>{detailSeries.lockedForFY?'Locked':'Unlocked'}</strong></p></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>{setUsageSeries(detailSeries.code);setActiveTab('Usage Log');setDetailSeries(null);}}>View Usage Log</Button><Button onClick={()=>{openSeriesEdit(detailSeries);setDetailSeries(null);}}>Edit Series</Button></div></div>}</Modal>
      <Modal isOpen={!!detailDocument} onClose={()=>setDetailDocument(null)} title={detailDocument?`Document ID — ${detailDocument.code}`:''} size="lg">{detailDocument&&<div className="space-y-4 text-xs"><div className="rounded-lg bg-indigo-50 p-4"><p className="text-lg font-bold text-indigo-950">{detailDocument.name}</p><p className="mt-1 font-mono text-indigo-800">{detailDocument.code} · {detailDocument.module} / {detailDocument.subModule}</p></div><div className="grid grid-cols-2 gap-2 text-gray-700"><p>Identifier pattern: <code>{detailDocument.pattern}</code></p><p>Generated example: <code>{renderPattern(detailDocument.pattern,5,42,detailDocument.year,globalSettings)}</code></p><p>Reference label: <strong>{detailDocument.referenceLabel}</strong></p><p>Status: <strong>{detailDocument.active?'Active':'Inactive'}</strong></p><p>Duplicate check: <strong>{detailDocument.duplicateCheck?'On':'Off'}</strong></p><p>Watermark: <strong>{detailDocument.watermark}</strong></p></div><Button onClick={()=>{openDocumentEdit(detailDocument);setDetailDocument(null);}}>Edit Template</Button></div>}</Modal>
      <Modal isOpen={!!logDetail} onClose={()=>setLogDetail(null)} title="Usage Log Detail" size="md">{logDetail&&<div className="space-y-2 text-xs"><p><strong>{logDetail.formattedNumber}</strong> · {logDetail.action}</p><p>{logDetail.seriesName} ({logDetail.seriesCode})</p><p>{logDetail.module} / {logDetail.subModule} · {new Date(logDetail.at).toLocaleString('en-IN')}</p><p>Sequence: {logDetail.sequence} · User: {logDetail.performedBy}</p><p className="rounded bg-gray-50 p-3">{logDetail.notes}</p></div>}</Modal>
      {toast&&<div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-emerald-400"/>{toast}</div>}
    </div>
  );
}

export default NumberSeriesDocumentIdSettings;
