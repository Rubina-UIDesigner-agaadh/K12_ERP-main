import React, { useMemo, useRef, useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileCheck,
  XCircle,
  Play,
  X,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  Eye,
  Edit3,
  Clock,
  IndianRupee,
  FileText,
  AlertTriangle,
  Info,
  Filter,
  History,
  CheckSquare,
  ArrowUpDown,
  FileUp,
  Folder,
  Paperclip,
  Loader2,
  RotateCcw,
  Save,
  Archive,
  ExternalLink,
  Printer } from
'lucide-react';
import { getChargeHeads } from './ChargeMaster';
import {
  chargeReceiptHtml,
  downloadText,
  findChargePayer,
  formatDate,
  getPayerDue,
  inr,
  isChargeReferenceUsed,
  payerSubtitle,
  postChargePayments,
  printHtml,
  tableHtml,
  toCsv,
  todayIso } from
'./ChargeReceipt';
import type { ChargeReceiptRecord, PaymentMode } from './ChargeReceipt';

// ============================================
// Charge Receipt Import — reads a CSV / Excel (.xlsx) file in the browser, maps its columns,
// validates every row against the student / staff records and Charge Master, lets you fix rows,
// and posts the selected rows as charge receipts (they appear in Charge Receipt → Receipt History).
// Mock data only (no backend).
// ============================================

type ValidationStatus = 'valid' | 'error' | 'warning' | 'pending';
type ImportStatus = 'idle' | 'uploading' | 'validating' | 'mapping' | 'processing' | 'completed' | 'failed';
type FieldKey = 'payerCode' | 'name' | 'amount' | 'date' | 'paymentMode' | 'transactionId' | 'chargeHead' | 'remarks';

interface ImportRecord {
  id: number;
  rowNumber: number;
  payerCode: string;
  nameInFile: string;
  amountText: string;
  date: string;
  paymentMode: string;
  transactionId: string;
  chargeHead: string;
  remarks: string;
  payerId: string | null;
  payerName: string;
  payerDetails: string;
  amount: number;
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  isSelected: boolean;
  receiptNo?: string;
}

interface ImportHistoryItem {
  id: string;
  fileName: string;
  uploadDate: string;
  totalRecords: number;
  processedRecords: number;
  status: 'completed' | 'partial' | 'failed';
  uploadedBy: string;
  amount?: number;
  receipts?: {receiptNo: string;payerName: string;payerCode: string;amount: number;date: string;mode: string;}[];
}

interface ColumnMapping {
  key: FieldKey;
  sourceColumn: string;
  targetField: string;
  required: boolean;
  mapped: boolean;
}

// ---------------------------------------------------------------- file format
const MAX_RECORDS = 1000;
const MAX_SIZE_MB = 5;
const TEMPLATE_HEADERS = ['AdmNo', 'Name', 'Amount', 'Date', 'PaymentMode', 'TransactionID', 'ChargeHead', 'Remarks'];

const TARGET_FIELDS: {key: FieldKey;label: string;column: string;required: boolean;description: string;synonyms: string[];}[] = [
{
  key: 'payerCode', label: 'Admission / GR / Employee No', column: 'AdmNo', required: true,
  description: 'Student Admission No or GR No, or staff Employee Code',
  synonyms: ['admno', 'admissionno', 'admissionnumber', 'admission', 'grno', 'gr', 'grnumber', 'empcode', 'employeecode', 'employeeno', 'empno', 'staffcode', 'id', 'code', 'studentid', 'staffid', 'admnoempcode']
},
{
  key: 'name', label: 'Student / Staff Name', column: 'Name', required: false,
  description: 'Optional — cross-checked with the records',
  synonyms: ['name', 'studentname', 'staffname', 'payername', 'employeename', 'fullname']
},
{
  key: 'amount', label: 'Amount', column: 'Amount', required: true,
  description: 'Amount paid (positive number)',
  synonyms: ['amount', 'amt', 'paidamount', 'amountpaid', 'payment', 'paymentamount']
},
{
  key: 'date', label: 'Payment Date', column: 'Date', required: true,
  description: 'Payment date (YYYY-MM-DD), not in the future',
  synonyms: ['date', 'paymentdate', 'paiddate', 'receiptdate', 'transactiondate']
},
{
  key: 'paymentMode', label: 'Payment Mode', column: 'PaymentMode', required: true,
  description: 'Cash, Cheque, DD, Online, NEFT, RTGS, UPI or Card',
  synonyms: ['paymentmode', 'mode', 'paymode', 'paymentmethod', 'method']
},
{
  key: 'transactionId', label: 'Transaction ID', column: 'TransactionID', required: false,
  description: 'Reference / UTR / cheque no. for non-cash payments',
  synonyms: ['transactionid', 'transid', 'txnid', 'reference', 'referenceno', 'refno', 'ref', 'chequeno', 'utr']
},
{
  key: 'chargeHead', label: 'Charge Head', column: 'ChargeHead', required: false,
  description: 'Charge Master head name or code — paid against that charge first',
  synonyms: ['chargehead', 'charge', 'head', 'feehead', 'chargecode', 'chargename']
},
{
  key: 'remarks', label: 'Remarks', column: 'Remarks', required: false,
  description: 'Additional notes',
  synonyms: ['remarks', 'notes', 'note', 'narration', 'comment', 'comments']
}];

const EMPTY_MAPPING: Record<FieldKey, string> = {
  payerCode: '', name: '', amount: '', date: '', paymentMode: '', transactionId: '', chargeHead: '', remarks: ''
};
const MODES: PaymentMode[] = ['Cash', 'Cheque', 'DD', 'Online', 'NEFT', 'RTGS', 'UPI', 'Card'];

const normHeader = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');
function autoMap(headers: string[]): Record<FieldKey, string> {
  const m = { ...EMPTY_MAPPING };
  TARGET_FIELDS.forEach((f) => {
    const hit = headers.find((h) => f.synonyms.includes(normHeader(h)) && !Object.values(m).includes(h));
    if (hit) m[f.key] = hit;
  });
  return m;
}

// Minimal CSV parser (quoted values, commas and line breaks inside quotes). Keeps empty rows so row numbers match the file.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;else
      cell += ch;
    } else if (ch === '"') quoted = true;else
    if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const readFile = (file: File, as: 'text' | 'buffer') =>
new Promise<string | ArrayBuffer>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string | ArrayBuffer);
  reader.onerror = () => reject(new Error('The file could not be read.'));
  if (as === 'text') reader.readAsText(file);else
  reader.readAsArrayBuffer(file);
});

// ---- .xlsx reader (no library): unzip with the browser's DecompressionStream and read the first worksheet
async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  }).pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readXlsxRows(file: File): Promise<string[][]> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read .xlsx files. Please save the sheet as CSV and upload it again.');
  }
  const buf = new Uint8Array((await readFile(file, 'buffer')) as ArrayBuffer);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('This .xlsx file could not be read — it is not a valid Excel workbook.');
  const entries = new Map<string, {method: number;size: number;offset: number;}>();
  const decoder = new TextDecoder();
  let p = dv.getUint32(eocd + 16, true);
  for (let n = dv.getUint16(eocd + 10, true); n > 0 && dv.getUint32(p, true) === 0x02014b50; n--) {
    const nameLen = dv.getUint16(p + 28, true);
    entries.set(decoder.decode(buf.subarray(p + 46, p + 46 + nameLen)), {
      method: dv.getUint16(p + 10, true),
      size: dv.getUint32(p + 20, true),
      offset: dv.getUint32(p + 42, true)
    });
    p += 46 + nameLen + dv.getUint16(p + 30, true) + dv.getUint16(p + 32, true);
  }
  const read = async (name: string) => {
    const e = entries.get(name);
    if (!e) return '';
    const start = e.offset + 30 + dv.getUint16(e.offset + 26, true) + dv.getUint16(e.offset + 28, true);
    const data = buf.subarray(start, start + e.size);
    if (e.method !== 0 && e.method !== 8) throw new Error('Unsupported compression inside the .xlsx file.');
    return decoder.decode(e.method === 0 ? data : await inflateRaw(data));
  };
  const xml = (text: string) => new DOMParser().parseFromString(text, 'application/xml');
  const tags = (node: Document | Element, tag: string) => Array.from(node.getElementsByTagNameNS('*', tag));

  // first sheet in workbook order
  let sheetPath = '';
  const workbook = await read('xl/workbook.xml');
  const rels = await read('xl/_rels/workbook.xml.rels');
  if (workbook && rels) {
    const rid = tags(xml(workbook), 'sheet')[0]?.getAttribute('r:id');
    const target = tags(xml(rels), 'Relationship').find((r) => r.getAttribute('Id') === rid)?.getAttribute('Target') || '';
    if (target) sheetPath = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
  }
  if (!entries.has(sheetPath)) sheetPath = Array.from(entries.keys()).filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/.test(k)).sort()[0] || '';
  if (!sheetPath) throw new Error('No worksheet was found in this .xlsx file.');

  const sharedXml = await read('xl/sharedStrings.xml');
  const shared = sharedXml ?
  tags(xml(sharedXml), 'si').map((si) =>
  tags(si, 't').
  filter((t) => (t.parentNode as Element | null)?.localName !== 'rPh').
  map((t) => t.textContent || '').
  join('')
  ) :
  [];
  const colIndex = (letters: string) => letters.toUpperCase().split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  const rows: string[][] = [];
  tags(xml(await read(sheetPath)), 'row').forEach((rowEl, i) => {
    const rowNo = Number(rowEl.getAttribute('r')) || i + 1;
    const cells: string[] = [];
    tags(rowEl, 'c').forEach((c, idx) => {
      const ref = (c.getAttribute('r') || '').replace(/\d+/g, '');
      const t = c.getAttribute('t');
      const raw = tags(c, 'v')[0]?.textContent ?? '';
      cells[ref ? colIndex(ref) : idx] =
      t === 'inlineStr' ? tags(c, 't').map((x) => x.textContent || '').join('') :
      t === 's' ? shared[Number(raw)] ?? '' :
      t === 'b' ? raw === '1' ? 'TRUE' : 'FALSE' :
      raw;
    });
    rows[rowNo - 1] = Array.from(cells, (v) => v ?? '');
  });
  return Array.from(rows, (r) => r || []);
}

// ---------------------------------------------------------------- build + validate
const excelSerialToIso = (serial: number) => new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000).toISOString().slice(0, 10);
const isValidIsoDate = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
};
const parseAmount = (t: string) => {
  const c = t.replace(/[₹,\s]/g, '');
  return c === '' ? NaN : Number(c);
};
const normalizeMode = (m: string): PaymentMode | null => {
  const q = m.trim().toLowerCase();
  if (q === 'demand draft') return 'DD';
  if (q === 'debit card' || q === 'credit card') return 'Card';
  if (q === 'online / neft / rtgs' || q === 'netbanking' || q === 'net banking') return 'Online';
  return MODES.find((x) => x.toLowerCase() === q) || null;
};
const cleanRef = (t: string) => t.trim() === '-' ? '' : t.trim();

function buildRecords(rows: string[][], headers: string[], mapping: Record<FieldKey, string>): ImportRecord[] {
  const index = (k: FieldKey) => mapping[k] ? headers.indexOf(mapping[k]) : -1;
  const at = (row: string[], k: FieldKey) => {
    const i = index(k);
    return i >= 0 ? (row[i] ?? '').trim() : '';
  };
  const records: ImportRecord[] = [];
  rows.forEach((row, i) => {
    if (!row.some((c) => (c ?? '').trim() !== '')) return;
    let date = at(row, 'date');
    if (/^\d{5}(\.\d+)?$/.test(date)) date = excelSerialToIso(Number(date));
    records.push({
      id: records.length + 1,
      rowNumber: i + 2,
      payerCode: at(row, 'payerCode'),
      nameInFile: at(row, 'name'),
      amountText: at(row, 'amount'),
      date,
      paymentMode: at(row, 'paymentMode'),
      transactionId: at(row, 'transactionId'),
      chargeHead: at(row, 'chargeHead'),
      remarks: at(row, 'remarks'),
      payerId: null,
      payerName: '',
      payerDetails: '',
      amount: NaN,
      status: 'pending',
      errors: [],
      warnings: [],
      isSelected: false
    });
  });
  return records;
}

/** Validates every row against the student / staff records, Charge Master and the receipts already posted. */
function validateRecords(records: ImportRecord[]): ImportRecord[] {
  const today = todayIso();
  const heads = getChargeHeads();
  const refCount: Record<string, number> = {};
  records.forEach((r) => {
    const t = cleanRef(r.transactionId).toLowerCase();
    if (t && !r.receiptNo) refCount[t] = (refCount[t] || 0) + 1;
  });
  const running: Record<string, number> = {};
  return records.map((r) => {
    if (r.receiptNo) return r; // already processed
    const errors: string[] = [];
    const warnings: string[] = [];
    const payer = findChargePayer(r.payerCode);
    if (!r.payerCode) errors.push('Admission / Employee No is required');else
    if (!payer) errors.push(`Student / staff "${r.payerCode}" not found`);
    if (payer && r.nameInFile) {
      const a = r.nameInFile.toLowerCase().replace(/\s+/g, ' ').trim();
      const b = payer.name.toLowerCase();
      if (!b.includes(a) && !a.includes(b) && a.split(' ')[0] !== b.split(' ')[0])
      warnings.push(`Name in file (${r.nameInFile}) does not match records (${payer.name})`);
    }
    const amount = parseAmount(r.amountText);
    if (!r.amountText) errors.push('Amount is required');else
    if (isNaN(amount)) errors.push('Amount must be a number');else
    if (amount < 0) errors.push('Amount cannot be negative');else
    if (amount === 0) errors.push('Amount must be greater than 0');
    if (!r.date) errors.push('Payment date is required');else
    if (!isValidIsoDate(r.date)) errors.push('Invalid date format. Expected: YYYY-MM-DD');else
    if (r.date > today) errors.push('Payment date cannot be in the future');
    const mode = normalizeMode(r.paymentMode);
    if (!r.paymentMode) errors.push('Payment mode is required');else
    if (!mode) errors.push(`Unknown payment mode "${r.paymentMode}"`);else
    if (mode !== 'Cash' && !cleanRef(r.transactionId)) warnings.push(`Transaction ID missing for ${mode} payment`);
    const ref = cleanRef(r.transactionId).toLowerCase();
    if (ref && refCount[ref] > 1) warnings.push('Duplicate transaction ID in this file');
    if (ref && isChargeReferenceUsed(ref)) warnings.push('Transaction ID already used on an earlier receipt');
    if (r.chargeHead) {
      const q = r.chargeHead.toLowerCase();
      if (!heads.some((h) => h.code.toLowerCase() === q || h.name.toLowerCase().includes(q)))
      warnings.push('Charge head not found in Charge Master — amount goes to the oldest dues');
    }
    if (payer && amount > 0 && !errors.length) {
      // running total per person (rows with errors are skipped, so they don't count)
      const due = getPayerDue(payer.id);
      running[payer.id] = (running[payer.id] || 0) + amount;
      if (due <= 0) warnings.push('No pending charges — amount will be kept as advance');else
      if (running[payer.id] > due) warnings.push(`Amount exceeds pending dues (${inr(due)}) — excess kept as advance`);
    }
    const status: ValidationStatus = errors.length ? 'error' : warnings.length ? 'warning' : 'valid';
    return {
      ...r,
      paymentMode: mode || r.paymentMode,
      payerId: payer ? payer.id : null,
      payerName: payer ? payer.name : r.nameInFile || 'Unknown',
      payerDetails: payer ? payerSubtitle(payer) : '—',
      amount,
      status,
      errors,
      warnings,
      isSelected: status === 'error' ? false : r.status === 'pending' || r.status === 'error' ? true : r.isSelected
    };
  });
}

const SEED_HISTORY: ImportHistoryItem[] = [
{ id: '1', fileName: 'march_receipts_2024.csv', uploadDate: '20 Mar 2024, 10:30 AM', totalRecords: 150, processedRecords: 150, status: 'completed', uploadedBy: 'Admin' },
{ id: '2', fileName: 'february_payments.xlsx', uploadDate: '15 Feb 2024, 02:15 PM', totalRecords: 85, processedRecords: 82, status: 'partial', uploadedBy: 'Accountant' },
{ id: '3', fileName: 'late_fees_jan.csv', uploadDate: '05 Jan 2024, 09:45 AM', totalRecords: 25, processedRecords: 0, status: 'failed', uploadedBy: 'Admin' }];


// ============================================
// CUSTOM COMPONENTS
// ============================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    outline: 'bg-white text-gray-600 border-gray-300'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>

      {children}
    </span>);

}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>);

}

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function Card({ children, className = '', padding = 'none' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>);

}

// Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
}

function Checkbox({ checked, onChange, label, disabled = false, indeterminate = false, ariaLabel }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          w-4 h-4 rounded border-2 flex items-center justify-center transition-all
          ${checked || indeterminate ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}>

        {checked && <CheckSquare className="w-3 h-3 text-white" />}
        {indeterminate && !checked && <div className="w-2 h-0.5 bg-white" />}
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>);

}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

function ProgressBar({ value, max, variant = 'default', showLabel = true, size = 'md' }: ProgressBarProps) {
  const percentage = Math.round(value / max * 100);

  const variantStyles = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    danger: 'bg-red-600'
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5'
  };

  return (
    <div className="w-full">
      {showLabel &&
      <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{value} of {max}</span>
          <span>{percentage}%</span>
        </div>
      }
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }} />

      </div>
    </div>);

}

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>

      {children}
      {isVisible &&
      <div
        className={`
            absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap
            ${positionStyles[position]}
          `}>

          {content}
        </div>
      }
    </div>);

}

// Status Indicator Component
function StatusIndicator({ status }: {status: ValidationStatus;}) {
  const config = {
    valid: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Valid' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Error' },
    warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Warning' },
    pending: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Pending' }
  };

  const { icon: Icon, color, bg, label } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bg}`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs ${color}`}>{label}</span>
    </div>);

}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, variant, subtitle }: StatCardProps) {
  const variantStyles = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} rounded-xl p-4 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs ${styles.text} mb-1`}>{title}</p>
          <p className="text-2xl text-gray-900" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${styles.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>);

}

// Simple modal used by this page
function PageModal({
  title,
  onClose,
  children,
  footer,
  wide = false







}: {title: string;onClose: () => void;children: React.ReactNode;footer?: React.ReactNode;wide?: boolean;}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>);

}

// ============================================
// FILE UPLOAD COMPONENT
// ============================================

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  isUploading: boolean;
  acceptedFormats: string[];
  maxSizeMB: number;
}

function FileUpload({ onFileSelect, onClear, isUploading, acceptedFormats, maxSizeMB }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'xls') {
      setError('Old Excel (.xls) files are not supported. Save the sheet as .xlsx or .csv and upload again.');
      return false;
    }
    if (!extension || !acceptedFormats.includes(`.${extension}`)) {
      setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return false;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 text-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
            e.target.value = '';
          }}
          className="hidden"
          id="file-upload-input"
          data-testid="import-file-input" />


        {isUploading ?
        <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-700">Processing file...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait while we validate your data</p>
          </div> :
        selectedFile ?
        <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-gray-900 break-all">{selectedFile.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Folder className="w-4 h-4 mr-1" />
                Change
              </Button>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="w-4 h-4 mr-1 text-red-600" />
                <span className="text-red-600">Remove File</span>
              </Button>
            </div>
          </div> :

        <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <UploadCloud className={`w-7 h-7 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-gray-700 mb-1">
              {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              or click to browse from your computer
            </p>
            <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}>

              <Folder className="w-4 h-4 mr-2" />
              Select File
            </Button>
          </div>
        }
      </div>

      {error &&
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      }

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Paperclip className="w-3 h-3" />
          Formats: {acceptedFormats.join(', ')}
        </span>
        <span className="flex items-center gap-1">
          <FileUp className="w-3 h-3" />
          Max size: {maxSizeMB}MB
        </span>
      </div>
    </div>);

}

// ============================================
// IMPORT TABLE COMPONENT
// ============================================

interface ImportTableProps {
  data: ImportRecord[];
  onSelectRecord: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDeleteRecord: (id: number) => void;
  onEditRecord: (record: ImportRecord) => void;
  onRevalidate: () => void;
  selectedCount: number;
}

function ImportTable({
  data,
  onSelectRecord,
  onSelectAll,
  onDeleteRecord,
  onEditRecord,
  onRevalidate,
  selectedCount
}: ImportTableProps) {
  const [sortField, setSortField] = useState<string>('rowNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<ValidationStatus | 'all' | 'processed'>('all');

  const selectable = data.filter((r) => !r.receiptNo && r.status !== 'error');
  const allSelected = selectable.length > 0 && selectable.every((r) => r.isSelected);
  const someSelected = selectable.some((r) => r.isSelected) && !allSelected;

  const filteredData = useMemo(() => {
    let result = [...data];

    if (filterStatus === 'processed') result = result.filter((r) => !!r.receiptNo);else
    if (filterStatus !== 'all') result = result.filter((r) => !r.receiptNo && r.status === filterStatus);

    result.sort((a, b) => {
      const aValue = a[sortField as keyof ImportRecord];
      const bValue = b[sortField as keyof ImportRecord];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ?
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const av = isNaN(aValue) ? -Infinity : aValue;
        const bv = isNaN(bValue) ? -Infinity : bValue;
        return sortDirection === 'asc' ? av - bv : bv - av;
      }

      return 0;
    });

    return result;
  }, [data, filterStatus, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: {field: string;children: React.ReactNode;}) =>
  <button
    onClick={() => handleSort(field)}
    className="flex items-center gap-1 hover:text-gray-900 transition-colors">

      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`} />
    </button>;


  return (
    <div className="space-y-3">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              aria-label="Filter records"
              onChange={(e) => setFilterStatus(e.target.value as ValidationStatus | 'all' | 'processed')}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="all">All Records</option>
              <option value="valid">Valid Only</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="processed">Processed</option>
            </select>
          </div>
          {selectedCount > 0 &&
          <span className="text-sm text-blue-600">
              {selectedCount} record{selectedCount > 1 ? 's' : ''} selected
            </span>
          }
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onRevalidate}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Re-validate
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="import-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    ariaLabel="Select all importable rows"
                    checked={allSelected}
                    indeterminate={someSelected}
                    disabled={!selectable.length}
                    onChange={onSelectAll} />

                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="rowNumber">#</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="payerCode">Adm / Emp No.</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="payerName">Student / Staff</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="amount">Amount</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  <SortableHeader field="date">Date</SortableHeader>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Mode</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Charge Head</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) =>
              <tr
                key={record.id}
                data-row={record.rowNumber}
                className={`
                    border-b border-gray-100 transition-colors
                    ${record.receiptNo ? 'bg-green-50/40' : ''}
                    ${!record.receiptNo && record.status === 'error' ? 'bg-red-50/50' : ''}
                    ${!record.receiptNo && record.status === 'warning' ? 'bg-amber-50/50' : ''}
                    ${record.isSelected ? 'bg-blue-50/50' : ''}
                    hover:bg-gray-50
                  `}>

                  <td className="px-4 py-3">
                    <Checkbox
                    ariaLabel={`Select row ${record.rowNumber}`}
                    checked={record.isSelected}
                    disabled={!!record.receiptNo || record.status === 'error'}
                    onChange={(checked) => onSelectRecord(record.id, checked)} />

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {record.rowNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${record.payerId ? 'text-gray-900' : 'text-red-600'}`}>
                      {record.payerCode || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm ${record.payerId ? 'text-gray-900' : 'text-red-600'}`}>{record.payerName}</p>
                    <p className="text-xs text-gray-500">{record.payerDetails}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.errors.some((e) => e.startsWith('Amount')) ? 'text-red-600' : 'text-gray-900'}`}>
                      {isNaN(record.amount) ? record.amountText || '—' : inr(record.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.errors.some((e) => /date/i.test(e)) ? 'text-red-600 underline decoration-wavy' : 'text-gray-600'}`}>
                      {record.date || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" size="sm">{record.paymentMode || '—'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.chargeHead || <span className="text-gray-400">Oldest dues</span>}
                  </td>
                  <td className="px-4 py-3">
                    {record.receiptNo ?
                  <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Processed · {record.receiptNo}
                      </Badge> :

                  <div className="space-y-1">
                        <StatusIndicator status={record.status} />
                        {record.errors.length > 0 &&
                    <div className="space-y-0.5">
                            {record.errors.map((error, idx) =>
                      <p key={idx} className="text-xs text-red-600 flex items-center gap-1">
                                <XCircle className="w-3 h-3 flex-shrink-0" />
                                {error}
                              </p>
                      )}
                          </div>
                    }
                        {record.warnings.length > 0 &&
                    <div className="space-y-0.5">
                            {record.warnings.map((warning, idx) =>
                      <p key={idx} className="text-xs text-amber-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                {warning}
                              </p>
                      )}
                          </div>
                    }
                      </div>
                  }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tooltip content="Edit Record">
                        <button
                        onClick={() => onEditRecord(record)}
                        disabled={!!record.receiptNo}
                        aria-label={`Edit row ${record.rowNumber}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">

                          <Edit3 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Record">
                        <button
                        onClick={() => onDeleteRecord(record.id)}
                        disabled={!!record.receiptNo}
                        aria-label={`Delete row ${record.rowNumber}`}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 &&
        <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No records match your filter criteria</p>
          </div>
        }
      </div>
    </div>);

}

// ============================================
// COLUMN MAPPING COMPONENT
// ============================================

interface ColumnMappingProps {
  mappings: ColumnMapping[];
  onUpdateMapping: (key: FieldKey, sourceColumn: string) => void;
  sourceColumns: string[];
  onApply: () => void;
}

function ColumnMappingPanel({ mappings, onUpdateMapping, sourceColumns, onApply }: ColumnMappingProps) {
  const requiredMissing = mappings.filter((m) => m.required && !m.mapped);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">Column Mapping</h3>
        <Badge variant={requiredMissing.length ? 'warning' : 'success'}>
          {mappings.filter((m) => m.mapped).length} / {mappings.length} Mapped
        </Badge>
      </div>

      <div className="space-y-3">
        {mappings.map((mapping) =>
        <div key={mapping.key} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700">{mapping.targetField}</span>
                {mapping.required &&
              <span className="text-xs text-red-500">*</span>
              }
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <select
              value={mapping.sourceColumn}
              aria-label={`Column for ${mapping.targetField}`}
              onChange={(e) => onUpdateMapping(mapping.key, e.target.value)}
              className={`
                  w-full text-xs border rounded-lg px-2 py-1.5
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${mapping.mapped ? 'border-green-300 bg-green-50' : 'border-gray-200'}
                  ${mapping.required && !mapping.mapped ? 'border-red-300 bg-red-50' : ''}
                `}>

                <option value="">-- Not in file --</option>
                {sourceColumns.map((col) =>
              <option key={col} value={col}>{col}</option>
              )}
              </select>
            </div>
          </div>
        )}
      </div>
      {requiredMissing.length > 0 &&
      <p className="text-xs text-red-600">Map the required columns: {requiredMissing.map((m) => m.targetField).join(', ')}</p>
      }
      <Button variant="primary" size="sm" className="w-full" disabled={requiredMissing.length > 0} onClick={onApply}>
        <RefreshCw className="w-4 h-4 mr-1" />
        Apply Mapping &amp; Validate
      </Button>
    </div>);

}

// ============================================
// IMPORT HISTORY COMPONENT
// ============================================

function ImportHistory({ history, onView }: {history: ImportHistoryItem[];onView: (item: ImportHistoryItem) => void;}) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    partial: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-gray-900 flex items-center gap-2">
        <History className="w-4 h-4" />
        Recent Imports
      </h3>

      {history.length === 0 ?
      <div className="py-8 text-center text-gray-500">
          <Archive className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No import history</p>
        </div> :

      <div className="space-y-2" data-testid="import-history">
          {history.map((item) => {
          const { icon: Icon, color, bg } = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{item.fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{item.uploadDate}</span>
                    <span>•</span>
                    <span>{item.processedRecords}/{item.totalRecords} records</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onView(item)} aria-label={`View ${item.fileName}`}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>);

        })}
        </div>
      }
    </div>);

}

// ============================================
// MAIN COMPONENT
// ============================================

export function ChargeReceiptImport() {
  // State
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importData, setImportData] = useState<ImportRecord[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<FieldKey, string>>(EMPTY_MAPPING);
  const [history, setHistory] = useState<ImportHistoryItem[]>(SEED_HISTORY);
  const [editing, setEditing] = useState<ImportRecord | null>(null);
  const [viewHistory, setViewHistory] = useState<ImportHistoryItem | null>(null);
  const [lastReceipts, setLastReceipts] = useState<ChargeReceiptRecord[]>([]);
  const [showReceipts, setShowReceipts] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const helpRef = useRef<HTMLDivElement>(null);

  const columnMappings: ColumnMapping[] = TARGET_FIELDS.map((f) => ({
    key: f.key,
    sourceColumn: mapping[f.key],
    targetField: f.label,
    required: f.required,
    mapped: mapping[f.key] !== ''
  }));

  // Calculate summary
  const summary = useMemo(() => {
    const open = importData.filter((r) => !r.receiptNo);
    const importable = open.filter((r) => r.isSelected && (r.status === 'valid' || r.status === 'warning'));
    return {
      totalRecords: importData.length,
      validRecords: open.filter((r) => r.status === 'valid').length,
      errorRecords: open.filter((r) => r.status === 'error').length,
      warningRecords: open.filter((r) => r.status === 'warning').length,
      processedRecords: importData.length - open.length,
      selectedCount: importable.length,
      selectedAmount: importable.reduce((sum, r) => sum + r.amount, 0)
    };
  }, [importData]);

  const resetImport = () => {
    setImportData([]);
    setImportStatus('idle');
    setProcessingProgress(0);
    setFileName('');
    setFileError('');
    setSourceColumns([]);
    setRawRows([]);
    setMapping(EMPTY_MAPPING);
    setLastReceipts([]);
  };

  // Handlers
  const handleFileSelect = async (file: File) => {
    resetImport();
    setFileName(file.name);
    setImportStatus('uploading');
    try {
      const rows = /\.xlsx$/i.test(file.name) ? await readXlsxRows(file) : parseCsv((await readFile(file, 'text')) as string);
      const headers = (rows[0] || []).map((h) => (h ?? '').trim());
      const dataRows = rows.slice(1);
      const filled = dataRows.filter((r) => r.some((c) => (c ?? '').trim() !== '')).length;
      if (!headers.some(Boolean) || filled === 0) throw new Error('The file has no data rows — add at least one record below the header row.');
      if (filled > MAX_RECORDS) throw new Error(`The file has ${filled} records — the maximum is ${MAX_RECORDS} per file.`);
      const auto = autoMap(headers);
      setSourceColumns(headers.filter(Boolean));
      setRawRows(dataRows);
      setMapping(auto);
      setImportStatus('validating');
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (TARGET_FIELDS.every((f) => !f.required || auto[f.key])) {
        setImportData(validateRecords(buildRecords(dataRows, headers, auto)));
        setImportStatus('idle');
      } else {
        setImportStatus('mapping');
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'The file could not be read.');
      setImportStatus('failed');
    }
  };

  const handleApplyMapping = () => {
    setImportData(validateRecords(buildRecords(rawRows, sourceColumns, mapping)));
    setImportStatus('idle');
  };

  const handleUpdateMapping = (key: FieldKey, sourceColumn: string) => {
    setMapping((prev) => ({ ...prev, [key]: sourceColumn }));
  };

  const handleSelectRecord = (id: number, selected: boolean) => {
    setImportData((prev) =>
    prev.map((r) => r.id === id ? { ...r, isSelected: selected } : r)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setImportData((prev) =>
    prev.map((r) => !r.receiptNo && (r.status === 'valid' || r.status === 'warning') ? { ...r, isSelected: selected } : r)
    );
  };

  const handleDeleteRecord = (id: number) => {
    setImportData((prev) => validateRecords(prev.filter((r) => r.id !== id)));
  };

  const handleRevalidate = () => {
    setImportData((prev) => validateRecords(prev));
  };

  const handleSaveEdit = (updated: ImportRecord) => {
    setImportData((prev) => validateRecords(prev.map((r) => r.id === updated.id ? { ...updated, status: 'pending' as ValidationStatus } : r)));
    setEditing(null);
  };

  const handleProcessReceipts = () => {
    const toProcess = importData.filter((r) => !r.receiptNo && r.isSelected && (r.status === 'valid' || r.status === 'warning'));
    if (!toProcess.length) return;
    const skipped = importData.filter((r) => !r.receiptNo).length - toProcess.length;
    setImportStatus('processing');
    setProcessingProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(100, progress + 25);
      setProcessingProgress(progress);
      if (progress < 100) return;
      clearInterval(interval);
      const receipts = postChargePayments(
        toProcess.map((r) => ({
          payerId: r.payerId as string,
          amount: r.amount,
          date: r.date,
          mode: r.paymentMode as PaymentMode,
          reference: cleanRef(r.transactionId),
          chargeHint: r.chargeHead,
          remarks: [r.remarks, `Imported from ${fileName} (row ${r.rowNumber})`].filter(Boolean).join(' · ')
        }))
      );
      const byRecord = new Map(toProcess.map((r, i) => [r.id, receipts[i].receiptNo]));
      setImportData((prev) => prev.map((r) => byRecord.has(r.id) ? { ...r, receiptNo: byRecord.get(r.id), isSelected: false } : r));
      setLastReceipts(receipts);
      setHistory((prev) => [
      {
        id: `IMP-${Date.now()}`,
        fileName,
        uploadDate: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        totalRecords: importData.length,
        processedRecords: receipts.length,
        status: skipped > 0 ? 'partial' : 'completed',
        uploadedBy: 'Admin',
        amount: receipts.reduce((s, r) => s + r.total, 0),
        receipts: receipts.map((r, i) => ({
          receiptNo: r.receiptNo,
          payerName: toProcess[i].payerName,
          payerCode: toProcess[i].payerCode,
          amount: r.total,
          date: r.date,
          mode: r.paymentMode
        }))
      },
      ...prev]
      );
      setImportStatus('completed');
    }, 150);
  };

  const handleClearAll = () => {
    resetImport();
    setUploadKey((k) => k + 1);
  };

  const handleDownloadErrorLog = () => {
    const errorRecords = importData.filter((r) => !r.receiptNo && r.status === 'error');
    const rows = errorRecords.map((r) => [
    r.rowNumber, r.payerCode, r.nameInFile, r.amountText, r.date, r.paymentMode, r.transactionId, r.chargeHead, r.remarks, r.errors.join('; ')]
    );
    downloadText(
      `import-errors-${fileName.replace(/\.[^.]+$/, '') || 'file'}-${todayIso()}.csv`,
      toCsv([['Row', ...TEMPLATE_HEADERS, 'Errors'], ...rows]),
      'text/csv;charset=utf-8'
    );
  };

  const handleDownloadTemplate = () => {
    const today = todayIso();
    downloadText(
      'charge-receipt-import-template.csv',
      toCsv([
      TEMPLATE_HEADERS,
      ['ADM-2024-001', 'Rahul Sharma', 500, today, 'Cash', '', 'Lab Equipment Breakage', 'Paid at counter'],
      ['GR-1022', 'Rohan Mehta', 600, today, 'UPI', 'UPI-458712', 'LAB-BRK-01', ''],
      ['EMP-1003', 'Neha Kulkarni', 2500, today, 'Online', 'NEFT-778120', 'Lab Equipment Breakage', 'Staff payment']]
      ),
      'text/csv;charset=utf-8'
    );
  };

  const openDocumentation = () => {
    setShowHelp(true);
    setTimeout(() => helpRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }), 50);
  };

  const receiptsSummaryRows = (list: {receiptNo: string;payerName: string;payerCode: string;amount: number;date: string;mode: string;}[]) =>
  list.map((r) => [r.receiptNo, r.payerCode, r.payerName, formatDate(r.date), r.mode, r.amount]);

  const lastReceiptRows = lastReceipts.map((r) => {
    const rec = importData.find((x) => x.receiptNo === r.receiptNo);
    return { receipt: r, payerName: rec?.payerName || '', payerCode: rec?.payerCode || '' };
  });

  const isBusy = importStatus === 'uploading' || importStatus === 'validating';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Charge Receipt Import</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Bulk post charge payments for students and staff from a CSV or Excel (.xlsx) file
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowHelp(!showHelp)}>

              <HelpCircle className="w-4 h-4 mr-2" />
              Help Guide
            </Button>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>

        {/* Help Panel */}
        {showHelp &&
        <div ref={helpRef}>
            <Card className="mb-6 overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="text-blue-900">Import Guide</h3>
                </div>
                <button
                onClick={() => setShowHelp(false)}
                aria-label="Close guide"
                className="p-1 hover:bg-blue-100 rounded-lg transition-colors">

                  <X className="w-4 h-4 text-blue-600" />
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      Expected Columns
                    </h4>
                    <div className="space-y-2">
                      {TARGET_FIELDS.map((col) =>
                    <div
                      key={col.key}
                      className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">

                          <div className={`w-2 h-2 rounded-full mt-1.5 ${col.required ? 'bg-red-500' : 'bg-gray-300'}`} />
                          <div>
                            <span className="text-sm text-gray-900">{col.column}</span>
                            <p className="text-xs text-gray-500">{col.description}</p>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      Important Notes
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Use the template (Download Template) for best results — column names are matched automatically
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Date format must be YYYY-MM-DD (Excel date cells are converted automatically)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Amount must be a positive number
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        AdmNo must match a student Admission No / GR No or a staff Employee Code
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Each payment is applied to that person&apos;s pending charges (matching Charge Head first, then oldest due date) and appears in Charge Receipt → Receipt History
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        Accepted files: .csv and .xlsx (old .xls must be saved as .xlsx or .csv) — maximum {MAX_SIZE_MB}MB
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        Maximum records per file: {MAX_RECORDS}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        }

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
            {/* File Upload Card */}
            <Card padding="lg">
              <FileUpload
                key={uploadKey}
                onFileSelect={handleFileSelect}
                onClear={handleClearAll}
                isUploading={isBusy}
                acceptedFormats={['.csv', '.xlsx']}
                maxSizeMB={MAX_SIZE_MB} />

            </Card>

            {/* Column Mapping Card (after a file is read) */}
            {sourceColumns.length > 0 &&
            <Card padding="md">
                <ColumnMappingPanel
                mappings={columnMappings}
                onUpdateMapping={handleUpdateMapping}
                sourceColumns={sourceColumns}
                onApply={handleApplyMapping} />

              </Card>
            }

            {/* Expected Columns Card */}
            <Card padding="md">
              <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Required Format
              </h4>
              <div className="space-y-2">
                {TARGET_FIELDS.filter((c) => c.key !== 'name').slice(0, 5).map((col) =>
                <div
                  key={col.key}
                  className="flex items-center justify-between py-1.5">

                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm text-gray-700">{col.column}</span>
                    </div>
                    {col.required &&
                  <span className="text-xs text-red-500">Required</span>
                  }
                  </div>
                )}
              </div>
            </Card>

            {/* Import History Card */}
            <Card padding="md">
              <ImportHistory history={history} onView={setViewHistory} />
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {importStatus === 'failed' ?
            <Card className="h-full min-h-[300px] flex flex-col items-center justify-center" padding="lg">
                <div className="text-center max-w-md" role="alert">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">Could not import {fileName}</h3>
                  <p className="text-sm text-red-700 mb-6">{fileError}</p>
                  <Button variant="outline" onClick={handleClearAll}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Another File
                  </Button>
                </div>
              </Card> :
            importStatus === 'mapping' ?
            <Card className="h-full min-h-[300px] flex flex-col items-center justify-center" padding="lg">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">Map the columns of {fileName}</h3>
                  <p className="text-sm text-gray-600">
                    Some required columns could not be matched automatically. Choose the matching file column for each
                    required field in <strong>Column Mapping</strong> (left), then click <strong>Apply Mapping &amp; Validate</strong>.
                  </p>
                </div>
              </Card> :
            importData.length > 0 ?
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                  title="Total Records"
                  value={summary.totalRecords}
                  icon={FileText}
                  variant="blue"
                  subtitle={fileName} />

                  <StatCard
                  title="Valid Records"
                  value={summary.validRecords}
                  icon={CheckCircle2}
                  variant="green"
                  subtitle={summary.warningRecords ? `+${summary.warningRecords} with warnings` : undefined} />

                  <StatCard
                  title="Errors"
                  value={summary.errorRecords}
                  icon={XCircle}
                  variant="red" />

                  <StatCard
                  title="Amount to Import"
                  value={inr(summary.selectedAmount)}
                  icon={IndianRupee}
                  variant="purple"
                  subtitle={`${summary.selectedCount} selected`} />

                </div>

                {/* Processing Status */}
                {importStatus === 'processing' &&
              <Card padding="lg">
                    <div className="flex items-center gap-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">
                          Processing Receipts...
                        </h3>
                        <ProgressBar
                      value={Math.round(processingProgress)}
                      max={100}
                      variant="default" />

                      </div>
                    </div>
                  </Card>
              }

                {/* Completed Status */}
                {importStatus === 'completed' &&
              <Card className="bg-green-50 border-green-200" padding="lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-green-900">
                            Import Completed Successfully
                          </h3>
                          <p className="text-sm text-green-700 mt-1" data-testid="import-result">
                            {lastReceipts.length} receipt{lastReceipts.length !== 1 ? 's' : ''} generated for{' '}
                            {inr(lastReceipts.reduce((s, r) => s + r.total, 0))} and posted to Charge Receipt.
                            {summary.errorRecords + summary.validRecords + summary.warningRecords > 0 &&
                        ` ${summary.errorRecords + summary.validRecords + summary.warningRecords} row(s) not processed.`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClearAll}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Import
                        </Button>
                        <Button variant="primary" onClick={() => setShowReceipts(true)}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Receipts
                        </Button>
                      </div>
                    </div>
                  </Card>
              }

                {/* Data Table */}
                {importStatus !== 'processing' &&
              <Card>
                    {/* Table Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{summary.validRecords} Valid</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{summary.warningRecords} Warnings</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>{summary.errorRecords} Errors</span>
                        </div>
                        {summary.processedRecords > 0 &&
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                            <FileCheck className="w-4 h-4" />
                            <span>{summary.processedRecords} Processed</span>
                          </div>
                    }
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleClearAll}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>

                    {/* Table Content */}
                    <div className="p-5">
                      <ImportTable
                    data={importData}
                    onSelectRecord={handleSelectRecord}
                    onSelectAll={handleSelectAll}
                    onDeleteRecord={handleDeleteRecord}
                    onEditRecord={setEditing}
                    onRevalidate={handleRevalidate}
                    selectedCount={summary.selectedCount} />

                    </div>

                    {/* Table Footer */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-xs text-gray-500 italic">
                        * Only selected valid and warning records are processed. Fix error rows with Edit, or they will be skipped.
                      </p>
                      <div className="flex items-center gap-3">
                        {summary.errorRecords > 0 &&
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadErrorLog}>

                            <Download className="w-4 h-4 mr-2 text-red-600" />
                            <span className="text-red-600">Download Error Log</span>
                          </Button>
                    }
                        <Button
                      variant="primary"
                      disabled={summary.selectedCount === 0}
                      onClick={handleProcessReceipts}>

                          <Play className="w-4 h-4 mr-2" />
                          Process {summary.selectedCount} Receipt{summary.selectedCount !== 1 ? 's' : ''}
                        </Button>
                      </div>
                    </div>
                  </Card>
              }
              </div> : (

            /* Empty State */
            <Card className="h-full min-h-[500px] flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileCheck className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">
                    No Data to Preview
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Upload a CSV or Excel (.xlsx) file to see validation results here.
                    The system will automatically validate all records and highlight any issues.
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Student / Staff Check
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Date Validation
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Amount Check
                      </span>
                    </div>
                  </div>
                </div>
              </Card>)
            }
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg mb-1">Bulk Import Tips</h3>
                <p className="text-sm text-blue-100">
                  Use our template for error-free imports. Download it, fill in your data and upload it here.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* Plain buttons with explicit colours (no conflicting variant classes) so the text is always readable */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-white/40 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 transition-colors">

                <Download className="w-4 h-4" />
                Download Template
              </button>
              <button
                type="button"
                onClick={openDocumentation}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/60 transition-colors">

                <FileText className="w-4 h-4" />
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Record Modal */}
      {editing &&
      <EditRecordModal record={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />
      }

      {/* Receipts of the last import */}
      {showReceipts &&
      <PageModal
        title={`Receipts generated — ${fileName}`}
        onClose={() => setShowReceipts(false)}
        wide
        footer={
        <div className="flex justify-end gap-2">
              <Button
            variant="outline"
            onClick={() =>
            downloadText(
              `import-receipts-${todayIso()}.csv`,
              toCsv([
              ['Receipt No', 'Adm / Emp No', 'Name', 'Date', 'Mode', 'Reference', 'Amount'],
              ...lastReceiptRows.map(({ receipt, payerName, payerCode }) => [
              receipt.receiptNo, payerCode, payerName, receipt.date, receipt.paymentMode, receipt.reference, receipt.total]
              )]
              ),
              'text/csv;charset=utf-8'
            )
            }>

                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button
            variant="outline"
            onClick={() =>
            printHtml(
              tableHtml(
                'Imported Charge Receipts',
                ['Receipt No', 'Adm / Emp No', 'Name', 'Date', 'Mode', 'Amount'],
                receiptsSummaryRows(lastReceiptRows.map(({ receipt, payerName, payerCode }) => ({
                  receiptNo: receipt.receiptNo, payerName, payerCode, amount: receipt.total, date: receipt.date, mode: receipt.paymentMode
                })))
              )
            )
            }>

                <Printer className="w-4 h-4 mr-2" />
                Print List
              </Button>
              <Button variant="primary" onClick={() => setShowReceipts(false)}>Close</Button>
            </div>
        }>

          <table className="w-full text-sm" data-testid="receipts-list">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Receipt No</th>
                <th className="px-3 py-2 text-left font-medium">Student / Staff</th>
                <th className="px-3 py-2 text-left font-medium">Allocated To</th>
                <th className="px-3 py-2 text-left font-medium">Mode</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lastReceiptRows.map(({ receipt, payerName, payerCode }) =>
            <tr key={receipt.id}>
                  <td className="px-3 py-2 font-medium text-gray-900">{receipt.receiptNo}</td>
                  <td className="px-3 py-2">
                    <p className="text-gray-900">{payerName}</p>
                    <p className="text-xs text-gray-500 font-mono">{payerCode}</p>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{receipt.lines.map((l) => `${l.headName} ${inr(l.paid)}`).join(', ')}</td>
                  <td className="px-3 py-2 text-gray-600">{receipt.paymentMode}{receipt.reference ? ` · ${receipt.reference}` : ''}</td>
                  <td className="px-3 py-2 text-right font-semibold">{inr(receipt.total)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Print ${receipt.receiptNo}`}
                    onClick={() => printHtml(chargeReceiptHtml(receipt, findChargePayer(payerCode)))}>

                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Download ${receipt.receiptNo}`}
                    onClick={() =>
                    downloadText(`Charge-Receipt-${receipt.receiptNo}.html`, chargeReceiptHtml(receipt, findChargePayer(payerCode)))
                    }>

                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">
            These receipts are also listed in Charge Receipt → Collect Payment → Receipt History for each student / staff member.
          </p>
        </PageModal>
      }

      {/* Import history details */}
      {viewHistory &&
      <PageModal title={`Import — ${viewHistory.fileName}`} onClose={() => setViewHistory(null)} wide={!!viewHistory.receipts} footer={
      <div className="flex justify-end gap-2">
            {viewHistory.receipts &&
        <Button
          variant="outline"
          onClick={() =>
          downloadText(
            `import-${viewHistory.fileName.replace(/\.[^.]+$/, '')}-receipts.csv`,
            toCsv([['Receipt No', 'Adm / Emp No', 'Name', 'Date', 'Mode', 'Amount'], ...receiptsSummaryRows(viewHistory.receipts || [])]),
            'text/csv;charset=utf-8'
          )
          }>

                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
        }
            <Button variant="primary" onClick={() => setViewHistory(null)}>Close</Button>
          </div>
      }>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[
          ['Uploaded', viewHistory.uploadDate],
          ['Uploaded By', viewHistory.uploadedBy],
          ['Records in File', String(viewHistory.totalRecords)],
          ['Receipts Posted', String(viewHistory.processedRecords)],
          ['Status', viewHistory.status === 'completed' ? 'Completed' : viewHistory.status === 'partial' ? 'Partially processed' : 'Failed'],
          ['Amount', viewHistory.amount !== undefined ? inr(viewHistory.amount) : '—']].
          map(([k, v]) =>
          <div key={k} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">{k}</p>
                <p className="text-gray-900">{v}</p>
              </div>
          )}
          </div>
          {viewHistory.receipts ?
        <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Receipt No</th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Mode</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {viewHistory.receipts.map((r) =>
            <tr key={r.receiptNo}>
                    <td className="px-3 py-2">{r.receiptNo}</td>
                    <td className="px-3 py-2">{r.payerName} <span className="text-xs text-gray-500 font-mono">{r.payerCode}</span></td>
                    <td className="px-3 py-2">{formatDate(r.date)}</td>
                    <td className="px-3 py-2">{r.mode}</td>
                    <td className="px-3 py-2 text-right">{inr(r.amount)}</td>
                  </tr>
            )}
              </tbody>
            </table> :

        <p className="text-sm text-gray-500">Row-level details are kept only for imports made in this session.</p>
        }
        </PageModal>
      }
    </div>);

}

// ============================================
// EDIT RECORD MODAL
// ============================================

function EditRecordModal({ record, onClose, onSave }: {record: ImportRecord;onClose: () => void;onSave: (r: ImportRecord) => void;}) {
  const [form, setForm] = useState({
    payerCode: record.payerCode,
    amountText: record.amountText,
    date: record.date,
    paymentMode: record.paymentMode,
    transactionId: record.transactionId,
    chargeHead: record.chargeHead,
    remarks: record.remarks
  });
  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) =>
  <label className="block">
      <span className="block text-sm text-gray-700 mb-1">{label}</span>
      <input
      {...props}
      aria-label={label}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

    </label>;


  return (
    <PageModal
      title={`Edit Row ${record.rowNumber}`}
      onClose={onClose}
      footer={
      <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave({ ...record, ...form })}>
            <Save className="w-4 h-4 mr-2" />
            Save &amp; Re-validate
          </Button>
        </div>
      }>

      {record.errors.length > 0 &&
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 space-y-0.5">
          {record.errors.map((e, i) =>
        <p key={i} className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              {e}
            </p>
        )}
        </div>
      }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('payerCode', 'Admission / GR / Employee No', { placeholder: 'e.g. ADM-2024-001 or EMP-1003' })}
        {field('amountText', 'Amount', { inputMode: 'decimal', placeholder: 'e.g. 500' })}
        {field('date', 'Payment Date (YYYY-MM-DD)', { placeholder: 'YYYY-MM-DD' })}
        <label className="block">
          <span className="block text-sm text-gray-700 mb-1">Payment Mode</span>
          <select
            aria-label="Payment Mode"
            value={normalizeMode(form.paymentMode) || ''}
            onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">{form.paymentMode && !normalizeMode(form.paymentMode) ? `${form.paymentMode} (invalid)` : 'Select mode'}</option>
            {MODES.map((m) =>
            <option key={m} value={m}>{m}</option>
            )}
          </select>
        </label>
        {field('transactionId', 'Transaction ID')}
        {field('chargeHead', 'Charge Head (optional)', { placeholder: 'e.g. Library Fine or LIB-FINE-01' })}
      </div>
      <div className="mt-4">{field('remarks', 'Remarks')}</div>
    </PageModal>);

}

export default ChargeReceiptImport;
