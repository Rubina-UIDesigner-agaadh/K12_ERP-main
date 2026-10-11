import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];
const COMBOS: Record<string, string[]> = {
  Science: ['PCM', 'PCB', 'PCMB'],
  Commerce: ['Commerce with Math', 'Commerce without Math'],
  Arts: ['Humanities', 'Humanities with Psychology'],
  Vocational: ['IT', 'Retail']
};

export function PreferenceSubmissionForm() {
  const [p1, setP1] = useState('Science');
  const [c1, setC1] = useState('PCM');
  const [p2, setP2] = useState('Commerce');
  const [c2, setC2] = useState('Commerce with Math');
  const [p3, setP3] = useState('Arts');
  const [c3, setC3] = useState('Humanities');
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = () => {
    if (!confirm) { setNotice('Please confirm preferences before submit.'); return; }
    if (new Set([p1, p2, p3]).size < 3) { setNotice('Preferences must be unique.'); return; }
    setNotice('Preferences submitted for APP-1001. You can edit until Round 1 freeze.');
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-3xl">
      <div>
        <p className="text-xs text-gray-500">Home → Submit Preferences</p>
        <h1 className="text-2xl font-bold mt-1">Preference Submission</h1>
        <p className="text-sm text-gray-500">Rank three eligible streams. Allotment uses this order.</p>
      </div>
      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-white rounded-xl border p-5 space-y-4">
        {([['1st Preference *', p1, setP1, c1, setC1], ['2nd Preference *', p2, setP2, c2, setC2], ['3rd Preference *', p3, setP3, c3, setC3]] as const).map(([label, stream, setStream, comb, setComb]) => (
          <div key={label} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">{label}</label>
              <select value={stream} onChange={(e) => { setStream(e.target.value); setComb(COMBOS[e.target.value][0]); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {STREAMS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Combination</label>
              <select value={comb} onChange={(e) => setComb(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {COMBOS[stream].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        ))}
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} /> I understand that allotment follows this order and freeze date.</label>
        <div className="flex gap-2">
          <Button onClick={submit}>Submit preferences</Button>
          <Button variant="outline" onClick={() => setNotice('Draft saved.')}>Save draft</Button>
        </div>
        <Badge variant="info">Window open until 18 Jun 2025 11:59 PM</Badge>
      </div>
    </div>
  );
}

export default PreferenceSubmissionForm;
