import React, { useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Copy, GripVertical, Pencil, Plus, Search, TestTube2, Trash2 } from 'lucide-react';

const YEARS = ['2025-26', '2026-27', '2027-28'];
const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Language', 'Computer Science'];
const GRADES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E'];
const RULE_TYPES = [
  'Minimum Aggregate',
  'Minimum Marks in a Subject',
  'Must Pass These Subjects',
  'Minimum Attendance',
  'Minimum Grade in a Subject',
  'Board Exam Must Be Passed',
  'Transfer Certificate Must Be Submitted',
  'Custom Formula'
] as const;
type RuleType = typeof RULE_TYPES[number];
const STORE = 'k12-eligibility-rules-v1';

interface Rule {
  id: string;
  year: string;
  stream: string;
  name: string;
  type: RuleType;
  mandatory: boolean;
  active: boolean;
  priority: number;
  failMessage: string;
  lastEdited: string;
  usedInChecks: number;
  avgAcross?: 'All subjects' | 'Best 5 subjects' | 'Specific subjects';
  specificSubjects?: string[];
  minPct?: number;
  subject?: string;
  minMarks?: number;
  outOf?: number;
  passSubjects?: string[];
  passMarks?: number;
  minAttendance?: number;
  minGrade?: string;
  boardStatus?: 'PASS' | 'DISTINCTION';
  tcRequired?: boolean;
  formulaDesc?: string;
  formula?: string;
}

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
};

const SEED: Rule[] = [
  { id: 'R1', year: '2026-27', stream: 'Science', name: 'Minimum Maths for Science', type: 'Minimum Marks in a Subject', mandatory: true, active: true, priority: 1, failMessage: 'You need at least 60 marks in Maths to apply for Science.', lastEdited: '12-06-2026', usedInChecks: 3, subject: 'Mathematics', minMarks: 60, outOf: 100 },
  { id: 'R2', year: '2026-27', stream: 'Science', name: 'Science aggregate 75%', type: 'Minimum Aggregate', mandatory: true, active: true, priority: 2, failMessage: 'Science requires at least 75% aggregate.', lastEdited: '12-06-2026', usedInChecks: 3, avgAcross: 'All subjects', minPct: 75 },
  { id: 'R3', year: '2026-27', stream: 'Commerce', name: 'Commerce aggregate 60%', type: 'Minimum Aggregate', mandatory: true, active: true, priority: 1, failMessage: 'Commerce requires at least 60% aggregate.', lastEdited: '12-06-2026', usedInChecks: 2, avgAcross: 'All subjects', minPct: 60 },
  { id: 'R4', year: '2026-27', stream: 'Arts', name: 'Arts attendance 75%', type: 'Minimum Attendance', mandatory: false, active: true, priority: 1, failMessage: 'Attendance below 75% is a warning for Arts.', lastEdited: '10-06-2026', usedInChecks: 0, minAttendance: 75 },
  { id: 'R5', year: '2026-27', stream: 'Vocational', name: 'Board result must be PASS', type: 'Board Exam Must Be Passed', mandatory: true, active: true, priority: 1, failMessage: 'Board exam must be passed to join Vocational.', lastEdited: '08-06-2026', usedInChecks: 1, boardStatus: 'PASS' }
];

const STUDENTS = [
  { name: 'Aarav Patel', roll: 'CBSE1001', pct: 91.2, math: 92, science: 88, attendance: 82, grade: 'A1', board: 'PASS', tc: true },
  { name: 'Rohan Mehta', roll: 'CBSE1003', pct: 62.0, math: 58, science: 61, attendance: 78, grade: 'B2', board: 'PASS', tc: true },
  { name: 'Ananya Iyer', roll: 'CBSE1004', pct: 48.5, math: 42, science: 45, attendance: 70, grade: 'C2', board: 'PASS', tc: false },
  { name: 'Vivaan Reddy', roll: 'CBSE1009', pct: 39.2, math: 33, science: 36, attendance: 60, grade: 'D', board: 'PASS', tc: false }
];

const loadRules = (): Rule[] => {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch { /* seed */ }
  return SEED;
};

const saveRules = (rules: Rule[]) => window.localStorage.setItem(STORE, JSON.stringify(rules));

const summaryOf = (r: Rule) => {
  switch (r.type) {
    case 'Minimum Aggregate': return `Average across ${r.avgAcross || 'All subjects'}${r.avgAcross === 'Specific subjects' ? ` (${(r.specificSubjects || []).join(', ')})` : ''} must be ≥ ${r.minPct ?? 0}%`;
    case 'Minimum Marks in a Subject': return `${r.subject || 'Subject'} must be ≥ ${r.minMarks ?? 0} out of ${r.outOf ?? 100}`;
    case 'Must Pass These Subjects': return `Must pass ${(r.passSubjects || []).join(', ') || 'selected subjects'} (pass ≥ ${r.passMarks ?? 33})`;
    case 'Minimum Attendance': return `Attendance must be ≥ ${r.minAttendance ?? 0}%`;
    case 'Minimum Grade in a Subject': return `${r.subject || 'Subject'} grade must be at least ${r.minGrade || '—'}`;
    case 'Board Exam Must Be Passed': return `Board result must be ${r.boardStatus || 'PASS'}`;
    case 'Transfer Certificate Must Be Submitted': return r.tcRequired ? 'Transfer certificate must be submitted' : 'TC not required';
    case 'Custom Formula': return r.formulaDesc || r.formula || 'Custom formula';
    default: return '';
  }
};

const blank = (year: string, priority: number): Rule => ({
  id: '', year, stream: 'Science', name: '', type: 'Minimum Aggregate', mandatory: true, active: true, priority,
  failMessage: '', lastEdited: stamp(), usedInChecks: 0, avgAcross: 'All subjects', minPct: 60
});

const nextYearOf = (y: string) => {
  const i = YEARS.indexOf(y);
  return i >= 0 && i < YEARS.length - 1 ? YEARS[i + 1] : null;
};

export function EligibilityRulesBuilder() {
  const [year, setYear] = useState('2026-27');
  const [rules, setRules] = useState<Rule[]>(loadRules);
  const persist = (next: Rule[]) => { setRules(next); saveRules(next); };
  const [streamF, setStreamF] = useState('All');
  const [typeF, setTypeF] = useState('All');
  const [mandF, setMandF] = useState('All');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [testOpen, setTestOpen] = useState(false);
  const [testRule, setTestRule] = useState<Rule | null>(null);
  const [testStudent, setTestStudent] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyStream, setCopyStream] = useState('Commerce');
  const [dragId, setDragId] = useState<string | null>(null);
  const [cancelAsk, setCancelAsk] = useState(false);

  const yearRules = useMemo(() => rules.filter((r) => r.year === year), [rules, year]);
  const filtered = yearRules
    .filter((r) => (streamF === 'All' || r.stream === streamF) && (typeF === 'All' || r.type === typeF) && (mandF === 'All' || (mandF === 'Mandatory only' ? r.mandatory : !r.mandatory)) && (!q || r.name.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => a.priority - b.priority);

  const evaluate = (rule: Rule, studentName: string) => {
    const s = STUDENTS.find((x) => x.name === studentName || x.roll === studentName);
    if (!s) return { ok: false, required: '—', actual: 'Student not found', pass: false };
    let required = '';
    let actual = '';
    let pass = true;
    if (rule.type === 'Minimum Aggregate') {
      required = `≥ ${rule.minPct}%`; actual = `${s.pct}%`; pass = s.pct >= (rule.minPct || 0);
    } else if (rule.type === 'Minimum Marks in a Subject') {
      const val = rule.subject === 'Science' ? s.science : s.math;
      required = `≥ ${rule.minMarks}/${rule.outOf}`; actual = String(val); pass = val >= (rule.minMarks || 0);
    } else if (rule.type === 'Minimum Attendance') {
      required = `≥ ${rule.minAttendance}%`; actual = `${s.attendance}%`; pass = s.attendance >= (rule.minAttendance || 0);
    } else if (rule.type === 'Minimum Grade in a Subject') {
      required = rule.minGrade || '—'; actual = s.grade; pass = GRADES.indexOf(s.grade) <= GRADES.indexOf(rule.minGrade || 'E');
    } else if (rule.type === 'Board Exam Must Be Passed') {
      required = rule.boardStatus || 'PASS'; actual = s.board; pass = s.board === 'PASS' || (rule.boardStatus === 'PASS');
    } else if (rule.type === 'Transfer Certificate Must Be Submitted') {
      required = rule.tcRequired ? 'Submitted' : 'Optional'; actual = s.tc ? 'Submitted' : 'Missing'; pass = !rule.tcRequired || s.tc;
    } else if (rule.type === 'Must Pass These Subjects') {
      required = `≥ ${rule.passMarks}`; actual = `Math ${s.math}, Sci ${s.science}`; pass = s.math >= (rule.passMarks || 33) && s.science >= (rule.passMarks || 33);
    } else if (rule.type === 'Custom Formula') {
      required = rule.formula || ''; actual = `Math ${s.math}, Sci ${s.science}, Agg ${s.pct}`;
      try {
        const expr = (rule.formula || '').replace(/Math/g, String(s.math)).replace(/Science/g, String(s.science)).replace(/Agg/g, String(s.pct));
        if (!/^[0-9+\-*/(). <>=]+$/.test(expr)) throw new Error('bad');
        pass = !!Function(`"use strict"; return (${expr});`)();
      } catch { pass = false; required = 'Invalid formula'; }
    }
    return { ok: true, required, actual, pass };
  };

  const validateForm = (r: Rule) => {
    const e: string[] = [];
    if (!r.name.trim()) e.push('Rule name is required.');
    if (!r.stream) e.push('Apply to Stream is required.');
    if (!r.failMessage.trim()) e.push('Please write what message students will see if they fail this rule.');
    if (rules.some((x) => x.id !== r.id && x.year === r.year && x.stream === r.stream && x.name.trim().toLowerCase() === r.name.trim().toLowerCase())) {
      e.push(`A rule called this already exists for ${r.stream}. Rename it.`);
    }
    if (r.type === 'Minimum Aggregate' && (r.minPct || 0) > 100) e.push('Percentage cannot exceed 100.');
    if (r.type === 'Minimum Attendance' && (r.minAttendance || 0) > 100) e.push('Percentage cannot exceed 100.');
    if (r.type === 'Custom Formula' && r.formula) {
      const expr = r.formula.replace(/Math|Science|Agg/g, '1');
      if (!/^[0-9+\-*/(). <>=]+$/.test(expr)) e.push('Formula could not be understood. Please check and rewrite.');
    }
    if (r.type === 'Minimum Marks in a Subject' && (!r.subject || r.minMarks == null)) e.push('Subject and minimum marks are required.');
    return e;
  };

  const saveRule = () => {
    if (!editing) return;
    const e = validateForm(editing);
    if (e.length) { setErrors(e); return; }
    const nextRule = { ...editing, lastEdited: stamp(), id: editing.id || `R${Date.now()}` };
    const next = editing.id ? rules.map((r) => r.id === editing.id ? nextRule : r) : [...rules, nextRule];
    persist(next);
    setOpen(false);
    setNotice('Rule saved.');
  };

  const preview = editing ? (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 space-y-2">
      <p className="font-semibold">For {editing.stream} stream — {editing.mandatory ? 'Mandatory' : 'Advisory'} Rule (Priority {editing.priority})</p>
      <p>{summaryOf(editing)}</p>
      <p>If this rule fails, the student will be marked {editing.mandatory ? 'NOT ELIGIBLE' : 'with a warning'} for {editing.stream}.</p>
      <p>Message to student: “{editing.failMessage || '—'}”</p>
    </div>
  ) : null;

  const dropOn = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...yearRules].sort((a, b) => a.priority - b.priority);
    const from = list.findIndex((r) => r.id === dragId);
    const to = list.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    const reindexed = list.map((r, i) => ({ ...r, priority: i + 1 }));
    persist(rules.map((r) => reindexed.find((x) => x.id === r.id) || r));
    setDragId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-full">
      <div>
        <p className="text-xs text-gray-500">Home → Eligibility → Rules Builder</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <h1 className="text-xl font-bold">Eligibility Rules</h1>
          <Badge variant="info">{year}</Badge>
        </div>
        <p className="text-sm text-gray-500">Define the criteria students must meet to qualify for each stream</p>
        <p className="text-xs text-amber-700 mt-1">Rules apply to the selected academic year only. Use Copy to Next Year when setting up a new year.</p>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <select className="px-3 py-2 border rounded-lg text-sm" value={year} onChange={(e) => setYear(e.target.value)}>{YEARS.map((y) => <option key={y}>{y}</option>)}</select>
        <select className="px-3 py-2 border rounded-lg text-sm" value={streamF} onChange={(e) => setStreamF(e.target.value)}><option>All</option>{STREAMS.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="px-3 py-2 border rounded-lg text-sm" value={typeF} onChange={(e) => setTypeF(e.target.value)}><option>All</option>{RULE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="px-3 py-2 border rounded-lg text-sm" value={mandF} onChange={(e) => setMandF(e.target.value)}><option>All</option><option>Mandatory only</option><option>Advisory only</option></select>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" placeholder="Search by rule name" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(blank(year, yearRules.length + 1)); setErrors([]); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add New Rule</Button>
        <Button variant="outline" onClick={() => {
          const ny = nextYearOf(year);
          if (!ny) { setNotice('No next year available.'); return; }
          const copies = yearRules.map((r) => ({ ...r, id: `R${Date.now()}-${r.id}`, year: ny, lastEdited: stamp(), usedInChecks: 0 }));
          persist([...rules, ...copies]);
          setNotice(`Copied ${copies.length} rule(s) to ${ny}.`);
        }}>Copy All Rules to Next Year</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>{['', 'Priority', 'Rule Name', 'Stream', 'Rule Type', 'Plain English Summary', 'Mandatory', 'Active', 'Last Edited', 'Actions'].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={10} className="px-3 py-8 text-center text-gray-400">No rules for this filter.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} draggable onDragStart={() => setDragId(r.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(r.id)} className={`border-t ${r.active ? '' : 'opacity-50 bg-gray-50'}`}>
                <td className="px-2 py-2 text-gray-400 cursor-grab"><GripVertical className="w-4 h-4" /></td>
                <td className="px-3 py-2">
                  <input type="number" className="w-14 border rounded px-2 py-1 text-sm" value={r.priority} onChange={(e) => persist(rules.map((x) => x.id === r.id ? { ...x, priority: Number(e.target.value) || 1 } : x))} />
                </td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2"><Badge variant="info">{r.stream}</Badge></td>
                <td className="px-3 py-2"><Badge variant="secondary">{r.type}</Badge></td>
                <td className="px-3 py-2 text-gray-700">{summaryOf(r)}</td>
                <td className="px-3 py-2">{r.mandatory ? <Badge variant="danger">Yes</Badge> : <Badge variant="secondary">No</Badge>}</td>
                <td className="px-3 py-2"><Toggle checked={r.active} onChange={(v) => persist(rules.map((x) => x.id === r.id ? { ...x, active: v } : x))} /></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.lastEdited}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded" title="Edit" onClick={() => { setEditing({ ...r }); setErrors([]); setOpen(true); }}><Pencil className="w-4 h-4" /></button>
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded" title="Test" onClick={() => { setTestRule(r); setTestStudent(''); setTestResult(null); setTestOpen(true); }}><TestTube2 className="w-4 h-4" /></button>
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded" title="Copy" onClick={() => { setEditing({ ...r }); setCopyStream(STREAMS.find((s) => s !== r.stream) || 'Commerce'); setCopyOpen(true); }}><Copy className="w-4 h-4" /></button>
                  <button type="button" className="p-1.5 hover:bg-gray-100 rounded text-red-600" title="Delete" onClick={() => {
                    if (r.usedInChecks > 0) { setNotice(`This rule has been used in ${r.usedInChecks} eligibility checks. Deactivate it instead of deleting.`); return; }
                    persist(rules.filter((x) => x.id !== r.id));
                    setNotice('Rule deleted.');
                  }}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} onClose={() => setCancelAsk(true)} title={editing?.id ? 'Edit Rule' : 'Add New Rule'} size="xl" footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setCancelAsk(true)}>Cancel</Button>
          {editing?.id && <Button variant="danger" onClick={() => {
            if ((editing.usedInChecks || 0) > 0) { setErrors([`This rule has been used in ${editing.usedInChecks} eligibility checks. Deactivate it instead of deleting.`]); return; }
            persist(rules.filter((x) => x.id !== editing.id));
            setOpen(false);
            setNotice('Rule deleted.');
          }}>Delete</Button>}
          <Button variant="outline" onClick={() => { if (editing) { setTestRule(editing); setTestStudent(''); setTestResult(null); setTestOpen(true); } }}>Test Against a Student</Button>
          <Button variant="outline" onClick={() => { const e = editing ? validateForm(editing) : []; if (e.length) { setErrors(e); return; } setCopyOpen(true); }}>Copy to Another Stream</Button>
          <Button onClick={saveRule}>Save Rule</Button>
        </div>
      }>
        {editing && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 space-y-3">
              {errors.length > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 space-y-1">{errors.map((e) => <p key={e}>{e}</p>)}</div>}
              <p className="text-xs font-semibold uppercase text-gray-500">Rule identity</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select label="Apply to Stream *" options={STREAMS.map((s) => ({ value: s, label: s }))} value={editing.stream} onChange={(e) => setEditing({ ...editing, stream: e.target.value })} />
                <Input label="Rule Name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                <Select label="Rule Type *" options={RULE_TYPES.map((s) => ({ value: s, label: s }))} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as RuleType })} />
                <Input label="Priority *" type="number" value={String(editing.priority)} onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) || 1 })} />
              </div>
              <Toggle checked={editing.mandatory} onChange={(v) => setEditing({ ...editing, mandatory: v })} label="Is Mandatory — failing this rule makes the student not eligible. Off = advisory warning." />
              <Textarea label="Message shown to student when they fail this rule *" rows={2} value={editing.failMessage} onChange={(e) => setEditing({ ...editing, failMessage: e.target.value })} />

              <p className="text-xs font-semibold uppercase text-gray-500 pt-2">Rule conditions</p>
              {editing.type === 'Minimum Aggregate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select label="Calculate Average Across *" options={['All subjects', 'Best 5 subjects', 'Specific subjects'].map((s) => ({ value: s, label: s }))} value={editing.avgAcross} onChange={(e) => setEditing({ ...editing, avgAcross: e.target.value as Rule['avgAcross'] })} />
                  <Input label="Minimum Percentage *" type="number" value={String(editing.minPct ?? '')} onChange={(e) => setEditing({ ...editing, minPct: Number(e.target.value) || 0 })} />
                  {editing.avgAcross === 'Specific subjects' && (
                    <div className="md:col-span-2 flex flex-wrap gap-2 text-sm">
                      {SUBJECTS.map((s) => (
                        <label key={s} className="flex items-center gap-1 border rounded px-2 py-1">
                          <input type="checkbox" checked={(editing.specificSubjects || []).includes(s)} onChange={() => {
                            const cur = editing.specificSubjects || [];
                            setEditing({ ...editing, specificSubjects: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
                          }} />{s}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {editing.type === 'Minimum Marks in a Subject' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select label="Subject *" options={SUBJECTS.map((s) => ({ value: s, label: s }))} value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
                  <Input label="Minimum Marks *" type="number" value={String(editing.minMarks ?? '')} onChange={(e) => setEditing({ ...editing, minMarks: Number(e.target.value) || 0 })} />
                  <Input label="Out of Total *" type="number" value={String(editing.outOf ?? 100)} onChange={(e) => setEditing({ ...editing, outOf: Number(e.target.value) || 100 })} />
                </div>
              )}
              {editing.type === 'Must Pass These Subjects' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm">
                    {SUBJECTS.map((s) => (
                      <label key={s} className="flex items-center gap-1 border rounded px-2 py-1">
                        <input type="checkbox" checked={(editing.passSubjects || []).includes(s)} onChange={() => {
                          const cur = editing.passSubjects || [];
                          setEditing({ ...editing, passSubjects: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
                        }} />{s}
                      </label>
                    ))}
                  </div>
                  <Input label="What counts as passing *" type="number" value={String(editing.passMarks ?? 33)} onChange={(e) => setEditing({ ...editing, passMarks: Number(e.target.value) || 0 })} />
                </div>
              )}
              {editing.type === 'Minimum Attendance' && <Input label="Minimum Attendance % *" type="number" value={String(editing.minAttendance ?? '')} onChange={(e) => setEditing({ ...editing, minAttendance: Number(e.target.value) || 0 })} />}
              {editing.type === 'Minimum Grade in a Subject' && (
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Subject *" options={SUBJECTS.map((s) => ({ value: s, label: s }))} value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
                  <Select label="Minimum Grade *" options={GRADES.map((s) => ({ value: s, label: s }))} value={editing.minGrade} onChange={(e) => setEditing({ ...editing, minGrade: e.target.value })} />
                </div>
              )}
              {editing.type === 'Board Exam Must Be Passed' && <Select label="Required Status *" options={[{ value: 'PASS', label: 'PASS' }, { value: 'DISTINCTION', label: 'DISTINCTION' }]} value={editing.boardStatus} onChange={(e) => setEditing({ ...editing, boardStatus: e.target.value as 'PASS' | 'DISTINCTION' })} />}
              {editing.type === 'Transfer Certificate Must Be Submitted' && <Toggle checked={Boolean(editing.tcRequired)} onChange={(v) => setEditing({ ...editing, tcRequired: v })} label="TC Required" />}
              {editing.type === 'Custom Formula' && (
                <div className="space-y-3">
                  <Textarea label="Formula Description *" rows={2} value={editing.formulaDesc || ''} onChange={(e) => setEditing({ ...editing, formulaDesc: e.target.value })} />
                  <Input label="Formula Expression *" value={editing.formula || ''} onChange={(e) => setEditing({ ...editing, formula: e.target.value })} placeholder="e.g. (Math + Science) / 2 >= 65" />
                  <Button variant="outline" onClick={() => {
                    const expr = (editing.formula || '').replace(/Math|Science|Agg/g, '1');
                    setErrors(/^[0-9+\-*/(). <>=]+$/.test(expr) ? [] : ['Formula could not be understood. Please check and rewrite.']);
                    if (/^[0-9+\-*/(). <>=]+$/.test(expr)) setNotice('Formula syntax looks valid.');
                  }}>Test Formula</Button>
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Live preview</p>
              {preview}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={testOpen} onClose={() => setTestOpen(false)} title="Test rule against a student" footer={<Button onClick={() => setTestOpen(false)}>Close</Button>}>
        <div className="space-y-3">
          <Select label="Student" options={STUDENTS.map((s) => ({ value: s.name, label: `${s.name} · ${s.roll}` }))} value={testStudent} onChange={(e) => setTestStudent(e.target.value)} />
          <Button onClick={() => {
            if (!testRule || !testStudent) return;
            const res = evaluate(testRule, testStudent);
            setTestResult(`${testRule.name} · Required ${res.required} · Actual ${res.actual} · ${res.pass ? 'PASS' : 'FAIL'}`);
          }}>Run Test</Button>
          {testResult && <div className={`rounded-lg p-3 text-sm ${testResult.includes('PASS') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{testResult}</div>}
        </div>
      </Modal>

      <Modal isOpen={copyOpen} onClose={() => setCopyOpen(false)} title="Copy to another stream" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCopyOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!editing) return;
            const e = validateForm({ ...editing, stream: copyStream, id: '' });
            if (e.length) { setErrors(e); return; }
            const copy = { ...editing, id: `R${Date.now()}`, stream: copyStream, lastEdited: stamp(), usedInChecks: 0 };
            persist([...rules, copy]);
            setCopyOpen(false);
            setOpen(false);
            setNotice(`Copied to ${copyStream}.`);
          }}>Copy</Button>
        </div>
      }>
        <Select label="Stream" options={STREAMS.map((s) => ({ value: s, label: s }))} value={copyStream} onChange={(e) => setCopyStream(e.target.value)} />
      </Modal>

      <Modal isOpen={cancelAsk} onClose={() => setCancelAsk(false)} title="Discard changes?" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCancelAsk(false)}>Keep editing</Button>
          <Button variant="danger" onClick={() => { setCancelAsk(false); setOpen(false); }}>Discard</Button>
        </div>
      }>
        <p className="text-sm">Unsaved rule changes will be lost.</p>
      </Modal>
    </div>
  );
}

export default EligibilityRulesBuilder;
