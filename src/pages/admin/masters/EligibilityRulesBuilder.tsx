import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Plus, Save, Search, TestTube2 } from 'lucide-react';

type Logic = 'AND' | 'OR';
interface Criterion {
  id: string;
  group: string;
  field: string;
  operator: string;
  value: string;
}
interface Rule {
  id: string;
  name: string;
  year: string;
  program: string;
  className: string;
  stream: string;
  logic: Logic;
  priority: number;
  status: 'Active' | 'Inactive' | 'Draft';
  criteria: Criterion[];
  failMessage: string;
}

const FIELDS = [
  'Minimum Age (years)', 'Maximum Age (years)', 'Previous Class', 'Minimum % Marks',
  'Required Subjects', 'Documents Mandatory', 'Gender', 'Category', 'Staff Ward',
  'Sibling in school', 'Max distance (km)', 'Entrance Test Required', 'Interview Required'
];
const OPERATORS = ['equals', 'not equals', '>=', '<=', 'contains', 'in list', 'is true', 'is false'];
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const SEED: Rule[] = [
  {
    id: 'ELG-001', name: 'Class 1 CBSE Age + Documents', year: '2026-27', program: 'Day School', className: '1', stream: 'N/A',
    logic: 'AND', priority: 1, status: 'Active', failMessage: 'Child does not meet Class 1 age or document rules.',
    criteria: [
      { id: 'c1', group: 'A', field: 'Minimum Age (years)', operator: '>=', value: '5.5' },
      { id: 'c2', group: 'A', field: 'Maximum Age (years)', operator: '<=', value: '7' },
      { id: 'c3', group: 'B', field: 'Documents Mandatory', operator: 'in list', value: 'Birth Certificate, Address Proof' }
    ]
  },
  {
    id: 'ELG-002', name: 'Class 11 Science', year: '2026-27', program: 'Day School', className: '11', stream: 'Science',
    logic: 'AND', priority: 2, status: 'Active', failMessage: 'Science stream requires 75% with Maths and Science.',
    criteria: [
      { id: 'c1', group: 'A', field: 'Previous Class', operator: 'equals', value: '10' },
      { id: 'c2', group: 'A', field: 'Minimum % Marks', operator: '>=', value: '75' },
      { id: 'c3', group: 'A', field: 'Required Subjects', operator: 'contains', value: 'Mathematics, Science' },
      { id: 'c4', group: 'B', field: 'Entrance Test Required', operator: 'is true', value: 'true' }
    ]
  }
];

export function EligibilityRulesBuilder() {
  const [rules, setRules] = useState<Rule[]>(SEED);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [test, setTest] = useState({ age: '6', prev: 'UKG', marks: '82', subjects: 'English', gender: 'Female', category: 'General', staff: 'No', sibling: 'Yes', distance: '4', docs: 'Birth Certificate' });
  const [testResult, setTestResult] = useState<string | null>(null);

  const blank = (): Rule => ({
    id: '', name: '', year: '2026-27', program: 'Day School', className: '1', stream: 'N/A',
    logic: 'AND', priority: rules.length + 1, status: 'Draft', failMessage: '',
    criteria: [{ id: 'c1', group: 'A', field: 'Minimum Age (years)', operator: '>=', value: '' }]
  });

  const filtered = rules.filter((r) => !q || `${r.name} ${r.className} ${r.stream}`.toLowerCase().includes(q.toLowerCase()));

  const validate = (r: Rule) => {
    const e: string[] = [];
    if (!r.name.trim()) e.push('Rule name is required.');
    if (!r.year || !r.program || !r.className) e.push('Academic year, program and class are required.');
    if (!r.criteria.length) e.push('Add at least one criterion.');
    r.criteria.forEach((c, i) => {
      if (!c.field || !c.operator || !c.value) e.push(`Criterion ${i + 1} needs field, operator and value.`);
    });
    return e;
  };

  const save = () => {
    if (!editing) return;
    const e = validate(editing);
    if (e.length) { setErrors(e); return; }
    if (editing.id) setRules((list) => list.map((r) => r.id === editing.id ? editing : r));
    else setRules((list) => [{ ...editing, id: `ELG-${String(list.length + 1).padStart(3, '0')}` }, ...list]);
    setOpen(false);
    setNotice('Eligibility rule saved.');
  };

  const runTest = () => {
    if (!editing) return;
    const checks = editing.criteria.map((c) => {
      const age = Number(test.age);
      if (c.field.startsWith('Minimum Age')) return age >= Number(c.value);
      if (c.field.startsWith('Maximum Age')) return age <= Number(c.value);
      if (c.field === 'Previous Class') return test.prev === c.value;
      if (c.field.includes('% Marks')) return Number(test.marks) >= Number(c.value);
      if (c.field === 'Gender') return test.gender === c.value;
      if (c.field === 'Category') return test.category === c.value;
      if (c.field === 'Staff Ward') return test.staff === c.value || c.operator === 'is false';
      if (c.field.startsWith('Sibling')) return test.sibling === 'Yes';
      if (c.field.includes('distance')) return Number(test.distance) <= Number(c.value);
      if (c.field === 'Documents Mandatory') return c.value.split(',').every((d) => test.docs.toLowerCase().includes(d.trim().toLowerCase().split(' ')[0]));
      return true;
    });
    const pass = editing.logic === 'AND' ? checks.every(Boolean) : checks.some(Boolean);
    setTestResult(pass ? 'ELIGIBLE — dummy candidate passes this rule.' : `NOT ELIGIBLE — ${editing.failMessage || 'criteria not met.'}`);
  };

  const setCrit = (i: number, patch: Partial<Criterion>) => {
    if (!editing) return;
    setEditing({ ...editing, criteria: editing.criteria.map((c, idx) => idx === i ? { ...c, ...patch } : c) });
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Eligibility Rules Builder</h1>
          <p className="text-sm text-gray-500">Compose AND/OR admission criteria by class and stream.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditing(blank()); setErrors([]); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> New Rule</Button>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <Card>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input className={`${inputClass} pl-9`} placeholder="Search rules" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['Rule', 'Applies To', 'Logic', 'Criteria', 'Priority', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-medium">{r.name}<p className="text-xs text-gray-500">{r.id}</p></td>
                <td className="px-3 py-2">{r.year} · Class {r.className} · {r.stream}</td>
                <td className="px-3 py-2">{r.logic}</td>
                <td className="px-3 py-2">{r.criteria.length}</td>
                <td className="px-3 py-2">{r.priority}</td>
                <td className="px-3 py-2"><Badge variant={r.status === 'Active' ? 'success' : r.status === 'Draft' ? 'warning' : 'default'}>{r.status}</Badge></td>
                <td className="px-3 py-2"><Button variant="outline" onClick={() => { setEditing(JSON.parse(JSON.stringify(r))); setErrors([]); setOpen(true); }}>Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Eligibility Rule' : 'New Eligibility Rule'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setTestOpen(true); setTestResult(null); }}><TestTube2 className="w-4 h-4 mr-1" /> Test Candidate</Button><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button></div>}>
        {editing && (
          <div className="space-y-4">
            {errors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{errors.map((e) => <p key={e}>• {e}</p>)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3"><Input label="Rule Name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <Select label="Academic Year *" options={['2025-26', '2026-27', '2027-28'].map((y) => ({ value: y, label: y }))} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              <Select label="Program *" options={['Day School', 'Boarding', 'Pre-Primary'].map((y) => ({ value: y, label: y }))} value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })} />
              <Select label="Class *" options={['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => String(i + 1))].map((y) => ({ value: y, label: y }))} value={editing.className} onChange={(e) => setEditing({ ...editing, className: e.target.value })} />
              <Select label="Stream" options={['N/A', 'Science', 'Commerce', 'Arts'].map((y) => ({ value: y, label: y }))} value={editing.stream} onChange={(e) => setEditing({ ...editing, stream: e.target.value })} />
              <Select label="Group logic" options={[{ value: 'AND', label: 'AND (all must pass)' }, { value: 'OR', label: 'OR (any may pass)' }]} value={editing.logic} onChange={(e) => setEditing({ ...editing, logic: e.target.value as Logic })} />
              <Input label="Priority" type="number" value={String(editing.priority)} onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) || 1 })} />
              <Select label="Status" options={['Draft', 'Active', 'Inactive'].map((y) => ({ value: y, label: y }))} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Rule['status'] })} />
            </div>
            <p className="text-sm font-semibold">Criteria groups (A/B used with {editing.logic})</p>
            {editing.criteria.map((c, i) => (
              <div key={c.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-1"><Input label="Grp" value={c.group} onChange={(e) => setCrit(i, { group: e.target.value })} /></div>
                <div className="col-span-4"><Select label="Field" options={FIELDS.map((f) => ({ value: f, label: f }))} value={c.field} onChange={(e) => setCrit(i, { field: e.target.value })} /></div>
                <div className="col-span-3"><Select label="Operator" options={OPERATORS.map((f) => ({ value: f, label: f }))} value={c.operator} onChange={(e) => setCrit(i, { operator: e.target.value })} /></div>
                <div className="col-span-3"><Input label="Value" value={c.value} onChange={(e) => setCrit(i, { value: e.target.value })} /></div>
                <div className="col-span-1 pb-1"><Button variant="outline" onClick={() => setEditing({ ...editing, criteria: editing.criteria.filter((_, idx) => idx !== i) })}>×</Button></div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setEditing({ ...editing, criteria: [...editing.criteria, { id: `c${Date.now()}`, group: 'A', field: FIELDS[0], operator: '>=', value: '' }] })}>+ Add Criterion</Button>
            <textarea className={inputClass} rows={2} placeholder="Message shown when candidate fails" value={editing.failMessage} onChange={(e) => setEditing({ ...editing, failMessage: e.target.value })} />
          </div>
        )}
      </Modal>

      <Modal isOpen={testOpen} onClose={() => setTestOpen(false)} title="Test dummy candidate" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setTestOpen(false)}>Close</Button><Button variant="primary" onClick={runTest}>Run Test</Button></div>}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Age" value={test.age} onChange={(e) => setTest({ ...test, age: e.target.value })} />
          <Input label="Previous class" value={test.prev} onChange={(e) => setTest({ ...test, prev: e.target.value })} />
          <Input label="% Marks" value={test.marks} onChange={(e) => setTest({ ...test, marks: e.target.value })} />
          <Input label="Subjects" value={test.subjects} onChange={(e) => setTest({ ...test, subjects: e.target.value })} />
          <Input label="Gender" value={test.gender} onChange={(e) => setTest({ ...test, gender: e.target.value })} />
          <Input label="Category" value={test.category} onChange={(e) => setTest({ ...test, category: e.target.value })} />
          <Input label="Staff ward" value={test.staff} onChange={(e) => setTest({ ...test, staff: e.target.value })} />
          <Input label="Sibling" value={test.sibling} onChange={(e) => setTest({ ...test, sibling: e.target.value })} />
          <Input label="Distance km" value={test.distance} onChange={(e) => setTest({ ...test, distance: e.target.value })} />
          <Input label="Documents" value={test.docs} onChange={(e) => setTest({ ...test, docs: e.target.value })} />
        </div>
        {testResult && <p className={`mt-3 text-sm font-semibold ${testResult.startsWith('ELIGIBLE') ? 'text-green-700' : 'text-red-700'}`}>{testResult}</p>}
      </Modal>
    </div>
  );
}

export default EligibilityRulesBuilder;
