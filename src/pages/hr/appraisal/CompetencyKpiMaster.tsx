import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Archive, Plus, Search } from 'lucide-react';

export const KRA_STORE = 'k12-appraisal-kra-v1';
export const FEEDBACK_STORE = 'k12-appraisal-feedback-v1';

const DESIGNATIONS = ['PGT', 'TGT', 'PRT', 'Lab Assistant', 'Principal', 'Vice Principal', 'HOD', 'Clerk', 'Accountant', 'Class Teacher'];
const KRA_CATEGORIES = ['Academic', 'Co-Curricular', 'Administrative', 'Compliance', 'Leadership', 'Professional Development'];
const METHODS = ['Quantitative (Score-based)', 'Qualitative (Reviewer-rated)', 'Hybrid'];
const CRITERIA_CATEGORIES = ['Behavioral', 'Academic', 'Professional', 'Leadership', 'Compliance', 'Administrative'];
const APPLICABLE_IN = ['Self Appraisal', 'Peer Feedback', 'Manager Feedback', 'All'];
const SCALES = ['1–5 Stars', '1–10 Scale', 'Yes/No', 'Descriptive Only'];

export type KraRecord = {
  id: string;
  name: string;
  category: string;
  designations: string[];
  description: string;
  method: string;
  maxScore: number;
  cbse: boolean;
  archived: boolean;
};

export type FeedbackRecord = {
  id: string;
  name: string;
  category: string;
  applicableIn: string[];
  scale: string;
  weightage: number;
  description: string;
  mandatory: boolean;
  archived: boolean;
};

const SEED_KRAS: KraRecord[] = [
  { id: 'KRA-001', name: 'Student Academic Outcome', category: 'Academic', designations: ['PGT', 'TGT', 'PRT'], description: 'Measured by class pass percentage in terminal exams, improvement over previous year, and failure case resolution.', method: 'Quantitative (Score-based)', maxScore: 10, cbse: false, archived: false },
  { id: 'KRA-002', name: 'Classroom Delivery Quality', category: 'Academic', designations: ['PGT', 'TGT', 'PRT'], description: 'Lesson delivery, pedagogy and classroom observation ratings.', method: 'Hybrid', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-003', name: 'Student Attendance in Class', category: 'Academic', designations: ['PGT', 'TGT', 'PRT'], description: 'Class attendance percentage against working days.', method: 'Quantitative (Score-based)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-004', name: 'Co-Curricular Contribution', category: 'Co-Curricular', designations: ['PGT', 'TGT', 'PRT', 'Class Teacher'], description: 'Events, clubs and activity contribution.', method: 'Qualitative (Reviewer-rated)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-005', name: 'Parent Communication Quality', category: 'Academic', designations: ['PGT', 'TGT', 'PRT'], description: 'Timely, professional parent interaction.', method: 'Qualitative (Reviewer-rated)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-006', name: 'Lesson Plan Adherence', category: 'Academic', designations: ['PGT', 'TGT', 'PRT'], description: 'Plans submitted and followed as per academic calendar.', method: 'Quantitative (Score-based)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-007', name: 'CBSE Compliance & Documentation', category: 'Compliance', designations: ['PGT', 'TGT', 'PRT', 'Principal', 'Vice Principal', 'Clerk'], description: 'Mandatory board documentation and compliance evidence.', method: 'Qualitative (Reviewer-rated)', maxScore: 5, cbse: true, archived: false },
  { id: 'KRA-008', name: 'Administrative Task Completion', category: 'Administrative', designations: ['Clerk', 'Accountant'], description: 'On-time completion of assigned administrative tasks.', method: 'Quantitative (Score-based)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-009', name: 'Department Leadership', category: 'Leadership', designations: ['HOD', 'Principal', 'Vice Principal'], description: 'Department planning, mentoring and outcomes.', method: 'Qualitative (Reviewer-rated)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-010', name: 'Professional Development', category: 'Professional Development', designations: DESIGNATIONS, description: 'Training hours, certifications and applied learning.', method: 'Qualitative (Reviewer-rated)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-011', name: 'Fee Collection Support', category: 'Administrative', designations: ['Clerk', 'Accountant'], description: 'Support to fee follow-up without independent collection policy changes.', method: 'Quantitative (Score-based)', maxScore: 5, cbse: false, archived: false },
  { id: 'KRA-012', name: 'Student Discipline Management', category: 'Academic', designations: ['Class Teacher'], description: 'Incident handling and classroom discipline.', method: 'Hybrid', maxScore: 5, cbse: false, archived: false }
];

const SEED_CRITERIA: FeedbackRecord[] = [
  { id: 'FC-001', name: 'Punctuality & Regularity', category: 'Behavioral', applicableIn: ['All'], scale: '1–5 Stars', weightage: 10, description: '5 = Consistently exceeds expectations; 1 = Does not meet basic requirements.', mandatory: true, archived: false },
  { id: 'FC-002', name: 'Subject Knowledge Depth', category: 'Academic', applicableIn: ['Manager Feedback', 'Self Appraisal'], scale: '1–5 Stars', weightage: 20, description: 'Depth and currency of subject expertise.', mandatory: true, archived: false },
  { id: 'FC-003', name: 'Student Engagement & Pedagogy', category: 'Academic', applicableIn: ['Manager Feedback', 'Peer Feedback'], scale: '1–5 Stars', weightage: 20, description: 'Ability to involve students in learning.', mandatory: true, archived: false },
  { id: 'FC-004', name: 'Classroom Management', category: 'Academic', applicableIn: ['Manager Feedback'], scale: '1–5 Stars', weightage: 15, description: 'Discipline, time and learning climate.', mandatory: true, archived: false },
  { id: 'FC-005', name: 'Communication with Parents', category: 'Professional', applicableIn: ['Manager Feedback', 'Self Appraisal'], scale: '1–5 Stars', weightage: 15, description: 'Clarity and professionalism with parents.', mandatory: false, archived: false },
  { id: 'FC-006', name: 'Team Collaboration', category: 'Behavioral', applicableIn: ['Peer Feedback', 'Self Appraisal'], scale: '1–5 Stars', weightage: 10, description: 'Works effectively with colleagues.', mandatory: false, archived: false },
  { id: 'FC-007', name: 'Adherence to School Policies', category: 'Compliance', applicableIn: ['All'], scale: '1–5 Stars', weightage: 10, description: 'Follows school and board policy.', mandatory: true, archived: false },
  { id: 'FC-008', name: 'Initiative & Innovation', category: 'Professional', applicableIn: ['All'], scale: '1–5 Stars', weightage: 10, description: 'Proactive improvement of work.', mandatory: false, archived: false },
  { id: 'FC-009', name: 'Leadership Ability', category: 'Leadership', applicableIn: ['Manager Feedback'], scale: '1–5 Stars', weightage: 10, description: 'For HOD / Principal roles.', mandatory: false, archived: false },
  { id: 'FC-010', name: 'Professional Development Effort', category: 'Professional', applicableIn: ['Self Appraisal'], scale: '1–5 Stars', weightage: 10, description: 'Visible learning and application.', mandatory: false, archived: false },
  { id: 'FC-011', name: 'Administrative Accuracy', category: 'Administrative', applicableIn: ['Manager Feedback'], scale: '1–5 Stars', weightage: 15, description: 'Accuracy of records and returns.', mandatory: true, archived: false },
  { id: 'FC-012', name: 'Student Welfare Sensitivity', category: 'Academic', applicableIn: ['Manager Feedback', 'Self Appraisal'], scale: '1–5 Stars', weightage: 10, description: 'Care and safeguarding awareness.', mandatory: true, archived: false }
];

function loadJson<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function saveJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const emptyKra = (): KraRecord => ({
  id: '',
  name: '',
  category: 'Academic',
  designations: [],
  description: '',
  method: 'Quantitative (Score-based)',
  maxScore: 5,
  cbse: false,
  archived: false
});

const emptyCriteria = (): FeedbackRecord => ({
  id: '',
  name: '',
  category: 'Behavioral',
  applicableIn: ['All'],
  scale: '1–5 Stars',
  weightage: 10,
  description: '',
  mandatory: false,
  archived: false
});

export function CompetencyKpiMaster() {
  const [section, setSection] = useState<'kra' | 'feedback'>('kra');
  const [kras, setKras] = useState<KraRecord[]>(() => loadJson(KRA_STORE, SEED_KRAS));
  const [criteria, setCriteria] = useState<FeedbackRecord[]>(() => loadJson(FEEDBACK_STORE, SEED_CRITERIA));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [designation, setDesignation] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [kraForm, setKraForm] = useState<KraRecord>(emptyKra);
  const [critForm, setCritForm] = useState<FeedbackRecord>(emptyCriteria);
  const [notice, setNotice] = useState('');

  useEffect(() => { saveJson(KRA_STORE, kras); }, [kras]);
  useEffect(() => { saveJson(FEEDBACK_STORE, criteria); }, [criteria]);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const filteredKras = useMemo(() => kras.filter((row) => {
    if (category && row.category !== category) return false;
    if (designation && !row.designations.includes(designation)) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${row.name} ${row.category} ${row.designations.join(' ')}`.toLowerCase().includes(q)) return false;
    return true;
  }), [kras, category, designation, search]);

  const filteredCriteria = useMemo(() => criteria.filter((row) => {
    if (roleFilter && !row.applicableIn.includes(roleFilter) && !row.applicableIn.includes('All')) return false;
    const q = search.trim().toLowerCase();
    if (q && !`${row.name} ${row.category}`.toLowerCase().includes(q)) return false;
    return true;
  }), [criteria, roleFilter, search]);

  const saveKra = () => {
    if (!kraForm.name.trim()) {
      flash('KRA Name is mandatory and must be unique.');
      return;
    }
    if (kras.some((row) => row.name.toLowerCase() === kraForm.name.trim().toLowerCase() && row.id !== kraForm.id)) {
      flash('KRA Name must be unique.');
      return;
    }
    const next = kraForm.id ? kras.map((row) => (row.id === kraForm.id ? kraForm : row)) : [{ ...kraForm, id: `KRA-${Date.now()}` }, ...kras];
    setKras(next);
    setShowForm(false);
    flash(kraForm.designations.length
      ? `KRA saved. It will be auto-suggested for ${kraForm.designations.length} designation(s) in Appraisal Templates.`
      : 'KRA saved.');
  };

  const saveCriteria = () => {
    if (!critForm.name.trim()) {
      flash('Criteria Name is mandatory.');
      return;
    }
    const next = critForm.id ? criteria.map((row) => (row.id === critForm.id ? critForm : row)) : [{ ...critForm, id: `FC-${Date.now()}` }, ...criteria];
    setCriteria(next);
    setShowForm(false);
    flash('Feedback criteria saved. Use it on Appraisal Template before any cycle.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competency & KPI Master</h1>
          <p className="text-sm text-gray-500">Define KRAs and Employee Feedback Criteria before any appraisal template or cycle. Archived items stay on historical appraisals only.</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            if (section === 'kra') { setKraForm(emptyKra()); setShowForm(true); }
            else { setCritForm(emptyCriteria()); setShowForm(true); }
          }}><Plus className="mr-1 h-4 w-4" />{section === 'kra' ? 'New KRA' : 'New Criteria'}</Button>
        )}
      </div>

      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex gap-1 border-b border-gray-200 bg-white">
        {[{ id: 'kra' as const, label: 'KRA Master' }, { id: 'feedback' as const, label: 'Employee Feedback Criteria' }].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => { setSection(item.id); setShowForm(false); setSearch(''); setSelected([]); }}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${section === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {section === 'kra' && !showForm && (
        <>
          <Card>
            <div className="grid gap-3 p-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search KRA, department or category" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
              </div>
              <Select label="Category" value={category} onChange={(e) => setCategory(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All categories' }, ...KRA_CATEGORIES.map((v) => ({ value: v, label: v }))]} />
              <Select label="Applicable To" value={designation} onChange={(e) => setDesignation(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All designations' }, ...DESIGNATIONS.map((v) => ({ value: v, label: v }))]} />
            </div>
            {selected.length > 0 && (
              <div className="border-t px-4 py-3">
                <Button size="sm" variant="outline" onClick={() => {
                  setKras((prev) => prev.map((row) => selected.includes(row.id) ? { ...row, archived: true } : row));
                  setSelected([]);
                  flash(`${selected.length} KRA(s) archived. They are excluded from new templates.`);
                }}><Archive className="mr-1 h-4 w-4" />Bulk Archive</Button>
              </div>
            )}
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2"><input type="checkbox" checked={filteredKras.length > 0 && filteredKras.every((r) => selected.includes(r.id))} onChange={(e) => setSelected(e.target.checked ? filteredKras.map((r) => r.id) : [])} /></th>
                    {['KRA Name', 'Category', 'Applicable To', 'Method', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredKras.map((row) => (
                    <tr key={row.id} className="cursor-pointer border-b border-gray-100 hover:bg-gray-50" onClick={() => { setKraForm(row); setShowForm(true); }}>
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.includes(row.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id))} /></td>
                      <td className="px-3 py-2 font-medium">{row.name} {row.cbse && <Badge variant="warning">CBSE</Badge>}</td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2 text-xs">{row.designations.join(', ') || '—'}</td>
                      <td className="px-3 py-2 text-xs">{row.method}</td>
                      <td className="px-3 py-2"><Badge variant={row.archived ? 'secondary' : 'success'}>{row.archived ? 'Archived' : 'Active'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'kra' && showForm && (
        <Card title={kraForm.id ? 'Edit KRA' : 'New KRA'}>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <Input label="KRA Name *" value={kraForm.name} onChange={(e) => setKraForm({ ...kraForm, name: e.target.value })} placeholder="Student Academic Outcome" />
            <Select label="Category" value={kraForm.category} onChange={(e) => setKraForm({ ...kraForm, category: typeof e === 'string' ? e : e.target.value })} options={KRA_CATEGORIES.map((v) => ({ value: v, label: v }))} />
            <div className="md:col-span-2">
              <MultiSelect label="Applicable Designations" options={DESIGNATIONS.map((v) => ({ value: v, label: v }))} value={kraForm.designations} onChange={(values) => setKraForm({ ...kraForm, designations: values })} placeholder="PGT, TGT, Principal…" />
            </div>
            <div className="md:col-span-2"><Textarea label="Description" rows={3} value={kraForm.description} onChange={(e) => setKraForm({ ...kraForm, description: e.target.value })} /></div>
            <Select label="Measurement Method" value={kraForm.method} onChange={(e) => setKraForm({ ...kraForm, method: typeof e === 'string' ? e : e.target.value })} options={METHODS.map((v) => ({ value: v, label: v }))} />
            <Input label="Maximum Score" type="number" value={String(kraForm.maxScore)} onChange={(e) => setKraForm({ ...kraForm, maxScore: Number(e.target.value) })} helperText="Default 5. Academic KRAs may use 10." />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={kraForm.cbse} onChange={(e) => setKraForm({ ...kraForm, cbse: e.target.checked })} /> Is CBSE Compliance KRA (mandatory on templates, cannot be removed)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={kraForm.archived} onChange={(e) => setKraForm({ ...kraForm, archived: e.target.checked })} /> Archived</label>
          </div>
          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={saveKra}>Save</Button>
          </div>
        </Card>
      )}

      {section === 'feedback' && !showForm && (
        <>
          <Card>
            <div className="grid gap-3 p-4 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search criteria" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
              </div>
              <Select label="Applicable Role" value={roleFilter} onChange={(e) => setRoleFilter(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All roles' }, { value: 'Self Appraisal', label: 'Self' }, { value: 'Peer Feedback', label: 'Peer' }, { value: 'Manager Feedback', label: 'Reviewer / Manager' }]} />
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    {['Criteria Name', 'Category', 'Applicable To', 'Weightage', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredCriteria.map((row) => (
                    <tr key={row.id} className="cursor-pointer border-b border-gray-100 hover:bg-gray-50" onClick={() => { setCritForm(row); setShowForm(true); }}>
                      <td className="px-3 py-2 font-medium">{row.name}</td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2 text-xs">{row.applicableIn.join(', ')}</td>
                      <td className="px-3 py-2">{row.weightage}%</td>
                      <td className="px-3 py-2"><Badge variant={row.archived ? 'secondary' : 'success'}>{row.archived ? 'Archived' : 'Active'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'feedback' && showForm && (
        <Card title={critForm.id ? 'Edit Feedback Criteria' : 'New Feedback Criteria'}>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <Input label="Criteria Name *" value={critForm.name} onChange={(e) => setCritForm({ ...critForm, name: e.target.value })} />
            <Select label="Category" value={critForm.category} onChange={(e) => setCritForm({ ...critForm, category: typeof e === 'string' ? e : e.target.value })} options={CRITERIA_CATEGORIES.map((v) => ({ value: v, label: v }))} />
            <div className="md:col-span-2">
              <MultiSelect label="Applicable In" options={APPLICABLE_IN.map((v) => ({ value: v, label: v }))} value={critForm.applicableIn} onChange={(values) => setCritForm({ ...critForm, applicableIn: values })} />
            </div>
            <Select label="Rating Scale" value={critForm.scale} onChange={(e) => setCritForm({ ...critForm, scale: typeof e === 'string' ? e : e.target.value })} options={SCALES.map((v) => ({ value: v, label: v }))} />
            <Input label="Weightage (%)" type="number" value={String(critForm.weightage)} onChange={(e) => setCritForm({ ...critForm, weightage: Number(e.target.value) })} helperText="Template total must reach 100%." />
            <div className="md:col-span-2"><Textarea label="Description / Descriptor" rows={3} value={critForm.description} onChange={(e) => setCritForm({ ...critForm, description: e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={critForm.mandatory} onChange={(e) => setCritForm({ ...critForm, mandatory: e.target.checked })} /> Is Mandatory</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={critForm.archived} onChange={(e) => setCritForm({ ...critForm, archived: e.target.checked })} /> Archived</label>
          </div>
          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={saveCriteria}>Save</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default CompetencyKpiMaster;
