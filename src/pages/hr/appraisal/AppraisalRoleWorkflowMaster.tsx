import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Trash2, ArrowRight, CheckCircle, Clock, Users, Shield, UserCheck, Settings, GitBranch } from 'lucide-react';

const STORE = 'k12-appraisal-workflow-v1';
const ROLES = ['Employee', 'Students', 'Peer Teachers', 'HOD / Manager', 'Department Head', 'Reporting Manager', 'Principal / HR', 'HR Head'];
const APPLICABLE = ['Teaching Staff', 'Administrative Staff', 'Probation Employees', 'All Staff', 'Management'];

interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  role: string;
  action: string;
  deadline: string;
  canSkip: boolean;
  autoEscalate: boolean;
  escalateAfterHours: number;
}
interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft';
  applicableTo: string;
  steps: WorkflowStep[];
  usedIn: number;
}

const SEED: Workflow[] = [
  {
    id: 'WF001',
    name: 'Standard Teaching Staff Workflow',
    description: 'Full 5-step appraisal process for teaching staff',
    status: 'Active',
    applicableTo: 'Teaching Staff',
    usedIn: 2,
    steps: [
      { id: 'S1', order: 1, name: 'Self Appraisal', role: 'Employee', action: 'Complete self-assessment form', deadline: '14 days', canSkip: false, autoEscalate: true, escalateAfterHours: 336 },
      { id: 'S2', order: 2, name: 'Student Feedback', role: 'Students', action: 'Submit anonymous feedback', deadline: '7 days', canSkip: true, autoEscalate: false, escalateAfterHours: 0 },
      { id: 'S3', order: 3, name: 'Peer Review', role: 'Peer Teachers', action: 'Submit peer feedback', deadline: '7 days', canSkip: true, autoEscalate: false, escalateAfterHours: 0 },
      { id: 'S4', order: 4, name: 'Manager Review', role: 'HOD / Manager', action: 'Review and rate employee', deadline: '14 days', canSkip: false, autoEscalate: true, escalateAfterHours: 336 },
      { id: 'S5', order: 5, name: 'Calibration & Publish', role: 'Principal / HR', action: 'Calibrate scores and publish results', deadline: '7 days', canSkip: false, autoEscalate: true, escalateAfterHours: 168 }
    ]
  },
  {
    id: 'WF002',
    name: 'Admin Staff Simplified Workflow',
    description: '3-step simplified process for administrative staff',
    status: 'Active',
    applicableTo: 'Administrative Staff',
    usedIn: 1,
    steps: [
      { id: 'S1', order: 1, name: 'Self Appraisal', role: 'Employee', action: 'Complete self-assessment', deadline: '14 days', canSkip: false, autoEscalate: true, escalateAfterHours: 336 },
      { id: 'S2', order: 2, name: 'Manager Review', role: 'Department Head', action: 'Review and rate', deadline: '14 days', canSkip: false, autoEscalate: true, escalateAfterHours: 336 },
      { id: 'S3', order: 3, name: 'HR Approval', role: 'HR Head', action: 'Final approval and publish', deadline: '7 days', canSkip: false, autoEscalate: true, escalateAfterHours: 168 }
    ]
  },
  {
    id: 'WF003',
    name: 'Probation Review Workflow',
    description: 'Quick review for employees on probation',
    status: 'Draft',
    applicableTo: 'Probation Employees',
    usedIn: 0,
    steps: [
      { id: 'S1', order: 1, name: 'Self Assessment', role: 'Employee', action: 'Complete probation self-review', deadline: '7 days', canSkip: false, autoEscalate: true, escalateAfterHours: 168 },
      { id: 'S2', order: 2, name: 'Manager Assessment', role: 'Reporting Manager', action: 'Evaluate probation performance', deadline: '7 days', canSkip: false, autoEscalate: true, escalateAfterHours: 168 },
      { id: 'S3', order: 3, name: 'HR Decision', role: 'HR Head', action: 'Confirm / Extend / Terminate', deadline: '3 days', canSkip: false, autoEscalate: true, escalateAfterHours: 72 }
    ]
  }
];

const emptyStep = (order: number): WorkflowStep => ({
  id: `S-${Date.now()}-${order}`,
  order,
  name: '',
  role: 'Employee',
  action: '',
  deadline: '7 days',
  canSkip: false,
  autoEscalate: false,
  escalateAfterHours: 168
});

const emptyWorkflow = (): Workflow => ({
  id: '',
  name: '',
  description: '',
  status: 'Draft',
  applicableTo: 'Teaching Staff',
  usedIn: 0,
  steps: [emptyStep(1)]
});

function load(): Workflow[] {
  try {
    const raw = localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) as Workflow[] : null;
    return parsed?.length ? parsed : SEED;
  } catch {
    return SEED;
  }
}

const roleIcon = (role: string) => {
  if (role.includes('Employee')) return <Users className="w-4 h-4 text-blue-500" />;
  if (role.includes('Student')) return <Users className="w-4 h-4 text-green-500" />;
  if (role.includes('Peer')) return <UserCheck className="w-4 h-4 text-purple-500" />;
  if (role.includes('Manager') || role.includes('HOD') || role.includes('Head')) return <Shield className="w-4 h-4 text-amber-500" />;
  return <Shield className="w-4 h-4 text-red-500" />;
};

export function AppraisalRoleWorkflowMaster() {
  const [workflows, setWorkflows] = useState<Workflow[]>(load);
  const [expandedWf, setExpandedWf] = useState<string | null>('WF001');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };
  const persist = (next: Workflow[]) => {
    setWorkflows(next);
    localStorage.setItem(STORE, JSON.stringify(next));
  };

  const filtered = workflows.filter((w) => `${w.name} ${w.applicableTo} ${w.description}`.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) { flash('Workflow name is required.'); return; }
    if (!editing.steps.length) { flash('Add at least one step.'); return; }
    if (editing.steps.some((s) => !s.name.trim() || !s.action.trim())) { flash('Each step needs a name and action.'); return; }
    const record = {
      ...editing,
      id: editing.id || `WF-${Date.now()}`,
      steps: editing.steps.map((s, i) => ({ ...s, order: i + 1 }))
    };
    persist(editing.id ? workflows.map((w) => w.id === editing.id ? record : w) : [record, ...workflows]);
    setEditing(null);
    setExpandedWf(record.id);
    flash(editing.id ? 'Workflow updated.' : 'Workflow created.');
  };

  const remove = () => {
    if (!deleteId) return;
    const row = workflows.find((w) => w.id === deleteId);
    if (row && row.usedIn > 0) { flash(`Cannot delete. Used in ${row.usedIn} active cycle(s). Set to Draft instead.`); setDeleteId(null); return; }
    persist(workflows.filter((w) => w.id !== deleteId));
    if (expandedWf === deleteId) setExpandedWf(null);
    setDeleteId(null);
    flash('Workflow deleted.');
  };

  const toggleStatus = (id: string) => {
    persist(workflows.map((w) => w.id === id ? { ...w, status: w.status === 'Active' ? 'Draft' : 'Active' } : w));
    flash('Status updated.');
  };

  const patchStep = (i: number, patch: Partial<WorkflowStep>) => {
    if (!editing) return;
    setEditing({ ...editing, steps: editing.steps.map((s, idx) => idx === i ? { ...s, ...patch } : s) });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisal Role & Workflow Master</h1>
          <p className="text-sm text-gray-500">Design multi-step approval workflows for appraisal processes</p>
        </div>
        <Button onClick={() => setEditing(emptyWorkflow())}><Plus className="w-4 h-4 mr-2" />Create Workflow</Button>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><GitBranch className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold">{workflows.length}</p><p className="text-xs text-gray-500">Workflows</p></div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xl font-bold">{workflows.filter((w) => w.status === 'Active').length}</p><p className="text-xs text-gray-500">Active</p></div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Settings className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold">{workflows.reduce((s, w) => s + w.steps.length, 0)}</p><p className="text-xs text-gray-500">Total Steps</p></div>
        </div>
      </div>

      <div className="relative">
        <input type="text" placeholder="Search workflows..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="space-y-4">
        {filtered.map((wf) => (
          <Card key={wf.id}>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => setExpandedWf(expandedWf === wf.id ? null : wf.id)} className="flex flex-1 items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center"><GitBranch className="w-6 h-6 text-indigo-600" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{wf.name}</h3>
                  <p className="text-sm text-gray-500">{wf.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant={wf.status === 'Active' ? 'success' : 'secondary'}>{wf.status}</Badge>
                    <Badge variant="secondary">{wf.applicableTo}</Badge>
                    <span className="text-xs text-gray-500">{wf.steps.length} steps · Used in {wf.usedIn} cycles</span>
                  </div>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <Button size="xs" variant="outline" onClick={() => toggleStatus(wf.id)}>{wf.status === 'Active' ? 'Set Draft' : 'Activate'}</Button>
                <Button size="xs" variant="outline" onClick={() => setEditing({ ...wf, steps: wf.steps.map((s) => ({ ...s })) })}>Edit</Button>
                <Button size="xs" variant="ghost" onClick={() => setDeleteId(wf.id)}>Delete</Button>
              </div>
            </div>
            {expandedWf === wf.id && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="mb-6 flex items-center justify-center gap-2 overflow-x-auto py-2">
                  {wf.steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                      <div className="flex min-w-[120px] flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{step.order}</div>
                        <p className="mt-2 text-center text-xs font-semibold text-gray-900">{step.name}</p>
                        <p className="text-center text-xs text-gray-500">{step.role}</p>
                      </div>
                      {i < wf.steps.length - 1 && <ArrowRight className="h-5 w-5 flex-shrink-0 text-gray-300" />}
                    </React.Fragment>
                  ))}
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      {['#', 'Step Name', 'Assigned Role', 'Action Required', 'Deadline', 'Skippable', 'Auto Escalate'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {wf.steps.map((step) => (
                      <tr key={step.id} className="border-b border-gray-100">
                        <td className="px-3 py-3 text-center text-sm font-bold">{step.order}</td>
                        <td className="px-3 py-3 text-sm font-medium">{step.name}</td>
                        <td className="px-3 py-3"><div className="flex items-center gap-2">{roleIcon(step.role)}<span className="text-sm">{step.role}</span></div></td>
                        <td className="px-3 py-3 text-sm text-gray-600">{step.action}</td>
                        <td className="px-3 py-3 text-center"><div className="flex items-center justify-center gap-1"><Clock className="h-3 w-3 text-gray-400" /><span className="text-sm">{step.deadline}</span></div></td>
                        <td className="px-3 py-3 text-center">{step.canSkip ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-3 text-center">{step.autoEscalate ? `${step.escalateAfterHours}h` : 'Off'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-500">No workflows match the search.</p>}
      </div>

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit workflow' : 'Create workflow'} size="xl" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save Workflow</Button></div>}>
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Workflow name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Select label="Applicable to" value={editing.applicableTo} onChange={(e) => setEditing({ ...editing, applicableTo: typeof e === 'string' ? e : e.target.value })} options={APPLICABLE.map((v) => ({ value: v, label: v }))} />
              <Select label="Status" value={editing.status} onChange={(e) => setEditing({ ...editing, status: (typeof e === 'string' ? e : e.target.value) as Workflow['status'] })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Active', label: 'Active' }]} />
              <div className="md:col-span-2"><Textarea label="Description" rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Steps</p>
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, steps: [...editing.steps, emptyStep(editing.steps.length + 1)] })}>Add Step</Button>
            </div>
            <div className="space-y-3">
              {editing.steps.map((step, i) => (
                <div key={step.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase text-gray-500">Step {i + 1}</p>
                    <button type="button" onClick={() => setEditing({ ...editing, steps: editing.steps.filter((_, idx) => idx !== i) })} disabled={editing.steps.length <= 1}><Trash2 className="h-4 w-4 text-gray-400" /></button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input label="Step name *" value={step.name} onChange={(e) => patchStep(i, { name: e.target.value })} />
                    <Select label="Assigned role" value={step.role} onChange={(e) => patchStep(i, { role: typeof e === 'string' ? e : e.target.value })} options={ROLES.map((v) => ({ value: v, label: v }))} />
                    <Input label="Action required *" value={step.action} onChange={(e) => patchStep(i, { action: e.target.value })} />
                    <Input label="Deadline" value={step.deadline} onChange={(e) => patchStep(i, { deadline: e.target.value })} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.canSkip} onChange={(e) => patchStep(i, { canSkip: e.target.checked })} /> Skippable</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={step.autoEscalate} onChange={(e) => patchStep(i, { autoEscalate: e.target.checked })} /> Auto escalate</label>
                    {step.autoEscalate && <Input label="Escalate after (hours)" type="number" value={String(step.escalateAfterHours)} onChange={(e) => patchStep(i, { escalateAfterHours: Number(e.target.value) })} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(deleteId)} onClose={() => setDeleteId(null)} title="Delete workflow" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleteId(null)}>Keep</Button><Button variant="danger" onClick={remove}>Delete</Button></div>}>
        <p className="text-sm text-gray-600">Delete this workflow? Workflows used in active cycles cannot be deleted.</p>
      </Modal>
    </div>
  );
}
