import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  FileText,
  Lock,
  Paperclip,
  Plus,
  Search,
  Unlock
} from 'lucide-react';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type HoldStatus = 'Draft' | 'Active' | 'Partially Released' | 'Released' | 'Cancelled';
type ReasonCode =
  | 'Disciplinary Investigation'
  | 'Court Order'
  | 'Document Non-Compliance'
  | 'Absconding'
  | 'Property Non-Return'
  | 'CBSE Compliance Block'
  | 'Audit Hold'
  | 'Other';
type NotifyMethod = 'Email' | 'Letter' | 'In-Person' | 'Not Yet Notified';
type PageTab = 'list' | 'form' | 'report';
type CyclePay = 'Unpaid' | 'Paid' | 'Partially Paid';

type Cycle = {
  month: string;
  slipId: string;
  slipStatus: 'Withheld' | 'Released';
  gross: number;
  net: number;
  withheldSince: string;
  releaseEntry: string;
  releaseDate: string;
  payment: CyclePay;
};

type Hold = {
  id: string;
  employeeId: string;
  name: string;
  photo: string;
  department: string;
  designation: string;
  structure: string;
  company: string;
  fromDate: string;
  toDate: string;
  reason: ReasonCode;
  detail: string;
  documents: string[];
  authority: string;
  approvalDate: string;
  notified: boolean;
  notifyDate: string;
  notifyMethod: NotifyMethod;
  status: HoldStatus;
  onNotice: boolean;
  cycles: Cycle[];
};

const REASONS: ReasonCode[] = [
  'Disciplinary Investigation',
  'Court Order',
  'Document Non-Compliance',
  'Absconding',
  'Property Non-Return',
  'CBSE Compliance Block',
  'Audit Hold',
  'Other'
];

const STAFF = [
  { id: 'EMP-2048', name: 'Sunita Rao', photo: 'SR', department: 'Science', designation: 'PGT Physics', structure: 'Teaching Grade A 2026', company: 'EduManager School', onNotice: false },
  { id: 'EMP-2055', name: 'Mahesh T', photo: 'MT', department: 'Administration', designation: 'Clerk', structure: 'Non-Teaching Grade C', company: 'EduManager School', onNotice: true },
  { id: 'EMP-2060', name: 'Rakesh Singh', photo: 'RS', department: 'Sports', designation: 'PET', structure: 'Teaching Grade B 2026', company: 'EduManager School', onNotice: false },
  { id: 'EMP-1042', name: 'Meera Iyer', photo: 'MI', department: 'Science', designation: 'PGT Chemistry', structure: 'Teaching Grade A 2026', company: 'EduManager School', onNotice: false }
];

const emptyForm = (): Hold => ({
  id: '',
  employeeId: '',
  name: '',
  photo: '',
  department: '',
  designation: '',
  structure: '',
  company: 'EduManager School',
  fromDate: '2026-11-01',
  toDate: '',
  reason: 'Disciplinary Investigation',
  detail: '',
  documents: [],
  authority: 'Principal Rao',
  approvalDate: '2026-11-01',
  notified: false,
  notifyDate: '',
  notifyMethod: 'Not Yet Notified',
  status: 'Draft',
  onNotice: false,
  cycles: []
});

const SEED: Hold[] = [
  {
    id: 'SW-2026-001',
    employeeId: 'EMP-2048',
    name: 'Sunita Rao',
    photo: 'SR',
    department: 'Science',
    designation: 'PGT Physics',
    structure: 'Teaching Grade A 2026',
    company: 'EduManager School',
    fromDate: '2026-09-01',
    toDate: '',
    reason: 'Disciplinary Investigation',
    detail: 'Pending inquiry into alleged question-paper leak. Hold approved by Principal until committee closes.',
    documents: ['HR-Committee-Minutes-Sep2026.pdf', 'Show-Cause-Notice.pdf'],
    authority: 'Principal Rao',
    approvalDate: '2026-08-28',
    notified: true,
    notifyDate: '2026-08-29',
    notifyMethod: 'Letter',
    status: 'Active',
    onNotice: false,
    cycles: [
      { month: 'September 2026', slipId: 'HR-SLIP-09-2026-0088', slipStatus: 'Withheld', gross: 95000, net: 72660, withheldSince: '2026-09-28', releaseEntry: '', releaseDate: '', payment: 'Unpaid' },
      { month: 'October 2026', slipId: 'HR-SLIP-10-2026-0088', slipStatus: 'Withheld', gross: 95000, net: 72660, withheldSince: '2026-10-28', releaseEntry: '', releaseDate: '', payment: 'Unpaid' },
      { month: 'November 2026', slipId: 'HR-SLIP-11-2026-0088', slipStatus: 'Withheld', gross: 95000, net: 72660, withheldSince: '2026-11-05', releaseEntry: '', releaseDate: '', payment: 'Unpaid' }
    ]
  },
  {
    id: 'SW-2026-002',
    employeeId: 'EMP-2055',
    name: 'Mahesh T',
    photo: 'MT',
    department: 'Administration',
    designation: 'Clerk',
    structure: 'Non-Teaching Grade C',
    company: 'EduManager School',
    fromDate: '2026-07-15',
    toDate: '',
    reason: 'Property Non-Return',
    detail: 'Laptop EMP-ASSET-441 and ID card not returned after transfer of desk. Partial humanitarian release of one cycle approved.',
    documents: ['Asset-Movement-441.pdf'],
    authority: 'HR Head',
    approvalDate: '2026-07-14',
    notified: true,
    notifyDate: '2026-07-15',
    notifyMethod: 'Email',
    status: 'Partially Released',
    onNotice: true,
    cycles: [
      { month: 'July 2026', slipId: 'HR-SLIP-07-2026-0112', slipStatus: 'Released', gross: 42000, net: 38000, withheldSince: '2026-07-28', releaseEntry: 'BE-REL-2026-07-01', releaseDate: '2026-08-10', payment: 'Paid' },
      { month: 'August 2026', slipId: 'HR-SLIP-08-2026-0112', slipStatus: 'Withheld', gross: 42000, net: 38000, withheldSince: '2026-08-28', releaseEntry: '', releaseDate: '', payment: 'Unpaid' },
      { month: 'September 2026', slipId: 'HR-SLIP-09-2026-0112', slipStatus: 'Withheld', gross: 42000, net: 38000, withheldSince: '2026-09-28', releaseEntry: '', releaseDate: '', payment: 'Unpaid' },
      { month: 'October 2026', slipId: 'HR-SLIP-10-2026-0112', slipStatus: 'Withheld', gross: 42000, net: 38000, withheldSince: '2026-10-28', releaseEntry: '', releaseDate: '', payment: 'Unpaid' },
      { month: 'November 2026', slipId: 'HR-SLIP-11-2026-0112', slipStatus: 'Withheld', gross: 42000, net: 38000, withheldSince: '2026-11-05', releaseEntry: '', releaseDate: '', payment: 'Unpaid' }
    ]
  },
  {
    id: 'SW-2025-005',
    employeeId: 'EMP-2060',
    name: 'Rakesh Singh',
    photo: 'RS',
    department: 'Sports',
    designation: 'PET',
    structure: 'Teaching Grade B 2026',
    company: 'EduManager School',
    fromDate: '2026-03-01',
    toDate: '2026-08-31',
    reason: 'Document Non-Compliance',
    detail: 'Police verification and CBSE qualification certificate received after six months. All cycles released.',
    documents: ['Police-Verification.pdf', 'CBSE-Qualification.pdf'],
    authority: 'HR Head',
    approvalDate: '2026-02-25',
    notified: true,
    notifyDate: '2026-02-26',
    notifyMethod: 'In-Person',
    status: 'Released',
    onNotice: false,
    cycles: [
      { month: 'March 2026', slipId: 'HR-SLIP-03-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-03-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' },
      { month: 'April 2026', slipId: 'HR-SLIP-04-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-04-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' },
      { month: 'May 2026', slipId: 'HR-SLIP-05-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-05-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' },
      { month: 'June 2026', slipId: 'HR-SLIP-06-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-06-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' },
      { month: 'July 2026', slipId: 'HR-SLIP-07-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-07-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' },
      { month: 'August 2026', slipId: 'HR-SLIP-08-2026-0201', slipStatus: 'Released', gross: 36000, net: 30000, withheldSince: '2026-08-28', releaseEntry: 'BE-REL-2026-09-01', releaseDate: '2026-09-05', payment: 'Paid' }
    ]
  }
];

function totals(h: Hold) {
  const net = h.cycles.reduce((s, c) => s + c.net, 0);
  const released = h.cycles.filter((c) => c.slipStatus === 'Released').reduce((s, c) => s + c.net, 0);
  const withheld = net - released;
  const days = Math.max(1, Math.round((Date.parse('2026-11-05') - Date.parse(h.fromDate)) / 86400000));
  return { net, released, withheld, days, months: h.cycles.length, still: h.cycles.filter((c) => c.slipStatus === 'Withheld').length };
}

function statusBadge(s: HoldStatus) {
  if (s === 'Active') return <Badge variant="warning">Active</Badge>;
  if (s === 'Partially Released') return <Badge variant="info">Partially Released</Badge>;
  if (s === 'Released') return <Badge variant="success">Released</Badge>;
  if (s === 'Cancelled') return <Badge variant="danger">Cancelled</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
}

export function PayrollExceptionList() {
  const [tab, setTab] = useState<PageTab>('list');
  const [holds, setHolds] = useState<Hold[]>(SEED);
  const [form, setForm] = useState<Hold>(emptyForm());
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [warn, setWarn] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [partialOpen, setPartialOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [releaseReason, setReleaseReason] = useState('');
  const [releaseAuth, setReleaseAuth] = useState('HR Head');
  const [releaseDate, setReleaseDate] = useState('2026-11-05');
  const [partialAmt, setPartialAmt] = useState('30000');
  const [partialNote, setPartialNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [docName, setDocName] = useState('');
  const [repStatus, setRepStatus] = useState('');
  const [repDept, setRepDept] = useState('');
  const [repReason, setRepReason] = useState('');
  const [repFrom, setRepFrom] = useState('');
  const [repTo, setRepTo] = useState('');
  const [repEmp, setRepEmp] = useState('');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };

  const cards = useMemo(() => {
    const active = holds.filter((h) => h.status === 'Active' || h.status === 'Partially Released');
    const withheld = active.reduce((s, h) => s + totals(h).withheld, 0);
    const releasedYtd = holds.reduce((s, h) => s + totals(h).released, 0);
    const people = new Set(active.map((h) => h.employeeId)).size;
    return { active: active.filter((h) => h.status === 'Active').length, withheld, people, releasedYtd };
  }, [holds]);

  const listRows = holds.filter((h) => {
    if (filterStatus && h.status !== filterStatus) return false;
    if (filterDept && h.department !== filterDept) return false;
    if (filterReason && h.reason !== filterReason) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${h.id} ${h.name} ${h.employeeId} ${h.reason}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const reportRows = holds.filter((h) => {
    if (repStatus && h.status !== repStatus) return false;
    if (repDept && h.department !== repDept) return false;
    if (repReason && h.reason !== repReason) return false;
    if (repEmp && h.employeeId !== repEmp) return false;
    if (repFrom && h.fromDate < repFrom) return false;
    if (repTo && h.fromDate > repTo) return false;
    return true;
  });

  const openNew = () => {
    setForm(emptyForm());
    setError('');
    setWarn('');
    setTab('form');
  };

  const openEdit = (h: Hold) => {
    setForm({ ...h, cycles: h.cycles.map((c) => ({ ...c })) });
    setError('');
    setWarn('');
    setTab('form');
  };

  const pickEmployee = (id: string) => {
    const emp = STAFF.find((s) => s.id === id);
    if (!emp) return;
    const existing = holds.find((h) => h.employeeId === id && (h.status === 'Active' || h.status === 'Partially Released') && h.id !== form.id);
    setForm((f) => ({
      ...f,
      employeeId: emp.id,
      name: emp.name,
      photo: emp.photo,
      department: emp.department,
      designation: emp.designation,
      structure: emp.structure,
      company: emp.company,
      onNotice: emp.onNotice
    }));
    setError(existing ? `Active Salary Withholding ${existing.id} already exists for this employee.` : '');
    setWarn(emp.onNotice ? 'Employee has an active resignation/notice period. Consider Full & Final Settlement instead.' : '');
  };

  const saveHold = (asActive: boolean) => {
    if (!form.employeeId) { setError('Employee is mandatory.'); return; }
    const dup = holds.find((h) => h.employeeId === form.employeeId && (h.status === 'Active' || h.status === 'Partially Released') && h.id !== form.id);
    if (asActive && dup) { setError(`Active Salary Withholding ${dup.id} already exists for this employee.`); return; }
    if (form.toDate && form.fromDate > form.toDate) { setError('To Date must be after From Date.'); return; }
    if (form.detail.trim().length < 20) { setError('Reason Detail is mandatory (minimum 20 characters) for the audit trail.'); return; }
    if (asActive && !form.notified) {
      setWarn('Labor-law warning: employee has not been notified about the salary hold.');
    }
    const id = form.id || `SW-2026-${String(holds.length + 1).padStart(3, '0')}`;
    const cycles = form.cycles.length ? form.cycles : [
      { month: 'November 2026', slipId: `HR-SLIP-11-2026-${form.employeeId.slice(-4)}`, slipStatus: 'Withheld' as const, gross: 95000, net: 72660, withheldSince: form.fromDate, releaseEntry: '', releaseDate: '', payment: 'Unpaid' as const }
    ];
    const next: Hold = { ...form, id, status: asActive ? 'Active' : 'Draft', cycles };
    setHolds((p) => {
      const i = p.findIndex((h) => h.id === id);
      if (i >= 0) return p.map((h) => h.id === id ? next : h);
      return [next, ...p];
    });
    setForm(next);
    flash(asActive
      ? `Withholding ${id} saved as Active. Submitted salary slips from ${form.fromDate} will be re-tagged Withheld and excluded from future bank entries.`
      : `Draft ${id} saved.`);
    setTab('list');
  };

  const applyRelease = (mode: 'full' | 'partial' | 'forfeit') => {
    if (!form.id) return;
    if (mode !== 'forfeit' && !releaseReason.trim()) { flash('Release reason is mandatory.'); return; }
    if (mode === 'forfeit' && !cancelReason.trim()) { flash('Forfeit reason and HR Head approval note are mandatory.'); return; }
    const pick = mode === 'full' ? form.cycles.filter((c) => selectedCycles.includes(c.month) && c.slipStatus === 'Withheld') : [];
    setHolds((p) => p.map((h) => {
      if (h.id !== form.id) return h;
      if (mode === 'forfeit') {
        return { ...h, status: 'Cancelled', cycles: h.cycles.map((c) => c.slipStatus === 'Withheld' ? { ...c, slipStatus: 'Released', releaseEntry: 'JV-FORFEIT-2026-11', releaseDate, payment: 'Unpaid' } : c) };
      }
      if (mode === 'partial') {
        const amt = Number(partialAmt) || 0;
        const first = h.cycles.find((c) => c.slipStatus === 'Withheld');
        if (!first) return h;
        const cycles = h.cycles.map((c) => c.month === first.month ? { ...c, payment: 'Partially Paid' as const, releaseEntry: `BE-REL-PARTIAL-${Date.now().toString().slice(-4)}`, releaseDate } : c);
        const still = cycles.some((c) => c.slipStatus === 'Withheld');
        return { ...h, status: still ? 'Partially Released' : 'Released', cycles };
      }
      const months = new Set(pick.map((c) => c.month));
      const cycles = h.cycles.map((c) => months.has(c.month) ? { ...c, slipStatus: 'Released' as const, releaseEntry: `BE-REL-2026-11-${h.id.slice(-3)}`, releaseDate, payment: 'Paid' as const } : c);
      const still = cycles.some((c) => c.slipStatus === 'Withheld');
      const expired = h.toDate && h.toDate <= releaseDate;
      return { ...h, status: !still && expired ? 'Released' : still ? (cycles.some((c) => c.slipStatus === 'Released') ? 'Partially Released' : h.status) : 'Released', cycles };
    }));
    const updated = { ...form };
    setReleaseOpen(false);
    setPartialOpen(false);
    setCancelOpen(false);
    if (mode === 'forfeit') flash(`Forfeit JE posted: Salaries Payable Dr / Salary & Wages Expense Cr. Hold ${form.id} cancelled.`);
    else if (mode === 'partial') flash(`Partial bank entry ${inr(Number(partialAmt) || 0)} created. Remaining balance stays withheld. ${partialNote}`);
    else flash(`Release bank entry created (Salaries Payable Dr / School Bank Cr) for ${pick.length} cycle(s).`);
    const latest = holds.find((h) => h.id === form.id);
    if (latest) setForm(latest);
    setTab('list');
    void updated;
  };

  const formTotals = totals(form.id ? form : emptyForm());
  const durationWarn = form.id && formTotals.days > 60;
  const longHold = form.id && formTotals.days > 90;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Withholding & Release</h1>
          <p className="text-sm text-gray-500">Home › Payroll › Salary Withholding. Accrue the slip, block the bank payment, release later with a separate journal entry.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" />New withholding</Button>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'list' as const, label: 'List' },
          { id: 'form' as const, label: form.id ? `Record ${form.id}` : 'New / Edit' },
          { id: 'report' as const, label: 'Withholding Report' }
        ]).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'list' && (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            <Card><p className="text-xs uppercase text-amber-600">Active holds</p><p className="text-2xl font-bold text-amber-700">{cards.active}</p></Card>
            <Card><p className="text-xs uppercase text-red-600">Total withheld</p><p className="text-2xl font-bold text-red-700">{inr(cards.withheld)}</p></Card>
            <Card><p className="text-xs uppercase text-indigo-600">Employees affected</p><p className="text-2xl font-bold text-indigo-700">{cards.people}</p></Card>
            <Card><p className="text-xs uppercase text-emerald-600">Released YTD</p><p className="text-2xl font-bold text-emerald-700">{inr(cards.releasedYtd)}</p></Card>
          </div>
          <Card>
            <div className="flex flex-wrap items-end gap-3 p-4">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
                <Input label="Search" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ID, employee, reason" />
              </div>
              <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Active', label: 'Active' }, { value: 'Partially Released', label: 'Partially Released' }, { value: 'Released', label: 'Released' }, { value: 'Cancelled', label: 'Cancelled' }, { value: 'Draft', label: 'Draft' }]} />
              <Select label="Department" value={filterDept} onChange={(e) => setFilterDept(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...['Science', 'Administration', 'Sports'].map((v) => ({ value: v, label: v }))]} />
              <Select label="Reason" value={filterReason} onChange={(e) => setFilterReason(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...REASONS.map((v) => ({ value: v, label: v }))]} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>{['Withholding ID', 'Employee', 'Department', 'From Date', 'Active months', 'Total withheld', 'Total released', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {listRows.map((h) => {
                    const t = totals(h);
                    return (
                      <tr key={h.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono text-xs text-indigo-700">{h.id}</td>
                        <td className="px-3 py-2"><p className="font-medium">{h.name}</p><p className="text-xs text-gray-500">{h.employeeId}</p></td>
                        <td className="px-3 py-2">{h.department}</td>
                        <td className="px-3 py-2">{h.fromDate}</td>
                        <td className="px-3 py-2 text-center">{t.months}</td>
                        <td className="px-3 py-2 font-semibold text-red-700">{inr(t.withheld)}</td>
                        <td className="px-3 py-2 text-emerald-700">{inr(t.released)}</td>
                        <td className="px-3 py-2">{statusBadge(h.status)}</td>
                        <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => openEdit(h)}>Open</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'form' && (
        <>
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</div>}
          {warn && <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4" />{warn}</div>}
          {durationWarn && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">This withholding has exceeded the recommended duration under Gujarat labor regulations ({formTotals.days} days). Consult legal counsel.</div>}
          {longHold && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">Automatic reminder: withholding for {form.name} has been active for {formTotals.days} days. Weekly reminder is queued to HR Head.</div>}

          <Card title="A · Salary withholding form">
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <Select label="Employee *" value={form.employeeId} onChange={(e) => pickEmployee(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'Select employee' }, ...STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))]} />
              <Input label="Company" value={form.company} readOnly />
              <div>
                <p className="mb-1 text-xs font-medium text-gray-600">Status</p>
                {statusBadge(form.status)}
              </div>
            </div>
            {form.employeeId && (
              <div className="mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-xl border bg-gray-50 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">{form.photo}</div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{form.name}</p>
                  <p className="text-sm text-gray-500">{form.employeeId} · {form.department} · {form.designation}</p>
                  <p className="text-xs text-gray-400">Salary structure: {form.structure}</p>
                </div>
                {holds.filter((h) => h.employeeId === form.employeeId && h.id !== form.id).length > 0 && (
                  <p className="text-xs text-amber-700">Existing holds: {holds.filter((h) => h.employeeId === form.employeeId && h.id !== form.id).map((h) => h.id).join(', ')}</p>
                )}
              </div>
            )}
            <div className="grid gap-4 border-t px-5 py-4 md:grid-cols-3">
              <Input label="From Date *" type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
              <Input label="To Date (blank = ongoing)" type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
              <Select label="Withholding Reason *" value={form.reason} onChange={(e) => setForm({ ...form, reason: (typeof e === 'string' ? e : e.target.value) as ReasonCode })} options={REASONS.map((v) => ({ value: v, label: v }))} />
              <div className="md:col-span-3">
                <Textarea label="Reason Detail * (min 20 characters)" rows={3} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
              </div>
              <Input label="Withholding Authority" value={form.authority} onChange={(e) => setForm({ ...form, authority: e.target.value })} />
              <Input label="Approval Date" type="date" value={form.approvalDate} onChange={(e) => setForm({ ...form, approvalDate: e.target.value })} />
              <Select label="Notification Method" value={form.notifyMethod} onChange={(e) => setForm({ ...form, notifyMethod: (typeof e === 'string' ? e : e.target.value) as NotifyMethod })} options={['Email', 'Letter', 'In-Person', 'Not Yet Notified'].map((v) => ({ value: v, label: v }))} />
              <label className="flex items-center gap-2 text-sm md:col-span-2">
                <input type="checkbox" checked={form.notified} onChange={(e) => setForm({ ...form, notified: e.target.checked, notifyMethod: e.target.checked ? (form.notifyMethod === 'Not Yet Notified' ? 'Email' : form.notifyMethod) : 'Not Yet Notified' })} />
                Employee notification (mandatory for labor-law compliance)
              </label>
              <Input label="Notification Date" type="date" value={form.notifyDate} onChange={(e) => setForm({ ...form, notifyDate: e.target.value })} />
            </div>
            <div className="border-t px-5 py-4">
              <p className="mb-2 text-sm font-medium">Supporting documents</p>
              <div className="flex flex-wrap gap-2">
                {form.documents.map((d) => <Badge key={d} variant="secondary"><Paperclip className="mr-1 h-3 w-3" />{d}</Badge>)}
              </div>
              <div className="mt-2 flex gap-2">
                <Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="filename.pdf" />
                <Button variant="outline" onClick={() => { if (docName.trim()) { setForm({ ...form, documents: [...form.documents, docName.trim()] }); setDocName(''); } }}><Paperclip className="mr-1 h-4 w-4" />Attach</Button>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t bg-gray-50 px-5 py-3">
              <Button variant="outline" onClick={() => saveHold(false)}>Save draft</Button>
              <Button onClick={() => saveHold(true)}><Lock className="mr-1 h-4 w-4" />Save & activate</Button>
            </div>
          </Card>

          {form.id && (
            <Card title="B · Withholding cycles (auto-generated, read-only)">
              <div className="overflow-x-auto p-5">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>{['Payroll cycle', 'Salary slip', 'Slip status', 'Gross', 'Net', 'Withheld since', 'Release entry', 'Release date', 'Payment'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {form.cycles.map((c) => (
                      <tr key={c.month} className="border-b">
                        <td className="px-3 py-2">{c.month}</td>
                        <td className="px-3 py-2 font-mono text-xs text-indigo-700">{c.slipId}</td>
                        <td className="px-3 py-2"><Badge variant={c.slipStatus === 'Released' ? 'success' : 'warning'}>{c.slipStatus}</Badge></td>
                        <td className="px-3 py-2 text-right">{inr(c.gross)}</td>
                        <td className="px-3 py-2 text-right font-semibold">{inr(c.net)}</td>
                        <td className="px-3 py-2">{c.withheldSince}</td>
                        <td className="px-3 py-2 font-mono text-xs">{c.releaseEntry || '—'}</td>
                        <td className="px-3 py-2">{c.releaseDate || '—'}</td>
                        <td className="px-3 py-2">{c.payment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 border-t bg-gray-50 px-5 py-4 text-sm md:grid-cols-4">
                <p>Total cycles withheld: <b>{formTotals.months}</b></p>
                <p>Total net pay withheld: <b className="text-red-700">{inr(formTotals.withheld + formTotals.released)}</b></p>
                <p>Total released: <b className="text-emerald-700">{inr(formTotals.released)}</b> ({form.cycles.filter((c) => c.slipStatus === 'Released').length} cycle)</p>
                <p>Still withheld: <b className="text-amber-700">{inr(formTotals.withheld)}</b> ({formTotals.still} cycles)</p>
              </div>
            </Card>
          )}

          {form.id && (form.status === 'Active' || form.status === 'Partially Released') && (
            <Card title="C · Release workflow">
              <div className="flex flex-wrap gap-2 p-5">
                <Button onClick={() => { setSelectedCycles(form.cycles.filter((c) => c.slipStatus === 'Withheld').map((c) => c.month)); setReleaseOpen(true); }}><Unlock className="mr-1 h-4 w-4" />Release Salary</Button>
                <Button variant="outline" onClick={() => setPartialOpen(true)}>Partial release</Button>
                <Button variant="danger" onClick={() => setCancelOpen(true)}>Forfeit / cancel (reverse expense)</Button>
              </div>
              <p className="px-5 pb-4 text-xs text-gray-500">Path 2: after Make Bank Entry on Payroll Entry, use Release Withheld Salaries to create a separate bank JE for selected employees.</p>
            </Card>
          )}

          {form.id && (
            <Card title="G · Accounting treatment">
              <div className="grid gap-4 p-5 md:grid-cols-3 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="font-semibold">While withheld (on slip submit)</p>
                  <p>Salary & Wages Expense Dr {inr(95000)}</p>
                  <p>Salaries Payable Cr {inr(72660)}</p>
                  <p>EPF / TDS / PT payable Cr (statutory)</p>
                  <p className="mt-2 text-amber-700">Bank: nothing posted. Liability stays on books.</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-semibold">On release</p>
                  <p>Salaries Payable Dr {inr(72660)}</p>
                  <p>School Bank Account Cr {inr(72660)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-semibold">If forfeited (rare)</p>
                  <p>Salaries Payable Dr {inr(72660)}</p>
                  <p>Salary & Wages Expense Cr {inr(72660)}</p>
                  <p className="mt-2 text-red-700">Requires HR Head / legal approval.</p>
                </div>
              </div>
            </Card>
          )}

          <Card title="I · School enhancements">
            <ul className="list-disc space-y-1 p-5 pl-8 text-sm text-gray-700">
              <li>Document compliance hold — auto-flag if PAN / Aadhaar / police verification / CBSE qualification is missing past 30 days of joining (configured in Payroll Settings).</li>
              <li>Asset return hold — unreturned assets past due date are flagged; HR still activates the hold.</li>
              <li>CBSE qualification block — invalid teacher qualification from CBSE compliance auto-suggests a hold.</li>
              <li>Partial release — humanitarian / investigation relief without closing the hold.</li>
              <li>ESS visibility — employee sees WITHHELD; disciplinary reason is redacted to “Administrative Hold”.</li>
              <li>90-day reminder to HR Head; 60-day labor-law warning by state.</li>
              <li>F&amp;F does not auto-pay withheld slips. Release them here or offset in F&amp;F as Pending Salary — Withheld.</li>
            </ul>
          </Card>
        </>
      )}

      {tab === 'report' && (
        <Card title="Salary Withholding Report">
          <div className="grid gap-3 p-4 md:grid-cols-5">
            <Select label="Status" value={repStatus} onChange={(e) => setRepStatus(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Active', label: 'Active' }, { value: 'Partially Released', label: 'Partially Released' }, { value: 'Released', label: 'Released' }]} />
            <Select label="Department" value={repDept} onChange={(e) => setRepDept(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...['Science', 'Administration', 'Sports'].map((v) => ({ value: v, label: v }))]} />
            <Select label="Reason code" value={repReason} onChange={(e) => setRepReason(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...REASONS.map((v) => ({ value: v, label: v }))]} />
            <Input label="From date" type="date" value={repFrom} onChange={(e) => setRepFrom(e.target.value)} />
            <Input label="To date" type="date" value={repTo} onChange={(e) => setRepTo(e.target.value)} />
            <Select label="Employee" value={repEmp} onChange={(e) => setRepEmp(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...STAFF.map((s) => ({ value: s.id, label: s.name }))]} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>{['Employee', 'Dept / Desig', 'Withholding ID', 'Reason', 'From', 'Duration (days)', 'Months', 'Gross withheld', 'Net withheld', 'Released', 'Balance', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {reportRows.map((h) => {
                  const t = totals(h);
                  const gross = h.cycles.reduce((s, c) => s + c.gross, 0);
                  return (
                    <tr key={h.id} className="border-b">
                      <td className="px-3 py-2"><p className="font-medium">{h.name}</p><p className="font-mono text-xs text-gray-500">{h.employeeId}</p></td>
                      <td className="px-3 py-2 text-xs">{h.department}<br />{h.designation}</td>
                      <td className="px-3 py-2 font-mono text-xs text-indigo-700">{h.id}</td>
                      <td className="px-3 py-2 text-xs">{h.reason}<br /><span className="text-gray-400">{h.detail.slice(0, 48)}…</span></td>
                      <td className="px-3 py-2">{h.fromDate}</td>
                      <td className="px-3 py-2 text-center">{t.days}</td>
                      <td className="px-3 py-2 text-center">{t.months}</td>
                      <td className="px-3 py-2 text-right">{inr(gross)}</td>
                      <td className="px-3 py-2 text-right">{inr(t.net)}</td>
                      <td className="px-3 py-2 text-right text-emerald-700">{inr(t.released)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-red-700">{inr(t.withheld)}</td>
                      <td className="px-3 py-2">{statusBadge(h.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 border-t p-4">
            <Button variant="outline" onClick={() => flash('Withholding report exported to Excel.')}><FileText className="mr-1 h-4 w-4" />Export</Button>
          </div>
        </Card>
      )}

      <Modal isOpen={releaseOpen} onClose={() => setReleaseOpen(false)} title="Release salary" size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setReleaseOpen(false)}>Cancel</Button><Button onClick={() => applyRelease('full')}><CheckCircle className="mr-1 h-4 w-4" />Confirm release</Button></div>}>
        <p className="mb-3 text-sm text-gray-600">Creates a Bank Entry (Journal Entry) for the selected cycles. If every cycle is released and To Date has passed, status becomes Released.</p>
        <div className="space-y-2">
          {form.cycles.filter((c) => c.slipStatus === 'Withheld').map((c) => (
            <label key={c.month} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
              <input type="checkbox" checked={selectedCycles.includes(c.month)} onChange={(e) => setSelectedCycles((p) => e.target.checked ? [...p, c.month] : p.filter((m) => m !== c.month))} />
              {c.month} · {c.slipId} · {inr(c.net)}
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Textarea label="Release reason *" rows={2} value={releaseReason} onChange={(e) => setReleaseReason(e.target.value)} placeholder="Inquiry concluded — employee cleared." />
          <div className="space-y-3">
            <Input label="Release authority" value={releaseAuth} onChange={(e) => setReleaseAuth(e.target.value)} />
            <Input label="Release date" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={partialOpen} onClose={() => setPartialOpen(false)} title="Partial release" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPartialOpen(false)}>Cancel</Button><Button onClick={() => applyRelease('partial')}>Create partial bank entry</Button></div>}>
        <p className="mb-3 text-sm text-gray-600">Release part of the latest withheld cycle (e.g. humanitarian relief). Remaining balance stays withheld.</p>
        <Input label="Amount" value={partialAmt} onChange={(e) => setPartialAmt(e.target.value)} />
        <Textarea className="mt-3" label="Adjustment notes *" rows={2} value={partialNote} onChange={(e) => setPartialNote(e.target.value)} />
        <Input className="mt-3" label="Release reason *" value={releaseReason} onChange={(e) => setReleaseReason(e.target.value)} />
      </Modal>

      <Modal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} title="Forfeit withheld salary" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelOpen(false)}>Keep hold</Button><Button variant="danger" onClick={() => applyRelease('forfeit')}><Ban className="mr-1 h-4 w-4" />Post reversal JE</Button></div>}>
        <p className="text-sm text-gray-600">Reverses Salaries Payable and Salary &amp; Wages Expense. Rare. Requires legal / HR Head approval.</p>
        <Textarea className="mt-3" label="Approval note *" rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
      </Modal>
    </div>
  );
}

export default PayrollExceptionList;
