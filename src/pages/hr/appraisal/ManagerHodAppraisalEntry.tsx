import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Save, Send, CheckCircle } from 'lucide-react';

type Kra = { id: string; title: string; weight: number; evidence: string; self: number; manager: number; comment: string };
type Reco = 'promote' | 'retain' | 'pip' | 'confirm' | 'extend';

const TEAM = [
  { id: 'EMP-2041', name: 'Priya Nair', designation: 'Assistant Professor', department: 'Computer Science', cycle: 'FY 2026–27 Annual', due: '2026-12-15', selfScore: 4.1 },
  { id: 'EMP-1882', name: 'Rahul Mehta', designation: 'Lecturer', department: 'Mathematics', cycle: 'FY 2026–27 Annual', due: '2026-12-15', selfScore: 3.6 },
  { id: 'EMP-2104', name: 'Ananya Iyer', designation: 'Lab Instructor', department: 'Physics', cycle: 'FY 2026–27 Annual', due: '2026-12-20', selfScore: 4.4 }
];

const KRAS: Kra[] = [
  { id: 'k1', title: 'Teaching effectiveness & student outcomes', weight: 30, evidence: 'Course feedback 4.4/5; 92% pass', self: 4.5, manager: 0, comment: '' },
  { id: 'k2', title: 'Research / publications', weight: 20, evidence: '1 Scopus paper submitted', self: 3.5, manager: 0, comment: '' },
  { id: 'k3', title: 'Institutional contribution', weight: 20, evidence: 'Exam committee + IQAC member', self: 4.0, manager: 0, comment: '' },
  { id: 'k4', title: 'Student mentoring & outreach', weight: 15, evidence: '18 mentees; 2 clubs', self: 4.2, manager: 0, comment: '' },
  { id: 'k5', title: 'Professional development', weight: 15, evidence: 'FDP completed Aug 2026', self: 4.0, manager: 0, comment: '' }
];

export function ManagerHodAppraisalEntry() {
  const [empId, setEmpId] = useState('EMP-2041');
  const [kras, setKras] = useState<Kra[]>(KRAS);
  const [strengths, setStrengths] = useState('');
  const [improve, setImprove] = useState('');
  const [overall, setOverall] = useState('');
  const [reco, setReco] = useState<Reco>('retain');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Submitted' | 'Acknowledged'>('Draft');

  const emp = TEAM.find((e) => e.id === empId)!;
  const weighted = useMemo(() => {
    const rated = kras.filter((k) => k.manager > 0);
    if (!rated.length) return 0;
    return rated.reduce((s, k) => s + k.manager * (k.weight / 100), 0);
  }, [kras]);
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager / HOD Appraisal Entry</h1>
        <p className="text-sm text-gray-500">Rate KRAs, add qualitative comments, and record a recommendation for the reporting employee.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <Card title="Employee context">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Employee" value={empId} onChange={(e) => setEmpId(typeof e === 'string' ? e : e.target.value)} options={TEAM.map((t) => ({ value: t.id, label: `${t.name} (${t.id})` }))} />
          <Input label="Designation" value={emp.designation} disabled />
          <Input label="Department" value={emp.department} disabled />
          <Input label="Appraisal cycle" value={emp.cycle} disabled />
          <Input label="Due date" value={emp.due} disabled />
          <Input label="Self-appraisal score" value={emp.selfScore.toFixed(1)} disabled />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <Badge variant={status === 'Acknowledged' ? 'success' : status === 'Submitted' ? 'info' : 'secondary'}>{status}</Badge>
          </div>
        </div>
      </Card>

      <Card title="KRA ratings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                {['KRA', 'Weight', 'Evidence', 'Self', 'Manager (1–5)', 'Comment'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {kras.map((k) => (
                <tr key={k.id} className="border-b align-top">
                  <td className="px-3 py-2 font-medium text-gray-900">{k.title}</td>
                  <td className="px-3 py-2">{k.weight}%</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{k.evidence}</td>
                  <td className="px-3 py-2">{k.self.toFixed(1)}</td>
                  <td className="px-3 py-2">
                    <select value={k.manager || ''} onChange={(e) => setKras((p) => p.map((x) => x.id === k.id ? { ...x, manager: Number(e.target.value) } : x))} className="w-24 rounded-lg border px-2 py-1 text-sm">
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={k.comment} onChange={(e) => setKras((p) => p.map((x) => x.id === k.id ? { ...x, comment: e.target.value } : x))} className="w-full rounded-lg border px-2 py-1 text-sm" placeholder="Manager comment" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-900">Weighted manager score: {weighted.toFixed(2)} / 5.00</p>
      </Card>

      <Card title="Qualitative assessment">
        <div className="grid gap-3 md:grid-cols-3">
          <Textarea label="Strengths" rows={4} value={strengths} onChange={(e) => setStrengths(e.target.value)} />
          <Textarea label="Areas of improvement" rows={4} value={improve} onChange={(e) => setImprove(e.target.value)} />
          <Textarea label="Overall comments" rows={4} value={overall} onChange={(e) => setOverall(e.target.value)} />
        </div>
      </Card>

      <Card title="Recommendation">
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'promote', label: 'Promote' },
            { id: 'retain', label: 'Retain' },
            { id: 'pip', label: 'PIP' },
            { id: 'confirm', label: 'Confirm' },
            { id: 'extend', label: 'Extend probation' }
          ] as const).map((r) => (
            <button key={r.id} type="button" onClick={() => setReco(r.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${reco === r.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{r.label}</button>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setStatus('Draft'); flash('Draft saved.'); }}><Save className="mr-1 h-4 w-4" />Save Draft</Button>
        <Button onClick={() => {
          if (kras.some((k) => !k.manager)) { flash('Rate every KRA before submitting.'); return; }
          setStatus('Submitted');
          flash('Appraisal submitted to HOD / reviewer.');
        }}><Send className="mr-1 h-4 w-4" />Submit to HOD</Button>
        <Button variant="outline" onClick={() => { setStatus('Acknowledged'); flash('Employee acknowledgement recorded.'); }}><CheckCircle className="mr-1 h-4 w-4" />Record acknowledgement</Button>
      </div>
    </div>
  );
}

export default ManagerHodAppraisalEntry;
