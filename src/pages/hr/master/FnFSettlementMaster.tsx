import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Download, FileText, Mail, Save } from 'lucide-react';

const EMP = { name: 'John Smith', id: 'EMP-2045', account: '501000112233', ifsc: 'HDFC0001234', doj: '2018-08-12', lwd: '2026-10-31' };
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function FnFSettlementMaster() {
  const [tab, setTab] = useState<'pre' | 'earn' | 'deduct' | 'net' | 'docs'>('pre');
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [override, setOverride] = useState(false);

  const pre = [
    { c: 'Manager Approval Completed?', s: 'Yes', d: '03-Oct-2026', ok: true },
    { c: 'HR Separation Approval Done?', s: 'Yes', d: '05-Oct-2026', ok: true },
    { c: 'Department Clearances All Cleared?', s: 'No — 2 Departments Pending', d: '', ok: false },
    { c: 'All Assets Returned / Accounted?', s: 'Partial — 5 Assets Pending', d: '', ok: false },
    { c: 'Exit Interview Submitted?', s: 'Yes', d: '08-Oct-2026', ok: true },
    { c: 'Handover Completed?', s: '65% Complete', d: '', ok: false }
  ];
  const blocked = pre.some((p) => !p.ok) && !override;

  const [earn, setEarn] = useState({
    workingDays: 26, worked: 22, basicPerDay: 1538, basic: 33836,
    hra: 10150, transport: 1600, medical: 1250, special: 2200,
    elTotal: 20, elUsed: 8, elEncash: 12, elPerDay: 1538, elAmt: 18456,
    years: 8, gratuity: 14765,
    bonus: 0, perf: 0, arrears: 0, reimb: 0, otherE: 0
  });
  const grossE = earn.basic + earn.hra + earn.transport + earn.medical + earn.special + earn.elAmt + earn.gratuity + earn.bonus + earn.perf + earn.arrears + earn.reimb + earn.otherE;

  const [ded, setDed] = useState({
    shortfall: 0, perDay: 1538, notice: 0,
    asset: 2500, dept: 2500,
    pf: 1800, esi: 0, pt: 200, tds: 1800, advance: 0, loan: 0, uniform: 0, otherD: 0
  });
  const grossD = ded.notice + ded.asset + ded.dept + ded.pf + ded.esi + ded.pt + ded.tds + ded.advance + ded.loan + ded.uniform + ded.otherD;
  const net = grossE - grossD;

  const [pay, setPay] = useState({ mode: 'Bank Transfer', date: '2026-11-10', ref: '', hr: '', fin: '', prin: '' });

  const n = (v: number) => `₹ ${v.toLocaleString('en-IN')}`;
  const setE = (k: keyof typeof earn, v: string) => setEarn((e) => ({ ...e, [k]: Number(v) || 0 }));
  const setDd = (k: keyof typeof ded, v: string) => setDed((d) => ({ ...d, [k]: Number(v) || 0 }));

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Full & Final (F&F) Settlement Master</h1>
        <p className="text-sm text-gray-500">{EMP.name} | {EMP.id} · LWD 31-Oct-2026</p>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}
      <div className="flex flex-wrap gap-1 border-b">
        {([['pre', '3A Pre-conditions'], ['earn', '3B Earnings'], ['deduct', '3C Deductions'], ['net', '3D Net Payable'], ['docs', '3E Documents']] as const).map(([id, l]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'}`}>{l}</button>
        ))}
      </div>

      {tab === 'pre' && (
        <Card title="F&F Pre-condition Checklist">
          <p className="text-xs text-gray-500 mb-3">All items must be complete before F&F can be calculated</p>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{['Condition', 'Status'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {pre.map((p) => (
                <tr key={p.c} className="border-t">
                  <td className="px-3 py-2">{p.c}</td>
                  <td className="px-3 py-2"><Badge variant={p.ok ? 'success' : 'danger'}>{p.s}{p.d ? ` — ${p.d}` : ''}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 font-semibold">{blocked ? 'F&F Activation Status: BLOCKED — conditions pending' : 'F&F Activation Status: READY'}</p>
          <Button className="mt-2" variant="outline" onClick={() => { setOverride(true); setNotice('HR override: F&F activated.'); }}>HR Override: Activate F&F Anyway</Button>
        </Card>
      )}

      {tab === 'earn' && (
        <Card title="Earnings Calculation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Working Days in Month" type="number" value={String(earn.workingDays)} onChange={(e) => setE('workingDays', e.target.value)} />
            <Input label="Days Actually Worked" type="number" value={String(earn.worked)} onChange={(e) => setE('worked', e.target.value)} />
            <Input label="Basic Per Day" type="number" value={String(earn.basicPerDay)} onChange={(e) => setE('basicPerDay', e.target.value)} />
            <Input label="Last Month Basic (Pro-Rated)" type="number" value={String(earn.basic)} onChange={(e) => setE('basic', e.target.value)} />
            <Input label="HRA (Pro-Rated)" type="number" value={String(earn.hra)} onChange={(e) => setE('hra', e.target.value)} />
            <Input label="Transport Allowance" type="number" value={String(earn.transport)} onChange={(e) => setE('transport', e.target.value)} />
            <Input label="Medical Allowance" type="number" value={String(earn.medical)} onChange={(e) => setE('medical', e.target.value)} />
            <Input label="Special Allowance" type="number" value={String(earn.special)} onChange={(e) => setE('special', e.target.value)} />
            <Input label="Total Earned Leaves" type="number" value={String(earn.elTotal)} onChange={(e) => setE('elTotal', e.target.value)} />
            <Input label="Leaves Used" type="number" value={String(earn.elUsed)} onChange={(e) => setE('elUsed', e.target.value)} />
            <Input label="Leaves Encashable" type="number" value={String(earn.elEncash)} onChange={(e) => setE('elEncash', e.target.value)} />
            <Input label="EL Encashment Amount" type="number" value={String(earn.elAmt)} onChange={(e) => setE('elAmt', e.target.value)} />
            <Input label="Years of Service" type="number" value={String(earn.years)} onChange={(e) => setE('years', e.target.value)} />
            <Input label="Gratuity (15/26 × last salary × years)" type="number" value={String(earn.gratuity)} onChange={(e) => setE('gratuity', e.target.value)} />
            <Input label="Bonus / Incentive" type="number" value={String(earn.bonus)} onChange={(e) => setE('bonus', e.target.value)} />
            <Input label="Performance Bonus" type="number" value={String(earn.perf)} onChange={(e) => setE('perf', e.target.value)} />
            <Input label="Arrears" type="number" value={String(earn.arrears)} onChange={(e) => setE('arrears', e.target.value)} />
            <Input label="Reimbursements Pending" type="number" value={String(earn.reimb)} onChange={(e) => setE('reimb', e.target.value)} />
            <Input label="Any Other Earnings" type="number" value={String(earn.otherE)} onChange={(e) => setE('otherE', e.target.value)} />
          </div>
          <p className="text-lg font-bold mt-4">GROSS TOTAL EARNINGS: {n(grossE)}</p>
        </Card>
      )}

      {tab === 'deduct' && (
        <Card title="Deductions Calculation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Notice Shortfall Days (from 2A)" type="number" value={String(ded.shortfall)} onChange={(e) => setDd('shortfall', e.target.value)} />
            <Input label="Per Day Salary" type="number" value={String(ded.perDay)} onChange={(e) => setDd('perDay', e.target.value)} />
            <Input label="Notice Period Recovery" type="number" value={String(ded.notice)} onChange={(e) => setDd('notice', e.target.value)} />
            <Input label="Asset Damage / Loss (Module 1B)" type="number" value={String(ded.asset)} onChange={(e) => setDd('asset', e.target.value)} />
            <Input label="Department Dues (Module 2C)" type="number" value={String(ded.dept)} onChange={(e) => setDd('dept', e.target.value)} />
            <Input label="PF Employee Contribution" type="number" value={String(ded.pf)} onChange={(e) => setDd('pf', e.target.value)} />
            <Input label="ESI Deduction" type="number" value={String(ded.esi)} onChange={(e) => setDd('esi', e.target.value)} />
            <Input label="Professional Tax" type="number" value={String(ded.pt)} onChange={(e) => setDd('pt', e.target.value)} />
            <Input label="TDS / Income Tax" type="number" value={String(ded.tds)} onChange={(e) => setDd('tds', e.target.value)} />
            <Input label="Salary Advance Recovery" type="number" value={String(ded.advance)} onChange={(e) => setDd('advance', e.target.value)} />
            <Input label="Loan EMI Recovery" type="number" value={String(ded.loan)} onChange={(e) => setDd('loan', e.target.value)} />
            <Input label="Uniform / Material Recovery" type="number" value={String(ded.uniform)} onChange={(e) => setDd('uniform', e.target.value)} />
            <Input label="Any Other Deductions" type="number" value={String(ded.otherD)} onChange={(e) => setDd('otherD', e.target.value)} />
          </div>
          <p className="text-lg font-bold mt-4">GROSS TOTAL DEDUCTIONS: {n(grossD)}</p>
        </Card>
      )}

      {tab === 'net' && (
        <Card title={`Full & Final Settlement Summary — ${EMP.name} | ${EMP.id}`}>
          <div className="space-y-2 text-sm max-w-xl">
            <div className="flex justify-between border rounded-lg px-3 py-2"><span>GROSS TOTAL EARNINGS</span><b>{n(grossE)}</b></div>
            <div className="flex justify-between border rounded-lg px-3 py-2"><span>GROSS TOTAL DEDUCTIONS</span><b>{n(grossD)}</b></div>
            {net >= 0
              ? <div className="flex justify-between border border-green-200 bg-green-50 rounded-lg px-3 py-3 text-green-800"><span>NET PAYABLE TO EMPLOYEE</span><b className="text-lg">{n(net)}</b></div>
              : <div className="flex justify-between border border-red-200 bg-red-50 rounded-lg px-3 py-3 text-red-800"><span>NET RECOVERABLE FROM EMPLOYEE</span><b className="text-lg">{n(Math.abs(net))}</b></div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Select label="Payment Mode" options={['Bank Transfer', 'Cheque', 'Cash', 'DD'].map((m) => ({ value: m, label: m }))} value={pay.mode} onChange={(e) => setPay({ ...pay, mode: e.target.value })} />
            <Input label="Bank Account No." value={EMP.account} disabled />
            <Input label="IFSC Code" value={EMP.ifsc} disabled />
            <Input label="Payment Date" type="date" value={pay.date} onChange={(e) => setPay({ ...pay, date: e.target.value })} />
            <Input label="Payment Reference" value={pay.ref} onChange={(e) => setPay({ ...pay, ref: e.target.value })} />
            <Input label="Approved By (HR Head)" value={pay.hr} onChange={(e) => setPay({ ...pay, hr: e.target.value })} />
            <Input label="Approved By (Finance)" value={pay.fin} onChange={(e) => setPay({ ...pay, fin: e.target.value })} />
            <Input label="Approved By (Principal)" value={pay.prin} onChange={(e) => setPay({ ...pay, prin: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" onClick={() => setNotice('Draft saved.')}><Save className="w-4 h-4 mr-1" /> Save as Draft</Button>
            <Button variant="outline" onClick={() => setPreview('F&F Statement')}>Preview F&F Statement</Button>
            <Button variant="primary" disabled={blocked} onClick={() => setNotice('F&F finalized.')}>Finalize F&F</Button>
          </div>
        </Card>
      )}

      {tab === 'docs' && (
        <Card title="Official Document Generation Center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['F&F Settlement Letter', 'Relieving Letter', 'Experience / Service Certificate', 'No Objection Certificate (NOC)'].map((doc) => (
              <div key={doc} className="border rounded-lg p-4">
                <p className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> {doc}</p>
                <p className="text-xs text-gray-500 mt-1">School letterhead · Digital signature · Auto-filled for {EMP.name}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" onClick={() => setPreview(doc)}>Preview</Button>
                  <Button variant="outline" onClick={() => setNotice(`${doc} downloaded.`)}><Download className="w-4 h-4 mr-1" /> PDF</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" onClick={() => setNotice('All documents emailed to the employee.')}><Mail className="w-4 h-4 mr-1" /> Email All Documents</Button>
            <Button variant="outline" onClick={() => setNotice('ZIP downloaded.')}>Download All as ZIP</Button>
            <Button variant="primary" onClick={() => setNotice('Separation marked fully complete.')}>Mark Separation as Fully Complete</Button>
          </div>
        </Card>
      )}

      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title={preview || 'Preview'}>
        <p className="text-sm text-gray-700">Prototype of <b>{preview}</b> on school letterhead for {EMP.name} ({EMP.id}). Net {n(net)}. LWD 31-Oct-2026.</p>
      </Modal>
    </div>
  );
}

export default FnFSettlementMaster;
