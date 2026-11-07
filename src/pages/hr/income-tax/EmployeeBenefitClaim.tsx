import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save } from 'lucide-react';

const APP_STORE = 'k12-benefit-application-v1';
const STORE = 'k12-benefit-claim-v1';
const PERIOD = { id: 'AY-2026-27', label: 'AY 2026-27 Payroll Period (01-04-2026 to 31-03-2027)', start: '2026-04-01', end: '2027-03-31' };
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type Status = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Partially Approved';
type BenefitKey = 'LTA' | 'Medical' | 'CEA' | 'Uniform';
type Bill = { id: string; date: string; number: string; description: string; amount: number; file: string };
type Rec = {
  id: string;
  employeeId: string;
  employeeName: string;
  claimDate: string;
  periodId: string;
  structure: string;
  benefit: BenefitKey;
  payout: 'accrue' | 'full';
  maxEligible: number;
  claimed: number;
  approvedAmount: number;
  bills: Bill[];
  status: Status;
  rejectReason: string;
  separatePayment: boolean;
  applicationId?: string;
};

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', structure: 'Teaching Staff - Permanent', children: 2, ltaBlockUsed: 1 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', structure: 'Teaching Staff - Permanent', children: 1, ltaBlockUsed: 2 },
  { id: 'EMP-1101', name: 'Kavita Shah', structure: 'Non-Teaching Staff - Support', children: 0, ltaBlockUsed: 0 }
];

const BENEFITS: Record<BenefitKey, {
  label: string;
  annual: number;
  accruePerCycle: number;
  unclaimedCycles: number;
  payout: 'accrue' | 'full';
  teaching: boolean;
  support: boolean;
  separatePayment: boolean;
  taxExempt: boolean;
}> = {
  LTA: { label: 'LTA (Leave Travel Allowance)', annual: 25000, accruePerCycle: 1250, unclaimedCycles: 6, payout: 'full', teaching: true, support: false, separatePayment: true, taxExempt: true },
  Medical: { label: 'Medical Reimbursement', annual: 15000, accruePerCycle: 1250, unclaimedCycles: 4, payout: 'accrue', teaching: true, support: true, separatePayment: false, taxExempt: true },
  CEA: { label: 'Children Education Allowance', annual: 4800, accruePerCycle: 400, unclaimedCycles: 7, payout: 'accrue', teaching: true, support: false, separatePayment: false, taxExempt: true },
  Uniform: { label: 'Uniform/Dress Allowance', annual: 5000, accruePerCycle: 417, unclaimedCycles: 8, payout: 'accrue', teaching: false, support: true, separatePayment: false, taxExempt: true }
};

const RULES: Record<BenefitKey, string[]> = {
  LTA: [
    'Section 10(5): two journeys in a 4-year block. Economy air / AC First train / bus within India only.',
    'Eligible travellers: employee, spouse, dependent children. Parents only if wholly dependent.',
    'If both block exemptions are used, the claim is paid but fully taxable.',
    'Journey date on tickets must fall in this payroll period (01 Apr 2026 – 31 Mar 2027).'
  ],
  Medical: [
    'Bills for employee, spouse, children or dependent parents. Pharmacy, lab, hospital and consultation accepted.',
    'Cosmetic treatment, gym memberships and wellness supplements are not eligible.',
    'Annual cap ₹15,000. Amount above the cap is reimbursed but taxed.',
    'Post-Finance Act 2018 the school may treat this as reimbursement-audit only — confirm with tax consultant.'
  ],
  CEA: [
    'Section 10(14): ₹2,400 per child per year, maximum two children.',
    'Must be backed by school / institution fee receipts.',
    'Exemption follows declared dependent children on the HR profile.',
    'Term receipts may be claimed together or as each term is paid.'
  ],
  Uniform: [
    'For support staff whose salary structure includes this component.',
    'Bills from textile shops, uniform suppliers or tailors for uniforms / shoes.',
    'Prefer GST-compliant bills from approved school suppliers.'
  ]
};

const load = (): Rec[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Rec[] : [];
  } catch {
    return [];
  }
};

const eligibleFor = (structure: string): BenefitKey[] =>
  (Object.keys(BENEFITS) as BenefitKey[]).filter((k) => structure.includes('Support') ? BENEFITS[k].support : BENEFITS[k].teaching);

const maxFor = (key: BenefitKey) => {
  const b = BENEFITS[key];
  return b.payout === 'full' ? b.annual : b.accruePerCycle * b.unclaimedCycles;
};

const emptyBills = (): Bill[] => [{ id: `B-${Date.now()}`, date: '2026-11-05', number: '', description: '', amount: 0, file: '' }];

export function EmployeeBenefitClaim() {
  const [params] = useSearchParams();
  const [list, setList] = useState<Rec[]>(load);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('hr');
  const [panel, setPanel] = useState<'claim' | 'ledger'>('claim');
  const SESSION = EMPLOYEES[0];
  const [form, setForm] = useState<Rec>(() => {
    const emp = EMPLOYEES[0];
    const benefit: BenefitKey = 'LTA';
    return {
      id: '',
      employeeId: emp.id,
      employeeName: emp.name,
      claimDate: '2026-11-05',
      periodId: PERIOD.id,
      structure: emp.structure,
      benefit,
      payout: BENEFITS[benefit].payout,
      maxEligible: maxFor(benefit),
      claimed: 0,
      approvedAmount: 0,
      bills: emptyBills(),
      status: 'Draft',
      rejectReason: '',
      separatePayment: BENEFITS[benefit].separatePayment,
      applicationId: params.get('application') || undefined
    };
  });

  const isEmployee = role === 'employee';
  const canApprove = role === 'hr' && (form.status === 'Submitted' || form.status === 'Partially Approved');
  const emp = EMPLOYEES.find((e) => e.id === form.employeeId) || EMPLOYEES[0];
  const options = eligibleFor(form.structure);
  const billTotal = form.bills.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const effective = Math.min(form.claimed, form.maxEligible, billTotal || 0);
  const variance = form.claimed - billTotal;
  const visibleList = isEmployee ? list.filter((r) => r.employeeId === SESSION.id) : list;

  const ledger = useMemo(() => options.map((key) => {
    const paid = list.filter((r) => r.employeeId === form.employeeId && r.benefit === key && (r.status === 'Approved' || r.status === 'Partially Approved'))
      .reduce((s, r) => s + r.approvedAmount, 0);
    const accrued = BENEFITS[key].payout === 'full' ? BENEFITS[key].annual : BENEFITS[key].accruePerCycle * BENEFITS[key].unclaimedCycles;
    return { key, label: BENEFITS[key].label, accrued, paid, remaining: Math.max(0, accrued - paid) };
  }), [list, form.employeeId, options]);

  const flash = (t: string) => setNotice(t);
  const persist = (next: Rec[], msg: string) => {
    setList(next);
    localStorage.setItem(STORE, JSON.stringify(next));
    flash(msg);
  };

  const switchRole = (next: 'employee' | 'hr') => {
    setRole(next);
    if (next === 'employee') {
      pickEmp(SESSION.id);
      flash(`Employee mode: signed in as ${SESSION.name}. Employee is locked; only your claims are listed.`);
    } else {
      flash('HR mode: you can create, edit, approve or reject claims for any employee.');
    }
  };

  const applyBenefit = (rec: Rec, key: BenefitKey): Rec => ({
    ...rec,
    benefit: key,
    payout: BENEFITS[key].payout,
    maxEligible: maxFor(key),
    separatePayment: BENEFITS[key].separatePayment,
    claimed: 0
  });

  const pickEmp = (id: string) => {
    const found = EMPLOYEES.find((e) => e.id === id);
    if (!found) return;
    const first = eligibleFor(found.structure)[0];
    setForm((f) => applyBenefit({
      ...f,
      employeeId: found.id,
      employeeName: found.name,
      structure: found.structure,
      bills: emptyBills(),
      claimed: 0,
      status: f.id ? f.status : 'Draft'
    }, first));
  };

  const validateSubmit = () => {
    if (form.claimDate < PERIOD.start || form.claimDate > PERIOD.end) return 'Claim date must fall in the active payroll period.';
    if (form.claimed <= 0) return 'Enter a claimed amount.';
    if (form.claimed > form.maxEligible) return `Claimed amount cannot exceed max eligible ${inr(form.maxEligible)}.`;
    if (billTotal < form.claimed) return `Bills total ${inr(billTotal)} is less than claimed ${inr(form.claimed)}. Claim is limited to bills.`;
    if (form.bills.some((b) => !b.number.trim() || !b.description.trim() || !b.file.trim() || !b.amount)) return 'Every bill needs date, number, description, amount and attachment.';
    if (form.bills.some((b) => b.date < PERIOD.start || b.date > PERIOD.end)) return 'Bill date must fall within the payroll period (01 Apr 2026 – 31 Mar 2027).';
    const nums = form.bills.map((b) => b.number.trim().toLowerCase());
    if (new Set(nums).size !== nums.length) return 'Duplicate bill numbers on this claim.';
    const used = list.filter((r) => r.employeeId === form.employeeId && r.id !== form.id && r.status !== 'Rejected').flatMap((r) => r.bills.map((b) => b.number.trim().toLowerCase()));
    if (form.bills.some((b) => used.includes(b.number.trim().toLowerCase()))) return 'A bill number was already claimed in this payroll period.';
    if (form.benefit === 'LTA' && emp.ltaBlockUsed >= 2) return 'Both LTA exemptions in the 4-year block are used. You may still claim as taxable reimbursement.';
    if (form.benefit === 'CEA' && form.claimed > emp.children * 2400) return `CEA exemption cap is ${inr(emp.children * 2400)} for ${emp.children} declared child(ren). Extra amount is taxable.`;
    return '';
  };

  const save = (status: Status, extra?: Partial<Rec>) => {
    const rec: Rec = { ...form, ...extra, id: form.id || `BC-${Date.now()}`, claimed: form.claimed, status };
    persist(list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list],
      status === 'Submitted' ? 'Claim submitted. HR will review bills before the next payroll.' :
      status === 'Approved' ? `Approved ${inr(rec.approvedAmount)}. ${rec.separatePayment ? 'Draft journal entry created for separate payment.' : 'Amount will appear on the next salary slip.'}` :
      status === 'Rejected' ? 'Claim rejected. Ledger balance is unchanged. Employee can submit a fresh claim.' :
      status === 'Partially Approved' ? `Partial approval ${inr(rec.approvedAmount)}. Difference stays in the ledger.` :
      'Draft saved.');
    setForm(rec);
    if (status !== 'Draft') setMode('list');
  };

  const submit = () => {
    const err = validateSubmit();
    if (err) { flash(err); return; }
    const capped = Math.min(form.claimed, billTotal, form.maxEligible);
    save('Submitted', { claimed: capped, approvedAmount: 0 });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Benefit Claim</h1>
          <p className="text-sm text-gray-500">HR → Employee Tax and Benefits → Employee Benefit Claim · Lump-sum payout or tax-exemption bills for flexible benefits</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { pickEmp(isEmployee ? SESSION.id : form.employeeId); setForm((f) => ({ ...f, id: '', status: 'Draft', claimDate: '2026-11-05', bills: emptyBills(), claimed: 0, rejectReason: '', approvedAmount: 0 })); setMode('form'); setPanel('claim'); }}><Plus className="mr-1 h-4 w-4" />New Claim</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>{['Employee', 'Date', 'Benefit', 'Claimed', 'Bills', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {visibleList.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.employeeName}<p className="text-xs text-gray-500">{r.employeeId}</p></td>
                  <td className="px-3 py-2">{r.claimDate}</td>
                  <td className="px-3 py-2">{BENEFITS[r.benefit].label}</td>
                  <td className="px-3 py-2">{inr(r.status === 'Approved' || r.status === 'Partially Approved' ? r.approvedAmount : r.claimed)}</td>
                  <td className="px-3 py-2">{inr(r.bills.reduce((s, b) => s + b.amount, 0))}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : r.status === 'Submitted' || r.status === 'Partially Approved' ? 'warning' : 'secondary'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(r); setMode('form'); setPanel('claim'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleList.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">{isEmployee ? 'You have no benefit claims.' : 'No benefit claims.'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <div className="flex gap-1 border-b border-gray-200 bg-white">
            {[{ id: 'claim' as const, label: 'Claim' }, { id: 'ledger' as const, label: 'Employee Benefit Ledger' }].map((t) => (
              <button key={t.id} type="button" onClick={() => setPanel(t.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${panel === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{t.label}</button>
            ))}
          </div>

          {panel === 'ledger' && (
            <Card title={`Ledger · ${form.employeeName}`}>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Component</th><th>Accrued</th><th>Paid / claimed</th><th>Remaining</th></tr></thead>
                  <tbody>
                    {ledger.map((row) => (
                      <tr key={row.key} className="border-t">
                        <td className="py-2">{row.label}</td>
                        <td>{inr(row.accrued)}</td>
                        <td>{inr(row.paid)}</td>
                        <td className="font-semibold">{inr(row.remaining)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t px-4 py-3 text-xs text-gray-500">Unclaimed remaining balances are taxed in the last payroll (March) when “Deduct Tax For Unclaimed Employee Benefits” is on in Payroll Entry.</p>
            </Card>
          )}

          {panel === 'claim' && (
            <>
              <Card title="Claim identity">
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <Select label={isEmployee ? 'Employee (locked to you)' : 'Employee'} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => { if (isEmployee) return; pickEmp(typeof e === 'string' ? e : e.target.value); }} />
                  <Input label="Claim Date" type="date" value={form.claimDate} onChange={(e) => setForm({ ...form, claimDate: e.target.value })} />
                  <Input label="Payroll Period" value={PERIOD.label} readOnly />
                  <Input label="Salary Structure" value={form.structure} readOnly />
                  {form.applicationId && <Input label="From Benefit Application" value={form.applicationId} readOnly />}
                </div>
              </Card>

              <Card title="Benefit component and eligibility">
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <Select
                    label="Claim Benefit Type (flexible components on this structure)"
                    options={options.map((k) => ({ value: k, label: BENEFITS[k].label }))}
                    value={form.benefit}
                    onChange={(e) => setForm((f) => applyBenefit(f, (typeof e === 'string' ? e : e.target.value) as BenefitKey))}
                  />
                  <Input label="Max Benefit Amount Eligible" value={inr(form.maxEligible)} readOnly />
                  <Input
                    label="Claimed Amount"
                    type="number"
                    value={form.claimed}
                    onChange={(e) => setForm({ ...form, claimed: Math.max(0, Number(e.target.value) || 0) })}
                  />
                  <Input label="Payout method" value={form.payout === 'full' ? 'Allow claim up to full period limit' : 'Accrue per cycle, pay only on claim'} readOnly />
                </div>
                {form.claimed > form.maxEligible && <p className="px-4 pb-2 text-sm text-red-600">Claimed amount cannot exceed max eligible {inr(form.maxEligible)}.</p>}
                {form.payout === 'accrue' && <p className="px-4 pb-3 text-xs text-gray-500">{BENEFITS[form.benefit].unclaimedCycles} cycles accrued × {inr(BENEFITS[form.benefit].accruePerCycle)} = {inr(form.maxEligible)} unclaimed.</p>}
                {form.benefit === 'LTA' && emp.ltaBlockUsed >= 2 && <p className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Both LTA exemptions in the 2022–26 block are used. Payout can proceed; no tax exemption.</p>}
                <ul className="space-y-1 border-t px-4 py-3 text-xs text-gray-600">
                  {RULES[form.benefit].map((line) => <li key={line}>• {line}</li>)}
                </ul>
              </Card>

              <Card title="Supporting bills">
                <div className="overflow-x-auto p-4">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="text-left text-xs uppercase text-gray-500">
                      <tr>{['Bill date', 'Bill number', 'Description', 'Amount', 'Attachment', ''].map((h) => <th key={h || 'b'} className="py-2">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {form.bills.map((b) => (
                        <tr key={b.id} className="border-t align-top">
                          <td className="py-2 pr-2"><Input type="date" value={b.date} onChange={(e) => setForm({ ...form, bills: form.bills.map((row) => row.id === b.id ? { ...row, date: e.target.value } : row) })} /></td>
                          <td className="py-2 pr-2"><Input value={b.number} onChange={(e) => setForm({ ...form, bills: form.bills.map((row) => row.id === b.id ? { ...row, number: e.target.value } : row) })} placeholder="Invoice / ticket no." /></td>
                          <td className="py-2 pr-2"><Input value={b.description} onChange={(e) => setForm({ ...form, bills: form.bills.map((row) => row.id === b.id ? { ...row, description: e.target.value } : row) })} placeholder="What the bill is for" /></td>
                          <td className="py-2 pr-2"><Input type="number" value={b.amount} onChange={(e) => setForm({ ...form, bills: form.bills.map((row) => row.id === b.id ? { ...row, amount: Math.max(0, Number(e.target.value) || 0) } : row) })} /></td>
                          <td className="py-2 pr-2">
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-xs" onChange={(e) => setForm({ ...form, bills: form.bills.map((row) => row.id === b.id ? { ...row, file: e.target.files?.[0]?.name || '' } : row) })} />
                            {b.file && <p className="text-[11px] text-gray-500">{b.file}</p>}
                          </td>
                          <td className="py-2"><button type="button" className="text-xs text-red-600" onClick={() => setForm({ ...form, bills: form.bills.filter((row) => row.id !== b.id).length ? form.bills.filter((row) => row.id !== b.id) : emptyBills() })}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm">
                  <Button variant="outline" size="sm" onClick={() => setForm({ ...form, bills: [...form.bills, { id: `B-${Date.now()}`, date: form.claimDate, number: '', description: '', amount: 0, file: '' }] })}>Add bill</Button>
                  <div className="text-right">
                    <p>Total bill amount <b>{inr(billTotal)}</b></p>
                    {variance > 0 && <p className="text-amber-700">Claim limited to bills: effective {inr(Math.min(form.claimed, billTotal))}.</p>}
                    {variance < 0 && <p className="text-gray-500">Bills exceed claim. Excess does not carry forward.</p>}
                    <p className="text-xs text-gray-500">Effective claim {inr(effective)}</p>
                  </div>
                </div>
              </Card>

              {form.separatePayment && (
                <Card title="Separate payment entry">
                  <p className="p-4 text-sm text-gray-600">This component is set to create a separate payment against the benefit claim. After HR approval a draft journal entry is booked; finance posts it independently of the salary bank file (typical for LTA).</p>
                </Card>
              )}

              {form.status === 'Rejected' && form.rejectReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Rejected: {form.rejectReason}</div>
              )}

              <div className="flex flex-wrap gap-2">
                {(form.status === 'Draft' || (isEmployee && form.status === 'Draft')) && <Button onClick={() => save('Draft')}><Save className="mr-1 h-4 w-4" />Save Draft</Button>}
                {form.status === 'Draft' && <Button onClick={submit}>Submit Claim</Button>}
                {canApprove && (
                  <>
                    <Button onClick={() => save('Approved', { approvedAmount: effective, claimed: effective })}>Approve</Button>
                    <Button variant="outline" onClick={() => {
                      const next = Math.min(effective, Math.max(0, effective - 1000));
                      save('Partially Approved', { approvedAmount: next, claimed: form.claimed, rejectReason: 'Some bills not eligible. Approved amount reduced.' });
                    }}>Partial Approve</Button>
                    <Button variant="outline" onClick={() => {
                      const reason = window.prompt('Rejection reason (mandatory)', 'Bills not legible or not attached') || '';
                      if (!reason.trim()) { flash('Rejection reason is mandatory.'); return; }
                      save('Rejected', { rejectReason: reason, approvedAmount: 0 });
                    }}>Reject</Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
              </div>
              <p className="text-xs text-gray-500">Submit claims with bills before the March payroll. Unclaimed flexible benefits are added to taxable income when Deduct Tax For Unclaimed Employee Benefits is checked on Payroll Entry.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployeeBenefitClaim;
