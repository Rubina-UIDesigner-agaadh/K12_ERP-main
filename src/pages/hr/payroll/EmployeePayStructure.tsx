import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Plus, Search } from 'lucide-react';

const STORE = 'k12-salary-assignments-v1';
type Tab = 'individual' | 'bulk';
type DocStatus = 'Draft' | 'Submitted' | 'Cancelled';
type Assignment = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  branch: string;
  grade: string;
  structure: string;
  frequency: string;
  category: string;
  effectiveFrom: string;
  baseSalary: number;
  variableAmount: number;
  taxSlab: string;
  taxRegime: 'Old' | 'New';
  payrollAccount: string;
  status: DocStatus;
  assignmentStatus: 'Active' | 'Ended';
};

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', branch: 'Main Branch', grade: 'A', net: 72000 },
  { id: 'EMP-1088', name: 'Rajesh Kumar', department: 'Mathematics', designation: 'TGT Maths', branch: 'Main Branch', grade: 'B', net: 58000 },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', designation: 'Office Superintendent', branch: 'City Campus', grade: 'C', net: 42000 },
  { id: 'EMP-1120', name: 'Anil Patel', department: 'Sports', designation: 'PET', branch: 'North Campus', grade: 'B', net: 36000 },
  { id: 'EMP-1144', name: 'Priya Nair', department: 'Languages', designation: 'PGT English', branch: 'Main Branch', grade: 'A', net: 64000 }
];
const STRUCTURES = [
  { name: 'Teaching Staff - Permanent', frequency: 'Monthly', category: 'Teaching' },
  { name: 'Teaching Grade B 2026', frequency: 'Monthly', category: 'Teaching' },
  { name: 'Non-Teaching Grade C', frequency: 'Monthly', category: 'Non-Teaching' },
  { name: 'Support Staff Grade D', frequency: 'Monthly', category: 'Contractual' }
];
const EARNINGS = [
  { name: 'Basic Pay', formula: 'Fixed', abbr: 'BASIC' },
  { name: 'DA', formula: 'basic * 0.45', abbr: 'DA' },
  { name: 'HRA', formula: 'basic * 0.40', abbr: 'HRA' }
];
const DEDUCTIONS = [
  { name: 'EPF (Employee)', formula: 'min(basic * 0.12, 1800)', abbr: 'EPF' },
  { name: 'Professional Tax', formula: 'Fixed slab', abbr: 'PT' },
  { name: 'Income Tax (TDS)', formula: 'Projected / remaining months', abbr: 'TDS' }
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const today = '2026-11-02';

const SEED: Assignment[] = [
  { id: 'SA-01', employeeId: 'EMP-1042', employeeName: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', branch: 'Main Branch', grade: 'A', structure: 'Teaching Staff - Permanent', frequency: 'Monthly', category: 'Teaching', effectiveFrom: '2026-04-01', baseSalary: 50000, variableAmount: 4000, taxSlab: 'New Regime — FY 2026-27', taxRegime: 'New', payrollAccount: '', status: 'Submitted', assignmentStatus: 'Active' },
  { id: 'SA-00', employeeId: 'EMP-1042', employeeName: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', branch: 'Main Branch', grade: 'A', structure: 'Teaching Grade B 2025', frequency: 'Monthly', category: 'Teaching', effectiveFrom: '2025-04-01', baseSalary: 38000, variableAmount: 2000, taxSlab: 'Old Regime — FY 2025-26', taxRegime: 'Old', payrollAccount: '', status: 'Submitted', assignmentStatus: 'Ended' }
];

const load = (): Assignment[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) as Assignment[] : SEED;
  } catch {
    return SEED;
  }
};

export function EmployeePayStructure() {
  const [tab, setTab] = useState<Tab>('individual');
  const [rows, setRows] = useState<Assignment[]>(load);
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [empQuery, setEmpQuery] = useState('');
  const [empOpen, setEmpOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [backdateOpen, setBackdateOpen] = useState(false);
  const [docStatus, setDocStatus] = useState<DocStatus>('Draft');
  const [form, setForm] = useState({
    employeeId: '',
    structure: '',
    effectiveFrom: '2026-11-01',
    taxSlab: 'New Regime — FY 2026-27',
    taxRegime: 'New' as 'Old' | 'New',
    baseSalary: 0,
    variableAmount: 0,
    payrollAccount: '',
    previousTaxable: 0,
    previousTds: 0,
    form12b: ''
  });

  const [fDept, setFDept] = useState<string[]>([]);
  const [fDesig, setFDesig] = useState<string[]>([]);
  const [fCat, setFCat] = useState('');
  const [fGrade, setFGrade] = useState('');
  const [applied, setApplied] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkStructure, setBulkStructure] = useState(STRUCTURES[0].name);
  const [bulkDate, setBulkDate] = useState('2026-11-01');
  const [bulkBase, setBulkBase] = useState<{ [id: string]: number }>({});
  const [bulkTax, setBulkTax] = useState<{ [id: string]: string }>({});
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkMode, setBulkMode] = useState<'pct' | 'fixed'>('pct');
  const [bulkVal, setBulkVal] = useState('10');
  const [progressOpen, setProgressOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLog, setProgressLog] = useState<{ ok: boolean; text: string }[]>([]);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 5000); };
  const persist = (next: Assignment[]) => { setRows(next); localStorage.setItem(STORE, JSON.stringify(next)); };

  const emp = EMPLOYEES.find((e) => e.id === form.employeeId);
  const structure = STRUCTURES.find((s) => s.name === form.structure);
  const active = rows.find((r) => r.employeeId === form.employeeId && r.assignmentStatus === 'Active');
  const history = rows.filter((r) => r.employeeId === form.employeeId);
  const backdated = form.effectiveFrom && form.effectiveFrom < today;
  const empMatches = EMPLOYEES.filter((e) => `${e.id} ${e.name}`.toLowerCase().includes(empQuery.toLowerCase()));

  const gross = form.baseSalary + Math.round(form.baseSalary * 0.45) + Math.round(form.baseSalary * 0.40) + form.variableAmount;
  const tds = Math.round(form.baseSalary * 0.06);
  const deductions = Math.min(Math.round(form.baseSalary * 0.12), 1800) + 200 + tds;
  const net = Math.max(0, gross - deductions);

  const bulkPool = useMemo(() => {
    if (!applied) return [];
    return EMPLOYEES.filter((e) => {
      if (fDept.length && !fDept.includes(e.department)) return false;
      if (fDesig.length && !fDesig.includes(e.designation.split(' ')[0]) && !fDesig.includes(e.designation)) return false;
      if (fCat === 'Teaching' && !e.designation.match(/PGT|TGT|PET|Principal/)) return false;
      if (fCat === 'Non-Teaching' && e.designation.match(/PGT|TGT|PET/)) return false;
      if (fGrade && e.grade !== fGrade) return false;
      return true;
    });
  }, [applied, fDept, fDesig, fCat, fGrade]);

  const currentOf = (id: string) => rows.find((r) => r.employeeId === id && r.assignmentStatus === 'Active');

  const pickEmp = (e: typeof EMPLOYEES[0]) => {
    setForm((f) => ({ ...f, employeeId: e.id }));
    setEmpQuery(`${e.name} (${e.id})`);
    setEmpOpen(false);
  };

  const doSave = (as: DocStatus, recalc: boolean) => {
    if (!form.employeeId || !form.structure || !form.effectiveFrom || !form.baseSalary) {
      flash('Please fill Employee, Structure, From Date, and Base Amount');
      return;
    }
    const found = EMPLOYEES.find((e) => e.id === form.employeeId);
    if (!found) return;
    const next = rows.map((r) => r.employeeId === form.employeeId && r.assignmentStatus === 'Active'
      ? { ...r, assignmentStatus: 'Ended' as const }
      : r);
    const created: Assignment = {
      id: `SA-${Date.now()}`,
      employeeId: found.id,
      employeeName: found.name,
      department: found.department,
      designation: found.designation,
      branch: found.branch,
      grade: found.grade,
      structure: form.structure,
      frequency: structure?.frequency || 'Monthly',
      category: structure?.category || 'Teaching',
      effectiveFrom: form.effectiveFrom,
      baseSalary: form.baseSalary,
      variableAmount: form.variableAmount,
      taxSlab: form.taxSlab,
      taxRegime: form.taxRegime,
      payrollAccount: form.payrollAccount,
      status: as,
      assignmentStatus: 'Active'
    };
    persist([created, ...next]);
    setDocStatus(as);
    setBackdateOpen(false);
    flash(as === 'Submitted'
      ? `Assignment Submitted — Salary structure assigned to ${found.name} from ${form.effectiveFrom}${recalc ? ' · slips after this date queued for recalculation' : ''}`
      : `Assignment Saved — Salary structure assigned to ${found.name} from ${form.effectiveFrom}`);
  };

  const save = (as: DocStatus) => {
    if (!form.employeeId || !form.structure || !form.effectiveFrom || !form.baseSalary) {
      flash('Please fill Employee, Structure, From Date, and Base Amount');
      return;
    }
    if (active && as === 'Submitted') flash('An active assignment already exists. Submit to supersede it.');
    if (backdated && as === 'Submitted') { setBackdateOpen(true); return; }
    doSave(as, false);
  };

  const runBulk = () => {
    setProgressOpen(true);
    setProgress(0);
    setProgressLog([]);
    const ids = selected.length ? selected : bulkPool.map((e) => e.id);
    ids.forEach((id, i) => {
      window.setTimeout(() => {
        const e = EMPLOYEES.find((x) => x.id === id)!;
        const base = bulkBase[id] || currentOf(id)?.baseSalary || 40000;
        const ok = Boolean(bulkDate);
        setProgressLog((p) => [...p, { ok, text: ok ? `${id} ${e.name} — Assigned (${bulkStructure})` : `${id} ${e.name} — Failed: No From Date` }]);
        setProgress(Math.round(((i + 1) / ids.length) * 100));
        if (ok) {
          const ended = rows.map((r) => r.employeeId === id && r.assignmentStatus === 'Active' ? { ...r, assignmentStatus: 'Ended' as const } : r);
          persist([{
            id: `SA-${Date.now()}-${i}`,
            employeeId: e.id,
            employeeName: e.name,
            department: e.department,
            designation: e.designation,
            branch: e.branch,
            grade: e.grade,
            structure: bulkStructure,
            frequency: 'Monthly',
            category: STRUCTURES.find((s) => s.name === bulkStructure)?.category || 'Teaching',
            effectiveFrom: bulkDate,
            baseSalary: base,
            variableAmount: 0,
            taxSlab: bulkTax[id] || 'New Regime — FY 2026-27',
            taxRegime: 'New',
            payrollAccount: '',
            status: 'Submitted',
            assignmentStatus: 'Active'
          }, ...ended]);
        }
        if (i === ids.length - 1) flash(`Bulk Assignment Complete — ${ids.length} assignments processed`);
      }, 180 * (i + 1));
    });
  };

  const applyBulkBase = () => {
    const next: { [id: string]: number } = { ...bulkBase };
    selected.forEach((id) => {
      const cur = currentOf(id)?.baseSalary || 45000;
      next[id] = bulkMode === 'pct' ? Math.round(cur * (1 + Number(bulkVal) / 100)) : cur + Number(bulkVal);
    });
    setBulkBase(next);
    setBulkModal(false);
    flash('Base amounts updated on selected rows.');
  };

  const filterCount = [fDept.length ? 1 : 0, fDesig.length ? 1 : 0, fCat ? 1 : 0, fGrade ? 1 : 0].reduce((a, b) => a + b, 0);
  const avgBase = selected.length ? Math.round(selected.reduce((s, id) => s + (currentOf(id)?.baseSalary || 45000), 0) / selected.length) : 45000;
  const newAvg = bulkMode === 'pct' ? Math.round(avgBase * (1 + Number(bulkVal || 0) / 100)) : avgBase + Number(bulkVal || 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structure Assignment</h1>
          <p className="mt-1 text-sm text-gray-500">Assign salary structures to employees individually or in bulk</p>
        </div>
        <Button onClick={() => { setTab('individual'); setShowForm(true); setDocStatus('Draft'); }}><Plus className="h-4 w-4" />New Assignment</Button>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800" role="status">{notice}</div>}

      <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-1">
        {[{ id: 'individual' as const, label: 'Individual Assignment' }, { id: 'bulk' as const, label: 'Bulk Assignment Tool' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'individual' && showForm && (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden" noPadding>
            <div className="space-y-8 p-8">
              <div>
                <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-gray-800"><span className="h-5 w-1 rounded bg-indigo-600" />Employee Details</h2>
                <label className="mb-1 block text-sm font-medium text-gray-600">Employee *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={empQuery} onFocus={() => setEmpOpen(true)} onChange={(e) => { setEmpQuery(e.target.value); setEmpOpen(true); }} placeholder="Search by ID or name…" className="h-11 w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  {empOpen && (
                    <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border bg-white shadow">
                      {empMatches.map((e) => (
                        <button key={e.id} type="button" onClick={() => pickEmp(e)} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-indigo-50">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">{e.name.split(' ').map((p) => p[0]).join('')}</span>
                          <span className="flex-1">{e.name}</span>
                          <span className="text-xs text-gray-400">{e.id}</span>
                          <span className="text-xs text-gray-400">{e.department}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {emp && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[{ l: emp.department, k: 'Dept' }, { l: emp.designation, k: 'Desig' }, { l: emp.branch, k: 'Branch' }, { l: `Grade ${emp.grade}`, k: 'Grade' }].map((c) => (
                      <span key={c.k} className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{c.l}</span>
                    ))}
                  </div>
                )}
                {active && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span>Active assignment exists from {active.effectiveFrom}. Creating a new one will end-date the previous.</span>
                    <button type="button" className="font-semibold text-amber-700 hover:underline" onClick={() => setForm((f) => ({ ...f, structure: active.structure, baseSalary: active.baseSalary, variableAmount: active.variableAmount, taxSlab: active.taxSlab }))}>View Current →</button>
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-gray-800"><span className="h-5 w-1 rounded bg-indigo-600" />Structure & Dates</h2>
                <div className="grid gap-5 md:grid-cols-3">
                  <Select label="Salary Structure *" value={form.structure} onChange={(e) => { setForm({ ...form, structure: typeof e === 'string' ? e : e.target.value }); setPreviewOpen(true); }} options={[{ value: '', label: 'Select submitted structure' }, ...STRUCTURES.map((s) => ({ value: s.name, label: `${s.name}` }))]} />
                  <div>
                    <Input label="Effective From *" type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} />
                    {backdated && <p className="mt-1 text-xs italic text-amber-600">Backdated — system will prompt recalculation</p>}
                  </div>
                  <div>
                    <Select label="Income Tax Slab *" value={form.taxSlab} onChange={(e) => {
                      const v = typeof e === 'string' ? e : e.target.value;
                      setForm({ ...form, taxSlab: v, taxRegime: v.startsWith('Old') ? 'Old' : 'New' });
                    }} options={[{ value: 'New Regime — FY 2026-27', label: 'New Regime — FY 2026-27' }, { value: 'Old Regime — FY 2026-27', label: 'Old Regime — FY 2026-27' }]} />
                    <p className="mt-1 text-xs italic text-gray-400">Mandatory if the assigned structure contains a tax component.</p>
                    <p className="mt-2 text-sm text-gray-700">Tax Regime: <span className="font-medium">{form.taxRegime} Regime</span> <span className="text-xs text-gray-400">(from selected slab)</span></p>
                    <button type="button" className="mt-1 text-sm text-indigo-700 underline" onClick={() => flash('Tax regime comparator: Old vs New annual tax is estimated from this assignment. Choose the cheaper regime on the employee self-service portal; it writes back here.')}>Tax Regime Comparator</button>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Base Amount (Basic Pay) *</label>
                  <div className="flex h-11 overflow-hidden rounded-lg border border-gray-200">
                    <span className="flex items-center bg-gray-50 px-3 text-gray-400">₹</span>
                    <input type="number" className="w-full px-3 text-right text-sm outline-none" value={form.baseSalary || ''} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Variable Component</label>
                  <div className="flex h-11 overflow-hidden rounded-lg border border-gray-200">
                    <span className="flex items-center bg-gray-50 px-3 text-gray-400">₹</span>
                    <input type="number" className="w-full px-3 text-right text-sm outline-none" value={form.variableAmount || ''} onChange={(e) => setForm({ ...form, variableAmount: Number(e.target.value) })} />
                  </div>
                  <p className="mt-1 text-xs italic text-gray-400">Target-based incentive, if applicable</p>
                </div>
                <Select label="Payroll Payable Account" value={form.payrollAccount} onChange={(e) => setForm({ ...form, payrollAccount: typeof e === 'string' ? e : e.target.value })} options={[{ value: '', label: 'Use global account' }, { value: 'SBI Salary Payable', label: 'SBI Salary Payable' }]} />
              </div>

              {form.effectiveFrom && !form.effectiveFrom.endsWith('-04-01') && (
                <div>
                  <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-gray-800"><span className="h-5 w-1 rounded bg-indigo-600" />Opening Balances (mid-year joiner)</h2>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input label="Taxable Earnings from Previous Employer" type="number" value={form.previousTaxable || ''} onChange={(e) => setForm({ ...form, previousTaxable: Number(e.target.value) || 0 })} />
                    <Input label="Tax Deducted by Previous Employer" type="number" value={form.previousTds || ''} onChange={(e) => setForm({ ...form, previousTds: Number(e.target.value) || 0 })} />
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-600">Form 12B Reference</label>
                      <input type="file" accept=".pdf,image/*" className="block w-full text-sm text-gray-600" onChange={(e) => setForm({ ...form, form12b: e.target.files?.[0]?.name || '' })} />
                      {form.form12b && <p className="mt-1 text-xs text-gray-500">{form.form12b}</p>}
                    </div>
                  </div>
                  {form.previousTaxable > 0 && (
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Opening balance detected. Total annual taxable income will include ₹{form.previousTaxable.toLocaleString('en-IN')} from previous employer.</p>
                  )}
                </div>
              )}

              {form.structure && (
                <div>
                  <button type="button" className="mb-3 flex w-full items-center justify-between text-base font-semibold text-gray-800" onClick={() => setPreviewOpen((v) => !v)}>
                    <span className="flex items-center gap-3"><span className="h-5 w-1 rounded bg-indigo-600" />Structure Preview</span>
                    <span>{previewOpen ? '▴' : '▾'}</span>
                  </button>
                  {previewOpen && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-emerald-50 text-[11px] font-semibold uppercase text-emerald-700"><th className="px-3 py-2 text-left" colSpan={3}>Earnings</th></tr></thead>
                        <tbody>{EARNINGS.map((r) => <tr key={r.abbr} className="border-b border-gray-100 hover:bg-indigo-50"><td className="px-3 py-2 text-gray-700">{r.name}</td><td className="px-3 py-2 italic text-gray-400">{r.formula}</td><td className="px-3 py-2 font-mono text-xs text-gray-400">{r.abbr}</td></tr>)}</tbody>
                      </table>
                      <table className="w-full text-sm">
                        <thead><tr className="bg-red-50 text-[11px] font-semibold uppercase text-red-700"><th className="px-3 py-2 text-left" colSpan={3}>Deductions</th></tr></thead>
                        <tbody>{DEDUCTIONS.map((r) => <tr key={r.abbr} className="border-b border-gray-100 hover:bg-indigo-50"><td className="px-3 py-2 text-gray-700">{r.name}</td><td className="px-3 py-2 italic text-gray-400">{r.formula}</td><td className="px-3 py-2 font-mono text-xs text-gray-400">{r.abbr}</td></tr>)}</tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {form.baseSalary > 0 && (
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-slate-50 p-5">
                  <p className="mb-4 text-sm font-semibold text-indigo-700">Estimated Monthly Compensation</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[{ l: 'Gross Pay', v: gross }, { l: 'Deductions', v: deductions }, { l: 'Est. TDS', v: tds }, { l: 'Net Pay', v: net }].map((s) => (
                      <div key={s.l}><p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{s.l}</p><p className="text-xl font-bold text-gray-800">{inr(s.v)}</p></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-8 py-4">
              <Badge variant={docStatus === 'Submitted' ? 'success' : docStatus === 'Cancelled' ? 'danger' : 'secondary'}>{docStatus}</Badge>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => save('Draft')}>Save as Draft</Button>
                <Button onClick={() => save('Submitted')}>Submit</Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card title="Assignment History">
              {!emp && <p className="text-sm text-gray-400">No previous assignments</p>}
              {emp && history.length === 0 && <p className="text-sm text-gray-400">No previous assignments</p>}
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="border-l-2 border-gray-200 pl-3 text-sm">
                    <p className="text-[11px] font-semibold text-gray-400">{h.effectiveFrom}</p>
                    <p className="font-medium text-gray-700">{h.structure}</p>
                    <p className="text-gray-500">{inr(h.baseSalary)} <Badge variant={h.assignmentStatus === 'Active' ? 'success' : 'secondary'}>{h.assignmentStatus === 'Active' ? 'Active' : 'Ended'}</Badge></p>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Quick Tips">
              <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-500">
                <li>Only submitted structures appear in dropdown</li>
                <li>Backdated assignments trigger recalculation prompt</li>
                <li>Income Tax Slab must match the employee&apos;s declared regime</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === 'bulk' && (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card title="Filter Employees">
              <div className="grid gap-4 md:grid-cols-4">
                <MultiSelect label="Department" options={['Science', 'Mathematics', 'Administration', 'Sports', 'Languages'].map((v) => ({ value: v, label: v }))} value={fDept} onChange={setFDept} placeholder="Departments" />
                <MultiSelect label="Designation" options={['PGT', 'TGT', 'PRT', 'Principal', 'Clerk', 'PET'].map((v) => ({ value: v, label: v }))} value={fDesig} onChange={setFDesig} placeholder="Designations" />
                <Select label="Staff Category" value={fCat} onChange={(e) => setFCat(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Teaching', label: 'Teaching' }, { value: 'Non-Teaching', label: 'Non-Teaching' }, { value: 'Contractual', label: 'Contractual' }]} />
                <Select label="Employee Grade" value={fGrade} onChange={(e) => setFGrade(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All grades' }, { value: 'A', label: 'Grade A' }, { value: 'B', label: 'Grade B' }, { value: 'C', label: 'Grade C' }]} />
              </div>
              <div className="mt-4 flex items-center justify-end gap-4">
                {applied && <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">{filterCount} filters applied</span>}
                <button type="button" className="text-sm text-gray-400 hover:text-gray-600" onClick={() => { setFDept([]); setFDesig([]); setFCat(''); setFGrade(''); setApplied(false); setSelected([]); }}>Clear All</button>
                <Button onClick={() => { setApplied(true); setSelected([]); }}>Apply Filters</Button>
              </div>
            </Card>

            {applied && bulkPool.length === 0 && (
              <Card>
                <div className="py-10 text-center">
                  <p className="text-base font-semibold text-gray-600">No Employees Match Your Filters</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-gray-400">Try adjusting the department, designation, or staff category filters</p>
                  <Button variant="outline" className="mt-4" onClick={() => setApplied(false)}>Clear Filters</Button>
                </div>
              </Card>
            )}

            {applied && bulkPool.length > 0 && (
              <Card noPadding>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="grid">
                    <thead>
                      <tr className="border-b-2 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === bulkPool.length} onChange={(e) => setSelected(e.target.checked ? bulkPool.map((x) => x.id) : [])} /></th>
                        {['Employee', 'Current Structure', 'New Structure', 'Base Amount', 'From Date', 'Income Tax Slab'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPool.map((e) => {
                        const cur = currentOf(e.id);
                        const on = selected.includes(e.id);
                        return (
                          <tr key={e.id} className={`border-b border-gray-100 hover:bg-indigo-50 ${on ? 'border-l-[3px] border-l-indigo-400 bg-indigo-50' : ''}`}>
                            <td className="px-4 py-3"><input type="checkbox" checked={on} onChange={(ev) => setSelected((p) => ev.target.checked ? [...p, e.id] : p.filter((x) => x !== e.id))} /></td>
                            <td className="px-4 py-3"><p className="font-medium text-gray-800">{e.name}</p><p className="text-xs text-gray-400">{e.id}</p></td>
                            <td className="px-4 py-3 text-gray-500">{cur?.structure || '—'} {cur && <span className="ml-1 rounded bg-gray-100 px-2 py-0.5 text-[11px]">{cur.frequency}</span>}</td>
                            <td className="px-4 py-3">
                              <select className="rounded-md border-transparent bg-transparent text-sm hover:border-indigo-300 hover:bg-white" value={bulkStructure} onChange={(ev) => setBulkStructure(ev.target.value)}>
                                {STRUCTURES.map((s) => <option key={s.name}>{s.name}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input type="number" className="w-28 rounded-md border-transparent bg-transparent text-right hover:border-indigo-300 hover:bg-white" value={bulkBase[e.id] ?? cur?.baseSalary ?? 40000} onChange={(ev) => setBulkBase({ ...bulkBase, [e.id]: Number(ev.target.value) })} />
                            </td>
                            <td className="px-4 py-3"><input type="date" className="rounded-md border-transparent bg-transparent hover:border-indigo-300 hover:bg-white" value={bulkDate} onChange={(ev) => setBulkDate(ev.target.value)} /></td>
                            <td className="px-4 py-3">
                              <select className="rounded-md border-transparent bg-transparent text-sm hover:border-indigo-300 hover:bg-white" value={bulkTax[e.id] || 'New Regime — FY 2026-27'} onChange={(ev) => setBulkTax({ ...bulkTax, [e.id]: ev.target.value })}>
                                <option>New Regime — FY 2026-27</option>
                                <option>Old Regime — FY 2026-27</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t-2 bg-gray-50 px-4 py-3 text-xs text-gray-400">
                  <span>Showing {bulkPool.length} of {bulkPool.length} employees</span>
                  <button type="button" className="text-sm font-medium text-indigo-600" onClick={() => setSelected(bulkPool.map((e) => e.id))}>Select All ({bulkPool.length})</button>
                </div>
                {selected.length > 0 && (
                  <div className="flex items-center justify-between rounded-b-lg bg-indigo-600 px-6 py-3 text-white">
                    <span className="text-sm font-semibold">{selected.length} employees selected</span>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-indigo-300 text-white hover:bg-indigo-500" onClick={() => setBulkModal(true)}>Bulk Update Base</Button>
                      <Button className="bg-white text-indigo-600 hover:bg-indigo-50" onClick={runBulk}>Assign Structure</Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
          <div className="space-y-3">
            <Card title="Active Filters">
              <div className="flex flex-wrap gap-2">
                {fDept.map((d) => <span key={d} className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">{d}</span>)}
                {fDesig.map((d) => <span key={d} className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">{d}</span>)}
                {fCat && <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">{fCat}</span>}
                {!filterCount && <p className="text-sm text-gray-400">None</p>}
              </div>
            </Card>
            {[{ l: 'Matched Employees', v: applied ? bulkPool.length : 0 }, { l: 'Already Assigned', v: applied ? bulkPool.filter((e) => currentOf(e.id)).length : 0 }, { l: 'Pending Assignment', v: applied ? bulkPool.filter((e) => !currentOf(e.id)).length : 0 }].map((s) => (
              <div key={s.l} className="rounded-xl bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase text-gray-400">{s.l}</p>
                <p className={`text-xl font-bold ${s.l.startsWith('Pending') && s.v > 0 ? 'text-amber-600' : 'text-gray-800'}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={backdateOpen} onClose={() => setBackdateOpen(false)} title="Recalculate Existing Salary Slips?" size="md" footer={<div className="flex justify-center gap-3"><Button variant="outline" onClick={() => doSave('Submitted', false)}>Skip Recalculation</Button><Button onClick={() => doSave('Submitted', true)}>Recalculate Slips</Button></div>}>
        <p className="text-center text-sm text-gray-500">This assignment is backdated to {form.effectiveFrom}. Do you want the system to recalculate any existing salary slips generated after this date?</p>
      </Modal>

      <Modal isOpen={bulkModal} onClose={() => setBulkModal(false)} title="Bulk Update Base Amount" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setBulkModal(false)}>Cancel</Button><Button onClick={applyBulkBase}>Apply to Selected</Button></div>}>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setBulkMode('pct')} className={`rounded-lg py-2 text-sm font-semibold ${bulkMode === 'pct' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>By Percentage (%)</button>
          <button type="button" onClick={() => setBulkMode('fixed')} className={`rounded-lg py-2 text-sm font-semibold ${bulkMode === 'fixed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>By Fixed Amount (₹)</button>
        </div>
        <Input className="mt-4" type="number" label={bulkMode === 'pct' ? 'Percentage' : 'Amount'} value={bulkVal} onChange={(e) => setBulkVal(e.target.value)} />
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">Current avg base: {inr(avgBase)} → New avg base: {inr(newAvg)} <span className="font-semibold text-emerald-600">{bulkMode === 'pct' ? `+${bulkVal}%` : `+${inr(Number(bulkVal) || 0)}`}</span></div>
      </Modal>

      <Modal isOpen={progressOpen} onClose={() => setProgressOpen(false)} title={progress >= 100 ? 'Assignment Complete' : 'Assigning Salary Structures…'} size="lg" footer={<div className="flex justify-end gap-2"><Button onClick={() => setProgressOpen(false)}>Done</Button>{progressLog.some((l) => !l.ok) && <Button variant="outline">Retry Failed</Button>}</div>}>
        <p className="mb-2 text-sm text-gray-500">{progressLog.length} employees processed</p>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className={`h-2 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }} /></div>
        {progress >= 100 && <p className="mt-2 text-sm"><span className="font-semibold text-emerald-600">{progressLog.filter((l) => l.ok).length} successful</span> · <span className="font-semibold text-red-500">{progressLog.filter((l) => !l.ok).length} failed</span></p>}
        <ul className="mt-3 max-h-48 overflow-auto text-xs">
          {progressLog.map((l, i) => <li key={i} className={`border-b border-gray-50 py-1 ${l.ok ? 'text-gray-600' : 'text-red-500'}`}>{l.ok ? 'OK' : 'Failed'} {l.text}</li>)}
        </ul>
      </Modal>
    </div>
  );
}

export default EmployeePayStructure;
