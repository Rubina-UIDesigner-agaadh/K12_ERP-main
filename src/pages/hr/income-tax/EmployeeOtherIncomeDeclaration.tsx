import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save, Trash2 } from 'lucide-react';
import { calculateIncomeTax, remainingPayrollMonths } from './incomeTax';

const SOURCES = [
  'House Property Income / Rental Income',
  'Home Loan Interest Loss (Section 24b)',
  'Bank Interest (FD/Savings/RD)',
  'Tuition / Private Coaching Income',
  'Digital / Online Course Revenue',
  'Agricultural Income',
  'Dividend Income',
  'Capital Gains',
  'Other'
];
const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', regime: 'Old' as const, ctc: 1200000 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', regime: 'New' as const, ctc: 900000 },
  { id: 'EMP-1144', name: 'Priya Nair', regime: 'Old' as const, ctc: 1100000 }
];
const PERIODS = [{ id: 'AY-2026-27', label: 'AY 2026-27 Payroll Period' }];
const STORE = 'k12-other-income-declaration-v1';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type Status = 'Draft' | 'Submitted' | 'Cancelled';
type Row = { id: string; source: string; description: string; annual: number; exemptOn: boolean; exemptAmt: number };
type Rec = {
  id: string;
  employeeId: string;
  employeeName: string;
  periodId: string;
  submittedOn: string;
  academicYear: string;
  status: Status;
  rows: Row[];
  hasHomeLoan: boolean;
  propertyType: 'Self-Occupied' | 'Let-Out';
  interestPaid: number;
  lender: string;
  loanAccount: string;
};

const emptyRow = (): Row => ({ id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, source: 'Tuition / Private Coaching Income', description: '', annual: 0, exemptOn: false, exemptAmt: 0 });
const load = (): Rec[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Rec[] : [];
  } catch {
    return [];
  }
};

export function EmployeeOtherIncomeDeclaration() {
  const [list, setList] = useState<Rec[]>(load);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('hr');
  const [form, setForm] = useState<Rec>({
    id: '',
    employeeId: 'EMP-1042',
    employeeName: 'Meera Iyer',
    periodId: 'AY-2026-27',
    submittedOn: '2026-11-05',
    academicYear: '2026-27',
    status: 'Draft',
    rows: [emptyRow()],
    hasHomeLoan: false,
    propertyType: 'Self-Occupied',
    interestPaid: 0,
    lender: '',
    loanAccount: ''
  });

  const SESSION = EMPLOYEES[0];
  const isEmployee = role === 'employee';
  const emp = EMPLOYEES.find((e) => e.id === form.employeeId) || EMPLOYEES[0];
  const visibleList = isEmployee ? list.filter((r) => r.employeeId === SESSION.id) : list;
  const switchRole = (next: 'employee' | 'hr') => {
    setRole(next);
    if (next === 'employee') {
      const found = SESSION;
      setForm((f) => ({ ...f, employeeId: found.id, employeeName: found.name }));
      setNotice(`Employee mode: signed in as ${found.name}. Employee is locked; only your records are listed.`);
    } else {
      setNotice('HR mode: you can select any employee and submit on their behalf.');
    }
  };
  const netRow = (r: Row) => {
    if (r.source === 'Home Loan Interest Loss (Section 24b)') return -Math.abs(r.annual);
    const exempt = r.exemptOn ? Math.min(r.exemptAmt, r.annual) : 0;
    return r.annual - exempt;
  };
  const agri = form.rows.filter((r) => r.source === 'Agricultural Income').reduce((s, r) => s + Math.max(0, r.annual), 0);
  const hpRows = form.rows.filter((r) => r.source.startsWith('House Property') || r.source.startsWith('Home Loan Interest'));
  const otherRows = form.rows.filter((r) => r.source !== 'Agricultural Income' && !r.source.startsWith('House Property') && !r.source.startsWith('Home Loan Interest'));
  const totalOther = otherRows.reduce((s, r) => s + netRow(r), 0);
  const hpFromRows = hpRows.reduce((s, r) => s + netRow(r), 0);
  const homeDeduction = form.hasHomeLoan
    ? (form.propertyType === 'Self-Occupied' ? Math.min(form.interestPaid, 200000) : form.interestPaid)
    : 0;
  const houseProperty = hpFromRows - homeDeduction;
  const remainingMonths = remainingPayrollMonths();
  const baseTax = calculateIncomeTax({
    periodId: form.periodId,
    regime: emp.regime === 'New' ? 'New Regime' : 'Old Regime',
    annualGrossSalary: emp.ctc,
    remainingMonths
  });
  const withOtherTax = calculateIncomeTax({
    periodId: form.periodId,
    regime: emp.regime === 'New' ? 'New Regime' : 'Old Regime',
    annualGrossSalary: emp.ctc,
    otherIncome: totalOther,
    housePropertyIncome: houseProperty,
    agriculturalIncome: agri,
    remainingMonths
  });
  const netAdditionalRaw = totalOther + houseProperty;
  const netAdditional = netAdditionalRaw;
  const monthlyTds = withOtherTax.monthlyTdsEstimate - baseTax.monthlyTdsEstimate;
  const letOutWarning = form.hasHomeLoan && form.propertyType === 'Let-Out' && !form.rows.some((r) => r.source.startsWith('House Property'));

  const persist = (next: Rec[], msg: string) => {
    setList(next);
    localStorage.setItem(STORE, JSON.stringify(next));
    setNotice(msg);
  };
  const save = (status: Status) => {
    form.rows.forEach((r) => {
      if (r.exemptOn && r.exemptAmt > r.annual) throw new Error('Exemption cannot exceed annual amount');
    });
    if (form.rows.some((r) => r.exemptOn && r.exemptAmt > r.annual)) {
      setNotice('Exemption amount cannot exceed the annual amount on a row.');
      return;
    }
    const rec: Rec = { ...form, id: form.id || `OI-${Date.now()}`, status, employeeName: emp.name, submittedOn: form.submittedOn || '2026-11-05' };
    persist(list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list], status === 'Submitted' ? 'Submitted. Net additional taxable income will be included in the next payroll run.' : 'Draft saved. Payroll is not affected.');
    setForm(rec);
    if (status === 'Submitted') setMode('list');
  };

  const amend = (rec: Rec) => {
    persist(list.map((r) => r.id === rec.id ? { ...r, status: 'Cancelled' } : r), 'Original cancelled. HR notified. Fill the replacement draft.');
    setForm({ ...rec, id: `OI-${Date.now()}`, status: 'Draft' });
    setMode('form');
  };

  const summary = useMemo(() => ({ totalOther, homeDeduction, netAdditional, monthlyTds }), [totalOther, homeDeduction, netAdditional, monthlyTds]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Other Income Declaration</h1>
          <p className="text-sm text-gray-500">HR → Employee Tax and Benefits → Employee Other Income</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { setForm({ ...form, id: '', status: 'Draft', rows: [emptyRow()], employeeId: isEmployee ? SESSION.id : form.employeeId, employeeName: isEmployee ? SESSION.name : form.employeeName }); setMode('form'); }}><Plus className="h-4 w-4 mr-1" />New</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Period</th><th className="px-3 py-2">Academic year</th><th className="px-3 py-2">Status</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {visibleList.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.employeeName}</td>
                  <td className="px-3 py-2">{r.periodId}</td>
                  <td className="px-3 py-2">{r.academicYear}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Submitted' ? 'success' : r.status === 'Draft' ? 'warning' : 'secondary'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(r); setMode('form'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleList.length && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">{isEmployee ? 'You have no other income declarations.' : 'No other income declarations.'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Declaration header">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label={isEmployee ? 'Employee (locked to you)' : 'Employee'} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => {
                if (isEmployee) return;
                const id = typeof e === 'string' ? e : e.target.value;
                const found = EMPLOYEES.find((x) => x.id === id);
                setForm({ ...form, employeeId: id, employeeName: found?.name || '' });
              }} />
              <Select label="Payroll Period *" options={PERIODS.map((p) => ({ value: p.id, label: p.label }))} value={form.periodId} onChange={(e) => setForm({ ...form, periodId: typeof e === 'string' ? e : e.target.value })} />
              <Input label="Submission Date" value={form.submittedOn} disabled />
              <Select label="Academic Year" options={[{ value: '2026-27', label: '2026-27' }, { value: '2025-26', label: '2025-26' }]} value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: typeof e === 'string' ? e : e.target.value })} />
            </div>
          </Card>

          <Card title="Other income sources">
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Source type</th><th>Description</th><th>Annual amount</th><th>Exempt</th><th>Exemption amount</th><th>Net taxable</th><th /></tr></thead>
                <tbody>
                  {form.rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2 min-w-[220px]"><Select options={SOURCES.map((s) => ({ value: s, label: s }))} value={r.source} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, source: typeof e === 'string' ? e : e.target.value } : item) })} /></td>
                      <td><Input value={r.description} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, description: e.target.value } : item) })} /></td>
                      <td><Input type="number" value={r.annual} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, annual: Number(e.target.value) || 0 } : item) })} /></td>
                      <td className="text-center"><input type="checkbox" checked={r.exemptOn} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, exemptOn: e.target.checked, exemptAmt: e.target.checked ? item.exemptAmt : 0 } : item) })} /></td>
                      <td>{r.exemptOn ? <Input type="number" value={r.exemptAmt} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, exemptAmt: Number(e.target.value) || 0 } : item) })} /> : '—'}</td>
                      <td className={netRow(r) < 0 ? 'text-emerald-700' : ''}>{inr(netRow(r))}</td>
                      <td><button type="button" onClick={() => setForm({ ...form, rows: form.rows.filter((item) => item.id !== r.id) })}><Trash2 className="h-4 w-4 text-red-500" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button variant="outline" className="mt-3" onClick={() => setForm({ ...form, rows: [...form.rows, emptyRow()] })}><Plus className="h-4 w-4 mr-1" />Add row</Button>
            </div>
          </Card>

          <Card title="Home loan interest (Section 24b)">
            <div className="space-y-3 p-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.hasHomeLoan} onChange={(e) => setForm({ ...form, hasHomeLoan: e.target.checked })} /> Do you have a home loan?</label>
              {form.hasHomeLoan && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Select label="Property Type" options={[{ value: 'Self-Occupied', label: 'Self-Occupied (cap ₹2,00,000)' }, { value: 'Let-Out', label: 'Let-Out (actual interest)' }]} value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: (typeof e === 'string' ? e : e.target.value) as Rec['propertyType'] })} />
                  <Input label="Annual Interest Paid" type="number" value={form.interestPaid} onChange={(e) => setForm({ ...form, interestPaid: Number(e.target.value) || 0 })} />
                  <Input label="Deduction Allowed" value={inr(homeDeduction)} disabled />
                  <Input label="Lender Name" value={form.lender} onChange={(e) => setForm({ ...form, lender: e.target.value })} />
                  <Input label="Loan Account Number" value={form.loanAccount} onChange={(e) => setForm({ ...form, loanAccount: e.target.value })} />
                </div>
              )}
              {letOutWarning && <p className="text-sm text-amber-800">Let-out property selected but no rental income row is declared above.</p>}
            </div>
          </Card>

          <Card title="Net impact">
            <div className="grid gap-2 p-4 text-sm md:grid-cols-2">
              <p>Total other income {inr(summary.totalOther)}</p>
              <p>Less: home loan interest deduction {inr(summary.homeDeduction)}</p>
              <p>House property (incl. losses) {inr(houseProperty)}</p>
              <p>Agricultural income (rate purposes only) {inr(agri)}</p>
              <p className="font-semibold">Net additional taxable income {inr(summary.netAdditional)}</p>
              {netAdditionalRaw < 0 && <p className="text-xs text-gray-500 md:col-span-2">House-property losses are set off against salary in the shared tax engine (not floored before tax).</p>}
              <p className="md:col-span-2">Impact on monthly TDS ({remainingMonths} remaining months, Income Tax Slab pack {withOtherTax.packName || 'fallback'}): {inr(summary.monthlyTds)}</p>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
            <Button onClick={() => save('Submitted')}>Submit</Button>
            {form.status === 'Submitted' && <Button variant="outline" onClick={() => amend(form)}>Amend</Button>}
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeOtherIncomeDeclaration;
