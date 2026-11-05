import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

type Tab = 'doctype' | 'setup' | 'run' | 'tds' | 'je' | 'report';
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const MONTHS = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];
const ARREAR_COMP = [
  { name: 'Basic Pay', on: true, reason: 'Core pay — subject to revision' },
  { name: 'DA', on: true, reason: 'Formula-linked to basic' },
  { name: 'HRA', on: true, reason: 'Formula-linked to basic' },
  { name: 'Transport Allowance', on: false, reason: 'Fixed government rate' },
  { name: 'PF (Employee)', on: true, reason: 'More basic = more PF' },
  { name: 'ESI', on: true, reason: 'Gross may cross ₹21K' },
  { name: 'Income Tax (TDS)', on: true, reason: 'Higher earnings = higher tax' },
  { name: 'Performance Bonus', on: false, reason: 'Discretionary' },
  { name: 'LTA', on: false, reason: 'Annual benefit' }
];

export function SupplementaryArrearPayroll() {
  const [tab, setTab] = useState<Tab>('doctype');
  const [notice, setNotice] = useState('');
  const [emp, setEmp] = useState('EMP-1042');
  const [from, setFrom] = useState('2026-04-01');
  const [to, setTo] = useState('2026-10-31');
  const [oldStruct, setOldStruct] = useState('Teaching Grade B 2025');
  const [newStruct, setNewStruct] = useState('Teaching Staff - Permanent');
  const [oldBase, setOldBase] = useState(45000);
  const [newBase, setNewBase] = useState(50000);
  const [form10e, setForm10e] = useState(false);
  const [components, setComponents] = useState(ARREAR_COMP);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };
  const delta = newBase - oldBase;
  const months = MONTHS.map((m, i) => {
    const oldNet = 62000;
    const newNet = 68000;
    const arrear = newNet - oldNet;
    const oldTds = 2800;
    const newTds = 3200;
    return { month: m, slip: `HR-SLIP-${String(i + 4).padStart(2, '0')}-2026-0023`, oldNet, newNet, arrear, oldTds, newTds, tdsDiff: newTds - oldTds, payable: arrear - (newTds - oldTds) };
  });
  const grossArrear = 42000;
  const tds = form10e ? 4200 : 8400;
  const pf = 3024;
  const relief = form10e ? 4200 : 0;
  const net = grossArrear - tds - pf;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supplementary / Arrear Payroll</h1>
        <p className="text-sm text-gray-500">Retroactive structure changes, pay commission, delayed increment and Section 89(1) TDS on arrears.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {[{ id: 'doctype' as const, label: 'Arrear' }, { id: 'setup' as const, label: 'Arrear Components' }, { id: 'run' as const, label: 'Supplementary Run' }, { id: 'tds' as const, label: 'TDS / Form 10E' }, { id: 'je' as const, label: 'Journal Entry' }, { id: 'report' as const, label: 'Arrear Report' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'doctype' && (
        <Card title="Arrear">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={emp} onChange={(e) => setEmp(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'EMP-1042', label: 'Meera Iyer (EMP-1042) — 7 historical slips' }]} />
            <Input label="Company" value="EduManager School" readOnly />
            <Select label="Payroll Period" value="FY 2026-27" onChange={() => undefined} options={[{ value: 'FY 2026-27', label: 'FY 2026-27' }]} />
            <Input label="From Date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To Date" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <Select label="Previous Salary Structure" value={oldStruct} onChange={(e) => setOldStruct(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'Teaching Grade B 2025', label: 'Teaching Grade B 2025' }]} />
            <Select label="New Salary Structure" value={newStruct} onChange={(e) => setNewStruct(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'Teaching Staff - Permanent', label: 'Teaching Staff - Permanent' }]} />
            <Input label="Previous Base Amount" type="number" value={String(oldBase)} onChange={(e) => setOldBase(Number(e.target.value))} />
            <Input label="New Base Amount" type="number" value={String(newBase)} onChange={(e) => setNewBase(Number(e.target.value))} />
          </div>
          <p className="mt-3 text-sm text-gray-500">Monthly basic difference {inr(delta)}. Arrear components must have Is Arrear Component ON (depends on payment days).</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Month', 'Slip', 'Old Net', 'New Net', 'Arrear', 'TDS Diff', 'Net Payable'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.month} className="border-b">
                    <td className="px-2 py-2">{m.month}</td>
                    <td className="px-2 py-2 font-mono text-xs">{m.slip}</td>
                    <td className="px-2 py-2">{inr(m.oldNet)}</td>
                    <td className="px-2 py-2">{inr(m.newNet)}</td>
                    <td className="px-2 py-2">{inr(m.arrear)}</td>
                    <td className="px-2 py-2">{inr(m.tdsDiff)}</td>
                    <td className="px-2 py-2 font-semibold">{inr(m.payable)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl border bg-indigo-50 p-4 text-sm">
            <p className="font-semibold">Arrear calculation summary · April 2026 – October 2026 (7 months)</p>
            <p>Gross Arrear (Earnings): {inr(grossArrear)}</p>
            <p>Additional TDS on Arrear: ({inr(tds)})</p>
            <p>Additional PF on Arrear: ({inr(pf)})</p>
            <p className="mt-1 font-bold">Net Arrear Payable: {inr(net)} (via Additional Salary in November 2026)</p>
          </div>
          <Button className="mt-4" onClick={() => flash('Arrear saved. Additional Salary entries created for earnings, deductions and accruals.')}>Save Arrear</Button>
        </Card>
      )}

      {tab === 'setup' && (
        <Card title="Which components are arrear-enabled">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Component', 'Arrear enabled', 'Reason'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {components.map((c) => (
                <tr key={c.name} className="border-b">
                  <td className="px-2 py-2">{c.name}</td>
                  <td className="px-2 py-2"><input type="checkbox" checked={c.on} onChange={(e) => setComponents((p) => p.map((x) => x.name === c.name ? { ...x, on: e.target.checked } : x))} /></td>
                  <td className="px-2 py-2 text-xs text-gray-500">{c.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'run' && (
        <Card title="Supplementary Payroll Entry — Arrear Payroll November 2026 (Apr–Oct Arrear)">
          <p className="text-sm text-gray-600">Get Employees pulls only staff with pending Arrear records. Slip is marked ARREAR SALARY SLIP — not a regular pay slip.</p>
          <Button className="mt-3" onClick={() => flash('3 employees with pending arrears fetched.')}>Get Employees (arrear eligible)</Button>
          <pre className="mt-4 overflow-auto rounded-lg bg-gray-50 p-4 text-xs whitespace-pre-wrap">{`EDUMANAGER SCHOOL
ARREAR SALARY SLIP — November 2026
Arrear Period: April 2026 – October 2026
Employee: Meera Iyer | EMP-1042 | PGT Physics

ARREAR EARNINGS:
Basic Pay Arrear    (7 months × ₹5,000)  ₹35,000
DA Arrear           (7 months × ₹2,250)  ₹15,750
HRA Arrear          (7 months × ₹2,000)  ₹14,000
Gross Arrear Earnings:                   ₹64,750

ARREAR DEDUCTIONS:
Additional TDS on Arrear:               (₹12,950)
Additional PF on Arrear:                 (₹4,095)
Net Arrear Payable:                      ₹47,705

This is an arrear payment. Regular salary is processed separately.`}</pre>
        </Card>
      )}

      {tab === 'tds' && (
        <Card title="TDS treatment on arrears — Section 89(1)">
          <p className="text-sm text-gray-600">Remind employees to file Form 10E on the Income Tax portal before claiming relief.</p>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={form10e} onChange={(e) => setForm10e(e.target.checked)} /> Employee has filed Form 10E?</label>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">Tax on (current + arrear)<br /><b>{inr(56000)}</b></div>
            <div className="rounded-lg bg-gray-50 p-3">Tax current + tax on year arrear relates to<br /><b>{inr(51800)}</b></div>
            <div className="rounded-lg bg-indigo-50 p-3">89(1) Relief<br /><b>{inr(relief)}</b></div>
          </div>
          <p className="mt-3 text-sm">{form10e ? 'Reduced TDS applied as a credit in TDS calculation.' : 'Full TDS deducted until Form 10E is confirmed.'}</p>
        </Card>
      )}

      {tab === 'je' && (
        <Card title="Arrear Journal Entry">
          <p className="mb-3 text-sm text-gray-500">Booked to “Salary Arrears — FY 2025-26” so current-year payroll expense is not inflated.</p>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Account', 'Dr', 'Cr'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              <tr className="border-b"><td className="px-2 py-2">Salary Arrear Expense</td><td>{inr(grossArrear)}</td><td /></tr>
              <tr className="border-b"><td className="px-2 py-2">Arrear TDS Payable</td><td /><td>{inr(tds)}</td></tr>
              <tr className="border-b"><td className="px-2 py-2">Arrear PF Payable</td><td /><td>{inr(pf)}</td></tr>
              <tr className="border-b"><td className="px-2 py-2">Salaries Payable — Arrear</td><td /><td>{inr(net)}</td></tr>
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'report' && (
        <Card title="Arrear Report">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Employee', 'Dept / Desig', 'Period', 'Gross', 'TDS', 'PF', 'Net Paid', '89(1)'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              <tr className="border-b">
                <td className="px-2 py-2">Meera Iyer<br /><span className="text-xs text-gray-400">EMP-1042</span></td>
                <td className="px-2 py-2">Science / PGT</td>
                <td className="px-2 py-2">April – October 2026</td>
                <td className="px-2 py-2">{inr(grossArrear)}</td>
                <td className="px-2 py-2">{inr(tds)}</td>
                <td className="px-2 py-2">{inr(pf)}</td>
                <td className="px-2 py-2 font-semibold">{inr(net)}</td>
                <td className="px-2 py-2">{inr(relief)}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default SupplementaryArrearPayroll;
