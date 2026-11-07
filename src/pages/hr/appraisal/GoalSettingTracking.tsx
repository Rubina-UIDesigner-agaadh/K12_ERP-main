import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Plus, Search } from 'lucide-react';

const GOAL_STORE = 'k12-appraisal-goal-v1';
const CYCLE_STORE = 'k12-appraisal-cycle-v1';
const KRA_STORE = 'k12-appraisal-kra-v1';

type GoalStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Archived';
type ProgressLog = { date: string; by: string; from: number; to: number; note: string };
type Evidence = { name: string; date: string; type: string };
type Goal = {
  id: string;
  title: string;
  employee: string;
  employeeId: string;
  department: string;
  cycle: string;
  kra: string;
  kraWeight: number;
  isGroup: boolean;
  parentId: string;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
  status: GoalStatus;
  logs: ProgressLog[];
  evidence: Evidence[];
  archived: boolean;
};

const CYCLES = ['AY 2026-27 — Annual Appraisal', 'Term 1 — Teaching Staff Review'];
const KRAS = [
  { name: 'Student Academic Outcome', weight: 30 },
  { name: 'Classroom Delivery Quality', weight: 25 },
  { name: 'Lesson Plan Adherence', weight: 15 },
  { name: 'Co-Curricular Contribution', weight: 10 },
  { name: 'Parent Communication Quality', weight: 10 },
  { name: 'CBSE Compliance & Documentation', weight: 10 },
  { name: 'Professional Development', weight: 10 }
];
const SCHOOL_TEMPLATES = [
  { title: 'Increase Class XII pass % from 78% → 90%', kra: 'Student Academic Outcome', description: 'Board exam result upload as evidence.' },
  { title: 'Complete 100% of syllabus by Term 1', kra: 'Classroom Delivery Quality', description: 'Lesson plan sign-off.' },
  { title: 'Conduct 4 PTMs with 80%+ parent attendance', kra: 'Parent Communication Quality', description: 'Attendance register.' },
  { title: 'Complete 1 CBSE training module per term', kra: 'Professional Development', description: 'Certificate upload.' },
  { title: 'Maintain 100% student attendance records in format', kra: 'CBSE Compliance & Documentation', description: 'Audit score.' }
];
const STAFF = [
  { id: 'EMP-1001', name: 'Rajesh Kumar', department: 'Science' },
  { id: 'EMP-1002', name: 'Priya Nair', department: 'Mathematics' },
  { id: 'EMP-1011', name: 'Meera Iyer', department: 'Languages' }
];

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

function computeStatus(progress: number, endDate: string, archived: boolean): GoalStatus {
  if (archived) return 'Archived';
  if (progress >= 100) return 'Completed';
  if (endDate && endDate < '2026-10-31' && progress < 100) return 'Overdue';
  if (progress <= 0) return 'Not Started';
  return 'In Progress';
}

const SEED: Goal[] = [
  { id: 'G-001', title: 'Increase Class XII pass % from 78% → 90%', employee: 'Rajesh Kumar', employeeId: 'EMP-1001', department: 'Science', cycle: CYCLES[0], kra: 'Student Academic Outcome', kraWeight: 30, isGroup: false, parentId: '', startDate: '2026-04-01', endDate: '2027-03-31', description: 'Board exam result upload as evidence.', progress: 75, status: 'In Progress', logs: [{ date: '2026-10-01', by: 'Rajesh Kumar', from: 40, to: 75, note: 'Term 1 results uploaded' }], evidence: [{ name: 'Term1-Marksheet.pdf', date: '2026-10-01', type: 'Exam Result Upload' }], archived: false },
  { id: 'G-002', title: 'Complete 100% of syllabus by Term 1', employee: 'Priya Nair', employeeId: 'EMP-1002', department: 'Mathematics', cycle: CYCLES[0], kra: 'Classroom Delivery Quality', kraWeight: 25, isGroup: true, parentId: '', startDate: '2026-04-01', endDate: '2026-09-30', description: 'Lesson plan sign-off.', progress: 60, status: 'Overdue', logs: [], evidence: [], archived: false },
  { id: 'G-002A', title: 'Algebra units 1–4 sign-off', employee: 'Priya Nair', employeeId: 'EMP-1002', department: 'Mathematics', cycle: CYCLES[0], kra: 'Classroom Delivery Quality', kraWeight: 25, isGroup: false, parentId: 'G-002', startDate: '2026-04-01', endDate: '2026-07-31', description: '', progress: 80, status: 'In Progress', logs: [], evidence: [], archived: false },
  { id: 'G-002B', title: 'Geometry units 5–7 sign-off', employee: 'Priya Nair', employeeId: 'EMP-1002', department: 'Mathematics', cycle: CYCLES[0], kra: 'Classroom Delivery Quality', kraWeight: 25, isGroup: false, parentId: 'G-002', startDate: '2026-08-01', endDate: '2026-09-30', description: '', progress: 40, status: 'Overdue', logs: [], evidence: [], archived: false },
  { id: 'G-003', title: 'Conduct 2 inter-school debate events', employee: 'Meera Iyer', employeeId: 'EMP-1011', department: 'Languages', cycle: CYCLES[0], kra: 'Co-Curricular Contribution', kraWeight: 10, isGroup: false, parentId: '', startDate: '2026-06-01', endDate: '2027-01-31', description: 'Event certificate.', progress: 50, status: 'In Progress', logs: [], evidence: [], archived: false },
  { id: 'G-004', title: 'Complete 1 CBSE training module per term', employee: 'Rajesh Kumar', employeeId: 'EMP-1001', department: 'Science', cycle: CYCLES[0], kra: 'Professional Development', kraWeight: 10, isGroup: false, parentId: '', startDate: '2026-04-01', endDate: '2026-09-30', description: 'Certificate upload.', progress: 100, status: 'Completed', logs: [], evidence: [{ name: 'CBSE-COT.pdf', date: '2026-09-12', type: 'Certificate Upload' }], archived: false },
  { id: 'G-005', title: 'Conduct 4 PTMs with 80%+ parent attendance', employee: 'Rajesh Kumar', employeeId: 'EMP-1001', department: 'Science', cycle: CYCLES[0], kra: 'Parent Communication Quality', kraWeight: 10, isGroup: false, parentId: '', startDate: '2026-04-01', endDate: '2027-03-31', description: 'Attendance register.', progress: 25, status: 'In Progress', logs: [], evidence: [], archived: false },
  { id: 'G-006', title: 'Maintain 100% student attendance records in format', employee: 'Priya Nair', employeeId: 'EMP-1002', department: 'Mathematics', cycle: CYCLES[0], kra: 'CBSE Compliance & Documentation', kraWeight: 10, isGroup: false, parentId: '', startDate: '2026-04-01', endDate: '2027-03-31', description: 'Audit score.', progress: 0, status: 'Not Started', logs: [], evidence: [], archived: false }
];

const emptyGoal = (): Goal => ({
  id: '',
  title: '',
  employee: 'Rajesh Kumar',
  employeeId: 'EMP-1001',
  department: 'Science',
  cycle: CYCLES[0],
  kra: KRAS[0].name,
  kraWeight: KRAS[0].weight,
  isGroup: false,
  parentId: '',
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  description: '',
  progress: 0,
  status: 'Not Started',
  logs: [],
  evidence: [],
  archived: false
});

const ringColor = (p: number) => (p <= 40 ? 'text-red-600' : p <= 70 ? 'text-amber-600' : 'text-emerald-600');
const statusBadge = (s: GoalStatus) => (s === 'Completed' ? 'success' : s === 'Overdue' ? 'danger' : s === 'Archived' ? 'secondary' : s === 'In Progress' ? 'warning' : 'info');

export function GoalSettingTracking() {
  const [view, setView] = useState<'mine' | 'all'>('all');
  const [layout, setLayout] = useState<'list' | 'kanban'>('list');
  const [goals, setGoals] = useState<Goal[]>(() => loadJson(GOAL_STORE, SEED).map((g) => ({ ...g, status: computeStatus(g.progress, g.endDate, g.archived) })));
  const [cycle, setCycle] = useState('');
  const [department, setDepartment] = useState('');
  const [kra, setKra] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Goal>(emptyGoal());
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);

  const cycleOptions = useMemo(() => {
    const stored = loadJson<{ name: string }[]>(CYCLE_STORE, []);
    const names = stored.map((c) => c.name);
    return names.length ? names : CYCLES;
  }, []);
  const kraOptions = useMemo(() => {
    const stored = loadJson<{ name: string; archived?: boolean }[]>(KRA_STORE, []);
    const names = stored.filter((k) => !k.archived).map((k) => k.name);
    return names.length ? names : KRAS.map((k) => k.name);
  }, []);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 4000);
  };
  const persist = (next: Goal[]) => {
    setGoals(next);
    saveJson(GOAL_STORE, next);
  };

  const visible = goals.filter((g) => {
    if (view === 'mine' && g.employeeId !== 'EMP-1001') return false;
    if (cycle && g.cycle !== cycle) return false;
    if (department && g.department !== department) return false;
    if (kra && g.kra !== kra) return false;
    if (status && g.status !== status) return false;
    if (search && !`${g.title} ${g.employee} ${g.kra}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const roots = visible.filter((g) => !g.parentId);

  const childrenOf = (id: string) => goals.filter((g) => g.parentId === id);
  const parentProgress = (id: string) => {
    const kids = childrenOf(id);
    if (!kids.length) return goals.find((g) => g.id === id)?.progress || 0;
    return Math.round(kids.reduce((s, k) => s + k.progress, 0) / kids.length);
  };

  const setProgress = (goal: Goal, value: number, logNote: string) => {
    const nextVal = Math.max(0, Math.min(100, value));
    persist(goals.map((g) => {
      if (g.id !== goal.id) return g;
      const archived = g.archived;
      const statusNow = computeStatus(nextVal, g.endDate, archived);
      return {
        ...g,
        progress: nextVal,
        status: statusNow,
        logs: [...g.logs, { date: '2026-10-31', by: 'Current user', from: g.progress, to: nextVal, note: logNote }]
      };
    }));
  };

  const moveStatus = (id: string, column: GoalStatus) => {
    persist(goals.map((g) => {
      if (g.id !== id) return g;
      const progress = column === 'Completed' ? 100 : column === 'Not Started' ? 0 : Math.max(g.progress, 1);
      const archived = column === 'Archived';
      return { ...g, progress, archived, status: computeStatus(progress, g.endDate, archived) };
    }));
  };

  const save = () => {
    if (!form.title.trim() || !form.employee) {
      flash('Goal title and employee are mandatory.');
      return;
    }
    if (form.cycle && !form.kra) {
      flash('KRA is mandatory when an Appraisal Cycle is selected.');
      return;
    }
    const kraMeta = KRAS.find((k) => k.name === form.kra);
    const record: Goal = {
      ...form,
      id: form.id || `G-${Date.now()}`,
      kraWeight: kraMeta?.weight || form.kraWeight,
      status: computeStatus(form.progress, form.endDate, form.archived)
    };
    persist(form.id ? goals.map((g) => (g.id === form.id ? record : g)) : [record, ...goals]);
    setShowForm(false);
    flash(form.cycle ? 'Goal saved. Progress will update the linked KRA score on the appraisal.' : 'Personal goal saved. It will not affect appraisal scoring.');
  };

  const impact = () => {
    if (!form.cycle || form.archived) return null;
    const completion = form.isGroup ? parentProgress(form.id || 'new') : form.progress;
    const earned = Math.round(form.kraWeight * completion / 100 * 10) / 10;
    const all = goals.filter((g) => g.employeeId === form.employeeId && g.cycle === form.cycle && !g.archived && !g.parentId);
    const totalWeighted = all.reduce((s, g) => s + g.kraWeight * g.progress / 100, 0);
    const totalWeight = all.reduce((s, g) => s + g.kraWeight, 0) || 1;
    const goalScore = Math.round(totalWeighted / totalWeight * 5 * 10) / 10;
    const grade = goalScore >= 4.5 ? 'Outstanding' : goalScore >= 3.5 ? 'Very Good (B+)' : goalScore >= 2.5 ? 'Good' : 'Needs Improvement';
    return { completion, earned, goalScore, grade };
  };

  const columns: GoalStatus[] = ['Not Started', 'In Progress', 'Completed', 'Overdue'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goal Setting & Tracking</h1>
          <p className="text-sm text-gray-500">Tag a cycle and KRA if progress should update the appraisal goal score. Archived goals do not contribute.</p>
        </div>
        {!showForm && <Button onClick={() => { setForm(emptyGoal()); setShowForm(true); }}><Plus className="mr-1 h-4 w-4" />New Goal</Button>}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="flex gap-1 border-b border-gray-200 bg-white">
        {[{ id: 'mine' as const, label: 'My Goals (Employee View)' }, { id: 'all' as const, label: 'All Goals (HR/Manager View)' }].map((item) => (
          <button key={item.id} type="button" onClick={() => setView(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${view === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>
        ))}
      </div>

      {!showForm && (
        <>
          <Card>
            <div className="grid gap-3 p-4 md:grid-cols-6">
              <Select label="Appraisal Cycle" value={cycle} onChange={(e) => setCycle(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All cycles' }, ...cycleOptions.map((v) => ({ value: v, label: v }))]} />
              <Select label="Department" value={department} onChange={(e) => setDepartment(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Science', label: 'Science' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Languages', label: 'Languages' }]} />
              <Select label="KRA" value={kra} onChange={(e) => setKra(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All KRAs' }, ...kraOptions.map((v) => ({ value: v, label: v }))]} />
              <Select label="Status" value={status} onChange={(e) => setStatus(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All' }, ...['Not Started', 'In Progress', 'Completed', 'Overdue', 'Archived'].map((v) => ({ value: v, label: v }))]} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" placeholder="Title, employee, KRA" /></div>
              </div>
              <div className="flex items-end gap-1">
                <button type="button" onClick={() => setLayout('list')} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${layout === 'list' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>List</button>
                <button type="button" onClick={() => setLayout('kanban')} className={`flex-1 rounded-lg border px-3 py-2 text-sm ${layout === 'kanban' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>Kanban</button>
              </div>
            </div>
          </Card>

          {layout === 'list' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      {['Goal Title', 'Employee', 'KRA', 'Cycle', 'Progress', 'Status', 'Due'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {roots.map((g) => (
                      <tr key={g.id} className={`cursor-pointer border-b hover:bg-gray-50 ${g.archived ? 'opacity-50' : ''}`} onClick={() => { setForm(g); setShowForm(true); }}>
                        <td className="px-3 py-2 font-medium">{g.title}{g.isGroup && <Badge variant="secondary">Group</Badge>}</td>
                        <td className="px-3 py-2">{g.employee}</td>
                        <td className="px-3 py-2 text-xs">{g.kra}</td>
                        <td className="px-3 py-2 text-xs">{g.cycle}</td>
                        <td className="px-3 py-2">{g.isGroup ? parentProgress(g.id) : g.progress}%</td>
                        <td className="px-3 py-2"><Badge variant={statusBadge(g.status)}>{g.status}</Badge></td>
                        <td className="px-3 py-2 text-xs">{g.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {layout === 'kanban' && (
            <div className="grid gap-3 md:grid-cols-4">
              {columns.map((col) => (
                <div key={col} className="rounded-xl border border-gray-200 bg-gray-50 p-3" onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragId) moveStatus(dragId, col); setDragId(null); }}>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{col}</p>
                  <div className="space-y-2">
                    {visible.filter((g) => !g.parentId && g.status === col).map((g) => (
                      <button key={g.id} type="button" draggable onDragStart={() => setDragId(g.id)} onClick={() => { setForm(g); setShowForm(true); }} className="w-full rounded-lg border bg-white p-3 text-left text-sm shadow-sm">
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-gray-500">{g.employee} · {g.progress}%</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <Card title={form.id ? 'Edit Goal' : 'New Goal'}>
          {form.archived && <div className="mx-5 mt-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600">This goal is archived. It will not affect your appraisal score.</div>}
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <Input label="Goal Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="md:col-span-2" />
            <div className="md:col-span-2">
              <p className="mb-1 text-xs font-medium text-gray-500">School goal templates</p>
              <div className="flex flex-wrap gap-2">
                {SCHOOL_TEMPLATES.map((t) => (
                  <Button key={t.title} size="xs" variant="outline" type="button" onClick={() => setForm({ ...form, title: t.title, kra: t.kra, kraWeight: KRAS.find((k) => k.name === t.kra)?.weight || form.kraWeight, description: t.description, cycle: form.cycle || CYCLES[0] })}>{t.title}</Button>
                ))}
              </div>
            </div>
            <Select label="Employee *" value={form.employeeId} onChange={(e) => {
              const id = typeof e === 'string' ? e : e.target.value;
              const emp = STAFF.find((s) => s.id === id);
              setForm({ ...form, employeeId: id, employee: emp?.name || '', department: emp?.department || '' });
            }} options={STAFF.map((s) => ({ value: s.id, label: `${s.name} (${s.id})` }))} />
            <Select label="Appraisal Cycle" value={form.cycle} onChange={(e) => setForm({ ...form, cycle: typeof e === 'string' ? e : e.target.value })} options={[{ value: '', label: 'Personal / informal (no appraisal impact)' }, ...cycleOptions.map((v) => ({ value: v, label: v }))]} />
            <Select label="KRA" value={form.kra} onChange={(e) => {
              const name = typeof e === 'string' ? e : e.target.value;
              setForm({ ...form, kra: name, kraWeight: KRAS.find((k) => k.name === name)?.weight || 0 });
            }} options={[{ value: '', label: form.cycle ? 'Select KRA (required)' : 'Optional' }, ...kraOptions.map((v) => ({ value: v, label: v }))]} />
            <Select label="Parent Goal" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: typeof e === 'string' ? e : e.target.value })} options={[{ value: '', label: 'None' }, ...goals.filter((g) => g.isGroup && g.id !== form.id).map((g) => ({ value: g.id, label: g.title }))]} />
            <label className="flex items-center gap-2 text-sm pt-6"><input type="checkbox" checked={form.isGroup} onChange={(e) => setForm({ ...form, isGroup: e.target.checked })} /> Is Group Goal</label>
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            <div className="md:col-span-2"><Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </div>

          <div className="border-t p-5">
            <p className="mb-3 text-sm font-semibold">Progress</p>
            <div className="flex flex-wrap items-center gap-4">
              <input type="range" min={0} max={100} value={form.progress} className="flex-1" onChange={(e) => setForm({ ...form, progress: Number(e.target.value), status: computeStatus(Number(e.target.value), form.endDate, form.archived) })} />
              <Input type="number" className="w-24" value={String(form.progress)} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
              <span className={`text-2xl font-bold ${ringColor(form.progress)}`}>{form.progress}%</span>
              <Badge variant={statusBadge(form.status)}>{form.status}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Update note" value={note} onChange={(e) => setNote(e.target.value)} />
              <Button size="sm" variant="outline" onClick={() => { setProgress(form, form.progress, note); setNote(''); flash('Goal progress updated. Linked KRA score recalculated.'); }}>Save progress</Button>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-500">
              {form.logs.map((l, i) => <li key={i}>{l.date} · {l.by} · {l.from}% → {l.to}% · {l.note}</li>)}
            </ul>
            <div className="mt-3">
              <Button size="xs" variant="outline" onClick={() => setForm({ ...form, evidence: [...form.evidence, { name: 'Supporting-document.pdf', date: '2026-10-31', type: 'Certificate Upload' }] })}>Attach evidence</Button>
              <ul className="mt-2 text-xs text-gray-600">{form.evidence.map((f, i) => <li key={i}>{f.name} · {f.type} · {f.date}</li>)}</ul>
            </div>
          </div>

          {form.isGroup && (
            <div className="border-t p-5">
              <p className="mb-2 text-sm font-semibold">Sub-goal tree · parent progress {parentProgress(form.id || '')}%</p>
              <div className="space-y-2">
                {childrenOf(form.id).map((c) => (
                  <div key={c.id} className="rounded-lg border px-3 py-2 text-sm">
                    <div className="flex justify-between"><span>{c.title}</span><Badge variant={statusBadge(c.status)}>{c.status}</Badge></div>
                    <div className="mt-1 h-2 rounded-full bg-gray-200"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${c.progress}%` }} /></div>
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => {
                const child = { ...emptyGoal(), id: `G-${Date.now()}`, title: 'New sub-goal', parentId: form.id || '', employee: form.employee, employeeId: form.employeeId, department: form.department, cycle: form.cycle, kra: form.kra, kraWeight: form.kraWeight };
                persist([child, ...goals]);
                flash('Sub-goal added. Parent progress is the average of children.');
              }}>Add Sub-Goal</Button>
            </div>
          )}

          {form.cycle && !form.archived && impact() && (
            <div className="mx-5 mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm">
              <p className="font-semibold text-indigo-900">KRA score impact</p>
              <p className="text-indigo-800">KRA: {form.kra} ({form.kraWeight}% weightage) → Current completion: {impact()!.completion}% → Score earned: {impact()!.earned} / {form.kraWeight}</p>
              <p className="mt-1">Total Goal Score: {impact()!.goalScore} / 5.0 · Projected Grade: {impact()!.grade}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { setForm({ ...form, archived: !form.archived }); flash(form.archived ? 'Goal restored.' : 'Goal archived. Progress will not contribute to KRA score.'); }}>{form.archived ? 'Unarchive' : 'Archive'}</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default GoalSettingTracking;
