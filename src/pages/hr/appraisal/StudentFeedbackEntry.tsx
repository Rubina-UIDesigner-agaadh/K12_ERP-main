import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Save, Send } from 'lucide-react';

type Item = { id: string; label: string; score: number };

const FACULTY = [
  { id: 'EMP-2041', name: 'Priya Nair', course: 'CS301 Data Structures', section: 'B.Tech CSE · A' },
  { id: 'EMP-1882', name: 'Rahul Mehta', course: 'MA201 Linear Algebra', section: 'B.Tech CSE · B' }
];

const ITEMS: Item[] = [
  { id: 'clarity', label: 'Clarity of explanation', score: 0 },
  { id: 'prep', label: 'Class preparation', score: 0 },
  { id: 'engage', label: 'Student engagement', score: 0 },
  { id: 'fair', label: 'Fairness in assessment', score: 0 },
  { id: 'avail', label: 'Availability for doubt clearing', score: 0 },
  { id: 'pace', label: 'Pace of teaching', score: 0 }
];

export function StudentFeedbackEntry() {
  const [cycle, setCycle] = useState('FY 2026–27 Mid-term');
  const [facultyId, setFacultyId] = useState('EMP-2041');
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [best, setBest] = useState('');
  const [improve, setImprove] = useState('');
  const [anon, setAnon] = useState(true);
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');
  const [notice, setNotice] = useState('');
  const faculty = FACULTY.find((f) => f.id === facultyId)!;
  const avg = items.filter((i) => i.score).length ? (items.reduce((s, i) => s + i.score, 0) / items.filter((i) => i.score).length).toFixed(1) : '—';
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Feedback Entry</h1>
        <p className="text-sm text-gray-500">Course-level student feedback used as an input to faculty appraisal. Separate from peer capture.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <Card title="Course & faculty">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Feedback window" value={cycle} onChange={(e) => setCycle(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026–27 Mid-term', label: 'FY 2026–27 Mid-term' }, { value: 'FY 2026–27 End-term', label: 'FY 2026–27 End-term' }]} />
          <Select label="Faculty" value={facultyId} onChange={(e) => setFacultyId(typeof e === 'string' ? e : e.target.value)} options={FACULTY.map((f) => ({ value: f.id, label: f.name }))} />
          <Input label="Course" value={faculty.course} disabled />
          <Input label="Class / section" value={faculty.section} disabled />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
          Keep my identity anonymous
        </label>
        <p className="mt-1 text-xs text-gray-500">Status: <Badge variant={status === 'Submitted' ? 'success' : 'secondary'}>{status}</Badge></p>
      </Card>

      <Card title="Teaching dimensions (1–5)">
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-sm text-gray-800">{item.label}</span>
              <select value={item.score || ''} onChange={(e) => setItems((p) => p.map((x) => x.id === item.id ? { ...x, score: Number(e.target.value) } : x))} className="w-24 rounded-lg border px-2 py-1 text-sm">
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold">Average: {avg}</p>
      </Card>

      <Card title="Comments">
        <div className="grid gap-3 md:grid-cols-2">
          <Textarea label="What went well" rows={4} value={best} onChange={(e) => setBest(e.target.value)} />
          <Textarea label="What could improve" rows={4} value={improve} onChange={(e) => setImprove(e.target.value)} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setStatus('Draft'); flash('Student feedback saved.'); }}><Save className="mr-1 h-4 w-4" />Save Draft</Button>
        <Button onClick={() => {
          if (items.some((i) => !i.score)) { flash('Rate every dimension.'); return; }
          setStatus('Submitted');
          flash('Student feedback submitted for this course.');
        }}><Send className="mr-1 h-4 w-4" />Submit</Button>
      </div>
    </div>
  );
}

export default StudentFeedbackEntry;
