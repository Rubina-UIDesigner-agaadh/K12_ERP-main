import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Plus, Printer, FileText, FileSpreadsheet, Eye, Trash2, Wallet,
  ArrowDownToLine, ArrowUpFromLine, Scale, AlertTriangle, X, CheckCircle, Paperclip, ClipboardList, Building2,
} from 'lucide-react';

// ───────────────────────────── Types & Data ─────────────────────────────
interface CashTxn {
  id: string; date: string; voucherNo: string;
  type: 'Receipt' | 'Payment';
  desc: string; account: string; category: string; module: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Reversed';
  branch: string; amount: number; party: string; petty?: boolean;
}

const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const TYPES = ['All', 'Receipt', 'Payment', 'Petty Cash', 'Contra (Cash to Bank)'];
const CATEGORIES = ['All', 'Fee Collection', 'Salary', 'Utility', 'Maintenance', 'Purchase', 'Misc.'];
const STATUSES = ['All', 'Approved', 'Pending', 'Rejected', 'Reversed'];
const OPENING_CASH = 50000;
const BRANCH_WEIGHT: Record<string, number> = { 'Main Campus': 0.40, 'North Branch': 0.18, 'South Branch': 0.16, 'East Branch': 0.14, 'West Branch': 0.12 };
const openingFor = (b: string) => (b === 'All' ? OPENING_CASH : Math.round(OPENING_CASH * (BRANCH_WEIGHT[b] || 0)));
const PETTY_LIMIT = 10000;

const CASH_DATA: Record<string, CashTxn[]> = {
  'FY 2025-26': [
    { id: '1', date: '2025-09-01', voucherNo: 'RV-2025-001', type: 'Receipt', desc: 'Fee - Rahul X-A', account: 'Tuition Fee A/c', category: 'Fee Collection', module: 'Fee Management', status: 'Approved', branch: 'Main Campus', amount: 15000, party: 'Rahul Kumar' },
    { id: '2', date: '2025-09-01', voucherNo: 'RV-2025-002', type: 'Receipt', desc: 'Fee - Priya IX', account: 'Tuition Fee A/c', category: 'Fee Collection', module: 'Fee Management', status: 'Approved', branch: 'North Branch', amount: 12000, party: 'Priya Singh' },
    { id: '3', date: '2025-09-03', voucherNo: 'RV-2025-003', type: 'Receipt', desc: 'Library Fine', account: 'Library Fine A/c', category: 'Misc.', module: 'Library', status: 'Approved', branch: 'East Branch', amount: 200, party: 'Amit Verma' },
    { id: '4', date: '2025-09-05', voucherNo: 'RV-2025-004', type: 'Receipt', desc: 'Exam Fee', account: 'Exam Fee A/c', category: 'Fee Collection', module: 'Fee Management', status: 'Approved', branch: 'Main Campus', amount: 5000, party: 'Batch X-A' },
    { id: '5', date: '2025-09-10', voucherNo: 'RV-2025-005', type: 'Receipt', desc: 'Transport Fee', account: 'Transport Fee A/c', category: 'Fee Collection', module: 'Transport', status: 'Approved', branch: 'South Branch', amount: 3000, party: 'Meera Patel' },
    { id: '6', date: '2025-09-15', voucherNo: 'RV-2025-006', type: 'Receipt', desc: 'Donation Received', account: 'Donation A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'Main Campus', amount: 2000, party: 'Alumni Assoc.' },
    { id: '7', date: '2025-09-20', voucherNo: 'RV-2025-007', type: 'Receipt', desc: 'Hostel Fee', account: 'Hostel Fee A/c', category: 'Fee Collection', module: 'Fee Management', status: 'Approved', branch: 'North Branch', amount: 8000, party: 'Karan Mehta' },
    { id: '8', date: '2025-09-25', voucherNo: 'RV-2025-008', type: 'Receipt', desc: 'Misc. Income', account: 'Misc. Income A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'West Branch', amount: 1300, party: '—' },
    { id: '9', date: '2025-09-02', voucherNo: 'PV-2025-001', type: 'Payment', desc: 'Electricity Bill', account: 'Electricity A/c', category: 'Utility', module: 'Manual', status: 'Approved', branch: 'Main Campus', amount: 8000, party: 'Torrent Power' },
    { id: '10', date: '2025-09-05', voucherNo: 'PV-2025-002', type: 'Payment', desc: 'Stationery Purchase', account: 'Stationery A/c', category: 'Purchase', module: 'Manual', status: 'Approved', branch: 'South Branch', amount: 3500, party: 'Shree Books' },
    { id: '11', date: '2025-09-10', voucherNo: 'PV-2025-003', type: 'Payment', desc: 'Petty Cash Expense', account: 'Petty Cash A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'Main Campus', amount: 1200, party: 'Front Office', petty: true },
    { id: '12', date: '2025-09-15', voucherNo: 'PV-2025-004', type: 'Payment', desc: 'Courier Charges', account: 'Courier A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'East Branch', amount: 300, party: 'DTDC', petty: true },
    { id: '13', date: '2025-09-20', voucherNo: 'CV-2025-001', type: 'Payment', desc: 'Cash to Bank (Contra)', account: 'Bank A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'Main Campus', amount: 20000, party: '—' },
    { id: '14', date: '2025-09-25', voucherNo: 'PV-2025-005', type: 'Payment', desc: 'Maintenance Work', account: 'Maintenance A/c', category: 'Maintenance', module: 'Manual', status: 'Approved', branch: 'West Branch', amount: 5000, party: 'Ravi Contractor' },
  ],
  'FY 2024-25': [
    { id: '101', date: '2024-09-03', voucherNo: 'RV-2024-101', type: 'Receipt', desc: 'Fee - Term 1 Batch', account: 'Tuition Fee A/c', category: 'Fee Collection', module: 'Fee Management', status: 'Approved', branch: 'Main Campus', amount: 24000, party: 'Batch IX' },
    { id: '102', date: '2024-09-08', voucherNo: 'RV-2024-102', type: 'Receipt', desc: 'Library Fine', account: 'Library Fine A/c', category: 'Misc.', module: 'Library', status: 'Approved', branch: 'North Branch', amount: 350, party: 'Multiple' },
    { id: '103', date: '2024-09-12', voucherNo: 'PV-2024-101', type: 'Payment', desc: 'Electricity Bill', account: 'Electricity A/c', category: 'Utility', module: 'Manual', status: 'Approved', branch: 'Main Campus', amount: 7000, party: 'Torrent Power' },
    { id: '104', date: '2024-09-18', voucherNo: 'PV-2024-102', type: 'Payment', desc: 'Petty Cash Expense', account: 'Petty Cash A/c', category: 'Misc.', module: 'Manual', status: 'Approved', branch: 'East Branch', amount: 900, party: 'Front Office', petty: true },
  ],
};

// ───────────────────────────── Main Page ─────────────────────────────
export function CashBook() {
  const [fy, setFy] = useState('FY 2025-26');
  const [branch, setBranch] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [applied, setApplied] = useState(false);
  const [entries, setEntries] = useState<CashTxn[]>(CASH_DATA['FY 2025-26']);
  const [viewEntry, setViewEntry] = useState<CashTxn | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showPetty, setShowPetty] = useState(false);
  const [toast, setToast] = useState('');

  // New-entry form
  const [nType, setNType] = useState<'Receipt' | 'Payment'>('Receipt');
  const [nDate, setNDate] = useState('2025-09-27');
  const [nAccount, setNAccount] = useState('');
  const [nCategory, setNCategory] = useState('Fee Collection');
  const [nAmount, setNAmount] = useState('');
  const [nParty, setNParty] = useState('');
  const [nDesc, setNDesc] = useState('');
  const [nBranch, setNBranch] = useState('Main Campus');
  const [nAttach, setNAttach] = useState('');

  // Cash verification
  const [physCash, setPhysCash] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const changeFy = (v: string) => {
    setFy(v);
    setEntries(CASH_DATA[v] || []);
    setApplied(false);
    setDateFrom(`${v.slice(3, 7)}-09-01`);
    setDateTo(`${v.slice(3, 7)}-09-30`);
    showToast(`Cash Book loaded for ${v}.`);
  };

  const matchType = (e: CashTxn) => {
    if (type === 'All') return true;
    if (type === 'Petty Cash') return !!e.petty;
    if (type === 'Contra (Cash to Bank)') return e.desc.toLowerCase().includes('contra');
    return e.type === type;
  };

  const filtered = useMemo(() => entries.filter((e) => {
    if (branch !== 'All' && e.branch !== branch) return false;
    if (!matchType(e)) return false;
    if (applied) {
      if (search) {
        const q = search.toLowerCase();
        if (![e.voucherNo, e.account, e.desc, e.party, String(e.amount)].some((f) => f.toLowerCase().includes(q))) return false;
      }
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (category !== 'All' && e.category !== category) return false;
      if (status !== 'All' && e.status !== status) return false;
    }
    return true;
  }), [entries, branch, type, applied, search, dateFrom, dateTo, category, status]);

  const receiptsList = filtered.filter((e) => e.type === 'Receipt');
  const paymentsList = filtered.filter((e) => e.type === 'Payment');
  const totalReceipts = receiptsList.reduce((s, e) => s + e.amount, 0);
  const totalPayments = paymentsList.reduce((s, e) => s + e.amount, 0);
  const opening = openingFor(branch);
  const closing = opening + totalReceipts - totalPayments;
  const totalDr = opening + totalReceipts;
  const totalCr = totalPayments + closing;

  const pettyUsed = entries.filter((e) => e.petty).reduce((s, e) => s + e.amount, 0);
  const pettyRemaining = PETTY_LIMIT - pettyUsed;
  const pettyPct = Math.min(100, Math.round((pettyUsed / PETTY_LIMIT) * 100));
  const pettyTone = pettyPct >= 75 ? 'bg-red-500' : pettyPct >= 25 ? 'bg-amber-500' : 'bg-green-500';

  const applyFilters = () => { setApplied(true); showToast('Filters applied.'); };
  const resetFilters = () => {
    setSearch(''); setType('All'); setCategory('All');  setStatus('All');
    setBranch('All'); setApplied(false);
    setDateFrom(`${fy.slice(3, 7)}-09-01`);
    setDateTo(`${fy.slice(3, 7)}-09-30`);
  };
  const deleteEntry = (e: CashTxn) => {
    if (window.confirm(`Delete voucher ${e.voucherNo} permanently?`)) {
      setEntries(entries.filter((x) => x.id !== e.id));
      showToast(`Voucher ${e.voucherNo} deleted.`);
    }
  };
  const doExport = (kind: string) => {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Side,Date,Voucher No,Description,Account,Category,Branch,Status,Amount\n';
    const rows = [
      ...receiptsList.map((e) => ['Receipt', e.date, e.voucherNo, `"${e.desc}"`, `"${e.account}"`, e.category, `"${e.branch}"`, e.status, e.amount].join(',')),
      ...paymentsList.map((e) => ['Payment', e.date, e.voucherNo, `"${e.desc}"`, `"${e.account}"`, e.category, `"${e.branch}"`, e.status, e.amount].join(',')),
    ].join('\n');
    const blob = new Blob([header + rows], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cash-book-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} entries as ${kind.toUpperCase()}.`);
  };

  const nextVoucher = `${nType === 'Receipt' ? 'RV' : 'PV'}-2025-${String(entries.filter((e) => e.voucherNo.startsWith(nType === 'Receipt' ? 'RV' : 'PV')).length + 1).padStart(3, '0')}`;

  const submitCashEntry = (draft: boolean) => {
    const amt = parseFloat(nAmount) || 0;
    if (!nAccount || !amt || !nDesc.trim()) { showToast('Account, Amount and Description are required.'); return; }
    setEntries([...entries, {
      id: String(Date.now()), date: nDate, voucherNo: nextVoucher, type: nType,
      desc: nDesc, account: nAccount, category: nCategory, module: 'Manual',
      status: 'Pending', branch: nBranch,
      amount: amt, party: nParty || '—',
    }]);
    setShowNew(false);
    setNAccount(''); setNAmount(''); setNParty(''); setNDesc(''); setNAttach('');
    showToast(`${nextVoucher} ${draft ? 'saved as draft' : 'submitted for approval'}.`);
  };

  const saveVerification = () => {
    const phys = parseFloat(physCash) || 0;
    const diff = closing - phys;
    if (!verifiedBy.trim()) { showToast('Enter who verified the cash.'); return; }
    showToast(diff === 0
      ? `Cash verified by ${verifiedBy} — ✅ No shortage / excess.`
      : `Verification saved — ⚠️ ${diff > 0 ? 'Shortage' : 'Excess'} of ₹${Math.abs(diff).toLocaleString('en-IN')} recorded for investigation.`);
    setShowVerify(false);
    setPhysCash(''); setVerifiedBy('');
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const statusBadge = (s: string) =>
    s === 'Approved' ? <Badge variant="success">Approved</Badge>
      : s === 'Pending' ? <Badge variant="warning">Pending</Badge>
        : s === 'Rejected' ? <Badge variant="danger">Rejected</Badge>
          : <Badge variant="info">Reversed</Badge>;

  type Totals = { opening: number; dr: number; pay: number; closing: number; cr: number };
  const SideTable = ({ list, side, t, showBranch }: { list: CashTxn[]; side: 'dr' | 'cr'; t: Totals; showBranch: boolean }) => (
    <div className={`min-w-0 ${side === 'dr' ? 'border-green-200' : 'border-red-200'}`}>
      <div className={`px-4 py-2.5 font-bold text-sm border-b-2 ${side === 'dr' ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
        {side === 'dr' ? '📥 RECEIPTS (Dr Side) — Cash Coming IN' : '📤 PAYMENTS (Cr Side) — Cash Going OUT'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-2.5 py-2 font-semibold uppercase text-xs">#</th>
              <th className="px-2.5 py-2 font-semibold uppercase text-xs">Date</th>
              <th className="px-2.5 py-2 font-semibold uppercase text-xs">Voucher</th>
              <th className="px-2.5 py-2 font-semibold uppercase text-xs">Description</th>
              {showBranch && <th className="px-2.5 py-2 font-semibold uppercase text-xs">Branch</th>}
              <th className="px-2.5 py-2 font-semibold uppercase text-xs text-right">Amount</th>
              <th className="px-2.5 py-2 font-semibold uppercase text-xs text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {side === 'dr' && (
              <tr className="bg-blue-50/60 font-semibold">
                <td /><td /><td /><td className="px-2.5 py-2">Opening Balance</td>{showBranch && <td />}
                <td className="px-2.5 py-2 text-right">{t.opening.toLocaleString('en-IN')}</td><td />
              </tr>
            )}
            {list.map((e, i) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-2.5 py-2 text-gray-500 text-xs">{i + 1}</td>
                <td className="px-2.5 py-2 text-gray-600 whitespace-nowrap">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td className="px-2.5 py-2 font-mono text-xs font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setViewEntry(e)}>{e.voucherNo}</td>
                <td className="px-2.5 py-2 text-gray-800 max-w-[150px] truncate" title={`${e.desc} — ${e.party}`}>{e.desc}{e.petty && <span className="ml-1 text-[10px] text-amber-600">🪙</span>}</td>
                {showBranch && <td className="px-2.5 py-2 text-gray-600 whitespace-nowrap">{e.branch}</td>}
                <td className={`px-2.5 py-2 text-right font-medium ${side === 'dr' ? 'text-green-700' : 'text-red-600'}`}>{e.amount.toLocaleString('en-IN')}</td>
                <td className="px-2.5 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" title="View" onClick={() => setViewEntry(e)}><Eye className="w-4 h-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteEntry(e)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={showBranch ? 7 : 6} className="px-3 py-6 text-center text-gray-400 text-xs">No {side === 'dr' ? 'receipts' : 'payments'} match.</td></tr>}
          </tbody>
          <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold text-sm">
            <tr>
              <td colSpan={showBranch ? 5 : 4} className="px-2.5 py-2 text-right">{side === 'dr' ? 'TOTAL (Dr)' : 'TOTAL (Cr)'}</td>
              <td className="px-2.5 py-2 text-right">{(side === 'dr' ? t.dr : t.pay).toLocaleString('en-IN')}</td>
              <td />
            </tr>
            {side === 'cr' && (
              <tr className="bg-blue-50">
                <td colSpan={showBranch ? 5 : 4} className="px-2.5 py-2 text-right">CLOSING BALANCE (Bal.)</td>
                <td className="px-2.5 py-2 text-right text-blue-700">{t.closing.toLocaleString('en-IN')}</td>
                <td />
              </tr>
            )}
            <tr className="bg-gray-200">
              <td colSpan={showBranch ? 5 : 4} className="px-2.5 py-2 text-right">GRAND TOTAL</td>
              <td className="px-2.5 py-2 text-right">{(side === 'dr' ? t.dr : t.cr).toLocaleString('en-IN')}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const totalsFor = (list: CashTxn[], open: number): Totals => {
    const rec = list.filter((e) => e.type === 'Receipt').reduce((t, e) => t + e.amount, 0);
    const pay = list.filter((e) => e.type === 'Payment').reduce((t, e) => t + e.amount, 0);
    const close = open + rec - pay;
    return { opening: open, dr: open + rec, pay, closing: close, cr: pay + close };
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-green-600" /> Cash Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">T-format cash ledger — Receipts (Dr) &amp; Payments (Cr) with cash verification &amp; petty cash tracker</p>
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

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Wallet, label: 'Opening Cash Balance', value: fmt(opening), color: 'bg-blue-50 text-blue-600' },
          { icon: ArrowDownToLine, label: 'Total Cash Receipts', value: fmt(totalReceipts), color: 'bg-emerald-50 text-emerald-600' },
          { icon: ArrowUpFromLine, label: 'Total Cash Payments', value: fmt(totalPayments), color: 'bg-amber-50 text-amber-600' },
          { icon: Scale, label: 'Closing Cash Balance', value: fmt(closing), chip: closing >= 50000 ? '🟢 Healthy' : closing > 0 ? '🟡 Low' : '🔴 Negative', color: 'bg-teal-50 text-teal-600' },
          { icon: AlertTriangle, label: 'Petty Cash Status', value: `${fmt(pettyUsed)} / ${fmt(PETTY_LIMIT)}`, chip: `${pettyPct}% Used`, color: 'bg-orange-50 text-orange-600' },
          { icon: CheckCircle, label: 'Total Cash Transactions', value: String(filtered.length), color: 'bg-gray-100 text-gray-600' },
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
            <Input label="Search" placeholder="Voucher no., party, description, amount..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
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
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES.map((v) => ({ value: v, label: v }))} />
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES.map((v) => ({ value: v, label: v }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={applyFilters}><Search className="w-4 h-4 mr-2" /> Search</Button>
            <Button variant="outline" onClick={resetFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
            <Button variant="secondary" onClick={() => { setNBranch(branch === 'All' ? 'Main Campus' : branch); setShowNew(true); }}><Plus className="w-4 h-4 mr-2" /> New Cash Entry</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowVerify(true)}>💰 Cash Verification</Button>
            <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
            <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>
      </Card>

      {/* ── T-Format Table (List / Branch-wise) ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">💵 Cash Book — {fy}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{dateFrom ? new Date(dateFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} to {dateTo ? new Date(dateTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} · Branch: {branch === 'All' ? 'All Branches (Consolidated)' : branch}</p>
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
            <SideTable list={receiptsList} side="dr" t={{ opening, dr: totalDr, pay: totalPayments, closing, cr: totalCr }} showBranch />
            <SideTable list={paymentsList} side="cr" t={{ opening, dr: totalDr, pay: totalPayments, closing, cr: totalCr }} showBranch />
          </div>
        ) : (
          <div className="p-4 space-y-4 bg-gray-50/60">
            {(branch === 'All' ? BRANCHES.slice(1) : [branch]).map((b) => {
              const rows = filtered.filter((e) => e.branch === b);
              const t = totalsFor(rows, openingFor(b));
              return (
                <div key={b} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-green-50/60 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-green-600" /> {b}</span>
                    <span className="text-xs text-gray-600 flex flex-wrap gap-3">
                      <span>Opening <b>{fmt(t.opening)}</b></span>
                      <span>Receipts <b className="text-green-700">{fmt(t.dr - t.opening)}</b></span>
                      <span>Payments <b className="text-red-600">{fmt(t.pay)}</b></span>
                      <span>Closing <b className={t.closing < 0 ? 'text-red-600' : 'text-blue-700'}>{fmt(t.closing)}</b></span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    <SideTable list={rows.filter((e) => e.type === 'Receipt')} side="dr" t={t} showBranch={false} />
                    <SideTable list={rows.filter((e) => e.type === 'Payment')} side="cr" t={t} showBranch={false} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Closing Balance & Verification Summary ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50/40">
          <h3 className="font-bold text-gray-900">💵 Cash Balance Summary</h3>
          <p className="text-xs text-gray-500 mt-0.5">Closing balance should match physical cash in hand</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">💰 Opening Balance</span><b>{fmt(opening)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">📥 Add: Total Receipts</span><b className="text-green-600">+{fmt(totalReceipts)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">📤 Less: Total Payments</span><b className="text-red-500">−{fmt(totalPayments)}</b></div>
            <div className="flex justify-between bg-green-50 rounded-lg px-3 py-2.5"><span className="font-bold text-green-800">💵 Closing Cash Balance</span><b className="text-green-800">{fmt(closing)}</b></div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-800 mb-3">💰 Quick Verification</p>
            <p className="text-xs text-gray-500 mb-1">Book Balance (System): <b className="text-gray-800">{fmt(closing)}</b></p>
            <p className="text-xs text-gray-500 mb-3">Use the 💰 Cash Verification button to count physical cash and record the result.</p>
            <Button variant="outline" onClick={() => setShowVerify(true)}>Open Cash Verification Tool</Button>
          </div>
        </div>
      </Card>

      {/* ── Petty Cash Tracker ── */}
      <Card title="💰 Petty Cash Tracker">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">Petty Cash Limit</span><b>{fmt(PETTY_LIMIT)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">Used This Month</span><b>{fmt(pettyUsed)}</b></div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5"><span className="text-gray-500">Balance Remaining</span><b>{fmt(pettyRemaining)}</b></div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Usage</span><span className={`font-bold ${pettyPct >= 75 ? 'text-red-600' : pettyPct >= 25 ? 'text-amber-600' : 'text-green-600'}`}>{pettyPct}% Used</span></div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pettyTone}`} style={{ width: `${pettyPct}%` }} />
            </div>
            <p className="text-xs mt-2">{pettyPct >= 75 ? '🔴 Limit exceeded threshold — needs replenishment' : pettyPct >= 25 ? '🟡 Monitor — 25% limit crossed' : '🟢 Safe usage'}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowPetty(true)}>📋 View Petty Cash Details</Button>
        </Card>

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Generated on: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Sharma (Cashier) · {fy} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>EduManager School ERP · © 2026</span>
      </div>

      {/* ── View Modal ── */}
      {viewEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-green-600" /> Cash Voucher {viewEntry.voucherNo}</h3>
              <button onClick={() => setViewEntry(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {([
                ['Type', viewEntry.type === 'Receipt' ? '📥 Cash Receipt' : '📤 Cash Payment'],
                ['Date', new Date(viewEntry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                [viewEntry.type === 'Receipt' ? 'Received From' : 'Paid To', viewEntry.party],
                ['Account', viewEntry.account],
                ['Category', viewEntry.category],
                ['Amount', fmt(viewEntry.amount)],
                ['Branch', viewEntry.branch],
                ['Module', viewEntry.module],
                ['Petty Cash', viewEntry.petty ? '🪙 Yes' : 'No'],
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

      {/* ── New Cash Entry Modal ── */}
      {showNew && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Plus className="w-5 h-5 text-green-600" /> New Cash Transaction Entry</h3>
              <button onClick={() => setShowNew(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex gap-4">
                  {(['Receipt', 'Payment'] as const).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="nType" checked={nType === t} onChange={() => setNType(t)} className="text-blue-600 focus:ring-blue-500" />
                      {t === 'Receipt' ? '🔵 Cash Receipt' : '⚪ Cash Payment'}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={nDate} onChange={(e) => setNDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No.</label>
                <input value={`${nextVoucher} (auto)`} readOnly className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
              </div>
              <Select label="Account" value={nAccount} onChange={(e) => setNAccount(e.target.value)}
                options={[{ value: '', label: 'Select account...' }, ...['Tuition Fee A/c', 'Exam Fee A/c', 'Library Fine A/c', 'Donation A/c', 'Electricity A/c', 'Maintenance A/c', 'Stationery A/c', 'Petty Cash A/c', 'Salary A/c'].map((v) => ({ value: v, label: v }))]} />
              <Select label="Category" value={nCategory} onChange={(e) => setNCategory(e.target.value)} options={CATEGORIES.slice(1).map((v) => ({ value: v, label: v }))} />
              <Input label="Amount (₹)" type="number" value={nAmount} onChange={(e) => setNAmount(e.target.value)} placeholder="0" />
              <Input label={nType === 'Receipt' ? 'Received From' : 'Paid To'} value={nParty} onChange={(e) => setNParty(e.target.value)} placeholder="Person / party name" />
              <Input label="Description" value={nDesc} onChange={(e) => setNDesc(e.target.value)} placeholder="What was this cash for?" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600">
                  <Paperclip className="w-4 h-4" />
                  {nAttach || 'Upload Receipt / Bill'}
                  <input type="file" className="hidden" onChange={(e) => setNAttach(e.target.files?.[0]?.name || '')} />
                </label>
              </div>
              <Select label="Branch" value={nBranch} onChange={(e) => setNBranch(e.target.value)} options={BRANCHES.slice(1).map((v) => ({ value: v, label: v }))} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => submitCashEntry(true)}>Save Draft</Button>
              <Button variant="primary" onClick={() => submitCashEntry(false)}>Submit for Approval</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cash Verification Modal ── */}
      {showVerify && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">💰 Cash Verification Tool</h3>
              <button onClick={() => setShowVerify(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm border-b border-gray-100 pb-2"><span className="text-gray-500">Book Balance (System)</span><b>{fmt(closing)}</b></div>
              <Input label="Physical Cash (Actual Count)" type="number" value={physCash} onChange={(e) => setPhysCash(e.target.value)} placeholder="Enter counted cash" />
              <div className={`rounded-lg px-4 py-3 text-sm font-medium ${physCash === '' ? 'bg-gray-50 text-gray-500' : parseFloat(physCash) === closing ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {physCash === '' ? 'Enter physical cash to see difference.'
                  : parseFloat(physCash) === closing
                    ? '✅ No Shortage / Excess — book and physical cash match.'
                    : `⚠️ ${closing - (parseFloat(physCash) || 0) > 0 ? 'Shortage' : 'Excess'} of ${fmt(Math.abs(closing - (parseFloat(physCash) || 0)))} — needs investigation.`}
              </div>
              <Input label="Verified By" value={verifiedBy} onChange={(e) => setVerifiedBy(e.target.value)} placeholder="Cashier / verifier name" />
              <p className="text-xs text-gray-400">Verified On: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowVerify(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveVerification}>Save Verification</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Petty Cash Details Modal ── */}
      {showPetty && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">🪙 Petty Cash Details</h3>
              <button onClick={() => setShowPetty(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
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
                  {entries.filter((e) => e.petty).map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-3 py-2 font-mono text-xs text-blue-600">{e.voucherNo}</td>
                      <td className="px-3 py-2 text-gray-800">{e.desc}</td>
                      <td className="px-3 py-2 text-gray-600">{e.branch}</td>
                      <td className="px-3 py-2 text-right font-medium">{fmt(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <td colSpan={4} className="px-3 py-2.5 text-right">TOTAL USED:</td>
                    <td className="px-3 py-2.5 text-right">{fmt(pettyUsed)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
              <Button variant="outline" onClick={() => setShowPetty(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
