import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';

const STORE = 'k12-appraisal-settings-v1';

type RolePerm = { role: string; create: string; rate: string; viewAll: string; approve: string; export: string };
type GradeBand = { id: string; label: string; min: number; max: number; result: 'Pass' | 'Fail' };

const RATE_OPTS = ['Yes', 'No', 'Self', 'Self + Peer', 'Teacher only'];
const VIEW_OPTS = ['Yes', 'No', 'Own Dept', 'Own only'];
const APPROVE_OPTS = ['Yes', 'No', 'First level', 'HOD level'];
const DEFAULT_GRADES: GradeBand[] = [
  { id: 'g1', label: 'Outstanding', min: 4.5, max: 5, result: 'Pass' },
  { id: 'g2', label: 'Very Good', min: 3.5, max: 4.49, result: 'Pass' },
  { id: 'g3', label: 'Satisfactory', min: 2.5, max: 3.49, result: 'Pass' },
  { id: 'g4', label: 'Needs Improvement', min: 1.5, max: 2.49, result: 'Fail' },
  { id: 'g5', label: 'Unsatisfactory', min: 0, max: 1.49, result: 'Fail' }
];

const DEFAULT_PERMS: RolePerm[] = [
  { role: 'HR Manager', create: 'Yes', rate: 'Yes', viewAll: 'Yes', approve: 'Yes', export: 'Yes' },
  { role: 'Principal', create: 'No', rate: 'Yes', viewAll: 'Yes', approve: 'Yes', export: 'Yes' },
  { role: 'Vice Principal', create: 'No', rate: 'Yes', viewAll: 'Own Dept', approve: 'HOD level', export: 'No' },
  { role: 'HOD', create: 'No', rate: 'Yes', viewAll: 'Own Dept', approve: 'First level', export: 'No' },
  { role: 'Teacher', create: 'No', rate: 'Self + Peer', viewAll: 'Own only', approve: 'No', export: 'No' },
  { role: 'Admin Staff', create: 'No', rate: 'Self', viewAll: 'Own only', approve: 'No', export: 'No' },
  { role: 'Student', create: 'No', rate: 'Teacher only', viewAll: 'No', approve: 'No', export: 'No' }
];

type Settings = {
  enabled: boolean;
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
  appraisalWf: string;
  feedbackWf: string;
  perms: RolePerm[];
  passMark: number;
  grades: GradeBand[];
};

const DEFAULT: Settings = {
  enabled: true,
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
  appraisalWf: 'School Appraisal Approval',
  feedbackWf: 'HOD Feedback Approval',
  perms: DEFAULT_PERMS,
  passMark: 2.5,
  grades: DEFAULT_GRADES
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
  const [s, setS] = useState<Settings>(() => {
    const loaded = load();
    return {
      ...loaded,
      perms: loaded.perms?.length ? loaded.perms : DEFAULT_PERMS,
      grades: loaded.grades?.length ? loaded.grades : DEFAULT_GRADES,
      passMark: loaded.passMark ?? 2.5
    };
  });
  const [notice, setNotice] = useState('');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  const save = () => {
    localStorage.setItem(STORE, JSON.stringify(s));
    flash('Appraisal settings saved. They govern all cycles until changed.');
  };

  const patchPerm = (i: number, key: keyof RolePerm, value: string) => {
    setS({ ...s, perms: s.perms.map((row, idx) => idx === i ? { ...row, [key]: value } : row) });
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

      <Card title="Grade scale (pass / fail)">
        <p className="mb-3 text-xs text-gray-500">School-wide grading system. Bands below the pass mark should be set to Fail. This replaces Rating Scale Master.</p>
        <Input label="Pass mark (minimum passing score)" type="number" value={String(s.passMark)} onChange={(e) => setS({ ...s, passMark: Number(e.target.value) })} />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Grade', 'Min', 'Max', 'Pass / Fail', ''].map((h) => <th key={h || 'g'} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {s.grades.map((g, i) => (
                <tr key={g.id} className="border-b">
                  <td className="px-2 py-2"><input className="w-full rounded border px-2 py-1" value={g.label} onChange={(e) => setS({ ...s, grades: s.grades.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x) })} /></td>
                  <td className="px-2 py-2"><input type="number" className="w-20 rounded border px-2 py-1" value={g.min} onChange={(e) => setS({ ...s, grades: s.grades.map((x, idx) => idx === i ? { ...x, min: Number(e.target.value) } : x) })} /></td>
                  <td className="px-2 py-2"><input type="number" className="w-20 rounded border px-2 py-1" value={g.max} onChange={(e) => setS({ ...s, grades: s.grades.map((x, idx) => idx === i ? { ...x, max: Number(e.target.value) } : x) })} /></td>
                  <td className="px-2 py-2">
                    <select className="rounded border px-2 py-1" value={g.result} onChange={(e) => setS({ ...s, grades: s.grades.map((x, idx) => idx === i ? { ...x, result: e.target.value as 'Pass' | 'Fail' } : x) })}>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                  </td>
                  <td className="px-2 py-2"><Button size="xs" variant="ghost" onClick={() => setS({ ...s, grades: s.grades.filter((_, idx) => idx !== i) })} disabled={s.grades.length <= 1}>Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button size="sm" className="mt-3" variant="outline" onClick={() => setS({ ...s, grades: [...s.grades, { id: `g-${Date.now()}`, label: 'New grade', min: 0, max: 0, result: 'Fail' }] })}>Add grade band</Button>
      </Card>

      <Card title="Role Permissions Matrix">
        <p className="mb-3 text-xs text-gray-500">Create Cycle and Export are Yes/No. Rate, View All Scores and Approve use a dropdown.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Role', 'Create Cycle', 'Rate', 'View All Scores', 'Approve', 'Export'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {s.perms.map((r, i) => (
                <tr key={r.role + i} className="border-b">
                  <td className="px-2 py-2"><input className="w-full rounded border px-2 py-1" value={r.role} onChange={(e) => patchPerm(i, 'role', e.target.value)} /></td>
                  <td className="px-2 py-2 text-center"><input type="checkbox" checked={r.create === 'Yes'} onChange={(e) => patchPerm(i, 'create', e.target.checked ? 'Yes' : 'No')} /></td>
                  <td className="px-2 py-2">
                    <select className="w-full rounded border px-2 py-1" value={r.rate} onChange={(e) => patchPerm(i, 'rate', e.target.value)}>
                      {RATE_OPTS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <select className="w-full rounded border px-2 py-1" value={r.viewAll} onChange={(e) => patchPerm(i, 'viewAll', e.target.value)}>
                      {VIEW_OPTS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <select className="w-full rounded border px-2 py-1" value={r.approve} onChange={(e) => patchPerm(i, 'approve', e.target.value)}>
                      {APPROVE_OPTS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-center"><input type="checkbox" checked={r.export === 'Yes'} onChange={(e) => patchPerm(i, 'export', e.target.checked ? 'Yes' : 'No')} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setS({ ...s, perms: [...s.perms, { role: 'New Role', create: 'No', rate: 'No', viewAll: 'No', approve: 'No', export: 'No' }] })}>Add Role</Button>
          <Button size="sm" variant="ghost" onClick={() => setS({ ...s, perms: s.perms.slice(0, -1) })} disabled={s.perms.length <= 1}>Remove Last Role</Button>
        </div>
      </Card>
    </div>
  );
}

export default AppraisalSettings;
