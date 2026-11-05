import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Save, Send } from 'lucide-react';

type Kra = { id: string; title: string; weight: number; self: number; evidence: string; comment: string };

const KRAS: Kra[] = [
  { id: 'k1', title: 'Teaching effectiveness & student outcomes', weight: 30, self: 0, evidence: '', comment: '' },
  { id: 'k2', title: 'Research / publications', weight: 20, self: 0, evidence: '', comment: '' },
  { id: 'k3', title: 'Institutional contribution', weight: 20, self: 0, evidence: '', comment: '' },
  { id: 'k4', title: 'Student mentoring & outreach', weight: 15, self: 0, evidence: '', comment: '' },
  { id: 'k5', title: 'Professional development', weight: 15, self: 0, evidence: '', comment: '' }
];

export function SelfAppraisalEntry() {
  const [cycle, setCycle] = useState('FY 2026–27 Annual');
  const [kras, setKras] = useState<Kra[]>(KRAS);
  const [achievements, setAchievements] = useState('');
  const [constraints, setConstraints] = useState('');
  const [support, setSupport] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');
  const [notice, setNotice] = useState('');
  const weighted = useMemo(() => {
    const rated = kras.filter((k) => k.self > 0);
    if (!rated.length) return 0;
    return rated.reduce((s, k) => s + k.self * (k.weight / 100), 0);
  }, [kras]);
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Self Appraisal Entry</h1>
        <p className="text-sm text-gray-500">Rate your KRAs, attach evidence, and submit to your reporting manager.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <Card title="Cycle context">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Appraisal cycle" value={cycle} onChange={(e) => setCycle(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'FY 2026–27 Annual', label: 'FY 2026–27 Annual' }]} />
          <Input label="Employee" value="Priya Nair (EMP-2041)" disabled />
          <Input label="Designation" value="Assistant Professor" disabled />
          <Input label="Due date" value="2026-11-30" disabled />
        </div>
        <p className="mt-2 text-xs text-gray-500">Status: <Badge variant={status === 'Submitted' ? 'success' : 'secondary'}>{status}</Badge></p>
      </Card>

      <Card title="Self ratings">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['KRA', 'Weight', 'Self (1–5)', 'Evidence', 'Comment'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>
            {kras.map((k) => (
              <tr key={k.id} className="border-b align-top">
                <td className="px-3 py-2 font-medium">{k.title}</td>
                <td className="px-3 py-2">{k.weight}%</td>
                <td className="px-3 py-2">
                  <select value={k.self || ''} onChange={(e) => setKras((p) => p.map((x) => x.id === k.id ? { ...x, self: Number(e.target.value) } : x))} className="w-24 rounded-lg border px-2 py-1">
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2"><input value={k.evidence} onChange={(e) => setKras((p) => p.map((x) => x.id === k.id ? { ...x, evidence: e.target.value } : x))} className="w-full rounded-lg border px-2 py-1" placeholder="Link / document ref" /></td>
                <td className="px-3 py-2"><input value={k.comment} onChange={(e) => setKras((p) => p.map((x) => x.id === k.id ? { ...x, comment: e.target.value } : x))} className="w-full rounded-lg border px-2 py-1" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm font-semibold">Weighted self score: {weighted.toFixed(2)} / 5.00</p>
      </Card>

      <Card title="Narrative">
        <div className="grid gap-3 md:grid-cols-3">
          <Textarea label="Key achievements" rows={4} value={achievements} onChange={(e) => setAchievements(e.target.value)} />
          <Textarea label="Constraints faced" rows={4} value={constraints} onChange={(e) => setConstraints(e.target.value)} />
          <Textarea label="Support required next cycle" rows={4} value={support} onChange={(e) => setSupport(e.target.value)} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => { setStatus('Draft'); flash('Self-appraisal saved.'); }}><Save className="mr-1 h-4 w-4" />Save Draft</Button>
        <Button onClick={() => {
          if (kras.some((k) => !k.self || !k.evidence.trim())) { flash('Rate every KRA and add evidence before submitting.'); return; }
          setStatus('Submitted');
          flash('Self-appraisal submitted to reporting manager.');
        }}><Send className="mr-1 h-4 w-4" />Submit to manager</Button>
      </div>
    </div>
  );
}

export default SelfAppraisalEntry;
