import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { History, Plus, Search } from 'lucide-react';

const STORE = 'k12-salary-assignments-v1';

type Assignment = {
  id: string;
  employeeId: string;
  employeeName: string;
  school: string;
  branch: string;
  department: string;
  designation: string;
  structure: string;
  effectiveFrom: string;
  effectiveTo: string;
  baseSalary: number;
  variableAmount: number;
  taxSlab: string;
  costCenter: string;
  status: 'Active' | 'Superseded';
};

const EMPLOYEES = [
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', branch: 'Main Branch' },
  { id: 'EMP-1088', name: 'Rajesh Kumar', department: 'Mathematics', designation: 'TGT Maths', branch: 'Main Branch' },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', designation: 'Office Superintendent', branch: 'City Campus' },
  { id: 'EMP-1120', name: 'Anil Patel', department: 'Sports', designation: 'PET', branch: 'North Campus' },
  { id: 'EMP-1144', name: 'Priya Nair', department: 'Languages', designation: 'PGT English', branch: 'Main Branch' },
];

const STRUCTURES = ['Teaching Grade A 2026', 'Teaching Grade B 2026', 'Non-Teaching Grade C', 'Support Staff Grade D'];
const TAX = ['New Regime — FY 2026-27', 'Old Regime — FY 2026-27', 'Not applicable'];
const CENTERS = ['ACAD-SCI', 'ACAD-MATH', 'ADMIN-HO', 'SPORTS', 'LANG'];

const SEED: Assignment[] = [
  { id: 'SA-01', employeeId: 'EMP-1042', employeeName: 'Meera Iyer', school: 'EduManager School', branch: 'Main Branch', department: 'Science', designation: 'PGT Physics', structure: 'Teaching Grade A 2026', effectiveFrom: '2026-04-01', effectiveTo: '', baseSalary: 42000, variableAmount: 4000, taxSlab: TAX[0], costCenter: 'ACAD-SCI', status: 'Active' },
  { id: 'SA-00', employeeId: 'EMP-1042', employeeName: 'Meera Iyer', school: 'EduManager School', branch: 'Main Branch', department: 'Science', designation: 'PGT Physics', structure: 'Teaching Grade B 2025', effectiveFrom: '2025-04-01', effectiveTo: '2026-03-31', baseSalary: 38000, variableAmount: 2000, taxSlab: TAX[1], costCenter: 'ACAD-SCI', status: 'Superseded' },
  { id: 'SA-02', employeeId: 'EMP-1088', employeeName: 'Rajesh Kumar', school: 'EduManager School', branch: 'Main Branch', department: 'Mathematics', designation: 'TGT Maths', structure: 'Teaching Grade B 2026', effectiveFrom: '2026-04-01', effectiveTo: '', baseSalary: 36000, variableAmount: 2500, taxSlab: TAX[0], costCenter: 'ACAD-MATH', status: 'Active' },
];

const load = (): Assignment[] => {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Assignment[]) : SEED;
  } catch {
    return SEED;
  }
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const emptyForm = {
  employeeId: '',
  school: 'EduManager School',
  branch: 'Main Branch',
  department: '',
  designation: '',
  structure: STRUCTURES[0],
  effectiveFrom: '2026-11-01',
  baseSalary: 0,
  variableAmount: 0,
  taxSlab: TAX[0],
  costCenter: CENTERS[0],
};

export function EmployeePayStructure() {
  const [rows, setRows] = useState<Assignment[]>(load);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState('');
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [preview, setPreview] = useState<Assignment | null>(null);

  const persist = (next: Assignment[]) => {
    setRows(next);
    localStorage.setItem(STORE, JSON.stringify(next));
  };

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const pickEmployee = (id: string) => {
    const emp = EMPLOYEES.find((e) => e.id === id);
    if (!emp) {
      setForm((f) => ({ ...f, employeeId: id }));
      return;
    }
    setForm((f) => ({
      ...f,
      employeeId: emp.id,
      department: emp.department,
      designation: emp.designation,
      branch: emp.branch,
    }));
  };

  const assign = (mode: 'assign' | 'revise') => {
    if (!form.employeeId || !form.structure || !form.effectiveFrom || !form.baseSalary) {
      flash('Employee, salary structure, effective-from date and base salary are required.');
      return;
    }
    const emp = EMPLOYEES.find((e) => e.id === form.employeeId);
    const name = emp?.name || form.employeeId;
    const next = rows.map((row) => {
      if (row.employeeId === form.employeeId && row.status === 'Active') {
        const end = new Date(`${form.effectiveFrom}T00:00:00`);
        end.setDate(end.getDate() - 1);
        const to = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
        return { ...row, status: 'Superseded' as const, effectiveTo: row.effectiveTo || to };
      }
      return row;
    });
    const created: Assignment = {
      id: `SA-${Date.now()}`,
      employeeId: form.employeeId,
      employeeName: name,
      school: form.school,
      branch: form.branch,
      department: form.department || emp?.department || '—',
      designation: form.designation || emp?.designation || '—',
      structure: form.structure,
      effectiveFrom: form.effectiveFrom,
      effectiveTo: '',
      baseSalary: Number(form.baseSalary),
      variableAmount: Number(form.variableAmount) || 0,
      taxSlab: form.taxSlab,
      costCenter: form.costCenter,
      status: 'Active',
    };
    persist([created, ...next]);
    flash(mode === 'revise' ? `Salary revised for ${name}. Previous assignment kept in history.` : `Structure assigned to ${name}. Older records were not overwritten.`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => !q || `${r.employeeId} ${r.employeeName} ${r.structure} ${r.department}`.toLowerCase().includes(q));
  }, [rows, search]);

  const historyRows = historyFor ? rows.filter((r) => r.employeeId === historyFor).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom)) : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Structure Assignment</h1>
        <p className="text-sm text-gray-500">Assign a salary structure to one employee. Historical assignments are kept when salary changes — old records are never overwritten.</p>
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card title="Assign to employee">
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          <Select
            label="Employee ID / name"
            options={[{ value: '', label: 'Select employee' }, ...EMPLOYEES.map((e) => ({ value: e.id, label: `${e.id} · ${e.name}` }))]}
            value={form.employeeId}
            onChange={(e) => pickEmployee(typeof e === 'string' ? e : e.target.value)}
          />
          <Input label="School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
          <Select label="Branch" options={['Main Branch', 'City Campus', 'North Campus'].map((v) => ({ value: v, label: v }))} value={form.branch} onChange={(e) => setForm({ ...form, branch: typeof e === 'string' ? e : e.target.value })} />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <Select label="Salary structure" options={STRUCTURES.map((v) => ({ value: v, label: v }))} value={form.structure} onChange={(e) => setForm({ ...form, structure: typeof e === 'string' ? e : e.target.value })} />
          <Input label="Effective from" type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} />
          <Input label="Base salary" type="number" value={form.baseSalary || ''} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} />
          <Input label="Variable amount" type="number" value={form.variableAmount || ''} onChange={(e) => setForm({ ...form, variableAmount: Number(e.target.value) })} />
          <Select label="Tax slab" options={TAX.map((v) => ({ value: v, label: v }))} value={form.taxSlab} onChange={(e) => setForm({ ...form, taxSlab: typeof e === 'string' ? e : e.target.value })} />
          <Select label="Cost center" options={CENTERS.map((v) => ({ value: v, label: v }))} value={form.costCenter} onChange={(e) => setForm({ ...form, costCenter: typeof e === 'string' ? e : e.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
          <Button onClick={() => assign('assign')}><Plus className="h-4 w-4" />Assign</Button>
          <Button variant="outline" onClick={() => assign('revise')} disabled={!form.employeeId}>Revise Salary</Button>
          <Button variant="outline" onClick={() => form.employeeId ? setHistoryFor(form.employeeId) : flash('Select an employee to view history.')}><History className="h-4 w-4" />View History</Button>
          <Button variant="outline" onClick={() => {
            const active = rows.find((r) => r.employeeId === form.employeeId && r.status === 'Active');
            if (active) setPreview(active);
            else flash('No active assignment to preview.');
          }}>Preview Salary Slip</Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Assignment history</h2>
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or structure" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                {['Employee', 'School / Branch', 'Dept / Designation', 'Structure', 'Effective', 'Base', 'Variable', 'Tax slab', 'Cost center', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><p className="font-medium">{row.employeeName}</p><p className="text-xs text-gray-500">{row.employeeId}</p></td>
                  <td className="px-3 py-2 text-xs">{row.school}<br />{row.branch}</td>
                  <td className="px-3 py-2 text-xs">{row.department}<br />{row.designation}</td>
                  <td className="px-3 py-2">{row.structure}</td>
                  <td className="px-3 py-2 text-xs">{row.effectiveFrom}{row.effectiveTo ? ` → ${row.effectiveTo}` : ' → current'}</td>
                  <td className="px-3 py-2">{inr(row.baseSalary)}</td>
                  <td className="px-3 py-2">{inr(row.variableAmount)}</td>
                  <td className="px-3 py-2 text-xs">{row.taxSlab}</td>
                  <td className="px-3 py-2">{row.costCenter}</td>
                  <td className="px-3 py-2"><Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge></td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <Button size="xs" variant="ghost" onClick={() => setHistoryFor(row.employeeId)}>History</Button>
                      {row.status === 'Active' && (
                        <>
                          <Button size="xs" variant="ghost" onClick={() => {
                            pickEmployee(row.employeeId);
                            setForm((f) => ({
                              ...f,
                              employeeId: row.employeeId,
                              school: row.school,
                              branch: row.branch,
                              department: row.department,
                              designation: row.designation,
                              structure: row.structure,
                              effectiveFrom: '2026-11-01',
                              baseSalary: row.baseSalary,
                              variableAmount: row.variableAmount,
                              taxSlab: row.taxSlab,
                              costCenter: row.costCenter,
                            }));
                            flash(`Revise ${row.employeeName} — previous assignment will stay in history.`);
                          }}>Revise</Button>
                          <Button size="xs" variant="ghost" onClick={() => setPreview(row)}>Preview slip</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={Boolean(historyFor)} onClose={() => setHistoryFor(null)} title={`Assignment history · ${historyFor || ''}`} size="lg">
        <p className="mb-3 text-xs text-gray-500">Each salary change adds a new record. Earlier assignments remain superseded.</p>
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">From</th><th>To</th><th>Structure</th><th>Base</th><th>Status</th></tr></thead>
          <tbody className="divide-y">
            {historyRows.map((row) => (
              <tr key={row.id}><td className="py-2">{row.effectiveFrom}</td><td>{row.effectiveTo || 'Current'}</td><td>{row.structure}</td><td>{inr(row.baseSalary)}</td><td><Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge></td></tr>
            ))}
          </tbody>
        </table>
      </Modal>

      <Modal isOpen={Boolean(preview)} onClose={() => setPreview(null)} title="Preview salary slip" size="md">
        {preview && (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">{preview.employeeName} · {preview.employeeId}</p>
            <p className="text-gray-500">{preview.structure} · from {preview.effectiveFrom}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-gray-50 p-3">Base {inr(preview.baseSalary)}</div>
              <div className="rounded-lg bg-gray-50 p-3">Variable {inr(preview.variableAmount)}</div>
              <div className="rounded-lg bg-emerald-50 p-3 col-span-2 font-semibold">Illustrative net {inr(preview.baseSalary + preview.variableAmount)}</div>
            </div>
            <p className="text-xs text-gray-500">Preview only. Final slip is produced from the payroll run, not recalculated here.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EmployeePayStructure;
