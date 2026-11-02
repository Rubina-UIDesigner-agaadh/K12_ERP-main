import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Plus, Search, Trash2, X } from 'lucide-react';

const KRA_STORE = 'k12-appraisal-kra-v1';
const FEEDBACK_STORE = 'k12-appraisal-feedback-v1';
const TEMPLATE_STORE = 'k12-appraisal-template-v1';

const STAFF_CATEGORIES = ['Permanent Teaching', 'Contractual Teaching', 'Visiting Faculty', 'Non-Teaching', 'Administrative', 'Management'];
const FREQUENCIES = ['Annual', 'Bi-Annual', 'Quarterly', 'Probation Review'];
const DESIGNATIONS = ['PGT', 'TGT', 'PRT', 'Lab Assistant', 'Principal', 'Vice Principal', 'HOD', 'Clerk', 'Accountant', 'Class Teacher'];
const DEPARTMENTS = ['Science', 'Mathematics', 'Languages', 'Administration', 'Sports'];
const APPLICABLE_IN = ['Self', 'Peer', 'Manager', 'All'];

type KraOpt = { id: string; name: string; method: string; cbse: boolean; designations: string[]; archived: boolean };
type CritOpt = { id: string; name: string; applicableIn: string[]; description: string; archived: boolean };
type KraRow = { kraId: string; name: string; weightage: number; method: string; minScore: number; cbse: boolean };
type CritRow = { criteriaId: string; name: string; weightage: number; applicableIn: string; mandatory: boolean; description: string };
type GradeRow = { from: number; to: number; grade: string; increment: string; remarks: string };
type DesigRow = { designation: string; department: string; customWeight: boolean };
type Template = {
  id: string;
  name: string;
  description: string;
  staffCategory: string;
  frequency: string;
  scoreMethod: 'Average' | 'Formula-based';
  formula: string;
  grades: GradeRow[];
  kras: KraRow[];
  criteria: CritRow[];
  designations: DesigRow[];
  cycles: number;
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

function loadKras(): KraOpt[] {
  const rows = loadJson<KraOpt[]>(KRA_STORE, []);
  return rows.filter((r) => !r.archived);
}

function loadCriteria(): CritOpt[] {
  const rows = loadJson<CritOpt[]>(FEEDBACK_STORE, []);
  return rows.filter((r) => !r.archived);
}

const TEACHING_KRAS: KraRow[] = [
  { kraId: 'KRA-001', name: 'Student Academic Outcome', weightage: 30, method: 'Quantitative (Score-based)', minScore: 3, cbse: false },
  { kraId: 'KRA-002', name: 'Classroom Delivery Quality', weightage: 25, method: 'Hybrid', minScore: 3, cbse: false },
  { kraId: 'KRA-006', name: 'Lesson Plan Adherence', weightage: 15, method: 'Quantitative (Score-based)', minScore: 2.5, cbse: false },
  { kraId: 'KRA-004', name: 'Co-Curricular Contribution', weightage: 10, method: 'Qualitative (Reviewer-rated)', minScore: 2, cbse: false },
  { kraId: 'KRA-005', name: 'Parent Communication Quality', weightage: 10, method: 'Qualitative (Reviewer-rated)', minScore: 2, cbse: false },
  { kraId: 'KRA-007', name: 'CBSE Compliance & Documentation', weightage: 10, method: 'Qualitative (Reviewer-rated)', minScore: 3.5, cbse: true }
];

const TEACHING_CRITERIA: CritRow[] = [
  { criteriaId: 'FC-002', name: 'Subject Knowledge Depth', weightage: 20, applicableIn: 'Manager + Self', mandatory: true, description: 'Depth and currency of subject expertise.' },
  { criteriaId: 'FC-003', name: 'Student Engagement & Pedagogy', weightage: 20, applicableIn: 'Manager + Peer', mandatory: true, description: 'Ability to involve students in learning.' },
  { criteriaId: 'FC-004', name: 'Classroom Management', weightage: 15, applicableIn: 'Manager', mandatory: true, description: 'Discipline, time and learning climate.' },
  { criteriaId: 'FC-005', name: 'Communication with Parents', weightage: 15, applicableIn: 'Manager + Self', mandatory: false, description: 'Clarity with parents.' },
  { criteriaId: 'FC-001', name: 'Punctuality & Regularity', weightage: 10, applicableIn: 'Manager + Self', mandatory: true, description: 'Attendance and punctuality.' },
  { criteriaId: 'FC-006', name: 'Team Collaboration', weightage: 10, applicableIn: 'Peer + Self', mandatory: false, description: 'Works with colleagues.' },
  { criteriaId: 'FC-010', name: 'Professional Development Effort', weightage: 10, applicableIn: 'Self', mandatory: false, description: 'Training and application.' }
];

const DEFAULT_GRADES: GradeRow[] = [
  { from: 4.5, to: 5, grade: 'Outstanding', increment: 'Yes — 5%', remarks: 'Eligible for increment and recognition' },
  { from: 3.5, to: 4.49, grade: 'Very Good', increment: 'Yes — 3%', remarks: 'Meets stretch targets' },
  { from: 2.5, to: 3.49, grade: 'Good', increment: 'Hold', remarks: 'Development plan required' },
  { from: 0, to: 2.49, grade: 'Needs Improvement', increment: 'No', remarks: 'Below threshold' }
];

const SEED: Template[] = [
  {
    id: 'TPL-TEACH-ANN',
    name: 'Teaching Staff — Annual',
    description: 'Annual appraisal for permanent teaching staff. Self-appraisal, manager and peer feedback apply.',
    staffCategory: 'Permanent Teaching',
    frequency: 'Annual',
    scoreMethod: 'Average',
    formula: '(goal_score * 0.5) + (feedback_score * 0.3) + (self_score * 0.2)',
    grades: DEFAULT_GRADES,
    kras: TEACHING_KRAS,
    criteria: TEACHING_CRITERIA,
    designations: [
      { designation: 'PGT', department: 'Science', customWeight: false },
      { designation: 'TGT', department: 'Mathematics', customWeight: false },
      { designation: 'PRT', department: '', customWeight: false }
    ],
    cycles: 2
  },
  {
    id: 'TPL-SUP-QTR',
    name: 'Support Staff — Quarterly',
    description: 'Quarterly review for non-teaching and administrative staff.',
    staffCategory: 'Administrative',
    frequency: 'Quarterly',
    scoreMethod: 'Average',
    formula: '',
    grades: DEFAULT_GRADES,
    kras: [
      { kraId: 'KRA-008', name: 'Administrative Task Completion', weightage: 50, method: 'Quantitative (Score-based)', minScore: 3, cbse: false },
      { kraId: 'KRA-007', name: 'CBSE Compliance & Documentation', weightage: 20, method: 'Qualitative (Reviewer-rated)', minScore: 3.5, cbse: true },
      { kraId: 'KRA-011', name: 'Fee Collection Support', weightage: 30, method: 'Quantitative (Score-based)', minScore: 2, cbse: false }
    ],
    criteria: [
      { criteriaId: 'FC-011', name: 'Administrative Accuracy', weightage: 40, applicableIn: 'Manager', mandatory: true, description: 'Accuracy of records.' },
      { criteriaId: 'FC-001', name: 'Punctuality & Regularity', weightage: 30, applicableIn: 'All', mandatory: true, description: 'Attendance.' },
      { criteriaId: 'FC-007', name: 'Adherence to School Policies', weightage: 30, applicableIn: 'All', mandatory: true, description: 'Policy compliance.' }
    ],
    designations: [{ designation: 'Clerk', department: 'Administration', customWeight: false }, { designation: 'Accountant', department: 'Administration', customWeight: false }],
    cycles: 1
  }
];

const emptyTemplate = (): Template => ({
  id: '',
  name: '',
  description: '',
  staffCategory: 'Permanent Teaching',
  frequency: 'Annual',
  scoreMethod: 'Average',
  formula: '(goal_score * 0.5) + (feedback_score * 0.3) + (self_score * 0.2)',
  grades: DEFAULT_GRADES.map((g) => ({ ...g })),
  kras: [],
  criteria: [],
  designations: [],
  cycles: 0
});

const TABS = [
  { id: 'general' as const, label: 'General' },
  { id: 'kras' as const, label: 'KRAs & Weightage' },
  { id: 'feedback' as const, label: 'Feedback Criteria' },
  { id: 'links' as const, label: 'Designation Links' }
];

export function AppraisalTemplateMaster() {
  const [rows, setRows] = useState<Template[]>(() => loadJson(TEMPLATE_STORE, SEED));
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('general');
  const [form, setForm] = useState<Template>(emptyTemplate);
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState<CritRow | null>(null);
  const [addDesig, setAddDesig] = useState<string[]>([]);
  const kraOptions = useMemo(() => loadKras(), [showForm]);
  const critOptions = useMemo(() => loadCriteria(), [showForm]);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const persist = (next: Template[]) => {
    setRows(next);
    saveJson(TEMPLATE_STORE, next);
  };

  const filtered = rows.filter((row) => `${row.name} ${row.staffCategory}`.toLowerCase().includes(search.toLowerCase()));
  const kraTotal = form.kras.reduce((s, r) => s + Number(r.weightage || 0), 0);
  const critTotal = form.criteria.reduce((s, r) => s + Number(r.weightage || 0), 0);
  const formulaOk = !form.formula || /goal_score|feedback_score|self_score|observation_score/.test(form.formula);
  const canSave = kraTotal === 100 && critTotal === 100 && Boolean(form.name.trim()) && (form.scoreMethod === 'Average' || formulaOk);

  const suggestKras = (category: string) => {
    const fromMaster = kraOptions.filter((k) => {
      if (category.includes('Teaching')) return k.designations?.some((d) => ['PGT', 'TGT', 'PRT'].includes(d));
      if (category === 'Administrative' || category === 'Non-Teaching') return k.designations?.some((d) => ['Clerk', 'Accountant'].includes(d));
      if (category === 'Management') return k.designations?.some((d) => ['Principal', 'Vice Principal', 'HOD'].includes(d));
      return true;
    });
    const source = fromMaster.length ? fromMaster : TEACHING_KRAS.map((k) => ({ id: k.kraId, name: k.name, method: k.method, cbse: k.cbse, designations: [], archived: false }));
    const equal = Math.round(100 / Math.max(source.length, 1));
    setForm((prev) => ({
      ...prev,
      staffCategory: category,
      kras: source.map((k, i) => ({
        kraId: k.id,
        name: k.name,
        method: k.method,
        cbse: k.cbse,
        minScore: k.cbse ? 3.5 : 2,
        weightage: i === source.length - 1 ? 100 - equal * (source.length - 1) : equal
      }))
    }));
  };

  const addKra = () => {
    const available = kraOptions.find((k) => !form.kras.some((r) => r.kraId === k.id)) || { id: `KRA-${Date.now()}`, name: 'New KRA', method: 'Hybrid', cbse: false, designations: [], archived: false };
    setForm({ ...form, kras: [...form.kras, { kraId: available.id, name: available.name, method: available.method, cbse: available.cbse, minScore: available.cbse ? 3.5 : 2, weightage: 0 }] });
  };

  const autoDistribute = (kind: 'kras' | 'criteria') => {
    if (kind === 'kras') {
      const n = form.kras.length;
      if (!n) return;
      const equal = Math.floor(100 / n);
      setForm({ ...form, kras: form.kras.map((r, i) => ({ ...r, weightage: i === n - 1 ? 100 - equal * (n - 1) : equal })) });
    } else {
      const n = form.criteria.length;
      if (!n) return;
      const equal = Math.floor(100 / n);
      setForm({ ...form, criteria: form.criteria.map((r, i) => ({ ...r, weightage: i === n - 1 ? 100 - equal * (n - 1) : equal })) });
    }
  };

  const save = () => {
    if (!canSave) {
      flash('Name is required and both KRA and Feedback weightages must equal 100%.');
      return;
    }
    const record = form.id ? form : { ...form, id: `TPL-${Date.now()}` };
    persist(form.id ? rows.map((r) => (r.id === form.id ? record : r)) : [record, ...rows]);
    setShowForm(false);
    flash('Appraisal template saved. Link designations, then create an Appraisal Cycle.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Template Master</h1>
          <p className="text-sm text-gray-500">Define KRAs and feedback criteria per designation family. Weightages must total 100% before save.</p>
        </div>
        {!showForm && <Button onClick={() => { setForm(emptyTemplate()); setTab('general'); setShowForm(true); }}><Plus className="mr-1 h-4 w-4" />New Template</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {!showForm && (
        <>
          <Card>
            <div className="p-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
              </div>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Template', 'Staff category', 'Frequency', 'Designations', 'Cycles', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{row.name}</td>
                      <td className="px-3 py-2">{row.staffCategory}</td>
                      <td className="px-3 py-2">{row.frequency}</td>
                      <td className="px-3 py-2">{row.designations.length}</td>
                      <td className="px-3 py-2">{row.cycles}</td>
                      <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => { setForm(row); setTab('general'); setShowForm(true); }}>Open</Button></td>
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
          <div className="flex gap-1 border-b px-4">
            {TABS.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'general' && (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Input label="Template Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Teaching Staff — Annual" />
              <Select label="Staff Category" value={form.staffCategory} onChange={(e) => suggestKras(typeof e === 'string' ? e : e.target.value)} options={STAFF_CATEGORIES.map((v) => ({ value: v, label: v }))} />
              <Select label="Appraisal Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: typeof e === 'string' ? e : e.target.value })} options={FREQUENCIES.map((v) => ({ value: v, label: v }))} />
              <Select label="Final Score Method" value={form.scoreMethod} onChange={(e) => setForm({ ...form, scoreMethod: (typeof e === 'string' ? e : e.target.value) as Template['scoreMethod'] })} options={[{ value: 'Average', label: 'Average of all scores' }, { value: 'Formula-based', label: 'Formula-based' }]} />
              <div className="md:col-span-2"><Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              {form.scoreMethod === 'Formula-based' && (
                <div className="md:col-span-2">
                  <Input label="Formula Editor" value={form.formula} onChange={(e) => setForm({ ...form, formula: e.target.value })} helperText="Variables: goal_score, feedback_score, self_score, observation_score" />
                  <p className={`mt-1 text-xs ${formulaOk ? 'text-emerald-700' : 'text-red-600'}`}>{formulaOk ? 'Formula looks valid' : 'Formula must use at least one known variable'}</p>
                </div>
              )}
              {form.scoreMethod === 'Average' && (
                <div className="md:col-span-2 overflow-x-auto">
                  <p className="mb-2 text-sm font-medium text-gray-700">Grade Scale</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                        {['From', 'To', 'Grade', 'Increment eligibility', 'Remarks'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {form.grades.map((g, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-2 py-1"><input type="number" className="w-20 rounded border px-2 py-1" value={g.from} onChange={(e) => setForm({ ...form, grades: form.grades.map((r, idx) => idx === i ? { ...r, from: Number(e.target.value) } : r) })} /></td>
                          <td className="px-2 py-1"><input type="number" className="w-20 rounded border px-2 py-1" value={g.to} onChange={(e) => setForm({ ...form, grades: form.grades.map((r, idx) => idx === i ? { ...r, to: Number(e.target.value) } : r) })} /></td>
                          <td className="px-2 py-1"><input className="w-full rounded border px-2 py-1" value={g.grade} onChange={(e) => setForm({ ...form, grades: form.grades.map((r, idx) => idx === i ? { ...r, grade: e.target.value } : r) })} /></td>
                          <td className="px-2 py-1"><input className="w-full rounded border px-2 py-1" value={g.increment} onChange={(e) => setForm({ ...form, grades: form.grades.map((r, idx) => idx === i ? { ...r, increment: e.target.value } : r) })} /></td>
                          <td className="px-2 py-1"><input className="w-full rounded border px-2 py-1" value={g.remarks} onChange={(e) => setForm({ ...form, grades: form.grades.map((r, idx) => idx === i ? { ...r, remarks: e.target.value } : r) })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'kras' && (
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={addKra}>Add KRA Row</Button>
                <Button size="sm" variant="outline" onClick={() => autoDistribute('kras')}>Auto-Distribute Equally</Button>
                <span className={`ml-auto text-sm font-medium ${kraTotal === 100 ? 'text-emerald-700' : 'text-red-600'}`}>Total KRA Weightage: {kraTotal}% {kraTotal === 100 ? '— ready' : '— Must equal 100% to save'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      {['KRA', 'Weightage %', 'Measurement', 'Min score', ''].map((h) => <th key={h || 'x'} className="px-2 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {form.kras.map((row, i) => (
                      <tr key={row.kraId + i} className="border-b">
                        <td className="px-2 py-1">
                          <select className="w-full rounded border px-2 py-1" value={row.kraId} onChange={(e) => {
                            const kra = kraOptions.find((k) => k.id === e.target.value);
                            setForm({ ...form, kras: form.kras.map((r, idx) => idx === i ? { ...r, kraId: e.target.value, name: kra?.name || r.name, method: kra?.method || r.method, cbse: kra?.cbse || false } : r) });
                          }}>
                            <option value={row.kraId}>{row.name}</option>
                            {kraOptions.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                          </select>
                          {row.cbse && <Badge variant="warning">Locked · CBSE</Badge>}
                        </td>
                        <td className="px-2 py-1"><input type="number" className="w-20 rounded border px-2 py-1" value={row.weightage} onChange={(e) => setForm({ ...form, kras: form.kras.map((r, idx) => idx === i ? { ...r, weightage: Number(e.target.value) } : r) })} /></td>
                        <td className="px-2 py-1"><input className="w-full rounded border px-2 py-1 text-xs" value={row.method} onChange={(e) => setForm({ ...form, kras: form.kras.map((r, idx) => idx === i ? { ...r, method: e.target.value } : r) })} /></td>
                        <td className="px-2 py-1"><input type="number" className={`w-20 rounded border px-2 py-1 ${row.cbse ? 'border-amber-300' : ''}`} value={row.minScore} onChange={(e) => setForm({ ...form, kras: form.kras.map((r, idx) => idx === i ? { ...r, minScore: Number(e.target.value) } : r) })} /></td>
                        <td className="px-2 py-1">{row.cbse ? null : <button type="button" onClick={() => setForm({ ...form, kras: form.kras.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4 text-gray-400" /></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'feedback' && (
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  const c = critOptions.find((item) => !form.criteria.some((r) => r.criteriaId === item.id));
                  if (!c) return;
                  setForm({ ...form, criteria: [...form.criteria, { criteriaId: c.id, name: c.name, weightage: 0, applicableIn: (c.applicableIn || []).join(' + ') || 'All', mandatory: false, description: c.description || '' }] });
                }}>Add Criteria</Button>
                <Button size="sm" variant="outline" onClick={() => autoDistribute('criteria')}>Auto-Distribute Equally</Button>
                <span className={`ml-auto text-sm font-medium ${critTotal === 100 ? 'text-emerald-700' : 'text-red-600'}`}>Total Criteria Weightage: {critTotal}% {critTotal === 100 ? '— ready' : '— Must equal 100% to save'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      {['Criteria', 'Weightage %', 'Applicable In', 'Mandatory', ''].map((h) => <th key={h || 'x'} className="px-2 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {form.criteria.map((row, i) => (
                      <tr key={row.criteriaId + i} className="border-b">
                        <td className="px-2 py-1">
                          <button type="button" className="text-left font-medium text-indigo-700" onClick={() => setPreview(row)}>{row.name}</button>
                        </td>
                        <td className="px-2 py-1"><input type="number" className="w-20 rounded border px-2 py-1" value={row.weightage} onChange={(e) => setForm({ ...form, criteria: form.criteria.map((r, idx) => idx === i ? { ...r, weightage: Number(e.target.value) } : r) })} /></td>
                        <td className="px-2 py-1">
                          <select className="rounded border px-2 py-1 text-xs" value={row.applicableIn} onChange={(e) => setForm({ ...form, criteria: form.criteria.map((r, idx) => idx === i ? { ...r, applicableIn: e.target.value } : r) })}>
                            {APPLICABLE_IN.map((v) => <option key={v}>{v}</option>)}
                            <option>Manager + Self</option>
                            <option>Manager + Peer</option>
                            <option>Peer + Self</option>
                          </select>
                        </td>
                        <td className="px-2 py-1 text-center"><input type="checkbox" checked={row.mandatory} onChange={(e) => setForm({ ...form, criteria: form.criteria.map((r, idx) => idx === i ? { ...r, mandatory: e.target.checked } : r) })} /></td>
                        <td className="px-2 py-1"><button type="button" onClick={() => setForm({ ...form, criteria: form.criteria.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4 text-gray-400" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'links' && (
            <div className="space-y-4 p-5">
              <p className="text-sm text-gray-500">This template is linked to {form.designations.length} designation(s) and used in {form.cycles} active cycle(s).</p>
              <MultiSelect label="Add designations" options={DESIGNATIONS.map((v) => ({ value: v, label: v }))} value={addDesig} onChange={setAddDesig} />
              <Button size="sm" variant="outline" onClick={() => {
                const extra = addDesig.filter((d) => !form.designations.some((r) => r.designation === d)).map((d) => ({ designation: d, department: '', customWeight: false }));
                setForm({ ...form, designations: [...form.designations, ...extra] });
                setAddDesig([]);
              }}>Add Designation</Button>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Designation', 'Department', 'Custom weightage', ''].map((h) => <th key={h || 'x'} className="px-2 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {form.designations.map((row, i) => (
                    <tr key={row.designation + i} className="border-b">
                      <td className="px-2 py-2">{row.designation}</td>
                      <td className="px-2 py-2">
                        <select className="rounded border px-2 py-1" value={row.department} onChange={(e) => setForm({ ...form, designations: form.designations.map((r, idx) => idx === i ? { ...r, department: e.target.value } : r) })}>
                          <option value="">Optional</option>
                          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={row.customWeight} onChange={(e) => setForm({ ...form, designations: form.designations.map((r, idx) => idx === i ? { ...r, customWeight: e.target.checked } : r) })} /> Use custom weightage</label></td>
                      <td className="px-2 py-2"><button type="button" onClick={() => setForm({ ...form, designations: form.designations.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4 text-gray-400" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button disabled={!canSave} onClick={save}>Save</Button>
          </div>
        </Card>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{preview.name}</h3>
              <button type="button" onClick={() => setPreview(null)}><X className="h-4 w-4 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600">{preview.description || 'No descriptor stored for this criteria.'}</p>
            <p className="mt-2 text-xs text-gray-500">Applicable in: {preview.applicableIn}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppraisalTemplateMaster;
