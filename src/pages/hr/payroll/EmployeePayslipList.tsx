import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Download, Eye, Printer, Search, Send, X } from 'lucide-react';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type SlipStatus = 'Draft' | 'Submitted' | 'Cancelled' | 'Withheld' | 'Released';
type EarnRow = { name: string; abbr: string; formula: string; amount: number; ytd: number; additional?: boolean; disabled?: boolean };
type DedRow = { name: string; abbr: string; formula: string; amount: number; ytd: number; kind?: 'tds' | 'loan' | 'lwp' | 'epf' | 'pt' };
type Slip = {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  branch: string;
  period: string;
  structure: string;
  frequency: string;
  joining: string;
  prorated: boolean;
  present: number;
  paidLeave: number;
  unpaidLeave: number;
  holidays: number;
  workingDays: number;
  workingHours: number;
  paymentDate: string;
  earnings: EarnRow[];
  deductions: DedRow[];
  gross: number;
  net: number;
  paymentMode: string;
  bank: string;
  account: string;
  status: SlipStatus;
  email: string;
  withholdId?: string;
  withholdReason?: string;
};

const SLIPS: Slip[] = [
  {
    id: 'HR-SLIP-10-2026-0023',
    employeeId: 'EMP-1001',
    name: 'Rajesh Kumar',
    department: 'Science',
    designation: 'PGT Physics',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Teaching Staff - Permanent',
    frequency: 'Monthly',
    joining: '15 Jun 2019',
    prorated: false,
    present: 24,
    paidLeave: 1,
    unpaidLeave: 1,
    holidays: 4,
    workingDays: 26,
    workingHours: 208,
    paymentDate: '2026-11-01',
    earnings: [
      { name: 'Basic Pay', abbr: 'BASIC', formula: 'Fixed', amount: 50000, ytd: 350000 },
      { name: 'DA', abbr: 'DA', formula: 'basic * 0.45', amount: 22500, ytd: 157500 },
      { name: 'HRA', abbr: 'HRA', formula: 'basic * 0.40', amount: 20000, ytd: 140000 },
      { name: 'Overtime Pay (8 hrs × ₹312.50)', abbr: 'OT', formula: '(basic / 26 / 8) * ot_hours * 1.5', amount: 2500, ytd: 2500, additional: true }
    ],
    deductions: [
      { name: 'EPF (Employee)', abbr: 'EPF', formula: '12% of Basic, capped at ₹1,800', amount: 1800, ytd: 12600, kind: 'epf' },
      { name: 'Professional Tax', abbr: 'PT', formula: 'State: Gujarat — Slab: ₹200/month', amount: 200, ytd: 1400, kind: 'pt' },
      { name: 'Income Tax (TDS)', abbr: 'TDS', formula: 'Projected annual / remaining months', amount: 3200, ytd: 9464, kind: 'tds' },
      { name: 'Loan EMI', abbr: 'LOAN', formula: 'Principal ₹2,000 + Interest ₹500', amount: 2500, ytd: 17500, kind: 'loan' },
      { name: 'LWP Deduction', abbr: 'LWP', formula: '(Basic ÷ Working Days) × LWP Days', amount: 1923, ytd: 1923, kind: 'lwp' }
    ],
    gross: 95000,
    net: 85377,
    paymentMode: 'Bank transfer',
    bank: 'SBI',
    account: 'XXXX XXXX 1234',
    status: 'Draft',
    email: 'rajesh.kumar@school.edu'
  },
  {
    id: 'HR-SLIP-10-2026-0024',
    employeeId: 'EMP-1002',
    name: 'Priya Nair',
    department: 'Mathematics',
    designation: 'TGT Maths',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Teaching Staff - Permanent',
    frequency: 'Monthly',
    joining: '01 Apr 2021',
    prorated: false,
    present: 26,
    paidLeave: 0,
    unpaidLeave: 0,
    holidays: 4,
    workingDays: 26,
    workingHours: 208,
    paymentDate: '2026-11-01',
    earnings: [
      { name: 'Basic Pay', abbr: 'BASIC', formula: 'Fixed', amount: 42000, ytd: 294000 },
      { name: 'HRA', abbr: 'HRA', formula: 'basic * 0.40', amount: 16800, ytd: 117600 },
      { name: 'Allowances', abbr: 'ALW', formula: 'Fixed', amount: 8000, ytd: 56000 }
    ],
    deductions: [
      { name: 'EPF (Employee)', abbr: 'EPF', formula: '12% of Basic, capped at ₹1,800', amount: 1800, ytd: 12600, kind: 'epf' },
      { name: 'Professional Tax', abbr: 'PT', formula: 'State: Gujarat — Slab: ₹200/month', amount: 200, ytd: 1400, kind: 'pt' },
      { name: 'Income Tax (TDS)', abbr: 'TDS', formula: 'Projected annual / remaining months', amount: 2100, ytd: 14700, kind: 'tds' }
    ],
    gross: 66800,
    net: 62700,
    paymentMode: 'Bank transfer',
    bank: 'HDFC Bank',
    account: 'XXXX XXXX 5678',
    status: 'Submitted',
    email: 'priya.nair@school.edu'
  },
  {
    id: 'HR-SLIP-10-2026-0025',
    employeeId: 'EMP-1003',
    name: 'Anil Patel',
    department: 'Administration',
    designation: 'Clerk',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Non-Teaching Grade C',
    frequency: 'Monthly',
    joining: '15 Oct 2026',
    prorated: true,
    present: 16,
    paidLeave: 0,
    unpaidLeave: 0,
    holidays: 2,
    workingDays: 16,
    workingHours: 128,
    paymentDate: '2026-11-01',
    earnings: [
      { name: 'Basic Pay', abbr: 'BASIC', formula: 'Pro-rated', amount: 18000, ytd: 18000 },
      { name: 'HRA', abbr: 'HRA', formula: 'basic * 0.40', amount: 7000, ytd: 7000 },
      { name: 'Allowances', abbr: 'ALW', formula: 'Fixed', amount: 5000, ytd: 5000 }
    ],
    deductions: [
      { name: 'EPF (Employee)', abbr: 'EPF', formula: '12% of Basic', amount: 1200, ytd: 1200, kind: 'epf' },
      { name: 'Professional Tax', abbr: 'PT', formula: 'State: Gujarat', amount: 200, ytd: 200, kind: 'pt' },
      { name: 'Income Tax (TDS)', abbr: 'TDS', formula: 'Monthly TDS', amount: 600, ytd: 600, kind: 'tds' }
    ],
    gross: 30000,
    net: 28000,
    paymentMode: 'Bank transfer',
    bank: 'Axis Bank',
    account: 'XXXX XXXX 9012',
    status: 'Submitted',
    email: 'anil.patel@school.edu'
  },
  {
    id: 'HR-SLIP-10-2026-0088',
    employeeId: 'EMP-2048',
    name: 'Sunita Rao',
    department: 'Science',
    designation: 'PGT Physics',
    branch: 'Main Branch',
    period: 'October 2026',
    structure: 'Teaching Grade A 2026',
    frequency: 'Monthly',
    joining: '12 Jun 2016',
    prorated: false,
    present: 26,
    paidLeave: 0,
    unpaidLeave: 0,
    holidays: 4,
    workingDays: 26,
    workingHours: 208,
    paymentDate: '2026-11-01',
    earnings: [
      { name: 'Basic Pay', abbr: 'BASIC', formula: 'Fixed', amount: 50000, ytd: 350000 },
      { name: 'DA', abbr: 'DA', formula: 'basic * 0.45', amount: 22500, ytd: 157500 },
      { name: 'HRA', abbr: 'HRA', formula: 'basic * 0.40', amount: 20000, ytd: 140000 },
      { name: 'Allowances', abbr: 'ALW', formula: 'Fixed', amount: 2500, ytd: 17500 }
    ],
    deductions: [
      { name: 'EPF (Employee)', abbr: 'EPF', formula: '12% of Basic, capped at ₹1,800', amount: 1800, ytd: 12600, kind: 'epf' },
      { name: 'Professional Tax', abbr: 'PT', formula: 'State: Gujarat — Slab: ₹200/month', amount: 200, ytd: 1400, kind: 'pt' },
      { name: 'Income Tax (TDS)', abbr: 'TDS', formula: 'Projected annual / remaining months', amount: 10740, ytd: 75180, kind: 'tds' }
    ],
    gross: 95000,
    net: 72660,
    paymentMode: 'Bank transfer',
    bank: 'SBI',
    account: 'XXXX XXXX 4411',
    status: 'Withheld',
    email: 'sunita.rao@school.edu',
    withholdId: 'SW-2026-001',
    withholdReason: 'Disciplinary Investigation — pending inquiry.'
  }
];

function words(n: number) {
  return `${n.toLocaleString('en-IN')} Only`;
}

export function EmployeePayslipList() {
  const [slips, setSlips] = useState(SLIPS);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Slip | null>(null);
  const [notice, setNotice] = useState('');
  const [taxOpen, setTaxOpen] = useState(true);
  const [loanOpen, setLoanOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [amendOpen, setAmendOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [popover, setPopover] = useState<string | null>(null);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return slips.filter((s) => !q || `${s.name} ${s.employeeId} ${s.period} ${s.id}`.toLowerCase().includes(q));
  }, [slips, search]);

  const patch = (id: string, status: SlipStatus) => {
    setSlips((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    if (open?.id === id) setOpen({ ...open, status });
  };

  const paymentDays = open ? open.workingDays - open.unpaidLeave : 0;
  const gross = open ? open.earnings.filter((e) => !e.disabled).reduce((s, e) => s + e.amount, 0) : 0;
  const deductions = open ? open.deductions.filter((d) => !(d.kind === 'lwp' && d.amount === 0)).reduce((s, d) => s + d.amount, 0) : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Slips</h1>
        <p className="text-sm text-gray-500">Each slip shows the finalized payroll calculation. It does not recalculate salary with different rules.</p>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {!open && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee, slip ID or period" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>{['Employee', 'Slip ID', 'Period', 'Structure', 'Gross', 'Net', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2"><p className="font-medium">{s.name}</p><p className="text-xs text-gray-500">{s.employeeId} · {s.designation}</p></td>
                    <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                    <td className="px-3 py-2">{s.period}</td>
                    <td className="px-3 py-2 text-xs">{s.structure}</td>
                    <td className="px-3 py-2">{inr(s.gross)}</td>
                    <td className="px-3 py-2 font-semibold">{inr(s.net)}</td>
                    <td className="px-3 py-2"><Badge variant={s.status === 'Submitted' || s.status === 'Released' ? 'success' : s.status === 'Cancelled' ? 'danger' : s.status === 'Withheld' ? 'warning' : 'warning'}>{s.status}</Badge></td>
                    <td className="px-3 py-2">
                      <Button size="xs" variant="ghost" onClick={() => { setOpen(s); setPopover(null); }}><Eye className="h-3.5 w-3.5" />View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {open && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Salary Slip</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[11px] font-semibold text-gray-500">{open.id}</span>
                <Badge variant={open.status === 'Submitted' || open.status === 'Released' ? 'success' : open.status === 'Cancelled' ? 'danger' : 'warning'}>{open.status === 'Withheld' ? 'WITHHELD' : open.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500">{open.period} · {open.frequency} · {open.structure}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpen(null)}><X className="mr-1 h-4 w-4" />Back to list</Button>
          </div>

          {open.status === 'Withheld' && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-bold uppercase tracking-wide text-amber-800">WITHHELD — payment pending</p>
              <p className="mt-1">Withholding reference: <button type="button" className="font-mono text-indigo-700 underline" onClick={() => flash(`Open ${open.withholdId} on Salary Withholding & Release.`)}>{open.withholdId}</button></p>
              <p>Reason (read-only): {open.withholdReason}</p>
              <p className="mt-1 text-xs">All amounts are calculated. Accrual is booked. Bank Entry is excluded from disbursement.</p>
            </div>
          )}

          <Card>
            <div className="flex flex-wrap items-center gap-5 p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-700">{open.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-900">{open.name}</p>
                <p className="font-mono text-sm text-gray-400">{open.employeeId}</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant="info">{open.department}</Badge>
                  <Badge variant="success">{open.designation}</Badge>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-[11px] font-semibold uppercase text-gray-400">Bank Account</p>
                <p className="font-mono text-gray-700">{open.account}</p>
                <p className="text-xs text-gray-400">{open.bank}</p>
              </div>
            </div>
            <div className="grid gap-3 border-t px-5 py-4 text-sm md:grid-cols-5">
              <p><span className="text-xs uppercase text-gray-400">Salary Structure</span><br />{open.structure}</p>
              <p><span className="text-xs uppercase text-gray-400">Payroll Frequency</span><br /><Badge variant="secondary">{open.frequency}</Badge></p>
              <p><span className="text-xs uppercase text-gray-400">Period</span><br />01 Oct 2026 — 31 Oct 2026</p>
              <p><span className="text-xs uppercase text-gray-400">Payment Date</span><br />{open.paymentDate}</p>
              <p><span className="text-xs uppercase text-gray-400">Date of Joining</span><br />{open.joining} {open.prorated && <Badge variant="warning">Pro-rated</Badge>}</p>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-around gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
            {[
              { label: 'Working Days', value: open.workingDays, color: 'text-gray-900' },
              { label: 'Total Working Hours', value: open.workingHours, color: 'text-gray-900' },
              { label: 'Present', value: open.present, color: 'text-emerald-600' },
              { label: 'Leaves', value: open.paidLeave, color: 'text-blue-500' },
              { label: 'LWP', value: open.unpaidLeave, color: 'text-red-500' },
              { label: 'Holidays', value: open.holidays, color: 'text-indigo-500' }
            ].map((s) => (
              <div key={s.label} className="min-w-[90px]">
                <p className="text-[11px] font-semibold uppercase text-gray-400">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <p className="text-right text-xs italic text-gray-400">Payment Days = Working Days ({open.workingDays}) − LWP ({open.unpaidLeave}) = {paymentDays}</p>

          {open.prorated && (
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm text-blue-700">Pro-rated salary: Employee joined on {open.joining}. Payment days: {open.workingDays} of 26.</div>
          )}

          <Card noPadding>
            <div className="flex items-center justify-between bg-emerald-50 px-5 py-3">
              <p className="font-semibold text-emerald-800">Earnings</p>
              <p className="font-bold text-emerald-700">Gross: {inr(gross)}</p>
            </div>
            <table className="w-full text-sm" role="table" aria-label="Earnings breakdown">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-400">
                  {['Component', 'Formula / Type', 'Amount', 'YTD'].map((h) => <th key={h} className="px-5 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {open.earnings.map((row) => (
                  <tr key={row.abbr} className={`border-b ${row.disabled ? 'bg-gray-50 opacity-40' : 'hover:bg-emerald-50/40'}`}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.additional && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />}{row.name}</p>
                      <p className="font-mono text-[11px] text-gray-400">{row.abbr} {row.additional && <Badge variant="warning">Additional</Badge>}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{row.formula}</td>
                    <td className="px-5 py-3 text-right">
                      <button type="button" className="font-semibold underline-offset-2 hover:underline" onClick={() => setPopover(popover === row.abbr ? null : row.abbr)}>{inr(row.amount)}</button>
                      {popover === row.abbr && <p className="mt-1 rounded border bg-white p-2 text-left text-xs text-gray-600">{row.name} = {row.formula} = {inr(row.amount)}</p>}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400">{inr(row.ytd)}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-50 font-bold text-emerald-800">
                  <td className="px-5 py-3" colSpan={2}>Gross Earnings</td>
                  <td className="px-5 py-3 text-right">{inr(gross)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </Card>

          <Card noPadding>
            <div className="flex items-center justify-between bg-red-50 px-5 py-3">
              <p className="font-semibold text-red-800">Deductions</p>
              <p className="font-bold text-red-700">Total: {inr(deductions)}</p>
            </div>
            <table className="w-full text-sm" role="table" aria-label="Deductions breakdown">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-400">
                  {['Component', 'Formula / Type', 'Amount', 'YTD'].map((h) => <th key={h} className="px-5 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {open.deductions.filter((d) => !(d.kind === 'lwp' && d.amount === 0)).map((row) => (
                  <tr key={row.abbr} className={`border-b hover:bg-red-50/30 ${row.kind === 'tds' ? 'border-l-4 border-l-amber-400' : ''}`}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.name}</p>
                      <p className="font-mono text-[11px] text-gray-400">{row.abbr}</p>
                      {row.kind === 'loan' && (
                        <button type="button" className="text-xs text-indigo-600" onClick={() => setLoanOpen((v) => !v)}>{loanOpen ? 'Hide EMI' : 'Show EMI'}</button>
                      )}
                      {loanOpen && row.kind === 'loan' && <p className="text-xs text-gray-500">Principal: ₹2,000 · Interest: ₹500 · Outstanding: ₹48,000</p>}
                    </td>
                    <td className="px-5 py-3 text-xs italic text-gray-500">{row.formula}</td>
                    <td className="px-5 py-3 text-right font-semibold">{inr(row.amount)}</td>
                    <td className="px-5 py-3 text-right text-gray-400">{inr(row.ytd)}</td>
                  </tr>
                ))}
                <tr className="bg-red-50 font-bold text-red-800">
                  <td className="px-5 py-3" colSpan={2}>Total Deductions</td>
                  <td className="px-5 py-3 text-right">({inr(deductions)})</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </Card>

          <div className="rounded-2xl bg-indigo-700 p-6 text-white shadow">
            <div className="flex justify-between text-indigo-200"><span className="text-[11px] font-semibold uppercase tracking-wider">Gross Earnings</span><span className="text-xl font-bold text-white">{inr(gross)}</span></div>
            <div className="my-3 border-t border-dashed border-indigo-400" />
            <div className="flex justify-between text-indigo-200"><span className="text-[11px] font-semibold uppercase tracking-wider">Total Deductions</span><span className="text-xl font-bold text-red-200">({inr(deductions)})</span></div>
            <div className="my-3 border-t-2 border-indigo-400" />
            <div className="flex justify-between"><span className="text-sm font-bold uppercase tracking-wider text-indigo-100">Net Pay</span><span className="text-3xl font-extrabold">{inr(open.net)}</span></div>
            <p className="mt-2 text-right text-sm italic text-indigo-200">{words(open.net)}</p>
          </div>

          {open.status === 'Withheld' && (
            <Card title="Bank Entry">
              <p className="text-sm text-gray-600">Excluded from bank disbursement. No Bank Entry is linked while the withholding is active.</p>
            </Card>
          )}

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { l: 'Casual Leave', v: '6', c: 'text-blue-500' },
              { l: 'Earned Leave', v: '12', c: 'text-emerald-500' },
              { l: 'Sick Leave', v: '4', c: 'text-amber-500' },
              { l: 'Maternity / Other', v: '0', c: 'text-purple-500' }
            ].map((x) => (
              <div key={x.l} className="rounded-lg bg-gray-50 p-3">
                <p className="text-[11px] font-semibold uppercase text-gray-400">{x.l}</p>
                <p className={`text-lg font-bold ${x.c}`}>{x.v}</p>
              </div>
            ))}
          </div>

          {open.deductions.some((d) => d.kind === 'loan') && (
            <Card title="Loans & Advances">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-400">
                    {['Loan Type', 'EMI', 'Principal', 'Interest', 'Outstanding'].map((h) => <th key={h} className="py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2">Personal Loan <Badge variant="success">Active</Badge></td>
                    <td>{inr(2500)}</td>
                    <td className="text-gray-500">{inr(2000)}</td>
                    <td className="text-gray-500">{inr(500)}</td>
                    <td className="font-semibold">{inr(48000)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">Staff Advance · Original: ₹10,000 · Recovered: ₹7,000 · Balance: ₹3,000</div>
            </Card>
          )}

          <Card noPadding>
            <button type="button" className="flex w-full items-center justify-between bg-gray-50 px-5 py-3 text-left" onClick={() => setTaxOpen((v) => !v)} aria-expanded={taxOpen}>
              <span className="font-semibold text-gray-800">Income Tax Computation Breakup</span>
              <span className="text-sm text-gray-500">{taxOpen ? 'Hide' : 'Show'}</span>
            </button>
            {taxOpen && (
              <div className="space-y-4 p-5 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Annual projection (this payroll period)</p>
                {[
                  ['Gross Annual Salary (Projected)', inr(1020000)],
                  ['Other Income (declared)', inr(24000)],
                  ['Standard Deduction', `(${inr(75000)})`],
                  ['HRA Exemption', `(${inr(96000)})`],
                  ['Section 80C (PF, LIC, ELSS)', `(${inr(150000)})`],
                  ['Section 80D (Medical insurance)', `(${inr(25000)})`],
                  ['Declared Deductions (80C, HRA, etc.)', `(${inr(250000)})`],
                  ['Net Taxable Income', inr(770000)]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-50 py-1"><span>{k}</span><span className="font-semibold">{v}</span></div>
                ))}
                <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Tax as per selected regime</p>
                {[
                  ['Tax Computed (New Regime — selected)', inr(54600)],
                  ['Rebate u/s 87A', inr(0)],
                  ['Surcharge', inr(0)],
                  ['Health & Education Cess (4%)', inr(2184)],
                  ['Total Tax Payable', inr(56784)]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-50 py-1"><span>{k}</span><span className="font-semibold">{v}</span></div>
                ))}
                <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Monthly TDS on this slip</p>
                {[
                  ['Tax Paid Till Date (YTD TDS)', inr(9464)],
                  ['Remaining Tax to Recover', inr(47320)],
                  ['Monthly TDS this month', inr(open.deductions.find((d) => d.kind === 'tds')?.amount || 3200)]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-50 py-1"><span>{k}</span><span className="font-semibold">{v}</span></div>
                ))}
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-3 bg-emerald-500" style={{ width: '16.7%' }} />
                </div>
                <div className="flex justify-between text-xs"><span className="text-emerald-600">Paid: ₹9,464 (16.7%)</span><span className="italic text-gray-400">₹4,302/month for 11 months</span><span className="text-red-600">Remaining: ₹47,320 (83.3%)</span></div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border bg-gray-50 p-4"><p className="text-sm font-semibold">Old Regime</p><p className="text-lg font-bold">{inr(62400)}</p></div>
                  <div className="rounded-lg border bg-gray-50 p-4"><p className="text-sm font-semibold">New Regime</p><p className="text-lg font-bold">{inr(56784)}</p><Badge variant="success">Saves ₹5,616</Badge></div>
                </div>
              </div>
            )}
          </Card>

          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 shadow">
            <p className="text-xs text-gray-400"><Badge variant={open.status === 'Submitted' || open.status === 'Released' ? 'success' : open.status === 'Cancelled' ? 'danger' : 'warning'}>{open.status}</Badge> Last saved 2 min ago</p>
            <div className="flex flex-wrap gap-2">
              {open.status === 'Draft' && <Button variant="outline" size="sm" onClick={() => flash('Salary Slip Saved')}>Save</Button>}
              {open.status === 'Draft' && <Button size="sm" onClick={() => { patch(open.id, 'Submitted'); flash('Salary Slip Submitted — Email sent to employee'); }}>Submit</Button>}
              <Button variant="outline" size="sm" onClick={() => setPrintOpen(true)}><Printer className="h-4 w-4" />Print</Button>
              {open.status === 'Submitted' && <Button variant="outline" size="sm" onClick={() => flash(`Payslip emailed to ${open.email}`)}><Send className="h-4 w-4" />Email</Button>}
              {open.status === 'Submitted' && <Button variant="warning" size="sm" onClick={() => setAmendOpen(true)}>Amend</Button>}
              {open.status === 'Submitted' && <Button variant="outline" size="sm" onClick={() => setCancelOpen(true)}>Cancel</Button>}
              <Button variant="outline" size="sm" onClick={() => flash(`PDF downloaded for ${open.name}.`)}><Download className="h-4 w-4" />PDF</Button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={printOpen} onClose={() => setPrintOpen(false)} title="Print Preview" size="xl" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPrintOpen(false)}>Close</Button><Button onClick={() => { window.print(); flash('Print started.'); }}>Print</Button></div>}>
        {open && (
          <div className="space-y-2 text-sm">
            <p className="font-bold">EduManager School · {open.id}</p>
            {open.status === 'Withheld' && <p className="text-center text-lg font-black tracking-widest text-amber-700">SALARY WITHHELD — PAYMENT PENDING</p>}
            <p>{open.name} · {open.period} · Net {inr(open.net)}</p>
            <p className="text-xs text-gray-400">PDF is password-protected. Password: Employee's Date of Birth (DDMMYYYY). This is a computer-generated document. Confidential.</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={amendOpen} onClose={() => setAmendOpen(false)} title="Amend slip" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setAmendOpen(false)}>Cancel</Button><Button variant="warning" onClick={() => { if (open) { patch(open.id, 'Draft'); flash(`Slip cancelled. New draft ${open.id}-1 created`); } setAmendOpen(false); }}>Amend Slip</Button></div>}>
        <p className="text-sm text-gray-600">This will cancel the current slip and create a new draft for correction. Continue?</p>
      </Modal>

      <Modal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel slip" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelOpen(false)}>Keep</Button><Button variant="danger" onClick={() => { if (open) { patch(open.id, 'Cancelled'); flash('Salary slip cancelled.'); } setCancelOpen(false); }}>Cancel Slip</Button></div>}>
        <p className="text-sm text-gray-600">Cancel this submitted salary slip? This is a destructive action.</p>
      </Modal>
    </div>
  );
}

export default EmployeePayslipList;
