import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type RecType = 'Arrear' | 'Additional Salary' | 'Payroll Correction';
type Status = 'Draft' | 'Submitted for Review' | 'Finance Approved' | 'Principal Approved' | 'Submitted' | 'Cancelled';
type TdsMethod = 'Spread' | 'Full this month';

type RecordRow = {
  id: string;
  type: RecType;
  employeeId: string;
  employee: string;
  designation: string;
  department: string;
  component: string;
  amount: number;
  payrollMonth: string;
  status: Status;
  tds: TdsMethod;
  createdBy: string;
  createdOn: string;
  reason: string;
};

const STAFF = [
  { id: 'EMP-1042', name: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', structure: 'Teaching Staff - Permanent', basic: 50000, assignedFrom: '2026-08-01' },
  { id: 'EMP-1088', name: 'Rajesh Kumar', designation: 'TGT Maths', department: 'Mathematics', structure: 'Teaching Grade B 2026', basic: 42000, assignedFrom: '2026-04-01' },
  { id: 'EMP-1101', name: 'Kavita Shah', designation: 'Clerk', department: 'Administration', structure: 'Non-Teaching Grade C', basic: 28000, assignedFrom: '2026-04-01' }
];

const STRUCTURES = ['Teaching Staff - Permanent', 'Teaching Grade B 2026', 'Non-Teaching Grade C'];
const COMPONENTS = [
  { name: 'Performance Bonus', kind: 'Earning' },
  { name: 'Festival Advance', kind: 'Earning' },
  { name: 'Overtime Amount', kind: 'Earning' },
  { name: 'Leave Encashment', kind: 'Earning' },
  { name: 'Advance Recovery', kind: 'Deduction' },
  { name: 'Excess Pay Recovery', kind: 'Deduction' }
];

const SEED: RecordRow[] = [
  { id: 'ARR-2026-014', type: 'Arrear', employeeId: 'EMP-1042', employee: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', component: 'Multiple Components', amount: 28500, payrollMonth: '2026-10', status: 'Submitted', tds: 'Spread', createdBy: 'Payroll Manager', createdOn: '2026-10-04', reason: 'Pay revision effective Apr 2026, assigned Aug 2026' },
  { id: 'ADS-2026-088', type: 'Additional Salary', employeeId: 'EMP-1088', employee: 'Rajesh Kumar', designation: 'TGT Maths', department: 'Mathematics', component: 'Performance Bonus', amount: 12000, payrollMonth: '2026-10', status: 'Finance Approved', tds: 'Full this month', createdBy: 'Payroll Manager', createdOn: '2026-10-12', reason: 'Board result preparation bonus' },
  { id: 'ADS-2026-091', type: 'Additional Salary', employeeId: 'EMP-1101', employee: 'Kavita Shah', designation: 'Clerk', department: 'Administration', component: 'Advance Recovery', amount: -5000, payrollMonth: '2026-10', status: 'Submitted', tds: 'Spread', createdBy: 'Payroll Manager', createdOn: '2026-10-01', reason: 'Festival advance instalment 2 of 6' },
  { id: 'COR-2026-007', type: 'Payroll Correction', employeeId: 'EMP-1042', employee: 'Meera Iyer', designation: 'PGT Physics', department: 'Science', component: 'Basic Salary LWP Reversal', amount: 1923, payrollMonth: '2026-10', status: 'Submitted for Review', tds: 'Spread', createdBy: 'Payroll Manager', createdOn: '2026-10-18', reason: 'Exam duty marked absent in error — Aug 2026' }
];

const ARREAR_EARNINGS = [
  { month: 'Apr 2026', slip: 'HR-SLIP-04-2026-0023', name: 'Basic Pay', oldAmt: 45000, newAmt: 50000 },
  { month: 'Apr 2026', slip: 'HR-SLIP-04-2026-0023', name: 'DA', oldAmt: 20250, newAmt: 22500 },
  { month: 'May 2026', slip: 'HR-SLIP-05-2026-0023', name: 'Basic Pay', oldAmt: 45000, newAmt: 50000 },
  { month: 'May 2026', slip: 'HR-SLIP-05-2026-0023', name: 'HRA', oldAmt: 18000, newAmt: 20000 }
];
const ARREAR_DEDUCTIONS = [
  { month: 'Apr 2026', slip: 'HR-SLIP-04-2026-0023', name: 'PF (Employee)', oldAmt: 1800, newAmt: 1800 },
  { month: 'May 2026', slip: 'HR-SLIP-05-2026-0023', name: 'PF (Employee)', oldAmt: 1800, newAmt: 1800 }
];

export function SupplementaryArrearPayroll() {
  const navigate = useNavigate();
  const [period] = useState('FY 2026-27 (01-04-2026 to 31-03-2027)');
  const [type, setType] = useState<RecType>('Arrear');
  const [rows, setRows] = useState<RecordRow[]>(SEED);
  const [notice, setNotice] = useState('');
  const [empId, setEmpId] = useState('EMP-1042');
  const [structure, setStructure] = useState('Teaching Staff - Permanent');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [payrollDate, setPayrollDate] = useState('2026-10-31');
  const [tdsMethod, setTdsMethod] = useState<TdsMethod>('Spread');
  const [component, setComponent] = useState('Performance Bonus');
  const [amount, setAmount] = useState(10000);
  const [reason, setReason] = useState('');
  const [overwrite, setOverwrite] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [fromRec, setFromRec] = useState('2026-10-01');
  const [toRec, setToRec] = useState('2027-03-31');
  const [lwpMonth, setLwpMonth] = useState('2026-08');
  const [daysReverse, setDaysReverse] = useState(2);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const emp = STAFF.find((s) => s.id === empId)!;
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4500); };
  const earnTotal = ARREAR_EARNINGS.reduce((s, r) => s + (r.newAmt - r.oldAmt), 0);
  const dedTotal = ARREAR_DEDUCTIONS.reduce((s, r) => s + (r.newAmt - r.oldAmt), 0);
  const netArrear = earnTotal - dedTotal;
  const compMeta = COMPONENTS.find((c) => c.name === component);
  const signedAmount = compMeta?.kind === 'Deduction' ? -Math.abs(amount) : Math.abs(amount);
  const remainingMonths = 5;
  const annualBefore = 720000;
  const extra = type === 'Arrear' ? netArrear : Math.max(0, signedAmount);
  const annualAfter = annualBefore + extra;
  const taxBefore = 62400;
  const taxAfter = taxBefore + Math.round(extra * 0.1);
  const tdsToDate = 36400;
  const monthlySpread = Math.round((taxAfter - tdsToDate) / remainingMonths);
  const monthlyFull = Math.round(taxBefore / 12) + Math.round(extra * 0.1);
  const thisMonthTds = tdsMethod === 'Spread' ? monthlySpread : monthlyFull;

  const list = rows.filter((r) => {
    if (filterType && r.type !== filterType) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterDept && r.department !== filterDept) return false;
    return true;
  });

  const totals = {
    arrear: rows.filter((r) => r.type === 'Arrear' && r.status === 'Submitted').reduce((s, r) => s + r.amount, 0),
    earn: rows.filter((r) => r.type === 'Additional Salary' && r.amount > 0).reduce((s, r) => s + r.amount, 0),
    ded: rows.filter((r) => r.type === 'Additional Salary' && r.amount < 0).reduce((s, r) => s + r.amount, 0),
    lwp: rows.filter((r) => r.type === 'Payroll Correction').reduce((s, r) => s + r.amount, 0)
  };

  const addRecord = (status: Status) => {
    const idPrefix = type === 'Arrear' ? 'ARR' : type === 'Additional Salary' ? 'ADS' : 'COR';
    const rec: RecordRow = {
      id: `${idPrefix}-${Date.now()}`,
      type,
      employeeId: emp.id,
      employee: emp.name,
      designation: emp.designation,
      department: emp.department,
      component: type === 'Arrear' ? 'Multiple Components' : type === 'Additional Salary' ? component : 'Basic Salary LWP Reversal',
      amount: type === 'Arrear' ? netArrear : type === 'Additional Salary' ? signedAmount : Math.round(emp.basic / 26 * daysReverse),
      payrollMonth: payrollDate.slice(0, 7),
      status,
      tds: tdsMethod,
      createdBy: 'Payroll Manager',
      createdOn: '2026-11-06',
      reason: reason || (type === 'Arrear' ? `Arrear from ${fromDate}` : type === 'Payroll Correction' ? `LWP reversal ${lwpMonth}` : component)
    };
    setRows((p) => [rec, ...p]);
    flash(status === 'Draft' ? `${type} saved as Draft.` : `${type} ${rec.id} submitted for Finance review.`);
  };

  const route = (id: string, status: Status) => {
    setRows((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    flash(`Record ${id} → ${status}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supplementary / Arrear Payroll</h1>
        <p className="text-sm text-gray-500">Arrears, additional salary and LWP corrections for off-cycle payments. Submitted slips follow a separate lock/release cycle on Payslip Lock &amp; Release — they are not published with the regular monthly batch.</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => navigate('/hr/payroll/payslip-lock-release')}>Open Payslip Lock &amp; Release</Button>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Select label="Payroll Period *" value={period} onChange={() => undefined} options={[{ value: period, label: period }]} />
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">School Financial Year</p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">FY 2026–27 April to March</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Record type</p>
            <div className="flex flex-wrap gap-1 rounded-full border border-gray-200 bg-gray-100 p-1">
              {(['Arrear', 'Additional Salary', 'Payroll Correction'] as RecType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${type === t ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {type === 'Arrear' &&
      <Card title="Arrear Entry">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={empId} onChange={(e) => { const v = typeof e === 'string' ? e : e.target.value; setEmpId(v); const s = STAFF.find((x) => x.id === v); if (s) setStructure(s.structure); }} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{emp.designation} · {emp.department}<p>Current structure: {emp.structure} from {emp.assignedFrom} · Basic {inr(emp.basic)}</p></div>
            <Select label="New Salary Structure *" value={structure} onChange={(e) => setStructure(typeof e === 'string' ? e : e.target.value)} options={STRUCTURES.map((s) => ({ value: s, label: s }))} />
            <Input label="Arrear From Date *" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <Input label="Payroll Date *" type="date" value={payrollDate} onChange={(e) => setPayrollDate(e.target.value)} />
            <Select label="TDS Distribution" value={tdsMethod} onChange={(e) => setTdsMethod((typeof e === 'string' ? e : e.target.value) as TdsMethod)} options={[{ value: 'Spread', label: 'Spread Across Remaining Months' }, { value: 'Full this month', label: 'Deduct Full Tax in This Month' }]} />
          </div>
          <p className="mt-4 mb-2 text-sm font-semibold text-gray-800">Arrear computation preview</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-emerald-50 text-left text-xs uppercase text-emerald-800">{['Month', 'Slip', 'Component', 'Old', 'New', 'Arrear'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {ARREAR_EARNINGS.map((r, i) => (
                  <tr key={`e${i}`} className="border-b"><td className="px-3 py-2">{r.month}</td><td className="px-3 py-2 font-mono text-xs">{r.slip}</td><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{inr(r.oldAmt)}</td><td className="px-3 py-2">{inr(r.newAmt)}</td><td className="px-3 py-2 font-medium">{inr(r.newAmt - r.oldAmt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-red-50 text-left text-xs uppercase text-red-800">{['Month', 'Slip', 'Deduction', 'Old', 'New', 'Difference'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {ARREAR_DEDUCTIONS.map((r, i) => (
                  <tr key={`d${i}`} className="border-b"><td className="px-3 py-2">{r.month}</td><td className="px-3 py-2 font-mono text-xs">{r.slip}</td><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{inr(r.oldAmt)}</td><td className="px-3 py-2">{inr(r.newAmt)}</td><td className="px-3 py-2">{inr(r.newAmt - r.oldAmt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3 rounded-lg bg-indigo-50 p-4 text-sm">
            <p>Total arrear earnings <b>{inr(earnTotal)}</b></p>
            <p>Total arrear deductions <b>{inr(dedTotal)}</b></p>
            <p>Net arrear payable <b className="text-indigo-800">{inr(netArrear)}</b></p>
          </div>
        </Card>
      }

      {type === 'Additional Salary' &&
      <Card title="Additional Salary Entry">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={empId} onChange={(e) => setEmpId(typeof e === 'string' ? e : e.target.value)} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{emp.designation} · {emp.department}<p>Active structure: {emp.structure}</p></div>
            <Select label="Salary Component *" value={component} onChange={(e) => setComponent(typeof e === 'string' ? e : e.target.value)} options={COMPONENTS.map((c) => ({ value: c.name, label: `${c.name} (${c.kind})` }))} />
            <Input label="Component Amount *" type="number" value={String(amount)} onChange={(e) => setAmount(Number(e.target.value))} />
            {!recurring && <Input label="Payroll Date *" type="date" value={payrollDate} onChange={(e) => setPayrollDate(e.target.value)} />}
            {recurring && <Input label="From Date *" type="date" value={fromRec} onChange={(e) => setFromRec(e.target.value)} />}
            {recurring && <Input label="To Date *" type="date" value={toRec} onChange={(e) => setToRec(e.target.value)} />}
            <Select label="TDS Distribution" value={tdsMethod} onChange={(e) => setTdsMethod((typeof e === 'string' ? e : e.target.value) as TdsMethod)} options={[{ value: 'Spread', label: 'Spread Across Remaining Months' }, { value: 'Full this month', label: 'Deduct Full Tax in This Month' }]} />
            <div className="md:col-span-2"><Textarea label="Reason / Reference *" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} /> Overwrite salary structure amount</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} /> Is Recurring</label>
          </div>
          {overwrite && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Overwrite ON — this amount replaces the structure value for {component} in the target month (signed {inr(signedAmount)}).</p>}
          {amount >= 5000 && compMeta?.kind === 'Earning' && <p className="mt-2 text-xs text-amber-700">Finance Officer approval required for earning additional salaries above ₹5,000.</p>}
          {amount >= 25000 && <p className="mt-2 text-xs text-amber-700">Principal approval required (amount ≥ ₹25,000).</p>}
        </Card>
      }

      {type === 'Payroll Correction' &&
      <Card title="Payroll Correction — LWP reversal">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Employee *" value={empId} onChange={(e) => setEmpId(typeof e === 'string' ? e : e.target.value)} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <Input label="Payroll Period" value={period} readOnly />
            <Select label="Month for LWP Reversal *" value={lwpMonth} onChange={(e) => setLwpMonth(typeof e === 'string' ? e : e.target.value)} options={[{ value: '2026-08', label: 'August 2026' }, { value: '2026-09', label: 'September 2026' }]} />
            <Input label="Days to Reverse *" type="number" value={String(daysReverse)} onChange={(e) => setDaysReverse(Math.min(3, Math.max(1, Number(e.target.value))))} />
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 md:col-span-2">
              Slip HR-SLIP-08-2026-0023 · Absent 3 · LWP 3 · Working days 26 · LWP applied 3. Days to reverse cannot exceed 3.
            </div>
            <div className="md:col-span-2"><Textarea label="Supporting document reference *" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
            <Button variant="outline" size="sm" onClick={() => flash('HOD certification attached: duty-roster-aug-2026.pdf')}>Attach HOD certification</Button>
          </div>
          <div className="mt-4 rounded-lg border p-4 text-sm">
            <p className="font-semibold">Reversal computation</p>
            <p>Per-day basic {inr(emp.basic / 26)} × {daysReverse} day(s) = <b>{inr(emp.basic / 26 * daysReverse)}</b> restored on next payroll.</p>
          </div>
        </Card>
      }

      <Card title="TDS impact preview">
        <div className="grid gap-4 md:grid-cols-4 text-sm">
          <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase text-gray-400">Annual taxable before</p><p className="font-semibold">{inr(annualBefore)}</p></div>
          <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase text-gray-400">After supplementary</p><p className="font-semibold">{inr(annualAfter)}</p></div>
          <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase text-gray-400">TDS deducted to date</p><p className="font-semibold">{inr(tdsToDate)}</p></div>
          <div className="rounded-lg bg-indigo-50 p-3"><p className="text-xs uppercase text-indigo-500">Revised TDS this month</p><p className="font-semibold text-indigo-800">{inr(thisMonthTds)}</p></div>
        </div>
        {thisMonthTds > 2 * (taxBefore / 12) && <p className="mt-3 text-sm text-amber-700">Significant TDS increase — employee should be notified.</p>}
        <Button variant="outline" size="sm" className="mt-3" onClick={() => flash('TDS impact notification queued to the employee.')}>Send TDS impact notification</Button>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => addRecord('Draft')}>Save Draft</Button>
        <Button onClick={() => addRecord('Submitted for Review')}>Submit for Review</Button>
      </div>

      <Card title="Supplementary Payroll Register">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <Select label="Type" value={filterType} onChange={(e) => setFilterType(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All types' }, { value: 'Arrear', label: 'Arrear' }, { value: 'Additional Salary', label: 'Additional Salary' }, { value: 'Payroll Correction', label: 'Payroll Correction' }]} />
          <Select label="Department" value={filterDept} onChange={(e) => setFilterDept(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Science', label: 'Science' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Administration', label: 'Administration' }]} />
          <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All statuses' }, { value: 'Draft', label: 'Draft' }, { value: 'Submitted for Review', label: 'Submitted for Review' }, { value: 'Finance Approved', label: 'Finance Approved' }, { value: 'Submitted', label: 'Submitted' }]} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Type', 'Ref', 'Employee', 'Component', 'Amount', 'Month', 'Status', 'TDS', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2">{r.employee}<p className="text-xs text-gray-400">{r.employeeId} · {r.department}</p></td>
                  <td className="px-3 py-2">{r.component}</td>
                  <td className={`px-3 py-2 font-semibold ${r.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>{inr(r.amount)}</td>
                  <td className="px-3 py-2">{r.payrollMonth}</td>
                  <td className="px-3 py-2"><Badge variant={r.status === 'Submitted' ? 'success' : r.status === 'Cancelled' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                  <td className="px-3 py-2 text-xs">{r.tds}</td>
                  <td className="px-3 py-2">
                    {r.status === 'Submitted for Review' && <Button size="xs" onClick={() => route(r.id, 'Finance Approved')}>Finance Approve</Button>}
                    {r.status === 'Finance Approved' && <Button size="xs" onClick={() => route(r.id, 'Principal Approved')}>Principal Approve</Button>}
                    {r.status === 'Principal Approved' && <Button size="xs" onClick={() => route(r.id, 'Submitted')}>Submit</Button>}
                    {r.status === 'Draft' && <Button size="xs" variant="ghost" onClick={() => route(r.id, 'Cancelled')}>Cancel</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5 text-sm">
          <div className="rounded-lg bg-gray-50 p-3">Arrears {inr(totals.arrear)}</div>
          <div className="rounded-lg bg-gray-50 p-3">Additional earnings {inr(totals.earn)}</div>
          <div className="rounded-lg bg-gray-50 p-3">Additional deductions {inr(totals.ded)}</div>
          <div className="rounded-lg bg-gray-50 p-3">LWP reversal {inr(totals.lwp)}</div>
          <div className="rounded-lg bg-indigo-50 p-3 font-semibold text-indigo-800">Net obligation {inr(totals.arrear + totals.earn + totals.ded + totals.lwp)}</div>
        </div>
      </Card>
    </div>
  );
}
