import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { Save, Plus, Trash2 } from 'lucide-react';

type Tab = 'needs' | 'event' | 'result' | 'skills';
type Need = { id: string; emp: string; skill: string; gap: string; priority: 'High' | 'Medium' | 'Low'; source: string; status: 'Open' | 'Scheduled' | 'Closed' };
type Event = { id: string; title: string; provider: string; from: string; to: string; hours: string; mode: string; attendees: string };
type Skill = { id: string; name: string; current: number; target: number; owner: string };

export function IdpTrainingNeedsEntry() {
  const [tab, setTab] = useState<Tab>('needs');
  const [notice, setNotice] = useState('');
  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };

  const [needs, setNeeds] = useState<Need[]>([
    { id: 'N-01', emp: 'Rahul Mehta', skill: 'Python for data analysis', gap: 'Cannot independently run lab datasets', priority: 'High', source: 'Appraisal FY 2026–27', status: 'Open' },
    { id: 'N-02', emp: 'Priya Nair', skill: 'Research writing (Scopus)', gap: 'One draft, no accepted paper', priority: 'Medium', source: 'Self IDP', status: 'Scheduled' }
  ]);
  const [needForm, setNeedForm] = useState({ emp: 'Rahul Mehta', skill: '', gap: '', priority: 'Medium' as Need['priority'] });

  const [events, setEvents] = useState<Event[]>([
    { id: 'E-01', title: 'FDP — Python for Educators', provider: 'NITTTR', from: '2026-12-08', to: '2026-12-12', hours: '30', mode: 'Offline', attendees: 'Rahul Mehta, Ananya Iyer' }
  ]);
  const [eventForm, setEventForm] = useState({ title: '', provider: '', from: '', to: '', hours: '', mode: 'Offline', attendees: '' });

  const [result, setResult] = useState({ event: 'E-01', score: '', feedback: '', impact: '', applied: false });

  const [skills, setSkills] = useState<Skill[]>([
    { id: 's1', name: 'Teaching pedagogy', current: 4, target: 5, owner: 'Priya Nair' },
    { id: 's2', name: 'Python / data labs', current: 2, target: 4, owner: 'Rahul Mehta' },
    { id: 's3', name: 'Research publication', current: 3, target: 4, owner: 'Priya Nair' }
  ]);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IDP / Training Needs</h1>
        <p className="text-sm text-gray-500">Capture development needs, schedule events, record results and maintain a skill map.</p>
      </div>
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="flex flex-wrap gap-2">
        {([{ id: 'needs', label: 'Training needs' }, { id: 'event', label: 'Training event' }, { id: 'result', label: 'Result / feedback / impact' }, { id: 'skills', label: 'Skill map' }] as const).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'needs' && (
        <>
          <Card title="Add need">
            <div className="grid gap-3 md:grid-cols-4">
              <Select label="Employee" value={needForm.emp} onChange={(e) => setNeedForm({ ...needForm, emp: typeof e === 'string' ? e : e.target.value })} options={['Priya Nair', 'Rahul Mehta', 'Ananya Iyer'].map((v) => ({ value: v, label: v }))} />
              <Input label="Skill / competency" value={needForm.skill} onChange={(e) => setNeedForm({ ...needForm, skill: e.target.value })} />
              <Select label="Priority" value={needForm.priority} onChange={(e) => setNeedForm({ ...needForm, priority: (typeof e === 'string' ? e : e.target.value) as Need['priority'] })} options={['High', 'Medium', 'Low'].map((v) => ({ value: v, label: v }))} />
              <Input label="Gap description" value={needForm.gap} onChange={(e) => setNeedForm({ ...needForm, gap: e.target.value })} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => {
                if (!needForm.skill.trim() || !needForm.gap.trim()) { flash('Skill and gap are required.'); return; }
                setNeeds((p) => [{ id: `N-${Date.now()}`, ...needForm, source: 'Manual', status: 'Open' }, ...p]);
                setNeedForm({ ...needForm, skill: '', gap: '' });
                flash('Training need added.');
              }}><Plus className="mr-1 h-4 w-4" />Add need</Button>
            </div>
          </Card>
          <Card title="Needs register">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['ID', 'Employee', 'Skill', 'Gap', 'Priority', 'Source', 'Status', ''].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {needs.map((n) => (
                  <tr key={n.id} className="border-b">
                    <td className="px-3 py-2 font-mono text-xs">{n.id}</td>
                    <td className="px-3 py-2">{n.emp}</td>
                    <td className="px-3 py-2">{n.skill}</td>
                    <td className="px-3 py-2 text-xs">{n.gap}</td>
                    <td className="px-3 py-2"><Badge variant={n.priority === 'High' ? 'danger' : n.priority === 'Medium' ? 'warning' : 'secondary'}>{n.priority}</Badge></td>
                    <td className="px-3 py-2 text-xs">{n.source}</td>
                    <td className="px-3 py-2">
                      <select value={n.status} onChange={(e) => setNeeds((p) => p.map((x) => x.id === n.id ? { ...x, status: e.target.value as Need['status'] } : x))} className="rounded border px-2 py-1 text-xs">
                        {['Open', 'Scheduled', 'Closed'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2"><button type="button" onClick={() => setNeeds((p) => p.filter((x) => x.id !== n.id))}><Trash2 className="h-4 w-4 text-gray-400" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'event' && (
        <>
          <Card title="Schedule training event">
            <div className="grid gap-3 md:grid-cols-3">
              <Input label="Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              <Input label="Provider" value={eventForm.provider} onChange={(e) => setEventForm({ ...eventForm, provider: e.target.value })} />
              <Select label="Mode" value={eventForm.mode} onChange={(e) => setEventForm({ ...eventForm, mode: typeof e === 'string' ? e : e.target.value })} options={['Offline', 'Online', 'Blended'].map((v) => ({ value: v, label: v }))} />
              <Input label="From" type="date" value={eventForm.from} onChange={(e) => setEventForm({ ...eventForm, from: e.target.value })} />
              <Input label="To" type="date" value={eventForm.to} onChange={(e) => setEventForm({ ...eventForm, to: e.target.value })} />
              <Input label="Hours" value={eventForm.hours} onChange={(e) => setEventForm({ ...eventForm, hours: e.target.value })} />
              <Input className="md:col-span-3" label="Attendees" value={eventForm.attendees} onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })} />
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => {
                if (!eventForm.title || !eventForm.from) { flash('Title and start date are required.'); return; }
                setEvents((p) => [{ id: `E-${Date.now()}`, ...eventForm }, ...p]);
                flash('Training event scheduled.');
              }}><Plus className="mr-1 h-4 w-4" />Add event</Button>
            </div>
          </Card>
          <Card title="Events">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['ID', 'Title', 'Provider', 'Dates', 'Hours', 'Mode', 'Attendees'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b">
                    <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                    <td className="px-3 py-2">{e.title}</td>
                    <td className="px-3 py-2">{e.provider}</td>
                    <td className="px-3 py-2 text-xs">{e.from} → {e.to}</td>
                    <td className="px-3 py-2">{e.hours}</td>
                    <td className="px-3 py-2">{e.mode}</td>
                    <td className="px-3 py-2 text-xs">{e.attendees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'result' && (
        <Card title="Result / feedback / impact">
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Event" value={result.event} onChange={(e) => setResult({ ...result, event: typeof e === 'string' ? e : e.target.value })} options={events.map((ev) => ({ value: ev.id, label: ev.title }))} />
            <Input label="Assessment score / grade" value={result.score} onChange={(e) => setResult({ ...result, score: e.target.value })} />
            <Textarea label="Participant feedback" rows={4} value={result.feedback} onChange={(e) => setResult({ ...result, feedback: e.target.value })} />
            <Textarea label="On-the-job impact" rows={4} value={result.impact} onChange={(e) => setResult({ ...result, impact: e.target.value })} />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={result.applied} onChange={(e) => setResult({ ...result, applied: e.target.checked })} />
            Learning applied on the job
          </label>
          <div className="mt-3 flex justify-end">
            <Button onClick={() => {
              if (!result.feedback.trim() || !result.impact.trim()) { flash('Feedback and impact are required.'); return; }
              flash('Training result recorded against the event.');
            }}><Save className="mr-1 h-4 w-4" />Save result</Button>
          </div>
        </Card>
      )}

      {tab === 'skills' && (
        <Card title="Skill map">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['Skill', 'Owner', 'Current (1–5)', 'Target (1–5)', 'Gap'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2">{s.owner}</td>
                  <td className="px-3 py-2">
                    <select value={s.current} onChange={(e) => setSkills((p) => p.map((x) => x.id === s.id ? { ...x, current: Number(e.target.value) } : x))} className="rounded border px-2 py-1">
                      {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={s.target} onChange={(e) => setSkills((p) => p.map((x) => x.id === s.id ? { ...x, target: Number(e.target.value) } : x))} className="rounded border px-2 py-1">
                      {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 font-semibold">{Math.max(s.target - s.current, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex justify-end">
            <Button onClick={() => flash('Skill map saved.')}><Save className="mr-1 h-4 w-4" />Save skill map</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default IdpTrainingNeedsEntry;
