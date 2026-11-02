import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { AlertTriangle, Lock, RefreshCw, Search, Upload, Users } from 'lucide-react';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type EmpStatus = 'Valid' | 'Need Review' | 'Duplicate' | 'Draft';
type RunStatus = 'Draft' | 'Salary Slips Created' | 'Submitted' | 'Bank Entry Created';
type Tab = 'entry' | 'attendance' | 'bulk';

type RunEmployee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  structure: string;
  base: number;
  gross: number;
  deduction: number;
  net: number;
  status: EmpStatus;
  selected: boolean;
  totalDays: number;
  payableDays: number;
  present: number;
  paidLeave: number;
  unpaidLeave: number;
  holidays: number;
  halfDays: number;
  overtime: number;
  lateDed: number;
  missingAttendance: boolean;
  staffType: 'Teaching' | 'Non-teaching';
  excluded?: string;
};

const NAMES = ['Teacher A', 'Teacher B', 'Staff C', 'Meera Iyer', 'Rajesh Kumar', 'Kavita Shah', 'Anil Patel', 'Priya Nair', 'Rohit Desai', 'Sneha Joshi'];
const STEPS = ['Configure', 'Get Employees', 'Create Slips', 'Submit & Accrue', 'Bank Entry'];

function buildEmployees(): RunEmployee[] {
  return Array.from({ length: 48 }, (_, i) => {
    const name = i < 3 ? NAMES[i] : `${NAMES[i % NAMES.length]} ${i + 1}`;
    const gross = i === 0 ? 42000 : i === 1 ? 48000 : i === 2 ? 30000 : 28000 + (i % 18) * 800;
    const deduction = i === 0 ? 3000 : i === 1 ? 4000 : i === 2 ? 2000 : 1800 + (i % 9) * 120;
    const needReview = i === 11 || i === 27 || i === 44;
    const excluded = i === 5 ? 'No Assignment' : i === 17 ? 'Slip Exists' : i === 33 ? 'Inactive' : undefined;
    return {
      id: `EMP-${1001 + i}`,
      name,
      department: ['Science', 'Arts', 'Administration', 'Sports', 'Languages'][i % 5],
      designation: i % 7 === 0 ? 'Clerk' : i % 3 === 0 ? 'PGT' : 'TGT',
      structure: i % 7 === 0 ? 'Non-Teaching Grade C' : 'Teaching Grade A 2026',
      base: gross,
      gross,
      deduction,
      net: gross - deduction,
      status: needReview ? 'Need Review' : 'Valid',
      selected: !excluded,
      totalDays: 31,
      payableDays: needReview ? 26 : 28,
      present: needReview ? 20 : 24,
      paidLeave: 2,
      unpaidLeave: needReview ? 3 : 0,
      holidays: 4,
      halfDays: needReview ? 2 : 0,
      overtime: i % 11 === 0 ? 4 : 0,
      lateDed: needReview ? 400 : 0,
      missingAttendance: needReview,
      staffType: i % 7 === 0 ? 'Non-teaching' : 'Teaching',
      excluded
    };
  });
}

export function PayrollEntry() {
  const [tab, setTab] = useState<Tab>('entry');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<RunStatus>('Draft');
  const [step, setStep] = useState(0);
  const [company] = useState('EduManager School');
  const [frequency, setFrequency] = useState('Monthly');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [period, setPeriod] = useState('FY 2026-27 · Oct 2026');
  const [account, setAccount] = useState('SBI — ****5678');
  const [costCenter, setCostCenter] = useState('');
  const [project, setProject] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>(['Science', 'Arts']);
  const [designations, setDesignations] = useState<string[]>(['PGT', 'TGT']);
  const [grade, setGrade] = useState('');
  const [employees, setEmployees] = useState<RunEmployee[]>([]);
  const [fetched, setFetched] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [search, setSearch] = useState('');
  const [overwrite, setOverwrite] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(0);
  const [failed, setFailed] = useState<{ id: string; name: string; error: string }[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inputsLocked, setInputsLocked] = useState(false);
  const [exception, setException] = useState<RunEmployee | null>(null);
  const [bulkSelected, setBulkSelected] = useState<string[]>(['EMP-1001', 'EMP-1002']);
  const [bulkStructure, setBulkStructure] = useState('Teaching Grade A 2026');
  const [bulkDate, setBulkDate] = useState('2026-11-01');
  const [bulkBase, setBulkBase] = useState('42000');
  const [bulkPreview, setBulkPreview] = useState(false);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const included = employees.filter((e) => !e.excluded);
  const excluded = employees.filter((e) => e.excluded);
  const selected = included.filter((e) => e.selected);
  const filtered = useMemo(() => included.filter((e) => {
    const q = search.trim().toLowerCase();
    if (q && !`${e.name} ${e.id} ${e.department}`.toLowerCase().includes(q)) return false;
    return true;
  }), [included, search]);

  const totals = useMemo(() => ({
    employees: selected.length,
    gross: selected.reduce((s, e) => s + e.gross, 0),
    deduction: selected.reduce((s, e) => s + e.deduction, 0),
    net: selected.reduce((s, e) => s + e.net, 0),
    lwp: selected.reduce((s, e) => s + e.unpaidLeave, 0)
  }), [selected]);

  const fillCurrentMonth = () => {
    setStartDate('2026-10-01');
    setEndDate('2026-10-31');
    setPeriod('FY 2026-27 · Oct 2026');
    flash('Filled current month.');
  };

  const getEmployees = () => {
    const rows = buildEmployees();
    setEmployees(rows);
    setFetched(true);
    setStep(1);
    flash(`Employees Loaded — ${rows.filter((r) => !r.excluded).length} fetched, ${rows.filter((r) => r.excluded).length} excluded`);
  };

  const patchLwp = (id: string, unpaidLeave: number) => {
    setEmployees((prev) => prev.map((e) => {
      if (e.id !== id) return e;
      const net = e.gross - e.deduction - unpaidLeave * Math.round(e.base / 26);
      return { ...e, unpaidLeave, payableDays: e.totalDays - unpaidLeave - 2, net };
    }));
  };

  const createSlips = () => {
    if (!selected.length) return;
    setCreating(true);
    window.setTimeout(() => {
      const fail = selected.filter((e) => e.status === 'Need Review').slice(0, 2).map((e) => ({ id: e.id, name: e.name, error: 'Missing formula for HRA component' }));
      setFailed(fail);
      setCreated(selected.length - fail.length);
      setCreating(false);
      setStatus('Salary Slips Created');
      setStep(2);
      flash(`Salary Slips Created — ${selected.length - fail.length} slips in draft, ${fail.length} failed`);
    }, 800);
  };

  const submit = () => {
    setStatus('Submitted');
    setStep(3);
    setConfirmOpen(false);
    flash('Payroll Submitted — slips submitted. Accrual JE JV-2026-10-001 created.');
  };

  const bankEntry = () => {
    if (status !== 'Submitted' && status !== 'Bank Entry Created') {
      flash('Submit payroll before making a bank entry.');
      return;
    }
    setStatus('Bank Entry Created');
    setStep(4);
    flash('Bank Entry Created — Bank Entry BE-2026-10-001 ready for processing.');
  };

  const statusBadge = status === 'Submitted' || status === 'Bank Entry Created' ? 'success' : status === 'Salary Slips Created' ? 'warning' : 'secondary';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Payroll Entry</h1>
            <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[11px] font-semibold text-gray-500">PAYROLL-10-2026-001</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Process monthly payroll for your school staff</p>
        </div>
        <Badge variant={statusBadge}>{status}</Badge>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex gap-1 border-b border-gray-200 bg-white">
        {[
          { id: 'entry' as const, label: 'Payroll Entry' },
          { id: 'attendance' as const, label: 'Payroll Input & Attendance Review' },
          { id: 'bulk' as const, label: 'Bulk Salary Assignment' }
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'entry' && (
        <>
          <div className="grid grid-cols-5 gap-2 rounded-xl border border-gray-200 bg-white p-4" role="navigation" aria-label="Payroll process steps">
            {STEPS.map((label, i) => (
              <div key={label} className="text-center">
                <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <p className={`mt-1 text-xs ${i === step ? 'font-semibold text-indigo-700' : 'text-gray-500'}`}>{label}</p>
              </div>
            ))}
          </div>

          <Card title="Payroll Configuration">
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <Input label="Company *" value={company} readOnly />
              <Select label="Payroll Frequency *" value={frequency} onChange={(e) => setFrequency(typeof e === 'string' ? e : e.target.value)} options={['Monthly', 'Bi-Weekly', 'Weekly', 'Daily'].map((v) => ({ value: v, label: v }))} />
              <Input label="Currency" value="INR — ₹ Indian Rupee" readOnly />
              <Input label="Start Date *" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <div>
                <Button variant="outline" size="sm" className="mb-1" onClick={fillCurrentMonth}>Fill Current Month</Button>
                <Input label="End Date *" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Input label="Payroll Period" value={period} readOnly />
              <Select label="Payment Account (Bank) *" value={account} onChange={(e) => setAccount(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'SBI — ****5678', label: 'SBI — ****5678' }, { value: 'HDFC — ****1234', label: 'HDFC — ****1234' }]} />
              <Select label="Cost Center" value={costCenter} onChange={(e) => setCostCenter(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'Optional' }, { value: 'Academic', label: 'Academic' }, { value: 'Admin', label: 'Admin' }]} />
              <Select label="Project" value={project} onChange={(e) => setProject(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'Optional' }, { value: 'Board Exams', label: 'Board Exams' }]} />
            </div>
            <div className="grid gap-4 border-t px-5 py-4 md:grid-cols-4">
              <MultiSelect label="Branch" options={[{ value: 'Main', label: 'Main Branch' }, { value: 'City', label: 'City Campus' }]} value={branches} onChange={setBranches} placeholder="All branches" />
              <MultiSelect label="Department" options={['Science', 'Arts', 'Administration', 'Sports', 'Languages'].map((v) => ({ value: v, label: v }))} value={departments} onChange={setDepartments} placeholder="All departments" />
              <MultiSelect label="Designation" options={['PGT', 'TGT', 'Clerk'].map((v) => ({ value: v, label: v }))} value={designations} onChange={setDesignations} placeholder="All designations" />
              <Select label="Employee Grade" value={grade} onChange={(e) => setGrade(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All grades' }, { value: 'A', label: 'Grade A' }, { value: 'B', label: 'Grade B' }]} />
            </div>
            <div className="flex items-center justify-between border-t bg-gray-50 px-5 py-2 text-xs text-gray-500">
              <span>Filters: Department = {departments.join(', ') || 'All'} · Designation = {designations.join(', ') || 'All'} · <b className="text-indigo-700">{fetched ? included.length : 48} employees estimated</b></span>
              <button type="button" className="text-red-500" onClick={() => { setBranches([]); setDepartments([]); setDesignations([]); setGrade(''); }}>Clear</button>
            </div>
          </Card>

          <Card title="Employee Selection">
            <div className="space-y-3 p-5 text-center">
              <Button onClick={getEmployees}><Users className="mr-2 h-4 w-4" />Get Employees</Button>
              <p className="text-sm text-gray-500">System will fetch all active employees matching your filters with valid salary structure assignments</p>
            </div>
            {fetched && excluded.length > 0 && (
              <div className="mx-5 mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
                <div className="flex justify-between">
                  <p className="font-semibold text-amber-800">{excluded.length} employees excluded</p>
                  <button type="button" className="text-sm text-amber-700" onClick={() => setShowExcluded((v) => !v)}>{showExcluded ? 'Hide' : 'Show'} Details</button>
                </div>
                {showExcluded && excluded.map((e) => (
                  <p key={e.id} className="mt-1 text-sm text-slate-700">{e.name} ({e.id}) <Badge variant="danger">{e.excluded}</Badge></p>
                ))}
              </div>
            )}
          </Card>

          {fetched && (
            <Card title="Employee Details">
              <div className="flex items-center gap-3 p-5 pb-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
                </div>
                <Button variant="outline" size="sm" onClick={getEmployees} title="Re-fetch attendance data"><RefreshCw className="h-4 w-4" /></Button>
              </div>
              <div className="overflow-x-auto p-5 pt-3">
                <table className="w-full text-sm" role="grid">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-[11px] uppercase text-gray-500">
                      {['', 'Employee', 'Department', 'Designation', 'Salary Structure', 'Base', 'Working days', 'LWP days', 'Net pay'].map((h) => <th key={h || 'c'} className="px-3 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className={`border-b border-gray-100 hover:bg-indigo-50 ${e.selected ? '' : 'opacity-40'}`}>
                        <td className="px-3 py-2"><input type="checkbox" checked={e.selected} onChange={(ev) => setEmployees((p) => p.map((r) => r.id === e.id ? { ...r, selected: ev.target.checked } : r))} /></td>
                        <td className={`px-3 py-2 ${e.selected ? '' : 'line-through'}`}><p className="font-medium">{e.name}</p><p className="text-xs text-gray-500">{e.id}</p></td>
                        <td className="px-3 py-2">{e.department}</td>
                        <td className="px-3 py-2"><Badge variant="secondary">{e.designation}</Badge></td>
                        <td className="px-3 py-2 text-xs">{e.structure}</td>
                        <td className="px-3 py-2 text-right">{inr(e.base)}</td>
                        <td className="px-3 py-2 text-center">{e.payableDays}</td>
                        <td className="px-3 py-2 text-center">
                          <input type="number" min={0} className={`w-16 rounded border px-1 py-1 text-center ${e.unpaidLeave > 0 ? 'border-amber-300 bg-amber-50 font-semibold text-red-600' : 'border-transparent'}`} value={e.unpaidLeave} onChange={(ev) => patchLwp(e.id, Number(ev.target.value))} title="Auto-fetched from attendance. Override manually if needed." />
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">{inr(e.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-indigo-50 font-semibold text-indigo-800">
                      <td className="px-3 py-2" colSpan={2}>Selected: {totals.employees}/{included.length}</td>
                      <td colSpan={4}>Total Gross: {inr(totals.gross)}</td>
                      <td className="text-center">LWP: {totals.lwp}</td>
                      <td colSpan={2} className="text-right">Total Net: {inr(totals.net)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          )}

          <Card title="Create Salary Slips">
            <div className="space-y-3 p-5">
              <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} /> <span>Overwrite Salary Structure Amount<br /><span className="text-xs italic text-gray-400">If checked, base amounts from the Payroll Entry will override those in the Salary Structure Assignment</span></span></label>
              <Button disabled={!selected.length || creating} onClick={createSlips}>Create Salary Slips</Button>
              {creating && <p className="text-sm text-gray-500">Creating slips…</p>}
              {status !== 'Draft' && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <span>{created} salary slips created successfully</span>
                  {failed.length > 0 && <span className="text-red-600">{failed.length} failed</span>}
                </div>
              )}
              {failed.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
                  {failed.map((f) => <p key={f.id}><b>{f.name}</b> ({f.id}) — <span className="text-red-600">{f.error}</span></p>)}
                </div>
              )}
            </div>
          </Card>

          {status !== 'Draft' && (
            <Card title="Salary Slip Status">
              <div className="overflow-x-auto p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      {['Employee', 'Gross', 'Deductions', 'Net', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.slice(0, 12).map((e) => (
                      <tr key={e.id} className="border-b border-gray-100 hover:bg-indigo-50">
                        <td className="px-3 py-2">{e.name}<p className="text-xs text-gray-500">{e.id}</p></td>
                        <td className="px-3 py-2 text-right">{inr(e.gross)}</td>
                        <td className="px-3 py-2 text-right text-red-600">{inr(e.deduction)}</td>
                        <td className="px-3 py-2 text-right font-semibold">{inr(e.net)}</td>
                        <td className="px-3 py-2"><Badge variant={status === 'Submitted' || status === 'Bank Entry Created' ? 'success' : 'warning'}>{status === 'Draft' ? 'Draft' : status === 'Salary Slips Created' ? 'Draft' : 'Submitted'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card title="Submit Salary Slips & Accrue">
            <div className="flex flex-wrap gap-2 p-5">
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>Preview Salary Slips</Button>
              <Button onClick={() => setConfirmOpen(true)} disabled={status === 'Draft'}>Submit Salary Slips</Button>
              {(status === 'Submitted' || status === 'Bank Entry Created') && (
                <>
                  <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Salary slips submitted successfully. Accrual Journal Entry JV-2026-10-001 created.</div>
                  <Button onClick={bankEntry}>Make Bank Entry</Button>
                  <Button variant="outline">View Accrual Entry</Button>
                </>
              )}
            </div>
          </Card>
        </>
      )}

      {tab === 'attendance' && (
        <>
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 p-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Payroll month October 2026</h2>
                <p className="mt-1 text-sm text-gray-500">Do not deduct salary for a school holiday unless the staff contract and payroll policy require it. Teaching and non-teaching staff may follow different rules.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={inputsLocked} onClick={() => flash('Attendance synced from HR attendance for this month.')}><RefreshCw className="mr-1 h-4 w-4" />Sync Attendance</Button>
                <Button size="sm" variant="outline" disabled={inputsLocked} onClick={() => flash('Attendance validated.')}>Validate</Button>
                <Button size="sm" variant="outline" onClick={() => { const first = included.find((e) => e.status === 'Need Review'); if (first) setException(first); else flash('No exceptions.'); }}>Review Exceptions</Button>
                <Button size="sm" onClick={() => { setInputsLocked(true); flash('Inputs locked.'); }}><Lock className="mr-1 h-4 w-4" />Lock Inputs</Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    {['Staff', 'Type', 'Total days', 'Payable', 'Present', 'Paid leave', 'Unpaid leave', 'Holidays', 'Half-days', 'OT hrs', 'Late ded.', 'Missing'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(fetched ? filtered : buildEmployees().filter((e) => !e.excluded)).slice(0, 20).map((e) => (
                    <tr key={e.id} className={`border-b border-gray-100 ${e.missingAttendance ? 'bg-amber-50/60' : ''}`}>
                      <td className="px-4 py-3 text-sm"><p className="font-semibold">{e.name}</p><p className="text-xs text-gray-500">{e.id}</p></td>
                      <td className="px-4 py-3 text-sm">{e.staffType}</td>
                      <td className="px-4 py-3 text-sm">{e.totalDays}</td>
                      <td className="px-4 py-3 text-sm">{e.payableDays}</td>
                      <td className="px-4 py-3 text-sm">{e.present}</td>
                      <td className="px-4 py-3 text-sm">{e.paidLeave}</td>
                      <td className="px-4 py-3 text-sm">{e.unpaidLeave}</td>
                      <td className="px-4 py-3 text-sm">{e.holidays}</td>
                      <td className="px-4 py-3 text-sm">{e.halfDays}</td>
                      <td className="px-4 py-3 text-sm">{e.overtime}</td>
                      <td className="px-4 py-3 text-sm">{inr(e.lateDed)}</td>
                      <td className="px-4 py-3 text-sm">{e.missingAttendance ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'bulk' && (
        <>
          <Card title="Bulk salary assignment">
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <Select label="Salary structure" options={['Teaching Grade A 2026', 'Teaching Grade B 2026', 'Non-Teaching Grade C'].map((v) => ({ value: v, label: v }))} value={bulkStructure} onChange={(e) => setBulkStructure(typeof e === 'string' ? e : e.target.value)} />
              <Input label="Effective date" type="date" value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} />
              <Input label="Base salary / proposed revision" value={bulkBase} onChange={(e) => setBulkBase(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 border-t px-5 py-3">
              <Button size="sm" variant="outline" onClick={() => setBulkSelected(filtered.slice(0, 12).map((e) => e.id))}>Select Employees</Button>
              <Button size="sm" variant="outline" onClick={() => flash('CSV imported.')}><Upload className="mr-1 h-4 w-4" />Import CSV</Button>
              <Button size="sm" variant="outline" onClick={() => setBulkPreview(true)}>Preview Changes</Button>
              <Button size="sm" onClick={() => flash(`Bulk assigned ${bulkSelected.length} staff. Previous assignments were superseded, not overwritten.`)}>Bulk Assign</Button>
            </div>
          </Card>
        </>
      )}

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Salary Slip Preview — October 2026" size="xl" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button><Button onClick={() => setPreviewOpen(false)}>Looks Good</Button></div>}>
        <div className="grid grid-cols-4 gap-3 text-sm">
          <div>Employees<br /><b>{totals.employees}</b></div>
          <div>Total Gross<br /><b>{inr(totals.gross)}</b></div>
          <div>Total Deductions<br /><b>{inr(totals.deduction)}</b></div>
          <div>Total Net<br /><b>{inr(totals.net)}</b></div>
        </div>
      </Modal>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Submission" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button variant="danger" onClick={submit}>Submit All Slips</Button></div>}>
        <p className="text-sm text-gray-600">You are about to submit {totals.employees} salary slips for October 2026. This action cannot be undone. An accrual journal entry will be created automatically.</p>
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">Never submit salary slips individually. Always use this bulk button to ensure the accrual journal entry is created correctly.</p>
      </Modal>

      <Modal isOpen={Boolean(exception)} onClose={() => setException(null)} title="Exception / controlled rerun" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setException(null)}>Close</Button><Button onClick={() => { if (exception) setEmployees((prev) => prev.map((e) => e.id === exception.id ? { ...e, status: 'Valid', missingAttendance: false } : e)); setException(null); flash('Exception cleared.'); }}>Rerun employee</Button></div>}>
        {exception && <p className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-amber-600" />{exception.name} · unpaid leave {exception.unpaidLeave}</p>}
      </Modal>

      <Modal isOpen={bulkPreview} onClose={() => setBulkPreview(false)} title="Preview bulk changes" size="lg">
        <ul className="space-y-2 text-sm">{bulkSelected.map((id) => <li key={id} className="rounded border px-3 py-2">{id} → {bulkStructure} {inr(Number(bulkBase) || 0)}</li>)}</ul>
      </Modal>
    </div>
  );
}

export default PayrollEntry;
