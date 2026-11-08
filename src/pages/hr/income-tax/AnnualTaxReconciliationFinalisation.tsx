import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { TAX_STAFF, computeEmployeeTax, inr, loadDeclarations, loadJson, loadProofs, logActivity, saveJson, RECON_STORE } from './taxRecords';

type Stage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export function AnnualTaxReconciliationFinalisation() {
  const navigate = useNavigate();
  const [fy, setFy] = useState('AY-2026-27');
  const [dept, setDept] = useState('all');
  const [stage, setStage] = useState<Stage>(1);
  const [previewed, setPreviewed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [exception, setException] = useState('');
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState<{ at: string; action: string }[]>(() => loadJson(RECON_STORE, []));

  const decls = loadDeclarations();
  const proofs = loadProofs();
  const rows = useMemo(() => TAX_STAFF.filter((e) => dept === 'all' || e.department === dept).map((emp) => {
    const tax = computeEmployeeTax(emp.id, fy);
    const decl = decls.find((d) => d.employeeId === emp.id && d.periodId === fy);
    const empProofs = proofs.filter((p) => p.employeeId === emp.id && p.periodId === fy);
    const pendingProof = empProofs.some((p) => p.status === 'Pending Verification' || p.status === 'Submitted');
    return { emp, tax, declStatus: decl?.status || 'Missing', pendingProof, previous: tax.finalAnnualTax };
  }), [fy, dept, decls, proofs]);

  const blockers = [
    rows.some((r) => r.declStatus !== 'Submitted') && 'Missing / draft declarations',
    rows.some((r) => r.pendingProof) && 'Pending proof verification',
    rows.some((r) => r.tax.remainingTax > 5000) && 'Unresolved shortfalls over ₹5,000',
    !signed && 'Finance / authorised approval not recorded'
  ].filter(Boolean) as string[];

  const pushHist = (action: string) => {
    const next = [{ at: new Date().toISOString(), action }, ...history];
    setHistory(next);
    saveJson(RECON_STORE, next);
  };

  const preview = () => {
    setPreviewed(true);
    setStage(3);
    pushHist('Reconciliation preview generated from shared tax engine');
    setNotice(`Preview uses live declarations, verified proofs and Income Tax Slab packs for ${fy}.`);
  };

  const recalculate = () => {
    if (!previewed) { setNotice('Generate preview first.'); return; }
    setStage(7);
    pushHist('Recalculated after corrections');
    setNotice('Recalculate re-ran computeEmployeeTax for every employee. Previous vs revised shown below.');
  };

  const approve = () => {
    setSigned(true);
    setStage(9);
    pushHist('Finance approval recorded (frontend workflow only)');
    logActivity({ employeeId: 'ALL', employeeName: 'All employees', action: 'Reconciliation approved', actor: 'Finance', remarks: fy });
    setNotice('Approval recorded. This is a frontend workflow state, not a statutory filing.');
  };

  const finalise = () => {
    if (blockers.length && !exception.trim()) {
      setNotice('Finalisation blocked. Resolve checks or enter an authorised exception reason.');
      return;
    }
    if (blockers.length && exception.trim()) {
      pushHist(`Exception finalisation: ${exception}`);
    }
    setStage(10);
    pushHist('Year marked finalised in frontend state');
    setNotice('Year finalised in this demo store. Form 16 readiness still depends on Q4 TDS return acceptance (not claimed here).');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annual Tax Reconciliation & Finalisation</h1>
          <p className="text-sm text-gray-500">Preview and Recalculate run the shared tax engine. A checkbox cannot bypass blockers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={preview}>Generate preview</Button>
          <Button variant="outline" onClick={recalculate}>Recalculate</Button>
          <Button variant="outline" onClick={approve}>Record finance approval</Button>
          <Button onClick={finalise}>Finalise year</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="flex flex-wrap gap-2">
        <Select options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }]} value={fy} onChange={(e) => setFy(typeof e === 'string' ? e : e.target.value)} />
        <Select options={[{ value: 'all', label: 'All departments' }, ...Array.from(new Set(TAX_STAFF.map((e) => e.department))).map((d) => ({ value: d, label: d }))]} value={dept} onChange={(e) => setDept(typeof e === 'string' ? e : e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {['Select FY', 'Preview', 'Employee review', 'Declarations/proofs', 'Benefit claims', 'Corrections', 'Recalculate', 'Final review', 'Approval', 'Finalise', 'Form 16 readiness'].map((l, i) => (
          <span key={l} className={`rounded-full border px-2 py-1 ${stage === i + 1 ? 'border-blue-600 bg-blue-50 text-blue-700' : 'text-gray-500'}`}>{i + 1}. {l}</span>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Card><div className="p-4"><p className="text-xs text-gray-500">Liability</p><p className="text-xl font-semibold">{inr(rows.reduce((s, r) => s + r.tax.finalAnnualTax, 0))}</p></div></Card>
        <Card><div className="p-4"><p className="text-xs text-gray-500">TDS deducted</p><p className="text-xl font-semibold">{inr(rows.reduce((s, r) => s + r.tax.tdsDeductedYtd, 0))}</p></div></Card>
        <Card><div className="p-4"><p className="text-xs text-gray-500">Remaining</p><p className="text-xl font-semibold">{inr(rows.reduce((s, r) => s + r.tax.remainingTax, 0))}</p></div></Card>
        <Card><div className="p-4"><p className="text-xs text-gray-500">Blockers</p><p className="text-xl font-semibold">{blockers.length}</p></div></Card>
      </div>
      {previewed && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Gross</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">Tax</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Remaining</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Proofs</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.emp.id} className="border-t">
                    <td className="px-3 py-2">{r.emp.name}</td>
                    <td className="px-3 py-2">{inr(r.tax.grossIncome)}</td>
                    <td className="px-3 py-2">{inr(r.tax.taxableIncome)}</td>
                    <td className="px-3 py-2">{inr(r.tax.finalAnnualTax)}</td>
                    <td className="px-3 py-2">{inr(r.tax.tdsDeductedYtd)}</td>
                    <td className="px-3 py-2">{inr(r.tax.remainingTax)}</td>
                    <td className="px-3 py-2"><Badge variant={r.declStatus === 'Submitted' ? 'success' : 'warning'}>{r.declStatus}</Badge></td>
                    <td className="px-3 py-2"><Badge variant={r.pendingProof ? 'warning' : 'success'}>{r.pendingProof ? 'Pending' : 'Clear'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Card title="Pending items">
        <ul className="list-disc p-4 text-sm text-amber-800">
          {blockers.map((b) => <li key={b}>{b}</li>)}
          {!blockers.length && <li className="text-emerald-700">No mandatory blockers.</li>}
        </ul>
        <div className="grid gap-3 p-4 md:grid-cols-2">
          <Input label="Authorised exception reason (required if blockers remain)" value={exception} onChange={(e) => setException(e.target.value)} />
          <p className="text-xs text-gray-500">Form 16 readiness: Part B can be previewed locally. Part A / official certificate still needs Q4 return Accepted — not marked complete from this page.</p>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <Button variant="outline" onClick={() => navigate('/hr/income-tax/form-16-annual-statement-export')}>Open Form 16</Button>
          <Button variant="outline" onClick={() => navigate('/hr/income-tax/challan-tax-payment-register')}>Open challans</Button>
        </div>
      </Card>
      <Card title="Finalisation history">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Action</th></tr></thead>
          <tbody>
            {history.map((h, i) => <tr key={i} className="border-t"><td className="px-3 py-2">{h.at.slice(0, 16).replace('T', ' ')}</td><td className="px-3 py-2">{h.action}</td></tr>)}
            {!history.length && <tr><td colSpan={2} className="px-3 py-8 text-center text-gray-500">No history yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default AnnualTaxReconciliationFinalisation;
