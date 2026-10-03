import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Download, Printer, FileText, FileSpreadsheet,
  Eye, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Wallet, ArrowDownToLine, ArrowUpFromLine, Scale,
  X, BookOpen, CheckCircle, ClipboardList, Building2,
} from 'lucide-react';

// ───────────────────────────── Types ─────────────────────────────
interface LedgerEntry {
  id: string;
  date: string;
  voucherNo: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  category: string;
  branch: string;
}

// ───────────────────────────── Mock Data ─────────────────────────────
const OPENING_BALANCE = 500000;

const LEDGER_BY_FY: Record<string, LedgerEntry[]> = {
  'FY 2025-26': [
    { id: '1', date: '2025-04-01', voucherNo: 'VCH-001', accountName: 'Cash Account', description: 'Opening Balance', debit: 500000, credit: 0, category: 'Opening', branch: 'Main Campus' },
    { id: '2', date: '2025-04-05', voucherNo: 'VCH-002', accountName: 'Tuition Fee Revenue', description: 'Fee - Rahul (X-A)', debit: 0, credit: 15000, category: 'Tuition Fee', branch: 'Main Campus' },
    { id: '3', date: '2025-04-07', voucherNo: 'VCH-003', accountName: 'Salary Expense', description: 'Apr Teacher Pay', debit: 200000, credit: 0, category: 'Salary', branch: 'North Branch' },
    { id: '4', date: '2025-04-10', voucherNo: 'VCH-004', accountName: 'Electricity Expense', description: 'Apr Electricity', debit: 12000, credit: 0, category: 'Utility', branch: 'South Branch' },
    { id: '5', date: '2025-04-12', voucherNo: 'VCH-005', accountName: 'Grant Revenue', description: 'Govt. Grant Received', debit: 0, credit: 100000, category: 'Grant', branch: 'East Branch' },
    { id: '6', date: '2025-04-15', voucherNo: 'VCH-006', accountName: 'Computer Asset', description: 'Lab Computers Purchase', debit: 50000, credit: 0, category: 'Maintenance', branch: 'West Branch' },
    { id: '7', date: '2025-04-18', voucherNo: 'VCH-007', accountName: 'Library Fine Revenue', description: 'Fine - Sita (IX)', debit: 0, credit: 200, category: 'Library', branch: 'Main Campus' },
    { id: '8', date: '2025-05-02', voucherNo: 'VCH-008', accountName: 'Tuition Fee Revenue', description: 'Fee - Amit (VIII-B)', debit: 0, credit: 14000, category: 'Tuition Fee', branch: 'North Branch' },
    { id: '9', date: '2025-05-08', voucherNo: 'VCH-009', accountName: 'Transport Fee Revenue', description: 'Bus Fee Q1 - Meera', debit: 0, credit: 9000, category: 'Transport', branch: 'South Branch' },
    { id: '10', date: '2025-05-12', voucherNo: 'VCH-010', accountName: 'Maintenance Expense', description: 'Classroom Paint Job', debit: 18000, credit: 0, category: 'Maintenance', branch: 'East Branch' },
    { id: '11', date: '2025-06-01', voucherNo: 'VCH-011', accountName: 'Hostel Fee Revenue', description: 'Hostel Fee - Karan', debit: 0, credit: 40000, category: 'Hostel', branch: 'West Branch' },
    { id: '12', date: '2025-06-15', voucherNo: 'VCH-012', accountName: 'Bank Account - SBI', description: 'Loan Repayment EMI', debit: 35000, credit: 0, category: 'Utility', branch: 'Main Campus' },
    { id: '13', date: '2025-07-05', voucherNo: 'VCH-013', accountName: 'Water Expense', description: 'Jun Water Bill', debit: 6500, credit: 0, category: 'Utility', branch: 'North Branch' },
    { id: '14', date: '2025-07-20', voucherNo: 'VCH-014', accountName: 'Donation Revenue', description: 'Alumni Donation', debit: 0, credit: 51000, category: 'Grant', branch: 'South Branch' },
  ],
  'FY 2024-25': [
    { id: '101', date: '2024-04-03', voucherNo: 'VCH-101', accountName: 'Tuition Fee Revenue', description: 'Fee - Q1 batch (60 students)', debit: 0, credit: 600000, category: 'Tuition Fee', branch: 'East Branch' },
    { id: '102', date: '2024-04-28', voucherNo: 'VCH-102', accountName: 'Salary Expense', description: 'Apr Staff Pay', debit: 250000, credit: 0, category: 'Salary', branch: 'West Branch' },
    { id: '103', date: '2024-05-14', voucherNo: 'VCH-103', accountName: 'Grant Revenue', description: 'State Grant Received', debit: 0, credit: 150000, category: 'Grant', branch: 'Main Campus' },
    { id: '104', date: '2024-06-09', voucherNo: 'VCH-104', accountName: 'Electricity Expense', description: 'May Electricity', debit: 15000, credit: 0, category: 'Utility', branch: 'North Branch' },
    { id: '105', date: '2024-07-19', voucherNo: 'VCH-105', accountName: 'Hostel Fee Revenue', description: 'Hostel Fee - Term 1', debit: 0, credit: 90000, category: 'Hostel', branch: 'South Branch' },
    { id: '106', date: '2024-08-22', voucherNo: 'VCH-106', accountName: 'Maintenance Expense', description: 'Bus Engine Overhaul', debit: 22000, credit: 0, category: 'Maintenance', branch: 'East Branch' },
  ],
  'FY 2023-24': [
    { id: '201', date: '2023-04-06', voucherNo: 'VCH-201', accountName: 'Tuition Fee Revenue', description: 'Fee - Q1 batch (52 students)', debit: 0, credit: 520000, category: 'Tuition Fee', branch: 'West Branch' },
    { id: '202', date: '2023-05-02', voucherNo: 'VCH-202', accountName: 'Salary Expense', description: 'May Staff Pay', debit: 230000, credit: 0, category: 'Salary', branch: 'Main Campus' },
    { id: '203', date: '2023-06-16', voucherNo: 'VCH-203', accountName: 'Grant Revenue', description: 'Govt. Grant Received', debit: 0, credit: 120000, category: 'Grant', branch: 'North Branch' },
    { id: '204', date: '2023-07-11', voucherNo: 'VCH-204', accountName: 'Water Expense', description: 'Jun Water Bill', debit: 5800, credit: 0, category: 'Utility', branch: 'South Branch' },
    { id: '205', date: '2023-08-30', voucherNo: 'VCH-205', accountName: 'Donation Revenue', description: 'Alumni Donation', debit: 0, credit: 35000, category: 'Grant', branch: 'East Branch' },
  ],
};

const ACCOUNT_TYPES = ['All', 'Assets', 'Liabilities', 'Revenue', 'Expenses', 'Equity'];
const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const BRANCH_WEIGHT: Record<string, number> = { 'Main Campus': 0.40, 'North Branch': 0.18, 'South Branch': 0.16, 'East Branch': 0.14, 'West Branch': 0.12 };

// ───────────────────────────── Main Page ─────────────────────────────
export function GeneralLedger() {
  const [fy, setFy] = useState('FY 2025-26');
  const [entries, setEntries] = useState<LedgerEntry[]>(LEDGER_BY_FY['FY 2025-26']);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [accType, setAccType] = useState('All');
  const [branch, setBranch] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [applied, setApplied] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExport, setShowExport] = useState(false);
  const [viewEntry, setViewEntry] = useState<(LedgerEntry & { balance: number }) | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const changeFy = (v: string) => {
    setFy(v);
    setEntries(LEDGER_BY_FY[v]);
    setSelected([]);
    setPage(1);
    setApplied(false);
    showToast(`Ledger loaded for ${v} — ${LEDGER_BY_FY[v].length} entries.`);
  };

  const typeOf = (name: string): string => {
    if (/Revenue|Income|Fee|Fine|Donation|Grant/.test(name)) return 'Revenue';
    if (/Expense/.test(name)) return 'Expenses';
    if (/Asset/.test(name)) return 'Assets';
    if (/Bank|Cash/.test(name)) return 'Assets';
    return 'Liabilities';
  };

  // Running balances over full ledger
  const withBalance = useMemo(() => {
    let bal = OPENING_BALANCE;
    return entries.map((e) => {
      bal += e.credit - e.debit;
      return { ...e, balance: bal };
    });
  }, [entries]);

  // Branch-wise running balances (each branch opens with its share of the opening balance)
  const branchOpening = (b: string) => Math.round(OPENING_BALANCE * (BRANCH_WEIGHT[b] || 0));
  const branchBal = useMemo(() => {
    const run: Record<string, number> = {};
    const out: Record<string, number> = {};
    entries.forEach((e) => {
      if (run[e.branch] === undefined) run[e.branch] = branchOpening(e.branch);
      run[e.branch] += e.credit - e.debit;
      out[e.id] = run[e.branch];
    });
    return out;
  }, [entries]);

  const filtered = useMemo(() => {
    return withBalance.filter((e) => {
      if (branch !== 'All' && e.branch !== branch) return false;
      if (!applied) return true;
      if (search) {
        const q = search.toLowerCase();
        const hit = [e.accountName, e.description, e.voucherNo, e.category, String(e.debit), String(e.credit)]
          .some((f) => f.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (dateFrom && e.date < dateFrom) return false;
      if (dateTo && e.date > dateTo) return false;
      if (accType !== 'All' && typeOf(e.accountName) !== accType) return false;
      return true;
    });
  }, [withBalance, applied, search, dateFrom, dateTo, accType, branch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * rowsPerPage, pageSafe * rowsPerPage);

  const totals = filtered.reduce(
    (a, e) => ({ debit: a.debit + e.debit, credit: a.credit + e.credit }),
    { debit: 0, credit: 0 },
  );
  const closingBalance = filtered.length ? filtered[filtered.length - 1].balance : OPENING_BALANCE;

  const kpi = {
    balance: closingBalance,
    income: filtered.reduce((s, e) => s + e.credit, 0),
    expense: filtered.reduce((s, e) => s + e.debit, 0),
    net: filtered.reduce((s, e) => s + e.credit - e.debit, 0),
  };

  const applyFilters = () => { setApplied(true); setPage(1); showToast('Filters applied to the ledger.'); };
  const resetFilters = () => {
    setSearch(''); setDateFrom(''); setDateTo('');
    setAccType('All');
    setApplied(false); setPage(1);
  };
  const toggleSelectAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map((e) => e.id));
  const toggleRow = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  const deleteEntry = (e: LedgerEntry) => {
    if (window.confirm(`Delete voucher ${e.voucherNo} permanently? This cannot be undone.`)) {
      setEntries(entries.filter((x) => x.id !== e.id));
      setSelected(selected.filter((id) => id !== e.id));
      showToast(`Voucher ${e.voucherNo} deleted.`);
    }
  };

  const bulkDelete = () => {
    if (window.confirm(`Delete ${selected.length} selected entry(s) permanently?`)) {
      setEntries(entries.filter((e) => !selected.includes(e.id)));
      showToast(`${selected.length} entry(s) deleted.`);
      setSelected([]);
    }
  };

  const printVoucher = (e: LedgerEntry) => {
    showToast(`Preparing voucher ${e.voucherNo} for printing...`);
    setTimeout(() => window.print(), 400);
  };

  const doExport = (kind: string) => {
    setShowExport(false);
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Date,Voucher No,Account,Description,Category,Branch,Debit,Credit,Balance\n';
    const rows = filtered.map((e) => [e.date, e.voucherNo, `"${e.accountName}"`, `"${e.description}"`, e.category, e.branch, e.debit, e.credit, e.balance].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `general-ledger-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} entries as ${kind.toUpperCase()}.`);
  };

  const fmt = (n: number) => `₹${Math.abs(n).toLocaleString('en-IN')}`;
  const fmtBal = (n: number) => `${fmt(n)} ${n < 0 ? 'Dr' : 'Cr'}`;

  // ── Table renderers (shared by List & Branch-wise views) ──
  const renderHead = (showBranch: boolean) => (
    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
      <tr>
        <th className="px-3 py-3">
          {showBranch && (
            <input type="checkbox" checked={paginated.length > 0 && selected.length === paginated.length}
              onChange={toggleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          )}
        </th>
        {['#', 'Date', 'Voucher No.', 'Account Name', 'Description', ...(showBranch ? ['Branch'] : [])].map((h) => (
          <th key={h} className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">{h}</th>
        ))}
        <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Debit (Dr)</th>
        <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Credit (Cr)</th>
        <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Balance</th>
        <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Actions</th>
      </tr>
    </thead>
  );
  const renderRow = (e: LedgerEntry & { balance: number }, n: number, showBranch: boolean, bal: number) => (
    <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(e.id) ? 'bg-blue-50/50' : ''}`}>
      <td className="px-3 py-3">
        <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleRow(e.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      </td>
      <td className="px-3 py-3 text-gray-500 text-xs">{n}</td>
      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
        {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
      </td>
      <td className="px-3 py-3 font-mono text-xs font-semibold text-blue-600">{e.voucherNo}</td>
      <td className="px-3 py-3 font-medium text-gray-900">{e.accountName}</td>
      <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate" title={e.description}>{e.description}</td>
      {showBranch && <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{e.branch}</td>}
      <td className="px-3 py-3 text-right font-medium text-red-600">{e.debit ? fmt(e.debit) : ''}</td>
      <td className="px-3 py-3 text-right font-medium text-green-600">{e.credit ? fmt(e.credit) : ''}</td>
      <td className="px-3 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{fmtBal(bal)}</td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" title="View" onClick={() => setViewEntry({ ...e, balance: bal })}><Eye className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="sm" title="Print" onClick={() => printVoucher(e)}><Printer className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteEntry(e)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* ── Section 1: Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" /> General Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Chronological record of every financial transaction across all accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select value={fy} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} onChange={(e) => changeFy(e.target.value)} />
          </div>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExport(!showExport)}>
              <Download className="w-4 h-4 mr-2" /> Export <Printer className="w-4 h-4 ml-2" />
            </Button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                <button onClick={() => doExport('pdf')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><FileText className="w-4 h-4 text-red-500" /> Export as PDF</button>
                <button onClick={() => doExport('excel')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><FileSpreadsheet className="w-4 h-4 text-green-600" /> Export as Excel</button>
                <button onClick={() => doExport('csv')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><FileText className="w-4 h-4 text-blue-600" /> Export as CSV</button>
                <div className="border-t border-gray-100 my-1" />
                <button onClick={() => doExport('print')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><Printer className="w-4 h-4 text-gray-500" /> Print Ledger</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {toast}</span>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Section 2: KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: Wallet, label: 'Total Balance', value: fmt(kpi.balance), color: 'bg-blue-50 text-blue-600' },
          { icon: ArrowDownToLine, label: 'Total Income (Cr)', value: fmt(kpi.income), color: 'bg-emerald-50 text-emerald-600' },
          { icon: ArrowUpFromLine, label: 'Total Expenses (Dr)', value: fmt(kpi.expense), color: 'bg-amber-50 text-amber-600' },
          { icon: Scale, label: 'Net (Income − Expense)', value: fmt(kpi.net), color: kpi.net >= 0 ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600' },
        ].map((c) => (
          <Card key={c.label} className="p-4">
            <div className={`inline-flex p-2 rounded-lg mb-2 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Section 3: Filters & Search ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Input
              label="Search"
              placeholder="Account name, description, amount, voucher no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <Select label="Account Type" value={accType} onChange={(e) => setAccType(e.target.value)}
            options={ACCOUNT_TYPES.map((t) => ({ value: t, label: t }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)}
            options={BRANCHES.map((t) => ({ value: t, label: t === 'All' ? 'All Branches' : t }))} />
        </div>
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <Button variant="primary" onClick={applyFilters}><Search className="w-4 h-4 mr-2" /> Search</Button>
          <Button variant="outline" onClick={resetFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset Filters</Button>
        </div>
      </Card>

      {/* ── Bulk actions bar ── */}
      {selected.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <span className="font-medium text-blue-800">{selected.length} entry(s) selected</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="bg-white text-red-600" onClick={bulkDelete}><Trash2 className="w-4 h-4 mr-2" /> Bulk Delete</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}><X className="w-4 h-4 mr-1" /> Clear</Button>
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 5: Main Ledger Table (List / Branch-wise) ── */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">Ledger Entries</h3>
            <Badge variant="info">{filtered.length} entries</Badge>
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                {renderHead(true)}
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((e, idx) => renderRow(e, (pageSafe - 1) * rowsPerPage + idx + 1, true, e.balance))}
                  {paginated.length === 0 && (
                    <tr><td colSpan={11} className="px-4 py-10 text-center text-gray-500">No ledger entries match your filters.</td></tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                  <tr>
                    <td colSpan={7} className="px-3 py-3 text-right text-gray-900">TOTALS:</td>
                    <td className="px-3 py-3 text-right text-red-600">{fmt(totals.debit)}</td>
                    <td className="px-3 py-3 text-right text-green-600">{fmt(totals.credit)}</td>
                    <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">{fmtBal(closingBalance)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

        {/* ── Section 6: Pagination ── */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Showing <b>{paginated.length ? (pageSafe - 1) * rowsPerPage + 1 : 0}</b>–<b>{(pageSafe - 1) * rowsPerPage + paginated.length}</b> of <b>{filtered.length}</b> entries</span>
            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(1); }}
              className="rounded border border-gray-300 px-2 py-1 text-sm">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={pageSafe === 1}><ChevronsLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage(pageSafe - 1)} disabled={pageSafe === 1}><ChevronLeft className="w-4 h-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm font-medium ${p === pageSafe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>{p}</button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage(pageSafe + 1)} disabled={pageSafe === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={pageSafe === totalPages}><ChevronsRight className="w-4 h-4" /></Button>
          </div>
        </div>
          </>
        ) : (
          <div className="p-4 space-y-4 bg-gray-50/60">
            {(branch === 'All' ? BRANCHES.slice(1) : [branch]).map((b) => {
              const rows = filtered.filter((e) => e.branch === b);
              const open = branchOpening(b);
              const dr = rows.reduce((s, e) => s + e.debit, 0);
              const cr = rows.reduce((s, e) => s + e.credit, 0);
              const close = rows.length ? branchBal[rows[rows.length - 1].id] : open;
              return (
                <div key={b} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> {b}</span>
                    <span className="text-xs text-gray-600 flex flex-wrap gap-3">
                      <span>{rows.length} entries</span>
                      <span>Opening <b>{fmtBal(open)}</b></span>
                      <span>Dr <b className="text-red-600">{fmt(dr)}</b></span>
                      <span>Cr <b className="text-green-600">{fmt(cr)}</b></span>
                      <span>Closing <b>{fmtBal(close)}</b></span>
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      {renderHead(false)}
                      <tbody className="divide-y divide-gray-100">
                        {rows.map((e, i) => renderRow(e, i + 1, false, branchBal[e.id]))}
                        {rows.length === 0 && (
                          <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-400">No entries for {b} with the current filters.</td></tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                        <tr>
                          <td colSpan={6} className="px-3 py-3 text-right text-gray-900">{b} TOTALS:</td>
                          <td className="px-3 py-3 text-right text-red-600">{fmt(dr)}</td>
                          <td className="px-3 py-3 text-right text-green-600">{fmt(cr)}</td>
                          <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">{fmtBal(close)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── View Voucher Modal ── */}
      {viewEntry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> Voucher {viewEntry.voucherNo}
              </h3>
              <button onClick={() => setViewEntry(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {([
                ['Date', new Date(viewEntry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Account Name', viewEntry.accountName],
                ['Description', viewEntry.description],
                ['Category', viewEntry.category],
                ['Branch', viewEntry.branch],
                ['Debit (Dr)', viewEntry.debit ? fmt(viewEntry.debit) : '—'],
                ['Credit (Cr)', viewEntry.credit ? fmt(viewEntry.credit) : '—'],
                ['Running Balance', fmt(viewEntry.balance)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => printVoucher(viewEntry)}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="primary" onClick={() => setViewEntry(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
