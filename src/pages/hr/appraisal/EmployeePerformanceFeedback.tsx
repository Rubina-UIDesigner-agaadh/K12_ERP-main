import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Save, Send } from 'lucide-react';

type Dim = { id: string; label: string; score: number; comment: string };

const PEERS = [
  { id: 'EMP-2041', name: 'Priya Nair', designation: 'Assistant Professor', department: 'Computer Science' },
  { id: 'EMP-1882', name: 'Rahul Mehta', designation: 'Lecturer', department: 'Mathematics' },
  { id: 'EMP-2104', name: 'Ananya Iyer', designation: 'Lab Instructor', department: 'Physics' }
];

const DIMS: Dim[] = [
  { id: 'collab', label: 'Collaboration', score: 0, comment: '' },
  { id: 'comm', label: 'Communication', score: 0, comment: '' },
  { id: 'reliab', label: 'Reliability', score: 0, comment: '' },
  { id: 'init', label: 'Initiative', score: 0, comment: '' },
  { id: 'know', label: 'Subject knowledge', score: 0, comment: '' }
];

export function EmployeePerformanceFeedback() {
  const [cycle, setCycle] = useState('FY 2026–27 Annual');
  const [empId, setEmpId] = useState('EMP-2041');
  const [anon, setAnon] = useState(true);
  const [dims, setDims] = useState<Dim[]>(DIMS);
  const [overall, setOverall] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');
  const [notice, setNotice] = useState('');
  const emp = PEERS.find((p) => p.id === empId)!;
  const avg = dims.filter((d) => d.score).length ? (dims.reduce((s, d) => s + d.score, 0) / dims.filter((d) => d.score).length).toFixed(1) : '—';
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Peer Feedback</h1>
        <p className="text-sm text-gray-500">Capture confidential peer observations on collaboration, communication, reliability and initiative.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <Card title="Assignment">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Appraisal cycle" value={cycle} onChange={(e) => setCycle(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026–27 Annual', label: 'FY 2026–27 Annual' }]} />
          <Select label="Colleague" value={empId} onChange={(e) => setEmpId(typeof e === 'string' ? e : e.target.value)} options={PEERS.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          <Input label="Designation" value={emp.designation} disabled />
          <Input label="Department" value={emp.department} disabled />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
          Submit anonymously (name hidden from the employee)
        </label>
        <p className="mt-1 text-xs text-gray-500">Status: <Badge variant={status === 'Submitted' ? 'success' : 'secondary'}>{status}</Badge></p>
      </Card>

      <Card title="Dimension ratings (1–5)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Dimension', 'Score', 'Comment'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {dims.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="px-3 py-2 font-medium">{d.label}</td>
                  <td className="px-3 py-2">
                    <select value={d.score || ''} onChange={(e) => setDims((p) => p.map((x) => x.id === d.id ? { ...x, score: Number(e.target.value) } : x))} className="w-24 rounded-lg border px-2 py-1">
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2"><input value={d.comment} onChange={(e) => setDims((p) => p.map((x) => x.id === d.id ? { ...x, comment: e.target.value } : x))} className="w-full rounded-lg border px-2 py-1" placeholder="Optional comment" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-semibold">Average peer score: {avg}</p>
      </Card>

      <Card title="Overall observation">
        <Textarea rows={4} value={overall} onChange={(e) => setOverall(e.target.value)} placeholder="What should the manager know that ratings do not capture?" />
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setStatus('Draft'); flash('Peer feedback saved as draft.'); }}><Save className="mr-1 h-4 w-4" />Save Draft</Button>
        <Button onClick={() => {
          if (dims.some((d) => !d.score)) { flash('Score every dimension before submitting.'); return; }
          setStatus('Submitted');
          flash(anon ? 'Anonymous peer feedback submitted.' : 'Peer feedback submitted.');
        }}><Send className="mr-1 h-4 w-4" />Submit feedback</Button>
      </div>
    </div>
  );
}

export default EmployeePerformanceFeedback;
