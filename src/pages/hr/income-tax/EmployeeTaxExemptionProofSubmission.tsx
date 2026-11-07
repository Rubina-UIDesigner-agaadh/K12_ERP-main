import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save } from 'lucide-react';

const DECL_STORE = 'k12-tax-exemption-declaration-v1';
const STORE = 'k12-tax-exemption-proof-v1';
const PERIOD_END = '2027-03-31';
const LAST_PAYROLL = 'March 2027';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type ProofRow = {
  id: string;
  sub: string;
  category: string;
  declared: number;
  actual: number;
  fileName: string;
  docType: 'PDF' | 'Image' | 'Certificate';
  refNo: string;
  docDate: string;
  requiresProof: boolean;
  verified: boolean;
  rejected: boolean;
  rejectComment: string;
};
type Rec = {
  id: string;
  employeeId: string;
  employeeName: string;
  periodId: string;
  declarationId: string;
  submittedOn: string;
  status: 'Draft' | 'Submitted';
  rows: ProofRow[];
  rentReceipts: string[];
  landlordPanFile: string;
  rentAgreement: string;
  actualMonthlyRent: number;
  declaredMonthlyRent: number;
  city: 'Metro' | 'Non-Metro';
  basic: number;
  hraReceived: number;
};

type Decl = { id: string; employeeId: string; employeeName: string; periodId: string; status: string; rows: { id: string; sub: string; category: string; declared: number }[]; monthlyRent?: number; city?: 'Metro' | 'Non-Metro' };

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', basic: 480000, hra: 192000 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', basic: 360000, hra: 144000 },
  { id: 'EMP-1101', name: 'Kavita Shah', basic: 288000, hra: 115200 }
];
const FALLBACK_DECL: Decl[] = [
  {
    id: 'DEC-SEED',
    employeeId: 'EMP-1042',
    employeeName: 'Meera Iyer',
    periodId: 'AY-2026-27',
    status: 'Submitted',
    monthlyRent: 18000,
    city: 'Non-Metro',
    rows: [
      { id: 'd1', sub: 'Life Insurance Premium', category: 'Section 80C', declared: 60000 },
      { id: 'd2', sub: 'PPF (Public Provident Fund)', category: 'Section 80C', declared: 90000 },
      { id: 'd3', sub: 'Mediclaim (Self)', category: 'Section 80D', declared: 25000 }
    ]
  }
];
const loadDecls = (): Decl[] => {
  try {
    const raw = localStorage.getItem(DECL_STORE);
    const parsed = raw ? JSON.parse(raw) as Decl[] : [];
    const submitted = parsed.filter((d) => d.status === 'Submitted');
    return submitted.length ? submitted : FALLBACK_DECL;
  } catch {
    return FALLBACK_DECL;
  }
};
const loadProofs = (): Rec[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Rec[] : [];
  } catch {
    return [];
  }
};
function slabOn(amount: number) {
  return Math.round(Math.max(0, amount) * 0.2 * 1.04);
}

export function EmployeeTaxExemptionProofSubmission() {
  const decls = useMemo(() => loadDecls(), []);
  const [list, setList] = useState<Rec[]>(loadProofs);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('employee');
  const SESSION = EMPLOYEES[0];
  const isEmployee = role === 'employee';
  const [form, setForm] = useState<Rec>(() => fromDecl(decls[0]));

  function fromDecl(d: Decl | undefined): Rec {
    const emp = EMPLOYEES.find((e) => e.id === d?.employeeId) || EMPLOYEES[0];
    const rows: ProofRow[] = (d?.rows || []).map((r) => ({
      id: r.id,
      sub: r.sub,
      category: r.category,
      declared: r.declared,
      actual: r.declared,
      fileName: '',
      docType: 'PDF',
      refNo: '',
      docDate: '',
      requiresProof: true,
      verified: false,
      rejected: false,
      rejectComment: ''
    }));
    return {
      id: '',
      employeeId: d?.employeeId || emp.id,
      employeeName: d?.employeeName || emp.name,
      periodId: d?.periodId || 'AY-2026-27',
      declarationId: d?.id || '',
      submittedOn: '2026-11-05',
      status: 'Draft',
      rows,
      rentReceipts: [],
      landlordPanFile: '',
      rentAgreement: '',
      actualMonthlyRent: d?.monthlyRent || 18000,
      declaredMonthlyRent: d?.monthlyRent || 18000,
      city: d?.city || 'Non-Metro',
      basic: emp.basic,
      hraReceived: emp.hra
    };
  }

  const switchRole = (next: 'employee' | 'hr') => {
    setRole(next);
    setNotice(next === 'employee'
      ? `Employee mode: signed in as ${SESSION.name}. Only your proofs are listed.`
      : 'HR mode: Review / Reject Proof is available. You can verify documents for any employee.');
  };

  const visibleDecls = isEmployee ? decls.filter((d) => d.employeeId === SESSION.id) : decls;
  const visibleList = isEmployee ? list.filter((r) => r.employeeId === SESSION.id) : list;
  const late = form.submittedOn > PERIOD_END;
  const annualRent = form.actualMonthlyRent * 12;
  const hraLegs = {
    actual: form.hraReceived,
    rentMinus10: Math.max(0, annualRent - form.basic * 0.1),
    pct: form.basic * (form.city === 'Metro' ? 0.5 : 0.4)
  };
  const hraExempt = Math.min(hraLegs.actual, hraLegs.rentMinus10, hraLegs.pct);
  const declaredTotal = form.rows.reduce((s, r) => s + r.declared, 0);
  const actualTotal = form.rows.reduce((s, r) => s + Math.min(r.actual, r.declared), 0);
  const shortfall = Math.max(0, declaredTotal - actualTotal);
  const extraTax = slabOn(shortfall);

  const persist = (next: Rec[], msg: string) => {
    setList(next);
    localStorage.setItem(STORE, JSON.stringify(next));
    setNotice(msg);
  };
  const patchRow = (id: string, patch: Partial<ProofRow>) => setForm((f) => ({ ...f, rows: f.rows.map((r) => r.id === id ? { ...r, ...patch } : r) }));

  const save = (status: 'Draft' | 'Submitted') => {
    if (status === 'Submitted') {
      const missing = form.rows.find((r) => r.requiresProof && !r.fileName);
      if (missing) { setNotice(`Upload proof for ${missing.sub} before submitting.`); return; }
      if (annualRent > 100000 && !form.landlordPanFile) { setNotice('Landlord PAN card is required when annual rent exceeds ₹1,00,000.'); return; }
    }
    const rec: Rec = { ...form, id: form.id || `PRF-${Date.now()}`, status };
    persist(list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list], status === 'Submitted'
      ? `Submitted. Proofs are considered in the last payroll of the period (${LAST_PAYROLL}) unless “Deduct Tax For Unsubmitted Tax Exemption Proof” is checked on Payroll Entry.`
      : 'Draft saved. You can upload more documents.');
    setForm(rec);
    if (status === 'Submitted') setMode('list');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Tax Exemption Proof Submission</h1>
          <p className="text-sm text-gray-500">HR → Employee Tax and Benefits → Employee Tax Exemption Proof Submission</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => switchRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { setForm(fromDecl(visibleDecls[0])); setMode('form'); }}><Plus className="h-4 w-4 mr-1" />New</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <p className="text-xs text-gray-500">Create an Employee Tax Exemption Declaration before creating a proof submission. Unlike declarations, any number of proofs can be submitted.</p>
      <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        After submit, HR reviews on Investment / Deduction Proof Verification. Verification Status updates here. If HR raises a Query on a line, you can upload a replacement document for that line only — other verified lines stay unchanged.
      </div>

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {visibleList.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.employeeName}</td>
                  <td className="px-3 py-2">{r.declarationId}</td>
                  <td className="px-3 py-2">{r.submittedOn}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Submitted' ? 'success' : 'warning'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(r); setMode('form'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleList.length && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">{isEmployee ? 'You have no proof submissions.' : 'No proof submissions yet.'}</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Verification Status">
            <div className="space-y-2 p-4 text-sm">
              <p>Overall: {form.status === 'Submitted' ? 'In Progress / awaiting HR' : 'Draft'}. Queries from Proof Verification appear per line below.</p>
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">HR query example: “PPF passbook deposits in this FY total less than claimed. Upload the FY 2026–27 passbook page.” Upload a replacement only for that line — other verified lines are not disturbed.</p>
              <input type="file" className="block text-xs" onChange={() => setNotice('Replacement document attached for the queried line. Re-submit that line only.')} />
            </div>
          </Card>
          <Card title="Header">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label={isEmployee ? 'Employee (locked)' : 'Employee'} options={EMPLOYEES.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => {
                if (isEmployee) return;
                const id = typeof e === 'string' ? e : e.target.value;
                const d = decls.find((x) => x.employeeId === id) || decls[0];
                setForm(fromDecl(d));
              }} />
              <Input label="Payroll Period" value={form.periodId} disabled />
              <Select label="Tax Exemption Declaration" options={visibleDecls.map((d) => ({ value: d.id, label: `${d.id} · ${d.employeeName} · ${d.periodId}` }))} value={form.declarationId} onChange={(e) => {
                const id = typeof e === 'string' ? e : e.target.value;
                const d = decls.find((x) => x.id === id);
                if (d) setForm(fromDecl(d));
              }} />
              <Input label="Submission Date" value={form.submittedOn} disabled />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Submission Status</p>
                <Badge variant={late ? 'warning' : 'success'}>{late ? 'Late' : 'On Time'}</Badge>
              </div>
            </div>
          </Card>

          <Card title="Proof submission table">
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Sub-category</th><th>Category</th><th>Declared</th><th>Actual</th><th>Proof</th><th>Type</th><th>Ref no.</th><th>Doc date</th><th>Variance</th>{!isEmployee && <th>HR</th>}</tr></thead>
                <tbody>
                  {form.rows.map((r) => {
                    const actualCapped = Math.min(r.actual, r.declared);
                    const variance = r.declared - actualCapped;
                    const extra = slabOn(Math.max(0, variance));
                    const short = r.actual < r.declared;
                    return (
                      <tr key={r.id} className={`border-t ${short ? 'bg-orange-50' : ''} ${r.rejected ? 'bg-red-50' : ''}`}>
                        <td className="py-2">{r.sub}</td>
                        <td>{r.category}</td>
                        <td>{inr(r.declared)}</td>
                        <td><Input type="number" value={r.actual} onChange={(e) => patchRow(r.id, { actual: Number(e.target.value) || 0 })} /></td>
                        <td>
                          <input type="file" className="block w-36 text-xs" onChange={(e) => patchRow(r.id, { fileName: e.target.files?.[0]?.name || '' })} />
                          {r.fileName && <p className="text-[11px] text-gray-500">{r.fileName}</p>}
                        </td>
                        <td>
                          <select className="h-8 rounded border px-1" value={r.docType} onChange={(e) => patchRow(r.id, { docType: e.target.value as ProofRow['docType'] })}>
                            <option>PDF</option><option>Image</option><option>Certificate</option>
                          </select>
                        </td>
                        <td><Input value={r.refNo} onChange={(e) => patchRow(r.id, { refNo: e.target.value })} /></td>
                        <td><Input type="date" value={r.docDate} onChange={(e) => patchRow(r.id, { docDate: e.target.value })} /></td>
                        <td>
                          {inr(variance)}
                          {short && <p className="text-[11px] text-orange-700">⚠️ Actual {inr(r.actual)} is less than declared {inr(r.declared)}. Additional tax of {inr(extra)} will be recovered in the next salary slip.</p>}
                          {r.verified && <Badge variant="success">Verified</Badge>}
                          {r.rejected && <p className="text-[11px] text-red-700">Rejected: {r.rejectComment}</p>}
                        </td>
                        {!isEmployee && (
                          <td className="space-y-1">
                            <Button size="sm" variant="outline" onClick={() => patchRow(r.id, { verified: true, rejected: false })}>Verify</Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              const comment = window.prompt('Reject comment') || 'Insufficient proof';
                              patchRow(r.id, { rejected: true, verified: false, rejectComment: comment });
                              setNotice(`Proof for ${r.sub} rejected. Employee notified to resubmit.`);
                            }}>Reject</Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="HRA proof">
            <div className="grid gap-3 p-4 md:grid-cols-2 text-sm">
              <div>
                <label className="mb-1 block text-sm font-medium">Rent receipts (month-wise, multiple)</label>
                <input type="file" multiple className="block text-sm" onChange={(e) => setForm({ ...form, rentReceipts: Array.from(e.target.files || []).map((f) => f.name) })} />
                {form.rentReceipts.length > 0 && <p className="text-xs text-gray-500">{form.rentReceipts.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Landlord PAN card {annualRent > 100000 ? '(required)' : ''}</label>
                <input type="file" className="block text-sm" onChange={(e) => setForm({ ...form, landlordPanFile: e.target.files?.[0]?.name || '' })} />
                {form.landlordPanFile && <p className="text-xs text-gray-500">{form.landlordPanFile}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Rent agreement (optional)</label>
                <input type="file" className="block text-sm" onChange={(e) => setForm({ ...form, rentAgreement: e.target.files?.[0]?.name || '' })} />
              </div>
              <Input label="Actual monthly rent paid" type="number" value={form.actualMonthlyRent} onChange={(e) => setForm({ ...form, actualMonthlyRent: Number(e.target.value) || 0 })} />
              <Input label="Actual HRA exemption eligible" value={inr(hraExempt)} disabled />
              <p className="md:col-span-2 text-xs text-gray-500">Recomputed: Leg 1 {inr(hraLegs.actual)} · Leg 2 {inr(hraLegs.rentMinus10)} · Leg 3 {inr(hraLegs.pct)}</p>
            </div>
          </Card>

          <Card title="Tax adjustment summary">
            <div className="grid gap-2 p-4 text-sm md:grid-cols-2">
              <p>Original declared exemption total {inr(declaredTotal)}</p>
              <p>Proof-verified exemption total {inr(actualTotal)}</p>
              <p>Shortfall (unproven) {inr(shortfall)}</p>
              <p>Additional tax payable on shortfall {inr(extraTax)}</p>
              <p className="md:col-span-2 font-medium">{inr(extraTax)} will be recovered in {LAST_PAYROLL} salary (last payroll of the period).</p>
              <p className="md:col-span-2 text-xs text-gray-500">If Payroll Entry has “Deduct Tax For Unsubmitted Tax Exemption Proof” checked, only proof-verified amounts are used — declarations are ignored.</p>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
            <Button onClick={() => save('Submitted')}>Submit</Button>
            {!isEmployee && <Button variant="outline" onClick={() => setNotice('HR review: mark each row Verified or Reject with comments.')}>HR Review</Button>}
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTaxExemptionProofSubmission;
