import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save } from 'lucide-react';

type Status = 'Draft' | 'Submitted' | 'Cancelled';
type BenefitRow = {
  component: string;
  annual: number;
  applied: number;
  payAgainstClaim: boolean;
  claimed: number;
  note: string;
};
type Rec = {
  id: string;
  employeeId: string;
  employeeName: string;
  periodId: string;
  date: string;
  structure: string;
  status: Status;
  rows: BenefitRow[];
};

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', structure: 'Teaching Staff - Permanent', children: 2 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', structure: 'Teaching Staff - Permanent', children: 1 },
  { id: 'EMP-1101', name: 'Kavita Shah', structure: 'Non-Teaching Staff - Support', children: 0 }
];
const PERIODS = [{ id: 'AY-2026-27', label: 'AY 2026-27 (flexible benefits configured)' }];
const TEACHING: BenefitRow[] = [
  { component: 'Leave Travel Allowance', annual: 25000, applied: 25000, payAgainstClaim: true, claimed: 0, note: 'Section 10(5) — two journeys in a 4-year block (2022–26). Eligible this year.' },
  { component: 'Medical Reimbursement', annual: 15000, applied: 15000, payAgainstClaim: true, claimed: 0, note: 'Unclaimed amount is taxed in March if Deduct Tax For Unclaimed Employee Benefits is on.' },
  { component: 'Children Education Allowance', annual: 4800, applied: 4800, payAgainstClaim: false, claimed: 0, note: 'Exempt up to ₹2,400 × 2 children (₹4,800). Amount beyond this is taxable.' }
];
const SUPPORT: BenefitRow[] = [
  { component: 'Uniform/Dress Allowance', annual: 5000, applied: 5000, payAgainstClaim: true, claimed: 0, note: 'For support staff who wear uniforms. Tax-exempt with bills.' },
  { component: 'Medical Reimbursement', annual: 15000, applied: 10000, payAgainstClaim: true, claimed: 0, note: 'Unclaimed balance is taxed at year-end.' }
];
const STORE = 'k12-benefit-application-v1';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const load = (): Rec[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Rec[] : [];
  } catch {
    return [];
  }
};

export function EmployeeBenefitApplication() {
  const navigate = useNavigate();
  const [list, setList] = useState<Rec[]>(load);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('hr');
  const [form, setForm] = useState<Rec>({
    id: '',
    employeeId: 'EMP-1042',
    employeeName: 'Meera Iyer',
    periodId: 'AY-2026-27',
    date: '2026-11-05',
    structure: 'Teaching Staff - Permanent',
    status: 'Draft',
    rows: TEACHING.map((r) => ({ ...r }))
  });

  const SESSION = EMPLOYEES[0];
  const isEmployee = role === 'employee';
  const visibleList = isEmployee ? list.filter((r) => r.employeeId === SESSION.id) : list;
  const switchRole = (next: 'employee' | 'hr') => {
    setRole(next);
    if (next === 'employee') {
      pickEmp(SESSION.id);
      setNotice(`Employee mode: signed in as ${SESSION.name}. Employee is locked; only your applications are listed.`);
    } else {
      setNotice('HR mode: you can select any employee and submit on their behalf.');
    }
  };
  const pickEmp = (id: string) => {
    const found = EMPLOYEES.find((e) => e.id === id);
    if (!found) return;
    const rows = found.structure.includes('Support') ? SUPPORT.map((r) => ({ ...r })) : TEACHING.map((r) => ({ ...r }));
    setForm((f) => ({ ...f, employeeId: found.id, employeeName: found.name, structure: found.structure, rows }));
  };

  const available = form.rows.reduce((s, r) => s + r.annual, 0);
  const applied = form.rows.reduce((s, r) => s + r.applied, 0);
  const unallocated = available - applied;
  const taxOnUnallocated = Math.round(Math.max(0, unallocated) * 0.2 * 1.04);
  const overClaim = form.rows.find((r) => r.applied > r.annual);
  const cea = form.rows.find((r) => r.component === 'Children Education Allowance');

  const persist = (next: Rec[], msg: string) => {
    setList(next);
    localStorage.setItem(STORE, JSON.stringify(next));
    setNotice(msg);
  };
  const save = (status: Status) => {
    if (overClaim) { setNotice(`${overClaim.component}: amount applied cannot exceed annual entitlement ${inr(overClaim.annual)}.`); return; }
    const rec: Rec = { ...form, id: form.id || `BA-${Date.now()}`, status };
    persist(list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list], status === 'Submitted' ? 'Application submitted. Pay-against-claim amounts wait in the pending claim pool; others appear on the next slip.' : 'Draft saved.');
    setForm(rec);
    if (status === 'Submitted') setMode('list');
  };
  const amend = (rec: Rec) => {
    const blocked = rec.rows.find((r) => r.applied < r.claimed);
    if (blocked) { setNotice(`Cannot reduce ${blocked.component} below already-claimed ${inr(blocked.claimed)}.`); return; }
    persist(list.map((r) => r.id === rec.id ? { ...r, status: 'Cancelled' } : r), 'Original application cancelled. Create the replacement draft.');
    setForm({ ...rec, id: `BA-${Date.now()}`, status: 'Draft' });
    setMode('form');
  };

  const live = useMemo(() => ({ available, applied, unallocated, taxOnUnallocated }), [available, applied, unallocated, taxOnUnallocated]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Benefit Application</h1>
          <p className="text-sm text-gray-500">HR → Employee Tax and Benefits → Employee Benefit Application</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { pickEmp(isEmployee ? SESSION.id : form.employeeId); setForm((f) => ({ ...f, id: '', status: 'Draft', date: '2026-11-05' })); setMode('form'); }}><Plus className="h-4 w-4 mr-1" />New</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Period</th><th className="px-3 py-2">Structure</th><th className="px-3 py-2">Status</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {visibleList.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.employeeName}</td>
                  <td className="px-3 py-2">{r.periodId}</td>
                  <td className="px-3 py-2">{r.structure}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Submitted' ? 'success' : r.status === 'Draft' ? 'warning' : 'secondary'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(r); setMode('form'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleList.length && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">{isEmployee ? 'You have no benefit applications.' : 'No benefit applications.'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Application header">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label={isEmployee ? 'Employee (locked to you)' : 'Employee'} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => { if (isEmployee) return; pickEmp(typeof e === 'string' ? e : e.target.value); }} />
              <Select label="Payroll Period *" options={PERIODS.map((p) => ({ value: p.id, label: p.label }))} value={form.periodId} onChange={(e) => setForm({ ...form, periodId: typeof e === 'string' ? e : e.target.value })} />
              <Input label="Date" value={form.date} disabled />
              <Input label="Salary Structure" value={form.structure} disabled />
              <Input label="Total Flexible Benefits Available" value={inr(live.available)} disabled />
            </div>
          </Card>

          <Card title="Benefit allocation">
            <p className="px-4 pt-3 text-xs text-gray-500">Rows come from flexible-benefit components on the assigned salary structure. Employees cannot add or remove components.</p>
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Salary component</th><th>Annual from structure</th><th>Amount applied for</th><th>Pay against benefit claim</th><th>Remaining</th></tr></thead>
                <tbody>
                  {form.rows.map((r) => (
                    <tr key={r.component} className="border-t align-top">
                      <td className="py-2">
                        <p className="font-medium">{r.component}</p>
                        <p className="text-xs text-gray-500">{r.note}</p>
                      </td>
                      <td>{inr(r.annual)}</td>
                      <td>
                        <Input type="number" value={r.applied} onChange={(e) => setForm({ ...form, rows: form.rows.map((item) => item.component === r.component ? { ...item, applied: Math.max(0, Number(e.target.value) || 0) } : item) })} />
                        {r.applied > r.annual && <p className="text-[11px] text-red-600">Cannot exceed entitlement.</p>}
                        {r.component === 'Children Education Allowance' && cea && cea.applied > 4800 && <p className="text-[11px] text-amber-700">Amount above ₹4,800 is taxable.</p>}
                      </td>
                      <td>{r.payAgainstClaim ? 'Yes — bills required' : 'No — paid in salary'}</td>
                      <td>{inr(Math.max(0, r.annual - r.applied))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Remaining allocation">
            <div className="grid gap-2 p-4 text-sm md:grid-cols-2">
              <p>Total benefits applied {inr(live.applied)}</p>
              <p>Total benefits available {inr(live.available)}</p>
              <p>Unallocated amount {inr(live.unallocated)}</p>
              <p>Estimated tax on unallocated {inr(live.taxOnUnallocated)}</p>
              {live.unallocated > 0 && <p className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">Unapplied / unclaimed benefits are taxed in the last payroll when “Deduct Tax For Unclaimed Employee Benefits” is on. Submit claims before the March payroll.</p>}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
            <Button onClick={() => save('Submitted')}>Submit</Button>
            {form.status === 'Submitted' && form.rows.some((r) => r.payAgainstClaim) && (
              <Button variant="outline" onClick={() => { setNotice('Opening Benefit Claim with applied components pre-filled.'); navigate(`/hr/income-tax/employee-benefit-claim?application=${form.id}`); }}>Create Benefit Claim</Button>
            )}
            {form.status === 'Submitted' && <Button variant="outline" onClick={() => amend(form)}>Amend</Button>}
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeBenefitApplication;
