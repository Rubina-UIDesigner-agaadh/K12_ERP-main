import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';

const STORE = 'k12-appraisal-settings-v1';

type Band = { name: string; min: number; max: number; color: string; trigger: string };

const DEFAULT_BANDS: Band[] = [
  { name: 'Outstanding', min: 4.5, max: 5, color: 'Dark Green', trigger: 'Eligible for awards/promotion' },
  { name: 'Very Good', min: 3.5, max: 4.49, color: 'Light Green', trigger: 'Standard increment' },
  { name: 'Satisfactory', min: 2.5, max: 3.49, color: 'Yellow', trigger: 'No action required' },
  { name: 'Needs Improvement', min: 1.5, max: 2.49, color: 'Orange', trigger: 'Auto-triggers Training Recommendation' },
  { name: 'Unsatisfactory', min: 0, max: 1.49, color: 'Red', trigger: 'Auto-triggers Probation/PIP' }
];

type Settings = {
  enabled: boolean;
  scale: string;
  year: string;
  frequency: string;
  selfMandatory: boolean;
  minFeedback: number;
  studentFb: boolean;
  parentFb: boolean;
  anonPeer: boolean;
  anonStudent: boolean;
  goalDays: number;
  autoClose: boolean;
  email: boolean;
  customFormula: boolean;
  formula: string;
  bands: Band[];
  appraisalWf: string;
  feedbackWf: string;
};

const DEFAULT: Settings = {
  enabled: true,
  scale: '1–5',
  year: '2026-27',
  frequency: 'Annual',
  selfMandatory: true,
  minFeedback: 2,
  studentFb: true,
  parentFb: false,
  anonPeer: true,
  anonStudent: true,
  goalDays: 14,
  autoClose: true,
  email: true,
  customFormula: true,
  formula: '(goal_score × 0.30) + (manager_score × 0.30) + (feedback_score × 0.20) + (self_score × 0.10) + (student_score × 0.10)',
  bands: DEFAULT_BANDS,
  appraisalWf: 'School Appraisal Approval',
  feedbackWf: 'HOD Feedback Approval'
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

const VARS = ['goal_score', 'feedback_score', 'self_score', 'manager_score', 'student_score', 'parent_score'];

export function AppraisalSettings() {
  const [s, setS] = useState<Settings>(load);
  const [notice, setNotice] = useState('');
  const [g, setG] = useState('4');
  const [m, setM] = useState('4');
  const [f, setF] = useState('3.5');
  const [self, setSelf] = useState('4');
  const [st, setSt] = useState('3.8');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  const preview = () => {
    const goal = Number(g); const manager = Number(m); const feedback = Number(f); const selfS = Number(self); const student = Number(st);
    return Math.round((goal * 0.3 + manager * 0.3 + feedback * 0.2 + selfS * 0.1 + student * 0.1) * 100) / 100;
  };
  const score = preview();
  const band = s.bands.find((b) => score >= b.min && score <= b.max);

  const validateBands = () => {
    const sorted = [...s.bands].sort((a, b) => a.min - b.min);
    if (sorted[0].min > 0) return 'Bands must start at 0.';
    if (sorted[sorted.length - 1].max < 5) return 'Bands must cover up to 5.';
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].min - sorted[i - 1].max > 0.011) return 'Gap between bands.';
      if (sorted[i].min <= sorted[i - 1].max && Math.abs(sorted[i].min - sorted[i - 1].max) > 0.02 && sorted[i].min < sorted[i - 1].max) return 'Overlapping bands.';
    }
    return '';
  };

  const save = () => {
    const err = validateBands();
    if (err) { flash(err); return; }
    localStorage.setItem(STORE, JSON.stringify(s));
    flash('Appraisal settings saved. They govern all cycles until changed.');
  };

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Settings</h1>
          <p className="text-sm text-gray-500">Set once. Governs how all appraisal cycles across the school behave. Configure before any cycle is created.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={save}>Save Settings</Button>
          <Button onClick={() => flash('Open Appraisal Cycle Master to create the first cycle.')}>Create First Cycle</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card title="General Appraisal Configuration">
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle label="Enable Appraisal Module" checked={s.enabled} onChange={(v) => setS({ ...s, enabled: v })} />
          <Select label="Default Rating Scale" value={s.scale} onChange={(e) => setS({ ...s, scale: typeof e === 'string' ? e : e.target.value })} options={['1–5', '1–10', 'Grade A–E'].map((v) => ({ value: v, label: v }))} />
          <Select label="Academic Year" value={s.year} onChange={(e) => setS({ ...s, year: typeof e === 'string' ? e : e.target.value })} options={[{ value: '2026-27', label: '2026-27' }, { value: '2025-26', label: '2025-26' }]} />
          <Select label="Default Appraisal Frequency" value={s.frequency} onChange={(e) => setS({ ...s, frequency: typeof e === 'string' ? e : e.target.value })} options={['Annual', 'Bi-Annual', 'Term-wise'].map((v) => ({ value: v, label: v }))} />
          <Toggle label="Self-Appraisal Mandatory" checked={s.selfMandatory} onChange={(v) => setS({ ...s, selfMandatory: v })} />
          <Input label="Minimum Feedback Count" type="number" value={String(s.minFeedback)} onChange={(e) => setS({ ...s, minFeedback: Number(e.target.value) })} />
          <Toggle label="Allow Student Feedback" checked={s.studentFb} onChange={(v) => setS({ ...s, studentFb: v })} />
          <Toggle label="Allow Parent Feedback" checked={s.parentFb} onChange={(v) => setS({ ...s, parentFb: v })} />
          <Toggle label="Anonymize Peer Feedback" checked={s.anonPeer} onChange={(v) => setS({ ...s, anonPeer: v })} />
          <Toggle label="Anonymize Student Feedback" checked={s.anonStudent} onChange={(v) => setS({ ...s, anonStudent: v })} />
          <Input label="Goal Setting Deadline (days before cycle start)" type="number" value={String(s.goalDays)} onChange={(e) => setS({ ...s, goalDays: Number(e.target.value) })} />
          <Toggle label="Auto-Close Cycle After End Date" checked={s.autoClose} onChange={(v) => setS({ ...s, autoClose: v })} />
          <Toggle label="Email Notifications" checked={s.email} onChange={(v) => setS({ ...s, email: v })} />
        </div>
      </Card>

      <Card title="Score Formula Defaults">
        <Toggle label="Use Custom Formula (school-wide default)" checked={s.customFormula} onChange={(v) => setS({ ...s, customFormula: v })} />
        {s.customFormula && <Textarea className="mt-3" label="Default Formula" rows={3} value={s.formula} onChange={(e) => setS({ ...s, formula: e.target.value })} />}
        <p className="mt-3 text-xs text-gray-500">Variables: {VARS.join(', ')}</p>
        <div className="mt-4 overflow-x-auto">
          <p className="mb-2 text-sm font-semibold">Performance bands</p>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Band', 'Min', 'Max', 'Color', 'Action trigger'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {s.bands.map((b, i) => (
                <tr key={b.name} className="border-b">
                  <td className="px-2 py-2">{b.name}</td>
                  <td className="px-2 py-2"><input type="number" className="w-20 rounded border px-1" value={b.min} onChange={(e) => setS({ ...s, bands: s.bands.map((x, j) => j === i ? { ...x, min: Number(e.target.value) } : x) })} /></td>
                  <td className="px-2 py-2"><input type="number" className="w-20 rounded border px-1" value={b.max} onChange={(e) => setS({ ...s, bands: s.bands.map((x, j) => j === i ? { ...x, max: Number(e.target.value) } : x) })} /></td>
                  <td className="px-2 py-2">{b.color}</td>
                  <td className="px-2 py-2 text-xs">{b.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold">Preview calculator</p>
          <div className="grid gap-2 md:grid-cols-5">
            {[['Goal', g, setG], ['Manager', m, setM], ['Feedback', f, setF], ['Self', self, setSelf], ['Student', st, setSt]].map(([l, v, set]) => (
              <Input key={String(l)} label={String(l)} type="number" value={String(v)} onChange={(e) => (set as (n: string) => void)(e.target.value)} />
            ))}
          </div>
          <p className="mt-3 text-sm">Final score <b>{score}</b> · Band <Badge variant={score >= 3.5 ? 'success' : score >= 2.5 ? 'warning' : 'danger'}>{band?.name || '—'}</Badge></p>
        </div>
      </Card>

      <Card title="Workflow Configuration">
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Appraisal Approval Workflow" value={s.appraisalWf} onChange={(e) => setS({ ...s, appraisalWf: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'School Appraisal Approval', label: 'School Appraisal Approval' }]} />
          <Select label="Feedback Approval Workflow" value={s.feedbackWf} onChange={(e) => setS({ ...s, feedbackWf: typeof e === 'string' ? e : e.target.value })} options={[{ value: 'HOD Feedback Approval', label: 'HOD Feedback Approval' }, { value: '', label: 'None' }]} />
        </div>
        <div className="mt-4 overflow-x-auto text-xs">
          <p className="mb-2 font-semibold text-sm">Workflow preview</p>
          <p>Draft → Self-Appraisal Completed → HOD Review Pending → Principal Review Pending → Approved (Locked)</p>
          <p className="text-gray-500">HOD or Principal may return for revision.</p>
        </div>
      </Card>

      <Card title="Role Permissions Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Role', 'Create Cycle', 'Rate', 'View All Scores', 'Approve', 'Export'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['HR Manager', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
                ['Principal', 'No', 'Yes', 'Yes', 'Yes', 'Yes'],
                ['Vice Principal', 'No', 'Yes', 'Own Dept', 'HOD level', 'No'],
                ['HOD', 'No', 'Yes', 'Own Dept', 'First level', 'No'],
                ['Teacher', 'No', 'Self + Peer', 'Own only', 'No', 'No'],
                ['Admin Staff', 'No', 'Self', 'Own only', 'No', 'No'],
                ['Student', 'No', 'Teacher only', 'No', 'No', 'No']
              ].map((r) => (
                <tr key={r[0]} className="border-b">
                  {r.map((c) => <td key={c} className="px-2 py-2">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AppraisalSettings;
