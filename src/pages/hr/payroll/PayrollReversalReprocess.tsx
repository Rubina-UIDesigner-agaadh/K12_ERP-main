import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';

type Tab = 'slip' | 'bulk' | 'correction' | 'audit';
type Slip = { id: string; employee: string; employeeId: string; period: string; net: number; status: 'Submitted' | 'Cancelled' | 'Draft'; version: number; submittedOn: string; bankDone: boolean; assignment: string };
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const SLIPS: Slip[] = [
  { id: 'HR-SLIP-10-2026-0023', employee: 'Rajesh Kumar', employeeId: 'EMP-1001', period: 'October 2026', net: 85377, status: 'Submitted', version: 0, submittedOn: '2026-10-28', bankDone: false, assignment: 'SA-01' },
  { id: 'HR-SLIP-10-2026-0024', employee: 'Priya Nair', employeeId: 'EMP-1002', period: 'October 2026', net: 62700, status: 'Submitted', version: 0, submittedOn: '2026-10-28', bankDone: true, assignment: 'SA-02' }
];

export function PayrollReversalReprocess() {
  const [tab, setTab] = useState<Tab>('slip');
  const [slips, setSlips] = useState(SLIPS);
  const [notice, setNotice] = useState('');
  const [reason, setReason] = useState('');
  const [cancelSlip, setCancelSlip] = useState<Slip | null>(null);
  const [assignBlock, setAssignBlock] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [neftSent, setNeftSent] = useState(false);
  const [emp, setEmp] = useState('EMP-1001');
  const [period, setPeriod] = useState('FY 2026-27');
  const [month, setMonth] = useState('October 2026');
  const [days, setDays] = useState('2');
  const [audit] = useState([
    { who: 'HR Manager', when: '2026-10-29 11:20', why: 'Wrong LWP on biometric', original: 85377, revised: 89200, slip: 'HR-SLIP-10-2026-0023-1' }
  ]);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 5000); };
  const withinDeadline = (s: Slip) => {
    const d = (Date.parse('2026-11-02') - Date.parse(s.submittedOn)) / 86400000;
    return d <= 30;
  };

  const doCancel = (s: Slip, amend: boolean) => {
    if (!reason.trim()) { flash('Reversal reason is mandatory.'); return; }
    if (!withinDeadline(s)) { flash('Slip older than 30 days. Use Payroll Correction / Additional Salary only.'); return; }
    if (s.bankDone) { flash('Bank transfer confirmed. Finance Officer approval + bank recall documentation required.'); return; }
    if (s.version >= 3 && amend) { flash('Amended 3 times already. Further corrections via Additional Salary only.'); return; }
    setSlips((p) => p.flatMap((x) => {
      if (x.id !== s.id) return [x];
      const cancelled = { ...x, status: 'Cancelled' as const };
      if (!amend) return [cancelled];
      return [cancelled, { ...x, id: `${x.id.split('-').slice(0, -0).join('-') || x.id}-${x.version + 1}`.replace(/--/, '-'), status: 'Draft' as const, version: x.version + 1 }];
    }));
    setCancelSlip(null);
    flash(amend ? `Slip cancelled. New draft ${s.id}-1 created. Accrual JE reversed.` : `Slip cancelled. Accrual JE reversed for ${s.employee}.`);
  };

  const lwpDayRate = 2404;
  const reverseDays = Number(days) || 0;
  const arrear = reverseDays * lwpDayRate;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Reversal & Re-processing</h1>
        <p className="text-sm text-gray-500">Cancel / amend submitted slips, bulk cancel a payroll entry, or reverse LWP days without cancelling the whole slip.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'slip' as const, label: 'Individual Slip Reversal' }, { id: 'bulk' as const, label: 'Bulk Payroll Reversal' }, { id: 'correction' as const, label: 'Payroll Correction (LWP)' }, { id: 'audit' as const, label: 'Rules & Audit Trail' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'slip' && (
        <Card>
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Slip', 'Employee', 'Period', 'Net', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {slips.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                  <td className="px-3 py-2">{s.employee}</td>
                  <td className="px-3 py-2">{s.period}</td>
                  <td className="px-3 py-2">{inr(s.net)}</td>
                  <td className="px-3 py-2"><Badge variant={s.status === 'Submitted' ? 'success' : s.status === 'Cancelled' ? 'danger' : 'warning'}>{s.status}</Badge></td>
                  <td className="px-3 py-2">
                    {s.status === 'Submitted' && <Button size="xs" variant="ghost" onClick={() => { setCancelSlip(s); setReason(''); }}>Cancel / Amend</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Button variant="outline" onClick={() => setAssignBlock(true)}>Try cancel structure assignment SA-01</Button>
            {assignBlock && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Cannot cancel or edit Salary Structure Assignment SA-01. Submitted slips still use it:
                <ul className="mt-1 list-disc pl-5">{slips.filter((s) => s.assignment === 'SA-01' && s.status === 'Submitted').map((s) => <li key={s.id}>{s.id} — {s.employee}</li>)}</ul>
                Cancel those slips first.
              </div>
            )}
          </div>
        </Card>
      )}

      {tab === 'bulk' && (
        <Card title="Payroll Entry PAYROLL-10-2026-001">
          <p className="text-sm text-gray-600">Cancel cascades to all linked salary slips and reverses the accrual journal entry.</p>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={neftSent} onChange={(e) => setNeftSent(e.target.checked)} /> NEFT file already sent to bank</label>
          <div className="mt-4 flex gap-2">
            <Button variant="danger" onClick={() => setBulkOpen(true)}>Cancel Payroll Entry</Button>
            <Button variant="outline" onClick={() => flash('Selective cancel: only chosen slips reversed; others remain submitted.')}>Selective Cancel</Button>
            <Button variant="outline" onClick={() => flash('Re-run: Create Salary Slips again with corrected data.')}>Re-run Payroll</Button>
          </div>
        </Card>
      )}

      {tab === 'correction' && (
        <Card title="Payroll Correction — LWP Reversal">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee" value={emp} onChange={(e) => setEmp(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'EMP-1001', label: 'Rajesh Kumar (EMP-1001)' }]} />
            <Select label="Payroll Period" value={period} onChange={(e) => setPeriod(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026-27', label: 'FY 2026-27' }]} />
            <Select label="Select Month for LWP Reversal" value={month} onChange={(e) => setMonth(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'October 2026', label: 'October 2026' }]} />
            <Input label="Days to Reverse" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
            <p>Salary Slip: HR-SLIP-10-2026-0023 · Absent 3 · LWP 3 · Working days 26 · LWP applied 3</p>
            <p className="mt-2 font-semibold">Arrear preview</p>
            <p>Basic / DA / HRA restored for {reverseDays} days = {inr(arrear)} (₹{lwpDayRate.toLocaleString('en-IN')}/day)</p>
          </div>
          <Button className="mt-4" onClick={() => flash(`Additional Salary PC-2026-001 created for ${inr(arrear)}. Appears on next payroll as LWP Reversal Arrear.`)}>Submit Correction</Button>
        </Card>
      )}

      {tab === 'audit' && (
        <div className="space-y-4">
          <Card title="School rules">
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Slips can be cancelled only within 30 days of submission.</li>
              <li>If bank transfer is confirmed: Finance Officer approval + bank recall request.</li>
              <li>No slip may be amended more than 3 times — then Additional Salary only.</li>
              <li>Reversal reason is mandatory and stored in the audit log.</li>
            </ul>
          </Card>
          <Card title="Payroll Audit Log">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Who', 'When', 'Why', 'Original', 'Revised', 'Slip'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {audit.map((a, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-2 py-2">{a.who}</td>
                    <td className="px-2 py-2 text-xs">{a.when}</td>
                    <td className="px-2 py-2">{a.why}</td>
                    <td className="px-2 py-2">{inr(a.original)}</td>
                    <td className="px-2 py-2">{inr(a.revised)}</td>
                    <td className="px-2 py-2 font-mono text-xs">{a.slip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Modal isOpen={Boolean(cancelSlip)} onClose={() => setCancelSlip(null)} title="Cancel salary slip" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelSlip(null)}>Abort</Button><Button variant="outline" onClick={() => cancelSlip && doCancel(cancelSlip, false)}>Cancel only</Button><Button variant="danger" onClick={() => cancelSlip && doCancel(cancelSlip, true)}>Cancel & Amend</Button></div>}>
        <p className="mb-2 text-sm text-gray-600">{cancelSlip?.id} · {cancelSlip?.employee}. Cancelling reverses this employee’s accrual JE. Amend creates a new draft with a version suffix.</p>
        <Textarea label="Reversal reason *" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>

      <Modal isOpen={bulkOpen} onClose={() => setBulkOpen(false)} title="Cancelling this Payroll Entry will:" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setBulkOpen(false)}>Abort</Button><Button variant="outline" onClick={() => { setBulkOpen(false); flash('Cancelled JE & slips only. Bank entry left untouched.'); }}>Cancel Only JE & Slips</Button><Button variant="danger" onClick={() => { setBulkOpen(false); flash(neftSent ? 'You must reverse bank transfers manually before everything is cancelled.' : 'All slips, accrual JE and bank entry cancelled.'); }}>Cancel Everything</Button></div>}>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>Cancel 247 Salary Slips</li>
          <li>Cancel Accrual Journal Entry #JE-2026-OCT-001</li>
          <li>Cancel Bank Entry (if already created)</li>
        </ul>
        <p className="mt-3 text-sm">Bank Transfer Status: NEFT file already sent? <b>{neftSent ? 'Yes' : 'No'}</b></p>
        {neftSent && <p className="mt-2 text-sm text-amber-700">If Yes: you must manually reverse bank transfers before proceeding.</p>}
      </Modal>
    </div>
  );
}

export default PayrollReversalReprocess;
