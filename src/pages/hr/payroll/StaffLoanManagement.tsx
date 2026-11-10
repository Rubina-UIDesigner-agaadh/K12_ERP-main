import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Plus } from 'lucide-react';

type Tab = 'type' | 'application' | 'loan' | 'disburse' | 'slip';
type AppStatus = 'Draft' | 'Submitted' | 'Pending Principal' | 'Approved' | 'Rejected';
type LoanType = { id: string; name: string; max: number; rate: number; method: string; months: number; loanAccount: string; interestAccount: string; bank: string; term: boolean };
type Application = { id: string; employeeId: string; employee: string; type: string; amount: number; purpose: string; months: number; mode: string; guarantor: string; docs: string[]; status: AppStatus };
type ScheduleRow = { date: string; principal: number; interest: number; emi: number; balance: number; paid: boolean };
type Loan = { id: string; application: string; employee: string; employeeId: string; type: string; amount: number; rate: number; months: number; start: string; repaySalary: boolean; account: string; schedule: ScheduleRow[]; disbursed: boolean; ref: string; status: 'Pending' | 'Disbursed' | 'Partially Disbursed' };

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const STAFF = [
  { id: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', joining: '2019-06-15', gross: 85000, outstanding: 48000, category: 'Permanent' },
  { id: 'EMP-1088', name: 'Rajesh Kumar', designation: 'TGT Maths', joining: '2021-04-01', gross: 66800, outstanding: 0, category: 'Permanent' },
  { id: 'EMP-1301', name: 'Visiting Coach', designation: 'Coach', joining: '2026-06-01', gross: 25000, outstanding: 0, category: 'Visiting' }
];

const SEED_TYPES: LoanType[] = [
  { id: 'LT-H', name: 'Staff Housing Loan', max: 500000, rate: 6, method: 'Repay Over Number of Periods', months: 120, loanAccount: 'Staff Loans Receivable', interestAccount: 'Interest Income - Staff Loans', bank: 'SBI School Account', term: true },
  { id: 'LT-F', name: 'Festival Advance Loan', max: 50000, rate: 0, method: 'Repay Fixed Amount per Period', months: 3, loanAccount: 'Staff Loans Receivable', interestAccount: '', bank: 'SBI School Account', term: false },
  { id: 'LT-C', name: 'Computer / Vehicle Loan', max: 200000, rate: 6, method: 'Repay Over Number of Periods', months: 36, loanAccount: 'Staff Loans Receivable', interestAccount: 'Interest Income - Staff Loans', bank: 'SBI School Account', term: true },
  { id: 'LT-E', name: "Children's Education Loan", max: 300000, rate: 5, method: 'Repay Over Number of Periods', months: 48, loanAccount: 'Staff Loans Receivable', interestAccount: 'Interest Income - Staff Loans', bank: 'SBI School Account', term: true },
  { id: 'LT-M', name: 'Medical Emergency Loan', max: 150000, rate: 4, method: 'Repay Over Number of Periods', months: 24, loanAccount: 'Staff Loans Receivable', interestAccount: 'Interest Income - Staff Loans', bank: 'SBI School Account', term: true }
];

function buildSchedule(amount: number, rate: number, months: number, start: string): ScheduleRow[] {
  const monthlyRate = rate / 12 / 100;
  const emi = rate === 0 ? amount / months : amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  let bal = amount;
  const rows: ScheduleRow[] = [];
  const d = new Date(`${start}T00:00:00`);
  for (let i = 0; i < months; i += 1) {
    const interest = monthlyRate === 0 ? 0 : bal * monthlyRate;
    const principal = emi - interest;
    bal = Math.max(0, bal - principal);
    const date = new Date(d); date.setMonth(d.getMonth() + i);
    rows.push({
      date: date.toISOString().slice(0, 10),
      principal: Math.round(principal),
      interest: Math.round(interest),
      emi: Math.round(emi),
      balance: Math.round(bal),
      paid: i === 0
    });
  }
  return rows;
}

export function StaffLoanManagement() {
  const [tab, setTab] = useState<Tab>('application');
  const [notice, setNotice] = useState('');
  const [types, setTypes] = useState(SEED_TYPES);
  const [typeForm, setTypeForm] = useState<LoanType>(SEED_TYPES[0]);
  const [apps, setApps] = useState<Application[]>([{
    id: 'LA-2026-009', employeeId: 'EMP-1042', employee: 'Meera Iyer', type: 'Staff Housing Loan', amount: 200000, purpose: 'Down payment for staff housing near campus.', months: 36, mode: 'Salary Deduction', guarantor: 'EMP-1088', docs: ['quotation.pdf'], status: 'Approved'
  }]);
  const [appForm, setAppForm] = useState<Application>({ id: '', employeeId: 'EMP-1042', employee: 'Meera Iyer', type: 'Festival Advance Loan', amount: 30000, purpose: '', months: 3, mode: 'Salary Deduction', guarantor: '', docs: [], status: 'Draft' });
  const [showApp, setShowApp] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([{
    id: 'LN-2026-004',
    application: 'LA-2026-009',
    employee: 'Meera Iyer',
    employeeId: 'EMP-1042',
    type: 'Staff Housing Loan',
    amount: 200000,
    rate: 6,
    months: 36,
    start: '2026-11-01',
    repaySalary: true,
    account: 'Staff Loans Receivable',
    schedule: buildSchedule(200000, 6, 36, '2026-11-01'),
    disbursed: true,
    ref: 'NEFT-441221',
    status: 'Disbursed'
  }]);
  const [openLoan, setOpenLoan] = useState<Loan | null>(loans[0]);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };
  const staff = STAFF.find((s) => s.id === appForm.employeeId);
  const lt = types.find((t) => t.name === appForm.type);

  const allowedTypes = staff?.category === 'Visiting' ? types.filter((t) => t.name === 'Festival Advance Loan') : types;
  const eligibility = (staff?.gross || 0) * 15;
  const needsPrincipal = appForm.amount > 50000;

  const submitApp = () => {
    if (!appForm.employeeId || !appForm.type || !appForm.amount || !appForm.purpose.trim()) { flash('Employee, loan type, amount and purpose are required.'); return; }
    if (lt && appForm.amount > lt.max) { flash(`Amount exceeds maximum ${inr(lt.max)} for ${lt.name}.`); return; }
    if (appForm.amount > eligibility) { flash(`Amount exceeds eligibility (${inr(eligibility)} ≈ 15× gross). Auto-rejected.`); return; }
    if (lt && appForm.months > lt.months) { flash(`Tenure cannot exceed ${lt.months} months.`); return; }
    const status: AppStatus = needsPrincipal ? 'Pending Principal' : 'Submitted';
    const record = { ...appForm, id: appForm.id || `LA-${Date.now()}`, employee: staff?.name || '', status };
    setApps((p) => [record, ...p.filter((a) => a.id !== record.id)]);
    setShowApp(false);
    flash(needsPrincipal ? 'Sent to Principal / Management (> ₹50,000).' : 'Application submitted to HR Manager.');
  };

  const approveApp = (id: string) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    setApps((p) => p.map((a) => a.id === id ? { ...a, status: 'Approved' } : a));
    const t = types.find((x) => x.name === app.type)!;
    const loan: Loan = {
      id: `LN-${Date.now()}`,
      application: app.id,
      employee: app.employee,
      employeeId: app.employeeId,
      type: app.type,
      amount: app.amount,
      rate: t.rate,
      months: app.months,
      start: '2026-12-01',
      repaySalary: true,
      account: t.loanAccount,
      schedule: buildSchedule(app.amount, t.rate, app.months, '2026-12-01'),
      disbursed: false,
      ref: '',
      status: 'Pending'
    };
    setLoans((p) => [loan, ...p]);
    setOpenLoan(loan);
    setTab('loan');
    flash('Loan record and repayment schedule created from the approved application.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Loan Management</h1>
          <p className="text-sm text-gray-500">Application → Loan & schedule → Disbursement → Salary deduction on the slip</p>
        </div>
        {tab === 'application' && <Button onClick={() => { setAppForm({ id: '', employeeId: 'EMP-1042', employee: 'Meera Iyer', type: 'Festival Advance Loan', amount: 30000, purpose: '', months: 3, mode: 'Salary Deduction', guarantor: '', docs: [], status: 'Draft' }); setShowApp(true); }}><Plus className="h-4 w-4" />New Application</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'type' as const, label: 'Loan Type' }, { id: 'application' as const, label: 'Application' }, { id: 'loan' as const, label: 'Loan & Schedule' }, { id: 'disburse' as const, label: 'Disbursement' }, { id: 'slip' as const, label: 'On Salary Slip' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'type' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Loan', 'Max', 'Rate', 'Months'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {types.map((t) => (
                  <tr key={t.id} className="cursor-pointer border-b hover:bg-indigo-50" onClick={() => setTypeForm(t)}>
                    <td className="px-2 py-2">{t.name}</td>
                    <td className="px-2 py-2">{inr(t.max)}</td>
                    <td className="px-2 py-2">{t.rate}%</td>
                    <td className="px-2 py-2">{t.months}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title="Loan Type">
            <div className="grid gap-3">
              <Input label="Loan Name" value={typeForm.name} onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })} />
              <Input label="Maximum Loan Amount" type="number" value={String(typeForm.max)} onChange={(e) => setTypeForm({ ...typeForm, max: Number(e.target.value) })} />
              <Input label="Rate of Interest (Annual %)" type="number" value={String(typeForm.rate)} onChange={(e) => setTypeForm({ ...typeForm, rate: Number(e.target.value) })} />
              <Select label="Repayment Method" value={typeForm.method} onChange={(e) => setTypeForm({ ...typeForm, method: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'Repay Over Number of Periods', label: 'Repay Over Number of Periods' }, { value: 'Repay Fixed Amount per Period', label: 'Repay Fixed Amount per Period' }]} />
              <Input label="Maximum Loan Period (Months)" type="number" value={String(typeForm.months)} onChange={(e) => setTypeForm({ ...typeForm, months: Number(e.target.value) })} />
              <Input label="Loan Account" value={typeForm.loanAccount} onChange={(e) => setTypeForm({ ...typeForm, loanAccount: e.target.value })} />
              <Input label="Interest Income Account" value={typeForm.interestAccount} onChange={(e) => setTypeForm({ ...typeForm, interestAccount: e.target.value })} />
              <Input label="Disbursement Account" value={typeForm.bank} onChange={(e) => setTypeForm({ ...typeForm, bank: e.target.value })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={typeForm.term} onChange={(e) => setTypeForm({ ...typeForm, term: e.target.checked })} /> Is Term Loan</label>
              <Button onClick={() => { setTypes((p) => p.some((x) => x.id === typeForm.id) ? p.map((x) => x.id === typeForm.id ? typeForm : x) : [{ ...typeForm, id: `LT-${Date.now()}` }, ...p]); flash('Loan type saved.'); }}>Save Loan Type</Button>
            </div>
          </Card>
        </div>
      )}

      {tab === 'application' && !showApp && (
        <Card>
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Application', 'Employee', 'Type', 'Amount', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{a.id}</td>
                  <td className="px-3 py-2">{a.employee}</td>
                  <td className="px-3 py-2">{a.type}</td>
                  <td className="px-3 py-2">{inr(a.amount)}</td>
                  <td className="px-3 py-2"><Badge variant={a.status === 'Approved' ? 'success' : a.status === 'Rejected' ? 'danger' : 'warning'}>{a.status}</Badge></td>
                  <td className="px-3 py-2">
                    {(a.status === 'Submitted' || a.status === 'Pending Principal') && (
                      <>
                        <Button size="xs" onClick={() => approveApp(a.id)}>Approve</Button>
                        <Button size="xs" variant="ghost" onClick={() => { setApps((p) => p.map((x) => x.id === a.id ? { ...x, status: 'Rejected' } : x)); flash('Application rejected.'); }}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'application' && showApp && (
        <Card title="Loan Application">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={appForm.employeeId} onChange={(e) => {
              const id = typeof e === 'string' ? e : e.target.value;
              const s = STAFF.find((x) => x.id === id);
              setAppForm({ ...appForm, employeeId: id, employee: s?.name || '', type: s?.category === 'Visiting' ? 'Festival Advance Loan' : appForm.type });
            }} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            {staff && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                {staff.designation} · Joined {staff.joining} · Gross {inr(staff.gross)}
                <p>Outstanding loan balance: <b>{inr(staff.outstanding)}</b></p>
                <p>Eligibility cap ≈ 15× gross: {inr(eligibility)}</p>
              </div>
            )}
            <Select label="Loan Type *" value={appForm.type} onChange={(e) => setAppForm({ ...appForm, type: typeof e === 'string' ? e : e.target.value })} options={allowedTypes.map((t) => ({ value: t.name, label: `${t.name} (max ${inr(t.max)})` }))} />
            <Input label="Loan Amount Requested *" type="number" value={String(appForm.amount)} onChange={(e) => setAppForm({ ...appForm, amount: Number(e.target.value) })} />
            <Input label="Repayment Period (Months)" type="number" value={String(appForm.months)} onChange={(e) => setAppForm({ ...appForm, months: Number(e.target.value) })} />
            <Select label="Mode of Repayment" value={appForm.mode} onChange={(e) => setAppForm({ ...appForm, mode: typeof e === 'string' ? e : e.target.value })} options={['Salary Deduction', 'Cash', 'Bank Transfer'].map((v) => ({ value: v, label: v }))} />
            <Select label="Guarantor" value={appForm.guarantor} onChange={(e) => setAppForm({ ...appForm, guarantor: typeof e === 'string' ? e : e.target.value })} options={[{ value: '', label: 'None' }, ...STAFF.filter((s) => s.id !== appForm.employeeId).map((s) => ({ value: s.id, label: s.name }))]} />
            <div className="md:col-span-2"><Textarea label="Purpose *" rows={3} value={appForm.purpose} onChange={(e) => setAppForm({ ...appForm, purpose: e.target.value })} /></div>
            <Button size="sm" variant="outline" onClick={() => setAppForm({ ...appForm, docs: [...appForm.docs, 'supporting-document.pdf'] })}>Attach supporting document</Button>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowApp(false)}>Cancel</Button>
            <Button onClick={submitApp}>Submit Application</Button>
          </div>
        </Card>
      )}

      {tab === 'loan' && (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Card>
            {loans.map((l) => (
              <button key={l.id} type="button" onClick={() => setOpenLoan(l)} className={`mb-2 w-full rounded-lg border px-3 py-2 text-left text-sm ${openLoan?.id === l.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                <p className="font-medium">{l.employee}</p>
                <p className="text-xs text-gray-500">{l.type} · {inr(l.amount)}</p>
              </button>
            ))}
          </Card>
          {openLoan && (
            <Card title={`${openLoan.id} · ${openLoan.employee}`}>
              <div className="grid gap-3 md:grid-cols-3">
                <Input label="Applicant" value={openLoan.employee} readOnly />
                <Input label="Loan Application" value={openLoan.application} readOnly />
                <Input label="Repayment Start Date" type="date" value={openLoan.start} onChange={(e) => {
                  const start = e.target.value;
                  const schedule = buildSchedule(openLoan.amount, openLoan.rate, openLoan.months, start);
                  const next = { ...openLoan, start, schedule };
                  setOpenLoan(next);
                  setLoans((p) => p.map((x) => x.id === next.id ? next : x));
                }} />
                <label className="flex items-center gap-2 text-sm md:col-span-3"><input type="checkbox" checked={openLoan.repaySalary} onChange={(e) => {
                  const next = { ...openLoan, repaySalary: e.target.checked };
                  setOpenLoan(next);
                  setLoans((p) => p.map((x) => x.id === next.id ? next : x));
                }} /> Repay from Salary — EMI appears on the salary slip</label>
              </div>
              <p className="mt-4 text-sm font-semibold">Repayment Schedule <span className="text-xs font-normal text-gray-400">(edit a row to extend after LWP)</span></p>
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="sticky top-0 bg-gray-50 text-left text-xs uppercase text-gray-500">{['Payment Date', 'Principal', 'Interest', 'EMI', 'Balance', 'Paid'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>
                    {openLoan.schedule.map((r, i) => (
                      <tr key={r.date} className="border-b">
                        <td className="px-2 py-1"><input type="date" className="rounded border px-1 py-1 text-xs" value={r.date} onChange={(e) => {
                          const schedule = openLoan.schedule.map((x, j) => j === i ? { ...x, date: e.target.value } : x);
                          const next = { ...openLoan, schedule };
                          setOpenLoan(next);
                          setLoans((p) => p.map((x) => x.id === next.id ? next : x));
                        }} /></td>
                        <td className="px-2 py-1">{inr(r.principal)}</td>
                        <td className="px-2 py-1">{inr(r.interest)}</td>
                        <td className="px-2 py-1 font-semibold">{inr(r.emi)}</td>
                        <td className="px-2 py-1">{inr(r.balance)}</td>
                        <td className="px-2 py-1">{r.paid ? 'Yes' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'disburse' && openLoan && (
        <Card title="Loan Disbursement">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Disbursement Date" type="date" defaultValue="2026-10-15" />
            <Input label="Disbursement Reference" value={openLoan.ref} onChange={(e) => {
              const next = { ...openLoan, ref: e.target.value };
              setOpenLoan(next);
              setLoans((p) => p.map((x) => x.id === next.id ? next : x));
            }} />
            <p className="text-sm text-gray-600 md:col-span-2">Creates Payment Entry: Dr. Staff Loans Receivable / Cr. School Bank Account for {inr(openLoan.amount)}.</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={openLoan.disbursed ? 'success' : 'warning'}>{openLoan.status}</Badge>
            {!openLoan.disbursed && <Button onClick={() => { const next = { ...openLoan, disbursed: true, status: 'Disbursed' as const, ref: openLoan.ref || 'NEFT-441221' }; setOpenLoan(next); setLoans((p) => p.map((x) => x.id === next.id ? next : x)); flash('Disbursement payment entry created.'); }}>Create Disbursement Entry</Button>}
          </div>
        </Card>
      )}

      {tab === 'slip' && openLoan && (
        <Card title="Loan on Salary Slip">
          {!openLoan.repaySalary && <p className="text-sm text-gray-500">Enable “Repay from Salary” on the loan record to auto-deduct EMI.</p>}
          {openLoan.repaySalary && (
            <>
              <div className="rounded-lg bg-red-50 p-4 font-mono text-xs text-red-800 whitespace-pre-wrap">{`DEDUCTIONS:\nEmployee PF ......................... ₹1,800\nProfessional Tax ...................... ₹200\nIncome Tax (TDS) .................. ₹4,500\n${openLoan.type} EMI ............. ${inr(openLoan.schedule[0]?.emi || 0)}\n  (Principal: ${inr(openLoan.schedule[0]?.principal || 0)} | Interest: ${inr(openLoan.schedule[0]?.interest || 0)})\nTotal Deductions`}</div>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {[
                    ['Loan Type', openLoan.type],
                    ['EMI Amount', inr(openLoan.schedule[0]?.emi || 0)],
                    ['Principal Component', inr(openLoan.schedule[0]?.principal || 0)],
                    ['Interest Component', inr(openLoan.schedule[0]?.interest || 0)],
                    ['Total Outstanding', inr(openLoan.schedule[0]?.balance || 0)],
                    ['Loan Closes On', openLoan.schedule[openLoan.schedule.length - 1]?.date || '—']
                  ].map(([k, v]) => <tr key={k} className="border-b"><td className="py-2 text-gray-500">{k}</td><td className="py-2 font-medium">{v}</td></tr>)}
                </tbody>
              </table>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

export default StaffLoanManagement;
