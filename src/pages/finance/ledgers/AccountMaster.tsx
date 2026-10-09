import React, { useMemo, useRef, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, RotateCcw, Plus, Upload, Download, Printer, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight,
  ClipboardList, CheckCircle, XCircle, Lock, Unlock, CalendarDays, ShieldAlert,
  X, Save, Building2,
} from 'lucide-react';

// ───────────────────────────── Types ─────────────────────────────
interface Account {
  id: string;
  code: string;
  name: string;
  branch: string;
  openingBalance: number;
  balanceType: 'Debit' | 'Credit';
  description: string;
  active: boolean;
  bank?: BankDetails;
}
interface BankDetails {
  bankName: string; branch: string; holderName: string; acctType: string;
  acctNumber: string; ifsc: string; micr: string; upi: string; isDefault: boolean;
}
interface Period { name: string; start: string; end: string; status: 'Open' | 'Closed' | 'Future' }
interface FinancialYear {
  id: string; name: string; start: string; end: string; currentPeriod: string;
  status: 'Open' | 'Closed' | 'Future'; closedBy: string; periodsList: Period[];
}

// ───────────────────────────── Mock Data ─────────────────────────────
const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', code: '1001', name: 'Cash in Hand', openingBalance: 50000, balanceType: 'Debit', description: 'Petty cash at front office', active: true, branch: 'Main Campus' },
  { id: '2', code: '1002', name: 'Bank Account - SBI', openingBalance: 500000, balanceType: 'Debit', description: 'Main operating account', active: true, branch: 'Main Campus', bank: { bankName: 'State Bank of India', branch: 'Navrangpura, Ahmedabad', holderName: 'EduManager Public School', acctType: 'Current', acctNumber: '38472910564', ifsc: 'SBIN0001234', micr: '380002019', upi: 'edumanager@sbi', isDefault: true } },
  { id: '3', code: '1003', name: 'Accounts Receivable', openingBalance: 120000, balanceType: 'Debit', description: 'Pending fee receivables', active: true, branch: 'North Branch' },
  { id: '4', code: '1010', name: 'School Building', openingBalance: 5000000, balanceType: 'Debit', description: 'Main campus building', active: true, branch: 'Main Campus' },
  { id: '5', code: '1011', name: 'Computers & Labs', openingBalance: 500000, balanceType: 'Debit', description: '', active: true, branch: 'East Branch' },
  { id: '6', code: '2001', name: 'Accounts Payable', openingBalance: 10000, balanceType: 'Credit', description: 'Vendor dues', active: true, branch: 'South Branch' },
  { id: '7', code: '2002', name: 'Salary Payable', openingBalance: 50000, balanceType: 'Credit', description: '', active: true, branch: 'West Branch' },
  { id: '8', code: '3001', name: 'School Fund/Equity', openingBalance: 2000000, balanceType: 'Credit', description: 'Corpus fund', active: true, branch: 'Main Campus' },
  { id: '9', code: '4001', name: 'Tuition Fee Revenue', openingBalance: 0, balanceType: 'Credit', description: 'Core fee income', active: true, branch: 'Main Campus' },
  { id: '10', code: '4002', name: 'Hostel Fee Revenue', openingBalance: 0, balanceType: 'Credit', description: 'Sub-account of Tuition Fee head', active: true, branch: 'North Branch' },
  { id: '11', code: '4003', name: 'Transport Fee Revenue', openingBalance: 0, balanceType: 'Credit', description: '', active: true, branch: 'South Branch' },
  { id: '12', code: '4010', name: 'Government Grant', openingBalance: 0, balanceType: 'Credit', description: '', active: true, branch: 'East Branch' },
  { id: '13', code: '5001', name: 'Salary Expense', openingBalance: 0, balanceType: 'Debit', description: 'All staff salaries', active: true, branch: 'West Branch' },
  { id: '14', code: '5002', name: 'Electricity Expense', openingBalance: 0, balanceType: 'Debit', description: '', active: false, branch: 'North Branch' },
];

const MONTH_NAMES = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
function buildPeriods(startYear: number): Period[] {
  return MONTH_NAMES.map((m, i) => {
    const y = startYear + (i >= 9 ? 1 : 0);
    const lastDay = new Date(y, (i + 3) % 12 + 1, 0).getDate();
    return {
      name: `${m} ${y}`,
      start: `01-${m.slice(0, 3)}-${y}`,
      end: `${lastDay}-${m.slice(0, 3)}-${y}`,
      status: i < 5 ? 'Closed' : i === 5 ? 'Open' : 'Future',
    };
  });
}

const INITIAL_FYS: FinancialYear[] = [
  { id: '1', name: 'FY 2022-23', start: '01-Apr-2022', end: '31-Mar-2023', currentPeriod: '—', status: 'Closed', closedBy: 'Mr. Sharma', periodsList: buildPeriods(2022).map((p) => ({ ...p, status: 'Closed' })) },
  { id: '2', name: 'FY 2023-24', start: '01-Apr-2023', end: '31-Mar-2024', currentPeriod: '—', status: 'Closed', closedBy: 'Mr. Sharma', periodsList: buildPeriods(2023).map((p) => ({ ...p, status: 'Closed' })) },
  { id: '3', name: 'FY 2024-25', start: '01-Apr-2024', end: '31-Mar-2025', currentPeriod: '—', status: 'Closed', closedBy: 'Mr. Sharma', periodsList: buildPeriods(2024).map((p) => ({ ...p, status: 'Closed' })) },
  { id: '4', name: 'FY 2025-26', start: '01-Apr-2025', end: '31-Mar-2026', currentPeriod: 'Sep-2025', status: 'Open', closedBy: '—', periodsList: buildPeriods(2025) },
  { id: '5', name: 'FY 2026-27', start: '01-Apr-2026', end: '31-Mar-2027', currentPeriod: '—', status: 'Future', closedBy: '—', periodsList: buildPeriods(2026).map((p) => ({ ...p, status: 'Future' })) },
];

const APPROVERS = ['Principal — Mrs. Kavita Rao', 'Finance Manager — Mr. Rajesh Sharma', 'Trustee — Mr. Anil Mehta'];

const EMPTY_BANK = { bankName: '', branch: '', holderName: '', acctType: 'Savings', acctNumber: '', confirmNumber: '', ifsc: '', micr: '', upi: '', isDefault: false };

const BRANCHES = ['Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];

// ───────────────────────────── Main Page ─────────────────────────────
export function AccountMaster() {
  const [tab, setTab] = useState<'accounts' | 'fy'>('accounts');

  // ── Accounts state ──
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [accSearch, setAccSearch] = useState('');
  const [fStatus, setFStatus] = useState('All');
  const [branch, setBranch] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [accApplied, setAccApplied] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Account, 'id'>>({
    code: '', name: '', branch: 'Main Campus', openingBalance: 0, balanceType: 'Debit', description: '', active: true,
  });
  const [toast, setToast] = useState('');
  const [viewAcc, setViewAcc] = useState<Account | null>(null);
  const [fySel, setFySel] = useState('FY 2025-26');
  const [fyEditId, setFyEditId] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [bank, setBank] = useState(EMPTY_BANK);

  // ── FY state ──
  const [fys, setFys] = useState<FinancialYear[]>(INITIAL_FYS);
  const [fySearch, setFySearch] = useState('');
  const [fyStatus, setFyStatus] = useState('All');
  const [fyApplied, setFyApplied] = useState(false);
  const [showCreateFy, setShowCreateFy] = useState(false);
  const [periodsOf, setPeriodsOf] = useState<FinancialYear | null>(null);
  const [closeOf, setCloseOf] = useState<FinancialYear | null>(null);
  const [fyForm, setFyForm] = useState({ name: '', start: '2026-04-01', end: '2027-03-31', setCurrent: false, description: '' });
  const [closeForm, setCloseForm] = useState({ checks: [true, true, true, true, true, true], remarks: '', approver: '', password: '' });

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  // ── Accounts filtering ──
  const filteredAccounts = useMemo(() => accounts.filter((a) => {
    if (branch !== 'All' && a.branch !== branch) return false;
    if (!accApplied) return true;
    if (accSearch) {
      const q = accSearch.toLowerCase();
      if (![a.name, a.code].some((f) => f.toLowerCase().includes(q))) return false;
    }
    if (fStatus !== 'All' && (fStatus === 'Active') !== a.active) return false;
    return true;
  }), [accounts, accApplied, accSearch, fStatus, branch]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / rowsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filteredAccounts.slice((pageSafe - 1) * rowsPerPage, pageSafe * rowsPerPage);

  const resetAccFilters = () => { setAccSearch(''); setFStatus('All'); setBranch('All'); setAccApplied(false); setPage(1); };

  const openAdd = () => {
    setEditId(null);
    setForm({ code: String(1000 + accounts.length + 1), name: '', openingBalance: 0, balanceType: 'Debit', description: '', active: true, branch: 'Main Campus' });
    setBank(EMPTY_BANK);
    setShowAccountModal(true);
  };
  const openEdit = (a: Account) => {
    setEditId(a.id);
    const { id, ...rest } = a;
    setForm(rest);
    setBank(a.bank ? { ...a.bank, confirmNumber: a.bank.acctNumber } : EMPTY_BANK);
    setShowAccountModal(true);
  };
  const saveAccount = (addAnother: boolean) => {
    if (!form.name.trim() || !form.code.trim()) { notify('Account code and name are required.'); return; }
    const bankFilled = !!(bank.bankName.trim() || bank.acctNumber.trim() || bank.ifsc.trim());
    if (bankFilled) {
      if (!bank.bankName.trim() || !bank.acctNumber.trim() || !bank.ifsc.trim()) { notify('Bank Name, Account Number and IFSC Code are required for bank details.'); return; }
      if (!/^\d{9,18}$/.test(bank.acctNumber.trim())) { notify('Account number must be 9–18 digits.'); return; }
      if (bank.acctNumber.trim() !== bank.confirmNumber.trim()) { notify('Account number and Confirm Account Number do not match.'); return; }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc.trim().toUpperCase())) { notify('Invalid IFSC code — expected format e.g. SBIN0001234.'); return; }
    }
    const bankData: BankDetails | undefined = bankFilled
      ? { bankName: bank.bankName.trim(), branch: bank.branch.trim(), holderName: bank.holderName.trim(), acctType: bank.acctType, acctNumber: bank.acctNumber.trim(), ifsc: bank.ifsc.trim().toUpperCase(), micr: bank.micr.trim(), upi: bank.upi.trim(), isDefault: bank.isDefault }
      : undefined;
    if (editId) {
      setAccounts(accounts.map((a) => (a.id === editId ? { ...a, ...form, bank: bankData } : a)));
      notify(`Account ${form.code} updated.${bankData ? ' Bank details saved.' : ''}`);
    } else {
      setAccounts([...accounts, { id: String(Date.now()), ...form, bank: bankData }]);
      notify(`Account ${form.code} — ${form.name} created.${bankData ? ' Bank details saved.' : ''}`);
    }
    if (addAnother) {
      setEditId(null);
      setForm({ ...form, code: String(1000 + accounts.length + 2), name: '', description: '', openingBalance: 0 });
      setBank(EMPTY_BANK);
    } else {
      setShowAccountModal(false);
    }
  };
  const toggleActive = (id: string) => setAccounts(accounts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  const deleteAccount = (id: string) => { setAccounts(accounts.filter((a) => a.id !== id)); notify('Account deleted (no transactions existed).'); };

  const bulkActivate = () => { setAccounts(accounts.map((a) => (selected.includes(a.id) ? { ...a, active: true } : a))); notify(`${selected.length} account(s) activated.`); setSelected([]); };
  const bulkDeactivate = () => { setAccounts(accounts.map((a) => (selected.includes(a.id) ? { ...a, active: false } : a))); notify(`${selected.length} account(s) deactivated.`); setSelected([]); };
  const bulkDelete = () => { setAccounts(accounts.filter((a) => !selected.includes(a.id))); notify(`${selected.length} account(s) deleted.`); setSelected([]); };

  const exportAccounts = () => {
    const header = 'Code,Name,Branch,Opening Balance,Balance Type,Status,Description\n';
    const rows = filteredAccounts.map((x) => [x.code, `"${x.name}"`, x.branch, x.openingBalance, x.balanceType, x.active ? 'Active' : 'Inactive', `"${x.description}"`].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'account-master.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Exported ${filteredAccounts.length} accounts.`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter((l) => l.trim() && !l.toLowerCase().startsWith('code,'));
      const added: Account[] = [];
      for (const ln of lines) {
        const [code, name, opening] = ln.split(',').map((x) => (x || '').trim());
        if (!code || !name) continue;
        added.push({ id: String(Date.now()) + '-' + code, code, name, branch: 'Main Campus', openingBalance: parseFloat(opening) || 0, balanceType: 'Debit', description: 'Imported', active: true });
      }
      if (added.length) { setAccounts([...accounts, ...added]); notify(`${added.length} account(s) imported from ${file.name}.`); }
      else notify('No valid rows found — expected CSV: Code, Name, Opening Balance.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── FY helpers ──
  const filteredFys = useMemo(() => fys.filter((f) => {
    if (!fyApplied) return true;
    if (fySearch && !`${f.name} ${f.start} ${f.end}`.toLowerCase().includes(fySearch.toLowerCase())) return false;
    if (fyStatus !== 'All' && f.status !== fyStatus) return false;
    return true;
  }), [fys, fyApplied, fySearch, fyStatus]);

  const exportFys = () => {
    const header = 'FY Name,Start,End,Current Period,Status,Closed By\n';
    const rows = filteredFys.map((f) => [f.name, f.start, f.end, f.currentPeriod, f.status, f.closedBy].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'financial-years.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Exported ${filteredFys.length} financial years.`);
  };

  const saveFy = (activate: boolean) => {
    if (!fyForm.name.trim()) { notify('Financial year name is required.'); return; }
    if (fyEditId) {
      setFys(fys.map((f) => (f.id === fyEditId ? { ...f, name: fyForm.name, start: fyForm.start, end: fyForm.end } : f)));
      notify(`${fyForm.name} updated.`);
    } else {
      const startYear = parseInt(fyForm.start.split('-')[0]) || 2026;
      const fy: FinancialYear = {
        id: String(Date.now()), name: fyForm.name, start: fyForm.start, end: fyForm.end,
        currentPeriod: activate ? 'Apr-' + startYear : '—',
        status: activate ? 'Open' : 'Future', closedBy: '—',
        periodsList: buildPeriods(startYear).map((p, i) => ({ ...p, status: activate && i === 0 ? 'Open' as const : 'Future' as const })),
      };
      setFys([...fys, fy]);
      notify(activate ? `${fy.name} created and activated (Open).` : `${fy.name} created as Future.`);
    }
    setShowCreateFy(false);
    setFyEditId(null);
  };
  const openEditFy = (f: FinancialYear) => {
    setFyEditId(f.id);
    setFyForm({ name: f.name, start: f.start, end: f.end, setCurrent: false, description: '' });
    setShowCreateFy(true);
  };
  const togglePeriod = (fyId: string, idx: number) => {
    setFys(fys.map((f) => {
      if (f.id !== fyId) return f;
      const list = f.periodsList.map((p, i) => {
        if (i !== idx) return p;
        if (p.status === 'Open') return { ...p, status: 'Closed' as const };
        if (p.status === 'Closed') return { ...p, status: 'Open' as const };
        return p;
      });
      return { ...f, periodsList: list };
    }));
  };
  const confirmCloseYear = () => {
    if (!closeForm.approver || !closeForm.password || closeForm.checks.some((c) => !c)) {
      notify('Complete the checklist, select approver and enter password.');
      return;
    }
    if (closeOf) {
      setFys(fys.map((f) => (f.id === closeOf.id
        ? { ...f, status: 'Closed' as const, closedBy: closeForm.approver.split('—')[0].trim(), currentPeriod: '—', periodsList: f.periodsList.map((p) => ({ ...p, status: p.status === 'Future' || p.status === 'Open' ? 'Closed' as const : p.status })) }
        : f)));
      notify(`${closeOf.name} closed permanently by ${closeForm.approver.split('—')[0].trim()}.`);
    }
    setCloseOf(null);
  };

  const fyStatusBadge = (s: string) =>
    s === 'Open' ? <Badge variant="success">Open</Badge>
      : s === 'Closed' ? <Badge variant="danger">Closed</Badge>
        : <Badge variant="info">Future</Badge>;

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  // ── Account row (shared by List & Branch-wise views) ──
  const renderAccRow = (a: Account, showBranch: boolean) => (
      <tr key={a.id} className={`hover:bg-gray-50 ${selected.includes(a.id) ? 'bg-blue-50/50' : ''}`}>
        <td className="px-3 py-3">
          <input type="checkbox" checked={selected.includes(a.id)}
            onChange={() => setSelected(selected.includes(a.id) ? selected.filter((s) => s !== a.id) : [...selected, a.id])}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        </td>
        <td className="px-3 py-3 font-mono font-semibold text-blue-600">{a.code}</td>
        <td className="px-3 py-3 font-medium text-gray-900">
          {a.name}
          {a.bank && (
            <span title={`🏦 ${a.bank.bankName} • A/C ••${a.bank.acctNumber.slice(-4)} • IFSC ${a.bank.ifsc}${a.bank.isDefault ? ' • Default' : ''}`} className="ml-1.5 text-xs">🏦</span>
          )}
        </td>
        {showBranch && <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{a.branch}</td>}
        <td className="px-3 py-3 text-right font-medium text-gray-900">{fmt(a.openingBalance)}</td>
        <td className="px-3 py-3 text-center">
          {a.active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>}
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="sm" title="View" onClick={() => setViewAcc(a)}><Eye className="w-4 h-4 text-gray-500" /></Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(a)}><Pencil className="w-4 h-4 text-blue-500" /></Button>
            <Button variant="ghost" size="sm" title={a.active ? 'Deactivate' : 'Activate'} onClick={() => toggleActive(a.id)}>
              {a.active ? <XCircle className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
            </Button>
            <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteAccount(a.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
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
            <ClipboardList className="w-7 h-7 text-blue-600" /> Account Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">Chart of Accounts &amp; Financial Year management — the foundation of the financial system</p>
        </div>
        <div className="w-44">
          <Select value={fySel} onChange={(e) => { setFySel(e.target.value); notify(`Working financial year set to ${e.target.value}.`); }} options={['FY 2025-26', 'FY 2024-25', 'FY 2023-24'].map((y) => ({ value: y, label: y }))} />
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {toast}</span>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Section 3: Tabs ── */}
      <div className="flex border-b border-gray-200">
        {([
          { id: 'accounts', label: 'Account Master', icon: ClipboardList },
          { id: 'fy', label: 'Financial Year Master', icon: CalendarDays },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB 1: ACCOUNT MASTER ═══════════ */}
      {tab === 'accounts' && (
        <>
          <Card className="p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Filters &amp; Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <Input label="Search" placeholder="Account name, code or type..." value={accSearch} onChange={(e) => setAccSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
              </div>
              <Select label="Status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} options={['All', 'Active', 'Inactive'].map((v) => ({ value: v, label: v }))} />
              <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)}
                options={['All', ...BRANCHES].map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
            </div>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <Button variant="primary" onClick={() => { setAccApplied(true); setPage(1); }}><Search className="w-4 h-4 mr-2" /> Search</Button>
              <Button variant="outline" onClick={resetAccFilters}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
              <Button variant="secondary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
              <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Import</Button>
              <input ref={importRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportFile} />
              <Button variant="outline" onClick={exportAccounts}><Download className="w-4 h-4 mr-2" /> Export</Button>
              <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
            </div>
          </Card>

          {selected.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <span className="font-medium text-blue-800">{selected.length} account(s) selected</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="bg-white" onClick={bulkActivate}><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Activate Selected</Button>
                  <Button variant="outline" size="sm" className="bg-white" onClick={bulkDeactivate}><XCircle className="w-4 h-4 mr-2 text-amber-600" /> Deactivate Selected</Button>
                  <Button variant="outline" size="sm" className="bg-white text-red-600" onClick={bulkDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete Selected</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelected([])}><X className="w-4 h-4 mr-1" /> Clear</Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Chart of Accounts</h3>
                <Badge variant="info">{filteredAccounts.length} accounts</Badge>
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
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3">
                        <input type="checkbox" checked={paginated.length > 0 && selected.length === paginated.length}
                          onChange={() => setSelected(selected.length === paginated.length ? [] : paginated.map((a) => a.id))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Code</th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Account Name</th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Branch</th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Opening Balance</th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Status</th>
                      <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((a) => renderAccRow(a, true))}
                    {paginated.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No accounts match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Showing <b>{paginated.length}</b> of <b>{filteredAccounts.length}</b> accounts</span>
                  <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(1); }}
                    className="rounded border border-gray-300 px-2 py-1 text-sm">
                    {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setPage(pageSafe - 1)} disabled={pageSafe === 1}><ChevronLeft className="w-4 h-4" /></Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded text-sm font-medium ${p === pageSafe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>{p}</button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setPage(pageSafe + 1)} disabled={pageSafe === totalPages}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              </>
            ) : (
              <div className="p-4 space-y-4 bg-gray-50/60">
                {(branch === 'All' ? BRANCHES : [branch]).map((b) => {
                  const rows = filteredAccounts.filter((a) => a.branch === b);
                  const dr = rows.filter((a) => a.balanceType === 'Debit').reduce((t, a) => t + a.openingBalance, 0);
                  const cr = rows.filter((a) => a.balanceType === 'Credit').reduce((t, a) => t + a.openingBalance, 0);
                  return (
                    <div key={b} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                      <div className="px-4 py-3 bg-blue-50/60 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> {b}</span>
                        <span className="text-xs text-gray-600 flex flex-wrap gap-3">
                          <span>{rows.length} accounts</span>
                          <span>{rows.filter((a) => a.active).length} active</span>
                          <span>Opening Dr <b>{fmt(dr)}</b></span>
                          <span>Opening Cr <b>{fmt(cr)}</b></span>
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                            <tr>
                              <th className="px-3 py-3" />
                              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Code</th>
                              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Account Name</th>
                              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-right">Opening Balance</th>
                              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Status</th>
                              <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {rows.map((a) => renderAccRow(a, false))}
                            {rows.length === 0 && (
                              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No accounts for {b} with the current filters.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </Card>
        </>
      )}

      {/* ═══════════ TAB 2: FINANCIAL YEAR MASTER ═══════════ */}
      {tab === 'fy' && (
        <>
          <Card className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input label="Search" placeholder="Search financial years by name or date..." value={fySearch} onChange={(e) => setFySearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
              </div>
              <Select label="Status" value={fyStatus} onChange={(e) => setFyStatus(e.target.value)} options={['All', 'Open', 'Closed', 'Future'].map((v) => ({ value: v, label: v }))} />
            </div>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <Button variant="primary" onClick={() => { setFyApplied(true); }}><Search className="w-4 h-4 mr-2" /> Search</Button>
              <Button variant="outline" onClick={() => { setFySearch(''); setFyStatus('All'); setFyApplied(false); }}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
              <Button variant="secondary" onClick={() => { setFyEditId(null); setFyForm({ name: '', start: '2026-04-01', end: '2027-03-31', setCurrent: false, description: '' }); setShowCreateFy(true); }}><Plus className="w-4 h-4 mr-2" /> Create Financial Year</Button>
              <Button variant="outline" onClick={exportFys}><Download className="w-4 h-4 mr-2" /> Export</Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">FY Name</th>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Start Date</th>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">End Date</th>
                                        <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Current Period</th>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Status</th>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider">Closed By</th>
                    <th className="px-3 py-3 font-semibold uppercase text-xs tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFys.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-semibold text-gray-900">{f.name}</td>
                      <td className="px-3 py-3 text-gray-600">{f.start}</td>
                      <td className="px-3 py-3 text-gray-600">{f.end}</td>
                                            <td className="px-3 py-3 text-gray-600">{f.currentPeriod}</td>
                      <td className="px-3 py-3 text-center">{fyStatusBadge(f.status)}</td>
                      <td className="px-3 py-3 text-gray-600">{f.closedBy}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" title="View Periods" onClick={() => setPeriodsOf(f)}><Eye className="w-4 h-4 text-gray-500" /></Button>
                          <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditFy(f)}><Pencil className="w-4 h-4 text-blue-500" /></Button>
                          {f.status === 'Open' && (
                            <Button variant="ghost" size="sm" title="Close Year" onClick={() => { setCloseOf(f); setCloseForm({ checks: [true, true, true, true, true, true], remarks: '', approver: '', password: '' }); }}>
                              <Lock className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                          {f.status === 'Future' && (
                            <Button variant="ghost" size="sm" title="Delete" onClick={() => { setFys(fys.filter((x) => x.id !== f.id)); notify(`${f.name} deleted.`); }}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Last updated: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Sharma (Finance Manager)</span>
        <span>EduManager School ERP · © 2026</span>
      </div>

      {/* ── View Account Modal ── */}
      {viewAcc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Account {viewAcc.code}</h3>
              <button onClick={() => setViewAcc(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {([
                ['Account Name', viewAcc.name],
                ['Branch', viewAcc.branch],
                ['Opening Balance', fmt(viewAcc.openingBalance)],
                ['Balance Type', viewAcc.balanceType],
                ['Status', viewAcc.active ? '🟢 Active' : '🔴 Inactive'],
                ['Description', viewAcc.description || '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900">{v}</span>
                </div>
              ))}
              {viewAcc.bank && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 mt-3">
                  <p className="text-sm font-bold text-gray-800 mb-2">🏦 Bank Details</p>
                  <div className="space-y-1.5 text-xs">
                    {([
                      ['Bank', `${viewAcc.bank.bankName}${viewAcc.bank.branch ? ` — ${viewAcc.bank.branch}` : ''}`],
                      ['Account Holder', viewAcc.bank.holderName || '—'],
                      ['Account Type', viewAcc.bank.acctType],
                      ['Account Number', viewAcc.bank.acctNumber],
                      ['IFSC', viewAcc.bank.ifsc],
                      ['MICR', viewAcc.bank.micr || '—'],
                      ['UPI ID', viewAcc.bank.upi || '—'],
                      ['Default', viewAcc.bank.isDefault ? '⭐ Yes' : 'No'],
                    ] as [string, string][]).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-medium text-gray-900 font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => { setViewAcc(null); openEdit(viewAcc); }}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
              <Button variant="primary" onClick={() => setViewAcc(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Account Modal ── */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> {editId ? 'Edit Account' : 'Create New Account'}
              </h3>
              <button onClick={() => setShowAccountModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                <p className="text-[11px] text-gray-400 mt-1">1xxx Assets · 2xxx Liabilities · 3xxx Equity · 4xxx Revenue · 5xxx Expenses</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cash in Hand"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (₹)</label>
                <input type="number" min="0" value={form.openingBalance} onChange={(e) => setForm({ ...form, openingBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Balance Type</label>
                <div className="flex gap-4">
                  {(['Debit', 'Credit'] as const).map((bt) => (
                    <label key={bt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="balType" checked={form.balanceType === bt} onChange={() => setForm({ ...form, balanceType: bt })}
                        className="text-blue-600 focus:ring-blue-500" />
                      {bt === 'Debit' ? '🔵 Debit' : '🔴 Credit'}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                  {[true, false].map((v) => (
                    <label key={String(v)} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input type="radio" name="accStatus" checked={form.active === v} onChange={() => setForm({ ...form, active: v })}
                        className="text-blue-600 focus:ring-blue-500" />
                      {v ? '🟢 Active' : '🔴 Inactive'}
                    </label>
                  ))}
                </div>
              </div>
              <Select label="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}
                options={BRANCHES.map((v) => ({ value: v, label: v }))} />
              {/* ── Bank Details (for bank accounts) ── */}
              <div className="md:col-span-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-gray-800">🏦 Bank Details</p>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3">Fill this section only for bank / cheque accounts. Used for bank reconciliation, NEFT-RTGS payments and cheque printing.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name *</label>
                      <input value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} placeholder="e.g. State Bank of India"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch Name</label>
                      <input value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} placeholder="e.g. Navrangpura, Ahmedabad"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                      <input value={bank.holderName} onChange={(e) => setBank({ ...bank, holderName: e.target.value })} placeholder="e.g. EduManager Public School"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <Select label="Bank Account Type" value={bank.acctType} onChange={(e) => setBank({ ...bank, acctType: e.target.value })}
                      options={['Savings', 'Current', 'Overdraft (OD)', 'Cash Credit (CC)'].map((v) => ({ value: v, label: v }))} />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bank Account Number *</label>
                      <input value={bank.acctNumber} onChange={(e) => setBank({ ...bank, acctNumber: e.target.value.replace(/\D/g, '').slice(0, 18) })} placeholder="9–18 digits"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Account Number *</label>
                      <input value={bank.confirmNumber} onChange={(e) => setBank({ ...bank, confirmNumber: e.target.value.replace(/\D/g, '').slice(0, 18) })} placeholder="Re-enter account number"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                      {bank.confirmNumber !== '' && bank.confirmNumber !== bank.acctNumber && (
                        <p className="text-[11px] text-red-500 mt-1">⚠ Account numbers do not match</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code *</label>
                      <input value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11) })} placeholder="e.g. SBIN0001234"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500" />
                      <p className="text-[11px] text-gray-400 mt-1">Format: 4-letter bank code + 0 + 6 branch characters</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">MICR Code</label>
                      <input value={bank.micr} onChange={(e) => setBank({ ...bank, micr: e.target.value.replace(/\D/g, '').slice(0, 9) })} placeholder="9 digits (optional)"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">UPI ID (optional)</label>
                      <input value={bank.upi} onChange={(e) => setBank({ ...bank, upi: e.target.value })} placeholder="e.g. school@sbi"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-1">
                      <input type="checkbox" checked={bank.isDefault} onChange={(e) => setBank({ ...bank, isDefault: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      ⭐ Set as default bank account
                    </label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  placeholder="Optional notes about this account..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowAccountModal(false)}>Cancel</Button>
              {!editId && <Button variant="outline" onClick={() => saveAccount(true)}><Save className="w-4 h-4 mr-2" /> Save &amp; Add Another</Button>}
              <Button variant="primary" onClick={() => saveAccount(false)}><Save className="w-4 h-4 mr-2" /> Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create FY Modal ── */}
      {showCreateFy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> {fyEditId ? `Edit Financial Year — ${fyForm.name}` : 'Create New Financial Year'}</h3>
              <button onClick={() => setShowCreateFy(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year Name *</label>
                <input value={fyForm.name} onChange={(e) => setFyForm({ ...fyForm, name: e.target.value })} placeholder="e.g. FY 2026-27"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={fyForm.start} onChange={(e) => setFyForm({ ...fyForm, start: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={fyForm.end} onChange={(e) => setFyForm({ ...fyForm, end: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={fyForm.setCurrent} onChange={(e) => setFyForm({ ...fyForm, setCurrent: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Set as current financial year?
              </label>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={fyForm.description} onChange={(e) => setFyForm({ ...fyForm, description: e.target.value })} rows={2}
                  placeholder="Optional notes..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setShowCreateFy(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => saveFy(false)}><Save className="w-4 h-4 mr-2" /> Save</Button>
              {!fyEditId && <Button variant="primary" onClick={() => saveFy(true)}><Save className="w-4 h-4 mr-2" /> Save &amp; Activate</Button>}
            </div>
          </div>
        </div>
      )}

      {/* ── Period Management Modal ── */}
      {periodsOf && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> {periodsOf.name} — Period Management</h3>
              <button onClick={() => setPeriodsOf(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">#</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Period Name</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Start</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">End</th>
                    <th className="px-3 py-2 text-center text-xs uppercase font-semibold text-gray-600">Status</th>
                    <th className="px-3 py-2 text-center text-xs uppercase font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {periodsOf.periodsList.map((p, i) => (
                    <tr key={p.name} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{p.name}</td>
                      <td className="px-3 py-2 text-gray-600">{p.start}</td>
                      <td className="px-3 py-2 text-gray-600">{p.end}</td>
                      <td className="px-3 py-2 text-center">{fyStatusBadge(p.status)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {p.status !== 'Future' && (
                            <Button variant="ghost" size="sm" title={p.status === 'Open' ? 'Close period' : 'Re-open period'}
                              onClick={() => togglePeriod(periodsOf.id, i)}>
                              {p.status === 'Open' ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-green-600" />}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
              <Button variant="outline" onClick={() => setPeriodsOf(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Close FY Modal ── */}
      {closeOf && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Close Financial Year — {closeOf.name}</h3>
              <button onClick={() => setCloseOf(null)} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5 text-red-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" /> WARNING: Closing the financial year is IRREVERSIBLE.
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">✅ Checklist Before Closing</p>
                <div className="space-y-2">
                  {[
                    'All journal entries have been approved',
                    'Bank reconciliation is completed',
                    'All pending invoices have been settled',
                    'Trial balance is verified (Debit = Credit)',
                    'All 12 periods have been closed',
                    'Financial statements have been generated',
                  ].map((label, i) => (
                    <label key={label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={closeForm.checks[i]}
                        onChange={(e) => setCloseForm({ ...closeForm, checks: closeForm.checks.map((c, j) => (j === i ? e.target.checked : c)) })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Remarks (mandatory)</label>
                <textarea value={closeForm.remarks} onChange={(e) => setCloseForm({ ...closeForm, remarks: e.target.value })} rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <Select label="Authorized By" value={closeForm.approver} onChange={(e) => setCloseForm({ ...closeForm, approver: e.target.value })}
                options={[{ value: '', label: 'Select approver...' }, ...APPROVERS.map((a) => ({ value: a, label: a }))]} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Confirm</label>
                <input type="password" value={closeForm.password} onChange={(e) => setCloseForm({ ...closeForm, password: e.target.value })} placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="ghost" onClick={() => setCloseOf(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmCloseYear}><Lock className="w-4 h-4 mr-2" /> Confirm &amp; Close Year</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
