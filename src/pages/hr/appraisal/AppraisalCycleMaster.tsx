import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Search } from 'lucide-react';

const TEMPLATE_STORE = 'k12-appraisal-template-v1';
const CYCLE_STORE = 'k12-appraisal-cycle-v1';

const TYPES = ['Annual Performance Review', 'Probation Assessment', 'Mid-Year Review', 'Post-Training Assessment', 'Promotion Eligibility Assessment'];
const DEPARTMENTS = ['Science', 'Mathematics', 'Languages', 'Administration', 'Sports'];
const DESIGNATIONS = ['PGT', 'TGT', 'PRT', 'Clerk', 'Accountant', 'Principal', 'HOD'];
const STAFF_CATS = ['Permanent Teaching', 'Contractual Teaching', 'Visiting Faculty', 'Non-Teaching', 'Administrative', 'Management'];
const PHASES_SEED = [
  { name: 'Goal Setting Period', start: '2026-04-01', end: '2026-04-30', party: 'Employee' },
  { name: 'Mid-Cycle Review', start: '2026-09-01', end: '2026-09-15', party: 'HR' },
  { name: 'Self Appraisal Period', start: '2027-02-01', end: '2027-02-20', party: 'Employee' },
  { name: 'Feedback Collection Period', start: '2027-02-21', end: '2027-03-10', party: 'HR' },
  { name: 'HR Review', start: '2027-03-11', end: '2027-03-20', party: 'HR' },
  { name: 'Final Score Release', start: '2027-03-21', end: '2027-03-31', party: 'HR' }
];

type EmpStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Approved';
type CycleStatus = 'Draft' | 'Active' | 'Locked' | 'Completed';
type EmpRow = {
  id: string;
  name: string;
  designation: string;
  department: string;
  template: string;
  appraiser: string;
  selfDue: string;
  status: EmpStatus;
  note: string;
  appraisalCreated: boolean;
  selfDone: boolean;
  feedback: boolean;
  goals: boolean;
  below: boolean;
  increment: boolean;
};
type Phase = { name: string; start: string; end: string; party: string };
type Cycle = {
  id: string;
  name: string;
  company: string;
  startDate: string;
  endDate: string;
  type: string;
  kraMethod: 'Automated' | 'Manual';
  formulaOn: boolean;
  formula: string;
  employees: EmpRow[];
  phases: Phase[];
  reminders: boolean;
  reminderWhen: string;
  reminderTemplate: string;
  appraiserRule: string;
  status: CycleStatus;
};

const PEOPLE: Omit<EmpRow, 'template' | 'appraiser' | 'selfDue' | 'status' | 'note' | 'appraisalCreated'>[] = [
  { id: 'EMP-1001', name: 'Rajesh Kumar', designation: 'PGT', department: 'Science', selfDone: true, feedback: true, goals: true, below: false, increment: true },
  { id: 'EMP-1002', name: 'Priya Nair', designation: 'TGT', department: 'Mathematics', selfDone: false, feedback: false, goals: true, below: false, increment: false },
  { id: 'EMP-1008', name: 'Anil Patel', designation: 'Clerk', department: 'Administration', selfDone: true, feedback: false, goals: false, below: true, increment: false },
  { id: 'EMP-1011', name: 'Meera Iyer', designation: 'PGT', department: 'Languages', selfDone: true, feedback: true, goals: true, below: false, increment: true },
  { id: 'EMP-1022', name: 'Sunil Yadav', designation: 'TGT', department: 'Sports', selfDone: false, feedback: false, goals: false, below: false, increment: false },
  { id: 'EMP-1014', name: 'Kavita Shah', designation: 'Accountant', department: 'Administration', selfDone: true, feedback: true, goals: true, below: false, increment: false }
];

const HOD: Record<string, string> = {
  Science: 'HOD Science',
  Mathematics: 'HOD Mathematics',
  Languages: 'HOD Languages',
  Administration: 'Admin Manager',
  Sports: 'Sports In-charge'
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function templateNames() {
  const rows = loadJson<{ name: string }[]>(TEMPLATE_STORE, []);
  const names = rows.map((r) => r.name);
  return names.length ? names : ['Teaching Staff — Annual', 'Support Staff — Quarterly'];
}

function toEmp(p: (typeof PEOPLE)[number], template: string): EmpRow {
  return {
    ...p,
    template,
    appraiser: HOD[p.department] || 'Reporting Manager',
    selfDue: '2027-02-20',
    status: p.selfDone ? (p.feedback ? 'Submitted' : 'In Progress') : 'Not Started',
    note: '',
    appraisalCreated: p.selfDone
  };
}

const SEED: Cycle[] = [
  {
    id: 'CYC-AY-2627',
    name: 'AY 2026-27 — Annual Appraisal',
    company: 'EduManager School',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    type: 'Annual Performance Review',
    kraMethod: 'Automated',
    formulaOn: true,
    formula: '(goal_score * 0.4) + (feedback_score * 0.35) + (self_score * 0.15) + (observation_score * 0.10)',
    employees: PEOPLE.filter((p) => ['PGT', 'TGT'].includes(p.designation)).map((p) => toEmp(p, 'Teaching Staff — Annual')),
    phases: PHASES_SEED,
    reminders: true,
    reminderWhen: '3 days before',
    reminderTemplate: 'Self Appraisal Due',
    appraiserRule: 'Auto-assign HOD as Appraiser',
    status: 'Active'
  }
];

const emptyCycle = (): Cycle => ({
  id: '',
  name: '',
  company: 'EduManager School',
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  type: 'Annual Performance Review',
  kraMethod: 'Automated',
  formulaOn: false,
  formula: '(goal_score * 0.4) + (feedback_score * 0.35) + (self_score * 0.15) + (observation_score * 0.10)',
  employees: [],
  phases: PHASES_SEED.map((p) => ({ ...p })),
  reminders: true,
  reminderWhen: '3 days before',
  reminderTemplate: 'Goal Setting Reminder',
  appraiserRule: 'Auto-assign Reporting Manager',
  status: 'Draft'
});

const SECTIONS = [
  { id: 'config' as const, label: 'Cycle Configuration' },
  { id: 'people' as const, label: 'Employee Groups' }
];

export function AppraisalCycleMaster() {
  const [cycles, setCycles] = useState<Cycle[]>(() => loadJson(CYCLE_STORE, SEED));
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [section, setSection] = useState<(typeof SECTIONS)[number]['id']>('config');
  const [form, setForm] = useState<Cycle>(emptyCycle);
  const [notice, setNotice] = useState('');
  const [populateOpen, setPopulateOpen] = useState(false);
  const [popDept, setPopDept] = useState<string[]>([]);
  const [popDesig, setPopDesig] = useState<string[]>([]);
  const [popCat, setPopCat] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const templates = templateNames();

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const persist = (next: Cycle[]) => {
    setCycles(next);
    saveJson(CYCLE_STORE, next);
  };

  const filtered = cycles.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const applyAppraiser = (rows: EmpRow[], rule: string) => rows.map((r) => ({
    ...r,
    appraiser: rule.includes('HOD') ? (HOD[r.department] || r.appraiser) : rule.includes('Reporting') ? `RM of ${r.name}` : r.appraiser
  }));

  const populate = () => {
    const template = templates[0];
    const matched = PEOPLE.filter((p) => {
      if (popDept.length && !popDept.includes(p.department)) return false;
      if (popDesig.length && !popDesig.includes(p.designation)) return false;
      if (popCat.includes('Teaching') && !['PGT', 'TGT', 'PRT'].includes(p.designation)) return false;
      if ((popCat === 'Administrative' || popCat === 'Non-Teaching') && !['Clerk', 'Accountant'].includes(p.designation)) return false;
      return true;
    }).map((p) => toEmp(p, template));
    const merged = [...form.employees];
    matched.forEach((row) => {
      if (!merged.some((e) => e.id === row.id)) merged.push(row);
    });
    setForm({ ...form, employees: applyAppraiser(merged, form.appraiserRule) });
    setPopulateOpen(false);
    flash(`${matched.length} employee(s) added from filters.`);
  };

  const save = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      flash('Cycle name, start date and end date are mandatory.');
      return;
    }
    if (form.endDate < form.startDate) {
      flash('End date must be after start date.');
      return;
    }
    const today = '2026-10-31';
    const status: CycleStatus = form.endDate < today ? 'Completed' : form.status === 'Draft' ? 'Active' : form.status;
    const record = { ...(form.id ? form : { ...form, id: `CYC-${Date.now()}` }), status };
    persist(form.id ? cycles.map((c) => (c.id === form.id ? record : c)) : [record, ...cycles]);
    setForm(record);
    flash('Appraisal cycle saved.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Cycle Master</h1>
          <p className="text-sm text-gray-500">A defined period to assess staff. Map to the academic year (April–March) or a term. Different departments can use different cycles.</p>
        </div>
        {!showForm && <Button onClick={() => { setForm(emptyCycle()); setSection('config'); setShowForm(true); }}><Plus className="mr-1 h-4 w-4" />New Cycle</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {!showForm && (
        <>
          <Card>
            <div className="p-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cycles" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Cycle', 'Period', 'Type', 'Employees', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{row.name}</td>
                      <td className="px-3 py-2 text-xs">{row.startDate} — {row.endDate}</td>
                      <td className="px-3 py-2 text-xs">{row.type}</td>
                      <td className="px-3 py-2">{row.employees.length}</td>
                      <td className="px-3 py-2"><Badge variant={row.status === 'Completed' || row.status === 'Active' ? 'success' : row.status === 'Locked' ? 'warning' : 'secondary'}>{row.status}</Badge></td>
                      <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => { setForm(row); setSection('config'); setShowForm(true); }}>Open</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {showForm && (
        <Card>
          <div className="flex flex-wrap gap-1 border-b px-4">
            {SECTIONS.map((item) => (
              <button key={item.id} type="button" onClick={() => setSection(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${section === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                {item.label}
              </button>
            ))}
          </div>

          {section === 'config' && (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Input label="Cycle Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AY 2026-27 — Annual Appraisal" />
              <Select label="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'EduManager School', label: 'EduManager School' }]} />
              <Input label="Start Date *" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} helperText="Must fall in a valid school academic year." />
              <Input label="End Date *" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} helperText="If end date is in the past the cycle is marked Completed." />
              <Select label="Appraisal Type" value={form.type} onChange={(e) => setForm({ ...form, type: typeof e === 'string' ? e : e.target.value })} options={TYPES.map((v) => ({ value: v, label: v }))} />
              <Select label="KRA Evaluation Method" value={form.kraMethod} onChange={(e) => setForm({ ...form, kraMethod: (typeof e === 'string' ? e : e.target.value) as Cycle['kraMethod'] })} options={[{ value: 'Automated', label: 'Automated based on goal progress' }, { value: 'Manual', label: 'Manual rating' }]} />
              <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={form.formulaOn} onChange={(e) => setForm({ ...form, formulaOn: e.target.checked })} /> Calculate Final Score based on Formula</label>
              {form.formulaOn && (
                <div className="md:col-span-2">
                  <Input label="Custom Formula" value={form.formula} onChange={(e) => setForm({ ...form, formula: e.target.value })} helperText="Variables: goal_score, feedback_score, self_score, observation_score" />
                </div>
              )}
              <p className="md:col-span-2 text-xs text-gray-500">Use Automated for teaching staff (exam results, lesson plans). Use Manual for leadership roles where goals are qualitative.</p>
            </div>
          )}

          {section === 'people' && (
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setPopulateOpen(true)}>Auto-Populate Employees</Button>
                <Select label="Appraiser assignment" value={form.appraiserRule} onChange={(e) => {
                  const rule = typeof e === 'string' ? e : e.target.value;
                  setForm({ ...form, appraiserRule: rule, employees: applyAppraiser(form.employees, rule) });
                }} options={['Auto-assign HOD as Appraiser', 'Auto-assign Reporting Manager', 'Manual'].map((v) => ({ value: v, label: v }))} />
                {selected.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => {
                    setForm({ ...form, employees: form.employees.filter((e) => !selected.includes(e.id)) });
                    setSelected([]);
                    flash('Selected employees removed.');
                  }}>Bulk Remove</Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <th className="px-2 py-2" />
                      {['Employee', 'Designation', 'Department', 'Template', 'Appraiser', 'Self due', 'Status'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {form.employees.map((row) => (
                      <tr key={row.id} className="border-b">
                        <td className="px-2 py-2"><input type="checkbox" checked={selected.includes(row.id)} onChange={(e) => setSelected((p) => e.target.checked ? [...p, row.id] : p.filter((id) => id !== row.id))} /></td>
                        <td className="px-2 py-2"><p className="font-medium">{row.name}</p><p className="text-xs text-gray-500">{row.id}</p></td>
                        <td className="px-2 py-2">{row.designation}</td>
                        <td className="px-2 py-2">{row.department}</td>
                        <td className="px-2 py-2">
                          <select className="rounded border px-1 py-1 text-xs" value={row.template} onChange={(e) => setForm({ ...form, employees: form.employees.map((r) => r.id === row.id ? { ...r, template: e.target.value, note: r.note || 'Template override' } : r) })}>
                            {templates.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2"><input className="w-36 rounded border px-1 py-1 text-xs" value={row.appraiser} onChange={(e) => setForm({ ...form, employees: form.employees.map((r) => r.id === row.id ? { ...r, appraiser: e.target.value } : r) })} /></td>
                        <td className="px-2 py-2"><input type="date" className="rounded border px-1 py-1 text-xs" value={row.selfDue} onChange={(e) => setForm({ ...form, employees: form.employees.map((r) => r.id === row.id ? { ...r, selfDue: e.target.value } : r) })} /></td>
                        <td className="px-2 py-2"><Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Submitted' ? 'info' : 'warning'}>{row.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Back</Button>
            <Button onClick={save}>Save Cycle</Button>
          </div>
        </Card>
      )}

      <Modal isOpen={populateOpen} onClose={() => setPopulateOpen(false)} title="Auto-populate employees" size="md" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPopulateOpen(false)}>Cancel</Button><Button onClick={populate}>Add matching staff</Button></div>}>
        <div className="space-y-3">
          <MultiSelect label="Department" options={DEPARTMENTS.map((v) => ({ value: v, label: v }))} value={popDept} onChange={setPopDept} />
          <MultiSelect label="Designation" options={DESIGNATIONS.map((v) => ({ value: v, label: v }))} value={popDesig} onChange={setPopDesig} />
          <Select label="Staff category" value={popCat} onChange={(e) => setPopCat(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...STAFF_CATS.map((v) => ({ value: v, label: v }))]} />
        </div>
      </Modal>
    </div>
  );
}

export default AppraisalCycleMaster;
