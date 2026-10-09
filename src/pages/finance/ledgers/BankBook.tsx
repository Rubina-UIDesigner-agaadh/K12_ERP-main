import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Plus, Printer, FileText, FileSpreadsheet, Eye, Trash2, Landmark,
  ArrowDownToLine, ArrowUpFromLine, Scale, RefreshCw, AlertTriangle, X, CheckCircle, Building, ClipboardList,
  Building2,
} from 'lucide-react';

// ───────────────────────────── Types & Data ─────────────────────────────
interface BankAccount { id: string; bank: string; acctType: string; masked: string; opening: number; branch: string; fd?: boolean }
interface BankTxn {
  id: string; bankId: string; date: string; voucherNo: string;
  type: 'Receipt' | 'Payment'; desc: string; account: string;
  mode: string; chqRef: string; bankRef: string;
  module: string; status: 'Approved' | 'Pending' | 'Rejected' | 'Reversed';
  recon: 'Reconciled' | 'Unreconciled'; branch: string; amount: number; party: string;
}
interface Cheque { id: string; chqNo: string; date: string; party: string; amount: number; chqDate: string; clearDate: string; status: 'Cleared' | 'Pending' | 'Bounced' | 'Cancelled' }

const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const TYPES = ['All', 'Receipt', 'Payment', 'Contra (Bank to Cash)'];
const MODES = ['All', 'Cheque', 'NEFT', 'RTGS', 'UPI', 'IMPS', 'Bank Transfer', 'DD'];
const STATUSES = ['All', 'Approved', 'Pending', 'Rejected', 'Reversed'];
const RECONS = ['All', 'Reconciled', 'Unreconciled'];
const CHQ_STATUSES = ['All', 'Issued', 'Cleared', 'Bounced', 'Cancelled', 'Pending'];

const INITIAL_ACCOUNTS: BankAccount[] = [
  { id: 'sbi', bank: 'SBI', acctType: 'Current A/c', masked: 'XXXX 4521', opening: 300000, branch: 'Main Campus' },
  { id: 'hdfc', bank: 'HDFC', acctType: 'Savings A/c', masked: 'XXXX 7823', opening: 150000, branch: 'North Branch' },
  { id: 'pnb', bank: 'PNB', acctType: 'FD Account', masked: 'XXXX 1234', opening: 500000, branch: 'East Branch', fd: true },
];

const BANK_DATA: Record<string, BankTxn[]> = {
  'FY 2025-26': [
    { id: '1', bankId: 'sbi', date: '2025-09-01', voucherNo: 'RV-2025-010', type: 'Receipt', desc: 'Fee - UPI Collection', account: 'Tuition Fee A/c', mode: 'UPI', chqRef: 'UPI001', bankRef: 'UBN99201', module: 'Fee Management', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 25000, party: 'Multiple Students' },
    { id: '2', bankId: 'sbi', date: '2025-09-05', voucherNo: 'RV-2025-011', type: 'Receipt', desc: 'Govt Grant', account: 'Grant A/c', mode: 'NEFT', chqRef: 'NEFT01', bankRef: 'SBIN77104', module: 'Manual', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 100000, party: 'Education Dept.' },
    { id: '3', bankId: 'sbi', date: '2025-09-10', voucherNo: 'RV-2025-012', type: 'Receipt', desc: 'Fee - NEFT Collection', account: 'Tuition Fee A/c', mode: 'NEFT', chqRef: 'NEFT02', bankRef: 'SBIN77188', module: 'Fee Management', status: 'Approved', recon: 'Reconciled', branch: 'North Branch', amount: 35000, party: 'Multiple Students' },
    { id: '4', bankId: 'sbi', date: '2025-09-15', voucherNo: 'CV-2025-002', type: 'Receipt', desc: 'Cash to Bank (Contra)', account: 'Cash A/c', mode: 'Bank Transfer', chqRef: 'CASH01', bankRef: 'SBIN77340', module: 'Manual', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 20000, party: '—' },
    { id: '5', bankId: 'sbi', date: '2025-09-20', voucherNo: 'RV-2025-013', type: 'Receipt', desc: 'Donation - RTGS', account: 'Donation A/c', mode: 'RTGS', chqRef: 'RTGS01', bankRef: 'SBIN77512', module: 'Manual', status: 'Approved', recon: 'Unreconciled', branch: 'Main Campus', amount: 50000, party: 'Alumni Assoc.' },
    { id: '6', bankId: 'sbi', date: '2025-09-25', voucherNo: 'RV-2025-014', type: 'Receipt', desc: 'Hostel Fee', account: 'Hostel Fee A/c', mode: 'UPI', chqRef: 'UPI002', bankRef: 'UBN99554', module: 'Fee Management', status: 'Approved', recon: 'Unreconciled', branch: 'North Branch', amount: 30000, party: 'Karan Mehta' },
    { id: '7', bankId: 'sbi', date: '2025-09-27', voucherNo: 'RV-2025-015', type: 'Receipt', desc: 'Transport Fee', account: 'Transport Fee A/c', mode: 'NEFT', chqRef: 'NEFT03', bankRef: 'SBIN77701', module: 'Transport', status: 'Pending', recon: 'Unreconciled', branch: 'South Branch', amount: 15000, party: 'Meera Patel' },
    { id: '8', bankId: 'sbi', date: '2025-09-03', voucherNo: 'PV-2025-010', type: 'Payment', desc: 'Vendor - ABC Co', account: 'Accounts Payable', mode: 'Cheque', chqRef: 'CHQ-00123', bankRef: '', module: 'Inventory', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 50000, party: 'ABC Vendors' },
    { id: '9', bankId: 'sbi', date: '2025-09-07', voucherNo: 'PV-2025-011', type: 'Payment', desc: 'Teacher Salary', account: 'Salary A/c', mode: 'NEFT', chqRef: 'NEFT-0021', bankRef: 'SBIN77012', module: 'Payroll', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 80000, party: 'Staff Batch' },
    { id: '10', bankId: 'sbi', date: '2025-09-10', voucherNo: 'PV-2025-012', type: 'Payment', desc: 'Electricity Bill', account: 'Electricity A/c', mode: 'Cheque', chqRef: 'CHQ-00124', bankRef: '', module: 'Manual', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 15000, party: 'Torrent Power' },
    { id: '11', bankId: 'sbi', date: '2025-09-20', voucherNo: 'PV-2025-013', type: 'Payment', desc: 'Equipment Purchase', account: 'Equipment A/c', mode: 'RTGS', chqRef: 'RTGS-0001', bankRef: 'SBIN77490', module: 'Inventory', status: 'Approved', recon: 'Unreconciled', branch: 'East Branch', amount: 75000, party: 'Lab Equipment Co' },
    { id: '12', bankId: 'sbi', date: '2025-09-25', voucherNo: 'PV-2025-014', type: 'Payment', desc: 'Insurance Premium', account: 'Insurance A/c', mode: 'NEFT', chqRef: 'NEFT-0022', bankRef: 'SBIN77633', module: 'Manual', status: 'Approved', recon: 'Unreconciled', branch: 'Main Campus', amount: 10000, party: 'LIC' },
    { id: '13', bankId: 'sbi', date: '2025-09-27', voucherNo: 'PV-2025-015', type: 'Payment', desc: 'Annual Maintenance', account: 'Maintenance A/c', mode: 'Cheque', chqRef: 'CHQ-00125', bankRef: '', module: 'Manual', status: 'Approved', recon: 'Unreconciled', branch: 'West Branch', amount: 20000, party: 'Annual Maint Co.' },
    { id: '14', bankId: 'hdfc', date: '2025-09-12', voucherNo: 'RV-2025-016', type: 'Receipt', desc: 'Fee - HDFC Collection', account: 'Tuition Fee A/c', mode: 'UPI', chqRef: 'UPI101', bankRef: 'HDFC22011', module: 'Fee Management', status: 'Approved', recon: 'Reconciled', branch: 'North Branch', amount: 18000, party: 'Multiple Students' },
    { id: '15', bankId: 'hdfc', date: '2025-09-22', voucherNo: 'PV-2025-016', type: 'Payment', desc: 'Bus Fuel - HDFC Corp Card', account: 'Transport A/c', mode: 'IMPS', chqRef: 'IMPS441', bankRef: 'HDFC22990', module: 'Transport', status: 'Approved', recon: 'Unreconciled', branch: 'North Branch', amount: 12000, party: 'Patel Fills' },
    { id: '16', bankId: 'pnb', date: '2025-09-30', voucherNo: 'JV-2025-090', type: 'Receipt', desc: 'FD Interest Credit', account: 'Interest A/c', mode: 'Bank Transfer', chqRef: 'INT0901', bankRef: 'PNB55120', module: 'Manual', status: 'Approved', recon: 'Reconciled', branch: 'East Branch', amount: 12500, party: 'PNB' },
  ],
  'FY 2024-25': [
    { id: '101', bankId: 'sbi', date: '2024-09-05', voucherNo: 'RV-2024-110', type: 'Receipt', desc: 'Govt Grant Q2', account: 'Grant A/c', mode: 'NEFT', chqRef: 'NEFT11', bankRef: 'SBIN55101', module: 'Manual', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 150000, party: 'Education Dept.' },
    { id: '102', bankId: 'sbi', date: '2024-09-15', voucherNo: 'PV-2024-110', type: 'Payment', desc: 'Teacher Salary', account: 'Salary A/c', mode: 'NEFT', chqRef: 'NEFT-0041', bankRef: 'SBIN55210', module: 'Payroll', status: 'Approved', recon: 'Reconciled', branch: 'Main Campus', amount: 75000, party: 'Staff Batch' },
    { id: '103', bankId: 'hdfc', date: '2024-09-20', voucherNo: 'RV-2024-111', type: 'Receipt', desc: 'Fee Collection', account: 'Tuition Fee A/c', mode: 'UPI', chqRef: 'UPI201', bankRef: 'HDFC41002', module: 'Fee Management', status: 'Approved', recon: 'Reconciled', branch: 'North Branch', amount: 22000, party: 'Multiple Students' },
  ],
};

const INITIAL_CHEQUES: Cheque[] = [
  { id: 'c1', chqNo: 'CHQ-00123', date: '2025-09-01', party: 'ABC Vendors', amount: 50000, chqDate: '2025-09-01', clearDate: '2025-09-04', status: 'Cleared' },
  { id: 'c2', chqNo: 'CHQ-00124', date: '2025-09-03', party: 'Electricity Dept', amount: 15000, chqDate: '2025-09-03', clearDate: '2025-09-06', status: 'Cleared' },
  { id: 'c3', chqNo: 'CHQ-00125', date: '2025-09-27', party: 'Annual Maint Co.', amount: 20000, chqDate: '2025-09-27', clearDate: '', status: 'Pending' },
  { id: 'c4', chqNo: 'CHQ-00126', date: '2025-09-27', party: 'Lab Equipment Co', amount: 35000, chqDate: '2025-09-30', clearDate: '', status: 'Pending' },
  { id: 'c5', chqNo: 'CHQ-00127', date: '2025-09-25', party: 'Transport Vendor', amount: 12000, chqDate: '2025-09-25', clearDate: '', status: 'Bounced' },
];

// ───────────────────────────── Main Page ─────────────────────────────
export function BankBook() {
  const [fy, setFy] = useState('FY 2025-26');
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [selected, setSelected] = useState<string>('all');
  const [branch, setBranch] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [type, setType] = useState('All');
  const [mode, setMode] = useState('All');
  const [status, setStatus] = useState('All');
  const [recon, setRecon] = useState('All');
  const [applied, setApplied] = useState(false);
  const [entries, setEntries] = useState<BankTxn[]>(BANK_DATA['FY 2025-26']);
  const [cheques, setCheques] = useState<Cheque[]>(INITIAL_CHEQUES);
  const [viewEntry, setViewEntry] = useState<BankTxn | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showRecon, setShowRecon] = useState(false);
  const [showUnrec, setShowUnrec] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [viewCheque, setViewCheque] = useState<Cheque | null>(null);
  const [toast, setToast] = useState('');

  const [nb, setNb] = useState({ bank: '', acctType: 'Current A/c', masked: '', branch: 'Main Campus', opening: '' });
  const [n, setN] = useState({ type: 'Receipt' as 'Receipt' | 'Payment', date: '2025-09-27', mode: 'NEFT', chqRef: '', chqDate: '', bankRef: '', account: '', amount: '', party: '', desc: '' });
  const [nBankId, setNBankId] = useState('sbi');
  const [rc, setRc] = useState({ stmt: 320000, deposits: 10000, outstanding: 5000, charges: 500, interest: 1500 });

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const changeFy = (v: string) => {
    setFy(v); setEntries(BANK_DATA[v] || []); setApplied(false);
    setDateFrom(`${v.slice(3, 7)}-09-01`);
    setDateTo(`${v.slice(3, 7)}-09-30`);
    showToast(`Bank Book loaded for ${v}.`);
  };

  const visibleAccounts = accounts.filter((a) => branch === 'All' || a.branch === branch);
  const selOpenings = visibleAccounts.filter((a) => selected === 'all' || a.id === selected)
    .reduce((s, a) => s + a.opening, 0);

  const filtered = useMemo(() => entries.filter((e) => {
    if (branch !== 'All' && e.branch !== branch) return false;
    if (selected !== 'all' && e.bankId !== selected) return false;
    if (type === 'Contra (Bank to Cash)') { if (!e.desc.toLowerCase().includes('contra')) return false; }
    else if (type !== 'All' && e.type !== type) return false;
    if (applied) {
      if (search) {
        const q = search.toLowerCase();
        if (![e.voucherNo, e.chqRef, e.bankRef, e.desc, e.party, String(e.amount)].some((f) => f.toLowerCase().includes(q))) return false;
      }
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (mode !== 'All' && e.mode !== mode) return false;
      if (status !== 'All' && e.status !== status) return false;
      if (recon !== 'All' && e.recon !== recon) return false;
    }
    return true;
  }), [entries, branch, selected, type, applied, search, dateFrom, dateTo, mode, status, recon]);

  const receiptsList = filtered.filter((e) => e.type === 'Receipt');
  const paymentsList = filtered.filter((e) => e.type === 'Payment');
  const totalReceipts = receiptsList.reduce((s, e) => s + e.amount, 0);
  const totalPayments = paymentsList.reduce((s, e) => s + e.amount, 0);
  const closing = selOpenings + totalReceipts - totalPayments;
  const totalDr = selOpenings + totalReceipts;
  const totalCr = totalPayments + closing;
  const pendingRecon = filtered.filter((e) => e.recon === 'Unreconciled').length;
  const bounced = cheques.filter((c) => c.status === 'Bounced').length;

  const selectedLabel = selected === 'all'
    ? 'All Accounts'
    : `${accounts.find((a) => a.id === selected)?.bank || ''} — ${accounts.find((a) => a.id === selected)?.acctType || ''}`;

  const adjusted = rc.stmt + rc.deposits - rc.outstanding + rc.charges + rc.interest;
  const reconDiff = adjusted - closing;
  const reconStatus = reconDiff === 0 ? '🟢 Fully Reconciled' : Math.abs(reconDiff) <= 5000 ? '🟡 Partially Reconciled' : '🔴 Not Reconciled';

  const applyFilters = () => { setApplied(true); showToast('Filters applied.'); };
  const resetFilters = () => {
    setSearch(''); setType('All'); setMode('All');  setStatus('All'); setRecon('All'); setBranch('All'); setApplied(false);
    setDateFrom(`${fy.slice(3, 7)}-09-01`);
    setDateTo(`${fy.slice(3, 7)}-09-30`);
  };
  const deleteEntry = (e: BankTxn) => {
    if (window.confirm(`Delete voucher ${e.voucherNo} permanently?`)) {
      setEntries(entries.filter((x) => x.id !== e.id));
      showToast(`Voucher ${e.voucherNo} deleted.`);
    }
  };
  const doExport = (kind: string) => {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Side,Date,Voucher No,Description,Account,Mode,Chq/Ref No,Bank Ref,Branch,Status,Reconciliation,Amount\n';
    const rows = [
      ...receiptsList.map((e) => ['Receipt', e.date, e.voucherNo, `"${e.desc}"`, `"${e.account}"`, e.mode, e.chqRef, e.bankRef, `"${e.branch}"`, e.status, e.recon, e.amount].join(',')),
      ...paymentsList.map((e) => ['Payment', e.date, e.voucherNo, `"${e.desc}"`, `"${e.account}"`, e.mode, e.chqRef, e.bankRef, `"${e.branch}"`, e.status, e.recon, e.amount].join(',')),
    ].join('\n');
    const blob = new Blob([header + rows], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bank-book-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} entries as ${kind.toUpperCase()}.`);
  };
  const submitBankEntry = (draft: boolean) => {
    const amt = parseFloat(n.amount) || 0;
    if (!n.account || !amt || !n.desc.trim()) { showToast('Account, Amount and Description are required.'); return; }
    const bankId = nBankId;
    const acc = accounts.find((a) => a.id === bankId)!;
    const prefix = n.type === 'Receipt' ? 'RV' : 'PV';
    const voucherNo = `${prefix}-2025-${String(entries.filter((e) => e.voucherNo.startsWith(prefix)).length + 1).padStart(3, '0')}`;
    setEntries([...entries, {
      id: String(Date.now()), bankId, date: n.date, voucherNo, type: n.type,
      desc: n.desc, account: n.account, mode: n.mode, chqRef: n.chqRef || '—', bankRef: n.bankRef,
      module: 'Manual', status: 'Pending', recon: 'Unreconciled',
      branch: branch === 'All' ? acc.branch : branch, amount: amt, party: n.party || '—',
    }]);
    setShowNew(false);
    setN({ ...n, chqRef: '', chqDate: '', bankRef: '', account: '', amount: '', party: '', desc: '' });
    showToast(`${voucherNo} ${draft ? 'saved as draft' : 'submitted for approval'}.`);
  };
  const addBankAccount = () => {
    if (!nb.bank.trim() || !nb.masked.trim()) { showToast('Bank name and account number are required.'); return; }
    const id = nb.bank.toLowerCase() + Date.now();
    setAccounts([...accounts, { id, bank: nb.bank, acctType: nb.acctType, masked: nb.masked, opening: parseFloat(nb.opening) || 0, branch: nb.branch }]);
    setShowAddBank(false);
    setNb({ bank: '', acctType: 'Current A/c', masked: '', branch: 'Main Campus', opening: '' });
    showToast(`Bank account added (${nb.bank} — ${nb.masked}, ${nb.branch}).`);
  };
  const markReconciled = () => {
    const nBefore = entries.filter((e) => e.recon === 'Unreconciled' && filtered.some((f) => f.id === e.id)).length;
    setEntries(entries.map((e) => (filtered.some((f) => f.id === e.id) && e.recon === 'Unreconciled' ? { ...e, recon: 'Reconciled' } : e)));
    setShowUnrec(false); setShowRecon(false);
    showToast(`${nBefore} item(s) marked as reconciled.`);
  };
  const updateChequeStatus = (c: Cheque, s: Cheque['status']) => {
    setCheques(cheques.map((x) => (x.id === c.id ? { ...x, status: s, clearDate: s === 'Cleared' ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : x.clearDate } : x)));
    showToast(`Cheque ${c.chqNo} marked ${s}.`);
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const statusBadge = (s: string) =>
    s === 'Approved' ? <Badge variant="success">Approved</Badge>
      : s === 'Pending' ? <Badge variant="warning">Pending</Badge>
        : s === 'Rejected' ? <Badge variant="danger">Rejected</Badge>
          : <Badge variant="info">Reversed</Badge>;
  const reconBadge = (r: string) =>
    r === 'Reconciled' ? <Badge variant="success">Reconciled</Badge> : <Badge variant="warning">Unreconciled</Badge>;
  const chqBadge = (s: string) =>
    s === 'Cleared' ? <Badge variant="success">✅ Cleared</Badge>
      : s === 'Pending' ? <Badge variant="warning">⏳ Pending</Badge>
        : s === 'Bounced' ? <Badge variant="danger">❌ Bounced</Badge>
          : <Badge variant="secondary">🚫 Cancelled</Badge>;

  type Totals = { opening: number | null; dr: number; pay: number; closing: number; cr: number };
  const SideTable = ({ list, side, t, showBranch }: { list: BankTxn[]; side: 'dr' | 'cr'; t: Totals; showBranch: boolean }) => (
    <div className="min-w-0">
      <div className={`px-4 py-2.5 font-bold text-sm border-b-2 ${side === 'dr' ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
        {side === 'dr' ? '📥 RECEIPTS (Dr) — Money IN' : '📤 PAYMENTS (Cr) — Money OUT'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 font-semibold uppercase text-xs">#</th>
              <th className="px-2 py-2 font-semibold uppercase text-xs">Date</th>
              <th className="px-2 py-2 font-semibold uppercase text-xs">Voucher</th>
              <th className="px-2 py-2 font-semibold uppercase text-xs">Description</th>
              <th className="px-2 py-2 font-semibold uppercase text-xs">Chq/Ref</th>
              {showBranch && <th className="px-2 py-2 font-semibold uppercase text-xs">Branch</th>}
              <th className="px-2 py-2 font-semibold uppercase text-xs text-right">Amount</th>
              <th className="px-2 py-2 font-semibold uppercase text-xs text-center">Act.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {side === 'dr' && t.opening !== null && (
              <tr className="bg-blue-50/60 font-semibold">
                <td /><td /><td /><td className="px-2 py-2">Opening Balance</td><td />{showBranch && <td />}
                <td className="px-2 py-2 text-right">{t.opening.toLocaleString('en-IN')}</td><td />
              </tr>
            )}
            {list.map((e, i) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-gray-500 text-xs">{i + 1}</td>
                <td className="px-2 py-2 text-gray-600 whitespace-nowrap">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td className="px-2 py-2 font-mono text-xs font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setViewEntry(e)}>{e.voucherNo}</td>
                <td className="px-2 py-2 text-gray-800 max-w-[130px] truncate" title={`${e.desc} — ${e.party}`}>{e.desc}</td>
                <td className="px-2 py-2 font-mono text-xs text-gray-600">{e.chqRef}</td>
                {showBranch && <td className="px-2 py-2 text-gray-600 whitespace-nowrap text-xs">{e.branch}</td>}
                <td className={`px-2 py-2 text-right font-medium ${side === 'dr' ? 'text-green-700' : 'text-red-600'}`}>{e.amount.toLocaleString('en-IN')}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-0.5">
                    <Button variant="ghost" size="sm" title="View" onClick={() => setViewEntry(e)}><Eye className="w-4 h-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteEntry(e)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={showBranch ? 8 : 7} className="px-3 py-6 text-center text-gray-400 text-xs">No {side === 'dr' ? 'receipts' : 'payments'} match.</td></tr>}
          </tbody>
          <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold text-sm">
            <tr>
              <td colSpan={showBranch ? 6 : 5} className="px-2 py-2 text-right">{side === 'dr' ? 'TOTAL (Dr)' : 'TOTAL (Cr)'}</td>
              <td className="px-2 py-2 text-right">{(side === 'dr' ? t.dr : t.pay).toLocaleString('en-IN')}</td>
              <td />
            </tr>
            {side === 'cr' && t.opening !== null && (
              <tr className="bg-blue-50">
                <td colSpan={showBranch ? 6 : 5} className="px-2 py-2 text-right">CLOSING BALANCE (Bal.)</td>
                <td className="px-2 py-2 text-right text-blue-700">{t.closing.toLocaleString('en-IN')}</td>
                <td />
              </tr>
            )}
            {t.opening !== null ? (
              <tr className="bg-gray-200">
                <td colSpan={showBranch ? 6 : 5} className="px-2 py-2 text-right">GRAND TOTAL</td>
                <td className="px-2 py-2 text-right">{(side === 'dr' ? t.dr : t.cr).toLocaleString('en-IN')}</td>
                <td />
              </tr>
            ) : side === 'cr' && (
              <tr className="bg-blue-50">
                <td colSpan={5} className="px-2 py-2 text-right">NET MOVEMENT (Receipts − Payments)</td>
                <td className={`px-2 py-2 text-right ${t.dr - t.pay < 0 ? 'text-red-600' : 'text-blue-700'}`}>{t.dr - t.pay < 0 ? '−' : '+'}{Math.abs(t.dr - t.pay).toLocaleString('en-IN')}</td>
                <td />
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="w-7 h-7 text-blue-600" /> Bank Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">Bank-wise ledger with reconciliation &amp; cheque tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select value={fy} onChange={(e) => changeFy(e.target.value)} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
          </div>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {toast}</span>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Bank Account Selector Cards ── */}
      <Card className="p-5" title="🏦 Select Bank Account">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <button onClick={() => { setSelected('all'); showToast('Showing all bank accounts combined.'); }}
            className={`rounded-xl border-2 p-4 text-left transition-all ${selected === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
            <p className="font-bold text-gray-900 text-sm">📚 All Accounts</p>
            <p className="text-xs text-gray-500 mt-1">Combined view</p>
            <p className="text-sm font-bold text-gray-900 mt-2">{fmt(accounts.filter((a) => branch === 'All' || a.branch === branch).reduce((s, a) => s + a.opening, 0))}</p>
            <Badge variant={selected === 'all' ? 'primary' : 'outline'} className="mt-2">{selected === 'all' ? '🔵 SELECTED' : 'SELECT'}</Badge>
          </button>
          {visibleAccounts.map((a) => (
            <button key={a.id} onClick={() => { setSelected(a.id); showToast(`Viewing ${a.bank} ${a.acctType}.`); }}
              className={`rounded-xl border-2 p-4 text-left transition-all ${selected === a.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
              <p className="font-bold text-gray-900 text-sm">{a.fd ? '🔵' : '🟢'} {a.bank} — {a.acctType}</p>
              <p className="text-xs text-gray-500 mt-1">A/c: {a.masked} · {a.branch}</p>
              <p className="text-sm font-bold text-gray-900 mt-2">{fmt(a.opening)}</p>
              <Badge variant={selected === a.id ? 'primary' : 'outline'} className="mt-2">{selected === a.id ? '🔵 SELECTED' : 'SELECT'}</Badge>
            </button>
          ))}
          <button onClick={() => setShowAddBank(true)}
            className="rounded-xl border-2 border-dashed border-gray-300 p-4 text-left hover:border-blue-400 transition-all">
            <p className="font-bold text-blue-600 text-sm">➕ Add Bank Account</p>
            <p className="text-xs text-gray-400 mt-1">Register a new bank account</p>
          </button>
        </div>
      </Card>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Wallet2Icon, label: 'Opening Bank Balance', value: fmt(selOpenings), color: 'bg-blue-50 text-blue-600' },
          { icon: ArrowDownToLine, label: 'Total Bank Receipts', value: fmt(totalReceipts), color: 'bg-emerald-50 text-emerald-600' },
          { icon: ArrowUpFromLine, label: 'Total Bank Payments', value: fmt(totalPayments), color: 'bg-amber-50 text-amber-600' },
          { icon: Scale, label: 'Closing Bank Balance', value: fmt(closing), chip: closing > 100000 ? '🟢 Healthy' : closing > 0 ? '🟡 Low' : '🔴 Overdrawn', color: 'bg-teal-50 text-teal-600' },
          { icon: RefreshCw, label: 'Pending Reconciliation', value: `${pendingRecon} Items`, chip: pendingRecon > 0 ? '⚠️ Action' : '🟢 Clear', color: 'bg-violet-50 text-violet-600' },
          { icon: AlertTriangle, label: 'Cheque Bounce Alert', value: `${bounced} Bounced`, chip: bounced === 0 ? '🟢 Clear' : '🔴 Action', color: 'bg-red-50 text-red-600' },
        ].map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${c.color}`}><c.icon className="w-5 h-5" /></div>
              {c.chip && <span className="text-[10px] font-bold text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{c.chip}</span>}
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">{c.label}</p>
            <p className="text-base font-bold text-gray-900 mt-0.5 truncate">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Filters ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Input label="Search" placeholder="Voucher, cheque no., bank ref, party, amount..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <Select label="Transaction Type" value={type} onChange={(e) => setType(e.target.value)} options={TYPES.map((v) => ({ value: v, label: v }))} />
          <Select label="Payment Mode" value={mode} onChange={(e) => setMode(e.target.value)} options={MODES.map((v) => ({ value: v, label: v }))} />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES.map((v) => ({ value: v, label: v }))} />
          <Select label="Reconciliation" value={recon} onChange={(e) => setRecon(e.target.value)} options={RECONS.map((v) => ({ value: v, label: v }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={applyFilters}><Search className="w-4 h-4 mr-2" /> Search</Button>
            <Button variant="outline" onClick={resetFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
            <Button variant="secondary" onClick={() => { setNBankId(selected === 'all' ? 'sbi' : selected); setShowNew(true); }}><Plus className="w-4 h-4 mr-2" /> New Bank Entry</Button>
            <Button variant="outline" onClick={() => setShowRecon(true)}>🔄 Reconcile</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
            <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>
      </Card>

      {/* ── T-Format Table (List / Branch-wise) ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">🏦 Bank Book — {selectedLabel} — {fy}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Branch: {branch === 'All' ? 'All Branches (Consolidated)' : branch}</p>
          </div>
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
            {([['list', 'List View', ClipboardList], ['branch', 'Branch-wise View', Building2]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => setViewMode(k)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${viewMode === k ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <SideTable list={receiptsList} side="dr" t={{ opening: selOpenings, dr: totalDr, pay: totalPayments, closing, cr: totalCr }} showBranch />
            <SideTable list={paymentsList} side="cr" t={{ opening: selOpenings, dr: totalDr, pay: totalPayments, closing, cr: totalCr }} showBranch />
          </div>
        ) : (
          <div className="p-4 space-y-4 bg-gray-50/60">
            <p className="text-xs text-gray-500">ℹ️ Bank balances are held per bank account (see the account cards &amp; Bank Balance Summary). Each branch section shows that branch&apos;s bank receipts, payments and net movement.</p>
            {(branch === 'All' ? BRANCHES.slice(1) : [branch]).map((b) => {
              const rows = filtered.filter((e) => e.branch === b);
              const rec = rows.filter((e) => e.type === 'Receipt');
              const pay = rows.filter((e) => e.type === 'Payment');
              const t = { opening: null, dr: rec.reduce((x, e) => x + e.amount, 0), pay: pay.reduce((x, e) => x + e.amount, 0), closing: 0, cr: 0 };
              return (
                <div key={b} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> {b}</span>
                    <span className="text-xs text-gray-600 flex flex-wrap gap-3">
                      <span>{rows.length} transactions</span>
                      <span>Receipts <b className="text-green-700">{fmt(t.dr)}</b></span>
                      <span>Payments <b className="text-red-600">{fmt(t.pay)}</b></span>
                      <span>Net <b className={t.dr - t.pay < 0 ? 'text-red-600' : 'text-blue-700'}>{t.dr - t.pay < 0 ? '−' : '+'}{fmt(Math.abs(t.dr - t.pay))}</b></span>
                      <span>Unreconciled <b className="text-amber-600">{rows.filter((e) => e.recon === 'Unreconciled').length}</b></span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    <SideTable list={rec} side="dr" t={t} showBranch={false} />
                    <SideTable list={pay} side="cr" t={t} showBranch={false} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Closing Balance Summary ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50/40">
          <h3 className="font-bold text-gray-900">🏦 Bank Balance Summary — {selectedLabel}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">💰 Opening Bank Balance</span><b>{fmt(selOpenings)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">📥 Add: Total Bank Receipts</span><b className="text-green-600">+{fmt(totalReceipts)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">📤 Less: Total Bank Payments</span><b className="text-red-500">−{fmt(totalPayments)}</b></div>
            <div className="flex justify-between bg-green-50 rounded-lg px-3 py-2.5"><span className="font-bold text-green-800">🏦 Closing Book Balance</span><b className="text-green-800">{fmt(closing)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-2 pt-2"><span className="text-gray-500">🏦 Bank Statement Balance</span><b>{fmt(rc.stmt)}</b></div>
            <div className="flex justify-between"><span className={`font-medium ${closing - rc.stmt === 0 ? 'text-green-700' : 'text-amber-700'}`}>⚠️ Difference (Unreconciled)</span><b>{fmt(closing - rc.stmt)}</b></div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-800 mb-2">🔄 Reconciliation Status</p>
            <p className="text-2xl font-bold mb-2">{reconStatus}</p>
            <p className="text-xs text-gray-500 mb-3">Adjusted bank balance {fmt(adjusted)} vs book balance {fmt(closing)} — difference {fmt(reconDiff)}.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowUnrec(true)}>📋 View Unreconciled Items</Button>
              <Button variant="primary" size="sm" onClick={() => setShowRecon(true)}>Open Reconciliation</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Cheque Tracker ── */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">📋 Cheque Tracker</h3>
          <Badge variant="info">{cheques.length} cheques</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 font-semibold uppercase text-xs">#</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Cheque No.</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Issued On</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Issued To</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-right">Amount</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Cheque Date</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs">Clearance Date</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-center">Status</th>
                <th className="px-3 py-3 font-semibold uppercase text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cheques.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-500 text-xs">{i + 1}</td>
                  <td className="px-3 py-2.5 font-mono text-xs font-semibold text-blue-600">{c.chqNo}</td>
                  <td className="px-3 py-2.5 text-gray-600">{new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td className="px-3 py-2.5 text-gray-800">{c.party}</td>
                  <td className="px-3 py-2.5 text-right font-medium">{c.amount.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-gray-600">{new Date(c.chqDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td className="px-3 py-2.5 text-gray-600">{c.clearDate || '—'}</td>
                  <td className="px-3 py-2.5 text-center">{chqBadge(c.status)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" title="View" onClick={() => setViewCheque(c)}><Eye className="w-4 h-4 text-gray-500" /></Button>
                      {c.status !== 'Cleared' && <Button variant="ghost" size="sm" title="Mark Cleared" onClick={() => updateChequeStatus(c, 'Cleared')}><CheckCircle className="w-4 h-4 text-green-500" /></Button>}
                      {c.status !== 'Bounced' && <Button variant="ghost" size="sm" title="Mark Bounced" onClick={() => updateChequeStatus(c, 'Bounced')}><AlertTriangle className="w-4 h-4 text-amber-500" /></Button>}
                      {c.status !== 'Cancelled' && <Button variant="ghost" size="sm" title="Cancel Cheque" onClick={() => updateChequeStatus(c, 'Cancelled')}><X className="w-4 h-4 text-red-500" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Generated on: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Sharma (Accountant) · {fy} · {selectedLabel} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>EduManager School ERP · © 2026</span>
      </div>

      {/* ── View Entry Modal ── */}
      {viewEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Bank Voucher {viewEntry.voucherNo}</h3>
              <button onClick={() => setViewEntry(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {([
                ['Type', viewEntry.type === 'Receipt' ? '📥 Bank Receipt' : '📤 Bank Payment'],
                ['Bank Account', `${accounts.find((a) => a.id === viewEntry.bankId)?.bank} — ${accounts.find((a) => a.id === viewEntry.bankId)?.acctType}`],
                ['Date', new Date(viewEntry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Payment Mode', viewEntry.mode],
                ['Cheque / Ref No.', viewEntry.chqRef],
                ['Bank Ref No.', viewEntry.bankRef || '—'],
                ['Account', viewEntry.account],
                [viewEntry.type === 'Receipt' ? 'Received From' : 'Paid To', viewEntry.party],
                ['Amount', fmt(viewEntry.amount)],
                ['Branch', viewEntry.branch],
                ['Module', viewEntry.module],
                ['Reconciliation', viewEntry.recon],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900">{v}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-gray-500">Status</span>{statusBadge(viewEntry.status)}</div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="primary" onClick={() => setViewEntry(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Bank Entry Modal ── */}
      {showNew && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-600" /> New Bank Transaction Entry</h3>
              <button onClick={() => setShowNew(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex gap-4">
                  {(['Receipt', 'Payment'] as const).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="nbType" checked={n.type === t} onChange={() => setN({ ...n, type: t })} className="text-blue-600 focus:ring-blue-500" />
                      {t === 'Receipt' ? '🔵 Bank Receipt' : '⚪ Bank Payment'}
                    </label>
                  ))}
                </div>
              </div>
              <Select label="Bank Account" value={nBankId} onChange={(e) => setNBankId(e.target.value)} options={accounts.map((a) => ({ value: a.id, label: `${a.bank} — ${a.acctType}` }))} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={n.date} onChange={(e) => setN({ ...n, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <Select label="Payment Mode" value={n.mode} onChange={(e) => setN({ ...n, mode: e.target.value })} options={['Cheque', 'NEFT', 'RTGS', 'UPI', 'IMPS', 'DD'].map((v) => ({ value: v, label: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Cheque / Ref No." value={n.chqRef} onChange={(e) => setN({ ...n, chqRef: e.target.value })} placeholder="CHQ-00126" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date</label>
                  <input type="date" value={n.chqDate} onChange={(e) => setN({ ...n, chqDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <Input label="Bank Ref No." value={n.bankRef} onChange={(e) => setN({ ...n, bankRef: e.target.value })} placeholder="Bank's reference number" />
              <Select label="Account" value={n.account} onChange={(e) => setN({ ...n, account: e.target.value })}
                options={[{ value: '', label: 'Select account...' }, ...['Tuition Fee A/c', 'Grant A/c', 'Donation A/c', 'Salary A/c', 'Electricity A/c', 'Maintenance A/c', 'Equipment A/c', 'Insurance A/c', 'Accounts Payable'].map((v) => ({ value: v, label: v }))]} />
              <Input label="Amount (₹)" type="number" value={n.amount} onChange={(e) => setN({ ...n, amount: e.target.value })} placeholder="0" />
              <Input label={n.type === 'Receipt' ? 'Received From' : 'Paid To'} value={n.party} onChange={(e) => setN({ ...n, party: e.target.value })} placeholder="Party name" />
              <Input label="Description" value={n.desc} onChange={(e) => setN({ ...n, desc: e.target.value })} placeholder="Purpose of the transaction" />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => submitBankEntry(true)}>Save Draft</Button>
              <Button variant="primary" onClick={() => submitBankEntry(false)}>Submit for Approval</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Bank Account Modal ── */}
      {showAddBank && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Building className="w-5 h-5 text-blue-600" /> Add Bank Account</h3>
              <button onClick={() => setShowAddBank(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Bank Name *" value={nb.bank} onChange={(e) => setNb({ ...nb, bank: e.target.value })} placeholder="e.g. Axis Bank" />
              <Select label="Account Type" value={nb.acctType} onChange={(e) => setNb({ ...nb, acctType: e.target.value })} options={['Current A/c', 'Savings A/c', 'FD Account', 'Overdraft A/c'].map((v) => ({ value: v, label: v }))} />
              <Input label="Account Number (masked) *" value={nb.masked} onChange={(e) => setNb({ ...nb, masked: e.target.value })} placeholder="XXXX 9999" />
              <Select label="Branch" value={nb.branch} onChange={(e) => setNb({ ...nb, branch: e.target.value })} options={BRANCHES.slice(1).map((v) => ({ value: v, label: v }))} />
              <Input label="Opening Balance (₹)" type="number" value={nb.opening} onChange={(e) => setNb({ ...nb, opening: e.target.value })} placeholder="0" />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowAddBank(false)}>Cancel</Button>
              <Button variant="primary" onClick={addBankAccount}>Add Account</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reconciliation Modal ── */}
      {showRecon && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /> Bank Reconciliation — {selectedLabel}</h3>
              <button onClick={() => setShowRecon(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400">Statement Date: {new Date(dateTo || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <Input label="Balance as per Bank Statement (₹)" type="number" value={rc.stmt} onChange={(e) => setRc({ ...rc, stmt: parseFloat(e.target.value) || 0 })} />
              <Input label="Add: Deposits in Transit (₹)" type="number" value={rc.deposits} onChange={(e) => setRc({ ...rc, deposits: parseFloat(e.target.value) || 0 })} />
              <Input label="Less: Outstanding Cheques (₹)" type="number" value={rc.outstanding} onChange={(e) => setRc({ ...rc, outstanding: parseFloat(e.target.value) || 0 })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Add: Bank Charges (₹)" type="number" value={rc.charges} onChange={(e) => setRc({ ...rc, charges: parseFloat(e.target.value) || 0 })} />
                <Input label="Add: Bank Interest (₹)" type="number" value={rc.interest} onChange={(e) => setRc({ ...rc, interest: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Adjusted Bank Balance</span><b>{fmt(adjusted)}</b></div>
                <div className="flex justify-between"><span className="text-gray-500">Balance as per Books</span><b>{fmt(closing)}</b></div>
                <div className={`flex justify-between pt-1 border-t border-gray-200 ${reconDiff === 0 ? 'text-green-700' : 'text-amber-700'}`}>
                  <span className="font-medium">Difference</span><b>{fmt(reconDiff)} {reconDiff === 0 ? '✅' : '⚠️ Investigate'}</b>
                </div>
                <p className="text-xs font-medium pt-1">Status: {reconStatus}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowRecon(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => { setShowRecon(false); setShowUnrec(true); }}>View Unreconciled Items</Button>
              <Button variant="primary" onClick={markReconciled}>Mark as Reconciled</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unreconciled Items Modal ── */}
      {showUnrec && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">📋 Unreconciled Items ({pendingRecon})</h3>
              <button onClick={() => setShowUnrec(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Date</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Voucher</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Description</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Branch</th>
                    <th className="px-3 py-2 text-right text-xs uppercase font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.filter((e) => e.recon === 'Unreconciled').map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-3 py-2 font-mono text-xs text-blue-600">{e.voucherNo}</td>
                      <td className="px-3 py-2 text-gray-800">{e.desc}</td>
                      <td className="px-3 py-2 text-gray-600">{e.branch}</td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(e.amount)}</td>
                    </tr>
                  ))}
                  {pendingRecon === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">All items reconciled. 🎉</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowUnrec(false)}>Close</Button>
              <Button variant="primary" onClick={markReconciled} disabled={pendingRecon === 0}>Mark as Reconciled</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cheque View Modal ── */}
      {viewCheque && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Cheque {viewCheque.chqNo}</h3>
              <button onClick={() => setViewCheque(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {([
                ['Issued To', viewCheque.party],
                ['Amount', fmt(viewCheque.amount)],
                ['Date Issued', new Date(viewCheque.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Cheque Date', new Date(viewCheque.chqDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Clearance Date', viewCheque.clearDate || 'Not cleared yet'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900">{v}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-gray-500">Status</span>{chqBadge(viewCheque.status)}</div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
              <Button variant="primary" onClick={() => setViewCheque(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Wallet2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <rect x="13" y="9" width="8" height="6" rx="1" />
    </svg>
  );
}
