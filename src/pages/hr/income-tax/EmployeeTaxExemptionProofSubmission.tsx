import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Save } from 'lucide-react';
import { calculateHraExemption, remainingPayrollMonths } from './incomeTax';
import {
  DECL_STORE,
  TAX_STAFF,
  type DeclarationRec,
  type ProofLine,
  type ProofRec,
  type ProofStatus,
  computeEmployeeTax,
  inr,
  loadDeclarations,
  loadJson,
  loadProofs,
  logActivity,
  normalizeProof,
  saveProofs
} from './taxRecords';

const PERIOD_END = '2027-03-31';
const LAST_PAYROLL = 'March 2027';

const emptyLine = (row?: { id: string; sub: string; category: string; declared: number }): ProofLine => ({
  id: row?.id || `ln-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  sub: row?.sub || '',
  category: row?.category || '',
  declared: row?.declared || 0,
  submittedAmount: 0,
  verifiedAmount: 0,
  rejectedAmount: 0,
  fileName: '',
  docType: 'PDF',
  refNo: '',
  docDate: '',
  requiresProof: true,
  status: 'Draft',
  rejectReason: '',
  remarks: ''
});

const fromDecl = (d?: DeclarationRec): ProofRec => {
  const staff = TAX_STAFF.find((s) => s.id === d?.employeeId) || TAX_STAFF[0];
  return {
    id: '',
    employeeId: d?.employeeId || staff.id,
    employeeName: d?.employeeName || staff.name,
    department: d?.department || staff.department,
    company: d?.company || staff.company,
    branch: staff.branch,
    periodId: d?.periodId || 'AY-2026-27',
    declarationId: d?.id || '',
    submittedOn: new Date().toISOString().slice(0, 10),
    status: 'Draft',
    rows: (d?.rows || []).map((r) => emptyLine(r)),
    rentReceipts: [],
    landlordPanFile: '',
    rentAgreement: '',
    landlordName: d?.landlord || '',
    landlordPan: d?.landlordPan || '',
    rentalFrom: '2026-04-01',
    rentalTo: '2027-03-31',
    actualMonthlyRent: d?.monthlyRent || 0,
    declaredMonthlyRent: d?.monthlyRent || 0,
    city: d?.city || 'Non-Metro',
    basic: staff.basic,
    hraReceived: staff.hra,
    regime: d?.regime || staff.regime
  };
};

export function EmployeeTaxExemptionProofSubmission() {
  const decls = useMemo(() => {
    const loaded = loadDeclarations().filter((d) => d.status === 'Submitted');
    return loaded.length ? loaded : loadJson<DeclarationRec[]>(DECL_STORE, []);
  }, []);
  const [list, setList] = useState<ProofRec[]>(() => loadProofs());
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('employee');
  const SESSION = TAX_STAFF[0];
  const isEmployee = role === 'employee';
  const [form, setForm] = useState<ProofRec>(() => fromDecl(decls[0]));

  const visibleDecls = isEmployee ? decls.filter((d) => d.employeeId === SESSION.id) : decls;
  const visibleList = isEmployee ? list.filter((r) => r.employeeId === SESSION.id) : list;
  const late = form.submittedOn > PERIOD_END;
  const newRegime = form.regime === 'New';
  const annualRent = form.actualMonthlyRent * 12;
  const hraExempt = newRegime ? 0 : calculateHraExemption(form.basic, form.hraReceived, annualRent, form.city === 'Metro');
  const declaredTotal = form.rows.reduce((s, r) => s + r.declared, 0);
  const submittedTotal = form.rows.reduce((s, r) => s + r.submittedAmount, 0);
  const verifiedTotal = form.rows.reduce((s, r) => s + r.verifiedAmount, 0);
  const pendingTotal = form.rows.reduce((s, r) => s + Math.max(0, r.submittedAmount - r.verifiedAmount - r.rejectedAmount), 0);
  const remainingProof = Math.max(0, declaredTotal - submittedTotal);

  const verifiedTax = computeEmployeeTax(form.employeeId, form.periodId, { useVerifiedOnly: true });
  const declaredTax = computeEmployeeTax(form.employeeId, form.periodId, { useVerifiedOnly: false });
  const extraTax = Math.max(0, verifiedTax.finalAnnualTax - Math.min(verifiedTax.finalAnnualTax, declaredTax.finalAnnualTax));
  const shortfallTax = Math.max(0, computeEmployeeTax(form.employeeId, form.periodId).finalAnnualTax - declaredTax.finalAnnualTax);

  const persist = (next: ProofRec[], msg: string) => {
    setList(next);
    saveProofs(next);
    setNotice(msg);
  };

  const patchRow = (id: string, patch: Partial<ProofLine>) => setForm((f) => ({
    ...f,
    rows: f.rows.map((r) => r.id === id ? { ...r, ...patch } : r)
  }));

  const save = (status: ProofStatus) => {
    if (!form.declarationId) { setNotice('Create an Employee Tax Exemption Declaration before submitting proofs.'); return; }
    if (status === 'Submitted' || status === 'Pending Verification') {
      const missing = form.rows.find((r) => r.requiresProof && r.submittedAmount > 0 && !r.fileName);
      if (missing) { setNotice(`Upload a document for ${missing.sub} before submitting.`); return; }
      if (!newRegime && annualRent > 100000 && !form.landlordPanFile && !form.landlordPan) {
        setNotice('Landlord PAN is required when annual rent exceeds ₹1,00,000.');
        return;
      }
    }
    const rec: ProofRec = {
      ...form,
      id: form.id || `PRF-${Date.now()}`,
      status: status === 'Submitted' ? 'Pending Verification' : status,
      rows: form.rows.map((r) => ({
        ...r,
        status: status === 'Submitted' ? (r.status === 'Verified' || r.status === 'Partially Verified' || r.status === 'Rejected' ? r.status : 'Pending Verification') : r.status
      }))
    };
    persist(
      list.some((r) => r.id === rec.id) ? list.map((r) => r.id === rec.id ? rec : r) : [rec, ...list],
      rec.status === 'Pending Verification'
        ? `Submitted for verification. Unverified amounts are not used in tax. Last payroll of the period: ${LAST_PAYROLL}.`
        : 'Draft saved. Submitted amounts are not treated as verified.'
    );
    logActivity({ employeeId: rec.employeeId, employeeName: rec.employeeName, action: rec.status === 'Pending Verification' ? 'Proof submitted' : 'Proof draft saved', actor: isEmployee ? rec.employeeName : 'HR', remarks: rec.id, ref: rec.id });
    setForm(rec);
    if (rec.status === 'Pending Verification') setMode('list');
  };

  const resubmitLine = (row: ProofLine) => {
    patchRow(row.id, { status: 'Resubmission Required', verifiedAmount: row.verifiedAmount, rejectedAmount: 0 });
    setNotice(`Line ${row.sub} marked for resubmission. Other verified lines stay unchanged.`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Tax Exemption Proof Submission</h1>
          <p className="text-sm text-gray-500">HR → Employee Tax and Benefits → Proof Submission</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => setRole('employee')}>Employee</button>
            <button type="button" className={`rounded-md px-3 py-1.5 text-sm ${role === 'hr' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`} onClick={() => setRole('hr')}>HR</button>
          </div>
          <Button onClick={() => { setForm(fromDecl(visibleDecls[0])); setMode('form'); }}><Plus className="h-4 w-4 mr-1" />New proof</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <p className="text-xs text-gray-500">Multiple proof records are allowed against the same declaration. Declared, submitted and verified amounts stay separate. Only verified amounts reduce tax.</p>

      {mode === 'list' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Proof ID</th><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Submitted</th><th className="px-3 py-2">Verified</th><th className="px-3 py-2">Status</th><th className="px-3 py-2" /></tr></thead>
            <tbody>
              {visibleList.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.employeeName}<p className="text-xs text-gray-400">{r.employeeId}</p></td>
                  <td className="px-3 py-2">{r.declarationId}</td>
                  <td className="px-3 py-2">{inr(r.rows.reduce((s, x) => s + x.submittedAmount, 0))}</td>
                  <td className="px-3 py-2">{inr(r.rows.reduce((s, x) => s + x.verifiedAmount, 0))}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Verified' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                  <td className="px-3 py-2"><button type="button" className="text-indigo-700 underline" onClick={() => { setForm(normalizeProof(r)); setMode('form'); }}>Open</button></td>
                </tr>
              ))}
              {!visibleList.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">No proof submissions yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {mode === 'form' && (
        <div className="space-y-4">
          <Card title="Header">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label={isEmployee ? 'Employee (locked)' : 'Employee'} options={TAX_STAFF.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))} value={form.employeeId} onChange={(e) => {
                if (isEmployee) return;
                const id = typeof e === 'string' ? e : e.target.value;
                const d = decls.find((x) => x.employeeId === id) || decls[0];
                setForm(fromDecl(d));
              }} />
              <Input label="Financial year / payroll period" value={form.periodId} disabled />
              <Select label="Declaration reference" options={visibleDecls.map((d) => ({ value: d.id, label: `${d.id} · ${d.employeeName} · ${d.periodId}` }))} value={form.declarationId} onChange={(e) => {
                const id = typeof e === 'string' ? e : e.target.value;
                const d = decls.find((x) => x.id === id);
                if (d) setForm(fromDecl(d));
              }} />
              <Input label="Submission date" value={form.submittedOn} disabled />
              <Input label="Tax regime" value={form.regime || 'Not selected'} disabled />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Submission status</p>
                <Badge variant={late ? 'warning' : 'success'}>{form.status} · {late ? 'Late' : 'On time'}</Badge>
              </div>
            </div>
          </Card>

          <Card title="Proof lines">
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Category</th><th>Declared</th><th>Submitted proof</th><th>Verified</th><th>Rejected</th><th>Pending</th><th>Document</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {form.rows.map((r) => {
                    const pending = Math.max(0, r.submittedAmount - r.verifiedAmount - r.rejectedAmount);
                    return (
                      <tr key={r.id} className={`border-t ${r.status === 'Rejected' ? 'bg-red-50' : r.status === 'Resubmission Required' ? 'bg-amber-50' : ''}`}>
                        <td className="py-2">{r.sub}<p className="text-xs text-gray-400">{r.category}</p></td>
                        <td>{inr(r.declared)}</td>
                        <td><Input type="number" value={r.submittedAmount} onChange={(e) => patchRow(r.id, { submittedAmount: Math.max(0, Number(e.target.value) || 0), status: form.status === 'Draft' ? 'Draft' : r.status })} /></td>
                        <td>{inr(r.verifiedAmount)}</td>
                        <td>{inr(r.rejectedAmount)}</td>
                        <td>{inr(pending)}</td>
                        <td>
                          <input type="file" className="block w-36 text-xs" onChange={(e) => patchRow(r.id, { fileName: e.target.files?.[0]?.name || '' })} />
                          {r.fileName && <p className="text-[11px] text-gray-500">{r.fileName}</p>}
                          <Input value={r.refNo} placeholder="Ref no." onChange={(e) => patchRow(r.id, { refNo: e.target.value })} />
                        </td>
                        <td>
                          <Badge variant={r.status === 'Verified' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>{r.status}</Badge>
                          {r.rejectReason && <p className="text-[11px] text-red-700">{r.rejectReason}</p>}
                        </td>
                        <td>{r.status === 'Rejected' || r.status === 'Resubmission Required' ? <Button size="sm" variant="outline" onClick={() => resubmitLine(r)}>Resubmit line</Button> : null}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Button variant="outline" className="mt-3" onClick={() => setForm({ ...form, rows: [...form.rows, emptyLine()] })}><Plus className="h-4 w-4 mr-1" />Add proof line</Button>
            </div>
          </Card>

          <Card title="HRA proof">
            <div className={`grid gap-3 p-4 md:grid-cols-2 text-sm ${newRegime ? 'pointer-events-none opacity-50' : ''}`}>
              {newRegime && <p className="md:col-span-2 text-amber-800">New regime: HRA exemption is not applied (Income Tax Slab pack).</p>}
              <Input label="Annual HRA received" value={inr(form.hraReceived)} disabled />
              <Input label="Basic salary" value={inr(form.basic)} disabled />
              <Input label="Actual monthly rent" type="number" value={form.actualMonthlyRent} onChange={(e) => setForm({ ...form, actualMonthlyRent: Number(e.target.value) || 0 })} />
              <Select label="Residential city" options={[{ value: 'Metro', label: 'Metro' }, { value: 'Non-Metro', label: 'Non-Metro' }]} value={form.city} onChange={(e) => setForm({ ...form, city: (typeof e === 'string' ? e : e.target.value) as ProofRec['city'] })} />
              <Input label="Landlord name" value={form.landlordName} onChange={(e) => setForm({ ...form, landlordName: e.target.value })} />
              <Input label="Landlord PAN" value={form.landlordPan} onChange={(e) => setForm({ ...form, landlordPan: e.target.value.toUpperCase() })} />
              <Input label="Rental period from" type="date" value={form.rentalFrom} onChange={(e) => setForm({ ...form, rentalFrom: e.target.value })} />
              <Input label="Rental period to" type="date" value={form.rentalTo} onChange={(e) => setForm({ ...form, rentalTo: e.target.value })} />
              <div>
                <label className="mb-1 block text-sm font-medium">Rent receipts</label>
                <input type="file" multiple className="block text-sm" onChange={(e) => setForm({ ...form, rentReceipts: Array.from(e.target.files || []).map((f) => f.name) })} />
                {form.rentReceipts.length > 0 && <p className="text-xs text-gray-500">{form.rentReceipts.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Landlord PAN document {annualRent > 100000 ? '(required)' : ''}</label>
                <input type="file" className="block text-sm" onChange={(e) => setForm({ ...form, landlordPanFile: e.target.files?.[0]?.name || '' })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Rent agreement</label>
                <input type="file" className="block text-sm" onChange={(e) => setForm({ ...form, rentAgreement: e.target.files?.[0]?.name || '' })} />
              </div>
              <Input label="Eligible HRA (engine)" value={inr(hraExempt)} disabled />
            </div>
          </Card>

          <Card title="Tax impact (shared engine, verified amounts only)">
            <div className="grid gap-2 p-4 text-sm md:grid-cols-2">
              <p>Declared exemption {inr(declaredTotal)}</p>
              <p>Submitted proof {inr(submittedTotal)}</p>
              <p>Verified {inr(verifiedTotal)}</p>
              <p>Pending verification {inr(pendingTotal)}</p>
              <p>Remaining to prove {inr(remainingProof)}</p>
              <p>Annual tax on verified proofs {inr(verifiedTax.finalAnnualTax)}</p>
              <p>Monthly TDS ({verifiedTax.remainingMonths || remainingPayrollMonths()} remaining months) {inr(verifiedTax.monthlyTdsEstimate)}</p>
              <p className="md:col-span-2 text-xs text-gray-500">Submitted-but-unverified amounts are not treated as approved deductions. Pack: {verifiedTax.packName || 'Income Tax Slab'}.</p>
              {shortfallTax > 0 && <p className="md:col-span-2 text-amber-800">If HR verifies less than declared, additional tax {inr(Math.max(extraTax, shortfallTax))} may be recovered in {LAST_PAYROLL}.</p>}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('Draft')}><Save className="h-4 w-4 mr-1" />Save draft</Button>
            <Button onClick={() => save('Submitted')}>Submit for verification</Button>
            <Button variant="outline" onClick={() => setMode('list')}>Back</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTaxExemptionProofSubmission;
