import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Search } from 'lucide-react';

type Tab = 'overview' | 'kra' | 'feedback' | 'self' | 'observation' | 'final';
type Status = 'Draft' | 'Self Appraisal Pending' | 'Feedback Pending' | 'Under Review' | 'Submitted' | 'Approved' | 'Rejected';

type KraRow = { name: string; weight: number; goals: { title: string; progress: number; status: string; updated: string }[]; completion: number; min: number; score: number; notes: string };
type FeedbackCard = { reviewer: string; designation: string; date: string; rating: number; text: string; type: string };
type SelfRow = { criteria: string; rating: number; comments: string; weight: number };
type ObsRow = { date: string; observer: string; subject: string; topic: string; score: number; notes: string };
type Appraisal = {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  designation: string;
  joining: string;
  lastGrade: string;
  cycle: string;
  template: string;
  start: string;
  end: string;
  appraiser: string;
  status: Status;
  kraMethod: 'Automated' | 'Manual';
  kras: KraRow[];
  feedback: FeedbackCard[];
  self: SelfRow[];
  selfDone: boolean;
  reflection: string;
  observations: ObsRow[];
  cbseObs: boolean;
  reviewerComments: string;
  hrComments: string;
  scoresLocked: boolean;
  lastRefresh: string;
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Header / Overview' },
  { id: 'kra', label: 'KRA Evaluation' },
  { id: 'feedback', label: 'Feedback History' },
  { id: 'self', label: 'Self Appraisal' },
  { id: 'observation', label: 'Classroom Observation' },
  { id: 'final', label: 'Final Score & Outcome' }
];

const SEED: Appraisal[] = [
  {
    id: 'APR-2026-1001',
    employee: 'Rajesh Kumar',
    employeeId: 'EMP-1001',
    department: 'Science',
    designation: 'PGT Physics',
    joining: '2019-06-15',
    lastGrade: 'Very Good',
    cycle: 'AY 2026-27 — Annual Appraisal',
    template: 'Teaching Staff — Annual',
    start: '2026-04-01',
    end: '2027-03-31',
    appraiser: 'HOD Science',
    status: 'Under Review',
    kraMethod: 'Automated',
    lastRefresh: '2 hours ago',
    scoresLocked: false,
    kras: [
      { name: 'Student Academic Outcome', weight: 30, completion: 75, min: 3, score: 22.5, notes: '', goals: [{ title: 'Increase Class XII pass % from 78% → 90%', progress: 75, status: 'In Progress', updated: '2026-10-01' }] },
      { name: 'Classroom Delivery Quality', weight: 25, completion: 80, min: 3, score: 20, notes: '', goals: [{ title: 'Complete 100% of syllabus by Term 1', progress: 80, status: 'In Progress', updated: '2026-09-20' }] },
      { name: 'Lesson Plan Adherence', weight: 15, completion: 90, min: 2.5, score: 13.5, notes: '', goals: [] },
      { name: 'Co-Curricular Contribution', weight: 10, completion: 50, min: 2, score: 5, notes: '', goals: [] },
      { name: 'Parent Communication Quality', weight: 10, completion: 70, min: 2, score: 7, notes: '', goals: [] },
      { name: 'CBSE Compliance & Documentation', weight: 10, completion: 40, min: 3.5, score: 4, notes: '', goals: [{ title: 'Maintain 100% student attendance records', progress: 40, status: 'In Progress', updated: '2026-10-15' }] }
    ],
    feedback: [
      { reviewer: 'HOD Science', designation: 'HOD', date: '2026-10-12', rating: 4.2, text: 'Strong classroom presence. Needs tighter board documentation.', type: 'HOD' },
      { reviewer: 'Meera Iyer', designation: 'PGT English', date: '2026-10-08', rating: 4.0, text: 'Collaborative in inter-department events.', type: 'Peer' },
      { reviewer: 'Principal', designation: 'Principal', date: '2026-10-20', rating: 4.1, text: 'Reliable academic outcomes.', type: 'Principal' }
    ],
    self: [
      { criteria: 'Subject Knowledge Depth', rating: 4, comments: 'Updated board pattern notes.', weight: 20 },
      { criteria: 'Student Engagement & Pedagogy', rating: 4, comments: 'Introduced lab demos weekly.', weight: 20 },
      { criteria: 'Punctuality & Regularity', rating: 5, comments: 'No late marks.', weight: 10 },
      { criteria: 'Professional Development Effort', rating: 3, comments: 'One CBSE module completed.', weight: 10 }
    ],
    selfDone: true,
    reflection: 'Focus this year was board results and lab work. I need more time for documentation.',
    observations: [
      { date: '2026-08-12', observer: 'Principal', subject: 'Physics', topic: 'Electromagnetism', score: 8, notes: 'Clear structure, good questioning.' },
      { date: '2026-09-18', observer: 'HOD', subject: 'Physics', topic: 'Optics', score: 7, notes: 'Teaching aids used well.' }
    ],
    cbseObs: true,
    reviewerComments: '',
    hrComments: ''
  }
];

const years = (doj: string) => {
  const d = new Date(doj).getTime();
  return Math.max(0, Math.round((Date.parse('2026-10-31') - d) / 31557600000 * 10) / 10);
};

export function AppraisalIndividualForm() {
  const [rows, setRows] = useState(SEED);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Appraisal | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [expand, setExpand] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [fbOpen, setFbOpen] = useState(false);
  const [obsOpen, setObsOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnNote, setReturnNote] = useState('');
  const [fbDraft, setFbDraft] = useState({ rating: 4, text: '' });
  const [obsDraft, setObsDraft] = useState({ date: '2026-10-31', observer: 'Principal', subject: 'Physics', topic: '', score: 8, notes: '' });

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };
  const patch = (next: Appraisal) => {
    setOpen(next);
    setRows((prev) => prev.map((r) => (r.id === next.id ? next : r)));
  };

  const goalScore = (a: Appraisal) => {
    const total = a.kras.reduce((s, k) => s + k.weight * k.completion / 100, 0);
    return Math.round(total / 20 * 10) / 10;
  };
  const feedbackScore = (a: Appraisal) => a.feedback.length ? Math.round(a.feedback.reduce((s, f) => s + f.rating, 0) / a.feedback.length * 10) / 10 : 0;
  const selfScore = (a: Appraisal) => {
    const w = a.self.reduce((s, r) => s + r.weight, 0) || 1;
    return Math.round(a.self.reduce((s, r) => s + r.rating * r.weight, 0) / w * 10) / 10;
  };
  const obsScore = (a: Appraisal) => a.observations.length ? Math.round(a.observations.reduce((s, o) => s + o.score, 0) / a.observations.length / 2 * 10) / 10 : 0;
  const finalScore = (a: Appraisal) => Math.round((goalScore(a) * 0.4 + feedbackScore(a) * 0.35 + selfScore(a) * 0.15 + obsScore(a) * 0.1) * 10) / 10;
  const grade = (n: number) => (n >= 4.6 ? 'Outstanding' : n >= 4 ? 'Very Good' : n >= 3.5 ? 'Good' : n >= 3 ? 'Satisfactory' : 'Needs Improvement');
  const below = (a: Appraisal) => a.kras.filter((k) => (k.completion / 100) * 5 < k.min);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appraisal</h1>
        <p className="text-sm text-gray-500">Individual employee form. Aggregates goal, feedback, self-appraisal and classroom observation scores.</p>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {!open && (
        <Card>
          <div className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or cycle" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                  {['Employee', 'Cycle', 'Template', 'Status', ''].map((h) => <th key={h || 'a'} className="px-3 py-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.filter((r) => `${r.employee} ${r.cycle}`.toLowerCase().includes(search.toLowerCase())).map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2"><p className="font-medium">{r.employee}</p><p className="text-xs text-gray-500">{r.employeeId} · {r.designation}</p></td>
                    <td className="px-3 py-2 text-xs">{r.cycle}</td>
                    <td className="px-3 py-2 text-xs">{r.template}</td>
                    <td className="px-3 py-2"><Badge variant={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>{r.status}</Badge></td>
                    <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => { setOpen(r); setTab('overview'); }}>Open</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {open && (
        <div className="space-y-4">
          {open.scoresLocked && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Scores locked from previous submission.
              <Button size="xs" className="ml-2" variant="outline" onClick={() => { patch({ ...open, scoresLocked: false }); flash('Scores unlocked for revision. This is recorded in the audit trail.'); }}>Unlock Scores for Revision</Button>
            </div>
          )}
          <div className="flex flex-wrap gap-1 border-b bg-white">
            {TABS.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-4">
              <Card>
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">RK</div>
                  <div className="flex-1">
                    <p className="text-xl font-bold">{open.employee}</p>
                    <p className="text-sm text-gray-500">{open.department} · {open.designation} · Joined {open.joining} · {years(open.joining)} years · Last grade {open.lastGrade}</p>
                  </div>
                  <Badge variant={open.status === 'Approved' ? 'success' : 'warning'}>{open.status}</Badge>
                </div>
                <div className="grid gap-3 border-t p-5 md:grid-cols-3">
                  <Input label="Appraisal Cycle" value={open.cycle} readOnly />
                  <Input label="Appraisal Template" value={open.template} readOnly />
                  <Input label="Appraiser" value={open.appraiser} readOnly />
                  <Input label="Start Date" value={open.start} readOnly />
                  <Input label="End Date" value={open.end} readOnly />
                  <Select label="KRA method" value={open.kraMethod} onChange={(e) => patch({ ...open, kraMethod: (typeof e === 'string' ? e : e.target.value) as Appraisal['kraMethod'] })} options={[{ value: 'Automated', label: 'Automated based on goal progress' }, { value: 'Manual', label: 'Manual rating' }]} />
                </div>
              </Card>
              <div className="flex flex-wrap items-center justify-around gap-2 rounded-xl border bg-white p-4 text-center">
                {[{ l: 'Goal', v: goalScore(open) }, { l: 'Feedback', v: feedbackScore(open) }, { l: 'Self', v: selfScore(open) }, { l: 'Observation', v: obsScore(open) }].map((s) => (
                  <div key={s.l} className="rounded-full bg-indigo-50 px-4 py-2 text-sm"><span className="text-gray-500">{s.l}</span> <b>{s.v}/5</b></div>
                ))}
                <div className="text-2xl font-extrabold text-indigo-800">{finalScore(open)} / 5.0</div>
              </div>
            </div>
          )}

          {tab === 'kra' && (
            <Card>
              <div className="flex justify-between p-4 text-sm">
                <span>KRA evaluation · {open.kraMethod}</span>
                {open.kraMethod === 'Automated' && <Button size="sm" variant="outline" onClick={() => { patch({ ...open, lastRefresh: 'just now' }); flash('Goal scores refreshed from linked goals.'); }}>Refresh Goal Scores</Button>}
              </div>
              {open.kraMethod === 'Automated' && <p className="px-4 text-xs text-gray-500">Last refreshed: {open.lastRefresh}</p>}
              {below(open).length > 0 && <div className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{open.employee} has scored below minimum in {below(open).map((k) => k.name).join(', ')}. Final appraisal will be flagged.</div>}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                      {['KRA', 'Weight', 'Goals', 'Completion', 'Goal score', 'Min', 'Notes'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {open.kras.map((k) => (
                      <React.Fragment key={k.name}>
                        <tr className={`border-b ${(k.completion / 100) * 5 < k.min ? 'bg-red-50' : ''}`}>
                          <td className="px-2 py-2 font-medium">{k.name}</td>
                          <td className="px-2 py-2">{k.weight}%</td>
                          <td className="px-2 py-2"><button type="button" className="text-indigo-700" onClick={() => setExpand(expand === k.name ? null : k.name)}>{k.goals.length}</button></td>
                          <td className="px-2 py-2">
                            {open.kraMethod === 'Manual' && !open.scoresLocked
                              ? <input type="number" min={0} max={5} className="w-16 rounded border px-1 py-1" value={Math.round(k.completion / 20 * 10) / 10} onChange={(e) => {
                                const score5 = Number(e.target.value);
                                patch({ ...open, kras: open.kras.map((r) => r.name === k.name ? { ...r, completion: score5 * 20, score: Math.round(score5 * (k.weight / 100) * 5 * 10) / 10 } : r) });
                              }} />
                              : `${k.completion}%`}
                          </td>
                          <td className="px-2 py-2 font-semibold">{k.score}</td>
                          <td className="px-2 py-2">{k.min}</td>
                          <td className="px-2 py-2">{open.kraMethod === 'Manual' && <input className="w-full rounded border px-1 py-1 text-xs" placeholder={((k.completion / 100) * 5) < 3 ? 'Justification required' : 'Notes'} value={k.notes} onChange={(e) => patch({ ...open, kras: open.kras.map((r) => r.name === k.name ? { ...r, notes: e.target.value } : r) })} />}</td>
                        </tr>
                        {expand === k.name && k.goals.map((g) => (
                          <tr key={g.title} className="bg-gray-50 text-xs">
                            <td className="px-2 py-1 pl-6" colSpan={7}>{g.title} · {g.progress}% · {g.status} · {g.updated}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="px-4 pb-4 text-sm font-semibold">Total Goal Score: {goalScore(open)} / 5.0</p>
            </Card>
          )}

          {tab === 'feedback' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm">Average feedback score <b>{feedbackScore(open)}</b> · {open.feedback.length} feedbacks received</p>
                <Button size="sm" onClick={() => setFbOpen(true)}><Plus className="mr-1 h-4 w-4" />New Feedback</Button>
              </div>
              <p className="text-xs text-gray-500">Coverage: {['HOD', 'Peer', 'Principal'].map((t) => open.feedback.some((f) => f.type === t) ? `✓ ${t}` : `✗ ${t}`).join(' · ')} · ✗ Parent Representative</p>
              {open.feedback.map((f, i) => (
                <Card key={i}>
                  <div className="p-4 text-sm">
                    <div className="flex justify-between"><p className="font-semibold">{f.reviewer} · {f.designation}</p><span className="text-xs text-gray-500">{f.date}</span></div>
                    <p className="mt-1">Avg rating {f.rating} / 5</p>
                    <p className="mt-1 text-gray-600">{f.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {tab === 'self' && (
            <Card>
              {!open.selfDone && <div className="m-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">Employee has not completed self-appraisal. <Button size="xs" variant="outline" onClick={() => flash('Reminder sent to employee.')}>Send Reminder</Button></div>}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Criteria', 'Rating', 'Comments'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>
                    {open.self.map((r) => (
                      <tr key={r.criteria} className="border-b">
                        <td className="px-2 py-2">{r.criteria}</td>
                        <td className="px-2 py-2">{r.rating} / 5</td>
                        <td className="px-2 py-2 text-gray-600">{r.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="px-4 text-sm">Self score: {selfScore(open)} / 5.0</p>
              <p className="px-4 pb-4 text-sm text-gray-600">{open.reflection}</p>
            </Card>
          )}

          {tab === 'observation' && (
            <Card>
              <div className="flex justify-between p-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={open.cbseObs} onChange={(e) => patch({ ...open, cbseObs: e.target.checked })} /> CBSE observation format (COT)</label>
                <Button size="sm" onClick={() => setObsOpen(true)}>Add Observation</Button>
              </div>
              <div className="overflow-x-auto px-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-xs uppercase text-gray-500">{['Date', 'Observer', 'Subject', 'Topic', 'Score', 'Notes'].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
                  <tbody>
                    {open.observations.map((o, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-2 py-2">{o.date}</td><td className="px-2 py-2">{o.observer}</td><td className="px-2 py-2">{o.subject}</td><td className="px-2 py-2">{o.topic}</td><td className="px-2 py-2">{o.score}/10</td><td className="px-2 py-2 text-xs">{o.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="p-4 text-sm">Average observation (0–5): {obsScore(open)}</p>
            </Card>
          )}

          {tab === 'final' && (
            <Card>
              <div className="space-y-3 p-5 text-sm">
                {[
                  ['Goal Score', goalScore(open), 0.4],
                  ['Avg Feedback Score', feedbackScore(open), 0.35],
                  ['Self Score', selfScore(open), 0.15],
                  ['Observation Score', obsScore(open), 0.1]
                ].map(([l, v, w]) => (
                  <div key={String(l)} className="flex justify-between border-b py-1"><span>{l}</span><span>{v as number} × {w} = {Math.round((v as number) * (w as number) * 10) / 10}</span></div>
                ))}
                <p className="text-2xl font-bold">{finalScore(open)} / 5.0 <Badge variant="info">{grade(finalScore(open))}</Badge></p>
                {below(open).length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">Flagged: Below minimum score in {below(open)[0].name}. This employee is not eligible for increment despite overall grade.</div>}
                <Textarea label="Reviewer comments (mandatory before submit)" rows={3} value={open.reviewerComments} onChange={(e) => patch({ ...open, reviewerComments: e.target.value })} />
                <Textarea label="HR comments" rows={2} value={open.hrComments} onChange={(e) => patch({ ...open, hrComments: e.target.value })} />
                <p>Increment eligible: {below(open).length ? 'No' : 'Yes'} · Recommended increment: {below(open).length ? '0%' : '5%'} · Promotion recommended: No</p>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setOpen(null)}>Back</Button>
            <Button variant="outline" onClick={() => flash('Appraisal saved. Scores recalculated.')}>Save</Button>
            <Button onClick={() => { if (!open.reviewerComments) { flash('Reviewer comments are mandatory before submit.'); return; } patch({ ...open, status: 'Submitted' }); flash('Appraisal submitted. Document locked.'); }}>Submit</Button>
            {open.status === 'Submitted' && <Button onClick={() => { patch({ ...open, status: 'Approved' }); flash('Appraisal approved. Outcome tab can be processed.'); }}>Approve</Button>}
            {open.status === 'Submitted' && <Button variant="outline" onClick={() => setReturnOpen(true)}>Reject / Return</Button>}
            <Button variant="outline" onClick={() => flash('Formatted appraisal PDF generated.')}>Print</Button>
            {open.status === 'Approved' && <Button variant="outline" onClick={() => flash('Final summary emailed to employee.')}>Email to Employee</Button>}
          </div>
        </div>
      )}

      <Modal isOpen={fbOpen} onClose={() => setFbOpen(false)} title="New feedback" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setFbOpen(false)}>Cancel</Button><Button onClick={() => { if (!open) return; patch({ ...open, feedback: [...open.feedback, { reviewer: 'Current user', designation: 'HOD', date: '2026-10-31', rating: fbDraft.rating, text: fbDraft.text, type: 'HOD' }] }); setFbOpen(false); flash('Feedback submitted. Average feedback score updated.'); }}>Submit</Button></div>}>
        <Input label="Rating" type="number" value={String(fbDraft.rating)} onChange={(e) => setFbDraft({ ...fbDraft, rating: Number(e.target.value) })} />
        <Textarea label="Written feedback" className="mt-3" value={fbDraft.text} onChange={(e) => setFbDraft({ ...fbDraft, text: e.target.value })} />
      </Modal>
      <Modal isOpen={obsOpen} onClose={() => setObsOpen(false)} title="Add observation" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setObsOpen(false)}>Cancel</Button><Button onClick={() => { if (!open || !obsDraft.date || !obsDraft.observer) { flash('Date, observer and score are mandatory.'); return; } patch({ ...open, observations: [...open.observations, obsDraft] }); setObsOpen(false); }}>Save</Button></div>}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Date" type="date" value={obsDraft.date} onChange={(e) => setObsDraft({ ...obsDraft, date: e.target.value })} />
          <Input label="Observer" value={obsDraft.observer} onChange={(e) => setObsDraft({ ...obsDraft, observer: e.target.value })} />
          <Input label="Subject" value={obsDraft.subject} onChange={(e) => setObsDraft({ ...obsDraft, subject: e.target.value })} />
          <Input label="Topic" value={obsDraft.topic} onChange={(e) => setObsDraft({ ...obsDraft, topic: e.target.value })} />
          <Input label="Score (1–10)" type="number" value={String(obsDraft.score)} onChange={(e) => setObsDraft({ ...obsDraft, score: Number(e.target.value) })} />
          <Textarea label="Notes" className="md:col-span-2" value={obsDraft.notes} onChange={(e) => setObsDraft({ ...obsDraft, notes: e.target.value })} />
        </div>
      </Modal>
      <Modal isOpen={returnOpen} onClose={() => setReturnOpen(false)} title="Return for revision" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setReturnOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { if (!returnNote) { flash('Return notes are mandatory.'); return; } if (open) patch({ ...open, status: 'Rejected', scoresLocked: true }); setReturnOpen(false); flash('Returned to draft. Scores locked until Unlock Scores for Revision.'); }}>Return</Button></div>}>
        <Textarea label="Return notes" value={returnNote} onChange={(e) => setReturnNote(e.target.value)} />
      </Modal>
    </div>
  );
}

export default AppraisalIndividualForm;
