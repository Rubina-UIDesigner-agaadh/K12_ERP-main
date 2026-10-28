import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { AlertTriangle, Calculator, Lock, RefreshCw, Search, Upload, Users } from 'lucide-react';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

type EmpStatus = 'Valid' | 'Need Review' | 'Duplicate' | 'Draft';

type RunEmployee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  gross: number;
  deduction: number;
  net: number;
  status: EmpStatus;
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
};

const NAMES = ['Teacher A', 'Teacher B', 'Staff C', 'Meera Iyer', 'Rajesh Kumar', 'Kavita Shah', 'Anil Patel', 'Priya Nair', 'Rohit Desai', 'Sneha Joshi'];

function buildEmployees(): RunEmployee[] {
  return Array.from({ length: 84 }, (_, i) => {
    const name = i < 3 ? NAMES[i] : `${NAMES[i % NAMES.length]} ${i + 1}`;
    const gross = i === 0 ? 42000 : i === 1 ? 48000 : i === 2 ? 30000 : 28000 + (i % 18) * 800;
    const deduction = i === 0 ? 3000 : i === 1 ? 4000 : i === 2 ? 2000 : 1800 + (i % 9) * 120;
    const needReview = i === 11 || i === 27 || i === 44 || i === 70;
    return {
      id: `EMP-${1001 + i}`,
      name,
      department: ['Science', 'Mathematics', 'Administration', 'Sports', 'Languages'][i % 5],
      designation: i % 7 === 0 ? 'Clerk' : i % 3 === 0 ? 'PGT' : 'TGT',
      gross,
      deduction,
      net: gross - deduction,
      status: needReview ? 'Need Review' : 'Valid',
      totalDays: 31,
      payableDays: needReview ? 26 : 28,
      present: needReview ? 20 : 24,
      paidLeave: 2,
      unpaidLeave: needReview ? 3 : 0,
      holidays: 2,
      halfDays: needReview ? 2 : 0,
      overtime: i % 11 === 0 ? 4 : 0,
      lateDed: needReview ? 400 : 0,
      missingAttendance: needReview,
      staffType: i % 7 === 0 ? 'Non-teaching' : 'Teaching',
    };
  });
}

const TABS = [
  { id: 'entry' as const, label: 'Payroll Entry' },
  { id: 'attendance' as const, label: 'Payroll Input & Attendance Review' },
  { id: 'bulk' as const, label: 'Bulk Salary Assignment' },
];

export function PayrollEntry() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('entry');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState('Draft');
  const [month, setMonth] = useState('2026-10');
  const [branch, setBranch] = useState('Main Branch');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [postingDate, setPostingDate] = useState('2026-10-31');
  const [frequency, setFrequency] = useState('Monthly');
  const [department, setDepartment] = useState('all');
  const [designation, setDesignation] = useState('all');
  const [account, setAccount] = useState('BANK-SAL · Salary Bank Account');
  const [employees, setEmployees] = useState<RunEmployee[]>(buildEmployees);
  const [search, setSearch] = useState('');
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

  const filtered = useMemo(() => employees.filter((e) => {
    if (department !== 'all' && e.department !== department) return false;
    if (designation !== 'all' && e.designation !== designation) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${e.name} ${e.id} ${e.department}`.toLowerCase().includes(q)) return false;
    return true;
  }), [employees, department, designation, search]);

  const totals = useMemo(() => ({
    employees: filtered.length,
    gross: filtered.reduce((s, e) => s + e.gross, 0),
    deduction: filtered.reduce((s, e) => s + e.deduction, 0),
    net: filtered.reduce((s, e) => s + e.net, 0),
    valid: filtered.filter((e) => e.status === 'Valid').length,
    review: filtered.filter((e) => e.status === 'Need Review').length,
  }), [filtered]);

  const getEmployees = () => {
    const incoming = buildEmployees();
    const have = new Set(employees.map((e) => e.id));
    let skipped = 0;
    const merged = [...employees];
    incoming.forEach((row) => {
      if (have.has(row.id)) skipped += 1;
      else merged.push({ ...row, status: 'Draft' });
    });
    setEmployees(merged);
    flash(skipped ? `Employees loaded. ${skipped} already in this run were skipped to prevent duplicate processing.` : `Loaded ${incoming.length} employees for October 2026.`);
  };

  const validateAttendance = () => {
    setEmployees((prev) => prev.map((e) => (e.missingAttendance || e.unpaidLeave > 2 ? { ...e, status: 'Need Review' as const } : { ...e, status: 'Valid' as const })));
    flash('Attendance validated. School holidays were not deducted unless the staff contract requires it.');
  };

  const calculate = () => {
    setEmployees((prev) => prev.map((e) => ({ ...e, net: e.gross - e.deduction - e.lateDed, status: e.missingAttendance ? 'Need Review' : 'Valid' })));
    setStatus('Calculated');
    flash('Payroll calculated. Teachers and non-teaching staff use their own holiday rules.');
  };

  const generateSlips = () => {
    if (employees.some((e) => e.status === 'Need Review')) {
      flash('Resolve Need Review exceptions before generating slips, or rerun those employees only.');
      return;
    }
    setStatus('Draft slips');
    flash('Draft salary slips generated from this run. Slips will not recalculate independently.');
  };

  const submit = () => {
    setStatus('Submitted');
    flash('Payroll submitted for approval.');
  };

  const bankEntry = () => {
    if (status !== 'Submitted' && status !== 'Bank entry') {
      flash('Submit payroll before making a bank entry.');
      return;
    }
    setStatus('Bank entry');
    flash('Bank payment entry created against the payroll payable account.');
  };

  const bulkConflicts = bulkSelected.map((id) => {
    const emp = employees.find((e) => e.id === id);
    return { id, name: emp?.name || id, existing: 'Teaching Grade A 2026 (from 01-04-2026)', conflict: emp?.status === 'Need Review' };
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Entry</h1>
          <p className="text-sm text-gray-500">October 2026 · {branch} · Generate monthly payroll for a group of employees</p>
        </div>
        <Badge variant={status === 'Submitted' || status === 'Bank entry' ? 'success' : 'warning'}>{status}</Badge>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex gap-1 border-b border-gray-200 bg-white">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'entry' && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Employees', value: String(totals.employees) },
              { label: 'Gross Salary', value: inr(totals.gross) },
              { label: 'Deductions', value: inr(totals.deduction) },
              { label: 'Net Payable', value: inr(totals.net) },
            ].map((kpi) => (
              <Card key={kpi.label} className="p-4">
                <p className="text-xs font-semibold uppercase text-gray-600">{kpi.label}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{kpi.value}</p>
              </Card>
            ))}
          </div>

          <Card>
            <div className="grid gap-4 p-5 md:grid-cols-3 xl:grid-cols-4">
              <Input label="Payroll run ID" value="PE-2026-10" readOnly />
              <Select label="School / branch" options={['Main Branch', 'City Campus', 'North Campus'].map((v) => ({ value: v, label: v }))} value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} />
              <Input label="Payroll month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <Input label="Posting date" type="date" value={postingDate} onChange={(e) => setPostingDate(e.target.value)} />
              <Select label="Payroll frequency" options={['Monthly', 'Fortnightly'].map((v) => ({ value: v, label: v }))} value={frequency} onChange={(e) => setFrequency(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Department" options={[{ value: 'all', label: 'All departments' }, ...['Science', 'Mathematics', 'Administration', 'Sports', 'Languages'].map((v) => ({ value: v, label: v }))]} value={department} onChange={(e) => setDepartment(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Designation" options={[{ value: 'all', label: 'All designations' }, ...['PGT', 'TGT', 'Clerk'].map((v) => ({ value: v, label: v }))]} value={designation} onChange={(e) => setDesignation(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Payment account" options={['BANK-SAL · Salary Bank Account', 'SAL-PAYABLE · Salary Payable'].map((v) => ({ value: v, label: v }))} value={account} onChange={(e) => setAccount(typeof e === 'string' ? e : e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-gray-200 px-5 py-3">
              <Button variant="outline" size="sm" onClick={getEmployees}><Users className="w-4 h-4 mr-1" />Get Employees</Button>
              <Button variant="outline" size="sm" onClick={validateAttendance}>Validate Attendance</Button>
              <Button variant="outline" size="sm" onClick={calculate}><Calculator className="w-4 h-4 mr-1" />Calculate Payroll</Button>
              <Button variant="outline" size="sm" onClick={generateSlips}>Generate Draft Salary Slips</Button>
              <Button size="sm" onClick={submit}>Submit</Button>
              <Button variant="outline" size="sm" onClick={bankEntry}>Make Bank Entry</Button>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">{totals.valid} Valid</Badge>
            <Badge variant="warning">{totals.review} Need Review</Badge>
          </div>

          <Card>
            <div className="flex items-center gap-3 p-5 pb-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <p className="px-5 pt-3 text-xs text-gray-500">Illustrative data. Duplicate employees for the same period are blocked.</p>
            <div className="overflow-x-auto p-5 pt-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    {['Employee', 'Dept', 'Gross', 'Ded.', 'Net', 'Status'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 24).map((e, i) => (
                    <tr key={e.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                      <td className="py-3 px-4"><p className="text-sm font-semibold text-gray-900">{e.name}</p><p className="text-xs text-gray-500">{e.id}</p></td>
                      <td className="py-3 px-4 text-sm">{e.department}</td>
                      <td className="py-3 px-4 text-sm">{inr(e.gross)}</td>
                      <td className="py-3 px-4 text-sm">{inr(e.deduction)}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{inr(e.net)}</td>
                      <td className="py-3 px-4">
                        <button type="button" onClick={() => e.status !== 'Valid' ? setException(e) : undefined}>
                          <Badge variant={e.status === 'Valid' ? 'success' : 'warning'}>{e.status}</Badge>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length > 24 && <p className="pt-2 text-xs text-gray-500">Showing 24 of {filtered.length} employees.</p>}
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
                <Button size="sm" variant="outline" disabled={inputsLocked} onClick={() => flash('Attendance synced from HR attendance for this month.')}><RefreshCw className="w-4 h-4 mr-1" />Sync Attendance</Button>
                <Button size="sm" variant="outline" disabled={inputsLocked} onClick={validateAttendance}>Validate</Button>
                <Button size="sm" variant="outline" onClick={() => { const first = employees.find((e) => e.status === 'Need Review'); if (first) setException(first); else flash('No exceptions.'); }}>Review Exceptions</Button>
                <Button size="sm" variant="outline" disabled={inputsLocked} onClick={() => flash('Attendance inputs approved for calculation.')}>Approve Inputs</Button>
                <Button size="sm" onClick={() => { setInputsLocked(true); flash('Inputs locked. Unlock only for a controlled rerun.'); }}><Lock className="w-4 h-4 mr-1" />Lock Inputs</Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    {['Staff', 'Type', 'Total days', 'Payable working days', 'Present', 'Paid leave', 'Unpaid leave', 'Holidays', 'Half-days', 'OT hrs', 'Late ded.', 'Missing'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 20).map((e, i) => (
                    <tr key={e.id} className={`border-b border-gray-100 hover:bg-gray-50 ${e.missingAttendance ? 'bg-amber-50/60' : i % 2 ? 'bg-gray-50/30' : ''}`}>
                      <td className="py-3 px-4"><p className="text-sm font-semibold">{e.name}</p><p className="text-xs text-gray-500">{e.id}</p></td>
                      <td className="py-3 px-4 text-sm">{e.staffType}</td>
                      <td className="py-3 px-4 text-sm">{e.totalDays}</td>
                      <td className="py-3 px-4 text-sm">{e.payableDays}</td>
                      <td className="py-3 px-4 text-sm">{e.present}</td>
                      <td className="py-3 px-4 text-sm">{e.paidLeave}</td>
                      <td className="py-3 px-4 text-sm">{e.unpaidLeave}</td>
                      <td className="py-3 px-4 text-sm">{e.holidays}</td>
                      <td className="py-3 px-4 text-sm">{e.halfDays}</td>
                      <td className="py-3 px-4 text-sm">{e.overtime}</td>
                      <td className="py-3 px-4 text-sm">{inr(e.lateDed)}</td>
                      <td className="py-3 px-4 text-sm">{e.missingAttendance ? 'Yes' : 'No'}</td>
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
              <Select label="School / branch" options={['Main Branch', 'City Campus', 'North Campus'].map((v) => ({ value: v, label: v }))} value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Department" options={[{ value: 'all', label: 'All' }, ...['Science', 'Mathematics', 'Administration'].map((v) => ({ value: v, label: v }))]} value={department} onChange={(e) => setDepartment(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Designation" options={[{ value: 'all', label: 'All' }, ...['PGT', 'TGT', 'Clerk'].map((v) => ({ value: v, label: v }))]} value={designation} onChange={(e) => setDesignation(typeof e === 'string' ? e : e.target.value)} />
              <Select label="Salary structure" options={['Teaching Grade A 2026', 'Teaching Grade B 2026', 'Non-Teaching Grade C'].map((v) => ({ value: v, label: v }))} value={bulkStructure} onChange={(e) => setBulkStructure(typeof e === 'string' ? e : e.target.value)} />
              <Input label="Effective date" type="date" value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} />
              <Input label="Base salary / proposed revision" value={bulkBase} onChange={(e) => setBulkBase(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-gray-200 px-5 py-3">
              <Button size="sm" variant="outline" onClick={() => setBulkSelected(filtered.slice(0, 12).map((e) => e.id))}>Select Employees</Button>
              <Button size="sm" variant="outline" onClick={() => flash('CSV imported. Validate before committing.')}><Upload className="w-4 h-4 mr-1" />Import CSV</Button>
              <Button size="sm" variant="outline" onClick={() => flash(`${bulkConflicts.filter((c) => c.conflict).length} employee-specific error(s). Existing assignments listed below.`)}>Validate</Button>
              <Button size="sm" variant="outline" onClick={() => setBulkPreview(true)}>Preview Changes</Button>
              <Button size="sm" onClick={() => {
                if (bulkConflicts.some((c) => c.conflict)) {
                  flash('Resolve conflicts and employee-specific errors before bulk assign.');
                  return;
                }
                flash(`Bulk assigned ${bulkSelected.length} staff. Previous assignments were superseded, not overwritten.`);
              }}>Bulk Assign</Button>
            </div>
          </Card>
          <Card title="Selected employees & validation">
            <div className="overflow-x-auto p-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    {['Select', 'Employee', 'Existing assignment', 'Proposed', 'Validation'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 12).map((e, i) => {
                    const on = bulkSelected.includes(e.id);
                    const conflict = e.status === 'Need Review';
                    return (
                      <tr key={e.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                        <td className="py-3 px-4"><input type="checkbox" checked={on} onChange={() => setBulkSelected((s) => on ? s.filter((id) => id !== e.id) : [...s, e.id])} /></td>
                        <td className="py-3 px-4 text-sm">{e.name}<p className="text-xs text-gray-500">{e.id} · {e.designation}</p></td>
                        <td className="py-3 px-4 text-xs">Teaching Grade A 2026 (from 01-04-2026)</td>
                        <td className="py-3 px-4 text-xs">{bulkStructure} · {inr(Number(bulkBase) || 0)} from {bulkDate}</td>
                        <td className="py-3 px-4">{conflict ? <Badge variant="warning">Error — attendance exception</Badge> : <Badge variant="success">Ready</Badge>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Modal isOpen={Boolean(exception)} onClose={() => setException(null)} title="Exception / controlled rerun" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setException(null)}>Close</Button><Button onClick={() => { if (exception) setEmployees((prev) => prev.map((e) => e.id === exception.id ? { ...e, status: 'Valid', missingAttendance: false } : e)); setException(null); flash('Exception cleared for a controlled rerun of this employee.'); }}>Rerun employee</Button></div>}>
        {exception && (
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-amber-600" />{exception.name} · {exception.id}</p>
            <p>Missing attendance: {exception.missingAttendance ? 'Yes' : 'No'}</p>
            <p>Unpaid leave: {exception.unpaidLeave} · Half-days: {exception.halfDays}</p>
            <p className="text-xs text-gray-500">This employee will not be processed twice for this period. Clear the exception to rerun only this row.</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={bulkPreview} onClose={() => setBulkPreview(false)} title="Preview bulk changes" size="lg">
        <p className="mb-3 text-xs text-gray-500">Conflicts and existing assignments are shown before commit.</p>
        <ul className="space-y-2 text-sm">
          {bulkConflicts.map((c) => (
            <li key={c.id} className="rounded-lg border border-gray-200 px-3 py-2">
              <b>{c.name}</b> · existing {c.existing} → {bulkStructure} {inr(Number(bulkBase) || 0)}
              {c.conflict && <span className="ml-2 text-amber-700">blocked</span>}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default PayrollEntry;
