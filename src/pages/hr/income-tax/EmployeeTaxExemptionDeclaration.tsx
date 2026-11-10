import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save, Trash2 } from 'lucide-react';
import { calculateHraExemption, calculateIncomeTax, remainingPayrollMonths } from './incomeTax';

type Status = 'Draft' | 'Submitted' | 'Cancelled';
type Row = { id: string; sub: string; category: string; declared: number; max: number };
type Rec = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  periodId: string;
  regime: 'Old' | 'New' | '';
  company: string;
  status: Status;
  rows: Row[];
  rented: boolean;
  monthlyRent: number;
  landlord: string;
  landlordPan: string;
  city: 'Metro' | 'Non-Metro';
};

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', company: 'EduManager School', regime: 'Old' as const, ctc: 1200000, basic: 480000, hra: 192000 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', department: 'Mathematics', company: 'EduManager School', regime: 'New' as const, ctc: 900000, basic: 360000, hra: 144000 },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', company: 'EduManager School', regime: '' as const, ctc: 720000, basic: 288000, hra: 115200 }
];
const PERIODS = [{ id: 'AY-2026-27', label: 'AY 2026-27 Payroll Period (01-04-2026 to 31-03-2027)' }];
const SUBS = [
  { name: 'Life Insurance Premium', category: 'Section 80C', max: 150000 },
  { name: 'PPF (Public Provident Fund)', category: 'Section 80C', max: 150000 },
  { name: 'ELSS Mutual Funds', category: 'Section 80C', max: 150000 },
  { name: 'Tuition Fees (Children)', category: 'Section 80C', max: 150000 },
  { name: 'Mediclaim (Self)', category: 'Section 80D', max: 25000 },
  { name: 'Mediclaim (Parents Senior)', category: 'Section 80D', max: 50000 },
  { name: 'Home Loan Principal', category: 'Section 80C', max: 150000 },
  { name: 'NPS (80CCD1)', category: 'Section 80C', max: 150000 },
  { name: 'NPS additional (80CCD1B)', category: 'Section 80CCD(1B)', max: 50000 },
  { name: 'Education Loan Interest', category: 'Section 80E', max: 0 },
  { name: 'Donations to approved funds', category: 'Section 80G', max: 0 },
  { name: 'Savings account interest (80TTA)', category: 'Section 80TTA', max: 10000 }
];
const CAT_CAP: Record<string, number> = { 'Section 80C': 150000, 'Section 80D': 75000, 'Section 80CCD(1B)': 50000, 'Section 80E': 0, 'Section 80G': 0, 'Section 80TTA': 10000 };
const STORE = 'k12-tax-exemption-declaration-v1';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const emptyRow = (): Row => ({ id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, sub: '', category: '', declared: 0, max: 0 });

const load = (): Rec[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Rec[] : [];
  } catch {
    return [];
  }
};



export function EmployeeTaxExemptionDeclaration() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Rec[]>(load);
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [role, setRole] = useState<'employee' | 'hr'>('hr');
  const [form, setForm] = useState<Rec>({
    id: '',
    employeeId: 'EMP-1042',
    employeeName: 'Meera Iyer',
    department: 'Science',
    periodId: 'AY-2026-27',
    regime: 'Old',
    company: 'EduManager School',
    status: 'Draft',
    rows: [emptyRow()],
    rented: true,
    monthlyRent: 18000,
    landlord: '',
    landlordPan: '',
    city: 'Non-Metro'
  });

  const SESSION = EMPLOYEES[0];
  const isEmployee = role === 'employee';
  const emp = EMPLOYEES.find((e) => e.id === form.employeeId) || EMPLOYEES[0];
  const newRegime = form.regime === 'New';
  const deadline = '2026-04-30';
  const visibleRows = isEmployee ? rows.filter((r) => r.employeeId === SESSION.id) : rows;
  const switchRole = (next: 'employee' | 'hr') => {
    setRole(next);
    if (next === 'employee') {
      pickEmp(SESSION.id);
      setNotice(`Employee mode: signed in as ${SESSION.name}. Employee field is locked and only your declarations are listed.`);
    } else {
      setNotice('HR mode: you can select any employee and create or submit on their behalf.');
    }
  };

  const eligibleByCat = useMemo(() => {
    const map: Record<string, number> = {};
    const used: Record<string, number> = {};
    form.rows.forEach((r) => {
      if (!r.category) return;
      const cap = CAT_CAP[r.category] || 0;
      const rowMax = r.max > 0 ? r.max : r.declared;
      const remaining = cap > 0 ? Math.max(0, cap - (used[r.category] || 0)) : r.declared;
      const eligible = Math.min(r.declared, rowMax || r.declared, remaining || r.declared);
      map[r.category] = (map[r.category] || 0) + eligible;
      used[r.category] = (used[r.category] || 0) + eligible;
    });
    return { map, used };
  }, [form.rows]);

  const chapterVia = Object.values(eligibleByCat.map).reduce((s, n) => s + n, 0);
  const annualRent = form.monthlyRent * 12;
  const hraLegs = {
    actual: emp.hra,
    rentMinus10: Math.max(0, annualRent - emp.basic * 0.1),
    pct: emp.basic * (form.city === 'Metro' ? 0.5 : 0.4)
  };
  const hraExempt = !newRegime && form.rented ? calculateHraExemption(emp.basic, emp.hra, annualRent, form.city === 'Metro') : 0;
  const declaredGross = form.rows.reduce((s, r) => s + r.declared, 0);
  const nps = eligibleByCat.map['Section 80CCD(1B)'] || 0;
  const d80tta = eligibleByCat.map['Section 80TTA'] || 0;
  const taxInput = {
    periodId: form.periodId,
    regime: form.regime === 'New' ? 'New Regime' : 'Old Regime',
    annualGrossSalary: emp.ctc,
    hraExemption: hraExempt,
    remainingMonths: remainingPayrollMonths(),
    deductions: {
      section80C: eligibleByCat.map['Section 80C'] || 0,
      section80D: eligibleByCat.map['Section 80D'] || 0,
      section80E: eligibleByCat.map['Section 80E'] || 0,
      section80G: eligibleByCat.map['Section 80G'] || 0,
      nps80CCD: nps,
      section80TTA: d80tta
    }
  };
  const taxResult = calculateIncomeTax(taxInput);
  const noDeclResult = calculateIncomeTax({ ...taxInput, applyDeclarations: false, hraExemption: 0, deductions: {} });
  const totalExempt = taxResult.hraExemption + taxResult.chapterVia;
  const std = taxResult.standardDeduction;
  const taxable = taxResult.taxableIncome;
  const annualTax = taxResult.finalAnnualTax;
  const remainingMonths = taxResult.remainingMonths;
  const monthly = taxResult.monthlyTdsEstimate;
  const noDeclMonthly = noDeclResult.monthlyTdsEstimate;

  const persist = (next: Rec[], msg: string) => {
    setRows(next);
    localStorage.setItem(STORE, JSON.stringify(next));
    setNotice(msg);
  };

  const pickEmp = (id: string) => {
    const found = EMPLOYEES.find((e) => e.id === id);
    if (!found) return;
    setForm((f) => ({ ...f, employeeId: found.id, employeeName: found.name, department: found.department, company: found.company, regime: found.regime }));
  };

  const setSub = (rowId: string, name: string) => {
    const sub = SUBS.find((s) => s.name === name);
    setForm((f) => ({ ...f, rows: f.rows.map((r) => r.id === rowId ? { ...r, sub: name, category: sub?.category || '', max: sub?.max || 0 } : r) }));
  };

  const save = (status: Status) => {
    if (!form.employeeId || !form.periodId) { setNotice('Employee and payroll period are required.'); return; }
    const duplicate = rows.find((r) => r.employeeId === form.employeeId && r.periodId === form.periodId && r.id !== form.id && r.status !== 'Cancelled');
    if (duplicate) { setNotice('Only one Employee Tax Exemption Declaration is allowed per employee per payroll period.'); return; }
    if (form.rented && annualRent > 100000 && !form.landlordPan.trim() && status === 'Submitted') {
      setNotice('Landlord PAN is mandatory when annual rent exceeds ₹1,00,000.');
      return;
    }
    if (form.rented && !form.landlord.trim() && status === 'Submitted') { setNotice('Landlord name is required for an HRA claim.'); return; }
    const rec: Rec = { ...form, id: form.id || `DEC-${Date.now()}`, status, employeeName: emp.name, department: emp.department };
    persist(rows.some((r) => r.id === rec.id) ? rows.map((r) => r.id === rec.id ? rec : r) : [rec, ...rows], status === 'Submitted' ? 'Declaration submitted. TDS in subsequent slips will use these exemptions.' : 'Draft saved. TDS is not affected.');
    setForm(rec);
    if (status === 'Submitted') setMode('list');
  };

  const amend = (rec: Rec) => {
    persist(rows.map((r) => r.id === rec.id ? { ...r, status: 'Cancelled' } : r), 'Submitted declaration cancelled for audit. New draft created.');
    setForm({ ...rec, id: `DEC-${Date.now()}`, status: 'Draft' });
    setMode('form');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Tax Exemption Declaration</h1>
          <p className="text-sm text-gray-500">Employee Self-Service → Tax & Payroll → My Tax Declaration · also covers Income & Investment Declaration</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { const next = { ...form, id: '', status: 'Draft' as const, rows: [emptyRow()] }; setForm(next); if (isEmployee) pickEmp(SESSION.id); setMode('form'); }}><Plus className="h-4 w-4 mr-1" />New</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">
        Your declaration status is visible to the Payroll Manager on Investment Declaration Status. Incomplete or unsaved declarations result in TDS on full gross income.
        {form.regime === 'New' && ' New Regime selected — Chapter VI-A exemptions on this form are not applicable.'}
        {' '}<button type="button" className="underline" onClick={() => navigate('/hr/income-tax/investment-declaration-status')}>Open declaration dashboard</button>
        {form.rented === false && <span className="block text-xs text-gray-600 mt-1">If the HRA sub-section is missing, ask Payroll to confirm HRA Settings on HRA & Special Exemption Rule Master.</span>}
      </div>

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Period</th><th className="px-3 py-2">Regime</th><th className="px-3 py-2">Status</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.employeeName}<p className="text-xs text-gray-400">{r.employeeId}</p></td>
                  <td className="px-3 py-2">{r.periodId}</td>
                  <td className="px-3 py-2">{r.regime || '—'}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Submitted' ? 'success' : r.status === 'Draft' ? 'warning' : 'secondary'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(r); setMode('form'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleRows.length && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">{isEmployee ? 'You have no declarations yet.' : 'No declarations yet.'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Declaration header">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label={isEmployee ? 'Employee (locked to you)' : 'Employee'} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => { if (isEmployee) return; pickEmp(typeof e === 'string' ? e : e.target.value); }} />
              <Select label="Payroll Period *" options={PERIODS.map((p) => ({ value: p.id, label: p.label }))} value={form.periodId} onChange={(e) => setForm({ ...form, periodId: typeof e === 'string' ? e : e.target.value })} />
              <Input label="Tax Regime" value={form.regime || 'Not selected — complete Tax Regime Selector first'} disabled />
              <Input label="Company / Department" value={`${form.company} · ${form.department}`} disabled />
              <Input label="Declaration Submission Deadline" value={`${deadline} · applied from next payroll if submitted after this date`} disabled />
            </div>
            {!form.regime && <p className="px-4 pb-4 text-sm text-amber-800">Complete Tax Regime Selector before declaring exemptions.</p>}
            {newRegime && <p className="px-4 pb-4 text-sm text-amber-800">New Regime: Chapter VI-A and HRA are locked. Only the standard deduction of {inr(std)} from the Income Tax Slab pack applies.</p>}
          </Card>

          <Card title="Exemption declarations">
            <div className={`overflow-x-auto p-4 ${newRegime ? 'pointer-events-none opacity-50' : ''}`}>
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Sub-category</th><th>Category</th><th>Declared</th><th>Eligible</th><th /></tr></thead>
                <tbody>
                  {form.rows.map((r) => {
                    const cap = CAT_CAP[r.category] || 0;
                    const eligible = Math.min(r.declared, r.max || r.declared || 0, cap || r.declared);
                    return (
                      <tr key={r.id} className="border-t">
                        <td className="py-2"><Select options={[{ value: '', label: 'Select' }, ...SUBS.map((s) => ({ value: s.name, label: s.name }))]} value={r.sub} onChange={(e) => setSub(r.id, typeof e === 'string' ? e : e.target.value)} /></td>
                        <td>{r.category || '—'}</td>
                        <td><Input type="number" value={r.declared} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.id === r.id ? { ...item, declared: Number(e.target.value) || 0 } : item) })} /></td>
                        <td>{inr(eligible)}</td>
                        <td><button type="button" onClick={() => setForm({ ...form, rows: form.rows.filter((item) => item.id !== r.id) })}><Trash2 className="h-4 w-4 text-red-500" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Button variant="outline" className="mt-3" onClick={() => setForm({ ...form, rows: [...form.rows, emptyRow()] })}><Plus className="h-4 w-4 mr-1" />Add row</Button>
              {form.rows.filter((r) => r.category === 'Section 80C').reduce((s, r) => s + r.declared, 0) > 150000 && <p className="mt-2 text-sm text-amber-700">80C declared amount exceeds ₹1,50,000. Excess will not reduce tax.</p>}
            </div>
          </Card>

          <Card title="HRA exemption">
            <div className={`space-y-3 p-4 ${newRegime ? 'pointer-events-none opacity-50' : ''}`}>
              <p className="text-xs text-gray-500">Shown because HRA is configured on the company HRA settings.</p>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.rented} onChange={(e) => setForm({ ...form, rented: e.target.checked })} /> Rented accommodation</label>
              {form.rented && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Input label="Monthly Rent Paid" type="number" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: Number(e.target.value) || 0 })} />
                  <Input label="Landlord Name" value={form.landlord} onChange={(e) => setForm({ ...form, landlord: e.target.value })} />
                  <Input label="Landlord PAN" value={form.landlordPan} onChange={(e) => setForm({ ...form, landlordPan: e.target.value.toUpperCase() })} />
                  <Select label="City Type" options={[{ value: 'Metro', label: 'Metro (50%)' }, { value: 'Non-Metro', label: 'Non-Metro (40%)' }]} value={form.city} onChange={(e) => setForm({ ...form, city: (typeof e === 'string' ? e : e.target.value) as Rec['city'] })} />
                  <Input label="HRA Received (Annual)" value={inr(emp.hra)} disabled />
                </div>
              )}
              {form.rented && (
                <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                  <p>Leg 1 Actual HRA {inr(hraLegs.actual)}</p>
                  <p>Leg 2 Rent − 10% of Basic {inr(hraLegs.rentMinus10)}</p>
                  <p>Leg 3 {form.city === 'Metro' ? '50%' : '40%'} of Basic {inr(hraLegs.pct)}</p>
                  <p className="font-semibold">Eligible HRA exemption {inr(hraExempt)}</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Totals & live tax summary">
            <div className="grid gap-3 p-4 md:grid-cols-2 text-sm">
              <p>Total declared amount {inr(declaredGross)}</p>
              <p>Total exemption amount {inr(totalExempt)}</p>
              <p>Gross annual CTC {inr(emp.ctc)}</p>
              <p>Less: Standard deduction {inr(std)}</p>
              <p>Less: HRA exemption {inr(hraExempt)}</p>
              <p>Less: Chapter VI-A {inr(newRegime ? 0 : chapterVia)}</p>
              <p className="font-semibold">Annual taxable income {inr(taxable)}</p>
              <p>Estimated annual tax {inr(annualTax)} ({taxResult.packName || 'Income Tax Slab'})</p>
              <p>Estimated monthly TDS ({remainingMonths} remaining months) {inr(monthly)}</p>
              <p className="md:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">Without a declaration, monthly TDS would be {inr(noDeclMonthly)}. This declaration saves {inr(Math.max(0, noDeclMonthly - monthly))} per remaining month.</p>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
            <Button onClick={() => save('Submitted')}>Submit Declaration</Button>
            {form.status === 'Submitted' && <Button variant="outline" onClick={() => navigate(`/hr/income-tax/employee-tax-exemption-proof-submission?declaration=${encodeURIComponent(form.id)}`)}>Submit Proof</Button>}
            {form.status === 'Submitted' && <Button variant="outline" onClick={() => amend(form)}>Amend</Button>}
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTaxExemptionDeclaration;
